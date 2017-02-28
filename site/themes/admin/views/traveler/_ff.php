<?php
/* @var $model Traveler */

$rels = new CArrayDataProvider($model->ffSettings, array(
    'keyField' => 'ff_carriers_id'
));

$selectPromotion = TbHtml::dropDownList('FfSettings[ff_carriers_id]', '',
        CHtml::listData(FfCarriers::model()->findAll(array('order'=>'id')), 'id', 'name'),
        array('empty'=>'Select the program'));

$buttonPlus = TbHtml::submitButton('<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Save', array(
    'color' => TbHtml::BUTTON_COLOR_WARNING,
    'style' => 'white-space:nowrap;',
    'encode' => false,
));

$this->widget('bootstrap.widgets.TbGridView', array(
    'dataProvider' => $rels,
    'id' => 'grid-ff-settings',
    'type' => array(TbHtml::GRID_TYPE_BORDERED, TbHtml::GRID_TYPE_CONDENSED),
    'columns' => array(
        array(
            'header' => 'FF program',
            'value' => '$data->carrier->name',
            'footer' => $selectPromotion,
        ),
        array(
            'header' => 'FF code',
            'name' => 'code',
            'footer' => TbHtml::textField('FfSettings[code]', '', ['placeholder' => 'FF number', 'style'=>'max-width:200px;']),
        ),
        array(
            'class' => 'ext.bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => array('delete' => array('url' => '$this->grid->Controller->createUrl("ffDel",array("FfSettings[ff_carriers_id]"=>$data->ff_carriers_id, "id"=>'.$model->id.'))')),
            'footer' => $buttonPlus,
        ),
    ),
));



?>
