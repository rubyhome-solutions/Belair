<?php

/**
 * Description of CommercialFilter
 *
 * @author Boxx
 */
class CommercialFilter {

    /**
     * @var CommercialFilterElements $include
     */
    public $include;

    /**
     * @var CommercialFilterElements $exclude
     */
    public $exclude;

    function __construct($data = null) {
        $this->include = new CommercialFilterElements;
        $this->exclude = new CommercialFilterElements;
        unset($this->exclude->rule_timings);
        if (!empty($data)) {
            $data = json_decode($data);
            $this->include->book_date = $data->include->book_date;
            $this->include->onward_date = $data->include->onward_date;
            $this->include->return_dept_date = $data->include->return_dept_date;
            $this->include->flight = $data->include->flight;
            $this->include->booking_class = $data->include->booking_class;
            $this->include->fare_basis = $data->include->fare_basis;
            $this->include->cabin_class = $data->include->cabin_class;
            $this->include->origin_airport = $data->include->origin_airport;
            $this->include->arrival_airport = $data->include->arrival_airport;
            $this->include->tour_code = $data->include->tour_code;
            $this->include->pf_code = $data->include->pf_code;
            $this->include->biggerThan = isset($data->include->biggerThan) ? $data->include->biggerThan : null;
            $this->include->biggerThanTotalFare = isset($data->include->biggerThanTotalFare) ? $data->include->biggerThanTotalFare : null;
            $this->include->base_fare = isset($data->include->base_fare) ? $data->include->base_fare : '';
            $this->include->total_fare = isset($data->include->total_fare) ? $data->include->total_fare : '';

            $this->exclude->book_date = $data->exclude->book_date;
            $this->exclude->onward_date = $data->exclude->onward_date;
            $this->exclude->return_dept_date = $data->exclude->return_dept_date;
            $this->exclude->flight = $data->exclude->flight;
            $this->exclude->booking_class = $data->exclude->booking_class;
            $this->exclude->fare_basis = $data->exclude->fare_basis;
            $this->exclude->cabin_class = $data->exclude->cabin_class;
            $this->exclude->origin_airport = $data->exclude->origin_airport;
            $this->exclude->arrival_airport = $data->exclude->arrival_airport;
            $this->exclude->tour_code = $data->exclude->tour_code;
            $this->exclude->pf_code = $data->exclude->pf_code;
            $this->exclude->biggerThan = isset($data->exclude->biggerThan) ? $data->exclude->biggerThan : null;
            $this->exclude->biggerThanTotalFare = isset($data->exclude->biggerThanTotalFare) ? $data->exclude->biggerThanTotalFare : null;
            $this->exclude->base_fare = isset($data->exclude->base_fare) ? $data->exclude->base_fare : '';
            $this->exclude->total_fare = isset($data->exclude->total_fare) ? $data->exclude->total_fare : '';

            $this->include->rule_timings->days = !empty($data->include->rule_timings->days) ? $data->include->rule_timings->days : [];
            $this->include->rule_timings->start_time = !empty($data->include->rule_timings->start_time) ? $data->include->rule_timings->start_time : [];
            $this->include->rule_timings->end_time = !empty($data->include->rule_timings->end_time) ? $data->include->rule_timings->end_time : [];
        }
    }

    function getAsString() {
        return json_encode([
            'include' => $this->include,
            'exclude' => $this->exclude,
        ]);
    }

