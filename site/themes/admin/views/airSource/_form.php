<?php
/* @var $this AirSourceController */
/* @var $model AirSource */
/* @var $form TbActiveForm */
$balanceProvidersList = CHtml::listData(\AirSource::model()->with('backend')->findAll([
                    'condition' => 'backend.balance IS NOT NULL',
                    'order' => 't.name'
                ]), 'id', 'name');
?>

<div class="form">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'air-source-form',
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'enableAjaxValidation' => false,
    ));
//    $model->addError('name', 'Just a test error');
    echo $form->errorSummary($model);
    ?>
    <table class="table table-condensed table-bordered" style="max-width: 85%">
        <tr>
            <th>Air Source Name</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'name'); ?></td>
            <th>Backend</th>
            <td class="center"><?php echo TbHtml::activeDropDownList($model, 'backend_id', CHtml::listData(Backend::model()->findAll(['order' => 'name']), 'id', 'name')); ?></td>
        </tr>
        <tr>
            <th>Username</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'username'); ?></td>
            <th>Password</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'password'); ?></td>
        </tr>
        <tr>
            <th>Transaction Username</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'tran_username'); ?></td>
            <th>Transaction Password</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'tran_password'); ?></td>
        </tr>
        <tr>
            <th>IATA number</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'iata_number'); ?></td>
            <th>Display in search</th>
            <td class="center"><?php echo TbHtml::activeCheckBox($model, 'display_in_search'); ?></td>
        </tr>
        <tr>
            <th>Profile PCC</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'profile_pcc'); ?></td>
            <th>Enabled</th>
            <td class="center"><?php echo TbHtml::activeCheckBox($model, 'is_active'); ?></td>
        </tr>
        <tr>
            <th>Spare 1</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'spare1'); ?></td>
            <th>Spare 2</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'spare2'); ?></td>
        </tr>
        <tr>
            <th>Spare 3</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'spare3'); ?></td>
            <th>Exclude Carriers</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'exclude_carriers'); ?></td>
        </tr>
        <tr>
            <th>Auto Ticketing Domestic</th>
            <td class="center"><?php echo TbHtml::activeCheckBox($model, 'domestic_auto_ticket'); ?></td>
            <th>Include Carriers for Passthrough</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'include_pass_carriers'); ?></td>
        </tr>
        <tr>
            <th>Auto Ticketing International</th>
            <td class="center"><?php echo TbHtml::activeCheckBox($model, 'international_auto_ticket'); ?></td>
            <th>Link Balance From</th>
            <td  class="center"><?php
                echo TbHtml::activeDropDownList($model, 'balance_link', $balanceProvidersList, [
                    'prompt' => 'Not linked',
                    'disabled' => !empty($model->backend->balance)
                ]);
                ?></td>
        </tr>
        <tr>
            <th>Currency</th>
            <td class="center"><?php echo TbHtml::activeDropDownList($model, 'currency_id', CHtml::listData(\Currency::model()->findall(['order' => 'id']), 'id', 'codeAndName')); ?></td>
            <th>Operations</th>
            <td class="center"><?php echo TbHtml::activeDropDownList($model, 'type_id', \AirSource::$type); ?></td>
        </tr>

        <tr class="center">
            <td colspan="4"><?php
                echo TbHtml::submitButton($model->isNewRecord ? 'Create New Air Source' : 'Update Air Source', array(
                    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                    'size' => TbHtml::BUTTON_SIZE_LARGE,
                ));
                ?>
            </td>
        </tr>
    </table>

<?php $this->endWidget(); ?>

</div><!-- form -->
<style>
    td.center, tr.center td {
        text-align: center;
        vertical-align: middle;
    }
    .heading, .table th {
        font-weight: bold;
        background-color: #fef8b8;
        vertical-align: middle;
    }
    .well-small {
        padding: 3px;
        margin-bottom: 5px;
        margin-top: 5px;
    }
</style>