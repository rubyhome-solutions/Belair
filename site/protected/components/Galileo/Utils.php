<?php

namespace application\components\Galileo;

/**
 * Galileo Utils
 *
 * @author Tony
 */
class Utils {

    const TAX_TO_SKIP = 'Q';
    const PASSENGER_ADULT_STRING = 'ADT';
    const PASSENGER_INFANT_STRING = 'INF';
    const PASSENGER_CHILD_STRING = 'CNN';
    const DEFAULT_GALILEO_TEST_ID = 21;
    const DEFAULT_GALILEO_PRODUCTION_ID = 22;
    const GALILEO_MAX_SEARCH_RESULTS = 50;

    static $paxTypeIdMap = [
        self::PASSENGER_ADULT_STRING => \TravelerType::TRAVELER_ADULT,
        self::PASSENGER_CHILD_STRING => \TravelerType::TRAVELER_CHILD,
        self::PASSENGER_INFANT_STRING => \TravelerType::TRAVELER_INFANT,
    ];
    static $paxIdToTypeMap = [
        \TravelerType::TRAVELER_ADULT => self::PASSENGER_ADULT_STRING,
        \TravelerType::TRAVELER_CHILD => self::PASSENGER_CHILD_STRING,
        \TravelerType::TRAVELER_INFANT => self::PASSENGER_INFANT_STRING,
    ];
    static $taxesReformat = [
        'YQ' => \Taxes::TAX_YQ,
        'Q' => \Taxes::TAX_YQ,
        'YR' => \Taxes::TAX_YQ,
        'IN' => \Taxes::TAX_UDF,
        'YM' => \Taxes::TAX_UDF,
        'JN' => \Taxes::TAX_JN,
        'WO' => \Taxes::TAX_PSF,
    ];

    /**
     * Format the time string
     * @param string $str Formated like 430, 1630
     * @return string
     */
    static function formatTime($str) {
        $str = str_pad($str, 4, '0', STR_PAD_LEFT);
        return substr($str, 0, 2) . ":" . substr($str, 2, 2);
    }

    /**
     * Format the date string
     * @param string $str Formated like 20140830
     * @return string
     */
    static function formatDate($str) {
        return substr($str, 0, 4) . "-" . substr($str, 4, 2) . "-" . substr($str, 6, 2);
    }

    /**
     * Count the total number of the segments (sub-array) elements
     * @param type $arr Array with journeys as sub-arrays
     * @return int Count of the segments in all journeys
     */
    static function countSegments($arr) {
        $sum = 0;
        foreach ($arr as $connection) {
            $sum += count($connection);
        }
        return $sum;
    }

    static function arrayCombine2($data, &$all = array(), $group = array(), $val = null, $i = 1) {
        if (isset($val)) {
            $group[count($group) + 1] = $val;
        }
        if ($i > count($data)) {
            array_push($all, $group);
        } else {
            foreach ($data[$i] as $v) {
                self::arrayCombine2($data, $all, $group, $v, $i + 1);
            }
        }
        return $all;
    }

    static function arrayCombine($arr) {
        $total = 0;
        if (count($arr) === 1) {
            foreach ($arr as $element) {
                foreach ($element as $element2) {
//                    $out[] = ['total' => count($element2), 1 => $element2];
                    $out[] = [1 => $element2];
                }
            }
            return $out;
        }
        // Round-trip case
        $first = array_shift($arr);
        foreach ($first as $element) {
            $total += count($element);
            foreach ($arr as $element2) {
                foreach ($element2 as $element3) {
//                    $out[] = ['total' => (count($element) + count($element3)), 1 => $element, 2 => $element3];
                    $out[] = [1 => $element, 2 => $element3];
                }
            }
        }
        return $out;
    }

