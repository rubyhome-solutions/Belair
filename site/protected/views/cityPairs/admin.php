<?php

/* @var $this CityPairsController */
/* @var $model CityPairs */
/* @var $carriers Carrier[] */

$this->breadcrumbs = ['City Pairs' => ['admin'],
    'Manage',
];
?>
<p style="max-width: 95%;" class='well well-small alert-info'>&nbsp;&nbsp;<i class='fa fa-cog fa-2x fa-spin'></i><span style='vertical-align:super;'>&nbsp;&nbsp;&nbsp;City Pairs</span></p>

<?php

$this->renderPartial('_admin_grid', [
    'model' => $model,
    'carriers' => $carriers,
]);
