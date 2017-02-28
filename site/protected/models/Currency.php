<?php

/**
 * This is the model class for table "currency".
 *
 * The followings are the available columns in table 'currency':
 * @property integer $id
 * @property string $code
 * @property string $name
 * @property string $sign
 * @property double $rate
 * @property string $updated
 *
 * The followings are the available model relations:
 * @property Payment[] $payments
 * @property UserInfo[] $userInfos
 */
class Currency extends CActiveRecord {

    const INR_ID = 1;
    const USD_ID = 2;
    const DEFAULT_COMMISSION = 1.01;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'currency';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
// NOTE: you should only define rules for those attributes that
// will receive user inputs.
        return array(
            array('code', 'required'),
            array('code', 'length', 'max' => 3),
            array('rate', 'numerical'),
            array('sign, name', 'safe'),
            // The following rule is used by search().
// @todo Please remove those attributes that should not be searched.
            array('id, code, name, sign', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
// NOTE: you may need to adjust the relation name and the related
// class name for the relations automatically generated below.
        return array(
            'payments' => array(self::HAS_MANY, 'Payment', 'currency_id'),
            'userInfos' => array(self::HAS_MANY, 'UserInfo', 'currency_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'code' => 'Code',
            'name' => 'Name',
            'sign' => 'Sign',
            'rate' => 'Rate',
            'updated' => 'Updated'
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
        $criteria->compare('code', $this->code, true);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 'id'],
            'pagination' => ['pageSize' => 20]
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Currency the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getSign_Name() {
        return $this->sign . '&nbsp;' . $this->name;
    }

    /**
     * Convert specific amount of money to new currency
     * @param double $amount
     * @param int $toCurrencyId
     * @return double or false in case of error
     */
    function xChange($amount, $toCurrencyId = self::USD_ID) {
        $toCurrency = $this->findByPk($toCurrencyId);
        // No such currency
        if ($toCurrency === null) {
            return false;
        }
        // Same currency case
        if ($toCurrency->id == $this->id) {
            return $amount;
        }
        // Calculate the exchange rate commission
        $activeCompanyId = \Utils::getActiveCompanyId();
        if ($activeCompanyId) {
            $userInfo = \UserInfo::model()->findByPk($activeCompanyId);
            $commission = 1 + $userInfo->xrate_commission/100;
        } else {
            $commission = self::DEFAULT_COMMISSION;
        }
        // Exchange rate age (up to 300 minutes) check
        if (time() - strtotime($this->updated) > 18000) {
            $xrate = new \XRate;
            $xrate->refreshData();
            $this->refresh();
            $toCurrency->refresh();
        }
        return round($amount * $toCurrency->rate / $this->rate * $commission, 2);
    }

    function getCodeAndName() {
        return "($this->code) $this->name";
    }

    /**
     * Convert specific amount of money to new currency
     * @param double $amount
     * @param int $toCurrencyId
     * @return double or false in case of error
     */
    function xChangeWithoutCommision($amount, $toCurrencyId = self::USD_ID) {
        $toCurrency = $this->findByPk($toCurrencyId);
        // No such currency
        if ($toCurrency === null) {
            return false;
        }
        // Same currency case
        if ($toCurrency->id == $this->id) {
            return $amount;
        }
        
        // Exchange rate age (up to 300 minutes) check
        if (time() - strtotime($this->updated) > 18000) {
            $xrate = new \XRate;
            $xrate->refreshData();
            $this->refresh();
            $toCurrency->refresh();
        }
        return round($amount * $toCurrency->rate / $this->rate , 2);
    }
}
