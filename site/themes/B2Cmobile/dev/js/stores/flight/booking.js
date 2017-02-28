'use strict';

var _ = require('lodash'),
    Q = require('q'),
    $ = require('jquery'),
    page = require('page')
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
                        ['Try Again', function() { }]
                    ]
                });

                return;
            }

            if (5 == response.code) {
                Dialog.open({
                    header: 'Price Change Alert',
                    message: '<div style="text-align: center">Sorry! The price for your booking has increased by <br>' + money(response.errors.priceDiff, meta.get('display_currency') + '</div>'),
                    // message: '<div style="text-align: center">Sorry! The price for your booking has increased !<br> New price is ' + money(response.errors.price, meta.get('display_currency') + '</div>'),
                    
                    buttons: [
                        ['Back to Search', function() { window.location.href = '/b2c/flights' + view.get('searchurl') + '?force'; }],
                        ['Continue', function() { window.location.href = '/b2c/booking/' + view.get('id') + '?_=' + _.now() }]
                    ]
                });

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
                    ['Try Again', function() { }]
                ]
            });
        }

        Meta.instance().then(function(i) { meta = i; });
    },


    activate: function (i) {
        this.set('steps.*.active', false);
        this.set('steps.' + i + '.active', true);
        
        console.log('steps.' + i + '.active');
    },
    step1: function () {
        var view = this,
                deferred = Q.defer();

        step.submit(this, 1);

        $.ajax({
            timeout: 60000,
            type: 'POST',
            url: '/b2c/booking/step1',
            data: {id: this.get('id'), user: this.get('user')},
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
                }
            },
            error: function (xhr) {
                step.error(view, 1, xhr);
            }
        });


        return deferred.promise;
    },
    step2: function (o) {
        var view = this,
                deferred = Q.defer();

        step.submit(this, 2);

        $.ajax({
            timeout: 60000,
            type: 'POST',
            url: '/b2c/booking/step2',
            data: {id: this.get('id'), check: o && o.check ? 1 : 0, passengers: this.get('passengers'), 'scenario': this.get('passengerValidaton')},
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
                console.log(view.get());
            },
            error: function (xhr) {
                step.error(view, 2, xhr);
            }
        });


        return deferred.promise;
    },
    step3: function () {
        var view = this,
                deferred = Q.defer(),
                data = {id: this.get('id')};

        step.submit(this, 3);

        if (3 == this.get('payment.active')) {
            data.netbanking = this.get('payment.netbanking');
        } else {
            data.cc = this.get('payment.cc');
            data.cc.store = data.cc.store ? 1 : 0;
        }

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
     console.log('booking data');
    console.log(data);
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