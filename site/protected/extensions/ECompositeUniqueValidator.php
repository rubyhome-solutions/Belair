<?php
/**
* ECompositeUniqueValidator class file.
*
* @author c@cba <c@cba-solutions.org>
*/

/**
* ECompositeUniqueValidator validates that the composite key defined by the attributes is unique in the corresponding database table.
*
* If the property 
*
* When using the {@link message} property to define a custom error message, the message
* may contain additional placeholders that will be replaced with the actual content.
* ECompositeUniqueValidator allows for the following placeholders to be specified:
* <ul>
* <li>{attributes}: replaced with a comma separated list of the labels of the given attributes.</li>
* <li>{values}: replaced with a comma separated list of the current values of the given attributes.</li>
* <li>{value_"attr"}: replaced with the value of the given attribute named "attr", e.g. use {value_name} to get the value of the attribute 'name'.</li>
* </ul>
*
* @author c@cba <c@cba-solutions.org>
* @version 1.0 (2013-12-25)
*/
class ECompositeUniqueValidator extends Validator
{
		public $enableCombinedValidation = true;
		/**
		 * Komma separated list of attribute names to which the error message should be attached.
		 * If empty, the error message will be attached to the first of the given attributes.
		 */
		public $attributesToAddError;
        /**
         * @var boolean whether the comparison is case sensitive. Defaults to true.
         * Note, by setting it to false, you are assuming the attribute type is string.
         */
        public $caseSensitive=true;
        /**
         * @var boolean whether the attribute value can be null or empty. Defaults to true,
         * meaning that if the attribute is empty, it is considered valid.
         */
        public $allowEmpty=true;
        /**
         * @var string the ActiveRecord class name that should be used to
         * look for the attribute value being validated. Defaults to null, meaning using
         * the class of the object currently being validated.
         * You may use path alias to reference a class name here.
         * @see attributeName
         */
        public $className;
        /**
         * @var string the ActiveRecord class attribute name(s) that should be
         * used to look for the attribute(s) value being validated. Defaults to null,
         * meaning using the name of the attribute(s) being validated.
		 * Is an array of attribute name(s) that constitute the composite unique key.
         * @see className
         */
        public $attributeNames;
        /**
         * @var mixed additional query criteria. Either an array or CDbCriteria.
         * This will be combined with the condition that checks if the attribute
         * value exists in the corresponding table column.
         * This array will be used to instantiate a {@link CDbCriteria} object.
         */
        public $criteria=array();
        /**
         * @var string the user-defined error message. The placeholders "{attribute}" and "{value}"
         * are recognized, which will be replaced with the actual attribute name and value, respectively.
         */
        public $message;
        /**
         * @var boolean whether this validation rule should be skipped if when there is already a validation
         * error for the current attribute. Defaults to true.
         * @since 1.1.1
         */
        public $skipOnError=true;


