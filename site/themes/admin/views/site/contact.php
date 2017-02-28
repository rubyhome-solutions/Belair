<?php
/* @var $this SiteController */
/* @var $model ContactForm */
/* @var $form CActiveForm */

$this->pageTitle = \Yii::app()->name . ' - Contact Us';
//$this->breadcrumbs=array('Contact',);
?>

<h2>Contacts</h2>

<?php if (Yii::app()->user->hasFlash('contact')): ?>

    <div class="flash-success">
        <?php echo \Yii::app()->user->getFlash('contact'); ?>
    </div>

<?php else: ?>
    <table class="table table-bordered table-striped table-hover">
        <tbody>
            <tr valign="top">
                <td colspan="1" style="max-width: 90px;">  <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                        <tbody><tr>
                                <td width="100%"><a onclick="showMap('Noida');" href="#mapsPlace">B2B Division</a></td>
                            </tr>
                            <tr>
                                <td scope="col"><strong>Belair Travel &amp; Cargo (P) Ltd.</strong><br>
                                    <i class="fa fa-phone"></i>&nbsp;&nbsp; <a href="tel:+91-120-4887700">+91-120-4887700</a><br>
                                    <i class="fa fa-print"></i>&nbsp;&nbsp; +91-011-23328288<br>
                                    <i class="fa fa-envelope"></i>&nbsp;&nbsp; <a target="_blank" href="mailto:sales@belair.in">sales@belair.in</a><br>
                                    2nd Floor, C-101, Sector - 2, <br>
                                    Noida - 201301, U.P.<br>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%"><a onclick="showMap('Head');" href="#mapsPlace">Corporate Division/Head Office</a></td>
                            </tr>

                            <tr>
                                <td scope="col"><strong>Belair Travel &amp; Cargo (P) Ltd.</strong><br>
                                    <i class="fa fa-phone"></i>&nbsp;&nbsp; <a href="tel:+91-011-42521000">+91-011-42521000</a><br>
                                    <i class="fa fa-print"></i>&nbsp;&nbsp; +91-011-23328288<br>
                                    <i class="fa fa-envelope"></i>&nbsp;&nbsp; <a target="_blank" href="mailto:corporates@belair.in">corporates@belair.in</a><br>
                                    10-B Scindia House,<br>
                                    Connaught Place,<br>
                                    New Delhi - 110001<br>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%"><a onclick="showMap('Bangalore');" href="#mapsPlace">Bangalore</a></td>
                            </tr>

                            <tr>
                                <td><strong>Belair Travel &amp; Cargo (P) Ltd.  (Bangalore)</strong><br>
                                    <i class="fa fa-phone"></i>&nbsp;&nbsp; <a href="tel:+91-80-41124600">+91-80-41124600</a><br>
                                    <i class="fa fa-print"></i>&nbsp;&nbsp; +91-80-25594233<br>
                                    <i class="fa fa-envelope"></i>&nbsp;&nbsp; <a target="_blank" href="mailto:blr@belairindia.com">blr@belairindia.com</a><br>
                                    SUITE 711-A, MITTAL TOWER<br>
                                    6, MAHATMA GANDHI ROAD,<br>
                                    BANGALORE - 560001<br><br>
                                </td>
                            </tr>
                        </tbody></table></td>
                <td colspan="4" align="left" id="mapsPlace">
                    <iframe width="100%" height="580" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f81670e2ac29be0c2&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=28.630986,77.220722&amp;spn=0.00452,0.006866&amp;z=17&amp;iwloc=0004f8168592a41f0c778&amp;output=embed"></iframe><br /><small>View <a href="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f81670e2ac29be0c2&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=28.630986,77.220722&amp;spn=0.00452,0.006866&amp;z=17&amp;iwloc=0004f8168592a41f0c778&amp;source=embed" style="color:#0000FF;text-align:left">Belair Travel &amp; Cargo P. Ltd</a> in a larger map</small>            </tr>
        </tbody></table>


    <div class="form span8">

        <?php
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'contact-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'enableClientValidation' => true,
            'clientOptions' => array(
                'validateOnSubmit' => true,
            ),
        ));
        ?>
        <h3>Contact form:</h3>
        <p class="note">Fields with <span class="required">*</span> are required.</p>
        <fieldset>

            <?php
            echo $form->errorSummary($model);
            echo $form->textFieldControlGroup($model, 'name');
            echo $form->textFieldControlGroup($model, 'email');
            echo $form->textFieldControlGroup($model, 'subject', array('size' => 60, 'maxlength' => 128));
            echo $form->textAreaControlGroup($model, 'body', array('rows' => 6, 'style' => 'width: 90%;'));

            if (CCaptcha::checkRequirements()) {
                echo $form->textFieldControlGroup($model, 'verifyCode');
                $this->widget('CCaptcha');
            }
            ?>
            <div class="hint">Please enter the letters as they are shown in the image above.
                <br/>Letters are not case-sensitive.</div>
            <?php
            echo TbHtml::formActions(array(
                TbHtml::submitButton('Submit', array('color' => TbHtml::BUTTON_COLOR_PRIMARY)),
                TbHtml::resetButton('Reset'),
            ));
            $this->endWidget();
            ?>
        </fieldset>

    </div><!-- form -->

<?php endif; ?>

<script>
    function showMap(map) {
        var maps = new Array;
        maps['Noida'] = '<iframe width="100%" height="580" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f816a5508432be4ab&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=28.586915,77.315941&amp;spn=0.009044,0.013733&amp;z=16&amp;iwloc=0004f816a8e7efe51141c&amp;output=embed"></iframe><br /><small>View <a target="_blank" href="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f816a5508432be4ab&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=28.586915,77.315941&amp;spn=0.009044,0.013733&amp;z=16&amp;iwloc=0004f816a8e7efe51141c&amp;source=embed" style="color:#0000FF;text-align:left">Belair Travel &amp; Cargo P. Ltd (B2B Division)</a> in a larger map</small>';
        maps['Head'] = '<iframe width="100%" height="580" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f81670e2ac29be0c2&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=28.630986,77.220722&amp;spn=0.00452,0.006866&amp;z=17&amp;iwloc=0004f8168592a41f0c778&amp;output=embed"></iframe><br /><small>View <a href="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f81670e2ac29be0c2&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=28.630986,77.220722&amp;spn=0.00452,0.006866&amp;z=17&amp;iwloc=0004f8168592a41f0c778&amp;source=embed" style="color:#0000FF;text-align:left">Belair Travel &amp; Cargo P. Ltd</a> in a larger map</small>';
        maps['Bangalore'] = '<iframe width="100%" height="580" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f81694b48eec4edc1&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=12.975139,77.614481&amp;spn=0.010037,0.013733&amp;z=16&amp;iwloc=0004f8169be5b87605d8a&amp;output=embed"></iframe><br /><small>View <a href="https://www.google.co.in/maps/ms?msid=204193885765947401061.0004f81694b48eec4edc1&amp;msa=0&amp;ie=UTF8&amp;t=m&amp;ll=12.975139,77.614481&amp;spn=0.010037,0.013733&amp;z=16&amp;iwloc=0004f8169be5b87605d8a&amp;source=embed" style="color:#0000FF;text-align:left">Belair Travel &amp; Cargo P. Ltd (Bangalore)</a> in a larger map</small>';
        $('#mapsPlace').html(maps[map]);
        return false;
    }
</script>