#!/bin/bash
# By Tony: tonyboy0777@gmail.com

start_timer=`date +%s`
date
PGUSER=belair_dba
PGPASSWORD=jhndmj24^%*
export PGUSER PGPASSWORD

#SELECT 'Archiving the new searches' as message;
#INSERT INTO searches_arch (id, user_id, created, origin, destination, type_id, is_domestic, date_depart, date_return, adults, children, infants, category, client_source_id, hits)
#(   select id, user_id, created, origin, destination, type_id, is_domestic, date_depart, date_return, adults, children, infants, category, client_source_id, hits from searches 
#        where created + interval '24 hour'<'now'
#);

/usr/bin/psql -h db1.local -p 5432 belair_db << EOF

SELECT 'Delete processes older than 1h:' as message;
DELETE FROM public.process WHERE result IS NOT NULL AND queued + interval '1 hour'<'now';

SELECT 'Delete searches older than 12 hours:' as message;
DELETE from searches where created + interval '10 hour'<'now';

EOF

#reset the credentials
PGUSER=""
PGPASSWORD=""
export PGUSER PGPASSWORD

end_timer=`date +%s`
echo -e "Execution time: "$((end_timer-start_timer))" sec.\n================================================================\n\n"
