<?php

set_time_limit(36000); //10 hours

/**
 * Support commands
 */
class SupportCommand extends CConsoleCommand {

    private $start_timer;
    private $txtHelp = array(
        "\nSupport utility usage:",
        "\tobtainStates - fill in the missing states",
        "\tobtainCities - fill in the missing cities",
        "\timportXLS - Import the xls file provided by Michael",
        "\trefreshCityGoAir - Refresh the city pairs of GoAir",
        "\tbalanceCheck - Refresh the scrappers balances",
        "\trefreshCityPairs - Refresh the city pairs, where the backend supports it",
        "\tset3dStatus - Set the correct 3DS status to the cards without status that had successfull transactions",
        "\tsetAirBookingsAndAirRoutesOrder - Set the order of the bookings according to the Air Routes",
        "\tmarkFraudRelatedAsFraud - Mark the fraud related bookings as fraud",
        "\tclearOldBalances - Clear old outstanding balances",
        "\temailsLongList - Return list of emails of the clients registered after specific date - excluding the fraudsters",
        "\tgetBookingCostOfCS - Calculates the cost of redirect based client source averaged on date",
        "\tfreeOldFrauds - Free the IPs of the frauds older than 6 months",
    );

    /**
     * Refresh the scrappers balances
     */
    static function balanceCheck() {
        echo "\nStarting " . __METHOD__ . "\n";
        $sources = \AirSource::model()->findAllBySql(
                "SELECT air_source.*, backend.balance FROM air_source
                    JOIN backend ON (air_source.backend_id=backend.id)
                    WHERE backend.balance is NOT NULL AND backend.balance<>'' AND air_source.is_active=1
                ");
        foreach ($sources as $source) {
            /* @var $source AirSource */
            $params = ['credentials' => ['username' => $source->username, 'password' => $source->password, 'timeout' => 60]];
            $params = str_replace('"', '\"', json_encode($params));
            $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $source->balance;
//            echo "Running: $script\nParams: " . json_encode($params) . "\n\n";

            unset($output);
            exec(PHP_PATH . "\"$script\" " . $params, $output, $status);
            if ($status == 0) {
                // Normal execution place the balance into the database
//                echo "Output: " . print_r($output, true);
                $res = json_decode($output[0], true);
                if (!isset($res['balance'])) {
                    Utils::dbgYiiLog($source->name . " Balance check error: No balance element! Raw dump: " . $output[0]);
                    continue;
                }
//                echo "Result: " . print_r($res, true);
                $balance = str_replace(",", "", $res['balance']);
                echo "Balance: " . print_r($balance, true) . PHP_EOL;
                \AirSource::model()->cache(3600)->updateByPk($source->id, ['balance' => $balance]);
                // Update the linked balances
                \AirSource::model()->cache(3600)->updateAll(['balance' => $balance], 'balance_link = :balanceSource', [':balanceSource' => $source->id]);
            }
        }
    }

    /**
     * Set the 3DS status for the cards that has none, but have meaningful transactions.
     * @param \PayGateLog $pgl The transaction to process in case of a single transaction.<br>
     * No echo output is returned if this parameter is present
     */
    static function set3dStatus(\PayGateLog &$pgl = null) {
        if ($pgl === null) {
            echo "\nStarting " . __METHOD__ . "\n";
            $transactions = \PayGateLog::model()->findAllBySql(
                    "SELECT * FROM pay_gate_log
                    WHERE cc_id IS NOT NULL
                    AND status_3d IS NULL
                    AND status_id IN (:s1, :s2);", [
                ':s1' => \TrStatus::STATUS_SUCCESS,
                ':s2' => \TrStatus::STATUS_FAILURE,
                    ]
//                    JOIN cc ON (cc.id=pay_gate_log.cc_id)
            );
            echo "Number of trasactions to process: " . count($transactions) . PHP_EOL;
        } else {
            // Exit if there is no CC
            if (empty($pgl->cc_id)) {
                return;
            }
            // Exit if Transaction status is already decided
            if (!empty($pgl->status_3d)) {
                return;
            }
            $transactions = [$pgl];
        }
        $updatedCc = 0;
        $updatedTransactions = 0;
        foreach ($transactions as $transaction) {
            /* @var $transaction \PayGateLog */
            if (in_array($transaction->pg_id, \PaymentGateway::$payuIdList) && $transaction->status_id === \TrStatus::STATUS_SUCCESS) {
                // All PayU transactions are 3DS
                $cardStatus = \Cc::STATUS3D_Y;
                $pgStatus = \Cc::STATUS3D_Y;
            } else {
                $rawData = json_decode($transaction->raw_response);
                if (isset($rawData->vpc_3DSenrolled)) {
                    $cardStatus = trim($rawData->vpc_3DSenrolled);
                }
                if (isset($rawData->vpc_3DSstatus)) {
                    $pgStatus = trim($rawData->vpc_3DSstatus);
                }
                if (isset($rawData->vpc_VerStatus)) {
                    $pgStatus = trim($rawData->vpc_VerStatus);
                }
            }
            // AMEX auto-assign 3DS
            if (!isset($pgStatus) && in_array($transaction->pg_id, \PaymentGateway::$amexIdList)) {
                $pgStatus = \Cc::STATUS3D_N;
            }
            // Update the card
            if (isset($cardStatus)) {
                \Cc::model()->updateByPk($transaction->cc_id, ['status_3d' => \Cc::$status3DmapToId[$cardStatus]]);
                $updatedCc++;
            }
            // Update the transaction
            if (isset($pgStatus) && isset(\Cc::$status3DmapToId[$pgStatus])) {
                $transaction->status_3d = \Cc::$status3DmapToId[$pgStatus];
                $transaction->update(['status_3d']);
                $updatedTransactions++;
            }
            unset($cardStatus);
            unset($pgStatus);
        }
        if ($pgl === null) {
            echo "CCs updated: $updatedCc \t Transactions updated: $updatedTransactions\n";
        } else {
            // Set the auto ticket issue flag
            $transaction->setAutoTicketIssueFlag();
        }
    }

