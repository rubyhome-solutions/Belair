<?php

/**
 * This is the model class for table "tour_code".
 *
 * The followings are the available columns in table 'tour_code':
 * @property integer $id
 * @property integer $air_source_id
 * @property integer $user_info_id
 * @property integer $carrier_id
 * @property string $code
 * @property integer $scope
 *
 * The followings are the available model relations:
 * @property UserInfo $userInfo
 * @property Carrier $carrier
 * @property AirSource $airSource
 */
class TourCode extends CActiveRecord {

    const SCOPE_SINGLE_CLIENT = 1;
    const SCOPE_B2C = 2;
    const SCOPE_B2B = 3;
    const SCOPE_B2E = 4;
    const SCOPE_ALL = 5;

    static $scopeIdToName = [
        self::SCOPE_SINGLE_CLIENT => 'Single client',
        self::SCOPE_B2C => 'All B2C clients',
        self::SCOPE_B2B => 'All B2B clients',
        self::SCOPE_B2E => 'All B2E clients',
        self::SCOPE_ALL => 'All clients',
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
        return 'tour_code';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        return [
            ['air_source_id, carrier_id, code', 'required'],
            ['air_source_id, user_info_id, carrier_id, scope', 'numerical', 'integerOnly' => true],
            ['air_source_id, user_info_id, carrier_id, code, scope', 'safe', 'on' => 'search'],
        ];
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return [
            'userInfo' => [self::BELONGS_TO, 'UserInfo', 'user_info_id'],
            'carrier' => [self::BELONGS_TO, 'Carrier', 'carrier_id'],
            'airSource' => [self::BELONGS_TO, 'AirSource', 'air_source_id'],
        ];
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'air_source_id' => 'Air Source',
            'user_info_id' => 'Client',
            'carrier_id' => 'Carrier',
            'code' => 'Tour Code',
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
        $criteria->with = ['userInfo', 'carrier', 'airSource'];

        $criteria->compare('air_source_id', $this->air_source_id);
        $criteria->compare('user_info_id', $this->user_info_id);
        $criteria->compare('carrier_id', $this->carrier_id);
        $criteria->compare('t.code', $this->code, true);
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
     * @return TourCode the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
