<?php

$ac = AirCart::model()->findByPk(474);
echo \Utils::dbg($ac->attributes);
$ac2 = AirCart::model()->findByPk(473);
echo \Utils::dbg($ac2->attributes);
$ac->mergeCarts([$ac2]);
echo \Utils::dbg($ac->attributes);

