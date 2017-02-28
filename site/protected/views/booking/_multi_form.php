
	<?php
	$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
		'id' => 'bookingForm',
	    'enableClientValidation' => true,
	    'clientOptions' => array(
	        'validateOnSubmit' => false,
	    ),
	));?>
           
             <div class="box clearfix">
                <h2 class="heading">International Flights</h2>
                <label class="radio-inline">
				   <input type="radio" class='way' name="BookingSearchForm[way]" id="oneway" value="<?php echo BookingSearchForm::ONE_WAY?>" 
				   	<?php echo ($model->way==BookingSearchForm::ONE_WAY) ? 'checked="checked"':''?>>
				   One Way
				</label>
				<label class="radio-inline">
				   <input type="radio" class='way' name="BookingSearchForm[way]" id="roundtrip" value="<?php echo BookingSearchForm::ROUND_TRIP?>"
				   	<?php echo ($model->way==BookingSearchForm::ROUND_TRIP) ? 'checked="checked"':''?>>
				   Round Trip
				</label>
				<label class="radio-inline">
				   <input type="radio" class='way' name="BookingSearchForm[way]" id="multicity" value="<?php echo BookingSearchForm::MULTICITY?>"
				   	<?php echo ($model->way==BookingSearchForm::MULTICITY) ? 'checked="checked"':''?>>
				   Multi City
				</label>
             </div>
             
             <div id='flights'>
	             <div class="row-fluid fr-con">
		               	<div class="span4" style="position: relative;">
						 <label class="text-la">From</label>
						 <input type='text' id='txt_src_1' class='typeahead source' autocomplete="off" 
						 	value='<?php echo (isset($cities[$model->source])) ? $cities[$model->source] : ''?>'
						 	data-target='#src1'>						 	 
						 
						 <input type="hidden" name='MulticityForm[source][]' id='src1' value="<?php echo $model->source?>">
						 <?php echo $form->error($model, 'source', array('class'=>'alert alert-error'))?>
					   </div>
					   <div class="span4" style="position: relative;">
				   			<label class="text-la">To</label>	   		
						 	<input type='text' id='txt_des_1' class='typeahead destination' autocomplete="off" 
						 		value='<?php echo (isset($cities[$model->destination])) ? $cities[$model->destination] : ''?>'
						 		data-target='#des1'>
						 	
						 	<input type="hidden" name='MulticityForm[destination][]' id='des1' value="<?php echo $model->destination?>">
					   </div>
		               <div class="span4">
		                <label class="text-la"></label>
		                <?php
			            $this->widget('zii.widgets.jui.CJuiDatePicker', array(
			                'id'=>'firstDate',	
			            	'name'=>'depart',		            	
			                // additional javascript options for the date picker plugin
			                'options' => array(			                		
			                    'dateFormat' => 'yy-mm-dd',                    
			                    'minDate' => date('Y-m-d'),
			                	'onSelect'=>'js:function(d, ins){
			                		//updateDate($(this));	

								}',
			                	'onClose'=> 'js:function( selectedDate ) {
			                				
			                	}'
			                ),
			                'htmlOptions' => array(
			                	'class' => 'departDate',
			                	'data-idx' => 1,
			                    'style' => 'display:none'                    
			                ),
			            ));
			            ?>
			            
		                 <a href='#' title="" class="fr-calen" onclick="$('#firstDate').datepicker('show');return false;">
						   <span class="moth-th"><span class="thu"><?php echo date('F', strtotime($model->depart))?></span><span class="moth"><?php echo date('D', strtotime($model->depart))?></span> </span>
						   <span class="day"><?php echo date('d', strtotime($model->depart))?></span>
						   <i class="fa fa-calendar"></i>
						 </a>
						 <input type='hidden' name = 'MulticityForm[depart][]' class='depart' value="<?php echo $model->depart?>">
		               </div>
	             </div>
	             
	             <div class="row-fluid fr-con">
	               <div class="span4">
	                 <label class="text-la">From</label>
	                 <input type="text" id='txt_src_2' class="form-control typeahead" autocomplete="off" placeholder="" data-target='#src2' >
	                 <input type="hidden" name='MulticityForm[source][]' id='src2'>
	               </div>
	               <div class="span4">
	                 <label class="text-la">To</label>
	                 <input type="text" id='txt_des_2' class="form-control typeahead" autocomplete="off" placeholder=""  data-target='#des2'>
	                 <input type="hidden" name='MulticityForm[destination][]' id='des2'>
	               </div>
	               <div class="span4">
	                 <label class="text-la"></label>
	                 
	                 <input type="text" class='departDate' data-idx='2'  name ='depart' style="display: none">
	                 
	                 <a href="#" title="" class="fr-calen select-calendar">
	                 	<span class="moth-th" style="display: none;"><span class="thu"></span><span class="moth"></span></span>
	                 	<span class="day" style="display: none;"></span>
	                 		                 	                 	
	                    <span class="text">Click here to <br>select travel date</span>
	                    <i class="fa fa-calendar"></i>
	                 </a>
	                 <input type='hidden' name = 'MulticityForm[depart][]' class='depart'>
	               </div>	               
	             </div>
	             
	             
             </div>
             <br/>
             <div class="text-right"><a href='#' id="addflight" class="btn"><i class="fa fa-plus"></i> Add new flight</a></div>
             
	         <div class="row box-space-1">
			   <div class="span2 adults">
				 <h6>Adults <em>12+ yrs</em></h6>
				 <div class="clearfix fr-button">
				   <button type="button" class="except spinner-step" data-step='-1'><span class="icon-minus"></span></button>
				   <span class="text spinner-value spinner-adult" data-target='#BookingSearchForm_adults'  data-min='1'><?php echo $model->adults;?></span>
				   <button type="button" class="added spinner-step" data-step='1'><span class="icon-plus"></span></button>
				 </div>
				 <?php echo CHtml::activeHiddenField($model, 'adults')?>
			   </div>
			   
			   <div class="span2">
				 <h6>Children  <em>2-12 yrs</em></h6>
				 <div class="clearfix fr-button">
				   <button type="button" class="except spinner-step" data-step='-1'><span class="icon-minus"></span></button>
				   <span class="text spinner-value " data-target='#BookingSearchForm_children' data-min='0'><?php echo $model->children;?></span>
				   <button type="button" class="added spinner-step" data-step='1'><span class="icon-plus"></span></button>
				 </div>
				 <?php echo CHtml::activeHiddenField($model, 'children')?>
			   </div>
			   
			   <div class="span2">
				 <h6>Infants <em>below 2 yrs</em></h6>
				 <div class="clearfix fr-button">
				   <button type="button" class="except spinner-step infant" data-step='-1'><span class="icon-minus"></span></button>
				   <span class="text spinner-value" data-target='#BookingSearchForm_infants' data-min='0'><?php echo $model->infants;?></span>
				   <button type="button" class="added spinner-step infant" data-step='1'><span class="icon-plus"></span></button>
				 </div>
				 <?php echo CHtml::activeHiddenField($model, 'infants')?>
			   </div>
			   
			   <div class="span2">
				 <h6>Class</h6>
				 <?php echo $form->dropDownList($model, 'category', $categories, array('class'=>'span2')); ?>
			   </div>
			   <div class="span2" style="margin-left: 30px">
				 <h6>Preferred Airline</h6>
				 <?php echo $form->dropDownList($model, 'preferred_airline', $airlines, array(
				 		'empty' => '',
				 		'class'=>'span2')); ?>
			   </div>
		 </div>
		 <br>
		 <input type='hidden' id='minDate' value="<?php echo date('Y-m-d');?>"/>
         <div id='msg' class="hide alert alert-error"></div>    
         <button type='submit' class="btn-sea">Search Flights</button>
	
