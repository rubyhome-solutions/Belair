select air_cart.id as cart_id, air_booking.id as booking_id, air_routes.* from air_routes 
join air_booking on (air_booking.id = air_routes.air_booking_id)
join air_cart on (air_cart.id = air_booking.air_cart_id)
where  air_cart.id = 147
order by 1, 2, air_routes.departure_ts ;


-- Check the forward and backward results
select air_source.name, grouping, order_, count(*) from routes_cache 
join air_source on (routes_cache.air_source_id=air_source.id)
--join backend on (backend.id=air_source.backend_id)
where last_check > 'today' and order_ not in (9999, 11)
group by 1,2,3
order by grouping;

-- Existing RC or findsame
select * from routes_cache 
WHERE destination_id=2463
AND origin_id=1236 
AND air_source_id=8
and carrier_id=59
and departure_date='2015-04-04'
-- and departure_time='20:50:00'
-- and arrival_date='2015-04-05'
-- and arrival_time='23:40:00'
order by id

-- RC counting
select rc.air_source_id, rc."grouping", count(*) from routes_cache rc
join search_x_cache on rc.id=search_x_cache.cache_id
where search_x_cache.search_id=231 and rc.order_ in (12, 22)
group by 1,2
order by 1,2,3;

-- RC count only for LLCs by airSource TravellerType for the last search
select air_source_id, traveler_type_id, count(*) from "public".routes_cache
join search_x_cache on (search_x_cache.cache_id=routes_cache.id)
where search_x_cache.search_id = (select max(id) from searches) and order_<>9999
group by 1,2
order by 1,2 desc;

-- Origin & destination city pairs for specific carrier
select a1.airport_code origin, a2.airport_code destination from city_pairs
join airport a1 on a1.id=city_pairs.source_id
join airport a2 on a2.id=city_pairs.destination_id
where carrier_id=129 and a1.airport_code='BLR'

-- Last few Searches inspection
select search_id, air_source_id, air_source."name" asName, command, started, ended, "result", note, "parameters" from process
join air_source on air_source.id=process.air_source_id
where search_id+3 > (select max(search_id) from process)
order by search_id desc;


-- Air Summary report
SELECT ma.name AS "Airline_Name", ma.code AS "Airline_Code",
sum ( CASE ab.service_type_id WHEN 2 THEN 1 ELSE 0 END) AS "International",
sum ( CASE ab.service_type_id WHEN 1 THEN 1 ELSE 0 END) AS "Domestic",
count(*) AS "Total"
FROM "air_cart" "ac"
JOIN "air_booking" "ab" ON ac.id=ab.air_cart_id
JOIN "carrier" "ma" ON ma.id=ab.carrier_id
GROUP BY "Airline_Code", "Airline_Name"
ORDER BY ma."name"


-- RC objects with wrong return date
select searches.*, routes_cache.* from search_x_cache
join routes_cache on routes_cache.id=search_x_cache.cache_id
join searches on searches.id=search_x_cache.search_id
where searches.date_return<>routes_cache.return_date

-- Delete the RC objects with wrong return date
delete from routes_cache rc
where rc.id in (
SELECT cache_id from search_x_cache
join routes_cache on routes_cache.id=search_x_cache.cache_id
join searches on searches.id=search_x_cache.search_id
where searches.date_return<>routes_cache.return_date
);

-- RCs that are not binded to any search
SELECT t.id from routes_cache t
LEFT JOIN search_x_cache on t.id=search_x_cache.cache_id
WHERE search_x_cache.cache_id is null;

-- Delete RC objects that are from specific AirSource and binded to specific search
DELETE from routes_cache
WHERE air_source_id=:air_source_id AND id IN
(
    SELECT cache_id FROM search_x_cache 
    WHERE search_id=:search_id
);

-- RC objects that are attached to more than one search
SELECT count(*) _count, cache_id from search_x_cache
group by 2
HAVING count(*)>1
order by _count desc;

-- Delete RC objects that are attached to more than one search
DELETE from routes_cache WHERE id IN
(
    SELECT cache_id from search_x_cache
    group by cache_id
    HAVING count(*)>1
);

-- Delete RC objects that belong to specific backends
delete from routes_cache where air_source_id in
(
    select air_source.id from air_source
    join backend on air_source.backend_id=backend.id
    where backend.name in ('GoAir production', 'GoAir test' , 'Indigo production', 'Indigo test', 'Spicejet production', 'Spicejet test')
);

-- Delete RC objects that belong to specific backends and are not economy class
delete from routes_cache where cabin_type_id <> 1 AND air_source_id in
(
    select air_source.id from air_source
    join backend on air_source.backend_id=backend.id
    where backend.name in ('Indigo production', 'Indigo test', 'Spicejet production', 'Spicejet test')
);

-- Update the user+info, where there is no mobile defined
update user_info t set 
t.mobile = (select mobile from users where users.user_info_id=t.id limit 1),
t.name = (select name from users where users.user_info_id=t.id limit 1)
where t.mobile is null;


-- Delete the RCs from excluded carriers
delete FROM routes_cache where carrier_id in
( select id from carrier where disabled=1 );

-- Cache distribution by air source
select air_source."name", count(*) from routes_cache 
join air_source on routes_cache.air_source_id=air_source.id
group by 1 order by 2;