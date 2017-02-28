<?php
/* @var $this \SiteController */
/* @var $model Users */
/* @var $form CActiveForm  */

$this->pageTitle = \Yii::app()->name . ' - Forgotten pass';
?>

<h2>Forgotten password</h2>
<?php
foreach (Yii::app()->user->getFlashes() as $key => $value) {
    echo TbHtml::alert($key, $value, array('style' => 'max-width: 520px;'));
//    \Yii::app()->end();
    echo "<style>
            p {display:none}
            .form {display:none}
        </style>";
}
?>
<p>Please enter your email to reset your password:</p>

<div class="form span6">
    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
        'id' => 'forgottenpass-form',
        'enableClientValidation' => true,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
        'clientOptions' => ['validateOnSubmit' => true,
            'errorCssClass' => 'error-check',
            'successCssClass' => 'success-check'
        ],
    ]);
    echo $form->errorSummary($model, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, ['style' => 'max-width: 800px;']);
    ?>

    <fieldset>
        <?php
        echo $form->textFieldControlGroup($model, 'email', ['label' => 'Email']);
        if (CCaptcha::checkRequirements()) {
            echo $form->textFieldControlGroup($model, 'verifyCode');
            $this->widget('CCaptcha', [
                'imageOptions' => ['style' => 'margin-left: 30%'],
                'showRefreshButton' => true,
                'buttonLabel' => 'Refresh code',
                'buttonOptions' => ['class' => 'btn', 'encode' => false],
                'buttonType' => 'button'
            ]);
        }
        echo TbHtml::formActions([TbHtml::submitButton('Submit', array('color' => TbHtml::BUTTON_COLOR_PRIMARY))]);
        $this->endWidget();
        ?>
    </fieldset>
</div><!-- form -->