        /**
         * Validates the attributes of the object.
		 * Since $enableCombinedValidation is set to true, all attributes will be passed on together in array $attributes
         * If there is any error, the error message is added to the object.
         * @param CModel $object the object being validated
         * @param array $attributes the attribute(s) being validated
         * @throws CException if given table does not have specified column name
         */
        protected function validateAttribute($object,$attributes)
        {
			if(is_string($attributes)) 
                $attributes = preg_split('/[\s,]+/',$attributes,-1,PREG_SPLIT_NO_EMPTY);
			if($this->attributeNames!==null && is_string($this->attributeNames)) 
                $this->attributeNames = preg_split('/[\s,]+/',$this->attributeNames,-1,PREG_SPLIT_NO_EMPTY);
				
		    $className=$this->className===null?get_class($object):Yii::import($this->className);
			$finder=$this->getModel($className);
			$table=$finder->getTableSchema();
			$attributeNames = $this->attributeNames===null ? $attributes : $this->attributeNames;
			
			if(!is_array($attributeNames))
			{
				throw new CException( t('"{attributeNames}" is not an array.',
							array('{attributeNames}'=>$attributeNames)) );
			}
			foreach($attributeNames as $attribute) {
				if(($columns[$attribute]=$table->getColumn($attribute))===null)
							throw new CException(Yii::t('yii','Table "{table}" does not have a column named "{column}".',
									array('{column}'=>$attribute,'{table}'=>$table->name)));
			}
			
			$allEmpty = true;
			foreach($attributeNames as $attribute) {
                $columnNames[$attribute]=$columns[$attribute]->rawName;
                $values[$attribute]=$object->$attribute;
				if(!empty($values[$attribute])) $allEmpty = false;
				if(is_array($values[$attribute]))
                {
                        // https://github.com/yiisoft/yii/issues/1955
                        $this->addError($object,$attribute,Yii::t('yii','{attribute} is invalid.'));
                        return;
                }
			}
               
			if($this->allowEmpty && $allEmpty)
					return;
			
			$criteria=new CDbCriteria();
			if($this->criteria!==array())
					$criteria->mergeWith($this->criteria);
			$tableAlias = empty($criteria->alias) ? $finder->getTableAlias(true) : $criteria->alias;
			foreach($attributeNames as $attribute) {
				$attributeLabels[$attribute] = $object->getAttributeLabel($attribute);
				$value = $values[$attribute];
				$columnName = $columnNames[$attribute];
				$valueParamName = CDbCriteria::PARAM_PREFIX.CDbCriteria::$paramCount++; // something like :ycp5 ==> parameter to be replaced by value
				$criteria->addCondition($this->caseSensitive ? "{$tableAlias}.{$columnName}={$valueParamName}" : "LOWER({$tableAlias}.{$columnName})=LOWER({$valueParamName})");
				$criteria->params[$valueParamName] = $value;
			}
			if(!$object instanceof CActiveRecord || $object->isNewRecord || $object->tableName()!==$finder->tableName()) {
					$exists=$finder->exists($criteria);
			}
			else
			{
					$criteria->limit=2;
					$objects=$finder->findAll($criteria);
					$n=count($objects);
					if($n===1)
					{
						// $columns contains the column for each given attribute in attribute=>column pairs.
						// check if those columns constitute a composite primary key.
						$pk_new = $object->getPrimaryKey(); 
						if(is_array($pk_new)) { 
							$pk_cols = sort(array_keys($pk_new));
							$given_cols = sort(array_values($columns));
							if($given_cols == $pk_cols) // primary key is modified and not unique
								$exists=$object->getOldPrimaryKey()!=$object->getPrimaryKey();
							else {
								// non-primary key, need to exclude the current record based on PK
								$exists=array_shift($objects)->getPrimaryKey()!=$object->getOldPrimaryKey();
							}
						}
						else
						{
							// non-primary key, need to exclude the current record based on PK
							$exists=array_shift($objects)->getPrimaryKey()!=$object->getOldPrimaryKey();
						}
					}
					else
							$exists=$n>1;
			}

			if($exists)
			{
				$att = join(',',$attributeLabels);
				$val = join(',', CHtml::encodeArray($values));
				$parameters = array('{attributes}'=>$att,'{values}'=>$val);
				foreach($values as $a => $v) $parameters['{value_'.$a.'}'] = $v;
				foreach($attributeLabels as $a => $v) $parameters['{attr_'.$a.'}'] = $v;
				$msg = Yii::t('ECompositeUniqueValidator', '{attributes} with "{values}" already exists.');
				$message = $this->message!==null ? $this->message : $msg;
				if($this->attributesToAddError === null) $this->addError($object,$attributeNames[0],$message,$parameters);
				else {
					$as = explode(',', $this->attributesToAddError);
					foreach($as as $ae ) $this->addError($object,$ae,$message,$parameters);
				}
			}
        }
        
        /**
         * Given active record class name returns new model instance.
         *
         * @param string $className active record class name.
         * @return CActiveRecord active record model instance.
         *
         * @since 1.1.14
         */
        protected function getModel($className)
        {
                return CActiveRecord::model($className);
        }
}