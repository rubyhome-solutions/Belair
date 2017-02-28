<?php

namespace application\components\client_sources\DeepLink;

/**
 * DeepLink FlightLeg
 *
 * @author Boxx
 */
class FlightLeg {

    public $origin = null;
    public $destination = null;
    public $carrier = null;
    public $validatingcarrier = null;
    public $validatingcarriername = null;
    public $carriername = null;
    public $flightnumber = null;
    public $bookingclass = null;
    public $deptime = null;
    public $arrtime = null;
    public $depdate = null; // YYYY-MM-DD, ex:2013-09-09
    public $arrdate = null; // YYYY-MM-DD, ex:2013-09-09 = null;
    public $journeyduration = 0; //Mins, ex 90 = null;
    public $cabinclass = 'Economy'; //Economy/business/first = null;
    public $origin_name = null;
    public $destination_name = null;
    public $equipment = null;
    public $stopover = false; //True/false Indicates whether this leg is a stopover leg = null;
    public $depterminal = '';
    public $arrterminal = '';
    public $techStop = '';
    static private $CabinTypeToName = [
        \CabinType::ECONOMY => 'Economy',
        \CabinType::BUSINESS => 'Business',
        \CabinType::FIRST => 'First',
        \CabinType::PREMIUM_ECONOMY => 'Business',
    ];

    /**
     * Add flights from RC object to the leg
     * @param \RoutesCache $rc
     */
    static function addRouteCacheLegs(\RoutesCache $rc) {
        $data = json_decode($rc->legs_json);
        if (!is_array($data[0])) {
            $data = [$data];
        }
        $out = [];
        $totalDuration = 0;
        foreach ($data as $journeyKey => $journey) {
            foreach ($journey as $legKey => $leg) {
                /* @var $journey \LegsJson[] */
                $fl = new FlightLeg;
                $fl->bookingclass = $leg->bookingClass;
                $fl->origin_name = $leg->origin;
                $fl->origin = substr($leg->origin, -4, 3);
                $fl->destination_name = $leg->destination;
                $fl->destination = substr($leg->destination, -4, 3);
                list($fl->depdate, $fl->deptime) = explode(' ', $leg->depart);
                list($fl->arrdate, $fl->arrtime) = explode(' ', $leg->arrive);
                list($fl->carrier, $fl->flightnumber) = explode('-', $leg->flighNumber);
                $fl->depterminal = $leg->originTerminal;
                $fl->arrterminal = $leg->destinationTerminal;
                $fl->journeyduration = \Utils::convertHoursMinsToMins($leg->time);
                $fl->equipment = $leg->aircraft;
                $fl->validatingcarrier = $rc->carrier->code;
                $fl->validatingcarriername = $rc->carrier->name;
                $fl->techStop = $leg->ts ? "Via: $leg->ts" : '';
                $carrier = \Carrier::model()->cache(3600)->findByAttributes(['code' => $fl->carrier]);
                
                // Try again without the cache
                if ($carrier === null) {
                    $carrier = \Carrier::model()->findByAttributes(['code' => $fl->carrier]);
                }
                
                if ($carrier === null) {
                    $carrier = new \Carrier;
                    $carrier->code = $fl->carrier;
                    $carrier->name = 'Airline';
                    $carrier->is_domestic = 0;
                    $carrier->insert();
                    \LogModel::logAction(\LogOperation::MISSING_AIRLINE, null, null, $fl->carrier);
//                    \Utils::dbgYiiLog('Missing airline inserted: ' . $fl->carrier);
                }
                $fl->carriername = $carrier->name;
                $fl->stopover = $legKey < count($journey) - 1 ? true : false;
                $fl->cabinclass = self::$CabinTypeToName[$rc->cabin_type_id];

                $out[$journeyKey][] = $fl;
                $totalDuration += $fl->journeyduration;
            }
        }
        $out['totalDuration'] = $totalDuration;
        return $out;
    }

}
