<?php

/**
 * This is the model class for table "preferences".
 *
 * The followings are the available columns in table 'preferences':
 * @property integer $id
 * @property integer $traveler_id
 * @property integer $int_seat_id
 * @property integer $int_meal_id
 * @property string $department
 * @property string $designation
 * @property string $cost_center
 * @property string $emp_code
 *
 * The followings are the available model relations:
 * @property Traveler $traveler
 * @property MealList $intMeal
 * @property SeatList $intSeat
 */
class Preferences extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'preferences';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('traveler_id', 'required'),
            array('traveler_id, int_seat_id, int_meal_id', 'numerical', 'integerOnly' => true),
            array('department, designation, cost_center, emp_code', 'safe'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'traveler' => array(self::BELONGS_TO, 'Traveler', 'traveler_id'),
            'intMeal' => array(self::BELONGS_TO, 'MealList', 'int_meal_id'),
            'intSeat' => array(self::BELONGS_TO, 'SeatList', 'int_seat_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'traveler_id' => 'Traveler',
            'int_seat_id' => 'Seat',
            'int_meal_id' => 'Meal',
            'department' => 'Department',
            'designation' => 'Designation',
            'cost_center' => 'Cost center',
            'emp_code' => 'Employee code',
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
        $criteria->compare('traveler_id', $this->traveler_id);
        $criteria->compare('int_carrier_id', $this->int_carrier_id);
        $criteria->compare('int_seat_id', $this->int_seat_id);
        $criteria->compare('int_meal_id', $this->int_meal_id);
        $criteria->compare('domestic_carrier_id', $this->domestic_carrier_id);
        $criteria->compare('domestic_seat_id', $this->domestic_seat_id);
        $criteria->compare('domestic_meal_id', $this->domestic_meal_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Preferences the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
