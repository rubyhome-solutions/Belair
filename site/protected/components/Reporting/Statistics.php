<?php

namespace application\components\Reporting;

class Statistics {

    const AVAILABILITY_AND_FARE_CHECKS_ALL = 'AVAILABILITY_AND_FARE_CHECKS_ALL';
    const AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE = 'AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE';
    const AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED = 'AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED';
    const AVAILABILITY_AND_FARE_RESET_TIME = 'AVAILABILITY_AND_FARE_RESET_TIME';
    const CLEAR_FARE_CHECK_STATS = 1;
    const CLEAR_DEEPLINK_RESPONSE_TIME_STATS = 2;
    const DEEPLINK_TOTAL_RESPONSES = 'DEEPLINK_TOTAL_RESPONSES';
    const DEEPLINK_TIME_SUMMARY = 'DEEPLINK_TIME_SUMMARY';
    const DEEPLINK_TIME_MINIMUM = 'DEEPLINK_TIME_MINIMUM';
    const DEEPLINK_TIME_MAXIMUM = 'DEEPLINK_TIME_MAXIMUM';
    const DEEPLINK_RESET_TIME = 'DEEPLINK_RESET_TIME';
    const DEEPLINK_SLOW_COUNT = 'DEEPLINK_SLOW_COUNT';
    const DEEPLINK_SLOW_SEARCH_ID = 'DEEPLINK_SLOW_SEARCH_ID';

    /**
     * Count the availability and fare check
     */
    static function addAvailabilityAndFareCheck() {
        self::increaseCacheVariable(self::AVAILABILITY_AND_FARE_CHECKS_ALL);
    }

    static function getAvailabilityAndFareCheckCount() {
        return (int) \Yii::app()->cache->get(self::AVAILABILITY_AND_FARE_CHECKS_ALL);
    }

    /**
     * Increase the flight unavailble counter
     */
    static function addAvailabilityAndFareCheckUnavailable() {
        self::increaseCacheVariable(self::AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE);
    }

    static function getAvailabilityAndFareCheckUnavailableCount() {
        return (int) \Yii::app()->cache->get(self::AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE);
    }

    /**
     * Increase the fare changed counter
     */
    static function addAvailabilityAndFareCheckFareChanged() {
        self::increaseCacheVariable(self::AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED);
    }

    static function getAvailabilityAndFareCheckFareChangedCount() {
        return (int) \Yii::app()->cache->get(self::AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED);
    }

    static function increaseCacheVariable($varName, $increase = 1) {
        $value = \Yii::app()->cache->get($varName) ? : 0;
        $value += $increase;
        \Yii::app()->cache->set($varName, $value);
    }

    static function test() {
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_ALL count: ' . self::getAvailabilityAndFareCheckCount());
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_ALL count again: ' . self::getAvailabilityAndFareCheckCount());
        for ($i = 0; $i < 100; $i++) {
            self::addAvailabilityAndFareCheck();
        }
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_ALL count after 100 increase: ' . self::getAvailabilityAndFareCheckCount());
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_ALL count again: ' . self::getAvailabilityAndFareCheckCount());

        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE count: ' . self::getAvailabilityAndFareCheckUnavailableCount());
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE count again: ' . self::getAvailabilityAndFareCheckUnavailableCount());
        self::addAvailabilityAndFareCheckUnavailable();
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE count after increase: ' . self::getAvailabilityAndFareCheckUnavailableCount());
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE count again: ' . self::getAvailabilityAndFareCheckUnavailableCount());

        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED count: ' . self::getAvailabilityAndFareCheckFareChangedCount());
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED count again: ' . self::getAvailabilityAndFareCheckFareChangedCount());
        self::addAvailabilityAndFareCheckFareChanged();
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED count after increase: ' . self::getAvailabilityAndFareCheckFareChangedCount());
        echo \Utils::dbg('Current AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED count again: ' . self::getAvailabilityAndFareCheckFareChangedCount());
    }

