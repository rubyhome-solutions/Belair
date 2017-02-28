<?php
/* @var $this SiteController */

$this->breadcrumbs = array(
    'BelAir' => array('/'),
    'Internal page',
);

$this->pageTitle = \Yii::app()->name . ' - internal';
?>
<h2 style="margin-top:-20px;"><small>Hello <?php echo \Yii::app()->user->name; ?> </small></h2>
<?php if (!Yii::app()->user->isGuest) { ?>
    <div id="cont">
        <?php
        if (Authorization::getIsStaffLogged()) {
            $smsBalance = \Yii::app()->sms->checkBalance();
            if ($smsBalance['status'] == 1) {
                echo "<p class='well well-small alert-info'><i class='fa fa-envelope fa-lg'></i>&nbsp;&nbsp;&nbsp;The platform SMS balance is <code><b>" . number_format($smsBalance['balance']) . "</b></code></p>";
            } else {
                echo "<p class='well well-small alert-info'>Error SMS balance check message <code><b>" . $smsBalance['message'] . "</b></code></p>";
            }
            $this->renderPartial('pages/googleCharts');
            //echo '<div class="clearfix"></div><hr>';
            $this->renderPartial('/payGate/_stats');
            echo '<div class="clearfix"></div><hr>';
            $this->renderPartial('/process/_airSource_APIs_health');
            echo "<div class='row'>";
            $this->renderPartial('/process/_graph');
            $this->renderPartial('/process/_summary');
            echo '</div><div class="clearfix"></div><hr>';
            $this->renderPartial('/searches/_graphs');
        }
        ?>
    </div>
<?php } else { ?>
    <div class="well span7">
        This page is visible for authenticated users only!<br>
        Please login so you can enjoy all the benefits of working with the platform.
    </div>
<?php } ?>
