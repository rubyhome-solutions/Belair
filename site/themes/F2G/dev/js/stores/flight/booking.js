'use strict';

var _ = require('lodash'),
        Q = require('q'),
        $ = require('jquery'),
        page = require('page'),
        screenShot = require('components/flights/booking/html2canvas')
        ;

var View = require('core/view'),
        Flight = require('stores/flight'),
        Dialog = require('components/flights/booking/dialog'),
        Meta = require('stores/flight/meta')
        ;

var money = require('helpers/money');


var step = {
    submit: function (view, i) {
        view.set('steps.' + i + '.submitting', true);
        view.set('steps.' + i + '.errors', {});
    },
    complete: function (view, i) {
        view.set('steps.' + i + '.submitting', false);
    },
    error: function (view, i, xhr) {

        try {
            var response = JSON.parse(xhr.responseText);

            if (3 == response.code) {
                view.set('error', response.message);

                return;
            }

            if (4 == response.code) {
                Dialog.open({
                    header: 'Payment Failed',
                    message: response.message,
                    buttons: [
                        ['Try Again', function () { }]
                    ]
                }, 1);

                return;
            }

            if (5 == response.code) {
                Dialog.open({
                    header: 'Price Change Alert',
                    message: '<div style="text-align: center">Sorry! The price for your booking has increased by <br>' + money(response.errors.priceDiff, meta.get('display_currency') + '</div>'),
                    // message: '<div style="text-align: center">Sorry! The price for your booking has increased !<br> New price is ' + money(response.errors.price, meta.get('display_currency') + '</div>'),

                    buttons: [
                        ['Back to Search', function () {
                                window.location.href = '/b2c/flights' + view.get('searchurl') + '?force=1';
                            }],
                        ['Continue', function () {
                                window.location.href = '/b2c/booking/' + view.get('id') + '?_=' + _.now()
                            }]
                    ],
                    closeButton: false
                }, 2);

                return;
            }

            if (response.errors) {
                view.set('steps.' + i + '.errors', response.errors);
            } else {
                if (response.message) {
                    view.set('steps.' + i + '.errors', [response.message]);
                }
            }


        } catch (e) {
            view.set('steps.' + i + '.errors', ['Server returned error. Please try again later']);
        }
    }
};

var doPay = function (data) {
    var form;
    form = $('<form />', {
        id: 'tmpForm',
        action: data.url,
        method: 'POST',
        style: 'display: none;'
    });
    var input = data.data;
    
    if (typeof input !== 'undefined' && input !== null) {
        $.each(input, function (name, value) {
            if (value !== null) {
                $('<input />', {
                    type: 'hidden',
                    name: name,
                    value: value
                }).appendTo(form);
            }
        });
    }

    form.appendTo('body').submit();
};