    /**
     * PNR acquisition
     * @param string $pnrStr The PNR
     * @param int $airSourceId ID of the air source from where the pnr is to be extracted
     * @return int ID of the newly created airCart object
     */
    static function aquirePnr($pnrStr, $airSourceId) {
        // Testing switch
        $test = false;

        if ($test) {
            $pnr = \simplexml_load_file('galileo_pnr_structure.xml');
        } else {
            $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
            $api = new $airSource->backend->api_source($airSourceId);
            $pnr = $api->pnrRetrieve($pnrStr);
            // If string is returned , than this is a error
            if (is_string($pnr)) {
                return ['message' => $pnr];
            }
            if (YII_DEBUG) {
                $pnr->saveXML('galileo_pnr_structure.xml');
            }
        }
        $response = new PnrAcquisition($pnr, $airSourceId);
        return \ApiInterface::acquirePnr($response);
    }

    /**
     * Cancel Galileo PNR
     * @param int $airCartId
     * @return boolean True or array with error component
     */
    static function cancelPnr($airCartId) {
        $airCart = \AirCart::model()->with('airBookings')->findByPk($airCartId);
        /* @var $airCart \AirCart */
        if (!$airCart || empty($airCart->airBookings)) {
            return ['error' => "This cart do not have bookings or can't be found"];
        }
        $api = new Galileo($airCart->airBookings[0]->air_source_id);
        $res = $api->pnrCancel($airCart->airBookings[0]->crs_pnr);
        // If string is returned , than this is a error
        if (is_string($res)) {
            return ['error' => $res];
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('pnr_structure.json', $res);
        }
        return true;
    }

