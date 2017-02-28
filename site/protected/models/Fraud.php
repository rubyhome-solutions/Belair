<?php

/**
 * This is the model class for table "fraud".
 *
 * The followings are the available columns in table 'fraud':
 * @property integer $id
 * @property integer $pay_gate_log_id
 * @property integer $cc_id
 * @property string $ip
 * @property string $email
 * @property string $phone
 * @property string $created
 *
 * The followings are the available model relations:
 * @property Cc $cc
 * @property PayGateLog $payGateLog
 */
class Fraud extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'fraud';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('pay_gate_log_id, cc_id', 'numerical', 'integerOnly' => true),
            array('ip, email, phone', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, pay_gate_log_id, cc_id, ip, email, phone, created', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'cc' => array(self::BELONGS_TO, 'Cc', 'cc_id'),
            'payGateLog' => array(self::BELONGS_TO, 'PayGateLog', 'pay_gate_log_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'pay_gate_log_id' => 'Transaction',
            'cc_id' => 'Card',
            'ip' => 'IP',
            'email' => 'Email',
            'phone' => 'Phone',
            'created' => 'Created',
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

        $criteria->compare('pay_gate_log_id', $this->pay_gate_log_id);
        $criteria->compare('cc_id', $this->cc_id);
        $criteria->compare('ip', $this->ip, true);
        $criteria->compare('email', $this->email, true);
        $criteria->compare('phone', $this->phone, true);
//        $criteria->compare('created', $this->created);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC']
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Fraud the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Check if the transaction is clear from Fraud and can proceed
     * @param int $ccId    The ID of the CC object used inthe transaction
     * @param string $ip  User IP
     * @param string $mobile Mobile number of the user
     * @param string $email Email of the user
     * @return boolean True if the transaction is fraud clear
     */
    static function fraudClearance($ccId = null, $ip = null, $mobile = null, $email = null) {
        return true;    // Bypass this check
        
        $criteria = new CDbCriteria;
        if ($ccId !== null) {
            $criteria->compare('cc_id', $ccId, false, 'OR');
        }
        if ($ip !== null) {
            $criteria->compare('ip', $ip, false, 'OR');
        }
        if ($mobile !== null) {
            $criteria->compare('phone', $mobile, false, 'OR');
        }
        if ($email !== null) {
            $criteria->compare('email', $email, false, 'OR');
        }
        if (!empty($criteria->condition)) {
            return self::model()->find($criteria) === null;
        }
//        print_r($criteria);
        return true;    // All clear
    }

}
