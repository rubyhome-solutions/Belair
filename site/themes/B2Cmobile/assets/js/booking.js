webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(24);


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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Booking = __webpack_require__(25)
	    ;
	
	__webpack_require__(99);
	
	$(function() {
	    (new Booking()).render('#app');
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(26),
	    _ = __webpack_require__(29),
	    page = __webpack_require__(31),
	    $ = __webpack_require__(32)
	    ;
	
	var Form = __webpack_require__(33),
	    Booking = __webpack_require__(50),
	    Meta = __webpack_require__(66)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(69),
	
	    components: {
	        layout: __webpack_require__(70),
	        step1: __webpack_require__(72),
	        step2: __webpack_require__(82),
	        step3: __webpack_require__(89),
	        step4: __webpack_require__(96)
	    },
	
	    partials: {
	        'base-panel': __webpack_require__(98)
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
	
	        var url = '/b2c/flights' + this.get('booking.searchurl'),
	            cs = this.get('booking.clientSourceId'),
	            params = [];
	
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
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(32),
	    page = __webpack_require__(31)
	    ;
	
	var View = __webpack_require__(51),
	    Flight = __webpack_require__(52),
	    Dialog = __webpack_require__(64),
	    Meta = __webpack_require__(66)
	    ;
	
	var money = __webpack_require__(67);
	
	
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

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(34);
	
	module.exports = Component.extend({
	
	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    $ = __webpack_require__(32),
	    moment = __webpack_require__(43),
	    Q = __webpack_require__(26)
	    ;
	
	var Store = __webpack_require__(53),
	    Search = __webpack_require__(54),
	    ROUTES = __webpack_require__(55).flights
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
	
	        console.log('constructed flights', deferred.flights, search.get('flights'));
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
	                return _.map(flights, function(flight) { return Flight.parse(flight) });
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
/* 53 */,
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(32),
	    moment = __webpack_require__(43)
	    ;
	
	var Store = __webpack_require__(53)
	    ;
	
	var ROUTES = __webpack_require__(55).flights;
	
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
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var FLIGHTS = '/b2c/flights';
	
	module.exports = {
	    flights: {
	        search: FLIGHTS + '/search',
	        booking: function(id) { return '/b2c/booking/' + id; },
	    },
	};
	
	//new
	var profilemeta = __webpack_require__(56),
	    bookingemeta = __webpack_require__(57),
	    travellermeta = __webpack_require__(58),
	    myProfile = __webpack_require__(59),
	    myBooking = __webpack_require__(62),
	    myTraveller = __webpack_require__(63);
	    
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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(32)
	    ;
	
	var View = __webpack_require__(53)
	    ;
	
	var Meta = View.extend({
	    data: function() {
	        var view = this;
	
	        return {
	            select: {
	                titles: function() { return _.map(view.get('titles'), function(i) { return { id: i.id, text: i.name }; }); },
	                 }
	        }
	    }
	
	});
	
	Meta.parse = function(data) {
	    return new Meta({data: data});
	};
	
	Meta.fetch = function() {
	    return Q.Promise(function(resolve, reject) {
	        $.getJSON('/b2c/users/meta')
	            .then(function(data) { resolve(Meta.parse(data)); })
	            .fail(function(data) {
	                //TODO: handle error
	            });
	    });
	};
	
	var instance = null;
	Meta.instance = function() {
	    return Q.Promise(function(resolve, reject) {
	        if (instance) {
	            resolve(instance);
	            return;
	        }
	
	        instance = Meta.fetch();
	        resolve(instance);
	
	    });
	};
	
	module.exports = Meta;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(32)
	    ;
	
	var View = __webpack_require__(53)
	    ;
	
	var Meta = View.extend({
	    data: function() {
	        var view = this;
	
	        return {
	            select: {
	                titles: function() { return _.map(view.get('titles'), function(i) { return { id: i.id, text: i.name }; }); },
	                
	            }
	        }
	    }
	
	});
	
	Meta.parse = function(data) {
	    return new Meta({data: data});
	};
	
	Meta.fetch = function() {
	    return Q.Promise(function(resolve, reject) {
	        $.getJSON('/b2c/airCart/meta')
	            .then(function(data) { resolve(Meta.parse(data)); })
	            .fail(function(data) {
	                //TODO: handle error
	            });
	    });
	};
	
	var instance = null;
	Meta.instance = function() {
	    return Q.Promise(function(resolve, reject) {
	        if (instance) {
	            resolve(instance);
	            return;
	        }
	
	        instance = Meta.fetch();
	        resolve(instance);
	
	    });
	};
	
	module.exports = Meta;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(32)
	    ;
	
	var View = __webpack_require__(53)
	    ;
	
	var Meta = View.extend({
	    data: function() {
	        var view = this;
	
	        return {
	            
	        }
	    }
	
	});
	
	Meta.parse = function(data) {
	    return new Meta({data: data});
	};
	
	Meta.fetch = function() {
	    return Q.Promise(function(resolve, reject) {
	        $.getJSON('/b2c/traveler/meta')
	            .then(function(data) { resolve(Meta.parse(data)); })
	            .fail(function(data) {
	                //TODO: handle error
	            });
	    });
	};
	
	var instance = null;
	Meta.instance = function() {
	    return Q.Promise(function(resolve, reject) {
	        if (instance) {
	            resolve(instance);
	            return;
	        }
	
	        instance = Meta.fetch();
	        resolve(instance);
	
	    });
	};
	
	module.exports = Meta;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(32),
	    moment = __webpack_require__(43),
	    validate = __webpack_require__(60)
	    
	    ;
	
	var Store = __webpack_require__(53)  ;
	
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
/* 60 */
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
	
	  validate.exposeModule(validate, this, exports, module, __webpack_require__(61));
	}).call(this,
	         true ? /* istanbul ignore next */ exports : null,
	         true ? /* istanbul ignore next */ module : null,
	        __webpack_require__(61));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30)(module)))

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	        Q = __webpack_require__(26),
	        $ = __webpack_require__(32),
	        moment = __webpack_require__(43),
	        validate = __webpack_require__(60)
	
	        ;
	
	var Store = __webpack_require__(53);
	
	var MybookingData = Store.extend({
	    computed: {
	        price: function () {
	            _.reduce(this.get(' '))
	        }
	    },
	    refreshCurrentCart: function (view) {
	        console.log("refreshCurrentCart");
	        return Q.Promise(function (resolve, reject, progress) {
	            $.ajax({
	                type: 'POST',
	                url: '/b2c/airCart/getCartDetails/' + _.parseInt(view.get('currentCartId')),
	                dataType: 'json',
	                data: {'data': ''},
	                success: function (data) {
	
	                    var details = {
	                        id: data.id, email:data.email,upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status,booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity,
	                        curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
	                        bookings: _.map(data.bookings, function (i) {
	                            return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
	                                traveller: _.map(i.traveller, function (t) {
	                                    return {
	                                        id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
	                                        airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,
	                                        basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status,statusmsg: t.statusmsg, selected: false,
	                                        routes: _.map(t.routes, function (ro) {
	                                            return {
	                                                id: ro.id, origin: ro.origin, originDetails: ro.originDetails, destinationDetails: ro.destinationDetails, destination: ro.destination, departure: ro.departure, arrival: ro.arrival, carrier: ro.carrier, carrierName: ro.carrierName, flightNumber: ro.flightNumber,
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
	               // console.log("done");
	            },
	            error: function (error) {
	                alert(error);
	            }
	        }).then(function (data) {
	        var details = {
	            id: data.id, email:data.email,ticketstatusmsg:data.ticketstatusmsg,upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status,clientSourceId:data.clientSourceId,segNights:data.segNights,
	            booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
	            bookings: _.map(data.bookings, function (i) {
	                return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
	                    traveller: _.map(i.traveller, function (t) {
	                        return {
	                            id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
	                            airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,
	                            basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status,statusmsg: t.statusmsg, selected: false,
	                            routes: _.map(t.routes, function (ro) {
	                                return {
	                                    id: ro.id, origin: ro.origin, originDetails: ro.originDetails, destinationDetails: ro.destinationDetails, destination: ro.destination, departure: ro.departure, arrival: ro.arrival, carrier: ro.carrier, carrierName: ro.carrierName, flightNumber: ro.flightNumber,
	                                    flighttime: ro.flighttime, originTerminal: ro.originTerminal, destinationTerminal: ro.destinationTerminal, meal: ro.meal, seat: ro.seat, aircraft: ro.aircraft,
	                                };
	                            })
	                        };
	                    }),
	                    routes: _.map(i.routes, function (t) {
	                        return {
	                            id: t.id, origin: t.origin, originDetails: t.originDetails, destinationDetails: t.destinationDetails, destination: t.destination, departure: t.departure, arrival: t.arrival, carrier: t.carrier, carrierName: t.carrierName, flightNumber: t.flightNumber,
	                            flighttime: t.flighttime, originTerminal: t.originTerminal, destinationTerminal: t.destinationTerminal, meal: t.meal, seat: t.seat, aircraft: t.aircraft,
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
	            }), };
	        data.currentCartDetails= details;
	        data.carts=[];
	        data.carts.push(details);
	        data.cabinType = 1;
	    data.add = false;
	    data.edit = false;
	    data.currentCartId = details.id;
	 //   console.log(data.currentCartDetails);
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
	        return {id: i.id,email:i.email, created: i.created, totalAmount: i.totalAmount, booking_status: i.booking_status,
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
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Store = __webpack_require__(53),
	    moment = __webpack_require__(43),
	    validate = __webpack_require__(60),
	    $ = __webpack_require__(32),
	    _ = __webpack_require__(29)
	    ;
	
	module.exports = Store.extend({
	    quene: [],
	
	    data: function() {
	        
	        var getData=function(data){
	            console.log(data);
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
	         _.each(titles, function(i, k) { console.log(i); if (i.id==t) title=i.text; });
	      
	        var currenttraveller={id: id,title:title, email: newtraveller.email, mobile: newtraveller.mobile,  first_name: newtraveller.first_name, 
	                last_name:newtraveller.last_name,birthdate:newtraveller.birthdate.format('YYYY-MM-DD'),baseUrl:'',passport_number:newtraveller.passport_number,passport_place:newtraveller.passport_place
	            };
	        var index= _.findIndex(this.get().travellers, { 'id': id});
	        this.splice('travellers', index, 1);
	        console.log(currenttraveller);
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
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(32),
	    Q = __webpack_require__(26)
	    ;
	
	var Form = __webpack_require__(33)
	    ;
	
	var Dialog = Form.extend({
	    template: __webpack_require__(65),
	
	    data: function() {
	        return {
	            header: 'header',
	            message: 'message',
	            buttons: [
	                ['Ok', function() { alert('zzz'); }],
	                ['Cancel', function() { alert('yyy') }]
	            ]
	        }
	    },
	
	    oncomplete: function() {
	        $(this.find('.ui.modal')).modal('show');
	    },
	
	    click: function(event, cb) {
	        cb.bind(this)(event);
	    }
	});
	
	
	Dialog.open = function(options) {
	    var dialog = new Dialog();
	    dialog.set(options);
	    dialog.render('#popup-container');
	};
	
	module.exports = Dialog;

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui  small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":2,"r":"header"}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":3,"r":"message"}]}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui button"},"v":{"click":{"m":"click","a":{"r":["event","./1"],"s":"[_0,_1]"}}},"f":[{"t":2,"r":"./0"}]}],"n":52,"r":"buttons"}]}]}]};

/***/ },
/* 66 */,
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var accounting = __webpack_require__(68)
	    ;
	
	var Meta = __webpack_require__(66)
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
/* 68 */
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
/* 69 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"style","f":["#app > .wrapper > .content { display: block !important; }"]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"id":"booking"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment center aligned"},"f":[{"t":7,"e":"h1","f":[{"t":2,"r":"booking.error"}]}," ",{"t":7,"e":"a","v":{"click":{"m":"back2","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button"},"f":["Go Back to Search Results"]}]}],"n":50,"r":"booking.error"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui segment"},"f":[{"t":7,"e":"h1","f":["The simplest way to book !"]}," ",{"t":7,"e":"a","v":{"click":{"m":"back","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button middle gray back"},"f":["Go Back to Search Results"]}," ",{"t":7,"e":"div","a":{"class":"currencyWrap"},"f":[{"t":7,"e":"span","f":["Currency:"]}," ",{"t":7,"e":"select","a":{"class":"menu transition","style":"z-index: 1010;","id":"currency1"},"v":{"change":{"m":"setCurrencyBooking","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"option","a":{"value":"INR"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"INR\""}}],"f":[{"t":7,"e":"i","a":{"class":"inr icon currency"}}," Rupee"]}," ",{"t":7,"e":"option","a":{"value":"USD"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"USD\""}}],"f":[{"t":7,"e":"i","a":{"class":"usd icon currency"}}," US Dollar"]}," ",{"t":7,"e":"option","a":{"value":"EUR"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"EUR\""}}],"f":[{"t":7,"e":"i","a":{"class":"eur icon currency"}}," Euro"]}," ",{"t":7,"e":"option","a":{"value":"GBP"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"GBP\""}}],"f":[{"t":7,"e":"i","a":{"class":"gbp icon currency"}}," UK Pound"]}," ",{"t":7,"e":"option","a":{"value":"AUD"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"AUD\""}}],"f":[{"t":7,"e":"i","a":{"class":"usd icon currency"}}," Australian Dollar"]}," ",{"t":7,"e":"option","a":{"value":"JPY"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"JPY\""}}],"f":[{"t":7,"e":"i","a":{"class":"jpy icon currency"}}," Japanese Yen"]}," ",{"t":7,"e":"option","a":{"value":"RUB"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"RUB\""}}],"f":[{"t":7,"e":"i","a":{"class":"rub icon currency"}}," Russian Ruble"]}," ",{"t":7,"e":"option","a":{"value":"AED"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"AED\""}}],"f":[{"t":7,"e":"i","a":{"class":"aed icon currency"}}," Dirham"]}]}]}," ",{"t":7,"e":"div","a":{"class":"clear"}}," ",{"t":7,"e":"step1","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step2","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step3","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step4","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}]}],"r":"booking.error"}]}],"n":50,"r":"booking"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"id":"booking"},"f":[{"t":7,"e":"div","a":{"class":"ui segment"},"f":[{"t":7,"e":"h1","f":["Booking not found!"]}]}]}],"n":50,"r":"error"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"ui text loader"},"f":["Loading"]}]}],"r":"error"}],"r":"booking"}]}]};

/***/ },
/* 70 */,
/* 71 */,
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29)
	    ;
	
	var Form = __webpack_require__(33),
	    Auth = __webpack_require__(73)
	    ;
	
	var h_money = __webpack_require__(67),
	    h_duration = __webpack_require__(75)()
	    ;
	
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(76),
	
	    components: {
	        itinerary: __webpack_require__(77),
	        'ui-code': __webpack_require__(79),
	        'ui-email': __webpack_require__(80)
	    },
	
	    data: function() {
	        return {
	            promocode:null,
	            promovalue:null,
	            promoerror:null,
	            money: h_money,
	            duration: h_duration,
	
	            seg_length: function(flights) {
	                var c = 0;
	                _.each(flights, function(flight) { c += flight.get('segments').length; });
	
	                return c;
	            }
	        }
	    },
	
	    onconfig: function() {
	        
	        
	        
	        this.observe('booking.steps.1.active', function(active) {
	            if (active) {
	                var data=this.get('booking');
	                if (typeof this.get('booking.promo_code') !== "undefined") {
	                 
	                   this.set('promocode',this.get('booking.promo_code'));
	                 this.set('promovalue',this.get('booking.promo_value'));
	                }
	                var cur=this.get('booking.currency');
	                //console.log(cur);
	                this.set('meta.display_currency',cur );
	                
	                this.update('meta');
	                //console.log( this.get('meta'));
	            }
	        });
	},
	    oncomplete: function() {
	        $(this.find('.price'))
	            .popup({
	                position : 'bottom right',
	                popup: $(this.find('.fare.popup')),
	                on: 'hover'
	            });
	            
	           
	    },
	
	    submit: function() {
	        //console.log(this.get('booking.id'));
	       // $(this.find('form')).ajaxSubmit({url: 'about:blank', method: 'POST', iframe: true});
	        this.get('booking').step1();
	
	        if (false) {
	            window.localStorage.setItem('booking_email', this.get('booking.user.email'));
	            window.localStorage.setItem('booking_country', this.get('booking.user.country'));
	            window.localStorage.setItem('booking_mobile', this.get('booking.user.mobile'));
	        }
	    },
	
	    back: function() {
	        this.parent.back();
	    },
	
	    activate: function() { if (!this.get('booking.payment.payment_id')) this.get('booking').activate(1); },
	
	    signin: function() {
	        var view = this;
	
	        Auth.login()
	            .then(function(data) {
	                view.set('meta.user', data);
	                view.set('booking.user', { id: data.id, email: data.email, mobile: data.mobile,country:data.country, logged_in: true });
	            });
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
	    }
	
	
	});

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(32),
	    Q = __webpack_require__(26)
	    ;
	
	var Form = __webpack_require__(33)
	    ;
	
	var Auth = Form.extend({
	    template: __webpack_require__(74),
	
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
	
	                    if (response.errors) {
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
/* 74 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui login small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":4,"f":["Login"],"n":51,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}," ",{"t":4,"f":["Sign-up"],"n":50,"r":"signup"}," ",{"t":4,"f":["Reset password"],"n":50,"r":"forgottenpass"}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":8,"r":"form"}]}]}],"n":50,"r":"popup"},{"t":4,"n":51,"f":[{"t":8,"r":"form"}],"r":"popup"}],"p":{"form":[{"t":7,"e":"form","a":{"action":"javascript:;","class":[{"t":4,"f":["form"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":["ui basic segment form"],"x":{"r":["popup"],"s":"!_0"}}," ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting"}],"style":"position: relative;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":50,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Login"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"password","type":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"submit","class":["ui ",{"t":4,"f":["small"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":["massive"],"x":{"r":["popup"],"s":"!_0"}}," fluid blue button uppercase"]},"f":["LOGIN"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;","class":"forgot-password"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"forgottenpass\",1]"}}},"f":["Forgot Password?"]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"p","f":["Don’t have a CheapTicket.in Account? ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"signup\",1]"}}},"f":["Sign up for one »"]}]}]}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"signup"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"email","value":[{"t":2,"r":"user.email"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"mobile","value":[{"t":2,"r":"user.mobile"}],"class":"fluid","placeholder":"Mobile"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"name","value":[{"t":2,"r":"user.name"}],"class":"fluid","placeholder":"Name"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password2","value":[{"t":2,"r":"user.password2"}],"class":"fluid","placeholder":"Password again"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui massive fluid blue button uppercase"},"v":{"click":{"m":"signup","a":{"r":[],"s":"[]"}}},"f":["Signup"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"signupsuccess"}]}," ",{"t":4,"f":["Your registration was success.",{"t":7,"e":"br"},"You will receive email with further instructions from us how to proceed.",{"t":7,"e":"br"},"Please check your inbox and if no email from us is found, check also your SPAM folder."],"n":50,"r":"signupsuccess"}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"forgottenpass"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui massive fluid blue button uppercase"},"v":{"click":{"m":"resetPassword","a":{"r":[],"s":"[]"}}},"f":["RESET"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"resetsuccess"}," ",{"t":4,"f":["Instructions how to revive your password has been sent to your email.",{"t":7,"e":"br"},"Please check your email."],"n":50,"r":"resetsuccess"}]}]}]}};

/***/ },
/* 75 */
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
/* 76 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["step header step1 ",{"t":4,"f":["active"],"n":50,"r":"step.active"},{"t":4,"n":51,"f":[{"t":4,"f":["completed"],"n":50,"r":"step.completed"}],"r":"step.active"}],"role":"tab"},"f":["Itinerary"]}," ",{"t":4,"f":[{"t":7,"e":"table","a":{"class":"step1-summary segment"},"v":{"click":{"m":"activate","a":{"r":[],"s":"[1]"}}},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"logo"},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).carrier.logo"}}],"alt":""}}]}," ",{"t":7,"e":"td","a":{"class":"carrier"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).carrier.name"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"small"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).flight"}}]}]}," ",{"t":7,"e":"td","a":{"class":"itinerary"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.city"}}," → ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.city"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"small"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"D MMM, YYYY\")"}}]}]}," ",{"t":7,"e":"td","a":{"class":"duration"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"HH:mm\")"}}," — ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).arrive.format(\"HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"small"},"f":[{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}}]}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"rowspan":[{"t":2,"x":{"r":["seg_length","booking.flights"],"s":"_0(_1)"}}],"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}},"- ",{"t":3,"x":{"r":["money","booking.promo_value","booking.currency"],"s":"_0(_1,_2)"}},"= ",{"t":3,"x":{"r":["money","booking.price","booking.promo_value","booking.currency"],"s":"_0(_1-_2,_3)"}}]}],"n":50,"x":{"r":["booking.promo_value"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","a":{"rowspan":[{"t":2,"x":{"r":["seg_length","booking.flights"],"s":"_0(_1)"}}],"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}}]}],"x":{"r":["booking.promo_value"],"s":"_0!=null"}}],"n":50,"x":{"r":["i","j"],"s":"_0==0&&_1==0"}}]}],"n":52,"i":"j","r":"segments"}],"n":52,"i":"i","r":"booking.flights"}]}],"n":50,"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment step1 ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"step.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":[{"t":7,"e":"itinerary","a":{"flight":[{"t":2,"r":"."}]}}],"n":52,"r":"booking.flights"}," ",{"t":7,"e":"div","a":{"class":"ui basic segment booking-contacts"},"f":[{"t":7,"e":"div","a":{"class":"ui header"},"f":["Contact Details"]}," ",{"t":7,"e":"div","a":{"class":"ui two column middle top aligned relaxed fitted grid","style":"position: relative"},"f":[{"t":7,"e":"div","a":{"class":"column","style":"width: 65%;"},"f":[{"t":7,"e":"div","a":{"class":"two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"label","f":["E-Mail"]}," ",{"t":7,"e":"ui-email","a":{"class":[{"t":4,"f":["bold"],"n":50,"r":"booking.user.email"}],"name":"email","placeholder":"E-Mail","error":[{"t":2,"r":"step.errors.email"}],"value":[{"t":2,"r":"booking.user.email"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field phone"},"f":[{"t":7,"e":"label","f":["Mobile"]}," ",{"t":7,"e":"ui-input","a":{"class":"code input","name":"mobile","placeholder":"Code","error":[{"t":2,"r":"step.errors.mobile"}],"value":[{"t":2,"r":"booking.user.country"}]}}," ",{"t":7,"e":"ui-input","a":{"class":["number ",{"t":4,"f":["bold"],"n":50,"r":"booking.user.mobile"}],"name":"mobile","placeholder":"Mobile","error":[{"t":2,"r":"step.errors.mobile"}],"value":[{"t":2,"r":"booking.user.mobile"}]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"step.errors"}]}],"n":50,"r":"step.errors"}]}," ",{"t":7,"e":"div","a":{"class":"column top center aligned","style":"width: 35%;"},"f":[{"t":4,"f":["Have a CheapTicket.in Account? Sign in here!",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui button small blue"},"v":{"click":{"m":"signin","a":{"r":[],"s":"[]"}}},"f":["Sign in"]}],"n":51,"r":"meta.user.email"}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code","disabled":"disabled"},"f":[]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code"},"f":[]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"removePromoCode","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"i","a":{"class":"red remove circle outline icon","alt":"Remove Promo Code","title":"Remove Promo Code"}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui basic button"},"v":{"click":{"m":"applyPromoCode","a":{"r":[],"s":"[]"}}},"f":["APPLY"]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"style":"clear:both;"},"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":{"m":"removeErrorMsg","a":{"r":[],"s":"[]"}}}}," ",{"t":2,"r":"promoerror"}]}]}],"n":50,"x":{"r":["promoerror"],"s":"_0!=null"}}]}],"n":50,"x":{"r":["booking.clientSourceId"],"s":"_0==1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui wizard button massive blue"},"f":["CONTINUE"]}]}," ",{"t":7,"e":"div","a":{"class":"right aligned column"},"f":["TOTAL:",{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}}," - ",{"t":3,"x":{"r":["money","promovalue","booking.currency"],"s":"_0(_1,_2)"}}," = ",{"t":3,"x":{"r":["money","booking.price","promovalue","booking.currency"],"s":"_0(_1-_2,_3)"}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}}]}],"x":{"r":["promovalue"],"s":"_0!=null"}}," ",{"t":7,"e":"div","a":{"class":"taxes"},"f":["Basic Fare: ",{"t":3,"x":{"r":["money","booking.taxes.basic_fare","booking.currency"],"s":"_0(_1,_2)"}}," , YQ: ",{"t":3,"x":{"r":["money","booking.taxes.yq","booking.currency"],"s":"_0(_1,_2)"}},", Service Tax: ",{"t":3,"x":{"r":["money","booking.taxes.jn","booking.currency"],"s":"_0(_1,_2)"}},", Other: ",{"t":3,"x":{"r":["money","booking.taxes.other","booking.currency"],"s":"_0(_1,_2)"}}]}]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}}],"x":{"r":["booking.steps.1"],"s":"{step:_0}"}},{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui fare fluid popup","style":"text-align: left; max-width: 280px;"},"f":[{"t":4,"f":[{"t":2,"r":"paxTaxes.1.c"},"x adults: ",{"t":3,"x":{"r":["money","paxTaxes.1.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["money","paxTaxes.1.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["money","paxTaxes.1.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["money","paxTaxes.1.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.1"}," ",{"t":4,"f":[{"t":2,"r":"paxTaxes.2.c"},"x children: ",{"t":3,"x":{"r":["money","paxTaxes.2.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["money","paxTaxes.2.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["money","paxTaxes.2.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["money","paxTaxes.2.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.2"}," ",{"t":4,"f":[{"t":2,"r":"paxTaxes.3.c"},"x infants: ",{"t":3,"x":{"r":["money","paxTaxes.3.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["money","paxTaxes.3.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["money","paxTaxes.3.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["money","paxTaxes.3.other","meta.display_currency"],"s":"_0(_1,_2)"}}," ",{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.3"}]}],"r":"booking"}]};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	    moment = __webpack_require__(43),
	    _ = __webpack_require__(29),
	
	    h_money = __webpack_require__(67)(),
	    h_duration = __webpack_require__(75)()
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(78),
	
	    data: function() {
	        return _.extend(
	            { moment: moment, money: h_money.money, duration: h_duration }
	        );
	    }
	});

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["ui segment flight-itinerary ",{"t":4,"f":["small"],"n":50,"r":"small","s":true}," ",{"t":2,"r":"class","s":true}]},"f":[{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":7,"e":"span","a":{"class":"city"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.city"}}," → ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.city"}}]}," ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"ddd MMM D YYYY\")"}}," ",{"t":7,"e":"span","a":{"class":"time"},"f":[{"t":2,"x":{"r":["duration","segtime","."],"s":"_0.format(_1(_2))"}}]}," ",{"t":4,"f":[{"t":2,"x":{"r":["flight.refundable"],"s":"[null,\"Non refundable\",\"Refundable\"][_0]"}}],"n":50,"r":"small","s":true}]}," ",{"t":7,"e":"table","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"divider"},"f":[{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","a":{"align":"center"},"f":[{"t":7,"e":"span","a":{"class":"layover"},"f":["Layover: ",{"t":2,"x":{"r":["duration","layover"],"s":"_0.format(_1)"}}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}]}],"n":50,"x":{"r":["layover"],"s":"_0.asSeconds()"}}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"airline"},"f":[{"t":7,"e":"div","a":{"class":"logos"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"r":"carrier.logo"}],"alt":[{"t":2,"r":"carrier.name"}],"title":[{"t":2,"r":"carrier.name"}]}}]}," ",{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"r":"carrier.name"},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"flight-no"},"f":[{"t":2,"r":"flight"},{"t":7,"e":"br"}," ",{"t":2,"r":"cabinType"}]}]}]}," ",{"t":7,"e":"td","a":{"class":"from","style":"text-align: right;"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"from.airportCode"},":"]},{"t":4,"f":[{"t":7,"e":"br"}],"n":50,"r":"small","s":true},{"t":2,"x":{"r":["depart"],"s":"_0.format(\"ddd HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["small","depart"],"s":"_0?_1.format(\"D MMM\"):_1.format(\"D MMM, YYYY\")"}},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"from.airport"},", ",{"t":2,"r":"from.city"}," (",{"t":2,"r":"from.airportCode"},"), Terminal ",{"t":2,"r":"originTerminal"}]}],"n":51,"r":"small","s":true}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"class":"flight"},"f":[{"t":7,"e":"div","a":{"class":"duration"},"f":[{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}}]}]}],"n":51,"r":"small","s":true}," ",{"t":7,"e":"td","a":{"class":"to"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"to.airportCode"},":"]},{"t":4,"f":[{"t":7,"e":"br"}],"n":50,"r":"small","s":true},{"t":2,"x":{"r":["arrive"],"s":"_0.format(\"ddd HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["small","arrive"],"s":"_0?_1.format(\"D MMM\"):_1.format(\"D MMM, YYYY\")"}},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"to.airport"},", ",{"t":2,"r":"to.city"}," (",{"t":2,"r":"to.airportCode"},"), Terminal ",{"t":2,"r":"destinationTerminal"}]}],"n":51,"r":"small","s":true}]}]}],"n":52,"r":"."}]}]}],"n":52,"r":"segments"}],"r":"flight"}]};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(34),
	    $ = __webpack_require__(32),
	    _ = __webpack_require__(29)
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
	    template:  false ? '<div class="select"></div>' : __webpack_require__(39),
	
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
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mailcheck = __webpack_require__(81);
	
	var Input = __webpack_require__(36);
	
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
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Mailcheck https://github.com/mailcheck/mailcheck
	 * Author
	 * Derrick Ko (@derrickko)
	 *
	 * Released under the MIT License.
	 *
	 * v 1.1.1
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
	    "in", "net", "net.au", "info", "biz", "mil", "co.jp", "sg", "hu"],
	
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
	        closestDomain = closestDomain.replace(emailParts.topLevelDomain, closestTopLevelDomain);
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
	    var minDist = 99;
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
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33);
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(83),
	
	    components: {
	        passenger: __webpack_require__(84)
	    },
	
	    data: function() {
	        return {
	            qa: window.localStorage.getItem('qa')
	        };
	    },
	    
	    oncomplete: function() {
	        
	        var view = this;
	        
	        
	        this.observe('booking.steps.2.active', function(active) {
	            if (active) {
	                console.log('scroll to top');
	        
	           
	            $('html, body').animate({
	                scrollTop: 0
	                }, 1000);
	                $.ajax({
	                    type: 'POST',
	                    url: '/b2c/booking/travelers',
	                    data: { booking_id: this.get('booking.id') },
	                    success: function(data) {
	                        console.log('got travelers', data);
	                       
	                        if (data) {
	                            view.set('travelers', data);
	                        }
	                    }
	                });
	            }
	        });
	        
	        
	    },
	
	    submit: function() { this.get('booking').step2() },
	
	    checkAvailability: function() { this.get('booking').step2({check: true}) },
	
	    activate: function() { if (!this.get('booking.payment.payment_id')) this.get('booking').activate(2); },
	
	    back: function() {
	        this.get('booking').activate(1);
	    }
	
	
	
	
	});
	


/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["step header step2 ",{"t":4,"f":["active"],"n":50,"r":"step.active"},{"t":4,"n":51,"f":[{"t":4,"f":["completed"],"n":50,"r":"step.completed"}],"r":"step.active"}],"role":"tab"},"f":["Passengers"]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"step2-summary segment"},"v":{"click":{"m":"activate","a":{"r":[],"s":"[2]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui horizontal list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":2,"r":"traveler.firstname"}," ",{"t":2,"r":"traveler.lastname"}]}]}],"n":52,"i":"i","r":"booking.passengers"}]}]}],"n":50,"x":{"r":["step.completed","step.active"],"s":"_0&&!_1"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment step2 ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"step.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"passenger-header header"},"f":[{"t":2,"rx":{"r":"meta.travelerTypes","m":[{"t":30,"n":"type_id"}]}},"(",{"t":2,"r":"no"},")*"]}," ",{"t":7,"e":"passenger","a":{"class":"basic","validation":[{"t":2,"r":"booking.passengerValidaton"}],"travelers":[{"t":2,"r":"travelers"}],"passenger":[{"t":2,"r":"."}],"errors":[{"t":2,"rx":{"r":"step.errors","m":[{"t":30,"n":"i"}]}}],"meta":[{"t":2,"r":"meta"}]}}],"n":52,"i":"i","r":"booking.passengers"}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"div","a":{"class":"ui one column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"button","a":{"type":"submit","class":"ui wizard button massive blue"},"f":["CONTINUE"]}," ",{"t":4,"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui wizard button massive red"},"v":{"click":{"m":"checkAvailability","a":{"r":[],"s":"[]"}}},"f":["CHECK"]}],"n":50,"r":"qa"}]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["step.completed","step.active"],"s":"_0&&!_1"}}],"x":{"r":["booking.steps.2"],"s":"{step:_0}"}}]};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	 $ = __webpack_require__(32);
	 
	    ;
	var Form = __webpack_require__(33),
	    Meta = __webpack_require__(66)
	    ;
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(85),
	
	    components: {
	    mobileselect: __webpack_require__(86),
	    },
	
	    data: function() {
	        return {
	            _: _,
	            datesupported:true,
	            all: false,
	            date: __webpack_require__(88)(),
	
	            search: function(term, travelers) {
	              //  console.log('search', arguments);
	
	                term = term.toLowerCase();
	                if (term && travelers) {
	                    return _.filter(travelers, function(i) { return -1 !== (i.firstname + ' ' + i.lastname).toLowerCase().indexOf(term); })
	                        .slice(0, 4);
	                }
	
	                return travelers ? travelers.slice(0, 4) : null;
	            }
	        };
	    },
	
	    oncomplete: function() {
	        !function(e,t,n){function a(e,t){return typeof e===t}function s(e){var t=r.className,n=Modernizr._config.classPrefix||"";if(c&&(t=t.baseVal),Modernizr._config.enableJSClass){var a=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(a,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),c?r.className.baseVal=t:r.className=t)}function i(){var e,t,n,s,i,o,r;for(var c in u){if(e=[],t=u[c],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=a(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)o=e[i],r=o.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),l.push((s?"":"no-")+r.join("-"))}}function o(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):c?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}var l=[],r=t.documentElement,c="svg"===r.nodeName.toLowerCase(),u=[],f={_version:"3.0.0-alpha.4",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){u.push({name:e,fn:t,options:n})},addAsyncTest:function(e){u.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr;var p=o("input"),d="search tel url email datetime date month week time datetime-local number range color".split(" "),m={};Modernizr.inputtypes=function(e){for(var a,s,i,o=e.length,l=":)",c=0;o>c;c++)p.setAttribute("type",a=e[c]),i="text"!==p.type&&"style"in p,i&&(p.value=l,p.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(a)&&p.style.WebkitAppearance!==n?(r.appendChild(p),s=t.defaultView,i=s.getComputedStyle&&"textfield"!==s.getComputedStyle(p,null).WebkitAppearance&&0!==p.offsetHeight,r.removeChild(p)):/^(search|tel)$/.test(a)||(i=/^(url|email|number)$/.test(a)?p.checkValidity&&p.checkValidity()===!1:p.value!=l)),m[e[c]]=!!i;return m}(d),i(),s(l),delete f.addTest,delete f.addAsyncTest;for(var g=0;g<Modernizr._q.length;g++)Modernizr._q[g]();e.Modernizr=Modernizr}(window,document);
	        if (!Modernizr.inputtypes.date) {
	            this.set('datesupported',false);
	        }
	        
	        //$( ".dob" ).datepicker();
	      
	        if (true) {
	            var fn = $(this.find('input.firstname'))
	                    .popup({
	                        position : 'bottom left',
	                        popup: $(this.find('.travelers.popup')),
	                        on: null,
	                        prefer: 'opposite',
	                        closable: false
	                    })
	                    .on('click', function() { fn.popup('show'); })
	                    .on('blur', function() { setTimeout(function() { fn.popup('hide'); }, 200); })
	                ;
	                
	        } else {
	            var view = this;
	            this.observe('travelers', function(travelers) {
	               if (travelers && travelers.length) {
	                   $('.tpopup', view.el).mobiscroll().select({
	                       buttons: [],
	                       onSelect: function (v, inst) {
	                           var id = _.parseInt($('.tpopup', view.el).val()),
	                               traveler = _.findWhere(view.get('travelers'), { id: id });
	
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
	                               traveler = _.findWhere(view.get('travelers'), { id: id });
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
	
	    travelers: function() {
	        if (false) {
	            $('.tpopup', this.el).mobiscroll('show');
	        }
	    },
	    titleselect: function() {
	        if (false) {
	            $('.titlepopup', this.el).mobiscroll('show');
	        }
	    },
	    show: function(section, validation, all) {
	        if (all)
	            return true;
	
	        if ('birth' == section) {
	            return 'domestic' != 'validation';
	        }
	
	        if ('passport' == section) {
	            return 'full' == 'validation';
	        }
	    },
	
	    pickTraveler: function(traveler) {
	        var view = this,
	            id = this.get('passenger.traveler.id');
	        //console.log(no);
	        var view = this;
	            
	        this.set('passenger.traveler', null)
	            .then(function() {
	                view.set('passenger.traveler', _.cloneDeep(traveler));
	            });
	    },
	    setdob: function(traveler) {
	        //console.log(traveler);
	        var no = _.parseInt(traveler['no']);
	        var t=no-1;
	        var view = this;
	        var dateofbirth=$("#dob_"+no).val();
	        var dob=dateofbirth.split('-');
	         this.set('passenger.traveler.birth', dob);
	    },
	    setdobsimple: function(traveler) {
	        //console.log(traveler);
	       
	            var regEx = /^\d{2}-\d{2}-\d{4}$/;
	       
	        var no = _.parseInt(traveler['no']);
	        var t=no-1;
	        var view = this;
	        var dateofbirth=$("#dob_"+no).val();
	        if(dateofbirth!=''){
	        if(dateofbirth.match(regEx) != null){
	        var dob=dateofbirth.split('-');
	        var dobb=[dob[2],dob[1],dob[0]];
	        if(_.parseInt(dob[0])>31){
	            alert("Please Put Valid Date in DD-MM-YYYY Format");
	            $("#dob_"+no).val('').focus();
	            return false;
	        }
	        if(_.parseInt(dob[1])>12){
	            alert("Please Put Valid Date in DD-MM-YYYY Format");
	            $("#dob_"+no).val('').focus();
	            return false;
	        }
	         this.set('passenger.traveler.birth', dobb);
	        }else{
	            alert("Please Put Date in DD-MM-YYYY Format");
	            $("#dob_"+no).val('').focus();
	        }
	    }
	    
	    },
	    
	
	setpassportexpiry: function(traveler) {
	        var no = _.parseInt(traveler['no']);
	        var t=no-1;       
	        var dateofped=$("#ped_"+no).val();
	        var ped=dateofped.split('-');
	        this.set('passenger.traveler.passport_expiry', ped);
	    },
	     setpassportexpirysimple: function(traveler) {
	        //console.log(traveler);
	       
	            var regEx = /^\d{2}-\d{2}-\d{4}$/;
	       
	        var no = _.parseInt(traveler['no']);
	        var t=no-1;
	        var view = this;
	        var dateofped=$("#ped_"+no).val();
	        if(dateofped!=''){
	        if(dateofped.match(regEx) != null){
	        var dob=dateofped.split('-');
	        var dobb=[dob[2],dob[1],dob[0]];
	        if(_.parseInt(dob[0])>31){
	            alert("Please Put Valid Date in DD-MM-YYYY Format");
	            $("#ped_"+no).val('').focus();
	            return false;
	        }
	        if(_.parseInt(dob[1])>12){
	            alert("Please Put Valid Date in DD-MM-YYYY Format");
	            $("#ped_"+no).val('').focus();
	            return false;
	        }
	        
	         this.set('passenger.traveler.passport_expiry', dobb);
	        }else{
	            alert("Please Put Date in DD-MM-YYYY Format");
	            $("#ped_"+no).val('').focus();
	        }
	    }
	    },
	    toglle:function(traveler){
	         var no = _.parseInt(traveler['no']);
	        
	        if (this.get('passenger.traveler.birth')!=null) {
	            if (this.get('datesupported')) {
	                var dob = this.get('passenger.traveler.birth.0') + '-' + this.get('passenger.traveler.birth.1') + '-' + this.get('passenger.traveler.birth.2');
	                $("#dob_" + no).val(dob);
	            } else {
	                var dob = this.get('passenger.traveler.birth.2') + '-' + this.get('passenger.traveler.birth.1') + '-' + this.get('passenger.traveler.birth.0');
	                $("#dob_" + no).val(dob);
	            }
	        }
	        if (this.get('passenger.traveler.passport_expiry')!=null) {
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
/* 85 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["ui segment passenger ",{"t":2,"r":"class"}]},"f":[{"t":7,"e":"div","a":{"class":"name tree fields"},"f":[{"t":7,"e":"div","a":{"class":"title field"},"f":[{"t":7,"e":"ui-select","a":{"class":"title","placeholder":"Title","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.titles()"}}],"value":[{"t":2,"r":"traveler.title_id"}],"error":[{"t":2,"r":"errors.title_id"}]}}]}," ",{"t":7,"e":"div","a":{"class":"first name field"},"f":[{"t":7,"e":"ui-input","a":{"name":"firstname","class":"firstname","placeholder":"First & Middle Name","value":[{"t":2,"r":"traveler.firstname"}],"error":[{"t":2,"r":"errors.firstname"}]}}," ",{"t":7,"e":"div","a":{"class":"ui travelers popup vertical menu"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["Pick a traveler"]},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"a","a":{"class":"item"},"v":{"click":{"m":"pickTraveler","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":2,"r":"firstname"}," ",{"t":2,"r":"lastname"}]}],"n":52,"r":"travelers"}],"n":50,"r":"travelers.length"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["New traveler?"]},{"t":7,"e":"br"}," ",{"t":7,"e":"p","f":["We will register traveler in the system for faster access."]}],"r":"travelers.length"}],"x":{"r":["search","traveler.firstname","travelers"],"s":"{travelers:_0(_1,_2)}"}}]}]}," ",{"t":7,"e":"div","a":{"class":"last name field"},"f":[{"t":7,"e":"ui-input","a":{"name":"lastname","class":"lastname","placeholder":"Lastname","value":[{"t":2,"r":"traveler.lastname"}],"error":[{"t":2,"r":"errors.lastname"}]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Date of birth",{"t":4,"f":["*"],"n":50,"x":{"r":["validation"],"s":"\"domestic\"!=_0"}}]}," ",{"t":7,"e":"div","a":{"class":"passport-expiry date three fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"day","placeholder":"Day","options":[{"t":2,"r":"date.select.D"}],"value":[{"t":2,"r":"traveler.birth.2"}],"error":[{"t":2,"r":"errors.birth"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.MMMM"}],"value":[{"t":2,"r":"traveler.birth.1"}],"error":[{"t":2,"r":"errors.birth"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"year","placeholder":"Year","options":[{"t":2,"x":{"r":["date.select","~/type_id"],"s":"_0.birthYears(_1)"}}],"value":[{"t":2,"r":"traveler.birth.0"}],"error":[{"t":2,"r":"errors.birth"}]}}]}]},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"style":"color: #3399ff; margin-top: -27px; margin-bottom: 10px; font-size: 13px;"},"f":["The date of birth can be changed later"]}],"n":50,"x":{"r":["all","validation"],"s":"_0||\"domestic\"!=_1"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Passport"]}," ",{"t":7,"e":"div","a":{"class":"passport two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-input","a":{"class":"passport-number","placeholder":"Passport Number","value":[{"t":2,"r":"traveler.passport_number"}],"error":[{"t":2,"r":"errors.passport_number"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"traveler.passport_country_id"}],"class":"passport-country","search":"1","placeholder":"Passport Country","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.countries()"}}],"error":[{"t":2,"r":"errors.passport_country_id"}]},"f":[]}]}]}," ",{"t":7,"e":"div","a":{"class":"label"},"f":["Passport expiry date"]}," ",{"t":7,"e":"div","a":{"class":"passport-expiry date three fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"day","placeholder":"Day","options":[{"t":2,"r":"date.select.D"}],"value":[{"t":2,"r":"traveler.passport_expiry.2"}],"error":[{"t":2,"r":"errors.passport_expiry"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.MMMM"}],"value":[{"t":2,"r":"traveler.passport_expiry.1"}],"error":[{"t":2,"r":"errors.passport_expiry"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.passportYears"}],"value":[{"t":2,"r":"traveler.passport_expiry.0"}],"error":[{"t":2,"r":"errors.passport_expiry"}]}}]}]}],"n":50,"r":"all"}," ",{"t":7,"e":"div","a":{"align":"center","class":"more"},"f":[{"t":7,"e":"a","a":{"class":"ui basic tiny circular button","href":"javascript:;"},"v":{"click":{"m":"toggle","a":{"r":[],"s":"[\"all\"]"}}},"f":[{"t":4,"f":["Less Info"],"n":50,"r":"all"},{"t":4,"n":51,"f":["More Info"],"r":"all"}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}],"n":50,"x":{"r":["_","errors"],"s":"_0.isArray(_1)||_0.isObject(_1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errors"}]}],"x":{"r":["_","errors"],"s":"_0.isArray(_1)||_0.isObject(_1)"}}]}],"n":50,"r":"errors"}]}],"r":"passenger"}]};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(34),
	    $ = __webpack_require__(32),
	    _ = __webpack_require__(29)
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
	    template: __webpack_require__(87),
	
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
/* 87 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field","align":"center"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui dropdown "},"v":{"click":{"m":"dropdownselect","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"default text tt"},"f":[{"t":2,"r":"placeholder"}]}," ",{"t":7,"e":"i","a":{"class":"dropdown icon"}}]}," ",{"t":7,"e":"div","a":{"class":"hide"},"f":[{"t":7,"e":"select","a":{"class":"popup","value":[{"t":2,"r":"value"}]},"f":[{"t":4,"f":[{"t":7,"e":"option","a":{"value":[{"t":2,"r":"id"}]},"f":[{"t":2,"r":"name"}]}],"r":"options"}]}]}]}],"n":50,"r":"options.length"}]};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    moment = __webpack_require__(43)
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
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    $ = __webpack_require__(32)
	    ;
	__webpack_require__(90);
	var Form = __webpack_require__(33),
	
	    h_money = __webpack_require__(67),
	    h_duration = __webpack_require__(75)(),
	    h_date = __webpack_require__(88)(),
	    accounting = __webpack_require__(68)
	    ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(91),
	
	    components: {
	        'ui-cc': __webpack_require__(92),
	        'ui-cvv': __webpack_require__(94),
	        'ui-expiry': __webpack_require__(95)
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
	                {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
	                {id: 'BOIB' , text: 'Bank of India' },
	                {id: 'BOMB', text: 'Bank of Maharashtra'},
	                {id: 'CBIB', text: 'Central Bank Of India'},
	                {id: 'CRPB', text: 'Corporation Bank'},
	                {id: 'DCBB', text: 'Development Credit Bank'},
	                {id: 'FEDB', text: 'Federal Bank'},
	                {id: 'HDFB', text: 'HDFC Bank'},
	                //{id: 'ICIB', text: 'ICICI Netbanking'},
	                {id: 'IDBB', text: 'Industrial Development Bank of India'},
	                {id: 'INDB', text: 'Indian Bank '},
	                {id: 'INIB', text: 'IndusInd Bank'},
	                {id: 'INOB', text: 'Indian Overseas Bank'},
	                {id: 'JAKB', text: 'Jammu and Kashmir Bank'},
	                {id: 'KRKB', text: 'Karnataka Bank'},
	                {id: 'KRVB', text: 'Karur Vysya '},
	                {id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
	                {id: 'SBHB', text: 'State Bank of Hyderabad'},
	                {id: 'SBIB', text: 'State Bank of India'},
	                {id: 'SBMB', text: 'State Bank of Mysore'},
	                {id: 'SBTB', text: 'State Bank of Travancore'},
	                {id: 'SOIB', text: 'South Indian Bank'},
	                {id: 'UBIB', text: 'Union Bank of India'},
	                {id: 'UNIB', text: 'United Bank Of India'},
	                {id: 'VJYB', text: 'Vijaya Bank'},
	                {id: 'YESB', text: 'Yes Bank'},
	                {id: 'CUBB', text: 'CityUnion'},
	                {id: 'CABB', text: 'Canara Bank'},
	                {id: 'SBPB', text: 'State Bank of Patiala'},
	                {id: 'CITNB', text: 'Citi Bank NetBanking'},
	                {id: 'DSHB', text: 'Deutsche Bank'},
	                {id: '162B', text: 'Kotak Bank'}
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
	                $.ajax({
	                    type: 'GET',
	                    url: '/b2c/booking/cards',
	                    data: { booking_id: this.get('booking.id') },
	                    success: function(data) {
	                        if (data.length) {
	                            view.set('cards', data);
	                            view.setCard(data[data.length - 1]);
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
	            if (this.get('booking'))
	                this.set('booking.steps.3.errors', false);
	        }, {init: false});
	        
	       
	    },
	
	
	    submit: function() { 
	        var booking = this.get('booking');
	        console.log(booking);
	//        var cardexpiry=$('#cc-exp').val();
	//        console.log(cardexpiry);
	//        if(cardexpiry !=null && cardexpiry !=''){
	//            cardarr=cardexpiry.split('/');
	//            booking.set('payment.cc.exp_month',trim(cardarr[0]));
	//            booking.set('payment.cc.exp_year',trim(cardarr[1]));
	//        }
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
	                console.log(data);
	                console.log(view.get('promovalue'));
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
	    }
	
	
	});

/***/ },
/* 90 */
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
/* 91 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["step header step3 ",{"t":4,"f":["active"],"n":50,"r":"step.active"}," ",{"t":4,"f":["completed"],"n":50,"r":"step.completed"}],"role":"tab"},"f":["Payment Details"]}," ",{"t":4,"f":[],"n":50,"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment step3 ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"step.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"div","a":{"class":"ui pointing secondary menu"},"f":[{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"1==_0"}}],"data-tab":"dummy"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",1]"}}},"f":["CREDIT CARD"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"2==_0"}}],"data-tab":"dummy"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",2]"}}},"f":["DEBIT CARD"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"3==_0"}}],"data-tab":"dummy"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"booking.payment.active\",3]"}}},"f":["NET BANKING"]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"credit-card"},"f":[{"t":7,"e":"div","a":{"class":"ui two column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"v":{"click":{"m":"resetCC","a":{"r":["event"],"s":"[_0]"}}},"f":[{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":[{"t":4,"f":["Credit"],"n":50,"x":{"r":["booking.payment.active"],"s":"1==_0"}},{"t":4,"n":51,"f":["Debit"],"x":{"r":["booking.payment.active"],"s":"1==_0"}}," Card Number ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cc","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"card-number fluid","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.number"}],"error":[{"t":2,"r":"step.errors.number"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"three expiry fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Month ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.cardMonths"}],"value":[{"t":2,"r":"cc.exp_month"}],"error":[{"t":2,"r":"step.errors.exp_month"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Year ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.cardYears"}],"value":[{"t":2,"r":"cc.exp_year"}],"error":[{"t":2,"r":"step.errors.exp_year"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["CVV No ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cvv","a":{"class":"fluid cvv","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.cvv"}],"error":[{"t":2,"r":"step.errors.cvv"}]},"v":{"click":"reset-cc"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"cvv-image"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["4 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv4-img"},"f":[" "]}],"n":50,"x":{"r":["cc.type"],"s":"\"amex\"==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","f":["3 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv3-img"},"f":[" "]}],"x":{"r":["cc.type"],"s":"\"amex\"==_0"}}]}],"n":50,"r":"cc.type"}," ",{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Card Holder's Name ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"fluid","value":[{"t":2,"r":"cc.name"}],"error":[{"t":2,"r":"step.errors.name"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"store field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"disabled":[{"t":2,"r":"cc.id"}],"type":"checkbox","checked":[{"t":2,"r":"cc.store"}]}}," Store card for future use."]}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Saved cards"]}," ",{"t":7,"e":"div","a":{"class":"ui list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"setCard","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"r":"number","s":true}]}]}],"n":52,"r":"cards"}]}]}],"n":50,"r":"cards"}]}]}]}],"n":50,"x":{"r":["active"],"s":"1==_0||2==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"Bank field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select Your Bank ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"class":"bank fluid","value":[{"t":2,"r":"netbanking.net_banking"}],"error":[{"t":2,"r":"step.errors.net_banking"}],"options":[{"t":2,"r":"banks"}]}}]}]}],"x":{"r":["active"],"s":"1==_0||2==_0"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"step.errors"}]}],"n":50,"r":"step.errors"}," ",{"t":7,"e":"div","a":{"class":"ui two column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"two fields"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Apply Promo Codes"]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code","disabled":"disabled"},"f":[]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code"},"f":[]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"removePromoCode","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"i","a":{"class":"red remove circle outline icon","alt":"Remove Promo Code","title":"Remove Promo Code"}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui basic button"},"v":{"click":{"m":"applyPromoCode","a":{"r":[],"s":"[]"}}},"f":["APPLY"]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"style":"clear:both;"},"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":{"m":"removeErrorMsg","a":{"r":[],"s":"[]"}}}}," ",{"t":2,"r":"promoerror"}]}]}],"n":50,"x":{"r":["promoerror"],"s":"_0!=null"}}]}],"n":50,"x":{"r":["booking.clientSourceId"],"s":"_0==1"}}]}]}," ",{"t":7,"e":"div","a":{"class":"note"},"f":[{"t":7,"e":"span","f":["Please Note :"]}," The charge will appear on your credit card / Account statement as 'Airtickets India Pvt Ltd'"]}," ",{"t":7,"e":"div","a":{"class":"agreement field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"accepted"}]}}," I have read and accepted the ",{"t":7,"e":"a","a":{"href":"/b2c/cms/termsAndConditions/2","target":"_blank"},"f":["Terms Of Service"]},"*"]}]}," ",{"t":7,"e":"div","a":{"class":"price"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["Convenience fee ",{"t":3,"x":{"r":["money","booking.convenienceFee","meta.display_currency"],"s":"_0(_1,_2)"}}," will be charged"]}],"n":50,"x":{"r":["booking.convenienceFee"],"s":"_0>0"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","meta.display_currency"],"s":"_0(_1+_2,_3)"}}," - ",{"t":3,"x":{"r":["money","promovalue","meta.display_currency"],"s":"_0(_1,_2)"}}," = ",{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","promovalue","meta.display_currency"],"s":"_0(_1+_2-_3,_4)"}}]}," ",{"t":7,"e":"span","f":["(",{"t":2,"r":"meta.display_currency"}," Price is indicative only. You will be charged equivalent in INR. ",{"t":3,"x":{"r":["formatPayMoney","booking.price","booking.convenienceFee","promovalue"],"s":"_0(_1+_2-_3)"}}]}],"n":50,"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","meta.display_currency"],"s":"_0(_1+_2,_3)"}}," - ",{"t":3,"x":{"r":["money","promovalue","meta.display_currency"],"s":"_0(_1,_2)"}}," = ",{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","promovalue","meta.display_currency"],"s":"_0(_1+_2-_3,_4)"}}]}," ",{"t":7,"e":"span","f":["(Total Payable Amount)"]}],"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","meta.display_currency"],"s":"_0(_1+_2,_3)"}}]}," ",{"t":7,"e":"span","a":{"class":"amtNotice"},"f":["(",{"t":2,"r":"meta.display_currency"}," Price is indicative only. You will be charged equivalent in INR. ",{"t":3,"x":{"r":["formatPayMoney","booking.price","booking.convenienceFee"],"s":"_0(_1+_2)"}},")"]}],"n":50,"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","meta.display_currency"],"s":"_0(_1+_2,_3)"}}]}," ",{"t":7,"e":"span","f":["(Total Payable Amount)"]}],"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}," ",{"t":7,"e":"div","a":{"class":"verified"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/vbv_250.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/mastercard_securecode.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/AMEX_SafeKey_180x99px.png"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/pci-dss-compliant.jpg"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/SSL-security-seal.png"}}]}]}," ",{"t":7,"e":"button","a":{"type":"submit","class":["ui wizard button massive ",{"t":4,"f":["green"],"n":50,"r":"accepted"},{"t":4,"n":51,"f":["red"],"r":"accepted"}]},"m":[{"t":4,"f":["disabled=\"disabled\""],"n":51,"r":"accepted"}],"f":["BOOK FLIGHT"]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["step.active","step.completed"],"s":"!_0&&_1"}}],"n":51,"r":"step.completed"}],"x":{"r":["booking.steps.3","booking.payment.cc","booking.payment.netbanking","booking.payment.active"],"s":"{step:_0,cc:_1,netbanking:_2,active:_3}"}}]};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(90);
	
	var Input = __webpack_require__(36),
	    $ = __webpack_require__(32);
	
	module.exports = Input.extend({
	    template: __webpack_require__(93),
	
	    oncomplete: function() {
	        this._super();
	
	        $(this.find('input')).payment('formatCardNumber');
	
	        this.observe('value', function(value) {
	            this.set('cctype', $.payment.cardType(value));
	        }, {init: false});
	    },
	
	    onteadown: function() {
	        $(this.find('input')).payment('destroy');
	    }
	});

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui input ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"input","a":{"type":[{"t":4,"f":["text"],"n":50,"r":"disabled"},{"t":4,"n":51,"f":["tel"],"r":"disabled"}],"name":[{"t":2,"r":"name"}],"value":[{"t":2,"r":"value"}]},"m":[{"t":4,"f":["placeholder=\"",{"t":2,"r":"placeholder"},"\""],"n":51,"r":"large"},{"t":4,"f":["disabled"],"n":50,"r":"disabled"},{"t":4,"f":["disabled=\"disabled\""],"n":50,"x":{"r":["state.disabled","state.submitting"],"s":"_0||_1"}}]}," ",{"t":4,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":["cardType ",{"t":2,"r":"cctype"}]},"f":[{"t":2,"r":"cctype"}]}]}],"n":50,"r":"cctype"},{"t":4,"n":51,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":"cardType visa"},"f":["Visa"]}," ",{"t":7,"e":"li","a":{"class":"cardType master"},"f":["Mastercard"]}," ",{"t":7,"e":"li","a":{"class":"cardType amex"},"f":["American Express"]}," ",{"t":7,"e":"li","a":{"class":"cardType diners"},"f":["Diners"]}]}],"r":"cctype"}]}]};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(90);
	
	var Input = __webpack_require__(36),
	    $ = __webpack_require__(32);
	
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
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(90);
	
	var Input = __webpack_require__(36),
	         _ = __webpack_require__(29),
	    $ = __webpack_require__(32);
	
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
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29)
	    ;
	
	var Form = __webpack_require__(33),
	
	    h_money = __webpack_require__(67)(),
	    h_duration = __webpack_require__(75)(),
	    h_date = __webpack_require__(88)()
	    ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(97),
	    back: function() {
	        this.get('booking').activate(3);
	    },
	        
	   });

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"step header step4 active","role":"tab"},"f":["Booking"]}," ",{"t":7,"e":"form","a":{"action":"javascript:;","class":"ui form segment step4","style":"height: 400px; text-align: center;"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"booking-id"},"f":["Booking ID: ",{"t":2,"r":"booking.aircart_id"}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["We have received your Payment and your Booking is in process, our customer support team will contact you shortly. Or Call our customer support team for more detail."]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"booking.aircart_id"}]},"f":["View your ticket"]}],"n":50,"x":{"r":["booking","booking.aircart_status"],"s":"_0.isNew(_1)"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["Your Booking is Successful!"]}],"n":50,"x":{"r":["booking","booking.aircart_status"],"s":"_0.isBooked(_1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["Your Booking is in process!"]}],"x":{"r":["booking","booking.aircart_status"],"s":"_0.isBooked(_1)"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"booking.aircart_id"}]},"f":["View your ticket"]}],"x":{"r":["booking","booking.aircart_status"],"s":"_0.isNew(_1)"}}],"n":50,"r":"step.completed"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"ui text loader"},"f":["Your booking is in progress."]}]}],"r":"step.completed"}]}],"n":50,"r":"step.active"}],"x":{"r":["booking.steps.4"],"s":"{step:_0}"}}]};

/***/ },
/* 98 */,
/* 99 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL2Jvb2tpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL2ZsaWdodC9ib29raW5nLmpzIiwid2VicGFjazovLy8uL2pzL2NvcmUvdmlldy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvZmxpZ2h0L2luZGV4LmpzIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9mbGlnaHQvc2VhcmNoLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9yb3V0ZXMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215cHJvZmlsZS9tZXRhLmpzIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teWJvb2tpbmdzL21ldGEuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215dHJhdmVsbGVyL21ldGEuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215cHJvZmlsZS9teXByb2ZpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9hbWQtZGVmaW5lLmpzIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZy5odG1sIiwid2VicGFjazovLy8uL2pzL2hlbHBlcnMvbW9uZXkuanMiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL2FjY291bnRpbmcuanMvYWNjb3VudGluZy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2luZGV4Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9hcHAvYXV0aC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvYXBwL2F1dGguaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9oZWxwZXJzL2R1cmF0aW9uLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvaXRpbmVyYXJ5LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2l0aW5lcmFyeS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jb2RlLmpzIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9lbWFpbC5qcyIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvbWFpbGNoZWNrL3NyYy9tYWlsY2hlY2suanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMi5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvcGFzc2VuZ2VyLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9wYXNzZW5nZXIuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vbW9iaWxlc2VsZWN0LmpzIiwid2VicGFjazovLy8uL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vbW9iaWxlc2VsZWN0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvaGVscGVycy9kYXRlLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXAzLmpzIiwid2VicGFjazovLy8uL3ZlbmRvci9qcXVlcnkucGF5bWVudC9saWIvanF1ZXJ5LnBheW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5odG1sIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jYy9udW1iZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9jYy5odG1sIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jYy9jdnYuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2NjL2NhcmRleHBpcnkuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwNC5odG1sIiwid2VicGFjazovLy8uL2xlc3Mvd2ViL21vZHVsZXMvYm9va2luZy5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7OztBQ1REOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGlEO0FBQ0EsY0FBYTtBQUNiLE1BQUs7QUFDTDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVB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QUFFLEc7Ozs7Ozs7QUNBOWU7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHOzs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBNkIsT0FBTztBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNHQUFxRyxFQUFFO0FBQ3ZHOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQXlDLFdBQVc7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBa0MsSUFBSSxXQUFXLElBQUk7QUFDckQ7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsRUFBQyxFOzs7Ozs7QUMvQ0Q7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUwsS0FBSSxFOzs7Ozs7QUNwQkosaUJBQWdCLFlBQVksWUFBWSxZQUFZLHFCQUFxQixnREFBZ0QsaUJBQWlCLE1BQU0sc0JBQXNCLHNCQUFzQix5REFBeUQsb0JBQW9CLEVBQUUsT0FBTyxZQUFZLHFCQUFxQixxQkFBcUIsc0JBQXNCLCtCQUErQixFQUFFLE1BQU0sWUFBWSxxQkFBcUIsa0JBQWtCLDhLQUE4SyxNQUFNLGVBQWUsTUFBTSxtQkFBbUIsb0NBQW9DLCtCQUErQixFQUFFLDBCQUEwQixjQUFjLDZEQUE2RCxFQUFFLG1CQUFtQixZQUFZLHFCQUFxQixrQkFBa0IscUNBQXFDLGNBQWMsZ0VBQWdFLEVBQUUsbUJBQW1CLHFCQUFxQixrQkFBa0IscUNBQXFDLE9BQU8sZ0VBQWdFLE1BQU0sZUFBZSxNQUFNLG1CQUFtQixvQ0FBb0MsK0JBQStCLEVBQUUsMEJBQTBCLE9BQU8sNkRBQTZELDhCQUE4QixFQUFFLG1CQUFtQixxQkFBcUIsb0NBQW9DLE9BQU8scUJBQXFCLHlCQUF5QixzQ0FBc0MsRUFBRSx1QkFBdUIsRUFBRSwyQkFBMkIsT0FBTyw4QkFBOEIsUUFBUSxHQUFHLEc7Ozs7Ozs7QUNBL3BELDBDIiwiZmlsZSI6ImpzL2Jvb2tpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQm9va2luZyA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nJylcclxuICAgIDtcclxuXHJcbnJlcXVpcmUoJ3dlYi9tb2R1bGVzL2Jvb2tpbmcubGVzcycpO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAgIChuZXcgQm9va2luZygpKS5yZW5kZXIoJyNhcHAnKTtcclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvYm9va2luZy5qc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlLmpzJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBCb29raW5nID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9ib29raW5nJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9pbmRleC5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIGxheW91dDogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvbGF5b3V0JyksXHJcbiAgICAgICAgc3RlcDE6IHJlcXVpcmUoJy4vc3RlcDEnKSxcclxuICAgICAgICBzdGVwMjogcmVxdWlyZSgnLi9zdGVwMicpLFxyXG4gICAgICAgIHN0ZXAzOiByZXF1aXJlKCcuL3N0ZXAzJyksXHJcbiAgICAgICAgc3RlcDQ6IHJlcXVpcmUoJy4vc3RlcDQnKVxyXG4gICAgfSxcclxuXHJcbiAgICBwYXJ0aWFsczoge1xyXG4gICAgICAgICdiYXNlLXBhbmVsJzogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9sYXlvdXQvcGFuZWwuaHRtbCcpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1ldGE6IE1ldGEub2JqZWN0XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIEJvb2tpbmcuZmV0Y2godGhpcy5nZXQoJ2lkJykpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChib29raW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldCgnYm9va2luZycsIGJvb2tpbmcpOyBcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCgnLnVpLmRyb3Bkb3duLmN1cnJlbmN5JykuaGlkZSgpO1xyXG4gICAgICAgdGhpcy5vYnNlcnZlKCdib29raW5nLmN1cnJlbmN5JywgZnVuY3Rpb24oY3VyKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBjdXI9dGhpcy5nZXQoJ2Jvb2tpbmcuY3VycmVuY3knKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3VyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdib29raW5nLmN1cnJlbmN5JyxjdXIgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdtZXRhLmRpc3BsYXlfY3VycmVuY3knLGN1ciApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgnbWV0YScpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5nZXQoJ21ldGEnKSk7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgfSxcclxuICAgIG9udGVhcmRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zaG93UGFuZWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGJhY2s6IGZ1bmN0aW9uKGZvcmNlKSB7XHJcbiAgICAgICAgZm9yY2UgPSBmb3JjZSB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9ICcvYjJjL2ZsaWdodHMnICsgdGhpcy5nZXQoJ2Jvb2tpbmcuc2VhcmNodXJsJyksXHJcbiAgICAgICAgICAgIGNzID0gdGhpcy5nZXQoJ2Jvb2tpbmcuY2xpZW50U291cmNlSWQnKSxcclxuICAgICAgICAgICAgcGFyYW1zID0gW107XHJcblxyXG4gICAgICAgIGlmIChjcyAmJiBjcyA+IDEpIHtcclxuICAgICAgICAgICAgcGFyYW1zLnB1c2goJ2NzPScgKyBjcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZm9yY2UpIHtcclxuICAgICAgICAgICAgcGFyYW1zLnB1c2goJ2ZvcmNlPTEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBwYXJhbXMuam9pbignJicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFnZSh1cmwpO1xyXG4gICAgfSxcclxuXHJcbiAgICBiYWNrMjogZnVuY3Rpb24oKSB7IHRoaXMuYmFjayh0cnVlKTsgfSxcclxuICAgIHNldEN1cnJlbmN5Qm9va2luZzogZnVuY3Rpb24oKSB7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjb2RlPSQoJyNjdXJyZW5jeTEnKS52YWwoKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvZGUpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdib29raW5nLmN1cnJlbmN5JywgY29kZSk7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmdldCgnYm9va2luZy5jdXJyZW5jeScpKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgnYm9va2luZy5jdXJyZW5jeScpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlJylcclxuICAgIDtcclxuXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3JyksXHJcbiAgICBGbGlnaHQgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0JyksXHJcbiAgICBEaWFsb2cgPSByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9kaWFsb2cnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxudmFyIG1vbmV5ID0gcmVxdWlyZSgnaGVscGVycy9tb25leScpO1xyXG5cclxuXHJcbnZhciBzdGVwID0ge1xyXG4gICAgc3VibWl0OiBmdW5jdGlvbiAodmlldywgaSkge1xyXG4gICAgICAgIHZpZXcuc2V0KCdzdGVwcy4nICsgaSArICcuc3VibWl0dGluZycsIHRydWUpO1xyXG4gICAgICAgIHZpZXcuc2V0KCdzdGVwcy4nICsgaSArICcuZXJyb3JzJywge30pO1xyXG4gICAgfSxcclxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAodmlldywgaSkge1xyXG4gICAgICAgIHZpZXcuc2V0KCdzdGVwcy4nICsgaSArICcuc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgIH0sXHJcbiAgICBlcnJvcjogZnVuY3Rpb24gKHZpZXcsIGksIHhocikge1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKDMgPT0gcmVzcG9uc2UuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9yJywgcmVzcG9uc2UubWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoNCA9PSByZXNwb25zZS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBEaWFsb2cub3Blbih7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiAnUGF5bWVudCBGYWlsZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlc3BvbnNlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbJ1RyeSBBZ2FpbicsIGZ1bmN0aW9uKCkgeyB9XVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKDUgPT0gcmVzcG9uc2UuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgRGlhbG9nLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjogJ1ByaWNlIENoYW5nZSBBbGVydCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj5Tb3JyeSEgVGhlIHByaWNlIGZvciB5b3VyIGJvb2tpbmcgaGFzIGluY3JlYXNlZCBieSA8YnI+JyArIG1vbmV5KHJlc3BvbnNlLmVycm9ycy5wcmljZURpZmYsIG1ldGEuZ2V0KCdkaXNwbGF5X2N1cnJlbmN5JykgKyAnPC9kaXY+JyksXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWVzc2FnZTogJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj5Tb3JyeSEgVGhlIHByaWNlIGZvciB5b3VyIGJvb2tpbmcgaGFzIGluY3JlYXNlZCAhPGJyPiBOZXcgcHJpY2UgaXMgJyArIG1vbmV5KHJlc3BvbnNlLmVycm9ycy5wcmljZSwgbWV0YS5nZXQoJ2Rpc3BsYXlfY3VycmVuY3knKSArICc8L2Rpdj4nKSxcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFsnQmFjayB0byBTZWFyY2gnLCBmdW5jdGlvbigpIHsgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9mbGlnaHRzJyArIHZpZXcuZ2V0KCdzZWFyY2h1cmwnKSArICc/Zm9yY2UnOyB9XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgWydDb250aW51ZScsIGZ1bmN0aW9uKCkgeyB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2Jvb2tpbmcvJyArIHZpZXcuZ2V0KCdpZCcpICsgJz9fPScgKyBfLm5vdygpIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RlcHMuJyArIGkgKyAnLmVycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGVwcy4nICsgaSArICcuZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB2aWV3LnNldCgnc3RlcHMuJyArIGkgKyAnLmVycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbnZhciBkb1BheSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB2YXIgZm9ybTtcclxuICAgIGZvcm0gPSAkKCc8Zm9ybSAvPicsIHtcclxuICAgICAgICBpZDogJ3RtcEZvcm0nLFxyXG4gICAgICAgIGFjdGlvbjogZGF0YS51cmwsXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgc3R5bGU6ICdkaXNwbGF5OiBub25lOydcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBpbnB1dCA9IGRhdGEuZGF0YTtcclxuICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICd1bmRlZmluZWQnICYmIGlucHV0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgJC5lYWNoKGlucHV0LCBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAkKCc8aW5wdXQgLz4nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKGZvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybS5hcHBlbmRUbygnYm9keScpLnN1Ym1pdCgpO1xyXG59O1xyXG5cclxudmFyIG1ldGEgPSBudWxsO1xyXG52YXIgQm9va2luZyA9IFZpZXcuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpc0Jvb2tlZDogZnVuY3Rpb24gKGJzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnMgPT0gOCB8fCBicyA9PSA5IHx8IGJzID09IDEwIHx8IGJzID09IDExO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpblByb2Nlc3M6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEoYnMgPT0gOCB8fCBicyA9PSA5IHx8IGJzID09IDEwIHx8IGJzID09IDExKSAmJiAhKGJzID09IDEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpc05ldzogZnVuY3Rpb24gKGJzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMSA9PSBicztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICBwcmljZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5yZWR1Y2UodGhpcy5nZXQoJ2ZsaWdodHMnKSwgZnVuY3Rpb24gKHJlc3VsdCwgaSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCArIGkuZ2V0KCdwcmljZScpO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3N0ZXBzLjQuYWN0aXZlJykgJiYgIXRoaXMuZ2V0KCdib29raW5nLmFpcmNhcnRfaWQnKSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0ZXA0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3BheW1lbnQuZXJyb3InKSkge1xyXG4gICAgICAgICAgICBEaWFsb2cub3Blbih7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6ICdQYXltZW50IEZhaWxlZCcsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmdldCgncGF5bWVudC5lcnJvcicpLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgIFsnVHJ5IEFnYWluJywgZnVuY3Rpb24oKSB7IH1dXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTWV0YS5pbnN0YW5jZSgpLnRoZW4oZnVuY3Rpb24oaSkgeyBtZXRhID0gaTsgfSk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICB0aGlzLnNldCgnc3RlcHMuKi5hY3RpdmUnLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N0ZXBzLicgKyBpICsgJy5hY3RpdmUnLCB0cnVlKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZygnc3RlcHMuJyArIGkgKyAnLmFjdGl2ZScpO1xyXG4gICAgfSxcclxuICAgIHN0ZXAxOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcblxyXG4gICAgICAgIHN0ZXAuc3VibWl0KHRoaXMsIDEpO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiA2MDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvc3RlcDEnLFxyXG4gICAgICAgICAgICBkYXRhOiB7aWQ6IHRoaXMuZ2V0KCdpZCcpLCB1c2VyOiB0aGlzLmdldCgndXNlcicpfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXAuY29tcGxldGUodmlldywgMSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3VzZXIuaWQnLCBkYXRhLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndXNlci5sb2dnZWRfaW4nLCBkYXRhLmxvZ2dlZF9pbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvbnZlbmllbmNlRmVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjb252ZW5pZW5jZUZlZScsIGRhdGEuY29udmVuaWVuY2VGZWUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RlcHMuMS5jb21wbGV0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmFjdGl2YXRlKDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgc3RlcC5lcnJvcih2aWV3LCAxLCB4aHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH0sXHJcbiAgICBzdGVwMjogZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgc3RlcC5zdWJtaXQodGhpcywgMik7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9zdGVwMicsXHJcbiAgICAgICAgICAgIGRhdGE6IHtpZDogdGhpcy5nZXQoJ2lkJyksIGNoZWNrOiBvICYmIG8uY2hlY2sgPyAxIDogMCwgcGFzc2VuZ2VyczogdGhpcy5nZXQoJ3Bhc3NlbmdlcnMnKSwgJ3NjZW5hcmlvJzogdGhpcy5nZXQoJ3Bhc3NlbmdlclZhbGlkYXRvbicpfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXAuY29tcGxldGUodmlldywgMik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobyAmJiBvLmNoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpZCwgaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGFzc2VuZ2Vycy4nICsgayArICcudHJhdmVsZXIuaWQnLCBpZClcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RlcHMuMi5jb21wbGV0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmFjdGl2YXRlKDMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2aWV3LmdldCgnbW9iaWxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RlcHMuMi5jb21wbGV0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmFjdGl2YXRlKDMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmlldy5nZXQoKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLmVycm9yKHZpZXcsIDIsIHhocik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfSxcclxuICAgIHN0ZXAzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBRLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBkYXRhID0ge2lkOiB0aGlzLmdldCgnaWQnKX07XHJcblxyXG4gICAgICAgIHN0ZXAuc3VibWl0KHRoaXMsIDMpO1xyXG5cclxuICAgICAgICBpZiAoMyA9PSB0aGlzLmdldCgncGF5bWVudC5hY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBkYXRhLm5ldGJhbmtpbmcgPSB0aGlzLmdldCgncGF5bWVudC5uZXRiYW5raW5nJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YS5jYyA9IHRoaXMuZ2V0KCdwYXltZW50LmNjJyk7XHJcbiAgICAgICAgICAgIGRhdGEuY2Muc3RvcmUgPSBkYXRhLmNjLnN0b3JlID8gMSA6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiA2MDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvc3RlcDMnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvUGF5KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgc3RlcC5jb21wbGV0ZSh2aWV3LCAzKTtcclxuICAgICAgICAgICAgICAgIHN0ZXAuZXJyb3IodmlldywgMywgeGhyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9LFxyXG4gICAgc3RlcDQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IFEuZGVmZXIoKSxcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB7aWQ6IHRoaXMuZ2V0KCdpZCcpfTtcclxuXHJcblxyXG4gICAgICAgICQuYWpheCh7ICAgICAgICAgIFxyXG4gICAgICAgICAgIC8vIHRpbWVvdXQ6IDIwMDAwLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9zdGVwNCcsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvL3N0ZXAuY29tcGxldGUodmlldywgNCk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYWlyY2FydF9pZCcsIGRhdGEuYWlyY2FydF9pZCk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYWlyY2FydF9zdGF0dXMnLCBkYXRhLmFpcmNhcnRfc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGVwcy40LmNvbXBsZXRlZCcsIHRydWUpO1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codmlldy5nZXQoJ3VzZXIuZW1haWwnKSk7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnL2IyYy9haXJDYXJ0L3NlbmRFbWFpbC8nICsgdmlldy5nZXQoJ2FpcmNhcnRfaWQnKSk7XHJcbi8vICAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4vLyAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L3NlbmRFbWFpbC8nICsgcGFyc2VJbnQodmlldy5nZXQoJ2FpcmNhcnRfaWQnKSksXHJcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiB7ZW1haWw6IHZpZXcuZ2V0KCd1c2VyLmVtYWlsJyksIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuLy9cclxuLy8gICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuLy9cclxuLy8gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL2lmICh2aWV3LmlzQm9va2VkKGRhdGEuYWlyY2FydF9zdGF0dXMpIHx8IHZpZXcuaXNQcm9jZXNzKGRhdGEuYWlyY2FydF9zdGF0dXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzLycgKyB2aWV3LmdldCgnYWlyY2FydF9pZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyKTsgXHJcbi8vICAgICAgICAgICAgICAgICBpZih4aHIuc3RhdHVzVGV4dD09PSd0aW1lb3V0Jyl7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codmlldy5nZXQoKSk7XHJcbi8vICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgc3RlcC5lcnJvcih2aWV3LCA0LCB4aHIpO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH0sXHJcbiAgICBpc0Jvb2tlZDogZnVuY3Rpb24gKGJzKSB7XHJcbiAgICAgICAgcmV0dXJuIGJzID09IDggfHwgYnMgPT0gOSB8fCBicyA9PSAxMCB8fCBicyA9PSAxMTtcclxuICAgIH0sXHJcbiAgICBpblByb2Nlc3M6IGZ1bmN0aW9uIChicikge1xyXG4gICAgICAgIHJldHVybiAhKGJzID09IDggfHwgYnMgPT0gOSB8fCBicyA9PSAxMCB8fCBicyA9PSAxMSkgJiYgIShicyA9PSAxKTtcclxuICAgIH0sXHJcbiAgICBpc05ldzogZnVuY3Rpb24gKGJyKSB7XHJcbiAgICAgICAgcmV0dXJuIDEgPT0gYnM7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbkJvb2tpbmcucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIGFjdGl2ZSA9IDE7XHJcblxyXG4gICAgaWYgKE1PQklMRSkge1xyXG4gICAgICAgIC8vaWYgKGRhdGEudXNlci5tb2JpbGUpIHtcclxuICAgICAgICAvLyAgICBkYXRhLnVzZXIubW9iaWxlID0gZGF0YS51c2VyLmNvdW50cnkgKyBkYXRhLnVzZXIubW9iaWxlO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICBkYXRhLnBheW1lbnQuYWN0aXZlID0gLTE7XHJcblxyXG4gICAgICAgIGlmICghZGF0YS51c2VyLmVtYWlsICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UgJiYgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29raW5nX2VtYWlsJykpIHtcclxuICAgICAgICAgICAgZGF0YS51c2VyLmVtYWlsID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29raW5nX2VtYWlsJyk7XHJcbiAgICAgICAgICAgIGRhdGEudXNlci5jb3VudHJ5ID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29raW5nX2NvdW50cnknKTtcclxuICAgICAgICAgICAgZGF0YS51c2VyLm1vYmlsZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va2luZ19tb2JpbGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICByZXR1cm4gRmxpZ2h0LnBhcnNlKGkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGRhdGEudXNlciAmJiBkYXRhLnVzZXIuaWQpIHtcclxuICAgICAgICBkYXRhLnN0ZXBzWzFdLmNvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgZGF0YS5zdGVwc1sxXS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBhY3RpdmUgPSAyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnBhc3NlbmdlcnNbMF0udHJhdmVsZXIuaWQpIHtcclxuICAgICAgICBkYXRhLnN0ZXBzWzJdLmNvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgZGF0YS5zdGVwc1syXS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBhY3RpdmUgPSAzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnBheW1lbnQucGF5bWVudF9pZCkge1xyXG4gICAgICAgIGRhdGEuc3RlcHNbM10uY29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICBkYXRhLnN0ZXBzWzNdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIGFjdGl2ZSA9IDQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEuYWlyY2FydF9pZCkge1xyXG4gICAgICAgIGRhdGEuc3RlcHNbNF0uY29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICBhY3RpdmUgPSA0O1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuc3RlcHNbYWN0aXZlXS5hY3RpdmUgPSB0cnVlOyAgIFxyXG4gICAgIGNvbnNvbGUubG9nKCdib29raW5nIGRhdGEnKTtcclxuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgcmV0dXJuIG5ldyBCb29raW5nKHtkYXRhOiBkYXRhfSk7XHJcblxyXG59O1xyXG5cclxuQm9va2luZy5mZXRjaCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL2Jvb2tpbmcvJyArIF8ucGFyc2VJbnQoaWQpKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEJvb2tpbmcucGFyc2UoZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuQm9va2luZy5jcmVhdGUgPSBmdW5jdGlvbiAoZmxpZ2h0cywgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcnLFxyXG4gICAgICAgICAgICBkYXRhOiBfLmV4dGVuZCh7ZmxpZ2h0czogZmxpZ2h0c30sIG9wdGlvbnMgfHwge30pLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShCb29raW5nLnBhcnNlKGRhdGEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Cb29raW5nLm9wZW4gPSBmdW5jdGlvbiAoZmxpZ2h0cywgb3B0aW9ucykge1xyXG4gICAgQm9va2luZy5jcmVhdGUoZmxpZ2h0cywgb3B0aW9ucylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGJvb2tpbmcpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYm9va2luZy8nICsgYm9va2luZy5nZXQoJ2lkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb29raW5nO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvZmxpZ2h0L2Jvb2tpbmcuanNcbiAqKiBtb2R1bGUgaWQgPSA1MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50LmV4dGVuZCh7XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS92aWV3LmpzXG4gKiogbW9kdWxlIGlkID0gNTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKVxyXG4gICAgO1xyXG5cclxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpLFxyXG4gICAgU2VhcmNoID0gcmVxdWlyZSgnLi9zZWFyY2gnKSxcclxuICAgIFJPVVRFUyA9IHJlcXVpcmUoJ2FwcC9yb3V0ZXMnKS5mbGlnaHRzXHJcbiAgICA7XHJcblxyXG52YXIgRmxpZ2h0ID0gU3RvcmUuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBbXSxcclxuICAgICAgICAgICAgcHJpY2U6IG51bGwsXHJcbiAgICAgICAgICAgIHJlZnVuZGFibGU6IDAsXHJcblxyXG5cclxuICAgICAgICAgICAgZmlyc3Q6IGZ1bmN0aW9uKHNlZ21lbnRzKSB7IHJldHVybiBzZWdtZW50c1swXTsgfSxcclxuICAgICAgICAgICAgbGFzdDogZnVuY3Rpb24oc2VnbWVudHMpIHsgcmV0dXJuIHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aC0xXTsgfSxcclxuICAgICAgICAgICAgc3RvcHM6IGZ1bmN0aW9uKHNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VnbWVudHMubGVuZ3RoLTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlZ3RpbWU6IGZ1bmN0aW9uKHNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNlZ21lbnRzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0aW1lID0gbW9tZW50LmR1cmF0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5lYWNoKHNlZ21lbnRzLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZS5hZGQoaS50aW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lLmFkZChpLmxheW92ZXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRpbWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB2aWE6IGZ1bmN0aW9uKHNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNlZ21lbnRzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHNlZ21lbnRzLnNsaWNlKDEpLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpLmZyb207XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIGRlcGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgnc2VnbWVudHMuMC4wLmRlcGFydCcpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFycml2ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgnc2VnbWVudHMuMC4nICsgKHRoaXMuZ2V0KCdzZWdtZW50cy4wLmxlbmd0aCcpIC0gMSkgKyAnLmFycml2ZScpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGl0aW5lcmFyeTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5nZXQoJ3NlZ21lbnRzLjAnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBbc1swXS5mcm9tLmFpcnBvcnRDb2RlLCBzW3MubGVuZ3RoLTFdLnRvLmFpcnBvcnRDb2RlXS5qb2luKCctJyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2FycmllcnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gXy51bmlxdWUoXHJcbiAgICAgICAgICAgICAgICBfLnVuaW9uLmFwcGx5KG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXy5tYXAodGhpcy5nZXQoJ3NlZ21lbnRzJyksIGZ1bmN0aW9uKHNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChzZWdtZW50cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS5jYXJyaWVyOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICdjb2RlJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG5GbGlnaHQucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICBkYXRhLmlkID0gXy51bmlxdWVJZCgnZmxpZ2h0XycpO1xyXG4gICAgZGF0YS50aW1lID0gbW9tZW50LmR1cmF0aW9uKCk7XHJcbiAgICBkYXRhLnNlZ21lbnRzID0gXy5tYXAoZGF0YS5zZWdtZW50cywgZnVuY3Rpb24oc2VnbWVudHMpIHtcclxuICAgICAgICByZXR1cm4gXy5tYXAoc2VnbWVudHMsIGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgdmFyIHNlZ21lbnQgPSBfLmV4dGVuZChpLCB7XHJcbiAgICAgICAgICAgICAgICBkZXBhcnQ6IG1vbWVudChpLmRlcGFydCksXHJcbiAgICAgICAgICAgICAgICBhcnJpdmU6IG1vbWVudChpLmFycml2ZSksXHJcbiAgICAgICAgICAgICAgICB0aW1lOiBtb21lbnQuZHVyYXRpb24oaS50aW1lKSxcclxuICAgICAgICAgICAgICAgIGxheW92ZXI6IG1vbWVudC5kdXJhdGlvbihpLmxheW92ZXIpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGF0YS50aW1lID0gZGF0YS50aW1lLmFkZChzZWdtZW50LnRpbWUpLmFkZChzZWdtZW50LmxheW92ZXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gbmV3IEZsaWdodCh7ZGF0YTogZGF0YX0pO1xyXG59O1xyXG5cclxuRmxpZ2h0LmZldGNoID0gZnVuY3Rpb24oc2VhcmNoLCBkZWZlcnJlZCkge1xyXG4gICAgZGVmZXJyZWQgPSBkZWZlcnJlZCB8fCBRLmRlZmVyKCk7XHJcblxyXG5cclxuICAgIGlmICghZGVmZXJyZWQuc3RhcnRlZCkge1xyXG4gICAgICAgIGRlZmVycmVkLnN0YXJ0ZWQgPSBfLm5vdygpO1xyXG4gICAgICAgIGRlZmVycmVkLnVwZGF0ZWQgPSBudWxsO1xyXG4gICAgICAgIGRlZmVycmVkLmZsaWdodHMgPSBTZWFyY2guUk9VTkRUUklQID09IF8ucGFyc2VJbnQoc2VhcmNoLmdldCgndHJpcFR5cGUnKSkgPyBbW10sIFtdXSA6IF8ubWFwKHNlYXJjaC5nZXQoJ2ZsaWdodHMnKSwgZnVuY3Rpb24oKSB7IHJldHVybiBbXTsgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjb25zdHJ1Y3RlZCBmbGlnaHRzJywgZGVmZXJyZWQuZmxpZ2h0cywgc2VhcmNoLmdldCgnZmxpZ2h0cycpKTtcclxuICAgIH0gZWxzZSBpZiAoXy5ub3coKSAtIGRlZmVycmVkLnN0YXJ0ZWQgPiBTZWFyY2guTUFYX1dBSVRfVElNRSkge1xyXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoeyBzZWFyY2g6IHNlYXJjaCwgZmxpZ2h0czogZGVmZXJyZWQuZmxpZ2h0c30pO1xyXG4gICAgfVxyXG5cclxuICAgICQuYWpheCh7XHJcbiAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgdXJsOiBST1VURVMuc2VhcmNoLFxyXG4gICAgICAgIGRhdGE6IHsgaWRzOiBzZWFyY2guZ2V0KCdpZHMnKSwgb3B0aW9uczogc2VhcmNoLnRvSlNPTigpLCB1cGRhdGVkOiBkZWZlcnJlZC51cGRhdGVkIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Jlc3BvbnNlIHRpbWUnLCBfLm5vdygpIC0gdGltZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBmbGlnaHRzID0gXy5tYXAoZGF0YS5mbGlnaHRzLCBmdW5jdGlvbihmbGlnaHRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoZmxpZ2h0cywgZnVuY3Rpb24oZmxpZ2h0KSB7IHJldHVybiBGbGlnaHQucGFyc2UoZmxpZ2h0KSB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkZWZlcnJlZC5ub3RpZnkoeyBzZWFyY2g6IHNlYXJjaCwgZGVmZXJyZWQ6IGRlZmVycmVkLCBmbGlnaHRzOiBmbGlnaHRzfSk7XHJcblxyXG4gICAgICAgICAgICBfLmVhY2goZGVmZXJyZWQuZmxpZ2h0cywgZnVuY3Rpb24odiwgaykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZsaWdodHNba10pXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQuZmxpZ2h0c1trXSA9IF8udW5pb24odiwgZmxpZ2h0c1trXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhLnBlbmRpbmcpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnVwZGF0ZWQgPSBkYXRhLnVwZGF0ZWQ7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBGbGlnaHQuZmV0Y2goc2VhcmNoLCBkZWZlcnJlZCk7IH0sIFNlYXJjaC5JTlRFUlZBTCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHsgc2VhcmNoOiBzZWFyY2gsIGZsaWdodHM6IGRlZmVycmVkLmZsaWdodHMsIHByaWNlczogZGF0YS5wcmljZXMgfHwgbnVsbH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZsaWdodDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL2ZsaWdodC9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuICAgIDtcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxyXG4gICAgO1xyXG5cclxudmFyIFJPVVRFUyA9IHJlcXVpcmUoJ2FwcC9yb3V0ZXMnKS5mbGlnaHRzO1xyXG5cclxudmFyIFNlYXJjaCA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkb21lc3RpYzogMSxcclxuICAgICAgICAgICAgdHJpcFR5cGU6IFNlYXJjaC5PTkVXQVksXHJcbiAgICAgICAgICAgIGNhYmluVHlwZTogU2VhcmNoLkVDT05PTVksXHJcbiAgICAgICAgICAgIGZsaWdodHM6IFsgeyBmcm9tOiBTZWFyY2guREVMLCB0bzogU2VhcmNoLkJPTSwgZGVwYXJ0X2F0OiBtb21lbnQoKS5hZGQoMSwgJ2RheScpLCByZXR1cm5fYXQ6IG51bGwgfSBdLFxyXG5cclxuICAgICAgICAgICAgcGFzc2VuZ2VyczogWzEsIDAsIDBdLFxyXG5cclxuICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ2RvbWVzdGljJywgZnVuY3Rpb24oZG9tZXN0aWMpIHtcclxuICAgICAgICAgICAgaWYgKCFkb21lc3RpYyAmJiBTZWFyY2guTVVMVElDSVRZID09IHRoaXMuZ2V0KCd0cmlwVHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgndHJpcFR5cGUnLCBTZWFyY2guT05FV0FZKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRvbWVzdGljKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIFt7IGZyb206IFNlYXJjaC5ERUwsIHRvOiBTZWFyY2guQk9NLCBkZXBhcnRfYXQ6IG1vbWVudCgpLmFkZCgxLCAnZGF5JykgfV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2ZsaWdodHMnLCBbeyBmcm9tOiBudWxsLCB0bzogbnVsbCwgZGVwYXJ0X2F0OiBtb21lbnQoKS5hZGQoMSwgJ2RheScpIH1dKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7IGluaXQ6IGZhbHNlIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm9ic2VydmUoJ3RyaXBUeXBlJywgZnVuY3Rpb24odmFsdWUsIG9sZCkge1xyXG4gICAgICAgICAgICBpZiAoU2VhcmNoLk1VTFRJQ0lUWSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UoJ2ZsaWdodHMnLCAxLCAwLCB7IGZyb206IG51bGwsIHRvOiBudWxsLCBkZXBhcnRfYXQ6IG51bGwgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChTZWFyY2guTVVMVElDSVRZID09IG9sZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2ZsaWdodHMnLCBbdGhpcy5nZXQoJ2ZsaWdodHMuMCcpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChTZWFyY2guUk9VTkRUUklQID09IG9sZCkgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzLjAucmV0dXJuX2F0JywgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgeyBpbml0OiBmYWxzZSB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlRmxpZ2h0OiBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgdGhpcy5zcGxpY2UoJ2ZsaWdodHMnLCBpLCAxKTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkRmxpZ2h0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnB1c2goJ2ZsaWdodHMnLCB7fSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjczogdGhpcy5nZXQoJ2NzJyksXHJcbiAgICAgICAgICAgIGRvbWVzdGljOiB0aGlzLmdldCgnZG9tZXN0aWMnKSxcclxuICAgICAgICAgICAgdHJpcFR5cGU6IHRoaXMuZ2V0KCd0cmlwVHlwZScpLFxyXG4gICAgICAgICAgICBjYWJpblR5cGU6IHRoaXMuZ2V0KCdjYWJpblR5cGUnKSxcclxuICAgICAgICAgICAgcGFzc2VuZ2VyczogdGhpcy5nZXQoJ3Bhc3NlbmdlcnMnKSxcclxuXHJcbiAgICAgICAgICAgIGZsaWdodHM6IF8ubWFwKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKGZsaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBmbGlnaHQuZnJvbSxcclxuICAgICAgICAgICAgICAgICAgICB0bzogZmxpZ2h0LnRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydF9hdDogbW9tZW50LmlzTW9tZW50KGZsaWdodC5kZXBhcnRfYXQpID8gZmxpZ2h0LmRlcGFydF9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuX2F0OiAyID09IGZvcm0uZ2V0KCd0cmlwVHlwZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKG1vbWVudC5pc01vbWVudChmbGlnaHQucmV0dXJuX2F0KSA/IGZsaWdodC5yZXR1cm5fYXQuZm9ybWF0KCdZWVlZLU1NLUREJykgOiBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG5TZWFyY2guTVVMVElDSVRZID0gMztcclxuU2VhcmNoLlJPVU5EVFJJUCA9IDI7XHJcblNlYXJjaC5PTkVXQVkgPSAxO1xyXG5cclxuU2VhcmNoLkRFTCA9IDEyMzY7XHJcblNlYXJjaC5CT00gPSA5NDY7XHJcblxyXG5TZWFyY2guRUNPTk9NWSA9IDE7XHJcblNlYXJjaC5QRVJNSVVNX0VDT05PTVkgPSAyO1xyXG5TZWFyY2guQlVTSU5FU1MgPSAzO1xyXG5TZWFyY2guRklSU1QgPSA0O1xyXG5cclxuU2VhcmNoLk1BWF9XQUlUX1RJTUUgPSA2MDAwMDtcclxuU2VhcmNoLklOVEVSVkFMID0gNTAwMDtcclxuXHJcblNlYXJjaC5sb2FkID0gZnVuY3Rpb24odXJsLCBmb3JjZSwgY3MpIHtcclxuICAgIGNzID0gY3MgfHwgbnVsbDtcclxuXHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IFJPVVRFUy5zZWFyY2gsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgcXVlcnk6IHVybCwgZm9yY2U6IGZvcmNlIHx8IDAsIGNzOiBjcyB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoU2VhcmNoLnBhcnNlKGRhdGEpKTsgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSlcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblNlYXJjaC5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIGRhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oaSkge1xyXG4gICAgICAgIGkuZGVwYXJ0X2F0ID0gbW9tZW50KGkuZGVwYXJ0X2F0KTtcclxuICAgICAgICBpLnJldHVybl9hdCA9IGkucmV0dXJuX2F0ICYmIG1vbWVudChpLnJldHVybl9hdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIHNlYXJjaCA9IG5ldyBTZWFyY2goe2RhdGE6IGRhdGF9KTtcclxuXHJcblxyXG4gICAgcmV0dXJuIHNlYXJjaDtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL2ZsaWdodC9zZWFyY2guanNcbiAqKiBtb2R1bGUgaWQgPSA1NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCJ2YXIgRkxJR0hUUyA9ICcvYjJjL2ZsaWdodHMnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBmbGlnaHRzOiB7XHJcbiAgICAgICAgc2VhcmNoOiBGTElHSFRTICsgJy9zZWFyY2gnLFxyXG4gICAgICAgIGJvb2tpbmc6IGZ1bmN0aW9uKGlkKSB7IHJldHVybiAnL2IyYy9ib29raW5nLycgKyBpZDsgfSxcclxuICAgIH0sXHJcbn07XHJcblxyXG4vL25ld1xyXG52YXIgcHJvZmlsZW1ldGEgPSByZXF1aXJlKCdzdG9yZXMvbXlwcm9maWxlL21ldGEnKSxcclxuICAgIGJvb2tpbmdlbWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL21ldGEnKSxcclxuICAgIHRyYXZlbGxlcm1ldGEgPSByZXF1aXJlKCdzdG9yZXMvbXl0cmF2ZWxsZXIvbWV0YScpLFxyXG4gICAgbXlQcm9maWxlID0gcmVxdWlyZSgnc3RvcmVzL215cHJvZmlsZS9teXByb2ZpbGUnKSxcclxuICAgIG15Qm9va2luZyA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MnKSxcclxuICAgIG15VHJhdmVsbGVyID0gcmVxdWlyZSgnc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJyk7XHJcbiAgICBcclxudmFyIGFjdGlvbnMgPSB7XHJcbiAgICBwcm9maWxlOiBmdW5jdGlvbihjdHgsIG5leHQpIHtcclxuICAgICAgICAobmV3IG15UHJvZmlsZSgpKS5yZW5kZXIoJyNhcHAnKS50aGVuKGZ1bmN0aW9uKCkgeyBuZXh0KCk7IH0pO1xyXG4gICAgfSxcclxuICAgIGJvb2tpbmc6IGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xyXG4gICAgICAgIChuZXcgbXlCb29raW5nKCkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XHJcbiAgICB9LFxyXG4gICAgdHJhdmVsbGVyOiBmdW5jdGlvbihjdHgsIG5leHQpIHtcclxuICAgICAgICAobmV3IG15VHJhdmVsbGVyKCkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XHJcbiAgICB9LFxyXG59O1xyXG5cclxucHJvZmlsZW1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKG1ldGEpIHtcclxuICAgIHBhZ2UoJy9iMmMvdXNlcnMvbXlwcm9maWxlLycsIGFjdGlvbnMucHJvZmlsZSk7XHJcbiAgICAgcGFnZSh7Y2xpY2s6IGZhbHNlfSk7XHJcbn0pO1xyXG5cclxuYm9va2luZ2VtZXRhLmluc3RhbmNlKCkudGhlbihmdW5jdGlvbihtZXRhKSB7XHJcbiAgICBwYWdlKCcvYjJjL3VzZXJzL215Ym9va2luZ3MvJywgYWN0aW9ucy5ib29raW5nKTtcclxuICAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcclxufSk7XHJcblxyXG50cmF2ZWxsZXJtZXRhLmluc3RhbmNlKCkudGhlbihmdW5jdGlvbihtZXRhKSB7XHJcbiAgICBwYWdlKCcvYjJjL3VzZXJzL215dHJhdmVsbGVyLycsIGFjdGlvbnMudHJhdmVsbGVyKTtcclxuICAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9yb3V0ZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA1NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIFZpZXcgPSByZXF1aXJlKCdjb3JlL3N0b3JlJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gVmlldy5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZWxlY3Q6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlczogZnVuY3Rpb24oKSB7IHJldHVybiBfLm1hcCh2aWV3LmdldCgndGl0bGVzJyksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IGkuaWQsIHRleHQ6IGkubmFtZSB9OyB9KTsgfSxcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5NZXRhLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIG5ldyBNZXRhKHtkYXRhOiBkYXRhfSk7XHJcbn07XHJcblxyXG5NZXRhLmZldGNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy91c2Vycy9tZXRhJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyByZXNvbHZlKE1ldGEucGFyc2UoZGF0YSkpOyB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxudmFyIGluc3RhbmNlID0gbnVsbDtcclxuTWV0YS5pbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlID0gTWV0YS5mZXRjaCgpO1xyXG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlwcm9maWxlL21ldGEuanNcbiAqKiBtb2R1bGUgaWQgPSA1NlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgNlxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbiAgICA7XHJcblxyXG52YXIgVmlldyA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxyXG4gICAgO1xyXG5cclxudmFyIE1ldGEgPSBWaWV3LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGVzOiBmdW5jdGlvbigpIHsgcmV0dXJuIF8ubWFwKHZpZXcuZ2V0KCd0aXRsZXMnKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogaS5pZCwgdGV4dDogaS5uYW1lIH07IH0pOyB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk1ldGEucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gbmV3IE1ldGEoe2RhdGE6IGRhdGF9KTtcclxufTtcclxuXHJcbk1ldGEuZmV0Y2ggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL2FpckNhcnQvbWV0YScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgcmVzb2x2ZShNZXRhLnBhcnNlKGRhdGEpKTsgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbnZhciBpbnN0YW5jZSA9IG51bGw7XHJcbk1ldGEuaW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0YW5jZSA9IE1ldGEuZmV0Y2goKTtcclxuICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL215Ym9va2luZ3MvbWV0YS5qc1xuICoqIG1vZHVsZSBpZCA9IDU3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAzIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbiAgICA7XHJcblxyXG52YXIgVmlldyA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxyXG4gICAgO1xyXG5cclxudmFyIE1ldGEgPSBWaWV3LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuTWV0YS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHJldHVybiBuZXcgTWV0YSh7ZGF0YTogZGF0YX0pO1xyXG59O1xyXG5cclxuTWV0YS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvdHJhdmVsZXIvbWV0YScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgcmVzb2x2ZShNZXRhLnBhcnNlKGRhdGEpKTsgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbnZhciBpbnN0YW5jZSA9IG51bGw7XHJcbk1ldGEuaW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0YW5jZSA9IE1ldGEuZmV0Y2goKTtcclxuICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL215dHJhdmVsbGVyL21ldGEuanNcbiAqKiBtb2R1bGUgaWQgPSA1OFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgN1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICB2YWxpZGF0ZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlJylcclxuICAgIFxyXG4gICAgO1xyXG5cclxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpICA7XHJcblxyXG52YXIgTXlwcm9maWxlID0gU3RvcmUuZXh0ZW5kKHtcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgcHJpY2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfLnJlZHVjZSh0aGlzLmdldCgnICcpKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZXRTdGF0ZUxpc3Q6IGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldFN0YXRlTGlzdFwiKTtcclxuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL3VzZXJzL2dldFN0YXRlTGlzdC8nICsgXy5wYXJzZUludCh2aWV3LmdldCgncHJvZmlsZWZvcm0uY291bnRyeWNvZGUnKSksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGF0ZWxpc3QnLG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGF0ZWxpc3QnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgdmlldy5nZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZSgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmaW5zaWhlZCBzdG9yZTogJyk7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wPXZpZXcuZ2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKTtcclxuICAgICAgICAgICAgdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScsIG51bGwpO1xyXG4gICAgICAgICAgdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScsIHRlbXApO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldENpdHlMaXN0OiBmdW5jdGlvbiAodmlldykge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJnZXRDaXR5TGlzdFwiKTtcclxuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL3VzZXJzL2dldENpdHlMaXN0LycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKSksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjaXR5bGlzdCcsbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NpdHlsaXN0JywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLmNpdHljb2RlJywgdmlldy5nZXQoJ3Byb2ZpbGVmb3JtLmNpdHljb2RlJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAkKCcjZGl2Y2l0eSAudWkuZHJvcGRvd24nKS5kcm9wZG93bignc2V0IHNlbGVjdGVkJywgJCgnI2RpdmNpdHkgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5NeXByb2ZpbGUucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTsgIFxyXG4gICAgICAgICAgIGRhdGEuYmFzZVVybD0nJztcclxuICAgICAgICAgICAgZGF0YS5hZGQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIGRhdGEuZWRpdD1mYWxzZTsgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkYXRhLnBlbmRpbmc9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgIHJldHVybiBuZXcgTXlwcm9maWxlKHtkYXRhOiBkYXRhfSk7XHJcblxyXG59O1xyXG5NeXByb2ZpbGUuZmV0Y2ggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL3VzZXJzL2dldFByb2ZpbGUnKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7ICByZXNvbHZlKE15cHJvZmlsZS5wYXJzZShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkXCIpO1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15cHJvZmlsZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL215cHJvZmlsZS9teXByb2ZpbGUuanNcbiAqKiBtb2R1bGUgaWQgPSA1OVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgNlxuICoqLyIsIi8vICAgICBWYWxpZGF0ZS5qcyAwLjcuMVxuXG4vLyAgICAgKGMpIDIwMTMtMjAxNSBOaWNrbGFzIEFuc21hbiwgMjAxMyBXcmFwcFxuLy8gICAgIFZhbGlkYXRlLmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLy8gICAgIEZvciBhbGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbi8vICAgICBodHRwOi8vdmFsaWRhdGVqcy5vcmcvXG5cbihmdW5jdGlvbihleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUaGUgbWFpbiBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMuXG4gIC8vIFRoZSBvcHRpb25zIGFyZSB0aGUgZm9sbG93aW5nOlxuICAvLyAgIC0gZm9ybWF0IChzdHJpbmcpIC0gQW4gb3B0aW9uIHRoYXQgY29udHJvbHMgaG93IHRoZSByZXR1cm5lZCB2YWx1ZSBpcyBmb3JtYXR0ZWRcbiAgLy8gICAgICogZmxhdCAtIFJldHVybnMgYSBmbGF0IGFycmF5IG9mIGp1c3QgdGhlIGVycm9yIG1lc3NhZ2VzXG4gIC8vICAgICAqIGdyb3VwZWQgLSBSZXR1cm5zIHRoZSBtZXNzYWdlcyBncm91cGVkIGJ5IGF0dHJpYnV0ZSAoZGVmYXVsdClcbiAgLy8gICAgICogZGV0YWlsZWQgLSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByYXcgdmFsaWRhdGlvbiBkYXRhXG4gIC8vICAgLSBmdWxsTWVzc2FnZXMgKGJvb2xlYW4pIC0gSWYgYHRydWVgIChkZWZhdWx0KSB0aGUgYXR0cmlidXRlIG5hbWUgaXMgcHJlcGVuZGVkIHRvIHRoZSBlcnJvci5cbiAgLy9cbiAgLy8gUGxlYXNlIG5vdGUgdGhhdCB0aGUgb3B0aW9ucyBhcmUgYWxzbyBwYXNzZWQgdG8gZWFjaCB2YWxpZGF0b3IuXG4gIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2Lm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKVxuICAgICAgLCBhdHRyXG4gICAgICAsIHZhbGlkYXRvcjtcblxuICAgIGZvciAoYXR0ciBpbiByZXN1bHRzKSB7XG4gICAgICBmb3IgKHZhbGlkYXRvciBpbiByZXN1bHRzW2F0dHJdKSB7XG4gICAgICAgIGlmICh2LmlzUHJvbWlzZShyZXN1bHRzW2F0dHJdW3ZhbGlkYXRvcl0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVXNlIHZhbGlkYXRlLmFzeW5jIGlmIHlvdSB3YW50IHN1cHBvcnQgZm9yIHByb21pc2VzXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0ZS5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gIH07XG5cbiAgdmFyIHYgPSB2YWxpZGF0ZTtcblxuICAvLyBDb3BpZXMgb3ZlciBhdHRyaWJ1dGVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlcyB0byBhIHNpbmdsZSBkZXN0aW5hdGlvbi5cbiAgLy8gVmVyeSBtdWNoIHNpbWlsYXIgdG8gdW5kZXJzY29yZSdzIGV4dGVuZC5cbiAgLy8gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSB0YXJnZXQgb2JqZWN0IGFuZCB0aGUgcmVtYWluaW5nIGFyZ3VtZW50cyB3aWxsIGJlXG4gIC8vIHVzZWQgYXMgdGFyZ2V0cy5cbiAgdi5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIGF0dHIgaW4gc291cmNlKSB7XG4gICAgICAgIG9ialthdHRyXSA9IHNvdXJjZVthdHRyXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIHYuZXh0ZW5kKHZhbGlkYXRlLCB7XG4gICAgLy8gVGhpcyBpcyB0aGUgdmVyc2lvbiBvZiB0aGUgbGlicmFyeSBhcyBhIHNlbXZlci5cbiAgICAvLyBUaGUgdG9TdHJpbmcgZnVuY3Rpb24gd2lsbCBhbGxvdyBpdCB0byBiZSBjb2VyY2VkIGludG8gYSBzdHJpbmdcbiAgICB2ZXJzaW9uOiB7XG4gICAgICBtYWpvcjogMCxcbiAgICAgIG1pbm9yOiA3LFxuICAgICAgcGF0Y2g6IDEsXG4gICAgICBtZXRhZGF0YTogbnVsbCxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZlcnNpb24gPSB2LmZvcm1hdChcIiV7bWFqb3J9LiV7bWlub3J9LiV7cGF0Y2h9XCIsIHYudmVyc2lvbik7XG4gICAgICAgIGlmICghdi5pc0VtcHR5KHYudmVyc2lvbi5tZXRhZGF0YSkpIHtcbiAgICAgICAgICB2ZXJzaW9uICs9IFwiK1wiICsgdi52ZXJzaW9uLm1ldGFkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBCZWxvdyBpcyB0aGUgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIHVzZWQgaW4gdmFsaWRhdGUuanNcblxuICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgUHJvbWlzZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAvLyBJZiB5b3UgYXJlIHVzaW5nIFEuanMsIFJTVlAgb3IgYW55IG90aGVyIEErIGNvbXBhdGlibGUgaW1wbGVtZW50YXRpb25cbiAgICAvLyBvdmVycmlkZSB0aGlzIGF0dHJpYnV0ZSB0byBiZSB0aGUgY29uc3RydWN0b3Igb2YgdGhhdCBwcm9taXNlLlxuICAgIC8vIFNpbmNlIGpRdWVyeSBwcm9taXNlcyBhcmVuJ3QgQSsgY29tcGF0aWJsZSB0aGV5IHdvbid0IHdvcmsuXG4gICAgUHJvbWlzZTogdHlwZW9mIFByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgPyBQcm9taXNlIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIC8vIElmIG1vbWVudCBpcyB1c2VkIGluIG5vZGUsIGJyb3dzZXJpZnkgZXRjIHBsZWFzZSBzZXQgdGhpcyBhdHRyaWJ1dGVcbiAgICAvLyBsaWtlIHRoaXM6IGB2YWxpZGF0ZS5tb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuICAgIG1vbWVudDogdHlwZW9mIG1vbWVudCAhPT0gXCJ1bmRlZmluZWRcIiA/IG1vbWVudCA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBYRGF0ZTogdHlwZW9mIFhEYXRlICE9PSBcInVuZGVmaW5lZFwiID8gWERhdGUgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgRU1QVFlfU1RSSU5HX1JFR0VYUDogL15cXHMqJC8sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMgb2JqZWN0LlxuICAgIC8vIFdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBmb3JtYXQ6XG4gICAgLy8gICAgIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGUgbmFtZT5cIiwgZXJyb3I6IFwiPHZhbGlkYXRpb24gcmVzdWx0PlwifSwgLi4uXVxuICAgIHJ1blZhbGlkYXRpb25zOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXVxuICAgICAgICAsIGF0dHJcbiAgICAgICAgLCB2YWxpZGF0b3JOYW1lXG4gICAgICAgICwgdmFsdWVcbiAgICAgICAgLCB2YWxpZGF0b3JzXG4gICAgICAgICwgdmFsaWRhdG9yXG4gICAgICAgICwgdmFsaWRhdG9yT3B0aW9uc1xuICAgICAgICAsIGVycm9yO1xuXG4gICAgICBpZiAodi5pc0RvbUVsZW1lbnQoYXR0cmlidXRlcykpIHtcbiAgICAgICAgYXR0cmlidXRlcyA9IHYuY29sbGVjdEZvcm1WYWx1ZXMoYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIExvb3BzIHRocm91Z2ggZWFjaCBjb25zdHJhaW50cywgZmluZHMgdGhlIGNvcnJlY3QgdmFsaWRhdG9yIGFuZCBydW4gaXQuXG4gICAgICBmb3IgKGF0dHIgaW4gY29uc3RyYWludHMpIHtcbiAgICAgICAgdmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBhdHRyKTtcbiAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIGNvbnN0cmFpbnRzIGZvciBhbiBhdHRyaWJ1dGUgdG8gYmUgYSBmdW5jdGlvbi5cbiAgICAgICAgLy8gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgIHZhbGlkYXRvcnMgPSB2LnJlc3VsdChjb25zdHJhaW50c1thdHRyXSwgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcblxuICAgICAgICBmb3IgKHZhbGlkYXRvck5hbWUgaW4gdmFsaWRhdG9ycykge1xuICAgICAgICAgIHZhbGlkYXRvciA9IHYudmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcblxuICAgICAgICAgIGlmICghdmFsaWRhdG9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IHYuZm9ybWF0KFwiVW5rbm93biB2YWxpZGF0b3IgJXtuYW1lfVwiLCB7bmFtZTogdmFsaWRhdG9yTmFtZX0pO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcbiAgICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgb3B0aW9ucyB0byBiZSBhIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gd2lsbCBiZVxuICAgICAgICAgIC8vIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2LnJlc3VsdCh2YWxpZGF0b3JPcHRpb25zLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuICAgICAgICAgIGlmICghdmFsaWRhdG9yT3B0aW9ucykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBhdHRyaWJ1dGU6IGF0dHIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvck5hbWUsXG4gICAgICAgICAgICBvcHRpb25zOiB2YWxpZGF0b3JPcHRpb25zLFxuICAgICAgICAgICAgZXJyb3I6IHZhbGlkYXRvci5jYWxsKHZhbGlkYXRvciwgdmFsdWUsIHZhbGlkYXRvck9wdGlvbnMsIGF0dHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9LFxuXG4gICAgLy8gVGFrZXMgdGhlIG91dHB1dCBmcm9tIHJ1blZhbGlkYXRpb25zIGFuZCBjb252ZXJ0cyBpdCB0byB0aGUgY29ycmVjdFxuICAgIC8vIG91dHB1dCBmb3JtYXQuXG4gICAgcHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICBlcnJvcnMgPSB2LnBydW5lRW1wdHlFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuZXhwYW5kTXVsdGlwbGVFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuY29udmVydEVycm9yTWVzc2FnZXMoZXJyb3JzLCBvcHRpb25zKTtcblxuICAgICAgc3dpdGNoIChvcHRpb25zLmZvcm1hdCB8fCBcImdyb3VwZWRcIikge1xuICAgICAgICBjYXNlIFwiZGV0YWlsZWRcIjpcbiAgICAgICAgICAvLyBEbyBub3RoaW5nIG1vcmUgdG8gdGhlIGVycm9yc1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJmbGF0XCI6XG4gICAgICAgICAgZXJyb3JzID0gdi5mbGF0dGVuRXJyb3JzVG9BcnJheShlcnJvcnMpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJncm91cGVkXCI6XG4gICAgICAgICAgZXJyb3JzID0gdi5ncm91cEVycm9yc0J5QXR0cmlidXRlKGVycm9ycyk7XG4gICAgICAgICAgZm9yIChhdHRyIGluIGVycm9ycykge1xuICAgICAgICAgICAgZXJyb3JzW2F0dHJdID0gdi5mbGF0dGVuRXJyb3JzVG9BcnJheShlcnJvcnNbYXR0cl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcih2LmZvcm1hdChcIlVua25vd24gZm9ybWF0ICV7Zm9ybWF0fVwiLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2LmlzRW1wdHkoZXJyb3JzKSA/IHVuZGVmaW5lZCA6IGVycm9ycztcbiAgICB9LFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdGlvbnMgd2l0aCBzdXBwb3J0IGZvciBwcm9taXNlcy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgd2hlbiBhbGwgdGhlXG4gICAgLy8gdmFsaWRhdGlvbiBwcm9taXNlcyBoYXZlIGJlZW4gY29tcGxldGVkLlxuICAgIC8vIEl0IGNhbiBiZSBjYWxsZWQgZXZlbiBpZiBubyB2YWxpZGF0aW9ucyByZXR1cm5lZCBhIHByb21pc2UuXG4gICAgYXN5bmM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuYXN5bmMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdi53YWl0Rm9yUmVzdWx0cyhyZXN1bHRzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBlcnJvcnMgPSB2LnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzaW5nbGU6IGZ1bmN0aW9uKHZhbHVlLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LnNpbmdsZS5vcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgIGZvcm1hdDogXCJmbGF0XCIsXG4gICAgICAgIGZ1bGxNZXNzYWdlczogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHYoe3NpbmdsZTogdmFsdWV9LCB7c2luZ2xlOiBjb25zdHJhaW50c30sIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gYWxsIHByb21pc2VzIGluIHRoZSByZXN1bHRzIGFycmF5XG4gICAgLy8gYXJlIHNldHRsZWQuIFRoZSBwcm9taXNlIHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbiBpcyBhbHdheXMgcmVzb2x2ZWQsXG4gICAgLy8gbmV2ZXIgcmVqZWN0ZWQuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBtb2RpZmllcyB0aGUgaW5wdXQgYXJndW1lbnQsIGl0IHJlcGxhY2VzIHRoZSBwcm9taXNlc1xuICAgIC8vIHdpdGggdGhlIHZhbHVlIHJldHVybmVkIGZyb20gdGhlIHByb21pc2UuXG4gICAgd2FpdEZvclJlc3VsdHM6IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgIC8vIENyZWF0ZSBhIHNlcXVlbmNlIG9mIGFsbCB0aGUgcmVzdWx0cyBzdGFydGluZyB3aXRoIGEgcmVzb2x2ZWQgcHJvbWlzZS5cbiAgICAgIHJldHVybiByZXN1bHRzLnJlZHVjZShmdW5jdGlvbihtZW1vLCByZXN1bHQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyByZXN1bHQgaXNuJ3QgYSBwcm9taXNlIHNraXAgaXQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICBpZiAoIXYuaXNQcm9taXNlKHJlc3VsdC5lcnJvcikpIHtcbiAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZW1vLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5lcnJvci50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgLy8gSWYgZm9yIHNvbWUgcmVhc29uIHRoZSB2YWxpZGF0b3IgcHJvbWlzZSB3YXMgcmVqZWN0ZWQgYnV0IG5vXG4gICAgICAgICAgICAgIC8vIGVycm9yIHdhcyBzcGVjaWZpZWQuXG4gICAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB2Lndhcm4oXCJWYWxpZGF0b3IgcHJvbWlzZSB3YXMgcmVqZWN0ZWQgYnV0IGRpZG4ndCByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyKSB7IHIoKTsgfSkpOyAvLyBBIHJlc29sdmVkIHByb21pc2VcbiAgICB9LFxuXG4gICAgLy8gSWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgY2FsbDogZnVuY3Rpb24gdGhlIGFuZDogZnVuY3Rpb24gcmV0dXJuIHRoZSB2YWx1ZVxuICAgIC8vIG90aGVyd2lzZSBqdXN0IHJldHVybiB0aGUgdmFsdWUuIEFkZGl0aW9uYWwgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzXG4gICAgLy8gYXJndW1lbnRzIHRvIHRoZSBmdW5jdGlvbi5cbiAgICAvLyBFeGFtcGxlOlxuICAgIC8vIGBgYFxuICAgIC8vIHJlc3VsdCgnZm9vJykgLy8gJ2ZvbydcbiAgICAvLyByZXN1bHQoTWF0aC5tYXgsIDEsIDIpIC8vIDJcbiAgICAvLyBgYGBcbiAgICByZXN1bHQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIG51bWJlci4gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBjb25zaWRlciBOYU4gYVxuICAgIC8vIG51bWJlciBsaWtlIG1hbnkgb3RoZXIgYGlzTnVtYmVyYCBmdW5jdGlvbnMgZG8uXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgbm90IGEgZnVuY3Rpb25cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9LFxuXG4gICAgLy8gQSBzaW1wbGUgY2hlY2sgdG8gdmVyaWZ5IHRoYXQgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIuIFVzZXMgYGlzTnVtYmVyYFxuICAgIC8vIGFuZCBhIHNpbXBsZSBtb2R1bG8gY2hlY2suXG4gICAgaXNJbnRlZ2VyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYuaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlICUgMSA9PT0gMDtcbiAgICB9LFxuXG4gICAgLy8gVXNlcyB0aGUgYE9iamVjdGAgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGFuIG9iamVjdC5cbiAgICBpc09iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgICB9LFxuXG4gICAgLy8gU2ltcGx5IGNoZWNrcyBpZiB0aGUgb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGEgZGF0ZVxuICAgIGlzRGF0ZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIGBudWxsYCBvZiBgdW5kZWZpbmVkYFxuICAgIGlzRGVmaW5lZDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIG9iaiAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgcHJvbWlzZS4gQW55dGhpbmcgd2l0aCBhIGB0aGVuYFxuICAgIC8vIGZ1bmN0aW9uIGlzIGNvbnNpZGVyZWQgYSBwcm9taXNlLlxuICAgIGlzUHJvbWlzZTogZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuICEhcCAmJiB2LmlzRnVuY3Rpb24ocC50aGVuKTtcbiAgICB9LFxuXG4gICAgaXNEb21FbGVtZW50OiBmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoIW8pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3JBbGwpIHx8ICF2LmlzRnVuY3Rpb24oby5xdWVyeVNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KGRvY3VtZW50KSAmJiBvID09PSBkb2N1bWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzg0MzgwLzY5OTMwNFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvICYmXG4gICAgICAgICAgdHlwZW9mIG8gPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICBvICE9PSBudWxsICYmXG4gICAgICAgICAgby5ub2RlVHlwZSA9PT0gMSAmJlxuICAgICAgICAgIHR5cGVvZiBvLm5vZGVOYW1lID09PSBcInN0cmluZ1wiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIC8vIE51bGwgYW5kIHVuZGVmaW5lZCBhcmUgZW1wdHlcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBmdW5jdGlvbnMgYXJlIG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBXaGl0ZXNwYWNlIG9ubHkgc3RyaW5ncyBhcmUgZW1wdHlcbiAgICAgIGlmICh2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdi5FTVBUWV9TVFJJTkdfUkVHRVhQLnRlc3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgYXJyYXlzIHdlIHVzZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICBpZiAodi5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID09PSAwO1xuICAgICAgfVxuXG4gICAgICAvLyBEYXRlcyBoYXZlIG5vIGF0dHJpYnV0ZXMgYnV0IGFyZW4ndCBlbXB0eVxuICAgICAgaWYgKHYuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIGZpbmQgYXQgbGVhc3Qgb25lIHByb3BlcnR5IHdlIGNvbnNpZGVyIGl0IG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIGZvciAoYXR0ciBpbiB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBGb3JtYXRzIHRoZSBzcGVjaWZpZWQgc3RyaW5ncyB3aXRoIHRoZSBnaXZlbiB2YWx1ZXMgbGlrZSBzbzpcbiAgICAvLyBgYGBcbiAgICAvLyBmb3JtYXQoXCJGb286ICV7Zm9vfVwiLCB7Zm9vOiBcImJhclwifSkgLy8gXCJGb28gYmFyXCJcbiAgICAvLyBgYGBcbiAgICAvLyBJZiB5b3Ugd2FudCB0byB3cml0ZSAley4uLn0gd2l0aG91dCBoYXZpbmcgaXQgcmVwbGFjZWQgc2ltcGx5XG4gICAgLy8gcHJlZml4IGl0IHdpdGggJSBsaWtlIHRoaXMgYEZvbzogJSV7Zm9vfWAgYW5kIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBhcyBgXCJGb286ICV7Zm9vfVwiYFxuICAgIGZvcm1hdDogdi5leHRlbmQoZnVuY3Rpb24oc3RyLCB2YWxzKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2Uodi5mb3JtYXQuRk9STUFUX1JFR0VYUCwgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICBpZiAobTEgPT09ICclJykge1xuICAgICAgICAgIHJldHVybiBcIiV7XCIgKyBtMiArIFwifVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsc1ttMl0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCB7XG4gICAgICAvLyBGaW5kcyAle2tleX0gc3R5bGUgcGF0dGVybnMgaW4gdGhlIGdpdmVuIHN0cmluZ1xuICAgICAgRk9STUFUX1JFR0VYUDogLyglPyklXFx7KFteXFx9XSspXFx9L2dcbiAgICB9KSxcblxuICAgIC8vIFwiUHJldHRpZmllc1wiIHRoZSBnaXZlbiBzdHJpbmcuXG4gICAgLy8gUHJldHRpZnlpbmcgbWVhbnMgcmVwbGFjaW5nIFsuXFxfLV0gd2l0aCBzcGFjZXMgYXMgd2VsbCBhcyBzcGxpdHRpbmdcbiAgICAvLyBjYW1lbCBjYXNlIHdvcmRzLlxuICAgIHByZXR0aWZ5OiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICh2LmlzTnVtYmVyKHN0cikpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAyIGRlY2ltYWxzIHJvdW5kIGl0IHRvIHR3b1xuICAgICAgICBpZiAoKHN0ciAqIDEwMCkgJSAxID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBzdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoTWF0aC5yb3VuZChzdHIgKiAxMDApIC8gMTAwKS50b0ZpeGVkKDIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzQXJyYXkoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLm1hcChmdW5jdGlvbihzKSB7IHJldHVybiB2LnByZXR0aWZ5KHMpOyB9KS5qb2luKFwiLCBcIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci50b1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICAvLyBFbnN1cmUgdGhlIHN0cmluZyBpcyBhY3R1YWxseSBhIHN0cmluZ1xuICAgICAgc3RyID0gXCJcIiArIHN0cjtcblxuICAgICAgcmV0dXJuIHN0clxuICAgICAgICAvLyBTcGxpdHMga2V5cyBzZXBhcmF0ZWQgYnkgcGVyaW9kc1xuICAgICAgICAucmVwbGFjZSgvKFteXFxzXSlcXC4oW15cXHNdKS9nLCAnJDEgJDInKVxuICAgICAgICAvLyBSZW1vdmVzIGJhY2tzbGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcKy9nLCAnJylcbiAgICAgICAgLy8gUmVwbGFjZXMgLSBhbmQgLSB3aXRoIHNwYWNlXG4gICAgICAgIC5yZXBsYWNlKC9bXy1dL2csICcgJylcbiAgICAgICAgLy8gU3BsaXRzIGNhbWVsIGNhc2VkIHdvcmRzXG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBtMSArIFwiIFwiICsgbTIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuICAgIHN0cmluZ2lmeVZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYucHJldHRpZnkodmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24ob2JqLCB2YWx1ZSkge1xuICAgICAgaWYgKCF2LmlzRGVmaW5lZChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZSBpbiBvYmo7XG4gICAgfSxcblxuICAgIGdldERlZXBPYmplY3RWYWx1ZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoKSB7XG4gICAgICBpZiAoIXYuaXNPYmplY3Qob2JqKSB8fCAhdi5pc1N0cmluZyhrZXlwYXRoKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5ID0gXCJcIlxuICAgICAgICAsIGlcbiAgICAgICAgLCBlc2NhcGUgPSBmYWxzZTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGtleXBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3dpdGNoIChrZXlwYXRoW2ldKSB7XG4gICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJy4nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgIG9iaiA9IG9ialtrZXldO1xuICAgICAgICAgICAgICBrZXkgPSBcIlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnXFxcXCc6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJ1xcXFwnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAga2V5ICs9IGtleXBhdGhbaV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodi5pc0RlZmluZWQob2JqKSAmJiBrZXkgaW4gb2JqKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFRoaXMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHZhbHVlcyBvZiB0aGUgZm9ybS5cbiAgICAvLyBJdCB1c2VzIHRoZSBpbnB1dCBuYW1lIGFzIGtleSBhbmQgdGhlIHZhbHVlIGFzIHZhbHVlXG4gICAgLy8gU28gZm9yIGV4YW1wbGUgdGhpczpcbiAgICAvLyA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZW1haWxcIiB2YWx1ZT1cImZvb0BiYXIuY29tXCIgLz5cbiAgICAvLyB3b3VsZCByZXR1cm46XG4gICAgLy8ge2VtYWlsOiBcImZvb0BiYXIuY29tXCJ9XG4gICAgY29sbGVjdEZvcm1WYWx1ZXM6IGZ1bmN0aW9uKGZvcm0sIG9wdGlvbnMpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSB7fVxuICAgICAgICAsIGlcbiAgICAgICAgLCBpbnB1dFxuICAgICAgICAsIGlucHV0c1xuICAgICAgICAsIHZhbHVlO1xuXG4gICAgICBpZiAoIWZvcm0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZChpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlnbm9yZWRcIikpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoaW5wdXQudmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgICAgIGlmIChpbnB1dC5hdHRyaWJ1dGVzLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBpbnB1dC5jaGVja2VkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2lucHV0Lm5hbWVdIHx8IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhbHVlc1tpbnB1dC5uYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWxlY3RbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC5vcHRpb25zW2lucHV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfSxcblxuICAgIHNhbml0aXplRm9ybVZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMudHJpbSAmJiB2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubnVsbGlmeSAhPT0gZmFsc2UgJiYgdmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKCF2LmlzU3RyaW5nKHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIGFsbCBlcnJvcnMgd2hvJ3MgZXJyb3IgYXR0cmlidXRlIGlzIGVtcHR5IChudWxsIG9yIHVuZGVmaW5lZClcbiAgICBwcnVuZUVtcHR5RXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMuZmlsdGVyKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAhdi5pc0VtcHR5KGVycm9yLmVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBJblxuICAgIC8vIFt7ZXJyb3I6IFtcImVycjFcIiwgXCJlcnIyXCJdLCAuLi59XVxuICAgIC8vIE91dFxuICAgIC8vIFt7ZXJyb3I6IFwiZXJyMVwiLCAuLi59LCB7ZXJyb3I6IFwiZXJyMlwiLCAuLi59XVxuICAgIC8vXG4gICAgLy8gQWxsIGF0dHJpYnV0ZXMgaW4gYW4gZXJyb3Igd2l0aCBtdWx0aXBsZSBtZXNzYWdlcyBhcmUgZHVwbGljYXRlZFxuICAgIC8vIHdoZW4gZXhwYW5kaW5nIHRoZSBlcnJvcnMuXG4gICAgZXhwYW5kTXVsdGlwbGVFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgLy8gUmVtb3ZlcyBlcnJvcnMgd2l0aG91dCBhIG1lc3NhZ2VcbiAgICAgICAgaWYgKHYuaXNBcnJheShlcnJvci5lcnJvcikpIHtcbiAgICAgICAgICBlcnJvci5lcnJvci5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9yLCB7ZXJyb3I6IG1zZ30pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXQucHVzaChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydHMgdGhlIGVycm9yIG1lc2FnZXMgYnkgcHJlcGVuZGluZyB0aGUgYXR0cmlidXRlIG5hbWUgdW5sZXNzIHRoZVxuICAgIC8vIG1lc3NhZ2UgaXMgcHJlZml4ZWQgYnkgXlxuICAgIGNvbnZlcnRFcnJvck1lc3NhZ2VzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvckluZm8pIHtcbiAgICAgICAgdmFyIGVycm9yID0gZXJyb3JJbmZvLmVycm9yO1xuXG4gICAgICAgIGlmIChlcnJvclswXSA9PT0gJ14nKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvci5zbGljZSgxKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmZ1bGxNZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlcnJvciA9IHYuY2FwaXRhbGl6ZSh2LnByZXR0aWZ5KGVycm9ySW5mby5hdHRyaWJ1dGUpKSArIFwiIFwiICsgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSBlcnJvci5yZXBsYWNlKC9cXFxcXFxeL2csIFwiXlwiKTtcbiAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChlcnJvciwge3ZhbHVlOiB2LnN0cmluZ2lmeVZhbHVlKGVycm9ySW5mby52YWx1ZSl9KTtcbiAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9ySW5mbywge2Vycm9yOiBlcnJvcn0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIHtcIjxhdHRyaWJ1dGVOYW1lPlwiOiBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV19XG4gICAgZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0ge307XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICB2YXIgbGlzdCA9IHJldFtlcnJvci5hdHRyaWJ1dGVdO1xuICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgIGxpc3QucHVzaChlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0W2Vycm9yLmF0dHJpYnV0ZV0gPSBbZXJyb3JdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7ZXJyb3I6IFwiPG1lc3NhZ2UgMT5cIiwgLi4ufSwge2Vycm9yOiBcIjxtZXNzYWdlIDI+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIFtcIjxtZXNzYWdlIDE+XCIsIFwiPG1lc3NhZ2UgMj5cIl1cbiAgICBmbGF0dGVuRXJyb3JzVG9BcnJheTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzLm1hcChmdW5jdGlvbihlcnJvcikgeyByZXR1cm4gZXJyb3IuZXJyb3I7IH0pO1xuICAgIH0sXG5cbiAgICBleHBvc2VNb2R1bGU6IGZ1bmN0aW9uKHZhbGlkYXRlLCByb290LCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICAgICAgaWYgKGV4cG9ydHMpIHtcbiAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRlO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHMudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgICAgaWYgKHZhbGlkYXRlLmlzRnVuY3Rpb24oZGVmaW5lKSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWxpZGF0ZTsgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2FybjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2Fybihtc2cpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlcnJvcjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB2YWxpZGF0ZS52YWxpZGF0b3JzID0ge1xuICAgIC8vIFByZXNlbmNlIHZhbGlkYXRlcyB0aGF0IHRoZSB2YWx1ZSBpc24ndCBlbXB0eVxuICAgIHByZXNlbmNlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJjYW4ndCBiZSBibGFua1wiO1xuICAgICAgfVxuICAgIH0sXG4gICAgbGVuZ3RoOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgaXMgPSBvcHRpb25zLmlzXG4gICAgICAgICwgbWF4aW11bSA9IG9wdGlvbnMubWF4aW11bVxuICAgICAgICAsIG1pbmltdW0gPSBvcHRpb25zLm1pbmltdW1cbiAgICAgICAgLCB0b2tlbml6ZXIgPSBvcHRpb25zLnRva2VuaXplciB8fCBmdW5jdGlvbih2YWwpIHsgcmV0dXJuIHZhbDsgfVxuICAgICAgICAsIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdO1xuXG4gICAgICB2YWx1ZSA9IHRva2VuaXplcih2YWx1ZSk7XG4gICAgICB2YXIgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgaWYoIXYuaXNOdW1iZXIobGVuZ3RoKSkge1xuICAgICAgICB2LmVycm9yKHYuZm9ybWF0KFwiQXR0cmlidXRlICV7YXR0cn0gaGFzIGEgbm9uIG51bWVyaWMgdmFsdWUgZm9yIGBsZW5ndGhgXCIsIHthdHRyOiBhdHRyaWJ1dGV9KSk7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImhhcyBhbiBpbmNvcnJlY3QgbGVuZ3RoXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIElzIGNoZWNrc1xuICAgICAgaWYgKHYuaXNOdW1iZXIoaXMpICYmIGxlbmd0aCAhPT0gaXMpIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIHRoaXMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICBcImlzIHRoZSB3cm9uZyBsZW5ndGggKHNob3VsZCBiZSAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogaXN9KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1pbmltdW0pICYmIGxlbmd0aCA8IG1pbmltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29TaG9ydCB8fFxuICAgICAgICAgIHRoaXMudG9vU2hvcnQgfHxcbiAgICAgICAgICBcImlzIHRvbyBzaG9ydCAobWluaW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWluaW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWF4aW11bSkgJiYgbGVuZ3RoID4gbWF4aW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb0xvbmcgfHxcbiAgICAgICAgICB0aGlzLnRvb0xvbmcgfHxcbiAgICAgICAgICBcImlzIHRvbyBsb25nIChtYXhpbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtYXhpbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBudW1lcmljYWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyb3JzID0gW11cbiAgICAgICAgLCBuYW1lXG4gICAgICAgICwgY291bnRcbiAgICAgICAgLCBjaGVja3MgPSB7XG4gICAgICAgICAgICBncmVhdGVyVGhhbjogICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+IGM7IH0sXG4gICAgICAgICAgICBncmVhdGVyVGhhbk9yRXF1YWxUbzogZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+PSBjOyB9LFxuICAgICAgICAgICAgZXF1YWxUbzogICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPT09IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbjogICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbk9yRXF1YWxUbzogICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8PSBjOyB9XG4gICAgICAgICAgfTtcblxuICAgICAgLy8gQ29lcmNlIHRoZSB2YWx1ZSB0byBhIG51bWJlciB1bmxlc3Mgd2UncmUgYmVpbmcgc3RyaWN0LlxuICAgICAgaWYgKG9wdGlvbnMubm9TdHJpbmdzICE9PSB0cnVlICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdCdzIG5vdCBhIG51bWJlciB3ZSBzaG91bGRuJ3QgY29udGludWUgc2luY2UgaXQgd2lsbCBjb21wYXJlIGl0LlxuICAgICAgaWYgKCF2LmlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJpcyBub3QgYSBudW1iZXJcIjtcbiAgICAgIH1cblxuICAgICAgLy8gU2FtZSBsb2dpYyBhcyBhYm92ZSwgc29ydCBvZi4gRG9uJ3QgYm90aGVyIHdpdGggY29tcGFyaXNvbnMgaWYgdGhpc1xuICAgICAgLy8gZG9lc24ndCBwYXNzLlxuICAgICAgaWYgKG9wdGlvbnMub25seUludGVnZXIgJiYgIXYuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90SW50ZWdlciAgfHwgXCJtdXN0IGJlIGFuIGludGVnZXJcIjtcbiAgICAgIH1cblxuICAgICAgZm9yIChuYW1lIGluIGNoZWNrcykge1xuICAgICAgICBjb3VudCA9IG9wdGlvbnNbbmFtZV07XG4gICAgICAgIGlmICh2LmlzTnVtYmVyKGNvdW50KSAmJiAhY2hlY2tzW25hbWVdKHZhbHVlLCBjb3VudCkpIHtcbiAgICAgICAgICAvLyBUaGlzIHBpY2tzIHRoZSBkZWZhdWx0IG1lc3NhZ2UgaWYgc3BlY2lmaWVkXG4gICAgICAgICAgLy8gRm9yIGV4YW1wbGUgdGhlIGdyZWF0ZXJUaGFuIGNoZWNrIHVzZXMgdGhlIG1lc3NhZ2UgZnJvbVxuICAgICAgICAgIC8vIHRoaXMubm90R3JlYXRlclRoYW4gc28gd2UgY2FwaXRhbGl6ZSB0aGUgbmFtZSBhbmQgcHJlcGVuZCBcIm5vdFwiXG4gICAgICAgICAgdmFyIG1zZyA9IHRoaXNbXCJub3RcIiArIHYuY2FwaXRhbGl6ZShuYW1lKV0gfHxcbiAgICAgICAgICAgIFwibXVzdCBiZSAle3R5cGV9ICV7Y291bnR9XCI7XG5cbiAgICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChtc2csIHtcbiAgICAgICAgICAgIGNvdW50OiBjb3VudCxcbiAgICAgICAgICAgIHR5cGU6IHYucHJldHRpZnkobmFtZSlcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMub2RkICYmIHZhbHVlICUgMiAhPT0gMSkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdE9kZCB8fCBcIm11c3QgYmUgb2RkXCIpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuZXZlbiAmJiB2YWx1ZSAlIDIgIT09IDApIHtcbiAgICAgICAgZXJyb3JzLnB1c2godGhpcy5ub3RFdmVuIHx8IFwibXVzdCBiZSBldmVuXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGV0aW1lOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdXG4gICAgICAgICwgZWFybGllc3QgPSBvcHRpb25zLmVhcmxpZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmVhcmxpZXN0LCBvcHRpb25zKSA6IE5hTlxuICAgICAgICAsIGxhdGVzdCA9IG9wdGlvbnMubGF0ZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmxhdGVzdCwgb3B0aW9ucykgOiBOYU47XG5cbiAgICAgIHZhbHVlID0gdGhpcy5wYXJzZSh2YWx1ZSwgb3B0aW9ucyk7XG5cbiAgICAgIC8vIDg2NDAwMDAwIGlzIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBpbiBhIGRheSwgdGhpcyBpcyB1c2VkIHRvIHJlbW92ZVxuICAgICAgLy8gdGhlIHRpbWUgZnJvbSB0aGUgZGF0ZVxuICAgICAgaWYgKGlzTmFOKHZhbHVlKSB8fCBvcHRpb25zLmRhdGVPbmx5ICYmIHZhbHVlICUgODY0MDAwMDAgIT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwibXVzdCBiZSBhIHZhbGlkIGRhdGVcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihlYXJsaWVzdCkgJiYgdmFsdWUgPCBlYXJsaWVzdCkge1xuICAgICAgICBlcnIgPSB0aGlzLnRvb0Vhcmx5IHx8IFwibXVzdCBiZSBubyBlYXJsaWVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtkYXRlOiB0aGlzLmZvcm1hdChlYXJsaWVzdCwgb3B0aW9ucyl9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihsYXRlc3QpICYmIHZhbHVlID4gbGF0ZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vTGF0ZSB8fCBcIm11c3QgYmUgbm8gbGF0ZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGxhdGVzdCwgb3B0aW9ucyl9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gY29udmVydCBpbnB1dCB0byB0aGUgbnVtYmVyXG4gICAgICAvLyBvZiBtaWxsaXMgc2luY2UgdGhlIGVwb2NoLlxuICAgICAgLy8gSXQgc2hvdWxkIHJldHVybiBOYU4gaWYgaXQncyBub3QgYSB2YWxpZCBkYXRlLlxuICAgICAgcGFyc2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICh2LmlzRnVuY3Rpb24odi5YRGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IHYuWERhdGUodmFsdWUsIHRydWUpLmdldFRpbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICByZXR1cm4gK3YubW9tZW50LnV0Yyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWl0aGVyIFhEYXRlIG9yIG1vbWVudC5qcyB3YXMgZm91bmRcIik7XG4gICAgICB9LFxuICAgICAgLy8gRm9ybWF0cyB0aGUgZ2l2ZW4gdGltZXN0YW1wLiBVc2VzIElTTzg2MDEgdG8gZm9ybWF0IHRoZW0uXG4gICAgICAvLyBJZiBvcHRpb25zLmRhdGVPbmx5IGlzIHRydWUgdGhlbiBvbmx5IHRoZSB5ZWFyLCBtb250aCBhbmQgZGF5IHdpbGwgYmVcbiAgICAgIC8vIG91dHB1dC5cbiAgICAgIGZvcm1hdDogZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgZm9ybWF0ID0gb3B0aW9ucy5kYXRlRm9ybWF0O1xuXG4gICAgICAgIGlmICh2LmlzRnVuY3Rpb24odi5YRGF0ZSkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcInl5eXktTU0tZGRcIiA6IFwieXl5eS1NTS1kZCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gbmV3IFhEYXRlKGRhdGUsIHRydWUpLnRvU3RyaW5nKGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodi5pc0RlZmluZWQodi5tb21lbnQpKSB7XG4gICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IChvcHRpb25zLmRhdGVPbmx5ID8gXCJZWVlZLU1NLUREXCIgOiBcIllZWVktTU0tREQgSEg6bW06c3NcIik7XG4gICAgICAgICAgcmV0dXJuIHYubW9tZW50LnV0YyhkYXRlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH1cbiAgICB9KSxcbiAgICBkYXRlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCBvcHRpb25zLCB7ZGF0ZU9ubHk6IHRydWV9KTtcbiAgICAgIHJldHVybiB2LnZhbGlkYXRvcnMuZGF0ZXRpbWUuY2FsbCh2LnZhbGlkYXRvcnMuZGF0ZXRpbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpIHx8IChvcHRpb25zIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICBvcHRpb25zID0ge3BhdHRlcm46IG9wdGlvbnN9O1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIGludmFsaWRcIlxuICAgICAgICAsIHBhdHRlcm4gPSBvcHRpb25zLnBhdHRlcm5cbiAgICAgICAgLCBtYXRjaDtcblxuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhwYXR0ZXJuKSkge1xuICAgICAgICBwYXR0ZXJuID0gbmV3IFJlZ0V4cChvcHRpb25zLnBhdHRlcm4sIG9wdGlvbnMuZmxhZ3MpO1xuICAgICAgfVxuICAgICAgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWModmFsdWUpO1xuICAgICAgaWYgKCFtYXRjaCB8fCBtYXRjaFswXS5sZW5ndGggIT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5jbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICh2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiXiV7dmFsdWV9IGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgbGlzdFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGV4Y2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAoIXYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJeJXt2YWx1ZX0gaXMgcmVzdHJpY3RlZFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGVtYWlsOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgbm90IGEgdmFsaWQgZW1haWxcIjtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5QQVRURVJOLmV4ZWModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIFBBVFRFUk46IC9eW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2Etel17Mix9JC9pXG4gICAgfSksXG4gICAgZXF1YWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHthdHRyaWJ1dGU6IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiaXMgbm90IGVxdWFsIHRvICV7YXR0cmlidXRlfVwiO1xuXG4gICAgICBpZiAodi5pc0VtcHR5KG9wdGlvbnMuYXR0cmlidXRlKSB8fCAhdi5pc1N0cmluZyhvcHRpb25zLmF0dHJpYnV0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGF0dHJpYnV0ZSBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG90aGVyVmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBvcHRpb25zLmF0dHJpYnV0ZSlcbiAgICAgICAgLCBjb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yIHx8IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgICAgIHJldHVybiB2MSA9PT0gdjI7XG4gICAgICAgIH07XG5cbiAgICAgIGlmICghY29tcGFyYXRvcih2YWx1ZSwgb3RoZXJWYWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzKSkge1xuICAgICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge2F0dHJpYnV0ZTogdi5wcmV0dGlmeShvcHRpb25zLmF0dHJpYnV0ZSl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFsaWRhdGUuZXhwb3NlTW9kdWxlKHZhbGlkYXRlLCB0aGlzLCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSk7XG59KS5jYWxsKHRoaXMsXG4gICAgICAgIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGV4cG9ydHMgOiBudWxsLFxuICAgICAgICB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG1vZHVsZSA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZGVmaW5lIDogbnVsbCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzXG4gKiogbW9kdWxlIGlkID0gNjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA2IDdcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJkZWZpbmUgY2Fubm90IGJlIHVzZWQgaW5kaXJlY3RcIik7IH07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qc1xuICoqIG1vZHVsZSBpZCA9IDYxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA0IDUgNiA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgICAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgICAgICB2YWxpZGF0ZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlJylcclxuXHJcbiAgICAgICAgO1xyXG5cclxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpO1xyXG5cclxudmFyIE15Ym9va2luZ0RhdGEgPSBTdG9yZS5leHRlbmQoe1xyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICBwcmljZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfLnJlZHVjZSh0aGlzLmdldCgnICcpKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZWZyZXNoQ3VycmVudENhcnQ6IGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoQ3VycmVudENhcnRcIik7XHJcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldENhcnREZXRhaWxzLycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdjdXJyZW50Q2FydElkJykpLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCwgZW1haWw6ZGF0YS5lbWFpbCx1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsYm9va2luZ19zdGF0dXNtc2c6IGRhdGEuYm9va2luZ19zdGF0dXNtc2csIHJldHVybmRhdGU6IGRhdGEucmV0dXJuZGF0ZSwgaXNNdWx0aUNpdHk6IGRhdGEuaXNNdWx0aUNpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cmVuY3k6IGRhdGEuY3VyZW5jeSxmb3A6ZGF0YS5mb3AsYmFzZXByaWNlOmRhdGEuYmFzZXByaWNlLHRheGVzOmRhdGEudGF4ZXMsZmVlOmRhdGEuZmVlLHRvdGFsQW1vdW50aW53b3JkczpkYXRhLnRvdGFsQW1vdW50aW53b3JkcyxjdXN0b21lcmNhcmU6ZGF0YS5jdXN0b21lcmNhcmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChkYXRhLmJvb2tpbmdzLCBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdXBjb21pbmc6IGkudXBjb21pbmcsIHNvdXJjZV9pZDogaS5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBpLmRlc3RpbmF0aW9uX2lkLCBzb3VyY2U6IGkuc291cmNlLCBmbGlnaHR0aW1lOiBpLmZsaWdodHRpbWUsIGRlc3RpbmF0aW9uOiBpLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IGkuZGVwYXJ0dXJlLCBhcnJpdmFsOiBpLmFycml2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhdmVsbGVyOiBfLm1hcChpLnRyYXZlbGxlciwgZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBib29raW5naWQ6IHQuYm9va2luZ2lkLCBmYXJldHlwZTogdC5mYXJldHlwZSwgdGl0bGU6IHQudGl0bGUsIHR5cGU6IHQudHlwZSwgZmlyc3RfbmFtZTogdC5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHQubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWlybGluZV9wbnI6IHQuYWlybGluZV9wbnIsIGNyc19wbnI6IHQuY3JzX3BuciwgdGlja2V0OiB0LnRpY2tldCwgYm9va2luZ19jbGFzczogdC5ib29raW5nX2NsYXNzLCBjYWJpbjogdC5jYWJpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2ljZmFyZTogdC5iYXNpY2ZhcmUsIHRheGVzOiB0LnRheGVzLCB0b3RhbDogdC50b3RhbCwgc3RhdHVzOiB0LnN0YXR1cyxzdGF0dXNtc2c6IHQuc3RhdHVzbXNnLCBzZWxlY3RlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKHQucm91dGVzLCBmdW5jdGlvbiAocm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm8uaWQsIG9yaWdpbjogcm8ub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiByby5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHJvLmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHJvLmRlcGFydHVyZSwgYXJyaXZhbDogcm8uYXJyaXZhbCwgY2Fycmllcjogcm8uY2FycmllciwgY2Fycmllck5hbWU6IHJvLmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHJvLmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogcm8uZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHJvLm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiByby5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiByby5tZWFsLCBzZWF0OiByby5zZWF0LCBhaXJjcmFmdDogcm8uYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcChpLnJvdXRlcywgZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBvcmlnaW46IHQub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiB0Lm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogdC5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiB0LmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHQuZGVwYXJ0dXJlLCBhcnJpdmFsOiB0LmFycml2YWwsIGNhcnJpZXI6IHQuY2FycmllciwgY2Fycmllck5hbWU6IHQuY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogdC5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiB0LmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiB0Lm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiB0LmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHQubWVhbCwgc2VhdDogdC5zZWF0LCBhaXJjcmFmdDogdC5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY3VycmVudENhcnREZXRhaWxzJywgZGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gXy5maW5kSW5kZXgodmlldy5nZXQoJ2NhcnRzJyksIHsnaWQnOiBkZXRhaWxzLmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4OiAnK2luZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhcnRzID0gdmlldy5nZXQoJ2NhcnRzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FydHNbaW5kZXhdLmJvb2tpbmdfc3RhdHVzID0gZGV0YWlscy5ib29raW5nX3N0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2FydHMnLCBjYXJ0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1bW1hcnknLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbnNpaGVkIHN0b3JlOiAnKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5NeWJvb2tpbmdEYXRhLmdldEN1cnJlbnRDYXJ0ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0Q3VycmVudENhcnRcIik7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Q2FydERldGFpbHMvJyArIF8ucGFyc2VJbnQoaWQpLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZG9uZVwiKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHZhciBkZXRhaWxzID0ge1xyXG4gICAgICAgICAgICBpZDogZGF0YS5pZCwgZW1haWw6ZGF0YS5lbWFpbCx0aWNrZXRzdGF0dXNtc2c6ZGF0YS50aWNrZXRzdGF0dXNtc2csdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLGNsaWVudFNvdXJjZUlkOmRhdGEuY2xpZW50U291cmNlSWQsc2VnTmlnaHRzOmRhdGEuc2VnTmlnaHRzLFxyXG4gICAgICAgICAgICBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcclxuICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uICh4LCB5KSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZDEgPiBkMikge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuLy9cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pLCB9O1xyXG4gICAgICAgIGRhdGEuY3VycmVudENhcnREZXRhaWxzPSBkZXRhaWxzO1xyXG4gICAgICAgIGRhdGEuY2FydHM9W107XHJcbiAgICAgICAgZGF0YS5jYXJ0cy5wdXNoKGRldGFpbHMpO1xyXG4gICAgICAgIGRhdGEuY2FiaW5UeXBlID0gMTtcclxuICAgIGRhdGEuYWRkID0gZmFsc2U7XHJcbiAgICBkYXRhLmVkaXQgPSBmYWxzZTtcclxuICAgIGRhdGEuY3VycmVudENhcnRJZCA9IGRldGFpbHMuaWQ7XHJcbiAvLyAgIGNvbnNvbGUubG9nKGRhdGEuY3VycmVudENhcnREZXRhaWxzKTtcclxuICAgIGRhdGEuc3VtbWFyeSA9IGZhbHNlO1xyXG4gICAgZGF0YS5wcmludCA9IGZhbHNlO1xyXG4gICAgZGF0YS5wZW5kaW5nID0gZmFsc2U7XHJcbiAgICBkYXRhLmFtZW5kID0gZmFsc2U7XHJcbiAgICBkYXRhLmNhbmNlbCA9IGZhbHNlO1xyXG4gICAgZGF0YS5yZXNjaGVkdWxlID0gZmFsc2U7XHJcbiAgIFxyXG4gICAgZGF0YS5lcnJvcnMgPSB7fTtcclxuICAgIGRhdGEucmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGRhdGEuZmlsdGVyID0ge307XHJcbiAgICBkYXRhLmZpbHRlcmVkID0ge307XHJcbiAgICByZXR1cm4gcmVzb2x2ZShuZXcgTXlib29raW5nRGF0YSh7ZGF0YTogZGF0YX0pKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB9KVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5NeWJvb2tpbmdEYXRhLnBhcnNlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJNeWJvb2tpbmdEYXRhLnBhcnNlXCIpO1xyXG4gICAgLy9kYXRhLmZsaWdodHMgPSBfLm1hcChkYXRhLmZsaWdodHMsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIEZsaWdodC5wYXJzZShpKTsgfSk7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpOyAgIFxyXG4gICAgdmFyIGZsZ1VwY29taW5nID0gZmFsc2U7XHJcbiAgICB2YXIgZmxnUHJldmlvdXMgPSBmYWxzZTtcclxuICAgIGRhdGEuY2FydHMgPSBfLm1hcChkYXRhLCBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIGlmIChpLnVwY29taW5nID09ICd0cnVlJylcclxuICAgICAgICAgICAgZmxnVXBjb21pbmcgPSB0cnVlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZmxnUHJldmlvdXMgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB7aWQ6IGkuaWQsZW1haWw6aS5lbWFpbCwgY3JlYXRlZDogaS5jcmVhdGVkLCB0b3RhbEFtb3VudDogaS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGkuYm9va2luZ19zdGF0dXMsXHJcbiAgICAgICAgICAgIHJldHVybmRhdGU6IGkucmV0dXJuZGF0ZSwgaXNNdWx0aUNpdHk6IGkuaXNNdWx0aUNpdHksIGN1cmVuY3k6IGkuY3VyZW5jeSwgdXBjb21pbmc6IGkudXBjb21pbmcsXHJcbiAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChpLmJvb2tpbmdzLCBmdW5jdGlvbiAoYikge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGIuaWQsIHNvdXJjZTogYi5zb3VyY2UsIGRlc3RpbmF0aW9uOiBiLmRlc3RpbmF0aW9uLCBzb3VyY2VfaWQ6IGIuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogYi5kZXN0aW5hdGlvbl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBkZXBhcnR1cmU6IGIuZGVwYXJ0dXJlLCBhcnJpdmFsOiBiLmFycml2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhdmVsZXJzOiBfLm1hcChiLnRyYXZlbGxlciwgZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogdC5pZCwgbmFtZTogdC5uYW1lfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgdHJhdmVsZXI6IF8ubWFwKGkudHJhdmVsbGVyZHRsLCBmdW5jdGlvbiAoaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogai5pZCwgbmFtZTogai5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogXy5tYXAoai5zcmMsIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZTogZ307XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdDogXy5tYXAoai5kZXN0LCBmdW5jdGlvbiAoZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge25hbWU6IGd9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG4gICAgZGF0YS5jYXJ0cy5zb3J0KGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgaWYgKHguaWQgPCB5LmlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgICAgfVxyXG4gICAgICAgIDtcclxuXHJcbiAgICB9KTtcclxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZGF0YS5jYXJ0cyk7ICBcclxuICAgIC8vICAgICAgICAgIGRhdGEuY3VycmVudFRyYXZlbGxlcj0gXy5maXJzdChkYXRhLnRyYXZlbGxlcnMpO1xyXG4gICAgLy8gICAgICAgICAgIGRhdGEuY3VycmVudFRyYXZlbGxlcklkPWRhdGEuY3VycmVudFRyYXZlbGxlci5pZDtcclxuICAgIGRhdGEuY2FiaW5UeXBlID0gMTtcclxuICAgIGRhdGEuYWRkID0gZmFsc2U7XHJcbiAgICBkYXRhLmVkaXQgPSBmYWxzZTtcclxuICAgIGRhdGEuY3VycmVudENhcnRJZCA9IG51bGw7XHJcbiAgICBkYXRhLmN1cnJlbnRDYXJ0RGV0YWlscyA9IG51bGw7XHJcbiAgICBkYXRhLnN1bW1hcnkgPSB0cnVlO1xyXG4gICAgZGF0YS5wZW5kaW5nID0gdHJ1ZTtcclxuICAgIGRhdGEuYW1lbmQgPSBmYWxzZTtcclxuICAgIGRhdGEuY2FuY2VsID0gZmFsc2U7XHJcbiAgICBkYXRhLnByaW50ID0gZmFsc2U7XHJcbiAgICBkYXRhLnJlc2NoZWR1bGUgPSBmYWxzZTtcclxuICAgIGRhdGEuZmxnVXBjb21pbmcgPSBmbGdVcGNvbWluZztcclxuICAgIGRhdGEuZmxnUHJldmlvdXMgPSBmbGdQcmV2aW91cztcclxuICAgIGRhdGEuZXJyb3JzID0ge307XHJcbiAgICBkYXRhLnJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICBkYXRhLmZpbHRlciA9IHt9O1xyXG4gICAgZGF0YS5maWx0ZXJlZCA9IHt9O1xyXG4gICAgcmV0dXJuIG5ldyBNeWJvb2tpbmdEYXRhKHtkYXRhOiBkYXRhfSk7XHJcblxyXG59O1xyXG5NeWJvb2tpbmdEYXRhLmZldGNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIk15Ym9va2luZ0RhdGEuZmV0Y2hcIik7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvYWlyQ2FydC9nZXRNeUJvb2tpbmdzJylcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShNeWJvb2tpbmdEYXRhLnBhcnNlKGRhdGEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBNeWJvb2tpbmdEYXRhO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmpzXG4gKiogbW9kdWxlIGlkID0gNjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgdmFsaWRhdGUgPSByZXF1aXJlKCd2YWxpZGF0ZScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBxdWVuZTogW10sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGdldERhdGE9ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGdldERhdGExPWZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBkb2FqYXg9ZnVuY3Rpb24oZ2V0RGF0YSl7XHJcbiAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYjJjL3RyYXZlbGVyL2dldE15VHJhdmVsZXJzTGlzdCcsICBcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGdldERhdGEsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZ2V0RGF0YTFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgICAgIGRvYWpheChnZXREYXRhKTtcclxuICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVyOiB7aWQ6IDEsdGl0bGU6J01yLicsIGVtYWlsOiAncHJhc2hhbnRAZ21haWwuY29tJywgbW9iaWxlOiAnOTQxMjM1NzkyNicsICBmaXJzdF9uYW1lOiAnUHJhc2hhbnQnLCBcclxuICAgICAgICAgICAgICAgIGxhc3RfbmFtZTonS3VtYXInLGJpcnRoZGF0ZTonMjAwMS0wNS0zMCcsYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6JzM0MjEyMycscGFzc3BvcnRfcGxhY2U6J0luZGlhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVySWQ6MSxcclxuICAgICAgICAgICAgY2FiaW5UeXBlOiAxLFxyXG4gICAgICAgICAgICBhZGQ6ZmFsc2UsXHJcbiAgICAgICAgICAgIGVkaXQ6ZmFsc2UsXHJcbiAgICAgICAgICAgIHRpdGxlczpbe2lkOjEsdGV4dDonTXIuJ30se2lkOjIsdGV4dDonTXJzLid9LHtpZDozLHRleHQ6J01zLid9LHtpZDo0LHRleHQ6J01pc3MnfSx7aWQ6NSx0ZXh0OidNc3RyLid9LHtpZDo2LHRleHQ6J0luZi4nfV0sXHJcbiAgICAgICAgICAgIHBhc3NlbmdlcnM6IFsxLCAwLCAwXSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyczogW1xyXG4gICAgICAgICAgICAgICAgeyBpZDogMSx0aXRsZTonTXIuJywgZW1haWw6ICdwcmFzaGFudEBnbWFpbC5jb20nLCBtb2JpbGU6ICc5NDEyMzU3OTI2JyxwYXNzcG9ydF9udW1iZXI6JzI1NDIzNDInLHBhc3Nwb3J0X3BsYWNlOidJbmRpYScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6ICdQcmFzaGFudCcsIGxhc3RfbmFtZTonS3VtYXInLGJpcnRoZGF0ZTonMjAwMS0wNS0zMCcsYmFzZVVybDonJ30sXHJcbiAgICAgICAgICAgICAgICB7IGlkOiAyLHRpdGxlOidNci4nLCBlbWFpbDogJ01pY2hhZWxAZ21haWwuY29tJywgbW9iaWxlOiAnMTIzNDU2Nzg5MCcscGFzc3BvcnRfbnVtYmVyOiczMTIzMTIzJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnLCBcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnTWljaGFlbCcsIGxhc3RfbmFtZTonSmFpbicsYmlydGhkYXRlOicyMDA1LTAzLTAzJyxiYXNlVXJsOicnfSxcclxuICAgICAgICAgICAgICAgIHsgaWQ6IDMsdGl0bGU6J01yLicsIGVtYWlsOiAnYmVsYWlyQGdtYWlsLmNvbScsIG1vYmlsZTogJzEyMzQ1Njc4OTAnLHBhc3Nwb3J0X251bWJlcjonMTIzMTIzMScscGFzc3BvcnRfcGxhY2U6J0luZGlhJyxcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnQmVsYWlyJywgbGFzdF9uYW1lOidUcmF2ZWxzJyxiaXJ0aGRhdGU6JzIwMDItMDItMjAnLGJhc2VVcmw6Jyd9XHJcbiAgICAgICAgICAgIF0sXHJcblxyXG4gICAgICAgICAgICBwZW5kaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZXJyb3JzOiB7fSxcclxuICAgICAgICAgICAgcmVzdWx0czogW10sXHJcblxyXG4gICAgICAgICAgICBmaWx0ZXI6IHt9LFxyXG4gICAgICAgICAgICBmaWx0ZXJlZDoge30sXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgaWYodGhpcy5nZXQoKS5hZGQpeyAgICAgICAgXHJcbiAgICAgICAgdmFyIG5ld3RyYXZlbGxlcj1fLnBpY2sodGhpcy5nZXQoKSwgJ2N1cnJlbnRUcmF2ZWxsZXInKTsgXHJcbiAgICAgICAgdmFyIHRyYXZlbGxlcnM9dGhpcy5nZXQoKS50cmF2ZWxsZXJzO1xyXG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnRpdGxlO1xyXG4gICAgICAgIHZhciB0aXRsZXM9Xy5jbG9uZURlZXAodGhpcy5nZXQoKS50aXRsZXMpO1xyXG4gICAgICAgIHZhciB0aXRsZTtcclxuICAgICAgICAgXy5lYWNoKHRpdGxlcywgZnVuY3Rpb24oaSwgaykgeyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiA0LHRpdGxlOnRpdGxlLCBlbWFpbDogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZW1haWwsIG1vYmlsZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZmlyc3RfbmFtZSwgXHJcbiAgICAgICAgICAgICAgICBsYXN0X25hbWU6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubGFzdF9uYW1lLGJpcnRoZGF0ZTpuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyksYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyLHBhc3Nwb3J0X3BsYWNlOm5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnBhc3Nwb3J0X3BsYWNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsbGVycyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3RyYXZlbGxlcnMnLHRyYXZlbGxlcnMpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxjdXJyZW50dHJhdmVsbGVyKTtcclxuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcklkJyw0KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYodGhpcy5nZXQoKS5lZGl0KXtcclxuICAgICAgICB2YXIgbmV3dHJhdmVsbGVyPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcjsgXHJcbiAgICAgICAgdmFyIHRyYXZlbGxlcnM9dGhpcy5nZXQoKS50cmF2ZWxsZXJzO1xyXG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci50aXRsZTtcclxuICAgICAgICB2YXIgdGl0bGVzPV8uY2xvbmVEZWVwKHRoaXMuZ2V0KCkudGl0bGVzKTtcclxuICAgICAgICB2YXIgdGl0bGU7XHJcbiAgICAgICAgdmFyIGlkPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcklkO1xyXG4gICAgICAgICBfLmVhY2godGl0bGVzLCBmdW5jdGlvbihpLCBrKSB7IGNvbnNvbGUubG9nKGkpOyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiBpZCx0aXRsZTp0aXRsZSwgZW1haWw6IG5ld3RyYXZlbGxlci5lbWFpbCwgbW9iaWxlOiBuZXd0cmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmZpcnN0X25hbWUsIFxyXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOm5ld3RyYXZlbGxlci5sYXN0X25hbWUsYmlydGhkYXRlOm5ld3RyYXZlbGxlci5iaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyksYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6bmV3dHJhdmVsbGVyLnBhc3Nwb3J0X251bWJlcixwYXNzcG9ydF9wbGFjZTpuZXd0cmF2ZWxsZXIucGFzc3BvcnRfcGxhY2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB2YXIgaW5kZXg9IF8uZmluZEluZGV4KHRoaXMuZ2V0KCkudHJhdmVsbGVycywgeyAnaWQnOiBpZH0pO1xyXG4gICAgICAgIHRoaXMuc3BsaWNlKCd0cmF2ZWxsZXJzJywgaW5kZXgsIDEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIHRyYXZlbGxlcnMucHVzaChjdXJyZW50dHJhdmVsbGVyKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGxlcnMpO1xyXG4gICAgICAgIHRoaXMuc2V0KCd0cmF2ZWxsZXJzJyx0cmF2ZWxsZXJzKTtcclxuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcicsY3VycmVudHRyYXZlbGxlcik7ICAgICAgICBcclxuICAgIH1cclxuICAgICAgICB0aGlzLnNldCgnYWRkJyxmYWxzZSk7IFxyXG4gICAgICAgIHRoaXMuc2V0KCdlZGl0JyxmYWxzZSk7IFxyXG4gICAgICAgIC8vLFxyXG4gICAgIC8qICAgICAgIHNlYXJjaCA9IF8ucGljayh0aGlzLmdldCgpLCBbJ3RyaXBUeXBlJywgJ2NhYmluVHlwZScsICdwYXNzZW5nZXJzJ10pO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywge30pO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwZW5kaW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5xdWVuZSA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgXy5lYWNoKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKGksIGspIHtcclxuICAgICAgICAgICAgdmlldy5xdWVuZVt2aWV3LnF1ZW5lLmxlbmd0aF0gPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9mbGlnaHRzL3NlYXJjaCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmV4dGVuZCh7fSwgc2VhcmNoLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogaS5mcm9tLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiBpLnRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydF9hdDogbW9tZW50LmlzTW9tZW50KGkuZGVwYXJ0X2F0KSA/IGkuZGVwYXJ0X2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5fYXQ6IG1vbWVudC5pc01vbWVudChpLnJldHVybl9hdCkgPyBpLnJldHVybl9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgdmlldy5pbXBvcnRSZXN1bHRzKGssIGRhdGEpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikgeyB2aWV3LmhhbmRsZUVycm9yKGssIHhocik7IH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJC53aGVuLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy5xdWVuZSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7IHZpZXcuc2V0KCdwZW5kaW5nJywgZmFsc2UpOyB2aWV3LnNldCgnZmluaXNoZWQnLCB0cnVlKTsgfSk7ICovXHJcbiAgICB9LFxyXG5cclxuICAgIGltcG9ydFJlc3VsdHM6IGZ1bmN0aW9uKGssIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQnLCB7fSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Jlc3VsdHMuJyArIGssIGRhdGEpO1xyXG5cclxuICAgICAgICB2YXIgcHJpY2VzID0gW10sXHJcbiAgICAgICAgICAgIGNhcnJpZXJzID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgIHByaWNlc1twcmljZXMubGVuZ3RoXSA9IGkucHJpY2U7XHJcbiAgICAgICAgICAgIGNhcnJpZXJzW2NhcnJpZXJzLmxlbmd0aF0gPSBpLml0aW5lcmFyeVswXS5zZWdtZW50c1swXS5jYXJyaWVyO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgY2FycmllcnMgPSBfLnVuaXF1ZShjYXJyaWVycywgJ2NvZGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2ZpbHRlcicsIHtcclxuICAgICAgICAgICAgcHJpY2VzOiBbTWF0aC5taW4uYXBwbHkobnVsbCwgcHJpY2VzKSwgTWF0aC5tYXguYXBwbHkobnVsbCwgcHJpY2VzKV0sXHJcbiAgICAgICAgICAgIGNhcnJpZXJzOiBjYXJyaWVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQuY2FycmllcnMnLCBfLm1hcChjYXJyaWVycywgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS5jb2RlOyB9KSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZUVycm9yOiBmdW5jdGlvbihrLCB4aHIpIHtcclxuXHJcbiAgICB9XHJcblxyXG5cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDYzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJylcclxuICAgIDtcclxuXHJcbnZhciBEaWFsb2cgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9kaWFsb2cuaHRtbCcpLFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGhlYWRlcjogJ2hlYWRlcicsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdtZXNzYWdlJyxcclxuICAgICAgICAgICAgYnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgWydPaycsIGZ1bmN0aW9uKCkgeyBhbGVydCgnenp6Jyk7IH1dLFxyXG4gICAgICAgICAgICAgICAgWydDYW5jZWwnLCBmdW5jdGlvbigpIHsgYWxlcnQoJ3l5eScpIH1dXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2s6IGZ1bmN0aW9uKGV2ZW50LCBjYikge1xyXG4gICAgICAgIGNiLmJpbmQodGhpcykoZXZlbnQpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5EaWFsb2cub3BlbiA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHZhciBkaWFsb2cgPSBuZXcgRGlhbG9nKCk7XHJcbiAgICBkaWFsb2cuc2V0KG9wdGlvbnMpO1xyXG4gICAgZGlhbG9nLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEaWFsb2c7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZy5qc1xuICoqIG1vZHVsZSBpZCA9IDY0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSAgc21hbGwgbW9kYWxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiaGVhZGVyXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjMsXCJyXCI6XCJtZXNzYWdlXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWN0aW9uc1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJ1dHRvblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImNsaWNrXCIsXCJhXCI6e1wiclwiOltcImV2ZW50XCIsXCIuLzFcIl0sXCJzXCI6XCJbXzAsXzFdXCJ9fX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLi8wXCJ9XX1dLFwiblwiOjUyLFwiclwiOlwiYnV0dG9uc1wifV19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9kaWFsb2cuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDY1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFtb3VudCkge1xyXG4gICAgaWYgKE1ldGEub2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoXHJcbiAgICAgICAgICAgIGFtb3VudCAqIE1ldGEub2JqZWN0LmdldCgneENoYW5nZScpW01ldGEub2JqZWN0LmdldCgnZGlzcGxheV9jdXJyZW5jeScpXSxcclxuICAgICAgICAgICAgJzxpIGNsYXNzPVwiJyArIE1ldGEub2JqZWN0LmdldCgnZGlzcGxheV9jdXJyZW5jeScpLnRvTG93ZXJDYXNlKCkgICsgJyBpY29uIGN1cnJlbmN5XCI+PC9pPicsXHJcbiAgICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2NvdW50aW5nLmZvcm1hdE1vbmV5KGFtb3VudCwgJzxpIGNsYXNzPVwiaW5yIGljb24gY3VycmVuY3lcIj48L2k+JywgMCk7XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2hlbHBlcnMvbW9uZXkuanNcbiAqKiBtb2R1bGUgaWQgPSA2N1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIi8qIVxuICogYWNjb3VudGluZy5qcyB2MC4zLjJcbiAqIENvcHlyaWdodCAyMDExLCBKb3NzIENyb3djcm9mdFxuICpcbiAqIEZyZWVseSBkaXN0cmlidXRhYmxlIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIFBvcnRpb25zIG9mIGFjY291bnRpbmcuanMgYXJlIGluc3BpcmVkIG9yIGJvcnJvd2VkIGZyb20gdW5kZXJzY29yZS5qc1xuICpcbiAqIEZ1bGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbiAqIGh0dHA6Ly9qb3NzY3Jvd2Nyb2Z0LmdpdGh1Yi5jb20vYWNjb3VudGluZy5qcy9cbiAqL1xuXG4oZnVuY3Rpb24ocm9vdCwgdW5kZWZpbmVkKSB7XG5cblx0LyogLS0tIFNldHVwIC0tLSAqL1xuXG5cdC8vIENyZWF0ZSB0aGUgbG9jYWwgbGlicmFyeSBvYmplY3QsIHRvIGJlIGV4cG9ydGVkIG9yIHJlZmVyZW5jZWQgZ2xvYmFsbHkgbGF0ZXJcblx0dmFyIGxpYiA9IHt9O1xuXG5cdC8vIEN1cnJlbnQgdmVyc2lvblxuXHRsaWIudmVyc2lvbiA9ICcwLjMuMic7XG5cblxuXHQvKiAtLS0gRXhwb3NlZCBzZXR0aW5ncyAtLS0gKi9cblxuXHQvLyBUaGUgbGlicmFyeSdzIHNldHRpbmdzIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBDb250YWlucyBkZWZhdWx0IHBhcmFtZXRlcnMgZm9yXG5cdC8vIGN1cnJlbmN5IGFuZCBudW1iZXIgZm9ybWF0dGluZ1xuXHRsaWIuc2V0dGluZ3MgPSB7XG5cdFx0Y3VycmVuY3k6IHtcblx0XHRcdHN5bWJvbCA6IFwiJFwiLFx0XHQvLyBkZWZhdWx0IGN1cnJlbmN5IHN5bWJvbCBpcyAnJCdcblx0XHRcdGZvcm1hdCA6IFwiJXMldlwiLFx0Ly8gY29udHJvbHMgb3V0cHV0OiAlcyA9IHN5bWJvbCwgJXYgPSB2YWx1ZSAoY2FuIGJlIG9iamVjdCwgc2VlIGRvY3MpXG5cdFx0XHRkZWNpbWFsIDogXCIuXCIsXHRcdC8vIGRlY2ltYWwgcG9pbnQgc2VwYXJhdG9yXG5cdFx0XHR0aG91c2FuZCA6IFwiLFwiLFx0XHQvLyB0aG91c2FuZHMgc2VwYXJhdG9yXG5cdFx0XHRwcmVjaXNpb24gOiAyLFx0XHQvLyBkZWNpbWFsIHBsYWNlc1xuXHRcdFx0Z3JvdXBpbmcgOiAzXHRcdC8vIGRpZ2l0IGdyb3VwaW5nIChub3QgaW1wbGVtZW50ZWQgeWV0KVxuXHRcdH0sXG5cdFx0bnVtYmVyOiB7XG5cdFx0XHRwcmVjaXNpb24gOiAwLFx0XHQvLyBkZWZhdWx0IHByZWNpc2lvbiBvbiBudW1iZXJzIGlzIDBcblx0XHRcdGdyb3VwaW5nIDogMyxcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0XHR0aG91c2FuZCA6IFwiLFwiLFxuXHRcdFx0ZGVjaW1hbCA6IFwiLlwiXG5cdFx0fVxuXHR9O1xuXG5cblx0LyogLS0tIEludGVybmFsIEhlbHBlciBNZXRob2RzIC0tLSAqL1xuXG5cdC8vIFN0b3JlIHJlZmVyZW5jZSB0byBwb3NzaWJseS1hdmFpbGFibGUgRUNNQVNjcmlwdCA1IG1ldGhvZHMgZm9yIGxhdGVyXG5cdHZhciBuYXRpdmVNYXAgPSBBcnJheS5wcm90b3R5cGUubWFwLFxuXHRcdG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5LFxuXHRcdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSBzdHJpbmdcblx0ICogZnJvbSB1bmRlcnNjb3JlLmpzXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcblx0XHRyZXR1cm4gISEob2JqID09PSAnJyB8fCAob2JqICYmIG9iai5jaGFyQ29kZUF0ICYmIG9iai5zdWJzdHIpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanMsIGRlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuXHRcdHJldHVybiBuYXRpdmVJc0FycmF5ID8gbmF0aXZlSXNBcnJheShvYmopIDogdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgdHJ1ZSBvYmplY3Rcblx0ICovXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuXHRcdHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4dGVuZHMgYW4gb2JqZWN0IHdpdGggYSBkZWZhdWx0cyBvYmplY3QsIHNpbWlsYXIgdG8gdW5kZXJzY29yZSdzIF8uZGVmYXVsdHNcblx0ICpcblx0ICogVXNlZCBmb3IgYWJzdHJhY3RpbmcgcGFyYW1ldGVyIGhhbmRsaW5nIGZyb20gQVBJIG1ldGhvZHNcblx0ICovXG5cdGZ1bmN0aW9uIGRlZmF1bHRzKG9iamVjdCwgZGVmcykge1xuXHRcdHZhciBrZXk7XG5cdFx0b2JqZWN0ID0gb2JqZWN0IHx8IHt9O1xuXHRcdGRlZnMgPSBkZWZzIHx8IHt9O1xuXHRcdC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qgbm9uLXByb3RvdHlwZSBwcm9wZXJ0aWVzOlxuXHRcdGZvciAoa2V5IGluIGRlZnMpIHtcblx0XHRcdGlmIChkZWZzLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0Ly8gUmVwbGFjZSB2YWx1ZXMgd2l0aCBkZWZhdWx0cyBvbmx5IGlmIHVuZGVmaW5lZCAoYWxsb3cgZW1wdHkvemVybyB2YWx1ZXMpOlxuXHRcdFx0XHRpZiAob2JqZWN0W2tleV0gPT0gbnVsbCkgb2JqZWN0W2tleV0gPSBkZWZzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvYmplY3Q7XG5cdH1cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgYEFycmF5Lm1hcCgpYCBmb3IgaXRlcmF0aW9uIGxvb3BzXG5cdCAqXG5cdCAqIFJldHVybnMgYSBuZXcgQXJyYXkgYXMgYSByZXN1bHQgb2YgY2FsbGluZyBgaXRlcmF0b3JgIG9uIGVhY2ggYXJyYXkgdmFsdWUuXG5cdCAqIERlZmVycyB0byBuYXRpdmUgQXJyYXkubWFwIGlmIGF2YWlsYWJsZVxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcblx0XHR2YXIgcmVzdWx0cyA9IFtdLCBpLCBqO1xuXG5cdFx0aWYgKCFvYmopIHJldHVybiByZXN1bHRzO1xuXG5cdFx0Ly8gVXNlIG5hdGl2ZSAubWFwIG1ldGhvZCBpZiBpdCBleGlzdHM6XG5cdFx0aWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcblxuXHRcdC8vIEZhbGxiYWNrIGZvciBuYXRpdmUgLm1hcDpcblx0XHRmb3IgKGkgPSAwLCBqID0gb2JqLmxlbmd0aDsgaSA8IGo7IGkrKyApIHtcblx0XHRcdHJlc3VsdHNbaV0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgYW5kIG5vcm1hbGlzZSB0aGUgdmFsdWUgb2YgcHJlY2lzaW9uIChtdXN0IGJlIHBvc2l0aXZlIGludGVnZXIpXG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja1ByZWNpc2lvbih2YWwsIGJhc2UpIHtcblx0XHR2YWwgPSBNYXRoLnJvdW5kKE1hdGguYWJzKHZhbCkpO1xuXHRcdHJldHVybiBpc05hTih2YWwpPyBiYXNlIDogdmFsO1xuXHR9XG5cblxuXHQvKipcblx0ICogUGFyc2VzIGEgZm9ybWF0IHN0cmluZyBvciBvYmplY3QgYW5kIHJldHVybnMgZm9ybWF0IG9iaiBmb3IgdXNlIGluIHJlbmRlcmluZ1xuXHQgKlxuXHQgKiBgZm9ybWF0YCBpcyBlaXRoZXIgYSBzdHJpbmcgd2l0aCB0aGUgZGVmYXVsdCAocG9zaXRpdmUpIGZvcm1hdCwgb3Igb2JqZWN0XG5cdCAqIGNvbnRhaW5pbmcgYHBvc2AgKHJlcXVpcmVkKSwgYG5lZ2AgYW5kIGB6ZXJvYCB2YWx1ZXMgKG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nXG5cdCAqIGVpdGhlciBhIHN0cmluZyBvciBvYmplY3QpXG5cdCAqXG5cdCAqIEVpdGhlciBzdHJpbmcgb3IgZm9ybWF0LnBvcyBtdXN0IGNvbnRhaW4gXCIldlwiICh2YWx1ZSkgdG8gYmUgdmFsaWRcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrQ3VycmVuY3lGb3JtYXQoZm9ybWF0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gbGliLnNldHRpbmdzLmN1cnJlbmN5LmZvcm1hdDtcblxuXHRcdC8vIEFsbG93IGZ1bmN0aW9uIGFzIGZvcm1hdCBwYXJhbWV0ZXIgKHNob3VsZCByZXR1cm4gc3RyaW5nIG9yIG9iamVjdCk6XG5cdFx0aWYgKCB0eXBlb2YgZm9ybWF0ID09PSBcImZ1bmN0aW9uXCIgKSBmb3JtYXQgPSBmb3JtYXQoKTtcblxuXHRcdC8vIEZvcm1hdCBjYW4gYmUgYSBzdHJpbmcsIGluIHdoaWNoIGNhc2UgYHZhbHVlYCAoXCIldlwiKSBtdXN0IGJlIHByZXNlbnQ6XG5cdFx0aWYgKCBpc1N0cmluZyggZm9ybWF0ICkgJiYgZm9ybWF0Lm1hdGNoKFwiJXZcIikgKSB7XG5cblx0XHRcdC8vIENyZWF0ZSBhbmQgcmV0dXJuIHBvc2l0aXZlLCBuZWdhdGl2ZSBhbmQgemVybyBmb3JtYXRzOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cG9zIDogZm9ybWF0LFxuXHRcdFx0XHRuZWcgOiBmb3JtYXQucmVwbGFjZShcIi1cIiwgXCJcIikucmVwbGFjZShcIiV2XCIsIFwiLSV2XCIpLFxuXHRcdFx0XHR6ZXJvIDogZm9ybWF0XG5cdFx0XHR9O1xuXG5cdFx0Ly8gSWYgbm8gZm9ybWF0LCBvciBvYmplY3QgaXMgbWlzc2luZyB2YWxpZCBwb3NpdGl2ZSB2YWx1ZSwgdXNlIGRlZmF1bHRzOlxuXHRcdH0gZWxzZSBpZiAoICFmb3JtYXQgfHwgIWZvcm1hdC5wb3MgfHwgIWZvcm1hdC5wb3MubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gSWYgZGVmYXVsdHMgaXMgYSBzdHJpbmcsIGNhc3RzIGl0IHRvIGFuIG9iamVjdCBmb3IgZmFzdGVyIGNoZWNraW5nIG5leHQgdGltZTpcblx0XHRcdHJldHVybiAoICFpc1N0cmluZyggZGVmYXVsdHMgKSApID8gZGVmYXVsdHMgOiBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0ID0ge1xuXHRcdFx0XHRwb3MgOiBkZWZhdWx0cyxcblx0XHRcdFx0bmVnIDogZGVmYXVsdHMucmVwbGFjZShcIiV2XCIsIFwiLSV2XCIpLFxuXHRcdFx0XHR6ZXJvIDogZGVmYXVsdHNcblx0XHRcdH07XG5cblx0XHR9XG5cdFx0Ly8gT3RoZXJ3aXNlLCBhc3N1bWUgZm9ybWF0IHdhcyBmaW5lOlxuXHRcdHJldHVybiBmb3JtYXQ7XG5cdH1cblxuXG5cdC8qIC0tLSBBUEkgTWV0aG9kcyAtLS0gKi9cblxuXHQvKipcblx0ICogVGFrZXMgYSBzdHJpbmcvYXJyYXkgb2Ygc3RyaW5ncywgcmVtb3ZlcyBhbGwgZm9ybWF0dGluZy9jcnVmdCBhbmQgcmV0dXJucyB0aGUgcmF3IGZsb2F0IHZhbHVlXG5cdCAqIGFsaWFzOiBhY2NvdW50aW5nLmBwYXJzZShzdHJpbmcpYFxuXHQgKlxuXHQgKiBEZWNpbWFsIG11c3QgYmUgaW5jbHVkZWQgaW4gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBmbG9hdHMgKGRlZmF1bHQ6IFwiLlwiKSwgc28gaWYgdGhlIG51bWJlclxuXHQgKiB1c2VzIGEgbm9uLXN0YW5kYXJkIGRlY2ltYWwgc2VwYXJhdG9yLCBwcm92aWRlIGl0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdCAqXG5cdCAqIEFsc28gbWF0Y2hlcyBicmFja2V0ZWQgbmVnYXRpdmVzIChlZy4gXCIkICgxLjk5KVwiID0+IC0xLjk5KVxuXHQgKlxuXHQgKiBEb2Vzbid0IHRocm93IGFueSBlcnJvcnMgKGBOYU5gcyBiZWNvbWUgMCkgYnV0IHRoaXMgbWF5IGNoYW5nZSBpbiBmdXR1cmVcblx0ICovXG5cdHZhciB1bmZvcm1hdCA9IGxpYi51bmZvcm1hdCA9IGxpYi5wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVjdXJzaXZlbHkgdW5mb3JtYXQgYXJyYXlzOlxuXHRcdGlmIChpc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIG1hcCh2YWx1ZSwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiB1bmZvcm1hdCh2YWwsIGRlY2ltYWwpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gRmFpbHMgc2lsZW50bHkgKG5lZWQgZGVjZW50IGVycm9ycyk6XG5cdFx0dmFsdWUgPSB2YWx1ZSB8fCAwO1xuXG5cdFx0Ly8gUmV0dXJuIHRoZSB2YWx1ZSBhcy1pcyBpZiBpdCdzIGFscmVhZHkgYSBudW1iZXI6XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHZhbHVlO1xuXG5cdFx0Ly8gRGVmYXVsdCBkZWNpbWFsIHBvaW50IGlzIFwiLlwiIGJ1dCBjb3VsZCBiZSBzZXQgdG8gZWcuIFwiLFwiIGluIG9wdHM6XG5cdFx0ZGVjaW1hbCA9IGRlY2ltYWwgfHwgXCIuXCI7XG5cblx0XHQgLy8gQnVpbGQgcmVnZXggdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgZXhjZXB0IGRpZ2l0cywgZGVjaW1hbCBwb2ludCBhbmQgbWludXMgc2lnbjpcblx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiW14wLTktXCIgKyBkZWNpbWFsICsgXCJdXCIsIFtcImdcIl0pLFxuXHRcdFx0dW5mb3JtYXR0ZWQgPSBwYXJzZUZsb2F0KFxuXHRcdFx0XHQoXCJcIiArIHZhbHVlKVxuXHRcdFx0XHQucmVwbGFjZSgvXFwoKC4qKVxcKS8sIFwiLSQxXCIpIC8vIHJlcGxhY2UgYnJhY2tldGVkIHZhbHVlcyB3aXRoIG5lZ2F0aXZlc1xuXHRcdFx0XHQucmVwbGFjZShyZWdleCwgJycpICAgICAgICAgLy8gc3RyaXAgb3V0IGFueSBjcnVmdFxuXHRcdFx0XHQucmVwbGFjZShkZWNpbWFsLCAnLicpICAgICAgLy8gbWFrZSBzdXJlIGRlY2ltYWwgcG9pbnQgaXMgc3RhbmRhcmRcblx0XHRcdCk7XG5cblx0XHQvLyBUaGlzIHdpbGwgZmFpbCBzaWxlbnRseSB3aGljaCBtYXkgY2F1c2UgdHJvdWJsZSwgbGV0J3Mgd2FpdCBhbmQgc2VlOlxuXHRcdHJldHVybiAhaXNOYU4odW5mb3JtYXR0ZWQpID8gdW5mb3JtYXR0ZWQgOiAwO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEltcGxlbWVudGF0aW9uIG9mIHRvRml4ZWQoKSB0aGF0IHRyZWF0cyBmbG9hdHMgbW9yZSBsaWtlIGRlY2ltYWxzXG5cdCAqXG5cdCAqIEZpeGVzIGJpbmFyeSByb3VuZGluZyBpc3N1ZXMgKGVnLiAoMC42MTUpLnRvRml4ZWQoMikgPT09IFwiMC42MVwiKSB0aGF0IHByZXNlbnRcblx0ICogcHJvYmxlbXMgZm9yIGFjY291bnRpbmctIGFuZCBmaW5hbmNlLXJlbGF0ZWQgc29mdHdhcmUuXG5cdCAqL1xuXHR2YXIgdG9GaXhlZCA9IGxpYi50b0ZpeGVkID0gZnVuY3Rpb24odmFsdWUsIHByZWNpc2lvbikge1xuXHRcdHByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKHByZWNpc2lvbiwgbGliLnNldHRpbmdzLm51bWJlci5wcmVjaXNpb24pO1xuXHRcdHZhciBwb3dlciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuXG5cdFx0Ly8gTXVsdGlwbHkgdXAgYnkgcHJlY2lzaW9uLCByb3VuZCBhY2N1cmF0ZWx5LCB0aGVuIGRpdmlkZSBhbmQgdXNlIG5hdGl2ZSB0b0ZpeGVkKCk6XG5cdFx0cmV0dXJuIChNYXRoLnJvdW5kKGxpYi51bmZvcm1hdCh2YWx1ZSkgKiBwb3dlcikgLyBwb3dlcikudG9GaXhlZChwcmVjaXNpb24pO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEZvcm1hdCBhIG51bWJlciwgd2l0aCBjb21tYS1zZXBhcmF0ZWQgdGhvdXNhbmRzIGFuZCBjdXN0b20gcHJlY2lzaW9uL2RlY2ltYWwgcGxhY2VzXG5cdCAqXG5cdCAqIExvY2FsaXNlIGJ5IG92ZXJyaWRpbmcgdGhlIHByZWNpc2lvbiBhbmQgdGhvdXNhbmQgLyBkZWNpbWFsIHNlcGFyYXRvcnNcblx0ICogMm5kIHBhcmFtZXRlciBgcHJlY2lzaW9uYCBjYW4gYmUgYW4gb2JqZWN0IG1hdGNoaW5nIGBzZXR0aW5ncy5udW1iZXJgXG5cdCAqL1xuXHR2YXIgZm9ybWF0TnVtYmVyID0gbGliLmZvcm1hdE51bWJlciA9IGZ1bmN0aW9uKG51bWJlciwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCkge1xuXHRcdC8vIFJlc3Vyc2l2ZWx5IGZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkobnVtYmVyKSkge1xuXHRcdFx0cmV0dXJuIG1hcChudW1iZXIsIGZ1bmN0aW9uKHZhbCkge1xuXHRcdFx0XHRyZXR1cm4gZm9ybWF0TnVtYmVyKHZhbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBDbGVhbiB1cCBudW1iZXI6XG5cdFx0bnVtYmVyID0gdW5mb3JtYXQobnVtYmVyKTtcblxuXHRcdC8vIEJ1aWxkIG9wdGlvbnMgb2JqZWN0IGZyb20gc2Vjb25kIHBhcmFtIChpZiBvYmplY3QpIG9yIGFsbCBwYXJhbXMsIGV4dGVuZGluZyBkZWZhdWx0czpcblx0XHR2YXIgb3B0cyA9IGRlZmF1bHRzKFxuXHRcdFx0XHQoaXNPYmplY3QocHJlY2lzaW9uKSA/IHByZWNpc2lvbiA6IHtcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLm51bWJlclxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgcHJlY2lzaW9uXG5cdFx0XHR1c2VQcmVjaXNpb24gPSBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksXG5cblx0XHRcdC8vIERvIHNvbWUgY2FsYzpcblx0XHRcdG5lZ2F0aXZlID0gbnVtYmVyIDwgMCA/IFwiLVwiIDogXCJcIixcblx0XHRcdGJhc2UgPSBwYXJzZUludCh0b0ZpeGVkKE1hdGguYWJzKG51bWJlciB8fCAwKSwgdXNlUHJlY2lzaW9uKSwgMTApICsgXCJcIixcblx0XHRcdG1vZCA9IGJhc2UubGVuZ3RoID4gMyA/IGJhc2UubGVuZ3RoICUgMyA6IDA7XG5cblx0XHQvLyBGb3JtYXQgdGhlIG51bWJlcjpcblx0XHRyZXR1cm4gbmVnYXRpdmUgKyAobW9kID8gYmFzZS5zdWJzdHIoMCwgbW9kKSArIG9wdHMudGhvdXNhbmQgOiBcIlwiKSArIGJhc2Uuc3Vic3RyKG1vZCkucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csIFwiJDFcIiArIG9wdHMudGhvdXNhbmQpICsgKHVzZVByZWNpc2lvbiA/IG9wdHMuZGVjaW1hbCArIHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyKSwgdXNlUHJlY2lzaW9uKS5zcGxpdCgnLicpWzFdIDogXCJcIik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyIGludG8gY3VycmVuY3lcblx0ICpcblx0ICogVXNhZ2U6IGFjY291bnRpbmcuZm9ybWF0TW9uZXkobnVtYmVyLCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmRzU2VwLCBkZWNpbWFsU2VwLCBmb3JtYXQpXG5cdCAqIGRlZmF1bHRzOiAoMCwgXCIkXCIsIDIsIFwiLFwiLCBcIi5cIiwgXCIlcyV2XCIpXG5cdCAqXG5cdCAqIExvY2FsaXNlIGJ5IG92ZXJyaWRpbmcgdGhlIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9ycyBhbmQgZm9ybWF0XG5cdCAqIFNlY29uZCBwYXJhbSBjYW4gYmUgYW4gb2JqZWN0IG1hdGNoaW5nIGBzZXR0aW5ncy5jdXJyZW5jeWAgd2hpY2ggaXMgdGhlIGVhc2llc3Qgd2F5LlxuXHQgKlxuXHQgKiBUbyBkbzogdGlkeSB1cCB0aGUgcGFyYW1ldGVyc1xuXHQgKi9cblx0dmFyIGZvcm1hdE1vbmV5ID0gbGliLmZvcm1hdE1vbmV5ID0gZnVuY3Rpb24obnVtYmVyLCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwsIGZvcm1hdCkge1xuXHRcdC8vIFJlc3Vyc2l2ZWx5IGZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkobnVtYmVyKSkge1xuXHRcdFx0cmV0dXJuIG1hcChudW1iZXIsIGZ1bmN0aW9uKHZhbCl7XG5cdFx0XHRcdHJldHVybiBmb3JtYXRNb25leSh2YWwsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChzeW1ib2wpID8gc3ltYm9sIDoge1xuXHRcdFx0XHRcdHN5bWJvbCA6IHN5bWJvbCxcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbCxcblx0XHRcdFx0XHRmb3JtYXQgOiBmb3JtYXRcblx0XHRcdFx0fSksXG5cdFx0XHRcdGxpYi5zZXR0aW5ncy5jdXJyZW5jeVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2hlY2sgZm9ybWF0IChyZXR1cm5zIG9iamVjdCB3aXRoIHBvcywgbmVnIGFuZCB6ZXJvKTpcblx0XHRcdGZvcm1hdHMgPSBjaGVja0N1cnJlbmN5Rm9ybWF0KG9wdHMuZm9ybWF0KSxcblxuXHRcdFx0Ly8gQ2hvb3NlIHdoaWNoIGZvcm1hdCB0byB1c2UgZm9yIHRoaXMgdmFsdWU6XG5cdFx0XHR1c2VGb3JtYXQgPSBudW1iZXIgPiAwID8gZm9ybWF0cy5wb3MgOiBudW1iZXIgPCAwID8gZm9ybWF0cy5uZWcgOiBmb3JtYXRzLnplcm87XG5cblx0XHQvLyBSZXR1cm4gd2l0aCBjdXJyZW5jeSBzeW1ib2wgYWRkZWQ6XG5cdFx0cmV0dXJuIHVzZUZvcm1hdC5yZXBsYWNlKCclcycsIG9wdHMuc3ltYm9sKS5yZXBsYWNlKCcldicsIGZvcm1hdE51bWJlcihNYXRoLmFicyhudW1iZXIpLCBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksIG9wdHMudGhvdXNhbmQsIG9wdHMuZGVjaW1hbCkpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEZvcm1hdCBhIGxpc3Qgb2YgbnVtYmVycyBpbnRvIGFuIGFjY291bnRpbmcgY29sdW1uLCBwYWRkaW5nIHdpdGggd2hpdGVzcGFjZVxuXHQgKiB0byBsaW5lIHVwIGN1cnJlbmN5IHN5bWJvbHMsIHRob3VzYW5kIHNlcGFyYXRvcnMgYW5kIGRlY2ltYWxzIHBsYWNlc1xuXHQgKlxuXHQgKiBMaXN0IHNob3VsZCBiZSBhbiBhcnJheSBvZiBudW1iZXJzXG5cdCAqIFNlY29uZCBwYXJhbWV0ZXIgY2FuIGJlIGFuIG9iamVjdCBjb250YWluaW5nIGtleXMgdGhhdCBtYXRjaCB0aGUgcGFyYW1zXG5cdCAqXG5cdCAqIFJldHVybnMgYXJyYXkgb2YgYWNjb3V0aW5nLWZvcm1hdHRlZCBudW1iZXIgc3RyaW5ncyBvZiBzYW1lIGxlbmd0aFxuXHQgKlxuXHQgKiBOQjogYHdoaXRlLXNwYWNlOnByZWAgQ1NTIHJ1bGUgaXMgcmVxdWlyZWQgb24gdGhlIGxpc3QgY29udGFpbmVyIHRvIHByZXZlbnRcblx0ICogYnJvd3NlcnMgZnJvbSBjb2xsYXBzaW5nIHRoZSB3aGl0ZXNwYWNlIGluIHRoZSBvdXRwdXQgc3RyaW5ncy5cblx0ICovXG5cdGxpYi5mb3JtYXRDb2x1bW4gPSBmdW5jdGlvbihsaXN0LCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwsIGZvcm1hdCkge1xuXHRcdGlmICghbGlzdCkgcmV0dXJuIFtdO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChzeW1ib2wpID8gc3ltYm9sIDoge1xuXHRcdFx0XHRcdHN5bWJvbCA6IHN5bWJvbCxcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbCxcblx0XHRcdFx0XHRmb3JtYXQgOiBmb3JtYXRcblx0XHRcdFx0fSksXG5cdFx0XHRcdGxpYi5zZXR0aW5ncy5jdXJyZW5jeVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2hlY2sgZm9ybWF0IChyZXR1cm5zIG9iamVjdCB3aXRoIHBvcywgbmVnIGFuZCB6ZXJvKSwgb25seSBuZWVkIHBvcyBmb3Igbm93OlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBXaGV0aGVyIHRvIHBhZCBhdCBzdGFydCBvZiBzdHJpbmcgb3IgYWZ0ZXIgY3VycmVuY3kgc3ltYm9sOlxuXHRcdFx0cGFkQWZ0ZXJTeW1ib2wgPSBmb3JtYXRzLnBvcy5pbmRleE9mKFwiJXNcIikgPCBmb3JtYXRzLnBvcy5pbmRleE9mKFwiJXZcIikgPyB0cnVlIDogZmFsc2UsXG5cblx0XHRcdC8vIFN0b3JlIHZhbHVlIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IHN0cmluZyBpbiB0aGUgY29sdW1uOlxuXHRcdFx0bWF4TGVuZ3RoID0gMCxcblxuXHRcdFx0Ly8gRm9ybWF0IHRoZSBsaXN0IGFjY29yZGluZyB0byBvcHRpb25zLCBzdG9yZSB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IHN0cmluZzpcblx0XHRcdGZvcm1hdHRlZCA9IG1hcChsaXN0LCBmdW5jdGlvbih2YWwsIGkpIHtcblx0XHRcdFx0aWYgKGlzQXJyYXkodmFsKSkge1xuXHRcdFx0XHRcdC8vIFJlY3Vyc2l2ZWx5IGZvcm1hdCBjb2x1bW5zIGlmIGxpc3QgaXMgYSBtdWx0aS1kaW1lbnNpb25hbCBhcnJheTpcblx0XHRcdFx0XHRyZXR1cm4gbGliLmZvcm1hdENvbHVtbih2YWwsIG9wdHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIENsZWFuIHVwIHRoZSB2YWx1ZVxuXHRcdFx0XHRcdHZhbCA9IHVuZm9ybWF0KHZhbCk7XG5cblx0XHRcdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZSAocG9zLCBuZWcgb3IgemVybyk6XG5cdFx0XHRcdFx0dmFyIHVzZUZvcm1hdCA9IHZhbCA+IDAgPyBmb3JtYXRzLnBvcyA6IHZhbCA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybyxcblxuXHRcdFx0XHRcdFx0Ly8gRm9ybWF0IHRoaXMgdmFsdWUsIHB1c2ggaW50byBmb3JtYXR0ZWQgbGlzdCBhbmQgc2F2ZSB0aGUgbGVuZ3RoOlxuXHRcdFx0XHRcdFx0ZlZhbCA9IHVzZUZvcm1hdC5yZXBsYWNlKCclcycsIG9wdHMuc3ltYm9sKS5yZXBsYWNlKCcldicsIGZvcm1hdE51bWJlcihNYXRoLmFicyh2YWwpLCBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksIG9wdHMudGhvdXNhbmQsIG9wdHMuZGVjaW1hbCkpO1xuXG5cdFx0XHRcdFx0aWYgKGZWYWwubGVuZ3RoID4gbWF4TGVuZ3RoKSBtYXhMZW5ndGggPSBmVmFsLmxlbmd0aDtcblx0XHRcdFx0XHRyZXR1cm4gZlZhbDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHQvLyBQYWQgZWFjaCBudW1iZXIgaW4gdGhlIGxpc3QgYW5kIHNlbmQgYmFjayB0aGUgY29sdW1uIG9mIG51bWJlcnM6XG5cdFx0cmV0dXJuIG1hcChmb3JtYXR0ZWQsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0Ly8gT25seSBpZiB0aGlzIGlzIGEgc3RyaW5nIChub3QgYSBuZXN0ZWQgYXJyYXksIHdoaWNoIHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIHBhZGRlZCk6XG5cdFx0XHRpZiAoaXNTdHJpbmcodmFsKSAmJiB2YWwubGVuZ3RoIDwgbWF4TGVuZ3RoKSB7XG5cdFx0XHRcdC8vIERlcGVuZGluZyBvbiBzeW1ib2wgcG9zaXRpb24sIHBhZCBhZnRlciBzeW1ib2wgb3IgYXQgaW5kZXggMDpcblx0XHRcdFx0cmV0dXJuIHBhZEFmdGVyU3ltYm9sID8gdmFsLnJlcGxhY2Uob3B0cy5zeW1ib2wsIG9wdHMuc3ltYm9sKyhuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSkgOiAobmV3IEFycmF5KG1heExlbmd0aCAtIHZhbC5sZW5ndGggKyAxKS5qb2luKFwiIFwiKSkgKyB2YWw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsO1xuXHRcdH0pO1xuXHR9O1xuXG5cblx0LyogLS0tIE1vZHVsZSBEZWZpbml0aW9uIC0tLSAqL1xuXG5cdC8vIEV4cG9ydCBhY2NvdW50aW5nIGZvciBDb21tb25KUy4gSWYgYmVpbmcgbG9hZGVkIGFzIGFuIEFNRCBtb2R1bGUsIGRlZmluZSBpdCBhcyBzdWNoLlxuXHQvLyBPdGhlcndpc2UsIGp1c3QgYWRkIGBhY2NvdW50aW5nYCB0byB0aGUgZ2xvYmFsIG9iamVjdFxuXHRpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0XHRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBsaWI7XG5cdFx0fVxuXHRcdGV4cG9ydHMuYWNjb3VudGluZyA9IGxpYjtcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBSZXR1cm4gdGhlIGxpYnJhcnkgYXMgYW4gQU1EIG1vZHVsZTpcblx0XHRkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGxpYjtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHQvLyBVc2UgYWNjb3VudGluZy5ub0NvbmZsaWN0IHRvIHJlc3RvcmUgYGFjY291bnRpbmdgIGJhY2sgdG8gaXRzIG9yaWdpbmFsIHZhbHVlLlxuXHRcdC8vIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIGxpYnJhcnkncyBgYWNjb3VudGluZ2Agb2JqZWN0O1xuXHRcdC8vIGUuZy4gYHZhciBudW1iZXJzID0gYWNjb3VudGluZy5ub0NvbmZsaWN0KCk7YFxuXHRcdGxpYi5ub0NvbmZsaWN0ID0gKGZ1bmN0aW9uKG9sZEFjY291bnRpbmcpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gUmVzZXQgdGhlIHZhbHVlIG9mIHRoZSByb290J3MgYGFjY291bnRpbmdgIHZhcmlhYmxlOlxuXHRcdFx0XHRyb290LmFjY291bnRpbmcgPSBvbGRBY2NvdW50aW5nO1xuXHRcdFx0XHQvLyBEZWxldGUgdGhlIG5vQ29uZmxpY3QgbWV0aG9kOlxuXHRcdFx0XHRsaWIubm9Db25mbGljdCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0Ly8gUmV0dXJuIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSB0byByZS1hc3NpZ24gaXQ6XG5cdFx0XHRcdHJldHVybiBsaWI7XG5cdFx0XHR9O1xuXHRcdH0pKHJvb3QuYWNjb3VudGluZyk7XG5cblx0XHQvLyBEZWNsYXJlIGBmeGAgb24gdGhlIHJvb3QgKGdsb2JhbC93aW5kb3cpIG9iamVjdDpcblx0XHRyb290WydhY2NvdW50aW5nJ10gPSBsaWI7XG5cdH1cblxuXHQvLyBSb290IHdpbGwgYmUgYHdpbmRvd2AgaW4gYnJvd3NlciBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyOlxufSh0aGlzKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL2FjY291bnRpbmcuanMvYWNjb3VudGluZy5qc1xuICoqIG1vZHVsZSBpZCA9IDY4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA0IDUgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcInN0eWxlXCIsXCJmXCI6W1wiI2FwcCA+IC53cmFwcGVyID4gLmNvbnRlbnQgeyBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50OyB9XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiYm9va2luZ1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgY2VudGVyIGFsaWduZWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nLmVycm9yXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJiYWNrMlwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJ1dHRvblwifSxcImZcIjpbXCJHbyBCYWNrIHRvIFNlYXJjaCBSZXN1bHRzXCJdfV19XSxcIm5cIjo1MCxcInJcIjpcImJvb2tpbmcuZXJyb3JcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImZcIjpbXCJUaGUgc2ltcGxlc3Qgd2F5IHRvIGJvb2sgIVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJiYWNrXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwidWkgYnV0dG9uIG1pZGRsZSBncmF5IGJhY2tcIn0sXCJmXCI6W1wiR28gQmFjayB0byBTZWFyY2ggUmVzdWx0c1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3VycmVuY3lXcmFwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJDdXJyZW5jeTpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1lbnUgdHJhbnNpdGlvblwiLFwic3R5bGVcIjpcInotaW5kZXg6IDEwMTA7XCIsXCJpZFwiOlwiY3VycmVuY3kxXCJ9LFwidlwiOntcImNoYW5nZVwiOntcIm1cIjpcInNldEN1cnJlbmN5Qm9va2luZ1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpcIklOUlwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wic2VsZWN0ZWRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMD09XFxcIklOUlxcXCJcIn19XSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImluciBpY29uIGN1cnJlbmN5XCJ9fSxcIiBSdXBlZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiVVNEXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiVVNEXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwidXNkIGljb24gY3VycmVuY3lcIn19LFwiIFVTIERvbGxhclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiRVVSXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiRVVSXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiZXVyIGljb24gY3VycmVuY3lcIn19LFwiIEV1cm9cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpcIkdCUFwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wic2VsZWN0ZWRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMD09XFxcIkdCUFxcXCJcIn19XSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImdicCBpY29uIGN1cnJlbmN5XCJ9fSxcIiBVSyBQb3VuZFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiQVVEXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiQVVEXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwidXNkIGljb24gY3VycmVuY3lcIn19LFwiIEF1c3RyYWxpYW4gRG9sbGFyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJKUFlcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJKUFlcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJqcHkgaWNvbiBjdXJyZW5jeVwifX0sXCIgSmFwYW5lc2UgWWVuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJSVUJcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJSVUJcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJydWIgaWNvbiBjdXJyZW5jeVwifX0sXCIgUnVzc2lhbiBSdWJsZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiQUVEXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiQUVEXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiYWVkIGljb24gY3VycmVuY3lcIn19LFwiIERpcmhhbVwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsZWFyXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInN0ZXAxXCIsXCJhXCI6e1wiYm9va2luZ1wiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzdGVwMlwiLFwiYVwiOntcImJvb2tpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3RlcDNcIixcImFcIjp7XCJib29raW5nXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInN0ZXA0XCIsXCJhXCI6e1wiYm9va2luZ1wiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dfV0sXCJyXCI6XCJib29raW5nLmVycm9yXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiYm9va2luZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcImJvb2tpbmdcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImZcIjpbXCJCb29raW5nIG5vdCBmb3VuZCFcIl19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvclwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYWN0aXZlIGludmVydGVkIGRpbW1lclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdGV4dCBsb2FkZXJcIn0sXCJmXCI6W1wiTG9hZGluZ1wiXX1dfV0sXCJyXCI6XCJlcnJvclwifV0sXCJyXCI6XCJib29raW5nXCJ9XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9pbmRleC5odG1sXG4gKiogbW9kdWxlIGlkID0gNjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJylcclxuICAgIDtcclxuXHJcbnZhciBoX21vbmV5ID0gcmVxdWlyZSgnaGVscGVycy9tb25leScpLFxyXG4gICAgaF9kdXJhdGlvbiA9IHJlcXVpcmUoJ2hlbHBlcnMvZHVyYXRpb24nKSgpXHJcbiAgICA7XHJcblxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICBpdGluZXJhcnk6IHJlcXVpcmUoJy4uL2l0aW5lcmFyeScpLFxyXG4gICAgICAgICd1aS1jb2RlJzogcmVxdWlyZSgnY29yZS9mb3JtL2NvZGUnKSxcclxuICAgICAgICAndWktZW1haWwnOiByZXF1aXJlKCdjb3JlL2Zvcm0vZW1haWwnKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcm9tb2NvZGU6bnVsbCxcclxuICAgICAgICAgICAgcHJvbW92YWx1ZTpudWxsLFxyXG4gICAgICAgICAgICBwcm9tb2Vycm9yOm51bGwsXHJcbiAgICAgICAgICAgIG1vbmV5OiBoX21vbmV5LFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogaF9kdXJhdGlvbixcclxuXHJcbiAgICAgICAgICAgIHNlZ19sZW5ndGg6IGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gMDtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChmbGlnaHRzLCBmdW5jdGlvbihmbGlnaHQpIHsgYyArPSBmbGlnaHQuZ2V0KCdzZWdtZW50cycpLmxlbmd0aDsgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ2Jvb2tpbmcuc3RlcHMuMS5hY3RpdmUnLCBmdW5jdGlvbihhY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGE9dGhpcy5nZXQoJ2Jvb2tpbmcnKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5nZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgncHJvbW9jb2RlJyx0aGlzLmdldCgnYm9va2luZy5wcm9tb19jb2RlJykpO1xyXG4gICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdwcm9tb3ZhbHVlJyx0aGlzLmdldCgnYm9va2luZy5wcm9tb192YWx1ZScpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjdXI9dGhpcy5nZXQoJ2Jvb2tpbmcuY3VycmVuY3knKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3VyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdtZXRhLmRpc3BsYXlfY3VycmVuY3knLGN1ciApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgnbWV0YScpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5nZXQoJ21ldGEnKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSxcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCcucHJpY2UnKSlcclxuICAgICAgICAgICAgLnBvcHVwKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2JvdHRvbSByaWdodCcsXHJcbiAgICAgICAgICAgICAgICBwb3B1cDogJCh0aGlzLmZpbmQoJy5mYXJlLnBvcHVwJykpLFxyXG4gICAgICAgICAgICAgICAgb246ICdob3ZlcidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5nZXQoJ2Jvb2tpbmcuaWQnKSk7XHJcbiAgICAgICAvLyAkKHRoaXMuZmluZCgnZm9ybScpKS5hamF4U3VibWl0KHt1cmw6ICdhYm91dDpibGFuaycsIG1ldGhvZDogJ1BPU1QnLCBpZnJhbWU6IHRydWV9KTtcclxuICAgICAgICB0aGlzLmdldCgnYm9va2luZycpLnN0ZXAxKCk7XHJcblxyXG4gICAgICAgIGlmIChNT0JJTEUgJiYgd2luZG93LmxvY2FsU3RvcmFnZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tpbmdfZW1haWwnLCB0aGlzLmdldCgnYm9va2luZy51c2VyLmVtYWlsJykpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tpbmdfY291bnRyeScsIHRoaXMuZ2V0KCdib29raW5nLnVzZXIuY291bnRyeScpKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29raW5nX21vYmlsZScsIHRoaXMuZ2V0KCdib29raW5nLnVzZXIubW9iaWxlJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQuYmFjaygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7IGlmICghdGhpcy5nZXQoJ2Jvb2tpbmcucGF5bWVudC5wYXltZW50X2lkJykpIHRoaXMuZ2V0KCdib29raW5nJykuYWN0aXZhdGUoMSk7IH0sXHJcblxyXG4gICAgc2lnbmluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIEF1dGgubG9naW4oKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnbWV0YS51c2VyJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy51c2VyJywgeyBpZDogZGF0YS5pZCwgZW1haWw6IGRhdGEuZW1haWwsIG1vYmlsZTogZGF0YS5tb2JpbGUsY291bnRyeTpkYXRhLmNvdW50cnksIGxvZ2dlZF9pbjogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgYXBwbHlQcm9tb0NvZGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgXHJcbiAgICAgICAgICB2YXIgcHJvbW9jb2RlPXRoaXMuZ2V0KCdwcm9tb2NvZGUnKTtcclxuICAgICAgICAgIHRoaXMuc2V0KCdwcm9tb2Vycm9yJyxudWxsKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzOyAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpLHByb21vOnByb21vY29kZX07XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL2NoZWNrUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmhhc093blByb3BlcnR5KCdlcnJvcicpKXsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb2Vycm9yJyxkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb3ZhbHVlJyxkYXRhLnZhbHVlKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Jvb2tpbmcucHJvbW9fdmFsdWUnLGRhdGEudmFsdWUpOyBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb19jb2RlJyxkYXRhLmNvZGUpOyBcclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUHJvbW9Db2RlOmZ1bmN0aW9uKCl7XHJcbiAgICAgLy8gICBjb25zb2xlLmxvZygncmVtb3ZlUHJvbW9Db2RlJyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vZXJyb3InLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb2NvZGUnLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb3ZhbHVlJyxudWxsKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzOyAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvcmVtb3ZlUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb192YWx1ZScsbnVsbCk7IFxyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScsbnVsbCk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlRXJyb3JNc2c6ZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICB9XHJcblxyXG5cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXAxLmpzXG4gKiogbW9kdWxlIGlkID0gNzJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJylcclxuICAgIDtcclxuXHJcbnZhciBBdXRoID0gRm9ybS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnbG9naW4nLFxyXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZm9yZ290dGVucGFzczogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICB1c2VyOiB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3BvcHVwJykpIHtcclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvJyArIHRoaXMuZ2V0KCdhY3Rpb24nKSxcclxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSwgcGFzc3dvcmQ6IHRoaXMuZ2V0KCd1c2VyLnBhc3N3b3JkJykgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2aWV3LmdldCgncG9wdXAnKT09bnVsbCAmJiBkYXRhICYmIGRhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldFBhc3N3b3JkOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL2ZvcmdvdHRlbnBhc3MnLFxyXG4gICAgICAgICAgICBkYXRhOiB7IGVtYWlsOiB0aGlzLmdldCgndXNlci5sb2dpbicpIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgncmVzZXRzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaWdudXA6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC9zaWdudXAnLFxyXG4gICAgICAgICAgICBkYXRhOiBfLnBpY2sodGhpcy5nZXQoJ3VzZXInKSwgWydlbWFpbCcsJ25hbWUnLCAnbW9iaWxlJywgJ3Bhc3N3b3JkJywgJ3Bhc3N3b3JkMiddKSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzaWdudXBzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5BdXRoLmxvZ2luID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XHJcblxyXG4gICAgYXV0aC5zZXQoJ3BvcHVwJywgdHJ1ZSk7XHJcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xyXG4gICAgYXV0aC5yZW5kZXIoJyNwb3B1cC1jb250YWluZXInKTtcclxuXHJcbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xyXG59O1xyXG5cclxuQXV0aC5zaWdudXAgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcclxuXHJcbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcclxuICAgIGF1dGguc2V0KCdzaWdudXAnLCB0cnVlKTtcclxuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGg7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanNcbiAqKiBtb2R1bGUgaWQgPSA3M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMyA0IDUgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbG9naW4gc21hbGwgbW9kYWxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIkxvZ2luXCJdLFwiblwiOjUxLFwieFwiOntcInJcIjpbXCJmb3Jnb3R0ZW5wYXNzXCIsXCJzaWdudXBcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlNpZ24tdXBcIl0sXCJuXCI6NTAsXCJyXCI6XCJzaWdudXBcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiUmVzZXQgcGFzc3dvcmRcIl0sXCJuXCI6NTAsXCJyXCI6XCJmb3Jnb3R0ZW5wYXNzXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJwb3B1cFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XSxcInJcIjpcInBvcHVwXCJ9XSxcInBcIjp7XCJmb3JtXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJmb3JtXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widWkgYmFzaWMgc2VnbWVudCBmb3JtXCJdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdWJtaXR0aW5nXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImhpZGVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImZvcmdvdHRlbnBhc3NcIixcInNpZ251cFwiXSxcInNcIjpcIl8wfHxfMVwifX1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsb2dpblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmxvZ2luXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkxvZ2luXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicGFzc3dvcmRcIixcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIucGFzc3dvcmRcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmRcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6W1widWkgXCIse1widFwiOjQsXCJmXCI6W1wic21hbGxcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJtYXNzaXZlXCJdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJdfSxcImZcIjpbXCJMT0dJTlwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6XCJmb3Jnb3QtcGFzc3dvcmRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImZvcmdvdHRlbnBhc3NcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiRm9yZ290IFBhc3N3b3JkP1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIkRvbuKAmXQgaGF2ZSBhIENoZWFwVGlja2V0LmluIEFjY291bnQ/IFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzaWdudXBcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiU2lnbiB1cCBmb3Igb25lIMK7XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcInNpZ251cFwifV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmVtYWlsXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibW9iaWxlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIubW9iaWxlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZVwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIm5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5uYW1lXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIk5hbWVcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwibmFtZVwiOlwicGFzc3dvcmRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJuYW1lXCI6XCJwYXNzd29yZDJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZDJcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmQgYWdhaW5cIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJidXR0b25cIixcImNsYXNzXCI6XCJ1aSBtYXNzaXZlIGZsdWlkIGJsdWUgYnV0dG9uIHVwcGVyY2FzZVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNpZ251cFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiU2lnbnVwXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV0sXCJuXCI6NTEsXCJyXCI6XCJzaWdudXBzdWNjZXNzXCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiWW91ciByZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3MuXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIllvdSB3aWxsIHJlY2VpdmUgZW1haWwgd2l0aCBmdXJ0aGVyIGluc3RydWN0aW9ucyBmcm9tIHVzIGhvdyB0byBwcm9jZWVkLlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJQbGVhc2UgY2hlY2sgeW91ciBpbmJveCBhbmQgaWYgbm8gZW1haWwgZnJvbSB1cyBpcyBmb3VuZCwgY2hlY2sgYWxzbyB5b3VyIFNQQU0gZm9sZGVyLlwiXSxcIm5cIjo1MCxcInJcIjpcInNpZ251cHN1Y2Nlc3NcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcImZvcmdvdHRlbnBhc3NcIn1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibG9naW5cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5sb2dpblwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJFbWFpbFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIG1hc3NpdmUgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVzZXRQYXNzd29yZFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiUkVTRVRcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yTXNnXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2dcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19XSxcIm5cIjo1MSxcInJcIjpcInJlc2V0c3VjY2Vzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJJbnN0cnVjdGlvbnMgaG93IHRvIHJldml2ZSB5b3VyIHBhc3N3b3JkIGhhcyBiZWVuIHNlbnQgdG8geW91ciBlbWFpbC5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwuXCJdLFwiblwiOjUwLFwiclwiOlwicmVzZXRzdWNjZXNzXCJ9XX1dfV19fTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2FwcC9hdXRoLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA3NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMyA0IDUgOFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIHBhZGR5KG4sIHAsIGMpIHtcclxuICAgIHZhciBwYWRfY2hhciA9IHR5cGVvZiBjICE9PSAndW5kZWZpbmVkJyA/IGMgOiAnMCc7XHJcbiAgICB2YXIgcGFkID0gbmV3IEFycmF5KDEgKyBwKS5qb2luKHBhZF9jaGFyKTtcclxuICAgIHJldHVybiAocGFkICsgbikuc2xpY2UoLXBhZC5sZW5ndGgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmb3JtYXQ6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghZHVyYXRpb24pXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB2YXIgaSA9IGR1cmF0aW9uLmFzTWludXRlcygpLFxyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBNYXRoLmZsb29yKGkvNjApLFxyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IGkgJSA2MFxyXG4gICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhZGR5KGhvdXJzLCAyKSArICdoICcgKyBwYWRkeShtaW51dGVzLCAyKSArICdtJztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9oZWxwZXJzL2R1cmF0aW9uLmpzXG4gKiogbW9kdWxlIGlkID0gNzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDhcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGVwIGhlYWRlciBzdGVwMSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiY29tcGxldGVkXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5jb21wbGV0ZWRcIn1dLFwiclwiOlwic3RlcC5hY3RpdmVcIn1dLFwicm9sZVwiOlwidGFiXCJ9LFwiZlwiOltcIkl0aW5lcmFyeVwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwic3RlcDEtc3VtbWFyeSBzZWdtZW50XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYWN0aXZhdGVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbMV1cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwibG9nb1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmNhcnJpZXIubG9nb1wifX1dLFwiYWx0XCI6XCJcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuY2Fycmllci5uYW1lXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbFwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmZsaWdodFwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRpbmVyYXJ5XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuZnJvbS5jaXR5XCJ9fSxcIiDihpIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkudG8uY2l0eVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwic21hbGxcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJEIE1NTSwgWVlZWVxcXCIpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJkdXJhdGlvblwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIkhIOm1tXFxcIilcIn19LFwiIOKAlCBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5hcnJpdmUuZm9ybWF0KFxcXCJISDptbVxcXCIpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbFwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImR1cmF0aW9uXCIsXCJ0aW1lXCJdLFwic1wiOlwiXzAuZm9ybWF0KF8xKVwifX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInJvd3NwYW5cIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlZ19sZW5ndGhcIixcImJvb2tpbmcuZmxpZ2h0c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dLFwiY2xhc3NcIjpcInByaWNlXCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiLSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJvbW9fdmFsdWVcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiPSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcucHJvbW9fdmFsdWVcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMS1fMixfMylcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLnByb21vX3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wicm93c3BhblwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VnX2xlbmd0aFwiLFwiYm9va2luZy5mbGlnaHRzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV0sXCJjbGFzc1wiOlwicHJpY2VcIn0sXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX1dfV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmcucHJvbW9fdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJpXCIsXCJqXCJdLFwic1wiOlwiXzA9PTAmJl8xPT0wXCJ9fV19XSxcIm5cIjo1MixcImlcIjpcImpcIixcInJcIjpcInNlZ21lbnRzXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImJvb2tpbmcuZmxpZ2h0c1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic3RlcC5hY3RpdmVcIixcInN0ZXAuY29tcGxldGVkXCJdLFwic1wiOlwiIV8wJiZfMVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpbXCJ1aSBmb3JtIHNlZ21lbnQgc3RlcDEgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5zdWJtaXR0aW5nXCJ9XX0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaXRpbmVyYXJ5XCIsXCJhXCI6e1wiZmxpZ2h0XCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19fV0sXCJuXCI6NTIsXCJyXCI6XCJib29raW5nLmZsaWdodHNcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgc2VnbWVudCBib29raW5nLWNvbnRhY3RzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIn0sXCJmXCI6W1wiQ29udGFjdCBEZXRhaWxzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0d28gY29sdW1uIG1pZGRsZSB0b3AgYWxpZ25lZCByZWxheGVkIGZpdHRlZCBncmlkXCIsXCJzdHlsZVwiOlwicG9zaXRpb246IHJlbGF0aXZlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIixcInN0eWxlXCI6XCJ3aWR0aDogNjUlO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidHdvIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbXCJFLU1haWxcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktZW1haWxcIixcImFcIjp7XCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJib2xkXCJdLFwiblwiOjUwLFwiclwiOlwiYm9va2luZy51c2VyLmVtYWlsXCJ9XSxcIm5hbWVcIjpcImVtYWlsXCIsXCJwbGFjZWhvbGRlclwiOlwiRS1NYWlsXCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLmVtYWlsXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZy51c2VyLmVtYWlsXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGQgcGhvbmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbXCJNb2JpbGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwiY29kZSBpbnB1dFwiLFwibmFtZVwiOlwibW9iaWxlXCIsXCJwbGFjZWhvbGRlclwiOlwiQ29kZVwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5tb2JpbGVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nLnVzZXIuY291bnRyeVwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJudW1iZXIgXCIse1widFwiOjQsXCJmXCI6W1wiYm9sZFwiXSxcIm5cIjo1MCxcInJcIjpcImJvb2tpbmcudXNlci5tb2JpbGVcIn1dLFwibmFtZVwiOlwibW9iaWxlXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9iaWxlXCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm1vYmlsZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcudXNlci5tb2JpbGVcIn1dfX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcInN0ZXAuZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5lcnJvcnNcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW4gdG9wIGNlbnRlciBhbGlnbmVkXCIsXCJzdHlsZVwiOlwid2lkdGg6IDM1JTtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIkhhdmUgYSBDaGVhcFRpY2tldC5pbiBBY2NvdW50PyBTaWduIGluIGhlcmUhXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIGJ1dHRvbiBzbWFsbCBibHVlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2lnbmluXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJTaWduIGluXCJdfV0sXCJuXCI6NTEsXCJyXCI6XCJtZXRhLnVzZXIuZW1haWxcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d28gZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwcm9tb2NvZGVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvbW9jb2RlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCBcIixcInBsYWNlaG9sZGVyXCI6XCJFbnRlciBQcm9tbyBDb2RlXCIsXCJkaXNhYmxlZFwiOlwiZGlzYWJsZWRcIn0sXCJmXCI6W119XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInByb21vY29kZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9tb2NvZGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIkVudGVyIFByb21vIENvZGVcIn0sXCJmXCI6W119XSxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVtb3ZlUHJvbW9Db2RlXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlZCByZW1vdmUgY2lyY2xlIG91dGxpbmUgaWNvblwiLFwiYWx0XCI6XCJSZW1vdmUgUHJvbW8gQ29kZVwiLFwidGl0bGVcIjpcIlJlbW92ZSBQcm9tbyBDb2RlXCJ9fV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgYnV0dG9uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYXBwbHlQcm9tb0NvZGVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIkFQUExZXCJdfV0sXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwiY2xlYXI6Ym90aDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNtYWxsIGZpZWxkIG5lZ2F0aXZlIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVtb3ZlRXJyb3JNc2dcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19fSxcIiBcIix7XCJ0XCI6MixcInJcIjpcInByb21vZXJyb3JcIn1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicHJvbW9lcnJvclwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jbGllbnRTb3VyY2VJZFwiXSxcInNcIjpcIl8wPT0xXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIHdpemFyZCBidXR0b24gbWFzc2l2ZSBibHVlXCJ9LFwiZlwiOltcIkNPTlRJTlVFXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJpZ2h0IGFsaWduZWQgY29sdW1uXCJ9LFwiZlwiOltcIlRPVEFMOlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiAtIFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicHJvbW92YWx1ZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgPSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcInByb21vdmFsdWVcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMS1fMixfMylcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicHJpY2VcIn0sXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX1dfV0sXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGF4ZXNcIn0sXCJmXCI6W1wiQmFzaWMgRmFyZTogXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnRheGVzLmJhc2ljX2ZhcmVcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiICwgWVE6IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy50YXhlcy55cVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIsIFNlcnZpY2UgVGF4OiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcudGF4ZXMuam5cIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiLCBPdGhlcjogXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnRheGVzLm90aGVyXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV19XX1dfV19XX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5hY3RpdmVcIn1dLFwieFwiOntcInJcIjpbXCJzdGVwLmFjdGl2ZVwiLFwic3RlcC5jb21wbGV0ZWRcIl0sXCJzXCI6XCIhXzAmJl8xXCJ9fV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuc3RlcHMuMVwiXSxcInNcIjpcIntzdGVwOl8wfVwifX0se1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZhcmUgZmx1aWQgcG9wdXBcIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiBsZWZ0OyBtYXgtd2lkdGg6IDI4MHB4O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGF4VGF4ZXMuMS5jXCJ9LFwieCBhZHVsdHM6IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMS5iYXNpY19mYXJlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIFlROlwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMS55cVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBKTjpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjEuam5cIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgT1RIRVI6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwYXhUYXhlcy4xLm90aGVyXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn1dLFwiblwiOjUwLFwiclwiOlwicGF4VGF4ZXMuMVwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwYXhUYXhlcy4yLmNcIn0sXCJ4IGNoaWxkcmVuOiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjIuYmFzaWNfZmFyZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBZUTpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjIueXFcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgSk46XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwYXhUYXhlcy4yLmpuXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIE9USEVSOlwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMi5vdGhlclwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9XSxcIm5cIjo1MCxcInJcIjpcInBheFRheGVzLjJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGF4VGF4ZXMuMy5jXCJ9LFwieCBpbmZhbnRzOiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjMuYmFzaWNfZmFyZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBZUTpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjMueXFcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgSk46XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwYXhUYXhlcy4zLmpuXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIE9USEVSOlwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMy5vdGhlclwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9XSxcIm5cIjo1MCxcInJcIjpcInBheFRheGVzLjNcIn1dfV0sXCJyXCI6XCJib29raW5nXCJ9XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDc2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuXHJcbiAgICBoX21vbmV5ID0gcmVxdWlyZSgnaGVscGVycy9tb25leScpKCksXHJcbiAgICBoX2R1cmF0aW9uID0gcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKClcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvaXRpbmVyYXJ5Lmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gXy5leHRlbmQoXHJcbiAgICAgICAgICAgIHsgbW9tZW50OiBtb21lbnQsIG1vbmV5OiBoX21vbmV5Lm1vbmV5LCBkdXJhdGlvbjogaF9kdXJhdGlvbiB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9pdGluZXJhcnkuanNcbiAqKiBtb2R1bGUgaWQgPSA3N1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgc2VnbWVudCBmbGlnaHQtaXRpbmVyYXJ5IFwiLHtcInRcIjo0LFwiZlwiOltcInNtYWxsXCJdLFwiblwiOjUwLFwiclwiOlwic21hbGxcIixcInNcIjp0cnVlfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImNsYXNzXCIsXCJzXCI6dHJ1ZX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGl0bGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjaXR5XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuZnJvbS5jaXR5XCJ9fSxcIiDihpIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkudG8uY2l0eVwifX1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuZGVwYXJ0LmZvcm1hdChcXFwiZGRkIE1NTSBEIFlZWVlcXFwiKVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJkdXJhdGlvblwiLFwic2VndGltZVwiLFwiLlwiXSxcInNcIjpcIl8wLmZvcm1hdChfMShfMikpXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmxpZ2h0LnJlZnVuZGFibGVcIl0sXCJzXCI6XCJbbnVsbCxcXFwiTm9uIHJlZnVuZGFibGVcXFwiLFxcXCJSZWZ1bmRhYmxlXFxcIl1bXzBdXCJ9fV0sXCJuXCI6NTAsXCJyXCI6XCJzbWFsbFwiLFwic1wiOnRydWV9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJzZWdtZW50c1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpdmlkZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiYWxpZ25cIjpcImNlbnRlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImxheW92ZXJcIn0sXCJmXCI6W1wiTGF5b3ZlcjogXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImR1cmF0aW9uXCIsXCJsYXlvdmVyXCJdLFwic1wiOlwiXzAuZm9ybWF0KF8xKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibGF5b3ZlclwiXSxcInNcIjpcIl8wLmFzU2Vjb25kcygpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiYWlybGluZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibG9nb3NcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRvcCBhbGlnbmVkIGF2YXRhciBpbWFnZVwiLFwic3JjXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllci5sb2dvXCJ9XSxcImFsdFwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXIubmFtZVwifV0sXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXIubmFtZVwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5hbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllci5uYW1lXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsaWdodC1ub1wifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHRcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImNhYmluVHlwZVwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImZyb21cIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiByaWdodDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImZyb20uYWlycG9ydENvZGVcIn0sXCI6XCJdfSx7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifV0sXCJuXCI6NTAsXCJyXCI6XCJzbWFsbFwiLFwic1wiOnRydWV9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJkZXBhcnRcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcImRkZCBISDptbVxcXCIpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJzbWFsbFwiLFwiZGVwYXJ0XCJdLFwic1wiOlwiXzA/XzEuZm9ybWF0KFxcXCJEIE1NTVxcXCIpOl8xLmZvcm1hdChcXFwiRCBNTU0sIFlZWVlcXFwiKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZnJvbS5haXJwb3J0XCJ9LFwiLCBcIix7XCJ0XCI6MixcInJcIjpcImZyb20uY2l0eVwifSxcIsKgKFwiLHtcInRcIjoyLFwiclwiOlwiZnJvbS5haXJwb3J0Q29kZVwifSxcIiksIFRlcm1pbmFswqBcIix7XCJ0XCI6MixcInJcIjpcIm9yaWdpblRlcm1pbmFsXCJ9XX1dLFwiblwiOjUxLFwiclwiOlwic21hbGxcIixcInNcIjp0cnVlfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsaWdodFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZHVyYXRpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJkdXJhdGlvblwiLFwidGltZVwiXSxcInNcIjpcIl8wLmZvcm1hdChfMSlcIn19XX1dfV0sXCJuXCI6NTEsXCJyXCI6XCJzbWFsbFwiLFwic1wiOnRydWV9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwidG9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRvLmFpcnBvcnRDb2RlXCJ9LFwiOlwiXX0se1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn1dLFwiblwiOjUwLFwiclwiOlwic21hbGxcIixcInNcIjp0cnVlfSx7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiYXJyaXZlXCJdLFwic1wiOlwiXzAuZm9ybWF0KFxcXCJkZGQgSEg6bW1cXFwiKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic21hbGxcIixcImFycml2ZVwiXSxcInNcIjpcIl8wP18xLmZvcm1hdChcXFwiRCBNTU1cXFwiKTpfMS5mb3JtYXQoXFxcIkQgTU1NLCBZWVlZXFxcIilcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJwb3J0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRvLmFpcnBvcnRcIn0sXCIsIFwiLHtcInRcIjoyLFwiclwiOlwidG8uY2l0eVwifSxcIsKgKFwiLHtcInRcIjoyLFwiclwiOlwidG8uYWlycG9ydENvZGVcIn0sXCIpLCBUZXJtaW5hbMKgXCIse1widFwiOjIsXCJyXCI6XCJkZXN0aW5hdGlvblRlcm1pbmFsXCJ9XX1dLFwiblwiOjUxLFwiclwiOlwic21hbGxcIixcInNcIjp0cnVlfV19XX1dLFwiblwiOjUyLFwiclwiOlwiLlwifV19XX1dLFwiblwiOjUyLFwiclwiOlwic2VnbWVudHNcIn1dLFwiclwiOlwiZmxpZ2h0XCJ9XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2l0aW5lcmFyeS5odG1sXG4gKiogbW9kdWxlIGlkID0gNzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50JyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuICAgIDtcclxuXHJcbnZhciBhbGxDb3VudHJpZXMgPSBbXHJcbiAgICBbXHJcbiAgICAgICAgXCJJbmRpYSAo4KSt4KS+4KSw4KSkKVwiLFxyXG4gICAgICAgIFwiaW5cIixcclxuICAgICAgICBcIjkxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBZmdoYW5pc3RhbiAo4oCr2KfZgdi62KfZhtiz2KrYp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiYWZcIixcclxuICAgICAgICBcIjkzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBbGJhbmlhIChTaHFpcMOrcmkpXCIsXHJcbiAgICAgICAgXCJhbFwiLFxyXG4gICAgICAgIFwiMzU1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBbGdlcmlhICjigKvYp9mE2KzYstin2KbYseKArOKAjilcIixcclxuICAgICAgICBcImR6XCIsXHJcbiAgICAgICAgXCIyMTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFtZXJpY2FuIFNhbW9hXCIsXHJcbiAgICAgICAgXCJhc1wiLFxyXG4gICAgICAgIFwiMTY4NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQW5kb3JyYVwiLFxyXG4gICAgICAgIFwiYWRcIixcclxuICAgICAgICBcIjM3NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQW5nb2xhXCIsXHJcbiAgICAgICAgXCJhb1wiLFxyXG4gICAgICAgIFwiMjQ0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBbmd1aWxsYVwiLFxyXG4gICAgICAgIFwiYWlcIixcclxuICAgICAgICBcIjEyNjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFudGlndWEgYW5kIEJhcmJ1ZGFcIixcclxuICAgICAgICBcImFnXCIsXHJcbiAgICAgICAgXCIxMjY4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBcmdlbnRpbmFcIixcclxuICAgICAgICBcImFyXCIsXHJcbiAgICAgICAgXCI1NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQXJtZW5pYSAo1YDVodW11aHVvdW/1aHVtilcIixcclxuICAgICAgICBcImFtXCIsXHJcbiAgICAgICAgXCIzNzRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFydWJhXCIsXHJcbiAgICAgICAgXCJhd1wiLFxyXG4gICAgICAgIFwiMjk3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBdXN0cmFsaWFcIixcclxuICAgICAgICBcImF1XCIsXHJcbiAgICAgICAgXCI2MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQXVzdHJpYSAow5ZzdGVycmVpY2gpXCIsXHJcbiAgICAgICAgXCJhdFwiLFxyXG4gICAgICAgIFwiNDNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkF6ZXJiYWlqYW4gKEF6yZlyYmF5Y2FuKVwiLFxyXG4gICAgICAgIFwiYXpcIixcclxuICAgICAgICBcIjk5NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmFoYW1hc1wiLFxyXG4gICAgICAgIFwiYnNcIixcclxuICAgICAgICBcIjEyNDJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJhaHJhaW4gKOKAq9in2YTYqNit2LHZitmG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiYmhcIixcclxuICAgICAgICBcIjk3M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmFuZ2xhZGVzaCAo4Kas4Ka+4KaC4Kay4Ka+4Kam4KeH4Ka2KVwiLFxyXG4gICAgICAgIFwiYmRcIixcclxuICAgICAgICBcIjg4MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmFyYmFkb3NcIixcclxuICAgICAgICBcImJiXCIsXHJcbiAgICAgICAgXCIxMjQ2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZWxhcnVzICjQkdC10LvQsNGA0YPRgdGMKVwiLFxyXG4gICAgICAgIFwiYnlcIixcclxuICAgICAgICBcIjM3NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmVsZ2l1bSAoQmVsZ2nDqylcIixcclxuICAgICAgICBcImJlXCIsXHJcbiAgICAgICAgXCIzMlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmVsaXplXCIsXHJcbiAgICAgICAgXCJielwiLFxyXG4gICAgICAgIFwiNTAxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZW5pbiAoQsOpbmluKVwiLFxyXG4gICAgICAgIFwiYmpcIixcclxuICAgICAgICBcIjIyOVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmVybXVkYVwiLFxyXG4gICAgICAgIFwiYm1cIixcclxuICAgICAgICBcIjE0NDFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJodXRhbiAo4L2g4L2W4L6y4L204L2CKVwiLFxyXG4gICAgICAgIFwiYnRcIixcclxuICAgICAgICBcIjk3NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQm9saXZpYVwiLFxyXG4gICAgICAgIFwiYm9cIixcclxuICAgICAgICBcIjU5MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQm9zbmlhIGFuZCBIZXJ6ZWdvdmluYSAo0JHQvtGB0L3QsCDQuCDQpdC10YDRhtC10LPQvtCy0LjQvdCwKVwiLFxyXG4gICAgICAgIFwiYmFcIixcclxuICAgICAgICBcIjM4N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQm90c3dhbmFcIixcclxuICAgICAgICBcImJ3XCIsXHJcbiAgICAgICAgXCIyNjdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJyYXppbCAoQnJhc2lsKVwiLFxyXG4gICAgICAgIFwiYnJcIixcclxuICAgICAgICBcIjU1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCcml0aXNoIEluZGlhbiBPY2VhbiBUZXJyaXRvcnlcIixcclxuICAgICAgICBcImlvXCIsXHJcbiAgICAgICAgXCIyNDZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJyaXRpc2ggVmlyZ2luIElzbGFuZHNcIixcclxuICAgICAgICBcInZnXCIsXHJcbiAgICAgICAgXCIxMjg0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCcnVuZWlcIixcclxuICAgICAgICBcImJuXCIsXHJcbiAgICAgICAgXCI2NzNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJ1bGdhcmlhICjQkdGK0LvQs9Cw0YDQuNGPKVwiLFxyXG4gICAgICAgIFwiYmdcIixcclxuICAgICAgICBcIjM1OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQnVya2luYSBGYXNvXCIsXHJcbiAgICAgICAgXCJiZlwiLFxyXG4gICAgICAgIFwiMjI2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCdXJ1bmRpIChVYnVydW5kaSlcIixcclxuICAgICAgICBcImJpXCIsXHJcbiAgICAgICAgXCIyNTdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNhbWJvZGlhICjhnoDhnpjhn5LhnpbhnrvhnofhnrYpXCIsXHJcbiAgICAgICAgXCJraFwiLFxyXG4gICAgICAgIFwiODU1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDYW1lcm9vbiAoQ2FtZXJvdW4pXCIsXHJcbiAgICAgICAgXCJjbVwiLFxyXG4gICAgICAgIFwiMjM3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDYW5hZGFcIixcclxuICAgICAgICBcImNhXCIsXHJcbiAgICAgICAgXCIxXCIsXHJcbiAgICAgICAgMSxcclxuICAgICAgICBbXCIyMDRcIiwgXCIyMjZcIiwgXCIyMzZcIiwgXCIyNDlcIiwgXCIyNTBcIiwgXCIyODlcIiwgXCIzMDZcIiwgXCIzNDNcIiwgXCIzNjVcIiwgXCIzODdcIiwgXCI0MDNcIiwgXCI0MTZcIiwgXCI0MThcIiwgXCI0MzFcIiwgXCI0MzdcIiwgXCI0MzhcIiwgXCI0NTBcIiwgXCI1MDZcIiwgXCI1MTRcIiwgXCI1MTlcIiwgXCI1NDhcIiwgXCI1NzlcIiwgXCI1ODFcIiwgXCI1ODdcIiwgXCI2MDRcIiwgXCI2MTNcIiwgXCI2MzlcIiwgXCI2NDdcIiwgXCI2NzJcIiwgXCI3MDVcIiwgXCI3MDlcIiwgXCI3NDJcIiwgXCI3NzhcIiwgXCI3ODBcIiwgXCI3ODJcIiwgXCI4MDdcIiwgXCI4MTlcIiwgXCI4MjVcIiwgXCI4NjdcIiwgXCI4NzNcIiwgXCI5MDJcIiwgXCI5MDVcIl1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDYXBlIFZlcmRlIChLYWJ1IFZlcmRpKVwiLFxyXG4gICAgICAgIFwiY3ZcIixcclxuICAgICAgICBcIjIzOFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2FyaWJiZWFuIE5ldGhlcmxhbmRzXCIsXHJcbiAgICAgICAgXCJicVwiLFxyXG4gICAgICAgIFwiNTk5XCIsXHJcbiAgICAgICAgMVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNheW1hbiBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJreVwiLFxyXG4gICAgICAgIFwiMTM0NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2VudHJhbCBBZnJpY2FuIFJlcHVibGljIChSw6lwdWJsaXF1ZSBjZW50cmFmcmljYWluZSlcIixcclxuICAgICAgICBcImNmXCIsXHJcbiAgICAgICAgXCIyMzZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNoYWQgKFRjaGFkKVwiLFxyXG4gICAgICAgIFwidGRcIixcclxuICAgICAgICBcIjIzNVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2hpbGVcIixcclxuICAgICAgICBcImNsXCIsXHJcbiAgICAgICAgXCI1NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2hpbmEgKOS4reWbvSlcIixcclxuICAgICAgICBcImNuXCIsXHJcbiAgICAgICAgXCI4NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ29sb21iaWFcIixcclxuICAgICAgICBcImNvXCIsXHJcbiAgICAgICAgXCI1N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ29tb3JvcyAo4oCr2KzYstixINin2YTZgtmF2LHigKzigI4pXCIsXHJcbiAgICAgICAgXCJrbVwiLFxyXG4gICAgICAgIFwiMjY5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb25nbyAoRFJDKSAoSmFtaHVyaSB5YSBLaWRlbW9rcmFzaWEgeWEgS29uZ28pXCIsXHJcbiAgICAgICAgXCJjZFwiLFxyXG4gICAgICAgIFwiMjQzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb25nbyAoUmVwdWJsaWMpIChDb25nby1CcmF6emF2aWxsZSlcIixcclxuICAgICAgICBcImNnXCIsXHJcbiAgICAgICAgXCIyNDJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNvb2sgSXNsYW5kc1wiLFxyXG4gICAgICAgIFwiY2tcIixcclxuICAgICAgICBcIjY4MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ29zdGEgUmljYVwiLFxyXG4gICAgICAgIFwiY3JcIixcclxuICAgICAgICBcIjUwNlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ8O0dGUgZOKAmUl2b2lyZVwiLFxyXG4gICAgICAgIFwiY2lcIixcclxuICAgICAgICBcIjIyNVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ3JvYXRpYSAoSHJ2YXRza2EpXCIsXHJcbiAgICAgICAgXCJoclwiLFxyXG4gICAgICAgIFwiMzg1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDdWJhXCIsXHJcbiAgICAgICAgXCJjdVwiLFxyXG4gICAgICAgIFwiNTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkN1cmHDp2FvXCIsXHJcbiAgICAgICAgXCJjd1wiLFxyXG4gICAgICAgIFwiNTk5XCIsXHJcbiAgICAgICAgMFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkN5cHJ1cyAozprPjc+Az4HOv8+CKVwiLFxyXG4gICAgICAgIFwiY3lcIixcclxuICAgICAgICBcIjM1N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ3plY2ggUmVwdWJsaWMgKMSMZXNrw6EgcmVwdWJsaWthKVwiLFxyXG4gICAgICAgIFwiY3pcIixcclxuICAgICAgICBcIjQyMFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRGVubWFyayAoRGFubWFyaylcIixcclxuICAgICAgICBcImRrXCIsXHJcbiAgICAgICAgXCI0NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRGppYm91dGlcIixcclxuICAgICAgICBcImRqXCIsXHJcbiAgICAgICAgXCIyNTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkRvbWluaWNhXCIsXHJcbiAgICAgICAgXCJkbVwiLFxyXG4gICAgICAgIFwiMTc2N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRG9taW5pY2FuIFJlcHVibGljIChSZXDDumJsaWNhIERvbWluaWNhbmEpXCIsXHJcbiAgICAgICAgXCJkb1wiLFxyXG4gICAgICAgIFwiMVwiLFxyXG4gICAgICAgIDIsXHJcbiAgICAgICAgW1wiODA5XCIsIFwiODI5XCIsIFwiODQ5XCJdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRWN1YWRvclwiLFxyXG4gICAgICAgIFwiZWNcIixcclxuICAgICAgICBcIjU5M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRWd5cHQgKOKAq9mF2LXYseKArOKAjilcIixcclxuICAgICAgICBcImVnXCIsXHJcbiAgICAgICAgXCIyMFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRWwgU2FsdmFkb3JcIixcclxuICAgICAgICBcInN2XCIsXHJcbiAgICAgICAgXCI1MDNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkVxdWF0b3JpYWwgR3VpbmVhIChHdWluZWEgRWN1YXRvcmlhbClcIixcclxuICAgICAgICBcImdxXCIsXHJcbiAgICAgICAgXCIyNDBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkVyaXRyZWFcIixcclxuICAgICAgICBcImVyXCIsXHJcbiAgICAgICAgXCIyOTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkVzdG9uaWEgKEVlc3RpKVwiLFxyXG4gICAgICAgIFwiZWVcIixcclxuICAgICAgICBcIjM3MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRXRoaW9waWFcIixcclxuICAgICAgICBcImV0XCIsXHJcbiAgICAgICAgXCIyNTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZhbGtsYW5kIElzbGFuZHMgKElzbGFzIE1hbHZpbmFzKVwiLFxyXG4gICAgICAgIFwiZmtcIixcclxuICAgICAgICBcIjUwMFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRmFyb2UgSXNsYW5kcyAoRsO4cm95YXIpXCIsXHJcbiAgICAgICAgXCJmb1wiLFxyXG4gICAgICAgIFwiMjk4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJGaWppXCIsXHJcbiAgICAgICAgXCJmalwiLFxyXG4gICAgICAgIFwiNjc5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJGaW5sYW5kIChTdW9taSlcIixcclxuICAgICAgICBcImZpXCIsXHJcbiAgICAgICAgXCIzNThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZyYW5jZVwiLFxyXG4gICAgICAgIFwiZnJcIixcclxuICAgICAgICBcIjMzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJGcmVuY2ggR3VpYW5hIChHdXlhbmUgZnJhbsOnYWlzZSlcIixcclxuICAgICAgICBcImdmXCIsXHJcbiAgICAgICAgXCI1OTRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZyZW5jaCBQb2x5bmVzaWEgKFBvbHluw6lzaWUgZnJhbsOnYWlzZSlcIixcclxuICAgICAgICBcInBmXCIsXHJcbiAgICAgICAgXCI2ODlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdhYm9uXCIsXHJcbiAgICAgICAgXCJnYVwiLFxyXG4gICAgICAgIFwiMjQxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHYW1iaWFcIixcclxuICAgICAgICBcImdtXCIsXHJcbiAgICAgICAgXCIyMjBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdlb3JnaWEgKOGDoeGDkOGDpeGDkOGDoOGDl+GDleGDlOGDmuGDnSlcIixcclxuICAgICAgICBcImdlXCIsXHJcbiAgICAgICAgXCI5OTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdlcm1hbnkgKERldXRzY2hsYW5kKVwiLFxyXG4gICAgICAgIFwiZGVcIixcclxuICAgICAgICBcIjQ5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHaGFuYSAoR2FhbmEpXCIsXHJcbiAgICAgICAgXCJnaFwiLFxyXG4gICAgICAgIFwiMjMzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHaWJyYWx0YXJcIixcclxuICAgICAgICBcImdpXCIsXHJcbiAgICAgICAgXCIzNTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdyZWVjZSAozpXOu867zqzOtM6xKVwiLFxyXG4gICAgICAgIFwiZ3JcIixcclxuICAgICAgICBcIjMwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHcmVlbmxhbmQgKEthbGFhbGxpdCBOdW5hYXQpXCIsXHJcbiAgICAgICAgXCJnbFwiLFxyXG4gICAgICAgIFwiMjk5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHcmVuYWRhXCIsXHJcbiAgICAgICAgXCJnZFwiLFxyXG4gICAgICAgIFwiMTQ3M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR3VhZGVsb3VwZVwiLFxyXG4gICAgICAgIFwiZ3BcIixcclxuICAgICAgICBcIjU5MFwiLFxyXG4gICAgICAgIDBcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdWFtXCIsXHJcbiAgICAgICAgXCJndVwiLFxyXG4gICAgICAgIFwiMTY3MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR3VhdGVtYWxhXCIsXHJcbiAgICAgICAgXCJndFwiLFxyXG4gICAgICAgIFwiNTAyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdWluZWEgKEd1aW7DqWUpXCIsXHJcbiAgICAgICAgXCJnblwiLFxyXG4gICAgICAgIFwiMjI0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdWluZWEtQmlzc2F1IChHdWluw6kgQmlzc2F1KVwiLFxyXG4gICAgICAgIFwiZ3dcIixcclxuICAgICAgICBcIjI0NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR3V5YW5hXCIsXHJcbiAgICAgICAgXCJneVwiLFxyXG4gICAgICAgIFwiNTkyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJIYWl0aVwiLFxyXG4gICAgICAgIFwiaHRcIixcclxuICAgICAgICBcIjUwOVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSG9uZHVyYXNcIixcclxuICAgICAgICBcImhuXCIsXHJcbiAgICAgICAgXCI1MDRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkhvbmcgS29uZyAo6aaZ5rivKVwiLFxyXG4gICAgICAgIFwiaGtcIixcclxuICAgICAgICBcIjg1MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSHVuZ2FyeSAoTWFneWFyb3JzesOhZylcIixcclxuICAgICAgICBcImh1XCIsXHJcbiAgICAgICAgXCIzNlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSWNlbGFuZCAow41zbGFuZClcIixcclxuICAgICAgICBcImlzXCIsXHJcbiAgICAgICAgXCIzNTRcIlxyXG4gICAgXSxcclxuICAgIFxyXG4gICAgW1xyXG4gICAgICAgIFwiSW5kb25lc2lhXCIsXHJcbiAgICAgICAgXCJpZFwiLFxyXG4gICAgICAgIFwiNjJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIklyYW4gKOKAq9in24zYsdin2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJpclwiLFxyXG4gICAgICAgIFwiOThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIklyYXEgKOKAq9in2YTYudix2KfZguKArOKAjilcIixcclxuICAgICAgICBcImlxXCIsXHJcbiAgICAgICAgXCI5NjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIklyZWxhbmRcIixcclxuICAgICAgICBcImllXCIsXHJcbiAgICAgICAgXCIzNTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIklzcmFlbCAo4oCr15nXqdeo15DXnOKArOKAjilcIixcclxuICAgICAgICBcImlsXCIsXHJcbiAgICAgICAgXCI5NzJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkl0YWx5IChJdGFsaWEpXCIsXHJcbiAgICAgICAgXCJpdFwiLFxyXG4gICAgICAgIFwiMzlcIixcclxuICAgICAgICAwXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSmFtYWljYVwiLFxyXG4gICAgICAgIFwiam1cIixcclxuICAgICAgICBcIjE4NzZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkphcGFuICjml6XmnKwpXCIsXHJcbiAgICAgICAgXCJqcFwiLFxyXG4gICAgICAgIFwiODFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkpvcmRhbiAo4oCr2KfZhNij2LHYr9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiam9cIixcclxuICAgICAgICBcIjk2MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiS2F6YWtoc3RhbiAo0JrQsNC30LDRhdGB0YLQsNC9KVwiLFxyXG4gICAgICAgIFwia3pcIixcclxuICAgICAgICBcIjdcIixcclxuICAgICAgICAxXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiS2VueWFcIixcclxuICAgICAgICBcImtlXCIsXHJcbiAgICAgICAgXCIyNTRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIktpcmliYXRpXCIsXHJcbiAgICAgICAgXCJraVwiLFxyXG4gICAgICAgIFwiNjg2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJLdXdhaXQgKOKAq9in2YTZg9mI2YrYquKArOKAjilcIixcclxuICAgICAgICBcImt3XCIsXHJcbiAgICAgICAgXCI5NjVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkt5cmd5enN0YW4gKNCa0YvRgNCz0YvQt9GB0YLQsNC9KVwiLFxyXG4gICAgICAgIFwia2dcIixcclxuICAgICAgICBcIjk5NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGFvcyAo4Lql4Lqy4LqnKVwiLFxyXG4gICAgICAgIFwibGFcIixcclxuICAgICAgICBcIjg1NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGF0dmlhIChMYXR2aWphKVwiLFxyXG4gICAgICAgIFwibHZcIixcclxuICAgICAgICBcIjM3MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGViYW5vbiAo4oCr2YTYqNmG2KfZhuKArOKAjilcIixcclxuICAgICAgICBcImxiXCIsXHJcbiAgICAgICAgXCI5NjFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkxlc290aG9cIixcclxuICAgICAgICBcImxzXCIsXHJcbiAgICAgICAgXCIyNjZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkxpYmVyaWFcIixcclxuICAgICAgICBcImxyXCIsXHJcbiAgICAgICAgXCIyMzFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkxpYnlhICjigKvZhNmK2KjZitin4oCs4oCOKVwiLFxyXG4gICAgICAgIFwibHlcIixcclxuICAgICAgICBcIjIxOFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGllY2h0ZW5zdGVpblwiLFxyXG4gICAgICAgIFwibGlcIixcclxuICAgICAgICBcIjQyM1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGl0aHVhbmlhIChMaWV0dXZhKVwiLFxyXG4gICAgICAgIFwibHRcIixcclxuICAgICAgICBcIjM3MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTHV4ZW1ib3VyZ1wiLFxyXG4gICAgICAgIFwibHVcIixcclxuICAgICAgICBcIjM1MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFjYXUgKOa+s+mWgClcIixcclxuICAgICAgICBcIm1vXCIsXHJcbiAgICAgICAgXCI4NTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hY2Vkb25pYSAoRllST00pICjQnNCw0LrQtdC00L7QvdC40ZjQsClcIixcclxuICAgICAgICBcIm1rXCIsXHJcbiAgICAgICAgXCIzODlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hZGFnYXNjYXIgKE1hZGFnYXNpa2FyYSlcIixcclxuICAgICAgICBcIm1nXCIsXHJcbiAgICAgICAgXCIyNjFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hbGF3aVwiLFxyXG4gICAgICAgIFwibXdcIixcclxuICAgICAgICBcIjI2NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsYXlzaWFcIixcclxuICAgICAgICBcIm15XCIsXHJcbiAgICAgICAgXCI2MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsZGl2ZXNcIixcclxuICAgICAgICBcIm12XCIsXHJcbiAgICAgICAgXCI5NjBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hbGlcIixcclxuICAgICAgICBcIm1sXCIsXHJcbiAgICAgICAgXCIyMjNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hbHRhXCIsXHJcbiAgICAgICAgXCJtdFwiLFxyXG4gICAgICAgIFwiMzU2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYXJzaGFsbCBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJtaFwiLFxyXG4gICAgICAgIFwiNjkyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYXJ0aW5pcXVlXCIsXHJcbiAgICAgICAgXCJtcVwiLFxyXG4gICAgICAgIFwiNTk2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYXVyaXRhbmlhICjigKvZhdmI2LHZitiq2KfZhtmK2KfigKzigI4pXCIsXHJcbiAgICAgICAgXCJtclwiLFxyXG4gICAgICAgIFwiMjIyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYXVyaXRpdXMgKE1vcmlzKVwiLFxyXG4gICAgICAgIFwibXVcIixcclxuICAgICAgICBcIjIzMFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWV4aWNvIChNw6l4aWNvKVwiLFxyXG4gICAgICAgIFwibXhcIixcclxuICAgICAgICBcIjUyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNaWNyb25lc2lhXCIsXHJcbiAgICAgICAgXCJmbVwiLFxyXG4gICAgICAgIFwiNjkxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNb2xkb3ZhIChSZXB1YmxpY2EgTW9sZG92YSlcIixcclxuICAgICAgICBcIm1kXCIsXHJcbiAgICAgICAgXCIzNzNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vbmFjb1wiLFxyXG4gICAgICAgIFwibWNcIixcclxuICAgICAgICBcIjM3N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTW9uZ29saWEgKNCc0L7QvdCz0L7QuylcIixcclxuICAgICAgICBcIm1uXCIsXHJcbiAgICAgICAgXCI5NzZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vbnRlbmVncm8gKENybmEgR29yYSlcIixcclxuICAgICAgICBcIm1lXCIsXHJcbiAgICAgICAgXCIzODJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vbnRzZXJyYXRcIixcclxuICAgICAgICBcIm1zXCIsXHJcbiAgICAgICAgXCIxNjY0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNb3JvY2NvICjigKvYp9mE2YXYutix2KjigKzigI4pXCIsXHJcbiAgICAgICAgXCJtYVwiLFxyXG4gICAgICAgIFwiMjEyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNb3phbWJpcXVlIChNb8OnYW1iaXF1ZSlcIixcclxuICAgICAgICBcIm16XCIsXHJcbiAgICAgICAgXCIyNThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk15YW5tYXIgKEJ1cm1hKSAo4YCZ4YC84YCU4YC64YCZ4YCsKVwiLFxyXG4gICAgICAgIFwibW1cIixcclxuICAgICAgICBcIjk1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOYW1pYmlhIChOYW1pYmnDqylcIixcclxuICAgICAgICBcIm5hXCIsXHJcbiAgICAgICAgXCIyNjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5hdXJ1XCIsXHJcbiAgICAgICAgXCJuclwiLFxyXG4gICAgICAgIFwiNjc0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOZXBhbCAo4KSo4KWH4KSq4KS+4KSyKVwiLFxyXG4gICAgICAgIFwibnBcIixcclxuICAgICAgICBcIjk3N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmV0aGVybGFuZHMgKE5lZGVybGFuZClcIixcclxuICAgICAgICBcIm5sXCIsXHJcbiAgICAgICAgXCIzMVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmV3IENhbGVkb25pYSAoTm91dmVsbGUtQ2Fsw6lkb25pZSlcIixcclxuICAgICAgICBcIm5jXCIsXHJcbiAgICAgICAgXCI2ODdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5ldyBaZWFsYW5kXCIsXHJcbiAgICAgICAgXCJuelwiLFxyXG4gICAgICAgIFwiNjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5pY2FyYWd1YVwiLFxyXG4gICAgICAgIFwibmlcIixcclxuICAgICAgICBcIjUwNVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmlnZXIgKE5pamFyKVwiLFxyXG4gICAgICAgIFwibmVcIixcclxuICAgICAgICBcIjIyN1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmlnZXJpYVwiLFxyXG4gICAgICAgIFwibmdcIixcclxuICAgICAgICBcIjIzNFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTml1ZVwiLFxyXG4gICAgICAgIFwibnVcIixcclxuICAgICAgICBcIjY4M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTm9yZm9sayBJc2xhbmRcIixcclxuICAgICAgICBcIm5mXCIsXHJcbiAgICAgICAgXCI2NzJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5vcnRoIEtvcmVhICjsobDshKAg66+87KO87KO87J2YIOyduOuvvCDqs7XtmZTqta0pXCIsXHJcbiAgICAgICAgXCJrcFwiLFxyXG4gICAgICAgIFwiODUwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOb3J0aGVybiBNYXJpYW5hIElzbGFuZHNcIixcclxuICAgICAgICBcIm1wXCIsXHJcbiAgICAgICAgXCIxNjcwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOb3J3YXkgKE5vcmdlKVwiLFxyXG4gICAgICAgIFwibm9cIixcclxuICAgICAgICBcIjQ3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJPbWFuICjigKvYudmP2YXYp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwib21cIixcclxuICAgICAgICBcIjk2OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUGFraXN0YW4gKOKAq9m+2Kfaqdiz2KrYp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwicGtcIixcclxuICAgICAgICBcIjkyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYWxhdVwiLFxyXG4gICAgICAgIFwicHdcIixcclxuICAgICAgICBcIjY4MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUGFsZXN0aW5lICjigKvZgdmE2LPYt9mK2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJwc1wiLFxyXG4gICAgICAgIFwiOTcwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYW5hbWEgKFBhbmFtw6EpXCIsXHJcbiAgICAgICAgXCJwYVwiLFxyXG4gICAgICAgIFwiNTA3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYXB1YSBOZXcgR3VpbmVhXCIsXHJcbiAgICAgICAgXCJwZ1wiLFxyXG4gICAgICAgIFwiNjc1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYXJhZ3VheVwiLFxyXG4gICAgICAgIFwicHlcIixcclxuICAgICAgICBcIjU5NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUGVydSAoUGVyw7opXCIsXHJcbiAgICAgICAgXCJwZVwiLFxyXG4gICAgICAgIFwiNTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBoaWxpcHBpbmVzXCIsXHJcbiAgICAgICAgXCJwaFwiLFxyXG4gICAgICAgIFwiNjNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBvbGFuZCAoUG9sc2thKVwiLFxyXG4gICAgICAgIFwicGxcIixcclxuICAgICAgICBcIjQ4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQb3J0dWdhbFwiLFxyXG4gICAgICAgIFwicHRcIixcclxuICAgICAgICBcIjM1MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUHVlcnRvIFJpY29cIixcclxuICAgICAgICBcInByXCIsXHJcbiAgICAgICAgXCIxXCIsXHJcbiAgICAgICAgMyxcclxuICAgICAgICBbXCI3ODdcIiwgXCI5MzlcIl1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJRYXRhciAo4oCr2YLYt9ix4oCs4oCOKVwiLFxyXG4gICAgICAgIFwicWFcIixcclxuICAgICAgICBcIjk3NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUsOpdW5pb24gKExhIFLDqXVuaW9uKVwiLFxyXG4gICAgICAgIFwicmVcIixcclxuICAgICAgICBcIjI2MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUm9tYW5pYSAoUm9tw6JuaWEpXCIsXHJcbiAgICAgICAgXCJyb1wiLFxyXG4gICAgICAgIFwiNDBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlJ1c3NpYSAo0KDQvtGB0YHQuNGPKVwiLFxyXG4gICAgICAgIFwicnVcIixcclxuICAgICAgICBcIjdcIixcclxuICAgICAgICAwXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUndhbmRhXCIsXHJcbiAgICAgICAgXCJyd1wiLFxyXG4gICAgICAgIFwiMjUwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBCYXJ0aMOpbGVteSAoU2FpbnQtQmFydGjDqWxlbXkpXCIsXHJcbiAgICAgICAgXCJibFwiLFxyXG4gICAgICAgIFwiNTkwXCIsXHJcbiAgICAgICAgMVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IEhlbGVuYVwiLFxyXG4gICAgICAgIFwic2hcIixcclxuICAgICAgICBcIjI5MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2FpbnQgS2l0dHMgYW5kIE5ldmlzXCIsXHJcbiAgICAgICAgXCJrblwiLFxyXG4gICAgICAgIFwiMTg2OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2FpbnQgTHVjaWFcIixcclxuICAgICAgICBcImxjXCIsXHJcbiAgICAgICAgXCIxNzU4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBNYXJ0aW4gKFNhaW50LU1hcnRpbiAocGFydGllIGZyYW7Dp2Fpc2UpKVwiLFxyXG4gICAgICAgIFwibWZcIixcclxuICAgICAgICBcIjU5MFwiLFxyXG4gICAgICAgIDJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBQaWVycmUgYW5kIE1pcXVlbG9uIChTYWludC1QaWVycmUtZXQtTWlxdWVsb24pXCIsXHJcbiAgICAgICAgXCJwbVwiLFxyXG4gICAgICAgIFwiNTA4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBWaW5jZW50IGFuZCB0aGUgR3JlbmFkaW5lc1wiLFxyXG4gICAgICAgIFwidmNcIixcclxuICAgICAgICBcIjE3ODRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhbW9hXCIsXHJcbiAgICAgICAgXCJ3c1wiLFxyXG4gICAgICAgIFwiNjg1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYW4gTWFyaW5vXCIsXHJcbiAgICAgICAgXCJzbVwiLFxyXG4gICAgICAgIFwiMzc4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTw6NvIFRvbcOpIGFuZCBQcsOtbmNpcGUgKFPDo28gVG9tw6kgZSBQcsOtbmNpcGUpXCIsXHJcbiAgICAgICAgXCJzdFwiLFxyXG4gICAgICAgIFwiMjM5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYXVkaSBBcmFiaWEgKOKAq9in2YTZhdmF2YTZg9ipINin2YTYudix2KjZitipINin2YTYs9i52YjYr9mK2KnigKzigI4pXCIsXHJcbiAgICAgICAgXCJzYVwiLFxyXG4gICAgICAgIFwiOTY2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTZW5lZ2FsIChTw6luw6lnYWwpXCIsXHJcbiAgICAgICAgXCJzblwiLFxyXG4gICAgICAgIFwiMjIxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTZXJiaWEgKNCh0YDQsdC40ZjQsClcIixcclxuICAgICAgICBcInJzXCIsXHJcbiAgICAgICAgXCIzODFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNleWNoZWxsZXNcIixcclxuICAgICAgICBcInNjXCIsXHJcbiAgICAgICAgXCIyNDhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNpZXJyYSBMZW9uZVwiLFxyXG4gICAgICAgIFwic2xcIixcclxuICAgICAgICBcIjIzMlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2luZ2Fwb3JlXCIsXHJcbiAgICAgICAgXCJzZ1wiLFxyXG4gICAgICAgIFwiNjVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNpbnQgTWFhcnRlblwiLFxyXG4gICAgICAgIFwic3hcIixcclxuICAgICAgICBcIjE3MjFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNsb3Zha2lhIChTbG92ZW5za28pXCIsXHJcbiAgICAgICAgXCJza1wiLFxyXG4gICAgICAgIFwiNDIxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTbG92ZW5pYSAoU2xvdmVuaWphKVwiLFxyXG4gICAgICAgIFwic2lcIixcclxuICAgICAgICBcIjM4NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU29sb21vbiBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJzYlwiLFxyXG4gICAgICAgIFwiNjc3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTb21hbGlhIChTb29tYWFsaXlhKVwiLFxyXG4gICAgICAgIFwic29cIixcclxuICAgICAgICBcIjI1MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU291dGggQWZyaWNhXCIsXHJcbiAgICAgICAgXCJ6YVwiLFxyXG4gICAgICAgIFwiMjdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNvdXRoIEtvcmVhICjrjIDtlZzrr7zqta0pXCIsXHJcbiAgICAgICAgXCJrclwiLFxyXG4gICAgICAgIFwiODJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNvdXRoIFN1ZGFuICjigKvYrNmG2YjYqCDYp9mE2LPZiNiv2KfZhuKArOKAjilcIixcclxuICAgICAgICBcInNzXCIsXHJcbiAgICAgICAgXCIyMTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNwYWluIChFc3Bhw7FhKVwiLFxyXG4gICAgICAgIFwiZXNcIixcclxuICAgICAgICBcIjM0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTcmkgTGFua2EgKOC3geC3iuKAjeC2u+C3kyDgtr3gtoLgtprgt4/gt4ApXCIsXHJcbiAgICAgICAgXCJsa1wiLFxyXG4gICAgICAgIFwiOTRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlN1ZGFuICjigKvYp9mE2LPZiNiv2KfZhuKArOKAjilcIixcclxuICAgICAgICBcInNkXCIsXHJcbiAgICAgICAgXCIyNDlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlN1cmluYW1lXCIsXHJcbiAgICAgICAgXCJzclwiLFxyXG4gICAgICAgIFwiNTk3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTd2F6aWxhbmRcIixcclxuICAgICAgICBcInN6XCIsXHJcbiAgICAgICAgXCIyNjhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlN3ZWRlbiAoU3ZlcmlnZSlcIixcclxuICAgICAgICBcInNlXCIsXHJcbiAgICAgICAgXCI0NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3dpdHplcmxhbmQgKFNjaHdlaXopXCIsXHJcbiAgICAgICAgXCJjaFwiLFxyXG4gICAgICAgIFwiNDFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlN5cmlhICjigKvYs9mI2LHZitin4oCs4oCOKVwiLFxyXG4gICAgICAgIFwic3lcIixcclxuICAgICAgICBcIjk2M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVGFpd2FuICjlj7DngaMpXCIsXHJcbiAgICAgICAgXCJ0d1wiLFxyXG4gICAgICAgIFwiODg2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUYWppa2lzdGFuXCIsXHJcbiAgICAgICAgXCJ0alwiLFxyXG4gICAgICAgIFwiOTkyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUYW56YW5pYVwiLFxyXG4gICAgICAgIFwidHpcIixcclxuICAgICAgICBcIjI1NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVGhhaWxhbmQgKOC5hOC4l+C4oilcIixcclxuICAgICAgICBcInRoXCIsXHJcbiAgICAgICAgXCI2NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVGltb3ItTGVzdGVcIixcclxuICAgICAgICBcInRsXCIsXHJcbiAgICAgICAgXCI2NzBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRvZ29cIixcclxuICAgICAgICBcInRnXCIsXHJcbiAgICAgICAgXCIyMjhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRva2VsYXVcIixcclxuICAgICAgICBcInRrXCIsXHJcbiAgICAgICAgXCI2OTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRvbmdhXCIsXHJcbiAgICAgICAgXCJ0b1wiLFxyXG4gICAgICAgIFwiNjc2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUcmluaWRhZCBhbmQgVG9iYWdvXCIsXHJcbiAgICAgICAgXCJ0dFwiLFxyXG4gICAgICAgIFwiMTg2OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVHVuaXNpYSAo4oCr2KrZiNmG2LPigKzigI4pXCIsXHJcbiAgICAgICAgXCJ0blwiLFxyXG4gICAgICAgIFwiMjE2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUdXJrZXkgKFTDvHJraXllKVwiLFxyXG4gICAgICAgIFwidHJcIixcclxuICAgICAgICBcIjkwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUdXJrbWVuaXN0YW5cIixcclxuICAgICAgICBcInRtXCIsXHJcbiAgICAgICAgXCI5OTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlR1cmtzIGFuZCBDYWljb3MgSXNsYW5kc1wiLFxyXG4gICAgICAgIFwidGNcIixcclxuICAgICAgICBcIjE2NDlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlR1dmFsdVwiLFxyXG4gICAgICAgIFwidHZcIixcclxuICAgICAgICBcIjY4OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVS5TLiBWaXJnaW4gSXNsYW5kc1wiLFxyXG4gICAgICAgIFwidmlcIixcclxuICAgICAgICBcIjEzNDBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlVnYW5kYVwiLFxyXG4gICAgICAgIFwidWdcIixcclxuICAgICAgICBcIjI1NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVWtyYWluZSAo0KPQutGA0LDRl9C90LApXCIsXHJcbiAgICAgICAgXCJ1YVwiLFxyXG4gICAgICAgIFwiMzgwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJVbml0ZWQgQXJhYiBFbWlyYXRlcyAo4oCr2KfZhNil2YXYp9ix2KfYqiDYp9mE2LnYsdio2YrYqSDYp9mE2YXYqtit2K/YqeKArOKAjilcIixcclxuICAgICAgICBcImFlXCIsXHJcbiAgICAgICAgXCI5NzFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlVuaXRlZCBLaW5nZG9tXCIsXHJcbiAgICAgICAgXCJnYlwiLFxyXG4gICAgICAgIFwiNDRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlVuaXRlZCBTdGF0ZXNcIixcclxuICAgICAgICBcInVzXCIsXHJcbiAgICAgICAgXCIxXCIsXHJcbiAgICAgICAgMFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlVydWd1YXlcIixcclxuICAgICAgICBcInV5XCIsXHJcbiAgICAgICAgXCI1OThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlV6YmVraXN0YW4gKE/Ku3piZWtpc3RvbilcIixcclxuICAgICAgICBcInV6XCIsXHJcbiAgICAgICAgXCI5OThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlZhbnVhdHVcIixcclxuICAgICAgICBcInZ1XCIsXHJcbiAgICAgICAgXCI2NzhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlZhdGljYW4gQ2l0eSAoQ2l0dMOgIGRlbCBWYXRpY2FubylcIixcclxuICAgICAgICBcInZhXCIsXHJcbiAgICAgICAgXCIzOVwiLFxyXG4gICAgICAgIDFcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJWZW5lenVlbGFcIixcclxuICAgICAgICBcInZlXCIsXHJcbiAgICAgICAgXCI1OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVmlldG5hbSAoVmnhu4d0IE5hbSlcIixcclxuICAgICAgICBcInZuXCIsXHJcbiAgICAgICAgXCI4NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiV2FsbGlzIGFuZCBGdXR1bmFcIixcclxuICAgICAgICBcIndmXCIsXHJcbiAgICAgICAgXCI2ODFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlllbWVuICjigKvYp9mE2YrZhdmG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwieWVcIixcclxuICAgICAgICBcIjk2N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiWmFtYmlhXCIsXHJcbiAgICAgICAgXCJ6bVwiLFxyXG4gICAgICAgIFwiMjYwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJaaW1iYWJ3ZVwiLFxyXG4gICAgICAgIFwiendcIixcclxuICAgICAgICBcIjI2M1wiXHJcbiAgICBdXHJcbl07XHJcblxyXG52YXIgb3B0aW9ucyA9IFtdO1xyXG5cclxuLy8gbG9vcCBvdmVyIGFsbCBvZiB0aGUgY291bnRyaWVzIGFib3ZlXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgYWxsQ291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgYyA9IGFsbENvdW50cmllc1tpXTtcclxuICAgIG9wdGlvbnNbaV0gPSB7XHJcbiAgICAgICAgaWQ6ICcrJyArIGNbMl0sXHJcbiAgICAgICAgdmFsdWU6ICcrJyArIGNbMl0sXHJcbiAgICAgICAgdGV4dDogY1swXSArICcgPHNwYW4gY2xhc3M9XCJzbWFsbFwiPisnICsgY1syXSArICc8L3NwYW4+JyxcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogTU9CSUxFID8gJzxkaXYgY2xhc3M9XCJzZWxlY3RcIj48L2Rpdj4nIDogcmVxdWlyZSgndGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zZWxlY3QuaHRtbCcpLFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzLmZpbmQoJy5zZWxlY3QnKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBkZWJvdW5jZSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gb3B0aW9ucy5zbGljZSgpLFxyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSAnJyxcclxuICAgICAgICAgICAgICAgIHRpbWVvdXQ7XHJcblxyXG4gICAgICAgICAgICBlbC5tb2Jpc2Nyb2xsKCkuc2VsZWN0KHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtdLFxyXG4gICAgICAgICAgICAgICAgdGhlbWU6ICdtb2Jpc2Nyb2xsJyxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICd0b3AnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogb3B0aW9ucyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAnKzkxJyxcclxuICAgICAgICAgICAgICAgIGxheW91dDogJ2xpcXVpZCcsXHJcbiAgICAgICAgICAgICAgICBzaG93TGFiZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgICAgIHJvd3M6IDMsXHJcbiAgICAgICAgICAgICAgICBvbk1hcmt1cFJlYWR5OiBmdW5jdGlvbiAobWFya3VwLCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnPGRpdiBzdHlsZT1cInBhZGRpbmc6LjVlbVwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwibWQtZmlsdGVyLWlucHV0XCIgdmFsdWU9XCIrOTFcIiB0YWJpbmRleD1cIjBcIiBwbGFjZWhvbGRlcj1cIkNvdW50cnkgY29kZVwiIC8+PC9kaXY+JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnByZXBlbmRUbygkKCcuZHdjYycsIG1hcmt1cCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSAkKCdpbnB1dCcsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRlYm91bmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYm91bmNlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB0aGF0LnZhbCgpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gJC5ncmVwKG9wdGlvbnMsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5pZC5pbmRleE9mKHF1ZXJ5KSA+IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LnNldHRpbmdzLmRhdGEgPSBmaWx0ZXJlZC5sZW5ndGggPyBmaWx0ZXJlZCA6IFt7dGV4dDogJ05vIHJlc3VsdHMnLCB2YWx1ZTogJyd9XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LnNldHRpbmdzLnBhcnNlVmFsdWUoaW5zdC5zZXR0aW5ncy5kYXRhWzBdLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LnJlZnJlc2goKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uQmVmb3JlU2hvdzogZnVuY3Rpb24gKGluc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0LnNldHRpbmdzLmRhdGEgPSBvcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3QucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAodiwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RlID0gJCgnPHNwYW4+JyArIHYgKyAnPC9zcGFuPicpLmZpbmQoJy5zbWFsbCcpLnRleHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3ZhbHVlJywgY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLm1ic2MtY29udHJvbCcsIHZpZXcuZWwpLnZhbChjb2RlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5tYnNjLWNvbnRyb2wnLCB2aWV3LmVsKS52YWwodik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25Jbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcubWJzYy1jb250cm9sJywgdmlldy5lbCkudmFsKHZpZXcuZ2V0KCd2YWx1ZScpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzLmZpbmQoJy51aS5kcm9wZG93bicpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kcm9wZG93bih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxUZXh0U2VhcmNoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZHJvcGRvd24oJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndmFsdWUnLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy51cGRhdGUoJ3ZhbHVlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZGVsYXkoZnVuY3Rpb24oKSB7IGlmICh2aWV3LmdldCgnZXJyb3InKSkgdmlldy5zZXQoJ2Vycm9yJywgZmFsc2UpIH0sIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCd2YWx1ZScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZ2V0KCdvcHRpb25zJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBfLmZpbmQob3B0aW9ucywge2lkOiB2YWx1ZX0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLmRyb3Bkb3duKCdzZXQgdmFsdWUnLCBvLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLmRyb3Bkb3duKCdzZXQgdGV4dCcsIG8uaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZWwuZHJvcGRvd24oJ3Jlc3RvcmUgZGVmYXVsdHMnKTtcclxuXHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbmQoJy5zZWFyY2gnKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy5zZWFyY2gnKSkua2V5cHJlc3MoZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBlLndoaWNoID09IDEzICkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgb250ZWFkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMuc2V0KCdvcHRpb25zJywgbnVsbCk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vY29kZS5qc1xuICoqIG1vZHVsZSBpZCA9IDc5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBtYWlsY2hlY2sgPSByZXF1aXJlKCdtYWlsY2hlY2snKTtcclxuXHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdlbWFpbCdcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpXHJcbiAgICAgICAgICAgIC5vbignYmx1cicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5tYWlsY2hlY2soe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3RlZDogZnVuY3Rpb24oZWxlbWVudCwgc3VnZ2VzdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VnZ2VzdGlvbicsIHN1Z2dlc3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Z2dlc3Rpb24nLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNvcnJlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHRoaXMuZ2V0KCdzdWdnZXN0aW9uLmZ1bGwnKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Z2dlc3Rpb24nLCBudWxsKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9lbWFpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDgwXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA2IDdcbiAqKi8iLCIvKlxuICogTWFpbGNoZWNrIGh0dHBzOi8vZ2l0aHViLmNvbS9tYWlsY2hlY2svbWFpbGNoZWNrXG4gKiBBdXRob3JcbiAqIERlcnJpY2sgS28gKEBkZXJyaWNra28pXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICpcbiAqIHYgMS4xLjFcbiAqL1xuXG52YXIgTWFpbGNoZWNrID0ge1xuICBkb21haW5UaHJlc2hvbGQ6IDIsXG4gIHNlY29uZExldmVsVGhyZXNob2xkOiAyLFxuICB0b3BMZXZlbFRocmVzaG9sZDogMixcblxuICBkZWZhdWx0RG9tYWluczogWydtc24uY29tJywgJ2JlbGxzb3V0aC5uZXQnLFxuICAgICd0ZWx1cy5uZXQnLCAnY29tY2FzdC5uZXQnLCAnb3B0dXNuZXQuY29tLmF1JyxcbiAgICAnZWFydGhsaW5rLm5ldCcsICdxcS5jb20nLCAnc2t5LmNvbScsICdpY2xvdWQuY29tJyxcbiAgICAnbWFjLmNvbScsICdzeW1wYXRpY28uY2EnLCAnZ29vZ2xlbWFpbC5jb20nLFxuICAgICdhdHQubmV0JywgJ3h0cmEuY28ubnonLCAnd2ViLmRlJyxcbiAgICAnY294Lm5ldCcsICdnbWFpbC5jb20nLCAneW1haWwuY29tJyxcbiAgICAnYWltLmNvbScsICdyb2dlcnMuY29tJywgJ3Zlcml6b24ubmV0JyxcbiAgICAncm9ja2V0bWFpbC5jb20nLCAnZ29vZ2xlLmNvbScsICdvcHRvbmxpbmUubmV0JyxcbiAgICAnc2JjZ2xvYmFsLm5ldCcsICdhb2wuY29tJywgJ21lLmNvbScsICdidGludGVybmV0LmNvbScsXG4gICAgJ2NoYXJ0ZXIubmV0JywgJ3NoYXcuY2EnXSxcblxuICBkZWZhdWx0U2Vjb25kTGV2ZWxEb21haW5zOiBbXCJ5YWhvb1wiLCBcImhvdG1haWxcIiwgXCJtYWlsXCIsIFwibGl2ZVwiLCBcIm91dGxvb2tcIiwgXCJnbXhcIl0sXG5cbiAgZGVmYXVsdFRvcExldmVsRG9tYWluczogW1wiY29tXCIsIFwiY29tLmF1XCIsIFwiY29tLnR3XCIsIFwiY2FcIiwgXCJjby5uelwiLCBcImNvLnVrXCIsIFwiZGVcIixcbiAgICBcImZyXCIsIFwiaXRcIiwgXCJydVwiLCBcIm5ldFwiLCBcIm9yZ1wiLCBcImVkdVwiLCBcImdvdlwiLCBcImpwXCIsIFwibmxcIiwgXCJrclwiLCBcInNlXCIsIFwiZXVcIixcbiAgICBcImllXCIsIFwiY28uaWxcIiwgXCJ1c1wiLCBcImF0XCIsIFwiYmVcIiwgXCJka1wiLCBcImhrXCIsIFwiZXNcIiwgXCJnclwiLCBcImNoXCIsIFwibm9cIiwgXCJjelwiLFxuICAgIFwiaW5cIiwgXCJuZXRcIiwgXCJuZXQuYXVcIiwgXCJpbmZvXCIsIFwiYml6XCIsIFwibWlsXCIsIFwiY28uanBcIiwgXCJzZ1wiLCBcImh1XCJdLFxuXG4gIHJ1bjogZnVuY3Rpb24ob3B0cykge1xuICAgIG9wdHMuZG9tYWlucyA9IG9wdHMuZG9tYWlucyB8fCBNYWlsY2hlY2suZGVmYXVsdERvbWFpbnM7XG4gICAgb3B0cy5zZWNvbmRMZXZlbERvbWFpbnMgPSBvcHRzLnNlY29uZExldmVsRG9tYWlucyB8fCBNYWlsY2hlY2suZGVmYXVsdFNlY29uZExldmVsRG9tYWlucztcbiAgICBvcHRzLnRvcExldmVsRG9tYWlucyA9IG9wdHMudG9wTGV2ZWxEb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0VG9wTGV2ZWxEb21haW5zO1xuICAgIG9wdHMuZGlzdGFuY2VGdW5jdGlvbiA9IG9wdHMuZGlzdGFuY2VGdW5jdGlvbiB8fCBNYWlsY2hlY2suc2lmdDNEaXN0YW5jZTtcblxuICAgIHZhciBkZWZhdWx0Q2FsbGJhY2sgPSBmdW5jdGlvbihyZXN1bHQpeyByZXR1cm4gcmVzdWx0IH07XG4gICAgdmFyIHN1Z2dlc3RlZENhbGxiYWNrID0gb3B0cy5zdWdnZXN0ZWQgfHwgZGVmYXVsdENhbGxiYWNrO1xuICAgIHZhciBlbXB0eUNhbGxiYWNrID0gb3B0cy5lbXB0eSB8fCBkZWZhdWx0Q2FsbGJhY2s7XG5cbiAgICB2YXIgcmVzdWx0ID0gTWFpbGNoZWNrLnN1Z2dlc3QoTWFpbGNoZWNrLmVuY29kZUVtYWlsKG9wdHMuZW1haWwpLCBvcHRzLmRvbWFpbnMsIG9wdHMuc2Vjb25kTGV2ZWxEb21haW5zLCBvcHRzLnRvcExldmVsRG9tYWlucywgb3B0cy5kaXN0YW5jZUZ1bmN0aW9uKTtcblxuICAgIHJldHVybiByZXN1bHQgPyBzdWdnZXN0ZWRDYWxsYmFjayhyZXN1bHQpIDogZW1wdHlDYWxsYmFjaygpXG4gIH0sXG5cbiAgc3VnZ2VzdDogZnVuY3Rpb24oZW1haWwsIGRvbWFpbnMsIHNlY29uZExldmVsRG9tYWlucywgdG9wTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uKSB7XG4gICAgZW1haWwgPSBlbWFpbC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdmFyIGVtYWlsUGFydHMgPSB0aGlzLnNwbGl0RW1haWwoZW1haWwpO1xuXG4gICAgaWYgKHNlY29uZExldmVsRG9tYWlucyAmJiB0b3BMZXZlbERvbWFpbnMpIHtcbiAgICAgICAgLy8gSWYgdGhlIGVtYWlsIGlzIGEgdmFsaWQgMm5kLWxldmVsICsgdG9wLWxldmVsLCBkbyBub3Qgc3VnZ2VzdCBhbnl0aGluZy5cbiAgICAgICAgaWYgKHNlY29uZExldmVsRG9tYWlucy5pbmRleE9mKGVtYWlsUGFydHMuc2Vjb25kTGV2ZWxEb21haW4pICE9PSAtMSAmJiB0b3BMZXZlbERvbWFpbnMuaW5kZXhPZihlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjbG9zZXN0RG9tYWluID0gdGhpcy5maW5kQ2xvc2VzdERvbWFpbihlbWFpbFBhcnRzLmRvbWFpbiwgZG9tYWlucywgZGlzdGFuY2VGdW5jdGlvbiwgdGhpcy5kb21haW5UaHJlc2hvbGQpO1xuXG4gICAgaWYgKGNsb3Nlc3REb21haW4pIHtcbiAgICAgIGlmIChjbG9zZXN0RG9tYWluID09IGVtYWlsUGFydHMuZG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGV4YWN0bHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnM7IGRvIG5vdCByZXR1cm4gYSBzdWdnZXN0aW9uLlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBjbG9zZWx5IG1hdGNoZXMgb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zOyByZXR1cm4gYSBzdWdnZXN0aW9uXG4gICAgICAgIHJldHVybiB7IGFkZHJlc3M6IGVtYWlsUGFydHMuYWRkcmVzcywgZG9tYWluOiBjbG9zZXN0RG9tYWluLCBmdWxsOiBlbWFpbFBhcnRzLmFkZHJlc3MgKyBcIkBcIiArIGNsb3Nlc3REb21haW4gfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBkb2VzIG5vdCBjbG9zZWx5IG1hdGNoIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWluc1xuICAgIHZhciBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4gPSB0aGlzLmZpbmRDbG9zZXN0RG9tYWluKGVtYWlsUGFydHMuc2Vjb25kTGV2ZWxEb21haW4sIHNlY29uZExldmVsRG9tYWlucywgZGlzdGFuY2VGdW5jdGlvbiwgdGhpcy5zZWNvbmRMZXZlbFRocmVzaG9sZCk7XG4gICAgdmFyIGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAgICA9IHRoaXMuZmluZENsb3Nlc3REb21haW4oZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbiwgdG9wTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLnRvcExldmVsVGhyZXNob2xkKTtcblxuICAgIGlmIChlbWFpbFBhcnRzLmRvbWFpbikge1xuICAgICAgdmFyIGNsb3Nlc3REb21haW4gPSBlbWFpbFBhcnRzLmRvbWFpbjtcbiAgICAgIHZhciBydHJuID0gZmFsc2U7XG5cbiAgICAgIGlmKGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiAmJiBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4gIT0gZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbikge1xuICAgICAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBtYXkgaGF2ZSBhIG1pc3BlbGxlZCBzZWNvbmQtbGV2ZWwgZG9tYWluOyByZXR1cm4gYSBzdWdnZXN0aW9uXG4gICAgICAgIGNsb3Nlc3REb21haW4gPSBjbG9zZXN0RG9tYWluLnJlcGxhY2UoZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbiwgY2xvc2VzdFNlY29uZExldmVsRG9tYWluKTtcbiAgICAgICAgcnRybiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmKGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAmJiBjbG9zZXN0VG9wTGV2ZWxEb21haW4gIT0gZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbikge1xuICAgICAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBtYXkgaGF2ZSBhIG1pc3BlbGxlZCB0b3AtbGV2ZWwgZG9tYWluOyByZXR1cm4gYSBzdWdnZXN0aW9uXG4gICAgICAgIGNsb3Nlc3REb21haW4gPSBjbG9zZXN0RG9tYWluLnJlcGxhY2UoZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbiwgY2xvc2VzdFRvcExldmVsRG9tYWluKTtcbiAgICAgICAgcnRybiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChydHJuID09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHsgYWRkcmVzczogZW1haWxQYXJ0cy5hZGRyZXNzLCBkb21haW46IGNsb3Nlc3REb21haW4sIGZ1bGw6IGVtYWlsUGFydHMuYWRkcmVzcyArIFwiQFwiICsgY2xvc2VzdERvbWFpbiB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIFRoZSBlbWFpbCBhZGRyZXNzIGV4YWN0bHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnMsIGRvZXMgbm90IGNsb3NlbHlcbiAgICAgKiBtYXRjaCBhbnkgZG9tYWluIGFuZCBkb2VzIG5vdCBhcHBlYXIgdG8gc2ltcGx5IGhhdmUgYSBtaXNwZWxsZWQgdG9wLWxldmVsIGRvbWFpbixcbiAgICAgKiBvciBpcyBhbiBpbnZhbGlkIGVtYWlsIGFkZHJlc3M7IGRvIG5vdCByZXR1cm4gYSBzdWdnZXN0aW9uLlxuICAgICAqL1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBmaW5kQ2xvc2VzdERvbWFpbjogZnVuY3Rpb24oZG9tYWluLCBkb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aHJlc2hvbGQpIHtcbiAgICB0aHJlc2hvbGQgPSB0aHJlc2hvbGQgfHwgdGhpcy50b3BMZXZlbFRocmVzaG9sZDtcbiAgICB2YXIgZGlzdDtcbiAgICB2YXIgbWluRGlzdCA9IDk5O1xuICAgIHZhciBjbG9zZXN0RG9tYWluID0gbnVsbDtcblxuICAgIGlmICghZG9tYWluIHx8ICFkb21haW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKCFkaXN0YW5jZUZ1bmN0aW9uKSB7XG4gICAgICBkaXN0YW5jZUZ1bmN0aW9uID0gdGhpcy5zaWZ0M0Rpc3RhbmNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9tYWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRvbWFpbiA9PT0gZG9tYWluc1tpXSkge1xuICAgICAgICByZXR1cm4gZG9tYWluO1xuICAgICAgfVxuICAgICAgZGlzdCA9IGRpc3RhbmNlRnVuY3Rpb24oZG9tYWluLCBkb21haW5zW2ldKTtcbiAgICAgIGlmIChkaXN0IDwgbWluRGlzdCkge1xuICAgICAgICBtaW5EaXN0ID0gZGlzdDtcbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGRvbWFpbnNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1pbkRpc3QgPD0gdGhyZXNob2xkICYmIGNsb3Nlc3REb21haW4gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBjbG9zZXN0RG9tYWluO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIHNpZnQzRGlzdGFuY2U6IGZ1bmN0aW9uKHMxLCBzMikge1xuICAgIC8vIHNpZnQzOiBodHRwOi8vc2lkZXJpdGUuYmxvZ3Nwb3QuY29tLzIwMDcvMDQvc3VwZXItZmFzdC1hbmQtYWNjdXJhdGUtc3RyaW5nLWRpc3RhbmNlLmh0bWxcbiAgICBpZiAoczEgPT0gbnVsbCB8fCBzMS5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChzMiA9PSBudWxsIHx8IHMyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzMi5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHMyID09IG51bGwgfHwgczIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gczEubGVuZ3RoO1xuICAgIH1cblxuICAgIHZhciBjID0gMDtcbiAgICB2YXIgb2Zmc2V0MSA9IDA7XG4gICAgdmFyIG9mZnNldDIgPSAwO1xuICAgIHZhciBsY3MgPSAwO1xuICAgIHZhciBtYXhPZmZzZXQgPSA1O1xuXG4gICAgd2hpbGUgKChjICsgb2Zmc2V0MSA8IHMxLmxlbmd0aCkgJiYgKGMgKyBvZmZzZXQyIDwgczIubGVuZ3RoKSkge1xuICAgICAgaWYgKHMxLmNoYXJBdChjICsgb2Zmc2V0MSkgPT0gczIuY2hhckF0KGMgKyBvZmZzZXQyKSkge1xuICAgICAgICBsY3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZnNldDEgPSAwO1xuICAgICAgICBvZmZzZXQyID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhPZmZzZXQ7IGkrKykge1xuICAgICAgICAgIGlmICgoYyArIGkgPCBzMS5sZW5ndGgpICYmIChzMS5jaGFyQXQoYyArIGkpID09IHMyLmNoYXJBdChjKSkpIHtcbiAgICAgICAgICAgIG9mZnNldDEgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoYyArIGkgPCBzMi5sZW5ndGgpICYmIChzMS5jaGFyQXQoYykgPT0gczIuY2hhckF0KGMgKyBpKSkpIHtcbiAgICAgICAgICAgIG9mZnNldDIgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjKys7XG4gICAgfVxuICAgIHJldHVybiAoczEubGVuZ3RoICsgczIubGVuZ3RoKSAvMiAtIGxjcztcbiAgfSxcblxuICBzcGxpdEVtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgIHZhciBwYXJ0cyA9IGVtYWlsLnRyaW0oKS5zcGxpdCgnQCcpO1xuXG4gICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocGFydHNbaV0gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZG9tYWluID0gcGFydHMucG9wKCk7XG4gICAgdmFyIGRvbWFpblBhcnRzID0gZG9tYWluLnNwbGl0KCcuJyk7XG4gICAgdmFyIHNsZCA9ICcnO1xuICAgIHZhciB0bGQgPSAnJztcblxuICAgIGlmIChkb21haW5QYXJ0cy5sZW5ndGggPT0gMCkge1xuICAgICAgLy8gVGhlIGFkZHJlc3MgZG9lcyBub3QgaGF2ZSBhIHRvcC1sZXZlbCBkb21haW5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRvbWFpblBhcnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBoYXMgb25seSBhIHRvcC1sZXZlbCBkb21haW4gKHZhbGlkIHVuZGVyIFJGQylcbiAgICAgIHRsZCA9IGRvbWFpblBhcnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBoYXMgYSBkb21haW4gYW5kIGEgdG9wLWxldmVsIGRvbWFpblxuICAgICAgc2xkID0gZG9tYWluUGFydHNbMF07XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGRvbWFpblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRsZCArPSBkb21haW5QYXJ0c1tpXSArICcuJztcbiAgICAgIH1cbiAgICAgIHRsZCA9IHRsZC5zdWJzdHJpbmcoMCwgdGxkLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b3BMZXZlbERvbWFpbjogdGxkLFxuICAgICAgc2Vjb25kTGV2ZWxEb21haW46IHNsZCxcbiAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgYWRkcmVzczogcGFydHMuam9pbignQCcpXG4gICAgfVxuICB9LFxuXG4gIC8vIEVuY29kZSB0aGUgZW1haWwgYWRkcmVzcyB0byBwcmV2ZW50IFhTUyBidXQgbGVhdmUgaW4gdmFsaWRcbiAgLy8gY2hhcmFjdGVycywgZm9sbG93aW5nIHRoaXMgb2ZmaWNpYWwgc3BlYzpcbiAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FbWFpbF9hZGRyZXNzI1N5bnRheFxuICBlbmNvZGVFbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW5jb2RlVVJJKGVtYWlsKTtcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnJTIwJywgJyAnKS5yZXBsYWNlKCclMjUnLCAnJScpLnJlcGxhY2UoJyU1RScsICdeJylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJTYwJywgJ2AnKS5yZXBsYWNlKCclN0InLCAneycpLnJlcGxhY2UoJyU3QycsICd8JylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJTdEJywgJ30nKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuXG4vLyBFeHBvcnQgdGhlIG1haWxjaGVjayBvYmplY3QgaWYgd2UncmUgaW4gYSBDb21tb25KUyBlbnYgKGUuZy4gTm9kZSkuXG4vLyBNb2RlbGVkIG9mZiBvZiBVbmRlcnNjb3JlLmpzLlxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWlsY2hlY2s7XG59XG5cbi8vIFN1cHBvcnQgQU1EIHN0eWxlIGRlZmluaXRpb25zXG4vLyBCYXNlZCBvbiBqUXVlcnkgKHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNzk1NDg4Mi8xMzIyNDEwKVxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShcIm1haWxjaGVja1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1haWxjaGVjaztcbiAgfSk7XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cualF1ZXJ5KSB7XG4gIChmdW5jdGlvbigkKXtcbiAgICAkLmZuLm1haWxjaGVjayA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmIChvcHRzLnN1Z2dlc3RlZCkge1xuICAgICAgICB2YXIgb2xkU3VnZ2VzdGVkID0gb3B0cy5zdWdnZXN0ZWQ7XG4gICAgICAgIG9wdHMuc3VnZ2VzdGVkID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgb2xkU3VnZ2VzdGVkKHNlbGYsIHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmVtcHR5KSB7XG4gICAgICAgIHZhciBvbGRFbXB0eSA9IG9wdHMuZW1wdHk7XG4gICAgICAgIG9wdHMuZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBvbGRFbXB0eS5jYWxsKG51bGwsIHNlbGYpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcHRzLmVtYWlsID0gdGhpcy52YWwoKTtcbiAgICAgIE1haWxjaGVjay5ydW4ob3B0cyk7XG4gICAgfVxuICB9KShqUXVlcnkpO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3ZlbmRvci9tYWlsY2hlY2svc3JjL21haWxjaGVjay5qc1xuICoqIG1vZHVsZSBpZCA9IDgxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA2IDdcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICBwYXNzZW5nZXI6IHJlcXVpcmUoJ2NvbXBvbmVudHMvcGFzc2VuZ2VyJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcWE6IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncWEnKVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCdib29raW5nLnN0ZXBzLjIuYWN0aXZlJywgZnVuY3Rpb24oYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzY3JvbGwgdG8gdG9wJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxyXG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvdHJhdmVsZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IGJvb2tpbmdfaWQ6IHRoaXMuZ2V0KCdib29raW5nLmlkJykgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnb3QgdHJhdmVsZXJzJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndHJhdmVsZXJzJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkgeyB0aGlzLmdldCgnYm9va2luZycpLnN0ZXAyKCkgfSxcclxuXHJcbiAgICBjaGVja0F2YWlsYWJpbGl0eTogZnVuY3Rpb24oKSB7IHRoaXMuZ2V0KCdib29raW5nJykuc3RlcDIoe2NoZWNrOiB0cnVlfSkgfSxcclxuXHJcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7IGlmICghdGhpcy5nZXQoJ2Jvb2tpbmcucGF5bWVudC5wYXltZW50X2lkJykpIHRoaXMuZ2V0KCdib29raW5nJykuYWN0aXZhdGUoMik7IH0sXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5hY3RpdmF0ZSgxKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbn0pO1xyXG5cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXAyLmpzXG4gKiogbW9kdWxlIGlkID0gODJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wic3RlcCBoZWFkZXIgc3RlcDIgXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5hY3RpdmVcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcImNvbXBsZXRlZFwiXSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuY29tcGxldGVkXCJ9XSxcInJcIjpcInN0ZXAuYWN0aXZlXCJ9XSxcInJvbGVcIjpcInRhYlwifSxcImZcIjpbXCJQYXNzZW5nZXJzXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic3RlcDItc3VtbWFyeSBzZWdtZW50XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYWN0aXZhdGVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbMl1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaG9yaXpvbnRhbCBsaXN0XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVzZXIgaWNvblwifX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5maXJzdG5hbWVcIn0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5sYXN0bmFtZVwifV19XX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZy5wYXNzZW5nZXJzXCJ9XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0ZXAuY29tcGxldGVkXCIsXCJzdGVwLmFjdGl2ZVwiXSxcInNcIjpcIl8wJiYhXzFcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W1widWkgZm9ybSBzZWdtZW50IHN0ZXAyIFwiLHtcInRcIjo0LFwiZlwiOltcImVycm9yXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5lcnJvcnNcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuc3VibWl0dGluZ1wifV19LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzZW5nZXItaGVhZGVyIGhlYWRlclwifSxcImZcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcIm1ldGEudHJhdmVsZXJUeXBlc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJ0eXBlX2lkXCJ9XX19LFwiKFwiLHtcInRcIjoyLFwiclwiOlwibm9cIn0sXCIpKlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwYXNzZW5nZXJcIixcImFcIjp7XCJjbGFzc1wiOlwiYmFzaWNcIixcInZhbGlkYXRpb25cIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nLnBhc3NlbmdlclZhbGlkYXRvblwifV0sXCJ0cmF2ZWxlcnNcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlcnNcIn1dLFwicGFzc2VuZ2VyXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV0sXCJlcnJvcnNcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcInN0ZXAuZXJyb3JzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImlcIn1dfX1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZy5wYXNzZW5nZXJzXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIG9uZSBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIHdpemFyZCBidXR0b24gbWFzc2l2ZSBibHVlXCJ9LFwiZlwiOltcIkNPTlRJTlVFXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJidXR0b25cIixcImNsYXNzXCI6XCJ1aSB3aXphcmQgYnV0dG9uIG1hc3NpdmUgcmVkXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiY2hlY2tBdmFpbGFiaWxpdHlcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIkNIRUNLXCJdfV0sXCJuXCI6NTAsXCJyXCI6XCJxYVwifV19XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuYWN0aXZlXCJ9XSxcInhcIjp7XCJyXCI6W1wic3RlcC5jb21wbGV0ZWRcIixcInN0ZXAuYWN0aXZlXCJdLFwic1wiOlwiXzAmJiFfMVwifX1dLFwieFwiOntcInJcIjpbXCJib29raW5nLnN0ZXBzLjJcIl0sXCJzXCI6XCJ7c3RlcDpfMH1cIn19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDgzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbiBcclxuICAgIDtcclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9wYXNzZW5nZXIuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgIG1vYmlsZXNlbGVjdDogcmVxdWlyZSgnY29yZS9mb3JtL21vYmlsZXNlbGVjdCcpLFxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBfOiBfLFxyXG4gICAgICAgICAgICBkYXRlc3VwcG9ydGVkOnRydWUsXHJcbiAgICAgICAgICAgIGFsbDogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGU6IHJlcXVpcmUoJ2hlbHBlcnMvZGF0ZScpKCksXHJcblxyXG4gICAgICAgICAgICBzZWFyY2g6IGZ1bmN0aW9uKHRlcm0sIHRyYXZlbGVycykge1xyXG4gICAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZygnc2VhcmNoJywgYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZXJtID0gdGVybS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlcm0gJiYgdHJhdmVsZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRyYXZlbGVycywgZnVuY3Rpb24oaSkgeyByZXR1cm4gLTEgIT09IChpLmZpcnN0bmFtZSArICcgJyArIGkubGFzdG5hbWUpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmF2ZWxlcnMgPyB0cmF2ZWxlcnMuc2xpY2UoMCwgNCkgOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgIWZ1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiBhKGUsdCl7cmV0dXJuIHR5cGVvZiBlPT09dH1mdW5jdGlvbiBzKGUpe3ZhciB0PXIuY2xhc3NOYW1lLG49TW9kZXJuaXpyLl9jb25maWcuY2xhc3NQcmVmaXh8fFwiXCI7aWYoYyYmKHQ9dC5iYXNlVmFsKSxNb2Rlcm5penIuX2NvbmZpZy5lbmFibGVKU0NsYXNzKXt2YXIgYT1uZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIrbitcIm5vLWpzKFxcXFxzfCQpXCIpO3Q9dC5yZXBsYWNlKGEsXCIkMVwiK24rXCJqcyQyXCIpfU1vZGVybml6ci5fY29uZmlnLmVuYWJsZUNsYXNzZXMmJih0Kz1cIiBcIituK2Uuam9pbihcIiBcIituKSxjP3IuY2xhc3NOYW1lLmJhc2VWYWw9dDpyLmNsYXNzTmFtZT10KX1mdW5jdGlvbiBpKCl7dmFyIGUsdCxuLHMsaSxvLHI7Zm9yKHZhciBjIGluIHUpe2lmKGU9W10sdD11W2NdLHQubmFtZSYmKGUucHVzaCh0Lm5hbWUudG9Mb3dlckNhc2UoKSksdC5vcHRpb25zJiZ0Lm9wdGlvbnMuYWxpYXNlcyYmdC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSlmb3Iobj0wO248dC5vcHRpb25zLmFsaWFzZXMubGVuZ3RoO24rKyllLnB1c2godC5vcHRpb25zLmFsaWFzZXNbbl0udG9Mb3dlckNhc2UoKSk7Zm9yKHM9YSh0LmZuLFwiZnVuY3Rpb25cIik/dC5mbigpOnQuZm4saT0wO2k8ZS5sZW5ndGg7aSsrKW89ZVtpXSxyPW8uc3BsaXQoXCIuXCIpLDE9PT1yLmxlbmd0aD9Nb2Rlcm5penJbclswXV09czooIU1vZGVybml6cltyWzBdXXx8TW9kZXJuaXpyW3JbMF1daW5zdGFuY2VvZiBCb29sZWFufHwoTW9kZXJuaXpyW3JbMF1dPW5ldyBCb29sZWFuKE1vZGVybml6cltyWzBdXSkpLE1vZGVybml6cltyWzBdXVtyWzFdXT1zKSxsLnB1c2goKHM/XCJcIjpcIm5vLVwiKStyLmpvaW4oXCItXCIpKX19ZnVuY3Rpb24gbygpe3JldHVyblwiZnVuY3Rpb25cIiE9dHlwZW9mIHQuY3JlYXRlRWxlbWVudD90LmNyZWF0ZUVsZW1lbnQoYXJndW1lbnRzWzBdKTpjP3QuY3JlYXRlRWxlbWVudE5TLmNhbGwodCxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsYXJndW1lbnRzWzBdKTp0LmNyZWF0ZUVsZW1lbnQuYXBwbHkodCxhcmd1bWVudHMpfXZhciBsPVtdLHI9dC5kb2N1bWVudEVsZW1lbnQsYz1cInN2Z1wiPT09ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLHU9W10sZj17X3ZlcnNpb246XCIzLjAuMC1hbHBoYS40XCIsX2NvbmZpZzp7Y2xhc3NQcmVmaXg6XCJcIixlbmFibGVDbGFzc2VzOiEwLGVuYWJsZUpTQ2xhc3M6ITAsdXNlUHJlZml4ZXM6ITB9LF9xOltdLG9uOmZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dChuW2VdKX0sMCl9LGFkZFRlc3Q6ZnVuY3Rpb24oZSx0LG4pe3UucHVzaCh7bmFtZTplLGZuOnQsb3B0aW9uczpufSl9LGFkZEFzeW5jVGVzdDpmdW5jdGlvbihlKXt1LnB1c2goe25hbWU6bnVsbCxmbjplfSl9fSxNb2Rlcm5penI9ZnVuY3Rpb24oKXt9O01vZGVybml6ci5wcm90b3R5cGU9ZixNb2Rlcm5penI9bmV3IE1vZGVybml6cjt2YXIgcD1vKFwiaW5wdXRcIiksZD1cInNlYXJjaCB0ZWwgdXJsIGVtYWlsIGRhdGV0aW1lIGRhdGUgbW9udGggd2VlayB0aW1lIGRhdGV0aW1lLWxvY2FsIG51bWJlciByYW5nZSBjb2xvclwiLnNwbGl0KFwiIFwiKSxtPXt9O01vZGVybml6ci5pbnB1dHR5cGVzPWZ1bmN0aW9uKGUpe2Zvcih2YXIgYSxzLGksbz1lLmxlbmd0aCxsPVwiOilcIixjPTA7bz5jO2MrKylwLnNldEF0dHJpYnV0ZShcInR5cGVcIixhPWVbY10pLGk9XCJ0ZXh0XCIhPT1wLnR5cGUmJlwic3R5bGVcImluIHAsaSYmKHAudmFsdWU9bCxwLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjphYnNvbHV0ZTt2aXNpYmlsaXR5OmhpZGRlbjtcIiwvXnJhbmdlJC8udGVzdChhKSYmcC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlIT09bj8oci5hcHBlbmRDaGlsZChwKSxzPXQuZGVmYXVsdFZpZXcsaT1zLmdldENvbXB1dGVkU3R5bGUmJlwidGV4dGZpZWxkXCIhPT1zLmdldENvbXB1dGVkU3R5bGUocCxudWxsKS5XZWJraXRBcHBlYXJhbmNlJiYwIT09cC5vZmZzZXRIZWlnaHQsci5yZW1vdmVDaGlsZChwKSk6L14oc2VhcmNofHRlbCkkLy50ZXN0KGEpfHwoaT0vXih1cmx8ZW1haWx8bnVtYmVyKSQvLnRlc3QoYSk/cC5jaGVja1ZhbGlkaXR5JiZwLmNoZWNrVmFsaWRpdHkoKT09PSExOnAudmFsdWUhPWwpKSxtW2VbY11dPSEhaTtyZXR1cm4gbX0oZCksaSgpLHMobCksZGVsZXRlIGYuYWRkVGVzdCxkZWxldGUgZi5hZGRBc3luY1Rlc3Q7Zm9yKHZhciBnPTA7ZzxNb2Rlcm5penIuX3EubGVuZ3RoO2crKylNb2Rlcm5penIuX3FbZ10oKTtlLk1vZGVybml6cj1Nb2Rlcm5penJ9KHdpbmRvdyxkb2N1bWVudCk7XHJcbiAgICAgICAgaWYgKCFNb2Rlcm5penIuaW5wdXR0eXBlcy5kYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdkYXRlc3VwcG9ydGVkJyxmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vJCggXCIuZG9iXCIgKS5kYXRlcGlja2VyKCk7XHJcbiAgICAgIFxyXG4gICAgICAgIGlmICghTU9CSUxFKSB7XHJcbiAgICAgICAgICAgIHZhciBmbiA9ICQodGhpcy5maW5kKCdpbnB1dC5maXJzdG5hbWUnKSlcclxuICAgICAgICAgICAgICAgICAgICAucG9wdXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA6ICdib3R0b20gbGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwOiAkKHRoaXMuZmluZCgnLnRyYXZlbGVycy5wb3B1cCcpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcjogJ29wcG9zaXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7IGZuLnBvcHVwKCdzaG93Jyk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24oKSB7IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGZuLnBvcHVwKCdoaWRlJyk7IH0sIDIwMCk7IH0pXHJcbiAgICAgICAgICAgICAgICA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgndHJhdmVsZXJzJywgZnVuY3Rpb24odHJhdmVsZXJzKSB7XHJcbiAgICAgICAgICAgICAgIGlmICh0cmF2ZWxlcnMgJiYgdHJhdmVsZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgJCgnLnRwb3B1cCcsIHZpZXcuZWwpLm1vYmlzY3JvbGwoKS5zZWxlY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAodiwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBfLnBhcnNlSW50KCQoJy50cG9wdXAnLCB2aWV3LmVsKS52YWwoKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxlciA9IF8uZmluZFdoZXJlKHZpZXcuZ2V0KCd0cmF2ZWxlcnMnKSwgeyBpZDogaWQgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHJhdmVsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnBpY2tUcmF2ZWxlcih0cmF2ZWxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICQodGhpcykuY2xvc2VzdChcIi5wYXNzZW5nZXJjbGFzc1wiKS5maW5kKCcudHQnKS50ZXh0KF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiB0cmF2ZWxlci50aXRsZV9pZH0pLCAnbmFtZScpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZpZXcuc2V0KCdwYXNzZW5nZXIudHJhdmVsZXIudGl0bGVfaWQnLHRyYXZlbGVyLilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb25WYWx1ZVRhcDogZnVuY3Rpb24gKHYsIGluc3QpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHYuY29udGV4dC5pbm5lclRleHQpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2LmNvbnRleHQub3V0ZXJIVE1MKTsgICAgIFxyXG4gLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2LmNvbnRleHQuYXR0cmlidXRlc1snZGF0YS12YWwnXS5ub2RlVmFsdWUpOyAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IF8ucGFyc2VJbnQodi5jb250ZXh0LmF0dHJpYnV0ZXNbJ2RhdGEtdmFsJ10ubm9kZVZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGVyID0gXy5maW5kV2hlcmUodmlldy5nZXQoJ3RyYXZlbGVycycpLCB7IGlkOiBpZCB9KTtcclxuICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2codHJhdmVsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHJhdmVsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnBpY2tUcmF2ZWxlcih0cmF2ZWxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgdmFyIHRpdGxlcyA9IHZpZXcuZ2V0KCdtZXRhLnRpdGxlcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAkKHRoaXMpLmNsb3Nlc3QoXCIucGFzc2VuZ2VyY2xhc3NcIikuZmluZCgnLnR0JykudGV4dChfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdHJhdmVsZXIudGl0bGVfaWR9KSwgJ25hbWUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy50cG9wdXAnLCB2aWV3LmVsKS5tb2Jpc2Nyb2xsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuLy8gICAgICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImRvYlwiXScpLmNoYW5nZShmdW5jdGlvbigpe1xyXG4vLyAgICAgICAgICAgICAgICAgICAgLy9hbGVydCh0aGlzLnZhbHVlKTsgICAgICAgICAvL0RhdGUgaW4gZnVsbCBmb3JtYXQgYWxlcnQobmV3IERhdGUodGhpcy52YWx1ZSkpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0RGF0ZSA9IHRoaXMudmFsdWU7Ly9uZXcgRGF0ZSh0aGlzLnZhbHVlKTtcclxuLy8gICAgICAgICAgICAgICAgICAgIHZhciBkYXRlPWlucHV0RGF0ZS5zcGxpdChcIi1cIik7XHJcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbnB1dERhdGUpO1xyXG4vLyAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgdHJhdmVsZXJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgICAgICQoJy50cG9wdXAnLCB0aGlzLmVsKS5tb2Jpc2Nyb2xsKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRpdGxlc2VsZWN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgICAgICQoJy50aXRsZXBvcHVwJywgdGhpcy5lbCkubW9iaXNjcm9sbCgnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG93OiBmdW5jdGlvbihzZWN0aW9uLCB2YWxpZGF0aW9uLCBhbGwpIHtcclxuICAgICAgICBpZiAoYWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKCdiaXJ0aCcgPT0gc2VjdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2RvbWVzdGljJyAhPSAndmFsaWRhdGlvbic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJ3Bhc3Nwb3J0JyA9PSBzZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnZnVsbCcgPT0gJ3ZhbGlkYXRpb24nO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGlja1RyYXZlbGVyOiBmdW5jdGlvbih0cmF2ZWxlcikge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgaWQgPSB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmlkJyk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhubyk7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyJywgbnVsbClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyJywgXy5jbG9uZURlZXAodHJhdmVsZXIpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2V0ZG9iOiBmdW5jdGlvbih0cmF2ZWxlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsZXIpO1xyXG4gICAgICAgIHZhciBubyA9IF8ucGFyc2VJbnQodHJhdmVsZXJbJ25vJ10pO1xyXG4gICAgICAgIHZhciB0PW5vLTE7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRlb2ZiaXJ0aD0kKFwiI2RvYl9cIitubykudmFsKCk7XHJcbiAgICAgICAgdmFyIGRvYj1kYXRlb2ZiaXJ0aC5zcGxpdCgnLScpO1xyXG4gICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoJywgZG9iKTtcclxuICAgIH0sXHJcbiAgICBzZXRkb2JzaW1wbGU6IGZ1bmN0aW9uKHRyYXZlbGVyKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0cmF2ZWxlcik7XHJcbiAgICAgICBcclxuICAgICAgICAgICAgdmFyIHJlZ0V4ID0gL15cXGR7Mn0tXFxkezJ9LVxcZHs0fSQvO1xyXG4gICAgICAgXHJcbiAgICAgICAgdmFyIG5vID0gXy5wYXJzZUludCh0cmF2ZWxlclsnbm8nXSk7XHJcbiAgICAgICAgdmFyIHQ9bm8tMTtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGVvZmJpcnRoPSQoXCIjZG9iX1wiK25vKS52YWwoKTtcclxuICAgICAgICBpZihkYXRlb2ZiaXJ0aCE9Jycpe1xyXG4gICAgICAgIGlmKGRhdGVvZmJpcnRoLm1hdGNoKHJlZ0V4KSAhPSBudWxsKXtcclxuICAgICAgICB2YXIgZG9iPWRhdGVvZmJpcnRoLnNwbGl0KCctJyk7XHJcbiAgICAgICAgdmFyIGRvYmI9W2RvYlsyXSxkb2JbMV0sZG9iWzBdXTtcclxuICAgICAgICBpZihfLnBhcnNlSW50KGRvYlswXSk+MzEpe1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBQdXQgVmFsaWQgRGF0ZSBpbiBERC1NTS1ZWVlZIEZvcm1hdFwiKTtcclxuICAgICAgICAgICAgJChcIiNkb2JfXCIrbm8pLnZhbCgnJykuZm9jdXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihfLnBhcnNlSW50KGRvYlsxXSk+MTIpe1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBQdXQgVmFsaWQgRGF0ZSBpbiBERC1NTS1ZWVlZIEZvcm1hdFwiKTtcclxuICAgICAgICAgICAgJChcIiNkb2JfXCIrbm8pLnZhbCgnJykuZm9jdXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgdGhpcy5zZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5iaXJ0aCcsIGRvYmIpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBQdXQgRGF0ZSBpbiBERC1NTS1ZWVlZIEZvcm1hdFwiKTtcclxuICAgICAgICAgICAgJChcIiNkb2JfXCIrbm8pLnZhbCgnJykuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIH0sXHJcbiAgICBcclxuXHJcbnNldHBhc3Nwb3J0ZXhwaXJ5OiBmdW5jdGlvbih0cmF2ZWxlcikge1xyXG4gICAgICAgIHZhciBubyA9IF8ucGFyc2VJbnQodHJhdmVsZXJbJ25vJ10pO1xyXG4gICAgICAgIHZhciB0PW5vLTE7ICAgICAgIFxyXG4gICAgICAgIHZhciBkYXRlb2ZwZWQ9JChcIiNwZWRfXCIrbm8pLnZhbCgpO1xyXG4gICAgICAgIHZhciBwZWQ9ZGF0ZW9mcGVkLnNwbGl0KCctJyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnknLCBwZWQpO1xyXG4gICAgfSxcclxuICAgICBzZXRwYXNzcG9ydGV4cGlyeXNpbXBsZTogZnVuY3Rpb24odHJhdmVsZXIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGVyKTtcclxuICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcmVnRXggPSAvXlxcZHsyfS1cXGR7Mn0tXFxkezR9JC87XHJcbiAgICAgICBcclxuICAgICAgICB2YXIgbm8gPSBfLnBhcnNlSW50KHRyYXZlbGVyWydubyddKTtcclxuICAgICAgICB2YXIgdD1uby0xO1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICB2YXIgZGF0ZW9mcGVkPSQoXCIjcGVkX1wiK25vKS52YWwoKTtcclxuICAgICAgICBpZihkYXRlb2ZwZWQhPScnKXtcclxuICAgICAgICBpZihkYXRlb2ZwZWQubWF0Y2gocmVnRXgpICE9IG51bGwpe1xyXG4gICAgICAgIHZhciBkb2I9ZGF0ZW9mcGVkLnNwbGl0KCctJyk7XHJcbiAgICAgICAgdmFyIGRvYmI9W2RvYlsyXSxkb2JbMV0sZG9iWzBdXTtcclxuICAgICAgICBpZihfLnBhcnNlSW50KGRvYlswXSk+MzEpe1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBQdXQgVmFsaWQgRGF0ZSBpbiBERC1NTS1ZWVlZIEZvcm1hdFwiKTtcclxuICAgICAgICAgICAgJChcIiNwZWRfXCIrbm8pLnZhbCgnJykuZm9jdXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihfLnBhcnNlSW50KGRvYlsxXSk+MTIpe1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBQdXQgVmFsaWQgRGF0ZSBpbiBERC1NTS1ZWVlZIEZvcm1hdFwiKTtcclxuICAgICAgICAgICAgJChcIiNwZWRfXCIrbm8pLnZhbCgnJykuZm9jdXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgdGhpcy5zZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnknLCBkb2JiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgUHV0IERhdGUgaW4gREQtTU0tWVlZWSBGb3JtYXRcIik7XHJcbiAgICAgICAgICAgICQoXCIjcGVkX1wiK25vKS52YWwoJycpLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgfSxcclxuICAgIHRvZ2xsZTpmdW5jdGlvbih0cmF2ZWxlcil7XHJcbiAgICAgICAgIHZhciBubyA9IF8ucGFyc2VJbnQodHJhdmVsZXJbJ25vJ10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoJykhPW51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdkYXRlc3VwcG9ydGVkJykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkb2IgPSB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoLjAnKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGguMScpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5iaXJ0aC4yJyk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2RvYl9cIiArIG5vKS52YWwoZG9iKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBkb2IgPSB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoLjInKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGguMScpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5iaXJ0aC4wJyk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2RvYl9cIiArIG5vKS52YWwoZG9iKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnknKSE9bnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ2RhdGVzdXBwb3J0ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvYiA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjAnKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjEnKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjInKTtcclxuICAgICAgICAgICAgICAgICQoXCIjcGVkX1wiICsgbm8pLnZhbChkb2IpO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBkb2IgPSB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeS4yJykgKyAnLScgKyB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeS4xJykgKyAnLScgKyB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeS4wJyk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3BlZF9cIiArIG5vKS52YWwoZG9iKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRvZ2dsZSgnYWxsJyk7XHJcbiAgICB9XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9wYXNzZW5nZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA4NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBzZWdtZW50IHBhc3NlbmdlciBcIix7XCJ0XCI6MixcInJcIjpcImNsYXNzXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5hbWUgdHJlZSBmaWVsZHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpdGxlIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aXRsZVwiLFwicGxhY2Vob2xkZXJcIjpcIlRpdGxlXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtZXRhLnNlbGVjdFwiXSxcInNcIjpcIl8wLnRpdGxlcygpXCJ9fV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLnRpdGxlX2lkXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLnRpdGxlX2lkXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmlyc3QgbmFtZSBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImZpcnN0bmFtZVwiLFwiY2xhc3NcIjpcImZpcnN0bmFtZVwiLFwicGxhY2Vob2xkZXJcIjpcIkZpcnN0ICYgTWlkZGxlIE5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuZmlyc3RuYW1lXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmZpcnN0bmFtZVwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0cmF2ZWxlcnMgcG9wdXAgdmVydGljYWwgbWVudVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W1wiUGljayBhIHRyYXZlbGVyXCJdfSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInBpY2tUcmF2ZWxlclwiLFwiYVwiOntcInJcIjpbXCIuXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwidXNlciBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImZpcnN0bmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImxhc3RuYW1lXCJ9XX1dLFwiblwiOjUyLFwiclwiOlwidHJhdmVsZXJzXCJ9XSxcIm5cIjo1MCxcInJcIjpcInRyYXZlbGVycy5sZW5ndGhcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJOZXcgdHJhdmVsZXI/XCJdfSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIldlIHdpbGwgcmVnaXN0ZXIgdHJhdmVsZXIgaW4gdGhlIHN5c3RlbSBmb3IgZmFzdGVyIGFjY2Vzcy5cIl19XSxcInJcIjpcInRyYXZlbGVycy5sZW5ndGhcIn1dLFwieFwiOntcInJcIjpbXCJzZWFyY2hcIixcInRyYXZlbGVyLmZpcnN0bmFtZVwiLFwidHJhdmVsZXJzXCJdLFwic1wiOlwie3RyYXZlbGVyczpfMChfMSxfMil9XCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFzdCBuYW1lIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibGFzdG5hbWVcIixcImNsYXNzXCI6XCJsYXN0bmFtZVwiLFwicGxhY2Vob2xkZXJcIjpcIkxhc3RuYW1lXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLmxhc3RuYW1lXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmxhc3RuYW1lXCJ9XX19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiRGF0ZSBvZiBiaXJ0aFwiLHtcInRcIjo0LFwiZlwiOltcIipcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInZhbGlkYXRpb25cIl0sXCJzXCI6XCJcXFwiZG9tZXN0aWNcXFwiIT1fMFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzcG9ydC1leHBpcnkgZGF0ZSB0aHJlZSBmaWVsZHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXlcIixcInBsYWNlaG9sZGVyXCI6XCJEYXlcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5EXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuYmlydGguMlwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5iaXJ0aFwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJtb250aFwiLFwicGxhY2Vob2xkZXJcIjpcIk1vbnRoXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwiclwiOlwiZGF0ZS5zZWxlY3QuTU1NTVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLmJpcnRoLjFcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuYmlydGhcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwieWVhclwiLFwicGxhY2Vob2xkZXJcIjpcIlllYXJcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImRhdGUuc2VsZWN0XCIsXCJ+L3R5cGVfaWRcIl0sXCJzXCI6XCJfMC5iaXJ0aFllYXJzKF8xKVwifX1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5iaXJ0aC4wXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmJpcnRoXCJ9XX19XX1dfSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcImNvbG9yOiAjMzM5OWZmOyBtYXJnaW4tdG9wOiAtMjdweDsgbWFyZ2luLWJvdHRvbTogMTBweDsgZm9udC1zaXplOiAxM3B4O1wifSxcImZcIjpbXCJUaGUgZGF0ZSBvZiBiaXJ0aCBjYW4gYmUgY2hhbmdlZCBsYXRlclwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhbGxcIixcInZhbGlkYXRpb25cIl0sXCJzXCI6XCJfMHx8XFxcImRvbWVzdGljXFxcIiE9XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJQYXNzcG9ydFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicGFzc3BvcnQgdHdvIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwicGFzc3BvcnQtbnVtYmVyXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3BvcnQgTnVtYmVyXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLnBhc3Nwb3J0X251bWJlclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzcG9ydF9udW1iZXJcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLnBhc3Nwb3J0X2NvdW50cnlfaWRcIn1dLFwiY2xhc3NcIjpcInBhc3Nwb3J0LWNvdW50cnlcIixcInNlYXJjaFwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3Nwb3J0IENvdW50cnlcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcIm1ldGEuc2VsZWN0XCJdLFwic1wiOlwiXzAuY291bnRyaWVzKClcIn19XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLnBhc3Nwb3J0X2NvdW50cnlfaWRcIn1dfSxcImZcIjpbXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlBhc3Nwb3J0IGV4cGlyeSBkYXRlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzcG9ydC1leHBpcnkgZGF0ZSB0aHJlZSBmaWVsZHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXlcIixcInBsYWNlaG9sZGVyXCI6XCJEYXlcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5EXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjJcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc3BvcnRfZXhwaXJ5XCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1vbnRoXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9udGhcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5NTU1NXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjFcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc3BvcnRfZXhwaXJ5XCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcInllYXJcIixcInBsYWNlaG9sZGVyXCI6XCJZZWFyXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwiclwiOlwiZGF0ZS5zZWxlY3QucGFzc3BvcnRZZWFyc1wifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeS4wXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLnBhc3Nwb3J0X2V4cGlyeVwifV19fV19XX1dLFwiblwiOjUwLFwiclwiOlwiYWxsXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiYWxpZ25cIjpcImNlbnRlclwiLFwiY2xhc3NcIjpcIm1vcmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyB0aW55IGNpcmN1bGFyIGJ1dHRvblwiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidG9nZ2xlXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJhbGxcXFwiXVwifX19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJMZXNzIEluZm9cIl0sXCJuXCI6NTAsXCJyXCI6XCJhbGxcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiTW9yZSBJbmZvXCJdLFwiclwiOlwiYWxsXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiX1wiLFwiZXJyb3JzXCJdLFwic1wiOlwiXzAuaXNBcnJheShfMSl8fF8wLmlzT2JqZWN0KF8xKVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yc1wifV19XSxcInhcIjp7XCJyXCI6W1wiX1wiLFwiZXJyb3JzXCJdLFwic1wiOlwiXzAuaXNBcnJheShfMSl8fF8wLmlzT2JqZWN0KF8xKVwifX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJyXCI6XCJwYXNzZW5nZXJcIn1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL3Bhc3Nlbmdlci5odG1sXG4gKiogbW9kdWxlIGlkID0gODVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50JyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuICAgIDtcclxuXHJcbnZhclxyXG4gICAgTEFSR0UgPSAnbGFyZ2UnLFxyXG4gICAgRElTQUJMRUQgPSAnZGlzYWJsZWQnLFxyXG4gICAgTE9BRElORyA9ICdpY29uIGxvYWRpbmcnLFxyXG4gICAgREVDT1JBVEVEID0gJ2RlY29yYXRlZCcsXHJcbiAgICBFUlJPUiA9ICdlcnJvcicsXHJcbiAgICBJTiA9ICdpbicsXHJcbiAgICBTRUFSQ0ggPSAnc2VhcmNoJyxcclxuICAgIElOUFVUID0gJ2lucHV0J1xyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vbW9iaWxlc2VsZWN0Lmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjbGFzc2VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZGF0YS5zdGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5kaXNhYmxlZCB8fCBkYXRhLnN0YXRlLnN1Ym1pdHRpbmcpIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUubG9hZGluZykgY2xhc3Nlcy5wdXNoKExPQURJTkcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmVycm9yKSBjbGFzc2VzLnB1c2goRVJST1IpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sYXJnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChJTlBVVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKERFQ09SQVRFRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKExBUkdFKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgfHwgZGF0YS5mb2N1cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goSU4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goU0VBUkNIKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcywgbztcclxuXHJcbiAgICAgICAgdmFyIGVsID0gJCgnLnBvcHVwJywgdmlldy5lbCkubW9iaXNjcm9sbCgpLnNlbGVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uICh2LCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmVsKS5maW5kKCcudHQnKS50ZXh0KHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlPSBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J25hbWUnOiBfLnBhcnNlSW50KHYpfSksICdpZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3RyYXZlbGVyLnRpdGxlX2lkJyx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCd0cmF2ZWxlcicpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9uVmFsdWVUYXA6IGZ1bmN0aW9uICh2LCBpbnN0KSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID12aWV3LmdldCgnb3B0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGU9di5jb250ZXh0LmF0dHJpYnV0ZXNbJ2RhdGEtdmFsJ10ubm9kZVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU9IF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiBfLnBhcnNlSW50KHRpdGxlKX0pLCAnbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZpZXcuZWwpLmZpbmQoJy50dCcpLnRleHQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcucG9wdXAnLCB2aWV3LmVsKS5tb2Jpc2Nyb2xsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd0cmF2ZWxlci50aXRsZV9pZCcsXy5wYXJzZUludCh0aXRsZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHZpZXcuZ2V0KCd0cmF2ZWxlcicpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncHAnK3RpdGxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCd2YWx1ZScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXQoJ29wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gXy5maW5kKG9wdGlvbnMsIHtpZDogdmFsdWV9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG8pIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlbC5kcm9wZG93bignc2V0IHZhbHVlJywgby5pZCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWwuZHJvcGRvd24oJ3NldCB0ZXh0Jywgby50ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICBlbC5kcm9wZG93bigncmVzdG9yZSBkZWZhdWx0cycpO1xyXG5cclxuXHJcbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcbnNlbGVjdHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgXHJcbiAgICAgICB2aWV3LnNldCgndHJhdmVsZXIudGl0bGVfaWQnLF8ucGFyc2VJbnQoJCh0aGlzLmZpbmQoJy5wb3B1cCcpKS52YWwoKSkpO1xyXG4gICAgIC8vICBjb25zb2xlLmxvZyh2aWV3LmdldCgndHJhdmVsZXInKSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCd2YWx1ZScpKTtcclxuICAgIH0sXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy5zZXQoJ29wdGlvbnMnLCBudWxsKTtcclxuICAgIH0sXHJcbiAgICAgZHJvcGRvd25zZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAkKCcucG9wdXAnLCB0aGlzLmVsKS5tb2Jpc2Nyb2xsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2Ryb3Bkb3duc2VsZWN0Jyk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL21vYmlsZXNlbGVjdC5qc1xuICoqIG1vZHVsZSBpZCA9IDg2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIixcImFsaWduXCI6XCJjZW50ZXJcIn0sXCJmXCI6W1wiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGRyb3Bkb3duIFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImRyb3Bkb3duc2VsZWN0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGVmYXVsdCB0ZXh0IHR0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBsYWNlaG9sZGVyXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRyb3Bkb3duIGljb25cIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGlkZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwicG9wdXBcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJpZFwifV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn1dfV0sXCJyXCI6XCJvcHRpb25zXCJ9XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcIm9wdGlvbnMubGVuZ3RoXCJ9XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vbW9iaWxlc2VsZWN0Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA4N1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgb3V0ID0ge1xyXG4gICAgICAgIEQ6IF8ucmFuZ2UoMSwzMiksXHJcbiAgICAgICAgTTogXy5yYW5nZSgxLDEzKSxcclxuICAgICAgICBNTU1NOiBtb21lbnQubW9udGhzKClcclxuICAgIH07XHJcblxyXG4gICAgb3V0LnNlbGVjdCA9IHtcclxuICAgICAgICBEOiBfLm1hcChvdXQuRCwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogXy5wYWRMZWZ0KGksIDIsIDApLCB0ZXh0OiBpIH07IH0pLFxyXG4gICAgICAgIE06IF8ubWFwKG91dC5NLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBfLnBhZExlZnQoaSwgMiwgMCksIHRleHQ6IGkgfTsgfSksXHJcbiAgICAgICAgTU1NTTogXy5tYXAob3V0Lk1NTU0sIGZ1bmN0aW9uKGksIGspIHsgcmV0dXJuIHsgaWQ6IF8ucGFkTGVmdChrICsgMSwgMiwgMCksIHRleHQ6IGkgfTsgfSksXHJcblxyXG4gICAgICAgIHBhc3Nwb3J0WWVhcnM6IF8ubWFwKF8ucmFuZ2UobW9tZW50KCkueWVhcigpLCBtb21lbnQoKS55ZWFyKCkgKyAxNSksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6ICcnK2ksIHRleHQ6ICcnK2kgfTsgfSksXHJcblxyXG4gICAgICAgIGJpcnRoWWVhcnM6IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UobW9tZW50KCkueWVhcigpLCAxODk5LCAtMSksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6ICcnK2ksIHRleHQ6ICcnK2kgfTsgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2FyZFllYXJzOiBfLm1hcChfLnJhbmdlKG1vbWVudCgpLnllYXIoKSwgbW9tZW50KCkuYWRkKDI1LCAneWVhcnMnKS55ZWFyKCkpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiAnJytpLCB0ZXh0OiAnJytpIH07IH0pLFxyXG4gICAgICAgIGNhcmRNb250aHM6IF8ubWFwKG91dC5NTU1NLCBmdW5jdGlvbihpLCBrKSB7IHJldHVybiB7IGlkOiBrICsgMSwgdGV4dDogXy5wYWRMZWZ0KGsrMSwgMiwgJzAnKSArICcgJyArIGkgfTsgfSlcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2hlbHBlcnMvZGF0ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDg4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5yZXF1aXJlKCdqcXVlcnkucGF5bWVudCcpO1xyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG5cclxuICAgIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JyksXHJcbiAgICBoX2R1cmF0aW9uID0gcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKCksXHJcbiAgICBoX2RhdGUgPSByZXF1aXJlKCdoZWxwZXJzL2RhdGUnKSgpLFxyXG4gICAgYWNjb3VudGluZyA9IHJlcXVpcmUoJ2FjY291bnRpbmcuanMnKVxyXG4gICAgO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1jYyc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9jYy9udW1iZXInKSxcclxuICAgICAgICAndWktY3Z2JzogcmVxdWlyZSgnY29yZS9mb3JtL2NjL2N2dicpLFxyXG4gICAgICAgICd1aS1leHBpcnknOiByZXF1aXJlKCdjb3JlL2Zvcm0vY2MvY2FyZGV4cGlyeScpXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcm9tb2NvZGU6bnVsbCxcclxuICAgICAgICAgICAgcHJvbW92YWx1ZTpudWxsLFxyXG4gICAgICAgICAgICBwcm9tb2Vycm9yOm51bGwsXHJcbiAgICAgICAgICAgIGFjY2VwdGVkOnRydWUsXHJcbiAgICAgICAgICAgIG1vbmV5OiBoX21vbmV5LFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogaF9kdXJhdGlvbixcclxuICAgICAgICAgICAgZGF0ZTogaF9kYXRlLFxyXG4gICAgICAgICAgICBiYW5rczogW1xyXG4gICAgICAgICAgICAgICAge2lkOiAnQVhJQicgLCB0ZXh0OiAnQVhJUyBCYW5rIE5ldEJhbmtpbmcnIH0sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdCT0lCJyAsIHRleHQ6ICdCYW5rIG9mIEluZGlhJyB9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQk9NQicsIHRleHQ6ICdCYW5rIG9mIE1haGFyYXNodHJhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdDQklCJywgdGV4dDogJ0NlbnRyYWwgQmFuayBPZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQ1JQQicsIHRleHQ6ICdDb3Jwb3JhdGlvbiBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdEQ0JCJywgdGV4dDogJ0RldmVsb3BtZW50IENyZWRpdCBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdGRURCJywgdGV4dDogJ0ZlZGVyYWwgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSERGQicsIHRleHQ6ICdIREZDIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIC8ve2lkOiAnSUNJQicsIHRleHQ6ICdJQ0lDSSBOZXRiYW5raW5nJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdJREJCJywgdGV4dDogJ0luZHVzdHJpYWwgRGV2ZWxvcG1lbnQgQmFuayBvZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSU5EQicsIHRleHQ6ICdJbmRpYW4gQmFuayAnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0lOSUInLCB0ZXh0OiAnSW5kdXNJbmQgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSU5PQicsIHRleHQ6ICdJbmRpYW4gT3ZlcnNlYXMgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSkFLQicsIHRleHQ6ICdKYW1tdSBhbmQgS2FzaG1pciBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdLUktCJywgdGV4dDogJ0thcm5hdGFrYSBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdLUlZCJywgdGV4dDogJ0thcnVyIFZ5c3lhICd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JCSkInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBCaWthbmVyIGFuZCBKYWlwdXInfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NCSEInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBIeWRlcmFiYWQnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NCSUInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JNQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIE15c29yZSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JUQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIFRyYXZhbmNvcmUnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NPSUInLCB0ZXh0OiAnU291dGggSW5kaWFuIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1VCSUInLCB0ZXh0OiAnVW5pb24gQmFuayBvZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnVU5JQicsIHRleHQ6ICdVbml0ZWQgQmFuayBPZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnVkpZQicsIHRleHQ6ICdWaWpheWEgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnWUVTQicsIHRleHQ6ICdZZXMgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQ1VCQicsIHRleHQ6ICdDaXR5VW5pb24nfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0NBQkInLCB0ZXh0OiAnQ2FuYXJhIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NCUEInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBQYXRpYWxhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdDSVROQicsIHRleHQ6ICdDaXRpIEJhbmsgTmV0QmFua2luZyd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnRFNIQicsIHRleHQ6ICdEZXV0c2NoZSBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICcxNjJCJywgdGV4dDogJ0tvdGFrIEJhbmsnfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBmb3JtYXRZZWFyOiBmdW5jdGlvbiAoeWVhcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHllYXIuc2xpY2UoLTIpOztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0UGF5TW9uZXk6ZnVuY3Rpb24oYW1vdW50KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2NvdW50aW5nLmZvcm1hdE1vbmV5KGFtb3VudCwgJzxpIGNsYXNzPVwiaW5yIGljb24gY3VycmVuY3lcIj48L2k+JywgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnYm9va2luZy5zdGVwcy4zLmFjdGl2ZScsIGZ1bmN0aW9uKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9jYXJkcycsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBib29raW5nX2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjYXJkcycsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXRDYXJkKGRhdGFbZGF0YS5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2FyZHMnLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb2NvZGUnLHZpZXcuZ2V0KCdib29raW5nLnByb21vX2NvZGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb21vdmFsdWUnLHZpZXcuZ2V0KCdib29raW5nLnByb21vX3ZhbHVlJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnYm9va2luZy5wYXltZW50LmFjdGl2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ2Jvb2tpbmcnKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdib29raW5nLnN0ZXBzLjMuZXJyb3JzJywgZmFsc2UpO1xyXG4gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICB2YXIgYm9va2luZyA9IHRoaXMuZ2V0KCdib29raW5nJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYm9va2luZyk7XHJcbi8vICAgICAgICB2YXIgY2FyZGV4cGlyeT0kKCcjY2MtZXhwJykudmFsKCk7XHJcbi8vICAgICAgICBjb25zb2xlLmxvZyhjYXJkZXhwaXJ5KTtcclxuLy8gICAgICAgIGlmKGNhcmRleHBpcnkgIT1udWxsICYmIGNhcmRleHBpcnkgIT0nJyl7XHJcbi8vICAgICAgICAgICAgY2FyZGFycj1jYXJkZXhwaXJ5LnNwbGl0KCcvJyk7XHJcbi8vICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MuZXhwX21vbnRoJyx0cmltKGNhcmRhcnJbMF0pKTtcclxuLy8gICAgICAgICAgICBib29raW5nLnNldCgncGF5bWVudC5jYy5leHBfeWVhcicsdHJpbShjYXJkYXJyWzFdKSk7XHJcbi8vICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5zdGVwMygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRDYXJkOiBmdW5jdGlvbihjYykge1xyXG4gICAgICAgIHZhciBib29raW5nID0gdGhpcy5nZXQoJ2Jvb2tpbmcnKTtcclxuXHJcbiAgICAgICAgaWYgKGJvb2tpbmcuZ2V0KCdwYXltZW50LmNjLmlkJykgIT09IGNjLmlkKSB7XHJcbiAgICAgICAgICAgIGJvb2tpbmcuc2V0KCdwYXltZW50LmNjJywgY2MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJvb2tpbmcuc2V0KCdwYXltZW50LmNjJywge30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0Q0M6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGJvb2tpbmcgPSB0aGlzLmdldCgnYm9va2luZycpLFxyXG4gICAgICAgICAgICBlID0gZXZlbnQub3JpZ2luYWwsXHJcbiAgICAgICAgICAgIGVsID0gJChlLnNyY0VsZW1lbnQpLFxyXG4gICAgICAgICAgICBpZCA9IGJvb2tpbmcuZ2V0KCdwYXltZW50LmNjLmlkJyksXHJcbiAgICAgICAgICAgIHl1cCA9IDAgPT0gZWwucGFyZW50cygnLnVpLmlucHV0LmN2dicpLnNpemUoKSAmJiAoKCdJTlBVVCcgPT0gZWxbMF0udGFnTmFtZSkgfHwgZWwuaGFzQ2xhc3MoJ2Ryb3Bkb3duJykgfHwgZWwucGFyZW50cygnLnVpLmRyb3Bkb3duJykuc2l6ZSgpKTtcclxuXHJcbiAgICAgICAgaWYgKGlkICYmIHl1cCkge1xyXG4gICAgICAgICAgICBib29raW5nLnNldCgncGF5bWVudC5jYycsIHt9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZ2V0KCdib29raW5nJykuYWN0aXZhdGUoMik7XHJcbiAgICB9LFxyXG5cclxuICAgIGFwcGx5UHJvbW9Db2RlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIHByb21vY29kZT10aGlzLmdldCgncHJvbW9jb2RlJyk7XHJcbiAgICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpLHByb21vOnByb21vY29kZX07XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL2NoZWNrUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmhhc093blByb3BlcnR5KCdlcnJvcicpKXsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb2Vycm9yJyxkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb3ZhbHVlJyxkYXRhLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb192YWx1ZScsZGF0YS52YWx1ZSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdib29raW5nLnByb21vX2NvZGUnLGRhdGEuY29kZSk7IFxyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmlldy5nZXQoJ3Byb21vdmFsdWUnKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUHJvbW9Db2RlOmZ1bmN0aW9uKCl7XHJcbiAgICAgLy8gICBjb25zb2xlLmxvZygncmVtb3ZlUHJvbW9Db2RlJyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vZXJyb3InLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb2NvZGUnLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb3ZhbHVlJyxudWxsKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzOyAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvcmVtb3ZlUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb192YWx1ZScsbnVsbCk7IFxyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScsbnVsbCk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlRXJyb3JNc2c6ZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICB9LFxyXG4gICAgY2hlY2tFeHBpcnk6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgJC5mbi50b2dnbGVJbnB1dEVycm9yID0gZnVuY3Rpb24oZXJyZWQpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCgnLmZvcm0tZ3JvdXAnKS50b2dnbGVDbGFzcygnaGFzLWVycm9yJywgZXJyZWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9O1xyXG4gICAgICAkKCcuY2MtZXhwJykudmFsKCk7XHJcbiAgICAgICQucGF5bWVudC52YWxpZGF0ZUNhcmRFeHBpcnkoJzA1JywgJzIwJyk7IC8vPT4gdHJ1ZVxyXG4gICAgICAgICAkKCcuY2MtZXhwJykudG9nZ2xlSW5wdXRFcnJvcighJC5wYXltZW50LnZhbGlkYXRlQ2FyZEV4cGlyeSgkKCcuY2MtZXhwJykucGF5bWVudCgnY2FyZEV4cGlyeVZhbCcpKSk7XHJcbiAgICAgICAgICQoJy52YWxpZGF0aW9uJykucmVtb3ZlQ2xhc3MoJ3RleHQtZGFuZ2VyIHRleHQtc3VjY2VzcycpO1xyXG4gICAgICAgICAkKCcudmFsaWRhdGlvbicpLmFkZENsYXNzKCQoJy5oYXMtZXJyb3InKS5sZW5ndGggPyAndGV4dC1kYW5nZXInIDogJ3RleHQtc3VjY2VzcycpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5qc1xuICoqIG1vZHVsZSBpZCA9IDg5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbihmdW5jdGlvbigpIHtcbiAgdmFyIGNhcmRGcm9tTnVtYmVyLCBjYXJkRnJvbVR5cGUsIGNhcmRzLCBkZWZhdWx0Rm9ybWF0LCBmb3JtYXRCYWNrQ2FyZE51bWJlciwgZm9ybWF0QmFja0V4cGlyeSwgZm9ybWF0Q2FyZE51bWJlciwgZm9ybWF0RXhwaXJ5LCBmb3JtYXRGb3J3YXJkRXhwaXJ5LCBmb3JtYXRGb3J3YXJkU2xhc2hBbmRTcGFjZSwgaGFzVGV4dFNlbGVjdGVkLCBsdWhuQ2hlY2ssIHJlRm9ybWF0Q1ZDLCByZUZvcm1hdENhcmROdW1iZXIsIHJlRm9ybWF0RXhwaXJ5LCByZUZvcm1hdE51bWVyaWMsIHJlc3RyaWN0Q1ZDLCByZXN0cmljdENhcmROdW1iZXIsIHJlc3RyaWN0RXhwaXJ5LCByZXN0cmljdE51bWVyaWMsIHNldENhcmRUeXBlLFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuICAkLnBheW1lbnQgPSB7fTtcblxuICAkLnBheW1lbnQuZm4gPSB7fTtcblxuICAkLmZuLnBheW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywgbWV0aG9kO1xuICAgIG1ldGhvZCA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgcmV0dXJuICQucGF5bWVudC5mblttZXRob2RdLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xuXG4gIGRlZmF1bHRGb3JtYXQgPSAvKFxcZHsxLDR9KS9nO1xuXG4gICQucGF5bWVudC5jYXJkcyA9IGNhcmRzID0gW1xuICAgIHtcbiAgICAgIHR5cGU6ICd2aXNhZWxlY3Ryb24nLFxuICAgICAgcGF0dGVybjogL140KDAyNnwxNzUwMHw0MDV8NTA4fDg0NHw5MVszN10pLyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdtYWVzdHJvJyxcbiAgICAgIHBhdHRlcm46IC9eKDUoMDE4fDBbMjNdfFs2OF0pfDYoMzl8NykpLyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV0sXG4gICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgIGx1aG46IHRydWVcbiAgICB9LCB7XG4gICAgICB0eXBlOiAnZm9yYnJ1Z3Nmb3JlbmluZ2VuJyxcbiAgICAgIHBhdHRlcm46IC9eNjAwLyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdkYW5rb3J0JyxcbiAgICAgIHBhdHRlcm46IC9eNTAxOS8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxNl0sXG4gICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgIGx1aG46IHRydWVcbiAgICB9LCB7XG4gICAgICB0eXBlOiAndmlzYScsXG4gICAgICBwYXR0ZXJuOiAvXjQvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTMsIDE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdtYXN0ZXJjYXJkJyxcbiAgICAgIHBhdHRlcm46IC9eKDVbMC01XXwyWzItN10pLyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdhbWV4JyxcbiAgICAgIHBhdHRlcm46IC9eM1s0N10vLFxuICAgICAgZm9ybWF0OiAvKFxcZHsxLDR9KShcXGR7MSw2fSk/KFxcZHsxLDV9KT8vLFxuICAgICAgbGVuZ3RoOiBbMTVdLFxuICAgICAgY3ZjTGVuZ3RoOiBbMywgNF0sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2RpbmVyc2NsdWInLFxuICAgICAgcGF0dGVybjogL14zWzA2ODldLyxcbiAgICAgIGZvcm1hdDogLyhcXGR7MSw0fSkoXFxkezEsNn0pPyhcXGR7MSw0fSk/LyxcbiAgICAgIGxlbmd0aDogWzE0XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdkaXNjb3ZlcicsXG4gICAgICBwYXR0ZXJuOiAvXjYoWzA0NV18MjIpLyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICd1bmlvbnBheScsXG4gICAgICBwYXR0ZXJuOiAvXig2Mnw4OCkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdqY2InLFxuICAgICAgcGF0dGVybjogL14zNS8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxNl0sXG4gICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgIGx1aG46IHRydWVcbiAgICB9XG4gIF07XG5cbiAgY2FyZEZyb21OdW1iZXIgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgY2FyZCwgX2ksIF9sZW47XG4gICAgbnVtID0gKG51bSArICcnKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gY2FyZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGNhcmQgPSBjYXJkc1tfaV07XG4gICAgICBpZiAoY2FyZC5wYXR0ZXJuLnRlc3QobnVtKSkge1xuICAgICAgICByZXR1cm4gY2FyZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY2FyZEZyb21UeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgIHZhciBjYXJkLCBfaSwgX2xlbjtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGNhcmRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBjYXJkID0gY2FyZHNbX2ldO1xuICAgICAgaWYgKGNhcmQudHlwZSA9PT0gdHlwZSkge1xuICAgICAgICByZXR1cm4gY2FyZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgbHVobkNoZWNrID0gZnVuY3Rpb24obnVtKSB7XG4gICAgdmFyIGRpZ2l0LCBkaWdpdHMsIG9kZCwgc3VtLCBfaSwgX2xlbjtcbiAgICBvZGQgPSB0cnVlO1xuICAgIHN1bSA9IDA7XG4gICAgZGlnaXRzID0gKG51bSArICcnKS5zcGxpdCgnJykucmV2ZXJzZSgpO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZGlnaXRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBkaWdpdCA9IGRpZ2l0c1tfaV07XG4gICAgICBkaWdpdCA9IHBhcnNlSW50KGRpZ2l0LCAxMCk7XG4gICAgICBpZiAoKG9kZCA9ICFvZGQpKSB7XG4gICAgICAgIGRpZ2l0ICo9IDI7XG4gICAgICB9XG4gICAgICBpZiAoZGlnaXQgPiA5KSB7XG4gICAgICAgIGRpZ2l0IC09IDk7XG4gICAgICB9XG4gICAgICBzdW0gKz0gZGlnaXQ7XG4gICAgfVxuICAgIHJldHVybiBzdW0gJSAxMCA9PT0gMDtcbiAgfTtcblxuICBoYXNUZXh0U2VsZWN0ZWQgPSBmdW5jdGlvbigkdGFyZ2V0KSB7XG4gICAgdmFyIF9yZWY7XG4gICAgaWYgKCgkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT0gbnVsbCkgJiYgJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9PSAkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvbkVuZCcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQgIT09IG51bGwgPyAoX3JlZiA9IGRvY3VtZW50LnNlbGVjdGlvbikgIT0gbnVsbCA/IF9yZWYuY3JlYXRlUmFuZ2UgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIGlmIChkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS50ZXh0KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgcmVGb3JtYXROdW1lcmljID0gZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIHZhbHVlID0gJHRhcmdldC52YWwoKTtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVGb3JtYXRDYXJkTnVtYmVyID0gZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIHZhbHVlID0gJHRhcmdldC52YWwoKTtcbiAgICAgIHZhbHVlID0gJC5wYXltZW50LmZvcm1hdENhcmROdW1iZXIodmFsdWUpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICBmb3JtYXRDYXJkTnVtYmVyID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCBjYXJkLCBkaWdpdCwgbGVuZ3RoLCByZSwgdXBwZXJMZW5ndGgsIHZhbHVlO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcih2YWx1ZSArIGRpZ2l0KTtcbiAgICBsZW5ndGggPSAodmFsdWUucmVwbGFjZSgvXFxEL2csICcnKSArIGRpZ2l0KS5sZW5ndGg7XG4gICAgdXBwZXJMZW5ndGggPSAxNjtcbiAgICBpZiAoY2FyZCkge1xuICAgICAgdXBwZXJMZW5ndGggPSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+PSB1cHBlckxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKCR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPSBudWxsKSAmJiAkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT09IHZhbHVlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2FyZCAmJiBjYXJkLnR5cGUgPT09ICdhbWV4Jykge1xuICAgICAgcmUgPSAvXihcXGR7NH18XFxkezR9XFxzXFxkezZ9KSQvO1xuICAgIH0gZWxzZSB7XG4gICAgICByZSA9IC8oPzpefFxccykoXFxkezR9KSQvO1xuICAgIH1cbiAgICBpZiAocmUudGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUgKyAnICcgKyBkaWdpdCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlLnRlc3QodmFsdWUgKyBkaWdpdCkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUgKyBkaWdpdCArICcgJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZm9ybWF0QmFja0NhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmIChlLndoaWNoICE9PSA4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgvXFxkXFxzJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkXFxzJC8sICcnKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKC9cXHNcXGQ/JC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkJC8sICcnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmVGb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSAkLnBheW1lbnQuZm9ybWF0RXhwaXJ5KHZhbHVlKTtcbiAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgZm9ybWF0RXhwaXJ5ID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsID0gJHRhcmdldC52YWwoKSArIGRpZ2l0O1xuICAgIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiAodmFsICE9PSAnMCcgJiYgdmFsICE9PSAnMScpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiMFwiICsgdmFsICsgXCIgLyBcIik7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKC9eXFxkXFxkJC8udGVzdCh2YWwpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmb3JtYXRGb3J3YXJkRXhwaXJ5ID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsID0gJHRhcmdldC52YWwoKTtcbiAgICBpZiAoL15cXGRcXGQkLy50ZXN0KHZhbCkpIHtcbiAgICAgIHJldHVybiAkdGFyZ2V0LnZhbChcIlwiICsgdmFsICsgXCIgLyBcIik7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCB2YWwsIHdoaWNoO1xuICAgIHdoaWNoID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoISh3aGljaCA9PT0gJy8nIHx8IHdoaWNoID09PSAnICcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsID0gJHRhcmdldC52YWwoKTtcbiAgICBpZiAoL15cXGQkLy50ZXN0KHZhbCkgJiYgdmFsICE9PSAnMCcpIHtcbiAgICAgIHJldHVybiAkdGFyZ2V0LnZhbChcIjBcIiArIHZhbCArIFwiIC8gXCIpO1xuICAgIH1cbiAgfTtcblxuICBmb3JtYXRCYWNrRXhwaXJ5ID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCB2YWx1ZTtcbiAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIHZhbHVlID0gJHRhcmdldC52YWwoKTtcbiAgICBpZiAoZS53aGljaCAhPT0gOCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKCR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPSBudWxsKSAmJiAkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT09IHZhbHVlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoL1xcZFxcc1xcL1xccyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlLnJlcGxhY2UoL1xcZFxcc1xcL1xccyQvLCAnJykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJlRm9ybWF0Q1ZDID0gZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIHZhbHVlID0gJHRhcmdldC52YWwoKTtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCA0KTtcbiAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmVzdHJpY3ROdW1lcmljID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBpbnB1dDtcbiAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChlLndoaWNoID09PSAzMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoZS53aGljaCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChlLndoaWNoIDwgMzMpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpbnB1dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCk7XG4gICAgcmV0dXJuICEhL1tcXGRcXHNdLy50ZXN0KGlucHV0KTtcbiAgfTtcblxuICByZXN0cmljdENhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGNhcmQsIGRpZ2l0LCB2YWx1ZTtcbiAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQoJHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFsdWUgPSAoJHRhcmdldC52YWwoKSArIGRpZ2l0KS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcih2YWx1ZSk7XG4gICAgaWYgKGNhcmQpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPD0gY2FyZC5sZW5ndGhbY2FyZC5sZW5ndGgubGVuZ3RoIC0gMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPD0gMTY7XG4gICAgfVxuICB9O1xuXG4gIHJlc3RyaWN0RXhwaXJ5ID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsdWU7XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaGFzVGV4dFNlbGVjdGVkKCR0YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhbHVlID0gJHRhcmdldC52YWwoKSArIGRpZ2l0O1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICBpZiAodmFsdWUubGVuZ3RoID4gNikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICByZXN0cmljdENWQyA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgZGlnaXQsIHZhbDtcbiAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQoJHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFsID0gJHRhcmdldC52YWwoKSArIGRpZ2l0O1xuICAgIHJldHVybiB2YWwubGVuZ3RoIDw9IDQ7XG4gIH07XG5cbiAgc2V0Q2FyZFR5cGUgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGFsbFR5cGVzLCBjYXJkLCBjYXJkVHlwZSwgdmFsO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsID0gJHRhcmdldC52YWwoKTtcbiAgICBjYXJkVHlwZSA9ICQucGF5bWVudC5jYXJkVHlwZSh2YWwpIHx8ICd1bmtub3duJztcbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoY2FyZFR5cGUpKSB7XG4gICAgICBhbGxUeXBlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBjYXJkcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGNhcmQgPSBjYXJkc1tfaV07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChjYXJkLnR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH0pKCk7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKCd1bmtub3duJyk7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKGFsbFR5cGVzLmpvaW4oJyAnKSk7XG4gICAgICAkdGFyZ2V0LmFkZENsYXNzKGNhcmRUeXBlKTtcbiAgICAgICR0YXJnZXQudG9nZ2xlQ2xhc3MoJ2lkZW50aWZpZWQnLCBjYXJkVHlwZSAhPT0gJ3Vua25vd24nKTtcbiAgICAgIHJldHVybiAkdGFyZ2V0LnRyaWdnZXIoJ3BheW1lbnQuY2FyZFR5cGUnLCBjYXJkVHlwZSk7XG4gICAgfVxuICB9O1xuXG4gICQucGF5bWVudC5mbi5mb3JtYXRDYXJkQ1ZDID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdE51bWVyaWMpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3RDVkMpO1xuICAgIHRoaXMub24oJ3Bhc3RlJywgcmVGb3JtYXRDVkMpO1xuICAgIHRoaXMub24oJ2NoYW5nZScsIHJlRm9ybWF0Q1ZDKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0Q1ZDKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAkLnBheW1lbnQuZm4uZm9ybWF0Q2FyZEV4cGlyeSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0RXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdEV4cGlyeSk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCBmb3JtYXRGb3J3YXJkU2xhc2hBbmRTcGFjZSk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCBmb3JtYXRGb3J3YXJkRXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdrZXlkb3duJywgZm9ybWF0QmFja0V4cGlyeSk7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRFeHBpcnkpO1xuICAgIHRoaXMub24oJ2lucHV0JywgcmVGb3JtYXRFeHBpcnkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gICQucGF5bWVudC5mbi5mb3JtYXRDYXJkTnVtYmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdE51bWVyaWMpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3RDYXJkTnVtYmVyKTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdENhcmROdW1iZXIpO1xuICAgIHRoaXMub24oJ2tleWRvd24nLCBmb3JtYXRCYWNrQ2FyZE51bWJlcik7XG4gICAgdGhpcy5vbigna2V5dXAnLCBzZXRDYXJkVHlwZSk7XG4gICAgdGhpcy5vbigncGFzdGUnLCByZUZvcm1hdENhcmROdW1iZXIpO1xuICAgIHRoaXMub24oJ2NoYW5nZScsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbignaW5wdXQnLCByZUZvcm1hdENhcmROdW1iZXIpO1xuICAgIHRoaXMub24oJ2lucHV0Jywgc2V0Q2FyZFR5cGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gICQucGF5bWVudC5mbi5yZXN0cmljdE51bWVyaWMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgdGhpcy5vbigncGFzdGUnLCByZUZvcm1hdE51bWVyaWMpO1xuICAgIHRoaXMub24oJ2NoYW5nZScsIHJlRm9ybWF0TnVtZXJpYyk7XG4gICAgdGhpcy5vbignaW5wdXQnLCByZUZvcm1hdE51bWVyaWMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gICQucGF5bWVudC5mbi5jYXJkRXhwaXJ5VmFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICQucGF5bWVudC5jYXJkRXhwaXJ5VmFsKCQodGhpcykudmFsKCkpO1xuICB9O1xuXG4gICQucGF5bWVudC5jYXJkRXhwaXJ5VmFsID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgbW9udGgsIHByZWZpeCwgeWVhciwgX3JlZjtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAgX3JlZiA9IHZhbHVlLnNwbGl0KCcvJywgMiksIG1vbnRoID0gX3JlZlswXSwgeWVhciA9IF9yZWZbMV07XG4gICAgaWYgKCh5ZWFyICE9IG51bGwgPyB5ZWFyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDIgJiYgL15cXGQrJC8udGVzdCh5ZWFyKSkge1xuICAgICAgcHJlZml4ID0gKG5ldyBEYXRlKS5nZXRGdWxsWWVhcigpO1xuICAgICAgcHJlZml4ID0gcHJlZml4LnRvU3RyaW5nKCkuc2xpY2UoMCwgMik7XG4gICAgICB5ZWFyID0gcHJlZml4ICsgeWVhcjtcbiAgICB9XG4gICAgbW9udGggPSBwYXJzZUludChtb250aCwgMTApO1xuICAgIHllYXIgPSBwYXJzZUludCh5ZWFyLCAxMCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgIHllYXI6IHllYXJcbiAgICB9O1xuICB9O1xuXG4gICQucGF5bWVudC52YWxpZGF0ZUNhcmROdW1iZXIgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgY2FyZCwgX3JlZjtcbiAgICBudW0gPSAobnVtICsgJycpLnJlcGxhY2UoL1xccyt8LS9nLCAnJyk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KG51bSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKG51bSk7XG4gICAgaWYgKCFjYXJkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAoX3JlZiA9IG51bS5sZW5ndGgsIF9faW5kZXhPZi5jYWxsKGNhcmQubGVuZ3RoLCBfcmVmKSA+PSAwKSAmJiAoY2FyZC5sdWhuID09PSBmYWxzZSB8fCBsdWhuQ2hlY2sobnVtKSk7XG4gIH07XG5cbiAgJC5wYXltZW50LnZhbGlkYXRlQ2FyZEV4cGlyeSA9IGZ1bmN0aW9uKG1vbnRoLCB5ZWFyKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lLCBleHBpcnksIF9yZWY7XG4gICAgaWYgKHR5cGVvZiBtb250aCA9PT0gJ29iamVjdCcgJiYgJ21vbnRoJyBpbiBtb250aCkge1xuICAgICAgX3JlZiA9IG1vbnRoLCBtb250aCA9IF9yZWYubW9udGgsIHllYXIgPSBfcmVmLnllYXI7XG4gICAgfVxuICAgIGlmICghKG1vbnRoICYmIHllYXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG1vbnRoID0gJC50cmltKG1vbnRoKTtcbiAgICB5ZWFyID0gJC50cmltKHllYXIpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChtb250aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghKCgxIDw9IG1vbnRoICYmIG1vbnRoIDw9IDEyKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHllYXIubGVuZ3RoID09PSAyKSB7XG4gICAgICBpZiAoeWVhciA8IDcwKSB7XG4gICAgICAgIHllYXIgPSBcIjIwXCIgKyB5ZWFyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeWVhciA9IFwiMTlcIiArIHllYXI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh5ZWFyLmxlbmd0aCAhPT0gNCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBleHBpcnkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCk7XG4gICAgY3VycmVudFRpbWUgPSBuZXcgRGF0ZTtcbiAgICBleHBpcnkuc2V0TW9udGgoZXhwaXJ5LmdldE1vbnRoKCkgLSAxKTtcbiAgICBleHBpcnkuc2V0TW9udGgoZXhwaXJ5LmdldE1vbnRoKCkgKyAxLCAxKTtcbiAgICByZXR1cm4gZXhwaXJ5ID4gY3VycmVudFRpbWU7XG4gIH07XG5cbiAgJC5wYXltZW50LnZhbGlkYXRlQ2FyZENWQyA9IGZ1bmN0aW9uKGN2YywgdHlwZSkge1xuICAgIHZhciBjYXJkLCBfcmVmO1xuICAgIGN2YyA9ICQudHJpbShjdmMpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChjdmMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNhcmQgPSBjYXJkRnJvbVR5cGUodHlwZSk7XG4gICAgaWYgKGNhcmQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIF9yZWYgPSBjdmMubGVuZ3RoLCBfX2luZGV4T2YuY2FsbChjYXJkLmN2Y0xlbmd0aCwgX3JlZikgPj0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN2Yy5sZW5ndGggPj0gMyAmJiBjdmMubGVuZ3RoIDw9IDQ7XG4gICAgfVxuICB9O1xuXG4gICQucGF5bWVudC5jYXJkVHlwZSA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBfcmVmO1xuICAgIGlmICghbnVtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuICgoX3JlZiA9IGNhcmRGcm9tTnVtYmVyKG51bSkpICE9IG51bGwgPyBfcmVmLnR5cGUgOiB2b2lkIDApIHx8IG51bGw7XG4gIH07XG5cbiAgJC5wYXltZW50LmZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgY2FyZCwgZ3JvdXBzLCB1cHBlckxlbmd0aCwgX3JlZjtcbiAgICBudW0gPSBudW0ucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICBpZiAoIWNhcmQpIHtcbiAgICAgIHJldHVybiBudW07XG4gICAgfVxuICAgIHVwcGVyTGVuZ3RoID0gY2FyZC5sZW5ndGhbY2FyZC5sZW5ndGgubGVuZ3RoIC0gMV07XG4gICAgbnVtID0gbnVtLnNsaWNlKDAsIHVwcGVyTGVuZ3RoKTtcbiAgICBpZiAoY2FyZC5mb3JtYXQuZ2xvYmFsKSB7XG4gICAgICByZXR1cm4gKF9yZWYgPSBudW0ubWF0Y2goY2FyZC5mb3JtYXQpKSAhPSBudWxsID8gX3JlZi5qb2luKCcgJykgOiB2b2lkIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdyb3VwcyA9IGNhcmQuZm9ybWF0LmV4ZWMobnVtKTtcbiAgICAgIGlmIChncm91cHMgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBncm91cHMuc2hpZnQoKTtcbiAgICAgIGdyb3VwcyA9ICQuZ3JlcChncm91cHMsIGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG47XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBncm91cHMuam9pbignICcpO1xuICAgIH1cbiAgfTtcblxuICAkLnBheW1lbnQuZm9ybWF0RXhwaXJ5ID0gZnVuY3Rpb24oZXhwaXJ5KSB7XG4gICAgdmFyIG1vbiwgcGFydHMsIHNlcCwgeWVhcjtcbiAgICBwYXJ0cyA9IGV4cGlyeS5tYXRjaCgvXlxcRCooXFxkezEsMn0pKFxcRCspPyhcXGR7MSw0fSk/Lyk7XG4gICAgaWYgKCFwYXJ0cykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBtb24gPSBwYXJ0c1sxXSB8fCAnJztcbiAgICBzZXAgPSBwYXJ0c1syXSB8fCAnJztcbiAgICB5ZWFyID0gcGFydHNbM10gfHwgJyc7XG4gICAgaWYgKHllYXIubGVuZ3RoID4gMCkge1xuICAgICAgc2VwID0gJyAvICc7XG4gICAgfSBlbHNlIGlmIChzZXAgPT09ICcgLycpIHtcbiAgICAgIG1vbiA9IG1vbi5zdWJzdHJpbmcoMCwgMSk7XG4gICAgICBzZXAgPSAnJztcbiAgICB9IGVsc2UgaWYgKG1vbi5sZW5ndGggPT09IDIgfHwgc2VwLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlcCA9ICcgLyAnO1xuICAgIH0gZWxzZSBpZiAobW9uLmxlbmd0aCA9PT0gMSAmJiAobW9uICE9PSAnMCcgJiYgbW9uICE9PSAnMScpKSB7XG4gICAgICBtb24gPSBcIjBcIiArIG1vbjtcbiAgICAgIHNlcCA9ICcgLyAnO1xuICAgIH1cbiAgICByZXR1cm4gbW9uICsgc2VwICsgeWVhcjtcbiAgfTtcblxufSkuY2FsbCh0aGlzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvanF1ZXJ5LnBheW1lbnQvbGliL2pxdWVyeS5wYXltZW50LmpzXG4gKiogbW9kdWxlIGlkID0gOTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDhcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wic3RlcCBoZWFkZXIgc3RlcDMgXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5hY3RpdmVcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiY29tcGxldGVkXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5jb21wbGV0ZWRcIn1dLFwicm9sZVwiOlwidGFiXCJ9LFwiZlwiOltcIlBheW1lbnQgRGV0YWlsc1wiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W10sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0ZXAuYWN0aXZlXCIsXCJzdGVwLmNvbXBsZXRlZFwiXSxcInNcIjpcIiFfMCYmXzFcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W1widWkgZm9ybSBzZWdtZW50IHN0ZXAzIFwiLHtcInRcIjo0LFwiZlwiOltcImVycm9yXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5lcnJvcnNcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuc3VibWl0dGluZ1wifV19LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHBvaW50aW5nIHNlY29uZGFyeSBtZW51XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOltcIml0ZW0gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMFwifX1dLFwiZGF0YS10YWJcIjpcImR1bW15XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJib29raW5nLnBheW1lbnQuYWN0aXZlXFxcIiwxXVwifX19LFwiZlwiOltcIkNSRURJVCBDQVJEXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOltcIml0ZW0gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIyPT1fMFwifX1dLFwiZGF0YS10YWJcIjpcImR1bW15XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJib29raW5nLnBheW1lbnQuYWN0aXZlXFxcIiwyXVwifX19LFwiZlwiOltcIkRFQklUIENBUkRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjM9PV8wXCJ9fV0sXCJkYXRhLXRhYlwiOlwiZHVtbXlcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImJvb2tpbmcucGF5bWVudC5hY3RpdmVcXFwiLDNdXCJ9fX0sXCJmXCI6W1wiTkVUIEJBTktJTkdcIl19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNyZWRpdC1jYXJkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0d28gY29sdW1uIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlc2V0Q0NcIixcImFcIjp7XCJyXCI6W1wiZXZlbnRcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm51bWJlciBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIkNyZWRpdFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5wYXltZW50LmFjdGl2ZVwiXSxcInNcIjpcIjE9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJEZWJpdFwiXSxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5wYXltZW50LmFjdGl2ZVwiXSxcInNcIjpcIjE9PV8wXCJ9fSxcIiBDYXJkIE51bWJlciBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWNjXCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwiY2FyZC1udW1iZXIgZmx1aWRcIixcImNjdHlwZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLnR5cGVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5udW1iZXJcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5udW1iZXJcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGhyZWUgZXhwaXJ5IGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkV4cGlyeSBNb250aCBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuaWRcIn1dLFwiY2xhc3NcIjpcIm1vbnRoXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9udGhcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5jYXJkTW9udGhzXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuZXhwX21vbnRoXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMuZXhwX21vbnRoXCJ9XX0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJFeHBpcnkgWWVhciBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuaWRcIn1dLFwiY2xhc3NcIjpcInllYXJcIixcInBsYWNlaG9sZGVyXCI6XCJZZWFyXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwiclwiOlwiZGF0ZS5zZWxlY3QuY2FyZFllYXJzXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuZXhwX3llYXJcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5leHBfeWVhclwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwiLFwic3R5bGVcIjpcInBvc2l0aW9uOiByZWxhdGl2ZTtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkNWViBObyBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWN2dlwiLFwiYVwiOntcImNsYXNzXCI6XCJmbHVpZCBjdnZcIixcImNjdHlwZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLnR5cGVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5jdnZcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5jdnZcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2LWltYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbXCI0IGRpZ2l0IENWViBOdW1iZXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImN2djQtaW1nXCJ9LFwiZlwiOltcIsKgXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImNjLnR5cGVcIl0sXCJzXCI6XCJcXFwiYW1leFxcXCI9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbXCIzIGRpZ2l0IENWViBOdW1iZXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImN2djMtaW1nXCJ9LFwiZlwiOltcIsKgXCJdfV0sXCJ4XCI6e1wiclwiOltcImNjLnR5cGVcIl0sXCJzXCI6XCJcXFwiYW1leFxcXCI9PV8wXCJ9fV19XSxcIm5cIjo1MCxcInJcIjpcImNjLnR5cGVcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibnVtYmVyIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJDYXJkIEhvbGRlcidzIE5hbWUgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlcXVpcmVkXCJ9LFwiZlwiOltcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuaWRcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLm5hbWVcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5uYW1lXCJ9XX0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInN0b3JlIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmlkXCJ9XSxcInR5cGVcIjpcImNoZWNrYm94XCIsXCJjaGVja2VkXCI6W3tcInRcIjoyLFwiclwiOlwiY2Muc3RvcmVcIn1dfX0sXCIgU3RvcmUgY2FyZCBmb3IgZnV0dXJlIHVzZS5cIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZWdtZW50IGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJTYXZlZCBjYXJkc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbGlzdFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcImphdmFzY3JpcHQ6O1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldENhcmRcIixcImFcIjp7XCJyXCI6W1wiLlwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJudW1iZXJcIixcInNcIjp0cnVlfV19XX1dLFwiblwiOjUyLFwiclwiOlwiY2FyZHNcIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcImNhcmRzXCJ9XX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMT09XzB8fDI9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibmV0YmFua2luZ1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiQmFuayBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiU2VsZWN0IFlvdXIgQmFuayBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJiYW5rIGZsdWlkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIm5ldGJhbmtpbmcubmV0X2JhbmtpbmdcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5uZXRfYmFua2luZ1wifV0sXCJvcHRpb25zXCI6W3tcInRcIjoyLFwiclwiOlwiYmFua3NcIn1dfX1dfV19XSxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMT09XzB8fDI9PV8wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJzdGVwLmVycm9yc1wifV19XSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuZXJyb3JzXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHR3byBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidHdvIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiQXBwbHkgUHJvbW8gQ29kZXNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInByb21vY29kZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9tb2NvZGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIkVudGVyIFByb21vIENvZGVcIixcImRpc2FibGVkXCI6XCJkaXNhYmxlZFwifSxcImZcIjpbXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicHJvbW9jb2RlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb21vY29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgXCIsXCJwbGFjZWhvbGRlclwiOlwiRW50ZXIgUHJvbW8gQ29kZVwifSxcImZcIjpbXX1dLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZW1vdmVQcm9tb0NvZGVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwicmVkIHJlbW92ZSBjaXJjbGUgb3V0bGluZSBpY29uXCIsXCJhbHRcIjpcIlJlbW92ZSBQcm9tbyBDb2RlXCIsXCJ0aXRsZVwiOlwiUmVtb3ZlIFByb21vIENvZGVcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBidXR0b25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJhcHBseVByb21vQ29kZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiQVBQTFlcIl19XSxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjpib3RoO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc21hbGwgZmllbGQgbmVnYXRpdmUgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZW1vdmVFcnJvck1zZ1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwicHJvbW9lcnJvclwifV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb2Vycm9yXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmNsaWVudFNvdXJjZUlkXCJdLFwic1wiOlwiXzA9PTFcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJub3RlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJQbGVhc2UgTm90ZSA6XCJdfSxcIiBUaGUgY2hhcmdlIHdpbGwgYXBwZWFyIG9uIHlvdXIgY3JlZGl0IGNhcmQgLyBBY2NvdW50IHN0YXRlbWVudCBhcyAnQWlydGlja2V0cyBJbmRpYSBQdnQgTHRkJ1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWdyZWVtZW50IGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJjaGVja2JveFwiLFwiY2hlY2tlZFwiOlt7XCJ0XCI6MixcInJcIjpcImFjY2VwdGVkXCJ9XX19LFwiIEkgaGF2ZSByZWFkIGFuZCBhY2NlcHRlZCB0aGUgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9jbXMvdGVybXNBbmRDb25kaXRpb25zLzJcIixcInRhcmdldFwiOlwiX2JsYW5rXCJ9LFwiZlwiOltcIlRlcm1zIE9mIFNlcnZpY2VcIl19LFwiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W1wiQ29udmVuaWVuY2UgZmVlIFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5jb252ZW5pZW5jZUZlZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiB3aWxsIGJlIGNoYXJnZWRcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jb252ZW5pZW5jZUZlZVwiXSxcInNcIjpcIl8wPjBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFtb3VudFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMStfMixfMylcIn19LFwiIC0gXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwcm9tb3ZhbHVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiID0gXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJwcm9tb3ZhbHVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMStfMi1fMyxfNClcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiKFwiLHtcInRcIjoyLFwiclwiOlwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJ9LFwiIFByaWNlIGlzIGluZGljYXRpdmUgb25seS4gWW91IHdpbGwgYmUgY2hhcmdlZCBlcXVpdmFsZW50IGluIElOUi4gXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcImZvcm1hdFBheU1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAoXzErXzItXzMpXCJ9fV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wIT1cXFwiSU5SXFxcIlwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJhbW91bnRcIn0sXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5jb252ZW5pZW5jZUZlZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzErXzIsXzMpXCJ9fSxcIiAtIFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicHJvbW92YWx1ZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiA9IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5jb252ZW5pZW5jZUZlZVwiLFwicHJvbW92YWx1ZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzErXzItXzMsXzQpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIihUb3RhbCBQYXlhYmxlIEFtb3VudClcIl19XSxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wIT1cXFwiSU5SXFxcIlwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFtb3VudFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMStfMixfMylcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFtdE5vdGljZVwifSxcImZcIjpbXCIoXCIse1widFwiOjIsXCJyXCI6XCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIn0sXCIgUHJpY2UgaXMgaW5kaWNhdGl2ZSBvbmx5LiBZb3Ugd2lsbCBiZSBjaGFyZ2VkIGVxdWl2YWxlbnQgaW4gSU5SLiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiZm9ybWF0UGF5TW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIl0sXCJzXCI6XCJfMChfMStfMilcIn19LFwiKVwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAhPVxcXCJJTlJcXFwiXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFtb3VudFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMStfMixfMylcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiKFRvdGFsIFBheWFibGUgQW1vdW50KVwiXX1dLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAhPVxcXCJJTlJcXFwiXCJ9fV0sXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ2ZXJpZmllZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy92ZXJpZmllZC92YnZfMjUwLmdpZlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy92ZXJpZmllZC9tYXN0ZXJjYXJkX3NlY3VyZWNvZGUuZ2lmXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL3ZlcmlmaWVkL0FNRVhfU2FmZUtleV8xODB4OTlweC5wbmdcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvdmVyaWZpZWQvcGNpLWRzcy1jb21wbGlhbnQuanBnXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL3ZlcmlmaWVkL1NTTC1zZWN1cml0eS1zZWFsLnBuZ1wifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOltcInVpIHdpemFyZCBidXR0b24gbWFzc2l2ZSBcIix7XCJ0XCI6NCxcImZcIjpbXCJncmVlblwiXSxcIm5cIjo1MCxcInJcIjpcImFjY2VwdGVkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcInJlZFwiXSxcInJcIjpcImFjY2VwdGVkXCJ9XX0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJcIl0sXCJuXCI6NTEsXCJyXCI6XCJhY2NlcHRlZFwifV0sXCJmXCI6W1wiQk9PSyBGTElHSFRcIl19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifV0sXCJ4XCI6e1wiclwiOltcInN0ZXAuYWN0aXZlXCIsXCJzdGVwLmNvbXBsZXRlZFwiXSxcInNcIjpcIiFfMCYmXzFcIn19XSxcIm5cIjo1MSxcInJcIjpcInN0ZXAuY29tcGxldGVkXCJ9XSxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5zdGVwcy4zXCIsXCJib29raW5nLnBheW1lbnQuY2NcIixcImJvb2tpbmcucGF5bWVudC5uZXRiYW5raW5nXCIsXCJib29raW5nLnBheW1lbnQuYWN0aXZlXCJdLFwic1wiOlwie3N0ZXA6XzAsY2M6XzEsbmV0YmFua2luZzpfMixhY3RpdmU6XzN9XCJ9fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL3N0ZXAzLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA5MVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCdqcXVlcnkucGF5bWVudCcpO1xyXG5cclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi4vaW5wdXQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NjLmh0bWwnKSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkucGF5bWVudCgnZm9ybWF0Q2FyZE51bWJlcicpO1xyXG5cclxuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ2NjdHlwZScsICQucGF5bWVudC5jYXJkVHlwZSh2YWx1ZSkpO1xyXG4gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdkZXN0cm95Jyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vY2MvbnVtYmVyLmpzXG4gKiogbW9kdWxlIGlkID0gOTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDhcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGlucHV0IFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY2xhc3Nlc1wiLFwic3RhdGVcIixcImxhcmdlXCIsXCJ2YWx1ZVwiXSxcInNcIjpcIl8wKF8xLF8yLF8zKVwifX1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHBsYWNlaG9sZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBsYWNlaG9sZGVyXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwibGFyZ2VcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpbe1widFwiOjQsXCJmXCI6W1widGV4dFwiXSxcIm5cIjo1MCxcInJcIjpcImRpc2FibGVkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcInRlbFwiXSxcInJcIjpcImRpc2FibGVkXCJ9XSxcIm5hbWVcIjpbe1widFwiOjIsXCJyXCI6XCJuYW1lXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wicGxhY2Vob2xkZXI9XFxcIlwiLHtcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn0sXCJcXFwiXCJdLFwiblwiOjUxLFwiclwiOlwibGFyZ2VcIn0se1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJkaXNhYmxlZFwifSx7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZD1cXFwiZGlzYWJsZWRcXFwiXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzdGF0ZS5kaXNhYmxlZFwiLFwic3RhdGUuc3VibWl0dGluZ1wiXSxcInNcIjpcIl8wfHxfMVwifX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkTGlzdCBjbGVhckZpeCBmTGVmdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6W1wiY2FyZFR5cGUgXCIse1widFwiOjIsXCJyXCI6XCJjY3R5cGVcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjY3R5cGVcIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcImNjdHlwZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkTGlzdCBjbGVhckZpeCBmTGVmdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSB2aXNhXCJ9LFwiZlwiOltcIlZpc2FcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FyZFR5cGUgbWFzdGVyXCJ9LFwiZlwiOltcIk1hc3RlcmNhcmRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FyZFR5cGUgYW1leFwifSxcImZcIjpbXCJBbWVyaWNhbiBFeHByZXNzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRUeXBlIGRpbmVyc1wifSxcImZcIjpbXCJEaW5lcnNcIl19XX1dLFwiclwiOlwiY2N0eXBlXCJ9XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9jYy5odG1sXG4gKiogbW9kdWxlIGlkID0gOTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDhcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCdqcXVlcnkucGF5bWVudCcpO1xyXG5cclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi4vaW5wdXQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICB0eXBlOiAndGVsJ1xyXG4gICAgICAgICAgIC8vIHR5cGU6ICdwYXNzd29yZCdcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdmb3JtYXRDYXJkQ1ZDJyk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Rlc3Ryb3knKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9jYy9jdnYuanNcbiAqKiBtb2R1bGUgaWQgPSA5NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJ2pxdWVyeS5wYXltZW50Jyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuLi9pbnB1dCcpLFxyXG4gICAgICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgdHlwZTogJ3RlbCdcclxuICAgICAgICAgICAvLyB0eXBlOiAncGFzc3dvcmQnXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuICAgICAgICB2YXIgdmlldz10aGlzO1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdmb3JtYXRDYXJkRXhwaXJ5Jyk7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLmtleXVwKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgYm9va2luZyA9IHZpZXcuZ2V0KCdib29raW5nJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGNhcmRleHBpcnk9JCh2aWV3LmZpbmQoJ2lucHV0JykpLnZhbCgpO1xyXG4gICAgIC8vICAgY29uc29sZS5sb2coY2FyZGV4cGlyeSk7XHJcbiAgICAgICAgaWYoY2FyZGV4cGlyeSAhPW51bGwgJiYgY2FyZGV4cGlyeSAhPScnKXtcclxuICAgICAgICAgICAgY2FyZGV4cGlyeS5yZXBsYWNlKC8gL2csJycpO1xyXG4gICAgICAgICAgICB2YXIgY2FyZGFycj1jYXJkZXhwaXJ5LnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgIGlmKGNhcmRhcnJbMF0hPSBudWxsKXtcclxuICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MuZXhwX21vbnRoJyxfLnBhcnNlSW50KGNhcmRhcnJbMF0pKTt9XHJcbiAgICAgICAgaWYoY2FyZGFyclsxXSE9IG51bGwpe1xyXG4gICAgICAgICAgICB2YXIgbGVuPWNhcmRhcnJbMV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgY2FyZHllYXI9Xy5wYXJzZUludChjYXJkYXJyWzFdKTtcclxuICAgICAgICAgICAgaWYoY2FyZHllYXI8MTAwKXtcclxuICAgICAgICAgICAgICAgIGNhcmR5ZWFyPTIwMDArY2FyZHllYXI7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKGNhcmR5ZWFyPDEwMDApe1xyXG4gICAgICAgICAgICAgICAgY2FyZHllYXI9MjAwMCtjYXJkeWVhcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgIGNvbnNvbGUubG9nKGNhcmR5ZWFyKTtcclxuICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MuZXhwX3llYXInLGNhcmR5ZWFyKTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Rlc3Ryb3knKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9jYy9jYXJkZXhwaXJ5LmpzXG4gKiogbW9kdWxlIGlkID0gOTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuXHJcbiAgICBoX21vbmV5ID0gcmVxdWlyZSgnaGVscGVycy9tb25leScpKCksXHJcbiAgICBoX2R1cmF0aW9uID0gcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKCksXHJcbiAgICBoX2RhdGUgPSByZXF1aXJlKCdoZWxwZXJzL2RhdGUnKSgpXHJcbiAgICA7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL3N0ZXA0Lmh0bWwnKSxcclxuICAgIGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZ2V0KCdib29raW5nJykuYWN0aXZhdGUoMyk7XHJcbiAgICB9LFxyXG4gICAgICAgIFxyXG4gICB9KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDQuanNcbiAqKiBtb2R1bGUgaWQgPSA5NlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzdGVwIGhlYWRlciBzdGVwNCBhY3RpdmVcIixcInJvbGVcIjpcInRhYlwifSxcImZcIjpbXCJCb29raW5nXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpcInVpIGZvcm0gc2VnbWVudCBzdGVwNFwiLFwic3R5bGVcIjpcImhlaWdodDogNDAwcHg7IHRleHQtYWxpZ246IGNlbnRlcjtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWlkXCJ9LFwiZlwiOltcIkJvb2tpbmcgSUQ6IFwiLHtcInRcIjoyLFwiclwiOlwiYm9va2luZy5haXJjYXJ0X2lkXCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1lc3NhZ2VcIn0sXCJmXCI6W1wiV2UgaGF2ZSByZWNlaXZlZCB5b3VyIFBheW1lbnQgYW5kIHlvdXIgQm9va2luZyBpcyBpbiBwcm9jZXNzLCBvdXIgY3VzdG9tZXIgc3VwcG9ydCB0ZWFtIHdpbGwgY29udGFjdCB5b3Ugc2hvcnRseS4gT3IgQ2FsbCBvdXIgY3VzdG9tZXIgc3VwcG9ydCB0ZWFtIGZvciBtb3JlIGRldGFpbC5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOltcIi9iMmMvYWlyQ2FydC9teWJvb2tpbmdzL1wiLHtcInRcIjoyLFwiclwiOlwiYm9va2luZy5haXJjYXJ0X2lkXCJ9XX0sXCJmXCI6W1wiVmlldyB5b3VyIHRpY2tldFwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nXCIsXCJib29raW5nLmFpcmNhcnRfc3RhdHVzXCJdLFwic1wiOlwiXzAuaXNOZXcoXzEpXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1lc3NhZ2VcIn0sXCJmXCI6W1wiWW91ciBCb29raW5nIGlzIFN1Y2Nlc3NmdWwhXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmdcIixcImJvb2tpbmcuYWlyY2FydF9zdGF0dXNcIl0sXCJzXCI6XCJfMC5pc0Jvb2tlZChfMSlcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtZXNzYWdlXCJ9LFwiZlwiOltcIllvdXIgQm9va2luZyBpcyBpbiBwcm9jZXNzIVwiXX1dLFwieFwiOntcInJcIjpbXCJib29raW5nXCIsXCJib29raW5nLmFpcmNhcnRfc3RhdHVzXCJdLFwic1wiOlwiXzAuaXNCb29rZWQoXzEpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvbXlib29raW5ncy9cIix7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcuYWlyY2FydF9pZFwifV19LFwiZlwiOltcIlZpZXcgeW91ciB0aWNrZXRcIl19XSxcInhcIjp7XCJyXCI6W1wiYm9va2luZ1wiLFwiYm9va2luZy5haXJjYXJ0X3N0YXR1c1wiXSxcInNcIjpcIl8wLmlzTmV3KF8xKVwifX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5jb21wbGV0ZWRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGFjdGl2ZSBpbnZlcnRlZCBkaW1tZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRleHQgbG9hZGVyXCJ9LFwiZlwiOltcIllvdXIgYm9va2luZyBpcyBpbiBwcm9ncmVzcy5cIl19XX1dLFwiclwiOlwic3RlcC5jb21wbGV0ZWRcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuc3RlcHMuNFwiXSxcInNcIjpcIntzdGVwOl8wfVwifX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwNC5odG1sXG4gKiogbW9kdWxlIGlkID0gOTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGVzcy93ZWIvbW9kdWxlcy9ib29raW5nLmxlc3NcbiAqKiBtb2R1bGUgaWQgPSA5OVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9