<?php

/**
 * This is the model class for table "user_type".
 *
 * The followings are the available columns in table 'user_type':
 * @property integer $id
 * @property string $name
 * @property boolean $is_fixed
 * @property character $leading_char 
 *
 * The followings are the available model relations:
 * @property Users[] $users
 * @property Permission[] $permissions
 */
class UserType extends CActiveRecord {

    const superAdmin = 1;
    const frontlineStaff = 2;
    const agentDirect = 3;
    const distributor = 4;
    const agentUnderDistributor = 5;
    const corporateB2E = 6;
    const clientB2C = 7;
    const supervisorStaff = 8;
    const acountantStaff = 9;
    const pendingUnset = 10;
    const busyaccounting = 11;
    const clientSource = 12;
    const ticketRule = 13;

    static $B2B_USERS = [
        self::agentDirect,
        self::agentUnderDistributor,
        self::distributor,
    ];
    
    static $ALL_CLIENT_TYPES= [
        self::clientB2C => 'Client B2C',
        self::corporateB2E => 'Client B2E',
        self::agentDirect => 'Agent B2B',
        self::distributor => 'Distributor B2B',
        self::agentUnderDistributor => 'Agent under distributor B2B',
    ];
    
    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'user_type';
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
            array('name', 'length', 'max' => 50),
            array('is_fixed, leading_char', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, is_fixed', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'users' => array(self::HAS_MANY, 'Users', 'user_type_id'),
            'permissions' => array(self::MANY_MANY, 'Permission', 'permission_x_type(user_type_id, permission_id)'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Name',
            'is_fixed' => 'Is Fixed',
            'leading_char' => 'Leading letter'
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
        $criteria->compare('is_fixed', $this->is_fixed);
        $criteria->order = 'leading_char';

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return UserType the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
