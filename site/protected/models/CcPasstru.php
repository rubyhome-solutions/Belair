<?php

/**
 * This is the model class for table "cc_passtru".
 *
 * The followings are the available columns in table 'cc_passtru':
 * @property integer $id
 * @property integer $carrier_id
 * @property integer $cc_id
 * @property integer $user_info_id
 * @property integer $scope
 *
 * The followings are the available model relations:
 * @property UserInfo $userInfo
 * @property Cc $cc
 * @property Carrier $carrier
 */
class CcPasstru extends CActiveRecord {

    const SCOPE_SINGLE_CLIENT = 1;
    const SCOPE_B2C = 2;
    const SCOPE_B2B = 3;
    const SCOPE_B2E = 4;
    const SCOPE_ALL = 5;

    static $scopeIdToName = [
        self::SCOPE_SINGLE_CLIENT => 'Client passthru',
        self::SCOPE_B2C => 'All B2C root passthru',
        self::SCOPE_B2B => 'All B2B root passthru',
        self::SCOPE_B2E => 'All B2E root passthru',
        self::SCOPE_ALL => 'All clients root passthru',
    ];
    static $userTypeToScopeId = [
        UserType::clientB2C => self::SCOPE_B2C,
        UserType::agentDirect => self::SCOPE_B2B,
        UserType::agentUnderDistributor => self::SCOPE_B2B,
        UserType::distributor => self::SCOPE_B2B,
        UserType::corporateB2E => self::SCOPE_B2E,
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'cc_passtru';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        return array(
            array('carrier_id, cc_id', 'required'),
            array('carrier_id, cc_id, user_info_id, scope', 'numerical', 'integerOnly' => true),
            array('carrier_id, cc_id, user_info_id, scope', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'userInfo' => array(self::BELONGS_TO, 'UserInfo', 'user_info_id'),
            'cc' => array(self::BELONGS_TO, 'Cc', 'cc_id'),
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'carrier_id' => 'Airline',
            'cc_id' => 'Card',
            'user_info_id' => 'Client',
            'scope' => 'Scope',
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
        $criteria->with = ['userInfo', 'carrier', 'cc'];

        $criteria->compare('carrier_id', $this->carrier_id);
        $criteria->compare('cc_id', $this->cc_id);
        $criteria->compare('t.user_info_id', $this->user_info_id);
        $criteria->compare('scope', $this->scope);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CcPasstru the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
