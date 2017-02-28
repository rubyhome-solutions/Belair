-- SELECT air_cart.user_id, generate_series(min(air_cart.created), max(air_cart.created), '1 week') date_ 
-- FROM air_cart GROUP BY 1


-- SELECT t.user_info_id, t.year_, t.month_, 
-- 12*t.year_+t.month_ period,
-- coalesce(sum(p.total_fare),0) FROM v_generated_periods_by_userinfoid t 
-- LEFT JOIN v_sales_by_month p ON t.user_info_id=p.user_info_id AND t.year_=p.year_ AND t.month_=p.month_
-- GROUP BY 1,2,3
-- ORDER BY 1,2,3


-- SELECT t.user_info_id, t.year_, t.week_, 
-- 52*t.year_+t.week_ period,
-- coalesce(sum(p.total_fare),0) FROM v_generated_periods_by_userinfoid t 
-- LEFT JOIN v_sales_by_week p ON t.user_info_id=p.user_info_id AND t.year_=p.year_ AND t.week_=p.week_
-- GROUP BY 1,2,3
-- ORDER BY 1,2,3

-- SELECT 
--     t.user_info_id AS "Reseller_ID", user_info.name AS "Reseller_Name", 
--     distributor.name AS "Distributor", 
--     t.year_ AS "Year", 
-- --     t.month_ AS "Month", 
--     t.week_ AS "Week", 
--     sum(this_period.segments) AS "Air_Segments" 
-- --     ,SUM(ab.basic_fare)::int8 AS "Total_Base_Fare", 
-- --     ,SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::float8 AS "Total_Fare"
--     ,sum(this_period.total_fare) AS "Total_Fare",
--     round(100*(coalesce(SUM(this_period.total_fare), 1)/sum(prev_period.total_fare)-1)::numeric,2)||'%' AS "Change_Percentage"
-- FROM v_generated_periods_by_userinfoid t 
-- JOIN "user_info" ON user_info.id=t.user_info_id
-- JOIN "users" ON users.user_info_id=user_info.id
-- -- JOIN "air_cart" "ac" ON ac.user_id=users.id AND EXTRACT('year' from ac.created)=t.year_ AND EXTRACT('week' from ac.created)=t.week_
-- LEFT JOIN "v_sales_by_week" prev_period ON prev_period.user_info_id=t.user_info_id AND 52*prev_period.year_+prev_period.week_=52*t.year_+ t.week_-1
-- LEFT JOIN "v_sales_by_week" this_period ON this_period.user_info_id=t.user_info_id AND this_period.year_=t.year_  AND this_period.week_=t.week_
-- LEFT JOIN "sub_users" ON sub_users.reseller_id=user_info.id
-- LEFT JOIN "user_info" "distributor" ON sub_users.distributor_id=distributor.id
-- GROUP BY "Reseller_ID", "Reseller_Name", "Distributor", "Year", "Week"
-- ORDER BY "Reseller_Name", "Year", "Week"


SELECT t.user_info_id AS "Reseller_ID", user_info.name AS "Reseller_Name", 
-- distributor.name AS "Distributor", 
t.year_ AS "Year", t.week_ AS "Week", 
coalesce(this_period.segments, 0) AS "Air_Segments", 
coalesce(this_period.total_fare, 0) AS "Total_Fare", 
coalesce(prev_period.total_fare, 0) AS "Prev_Fare", 
-- this_period.total_fare::numeric / prev_period.total_fare::numeric AS "Change",
round(100*(coalesce(this_period.total_fare, 0)::numeric/prev_period.total_fare::numeric-1)::numeric,2)||'%' AS "Change_Percentage"
FROM "v_generated_week_periods_by_userinfoid" "t"
JOIN "user_info" ON user_info.id=t.user_info_id
-- JOIN "users" ON users.user_info_id=user_info.id
LEFT JOIN "v_sales_by_week" "prev_period" ON prev_period.user_info_id=user_info.id AND 52*prev_period.year_+prev_period.week_=52*t.year_+ t.week_-1
LEFT JOIN "v_sales_by_week" "this_period" ON this_period.user_info_id=user_info.id AND this_period.year_=t.year_ AND this_period.week_=t.week_
-- LEFT JOIN "sub_users" ON sub_users.reseller_id=user_info.id
-- LEFT JOIN "user_info" "distributor" ON sub_users.distributor_id=distributor.id
-- GROUP BY "Reseller_ID", "Reseller_Name", "Distributor", "Year", "Week"
ORDER BY "Reseller_Name", "Year", "Week"