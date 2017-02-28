webpackJsonp([5],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(311);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(26),
	    _ = __webpack_require__(30),
	    page = __webpack_require__(32),
	    $ = __webpack_require__(33)
	    ;
	
	var Form = __webpack_require__(34),
	    Booking = __webpack_require__(51),
	    Meta = __webpack_require__(68)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(71),
	
	    components: {
	        layout: __webpack_require__(72),
	        step1: __webpack_require__(79),
	        step2: __webpack_require__(88),
	        step3: __webpack_require__(95),
	        step4: __webpack_require__(103)
	    },
	
	    partials: {
	        'base-panel': __webpack_require__(105)
	    },
	
	    data: function() {
	        return {
	            meta: Meta.object
	        }
	    },
	
	    onconfig: function () {
	        Booking.fetch(this.get('id'))
	            .then(function (booking) {
	            return this.set('booking', booking); 
	            }.bind(this));
	    },
	    oncomplete:function(){
	        $('.ui.dropdown.currency').hide();
	       this.observe('booking.currency', function(cur) {
	            
	               
	                var cur=this.get('booking.currency');
	                //console.log(cur);
	                this.set('booking.currency',cur );
	                this.set('meta.display_currency',cur );
	                
	                this.update('meta');
	                //console.log( this.get('meta'));
	           
	        });
	      
	    },
	    onteardown: function() {
	        if (this.container) {
	            this.container.showPanel();
	        }
	    },
	
	    back: function(force) {
	        force = force || false;
	        if(false){
	            this.get('booking').activate(parseInt(this.get('booking.currentstep')) - 1);
	            return;
	        }
	
	        var url = '/b2c/flights',
	            cs = this.get('booking.clientSourceId'),
	            burl = this.get('booking.searchurl'),
	            params = [];
	        
	        if(burl) {
	            url = url + burl;
	        }
	        if (cs && cs > 1) {
	            params.push('cs=' + cs);
	        }
	
	        if (force) {
	            params.push('force=1');
	        }
	
	        if (params.length) {
	            url += '?' + params.join('&');
	        }
	
	        page(url);
	    },
	
	    back2: function() { this.back(true); },
	    setCurrencyBooking: function() { 
	        
	        var code=$('#currency1').val();
	        //console.log(code);
	        this.set('booking.currency', code);
	       // console.log(this.get('booking.currency'));
	        this.update('booking.currency');
	        },
	    mobileBack: function(force) {
	        force = force || false;
	
	        var url = '/b2c/flights',
	            cs = this.get('booking.clientSourceId'),
	            burl = this.get('booking.searchurl'),
	            params = [];
	        
	        if(burl) {
	            url = url + burl;
	        }
	        if (cs && cs > 1) {
	            params.push('cs=' + cs);
	        }
	
	        if (force) {
	            params.push('force=1');
	        }
	
	        if (params.length) {
	            url += '?' + params.join('&');
	        }
	
	        page(url);
	    }
	});

/***/ },
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	        Q = __webpack_require__(26),
	        $ = __webpack_require__(33),
	        page = __webpack_require__(32),
	        screenShot = __webpack_require__(52)
	        ;
	
	var View = __webpack_require__(53),
	        Flight = __webpack_require__(54),
	        Dialog = __webpack_require__(66),
	        Meta = __webpack_require__(68)
	        ;
	
	var money = __webpack_require__(69);
	
	
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
	
	var checkUpiStatus = function (data, view) {
	    var response = data.data;
	    if (response.status == 'SUCCESS' && response.orderId) {
	        var timer = 0;
	        var timerID = setInterval(function () {
	            if (timer == (60 * 1000 * 11)) {
	                step.complete(view, 3);
	                clearInterval(timerID);
	                $('#message').html('Transaction timed out.Please try again later.');
	                return false;
	            }
	
	            $.ajax({
	                //timeout: 60000,
	                type: 'POST',
	                url: '/b2c/booking/hdfcUPI',
	                data: {'orderId': response.orderId},
	                dataType: 'json',
	                complete: function () {
	
	                },
	                success: function (response) {
	                    if (response.data.status != 'PENDING') {
	                        clearInterval(timerID);
	                        window.location.href = '/payGate/upiView/orderId/' + response.data.orderId;
	                    } 
	
	                    timer += 10000;
	                },
	                error: function (xhr) {
	                    clearInterval(timerID);
	                    step.complete(view, 3);
	                    step.error(view, 3, xhr);
	                    
	                }
	            });
	
	        }, 10000);
	    }
	};
	
	var upiPaymentResponse = function (data, view) {
	    var response = data.data;
	
	    if (response.status == 'FAILED') {
	        step.complete(view, 3);
	        Dialog.open({
	            header: 'Transaction Alert',
	            message: '<div style="text-align: center">' + response.message + '</div>',
	
	            buttons: [
	                ['Back to Search', function () {
	                        window.location.href = '/b2c/flights' + view.get('searchurl') + '?force=1';
	                    }]
	            ],
	            closeButton: false
	        }, 2);
	
	        return;
	    } else if (response.status == 'SUCCESS') {
	        var message = "<div style='font-size:16px;'>We have sent payment notification to your mobile device.<br/>Please complete the transaction using your mobile.</div>";
	        $('.wait_text').html(message);
	        checkUpiStatus(data, view);
	    }
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
	    resetPayment: function () {
	        this.set('convfeeflag', false);
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
	
	                        if (data.promo_remove === 1) {
	                            stepview.set('promoerror', null);
	                            stepview.set('promocode', null);
	                            stepview.set('promovalue', null);
	                            stepview.set('booking.promo_value', null);
	                            stepview.set('booking.promo_code', null);
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
	        } else if (4 == payment.active) {
	            data.wallet = this.get('payment.wallet');
	        } else if (5 == payment.active) {
	            data.CCAvenueEmi = this.get('payment.emi');
	            data.CCAvenueEmi.category = 'EMI';
	        } else if (6 == payment.active) {
	            data.UPI = payment.upi;
	            data.category = 'upi';
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
	                    } else {
	                        upiPaymentResponse(data, view);
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
	                if (data.callback_url !== '') {
	                    window.location.href = data.callback_url;
	                } else {
	                    setTimeout(function () {
	                        window.location.href = '/b2c/airCart/mybookings/' + view.get('aircart_id');
	                    }, 3000);
	                }
	
	            },
	            error: function (xhr) {
	                step.error(view, 4, xhr);
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
	    pymtConvFee: function (cat, sub_cat, bin_digits) {
	        var view = this,
	                disabled = false;
	        view.set('convfeeflag', false);
	        
	        $.ajax({
	            type: 'POST',
	            url: '/b2c/booking/pymtConvFee',
	            data: {id: view.get('id'), cs: view.get('clientSourceId'), pymt_cat: cat, pymt_sub_cat: sub_cat, bin_info: bin_digits},
	            beforeSend: function(xhr){
	                if(!$('.book_flight').is(":disabled")) {
	                    disabled = true;
	                    $('.book_flight').attr('disabled', 'disabled');
	                }
	                $('.loader_x').css("animation-play-state", "running");
	                $('.loader_x').show();
	            },
	            success: function (data) {
	                view.set('convenienceFee', data.pymtConvFee);
	                view.set('pcf_per_passenger', data.per_passenger);
	            },
	            complete: function() {
	                view.set('convfeeflag', true);
	                $('.loader_x').hide();
	                $('.loader_x').css("animation-play-state", "paused");
	                if(disabled) {
	                    $('.book_flight').removeAttr('disabled');
	                }
	            }
	        });
	    },
	    setCurrentStepForMobile: function (step) {
	        if (false) {
	            this.set('currentstep', step);
	        }
	    }
	});
	
	Booking.parse = function (data) {
	    var active = 1;
	
	    if (false) {
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


/***/ },
/* 52 */
/***/ function(module, exports) {

	/*
	  html2canvas 0.4.1 <http://html2canvas.hertzen.com>
	  Copyright (c) 2013 Niklas von Hertzen
	
	  Released under MIT License
	*/
	
	(function(window, document, undefined){
	
	"use strict";
	
	var _html2canvas = {},
	previousElement,
	computedCSS,
	html2canvas;
	
	_html2canvas.Util = {};
	
	_html2canvas.Util.log = function(a) {
	  if (_html2canvas.logging && window.console && window.console.log) {
	    window.console.log(a);
	  }
	};
	
	_html2canvas.Util.trimText = (function(isNative){
	  return function(input) {
	    return isNative ? isNative.apply(input) : ((input || '') + '').replace( /^\s+|\s+$/g , '' );
	  };
	})(String.prototype.trim);
	
	_html2canvas.Util.asFloat = function(v) {
	  return parseFloat(v);
	};
	
	(function() {
	  // TODO: support all possible length values
	  var TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
	  var TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
	  _html2canvas.Util.parseTextShadows = function (value) {
	    if (!value || value === 'none') {
	      return [];
	    }
	
	    // find multiple shadow declarations
	    var shadows = value.match(TEXT_SHADOW_PROPERTY),
	      results = [];
	    for (var i = 0; shadows && (i < shadows.length); i++) {
	      var s = shadows[i].match(TEXT_SHADOW_VALUES);
	      results.push({
	        color: s[0],
	        offsetX: s[1] ? s[1].replace('px', '') : 0,
	        offsetY: s[2] ? s[2].replace('px', '') : 0,
	        blur: s[3] ? s[3].replace('px', '') : 0
	      });
	    }
	    return results;
	  };
	})();
	
	
	_html2canvas.Util.parseBackgroundImage = function (value) {
	    var whitespace = ' \r\n\t',
	        method, definition, prefix, prefix_i, block, results = [],
	        c, mode = 0, numParen = 0, quote, args;
	
	    var appendResult = function(){
	        if(method) {
	            if(definition.substr( 0, 1 ) === '"') {
	                definition = definition.substr( 1, definition.length - 2 );
	            }
	            if(definition) {
	                args.push(definition);
	            }
	            if(method.substr( 0, 1 ) === '-' &&
	                    (prefix_i = method.indexOf( '-', 1 ) + 1) > 0) {
	                prefix = method.substr( 0, prefix_i);
	                method = method.substr( prefix_i );
	            }
	            results.push({
	                prefix: prefix,
	                method: method.toLowerCase(),
	                value: block,
	                args: args
	            });
	        }
	        args = []; //for some odd reason, setting .length = 0 didn't work in safari
	        method =
	            prefix =
	            definition =
	            block = '';
	    };
	
	    appendResult();
	    for(var i = 0, ii = value.length; i<ii; i++) {
	        c = value[i];
	        if(mode === 0 && whitespace.indexOf( c ) > -1){
	            continue;
	        }
	        switch(c) {
	            case '"':
	                if(!quote) {
	                    quote = c;
	                }
	                else if(quote === c) {
	                    quote = null;
	                }
	                break;
	
	            case '(':
	                if(quote) { break; }
	                else if(mode === 0) {
	                    mode = 1;
	                    block += c;
	                    continue;
	                } else {
	                    numParen++;
	                }
	                break;
	
	            case ')':
	                if(quote) { break; }
	                else if(mode === 1) {
	                    if(numParen === 0) {
	                        mode = 0;
	                        block += c;
	                        appendResult();
	                        continue;
	                    } else {
	                        numParen--;
	                    }
	                }
	                break;
	
	            case ',':
	                if(quote) { break; }
	                else if(mode === 0) {
	                    appendResult();
	                    continue;
	                }
	                else if (mode === 1) {
	                    if(numParen === 0 && !method.match(/^url$/i)) {
	                        args.push(definition);
	                        definition = '';
	                        block += c;
	                        continue;
	                    }
	                }
	                break;
	        }
	
	        block += c;
	        if(mode === 0) { method += c; }
	        else { definition += c; }
	    }
	    appendResult();
	
	    return results;
	};
	
	_html2canvas.Util.Bounds = function (element) {
	  var clientRect, bounds = {};
	
	  if (element.getBoundingClientRect){
	    clientRect = element.getBoundingClientRect();
	
	    // TODO add scroll position to bounds, so no scrolling of window necessary
	    bounds.top = clientRect.top;
	    bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
	    bounds.left = clientRect.left;
	
	    bounds.width = element.offsetWidth;
	    bounds.height = element.offsetHeight;
	  }
	
	  return bounds;
	};
	
	// TODO ideally, we'd want everything to go through this function instead of Util.Bounds,
	// but would require further work to calculate the correct positions for elements with offsetParents
	_html2canvas.Util.OffsetBounds = function (element) {
	  var parent = element.offsetParent ? _html2canvas.Util.OffsetBounds(element.offsetParent) : {top: 0, left: 0};
	
	  return {
	    top: element.offsetTop + parent.top,
	    bottom: element.offsetTop + element.offsetHeight + parent.top,
	    left: element.offsetLeft + parent.left,
	    width: element.offsetWidth,
	    height: element.offsetHeight
	  };
	};
	
	function toPX(element, attribute, value ) {
	    var rsLeft = element.runtimeStyle && element.runtimeStyle[attribute],
	        left,
	        style = element.style;
	
	    // Check if we are not dealing with pixels, (Opera has issues with this)
	    // Ported from jQuery css.js
	    // From the awesome hack by Dean Edwards
	    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
	
	    // If we're not dealing with a regular pixel number
	    // but a number that has a weird ending, we need to convert it to pixels
	
	    if ( !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test( value ) && /^-?\d/.test(value) ) {
	        // Remember the original values
	        left = style.left;
	
	        // Put in the new values to get a computed value out
	        if (rsLeft) {
	            element.runtimeStyle.left = element.currentStyle.left;
	        }
	        style.left = attribute === "fontSize" ? "1em" : (value || 0);
	        value = style.pixelLeft + "px";
	
	        // Revert the changed values
	        style.left = left;
	        if (rsLeft) {
	            element.runtimeStyle.left = rsLeft;
	        }
	    }
	
	    if (!/^(thin|medium|thick)$/i.test(value)) {
	        return Math.round(parseFloat(value)) + "px";
	    }
	
	    return value;
	}
	
	function asInt(val) {
	    return parseInt(val, 10);
	}
	
	function parseBackgroundSizePosition(value, element, attribute, index) {
	    value = (value || '').split(',');
	    value = value[index || 0] || value[0] || 'auto';
	    value = _html2canvas.Util.trimText(value).split(' ');
	
	    if(attribute === 'backgroundSize' && (!value[0] || value[0].match(/cover|contain|auto/))) {
	        //these values will be handled in the parent function
	    } else {
	        value[0] = (value[0].indexOf( "%" ) === -1) ? toPX(element, attribute + "X", value[0]) : value[0];
	        if(value[1] === undefined) {
	            if(attribute === 'backgroundSize') {
	                value[1] = 'auto';
	                return value;
	            } else {
	                // IE 9 doesn't return double digit always
	                value[1] = value[0];
	            }
	        }
	        value[1] = (value[1].indexOf("%") === -1) ? toPX(element, attribute + "Y", value[1]) : value[1];
	    }
	    return value;
	}
	
	_html2canvas.Util.getCSS = function (element, attribute, index) {
	    if (previousElement !== element) {
	      computedCSS = document.defaultView.getComputedStyle(element, null);
	    }
	
	    var value = computedCSS[attribute];
	
	    if (/^background(Size|Position)$/.test(attribute)) {
	        return parseBackgroundSizePosition(value, element, attribute, index);
	    } else if (/border(Top|Bottom)(Left|Right)Radius/.test(attribute)) {
	      var arr = value.split(" ");
	      if (arr.length <= 1) {
	          arr[1] = arr[0];
	      }
	      return arr.map(asInt);
	    }
	
	  return value;
	};
	
	_html2canvas.Util.resizeBounds = function( current_width, current_height, target_width, target_height, stretch_mode ){
	  var target_ratio = target_width / target_height,
	    current_ratio = current_width / current_height,
	    output_width, output_height;
	
	  if(!stretch_mode || stretch_mode === 'auto') {
	    output_width = target_width;
	    output_height = target_height;
	  } else if(target_ratio < current_ratio ^ stretch_mode === 'contain') {
	    output_height = target_height;
	    output_width = target_height * current_ratio;
	  } else {
	    output_width = target_width;
	    output_height = target_width / current_ratio;
	  }
	
	  return {
	    width: output_width,
	    height: output_height
	  };
	};
	
	function backgroundBoundsFactory( prop, el, bounds, image, imageIndex, backgroundSize ) {
	    var bgposition =  _html2canvas.Util.getCSS( el, prop, imageIndex ) ,
	    topPos,
	    left,
	    percentage,
	    val;
	
	    if (bgposition.length === 1){
	      val = bgposition[0];
	
	      bgposition = [];
	
	      bgposition[0] = val;
	      bgposition[1] = val;
	    }
	
	    if (bgposition[0].toString().indexOf("%") !== -1){
	      percentage = (parseFloat(bgposition[0])/100);
	      left = bounds.width * percentage;
	      if(prop !== 'backgroundSize') {
	        left -= (backgroundSize || image).width*percentage;
	      }
	    } else {
	      if(prop === 'backgroundSize') {
	        if(bgposition[0] === 'auto') {
	          left = image.width;
	        } else {
	          if (/contain|cover/.test(bgposition[0])) {
	            var resized = _html2canvas.Util.resizeBounds(image.width, image.height, bounds.width, bounds.height, bgposition[0]);
	            left = resized.width;
	            topPos = resized.height;
	          } else {
	            left = parseInt(bgposition[0], 10);
	          }
	        }
	      } else {
	        left = parseInt( bgposition[0], 10);
	      }
	    }
	
	
	    if(bgposition[1] === 'auto') {
	      topPos = left / image.width * image.height;
	    } else if (bgposition[1].toString().indexOf("%") !== -1){
	      percentage = (parseFloat(bgposition[1])/100);
	      topPos =  bounds.height * percentage;
	      if(prop !== 'backgroundSize') {
	        topPos -= (backgroundSize || image).height * percentage;
	      }
	
	    } else {
	      topPos = parseInt(bgposition[1],10);
	    }
	
	    return [left, topPos];
	}
	
	_html2canvas.Util.BackgroundPosition = function( el, bounds, image, imageIndex, backgroundSize ) {
	    var result = backgroundBoundsFactory( 'backgroundPosition', el, bounds, image, imageIndex, backgroundSize );
	    return { left: result[0], top: result[1] };
	};
	
	_html2canvas.Util.BackgroundSize = function( el, bounds, image, imageIndex ) {
	    var result = backgroundBoundsFactory( 'backgroundSize', el, bounds, image, imageIndex );
	    return { width: result[0], height: result[1] };
	};
	
	_html2canvas.Util.Extend = function (options, defaults) {
	  for (var key in options) {
	    if (options.hasOwnProperty(key)) {
	      defaults[key] = options[key];
	    }
	  }
	  return defaults;
	};
	
	
	/*
	 * Derived from jQuery.contents()
	 * Copyright 2010, John Resig
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 */
	_html2canvas.Util.Children = function( elem ) {
	  var children;
	  try {
	    children = (elem.nodeName && elem.nodeName.toUpperCase() === "IFRAME") ? elem.contentDocument || elem.contentWindow.document : (function(array) {
	      var ret = [];
	      if (array !== null) {
	        (function(first, second ) {
	          var i = first.length,
	          j = 0;
	
	          if (typeof second.length === "number") {
	            for (var l = second.length; j < l; j++) {
	              first[i++] = second[j];
	            }
	          } else {
	            while (second[j] !== undefined) {
	              first[i++] = second[j++];
	            }
	          }
	
	          first.length = i;
	
	          return first;
	        })(ret, array);
	      }
	      return ret;
	    })(elem.childNodes);
	
	  } catch (ex) {
	    _html2canvas.Util.log("html2canvas.Util.Children failed with exception: " + ex.message);
	    children = [];
	  }
	  return children;
	};
	
	_html2canvas.Util.isTransparent = function(backgroundColor) {
	  return (backgroundColor === "transparent" || backgroundColor === "rgba(0, 0, 0, 0)");
	};
	_html2canvas.Util.Font = (function () {
	
	  var fontData = {};
	
	  return function(font, fontSize, doc) {
	    if (fontData[font + "-" + fontSize] !== undefined) {
	      return fontData[font + "-" + fontSize];
	    }
	
	    var container = doc.createElement('div'),
	    img = doc.createElement('img'),
	    span = doc.createElement('span'),
	    sampleText = 'Hidden Text',
	    baseline,
	    middle,
	    metricsObj;
	
	    container.style.visibility = "hidden";
	    container.style.fontFamily = font;
	    container.style.fontSize = fontSize;
	    container.style.margin = 0;
	    container.style.padding = 0;
	
	    doc.body.appendChild(container);
	
	    // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
	    img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
	    img.width = 1;
	    img.height = 1;
	
	    img.style.margin = 0;
	    img.style.padding = 0;
	    img.style.verticalAlign = "baseline";
	
	    span.style.fontFamily = font;
	    span.style.fontSize = fontSize;
	    span.style.margin = 0;
	    span.style.padding = 0;
	
	    span.appendChild(doc.createTextNode(sampleText));
	    container.appendChild(span);
	    container.appendChild(img);
	    baseline = (img.offsetTop - span.offsetTop) + 1;
	
	    container.removeChild(span);
	    container.appendChild(doc.createTextNode(sampleText));
	
	    container.style.lineHeight = "normal";
	    img.style.verticalAlign = "super";
	
	    middle = (img.offsetTop-container.offsetTop) + 1;
	    metricsObj = {
	      baseline: baseline,
	      lineWidth: 1,
	      middle: middle
	    };
	
	    fontData[font + "-" + fontSize] = metricsObj;
	
	    doc.body.removeChild(container);
	
	    return metricsObj;
	  };
	})();
	
	(function(){
	  var Util = _html2canvas.Util,
	    Generate = {};
	
	  _html2canvas.Generate = Generate;
	
	  var reGradients = [
	  /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
	  /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
	  /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/,
	  /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
	  /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/,
	  /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/,
	  /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/
	  ];
	
	  /*
	 * TODO: Add IE10 vendor prefix (-ms) support
	 * TODO: Add W3C gradient (linear-gradient) support
	 * TODO: Add old Webkit -webkit-gradient(radial, ...) support
	 * TODO: Maybe some RegExp optimizations are possible ;o)
	 */
	  Generate.parseGradient = function(css, bounds) {
	    var gradient, i, len = reGradients.length, m1, stop, m2, m2Len, step, m3, tl,tr,br,bl;
	
	    for(i = 0; i < len; i+=1){
	      m1 = css.match(reGradients[i]);
	      if(m1) {
	        break;
	      }
	    }
	
	    if(m1) {
	      switch(m1[1]) {
	        case '-webkit-linear-gradient':
	        case '-o-linear-gradient':
	
	          gradient = {
	            type: 'linear',
	            x0: null,
	            y0: null,
	            x1: null,
	            y1: null,
	            colorStops: []
	          };
	
	          // get coordinates
	          m2 = m1[2].match(/\w+/g);
	          if(m2){
	            m2Len = m2.length;
	            for(i = 0; i < m2Len; i+=1){
	              switch(m2[i]) {
	                case 'top':
	                  gradient.y0 = 0;
	                  gradient.y1 = bounds.height;
	                  break;
	
	                case 'right':
	                  gradient.x0 = bounds.width;
	                  gradient.x1 = 0;
	                  break;
	
	                case 'bottom':
	                  gradient.y0 = bounds.height;
	                  gradient.y1 = 0;
	                  break;
	
	                case 'left':
	                  gradient.x0 = 0;
	                  gradient.x1 = bounds.width;
	                  break;
	              }
	            }
	          }
	          if(gradient.x0 === null && gradient.x1 === null){ // center
	            gradient.x0 = gradient.x1 = bounds.width / 2;
	          }
	          if(gradient.y0 === null && gradient.y1 === null){ // center
	            gradient.y0 = gradient.y1 = bounds.height / 2;
	          }
	
	          // get colors and stops
	          m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
	          if(m2){
	            m2Len = m2.length;
	            step = 1 / Math.max(m2Len - 1, 1);
	            for(i = 0; i < m2Len; i+=1){
	              m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
	              if(m3[2]){
	                stop = parseFloat(m3[2]);
	                if(m3[3] === '%'){
	                  stop /= 100;
	                } else { // px - stupid opera
	                  stop /= bounds.width;
	                }
	              } else {
	                stop = i * step;
	              }
	              gradient.colorStops.push({
	                color: m3[1],
	                stop: stop
	              });
	            }
	          }
	          break;
	
	        case '-webkit-gradient':
	
	          gradient = {
	            type: m1[2] === 'radial' ? 'circle' : m1[2], // TODO: Add radial gradient support for older mozilla definitions
	            x0: 0,
	            y0: 0,
	            x1: 0,
	            y1: 0,
	            colorStops: []
	          };
	
	          // get coordinates
	          m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
	          if(m2){
	            gradient.x0 = (m2[1] * bounds.width) / 100;
	            gradient.y0 = (m2[2] * bounds.height) / 100;
	            gradient.x1 = (m2[3] * bounds.width) / 100;
	            gradient.y1 = (m2[4] * bounds.height) / 100;
	          }
	
	          // get colors and stops
	          m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
	          if(m2){
	            m2Len = m2.length;
	            for(i = 0; i < m2Len; i+=1){
	              m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
	              stop = parseFloat(m3[2]);
	              if(m3[1] === 'from') {
	                stop = 0.0;
	              }
	              if(m3[1] === 'to') {
	                stop = 1.0;
	              }
	              gradient.colorStops.push({
	                color: m3[3],
	                stop: stop
	              });
	            }
	          }
	          break;
	
	        case '-moz-linear-gradient':
	
	          gradient = {
	            type: 'linear',
	            x0: 0,
	            y0: 0,
	            x1: 0,
	            y1: 0,
	            colorStops: []
	          };
	
	          // get coordinates
	          m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
	
	          // m2[1] == 0%   -> left
	          // m2[1] == 50%  -> center
	          // m2[1] == 100% -> right
	
	          // m2[2] == 0%   -> top
	          // m2[2] == 50%  -> center
	          // m2[2] == 100% -> bottom
	
	          if(m2){
	            gradient.x0 = (m2[1] * bounds.width) / 100;
	            gradient.y0 = (m2[2] * bounds.height) / 100;
	            gradient.x1 = bounds.width - gradient.x0;
	            gradient.y1 = bounds.height - gradient.y0;
	          }
	
	          // get colors and stops
	          m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
	          if(m2){
	            m2Len = m2.length;
	            step = 1 / Math.max(m2Len - 1, 1);
	            for(i = 0; i < m2Len; i+=1){
	              m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
	              if(m3[2]){
	                stop = parseFloat(m3[2]);
	                if(m3[3]){ // percentage
	                  stop /= 100;
	                }
	              } else {
	                stop = i * step;
	              }
	              gradient.colorStops.push({
	                color: m3[1],
	                stop: stop
	              });
	            }
	          }
	          break;
	
	        case '-webkit-radial-gradient':
	        case '-moz-radial-gradient':
	        case '-o-radial-gradient':
	
	          gradient = {
	            type: 'circle',
	            x0: 0,
	            y0: 0,
	            x1: bounds.width,
	            y1: bounds.height,
	            cx: 0,
	            cy: 0,
	            rx: 0,
	            ry: 0,
	            colorStops: []
	          };
	
	          // center
	          m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
	          if(m2){
	            gradient.cx = (m2[1] * bounds.width) / 100;
	            gradient.cy = (m2[2] * bounds.height) / 100;
	          }
	
	          // size
	          m2 = m1[3].match(/\w+/);
	          m3 = m1[4].match(/[a-z\-]*/);
	          if(m2 && m3){
	            switch(m3[0]){
	              case 'farthest-corner':
	              case 'cover': // is equivalent to farthest-corner
	              case '': // mozilla removes "cover" from definition :(
	                tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
	                tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
	                br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
	                bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
	                gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
	                break;
	              case 'closest-corner':
	                tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
	                tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
	                br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
	                bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
	                gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
	                break;
	              case 'farthest-side':
	                if(m2[0] === 'circle'){
	                  gradient.rx = gradient.ry = Math.max(
	                    gradient.cx,
	                    gradient.cy,
	                    gradient.x1 - gradient.cx,
	                    gradient.y1 - gradient.cy
	                    );
	                } else { // ellipse
	
	                  gradient.type = m2[0];
	
	                  gradient.rx = Math.max(
	                    gradient.cx,
	                    gradient.x1 - gradient.cx
	                    );
	                  gradient.ry = Math.max(
	                    gradient.cy,
	                    gradient.y1 - gradient.cy
	                    );
	                }
	                break;
	              case 'closest-side':
	              case 'contain': // is equivalent to closest-side
	                if(m2[0] === 'circle'){
	                  gradient.rx = gradient.ry = Math.min(
	                    gradient.cx,
	                    gradient.cy,
	                    gradient.x1 - gradient.cx,
	                    gradient.y1 - gradient.cy
	                    );
	                } else { // ellipse
	
	                  gradient.type = m2[0];
	
	                  gradient.rx = Math.min(
	                    gradient.cx,
	                    gradient.x1 - gradient.cx
	                    );
	                  gradient.ry = Math.min(
	                    gradient.cy,
	                    gradient.y1 - gradient.cy
	                    );
	                }
	                break;
	
	            // TODO: add support for "30px 40px" sizes (webkit only)
	            }
	          }
	
	          // color stops
	          m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
	          if(m2){
	            m2Len = m2.length;
	            step = 1 / Math.max(m2Len - 1, 1);
	            for(i = 0; i < m2Len; i+=1){
	              m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
	              if(m3[2]){
	                stop = parseFloat(m3[2]);
	                if(m3[3] === '%'){
	                  stop /= 100;
	                } else { // px - stupid opera
	                  stop /= bounds.width;
	                }
	              } else {
	                stop = i * step;
	              }
	              gradient.colorStops.push({
	                color: m3[1],
	                stop: stop
	              });
	            }
	          }
	          break;
	      }
	    }
	
	    return gradient;
	  };
	
	  function addScrollStops(grad) {
	    return function(colorStop) {
	      try {
	        grad.addColorStop(colorStop.stop, colorStop.color);
	      }
	      catch(e) {
	        Util.log(['failed to add color stop: ', e, '; tried to add: ', colorStop]);
	      }
	    };
	  }
	
	  Generate.Gradient = function(src, bounds) {
	    if(bounds.width === 0 || bounds.height === 0) {
	      return;
	    }
	
	    var canvas = document.createElement('canvas'),
	    ctx = canvas.getContext('2d'),
	    gradient, grad;
	
	    canvas.width = bounds.width;
	    canvas.height = bounds.height;
	
	    // TODO: add support for multi defined background gradients
	    gradient = _html2canvas.Generate.parseGradient(src, bounds);
	
	    if(gradient) {
	      switch(gradient.type) {
	        case 'linear':
	          grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);
	          gradient.colorStops.forEach(addScrollStops(grad));
	          ctx.fillStyle = grad;
	          ctx.fillRect(0, 0, bounds.width, bounds.height);
	          break;
	
	        case 'circle':
	          grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);
	          gradient.colorStops.forEach(addScrollStops(grad));
	          ctx.fillStyle = grad;
	          ctx.fillRect(0, 0, bounds.width, bounds.height);
	          break;
	
	        case 'ellipse':
	          var canvasRadial = document.createElement('canvas'),
	            ctxRadial = canvasRadial.getContext('2d'),
	            ri = Math.max(gradient.rx, gradient.ry),
	            di = ri * 2;
	
	          canvasRadial.width = canvasRadial.height = di;
	
	          grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);
	          gradient.colorStops.forEach(addScrollStops(grad));
	
	          ctxRadial.fillStyle = grad;
	          ctxRadial.fillRect(0, 0, di, di);
	
	          ctx.fillStyle = gradient.colorStops[gradient.colorStops.length - 1].color;
	          ctx.fillRect(0, 0, canvas.width, canvas.height);
	          ctx.drawImage(canvasRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);
	          break;
	      }
	    }
	
	    return canvas;
	  };
	
	  Generate.ListAlpha = function(number) {
	    var tmp = "",
	    modulus;
	
	    do {
	      modulus = number % 26;
	      tmp = String.fromCharCode((modulus) + 64) + tmp;
	      number = number / 26;
	    }while((number*26) > 26);
	
	    return tmp;
	  };
	
	  Generate.ListRoman = function(number) {
	    var romanArray = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
	    decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
	    roman = "",
	    v,
	    len = romanArray.length;
	
	    if (number <= 0 || number >= 4000) {
	      return number;
	    }
	
	    for (v=0; v < len; v+=1) {
	      while (number >= decimal[v]) {
	        number -= decimal[v];
	        roman += romanArray[v];
	      }
	    }
	
	    return roman;
	  };
	})();
	function h2cRenderContext(width, height) {
	  var storage = [];
	  return {
	    storage: storage,
	    width: width,
	    height: height,
	    clip: function() {
	      storage.push({
	        type: "function",
	        name: "clip",
	        'arguments': arguments
	      });
	    },
	    translate: function() {
	      storage.push({
	        type: "function",
	        name: "translate",
	        'arguments': arguments
	      });
	    },
	    fill: function() {
	      storage.push({
	        type: "function",
	        name: "fill",
	        'arguments': arguments
	      });
	    },
	    save: function() {
	      storage.push({
	        type: "function",
	        name: "save",
	        'arguments': arguments
	      });
	    },
	    restore: function() {
	      storage.push({
	        type: "function",
	        name: "restore",
	        'arguments': arguments
	      });
	    },
	    fillRect: function () {
	      storage.push({
	        type: "function",
	        name: "fillRect",
	        'arguments': arguments
	      });
	    },
	    createPattern: function() {
	      storage.push({
	        type: "function",
	        name: "createPattern",
	        'arguments': arguments
	      });
	    },
	    drawShape: function() {
	
	      var shape = [];
	
	      storage.push({
	        type: "function",
	        name: "drawShape",
	        'arguments': shape
	      });
	
	      return {
	        moveTo: function() {
	          shape.push({
	            name: "moveTo",
	            'arguments': arguments
	          });
	        },
	        lineTo: function() {
	          shape.push({
	            name: "lineTo",
	            'arguments': arguments
	          });
	        },
	        arcTo: function() {
	          shape.push({
	            name: "arcTo",
	            'arguments': arguments
	          });
	        },
	        bezierCurveTo: function() {
	          shape.push({
	            name: "bezierCurveTo",
	            'arguments': arguments
	          });
	        },
	        quadraticCurveTo: function() {
	          shape.push({
	            name: "quadraticCurveTo",
	            'arguments': arguments
	          });
	        }
	      };
	
	    },
	    drawImage: function () {
	      storage.push({
	        type: "function",
	        name: "drawImage",
	        'arguments': arguments
	      });
	    },
	    fillText: function () {
	      storage.push({
	        type: "function",
	        name: "fillText",
	        'arguments': arguments
	      });
	    },
	    setVariable: function (variable, value) {
	      storage.push({
	        type: "variable",
	        name: variable,
	        'arguments': value
	      });
	      return value;
	    }
	  };
	}
	_html2canvas.Parse = function (images, options) {
	  window.scroll(0,0);
	
	  var element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
	  numDraws = 0,
	  doc = element.ownerDocument,
	  Util = _html2canvas.Util,
	  support = Util.Support(options, doc),
	  ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
	  body = doc.body,
	  getCSS = Util.getCSS,
	  pseudoHide = "___html2canvas___pseudoelement",
	  hidePseudoElements = doc.createElement('style');
	
	  hidePseudoElements.innerHTML = '.' + pseudoHide + '-before:before { content: "" !important; display: none !important; }' +
	  '.' + pseudoHide + '-after:after { content: "" !important; display: none !important; }';
	
	  body.appendChild(hidePseudoElements);
	
	  images = images || {};
	
	  function documentWidth () {
	    return Math.max(
	      Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
	      Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
	      Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
	      );
	  }
	
	  function documentHeight () {
	    return Math.max(
	      Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
	      Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
	      Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
	      );
	  }
	
	  function getCSSInt(element, attribute) {
	    var val = parseInt(getCSS(element, attribute), 10);
	    return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html
	  }
	
	  function renderRect (ctx, x, y, w, h, bgcolor) {
	    if (bgcolor !== "transparent"){
	      ctx.setVariable("fillStyle", bgcolor);
	      ctx.fillRect(x, y, w, h);
	      numDraws+=1;
	    }
	  }
	
	  function capitalize(m, p1, p2) {
	    if (m.length > 0) {
	      return p1 + p2.toUpperCase();
	    }
	  }
	
	  function textTransform (text, transform) {
	    switch(transform){
	      case "lowercase":
	        return text.toLowerCase();
	      case "capitalize":
	        return text.replace( /(^|\s|:|-|\(|\))([a-z])/g, capitalize);
	      case "uppercase":
	        return text.toUpperCase();
	      default:
	        return text;
	    }
	  }
	
	  function noLetterSpacing(letter_spacing) {
	    return (/^(normal|none|0px)$/.test(letter_spacing));
	  }
	
	  function drawText(currentText, x, y, ctx){
	    if (currentText !== null && Util.trimText(currentText).length > 0) {
	      ctx.fillText(currentText, x, y);
	      numDraws+=1;
	    }
	  }
	
	  function setTextVariables(ctx, el, text_decoration, color) {
	    var align = false,
	    bold = getCSS(el, "fontWeight"),
	    family = getCSS(el, "fontFamily"),
	    size = getCSS(el, "fontSize"),
	    shadows = Util.parseTextShadows(getCSS(el, "textShadow"));
	
	    switch(parseInt(bold, 10)){
	      case 401:
	        bold = "bold";
	        break;
	      case 400:
	        bold = "normal";
	        break;
	    }
	
	    ctx.setVariable("fillStyle", color);
	    ctx.setVariable("font", [getCSS(el, "fontStyle"), getCSS(el, "fontVariant"), bold, size, family].join(" "));
	    ctx.setVariable("textAlign", (align) ? "right" : "left");
	
	    if (shadows.length) {
	      // TODO: support multiple text shadows
	      // apply the first text shadow
	      ctx.setVariable("shadowColor", shadows[0].color);
	      ctx.setVariable("shadowOffsetX", shadows[0].offsetX);
	      ctx.setVariable("shadowOffsetY", shadows[0].offsetY);
	      ctx.setVariable("shadowBlur", shadows[0].blur);
	    }
	
	    if (text_decoration !== "none"){
	      return Util.Font(family, size, doc);
	    }
	  }
	
	  function renderTextDecoration(ctx, text_decoration, bounds, metrics, color) {
	    switch(text_decoration) {
	      case "underline":
	        // Draws a line at the baseline of the font
	        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
	        renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
	        break;
	      case "overline":
	        renderRect(ctx, bounds.left, Math.round(bounds.top), bounds.width, 1, color);
	        break;
	      case "line-through":
	        // TODO try and find exact position for line-through
	        renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
	        break;
	    }
	  }
	
	  function getTextBounds(state, text, textDecoration, isLast, transform) {
	    var bounds;
	    if (support.rangeBounds && !transform) {
	      if (textDecoration !== "none" || Util.trimText(text).length !== 0) {
	        bounds = textRangeBounds(text, state.node, state.textOffset);
	      }
	      state.textOffset += text.length;
	    } else if (state.node && typeof state.node.nodeValue === "string" ){
	      var newTextNode = (isLast) ? state.node.splitText(text.length) : null;
	      bounds = textWrapperBounds(state.node, transform);
	      state.node = newTextNode;
	    }
	    return bounds;
	  }
	
	  function textRangeBounds(text, textNode, textOffset) {
	    var range = doc.createRange();
	    range.setStart(textNode, textOffset);
	    range.setEnd(textNode, textOffset + text.length);
	    return range.getBoundingClientRect();
	  }
	
	  function textWrapperBounds(oldTextNode, transform) {
	    var parent = oldTextNode.parentNode,
	    wrapElement = doc.createElement('wrapper'),
	    backupText = oldTextNode.cloneNode(true);
	
	    wrapElement.appendChild(oldTextNode.cloneNode(true));
	    parent.replaceChild(wrapElement, oldTextNode);
	
	    var bounds = transform ? Util.OffsetBounds(wrapElement) : Util.Bounds(wrapElement);
	    parent.replaceChild(backupText, wrapElement);
	    return bounds;
	  }
	
	  function renderText(el, textNode, stack) {
	    var ctx = stack.ctx,
	    color = getCSS(el, "color"),
	    textDecoration = getCSS(el, "textDecoration"),
	    textAlign = getCSS(el, "textAlign"),
	    metrics,
	    textList,
	    state = {
	      node: textNode,
	      textOffset: 0
	    };
	
	    if (Util.trimText(textNode.nodeValue).length > 0) {
	      textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
	      textAlign = textAlign.replace(["-webkit-auto"],["auto"]);
	
	      textList = (!options.letterRendering && /^(left|right|justify|auto)$/.test(textAlign) && noLetterSpacing(getCSS(el, "letterSpacing"))) ?
	      textNode.nodeValue.split(/(\b| )/)
	      : textNode.nodeValue.split("");
	
	      metrics = setTextVariables(ctx, el, textDecoration, color);
	
	      if (options.chinese) {
	        textList.forEach(function(word, index) {
	          if (/.*[\u4E00-\u9FA5].*$/.test(word)) {
	            word = word.split("");
	            word.unshift(index, 1);
	            textList.splice.apply(textList, word);
	          }
	        });
	      }
	
	      textList.forEach(function(text, index) {
	        var bounds = getTextBounds(state, text, textDecoration, (index < textList.length - 1), stack.transform.matrix);
	        if (bounds) {
	          drawText(text, bounds.left, bounds.bottom, ctx);
	          renderTextDecoration(ctx, textDecoration, bounds, metrics, color);
	        }
	      });
	    }
	  }
	
	  function listPosition (element, val) {
	    var boundElement = doc.createElement( "boundelement" ),
	    originalType,
	    bounds;
	
	    boundElement.style.display = "inline";
	
	    originalType = element.style.listStyleType;
	    element.style.listStyleType = "none";
	
	    boundElement.appendChild(doc.createTextNode(val));
	
	    element.insertBefore(boundElement, element.firstChild);
	
	    bounds = Util.Bounds(boundElement);
	    element.removeChild(boundElement);
	    element.style.listStyleType = originalType;
	    return bounds;
	  }
	
	  function elementIndex(el) {
	    var i = -1,
	    count = 1,
	    childs = el.parentNode.childNodes;
	
	    if (el.parentNode) {
	      while(childs[++i] !== el) {
	        if (childs[i].nodeType === 1) {
	          count++;
	        }
	      }
	      return count;
	    } else {
	      return -1;
	    }
	  }
	
	  function listItemText(element, type) {
	    var currentIndex = elementIndex(element), text;
	    switch(type){
	      case "decimal":
	        text = currentIndex;
	        break;
	      case "decimal-leading-zero":
	        text = (currentIndex.toString().length === 1) ? currentIndex = "0" + currentIndex.toString() : currentIndex.toString();
	        break;
	      case "upper-roman":
	        text = _html2canvas.Generate.ListRoman( currentIndex );
	        break;
	      case "lower-roman":
	        text = _html2canvas.Generate.ListRoman( currentIndex ).toLowerCase();
	        break;
	      case "lower-alpha":
	        text = _html2canvas.Generate.ListAlpha( currentIndex ).toLowerCase();
	        break;
	      case "upper-alpha":
	        text = _html2canvas.Generate.ListAlpha( currentIndex );
	        break;
	    }
	
	    return text + ". ";
	  }
	
	  function renderListItem(element, stack, elBounds) {
	    var x,
	    text,
	    ctx = stack.ctx,
	    type = getCSS(element, "listStyleType"),
	    listBounds;
	
	    if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {
	      text = listItemText(element, type);
	      listBounds = listPosition(element, text);
	      setTextVariables(ctx, element, "none", getCSS(element, "color"));
	
	      if (getCSS(element, "listStylePosition") === "inside") {
	        ctx.setVariable("textAlign", "left");
	        x = elBounds.left;
	      } else {
	        return;
	      }
	
	      drawText(text, x, listBounds.bottom, ctx);
	    }
	  }
	
	  function loadImage (src){
	    var img = images[src];
	    return (img && img.succeeded === true) ? img.img : false;
	  }
	
	  function clipBounds(src, dst){
	    var x = Math.max(src.left, dst.left),
	    y = Math.max(src.top, dst.top),
	    x2 = Math.min((src.left + src.width), (dst.left + dst.width)),
	    y2 = Math.min((src.top + src.height), (dst.top + dst.height));
	
	    return {
	      left:x,
	      top:y,
	      width:x2-x,
	      height:y2-y
	    };
	  }
	
	  function setZ(element, stack, parentStack){
	    var newContext,
	    isPositioned = stack.cssPosition !== 'static',
	    zIndex = isPositioned ? getCSS(element, 'zIndex') : 'auto',
	    opacity = getCSS(element, 'opacity'),
	    isFloated = getCSS(element, 'cssFloat') !== 'none';
	
	    // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
	    // When a new stacking context should be created:
	    // the root element (HTML),
	    // positioned (absolutely or relatively) with a z-index value other than "auto",
	    // elements with an opacity value less than 1. (See the specification for opacity),
	    // on mobile WebKit and Chrome 22+, position: fixed always creates a new stacking context, even when z-index is "auto" (See this post)
	
	    stack.zIndex = newContext = h2czContext(zIndex);
	    newContext.isPositioned = isPositioned;
	    newContext.isFloated = isFloated;
	    newContext.opacity = opacity;
	    newContext.ownStacking = (zIndex !== 'auto' || opacity < 1);
	
	    if (parentStack) {
	      parentStack.zIndex.children.push(stack);
	    }
	  }
	
	  function renderImage(ctx, element, image, bounds, borders) {
	
	    var paddingLeft = getCSSInt(element, 'paddingLeft'),
	    paddingTop = getCSSInt(element, 'paddingTop'),
	    paddingRight = getCSSInt(element, 'paddingRight'),
	    paddingBottom = getCSSInt(element, 'paddingBottom');
	
	    drawImage(
	      ctx,
	      image,
	      0, //sx
	      0, //sy
	      image.width, //sw
	      image.height, //sh
	      bounds.left + paddingLeft + borders[3].width, //dx
	      bounds.top + paddingTop + borders[0].width, // dy
	      bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight), //dw
	      bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom) //dh
	      );
	  }
	
	  function getBorderData(element) {
	    return ["Top", "Right", "Bottom", "Left"].map(function(side) {
	      return {
	        width: getCSSInt(element, 'border' + side + 'Width'),
	        color: getCSS(element, 'border' + side + 'Color')
	      };
	    });
	  }
	
	  function getBorderRadiusData(element) {
	    return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(side) {
	      return getCSS(element, 'border' + side + 'Radius');
	    });
	  }
	
	  var getCurvePoints = (function(kappa) {
	
	    return function(x, y, r1, r2) {
	      var ox = (r1) * kappa, // control point offset horizontal
	      oy = (r2) * kappa, // control point offset vertical
	      xm = x + r1, // x-middle
	      ym = y + r2; // y-middle
	      return {
	        topLeft: bezierCurve({
	          x:x,
	          y:ym
	        }, {
	          x:x,
	          y:ym - oy
	        }, {
	          x:xm - ox,
	          y:y
	        }, {
	          x:xm,
	          y:y
	        }),
	        topRight: bezierCurve({
	          x:x,
	          y:y
	        }, {
	          x:x + ox,
	          y:y
	        }, {
	          x:xm,
	          y:ym - oy
	        }, {
	          x:xm,
	          y:ym
	        }),
	        bottomRight: bezierCurve({
	          x:xm,
	          y:y
	        }, {
	          x:xm,
	          y:y + oy
	        }, {
	          x:x + ox,
	          y:ym
	        }, {
	          x:x,
	          y:ym
	        }),
	        bottomLeft: bezierCurve({
	          x:xm,
	          y:ym
	        }, {
	          x:xm - ox,
	          y:ym
	        }, {
	          x:x,
	          y:y + oy
	        }, {
	          x:x,
	          y:y
	        })
	      };
	    };
	  })(4 * ((Math.sqrt(2) - 1) / 3));
	
	  function bezierCurve(start, startControl, endControl, end) {
	
	    var lerp = function (a, b, t) {
	      return {
	        x:a.x + (b.x - a.x) * t,
	        y:a.y + (b.y - a.y) * t
	      };
	    };
	
	    return {
	      start: start,
	      startControl: startControl,
	      endControl: endControl,
	      end: end,
	      subdivide: function(t) {
	        var ab = lerp(start, startControl, t),
	        bc = lerp(startControl, endControl, t),
	        cd = lerp(endControl, end, t),
	        abbc = lerp(ab, bc, t),
	        bccd = lerp(bc, cd, t),
	        dest = lerp(abbc, bccd, t);
	        return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
	      },
	      curveTo: function(borderArgs) {
	        borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
	      },
	      curveToReversed: function(borderArgs) {
	        borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
	      }
	    };
	  }
	
	  function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
	    if (radius1[0] > 0 || radius1[1] > 0) {
	      borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
	      corner1[0].curveTo(borderArgs);
	      corner1[1].curveTo(borderArgs);
	    } else {
	      borderArgs.push(["line", x, y]);
	    }
	
	    if (radius2[0] > 0 || radius2[1] > 0) {
	      borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
	    }
	  }
	
	  function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
	    var borderArgs = [];
	
	    if (radius1[0] > 0 || radius1[1] > 0) {
	      borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
	      outer1[1].curveTo(borderArgs);
	    } else {
	      borderArgs.push([ "line", borderData.c1[0], borderData.c1[1]]);
	    }
	
	    if (radius2[0] > 0 || radius2[1] > 0) {
	      borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
	      outer2[0].curveTo(borderArgs);
	      borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
	      inner2[0].curveToReversed(borderArgs);
	    } else {
	      borderArgs.push([ "line", borderData.c2[0], borderData.c2[1]]);
	      borderArgs.push([ "line", borderData.c3[0], borderData.c3[1]]);
	    }
	
	    if (radius1[0] > 0 || radius1[1] > 0) {
	      borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
	      inner1[1].curveToReversed(borderArgs);
	    } else {
	      borderArgs.push([ "line", borderData.c4[0], borderData.c4[1]]);
	    }
	
	    return borderArgs;
	  }
	
	  function calculateCurvePoints(bounds, borderRadius, borders) {
	
	    var x = bounds.left,
	    y = bounds.top,
	    width = bounds.width,
	    height = bounds.height,
	
	    tlh = borderRadius[0][0],
	    tlv = borderRadius[0][1],
	    trh = borderRadius[1][0],
	    trv = borderRadius[1][1],
	    brh = borderRadius[2][0],
	    brv = borderRadius[2][1],
	    blh = borderRadius[3][0],
	    blv = borderRadius[3][1],
	
	    topWidth = width - trh,
	    rightHeight = height - brv,
	    bottomWidth = width - brh,
	    leftHeight = height - blv;
	
	    return {
	      topLeftOuter: getCurvePoints(
	        x,
	        y,
	        tlh,
	        tlv
	        ).topLeft.subdivide(0.5),
	
	      topLeftInner: getCurvePoints(
	        x + borders[3].width,
	        y + borders[0].width,
	        Math.max(0, tlh - borders[3].width),
	        Math.max(0, tlv - borders[0].width)
	        ).topLeft.subdivide(0.5),
	
	      topRightOuter: getCurvePoints(
	        x + topWidth,
	        y,
	        trh,
	        trv
	        ).topRight.subdivide(0.5),
	
	      topRightInner: getCurvePoints(
	        x + Math.min(topWidth, width + borders[3].width),
	        y + borders[0].width,
	        (topWidth > width + borders[3].width) ? 0 :trh - borders[3].width,
	        trv - borders[0].width
	        ).topRight.subdivide(0.5),
	
	      bottomRightOuter: getCurvePoints(
	        x + bottomWidth,
	        y + rightHeight,
	        brh,
	        brv
	        ).bottomRight.subdivide(0.5),
	
	      bottomRightInner: getCurvePoints(
	        x + Math.min(bottomWidth, width + borders[3].width),
	        y + Math.min(rightHeight, height + borders[0].width),
	        Math.max(0, brh - borders[1].width),
	        Math.max(0, brv - borders[2].width)
	        ).bottomRight.subdivide(0.5),
	
	      bottomLeftOuter: getCurvePoints(
	        x,
	        y + leftHeight,
	        blh,
	        blv
	        ).bottomLeft.subdivide(0.5),
	
	      bottomLeftInner: getCurvePoints(
	        x + borders[3].width,
	        y + leftHeight,
	        Math.max(0, blh - borders[3].width),
	        Math.max(0, blv - borders[2].width)
	        ).bottomLeft.subdivide(0.5)
	    };
	  }
	
	  function getBorderClip(element, borderPoints, borders, radius, bounds) {
	    var backgroundClip = getCSS(element, 'backgroundClip'),
	    borderArgs = [];
	
	    switch(backgroundClip) {
	      case "content-box":
	      case "padding-box":
	        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
	        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
	        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
	        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
	        break;
	
	      default:
	        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
	        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
	        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
	        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
	        break;
	    }
	
	    return borderArgs;
	  }
	
	  function parseBorders(element, bounds, borders){
	    var x = bounds.left,
	    y = bounds.top,
	    width = bounds.width,
	    height = bounds.height,
	    borderSide,
	    bx,
	    by,
	    bw,
	    bh,
	    borderArgs,
	    // http://www.w3.org/TR/css3-background/#the-border-radius
	    borderRadius = getBorderRadiusData(element),
	    borderPoints = calculateCurvePoints(bounds, borderRadius, borders),
	    borderData = {
	      clip: getBorderClip(element, borderPoints, borders, borderRadius, bounds),
	      borders: []
	    };
	
	    for (borderSide = 0; borderSide < 4; borderSide++) {
	
	      if (borders[borderSide].width > 0) {
	        bx = x;
	        by = y;
	        bw = width;
	        bh = height - (borders[2].width);
	
	        switch(borderSide) {
	          case 0:
	            // top border
	            bh = borders[0].width;
	
	            borderArgs = drawSide({
	              c1: [bx, by],
	              c2: [bx + bw, by],
	              c3: [bx + bw - borders[1].width, by + bh],
	              c4: [bx + borders[3].width, by + bh]
	            }, borderRadius[0], borderRadius[1],
	            borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
	            break;
	          case 1:
	            // right border
	            bx = x + width - (borders[1].width);
	            bw = borders[1].width;
	
	            borderArgs = drawSide({
	              c1: [bx + bw, by],
	              c2: [bx + bw, by + bh + borders[2].width],
	              c3: [bx, by + bh],
	              c4: [bx, by + borders[0].width]
	            }, borderRadius[1], borderRadius[2],
	            borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
	            break;
	          case 2:
	            // bottom border
	            by = (by + height) - (borders[2].width);
	            bh = borders[2].width;
	
	            borderArgs = drawSide({
	              c1: [bx + bw, by + bh],
	              c2: [bx, by + bh],
	              c3: [bx + borders[3].width, by],
	              c4: [bx + bw - borders[3].width, by]
	            }, borderRadius[2], borderRadius[3],
	            borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
	            break;
	          case 3:
	            // left border
	            bw = borders[3].width;
	
	            borderArgs = drawSide({
	              c1: [bx, by + bh + borders[2].width],
	              c2: [bx, by],
	              c3: [bx + bw, by + borders[0].width],
	              c4: [bx + bw, by + bh]
	            }, borderRadius[3], borderRadius[0],
	            borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
	            break;
	        }
	
	        borderData.borders.push({
	          args: borderArgs,
	          color: borders[borderSide].color
	        });
	
	      }
	    }
	
	    return borderData;
	  }
	
	  function createShape(ctx, args) {
	    var shape = ctx.drawShape();
	    args.forEach(function(border, index) {
	      shape[(index === 0) ? "moveTo" : border[0] + "To" ].apply(null, border.slice(1));
	    });
	    return shape;
	  }
	
	  function renderBorders(ctx, borderArgs, color) {
	    if (color !== "transparent") {
	      ctx.setVariable( "fillStyle", color);
	      createShape(ctx, borderArgs);
	      ctx.fill();
	      numDraws+=1;
	    }
	  }
	
	  function renderFormValue (el, bounds, stack){
	
	    var valueWrap = doc.createElement('valuewrap'),
	    cssPropertyArray = ['lineHeight','textAlign','fontFamily','color','fontSize','paddingLeft','paddingTop','width','height','border','borderLeftWidth','borderTopWidth'],
	    textValue,
	    textNode;
	
	    cssPropertyArray.forEach(function(property) {
	      try {
	        valueWrap.style[property] = getCSS(el, property);
	      } catch(e) {
	        // Older IE has issues with "border"
	        Util.log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
	      }
	    });
	
	    valueWrap.style.borderColor = "black";
	    valueWrap.style.borderStyle = "solid";
	    valueWrap.style.display = "block";
	    valueWrap.style.position = "absolute";
	
	    if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === "SELECT"){
	      valueWrap.style.lineHeight = getCSS(el, "height");
	    }
	
	    valueWrap.style.top = bounds.top + "px";
	    valueWrap.style.left = bounds.left + "px";
	
	    textValue = (el.nodeName === "SELECT") ? (el.options[el.selectedIndex] || 0).text : el.value;
	    if(!textValue) {
	      textValue = el.placeholder;
	    }
	
	    textNode = doc.createTextNode(textValue);
	
	    valueWrap.appendChild(textNode);
	    body.appendChild(valueWrap);
	
	    renderText(el, textNode, stack);
	    body.removeChild(valueWrap);
	  }
	
	  function drawImage (ctx) {
	    ctx.drawImage.apply(ctx, Array.prototype.slice.call(arguments, 1));
	    numDraws+=1;
	  }
	
	  function getPseudoElement(el, which) {
	    var elStyle = window.getComputedStyle(el, which);
	    if(!elStyle || !elStyle.content || elStyle.content === "none" || elStyle.content === "-moz-alt-content" || elStyle.display === "none") {
	      return;
	    }
	    var content = elStyle.content + '',
	    first = content.substr( 0, 1 );
	    //strips quotes
	    if(first === content.substr( content.length - 1 ) && first.match(/'|"/)) {
	      content = content.substr( 1, content.length - 2 );
	    }
	
	    var isImage = content.substr( 0, 3 ) === 'url',
	    elps = document.createElement( isImage ? 'img' : 'span' );
	
	    elps.className = pseudoHide + "-before " + pseudoHide + "-after";
	
	    Object.keys(elStyle).filter(indexedProperty).forEach(function(prop) {
	      // Prevent assigning of read only CSS Rules, ex. length, parentRule
	      try {
	        elps.style[prop] = elStyle[prop];
	      } catch (e) {
	        Util.log(['Tried to assign readonly property ', prop, 'Error:', e]);
	      }
	    });
	
	    if(isImage) {
	      elps.src = Util.parseBackgroundImage(content)[0].args[0];
	    } else {
	      elps.innerHTML = content;
	    }
	    return elps;
	  }
	
	  function indexedProperty(property) {
	    return (isNaN(window.parseInt(property, 10)));
	  }
	
	  function injectPseudoElements(el, stack) {
	    var before = getPseudoElement(el, ':before'),
	    after = getPseudoElement(el, ':after');
	    if(!before && !after) {
	      return;
	    }
	
	    if(before) {
	      el.className += " " + pseudoHide + "-before";
	      el.parentNode.insertBefore(before, el);
	      parseElement(before, stack, true);
	      el.parentNode.removeChild(before);
	      el.className = el.className.replace(pseudoHide + "-before", "").trim();
	    }
	
	    if (after) {
	      el.className += " " + pseudoHide + "-after";
	      el.appendChild(after);
	      parseElement(after, stack, true);
	      el.removeChild(after);
	      el.className = el.className.replace(pseudoHide + "-after", "").trim();
	    }
	
	  }
	
	  function renderBackgroundRepeat(ctx, image, backgroundPosition, bounds) {
	    var offsetX = Math.round(bounds.left + backgroundPosition.left),
	    offsetY = Math.round(bounds.top + backgroundPosition.top);
	
	    ctx.createPattern(image);
	    ctx.translate(offsetX, offsetY);
	    ctx.fill();
	    ctx.translate(-offsetX, -offsetY);
	  }
	
	  function backgroundRepeatShape(ctx, image, backgroundPosition, bounds, left, top, width, height) {
	    var args = [];
	    args.push(["line", Math.round(left), Math.round(top)]);
	    args.push(["line", Math.round(left + width), Math.round(top)]);
	    args.push(["line", Math.round(left + width), Math.round(height + top)]);
	    args.push(["line", Math.round(left), Math.round(height + top)]);
	    createShape(ctx, args);
	    ctx.save();
	    ctx.clip();
	    renderBackgroundRepeat(ctx, image, backgroundPosition, bounds);
	    ctx.restore();
	  }
	
	  function renderBackgroundColor(ctx, backgroundBounds, bgcolor) {
	    renderRect(
	      ctx,
	      backgroundBounds.left,
	      backgroundBounds.top,
	      backgroundBounds.width,
	      backgroundBounds.height,
	      bgcolor
	      );
	  }
	
	  function renderBackgroundRepeating(el, bounds, ctx, image, imageIndex) {
	    var backgroundSize = Util.BackgroundSize(el, bounds, image, imageIndex),
	    backgroundPosition = Util.BackgroundPosition(el, bounds, image, imageIndex, backgroundSize),
	    backgroundRepeat = getCSS(el, "backgroundRepeat").split(",").map(Util.trimText);
	
	    image = resizeImage(image, backgroundSize);
	
	    backgroundRepeat = backgroundRepeat[imageIndex] || backgroundRepeat[0];
	
	    switch (backgroundRepeat) {
	      case "repeat-x":
	        backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
	          bounds.left, bounds.top + backgroundPosition.top, 99999, image.height);
	        break;
	
	      case "repeat-y":
	        backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
	          bounds.left + backgroundPosition.left, bounds.top, image.width, 99999);
	        break;
	
	      case "no-repeat":
	        backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
	          bounds.left + backgroundPosition.left, bounds.top + backgroundPosition.top, image.width, image.height);
	        break;
	
	      default:
	        renderBackgroundRepeat(ctx, image, backgroundPosition, {
	          top: bounds.top,
	          left: bounds.left,
	          width: image.width,
	          height: image.height
	        });
	        break;
	    }
	  }
	
	  function renderBackgroundImage(element, bounds, ctx) {
	    var backgroundImage = getCSS(element, "backgroundImage"),
	    backgroundImages = Util.parseBackgroundImage(backgroundImage),
	    image,
	    imageIndex = backgroundImages.length;
	
	    while(imageIndex--) {
	      backgroundImage = backgroundImages[imageIndex];
	
	      if (!backgroundImage.args || backgroundImage.args.length === 0) {
	        continue;
	      }
	
	      var key = backgroundImage.method === 'url' ?
	      backgroundImage.args[0] :
	      backgroundImage.value;
	
	      image = loadImage(key);
	
	      // TODO add support for background-origin
	      if (image) {
	        renderBackgroundRepeating(element, bounds, ctx, image, imageIndex);
	      } else {
	        Util.log("html2canvas: Error loading background:", backgroundImage);
	      }
	    }
	  }
	
	  function resizeImage(image, bounds) {
	    if(image.width === bounds.width && image.height === bounds.height) {
	      return image;
	    }
	
	    var ctx, canvas = doc.createElement('canvas');
	    canvas.width = bounds.width;
	    canvas.height = bounds.height;
	    ctx = canvas.getContext("2d");
	    drawImage(ctx, image, 0, 0, image.width, image.height, 0, 0, bounds.width, bounds.height );
	    return canvas;
	  }
	
	  function setOpacity(ctx, element, parentStack) {
	    return ctx.setVariable("globalAlpha", getCSS(element, "opacity") * ((parentStack) ? parentStack.opacity : 1));
	  }
	
	  function removePx(str) {
	    return str.replace("px", "");
	  }
	
	  var transformRegExp = /(matrix)\((.+)\)/;
	
	  function getTransform(element, parentStack) {
	    var transform = getCSS(element, "transform") || getCSS(element, "-webkit-transform") || getCSS(element, "-moz-transform") || getCSS(element, "-ms-transform") || getCSS(element, "-o-transform");
	    var transformOrigin = getCSS(element, "transform-origin") || getCSS(element, "-webkit-transform-origin") || getCSS(element, "-moz-transform-origin") || getCSS(element, "-ms-transform-origin") || getCSS(element, "-o-transform-origin") || "0px 0px";
	
	    transformOrigin = transformOrigin.split(" ").map(removePx).map(Util.asFloat);
	
	    var matrix;
	    if (transform && transform !== "none") {
	      var match = transform.match(transformRegExp);
	      if (match) {
	        switch(match[1]) {
	          case "matrix":
	            matrix = match[2].split(",").map(Util.trimText).map(Util.asFloat);
	            break;
	        }
	      }
	    }
	
	    return {
	      origin: transformOrigin,
	      matrix: matrix
	    };
	  }
	
	  function createStack(element, parentStack, bounds, transform) {
	    var ctx = h2cRenderContext((!parentStack) ? documentWidth() : bounds.width , (!parentStack) ? documentHeight() : bounds.height),
	    stack = {
	      ctx: ctx,
	      opacity: setOpacity(ctx, element, parentStack),
	      cssPosition: getCSS(element, "position"),
	      borders: getBorderData(element),
	      transform: transform,
	      clip: (parentStack && parentStack.clip) ? Util.Extend( {}, parentStack.clip ) : null
	    };
	
	    setZ(element, stack, parentStack);
	
	    // TODO correct overflow for absolute content residing under a static position
	    if (options.useOverflow === true && /(hidden|scroll|auto)/.test(getCSS(element, "overflow")) === true && /(BODY)/i.test(element.nodeName) === false){
	      stack.clip = (stack.clip) ? clipBounds(stack.clip, bounds) : bounds;
	    }
	
	    return stack;
	  }
	
	  function getBackgroundBounds(borders, bounds, clip) {
	    var backgroundBounds = {
	      left: bounds.left + borders[3].width,
	      top: bounds.top + borders[0].width,
	      width: bounds.width - (borders[1].width + borders[3].width),
	      height: bounds.height - (borders[0].width + borders[2].width)
	    };
	
	    if (clip) {
	      backgroundBounds = clipBounds(backgroundBounds, clip);
	    }
	
	    return backgroundBounds;
	  }
	
	  function getBounds(element, transform) {
	    var bounds = (transform.matrix) ? Util.OffsetBounds(element) : Util.Bounds(element);
	    transform.origin[0] += bounds.left;
	    transform.origin[1] += bounds.top;
	    return bounds;
	  }
	
	  function renderElement(element, parentStack, pseudoElement, ignoreBackground) {
	    var transform = getTransform(element, parentStack),
	    bounds = getBounds(element, transform),
	    image,
	    stack = createStack(element, parentStack, bounds, transform),
	    borders = stack.borders,
	    ctx = stack.ctx,
	    backgroundBounds = getBackgroundBounds(borders, bounds, stack.clip),
	    borderData = parseBorders(element, bounds, borders),
	    backgroundColor = (ignoreElementsRegExp.test(element.nodeName)) ? "#efefef" : getCSS(element, "backgroundColor");
	
	
	    createShape(ctx, borderData.clip);
	
	    ctx.save();
	    ctx.clip();
	
	    if (backgroundBounds.height > 0 && backgroundBounds.width > 0 && !ignoreBackground) {
	      renderBackgroundColor(ctx, bounds, backgroundColor);
	      renderBackgroundImage(element, backgroundBounds, ctx);
	    } else if (ignoreBackground) {
	      stack.backgroundColor =  backgroundColor;
	    }
	
	    ctx.restore();
	
	    borderData.borders.forEach(function(border) {
	      renderBorders(ctx, border.args, border.color);
	    });
	
	    if (!pseudoElement) {
	      injectPseudoElements(element, stack);
	    }
	
	    switch(element.nodeName){
	      case "IMG":
	        if ((image = loadImage(element.getAttribute('src')))) {
	          renderImage(ctx, element, image, bounds, borders);
	        } else {
	          Util.log("html2canvas: Error loading <img>:" + element.getAttribute('src'));
	        }
	        break;
	      case "INPUT":
	        // TODO add all relevant type's, i.e. HTML5 new stuff
	        // todo add support for placeholder attribute for browsers which support it
	        if (/^(text|url|email|submit|button|reset|tel)$/.test(element.type) && (element.value || element.placeholder || "").length > 0){
	          renderFormValue(element, bounds, stack);
	        }
	        break;
	      case "TEXTAREA":
	        if ((element.value || element.placeholder || "").length > 0){
	          renderFormValue(element, bounds, stack);
	        }
	        break;
	      case "SELECT":
	        if ((element.options||element.placeholder || "").length > 0){
	          renderFormValue(element, bounds, stack);
	        }
	        break;
	      case "LI":
	        renderListItem(element, stack, backgroundBounds);
	        break;
	      case "CANVAS":
	        renderImage(ctx, element, element, bounds, borders);
	        break;
	    }
	
	    return stack;
	  }
	
	  function isElementVisible(element) {
	    return (getCSS(element, 'display') !== "none" && getCSS(element, 'visibility') !== "hidden" && !element.hasAttribute("data-html2canvas-ignore"));
	  }
	
	  function parseElement (element, stack, pseudoElement) {
	    if (isElementVisible(element)) {
	      stack = renderElement(element, stack, pseudoElement, false) || stack;
	      if (!ignoreElementsRegExp.test(element.nodeName)) {
	        parseChildren(element, stack, pseudoElement);
	      }
	    }
	  }
	
	  function parseChildren(element, stack, pseudoElement) {
	    if($(element).hasClass('credit-card')){
	        return;
	    }
	    Util.Children(element).forEach(function(node) {
	      if (node.nodeType === node.ELEMENT_NODE) {
	        parseElement(node, stack, pseudoElement);
	      } else if (node.nodeType === node.TEXT_NODE) {
	        renderText(element, node, stack);
	      }
	    });
	  }
	
	  function init() {
	    var background = getCSS(document.documentElement, "backgroundColor"),
	      transparentBackground = (Util.isTransparent(background) && element === document.body),
	      stack = renderElement(element, null, false, transparentBackground);
	    parseChildren(element, stack);
	
	    if (transparentBackground) {
	      background = stack.backgroundColor;
	    }
	
	    body.removeChild(hidePseudoElements);
	    return {
	      backgroundColor: background,
	      stack: stack
	    };
	  }
	
	  return init();
	};
	
	function h2czContext(zindex) {
	  return {
	    zindex: zindex,
	    children: []
	  };
	}
	
	_html2canvas.Preload = function( options ) {
	
	  var images = {
	    numLoaded: 0,   // also failed are counted here
	    numFailed: 0,
	    numTotal: 0,
	    cleanupDone: false
	  },
	  pageOrigin,
	  Util = _html2canvas.Util,
	  methods,
	  i,
	  count = 0,
	  element = options.elements[0] || document.body,
	  doc = element.ownerDocument,
	  domImages = element.getElementsByTagName('img'), // Fetch images of the present element only
	  imgLen = domImages.length,
	  link = doc.createElement("a"),
	  supportCORS = (function( img ){
	    return (img.crossOrigin !== undefined);
	  })(new Image()),
	  timeoutTimer;
	
	  link.href = window.location.href;
	  pageOrigin  = link.protocol + link.host;
	
	  function isSameOrigin(url){
	    link.href = url;
	    link.href = link.href; // YES, BELIEVE IT OR NOT, that is required for IE9 - http://jsfiddle.net/niklasvh/2e48b/
	    var origin = link.protocol + link.host;
	    return (origin === pageOrigin);
	  }
	
	  function start(){
	    Util.log("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
	    if (!images.firstRun && images.numLoaded >= images.numTotal){
	      Util.log("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");
	
	      if (typeof options.complete === "function"){
	        options.complete(images);
	      }
	
	    }
	  }
	
	  // TODO modify proxy to serve images with CORS enabled, where available
	  function proxyGetImage(url, img, imageObj){
	    var callback_name,
	    scriptUrl = options.proxy,
	    script;
	
	    link.href = url;
	    url = link.href; // work around for pages with base href="" set - WARNING: this may change the url
	
	    callback_name = 'html2canvas_' + (count++);
	    imageObj.callbackname = callback_name;
	
	    if (scriptUrl.indexOf("?") > -1) {
	      scriptUrl += "&";
	    } else {
	      scriptUrl += "?";
	    }
	    scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
	    script = doc.createElement("script");
	
	    window[callback_name] = function(a){
	      if (a.substring(0,6) === "error:"){
	        imageObj.succeeded = false;
	        images.numLoaded++;
	        images.numFailed++;
	        start();
	      } else {
	        setImageLoadHandlers(img, imageObj);
	        img.src = a;
	      }
	      window[callback_name] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
	      try {
	        delete window[callback_name];  // for all browser that support this
	      } catch(ex) {}
	      script.parentNode.removeChild(script);
	      script = null;
	      delete imageObj.script;
	      delete imageObj.callbackname;
	    };
	
	    script.setAttribute("type", "text/javascript");
	    script.setAttribute("src", scriptUrl);
	    imageObj.script = script;
	    window.document.body.appendChild(script);
	
	  }
	
	  function loadPseudoElement(element, type) {
	    var style = window.getComputedStyle(element, type),
	    content = style.content;
	    if (content.substr(0, 3) === 'url') {
	      methods.loadImage(_html2canvas.Util.parseBackgroundImage(content)[0].args[0]);
	    }
	    loadBackgroundImages(style.backgroundImage, element);
	  }
	
	  function loadPseudoElementImages(element) {
	    loadPseudoElement(element, ":before");
	    loadPseudoElement(element, ":after");
	  }
	
	  function loadGradientImage(backgroundImage, bounds) {
	    var img = _html2canvas.Generate.Gradient(backgroundImage, bounds);
	
	    if (img !== undefined){
	      images[backgroundImage] = {
	        img: img,
	        succeeded: true
	      };
	      images.numTotal++;
	      images.numLoaded++;
	      start();
	    }
	  }
	
	  function invalidBackgrounds(background_image) {
	    return (background_image && background_image.method && background_image.args && background_image.args.length > 0 );
	  }
	
	  function loadBackgroundImages(background_image, el) {
	    var bounds;
	
	    _html2canvas.Util.parseBackgroundImage(background_image).filter(invalidBackgrounds).forEach(function(background_image) {
	      if (background_image.method === 'url') {
	        methods.loadImage(background_image.args[0]);
	      } else if(background_image.method.match(/\-?gradient$/)) {
	        if(bounds === undefined) {
	          bounds = _html2canvas.Util.Bounds(el);
	        }
	        loadGradientImage(background_image.value, bounds);
	      }
	    });
	  }
	
	  function getImages (el) {
	    var elNodeType = false;
	
	    // Firefox fails with permission denied on pages with iframes
	    try {
	      Util.Children(el).forEach(getImages);
	    }
	    catch( e ) {}
	
	    try {
	      elNodeType = el.nodeType;
	    } catch (ex) {
	      elNodeType = false;
	      Util.log("html2canvas: failed to access some element's nodeType - Exception: " + ex.message);
	    }
	
	    if (elNodeType === 1 || elNodeType === undefined) {
	      loadPseudoElementImages(el);
	      try {
	        loadBackgroundImages(Util.getCSS(el, 'backgroundImage'), el);
	      } catch(e) {
	        Util.log("html2canvas: failed to get background-image - Exception: " + e.message);
	      }
	      loadBackgroundImages(el);
	    }
	  }
	
	  function setImageLoadHandlers(img, imageObj) {
	    img.onload = function() {
	      if ( imageObj.timer !== undefined ) {
	        // CORS succeeded
	        window.clearTimeout( imageObj.timer );
	      }
	
	      images.numLoaded++;
	      imageObj.succeeded = true;
	      img.onerror = img.onload = null;
	      start();
	    };
	    img.onerror = function() {
	      if (img.crossOrigin === "anonymous") {
	        // CORS failed
	        window.clearTimeout( imageObj.timer );
	
	        // let's try with proxy instead
	        if ( options.proxy ) {
	          var src = img.src;
	          img = new Image();
	          imageObj.img = img;
	          img.src = src;
	
	          proxyGetImage( img.src, img, imageObj );
	          return;
	        }
	      }
	
	      images.numLoaded++;
	      images.numFailed++;
	      imageObj.succeeded = false;
	      img.onerror = img.onload = null;
	      start();
	    };
	  }
	
	  methods = {
	    loadImage: function( src ) {
	      var img, imageObj;
	      if ( src && images[src] === undefined ) {
	        img = new Image();
	        if ( src.match(/data:image\/.*;base64,/i) ) {
	          img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
	          imageObj = images[src] = {
	            img: img
	          };
	          images.numTotal++;
	          setImageLoadHandlers(img, imageObj);
	        } else if ( isSameOrigin( src ) || options.allowTaint ===  true ) {
	          imageObj = images[src] = {
	            img: img
	          };
	          images.numTotal++;
	          setImageLoadHandlers(img, imageObj);
	          img.src = src;
	        } else if ( supportCORS && !options.allowTaint && options.useCORS ) {
	          // attempt to load with CORS
	
	          img.crossOrigin = "anonymous";
	          imageObj = images[src] = {
	            img: img
	          };
	          images.numTotal++;
	          setImageLoadHandlers(img, imageObj);
	          img.src = src;
	        } else if ( options.proxy ) {
	          imageObj = images[src] = {
	            img: img
	          };
	          images.numTotal++;
	          proxyGetImage( src, img, imageObj );
	        }
	      }
	
	    },
	    cleanupDOM: function(cause) {
	      var img, src;
	      if (!images.cleanupDone) {
	        if (cause && typeof cause === "string") {
	          Util.log("html2canvas: Cleanup because: " + cause);
	        } else {
	          Util.log("html2canvas: Cleanup after timeout: " + options.timeout + " ms.");
	        }
	
	        for (src in images) {
	          if (images.hasOwnProperty(src)) {
	            img = images[src];
	            if (typeof img === "object" && img.callbackname && img.succeeded === undefined) {
	              // cancel proxy image request
	              window[img.callbackname] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
	              try {
	                delete window[img.callbackname];  // for all browser that support this
	              } catch(ex) {}
	              if (img.script && img.script.parentNode) {
	                img.script.setAttribute("src", "about:blank");  // try to cancel running request
	                img.script.parentNode.removeChild(img.script);
	              }
	              images.numLoaded++;
	              images.numFailed++;
	              Util.log("html2canvas: Cleaned up failed img: '" + src + "' Steps: " + images.numLoaded + " / " + images.numTotal);
	            }
	          }
	        }
	
	        // cancel any pending requests
	        if(window.stop !== undefined) {
	          window.stop();
	        } else if(document.execCommand !== undefined) {
	          document.execCommand("Stop", false);
	        }
	        if (document.close !== undefined) {
	          document.close();
	        }
	        images.cleanupDone = true;
	        if (!(cause && typeof cause === "string")) {
	          start();
	        }
	      }
	    },
	
	    renderingDone: function() {
	      if (timeoutTimer) {
	        window.clearTimeout(timeoutTimer);
	      }
	    }
	  };
	
	  if (options.timeout > 0) {
	    timeoutTimer = window.setTimeout(methods.cleanupDOM, options.timeout);
	  }
	
	  Util.log('html2canvas: Preload starts: finding background-images');
	  images.firstRun = true;
	
	  getImages(element);
	
	  Util.log('html2canvas: Preload: Finding images');
	  // load <img> images
	  for (i = 0; i < imgLen; i+=1){
	    methods.loadImage( domImages[i].getAttribute( "src" ) );
	  }
	
	  images.firstRun = false;
	  Util.log('html2canvas: Preload: Done.');
	  if (images.numTotal === images.numLoaded) {
	    start();
	  }
	
	  return methods;
	};
	
	_html2canvas.Renderer = function(parseQueue, options){
	
	  // http://www.w3.org/TR/CSS21/zindex.html
	  function createRenderQueue(parseQueue) {
	    var queue = [],
	    rootContext;
	
	    rootContext = (function buildStackingContext(rootNode) {
	      var rootContext = {};
	      function insert(context, node, specialParent) {
	        var zi = (node.zIndex.zindex === 'auto') ? 0 : Number(node.zIndex.zindex),
	        contextForChildren = context, // the stacking context for children
	        isPositioned = node.zIndex.isPositioned,
	        isFloated = node.zIndex.isFloated,
	        stub = {node: node},
	        childrenDest = specialParent; // where children without z-index should be pushed into
	
	        if (node.zIndex.ownStacking) {
	          // '!' comes before numbers in sorted array
	          contextForChildren = stub.context = { '!': [{node:node, children: []}]};
	          childrenDest = undefined;
	        } else if (isPositioned || isFloated) {
	          childrenDest = stub.children = [];
	        }
	
	        if (zi === 0 && specialParent) {
	          specialParent.push(stub);
	        } else {
	          if (!context[zi]) { context[zi] = []; }
	          context[zi].push(stub);
	        }
	
	        node.zIndex.children.forEach(function(childNode) {
	          insert(contextForChildren, childNode, childrenDest);
	        });
	      }
	      insert(rootContext, rootNode);
	      return rootContext;
	    })(parseQueue);
	
	    function sortZ(context) {
	      Object.keys(context).sort().forEach(function(zi) {
	        var nonPositioned = [],
	        floated = [],
	        positioned = [],
	        list = [];
	
	        // positioned after static
	        context[zi].forEach(function(v) {
	          if (v.node.zIndex.isPositioned || v.node.zIndex.opacity < 1) {
	            // http://www.w3.org/TR/css3-color/#transparency
	            // non-positioned element with opactiy < 1 should be stacked as if it were a positioned element with ‘z-index: 0’ and ‘opacity: 1’.
	            positioned.push(v);
	          } else if (v.node.zIndex.isFloated) {
	            floated.push(v);
	          } else {
	            nonPositioned.push(v);
	          }
	        });
	
	        (function walk(arr) {
	          arr.forEach(function(v) {
	            list.push(v);
	            if (v.children) { walk(v.children); }
	          });
	        })(nonPositioned.concat(floated, positioned));
	
	        list.forEach(function(v) {
	          if (v.context) {
	            sortZ(v.context);
	          } else {
	            queue.push(v.node);
	          }
	        });
	      });
	    }
	
	    sortZ(rootContext);
	
	    return queue;
	  }
	
	  function getRenderer(rendererName) {
	    var renderer;
	
	    if (typeof options.renderer === "string" && _html2canvas.Renderer[rendererName] !== undefined) {
	      renderer = _html2canvas.Renderer[rendererName](options);
	    } else if (typeof rendererName === "function") {
	      renderer = rendererName(options);
	    } else {
	      throw new Error("Unknown renderer");
	    }
	
	    if ( typeof renderer !== "function" ) {
	      throw new Error("Invalid renderer defined");
	    }
	    return renderer;
	  }
	
	  return getRenderer(options.renderer)(parseQueue, options, document, createRenderQueue(parseQueue.stack), _html2canvas);
	};
	
	_html2canvas.Util.Support = function (options, doc) {
	
	  function supportSVGRendering() {
	    var img = new Image(),
	    canvas = doc.createElement("canvas"),
	    ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
	    if (ctx === false) {
	      return false;
	    }
	    canvas.width = canvas.height = 10;
	    img.src = [
	    "data:image/svg+xml,",
	    "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
	    "<foreignObject width='10' height='10'>",
	    "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
	    "sup",
	    "</div>",
	    "</foreignObject>",
	    "</svg>"
	    ].join("");
	    try {
	      ctx.drawImage(img, 0, 0);
	      canvas.toDataURL();
	    } catch(e) {
	      return false;
	    }
	    _html2canvas.Util.log('html2canvas: Parse: SVG powered rendering available');
	    return true;
	  }
	
	  // Test whether we can use ranges to measure bounding boxes
	  // Opera doesn't provide valid bounds.height/bottom even though it supports the method.
	
	  function supportRangeBounds() {
	    var r, testElement, rangeBounds, rangeHeight, support = false;
	
	    if (doc.createRange) {
	      r = doc.createRange();
	      if (r.getBoundingClientRect) {
	        testElement = doc.createElement('boundtest');
	        testElement.style.height = "123px";
	        testElement.style.display = "block";
	        doc.body.appendChild(testElement);
	
	        r.selectNode(testElement);
	        rangeBounds = r.getBoundingClientRect();
	        rangeHeight = rangeBounds.height;
	
	        if (rangeHeight === 123) {
	          support = true;
	        }
	        doc.body.removeChild(testElement);
	      }
	    }
	
	    return support;
	  }
	
	  return {
	    rangeBounds: supportRangeBounds(),
	    svgRendering: options.svgRendering && supportSVGRendering()
	  };
	};
	window.html2canvas = function(elements, opts) {
	  elements = (elements.length) ? elements : [elements];
	  var queue,
	  canvas,
	  options = {
	    // general
	    logging: false,
	    elements: elements,
	    background: "#fff",
	
	    // preload options
	    proxy: null,
	    timeout: 0,    // no timeout
	    useCORS: false, // try to load images as CORS (where available), before falling back to proxy
	    allowTaint: false, // whether to allow images to taint the canvas, won't need proxy if set to true
	
	    // parse options
	    svgRendering: false, // use svg powered rendering where available (FF11+)
	    ignoreElements: "IFRAME|OBJECT|PARAM",
	    useOverflow: true,
	    letterRendering: true,
	    chinese: false,
	
	    // render options
	
	    width: null,
	    height: null,
	    taintTest: true, // do a taint test with all images before applying to canvas
	    renderer: "Canvas"
	  };
	
	  options = _html2canvas.Util.Extend(opts, options);
	
	  _html2canvas.logging = options.logging;
	  options.complete = function( images ) {
	
	    if (typeof options.onpreloaded === "function") {
	      if ( options.onpreloaded( images ) === false ) {
	        return;
	      }
	    }
	    queue = _html2canvas.Parse( images, options );
	
	    if (typeof options.onparsed === "function") {
	      if ( options.onparsed( queue ) === false ) {
	        return;
	      }
	    }
	
	    canvas = _html2canvas.Renderer( queue, options );
	
	    if (typeof options.onrendered === "function") {
	      options.onrendered( canvas );
	    }
	
	
	  };
	
	  // for pages without images, we still want this to be async, i.e. return methods before executing
	  window.setTimeout( function(){
	    _html2canvas.Preload( options );
	  }, 0 );
	
	  return {
	    render: function( queue, opts ) {
	      return _html2canvas.Renderer( queue, _html2canvas.Util.Extend(opts, options) );
	    },
	    parse: function( images, opts ) {
	      return _html2canvas.Parse( images, _html2canvas.Util.Extend(opts, options) );
	    },
	    preload: function( opts ) {
	      return _html2canvas.Preload( _html2canvas.Util.Extend(opts, options) );
	    },
	    log: _html2canvas.Util.log
	  };
	};
	
	window.html2canvas.log = _html2canvas.Util.log; // for renderers
	window.html2canvas.Renderer = {
	  Canvas: undefined // We are assuming this will be used
	};
	_html2canvas.Renderer.Canvas = function(options) {
	  options = options || {};
	
	  var doc = document,
	  safeImages = [],
	  testCanvas = document.createElement("canvas"),
	  testctx = testCanvas.getContext("2d"),
	  Util = _html2canvas.Util,
	  canvas = options.canvas || doc.createElement('canvas');
	
	  function createShape(ctx, args) {
	    ctx.beginPath();
	    args.forEach(function(arg) {
	      ctx[arg.name].apply(ctx, arg['arguments']);
	    });
	    ctx.closePath();
	  }
	
	  function safeImage(item) {
	    if (safeImages.indexOf(item['arguments'][0].src ) === -1) {
	      testctx.drawImage(item['arguments'][0], 0, 0);
	      try {
	        testctx.getImageData(0, 0, 1, 1);
	      } catch(e) {
	        testCanvas = doc.createElement("canvas");
	        testctx = testCanvas.getContext("2d");
	        return false;
	      }
	      safeImages.push(item['arguments'][0].src);
	    }
	    return true;
	  }
	
	  function renderItem(ctx, item) {
	    switch(item.type){
	      case "variable":
	        ctx[item.name] = item['arguments'];
	        break;
	      case "function":
	        switch(item.name) {
	          case "createPattern":
	            if (item['arguments'][0].width > 0 && item['arguments'][0].height > 0) {
	              try {
	                ctx.fillStyle = ctx.createPattern(item['arguments'][0], "repeat");
	              }
	              catch(e) {
	                Util.log("html2canvas: Renderer: Error creating pattern", e.message);
	              }
	            }
	            break;
	          case "drawShape":
	            createShape(ctx, item['arguments']);
	            break;
	          case "drawImage":
	            if (item['arguments'][8] > 0 && item['arguments'][7] > 0) {
	              if (!options.taintTest || (options.taintTest && safeImage(item))) {
	                ctx.drawImage.apply( ctx, item['arguments'] );
	              }
	            }
	            break;
	          default:
	            ctx[item.name].apply(ctx, item['arguments']);
	        }
	        break;
	    }
	  }
	
	  return function(parsedData, options, document, queue, _html2canvas) {
	    var ctx = canvas.getContext("2d"),
	    newCanvas,
	    bounds,
	    fstyle,
	    zStack = parsedData.stack;
	
	    canvas.width = canvas.style.width =  options.width || zStack.ctx.width;
	    canvas.height = canvas.style.height = options.height || zStack.ctx.height;
	
	    fstyle = ctx.fillStyle;
	    ctx.fillStyle = (Util.isTransparent(zStack.backgroundColor) && options.background !== undefined) ? options.background : parsedData.backgroundColor;
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	    ctx.fillStyle = fstyle;
	
	    queue.forEach(function(storageContext) {
	      // set common settings for canvas
	      ctx.textBaseline = "bottom";
	      ctx.save();
	
	      if (storageContext.transform.matrix) {
	        ctx.translate(storageContext.transform.origin[0], storageContext.transform.origin[1]);
	        ctx.transform.apply(ctx, storageContext.transform.matrix);
	        ctx.translate(-storageContext.transform.origin[0], -storageContext.transform.origin[1]);
	      }
	
	      if (storageContext.clip){
	        ctx.beginPath();
	        ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
	        ctx.clip();
	      }
	
	      if (storageContext.ctx.storage) {
	        storageContext.ctx.storage.forEach(function(item) {
	          renderItem(ctx, item);
	        });
	      }
	
	      ctx.restore();
	    });
	
	    Util.log("html2canvas: Renderer: Canvas renderer done - returning canvas obj");
	
	    if (options.elements.length === 1) {
	      if (typeof options.elements[0] === "object" && options.elements[0].nodeName !== "BODY") {
	        // crop image to the bounds of selected (single) element
	        bounds = _html2canvas.Util.Bounds(options.elements[0]);
	        newCanvas = document.createElement('canvas');
	        newCanvas.width = Math.ceil(bounds.width);
	        newCanvas.height = Math.ceil(bounds.height);
	        ctx = newCanvas.getContext("2d");
	
	        ctx.drawImage(canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
	        canvas = null;
	        return newCanvas;
	      }
	    }
	
	    return canvas;
	  };
	};
	})(window,document);

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(35);
	
	module.exports = Component.extend({
	
	});

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    $ = __webpack_require__(33),
	    moment = __webpack_require__(44),
	    Q = __webpack_require__(26)
	    ;
	
	var Store = __webpack_require__(55),
	    Search = __webpack_require__(56),
	    ROUTES = __webpack_require__(57).flights
	    ;
	
	var Flight = Store.extend({
	    data: function() {
	        return {
	            segments: [],
	            price: null,
	            refundable: 0,
	
	
	            first: function(segments) { return segments[0]; },
	            last: function(segments) { return segments[segments.length-1]; },
	            stops: function(segments) {
	                return segments.length-1;
	            },
	            segtime: function(segments) {
	                if (!segments)
	                    return null;
	
	                var time = moment.duration();
	
	                _.each(segments, function(i) {
	                    time.add(i.time);
	                    time.add(i.layover);
	                });
	
	                return time;
	            },
	
	            via: function(segments) {
	                if (!segments)
	                    return null;
	
	                if (segments.length > 1) {
	                    return _.map(segments.slice(1), function(i) {
	                        return i.from;
	                    });
	                }
	
	                return null;
	            }
	        };
	    },
	
	    computed: {
	        depart: function() {
	            return this.get('segments.0.0.depart');
	        },
	
	        arrive: function() {
	            return this.get('segments.0.' + (this.get('segments.0.length') - 1) + '.arrive');
	        },
	
	        itinerary: function() {
	            var s = this.get('segments.0');
	
	            return [s[0].from.airportCode, s[s.length-1].to.airportCode].join('-');
	        },
	
	        carriers: function() {
	            return _.unique(
	                _.union.apply(null,
	                    _.map(this.get('segments'), function(segments) {
	                        return _.map(segments, function(i) { return i.carrier; });
	                    })
	                ),
	                'code'
	            );
	        }
	    }
	});
	
	Flight.parse = function(data) {
	    data.id = _.uniqueId('flight_');
	    data.time = moment.duration();
	    data.segments = _.map(data.segments, function(segments) {
	        return _.map(segments, function(i) {
	            var segment = _.extend(i, {
	                depart: moment(i.depart),
	                arrive: moment(i.arrive),
	                time: moment.duration(i.time),
	                layover: moment.duration(i.layover)
	            });
	
	            data.time = data.time.add(segment.time).add(segment.layover);
	
	            return segment;
	        });
	    });
	
	    return new Flight({data: data});
	};
	
	Flight.fetch = function(search, deferred) {
	    deferred = deferred || Q.defer();
	
	
	    if (!deferred.started) {
	        deferred.started = _.now();
	        deferred.updated = null;
	        deferred.flights = Search.ROUNDTRIP == _.parseInt(search.get('tripType')) ? [[], []] : _.map(search.get('flights'), function() { return []; });
	
	      //  console.log('constructed flights', deferred.flights, search.get('flights'));
	    } else if (_.now() - deferred.started > Search.MAX_WAIT_TIME) {
	        deferred.resolve({ search: search, flights: deferred.flights});
	    }
	
	    $.ajax({
	        type: 'GET',
	        url: ROUTES.search,
	        data: { ids: search.get('ids'), options: search.toJSON(), updated: deferred.updated },
	        dataType: 'json',
	        complete: function() {
	            //console.log('response time', _.now() - time);
	        },
	        success: function(data) {
	            var flights = _.map(data.flights, function(flights) {
	                var filtered_flights  = [];
	                _.each(flights, function(flight) {
	                    if(flight !== null){
	//                        console.log(flight);
	                        if(typeof flight.length === 'undefined') { 
	                            // Only object will be pushed and blank array will be truncated
	                            filtered_flights.push(Flight.parse(flight));
	                        }
	                    }
	                });
	                return filtered_flights;
	            });
	            deferred.notify({ search: search, deferred: deferred, flights: flights});
	
	            _.each(deferred.flights, function(v, k) {
	                if (flights[k])
	                    deferred.flights[k] = _.union(v, flights[k]);
	            });
	
	
	            if (data.pending) {
	                deferred.updated = data.updated;
	                setTimeout(function() { Flight.fetch(search, deferred); }, Search.INTERVAL);
	            } else {
	                deferred.resolve({ search: search, flights: deferred.flights, prices: data.prices || null});
	            }
	
	        },
	        error: function(xhr) {
	            try {
	                reject(JSON.parse(xhr.responseText))
	            } catch (e) {
	                reject(false);
	            }
	        }
	    });
	
	
	    return deferred.promise;
	};
	
	module.exports = Flight;

/***/ },
/* 55 */,
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(33),
	    moment = __webpack_require__(44)
	    ;
	
	var Store = __webpack_require__(55)
	    ;
	
	var ROUTES = __webpack_require__(57).flights;
	
	var Search = Store.extend({
	    data: function() {
	        return {
	            domestic: 1,
	            tripType: Search.ONEWAY,
	            cabinType: Search.ECONOMY,
	            flights: [ { from: Search.DEL, to: Search.BOM, depart_at: moment().add(1, 'day'), return_at: null } ],
	
	            passengers: [1, 0, 0],
	
	            loading: false
	        }
	    },
	
	    onconfig: function() {
	        this.observe('domestic', function(domestic) {
	            if (!domestic && Search.MULTICITY == this.get('tripType')) {
	                this.set('tripType', Search.ONEWAY);
	            }
	
	            if (domestic) {
	                this.set('flights', [{ from: Search.DEL, to: Search.BOM, depart_at: moment().add(1, 'day') }]);
	            } else {
	                this.set('flights', [{ from: null, to: null, depart_at: moment().add(1, 'day') }]);
	            }
	
	        }, { init: false });
	
	        this.observe('tripType', function(value, old) {
	            if (Search.MULTICITY == value) {
	                this.splice('flights', 1, 0, { from: null, to: null, depart_at: null });
	            }
	
	            if (Search.MULTICITY == old) {
	                this.set('flights', [this.get('flights.0')]);
	            }
	
	            if (Search.ROUNDTRIP == old)  {
	                this.set('flights.0.return_at', null);
	            }
	
	        }, { init: false });
	    },
	
	    removeFlight: function(i) {
	        this.splice('flights', i, 1);
	    },
	
	    addFlight: function() {
	        this.push('flights', {});
	    },
	
	    toJSON: function() {
	        var form = this;
	
	        return {
	            cs: this.get('cs'),
	            domestic: this.get('domestic'),
	            tripType: this.get('tripType'),
	            cabinType: this.get('cabinType'),
	            passengers: this.get('passengers'),
	
	            flights: _.map(this.get('flights'), function(flight) {
	                return {
	                    from: flight.from,
	                    to: flight.to,
	                    depart_at: moment.isMoment(flight.depart_at) ? flight.depart_at.format('YYYY-MM-DD') : null,
	                    return_at: 2 == form.get('tripType')
	                        ? (moment.isMoment(flight.return_at) ? flight.return_at.format('YYYY-MM-DD') : null)
	                        : null
	                };
	            })
	        };
	    }
	});
	
	Search.MULTICITY = 3;
	Search.ROUNDTRIP = 2;
	Search.ONEWAY = 1;
	
	Search.DEL = 1236;
	Search.BOM = 946;
	
	Search.ECONOMY = 1;
	Search.PERMIUM_ECONOMY = 2;
	Search.BUSINESS = 3;
	Search.FIRST = 4;
	
	Search.MAX_WAIT_TIME = 60000;
	Search.INTERVAL = 5000;
	
	Search.load = function(url, force, cs) {
	    cs = cs || null;
	
	    return Q.Promise(function(resolve, reject) {
	        $.ajax({
	            type: 'GET',
	            url: ROUTES.search,
	            data: { query: url, force: force || 0, cs: cs },
	            dataType: 'json',
	            success: function(data) { resolve(Search.parse(data)); },
	            error: function(xhr) {
	                try {
	                    //alert(xhr.responseText);
	                    reject(JSON.parse(xhr.responseText))
	                } catch (e) {
	                    reject(false);
	                }
	            }
	        });
	    });
	};
	
	Search.parse = function(data) {
	    data.flights = _.map(data.flights, function(i) {
	        i.depart_at = moment(i.depart_at);
	        i.return_at = i.return_at && moment(i.return_at);
	
	        return i;
	    });
	
	    var search = new Search({data: data});
	
	
	    return search;
	};
	
	
	module.exports = Search;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var FLIGHTS = '/b2c/flights';
	
	module.exports = {
	    flights: {
	        search: FLIGHTS + '/search',
	        booking: function(id) { return '/b2c/booking/' + id; },
	    },
	};
	
	//new
	var profilemeta = __webpack_require__(58),
	    bookingemeta = __webpack_require__(59),
	    travellermeta = __webpack_require__(60),
	    myProfile = __webpack_require__(61),
	    myBooking = __webpack_require__(64),
	    myTraveller = __webpack_require__(65);
	    
	var actions = {
	    profile: function(ctx, next) {
	        (new myProfile()).render('#app').then(function() { next(); });
	    },
	    booking: function(ctx, next) {
	        (new myBooking()).render('#app').then(function() { next(); });
	    },
	    traveller: function(ctx, next) {
	        (new myTraveller()).render('#app').then(function() { next(); });
	    },
	};
	
	profilemeta.instance().then(function(meta) {
	    page('/b2c/users/myprofile/', actions.profile);
	     page({click: false});
	});
	
	bookingemeta.instance().then(function(meta) {
	    page('/b2c/users/mybookings/', actions.booking);
	     page({click: false});
	});
	
	travellermeta.instance().then(function(meta) {
	    page('/b2c/users/mytraveller/', actions.traveller);
	     page({click: false});
	});

/***/ },
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(33),
	    moment = __webpack_require__(44),
	    validate = __webpack_require__(62)
	    
	    ;
	
	var Store = __webpack_require__(55)  ;
	
	var Myprofile = Store.extend({
	    computed: {
	        price: function() {
	            _.reduce(this.get(' '))
	        }
	    },
	    getStateList: function (view) {
	       // console.log("getStateList");
	        return Q.Promise(function (resolve, reject, progress) {
	            $.ajax({
	                type: 'POST',
	                url: '/b2c/users/getStateList/' + _.parseInt(view.get('profileform.countrycode')),
	                dataType: 'json',
	                data: {'data': ''},
	                success: function (data) {
	                    //console.log(data);
	                    view.set('statelist',null);
	                    view.set('statelist', data);
	                    view.set('profileform.statecode', view.get('profileform.statecode'));
	                    view.update('profileform.statecode');
	                    resolve();
	                },
	                error: function (error) {
	                    alert(error);
	                }
	            });
	        }).then(function () {
	            //console.log('finsihed store: ');
	            var temp=view.get('profileform.statecode');
	            view.set('profileform.statecode', null);
	          view.set('profileform.statecode', temp);
	          
	          
	        }, function (error) {
	            console.log(error);
	        });
	    },
	    getCityList: function (view) {
	        //console.log("getCityList");
	        return Q.Promise(function (resolve, reject, progress) {
	            $.ajax({
	                type: 'POST',
	                url: '/b2c/users/getCityList/' + _.parseInt(view.get('profileform.statecode')),
	                dataType: 'json',
	                data: {'data': ''},
	                success: function (data) {
	                    //console.log(data);
	                    view.set('citylist',null);
	                    view.set('citylist', data);
	                    view.set('profileform.citycode', view.get('profileform.citycode'));
	                    resolve();
	                },
	                error: function (error) {
	                    alert(error);
	                }
	            });
	        }).then(function () {
	           $('#divcity .ui.dropdown').dropdown('set selected', $('#divcity .item.active.selected').attr('data-value'));
	        }, function (error) {
	            console.log(error);
	        });
	    },
	});
	
	Myprofile.parse = function(data) {
	           //console.log(data);  
	           data.baseUrl='';
	            data.add=false;
	            data.edit=false;           
	            data.pending= false;
	            
	    return new Myprofile({data: data});
	
	};
	Myprofile.fetch = function() {
	    return Q.Promise(function(resolve, reject) {
	        $.getJSON('/b2c/users/getProfile')
	            .then(function(data) {  resolve(Myprofile.parse(data));
	                
	            })
	            .fail(function(data) {
	                //TODO: handle error
	             console.log("failed");
	             console.log(data);
	            });
	    });
	};
	
	module.exports = Myprofile;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {//     Validate.js 0.7.1
	
	//     (c) 2013-2015 Nicklas Ansman, 2013 Wrapp
	//     Validate.js may be freely distributed under the MIT license.
	//     For all details and documentation:
	//     http://validatejs.org/
	
	(function(exports, module, define) {
	  "use strict";
	
	  // The main function that calls the validators specified by the constraints.
	  // The options are the following:
	  //   - format (string) - An option that controls how the returned value is formatted
	  //     * flat - Returns a flat array of just the error messages
	  //     * grouped - Returns the messages grouped by attribute (default)
	  //     * detailed - Returns an array of the raw validation data
	  //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
	  //
	  // Please note that the options are also passed to each validator.
	  var validate = function(attributes, constraints, options) {
	    options = v.extend({}, v.options, options);
	
	    var results = v.runValidations(attributes, constraints, options)
	      , attr
	      , validator;
	
	    for (attr in results) {
	      for (validator in results[attr]) {
	        if (v.isPromise(results[attr][validator])) {
	          throw new Error("Use validate.async if you want support for promises");
	        }
	      }
	    }
	    return validate.processValidationResults(results, options);
	  };
	
	  var v = validate;
	
	  // Copies over attributes from one or more sources to a single destination.
	  // Very much similar to underscore's extend.
	  // The first argument is the target object and the remaining arguments will be
	  // used as targets.
	  v.extend = function(obj) {
	    [].slice.call(arguments, 1).forEach(function(source) {
	      for (var attr in source) {
	        obj[attr] = source[attr];
	      }
	    });
	    return obj;
	  };
	
	  v.extend(validate, {
	    // This is the version of the library as a semver.
	    // The toString function will allow it to be coerced into a string
	    version: {
	      major: 0,
	      minor: 7,
	      patch: 1,
	      metadata: null,
	      toString: function() {
	        var version = v.format("%{major}.%{minor}.%{patch}", v.version);
	        if (!v.isEmpty(v.version.metadata)) {
	          version += "+" + v.version.metadata;
	        }
	        return version;
	      }
	    },
	
	    // Below is the dependencies that are used in validate.js
	
	    // The constructor of the Promise implementation.
	    // If you are using Q.js, RSVP or any other A+ compatible implementation
	    // override this attribute to be the constructor of that promise.
	    // Since jQuery promises aren't A+ compatible they won't work.
	    Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,
	
	    // If moment is used in node, browserify etc please set this attribute
	    // like this: `validate.moment = require("moment");
	    moment: typeof moment !== "undefined" ? moment : /* istanbul ignore next */ null,
	
	    XDate: typeof XDate !== "undefined" ? XDate : /* istanbul ignore next */ null,
	
	    EMPTY_STRING_REGEXP: /^\s*$/,
	
	    // Runs the validators specified by the constraints object.
	    // Will return an array of the format:
	    //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
	    runValidations: function(attributes, constraints, options) {
	      var results = []
	        , attr
	        , validatorName
	        , value
	        , validators
	        , validator
	        , validatorOptions
	        , error;
	
	      if (v.isDomElement(attributes)) {
	        attributes = v.collectFormValues(attributes);
	      }
	
	      // Loops through each constraints, finds the correct validator and run it.
	      for (attr in constraints) {
	        value = v.getDeepObjectValue(attributes, attr);
	        // This allows the constraints for an attribute to be a function.
	        // The function will be called with the value, attribute name, the complete dict of
	        // attributes as well as the options and constraints passed in.
	        // This is useful when you want to have different
	        // validations depending on the attribute value.
	        validators = v.result(constraints[attr], value, attributes, attr, options, constraints);
	
	        for (validatorName in validators) {
	          validator = v.validators[validatorName];
	
	          if (!validator) {
	            error = v.format("Unknown validator %{name}", {name: validatorName});
	            throw new Error(error);
	          }
	
	          validatorOptions = validators[validatorName];
	          // This allows the options to be a function. The function will be
	          // called with the value, attribute name, the complete dict of
	          // attributes as well as the options and constraints passed in.
	          // This is useful when you want to have different
	          // validations depending on the attribute value.
	          validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
	          if (!validatorOptions) {
	            continue;
	          }
	          results.push({
	            attribute: attr,
	            value: value,
	            validator: validatorName,
	            options: validatorOptions,
	            error: validator.call(validator, value, validatorOptions, attr,
	                                  attributes)
	          });
	        }
	      }
	
	      return results;
	    },
	
	    // Takes the output from runValidations and converts it to the correct
	    // output format.
	    processValidationResults: function(errors, options) {
	      var attr;
	
	      errors = v.pruneEmptyErrors(errors, options);
	      errors = v.expandMultipleErrors(errors, options);
	      errors = v.convertErrorMessages(errors, options);
	
	      switch (options.format || "grouped") {
	        case "detailed":
	          // Do nothing more to the errors
	          break;
	
	        case "flat":
	          errors = v.flattenErrorsToArray(errors);
	          break;
	
	        case "grouped":
	          errors = v.groupErrorsByAttribute(errors);
	          for (attr in errors) {
	            errors[attr] = v.flattenErrorsToArray(errors[attr]);
	          }
	          break;
	
	        default:
	          throw new Error(v.format("Unknown format %{format}", options));
	      }
	
	      return v.isEmpty(errors) ? undefined : errors;
	    },
	
	    // Runs the validations with support for promises.
	    // This function will return a promise that is settled when all the
	    // validation promises have been completed.
	    // It can be called even if no validations returned a promise.
	    async: function(attributes, constraints, options) {
	      options = v.extend({}, v.async.options, options);
	      var results = v.runValidations(attributes, constraints, options);
	
	      return new v.Promise(function(resolve, reject) {
	        v.waitForResults(results).then(function() {
	          var errors = v.processValidationResults(results, options);
	          if (errors) {
	            reject(errors);
	          } else {
	            resolve(attributes);
	          }
	        }, function(err) {
	          reject(err);
	        });
	      });
	    },
	
	    single: function(value, constraints, options) {
	      options = v.extend({}, v.single.options, options, {
	        format: "flat",
	        fullMessages: false
	      });
	      return v({single: value}, {single: constraints}, options);
	    },
	
	    // Returns a promise that is resolved when all promises in the results array
	    // are settled. The promise returned from this function is always resolved,
	    // never rejected.
	    // This function modifies the input argument, it replaces the promises
	    // with the value returned from the promise.
	    waitForResults: function(results) {
	      // Create a sequence of all the results starting with a resolved promise.
	      return results.reduce(function(memo, result) {
	        // If this result isn't a promise skip it in the sequence.
	        if (!v.isPromise(result.error)) {
	          return memo;
	        }
	
	        return memo.then(function() {
	          return result.error.then(
	            function() {
	              result.error = null;
	            },
	            function(error) {
	              // If for some reason the validator promise was rejected but no
	              // error was specified.
	              if (!error) {
	                v.warn("Validator promise was rejected but didn't return an error");
	              } else if (error instanceof Error) {
	                throw error;
	              }
	              result.error = error;
	            }
	          );
	        });
	      }, new v.Promise(function(r) { r(); })); // A resolved promise
	    },
	
	    // If the given argument is a call: function the and: function return the value
	    // otherwise just return the value. Additional arguments will be passed as
	    // arguments to the function.
	    // Example:
	    // ```
	    // result('foo') // 'foo'
	    // result(Math.max, 1, 2) // 2
	    // ```
	    result: function(value) {
	      var args = [].slice.call(arguments, 1);
	      if (typeof value === 'function') {
	        value = value.apply(null, args);
	      }
	      return value;
	    },
	
	    // Checks if the value is a number. This function does not consider NaN a
	    // number like many other `isNumber` functions do.
	    isNumber: function(value) {
	      return typeof value === 'number' && !isNaN(value);
	    },
	
	    // Returns false if the object is not a function
	    isFunction: function(value) {
	      return typeof value === 'function';
	    },
	
	    // A simple check to verify that the value is an integer. Uses `isNumber`
	    // and a simple modulo check.
	    isInteger: function(value) {
	      return v.isNumber(value) && value % 1 === 0;
	    },
	
	    // Uses the `Object` function to check if the given argument is an object.
	    isObject: function(obj) {
	      return obj === Object(obj);
	    },
	
	    // Simply checks if the object is an instance of a date
	    isDate: function(obj) {
	      return obj instanceof Date;
	    },
	
	    // Returns false if the object is `null` of `undefined`
	    isDefined: function(obj) {
	      return obj !== null && obj !== undefined;
	    },
	
	    // Checks if the given argument is a promise. Anything with a `then`
	    // function is considered a promise.
	    isPromise: function(p) {
	      return !!p && v.isFunction(p.then);
	    },
	
	    isDomElement: function(o) {
	      if (!o) {
	        return false;
	      }
	
	      if (!v.isFunction(o.querySelectorAll) || !v.isFunction(o.querySelector)) {
	        return false;
	      }
	
	      if (v.isObject(document) && o === document) {
	        return true;
	      }
	
	      // http://stackoverflow.com/a/384380/699304
	      /* istanbul ignore else */
	      if (typeof HTMLElement === "object") {
	        return o instanceof HTMLElement;
	      } else {
	        return o &&
	          typeof o === "object" &&
	          o !== null &&
	          o.nodeType === 1 &&
	          typeof o.nodeName === "string";
	      }
	    },
	
	    isEmpty: function(value) {
	      var attr;
	
	      // Null and undefined are empty
	      if (!v.isDefined(value)) {
	        return true;
	      }
	
	      // functions are non empty
	      if (v.isFunction(value)) {
	        return false;
	      }
	
	      // Whitespace only strings are empty
	      if (v.isString(value)) {
	        return v.EMPTY_STRING_REGEXP.test(value);
	      }
	
	      // For arrays we use the length property
	      if (v.isArray(value)) {
	        return value.length === 0;
	      }
	
	      // Dates have no attributes but aren't empty
	      if (v.isDate(value)) {
	        return false;
	      }
	
	      // If we find at least one property we consider it non empty
	      if (v.isObject(value)) {
	        for (attr in value) {
	          return false;
	        }
	        return true;
	      }
	
	      return false;
	    },
	
	    // Formats the specified strings with the given values like so:
	    // ```
	    // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
	    // ```
	    // If you want to write %{...} without having it replaced simply
	    // prefix it with % like this `Foo: %%{foo}` and it will be returned
	    // as `"Foo: %{foo}"`
	    format: v.extend(function(str, vals) {
	      return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
	        if (m1 === '%') {
	          return "%{" + m2 + "}";
	        } else {
	          return String(vals[m2]);
	        }
	      });
	    }, {
	      // Finds %{key} style patterns in the given string
	      FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
	    }),
	
	    // "Prettifies" the given string.
	    // Prettifying means replacing [.\_-] with spaces as well as splitting
	    // camel case words.
	    prettify: function(str) {
	      if (v.isNumber(str)) {
	        // If there are more than 2 decimals round it to two
	        if ((str * 100) % 1 === 0) {
	          return "" + str;
	        } else {
	          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
	        }
	      }
	
	      if (v.isArray(str)) {
	        return str.map(function(s) { return v.prettify(s); }).join(", ");
	      }
	
	      if (v.isObject(str)) {
	        return str.toString();
	      }
	
	      // Ensure the string is actually a string
	      str = "" + str;
	
	      return str
	        // Splits keys separated by periods
	        .replace(/([^\s])\.([^\s])/g, '$1 $2')
	        // Removes backslashes
	        .replace(/\\+/g, '')
	        // Replaces - and - with space
	        .replace(/[_-]/g, ' ')
	        // Splits camel cased words
	        .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
	          return "" + m1 + " " + m2.toLowerCase();
	        })
	        .toLowerCase();
	    },
	
	    stringifyValue: function(value) {
	      return v.prettify(value);
	    },
	
	    isString: function(value) {
	      return typeof value === 'string';
	    },
	
	    isArray: function(value) {
	      return {}.toString.call(value) === '[object Array]';
	    },
	
	    contains: function(obj, value) {
	      if (!v.isDefined(obj)) {
	        return false;
	      }
	      if (v.isArray(obj)) {
	        return obj.indexOf(value) !== -1;
	      }
	      return value in obj;
	    },
	
	    getDeepObjectValue: function(obj, keypath) {
	      if (!v.isObject(obj) || !v.isString(keypath)) {
	        return undefined;
	      }
	
	      var key = ""
	        , i
	        , escape = false;
	
	      for (i = 0; i < keypath.length; ++i) {
	        switch (keypath[i]) {
	          case '.':
	            if (escape) {
	              escape = false;
	              key += '.';
	            } else if (key in obj) {
	              obj = obj[key];
	              key = "";
	            } else {
	              return undefined;
	            }
	            break;
	
	          case '\\':
	            if (escape) {
	              escape = false;
	              key += '\\';
	            } else {
	              escape = true;
	            }
	            break;
	
	          default:
	            escape = false;
	            key += keypath[i];
	            break;
	        }
	      }
	
	      if (v.isDefined(obj) && key in obj) {
	        return obj[key];
	      } else {
	        return undefined;
	      }
	    },
	
	    // This returns an object with all the values of the form.
	    // It uses the input name as key and the value as value
	    // So for example this:
	    // <input type="text" name="email" value="foo@bar.com" />
	    // would return:
	    // {email: "foo@bar.com"}
	    collectFormValues: function(form, options) {
	      var values = {}
	        , i
	        , input
	        , inputs
	        , value;
	
	      if (!form) {
	        return values;
	      }
	
	      options = options || {};
	
	      inputs = form.querySelectorAll("input[name]");
	      for (i = 0; i < inputs.length; ++i) {
	        input = inputs.item(i);
	
	        if (v.isDefined(input.getAttribute("data-ignored"))) {
	          continue;
	        }
	
	        value = v.sanitizeFormValue(input.value, options);
	        if (input.type === "number") {
	          value = +value;
	        } else if (input.type === "checkbox") {
	          if (input.attributes.value) {
	            if (!input.checked) {
	              value = values[input.name] || null;
	            }
	          } else {
	            value = input.checked;
	          }
	        } else if (input.type === "radio") {
	          if (!input.checked) {
	            value = values[input.name] || null;
	          }
	        }
	        values[input.name] = value;
	      }
	
	      inputs = form.querySelectorAll("select[name]");
	      for (i = 0; i < inputs.length; ++i) {
	        input = inputs.item(i);
	        value = v.sanitizeFormValue(input.options[input.selectedIndex].value, options);
	        values[input.name] = value;
	      }
	
	      return values;
	    },
	
	    sanitizeFormValue: function(value, options) {
	      if (options.trim && v.isString(value)) {
	        value = value.trim();
	      }
	
	      if (options.nullify !== false && value === "") {
	        return null;
	      }
	      return value;
	    },
	
	    capitalize: function(str) {
	      if (!v.isString(str)) {
	        return str;
	      }
	      return str[0].toUpperCase() + str.slice(1);
	    },
	
	    // Remove all errors who's error attribute is empty (null or undefined)
	    pruneEmptyErrors: function(errors) {
	      return errors.filter(function(error) {
	        return !v.isEmpty(error.error);
	      });
	    },
	
	    // In
	    // [{error: ["err1", "err2"], ...}]
	    // Out
	    // [{error: "err1", ...}, {error: "err2", ...}]
	    //
	    // All attributes in an error with multiple messages are duplicated
	    // when expanding the errors.
	    expandMultipleErrors: function(errors) {
	      var ret = [];
	      errors.forEach(function(error) {
	        // Removes errors without a message
	        if (v.isArray(error.error)) {
	          error.error.forEach(function(msg) {
	            ret.push(v.extend({}, error, {error: msg}));
	          });
	        } else {
	          ret.push(error);
	        }
	      });
	      return ret;
	    },
	
	    // Converts the error mesages by prepending the attribute name unless the
	    // message is prefixed by ^
	    convertErrorMessages: function(errors, options) {
	      options = options || {};
	
	      var ret = [];
	      errors.forEach(function(errorInfo) {
	        var error = errorInfo.error;
	
	        if (error[0] === '^') {
	          error = error.slice(1);
	        } else if (options.fullMessages !== false) {
	          error = v.capitalize(v.prettify(errorInfo.attribute)) + " " + error;
	        }
	        error = error.replace(/\\\^/g, "^");
	        error = v.format(error, {value: v.stringifyValue(errorInfo.value)});
	        ret.push(v.extend({}, errorInfo, {error: error}));
	      });
	      return ret;
	    },
	
	    // In:
	    // [{attribute: "<attributeName>", ...}]
	    // Out:
	    // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
	    groupErrorsByAttribute: function(errors) {
	      var ret = {};
	      errors.forEach(function(error) {
	        var list = ret[error.attribute];
	        if (list) {
	          list.push(error);
	        } else {
	          ret[error.attribute] = [error];
	        }
	      });
	      return ret;
	    },
	
	    // In:
	    // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
	    // Out:
	    // ["<message 1>", "<message 2>"]
	    flattenErrorsToArray: function(errors) {
	      return errors.map(function(error) { return error.error; });
	    },
	
	    exposeModule: function(validate, root, exports, module, define) {
	      if (exports) {
	        if (module && module.exports) {
	          exports = module.exports = validate;
	        }
	        exports.validate = validate;
	      } else {
	        root.validate = validate;
	        if (validate.isFunction(define) && define.amd) {
	          define([], function () { return validate; });
	        }
	      }
	    },
	
	    warn: function(msg) {
	      if (typeof console !== "undefined" && console.warn) {
	        console.warn(msg);
	      }
	    },
	
	    error: function(msg) {
	      if (typeof console !== "undefined" && console.error) {
	        console.error(msg);
	      }
	    }
	  });
	
	  validate.validators = {
	    // Presence validates that the value isn't empty
	    presence: function(value, options) {
	      options = v.extend({}, this.options, options);
	      if (v.isEmpty(value)) {
	        return options.message || this.message || "can't be blank";
	      }
	    },
	    length: function(value, options, attribute) {
	      // Empty values are allowed
	      if (v.isEmpty(value)) {
	        return;
	      }
	
	      options = v.extend({}, this.options, options);
	
	      var is = options.is
	        , maximum = options.maximum
	        , minimum = options.minimum
	        , tokenizer = options.tokenizer || function(val) { return val; }
	        , err
	        , errors = [];
	
	      value = tokenizer(value);
	      var length = value.length;
	      if(!v.isNumber(length)) {
	        v.error(v.format("Attribute %{attr} has a non numeric value for `length`", {attr: attribute}));
	        return options.message || this.notValid || "has an incorrect length";
	      }
	
	      // Is checks
	      if (v.isNumber(is) && length !== is) {
	        err = options.wrongLength ||
	          this.wrongLength ||
	          "is the wrong length (should be %{count} characters)";
	        errors.push(v.format(err, {count: is}));
	      }
	
	      if (v.isNumber(minimum) && length < minimum) {
	        err = options.tooShort ||
	          this.tooShort ||
	          "is too short (minimum is %{count} characters)";
	        errors.push(v.format(err, {count: minimum}));
	      }
	
	      if (v.isNumber(maximum) && length > maximum) {
	        err = options.tooLong ||
	          this.tooLong ||
	          "is too long (maximum is %{count} characters)";
	        errors.push(v.format(err, {count: maximum}));
	      }
	
	      if (errors.length > 0) {
	        return options.message || errors;
	      }
	    },
	    numericality: function(value, options) {
	      // Empty values are fine
	      if (v.isEmpty(value)) {
	        return;
	      }
	
	      options = v.extend({}, this.options, options);
	
	      var errors = []
	        , name
	        , count
	        , checks = {
	            greaterThan:          function(v, c) { return v > c; },
	            greaterThanOrEqualTo: function(v, c) { return v >= c; },
	            equalTo:              function(v, c) { return v === c; },
	            lessThan:             function(v, c) { return v < c; },
	            lessThanOrEqualTo:    function(v, c) { return v <= c; }
	          };
	
	      // Coerce the value to a number unless we're being strict.
	      if (options.noStrings !== true && v.isString(value)) {
	        value = +value;
	      }
	
	      // If it's not a number we shouldn't continue since it will compare it.
	      if (!v.isNumber(value)) {
	        return options.message || this.notValid || "is not a number";
	      }
	
	      // Same logic as above, sort of. Don't bother with comparisons if this
	      // doesn't pass.
	      if (options.onlyInteger && !v.isInteger(value)) {
	        return options.message || this.notInteger  || "must be an integer";
	      }
	
	      for (name in checks) {
	        count = options[name];
	        if (v.isNumber(count) && !checks[name](value, count)) {
	          // This picks the default message if specified
	          // For example the greaterThan check uses the message from
	          // this.notGreaterThan so we capitalize the name and prepend "not"
	          var msg = this["not" + v.capitalize(name)] ||
	            "must be %{type} %{count}";
	
	          errors.push(v.format(msg, {
	            count: count,
	            type: v.prettify(name)
	          }));
	        }
	      }
	
	      if (options.odd && value % 2 !== 1) {
	        errors.push(this.notOdd || "must be odd");
	      }
	      if (options.even && value % 2 !== 0) {
	        errors.push(this.notEven || "must be even");
	      }
	
	      if (errors.length) {
	        return options.message || errors;
	      }
	    },
	    datetime: v.extend(function(value, options) {
	      // Empty values are fine
	      if (v.isEmpty(value)) {
	        return;
	      }
	
	      options = v.extend({}, this.options, options);
	
	      var err
	        , errors = []
	        , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
	        , latest = options.latest ? this.parse(options.latest, options) : NaN;
	
	      value = this.parse(value, options);
	
	      // 86400000 is the number of seconds in a day, this is used to remove
	      // the time from the date
	      if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
	        return options.message || this.notValid || "must be a valid date";
	      }
	
	      if (!isNaN(earliest) && value < earliest) {
	        err = this.tooEarly || "must be no earlier than %{date}";
	        err = v.format(err, {date: this.format(earliest, options)});
	        errors.push(err);
	      }
	
	      if (!isNaN(latest) && value > latest) {
	        err = this.tooLate || "must be no later than %{date}";
	        err = v.format(err, {date: this.format(latest, options)});
	        errors.push(err);
	      }
	
	      if (errors.length) {
	        return options.message || errors;
	      }
	    }, {
	      // This is the function that will be used to convert input to the number
	      // of millis since the epoch.
	      // It should return NaN if it's not a valid date.
	      parse: function(value, options) {
	        if (v.isFunction(v.XDate)) {
	          return new v.XDate(value, true).getTime();
	        }
	
	        if (v.isDefined(v.moment)) {
	          return +v.moment.utc(value);
	        }
	
	        throw new Error("Neither XDate or moment.js was found");
	      },
	      // Formats the given timestamp. Uses ISO8601 to format them.
	      // If options.dateOnly is true then only the year, month and day will be
	      // output.
	      format: function(date, options) {
	        var format = options.dateFormat;
	
	        if (v.isFunction(v.XDate)) {
	          format = format || (options.dateOnly ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss");
	          return new XDate(date, true).toString(format);
	        }
	
	        if (v.isDefined(v.moment)) {
	          format = format || (options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss");
	          return v.moment.utc(date).format(format);
	        }
	
	        throw new Error("Neither XDate or moment.js was found");
	      }
	    }),
	    date: function(value, options) {
	      options = v.extend({}, options, {dateOnly: true});
	      return v.validators.datetime.call(v.validators.datetime, value, options);
	    },
	    format: function(value, options) {
	      if (v.isString(options) || (options instanceof RegExp)) {
	        options = {pattern: options};
	      }
	
	      options = v.extend({}, this.options, options);
	
	      var message = options.message || this.message || "is invalid"
	        , pattern = options.pattern
	        , match;
	
	      // Empty values are allowed
	      if (v.isEmpty(value)) {
	        return;
	      }
	      if (!v.isString(value)) {
	        return message;
	      }
	
	      if (v.isString(pattern)) {
	        pattern = new RegExp(options.pattern, options.flags);
	      }
	      match = pattern.exec(value);
	      if (!match || match[0].length != value.length) {
	        return message;
	      }
	    },
	    inclusion: function(value, options) {
	      // Empty values are fine
	      if (v.isEmpty(value)) {
	        return;
	      }
	      if (v.isArray(options)) {
	        options = {within: options};
	      }
	      options = v.extend({}, this.options, options);
	      if (v.contains(options.within, value)) {
	        return;
	      }
	      var message = options.message ||
	        this.message ||
	        "^%{value} is not included in the list";
	      return v.format(message, {value: value});
	    },
	    exclusion: function(value, options) {
	      // Empty values are fine
	      if (v.isEmpty(value)) {
	        return;
	      }
	      if (v.isArray(options)) {
	        options = {within: options};
	      }
	      options = v.extend({}, this.options, options);
	      if (!v.contains(options.within, value)) {
	        return;
	      }
	      var message = options.message || this.message || "^%{value} is restricted";
	      return v.format(message, {value: value});
	    },
	    email: v.extend(function(value, options) {
	      options = v.extend({}, this.options, options);
	      var message = options.message || this.message || "is not a valid email";
	      // Empty values are fine
	      if (v.isEmpty(value)) {
	        return;
	      }
	      if (!v.isString(value)) {
	        return message;
	      }
	      if (!this.PATTERN.exec(value)) {
	        return message;
	      }
	    }, {
	      PATTERN: /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
	    }),
	    equality: function(value, options, attribute, attributes) {
	      if (v.isEmpty(value)) {
	        return;
	      }
	
	      if (v.isString(options)) {
	        options = {attribute: options};
	      }
	      options = v.extend({}, this.options, options);
	      var message = options.message ||
	        this.message ||
	        "is not equal to %{attribute}";
	
	      if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
	        throw new Error("The attribute must be a non empty string");
	      }
	
	      var otherValue = v.getDeepObjectValue(attributes, options.attribute)
	        , comparator = options.comparator || function(v1, v2) {
	          return v1 === v2;
	        };
	
	      if (!comparator(value, otherValue, options, attribute, attributes)) {
	        return v.format(message, {attribute: v.prettify(options.attribute)});
	      }
	    }
	  };
	
	  validate.exposeModule(validate, this, exports, module, __webpack_require__(63));
	}).call(this,
	         true ? /* istanbul ignore next */ exports : null,
	         true ? /* istanbul ignore next */ module : null,
	        __webpack_require__(63));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)(module)))

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	        Q = __webpack_require__(26),
	        $ = __webpack_require__(33),
	        moment = __webpack_require__(44),
	        validate = __webpack_require__(62)
	
	        ;
	
	var Store = __webpack_require__(55);
	
	var MybookingData = Store.extend({
	    computed: {
	        price: function () {
	            _.reduce(this.get(' '))
	        }
	    },
	    refreshCurrentCart: function (view) {
	        //console.log("refreshCurrentCart");
	        return Q.Promise(function (resolve, reject, progress) {
	            $.ajax({
	                type: 'POST',
	                url: '/b2c/airCart/getCartDetails/' + _.parseInt(view.get('currentCartId')),
	                dataType: 'json',
	                data: {'data': ''},
	                success: function (data) {
	                    var details = {
	                        id: data.id, email: data.email, upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity,
	                        curency: data.curency, fop: data.fop, baseprice: data.baseprice, taxes: data.taxes, convfee: data.convfee, fee: data.fee, totalAmountinwords: data.totalAmountinwords, customercare: data.customercare, promodiscount: data.promo_discount,
	                        bookings: _.map(data.bookings, function (i) {
	                            return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
	                                traveller: _.map(i.traveller, function (t) {
	                                    return {
	                                        id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
	                                        airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,product_class:t.product_class,
	                                        basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status, statusmsg: t.statusmsg, selected: false,
	                                        routes: _.map(t.routes, function (ro) {
	                                            return {
	                                                id: ro.id, origin: ro.origin, originDetails: ro.originDetails, destinationDetails: ro.destinationDetails, destination: ro.destination, departure: ro.departure, arrival: ro.arrival, carrier: ro.carrier, logo: ro.logo, carrierName: ro.carrierName, flightNumber: ro.flightNumber,
	                                                flighttime: ro.flighttime, originTerminal: ro.originTerminal, destinationTerminal: ro.destinationTerminal, meal: ro.meal, seat: ro.seat, aircraft: ro.aircraft,
	                                            };
	                                        }).sort(function (x, y) {
	                                            var d1 = new Date(x.departure);
	                                            var d2 = new Date(y.departure);
	                                            if (d1 > d2) {
	                                                return 1;
	                                            } else {
	                                                return -1;
	                                            }
	                                            ;
	
	                                        })
	                                    };
	                                }),
	                                routes: _.map(i.routes, function (t) {
	                                    return {
	                                        id: t.id, origin: t.origin, originDetails: t.originDetails, destinationDetails: t.destinationDetails, destination: t.destination, departure: t.departure, arrival: t.arrival, carrier: t.carrier, carrierName: t.carrierName, flightNumber: t.flightNumber,
	                                        flighttime: t.flighttime, originTerminal: t.originTerminal, destinationTerminal: t.destinationTerminal, meal: t.meal, seat: t.seat, aircraft: t.aircraft,
	                                    };
	                                }),
	                            };
	                        }).sort(function (x, y) {
	                            var d1 = new Date(x.departure);
	                            var d2 = new Date(y.departure);
	                            if (d1 > d2) {
	                                return 1
	                            } else {
	                                return -1
	                            }
	                            ;
	
	                        }), };
	
	                    // console.log(details);
	                    //console.log(data);
	                    view.set('currentCartDetails', details);
	                    var index = _.findIndex(view.get('carts'), {'id': details.id});
	                    // console.log('index: '+index);
	
	                    var carts = view.get('carts');
	                    carts[index].booking_status = details.booking_status;
	                    view.set('carts', carts);
	                    view.set('summary', false);
	                    view.set('pending', false);
	
	                    resolve();
	                },
	                error: function (error) {
	                    alert(error);
	                }
	            });
	        }).then(function () {
	            console.log('finsihed store: ');
	        }, function (error) {
	            console.log(error);
	        });
	    },
	});
	
	MybookingData.getCurrentCart = function (id) {
	    // console.log("getCurrentCart");
	    return Q.Promise(function (resolve, reject, progress) {
	        $.ajax({
	            type: 'POST',
	            url: '/b2c/airCart/getCartDetails/' + _.parseInt(id),
	            dataType: 'json',
	            data: {'data': ''},
	            success: function (data) {
	                //console.log(data.bookings: _.map(data.bookings, function (i) {console.log(i);}));
	                // console.log("done");
	            },
	            error: function (error) {
	                alert(error);
	            }
	        }).then(function (data) {
	            //console.log(data);
	            var details1 = {
	                bookings: _.map(data.bookings, function (i) {
	                    return {source: i.source, destination: i.destination,
	                        traveller: _.map(i.traveller, function (t) {
	                            return {
	                                routes: _.map(t.routes, function (ro) {
	                                    return {origin: ro.origin, destination: ro.destination};
	                                })
	                            };
	                        }),
	                        routes: _.map(i.routes, function (t) {
	                            return {origin: t.origin, destination: t.destination};
	                        })
	                    };
	                })};
	            var obj_length = details1.bookings[0].routes.length;
	            var allorigins = [];
	            var alldestinations = [];
	            for (var a = 0; a < obj_length; a++)
	            {
	                allorigins.push(details1.bookings[0].routes[a].origin);
	                alldestinations.push(details1.bookings[0].routes[a].destination);
	            }
	            if (alldestinations.length > 1)
	            {
	                //console.log(allorigins);console.log(alldestinations);
	                var change_one = [];
	                for (var b = 0; b < alldestinations.length; b++)
	                {
	                    if (typeof allorigins[b + 1] !== "undefined")
	                    {
	                        //console.log(allorigins[b+1]);
	                        if (allorigins[b + 1] != alldestinations[b])
	                        {
	                            var msg = "AC";
	                            change_one.push(allorigins[b + 1]);
	                            change_one.push(alldestinations[b]);
	                        }
	                    }
	                }
	            }
	            if (typeof msg !== "undefined" && msg == "AC")
	            {
	                var message = "Airport Change";
	            }
	            //console.log(msg);console.log(change_one);
	            var details = {
	                airport_change: message, airport_change_name: change_one, transit: data.transit,
	                id: data.id, email: data.email, ticketstatusmsg: data.ticketstatusmsg, upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, clientSourceId: data.clientSourceId, segNights: data.segNights,
	                booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency, fop: data.fop, baseprice: data.baseprice, taxes: data.taxes, convfee: data.convfee, fee: data.fee, totalAmountinwords: data.totalAmountinwords, customercare: data.customercare, promodiscount: data.promo_discount,
	                bookings: _.map(data.bookings, function (i) {
	                    return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
	                        traveller: _.map(i.traveller, function (t) {
	                            return {
	                                id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
	                                airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,product_class:t.product_class,
	                                basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status, statusmsg: t.statusmsg, selected: false,
	                                routes: _.map(t.routes, function (ro) {
	                                    return {
	                                        id: ro.id, origin: ro.origin, originDetails: ro.originDetails, logo: ro.logo, destinationDetails: ro.destinationDetails, destination: ro.destination, departure: ro.departure, arrival: ro.arrival, carrier: ro.carrier, carrierName: ro.carrierName, flightNumber: ro.flightNumber,
	                                        flighttime: ro.flighttime, originTerminal: ro.originTerminal, destinationTerminal: ro.destinationTerminal, meal: ro.meal, seat: ro.seat, aircraft: ro.aircraft,
	                                    };
	                                })
	                            };
	                        }),
	                        routes: _.map(i.routes, function (t) {
	                            return {
	                                id: t.id, origin: t.origin, originDetails: t.originDetails, logo: t.logo, destinationDetails: t.destinationDetails, destination: t.destination, departure: t.departure, arrival: t.arrival, carrier: t.carrier, carrierName: t.carrierName, flightNumber: t.flightNumber,
	                                flighttime: t.flighttime, originTerminal: t.originTerminal, destinationTerminal: t.destinationTerminal, meal: t.meal, seat: t.seat, aircraft: t.aircraft, techStop: t.techStop,
	                            };
	                        })
	//                            .sort(function (x, y) {
	//                            var d1 = new Date(x.departure);
	//                            var d2 = new Date(y.departure);
	//                            if (d1 > d2) {
	//                                return 1
	//                            } else {
	//                                return -1
	//                            }
	//                            ;
	//
	//                        }),
	
	                    };
	                })};
	
	            /*CHECK AIRPORT CHANGE AND GET*/
	
	            /*CHECK AIRPORT CHANGE AND GET*/
	
	            data.currentCartDetails = details;
	
	            data.carts = [];
	            data.carts.push(details);
	            data.cabinType = 1;
	            data.add = false;
	            data.edit = false;
	            data.currentCartId = details.id;
	            //console.log(data.currentCartDetails);
	            data.summary = false;
	            data.print = false;
	            data.pending = false;
	            data.amend = false;
	            data.cancel = false;
	            data.reschedule = false;
	
	            data.errors = {};
	            data.results = [];
	
	            data.filter = {};
	            data.filtered = {};
	            return resolve(new MybookingData({data: data}));
	
	
	        }, function (error) {
	            console.log(error);
	        })
	    });
	};
	
	MybookingData.parse = function (data) {
	    //console.log("MybookingData.parse");
	    //data.flights = _.map(data.flights, function(i) { return Flight.parse(i); });
	    //   console.log(data);   
	    var flgUpcoming = false;
	    var flgPrevious = false;
	    data.carts = _.map(data, function (i) {
	        if (i.upcoming == 'true')
	            flgUpcoming = true;
	        else
	            flgPrevious = true;
	        return {id: i.id, email: i.email, created: i.created, totalAmount: i.totalAmount, booking_status: i.booking_status,
	            returndate: i.returndate, isMultiCity: i.isMultiCity, curency: i.curency, upcoming: i.upcoming,
	            bookings: _.map(i.bookings, function (b) {
	
	                return {
	                    id: b.id, source: b.source, destination: b.destination, source_id: b.source_id, destination_id: b.destination_id,
	                    departure: b.departure, arrival: b.arrival,
	                    travelers: _.map(b.traveller, function (t) {
	                        return {id: t.id, name: t.name};
	                    }),
	                };
	            }).sort(function (x, y) {
	                var d1 = new Date(x.departure);
	                var d2 = new Date(y.departure);
	                if (d1 > d2) {
	                    return 1
	                } else {
	                    return -1
	                }
	                ;
	
	            }),
	            traveler: _.map(i.travellerdtl, function (j) {
	                return {id: j.id, name: j.name,
	                    src: _.map(j.src, function (g) {
	                        return {name: g};
	                    }),
	                    dest: _.map(j.dest, function (g) {
	                        return {name: g};
	                    }),
	                };
	            }),
	        };
	    });
	    data.carts.sort(function (x, y) {
	        if (x.id < y.id) {
	            return 1
	        } else {
	            return -1
	        }
	        ;
	
	    });
	    //         console.log(data.carts);  
	    //          data.currentTraveller= _.first(data.travellers);
	    //           data.currentTravellerId=data.currentTraveller.id;
	    data.cabinType = 1;
	    data.add = false;
	    data.edit = false;
	    data.currentCartId = null;
	    data.currentCartDetails = null;
	    data.summary = true;
	    data.pending = true;
	    data.amend = false;
	    data.cancel = false;
	    data.print = false;
	    data.reschedule = false;
	    data.flgUpcoming = flgUpcoming;
	    data.flgPrevious = flgPrevious;
	    data.errors = {};
	    data.results = [];
	
	    data.filter = {};
	    data.filtered = {};
	    return new MybookingData({data: data});
	
	};
	MybookingData.fetch = function () {
	    //console.log("MybookingData.fetch");
	    return Q.Promise(function (resolve, reject) {
	        $.getJSON('/b2c/airCart/getMyBookings')
	                .then(function (data) {
	                    resolve(MybookingData.parse(data));
	
	                })
	                .fail(function (data) {
	                    //TODO: handle error
	                    console.log("failed");
	                    console.log(data);
	                });
	    });
	};
	module.exports = MybookingData;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Store = __webpack_require__(55),
	    moment = __webpack_require__(44),
	    validate = __webpack_require__(62),
	    $ = __webpack_require__(33),
	    _ = __webpack_require__(30)
	    ;
	
	module.exports = Store.extend({
	    quene: [],
	
	    data: function() {
	        
	        var getData=function(data){
	          //  console.log(data);
	        };
	        var getData1=function(data){
	            console.log("error");
	            console.log(data);
	        };
	        var doajax=function(getData){
	         $.ajax({
	                type: 'POST',                
	                url: 'b2c/traveler/getMyTravelersList',  
	                success: getData,
	                error: getData1
	            });
	    };
	        doajax(getData);
	       
	        return {
	            
	            currentTraveller: {id: 1,title:'Mr.', email: 'prashant@gmail.com', mobile: '9412357926',  first_name: 'Prashant', 
	                last_name:'Kumar',birthdate:'2001-05-30',baseUrl:'',passport_number:'342123',passport_place:'India'
	            },
	            currentTravellerId:1,
	            cabinType: 1,
	            add:false,
	            edit:false,
	            titles:[{id:1,text:'Mr.'},{id:2,text:'Mrs.'},{id:3,text:'Ms.'},{id:4,text:'Miss'},{id:5,text:'Mstr.'},{id:6,text:'Inf.'}],
	            passengers: [1, 0, 0],
	            travellers: [
	                { id: 1,title:'Mr.', email: 'prashant@gmail.com', mobile: '9412357926',passport_number:'2542342',passport_place:'India', 
	                    first_name: 'Prashant', last_name:'Kumar',birthdate:'2001-05-30',baseUrl:''},
	                { id: 2,title:'Mr.', email: 'Michael@gmail.com', mobile: '1234567890',passport_number:'3123123',passport_place:'India', 
	                    first_name: 'Michael', last_name:'Jain',birthdate:'2005-03-03',baseUrl:''},
	                { id: 3,title:'Mr.', email: 'belair@gmail.com', mobile: '1234567890',passport_number:'1231231',passport_place:'India',
	                    first_name: 'Belair', last_name:'Travels',birthdate:'2002-02-20',baseUrl:''}
	            ],
	
	            pending: false,
	            errors: {},
	            results: [],
	
	            filter: {},
	            filtered: {},
	           
	        }
	    },
	
	    
	    run: function() {
	        var view = this;
	    if(this.get().add){        
	        var newtraveller=_.pick(this.get(), 'currentTraveller'); 
	        var travellers=this.get().travellers;
	        var t=newtraveller.currentTraveller.title;
	        var titles=_.cloneDeep(this.get().titles);
	        var title;
	         _.each(titles, function(i, k) { if (i.id==t) title=i.text; });
	      
	        var currenttraveller={id: 4,title:title, email: newtraveller.currentTraveller.email, mobile: newtraveller.currentTraveller.mobile,  first_name: newtraveller.currentTraveller.first_name, 
	                last_name:newtraveller.currentTraveller.last_name,birthdate:newtraveller.currentTraveller.birthdate.format('YYYY-MM-DD'),baseUrl:'',passport_number:newtraveller.currentTraveller.passport_number,passport_place:newtraveller.currentTraveller.passport_place
	            };
	        travellers.push(currenttraveller);
	        //console.log(travellers);
	        this.set('travellers',travellers);
	        this.set('currentTraveller',currenttraveller);
	        this.set('currentTravellerId',4);
	    }
	    else if(this.get().edit){
	        var newtraveller=this.get().currentTraveller; 
	        var travellers=this.get().travellers;
	        var t=newtraveller.title;
	        var titles=_.cloneDeep(this.get().titles);
	        var title;
	        var id=this.get().currentTravellerId;
	         _.each(titles, function(i, k) { /*console.log(i);*/ if (i.id==t) title=i.text; });
	      
	        var currenttraveller={id: id,title:title, email: newtraveller.email, mobile: newtraveller.mobile,  first_name: newtraveller.first_name, 
	                last_name:newtraveller.last_name,birthdate:newtraveller.birthdate.format('YYYY-MM-DD'),baseUrl:'',passport_number:newtraveller.passport_number,passport_place:newtraveller.passport_place
	            };
	        var index= _.findIndex(this.get().travellers, { 'id': id});
	        this.splice('travellers', index, 1);
	      //  console.log(currenttraveller);
	        travellers.push(currenttraveller);
	        //console.log(travellers);
	        this.set('travellers',travellers);
	        this.set('currentTraveller',currenttraveller);        
	    }
	        this.set('add',false); 
	        this.set('edit',false); 
	        //,
	     /*       search = _.pick(this.get(), ['tripType', 'cabinType', 'passengers']);
	
	        this.set('errors', {});
	        this.set('pending', true);
	        this.quene = [];
	
	
	        _.each(this.get('flights'), function(i, k) {
	            view.quene[view.quene.length] = $.ajax({
	                type: 'POST',
	                url: '/b2c/flights/search',
	                data: _.extend({}, search, {
	                    from: i.from,
	                    to: i.to,
	                    depart_at: moment.isMoment(i.depart_at) ? i.depart_at.format('YYYY-MM-DD') : null,
	                    return_at: moment.isMoment(i.return_at) ? i.return_at.format('YYYY-MM-DD') : null
	                }),
	                dataType: 'json',
	                success: function(data) { view.importResults(k, data); },
	                error: function(xhr) { view.handleError(k, xhr); }
	            })
	        });
	
	        $.when.apply(undefined, this.quene)
	            .done(function() { view.set('pending', false); view.set('finished', true); }); */
	    },
	
	    importResults: function(k, data) {
	        this.set('filtered', {});
	        this.set('results.' + k, data);
	
	        var prices = [],
	            carriers = [];
	
	        _.each(data, function(i) {
	            prices[prices.length] = i.price;
	            carriers[carriers.length] = i.itinerary[0].segments[0].carrier;
	        });
	
	
	        carriers = _.unique(carriers, 'code');
	
	        this.set('filter', {
	            prices: [Math.min.apply(null, prices), Math.max.apply(null, prices)],
	            carriers: carriers
	        });
	
	        this.set('filtered.carriers', _.map(carriers, function(i) { return i.code; }));
	    },
	
	    handleError: function(k, xhr) {
	
	    }
	
	
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(33),
	        Q = __webpack_require__(26)
	        ;
	
	var Form = __webpack_require__(34)
	        ;
	
	var Dialog = Form.extend({
	    template: __webpack_require__(67),
	    modalType: 1,
	    data: function () {
	        return {
	            header: 'header',
	            message: 'message',
	            buttons: [
	                ['Ok', function() { alert('zzz'); }],
	                ['Cancel', function() { alert('yyy') }]
	            ],
	            closeButton: true
	        }
	    },
	    oncomplete: function () {
	        if (Dialog.modalType === 2) {
	            var options = {
	                keyboardShortcuts: false,
	                closable: false
	            };
	            $(this.find('.ui.modal')).modal(options).modal('show');
	        } else {
	            $(this.find('.ui.modal')).modal('show');
	        }
	
	    },
	    click: function (event, cb) {
	        cb.bind(this)(event);
	    }
	});
	
	
	Dialog.open = function (options, type) {
	    var dialog = new Dialog();
	    Dialog.modalType = type;
	    dialog.set(options);
	    dialog.render('#popup-container');
	};
	
	module.exports = Dialog;

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui  small modal"},"f":[{"t":4,"f":[{"t":7,"e":"i","a":{"class":"close icon"}}],"n":50,"r":"closeButton"}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":2,"r":"header"}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":3,"r":"message"}]}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui button"},"v":{"click":{"m":"click","a":{"r":["event","./1"],"s":"[_0,_1]"}}},"f":[{"t":2,"r":"./0"}]}],"n":52,"r":"buttons"}]}]}]};

/***/ },
/* 68 */,
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var accounting = __webpack_require__(70)
	    ;
	
	var Meta = __webpack_require__(68)
	    ;
	
	module.exports = function(amount) {
	    if (Meta.object) {
	        return accounting.formatMoney(
	            amount * Meta.object.get('xChange')[Meta.object.get('display_currency')],
	            '<i class="' + Meta.object.get('display_currency').toLowerCase()  + ' icon currency"></i>',
	            0
	        );
	    }
	
	    return accounting.formatMoney(amount, '<i class="inr icon currency"></i>', 0);
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * accounting.js v0.3.2
	 * Copyright 2011, Joss Crowcroft
	 *
	 * Freely distributable under the MIT license.
	 * Portions of accounting.js are inspired or borrowed from underscore.js
	 *
	 * Full details and documentation:
	 * http://josscrowcroft.github.com/accounting.js/
	 */
	
	(function(root, undefined) {
	
		/* --- Setup --- */
	
		// Create the local library object, to be exported or referenced globally later
		var lib = {};
	
		// Current version
		lib.version = '0.3.2';
	
	
		/* --- Exposed settings --- */
	
		// The library's settings configuration object. Contains default parameters for
		// currency and number formatting
		lib.settings = {
			currency: {
				symbol : "$",		// default currency symbol is '$'
				format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
				decimal : ".",		// decimal point separator
				thousand : ",",		// thousands separator
				precision : 2,		// decimal places
				grouping : 3		// digit grouping (not implemented yet)
			},
			number: {
				precision : 0,		// default precision on numbers is 0
				grouping : 3,		// digit grouping (not implemented yet)
				thousand : ",",
				decimal : "."
			}
		};
	
	
		/* --- Internal Helper Methods --- */
	
		// Store reference to possibly-available ECMAScript 5 methods for later
		var nativeMap = Array.prototype.map,
			nativeIsArray = Array.isArray,
			toString = Object.prototype.toString;
	
		/**
		 * Tests whether supplied parameter is a string
		 * from underscore.js
		 */
		function isString(obj) {
			return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
		}
	
		/**
		 * Tests whether supplied parameter is a string
		 * from underscore.js, delegates to ECMA5's native Array.isArray
		 */
		function isArray(obj) {
			return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
		}
	
		/**
		 * Tests whether supplied parameter is a true object
		 */
		function isObject(obj) {
			return toString.call(obj) === '[object Object]';
		}
	
		/**
		 * Extends an object with a defaults object, similar to underscore's _.defaults
		 *
		 * Used for abstracting parameter handling from API methods
		 */
		function defaults(object, defs) {
			var key;
			object = object || {};
			defs = defs || {};
			// Iterate over object non-prototype properties:
			for (key in defs) {
				if (defs.hasOwnProperty(key)) {
					// Replace values with defaults only if undefined (allow empty/zero values):
					if (object[key] == null) object[key] = defs[key];
				}
			}
			return object;
		}
	
		/**
		 * Implementation of `Array.map()` for iteration loops
		 *
		 * Returns a new Array as a result of calling `iterator` on each array value.
		 * Defers to native Array.map if available
		 */
		function map(obj, iterator, context) {
			var results = [], i, j;
	
			if (!obj) return results;
	
			// Use native .map method if it exists:
			if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	
			// Fallback for native .map:
			for (i = 0, j = obj.length; i < j; i++ ) {
				results[i] = iterator.call(context, obj[i], i, obj);
			}
			return results;
		}
	
		/**
		 * Check and normalise the value of precision (must be positive integer)
		 */
		function checkPrecision(val, base) {
			val = Math.round(Math.abs(val));
			return isNaN(val)? base : val;
		}
	
	
		/**
		 * Parses a format string or object and returns format obj for use in rendering
		 *
		 * `format` is either a string with the default (positive) format, or object
		 * containing `pos` (required), `neg` and `zero` values (or a function returning
		 * either a string or object)
		 *
		 * Either string or format.pos must contain "%v" (value) to be valid
		 */
		function checkCurrencyFormat(format) {
			var defaults = lib.settings.currency.format;
	
			// Allow function as format parameter (should return string or object):
			if ( typeof format === "function" ) format = format();
	
			// Format can be a string, in which case `value` ("%v") must be present:
			if ( isString( format ) && format.match("%v") ) {
	
				// Create and return positive, negative and zero formats:
				return {
					pos : format,
					neg : format.replace("-", "").replace("%v", "-%v"),
					zero : format
				};
	
			// If no format, or object is missing valid positive value, use defaults:
			} else if ( !format || !format.pos || !format.pos.match("%v") ) {
	
				// If defaults is a string, casts it to an object for faster checking next time:
				return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {
					pos : defaults,
					neg : defaults.replace("%v", "-%v"),
					zero : defaults
				};
	
			}
			// Otherwise, assume format was fine:
			return format;
		}
	
	
		/* --- API Methods --- */
	
		/**
		 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
		 * alias: accounting.`parse(string)`
		 *
		 * Decimal must be included in the regular expression to match floats (default: "."), so if the number
		 * uses a non-standard decimal separator, provide it as the second argument.
		 *
		 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
		 *
		 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
		 */
		var unformat = lib.unformat = lib.parse = function(value, decimal) {
			// Recursively unformat arrays:
			if (isArray(value)) {
				return map(value, function(val) {
					return unformat(val, decimal);
				});
			}
	
			// Fails silently (need decent errors):
			value = value || 0;
	
			// Return the value as-is if it's already a number:
			if (typeof value === "number") return value;
	
			// Default decimal point is "." but could be set to eg. "," in opts:
			decimal = decimal || ".";
	
			 // Build regex to strip out everything except digits, decimal point and minus sign:
			var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
				unformatted = parseFloat(
					("" + value)
					.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
					.replace(regex, '')         // strip out any cruft
					.replace(decimal, '.')      // make sure decimal point is standard
				);
	
			// This will fail silently which may cause trouble, let's wait and see:
			return !isNaN(unformatted) ? unformatted : 0;
		};
	
	
		/**
		 * Implementation of toFixed() that treats floats more like decimals
		 *
		 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
		 * problems for accounting- and finance-related software.
		 */
		var toFixed = lib.toFixed = function(value, precision) {
			precision = checkPrecision(precision, lib.settings.number.precision);
			var power = Math.pow(10, precision);
	
			// Multiply up by precision, round accurately, then divide and use native toFixed():
			return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
		};
	
	
		/**
		 * Format a number, with comma-separated thousands and custom precision/decimal places
		 *
		 * Localise by overriding the precision and thousand / decimal separators
		 * 2nd parameter `precision` can be an object matching `settings.number`
		 */
		var formatNumber = lib.formatNumber = function(number, precision, thousand, decimal) {
			// Resursively format arrays:
			if (isArray(number)) {
				return map(number, function(val) {
					return formatNumber(val, precision, thousand, decimal);
				});
			}
	
			// Clean up number:
			number = unformat(number);
	
			// Build options object from second param (if object) or all params, extending defaults:
			var opts = defaults(
					(isObject(precision) ? precision : {
						precision : precision,
						thousand : thousand,
						decimal : decimal
					}),
					lib.settings.number
				),
	
				// Clean up precision
				usePrecision = checkPrecision(opts.precision),
	
				// Do some calc:
				negative = number < 0 ? "-" : "",
				base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
				mod = base.length > 3 ? base.length % 3 : 0;
	
			// Format the number:
			return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
		};
	
	
		/**
		 * Format a number into currency
		 *
		 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
		 * defaults: (0, "$", 2, ",", ".", "%s%v")
		 *
		 * Localise by overriding the symbol, precision, thousand / decimal separators and format
		 * Second param can be an object matching `settings.currency` which is the easiest way.
		 *
		 * To do: tidy up the parameters
		 */
		var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) {
			// Resursively format arrays:
			if (isArray(number)) {
				return map(number, function(val){
					return formatMoney(val, symbol, precision, thousand, decimal, format);
				});
			}
	
			// Clean up number:
			number = unformat(number);
	
			// Build options object from second param (if object) or all params, extending defaults:
			var opts = defaults(
					(isObject(symbol) ? symbol : {
						symbol : symbol,
						precision : precision,
						thousand : thousand,
						decimal : decimal,
						format : format
					}),
					lib.settings.currency
				),
	
				// Check format (returns object with pos, neg and zero):
				formats = checkCurrencyFormat(opts.format),
	
				// Choose which format to use for this value:
				useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;
	
			// Return with currency symbol added:
			return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
		};
	
	
		/**
		 * Format a list of numbers into an accounting column, padding with whitespace
		 * to line up currency symbols, thousand separators and decimals places
		 *
		 * List should be an array of numbers
		 * Second parameter can be an object containing keys that match the params
		 *
		 * Returns array of accouting-formatted number strings of same length
		 *
		 * NB: `white-space:pre` CSS rule is required on the list container to prevent
		 * browsers from collapsing the whitespace in the output strings.
		 */
		lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {
			if (!list) return [];
	
			// Build options object from second param (if object) or all params, extending defaults:
			var opts = defaults(
					(isObject(symbol) ? symbol : {
						symbol : symbol,
						precision : precision,
						thousand : thousand,
						decimal : decimal,
						format : format
					}),
					lib.settings.currency
				),
	
				// Check format (returns object with pos, neg and zero), only need pos for now:
				formats = checkCurrencyFormat(opts.format),
	
				// Whether to pad at start of string or after currency symbol:
				padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,
	
				// Store value for the length of the longest string in the column:
				maxLength = 0,
	
				// Format the list according to options, store the length of the longest string:
				formatted = map(list, function(val, i) {
					if (isArray(val)) {
						// Recursively format columns if list is a multi-dimensional array:
						return lib.formatColumn(val, opts);
					} else {
						// Clean up the value
						val = unformat(val);
	
						// Choose which format to use for this value (pos, neg or zero):
						var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,
	
							// Format this value, push into formatted list and save the length:
							fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	
						if (fVal.length > maxLength) maxLength = fVal.length;
						return fVal;
					}
				});
	
			// Pad each number in the list and send back the column of numbers:
			return map(formatted, function(val, i) {
				// Only if this is a string (not a nested array, which would have already been padded):
				if (isString(val) && val.length < maxLength) {
					// Depending on symbol position, pad after symbol or at index 0:
					return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
				}
				return val;
			});
		};
	
	
		/* --- Module Definition --- */
	
		// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
		// Otherwise, just add `accounting` to the global object
		if (true) {
			if (typeof module !== 'undefined' && module.exports) {
				exports = module.exports = lib;
			}
			exports.accounting = lib;
		} else if (typeof define === 'function' && define.amd) {
			// Return the library as an AMD module:
			define([], function() {
				return lib;
			});
		} else {
			// Use accounting.noConflict to restore `accounting` back to its original value.
			// Returns a reference to the library's `accounting` object;
			// e.g. `var numbers = accounting.noConflict();`
			lib.noConflict = (function(oldAccounting) {
				return function() {
					// Reset the value of the root's `accounting` variable:
					root.accounting = oldAccounting;
					// Delete the noConflict method:
					lib.noConflict = undefined;
					// Return reference to the library to re-assign it:
					return lib;
				};
			})(root.accounting);
	
			// Declare `fx` on the root (global/window) object:
			root['accounting'] = lib;
		}
	
		// Root will be `window` in browser or `global` on the server:
	}(this));


/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"style","f":["#app > .wrapper > .content { display: block !important; }"]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"id":"booking"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment center aligned"},"f":[{"t":7,"e":"h1","f":[{"t":2,"r":"booking.error"}]}," ",{"t":7,"e":"a","v":{"click":{"m":"back2","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button"},"f":["Go Back to Search Results"]}]}],"n":50,"r":"booking.error"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui segment"},"f":[{"t":7,"e":"h1","f":["The simplest way to book !"]}," ",{"t":7,"e":"a","v":{"click":{"m":"back","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button middle gray back"},"f":["Go Back"]}," ",{"t":7,"e":"div","a":{"class":"currencyWrap"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"curterm","style":["display:",{"t":4,"f":["none"],"n":50,"x":{"r":["meta.display_currency"],"s":"_0==\"INR\""}},{"t":4,"n":51,"f":["block"],"x":{"r":["meta.display_currency"],"s":"_0==\"INR\""}}]},"f":["Currency Amount are Indicative Equivalent to INR"]}],"n":50,"r":"meta.display_currency"}," ",{"t":7,"e":"span","f":["Currency:"]}," ",{"t":7,"e":"select","a":{"class":"menu transition","style":"z-index: 1010;","id":"currency1"},"v":{"change":{"m":"setCurrencyBooking","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"option","a":{"value":"INR"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"INR\""}}],"f":[{"t":7,"e":"i","a":{"class":"inr icon currency"}}," Rupee"]}," ",{"t":7,"e":"option","a":{"value":"USD"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"USD\""}}],"f":[{"t":7,"e":"i","a":{"class":"usd icon currency"}}," US Dollar"]}," ",{"t":7,"e":"option","a":{"value":"EUR"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"EUR\""}}],"f":[{"t":7,"e":"i","a":{"class":"eur icon currency"}}," Euro"]}," ",{"t":7,"e":"option","a":{"value":"GBP"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"GBP\""}}],"f":[{"t":7,"e":"i","a":{"class":"gbp icon currency"}}," UK Pound"]}," ",{"t":7,"e":"option","a":{"value":"AUD"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"AUD\""}}],"f":[{"t":7,"e":"i","a":{"class":"usd icon currency"}}," Australian Dollar"]}," ",{"t":7,"e":"option","a":{"value":"JPY"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"JPY\""}}],"f":[{"t":7,"e":"i","a":{"class":"jpy icon currency"}}," Japanese Yen"]}," ",{"t":7,"e":"option","a":{"value":"RUB"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"RUB\""}}],"f":[{"t":7,"e":"i","a":{"class":"rub icon currency"}}," Russian Ruble"]}," ",{"t":7,"e":"option","a":{"value":"AED"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"AED\""}}],"f":[{"t":7,"e":"i","a":{"class":"aed icon currency"}}," Dirham"]}]}]}," ",{"t":7,"e":"div","a":{"class":"clear"}}," ",{"t":7,"e":"step1","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step2","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step3","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step4","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}]}],"r":"booking.error"}]}],"n":50,"r":"booking"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"id":"booking"},"f":[{"t":7,"e":"div","a":{"class":"ui segment"},"f":[{"t":7,"e":"h1","f":["Booking not found!"]}]}]}],"n":50,"r":"error"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"payment_loader"},"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"wait_text"},"f":["Please Wait"]},{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui text loader loader_position"}}]}]}],"r":"error"}],"r":"booking"}]}]};

/***/ },
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30)
	        ;
	
	var Form = __webpack_require__(34),
	        Auth = __webpack_require__(80)
	        ;
	
	var h_money = __webpack_require__(69),
	        h_duration = __webpack_require__(81)()
	        ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(82),
	    components: {
	        itinerary: __webpack_require__(83),
	        'ui-code': __webpack_require__(85),
	        'ui-email': __webpack_require__(86)
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
	
	        if (false) {
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

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(33),
	    Q = __webpack_require__(26)
	    ;
	
	var Form = __webpack_require__(34)
	    ;
	
	var Auth = Form.extend({
	    template: __webpack_require__(78),
	
	    data: function() {
	        return {
	            action: 'login',
	            submitting: false,
	            forgottenpass: false,
	
	            user: {
	
	            }
	        }
	    },
	
	    oncomplete: function() {
	        if (this.get('popup')) {
	            $(this.find('.ui.modal')).modal('show');
	        }
	    },
	
	    submit: function() {
	        var view = this;
	
	        this.set('errorMsg', null);
	        this.set('error', null);
	        this.set('submitting', true);
	        $.ajax({
	            type: 'POST',
	            url: '/b2c/auth/' + this.get('action'),
	            data: { username: this.get('user.login'), password: this.get('user.password') },
	            dataType: 'json',
	            complete: function() {
	                view.set('submitting', false);
	            },
	            success: function(data) {
	                $(view.find('.ui.modal')).modal('hide');
	
	                if (view.deferred) {
	                    view.deferred.resolve(data);
	                }                
	            },
	            error: function(xhr) {
	                try {
	                    var response = JSON.parse(xhr.responseText);
						if(response.errors['username'][0]=="You are already our B2B user.") {
							$("#B2BUserPopup").hide();
							$(".login .header").html('B2B User Login');
							view.set('B2BUserLoginPopupMessage',true);
						}
	                    else if (response.errors) {
	                        view.set('errors', response.errors);
	                    }
	                } catch (e) {
	                    view.set('errors', ['Server returned error. Please try again later']);
	                }
	            }
	        }).then(function (data) {
	                   
	            if (view.get('popup')==null && data && data.id) {
	                window.location.href = '/b2c/airCart/mybookings';
	            }
	        });
	    },
	
	    resetPassword: function(event) {
	        var view = this;
	
	        this.set('errors', null);
	        this.set('submitting', true);
	
	        $.ajax({
	            type: 'POST',
	            url: '/b2c/auth/forgottenpass',
	            data: { email: this.get('user.login') },
	            dataType: 'json',
	            complete: function() {
	                view.set('submitting', false);
	            },
	            success: function(data) {
	                view.set('resetsuccess', true);
	            },
	            error: function(xhr) {
	                try {
	                    var response = JSON.parse(xhr.responseText);
	
	                    if (response.errors) {
	                        view.set('errors', response.errors);
	                    } else if (response.message) {
	                        view.set('errors', [response.message]);
	                    }
	                } catch (e) {
	                    view.set('errors', ['Server returned error. Please try again later']);
	                }
	            }
	        });
	    },
	
	    signup: function(event) {
	        var view = this;
	
	        this.set('errors', null);
	        this.set('submitting', true);
	        $.ajax({
	            type: 'POST',
	            url: '/b2c/auth/signup',
	            data: _.pick(this.get('user'), ['email','name', 'mobile', 'password', 'password2']),
	            dataType: 'json',
	            complete: function() {
	                view.set('submitting', false);
	            },
	            success: function(data) {
	                view.set('signupsuccess', true);
	            },
	            error: function(xhr) {
	                try {
	                    var response = JSON.parse(xhr.responseText);
	
	                    if (response.errors) {
	                        view.set('errors', response.errors);
	                    } else if (response.message) {
	                        view.set('errors', [response.message]);
	                    }
	                } catch (e) {
	                    view.set('errors', ['Server returned error. Please try again later']);
	                }
	            }
	        });
	    }
	});
	
	
	Auth.login = function() {
	    var auth = new Auth();
	
	    auth.set('popup', true);
	    auth.deferred = Q.defer();
	    auth.render('#popup-container');
	
	    return auth.deferred.promise;
	};
	
	Auth.signup = function() {
	    var auth = new Auth();
	
	    auth.set('popup', true);
	    auth.set('signup', true);
	    auth.deferred = Q.defer();
	    auth.render('#popup-container');
	
	    return auth.deferred.promise;
	};
	
	module.exports = Auth;

/***/ },
/* 81 */
/***/ function(module, exports) {

	'use strict';
	
	function paddy(n, p, c) {
	    var pad_char = typeof c !== 'undefined' ? c : '0';
	    var pad = new Array(1 + p).join(pad_char);
	    return (pad + n).slice(-pad.length);
	}
	
	module.exports = function() {
	    return {
	        format: function(duration) {
	            if (!duration)
	                return;
	
	            var i = duration.asMinutes(),
	                hours = Math.floor(i/60),
	                minutes = i % 60
	                ;
	
	            return paddy(hours, 2) + 'h ' + paddy(minutes, 2) + 'm';
	        }
	    };
	};

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["step header step1 ",{"t":4,"f":["active"],"n":50,"r":"step.active"},{"t":4,"n":51,"f":[{"t":4,"f":["completed"],"n":50,"r":"step.completed"}],"r":"step.active"}],"role":"tab"},"f":["Itinerary"]}," ",{"t":4,"f":[{"t":7,"e":"table","a":{"class":"step1-summary segment"},"v":{"click":{"m":"activate","a":{"r":[],"s":"[1]"}}},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"logo"},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).carrier.logo"}}],"alt":""}}]}," ",{"t":7,"e":"td","a":{"class":"carrier"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).carrier.name"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"small"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).flight"}}]}]}," ",{"t":7,"e":"td","a":{"class":"itinerary"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.city"}}," → ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.city"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"small"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"D MMM, YYYY\")"}}]}]}," ",{"t":7,"e":"td","a":{"class":"duration"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"HH:mm\")"}}," — ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).arrive.format(\"HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"small"},"f":[{"t":2,"x":{"r":["duration","segtime","."],"s":"_0.format(_1(_2))"}}]}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"rowspan":[{"t":2,"x":{"r":["seg_length","booking.flights"],"s":"_0(_1)"}}],"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","booking.promo_value","booking.currency"],"s":"_0(_1+_2-_3,_4)"}}]}],"n":50,"x":{"r":["booking.promo_value"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","a":{"rowspan":[{"t":2,"x":{"r":["seg_length","booking.flights"],"s":"_0(_1)"}}],"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","booking.currency"],"s":"_0(_1+_2,_3)"}}]}],"x":{"r":["booking.promo_value"],"s":"_0!=null"}}],"n":50,"x":{"r":["i","j"],"s":"_0==0&&_1==0"}}]}],"n":52,"i":"j","r":"segments"}],"n":52,"i":"i","r":"booking.flights"}]}],"n":50,"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment step1 ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":[],"n":50,"r":"step.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"payment_loader"},"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"wait_text","style":"margin-top:95px !important;"},"f":["Please Wait"]}," ",{"t":7,"e":"div","a":{"class":"ui text loader loader_position"}}]}]}],"n":50,"r":"step.submitting"}," ",{"t":4,"f":[{"t":7,"e":"itinerary","a":{"flight":[{"t":2,"r":"."}]}}],"n":52,"r":"booking.flights"}," ",{"t":7,"e":"div","a":{"class":"ui basic segment booking-contacts"},"f":[{"t":7,"e":"div","a":{"class":"ui header"},"f":["Contact Details"]}," ",{"t":7,"e":"div","a":{"class":"ui two column middle top aligned relaxed fitted grid","style":"position: relative"},"f":[{"t":7,"e":"div","a":{"class":"column","style":"width: 65%;"},"f":[{"t":7,"e":"div","a":{"class":"two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"label","f":["E-Mail"]}," ",{"t":7,"e":"ui-email","a":{"class":[{"t":4,"f":["bold"],"n":50,"r":"booking.user.email"}],"name":"email","placeholder":"E-Mail","error":[{"t":2,"r":"step.errors.email"}],"value":[{"t":2,"r":"booking.user.email"}],"readonly":[{"t":4,"f":["readonly"],"n":50,"r":"meta.user.email"},{"t":4,"n":51,"f":[],"r":"meta.user.email"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field phone"},"f":[{"t":7,"e":"label","f":["Mobile"]}," ",{"t":7,"e":"ui-input","a":{"class":"code input","name":"mobile","placeholder":"Code","error":[{"t":2,"r":"step.errors.mobile"}],"value":[{"t":2,"r":"booking.user.country"}]}}," ",{"t":7,"e":"ui-input","a":{"class":["number ",{"t":4,"f":["bold"],"n":50,"r":"booking.user.mobile"}],"name":"mobile","placeholder":"Mobile","error":[{"t":2,"r":"step.errors.mobile"}],"value":[{"t":2,"r":"booking.user.mobile"}],"readonly":[{"t":4,"f":["readonly"],"n":50,"r":"meta.user.email"},{"t":4,"n":51,"f":[],"r":"meta.user.email"}]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"step.errors"}]}],"n":50,"r":"step.errors"}]}," ",{"t":7,"e":"div","a":{"class":"column top center aligned","style":"width: 35%;"},"f":[{"t":4,"f":["Have a CheapTicket.in Account? Sign in here!",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui button small blue"},"v":{"click":{"m":"signin","a":{"r":[],"s":"[]"}}},"f":["Sign in"]}],"n":51,"r":"meta.user.email"}]}," ",{"t":7,"e":"div","a":{"class":"column six wide"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui header"},"f":["Apply Promo Code"]}," ",{"t":7,"e":"div","a":{"class":"two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code","disabled":"disabled"},"f":[]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code"},"f":[]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui button small red"},"v":{"click":{"m":"removePromoCode","a":{"r":[],"s":"[]"}}},"f":["REMOVE"]}," ",{"t":7,"e":"div","a":{"class":"row one column"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"href":[{"t":2,"r":"promotncurl"}],"target":"_blank"},"f":["Promo Code T&C's"]}],"n":50,"x":{"r":["promotncurl"],"s":"_0!=null"}},{"t":4,"n":51,"f":[" "],"x":{"r":["promotncurl"],"s":"_0!=null"}}]}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui button small green"},"v":{"click":{"m":"applyPromoCode","a":{"r":[],"s":"[]"}}},"f":["APPLY"]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"style":"clear:both;"},"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":{"m":"removeErrorMsg","a":{"r":[],"s":"[]"}}}}," ",{"t":2,"r":"promoerror"}]}]}],"n":50,"x":{"r":["promoerror"],"s":"_0!=null"}}]}],"n":50,"x":{"r":["booking.clientSourceId"],"s":"_0==1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui wizard button massive blue"},"f":["CONTINUE"]}]}," ",{"t":7,"e":"div","a":{"class":"right aligned column ten wide"},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle top aligned relaxed fitted grid","style":"position: relative"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"column ten wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":["TOTAL:"]}]}," ",{"t":7,"e":"div","a":{"class":"column six wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","booking.currency"],"s":"_0(_1+_2,_3)"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"column ten wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":["DISCOUNT:"]}]}," ",{"t":7,"e":"div","a":{"class":"column six wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"x":{"r":["money","promovalue","booking.currency"],"s":"_0(_1,_2)"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"column ten wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":["AMOUNT TO PAY:"]}]}," ",{"t":7,"e":"div","a":{"class":"column six wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","promovalue","booking.currency"],"s":"_0(_1+_2-_3,_4)"}}]}]}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"column ten wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":["AMOUNT TO PAY:"]}]}," ",{"t":7,"e":"div","a":{"class":"column six wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","booking.currency"],"s":"_0(_1+_2,_3)"}}]}]}]}],"x":{"r":["promovalue"],"s":"_0!=null"}}," ",{"t":7,"e":"div","a":{"class":"row one column"},"f":[{"t":7,"e":"div","a":{"class":"column right aligned"},"f":[{"t":7,"e":"div","a":{"class":"taxes"},"f":["Basic Fare: ",{"t":3,"x":{"r":["money","booking.taxes.basic_fare","booking.currency"],"s":"_0(_1,_2)"}}," , YQ: ",{"t":3,"x":{"r":["money","booking.taxes.yq","booking.currency"],"s":"_0(_1,_2)"}},", Service Tax: ",{"t":3,"x":{"r":["money","booking.taxes.jn","booking.currency"],"s":"_0(_1,_2)"}},", Other: ",{"t":3,"x":{"r":["money","booking.taxes.other","booking.convenienceFee","booking.currency"],"s":"_0(_1+_2,_3)"}}," ",{"t":4,"f":[", Discount: ",{"t":3,"x":{"r":["money","promovalue","booking.currency"],"s":"_0(_1,_2)"}}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}]}]}]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}}],"x":{"r":["booking.steps.1"],"s":"{step:_0}"}},{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui fare fluid popup","style":"text-align: left; max-width: 350px;"},"f":[{"t":4,"f":[{"t":2,"r":"paxTaxes.1.c"},"x adults: ",{"t":3,"x":{"r":["money","paxTaxes.1.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["money","paxTaxes.1.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["money","paxTaxes.1.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["money","paxTaxes.1.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.1"}," ",{"t":4,"f":[{"t":2,"r":"paxTaxes.2.c"},"x children: ",{"t":3,"x":{"r":["money","paxTaxes.2.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["money","paxTaxes.2.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["money","paxTaxes.2.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["money","paxTaxes.2.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.2"}," ",{"t":4,"f":[{"t":2,"r":"paxTaxes.3.c"},"x infants: ",{"t":3,"x":{"r":["money","paxTaxes.3.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["money","paxTaxes.3.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["money","paxTaxes.3.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["money","paxTaxes.3.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.3"}]}],"r":"booking"}]};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	    moment = __webpack_require__(44),
	    _ = __webpack_require__(30),
	
	    h_money = __webpack_require__(69)(),
	    h_duration = __webpack_require__(81)()
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(84),
	
	    data: function() {
	        return _.extend(
	            { moment: moment, money: h_money.money, duration: h_duration }
	        );
	    }
	});

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[" ",{"t":7,"e":"div","a":{"class":["ui segment flight-itinerary ",{"t":4,"f":["small"],"n":50,"r":"small","s":true}," ",{"t":2,"r":"class","s":true}]},"f":[{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":7,"e":"span","a":{"class":"city"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.city"}}," → ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.city"}}]}," ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"ddd MMM D YYYY\")"}}," ",{"t":7,"e":"span","a":{"class":"time"},"f":[{"t":2,"x":{"r":["duration","segtime","."],"s":"_0.format(_1(_2))"}}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"id":"airport_change_style"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).airport_change"}}]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).airport_change"}}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"id":"transitvisa_msg_style"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).transitvisa_msg"}}]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).transitvisa_msg"}}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"techStop"},"f":["Technical Stop: ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).techStop"}}]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).techStop!=null"}}," ",{"t":4,"f":[{"t":2,"x":{"r":["flight.refundable"],"s":"[null,\"Non refundable\",\"Refundable\"][_0]"}}],"n":50,"r":"small","s":true}]}," ",{"t":7,"e":"table","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"divider"},"f":[{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","a":{"align":"center"},"f":[{"t":7,"e":"span","a":{"class":"layover"},"f":["Layover: ",{"t":2,"x":{"r":["duration","layover"],"s":"_0.format(_1)"}}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"layover css_layover"},"f":["Short Layover"]}],"n":50,"x":{"r":["layover"],"s":"_0.asSeconds()<=7200"}}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"layover css_layover"},"f":["Long Layover"]}],"n":50,"x":{"r":["layover"],"s":"_0.asSeconds()>=18000"}}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}]}],"n":50,"x":{"r":["layover"],"s":"_0.asSeconds()"}}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"airline"},"f":[{"t":7,"e":"div","a":{"class":"logos"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"r":"carrier.logo"}],"alt":[{"t":2,"r":"carrier.name"}],"title":[{"t":2,"r":"carrier.name"}]}}]}," ",{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"r":"carrier.name"},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"flight-no"},"f":[{"t":2,"r":"flight"},{"t":7,"e":"br"}," ",{"t":2,"r":"cabinType"}]}]}]}," ",{"t":7,"e":"td","a":{"class":"from","style":"text-align: right;"},"f":[{"t":7,"e":"b","m":[{"t":4,"f":["id=\"background_airport_change\""],"n":50,"x":{"r":["name_airport_change.0","name_airport_change.1","name_airport_change.2","from.airportCode","name_airport_change.3"],"s":"_3==_0||_3==_1||_3==_2||_3==_4"}}],"f":[{"t":2,"r":"from.airportCode"},":"]},{"t":4,"f":[{"t":7,"e":"br"}],"n":50,"r":"small","s":true},{"t":2,"x":{"r":["depart"],"s":"_0.format(\"ddd HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["small","depart"],"s":"_0?_1.format(\"D MMM\"):_1.format(\"D MMM, YYYY\")"}},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"from.airport"},", ",{"t":2,"r":"from.city"}," (",{"t":2,"r":"from.airportCode"},"), Terminal ",{"t":2,"r":"originTerminal"}]}],"n":51,"r":"small","s":true}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"class":"flight"},"f":[{"t":7,"e":"div","a":{"class":"duration"},"f":[{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}}]}]}],"n":51,"r":"small","s":true}," ",{"t":7,"e":"td","a":{"class":"to"},"f":[{"t":7,"e":"b","m":[{"t":4,"f":["id=\"background_airport_change\""],"n":50,"x":{"r":["name_airport_change.0","name_airport_change.1","name_airport_change.2","to.airportCode","name_airport_change.3"],"s":"_3==_0||_3==_1||_3==_2||_3==_4"}}],"f":[{"t":2,"r":"to.airportCode"},":"]},{"t":4,"f":[{"t":7,"e":"br"}],"n":50,"r":"small","s":true},{"t":2,"x":{"r":["arrive"],"s":"_0.format(\"ddd HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["small","arrive"],"s":"_0?_1.format(\"D MMM\"):_1.format(\"D MMM, YYYY\")"}},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"to.airport"},", ",{"t":2,"r":"to.city"}," (",{"t":2,"r":"to.airportCode"},"), Terminal ",{"t":2,"r":"destinationTerminal"}]}],"n":51,"r":"small","s":true}]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"colspan":"4"},"f":[{"t":7,"e":"div","a":{"class":"item stops","id":"box_height"},"f":[{"t":7,"e":"div","a":{"class":"item baggage_not_allowed_image"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"hand_baggage_styling"},"f":["Hand baggage only no checked-in baggage"]}]}]}]}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).product_class===\"LITE\""}}],"n":52,"r":"."}]}]}],"n":52,"r":"segments"}],"r":"flight"}]};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(35),
	    $ = __webpack_require__(33),
	    _ = __webpack_require__(30)
	    ;
	
	var allCountries = [
	    [
	        "India (भारत)",
	        "in",
	        "91"
	    ],
	    [
	        "Afghanistan (‫افغانستان‬‎)",
	        "af",
	        "93"
	    ],
	    [
	        "Albania (Shqipëri)",
	        "al",
	        "355"
	    ],
	    [
	        "Algeria (‫الجزائر‬‎)",
	        "dz",
	        "213"
	    ],
	    [
	        "American Samoa",
	        "as",
	        "1684"
	    ],
	    [
	        "Andorra",
	        "ad",
	        "376"
	    ],
	    [
	        "Angola",
	        "ao",
	        "244"
	    ],
	    [
	        "Anguilla",
	        "ai",
	        "1264"
	    ],
	    [
	        "Antigua and Barbuda",
	        "ag",
	        "1268"
	    ],
	    [
	        "Argentina",
	        "ar",
	        "54"
	    ],
	    [
	        "Armenia (Հայաստան)",
	        "am",
	        "374"
	    ],
	    [
	        "Aruba",
	        "aw",
	        "297"
	    ],
	    [
	        "Australia",
	        "au",
	        "61"
	    ],
	    [
	        "Austria (Österreich)",
	        "at",
	        "43"
	    ],
	    [
	        "Azerbaijan (Azərbaycan)",
	        "az",
	        "994"
	    ],
	    [
	        "Bahamas",
	        "bs",
	        "1242"
	    ],
	    [
	        "Bahrain (‫البحرين‬‎)",
	        "bh",
	        "973"
	    ],
	    [
	        "Bangladesh (বাংলাদেশ)",
	        "bd",
	        "880"
	    ],
	    [
	        "Barbados",
	        "bb",
	        "1246"
	    ],
	    [
	        "Belarus (Беларусь)",
	        "by",
	        "375"
	    ],
	    [
	        "Belgium (België)",
	        "be",
	        "32"
	    ],
	    [
	        "Belize",
	        "bz",
	        "501"
	    ],
	    [
	        "Benin (Bénin)",
	        "bj",
	        "229"
	    ],
	    [
	        "Bermuda",
	        "bm",
	        "1441"
	    ],
	    [
	        "Bhutan (འབྲུག)",
	        "bt",
	        "975"
	    ],
	    [
	        "Bolivia",
	        "bo",
	        "591"
	    ],
	    [
	        "Bosnia and Herzegovina (Босна и Херцеговина)",
	        "ba",
	        "387"
	    ],
	    [
	        "Botswana",
	        "bw",
	        "267"
	    ],
	    [
	        "Brazil (Brasil)",
	        "br",
	        "55"
	    ],
	    [
	        "British Indian Ocean Territory",
	        "io",
	        "246"
	    ],
	    [
	        "British Virgin Islands",
	        "vg",
	        "1284"
	    ],
	    [
	        "Brunei",
	        "bn",
	        "673"
	    ],
	    [
	        "Bulgaria (България)",
	        "bg",
	        "359"
	    ],
	    [
	        "Burkina Faso",
	        "bf",
	        "226"
	    ],
	    [
	        "Burundi (Uburundi)",
	        "bi",
	        "257"
	    ],
	    [
	        "Cambodia (កម្ពុជា)",
	        "kh",
	        "855"
	    ],
	    [
	        "Cameroon (Cameroun)",
	        "cm",
	        "237"
	    ],
	    [
	        "Canada",
	        "ca",
	        "1",
	        1,
	        ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]
	    ],
	    [
	        "Cape Verde (Kabu Verdi)",
	        "cv",
	        "238"
	    ],
	    [
	        "Caribbean Netherlands",
	        "bq",
	        "599",
	        1
	    ],
	    [
	        "Cayman Islands",
	        "ky",
	        "1345"
	    ],
	    [
	        "Central African Republic (République centrafricaine)",
	        "cf",
	        "236"
	    ],
	    [
	        "Chad (Tchad)",
	        "td",
	        "235"
	    ],
	    [
	        "Chile",
	        "cl",
	        "56"
	    ],
	    [
	        "China (中国)",
	        "cn",
	        "86"
	    ],
	    [
	        "Colombia",
	        "co",
	        "57"
	    ],
	    [
	        "Comoros (‫جزر القمر‬‎)",
	        "km",
	        "269"
	    ],
	    [
	        "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
	        "cd",
	        "243"
	    ],
	    [
	        "Congo (Republic) (Congo-Brazzaville)",
	        "cg",
	        "242"
	    ],
	    [
	        "Cook Islands",
	        "ck",
	        "682"
	    ],
	    [
	        "Costa Rica",
	        "cr",
	        "506"
	    ],
	    [
	        "Côte d’Ivoire",
	        "ci",
	        "225"
	    ],
	    [
	        "Croatia (Hrvatska)",
	        "hr",
	        "385"
	    ],
	    [
	        "Cuba",
	        "cu",
	        "53"
	    ],
	    [
	        "Curaçao",
	        "cw",
	        "599",
	        0
	    ],
	    [
	        "Cyprus (Κύπρος)",
	        "cy",
	        "357"
	    ],
	    [
	        "Czech Republic (Česká republika)",
	        "cz",
	        "420"
	    ],
	    [
	        "Denmark (Danmark)",
	        "dk",
	        "45"
	    ],
	    [
	        "Djibouti",
	        "dj",
	        "253"
	    ],
	    [
	        "Dominica",
	        "dm",
	        "1767"
	    ],
	    [
	        "Dominican Republic (República Dominicana)",
	        "do",
	        "1",
	        2,
	        ["809", "829", "849"]
	    ],
	    [
	        "Ecuador",
	        "ec",
	        "593"
	    ],
	    [
	        "Egypt (‫مصر‬‎)",
	        "eg",
	        "20"
	    ],
	    [
	        "El Salvador",
	        "sv",
	        "503"
	    ],
	    [
	        "Equatorial Guinea (Guinea Ecuatorial)",
	        "gq",
	        "240"
	    ],
	    [
	        "Eritrea",
	        "er",
	        "291"
	    ],
	    [
	        "Estonia (Eesti)",
	        "ee",
	        "372"
	    ],
	    [
	        "Ethiopia",
	        "et",
	        "251"
	    ],
	    [
	        "Falkland Islands (Islas Malvinas)",
	        "fk",
	        "500"
	    ],
	    [
	        "Faroe Islands (Føroyar)",
	        "fo",
	        "298"
	    ],
	    [
	        "Fiji",
	        "fj",
	        "679"
	    ],
	    [
	        "Finland (Suomi)",
	        "fi",
	        "358"
	    ],
	    [
	        "France",
	        "fr",
	        "33"
	    ],
	    [
	        "French Guiana (Guyane française)",
	        "gf",
	        "594"
	    ],
	    [
	        "French Polynesia (Polynésie française)",
	        "pf",
	        "689"
	    ],
	    [
	        "Gabon",
	        "ga",
	        "241"
	    ],
	    [
	        "Gambia",
	        "gm",
	        "220"
	    ],
	    [
	        "Georgia (საქართველო)",
	        "ge",
	        "995"
	    ],
	    [
	        "Germany (Deutschland)",
	        "de",
	        "49"
	    ],
	    [
	        "Ghana (Gaana)",
	        "gh",
	        "233"
	    ],
	    [
	        "Gibraltar",
	        "gi",
	        "350"
	    ],
	    [
	        "Greece (Ελλάδα)",
	        "gr",
	        "30"
	    ],
	    [
	        "Greenland (Kalaallit Nunaat)",
	        "gl",
	        "299"
	    ],
	    [
	        "Grenada",
	        "gd",
	        "1473"
	    ],
	    [
	        "Guadeloupe",
	        "gp",
	        "590",
	        0
	    ],
	    [
	        "Guam",
	        "gu",
	        "1671"
	    ],
	    [
	        "Guatemala",
	        "gt",
	        "502"
	    ],
	    [
	        "Guinea (Guinée)",
	        "gn",
	        "224"
	    ],
	    [
	        "Guinea-Bissau (Guiné Bissau)",
	        "gw",
	        "245"
	    ],
	    [
	        "Guyana",
	        "gy",
	        "592"
	    ],
	    [
	        "Haiti",
	        "ht",
	        "509"
	    ],
	    [
	        "Honduras",
	        "hn",
	        "504"
	    ],
	    [
	        "Hong Kong (香港)",
	        "hk",
	        "852"
	    ],
	    [
	        "Hungary (Magyarország)",
	        "hu",
	        "36"
	    ],
	    [
	        "Iceland (Ísland)",
	        "is",
	        "354"
	    ],
	    
	    [
	        "Indonesia",
	        "id",
	        "62"
	    ],
	    [
	        "Iran (‫ایران‬‎)",
	        "ir",
	        "98"
	    ],
	    [
	        "Iraq (‫العراق‬‎)",
	        "iq",
	        "964"
	    ],
	    [
	        "Ireland",
	        "ie",
	        "353"
	    ],
	    [
	        "Israel (‫ישראל‬‎)",
	        "il",
	        "972"
	    ],
	    [
	        "Italy (Italia)",
	        "it",
	        "39",
	        0
	    ],
	    [
	        "Jamaica",
	        "jm",
	        "1876"
	    ],
	    [
	        "Japan (日本)",
	        "jp",
	        "81"
	    ],
	    [
	        "Jordan (‫الأردن‬‎)",
	        "jo",
	        "962"
	    ],
	    [
	        "Kazakhstan (Казахстан)",
	        "kz",
	        "7",
	        1
	    ],
	    [
	        "Kenya",
	        "ke",
	        "254"
	    ],
	    [
	        "Kiribati",
	        "ki",
	        "686"
	    ],
	    [
	        "Kuwait (‫الكويت‬‎)",
	        "kw",
	        "965"
	    ],
	    [
	        "Kyrgyzstan (Кыргызстан)",
	        "kg",
	        "996"
	    ],
	    [
	        "Laos (ລາວ)",
	        "la",
	        "856"
	    ],
	    [
	        "Latvia (Latvija)",
	        "lv",
	        "371"
	    ],
	    [
	        "Lebanon (‫لبنان‬‎)",
	        "lb",
	        "961"
	    ],
	    [
	        "Lesotho",
	        "ls",
	        "266"
	    ],
	    [
	        "Liberia",
	        "lr",
	        "231"
	    ],
	    [
	        "Libya (‫ليبيا‬‎)",
	        "ly",
	        "218"
	    ],
	    [
	        "Liechtenstein",
	        "li",
	        "423"
	    ],
	    [
	        "Lithuania (Lietuva)",
	        "lt",
	        "370"
	    ],
	    [
	        "Luxembourg",
	        "lu",
	        "352"
	    ],
	    [
	        "Macau (澳門)",
	        "mo",
	        "853"
	    ],
	    [
	        "Macedonia (FYROM) (Македонија)",
	        "mk",
	        "389"
	    ],
	    [
	        "Madagascar (Madagasikara)",
	        "mg",
	        "261"
	    ],
	    [
	        "Malawi",
	        "mw",
	        "265"
	    ],
	    [
	        "Malaysia",
	        "my",
	        "60"
	    ],
	    [
	        "Maldives",
	        "mv",
	        "960"
	    ],
	    [
	        "Mali",
	        "ml",
	        "223"
	    ],
	    [
	        "Malta",
	        "mt",
	        "356"
	    ],
	    [
	        "Marshall Islands",
	        "mh",
	        "692"
	    ],
	    [
	        "Martinique",
	        "mq",
	        "596"
	    ],
	    [
	        "Mauritania (‫موريتانيا‬‎)",
	        "mr",
	        "222"
	    ],
	    [
	        "Mauritius (Moris)",
	        "mu",
	        "230"
	    ],
	    [
	        "Mexico (México)",
	        "mx",
	        "52"
	    ],
	    [
	        "Micronesia",
	        "fm",
	        "691"
	    ],
	    [
	        "Moldova (Republica Moldova)",
	        "md",
	        "373"
	    ],
	    [
	        "Monaco",
	        "mc",
	        "377"
	    ],
	    [
	        "Mongolia (Монгол)",
	        "mn",
	        "976"
	    ],
	    [
	        "Montenegro (Crna Gora)",
	        "me",
	        "382"
	    ],
	    [
	        "Montserrat",
	        "ms",
	        "1664"
	    ],
	    [
	        "Morocco (‫المغرب‬‎)",
	        "ma",
	        "212"
	    ],
	    [
	        "Mozambique (Moçambique)",
	        "mz",
	        "258"
	    ],
	    [
	        "Myanmar (Burma) (မြန်မာ)",
	        "mm",
	        "95"
	    ],
	    [
	        "Namibia (Namibië)",
	        "na",
	        "264"
	    ],
	    [
	        "Nauru",
	        "nr",
	        "674"
	    ],
	    [
	        "Nepal (नेपाल)",
	        "np",
	        "977"
	    ],
	    [
	        "Netherlands (Nederland)",
	        "nl",
	        "31"
	    ],
	    [
	        "New Caledonia (Nouvelle-Calédonie)",
	        "nc",
	        "687"
	    ],
	    [
	        "New Zealand",
	        "nz",
	        "64"
	    ],
	    [
	        "Nicaragua",
	        "ni",
	        "505"
	    ],
	    [
	        "Niger (Nijar)",
	        "ne",
	        "227"
	    ],
	    [
	        "Nigeria",
	        "ng",
	        "234"
	    ],
	    [
	        "Niue",
	        "nu",
	        "683"
	    ],
	    [
	        "Norfolk Island",
	        "nf",
	        "672"
	    ],
	    [
	        "North Korea (조선 민주주의 인민 공화국)",
	        "kp",
	        "850"
	    ],
	    [
	        "Northern Mariana Islands",
	        "mp",
	        "1670"
	    ],
	    [
	        "Norway (Norge)",
	        "no",
	        "47"
	    ],
	    [
	        "Oman (‫عُمان‬‎)",
	        "om",
	        "968"
	    ],
	    [
	        "Pakistan (‫پاکستان‬‎)",
	        "pk",
	        "92"
	    ],
	    [
	        "Palau",
	        "pw",
	        "680"
	    ],
	    [
	        "Palestine (‫فلسطين‬‎)",
	        "ps",
	        "970"
	    ],
	    [
	        "Panama (Panamá)",
	        "pa",
	        "507"
	    ],
	    [
	        "Papua New Guinea",
	        "pg",
	        "675"
	    ],
	    [
	        "Paraguay",
	        "py",
	        "595"
	    ],
	    [
	        "Peru (Perú)",
	        "pe",
	        "51"
	    ],
	    [
	        "Philippines",
	        "ph",
	        "63"
	    ],
	    [
	        "Poland (Polska)",
	        "pl",
	        "48"
	    ],
	    [
	        "Portugal",
	        "pt",
	        "351"
	    ],
	    [
	        "Puerto Rico",
	        "pr",
	        "1",
	        3,
	        ["787", "939"]
	    ],
	    [
	        "Qatar (‫قطر‬‎)",
	        "qa",
	        "974"
	    ],
	    [
	        "Réunion (La Réunion)",
	        "re",
	        "262"
	    ],
	    [
	        "Romania (România)",
	        "ro",
	        "40"
	    ],
	    [
	        "Russia (Россия)",
	        "ru",
	        "7",
	        0
	    ],
	    [
	        "Rwanda",
	        "rw",
	        "250"
	    ],
	    [
	        "Saint Barthélemy (Saint-Barthélemy)",
	        "bl",
	        "590",
	        1
	    ],
	    [
	        "Saint Helena",
	        "sh",
	        "290"
	    ],
	    [
	        "Saint Kitts and Nevis",
	        "kn",
	        "1869"
	    ],
	    [
	        "Saint Lucia",
	        "lc",
	        "1758"
	    ],
	    [
	        "Saint Martin (Saint-Martin (partie française))",
	        "mf",
	        "590",
	        2
	    ],
	    [
	        "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
	        "pm",
	        "508"
	    ],
	    [
	        "Saint Vincent and the Grenadines",
	        "vc",
	        "1784"
	    ],
	    [
	        "Samoa",
	        "ws",
	        "685"
	    ],
	    [
	        "San Marino",
	        "sm",
	        "378"
	    ],
	    [
	        "São Tomé and Príncipe (São Tomé e Príncipe)",
	        "st",
	        "239"
	    ],
	    [
	        "Saudi Arabia (‫المملكة العربية السعودية‬‎)",
	        "sa",
	        "966"
	    ],
	    [
	        "Senegal (Sénégal)",
	        "sn",
	        "221"
	    ],
	    [
	        "Serbia (Србија)",
	        "rs",
	        "381"
	    ],
	    [
	        "Seychelles",
	        "sc",
	        "248"
	    ],
	    [
	        "Sierra Leone",
	        "sl",
	        "232"
	    ],
	    [
	        "Singapore",
	        "sg",
	        "65"
	    ],
	    [
	        "Sint Maarten",
	        "sx",
	        "1721"
	    ],
	    [
	        "Slovakia (Slovensko)",
	        "sk",
	        "421"
	    ],
	    [
	        "Slovenia (Slovenija)",
	        "si",
	        "386"
	    ],
	    [
	        "Solomon Islands",
	        "sb",
	        "677"
	    ],
	    [
	        "Somalia (Soomaaliya)",
	        "so",
	        "252"
	    ],
	    [
	        "South Africa",
	        "za",
	        "27"
	    ],
	    [
	        "South Korea (대한민국)",
	        "kr",
	        "82"
	    ],
	    [
	        "South Sudan (‫جنوب السودان‬‎)",
	        "ss",
	        "211"
	    ],
	    [
	        "Spain (España)",
	        "es",
	        "34"
	    ],
	    [
	        "Sri Lanka (ශ්‍රී ලංකාව)",
	        "lk",
	        "94"
	    ],
	    [
	        "Sudan (‫السودان‬‎)",
	        "sd",
	        "249"
	    ],
	    [
	        "Suriname",
	        "sr",
	        "597"
	    ],
	    [
	        "Swaziland",
	        "sz",
	        "268"
	    ],
	    [
	        "Sweden (Sverige)",
	        "se",
	        "46"
	    ],
	    [
	        "Switzerland (Schweiz)",
	        "ch",
	        "41"
	    ],
	    [
	        "Syria (‫سوريا‬‎)",
	        "sy",
	        "963"
	    ],
	    [
	        "Taiwan (台灣)",
	        "tw",
	        "886"
	    ],
	    [
	        "Tajikistan",
	        "tj",
	        "992"
	    ],
	    [
	        "Tanzania",
	        "tz",
	        "255"
	    ],
	    [
	        "Thailand (ไทย)",
	        "th",
	        "66"
	    ],
	    [
	        "Timor-Leste",
	        "tl",
	        "670"
	    ],
	    [
	        "Togo",
	        "tg",
	        "228"
	    ],
	    [
	        "Tokelau",
	        "tk",
	        "690"
	    ],
	    [
	        "Tonga",
	        "to",
	        "676"
	    ],
	    [
	        "Trinidad and Tobago",
	        "tt",
	        "1868"
	    ],
	    [
	        "Tunisia (‫تونس‬‎)",
	        "tn",
	        "216"
	    ],
	    [
	        "Turkey (Türkiye)",
	        "tr",
	        "90"
	    ],
	    [
	        "Turkmenistan",
	        "tm",
	        "993"
	    ],
	    [
	        "Turks and Caicos Islands",
	        "tc",
	        "1649"
	    ],
	    [
	        "Tuvalu",
	        "tv",
	        "688"
	    ],
	    [
	        "U.S. Virgin Islands",
	        "vi",
	        "1340"
	    ],
	    [
	        "Uganda",
	        "ug",
	        "256"
	    ],
	    [
	        "Ukraine (Україна)",
	        "ua",
	        "380"
	    ],
	    [
	        "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
	        "ae",
	        "971"
	    ],
	    [
	        "United Kingdom",
	        "gb",
	        "44"
	    ],
	    [
	        "United States",
	        "us",
	        "1",
	        0
	    ],
	    [
	        "Uruguay",
	        "uy",
	        "598"
	    ],
	    [
	        "Uzbekistan (Oʻzbekiston)",
	        "uz",
	        "998"
	    ],
	    [
	        "Vanuatu",
	        "vu",
	        "678"
	    ],
	    [
	        "Vatican City (Città del Vaticano)",
	        "va",
	        "39",
	        1
	    ],
	    [
	        "Venezuela",
	        "ve",
	        "58"
	    ],
	    [
	        "Vietnam (Việt Nam)",
	        "vn",
	        "84"
	    ],
	    [
	        "Wallis and Futuna",
	        "wf",
	        "681"
	    ],
	    [
	        "Yemen (‫اليمن‬‎)",
	        "ye",
	        "967"
	    ],
	    [
	        "Zambia",
	        "zm",
	        "260"
	    ],
	    [
	        "Zimbabwe",
	        "zw",
	        "263"
	    ]
	];
	
	var options = [];
	
	// loop over all of the countries above
	for (var i = 0; i < allCountries.length; i++) {
	    var c = allCountries[i];
	    options[i] = {
	        id: '+' + c[2],
	        value: '+' + c[2],
	        text: c[0] + ' <span class="small">+' + c[2] + '</span>',
	    };
	}
	
	
	module.exports = Component.extend({
	    isolated: true,
	    template:  false ? '<div class="select"></div>' : __webpack_require__(40),
	
	    data: function() {
	        return {
	            options: options
	        };
	    },
	
	    oncomplete: function() {
	        var view = this;
	
	        if (false) {
	            var el = $(this.find('.select'));
	
	            var view = this,
	                debounce,
	                filtered = options.slice(),
	                query = '',
	                timeout;
	
	            el.mobiscroll().select({
	                buttons: [],
	                theme: 'mobiscroll',
	                display: 'top',
	                data: options,
	                value: '+91',
	                layout: 'liquid',
	                showLabel: false,
	                height: 40,
	                rows: 3,
	                onMarkupReady: function (markup, inst) {
	                    $('<div style="padding:.5em"><input type="text" class="md-filter-input" value="+91" tabindex="0" placeholder="Country code" /></div>')
	                        .prependTo($('.dwcc', markup))
	                        .on('keydown', function (e) { e.stopPropagation(); })
	                        .on('keyup', function (e) {
	                            var that = $('input', this);
	                            clearTimeout(debounce);
	                            debounce = setTimeout(function () {
	                                query = that.val().toLowerCase();
	
	                                filtered = $.grep(options, function (val) {
	                                    return val.id.indexOf(query) > -1;
	                                });
	
	                                inst.settings.data = filtered.length ? filtered : [{text: 'No results', value: ''}];
	                                inst.settings.parseValue(inst.settings.data[0].value);
	                                inst.refresh();
	
	
	                            }, 500);
	                        });
	
	                },
	                onBeforeShow: function (inst) {
	                    inst.settings.data = options;
	                    inst.refresh();
	                },
	                onSelect: function (v, inst) {
	                    var code = $('<span>' + v + '</span>').find('.small').text();
	
	                    view.set('value', code);
	                    $('.mbsc-control', view.el).val(code);
	                },
	                onChange: function(v) {
	                    $('.mbsc-control', view.el).val(v);
	                },
	                onInit: function() {
	                    $('.mbsc-control', view.el).val(view.get('value'));
	                }
	            });
	        } else {
	            var el = $(this.find('.ui.dropdown'))
	                    .dropdown({
	                        fullTextSearch: true,
	                        onChange: function(value) {
	                            if (value) {
	                                $(this).dropdown('hide');
	                                view.set('value', value);
	                                view.update('value');
	
	                                _.delay(function() { if (view.get('error')) view.set('error', false) }, 500);
	                            }
	                        }
	                    })
	                ;
	
	            this.observe('value', function(value) {
	                if (value) {
	                    var options = this.get('options');
	                    if (options) {
	                        var o = _.find(options, {id: value});
	
	                        if (o) {
	                            el.dropdown('set value', o.id);
	                            el.dropdown('set text', o.id);
	
	                            return;
	                        }
	
	                    }
	                }
	
	                el.dropdown('restore defaults');
	
	
	            });
	
	            if (this.find('.search')) {
	                $(this.find('.search')).keypress(function(e){
	                    if ( e.which == 13 ) e.preventDefault();
	                });
	            }
	        }
	
	
	    },
	
	    onteadown: function() {
	        //this.set('options', null);
	    }
	});

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mailcheck = __webpack_require__(87);
	
	var Input = __webpack_require__(37);
	
	module.exports = Input.extend({
	    data: function() {
	        return {
	            type: 'email'
	        };
	    },
	
	    oncomplete: function() {
	        this._super();
	
	        var view = this;
	        $(this.find('input'))
	            .on('blur', function() {
	                $(this).mailcheck({
	                    suggested: function(element, suggestion) {
	                        view.set('suggestion', suggestion);
	                    },
	                    empty: function(element) {
	                        view.set('suggestion', null);
	                    }
	                });
	            });
	    },
	
	    correct: function() {
	        this.set('value', this.get('suggestion.full'));
	        this.set('suggestion', null);
	    }
	});

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Mailcheck https://github.com/mailcheck/mailcheck
	 * Author
	 * Derrick Ko (@derrickko)
	 *
	 * Released under the MIT License.
	 *
	 * v 1.1.2
	 */
	
	var Mailcheck = {
	  domainThreshold: 2,
	  secondLevelThreshold: 2,
	  topLevelThreshold: 2,
	
	  defaultDomains: ['msn.com', 'bellsouth.net',
	    'telus.net', 'comcast.net', 'optusnet.com.au',
	    'earthlink.net', 'qq.com', 'sky.com', 'icloud.com',
	    'mac.com', 'sympatico.ca', 'googlemail.com',
	    'att.net', 'xtra.co.nz', 'web.de',
	    'cox.net', 'gmail.com', 'ymail.com',
	    'aim.com', 'rogers.com', 'verizon.net',
	    'rocketmail.com', 'google.com', 'optonline.net',
	    'sbcglobal.net', 'aol.com', 'me.com', 'btinternet.com',
	    'charter.net', 'shaw.ca'],
	
	  defaultSecondLevelDomains: ["yahoo", "hotmail", "mail", "live", "outlook", "gmx"],
	
	  defaultTopLevelDomains: ["com", "com.au", "com.tw", "ca", "co.nz", "co.uk", "de",
	    "fr", "it", "ru", "net", "org", "edu", "gov", "jp", "nl", "kr", "se", "eu",
	    "ie", "co.il", "us", "at", "be", "dk", "hk", "es", "gr", "ch", "no", "cz",
	    "in", "net", "net.au", "info", "biz", "mil", "co.jp", "sg", "hu", "uk"],
	
	  run: function(opts) {
	    opts.domains = opts.domains || Mailcheck.defaultDomains;
	    opts.secondLevelDomains = opts.secondLevelDomains || Mailcheck.defaultSecondLevelDomains;
	    opts.topLevelDomains = opts.topLevelDomains || Mailcheck.defaultTopLevelDomains;
	    opts.distanceFunction = opts.distanceFunction || Mailcheck.sift3Distance;
	
	    var defaultCallback = function(result){ return result };
	    var suggestedCallback = opts.suggested || defaultCallback;
	    var emptyCallback = opts.empty || defaultCallback;
	
	    var result = Mailcheck.suggest(Mailcheck.encodeEmail(opts.email), opts.domains, opts.secondLevelDomains, opts.topLevelDomains, opts.distanceFunction);
	
	    return result ? suggestedCallback(result) : emptyCallback()
	  },
	
	  suggest: function(email, domains, secondLevelDomains, topLevelDomains, distanceFunction) {
	    email = email.toLowerCase();
	
	    var emailParts = this.splitEmail(email);
	
	    if (secondLevelDomains && topLevelDomains) {
	        // If the email is a valid 2nd-level + top-level, do not suggest anything.
	        if (secondLevelDomains.indexOf(emailParts.secondLevelDomain) !== -1 && topLevelDomains.indexOf(emailParts.topLevelDomain) !== -1) {
	            return false;
	        }
	    }
	
	    var closestDomain = this.findClosestDomain(emailParts.domain, domains, distanceFunction, this.domainThreshold);
	
	    if (closestDomain) {
	      if (closestDomain == emailParts.domain) {
	        // The email address exactly matches one of the supplied domains; do not return a suggestion.
	        return false;
	      } else {
	        // The email address closely matches one of the supplied domains; return a suggestion
	        return { address: emailParts.address, domain: closestDomain, full: emailParts.address + "@" + closestDomain };
	      }
	    }
	
	    // The email address does not closely match one of the supplied domains
	    var closestSecondLevelDomain = this.findClosestDomain(emailParts.secondLevelDomain, secondLevelDomains, distanceFunction, this.secondLevelThreshold);
	    var closestTopLevelDomain    = this.findClosestDomain(emailParts.topLevelDomain, topLevelDomains, distanceFunction, this.topLevelThreshold);
	
	    if (emailParts.domain) {
	      var closestDomain = emailParts.domain;
	      var rtrn = false;
	
	      if(closestSecondLevelDomain && closestSecondLevelDomain != emailParts.secondLevelDomain) {
	        // The email address may have a mispelled second-level domain; return a suggestion
	        closestDomain = closestDomain.replace(emailParts.secondLevelDomain, closestSecondLevelDomain);
	        rtrn = true;
	      }
	
	      if(closestTopLevelDomain && closestTopLevelDomain != emailParts.topLevelDomain) {
	        // The email address may have a mispelled top-level domain; return a suggestion
	        closestDomain = closestDomain.replace(new RegExp(emailParts.topLevelDomain + "$"), closestTopLevelDomain);
	        rtrn = true;
	      }
	
	      if (rtrn == true) {
	        return { address: emailParts.address, domain: closestDomain, full: emailParts.address + "@" + closestDomain };
	      }
	    }
	
	    /* The email address exactly matches one of the supplied domains, does not closely
	     * match any domain and does not appear to simply have a mispelled top-level domain,
	     * or is an invalid email address; do not return a suggestion.
	     */
	    return false;
	  },
	
	  findClosestDomain: function(domain, domains, distanceFunction, threshold) {
	    threshold = threshold || this.topLevelThreshold;
	    var dist;
	    var minDist = Infinity;
	    var closestDomain = null;
	
	    if (!domain || !domains) {
	      return false;
	    }
	    if(!distanceFunction) {
	      distanceFunction = this.sift3Distance;
	    }
	
	    for (var i = 0; i < domains.length; i++) {
	      if (domain === domains[i]) {
	        return domain;
	      }
	      dist = distanceFunction(domain, domains[i]);
	      if (dist < minDist) {
	        minDist = dist;
	        closestDomain = domains[i];
	      }
	    }
	
	    if (minDist <= threshold && closestDomain !== null) {
	      return closestDomain;
	    } else {
	      return false;
	    }
	  },
	
	  sift3Distance: function(s1, s2) {
	    // sift3: http://siderite.blogspot.com/2007/04/super-fast-and-accurate-string-distance.html
	    if (s1 == null || s1.length === 0) {
	      if (s2 == null || s2.length === 0) {
	        return 0;
	      } else {
	        return s2.length;
	      }
	    }
	
	    if (s2 == null || s2.length === 0) {
	      return s1.length;
	    }
	
	    var c = 0;
	    var offset1 = 0;
	    var offset2 = 0;
	    var lcs = 0;
	    var maxOffset = 5;
	
	    while ((c + offset1 < s1.length) && (c + offset2 < s2.length)) {
	      if (s1.charAt(c + offset1) == s2.charAt(c + offset2)) {
	        lcs++;
	      } else {
	        offset1 = 0;
	        offset2 = 0;
	        for (var i = 0; i < maxOffset; i++) {
	          if ((c + i < s1.length) && (s1.charAt(c + i) == s2.charAt(c))) {
	            offset1 = i;
	            break;
	          }
	          if ((c + i < s2.length) && (s1.charAt(c) == s2.charAt(c + i))) {
	            offset2 = i;
	            break;
	          }
	        }
	      }
	      c++;
	    }
	    return (s1.length + s2.length) /2 - lcs;
	  },
	
	  splitEmail: function(email) {
	    var parts = email.trim().split('@');
	
	    if (parts.length < 2) {
	      return false;
	    }
	
	    for (var i = 0; i < parts.length; i++) {
	      if (parts[i] === '') {
	        return false;
	      }
	    }
	
	    var domain = parts.pop();
	    var domainParts = domain.split('.');
	    var sld = '';
	    var tld = '';
	
	    if (domainParts.length == 0) {
	      // The address does not have a top-level domain
	      return false;
	    } else if (domainParts.length == 1) {
	      // The address has only a top-level domain (valid under RFC)
	      tld = domainParts[0];
	    } else {
	      // The address has a domain and a top-level domain
	      sld = domainParts[0];
	      for (var i = 1; i < domainParts.length; i++) {
	        tld += domainParts[i] + '.';
	      }
	      tld = tld.substring(0, tld.length - 1);
	    }
	
	    return {
	      topLevelDomain: tld,
	      secondLevelDomain: sld,
	      domain: domain,
	      address: parts.join('@')
	    }
	  },
	
	  // Encode the email address to prevent XSS but leave in valid
	  // characters, following this official spec:
	  // http://en.wikipedia.org/wiki/Email_address#Syntax
	  encodeEmail: function(email) {
	    var result = encodeURI(email);
	    result = result.replace('%20', ' ').replace('%25', '%').replace('%5E', '^')
	                   .replace('%60', '`').replace('%7B', '{').replace('%7C', '|')
	                   .replace('%7D', '}');
	    return result;
	  }
	};
	
	// Export the mailcheck object if we're in a CommonJS env (e.g. Node).
	// Modeled off of Underscore.js.
	if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Mailcheck;
	}
	
	// Support AMD style definitions
	// Based on jQuery (see http://stackoverflow.com/a/17954882/1322410)
	if (true) {
	  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    return Mailcheck;
	  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	if (typeof window !== 'undefined' && window.jQuery) {
	  (function($){
	    $.fn.mailcheck = function(opts) {
	      var self = this;
	      if (opts.suggested) {
	        var oldSuggested = opts.suggested;
	        opts.suggested = function(result) {
	          oldSuggested(self, result);
	        };
	      }
	
	      if (opts.empty) {
	        var oldEmpty = opts.empty;
	        opts.empty = function() {
	          oldEmpty.call(null, self);
	        };
	      }
	
	      opts.email = this.val();
	      Mailcheck.run(opts);
	    }
	  })(jQuery);
	}


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34);
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(89),
	
	    components: {
	        passenger: __webpack_require__(90)
	    },
	
	    data: function () {
	        return {
	            qa: window.localStorage.getItem('qa')
	        };
	    },
	
	    oncomplete: function () {
	        var view = this;
	
	        this.observe('booking.steps.2.active', function (active) {
	            if (active) {
	                //console.log('scroll to top');
	
	                view.get('booking').setCurrentStepForMobile(2);
	                $('html, body').animate({
	                    scrollTop: 0
	                }, 1000);
	                $.ajax({
	                    type: 'POST',
	                    url: '/b2c/booking/travelers',
	                    data: {booking_id: this.get('booking.id')},
	                    success: function (data) {
	                        //  console.log('got travelers', data);
	
	                        if (data) {
	                            view.set('travelers', data);
	                        }
	                    }
	                });
	            }
	        });
	    },
	    submit: function () {
	        if (!this.checkduplicateUser()) {
	            this.get('booking').step2();
	        }
	    },
	
	    checkAvailability: function () {
	        this.get('booking').step2({check: true})
	    },
	
	    activate: function () {
	        if (!this.get('booking.payment.payment_id'))
	            this.get('booking').activate(2);
	    },
	
	    back: function () {
	        this.get('booking').activate(1);
	    },
	
	    checkduplicateUser: function () {
	        var passengers = this.get('booking.passengers'),
	                passenger_str = new Array(),
	                dup_passenger = new Array(),
	                n = 0,
	                html = '',
	                flag = false,
	                str = '',
	                i, j,
	                name = '',
	                once = true,
	                final_arr = new Array();
	        $.each(passengers, function (key, value) {
	            str = value.traveler.title_id + value.traveler.firstname.toUpperCase().trim() + value.traveler.lastname.toUpperCase().trim();
	            if (str !== 'undefined' && str !== '') {
	                passenger_str.push(str.replace(/\s+/g, ''));
	            }
	        });
	        // duplicate value array
	        n = passenger_str.length;
	        // count the array length
	        for (i = 0; i < n; i++) {
	            for (j = i + 1; j < n; j++) {
	                if (passenger_str[i] == passenger_str[j]) {
	                    if (final_arr.indexOf(j) == -1) {
	                        if (once) {
	                            html += '<div class="ui error message" style="display:block;">';
	                        }
	                        name = passengers[j].traveler.firstname + ' ' + passengers[j].traveler.lastname;
	                        html += '<p>Please Check Duplicate Passenger ' + name + '</p>';
	                        once = false;
	                        flag = true;
	                        final_arr.push(j);
	                    }
	                }
	            }
	        }
	        if (!flag) {
	            $('#dup-error').removeClass('ui segment passenger basic').html('');
	        } else {
	            html += '</div>';
	            $('#dup-error').addClass('ui segment passenger basic').html(html);
	        }
	
	        return flag;
	    }
	});
	


/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["step header step2 ",{"t":4,"f":["active"],"n":50,"r":"step.active"},{"t":4,"n":51,"f":[{"t":4,"f":["completed"],"n":50,"r":"step.completed"}],"r":"step.active"}],"role":"tab"},"f":["Passengers"]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"step2-summary segment"},"v":{"click":{"m":"activate","a":{"r":[],"s":"[2]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui horizontal list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":2,"r":"traveler.firstname"}," ",{"t":2,"r":"traveler.lastname"}]}]}],"n":52,"i":"i","r":"booking.passengers"}]}]}],"n":50,"x":{"r":["step.completed","step.active"],"s":"_0&&!_1"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment step2 ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":[],"n":50,"r":"step.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"payment_loader"},"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"wait_text"},"f":["Please Wait"]},{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui text loader loader_position"}}]}]}],"n":50,"r":"step.submitting"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"passenger-header header"},"f":[{"t":2,"rx":{"r":"meta.travelerTypes","m":[{"t":30,"n":"type_id"}]}},"(",{"t":2,"r":"no"},")* ",{"t":4,"f":[{"t":7,"e":"span","a":{"style":"font-size: 12px;font-weight: normal; margin-left: 5px;"},"f":["(",{"t":2,"rx":{"r":"meta.travelerTypes","m":[{"t":30,"n":"type_id"}]}}," age should be between ",{"t":4,"f":["2 - 12"],"n":50,"x":{"r":["type_id"],"s":"_0==2"}}," ",{"t":4,"f":["0 - 2"],"n":50,"x":{"r":["type_id"],"s":"_0==3"}}," years)"]}],"n":50,"x":{"r":["type_id"],"s":"_0==3||_0==2"}}]}," ",{"t":7,"e":"passenger","a":{"class":"basic","validation":[{"t":2,"r":"booking.passengerValidaton"}],"travelers":[{"t":2,"r":"travelers"}],"passenger":[{"t":2,"r":"."}],"errors":[{"t":2,"rx":{"r":"step.errors","m":[{"t":30,"n":"i"}]}}],"meta":[{"t":2,"r":"meta"}]}}],"n":52,"i":"i","r":"booking.passengers"}," ",{"t":7,"e":"div","a":{"id":"dup-error"}}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"div","a":{"class":"ui one column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"button","a":{"type":"submit","class":"ui wizard button massive blue"},"f":["CONTINUE"]}," ",{"t":4,"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui wizard button massive red"},"v":{"click":{"m":"checkAvailability","a":{"r":[],"s":"[]"}}},"f":["CHECK"]}],"n":50,"r":"qa"}]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["step.completed","step.active"],"s":"_0&&!_1"}}],"x":{"r":["booking.steps.2"],"s":"{step:_0}"}}]};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	        $ = __webpack_require__(33);
	
	;
	var Form = __webpack_require__(34),
	        Meta = __webpack_require__(68)
	        ;
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(91),
	
	    components: {
	        mobileselect: __webpack_require__(92),
	    },
	
	    data: function () {
	        return {
	            _: _,
	            datesupported: true,
	            all: false,
	            date: __webpack_require__(94)(),
	            adult: [
	                {tid: '1'},
	                {tid: '2'},
	                {tid: '3'}
	            ],
	            child: [
	                {tid: '2'},
	                {tid: '4'}
	            ],
	            infant: [
	                {tid: '2'},
	                {tid: '4'}
	            ],
	            search: function (term, travelers) {
	                //  console.log('search', arguments);
	
	                term = term.toLowerCase();
	                if (term && travelers) {
	                    return _.filter(travelers, function (i) {
	                        return -1 !== (i.firstname + ' ' + i.lastname).toLowerCase().indexOf(term);
	                    })
	                            .slice(0, 4);
	                }
	
	                //return travelers ? travelers.slice(0, 4) : null;
	                return travelers;
	            }
	        };
	    },
	
	    oncomplete: function () {
	        !function (e, t, n) {
	            function a(e, t) {
	                return typeof e === t
	            }
	            function s(e) {
	                var t = r.className, n = Modernizr._config.classPrefix || "";
	                if (c && (t = t.baseVal), Modernizr._config.enableJSClass) {
	                    var a = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
	                    t = t.replace(a, "$1" + n + "js$2")
	                }
	                Modernizr._config.enableClasses && (t += " " + n + e.join(" " + n), c ? r.className.baseVal = t : r.className = t)
	            }
	            function i() {
	                var e, t, n, s, i, o, r;
	                for (var c in u) {
	                    if (e = [], t = u[c], t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
	                        for (n = 0; n < t.options.aliases.length; n++)
	                            e.push(t.options.aliases[n].toLowerCase());
	                    for (s = a(t.fn, "function")?t.fn():t.fn, i = 0; i < e.length; i++)
	                        o = e[i], r = o.split("."), 1 === r.length ? Modernizr[r[0]] = s : (!Modernizr[r[0]] || Modernizr[r[0]]instanceof Boolean || (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])), Modernizr[r[0]][r[1]] = s), l.push((s ? "" : "no-") + r.join("-"))
	                }
	            }
	            function o() {
	                return"function" != typeof t.createElement ? t.createElement(arguments[0]) : c ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments)
	            }
	            var l = [], r = t.documentElement, c = "svg" === r.nodeName.toLowerCase(), u = [], f = {_version: "3.0.0-alpha.4", _config: {classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0}, _q: [], on: function (e, t) {
	                    var n = this;
	                    setTimeout(function () {
	                        t(n[e])
	                    }, 0)
	                }, addTest: function (e, t, n) {
	                    u.push({name: e, fn: t, options: n})
	                }, addAsyncTest: function (e) {
	                    u.push({name: null, fn: e})
	                }}, Modernizr = function () {};
	            Modernizr.prototype = f, Modernizr = new Modernizr;
	            var p = o("input"), d = "search tel url email datetime date month week time datetime-local number range color".split(" "), m = {};
	            Modernizr.inputtypes = function (e) {
	                for (var a, s, i, o = e.length, l = ":)", c = 0; o > c; c++)
	                    p.setAttribute("type", a = e[c]), i = "text" !== p.type && "style"in p, i && (p.value = l, p.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(a) && p.style.WebkitAppearance !== n ? (r.appendChild(p), s = t.defaultView, i = s.getComputedStyle && "textfield" !== s.getComputedStyle(p, null).WebkitAppearance && 0 !== p.offsetHeight, r.removeChild(p)) : /^(search|tel)$/.test(a) || (i = /^(url|email|number)$/.test(a) ? p.checkValidity && p.checkValidity() === !1 : p.value != l)), m[e[c]] = !!i;
	                return m
	            }(d), i(), s(l), delete f.addTest, delete f.addAsyncTest;
	            for (var g = 0; g < Modernizr._q.length; g++)
	                Modernizr._q[g]();
	            e.Modernizr = Modernizr
	        }(window, document);
	        if (!Modernizr.inputtypes.date) {
	            this.set('datesupported', false);
	        }
	
	        //$( ".dob" ).datepicker();
	
	        if (true) {
	            var fn = $(this.find('input.firstname'))
	                    .popup({
	                        position: 'bottom left',
	                        popup: $(this.find('.travelers.popup')),
	                        on: null,
	                        prefer: 'opposite',
	                        closable: false
	                    })
	                    .on('click', function () {
	                        fn.popup('show');
	                    })
	                    .on('blur', function () {
	                        setTimeout(function () {
	                            fn.popup('hide');
	                        }, 200);
	                    })
	                    ;
	
	        } else {
	            var view = this;
	            this.observe('travelers', function (travelers) {
	                if (travelers && travelers.length) {
	                    $('.tpopup', view.el).mobiscroll().select({
	                        buttons: [],
	                        onSelect: function (v, inst) {
	                            var id = _.parseInt($('.tpopup', view.el).val()),
	                                    traveler = _.findWhere(view.get('travelers'), {id: id});
	
	                            if (traveler) {
	                                view.pickTraveler(traveler);
	                                //  $(this).closest(".passengerclass").find('.tt').text(_.result(_.find(titles, {'id': traveler.title_id}), 'name'));
	                                //   view.set('passenger.traveler.title_id',traveler.)
	                            }
	                        },
	                        onValueTap: function (v, inst) {
	//                            console.log(v);
	//                            console.log(v.context.innerText);
	//                            console.log(v.context.outerHTML);     
	                            //                           console.log(v.context.attributes['data-val'].nodeValue);     
	                            var id = _.parseInt(v.context.attributes['data-val'].nodeValue),
	                                    traveler = _.findWhere(view.get('travelers'), {id: id});
	                            //             console.log(traveler);
	                            if (traveler) {
	                                view.pickTraveler(traveler);
	                                //    var titles = view.get('meta.titles');
	                                //  $(this).closest(".passengerclass").find('.tt').text(_.result(_.find(titles, {'id': traveler.title_id}), 'name'));
	
	                            }
	                            $('.tpopup', view.el).mobiscroll('hide');
	
	                        }
	                    });
	                }
	
	
	
	
	            });
	
	
	
	        }
	
	//                $('input[name="dob"]').change(function(){
	//                    //alert(this.value);         //Date in full format alert(new Date(this.value));
	//                    var inputDate = this.value;//new Date(this.value);
	//                    var date=inputDate.split("-");
	//                    console.log(inputDate);
	//                });
	
	
	    },
	    onconfig: function () {
	        this.observe('passenger.traveler.firstname passenger.traveler.lastname', function (newValue, oldValue, keypath) {
	            if (typeof oldValue !== 'undefined' && newValue !== oldValue) {
	                this.set('passenger.traveler.id', null);
	            }
	            //console.log(this.get('passenger.traveler'));
	        }, {
	            init: false,
	            defer: true
	        });
	    },
	    travelers: function () {
	        if (false) {
	            $('.tpopup', this.el).mobiscroll('show');
	        }
	    },
	    titleselect: function () {
	        if (false) {
	            $('.titlepopup', this.el).mobiscroll('show');
	        }
	    },
	    show: function (section, validation, all) {
	        if (all)
	            return true;
	
	        if ('birth' == section) {
	            return 'domestic' != 'validation';
	        }
	
	        if ('passport' == section) {
	            return 'full' == 'validation';
	        }
	    },
	
	    pickTraveler: function (traveler) {
	        var view = this,
	                id = this.get('passenger.traveler.id');
	        //console.log(no);
	        var view = this;
	
	        this.set('passenger.traveler', null)
	                .then(function () {
	                    view.set('passenger.traveler', _.cloneDeep(traveler));
	                });
	    },
	    setdob: function (traveler) {
	        var dateofbirth = this.get('passenger.traveler.birthd');
	        var no = _.parseInt(traveler['no']);
	        var t = no - 1;
	        var view = this;
	        var dob = dateofbirth.split('-');
	        this.set('passenger.traveler.birth', dob);
	
	    },
	    setdobsimple: function (traveler) {
	        // console.log(traveler);
	        var regEx = /^\d{2}-\d{2}-\d{4}$/;
	        var no = _.parseInt(traveler['no']);
	        var t = no - 1;
	        var view = this;
	        var dateofbirth = $("#dob_" + no).val();
	        if (dateofbirth != '') {
	            if (dateofbirth.match(regEx) != null) {
	                var dob = dateofbirth.split('-');
	                var dobb = [dob[2], dob[1], dob[0]];
	                if (_.parseInt(dob[0]) > 31) {
	                    alert("Please Put Valid Date in DD-MM-YYYY Format");
	                    $("#dob_" + no).val('').focus();
	                    return false;
	                }
	                if (_.parseInt(dob[1]) > 12) {
	                    alert("Please Put Valid Date in DD-MM-YYYY Format");
	                    $("#dob_" + no).val('').focus();
	                    return false;
	                }
	                this.set('passenger.traveler.birth', dobb);
	            } else {
	                alert("Please Put Date in DD-MM-YYYY Format");
	                $("#dob_" + no).val('').focus();
	            }
	        }
	
	    },
	
	    setpassportexpiry: function (traveler) {
	        var no = _.parseInt(traveler['no']);
	        var t = no - 1;
	        var dateofped = this.get('passenger.traveler.pd');
	        //var dateofped=$("#ped_"+no).val();
	        var peda = dateofped.split('-');
	        this.set('passenger.traveler.passport_expiry', peda);
	    },
	    setpassportexpirysimple: function (traveler) {
	        //console.log(traveler);
	
	        var regEx = /^\d{2}-\d{2}-\d{4}$/;
	
	        var no = _.parseInt(traveler['no']);
	        var t = no - 1;
	        var view = this;
	        var dateofped = $("#ped_" + no).val();
	        if (dateofped != '') {
	            if (dateofped.match(regEx) != null) {
	                var dob = dateofped.split('-');
	                var dobb = [dob[2], dob[1], dob[0]];
	                if (_.parseInt(dob[0]) > 31) {
	                    alert("Please Put Valid Date in DD-MM-YYYY Format");
	                    $("#ped_" + no).val('').focus();
	                    return false;
	                }
	                if (_.parseInt(dob[1]) > 12) {
	                    alert("Please Put Valid Date in DD-MM-YYYY Format");
	                    $("#ped_" + no).val('').focus();
	                    return false;
	                }
	
	                this.set('passenger.traveler.passport_expiry', dobb);
	            } else {
	                alert("Please Put Date in DD-MM-YYYY Format");
	                $("#ped_" + no).val('').focus();
	            }
	        }
	    },
	    toglle: function (traveler) {
	        var no = _.parseInt(traveler['no']);
	
	        if (this.get('passenger.traveler.birth') != null) {
	            if (this.get('datesupported')) {
	                var dob = this.get('passenger.traveler.birth.0') + '-' + this.get('passenger.traveler.birth.1') + '-' + this.get('passenger.traveler.birth.2');
	                $("#dob_" + no).val(dob);
	            } else {
	                var dob = this.get('passenger.traveler.birth.2') + '-' + this.get('passenger.traveler.birth.1') + '-' + this.get('passenger.traveler.birth.0');
	                $("#dob_" + no).val(dob);
	            }
	        }
	        if (this.get('passenger.traveler.passport_expiry') != null) {
	            if (this.get('datesupported')) {
	                var dob = this.get('passenger.traveler.passport_expiry.0') + '-' + this.get('passenger.traveler.passport_expiry.1') + '-' + this.get('passenger.traveler.passport_expiry.2');
	                $("#ped_" + no).val(dob);
	
	            } else {
	                var dob = this.get('passenger.traveler.passport_expiry.2') + '-' + this.get('passenger.traveler.passport_expiry.1') + '-' + this.get('passenger.traveler.passport_expiry.0');
	                $("#ped_" + no).val(dob);
	            }
	        }
	        this.toggle('all');
	    }
	
	});

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["ui segment passenger ",{"t":2,"r":"class"}]},"f":[{"t":7,"e":"div","a":{"class":"name tree fields"},"f":[{"t":7,"e":"div","a":{"class":"title field"},"f":[{"t":4,"f":[{"t":7,"e":"ui-select","a":{"class":"title","title_type":[{"t":2,"r":"adult"}],"title_match":"true","placeholder":"Title","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.titles()"}}],"value":[{"t":2,"r":"traveler.title_id"}],"error":[{"t":2,"r":"errors.title_id"}]}}],"n":50,"x":{"r":["type_id"],"s":"_0==1"}},{"t":4,"n":51,"f":[{"t":4,"n":50,"x":{"r":["type_id"],"s":"_0==2"},"f":[{"t":7,"e":"ui-select","a":{"class":"title","title_type":[{"t":2,"r":"child"}],"title_match":"true","placeholder":"Title","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.titles()"}}],"value":[{"t":2,"r":"traveler.title_id"}],"error":[{"t":2,"r":"errors.title_id"}]}}]},{"t":4,"n":50,"x":{"r":["type_id"],"s":"!(_0==2)"},"f":[" ",{"t":7,"e":"ui-select","a":{"class":"title","title_type":[{"t":2,"r":"infant"}],"title_match":"true","placeholder":"Title","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.titles()"}}],"value":[{"t":2,"r":"traveler.title_id"}],"error":[{"t":2,"r":"errors.title_id"}]}}]}],"x":{"r":["type_id"],"s":"_0==1"}}]}," ",{"t":7,"e":"div","a":{"class":"first name field"},"f":[{"t":7,"e":"ui-input","a":{"name":"firstname","class":"firstname","placeholder":"First & Middle Name","value":[{"t":2,"r":"traveler.firstname"}],"error":[{"t":2,"r":"errors.firstname"}]}}," ",{"t":7,"e":"div","a":{"class":"ui travelers popup vertical menu"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["Pick a ",{"t":2,"rx":{"r":"meta.travelerTypes","m":[{"t":30,"n":"type_id"}]}}]},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"pick-list"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":"item"},"v":{"click":{"m":"pickTraveler","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":2,"r":"name"}],"n":50,"x":{"r":["id","title_id"],"s":"_0==_1"}}],"n":52,"r":"meta.titles"}," ",{"t":2,"r":"firstname"}," ",{"t":2,"r":"lastname"}]}],"n":50,"x":{"r":["traveler_type_id","type_id"],"s":"_0==_1"}}],"n":52,"r":"travelers"}]}],"n":50,"r":"travelers.length"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["New ",{"t":2,"rx":{"r":"meta.travelerTypes","m":[{"t":30,"n":"type_id"}]}},"?"]},{"t":7,"e":"br"}," ",{"t":7,"e":"p","f":["We will register traveler in the system for faster access."]}],"r":"travelers.length"}],"x":{"r":["search","traveler.firstname","travelers"],"s":"{travelers:_0(_1,_2)}"}}]}]}," ",{"t":7,"e":"div","a":{"class":"last name field"},"f":[{"t":7,"e":"ui-input","a":{"name":"lastname","class":"lastname","placeholder":"Lastname","value":[{"t":2,"r":"traveler.lastname"}],"error":[{"t":2,"r":"errors.lastname"}]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Date of Birth",{"t":4,"f":["*"],"n":50,"x":{"r":["validation","type_id"],"s":"\"domestic\"!=_0||_1==3||_1==2"}}," ",{"t":7,"e":"span","a":{"style":"color: #3399ff; margin-left: 10px!important ;font-size: 13px;"},"f":["(The Date of Birth can be changed later)"]}]}," ",{"t":7,"e":"div","a":{"class":"passport-expiry date three fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"day","placeholder":"Day","options":[{"t":2,"r":"date.select.D"}],"value":[{"t":2,"r":"traveler.birth.2"}],"error":[{"t":2,"r":"errors.birth"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.MMMM"}],"value":[{"t":2,"r":"traveler.birth.1"}],"error":[{"t":2,"r":"errors.birth"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"year","placeholder":"Year","options":[{"t":2,"x":{"r":["date.select","~/type_id"],"s":"_0.birthYears(_1)"}}],"value":[{"t":2,"r":"traveler.birth.0"}],"error":[{"t":2,"r":"errors.birth"}]}}]}," "]},{"t":7,"e":"br"}],"n":50,"x":{"r":["all","validation","type_id"],"s":"_0||\"domestic\"!=_1||_2==3||_2==2"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Passport"]}," ",{"t":7,"e":"div","a":{"class":"passport two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-input","a":{"class":"passport-number","placeholder":"Passport Number","value":[{"t":2,"r":"traveler.passport_number"}],"error":[{"t":2,"r":"errors.passport_number"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"traveler.passport_country_id"}],"class":"passport-country","search":"1","placeholder":"Passport Country","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.countries()"}}],"error":[{"t":2,"r":"errors.passport_country_id"}]},"f":[]}]}]}," ",{"t":7,"e":"div","a":{"class":"label"},"f":["Passport expiry date"]}," ",{"t":7,"e":"div","a":{"class":"passport-expiry date three fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"day","placeholder":"Day","options":[{"t":2,"r":"date.select.D"}],"value":[{"t":2,"r":"traveler.passport_expiry.2"}],"error":[{"t":2,"r":"errors.passport_expiry"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.MMMM"}],"value":[{"t":2,"r":"traveler.passport_expiry.1"}],"error":[{"t":2,"r":"errors.passport_expiry"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.passportYears"}],"value":[{"t":2,"r":"traveler.passport_expiry.0"}],"error":[{"t":2,"r":"errors.passport_expiry"}]}}]}]}],"n":50,"r":"all"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}],"n":50,"x":{"r":["_","errors"],"s":"_0.isArray(_1)||_0.isObject(_1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errors"}]}],"x":{"r":["_","errors"],"s":"_0.isArray(_1)||_0.isObject(_1)"}}]}],"n":50,"r":"errors"}," ",{"t":7,"e":"div","a":{"align":"center","class":"more"},"f":[{"t":7,"e":"a","a":{"class":"ui basic tiny circular button","href":"javascript:;"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"all\"]"}}},"f":[{"t":4,"f":["Less Info"],"n":50,"r":"all"},{"t":4,"n":51,"f":["More Info"],"r":"all"}]}]}]}],"r":"passenger"}]};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(35),
	    $ = __webpack_require__(33),
	    _ = __webpack_require__(30)
	    ;
	
	var
	    LARGE = 'large',
	    DISABLED = 'disabled',
	    LOADING = 'icon loading',
	    DECORATED = 'decorated',
	    ERROR = 'error',
	    IN = 'in',
	    SEARCH = 'search',
	    INPUT = 'input'
	    ;
	
	module.exports = Component.extend({
	    isolated: true,
	    template: __webpack_require__(93),
	
	    data: function() {
	        return {
	            classes: function() {
	                var data = this.get(),
	                    classes = [];
	
	                if (_.isObject(data.state)) {
	                    if (data.state.disabled || data.state.submitting) classes.push(DISABLED);
	                    if (data.state.loading) classes.push(LOADING);
	                    if (data.state.error) classes.push(ERROR);
	
	                }
	
	                if (data.large) {
	                    classes.push(INPUT);
	                    classes.push(DECORATED);
	                    classes.push(LARGE);
	
	                    if (data.value || data.focus) {
	                        classes.push(IN);
	                    }
	                }
	
	                if (data.search) {
	                    classes.push(SEARCH);
	                }
	
	                if (data.disabled) {
	                    classes.push(DISABLED);
	                }
	
	
	                return classes.join(' ');
	            }
	        };
	    },
	
	    oncomplete: function() {
	        var view = this, o;
	
	        var el = $('.popup', view.el).mobiscroll().select({
	                       buttons: [],
	                       onSelect: function (v, inst) {
	                           
	                            $(view.el).find('.tt').text(v);
	                            var value= _.result(_.find(titles, {'name': _.parseInt(v)}), 'id');
	                            view.set('traveler.title_id',value);
	                           // console.log(view.get('traveler'));
	                       },
	                       onValueTap: function (v, inst) { 
	                          // console.log('pp');
	                           var titles =view.get('options');
	                           var title=v.context.attributes['data-val'].nodeValue;
	                           var value= _.result(_.find(titles, {'id': _.parseInt(title)}), 'name');
	                           $(view.el).find('.tt').text(value);
	                           $('.popup', view.el).mobiscroll('hide');
	                           view.set('traveler.title_id',_.parseInt(title));
	                           //console.log(view.get('traveler'));
	                           //console.log('pp'+title);
	                       }
	                   });
	            ;
	        
	       
	        this.observe('value', function(value) {
	
	            if (value) {
	                var options = this.get('options');
	
	                if (options) {
	                    var o = _.find(options, {id: value});
	
	                    if (o) {
	//                        el.dropdown('set value', o.id);
	//                        el.dropdown('set text', o.text);
	
	                        return;
	                    }
	
	                }
	
	                return;
	            }
	
	//            el.dropdown('restore defaults');
	
	
	        }, {init: false});
	
	        
	
	    },
	selectvalue: function() {
	   
	       view.set('traveler.title_id',_.parseInt($(this.find('.popup')).val()));
	     //  console.log(view.get('traveler'));
	      // console.log(view.get('value'));
	    },
	    onteadown: function() {
	        //this.set('options', null);
	    },
	     dropdownselect: function() {
	        
	            $('.popup', this.el).mobiscroll('show');
	           // console.log('dropdownselect');
	        
	    },
	});

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field","align":"center"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui dropdown "},"v":{"click":{"m":"dropdownselect","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"default text tt"},"f":[{"t":2,"r":"placeholder"}]}," ",{"t":7,"e":"i","a":{"class":"dropdown icon"}}]}," ",{"t":7,"e":"div","a":{"class":"hide"},"f":[{"t":7,"e":"select","a":{"class":"popup"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"option","a":{"value":[{"t":2,"r":"id"}]},"f":[{"t":2,"r":"name"}]}],"n":50,"x":{"r":["tid","id"],"s":"_0==_1"}}],"r":"title_type"}],"r":"options"}],"n":50,"r":"title_match"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"option","a":{"value":[{"t":2,"r":"id"}]},"f":[{"t":2,"r":"name"}]}],"r":"options"}],"r":"title_match"}]}]}]}],"n":50,"r":"options.length"}]};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	module.exports = function() {
	    var out = {
	        D: _.range(1,32),
	        M: _.range(1,13),
	        MMMM: moment.months()
	    };
	
	    out.select = {
	        D: _.map(out.D, function(i) { return { id: _.padLeft(i, 2, 0), text: i }; }),
	        M: _.map(out.M, function(i) { return { id: _.padLeft(i, 2, 0), text: i }; }),
	        MMMM: _.map(out.MMMM, function(i, k) { return { id: _.padLeft(k + 1, 2, 0), text: i }; }),
	
	        passportYears: _.map(_.range(moment().year(), moment().year() + 15), function(i) { return { id: ''+i, text: ''+i }; }),
	
	        birthYears: function(type) {
	            return _.map(_.range(moment().year(), 1899, -1), function(i) { return { id: ''+i, text: ''+i }; });
	        },
	
	        cardYears: _.map(_.range(moment().year(), moment().add(25, 'years').year()), function(i) { return { id: ''+i, text: ''+i }; }),
	        cardMonths: _.map(out.MMMM, function(i, k) { return { id: k + 1, text: _.padLeft(k+1, 2, '0') + ' ' + i }; })
	
	    };
	
	    return out;
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    $ = __webpack_require__(33)
	    ;
	__webpack_require__(96);
	var Form = __webpack_require__(34),
	
	    h_money = __webpack_require__(69),
	    h_duration = __webpack_require__(81)(),
	    h_date = __webpack_require__(94)(),
	    accounting = __webpack_require__(70)
	    ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(97),
	
	    components: {
	        'ui-cc': __webpack_require__(98),
	        'ui-cvv': __webpack_require__(101),
	        'ui-expiry': __webpack_require__(102)
	    },
	    
	    data: function() {
	        return {
	            promocode:null,
	            promovalue:null,
	            promoerror:null,
	            accepted:true,
	            money: h_money,
	            duration: h_duration,
	            date: h_date,
	            banks: [
	                
	                {id: 'AXIB' , text: 'AXIS Bank' , logo: 'axis_bank'},// {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
	                {id: '1045' , text: 'Bank of Baroda Corporate' , logo: 'bank_of_baroda'},
	                {id: '1046' , text: 'Bank of Baroda Retail' , logo: 'bank_of_baroda'},
	                {id: 'BOIB' , text: 'Bank of India' , logo: 'bank_of_india'},//Payu {id: 'BOIB' , text: 'Bank of India' }, Atom {id: '1012' , text: 'Bank of India' },
	                {id: 'BOMB', text: 'Bank of Maharashtra' , logo: 'bank_of_maharashtra'},//Payu {id: 'BOMB', text: 'Bank of Maharashtra'},
	                {id: '1030', text: 'Canara Bank NetBanking' , logo: 'canara_bank'},//{id: 'CABB', text: 'Canara Bank'},
	                {id: '1034', text: 'Canara Bank DebitCard' , logo: 'canara_bank'},
	                {id: 'CSBN', text: 'Catholic Syrian Bank' , logo: 'catholic_syrian_bank'},
	                {id: 'CBIB', text: 'Central Bank Of India' , logo: 'central_bank_of_india'},//{id: 'CBIB', text: 'Central Bank Of India'},
	                {id: '1020', text: 'City Union Bank' , logo: 'city_union_bank'},//{id: 'CUBB', text: 'CityUnion'},
	                /*{id: 'CITNB', text: 'Citi Bank NetBanking' , logo: 'citi_bank_netbanking'},*/
	                {id: 'CRPB', text: 'Corporation Bank' , logo: 'corporation_bank'},//{id: 'CRPB', text: 'Corporation Bank'},
	                {id: '1047', text: 'DBS Bank Ltd' , logo: 'dsb_bank'},
	                {id: '1042', text: 'DCB Bank Business' , logo: 'dcb_bank'},//{id: 'DCBB', text: 'Development Credit Bank'},
	                {id: '1027', text: 'DCB Bank Personal' , logo: 'dcb_bank'},
	                {id: 'DSHB', text: 'Deutsche Bank' , logo: 'deutsche_bank'},//{id: 'DSHB', text: 'Deutsche Bank'},
	                {id: 'DLSB', text: 'Dhanlaxmi Bank' , logo: 'dhanlakshmi_bank'},
	                {id: 'FEDB', text: 'Federal Bank' , logo: 'federal_bank'},//{id: 'FEDB', text: 'Federal Bank'},
	                {id: 'HDFB', text: 'HDFC Bank' , logo: 'hdfc_bank'},
	                {id: 'ICIB', text: 'ICICI Netbanking' , logo: 'icici_bank'},
	                {id: 'IDBB', text: 'IDBI Bank' , logo: 'idbi_bank'},//{id: 'IDBB', text: 'Industrial Development Bank of India'},
	                {id: 'INDB', text: 'Indian Bank ' , logo: 'indian_bank'},//{id: 'INDB', text: 'Indian Bank '},
	                {id: 'INIB', text: 'IndusInd Bank' , logo: 'indusind_bank'},//{id: 'INIB', text: 'IndusInd Bank'},
	                {id: 'INOB', text: 'Indian Overseas Bank' , logo: 'indian_overseas_bank'},//{id: 'INOB', text: 'Indian Overseas Bank'},
	                {id: 'JAKB', text: 'Jammu and Kashmir Bank' , logo: 'j_k_bank'},//{id: 'JAKB', text: 'Jammu and Kashmir Bank'},
	                {id: 'KRKB', text: 'Karnataka Bank' , logo: 'karnataka_bank'},//{id: 'KRKB', text: 'Karnataka Bank'},
	                {id: '1018', text: 'Karur Vysya ' , logo: 'karur_vysya'},//{id: 'KRVB', text: 'Karur Vysya '},
	                {id: '162B', text: 'Kotak Mahindra Bank' , logo: 'kotak_mahindra_bank'},//{id: '162B', text: 'Kotak Bank'}
	                {id: '1009', text: 'Lakshmi Vilas Bank NetBanking' , logo: 'lakshmi_vilas'},
	                {id: 'OBCB', text: 'Oriental Bank Of Commerce' , logo: 'obc'},
	                {id: 'PSBNB', text: 'Punjab And Sind Bank' , logo: 'punjab_sindh_bank'}, //{id: 'PSBNB', text: 'Punjab And Sind Bank'},
	                {id: 'PNBB', text: 'Punjab National Bank – Retail' , logo: 'pnb_retail'},
	                /*{id: '1050', text: 'Royal Bank Of Scotland' , logo: 'royal_bank_scotland'},*/
	                /*{id: '1053', text: 'SaraSwat Bank' , logo: 'saraswat_bank'},*/
	                {id: '1051', text: 'Standard Chartered Bank' , logo: 'standard_chartered'},
	                {id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur' , logo: 'sbbj'},//{id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
	                {id: 'SBHB', text: 'State Bank of Hyderabad' , /*logo: 'sbhb'*/},//{id: 'SBHB', text: 'State Bank of Hyderabad'},
	                {id: 'SBIB', text: 'State Bank of India' , logo: 'sbib'},//{id: 'SBIB', text: 'State Bank of India'},
	                {id: 'SBMB', text: 'State Bank of Mysore' , /*logo: 'sbmb'*/},//{id: 'SBMB', text: 'State Bank of Mysore'},
	                {id: 'SBPB', text: 'State Bank of Patiala' , logo: 'sbpb'},//{id: 'SBPB', text: 'State Bank of Patiala'},
	                {id: 'SBTB', text: 'State Bank of Travancore' , /*logo: 'sbtb'*/},//{id: 'SBTB', text: 'State Bank of Travancore'},
	                {id: 'SOIB', text: 'South Indian Bank' , logo: 'south_indian_bank'},//{id: 'SOIB', text: 'South Indian Bank'},
	                {id: 'UBIB', text: 'Union Bank of India' , logo: 'union_bank_of_india'},
	                {id: 'UNIB', text: 'United Bank Of India' , logo: 'united_bank'},//{id: 'UNIB', text: 'United Bank Of India'},
	                {id: 'VJYB', text: 'Vijaya Bank' , logo: 'vijya_bank'},//{id: 'VJYB', text: 'Vijaya Bank'},
	                {id: 'YESB', text: 'Yes Bank' , logo: 'yes_bank'},//{id: 'YESB', text: 'Yes Bank'},
	                {id: 'TMBB', text: 'Tamilnad Mercantile Bank' , logo: 't_m_bank'},
	                {id: '1016', text: 'Union Bank' , logo: 'union_bank'},
	                //    {id: '2001', text: ' ATOM Test bank'},
	 
	            ],
	            wallets :[
	                {id: '1001', text: 'MobiKwik', logo: 'mobikwik_background'},
	                {id: '1002', text: 'Paytm', logo: 'paytm_background'},
	                {id: '1003', text: 'Idea Money', logo: 'ideamoney_background'},
	                {id: '1004', text: 'FreeCharge', logo: 'freecharge_background'},
	                {id: '1005', text: 'Oxigen', logo: 'oxigen_background'},
	                {id: '1006', text: 'SBI Buddy', logo: 'sbi_buddy_background'},
	                {id: '1007', text: 'The Mobile Wallet', logo: 'the_mobile_wallet'},
	                {id: '1008', text: 'jioMoney', logo: 'jiomoney_background'},
	                {id: '1009', text: 'Jana Cash', logo: 'janacach_background'},
	                {id: '1010', text: 'Ziggit by IDFC Bank', logo: 'ziggit_background'},
	                {id: '1011', text: 'ICash Card', logo: 'icash_background'}
	            ],
	            formatYear: function (year) {
	                return year.slice(-2);;
	            },
	            formatPayMoney:function(amount){
	                return accounting.formatMoney(amount, '<i class="inr icon currency"></i>', 0);
	            }
	        }
	       
	    },
	
	    onconfig: function() {
	        var view = this;
	 
	        
	        this.observe('booking.steps.3.active', function(active) {
	            if (active) {
	                view.CCAvenueEMI();
	                view.get('booking').setCurrentStepForMobile(3);
	                $.ajax({
	                    type: 'GET',
	                    url: '/b2c/booking/cards',
	                    data: { booking_id: this.get('booking.id') },
	                    success: function(data) {
	                        if (data.length) {
	                            view.set('cards', data);
	                            //view.setCard(data[data.length - 1]);
	                        } else {
	                            view.set('cards', null);
	                        }
	                    }
	                });
	                 view.set('promocode',view.get('booking.promo_code'));
	                 view.set('promovalue',view.get('booking.promo_value'));
	            }
	        });
	
	        this.observe('booking.payment.active', function() {
	            if (this.get('booking')) {
	                //view.clearForm();
	                this.get('booking').resetPayment();
	                this.set('booking.steps.3.errors', false);
	                if(this.get('booking.payment.active') === 6) {
	                    this.get('booking').pymtConvFee(7 , -1, null); // for UPI
	                }
	            }
	        }, {init: false});
	        
	      
	    },
	
	
	    submit: function() { 
	        //var booking = this.get('booking');
	        //console.log(booking);
	        //alert(this.get('booking.payment.netbanking.net_banking'));
	        //alert(this.get('booking.payment.netbanking.net_banking'));
	        
	//        var cardexpiry=$('#cc-exp').val();
	//        console.log(cardexpiry);
	//        if(cardexpiry !=null && cardexpiry !=''){
	//            cardarr=cardexpiry.split('/');
	//            booking.set('payment.cc.exp_month',trim(cardarr[0]));
	//            booking.set('payment.cc.exp_year',trim(cardarr[1]));
	//        }
	        if(this.get('booking.convfeeflag') === false) {
	            alert('Please wait and click again on Book Flight')
	            return;
	        }
	        this.get('booking').step3();
	    },
	    setCard: function(cc) {
	        var booking = this.get('booking');
	
	        if (booking.get('payment.cc.id') !== cc.id) {
	            booking.set('payment.cc', cc);
	        } else {
	            booking.set('payment.cc', {});
	        }
	
	    },
	
	    resetCC: function(event) {
	        var booking = this.get('booking'),
	            e = event.original,
	            el = $(e.srcElement),
	            id = booking.get('payment.cc.id'),
	            yup = 0 == el.parents('.ui.input.cvv').size() && (('INPUT' == el[0].tagName) || el.hasClass('dropdown') || el.parents('.ui.dropdown').size());
	
	        if (id && yup) {
	            booking.set('payment.cc', {});
	        }
	    },
	
	    back: function() {
	        this.get('booking').activate(2);
	    },
	
	    applyPromoCode:function(){
	         
	          var promocode=this.get('promocode');
	          this.set('promoerror',null);
	         
	        var view = this;
	                
	        var data = {id: this.get('booking.id'),promo:promocode};
	        $.ajax({
	            timeout: 10000,
	            type: 'POST',
	            url: '/b2c/booking/checkPromoCode',
	            data: data,
	            dataType: 'json',
	            complete: function () {
	
	            },
	            success: function (data) {
	                if(data.hasOwnProperty('error')){                    
	                    console.log(data.error);
	                    view.set('promoerror',data.error);
	                }else if(data.hasOwnProperty('value')){
	                    view.set('promovalue',data.value);
	                    view.set('booking.promo_value',data.value); 
	                    view.set('booking.promo_code',data.code); 
	                }
	            },
	            error: function (xhr) {
	            }
	        });
	         
	    },
	    removePromoCode:function(){
	     //   console.log('removePromoCode');
	        this.set('promoerror',null);
	        this.set('promocode',null);
	        this.set('promovalue',null); 
	        
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
	                view.set('booking.promo_value',null); 
	                view.set('booking.promo_code',null);               
	               
	            },
	            error: function (xhr) {
	            }
	        });
	    },
	    removeErrorMsg:function(){
	        this.set('promoerror',null);
	    },
	    checkExpiry:function(){
	         $.fn.toggleInputError = function(erred) {
	        this.parent('.form-group').toggleClass('has-error', erred);
	        return this;
	      };
	      $('.cc-exp').val();
	      $.payment.validateCardExpiry('05', '20'); //=> true
	         $('.cc-exp').toggleInputError(!$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
	         $('.validation').removeClass('text-danger text-success');
	         $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');
	    },
	    CCAvenueEMI: function() {
	        
	        var view = this,
	        response,
	        jsonData,
	        value,
	        value1,
	        index,
	        index1,data1,data2,
	        plans_emi
	        ;
	        response = $.ajax({
	            type: 'POST',
	            data: { id: view.get('booking.id'), emi_flag: 'payment_emi' },
	            url: '/b2c/Booking/CCAvenueEMI',
	        });
	        response.done(function(data) {
	            if ( data != '') {
	                try{
	                    jsonData = JSON.parse(data);
	                } catch (e) {
	                    return false;
	                }
	                view.set('emiOptions', jsonData);
	                $.each(jsonData, function(index, value) {
	                    if(value.payOpt == 'OPTEMI') {
	                        view.set('emiPaymentReady', true);
	                        view.set('booking.payment.emi.payment_option', value.payOpt);
	                        view.set('emi_banks',JSON.parse(value.EmiBanks));
	                        plans_emi = JSON.parse(value.EmiPlans);
	                        $.each(plans_emi, function(index1, value1) {
	                            value1.emiAmount = value1.emiAmount.toFixed(2);
	                            value1.total = value1.total.toFixed(2);
	                        });
	                        view.set('emi_plans', plans_emi);
	                    }
	               });
	            }
	        });
	        response.error(function(data) {
	            view.set('emi_unavailable', data.responseJSON.message);
	        });
	    },
	    showEmiPlans: function() {
	    	var view = this;
	    	view.set('selectedPlan', $("#emi_banks").val());
	    	view.set('booking.payment.emi.planId', $("#emi_banks").val());
	    	view.set('showEmiPlans', true);
	    },
	    showCardFields: function() {
	    	var view = this;
	        $.each(view.get('emi_plans'), function(index, value) {
	            if(value.planId == view.get('booking.payment.emi.planId')) {
	                view.set('booking.payment.emi.emi_tenure_id', value.tenureId);
	                view.set('booking.payment.emi.currency', value.currency);
	            }
	        });
	        view.set('readyCardFields', true);
	    }
	});


/***/ },
/* 96 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.7.1
	(function() {
	  var cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlashAndSpace, hasTextSelected, luhnCheck, reFormatCVC, reFormatCardNumber, reFormatExpiry, reFormatNumeric, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric, setCardType,
	    __slice = [].slice,
	    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	  $.payment = {};
	
	  $.payment.fn = {};
	
	  $.fn.payment = function() {
	    var args, method;
	    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    return $.payment.fn[method].apply(this, args);
	  };
	
	  defaultFormat = /(\d{1,4})/g;
	
	  $.payment.cards = cards = [
	    {
	      type: 'visaelectron',
	      pattern: /^4(026|17500|405|508|844|91[37])/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'maestro',
	      pattern: /^(5(018|0[23]|[68])|6(39|7))/,
	      format: defaultFormat,
	      length: [12, 13, 14, 15, 16, 17, 18, 19],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'forbrugsforeningen',
	      pattern: /^600/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'dankort',
	      pattern: /^5019/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'visa',
	      pattern: /^4/,
	      format: defaultFormat,
	      length: [13, 16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'mastercard',
	      pattern: /^(5[0-5]|2[2-7])/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'amex',
	      pattern: /^3[47]/,
	      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
	      length: [15],
	      cvcLength: [3, 4],
	      luhn: true
	    }, {
	      type: 'dinersclub',
	      pattern: /^3[0689]/,
	      format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
	      length: [14],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'discover',
	      pattern: /^6([045]|22)/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }, {
	      type: 'unionpay',
	      pattern: /^(62|88)/,
	      format: defaultFormat,
	      length: [16, 17, 18, 19],
	      cvcLength: [3],
	      luhn: false
	    }, {
	      type: 'jcb',
	      pattern: /^35/,
	      format: defaultFormat,
	      length: [16],
	      cvcLength: [3],
	      luhn: true
	    }
	  ];
	
	  cardFromNumber = function(num) {
	    var card, _i, _len;
	    num = (num + '').replace(/\D/g, '');
	    for (_i = 0, _len = cards.length; _i < _len; _i++) {
	      card = cards[_i];
	      if (card.pattern.test(num)) {
	        return card;
	      }
	    }
	  };
	
	  cardFromType = function(type) {
	    var card, _i, _len;
	    for (_i = 0, _len = cards.length; _i < _len; _i++) {
	      card = cards[_i];
	      if (card.type === type) {
	        return card;
	      }
	    }
	  };
	
	  luhnCheck = function(num) {
	    var digit, digits, odd, sum, _i, _len;
	    odd = true;
	    sum = 0;
	    digits = (num + '').split('').reverse();
	    for (_i = 0, _len = digits.length; _i < _len; _i++) {
	      digit = digits[_i];
	      digit = parseInt(digit, 10);
	      if ((odd = !odd)) {
	        digit *= 2;
	      }
	      if (digit > 9) {
	        digit -= 9;
	      }
	      sum += digit;
	    }
	    return sum % 10 === 0;
	  };
	
	  hasTextSelected = function($target) {
	    var _ref;
	    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
	      return true;
	    }
	    if ((typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? _ref.createRange : void 0 : void 0) != null) {
	      if (document.selection.createRange().text) {
	        return true;
	      }
	    }
	    return false;
	  };
	
	  reFormatNumeric = function(e) {
	    return setTimeout(function() {
	      var $target, value;
	      $target = $(e.currentTarget);
	      value = $target.val();
	      value = value.replace(/\D/g, '');
	      return $target.val(value);
	    });
	  };
	
	  reFormatCardNumber = function(e) {
	    return setTimeout(function() {
	      var $target, value;
	      $target = $(e.currentTarget);
	      value = $target.val();
	      value = $.payment.formatCardNumber(value);
	      return $target.val(value);
	    });
	  };
	
	  formatCardNumber = function(e) {
	    var $target, card, digit, length, re, upperLength, value;
	    digit = String.fromCharCode(e.which);
	    if (!/^\d+$/.test(digit)) {
	      return;
	    }
	    $target = $(e.currentTarget);
	    value = $target.val();
	    card = cardFromNumber(value + digit);
	    length = (value.replace(/\D/g, '') + digit).length;
	    upperLength = 16;
	    if (card) {
	      upperLength = card.length[card.length.length - 1];
	    }
	    if (length >= upperLength) {
	      return;
	    }
	    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
	      return;
	    }
	    if (card && card.type === 'amex') {
	      re = /^(\d{4}|\d{4}\s\d{6})$/;
	    } else {
	      re = /(?:^|\s)(\d{4})$/;
	    }
	    if (re.test(value)) {
	      e.preventDefault();
	      return setTimeout(function() {
	        return $target.val(value + ' ' + digit);
	      });
	    } else if (re.test(value + digit)) {
	      e.preventDefault();
	      return setTimeout(function() {
	        return $target.val(value + digit + ' ');
	      });
	    }
	  };
	
	  formatBackCardNumber = function(e) {
	    var $target, value;
	    $target = $(e.currentTarget);
	    value = $target.val();
	    if (e.which !== 8) {
	      return;
	    }
	    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
	      return;
	    }
	    if (/\d\s$/.test(value)) {
	      e.preventDefault();
	      return setTimeout(function() {
	        return $target.val(value.replace(/\d\s$/, ''));
	      });
	    } else if (/\s\d?$/.test(value)) {
	      e.preventDefault();
	      return setTimeout(function() {
	        return $target.val(value.replace(/\d$/, ''));
	      });
	    }
	  };
	
	  reFormatExpiry = function(e) {
	    return setTimeout(function() {
	      var $target, value;
	      $target = $(e.currentTarget);
	      value = $target.val();
	      value = $.payment.formatExpiry(value);
	      return $target.val(value);
	    });
	  };
	
	  formatExpiry = function(e) {
	    var $target, digit, val;
	    digit = String.fromCharCode(e.which);
	    if (!/^\d+$/.test(digit)) {
	      return;
	    }
	    $target = $(e.currentTarget);
	    val = $target.val() + digit;
	    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
	      e.preventDefault();
	      return setTimeout(function() {
	        return $target.val("0" + val + " / ");
	      });
	    } else if (/^\d\d$/.test(val)) {
	      e.preventDefault();
	      return setTimeout(function() {
	        return $target.val("" + val + " / ");
	      });
	    }
	  };
	
	  formatForwardExpiry = function(e) {
	    var $target, digit, val;
	    digit = String.fromCharCode(e.which);
	    if (!/^\d+$/.test(digit)) {
	      return;
	    }
	    $target = $(e.currentTarget);
	    val = $target.val();
	    if (/^\d\d$/.test(val)) {
	      return $target.val("" + val + " / ");
	    }
	  };
	
	  formatForwardSlashAndSpace = function(e) {
	    var $target, val, which;
	    which = String.fromCharCode(e.which);
	    if (!(which === '/' || which === ' ')) {
	      return;
	    }
	    $target = $(e.currentTarget);
	    val = $target.val();
	    if (/^\d$/.test(val) && val !== '0') {
	      return $target.val("0" + val + " / ");
	    }
	  };
	
	  formatBackExpiry = function(e) {
	    var $target, value;
	    $target = $(e.currentTarget);
	    value = $target.val();
	    if (e.which !== 8) {
	      return;
	    }
	    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
	      return;
	    }
	    if (/\d\s\/\s$/.test(value)) {
	      e.preventDefault();
	      return setTimeout(function() {
	        return $target.val(value.replace(/\d\s\/\s$/, ''));
	      });
	    }
	  };
	
	  reFormatCVC = function(e) {
	    return setTimeout(function() {
	      var $target, value;
	      $target = $(e.currentTarget);
	      value = $target.val();
	      value = value.replace(/\D/g, '').slice(0, 4);
	      return $target.val(value);
	    });
	  };
	
	  restrictNumeric = function(e) {
	    var input;
	    if (e.metaKey || e.ctrlKey) {
	      return true;
	    }
	    if (e.which === 32) {
	      return false;
	    }
	    if (e.which === 0) {
	      return true;
	    }
	    if (e.which < 33) {
	      return true;
	    }
	    input = String.fromCharCode(e.which);
	    return !!/[\d\s]/.test(input);
	  };
	
	  restrictCardNumber = function(e) {
	    var $target, card, digit, value;
	    $target = $(e.currentTarget);
	    digit = String.fromCharCode(e.which);
	    if (!/^\d+$/.test(digit)) {
	      return;
	    }
	    if (hasTextSelected($target)) {
	      return;
	    }
	    value = ($target.val() + digit).replace(/\D/g, '');
	    card = cardFromNumber(value);
	    if (card) {
	      return value.length <= card.length[card.length.length - 1];
	    } else {
	      return value.length <= 16;
	    }
	  };
	
	  restrictExpiry = function(e) {
	    var $target, digit, value;
	    $target = $(e.currentTarget);
	    digit = String.fromCharCode(e.which);
	    if (!/^\d+$/.test(digit)) {
	      return;
	    }
	    if (hasTextSelected($target)) {
	      return;
	    }
	    value = $target.val() + digit;
	    value = value.replace(/\D/g, '');
	    if (value.length > 6) {
	      return false;
	    }
	  };
	
	  restrictCVC = function(e) {
	    var $target, digit, val;
	    $target = $(e.currentTarget);
	    digit = String.fromCharCode(e.which);
	    if (!/^\d+$/.test(digit)) {
	      return;
	    }
	    if (hasTextSelected($target)) {
	      return;
	    }
	    val = $target.val() + digit;
	    return val.length <= 4;
	  };
	
	  setCardType = function(e) {
	    var $target, allTypes, card, cardType, val;
	    $target = $(e.currentTarget);
	    val = $target.val();
	    cardType = $.payment.cardType(val) || 'unknown';
	    if (!$target.hasClass(cardType)) {
	      allTypes = (function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = cards.length; _i < _len; _i++) {
	          card = cards[_i];
	          _results.push(card.type);
	        }
	        return _results;
	      })();
	      $target.removeClass('unknown');
	      $target.removeClass(allTypes.join(' '));
	      $target.addClass(cardType);
	      $target.toggleClass('identified', cardType !== 'unknown');
	      return $target.trigger('payment.cardType', cardType);
	    }
	  };
	
	  $.payment.fn.formatCardCVC = function() {
	    this.on('keypress', restrictNumeric);
	    this.on('keypress', restrictCVC);
	    this.on('paste', reFormatCVC);
	    this.on('change', reFormatCVC);
	    this.on('input', reFormatCVC);
	    return this;
	  };
	
	  $.payment.fn.formatCardExpiry = function() {
	    this.on('keypress', restrictNumeric);
	    this.on('keypress', restrictExpiry);
	    this.on('keypress', formatExpiry);
	    this.on('keypress', formatForwardSlashAndSpace);
	    this.on('keypress', formatForwardExpiry);
	    this.on('keydown', formatBackExpiry);
	    this.on('change', reFormatExpiry);
	    this.on('input', reFormatExpiry);
	    return this;
	  };
	
	  $.payment.fn.formatCardNumber = function() {
	    this.on('keypress', restrictNumeric);
	    this.on('keypress', restrictCardNumber);
	    this.on('keypress', formatCardNumber);
	    this.on('keydown', formatBackCardNumber);
	    this.on('keyup', setCardType);
	    this.on('paste', reFormatCardNumber);
	    this.on('change', reFormatCardNumber);
	    this.on('input', reFormatCardNumber);
	    this.on('input', setCardType);
	    return this;
	  };
	
	  $.payment.fn.restrictNumeric = function() {
	    this.on('keypress', restrictNumeric);
	    this.on('paste', reFormatNumeric);
	    this.on('change', reFormatNumeric);
	    this.on('input', reFormatNumeric);
	    return this;
	  };
	
	  $.payment.fn.cardExpiryVal = function() {
	    return $.payment.cardExpiryVal($(this).val());
	  };
	
	  $.payment.cardExpiryVal = function(value) {
	    var month, prefix, year, _ref;
	    value = value.replace(/\s/g, '');
	    _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
	    if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
	      prefix = (new Date).getFullYear();
	      prefix = prefix.toString().slice(0, 2);
	      year = prefix + year;
	    }
	    month = parseInt(month, 10);
	    year = parseInt(year, 10);
	    return {
	      month: month,
	      year: year
	    };
	  };
	
	  $.payment.validateCardNumber = function(num) {
	    var card, _ref;
	    num = (num + '').replace(/\s+|-/g, '');
	    if (!/^\d+$/.test(num)) {
	      return false;
	    }
	    card = cardFromNumber(num);
	    if (!card) {
	      return false;
	    }
	    return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
	  };
	
	  $.payment.validateCardExpiry = function(month, year) {
	    var currentTime, expiry, _ref;
	    if (typeof month === 'object' && 'month' in month) {
	      _ref = month, month = _ref.month, year = _ref.year;
	    }
	    if (!(month && year)) {
	      return false;
	    }
	    month = $.trim(month);
	    year = $.trim(year);
	    if (!/^\d+$/.test(month)) {
	      return false;
	    }
	    if (!/^\d+$/.test(year)) {
	      return false;
	    }
	    if (!((1 <= month && month <= 12))) {
	      return false;
	    }
	    if (year.length === 2) {
	      if (year < 70) {
	        year = "20" + year;
	      } else {
	        year = "19" + year;
	      }
	    }
	    if (year.length !== 4) {
	      return false;
	    }
	    expiry = new Date(year, month);
	    currentTime = new Date;
	    expiry.setMonth(expiry.getMonth() - 1);
	    expiry.setMonth(expiry.getMonth() + 1, 1);
	    return expiry > currentTime;
	  };
	
	  $.payment.validateCardCVC = function(cvc, type) {
	    var card, _ref;
	    cvc = $.trim(cvc);
	    if (!/^\d+$/.test(cvc)) {
	      return false;
	    }
	    card = cardFromType(type);
	    if (card != null) {
	      return _ref = cvc.length, __indexOf.call(card.cvcLength, _ref) >= 0;
	    } else {
	      return cvc.length >= 3 && cvc.length <= 4;
	    }
	  };
	
	  $.payment.cardType = function(num) {
	    var _ref;
	    if (!num) {
	      return null;
	    }
	    return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
	  };
	
	  $.payment.formatCardNumber = function(num) {
	    var card, groups, upperLength, _ref;
	    num = num.replace(/\D/g, '');
	    card = cardFromNumber(num);
	    if (!card) {
	      return num;
	    }
	    upperLength = card.length[card.length.length - 1];
	    num = num.slice(0, upperLength);
	    if (card.format.global) {
	      return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
	    } else {
	      groups = card.format.exec(num);
	      if (groups == null) {
	        return;
	      }
	      groups.shift();
	      groups = $.grep(groups, function(n) {
	        return n;
	      });
	      return groups.join(' ');
	    }
	  };
	
	  $.payment.formatExpiry = function(expiry) {
	    var mon, parts, sep, year;
	    parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
	    if (!parts) {
	      return '';
	    }
	    mon = parts[1] || '';
	    sep = parts[2] || '';
	    year = parts[3] || '';
	    if (year.length > 0) {
	      sep = ' / ';
	    } else if (sep === ' /') {
	      mon = mon.substring(0, 1);
	      sep = '';
	    } else if (mon.length === 2 || sep.length > 0) {
	      sep = ' / ';
	    } else if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
	      mon = "0" + mon;
	      sep = ' / ';
	    }
	    return mon + sep + year;
	  };
	
	}).call(this);


/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["step header step3 ",{"t":4,"f":["active"],"n":50,"r":"step.active"}," ",{"t":4,"f":["completed"],"n":50,"r":"step.completed"}],"role":"tab"},"f":["Payment Details"]}," ",{"t":4,"f":[],"n":50,"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment step3 ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":[],"n":50,"r":"step.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"payment_loader"},"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"wait_text","style":"margin-top:90px !important;"},"f":["Please Wait"]}," ",{"t":7,"e":"div","a":{"class":"ui text loader loader_position"}}]}]}],"n":50,"r":"step.submitting"}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"div","a":{"class":"row one column"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"span","a":{"class":"amtNotice"},"f":[{"t":4,"f":["A non-refundable Convenience Fee of ",{"t":4,"f":[{"t":3,"x":{"r":["money","booking.pcf_per_passenger","meta.display_currency"],"s":"_0(_1,_2)"}}," per passenger"],"n":50,"x":{"r":["booking.pcf_per_passenger"],"s":"_0>0"}},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["money","booking.convenienceFee","meta.display_currency"],"s":"_0(_1,_2)"}}],"x":{"r":["booking.pcf_per_passenger"],"s":"_0>0"}}," is applicable on this booking."],"n":50,"x":{"r":["booking.convenienceFee"],"s":"_0>0"}},{"t":4,"n":51,"f":[" "],"x":{"r":["booking.convenienceFee"],"s":"_0>0"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"pay_div_left"},"f":[{"t":7,"e":"div","a":{"class":"div_left_source"},"f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"1==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",1]"}}},"f":["CREDIT CARD"]}," ",{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"2==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",2]"}}},"f":["DEBIT CARD"]}," ",{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"3==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",3]"}}},"f":["NET BANKING"]}," ",{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"4==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",4]"}}},"f":["WALLET"]}," ",{"t":4,"f":[{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"5==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",5]"}}},"f":["EMI"]}],"n":50,"r":"emiPaymentReady"}," ",{"t":4,"f":[{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"6==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",6]"}}},"f":["UPI"]}],"n":50,"r":"upiEnable"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"pay_div_right"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"credit-card"},"f":[{"t":7,"e":"div","a":{"class":"ui two column grid"},"f":[{"t":7,"e":"div","a":{"class":"column ten wide"},"v":{"click":{"m":"resetCC","a":{"r":["event"],"s":"[_0]"}}},"f":[{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":[{"t":4,"f":["Credit"],"n":50,"x":{"r":["booking.payment.active"],"s":"1==_0"}},{"t":4,"n":51,"f":["Debit"],"x":{"r":["booking.payment.active"],"s":"1==_0"}}," Card Number ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cc","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"card-number fluid","cardType":[{"t":2,"r":"active"}],"cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.number"}],"error":[{"t":2,"r":"step.errors.number"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"three expiry fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Month ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.cardMonths"}],"value":[{"t":2,"r":"cc.exp_month"}],"error":[{"t":2,"r":"step.errors.exp_month"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Year ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.cardYears"}],"value":[{"t":2,"r":"cc.exp_year"}],"error":[{"t":2,"r":"step.errors.exp_year"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["CVV No ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cvv","a":{"class":"fluid cvv","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.cvv"}],"error":[{"t":2,"r":"step.errors.cvv"}]},"v":{"click":"reset-cc"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"cvv-image"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["4 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv4-img"},"f":[" "]}],"n":50,"x":{"r":["cc.type"],"s":"\"amex\"==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","f":["3 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv3-img"},"f":[" "]}],"x":{"r":["cc.type"],"s":"\"amex\"==_0"}}]}],"n":50,"r":"cc.type"}," ",{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Card Holder's Name ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"fluid","value":[{"t":2,"r":"cc.name"}],"error":[{"t":2,"r":"step.errors.name"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"store field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"disabled":[{"t":2,"r":"cc.id"}],"type":"checkbox","checked":[{"t":2,"r":"cc.store"}]}}," Store card for future use."]}]}]}," ",{"t":7,"e":"div","a":{"class":"column six wide"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Saved cards"]}," ",{"t":7,"e":"div","a":{"class":"ui list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"setCard","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"r":"number","s":true}]}]}],"n":52,"r":"cards"}]}]}],"n":50,"r":"cards"}]}]}]}],"n":50,"x":{"r":["active"],"s":"1==_0||2==_0"}},{"t":4,"n":51,"f":[{"t":4,"n":50,"x":{"r":["active"],"s":"_0==3"},"f":[{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"Bank field step3netbanking"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select Your Bank ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"class":"bank fluid","value":[{"t":2,"r":"netbanking.net_banking"}],"error":[{"t":2,"r":"step.errors.net_banking"}],"options":[{"t":2,"r":"banks"}]}}]}]}]},{"t":4,"n":50,"x":{"r":["active"],"s":"(!(_0==3))&&(_0==4)"},"f":[" ",{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"mobi_content field step3wallet"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select Your Wallet ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"class":"wallet fluid","value":[{"t":2,"r":"wallet.wallet_type"}],"error":[{"t":2,"r":"step.errors.wallet_type"}],"options":[{"t":2,"r":"wallets"}]},"f":[]}]}]}]},{"t":4,"n":50,"x":{"r":["active"],"s":"(!(_0==3))&&((!(_0==4))&&(_0==5))"},"f":[" ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"mobi_content field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Pay Through: ",{"t":7,"e":"span","a":{"class":"required"},"f":["*",{"t":7,"e":"div","a":{"class":"emi_warning"},"f":["(Please note:EMI payment is applicable only for credit card.)"]}]}]}," ",{"t":7,"e":"select","a":{"name":"emi_banks","id":"emi_banks"},"v":{"change":{"m":"showEmiPlans","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"option","a":{"value":"","style":"display:none;"}}," ",{"t":4,"f":[{"t":7,"e":"option","a":{"value":[{"t":2,"r":".planId"}],"class":[{"t":2,"r":".BINs"}],"id":[{"t":2,"r":".subventionPaidBy"}],"data-value":[{"t":2,"r":".midProcesses"}]},"f":[{"t":2,"r":".gtwName"}]}],"r":"emi_banks"}]}]}," ",{"t":7,"e":"div","f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select You Plan: ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"table","a":{"id":"planTable","border":"1","class":"emiTable"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th"}," ",{"t":7,"e":"th","f":["EMI Plans"]}," ",{"t":7,"e":"th","f":["Monthly Installments"]}," ",{"t":7,"e":"th","f":["Total Cost"]}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"input","a":{"type":"radio","name":"emi_plan_radio","id":"emi_plan_radio","value":[{"t":2,"r":".tenureId"}],"class":"emi_plan_radio"},"v":{"click":{"m":"showCardFields","a":{"r":[],"s":"[]"}}}}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":".tenureMonths"}," Months @ ",{"t":2,"r":".processingFeePercent"}," % p.a"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":".currency"}," ",{"t":2,"r":".emiAmount"}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":".currency"}," ",{"t":2,"r":".total"}]}]}],"n":50,"x":{"r":[".planId","selectedPlan"],"s":"_0==_1"}}],"r":"emi_plans"}]}],"n":50,"r":"showEmiPlans"}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"credit-card"},"f":[{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Credit Card Number ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cc","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"card-number fluid","cardType":[{"t":2,"r":"active"}],"cctype":[{"t":2,"r":"emi.type"}],"value":[{"t":2,"r":"emi.card_number"}],"error":[{"t":2,"r":"step.errors.number"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"store field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"disabled":[{"t":2,"r":"emi.id"}],"type":"checkbox","checked":[{"t":2,"r":"emi.store"}]}}," Store card for future use."]}]}," ",{"t":7,"e":"div","a":{"class":"three expiry fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Month ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.cardMonths"}],"value":[{"t":2,"r":"emi.exp_month"}],"error":[{"t":2,"r":"step.errors.exp_month"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Year ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.cardYears"}],"value":[{"t":2,"r":"emi.exp_year"}],"error":[{"t":2,"r":"step.errors.exp_year"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["CVV No ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cvv","a":{"class":"fluid cvv","cctype":[{"t":2,"r":"emi.card_type"}],"value":[{"t":2,"r":"emi.cvv"}],"error":[{"t":2,"r":"step.errors.cvv"}]},"v":{"click":"reset-cc"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"cvv-image"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["4 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv4-img"},"f":[" "]}],"n":50,"x":{"r":["emi.type"],"s":"\"amex\"==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","f":["3 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv3-img"},"f":[" "]}],"x":{"r":["emi.type"],"s":"\"amex\"==_0"}}]}],"n":50,"r":"emi.type"}," ",{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Card Holder's Name ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"fluid","value":[{"t":2,"r":"emi.name"}],"error":[{"t":2,"r":"step.errors.name"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"mobi_content field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Issuing Bank: ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"value":[{"t":2,"r":"emi.issuing_bank"}],"placeholder":"Issuing Bank","id":"issuing_bank"}}]}],"n":50,"r":"readyCardFields"}]}],"n":50,"r":"emiPaymentReady"},{"t":4,"n":51,"f":[{"t":4,"n":50,"x":{"r":["emi_unavailable"],"s":"_0"},"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message"},"f":[{"t":2,"r":"emi_unavailable"}]}]},{"t":4,"n":50,"x":{"r":["emi_unavailable"],"s":"!(_0)"},"f":[" ",{"t":7,"e":"div","a":{"class":"payment_loader"},"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"wait_text"},"f":["Please Wait"]}," ",{"t":7,"e":"div","a":{"class":"ui text loader loader_position"}}]}]}]}],"r":"emiPaymentReady"}]},{"t":4,"n":50,"x":{"r":["active"],"s":"(!(_0==3))&&((!(_0==4))&&((!(_0==5))&&(_0==6)))"},"f":[" ",{"t":7,"e":"div","a":{"class":"mobi_content field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Enter Your VPA ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"value":[{"t":2,"r":"booking.payment.upi.virtual_address"}],"placeholder":"Enter Virtual Payment Address","id":"upi_cli_virtual_add"},"f":[]}]}]}],"x":{"r":["active"],"s":"1==_0||2==_0"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"step.errors"}]}],"n":50,"r":"step.errors"}," ",{"t":7,"e":"div","a":{"class":"note"},"f":[{"t":7,"e":"span","f":["Please Note :"]}," The charge will appear on your credit card / Account statement as 'Airtickets India Pvt Ltd'"]}," ",{"t":7,"e":"div","a":{"class":"agreement field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"accepted"}]}}," I have read and accepted the ",{"t":7,"e":"a","a":{"href":"/b2c/cms/termsofservices/2","target":"_blank"},"f":["Terms Of Service"]},"*"]}]}," ",{"t":7,"e":"div","a":{"class":"price"},"f":[{"t":7,"e":"div","a":{"class":"ui four column middle top aligned relaxed fitted grid","style":"position: relative"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"column four wide right aligned"},"f":[{"t":7,"e":"button","a":{"type":"submit","class":["book_flight ui wizard button massive ",{"t":4,"f":["green"],"n":50,"r":"accepted"},{"t":4,"n":51,"f":["red"],"r":"accepted"}]},"m":[{"t":4,"f":["disabled=\"disabled\""],"n":51,"r":"accepted"}],"f":["BOOK FLIGHT"]}," ",{"t":7,"e":"div","a":{"class":"loader_x"},"f":[{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}," ",{"t":7,"e":"div","a":{"class":"line_x"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column two wide right aligned"},"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":["TOTAL:"]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"column five wide left aligned"},"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","promovalue","meta.display_currency"],"s":"_0(_1+_2-_3,_4)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column five wide left aligned"},"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"amtNotice"},"f":["(",{"t":2,"r":"meta.display_currency"}," Price is indicative only. You will be charged equivalent in INR. ",{"t":3,"x":{"r":["formatPayMoney","booking.price","booking.convenienceFee","promovalue"],"s":"_0(_1+_2-_3)"}},")"]}],"n":50,"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"amtNotice"},"f":["(Payable Amount)"]}],"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"column five wide left aligned"},"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","meta.display_currency"],"s":"_0(_1+_2,_3)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column five wide left aligned"},"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"amtNotice"},"f":["(",{"t":2,"r":"meta.display_currency"}," Price is indicative only. You will be charged equivalent in INR. ",{"t":3,"x":{"r":["formatPayMoney","booking.price","booking.convenienceFee"],"s":"_0(_1+_2)"}},")"]}],"n":50,"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"amtNotice"},"f":["(Payable Amount)"]}],"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}}]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"pay_bottom"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/vbv_250.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/mastercard_securecode.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/AMEX_SafeKey_180x99px.png"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/pci-dss-compliant.jpg"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/SSL-security-seal.png"}}]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}}],"n":51,"r":"step.completed"}],"x":{"r":["booking.steps.3","booking.payment.cc","booking.payment.netbanking","booking.payment.active","booking.payment.wallet","booking.payment.emi","booking.price"],"s":"{step:_0,cc:_1,netbanking:_2,active:_3,wallet:_4,emi:_5,upiEnable:(_6>=90000)?false:true}"}}]};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(99);
	
	var Input = __webpack_require__(37),
	    $ = __webpack_require__(33);
	
	module.exports = Input.extend({
	    template: __webpack_require__(100),
	
	    oncomplete: function() {
	        this._super();
	
	        $(this.find('input')).payment('formatCardNumber');
	
	        this.observe('value', function(value) {
	            this.set('cctype', $.payment.cardType(value));
	            var booking = this.parent.get('booking');
	            if(booking && typeof value !== 'undefined'){
	                var bin_digits = value.replace(' ','').slice(0,6);
	                if(value == '' || bin_digits.length < 6){
	                    booking.set('convenienceFee', 0);
	                    window.prevCCType = undefined;
	                    window.prevCardType = undefined;
	                } else if((this.get('cctype') != window.prevCCType || 
	                        this.get('cardType') != window.prevCardType) && 
	                        bin_digits.length >= 6) {
	                    var card_type = parseInt(this.get('cardType')) + 1;
	                        
	                        
	                    booking.pymtConvFee(card_type ,this.get('cctype'), bin_digits);
	
	                    window.prevCCType = this.get('cctype');
	                    window.prevCardType = this.get('cardType');
	                }
	            }
	            
	        }, {init: false});
	    },
	
	    onteadown: function() {
	        $(this.find('input')).payment('destroy');
	    }
	});

/***/ },
/* 99 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.7.1
	(function() {
	    var cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlashAndSpace, hasTextSelected, luhnCheck, reFormatCVC, reFormatCardNumber, reFormatExpiry, reFormatNumeric, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric, setCardType,
	        __slice = [].slice,
	        __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	    $.payment = {};
	
	    $.payment.fn = {};
	
	    $.fn.payment = function() {
	        var args, method;
	        method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	        return $.payment.fn[method].apply(this, args);
	    };
	
	    defaultFormat = /(\d{1,4})/g;
	
	    $.payment.cards = cards = [
	        {
	          type: 'rupay',
	          pattern:/^(508[5-9][0-9]{12})|(6069[8-9][0-9]{11})|(607[0-8][0-9]{12})|(6079[0-8][0-9]{11})|(608[0-5][0-9]{12})|(6521[5-9][0-9]{11})|(652[2-9][0-9]{12})|(6530[0-9]{12})|(6531[0-4][0-9]{11})/,
	          format: defaultFormat,
	          length: [16],
	          cvcLength: [3],
	          luhn: false
	        } ,        
	        {
	            type: 'visaelectron',
	            pattern: /^4(026|17500|405|508|844|91[37])/,
	            format: defaultFormat,
	            length: [16],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'maestro',
	            pattern: /^(5(018|0[23]|[68])|6(39|7))/,
	            format: defaultFormat,
	            length: [12, 13, 14, 15, 16, 17, 18, 19],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'forbrugsforeningen',
	            pattern: /^600/,
	            format: defaultFormat,
	            length: [16],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'dankort',
	            pattern: /^5019/,
	            format: defaultFormat,
	            length: [16],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'visa',
	            pattern: /^4/,
	            format: defaultFormat,
	            length: [13, 16],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'mastercard',
	            pattern: /^5[0-5]/,
	            format: defaultFormat,
	            length: [16],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'amex',
	            pattern: /^3[47]/,
	            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
	            length: [15],
	            cvcLength: [3, 4],
	            luhn: true
	        }, {
	            type: 'dinersclub',
	            pattern: /^3[0689]/,
	            format: defaultFormat,
	            length: [14],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'discover',
	            pattern: /^6([045]|22)/,
	            format: defaultFormat,
	            length: [16],
	            cvcLength: [3],
	            luhn: true
	        }, {
	            type: 'unionpay',
	            pattern: /^(62|88)/,
	            format: defaultFormat,
	            length: [16, 17, 18, 19],
	            cvcLength: [3],
	            luhn: false
	        }, {
	            type: 'jcb',
	            pattern: /^35/,
	            format: defaultFormat,
	            length: [16],
	            cvcLength: [3],
	            luhn: true
	        }
	    ];
	
	    cardFromNumber = function(num) {
	        var card, _i, _len;
	        num = (num + '').replace(/\D/g, '');
	        for (_i = 0, _len = cards.length; _i < _len; _i++) {
	            
	            card = cards[_i];
	            if(card.type == 'rupay') {
	                var bin_digits = num.replace(' ','').slice(0,6);
	                if((bin_digits >= 508500 && bin_digits<=508999) ||
	                   (bin_digits >= 606985 && bin_digits<=607984) ||
	                   (bin_digits >= 608001 && bin_digits<=608500) ||
	                   (bin_digits >= 652150 && bin_digits<=653149)) {
	                    return card;
	                }
	            } else {
	                if (card.pattern.test(num)) {
	                    return card;
	                }
	            }
	        }
	    };
	
	    cardFromType = function(type) {
	        var card, _i, _len;
	        for (_i = 0, _len = cards.length; _i < _len; _i++) {
	            card = cards[_i];
	            if (card.type === type) {
	                return card;
	            }
	        }
	    };
	
	    luhnCheck = function(num) {
	        var digit, digits, odd, sum, _i, _len;
	        odd = true;
	        sum = 0;
	        digits = (num + '').split('').reverse();
	        for (_i = 0, _len = digits.length; _i < _len; _i++) {
	            digit = digits[_i];
	            digit = parseInt(digit, 10);
	            if ((odd = !odd)) {
	                digit *= 2;
	            }
	            if (digit > 9) {
	                digit -= 9;
	            }
	            sum += digit;
	        }
	        return sum % 10 === 0;
	    };
	
	    hasTextSelected = function($target) {
	        var _ref;
	        if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
	            return true;
	        }
	        if ((typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? _ref.createRange : void 0 : void 0) != null) {
	            if (document.selection.createRange().text) {
	                return true;
	            }
	        }
	        return false;
	    };
	
	    reFormatNumeric = function(e) {
	        return setTimeout(function() {
	            var $target, value;
	            $target = $(e.currentTarget);
	            value = $target.val();
	            value = value.replace(/\D/g, '');
	            return $target.val(value);
	        });
	    };
	
	    reFormatCardNumber = function(e) {
	        return setTimeout(function() {
	            var $target, value;
	            $target = $(e.currentTarget);
	            value = $target.val();
	            value = $.payment.formatCardNumber(value);
	            return $target.val(value);
	        });
	    };
	
	    formatCardNumber = function(e) {
	        var $target, card, digit, length, re, upperLength, value;
	        digit = String.fromCharCode(e.which);
	        if (!/^\d+$/.test(digit)) {
	            return;
	        }
	        $target = $(e.currentTarget);
	        value = $target.val();
	        card = cardFromNumber(value + digit);
	        length = (value.replace(/\D/g, '') + digit).length;
	        upperLength = 16;
	        if (card) {
	            upperLength = card.length[card.length.length - 1];
	        }
	        if (length >= upperLength) {
	            return;
	        }
	        if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
	            return;
	        }
	        if (card && card.type === 'amex') {
	            re = /^(\d{4}|\d{4}\s\d{6})$/;
	        } else {
	            re = /(?:^|\s)(\d{4})$/;
	        }
	        if (re.test(value)) {
	            e.preventDefault();
	            return setTimeout(function() {
	                return $target.val(value + ' ' + digit);
	            });
	        } else if (re.test(value + digit)) {
	            e.preventDefault();
	            return setTimeout(function() {
	                return $target.val(value + digit + ' ');
	            });
	        }
	    };
	
	    formatBackCardNumber = function(e) {
	        var $target, value;
	        $target = $(e.currentTarget);
	        value = $target.val();
	        if (e.which !== 8) {
	            return;
	        }
	        if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
	            return;
	        }
	        if (/\d\s$/.test(value)) {
	            e.preventDefault();
	            return setTimeout(function() {
	                return $target.val(value.replace(/\d\s$/, ''));
	            });
	        } else if (/\s\d?$/.test(value)) {
	            e.preventDefault();
	            return setTimeout(function() {
	                return $target.val(value.replace(/\d$/, ''));
	            });
	        }
	    };
	
	    reFormatExpiry = function(e) {
	        return setTimeout(function() {
	            var $target, value;
	            $target = $(e.currentTarget);
	            value = $target.val();
	            value = $.payment.formatExpiry(value);
	            return $target.val(value);
	        });
	    };
	
	    formatExpiry = function(e) {
	        var $target, digit, val;
	        digit = String.fromCharCode(e.which);
	        if (!/^\d+$/.test(digit)) {
	            return;
	        }
	        $target = $(e.currentTarget);
	        val = $target.val() + digit;
	        if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
	            e.preventDefault();
	            return setTimeout(function() {
	                return $target.val("0" + val + " / ");
	            });
	        } else if (/^\d\d$/.test(val)) {
	            e.preventDefault();
	            return setTimeout(function() {
	                return $target.val("" + val + " / ");
	            });
	        }
	    };
	
	    formatForwardExpiry = function(e) {
	        var $target, digit, val;
	        digit = String.fromCharCode(e.which);
	        if (!/^\d+$/.test(digit)) {
	            return;
	        }
	        $target = $(e.currentTarget);
	        val = $target.val();
	        if (/^\d\d$/.test(val)) {
	            return $target.val("" + val + " / ");
	        }
	    };
	
	    formatForwardSlashAndSpace = function(e) {
	        var $target, val, which;
	        which = String.fromCharCode(e.which);
	        if (!(which === '/' || which === ' ')) {
	            return;
	        }
	        $target = $(e.currentTarget);
	        val = $target.val();
	        if (/^\d$/.test(val) && val !== '0') {
	            return $target.val("0" + val + " / ");
	        }
	    };
	
	    formatBackExpiry = function(e) {
	        var $target, value;
	        $target = $(e.currentTarget);
	        value = $target.val();
	        if (e.which !== 8) {
	            return;
	        }
	        if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
	            return;
	        }
	        if (/\d\s\/\s$/.test(value)) {
	            e.preventDefault();
	            return setTimeout(function() {
	                return $target.val(value.replace(/\d\s\/\s$/, ''));
	            });
	        }
	    };
	
	    reFormatCVC = function(e) {
	        return setTimeout(function() {
	            var $target, value;
	            $target = $(e.currentTarget);
	            value = $target.val();
	            value = value.replace(/\D/g, '').slice(0, 4);
	            return $target.val(value);
	        });
	    };
	
	    restrictNumeric = function(e) {
	        var input;
	        if (e.metaKey || e.ctrlKey) {
	            return true;
	        }
	        if (e.which === 32) {
	            return false;
	        }
	        if (e.which === 0) {
	            return true;
	        }
	        if (e.which < 33) {
	            return true;
	        }
	        input = String.fromCharCode(e.which);
	        return !!/[\d\s]/.test(input);
	    };
	
	    restrictCardNumber = function(e) {
	        var $target, card, digit, value;
	        $target = $(e.currentTarget);
	        digit = String.fromCharCode(e.which);
	        if (!/^\d+$/.test(digit)) {
	            return;
	        }
	        if (hasTextSelected($target)) {
	            return;
	        }
	        value = ($target.val() + digit).replace(/\D/g, '');
	        card = cardFromNumber(value);
	        if (card) {
	            return value.length <= card.length[card.length.length - 1];
	        } else {
	            return value.length <= 16;
	        }
	    };
	
	    restrictExpiry = function(e) {
	        var $target, digit, value;
	        $target = $(e.currentTarget);
	        digit = String.fromCharCode(e.which);
	        if (!/^\d+$/.test(digit)) {
	            return;
	        }
	        if (hasTextSelected($target)) {
	            return;
	        }
	        value = $target.val() + digit;
	        value = value.replace(/\D/g, '');
	        if (value.length > 6) {
	            return false;
	        }
	    };
	
	    restrictCVC = function(e) {
	        var $target, digit, val;
	        $target = $(e.currentTarget);
	        digit = String.fromCharCode(e.which);
	        if (!/^\d+$/.test(digit)) {
	            return;
	        }
	        if (hasTextSelected($target)) {
	            return;
	        }
	        val = $target.val() + digit;
	        return val.length <= 4;
	    };
	
	    setCardType = function(e) {
	        var $target, allTypes, card, cardType, val;
	        $target = $(e.currentTarget);
	        val = $target.val();
	        cardType = $.payment.cardType(val) || 'unknown';
	        if (!$target.hasClass(cardType)) {
	            allTypes = (function() {
	                var _i, _len, _results;
	                _results = [];
	                for (_i = 0, _len = cards.length; _i < _len; _i++) {
	                    card = cards[_i];
	                    _results.push(card.type);
	                }
	                return _results;
	            })();
	            $target.removeClass('unknown');
	            $target.removeClass(allTypes.join(' '));
	            $target.addClass(cardType);
	            $target.toggleClass('identified', cardType !== 'unknown');
	            return $target.trigger('payment.cardType', cardType);
	        }
	    };
	
	    $.payment.fn.formatCardCVC = function() {
	        this.on('keypress', restrictNumeric);
	        this.on('keypress', restrictCVC);
	        this.on('paste', reFormatCVC);
	        this.on('change', reFormatCVC);
	        this.on('input', reFormatCVC);
	        return this;
	    };
	
	    $.payment.fn.formatCardExpiry = function() {
	        this.on('keypress', restrictNumeric);
	        this.on('keypress', restrictExpiry);
	        this.on('keypress', formatExpiry);
	        this.on('keypress', formatForwardSlashAndSpace);
	        this.on('keypress', formatForwardExpiry);
	        this.on('keydown', formatBackExpiry);
	        this.on('change', reFormatExpiry);
	        this.on('input', reFormatExpiry);
	        return this;
	    };
	
	    $.payment.fn.formatCardNumber = function() {
	        this.on('keypress', restrictNumeric);
	        this.on('keypress', restrictCardNumber);
	        this.on('keypress', formatCardNumber);
	        this.on('keydown', formatBackCardNumber);
	        this.on('keyup', setCardType);
	        this.on('paste', reFormatCardNumber);
	        this.on('change', reFormatCardNumber);
	        this.on('input', reFormatCardNumber);
	        this.on('input', setCardType);
	        return this;
	    };
	
	    $.payment.fn.restrictNumeric = function() {
	        this.on('keypress', restrictNumeric);
	        this.on('paste', reFormatNumeric);
	        this.on('change', reFormatNumeric);
	        this.on('input', reFormatNumeric);
	        return this;
	    };
	
	    $.payment.fn.cardExpiryVal = function() {
	        return $.payment.cardExpiryVal($(this).val());
	    };
	
	    $.payment.cardExpiryVal = function(value) {
	        var month, prefix, year, _ref;
	        value = value.replace(/\s/g, '');
	        _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
	        if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
	            prefix = (new Date).getFullYear();
	            prefix = prefix.toString().slice(0, 2);
	            year = prefix + year;
	        }
	        month = parseInt(month, 10);
	        year = parseInt(year, 10);
	        return {
	            month: month,
	            year: year
	        };
	    };
	
	    $.payment.validateCardNumber = function(num) {
	        var card, _ref;
	        num = (num + '').replace(/\s+|-/g, '');
	        if (!/^\d+$/.test(num)) {
	            return false;
	        }
	        card = cardFromNumber(num);
	        if (!card) {
	            return false;
	        }
	        return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
	    };
	
	    $.payment.validateCardExpiry = function(month, year) {
	        var currentTime, expiry, _ref;
	        if (typeof month === 'object' && 'month' in month) {
	            _ref = month, month = _ref.month, year = _ref.year;
	        }
	        if (!(month && year)) {
	            return false;
	        }
	        month = $.trim(month);
	        year = $.trim(year);
	        if (!/^\d+$/.test(month)) {
	            return false;
	        }
	        if (!/^\d+$/.test(year)) {
	            return false;
	        }
	        if (!((1 <= month && month <= 12))) {
	            return false;
	        }
	        if (year.length === 2) {
	            if (year < 70) {
	                year = "20" + year;
	            } else {
	                year = "19" + year;
	            }
	        }
	        if (year.length !== 4) {
	            return false;
	        }
	        expiry = new Date(year, month);
	        currentTime = new Date;
	        expiry.setMonth(expiry.getMonth() - 1);
	        expiry.setMonth(expiry.getMonth() + 1, 1);
	        return expiry > currentTime;
	    };
	
	    $.payment.validateCardCVC = function(cvc, type) {
	        var card, _ref;
	        cvc = $.trim(cvc);
	        if (!/^\d+$/.test(cvc)) {
	            return false;
	        }
	        card = cardFromType(type);
	        if (card != null) {
	            return _ref = cvc.length, __indexOf.call(card.cvcLength, _ref) >= 0;
	        } else {
	            return cvc.length >= 3 && cvc.length <= 4;
	        }
	    };
	
	    $.payment.cardType = function(num) {
	        var _ref;
	        if (!num) {
	            return null;
	        }
	        return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
	    };
	
	    $.payment.formatCardNumber = function(num) {
	        var card, groups, upperLength, _ref;
	        num = num.replace(/\D/g, '');
	        card = cardFromNumber(num);
	        if (!card) {
	            return num;
	        }
	        upperLength = card.length[card.length.length - 1];
	        num = num.slice(0, upperLength);
	        if (card.format.global) {
	            return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
	        } else {
	            groups = card.format.exec(num);
	            if (groups == null) {
	                return;
	            }
	            groups.shift();
	            groups = $.grep(groups, function(n) {
	                return n;
	            });
	            return groups.join(' ');
	        }
	    };
	
	    $.payment.formatExpiry = function(expiry) {
	        var mon, parts, sep, year;
	        parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
	        if (!parts) {
	            return '';
	        }
	        mon = parts[1] || '';
	        sep = parts[2] || '';
	        year = parts[3] || '';
	        if (year.length > 0) {
	            sep = ' / ';
	        } else if (sep === ' /') {
	            mon = mon.substring(0, 1);
	            sep = '';
	        } else if (mon.length === 2 || sep.length > 0) {
	            sep = ' / ';
	        } else if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
	            mon = "0" + mon;
	            sep = ' / ';
	        }
	        return mon + sep + year;
	    };
	
	}).call(this);


/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui input ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"input","a":{"type":[{"t":4,"f":["text"],"n":50,"r":"disabled"},{"t":4,"n":51,"f":["tel"],"r":"disabled"}],"name":[{"t":2,"r":"name"}],"value":[{"t":2,"r":"value"}]},"m":[{"t":4,"f":["placeholder=\"",{"t":2,"r":"placeholder"},"\""],"n":51,"r":"large"},{"t":4,"f":["disabled"],"n":50,"r":"disabled"},{"t":4,"f":["disabled=\"disabled\""],"n":50,"x":{"r":["state.disabled","state.submitting"],"s":"_0||_1"}}]}," ",{"t":4,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":["cardType ",{"t":2,"r":"cctype"}]},"f":[{"t":2,"r":"cctype"}]}]}],"n":50,"r":"cctype"},{"t":4,"n":51,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":"cardType visa"},"f":["Visa"]}," ",{"t":7,"e":"li","a":{"class":"cardType master"},"f":["Mastercard"]}," ",{"t":4,"f":[{"t":7,"e":"li","a":{"class":"cardType rupay"},"f":["Rupay"]}],"n":50,"x":{"r":["cardType"],"s":"1!=_0&&5!=_0"}}," ",{"t":4,"f":[{"t":7,"e":"li","a":{"class":"cardType amex"},"f":["American Express"]}," ",{"t":7,"e":"li","a":{"class":"cardType diners"},"f":["Diners"]}],"n":50,"x":{"r":["cardType"],"s":"1==_0||5==_0"}}]}],"r":"cctype"}]}]};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//require('jquery.payment');
	__webpack_require__(99);
	var Input = __webpack_require__(37),
	    $ = __webpack_require__(33);
	
	module.exports = Input.extend({
	    data: function() {
	        return {
	             type: 'tel'
	           // type: 'password'
	        };
	    },
	
	    oncomplete: function() {
	        this._super();
	        $(this.find('input')).payment('formatCardCVC');
	        
	    },
	
	    onteadown: function() {
	        $(this.find('input')).payment('destroy');
	    }
	});

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(96);
	
	var Input = __webpack_require__(37),
	         _ = __webpack_require__(30),
	    $ = __webpack_require__(33);
	
	module.exports = Input.extend({
	    data: function() {
	        return {
	             type: 'tel'
	           // type: 'password'
	        };
	    },
	
	    oncomplete: function() {
	        this._super();
	        var view=this;
	        $(this.find('input')).payment('formatCardExpiry');
	        $(this.find('input')).keyup(function() {
	            var booking = view.get('booking');
	        
	        var cardexpiry=$(view.find('input')).val();
	     //   console.log(cardexpiry);
	        if(cardexpiry !=null && cardexpiry !=''){
	            cardexpiry.replace(/ /g,'');
	            var cardarr=cardexpiry.split('/');
	            if(cardarr[0]!= null){
	            booking.set('payment.cc.exp_month',_.parseInt(cardarr[0]));}
	        if(cardarr[1]!= null){
	            var len=cardarr[1].length;
	            var cardyear=_.parseInt(cardarr[1]);
	            if(cardyear<100){
	                cardyear=2000+cardyear;
	            }else if(cardyear<1000){
	                cardyear=2000+cardyear;
	            }
	        //    console.log(cardyear);
	            booking.set('payment.cc.exp_year',cardyear);}
	        }
	          });
	    },
	
	    onteadown: function() {
	        $(this.find('input')).payment('destroy');
	    }
	});

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30)
	    ;
	
	var Form = __webpack_require__(34),
	
	    h_money = __webpack_require__(69)(),
	    h_duration = __webpack_require__(81)(),
	    h_date = __webpack_require__(94)()
	    ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(104),
	    back: function() {
	        this.get('booking').activate(3);
	    },
	        
	   });

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"step header step4 active","role":"tab"},"f":["Booking"]}," ",{"t":7,"e":"form","a":{"action":"javascript:;","class":"ui form segment step4","style":"height: 400px; text-align: center;"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"booking-id"},"f":["Booking ID: ",{"t":2,"r":"booking.aircart_id"}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["We have received your Payment and your Booking is in process, our customer support team will contact you shortly. Or Call our customer support team for more detail."]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"booking.aircart_id"}]},"f":["View your ticket"]}],"n":50,"x":{"r":["booking","booking.aircart_status"],"s":"_0.isNew(_1)"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["Your Booking is Successful!"]}],"n":50,"x":{"r":["booking","booking.aircart_status"],"s":"_0.isBooked(_1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["Your Booking is in process!"]}],"x":{"r":["booking","booking.aircart_status"],"s":"_0.isBooked(_1)"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"booking.aircart_id"}]},"f":["View your ticket"]}],"x":{"r":["booking","booking.aircart_status"],"s":"_0.isNew(_1)"}}],"n":50,"r":"step.completed"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"payment_loader"},"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"wait_text","style":"margin-top:55px;"},"f":["Please Wait"]},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"style":"font-size:17px;"},"f":["Your booking is in progress."]},{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui text loader loader_position"}}]}]}],"r":"step.completed"}]}],"n":50,"r":"step.active"}],"x":{"r":["booking.steps.4"],"s":"{step:_0}"}}]};

/***/ },
/* 105 */,
/* 106 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(33),
	    page = __webpack_require__(32)
	    ;
	
	var Meta = __webpack_require__(68),
	    SearchForm = __webpack_require__(312),
	    SearchResults =  __webpack_require__(321),
	    Booking =  __webpack_require__(345)
	    ;
	
	
	__webpack_require__(347);
	__webpack_require__(106);
	
	var actions = {
	    form: function(ctx, next) {
	        (new SearchForm()).render('#app').then(function() { next(); });
	    },
	    search: function(ctx, next) {
	        var query = Meta.parseQuery(ctx.querystring);
	
	        (new SearchResults({data: { url: ctx.params[0], force: query.force || false, cs: query.cs || null }})).render('#app').then(function() { next(); });
	    },
	    booking: function(ctx, next) {
	        (new Booking({ data: { id: ctx.params.id }})).render('#app').then(function() { next(); });
	    }
	};
	
	Meta.instance().then(function(meta) {
	    page('/b2c/booking/:id', actions.booking);
	    page('/b2c/flights', actions.form);
	    page('/b2c/flights/search', actions.form);
	    page(/\/b2c\/flights\/search\/(.*)/, actions.search);
	
	
	    page({click: false});
	});

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	var Page = __webpack_require__(313),
	    Search = __webpack_require__(56),
	    Meta = __webpack_require__(68)
	    ;
	
	module.exports = Page.extend({
	    template: __webpack_require__(314),
	
	    components: {
	        'search-form': __webpack_require__(315)
	    },
	
	    data: function() {
	        var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];
	        // console.log("META: ", Meta.object);
	        return {
	            search: new Search(),
	            meta: Meta.object,
	            moment: moment,
	            // recent: _.map(recent, function(i) { return moment(i.search.flights[0].depart_at) ? i : null; })
	        }
	    }
	});

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(35),
	    Auth = __webpack_require__(80),
	    _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	module.exports = Component.extend({
	    isolated: true,
	
	    partials: {
	        'base-panel': __webpack_require__(105)
	    },
	
	    components: {
	        layout: __webpack_require__(72)
	    },
	
	    signin: function() { Auth.login().then(function(data) { window.location.reload() }); },
	
	    signup: function() { Auth.signup(); },
	
	    leftMenu: function() { this.toggle('leftmenu'); },
	    
	    swapSearch: function(search) {
	        var view = this;
	        search = _.cloneDeep(search);
	        _.each(search.flights, function(i, k) {
	            i.depart_at = moment(i.depart_at);
	
	            if (i.return_at) {
	                i.return_at = moment(i.return_at);
	            }
	        });
	
	        search.saved = true;
	
	
	        this.get('search').set(search).then(function() {
	            view.set('search.saved', false);
	        });
	    }
	});


/***/ },
/* 314 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","f":[{"t":7,"e":"table","a":{"style":"width: 100%"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"padding-right: 10px;"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed segment"},"f":[{"t":7,"e":"search-form","a":{"class":"basic segment","search":[{"t":2,"r":"search"}]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"class":"recent_searches"},"f":[{"t":7,"e":"div","a":{"class":"ui header","style":"  font-size: 16px; font-weight: normal; color: #202629; margin-bottom: 10px;"},"f":["Recent Searches"]}," ",{"t":7,"e":"div","a":{"class":"ui segment recent-searches"},"f":[{"t":7,"e":"div","a":{"class":"box"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"date"},"f":[{"t":2,"x":{"r":["moment","./search.flights.0.depart_at"],"s":"_0(_1).format(\"MMM\")"}},{"t":7,"e":"span","f":[{"t":2,"x":{"r":["moment","./search.flights.0.depart_at"],"s":"_0(_1).format(\"DD\")"}}]}]}," ",{"t":7,"e":"div","a":{"class":"direction","style":"cursor: pointer;"},"v":{"click":{"m":"swapSearch","a":{"r":["search"],"s":"[_0]"}}},"f":[{"t":2,"r":"from.city"}," ",{"t":7,"e":"span","a":{"class":[{"t":4,"f":["back"],"n":50,"x":{"r":["./search.tripType"],"s":"2==_0"}},{"t":4,"n":51,"f":["to"],"x":{"r":["./search.tripType"],"s":"2==_0"}}]},"f":[" "]}," ",{"t":2,"r":"to.city"}," ",{"t":4,"f":["(multicity)"],"n":50,"x":{"r":["./search.tripType"],"s":"3==_0"}}]}," ",{"t":7,"e":"div","a":{"class":"info"},"f":[{"t":4,"f":[{"t":2,"r":"./search.passengers.0"}," Adult"],"n":50,"x":{"r":["./search.passengers.0"],"s":"_0>0"}},{"t":4,"f":[", ",{"t":2,"r":"./search.passengers.1"}," Child"],"n":50,"x":{"r":["./search.passengers.1"],"s":"_0>0"}},{"t":4,"f":[", ",{"t":2,"r":"./search.passengers.2"}," Infant"],"n":50,"x":{"r":["./search.passengers.2"],"s":"_0>0"}}]}]}],"n":52,"r":"recent"}]}]}]}],"n":50,"r":"recent"}]}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var page = __webpack_require__(32),
	    moment = __webpack_require__(44)
	    ;
	
	var Form = __webpack_require__(34),
	    Search = __webpack_require__(316),
	    Meta = __webpack_require__(68)
	    ;
	
	var ROUTES = __webpack_require__(57).flights;
	// console.log(ROUTES);
	
	module.exports = Form.extend({
	    template: __webpack_require__(317),
	
	    components: {
	        'ui-spinner': __webpack_require__(318),
	        'ui-airport': __webpack_require__(320),
	        'ui-calendar': __webpack_require__(43)
	    },
	
	    data: function() {
	        // var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];
	        
	        return {
	            meta: Meta.object,
	            moment: moment,
	            // search: new Search(),
	            // recent: _.map(recent, function(i) { return moment(i.search.flights[0].depart_at) ? i : null; })      
	        }
	    },
	
	    onconfig: function() {
	        // console.log('META: ', META.object);
	        this.on('next', function(view) {
	            //TODO: think of better way to handle this
	            $(this.find('form')).click();
	
	            if (this.get('modify') && !this.get('search.domestic')) {
	                return;
	            }
	
	            if (view.get('next')) {
	                console
	                var next = view.get('next').split('-');
	
	                if ('to' == next[0]) {
	                    $(this.find('.' + view.get('next') + ' input.search')).click().focus();
	                }
	
	                if ('depart' == next[0]) {
	                    $('.' + view.get('next')).focus();
	                }
	
	                if ('return' == next[0]) {
	                    $('.' + view.get('next')).focus();
	                }
	            }
	        });
	    },
	
	    oncomplete: function() {
	        if (false) {
	            var open = false;
	            $('#m_menu').sidebar({ onHidden: function() { $('#m_btn').removeClass('disabled');  }, onShow: function() { $('#m_btn').addClass('disabled');  }});
	            $('.dropdown').dropdown();
	
	            $('#m_btn', this.el).on('click.layout',function(){
	                if (!$(this).hasClass('disabled')) {
	                    $('#m_menu').sidebar('show');
	                }
	
	            });
	
	            $('.pusher').one('click', function(e) {
	                e.stopPropagation();
	            });
	
	        }
	
	        if (this.get('modify')) {
	            this.set('open', true);
	
	            this.set('search.flights', this.get('search.flights'));
	
	            $(this.find('.ui.modal')).modal('show');
	
	        }
	    },
	
	    onteardown: function() {
	      this.set('modify', null);
	    },
	
	    toggleRoundtrip: function() {
	        if (2 !== this.get('search.tripType')) {
	            this.set('search.tripType', 2);
	        }
	    },
	
	    addTraveler: function(type) {
	        var value = this.get('search.passengers.' + type);
	
	        if (value < 9) {
	            this.set('search.passengers.' + type, value + 1);
	        }
	    },
	
	    removeTraveler: function(type) {
	        var value = this.get('search.passengers.' + type);
	
	        if (value > 0) {
	            this.set('search.passengers.' + type, value - 1);
	        }
	    },
	
	    removeFlight: function(i) { this.get('search').removeFlight(i); },
	    addFlight: function() { this.get('search').addFlight(); },
	
	    submit: function() {
	        var view = this;
	        this.post(ROUTES.search, this.serialize())
	            .then(function(search) {
	                if (view.get('modify')) {
	                    $(view.find('.ui.modal')).modal('hide');
	                }
	
	                page(search.url);
	            });
	    },
	
	    serialize: function() { return this.get('search').toJSON(); }
		
	});

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(33),
	    moment = __webpack_require__(44)
	    ;
	
	var Store = __webpack_require__(55)
	    ;
	
	var ROUTES = __webpack_require__(57).flights;
	
	var Search = Store.extend({
	    data: function() {
	        return {
	            domestic: 1,
	            tripType: Search.ONEWAY,
	            cabinType: Search.ECONOMY,
	            flights: [ { from: Search.DEL, to: Search.BOM, depart_at: moment().add(1, 'day'), return_at: null } ],
	
	            passengers: [1, 0, 0],
	
	            loading: false
	        }
	    },
	
	    onconfig: function() {
	        this.observe('domestic', function(domestic) {
	            if (!domestic && Search.MULTICITY == this.get('tripType')) {
	                this.set('tripType', Search.ONEWAY);
	            }
	
	            if (domestic) {
	                this.set('flights', [{ from: Search.DEL, to: Search.BOM, depart_at: moment().add(1, 'day') }]);
	            } else {
	                this.set('flights', [{ from: null, to: null, depart_at: moment().add(1, 'day') }]);
	            }
	
	        }, { init: false });
	
	        this.observe('tripType', function(value, old) {
	            if (Search.MULTICITY == value) {
	                this.splice('flights', 1, 0, { from: null, to: null, depart_at: null });
	            }
	
	            if (Search.MULTICITY == old) {
	                this.set('flights', [this.get('flights.0')]);
	            }
	
	            if (Search.ROUNDTRIP == old)  {
	                this.set('flights.0.return_at', null);
	            }
	
	        }, { init: false });
	    },
	
	    removeFlight: function(i) {
	        this.splice('flights', i, 1);
	    },
	
	    addFlight: function() {
	        this.push('flights', {});
	    },
	
	    toJSON: function() {
	        var form = this;
	
	        return {
	            cs: this.get('cs'),
	            domestic: this.get('domestic'),
	            tripType: this.get('tripType'),
	            cabinType: this.get('cabinType'),
	            passengers: this.get('passengers'),
	
	            flights: _.map(this.get('flights'), function(flight) {
	                return {
	                    from: flight.from,
	                    to: flight.to,
	                    depart_at: moment.isMoment(flight.depart_at) ? flight.depart_at.format('YYYY-MM-DD') : null,
	                    return_at: 2 == form.get('tripType')
	                        ? (moment.isMoment(flight.return_at) ? flight.return_at.format('YYYY-MM-DD') : null)
	                        : null
	                };
	            })
	        };
	    }
	});
	
	Search.MULTICITY = 3;
	Search.ROUNDTRIP = 2;
	Search.ONEWAY = 1;
	
	Search.DEL = 1236;
	Search.BOM = 946;
	
	Search.ECONOMY = 1;
	Search.PERMIUM_ECONOMY = 2;
	Search.BUSINESS = 3;
	Search.FIRST = 4;
	
	Search.MAX_WAIT_TIME = 60000;
	Search.INTERVAL = 5000;
	
	Search.load = function(url, force, cs) {
	    cs = cs || null;
	
	    return Q.Promise(function(resolve, reject) {
	        $.ajax({
	            type: 'GET',
	            url: ROUTES.search,
	            data: { query: url, force: force || 0, cs: cs },
	            dataType: 'json',
	            success: function(data) { resolve(Search.parse(data)); },
	            error: function(xhr) {
	                try {
	                    //alert(xhr.responseText);
	                    reject(JSON.parse(xhr.responseText))
	                } catch (e) {
	                    reject(false);
	                }
	            }
	        });
	    });
	};
	
	Search.parse = function(data) {
	    data.flights = _.map(data.flights, function(i) {
	        i.depart_at = moment(i.depart_at);
	        i.return_at = i.return_at && moment(i.return_at);
	
	        return i;
	    });
	
	    var search = new Search({data: data});
	
	
	    return search;
	};
	
	
	module.exports = Search;

/***/ },
/* 317 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui modify-search small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Modify Search"]}," ",{"t":7,"e":"div","a":{"class":"content","style":"padding: 0px;"},"f":[{"t":4,"f":[{"t":8,"r":"form"}],"n":50,"r":"open"}]}]}],"n":50,"r":"modify"},{"t":4,"n":51,"f":[{"t":8,"r":"form"}],"r":"modify"}," "],"p":{"form":[{"t":7,"e":"form","a":{"id":"flights-search","class":["ui form ",{"t":2,"r":"class"}," ",{"t":4,"f":["loading"],"n":50,"r":"search.pending"}," ",{"t":4,"f":["error"],"n":50,"r":"errors"}],"action":"javascript:;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"h1","f":["Search, Book & Fly!"]}," ",{"t":7,"e":"p","f":["Lowest Prices and 100% secure!"]}," ",{"t":7,"e":"div","a":{"class":"ui top attached tabular menu"},"f":[{"t":7,"e":"a","a":{"class":[{"t":4,"f":["active"],"n":50,"r":"search.domestic"}," item uppercase"],"data-tab":"domestic"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.domestic\",1]"}}},"f":["Domestic"]}," ",{"t":7,"e":"a","a":{"class":[{"t":4,"f":["active"],"n":50,"x":{"r":["search.domestic"],"s":"!_0"}}," item uppercase"],"data-tab":"international"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.domestic\",0]"}}},"f":["International"]}]}," ",{"t":7,"e":"div","a":{"class":"ui bottom attached active tab segment basic"},"f":[{"t":8,"r":"checkboxes"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"multicity"},"t1":"fade","f":[{"t":8,"r":"multicity"}," ",{"t":7,"e":"div","a":{"class":"add-flight"},"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui basic button circular"},"v":{"click":{"m":"addFlight","a":{"r":[],"s":"[]"}}},"f":["+ Add new"]}]}]}," ",{"t":7,"e":"br"}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"simple"},"t1":"fade","f":[{"t":8,"r":"itinerary"}," ",{"t":8,"r":"dates"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"r":"errors.flight.0"}]}],"n":50,"r":"errors.flight.0"}]}],"x":{"r":["search.tripType"],"s":"3==_0"}}," ",{"t":8,"r":"passengers"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[],"n":50,"x":{"r":["i"],"s":"\"flight\"==_0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"x":{"r":["i"],"s":"\"flight\"==_0"}}],"n":52,"i":"i","r":"errors"}]}],"n":50,"r":"errors"}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui button massive fluid uppercase"},"f":["Search Flights"]}]}]}],"dates":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.depart_at"}],"class":"fluid depart-0 pointing top left","large":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"max":[{"t":2,"x":{"r":["search.tripType","search.flights.0.return_at"],"s":"2==_0&&_1"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}],"error":[{"t":2,"r":"errors.flight.0.depart_at"}],"next":"return-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"v":{"click":{"m":"toggleRoundtrip","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.return_at"}],"class":["fluid return-0 pointing top right ",{"t":4,"f":["disabled"],"n":51,"x":{"r":["search.tripType"],"s":"2==_0"}}],"large":"1","placeholder":"RETURN ON","min":[{"t":2,"x":{"r":["search.flights.0.depart_at","moment"],"s":"_0||_1()"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}],"error":[{"t":2,"r":"errors.flight.0.return_at"}]},"f":[]}]}]}],"passengers":[{"t":7,"e":"div","a":{"class":"four fields passengers"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.0"}],"class":"fluid","large":"1","placeholder":"Adults","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.1"}],"class":"fluid","large":"1","placeholder":"Children","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["2-12 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.2"}],"class":"fluid","large":"1","placeholder":"Infants","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["Below 2 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"search.cabinType"}],"class":"fluid","large":"1","placeholder":"Class","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.cabinTypes()"}}],"error":[{"t":2,"r":"errors.cabinType"}]},"f":[]}]}]}],"itinerary":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid from-0","placeholder":"FROM","search":"1","large":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.from"}],"next":"to-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid to-0","placeholder":"TO","search":"1","large":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.to"}],"next":"depart-0"},"v":{"next":"next"},"f":[]}]}]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid from-0","placeholder":"FROM","search":"1","large":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.from"}],"next":"to-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid to-0","placeholder":"TO","search":"1","large":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.to"}],"next":"depart-0"},"v":{"next":"next"},"f":[]}]}]}],"r":"search.domestic"}],"multicity":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"three fields"},"f":[{"t":7,"e":"div","a":{"class":"field airport_field_width"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"./from"}],"class":["fluid from-",{"t":2,"r":"i","s":true}],"search":"1","large":"1","placeholder":"FROM","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.domestic()"},"s":true}],"error":[{"t":2,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"},"from"]}}],"next":["to-",{"t":2,"r":"i","s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field airport_field_width"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"./to"}],"class":["fluid to-",{"t":2,"r":"i","s":true}],"search":"1","large":"1","placeholder":"TO","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.domestic()"},"s":true}],"error":[{"t":2,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"},"to"]}}],"next":["depart-",{"t":2,"r":"i","s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field airport_field_width"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"rx":{"r":"search.flights","m":[{"t":30,"n":"i"},"depart_at"]}}],"class":["fluid depart-",{"t":2,"r":"i"}," pointing top right"],"large":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"calendar":[{"t":2,"x":{"r":[],"s":"{twomonth:true}"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"error":[{"t":2,"rx":{"r":"errors.flights","m":[{"t":30,"n":"i"},"depart_at"]}}],"next":["depart-",{"t":2,"x":{"r":["i"],"s":"_0+1"},"s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"remove_icon"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"delete"},"v":{"click":{"m":"removeFlight","a":{"r":["i"],"s":"[_0]"}}},"f":[" "]}],"n":50,"x":{"r":["i"],"s":"_0>1"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}}]}],"n":50,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}}],"n":52,"i":"i","r":"search.flights"}],"checkboxes":[{"t":7,"e":"div","a":{"class":"three fields travel-type"},"f":[{"t":7,"e":"div","a":{"class":"field width_ways"},"f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"1==_0"}}," width_ways_deco"]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",1]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"1==_0"}}]}}," ",{"t":7,"e":"label","f":["ONE WAY"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"field width_ways"},"f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}}," width_ways_deco"]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",2]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"2==_0"}}]}}," ",{"t":7,"e":"label","f":["ROUND TRIP"]}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field width_ways"},"t1":"fade","f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}}," width_ways_deco"]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",3]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"3==_0"}}]}}," ",{"t":7,"e":"label","f":["MULTI CITY"]}]}]}]}],"n":50,"r":"search.domestic"}]}]}};

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(35),
	    $ = __webpack_require__(33),
	    _ = __webpack_require__(30)
	    ;
	
	var
	    LARGE = 'large',
	    DISABLED = 'disabled',
	    LOADING = 'icon loading',
	    DECORATED = 'decorated',
	    ERROR = 'error',
	    IN = 'in'
	    ;
	
	module.exports = Component.extend({
	    isolated: true,
	    template: __webpack_require__(319),
	
	    data: function() {
	        return {
	            classes: function(state, large) {
	                var data = this.get(),
	                    classes = [];
	
	                if (_.isObject(data.state)) {
	                    if (data.state.disabled || data.state.submitting) classes.push(DISABLED);
	                    if (data.state.loading) classes.push(LOADING);
	                    if (data.state.error) classes.push(ERROR);
	
	                }
	
	                if (data.large) {
	                    classes.push(DECORATED);
	                    classes.push(LARGE);
	
	                    if (data.value || data.focus) {
	                        classes.push(IN);
	                    }
	                }
	
	
	                return classes.join(' ');
	            }
	        };
	    },
	
	    oncomplete: function() {
	        this.observe('value', function() {  if (this.get('error')) this.set('error', false); }, {init: false});
	
	        var view = this;
	        $(this.find('input'))
	            .on('focus.api', function() { view.set('focus', true); })
	            .on('blur.api', function() { view.set('focus', false); });
	    },
	
	    onteardown: function() {
	        $(this.find('input')).off('.api');
	    },
	
	
	    inc: function() {
	        var v = _.parseInt(this.get('value')) + 1;
	
	        if (v <= this.get('max'))
	            this.set('value', v);
	    },
	
	    dec: function() {
	        var v = _.parseInt(this.get('value')) - 1;
	
	        if (v >= this.get('min')) {
	            this.set('value', v);
	        }
	    }
	});

/***/ },
/* 319 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui selection input spinner dropdown in ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":7,"e":"input","a":{"type":"hidden","value":[{"t":2,"r":"value"}]}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"div","a":{"class":"text"},"f":[{"t":2,"r":"value"}]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button inc"},"v":{"click":{"m":"inc","a":{"r":[],"s":"[]"}}},"f":["+"]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button dec"},"v":{"click":{"m":"dec","a":{"r":[],"s":"[]"}}},"f":["-"]}]}]};

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	        $ = __webpack_require__(33)
	        ;
	
	var Select = __webpack_require__(39)
	        ;
	
	module.exports = Select.extend({
	    onconfig: function () {
	        var view = this;
	        var ajax, timeout;
	        if (this.get('domestic')) {
	            console.log("ODEMATEFE: ", this.get('meta.select.domestic'));
	            this.set('options', this.get('meta.select.domestic')());
	        } else {
	            console.log("domestic not");
	            if (this.get('value')) {
	                // console.log("domestic value");
	                $.ajax({
	                    type: 'GET',
	                    url: '/b2c/flights/airport/' + this.get('value'),
	                    dataType: 'json',
	                    success: function (data) {
	                        view.set('options', [data]).then(function () {
	                            $(view.find('.ui.selection')).dropdown('set value', data.id);
	                            $(view.find('.ui.selection')).dropdown('set text', data.text);
	                        });
	
	
	                    }
	                })
	            }
	
	            var ajax = null;
	            this.observe('value', function (value) {
	                // console.log("observe");
	                if (ajax) {
	                    ajax.abort();
	                }
	                if (this.get('value')) {
	                    ajax = $.ajax({
	                        type: 'GET',
	                        url: '/b2c/flights/airport/' + this.get('value'),
	                        dataType: 'json',
	                        success: function (data) {
	                            view.set('options', [data]).then(function () {
	                                $(view.find('.ui.selection')).dropdown('set value', data.id);
	                                $(view.find('.ui.selection')).dropdown('set text', data.text);
	                            });
	
	
	                        }
	                    });
	                }
	            });
	
	            this.observe('searchfor', function (value) {
	                if (value && value.length > 2) {
	                    if (timeout) {
	                        clearTimeout(timeout);
	                    }
	
	                    timeout = setTimeout(function () {
	                        if (ajax) {
	                            ajax.abort();
	                        }
	
	                        ajax = $.ajax({
	                            type: 'GET',
	                            url: '/b2c/booking/searchAirport',
	                            data: {term: value},
	                            dataType: 'json',
	                            success: function (data) {
	                                view.set('options', _.map(data, function (i) {
	                                    return {id: i.id, text: i.label};
	                                }))
	                                        .then(function () {
	                                            $(view.find('.ui.selection')).dropdown('show');
	                                        });
	                            }
	                        });
	                    }, 500);
	
	
	                } else {
	                    if (ajax) {
	                        ajax.abort();
	                    }
	
	                    this.set('options', []);
	                }
	            }, {init: false});
	        }
	
	
	    }
	});

/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var page = __webpack_require__(32);
	
	var Page = __webpack_require__(313),
	    Search = __webpack_require__(56),
	    Flight = __webpack_require__(54),
	    Filter = __webpack_require__(322),
	    Meta = __webpack_require__(68)
	    ;
	
	var ROUTES = __webpack_require__(57).flights;
	
	module.exports = Page.extend({
	    template: __webpack_require__(323),
	
	    components: {
	        'results': __webpack_require__(324),
	
	        'modify-single': __webpack_require__(339),
	        'modify-multicity': __webpack_require__(341),
	
	        'filter': __webpack_require__(343),
	        'search-form': __webpack_require__(315)
	    },
	
	    data: function() {
	        return {
	            minpanel: true,
	
	            force: false,
	
	            pending: 1,
	            search: null,
	            flights: [],
	
	            meta: Meta.object
	        }
	    },
	
	    onconfig: function() {
	        var view = this;
	
	        this.pending = setInterval(function() {
	            if (view.get('pending') >= 100) {
	                view.set('pending', 0);
	            }
	
	            view.set('pending', Math.min(100, view.get('pending') + 0.25));
	        }, 41);
	
	        Search.load(this.get('url'), this.get('force'), this.get('cs'))
	            .then(function(search) { view.set('search', search); view.fetchFlights(search); })
	            .fail(function() { page(ROUTES.search) });
	    },
	
	    oncomplete: function() {
	        $(window).scrollTop(0);
	
	        if (false) {
	            var open = false;
	            $('#m_menu').sidebar({ onHidden: function() { $('#m_btn').removeClass('disabled');  }, onShow: function() { $('#m_btn').addClass('disabled');  }});
	
	            $('#filter', this.el).on('click.layout',function(){
	                if (!$(this).hasClass('disabled')) {
	                    $('#m_menu').sidebar('show');
	                }
	
	            });
	        }
	    },
	
	    fetchFlights: function(search) {
	        var view = this;
	
	        Flight.fetch(search)
	            .progress(function(res) { view.set('flights', res.flights); })
	            .then(function(res) { clearInterval(view.pending); view.finalize(search, res); });
	    },
	
	    finalize: function(search, res) {
	        var view = this,
	            filter = Filter.factory(search, res.flights);
	
	
	        this.set({ pending: false, flights: res.flights, filter: filter });
	
	        if (Search.ROUNDTRIP == search.get('tripType')) {
	            this.set('prices', res.prices);
	        }
	
	        filter.observe('flights', function(flights) { view.set('flights', flights); }, {init: false});
	
	
	        if (!(false) && window.localStorage) {
	            try {
	                var segments = res.flights[0][0].segments,
	                    from = segments[0][0].from,
	                    to = segments[0][segments[0].length-1].to,
	                    clone = search.toJSON();
	
	                //console.log('ffff', segments, from, to);
	
	                if (from && to) {
	                    var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];
	                    recent.unshift({from: from, to: to, search: clone});
	
	                    window.localStorage.setItem('searches', JSON.stringify(recent.slice(0,5)));
	                }
	            } catch (e) {
	                // not a big deal
	            }
	
	        }
	    },
	
	    modifySearch: function() {
	        if (false) {
	            page(ROUTES.search);
	        } else {
	            this.set('modify', null);
	            this.set('modify', Search.parse(this.get('search').toJSON()));
	        }
	
	
	    }
	});

/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30);
	
	var Store = __webpack_require__(55),
	        Search = __webpack_require__(56)
	        ;
	
	var t2m = function (time) {
	    var i = time.split(':');
	    return _.parseInt(i[0]) * 60 + _.parseInt(i[1]);
	};
	
	var filter = function (flights, filtered, backward) {
	    backward = backward || false;
	
	    var f = _.cloneDeep(filtered),
	            layover = f.layover ? [t2m(f.layover[0]), t2m(f.layover[1])] : null,
	            arrive, departure
	            ;
	
	    if (!backward) {
	        arrive = f.arrival ? [t2m(f.arrival[0]), t2m(f.arrival[1])] : null;
	        departure = f.departure ? [t2m(f.departure[0]), t2m(f.departure[1])] : null;
	    } else {
	        arrive = f.arrival2 ? [t2m(f.arrival2[0]), t2m(f.arrival2[1])] : null;
	        departure = f.departure2 ? [t2m(f.departure2[0]), t2m(f.departure2[1])] : null;
	    }
	
	    return _.filter(flights.slice(), function (i) {
	        var ok = true,
	                s = i.get('segments.0');
	
	        if (f.prices && !_.inRange(i.get('price'), f.prices[0] - 0.001, f.prices[1] + 0.001)) {
	            return false;
	        }
	
	        if (f.carriers && -1 == _.indexOf(f.carriers, s[0].carrier.code)) {
	            return false;
	        }
	
	        if (f.stops) {
	            for (var j = 0, l = i.get('segments').length; j < l; j++) {
	                if (-1 == _.indexOf(f.stops, i.get('segments.' + j).length - 1)) {
	                    return false;
	                }
	            }
	        }
	
	        if (departure && !_.inRange(t2m(s[0].depart.format('HH:mm')), departure[0] - 0.001, departure[1] + 0.001)) {
	            return false;
	        }
	
	        if (arrive && !_.inRange(t2m(s[s.length - 1].arrive.format('HH:mm')), arrive[0] - 0.001, arrive[1] + 0.001)) {
	            return false;
	        }
	
	        if (layover) {
	            ok = true;
	            _.each(i.get('segments'), function (segments) {
	                _.each(segments, function (segment) {
	                    if (
	                            segment.layover &&
	                            !_.inRange(segment.layover.asMinutes(), layover[0] - 0.001, layover[1] + 0.001)
	                            ) {
	                        ok = false;
	                    }
	                });
	            });
	
	            return ok;
	        }
	
	        if (f.refundable && 2 != _.parseInt(i.get('refundable'))) {
	            return false;
	        }
	
	        return true;
	    });
	};
	
	var Filter = Store.extend({
	    timeout: null,
	    onconfig: function () {
	        //this.observe('filtered', function(filtered) { this.filter(); }, {init: false});
	    },
	    filter: function (only) {
	        //console.log('filtering nax');
	
	        if (this.timeout) {
	            clearTimeout(this.timeout);
	        }
	
	        setTimeout(function () {
	            this.doFilter();
	        }.bind(this), Filter.TIMEOUT)
	    },
	    doFilter: function () {
	        var filtered = this.get('filtered');
	        //console.log(this.get('onlyMe'));
	        if (Search.ROUNDTRIP == this.get('tripType') && this.get('domestic')) {
	            this.set('flights', [filter(this.get('original.0'), filtered), filter(this.get('original.1'), filtered, true)])
	        } else {
	            this.set('flights', _.map(this.get('original'), function (flights) {
	                return filter(flights, filtered);
	            }));
	        }
	
	
	    }
	});
	
	Filter.TIMEOUT = 300;
	
	Filter.factory = function (search, results) {
	    var filter = new Filter(),
	            prices = [],
	            carriers = [],
	            stops = 0,
	            temp_carrier = [],
	            i = 0;
	    _.each(results, function (flights) {
	        _.each(flights, function (flight) {
	            var _carrier = flight.get('segments.0.0.carrier'),
	                    _price = flight.get('price');
	            prices[prices.length] = _price;
	            if (i == 0 ||
	                    typeof carriers[_carrier.code] == 'undefined' ||
	                    carriers[_carrier.code].code != _carrier.code ||
	                    _price < carriers[_carrier.code].price)
	            {
	                _carrier.price = _price;
	                carriers[_carrier.code] = _carrier;
	            }
	            _.each(flight.get('segments'), function (segments) {
	                stops = Math.max(stops, segments.length - 1);
	            });
	            i++;
	        });
	    });
	    for (var i in carriers) {
	        temp_carrier[temp_carrier.length] = carriers[i];
	    }
	    carriers = temp_carrier;
	
	    filter.set({
	        domestic: search.get('domestic'),
	        tripType: search.get('tripType'),
	        stops: _.range(0, stops + 1),
	        prices: [Math.min.apply(null, prices), Math.max.apply(null, prices)],
	        carriers: carriers,
	        filtered: {carriers: _.map(carriers, function (i) {
	                return i.code;
	            }), stops: _.range(0, stops + 1)},
	        flights: results,
	        original: results
	    });
	    return filter;
	};
	module.exports = Filter;

/***/ },
/* 323 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","f":[{"t":4,"f":[{"t":7,"e":"search-form","a":{"class":"basic segment","search":[{"t":2,"r":"modify"}],"modify":[{"t":2,"r":"modify"}]}}],"n":50,"r":"modify"}," ",{"t":7,"e":"div","a":{"class":"ui segment flights-results"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"loading","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"ui indicating progress active"},"f":[{"t":7,"e":"div","a":{"class":"bar","style":["background-color: #fee252; -webkit-transition-duration: 300ms; transition-duration: 300ms; width: ",{"t":2,"r":"pending"},"%;"]}}," ",{"t":7,"e":"div","a":{"class":"label"},"f":["Searching for flights"]}]}]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}],"n":50,"r":"pending"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"modify-multicity","a":{"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"modify-single","a":{"modify":[{"t":2,"r":"search"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["search.tripType"],"s":"3==_0"}}],"r":"pending"}," ",{"t":4,"f":[{"t":7,"e":"results","a":{"pending":[{"t":2,"r":"pending"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"prices":[{"t":2,"r":"prices"}],"filter":[{"t":2,"r":"filter"}]}}],"n":50,"r":"flights"}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}," ",{"t":7,"e":"filter","a":{"search":[{"t":2,"r":"search"}],"filter":[{"t":2,"r":"filter"}],"pending":[{"t":2,"r":"pending"}]}}]}}]};

/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	    _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(325),
	
	    components: {
	        'results-oneway': __webpack_require__(326),
	        'results-roundtrip': __webpack_require__(333),
	        'results-multicity': __webpack_require__(335)
	    },
	
	    data: function() {
	        return {
	        };
	    },
	
	    oncomplete: function() {
	        var view = this;
	
	        $(window).on('scroll.results', function() {
	            if( ($(window).scrollTop() + $(window).height() >= $(document).height()*0.8  ) ) {
	                _.each(view.findAllComponents('flights'), function(flights) {
	                   flights.nextpage();
	                });
	            }
	        });
	    },
	
	    onteardown: function() {
	        $(window).off('scroll.results');
	    }
	});

/***/ },
/* 325 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"results-oneway","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"1==_0"}},{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"results-roundtrip","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"prices":[{"t":2,"r":"prices"}],"filter":[{"t":2,"r":"filter"}]}}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"results-oneway","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"r":"search.domestic"}],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}},{"t":4,"f":[{"t":7,"e":"results-multicity","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}}]};

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	    _ = __webpack_require__(30),
	    moment = __webpack_require__(44),
	    page = __webpack_require__(32)
	    ;
	
	var Booking = __webpack_require__(51),
	    Meta = __webpack_require__(68)
	    ;
	
	var ROUTES = __webpack_require__(57).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(327),
	
	    components: {
	        flights: __webpack_require__(328)
	    },
	
	    data: function() {
	        var view = this;
	
	        return {
	            meta: Meta.object,
	            active: 0,
	            onSelect: function(flight) {
	
	                Booking.create([flight.get('system')], { cs: view.get('search.cs'),  url: view.get('search.url'),cur:view.get('meta.display_currency') })
	                    .then(function(booking) {
	                        page(ROUTES.booking(booking.get('id')));
	                    });
	            }
	        };
	    },
	
	    oncomplete: function() {
	        $('.dropdown', this.el).dropdown();
	    },
	
	    modifySearch: function() {
	        this.root.modifySearch();
	    }
	});

/***/ },
/* 327 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.0"}],"search":[{"t":2,"r":"search"}],"pending":[{"t":2,"r":"pending"}]}}]};

/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	        moment = __webpack_require__(44),
	        page = __webpack_require__(32)
	        ;
	
	var Form = __webpack_require__(34),
	        Meta = __webpack_require__(68),
	        ROUTES = __webpack_require__(57)
	        ;
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return _.parseInt(i[0]) * 60 + _.parseInt(i[1]);
	};
	
	var sort = function (flights, sortOn) {
	    var on = sortOn[0],
	            asc = sortOn[1],
	            data = flights.slice(),
	            time = _.now();
	
	    data = _.sortBy(
	            data,
	            function (i) {
	                var value = i.get('price'),
	                        s = i.get('segments.0');
	
	                if ('airline' == on) {
	                    value = _.trim(s[0].carrier.name).toLowerCase();
	                }
	
	                if ('depart' == on) {
	                    value = s[0].depart.unix();
	                }
	
	                if ('arrive' == on) {
	                    value = s[s.length - 1].arrive.unix();
	                }
	
	                return value;
	            }
	    );
	
	    if (-1 == asc) {
	        data.reverse();
	    }
	
	
	    return data;
	};
	
	var group = function (flights, sorton) {
	    if (false) {
	        return flights;
	    }
	
	    return _.values(_.groupBy(flights, function (i) {
	        return 'nax_' + i.get(sorton[0]) + '_' + i.get('price');
	    }));
	};
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(329),
	    page: 1,
	    loading: false,
	    components: {
	        flight: __webpack_require__(330)
	    },
	    data: function () {
	        var first = true;
	
	        return {
	            direction: 1,
	            flights: [],
	            rendered: [],
	            sorted: [],
	            open: {},
	            sortOn: ['price', 1],
	            meta: Meta.object
	        }
	    },
	    onconfig: function () {
	        var view = this;
	
	        this.observe('sortOn', function (sortOn) {
	            view.sortFlights();
	        }, {init: false});
	        this.observe('flights', function (sortOn) {
	            view.sortFlights();
	        }, {init: false});
	        this.sortFlights();
	    },
	    oncomplete: function () {
	        this.parent.on('nextpage', function () {
	            this.nextpage();
	        });
	    },
	    nextpage: function () {
	        var view = this;
	
	        if (!view.loading) {
	            view.loading = true;
	
	            var add = view.get('sorted').slice(view.page * 10, (view.page + 1) * 10);
	            if (add && add.length) {
	                add.unshift('rendered');
	
	                view.push.apply(view, add).then(function () {
	                    view.page++;
	                    view.loading = false;
	                });
	
	            } else {
	                view.loading = false;
	            }
	        }
	    },
	    sortOn: function (on) {
	        if (on == this.get('sortOn.0')) {
	            this.set('sortOn.1', -1 * this.get('sortOn.1'));
	        } else {
	            this.set('sortOn', [on, 1]);
	        }
	    },
	    sortFlights: function () {
	        if (this.pending)
	            return;
	
	        this.pending = true;
	
	        var view = this;
	        this.set('rendered', null);
	
	
	        if (view.get('search.domestic')) {
	            var flights = sort(view.get('flights'), view.get('sortOn'));
	        } else {
	            var flights = group(sort(view.get('flights'), view.get('sortOn')), view.get('sortOn'));
	        }
	
	
	        view.set('sorted', flights);
	
	        view.set('rendered', flights.slice(0, 10));
	        view.page = 1;
	        this.pending = false;
	        /*
	         * Refer : site/themes/B2C/dev/js/components/flights/search/results/roundtrip.js->onconfig()
	         */
	        if (Meta.object.AllCarrierRefresh) {
	            Meta.object.AllCarrierRefresh();
	        }
	    },
	    back: function () {
	        page("/");
	    }
	
	});

/***/ },
/* 329 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"table","a":{"class":["ui segment basic flights ",{"t":2,"r":"class"}," ",{"t":4,"f":["summary"],"n":50,"r":"summary"}," ",{"t":4,"f":["small"],"n":50,"r":"small"}],"style":"width: 100%;"},"f":[{"t":4,"f":[{"t":7,"e":"caption","f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"pull left"},"f":[{"t":2,"r":"itinerary"}]}," ",{"t":7,"e":"div","a":{"class":"pull right"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"ddd D, MMM\")"}}]}],"r":"flights.0"}]}],"n":50,"r":"caption","s":true}," ",{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"airline"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"airline\"]"}}},"f":["Airline ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"airline\"==_0"}}]}," ",{"t":7,"e":"td","a":{"class":"depart"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"depart\"]"}}},"f":["Depart ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"depart\"==_0"}}]}," ",{"t":7,"e":"td","a":{"class":"arrow"}}," ",{"t":7,"e":"td","a":{"class":"arrive"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"arrive\"]"}}},"f":["Arrive ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"arrive\"==_0"}}]}," ",{"t":7,"e":"td","a":{"class":"price"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"price\"]"}}},"f":["Price ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"price\"==_0"}}]}]}]}," ",{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5","style":"text-align: center;"},"f":["Sorry! We could not find any flight for this search. Please search Again.",{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"a","v":{"click":{"m":"back","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button middle gray back"},"f":["Back"]}]}]}],"n":51,"x":{"r":["pending","flights.length"],"s":"_0||_1"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":8,"r":"flight"}],"n":52,"r":"."}],"n":50,"rx":{"r":"open","m":[{"t":30,"n":"i"}]}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":8,"r":"flight"}],"r":"./0"}],"rx":{"r":"open","m":[{"t":30,"n":"i"}]}}," ",{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"buddies"},"f":[{"t":7,"e":"td","a":{"colspan":"5","style":"text-align: center; padding: 4px; border: none;"},"f":[{"t":7,"e":"a","a":{"class":"ui basic tiny circular button","href":"javascript:;"},"v":{"click":{"m":"toggle","a":{"r":["i"],"s":"[\"open.\"+_0,1]"}}},"f":[{"t":4,"f":["–"],"n":50,"rx":{"r":"open","m":[{"t":30,"n":"i"}]}},{"t":4,"n":51,"f":["+"],"rx":{"r":"open","m":[{"t":30,"n":"i"}]}}," ",{"t":2,"x":{"r":["./length"],"s":"_0-1"}}," more options at same price"]}]}]}," ",{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[]}]}],"n":50,"x":{"r":["./length"],"s":"_0>1"}}],"n":50,"r":"./length"},{"t":4,"n":51,"f":[{"t":8,"r":"flight"}],"r":"./length"}],"n":52,"i":"i","r":"rendered"}]}," "],"p":{"flight":[{"t":7,"e":"flight","a":{"selectFn":[{"t":2,"r":"selectFn"}],"small":[{"t":2,"r":"small"}],"summary":[{"t":2,"r":"summary"}],"flight":[{"t":2,"r":"."}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected"}],"onward":[{"t":2,"r":"onward"}],"backward":[{"t":2,"r":"backward"}]}}]}};

/***/ },
/* 330 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	var Form = __webpack_require__(34),
	    Booking = __webpack_require__(51),
	    Meta = __webpack_require__(68)
	    ;
	
	
	var money = __webpack_require__(69),
	    duration = __webpack_require__(81)(),
	    discount = __webpack_require__(331).discount;
	
	
	var data = {
	    hasGroupings: function() {
	        if (this.get('flight.groupings')) {
	            return this.get('flight.groupings').length || _.keys(this.get('flight.groupings')).length;
	        }
	
	        return false;
	    },
	
	    discount: discount,
	
	    $: money,
	    duration: duration
	};
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(332),
	
	    components: {
	        flight: this,
	        itinerary: __webpack_require__(83)
	    },
	
	    data: function() {
	        return data;
	    },
	
	    onconfig: function() {
	        this.set('meta', Meta.object);
	    },
	
	    oncomplete: function() {
	        $(this.find('.price > .amount'))
	            .popup({
	                position : 'bottom right',
	                popup: $(this.find('.fare.popup')),
	                on: 'hover'
	            });
	        $(this.find('.airport_change_mouse'))
	            .popup({
	                position : 'top left',
	                popup: $(this.find('.airport_change.popup')),
	                on: 'hover'
	            });
	        $(this.find('.transit_visa_mouse'))
	            .popup({
	                position : 'top left',
	                popup: $(this.find('.transit_visa.popup')),
	                on: 'hover'
	            });
	        $(this.find('.short_layover_mouse'))
	            .popup({
	                position : 'top left',
	                popup: $(this.find('.short_layover.popup')),
	                on: 'hover'
	            });
	        $(this.find('.long_layover_mouse'))
	            .popup({
	                position : 'top left',
	                popup: $(this.find('.long_layover.popup')),
	                on: 'hover'
	            });
	//        $(this.find('.long_change_mouse_1'))
	//            .popup({
	//                position : 'top left',
	//                popup: $(this.find('.long_layover.popup')),
	//                on: 'hover'
	//            });   
	    },
	
	    toggleDetails: function() {
	        this.toggle('details');
	    },
		toggleMobile: function() {
			this.toggle('toggle_flight_details');
		},
	    toggleBaggage: function() {
	        
	      this.toggle('baggage_info');  
	    },
	    toggleBaggageInfo: function() {
	        
	      this.toggle('toggle_baggage_info');  
	    },
	    select: function() {
	        if (this.get('flight.id') === this.get('selected.id')) {
	            this.set('selected', null);
	            return;
	        }
	
	        var fn = this.get('selectFn');        
	        if (_.isFunction(fn)) {
	            
	            fn(this.get('flight'), this);
	        }
	    },
	
	    click: function() {
	        if (this.get('summary')) {
	            this.select();
	        }
	    }
	
	
	});

/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30)
	    ;
	
	var money = __webpack_require__(69);
	
	module.exports = {
	    duration: __webpack_require__(81)(),
	    money: money,
	
	    itinerary: function(flight) {
	        var s = flight.get('segments.0');
	
	        return [s[0].from.airportCode, s[s.length-1].to.airportCode].join('&mdash;');
	    },
	
	    times: function(flights) {
	        return [flights[0].depart_at.format('D MMM, YYYY'), flights[flights.length-1].depart_at.format('D MMM, YYYY')].join('-');
	    },
	
	    canbook: function(a, b) {
	        var ok = true;
	        for (var i = 0; i < b.length; i++) {
	            if (!a[i])
	                ok = false;
	        }
	
	
	        return ok;
	    },
	
	    price: function(selected) {
	        var price = 0;
	
	        _.each(selected, function(i) { if (i) price += i.get('price'); });
	
	        return price;
	    },
	
	    discount: function(selected) {
	        if (2 == selected.length && selected[0] && selected[1]) {
	            var onward = selected[0].get(),
	                backward = selected[1].get(),
	                groupings = _.intersection(
	                    onward.system.gds ? onward.groupings : _.keys(onward.groupings),
	                    _.keys(backward.groupings)
	                ),
	                discount
	                ;
	
	            if (groupings.length) {
	                if (onward.system.gds) {
	                    discount = backward.groupings[groupings[0]].discount;
	                } else {
	                    discount = onward.price + backward.price
	                        - onward.groupings[groupings[0]].price - backward.groupings[groupings[0]].price
	                }
	                if(discount <= 100) {
	                    discount = 0;
	                } 
	                return discount;
	            }
	        }
	
	
	
	    }
	};


/***/ },
/* 332 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"tbody","v":{"load":{"m":"sortOn","a":{"r":[],"s":"[\"flight.time\"]"}},"click":{"m":"click","a":{"r":[],"s":"[]"}}},"a":{"class":["flight ",{"t":4,"f":["has-grouping"],"n":50,"x":{"r":["hasGroupings"],"s":"_0()"},"s":true}," ",{"t":4,"f":["small"],"n":50,"r":"small","s":true}," ",{"t":4,"f":["summary clickable"],"n":50,"r":"summary","s":true}," ",{"t":4,"f":["details"],"n":50,"r":"details"}," ",{"t":4,"f":["selected"],"n":50,"x":{"r":["id","selected.id"],"s":"_0==_1"}}]},"f":[{"t":8,"r":"main"}," ",{"t":8,"r":"info"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"details"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[{"t":7,"e":"div","a":{"class":"compact dark"},"f":[{"t":7,"e":"div","a":{"class":"ui segment","style":"background: #f1f1f1;"},"f":[{"t":7,"e":"ul","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"li","f":["For Hand Baggage Only Fare no free check-in baggage allowance shall be permissible.Passengers who purchase this fare but have check-in baggage will be charged Fare Type Change Fee of Rs. 400."]}," ",{"t":7,"e":"li","f":["Passengers are allowed to check-in seven (07) kg. of check-in baggage, free of cost; beyond which such weight, the above mentioned Fare Type Change Fee of INR 400/- (Rupees four hundred only) shall be chargeable to the passenger."]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).carrier.code==\"SG\""}}," ",{"t":4,"f":[{"t":7,"e":"li","f":["Traveling passenger may carry maximum 7 Kgs per person per flight"]}," ",{"t":7,"e":"li","f":["Checked-in baggage is chargeable"]}," ",{"t":7,"e":"li","f":["Customer carrying more than the allowed baggage limits will be charged a flat rate of INR 300 per kg as excess baggage fee for domestic travel and INR 525 (or it will be charged as per base currency of reservation) for International travel at the time of check-in."]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).carrier.code==\"6E\""}}],"n":52,"r":"flight.segments"}]}]}]}]}]}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).product_class==\"LITE\""}},{"t":4,"n":51,"f":[{"t":7,"e":"tr","a":{"class":"details"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[{"t":7,"e":"div","a":{"class":"compact dark"},"f":[{"t":7,"e":"div","a":{"class":"ui segment","style":"background: #f1f1f1;"},"f":[{"t":7,"e":"ul","f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"li","f":["For travel to and from Dubai and Muscat - checked Baggage allowance is up to 30 Kgs."]}],"n":50,"x":{"r":["first","last","."],"s":"_0(_2).from.airportCode==\"DXB\"||_0(_2).from.airportCode==\"MCT\"||_1(_2).to.airportCode==\"DXB\"||_1(_2).to.airportCode==\"MCT\""}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"li","f":["Free Checked Baggage Allowance ",{"t":4,"f":["15 Kgs (Domestic)."],"n":50,"x":{"r":["search.domestic"],"s":"_0==1"}},{"t":4,"n":51,"f":["20 Kgs (International expect Dubai and Muscat)."],"x":{"r":["search.domestic"],"s":"_0==1"}}]}],"n":51,"r":"summary","s":true}],"x":{"r":["first","last","."],"s":"_0(_2).from.airportCode==\"DXB\"||_0(_2).from.airportCode==\"MCT\"||_1(_2).to.airportCode==\"DXB\"||_1(_2).to.airportCode==\"MCT\""}}],"n":50,"x":{"r":["first","."],"s":"_0(_1).carrier.code==\"6E\""}}," ",{"t":4,"f":[{"t":7,"e":"li","f":["Free checked baggage allowance of 15 kgs per passenger."]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).carrier.code==\"SG\""}}],"n":52,"r":"flight.segments"}," ",{"t":7,"e":"li","f":["7 Kgs Hand Baggage (One Piece Only)."]}," ",{"t":7,"e":"li","f":["Additional Baggage will be chargeable."]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"li","f":["Passenger(s) carrying more than the baggage limits will be charged a flat rate of INR 300 per kg as excess baggage fee for domestic travel and INR 525 (or it will be charged as per base currency of reservation) for International travel at the time of check-in."]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).carrier.code==\"6E\""}}," ",{"t":4,"f":[{"t":7,"e":"li","f":["Passenger(s) carrying more than the baggage allowance i.e 15 kgs. will be charged at rate of INR 100 per kg (inclusive of service tax and cess, if applicable) for first 5 kgs. and INR 300/kg for baggage over and above 5 kgs. for domestic travel only"]}],"n":50,"x":{"r":["first","."],"s":"_0(_1).carrier.code==\"SG\""}}],"n":52,"r":"flight.segments"}]}]}]}]}]}],"x":{"r":["first","segments.0"],"s":"_0(_1).product_class==\"LITE\""}}],"n":50,"r":"baggage_info"}," ",{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"details"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[{"t":7,"e":"itinerary","a":{"small":[{"t":2,"r":"small"}],"class":"compact dark","flight":[{"t":2,"r":"flight"}]}}]}]}],"n":50,"r":"details"}]}," ",{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[]}]}],"r":"flight"}," "],"p":{"main":[{"t":7,"e":"tr","a":{"class":"main"},"f":[{"t":7,"e":"td","a":{"class":"airline"},"f":[{"t":7,"e":"div","a":{"class":"logos"},"f":[{"t":4,"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"r":"logo"}],"alt":[{"t":2,"r":"name"}],"title":[{"t":2,"r":"name"}]}}],"n":52,"r":"carriers"}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"multiple"},"f":["Multiple Carriers"]}],"n":50,"r":"carriers.1"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"r":"carriers.0.name"},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"flight-no"},"f":[{"t":4,"f":[{"t":4,"f":[", "],"n":50,"x":{"r":["i"],"s":"0!=_0"}},{"t":2,"r":".flight"}],"n":52,"i":"i","r":"segments.0"}]}]}],"r":"carriers.1"}],"n":51,"r":"summary","s":true}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"colspan":"3","style":"padding-top: 0; padding-bottom: 0;"},"f":[{"t":7,"e":"table","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"depart"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"HH:mm D MMM\")"}}," ",{"t":7,"e":"span","a":{"class":"airport","title":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.airport"}},", ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.city"}}]},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.airportCode"}}]}]}," ",{"t":7,"e":"td","a":{"class":"arrow"},"f":[{"t":7,"e":"div","a":{"class":"via"},"f":[{"t":4,"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).allViaAirports"}}],"n":50,"x":{"r":["first","."],"s":"_0(_1).allViaAirports"}}]}," ",{"t":4,"f":[{"t":4,"f":[],"x":{"r":["via","."],"s":"{airports:_0(_1)}"}}],"n":51,"r":"summary","s":true}," "]}," ",{"t":7,"e":"td","a":{"class":"arrive"},"f":[{"t":2,"x":{"r":["last","."],"s":"_0(_1).arrive.format(\"HH:mm D MMM\")"}}," ",{"t":7,"e":"span","a":{"class":"airport","title":[{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.airport"}},", ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.city"}}]},"f":[{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.airportCode"}}]}]}]}],"n":52,"r":"flight.segments"}]}]}],"n":50,"x":{"r":["flight.segments.length"],"s":"_0>1"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","a":{"class":"depart"},"f":[{"t":7,"e":"div","a":{"class":"time"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).depart.format(\"HH:mm\")"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"airport","title":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).from.airport"}},", ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).from.city"}}]},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).from.airportCode"}}]}," ",{"t":7,"e":"div","a":{"class":"date"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).depart.format(\"D MMM\")"}}]}],"n":51,"r":"summary","s":true}]}," ",{"t":7,"e":"td","a":{"class":"arrow"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"via"},"f":[" ",{"t":4,"f":[{"t":4,"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).allViaAirports"}}],"n":50,"x":{"r":["first","."],"s":"_0(_1).allViaAirports"}}],"n":52,"r":"flight.segments"}]}],"x":{"r":["via","segments.0"],"s":"{airports:_0&&_0(_1)}"}}],"n":51,"r":"summary","s":true}," "]}," ",{"t":7,"e":"td","a":{"class":"arrive"},"f":[{"t":7,"e":"div","a":{"class":"time"},"f":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).arrive.format(\"HH:mm\")"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"airport","title":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).to.airport"}},", ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).to.city"}}]},"f":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).to.airportCode"}}]}," ",{"t":7,"e":"div","a":{"class":"date"},"f":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).arrive.format(\"D MMM\")"}}]}],"n":51,"r":"summary","s":true}]}],"x":{"r":["flight.segments.length"],"s":"_0>1"}}," ",{"t":7,"e":"td","a":{"class":"price"},"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"n":50,"x":{"r":["save"],"s":"_0>100"}}," ",{"t":3,"x":{"r":["$","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"r":"save"},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"r":"save"}],"x":{"r":["discount","onward","flight"],"s":"{save:_0([_1,_2])}"}}],"n":50,"r":"onward"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"n":50,"x":{"r":["save"],"s":"_0>100"}}," ",{"t":3,"x":{"r":["$","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"r":"save"},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"r":"save"}],"x":{"r":["discount","flight","backward"],"s":"{save:_0([_1,_2])}"}}],"n":50,"x":{"r":["backward","selected"],"s":"_0&&!_1"}},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"x":{"r":["backward","selected"],"s":"_0&&!_1"}}],"r":"onward"}]},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"button","a":{"class":"ui button large orange"},"v":{"click":{"m":"select","a":{"r":[],"s":"[]"}}},"f":["BOOK"]}],"n":50,"x":{"r":["search.tripType","search.domestic"],"s":"1==_0||!_1"}},{"t":4,"n":51,"f":[{"t":7,"e":"button","a":{"class":["ui button ",{"t":4,"f":["large"],"n":51,"r":"small","s":true}," blue select_flight"]},"v":{"click":{"m":"select","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":["DESELECT"],"n":50,"x":{"r":["id","selected.id"],"s":"_0==_1"}},{"t":4,"n":51,"f":["SELECT"],"x":{"r":["id","selected.id"],"s":"_0==_1"}}]}],"x":{"r":["search.tripType","search.domestic"],"s":"1==_0||!_1"}}],"n":51,"r":"summary","s":true}," ",{"t":7,"e":"div","a":{"class":"ui fare fluid popup","style":"text-align: left;max-width: 500px;"},"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":[{"t":2,"r":"paxTaxes.1.c"},"x adults: "]},{"t":3,"x":{"r":["$","paxTaxes.1.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["YQ:"]},{"t":3,"x":{"r":["$","paxTaxes.1.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["JN:"]},{"t":3,"x":{"r":["$","paxTaxes.1.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["OTHER:"]},{"t":3,"x":{"r":["$","paxTaxes.1.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["TOTAL:"]},{"t":3,"x":{"r":["$","paxTaxes.1.total","meta.display_currency"],"s":"_0(_1,_2)"}},{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.1"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":[{"t":2,"r":"paxTaxes.2.c"},"x children: "]},{"t":3,"x":{"r":["$","paxTaxes.2.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["YQ:"]},{"t":3,"x":{"r":["$","paxTaxes.2.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["JN:"]},{"t":3,"x":{"r":["$","paxTaxes.2.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["OTHER:"]},{"t":3,"x":{"r":["$","paxTaxes.2.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["TOTAL:"]},{"t":3,"x":{"r":["$","paxTaxes.2.total","meta.display_currency"],"s":"_0(_1,_2)"}},{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.2"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":[{"t":2,"r":"paxTaxes.3.c"},"x infants: "]},{"t":3,"x":{"r":["$","paxTaxes.3.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["YQ:"]},{"t":3,"x":{"r":["$","paxTaxes.3.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["JN:"]},{"t":3,"x":{"r":["$","paxTaxes.3.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["OTHER:"]},{"t":3,"x":{"r":["$","paxTaxes.3.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"span","a":{"class":"tot_text_search"},"f":["TOTAL:"]},{"t":3,"x":{"r":["$","paxTaxes.3.total","meta.display_currency"],"s":"_0(_1,_2)"}},{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.3"}]}]}]}],"info":[{"t":7,"e":"tr","a":{"class":"info"},"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[{"t":2,"r":"carriers.0.name"},", ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).flight"}}," | ",{"t":2,"x":{"r":["duration.format","duration","flight.time"],"s":"_0&&_1.format(_2)"}}," | ",{"t":4,"f":["non-stop"],"n":50,"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}},{"t":4,"n":51,"f":[{"t":2,"x":{"r":["stops","flight.segments.0"],"s":"_0&&_0(_1)"}}," stop(s)"],"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}}," | ",{"t":2,"x":{"r":["flight.refundable"],"s":"[null,\"Non refundable\",\"Refundable\"][_0]"}}]}],"n":50,"r":"summary","s":true},{"t":4,"n":51,"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[{"t":7,"e":"div","a":{"class":"ui divided relaxed horizontal list"},"f":[{"t":7,"e":"div","a":{"class":"item remove_item_padding"},"f":[{"t":7,"e":"div","a":{"class":"content time"},"f":[{"t":2,"x":{"r":["duration.format","duration","flight.time"],"s":"_0&&_1.format(_2)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"item stops remove_item_padding"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":4,"f":["NON-STOP"],"n":50,"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}},{"t":4,"n":51,"f":[{"t":2,"x":{"r":["stops","flight.segments.0"],"s":"_0&&_0(_1)"}}," stop(s)"],"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"techstop","title":"Technical Stop"},"f":["+ Technical Stop(s)"]}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).techStop!=null"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item stops remove_item_padding","id":"box_height"},"f":[{"t":7,"e":"div","a":{"class":"content airport_change_mouse airport_change_css"},"f":[" "]}]}],"n":50,"x":{"r":["segments.0","first","segments.1"],"s":"_1(_0).airport_change||_1(_2).airport_change"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item stops remove_item_padding","id":"box_height"},"f":[{"t":7,"e":"div","a":{"class":"content transit_visa_mouse transit_warning_css"},"f":[" "]}]}],"n":50,"x":{"r":["segments.0","first","segments.1"],"s":"_1(_0).transitvisa_msg||_1(_2).transitvisa_msg"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item stops remove_item_padding","id":"box_height"},"f":[{"t":7,"e":"div","a":{"class":"content short_layover_mouse short_change_css"},"f":[" "]}]}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).show_layover[0]==\"SL\"||_0(_1).show_layover[1]==\"SL\""}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item stops remove_item_padding","id":"box_height"},"f":[{"t":7,"e":"div","a":{"class":"content long_layover_mouse long_change_css"},"f":[" "]}]}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).show_layover[0]==\"LL\"||_0(_1).show_layover[1]==\"LL\""}}," ",{"t":7,"e":"div","a":{"class":"ui airport_change fluid popup","id":"small_popup"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).airport_change"}}],"n":50,"x":{"r":["first","."],"s":"_0(_1).airport_change"}}],"n":52,"r":"flight.segments"}]}," ",{"t":7,"e":"div","a":{"class":"ui transit_visa fluid popup","id":"long_popup"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).transitvisa_msg"}}],"n":50,"x":{"r":["first","."],"s":"_0(_1).transitvisa_msg"}}],"n":52,"r":"flight.segments"}]}," ",{"t":7,"e":"div","a":{"class":"ui short_layover fluid popup","id":"small_popup"},"f":[{"t":4,"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).num_layover[\"short\"]"}}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).num_layover[\"short\"]"}}," Short Layover"]}," ",{"t":7,"e":"div","a":{"class":"ui long_layover fluid popup","id":"small_popup"},"f":[{"t":4,"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).num_layover[\"long\"]"}}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).num_layover[\"long\"]"}}," Long Layover"]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item stops remove_item_padding","id":"box_height"},"f":[{"t":7,"e":"div","a":{"class":"item baggage_not_allowed_image"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"hand_baggage_styling"},"f":["Hand baggage only"]}]}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).product_class===\"LITE\""}},{"t":4,"n":51,"f":[],"x":{"r":["first","segments.0"],"s":"_0(_1).product_class===\"LITE\""}}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).product_class!=null"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item baggage_info_style remove_item_padding"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"toggleBaggage","a":{"r":[],"s":"[]"}}},"f":["Baggage Information"]}]}],"n":50,"x":{"r":["first","segments.0"],"s":"_0(_1).product_class!=null"}}," ",{"t":7,"e":"div","a":{"class":"item flight_detail_link remove_item_padding"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"toggleDetails","a":{"r":[],"s":"[]"}}},"f":["Flight Details"]}]}]}]}," "],"r":"summary"}]}]}};

/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	        $ = __webpack_require__(33),
	        page = __webpack_require__(32)
	        ;
	
	var Form = __webpack_require__(34),
	        Booking = __webpack_require__(51),
	        Meta = __webpack_require__(68)
	        ;
	
	var ROUTES = __webpack_require__(57).flights;
	
	
	var money = __webpack_require__(69);
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(334),
	    components: {
	        flights: __webpack_require__(328),
	        flight: __webpack_require__(330)
	    },
	    data: function () {
	        return _.extend({
	            meta: Meta.object,
	            carrier: -1,
	            selected: [],
	            count: function (flights) {
	                return _.sum(_.map(flights, function (i) {
	                    return i.length;
	                }));
	            },
	            carriers: function (carriers, prices) {
	                return _.map(_.cloneDeep(carriers), function (i) {
	                    i.price = prices[i.code] || null;
	                    return i;
	                }).sort(function (a, b) {
	                    var ap = a.price || 999999999, bp = b.price || 999999999;
	
	                    if (ap == bp)
	                        return 0;
	                    return ap > bp ? 1 : -1;
	                })
	            },
	            onSelect: function (flight, view) {
	                view.set('selected', flight);
	
	                if (false) {
	                    this.book();
	                }
	            }.bind(this)
	        }, __webpack_require__(331));
	    },
	    onconfig: function () {
	        var view = this;
	        /**
	         * Added By Satender
	         * Purpose : To refresh roundtrip Group Carrier Issue
	         * Used File : site/themes/B2C/dev/js/components/flights/search/results/flights.js - LN 153
	         */
	        Meta.object.set('AllCarrierRefresh', function () {
	            var carriers = [];
	
	            _.each(view.get('flights'), function (flights) {
	                _.each(flights, function (flight) {
	                    carriers[carriers.length] = flight.get('segments.0.0.carrier');
	                });
	            });
	            view.set('allcarriers', _.unique(carriers, 'code'));
	            var width_div = parseInt(0),
			            relative_width = parseInt($('.flights-results form').width()),
			            final_width;
			    $.each($('.makeScrollable').children(), function () {
			        width_div = width_div + $('.makeScrollable').children().width();
			    });
			    width_div = parseInt(width_div);
			    /* convert width into % */
			    final_width = (((100 * width_div) / relative_width) * 2) + "%";
			    $('.makeScrollable').width(final_width);
	        });
	    },
	    oncomplete: function () {
	        $(window).on('resize.roundtrip', function () {
	            var width = $('.flights-grid', this.el).width();
	
	            $('.flights-grid > tbody > tr > td', this.el).width(width / 2);
	        }.bind(this));
	
	        $('.dropdown', this.el).dropdown();
	    },
	    book: function () {
	        var view = this,
	                selected = this.get('selected');
	
	        if (2 == selected.length && selected[0] && selected[1]) {
	            var onward = selected[0].get(),
	                    backward = selected[1].get(),
	                    groupings = _.intersection(
	                            onward.system.gds ? onward.groupings : _.keys(onward.groupings),
	                            _.keys(backward.groupings)
	                            ),
	                    discount
	                    ;
	
	            if (groupings.length) {
	                if (onward.system.gds) {
	                    Booking.create([backward.groupings[groupings[0]].system], {cs: view.get('search.cs'), url: view.get('search.url'), cur: view.get('meta.display_currency')})
	                            .then(function (booking) {
	                                page(ROUTES.booking(booking.get('id')));
	                            });
	
	                    return;
	                } else {
	                    var booking = onward.groupings[groupings[0]].system;
	
	                    booking.rcs.push(backward.groupings[groupings[0]].system.rcs[0]);
	
	                    Booking.create([booking], {cs: view.get('search.cs'), url: view.get('search.url'), cur: view.get('meta.display_currency')})
	                            .then(function (booking) {
	                                page(ROUTES.booking(booking.get('id')));
	                            });
	                    return;
	                }
	
	            }
	            Booking.create(_.map(this.get('selected'), function (i) {
	                return i.get('system');
	            }), {cs: view.get('search.cs'), url: view.get('search.url'), cur: view.get('meta.display_currency')})
	                    .then(function (booking) {
	                        page(ROUTES.booking(booking.get('id')));
	                    });
	        }
	    },
	    showCarrier: function (code) {
	        this.set('carrier', code);
	        this.get('filter').set('filtered.carriers', -1 == code ? false : [code]);
	
	    },
	    modifySearch: function () {
	        this.root.modifySearch();
	    }
	});

/***/ },
/* 334 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment equal height grid flights-selection modify_search_show"},"f":[{"t":7,"e":"div","a":{"class":"one wide column"},"f":[]}," ",{"t":7,"e":"div","a":{"class":"ten wide column"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed horizontal list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":4,"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.logo"}}]}}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header black_font","style":"color:#000!important;"},"f":[{"t":2,"r":"itinerary"},{"t":4,"f":["(",{"t":2,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}}," stop(s))"],"n":50,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}},{"t":4,"n":51,"f":["(non-stop)"],"x":{"r":["stops","segments.0"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":"airlinesName black_font"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.name"}}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).flight"}}," | ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"HH:mm\")"}}," - ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).arrive.format(\"HH:mm\")"}}," | ",{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"D MMM, YYYY\")"}}]}]}],"n":50,"r":"segments"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"style":"text-align: center;","class":"black_font"},"f":["PLEASE SELECT YOUR FLIGHT"]}],"r":"segments"}]}],"n":52,"i":"i","r":"selected"}]}]}," ",{"t":7,"e":"div","a":{"class":"two wide column center aligned book"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"price price_booking"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["money","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"n":50,"x":{"r":["save"],"s":"_0>10"}}," ",{"t":3,"x":{"r":["money","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"x":{"r":["save"],"s":"_0>0"}},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["money","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"x":{"r":["save"],"s":"_0>0"}}],"x":{"r":["discount","price","selected"],"s":"{save:_0(_2),price:_1(_2)}"}}],"n":50,"r":"selected"}]}],"n":50,"x":{"r":["canbook","selected","flights"],"s":"_0(_1,_2)"}}]}," ",{"t":7,"e":"div","a":{"class":"two wide column center aligned book"},"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui button large orange resize_book_bottun"},"m":[{"t":4,"f":["disabled style=\"background:#2a2a2a!important;color:#fff!important\""],"n":51,"x":{"r":["canbook","selected","flights"],"s":"_0(_1,_2)"}}],"v":{"click":{"m":"book","a":{"r":[],"s":"[]"}}},"f":["BOOK"]}]}]}],"n":50,"r":"selected"},{"t":4,"f":[{"t":7,"e":"div","a":{"class":"scrollable"},"f":[{"t":7,"e":"div","a":{"class":"ui divided relaxed horizontal list flights-tabs makeScrollable"},"f":[{"t":7,"e":"div","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["carrier"],"s":"_0==-1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"showCarrier","a":{"r":[],"s":"[-1]"}}},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/icons/aeroplan2.png","align":"absmiddle","width":"23","height":"23"}}," All Airlines"]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["carrier","code"],"s":"_0==_1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"showCarrier","a":{"r":["code"],"s":"[_0]"}}},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"logo"}],"class":"ui top aligned image"}}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","f":[{"t":2,"r":"name"}]}," ",{"t":4,"f":[{"t":3,"x":{"r":["money","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"n":50,"r":"price"},{"t":4,"n":51,"f":[" "],"r":"price"}]}]}],"n":52,"x":{"r":["carriers","allcarriers","prices"],"s":"_0(_1,_2)"}}]}]}," ",{"t":7,"e":"table","a":{"class":"flights-grid small"},"f":[{"t":7,"e":"tbody","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"width: 50%;"},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"onSelect"}],"small":"1","flights":[{"t":2,"r":"flights.0"}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected.0"}],"backward":[{"t":2,"r":"selected.1"}],"pending":[{"t":2,"r":"pending"}]}}]}," ",{"t":7,"e":"td","a":{"style":"width: 50%;"},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"onSelect"}],"small":"1","flights":[{"t":2,"r":"flights.1"}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected.1"}],"onward":[{"t":2,"r":"selected.0"}],"pending":[{"t":2,"r":"pending"}]}}]}]}]}]}],"n":50,"x":{"r":["count","flights"],"s":"_0(_1)>0"}}]};

/***/ },
/* 335 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    moment = __webpack_require__(44),
	    accounting = __webpack_require__(70),
	    page = __webpack_require__(32)
	    ;
	
	var Form = __webpack_require__(34),
	    Booking = __webpack_require__(51),
	    Meta = __webpack_require__(68)
	    ;
	
	var ROUTES = __webpack_require__(57).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(336),
	
	    components: {
	        flights: __webpack_require__(328),
	        'multicity-summary': __webpack_require__(337)
	    },
	
	    data: function() {
	        return _.extend({
	            meta: Meta.object,
	            active: 0,
	            selected: [],
	            percent: function(array) { return 100/array.length; },
	            onSelect: function(flight, view) {
	                var active = this.get('active'),
	                    count = this.get('flights').length;
	
	                view.set('selected', flight);
	
	                if (-1 !== active) {
	                    if (active < count - 1) {
	                        this.set('active', active+1);
	                    } else if (view.get('selected').length < count) {
	                        var selected = this.get('selected');
	
	                        for (var i = 0; i < count; i ++) {
	                            if (!selected[i]) {
	                                view.set('active', i);
	                                break;
	                            }
	                        }
	                    }
	                }
	
	                if (false) {
	                    this.book();
	                }
	            }.bind(this)
	        }, __webpack_require__(331));
	    },
	
	    oncomplete: function() {
	        $('.dropdown', this.el).dropdown();
	        /* remove padding when number of flights are five. */
	        $(document).on('click','.select_flight',function(){
	        	if($('.fourteen .list .item').length == 5) {
	        		$('.fourteen .list .item').css('padding-left','0px').css('padding-right','0px');
	        	}
	        });
	    },
	
	    book: function() {
	        var view = this;
	
	        Booking.create(_.map(this.get('selected'), function(i) { return i.get('system'); }), { cs: view.get('search.cs'), url: view.get('search.url'),cur:view.get('meta.display_currency') })
	            .then(function(booking) {
	                page(ROUTES.booking(booking.get('id')));
	            });
	    },
	
	    modifySearch: function() {
	        this.root.modifySearch();
	    }
	});

/***/ },
/* 336 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment equal height grid flights-selection modify_search_show"},"f":[{"t":7,"e":"div","a":{"class":"fourteen wide column"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed horizontal list"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.logo"}}]}}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header black_font","style":"color:#000!important;"},"f":[{"t":2,"r":"itinerary"},{"t":4,"f":["(",{"t":2,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}}," stop(s))"],"n":50,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}},{"t":4,"n":51,"f":["(non-stop)"],"x":{"r":["stops","segments.0"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":"airlinesName black_font"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.name"}}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).flight"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"HH:mm\")"}}," - ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).arrive.format(\"HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}}," | ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"D MMM, YYYY\")"}}]}]}]}],"n":50,"r":"segments"}],"n":52,"i":"i","r":"selected"}]}]}," ",{"t":7,"e":"div","a":{"class":"two wide column center aligned book"},"f":[{"t":7,"e":"div","a":{"class":"price black_font"},"f":[{"t":4,"f":[{"t":3,"x":{"r":["money","price","selected","meta.display_currency"],"s":"_0(_1(_2),_3)"}}],"n":50,"r":"selected"}]}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui button large orange resize_book_bottun"},"m":[{"t":4,"f":["disabled style=\"background:#2a2a2a!important;color:#fff!important\""],"n":51,"x":{"r":["canbook","selected","flights"],"s":"_0(_1,_2)"}}],"v":{"click":{"m":"book","a":{"r":[],"s":"[]"}}},"f":["BOOK"]}]}]}],"n":50,"r":"selected"},{"t":7,"e":"div","a":{"class":"ui divided relaxed horizontal list flights-tabs"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","t1":"fade","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active","i"],"s":"_0==_1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"set","a":{"r":["i"],"s":"[\"active\",_0]"}}},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":2,"r":"itinerary"}]}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"ddd, D MMM\")"}}],"r":"./0"}]}]}],"n":50,"r":"./0"}],"n":52,"i":"i","r":"flights"}," ",{"t":4,"f":[{"t":7,"e":"div","t1":"fade","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"_0==-1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",-1]"}}},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["VIEW ALL"]}," FLIGHTS"]}]}],"n":51,"r":"pending"}]}," ",{"t":7,"e":"table","a":{"class":["flights-grid small ",{"t":4,"f":["summary"],"n":50,"x":{"r":["active"],"s":"-1==_0"}}]},"f":[{"t":7,"e":"tbody","f":[{"t":7,"e":"tr","f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"valign":"top","style":["width: ",{"t":2,"x":{"r":["percent","flights"],"s":"_0(_1)"}},"%;"]},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"onSelect"}],"summary":"1","class":"tiny","flights":[{"t":2,"r":"."}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"rx":{"r":"selected","m":[{"t":30,"n":"i"}]}}],"pending":[{"t":2,"r":"pending"}]}}]}],"n":50,"r":"./0"}],"n":50,"x":{"r":["active"],"s":"-1==_0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"valign":"top","style":"width: 100%;"},"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"."}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"rx":{"r":"selected","m":[{"t":30,"n":"i"}]}}],"pending":[{"t":2,"r":"pending"}]}}]}],"n":50,"x":{"r":["i","active"],"s":"_0==_1"}}],"x":{"r":["active"],"s":"-1==_0"}}],"n":52,"i":"i","r":"flights"}]}]}]}]};

/***/ },
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	    _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(338),
	
	    components: {
	        flights: __webpack_require__(328)
	    },
	
	    data: function() {
	        return {
	            percent: function(array) { return 100/array.length; }
	        };
	    }
	});

/***/ },
/* 338 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"table","a":{"style":"width: 100%"},"f":[{"t":7,"e":"tr","f":[{"t":4,"f":[{"t":7,"e":"td","a":{"valign":"top","style":["width: ",{"t":2,"x":{"r":["percent","results.flights"],"s":"_0(_1)"}},"%;"]},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"selectFn"}],"summary":"1","class":"tiny","flights":[{"t":2,"r":"."}],"search":[{"t":2,"r":"results.search"}],"filtered":[{"t":2,"r":"results.filtered"}],"selected":[{"t":2,"rx":{"r":"selected","m":[{"t":30,"n":"i"}]}}]}}]}],"n":52,"i":"i","r":"results.flights"}]}]}]};

/***/ },
/* 339 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(26),
	    _ = __webpack_require__(30),
	    moment = __webpack_require__(44),
	    page = __webpack_require__(32)
	    ;
	
	var Form = __webpack_require__(34),
	    Search = __webpack_require__(56)
	    ;
	
	var ROUTES = __webpack_require__(57).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(340),
	
	    components: {
	        'ui-spinner': __webpack_require__(318),
	        'ui-airport': __webpack_require__(320)
	    },
	
	    data: function() {
	        return {
	            moment: moment
	        };
	    },
	
	    onconfig: function() {
	        this.set('search', Search.parse(this.get('modify').toJSON()));
	    },
	
	    oncomplete: function() {
	        var view = this,
	            popup = $(this.find('.extended.popup')),
	            fn = $(this.find('.extended.dropdown'))
	                .popup({
	                    position : 'bottom right',
	                    popup: $(this.find('.extended.popup')),
	                    on: null,
	                    prefer: 'opposite',
	                    closable: false
	                })
	                .on('click', function(e) {
	                    e.stopPropagation();
	                    fn.popup('show');
	                    popup.on('click.modify-search', function(e) {
	                        e.stopPropagation();
	                    });
	
	                    $(document).on('click.modify-search', function(e) {
	                        fn.popup('hide');
	                        $(document).off('click.modify-search');
	                        popup.off('click.modify-search');
	
	                    });
	                })
	            ;
	    },
	
	    submit: function() {
	        this.post(ROUTES.search, this.serialize())
	            .then(function(search) { page(search.url); });
	    },
	
	    serialize: function() { return this.get('search').toJSON(); }
	
	});

/***/ },
/* 340 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"form","a":{"class":["ui form segment ",{"t":4,"f":["loading"],"n":50,"r":"pending"}," modify-search single"],"action":"javascript:;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"table","a":{"class":"fluid","cellspacing":"5"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"min-width: 200px;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid transparent","placeholder":"FROM","search":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.from"}]},"f":[]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid transparent from","placeholder":"FROM","search":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.from"}]},"f":[]}],"r":"search.domestic"}]}," ",{"t":7,"e":"td","a":{"style":"min-width: 200px;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid transparent","placeholder":"TO","search":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.to"}]},"f":[]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid transparent","placeholder":"TO","search":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.to"}]},"f":[]}],"r":"search.domestic"}]}," ",{"t":7,"e":"td","a":{"style":"min-width: 110px;"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.depart_at"}],"class":"fluid pointing top left","simple":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"max":[{"t":2,"x":{"r":["search.tripType","search.flights.0.return_at"],"s":"2==_0&&_1"}}],"calendar":[{"t":2,"x":{"r":[],"s":"{twomonth:true}"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}]},"f":[]}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"style":"min-width: 110px;"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.return_at"}],"class":"fluid pointing top right","simple":"1","placeholder":"RETURN ON","min":[{"t":2,"x":{"r":["search.flights.0.depart_at","moment"],"s":"_0||_1()"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}]},"f":[]}]}],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui selection extended dropdown fluid active","tabindex":"0"},"f":[{"t":7,"e":"div","a":{"class":"text","style":"white-space: nowrap; text-overflow: ellipsis;"},"f":[{"t":4,"f":[{"t":2,"r":"search.passengers.0"}," Adult,"],"n":50,"x":{"r":["search.passengers.0"],"s":"_0>0"}}," ",{"t":4,"f":[{"t":2,"r":"search.passengers.1"}," Child,"],"n":50,"x":{"r":["search.passengers.1"],"s":"_0>0"}}," ",{"t":4,"f":[{"t":2,"r":"search.passengers.2"}," Infant,"],"n":50,"x":{"r":["search.passengers.2"],"s":"_0>0"}}," ",{"t":2,"rx":{"r":"meta.cabinTypes","m":[{"r":["search.cabinType"],"s":"_0-1"},"name"]}}]}," ",{"t":7,"e":"i","a":{"class":"dropdown icon"}}]}," ",{"t":7,"e":"div","a":{"class":"ui extended popup","style":"width: 150px;"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.0"}],"class":"fluid","large":"1","placeholder":"Adults","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.1"}],"class":"fluid","large":"1","placeholder":"Children","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["2-12 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.2"}],"class":"fluid","large":"1","placeholder":"Infants","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["Below 2 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"search.cabinType"}],"class":"fluid","large":"1","placeholder":"Class","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.cabinTypes()"}}],"error":[{"t":2,"r":"errors.cabinType"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"pull right"},"f":[{"t":7,"e":"a","a":{"class":"small","href":"javascript:;","onclick":"$('.extended.popup').popup('hide');"},"f":["Close"]}]}]}]}," ",{"t":7,"e":"td","a":{"style":"width: auto;"},"f":[{"t":7,"e":"button","a":{"type":"submit","class":"ui button large blue"},"f":["Search"]}]}]}]}]}]};

/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	    _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(342),
	
	
	    data: function() {
	        return {
	            itinerary: function(flight) {
	                if (!flight)
	                    return;
	
	                var s = flight.get('segments.0');
	
	                return [s[0].from.airportCode, s[s.length-1].to.airportCode].join('-');
	            },
	
	            times: function(flights) {
	                return [flights[0].depart_at.format('D MMM, YYYY'), flights[flights.length-1].depart_at.format('D MMM, YYYY')].join('-');
	            }
	        };
	    },
	
	    modifySearch: function() {
	        this.root.modifySearch();
	    }
	});

/***/ },
/* 342 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui segment modify-search multicity"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed divided horizontal list"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["MULTICITY TRIP"]}," ",{"t":4,"f":[{"t":2,"x":{"r":["itinerary","./0"],"s":"_0(_1)"}},"  "],"n":52,"i":"i","r":"flights"}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["TIME"]}," ",{"t":2,"x":{"r":["times","search.flights"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content passengers"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["ADULT"]}," ",{"t":2,"r":"search.passengers.0"}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content passengers"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["CHILD"]}," ",{"t":2,"r":"search.passengers.1"}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content passengers"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["INFANT"]}," ",{"t":2,"r":"search.passengers.2"}]}]}]}," ",{"t":7,"e":"div","a":{"style":"float: right"},"f":[{"t":7,"e":"button","a":{"class":"ui button large blue"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":["Modify Search"]}]}]}]};

/***/ },
/* 343 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        moment = __webpack_require__(44),
	        _ = __webpack_require__(30),
	        money = __webpack_require__(69),
	        Meta = __webpack_require__(68)
	        ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(344),
	    data: function () {
	        return {
	            $: money,
	            meta: Meta.object,
	            util:_
	        };
	    },
	    onconfig: function () {
	        //this.observe('filtered', function(value) {
	        //    this.set('reset', true).then(function() { this.set('reset', false); }.bind(this));
	        //}, {init: false});
	    },
	    oncomplete: function () {
	        setTimeout(function () {
	            var view = this;
	
	            $(this.find('.ui.accordion')).accordion({exclusive: false});
	            $(this.find('.ui.checkbox')).checkbox();
	
	            var price = $(this.find('.price.slider')).ionRangeSlider({
	                type: "double",
	                grid: true,
	                grid_num: 3,
	                force_edges: true,
	                prettify: function (num) {
	                    return money(num, Meta.object.display_currency);
	                },
	                onChange: function (data) {
	                    view.get('filter').set('filtered.prices', [data.from, data.to]);
	                }
	            }).data('ionRangeSlider');
	            /**
	             * Added By Satender
	             * Purpose : To reset the Price Slider according the Currency
	             * Used File : site/themes/B2C/dev/js/components/app/layout.js - LN 59
	             */
	            Meta.object.set('PriceSlider', price);
	
	            /**
	             * END HERE
	             */
	            $(this.find('.departure.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) {
	                    return moment(num, "X").format("HH:mm");
	                },
	                onChange: function (data) {
	                    view.get('filter').set('filtered.departure', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
	                }
	            }).data('ionRangeSlider');
	
	
	            $(this.find('.layover.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) {
	                    return moment(num, "X").format("HH:mm");
	                },
	                onChange: function (data) {
	                    view.get('filter').set('filtered.layover', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
	                }
	            }).data('ionRangeSlider');
	
	            $(this.find('.arrive.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) {
	                    return moment(num, "X").format("HH:mm");
	                },
	                onChange: function (data) {
	                    view.get('filter').set('filtered.arrival', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
	                }
	            }).data('ionRangeSlider');
	
	            $(this.find('.backward-arrive.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) {
	                    return moment(num, "X").format("HH:mm");
	                },
	                onChange: function (data) {
	                    view.get('filter').set('filtered.arrival2', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
	                }
	            }).data('ionRangeSlider');
	
	            $(this.find('.backward-departure.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) {
	                    return moment(num, "X").format("HH:mm");
	                },
	                onChange: function (data) {
	                    view.get('filter').set('filtered.departure2', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
	                }
	            }).data('ionRangeSlider');
	
	
	            this.observe('filter.prices', function (value) {
	                if (!value)
	                    return;
	
	                price.update({
	                    min: value[0],
	                    max: value[1],
	                    from: value[0],
	                    to: value[1]
	                })
	            }, {init: true});
	
	            this.observe('filter.filtered', function () {
	                if (this.get('filter')) {
	                    this.get('filter').filter();
	                }
	            }, {init: false});
	        }.bind(this), 500);
	
	
	    },
	    modifySearch: function () {
	        this.root.modifySearch();
	    },
	    carriers: function (e, show) {
	        e.original.stopPropagation();
	        this.set('filter.filtered.carriers', show ? _.pluck(this.get('filter.carriers'), 'code') : []);
	        $("html, body").animate({
	            scrollTop: 0
	        }, 400);
	    }
	});

/***/ },
/* 344 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"results-filter"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui basic segment with-buttons"},"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui blue fluid button"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":["Modify Search"]}]}," ",{"t":7,"e":"div","a":{"class":"ui styled fluid accordion"},"f":[{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Price"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"price slider"}}]}," "]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Stops"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":4,"f":[{"t":7,"e":"label","a":{"style":"height:10px;"},"f":[{"t":7,"e":"ul","a":{"class":"ul_filter"},"f":[{"t":7,"e":"li","a":{"class":"filter_cb"},"f":[{"t":7,"e":"input","a":{"type":"checkbox","name":[{"t":2,"r":"filter.filtered.stops"}],"value":[{"t":2,"r":"."}]}}]}," ",{"t":7,"e":"li","a":{"class":"filter_cb_name"},"f":[{"t":7,"e":"span","a":{"title":[{"t":2,"r":"name"}]},"f":["   ",{"t":4,"f":["Non-stop"],"n":50,"x":{"r":["."],"s":"0==_0"}},{"t":4,"n":51,"f":[{"t":2,"r":"."}," stop(s)"],"x":{"r":["."],"s":"0==_0"}}]}]}]}]}],"n":52,"r":"filter.stops"}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Airlines ",{"t":7,"e":"div","a":{"class":"carriersLink small pull right"},"f":[{"t":7,"e":"a","v":{"click":{"m":"carriers","a":{"r":["event"],"s":"[_0,true]"}}},"f":["All |"]}," ",{"t":7,"e":"a","v":{"click":{"m":"carriers","a":{"r":["event"],"s":"[_0,false]"}}},"f":["None"]}]}]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":4,"f":[{"t":7,"e":"label","a":{"style":"width:100%;height:10px;"},"f":[{"t":7,"e":"ul","a":{"class":"ul_filter"},"f":[{"t":7,"e":"li","a":{"class":"filter_cb"},"f":[{"t":7,"e":"input","a":{"type":"checkbox","id":"cb_carrier","name":[{"t":2,"r":"filter.filtered.carriers"}],"value":[{"t":2,"r":"code"}]}}]}," ",{"t":7,"e":"li","a":{"class":"filter_cb_name"},"f":[{"t":7,"e":"span","a":{"title":[{"t":2,"r":"name"}]},"f":["   ",{"t":2,"r":"name"}]}]}," ",{"t":7,"e":"li","a":{"class":"carrier_only"},"f":[{"t":7,"e":"a","v":{"click":{"m":"carriers","a":{"r":["event"],"s":"[_0,false]"}}},"f":["Only"]}]}," ",{"t":4,"f":[" ",{"t":7,"e":"li","a":{"class":"carrier_price"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"n":50,"x":{"r":["filter.domestic","filter.tripType"],"s":"_0==1&&(_1==2||_1==3)"}},{"t":4,"n":51,"f":[{"t":7,"e":"li","a":{"class":"carrier_price"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"x":{"r":["filter.domestic","filter.tripType"],"s":"_0==1&&(_1==2||_1==3)"}}]}]}],"n":52,"r":"filter.carriers"}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Onward Departure Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"departure slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Onward Arrive Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"arrive slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Return Departure Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"backward-departure slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Return Arrive Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"backward-arrive slider"}}]}]}],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Departure Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"departure slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Arrive Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"arrive slider"}}]}]}],"x":{"r":["search.tripType"],"s":"2==_0"}}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Layover Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"layover slider"}}]}]}]}]}]};

/***/ },
/* 345 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Page = __webpack_require__(313),
	    Meta = __webpack_require__(68)
	    ;
	
	module.exports = Page.extend({
	    template: __webpack_require__(346),
	
	    components: {
	        'booking': __webpack_require__(25)
	    },
	
	    data: function() {
	        return {
	            meta: Meta.object
	        }
	    },
	
	    oncomplete: function() {
	        $(window).scrollTop(0);
	    }
	});

/***/ },
/* 346 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"panel":"0"},"f":[{"t":7,"e":"booking","a":{"id":[{"t":2,"r":"id"}]}}]}]};

/***/ },
/* 347 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);