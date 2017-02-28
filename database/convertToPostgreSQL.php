<?php

define ('SQL_FILE_IN','Belair-db.sql');
define ('SQL_FILE_OUT','Belair-db_pgsql.sql');

$search = array ('TINYINT', 'DOUBLE');
$replace = array ('SMALLINT', 'REAL');

chdir(__DIR__);
$content = file_get_contents(SQL_FILE_IN);
$content = str_replace($search, $replace, $content);

// Cascade table drop
$content = preg_replace('/^DROP (.*?);$/m','DROP $1 CASCADE;',$content);

// Foreig keys names
$content = preg_replace('/^\s+FOREIGN KEY (.*?)\((.*)$/m','  FOREIGN KEY ($2',$content);

// Timestamps - add the time zone
$content = str_replace('TIMESTAMP','timestamp without time zone',$content);

// Exclude PRIMARY key generations
$content = preg_replace('/CREATE INDEX PRIMARY ON.*?$/m','',$content);

// echo $content;
file_put_contents(SQL_FILE_OUT,$content);

?>