<?php
/* @var $this AirCartController */
/* @var $model AirCart */
/* @var $form TbActiveForm */

if (Authorization::getIsStaffLogged()) {
    ?>
    <form id="yw0" class="search-form" action="/airCart/admin" method="get">
        <table class="table table-bordered table-condensed shadow" style="width: auto;">
            <tr class="center">
                <td colspan="6">
                    <a class="positive btn btn-info" href="/airCart/admin?AirCart[payment_status_id]=<?php echo \PaymentStatus::STATUS_NOT_CHARGED;?>">Not Charged</a>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_NEW; ?>">New</button>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_IN_PROCESS; ?>">InProcess</button>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_HOLD; ?>">Hold</button>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_ABORTED; ?>">Aborted</button>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_TO_CANCEL; ?>">ToCancel</button>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_CANCELLED; ?>">Cancelled</button>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_PARTIALLY_BOOKED; ?>">PartiallyBooked</button>
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_BOOKED; ?>">Booked</button>
                    <!--<button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php // echo BookingStatus::STATUS_BOOKED_TO_BILL; ?>">BookedToBill</button>-->
                    <!--<button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php // echo BookingStatus::STATUS_BOOKED_TO_CAPTURE; ?>">BookedToCapture</button>-->
                    <!--<button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php // echo BookingStatus::STATUS_COMPLETE; ?>">Complete</button>-->
                    <button type="button" class="positive btn btn-info" name="AirCart[booking_status_id]" value="<?php echo BookingStatus::STATUS_FRAUD; ?>">Fraud</button>
                </td>
            </tr>
        </table>
    </form>
<?php } ?>
<?php echo CHtml::link('<i class="fa fa-eye-slash fa-lg"></i>&nbsp;&nbsp;Search', '#', array('class' => 'search-button btn')); ?>
<div class="form shadow search-form" style="display:none">
    <br>
    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'action' => \Yii::app()->createUrl($this->route),
        'method' => 'get',
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'id' => 'airCart-search-form',
    ));
    ?>
    <table class="table table-bordered table-condensed">
        <tr class="center">
            <th>Cart ID</th>
            <td colspan="2"> <?php echo TbHtml::activeTextField($model, 'id'); ?></td>
            <td colspan="2"></td>
        </tr>
        <tr class="center">
            <th>Cart Filters</th>
            <td><?php echo TbHtml::activeDropDownList($model, "booking_type_id", CHtml::listData(BookingType::model()->findAll(['order' => 'id']), "id", "name"), ['empty' => 'Booking Type ...']); ?></td>
            <td><?php echo TbHtml::activeDropDownList($model, "booking_status_id", CHtml::listData(BookingStatus::model()->findAll(['order' => 'id']), "id", "name"), ['empty' => 'Booking Status ...']); ?></td>
            <td><?php echo TbHtml::activeDropDownList($model, "payment_status_id", CHtml::listData(PaymentStatus::model()->findAll(['order' => 'id']), "id", "name"), ['empty' => 'Payment Status ...']); ?></td>
            <td><?php echo TbHtml::activeDropDownList($model, "approval_status_id", CHtml::listData(ApprovalStatus::model()->findAll(['order' => 'id']), "id", "name"), ['empty' => 'Approval Status ...']); ?></td>
        </tr>
        <tr class="center">
            <th>Traveler filter</th>
            <td colspan="2">
                <?php
                echo TbHtml::hiddenField('AirCart[traveler_id]', null, ['id' => 'traveler_id']);
                $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
                    'id' => 'searchbox_traveler',
                    'name' => 'traveler_filter',
                    'value' => '',
                    'source' => '/traveler/search',
                    'options' => array(
                        'showAnim' => 'fold',
                        'minLength' => '3',
                        'select' => 'js:function( event, ui ) {
                        $("#searchbox_traveler").val( ui.item.label );
                        $("#searchbox_traveler").blur();
                        // location.href = "/traveler/admin?selectedvalue=" + ui.item.value;
                        $("#traveler_id").val( ui.item.value );
                        return false;
                  }',
                    ),
                    'htmlOptions' => array(
                        'onfocus' => 'js: this.value = null; $("#searchbox_traveler").val(null); $("#traveler_id").val(null);',
                        'class' => 'search-query',
                        'placeholder' => "Anything about the traveler",
                        'style' => 'max-width:500px;width:320px;',
                    ),
                ));
                ?>
            </td>
            <th >User / Company filter</th>
            <td colspan="2">
                <?php
