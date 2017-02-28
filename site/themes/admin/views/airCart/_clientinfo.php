<?php
/* @var $this AirCartController */
/* @var $model AirCart */
\Yii::setPathOfAlias('libphonenumber', \Yii::getPathOfAlias('application.vendor.libphonenumber'));

$number = '';
if (isset($model->user->userInfo->mobile)) {
    $number = $model->user->userInfo->mobile;
    $country = getCountryUsingNumber($number);
}
$bookingmobiles = $model->getBookingMobiles();
if (!empty($bookingmobiles)) {
    $number = $bookingmobiles;
    $bookingcountry = getCountryUsingNumber($number);
}

function getCountryUsingNumber($number) {
    if (isset($number) && !empty($number)) {
        try {
            $util = \libphonenumber\PhoneNumberUtil::getInstance();
            $phone = $util->parse($number, 'IN');
            $rc = $util->getRegionCodeForNumber($phone);
            return \Country::model()->findByAttributes(array('code' => $rc));
        } catch (Exception $e) {
            \Utils::dbgYiiLog('Caught phone exception: ' . $e->getMessage());
        }
    }
}


?>

<div class="ibox float-e-margins">
                <div class="ibox-title text-success">
                    <h5><i class="fa fa-user"></i> Client information</h5>

                </div>
                <div class="ibox-content">

                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Mobile</th>
                                <th>Booking Mobile</th>

                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="gradeX">
                                <td><?php echo CHtml::link("<b>{$model->user->userInfo->name}</b>", "/users/manage?selectedvalue={$model->user_id}"); ?></td>
                                <td><?php
            if (isset($country->name))
                echo $country->name . '  ';
            echo CHtml::link($model->user->userInfo->mobile, "tel:{$model->user->userInfo->mobile}");
            ?>
                                </td>
                                <td><?php
            if (isset($bookingcountry->name))
                echo $bookingcountry->name . '  ';
            echo $model->getBookingMobiles();
            ?></td>

                                <td class="center"><?php echo CHtml::link($model->user->userInfo->email, "mailto:{$model->user->userInfo->email}", ['target' => '_blank']); ?></td>
                            </tr>
                    </table>

                </div>
            </div>