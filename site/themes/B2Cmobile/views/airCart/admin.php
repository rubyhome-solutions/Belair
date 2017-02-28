<?php
/* @var $this AirCartController */
/* @var $model AirCart */


$this->breadcrumbs = array(
    'Air Carts' => array('admin'),
    'Manage',
);?>

<?php $this->beginClip('sidebar') ?>
<?php $this->renderPartial('//layouts/_profile_sidebar') ?>
<?php $this->endClip() ?>


<div class="table">
<div>
<div class="box reschedule">
    <h1>My Bookings</h1>

    <h2>Upcoming Trips</h2>

    <div class="group">
        <div class="item progress">
            <div class="table">
                <div>
                    <span class="direction">Mumbai<span class="to">&nbsp;</span>New Delhi</span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status progress">IN PROCESS</span>
                </div>
            </div>
        </div>
        <div class="item booked">
            <div class="table">
                <div>
                    <span class="direction">Mumbai<span class="back">&nbsp;</span>New Delhi</span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status booked">Booked</span>
                </div>
            </div>
        </div>
        <div class="item cancelled">
            <div class="table">
                <div>
                    <span class="direction">New Delhi | Mumbai | Goa | Jaipur | Jammu | Jaipur | New Delhi </span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status cancelled">cancelled</span>
                </div>
            </div>
        </div>
        <div class="item booked">
            <div class="table">
                <div>
                    <span class="direction">Mumbai<span class="back">&nbsp;</span>New Delhi</span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status booked">Booked</span>
                </div>
            </div>
        </div>
    </div>
    <h2>Previous Trips</h2>

    <div class="group">
        <div class="item previous">
            <div class="table">
                <div>
                    <span class="direction">Mumbai<span class="to">&nbsp;</span>New Delhi</span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status booked">Booked</span>
                </div>
            </div>
        </div>
        <div class="item previous">
            <div class="table">
                <div>
                    <span class="direction">Mumbai<span class="back">&nbsp;</span>New Delhi</span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status booked">Booked</span>
                </div>
            </div>
        </div>
        <div class="item previous">
            <div class="table">
                <div>
                    <span class="direction">New Delhi | Mumbai | Goa | Jaipur | Jammu | Jaipur | New Delhi </span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status booked">Booked</span>
                </div>
            </div>
        </div>
        <div class="item previous">
            <div class="table">
                <div>
                    <span class="direction">Mumbai<span class="back">&nbsp;</span>New Delhi</span>
                    <span class="date">Dec. 15, 2014</span>
                </div>
                <div>
                    <span class="booking-id">Booking Id: 45841245 </span>
                    <span class="booking-date">Dec.02, 2014</span>
                </div>
            </div>
            <div class="hr">&nbsp;</div>
            <div class="table">
                <div>
                                    <span class="traveller">
                                        <a href="#">Mohit</a> | <a href="#">Naveen</a> | <a href="#">Kanika</a> | <a
                                            href="#">Jyoti</a>
                                    </span>
                </div>
                <div>
                    <span class="price">Rs. 15,456</span>
                    <span class="status booked">Booked</span>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</div>
