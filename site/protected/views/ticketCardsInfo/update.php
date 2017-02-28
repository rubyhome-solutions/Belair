<?php
/* @var $this TicketCardsInfoController */
/* @var $model TicketCardsInfo */

$this->breadcrumbs=array(
	'Ticket Credit Cards Info'=>array('index'),
	'Update',
);

?>

<h1>Update Ticket Credit Cards Info<?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>