    function setAttributes($post) {
        $this->include->book_date = $post['include']['book_date'];
        $this->include->onward_date = $post['include']['onward_date'];
        $this->include->return_dept_date = $post['include']['return_dept_date'];
        $this->include->flight = $post['include']['flight'];
        $this->include->booking_class = $post['include']['booking_class'];
        $this->include->fare_basis = $post['include']['fare_basis'];
        $this->include->cabin_class = $post['include']['cabin_class'];
        $this->include->origin_airport = $post['include']['origin_airport'];
        $this->include->arrival_airport = $post['include']['arrival_airport'];
        $this->include->tour_code = $post['include']['tour_code'];
        $this->include->pf_code = $post['include']['pf_code'];
        $this->include->biggerThan = !empty($post['include']['base_fare']) && !empty($post['include']['biggerThan']) ? (int) $post['include']['biggerThan'] : null;
        $this->include->biggerThanTotalFare = !empty($post['include']['total_fare']) && !empty($post['include']['biggerThanTotalFare']) ? (int) $post['include']['biggerThanTotalFare'] : null;
        $this->include->base_fare = !empty($post['include']['base_fare']) && !empty($post['include']['biggerThan']) ? (int) $post['include']['base_fare'] : '';
        $this->include->total_fare = !empty($post['include']['total_fare']) && !empty($post['include']['biggerThanTotalFare']) ? (int) $post['include']['total_fare'] : '';

        $this->exclude->book_date = $post['exclude']['book_date'];
        $this->exclude->onward_date = $post['exclude']['onward_date'];
        $this->exclude->return_dept_date = $post['exclude']['return_dept_date'];
        $this->exclude->flight = $post['exclude']['flight'];
        $this->exclude->booking_class = $post['exclude']['booking_class'];
        $this->exclude->fare_basis = $post['exclude']['fare_basis'];
        $this->exclude->cabin_class = $post['exclude']['cabin_class'];
        $this->exclude->origin_airport = $post['exclude']['origin_airport'];
        $this->exclude->arrival_airport = $post['exclude']['arrival_airport'];
        $this->exclude->tour_code = $post['exclude']['tour_code'];
        $this->exclude->pf_code = $post['exclude']['pf_code'];
        $this->exclude->biggerThan = !empty($post['exclude']['base_fare']) && !empty($post['exclude']['biggerThan']) ? (int) $post['exclude']['biggerThan'] : null;
        $this->exclude->biggerThanTotalFare = !empty($post['exclude']['total_fare']) && !empty($post['exclude']['biggerThanTotalFare']) ? (int) $post['exclude']['biggerThanTotalFare'] : null;
        $this->exclude->base_fare = !empty($post['exclude']['base_fare']) && !empty($post['exclude']['biggerThan']) ? (int) $post['exclude']['base_fare'] : '';
        $this->exclude->total_fare = !empty($post['exclude']['total_fare']) && !empty($post['exclude']['biggerThanTotalFare']) ? (int) $post['exclude']['total_fare'] : '';

        $this->include->rule_timings->days = !empty($post['include']['rule_timings']['days']) ? $post['include']['rule_timings']['days'] : [];
        if (count($this->include->rule_timings->days) > 0) {
            foreach ($this->include->rule_timings->days as $key => $day) {
                $start_time = !empty($post['include']['rule_timings']['start_time'][$key]) ? $post['include']['rule_timings']['start_time'][$key] : '';
                $end_time = !empty($post['include']['rule_timings']['end_time'][$key]) ? $post['include']['rule_timings']['end_time'][$key] : '';

                $this->include->rule_timings->start_time[$key] = $start_time;
                $this->include->rule_timings->end_time[$key] = $end_time;
            }
        }
    }

    function getSummary() {
        $strInclude = '';
        $strExclude = '';
        foreach (CommercialFilterElements::$description as $key => $value) {
            if ($key === 'rule_timings') {
                continue;
            }
            if (!empty($this->include->$key)) {
                if ($key === 'biggerThan' || $key === 'biggerThanTotalFare') {
                    $strInclude .= \CommercialFilterElements::$biggerSmaller[$this->include->{$key}] . ' ';
                } else {
                    $strInclude .= "$key: {$this->include->$key}, ";
                }
            }
            if (!empty($this->exclude->$key)) {
                if ($key === 'biggerThan' || $key === 'biggerThanTotalFare') {
                    $strExclude .= \CommercialFilterElements::$biggerSmaller[$this->exclude->{$key}] . ' ';
                } else {
                    $strExclude .= "$key: {$this->exclude->$key}, ";
                }
            }
        }
        if (strlen($strInclude)) {
            $strInclude = "<b>Include:</b> " . rtrim($strInclude, ', ');
        }
        if (strlen($strExclude)) {
            $strExclude = " <b>Exclude:</b> " . rtrim($strExclude, ', ');
        }
        return $strInclude . $strExclude;
    }

