<?php

/**
 * This is the model class for table "aircart_file".
 *
 * The followings are the available columns in table 'aircart_file':
 * @property integer $id
 * @property integer $aircart_id
 * @property string $note
 * @property string $path
 * @property string $name
 * @property string $created
 *
 * The followings are the available model relations:
 * @property AirCart $aircart
 */
class AircartFile extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'aircart_file';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('aircart_id, path', 'required'),
            array('aircart_id', 'numerical', 'integerOnly' => true),
            array('note, name', 'safe'),
                // The following rule is used by search().
                // @todo Please remove those attributes that should not be searched.
//            array('id, aircart_id, note, path, name, created', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'aircart' => array(self::BELONGS_TO, 'AirCart', 'aircart_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'aircart_id' => 'Aircart',
            'note' => 'Note',
            'path' => 'Path',
            'name' => 'Name',
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

        $criteria->compare('id', $this->id);
        $criteria->compare('aircart_id', $this->aircart_id);
        $criteria->compare('note', $this->note, true);
        $criteria->compare('path', $this->path, true);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('created', $this->created, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return AircartFile the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * @return string the storage directory
     */
    static function storageDirectory() {
        if (PHP_OS == 'Linux')
            $dir = '/belair/files/aircart';
        else
            $dir = 'e:/tmp/belair/files/aircart';
        if (!is_dir($dir)) {
            mkdir($dir, null, true);
        }

        return $dir . '/';
    }

}
