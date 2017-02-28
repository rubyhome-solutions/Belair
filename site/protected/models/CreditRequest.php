<?php

/**
 * This is the model class for table "credit_request".
 *
 * The followings are the available columns in table 'credit_request':
 * @property integer $id
 * @property integer $approver_id
 * @property integer $creator_id
 * @property integer $amount
 * @property string $use_date
 * @property string $payback_date
 * @property string $reason
 * @property string $html
 * @property integer $status_id
 *
 * The followings are the available model relations:
 * @property Users $creator
 * @property Users $approver
 */
class CreditRequest extends CActiveRecord {

    const STATUS_NEW = 1;
    const STATUS_APPROVED = 2;
    const STATUS_REJECTED = 3;

    static $status = [
        self::STATUS_NEW => 'New',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_REJECTED => 'Rejected',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'credit_request';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        return array(
            array('creator_id, amount, use_date, payback_date, reason', 'required'),
            array('amount', 'numerical', 'integerOnly' => true),
//            array('html', 'safe'),
            array('use_date, payback_date', 'match', 'pattern' => '#^201[4-9]-\d{2}-\d{2}$#'),
            array('reason', 'length', 'min' => 10),
            // The following rule is used by search().
            array('creator_id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'creator' => array(self::BELONGS_TO, 'Users', 'creator_id'),
            'approver' => array(self::BELONGS_TO, 'Users', 'approver_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'approver_id' => 'Approver',
            'creator_id' => 'Client',
            'amount' => 'Amount',
            'use_date' => 'Use Date',
            'payback_date' => 'Payback Date',
            'reason' => 'Reason',
            'html' => 'Note',
            'status_id' => 'Status',
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

        $criteria->compare('creator_id', $this->creator_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 'id DESC']
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CreditRequest the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    function statusBadge() {
        switch ($this->status_id) {
            case self::STATUS_NEW :
                $class = 'info';
                break;
            case self::STATUS_APPROVED :
                $class = 'success';
                break;
            case self::STATUS_REJECTED :
                $class = 'important';
                break;
        }
        return "<span style=\"font-family: sans-serif;font-size:1.1em;\" class=\"badge badge-{$class}\">" . self::$status[$this->status_id] . "</span>";
    }

}