    function matchAirBooking(\AirBooking $ab) {
        $ab->setIsReturnAndFirstLegCarrier();
        if ($this->exclude->matchAirBookingExclude($ab)) {
//            echo \Utils::dbg("Excluded $ab->id");
            return false;
        }
        return $this->include->matchAirBookingInclude($ab);
    }

}

class CommercialFilterElements {

    const BIGGER_THAN = 1,
        SMALLER_THAN = 2;

    static $biggerSmaller = [
        self::BIGGER_THAN => 'Bigger or equal than',
        self::SMALLER_THAN => 'Smaller or equal than',
    ];
    public
        $book_date = '',
        $onward_date = '',
        $return_dept_date = '',
        $flight = '',
        $booking_class = '',
        $fare_basis = '',
        $cabin_class = '',
        $origin_airport = '',
        $arrival_airport = '',
        $tour_code = '',
        $pf_code = '',
        $biggerThan,
        $biggerThanTotalFare,
        $base_fare = '',
        $total_fare = '',
        $rule_timings = null;
    static $description = [
        'book_date' => 'book_date',
        'onward_date' => 'onward_date',
        'return_dept_date' => 'return_dept_date',
        'flight' => 'flight',
        'booking_class' => 'booking_class',
        'fare_basis' => 'fare_basis',
        'cabin_class' => 'cabin_class',
        'origin_airport' => 'origin_airport',
        'arrival_airport' => 'arrival_airport',
        'tour_code' => 'tour_code',
        'pf_code' => 'pf_code',
        'biggerThan' => 'BiggerThan',
        'biggerThanTotalFare' => 'BiggerThan',
        'base_fare' => 'Base fare',
        'total_fare' => 'Total fare',
        'rule_timings' => 'Rule Timings',
    ];

    public function __construct() {
        $this->rule_timings = new stdClass();
        $this->rule_timings->days = [];
        $this->rule_timings->start_time = [];
        $this->rule_timings->end_time = [];
    }

    /**
     * Exclude logic filter checks. Check all rules or until first exclude match
     * @param \RoutesCache $rc RouteCache object
     * @return boolean False if no matching rule is found or the filter is empty
     */
    function matchRouteCacheExclude(\RoutesCache $rc) {
        if (!empty($this->book_date) &&
            self::dateMatch($this->book_date, $rc->last_check) === true) {
            return true;
        }
        if (!empty($this->onward_date) &&
            self::dateMatch($this->onward_date, $rc->departure_date) === true) {
            return true;
        }
        if (!empty($this->return_dept_date) &&
            self::dateMatch($this->return_dept_date, $rc->return_date) === true) {
            return true;
        }
        if (!empty($this->flight) &&
            self::flightMatch($this->flight, $rc->extractJsonLegElement('flighNumber')) === true) {
            return true;
        }
        if (!empty($this->booking_class) &&
            self::textMatch($this->booking_class, $rc->extractJsonLegElement('bookingClass')) === true) {
            return true;
        }
        if (!empty($this->fare_basis) &&
            self::textMatch($this->fare_basis, [$rc->fare_basis]) === true) {
            return true;
        }
        if (!empty($this->cabin_class) &&
            self::cabinMatch($this->cabin_class, $rc->cabin_type_id) === true) {
            return true;
        }
        if (!empty($this->origin_airport) &&
            self::airportMatch($this->origin_airport, $rc->origin_id, $rc->destination_id, $rc->origin_id) === true) {
            return true;
        }
        if (!empty($this->arrival_airport) &&
            self::airportMatch($this->arrival_airport, $rc->origin_id, $rc->destination_id, $rc->destination_id) === true) {
            return true;
        }
        // Filtering based on base fare
        if (!empty($this->biggerThan) && !empty($this->base_fare)) {
            if ($this->biggerThan == self::BIGGER_THAN) {
                if ($this->base_fare <= $rc->base_fare) {
                    return true;
                }
            } else {
                if ($this->base_fare >= $rc->base_fare) {
                    return true;
                }
            }
        }

        // Filtering based on total fare
        if (!empty($this->biggerThanTotalFare) && !empty($this->total_fare)) {
            if ($this->biggerThanTotalFare == self::BIGGER_THAN) {
                if ($this->total_fare <= $rc->total_fare) {
                    return true;
                }
            } else {
                if ($this->total_fare >= $rc->total_fare) {
                    return true;
                }
            }
        }

        return false;   // No exclude rules found
    }