<?php $this->endWidget(); ?>

<script type="text/javascript">

function updateDate(el)
{
	var date = $(el).datepicker("getDate");
	var p = $(el).parents('div.fr-con');

	$(p).find("input.depart").val(date);
	$(p).find(".fr-calen .thu").text(month[date.getMonth()]);		
	$(p).find(".fr-calen .moth").text(weekday[date.getDay()]);
	$(p).find(".fr-calen .day").text(date.getDate());	

	$(p).find('.moth-th, .day').show();
	$(p).find('.text').hide();

	var idx = $(el).attr("data-idx")-1; 
	date.setTime(date.getTime() + 86400000);
	//$( ".departDate:gt("+ idx +")" ).datepicker( "option", "minDate",  date);

	$('#minDate').val(date);

	refreshDates(el);
}

function resetDate(el)
{
	var p = $(el).parents('.fr-con');
	
	$(p).find('.moth-th, .day').hide();
	$(p).find('.text').show();

	$(p).find('.depart').val('');
	$('#minDate').val($(el).datepicker('getDate'));
}

function refreshDates(el)
{
	var date = $(el).datepicker("getDate");
	var idx = $(el).attr("data-idx")-1; 

	$( ".departDate:gt("+ idx +")" ).each(function(){
		var cur_date = $(this).datepicker('getDate');	
		
		if(cur_date != null && (parseFloat(date.getTime()) >= parseFloat(cur_date.getTime()))  ) {
			$(this).datepicker('option', 'minDate', date);
			resetDate($(this));
		}
	});
}

