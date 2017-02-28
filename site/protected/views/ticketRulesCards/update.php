<?php

$this->breadcrumbs=array(
	'Manage TicketCreditCardRules'=>array('admin'),
	$model->id,
);

?>

<h3>Update Ticket Credit Card Rule<?php echo $model->id; ?></h3>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>