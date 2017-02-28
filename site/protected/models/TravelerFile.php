<?php

/**
 * This is the model class for table "traveler_file".
 *
 * The followings are the available columns in table 'traveler_file':
 * @property integer $id
 * @property integer $traveler_id
 * @property integer $doc_type_id
 * @property string $url
 * @property string $path
 * @property string $name
 * @property string $created
 * @property boolean $user_visible
 *
 * The followings are the available model relations:
 * @property Traveler $traveler
 * @property DocType $docType
 */
class TravelerFile extends CActiveRecord {
    static $acceptedFileExtensions = array(
        '.jpg',
        '.png',
        '.gif',
        '.bmp',
        '.pdf',
        '.doc',
        '.docx',
    );

    /**
     * @return string the storage directory
     */
    static function storageDirectory() {
        if (PHP_OS == 'Linux')
            return '/belair/files/traveler/';
        else
            return 'e:/tmp/belair/files/traveler/';
    }


    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'traveler_file';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('traveler_id, doc_type_id, path, name', 'required'),
            array('traveler_id, doc_type_id', 'numerical', 'integerOnly' => true),
            array('user_visible', 'safe'),
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
            'traveler' => array(self::BELONGS_TO, 'Traveler', 'traveler_id'),
            'docType' => array(self::BELONGS_TO, 'DocType', 'doc_type_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'traveler_id' => 'Traveler',
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
        $criteria->compare('traveler_id', $this->traveler_id);
        $criteria->compare('doc_type_id', $this->doc_type_id);
        $criteria->compare('url', $this->url, true);
        $criteria->compare('path', $this->path, true);
        $criteria->compare('note', $this->note, true);
        $criteria->compare('created', $this->created, true);
        $criteria->compare('user_visible', $this->user_visible);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TravelerFile the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
