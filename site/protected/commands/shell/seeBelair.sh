#!/bin/bash
# By Tony: tonyboy0777@gmail.com

uptime
echo "PHP sessions:" `sudo ls -la /var/lib/php5/sessions | wc -l`
echo "Apache processes:" `ps xuaf | fgrep apache | wc -l`
echo "REDIS: "
redis-cli info | egrep "(connected_clients|used_memory_human|db0:keys)"
echo -e "\nPostgreSQL sessions:" `netstat -na | fgrep 5432 | wc -l`

PGUSER=belair_dba
PGPASSWORD=jhndmj24^%*
export PGUSER PGPASSWORD

/usr/bin/psql -h db1.local -p 5432 belair_db << EOF
select 
case result 
when 2 then 'Stoped'
when 3 then 'Abandon'
else 'Pending'
end as res
, (started is null) as waiting, count(*) from process where result>1 or result is null group by 1,2 ;

EOF

#reset the credentials
PGUSER=""
PGPASSWORD=""
export PGUSER PGPASSWORD
