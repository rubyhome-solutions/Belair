<?php
/* @var $this SiteController */
/* @var $htmlMessage string */

$this->pageTitle = \Yii::app()->name . ' - Message';

$message = \Yii::app()->session->get('htmlMessage');
?>

<div class="ui basic segment" style="max-width: 800px; margin: 20px auto;">
    <div class="ui message">
        <div class="header">Message</div>
        <p><?php echo $message ? $message : 'Nope. No new messages :)'  ?></p>
    </div>
</div>

<!--<div class="table">-->
<!--    <div>-->
<!--        <div class="box">-->
<!---->
<!--            <h3>Message:</h3>-->
<!---->
<!--            <div class="alert-info alert span7">-->
<!--                --><?php
//                echo \Yii::app()->session->get('htmlMessage');
//                unset(Yii::app()->session['htmlMessage']);
//                //    \Yii::log(print_r($_SESSION, true));
//                ?>
<!--            </div>-->
<!--            <div class="clearfix"></div>-->
<!--            --><?php
//            echo TbHtml::well('You can ' . chtml::link('<b>click here</b>',
//                    \Yii::app()->request->urlReferrer) . ' to return to the previous page', ['class' => 'span7']);
//            ?>
<!--        </div>-->
<!--    </div>-->
<!--</div>-->