    /**
     * Exclude logic filter checks. Check all rules or until first exclude match
     * @param \AirBooking $ab RouteCache object
     * @return boolean False if no matching rule is found or the filter is empty
     */
    function matchAirBookingExclude(\AirBooking $ab) {
        if (!empty($this->book_date) &&
            self::dateMatch($this->book_date, $ab->created) === true) {
            return true;
        }
        if (!empty($this->onward_date) &&
            self::dateMatch($this->onward_date, $ab->departure_ts) === true) {
            return true;
        }
        if (!empty($this->return_dept_date) &&
            self::dateMatch($this->return_dept_date, $ab->returnDate) === true) {
            return true;
        }
        if (!empty($this->flight) &&
            self::flightMatch($this->flight, $ab->getFlighNumberArr()) === true) {
            return true;
        }
        if (!empty($this->booking_class) &&
            self::textMatch($this->booking_class, $ab->getBookingClassArr()) === true) {
//            echo \Utils::dbg(["Excluded $this->booking_class", $ab->getBookingClassArr()]);
            return true;
        }
        if (!empty($this->fare_basis) &&
            self::textMatch($this->fare_basis, [$ab->fare_basis]) === true) {
            return true;
        }
        if (!empty($this->cabin_class) &&
            self::cabinMatch($this->cabin_class, $ab->cabin_type_id) === true) {
            return true;
        }
        if (!empty($this->origin_airport)) {
            if (!$ab->isReturnBooking && self::airportMatch($this->origin_airport, $ab->source_id, $ab->destination_id, $ab->source_id) === true) {
                return true;
            }
            if ($ab->isReturnBooking && self::airportMatch($this->origin_airport, $ab->destination_id, $ab->source_id, $ab->destination_id) === true) {
                return true;
            }
        }
        if (!empty($this->arrival_airport)) {
            if (!$ab->isReturnBooking && self::airportMatch($this->arrival_airport, $ab->source_id, $ab->destination_id, $ab->destination_id) === true) {
                return true;
            }
            if ($ab->isReturnBooking && self::airportMatch($this->arrival_airport, $ab->destination_id, $ab->source_id, $ab->source_id) === true) {
                return true;
            }
        }
        // Filtering based on base fare
        if (!empty($this->biggerThan) && !empty($this->base_fare)) {
            if ($this->biggerThan == self::BIGGER_THAN) {
                if ($this->base_fare <= $ab->basic_fare) {
                    return true;
                }
            } else {
                if ($this->base_fare >= $ab->basic_fare) {
                    return true;
                }
            }
        }
        // Filtering based on total fare
        if (!empty($this->biggerThanTotalFare) && !empty($this->total_fare)) {
            $amount = $ab->totalAmountToPay - $ab->airCart->convenienceFee;
            if ($this->biggerThanTotalFare == self::BIGGER_THAN) {
                if ($this->total_fare <= $amount) {
                    return true;
                }
            } else {
                if ($this->total_fare >= $amount) {
                    return true;
                }
            }
        }

        return false;   // No exclude rules found
    }

