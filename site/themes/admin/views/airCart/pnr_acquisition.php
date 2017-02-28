<?php
/* @var $this AirCartController */
/* @var $model PnrForm */
/* @var $listAirSources array */
/* @var $form TbActiveForm */
$this->breadcrumbs = array(
    'Air Carts' => array('admin'),
    'PNR acquisition',
);
?>
<div class="ibox-content">
<div class="form col-md-6 col-md-offset-3" style="">
    <br>
    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'action' => \Yii::app()->createUrl($this->route),
        'method' => 'post',
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'id' => 'air-cart-form',
        'enableAjaxValidation' => true,
        'enableClientValidation' => true,
        'clientOptions' => array(
            'validateOnSubmit' => true,
            'validateOnChange' => true,
            'validateOnType' => false,
        ),
    ));
    echo $form->errorSummary($model);
    ?>
    <table class="table table-bordered table-condensed">
        <tr class="center">
            <th >Enter the PNR</th>
            <td> <?php echo TbHtml::activeTextField($model, 'pnr'); //echo TbHtml::error($model, 'pnr'); ?></td>
        </tr>
        <tr>
            <th >Choose the Air Source</th>
            <td style="text-align: center;"> <?php echo TbHtml::activeDropDownList($model, 'airSourceId', $listAirSources);
    echo TbHtml::error($model, 'airSourceId'); ?></td>
        </tr>
    </table>
    <?php
    echo TbHtml::submitButton('<i class="fa fa-search fa-lg"></i>&nbsp;&nbsp;PNR acquisition', array(
        'color' => TbHtml::BUTTON_COLOR_PRIMARY,
        'size' => TbHtml::BUTTON_SIZE_LARGE,
        'style' => 'float:right; margin-top:10px;',
    ));
    ?>
    <!--</div>-->

    <?php $this->endWidget(); ?>

</div><!-- search-form -->
<div class="clearfix"></div>
</div>
<style>
    .table th, td.center, tr.center td {
        text-align: center;
        vertical-align: middle;
    }
    td input[type="text"], td select {
        margin-bottom: 0;
        text-align: center;
    }
    table td input.big {
        font-weight: bold;
        font-size: 1.1em;
        text-align: right;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
        vertical-align: middle;        
    }
    .center {
        text-align: center !important;
    }
    table.table tr td input.error {
        border-color: red;
        background-color: #FBC2C4;
    }
    .shadow {
        box-shadow: 10px 10px 5px #888888; 
        background-color: aliceblue;
    }

</style>
