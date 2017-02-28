<?php

namespace application\components\Indigo;

class PnrAcquisition implements \application\components\api_interfaces\IpnrAcquisition {

    /**
     * The PNR content
     * @var GetBookingResponse
     */
    public $pnrObject = null;
    public $airSourceId = null;
    public $pnrStr = null;
    private $infantFees = [];

    function __construct($obj, $airSourceId) {
        $this->setPnr($obj, $airSourceId);
    }

    function setPnr($obj, $airSourceId) {
        $this->pnrObject = $obj;
        $this->airSourceId = $airSourceId;
        if (isset($this->pnrObject->Booking->RecordLocator)) {
            $this->pnrStr = (string) $this->pnrObject->Booking->RecordLocator;
        }
    }

    /**
     * Extract the passengers
     * @return array The array keys should match the Pax number from the PNR<br>
     * Data should have (firstName, lastName, type, title=null, birthDate=null)<br>
     * Possible type values:
     * 1 - adult (ADT)
     * 2 - child (CHD)
     * 3 - infant (INF)
     */
    function getPassengers() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
//        print_r($this->pnrObject);
        $out = [];
        foreach (\Utils::toArray($this->pnrObject->Booking->Passengers->Passenger) as $element) {
            /* @var $element Passenger */
            $out[(int) $element->PassengerNumber] = [
                'firstName' => (string) $element->Names->BookingName->FirstName,
                'lastName' => (string) $element->Names->BookingName->LastName,
                'title' => (string) $element->Names->BookingName->Title,
                'birthDate' => empty($element->PassengerTypeInfos->PassengerTypeInfo->DOB) ? null : date(DATE_FORMAT, strtotime((string) $element->PassengerTypeInfos->PassengerTypeInfo->DOB)),
                'type' => Utils::$passengerTypeToId[(string) $element->PassengerTypeInfos->PassengerTypeInfo->PaxType],
                'rawType' => (string) $element->PassengerTypeInfos->PassengerTypeInfo->PaxType,
            ];
            if (!empty($element->Infant)) {
                $out[$element->PassengerNumber . 'i'] = [
                    'firstName' => (string) $element->Infant->Names->BookingName->FirstName,
                    'lastName' => (string) $element->Infant->Names->BookingName->LastName,
                    'title' => (string) $element->Infant->Names->BookingName->Title,
                    'birthDate' => empty($element->PassengerInfants->PassengerInfant->DOB) ? null : date(DATE_FORMAT, strtotime((string) $element->PassengerInfants->PassengerInfant->DOB)),
                    'type' => Utils::$passengerTypeToId[Utils::TRAVELER_INFANT],
                    'rawType' => Utils::TRAVELER_INFANT,
                ];
                foreach (\Utils::toArray($element->PassengerFees->PassengerFee) as $pfs) {
                    foreach (\Utils::toArray($pfs->ServiceCharges->BookingServiceCharge) as $bsc) {
                        /* @var $bsc BookingServiceCharge */
                        $code = $bsc->ChargeCode === Utils::TRAVELER_INFANT ? 'baseFare' : $bsc->ChargeCode;
                        $amounts[$code] = (float) $bsc->Amount;
                        // Infant taxes correction for Indigo only
                        if ($code !== 'baseFare') {
                            $amounts['baseFare'] -= $amounts[$code];
                        }
                    }
                    $this->infantFees[$pfs->FlightReference] = self::reformatFare($amounts);
                }
            }
        }

