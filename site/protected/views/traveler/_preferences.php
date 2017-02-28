<?php
/* @var $model Traveler */

$preferences = new Preferences;
if (!empty($model->preferences)) {
    $preferences = $model->preferences;
}

echo TbHtml::activeDropDownListControlGroup($preferences, 'int_meal_id', CHtml::listData(MealList::model()->findAll(array('order' => 'id')), 'id', 'name'), array('empty' => 'Please select'));
echo TbHtml::activeDropDownListControlGroup($preferences, 'int_seat_id', CHtml::listData(SeatList::model()->findAll(array('order' => 'id')), 'id', 'name'), array('empty' => 'Please select'));

// Visible only for corporate clients
if ($model->userInfo->user_type_id == UserType::corporateB2E) {
    echo TbHtml::activeTextFieldControlGroup($preferences, 'department');
    echo TbHtml::activeTextFieldControlGroup($preferences, 'designation');
    echo TbHtml::activeTextFieldControlGroup($preferences, 'cost_center');
    echo TbHtml::activeTextFieldControlGroup($preferences, 'emp_code');
}

echo TbHtml::submitButton('<i class="fa fa-save fa-lg fa-white"></i>&nbsp;&nbsp;Save preferences', array(
    'color' => TbHtml::BUTTON_COLOR_WARNING,
    'style' => 'margin-left: 35%;',
    'encode' => false,
));
?>
<hr>
<p style="font-size: 0.8em;">* Seat and Meal Preferences are not guaranteed and depend on the sector and airline.</p>
