<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */
/* @var $form TbActiveForm */

$totalAmount = $model->amount + $model->convince_fee;
?>

<div class="form span5 center">
    <fieldset>
        <h3>ATOM Netbanking: <small>Please select your bank ... </small></h3>

        <?php
//        echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, 'Please wait ...');
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
            'id' => 'atom-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'enableAjaxValidation' => false,
//            'htmlOptions' => ['style' => 'display:none']
        ]);

        echo $form->errorSummary($model);
//        echo TbHtml::dropDownList('atomBank', 2001, [
//            2001 => 'ATOM test bank',
//                ], [
//            'style' => 'width: 90%',
//            'id' => 'atomBank',
//        ]);
        if (empty($model->convince_fee)) {
            $convFee = '';
        } else {
            $convFee = "<small>(convenience fee of {$model->convince_fee} is added)</small>";
        }
        ?>
        <select name="atomBank" id="atomBank" class="input">
            <option value="-1"> - Select - </option>
            <option value="1045">Bank of Baroda Corporate</option>
            <option value="1046">Bank of Baroda Retail</option>
            <option value="1012">Bank of India</option>
            <option value="1033">Bank of Maharashtra</option>
            <option value="1034">Canara Bank DebitCard</option>
            <option value="1030">Canara Bank NetBanking</option>
            <option value="1031">Catholic Syrian Bank</option>
            <option value="1028">Central Bank of India</option>
            <option value="1020">City Union Bank</option>
            <option value="1004">Corporation Bank</option>
            <option value="1047">DBS Bank Ltd</option>
            <option value="1042">DCB BANK Business</option>
            <option value="1027">DCB BANK Personal</option>
            <option value="1024">Deutsche Bank</option>
            <option value="1038">Dhanlaxmi Bank</option>
            <option value="1019">Fedral Bank</option>
            <option value="1007">IDBI Bank</option>
            <option value="1026">Indian Bank</option>
            <option value="1029">Indian Overseas Bank</option>
            <option value="1015">Indusind Bank</option>
            <option value="1001">Jammu and Kashmir Bank</option>
            <option value="1008">Karnataka Bank</option>
            <option value="1018">Karur Vysya Bank</option>
            <option value="1013">Kotak Mahindra Bank</option>
            <option value="1009">Lakshmi Vilas Bank NetBanking</option>
            <option value="1035">ORIENTAL BANK OF COMMERCE</option>
            <option value="1050">Royal Bank Of Scotland</option>
            <option value="1053">SaraSwat Bank</option>
            <option value="1022">South Indian Bank</option>
            <option value="1051">Standard Chartered Bank</option>
            <option value="1044">Tamilnad Mercantile Bank</option>
            <option value="1016">Union Bank</option>
            <option value="1041">United Bank of India</option>
            <option value="1039">Vijaya Bank</option>
            <option value="1005">Yes Bank</option>
            <option value="2001"> ATOM Test bank </option>
        </select>
        <p style="text-align: left; margin-top: 15px; padding-left: 20px;">Total amount: <b><?php echo number_format($totalAmount) . "</b> $convFee"; ?></p>
        <div class="form-actions" style="padding-left: 12%;">
            <?php
            echo TbHtml::button('Submit', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
                'onclick' => "ajaxSubmit(); return false;",
                'id' => 'btnSubmit',
            ));
            ?>
        </div>
        <?php $this->endWidget(); ?>
    </fieldset>
</div>
<style>
    .center {text-align: center}
</style>
<script>
    function ajaxSubmit() {
        $('#btnSubmit').prop('disabled', true);
        bank = $('#atomBank').val();
        $.post('', {atomBank: bank}, function (data) {
            if (typeof data.url !== 'undefined') {
                window.location.href = data.url;
                var form;
                form = $('<form />', {
                    id: 'tmpForm',
                    action: data.url,
                    method: 'POST',
                    style: 'display: none;'
                });
                $.each(data.data, function (name, value) {
                    if (value !== null) {
                        $('<input />', {
                            type: 'hidden',
                            name: name,
                            value: value
                        }).appendTo(form);
                    }
                });
                form.appendTo('body').submit();
            } else {
                alert('Error: ' + data);
            }
        }, 'json');
    }
//    $('document').ready(function () {
//        $('#btnSubmit').prop('disabled', true);
//        ajaxSubmit();
//    });
</script>