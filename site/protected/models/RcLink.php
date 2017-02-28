<?php

/**
 * This is the model class for table "rc_link".
 *
 * The followings are the available columns in table 'rc_link':
 * @property integer $from
 * @property integer $to
 *
 * The followings are the available model relations:
 * @property RoutesCache $rcFrom
 * @property RoutesCache $rcTo
 */
class RcLink extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'rc_link';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return [
            ['from, to', 'required'],
            ['from, to', 'numerical', 'integerOnly' => true],
        ];
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return [
            'rcFrom' => [self::BELONGS_TO, 'RoutesCache', 'from'],
            'rcTo' => [self::BELONGS_TO, 'RoutesCache', 'to'],
        ];
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return [
            'from' => 'From',
            'to' => 'To',
        ];
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return RcLink the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