    /**
     * Include logic filter checks. Stop after first check
     * @param \RoutesCache $rc RouteCache object
     * @return boolean True if matching rule is found or the filter is empty
     */
    function matchRouteCacheInclude(\RoutesCache $rc) {
        if (!empty($this->rule_timings->days)) {
            if ($this->ruleTimingsMatch(date('Y-m-d H:i:s')) !== true) {
                return false;
            }
        }
        if (!empty($this->book_date)) {
            if (self::dateMatch($this->book_date, $rc->last_check) !== true) {
                return false;
            }
        }
        if (!empty($this->onward_date)) {
            if (self::dateMatch($this->onward_date, $rc->departure_date) !== true) {
                return false;
            }
        }
        if (!empty($this->return_dept_date)) {
            if (self::dateMatch($this->return_dept_date, $rc->return_date) !== true) {
                return false;
            }
        }
        if (!empty($this->flight)) {
            if (self::flightMatch($this->flight, $rc->extractJsonLegElement('flighNumber')) !== true) {
                return false;
            }
        }
        if (!empty($this->booking_class)) {
            if (self::textMatch($this->booking_class, $rc->extractJsonLegElement('bookingClass')) !== true) {
                return false;
            }
        }
        if (!empty($this->fare_basis)) {
            if (self::textMatch($this->fare_basis, [$rc->fare_basis]) !== true) {
                return false;
            }
        }
        if (!empty($this->cabin_class)) {
            if (self::cabinMatch($this->cabin_class, $rc->cabin_type_id) !== true) {
                return false;
            }
        }
        if (!empty($this->origin_airport)) {
            if (self::airportMatch($this->origin_airport, $rc->origin_id, $rc->destination_id, $rc->origin_id) !== true) {
                return false;
            }
        }
        if (!empty($this->arrival_airport)) {
            if (self::airportMatch($this->arrival_airport, $rc->origin_id, $rc->destination_id, $rc->destination_id) !== true) {
                return false;
            }
        }
        // Filtering based on base fare
        if (!empty($this->biggerThan) && !empty($this->base_fare)) {
            if ($this->biggerThan == self::BIGGER_THAN) {
                if ($this->base_fare > $rc->base_fare) {
                    return false;
                }
            } else {
                if ($this->base_fare < $rc->base_fare) {
                    return false;
                }
            }
        }
        // Filtering based on total fare
        if (!empty($this->biggerThanTotalFare) && !empty($this->total_fare)) {
            if ($this->biggerThanTotalFare == self::BIGGER_THAN) {
                if ($this->total_fare > $rc->total_fare) {
                    return false;
                }
            } else {
                if ($this->total_fare < $rc->total_fare) {
                    return false;
                }
            }
        }

        return true;    // Full match
    }

    /**
     * Include logic filter checks. Stop after first positive check
     * @param \RoutesCache $ab AirBooking object
     * @return boolean True if matching rule is found or the filter is empty
     */
    function matchAirBookingInclude(\AirBooking $ab) {
        if (!empty($this->rule_timings->days)) {
            if ($this->ruleTimingsMatch(\Utils::cutMilliseconds($ab->created)) !== true) {
                return false;
            }
        }
        if (!empty($this->book_date)) {
            if (self::dateMatch($this->book_date, $ab->created) !== true) {
                return false;
            }
        }
        if (!empty($this->onward_date)) {
            if (self::dateMatch($this->onward_date, $ab->departure_ts) !== true) {
                return false;
            }
        }
        if (!empty($this->return_dept_date)) {
            if (self::dateMatch($this->return_dept_date, $ab->returnDate) !== true) {
                return false;
            }
        }
        if (!empty($this->flight)) {
            if (self::flightMatch($this->flight, $ab->getFlighNumberArr()) !== true) {
                return false;
            }
        }
        if (!empty($this->booking_class)) {
            if (self::textMatch($this->booking_class, $ab->getBookingClassArr()) !== true) {
                return false;
            }
        }
        if (!empty($this->fare_basis)) {
            if (self::textMatch($this->fare_basis, [$ab->fare_basis]) !== true) {
                return false;
            }
        }
        if (!empty($this->cabin_class)) {
            if (self::cabinMatch($this->cabin_class, $ab->cabin_type_id) !== true) {
                return false;
            }
        }
        if (!empty($this->origin_airport)) {
            if (!$ab->isReturnBooking && self::airportMatch($this->origin_airport, $ab->source_id, $ab->destination_id, $ab->source_id) !== true) {
                return false;
            }
            if ($ab->isReturnBooking && self::airportMatch($this->origin_airport, $ab->destination_id, $ab->source_id, $ab->destination_id) !== true) {
                return false;
            }
        }
        if (!empty($this->arrival_airport)) {
            if (!$ab->isReturnBooking && self::airportMatch($this->arrival_airport, $ab->source_id, $ab->destination_id, $ab->destination_id) !== true) {
                return false;
            }
            if ($ab->isReturnBooking && self::airportMatch($this->arrival_airport, $ab->destination_id, $ab->source_id, $ab->source_id) !== true) {
                return false;
            }
        }

        // Filtering based on base fare
        if (!empty($this->biggerThan) && !empty($this->base_fare)) {
            if ($this->biggerThan == self::BIGGER_THAN) {
                if ($this->base_fare > $ab->basic_fare) {
                    return false;
                }
            } else {
                if ($this->base_fare < $ab->basic_fare) {
                    return false;
                }
            }
        }
        // Filtering based on total fare
        if (!empty($this->biggerThanTotalFare) && !empty($this->total_fare)) {
            $amount = $ab->totalAmountToPay - $ab->airCart->convenienceFee;
            if ($this->biggerThanTotalFare == self::BIGGER_THAN) {
                if ($this->total_fare > $amount) {
                    return false;
                }
            } else {
                if ($this->total_fare < $amount) {
                    return false;
                }
            }
        }

        return true;    // All match
    }

