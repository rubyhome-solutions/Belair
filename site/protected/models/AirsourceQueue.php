<?php

/**
 * This is the model class for table "airsource_queue".
 *
 * The followings are the available columns in table 'airsource_queue':
 * @property integer $id
 * @property integer $queue_to
 * @property integer $air_source_id
 * @property integer $queue_number
 * @property integer $type_id
 * @property string $carriers
 * @property integer $auto_ticket
 *
 * The followings are the available model relations:
 * @property AirSource $airSource
 * @property AirSource $queueTo
 */
class AirsourceQueue extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'airsource_queue';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('queue_to, air_source_id', 'required'),
            array('queue_to, air_source_id, queue_number, type_id, auto_ticket', 'numerical', 'integerOnly' => true),
            array('carriers', 'safe'),
                // The following rule is used by search().
//            array('air_source_id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airSource' => array(self::BELONGS_TO, 'AirSource', 'air_source_id'),
            'queueTo' => array(self::BELONGS_TO, 'AirSource', 'queue_to'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'queue_to' => 'Queue To',
            'air_source_id' => 'Air Source',
            'queue_number' => 'Queue Number',
            'type_id' => 'Type',
            'carriers' => 'Carriers',
            'auto_ticket' => 'Auto Ticket',
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

        $criteria->compare('air_source_id', $this->air_source_id);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 'id']
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return AirsourceQueue the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Return array used to make booking via queueing
     * @param string $origin Origin airport 3 letter code
     * @param string $destination Destination airport 3 letter code
     * @param string $carrier Airline 2 letter code
     * @param int $airSourceId The air source id
     * @return boolean|array False if there is no match. Array with the destination airsource and other params
     */
    static function findQueue($origin, $destination, $carrier, $airSourceId) {
        $serviceType = \Airport::getServiceTypeIdFromCode($origin, $destination);
        $out = [];
        $airQueue = self::model()->findByAttributes([
            'air_source_id' => $airSourceId,
                ], [
            'condition' => '(type_id = :specific_type OR type_id = :both) AND carriers LIKE :carrier ',
            'params' => [
                ':specific_type' => $serviceType,
                ':both' => \AirSource::TYPE_BOTH,
                ':carrier' => "%{$carrier}%",
                ],
            'order' => 'id'
            ]);

        if ($airQueue === null) {
            $airQueue = self::model()->findByAttributes([
                'air_source_id' => $airSourceId,
                    ], [
                'condition' => '(type_id = :specific_type OR type_id = :both) AND carriers LIKE \'%**%\' ',
                'params' => [
                    ':both' => \AirSource::TYPE_BOTH,
                    ':specific_type' => $serviceType,
                    ],
                'order' => 'id',
                ]);
        }
        /* @var $airQueue AirsourceQueue */
        if ($airQueue) {
            // spare 2 is used in Galileo only - has to be redone to PCC/OID
//            $out['queueToPcc'] = $airQueue->queueTo->spare2;
            $out['queueToPcc'] = $airQueue->queueTo->profile_pcc;
            $out['queueToAirSourceId'] = $airQueue->queue_to;
            $out['queueNum'] = $airQueue->queue_number;
            $out['spare1'] = $airQueue->queueTo->spare1;
            $out['autoTicket'] = $airQueue->auto_ticket;
            $out['username'] = $airQueue->queueTo->username;
        }

        return $out;
    }

}
