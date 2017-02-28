set PGUSER=belair_dba
set PGPASSWORD="jhndmj24^%*"

e:\Programs\PostgreSQL\9.1\bin\pg_dump -h localhost -p 5432 -f belair_db.gz -O -x -Z 9 -U belair_dba -W belair_db