$(document).ready(function(){	
	var options = {
		'dateFormat':'yy-mm-dd',	
		'minDate': '<?php echo date('Y-m-d', strtotime('+1 day'));?>',	
		'onSelect':function(d, ins){
			updateDate($(this));

		},
		'onClose': function(selectedDate){
			$(this).parent().find("input.depart").val(selectedDate);
		}
	};
	
	$('.departDate').datepicker(options);

	$(document).on('click', '.select-calendar', function(e){
		e.preventDefault();
		
		$(this).parent().find('.departDate:first').datepicker('show');
	});

	$('input.way').click(function(){
		var value = $(this).val();

		if(value == 1 || value == 2)//international
		{
			window.location.href = '/booking/international';
		}		
	});

	$('#addflight').click(function(e){
		e.preventDefault();

		var num = $('div.fr-con').length;

		var prevDiv = $('div.fr-con:last');
		var div = $(prevDiv).clone();

		$(div).find('#txt_src_'+num).attr({
			'id': 'txt_src_'+(num+1),
			'data-target': '#src'+ (num+1)
		});
		$(div).find('#txt_des_'+num).attr({
			'id': 'txt_des_'+(num+1),
			'data-target': '#des'+ (num+1)
		});
		$(div).find('#src'+num).attr('id', 'src'+(num+1));
		$(div).find('#des'+num).attr('id', 'des'+(num+1));
		$(div).find('input').val('');

		$(div).find('.moth-th, .day').hide();
		$(div).find('.fr-calen .text').remove();
		$(' <span class="text">Click here to <br>select return date</span>').insertBefore($(div).find('.fr-calen .fa-calendar'));

		$(div).find('.removeflight').remove();
		$(div).find('div.span4:last').append('<a href="#" style="margin-top:10px" class="removeflight btn btn-small pull-right"><small><i class="fa fa-trash-o"></i> Remove</small></a>');
		
		$('#flights').append(div);
		
		$(div).find('.departDate')
				.removeClass('hasDatepicker')
				.attr({'id': 'dp'+(num+1), 'data-idx': (num+1)})
				.datepicker(options);
		var d = $(prevDiv).find('.departDate').datepicker('getDate');
		
		if(d)
			d.setTime(d.getTime() + 86400000);			
		else
			d = new Date($('#minDate').val());

		$(div).find('.departDate').datepicker('option', 'minDate', d);
		
		$(div).find('.typeahead').autocomplete(ajaxOpts).data( "ui-autocomplete" )._renderItem  = function( ul, item ) {
	    	$(ul).addClass('dropdown-menu');
		  	return $( "<li>" )
		    	    .attr( "data-value", item.value )
		    	    .append( $( "<a>" ).text( item.label ) )
		    	    .appendTo( ul );
		};
		
	});

	$(document).on('click', '.removeflight', function(e){
		e.preventDefault();

		$(this).parents('.fr-con').remove();
		
	});

	$('#bookingForm').submit(function(){

		var valid = true;

		$(this).find('input:submit').attr('disabled', true);
		document.body.style.cursor = 'wait';
		
		$('.fr-con').each(function(idx){
			
			var src = $(this).find('#src'+ (idx+1));
			var des = $(this).find('#des'+ (idx+1));
			var date = $(this).find('input.depart');

			if(src.val() == '' && des.val() == '' && date.val() == "") {
				$(this).find('input').attr('disabled', 'disabled');
			}
			
			if(src.val() != '' || des.val() != '' || date.val() != '')			
			{
				if(src.val() == ''){	
					valid = false;				
					$('div#msg').html('Please provide a valid FROM  city');
				}
				else if(des.val() == '') {
					des.focus();
					valid = false;
					$('div#msg').html('Please provide a valid TO city');
				}
				else if(date.val() == '') {
					valid = false;
					$('div#msg').html('Please provide a valid travel date');
				}
				else if(src.val() == des.val()) {
					valid = false;
					$('div#msg').html('Source and destination cannot be the same');
				}

				if(!valid) {
					$('div#msg').removeClass('hide');					
				}
			}
		});

		if(!valid){
			$(this).find('input:submit').attr('disabled', false);
		
			$(this).find('input').removeAttr('disabled');
			document.body.style.cursor = 'initial';
		}
		
		return valid;
	});
	
});
</script>