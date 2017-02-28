
<?php
$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
    'id' => 'bookingForm',
    'enableClientValidation' => true,
    'clientOptions' => array(
        'validateOnSubmit' => true,
    ),
        ));
?>
<div class="wra-content">
    <div class="box clearfix">
        <h2 class="heading">International Flights</h2>
        <label class="radio-inline">
            <input type="radio" class='way' name="BookingSearchForm[way]" id="oneway" value="<?php echo BookingSearchForm::ONE_WAY ?>"
                   <?php echo ($model->way == BookingSearchForm::ONE_WAY) ? 'checked="checked"' : '' ?>>
            One Way
        </label>
        <label class="radio-inline">
            <input type="radio" class='way' name="BookingSearchForm[way]" id="roundtrip" value="<?php echo BookingSearchForm::ROUND_TRIP ?>"
                   <?php echo ($model->way == BookingSearchForm::ROUND_TRIP) ? 'checked="checked"' : '' ?>>
            Round Trip
        </label>
        <label class="radio-inline">
            <input type="radio" class='way' name="BookingSearchForm[way]" id="multicity" value="<?php echo BookingSearchForm::MULTICITY ?>"
                   >
            Multi City
        </label>
    </div>
    <div class="row">
        <div class="span3" style="position: relative;">
            <label>From</label>
            <input type='text' class='typeahead' autocomplete="off" value='<?php echo (isset($cities[$model->source])) ? $cities[$model->source] : '' ?>'
                   data-target='#BookingSearchForm_source'>

            <?php echo CHtml::activeHiddenField($model, 'source'); ?>

        </div>
        <div class="span3" style="position: relative;">
            <label>To</label>
            <input type='text' class='typeahead' autocomplete="off" value='<?php echo (isset($cities[$model->destination])) ? $cities[$model->destination] : '' ?>'
                   data-target='#BookingSearchForm_destination'>

            <?php echo CHtml::activeHiddenField($model, 'destination'); ?>
        </div>
    </div>
    <div class="row">
        <div class="span3">
            <h5 class="hea-ti">Depart</h5>
            <?php
            $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                'id' => 'departDate',
                'model' => $model,
                'attribute' => 'depart',
                // additional javascript options for the date picker plugin
                'options' => array(
                    'dateFormat' => 'yy-mm-dd',
                    'minDate' => date('Y-m-d'),
                    'onSelect' => 'js:function(d, ins){

                		var date = $(this).datepicker("getDate");

                		$(".depart-cal .thu").text(month[ins.selectedMonth]);
                		$(".depart-cal .moth").text(weekday[date.getDay()]);
                		$(".depart-cal .day").text(ins.selectedDay);
					}',
                    'onClose' => 'js:function( selectedDate ) {
                		$( "#returnDate" ).datepicker( "option", "minDate", selectedDate );
                		updateReturnDate();
                	}'
                ),
                'htmlOptions' => array(
                    'style' => 'display:none'
                ),
            ));
            ?>
            <a href='#' title="" class="fr-calen depart-cal" onclick="$('#departDate').datepicker('show');
                    return false;">
                <span class="moth-th"><span class="thu"><?php echo date('F', strtotime($model->depart)) ?></span><span class="moth"><?php echo date('D', strtotime($model->depart)) ?></span> </span>
                <span class="day"><?php echo date('d', strtotime($model->depart)) ?></span>
                <i class="fa fa-calendar"></i>
            </a>

        </div>
        <div class="span3 returnDate <?php echo ($model->way == BookingSearchForm::ROUND_TRIP) ? '' : 'hide' ?>">
            <h5 class="hea-ti">Return</h5>
            <?php
            $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                'id' => 'returnDate',
                'model' => $model,
                'attribute' => 'return',
                // additional javascript options for the date picker plugin
                'options' => array(
                    'dateFormat' => 'yy-mm-dd',
                    'minDate' => date('Y-m-d'),
                    'onSelect' => 'js:function(d, ins){
                		updateReturnDate();

                		$("#BookingSearchForm_return_em_").hide();
                	}'
                ),
                'htmlOptions' => array(
                    'style' => 'display:none'
                ),
            ));
            ?>
            <a href='#' title="" class="fr-calen return-cal" onclick="$('#returnDate').datepicker('show');
                    return false;">

                <span class="moth-th" style='<?php echo empty($model->return) ? 'display:none' : '' ?>'><span class="thu"><?php echo date('F', strtotime($model->return)) ?></span><span class="moth"><?php echo date('D', strtotime($model->return)) ?></span> </span>
                <span class="day" style='<?php echo empty($model->return) ? 'display:none' : '' ?>'><?php echo date('d', strtotime($model->return)) ?></span>

                <?php if (empty($model->return)): ?>
                    <span class="text">Click here to <br>select return date</span>
                <?php endif; ?>

                <i class="fa fa-calendar"></i>
            </a>
        </div>
    </div>
    <div class="row box-space-1">
        <div class="span2 adults">
            <h6>Adults <em>12+ yrs</em></h6>
            <div class="clearfix fr-button">
                <button type="button" class="except spinner-step" data-step='-1'><span class="icon-minus"></span></button>
                <span class="text spinner-value spinner-adult" data-target='#BookingSearchForm_adults'  data-min='1'><?php echo $model->adults; ?></span>
                <button type="button" class="added spinner-step" data-step='1'><span class="icon-plus"></span></button>
            </div>
            <?php echo CHtml::activeHiddenField($model, 'adults') ?>
        </div>
        <div class="span2">
            <h6>Children  <em>2-12 yrs</em></h6>
            <div class="clearfix fr-button">
                <button type="button" class="except spinner-step" data-step='-1'><span class="icon-minus"></span></button>
                <span class="text spinner-value " data-target='#BookingSearchForm_children' data-min='0'><?php echo $model->children; ?></span>
                <button type="button" class="added spinner-step" data-step='1'><span class="icon-plus"></span></button>
            </div>
            <?php echo CHtml::activeHiddenField($model, 'children') ?>
        </div>
        <div class="span2">
            <h6>Infants <em>below 2 yrs</em></h6>
            <div class="clearfix fr-button">
                <button type="button" class="except spinner-step infant" data-step='-1'><span class="icon-minus"></span></button>
                <span class="text spinner-value" data-target='#BookingSearchForm_infants' data-min='0'><?php echo $model->infants; ?></span>
                <button type="button" class="added spinner-step infant" data-step='1'><span class="icon-plus"></span></button>
            </div>
            <?php echo CHtml::activeHiddenField($model, 'infants') ?>
        </div>
        <div class="span2">
            <h6>Class</h6>
            <?php echo $form->dropDownList($model, 'category', $categories, array('class' => 'span2')); ?>
        </div>
        <div class="span2" style="margin-left: 15px">
            <h6>Preferred Airline</h6>
            <?php
            echo $form->dropDownList($model, 'preferred_airline', $airlines, array(
                'empty' => '',
                'class' => 'span2'));
            ?>
        </div>
    </div>
    <br>
    <?php echo $form->error($model, 'source', array('class' => 'alert alert-error')) ?>
    <?php echo $form->error($model, 'destination', array('class' => 'alert alert-error')); ?>
    <?php echo $form->error($model, 'depart', array('class' => 'alert alert-error')) ?>
    <?php echo $form->error($model, 'return', array('class' => 'alert alert-error')) ?>

    <button type='submit' class="btn-sea">Search Flights</button>
