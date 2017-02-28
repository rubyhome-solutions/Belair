<?php

namespace b2c\models;

\Yii::import('application.models.forms.BookingSearchForm');

class FlightsSearchForm extends \BookingSearchForm {
    public $is_domestic;
}