    private function ruleTimingsMatch($created) {
        $day_of_week = date('N');
        $day_arr = json_decode(json_encode($this->rule_timings->days), true);
        $previous_day = null;
        if ($day_of_week == 1) {
            $previous_day = 7;
        } else {
            $previous_day = $day_of_week - 1;
        }
        $current_date = date('Y-m-d');
        $date = new DateTime($current_date);
        $date->sub(new DateInterval('P1D'));
        $st_date = $date->format('Y-m-d');
        //\Utils::dbgYiiLog(['$previous_day' => $previous_day, '$day_of_week' => $day_of_week]);
        $match = $this->ruleTimingMatchDay($day_arr, $previous_day, $created, $st_date, 1);
        //\Utils::dbgYiiLog(['FirstCheckingMatch' => $match]);
        if ($match === false) {
            //\Utils::dbgYiiLog('Checking Again');
            $match = $this->ruleTimingMatchDay($day_arr, $day_of_week, $created, $current_date, 2);
            //\Utils::dbgYiiLog(['AfterCheckingMatch' => $match]);
        }
        return $match;
    }

    private function ruleTimingMatchDay($day_arr, $day_of_week, $created, $st_date, $flow) {
        //$current_date = date('Y-m-d');
        if (!empty($day_arr[$day_of_week])) {
            $start_time = ' 00:00:00';
            $end_time = ' 23:59:59';

            $start_time_arr = json_decode(json_encode($this->rule_timings->start_time), true);
            $end_time_arr = json_decode(json_encode($this->rule_timings->end_time), true);
            if (!empty($start_time_arr[$day_of_week])) {
                $start_time = ' ' . $start_time_arr[$day_of_week];
            }
            $start_date = $st_date . $start_time;

            if (!empty($end_time_arr[$day_of_week])) {
                $end_time = ' ' . $end_time_arr[$day_of_week];
            }
            $start_time_explode = explode(':', $start_time);
            $start_sec = (int) $start_time_explode[0] * 60 * 60 + (int) $start_time_explode[1] * 60 + (int) $start_time_explode[2];

            $end_time_explode = explode(':', $end_time);
            $end_sec = (int) $end_time_explode[0] * 60 * 60 + (int) $end_time_explode[1] * 60 + (int) $end_time_explode[2];
            if ($end_sec <= $start_sec) {
                $date = new DateTime($st_date);
                $date->add(new DateInterval('P1D'));
                $end_date = $date->format('Y-m-d') . $end_time;
            } else {
                $end_date = $st_date . $end_time;
            }
            //\Utils::dbgYiiLog(['$created' => $created, '$start_date' => $start_date, '$end_date' => $end_date]);
            $datetime = new DateTime($created);
            $created_time = $datetime->getTimestamp();
            
            $datetime = new DateTime($start_date);
            $start_date_time = $datetime->getTimestamp();
            
            $datetime = new DateTime($end_date);
            $end_date_time = $datetime->getTimestamp();
            //\Utils::dbgYiiLog(['$created_time' => $created_time, '$start_date_time' => $start_date_time, '$end_date_time' => $end_date_time]);
            if ($created_time < $start_date_time || $created_time > $end_date_time) {
                return false;
            }
        }
        if($flow === 2) {
            return true;
        }
        return false;
    }

