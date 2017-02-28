<?php

/**
 * This is the model class for table "log_operation".
 *
 * The followings are the available columns in table 'log_operation':
 * @property integer $id
 * @property string $name
 * @property string $table_name
 * @property string $id_filed_name
 * @property string $value_field_name
 * @property boolean $is_reversible
 *
 * The followings are the available model relations:
 * @property LogModel[] $logs
 */
class LogOperation extends CActiveRecord {

    const COMPANY_EMAIL_CHANGE = 1;
    const COMPANY_MOBILE_CHANGE = 2;
    const USER_EMAIL_CHANGE = 3;
    const USER_MOBILE_CHANGE = 4;
    const BALANCE_CHANGE = 5;
    const MISSING_AIRLINE = 6;
    const MISSING_AIRPORT = 7;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'log_operation';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            array('name', 'unique'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'logs' => array(self::HAS_MANY, 'LogModel', 'operation_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Operation Name',
            'table_name' => 'Table Name',
            'id_filed_name' => 'Id Filed Name',
            'value_field_name' => 'Value Field Name',
            'is_reversible' => 'Is Reversible',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search() {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('table_name', $this->table_name, true);
        $criteria->compare('id_filed_name', $this->id_filed_name, true);
        $criteria->compare('value_field_name', $this->value_field_name, true);
        $criteria->compare('is_reversible', $this->is_reversible);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return LogOperation the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
