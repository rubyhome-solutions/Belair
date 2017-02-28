<?php
/* @var $this TicketRulesCardsController */
/* @var $model TicketRulesCards */

$this->breadcrumbs = array(
    'Ticket CreditCardsRules' => array('admin'),
    'Manage',
);
$carriers = CHtml::listData(\Carrier::model()->findAll(['order' => 'code']), 'id', 'code');

Yii::app()->clientScript->registerScript('search', "
$('.search-button').click(function(){
	$('.search-form').toggle();
	return false;
});
$('.search-form form').submit(function(){
	$('#ticket-rules-cards-grid').yiiGridView('update', {
		data: $(this).serialize()
	});
	return false;
});
");
?>

<h1>Manage Ticket CreditCardsRules</h1>


<a href='/ticketRulesCards/create' class='btn primary blue' style='float:right'>Create</a>


<?php
$this->widget('zii.widgets.grid.CGridView', array(
    'id' => 'ticket-rules-cards-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => array(
        [
            'name' => 'airline_id',
            'value' => '$data->airline->code',
            'headerHtmlOptions' => ['style' => 'width: 130px;'],
            'filter' => $carriers,
        ],
        [
            'name' => 'journey_type',
            'value' => '\TicketRulesCards::$journey[$data->journey_type]',
            'headerHtmlOptions' => ['style' => 'width: 130px;'],
            'filter' => \TicketRulesCards::$journey,
        ],
        array(
            'class' => 'CButtonColumn',
            'template'=>'{view}{update}{delete}',
        ),
    ),
));



?>