    /**
     * Galileo search
     * @param int $airSourceId The AirSource ID
     * @param \stdClass $params
     * @return string JSON encoded search result
     */
    static function search($airSourceId, \stdClass $params) {
        // Departure date test
        if (strtotime($params->depart) < strtotime(date(DATE_FORMAT))) {
            return "Departure in the past";
        }

//        $originId = \Airport::getIdFromCode($params->source);
//        $destinationId = \Airport::getIdFromCode($params->destination);
        $test = false;
        if ($test) {
            $search = simplexml_load_file(\Yii::app()->runtimePath . '/galileo_search_results.xml');
        } else {
            $galileo = new Galileo($airSourceId);
            $search = $galileo->search($params->source, $params->destination, $params->depart, $params->adults, $params->children, $params->infants, $params->return, $params->category);
            if (is_string($search)) {   // String here means error message
                return $search;
            }
            if (YII_DEBUG) {
                $search->saveXML(\Yii::app()->runtimePath . '/galileo_search_results.xml');
            }
        }
        // Check for errors
        if (isset($search->FareInfo->ErrText->Text)) {
            return(string) $search->FareInfo->ErrText->Text;
        }
        
        $airSource = \AirSource::model()->cache(600)->with('backend')->findByPk($airSourceId);
        $disabledCarriers = array_map('trim', explode(',', strtoupper($airSource->exclude_carriers)));
        // Prepare the flights array
        $segmentRef = 1;
        foreach ($search->AirAvail as $aa) {
            $flightKey = 1;
            foreach ($aa->AvailFlt as $af) {
                unset($flight);
                $depart = self::formatDate($af->StartDt) . " " . self::formatTime($af->StartTm);
                $arrive = self::formatDate($af->EndDt) . " " . self::formatTime($af->EndTm);
                $flight = [
                    'depart' => $depart,
                    'arrive' => $arrive,
                    'origin' => (string) $af->StartAirp,
                    'destination' => (string) $af->EndAirp,
                    'flight' => $af->AirV . '-' . $af->FltNum,
//                    'marketingCompany' => (string) $af->OperationalAirV,
                    'traveTime' => \Utils::convertToHoursMins($af->FltTm),
                    'aircraft' => (string) $af->Equip,
                    'originTerminal' => (string) $af->StartTerminal,
                    'destinationTerminal' => (string) $af->EndTerminal,
                    'ts' => empty($af->FrstDwnlnStp) ? null : (string) $af->FrstDwnlnStp
                ];
                $flights[$segmentRef][$flightKey] = $flight;
//        echo \Utils::dbg($flights);
                $flightKey++;
            }
            $segmentRef++;
        }

        $segments = []; // inicialization
        foreach ($search->FareInfo as $fi) {
            unset($fares);
            foreach ($fi->GenQuoteDetails as $gqd) {
                unset($fare);
                $fare['marketingCompany'] = $fi->RulesInfo->AirV;
                $fare['total'] = (float) $gqd->TotAmt;
                $fare['base'] = (float) $gqd->BaseFareAmt;
                $fare['taxes'] = $fare['total'] - $fare['base'];
                unset($taxesDetails);
                $tax = new \Taxes;
                foreach ($gqd->TaxDataAry->TaxData as $td) {
                    $taxesDetails[(string) $td->Country] = (float) $td->Amt;
                    if (array_key_exists((string) $td->Country, self::$taxesReformat)) {
                        $tax->arrTaxes[self::$taxesReformat[(string) $td->Country]] += (float) $td->Amt;
                    } else {
                        $tax->arrTaxes[\Taxes::TAX_OTHER] += (float) $td->Amt;
                    }
                }
                if (isset($taxesDetails)) {
                    $fare['details'] = $taxesDetails;
                }
                $fare['reformatedDetails'] = $tax->arrTaxes;
                $fares[] = $fare;
            }
            $i = 0;
            // Pax types
            foreach ($fi->PsgrTypes as $pt) {
                $fares[$i]['paxType'] = (string) $pt->PICReq;
                $i++;
            }
            // F.Basis
            foreach ($fi->FareBasisCodeSummary->FICAry->FICInfo as $fici) {
                $paxNum = (int) $fici->PsgrDescNum - 1;
                $odNum = (int) $fici->ODNum;
                $fares[$paxNum]['fBasis'][$odNum] = (string) $fici->FIC;
            }

            // Segments & flights
            unset($bics);
            unset($items);
            //    foreach ($fi->FlightItemRef as $ficr) {
            foreach ($fi->FlightItemCrossRef as $ficr) {
                $segmentRef = (int) $ficr->ODNum;
                $numLegs = (int) $ficr->ODNumLegs;
                $j = 1;
                $i = 1;
                foreach ($ficr->FltItemAry->FltItem as $fltItem) {
                    $items[$segmentRef][$j][$i] = (int) $fltItem->IndexNum;
                    $bics[$segmentRef][(int) $fltItem->IndexNum] = (string) $fltItem->BICAry->BICInfo->BIC;
                    if ($i === $numLegs) {  // Reset the leg counter
                        $i = 1;
                        $j++;
                    } else {    // Next leg
                        $i++;
                    }
                }
            }
            $items3 = self::arrayCombine2($items);
            foreach ($items3 as $item) {
                $bic = [];
                // Check the result for validity: departure 30min after the arrival
                if (isset($item[2]) && 
                strtotime($flights[1][end($item[1])]['arrive']) + 1800 > strtotime($flights[2][reset($item[2])]['depart'])) {
                    continue;
                }
                foreach ($item as $segmentRef => $legs) {
                    foreach ($legs as $leg) {
                        if (isset($bic[$segmentRef][$leg])) {
                            return "Error: $segmentRef - $leg is already set";
                        }
                        $bic[$segmentRef][$leg] = $bics[$segmentRef][$leg];
                    }
                }
                $segments[] = ['flight' => $item, 'fares' => $fares, 'bics' => $bic];
            }
        }

        $serviceTypeId = \Airport::getServiceTypeIdFromCode($params->source, $params->destination);
        $rows = [];
        $resultCount = 0;
        foreach ($segments as $segment) {

            // Skip the excluded carriers
            if (in_array(reset($segment['fares'])['marketingCompany'], $disabledCarriers)) {
                continue;
            }
             
            $rows = array_merge($rows, self::prepareCacheRow($segment['flight'], $segment['fares'], $segment['bics'], $flights, $airSourceId, $serviceTypeId, $params->category));
            $resultCount++;
            if ($resultCount >= self::GALILEO_MAX_SEARCH_RESULTS * 3) {
                break;  // Do not consider more than MAX_SEARCH results.
            }
        }
//        echo \Utils::dbg($rows);
        return json_encode($rows);
    }

