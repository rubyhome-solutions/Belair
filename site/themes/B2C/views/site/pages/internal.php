<?php
/* @var $this SiteController */

$this->breadcrumbs = array(
    'BelAir' => array('/'),
    'Internal page',
);

$this->pageTitle = \Yii::app()->name . ' - internal';
?>

<?php $this->beginClip('sidebar') ?>
    <?php $this->renderPartial('//layouts/_profile_sidebar') ?>
<?php $this->endClip() ?>

<div class="table">
    <div>
        <div class="box">

            <h2 style="text-align: center;">
                <small>Hello <?php echo \Yii::app()->user->name; ?> </small>
            </h2>
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
                        include_once __DIR__ . "/googleCharts.php";
                    }
                    ?>
                    <hr>
                    <div class="well span7">
                        This page is visible for authenticated users only.<br>
                        There will be a dynamic content tailored for the active user type and his/her permissions.<br>
                        Stay tuned and expect the good news!
                    </div>
                    <!--<img src="/img/Dashboard website.jpg" />-->
                </div>
            <?php } else { ?>
                <div class="well span7">
                    This page is visible for authenticated users only!<br>
                    Please login so you can enjoy all the benefits of working with the platform.
                </div>
            <?php } ?>


        </div>
    </div>
</div>
