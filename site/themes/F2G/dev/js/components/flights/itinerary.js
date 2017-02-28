'use strict';

var Form = require('core/form'),
    moment = require('moment'),
    _ = require('lodash'),

    h_money = require('helpers/money')(),
    h_duration = require('helpers/duration')()
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/itinerary.html'),

    data: function() {
        return _.extend(
            { moment: moment, money: h_money.money, duration: h_duration }
        );
    }
});