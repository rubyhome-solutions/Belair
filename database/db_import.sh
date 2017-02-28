#!/bin/sh

psql -d belair_db -h localhost -p 5432 -U belair_dba -W < Belair-db_pgsql.sql
psql -d belair_db -h localhost -p 5432 -U belair_dba -W < Belair_DB_data.sql