    static function prepareLegsJson($flights, $journeys, $bics) {
        $out = [];
        foreach ($journeys as $segRef => $legs) {
            $legOut = [];
            foreach ($legs as $legId) {
                $legsJson = new \LegsJson;
                $legsJson->arrive = $flights[$segRef][$legId]['arrive'];
                $legsJson->depart = $flights[$segRef][$legId]['depart'];
                $legsJson->destination = \Airport::getAirportCodeAndCityNameFromCode($flights[$segRef][$legId]['destination']);
                $legsJson->destinationTerminal = $flights[$segRef][$legId]['destinationTerminal'];
                $legsJson->flighNumber = $flights[$segRef][$legId]['flight'];
                $legsJson->origin = \Airport::getAirportCodeAndCityNameFromCode($flights[$segRef][$legId]['origin']);
                $legsJson->originTerminal = $flights[$segRef][$legId]['originTerminal'];
                $legsJson->time = $flights[$segRef][$legId]['traveTime'];
                $legsJson->aircraft = $flights[$segRef][$legId]['aircraft'];
                $legsJson->bookingClass = $bics[$segRef][$legId];
                $legsJson->ts = $flights[$segRef][$legId]['ts'];
                $legOut[] = $legsJson;
            }
            $out[] = $legOut;
        }
        return json_encode($out);   // Do not use JSON_NUMERIC_CHECK cause confilicts with Airlines with E in the code
    }

