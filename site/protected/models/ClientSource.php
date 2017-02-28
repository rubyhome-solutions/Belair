<?php

/**
 * This is the model class for table "client_source".
 *
 * The followings are the available columns in table 'client_source':
 * @property integer $id
 * @property string $name
 * @property string $url
 * @property integer $is_active
 * @property string $username
 * @property string $password
 * @property string $officeid
 * @property string $component
 *
 * The followings are the available model relations:
 * @property CommercialRule[] $commercialRules
 * @property AirCart[] $airCarts
 */
class ClientSource extends CActiveRecord {

    const SOURCE_DIRECT = 1;
    const SOURCE_SKYSCANNER = 2;
    const SOURCE_KAYAK = 3;
    const SOURCE_IXIGO = 4;
    const SOURCE_WEGO = 5;
    const SOURCE_MOMONDO = 6;
    const SOURCE_FARECOMPARE = 7;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'client_source';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name, username, password, officeid,', 'required'),
            array('is_active', 'numerical', 'integerOnly' => true),
            array('url, component', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, url, is_active', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return [
            'commercialRules' => [self::HAS_MANY, 'CommercialRule', 'client_source_id'],
            'airCarts' => [self::HAS_MANY, 'AirCart', 'client_source_id'],
        ];
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'url' => 'Url',
            'is_active' => 'Active',
        ];
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

//        $criteria->compare('id', $this->id);
//        $criteria->compare('name', $this->name, true);
//        $criteria->compare('is_active', $this->is_active);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id']
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return ClientSource the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }
    
    /*
     * return client source id if user is clientSource(skyscanner , Ixigo) Type else false
     */
    public static function getCSUsingUserInfoName(){
        
        $user = \Users::model()->findByPk(\Yii::app()->user->id);
          if ($user->userInfo->user_type_id===\UserType::clientSource) {
              if($user->userInfo->name==='Skyscanner'){
                  return self::SOURCE_SKYSCANNER;
              }
              if($user->userInfo->name==='Ixigo'){
                  return self::SOURCE_IXIGO;
              }
//              if($user->userInfo->name==='Momondo'){
//                  return self::SOURCE_MOMONDO;
//              }
              if($user->userInfo->name==='FareCompare'){
                  return self::SOURCE_FARECOMPARE;
              }
          }
        return false;
    }

}
