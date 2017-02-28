<?php
/**
* Validator class file.
*
* @author c@cba <c@cba-solutions.org>
*/
abstract class Validator extends CValidator
{
	/**
	 * @var boolean whether all given attributes should be validated combined together (as in composite unique key).
	 * Note, by setting it to false, you are assuming that each attribute is validated separately, which is default behaviour.
	 * If set to true, the array $attributes is passed on to function validateAttribute(), 
	 * instead of each attribute separately (there is only one call to the function).
	 */
	public $enableCombinedValidation=false;
	public $attributes = array();
	
	/**
	 * Overriding the default validate() method of abstarct parent class CValidator.
	 * Validates the specified object.
	 * @param CModel $object the data object being validated
	 * @param array $attributes the list of attributes to be validated. Defaults to null,
	 * meaning every attribute listed in {@link attributes} will be validated.
	 */
	public function validate($object,$attributes=null)
	{
			if(is_array($attributes)) {
					$attributes=array_intersect($this->attributes,$attributes);
			}
			else
					$attributes=$this->attributes;
			if($this->enableCombinedValidation == true) {
				$this->validateAttribute($object,$attributes);
			}
			else {
				foreach($attributes as $attribute)
				{
						if(!$this->skipOnError || !$object->hasErrors($attribute))
								$this->validateAttribute($object,$attribute);
				}
			}
	}

}
?>