<?php

/**
 * This is the model class for table "traveler_title".
 *
 * The followings are the available columns in table 'traveler_title':
 * @property integer $id
 * @property string $name
 *
 * The followings are the available model relations:
 * @property Traveler[] $travelers
 */
class TravelerTitle extends CActiveRecord {

    const DEFAULT_TITLE = 1;    // Mr.
    const TITILE_INFANT = 5;    // Inf.

    static $titlesId = [1, 2, 3, 4];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'traveler_title';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'travelers' => array(self::HAS_MANY, 'Traveler', 'traveler_title_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Name',
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
        $criteria->compare('name', $this->name, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TravelerTitle the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Extract title from string delimited
     * @param string $str The input string
     * @return int
     */
    static function extractTitle($str) {
        if (!empty($str)) {
            $str = trim(strtoupper(str_replace('.', '', $str)));
            $titles = TravelerTitle::model()->findAll();
            /* @var $titles TravelerTitle[] */
            foreach ($titles as $title) {
//                echo trim(strtoupper(str_replace('.', '', $title->name)))." == ".strtoupper($name). PHP_EOL;
                if (trim(strtoupper(str_replace('.', '', $title->name))) == $str) {
                    return $title->id;
                }
            }
        }
        // Nothing found - return the Mr. title
        return self::DEFAULT_TITLE;
    }

    static function extractTitleFromNameEnd($str) {
        if (!empty($str)) {
            $str = strtoupper(str_replace('.', '', $str));
            $titles = TravelerTitle::model()->findAll();
            /* @var $titles TravelerTitle[] */
            foreach ($titles as $title) {
                $strTtitle = trim(strtoupper(str_replace('.', '', $title->name)));
                if ($strTtitle == substr($str, -strlen($strTtitle))) {
                    return $title->id;
                }
            }
        }
        // Nothing found - return the Mr. title
        return self::DEFAULT_TITLE;
    }

}
