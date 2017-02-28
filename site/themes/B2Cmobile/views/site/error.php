<?php
/* @var $this SiteController */
/* @var $error array */

$this->pageTitle = \Yii::app()->name . ' - Error';
?>

<div class="ui basic segment" style="max-width: 800px; margin: 20px auto;">
    <div class="ui negative message">
        <div class="header">Error <?php echo $code; ?></div>
        <p><?php echo CHtml::encode($message); ?></p>
    </div>
</div>