    static function importXLS() {
        echo "\nStarting " . __METHOD__ . "\n";
        include(Yii::getPathOfAlias("application.vendor.PHPexcel.Classes") . '/PHPExcel.php');
        if (PHP_OS == 'Linux')
            $dataFfile = '/belair/test_data.xls';
        else
            $dataFfile = "e:/tmp/belair/test_data_small.xls";

        $objPHPExcel = PHPExcel_IOFactory::load($dataFfile);
        $sheet = $objPHPExcel->getActiveSheet();
//        $data = $sheet->rangeToArray('A2:AB137');
        $data = $sheet->rangeToArray('A2:AB5523');
        echo "Rows available: " . count($data) . "\n";

        /* XLS Data format
          [0] => ID
          [1] => Type
          [2] => Name
          [3] => Email
          [4] => Mobile
          [5] => Enabled
          [6] => Last Transac. Dt.
          [7] => Last Login Dt.
          [8] => Creation Dt.
          [9] => Activation Dt.
          [10] => Deactivation Dt.
          [11] => Reporting Country
          [12] => Reporting State
          [13] => Reporting City
          [14] => Street
          [15] => City
          [16] => State
          [17] => Pincode
          [18] => Country
          [19] => Distributor
          [20] => Sales Rep.
          [21] => PAN Name
          [22] => PAN Number
          [23] => Rep Name
          [24] => Rep Mobile
          [25] => Rep Email
          [26] => User Deposit
          [27] => User Deposit Limit
         */
        $count = 0;
        $distributors = array();
        $agentUnderDistributor = array();
        $start_timer_small = microtime(true);
        foreach ($data as $row) {
            unset($dataParsed);
            $dataParsed['ID'] = Utils::str2num($row[0]);
            $dataParsed['cmpType'] = self::getUserTypeIDByName($row[1]);
            $dataParsed['cmpName'] = $row[2];
            $dataParsed['cmpEmail'] = $row[3];
            if ($dataParsed['cmpType'] === false || empty($dataParsed['cmpEmail']))   // Skip this record
                continue;
            $dataParsed['cmpMobile'] = Utils::str2num($row[4]);
            $dataParsed['enabled'] = $row[5] == 'Enabled' ? 1 : 0;
            $dataParsed['lastTransaction'] = Utils::dmyyyy2yyyymd($row[6]);
            $dataParsed['lastLogin'] = Utils::dmyyyy2yyyymd($row[7]);
            $dataParsed['creation'] = Utils::dmyyyy2yyyymd($row[8]);
            $dataParsed['activation'] = Utils::dmyyyy2yyyymd($row[9]);
            $dataParsed['deactivation'] = Utils::dmyyyy2yyyymd($row[10]);
//            $dataParsed[''] = $row[11];
//            $dataParsed[''] = $row[12];
            $dataParsed['cmpCity'] = self::getCityIDByName($row[13]);
            $dataParsed['cmpAddress'] = $row[14];
            $dataParsed['city'] = empty($row[15]) ? $dataParsed['cmpCity'] : self::getCityIDByName($row[15]);
            $dataParsed['cmpPincode'] = Utils::str2num($row[17]);
            $dataParsed['distributor'] = $row[19];
            $dataParsed['salesRep'] = $row[20];
            $dataParsed['cmpPanName'] = $row[21];
            $dataParsed['cmpPanNumber'] = $row[22];
            $dataParsed['name'] = empty($row[23]) ? $dataParsed['cmpName'] : $row[23];
            $dataParsed['mobile'] = empty($row[24]) ? $dataParsed['cmpMobile'] : Utils::str2num($row[24]);
            $dataParsed['email'] = empty($row[25]) ? $dataParsed['cmpEmail'] : $row[25];
            $dataParsed['cmpBalance'] = Utils::str2num($row[26]);
            $dataParsed['cmpCreditLimit'] = Utils::str2num($row[27]);

            // Remove Unset
            foreach ($dataParsed as $key => $value) {
                if ($value == 'Unset' || $value === '')
                    $dataParsed[$key] = null;
            }

            // Company data
            $userInfo = UserInfo::model()->findByAttributes(array('email' => $dataParsed['cmpEmail']));
            if ($userInfo) { // Skip the record if exists
                echo "Duplicate company email: {$dataParsed['cmpEmail']} \n";
                continue;
            }
            $userInfo = new UserInfo;
            $userInfo->email = $dataParsed['cmpEmail'];
            $userInfo->name = $dataParsed['cmpName'];
            $userInfo->mobile = $dataParsed['cmpMobile'];
            $userInfo->user_type_id = $dataParsed['cmpType'];
            $userInfo->note = $dataParsed['ID'];
            $userInfo->city_id = $dataParsed['cmpCity'];
            $userInfo->address = $dataParsed['cmpAddress'];
            $userInfo->pincode = $dataParsed['cmpPincode'];
            $userInfo->pan_name = $dataParsed['cmpPanName'];
            $userInfo->pan_number = $dataParsed['cmpPanNumber'];
            $userInfo->balance = $dataParsed['cmpBalance'];
            $userInfo->credit_limit = $dataParsed['cmpCreditLimit'];
            // Insert emulation
//            $userInfo->id = $count;
            $userInfo->insert();

            // User data
            $user = Users::model()->findByAttributes(array('email' => $dataParsed['email']));
            if ($user) {    // Skip the record if exists
                $userInfo->delete();
                echo "Duplicate user email: {$dataParsed['email']} \n";
                continue;
            }
            $user = new Users;
            $user->user_info_id = $userInfo->id;
            $user->email = $dataParsed['email'];
            $user->mobile = $dataParsed['mobile'];
            $user->name = $dataParsed['name'];
            $user->enabled = $dataParsed['enabled'];
            $user->last_transaction = $dataParsed['lastTransaction'];
            $user->last_login = $dataParsed['lastLogin'];
            $user->created = $dataParsed['creation'];
            $user->activated = $dataParsed['activation'];
            $user->deactivated = $dataParsed['deactivation'];
            $user->city_id = $dataParsed['city'];
            $user->sales_rep = $dataParsed['salesRep'];
            $user->insert();

            $count++;
            if ($dataParsed['distributor'])
                $agentUnderDistributor[$userInfo->id] = substr($dataParsed['distributor'], 1);
            if ($dataParsed['cmpType'] === UserType::distributor)
                $distributors[$dataParsed['ID']] = $userInfo->id;

            if ($count % 50 === 0) {
                echo "Rows processed: $count, Time used: " . round((microtime(true) - $start_timer_small), 4) . " sec.\n";
                $start_timer_small = microtime(true);
            }

//            $out[] = $dataParsed;
//            print_r($dataParsed);
        }
        echo "Distributors:\n";
        print_r($distributors);

        // Manage the agents under the distributers
        foreach ($agentUnderDistributor as $agentId => $distributorId) {
            if (isset($distributors[(int) $distributorId])) {
                $agentUnderDistributor[$agentId] = $distributors[(int) $distributorId];

                $userInfo = UserInfo::model()->findByPk($agentId);
                $userInfo->user_type_id = UserType::agentUnderDistributor;
                $userInfo->save();
                SubUsers::model()->deleteAllByAttributes(array('reseller_id' => $userInfo->id));
                $subUser = new SubUsers;
                $subUser->reseller_id = $userInfo->id;
                $subUser->distributor_id = (int) $distributors[(int) $distributorId];
                $subUser->save();
            }
        }
        echo "Agents under distributors:\n";
        print_r($agentUnderDistributor);
    }

