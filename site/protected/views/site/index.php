<?php
/* @var $this SiteController */
/* @var $model LoginForm */

$this->pageTitle = Yii::app()->name;
?>

<!--<div class="span8 pull-left" style="border-right: 1px solid;">
    <p>Our Online Partner Agents Program enables to Look, Book &amp; Sell (24X7)<br>Issue their own Airlines E-Tickets instantly with their own logos. Add mark-ups and earn high Commissions. Distributors can appoint and manage their own agents.</p>
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

</div>-->
<div class="row">
    <div class="text-center" id="index_backend_customization" style="border-radius: 20px;">
        <div class="logo_div">
        <img src="../img/email/logo.png" style="margin-top:20px width:80%">
        </div>
        <div class="form" style="margin-top:20px">
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

            <fieldset style="width:100px"><br />
                <input type="password" style="display:none" />
                <?php
                echo $form->textFieldControlGroup($model, 'username', array('label' => 'Email','placeholder'=>'Email'));
                echo $form->passwordFieldControlGroup($model, 'password',array('placeholder'=>'Password'), ['autocomplete' => "off"]);

                echo TbHtml::formActions(array(
                    TbHtml::submitButton('Login', array('color' => TbHtml::BUTTON_COLOR_PRIMARY)),
                    '<br/>'.CHtml::link('Forgotten password', '/site/forgotenpass') .
                    '<br/>'.CHtml::link('New registration', '/users/newReg')
                ));
                $this->endWidget();
                ?>
            </fieldset>
        </div><!-- form -->
    </div>
</div>
  <?php
      $bg = rand(1, 16);
   $bgchange = "admin_background/admin_banner_".$bg.".jpg";
      //$bgchange = "admin_background/admin_banner_3.jpg";
   ?>
<!-- Start Of Neha Code -->
<style>
    html
    {
        /*background:url(../img/admin_background/admin_banner_1.jpg);*/ 
          background-image:url("../img/<?php echo $bgchange; ?>");
          background-repeat:no-repeat fixed;
		  -webkit-background-size: cover;
		  -moz-background-size: cover;
		  -o-background-size: cover;
		  background-size: cover;
		  min-height: 100%;
    }
    .logo_div
    {
    width: 107%;
    padding-bottom: 10px;
    margin-top: -12px;
    margin-left: -10px;
    border-top-right-radius: 1.6em;
    border-top-left-radius: 1.6em;
    background: rgba(255,255,255,0.9);
    }
    .span12
    {
        position: fixed;
        top: 0;
        left: 0;
        width:100%;
        height:100%;
        margin-left:0;
        z-index:-300;
    }
     #index_backend_customization
     {
         background-color: rgba(0, 0, 0,0.5);
         width: 287px;
         height: 380px;
         margin:0 auto;
         padding: 10px;
         margin-top: 100px;
     }
     .form-horizontal .form-actions
     {
         padding-left: 20px;
     }
     .form-horizontal .controls{
         margin-left: 0px;
     }
     .form-horizontal input{
         height:25px;
         width: 229px;
     }
     .form fieldset{
         border:0px;
         padding:0;
         border-radius: 2px;
         margin: 0 auto;
     }
      @media screen and (min-width:497px)
     {
     .btn:first-child{
             height: 56px;
    font-size: 20px;
    margin-top: -20px;
    width: 241px;
     }
     }
     @media screen and (max-width:496px)
     {
         .btn:first-child{
             height: 56px;
             font-size: 20px;
             margin-top: -20px;
             width: 241px;
             margin-left:-13px;
     }
     }
     div.form div.error-check input
     {
         background-color: #FFF !important;
    border-color: #C00;
    background: url(../img/redcross.jpg) no-repeat right;
     }
     .form-horizontal input + .help-block 
     {
         color:#fff;
     }
     div.form div.success-check input 
     {
         background-color: #fff !important;
    border-color: #55FF33;
    background: url(../img/green_checkmark.jpg) no-repeat right;
     }
     .form-horizontal .form-actions
     {
         background:url();
     }
     a {
    color: #fff;
    font-style: bold;
     }
    a:hover{
    color: #055FB9;
     font-style: bold;
     }
     .form-actions
     {
         border: 0px;
     }
</style>
<script>
    $(function()
    {
        $('.footer').css("display","none");
        $('#mainmenu').css("display","none");
        $('.form-horizontal button').addClass('btn-block');
        $('.control-label').css("display","none");      
    });
   
</script>
<div class="span12">
   
 
</div>