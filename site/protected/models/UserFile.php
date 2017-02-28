<?php

/**
 * This is the model class for table "user_file".
 *
 * The followings are the available columns in table 'user_file':
 * @property integer $id
 * @property integer $user_info_id
 * @property integer $doc_type_id
 * @property string $url
 * @property string $path
 * @property string $name
 * @property string $created
 * @property boolean $user_visible
 *
 * The followings are the available model relations:
 * @property UserInfo $userInfo
 * @property DocType $docType
 */
class UserFile extends CActiveRecord {

    static $acceptedFileExtensions = array(
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.pdf',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.txt',
    );

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'user_file';
    }

    /**
     * @return string the storage directory
     */
    static function storageDirectory() {
        if (PHP_OS == 'Linux')
            return '/belair/files/company/';
        else
            return 'e:/tmp/belair/files/company/';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('user_info_id, doc_type_id, path, name', 'required'),
            array('user_info_id, doc_type_id', 'numerical', 'integerOnly' => true),
            array('user_visible, doc_type_id', 'safe'),
            array('user_visible', 'default', 'setOnEmpty' => true, 'value' => 1),
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
            'docType' => array(self::BELONGS_TO, 'DocType', 'doc_type_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'user_info_id' => 'User Info',
            'doc_type_id' => 'Doc Type',
            'url' => 'Url',
            'path' => 'Path',
            'name' => 'Filename',
            'created' => 'Created',
            'user_visible' => 'User Visible',
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

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return UserFile the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
