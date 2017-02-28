<div class="ibox-content m_top1">
<?php
/* @var $this CcController */
/* @var $model Cc */
/* @var $form TbActiveForm */

$this->breadcrumbs = ['Cards' => ['admin'],
    'Create new',
];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
    'id' => 'cc-form',
    'enableAjaxValidation' => false,
    'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    'enableClientValidation' => true,
    'action' => 'create'
        ]);
echo $form->errorSummary($model);

for ($i = 0; $i < 12; $i++) {
    $yearKey = date('Y') + $i;
    $years[$yearKey] = $yearKey;
    $months[$i + 1] = $i + 1;
}
?>

<div class="form span9">
    <fieldset class="span5" style="margin-left: 15px;">
        <label class="form-horizontal control-label">Client name </label>
        <div class="controls" style="margin-bottom: 10px;">
            <?php echo TbHtml::textField('_', $model->userInfo->name, ['disabled' => true]); ?>
        </div>
        <?php
//        echo TbHtml::errorSummary($model, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
        echo $form->textFieldControlGroup($model, 'name', []);
        echo $form->textFieldControlGroup($model, 'number', ['maxlength' => 16]);
        ?>
        <label class="form-horizontal control-label">Expiry date <span class="required">*</span></label>
        <div class="controls" style="margin-bottom: 10px;">
            <?php
//        echo $form->textFieldControlGroup($model, 'exp_date', ['placeholder' => 'YYYY/MM', 'maxlength' => 7, 'class' => 'input-small']);
            echo TbHtml::dropDownList('year', $year, $years, ['prompt' => 'Year', 'maxlength' => 4, 'class' => 'input-small']) . "<span> - </span>";
            echo TbHtml::dropDownList('month', $month, $months, ['prompt' => 'Month', 'maxlength' => 2, 'class' => 'input-small']);
            echo $form->error($model, 'exp_date', ['class' => 'error']);
            ?>
        </div>
        <?php
        echo $form->textAreaControlGroup($model, 'note', ['visible' => Authorization::getIsStaffLogged(), 'rows' => 5]);
        ?>
        <div class="form-actions">
            <?php
            echo TbHtml::submitButton('<i class="fa fa-save fa-lg"></i>&nbsp;&nbsp;Create new CC', [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
                'encode' => false,
            ]);
            ?>
        </div>

    </fieldset>
</div>
<?php $this->endWidget(); ?>
</div>