//                echo TbHtml::textField("user_filter", '', ['placeholder' => 'Anything about the user or the company', 'style' => 'max-width:260px;width:260px;']);
                echo TbHtml::hiddenField('AirCart[user_id]', null, ['id' => 'user_id']);
                $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
                    'id' => 'searchbox_user',
                    'name' => 'user_filter',
                    'value' => '',
                    'source' => '/users/search',
                    'options' => array(
                        'showAnim' => 'fold',
                        'minLength' => '4',
                        'select' => 'js:function( event, ui ) {
                        $("#searchbox_user").val( ui.item.label );
                        $("#searchbox_user").blur();
                        // location.href = "/traveler/admin?selectedvalue=" + ui.item.value;
                        $("#user_id").val( ui.item.value );
                        return false;
                  }',
                    ),
                    'htmlOptions' => array(
                        'onfocus' => 'js: this.value = null; $("#searchbox_user").val(null); $("#user_id").val(null);',
                        'class' => 'search-query',
                        'placeholder' => "Anything about the user or the company",
                        'style' => 'max-width:500px;width:320px;',
                    ),
                ));
                ?>
            </td>
        </tr>
        <tr class="center">
            <th >Booking Date</th>
            <td>
                <?php
                $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                    'id' => 'from_filter',
                    'model' => $model,
                    'attribute' => 'from_filter',
                    'options' => array(
                        'dateFormat' => 'yy-mm-dd',
                        'changeMonth' => true,
                        'changeYear' => true,
                        'maxDate' => 'now',
                    ),
                    'htmlOptions' => [
                        'placeholder' => 'From date',
                        'style' => 'max-width:115px;',
                    ]
                ));
                ?>
                &nbsp;<a href='' onclick="this.previousElementSibling.focus();
                        return false;"><i class="fa fa-calendar fa-2x" style="vertical-align: middle;"></i></a>
            </td>
            <td>
                <?php
                $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                    'id' => 'to_filter',
                    'model' => $model,
                    'attribute' => 'to_filter',
                    'options' => array(
                        'dateFormat' => 'yy-mm-dd',
                        'changeMonth' => true,
                        'changeYear' => true,
                        'maxDate' => 'now',
                    ),
                    'htmlOptions' => [
                        'placeholder' => 'To date',
                        'style' => 'max-width:115px;'
                    ]
                ));
                ?>
                &nbsp;<a href='' onclick="this.previousElementSibling.focus();
                        return false;"><i class="fa fa-calendar fa-2x" style="vertical-align: middle;"></i></a>
            </td>
            <th >Air PNR / CRS PNR / E-ticket</th>
            <td colspan="2">
                <?php
//                echo TbHtml::activeTextField($model, "air_pnr_crs_pnr_ticket", ['placeholder' => 'Anything of the PNRs or E-TICKETs', 'style' => 'max-width:260px;width:260px;']);
                $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
                    'id' => 'searchbox_pnr',
                    'name' => 'pnr_filter',
                    'value' => '',
                    'source' => '/airCart/search',
                    'options' => array(
                        'showAnim' => 'fold',
                        'minLength' => '4',
                        'select' => 'js:function( event, ui ) {
                        $("#searchbox_pnr").val( ui.item.label );
                        $("#searchbox_pnr").blur();
                        $("#AirCart_id").val( ui.item.value );
                        $("#airCart-search-form").submit();
                        return false;
                  }',
                    ),
                    'htmlOptions' => array(
                        'onfocus' => 'js: this.value = null; $("#searchbox_pnr").val(null); $("#AirCart_id").val(null);',
                        'class' => 'search-query',
                        'placeholder' => "Anything of the PNRs or E-TICKETs",
                        'style' => 'max-width:500px;width:320px;',
                    ),
                ));
                ?>
            </td>
        </tr>

    </table>
    <?php
//        echo TbHtml::activeTextField($model, 'user_id');
//        echo TbHtml::activeTextField($model, 'loged_user_id');
//        echo TbHtml::activeTextField($model, 'payment_status_id');
//        echo TbHtml::activeTextField($model, 'created');
    ?>

    <!--<div class="form-actions">-->
    <?php
    echo TbHtml::submitButton('<i class="fa fa-search fa-lg"></i>&nbsp;&nbsp;Search Carts', array(
        'color' => TbHtml::BUTTON_COLOR_PRIMARY,
        'size' => TbHtml::BUTTON_SIZE_LARGE,
        'style' => 'margin-left:10%;margin-bottom:2%;',
    ));
    ?>
    <!--</div>-->

    <?php $this->endWidget(); ?>

</div><!-- search-form -->