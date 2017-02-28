'use strict';

var _ = require('lodash')
        ;

var Form = require('core/form'),
        Auth = require('components/app/auth')
        ;

var h_money = require('helpers/money'),
        h_duration = require('helpers/duration')()
        ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/booking/step1.html'),
    components: {
        itinerary: require('../itinerary'),
        'ui-code': require('core/form/code'),
        'ui-email': require('core/form/email')
    },
    data: function () {
        return {
            promocode: null,
            promovalue: null,
            promoerror: null,
            money: h_money,
            duration: h_duration,
            seg_length: function (flights) {
                var c = 0;
                _.each(flights, function (flight) {
                    c += flight.get('segments').length;
                });

                return c;
            }
        }
    },
    onconfig: function () {
        this.observe('booking.steps.1.active', function (active) {
            if (active) {
                this.get('booking').setCurrentStepForMobile(0);
                if (typeof this.get('booking.promo_code') !== "undefined") {

                    this.set('promocode', this.get('booking.promo_code'));
                    this.set('promovalue', this.get('booking.promo_value'));
                    this.set('promotncurl', this.get('booking.promotncurl'));
                }
                var cur = this.get('booking.currency');
                //console.log(cur);
                this.set('meta.display_currency', cur);

                this.update('meta');
                //console.log( this.get('meta'));
            }
        });
    },
    oncomplete: function () {
        $(this.find('.price'))
                .popup({
                    position: 'bottom right',
                    popup: $(this.find('.fare.popup')),
                    on: 'hover'
                });
    },
    submit: function () {
        //console.log(this.get('booking.id'));
        // $(this.find('form')).ajaxSubmit({url: 'about:blank', method: 'POST', iframe: true});
        this.get('booking').step1(this);

        if (MOBILE && window.localStorage) {
            window.localStorage.setItem('booking_email', this.get('booking.user.email'));
            window.localStorage.setItem('booking_country', this.get('booking.user.country'));
            window.localStorage.setItem('booking_mobile', this.get('booking.user.mobile'));
        }
    },
    back: function () {
        this.parent.back();
    },
    activate: function () {
        if (!this.get('booking.payment.payment_id')) {
            this.get('booking').activate(1);
        }
    },
    signin: function () {
        var view = this;

        Auth.login()
                .then(function (data) {
                    view.set('meta.user', data);
                    view.set('booking.user', {id: data.id, email: data.email, mobile: data.mobile, country: data.country, logged_in: true});
                });
    },
    applyPromoCode: function () {
        
        var promocode = this.get('promocode');
        
        this.set('promoerror', null);
        if (promocode !== null && promocode !== '') {
            this.set('promocode', promocode.toUpperCase());
            promocode = this.get('promocode');
            var view = this;
            var data = {id: this.get('booking.id'), promo: promocode};
            $.ajax({
                timeout: 10000,
                type: 'POST',
                url: '/b2c/booking/checkPromoCode',
                data: data,
                dataType: 'json',
                complete: function () {

                },
                success: function (data) {
                    if (data.hasOwnProperty('error')) {
                        console.log(data.error);
                        view.set('promoerror', data.error);
                    } else if (data.hasOwnProperty('value')) {
                        view.set('promovalue', data.value);
                        view.set('booking.promo_value', data.value);
                        view.set('booking.promo_code', data.code);
                        view.set('promotncurl', data.promo_tnc_url);
                    }
                },
                error: function (xhr) {
                }
            });
            }
            else
            {
             this.set('promoerror',  " You haven't entered a coupon code!");
            }
    },
    removePromoCode: function () {
        //   console.log('removePromoCode');
        this.set('promoerror', null);
        this.set('promocode', null);
        this.set('promovalue', null);
        this.set('promotncurl', null);

        var view = this;
        var data = {id: this.get('booking.id')};
        $.ajax({
            timeout: 10000,
            type: 'POST',
            url: '/b2c/booking/removePromoCode',
            data: data,
            dataType: 'json',
            complete: function () {

            },
            success: function (data) {
                view.set('booking.promo_value', null);
                view.set('booking.promo_code', null);

            },
            error: function (xhr) {
            }
        });
    },
    removeErrorMsg: function () {
        this.set('promoerror', null);
    },
    applyPromo: function (){
        
    var promocode = this.get('promocode');
        if (promocode !== null && promocode !== '') {
            this.set('promocode', promocode.toUpperCase());
            promocode = this.get('promocode');

            this.set('promoerror', null);
            var view = this;
            var data = {id: this.get('booking.id'), promo: promocode};
            $.ajax({
                timeout: 10000,
                type: 'POST',
                url: '/b2c/booking/checkPromoCode',
                data: data,
                dataType: 'json',
                complete: function () {

                },
                success: function (data) {
                    if (data.hasOwnProperty('error')) {
                        console.log(data.error);
                        view.set('promoerror', data.error);
                    } else if (data.hasOwnProperty('value')) {
                        view.set('promovalue', data.value);
                        view.set('booking.promo_value', data.value);
                        view.set('booking.promo_code', data.code);
                        view.set('promotncurl', data.promo_tnc_url);
                    }
                },
                error: function (xhr) {
                }
            });
            }
       
    }
});