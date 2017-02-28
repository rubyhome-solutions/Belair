<div class="form">
    <?php
    /* @var $this BookingController */
    /* @var $model BookingSearchForm */

    set_time_limit(90);
    $start_timer = microtime(true);

    $this->breadcrumbs = array(
        'Search' => array('index'),
        'Galileo test',
    );

    $param = toStdClass($model);
    $param->source = \Airport::getAirportCodeFromId($model->source);
    $param->destination = \Airport::getAirportCodeFromId($model->destination);

    $activeCompanyId = Utils::getActiveCompanyId();
    $airSourceId = application\components\Galileo\Utils::DEFAULT_GALILEO_TEST_ID;
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'amadeus-booking-form',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'enableClientValidation' => true,
    ));
    echo TbHtml::hiddenField('airSourceId', $airSourceId);
    if ($activeCompanyId) {
        // Prepare the travelers structure
        for ($i = 0; $i < $model->adults; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_ADULT;
            $travelers[] = $traveler;
        }
        for ($i = 0; $i < $model->children; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_CHILD;
            $travelers[] = $traveler;
        }
        for ($i = 0; $i < $model->infants; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_INFANT;
            $travelers[] = $traveler;
        }
        ?>
        <p class="well well-small alert-info">&nbsp;<i class="fa fa-credit-card fa-lg"></i>&nbsp;&nbsp;Payment details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(initially this and next forms are hidden)</p>
        <?php
        // Render the CC form
        $cc = new Cc;
        $cc->user_info_id = $activeCompanyId;
        $cc->number = '5499830000000015';
        $cc->code = 'CA';
        $cc->name = 'Orson Scott';
        $cc->exp_date = '1218';
        if (YII_DEBUG) {   // fill the treavelers and cc fake test data
            $travelers[0] = \Traveler::model()->findByPk(3);
//            $travelers[1] = \Traveler::model()->findByPk(4);
//            $travelers[2] = \Traveler::model()->findByPk(5);
//            $travelers[3] = \Traveler::model()->findByPk(79);
//            $travelers[3]->birthdate = '2014-01-20';
        }
        $this->renderPartial('/cc/_form', ['model' => $cc, 'form' => $form]);
        // Render the travelers
        $this->renderPartial('/airCart/_form_travelers', ['travelers' => $travelers]);
        echo "<p><b>NOTE: </b>Travelers validation is not done yet - mind your inputs!</p>";
    }
    // Testing case
    $testCaseFile = \Yii::app()->runtimePath . '/galileo_search_results.json';
//    $testCase = true;
    $testCase = false;
    if ($testCase) {
        $search = \Utils::fileToObject($testCaseFile, true);
    } else {
        $search = json_decode(\application\components\Galileo\Utils::search($airSourceId, $param), true);
        \Utils::objectToFile($testCaseFile, $search);
    }

    if (is_string($search)) {   // String here means error message
        die($search);
        \Utils::finalMessage($search);
    }
// Check for errors
    if (empty($search)) {
        Utils::finalMessage('Empty results');
    }
    ?>
    <p class="well well-small alert-info">&nbsp;<i class="fa fa-search fa-lg"></i>&nbsp;&nbsp;Galileo test search results</p>
    <?php
    $this->renderPartial('cacheRowsForTest', [
        'rows' => $search,
        'activeCompanyId' => $activeCompanyId,
        'airSourceId' => $airSourceId,
    ]);
    $this->endWidget();
    print "<pre>\nGalileo test suite results delivered in: " . round((microtime(true) - $start_timer), 2) . " sec. Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . "MB\n</pre>";


    /**
     * 
     * @param any $obj
     * @return \stdClass
     */
    function toStdClass($obj) {
        $out = new \stdClass;
        foreach ($obj as $property => $value) {
            $out->$property = $value;
//            unset($obj->$property);
        }
        return $out;
    }
    ?>
</div>
