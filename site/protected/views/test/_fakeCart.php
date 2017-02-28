<?php

$fake = \AirCart::model()->findByPk(321);
$real = \AirCart::model()->findByPk(322);
$fake->removeFake($real);
echo \Utils::dbg("Removed fake cart $fake->id, joined to $real->id");
$real->refresh();
echo \Utils::dbg($real->attributes);

