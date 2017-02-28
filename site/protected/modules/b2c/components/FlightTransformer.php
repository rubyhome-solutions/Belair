<?php

namespace b2c\components;

use b2c\models\Flight;

class FlightTransformer {
	const SHORT_LAYOVER = 'SL';
	const LONG_LAYOVER = 'LL';
	public static $transitvisa_country;
    static $skip = false; // Introduced due to error while Via Airport is not in our DB
	static public function json(Flight $flight) {
		$search = $flight->search;
		$rcs = [ ];
		
		foreach ( $flight->routes as $k => $routes ) {
			$rcs [$k] = [ ];
			
			foreach ( $routes as $i ) {
				$rcs [$k] [] = $i->id;
			}
		}
		$segments = static::itineraryJson ( $flight );
        if(self::$skip) {
            return null;
        }
		return [ 
				'system' => [ 
						'gds' => $flight->isGDS (),
						'search_id' => $search->id,
						'rcs' => $rcs 
				],
				'segments' => $segments,
				'price' => $flight->commercialPrice,
				'taxes' => $flight->taxes,
				'paxTaxes' => $flight->paxTaxes,
				'refundable' => $flight->refundable,
				'cs' => ( int ) $flight->clientSource 
		];
	}
	static public function itineraryJson($flight) {
		$out = [ ];
		foreach ( $flight->routes as $routes ) {
            if(!isset($routes [0])) {
                continue;
            }
            $segment = static::segmentJson($flight, $routes [0]);
            if (self::$skip) {
                break;
            }
            $out [] = $segment;
			
			if ($flight->isGDS () && $flight->isRoundTrip ()) {
                $segment = static::segmentJson ( $flight, $routes [0], true );
                if (self::$skip) {
                    break;
                }
                $out [] = $segment;
			}
            
		}
		
		usort ( $out, function ($a, $b) {
			return strtotime ( $a [0] ['depart'] ) > strtotime ( $b [0] ['depart'] ) ? 1 : - 1;
		} );
		
		return $out;
	}
	