var meta = null;
var Booking = View.extend({
    canvas: null,
    data: function () {
        return {
            isBooked: function (bs) {
                return bs == 8 || bs == 9 || bs == 10 || bs == 11;
            },
            inProcess: function (bs) {
                return !(bs == 8 || bs == 9 || bs == 10 || bs == 11) && !(bs == 1);
            },
            isNew: function (bs) {
                return 1 == bs;
            }
        };
    },
    computed: {
        price: function () {
            return _.reduce(this.get('flights'), function (result, i) {
                return result + i.get('price');
            }, 0);
        }
    },
    onconfig: function () {
        if (this.get('steps.4.active') && !this.get('booking.aircart_id')) {
            this.step4();
        }

        if (this.get('payment.error')) {
            Dialog.open({
                header: 'Payment Failed',
                message: this.get('payment.error'),
                buttons: [
                    ['Try Again', function () { }]
                ]
            }, 1);
        }

        Meta.instance().then(function (i) {
            meta = i;
        });
    },
    activate: function (i) {
        this.set('steps.*.active', false);
        this.set('steps.' + i + '.active', true);
        
        this.resetPayment();
        //console.log('steps.' + i + '.active');
    },
    resetPayment: function(){
        this.set('payment.cc', {});
        this.set('payment.netbanking', {});
        this.set('payment.wallet', {});
        this.set('convenienceFee', 0);
        window.prevCCType = undefined;
        window.prevCardType = undefined;
    },
    captureScreenShot: function (view, i, callback) {
        html2canvas($('body'), {
            onrendered: function (_canvas) {
                view.canvas = _canvas;
                step.submit(view, i);
                callback();
            }
        });
    },
    getCapturedImageData: function () {
        var dataURL = null;
        if (this.canvas !== null) {
            dataURL = this.canvas.toDataURL("image/png");
        }
        return dataURL;
    },
    step1: function (stepview) {
        var view = this,
                deferred = Q.defer();
        var callback = (function () {
            $.ajax({
                timeout: 60000,
                type: 'POST',
                url: '/b2c/booking/step1',
                data: {id: view.get('id'), user: view.get('user'), imgData: view.getCapturedImageData()},
                dataType: 'json',
                complete: function () {
                    step.complete(view, 1);
                },
                success: function (data) {
                    if (data && data.id) {
                        view.set('user.id', data.id);
                        view.set('user.logged_in', data.logged_in);

                        if (data.convenienceFee) {
                            view.set('convenienceFee', data.convenienceFee)
                        }
                        
                        view.set('steps.1.completed', true);
                        view.activate(2);
                        
                        if(data.promo_remove === 1) {
                            stepview.set('promoerror',null);
                            stepview.set('promocode',null);
                            stepview.set('promovalue',null);
                            stepview.set('booking.promo_value',null); 
                            stepview.set('booking.promo_code',null);   
                        }
                    }
                },
                error: function (xhr) {
                    step.error(view, 1, xhr);
                }
            });
        });
        view.captureScreenShot(view, 1, callback);

        return deferred.promise;
    },
    step2: function (o) {
        var view = this,
                deferred = Q.defer();

        var callback = (function () {
            $.ajax({
                timeout: 60000,
                type: 'POST',
                url: '/b2c/booking/step2',
                data: {id: view.get('id'), check: o && o.check ? 1 : 0, passengers: view.get('passengers'), 'scenario': view.get('passengerValidaton'), imgData: view.getCapturedImageData()},
                dataType: 'json',
                complete: function () {
                    step.complete(view, 2);
                },
                success: function (data) {
                    if (o && o.check) {
                        alert(data);
                        return;
                    }

                    if (data) {
                        _.each(data, function (id, k) {
                            view.set('passengers.' + k + '.traveler.id', id)
                        });
                        view.set('steps.2.completed', true);
                        view.activate(3);
                    }

                    if (view.get('mobile')) {
                        view.set('steps.2.completed', true);
                        view.activate(3);
                    }
                    //console.log(view.get());
                },
                error: function (xhr) {
                    step.error(view, 2, xhr);
                }
            })
        });
        view.captureScreenShot(view, 2, callback);

        return deferred.promise;
    },
    step3: function () {
        var view = this,
                deferred = Q.defer(),
                data = {id: this.get('id')},
                payment = this.get('payment');

        if (3 == payment.active) {
            data.netbanking = this.get('payment.netbanking');
            data.netbanking.category = 'netbanking';
        } else if(4 == payment.active){
            data.wallet = this.get('payment.wallet');
        } else {
            data.cc = this.get('payment.cc');
            data.cc.store = data.cc.store ? 1 : 0;
        }

        var callback = (function () {
            data.imgData = view.getCapturedImageData();
            $.ajax({
                timeout: 60000,
                type: 'POST',
                url: '/b2c/booking/step3',
                data: data,
                dataType: 'json',
                complete: function () {

                },
                success: function (data) {
                    if (data.url) {
                        doPay(data); 
                    }
                },
                error: function (xhr) {
                    step.complete(view, 3);
                    step.error(view, 3, xhr);
                }
            });
        });
        view.captureScreenShot(view, 3, callback);
        
        return deferred.promise;
    },
    step4: function () {
        var view = this,
                deferred = Q.defer(),
                data = {id: this.get('id')};


        $.ajax({
            // timeout: 20000,
            type: 'POST',
            url: '/b2c/booking/step4',
            data: data,
            dataType: 'json',
            complete: function () {
                //step.complete(view, 4);               
            },
            success: function (data) {
                view.set('aircart_id', data.aircart_id);
                view.set('aircart_status', data.aircart_status);
                view.set('steps.4.completed', true);
//                 console.log(view.get('user.email'));
//                 console.log('/b2c/airCart/sendEmail/' + view.get('aircart_id'));
//                 $.ajax({
//                    type: 'POST',
//                    url: '/b2c/airCart/sendEmail/' + parseInt(view.get('aircart_id')),
//                    data: {email: view.get('user.email'), },
//                    dataType: 'json',
//                    complete: function () {
//
//                    },
//                    success: function (data) {
//
//                    },
//                    error: function (xhr) {
//
//                    }
//                }).then(function (data) {
//
//                });
                //if (view.isBooked(data.aircart_status) || view.isProcess(data.aircart_status)) {
                setTimeout(function () {
                    window.location.href = '/b2c/airCart/mybookings/' + view.get('aircart_id');
                }, 3000);
                //}

            },
            error: function (xhr) {
//                 console.log(xhr); 
//                 if(xhr.statusText==='timeout'){
//                     console.log(view.get());
//                 }else{
                step.error(view, 4, xhr);
                // }
            }
        });


        return deferred.promise;
    },
    isBooked: function (bs) {
        return bs == 8 || bs == 9 || bs == 10 || bs == 11;
    },
    inProcess: function (br) {
        return !(bs == 8 || bs == 9 || bs == 10 || bs == 11) && !(bs == 1);
    },
    isNew: function (br) {
        return 1 == bs;
    },
    pymtConvFee: function(cat, sub_cat, bin_digits){
        var view = this;
        $.ajax({
            type: 'POST',
            url: '/b2c/booking/pymtConvFee',
            data: { id: view.get('id'), cs: view.get('clientSourceId'), pymt_cat:cat, pymt_sub_cat: sub_cat, bin_info:bin_digits},
            success: function(data) {
                view.set('convenienceFee', data.pymtConvFee);
                view.set('pcf_per_passenger', data.per_passenger);
            }
        });
    },
    setCurrentStepForMobile: function(step){
        if(MOBILE){
            this.set('currentstep', step);
        }
    }
});

