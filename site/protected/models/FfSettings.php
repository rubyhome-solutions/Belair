<?php

/**
 * This is the model class for table "ff_settings".
 *
 * The followings are the available columns in table 'ff_settings':
 * @property integer $ff_carriers_id
 * @property integer $traveler_id
 * @property string $code
 * 
 * @property FfCarriers $carrier
 */
class FfSettings extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'ff_settings';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('ff_carriers_id, traveler_id, code', 'required'),
            array('ff_carriers_id, traveler_id', 'numerical', 'integerOnly' => true),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('ff_carriers_id, traveler_id, code', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'carrier' => array(self::BELONGS_TO, 'FfCarriers', 'ff_carriers_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'ff_carriers_id' => 'Ff Carriers',
            'traveler_id' => 'Traveler',
            'code' => 'Code',
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

        $criteria->compare('ff_carriers_id', $this->ff_carriers_id);
        $criteria->compare('traveler_id', $this->traveler_id);
        $criteria->compare('code', $this->code, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return FfSettings the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * 
     * @param int $travelerId The ID of the traveler
     * @param string $airline_code The 2 letter airline code
     * @param string $code The frequen flyer number
     * @return bool True on success
     */
    public static function insertIfMissing($travelerId, $airline_code, $code) {
        $ffCarrier = FfCarriers::model()->findByAttributes(['carrier_code' => $airline_code]);
        if (!$ffCarrier) {
            // FfCarrier is not present
            $airline = Carrier::model()->findByAttributes(['airline_code' => $airline_code]);
            if (!$airline) {
                return false;    // Exit if the requested airline can not be found
            }
            // Create new FFcarrier program, using the Carrier name as progamm name
            $ffCarrier = new FfCarriers;
            $ffCarrier->carrier_id = $airline->id;
            $ffCarrier->name = $airline->name;
            $ffCarrier->carrier_code = $airline->code;
            $ffCarrier->insert();
        }
        if (FfSettings::model()->findByAttributes([
                    'traveler_id' => $travelerId,
                    'ff_carriers_id' => $ffCarrier->id,
                    'code' => $code,
                ])) {
            return true;    // The data is already present, no need to insert it again
        }
        // Insert the new record
        $model = new FfSettings;
        $model->traveler_id = $travelerId;
        $model->code = $code;
        $model->ff_carriers_id = $ffCarrier->id;
        $model->insert();
        return true;
    }

}
