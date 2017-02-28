<?php

echo \Utils::dbg(\Utils::getGeoIpJsonStringV2());
echo \Utils::dbg(\Utils::getGeoIpJsonStringV2('127.0.0.1'));
echo \Utils::dbg(\Utils::getGeoIpJsonStringV2('192.168.0.1'));
echo \Utils::dbg(\Utils::getGeoIpJsonStringV2('208.80.152.201'));
echo \Utils::dbg(\Utils::getGeoIpJsonStringV2('61.2.45.16'));
echo \Utils::dbg(\Utils::getGeoIpJsonStringV2(''));

