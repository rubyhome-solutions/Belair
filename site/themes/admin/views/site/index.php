<?php
/* @var $this SiteController */
/* @var $model LoginForm */

$this->pageTitle = \Yii::app()->name;
?>

<div class="span8 pull-left" style="border-right: 1px solid;">
    <!--<p>Our Online Partner Agents Program enables to Look, Book &amp; Sell (24X7)<br>Issue their own Airlines E-Tickets instantly with their own logos. Add mark-ups and earn high Commissions. Distributors can appoint and manage their own agents.</p>-->
    <table class="table">
        <tr>
            <td><img src="../img/platform.jpg" style="border-radius: 10px;overflow: hidden;"></td>
            <td><div style="padding: 10px;" class="well alert-success">Our Online Partner Agents Program enables to Look, Book &amp; Sell (24X7)<br>Instant seamless booking &amp; ticketing.<br>Issue your own Airlines E-Tickets instantly with your own logo</div></td>
        </tr>
        <tr>
            <td><img src="../img/01.jpg" style="border-radius: 10px;overflow: hidden;"></td>
            <td><div style="padding: 10px;" class="well alert-success">Multi-user Admin Module.<br />Ability to choose your own markup discounts and commissions.<br>Distributors can appoint and manage their own agents.</div></td>
        </tr>
    </table>
    <div class="clearfix"></div>

    <style>
        .table>tbody>tr>td {
            border-top: none;
        }
        .well {
            padding: 5px;
            margin-bottom: 10px;
            margin-right: 10px;
        }
        .form-horizontal .control-label {width: 80px;}
        .form-horizontal .controls {margin-left: 100px;}
        .form-horizontal .form-actions {
            padding-left: 10%;
            padding-top: 7%;
            border-radius: 15px;
        }
    </style>
    <h4 class="text-center">Availability on 240 Domestic and International Airlines</h4>
    <div class="media">
        <img class="media-object pull-left" src="../img/ia_pic.jpg" width="62%">
        <div class="media-body" style="font-size: 13px;">
            <div class="well alert-info text-center">Earn discounts &amp; commissions</div>
            <div class="well alert-info text-center">Print e-tickets with your Agency Logo</div>
            <div class="well alert-info text-center">Transparency in fares, discounts &amp; taxes</div>
            <div class="well alert-info text-center">Advance Purchase Fares</div>
            <div class="well alert-info text-center">Manage invoices &amp; Accounts Online</div>
            <div class="well alert-info text-center">Transparency on Fares &amp; Taxes</div>
            <div class="well alert-info text-center">Secured Credit/Debit cards transaction</div>
            <div class="well alert-info text-center">Online support 24x7</div>

        </div>
    </div>

</div>
<div class="span4 text-center" style="max-width: 359px; margin-left: 10px;">
    <h2 style="margin-top: 30px;">Login</h2>

    <p>Please fill out the following form with your credentials:</p>

    <div class="form">
        <?php
        $model->password = null;
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'login-form',
            'htmlOptions' => ['autocomplete' => 'off'],
            'enableClientValidation' => true,
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'clientOptions' => array(
                'validateOnSubmit' => true,
                'errorCssClass' => 'error-check',
                'successCssClass' => 'success-check'
            ),
        ));
        ?>

        <fieldset><br />
            <input type="password" style="display:none" />
            <?php
            echo $form->textFieldControlGroup($model, 'username', array('label' => 'Email'));
            echo $form->passwordFieldControlGroup($model, 'password', ['autocomplete' => "off"]);

            echo TbHtml::formActions(array(
                TbHtml::submitButton('Login', array('color' => TbHtml::BUTTON_COLOR_PRIMARY)),
                TbHtml::resetButton('Reset'),
                '<br /><br />' . CHtml::link('Forgotten password', '/site/forgotenpass') .
                '<br />' . CHtml::link('New registration', '/users/newReg')
            ));
            $this->endWidget();
            ?>
        </fieldset>
    </div><!-- form -->
</div>
