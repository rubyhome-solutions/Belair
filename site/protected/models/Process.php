<?php

/**
 * This is the model class for table "process".
 *
 * The followings are the available columns in table 'process':
 * @property integer $id
 * @property integer $air_source_id
 * @property integer $search_id
 * @property string $queued
 * @property string $started
 * @property string $ended
 * @property integer $result
 * @property string $note
 * @property string $parameters
 * @property integer $pid
 * @property string $start_at
 * @property string $command
 * @property int $time_needed
 * @property int $memory
 * @property int $server_id
 *
 * The followings are the available model relations:
 * @property Searches $search
 * @property AirSource $airSource
 */
class Process extends CActiveRecord {

    const MAX_RUNNING_PROCESSES = 300;
    const MAX_DEBUG_RUNNING_PROCESSES = 30;
    const MAX_PROCESS_AGE = 15;     // In seconds
    const MAX_HANGED_TIME = 10;     // In minutes
    const RESULT_OK = 0;
    const RESULT_FAIL = 1;
    const RESULT_STOPPED = 2;
    const RESULT_ABANDON = 3;

    static $results = [
        self::RESULT_OK => 'OK',
        self::RESULT_FAIL => 'Fail',
        self::RESULT_STOPPED => 'Stopped',
        self::RESULT_ABANDON => 'Abandon',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'process';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('queued', 'required'),
            array('air_source_id, search_id, result, pid, server_id', 'numerical', 'integerOnly' => true),
            array('started, ended, note, parameters, start_at, command', 'safe'),
            // The following rule is used by search().
            array('id, air_source_id, result, note, search_id, server_id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'search' => array(self::BELONGS_TO, 'Searches', 'search_id'),
            'airSource' => array(self::BELONGS_TO, 'AirSource', 'air_source_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'air_source_id' => 'Air Source',
            'search_id' => 'Search',
            'queued' => 'Queued',
            'started' => 'Started',
            'ended' => 'Ended',
            'result' => 'Result',
            'note' => 'Note',
            'parameters' => 'Parameters',
            'pid' => 'Pid',
            'start_at' => 'Start At',
            'command' => 'Command',
            'time_needed' => 'Time needed'
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
        $criteria->compare('search_id', $this->search_id);
        $criteria->compare('result', $this->result);
        $criteria->compare('server_id', $this->server_id);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
            'pagination' => ['pageSize' => 20]
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Process the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    static function backgroundRun($cmd) {
        $log = new \application\components\Log();
        if (\Utils::isWindows()) {
            $cmd = '"' . Yii::app()->getBasePath() . '\brun.bat" ' . $cmd;
        } else {
//            $cmd = '/usr/bin/nohup /usr/bin/' . $cmd . ' &';
            $cmd = '/usr/bin/' . $cmd . ' >> ' . $log->logFile . ' 2>&1 &';
        }
//        pclose(popen($cmd, 'r'));
        $handle = popen($cmd, 'r');
        if ($handle === false) {
            throw new CHttpException("Can' start the command:<br>$cmd");
        }
        pclose($handle);
    }

    function getDelay() {
        $diff = strtotime($this->started) - strtotime($this->queued);
        if ($diff < 0) {
            $diff = 0;
        }
        return \Utils::convertSecToMinsSecs($diff);
    }

    function getResultTag() {
        switch (true) {
            case ($this->result === null): return "Not Set";
                break;
            case ($this->result === self::RESULT_OK):
                return '<span class="label label-success">OK</span>';
                break;
            case ($this->result === self::RESULT_FAIL):
                return '<span class="label label-important">Fail</span>';
                break;
            case ($this->result === self::RESULT_ABANDON):
                return '<span class="label label-important">Abandoned</span>';
                break;
            case ($this->result === self::RESULT_STOPPED):
                return '<span class="label label-important">Stoped</span>';
                break;
        }
    }

    /**
     * Mark the old processes as abandoned. Once the process is abandoned the queue broker is not running the process 
     * Mark the hanged processes as stoped. Once the process is stoped the queue broker is not running the process 
     */
    static function abandonOldProcesses($serverId=0) {
        // Abandon
        Yii::app()->db->createCommand()
                ->update('process', ['result' => self::RESULT_ABANDON], 
                        "result IS NULL AND start_at IS NULL AND started IS NULL AND queued + interval '" . self::MAX_PROCESS_AGE . " seconds'<'now' AND server_id={$serverId}"
        );
        // Stop
        Yii::app()->db->createCommand()
                ->update('process', ['result' => self::RESULT_STOPPED], 
                        "result IS NULL AND start_at IS NULL AND started + interval '" . self::MAX_HANGED_TIME . " minute'<'now' AND server_id={$serverId}"
        );
    }

}
