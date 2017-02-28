<?php

/**
 * Description of CommercialFilter
 *
 * @author Boxx
 */
class AirSourceFilter {

    /**
     * @var AirSourceFilterElements $include
     */
    public $include;

    /**
     * @var AirSourceFilterElements $exclude
     */
    public $exclude;

    function __construct($data = null) {
        $this->include = new AirSourceFilterElements;
        $this->exclude = new AirSourceFilterElements;
        if ($data !== null) {
            $data = json_decode($data, true);
            \Utils::setAttributes($this->include, $data['include']);
            \Utils::setAttributes($this->exclude, $data['exclude']);
        }
    }

    function getAsString() {
        return json_encode([
            'include' => $this->include,
            'exclude' => $this->exclude,
        ]);
    }

    function setAttributes($post) {
        \Utils::setAttributes($this->include, $post['include']);
        \Utils::setAttributes($this->exclude, $post['exclude']);
    }

    function getSummary() {
        $strInclude = '';
        $strExclude = '';
        foreach (AirSourceFilterElements::$description as $key => $value) {
            if (!empty($this->include->$key)) {
                $strInclude .= "$key: {$this->include->$key}, ";
            }
            if (!empty($this->exclude->$key)) {
                $strExclude .= "$key: {$this->exclude->$key}, ";
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

}

class AirSourceFilterElements {

    public
            $book_date = '',
            $onward_date = '',
            $return_dept_date = '',
            $origin_airport = '',
            $arrival_airport = '',
            $cabin_class = '';
    static $description = [
        'book_date' => 'book_date',
        'onward_date' => 'onward_date',
        'return_dept_date' => 'return_dept_date',
        'origin_airport' => 'origin_airport',
        'arrival_airport' => 'arrival_airport',
        'cabin_class' => 'Cabin class',
    ];

    /**
     * Exclude logic filter checks. Check all rules or until first exclude match
     * @param \Searches $s Search object
     * @return boolean False if no matching rule is found or the filter is empty
     */
    function matchSearchExclude(\Searches $s) {
        if (!empty($this->book_date) &&
                self::dateMatch($this->book_date, $s->created) === true) {
            return true;
        }
        if (!empty($this->onward_date) &&
                self::dateMatch($this->onward_date, $s->date_depart) === true) {
            return true;
        }
        if (!empty($this->return_dept_date) &&
                self::dateMatch($this->return_dept_date, $s->date_return) === true) {
            return true;
        }
        if (!empty($this->cabin_class) &&
                self::cabinMatch($this->cabin_class, $s->category) === true) {
            return true;
        }
        if (!empty($this->origin_airport) &&
                self::airportMatch($this->origin_airport, $s->origin, $s->destination, $s->origin) === true) {
            return true;
        }
        if (!empty($this->arrival_airport) &&
                self::airportMatch($this->arrival_airport, $s->origin, $s->destination, $s->destination) === true) {
            return true;
        }

        return false;   // No exclude rules found
    }

    /**
     * Include logic filter checks. Stop after first check
     * @param \Searches $s Search object
     * @return boolean True if matching rule is found or the filter is empty
     */
    function matchSearchInclude(\Searches $s) {
        if (!empty($this->book_date)) {
            if (self::dateMatch($this->book_date, $s->created) === true) {
                return true;
            }
        }
        if (!empty($this->onward_date)) {
            if (self::dateMatch($this->onward_date, $s->date_depart) === true) {
                return true;
            }
        }
        if (!empty($this->return_dept_date)) {
            if (self::dateMatch($this->return_dept_date, $s->date_return) === true) {
                return true;
            }
        }
        if (!empty($this->cabin_class)) {
            if (self::cabinMatch($this->cabin_class, $s->category) === true) {
                return true;
            }
        }
        if (!empty($this->origin_airport)) {
            if (self::airportMatch($this->origin_airport, $s->origin, $s->destination, $s->origin) === true) {
                return true;
            }
        }
        if (!empty($this->arrival_airport)) {
            if (self::airportMatch($this->arrival_airport, $s->origin, $s->destination, $s->destination) === true) {
                return true;
            }
        }

        return false;    // No any include rules found
    }

    static function dateMatch($filterDate, $date) {
        if (empty($filterDate)) {
            return true;
        }
        $date = strstr($date, ' ', true) ? : $date;
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

    static function airportMatch($textFilter, $originAirportCode, $destinationAirportCode, $singleAirportCode) {
        $originAirport = \Airport::model()->cache(3600)->findByPk(\Airport::getIdFromCode($originAirportCode));
        $destinationAirport = \Airport::model()->cache(3600)->findByPk(\Airport::getIdFromCode($destinationAirportCode));
        $singleAirport = \Airport::model()->cache(3600)->findByPk(\Airport::getIdFromCode($singleAirportCode));
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
