<?php 
//Yii::app()->session->open();
$this->renderPartial('_style');
?>

<div class="wra-from">
    <ul class="wra-tab clearfix">
        <?php if ($form_view == '_form'): ?>
            <li class="active"><a href="#" title="Domestic Flights">Domestic Flights</a></li>
            <li><a href="/booking/international" title="">International Flights</a></li>
        <?php else: ?>
            <li><a href="/booking/" title="Domestic Flights">Domestic Flights</a></li>
            <li class="active"><a href="#" title="">International Flights</a></li>
            <?php endif; ?>
    </ul>

    <?php
    $this->renderPartial($form_view, array(
        'model' => $model,
        'airports' => $airports,
        'cities' => $cities,
        'categories' => $categories,
        'airlines' => $airlines));
    ?>
</div>

<?php $this->renderPartial('_jsscript', array('airports' => $airports,)) ?>

<script type="text/javascript">

    $(document).ready(function() {

        $('#bookingForm').submit(function() {

            $(this).find('button:submit').attr('disabled', 'disabled');
            document.body.style.cursor = 'wait';

            if ($('#roundtrip').is(':checked') && $('#returnDate').val() == '') {

                $('#BookingSearchForm_return_em_').html('Please choose the return date').show();
                $(this).find('button:submit').attr('disabled', false);
                document.body.style.cursor = 'initial';

                return false;
            } else {
                $(this).submit();
                return true;
            }

        });

    });
</script>