    static function prepareCacheRow($legs, $passagers, $bics, $flights, $airSourceId, $serviceTypeId, $cabinTypeId) {
        $rows = [];
        $round_trip = (count($legs) === 1) ? 0 : 1;

        // strHash format: <Origin>~<departTs>~<FlightNumber>~<Destination1>~<departTs>~<FlightNumber>~<Destination2>~...
        $strHash = $airSourceId . \RoutesCache::HASH_SEPARATOR . $cabinTypeId . \RoutesCache::HASH_SEPARATOR;
        $tmpRow = new \stdClass;
        $tmpRow->stops = - 1;
        foreach ($legs as $segRef => $leg) {
            $tmpRow->stops += count($leg);
            foreach ($leg as $flightId) {    // strHash preparation
                $strHash .= $flights[$segRef][$flightId]['origin'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flights[$segRef][$flightId]['depart'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flights[$segRef][$flightId]['flight'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flights[$segRef][$flightId]['destination'] . \RoutesCache::HASH_SEPARATOR;
            }
        }
        // remove the ending separator
//        $strHash = rtrim($strHash, \RoutesCache::HASH_SEPARATOR);
        $tmpJourney = reset($legs);
        $firstLeg = $flights[key($legs)][reset($tmpJourney)];
//        $tmpJourney = end($legs);
        $lastLeg = $flights[key($legs)][end($tmpJourney)];

        $tmp = explode('-', $firstLeg['flight']);
//        $marketingCompany = empty($firstLeg['marketingCompany']) ? $tmp[0] : $firstLeg['marketingCompany'];
        $tmpDepart = explode(' ', $firstLeg['depart']);
        $tmpArrive = explode(' ', $lastLeg['arrive']);
//            $tmp2 = explode(' ', $firstLeg['depart']);
        // default values
        list($tmpRow->return_date, $tmpRow->return_time) = [null, null];
        if ($round_trip === 0) {
            $order = \RoutesCache::ORDER_SINGLE_JOURNEY;    // Single journey
        } else {
            $order = \RoutesCache::ORDER_ALL_JOURNEYS;    // Second journey from 2
            $tmpJourney = end($legs);
            list($tmpRow->return_date, $tmpRow->return_time) = explode(' ', $flights[key($legs)][reset($tmpJourney)]['depart']);
        }

        $tmpRow->origin_id = \Airport::getIdFromCode($firstLeg['origin']);
        $tmpRow->destination_id = \Airport::getIdFromCode($lastLeg['destination']);
        $tmpRow->flight_number = $tmp[1];
        $marketingCompany = reset($passagers)['marketingCompany'];
        $tmpRow->carrier_id = \Carrier::getIdFromCode($marketingCompany);
        if (\Carrier::getIsDisabled($tmpRow->carrier_id)) {
            return [];
        }
//        $tmpRow->booking_class = $bics[$segRef][$firstLedId];
        $tmpRow->departure_date = $tmpDepart[0];
        $tmpRow->departure_time = $tmpDepart[1];
        $tmpRow->arrival_date = $tmpArrive[0];
        $tmpRow->arrival_time = $tmpArrive[1];
        $tmpRow->legsJson = self::prepareLegsJson($flights, $legs, $bics);
        $processedPaxTypes = [];
        foreach ($passagers as $passager) {
            // Skip processed pax types
            if (isset($processedPaxTypes[$passager['paxType']])) {
                continue;
            }
            $processedPaxTypes[$passager['paxType']] = true;
            $row = new \RoutesCache;
            $row->cabin_type_id = $cabinTypeId;
            $row->departure_date = $tmpRow->departure_date;
            $row->departure_time = $tmpRow->departure_time;
            $row->arrival_date = $tmpRow->arrival_date;
            $row->arrival_time = $tmpRow->arrival_time;
            $row->return_date = $tmpRow->return_date;
            $row->return_time = $tmpRow->return_time;
            $row->origin_id = $tmpRow->origin_id;
            $row->destination_id = $tmpRow->destination_id;
            $row->carrier_id = $tmpRow->carrier_id;
            $row->stops = $tmpRow->stops;
            $row->flight_number = $tmpRow->flight_number;
//            $row->booking_class = $tmpRow->booking_class;
            $row->legs_json = $tmpRow->legsJson;
            $row->grouping = \RoutesCache::getNextGroupId();
            $row->order_ = $order;
            $row->round_trip = $round_trip;
            $row->traveler_type_id = self::$paxTypeIdMap[$passager['paxType']];
            $row->hash_str = $strHash . $row->traveler_type_id;
            $row->hash_id = "x'" . str_pad(hash('fnv164', $row->hash_str), 16, '0', STR_PAD_LEFT) . "'::int8";
            $row->fare_basis = $passager['fBasis'][$segRef];
            $row->last_check = date(DATETIME_FORMAT);
            $row->updated = date(DATETIME_FORMAT);
            $row->air_source_id = $airSourceId;
            $row->service_type_id = $serviceTypeId;
            // Taxes
            $row->total_fare = (float) $passager['total'];
            $row->total_taxes = array_sum($passager['reformatedDetails']);
            $row->base_fare = $row->total_fare - $row->total_taxes;
            $row->tax_jn = $passager['reformatedDetails'][\Taxes::TAX_JN];
            $row->tax_other = $passager['reformatedDetails'][\Taxes::TAX_OTHER];
            $row->tax_psf = $passager['reformatedDetails'][\Taxes::TAX_PSF];
            $row->tax_udf = $passager['reformatedDetails'][\Taxes::TAX_UDF];
            $row->tax_yq = $passager['reformatedDetails'][\Taxes::TAX_YQ];

            $rows[] = $row->attributes;
            end($rows);
            unset($rows[key($rows)]['id']);     // Unset the id array element
        }
        return $rows;
    }

}
