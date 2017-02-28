<?php

/**
 * This is the model class for table "airsource_rule".
 *
 * The followings are the available columns in table 'airsource_rule':
 * @property integer $id
 * @property string $air_source_ids
 * @property string $filter
 * @property integer $order_
 */
class AirsourceRule extends CActiveRecord {

    const MAX_ELEMENTS_ON_PAGE = 10;
    const AS_IDS_SEPARATOR = '|';

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'airsource_rule';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('air_source_ids', 'required'),
            array('order_, id', 'numerical', 'integerOnly' => true),
            array('filter', 'safe'),
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
            'id' => 'ID',
            'air_source_ids' => 'Air Source Ids',
            'filter' => 'Filter',
            'order_' => 'Order',
        );
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return AirsourceRule the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Group list Air Sources IDs (array to string) ready for saving
     * @param array $param
     * @return string
     */
    static function groupIds($param = []) {
        if (empty($param)) {
            return [];
        }
        return self::AS_IDS_SEPARATOR . implode(self::AS_IDS_SEPARATOR, $param) . self::AS_IDS_SEPARATOR;
    }

    /**
     * Ungroup list Air Sources IDs (string to array)
     * @param string $param
     * @return array
     */
    static function unGroupIds($param) {
        return explode(self::AS_IDS_SEPARATOR, trim($param, self::AS_IDS_SEPARATOR));
    }

    /**
     * Match the rule agains given Search object
     * @param \Searches $s The Search class object
     * @return boolean TRUE if the rule should be applyed to this RouteCache object
     */
    function matchSearch(\Searches $s) {
        // Filter check
        $filter = new \AirSourceFilter($this->filter);
        if ($filter->exclude->matchSearchExclude($s)) {
            return false;
        }
        if (!$filter->include->matchSearchInclude($s)) {
            return false;
        }

        return true;
    }

    /**
     * Return array of active air source IDs for the rule
     * @return array
     */
    function getActiveAirSourceIds() {
        $out = [];
        $ids = self::unGroupIds($this->air_source_ids);
        if (!empty($ids)) {
            $airSources = \AirSource::model()->findAllBySql('SELECT id FROM air_source WHERE is_active=1 AND id in (' . implode(',', $ids) . ')');
            foreach ($airSources as $airSource) {
                $out[] = $airSource->id;
            }
        }

        return $out;
    }

    /**
     * Return array of active air sources for the rule
     * @return \AirSource[] 
     */
    function getActiveAirSources() {
        $ids = self::unGroupIds($this->air_source_ids);
        if (!empty($ids)) {
            return \AirSource::model()->cache(600)->with('backend')->findAll('t.is_active=1 AND t.id in (' . implode(',', $ids) . ')');
        }

        return [];
    }

}
