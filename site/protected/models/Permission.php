<?php

/**
 * This is the model class for table "permission".
 *
 * The followings are the available columns in table 'permission':
 * @property integer $id
 * @property string $name
 * @property integer $staff_only
 *
 * The followings are the available model relations:
 * @property Users[] $users
 * @property UserType[] $userTypes
 */
class Permission extends CActiveRecord {

    const CAN_MAKE_BOOKINGS = 1;
    const MANAGE_ALL_CARTS = 2;
    const VIEW_ACCOUNTS = 3;
    const VIEW_ALL_AMENDMENTS = 4;
    const VIEW_SALES_REPORTS = 5;
    const MANAGE_TRAVELLERS = 6;
    const MANAGE_COLLEAGUES = 7;
    const MANAGE_COMPANY_INFO = 8;
    const MANAGE_MARKUPS = 9;
    const EMULATE = 10;
    const MANAGE_COMMERCIALS = 11;
    const MANAGE_SOURCES_BOOKING_WORK_FLOW = 12;
    const MANAGE_STAFF = 13;
    const VIEW_ACCOUNTING_XML = 14;
    const CAN_LOGIN_OUT_OF_OFFICE = 15;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'permission';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            array('staff_only', 'numerical', 'integerOnly' => true),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'users' => array(self::MANY_MANY, 'Users', 'permission_x_user(permission_id, user_id)'),
            'userTypes' => array(self::MANY_MANY, 'UserType', 'permission_x_type(permission_id, user_type_id)'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Name',
            'staff_only' => 'Staff Only',
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
        $criteria->compare('staff_only', $this->staff_only);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Permission the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
