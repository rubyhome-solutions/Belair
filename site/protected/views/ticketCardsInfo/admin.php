<?php
/* @var $this TicketCardsInfoController */
/* @var $model TicketCardsInfo */

$this->breadcrumbs=array(
	'Ticket Credit Cards Info'=>array('index'),
	'Manage',
);


?>

<h1>Manage Ticket Credit Cards Info</h1>

<a href='/ticketCardsInfo/create' class='btn primary blue' style='float:right'>Create</a>
<br />
<?php $this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'ticket-cards-info-grid',
	'dataProvider'=>$model->search(),
	'columns'=>array(
        [
           'name'=> 'card_type',
           'value' => '$data->card_type',
           'headerHtmlOptions' => ['style' => 'width: 160px;'],
        ],        
        [
           'name'=> 'card_no',
           'value' => '$data->card_no',
           'headerHtmlOptions' => ['style' => 'width: 160px;'],
        ],       
		[
            'name' => 'expiry',
            'value' => '$data->expiry',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
        ],
        [
            'name' => 'status',
            'value' => '($data->status==1)?"Active":"Inactive"',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
        ],
        [
            'name' => 'created',
            'value' => '\Utils::cutMilliseconds($data->created)',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
        ],
              
        array(
			'class'=>'CButtonColumn',
            'template'=>'{update}{delete}',
		),
	),
)); ?>
