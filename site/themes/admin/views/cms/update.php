<?php
$this->breadcrumbs = ['Manage' => ['/userInfo/update/' . $userInfoId],
    'Site CMS - ' . \Cms::$cmsComponents[$contentTypeId]['title']];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}

$this->beginWidget('bootstrap.widgets.TbActiveForm', ['id' => 'cms-form',
    'enableAjaxValidation' => false,
    'htmlOptions' => [
        'class' => 'span10',
        'style' => 'margin-left: 0px;',
    ],
]);

\Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
$this->widget('ImperaviRedactorWidget', [
    'name' => 'cmsContent',
    'value' => $content,
    // Some options, see http://imperavi.com/redactor/docs/
    'options' => [
        'minHeight' => '200px',
        'autoresize' => true,
    ],
    'plugins' => [
        'table' => ['js' => ['table.js']],
        'fontcolor' => ['js' => ['fontcolor.js']],
        'fontfamily' => ['js' => ['fontfamily.js']],
        'fontsize' => ['js' => ['fontsize.js']],
        'fullscreen' => ['js' => ['fullscreen.js']],
    ],
]);
?>
<div class="form-actions" style="padding-left: 15%;">
    <?php
    echo TbHtml::submitButton('<i class="fa fa-save fa-white fa-lg"></i>&nbsp;&nbsp;Save the custom content', [
        'color' => TbHtml::BUTTON_COLOR_PRIMARY,
        'size' => TbHtml::BUTTON_SIZE_LARGE,
    ]);
    echo TbHtml::submitButton('<i class="fa fa-trash-o fa-white fa-lg"></i>&nbsp;&nbsp;Delete and use the default', [
        'class' => 'btn btn-warning btn-large',
        'style' => 'margin-left: 10%',
        'name' => 'deleteContent',
        'value' => 1
    ]);
    ?>
</div>

<?php $this->endWidget(); ?>

<style>
    .redactor-toolbar {
        background: #F5F1F1;
        font-size: 18px !important;
    }
</style>