    static function resetStat($id) {
        switch ($id) {
            case self::CLEAR_FARE_CHECK_STATS:
                \Yii::app()->cache->set(self::AVAILABILITY_AND_FARE_CHECKS_ALL, 0);
                \Yii::app()->cache->set(self::AVAILABILITY_AND_FARE_CHECKS_FARE_CHANGED, 0);
                \Yii::app()->cache->set(self::AVAILABILITY_AND_FARE_CHECKS_UNAVAILABLE, 0);
                \Yii::app()->cache->set(self::AVAILABILITY_AND_FARE_RESET_TIME, date(DATETIME_FORMAT));
                break;

            case self::CLEAR_DEEPLINK_RESPONSE_TIME_STATS:
                foreach (\ClientSource::model()->findAll() as $cs) {
                    \Yii::app()->cache->delete(self::DEEPLINK_TIME_MAXIMUM . ':' . $cs->id);
                    \Yii::app()->cache->delete(self::DEEPLINK_TIME_MINIMUM . ':' . $cs->id);
                    \Yii::app()->cache->set(self::DEEPLINK_TIME_SUMMARY . ':' . $cs->id, 0);
                    \Yii::app()->cache->set(self::DEEPLINK_TOTAL_RESPONSES . ':' . $cs->id, 0);
                    \Yii::app()->cache->set(self::DEEPLINK_SLOW_COUNT . ':' . $cs->id, 0);
                    \Yii::app()->cache->delete(self::DEEPLINK_SLOW_SEARCH_ID. ':' . $cs->id);
                }
                \Yii::app()->cache->set(self::DEEPLINK_RESET_TIME, date(DATETIME_FORMAT));
                break;
        }
    }

    static function addDeeplinkResponse($cs, $searchId) {
        settype($cs, 'int');
        $time = \Yii::getLogger()->getExecutionTime();
        self::increaseCacheVariable(self::DEEPLINK_TIME_SUMMARY . ':' . $cs, $time);
        self::increaseCacheVariable(self::DEEPLINK_TOTAL_RESPONSES . ':' . $cs);
        $timeMin = \Yii::app()->cache->get(self::DEEPLINK_TIME_MINIMUM . ':' . $cs);
        $timeMax = \Yii::app()->cache->get(self::DEEPLINK_TIME_MAXIMUM . ':' . $cs);
        if ($timeMin === false || $timeMin > $time) {
            \Yii::app()->cache->set(self::DEEPLINK_TIME_MINIMUM . ':' . $cs, $time);
        }
        if ($timeMax === false || $timeMax < $time) {
            \Yii::app()->cache->set(self::DEEPLINK_TIME_MAXIMUM . ':' . $cs, $time);
            \Yii::app()->cache->set(self::DEEPLINK_SLOW_SEARCH_ID . ':' . $cs, $searchId);
        }
        if ($time > 29 ) {
            self::increaseCacheVariable(self::DEEPLINK_SLOW_COUNT. ':' . $cs);
        }
    }

    static function getDeeplinkStats() {
        $out = [];
        foreach (\ClientSource::model()->findAll([
//            'condition' => 'id>1',
            'order' => 'id',
        ]) as $cs) {
            $slowSearch = \Yii::app()->cache->get(self::DEEPLINK_SLOW_SEARCH_ID. ':' . $cs->id);
            $out[] = [
                'Source' => $cs->name,
                'Min' => round(\Yii::app()->cache->get(self::DEEPLINK_TIME_MINIMUM . ':' . $cs->id), 2),
                'Max' => round(\Yii::app()->cache->get(self::DEEPLINK_TIME_MAXIMUM . ':' . $cs->id), 2),
                'Avg' => round(\Yii::app()->cache->get(self::DEEPLINK_TIME_SUMMARY . ':' . $cs->id) / (\Yii::app()->cache->get(self::DEEPLINK_TOTAL_RESPONSES . ':' . $cs->id) ? : 1), 2),
                'Count' => \Yii::app()->cache->get(self::DEEPLINK_TOTAL_RESPONSES . ':' . $cs->id),
                'Slow' => round(100 * \Yii::app()->cache->get(self::DEEPLINK_SLOW_COUNT. ':' . $cs->id) / (\Yii::app()->cache->get(self::DEEPLINK_TOTAL_RESPONSES . ':' . $cs->id) ? : 1), 2) . '%',
                'Details' => $slowSearch ? "<a href='/searches/admin?Searches[id]=$slowSearch' target='_blank' class='btn btn-small btn-info'>Src</a>&nbsp<a href='/process/admin?Process[search_id]=$slowSearch' target='_blank' class='btn btn-small btn-info'>Prc</a>" : '' ,
            ];
        }
        return $out;
    }

}
