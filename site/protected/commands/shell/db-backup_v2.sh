#!/bin/bash
# Adapted by Tony: tonyboy0777@gmail.com

PGUSER=belair_dba
PGPASSWORD=jhndmj24^%*
export PGUSER PGPASSWORD

tdate=`date +%d-%b-%Y`

/usr/bin/pg_dump -d belair_db -h localhost -p 5432 -f /home/tony/backup/$tdate.belair_db.gz -O -x -Z 9 --exclude-table-data=routes_cache --exclude-table-data=searches --exclude-table-data=process --exclude-table-data=searches_arch --exclude-table-data=booking_log --exclude-table-data=booking_log_arch --exclude-table-data=rc_link --exclude-table-data=email_sms_log --exclude-table-data=booking_log_searches

#reset the credentials
PGUSER=""
PGPASSWORD=""
export PGUSER PGPASSWORD

/usr/local/bin/megarm /Root/backup/Belair/db1/$tdate.belair_db.gz 2>/dev/null
/usr/local/bin/megaput --reload --no-progress --path=/Root/backup/Belair/db1 /home/tony/backup/$tdate.belair_db.gz
