<?php $this->renderPartial('_style')?>

<?php //Yii::app()->clientScript->registerCoreScript('jquery.ui')?>

<div class="wra-from form-1">
   <ul class="wra-tab clearfix">   	
		<li><a href="/booking/" title="Domestic Flights">Domestic Flights</a></li>
		<li class="active"><a href="/booking/international" title="International Flights">International Flights</a></li>
   </ul>
   <div class='wra-content'>
	<?php
	$this->renderPartial('_multi_form', array(
		'model' => $model,
		'cities' => $cities,		
		'categories' => $categories,
		'airlines' => $airlines));?>
	</div>
</div>

<?php $this->renderPartial('_jsscript', array('airports' => $airports))?>

<script type="text/javascript">
$(document).ready(function() {
	

	
});

</script>