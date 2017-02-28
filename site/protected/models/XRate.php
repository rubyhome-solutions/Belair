<?php

/**
 * This is the model class for table "x_rate".
 *
 * The followings are the available columns in table 'x_rate':
 * @property string $updated
 * @property string $content
 */
class XRate extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'x_rate';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        return [
            ['updated, content', 'required']
        ];
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        return [];
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'updated' => 'Updated',
            'content' => 'Content',
        );
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return XRate the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Refresh the exchange rates data
     * @return boolean False on error
     */
    function refreshDataOld() {
        $data = file_get_contents('http://jsonrates.com/convert/?base=USD&apiKey=jr-ff453894c3d8dbb42ed68144f69a3c96&amount=1');
        if ($data === false) {
            return false;
        }
        $info = json_decode($data);
        if ($info === null) {
            return false;
        }
        $this->deleteAll();
        $this->content = $data;
        $this->updated = $info->utctime;
        $this->insert();
        $currencies = \Currency::model()->findAll();
        foreach ($currencies as $currency) {
            /* @var $currency \Currency */
            if (isset($info->amounts->{$currency->code})) {
                $currency->rate = $info->amounts->{$currency->code};
                $currency->updated = date(DATETIME_FORMAT);
                $currency->update(['rate', 'updated']);
            }
        }
        return true;
    }

    function refreshDataOld2() {
        // diable this method for the moment:
        $this->updateAll(['updated' => date(DATETIME_FORMAT)]);
        $this->attributes = self::model()->find()->attributes;
        return true;

        $data = file_get_contents('http://www.apilayer.net/api/live?access_key=c8d4feddefaa5ff33fb3b74405a91f0f');
        if ($data === false) {
            return false;
        }
        $info = json_decode($data);
        if ($info === null) {
            return false;
        }
        $this->deleteAll();
        $this->content = $data;
        $this->updated = date(DATETIME_FORMAT, $info->timestamp);
        $this->insert();
        $currencies = \Currency::model()->findAll();
        foreach ($currencies as $currency) {
            /* @var $currency \Currency */
            $code = 'USD' . $currency->code;
            if (isset($info->quotes->$code)) {
                $currency->rate = $info->quotes->$code;
                $currency->updated = date(DATETIME_FORMAT);
                $currency->update(['rate', 'updated']);
            }
        }
        return true;
    }

    /**
     * Refresh the exchange rates data
     * @return boolean False on error
     */
    function refreshData() {
        $data = @file_get_contents('http://api.fixer.io/latest?base=USD');
        if ($data === false) {
            return false;
        }
        $info = json_decode($data);
        if ($info === null) {
            return false;
        }
        $this->deleteAll();
        $this->content = $data;
        $this->updated = "'now'";
        $this->insert();
        $currencies = \Currency::model()->findAll();
        foreach ($currencies as $currency) {
            /* @var $currency \Currency */
            $code = $currency->code;
            if (isset($info->rates->$code)) {
                $currency->rate = $info->rates->$code;
                $currency->updated = date(DATETIME_FORMAT);
                $currency->update(['rate', 'updated']);
            }
        }
        return true;
    }

}