        return $out;
    }

    /**
     * Extract the segments
     * @return array $segments The array keys should match the Segment number from the PNR<br>
     * The segments data is described in details in a wiki article
     */
    function getSegments() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        
        $out = [];
        foreach (\Utils::toArray($this->pnrObject->Booking->Journeys->Journey) as $journey) {
            foreach (\Utils::toArray($journey->Segments->Segment) as $segments) {
                $bookingClass = $segments->Fares->Fare->ClassOfService;
                $productClass = isset(Utils::$productClass[$segments->Fares->Fare->ProductClass])?Utils::$productClass[$segments->Fares->Fare->ProductClass]:Utils::REGULAR_FARE;
                foreach (\Utils::toArray($segments->Legs->Leg) as $element) {
                    $out[(int) $element->InventoryLegID] = [
                        'origin' => (string) $element->DepartureStation,
                        'destination' => (string) $element->ArrivalStation,
                        'depart' => strstr($element->STD, 'T', true),
                        'flightNumber' => trim((string) $element->FlightDesignator->FlightNumber),
                        'marketingCompany' => (string) $element->FlightDesignator->CarrierCode,
                        'bookingClass' => $bookingClass,
                        'productClass' => $productClass,
                        'departTs' => Utils::shortenDateAndTime($element->STD),
                        'arriveTs' => Utils::shortenDateAndTime($element->STA),
                        'departureTerminal' => $element->LegInfo->DepartureTerminal,
                        'arrivalTerminal' => $element->LegInfo->ArrivalTerminal,
                        'aircraft' => $element->LegInfo->EquipmentType,
                    ];
                }
            }
        }

        return $out;
    }

    /**
     * Combine the segments into journeys. Every 2 or more connected flights create a journey<br>
     * The segment IDs should match the Segment number from the getSegments call<br>
     * Example with 2 journeys with 2 connected flights in the first and 3 in the second journey:<br>
     * $journeys = [<br>
     *    [0] => [1,2],<br>
     *    [1] => [3, 4, 5]<br>
     * ]
     * @return array $journeys 2 dimensional array with structure [journeyID][segmentID]
     */
    function getJourneys() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $fares = $this->getFares();
        $out = [];
        $j = 1;
        foreach (\Utils::toArray($this->pnrObject->Booking->Journeys->Journey) as $journey) {
            foreach (\Utils::toArray($journey->Segments->Segment) as $segment) {
                foreach (\Utils::toArray($segment->Legs->Leg) as $element) {
                    $out[$j][] = (int) $element->InventoryLegID;
                    $out[$j]['fares'] = $fares[$j];
                }
            }
            $j++;
        }
        return $out;
    }

    /**
     * Extract the taxes. Taxes should be grouped in 2 dimensional array with first index passengerID, as received from getPassengers call<br>
     * second index should contain array $arrTaxes with structure defined in Taxes class. We should have one arrTaxes array for each passenger<br>
     * Usually the API will return more type of taxes and you will have to reformat the taxes so they fit arrTaxes structure.<br>
     * Specific reformatting instructions will be provided.<br>
     * @return array [passengerID]=arrTaxes
     */
    function getFares() {
        if ($this->pnrObject === null || !isset($this->pnrObject->Booking->Journeys->Journey)) {
            return false;   // There is no PNR object to work with
        }
       
        $fares = [];
        // Prepare amounts
        $j = 1;
        $passengers = $this->getPassengers();
        foreach (\Utils::toArray($this->pnrObject->Booking->Journeys->Journey) as $journey) {
            $flightReference = $this->getFlightReference($journey->Segments->Segment);
//            echo "$flightReference\n";
            $segment = self::getFirstSegment($journey->Segments->Segment);
            foreach (\Utils::toArray($segment->Fares->Fare) as $fare) {
                foreach (\Utils::toArray($fare->PaxFares->PaxFare) as $paxFare) {
                    $amounts = [];
                    foreach (\Utils::toArray($paxFare->ServiceCharges->BookingServiceCharge) as $element) {
                        /* @var $element BookingServiceCharge */
                        $code = $element->ChargeCode ? : 'baseFare';
                        $amounts[$code] = (float) $element->Amount;
                    }
                    $farePerPax = self::reformatFare($amounts);
                    $farePerPax['fareBasis'] = $fare->FareBasisCode;
                    foreach ($passengers as $paxKey => $passenger) {
                        if ($paxFare->PaxType === $passenger['rawType']) {
                            $fares[$j][$paxKey] = $farePerPax;
                        }
                        // Infant check
                        if (isset($this->infantFees[$flightReference]) && substr($paxKey, -1) == "i") {
//                        if (substr($paxKey, -1) == "i") {
                            $fares[$j][$paxKey] = $this->infantFees[$flightReference];
                        }
                    }
                }
            }
            $j++;
        }

        return $fares;
    }

    /**
     * Create flight reference string to use for infant fares
     * @param \application\components\Indigo\Segment $segment
     * @return string
     */
    private function getFlightReference($segment) {
        if (is_array($segment)) {
            $firstSegment = $segment[0];
            $arrivalStation = $segment[0]->ArrivalStation;
        } else {
            $firstSegment = $segment;
            $arrivalStation = $firstSegment->ArrivalStation;
        }
        $out = substr(str_replace('-', '', $firstSegment->STD), 0, 8);
        $out .= " " . $firstSegment->FlightDesignator->CarrierCode . $firstSegment->FlightDesignator->FlightNumber . " " .
                $firstSegment->DepartureStation . $arrivalStation;
//        $out = str_replace('-', '', substr($segment->STD, 0, 10)) . " ";
//        $out .= "{$segment->FlightDesignator->CarrierCode}{$segment->FlightDesignator->FlightNumber} {$segment->DepartureStation}{$segment->ArrivalStation}";
        return $out;
    }

    /**
     * Get information about the form of payment for the PNR
     * @return string CASH or CC abbreviation
     */
    function getFop() {
        return "Cash";
    }

    /**
     * Extract the information about the frequent flyers on per passenger basis
     * @return array [passengerID][ffInfo]
     */
    function getFFs() {
        return [];
    }

    /**
     * Extract the information about the SSRs on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][ssrCode]=true
     */
    function getSSRs() {
        return [];
    }

    /**
     * Extract the information about the endorsments on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][strEndorsment]
     */
    function getEndorsments() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        return [];
    }

    /**
     * Extract the information about the seats on per passenger and per segment basis
     * Trim the leading zeroes if any
     * @return array 2 dimensions [passengerID][segmentID]=strSeat<br>
     * Example with 2 passengers and 3 segments<pre>
     * Array (
     *     [1] => Array (
     *             [1] => '54D'
     *             [2] => '52H'
     *             [3] => '20A'
     *       )
     *     [2] => Array (
     *             [1] => '54E'
     *             [2] => '52G'
     *             [3] => '20B'
     *       )
     * )</pre>
     */
    function getSeats() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        foreach (\Utils::toArray($this->pnrObject->Booking->Journeys->Journey) as $journey) {
            foreach (\Utils::toArray($journey->Segments->Segment) as $segment) {
                if (empty($segment->PaxSeats->PaxSeat)) {
                    continue;
                }
                foreach (\Utils::toArray($segment->PaxSeats->PaxSeat) as $element) {
                    foreach (\Utils::toArray($segment->Legs->Leg) as $leg) {
                        $out[(int) $element->PassengerNumber][$leg->InventoryLegID] = $element->UnitDesignator;
                    }
                }
            }
        }
        return $out;
    }

    /**
     * Extract the information about the meals on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][strMeal]
     */
    function getMeals() {
        return [];
    }

    /**
     * Extract the information about the airPnrs on per segment basis
     * @return array 3 dimensions [segmentID][strAirPnr]
     */
    function getAirPnrs() {
        if ($this->pnrStr === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        $segments = $this->getSegments();
        foreach ($segments as $st => $segment) {
            $out[$st] = $this->pnrStr;
        }
        return $out;
    }

    /**
     * Extract the information about the tickets on per passenger and per segment basis
     * @return array 2 dimensions [passengerID][segmentID]=strTicket
     */
    function getTickets() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        $segments = $this->getSegments();
        $passengers = $this->getPassengers();
        foreach ($passengers as $paxKey => $pax) {
            foreach ($segments as $st => $segment) {
                $out[$paxKey][$st] = 'N/A';
            }
        }
        return $out;
    }

    /**
     * Get the tour code. This is unique string for the PNR
     * @return string Tour Code or null
     */
    function getTourCode() {
        return null;
    }

    function getFareBasis() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        $passengers = $this->getPassengers();
        foreach (\Utils::toArray($this->pnrObject->Booking->Journeys->Journey) as $journey) {
            foreach (\Utils::toArray($journey->Segments->Segment) as $segments) {
                foreach (\Utils::toArray($segments->Legs->Leg) as $element) {
                    foreach ($passengers as $paxKey => $passenger) {
                        $out[$paxKey][(int) $element->InventoryLegID] = $segments->Fares->Fare->FareBasisCode;
                    }
                }
            }
        }
        return $out;
    }

    function test() {
        echo "---=== $this->pnrStr ====----\n";
        echo "Passengers: " . print_r($this->getPassengers(), true) . "\n";
        echo "infantFees: " . print_r($this->infantFees, true) . "\n";
        echo "Segments: " . print_r($this->getSegments(), true) . "\n";
        $res = $this->getJourneys();
        foreach ($res as &$journey) {
            $journey['fares'] = "...";
        }
        echo "Journeys " . print_r($res, true) . "\n";
        $res = $this->getFares();
        echo "Fares: " . print_r($res, true) . "\n";
        if ($res === false) {
            echo "No fares\n";
        } elseif ($this->faresCrossCheck($res)) {
            echo "Fares are OK\n";
        } else {
            echo "Fares Error!\n";
        }
        echo "fareBasis: " . print_r($this->getFareBasis(), true) . "\n";
        echo "airPNRs: " . print_r($this->getAirPnrs(), true) . "\n";
        echo "Ffs: " . print_r($this->getFFs(), true) . "\n";
        echo "Tickets: " . print_r($this->getTickets(), true) . "\n";
        echo "Endorsments: " . print_r($this->getEndorsments(), true) . "\n";
        echo "tourCode: " . print_r($this->getTourCode(), true) . "\n";
        echo "Fop: " . print_r($this->getFop(), true) . "\n";
        echo "Meals: " . print_r($this->getMeals(), true) . "\n";
        echo "Seats: " . print_r($this->getSeats(), true) . "\n";
        echo "SSRs " . print_r($this->getSSRs(), true) . "\n";
//        echo "privateFare: " . print_r($this->getPf(), true) . "\n";
        echo "--------------------------------------------------------\n\n";
    }

    function faresCrossCheck($fares) {
        $total = 0;
        foreach ($fares as $journey) {
            foreach ($journey as $fare) {
                if ($fare['total'] != ($fare['baseFare'] + array_sum($fare['arrTaxes']))) {
                    return false;
                }
                $total += $fare['total'];
            }
        }
        $diff = $total - $this->pnrObject->Booking->Payments->Payment->PaymentAmount;
        echo "$this->pnrStr\tTotal: $total\tPaid: {$this->pnrObject->Booking->Payments->Payment->PaymentAmount}\t Diff: $diff\tPer pax: " . ($diff / $this->pnrObject->Booking->PaxCount) . "\n";
        if ($total != $this->pnrObject->Booking->Payments->Payment->PaymentAmount) {
            return false;
        }

        return true;
    }

    static function reformatFare($param) {
//        $out['original'] = $param;
        $out['baseFare'] = (float) $param['baseFare'];
        $out['privateFare'] = null;
        unset($param['baseFare']);
        $out['arrTaxes'] = Utils::reformatTaxes($param);
        $out['total'] = array_sum($out['arrTaxes']) + $out['baseFare'];

        return $out;
    }

    static function getFirstSegment($segment) {
        if (is_array($segment)) {
            return $segment[0];
        }
        return $segment;
    }

}
