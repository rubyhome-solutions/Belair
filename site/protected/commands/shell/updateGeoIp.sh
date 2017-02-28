#!/bin/bash

start_timer=`date +%s`

cd /usr/local/share/GeoIP
/usr/bin/wget -N -q http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz
/usr/bin/wget -N -q http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz
/usr/bin/wget -N -q http://geolite.maxmind.com/download/geoip/database/GeoIPv6.dat.gz

/bin/gunzip -c GeoLiteCity.dat.gz > GeoLiteCity.dat
/bin/gunzip -c GeoIP.dat.gz > GeoIP.dat
/bin/gunzip -c GeoIPv6.dat.gz > GeoIPv6.dat

end_timer=`date +%s`
echo -e "GeoIp execution time: "$((end_timer-start_timer))" sec.\n================================================================\n\n"