    static function getCityIDByName($cityName) {
        // Return New Delhi in case of missing city
        if (empty($cityName))
            return City::NEW_DELHI_ID;
//        $criteria = new CDbCriteria(array('order'=>'id'));
        $city = \City::model()->cache(3600)->findBySql('
            SELECT * from city
            WHERE LOWER("name") = :name
            ORDER BY id;
            ', array(':name' => strtolower($cityName)));
        if ($city)
            return $city->id;
        else
            return City::NEW_DELHI_ID;
//            return "ERROR: The city ***{$cityName}*** can not be found!";
    }

    static function getUserTypeIDByName($typeName) {
        $typeName = strtolower($typeName);
        // Return New Delhi in case of missing city
        if (empty($typeName) || $typeName == 'agent')
            return UserType::agentDirect;
        elseif ($typeName == 'staff')
            return UserType::supervisorStaff;
        elseif ($typeName == 'distributor')
            return UserType::distributor;
        elseif ($typeName == 'web')
            return UserType::clientB2C;
        else {
            echo "ERROR: The user type ***{$typeName}*** can not be found!\n";
            return false;
        }
    }

    static function obtainStates() {
        echo "\nStarting " . __METHOD__ . "\n";

        // Get only the countries that are not present in the states table
        $countries = \Country::model()->cache(3600)->findAllBySql('
                        SELECT * FROM country
                        WHERE id not in
                        (SELECT distinct country_id FROM state)');
        echo "Count of countries to fill the states for => " . count($countries) . "\n\n";

        $i = 1;
        foreach ($countries as $country) {
            echo "$i.\t$country->name\t";
            $i++;
            $url = 'https://www.belair.in/nav/json_location/20/' . $country->code;
            $states = self::getBelairData($url);
            echo "States: " . count($states);
//            print_r($states);
//            exit;
            $inserted = 0;
            foreach ($states as $state) {
                if (!\State::model()->cache(3600)->findByPk($state['i'])) {
                    $model = new State;
                    $model->id = $state['i'];
                    $model->name = $state['n'];
                    $model->country_id = $country->id;
                    $model->save();
                    $inserted++;
                }
            }
            echo "\tNew states inserted: $inserted\n";


//            print_r($arrRoles);
//            echo "\n";
        }
    }

    static function refreshCityGoAir() {
        echo "\nStarting " . __METHOD__ . "\n";
        $count = \CityPairs::model()->countByAttributes(['carrier_id' => Carrier::CARRIER_GOAIR]);
        echo "Exisitng city pairs: $count\n";
        $api = new application\components\Goair\production\GoAir(application\components\Goair\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID);
        $ports = $api->getOriginAirports();
        foreach ($ports as $origin) {
            $pairs[$origin] = $api->getDestinationAirports($origin);
//            echo "Origin: $origin , Destinations: " . count($pairs[$origin]) . "\n";
            foreach ($pairs[$origin] as $destination) {
                self::createOrUpdateCityPairs($origin, $destination, \Carrier::CARRIER_GOAIR);
            }
        }
        // Clear the older city pairs
        echo "Deleted old city pairs: " . self::deleteOldCityPairs() . PHP_EOL;
    }

    /**
     * Crete new or update old city pair
     * @param int $origin Port of origination
     * @param int $destination Destination airport
     * @param int $carrierId Carrier ID
     */
    private static function createOrUpdateCityPairs($origin, $destination, $carrierId) {
        $modelOrigin = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $origin]);
        if ($modelOrigin === null) {
            echo "Unknown origin => $origin Skipping!\n";
            return false;
        }
        $modelDestination = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $destination]);
        if ($modelDestination === null) {
            echo "Unknown destination => $destination Skipping!\n";
            return false;
        }
        $model = \CityPairs::model()->findByAttributes([
            'carrier_id' => $carrierId,
            'destination_id' => $modelDestination->id,
            'source_id' => $modelOrigin->id,
        ]);
        if ($model === null) {
            $model = new CityPairs;
            $model->carrier_id = $carrierId;
            $model->source_id = $modelOrigin->id;
            $model->destination_id = $modelDestination->id;
            $model->insert();
        } else {
            $model->created = date(DATETIME_FORMAT);
            $model->update(['created']);
        }
    }

    private static function deleteOldCityPairs() {
        return \CityPairs::model()->deleteAll("created + interval '60 days' < 'today'");
    }

    static function refreshCityPairs() {
        echo "\nStarting " . __METHOD__ . "\n";
        $backends = \Backend::model()->findAll('city_pairs IS NOT NULL AND carrier_id IS NOT NULL');
        foreach ($backends as $backend) {
            $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $backend->city_pairs;
            echo $backend->carrier->name;
            self::injectCityPairs($script, $backend->carrier_id);
        }
        // Clear the older city pairs
//        echo "Deleted old city pairs: " . self::deleteOldCityPairs() . PHP_EOL;
    }

    private static function injectCityPairs($script, $carrierId) {
        $count = \CityPairs::model()->countByAttributes(['carrier_id' => $carrierId]);
        echo " Exisitng city pairs for carrier #{$carrierId}: $count\t";
        $output = [];
        exec(PHP_PATH . "\"$script\" 2>&1", $output, $status);
        if ($status != 0) {     // We have error
            echo $output[0];
            return false;
        }
        if (!isset($output[0])) {
            echo "Incorrect output: " . print_r($output, true);
            return false;
        }
        $ports = json_decode($output[0], true);
        echo "Number of originating ports: " . count($ports) . PHP_EOL;
//        print_r($ports);
//        $chekedCities = [];
//        $checkedOrigins = [];
        foreach ($ports as $origin => $destSet) {
            foreach ($destSet as $destination) {
//                if (empty($ports[$destination]) && empty($checkedOrigins[$destination])) {
//                    echo "Missing origin: $destination\n";
//                    $checkedOrigins[$destination] = true;
//                }
//                $airPorts = \Airport::model()->cache(3600)->cache(3600)->findAllByAttributes(['city_name' => $destination]);
//                if (count($airPorts) > 1) {
//                    if (empty($chekedCities[$destination])) {
//                        echo "Multiple airports for -={$destination}=- : ";
//                        $chekedCities[$destination] = true;
//                        foreach ($airPorts as $port) {
//                            echo $port->airport_code . " ";
//                        }
//                        echo "\n";
//                    }
//                }
                self::createOrUpdateCityPairs(trim($origin), trim($destination), $carrierId);
            }
        }
//        print_r($pairs);
    }

    static function obtainCities() {
        echo "\nStarting " . __METHOD__ . "\n";

        // Get only the countries that are not present in the states table
        $states = \State::model()->cache(3600)->findAllBySql('
                        SELECT * FROM state
                        WHERE id not in
                            (SELECT distinct state_id FROM city)
                        ORDER BY id');
        echo "Count of states to fill the cities for => " . count($states) . "\n\n";

        $i = 1;
        foreach ($states as $state) {
            echo "$i.\t$state->name\t";
            $i++;
            $url = 'https://www.belair.in/nav/json_location/30/' . $state->country->code . '/' . $state->id;
            $cities = self::getBelairData($url);
            echo "Cities: " . count($cities);
//            print_r($cities);
//            exit;
            $inserted = 0;
            foreach ($cities as $city) {
                if (!City::model()->findByPk($city['i'])) {
                    $model = new City;
                    $model->id = $city['i'];
                    $model->name = $city['n'];
                    $model->state_id = $state->id;
                    $model->save();
                    $inserted++;
                }
            }
            echo "\tNew cities inserted: $inserted\n";


//            print_r($arrRoles);
//            echo "\n";
        }
    }

    static function getBelairData($url) {
        $content = file_get_contents($url);
        $content = str_replace(
                array('{i:', ',n:', '\x20', '\x60', '\x28', '\x29', '\x2D', '\x27', '\x3F', '\x5B', '\x5D', '\x2F', '\xC3', '\xA2', '\x22'), array('{"i":', ',"n":', ' ', '`', '(', ')', '-', "'", "?", '[', ']', '/', 'Ã', '¢', "'"), $content);
        $arr = json_decode($content, true);
        if (json_last_error())
            die("Error:\n" . $content . "\nURL: $url\n");

        return $arr;
    }

    function run($args) {
        $this->start_timer = microtime(true);

        if (empty($args) || !method_exists(__CLASS__, $args[0])) {
            echo implode("\n", $this->txtHelp);
            $this->footer();
            Yii::app()->end();
        }
        if (isset($args[1])) {
            call_user_func('static::' . $args[0], $args[1]);
        } else {
            call_user_func('static::' . $args[0]);
        }
        $this->footer();
    }

    static function memoryUsage() {
        $mem_usage = memory_get_peak_usage(true);
        if ($mem_usage < 1024) {
            return $mem_usage . " bytes";
        } elseif ($mem_usage < 1048576) {
            return round($mem_usage / 1024, 2) . "k";
        } else {
            return round($mem_usage / 1048576, 2) . "MB";
        }
    }

    function footer() {
        print "\n\nTimestamp: " . date(DATETIME_FORMAT) . ", Class: " . __CLASS__ . ", Time used: " . round((microtime(true) - $this->start_timer), 2) . " sec. , Memory used: " . self::memoryUsage() . "\n";
    }

    static function setAirBookingsAndAirRoutesOrder($airCartId = null) {
        if ($airCartId !== null) {
            $airCarts[0] = \AirCart::model()->findByPk($airCartId);
        } else {
            $airCarts = \AirCart::model()->findAll();
        }
        echo "Setting the air routes order for: " . count($airCarts) . PHP_EOL;
        $i = 0;
        foreach ($airCarts as $airCart) {
            $airCart->setAirBookingsAndAirRoutesOrder();
            $i++;
        }
        echo "Air carts updated: $i\n";
    }

    static function markFraudRelatedAsFraud() {
        $acs = \AirCart::model()->findAllByAttributes(['booking_status_id' => \BookingStatus::STATUS_FRAUD]);
        foreach ($acs as $ac) {
            /* @var $ac \AirCart */
            $relatedBookings = $ac->getRelatedBookings();
            foreach ($relatedBookings as $related) {
                if ($related->booking_status_id !== \BookingStatus::STATUS_FRAUD) {
                    $related->fraud();
                    echo "Cart: $related->id \t marked as fraud\n";
                }
            }
        }
    }

    static function clearOldBalances() {
        // Testing
        self::clearOldBalancesExactTransactions();
        self::clearOldBalancesNonExactTransactions();
    }

    private static function clearOldBalancesExactTransactions() {
        $pgls = \PayGateLog::model()->findAllBySql("
                SELECT
                    max(pgl.id) id,
                    pgl.user_info_id
                FROM pay_gate_log pgl
                JOIN user_info ON pgl.user_info_id=user_info.id
                WHERE user_info.balance=pgl.amount
                AND pgl.status_id=:status AND pgl.action_id=:action
                AND pgl.user_info_id NOT IN (SELECT user_info_id FROM pay_gate_log WHERE updated > CURRENT_TIMESTAMP - interval '14 day')
                AND user_info.user_type_id = :userB2C
                GROUP BY pgl.user_info_id;
            ", [
            ':status' => \TrStatus::STATUS_SUCCESS,
            ':action' => \TrAction::ACTION_SENT,
            ':userB2C' => \UserType::clientB2C,
        ]);
        $i = 0;
        foreach ($pgls as $pgl) {
            $i++;
            $model = \PayGateLog::model()->findByPk($pgl->id);
            echo "Outstanding balance of:$model->amount \t cleared exact match, airCart: $model->air_cart_id \t transaction: $model->id \n";
            $model->externalRefund();
        }
        echo "Count of outstanding exact balances cleared: $i\n";
    }

    static function clearOldBalancesNonExactTransactions() {
        $clients = \Yii::app()->db->createCommand("
                SELECT
                    max(ac.id) ac_id,
                    ui.id,
                    ui.balance
                FROM user_info ui
                JOIN users u ON u.user_info_id=ui.id
                LEFT JOIN air_cart ac ON ac.user_id=u.id
                WHERE ui.balance>0
                AND ui.id NOT IN (SELECT user_info_id FROM pay_gate_log WHERE updated > CURRENT_TIMESTAMP - interval '14 day')
                AND ui.user_type_id = :userB2C
                GROUP BY ui.id, ui.balance;
            ")->queryAll(true, [':userB2C' => \UserType::clientB2C]);
        $i = 0;
        foreach ($clients as $ui) {
            $i++;
            $model = \UserInfo::model()->findByPk($ui['id']);
            if ($model->balance > 50) {
                echo "Outstanding balance of:$model->balance \t cleared,   airCart:{$ui['ac_id']}\t Client: $model->name\n";
            } else {
                echo "Outstanding balance of:$model->balance \t equalized, airCart:{$ui['ac_id']}\t Client: $model->name\n";
            }
            $model->clearBalance($ui['ac_id']);
        }
        echo "Count of outstanding non-exact balances cleared: $i";
    }

    /**
     * Return list of clients emails - excluding the fraudsters
     */
    static function emailsLongList($date = '2000-01-01') {
        // Clients
        $list = \Yii::app()->db->createCommand("
                select distinct lower(u.email) from users u
                left join air_cart ac ON ac.user_id=u.id and ac.booking_status_id=:statusFraud
                where ac.id is null AND u.created >= :createdDate ;
            ")->queryAll(false, [
            ':statusFraud' => \BookingStatus::STATUS_FRAUD,
            ':createdDate' => $date
        ]);
        echo "***** Count of clients (excluding the fraudsters) emails: " . count($list) . PHP_EOL;
        foreach ($list as $row) {
            echo $row[0] . PHP_EOL;
        }

        // Travelers
        $list = \Yii::app()->db->createCommand("
                select distinct lower(t.email) from traveler t
                join users u2 ON u2.user_info_id=t.user_info_id AND u2.created >= :createdDate 
                left join users u ON lower(u.email)=lower(t.email)
                where t.email is not null and t.email<>'' and u.id is null;
            ")->queryAll(false, [':createdDate' => $date]);
        echo "\n***** Count of travelers emails: " . count($list) . PHP_EOL;
        foreach ($list as $row) {
            echo $row[0] . PHP_EOL;
        }
    }

    /*
     * It calculates the cost of redirect based client source averaged on date
     * Formula: (count(redirect of cs)* cost of redirect))/count( booking of cs)
     * for each date and store in commision_cs_cost table
     */

    static function getBookingCostOfCS() {
        echo date(DATETIME_FORMAT) . " " . __METHOD__ . " Started";
        $date = date('Y-m-d', strtotime('-1 days'));
        $cslist = \CommisionClientSource::model()->findAllByAttributes(['type' => \CommisionClientSource::COMMISION_TYPE_VAR]);
        foreach ($cslist as $cs) {
            if ($cs->type == \CommisionClientSource::COMMISION_TYPE_VAR) {
                if ($cs->way_type == \CommisionClientSource::WAYTYPE_DOMESTIC) {
                    $redirectType = 1;
                    $bookingType = 1;
                } else {
                    $redirectType = 0;
                    $bookingType = 2;
                }
                echo "\nChecking CS name =>" . $cs->clientSource->name . '  waytype=>' . $cs->way_type;
                $redirectCount = \Yii::app()->db->createCommand("
                    SELECT count(id) as total  FROM booking_log where client_source_id=:csid
                    and created>= :from and created <=:to and is_domestic =:isdomestic
                ")->queryAll(false, [':isdomestic' => $redirectType, ':csid' => $cs->client_source_id, ':from' => $date . ' 00:00:00', ':to' => $date . ' 23:59:59']);

                $condition = 't.created>=:from and t.created<=:to  and t.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
                $condition.=' and ab.service_type_id=' . $bookingType . ' and t.client_source_id=:csid';
                $params = array(':from' => $date . ' 00:00:00', ':to' => $date . ' 23:59:59', ':csid' => $cs->client_source_id);
                $bookingCount = \Yii::app()->db->createCommand()
                                ->select('count(distinct  t.id)  as total')
                                ->from('air_cart t')
                                ->join('air_booking ab', 'ab.air_cart_id=t.id')
                                ->where($condition, $params)->queryAll();

                $costOfRedirect = $cs->amount;

                if ($redirectCount[0][0] != 0) {
                    if ($bookingCount[0]['total'] != 0) {
                        $model = \CommisionCsCost::model()->findByPk(['cost_date' => $date, 'cs_id' => $cs->client_source_id, 'way_type' => $cs->way_type]);
                        echo "\nCompleting CS name =>" . $cs->clientSource->name . '  waytype=>' . $cs->way_type;
                        if ($model == null) {
                            $cost = new \CommisionCsCost();
                        } else {
                            $cost = $model;
                        }
                        $cost->cost_date = $date;
                        $cost->cs_id = $cs->client_source_id;
                        $cost->way_type = $cs->way_type;
                        $amount = ($redirectCount[0][0] * $cs->amount) / $bookingCount[0]['total'];
                        $cost->avg_cost = $amount;
                        $cost->save();
                    }
                }
                //\Utils::dbgYiiLog(['redirectCount'=>$redirectCount,'bookingCount'=>$bookingCount,'$costOfRedirect'=>$costOfRedirect]);
            }
        }
        echo PHP_EOL;
    }

    static function showMe($id) {
        $pgls = \PayGateLog::model()->findAllByAttributes(['air_cart_id' => $id], 'cc_id is not null');
        foreach ($pgls as $pgl) {
            echo $pgl->cc->decode($pgl->cc->number) . PHP_EOL;
        }
    }

    /**
     * Free the IPs of the frauds older than 6 months<br>
     * We can add here similar free actions for any of the other fraud attributes
     */
    static function freeOldFrauds() {
        $i = \Fraud::model()->updateAll(['ip' => null], "created + interval '6 months' < 'today' and ip is not null");
        echo "Freed IPs from $i old frauds";
    }

    static function resyncCart($airCatrId) {
        $result = [];
        $airBookings = \AirBooking::model()->findAllBySql('select distinct air_source_id, crs_pnr from air_booking '
                . 'where air_cart_id = :airCartId', [':airCartId' => $airCatrId]);
        foreach ($airBookings as $airBooking) {
            /* @var $airBooking \AirBooking */
            if (empty($airBooking->airSource->backend->pnr_resync)) {
                $result[] = ['error' => $airBooking->airSource->backend->name . ' do not have resync capability'];
            } else {
                $result[] = call_user_func($airBooking->airSource->backend->pnr_resync, $airCatrId, $airBooking->air_source_id, $airBooking->crs_pnr);
            }
        }

        return $result;
    }

    /**
     * 
     * @param type $days_old => Default 180 Days, we can pass days from commandline also
     */
    static function purgeScreenshots($days_old = 180) {
        Screenshot::scrapScreenshots($days_old);
    }

    /**
     * Generate CityPairs 
     * Command:
     *      /usr/bin/php "/opt/lampp/htdocs/belair/site/protected/yiic.php" support generateCityPairs
     */
    static function generateCityPairs() {
        //CityPairs for FlyDubai
        //$carrier_id = 56;
        $flydubai_airport_code_string = 'KBL,KDH,EVN,GYD,BAH,CGP,DAC,SJJ,SOF,BJM,ZAG,PRG,JIB,HBE,ATZ,LXR,HMB,ASM,ADD,TBS,AMD,IXC,MAA,DEL,HYD,COK,LKO,BOM,TRV,AWZ,BND,HDM,IFN,LRR,MHD,SYZ,TBZ,IKA,NJF,BGW,BSR,EBL,ISU,AMM,ALA,TSE,CIT,KWI,FRU,OSS,BEY,SKP,MLE,KIV,KTM,MCT,SLL,LYP,KHI,MUX,UET,SKT,DOH,OTP,MRV,VKO,KZN,KRR,GOJ,OVB,ROV,KUF,UFA,VOG,SVX,KGL,AHB,ELQ,DMM,HAS,HOF,JED,GIZ,MED,EAM,RUH,AJF,TUU,TIF,YNB,BEG,BTS,JUB,CMB,HRI,KRT,PZU,ALP,DAM,LTK,DAR,JRO,ZNZ,DYU,BKK,SAW,ASB,EBB,DOK,HRK,IEV,ODS,DWC,DXB,SAH,ADE';

        //CityPairs for Scoot
        //$carrier_id = 446;
        $scoot_airport_code_string = 'ATQ,ATH,BKK,DMK,MAA,DLC,OOL,CAN,HGH,HKG,JAI,JED,KHH,MEL,MEB,AVV,NKG,OSA,KIX,ITM,PER,TAO,CTS,OKD,SEL,SSN,ICN,GMP,SHE,SIN,QPG,XSP,TGA,SYD,BWU,LBH,RSE,TPE,TSA,TSN,TYO,OKO,NRT,HND';

        $city_pairs = [56 => $flydubai_airport_code_string, 446 => $scoot_airport_code_string];

        $not_found = false;
        foreach ($city_pairs as $carrier_id => $airport_code_string) {
            $airport_code_arr1 = explode(',', $airport_code_string);
            $airport_code_arr2 = $airport_code_arr1;
            $qry = "INSERT INTO city_pairs (carrier_id, source_id, destination_id) VALUES \n";
            $i = 0;
            foreach ($airport_code_arr1 as $code1) {
                foreach ($airport_code_arr2 as $code2) {
                    if ($code1 !== $code2) {
                        $source_id = \Airport::getIdFromCode($code1, false);
                        $destination_id = \Airport::getIdFromCode($code2, false);
                        $comma = "";
                        if ($i > 0) {
                            $comma = ",";
                        }
                        /**
                         * It will print if any AirportCode not found in DB
                         */
                        if (empty($source_id)) {
                            $not_found = true;
                            print "CarrierID=>$carrier_id, SourceCode=>$code1\n";
                        }
                        if (empty($destination_id)) {
                            $not_found = true;
                            print "CarrierID=>$carrier_id, DestinationCode=>$code2\n";
                        }

                        $qry .= "$comma($carrier_id, $source_id, $destination_id)\n";
                        $i++;
                    }
                }
            }
            if ($not_found === false) {
                Yii::app()->db->createCommand("DELETE FROM city_pairs WHERE carrier_id=$carrier_id")->query();
                Yii::app()->db->createCommand($qry . ";")->query();
            }
            //print $qry.";";
        }
    }

    /**
     * Generate CityPairs For Scoot
     * Command:
     *      /usr/bin/php "/var/www/html/belair/site/protected/yiic.php" support generateCityPairsScoot
     */
    static function generateCityPairsScoot() {
        $scoot_city_pairs_json = '{"station":[{"-name":"DMK","direction":["KLO","CRK","OOL","PER","SYD","DAC","NKG","SHE","SZX","TAO","TSN","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","LOP","CEB","MNL","SIN","ICN","TPE","CNX","MLE","NGB","RGN","LGK","SUB","BPN","BWN","KCH","PLM","PKU","MEL","KNO","KHH","KIX","HGH","IPH","CAN","JJN","LKO","JED","ATQ","JAI","CKG","DLC","ATH","NRT","KUL","PEN"]},{"-name":"SIN","direction":["ADL","AYQ","BNE","CBR","CNS","HBA","LST","BFV","CEI","CJM","HDY","CNX","HKT","KBV","KOP","LOE","MAQ","NNT","NST","PHS","PRH","ROI","SNO","TST","UBP","UNN","URT","UTH","SYD","OOL","TSN","DMK","SHE","TAO","NRT","TPE","ICN","NKG","HKG","PER","MEL","KHH","BKK","KIX","HGH","CAN","JED","MAA","ATQ","JAI","CTS","BLR","CGO","COK","HAK","HYD","JJN","LKO","NGB","SZX","TRZ","WUX","XIY","SGN","HAN","RGN","KUL","SZX","MNL","DPS","IPH","CRK","PEN","DAC","KLO","LGK","CEB","NNG","TNA","CGK","JJN","SUB","MFM","MLE","DLC","ATH","USM"]},{"-name":"NKG","direction":["CGK","HKT","KBV","KLO","CRK","SIN","SYD","OOL","DMK","SUB","PER","BDO","DPS","CNX","MLE","NGB","RGN","LGK","BPN","BWN","HAN","LOP","PLM","SGN","PEN","PKU","MEL","MNL","KUL","KCH","KNO","SUB","PNH","REP","JOG","MDC","SRG","UPG","BKI","MDL","CEB","DVO","USM","DAD","IPH","LKO","JED","JAI","ATQ","BNE","WLG","AKL","ADL","CBR","CHC","CRW","ATH","USM","MAA"]},{"-name":"ICN","direction":["KLO","CRK","SIN","SYD","OOL","TPE","DMK","PER","BDO","BLR","MAA","DPS","HAN","SGN","KUL","PEN","HKT","HYD","CNX","MLE","NGB","RGN","LGK","LOP","SUB","KCH","KNO","BPN","CGK","BWN","PLM","MEL","PKU","KHH","IPH","LKO","JED","ATQ","JAI","ATH"]},{"-name":"SYD","direction":["BKK","PLM","PKU","KNO","KCH","BWN","BPN","KLO","CRK","XIY","BFV","CEI","CJM","HDY","CNX","HKT","KBV","KOP","LOE","MAQ","NNT","NST","PHS","PRH","ROI","SNO","TST","UBP","UNN","URT","UTH","DAC","CAN","HAK","NKG","SHE","SZX","TAO","TSN","HKG","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","LOP","SUB","NRT","MFM","KUL","LGK","PEN","CEB","MNL","SIN","ICN","TPE","DMK","HDY","HKT","KBV","HAN","SGN","CNX","MLE","NGB","RGN","LGK","LOP","SUB","KHH","KIX","HGH","IPH","JJN","LKO","JED","CTS","JAI","ATQ","ATH","WUX","CGO"]},{"-name":"OOL","direction":["BKK","KLO","CRK","XIY","BFV","CEI","CJM","HDY","CNX","HKT","KBV","KOP","LOE","MAQ","NNT","NST","PHS","PRH","ROI","SNO","TST","UBP","UNN","URT","UTH","DAC","CAN","HAK","NKG","SHE","SZX","TAO","TSN","HKG","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","LOP","SUB","NRT","MFM","KUL","LGK","PEN","CEB","MNL","SIN","ICN","TPE","DMK","HDY","KBV","HAN","SGN","CNX","MLE","NGB","RGN","PKU","SUB","BPN","BWN","KCH","KNO","PLM","KHH","KIX","HGH","IPH","JJN","LKO","JED","CTS","JAI","ATQ","DLC","ATH","CGO"]},{"-name":"SHE","direction":["KLO","CRK","OOL","PER","SYD","DAC","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BPN","BWN","BDO","LOP","SUB","KUL","LGK","PEN","CEB","MNL","SIN","DMK","HDY","KCH","KNO","HKT","KBV","HAN","SGN","CNX","MLE","NGB","PKU","PLM","RGN","MEL","SUB","PNH","REP","JOG","MDC","SRG","UPG","BKI","MDL","DVO","USM","DAD","IPH","LKO","JED","ATQ","JAI","BNE","WLG","AKL","ADL","CBR","CHC","CRW","USM"]},{"-name":"TAO","direction":["KLO","CRK","DMK","OOL","PER","SYD","DAC","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","SUB","KUL","PEN","PKU","PLM","CEB","MNL","SIN","DMK","HDY","HKT","KBV","HAN","SGN","CNX","MLE","MEL","NGB","RGN","LGK","LOP","KCH","KNO","BWN","SUB","BPN","KHH","PNH","REP","JOG","MDC","SRG","UPG","BKI","MDL","DVO","USM","DAD","IPH","LKO","JED","ATQ","JAI","BNE","WLG","AKL","ADL","CBR","CHC","CRW","ATH","USM"]},{"-name":"TSN","direction":["KLO","CRK","OOL","PER","SYD","DAC","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","LOP","SUB","KUL","LGK","PEN","CEB","MNL","SIN","DMK","HDY","HKT","KBV","MEL","HAN","SGN","CNX","MLE","NGB","RGN","SUB","KCH","KNO","BPN","BWN","DMK","PKU","PLM","KHH","PNH","REP","JOG","MDC","SRG","UPG","BKI","MDL","DVO","USM","DAD","IPH","LKO","JED","ATQ","JAI","BNE","WLG","AKL","ADL","CBR","CHC","CRW","ATH","USM"]},{"-name":"NRT","direction":["KLO","CRK","OOL","PER","SYD","DAC","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","LOP","KUL","LGK","PEN","SIN","TPE","DMK","HDY","HKT","KBV","CNX","MLE","NGB","RGN","SUB","BPN","BWN","PKU","PLM","KCH","MEL","KNO","IPH","JJN","LKO","JED","ATQ","JAI","DMK","ATH"]},{"-name":"TPE","direction":["KLO","CRK","OOL","PER","SYD","DAC","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","NRT","KUL","LGK","PEN","SIN","ICN","DMK","HDY","HKT","KBV","CNX","MLE","NGB","RGN","LGK","LOP","BPN","KCH","KNO","MEL","BWN","SUB","PKU","PLM","KHH","IPH","LKO","JED","CTS","ATQ","JAI","ATH"]},{"-name":"HKG","direction":["KLO","CRK","SIN","SYD","OOL","PER","BDO","KUL","KNO","KCH","LOP","HKT","CNX","MLE","NGB","RGN","LGK","LOP","SUB","BWN","CGK","DPS","BPN","MEL","MNL","PKU","PLM","KHH","IPH","JJN","LKO","JED","MAA","ATQ","JAI","ATH","DMK"]},{"-name":"PER","direction":["BKK","KLO","CRK","XIY","MFM","PEN","HAN","SGN","BFV","CEI","CJM","HDY","CNX","HKT","KBV","KOP","LOE","MAQ","NNT","NST","PHS","PRH","ROI","SNO","TST","UBP","UNN","URT","UTH","NKG","ICN","SIN","TPE","DMK","HKG","CNX","MLE","NGB","RGN","LGK","LOP","SUB","CGK","CAN","TAO","SHE","BDO","BPN","BWN","DPS","KCH","KNO","KUL","MNL","PKU","PLM","BLR","COK","HYD","MAA","TRZ","KHH","KIX","CEB","HGH","IPH","CAN","JJN","LKO","JED","DAC","BWN","BPN","LOP","KNO","PLM","PKU","CTS","JAI","ATQ","NRT","DLC","ATH","TSN","WUX","SZX"]},{"-name":"MEL","direction":["SIN","HKG","NKG","TAO","TSN","SHE","TPE","KHH","NRT","ICN","HGH","DMK","KIX","IPH","HKT","BKK","CNX","KBV","KUL","LGK","PEN","NGB","XIY","HAK","HAN","SGN","MFM","MLE","CGK","DPS","SUB","RGN","MNL","CRK","KLO","CEB","BLR","MAA","TRZ","HYD","DAC","CAN","JJN","LKO","JED","SZX","COK","BPN","BDO","LOP","KNO","PLM","PKU","BFV","CJM","HDY","LOE","MAQ","KOP","NNT","PHS","PRH","UNN","ROI","SNO","URT","KCH","CTS","JAI","ATQ","DLC","ATH","WUX","CGO"]},{"-name":"KHH","direction":["SIN","SYD","TSN","KUL","LOP","BPN","PLM","SGN","HAN","BWN","BDO","TPE","ICN","MEL","KNO","PKU","DMK","PEN","LGK","KCH","HKT","MNL","DPS","CGK","HKG","BKK","HDY","KBV","SUB","CGK","MLE","HYD","MAA","COK","BLR","DAC","TRZ","CRK","OOL","PER","KIX","IPH","HKT","BBK","CNX","KBV","KUL","LGK","PEN","NGB","XIY","HAK","LKO","ATQ","JAI","BNE","WLG","AKL","ADL","CBR","CHC","CRW","DLC","ATH","USM"]},{"-name":"KIX","direction":["ATH","ATQ","BDO","BPN","BWN","CBR","CGK","CKG","CNX","COK","CRK","DAC","DMK","DPS","HAK","HAN","HDY","HKT","HYD","IPH","JAI","JED","KBV","KCH","KHH","KLO","KNO","KUL","LGK","LKO","LOP","MAA","MEL","MLE","MNL","OOL","PEN","PER","PKU","PLM","RGN","SGN","SIN","SUB","SYD","TRZ","USM"]},{"-name":"HGH","direction":["SIN","MEL","OOL","PER","SYD","DMK","CAN","LKO","JED","BDO","BKI","BKK","BLR","BPN","BWN","CEB","CGK","CNX","COK","CRK","DAD","DPS","DVO","HAN","HDY","HKT","HYD","IPH","JOG","KBV","KCH","KNO","KUL","LGK","LKO","LOP","MAA","MDC","MDL","MLE","MNL","PEN","PKU","PLM","PNH","REP","RGN","SGN","SRG","SUB","TRZ","UPG","USM","ATQ","JAI","BNE","WLG","AKL","ADL","CBR","CHC","CRW","ATH","USM"]},{"-name":"CAN","direction":["MEL","OOL","PER","SYD","BKK","BLR","CGK","CNX","COK","CRK","DAC","DMK","DPS","HDY","HKT","HYD","IPH","JED","KBV","KLO","KUL","LGK","LKO","MAA","MLE","MNL","PEN","PER","RGN","SIN","SUB","SYD","TRZ","JAI","ATH","ATQ"]},{"-name":"HAK","direction":["SIN","MEL","OOL","PER","SYD","ATH","DMK","KUL","CGK","MAA","HKT","KBV","DPS","MLE","PEN","SUB"]},{"-name":"NGB","direction":["SIN","MEL","OOL","PER","SYD","DMK","JAI","MAA","HKT","KBV","DPS","MLE","PEN","LGK","CGK","SUB","KUL"]},{"-name":"SZX","direction":["SIN","MEL","OOL","PER","SYD","ATH","DMK","KUL","CGK","JAI","ATQ","MAA","HKT","KBV","DPS","MLE","PEN","LGK","SUB"]},{"-name":"XIY","direction":["SIN","MEL","OOL","PER","SYD","ATH","DMK","KUL","CGK","JAI","ATQ","MAA","HKT","KBV","DPS","MLE","PEN","LGK","SUB"]},{"-name":"BKK","direction":["MEL","OOL","PER","SYD","CAN","ATH","SIN","ATQ","JAI","KUL","IPH","PEN","LGK","TRZ","MLE","SUB","CGK","DPS"]},{"-name":"CNX","direction":["MEL","OOL","PER","SYD","ATH","SIN"]},{"-name":"HDY","direction":["MEL","OOL","PER","SYD","ATH"]},{"-name":"HKT","direction":["MEL","OOL","PER","SYD","ATH"]},{"-name":"KBV","direction":["MEL","OOL","PER","SYD","ATH"]},{"-name":"ADL","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT","SIN","ATH"]},{"-name":"AYQ","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT","SIN"]},{"-name":"BNE","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT","SIN","ATH"]},{"-name":"CBR","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT","SIN","ATH"]},{"-name":"CNS","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT","SIN","ATH"]},{"-name":"HBA","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT","SIN"]},{"-name":"MCY","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT"]},{"-name":"LST","direction":["NKG","SHE","TAO","TSN","HKG","ICN","KHH","TPE","DMK","KIX","NRT","SIN"]},{"-name":"MAA","direction":["BKK","CAN","CGK","CNX","DMK","DPS","HAK","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JJN","KBV","KHH","KIX","KLO","KUL","LGK","MEL","MFM","MNL","NGB","NKG","NRT","OOL","PEN","PER","RGN","SGN","SHE","SIN","SYD","SZX","TAO","TPE","TSN","XIY","DLC","ATH","USM"]},{"-name":"ATQ","direction":["ADL","AKL","BDO","BKI","BKK","BNE","BPN","CAN","CBR","CEB","CGK","CHC","CNX","CRK","DMK","DPS","DRW","DVO","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KBV","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MDC","MEL","MFM","MNL","NKG","NRT","OOL","PEN","PER","PKU","PLM","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","XIY","DLC","ATH","USM","SFO","LAX"]},{"-name":"JAI","direction":["ADL","AKL","BDO","BKK","BNE","BPN","CAN","CBR","CEB","CGK","CHC","CNS","CNX","CRK","DMK","DPS","DRW","HAK","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MEL","MFM","MNL","NGB","NKG","NRT","OOL","PEN","PER","PKU","PLM","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","XIY","USM","SFO","LAX"]},{"-name":"JED","direction":["BDO","BKI","BKK","BPN","BWN","CAN","CEB","CGK","CNX","CRK","DMK","DPS","DVO","HAK","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KBV","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MDC","MEL","MNL","NKG","NRT","OOL","PEN","PER","PKU","PLM","PNH","REP","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","USM","XIY","CTS","DLC","ATH","USM","AKL"]},{"-name":"CTS","direction":["KLO","CRK","OOL","PER","SYD","DAC","BLR","COK","HYD","MAA","TRZ","CGK","DPS","BDO","LOP","KUL","LGK","PEN","SIN","TPE","MLE","RGN","BPN","BWN","PKU","PLM","KCH","MEL","KNO","IPH","JJN","LKO","JED","ATQ","JAI","ATH"]},{"-name":"CKG","direction":["DMK","SIN","SYD","OOL","MEL","PER"]},{"-name":"BLR","direction":["ADL","AKL","BDO","BKI","BKK","BNE","BPN","CAN","CBR","CEB","CGK","CHC","CNX","CRK","DMK","DPS","DRW","DVO","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KBV","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MDC","MEL","MFM","MNL","NKG","NRT","OOL","PEN","PER","PKU","PLM","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","XIY","ATH"]},{"-name":"COK","direction":["ADL","AKL","BDO","BKI","BKK","BNE","BPN","CAN","CBR","CEB","CGK","CHC","CNX","CRK","DMK","DPS","DRW","DVO","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KBV","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MDC","MEL","MFM","MNL","NKG","NRT","OOL","PEN","PER","PKU","PLM","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","XIY","ATH"]},{"-name":"HYD","direction":["ADL","AKL","BDO","BKI","BKK","BNE","BPN","CAN","CBR","CEB","CGK","CHC","CNX","CRK","DMK","DPS","DRW","DVO","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KBV","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MDC","MEL","MFM","MNL","NKG","NRT","OOL","PEN","PER","PKU","PLM","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","XIY"]},{"-name":"MLE","direction":["ADL","AKL","BDO","BKI","BKK","BNE","BPN","CAN","CBR","CEB","CGK","CHC","CNX","CRK","DMK","DPS","DRW","DVO","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KBV","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MDC","MEL","MFM","MNL","NKG","NRT","OOL","PEN","PER","PKU","PLM","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","XIY","ATH"]},{"-name":"DAC","direction":["ADL","AKL","BDO","BKI","BKK","BNE","BPN","CAN","CBR","CEB","CGK","CHC","CNX","CRK","DMK","DPS","DRW","DVO","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JOG","KBV","KCH","KHH","KIX","KLO","KNO","KUL","LGK","LOP","MDC","MEL","MFM","MNL","NKG","NRT","OOL","PEN","PER","PKU","PLM","RGN","SGN","SHE","SIN","SRG","SUB","SYD","SZX","TAO","TPE","TSN","UPG","XIY","ATH"]},{"-name":"SGN","direction":["SIN","ATH"]},{"-name":"HAN","direction":["SIN","ATH"]},{"-name":"DLC","direction":["SIN","KHH","DMK","ATQ","PER","JED","MAA","MEL","OOL","SYD","JAI","DPS","MLE","PEN","KUL","LGK","HKT","KBV","CGK","SUB"]},{"-name":"CGO","direction":["SIN","SYD","OOL","MEL","PER","ATH"]},{"-name":"WUX","direction":["SIN","SYD","OOL","MEL","PER","ATH","DMK","KUL","CGK","ATQ","MAA","HKT","KBV","DPS","MLE","PEN","LGK","SUB"]},{"-name":"KUL","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"IPH","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"PEN","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"LGK","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"CGK","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"SUB","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"DPS","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"MNL","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"CRK","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"KLO","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"CEB","direction":["SIN","SYD","OOL","MEL","PER","TPE","DMK","KHH","NRT","ICN","CTS","KIX","HKG","JED","JAI","ATQ","MAA","TSN","SHE","TAO","DLC","NKG","HGH","CAN","ATH"]},{"-name":"ATH","direction":["SIN","MEL","SYD","OOL","PER","DMK","CAN","HKT","DPS","HAN","SGN","MLE","CGK","KUL","HKG","MNL","BKK","IPH","RGN","HAK","SUB","TRZ","TPE","PEN","ATQ","NNG","KBV","NKG","JJN","CEB","KLO","HDY","CRK","WUX","LGK","JED","HGH","LKO","XIY","SZX","DAC","BLR","HYD","MAA","COK","CGO","TSN","TAO","ICN","NRT","KIX","CTS","MFM","BWN","ADL","AKL","BNE","CHC","WLG","CBR","PNH","REP","BDO","BPN","JOG","LOP","MDC","PKU","PLM","SRG","UPG","BKI","KCH","LGK","MDL","CEB","DVO","CNX","DAD","KNO","CNS","DRW","USM"]},{"-name":"MFM","direction":["SIN","ATH","DMK","SYD","OOL","MEL","KUL","CGK"]},{"-name":"BWN","direction":"ATH"},{"-name":"RGN","direction":"ATH"},{"-name":"JJN","direction":["SIN","DMK","OOL","SYD","MEL","KUL","CGK","PER","ATQ","MAA","HKT","KBV","DPS","MLE","PEN","LGK","SUB","ATH"]},{"-name":"TRZ","direction":["BKK","CAN","CGK","CNX","DMK","DPS","HAK","HAN","HDY","HGH","HKG","HKT","ICN","IPH","JJN","KBV","KHH","KIX","KLO","KUL","LGK","MEL","MFM","MNL","NGB","NKG","NRT","OOL","PEN","PER","RGN","SGN","SHE","SIN","SYD","SZX","TAO","TPE","TSN","XIY","DLC","ATH","USM"]},{"-name":"LKO","direction":["CGK","CEB","DPS","KUL","MEL","MNL","SIN"]}]}';

        $stations = json_decode($scoot_city_pairs_json, true);

        $not_found = false;
        $delete = true;
        $carrier_id = 446;
        foreach ($stations['station'] as $station) {
            $qry = "INSERT INTO city_pairs (carrier_id, source_id, destination_id) VALUES \n";
            $i = 0;
            if (!is_array($station['direction'])) {
                $station['direction'] = [$station['direction']];
            }
            $direction = array_unique($station['direction']);
            foreach ($direction as $code2) {
                if ($station['-name'] !== $code2) {
                    $source_id = \Airport::getIdFromCode($station['-name'], false);
                    $destination_id = \Airport::getIdFromCode($code2, false);
                    $comma = "";
                    if ($i > 0) {
                        $comma = ",";
                    }
                    /**
                     * It will print if any AirportCode not found in DB
                     */
                    if (empty($source_id)) {
                        $not_found = true;
                        print "Not Found => CarrierID=>$carrier_id, SourceCode=>{$station['-name']}\n";
                    }
                    if (empty($destination_id)) {
                        $not_found = true;
                        print "Not Found => CarrierID=>$carrier_id, DestinationCode=>$code2\n";
                    }

                    $qry .= "$comma($carrier_id, $source_id, $destination_id)\n";
                    $i++;
                }
            }
            if ($not_found === false) {
                if ($delete) {
                    $rowCount = \Yii::app()->db->createCommand("DELETE FROM city_pairs WHERE carrier_id=$carrier_id")->execute();
                    print "\n DELETED ".$rowCount." rows";
                    $delete = false;
                }
                $rowCount = \Yii::app()->db->createCommand($qry . ";")->execute();
                print "\n INSERTED ".$rowCount." rows";
            }
            //\Utils::dbgYiiLog($qry . ";");
        }
    }
}
