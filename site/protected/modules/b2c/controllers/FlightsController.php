<?php

namespace b2c\controllers;

use b2c\components\B2cException;
use b2c\components\ControllerExceptionable;
use b2c\components\FlightsSearch;
use b2c\components\FlightsSearchManager;
use b2c\models\FlightsManagerForm;

class FlightsController extends \Controller {

    use ControllerExceptionable;

    public function actionIndex() {
        return $this->actionSearch();
    }

    public function actionSearch() {
        if (\Yii::app()->request->isAjaxRequest) {

            if (!empty($_POST)) {
                \Utils::jsonResponse(
                        FlightsSearchManager::create($_POST)->searchJson()
                );
            }

            if (!empty($_GET['query'])) {
                $cs = isset($_GET['cs']) ? (int) $_GET['cs'] : \ClientSource::SOURCE_DIRECT;
                if (!\ClientSource::model()->findByPk($cs)) {
                    $cs = \ClientSource::SOURCE_DIRECT;
                }


                \Utils::jsonResponse(
                        FlightsSearchManager::parse($_GET['query'], isset($_GET['force']) ? (bool) $_GET['force'] : false, $cs)->searchJson()
                );
            }

            if (isset($_GET['options'], $_GET['ids'], $_GET['updated'])) {
                \Utils::jsonResponse(
                        FlightsSearchManager::factory($_GET['options'], $_GET['ids'])->progressJson($_GET['updated'])
                );
                return;
            }

            \Utils::jsonResponse(['message' => 'Incorrect request'], 400);
        }

        if ($this->isMobile()) {
            $this->layout = '//layouts/mobile';
            $this->render('//common/mobilejs', ['bundle' => 'flights']);
        } else {
            $this->render('//common/js', ['bundle' => 'flights']);
        }
    }

    public function actionMeta() {
        $meta = new \stdClass;

        $meta->titles = [];
        // titles id array
        $titles_id = \TravelerTitle::$titlesId;
        foreach (\TravelerTitle::model()->cache(3600)->findAllByAttributes(['id' => $titles_id], ['order' => 'id']) as $i) {
            $meta->titles[] = $i->attributes;
        }

        $meta->cabinTypes = [];
        foreach (\CabinType::model()->findAll() as $i) {
            $meta->cabinTypes[] = $i->attributes;
        }

        $meta->countries = [];
        foreach (\Country::model()->findAll() as $i) {
            $meta->countries[] = $i->attributes;
        }

        $meta->travelerTypes = \TravelerType::$typeToStr;

        if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);

            $meta->user = ['email' => $user->email, 'mobile' => $user->mobile, 'name' => $user->name];
        }


        $inr = \Currency::model()->findByPk(\Currency::INR_ID);
        $meta->xChange = [];
        $meta->display_currency = 'INR';
        foreach (\Currency::model()->findAll(['order' => 'id']) as $currency) {
            $meta->xChange[$currency->code] = $inr->xChange(1000, $currency->id) / 1000;
        }
        $meta->domestic = [];
        if ($this->isMobile()) {
            $from = self::getAirports("from");
            $to = self::getAirports("to");
            if (!empty($from) && !empty($to)) {
                $meta->from = $from;
                $meta->to = $to;
            }
        } else {
            $meta->domestic = $this->_getDomestic();
        }
        $activeCompanyId = \Utils::getActiveCompanyId();
        if (empty($activeCompanyId)) {
            if (strstr(\Yii::app()->request->serverName, 'airtickets')) {
                $meta->terms = \Cms::getContent(\Cms::CMS_TERMS, \UserInfo::ATI_B2C_USER_INFO_ID);
            } else {
                $meta->terms = \Cms::getContent(\Cms::CMS_TERMS, \UserInfo::B2C_USER_INFO_ID);
            }
        } else {
            $meta->terms = \Cms::getContent(\Cms::CMS_TERMS, $activeCompanyId);
        }

        \Utils::jsonResponse($meta);
    }

    public function actionAirport($id) {
        $airport = \Airport::model()->findByPk($id);

        \Utils::jsonResponse([
            'id' => $airport->id,
            'text' => $airport->city_name . ', ' . $airport->country_code . ' (' . $airport->airport_code . ')',
            'code' => $airport->airport_code,
            'city' => $airport->city_name . ', ' . $airport->country_code
        ]);
    }

    public function _getDomestic($country_code = 'IN') {
        $orderBy = '
	    	case when airport_code = \'DEL\' 	then 0	end ASC,
	    	case when airport_code = \'BOM\' 	then 1	end ASC,
	    	case when airport_code = \'BLR\' 	then 2	end ASC,
	    	case when airport_code = \'GOI\' 	then 3	end ASC,
	    	case when airport_code = \'MAA\' 	then 4	end ASC,
	    	case when airport_code = \'HYD\' 	then 5	end ASC,
	    	case when airport_code = \'CCU\' 	then 6	end ASC,
	    	case when airport_code = \'PNQ\' 	then 7	end ASC,
	    	airport_code ASC
    	';

        $airport_codes = ['KWI', 'XMB', 'XNB', 'DXB', 'MCT', 'CMB', 'RML', 'KTM', 'SIN', 'QPG', 'XSP', 'BKK', 'DMK', 'ZVJ', 'DHF', 'AUH', 'AZI'];
        $airports = \Airport::model()->findAll(array(
            'select' => 'id, city_code, city_name, airport_code',
            'condition' => 'country_code=\'' . $country_code . '\' OR airport_code IN (\'' . implode("','", $airport_codes) . '\')',
            'order' => $orderBy
        ));

        $out = [];
        foreach ($airports as $i) {
            $out[] = $i->attributes;
        }

        return $out;
    }

    private function getAirports($x) {
        $airports = $data = [];

        if ($x == 'from') {
            $airports = ['DEL', 'GOI', 'BOM', 'BLR', 'CCU', 'HYD', 'MAA', 'AMD', 'PNQ', 'COK', 'DXB', 'BKK'];
        }
        if ($x == 'to') {
            $airports = ['BOM', 'DEL', 'GOI', 'BLR', 'CCU', 'HYD', 'DXB', 'LHR', 'BKK', 'NYC', 'YYZ', 'SIN'];
        }
        foreach ($airports as $airport) {
            $data[] = \Yii::app()->db->createCommand()->select("id,city_code,city_name,airport_type,airport_name,airport_code,country_code")->from("airport")->where('airport_code=:abc', array(':abc' => $airport))->queryRow();
        }
        return $data;
    }

}
