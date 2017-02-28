<?php

namespace application\components\B2bApi;

/**
 * DeepLink FlightLeg
 *
 * @author Boxx
 */
class FlightLeg {

    public $origin = null;
    public $destination = null;
    public $carrier = null;
    public $marketingCarrier = null;
    public $carrierName = null;
    public $flightNumber = null;
    public $bookingClass = null;
    public $depart = null; // YYYY-MM-DD, ex:2013-09-09
    public $arrive = null; // YYYY-MM-DD, ex:2013-09-09 = null;
    public $duration = 0; //Mins, ex 90 = null;
    public $cabinType = 'Economy'; //Economy/business/first = null;
    public $originName = null;
    public $destinationName = null;
    public $equipment = null;
//    public $stopover = false; //True/false Indicates whether this leg is a stopover leg = null;
    public $depTerminal = '';
    public $arrTerminal=  '';

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
        foreach ($data as $journey) {
            foreach ($journey as $leg) {
                /* @var $journey \LegsJson[] */
                $fl = new FlightLeg;
                $fl->bookingClass = $leg->bookingClass;
                $fl->originName = $leg->origin;
                $fl->origin = substr($leg->origin, -4, 3);
                $fl->destinationName = $leg->destination;
                $fl->destination = substr($leg->destination, -4, 3);
                $fl->depart = $leg->depart;
                $fl->arrive= $leg->arrive;
                list($fl->carrier, $fl->flightNumber) = explode('-', $leg->flighNumber);
                $fl->depTerminal = $leg->originTerminal;
                $fl->arrTerminal = $leg->destinationTerminal;
                $fl->duration = \Utils::convertHoursMinsToMins($leg->time);
                $fl->equipment = $leg->aircraft;
                $fl->marketingCarrier = $rc->carrier->code;
                $carrier = \Carrier::model()->findByAttributes(['code' => $fl->carrier]);
                $fl->carrierName = $carrier->name;
                $fl->cabinType = self::$CabinTypeToName[$rc->cabin_type_id];

                $out[] = $fl;
                $totalDuration += $fl->duration;
            }
        }
        $out['totalDuration'] = $totalDuration;
        return $out;
    }

}
