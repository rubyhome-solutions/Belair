<h1>Add Traveler</h1>
<button class="middle blue add-new">View Travelers</button>
<?php
$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
    'id' => 'traveler-form',
    'layout' => TbHtml::FORM_LAYOUT_INLINE,
    'enableAjaxValidation' => false,
        ));
//    $model->addError('name', 'Just a test error');
echo $form->errorSummary($model);
?>
<div class="user-info">
    <img src="<?php echo \Yii::app()->theme->baseUrl ?>/img/tmp/user-big.png" alt=""/>

    <div class="name"><?php echo $traveler->travelerTitle->name . " " . $traveler->first_name . " " . $traveler->last_name; ?></div>
    <div class="customer-id">Customer Id: <?php echo $traveler->id; ?></div>
    <div class="phone">Mobile No: <?php echo $traveler->mobile; ?></div>
    <div class="action">
        <button class="small gray">Edit</button>
        <button class="small gray">Delete</button>
    </div>
</div>
<div class="details">
    <h2>Contact Details</h2>
    <table>
        <tr>
            <td>Email Address:</td>
            <td><?php echo $traveler->email; ?></td>
        </tr>
        <tr>
            <td>Mobile Number:</td>
            <td><?php echo $traveler->mobile; ?></td>
        </tr>
    </table>
</div>
<div class="details">
    <h2>Personal Details</h2>
    <table>
        <tr>
            <td>Date of Birth:</td>
            <td><?php echo $traveler->birthdate; ?></td>
        </tr>
        <tr>
            <td>Passport No:</td>
            <td><?php echo $traveler->passport_number; ?></td>
        </tr>
        <tr>
            <td>Issued Place:</td>
            <td><?php echo $traveler->passport_place; ?></td>
        </tr>
    </table>
</div>
<br/>
<br/>

<?php $this->endWidget(); ?>