<?php
/* @var $this AirCartController */
/* @var $model AirCart */

$this->breadcrumbs = array(
    'Air Carts' => array('admin'),
    "Cart № $model->id" => '/airCart/view/' . $model->id,
    'Modify',
);

$this->renderPartial('_clientinfo', ['model' => $model]);
$this->renderPartial('_cartinfo', [
    'model' => $model,
    'payments' => $payments,
]);
//$amendments = Amendment::model()->with('airBooking')
//        ->findAll([
//    'condition' => '"airBooking".air_cart_id = ' . $model->id,
//    'order' => 't.id']);
/*
$amendments = Amendment::model()->findAllBySql('
    Select
        sum(amount_to_charge) as amount_to_charge,
        min(amendment.id) as id,
        min(amendment.loged_user_id) as loged_user_id,
        amendment.group_id,
        min(air_booking_id) as air_booking_id ,
        min(amendment.created) as created,
        amendment_type_id,
        min(amendment.note) as note ,
        amendment_status_id,
        min(amendment.payment_status_id) as payment_status_id
    From amendment
    JOIN air_booking on (air_booking.id = amendment.air_booking_id)
    WHERE air_booking.air_cart_id = :cartId
    Group By amendment.group_id, amendment_status_id, amendment_type_id
    ORDER BY id
    ', ['cartId' => $model->id]);
//Utils::dbgYiiLog($amendments);
if (count($amendments) > 0) {     // There is amendments
    $this->renderPartial('_cartamendments', ['amendments' => $amendments]);
}
 * 
 */
$this->renderPartial('_modifyairbooking', ['model' => $model, 'errors' => $errors]);

if (count($payments) > 0) {     // There are payments
    $this->renderPartial('_cartpayments', ['payments' => $payments]);
}
?>
<style>
    .well-small {
        margin-bottom: 5px;
        margin-top: 15px;
        font-weight: bold;
    }
    .table .left td {
        text-align: left;
    }
    .table th, td.center, tr.center td {
        text-align: center;
        vertical-align: middle;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
    }
    .selected {background-color: #fef8b8;}
    input.inline {
        max-width: 56px;
        padding: 0;
        margin-bottom: 0;
    }
    select.inline {
        max-width: 180px;
        margin-bottom: 0;
    }
    form.inline {
        margin-bottom: 0;
    }
    .red {
        background-color: lightcoral;
        font-weight: bold;
    }
    .green {
        background-color: lightgreen;
        font-weight: bold;
    }
    .center {text-align: center;}


</style>
<script>
    $(function() {
        $('.checkbox').change(function() {
            tbody = $(this).parents('tbody');
            if ($(this).is(":checked")) {
                $(tbody).addClass('selected');
            } else {
                $(tbody).removeClass('selected');
            }
        });

        // Some inputs shold be capital letters only
        $("input.capitalize").keyup(function() {
            this.value = this.value.toUpperCase();
        });
    });

    function amendItems() {
        amendmentType = $('#amendment_type').val();
        if (amendmentType == '') {
            alert('Please choose the amendment type!');
            $('#amendment_type').focus();
        }
        else {
            var arrayOfIds = $.map($(".selected"), function(n, i) {
                return {ar: n.getAttribute('ar'), ab: n.getAttribute('ab')};
            });
            if (arrayOfIds.length == 0) {
                alert('Please select the element(s) that need to be amended!');
            }
            else {
                $('#myModal').modal('show');
                $("#myModal").unbind("hidden");
                $('#myModal').on('hidden', function() {
                    if ($('#amendReasonBtn').val() == '1') { // The submit button is pressed
                        if ($('#amendReason').val().length < 5) { // The reason is too short
                            alert('The amendment reason is too short.\nPlease enter valid and detailed amendment reason!');
                        } else {
                            $.post('/airCart/amend/' + amendmentType, {
                                items: arrayOfIds,
                                reason: $('#amendReason').val()
                            }, function(data) {
                                if (data.result === 'success') {
//                                    location.href = location.href.split('#')[0] + '#cartAmendments';
                                    document.body.style.cursor = 'wait';
                                    location.reload();
                                    location.hash = '#cartAmendments';
                                } else {
                                    alert(data.message);
                                }
                            }, 'json');
                        }
                    }
                });
            }
        }
    }
</script>