Booking.parse = function (data) {
    var active = 1;

    if (MOBILE) {
        //if (data.user.mobile) {
        //    data.user.mobile = data.user.country + data.user.mobile;
        //}

        data.payment.active = -1;

        if (!data.user.email && window.localStorage && window.localStorage.getItem('booking_email')) {
            data.user.email = window.localStorage.getItem('booking_email');
            data.user.country = window.localStorage.getItem('booking_country');
            data.user.mobile = window.localStorage.getItem('booking_mobile');
        }
    }

    data.flights = _.map(data.flights, function (i) {
        return Flight.parse(i);
    });

    if (data.user && data.user.id) {
        data.steps[1].completed = true;
        data.steps[1].active = false;
        active = 2;
    }

    if (data.passengers[0].traveler.id) {
        data.steps[2].completed = true;
        data.steps[2].active = false;
        active = 3;
    }

    if (data.payment.payment_id) {
        data.steps[3].completed = true;
        data.steps[3].active = false;
        active = 4;
    }

    if (data.aircart_id) {
        data.steps[4].completed = true;
        active = 4;
    }

    data.steps[active].active = true;
    //console.log('booking data');
    //console.log(data);
    return new Booking({data: data});

};

Booking.fetch = function (id) {
    return Q.Promise(function (resolve, reject) {
        $.getJSON('/b2c/booking/' + _.parseInt(id))
                .done(function (data) {
                    resolve(Booking.parse(data));
                })
                .fail(function (data) {
                    reject();
                });
    });
};

Booking.create = function (flights, options) {
    return Q.Promise(function (resolve, reject) {
        $.ajax({
            type: 'POST',
            url: '/b2c/booking',
            data: _.extend({flights: flights}, options || {}),
            success: function (data) {
                resolve(Booking.parse(data));
            },
            error: function (xhr) {
                var response = JSON.parse(xhr.responseText);
                if (7 === response.code) {
                    Dialog.open({
                        header: 'Invalid Search Result',
                        message: '<div style="text-align: center">Sorry! ' + response.message + '</div>',
                        buttons: [
                            ['Back to Search', function () {
                                    window.location.href = options.url + '?force';
                                }]
                        ]
                    }, 1);
                }
            }
        });
    });
};

Booking.open = function (flights, options) {
    Booking.create(flights, options)
            .then(function (booking) {
                window.location.href = '/b2c/booking/' + booking.get('id');
            });
};

module.exports = Booking;