    static function dateMatch($filterDate, $date) {
        if (empty($filterDate)) {
            return true;
        }
        $date = strstr($date, ' ', true) ? : $date;
//        echo "(Testing against=>$date)<br>";
        $dateInteger = strtotime($date);
        $arrDates = array_map('trim', explode(',', $filterDate));
        foreach ($arrDates as $fdate) {
            if (strpos($fdate, '-')) {  // We have date ranges
                list ($lowDate, $highDate) = array_map('trim', explode('-', $fdate));
                $lowDate = strtotime(str_replace('/', '-', $lowDate));
                $highDate = strtotime(str_replace('/', '-', $highDate));
                if ($lowDate <= $dateInteger && $dateInteger <= $highDate) {
                    return true;
                }
            } else {    // Single date
                $fdate = str_replace('/', '-', $fdate);
                if ($fdate == $date) {
                    return true;
                }
            }
        }
        return false;
    }

    static function flightMatch($flightFilter, $arrFlights) {
        foreach ($arrFlights as &$flight) {
            if (strstr($flight, '-')) {
                list ($code, $tmpFlight) = explode('-', $flight);
                $flight = intval($tmpFlight);
            } else {
                $flight = intval($flight);
            }
        }
        $arrFilterFlights = array_map('trim', explode(',', $flightFilter));
        foreach ($arrFilterFlights as $flightFilterElement) {
            if (strpos($flightFilterElement, '-')) {  // We have ranges
                list ($low, $high) = array_map('intval', explode('-', $flightFilterElement));
                foreach ($arrFlights as $value) {
                    if ($low <= $value && $value <= $high) {
                        return true;
                    }
                }
            } else {    // Single flight number
                $flightFilterElement = intval($flightFilterElement);
                if (in_array($flightFilterElement, $arrFlights)) {
                    return true;
                }
            }
        }
        return false;
    }

    static function textMatch($textFilter, $arrTexts) {
        $arrTexts = array_map('trim', $arrTexts);
        $arrFilterTexts = array_map('trim', explode(',', strtoupper($textFilter)));
        foreach ($arrFilterTexts as $textFilterElement) {
            if (in_array($textFilterElement, $arrTexts)) {
                return true;
            }
        }
        return false;
    }

    static function cabinMatch($textFilter, $cabinTypeId) {
        $arrFilterTexts = array_map('trim', explode(',', strtoupper($textFilter)));
        foreach ($arrFilterTexts as $textFilterElement) {
            if (isset(\CabinType::$cabinClassCodeToId[$textFilterElement]) && \CabinType::$cabinClassCodeToId[$textFilterElement] == $cabinTypeId) {
                return true;
            }
        }
        return false;
    }

    static function airportMatch($textFilter, $originAirportId, $destinationAirportId, $singleAirportId) {
        $originAirport = \Airport::model()->cache(3600)->findByPk($originAirportId);
        $destinationAirport = \Airport::model()->cache(3600)->findByPk($destinationAirportId);
        $singleAirport = \Airport::model()->cache(3600)->findByPk($singleAirportId);
        /* @var $originAirport \Airport */
        /* @var $destinationAirport \Airport */
        if ($originAirport === null || $destinationAirport === null || $singleAirport === null) {
            return false;
        }
        $arrFilterTexts = array_map('trim', explode(',', strtoupper($textFilter)));
        foreach ($arrFilterTexts as $textFilterElement) {
            if (strstr($textFilterElement, '-')) {
                // Origin & destination pair to be matched
                list($origin, $destination) = explode('-', $textFilterElement);
                if (((strlen($origin) === 2 && $origin === $originAirport->country_code) ||
                    (strlen($origin) === 3 && $origin === $originAirport->airport_code)) &&
                    ((strlen($destination) === 2 && $destination === $destinationAirport->country_code) ||
                    (strlen($destination) === 3 && $destination === $destinationAirport->airport_code))) {
                    return true;
                }
            } else {    // single element
                if ((strlen($textFilterElement) === 2 && $textFilterElement === $singleAirport->country_code) ||
                    (strlen($textFilterElement) === 3 && $textFilterElement === $singleAirport->airport_code)) {
                    return true;
                }
            }
        }
        return false;
    }

}
