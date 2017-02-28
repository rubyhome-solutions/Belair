<?php
/* @var $this SiteController */

$this->pageTitle = Yii::app()->name;
?>

<h2>Welcome to <i><?php echo CHtml::encode(Yii::app()->name); ?></i>!</h2>

<div class="span6">
    <p>Currently your user is in pending state!<br />
        If your status is still pending 24 hour after the registration,<br /> 
        please write to <a href="mailto:support@belair.in?subject=User+pending+approval&body=Please approve the new user with email: <?php echo CHtml::encode(Yii::app()->user->name); ?> !">support@belair.in</a> 
        for approval of your access rights.
    </p>

</div>    

