<?php

//application\components\Reporting\Statistics::test();
for ($i=0; $i<100; $i++) {
    application\components\Reporting\Statistics::addDeeplinkResponse(rand(2,5), 1);
}
echo \Utils::arr2table(application\components\Reporting\Statistics::getDeeplinkStats());
