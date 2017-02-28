<?php
/* @var $this SiteController */
/* @var $htmlMessage string */

$this->pageTitle = Yii::app()->name . ' - Message';
?>
<h3>Message:</h3>
<div class="alert-info alert span7">
    <i class="fa fa-exclamation-triangle fa-2x"></i>&nbsp;&nbsp;&nbsp;
    <?php
    echo Yii::app()->session->get('htmlMessage');
    unset(Yii::app()->session['htmlMessage']);
//    Yii::log(print_r($_SESSION, true));
    ?>
</div>
<div class="clearfix"></div>
<?php
if (!empty(Yii::app()->request->urlReferrer)) {
    echo TbHtml::well('You can ' . chtml::link('<b>click here</b>', Yii::app()->request->urlReferrer) . ' to return to the previous page', ['class' => 'span7']);
}
?>