	/**
	 *
	 * @param \RoutesCache $rc        	
	 * @param bool $gds_backward        	
	 * @return object
	 */
	static public function segmentJson($flight, \RoutesCache $rc, $gds_backward = false) {
		$legs = $flight->isGDS () ? json_decode ( $rc->legs_json ) [$gds_backward ? 1 : 0] : json_decode ( $rc->legs_json );
		$arrive = null;
		$arrival = null;
		$carrier = null;
		$segments = [ ];
		
		/* foreach ( $legs as $code ) {
			
			// For testing
			// $code->ts='BLR '.self::addminutes($code->arrive,25).'-'.self::addminutes($code->arrive,40);
			
			if (isset ( $code->ts )) {
				$tstarray = explode ( ' ', $code->ts );
				$tstAirportCode = $tstarray [0];
				// Galileo return only AirportCode, there are no time
				// $tstArrivalTime=explode('-',$tstarray[1])[0];
				// $tstDepartureTime=explode('-',$tstarray[1])[1];
				$origins [] = $code->origin;
				$destinations [] = $tstAirportCode;
				$origins [] = $tstAirportCode;
				$destinations [] = $code->destination;
			} else {
				$origins [] = $code->origin;
				$destinations [] = $code->destination;
			}
		} */
		
		
		/* Loop */
		foreach ( $legs as $a ) {
			if (null !== $arrive) {
				$a->layover = \Utils::convertToHoursMins ( (strtotime ( $a->depart ) - $arrive) / 60 );
			}
			if (! isset ( $a->ts )) {
				$arrive = strtotime ( $a->arrive );
			} else {
				$tsarray = explode ( ' ', $a->ts );
				$tsAirportCode = $tsarray [0];
				// Galileo return only AirportCode, there are no time
				$tsArrivalTime = isset ( $tsarray [1] ) ? self::formatTime ( explode ( '-', $tsarray [1] ) [1] ) : '';
				$tsDepartureTime = isset ( $tsarray [1] ) ? self::formatTime ( explode ( '-', $tsarray [1] ) [0] ) : '';
				$tsAirport = \Airport::model ()->findByAttributes ( [ 
						'airport_code' => $tsAirportCode 
				] );
				$tsDepartureDate = explode ( ' ', $a->depart ) [0];
				$tsArrivalDate = explode ( ' ', $a->depart ) [1];
				$tsdiff = (new \DateTime ( $tsDepartureDate . ' ' . $tsArrivalTime ))->diff ( new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime ) );
				$hours = $tsdiff->format ( '%h' );
				$minutes = $tsdiff->format ( '%i' );
				$mindiff = 60 * $hours + $minutes;
				$tsArrivalDate = date ( 'Y-m-d', strtotime ( $tsDepartureDate . ' ' . $tsDepartureTime . "+" . $mindiff . " minutes" ) );
				if (! $tsdiff->invert) {
					$tsdiff1 = (new \DateTime ( $tsArrivalDate . ' ' . $tsArrivalTime ))->diff ( new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime ) );
					$tslayover = $tsdiff1->format ( '%h' ) . ':' . $tsdiff1->format ( '%i' );
				} else {
					$tslayover = $tsdiff->format ( '%h' ) . ':' . $tsdiff->format ( '%i' );
				}
				if (null !== $arrive) {
					$a->layover = \Utils::convertToHoursMins ( (strtotime ( $a->depart ) - $arrive) / 60 );
				}
			}
			if (isset ( $a->layover )) {
				$layovers [] = $a->layover;
			}
			if (isset ( $tslayover )) {
				$layovers [] = $tslayover;
			}
			/* ORIGINS AND DESTINATIONS */
			if (isset ( $a->ts )) {
				$tstarray = explode ( ' ', $a->ts );
				$tstAirporta = $tstarray [0];
				// Galileo return only Airporta, there are no time
				// $tstArrivalTime=explode('-',$tstarray[1])[0];
				// $tstDepartureTime=explode('-',$tstarray[1])[1];
				$origins [] = $a->origin;
				$destinations [] = $tstAirporta;
				$origins [] = $tstAirporta;
				$destinations [] = $a->destination;
			} else {
				$origins [] = $a->origin;
				$destinations [] = $a->destination;
			}
			/* ORIGINS AND DESTINATIONS */
		}
		
		/* Loop */
		
		$allViaAirports = self::allViaAirports ( $origins, $destinations );
		
		$airport_change = self::airportChange ( $origins, $destinations );
		$transit_visa_message = self::Message ( $origins, $destinations );
        
        if(self::$skip) {
            return false;
        }
        
		$arr_airport_change = self::airportChangeName ( $origins, $destinations );
		$single_airport = self::singleAirportChange ( $origins, $destinations );
		$name_airport_change = isset ( $single_airport ) ? $single_airport : false;
		$formatted_airport_change = ($allViaAirports !== FALSE) ? $allViaAirports : false;
		
		/*
		 * foreach ($legs as $a) {
		 * if (null !== $arrive) {
		 * $a->layover = \Utils::convertToHoursMins((strtotime($a->depart) - $arrive) / 60);
		 * }
		 * $arrive = strtotime($a->arrive);
		 * if (isset($a->layover)) {
		 * $layovers[] = $a->layover;
		 * }
		 * }
		 */
		if (! empty ( $layovers )) {
			$show_layover = self::Layovers ( $layovers );
			$num_layover = self::numLayover ( $layovers );
		} else {
			$show_layover = false;
			$num_layover = false;
		}
		
		foreach ( $legs as $i ) {
            $product_class = isset ( $i->product_class ) ? $i->product_class : null;
			$i->origin = \Airport::model ()->findByAttributes ( [ 
					'airport_code' => static::_apCode ( $i->origin ) 
			] );
			$i->destination = \Airport::model ()->findByAttributes ( [ 
					'airport_code' => static::_apCode ( $i->destination ) 
			] );
			
			if (null !== $arrive) {
				$i->layover = \Utils::convertToHoursMins ( (strtotime ( $i->depart ) - $arrive) / 60 );
			}
            
            $carrier = [
                'code' => $rc->carrier->code,
                'name' => $rc->carrier->name,
                'logo' => $rc->carrier->imageUrl
            ];
            $flight_num_arr = explode('-', $i->flighNumber);
            if (!empty($flight_num_arr[0]) && $flight_num_arr[0] !== $rc->carrier->code) {
                $carrier_obj = \Carrier::model()->findByAttributes(['code' => $flight_num_arr[0]]);

                $carrier = [
                    'code' => $carrier_obj->code,
                    'name' => $carrier_obj->name,
                    'logo' => $carrier_obj->imageUrl
                ];
            }
			
			$techStopDetail = [ ];
			// For Testing
			// $i->ts='BLR '.self::addminutes($i->depart,25).'-'.self::addminutes($i->depart,40);//'BLR 12:00-12:30';
			// \Utils::dbgYiiLog($i->ts);
			
			if (! isset ( $i->ts )) {
				
				$arrive = strtotime ( $i->arrive );
				$time_layover = isset ( $i->layover ) ? self::getTimeLayover ( $i->layover ) : null;
                
				$segments [strtotime ( $i->depart )] = [ 
						'id' => $i->flighNumber . '@' . $rc->air_source_id,
						'from' => static::airportJson ( $i->origin ),
						'to' => static::airportJson ( $i->destination ),
						'originTerminal' => $i->originTerminal,
						'destinationTerminal' => $i->destinationTerminal,
						'arrive' => $i->arrive,
						'depart' => $i->depart,
						'time' => $i->time,
						'layover' => $time_layover,
						'techStop' => isset ( $i->ts ) ? $i->ts : null, // 'BLR 12:00-12:30'
						'techStopDetail' => $techStopDetail,
						'cabinType' => $rc->cabinType->name,
                        'flight' => $i->flighNumber,
						'carrier' => $carrier,
						'airport_change' => $airport_change,
						'name_airport_change' => $arr_airport_change,
						// 'formatted_airport_change'=>$formatted_airport_change,
						'transitvisa_msg' => $transit_visa_message,
						'single_airport_change' => $name_airport_change,
						'allViaAirports' => $formatted_airport_change,
						'show_layover' => $show_layover,
						'num_layover' => $num_layover,
                        'product_class'  =>  $product_class
				];
			} else {
				
				$tsarray = explode ( ' ', $i->ts );
				$tsAirportCode = $tsarray [0];
				
				// Galileo return only AirportCode, there are no time
				$tsArrivalTime = isset ( $tsarray [1] ) ? self::formatTime ( explode ( '-', $tsarray [1] ) [1] ) : '';
				$tsDepartureTime = isset ( $tsarray [1] ) ? self::formatTime ( explode ( '-', $tsarray [1] ) [0] ) : '';
				
				$tsAirport = \Airport::model ()->findByAttributes ( [ 
						'airport_code' => $tsAirportCode 
				] );
				
				$techStopDetail = static::airportJsonforTS ( $tsAirport, $tsDepartureTime, $tsArrivalTime );
				
				$tsDepartureDate = explode ( ' ', $i->depart ) [0];
				$tsArrivalDate = explode ( ' ', $i->depart ) [1];
				
				if (isset ( $tsAirport->timezone ) && isset ( $i->timezone )) {
					$duration1 = (new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime, new \DateTimeZone ( $tsAirport->timezone ) ))->diff ( new \DateTime ( $i->depart, new \DateTimeZone ( $i->timezone ) ) );
					// ->format('%Hh:%Im');
				} else {
					$duration1 = (new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime ))->diff ( new \DateTime ( $i->depart ) );
				}
				$asdiff = $duration1->format ( '%h' ) . ':' . $duration1->format ( '%i' );
				if (! $duration1->invert) {
					$tsDepartureDate = date ( 'Y-m-d', strtotime ( $tsDepartureDate . "+1 days" ) );
					if (isset ( $tsAirport->timezone ) && isset ( $i->timezone )) {
						$duration2 = (new \DateTime ( $i->depart, new \DateTimeZone ( $tsAirport->timezone ) ))->diff ( new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime, new \DateTimeZone ( $i->timezone ) ) );
						// ->format('%Hh:%Im');
					} else {
						$duration2 = (new \DateTime ( $i->depart ))->diff ( new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime ) );
					}
					$asdiff = $duration2->format ( '%h' ) . ':' . $duration1->format ( '%i' );
				}
				$tsdiff = (new \DateTime ( $tsDepartureDate . ' ' . $tsArrivalTime ))->diff ( new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime ) );
				$hours = $tsdiff->format ( '%h' );
				$minutes = $tsdiff->format ( '%i' );
				$mindiff = 60 * $hours + $minutes;
				$tsArrivalDate = date ( 'Y-m-d', strtotime ( $tsDepartureDate . ' ' . $tsDepartureTime . "+" . $mindiff . " minutes" ) );
				if (! $tsdiff->invert) {
					
					$tsdiff1 = (new \DateTime ( $tsArrivalDate . ' ' . $tsArrivalTime ))->diff ( new \DateTime ( $tsDepartureDate . ' ' . $tsDepartureTime ) );
					$tslayover = $tsdiff1->format ( '%h' ) . ':' . $tsdiff1->format ( '%i' );
				} else {
					$tslayover = $tsdiff->format ( '%h' ) . ':' . $tsdiff->format ( '%i' );
				}
				
				if (null !== $arrive) {
					$i->layover = \Utils::convertToHoursMins ( (strtotime ( $i->depart ) - $arrive) / 60 );
				}
				$time_layover = isset ( $i->layover ) ? self::getTimeLayover ( $i->layover ) : null;
				$arrive = strtotime ( $i->arrive );
				$segments [strtotime ( $i->depart )] = [ 
						'id' => $i->flighNumber . '@' . $rc->air_source_id,
						'from' => static::airportJson ( $i->origin ),
						'to' => static::airportJson ( $tsAirport ),
						'originTerminal' => $i->originTerminal,
						'destinationTerminal' => '',
						'arrive' => $tsDepartureDate . ' ' . $tsDepartureTime,
						'depart' => $i->depart,
						'time' => $asdiff,
                    /* 'layover' => isset($i->layover) ? $i->layover : null, */
                        'layover' => $time_layover,
						'techStop' => isset ( $i->ts ) ? $i->ts : null, // 'BLR 12:00-12:30'
						'techStopDetail' => $techStopDetail,
						'cabinType' => $rc->cabinType->name,
						'flight' => $i->flighNumber,
						'carrier' => $carrier,
						'airport_change' => $airport_change,
						'name_airport_change' => $arr_airport_change,
						// 'formatted_airport_change'=>$formatted_airport_change,
						'transitvisa_msg' => $transit_visa_message,
						'single_airport_change' => $name_airport_change,
						'allViaAirports' => $formatted_airport_change,
						'show_layover' => $show_layover,
						'num_layover' => $num_layover,
                        'product_class'  =>  $product_class
				];
				
				if (isset ( $tsAirport->timezone ) && isset ( $i->timezone )) {
					$duration1 = (new \DateTime ( $tsArrivalDate . ' ' . $tsArrivalTime, new \DateTimeZone ( $tsAirport->timezone ) ))->diff ( new \DateTime ( $i->arrive, new \DateTimeZone ( $i->timezone ) ) );
					// ->format('%Hh:%Im');
				} else {
					$duration1 = (new \DateTime ( $tsArrivalDate . ' ' . $tsArrivalTime ))->diff ( new \DateTime ( $i->arrive ) );
				}
				$segments [strtotime ( $tsArrivalDate . ' ' . $tsArrivalTime )] = [ 
						'id' => $i->flighNumber . '@' . $rc->air_source_id,
						'from' => static::airportJson ( $tsAirport ),
						'to' => static::airportJson ( $i->destination ),
						'originTerminal' => '',
						'destinationTerminal' => $i->destinationTerminal,
						'arrive' => $i->arrive,
						'depart' => $tsArrivalDate . ' ' . $tsArrivalTime,
						'time' => $duration1->format ( '%h' ) . ':' . $duration1->format ( '%i' ),
						'layover' => $tslayover,
						'techStop' => isset ( $i->ts ) ? $i->ts : null, // 'BLR 12:00-12:30'
						'techStopDetail' => $techStopDetail,
						'cabinType' => $rc->cabinType->name,
						'flight' => $i->flighNumber,
						'carrier' => $carrier,
						'airport_change' => $airport_change,
						'name_airport_change' => $arr_airport_change,
						// 'formatted_airport_change'=>$formatted_airport_change,
						'transitvisa_msg' => $transit_visa_message,
						'single_airport_change' => $name_airport_change,
						'allViaAirports' => $formatted_airport_change,
						'show_layover' => $show_layover,
						'num_layover' => $num_layover,
                        'product_class'  =>  $product_class
				];
			}
		}
		// \Utils::dbgYiiLog($segments);
		
		ksort ( $segments );
		//\Utils::dbgYiiLog($segments);
		return array_values ( $segments );
	}
	static function addminutes($datetime, $minutes) {
		$date = explode ( ' ', $datetime ) [0];
		$time = explode ( ' ', $datetime ) [1];
		$timehours = explode ( ':', $time ) [0];
		$timeminutes = ( int ) explode ( ':', $time ) [1] + $minutes;
		if ($timeminutes < 10) {
			$timeminutes = '0' . $timeminutes;
		}
		if ($timeminutes >= 60) {
			$timeminutes = $timeminutes - 60;
			if ($timeminutes < 10) {
				$timeminutes = '0' . $timeminutes;
			}
			$timehours = ( int ) $timehours + 1;
			if ($timehours > 23) {
				$timehours = $timehours - 24;
			}
			if ($timehours < 10) {
				$timehours = '0' . ( int ) $timehours;
			}
		}
		
		return $timehours . ':' . $timeminutes;
	}
	static function formatTime($time) {
		$timehours = explode ( ':', $time ) [0];
		$timeminutes = ( int ) explode ( ':', $time ) [1];
		if ($timeminutes < 10) {
			$timeminutes = '0' . $timeminutes;
		}
		if ($timeminutes >= 60) {
			$timeminutes = 60 - $timeminutes;
			$timehours = ( int ) $timehours + 1;
			if ($timehours < 10) {
				$timehours = '0' . $timehours;
			}
		}
		
		return $timehours . ':' . $timeminutes;
	}
	/**
	 *
	 * @param \AirPort $ap        	
	 * @return mixed
	 */
	static public function airportJson($ap) {
		return [ 
				'country' => $ap->country_code,
				'city' => $ap->city_name,
				'airportCode' => $ap->airport_code,
				'airport' => $ap->airport_name 
		];
	}
	
	/**
	 *
	 * @param \AirPort $ap        	
	 * @param string $arrival        	
	 * @param string $departure        	
	 * @return mixed
	 */
	static public function airportJsonforTS($ap, $arrival, $departure) {
		return [ 
				'country' => $ap->country_code,
				'city' => $ap->city_name,
				'airportCode' => $ap->airport_code,
				'airport' => $ap->airport_name,
				'arrival' => $arrival,
				'departure' => $departure 
		];
	}
	
	/**
	 *
	 * @param string $airport        	
	 * @return mixed
	 */
	static protected function _apCode($airport) {
		preg_match ( '/.*\((.*)\)$/', $airport, $m );
		return $m [1];
	}
	private function getTimeLayover($x) {
		$x1 = explode ( ":", $x );
		if (( int ) $x1 [0] >= 0 && ( int ) $x1 [1] >= 0) {
			return $x;
		} else {
			return NULL;
		}
	}
	private function numLayover($x) {
		foreach ( $x as $time ) {
			$time1 = explode ( ":", $time );
			$minutes [] = 60 * $time1 [0] + $time1 [1];
		}
		/* $i=0;$j=0; */
		foreach ( $minutes as $minute ) {
			if (intval ( $minute ) <= 119) {
				$i [] = $minute;
			}
			if (intval ( $minute ) >= 300) {
				$j [] = $minute;
			}
		}
		if (isset ( $i )) {
			if (count ( $i ) > 0) {
				$count_short = count ( $i );
			} else {
				$count_short = false;
			}
		} else {
			$count_short = false;
		}
		if (isset ( $j )) {
			if (count ( $j ) > 0) {
				$count_long = count ( $j );
			} else {
				$count_long = false;
			}
		} else {
			$count_long = false;
		}
		$arr = array (
				'short' => $count_short,
				'long' => $count_long 
		);
		return $arr;
	}
	private function Layovers($x) {
		foreach ( $x as $time ) {
			$time1 = explode ( ":", $time );
			$minutes [] = 60 * $time1 [0] + $time1 [1];
		}
		foreach ( $minutes as $minute ) {
			if (( int ) $minute <= 119) {
				$lay [] = self::SHORT_LAYOVER;
			}
			if (( int ) $minute >= 300) {
				$lay [] = self::LONG_LAYOVER;
			}
		}
		if (! empty ( $lay )) {
			return array_reverse ( array_unique ( $lay ) );
		} else {
			return false;
		}
	}
	private function allViaAirports($origins, $destinations) {
		for($i = 0; $i < count ( $origins ); $i ++) {
			if (isset ( $origins [$i] )) {
				$arr_final [] = trim ( substr ( $origins [$i], - 4, 3 ) );
			}
			if (isset ( $destinations [$i] )) {
				$arr_final [] = trim ( substr ( $destinations [$i], - 4, 3 ) );
			}
		}
		$result = array_unique ( $arr_final );
		if (! empty ( $result )) {
			return implode ( ",", array_slice ( $result, 1, - 1 ) );
		} else {
			return false;
		}
	}
	private function airportChange($origins, $destinations) {
		$x1 = count ( $origins );
		$x2 = count ( $destinations );
		$a = 0;
		for($i = 0; $i < $x2; $i ++) {
			if (isset ( $origins [$i + 1] )) {
				$b1 = trim ( substr ( $origins [$i + 1], - 4, 3 ) );
				$b2 = trim ( substr ( $destinations [$i], - 4, 3 ) );
				if ($b1 != $b2) {
					$change_airport = "Airport Change";
				}
			}
		}
		if (isset ( $change_airport )) {
			return $change_airport;
		}
		return false;
	}
	private function airportChangeName($origins, $destinations) {
		$x1 = count ( $origins );
		$x2 = count ( $destinations );
		$a = 0;
		for($i = 0; $i < $x2; $i ++) {
			if (isset ( $origins [$i + 1] )) {
				$b1 = trim ( substr ( $origins [$i + 1], - 4, 3 ) );
				$b2 = trim ( substr ( $destinations [$i], - 4, 3 ) );
				if ($b1 != $b2) {
					$a1 [] = $b2;
					$a1 [] = $b1;
				}
			}
		}
		if (! empty ( $a1 )) {
			return $a1;
		}
		return false;
	}
	private function singleAirportChange($origins, $destinations) {
		$x1 = count ( $origins );
		$x2 = count ( $destinations );
		$a = 0;
		for($i = 0; $i < $x2; $i ++) {
			if (isset ( $origins [$i + 1] )) {
				$b1 = trim ( substr ( $origins [$i + 1], - 4, 3 ) );
				$b2 = trim ( substr ( $destinations [$i], - 4, 3 ) );
				if ($b1 != $b2) {
					$a1 [] = array (
							$b2 
					);
				}
			}
		}
		if (isset ( $a1 )) {
			return array_reverse ( $a1 [0] );
		}
		return false;
	}
	private function getCountry($y) {
		$a = \Yii::app ()->db->createCommand ()->select ( "country_code" )->from ( "airport" )->where ( 'airport_code=:abc', array (
				':abc' => $y 
		) )->queryAll ();
        if(count($a) == 0) {
            \Utils::dbgYiiLog("Airport Code Not Found=>$y");
            self::$skip = true;
            return false;
        }
		$x = $a [0] ['country_code'];
		// \Utils::dbgYiiLog($x);
		$europian_countries = array ("AT","BE","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","SK","SI","ES","SE","CH");
		if (in_array ( $x, $europian_countries )) {
			return "EUC"; /* EUROPIAN COUNTRIES  */
		}
		return $x;
	}
	
	/**
	 * Added by Satender
	 * Purpose : Code Refactoring
	 *
	 * @param unknown $arr_final
	 *        	=> Reference Array
	 * @param unknown $airport_code        	
	 */
	private function inlineMessage(&$arr_final, $airport_code) {
		$airport_code = trim ( substr ( trim($airport_code), - 4, 3 ) );
		$arr_final [$airport_code] = $airport_code;
	}
	public function Message($origins, $destinations) {
		$_origin_cnt = count ( $origins );
		$i = 0;
		$flag_europe = false;
		$arr_final = [ ];
		$country_codes = [ ];
		for($j = 0; $j < $_origin_cnt; $j ++) {
			if (isset ( $origins [$j] )) {
				$airport_code = $origins [$j];
				self::inlineMessage ( $arr_final, $airport_code );
			}
			if (isset ( $destinations [$j] )) {
				$airport_code = $destinations [$j];
				self::inlineMessage ( $arr_final, $airport_code );
			}
		}
		
		foreach ( $arr_final as $airport_code ) {
			$code = self::getCountry ( $airport_code );
            if(self::$skip) {
                break;
            }
			$country_codes [$code] = $code;
		}
		if(self::$skip) {
            return false;
        }
		return self::reuseMessage ( $country_codes );
	}
	private function changeMessageFormat($x) {
		$str = $x;
		$str1 = explode ( ",", $str );
		if (count ( $str1 ) > 1) {
			for($i = 0; $i < count ( $str1 ); $i ++) {
				if ($i == (count ( $str1 ) - 1)) {
					$final [] = "and";
				}
				$final [] = $str1 [$i];
			}
			return implode ( " ", $final );
		} else {
			return $str;
		}
	}
	private function reuseMessage($country_codes) {
		$destination = end($country_codes);
		$country_codes = array_slice ( $country_codes, 1, - 1 );
		if($destination == "US" || $destination == "CA")
		{
			foreach ( $country_codes as $code ) {
				if ($code == "CA") {
					$canada = true;
				}
				if ($code == "US") {
					$usa = true;
				}
				if ($code == "AU") {
					$australia = true;
				}
			}
		}
		else {
			foreach ( $country_codes as $code ) {
				if ($code == "CA") {
					$canada = true;
				}
				if ($code == "GB") {
					$uk = true;
				}
				if ($code == "US") {
					$usa = true;
				}
				if ($code == "AU") {
					$australia = true;
				}
				if ($code == "EUC") {
					$europian = true;
				}
			}
		}
		$message = "";
		if (isset ( $canada )) {
			$message .= " Canada,";
		}
		if (isset ( $uk )) {
			$message .= " United Kingdom,";
		}
		if (isset ( $usa )) {
			$message .= " USA,";
		}
		if (isset ( $australia )) {
			$message .= " Australia,";
		}
		
		if (isset ( $europian )) {
			$message .= " Schengen Countries,";
		}
		
		if ($message !== "") {
			$message = "Transit visa might be required for " . $message;
			$m = substr_replace ( $message, "", - 1 );
			$m .= ".";
			return self::changeMessageFormat ( $m );
		} else {
			return false;
		}
	}
}