</div>
<fieldset class="span3 form" style="margin-top: 15px; 	border: 1px solid #DDD;
          padding: 10px;
          margin: 0 0 10px 0;
          border-radius:7px;
          -moz-border-radius:7px;
          ">
    <legend style="text-align: center;">API to use:</legend>
    <?php $this->renderPartial('_deeplinkApisList'); ?>
    <label><input type="radio" name="api" value="SpiceJet">&nbsp;SpiceJet production<br></label>
    <label><input type="radio" name="api" value="SpiceJetTest">&nbsp;SpiceJet test<br></label>
    <label><input type="radio" name="api" value="Indigo">&nbsp;Indigo production<br></label>
    <label><input type="radio" name="api" value="IndigoTest">&nbsp;Indigo test<br></label>
    <label><input type="radio" name="api" value="flydubaiScrapper:38">&nbsp;FlyDubai scrapper<br></label>
    <label><input type="radio" name="api" value="airindiaScrapper:36">&nbsp;AirIndia scrapper<br></label>
    <label><input type="radio" name="api" value="airasiaScrapper:37">&nbsp;AirAsia scrapper<br></label>
    <!--<label><input type="radio" name="api" value="AmadeusProduction">&nbsp;Amadeus production<br></label>-->
    <!--<label><input type="radio" name="api" value="Amadeus">&nbsp;Amadeus test<br></label>-->
    <label><input type="radio" name="api" value="AmadeusV2:prod" checked="checked">&nbsp;Amadeus prod V2<br></label>
    <label><input type="radio" name="api" value="AmadeusV2" checked="checked">&nbsp;Amadeus test V2<br></label>
    <label><input type="radio" name="api" value="galileoProduction">&nbsp;Galileo production<br></label>
    <label><input type="radio" name="api" value="galileoTest">&nbsp;Galileo test<br></label>
    <label><input type="radio" name="api" value="Flydubai">&nbsp;Flydubai<br></label>
    <label><input type="radio" name="api" value="search">&nbsp;Search all Air Sources<br></label>
    <label style='font-weight: bold;color: darkgreen;'><input type="radio" name="api" value="airSourceRule">&nbsp;Air source rule test<br></label>
    <label><input type="radio" name="api" value="searchTest">&nbsp;Search Test<br></label>
</fieldset><br>

<?php $this->endWidget(); ?>


<script type="text/javascript">
    $(document).ready(function () {

        $('input.way').click(function () {
            var value = $(this).val();

            if (value == 2)//round trip
            {
                $('.save-up').addClass('in');
                $('div.returnDate').removeClass('hide');
            }
            else if (value == 3)//multi city
            {
                window.location.href = '/booking/multicity';
            }
            else {
                $('.save-up').removeClass('in');
                $('div.returnDate').addClass('hide');
            }
        });

    });
</script>