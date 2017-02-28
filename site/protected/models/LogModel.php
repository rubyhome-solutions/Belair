<?php

/**
 * This is the model class for table "log".
 *
 * The followings are the available columns in table 'log':
 * @property integer $id 
 * @property integer $user_id The id of the user
 * @property integer $operation_id
 * @property string $created
 * @property string $old_value
 * @property string $new_value
 * @property integer $id_value
 *
 * The followings are the available model relations:
 * @property Users $user_
 * @property LogOperation $operation
 */
class LogModel extends CActiveRecord {

    public $userEmail;
    public $userName;
    public $companyName;

//    public $operationName;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'log';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('user_id, operation_id', 'required'),
            array('user_id, operation_id, id_value', 'numerical', 'integerOnly' => true),
            array('created, old_value, new_value, userEmail, userName, companyName', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'user_' => array(self::BELONGS_TO, 'Users', 'user_id'),
            'operation' => array(self::BELONGS_TO, 'LogOperation', 'operation_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'user_id' => 'User',
            'operation_id' => 'Operation',
            'created' => 'Created',
            'old_value' => 'Old Value',
            'new_value' => 'New Value',
            'id_value' => 'Id Value',
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
        $criteria->together = true;
        $criteria->with = array(
            'user_.userInfo' => array(
                'select' => 'user_.email, user_.name, "userInfo".name',
                'together' => true,
                'joinType' => 'INNER JOIN'
            ),
            'operation' => array(
                'select' => 'operation.name',
                'together' => true,
                'joinType' => 'INNER JOIN'
            ),
        );
//        $criteria->select = new CDbExpression ('id');
        $criteria->compare('id', $this->id);
        $criteria->compare('LOWER(user_.email)', strtolower($this->userEmail), true);
        $criteria->compare('LOWER(user_.name)', strtolower($this->userName), true);
        $criteria->compare('LOWER("userInfo".name)', strtolower($this->companyName), true);
//        $criteria->compare('t.created', $this->created);
        $criteria->compare('operation_id', $this->operation_id);
        $criteria->compare('LOWER(old_value)', strtolower($this->old_value), true);
        $criteria->compare('LOWER(new_value)', strtolower($this->new_value), true);
        if ($this->created != null) {
            $criteria->addCondition("t.created>=:searchDate");
            $criteria->addCondition("t.created<:searchDate + interval '1 day'");
            $criteria->params += array('searchDate' => date('Y-m-d 00:00:00', strtotime($this->created)));
        }
        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => array(
                'defaultOrder' => array(
                    'created' => CSort::SORT_DESC
                ),
            )
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return LogModel the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Save the action in the log table
     * @param int $actionId Id of the action to be logged
     * @param int $idValue Value of the ID from the table that keep the info about the changed object - used for UNDO
     * @param string $oldValue The old value
     * @param string $newValue The new value
     */
    public static function logAction($actionId, $idValue = null, $oldValue = null, $newValue = null) {
        $log = new \LogModel;
        $log->operation_id = $actionId;
        $log->old_value = $oldValue;
        $log->new_value = $newValue;
        $log->id_value = $idValue;
        $log->user_id = Utils::getLoggedUserId();
        $log->save();
    }

}
