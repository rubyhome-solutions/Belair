<?php

/* @var $this TravelerController */
/* @var $model Traveler */


$this->breadcrumbs = array(
    'Travelers' => array('admin'),
    'Manage',
);?>

<?php $this->beginClip('sidebar') ?>
<?php $this->renderPartial('//layouts/_profile_sidebar') ?>
<?php $this->endClip() ?>

<div class="table">
    <div>
        <div class="box my-travellers">
            <div class="left">
                <h1>People you book travel for</h1>
                <button class="middle blue add-new">Add New Traveller</button>
                <div class="user-info">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user-big.png" alt=""/>

                    <div class="name">Mrs. Kanika Barua</div>
                    <div class="customer-id">Customer Id: 345634654</div>
                    <div class="phone">Mobile No: +910 234.234. 2344</div>
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
                            <td>kanika.barua1985@gmail.com</td>
                        </tr>
                        <tr>
                            <td>Mobile Number:</td>
                            <td>+91- 9560505818</td>
                        </tr>
                    </table>
                </div>
                <div class="details">
                    <h2>Personal Details</h2>
                    <table>
                        <tr>
                            <td>Date of Birth:</td>
                            <td>kanika.barua1985@gmail.com</td>
                        </tr>
                        <tr>
                            <td>Passport No:</td>
                            <td>ING4746545656444</td>
                        </tr>
                        <tr>
                            <td>Issued Place:</td>
                            <td>India</td>
                        </tr>
                    </table>
                </div>
                <br/>
                <br/>
            </div>
            <div class="right">
                <h2>My Travellers</h2>

                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item active">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
                <div class="item">
                    <img src="<?=Yii::app()->theme->baseUrl?>/img/tmp/user.png" alt=""/>
                    Mr. Micheal Jain
                </div>
            </div>
        </div>
    </div>
</div>