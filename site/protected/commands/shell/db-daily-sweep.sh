#!/bin/bash
# By Tony: tonyboy0777@gmail.com

start_timer=`date +%s`

date
tdate=`date +%d-%b-%Y`

# Get new proxies
# /usr/bin/php /home/tony/live/site/protected/components/llc_sites/proxy_parser/proxyparser.php

PGUSER=belair_dba
PGPASSWORD=jhndmj24^%*
export PGUSER PGPASSWORD

dbname="belair_db"
/usr/bin/psql -h db1.local -p 5432 $dbname << EOF
SELECT status, count(status) FROM llc_sites.website_proxies group by 1 order by 2 desc;

-- SELECT count(*) as Bad_proxies FROM llc_sites.proxies
-- JOIN llc_sites.website_proxies ON (llc_sites.proxies.id = llc_sites.website_proxies.proxy_id)
-- WHERE status = 0;

SELECT 'Delete inactive proxies:' as message;
DELETE FROM llc_sites.proxies WHERE id in (SELECT proxy_id from llc_sites.website_proxies WHERE status=0);

SELECT 'Delete RCs in the past:' as message;
-- SELECT COUNT(*) AS RCs_for_delete FROM public.routes_cache WHERE departure_date<'today';
DELETE FROM public.routes_cache WHERE departure_date<'today';

SELECT 'Append to search_count statistics:' as message;
INSERT INTO search_count (date_, client_source_id, "value") 
(
   SELECT  created::date, client_source_id, count(*) FROM searches where 
        created::date > (select max(date_) from search_count) AND
        created <'today' GROUP BY 1,2
);

SELECT 'Add cart count to search_count statistics:' as message;
UPDATE search_count SET carts_count = (
    SELECT count(*) FROM air_cart 
    WHERE air_cart.created<'today' AND air_cart.created::date = search_count.date_ 
        AND air_cart.client_source_id = search_count.client_source_id AND air_cart.booking_status_id=8
)
WHERE carts_count=0;

SELECT 'Delete RCs older than 24h:' as message;
delete from routes_cache where updated + interval '24 hour'<'now';

SELECT 'Delete archived searches older than 7 days:' as message;
delete from searches_arch where created + interval '7 day'<'now';

SELECT 'Delete aborted air bookings:' as message;
DELETE FROM air_booking where air_cart_id
IN (
SELECT id FROM air_cart ac 
    WHERE ac.booking_status_id=4
        AND ac.id not in (select air_cart_id from payment where air_cart_id is not null)
        AND ac.id not in (select air_cart_id from pay_gate_log where air_cart_id is not null)
);

SELECT 'Delete aborted air carts:' as message;
delete from air_cart ac 
where 
   ac.booking_status_id=4 and
   ac.id not in (select air_cart_id from air_booking) and 
   ac.id not in (select air_cart_id from payment where air_cart_id is not null) and
   ac.id not in (select air_cart_id from pay_gate_log where air_cart_id is not null)
;

SELECT 'Mark the carts older than 48 as aborted:' as message;
UPDATE air_cart ac SET booking_status_id=4 WHERE ac.booking_status_id=1 AND ac.payment_status_id=1 AND ac.created + interval '48 hour'<'now' 
AND ac.id not in (select air_cart_id from payment where air_cart_id is not null)
AND ac.id not in (select air_cart_id from pay_gate_log where air_cart_id is not null);

SELECT 'Delete booking_log_arch records older than 12 months:' as message;
DELETE FROM booking_log_arch WHERE created < date_trunc('month', CURRENT_TIMESTAMP) - interval '12 month';

SELECT 'Archiving booking_log records older than 3 months:' as message;
INSERT INTO booking_log_arch 
SELECT * FROM public.booking_log WHERE created < date_trunc('month', CURRENT_TIMESTAMP) - interval '3 month';

SELECT 'Delete booking_log records older than 3 months:' as message;
DELETE FROM public.booking_log WHERE created < date_trunc('month', CURRENT_TIMESTAMP) - interval '3 month';

SELECT 'Delete booking_log_searches records older than 10 days:' as message;
DELETE FROM public.booking_log_searches WHERE created < CURRENT_TIMESTAMP - interval '10 days';

EOF

scp -q db1.local:/var/log/postgresql/postgresql-9.4-main.log /home/tony/backup
/usr/bin/pgfouine -logtype stderr -file /home/tony/backup/postgresql-9.4-main.log 1> /home/tony/live/stats/pg/pg_stats_$tdate.html 2>/dev/null

# Sleep for 30min - give autovacuum chance to finish
# /bin/sleep 30m
# sudo -u postgres /usr/bin/vacuumdb -fzv -d belair_db &> /home/tony/live/stats/pg/vacuum_full.log
# /usr/bin/pgfouine_vacuum -file /home/tony/live/stats/pg/vacuum_full.log 1> /home/tony/live/stats/pg/pg_vacuum_stats_$tdate.html 2>/dev/null
# rm /home/tony/live/stats/pg/vacuum_full.log

#reset the credentials
PGUSER=""
PGPASSWORD=""
export PGUSER PGPASSWORD

end_timer=`date +%s`
echo -e "Execution time: "$((end_timer-start_timer))" sec.\n================================================================\n\n"
