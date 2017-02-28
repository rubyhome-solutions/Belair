<?php

namespace application\components\Reporting;

/**
 * Description of Report
 *
 * @author Boxx
 */
class Report {

    const SUMMARY_REPORT = 'summary';
    const DETAILS_REPORT = 'details';
    const CHART_REPORT = 'chart';

    public $user_info_id = null;
    public $user_id = null;
    public $dateFrom = null;
    public $dateFrom2 = null;
    public $dateTo = null;
    public $dateTo2 = null;
    public $serviceType = null;
    public $cabinType = null;
    public $carrier = null;
    public $reportType = null;
    public $onlySummary = null;
    public $xlsFile = null;
    public $clientType = null;
    public $distributorId = null;
    public $clientSource = null;
    public $airport1 = null;
    public $airport2 = null;
    public $airport3 = null;
    public $airport4 = null;
    public $airport5 = null;
    public $airport;
    public $staffLogged = false;
    public $origin = null;
    public $destination = null;
    public $waytype = null;
    public $statusBooked = null;
    public $duration = null;
    public $isdomestic = null;
// Reports definitions
    static $REPORTS = [
        'Detail air' => [
            'fields' => [
//                'ac.id' => '"AirCart"',
                "'<b><a href=\"/airCart/'||ac.id||'\">'||ac.id||'</a></b>'" => '"AirCart"',
                "CASE booking_log.is_mobile WHEN 1 THEN 'Mobile' ELSE 'Desktop' END" => '"Device"',
                'client_source.name' => '"Client_Source"',
                'ac.created::timestamp(0)' => 'created',
                'ab_status.name' => '"Booking_Status"',
                'payment_status.name' => '"Payment_Status"',
                'user_info.name' => '"Name"',
                'users.name' => '"Booked_by"',
                'ab.tour_code' => '"Tour_Code"',
                'ab.private_fare' => '"Private_Code"',
                'traveler_type.name' => '"Pax_Type"',
                'traveler.first_name||\' \'||traveler.last_name' => '"Traveler"',
                'traveler.email' => '"Traveler_Email"',
                'service_type.name' => '"Type"',
                "ma.code||' '||ma.name" => '"Marketing_Airline"',
                'carrier.name' => '"Airline"',
                "carrier.code||'-'||ar.flight_number" => '"Flight"',
                "origin.airport_code||'-'||destination.airport_code" => '"Sector"',
                'ab.booking_class' => '"Booking_Class"',
                'cabin_type.name' => '"Cabin_Class"',
                'ab.fare_basis' => '"Fare_Basis"',
                "substring(ar.departure_ts::text from 1 for 16)" => '"Departure"',
                "substring(ar.arrival_ts::text from 1 for 16)" => '"Arrival"',
                'ab.airline_pnr' => '"Airlne_Pnr"',
                'ab.crs_pnr' => '"Crs_Pnr"',
                'ab.ticket_number' => '"TicketNo"',
                'ab.basic_fare' => '"Base_Fare"',
                'ab.fuel_surcharge' => '"YQ_Tax"',
                'ab.udf_charge' => '"UDF_Tax"',
                'ab.jn_tax' => '"Service_Tax"',
                'ab.other_tax' => '"Other_Tax"',
                '(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax)' => '"Total_Taxes"',
                'ab.commission_or_discount_gross' => '"Commission"',
                'ab.booking_fee' => '"Booking_Fee"',
                '(ab.meal_charge+ab.seat_charge)' => '"Meal_Seat_Charges"',
                '(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross+ab.meal_charge+ab.seat_charge)' => '"Net Fare"',
                "(SELECT string_agg(payment.id::text, ', ') FROM payment WHERE payment.air_cart_id=ac.id)" => '"Payments"',
                "(SELECT string_agg(payment.pay_gate_log_id::text, ', ') FROM payment WHERE payment.air_cart_id=ac.id)" => '"Transactions"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'payment_status' => 'ac.payment_status_id=payment_status.id',
                'client_source' => 'ac.client_source_id=client_source.id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'ab_status' => 'ab_status.id=ab.ab_status_id',
                'service_type' => 'service_type.id=ab.service_type_id',
                'carrier ma' => 'ma.id=ab.carrier_id',
                'traveler' => 'traveler.id=ab.traveler_id',
                'traveler_type' => 'traveler_type.id=ab.traveler_type_id',
                'traveler_title' => 'traveler_title.id=traveler.traveler_title_id',
                'air_routes ar' => 'ar.air_booking_id=ab.id',
                'carrier' => 'carrier.id=ar.carrier_id',
                'airport origin' => 'origin.id=ar.source_id',
                'airport destination' => 'destination.id=ar.destination_id',
            ],
            'leftJoin' => [
                'cabin_type' => 'cabin_type.id=ab.cabin_type_id',
                'booking_log' => 'booking_log.air_cart_id=ac.id',
            ],
            'group' => '',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'ac.created, ab.departure_ts, traveler.id',
        ]
        ,
        'Air summary1' => [
            'fields' => [
                "ma.name" => '"Airline_Name"',
                "ma.code" => '"Airline_Code"',
                "sum(CASE ab.service_type_id WHEN 1 THEN 1 ELSE 0 END)" => '"Domestic"',
                "sum(CASE ab.service_type_id WHEN 2 THEN 1 ELSE 0 END)" => '"International"',
                "count(*)" => '"Total"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'carrier ma' => 'ma.id=ab.carrier_id',
                'users' => 'users.id=ac.user_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Airline_Code, Airline_Name',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'ma.name',
        ]
        ,
        'Air summary2' => [
            'fields' => [
                "sum(CASE ab.service_type_id WHEN 1 THEN 1 ELSE 0 END)" => '"Domestic"',
                "sum(CASE ab.service_type_id WHEN 2 THEN 1 ELSE 0 END)" => '"International"',
                "sum(CASE WHEN air_source.backend_id IN (9,10,1,2,3,4) THEN 1 ELSE 0 END)" => '"LLC"',
                "sum(CASE WHEN air_source.backend_id IN (5,6,7,8) THEN 1 ELSE 0 END)" => '"GDS"',
                "sum(CASE WHEN air_source.backend_id IN (11,12,13,14,15) THEN 1 ELSE 0 END)" => '"Scrappers"',
                "count(*)" => '"Total"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'air_source' => 'air_source.id=ab.air_source_id',
                'users' => 'users.id=ac.user_id',
            ],
            'leftJoin' => [
            ],
            'group' => '',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => '',
        ]
        ,
        'Air Sales' => [
            'fields' => [
                'carrier.name' => '"Airline"',
                "carrier.code" => '"Code"',
                "COUNT(ab.id)" => '"Booked_Segments"',
//                "COUNT(ab.id)" => '"Cancelled_Segments"',
                'SUM(ab.basic_fare)::int8' => '"Total_Base_Fare"',
                'AVG(ab.basic_fare)::int8' => '"Average_Base_Fare"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax)::int8' => '"Total_Taxes"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
                'AVG(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::int8' => '"Average_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'carrier' => 'carrier.id=ab.carrier_id',
                'airport origin' => 'origin.id=ab.source_id',
                'airport destination' => 'destination.id=ab.destination_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Airline, Code',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'distributorId' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
                'airport' => ['field' => 'origin.airport_code'],
            ],
            'order' => 'Airline',
        ]
        ,
        'Air Routes' => [
            'fields' => [
                "origin.airport_code||'-'||destination.airport_code" => '"Route"', // ||(CASE WHEN ab. IS NOT NULL THEN '-'||origin.airport_code ELSE '' END)
                "COUNT(ab.id)" => '"Booked_Segments"',
                'SUM(ab.basic_fare)::int8' => '"Total_Base_Fare"',
                'AVG(ab.basic_fare)::int8' => '"Average_Base_Fare"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax)::int8' => '"Total_Taxes"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
                'AVG(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::int8' => '"Average_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'airport origin' => 'origin.id=ab.source_id',
                'airport destination' => 'destination.id=ab.destination_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Route',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'distributorId' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
                'airport' => ['field' => 'origin.airport_code'],
            ],
            'order' => 'Route',
        ]
        ,
        'Daily sales summary' => [
            'fields' => [
                'SUM(ab.basic_fare)::int8' => '"Total_Base_Fare"',
                'AVG(ab.basic_fare)::int8' => '"Average_Base_Fare"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax)::int8' => '"Total_Taxes"',
                'SUM(ab.booking_fee)::float8' => '"Total_Booking_Fees"',
                'SUM(ab.commission_or_discount_gross)::float8' => '"Total_Discounts"',
                'SUM(ab.meal_charge)::float8' => '"Total_Meal_Charges"',
                'SUM(ab.seat_charge)::float8' => '"Total_Seat_Charges"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross+ab.meal_charge+ab.seat_charge)::float8' => '"Total_Fare"',
                'AVG(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross+ab.meal_charge+ab.seat_charge)::int8' => '"Average_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
            ],
            'leftJoin' => [
            ],
            'group' => '',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'distributorId' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => '',
        ]
        ,
        'Cart ownership issues' => [
            'fields' => [
                "ac.created::timestamp(0)" => '"Date"',
                "'<a href=\"/airCart/view/'||ac.id||'\" target=\"_blank\">'||ac.id||'</a>'" => '"Cart"',
                "u1.id" => '"Cart User Id"',
                "'<a href=\"/users/manage?selectedvalue='||u1.id||'\" target=\"_blank\">'||u1.\"name\"||'</a>'" => '"Cart Owner"',
                "ui1.balance" => '"User1 Balance"',
                "'<a href=\"/payGate/view/'||t.id||'\" target=\"_blank\">'||t.id||'</a>'" => '"Transaction"',
                "u2.id" => '"Transaction User Id"',
                "'<a href=\"/users/manage?selectedvalue='||u2.id||'\" target=\"_blank\">'||u2.\"name\"||'</a>'" => '"Transaction Client"',
                "t.amount" => '"Transaction Amount"',
                "ui2.balance" => '"User2 Balance"'
            ],
            'from' => 'air_cart ac',
            'join' => [
                'pay_gate_log t' => 't.air_cart_id=ac.id and t.status_id=2 and t.action_id=1 and ac.id>33',
                'users u1' => 'u1.id=ac.user_id and u1.user_info_id <> t.user_info_id',
                'users u2' => 'u2.user_info_id=t.user_info_id',
                'user_info ui1' => 'ui1.id=u1.user_info_id',
                'user_info ui2' => 'ui2.id=u2.user_info_id',
            ],
            'leftJoin' => [],
            'group' => '',
            'conditions' => [],
            'order' => 'ac.id',
        ]
        ,
        'Reseller Sales' => [
            'fields' => [
                'user_info.id' => '"Reseller_ID"',
                'user_info.name' => '"Reseller_Name"',
                'distributor.name' => '"Distributor"',
                'count(ab.id)' => '"Air_Segments"',
                'SUM(ab.basic_fare)::int8' => '"Total_Base_Fare"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
            ],
            'leftJoin' => [
                'sub_users' => 'sub_users.reseller_id=user_info.id',
                'user_info distributor' => 'sub_users.distributor_id=distributor.id',
            ],
            'group' => 'Reseller_ID, Reseller_Name, Distributor',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'distributorId' => ['field' => 'distributor.id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Total_Fare DESC',
        ]
        ,
        'Reseller Sales Years' => [
            'fields' => [
                'user_info.id' => '"Reseller_ID"',
                'user_info.name' => '"Reseller_Name"',
                'distributor.name' => '"Distributor"',
                'EXTRACT(year from ac.created)' => '"Year"',
                'COUNT(ab.id)' => '"Air_Segments"',
                'SUM(ab.basic_fare)::int8' => '"Total_Base_Fare"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
                "ROUND(100*(SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)/MIN(v_sales_by_year.total_fare)-1)::numeric,2)||'%'" => '"Change_Percentage"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
            ],
            'leftJoin' => [
                'sub_users' => 'sub_users.reseller_id=user_info.id',
                'user_info distributor' => 'sub_users.distributor_id=distributor.id',
                'v_sales_by_year' => 'v_sales_by_year.user_info_id=user_info.id AND v_sales_by_year.year_=EXTRACT(year from ac.created)::int-1',
            ],
            'group' => 'Reseller_ID, Reseller_Name, Distributor, Year',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'distributorId' => ['field' => 'distributor.id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Reseller_Name, Year',
        ]
        ,
        'Reseller Sales Months' => [
            'fields' => [
                't.user_info_id' => '"Reseller_ID"',
                'user_info.name' => '"Reseller_Name"',
                'distributor.name' => '"Distributor"',
                't.year_' => '"Year"',
                't.month_' => '"Month"',
                'min(coalesce(this_period.segments, 0))' => '"Air_Segments"',
                'min(coalesce(this_period.basic_fare , 0))' => '"Base_Fare"',
                'min(coalesce(this_period.total_fare, 0))' => '"Total_Fare"',
                "round(100*(coalesce(min(this_period.total_fare), 0)::numeric/min(prev_period.total_fare)::numeric-1)::numeric,2)||'%'" => '"Change_Percentage"',
            ],
            'from' => 'v_generated_month_periods_by_userinfoid t',
            'join' => [
                'user_info' => 'user_info.id=t.user_info_id',
            ],
            'leftJoin' => [
                "v_sales_by_month prev_period" => "prev_period.user_info_id=user_info.id AND 12*prev_period.year_+prev_period.month_=12*t.year_+ t.month_-1",
                "v_sales_by_month this_period" => "this_period.user_info_id=user_info.id AND this_period.year_=t.year_ AND this_period.month_=t.month_",
                'sub_users' => 'sub_users.reseller_id=user_info.id',
                'user_info distributor' => 'sub_users.distributor_id=distributor.id',
            ],
            'group' => 'Reseller_ID, Reseller_Name, Distributor, Year, Month',
            'conditions' => [
                'user_info_id' => ['field' => 't.user_info_id', 'prefix' => '', 'sufix' => ''],
                'distributorId' => ['field' => 'distributor.id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 't.date_', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 't.date_', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
//                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
//                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
//                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
//                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Reseller_Name, Year, Month',
        ]
        ,
        'Reseller Sales Weeks' => [
            'fields' => [
                't.user_info_id' => '"Reseller_ID"',
                'user_info.name' => '"Reseller_Name"',
                'distributor.name' => '"Distributor"',
                't.year_' => '"Year"',
                't.week_' => '"Week"',
                'min(coalesce(this_period.segments, 0))' => '"Air_Segments"',
                'min(coalesce(this_period.basic_fare , 0))' => '"Base_Fare"',
                'min(coalesce(this_period.total_fare, 0))' => '"Total_Fare"',
                "round(100*(coalesce(min(this_period.total_fare), 0)::numeric/min(prev_period.total_fare)::numeric-1)::numeric,2)||'%'" => '"Change_Percentage"',
            ],
            'from' => 'v_generated_week_periods_by_userinfoid t',
            'join' => [
                'user_info' => 'user_info.id=t.user_info_id',
            ],
            'leftJoin' => [
                "v_sales_by_week prev_period" => "prev_period.user_info_id=user_info.id AND 52*prev_period.year_+prev_period.week_=52*t.year_+ t.week_-1",
                "v_sales_by_week this_period" => "this_period.user_info_id=user_info.id AND this_period.year_=t.year_ AND this_period.week_=t.week_",
                'sub_users' => 'sub_users.reseller_id=user_info.id',
                'user_info distributor' => 'sub_users.distributor_id=distributor.id',
            ],
            'group' => 'Reseller_ID, Reseller_Name, Distributor, Year, Week',
            'conditions' => [
                'user_info_id' => ['field' => 't.user_info_id', 'prefix' => '', 'sufix' => ''],
                'distributorId' => ['field' => 'distributor.id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 't.date_', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 't.date_', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
//                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
//                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
//                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
//                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Reseller_Name, Year, Week',
        ]
        ,
        'Employee Productivity' => [
            'fields' => [
                'employee.id' => '"Employee_ID"',
                'employee.name' => '"Employee_Name"',
                "(CASE employee.enabled WHEN 1 THEN 'Enabled' ELSE 'Disabled' END)" => '"Status"',
                'employee.email' => '"Email"',
                'employee.mobile' => '"Mobile"',
                'employee.last_login::timestamp(0)' => '"Last_Login"',
                'employee.last_transaction' => '"Last_Transaction"',
                'employee.department' => '"Department"',
                'employee.location' => '"Location"',
                'count(ab.id)' => '"Air_Segments"',
                'SUM(ab.basic_fare)::int8' => '"Total_Base_Fare"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'users employee' => 'employee.id=ac.loged_user_id',
                'user_info employee_info' => 'employee.user_info_id=employee_info.id AND employee_info.user_type_id IN (1,2,8,9)',
            ],
            'leftJoin' => [
            ],
            'group' => 'Employee_ID, Employee_Name, Status, Email, Mobile, Last_Login, Last_Transaction, Department, Location',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Employee_Name',
        ]
        ,
        'Air Coupons Sales' => [
            'fields' => [
                'carrier.name' => '"Airline"',
                "carrier.code" => '"Code"',
                "COUNT(ab.id)" => '"Booked_Segments"',
                'SUM(ab.basic_fare)::int8' => '"Total_Base_Fare"',
                'AVG(ab.basic_fare)::int8' => '"Average_Base_Fare"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax)::int8' => '"Total_Taxes"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
                'AVG(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::int8' => '"Average_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'carrier' => 'carrier.id=ab.carrier_id',
                'airport origin' => 'origin.id=ab.source_id',
                'airport destination' => 'destination.id=ab.destination_id',
                'air_source' => 'air_source.id=ab.air_source_id AND air_source.backend_id in (11,12,13,14,15)',
            ],
            'leftJoin' => [
            ],
            'group' => 'Airline, Code',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
                'airport' => ['field' => 'origin.airport_code'],
            ],
            'order' => 'Airline',
        ]
        ,
        'Planned trips' => [
            'fields' => [
                "'<b><a href=\"/airCart/'||ac.id||'\">'||ac.id||'</a></b>'" => '"AirCart"',
                'client_source.name' => '"Client_Source"',
//                'ac.created::timestamp(0)' => 'created',
                'ab_status.name' => '"Booking_Status"',
                'payment_status.name' => '"Payment_Status"',
                'user_info.name' => '"Name"',
                'users.name' => '"Booked_by"',
                'traveler_type.name' => '"Pax_Type"',
                'traveler.first_name||\' \'||traveler.last_name' => '"Traveler"',
                'traveler.email' => '"Traveler_Email"',
                'service_type.name' => '"Type"',
                "ma.code||' '||ma.name" => '"Marketing_Airline"',
                "origin.airport_code||'-'||destination.airport_code" => '"Sector"',
                'cabin_type.name' => '"Cabin_Class"',
                "substring(ab.departure_ts::text from 1 for 16)" => '"Departure"',
                "substring(ab.arrival_ts::text from 1 for 16)" => '"Arrival"',
                'ab.airline_pnr' => '"Airlne_Pnr"',
                'ab.crs_pnr' => '"Crs_Pnr"',
                'ab.ticket_number' => '"TicketNo"',
                '(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)' => '"Amount"'
            ],
            'from' => 'air_cart ac',
            'join' => [
                'payment_status' => 'ac.payment_status_id=payment_status.id',
                'client_source' => 'ac.client_source_id=client_source.id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'ab_status' => 'ab_status.id=ab.ab_status_id',
                'service_type' => 'service_type.id=ab.service_type_id',
                'carrier ma' => 'ma.id=ab.carrier_id',
                'traveler' => 'traveler.id=ab.traveler_id',
                'traveler_type' => 'traveler_type.id=ab.traveler_type_id',
                'traveler_title' => 'traveler_title.id=traveler.traveler_title_id',
                'airport origin' => 'origin.id=ab.source_id',
                'airport destination' => 'destination.id=ab.destination_id',
            ],
            'leftJoin' => [
                'cabin_type' => 'cabin_type.id=ab.cabin_type_id',
            ],
            'group' => '',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ab.departure_ts', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ab.departure_ts', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'ab.departure_ts, traveler.id',
        ]
        ,
        'Look to Book private' => [
            'fields' => [
                'client_source.name' => '"Client_Source"',
                'SUM(value)' => '"Searches"',
                'SUM(carts_count)' => '"Bookings"',
                "ROUND(100*SUM(carts_count)/SUM(value)::numeric, 3)||'%'" => '"Ratio"',
            ],
            'from' => 'search_count s',
            'join' => [
                'client_source' => 'client_source.id=s.client_source_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Client_Source',
            'conditions' => [
                'dateFrom' => ['field' => 's.date_', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 's.date_', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
            ],
            'order' => 'Bookings DESC',
        ]
        ,
        'Look to Book' => [
            'fields' => [
                'user_info.id' => '"Reseller_ID"',
                'user_info.name' => '"Reseller_Name"',
                'COUNT(searches.id)' => '"Searches"',
                'COUNT(ac.id)' => '"Bookings"',
                "ROUND(100*COUNT(ac.id)/COUNT(searches.id)::numeric, 2)||'%'" => '"Ratio"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'users search_user' => 'search_user.user_info_id=user_info.id',
                'searches' => 'searches.user_id=search_user.id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Reseller_ID, Reseller_Name',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom2' => ['field' => 'searches.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo2' => ['field' => 'searches.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Bookings DESC',
        ]
        ,
        'Amendments details' => [
            'fields' => [
                "'<b><a href=\"/airCart/'||ac.id||'\">'||ac.id||'</a></b>'" => '"AirCart"',
                'amd.id' => '"Amendment"',
                'amd.note' => '"Amendment_Note"',
                "'<table><tr><th>Item</th><th>Old</th><th>New</th></tr>'||amd.changes||'</table>'" => '"Amendment_Details"',
                'amendment_status.name' => '"Amendment_Status"',
                'client_source.name' => '"Client_Source"',
                'ac.created::timestamp(0)' => 'created',
                'ab_status.name' => '"Booking_Status"',
                'payment_status.name' => '"Payment_Status"',
                'user_info.name' => '"Name"',
                'users.name' => '"Booked_by"',
                'ab.tour_code' => '"Tour_Code"',
                'ab.private_fare' => '"Private_Code"',
                'traveler_type.name' => '"Pax_Type"',
                'traveler.first_name||\' \'||traveler.last_name' => '"Traveler"',
                'traveler.email' => '"Traveler_Email"',
                'service_type.name' => '"Type"',
                "ma.code||' '||ma.name" => '"Marketing_Airline"',
                'carrier.name' => '"Airline"',
                "carrier.code||'-'||ar.flight_number" => '"Flight"',
                "origin.airport_code||'-'||destination.airport_code" => '"Sector"',
                'ab.booking_class' => '"Booking_Class"',
                'cabin_type.name' => '"Cabin_Class"',
                'ab.fare_basis' => '"Fare_Basis"',
                "substring(ar.departure_ts::text from 1 for 16)" => '"Departure"',
                "substring(ar.arrival_ts::text from 1 for 16)" => '"Arrival"',
                'ab.airline_pnr' => '"Airlne_Pnr"',
                'ab.crs_pnr' => '"Crs_Pnr"',
                'ab.ticket_number' => '"TicketNo"',
                'ab.basic_fare' => '"Base_Fare"',
                '(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax)' => '"Total_Taxes"',
                'ab.commission_or_discount_gross' => '"Commission"',
                'ab.booking_fee' => '"Booking_Fee"',
                '(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)' => '"Net Fare"',
                "(SELECT string_agg(payment.id::text, ', ') FROM payment WHERE payment.air_cart_id=ac.id)" => '"Payments"',
                "(SELECT string_agg(payment.pay_gate_log_id::text, ', ') FROM payment WHERE payment.air_cart_id=ac.id)" => '"Transactions"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'payment_status' => 'ac.payment_status_id=payment_status.id',
                'client_source' => 'ac.client_source_id=client_source.id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'amendment amd' => 'amd.air_booking_id=ab.id',
                'amendment_status' => 'amd.amendment_status_id=amendment_status.id',
                'ab_status' => 'ab_status.id=ab.ab_status_id',
                'service_type' => 'service_type.id=ab.service_type_id',
                'carrier ma' => 'ma.id=ab.carrier_id',
                'traveler' => 'traveler.id=ab.traveler_id',
                'traveler_type' => 'traveler_type.id=ab.traveler_type_id',
                'traveler_title' => 'traveler_title.id=traveler.traveler_title_id',
                'air_routes ar' => 'ar.air_booking_id=ab.id',
                'carrier' => 'carrier.id=ar.carrier_id',
                'airport origin' => 'origin.id=ar.source_id',
                'airport destination' => 'destination.id=ar.destination_id',
            ],
            'leftJoin' => [
                'cabin_type' => 'cabin_type.id=ab.cabin_type_id',
            ],
            'group' => '',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'ac.created, ab.departure_ts, traveler.id, amd.id',
        ]
        ,
        'Sales Charts Airlines' => [
            'fields' => [
                "carrier.code" => '"Airline"',
//                "COUNT(ab.id)" => '"Booked_Segments"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'carrier' => 'carrier.id=ab.carrier_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Airline',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Airline',
        ]
        ,
        'Sales Charts Airlines Segments' => [
            'fields' => [
                "carrier.code" => '"Airline"',
                "COUNT(ab.id)" => '"Segments"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'carrier' => 'carrier.id=ab.carrier_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Airline',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Airline',
        ]
        ,
        'Sales Charts Months' => [
            'fields' => [
                "EXTRACT(year from ac.created)*100 + EXTRACT(month from ac.created)" => '"Month"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'carrier' => 'carrier.id=ab.carrier_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Month',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Month',
        ]
        ,
        'Sales Charts Weeks' => [
            'fields' => [
                "EXTRACT(year from ac.created)*100 + EXTRACT(week from ac.created)" => '"Week"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'carrier' => 'carrier.id=ab.carrier_id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Week',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Week',
        ]
        ,
        'Sales Charts Client Source' => [
            'fields' => [
                "client_source.name" => '"Client Source"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'client_source' => 'ac.client_source_id=client_source.id',
            ],
            'leftJoin' => [
            ],
            'group' => 'Client Source',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Client Source',
        ]
        ,
        'Sales Charts Client Type' => [
            'fields' => [
                "user_type.name" => '"Client Type"',
                'SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8' => '"Total_Fare"',
            ],
            'from' => 'air_cart ac',
            'join' => [
                'air_booking ab' => 'ac.id=ab.air_cart_id',
                'users' => 'users.id=ac.user_id',
                'user_info' => 'users.user_info_id=user_info.id',
                'user_type' => 'user_type.id=user_info.user_type_id'
            ],
            'leftJoin' => [
            ],
            'group' => 'Client Type',
            'conditions' => [
                'user_info_id' => ['field' => 'users.user_info_id', 'prefix' => '', 'sufix' => ''],
                'dateFrom' => ['field' => 'ac.created', 'prefix' => '>=', 'sufix' => ''],
                'dateTo' => ['field' => 'ac.created', 'prefix' => '<=', 'sufix' => ' 23:59:59'],
                'statusBooked' => ['field' => 'ac.booking_status_id', 'prefix' => '', 'sufix' => ''],
                'serviceType' => ['field' => 'ab.service_type_id', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 'ab.cabin_type_id', 'prefix' => '', 'sufix' => ''],
                'carrier' => ['field' => 'ab.carrier_id', 'prefix' => '', 'sufix' => ''],
                'clientType' => ['field' => 'user_info.user_type_id', 'prefix' => '', 'sufix' => ''],
                'clientSource' => ['field' => 'ac.client_source_id', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Client Type',
        ]
        ,
        'Search Analytics' => [
            'fields' => [
                // 'client_source.id' => '"ClientSource_ID"',
                'client_source.name' => '"Client Source"',
                'cabin_type.name' => '"Cabin Type"',
                's.origin' => '"Origin"',
                's.destination' => '"Destination"',
                'CASE    WHEN s.type_id=1 THEN \'Oneway\'   ELSE     \'Return\' END ' => '"Type"',
                'CASE    WHEN s.is_domestic=1 THEN \'Domestic\'   ELSE     \'International\' END ' => '"Is Domestic"',
                'COUNT(s.id)' => '"Searches"',
            ],
            'from' => 'searches_arch s',
            'join' => [
                'client_source' => 'client_source.id=s.client_source_id',
				 'cabin_type' => 'cabin_type.id=s.category',
            ],
            'leftJoin' => [
            ],
            'group' => 'client_source.id, cabin_type.name, Origin, Destination, s.type_id, s.is_domestic',
            'conditions' => [
                'clientSource' => ['field' => 's.client_source_id', 'prefix' => '', 'sufix' => ''],
                'origin' => ['field' => 's.origin', 'prefix' => '', 'sufix' => ''],
                'destination' => ['field' => 's.destination', 'prefix' => '', 'sufix' => ''],
                'waytype' => ['field' => 's.type_id', 'prefix' => '', 'sufix' => ''],
                'duration' => ['field' => 's.created', 'prefix' => '>=', 'sufix' => ''],
                'isdomestic' => ['field' => 's.is_domestic', 'prefix' => '', 'sufix' => ''],
                'cabinType' => ['field' => 's.category', 'prefix' => '', 'sufix' => ''],
            ],
            'order' => 'Searches DESC',
        ],
    ];
    static $REPORT_GROUP = [
        2 => [
            'name' => 'Detailed Air report',
            'reports' => [
                'Detail air' => ['rending' => 'horizontal', 'maxCount' => 100000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
                'Air summary1' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::SUMMARY_REPORT],
                'Air summary2' => ['rending' => 'vertical', 'maxCount' => 30, 'Title' => 'Details', 'type' => self::SUMMARY_REPORT],
            ],
        ],
        1 => [
            'name' => 'Air Sales report',
            'reports' => [
                'Air Sales' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        25 => [
            'name' => 'Daily Sales Report',
            'reports' => [
                'Detail air' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
                'Daily sales summary' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::SUMMARY_REPORT],
            ],
        ],
        5 => [
            'name' => 'Air Routes Report',
            'reports' => [
                'Air Routes' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        8 => [
            'name' => 'Reseller Sales Report',
            'reports' => [
                'Reseller Sales' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
                'Reseller Sales Years' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
                'Reseller Sales Months' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
                'Reseller Sales Weeks' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        18 => [
            'name' => 'Employee Productivity Report',
            'reports' => [
                'Employee Productivity' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        6 => [
            'name' => 'Air Coupons Sales report',
            'reports' => [
                'Air Coupons Sales' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        4 => [
            'name' => 'Planned Trips Report',
            'reports' => [
                'Planned trips' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        11 => [
            'name' => 'Look to Book Ratio Report',
            'reports' => [
                'Look to Book private' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT, 'staffOnly' => true],
//                'Look to Book' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        9 => [
            'name' => 'Amendments Detailed Report',
            'reports' => [
                'Amendments details' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        34 => [
            'name' => 'Search Detailed Report',
            'reports' => [
                'Search Analytics' => ['rending' => 'horizontal', 'maxCount' => 50, 'Title' => 'Details', 'type' => self::DETAILS_REPORT],
            ],
        ],
        33 => [
            'name' => 'Cart ownership issues',
            'reports' => [
                'Cart ownership issues' => ['rending' => 'horizontal', 'maxCount' => 1000, 'Title' => 'Cart ownership issues', 'type' => self::DETAILS_REPORT],
            ],
        ],
        7 => [
            'name' => 'Sales Charts Report',
            'reports' => [
                'Sales Charts Airlines' => [
                    'rending' => 'horizontal',
                    'maxCount' => 1000,
                    'Title' => 'Details',
                    'type' => self::CHART_REPORT,
                    'chartOptions' => [
                        'title' => 'Sales by Airlines',
                        'width' => 1000,
                        'titleTextStyle' => ['color' => '#FF0000'],
//                        'hAxis' => ['titleTextStyle' => ['color' => '#FF0000']],
                        'legend' => ['position' => 'bottom'],
                        'animation' => ["startup" => true, 'duration' => 1000],
                    ],
                ],
                'Sales Charts Airlines Segments' => [
                    'rending' => 'horizontal',
                    'maxCount' => 1000,
                    'Title' => 'Details',
                    'type' => self::CHART_REPORT,
                    'chartOptions' => [
                        'title' => 'Segments by Airlines',
                        'width' => 1000,
                        'titleTextStyle' => ['color' => '#FF0000'],
//                        'hAxis' => ['titleTextStyle' => ['color' => '#FF0000']],
                        'legend' => ['position' => 'bottom'],
                        'animation' => ["startup" => true, 'duration' => 1000],
                    ],
                ],
                'Sales Charts Months' => [
                    'rending' => 'horizontal',
                    'maxCount' => 1000,
                    'Title' => 'Details',
                    'type' => self::CHART_REPORT,
                    'chartOptions' => [
                        'title' => 'Sales by months',
                        'width' => 1000,
                        'titleTextStyle' => ['color' => '#FF0000'],
//                        'hAxis' => ['titleTextStyle' => ['color' => '#FF0000']],
                        'legend' => ['position' => 'bottom'],
                        'animation' => ["startup" => true, 'duration' => 1000],
                    ],
                ],
                'Sales Charts Weeks' => [
                    'rending' => 'horizontal',
                    'maxCount' => 1000,
                    'Title' => 'Details',
                    'type' => self::CHART_REPORT,
                    'chartOptions' => [
                        'title' => 'Sales by weeks',
                        'width' => 1000,
                        'height' => 500,
                        'titleTextStyle' => ['color' => '#FF0000'],
                        'legend' => ['position' => 'bottom'],
                        'animation' => ["startup" => true, 'duration' => 1000],
                        'bars' => 'horizontal',
                    ],
                ],
                'Sales Charts Client Source' => [
                    'rending' => 'horizontal',
                    'maxCount' => 1000,
                    'Title' => 'Details',
                    'type' => self::CHART_REPORT,
                    'chartOptions' => [
                        'title' => 'Sales by Client Source',
                        'width' => 1000,
                        'titleTextStyle' => ['color' => '#FF0000'],
                        'legend' => ['position' => 'bottom'],
                        'animation' => ["startup" => true, 'duration' => 1000],
                    ],
                ],
                'Sales Charts Client Type' => [
                    'rending' => 'horizontal',
                    'maxCount' => 1000,
                    'Title' => 'Details',
                    'type' => self::CHART_REPORT,
                    'chartOptions' => [
                        'title' => 'Sales by Client Type',
                        'width' => 1000,
                        'titleTextStyle' => ['color' => '#FF0000'],
                        'legend' => ['position' => 'bottom'],
                        'animation' => ["startup" => true, 'duration' => 1000],
                    ],
                ],
            ],
        ],
    ];

    public function __construct() {
        if (!\Authorization::getIsStaffLogged()) {
            $this->user_info_id = \Utils::getActiveCompanyId();
        } else {
            $this->staffLogged = true;
        }
    }

    /**
     * Return the data for specific report. The SQL statement is prepared applying all the conditions that are not null
     * @param string $reportId The report key
     * @param string $maxRows The maximum number of rows to be returned
     * @return array The results
     */
    function getData($reportId, $maxRows = 100000) {
        if (!isset(self::$REPORTS[$reportId])) {
            return [];
        }

        $report = self::$REPORTS[$reportId];
        $criteria = new \CDbCriteria();
        foreach ($report['conditions'] as $property => $var) {

            if (!empty($this->$property) || $this->$property == 0) {
                if (is_scalar($this->$property) && $this->$property != '') {
                    $criteria->compare($var['field'], $var['prefix'] . $this->$property . $var['sufix']);
                }
                if (is_array($this->$property)) {
                    $criteria->addInCondition($var['field'], $this->$property);
                }
            }
        }
        $command = \Yii::app()->db->createCommand()
            ->select($this->prepareSelect($report['fields']))
            ->from($report['from'])
            ->where($criteria->condition, $criteria->params)
            ->group($report['group'])
            ->order($report['order'])
            ->limit($maxRows)
        ;
        foreach ($report['join'] as $table => $condition) {
            $command->join($table, $condition);
        }
        foreach ($report['leftJoin'] as $table => $condition) {
            $command->leftJoin($table, $condition);
        }

//        echo \Utils::dbg($command->text);
//        echo \Utils::dbg($criteria->params);
        return $command->queryAll();
    }

    /**
     * Prepare select statement from array
     * @param array $select The parameters in pais [table.filed => name_in_the_results]
     * @return string The select statement
     */
    private function prepareSelect(array $select) {
        $out = '';
        foreach ($select as $key => $value) {
            $out .= $key . ' AS ' . $value . ', ';
        }
        return rtrim($out, ', ');
    }

    /**
     * Render the report, that is including all summaries and subreports
     * @param int $reportId The report ID
     * @return string The html code of the reports
     */
    function render($reportId) {
        if (!isset(self::$REPORT_GROUP[$reportId])) {
            return '';  // Silently skip the non existing reports
        }
        // Prepare array of airports
        $this->airport = array_filter([
            strtoupper($this->airport1),
            strtoupper($this->airport2),
            strtoupper($this->airport3),
            strtoupper($this->airport4),
            strtoupper($this->airport5),
        ]);

        // Prepare secondary dates filtering
        $this->dateFrom2 = $this->dateFrom;
        $this->dateTo2 = $this->dateTo;

        // Prepare the booking status
        $this->statusBooked = \BookingStatus::STATUS_BOOKED;

        // Set the user_info_id
        if ($this->user_id) {
            $user = \Users::model()->findByPk($this->user_id);
            $this->user_info_id = $user->user_info_id;
        }
//        echo \Utils::dbg($this);
        $report = self::$REPORT_GROUP[$reportId];
        $out = "<legend>{$report['name']}</legend>";
        foreach ($report['reports'] as $repName => $params) {
            if ((!empty($this->onlySummary) && $params['type'] !== self::SUMMARY_REPORT) ||
                (!$this->staffLogged && !empty($params['staffOnly']))) {
                continue;
            }

            // Charts rendering
            if ($params['type'] === self::CHART_REPORT) {
                if (is_string($out)) {
                    unset($out);
                }
                $out[] = $this->renderChart($this->getData($repName, $params['maxCount']), $repName, $params['chartOptions']);
                continue;
            } else {    // Tables rendering
                if ($params['rending'] === 'vertical') {
                    $out .= \Utils::arr2tableVertical($this->getData($repName, $params['maxCount']));
                } else {
                    $out .= \Utils::arr2table($this->getData($repName, $params['maxCount']));
                }
            }
            $out .= "<br>";
        }

        // We have graphs - JSON output
        if (is_array($out)) {
            \Utils::jsonResponse($out);
        }

        if (empty($this->xlsFile)) {    // HTML output
            echo $out;
        } else {    // Excel output
//            $out .= "<style>th {background-color:lightgoldenrodyellow;}</style>";
            \Utils::html2xls($out, $report['name'] . '_' . date('Ymd_Hi') . '.xls');
        }
    }

    /**
     * Render the yatra report
     * @param date $fromdate From Date
     * @param date $todate To date
     * @return string $out html string
     */
    function renderYatra($fromdate, $todate) {

        $fromdate = $fromdate . ' 00:00:00';
        $todate = $todate . ' 23:59:59';

        $carts = \AirCart::model()->with(array('airBookings' => array('with' => 'airRoutes'), 'payments', 'payGateLogs', 'paymentStatus', 'clientSource'))->findAll(array(
            'condition' => 't.created>=\'' . $fromdate . '\' and t.created<=\'' . $todate . '\' and  t.booking_status_id=' . \BookingStatus::STATUS_BOOKED,
            'order' => 't.id',
            'limit' => '10000'
        ));
        $isreturn = false;
        $multicity = false;
        $data = [];
        foreach ($carts as $cart) {
//            $bookings = \AirBooking::model()->findAll(array(
//                'condition' => ' air_cart_id=' . $cart->id,
//                'order' => 'departure_ts'
//            ));
            $bookings = $cart->airBookings;
            $first = true;

            foreach ($bookings as $booking) {
                if ($first) {
                    $first = false;
                    if ($booking->getReturnDate()) {
                        $isreturn = true;
                    } else {
                        $isreturn = false;
                    }
                    if ($booking->isMultiCity()) {
                        $multicity = true;
                    } else {
                        $multicity = false;
                    }
                }


                if (!isset($travelerdata[$cart->id][$booking->traveler_id])) {
                    $travelerdata[$cart->id][$booking->traveler_id] = 1;
                } else {
                    $data[$cart->id . '_' . $booking->traveler_id]['Base_Fare']+=$booking->basic_fare;
                    $data[$cart->id . '_' . $booking->traveler_id]['YQ_Tax']+=$booking->fuel_surcharge;
                    $data[$cart->id . '_' . $booking->traveler_id]['UDF_Tax']+=$booking->udf_charge;
                    $data[$cart->id . '_' . $booking->traveler_id]['Service_Tax']+=$booking->jn_tax;
                    $data[$cart->id . '_' . $booking->traveler_id]['Other_Tax']+=$booking->other_tax;
                    $data[$cart->id . '_' . $booking->traveler_id]['Total_Taxes']+=$booking->fuel_surcharge + $booking->udf_charge + $booking->jn_tax + $booking->other_tax;
                    $data[$cart->id . '_' . $booking->traveler_id]['Commission']+=$booking->commission_or_discount_gross;
                    $data[$cart->id . '_' . $booking->traveler_id]['Booking_Fee']+=$booking->booking_fee;
                    $data[$cart->id . '_' . $booking->traveler_id]['Meal_Seat_Charges']+=$booking->meal_charge + $booking->seat_charge;
                    $data[$cart->id . '_' . $booking->traveler_id]['Net Fare']+=$booking->fuel_surcharge + $booking->udf_charge + $booking->jn_tax + $booking->other_tax + $booking->basic_fare + $booking->booking_fee - $booking->commission_or_discount_gross + $booking->meal_charge + $booking->seat_charge;

                    continue;
                }
                $cnt = '';
                if (!isset($bookdata[$cart->id])) {
                    if (count($bookings) === 2 && $isreturn) {
                        $cnt = '';
                    } else if (count($bookings) > 1) {
                        $bookdata[$cart->id] = 1;
                        $cnt = '-' . $bookdata[$cart->id];
                    } else {
                        $bookdata[$cart->id] = '';
                    }
                } else {
                    $bookdata[$cart->id] ++;
                    $cnt = '-' . $bookdata[$cart->id];
                }
                $data[$cart->id . '_' . $booking->traveler_id]['AirCart'] = '<b><a href="/airCart/' . $cart->id . '">' . $cart->id . '</a></b>';
                $data[$cart->id . '_' . $booking->traveler_id]['Client_Source'] = $cart->clientSource->name;
                $data[$cart->id . '_' . $booking->traveler_id]['created'] = $cart->created;
                $data[$cart->id . '_' . $booking->traveler_id]['Booking_Status'] = $booking->abStatus->name;
                $data[$cart->id . '_' . $booking->traveler_id]['Payment_Status'] = $cart->paymentStatus->name;
                $data[$cart->id . '_' . $booking->traveler_id]['Name'] = $cart->user->userInfo->name;
                $data[$cart->id . '_' . $booking->traveler_id]['Booked_by'] = $cart->user->userInfo->name;
                $data[$cart->id . '_' . $booking->traveler_id]['Tour_Code'] = $booking->tour_code;
                $data[$cart->id . '_' . $booking->traveler_id]['Private_Code'] = $booking->private_fare;
                $data[$cart->id . '_' . $booking->traveler_id]['Pax_Type'] = $booking->travelerType->name;
                $data[$cart->id . '_' . $booking->traveler_id]['Traveler'] = $booking->traveler->first_name . ' ' . $booking->traveler->last_name;
                $data[$cart->id . '_' . $booking->traveler_id]['Traveler_Email'] = $booking->traveler->email;
                $data[$cart->id . '_' . $booking->traveler_id]['Type'] = $booking->serviceType->name;
                $data[$cart->id . '_' . $booking->traveler_id]['Marketing_Airline'] = $booking->carrier->code;
                $data[$cart->id . '_' . $booking->traveler_id]['Airline'] = $booking->carrier->name;
//               $routes = \AirRoutes::model()->findAll(array(
//                    'condition' => 'air_booking_id=' . $booking->id,
//                    'order' => 'departure_ts'
//                ));
                $routes = $booking->airRoutes;
                $data[$cart->id . '_' . $booking->traveler_id]['Flight'] = $booking->carrier->code . '-' . $routes[0]->flight_number;
                if ($isreturn) {
                    $data[$cart->id . '_' . $booking->traveler_id]['Sector'] = $booking->source->airport_code . '-' . $booking->destination->airport_code . '-' . $booking->source->airport_code;
                } else {
                    $data[$cart->id . '_' . $booking->traveler_id]['Sector'] = $booking->source->airport_code . '-' . $booking->destination->airport_code;
                }
                $data[$cart->id . '_' . $booking->traveler_id]['Booking_Class'] = $booking->booking_class;
                if (!empty($booking->cabin_type_id)) {
                    $data[$cart->id . '_' . $booking->traveler_id]['Cabin_Class'] = $booking->cabinType->name;
                } else {
                    $data[$cart->id . '_' . $booking->traveler_id]['Cabin_Class'] = '';
                }

                $data[$cart->id . '_' . $booking->traveler_id]['Fare_Basis'] = $booking->fare_basis;
                $data[$cart->id . '_' . $booking->traveler_id]['Departure'] = substr($booking->departure_ts, 0, -3);
                $data[$cart->id . '_' . $booking->traveler_id]['Arrival'] = substr($booking->arrival_ts, 0, -3);
                $data[$cart->id . '_' . $booking->traveler_id]['Airlne_Pnr'] = $booking->airline_pnr . $cnt;
                $data[$cart->id . '_' . $booking->traveler_id]['Crs_Pnr'] = $booking->crs_pnr;
                if ($booking->ticket_number === 'N/A') {
                    $data[$cart->id . '_' . $booking->traveler_id]['TicketNo'] = '';
                } else {
                    if (isset(explode('-', $booking->ticket_number)[1])) {
                        $data[$cart->id . '_' . $booking->traveler_id]['TicketNo'] = explode('-', $booking->ticket_number)[1];
                    } else {
                        $data[$cart->id . '_' . $booking->traveler_id]['TicketNo'] = $booking->ticket_number;
                    }
                }
                $data[$cart->id . '_' . $booking->traveler_id]['Base_Fare'] = $booking->basic_fare;
                $data[$cart->id . '_' . $booking->traveler_id]['YQ_Tax'] = $booking->fuel_surcharge;
                $data[$cart->id . '_' . $booking->traveler_id]['UDF_Tax'] = $booking->udf_charge;
                $data[$cart->id . '_' . $booking->traveler_id]['Service_Tax'] = $booking->jn_tax;
                $data[$cart->id . '_' . $booking->traveler_id]['Other_Tax'] = $booking->other_tax;
                $data[$cart->id . '_' . $booking->traveler_id]['Total_Taxes'] = $booking->fuel_surcharge + $booking->udf_charge + $booking->jn_tax + $booking->other_tax;
                $data[$cart->id . '_' . $booking->traveler_id]['Commission'] = $booking->commission_or_discount_gross;
                $data[$cart->id . '_' . $booking->traveler_id]['Booking_Fee'] = $booking->booking_fee;
                $data[$cart->id . '_' . $booking->traveler_id]['Meal_Seat_Charges'] = $booking->meal_charge + $booking->seat_charge;
                $data[$cart->id . '_' . $booking->traveler_id]['Net Fare'] = $booking->fuel_surcharge + $booking->udf_charge + $booking->jn_tax + $booking->other_tax + $booking->basic_fare + $booking->booking_fee - $booking->commission_or_discount_gross + $booking->meal_charge + $booking->seat_charge;
                $data[$cart->id . '_' . $booking->traveler_id]['Payments'] = '';
                foreach ($cart->payments as $pay) {
                    $data[$cart->id . '_' . $booking->traveler_id]['Payments'].=$pay->id . ', ';
                }
                if (!empty($data[$cart->id . '_' . $booking->traveler_id]['Payments']))
                    $data[$cart->id . '_' . $booking->traveler_id]['Payments'] = substr($data[$cart->id . '_' . $booking->traveler_id]['Payments'], 0, -2);

                $data[$cart->id . '_' . $booking->traveler_id]['Transactions'] = '';
                foreach ($cart->payGateLogs as $pgs) {
                    $data[$cart->id . '_' . $booking->traveler_id]['Transactions'].=$pgs->id . ', ';
                }
                if (!empty($data[$cart->id . '_' . $booking->traveler_id]['Transactions']))
                    $data[$cart->id . '_' . $booking->traveler_id]['Transactions'] = substr($data[$cart->id . '_' . $booking->traveler_id]['Transactions'], 0, -2);
            }
        }
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out.='<tr><th>S.No</th><th>AirCart</th><th>Client_Source</th><th>created</th><th>Booking_Status</th><th>Payment_Status</th><th>Name</th><th>Booked_by</th>'
            . '<th>Tour_Code</th><th>Private_Code</th><th>Pax_Type</th><th>Traveler</th><th>Traveler_Email</th><th>Type</th><th>Marketing_Airline</th><th>Airline</th><th>Flight</th>'
            . '<th>Sector</th><th>Booking_Class</th><th>Cabin_Class</th>'
            . '<th>Fare_Basis</th><th>Departure</th><th>Arrival</th><th>Airlne_Pnr</th><th>Crs_Pnr</th><th>TicketNo</th><th>Base_Fare</th><th>YQ_Tax</th><th>UDF_Tax</th>'
            . '<th>Service_Tax</th><th>Other_Tax</th><th>Total_Taxes</th><th>Commission</th><th>Booking_Fee</th><th>Meal_Seat_Charges</th><th>Net Fare</th><th>Payments</th><th>Transactions</th></tr>';
        $i = 1;
        foreach ($data as $value) {
            $out = $out . '<tr><th>' . $i++ . '<th>' . $value['AirCart'] . '</th><th>' . $value['Client_Source'] . '</th><th>' . $value['created'] . '</th><th>' . $value['Booking_Status'] . '</th>'
                . '<th>' . $value['Payment_Status'] . '</th><th>' . $value['Name'] . '</th><th>' . $value['Booked_by'] . '</th>';
            $out = $out . '<th>' . $value['Tour_Code'] . '</th><th>' . $value['Private_Code'] . '</th><th>' . $value['Pax_Type'] . '</th><th>' . $value['Traveler'] . '</th><th>' . $value['Traveler_Email'] . '</th>'
                . '<th>' . $value['Type'] . '</th><th>' . $value['Marketing_Airline'] . '</th><th>' . $value['Airline'] . '</th><th>' . $value['Flight'] . '</th>'
                . '<th>' . $value['Sector'] . '</th><th>' . $value['Booking_Class'] . '</th><th>' . $value['Cabin_Class'] . '</th>';
            $out = $out . '<th>' . $value['Fare_Basis'] . '</th><th>' . $value['Departure'] . '</th><th>' . $value['Arrival'] . '</th><th>' . $value['Airlne_Pnr'] . '</th><th>' . $value['Crs_Pnr'] . '</th>';
            $out = $out . '<th>' . $value['TicketNo'] . '</th><th>' . $value['Base_Fare'] . '</th><th>' . $value['YQ_Tax'] . '</th><th>' . $value['UDF_Tax'] . '</th>';
            $out = $out . '<th>' . $value['Service_Tax'] . '</th><th>' . $value['Other_Tax'] . '</th><th>' . $value['Total_Taxes'] . '</th><th>' . $value['Commission'] . '</th><th>' . $value['Booking_Fee'] . '</th>';
            $out = $out . '<th>' . $value['Meal_Seat_Charges'] . '</th><th>' . $value['Net Fare'] . '</th><th>' . $value['Payments'] . '</th><th>' . $value['Transactions'] . '</th></tr>';
        }
        $out .= '</table>';
        return $out;
        // \Utils::arr2tableVertical($data);
        // \Utils::dbgYiiLog($data);
        //exit;
        //return $arr;
    }

    /**
     * Render the yatra new report
     * @param date $fromdate From Date
     * @param date $todate To date
     * @return string $out html string
     */
    function renderNewYatra($fromdate, $todate, $xls) {

        $fromdate = $fromdate . ' 00:00:00';
        $todate = $todate . ' 23:59:59';

        $carts = \AirCart::model()->with(array('airBookings' => array('with' => 'airRoutes', 'order' => 'ab.departure_ts asc', 'alias' => 'ab',), 'clientSource'))->findAll(array(
            'join' => 'INNER JOIN cart_status_log as cl 
                      on cl.air_cart_id = t.id  and cl.cart_status_id=' . \CartStatus::CART_STATUS_BOOKED . ' and cl.booking_status_id=' . \BookingStatus::STATUS_BOOKED,
            'condition' => '((t.created>=\'' . $fromdate . '\' and t.created<=\'' . $todate . '\' and  t.booking_status_id=' . \BookingStatus::STATUS_BOOKED . ') or (cl.created>=\'' . $fromdate . '\' and cl.created<=\'' . $todate . '\'))',
            'order' => 't.id',
            'limit' => '10000'
        ));

        $isreturn = false;
        $isreturndiff = false;
        $multicity = false;
        $data = [];
        foreach ($carts as $cart) {
//            $bookings = \AirBooking::model()->findAll(array(
//                'condition' => ' air_cart_id=' . $cart->id,
//                'order' => 'departure_ts'
//            ));
            $bookings = $cart->airBookings;
            $first = true;
            $firstPromo = true;
            foreach ($bookings as $booking) {
                $convenience_fee = 0;
                if ($first) {
                    $first = false;
                    if ($booking->getReturnDate()) {
                        $isreturn = true;
                    } else {
                        $isreturn = false;
                    }
                    if ($isreturn) {
                        if ($booking->getReturnDiffFlight()) {
                            $isreturndiff = true;
                        } else {
                            $isreturndiff = false;
                        }
                    }
                    if ($booking->isMultiCity()) {
                        $multicity = true;
                    } else {
                        $multicity = false;
                    }
                    $convenience_fee = $cart->convenienceFee;
                }


                if (!isset($travelerdata[$cart->id][$booking->traveler_id . '_' . $booking->carrier->code])) {
                    $travelerdata[$cart->id][$booking->traveler_id . '_' . $booking->carrier->code] = 1;
                } else {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Base_Fare']+=$booking->basic_fare;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['YQ_Tax']+=$booking->fuel_surcharge;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['UDF_Tax']+=$booking->udf_charge;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Service_Tax']+=$booking->jn_tax;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Other_Tax']+=$booking->other_tax;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Total_Taxes']+=$booking->udf_charge + $booking->jn_tax + $booking->other_tax + $booking->meal_charge + $booking->seat_charge;
                    ;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Commission']+=$booking->commission_or_discount_gross;
                    if (!empty($cart->promo_codes_id) && $firstPromo) {
                        $firstPromo = false;
                        $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Commission']+=$cart->getPromoDiscount();
                    }
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Booking_Fee']+=$booking->booking_fee;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Meal_Seat_Charges']+=$booking->meal_charge + $booking->seat_charge;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Net Fare']+=$booking->fuel_surcharge + $booking->udf_charge + $booking->jn_tax + $booking->other_tax + $booking->basic_fare + $booking->booking_fee - $booking->commission_or_discount_gross + $booking->meal_charge + $booking->seat_charge;
                    continue;
                }
                $cnt = '';
                if (!isset($bookdata[$cart->id . '_' . $booking->carrier->code])) {
                    if (count($bookings) === 2 && $isreturn) {
                        $cnt = '';
                    } else if (count($bookings) > 1) {
                        $bookdata[$cart->id . '_' . $booking->carrier->code] = 1;
                        $cnt = '-' . $bookdata[$cart->id . '_' . $booking->carrier->code];
                    } else {
                        $bookdata[$cart->id . '_' . $booking->carrier->code] = '';
                    }
                } else {
                    $bookdata[$cart->id . '_' . $booking->carrier->code] ++;
                    $cnt = '-' . $bookdata[$cart->id . '_' . $booking->carrier->code];
                }
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['AirCart'] = '<b><a href="/airCart/' . $cart->id . '">' . $cart->id . '</a></b>';
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Client_Source'] = $cart->clientSource->name;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['created'] = $cart->created;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Booking_Status'] = $booking->abStatus->name;
                //  $data[$cart->id.'_'.$booking->traveler_id]['Payment_Status']=$cart->paymentStatus->name;
                //  $data[$cart->id.'_'.$booking->traveler_id]['Name']=$cart->user->userInfo->name; 
                //  $data[$cart->id.'_'.$booking->traveler_id]['Booked_by']=$cart->user->userInfo->name; 
                //  $data[$cart->id.'_'.$booking->traveler_id]['Tour_Code']=$booking->tour_code; 
                //  $data[$cart->id.'_'.$booking->traveler_id]['Private_Code']=$booking->private_fare; 
                //   $data[$cart->id.'_'.$booking->traveler_id]['Pax_Type']=$booking->travelerType->name; 
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Traveler'] = $booking->traveler->first_name . ' ' . $booking->traveler->last_name;
                //   $data[$cart->id.'_'.$booking->traveler_id]['Traveler_Email']=$booking->traveler->email; 
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Traveler_Title'] = $booking->traveler->travelerTitle->name;

                if ($booking->service_type_id === \ServiceType::DOMESTIC_AIR) {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Type'] = 'D';
                } else {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Type'] = 'I';
                }
                if (empty($booking->ticket_number) || $booking->ticket_number === 'N/A') {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Marketing_Airline'] = $booking->carrier->code;
                } else {
                    if ($booking->service_type_id === \ServiceType::DOMESTIC_AIR && $booking->carrier->code === 'AI') {
                        $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Marketing_Airline'] = 'AIB';
                    } else if ($booking->service_type_id === \ServiceType::DOMESTIC_AIR && $booking->carrier->code === '9W') {
                        $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Marketing_Airline'] = '9WB';
                    } else if (strpos($booking->ticket_number, '-') !== false) {
                        if ($xls) {
                            $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Marketing_Airline'] = '="' . explode('-', $booking->ticket_number)[0] . '"';
                        } else {
                            $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Marketing_Airline'] = explode('-', $booking->ticket_number)[0];
                        }
                    } else {
                        $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Marketing_Airline'] = $booking->carrier->code;
                    }
                }

                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Airline'] = $booking->carrier->name;
//               $routes = \AirRoutes::model()->findAll(array(
//                    'condition' => 'air_booking_id=' . $booking->id,
//                    'order' => 'departure_ts'
//                ));
                $routes = $booking->airRoutes;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Flight'] = $booking->carrier->code . '-' . $routes[0]->flight_number;
                if ($isreturn && !$isreturndiff) {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Sector'] = $booking->source->airport_code . '-' . $booking->destination->airport_code . '-' . $booking->source->airport_code;
                } else {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Sector'] = $booking->source->airport_code . '-' . $booking->destination->airport_code;
                }
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Booking_Class'] = $booking->booking_class;
                if (!empty($booking->cabin_type_id)) {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Cabin_Class'] = $booking->cabinType->name;
                } else {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Cabin_Class'] = '';
                }

                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Fare_Basis'] = $booking->fare_basis;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Departure'] = substr($booking->departure_ts, 0, -3);
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Arrival'] = substr($booking->arrival_ts, 0, -3);
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Airlne_Pnr'] = $booking->airline_pnr . $cnt;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Crs_Pnr'] = $booking->crs_pnr;
                if ($booking->ticket_number === 'N/A') {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['TicketNo'] = '';
                } else {
                    if (isset(explode('-', $booking->ticket_number)[1])) {
                        $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['TicketNo'] = explode('-', $booking->ticket_number)[1];
                    } else {
                        $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['TicketNo'] = $booking->ticket_number;
                    }
                }
                if ($data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['TicketNo'] == '') {
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['TicketNo'] = $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Airlne_Pnr'];
                }
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Base_Fare'] = $booking->basic_fare;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['YQ_Tax'] = $booking->fuel_surcharge;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['UDF_Tax'] = $booking->udf_charge;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Service_Tax'] = $booking->jn_tax;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Other_Tax'] = $booking->other_tax;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Total_Taxes'] = $booking->udf_charge + $booking->jn_tax + $booking->other_tax + $booking->meal_charge + $booking->seat_charge;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Commission'] = $booking->commission_or_discount_gross;
                if (!empty($cart->promo_codes_id) && $firstPromo) {
                    $firstPromo = false;
                    $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Commission']+=$cart->getPromoDiscount();
                }
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Booking_Fee'] = $booking->booking_fee + $convenience_fee;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Meal_Seat_Charges'] = $booking->meal_charge + $booking->seat_charge;
                $data[$cart->id . '_' . $booking->traveler_id . '_' . $booking->carrier->code]['Net Fare'] = $booking->fuel_surcharge + $booking->udf_charge + $booking->jn_tax + $booking->other_tax + $booking->basic_fare + $booking->booking_fee - $booking->commission_or_discount_gross + $booking->meal_charge + $booking->seat_charge;
            }
        }
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out.='<tr><th>Bill Number</th><th>Bill Date</th><th>Booking Reference Number</th><th>Passenger Sales Rpt Date(AGT)</th><th>Bill Due Date</th><th>TK_AIRLINE</th><th>TICKET NO</th><th>Customer Code</th>'
            . '<th>Title of the passenger</th><th>Name of the Passenger</th><th>Travelling Sector</th><th>Travel Date</th><th>Flight NUMBER</th><th>Domestic or International Sect</th><th>Class of Travel</th><th>Basic Fare</th><th>Passenger Surcharge</th>'
            . '<th>Tax Amount</th><th>Service Charge</th><th>BONUS AMOUNT</th>'
            . '<th>Discount Amount</th><th>Commission</th><th>P if  Ticket Purch from agent</th><th>If BSP Ticket in Intl.</th><th>Vend. Cd from whom  tkt  purch</th><th>TK_BRN_ID</th></tr>';
        $i = 1;
        foreach ($data as $value) {
            $out = $out . '<tr><th>' . $value['AirCart'] . '</th><th>' . substr($value['created'], 0, 10) . '</th><th>' . $value['Crs_Pnr'] . '</th><th>' . substr($value['created'], 0, 10) . '</th><th>' . substr($value['created'], 0, 10) . '</th>'
                . '<th>' . $value['Marketing_Airline'] . '</th><th>' . $value['TicketNo'] . '</th><th>C00042</th>';
            $out = $out . '<th>' . $value['Traveler_Title'] . '</th><th>' . $value['Traveler'] . '</th><th>' . $value['Sector'] . '</th><th>' . $value['Departure'] . '</th><th>' . $value['Flight'] . '</th>'
                . '<th>' . $value['Type'] . '</th><th>' . $value['Booking_Class'] . '</th><th>' . $value['Base_Fare'] . '</th><th>' . $value['YQ_Tax'] . '</th>'
                . '<th>' . $value['Total_Taxes'] . '</th><th>' . $value['Booking_Fee'] . '</th><th>0</th>';
            $out = $out . '<th>' . $value['Commission'] . '</th><th>0</th><th>P</th><th>N</th><th>B0001</th>';
            $out = $out . '<th></th></tr>';
        }
        $out .= '</table>';
        return $out;
        // \Utils::arr2tableVertical($data);
        // \Utils::dbgYiiLog($data);
        //exit;
        //return $arr;
    }

    /**
     * Render the yatra amadeus report
     * @param date $fromdate From Date
     * @param date $todate To date
     * @return string $out html string
     */
    function renderYatraAmadeus($fromdate, $todate, $xls) {
        //    \Utils::dbgYiiLog('renderYatraAmadeus');
        $fromdate = $fromdate . ' 00:00:00';
        $todate = $todate . ' 23:59:59';

        $backendId = \Backend::AMADEUS_PRODUCTION;
        if (YII_DEBUG) {
            $backendId = \Backend::AMADEUS_TEST;
        }

        $bookings = \AirBooking::model()->with(array('airRoutes', 'abStatus', 'traveler', 'carrier', 'airCart', 'airSource'))->findAll(array(
            'condition' => 't.created>=\'' . $fromdate . '\' and t.created<=\'' . $todate . '\' and  t.ab_status_id=' . \AbStatus::STATUS_OK . ' and "airSource"."backend_id" = ' . $backendId,
            'order' => 't.id',
            'limit' => '10000'
        ));
        $isreturn = false;
        $multicity = false;
        $data = [];
        $cartdata = [];

        foreach ($bookings as $booking) {

            if (!isset($cartdata[$booking->air_cart_id])) {
                $cartdata[$booking->air_cart_id] = 1;
                $cartdata[$booking->air_cart_id . '_' . $booking->traveler_id]['paxcount'] = $cartdata[$booking->air_cart_id];
                $data[$booking->id]['paxcount'] = $cartdata[$booking->air_cart_id . '_' . $booking->traveler_id]['paxcount'];
            } else {
                if (!isset($cartdata[$booking->air_cart_id . '_' . $booking->traveler_id]['paxcount'])) {
                    $cartdata[$booking->air_cart_id] ++;
                    $cartdata[$booking->air_cart_id . '_' . $booking->traveler_id]['paxcount'] = $cartdata[$booking->air_cart_id];
                    $data[$booking->id]['paxcount'] = $cartdata[$booking->air_cart_id . '_' . $booking->traveler_id]['paxcount'];
                } else {
                    $data[$booking->id]['paxcount'] = $cartdata[$booking->air_cart_id . '_' . $booking->traveler_id]['paxcount'];
                }
            }

            $data[$booking->id]['AirCart'] = '<b><a href="/airCart/' . $booking->air_cart_id . '">' . $booking->air_cart_id . '</a></b>';
            $data[$booking->id]['BookingId'] = $booking->id;
            // $data[$booking->id]['Client_Source']=$booking->clientSource->name;
            $data[$booking->id]['created'] = $booking->created;
            $data[$booking->id]['Booking_Status'] = $booking->abStatus->name;
            //  $data[$booking->id]['Payment_Status']=$cart->paymentStatus->name;
            //  $data[$booking->id]['Name']=$cart->user->userInfo->name; 
            //  $data[$booking->id]['Booked_by']=$cart->user->userInfo->name; 
            //  $data[$booking->id]['Tour_Code']=$booking->tour_code; 
            //  $data[$booking->id]['Private_Code']=$booking->private_fare; 
            $data[$booking->id]['Pax_Type'] = $booking->travelerType->name;
            $data[$booking->id]['Traveler'] = $booking->traveler->first_name . ' ' . $booking->traveler->last_name;
            //   $data[$booking->id]['Traveler_Email']=$booking->traveler->email; 
            $data[$booking->id]['Traveler_Title'] = $booking->traveler->travelerTitle->name;

            if ($booking->service_type_id === \ServiceType::DOMESTIC_AIR) {
                $data[$booking->id]['Type'] = 'D';
            } else {
                $data[$booking->id]['Type'] = 'I';
            }

            $data[$booking->id]['Marketing_Airline'] = $booking->carrier->code;
            $data[$booking->id]['Airline'] = $booking->carrier->name;
            $data[$booking->id]['AirSource'] = $booking->airSource->name;
//               $routes = \AirRoutes::model()->findAll(array(
//                    'condition' => 'air_booking_id=' . $booking->id,
//                    'order' => 'departure_ts'
//                ));
            $routes = $booking->airRoutes;
            $data[$booking->id]['Flight'] = $routes[0]->flight_number;


            $data[$booking->id]['Source'] = $booking->source->airport_code;
            $data[$booking->id]['Destination'] = $booking->destination->airport_code;

            $data[$booking->id]['Booking_Class'] = $booking->booking_class;
            if (!empty($booking->cabin_type_id)) {
                $data[$booking->id]['Cabin_Class'] = $booking->cabinType->name;
            } else {
                $data[$booking->id]['Cabin_Class'] = '';
            }

            $data[$booking->id]['Fare_Basis'] = $booking->fare_basis;
            $data[$booking->id]['Departure'] = substr($booking->departure_ts, 0, -3);
            $data[$booking->id]['Arrival'] = substr($booking->arrival_ts, 0, -3);
            $data[$booking->id]['Airlne_Pnr'] = $booking->airline_pnr;
            $data[$booking->id]['Crs_Pnr'] = $booking->crs_pnr;
            if ($booking->ticket_number === 'N/A') {
                $data[$booking->id]['TicketNo'] = '';
            } else {
                if (isset(explode('-', $booking->ticket_number)[1])) {
                    $data[$booking->id]['TicketNo'] = explode('-', $booking->ticket_number)[1];
                } else {
                    $data[$booking->id]['TicketNo'] = $booking->ticket_number;
                }
            }

            $data[$booking->id]['Base_Fare'] = $booking->basic_fare;
            $data[$booking->id]['YQ_Tax'] = $booking->fuel_surcharge;
            $data[$booking->id]['UDF_Tax'] = $booking->udf_charge;
            $data[$booking->id]['Service_Tax'] = $booking->jn_tax;
            $data[$booking->id]['Other_Tax'] = $booking->other_tax;
            $data[$booking->id]['Total_Taxes'] = $booking->udf_charge + $booking->jn_tax + $booking->other_tax;
            $data[$booking->id]['Commission'] = $booking->commission_or_discount_gross;
            $data[$booking->id]['Booking_Fee'] = $booking->booking_fee;
            $data[$booking->id]['Meal_Seat_Charges'] = $booking->meal_charge + $booking->seat_charge;
            $data[$booking->id]['Net Fare'] = $booking->fuel_surcharge + $booking->udf_charge + $booking->jn_tax + $booking->other_tax + $booking->basic_fare + $booking->booking_fee - $booking->commission_or_discount_gross + $booking->meal_charge + $booking->seat_charge;
        }
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out.='<tr><th>RowId</th><th>PNRNO</th><th>PAXNO</th>'
            . '<th>PASSANGERNAME</th><th>PASSANGERType</th><th>TICKETNUMBER</th>'
            . '<th>COUPON</th><th>ORIGIN</th><th>DESTINATION</th>'
            . '<th>AIRLINE_CODE</th><th>VALIDATINGCARR</th><th>CLASS</th>'
            . '<th>FAREBASIS</th><th>FLIGHT_NUMBER</th><th>FLIGHT_DATE</th>'
            . '<th>FLIGHT_TIME</th><th>ARRIVAL_DATE</th><th>ARRIVAL_TIME</th>'
            . '<th>FARE</th><th>YQ</th><th>TAX</th>'
            . '<th>WO</th><th>TAXCODE</th><th>TAXAMOUNT</th>'
            . '<th>SERVICEFEE</th><th>REFERENCEID</th>'
            . '<th>MGT_FEE</th><th>CREDITCARDNO</th><th>CCAMOUNT</th>'
            . '<th>CCTRANSACTIONNO</th><th>CCLedger</th><th>CCBANK</th>'
            . '<th>CCTRACKID</th><th>SERVICETAX</th><th>EDUCATIONCESS</th>'
            . '<th>HEDUCESS</th><th>CLIENTCODE</th><th>INV_TYPE</th>'
            . '<th>SUPPLIER</th><th>BOOKING_DATE</th><th>TICKETING_DATE</th>'
            . '<th>PAYMENT_SOURCE</th><th>IS_INVOICE_CREATED</th><th>MSG</th>'
            . '<th>INVOICE_INPUT_XML</th><th>INSERTED_DATE</th><th>MODIFY_DATE</th>'
            . '<th>INVOICE_TYPE</th><th>EMPLOYEECODE</th><th>MOBILENUMBER</th>'
            . '<th>ADDRESS</th><th>POSITION</th><th>BAND</th>'
            . '<th>DEPARTMENT</th><th>COSTCENTER</th><th>REQUESTID</th>'
            . '<th>REGION1</th><th>REGION2</th><th>OTHER_SERVICE_CHGS</th>'
            . '<th>MARKUP</th><th>SERVICETAX_ON_SCHGS</th><th>EDUCATIONCESS_ON_STAX_ONSCHGS</th>'
            . '<th>HEDUCESSON_STAX_ON_SCHGS</th><th>COMM</th><th>OV_COMM</th>'
            . '<th>OTHER_INCENTIVE</th><th>TDS_ON_COMM</th><th>SURCHGS_ON_TDS_ON_COMM</th>'
            . '<th>EDUCSS_ON_TDS_ON_COMM</th><th>HIGHERC_ESS_ON_TDS_On_COMM</th><th>RAF</th>'
            . '<th>DISCOUNT</th><th>TDS_ON_DISCOUNT</th><th>SURCHGS_ON_TDS_ON_DISCOUNT</th>'
            . '<th>EDUCSS_ON_TDS_ON_DISCOUNT</th><th>HIGHER_CESS_ON_TDS_ON_DISCOUNT</th><th>CC_SURCHGS_AMT</th>'
            . '<th>SALESMAN_COMM_AMT</th><th>SUPPLIER_SERVICE_CHGS_AMT</th><th>COMPANY</th>'
            . '<th>BRANCH</th><th>TRIPNUMBER</th><th>SEQUENCENUMBER</th>'
            . '<th>BILL_NUMBER</th><th>FYEAR</th><th>WEBSERVICE_INPUT_XML</th>'
            . '<th>WEBSERVICE_CONFIRMATION_FLAG</th><th>WEBSERVICE_OUTPUT_XML</th>'
            . '<th>WEBSERVICE_STATUS_MSG</th><th>WEBSERVICE_HIT_COUNT</th><th>WEB_SERVICE_HIT_TIME</th>'
            . '<th>SERVICE_TAX_ON_SERVICE_CHARGE_PER</th><th>EDUCATION_CESS_ON_SERVICE_TAX_ON_SERVICE_CHARGE_PER</th><th>HIGHER_EDUCATION_CESS_ON_SERVICE_TAX_ON_SERVICE_CHARGE_PER</th>'
            . '<th>SERVICE_TAX_ON_SERVICE_CHARGE_AMOUNT</th><th>EDUCATION_CESS_ON_SERVICE_TAX_ON_SERVICE_CHARGE_AMOUNT</th><th>HIGHER_EDUCATION_CESS_ON_SERVICE_TAX_ON_SERVICE_CHARGE_AMT</th>'
            . '<th>TRIPNO_INSERTED_DATE</th><th>TRIPNO_STATUS</th>'
            . '</tr>';

        $i = 1;
        foreach ($data as $value) {
            $ct = 1;
            if (isset(explode('-', $value['Airlne_Pnr'])[1])) {
                $ct = explode('-', $value['Airlne_Pnr'])[1];
            }
            $out = $out . '<tr><th>' . $value['BookingId'] . '</th>'
                . '<th>' . $value['Crs_Pnr'] . '</th>'
                . '<th>' . $ct . '</th>'
                . '<th>' . $value['Traveler'] . '</th>'
                . '<th>' . $value['Pax_Type'] . '</th>'
                . '<th>' . $value['TicketNo'] . '</th>'
                . '<th></th>'
                . '<th>' . $value['Source'] . '</th>'
                . '<th>' . $value['Destination'] . '</th>'
                . '<th>' . $value['Marketing_Airline'] . '</th>'
                . '<th></th>'
                . '<th>' . $value['Booking_Class'] . '</th>'
                . '<th>' . $value['Fare_Basis'] . '</th>'
                . '<th>' . $value['Flight'] . '</th>'
                . '<th>' . substr($value['Departure'], 0, 10) . '</th>'
                . '<th>' . substr($value['Departure'], 11, 5) . '</th>'
                . '<th>' . substr($value['Arrival'], 0, 10) . '</th>'
                . '<th>' . substr($value['Arrival'], 11, 5) . '</th>'
                . '<th>' . $value['Base_Fare'] . '</th>'
                . '<th>' . $value['YQ_Tax'] . '</th>'
                . '<th>' . $value['Total_Taxes'] . '</th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th>' . $value['Booking_Fee'] . '</th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th>' . $value['Service_Tax'] . '</th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th>' . $value['AirSource'] . '</th>'
                . '<th>' . substr($value['created'], 0, 10) . '</th>'
                . '<th>' . substr($value['created'], 0, 10) . '</th>'
                . '<th>CASH</th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th>' . $value['Commission'] . '</th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '<th></th>'
                . '</tr>';
        }
        $out .= '</table>';
        return $out;
        // \Utils::arr2tableVertical($data);
        // \Utils::dbgYiiLog($data);
        //exit;
        //return $arr;
    }

    function renderReceiptReport($fromdate, $todate, $xls) {

        $monthMap = [
            1 => 'A', 2 => 'B', 3 => 'C', 4 => 'D', 5 => 'E', 6 => 'F', 7 => 'G', 8 => 'H', 9 => 'I', 10 => 'J', 11 => 'K', 12 => 'L',
        ];
        $fromdate = $fromdate . ' 00:00:00';
        $todate = $todate . ' 23:59:59';
        if (YII_DEBUG) {
            $transactions = \PayGateLog::model()->with(array('airCart' => array('alias' => 'ac')))->findAll(array(
                'condition' => 't.status_id=' . \TrStatus::STATUS_SUCCESS . ' and ((t.action_id=' . \TrAction::ACTION_CAPTURE . ' and t.pg_id in (' . \PaymentGateway::AMEX_TEST . ',' . \PaymentGateway::AXIS_TEST . ',' . \PaymentGateway::HDFC2_TEST . ')) or ( t.action_id=' . \TrAction::ACTION_SENT . ' and t.pg_id in (' . \PaymentGateway::PAYU_TEST_ID . ',' . \PaymentGateway::ATOM_TEST . ',' . \PaymentGateway::PAYTM_TEST. ',' . \PaymentGateway::HDFC_TEST . ',' .\PaymentGateway::CCAVENUE_TEST . ',' . \PaymentGateway::HDFC_UPI_TEST . '))) and  t.updated>=\'' . $fromdate . '\' and t.updated<=\'' . $todate . '\'',
                'order' => 't.id',
                'limit' => '10000'
            ));
        } else {
            $transactions = \PayGateLog::model()->with(array('airCart' => array('alias' => 'ac')))->findAll(array(
                'condition' => 't.status_id=' . \TrStatus::STATUS_SUCCESS . ' and ((t.action_id=' . \TrAction::ACTION_CAPTURE . ' and t.pg_id in (' . \PaymentGateway::AMEX_PRODUCTION . ',' . \PaymentGateway::AXIS_PRODUCTION . ',' . \PaymentGateway::HDFC2_PRODUCTION . ')) or ( t.action_id=' . \TrAction::ACTION_SENT . ' and t.pg_id in (' . \PaymentGateway::PAYU_PRODUCTION_ID . ',' . \PaymentGateway::ATOM_PRODUCTION . ',' . \PaymentGateway::PAYTM_PRODUCTION.',' . \PaymentGateway::HDFC_PRODUCTION . ',' .\PaymentGateway::CCAVENUE_PRODUCTION . ',' . \PaymentGateway::HDFC_UPI_PRODUCTION. '))) and t.updated>=\'' . $fromdate . '\' and t.updated<=\'' . $todate . '\'',
                'order' => 't.id',
                'limit' => '10000'
            ));
        }
        $isreturn = false;
        $multicity = false;
        $data = [];
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out.='<tr><th>VC_TYPE</th><th>VC_CODE</th><th>VC_VOUCHNO</th><th>VC_VOUCHDT</th><th>VC_DESCRIP</th><th>VC_BLIV_NO</th><th>VC_BLIV_DT</th><th>VC_CHEQ_NO</th>'
            . '<th>VC_CHEQ_DT</th><th>VC_RECON</th><th>VC_DR_CR</th><th>VC_AMOUNT</th><th>VC_SYS_DAT</th><th>VC_SYS_TIM</th><th>VC_CTRLTOT</th><th>VC_PAY_TO</th><th>VC_SUB_LED</th>'
            . '<th>VC_SRNO</th><th>VC_USER</th><th>VC_UPD_DTE</th>'
            . '<th>VC_UPD_TIM</th><th>VC_BDSN</th><th>VC_CC</th><th>VC_CUR_COD</th><th>VC_F_AMT</th><th>VC_ROE</th><th>VC_BRN_ID</th></tr>';


        foreach ($transactions as $transaction) {
            if (!isset($data[$transaction->pg_id][date("d-m-y", strtotime($transaction->updated))])) {
                $data[$transaction->pg_id][date("d-m-y", strtotime($transaction->updated))] = 0;
            }
            $data[$transaction->pg_id][date("d-m-y", strtotime($transaction->updated))]+=$transaction->amount + $transaction->convince_fee;
            $vcnotext = $monthMap[(int) date("m", strtotime($transaction->updated))] . date("d", strtotime($transaction->updated)) . date("y", strtotime($transaction->updated));
            $vcno = \PaymentGateway::$vcnodeMap[$transaction->pg_id] . $vcnotext;
            //\Utils::dbgYiiLog(['id'=>$transaction->id,'Type'=>date("d-m-y", strtotime($transaction->updated)),'VCNO'=>$vcno]);
            $invoice = '';
            $cartdate = '';
            if (isset($transaction->air_cart_id)) {
                $invoice = $transaction->airCart->invoice_no;
                $cartdate = date("d-m-y", strtotime($transaction->airCart->created));
            }
            $out.='<tr><td>BRV</td><td>' . \PaymentGateway::$vccodeMap[$transaction->pg_id] . '</td><td>' . $vcno . '</td><td>' . date("d-m-y", strtotime($transaction->updated)) . '</td><td>PAYMENT FOR Cart ' . $transaction->air_cart_id . '</td>'
                . '<td>' . $invoice . '</td><td>' . $cartdate . '</td><td>' . $transaction->id . '</td>'
                . '<td>' . date("d-m-y", strtotime($transaction->updated)) . '</td><td></td><td>C</td><td>' . ($transaction->amount + $transaction->convince_fee) . '</td><td></td><td></td><td></td><td></td><td>C00042</td>'
                . '<td></td><td></td><td></td>'
                . '<td></td><td></td><td></td><td></td><td>0</td><td>0</td><td></td></tr>';
        }
        // \Yii::app()->end();
        foreach ($data as $key => $arr) {
            foreach ($arr as $dt => $value) {
                $vcarr = explode('-', $dt);
                $d = $vcarr[0];
                $m = $vcarr[1];
                $y = $vcarr[2];
                $vcnotext = $monthMap[(int) $m] . $d . $y;
                $vcno = \PaymentGateway::$vcnodeMap[$key] . $vcnotext;
                $out.='<tr><td>BRV</td><td>' . \PaymentGateway::$vccodeMap[$key] . '</td><td>' . $vcno . '</td><td>' . $dt . '</td><td>DEBIT</td>'
                    . '<td></td><td>' . $dt . '</td><td></td>'
                    . '<td>' . $dt . '</td><td></td><td>D</td><td>' . $value . '</td><td></td><td></td><td></td><td></td><td>C00042</td>'
                    . '<td></td><td></td><td></td>'
                    . '<td></td><td></td><td></td><td></td><td>0</td><td>0</td><td></td></tr>';
            }
        }

        $out .= '</table>';
        return $out;
        // \Utils::arr2tableVertical($data);
        // \Utils::dbgYiiLog($data);
        //exit;
        //return $arr;
    }

    static function renderChart(array $data, $report, $options) {
        $out['report'] = str_replace(' ', '', $report);
        $out['data'] = [];
        if (!isset($data[0])) {
            return $out;
        }
        $out['options'] = $options;
        if (is_array($data[0])) {
            $out['data'][0] = array_keys($data[0]);
        } else {
            $out['data'][0] = array_keys($data[0]->attributes);
        }
        foreach ($data as $row) {
            $tmp = array_values($row);
            array_walk($tmp, function (&$value, $key) {
                if (is_numeric($value) && $key !== 0) {
                    $value = intval($value);
                }
            });
            $out['data'][] = $tmp;
        }
        return $out;
    }

}
