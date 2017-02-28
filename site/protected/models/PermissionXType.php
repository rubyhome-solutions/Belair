<?php

/**
 * This is the model class for table "permission_x_type".
 *
 * The followings are the available columns in table 'permission_x_type':
 * @property integer $permission_id
 * @property integer $user_type_id
 */
class PermissionXType extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'permission_x_type';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('permission_id, user_type_id', 'required'),
            array('permission_id, user_type_id', 'numerical', 'integerOnly' => true),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'permission_id' => 'Permission',
            'user_type_id' => 'User Type',
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

        $criteria->compare('permission_id', $this->permission_id);
        $criteria->compare('user_type_id', $this->user_type_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return PermissionXType the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
