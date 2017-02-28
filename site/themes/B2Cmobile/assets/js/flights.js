webpackJsonp([3],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(210);


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

/***/ },
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
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
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(32),
	    page = __webpack_require__(31)
	    ;
	
	var Meta = __webpack_require__(66),
	    SearchForm = __webpack_require__(211),
	    SearchResults =  __webpack_require__(219),
	    Booking =  __webpack_require__(243)
	    ;
	
	__webpack_require__(245);
	__webpack_require__(99);
	
	function parseQuery(qstr) {
	    var query = {};
	    var a = qstr.split('&');
	    for (var i = 0; i < a.length; i++) {
	        var b = a[i].split('=');
	        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
	    }
	    return query;
	}
	
	var actions = {
	    form: function(ctx, next) {
	        (new SearchForm()).render('#app').then(function() { next(); });
	    },
	    search: function(ctx, next) {
	        var query = parseQuery(ctx.querystring);
	
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
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    moment = __webpack_require__(43)
	    ;
	
	var Page = __webpack_require__(212),
	    Search = __webpack_require__(54),
	    Meta = __webpack_require__(66)
	    ;
	
	module.exports = Page.extend({
	    template: __webpack_require__(213),
	
	    components: {
	        'search-form': __webpack_require__(214)
	    },
	
	    data: function() {
	        var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];
	
	        return {
	            search: new Search(),
	            meta: Meta.object,
	            moment: moment,
	            recent: _.map(recent, function(i) { return moment(i.search.flights[0].depart_at) ? i : null; })
	        }
	    }
	});

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(34),
	    Auth = __webpack_require__(73),
	    _ = __webpack_require__(29),
	    moment = __webpack_require__(43)
	    ;
	
	module.exports = Component.extend({
	    isolated: true,
	
	    partials: {
	        'base-panel': __webpack_require__(98)
	    },
	
	    components: {
	        layout: __webpack_require__(70)
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
/* 213 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","f":[{"t":7,"e":"table","a":{"style":"width: 100%"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"padding-right: 10px;"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed segment"},"f":[{"t":7,"e":"search-form","a":{"class":"basic segment","search":[{"t":2,"r":"search"}]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"style":"width: 400px; padding-left: 10px; vertical-align: top;"},"f":[{"t":7,"e":"div","a":{"class":"ui header","style":"  font-size: 16px; font-weight: normal; color: #202629; margin-bottom: 10px;"},"f":["Recent Searches"]}," ",{"t":7,"e":"div","a":{"class":"ui segment recent-searches"},"f":[{"t":7,"e":"div","a":{"class":"box"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"date"},"f":[{"t":2,"x":{"r":["moment","./search.flights.0.depart_at"],"s":"_0(_1).format(\"MMM\")"}},{"t":7,"e":"span","f":[{"t":2,"x":{"r":["moment","./search.flights.0.depart_at"],"s":"_0(_1).format(\"DD\")"}}]}]}," ",{"t":7,"e":"div","a":{"class":"direction","style":"cursor: pointer;"},"v":{"click":{"m":"swapSearch","a":{"r":["search"],"s":"[_0]"}}},"f":[{"t":2,"r":"from.city"}," ",{"t":7,"e":"span","a":{"class":[{"t":4,"f":["back"],"n":50,"x":{"r":["./search.tripType"],"s":"2==_0"}},{"t":4,"n":51,"f":["to"],"x":{"r":["./search.tripType"],"s":"2==_0"}}]},"f":[" "]}," ",{"t":2,"r":"to.city"}," ",{"t":4,"f":["(multicity)"],"n":50,"x":{"r":["./search.tripType"],"s":"3==_0"}}]}," ",{"t":7,"e":"div","a":{"class":"info"},"f":[{"t":4,"f":[{"t":2,"r":"./search.passengers.0"}," Adult"],"n":50,"x":{"r":["./search.passengers.0"],"s":"_0>0"}},{"t":4,"f":[", ",{"t":2,"r":"./search.passengers.1"}," Child"],"n":50,"x":{"r":["./search.passengers.1"],"s":"_0>0"}},{"t":4,"f":[", ",{"t":2,"r":"./search.passengers.2"}," Infant"],"n":50,"x":{"r":["./search.passengers.2"],"s":"_0>0"}}]}]}],"n":52,"r":"recent"}]}]}]}],"n":50,"r":"recent"}]}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var page = __webpack_require__(31),
	    moment = __webpack_require__(43)
	    ;
	
	var Form = __webpack_require__(33),
	    Meta = __webpack_require__(66)
	    ;
	
	var ROUTES = __webpack_require__(55).flights;
	
	module.exports = Form.extend({
	    template: __webpack_require__(215),
	
	    components: {
	        'ui-spinner': __webpack_require__(216),
	        'ui-airport': __webpack_require__(218),
	        'ui-calendar': __webpack_require__(42)
	    },
	
	    data: function() {
	        return {
	            meta: Meta.object,
	            moment: moment
	        }
	    },
	
	    onconfig: function() {
	        this.on('next', function(view) {
	            //TODO: think of better way to handle this
	            $(this.find('form')).click();
	
	            if (this.get('modify') && !this.get('search.domestic')) {
	                return;
	            }
	
	            if (view.get('next')) {
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
	        //for no. of traveller
	        $('.traveller').on('click',function(){
	            $('.travellersInfo').fadeIn(400);
	            });
	        $('.closebtn').on('click',function(){
	            $('.travellersInfo').fadeOut(400);
	        });
	        
	        //for traveller class
	        $('.travelClass').on('click',function(){
	            $('.ClassInfo').fadeIn(400);
	            });
	        $('.ClassInfo a').on('click',function(){
	            $('.ClassInfo').fadeOut(400);
	            });
	        $('.closeclass').on('click',function(){
	            $('.ClassInfo').fadeOut(400);
	        });
	        
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
/* 215 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui modify-search small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Modify Search"]}," ",{"t":7,"e":"div","a":{"class":"content","style":"padding: 0px;"},"f":[{"t":4,"f":[{"t":8,"r":"form"}],"n":50,"r":"open"}]}]}],"n":50,"r":"modify"},{"t":4,"n":51,"f":[{"t":8,"r":"form"}],"r":"modify"}," "],"p":{"form":[{"t":7,"e":"form","a":{"id":"flights-search","class":["ui form ",{"t":2,"r":"class"}," ",{"t":4,"f":["loading"],"n":50,"r":"search.pending"}," ",{"t":4,"f":["error"],"n":50,"r":"errors"}],"action":"javascript:;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"h1","f":["Search, Book & Fly!"]}," ",{"t":7,"e":"p","f":["Lowest Prices and 100% secure!"]}," ",{"t":7,"e":"div","a":{"class":"ui top attached tabular menu"},"f":[{"t":7,"e":"a","a":{"class":[{"t":4,"f":["active"],"n":50,"r":"search.domestic"}," item uppercase"],"data-tab":"domestic"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.domestic\",1]"}}},"f":["Domestic"]}," ",{"t":7,"e":"a","a":{"class":[{"t":4,"f":["active"],"n":50,"x":{"r":["search.domestic"],"s":"!_0"}}," item uppercase"],"data-tab":"international"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.domestic\",0]"}}},"f":["International"]}]}," ",{"t":7,"e":"div","a":{"class":"ui bottom attached active tab segment basic"},"f":[{"t":8,"r":"checkboxes"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"multicity"},"t1":"fade","f":[{"t":8,"r":"multicity"}," ",{"t":7,"e":"div","a":{"class":"add-flight"},"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui basic button circular"},"v":{"click":{"m":"addFlight","a":{"r":[],"s":"[]"}}},"f":["+ Add new"]}]}]}," ",{"t":7,"e":"br"}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"simple"},"t1":"fade","f":[{"t":8,"r":"itinerary"}," ",{"t":8,"r":"dates"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"r":"errors.flight.0"}]}],"n":50,"r":"errors.flight.0"}]}],"x":{"r":["search.tripType"],"s":"3==_0"}}," ",{"t":8,"r":"passengers"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[],"n":50,"x":{"r":["i"],"s":"\"flight\"==_0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"x":{"r":["i"],"s":"\"flight\"==_0"}}],"n":52,"i":"i","r":"errors"}]}],"n":50,"r":"errors"}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui button massive fluid uppercase"},"f":["Search Flights"]}]}]}],"dates":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.depart_at"}],"class":"fluid depart-0 pointing top left","large":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"max":[{"t":2,"x":{"r":["search.tripType","search.flights.0.return_at"],"s":"2==_0&&_1"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}],"error":[{"t":2,"r":"errors.flight.0.depart_at"}],"next":"return-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"v":{"click":{"m":"toggleRoundtrip","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.return_at"}],"class":["fluid return-0 pointing top right ",{"t":4,"f":["disabled"],"n":51,"x":{"r":["search.tripType"],"s":"2==_0"}}],"large":"1","placeholder":"RETURN ON","min":[{"t":2,"x":{"r":["search.flights.0.depart_at","moment"],"s":"_0||_1()"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}],"error":[{"t":2,"r":"errors.flight.0.return_at"}]},"f":[]}]}]}],"passengers":[{"t":7,"e":"div","a":{"class":"four fields passengers"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.0"}],"class":"fluid","large":"1","placeholder":"Adults","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.1"}],"class":"fluid","large":"1","placeholder":"Children","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["2-12 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.2"}],"class":"fluid","large":"1","placeholder":"Infants","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["Below 2 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"search.cabinType"}],"class":"fluid","large":"1","placeholder":"Class","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.cabinTypes()"}}],"error":[{"t":2,"r":"errors.cabinType"}]},"f":[]}]}]}],"itinerary":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid from-0","placeholder":"FROM","search":"1","large":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.from"}],"next":"to-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid to-0","placeholder":"TO","search":"1","large":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.to"}],"next":"depart-0"},"v":{"next":"next"},"f":[]}]}]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid from-0","placeholder":"FROM","search":"1","large":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.from"}],"next":"to-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid to-0","placeholder":"TO","search":"1","large":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.to"}],"next":"depart-0"},"v":{"next":"next"},"f":[]}]}]}],"r":"search.domestic"}],"multicity":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"three fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"./from"}],"class":["fluid from-",{"t":2,"r":"i","s":true}],"search":"1","large":"1","placeholder":"FROM","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.domestic()"},"s":true}],"error":[{"t":2,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"},"from"]}}],"next":["to-",{"t":2,"r":"i","s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"./to"}],"class":["fluid to-",{"t":2,"r":"i","s":true}],"search":"1","large":"1","placeholder":"TO","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.domestic()"},"s":true}],"error":[{"t":2,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"},"to"]}}],"next":["depart-",{"t":2,"r":"i","s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"rx":{"r":"search.flights","m":[{"t":30,"n":"i"},"depart_at"]}}],"class":["fluid depart-",{"t":2,"r":"i"}," pointing top right"],"large":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"calendar":[{"t":2,"x":{"r":[],"s":"{twomonth:true}"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"error":[{"t":2,"rx":{"r":"errors.flights","m":[{"t":30,"n":"i"},"depart_at"]}}],"next":["depart-",{"t":2,"x":{"r":["i"],"s":"_0+1"},"s":true}]},"v":{"next":"next"},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"delete"},"v":{"click":{"m":"removeFlight","a":{"r":["i"],"s":"[_0]"}}},"f":[" "]}],"n":50,"x":{"r":["i"],"s":"_0>1"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}}]}],"n":50,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}}],"n":52,"i":"i","r":"search.flights"}],"checkboxes":[{"t":7,"e":"div","a":{"class":"three fields travel-type"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"1==_0"}}]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",1]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"1==_0"}}]}}," ",{"t":7,"e":"label","f":["ONE WAY"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}}]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",2]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"2==_0"}}]}}," ",{"t":7,"e":"label","f":["ROUND TRIP"]}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field"},"t1":"fade","f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}}]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",3]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"3==_0"}}]}}," ",{"t":7,"e":"label","f":["MULTI CITY"]}]}]}]}],"n":50,"r":"search.domestic"}]}]}};

/***/ },
/* 216 */
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
	    IN = 'in'
	    ;
	
	module.exports = Component.extend({
	    isolated: true,
	    template: __webpack_require__(217),
	
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
/* 217 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui selection input spinner dropdown in ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":7,"e":"input","a":{"type":"hidden","value":[{"t":2,"r":"value"}]}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"div","a":{"class":"text"},"f":[{"t":2,"r":"value"}]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button inc"},"v":{"click":{"m":"inc","a":{"r":[],"s":"[]"}}},"f":["+"]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button dec"},"v":{"click":{"m":"dec","a":{"r":[],"s":"[]"}}},"f":["-"]}]}]};

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    $ = __webpack_require__(32)
	    ;
	
	var Select = __webpack_require__(38)
	    ;
	
	module.exports = Select.extend({
	    onconfig: function() {
	        var view = this;
	        var ajax, timeout;
	
	        if (this.get('domestic')) {
	            this.set('options', this.get('meta.select.domestic')());
	        } else {
	            if (this.get('value')) {
	                $.ajax({
	                    type: 'GET',
	                    url: '/b2c/flights/airport/' + this.get('value'),
	                    dataType: 'json',
	                    success: function(data) {
	                        view.set('options', [data]).then(function () {
	                            $(view.find('.ui.selection')).dropdown('set value', data.id);
	                            $(view.find('.ui.selection')).dropdown('set text', data.text);
	                        });
	
	
	                    }
	                })
	            }
	
	            var ajax = null;
	            this.observe('value', function(value) {
	                if (ajax) { ajax.abort(); }
	
	                ajax = $.ajax({
	                    type: 'GET',
	                    url: '/b2c/flights/airport/' + this.get('value'),
	                    dataType: 'json',
	                    success: function(data) {
	                        view.set('options', [data]).then(function () {
	                            $(view.find('.ui.selection')).dropdown('set value', data.id);
	                            $(view.find('.ui.selection')).dropdown('set text', data.text);
	                        });
	
	
	                    }
	                });
	            });
	
	            this.observe('searchfor', function(value) {
	                if (value && value.length > 2) {
	                    if (timeout) {
	                        clearTimeout(timeout);
	                    }
	
	                    timeout = setTimeout(function() {
	                        if (ajax) {
	                            ajax.abort();
	                        }
	
	                        ajax = $.ajax({
	                            type: 'GET',
	                            url: '/b2c/booking/searchAirport',
	                            data: { term: value },
	                            dataType: 'json',
	                            success: function(data) {
	                                view.set('options', _.map(data, function(i) { return { id: i.id, text: i.label }; }))
	                                    .then(function() {
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
	            }, { init: false });
	        }
	
	
	    }
	});

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var page = __webpack_require__(31);
	
	var Page = __webpack_require__(212),
	    Search = __webpack_require__(54),
	    Flight = __webpack_require__(52),
	    Filter = __webpack_require__(220),
	    Meta = __webpack_require__(66)
	    ;
	
	var ROUTES = __webpack_require__(55).flights;
	
	module.exports = Page.extend({
	    template: __webpack_require__(221),
	
	    components: {
	        'results': __webpack_require__(222),
	
	        'modify-single': __webpack_require__(237),
	        'modify-multicity': __webpack_require__(239),
	
	        'filter': __webpack_require__(241),
	        'search-form': __webpack_require__(214)
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
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29);
	
	var Store = __webpack_require__(53),
	    Search = __webpack_require__(54)
	    ;
	
	var t2m = function(time) {
	    var i = time.split(':');
	    return _.parseInt(i[0])*60 + _.parseInt(i[1]);
	};
	
	var filter = function(flights, filtered, backward) {
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
	
	    return _.filter(flights.slice(), function(i) {
	        var ok = true,
	            s = i.get('segments.0');
	
	        if (f.prices && !_.inRange(i.get('price'), f.prices[0]-0.001, f.prices[1]+0.001)) {
	            return false;
	        }
	
	        if (f.carriers && -1 == _.indexOf(f.carriers, s[0].carrier.code)) {
	            return false;
	        }
	
	        if (f.stops) {
	            for (var j = 0, l = i.get('segments').length; j < l; j++) {
	                if (-1 == _.indexOf(f.stops, i.get('segments.' + j).length-1)) {
	                    return false;
	                }
	            }
	        }
	
	        if (departure && !_.inRange(t2m(s[0].depart.format('HH:mm')), departure[0]-0.001, departure[1]+0.001)) {
	            return false;
	        }
	
	        if (arrive && !_.inRange(t2m(s[s.length-1].arrive.format('HH:mm')), arrive[0]-0.001, arrive[1]+0.001)) {
	            return false;
	        }
	
	        if (layover) {
	            ok = true;
	            _.each(i.get('segments'), function(segments) {
	                _.each(segments, function(segment) {
	                    if (
	                        segment.layover &&
	                        !_.inRange(segment.layover.asMinutes(), layover[0]-0.001, layover[1]+0.001)
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
	
	    onconfig: function() {
	        //this.observe('filtered', function(filtered) { this.filter(); }, {init: false});
	    },
	
	    filter: function() {
	        //console.log('filtering nax');
	
	        if (this.timeout) {
	            clearTimeout(this.timeout);
	        }
	
	        setTimeout(function() { this.doFilter(); }.bind(this), Filter.TIMEOUT)
	    },
	
	    doFilter: function() {
	        var filtered = this.get('filtered');
	
	        if (Search.ROUNDTRIP == this.get('tripType') && this.get('domestic')) {
	            this.set('flights', [filter(this.get('original.0'), filtered), filter(this.get('original.1'), filtered, true)])
	        } else {
	            this.set('flights', _.map(this.get('original'), function(flights) { return filter(flights, filtered); }));
	        }
	
	
	    }
	});
	
	Filter.TIMEOUT = 300;
	
	Filter.factory = function(search, results) {
	    var filter = new Filter(),
	        prices = [],
	        carriers = [],
	        stops = 0;
	
	    _.each(results, function(flights) {
	        _.each(flights, function(flight) {
	            prices[prices.length] = flight.get('price');
	            carriers[carriers.length] = flight.get('segments.0.0.carrier');
	
	            _.each(flight.get('segments'), function(segments) {
	                stops = Math.max(stops, segments.length - 1);
	            });
	
	
	        });
	    });
	
	    carriers = _.unique(carriers, 'code');
	
	    filter.set({
	        domestic: search.get('domestic'),
	        tripType: search.get('tripType'),
	        stops: _.range(0, stops+1),
	        prices: [Math.min.apply(null, prices), Math.max.apply(null, prices)],
	        carriers: carriers,
	        filtered: { carriers: _.map(carriers, function(i) { return i.code; }), stops: _.range(0, stops+1) },
	        flights: results,
	        original: results
	    });
	
	    return filter;
	};
	
	module.exports = Filter;

/***/ },
/* 221 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","f":[{"t":4,"f":[{"t":7,"e":"search-form","a":{"class":"basic segment","search":[{"t":2,"r":"modify"}],"modify":[{"t":2,"r":"modify"}]}}],"n":50,"r":"modify"}," ",{"t":7,"e":"div","a":{"class":"ui segment flights-results"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"loading","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"ui indicating progress active"},"f":[{"t":7,"e":"div","a":{"class":"bar","style":["background-color: #fee252; -webkit-transition-duration: 300ms; transition-duration: 300ms; width: ",{"t":2,"r":"pending"},"%;"]}}," ",{"t":7,"e":"div","a":{"class":"label"},"f":["Searching for flights"]}]}]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}],"n":50,"r":"pending"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"modify-multicity","a":{"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"modify-single","a":{"modify":[{"t":2,"r":"search"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["search.tripType"],"s":"3==_0"}}],"r":"pending"}," ",{"t":4,"f":[{"t":7,"e":"results","a":{"pending":[{"t":2,"r":"pending"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"prices":[{"t":2,"r":"prices"}],"filter":[{"t":2,"r":"filter"}]}}],"n":50,"r":"flights"}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}," ",{"t":7,"e":"filter","a":{"search":[{"t":2,"r":"search"}],"filter":[{"t":2,"r":"filter"}],"pending":[{"t":2,"r":"pending"}]}}]}}]};

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	    _ = __webpack_require__(29),
	    moment = __webpack_require__(43)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(223),
	
	    components: {
	        'results-oneway': __webpack_require__(224),
	        'results-roundtrip': __webpack_require__(231),
	        'results-multicity': __webpack_require__(233)
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
/* 223 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"results-oneway","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"1==_0"}},{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"results-roundtrip","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"prices":[{"t":2,"r":"prices"}],"filter":[{"t":2,"r":"filter"}]}}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"results-oneway","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"r":"search.domestic"}],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}},{"t":4,"f":[{"t":7,"e":"results-multicity","a":{"pending":[{"t":2,"r":"pending"}],"meta":[{"t":2,"r":"meta"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}}]};

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	    _ = __webpack_require__(29),
	    moment = __webpack_require__(43),
	    page = __webpack_require__(31)
	    ;
	
	var Booking = __webpack_require__(50),
	    Meta = __webpack_require__(66)
	    ;
	
	var ROUTES = __webpack_require__(55).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(225),
	
	    components: {
	        flights: __webpack_require__(226)
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
/* 225 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.0"}],"search":[{"t":2,"r":"search"}],"pending":[{"t":2,"r":"pending"}]}}]};

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    moment = __webpack_require__(43),
	    page = __webpack_require__(31)
	    ;
	
	var Form = __webpack_require__(33),
	    Meta = __webpack_require__(66),
	    ROUTES = __webpack_require__(55)
	    ;
	
	var t2m = function(time) {
	    var i = time.split(':');
	
	    return _.parseInt(i[0])*60 + _.parseInt(i[1]);
	};
	
	var sort = function(flights, sortOn) {
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
	
	var group = function(flights, sorton) {
	    if (false) {
	        return flights;
	    }
	
	    return _.values(_.groupBy(flights, function(i) { return 'nax_' + i.get(sorton[0])  + '_' + i.get('price'); }));
	};
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(227),
	    page: 1,
	    loading: false,
	
	    components: {
	        flight: __webpack_require__(228)
	    },
	
	    data: function() {
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
	
	    onconfig: function() {
	        var view = this;
	
	        this.observe('sortOn', function(sortOn) { view.sortFlights(); }, {init: false});
	        this.observe('flights', function(sortOn) { view.sortFlights(); }, {init: false});
	         this.sortFlights();
	    },
	
	    oncomplete: function() {
	        this.parent.on('nextpage', function() { this.nextpage(); });
	    },
	
	    nextpage: function() {
	        var view = this;
	
	        if( ! view.loading ){
	            view.loading = true;
	
	            var add = view.get('sorted').slice(view.page*10, (view.page+1)*10);
	            if (add && add.length) {
	                add.unshift('rendered');
	
	                view.push.apply(view, add).then(function() {
	                    view.page++;
	                    view.loading = false;
	                });
	
	            } else {
	                view.loading = false;
	            }
	        }
	    },
	
	    sortOn: function(on) {
	        if (on == this.get('sortOn.0')) {
	            this.set('sortOn.1', -1*this.get('sortOn.1'));
	        } else {
	            this.set('sortOn', [on, 1]);
	        }
	    },
	
	    sortFlights: function() {
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
	
	    },
	
	
	
	
	    back: function() {
	        page()
	    }
	
	});

/***/ },
/* 227 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"table","a":{"class":["ui segment basic flights ",{"t":2,"r":"class"}," ",{"t":4,"f":["summary"],"n":50,"r":"summary"}," ",{"t":4,"f":["small"],"n":50,"r":"small"}],"style":"width: 100%;"},"f":[{"t":4,"f":[{"t":7,"e":"caption","f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"pull left"},"f":[{"t":2,"r":"itinerary"}]}," ",{"t":7,"e":"div","a":{"class":"pull right"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"ddd D, MMM\")"}}]}],"r":"flights.0"}]}],"n":50,"r":"caption","s":true}," ",{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"airline"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"airline\"]"}}},"f":["Airline ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"airline\"==_0"}}]}," ",{"t":7,"e":"td","a":{"class":"depart"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"depart\"]"}}},"f":["Depart ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"depart\"==_0"}}]}," ",{"t":7,"e":"td","a":{"class":"arrow"}}," ",{"t":7,"e":"td","a":{"class":"arrive"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"arrive\"]"}}},"f":["Arrive ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"arrive\"==_0"}}]}," ",{"t":7,"e":"td","a":{"class":"price"},"v":{"click":{"m":"sortOn","a":{"r":[],"s":"[\"price\"]"}}},"f":["Price ",{"t":4,"f":[{"t":7,"e":"i","a":{"class":["caret ",{"t":4,"f":["down"],"n":50,"x":{"r":["sortOn.1"],"s":"1==_0"}},{"t":4,"n":51,"f":["up"],"x":{"r":["sortOn.1"],"s":"1==_0"}}," icon"]}}],"n":50,"x":{"r":["sortOn.0"],"s":"\"price\"==_0"}}]}]}]}," ",{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5","style":"text-align: center;"},"f":["Sorry! We could not find any flight for this search. Please search Again.",{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"a","v":{"click":{"m":"back","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button middle gray back"},"f":["Back"]}]}]}],"n":51,"x":{"r":["pending","flights.length"],"s":"_0||_1"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":8,"r":"flight"}],"n":52,"r":"."}],"n":50,"rx":{"r":"open","m":[{"t":30,"n":"i"}]}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":8,"r":"flight"}],"r":"./0"}],"rx":{"r":"open","m":[{"t":30,"n":"i"}]}}," ",{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"buddies"},"f":[{"t":7,"e":"td","a":{"colspan":"5","style":"text-align: center; padding: 4px; border: none;"},"f":[{"t":7,"e":"a","a":{"class":"ui basic tiny circular button","href":"javascript:;"},"v":{"click":{"m":"toggle","a":{"r":["i"],"s":"[\"open.\"+_0,1]"}}},"f":[{"t":4,"f":["–"],"n":50,"rx":{"r":"open","m":[{"t":30,"n":"i"}]}},{"t":4,"n":51,"f":["+"],"rx":{"r":"open","m":[{"t":30,"n":"i"}]}}," ",{"t":2,"x":{"r":["./length"],"s":"_0-1"}}," more options at same price"]}]}]}," ",{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[]}]}],"n":50,"x":{"r":["./length"],"s":"_0>1"}}],"n":50,"r":"./length"},{"t":4,"n":51,"f":[{"t":8,"r":"flight"}],"r":"./length"}],"n":52,"i":"i","r":"rendered"}]}," "],"p":{"flight":[{"t":7,"e":"flight","a":{"selectFn":[{"t":2,"r":"selectFn"}],"small":[{"t":2,"r":"small"}],"summary":[{"t":2,"r":"summary"}],"flight":[{"t":2,"r":"."}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected"}],"onward":[{"t":2,"r":"onward"}],"backward":[{"t":2,"r":"backward"}]}}]}};

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    moment = __webpack_require__(43)
	    ;
	
	var Form = __webpack_require__(33),
	    Booking = __webpack_require__(50),
	    Meta = __webpack_require__(66)
	    ;
	
	
	var money = __webpack_require__(67),
	    duration = __webpack_require__(75)(),
	    discount = __webpack_require__(229).discount;
	
	
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
	    template: __webpack_require__(230),
	
	    components: {
	        flight: this,
	        itinerary: __webpack_require__(77)
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
	    },
	
	    toggleDetails: function() {
	        this.toggle('details');
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
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29)
	    ;
	
	var money = __webpack_require__(67);
	
	module.exports = {
	    duration: __webpack_require__(75)(),
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
	
	                return discount;
	            }
	        }
	
	
	
	    }
	};


/***/ },
/* 230 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"tbody","v":{"load":{"m":"sortOn","a":{"r":[],"s":"[\"flight.time\"]"}},"click":{"m":"click","a":{"r":[],"s":"[]"}}},"a":{"class":["flight ",{"t":4,"f":["has-grouping"],"n":50,"x":{"r":["hasGroupings"],"s":"_0()"},"s":true}," ",{"t":4,"f":["small"],"n":50,"r":"small","s":true}," ",{"t":4,"f":["summary clickable"],"n":50,"r":"summary","s":true}," ",{"t":4,"f":["details"],"n":50,"r":"details"}," ",{"t":4,"f":["selected"],"n":50,"x":{"r":["id","selected.id"],"s":"_0==_1"}}]},"f":[{"t":8,"r":"main"}," ",{"t":8,"r":"info"}," ",{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"details"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[{"t":7,"e":"itinerary","a":{"small":[{"t":2,"r":"small"}],"class":"compact dark","flight":[{"t":2,"r":"flight"}]}}]}]}],"n":50,"r":"details"}]}," ",{"t":7,"e":"tr","a":{"class":"spacer"},"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[]}]}],"r":"flight"}],"p":{"main":[{"t":7,"e":"tr","a":{"class":"main"},"f":[{"t":7,"e":"td","a":{"class":"airline"},"f":[{"t":7,"e":"div","a":{"class":"logos"},"f":[{"t":4,"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"r":"logo"}],"alt":[{"t":2,"r":"name"}],"title":[{"t":2,"r":"name"}]}}],"n":52,"r":"carriers"}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"multiple"},"f":["Multiple Carriers"]}],"n":50,"r":"carriers.1"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"r":"carriers.0.name"},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"flight-no"},"f":[{"t":4,"f":[{"t":4,"f":[", "],"n":50,"x":{"r":["i"],"s":"0!=_0"}},{"t":2,"r":".flight"}],"n":52,"i":"i","r":"segments.0"}]}]}],"r":"carriers.1"}],"n":51,"r":"summary","s":true}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"colspan":"3","style":"padding-top: 0; padding-bottom: 0;"},"f":[{"t":7,"e":"table","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"depart"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"HH:mm D MMM\")"}}," ",{"t":7,"e":"span","a":{"class":"airport","title":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.airport"}},", ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.city"}}]},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.airportCode"}}]}]}," ",{"t":7,"e":"td","a":{"class":"arrow"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"via"},"f":[{"t":4,"f":[{"t":4,"f":[","],"n":50,"x":{"r":["i"],"s":"0!==_0"}}," ",{"t":7,"e":"span","a":{"title":[{"t":2,"r":".airport"},", ",{"t":2,"r":".city"}]},"f":[{"t":2,"r":".airportCode"}]}],"n":52,"i":"i","r":"airports"}]}],"x":{"r":["via","."],"s":"{airports:_0(_1)}"}}],"n":51,"r":"summary","s":true}]}," ",{"t":7,"e":"td","a":{"class":"arrive"},"f":[{"t":2,"x":{"r":["last","."],"s":"_0(_1).arrive.format(\"HH:mm D MMM\")"}}," ",{"t":7,"e":"span","a":{"class":"airport","title":[{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.airport"}},", ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.city"}}]},"f":[{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.airportCode"}}]}]}]}],"n":52,"r":"flight.segments"}]}]}],"n":50,"x":{"r":["flight.segments.length"],"s":"_0>1"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","a":{"class":"depart"},"f":[{"t":7,"e":"div","a":{"class":"time"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).depart.format(\"HH:mm\")"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"airport","title":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).from.airport"}},", ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).from.city"}}]},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).from.airportCode"}}]}," ",{"t":7,"e":"div","a":{"class":"date"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).depart.format(\"D MMM\")"}}]}],"n":51,"r":"summary","s":true}]}," ",{"t":7,"e":"td","a":{"class":"arrow"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"via"},"f":[{"t":4,"f":[{"t":4,"f":[","],"n":50,"x":{"r":["i"],"s":"0!==_0"}}," ",{"t":7,"e":"span","a":{"title":[{"t":2,"r":".airport"},", ",{"t":2,"r":".city"}]},"f":[{"t":2,"r":".airportCode"}]}],"n":52,"i":"i","r":"airports"}]}],"x":{"r":["via","segments.0"],"s":"{airports:_0&&_0(_1)}"}}],"n":51,"r":"summary","s":true}]}," ",{"t":7,"e":"td","a":{"class":"arrive"},"f":[{"t":7,"e":"div","a":{"class":"time"},"f":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).arrive.format(\"HH:mm\")"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"airport","title":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).to.airport"}},", ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).to.city"}}]},"f":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).to.airportCode"}}]}," ",{"t":7,"e":"div","a":{"class":"date"},"f":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0&&_0(_1).arrive.format(\"D MMM\")"}}]}],"n":51,"r":"summary","s":true}]}],"x":{"r":["flight.segments.length"],"s":"_0>1"}}," ",{"t":7,"e":"td","a":{"class":"price"},"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"n":50,"x":{"r":["save"],"s":"_0>10"}}," ",{"t":3,"x":{"r":["$","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"r":"save"},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"r":"save"}],"x":{"r":["discount","onward","flight"],"s":"{save:_0([_1,_2])}"}}],"n":50,"r":"onward"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"n":50,"x":{"r":["save"],"s":"_0>10"}}," ",{"t":3,"x":{"r":["$","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"r":"save"},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"r":"save"}],"x":{"r":["discount","flight","backward"],"s":"{save:_0([_1,_2])}"}}],"n":50,"x":{"r":["backward","selected"],"s":"_0&&!_1"}},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"x":{"r":["backward","selected"],"s":"_0&&!_1"}}],"r":"onward"}]},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"button","a":{"class":"ui button large orange"},"v":{"click":{"m":"select","a":{"r":[],"s":"[]"}}},"f":["BOOK"]}],"n":50,"x":{"r":["search.tripType","search.domestic"],"s":"1==_0||!_1"}},{"t":4,"n":51,"f":[{"t":7,"e":"button","a":{"class":["ui button ",{"t":4,"f":["large"],"n":51,"r":"small","s":true}," blue"]},"v":{"click":{"m":"select","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":["DESELECT"],"n":50,"x":{"r":["id","selected.id"],"s":"_0==_1"}},{"t":4,"n":51,"f":["SELECT"],"x":{"r":["id","selected.id"],"s":"_0==_1"}}]}],"x":{"r":["search.tripType","search.domestic"],"s":"1==_0||!_1"}}],"n":51,"r":"summary","s":true}," ",{"t":7,"e":"div","a":{"class":"ui fare fluid popup","style":"text-align: left; max-width: 350px;"},"f":[{"t":4,"f":[{"t":2,"r":"paxTaxes.1.c"},"x adults: ",{"t":3,"x":{"r":["$","paxTaxes.1.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["$","paxTaxes.1.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["$","paxTaxes.1.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["$","paxTaxes.1.other","meta.display_currency"],"s":"_0(_1,_2)"}}," TOTAL:",{"t":3,"x":{"r":["$","paxTaxes.1.total","meta.display_currency"],"s":"_0(_1,_2)"}},{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.1"}," ",{"t":4,"f":[{"t":2,"r":"paxTaxes.2.c"},"x children: ",{"t":3,"x":{"r":["$","paxTaxes.2.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["$","paxTaxes.2.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["$","paxTaxes.2.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["$","paxTaxes.2.other","meta.display_currency"],"s":"_0(_1,_2)"}}," TOTAL:",{"t":3,"x":{"r":["$","paxTaxes.2.total","meta.display_currency"],"s":"_0(_1,_2)"}},{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.2"}," ",{"t":4,"f":[{"t":2,"r":"paxTaxes.3.c"},"x infants: ",{"t":3,"x":{"r":["$","paxTaxes.3.basic_fare","meta.display_currency"],"s":"_0(_1,_2)"}}," YQ:",{"t":3,"x":{"r":["$","paxTaxes.3.yq","meta.display_currency"],"s":"_0(_1,_2)"}}," JN:",{"t":3,"x":{"r":["$","paxTaxes.3.jn","meta.display_currency"],"s":"_0(_1,_2)"}}," OTHER:",{"t":3,"x":{"r":["$","paxTaxes.3.other","meta.display_currency"],"s":"_0(_1,_2)"}}," TOTAL:",{"t":3,"x":{"r":["$","paxTaxes.3.total","meta.display_currency"],"s":"_0(_1,_2)"}},{"t":7,"e":"br"}],"n":50,"r":"paxTaxes.3"}]}]}]}],"info":[{"t":7,"e":"tr","a":{"class":"info"},"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"colspan":"5"},"f":[{"t":2,"r":"carriers.0.name"},", ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0&&_0(_1).flight"}}," | ",{"t":2,"x":{"r":["duration.format","duration","flight.time"],"s":"_0&&_1.format(_2)"}}," | ",{"t":4,"f":["non-stop"],"n":50,"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}},{"t":4,"n":51,"f":[{"t":2,"x":{"r":["stops","flight.segments.0"],"s":"_0&&_0(_1)"}}," stop(s)"],"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}}," | ",{"t":2,"x":{"r":["flight.refundable"],"s":"[null,\"Non refundable\",\"Refundable\"][_0]"}}]}],"n":50,"r":"summary","s":true},{"t":4,"n":51,"f":[{"t":7,"e":"td","a":{"colspan":"4"},"f":[{"t":7,"e":"div","a":{"class":"ui divided relaxed horizontal list"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content time"},"f":[{"t":2,"x":{"r":["duration.format","duration","flight.time"],"s":"_0&&_1.format(_2)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"item stops"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":4,"f":["NON-STOP"],"n":50,"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}},{"t":4,"n":51,"f":[{"t":2,"x":{"r":["stops","flight.segments.0"],"s":"_0&&_0(_1)"}}," stop(s)"],"x":{"r":["stops","flight.segments.0"],"s":"_0&&0==_0(_1)"}}]}]}]}]}," ",{"t":7,"e":"td","a":{"style":"text-align: center; white-space: nowrap; font-size: 12px;"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"toggleDetails","a":{"r":[],"s":"[]"}}},"f":["Flight Details"]}]}],"r":"summary"}]}]}};

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    $ = __webpack_require__(32),
	    page = __webpack_require__(31)
	    ;
	
	var Form = __webpack_require__(33),
	    Booking = __webpack_require__(50),
	    Meta = __webpack_require__(66)
	    ;
	
	var ROUTES = __webpack_require__(55).flights;
	
	
	var money = __webpack_require__(67);
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(232),
	
	    components: {
	        flights: __webpack_require__(226),
	        flight: __webpack_require__(228)
	    },
	
	    data: function() {
	        return _.extend({
	            meta: Meta.object,
	
	            carrier: -1,
	            selected: [],
	            count: function(flights) {
	                return _.sum(_.map(flights, function(i) { return i.length; }));
	            },
	            carriers: function(carriers, prices) {
	                return _.map(_.cloneDeep(carriers), function(i) { i.price = prices[i.code] || null; return i; }).sort(function(a, b) {
	                    var ap = a.price || 999999999, bp = b.price || 999999999;
	
	                    if (ap == bp) return 0;
	                    return ap > bp ? 1 : -1;
	                })
	            },
	            onSelect: function(flight, view) {
	                view.set('selected', flight);
	
	                if (false) {
	                    this.book();
	                }
	            }.bind(this)
	        }, __webpack_require__(229));
	    },
	
	    onconfig: function() {
	        var carriers = [];
	
	        _.each(this.get('flights'), function(flights) {
	            _.each(flights, function(flight) {
	                carriers[carriers.length] = flight.get('segments.0.0.carrier');
	            });
	        });
	
	        this.set('allcarriers', _.unique(carriers, 'code'));
	    },
	
	    oncomplete: function() {
	        $(window).on('resize.roundtrip', function() {
	           var width = $('.flights-grid', this.el).width();
	
	            $('.flights-grid > tbody > tr > td', this.el).width(width/2);
	        }.bind(this));
	
	        $('.dropdown', this.el).dropdown();
	    },
	
	    book: function() {
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
	                    Booking.create([backward.groupings[groupings[0]].system], { cs: view.get('search.cs'),   url: view.get('search.url'),cur:view.get('meta.display_currency') })
	                        .then(function(booking) {
	                            page(ROUTES.booking(booking.get('id')));
	                        });
	
	                    return;
	                } else {
	                    var booking = onward.groupings[groupings[0]].system;
	
	                    booking.rcs.push(backward.groupings[groupings[0]].system.rcs[0]);
	
	                    Booking.create([booking], { cs: view.get('search.cs'),   url: view.get('search.url'),cur:view.get('meta.display_currency') })
	                        .then(function(booking) {
	                            page(ROUTES.booking(booking.get('id')));
	                        });
	                    return;
	                }
	
	            }
	        }
	
	        Booking.create(_.map(this.get('selected'), function(i) { return i.get('system'); }), { cs: view.get('search.cs'),   url: view.get('search.url'),cur:view.get('meta.display_currency') })
	            .then(function(booking) {
	                page(ROUTES.booking(booking.get('id')));
	            });
	    },
	
	    showCarrier: function(code) {
	        this.set('carrier', code);
	        this.get('filter').set('filtered.carriers', -1 == code ? false : [code]);
	
	    },
	
	    modifySearch: function() {
	        this.root.modifySearch();
	    }
	});

/***/ },
/* 232 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment equal height grid flights-selection"},"f":[{"t":7,"e":"div","a":{"class":"twelve wide column"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed horizontal list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item","style":"width: 200px;"},"f":[{"t":4,"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.logo"}}]}}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":2,"r":"itinerary"}]}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.name"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).flight"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"HH:mm\")"}}," - ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).arrive.format(\"HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}}," | ",{"t":4,"f":[{"t":2,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}}," stop(s)"],"n":50,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}},{"t":4,"n":51,"f":["non-stop"],"x":{"r":["stops","segments.0"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"D MMM, YYYY\")"}}]}]}],"n":50,"r":"segments"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"style":"text-align: center;"},"f":["NOT SELECTED"]}],"r":"segments"}]}],"n":52,"i":"i","r":"selected"}]}]}," ",{"t":7,"e":"div","a":{"class":"four wide column center aligned book"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"price"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["money","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}],"n":50,"x":{"r":["save"],"s":"_0>10"}}," ",{"t":3,"x":{"r":["money","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"x":{"r":["save"],"s":"_0>0"}},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["money","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"x":{"r":["save"],"s":"_0>0"}}],"x":{"r":["discount","price","selected"],"s":"{save:_0(_2),price:_1(_2)}"}}],"n":50,"r":"selected"}]}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui button large orange"},"m":[{"t":4,"f":["disabled"],"n":51,"x":{"r":["canbook","selected","flights"],"s":"_0(_1,_2)"}}],"v":{"click":{"m":"book","a":{"r":[],"s":"[]"}}},"f":["BOOK"]}],"n":50,"x":{"r":["canbook","selected","flights"],"s":"_0(_1,_2)"}}]}]}],"n":50,"r":"selected"},{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui divided relaxed horizontal list flights-tabs"},"f":[{"t":7,"e":"div","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["carrier"],"s":"_0==-1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"showCarrier","a":{"r":[],"s":"[-1]"}}},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/icons/aeroplan2.png","align":"absmiddle","width":"23","height":"23"}}," All Airlines"]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["carrier","code"],"s":"_0==_1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"showCarrier","a":{"r":["code"],"s":"[_0]"}}},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"logo"}],"class":"ui top aligned image"}}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","f":[{"t":2,"r":"name"}]}," ",{"t":4,"f":[{"t":3,"x":{"r":["money","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"n":50,"r":"price"},{"t":4,"n":51,"f":[" "],"r":"price"}]}]}],"n":52,"x":{"r":["carriers","allcarriers","prices"],"s":"_0(_1,_2)"}}]}," ",{"t":7,"e":"table","a":{"class":"flights-grid small"},"f":[{"t":7,"e":"tbody","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"width: 50%;"},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"onSelect"}],"small":"1","flights":[{"t":2,"r":"flights.0"}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected.0"}],"backward":[{"t":2,"r":"selected.1"}],"pending":[{"t":2,"r":"pending"}]}}]}," ",{"t":7,"e":"td","a":{"style":"width: 50%;"},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"onSelect"}],"small":"1","flights":[{"t":2,"r":"flights.1"}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected.1"}],"onward":[{"t":2,"r":"selected.0"}],"pending":[{"t":2,"r":"pending"}]}}]}]}]}]}],"n":50,"x":{"r":["count","flights"],"s":"_0(_1)>0"}}]};

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    moment = __webpack_require__(43),
	    accounting = __webpack_require__(68),
	    page = __webpack_require__(31)
	    ;
	
	var Form = __webpack_require__(33),
	    Booking = __webpack_require__(50),
	    Meta = __webpack_require__(66)
	    ;
	
	var ROUTES = __webpack_require__(55).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(234),
	
	    components: {
	        flights: __webpack_require__(226),
	        'multicity-summary': __webpack_require__(235)
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
	        }, __webpack_require__(229));
	    },
	
	    oncomplete: function() {
	        $('.dropdown', this.el).dropdown();
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
/* 234 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment equal height grid flights-selection"},"f":[{"t":7,"e":"div","a":{"class":"twelve wide column"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed horizontal list"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.logo"}}]}}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":2,"r":"itinerary"}]}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).carrier.name"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).flight"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"HH:mm\")"}}," - ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).arrive.format(\"HH:mm\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}}," | ",{"t":4,"f":[{"t":2,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}}," stop(s)"],"n":50,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}},{"t":4,"n":51,"f":["non-stop"],"x":{"r":["stops","segments.0"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"D MMM, YYYY\")"}}]}]}]}],"n":50,"r":"segments"}],"n":52,"i":"i","r":"selected"}]}]}," ",{"t":7,"e":"div","a":{"class":"four wide column center aligned book"},"f":[{"t":7,"e":"div","a":{"class":"price"},"f":[{"t":4,"f":[{"t":3,"x":{"r":["money","price","selected","meta.display_currency"],"s":"_0(_1(_2),_3)"}}],"n":50,"r":"selected"}]}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui button large orange"},"m":[{"t":4,"f":["disabled"],"n":51,"x":{"r":["canbook","selected","flights"],"s":"_0(_1,_2)"}}],"v":{"click":{"m":"book","a":{"r":[],"s":"[]"}}},"f":["BOOK"]}]}]}],"n":50,"r":"selected"},{"t":7,"e":"div","a":{"class":"ui divided relaxed horizontal list flights-tabs"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","t1":"fade","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active","i"],"s":"_0==_1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"set","a":{"r":["i"],"s":"[\"active\",_0]"}}},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":2,"r":"itinerary"}]}," ",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"ddd, D MMM\")"}}],"r":"./0"}]}]}],"n":50,"r":"./0"}],"n":52,"i":"i","r":"flights"}," ",{"t":4,"f":[{"t":7,"e":"div","t1":"fade","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"_0==-1"}}],"style":"cursor: pointer;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",-1]"}}},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["VIEW ALL"]}," FLIGHTS"]}]}],"n":51,"r":"pending"}]}," ",{"t":7,"e":"table","a":{"class":["flights-grid small ",{"t":4,"f":["summary"],"n":50,"x":{"r":["active"],"s":"-1==_0"}}]},"f":[{"t":7,"e":"tbody","f":[{"t":7,"e":"tr","f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"valign":"top","style":["width: ",{"t":2,"x":{"r":["percent","flights"],"s":"_0(_1)"}},"%;"]},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"onSelect"}],"summary":"1","class":"tiny","flights":[{"t":2,"r":"."}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"rx":{"r":"selected","m":[{"t":30,"n":"i"}]}}],"pending":[{"t":2,"r":"pending"}]}}]}],"n":50,"r":"./0"}],"n":50,"x":{"r":["active"],"s":"-1==_0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"td","a":{"valign":"top","style":"width: 100%;"},"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"."}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"rx":{"r":"selected","m":[{"t":30,"n":"i"}]}}],"pending":[{"t":2,"r":"pending"}]}}]}],"n":50,"x":{"r":["i","active"],"s":"_0==_1"}}],"x":{"r":["active"],"s":"-1==_0"}}],"n":52,"i":"i","r":"flights"}]}]}]}]};

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	    _ = __webpack_require__(29),
	    moment = __webpack_require__(43)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(236),
	
	    components: {
	        flights: __webpack_require__(226)
	    },
	
	    data: function() {
	        return {
	            percent: function(array) { return 100/array.length; }
	        };
	    }
	});

/***/ },
/* 236 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"table","a":{"style":"width: 100%"},"f":[{"t":7,"e":"tr","f":[{"t":4,"f":[{"t":7,"e":"td","a":{"valign":"top","style":["width: ",{"t":2,"x":{"r":["percent","results.flights"],"s":"_0(_1)"}},"%;"]},"f":[{"t":7,"e":"flights","a":{"caption":"1","selectFn":[{"t":2,"r":"selectFn"}],"summary":"1","class":"tiny","flights":[{"t":2,"r":"."}],"search":[{"t":2,"r":"results.search"}],"filtered":[{"t":2,"r":"results.filtered"}],"selected":[{"t":2,"rx":{"r":"selected","m":[{"t":30,"n":"i"}]}}]}}]}],"n":52,"i":"i","r":"results.flights"}]}]}]};

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(26),
	    _ = __webpack_require__(29),
	    moment = __webpack_require__(43),
	    page = __webpack_require__(31)
	    ;
	
	var Form = __webpack_require__(33),
	    Search = __webpack_require__(54)
	    ;
	
	var ROUTES = __webpack_require__(55).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(238),
	
	    components: {
	        'ui-spinner': __webpack_require__(216),
	        'ui-airport': __webpack_require__(218)
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
/* 238 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"form","a":{"class":["ui form segment ",{"t":4,"f":["loading"],"n":50,"r":"pending"}," modify-search single"],"action":"javascript:;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"table","a":{"class":"fluid","cellspacing":"5"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"min-width: 200px;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid transparent","placeholder":"FROM","search":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.from"}]},"f":[]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid transparent from","placeholder":"FROM","search":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.from"}]},"f":[]}],"r":"search.domestic"}]}," ",{"t":7,"e":"td","a":{"style":"min-width: 200px;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid transparent","placeholder":"TO","search":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.to"}]},"f":[]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid transparent","placeholder":"TO","search":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.to"}]},"f":[]}],"r":"search.domestic"}]}," ",{"t":7,"e":"td","a":{"style":"min-width: 110px;"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.depart_at"}],"class":"fluid pointing top left","simple":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"max":[{"t":2,"x":{"r":["search.tripType","search.flights.0.return_at"],"s":"2==_0&&_1"}}],"calendar":[{"t":2,"x":{"r":[],"s":"{twomonth:true}"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}]},"f":[]}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"style":"min-width: 110px;"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.return_at"}],"class":"fluid pointing top right","simple":"1","placeholder":"RETURN ON","min":[{"t":2,"x":{"r":["search.flights.0.depart_at","moment"],"s":"_0||_1()"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}]},"f":[]}]}],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui selection extended dropdown fluid active","tabindex":"0"},"f":[{"t":7,"e":"div","a":{"class":"text","style":"white-space: nowrap; text-overflow: ellipsis;"},"f":[{"t":4,"f":[{"t":2,"r":"search.passengers.0"}," Adult,"],"n":50,"x":{"r":["search.passengers.0"],"s":"_0>0"}}," ",{"t":4,"f":[{"t":2,"r":"search.passengers.1"}," Child,"],"n":50,"x":{"r":["search.passengers.1"],"s":"_0>0"}}," ",{"t":4,"f":[{"t":2,"r":"search.passengers.2"}," Infant,"],"n":50,"x":{"r":["search.passengers.2"],"s":"_0>0"}}," ",{"t":2,"rx":{"r":"meta.cabinTypes","m":[{"r":["search.cabinType"],"s":"_0-1"},"name"]}}]}," ",{"t":7,"e":"i","a":{"class":"dropdown icon"}}]}," ",{"t":7,"e":"div","a":{"class":"ui extended popup","style":"width: 150px;"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.0"}],"class":"fluid","large":"1","placeholder":"Adults","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.1"}],"class":"fluid","large":"1","placeholder":"Children","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["2-12 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.2"}],"class":"fluid","large":"1","placeholder":"Infants","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["Below 2 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"search.cabinType"}],"class":"fluid","large":"1","placeholder":"Class","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.cabinTypes()"}}],"error":[{"t":2,"r":"errors.cabinType"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"pull right"},"f":[{"t":7,"e":"a","a":{"class":"small","href":"javascript:;","onclick":"$('.extended.popup').popup('hide');"},"f":["Close"]}]}]}]}," ",{"t":7,"e":"td","a":{"style":"width: auto;"},"f":[{"t":7,"e":"button","a":{"type":"submit","class":"ui button large blue"},"f":["Search"]}]}]}]}]}]};

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	    _ = __webpack_require__(29),
	    moment = __webpack_require__(43)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(240),
	
	
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
/* 240 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui segment modify-search multicity"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed divided horizontal list"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["MULTICITY TRIP"]}," ",{"t":4,"f":[{"t":2,"x":{"r":["itinerary","./0"],"s":"_0(_1)"}},"  "],"n":52,"i":"i","r":"flights"}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["TIME"]}," ",{"t":2,"x":{"r":["times","search.flights"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content passengers"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["ADULT"]}," ",{"t":2,"r":"search.passengers.0"}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content passengers"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["CHILD"]}," ",{"t":2,"r":"search.passengers.1"}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"content passengers"},"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["INFANT"]}," ",{"t":2,"r":"search.passengers.2"}]}]}]}," ",{"t":7,"e":"div","a":{"style":"float: right"},"f":[{"t":7,"e":"button","a":{"class":"ui button large blue"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":["Modify Search"]}]}]}]};

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	    moment = __webpack_require__(43),
	    _ = __webpack_require__(29)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(242),
	
	    data: function() {
	        return {
	
	        };
	    },
	
	    onconfig: function() {
	            //this.observe('filtered', function(value) {
	            //    this.set('reset', true).then(function() { this.set('reset', false); }.bind(this));
	            //}, {init: false});
	    },
	
	    oncomplete: function() {
	        setTimeout(function() {
	            var view = this;
	
	            $(this.find('.ui.accordion')).accordion({exclusive: false});
	            $(this.find('.ui.checkbox')).checkbox();
	
	            var price = $(this.find('.price.slider')).ionRangeSlider({
	                type: "double",
	                grid: true,
	                onChange : function (data) { view.get('filter').set('filtered.prices', [data.from, data.to]); }
	            }).data('ionRangeSlider');
	
	            $(this.find('.departure.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) { return moment(num, "X").format("HH:mm"); },
	                onChange : function (data) { view.get('filter').set('filtered.departure', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]); }
	            }).data('ionRangeSlider');
	
	
	            $(this.find('.layover.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) { return moment(num, "X").format("HH:mm"); },
	                onChange : function (data) { view.get('filter').set('filtered.layover', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]); }
	            }).data('ionRangeSlider');
	
	            $(this.find('.arrive.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) { return moment(num, "X").format("HH:mm"); },
	                onChange : function (data) { view.get('filter').set('filtered.arrival', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]); }
	            }).data('ionRangeSlider');
	
	            $(this.find('.backward-arrive.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) { return moment(num, "X").format("HH:mm"); },
	                onChange : function (data) { view.get('filter').set('filtered.arrival2', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]); }
	            }).data('ionRangeSlider');
	
	            $(this.find('.backward-departure.slider')).ionRangeSlider({
	                type: "double",
	                min: +moment().startOf('day').format("X"),
	                max: +moment().endOf('day').format("X"),
	                prettify: function (num) { return moment(num, "X").format("HH:mm"); },
	                onChange : function (data) { view.get('filter').set('filtered.departure2', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]); }
	            }).data('ionRangeSlider');
	
	
	            this.observe('filter.prices', function(value) {
	                if (!value)
	                    return;
	
	                price.update({
	                    min: value[0],
	                    max: value[1],
	                    from: value[0],
	                    to: value[1]
	                })
	            }, {init: true});
	
	            this.observe('filter.filtered', function() {
	                if (this.get('filter')) {
	                    this.get('filter').filter();
	                }
	            }, {init: false});
	        }.bind(this), 500);
	
	
	    },
	
	    modifySearch: function() {
	        this.root.modifySearch();
	    },
	
	    carriers: function(e, show) {
	        e.original.stopPropagation();
	
	        this.set('filter.filtered.carriers', show ? _.pluck(this.get('filter.carriers'), 'code') : []);
	    }
	});

/***/ },
/* 242 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"results-filter","style":"width:229px"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui basic segment with-buttons"},"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui blue fluid button"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":["Modify Search",{"t":2,"r":"meta.display_currency"}]}]}," ",{"t":7,"e":"div","a":{"class":"ui styled fluid accordion"},"f":[{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Price"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"price slider"}}]}," ",{"t":7,"e":"p","f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"filter.filtered.refundable"}]}}," Show only refundable fares"]}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Stops"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":4,"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","name":[{"t":2,"r":"filter.filtered.stops"}],"value":[{"t":2,"r":"."}]}},"   ",{"t":4,"f":["Non-stop"],"n":50,"x":{"r":["."],"s":"0==_0"}},{"t":4,"n":51,"f":[{"t":2,"r":"."}," stop(s)"],"x":{"r":["."],"s":"0==_0"}}," "]},{"t":7,"e":"br"}],"n":52,"r":"filter.stops"}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Airlines ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"small pull right"},"f":[{"t":7,"e":"a","v":{"click":{"m":"carriers","a":{"r":["event"],"s":"[_0,true]"}}},"f":["All"]}," | ",{"t":7,"e":"a","v":{"click":{"m":"carriers","a":{"r":["event"],"s":"[_0,false]"}}},"f":["None"]}]}],"n":51,"x":{"r":["results.filter"],"s":"!_0"}}]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":4,"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","name":[{"t":2,"r":"filter.filtered.carriers"}],"value":[{"t":2,"r":"code"}]}},"   ",{"t":2,"r":"name"}," "]},{"t":7,"e":"br"}],"n":52,"r":"filter.carriers"}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Onward Departure Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"departure slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Onward Arrive Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"arrive slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Return Departure Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"backward-departure slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Return Arrive Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"backward-arrive slider"}}]}]}],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Departure Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"departure slider"}}]}]}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Arrive Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"arrive slider"}}]}]}],"x":{"r":["search.tripType"],"s":"2==_0"}}," ",{"t":7,"e":"div","a":{"class":["title ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"i","a":{"class":"dropdown icon"}}," Layover Time"]}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["disabled"],"n":50,"r":"pending"},{"t":4,"n":51,"f":["active"],"r":"pending"}]},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"hidden","class":"layover slider"}}]}]}]}]}]};

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Page = __webpack_require__(212),
	    Meta = __webpack_require__(66)
	    ;
	
	module.exports = Page.extend({
	    template: __webpack_require__(244),
	
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
/* 244 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"panel":"0"},"f":[{"t":7,"e":"booking","a":{"id":[{"t":2,"r":"id"}]}}]}]};

/***/ },
/* 245 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9pbmRleC5qcz81ZTJkIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9mbGlnaHQvYm9va2luZy5qcz9mZjQzIiwid2VicGFjazovLy8uL2pzL2NvcmUvdmlldy5qcz83YmFlIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9mbGlnaHQvaW5kZXguanM/MDE0YSIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvZmxpZ2h0L3NlYXJjaC5qcz9mOGUzIiwid2VicGFjazovLy8uL2pzL2FwcC9yb3V0ZXMuanM/YTE4NiIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlwcm9maWxlL21ldGEuanM/MmU3ZiIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlib29raW5ncy9tZXRhLmpzPzE0YzUqIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9tZXRhLmpzPzMzNDkiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215cHJvZmlsZS9teXByb2ZpbGUuanM/ZGM3YSIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanM/ZjZiNSIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qcz8wYmJhIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuanM/Y2Y0MCIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIuanM/ZTlmNCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9kaWFsb2cuanM/NjAyZCIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZy5odG1sP2E5NTkiLCJ3ZWJwYWNrOi8vLy4vanMvaGVscGVycy9tb25leS5qcz8yY2ViIiwid2VicGFjazovLy8uL3ZlbmRvci9hY2NvdW50aW5nLmpzL2FjY291bnRpbmcuanM/Mjc5YSIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2luZGV4Lmh0bWw/OTI1NSIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9zdGVwMS5qcz82YjQ4Iiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanM/YjY5MioiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2FwcC9hdXRoLmh0bWw/NGJjMyoiLCJ3ZWJwYWNrOi8vLy4vanMvaGVscGVycy9kdXJhdGlvbi5qcz81ZTA1Iiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuaHRtbD8xYTQ2Iiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9pdGluZXJhcnkuanM/MGQyOCIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9pdGluZXJhcnkuaHRtbD9jOGI2Iiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jb2RlLmpzPzU3OTkiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2VtYWlsLmpzPzQ5NDYiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL21haWxjaGVjay9zcmMvbWFpbGNoZWNrLmpzPzRkNmYiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuanM/ODBhNyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL3N0ZXAyLmh0bWw/ZjIxNiIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL3Bhc3Nlbmdlci5qcz8wZTZiIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9wYXNzZW5nZXIuaHRtbD8zNjk0Iiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9tb2JpbGVzZWxlY3QuanM/NzY1ZiIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL21vYmlsZXNlbGVjdC5odG1sPzkyN2EiLCJ3ZWJwYWNrOi8vLy4vanMvaGVscGVycy9kYXRlLmpzP2I0MmMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDMuanM/MzIxOSIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvanF1ZXJ5LnBheW1lbnQvbGliL2pxdWVyeS5wYXltZW50LmpzP2VhYmQiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5odG1sPzFjZTAiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2NjL251bWJlci5qcz9lMjYxIiwid2VicGFjazovLy8uL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vY2MuaHRtbD82ZWZhIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jYy9jdnYuanM/MWVlMSIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vY2MvY2FyZGV4cGlyeS5qcz9lNmJhIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXA0LmpzPzVmMTIiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwNC5odG1sPzk1NDMiLCJ3ZWJwYWNrOi8vLy4vbGVzcy93ZWIvbW9kdWxlcy9ib29raW5nLmxlc3M/N2E3YSIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL2ZsaWdodHMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvcGFnZXMvZmxpZ2h0cy9zZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9wYWdlLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9wYWdlcy9mbGlnaHRzL3NlYXJjaC5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvZm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvZm9ybS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9zcGlubmVyLmpzIiwid2VicGFjazovLy8uL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vc3Bpbm5lci5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9haXJwb3J0LmpzIiwid2VicGFjazovLy8uL2pzL3BhZ2VzL2ZsaWdodHMvcmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvZmxpZ2h0L2ZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvcGFnZXMvZmxpZ2h0cy9yZXN1bHRzLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL29uZXdheS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9vbmV3YXkuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0cy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHRzLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL2ZsaWdodC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9oZWxwZXJzL2ZsaWdodHMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL3JvdW5kdHJpcC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9yb3VuZHRyaXAuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvbXVsdGljaXR5LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkvc3VtbWFyeS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkvc3VtbWFyeS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L3NpbmdsZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L3NpbmdsZS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvZmlsdGVyLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9maWx0ZXIuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9wYWdlcy9mbGlnaHRzL2Jvb2tpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvYm9va2luZy5odG1sIiwid2VicGFjazovLy8uL2xlc3Mvd2ViL21vZHVsZXMvZmxpZ2h0cy5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsaUQ7QUFDQSxjQUFhO0FBQ2IsTUFBSztBQUNMO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxVQUFTOztBQUVULE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLOztBQUVMLHdCQUF1QixpQkFBaUIsRUFBRTtBQUMxQyxxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlGRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLDhDQUE2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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDhCQUE2QixPQUFPO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBc0MsV0FBVztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDaEMsTUFBSztBQUNMLHlCQUF3QixFQUFFO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1AsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBeUMsV0FBVztBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFFLEVBQUUsTUFBTSxxQkFBcUIsbUJBQW1CLDRDQUE0QyxFQUFFLDBDQUEwQyxFQUFFLE9BQU8sbUJBQW1CLHlCQUF5QixpQkFBaUIsTUFBTSxxQkFBcUIscUJBQXFCLDRDQUE0QyxFQUFFLDBDQUEwQyxFQUFFLE9BQU8sb0JBQW9CLHVCQUF1Qix5Q0FBeUMsRUFBRSxFQUFFLE9BQU8scUNBQXFDLE1BQU0scUJBQXFCLG1CQUFtQiw0Q0FBNEMsRUFBRSwwQ0FBMEMsRUFBRSxPQUFPLG1CQUFtQix5QkFBeUIsa0JBQWtCLE1BQU0scUJBQXFCLHFCQUFxQiw0Q0FBNEMsRUFBRSwwQ0FBMEMsRUFBRSxPQUFPLG9CQUFvQix1QkFBdUIsMENBQTBDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRzs7Ozs7O0FDQTd4TDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsRUFBQyxFOzs7Ozs7QUN0QkQsaUJBQWdCLFlBQVksd0JBQXdCLFlBQVksT0FBTyx5QkFBeUIsT0FBTyxlQUFlLEdBQUcsRUFBRSxHOzs7Ozs7QUNBM0gsMEMiLCJmaWxlIjoianMvZmxpZ2h0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UuanMnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEJvb2tpbmcgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L2Jvb2tpbmcnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2luZGV4Lmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgbGF5b3V0OiByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9sYXlvdXQnKSxcclxuICAgICAgICBzdGVwMTogcmVxdWlyZSgnLi9zdGVwMScpLFxyXG4gICAgICAgIHN0ZXAyOiByZXF1aXJlKCcuL3N0ZXAyJyksXHJcbiAgICAgICAgc3RlcDM6IHJlcXVpcmUoJy4vc3RlcDMnKSxcclxuICAgICAgICBzdGVwNDogcmVxdWlyZSgnLi9zdGVwNCcpXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnRpYWxzOiB7XHJcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3RcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgQm9va2luZy5mZXRjaCh0aGlzLmdldCgnaWQnKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGJvb2tpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0KCdib29raW5nJywgYm9va2luZyk7IFxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuICAgIG9uY29tcGxldGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcudWkuZHJvcGRvd24uY3VycmVuY3knKS5oaWRlKCk7XHJcbiAgICAgICB0aGlzLm9ic2VydmUoJ2Jvb2tpbmcuY3VycmVuY3knLCBmdW5jdGlvbihjdXIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGN1cj10aGlzLmdldCgnYm9va2luZy5jdXJyZW5jeScpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjdXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2Jvb2tpbmcuY3VycmVuY3knLGN1ciApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScsY3VyICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCdtZXRhJyk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmdldCgnbWV0YScpKTtcclxuICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgXHJcbiAgICB9LFxyXG4gICAgb250ZWFyZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnNob3dQYW5lbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oZm9yY2UpIHtcclxuICAgICAgICBmb3JjZSA9IGZvcmNlIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gJy9iMmMvZmxpZ2h0cycgKyB0aGlzLmdldCgnYm9va2luZy5zZWFyY2h1cmwnKSxcclxuICAgICAgICAgICAgY3MgPSB0aGlzLmdldCgnYm9va2luZy5jbGllbnRTb3VyY2VJZCcpLFxyXG4gICAgICAgICAgICBwYXJhbXMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGNzICYmIGNzID4gMSkge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaCgnY3M9JyArIGNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmb3JjZSkge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaCgnZm9yY2U9MScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdXJsICs9ICc/JyArIHBhcmFtcy5qb2luKCcmJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYWdlKHVybCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGJhY2syOiBmdW5jdGlvbigpIHsgdGhpcy5iYWNrKHRydWUpOyB9LFxyXG4gICAgc2V0Q3VycmVuY3lCb29raW5nOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGNvZGU9JCgnI2N1cnJlbmN5MScpLnZhbCgpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29kZSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Jvb2tpbmcuY3VycmVuY3knLCBjb2RlKTtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZ2V0KCdib29raW5nLmN1cnJlbmN5JykpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCdib29raW5nLmN1cnJlbmN5Jyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKVxyXG4gICAgO1xyXG5cclxudmFyIFZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcnKSxcclxuICAgIEZsaWdodCA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQnKSxcclxuICAgIERpYWxvZyA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZycpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG52YXIgbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5Jyk7XHJcblxyXG5cclxudmFyIHN0ZXAgPSB7XHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uICh2aWV3LCBpKSB7XHJcbiAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLicgKyBpICsgJy5zdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLicgKyBpICsgJy5lcnJvcnMnLCB7fSk7XHJcbiAgICB9LFxyXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uICh2aWV3LCBpKSB7XHJcbiAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLicgKyBpICsgJy5zdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgfSxcclxuICAgIGVycm9yOiBmdW5jdGlvbiAodmlldywgaSwgeGhyKSB7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoMyA9PSByZXNwb25zZS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3InLCByZXNwb25zZS5tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICg0ID09IHJlc3BvbnNlLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIERpYWxvZy5vcGVuKHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6ICdQYXltZW50IEZhaWxlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzcG9uc2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFsnVHJ5IEFnYWluJywgZnVuY3Rpb24oKSB7IH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoNSA9PSByZXNwb25zZS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBEaWFsb2cub3Blbih7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiAnUHJpY2UgQ2hhbmdlIEFsZXJ0JyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPlNvcnJ5ISBUaGUgcHJpY2UgZm9yIHlvdXIgYm9va2luZyBoYXMgaW5jcmVhc2VkIGJ5IDxicj4nICsgbW9uZXkocmVzcG9uc2UuZXJyb3JzLnByaWNlRGlmZiwgbWV0YS5nZXQoJ2Rpc3BsYXlfY3VycmVuY3knKSArICc8L2Rpdj4nKSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBtZXNzYWdlOiAnPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPlNvcnJ5ISBUaGUgcHJpY2UgZm9yIHlvdXIgYm9va2luZyBoYXMgaW5jcmVhc2VkICE8YnI+IE5ldyBwcmljZSBpcyAnICsgbW9uZXkocmVzcG9uc2UuZXJyb3JzLnByaWNlLCBtZXRhLmdldCgnZGlzcGxheV9jdXJyZW5jeScpICsgJzwvZGl2PicpLFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWydCYWNrIHRvIFNlYXJjaCcsIGZ1bmN0aW9uKCkgeyB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2ZsaWdodHMnICsgdmlldy5nZXQoJ3NlYXJjaHVybCcpICsgJz9mb3JjZSc7IH1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbJ0NvbnRpbnVlJywgZnVuY3Rpb24oKSB7IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYm9va2luZy8nICsgdmlldy5nZXQoJ2lkJykgKyAnP189JyArIF8ubm93KCkgfV1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGVwcy4nICsgaSArICcuZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLicgKyBpICsgJy5lcnJvcnMnLCBbcmVzcG9uc2UubWVzc2FnZV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2V0KCdzdGVwcy4nICsgaSArICcuZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGRvUGF5ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHZhciBmb3JtO1xyXG4gICAgZm9ybSA9ICQoJzxmb3JtIC8+Jywge1xyXG4gICAgICAgIGlkOiAndG1wRm9ybScsXHJcbiAgICAgICAgYWN0aW9uOiBkYXRhLnVybCxcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBzdHlsZTogJ2Rpc3BsYXk6IG5vbmU7J1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGlucHV0ID0gZGF0YS5kYXRhO1xyXG4gICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW5wdXQgIT09IG51bGwpIHtcclxuICAgICAgICAkLmVhY2goaW5wdXQsIGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICQoJzxpbnB1dCAvPicsIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oZm9ybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtLmFwcGVuZFRvKCdib2R5Jykuc3VibWl0KCk7XHJcbn07XHJcblxyXG52YXIgbWV0YSA9IG51bGw7XHJcbnZhciBCb29raW5nID0gVmlldy5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlzQm9va2VkOiBmdW5jdGlvbiAoYnMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGluUHJvY2VzczogZnVuY3Rpb24gKGJzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIShicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTEpICYmICEoYnMgPT0gMSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlzTmV3OiBmdW5jdGlvbiAoYnMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxID09IGJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIHByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLnJlZHVjZSh0aGlzLmdldCgnZmxpZ2h0cycpLCBmdW5jdGlvbiAocmVzdWx0LCBpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICsgaS5nZXQoJ3ByaWNlJyk7XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldCgnc3RlcHMuNC5hY3RpdmUnKSAmJiAhdGhpcy5nZXQoJ2Jvb2tpbmcuYWlyY2FydF9pZCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RlcDQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldCgncGF5bWVudC5lcnJvcicpKSB7XHJcbiAgICAgICAgICAgIERpYWxvZy5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcjogJ1BheW1lbnQgRmFpbGVkJyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMuZ2V0KCdwYXltZW50LmVycm9yJyksXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgWydUcnkgQWdhaW4nLCBmdW5jdGlvbigpIHsgfV1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBNZXRhLmluc3RhbmNlKCkudGhlbihmdW5jdGlvbihpKSB7IG1ldGEgPSBpOyB9KTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIGFjdGl2YXRlOiBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdGVwcy4qLmFjdGl2ZScsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnNldCgnc3RlcHMuJyArIGkgKyAnLmFjdGl2ZScsIHRydWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGVwcy4nICsgaSArICcuYWN0aXZlJyk7XHJcbiAgICB9LFxyXG4gICAgc3RlcDE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgc3RlcC5zdWJtaXQodGhpcywgMSk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9zdGVwMScsXHJcbiAgICAgICAgICAgIGRhdGE6IHtpZDogdGhpcy5nZXQoJ2lkJyksIHVzZXI6IHRoaXMuZ2V0KCd1c2VyJyl9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc3RlcC5jb21wbGV0ZSh2aWV3LCAxKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndXNlci5pZCcsIGRhdGEuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd1c2VyLmxvZ2dlZF9pbicsIGRhdGEubG9nZ2VkX2luKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY29udmVuaWVuY2VGZWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NvbnZlbmllbmNlRmVlJywgZGF0YS5jb252ZW5pZW5jZUZlZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGVwcy4xLmNvbXBsZXRlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuYWN0aXZhdGUoMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLmVycm9yKHZpZXcsIDEsIHhocik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfSxcclxuICAgIHN0ZXAyOiBmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gUS5kZWZlcigpO1xyXG5cclxuICAgICAgICBzdGVwLnN1Ym1pdCh0aGlzLCAyKTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdGltZW91dDogNjAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL3N0ZXAyJyxcclxuICAgICAgICAgICAgZGF0YToge2lkOiB0aGlzLmdldCgnaWQnKSwgY2hlY2s6IG8gJiYgby5jaGVjayA/IDEgOiAwLCBwYXNzZW5nZXJzOiB0aGlzLmdldCgncGFzc2VuZ2VycycpLCAnc2NlbmFyaW8nOiB0aGlzLmdldCgncGFzc2VuZ2VyVmFsaWRhdG9uJyl9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc3RlcC5jb21wbGV0ZSh2aWV3LCAyKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvICYmIG8uY2hlY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goZGF0YSwgZnVuY3Rpb24gKGlkLCBrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwYXNzZW5nZXJzLicgKyBrICsgJy50cmF2ZWxlci5pZCcsIGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGVwcy4yLmNvbXBsZXRlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuYWN0aXZhdGUoMyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCdtb2JpbGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGVwcy4yLmNvbXBsZXRlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuYWN0aXZhdGUoMyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2aWV3LmdldCgpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXAuZXJyb3IodmlldywgMiwgeGhyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9LFxyXG4gICAgc3RlcDM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZCA9IFEuZGVmZXIoKSxcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB7aWQ6IHRoaXMuZ2V0KCdpZCcpfTtcclxuXHJcbiAgICAgICAgc3RlcC5zdWJtaXQodGhpcywgMyk7XHJcblxyXG4gICAgICAgIGlmICgzID09IHRoaXMuZ2V0KCdwYXltZW50LmFjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIGRhdGEubmV0YmFua2luZyA9IHRoaXMuZ2V0KCdwYXltZW50Lm5ldGJhbmtpbmcnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkYXRhLmNjID0gdGhpcy5nZXQoJ3BheW1lbnQuY2MnKTtcclxuICAgICAgICAgICAgZGF0YS5jYy5zdG9yZSA9IGRhdGEuY2Muc3RvcmUgPyAxIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9zdGVwMycsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9QYXkoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLmNvbXBsZXRlKHZpZXcsIDMpO1xyXG4gICAgICAgICAgICAgICAgc3RlcC5lcnJvcih2aWV3LCAzLCB4aHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH0sXHJcbiAgICBzdGVwNDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gUS5kZWZlcigpLFxyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHtpZDogdGhpcy5nZXQoJ2lkJyl9O1xyXG5cclxuXHJcbiAgICAgICAgJC5hamF4KHsgICAgICAgICAgXHJcbiAgICAgICAgICAgLy8gdGltZW91dDogMjAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL3N0ZXA0JyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vc3RlcC5jb21wbGV0ZSh2aWV3LCA0KTsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdhaXJjYXJ0X2lkJywgZGF0YS5haXJjYXJ0X2lkKTtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdhaXJjYXJ0X3N0YXR1cycsIGRhdGEuYWlyY2FydF9zdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLjQuY29tcGxldGVkJywgdHJ1ZSk7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2aWV3LmdldCgndXNlci5lbWFpbCcpKTtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcvYjJjL2FpckNhcnQvc2VuZEVtYWlsLycgKyB2aWV3LmdldCgnYWlyY2FydF9pZCcpKTtcclxuLy8gICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbi8vICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvc2VuZEVtYWlsLycgKyBwYXJzZUludCh2aWV3LmdldCgnYWlyY2FydF9pZCcpKSxcclxuLy8gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtlbWFpbDogdmlldy5nZXQoJ3VzZXIuZW1haWwnKSwgfSxcclxuLy8gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbi8vICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuLy9cclxuLy8gICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vaWYgKHZpZXcuaXNCb29rZWQoZGF0YS5haXJjYXJ0X3N0YXR1cykgfHwgdmlldy5pc1Byb2Nlc3MoZGF0YS5haXJjYXJ0X3N0YXR1cykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MvJyArIHZpZXcuZ2V0KCdhaXJjYXJ0X2lkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIpOyBcclxuLy8gICAgICAgICAgICAgICAgIGlmKHhoci5zdGF0dXNUZXh0PT09J3RpbWVvdXQnKXtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2aWV3LmdldCgpKTtcclxuLy8gICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICBzdGVwLmVycm9yKHZpZXcsIDQsIHhocik7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfSxcclxuICAgIGlzQm9va2VkOiBmdW5jdGlvbiAoYnMpIHtcclxuICAgICAgICByZXR1cm4gYnMgPT0gOCB8fCBicyA9PSA5IHx8IGJzID09IDEwIHx8IGJzID09IDExO1xyXG4gICAgfSxcclxuICAgIGluUHJvY2VzczogZnVuY3Rpb24gKGJyKSB7XHJcbiAgICAgICAgcmV0dXJuICEoYnMgPT0gOCB8fCBicyA9PSA5IHx8IGJzID09IDEwIHx8IGJzID09IDExKSAmJiAhKGJzID09IDEpO1xyXG4gICAgfSxcclxuICAgIGlzTmV3OiBmdW5jdGlvbiAoYnIpIHtcclxuICAgICAgICByZXR1cm4gMSA9PSBicztcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuQm9va2luZy5wYXJzZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB2YXIgYWN0aXZlID0gMTtcclxuXHJcbiAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgLy9pZiAoZGF0YS51c2VyLm1vYmlsZSkge1xyXG4gICAgICAgIC8vICAgIGRhdGEudXNlci5tb2JpbGUgPSBkYXRhLnVzZXIuY291bnRyeSArIGRhdGEudXNlci5tb2JpbGU7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIGRhdGEucGF5bWVudC5hY3RpdmUgPSAtMTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhLnVzZXIuZW1haWwgJiYgd2luZG93LmxvY2FsU3RvcmFnZSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tpbmdfZW1haWwnKSkge1xyXG4gICAgICAgICAgICBkYXRhLnVzZXIuZW1haWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tpbmdfZW1haWwnKTtcclxuICAgICAgICAgICAgZGF0YS51c2VyLmNvdW50cnkgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tpbmdfY291bnRyeScpO1xyXG4gICAgICAgICAgICBkYXRhLnVzZXIubW9iaWxlID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib29raW5nX21vYmlsZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZGF0YS5mbGlnaHRzID0gXy5tYXAoZGF0YS5mbGlnaHRzLCBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIHJldHVybiBGbGlnaHQucGFyc2UoaSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoZGF0YS51c2VyICYmIGRhdGEudXNlci5pZCkge1xyXG4gICAgICAgIGRhdGEuc3RlcHNbMV0uY29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICBkYXRhLnN0ZXBzWzFdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIGFjdGl2ZSA9IDI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEucGFzc2VuZ2Vyc1swXS50cmF2ZWxlci5pZCkge1xyXG4gICAgICAgIGRhdGEuc3RlcHNbMl0uY29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICBkYXRhLnN0ZXBzWzJdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIGFjdGl2ZSA9IDM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEucGF5bWVudC5wYXltZW50X2lkKSB7XHJcbiAgICAgICAgZGF0YS5zdGVwc1szXS5jb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGRhdGEuc3RlcHNbM10uYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgYWN0aXZlID0gNDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5haXJjYXJ0X2lkKSB7XHJcbiAgICAgICAgZGF0YS5zdGVwc1s0XS5jb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGFjdGl2ZSA9IDQ7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5zdGVwc1thY3RpdmVdLmFjdGl2ZSA9IHRydWU7ICAgXHJcbiAgICAgY29uc29sZS5sb2coJ2Jvb2tpbmcgZGF0YScpO1xyXG4gICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICByZXR1cm4gbmV3IEJvb2tpbmcoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcblxyXG5Cb29raW5nLmZldGNoID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvYm9va2luZy8nICsgXy5wYXJzZUludChpZCkpXHJcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoQm9va2luZy5wYXJzZShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Cb29raW5nLmNyZWF0ZSA9IGZ1bmN0aW9uIChmbGlnaHRzLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZycsXHJcbiAgICAgICAgICAgIGRhdGE6IF8uZXh0ZW5kKHtmbGlnaHRzOiBmbGlnaHRzfSwgb3B0aW9ucyB8fCB7fSksXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKEJvb2tpbmcucGFyc2UoZGF0YSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkJvb2tpbmcub3BlbiA9IGZ1bmN0aW9uIChmbGlnaHRzLCBvcHRpb25zKSB7XHJcbiAgICBCb29raW5nLmNyZWF0ZShmbGlnaHRzLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYm9va2luZykge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9ib29raW5nLycgKyBib29raW5nLmdldCgnaWQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvb2tpbmc7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9mbGlnaHQvYm9va2luZy5qc1xuICoqIG1vZHVsZSBpZCA9IDUwXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBDb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcclxuXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL3ZpZXcuanNcbiAqKiBtb2R1bGUgaWQgPSA1MVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpXHJcbiAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJyksXHJcbiAgICBTZWFyY2ggPSByZXF1aXJlKCcuL3NlYXJjaCcpLFxyXG4gICAgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHNcclxuICAgIDtcclxuXHJcbnZhciBGbGlnaHQgPSBTdG9yZS5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VnbWVudHM6IFtdLFxyXG4gICAgICAgICAgICBwcmljZTogbnVsbCxcclxuICAgICAgICAgICAgcmVmdW5kYWJsZTogMCxcclxuXHJcblxyXG4gICAgICAgICAgICBmaXJzdDogZnVuY3Rpb24oc2VnbWVudHMpIHsgcmV0dXJuIHNlZ21lbnRzWzBdOyB9LFxyXG4gICAgICAgICAgICBsYXN0OiBmdW5jdGlvbihzZWdtZW50cykgeyByZXR1cm4gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoLTFdOyB9LFxyXG4gICAgICAgICAgICBzdG9wczogZnVuY3Rpb24oc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWdtZW50cy5sZW5ndGgtMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VndGltZTogZnVuY3Rpb24oc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc2VnbWVudHMpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBtb21lbnQuZHVyYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmVhY2goc2VnbWVudHMsIGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lLmFkZChpLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWUuYWRkKGkubGF5b3Zlcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGltZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHZpYTogZnVuY3Rpb24oc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc2VnbWVudHMpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoc2VnbWVudHMuc2xpY2UoMSksIGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkuZnJvbTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgZGVwYXJ0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdzZWdtZW50cy4wLjAuZGVwYXJ0Jyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYXJyaXZlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdzZWdtZW50cy4wLicgKyAodGhpcy5nZXQoJ3NlZ21lbnRzLjAubGVuZ3RoJykgLSAxKSArICcuYXJyaXZlJyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaXRpbmVyYXJ5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLmdldCgnc2VnbWVudHMuMCcpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtzWzBdLmZyb20uYWlycG9ydENvZGUsIHNbcy5sZW5ndGgtMV0udG8uYWlycG9ydENvZGVdLmpvaW4oJy0nKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjYXJyaWVyczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLnVuaXF1ZShcclxuICAgICAgICAgICAgICAgIF8udW5pb24uYXBwbHkobnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBfLm1hcCh0aGlzLmdldCgnc2VnbWVudHMnKSwgZnVuY3Rpb24oc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHNlZ21lbnRzLCBmdW5jdGlvbihpKSB7IHJldHVybiBpLmNhcnJpZXI7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgJ2NvZGUnXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbkZsaWdodC5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIGRhdGEuaWQgPSBfLnVuaXF1ZUlkKCdmbGlnaHRfJyk7XHJcbiAgICBkYXRhLnRpbWUgPSBtb21lbnQuZHVyYXRpb24oKTtcclxuICAgIGRhdGEuc2VnbWVudHMgPSBfLm1hcChkYXRhLnNlZ21lbnRzLCBmdW5jdGlvbihzZWdtZW50cykge1xyXG4gICAgICAgIHJldHVybiBfLm1hcChzZWdtZW50cywgZnVuY3Rpb24oaSkge1xyXG4gICAgICAgICAgICB2YXIgc2VnbWVudCA9IF8uZXh0ZW5kKGksIHtcclxuICAgICAgICAgICAgICAgIGRlcGFydDogbW9tZW50KGkuZGVwYXJ0KSxcclxuICAgICAgICAgICAgICAgIGFycml2ZTogbW9tZW50KGkuYXJyaXZlKSxcclxuICAgICAgICAgICAgICAgIHRpbWU6IG1vbWVudC5kdXJhdGlvbihpLnRpbWUpLFxyXG4gICAgICAgICAgICAgICAgbGF5b3ZlcjogbW9tZW50LmR1cmF0aW9uKGkubGF5b3ZlcilcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkYXRhLnRpbWUgPSBkYXRhLnRpbWUuYWRkKHNlZ21lbnQudGltZSkuYWRkKHNlZ21lbnQubGF5b3Zlcik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VnbWVudDtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBuZXcgRmxpZ2h0KHtkYXRhOiBkYXRhfSk7XHJcbn07XHJcblxyXG5GbGlnaHQuZmV0Y2ggPSBmdW5jdGlvbihzZWFyY2gsIGRlZmVycmVkKSB7XHJcbiAgICBkZWZlcnJlZCA9IGRlZmVycmVkIHx8IFEuZGVmZXIoKTtcclxuXHJcblxyXG4gICAgaWYgKCFkZWZlcnJlZC5zdGFydGVkKSB7XHJcbiAgICAgICAgZGVmZXJyZWQuc3RhcnRlZCA9IF8ubm93KCk7XHJcbiAgICAgICAgZGVmZXJyZWQudXBkYXRlZCA9IG51bGw7XHJcbiAgICAgICAgZGVmZXJyZWQuZmxpZ2h0cyA9IFNlYXJjaC5ST1VORFRSSVAgPT0gXy5wYXJzZUludChzZWFyY2guZ2V0KCd0cmlwVHlwZScpKSA/IFtbXSwgW11dIDogXy5tYXAoc2VhcmNoLmdldCgnZmxpZ2h0cycpLCBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NvbnN0cnVjdGVkIGZsaWdodHMnLCBkZWZlcnJlZC5mbGlnaHRzLCBzZWFyY2guZ2V0KCdmbGlnaHRzJykpO1xyXG4gICAgfSBlbHNlIGlmIChfLm5vdygpIC0gZGVmZXJyZWQuc3RhcnRlZCA+IFNlYXJjaC5NQVhfV0FJVF9USU1FKSB7XHJcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7IHNlYXJjaDogc2VhcmNoLCBmbGlnaHRzOiBkZWZlcnJlZC5mbGlnaHRzfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICB1cmw6IFJPVVRFUy5zZWFyY2gsXHJcbiAgICAgICAgZGF0YTogeyBpZHM6IHNlYXJjaC5nZXQoJ2lkcycpLCBvcHRpb25zOiBzZWFyY2gudG9KU09OKCksIHVwZGF0ZWQ6IGRlZmVycmVkLnVwZGF0ZWQgfSxcclxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncmVzcG9uc2UgdGltZScsIF8ubm93KCkgLSB0aW1lKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIGZsaWdodHMgPSBfLm1hcChkYXRhLmZsaWdodHMsIGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChmbGlnaHRzLCBmdW5jdGlvbihmbGlnaHQpIHsgcmV0dXJuIEZsaWdodC5wYXJzZShmbGlnaHQpIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRlZmVycmVkLm5vdGlmeSh7IHNlYXJjaDogc2VhcmNoLCBkZWZlcnJlZDogZGVmZXJyZWQsIGZsaWdodHM6IGZsaWdodHN9KTtcclxuXHJcbiAgICAgICAgICAgIF8uZWFjaChkZWZlcnJlZC5mbGlnaHRzLCBmdW5jdGlvbih2LCBrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmxpZ2h0c1trXSlcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5mbGlnaHRzW2tdID0gXy51bmlvbih2LCBmbGlnaHRzW2tdKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGEucGVuZGluZykge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQudXBkYXRlZCA9IGRhdGEudXBkYXRlZDtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IEZsaWdodC5mZXRjaChzZWFyY2gsIGRlZmVycmVkKTsgfSwgU2VhcmNoLklOVEVSVkFMKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeyBzZWFyY2g6IHNlYXJjaCwgZmxpZ2h0czogZGVmZXJyZWQuZmxpZ2h0cywgcHJpY2VzOiBkYXRhLnByaWNlcyB8fCBudWxsfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmxpZ2h0O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvZmxpZ2h0L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gNTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG52YXIgU2VhcmNoID0gU3RvcmUuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRvbWVzdGljOiAxLFxyXG4gICAgICAgICAgICB0cmlwVHlwZTogU2VhcmNoLk9ORVdBWSxcclxuICAgICAgICAgICAgY2FiaW5UeXBlOiBTZWFyY2guRUNPTk9NWSxcclxuICAgICAgICAgICAgZmxpZ2h0czogWyB7IGZyb206IFNlYXJjaC5ERUwsIHRvOiBTZWFyY2guQk9NLCBkZXBhcnRfYXQ6IG1vbWVudCgpLmFkZCgxLCAnZGF5JyksIHJldHVybl9hdDogbnVsbCB9IF0sXHJcblxyXG4gICAgICAgICAgICBwYXNzZW5nZXJzOiBbMSwgMCwgMF0sXHJcblxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnZG9tZXN0aWMnLCBmdW5jdGlvbihkb21lc3RpYykge1xyXG4gICAgICAgICAgICBpZiAoIWRvbWVzdGljICYmIFNlYXJjaC5NVUxUSUNJVFkgPT0gdGhpcy5nZXQoJ3RyaXBUeXBlJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCd0cmlwVHlwZScsIFNlYXJjaC5PTkVXQVkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9tZXN0aWMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzJywgW3sgZnJvbTogU2VhcmNoLkRFTCwgdG86IFNlYXJjaC5CT00sIGRlcGFydF9hdDogbW9tZW50KCkuYWRkKDEsICdkYXknKSB9XSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIFt7IGZyb206IG51bGwsIHRvOiBudWxsLCBkZXBhcnRfYXQ6IG1vbWVudCgpLmFkZCgxLCAnZGF5JykgfV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHsgaW5pdDogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndHJpcFR5cGUnLCBmdW5jdGlvbih2YWx1ZSwgb2xkKSB7XHJcbiAgICAgICAgICAgIGlmIChTZWFyY2guTVVMVElDSVRZID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGljZSgnZmxpZ2h0cycsIDEsIDAsIHsgZnJvbTogbnVsbCwgdG86IG51bGwsIGRlcGFydF9hdDogbnVsbCB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFNlYXJjaC5NVUxUSUNJVFkgPT0gb2xkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIFt0aGlzLmdldCgnZmxpZ2h0cy4wJyldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFNlYXJjaC5ST1VORFRSSVAgPT0gb2xkKSAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2ZsaWdodHMuMC5yZXR1cm5fYXQnLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7IGluaXQ6IGZhbHNlIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmVGbGlnaHQ6IGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICB0aGlzLnNwbGljZSgnZmxpZ2h0cycsIGksIDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRGbGlnaHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucHVzaCgnZmxpZ2h0cycsIHt9KTtcclxuICAgIH0sXHJcblxyXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZm9ybSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNzOiB0aGlzLmdldCgnY3MnKSxcclxuICAgICAgICAgICAgZG9tZXN0aWM6IHRoaXMuZ2V0KCdkb21lc3RpYycpLFxyXG4gICAgICAgICAgICB0cmlwVHlwZTogdGhpcy5nZXQoJ3RyaXBUeXBlJyksXHJcbiAgICAgICAgICAgIGNhYmluVHlwZTogdGhpcy5nZXQoJ2NhYmluVHlwZScpLFxyXG4gICAgICAgICAgICBwYXNzZW5nZXJzOiB0aGlzLmdldCgncGFzc2VuZ2VycycpLFxyXG5cclxuICAgICAgICAgICAgZmxpZ2h0czogXy5tYXAodGhpcy5nZXQoJ2ZsaWdodHMnKSwgZnVuY3Rpb24oZmxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IGZsaWdodC5mcm9tLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiBmbGlnaHQudG8sXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0X2F0OiBtb21lbnQuaXNNb21lbnQoZmxpZ2h0LmRlcGFydF9hdCkgPyBmbGlnaHQuZGVwYXJ0X2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5fYXQ6IDIgPT0gZm9ybS5nZXQoJ3RyaXBUeXBlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAobW9tZW50LmlzTW9tZW50KGZsaWdodC5yZXR1cm5fYXQpID8gZmxpZ2h0LnJldHVybl9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuXHJcblNlYXJjaC5NVUxUSUNJVFkgPSAzO1xyXG5TZWFyY2guUk9VTkRUUklQID0gMjtcclxuU2VhcmNoLk9ORVdBWSA9IDE7XHJcblxyXG5TZWFyY2guREVMID0gMTIzNjtcclxuU2VhcmNoLkJPTSA9IDk0NjtcclxuXHJcblNlYXJjaC5FQ09OT01ZID0gMTtcclxuU2VhcmNoLlBFUk1JVU1fRUNPTk9NWSA9IDI7XHJcblNlYXJjaC5CVVNJTkVTUyA9IDM7XHJcblNlYXJjaC5GSVJTVCA9IDQ7XHJcblxyXG5TZWFyY2guTUFYX1dBSVRfVElNRSA9IDYwMDAwO1xyXG5TZWFyY2guSU5URVJWQUwgPSA1MDAwO1xyXG5cclxuU2VhcmNoLmxvYWQgPSBmdW5jdGlvbih1cmwsIGZvcmNlLCBjcykge1xyXG4gICAgY3MgPSBjcyB8fCBudWxsO1xyXG5cclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogUk9VVEVTLnNlYXJjaCxcclxuICAgICAgICAgICAgZGF0YTogeyBxdWVyeTogdXJsLCBmb3JjZTogZm9yY2UgfHwgMCwgY3M6IGNzIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgcmVzb2x2ZShTZWFyY2gucGFyc2UoZGF0YSkpOyB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU2VhcmNoLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgZGF0YS5mbGlnaHRzID0gXy5tYXAoZGF0YS5mbGlnaHRzLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgaS5kZXBhcnRfYXQgPSBtb21lbnQoaS5kZXBhcnRfYXQpO1xyXG4gICAgICAgIGkucmV0dXJuX2F0ID0gaS5yZXR1cm5fYXQgJiYgbW9tZW50KGkucmV0dXJuX2F0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgc2VhcmNoID0gbmV3IFNlYXJjaCh7ZGF0YTogZGF0YX0pO1xyXG5cclxuXHJcbiAgICByZXR1cm4gc2VhcmNoO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvZmxpZ2h0L3NlYXJjaC5qc1xuICoqIG1vZHVsZSBpZCA9IDU0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsInZhciBGTElHSFRTID0gJy9iMmMvZmxpZ2h0cyc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGZsaWdodHM6IHtcclxuICAgICAgICBzZWFyY2g6IEZMSUdIVFMgKyAnL3NlYXJjaCcsXHJcbiAgICAgICAgYm9va2luZzogZnVuY3Rpb24oaWQpIHsgcmV0dXJuICcvYjJjL2Jvb2tpbmcvJyArIGlkOyB9LFxyXG4gICAgfSxcclxufTtcclxuXHJcbi8vbmV3XHJcbnZhciBwcm9maWxlbWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXByb2ZpbGUvbWV0YScpLFxyXG4gICAgYm9va2luZ2VtZXRhID0gcmVxdWlyZSgnc3RvcmVzL215Ym9va2luZ3MvbWV0YScpLFxyXG4gICAgdHJhdmVsbGVybWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXRyYXZlbGxlci9tZXRhJyksXHJcbiAgICBteVByb2ZpbGUgPSByZXF1aXJlKCdzdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZScpLFxyXG4gICAgbXlCb29raW5nID0gcmVxdWlyZSgnc3RvcmVzL215Ym9va2luZ3MvbXlib29raW5ncycpLFxyXG4gICAgbXlUcmF2ZWxsZXIgPSByZXF1aXJlKCdzdG9yZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXInKTtcclxuICAgIFxyXG52YXIgYWN0aW9ucyA9IHtcclxuICAgIHByb2ZpbGU6IGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xyXG4gICAgICAgIChuZXcgbXlQcm9maWxlKCkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XHJcbiAgICB9LFxyXG4gICAgYm9va2luZzogZnVuY3Rpb24oY3R4LCBuZXh0KSB7XHJcbiAgICAgICAgKG5ldyBteUJvb2tpbmcoKSkucmVuZGVyKCcjYXBwJykudGhlbihmdW5jdGlvbigpIHsgbmV4dCgpOyB9KTtcclxuICAgIH0sXHJcbiAgICB0cmF2ZWxsZXI6IGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xyXG4gICAgICAgIChuZXcgbXlUcmF2ZWxsZXIoKSkucmVuZGVyKCcjYXBwJykudGhlbihmdW5jdGlvbigpIHsgbmV4dCgpOyB9KTtcclxuICAgIH0sXHJcbn07XHJcblxyXG5wcm9maWxlbWV0YS5pbnN0YW5jZSgpLnRoZW4oZnVuY3Rpb24obWV0YSkge1xyXG4gICAgcGFnZSgnL2IyYy91c2Vycy9teXByb2ZpbGUvJywgYWN0aW9ucy5wcm9maWxlKTtcclxuICAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcclxufSk7XHJcblxyXG5ib29raW5nZW1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKG1ldGEpIHtcclxuICAgIHBhZ2UoJy9iMmMvdXNlcnMvbXlib29raW5ncy8nLCBhY3Rpb25zLmJvb2tpbmcpO1xyXG4gICAgIHBhZ2Uoe2NsaWNrOiBmYWxzZX0pO1xyXG59KTtcclxuXHJcbnRyYXZlbGxlcm1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKG1ldGEpIHtcclxuICAgIHBhZ2UoJy9iMmMvdXNlcnMvbXl0cmF2ZWxsZXIvJywgYWN0aW9ucy50cmF2ZWxsZXIpO1xyXG4gICAgIHBhZ2Uoe2NsaWNrOiBmYWxzZX0pO1xyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3JvdXRlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDU1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbiAgICA7XHJcblxyXG52YXIgVmlldyA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxyXG4gICAgO1xyXG5cclxudmFyIE1ldGEgPSBWaWV3LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGVzOiBmdW5jdGlvbigpIHsgcmV0dXJuIF8ubWFwKHZpZXcuZ2V0KCd0aXRsZXMnKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogaS5pZCwgdGV4dDogaS5uYW1lIH07IH0pOyB9LFxyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk1ldGEucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gbmV3IE1ldGEoe2RhdGE6IGRhdGF9KTtcclxufTtcclxuXHJcbk1ldGEuZmV0Y2ggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL3VzZXJzL21ldGEnKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoTWV0YS5wYXJzZShkYXRhKSk7IH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG52YXIgaW5zdGFuY2UgPSBudWxsO1xyXG5NZXRhLmluc3RhbmNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdGFuY2UgPSBNZXRhLmZldGNoKCk7XHJcbiAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teXByb2ZpbGUvbWV0YS5qc1xuICoqIG1vZHVsZSBpZCA9IDU2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA2XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnY29yZS9zdG9yZScpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IFZpZXcuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZXM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5tYXAodmlldy5nZXQoJ3RpdGxlcycpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBpLmlkLCB0ZXh0OiBpLm5hbWUgfTsgfSk7IH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuTWV0YS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHJldHVybiBuZXcgTWV0YSh7ZGF0YTogZGF0YX0pO1xyXG59O1xyXG5cclxuTWV0YS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvYWlyQ2FydC9tZXRhJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyByZXNvbHZlKE1ldGEucGFyc2UoZGF0YSkpOyB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxudmFyIGluc3RhbmNlID0gbnVsbDtcclxuTWV0YS5pbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlID0gTWV0YS5mZXRjaCgpO1xyXG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlib29raW5ncy9tZXRhLmpzXG4gKiogbW9kdWxlIGlkID0gNTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDMgNCA1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnY29yZS9zdG9yZScpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IFZpZXcuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5NZXRhLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIG5ldyBNZXRhKHtkYXRhOiBkYXRhfSk7XHJcbn07XHJcblxyXG5NZXRhLmZldGNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy90cmF2ZWxlci9tZXRhJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyByZXNvbHZlKE1ldGEucGFyc2UoZGF0YSkpOyB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxudmFyIGluc3RhbmNlID0gbnVsbDtcclxuTWV0YS5pbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlID0gTWV0YS5mZXRjaCgpO1xyXG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvbWV0YS5qc1xuICoqIG1vZHVsZSBpZCA9IDU4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxyXG4gICAgXHJcbiAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJykgIDtcclxuXHJcbnZhciBNeXByb2ZpbGUgPSBTdG9yZS5leHRlbmQoe1xyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICBwcmljZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldFN0YXRlTGlzdDogZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0U3RhdGVMaXN0XCIpO1xyXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iMmMvdXNlcnMvZ2V0U3RhdGVMaXN0LycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5jb3VudHJ5Y29kZScpKSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0YXRlbGlzdCcsbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0YXRlbGlzdCcsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCB2aWV3LmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcudXBkYXRlKCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZpbnNpaGVkIHN0b3JlOiAnKTtcclxuICAgICAgICAgICAgdmFyIHRlbXA9dmlldy5nZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpO1xyXG4gICAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgbnVsbCk7XHJcbiAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgdGVtcCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2l0eUxpc3Q6IGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImdldENpdHlMaXN0XCIpO1xyXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iMmMvdXNlcnMvZ2V0Q2l0eUxpc3QvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpKSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NpdHlsaXN0JyxudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uY2l0eWNvZGUnLCB2aWV3LmdldCgncHJvZmlsZWZvcm0uY2l0eWNvZGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICQoJyNkaXZjaXR5IC51aS5kcm9wZG93bicpLmRyb3Bkb3duKCdzZXQgc2VsZWN0ZWQnLCAkKCcjZGl2Y2l0eSAuaXRlbS5hY3RpdmUuc2VsZWN0ZWQnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbk15cHJvZmlsZS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpOyAgXHJcbiAgICAgICAgICAgZGF0YS5iYXNlVXJsPScnO1xyXG4gICAgICAgICAgICBkYXRhLmFkZD1mYWxzZTtcclxuICAgICAgICAgICAgZGF0YS5lZGl0PWZhbHNlOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRhdGEucGVuZGluZz0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgcmV0dXJuIG5ldyBNeXByb2ZpbGUoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcbk15cHJvZmlsZS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvdXNlcnMvZ2V0UHJvZmlsZScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgIHJlc29sdmUoTXlwcm9maWxlLnBhcnNlKGRhdGEpKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWRcIik7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTXlwcm9maWxlO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDU5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA2XG4gKiovIiwiLy8gICAgIFZhbGlkYXRlLmpzIDAuNy4xXG5cbi8vICAgICAoYykgMjAxMy0yMDE1IE5pY2tsYXMgQW5zbWFuLCAyMDEzIFdyYXBwXG4vLyAgICAgVmFsaWRhdGUuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly92YWxpZGF0ZWpzLm9yZy9cblxuKGZ1bmN0aW9uKGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cy5cbiAgLy8gVGhlIG9wdGlvbnMgYXJlIHRoZSBmb2xsb3dpbmc6XG4gIC8vICAgLSBmb3JtYXQgKHN0cmluZykgLSBBbiBvcHRpb24gdGhhdCBjb250cm9scyBob3cgdGhlIHJldHVybmVkIHZhbHVlIGlzIGZvcm1hdHRlZFxuICAvLyAgICAgKiBmbGF0IC0gUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YganVzdCB0aGUgZXJyb3IgbWVzc2FnZXNcbiAgLy8gICAgICogZ3JvdXBlZCAtIFJldHVybnMgdGhlIG1lc3NhZ2VzIGdyb3VwZWQgYnkgYXR0cmlidXRlIChkZWZhdWx0KVxuICAvLyAgICAgKiBkZXRhaWxlZCAtIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJhdyB2YWxpZGF0aW9uIGRhdGFcbiAgLy8gICAtIGZ1bGxNZXNzYWdlcyAoYm9vbGVhbikgLSBJZiBgdHJ1ZWAgKGRlZmF1bHQpIHRoZSBhdHRyaWJ1dGUgbmFtZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGVycm9yLlxuICAvL1xuICAvLyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBvcHRpb25zIGFyZSBhbHNvIHBhc3NlZCB0byBlYWNoIHZhbGlkYXRvci5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpXG4gICAgICAsIGF0dHJcbiAgICAgICwgdmFsaWRhdG9yO1xuXG4gICAgZm9yIChhdHRyIGluIHJlc3VsdHMpIHtcbiAgICAgIGZvciAodmFsaWRhdG9yIGluIHJlc3VsdHNbYXR0cl0pIHtcbiAgICAgICAgaWYgKHYuaXNQcm9taXNlKHJlc3VsdHNbYXR0cl1bdmFsaWRhdG9yXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2UgdmFsaWRhdGUuYXN5bmMgaWYgeW91IHdhbnQgc3VwcG9ydCBmb3IgcHJvbWlzZXNcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRlLnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICB2YXIgdiA9IHZhbGlkYXRlO1xuXG4gIC8vIENvcGllcyBvdmVyIGF0dHJpYnV0ZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2VzIHRvIGEgc2luZ2xlIGRlc3RpbmF0aW9uLlxuICAvLyBWZXJ5IG11Y2ggc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgZXh0ZW5kLlxuICAvLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHRhcmdldCBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIHdpbGwgYmVcbiAgLy8gdXNlZCBhcyB0YXJnZXRzLlxuICB2LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgYXR0ciBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW2F0dHJdID0gc291cmNlW2F0dHJdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgdi5leHRlbmQodmFsaWRhdGUsIHtcbiAgICAvLyBUaGlzIGlzIHRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IGFzIGEgc2VtdmVyLlxuICAgIC8vIFRoZSB0b1N0cmluZyBmdW5jdGlvbiB3aWxsIGFsbG93IGl0IHRvIGJlIGNvZXJjZWQgaW50byBhIHN0cmluZ1xuICAgIHZlcnNpb246IHtcbiAgICAgIG1ham9yOiAwLFxuICAgICAgbWlub3I6IDcsXG4gICAgICBwYXRjaDogMSxcbiAgICAgIG1ldGFkYXRhOiBudWxsLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHYuZm9ybWF0KFwiJXttYWpvcn0uJXttaW5vcn0uJXtwYXRjaH1cIiwgdi52ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2LmlzRW1wdHkodi52ZXJzaW9uLm1ldGFkYXRhKSkge1xuICAgICAgICAgIHZlcnNpb24gKz0gXCIrXCIgKyB2LnZlcnNpb24ubWV0YWRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEJlbG93IGlzIHRoZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgdXNlZCBpbiB2YWxpZGF0ZS5qc1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIElmIHlvdSBhcmUgdXNpbmcgUS5qcywgUlNWUCBvciBhbnkgb3RoZXIgQSsgY29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIG92ZXJyaWRlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGF0IHByb21pc2UuXG4gICAgLy8gU2luY2UgalF1ZXJ5IHByb21pc2VzIGFyZW4ndCBBKyBjb21wYXRpYmxlIHRoZXkgd29uJ3Qgd29yay5cbiAgICBQcm9taXNlOiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFByb21pc2UgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgLy8gSWYgbW9tZW50IGlzIHVzZWQgaW4gbm9kZSwgYnJvd3NlcmlmeSBldGMgcGxlYXNlIHNldCB0aGlzIGF0dHJpYnV0ZVxuICAgIC8vIGxpa2UgdGhpczogYHZhbGlkYXRlLm1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG4gICAgbW9tZW50OiB0eXBlb2YgbW9tZW50ICE9PSBcInVuZGVmaW5lZFwiID8gbW9tZW50IDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIFhEYXRlOiB0eXBlb2YgWERhdGUgIT09IFwidW5kZWZpbmVkXCIgPyBYRGF0ZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBFTVBUWV9TVFJJTkdfUkVHRVhQOiAvXlxccyokLyxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cyBvYmplY3QuXG4gICAgLy8gV2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIGZvcm1hdDpcbiAgICAvLyAgICAgW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZSBuYW1lPlwiLCBlcnJvcjogXCI8dmFsaWRhdGlvbiByZXN1bHQ+XCJ9LCAuLi5dXG4gICAgcnVuVmFsaWRhdGlvbnM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgICwgYXR0clxuICAgICAgICAsIHZhbGlkYXRvck5hbWVcbiAgICAgICAgLCB2YWx1ZVxuICAgICAgICAsIHZhbGlkYXRvcnNcbiAgICAgICAgLCB2YWxpZGF0b3JcbiAgICAgICAgLCB2YWxpZGF0b3JPcHRpb25zXG4gICAgICAgICwgZXJyb3I7XG5cbiAgICAgIGlmICh2LmlzRG9tRWxlbWVudChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jb2xsZWN0Rm9ybVZhbHVlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcHMgdGhyb3VnaCBlYWNoIGNvbnN0cmFpbnRzLCBmaW5kcyB0aGUgY29ycmVjdCB2YWxpZGF0b3IgYW5kIHJ1biBpdC5cbiAgICAgIGZvciAoYXR0ciBpbiBjb25zdHJhaW50cykge1xuICAgICAgICB2YWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIGF0dHIpO1xuICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludHMgZm9yIGFuIGF0dHJpYnV0ZSB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgdmFsaWRhdG9ycyA9IHYucmVzdWx0KGNvbnN0cmFpbnRzW2F0dHJdLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuXG4gICAgICAgIGZvciAodmFsaWRhdG9yTmFtZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgdmFsaWRhdG9yID0gdi52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gdi5mb3JtYXQoXCJVbmtub3duIHZhbGlkYXRvciAle25hbWV9XCIsIHtuYW1lOiB2YWxpZGF0b3JOYW1lfSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBvcHRpb25zIHRvIGJlIGEgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlXG4gICAgICAgICAgLy8gY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHYucmVzdWx0KHZhbGlkYXRvck9wdGlvbnMsIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3JPcHRpb25zKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvcjogdmFsaWRhdG9yLmNhbGwodmFsaWRhdG9yLCB2YWx1ZSwgdmFsaWRhdG9yT3B0aW9ucywgYXR0cixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG5cbiAgICAvLyBUYWtlcyB0aGUgb3V0cHV0IGZyb20gcnVuVmFsaWRhdGlvbnMgYW5kIGNvbnZlcnRzIGl0IHRvIHRoZSBjb3JyZWN0XG4gICAgLy8gb3V0cHV0IGZvcm1hdC5cbiAgICBwcm9jZXNzVmFsaWRhdGlvblJlc3VsdHM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIGVycm9ycyA9IHYucHJ1bmVFbXB0eUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5leHBhbmRNdWx0aXBsZUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5jb252ZXJ0RXJyb3JNZXNzYWdlcyhlcnJvcnMsIG9wdGlvbnMpO1xuXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMuZm9ybWF0IHx8IFwiZ3JvdXBlZFwiKSB7XG4gICAgICAgIGNhc2UgXCJkZXRhaWxlZFwiOlxuICAgICAgICAgIC8vIERvIG5vdGhpbmcgbW9yZSB0byB0aGUgZXJyb3JzXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImZsYXRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9ycyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdyb3VwZWRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNbYXR0cl0gPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9yc1thdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHYuZm9ybWF0KFwiVW5rbm93biBmb3JtYXQgJXtmb3JtYXR9XCIsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuaXNFbXB0eShlcnJvcnMpID8gdW5kZWZpbmVkIDogZXJyb3JzO1xuICAgIH0sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0aW9ucyB3aXRoIHN1cHBvcnQgZm9yIHByb21pc2VzLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCB3aGVuIGFsbCB0aGVcbiAgICAvLyB2YWxpZGF0aW9uIHByb21pc2VzIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gICAgLy8gSXQgY2FuIGJlIGNhbGxlZCBldmVuIGlmIG5vIHZhbGlkYXRpb25zIHJldHVybmVkIGEgcHJvbWlzZS5cbiAgICBhc3luYzogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5hc3luYy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2LndhaXRGb3JSZXN1bHRzKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVycm9ycyA9IHYucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpbmdsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuc2luZ2xlLm9wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgZm9ybWF0OiBcImZsYXRcIixcbiAgICAgICAgZnVsbE1lc3NhZ2VzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdih7c2luZ2xlOiB2YWx1ZX0sIHtzaW5nbGU6IGNvbnN0cmFpbnRzfSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgcHJvbWlzZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcbiAgICAvLyBhcmUgc2V0dGxlZC4gVGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzIGFsd2F5cyByZXNvbHZlZCxcbiAgICAvLyBuZXZlciByZWplY3RlZC5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBpbnB1dCBhcmd1bWVudCwgaXQgcmVwbGFjZXMgdGhlIHByb21pc2VzXG4gICAgLy8gd2l0aCB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgcHJvbWlzZS5cbiAgICB3YWl0Rm9yUmVzdWx0czogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgLy8gQ3JlYXRlIGEgc2VxdWVuY2Ugb2YgYWxsIHRoZSByZXN1bHRzIHN0YXJ0aW5nIHdpdGggYSByZXNvbHZlZCBwcm9taXNlLlxuICAgICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHJlc3VsdCkge1xuICAgICAgICAvLyBJZiB0aGlzIHJlc3VsdCBpc24ndCBhIHByb21pc2Ugc2tpcCBpdCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIGlmICghdi5pc1Byb21pc2UocmVzdWx0LmVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lbW8udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmVycm9yLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAvLyBJZiBmb3Igc29tZSByZWFzb24gdGhlIHZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgbm9cbiAgICAgICAgICAgICAgLy8gZXJyb3Igd2FzIHNwZWNpZmllZC5cbiAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHYud2FybihcIlZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgZGlkbid0IHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcigpOyB9KSk7IC8vIEEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIH0sXG5cbiAgICAvLyBJZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBjYWxsOiBmdW5jdGlvbiB0aGUgYW5kOiBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlXG4gICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZS4gQWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXNcbiAgICAvLyBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmVzdWx0KCdmb28nKSAvLyAnZm9vJ1xuICAgIC8vIHJlc3VsdChNYXRoLm1heCwgMSwgMikgLy8gMlxuICAgIC8vIGBgYFxuICAgIHJlc3VsdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLiBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IGNvbnNpZGVyIE5hTiBhXG4gICAgLy8gbnVtYmVyIGxpa2UgbWFueSBvdGhlciBgaXNOdW1iZXJgIGZ1bmN0aW9ucyBkby5cbiAgICBpc051bWJlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBub3QgYSBmdW5jdGlvblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0sXG5cbiAgICAvLyBBIHNpbXBsZSBjaGVjayB0byB2ZXJpZnkgdGhhdCB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlci4gVXNlcyBgaXNOdW1iZXJgXG4gICAgLy8gYW5kIGEgc2ltcGxlIG1vZHVsbyBjaGVjay5cbiAgICBpc0ludGVnZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgJSAxID09PSAwO1xuICAgIH0sXG5cbiAgICAvLyBVc2VzIHRoZSBgT2JqZWN0YCBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYW4gb2JqZWN0LlxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICAgIH0sXG5cbiAgICAvLyBTaW1wbHkgY2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBkYXRlXG4gICAgaXNEYXRlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgYG51bGxgIG9mIGB1bmRlZmluZWRgXG4gICAgaXNEZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBwcm9taXNlLiBBbnl0aGluZyB3aXRoIGEgYHRoZW5gXG4gICAgLy8gZnVuY3Rpb24gaXMgY29uc2lkZXJlZCBhIHByb21pc2UuXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gISFwICYmIHYuaXNGdW5jdGlvbihwLnRoZW4pO1xuICAgIH0sXG5cbiAgICBpc0RvbUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvckFsbCkgfHwgIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3QoZG9jdW1lbnQpICYmIG8gPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvNjk5MzA0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG8gJiZcbiAgICAgICAgICB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgICBvLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgLy8gTnVsbCBhbmQgdW5kZWZpbmVkIGFyZSBlbXB0eVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaXRlc3BhY2Ugb25seSBzdHJpbmdzIGFyZSBlbXB0eVxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2LkVNUFRZX1NUUklOR19SRUdFWFAudGVzdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBhcnJheXMgd2UgdXNlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgIGlmICh2LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIGhhdmUgbm8gYXR0cmlidXRlcyBidXQgYXJlbid0IGVtcHR5XG4gICAgICBpZiAodi5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgZmluZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkgd2UgY29uc2lkZXIgaXQgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEZvcm1hdHMgdGhlIHNwZWNpZmllZCBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHZhbHVlcyBsaWtlIHNvOlxuICAgIC8vIGBgYFxuICAgIC8vIGZvcm1hdChcIkZvbzogJXtmb299XCIsIHtmb286IFwiYmFyXCJ9KSAvLyBcIkZvbyBiYXJcIlxuICAgIC8vIGBgYFxuICAgIC8vIElmIHlvdSB3YW50IHRvIHdyaXRlICV7Li4ufSB3aXRob3V0IGhhdmluZyBpdCByZXBsYWNlZCBzaW1wbHlcbiAgICAvLyBwcmVmaXggaXQgd2l0aCAlIGxpa2UgdGhpcyBgRm9vOiAlJXtmb299YCBhbmQgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIGFzIGBcIkZvbzogJXtmb299XCJgXG4gICAgZm9ybWF0OiB2LmV4dGVuZChmdW5jdGlvbihzdHIsIHZhbHMpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSh2LmZvcm1hdC5GT1JNQVRfUkVHRVhQLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgIGlmIChtMSA9PT0gJyUnKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJXtcIiArIG0yICsgXCJ9XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWxzW20yXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgIC8vIEZpbmRzICV7a2V5fSBzdHlsZSBwYXR0ZXJucyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICBGT1JNQVRfUkVHRVhQOiAvKCU/KSVcXHsoW15cXH1dKylcXH0vZ1xuICAgIH0pLFxuXG4gICAgLy8gXCJQcmV0dGlmaWVzXCIgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAvLyBQcmV0dGlmeWluZyBtZWFucyByZXBsYWNpbmcgWy5cXF8tXSB3aXRoIHNwYWNlcyBhcyB3ZWxsIGFzIHNwbGl0dGluZ1xuICAgIC8vIGNhbWVsIGNhc2Ugd29yZHMuXG4gICAgcHJldHRpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHYuaXNOdW1iZXIoc3RyKSkge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDIgZGVjaW1hbHMgcm91bmQgaXQgdG8gdHdvXG4gICAgICAgIGlmICgoc3RyICogMTAwKSAlIDEgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHN0ciAqIDEwMCkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNBcnJheShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHYucHJldHRpZnkocyk7IH0pLmpvaW4oXCIsIFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgc3RyaW5nIGlzIGFjdHVhbGx5IGEgc3RyaW5nXG4gICAgICBzdHIgPSBcIlwiICsgc3RyO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC8vIFNwbGl0cyBrZXlzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXHNdKVxcLihbXlxcc10pL2csICckMSAkMicpXG4gICAgICAgIC8vIFJlbW92ZXMgYmFja3NsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwrL2csICcnKVxuICAgICAgICAvLyBSZXBsYWNlcyAtIGFuZCAtIHdpdGggc3BhY2VcbiAgICAgICAgLnJlcGxhY2UoL1tfLV0vZywgJyAnKVxuICAgICAgICAvLyBTcGxpdHMgY2FtZWwgY2FzZWQgd29yZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIG0xICsgXCIgXCIgKyBtMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgc3RyaW5naWZ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5wcmV0dGlmeSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIGluIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0RGVlcE9iamVjdFZhbHVlOiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIGlmICghdi5pc09iamVjdChvYmopIHx8ICF2LmlzU3RyaW5nKGtleXBhdGgpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiXG4gICAgICAgICwgaVxuICAgICAgICAsIGVzY2FwZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cGF0aC5sZW5ndGg7ICsraSkge1xuICAgICAgICBzd2l0Y2ggKGtleXBhdGhbaV0pIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnLic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgICAgICAgICAgIGtleSA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnXFxcXCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cGF0aFtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzRGVmaW5lZChvYmopICYmIGtleSBpbiBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVGhpcyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtLlxuICAgIC8vIEl0IHVzZXMgdGhlIGlucHV0IG5hbWUgYXMga2V5IGFuZCB0aGUgdmFsdWUgYXMgdmFsdWVcbiAgICAvLyBTbyBmb3IgZXhhbXBsZSB0aGlzOlxuICAgIC8vIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiZm9vQGJhci5jb21cIiAvPlxuICAgIC8vIHdvdWxkIHJldHVybjpcbiAgICAvLyB7ZW1haWw6IFwiZm9vQGJhci5jb21cIn1cbiAgICBjb2xsZWN0Rm9ybVZhbHVlczogZnVuY3Rpb24oZm9ybSwgb3B0aW9ucykge1xuICAgICAgdmFyIHZhbHVlcyA9IHt9XG4gICAgICAgICwgaVxuICAgICAgICAsIGlucHV0XG4gICAgICAgICwgaW5wdXRzXG4gICAgICAgICwgdmFsdWU7XG5cbiAgICAgIGlmICghZm9ybSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF0dHJpYnV0ZXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0udmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LFxuXG4gICAgc2FuaXRpemVGb3JtVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmltICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5udWxsaWZ5ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgYWxsIGVycm9ycyB3aG8ncyBlcnJvciBhdHRyaWJ1dGUgaXMgZW1wdHkgKG51bGwgb3IgdW5kZWZpbmVkKVxuICAgIHBydW5lRW1wdHlFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICF2LmlzRW1wdHkoZXJyb3IuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIEluXG4gICAgLy8gW3tlcnJvcjogW1wiZXJyMVwiLCBcImVycjJcIl0sIC4uLn1dXG4gICAgLy8gT3V0XG4gICAgLy8gW3tlcnJvcjogXCJlcnIxXCIsIC4uLn0sIHtlcnJvcjogXCJlcnIyXCIsIC4uLn1dXG4gICAgLy9cbiAgICAvLyBBbGwgYXR0cmlidXRlcyBpbiBhbiBlcnJvciB3aXRoIG11bHRpcGxlIG1lc3NhZ2VzIGFyZSBkdXBsaWNhdGVkXG4gICAgLy8gd2hlbiBleHBhbmRpbmcgdGhlIGVycm9ycy5cbiAgICBleHBhbmRNdWx0aXBsZUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBSZW1vdmVzIGVycm9ycyB3aXRob3V0IGEgbWVzc2FnZVxuICAgICAgICBpZiAodi5pc0FycmF5KGVycm9yLmVycm9yKSkge1xuICAgICAgICAgIGVycm9yLmVycm9yLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3IsIHtlcnJvcjogbXNnfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0cyB0aGUgZXJyb3IgbWVzYWdlcyBieSBwcmVwZW5kaW5nIHRoZSBhdHRyaWJ1dGUgbmFtZSB1bmxlc3MgdGhlXG4gICAgLy8gbWVzc2FnZSBpcyBwcmVmaXhlZCBieSBeXG4gICAgY29udmVydEVycm9yTWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9ySW5mbykge1xuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckluZm8uZXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yWzBdID09PSAnXicpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yLnNsaWNlKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZnVsbE1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVycm9yID0gdi5jYXBpdGFsaXplKHYucHJldHRpZnkoZXJyb3JJbmZvLmF0dHJpYnV0ZSkpICsgXCIgXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IGVycm9yLnJlcGxhY2UoL1xcXFxcXF4vZywgXCJeXCIpO1xuICAgICAgICBlcnJvciA9IHYuZm9ybWF0KGVycm9yLCB7dmFsdWU6IHYuc3RyaW5naWZ5VmFsdWUoZXJyb3JJbmZvLnZhbHVlKX0pO1xuICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3JJbmZvLCB7ZXJyb3I6IGVycm9yfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8ge1wiPGF0dHJpYnV0ZU5hbWU+XCI6IFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XX1cbiAgICBncm91cEVycm9yc0J5QXR0cmlidXRlOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBsaXN0ID0gcmV0W2Vycm9yLmF0dHJpYnV0ZV07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgbGlzdC5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXRbZXJyb3IuYXR0cmlidXRlXSA9IFtlcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3tlcnJvcjogXCI8bWVzc2FnZSAxPlwiLCAuLi59LCB7ZXJyb3I6IFwiPG1lc3NhZ2UgMj5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8gW1wiPG1lc3NhZ2UgMT5cIiwgXCI8bWVzc2FnZSAyPlwiXVxuICAgIGZsYXR0ZW5FcnJvcnNUb0FycmF5OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKSB7IHJldHVybiBlcnJvci5lcnJvcjsgfSk7XG4gICAgfSxcblxuICAgIGV4cG9zZU1vZHVsZTogZnVuY3Rpb24odmFsaWRhdGUsIHJvb3QsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgICBpZiAodmFsaWRhdGUuaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXJuOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7XG4gICAgLy8gUHJlc2VuY2UgdmFsaWRhdGVzIHRoYXQgdGhlIHZhbHVlIGlzbid0IGVtcHR5XG4gICAgcHJlc2VuY2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImNhbid0IGJlIGJsYW5rXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpcyA9IG9wdGlvbnMuaXNcbiAgICAgICAgLCBtYXhpbXVtID0gb3B0aW9ucy5tYXhpbXVtXG4gICAgICAgICwgbWluaW11bSA9IG9wdGlvbnMubWluaW11bVxuICAgICAgICAsIHRva2VuaXplciA9IG9wdGlvbnMudG9rZW5pemVyIHx8IGZ1bmN0aW9uKHZhbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICwgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW107XG5cbiAgICAgIHZhbHVlID0gdG9rZW5pemVyKHZhbHVlKTtcbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICBpZighdi5pc051bWJlcihsZW5ndGgpKSB7XG4gICAgICAgIHYuZXJyb3Iodi5mb3JtYXQoXCJBdHRyaWJ1dGUgJXthdHRyfSBoYXMgYSBub24gbnVtZXJpYyB2YWx1ZSBmb3IgYGxlbmd0aGBcIiwge2F0dHI6IGF0dHJpYnV0ZX0pKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaGFzIGFuIGluY29ycmVjdCBsZW5ndGhcIjtcbiAgICAgIH1cblxuICAgICAgLy8gSXMgY2hlY2tzXG4gICAgICBpZiAodi5pc051bWJlcihpcykgJiYgbGVuZ3RoICE9PSBpcykge1xuICAgICAgICBlcnIgPSBvcHRpb25zLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIFwiaXMgdGhlIHdyb25nIGxlbmd0aCAoc2hvdWxkIGJlICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBpc30pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWluaW11bSkgJiYgbGVuZ3RoIDwgbWluaW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb1Nob3J0IHx8XG4gICAgICAgICAgdGhpcy50b29TaG9ydCB8fFxuICAgICAgICAgIFwiaXMgdG9vIHNob3J0IChtaW5pbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtaW5pbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtYXhpbXVtKSAmJiBsZW5ndGggPiBtYXhpbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTG9uZyB8fFxuICAgICAgICAgIHRoaXMudG9vTG9uZyB8fFxuICAgICAgICAgIFwiaXMgdG9vIGxvbmcgKG1heGltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1heGltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bWVyaWNhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgICAsIG5hbWVcbiAgICAgICAgLCBjb3VudFxuICAgICAgICAsIGNoZWNrcyA9IHtcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuOiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID4gYzsgfSxcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID49IGM7IH0sXG4gICAgICAgICAgICBlcXVhbFRvOiAgICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA9PT0gYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuOiAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDwgYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDw9IGM7IH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBDb2VyY2UgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIHVubGVzcyB3ZSdyZSBiZWluZyBzdHJpY3QuXG4gICAgICBpZiAob3B0aW9ucy5ub1N0cmluZ3MgIT09IHRydWUgJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIHdlIHNob3VsZG4ndCBjb250aW51ZSBzaW5jZSBpdCB3aWxsIGNvbXBhcmUgaXQuXG4gICAgICBpZiAoIXYuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImlzIG5vdCBhIG51bWJlclwiO1xuICAgICAgfVxuXG4gICAgICAvLyBTYW1lIGxvZ2ljIGFzIGFib3ZlLCBzb3J0IG9mLiBEb24ndCBib3RoZXIgd2l0aCBjb21wYXJpc29ucyBpZiB0aGlzXG4gICAgICAvLyBkb2Vzbid0IHBhc3MuXG4gICAgICBpZiAob3B0aW9ucy5vbmx5SW50ZWdlciAmJiAhdi5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RJbnRlZ2VyICB8fCBcIm11c3QgYmUgYW4gaW50ZWdlclwiO1xuICAgICAgfVxuXG4gICAgICBmb3IgKG5hbWUgaW4gY2hlY2tzKSB7XG4gICAgICAgIGNvdW50ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgaWYgKHYuaXNOdW1iZXIoY291bnQpICYmICFjaGVja3NbbmFtZV0odmFsdWUsIGNvdW50KSkge1xuICAgICAgICAgIC8vIFRoaXMgcGlja3MgdGhlIGRlZmF1bHQgbWVzc2FnZSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZSB0aGUgZ3JlYXRlclRoYW4gY2hlY2sgdXNlcyB0aGUgbWVzc2FnZSBmcm9tXG4gICAgICAgICAgLy8gdGhpcy5ub3RHcmVhdGVyVGhhbiBzbyB3ZSBjYXBpdGFsaXplIHRoZSBuYW1lIGFuZCBwcmVwZW5kIFwibm90XCJcbiAgICAgICAgICB2YXIgbXNnID0gdGhpc1tcIm5vdFwiICsgdi5jYXBpdGFsaXplKG5hbWUpXSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlICV7dHlwZX0gJXtjb3VudH1cIjtcblxuICAgICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KG1zZywge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgdHlwZTogdi5wcmV0dGlmeShuYW1lKVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5vZGQgJiYgdmFsdWUgJSAyICE9PSAxKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90T2RkIHx8IFwibXVzdCBiZSBvZGRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5ldmVuICYmIHZhbHVlICUgMiAhPT0gMCkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdEV2ZW4gfHwgXCJtdXN0IGJlIGV2ZW5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZXRpbWU6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW11cbiAgICAgICAgLCBlYXJsaWVzdCA9IG9wdGlvbnMuZWFybGllc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMuZWFybGllc3QsIG9wdGlvbnMpIDogTmFOXG4gICAgICAgICwgbGF0ZXN0ID0gb3B0aW9ucy5sYXRlc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMubGF0ZXN0LCBvcHRpb25zKSA6IE5hTjtcblxuICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlKHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgLy8gODY0MDAwMDAgaXMgdGhlIG51bWJlciBvZiBzZWNvbmRzIGluIGEgZGF5LCB0aGlzIGlzIHVzZWQgdG8gcmVtb3ZlXG4gICAgICAvLyB0aGUgdGltZSBmcm9tIHRoZSBkYXRlXG4gICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IG9wdGlvbnMuZGF0ZU9ubHkgJiYgdmFsdWUgJSA4NjQwMDAwMCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJtdXN0IGJlIGEgdmFsaWQgZGF0ZVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGVhcmxpZXN0KSAmJiB2YWx1ZSA8IGVhcmxpZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vRWFybHkgfHwgXCJtdXN0IGJlIG5vIGVhcmxpZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGVhcmxpZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGxhdGVzdCkgJiYgdmFsdWUgPiBsYXRlc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29MYXRlIHx8IFwibXVzdCBiZSBubyBsYXRlciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQobGF0ZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb252ZXJ0IGlucHV0IHRvIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIG1pbGxpcyBzaW5jZSB0aGUgZXBvY2guXG4gICAgICAvLyBJdCBzaG91bGQgcmV0dXJuIE5hTiBpZiBpdCdzIG5vdCBhIHZhbGlkIGRhdGUuXG4gICAgICBwYXJzZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgdi5YRGF0ZSh2YWx1ZSwgdHJ1ZSkuZ2V0VGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIHJldHVybiArdi5tb21lbnQudXRjKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH0sXG4gICAgICAvLyBGb3JtYXRzIHRoZSBnaXZlbiB0aW1lc3RhbXAuIFVzZXMgSVNPODYwMSB0byBmb3JtYXQgdGhlbS5cbiAgICAgIC8vIElmIG9wdGlvbnMuZGF0ZU9ubHkgaXMgdHJ1ZSB0aGVuIG9ubHkgdGhlIHllYXIsIG1vbnRoIGFuZCBkYXkgd2lsbCBiZVxuICAgICAgLy8gb3V0cHV0LlxuICAgICAgZm9ybWF0OiBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSBvcHRpb25zLmRhdGVGb3JtYXQ7XG5cbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwieXl5eS1NTS1kZFwiIDogXCJ5eXl5LU1NLWRkIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiBuZXcgWERhdGUoZGF0ZSwgdHJ1ZSkudG9TdHJpbmcoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcIllZWVktTU0tRERcIiA6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gdi5tb21lbnQudXRjKGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH0pLFxuICAgIGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIG9wdGlvbnMsIHtkYXRlT25seTogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHYudmFsaWRhdG9ycy5kYXRldGltZS5jYWxsKHYudmFsaWRhdG9ycy5kYXRldGltZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykgfHwgKG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7cGF0dGVybjogb3B0aW9uc307XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgaW52YWxpZFwiXG4gICAgICAgICwgcGF0dGVybiA9IG9wdGlvbnMucGF0dGVyblxuICAgICAgICAsIG1hdGNoO1xuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdGlvbnMucGF0dGVybiwgb3B0aW9ucy5mbGFncyk7XG4gICAgICB9XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyh2YWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoIHx8IG1hdGNoWzBdLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbmNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJeJXt2YWx1ZX0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0XCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZXhjbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICghdi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcIl4le3ZhbHVlfSBpcyByZXN0cmljdGVkXCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZW1haWw6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCBlbWFpbFwiO1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLlBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgUEFUVEVSTjogL15bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16XXsyLH0kL2lcbiAgICB9KSxcbiAgICBlcXVhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge2F0dHJpYnV0ZTogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJpcyBub3QgZXF1YWwgdG8gJXthdHRyaWJ1dGV9XCI7XG5cbiAgICAgIGlmICh2LmlzRW1wdHkob3B0aW9ucy5hdHRyaWJ1dGUpIHx8ICF2LmlzU3RyaW5nKG9wdGlvbnMuYXR0cmlidXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXR0cmlidXRlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3RoZXJWYWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlKVxuICAgICAgICAsIGNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3IgfHwgZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgICAgcmV0dXJuIHYxID09PSB2MjtcbiAgICAgICAgfTtcblxuICAgICAgaWYgKCFjb21wYXJhdG9yKHZhbHVlLCBvdGhlclZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7YXR0cmlidXRlOiB2LnByZXR0aWZ5KG9wdGlvbnMuYXR0cmlidXRlKX0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5leHBvc2VNb2R1bGUodmFsaWRhdGUsIHRoaXMsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKTtcbn0pLmNhbGwodGhpcyxcbiAgICAgICAgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZXhwb3J0cyA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbW9kdWxlIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBkZWZpbmUgOiBudWxsKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSA2MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgNCA1IDYgN1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcImRlZmluZSBjYW5ub3QgYmUgdXNlZCBpbmRpcmVjdFwiKTsgfTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvYnVpbGRpbi9hbWQtZGVmaW5lLmpzXG4gKiogbW9kdWxlIGlkID0gNjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA2IDdcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAgICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxyXG5cclxuICAgICAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJyk7XHJcblxyXG52YXIgTXlib29raW5nRGF0YSA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIHByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlZnJlc2hDdXJyZW50Q2FydDogZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hDdXJyZW50Q2FydFwiKTtcclxuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Q2FydERldGFpbHMvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ2N1cnJlbnRDYXJ0SWQnKSksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHVwY29taW5nOiBkYXRhLnVwY29taW5nLCBjcmVhdGVkOiBkYXRhLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBkYXRhLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogZGF0YS5ib29raW5nX3N0YXR1cyxib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjdXJyZW50Q2FydERldGFpbHMnLCBkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleCh2aWV3LmdldCgnY2FydHMnKSwgeydpZCc6IGRldGFpbHMuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXg6ICcraW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FydHMgPSB2aWV3LmdldCgnY2FydHMnKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJ0c1tpbmRleF0uYm9va2luZ19zdGF0dXMgPSBkZXRhaWxzLmJvb2tpbmdfc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjYXJ0cycsIGNhcnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluc2loZWQgc3RvcmU6ICcpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbk15Ym9va2luZ0RhdGEuZ2V0Q3VycmVudENhcnQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgLy8gY29uc29sZS5sb2coXCJnZXRDdXJyZW50Q2FydFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9nZXRDYXJ0RGV0YWlscy8nICsgXy5wYXJzZUludChpZCksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkb25lXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHRpY2tldHN0YXR1c21zZzpkYXRhLnRpY2tldHN0YXR1c21zZyx1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsY2xpZW50U291cmNlSWQ6ZGF0YS5jbGllbnRTb3VyY2VJZCxzZWdOaWdodHM6ZGF0YS5zZWdOaWdodHMsXHJcbiAgICAgICAgICAgIGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LCBjdXJlbmN5OiBkYXRhLmN1cmVuY3ksZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLFxyXG4gICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgb3JpZ2luOiB0Lm9yaWdpbiwgb3JpZ2luRGV0YWlsczogdC5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSksIH07XHJcbiAgICAgICAgZGF0YS5jdXJyZW50Q2FydERldGFpbHM9IGRldGFpbHM7XHJcbiAgICAgICAgZGF0YS5jYXJ0cz1bXTtcclxuICAgICAgICBkYXRhLmNhcnRzLnB1c2goZGV0YWlscyk7XHJcbiAgICAgICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gZGV0YWlscy5pZDtcclxuIC8vICAgY29uc29sZS5sb2coZGF0YS5jdXJyZW50Q2FydERldGFpbHMpO1xyXG4gICAgZGF0YS5zdW1tYXJ5ID0gZmFsc2U7XHJcbiAgICBkYXRhLnByaW50ID0gZmFsc2U7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSBmYWxzZTtcclxuICAgIGRhdGEuYW1lbmQgPSBmYWxzZTtcclxuICAgIGRhdGEuY2FuY2VsID0gZmFsc2U7XHJcbiAgICBkYXRhLnJlc2NoZWR1bGUgPSBmYWxzZTtcclxuICAgXHJcbiAgICBkYXRhLmVycm9ycyA9IHt9O1xyXG4gICAgZGF0YS5yZXN1bHRzID0gW107XHJcblxyXG4gICAgZGF0YS5maWx0ZXIgPSB7fTtcclxuICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuICAgIHJldHVybiByZXNvbHZlKG5ldyBNeWJvb2tpbmdEYXRhKHtkYXRhOiBkYXRhfSkpO1xyXG5cclxuICAgICAgICBcclxuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH0pXHJcbiAgICB9KTtcclxufTtcclxuXHJcbk15Ym9va2luZ0RhdGEucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIk15Ym9va2luZ0RhdGEucGFyc2VcIik7XHJcbiAgICAvL2RhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gRmxpZ2h0LnBhcnNlKGkpOyB9KTtcclxuICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7ICAgXHJcbiAgICB2YXIgZmxnVXBjb21pbmcgPSBmYWxzZTtcclxuICAgIHZhciBmbGdQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYXJ0cyA9IF8ubWFwKGRhdGEsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgaWYgKGkudXBjb21pbmcgPT0gJ3RydWUnKVxyXG4gICAgICAgICAgICBmbGdVcGNvbWluZyA9IHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmbGdQcmV2aW91cyA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHtpZDogaS5pZCxlbWFpbDppLmVtYWlsLCBjcmVhdGVkOiBpLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBpLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogaS5ib29raW5nX3N0YXR1cyxcclxuICAgICAgICAgICAgcmV0dXJuZGF0ZTogaS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogaS5pc011bHRpQ2l0eSwgY3VyZW5jeTogaS5jdXJlbmN5LCB1cGNvbWluZzogaS51cGNvbWluZyxcclxuICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGkuYm9va2luZ3MsIGZ1bmN0aW9uIChiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogYi5pZCwgc291cmNlOiBiLnNvdXJjZSwgZGVzdGluYXRpb246IGIuZGVzdGluYXRpb24sIHNvdXJjZV9pZDogYi5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBiLmRlc3RpbmF0aW9uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZTogYi5kZXBhcnR1cmUsIGFycml2YWw6IGIuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxlcnM6IF8ubWFwKGIudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiB0LmlkLCBuYW1lOiB0Lm5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0cmF2ZWxlcjogXy5tYXAoaS50cmF2ZWxsZXJkdGwsIGZ1bmN0aW9uIChqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBqLmlkLCBuYW1lOiBqLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBfLm1hcChqLnNyYywgZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBnfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBfLm1hcChqLmRlc3QsIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZTogZ307XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLmNhcnRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICBpZiAoeC5pZCA8IHkuaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG5cclxuICAgIH0pO1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmNhcnRzKTsgIFxyXG4gICAgLy8gICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVyPSBfLmZpcnN0KGRhdGEudHJhdmVsbGVycyk7XHJcbiAgICAvLyAgICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVySWQ9ZGF0YS5jdXJyZW50VHJhdmVsbGVyLmlkO1xyXG4gICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gbnVsbDtcclxuICAgIGRhdGEuY3VycmVudENhcnREZXRhaWxzID0gbnVsbDtcclxuICAgIGRhdGEuc3VtbWFyeSA9IHRydWU7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSB0cnVlO1xyXG4gICAgZGF0YS5hbWVuZCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYW5jZWwgPSBmYWxzZTtcclxuICAgIGRhdGEucHJpbnQgPSBmYWxzZTtcclxuICAgIGRhdGEucmVzY2hlZHVsZSA9IGZhbHNlO1xyXG4gICAgZGF0YS5mbGdVcGNvbWluZyA9IGZsZ1VwY29taW5nO1xyXG4gICAgZGF0YS5mbGdQcmV2aW91cyA9IGZsZ1ByZXZpb3VzO1xyXG4gICAgZGF0YS5lcnJvcnMgPSB7fTtcclxuICAgIGRhdGEucmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGRhdGEuZmlsdGVyID0ge307XHJcbiAgICBkYXRhLmZpbHRlcmVkID0ge307XHJcbiAgICByZXR1cm4gbmV3IE15Ym9va2luZ0RhdGEoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcbk15Ym9va2luZ0RhdGEuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiTXlib29raW5nRGF0YS5mZXRjaFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9haXJDYXJ0L2dldE15Qm9va2luZ3MnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKE15Ym9va2luZ0RhdGEucGFyc2UoZGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE15Ym9va2luZ0RhdGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuanNcbiAqKiBtb2R1bGUgaWQgPSA2MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgNCA1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICB2YWxpZGF0ZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3RvcmUuZXh0ZW5kKHtcclxuICAgIHF1ZW5lOiBbXSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgZ2V0RGF0YT1mdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgZ2V0RGF0YTE9ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGRvYWpheD1mdW5jdGlvbihnZXREYXRhKXtcclxuICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdiMmMvdHJhdmVsZXIvZ2V0TXlUcmF2ZWxlcnNMaXN0JywgIFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZ2V0RGF0YSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBnZXREYXRhMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAgICAgZG9hamF4KGdldERhdGEpO1xyXG4gICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN1cnJlbnRUcmF2ZWxsZXI6IHtpZDogMSx0aXRsZTonTXIuJywgZW1haWw6ICdwcmFzaGFudEBnbWFpbC5jb20nLCBtb2JpbGU6ICc5NDEyMzU3OTI2JywgIGZpcnN0X25hbWU6ICdQcmFzaGFudCcsIFxyXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOidLdW1hcicsYmlydGhkYXRlOicyMDAxLTA1LTMwJyxiYXNlVXJsOicnLHBhc3Nwb3J0X251bWJlcjonMzQyMTIzJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGN1cnJlbnRUcmF2ZWxsZXJJZDoxLFxyXG4gICAgICAgICAgICBjYWJpblR5cGU6IDEsXHJcbiAgICAgICAgICAgIGFkZDpmYWxzZSxcclxuICAgICAgICAgICAgZWRpdDpmYWxzZSxcclxuICAgICAgICAgICAgdGl0bGVzOlt7aWQ6MSx0ZXh0OidNci4nfSx7aWQ6Mix0ZXh0OidNcnMuJ30se2lkOjMsdGV4dDonTXMuJ30se2lkOjQsdGV4dDonTWlzcyd9LHtpZDo1LHRleHQ6J01zdHIuJ30se2lkOjYsdGV4dDonSW5mLid9XSxcclxuICAgICAgICAgICAgcGFzc2VuZ2VyczogWzEsIDAsIDBdLFxyXG4gICAgICAgICAgICB0cmF2ZWxsZXJzOiBbXHJcbiAgICAgICAgICAgICAgICB7IGlkOiAxLHRpdGxlOidNci4nLCBlbWFpbDogJ3ByYXNoYW50QGdtYWlsLmNvbScsIG1vYmlsZTogJzk0MTIzNTc5MjYnLHBhc3Nwb3J0X251bWJlcjonMjU0MjM0MicscGFzc3BvcnRfcGxhY2U6J0luZGlhJywgXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogJ1ByYXNoYW50JywgbGFzdF9uYW1lOidLdW1hcicsYmlydGhkYXRlOicyMDAxLTA1LTMwJyxiYXNlVXJsOicnfSxcclxuICAgICAgICAgICAgICAgIHsgaWQ6IDIsdGl0bGU6J01yLicsIGVtYWlsOiAnTWljaGFlbEBnbWFpbC5jb20nLCBtb2JpbGU6ICcxMjM0NTY3ODkwJyxwYXNzcG9ydF9udW1iZXI6JzMxMjMxMjMnLHBhc3Nwb3J0X3BsYWNlOidJbmRpYScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6ICdNaWNoYWVsJywgbGFzdF9uYW1lOidKYWluJyxiaXJ0aGRhdGU6JzIwMDUtMDMtMDMnLGJhc2VVcmw6Jyd9LFxyXG4gICAgICAgICAgICAgICAgeyBpZDogMyx0aXRsZTonTXIuJywgZW1haWw6ICdiZWxhaXJAZ21haWwuY29tJywgbW9iaWxlOiAnMTIzNDU2Nzg5MCcscGFzc3BvcnRfbnVtYmVyOicxMjMxMjMxJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6ICdCZWxhaXInLCBsYXN0X25hbWU6J1RyYXZlbHMnLGJpcnRoZGF0ZTonMjAwMi0wMi0yMCcsYmFzZVVybDonJ31cclxuICAgICAgICAgICAgXSxcclxuXHJcbiAgICAgICAgICAgIHBlbmRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBlcnJvcnM6IHt9LFxyXG4gICAgICAgICAgICByZXN1bHRzOiBbXSxcclxuXHJcbiAgICAgICAgICAgIGZpbHRlcjoge30sXHJcbiAgICAgICAgICAgIGZpbHRlcmVkOiB7fSxcclxuICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFxyXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICBpZih0aGlzLmdldCgpLmFkZCl7ICAgICAgICBcclxuICAgICAgICB2YXIgbmV3dHJhdmVsbGVyPV8ucGljayh0aGlzLmdldCgpLCAnY3VycmVudFRyYXZlbGxlcicpOyBcclxuICAgICAgICB2YXIgdHJhdmVsbGVycz10aGlzLmdldCgpLnRyYXZlbGxlcnM7XHJcbiAgICAgICAgdmFyIHQ9bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIudGl0bGU7XHJcbiAgICAgICAgdmFyIHRpdGxlcz1fLmNsb25lRGVlcCh0aGlzLmdldCgpLnRpdGxlcyk7XHJcbiAgICAgICAgdmFyIHRpdGxlO1xyXG4gICAgICAgICBfLmVhY2godGl0bGVzLCBmdW5jdGlvbihpLCBrKSB7IGlmIChpLmlkPT10KSB0aXRsZT1pLnRleHQ7IH0pO1xyXG4gICAgICBcclxuICAgICAgICB2YXIgY3VycmVudHRyYXZlbGxlcj17aWQ6IDQsdGl0bGU6dGl0bGUsIGVtYWlsOiBuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5lbWFpbCwgbW9iaWxlOiBuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5tb2JpbGUsICBmaXJzdF9uYW1lOiBuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5maXJzdF9uYW1lLCBcclxuICAgICAgICAgICAgICAgIGxhc3RfbmFtZTpuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5sYXN0X25hbWUsYmlydGhkYXRlOm5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSxiYXNlVXJsOicnLHBhc3Nwb3J0X251bWJlcjpuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5wYXNzcG9ydF9udW1iZXIscGFzc3BvcnRfcGxhY2U6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfcGxhY2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB0cmF2ZWxsZXJzLnB1c2goY3VycmVudHRyYXZlbGxlcik7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0cmF2ZWxsZXJzKTtcclxuICAgICAgICB0aGlzLnNldCgndHJhdmVsbGVycycsdHJhdmVsbGVycyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50VHJhdmVsbGVySWQnLDQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZih0aGlzLmdldCgpLmVkaXQpe1xyXG4gICAgICAgIHZhciBuZXd0cmF2ZWxsZXI9dGhpcy5nZXQoKS5jdXJyZW50VHJhdmVsbGVyOyBcclxuICAgICAgICB2YXIgdHJhdmVsbGVycz10aGlzLmdldCgpLnRyYXZlbGxlcnM7XHJcbiAgICAgICAgdmFyIHQ9bmV3dHJhdmVsbGVyLnRpdGxlO1xyXG4gICAgICAgIHZhciB0aXRsZXM9Xy5jbG9uZURlZXAodGhpcy5nZXQoKS50aXRsZXMpO1xyXG4gICAgICAgIHZhciB0aXRsZTtcclxuICAgICAgICB2YXIgaWQ9dGhpcy5nZXQoKS5jdXJyZW50VHJhdmVsbGVySWQ7XHJcbiAgICAgICAgIF8uZWFjaCh0aXRsZXMsIGZ1bmN0aW9uKGksIGspIHsgY29uc29sZS5sb2coaSk7IGlmIChpLmlkPT10KSB0aXRsZT1pLnRleHQ7IH0pO1xyXG4gICAgICBcclxuICAgICAgICB2YXIgY3VycmVudHRyYXZlbGxlcj17aWQ6IGlkLHRpdGxlOnRpdGxlLCBlbWFpbDogbmV3dHJhdmVsbGVyLmVtYWlsLCBtb2JpbGU6IG5ld3RyYXZlbGxlci5tb2JpbGUsICBmaXJzdF9uYW1lOiBuZXd0cmF2ZWxsZXIuZmlyc3RfbmFtZSwgXHJcbiAgICAgICAgICAgICAgICBsYXN0X25hbWU6bmV3dHJhdmVsbGVyLmxhc3RfbmFtZSxiaXJ0aGRhdGU6bmV3dHJhdmVsbGVyLmJpcnRoZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSxiYXNlVXJsOicnLHBhc3Nwb3J0X251bWJlcjpuZXd0cmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyLHBhc3Nwb3J0X3BsYWNlOm5ld3RyYXZlbGxlci5wYXNzcG9ydF9wbGFjZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIHZhciBpbmRleD0gXy5maW5kSW5kZXgodGhpcy5nZXQoKS50cmF2ZWxsZXJzLCB7ICdpZCc6IGlkfSk7XHJcbiAgICAgICAgdGhpcy5zcGxpY2UoJ3RyYXZlbGxlcnMnLCBpbmRleCwgMSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudHRyYXZlbGxlcik7XHJcbiAgICAgICAgdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsbGVycyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3RyYXZlbGxlcnMnLHRyYXZlbGxlcnMpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxjdXJyZW50dHJhdmVsbGVyKTsgICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgIHRoaXMuc2V0KCdhZGQnLGZhbHNlKTsgXHJcbiAgICAgICAgdGhpcy5zZXQoJ2VkaXQnLGZhbHNlKTsgXHJcbiAgICAgICAgLy8sXHJcbiAgICAgLyogICAgICAgc2VhcmNoID0gXy5waWNrKHRoaXMuZ2V0KCksIFsndHJpcFR5cGUnLCAnY2FiaW5UeXBlJywgJ3Bhc3NlbmdlcnMnXSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCB7fSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3BlbmRpbmcnLCB0cnVlKTtcclxuICAgICAgICB0aGlzLnF1ZW5lID0gW107XHJcblxyXG5cclxuICAgICAgICBfLmVhY2godGhpcy5nZXQoJ2ZsaWdodHMnKSwgZnVuY3Rpb24oaSwgaykge1xyXG4gICAgICAgICAgICB2aWV3LnF1ZW5lW3ZpZXcucXVlbmUubGVuZ3RoXSA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2ZsaWdodHMvc2VhcmNoJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IF8uZXh0ZW5kKHt9LCBzZWFyY2gsIHtcclxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBpLmZyb20sXHJcbiAgICAgICAgICAgICAgICAgICAgdG86IGkudG8sXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0X2F0OiBtb21lbnQuaXNNb21lbnQoaS5kZXBhcnRfYXQpID8gaS5kZXBhcnRfYXQuZm9ybWF0KCdZWVlZLU1NLUREJykgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybl9hdDogbW9tZW50LmlzTW9tZW50KGkucmV0dXJuX2F0KSA/IGkucmV0dXJuX2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyB2aWV3LmltcG9ydFJlc3VsdHMoaywgZGF0YSk7IH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7IHZpZXcuaGFuZGxlRXJyb3IoaywgeGhyKTsgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkLndoZW4uYXBwbHkodW5kZWZpbmVkLCB0aGlzLnF1ZW5lKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbigpIHsgdmlldy5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7IHZpZXcuc2V0KCdmaW5pc2hlZCcsIHRydWUpOyB9KTsgKi9cclxuICAgIH0sXHJcblxyXG4gICAgaW1wb3J0UmVzdWx0czogZnVuY3Rpb24oaywgZGF0YSkge1xyXG4gICAgICAgIHRoaXMuc2V0KCdmaWx0ZXJlZCcsIHt9KTtcclxuICAgICAgICB0aGlzLnNldCgncmVzdWx0cy4nICsgaywgZGF0YSk7XHJcblxyXG4gICAgICAgIHZhciBwcmljZXMgPSBbXSxcclxuICAgICAgICAgICAgY2FycmllcnMgPSBbXTtcclxuXHJcbiAgICAgICAgXy5lYWNoKGRhdGEsIGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgcHJpY2VzW3ByaWNlcy5sZW5ndGhdID0gaS5wcmljZTtcclxuICAgICAgICAgICAgY2FycmllcnNbY2FycmllcnMubGVuZ3RoXSA9IGkuaXRpbmVyYXJ5WzBdLnNlZ21lbnRzWzBdLmNhcnJpZXI7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBjYXJyaWVycyA9IF8udW5pcXVlKGNhcnJpZXJzLCAnY29kZScpO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyJywge1xyXG4gICAgICAgICAgICBwcmljZXM6IFtNYXRoLm1pbi5hcHBseShudWxsLCBwcmljZXMpLCBNYXRoLm1heC5hcHBseShudWxsLCBwcmljZXMpXSxcclxuICAgICAgICAgICAgY2FycmllcnM6IGNhcnJpZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdmaWx0ZXJlZC5jYXJyaWVycycsIF8ubWFwKGNhcnJpZXJzLCBmdW5jdGlvbihpKSB7IHJldHVybiBpLmNvZGU7IH0pKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKGssIHhocikge1xyXG5cclxuICAgIH1cclxuXHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyLmpzXG4gKiogbW9kdWxlIGlkID0gNjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDdcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKVxyXG4gICAgO1xyXG5cclxudmFyIERpYWxvZyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZy5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaGVhZGVyOiAnaGVhZGVyJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ21lc3NhZ2UnLFxyXG4gICAgICAgICAgICBidXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICBbJ09rJywgZnVuY3Rpb24oKSB7IGFsZXJ0KCd6enonKTsgfV0sXHJcbiAgICAgICAgICAgICAgICBbJ0NhbmNlbCcsIGZ1bmN0aW9uKCkgeyBhbGVydCgneXl5JykgfV1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGljazogZnVuY3Rpb24oZXZlbnQsIGNiKSB7XHJcbiAgICAgICAgY2IuYmluZCh0aGlzKShldmVudCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbkRpYWxvZy5vcGVuID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdmFyIGRpYWxvZyA9IG5ldyBEaWFsb2coKTtcclxuICAgIGRpYWxvZy5zZXQob3B0aW9ucyk7XHJcbiAgICBkaWFsb2cucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpYWxvZztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvZGlhbG9nLmpzXG4gKiogbW9kdWxlIGlkID0gNjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpICBzbWFsbCBtb2RhbFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJoZWFkZXJcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInJcIjpcIm1lc3NhZ2VcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25zXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYnV0dG9uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiY2xpY2tcIixcImFcIjp7XCJyXCI6W1wiZXZlbnRcIixcIi4vMVwiXSxcInNcIjpcIltfMCxfMV1cIn19fSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuLzBcIn1dfV0sXCJuXCI6NTIsXCJyXCI6XCJidXR0b25zXCJ9XX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZy5odG1sXG4gKiogbW9kdWxlIGlkID0gNjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGFjY291bnRpbmcgPSByZXF1aXJlKCdhY2NvdW50aW5nLmpzJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYW1vdW50KSB7XHJcbiAgICBpZiAoTWV0YS5vYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gYWNjb3VudGluZy5mb3JtYXRNb25leShcclxuICAgICAgICAgICAgYW1vdW50ICogTWV0YS5vYmplY3QuZ2V0KCd4Q2hhbmdlJylbTWV0YS5vYmplY3QuZ2V0KCdkaXNwbGF5X2N1cnJlbmN5JyldLFxyXG4gICAgICAgICAgICAnPGkgY2xhc3M9XCInICsgTWV0YS5vYmplY3QuZ2V0KCdkaXNwbGF5X2N1cnJlbmN5JykudG9Mb3dlckNhc2UoKSAgKyAnIGljb24gY3VycmVuY3lcIj48L2k+JyxcclxuICAgICAgICAgICAgMFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoYW1vdW50LCAnPGkgY2xhc3M9XCJpbnIgaWNvbiBjdXJyZW5jeVwiPjwvaT4nLCAwKTtcclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvaGVscGVycy9tb25leS5qc1xuICoqIG1vZHVsZSBpZCA9IDY3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA4XG4gKiovIiwiLyohXG4gKiBhY2NvdW50aW5nLmpzIHYwLjMuMlxuICogQ29weXJpZ2h0IDIwMTEsIEpvc3MgQ3Jvd2Nyb2Z0XG4gKlxuICogRnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogUG9ydGlvbnMgb2YgYWNjb3VudGluZy5qcyBhcmUgaW5zcGlyZWQgb3IgYm9ycm93ZWQgZnJvbSB1bmRlcnNjb3JlLmpzXG4gKlxuICogRnVsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuICogaHR0cDovL2pvc3Njcm93Y3JvZnQuZ2l0aHViLmNvbS9hY2NvdW50aW5nLmpzL1xuICovXG5cbihmdW5jdGlvbihyb290LCB1bmRlZmluZWQpIHtcblxuXHQvKiAtLS0gU2V0dXAgLS0tICovXG5cblx0Ly8gQ3JlYXRlIHRoZSBsb2NhbCBsaWJyYXJ5IG9iamVjdCwgdG8gYmUgZXhwb3J0ZWQgb3IgcmVmZXJlbmNlZCBnbG9iYWxseSBsYXRlclxuXHR2YXIgbGliID0ge307XG5cblx0Ly8gQ3VycmVudCB2ZXJzaW9uXG5cdGxpYi52ZXJzaW9uID0gJzAuMy4yJztcblxuXG5cdC8qIC0tLSBFeHBvc2VkIHNldHRpbmdzIC0tLSAqL1xuXG5cdC8vIFRoZSBsaWJyYXJ5J3Mgc2V0dGluZ3MgY29uZmlndXJhdGlvbiBvYmplY3QuIENvbnRhaW5zIGRlZmF1bHQgcGFyYW1ldGVycyBmb3Jcblx0Ly8gY3VycmVuY3kgYW5kIG51bWJlciBmb3JtYXR0aW5nXG5cdGxpYi5zZXR0aW5ncyA9IHtcblx0XHRjdXJyZW5jeToge1xuXHRcdFx0c3ltYm9sIDogXCIkXCIsXHRcdC8vIGRlZmF1bHQgY3VycmVuY3kgc3ltYm9sIGlzICckJ1xuXHRcdFx0Zm9ybWF0IDogXCIlcyV2XCIsXHQvLyBjb250cm9scyBvdXRwdXQ6ICVzID0gc3ltYm9sLCAldiA9IHZhbHVlIChjYW4gYmUgb2JqZWN0LCBzZWUgZG9jcylcblx0XHRcdGRlY2ltYWwgOiBcIi5cIixcdFx0Ly8gZGVjaW1hbCBwb2ludCBzZXBhcmF0b3Jcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXHRcdC8vIHRob3VzYW5kcyBzZXBhcmF0b3Jcblx0XHRcdHByZWNpc2lvbiA6IDIsXHRcdC8vIGRlY2ltYWwgcGxhY2VzXG5cdFx0XHRncm91cGluZyA6IDNcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0fSxcblx0XHRudW1iZXI6IHtcblx0XHRcdHByZWNpc2lvbiA6IDAsXHRcdC8vIGRlZmF1bHQgcHJlY2lzaW9uIG9uIG51bWJlcnMgaXMgMFxuXHRcdFx0Z3JvdXBpbmcgOiAzLFx0XHQvLyBkaWdpdCBncm91cGluZyAobm90IGltcGxlbWVudGVkIHlldClcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXG5cdFx0XHRkZWNpbWFsIDogXCIuXCJcblx0XHR9XG5cdH07XG5cblxuXHQvKiAtLS0gSW50ZXJuYWwgSGVscGVyIE1ldGhvZHMgLS0tICovXG5cblx0Ly8gU3RvcmUgcmVmZXJlbmNlIHRvIHBvc3NpYmx5LWF2YWlsYWJsZSBFQ01BU2NyaXB0IDUgbWV0aG9kcyBmb3IgbGF0ZXJcblx0dmFyIG5hdGl2ZU1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAsXG5cdFx0bmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanNcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuXHRcdHJldHVybiAhIShvYmogPT09ICcnIHx8IChvYmogJiYgb2JqLmNoYXJDb2RlQXQgJiYgb2JqLnN1YnN0cikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgc3RyaW5nXG5cdCAqIGZyb20gdW5kZXJzY29yZS5qcywgZGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUlzQXJyYXkgPyBuYXRpdmVJc0FycmF5KG9iaikgOiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSB0cnVlIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG5cdFx0cmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBhIGRlZmF1bHRzIG9iamVjdCwgc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgXy5kZWZhdWx0c1xuXHQgKlxuXHQgKiBVc2VkIGZvciBhYnN0cmFjdGluZyBwYXJhbWV0ZXIgaGFuZGxpbmcgZnJvbSBBUEkgbWV0aG9kc1xuXHQgKi9cblx0ZnVuY3Rpb24gZGVmYXVsdHMob2JqZWN0LCBkZWZzKSB7XG5cdFx0dmFyIGtleTtcblx0XHRvYmplY3QgPSBvYmplY3QgfHwge307XG5cdFx0ZGVmcyA9IGRlZnMgfHwge307XG5cdFx0Ly8gSXRlcmF0ZSBvdmVyIG9iamVjdCBub24tcHJvdG90eXBlIHByb3BlcnRpZXM6XG5cdFx0Zm9yIChrZXkgaW4gZGVmcykge1xuXHRcdFx0aWYgKGRlZnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHQvLyBSZXBsYWNlIHZhbHVlcyB3aXRoIGRlZmF1bHRzIG9ubHkgaWYgdW5kZWZpbmVkIChhbGxvdyBlbXB0eS96ZXJvIHZhbHVlcyk6XG5cdFx0XHRcdGlmIChvYmplY3Rba2V5XSA9PSBudWxsKSBvYmplY3Rba2V5XSA9IGRlZnNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRhdGlvbiBvZiBgQXJyYXkubWFwKClgIGZvciBpdGVyYXRpb24gbG9vcHNcblx0ICpcblx0ICogUmV0dXJucyBhIG5ldyBBcnJheSBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBpdGVyYXRvcmAgb24gZWFjaCBhcnJheSB2YWx1ZS5cblx0ICogRGVmZXJzIHRvIG5hdGl2ZSBBcnJheS5tYXAgaWYgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuXHRcdHZhciByZXN1bHRzID0gW10sIGksIGo7XG5cblx0XHRpZiAoIW9iaikgcmV0dXJuIHJlc3VsdHM7XG5cblx0XHQvLyBVc2UgbmF0aXZlIC5tYXAgbWV0aG9kIGlmIGl0IGV4aXN0czpcblx0XHRpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuXG5cdFx0Ly8gRmFsbGJhY2sgZm9yIG5hdGl2ZSAubWFwOlxuXHRcdGZvciAoaSA9IDAsIGogPSBvYmoubGVuZ3RoOyBpIDwgajsgaSsrICkge1xuXHRcdFx0cmVzdWx0c1tpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBhbmQgbm9ybWFsaXNlIHRoZSB2YWx1ZSBvZiBwcmVjaXNpb24gKG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlcilcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrUHJlY2lzaW9uKHZhbCwgYmFzZSkge1xuXHRcdHZhbCA9IE1hdGgucm91bmQoTWF0aC5hYnModmFsKSk7XG5cdFx0cmV0dXJuIGlzTmFOKHZhbCk/IGJhc2UgOiB2YWw7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBmb3JtYXQgc3RyaW5nIG9yIG9iamVjdCBhbmQgcmV0dXJucyBmb3JtYXQgb2JqIGZvciB1c2UgaW4gcmVuZGVyaW5nXG5cdCAqXG5cdCAqIGBmb3JtYXRgIGlzIGVpdGhlciBhIHN0cmluZyB3aXRoIHRoZSBkZWZhdWx0IChwb3NpdGl2ZSkgZm9ybWF0LCBvciBvYmplY3Rcblx0ICogY29udGFpbmluZyBgcG9zYCAocmVxdWlyZWQpLCBgbmVnYCBhbmQgYHplcm9gIHZhbHVlcyAob3IgYSBmdW5jdGlvbiByZXR1cm5pbmdcblx0ICogZWl0aGVyIGEgc3RyaW5nIG9yIG9iamVjdClcblx0ICpcblx0ICogRWl0aGVyIHN0cmluZyBvciBmb3JtYXQucG9zIG11c3QgY29udGFpbiBcIiV2XCIgKHZhbHVlKSB0byBiZSB2YWxpZFxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDdXJyZW5jeUZvcm1hdChmb3JtYXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0O1xuXG5cdFx0Ly8gQWxsb3cgZnVuY3Rpb24gYXMgZm9ybWF0IHBhcmFtZXRlciAoc2hvdWxkIHJldHVybiBzdHJpbmcgb3Igb2JqZWN0KTpcblx0XHRpZiAoIHR5cGVvZiBmb3JtYXQgPT09IFwiZnVuY3Rpb25cIiApIGZvcm1hdCA9IGZvcm1hdCgpO1xuXG5cdFx0Ly8gRm9ybWF0IGNhbiBiZSBhIHN0cmluZywgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIChcIiV2XCIpIG11c3QgYmUgcHJlc2VudDpcblx0XHRpZiAoIGlzU3RyaW5nKCBmb3JtYXQgKSAmJiBmb3JtYXQubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGFuZCByZXR1cm4gcG9zaXRpdmUsIG5lZ2F0aXZlIGFuZCB6ZXJvIGZvcm1hdHM6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwb3MgOiBmb3JtYXQsXG5cdFx0XHRcdG5lZyA6IGZvcm1hdC5yZXBsYWNlKFwiLVwiLCBcIlwiKS5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBmb3JtYXRcblx0XHRcdH07XG5cblx0XHQvLyBJZiBubyBmb3JtYXQsIG9yIG9iamVjdCBpcyBtaXNzaW5nIHZhbGlkIHBvc2l0aXZlIHZhbHVlLCB1c2UgZGVmYXVsdHM6XG5cdFx0fSBlbHNlIGlmICggIWZvcm1hdCB8fCAhZm9ybWF0LnBvcyB8fCAhZm9ybWF0LnBvcy5tYXRjaChcIiV2XCIpICkge1xuXG5cdFx0XHQvLyBJZiBkZWZhdWx0cyBpcyBhIHN0cmluZywgY2FzdHMgaXQgdG8gYW4gb2JqZWN0IGZvciBmYXN0ZXIgY2hlY2tpbmcgbmV4dCB0aW1lOlxuXHRcdFx0cmV0dXJuICggIWlzU3RyaW5nKCBkZWZhdWx0cyApICkgPyBkZWZhdWx0cyA6IGxpYi5zZXR0aW5ncy5jdXJyZW5jeS5mb3JtYXQgPSB7XG5cdFx0XHRcdHBvcyA6IGRlZmF1bHRzLFxuXHRcdFx0XHRuZWcgOiBkZWZhdWx0cy5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBkZWZhdWx0c1xuXHRcdFx0fTtcblxuXHRcdH1cblx0XHQvLyBPdGhlcndpc2UsIGFzc3VtZSBmb3JtYXQgd2FzIGZpbmU6XG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fVxuXG5cblx0LyogLS0tIEFQSSBNZXRob2RzIC0tLSAqL1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIHN0cmluZy9hcnJheSBvZiBzdHJpbmdzLCByZW1vdmVzIGFsbCBmb3JtYXR0aW5nL2NydWZ0IGFuZCByZXR1cm5zIHRoZSByYXcgZmxvYXQgdmFsdWVcblx0ICogYWxpYXM6IGFjY291bnRpbmcuYHBhcnNlKHN0cmluZylgXG5cdCAqXG5cdCAqIERlY2ltYWwgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGZsb2F0cyAoZGVmYXVsdDogXCIuXCIpLCBzbyBpZiB0aGUgbnVtYmVyXG5cdCAqIHVzZXMgYSBub24tc3RhbmRhcmQgZGVjaW1hbCBzZXBhcmF0b3IsIHByb3ZpZGUgaXQgYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0ICpcblx0ICogQWxzbyBtYXRjaGVzIGJyYWNrZXRlZCBuZWdhdGl2ZXMgKGVnLiBcIiQgKDEuOTkpXCIgPT4gLTEuOTkpXG5cdCAqXG5cdCAqIERvZXNuJ3QgdGhyb3cgYW55IGVycm9ycyAoYE5hTmBzIGJlY29tZSAwKSBidXQgdGhpcyBtYXkgY2hhbmdlIGluIGZ1dHVyZVxuXHQgKi9cblx0dmFyIHVuZm9ybWF0ID0gbGliLnVuZm9ybWF0ID0gbGliLnBhcnNlID0gZnVuY3Rpb24odmFsdWUsIGRlY2ltYWwpIHtcblx0XHQvLyBSZWN1cnNpdmVseSB1bmZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZm9ybWF0KHZhbCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBGYWlscyBzaWxlbnRseSAobmVlZCBkZWNlbnQgZXJyb3JzKTpcblx0XHR2YWx1ZSA9IHZhbHVlIHx8IDA7XG5cblx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGFzLWlzIGlmIGl0J3MgYWxyZWFkeSBhIG51bWJlcjpcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gdmFsdWU7XG5cblx0XHQvLyBEZWZhdWx0IGRlY2ltYWwgcG9pbnQgaXMgXCIuXCIgYnV0IGNvdWxkIGJlIHNldCB0byBlZy4gXCIsXCIgaW4gb3B0czpcblx0XHRkZWNpbWFsID0gZGVjaW1hbCB8fCBcIi5cIjtcblxuXHRcdCAvLyBCdWlsZCByZWdleCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBleGNlcHQgZGlnaXRzLCBkZWNpbWFsIHBvaW50IGFuZCBtaW51cyBzaWduOlxuXHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXjAtOS1cIiArIGRlY2ltYWwgKyBcIl1cIiwgW1wiZ1wiXSksXG5cdFx0XHR1bmZvcm1hdHRlZCA9IHBhcnNlRmxvYXQoXG5cdFx0XHRcdChcIlwiICsgdmFsdWUpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCgoLiopXFwpLywgXCItJDFcIikgLy8gcmVwbGFjZSBicmFja2V0ZWQgdmFsdWVzIHdpdGggbmVnYXRpdmVzXG5cdFx0XHRcdC5yZXBsYWNlKHJlZ2V4LCAnJykgICAgICAgICAvLyBzdHJpcCBvdXQgYW55IGNydWZ0XG5cdFx0XHRcdC5yZXBsYWNlKGRlY2ltYWwsICcuJykgICAgICAvLyBtYWtlIHN1cmUgZGVjaW1hbCBwb2ludCBpcyBzdGFuZGFyZFxuXHRcdFx0KTtcblxuXHRcdC8vIFRoaXMgd2lsbCBmYWlsIHNpbGVudGx5IHdoaWNoIG1heSBjYXVzZSB0cm91YmxlLCBsZXQncyB3YWl0IGFuZCBzZWU6XG5cdFx0cmV0dXJuICFpc05hTih1bmZvcm1hdHRlZCkgPyB1bmZvcm1hdHRlZCA6IDA7XG5cdH07XG5cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcblx0ICpcblx0ICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gXCIwLjYxXCIpIHRoYXQgcHJlc2VudFxuXHQgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cblx0ICovXG5cdHZhciB0b0ZpeGVkID0gbGliLnRvRml4ZWQgPSBmdW5jdGlvbih2YWx1ZSwgcHJlY2lzaW9uKSB7XG5cdFx0cHJlY2lzaW9uID0gY2hlY2tQcmVjaXNpb24ocHJlY2lzaW9uLCBsaWIuc2V0dGluZ3MubnVtYmVyLnByZWNpc2lvbik7XG5cdFx0dmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG5cblx0XHQvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcblx0XHRyZXR1cm4gKE1hdGgucm91bmQobGliLnVuZm9ybWF0KHZhbHVlKSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyLCB3aXRoIGNvbW1hLXNlcGFyYXRlZCB0aG91c2FuZHMgYW5kIGN1c3RvbSBwcmVjaXNpb24vZGVjaW1hbCBwbGFjZXNcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgcHJlY2lzaW9uIGFuZCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9yc1xuXHQgKiAybmQgcGFyYW1ldGVyIGBwcmVjaXNpb25gIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLm51bWJlcmBcblx0ICovXG5cdHZhciBmb3JtYXROdW1iZXIgPSBsaWIuZm9ybWF0TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiBmb3JtYXROdW1iZXIodmFsLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChwcmVjaXNpb24pID8gcHJlY2lzaW9uIDoge1xuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MubnVtYmVyXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDbGVhbiB1cCBwcmVjaXNpb25cblx0XHRcdHVzZVByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSxcblxuXHRcdFx0Ly8gRG8gc29tZSBjYWxjOlxuXHRcdFx0bmVnYXRpdmUgPSBudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiLFxuXHRcdFx0YmFzZSA9IHBhcnNlSW50KHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyIHx8IDApLCB1c2VQcmVjaXNpb24pLCAxMCkgKyBcIlwiLFxuXHRcdFx0bW9kID0gYmFzZS5sZW5ndGggPiAzID8gYmFzZS5sZW5ndGggJSAzIDogMDtcblxuXHRcdC8vIEZvcm1hdCB0aGUgbnVtYmVyOlxuXHRcdHJldHVybiBuZWdhdGl2ZSArIChtb2QgPyBiYXNlLnN1YnN0cigwLCBtb2QpICsgb3B0cy50aG91c2FuZCA6IFwiXCIpICsgYmFzZS5zdWJzdHIobW9kKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgb3B0cy50aG91c2FuZCkgKyAodXNlUHJlY2lzaW9uID8gb3B0cy5kZWNpbWFsICsgdG9GaXhlZChNYXRoLmFicyhudW1iZXIpLCB1c2VQcmVjaXNpb24pLnNwbGl0KCcuJylbMV0gOiBcIlwiKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBudW1iZXIgaW50byBjdXJyZW5jeVxuXHQgKlxuXHQgKiBVc2FnZTogYWNjb3VudGluZy5mb3JtYXRNb25leShudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZHNTZXAsIGRlY2ltYWxTZXAsIGZvcm1hdClcblx0ICogZGVmYXVsdHM6ICgwLCBcIiRcIiwgMiwgXCIsXCIsIFwiLlwiLCBcIiVzJXZcIilcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kIC8gZGVjaW1hbCBzZXBhcmF0b3JzIGFuZCBmb3JtYXRcblx0ICogU2Vjb25kIHBhcmFtIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLmN1cnJlbmN5YCB3aGljaCBpcyB0aGUgZWFzaWVzdCB3YXkuXG5cdCAqXG5cdCAqIFRvIGRvOiB0aWR5IHVwIHRoZSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHR2YXIgZm9ybWF0TW9uZXkgPSBsaWIuZm9ybWF0TW9uZXkgPSBmdW5jdGlvbihudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKXtcblx0XHRcdFx0cmV0dXJuIGZvcm1hdE1vbmV5KHZhbCwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgbnVtYmVyOlxuXHRcdG51bWJlciA9IHVuZm9ybWF0KG51bWJlcik7XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pOlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZTpcblx0XHRcdHVzZUZvcm1hdCA9IG51bWJlciA+IDAgPyBmb3JtYXRzLnBvcyA6IG51bWJlciA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybztcblxuXHRcdC8vIFJldHVybiB3aXRoIGN1cnJlbmN5IHN5bWJvbCBhZGRlZDpcblx0XHRyZXR1cm4gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKG51bWJlciksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbGlzdCBvZiBudW1iZXJzIGludG8gYW4gYWNjb3VudGluZyBjb2x1bW4sIHBhZGRpbmcgd2l0aCB3aGl0ZXNwYWNlXG5cdCAqIHRvIGxpbmUgdXAgY3VycmVuY3kgc3ltYm9scywgdGhvdXNhbmQgc2VwYXJhdG9ycyBhbmQgZGVjaW1hbHMgcGxhY2VzXG5cdCAqXG5cdCAqIExpc3Qgc2hvdWxkIGJlIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICogU2Vjb25kIHBhcmFtZXRlciBjYW4gYmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyB0aGF0IG1hdGNoIHRoZSBwYXJhbXNcblx0ICpcblx0ICogUmV0dXJucyBhcnJheSBvZiBhY2NvdXRpbmctZm9ybWF0dGVkIG51bWJlciBzdHJpbmdzIG9mIHNhbWUgbGVuZ3RoXG5cdCAqXG5cdCAqIE5COiBgd2hpdGUtc3BhY2U6cHJlYCBDU1MgcnVsZSBpcyByZXF1aXJlZCBvbiB0aGUgbGlzdCBjb250YWluZXIgdG8gcHJldmVudFxuXHQgKiBicm93c2VycyBmcm9tIGNvbGxhcHNpbmcgdGhlIHdoaXRlc3BhY2UgaW4gdGhlIG91dHB1dCBzdHJpbmdzLlxuXHQgKi9cblx0bGliLmZvcm1hdENvbHVtbiA9IGZ1bmN0aW9uKGxpc3QsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0aWYgKCFsaXN0KSByZXR1cm4gW107XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pLCBvbmx5IG5lZWQgcG9zIGZvciBub3c6XG5cdFx0XHRmb3JtYXRzID0gY2hlY2tDdXJyZW5jeUZvcm1hdChvcHRzLmZvcm1hdCksXG5cblx0XHRcdC8vIFdoZXRoZXIgdG8gcGFkIGF0IHN0YXJ0IG9mIHN0cmluZyBvciBhZnRlciBjdXJyZW5jeSBzeW1ib2w6XG5cdFx0XHRwYWRBZnRlclN5bWJvbCA9IGZvcm1hdHMucG9zLmluZGV4T2YoXCIlc1wiKSA8IGZvcm1hdHMucG9zLmluZGV4T2YoXCIldlwiKSA/IHRydWUgOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RvcmUgdmFsdWUgZm9yIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nIGluIHRoZSBjb2x1bW46XG5cdFx0XHRtYXhMZW5ndGggPSAwLFxuXG5cdFx0XHQvLyBGb3JtYXQgdGhlIGxpc3QgYWNjb3JkaW5nIHRvIG9wdGlvbnMsIHN0b3JlIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nOlxuXHRcdFx0Zm9ybWF0dGVkID0gbWFwKGxpc3QsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheSh2YWwpKSB7XG5cdFx0XHRcdFx0Ly8gUmVjdXJzaXZlbHkgZm9ybWF0IGNvbHVtbnMgaWYgbGlzdCBpcyBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5OlxuXHRcdFx0XHRcdHJldHVybiBsaWIuZm9ybWF0Q29sdW1uKHZhbCwgb3B0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYW4gdXAgdGhlIHZhbHVlXG5cdFx0XHRcdFx0dmFsID0gdW5mb3JtYXQodmFsKTtcblxuXHRcdFx0XHRcdC8vIENob29zZSB3aGljaCBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIHZhbHVlIChwb3MsIG5lZyBvciB6ZXJvKTpcblx0XHRcdFx0XHR2YXIgdXNlRm9ybWF0ID0gdmFsID4gMCA/IGZvcm1hdHMucG9zIDogdmFsIDwgMCA/IGZvcm1hdHMubmVnIDogZm9ybWF0cy56ZXJvLFxuXG5cdFx0XHRcdFx0XHQvLyBGb3JtYXQgdGhpcyB2YWx1ZSwgcHVzaCBpbnRvIGZvcm1hdHRlZCBsaXN0IGFuZCBzYXZlIHRoZSBsZW5ndGg6XG5cdFx0XHRcdFx0XHRmVmFsID0gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKHZhbCksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cblx0XHRcdFx0XHRpZiAoZlZhbC5sZW5ndGggPiBtYXhMZW5ndGgpIG1heExlbmd0aCA9IGZWYWwubGVuZ3RoO1xuXHRcdFx0XHRcdHJldHVybiBmVmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIFBhZCBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBhbmQgc2VuZCBiYWNrIHRoZSBjb2x1bW4gb2YgbnVtYmVyczpcblx0XHRyZXR1cm4gbWFwKGZvcm1hdHRlZCwgZnVuY3Rpb24odmFsLCBpKSB7XG5cdFx0XHQvLyBPbmx5IGlmIHRoaXMgaXMgYSBzdHJpbmcgKG5vdCBhIG5lc3RlZCBhcnJheSwgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcGFkZGVkKTpcblx0XHRcdGlmIChpc1N0cmluZyh2YWwpICYmIHZhbC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcblx0XHRcdFx0Ly8gRGVwZW5kaW5nIG9uIHN5bWJvbCBwb3NpdGlvbiwgcGFkIGFmdGVyIHN5bWJvbCBvciBhdCBpbmRleCAwOlxuXHRcdFx0XHRyZXR1cm4gcGFkQWZ0ZXJTeW1ib2wgPyB2YWwucmVwbGFjZShvcHRzLnN5bWJvbCwgb3B0cy5zeW1ib2wrKG5ldyBBcnJheShtYXhMZW5ndGggLSB2YWwubGVuZ3RoICsgMSkuam9pbihcIiBcIikpKSA6IChuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSArIHZhbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvKiAtLS0gTW9kdWxlIERlZmluaXRpb24gLS0tICovXG5cblx0Ly8gRXhwb3J0IGFjY291bnRpbmcgZm9yIENvbW1vbkpTLiBJZiBiZWluZyBsb2FkZWQgYXMgYW4gQU1EIG1vZHVsZSwgZGVmaW5lIGl0IGFzIHN1Y2guXG5cdC8vIE90aGVyd2lzZSwganVzdCBhZGQgYGFjY291bnRpbmdgIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5cdGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRcdGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblx0XHR9XG5cdFx0ZXhwb3J0cy5hY2NvdW50aW5nID0gbGliO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIFJldHVybiB0aGUgbGlicmFyeSBhcyBhbiBBTUQgbW9kdWxlOlxuXHRcdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbGliO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFVzZSBhY2NvdW50aW5nLm5vQ29uZmxpY3QgdG8gcmVzdG9yZSBgYWNjb3VudGluZ2AgYmFjayB0byBpdHMgb3JpZ2luYWwgdmFsdWUuXG5cdFx0Ly8gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSdzIGBhY2NvdW50aW5nYCBvYmplY3Q7XG5cdFx0Ly8gZS5nLiBgdmFyIG51bWJlcnMgPSBhY2NvdW50aW5nLm5vQ29uZmxpY3QoKTtgXG5cdFx0bGliLm5vQ29uZmxpY3QgPSAoZnVuY3Rpb24ob2xkQWNjb3VudGluZykge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBSZXNldCB0aGUgdmFsdWUgb2YgdGhlIHJvb3QncyBgYWNjb3VudGluZ2AgdmFyaWFibGU6XG5cdFx0XHRcdHJvb3QuYWNjb3VudGluZyA9IG9sZEFjY291bnRpbmc7XG5cdFx0XHRcdC8vIERlbGV0ZSB0aGUgbm9Db25mbGljdCBtZXRob2Q6XG5cdFx0XHRcdGxpYi5ub0NvbmZsaWN0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHQvLyBSZXR1cm4gcmVmZXJlbmNlIHRvIHRoZSBsaWJyYXJ5IHRvIHJlLWFzc2lnbiBpdDpcblx0XHRcdFx0cmV0dXJuIGxpYjtcblx0XHRcdH07XG5cdFx0fSkocm9vdC5hY2NvdW50aW5nKTtcblxuXHRcdC8vIERlY2xhcmUgYGZ4YCBvbiB0aGUgcm9vdCAoZ2xvYmFsL3dpbmRvdykgb2JqZWN0OlxuXHRcdHJvb3RbJ2FjY291bnRpbmcnXSA9IGxpYjtcblx0fVxuXG5cdC8vIFJvb3Qgd2lsbCBiZSBgd2luZG93YCBpbiBicm93c2VyIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXI6XG59KHRoaXMpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzXG4gKiogbW9kdWxlIGlkID0gNjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA4XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwic3R5bGVcIixcImZcIjpbXCIjYXBwID4gLndyYXBwZXIgPiAuY29udGVudCB7IGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7IH1cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJib29raW5nXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudCBjZW50ZXIgYWxpZ25lZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcuZXJyb3JcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImJhY2syXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwidWkgYnV0dG9uXCJ9LFwiZlwiOltcIkdvIEJhY2sgdG8gU2VhcmNoIFJlc3VsdHNcIl19XX1dLFwiblwiOjUwLFwiclwiOlwiYm9va2luZy5lcnJvclwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOltcIlRoZSBzaW1wbGVzdCB3YXkgdG8gYm9vayAhXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImJhY2tcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiYVwiOntcImNsYXNzXCI6XCJ1aSBidXR0b24gbWlkZGxlIGdyYXkgYmFja1wifSxcImZcIjpbXCJHbyBCYWNrIHRvIFNlYXJjaCBSZXN1bHRzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjdXJyZW5jeVdyYXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIkN1cnJlbmN5OlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwibWVudSB0cmFuc2l0aW9uXCIsXCJzdHlsZVwiOlwiei1pbmRleDogMTAxMDtcIixcImlkXCI6XCJjdXJyZW5jeTFcIn0sXCJ2XCI6e1wiY2hhbmdlXCI6e1wibVwiOlwic2V0Q3VycmVuY3lCb29raW5nXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiSU5SXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiSU5SXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiaW5yIGljb24gY3VycmVuY3lcIn19LFwiIFJ1cGVlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJVU0RcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJVU0RcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2QgaWNvbiBjdXJyZW5jeVwifX0sXCIgVVMgRG9sbGFyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJFVVJcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJFVVJcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJldXIgaWNvbiBjdXJyZW5jeVwifX0sXCIgRXVyb1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiR0JQXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiR0JQXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiZ2JwIGljb24gY3VycmVuY3lcIn19LFwiIFVLIFBvdW5kXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJBVURcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJBVURcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2QgaWNvbiBjdXJyZW5jeVwifX0sXCIgQXVzdHJhbGlhbiBEb2xsYXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpcIkpQWVwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wic2VsZWN0ZWRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMD09XFxcIkpQWVxcXCJcIn19XSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImpweSBpY29uIGN1cnJlbmN5XCJ9fSxcIiBKYXBhbmVzZSBZZW5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpcIlJVQlwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wic2VsZWN0ZWRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMD09XFxcIlJVQlxcXCJcIn19XSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJ1YiBpY29uIGN1cnJlbmN5XCJ9fSxcIiBSdXNzaWFuIFJ1YmxlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJBRURcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJBRURcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJhZWQgaWNvbiBjdXJyZW5jeVwifX0sXCIgRGlyaGFtXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xlYXJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3RlcDFcIixcImFcIjp7XCJib29raW5nXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInN0ZXAyXCIsXCJhXCI6e1wiYm9va2luZ1wiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzdGVwM1wiLFwiYVwiOntcImJvb2tpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3RlcDRcIixcImFcIjp7XCJib29raW5nXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV19XSxcInJcIjpcImJvb2tpbmcuZXJyb3JcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJib29raW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiYm9va2luZ1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOltcIkJvb2tpbmcgbm90IGZvdW5kIVwiXX1dfV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBhY3RpdmUgaW52ZXJ0ZWQgZGltbWVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0ZXh0IGxvYWRlclwifSxcImZcIjpbXCJMb2FkaW5nXCJdfV19XSxcInJcIjpcImVycm9yXCJ9XSxcInJcIjpcImJvb2tpbmdcIn1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2luZGV4Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA2OVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgQXV0aCA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2F1dGgnKVxyXG4gICAgO1xyXG5cclxudmFyIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JyksXHJcbiAgICBoX2R1cmF0aW9uID0gcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKClcclxuICAgIDtcclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMS5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIGl0aW5lcmFyeTogcmVxdWlyZSgnLi4vaXRpbmVyYXJ5JyksXHJcbiAgICAgICAgJ3VpLWNvZGUnOiByZXF1aXJlKCdjb3JlL2Zvcm0vY29kZScpLFxyXG4gICAgICAgICd1aS1lbWFpbCc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9lbWFpbCcpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHByb21vY29kZTpudWxsLFxyXG4gICAgICAgICAgICBwcm9tb3ZhbHVlOm51bGwsXHJcbiAgICAgICAgICAgIHByb21vZXJyb3I6bnVsbCxcclxuICAgICAgICAgICAgbW9uZXk6IGhfbW9uZXksXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBoX2R1cmF0aW9uLFxyXG5cclxuICAgICAgICAgICAgc2VnX2xlbmd0aDogZnVuY3Rpb24oZmxpZ2h0cykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSAwO1xyXG4gICAgICAgICAgICAgICAgXy5lYWNoKGZsaWdodHMsIGZ1bmN0aW9uKGZsaWdodCkgeyBjICs9IGZsaWdodC5nZXQoJ3NlZ21lbnRzJykubGVuZ3RoOyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnYm9va2luZy5zdGVwcy4xLmFjdGl2ZScsIGZ1bmN0aW9uKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YT10aGlzLmdldCgnYm9va2luZycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmdldCgnYm9va2luZy5wcm9tb19jb2RlJykgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdwcm9tb2NvZGUnLHRoaXMuZ2V0KCdib29raW5nLnByb21vX2NvZGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ3Byb21vdmFsdWUnLHRoaXMuZ2V0KCdib29raW5nLnByb21vX3ZhbHVlJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGN1cj10aGlzLmdldCgnYm9va2luZy5jdXJyZW5jeScpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjdXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScsY3VyICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCdtZXRhJyk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmdldCgnbWV0YScpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59LFxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJy5wcmljZScpKVxyXG4gICAgICAgICAgICAucG9wdXAoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gOiAnYm90dG9tIHJpZ2h0JyxcclxuICAgICAgICAgICAgICAgIHBvcHVwOiAkKHRoaXMuZmluZCgnLmZhcmUucG9wdXAnKSksXHJcbiAgICAgICAgICAgICAgICBvbjogJ2hvdmVyJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHN1Ym1pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmdldCgnYm9va2luZy5pZCcpKTtcclxuICAgICAgIC8vICQodGhpcy5maW5kKCdmb3JtJykpLmFqYXhTdWJtaXQoe3VybDogJ2Fib3V0OmJsYW5rJywgbWV0aG9kOiAnUE9TVCcsIGlmcmFtZTogdHJ1ZX0pO1xyXG4gICAgICAgIHRoaXMuZ2V0KCdib29raW5nJykuc3RlcDEoKTtcclxuXHJcbiAgICAgICAgaWYgKE1PQklMRSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va2luZ19lbWFpbCcsIHRoaXMuZ2V0KCdib29raW5nLnVzZXIuZW1haWwnKSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYm9va2luZ19jb3VudHJ5JywgdGhpcy5nZXQoJ2Jvb2tpbmcudXNlci5jb3VudHJ5JykpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tpbmdfbW9iaWxlJywgdGhpcy5nZXQoJ2Jvb2tpbmcudXNlci5tb2JpbGUnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnBhcmVudC5iYWNrKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpIHsgaWYgKCF0aGlzLmdldCgnYm9va2luZy5wYXltZW50LnBheW1lbnRfaWQnKSkgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5hY3RpdmF0ZSgxKTsgfSxcclxuXHJcbiAgICBzaWduaW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgQXV0aC5sb2dpbigpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdtZXRhLnVzZXInLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdib29raW5nLnVzZXInLCB7IGlkOiBkYXRhLmlkLCBlbWFpbDogZGF0YS5lbWFpbCwgbW9iaWxlOiBkYXRhLm1vYmlsZSxjb3VudHJ5OmRhdGEuY291bnRyeSwgbG9nZ2VkX2luOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBhcHBseVByb21vQ29kZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICBcclxuICAgICAgICAgIHZhciBwcm9tb2NvZGU9dGhpcy5nZXQoJ3Byb21vY29kZScpO1xyXG4gICAgICAgICAgdGhpcy5zZXQoJ3Byb21vZXJyb3InLG51bGwpO1xyXG4gICAgICAgICBcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7ICAgICAgXHJcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IHRoaXMuZ2V0KCdib29raW5nLmlkJykscHJvbW86cHJvbW9jb2RlfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvY2hlY2tQcm9tb0NvZGUnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ2Vycm9yJykpeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb21vZXJyb3InLGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoZGF0YS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb21vdmFsdWUnLGRhdGEudmFsdWUpOyBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb192YWx1ZScsZGF0YS52YWx1ZSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdib29raW5nLnByb21vX2NvZGUnLGRhdGEuY29kZSk7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICBcclxuICAgIH0sXHJcbiAgICByZW1vdmVQcm9tb0NvZGU6ZnVuY3Rpb24oKXtcclxuICAgICAvLyAgIGNvbnNvbGUubG9nKCdyZW1vdmVQcm9tb0NvZGUnKTtcclxuICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vY29kZScsbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vdmFsdWUnLG51bGwpOyBcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7ICAgICAgXHJcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IHRoaXMuZ2V0KCdib29raW5nLmlkJyl9O1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9yZW1vdmVQcm9tb0NvZGUnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdib29raW5nLnByb21vX3ZhbHVlJyxudWxsKTsgXHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb19jb2RlJyxudWxsKTsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICByZW1vdmVFcnJvck1zZzpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb2Vycm9yJyxudWxsKTtcclxuICAgIH1cclxuXHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuanNcbiAqKiBtb2R1bGUgaWQgPSA3MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKVxyXG4gICAgO1xyXG5cclxudmFyIEF1dGggPSBGb3JtLmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9hdXRoLmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdsb2dpbicsXHJcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBmb3Jnb3R0ZW5wYXNzOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldCgncG9wdXAnKSkge1xyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC8nICsgdGhpcy5nZXQoJ2FjdGlvbicpLFxyXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB0aGlzLmdldCgndXNlci5sb2dpbicpLCBwYXNzd29yZDogdGhpcy5nZXQoJ3VzZXIucGFzc3dvcmQnKSB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2aWV3LmRlZmVycmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5kZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCdwb3B1cCcpPT1udWxsICYmIGRhdGEgJiYgZGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvZm9yZ290dGVucGFzcycsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgZW1haWw6IHRoaXMuZ2V0KCd1c2VyLmxvZ2luJykgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdyZXNldHN1Y2Nlc3MnLCB0cnVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNpZ251cDogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCBudWxsKTtcclxuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL3NpZ251cCcsXHJcbiAgICAgICAgICAgIGRhdGE6IF8ucGljayh0aGlzLmdldCgndXNlcicpLCBbJ2VtYWlsJywnbmFtZScsICdtb2JpbGUnLCAncGFzc3dvcmQnLCAncGFzc3dvcmQyJ10pLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3NpZ251cHN1Y2Nlc3MnLCB0cnVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbkF1dGgubG9naW4gPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcclxuXHJcbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcclxuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XHJcbn07XHJcblxyXG5BdXRoLnNpZ251cCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aCgpO1xyXG5cclxuICAgIGF1dGguc2V0KCdwb3B1cCcsIHRydWUpO1xyXG4gICAgYXV0aC5zZXQoJ3NpZ251cCcsIHRydWUpO1xyXG4gICAgYXV0aC5kZWZlcnJlZCA9IFEuZGVmZXIoKTtcclxuICAgIGF1dGgucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XHJcblxyXG4gICAgcmV0dXJuIGF1dGguZGVmZXJyZWQucHJvbWlzZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXV0aDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9hcHAvYXV0aC5qc1xuICoqIG1vZHVsZSBpZCA9IDczXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAzIDQgNSA4XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBsb2dpbiBzbWFsbCBtb2RhbFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiTG9naW5cIl0sXCJuXCI6NTEsXCJ4XCI6e1wiclwiOltcImZvcmdvdHRlbnBhc3NcIixcInNpZ251cFwiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiU2lnbi11cFwiXSxcIm5cIjo1MCxcInJcIjpcInNpZ251cFwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJSZXNldCBwYXNzd29yZFwiXSxcIm5cIjo1MCxcInJcIjpcImZvcmdvdHRlbnBhc3NcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZvcm1cIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcInBvcHVwXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZvcm1cIn1dLFwiclwiOlwicG9wdXBcIn1dLFwicFwiOntcImZvcm1cIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W3tcInRcIjo0LFwiZlwiOltcImZvcm1cIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IGZvcm1cIl0sXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInN1Ym1pdHRpbmdcIn1dLFwic3R5bGVcIjpcInBvc2l0aW9uOiByZWxhdGl2ZTtcIn0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZm9yZ290dGVucGFzc1wiLFwic2lnbnVwXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImxvZ2luXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIubG9naW5cIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiTG9naW5cIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwYXNzd29yZFwiLFwidHlwZVwiOlwicGFzc3dvcmRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpbXCJ1aSBcIix7XCJ0XCI6NCxcImZcIjpbXCJzbWFsbFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicG9wdXBcIl0sXCJzXCI6XCIhXzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIm1hc3NpdmVcIl0sXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSxcIiBmbHVpZCBibHVlIGJ1dHRvbiB1cHBlcmNhc2VcIl19LFwiZlwiOltcIkxPR0lOXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpcImZvcmdvdC1wYXNzd29yZFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiZm9yZ290dGVucGFzc1xcXCIsMV1cIn19fSxcImZcIjpbXCJGb3Jnb3QgUGFzc3dvcmQ/XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W1wiRG9u4oCZdCBoYXZlIGEgQ2hlYXBUaWNrZXQuaW4gQWNjb3VudD8gXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNpZ251cFxcXCIsMV1cIn19fSxcImZcIjpbXCJTaWduIHVwIGZvciBvbmUgwrtcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgYmFzaWMgc2VnbWVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJoaWRlXCJdLFwiblwiOjUxLFwiclwiOlwic2lnbnVwXCJ9XSxcInN0eWxlXCI6XCJtYXgtd2lkdGg6IDMwMHB4OyBtYXJnaW46IGF1dG87IHRleHQtYWxpZ246IGxlZnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImVtYWlsXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIuZW1haWxcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiRW1haWxcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJtb2JpbGVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5tb2JpbGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9iaWxlXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibmFtZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLm5hbWVcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiTmFtZVwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJuYW1lXCI6XCJwYXNzd29yZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLnBhc3N3b3JkXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3N3b3JkXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwicGFzc3dvcmRcIixcIm5hbWVcIjpcInBhc3N3b3JkMlwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLnBhc3N3b3JkMlwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZCBhZ2FpblwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIG1hc3NpdmUgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2lnbnVwXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJTaWdudXBcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yTXNnXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2dcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19XSxcIm5cIjo1MSxcInJcIjpcInNpZ251cHN1Y2Nlc3NcIn1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJZb3VyIHJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzcy5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiWW91IHdpbGwgcmVjZWl2ZSBlbWFpbCB3aXRoIGZ1cnRoZXIgaW5zdHJ1Y3Rpb25zIGZyb20gdXMgaG93IHRvIHByb2NlZWQuXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIlBsZWFzZSBjaGVjayB5b3VyIGluYm94IGFuZCBpZiBubyBlbWFpbCBmcm9tIHVzIGlzIGZvdW5kLCBjaGVjayBhbHNvIHlvdXIgU1BBTSBmb2xkZXIuXCJdLFwiblwiOjUwLFwiclwiOlwic2lnbnVwc3VjY2Vzc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgYmFzaWMgc2VnbWVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJoaWRlXCJdLFwiblwiOjUxLFwiclwiOlwiZm9yZ290dGVucGFzc1wifV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsb2dpblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmxvZ2luXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOlwidWkgbWFzc2l2ZSBmbHVpZCBibHVlIGJ1dHRvbiB1cHBlcmNhc2VcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZXNldFBhc3N3b3JkXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJSRVNFVFwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX1dLFwiblwiOjUxLFwiclwiOlwicmVzZXRzdWNjZXNzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIkluc3RydWN0aW9ucyBob3cgdG8gcmV2aXZlIHlvdXIgcGFzc3dvcmQgaGFzIGJlZW4gc2VudCB0byB5b3VyIGVtYWlsLlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJQbGVhc2UgY2hlY2sgeW91ciBlbWFpbC5cIl0sXCJuXCI6NTAsXCJyXCI6XCJyZXNldHN1Y2Nlc3NcIn1dfV19XX19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvYXBwL2F1dGguaHRtbFxuICoqIG1vZHVsZSBpZCA9IDc0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAzIDQgNSA4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gcGFkZHkobiwgcCwgYykge1xyXG4gICAgdmFyIHBhZF9jaGFyID0gdHlwZW9mIGMgIT09ICd1bmRlZmluZWQnID8gYyA6ICcwJztcclxuICAgIHZhciBwYWQgPSBuZXcgQXJyYXkoMSArIHApLmpvaW4ocGFkX2NoYXIpO1xyXG4gICAgcmV0dXJuIChwYWQgKyBuKS5zbGljZSgtcGFkLmxlbmd0aCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZvcm1hdDogZnVuY3Rpb24oZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKCFkdXJhdGlvbilcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBpID0gZHVyYXRpb24uYXNNaW51dGVzKCksXHJcbiAgICAgICAgICAgICAgICBob3VycyA9IE1hdGguZmxvb3IoaS82MCksXHJcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gaSAlIDYwXHJcbiAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFkZHkoaG91cnMsIDIpICsgJ2ggJyArIHBhZGR5KG1pbnV0ZXMsIDIpICsgJ20nO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2hlbHBlcnMvZHVyYXRpb24uanNcbiAqKiBtb2R1bGUgaWQgPSA3NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInN0ZXAgaGVhZGVyIHN0ZXAxIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuYWN0aXZlXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJjb21wbGV0ZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmNvbXBsZXRlZFwifV0sXCJyXCI6XCJzdGVwLmFjdGl2ZVwifV0sXCJyb2xlXCI6XCJ0YWJcIn0sXCJmXCI6W1wiSXRpbmVyYXJ5XCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJzdGVwMS1zdW1tYXJ5IHNlZ21lbnRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJhY3RpdmF0ZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIlsxXVwifX19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJsb2dvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuY2Fycmllci5sb2dvXCJ9fV0sXCJhbHRcIjpcIlwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcnJpZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5jYXJyaWVyLm5hbWVcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuZmxpZ2h0XCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGluZXJhcnlcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5mcm9tLmNpdHlcIn19LFwiIOKGkiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS50by5jaXR5XCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbFwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIkQgTU1NLCBZWVlZXFxcIilcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImR1cmF0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuZGVwYXJ0LmZvcm1hdChcXFwiSEg6bW1cXFwiKVwifX0sXCIg4oCUIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJsYXN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmFycml2ZS5mb3JtYXQoXFxcIkhIOm1tXFxcIilcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZHVyYXRpb25cIixcInRpbWVcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXzEpXCJ9fV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wicm93c3BhblwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VnX2xlbmd0aFwiLFwiYm9va2luZy5mbGlnaHRzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV0sXCJjbGFzc1wiOlwicHJpY2VcIn0sXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCItIFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcm9tb192YWx1ZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCI9IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5wcm9tb192YWx1ZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLV8yLF8zKVwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcucHJvbW9fdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJyb3dzcGFuXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWdfbGVuZ3RoXCIsXCJib29raW5nLmZsaWdodHNcIl0sXCJzXCI6XCJfMChfMSlcIn19XSxcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV19XSxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5wcm9tb192YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlcIixcImpcIl0sXCJzXCI6XCJfMD09MCYmXzE9PTBcIn19XX1dLFwiblwiOjUyLFwiaVwiOlwialwiLFwiclwiOlwic2VnbWVudHNcIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZy5mbGlnaHRzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzdGVwLmFjdGl2ZVwiLFwic3RlcC5jb21wbGV0ZWRcIl0sXCJzXCI6XCIhXzAmJl8xXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOltcInVpIGZvcm0gc2VnbWVudCBzdGVwMSBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuZXJyb3JzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLnN1Ym1pdHRpbmdcIn1dfSxcInZcIjp7XCJzdWJtaXRcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpdGluZXJhcnlcIixcImFcIjp7XCJmbGlnaHRcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX19XSxcIm5cIjo1MixcInJcIjpcImJvb2tpbmcuZmxpZ2h0c1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBzZWdtZW50IGJvb2tpbmctY29udGFjdHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGhlYWRlclwifSxcImZcIjpbXCJDb250YWN0IERldGFpbHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHR3byBjb2x1bW4gbWlkZGxlIHRvcCBhbGlnbmVkIHJlbGF4ZWQgZml0dGVkIGdyaWRcIixcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwiLFwic3R5bGVcIjpcIndpZHRoOiA2NSU7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d28gZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOltcIkUtTWFpbFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1lbWFpbFwiLFwiYVwiOntcImNsYXNzXCI6W3tcInRcIjo0LFwiZlwiOltcImJvbGRcIl0sXCJuXCI6NTAsXCJyXCI6XCJib29raW5nLnVzZXIuZW1haWxcIn1dLFwibmFtZVwiOlwiZW1haWxcIixcInBsYWNlaG9sZGVyXCI6XCJFLU1haWxcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMuZW1haWxcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nLnVzZXIuZW1haWxcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZCBwaG9uZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOltcIk1vYmlsZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2RlIGlucHV0XCIsXCJuYW1lXCI6XCJtb2JpbGVcIixcInBsYWNlaG9sZGVyXCI6XCJDb2RlXCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm1vYmlsZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcudXNlci5jb3VudHJ5XCJ9XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOltcIm51bWJlciBcIix7XCJ0XCI6NCxcImZcIjpbXCJib2xkXCJdLFwiblwiOjUwLFwiclwiOlwiYm9va2luZy51c2VyLm1vYmlsZVwifV0sXCJuYW1lXCI6XCJtb2JpbGVcIixcInBsYWNlaG9sZGVyXCI6XCJNb2JpbGVcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMubW9iaWxlXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZy51c2VyLm1vYmlsZVwifV19fV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwic3RlcC5lcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiB0b3AgY2VudGVyIGFsaWduZWRcIixcInN0eWxlXCI6XCJ3aWR0aDogMzUlO1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiSGF2ZSBhIENoZWFwVGlja2V0LmluIEFjY291bnQ/IFNpZ24gaW4gaGVyZSFcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOlwidWkgYnV0dG9uIHNtYWxsIGJsdWVcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzaWduaW5cIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIlNpZ24gaW5cIl19XSxcIm5cIjo1MSxcInJcIjpcIm1ldGEudXNlci5lbWFpbFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInR3byBmaWVsZHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInByb21vY29kZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9tb2NvZGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIkVudGVyIFByb21vIENvZGVcIixcImRpc2FibGVkXCI6XCJkaXNhYmxlZFwifSxcImZcIjpbXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicHJvbW9jb2RlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb21vY29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgXCIsXCJwbGFjZWhvbGRlclwiOlwiRW50ZXIgUHJvbW8gQ29kZVwifSxcImZcIjpbXX1dLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZW1vdmVQcm9tb0NvZGVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwicmVkIHJlbW92ZSBjaXJjbGUgb3V0bGluZSBpY29uXCIsXCJhbHRcIjpcIlJlbW92ZSBQcm9tbyBDb2RlXCIsXCJ0aXRsZVwiOlwiUmVtb3ZlIFByb21vIENvZGVcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBidXR0b25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJhcHBseVByb21vQ29kZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiQVBQTFlcIl19XSxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjpib3RoO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc21hbGwgZmllbGQgbmVnYXRpdmUgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZW1vdmVFcnJvck1zZ1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwicHJvbW9lcnJvclwifV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb2Vycm9yXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmNsaWVudFNvdXJjZUlkXCJdLFwic1wiOlwiXzA9PTFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwidWkgd2l6YXJkIGJ1dHRvbiBtYXNzaXZlIGJsdWVcIn0sXCJmXCI6W1wiQ09OVElOVUVcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicmlnaHQgYWxpZ25lZCBjb2x1bW5cIn0sXCJmXCI6W1wiVE9UQUw6XCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInByaWNlXCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIC0gXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwcm9tb3ZhbHVlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiA9IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwicHJvbW92YWx1ZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLV8yLF8zKVwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV19XSxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YXhlc1wifSxcImZcIjpbXCJCYXNpYyBGYXJlOiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcudGF4ZXMuYmFzaWNfZmFyZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgLCBZUTogXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnRheGVzLnlxXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiwgU2VydmljZSBUYXg6IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy50YXhlcy5qblwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIsIE90aGVyOiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcudGF4ZXMub3RoZXJcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XX1dfV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifV0sXCJ4XCI6e1wiclwiOltcInN0ZXAuYWN0aXZlXCIsXCJzdGVwLmNvbXBsZXRlZFwiXSxcInNcIjpcIiFfMCYmXzFcIn19XSxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5zdGVwcy4xXCJdLFwic1wiOlwie3N0ZXA6XzB9XCJ9fSx7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZmFyZSBmbHVpZCBwb3B1cFwiLFwic3R5bGVcIjpcInRleHQtYWxpZ246IGxlZnQ7IG1heC13aWR0aDogMjgwcHg7XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwYXhUYXhlcy4xLmNcIn0sXCJ4IGFkdWx0czogXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwYXhUYXhlcy4xLmJhc2ljX2ZhcmVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgWVE6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwYXhUYXhlcy4xLnlxXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIEpOOlwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMS5qblwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBPVEhFUjpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjEub3RoZXJcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifV0sXCJuXCI6NTAsXCJyXCI6XCJwYXhUYXhlcy4xXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBheFRheGVzLjIuY1wifSxcInggY2hpbGRyZW46IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMi5iYXNpY19mYXJlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIFlROlwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMi55cVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBKTjpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjIuam5cIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgT1RIRVI6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwYXhUYXhlcy4yLm90aGVyXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn1dLFwiblwiOjUwLFwiclwiOlwicGF4VGF4ZXMuMlwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwYXhUYXhlcy4zLmNcIn0sXCJ4IGluZmFudHM6IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMy5iYXNpY19mYXJlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIFlROlwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicGF4VGF4ZXMuMy55cVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBKTjpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheFRheGVzLjMuam5cIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgT1RIRVI6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwYXhUYXhlcy4zLm90aGVyXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn1dLFwiblwiOjUwLFwiclwiOlwicGF4VGF4ZXMuM1wifV19XSxcInJcIjpcImJvb2tpbmdcIn1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMS5odG1sXG4gKiogbW9kdWxlIGlkID0gNzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG5cclxuICAgIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JykoKSxcclxuICAgIGhfZHVyYXRpb24gPSByZXF1aXJlKCdoZWxwZXJzL2R1cmF0aW9uJykoKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9pdGluZXJhcnkuaHRtbCcpLFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfLmV4dGVuZChcclxuICAgICAgICAgICAgeyBtb21lbnQ6IG1vbWVudCwgbW9uZXk6IGhfbW9uZXkubW9uZXksIGR1cmF0aW9uOiBoX2R1cmF0aW9uIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2l0aW5lcmFyeS5qc1xuICoqIG1vZHVsZSBpZCA9IDc3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBzZWdtZW50IGZsaWdodC1pdGluZXJhcnkgXCIse1widFwiOjQsXCJmXCI6W1wic21hbGxcIl0sXCJuXCI6NTAsXCJyXCI6XCJzbWFsbFwiLFwic1wiOnRydWV9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIixcInNcIjp0cnVlfV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aXRsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNpdHlcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5mcm9tLmNpdHlcIn19LFwiIOKGkiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS50by5jaXR5XCJ9fV19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJkZGQgTU1NIEQgWVlZWVxcXCIpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidGltZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImR1cmF0aW9uXCIsXCJzZWd0aW1lXCIsXCIuXCJdLFwic1wiOlwiXzAuZm9ybWF0KF8xKF8yKSlcIn19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmbGlnaHQucmVmdW5kYWJsZVwiXSxcInNcIjpcIltudWxsLFxcXCJOb24gcmVmdW5kYWJsZVxcXCIsXFxcIlJlZnVuZGFibGVcXFwiXVtfMF1cIn19XSxcIm5cIjo1MCxcInJcIjpcInNtYWxsXCIsXCJzXCI6dHJ1ZX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlZ21lbnRzXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImFcIjp7XCJjbGFzc1wiOlwiZGl2aWRlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIsKgXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJhbGlnblwiOlwiY2VudGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwibGF5b3ZlclwifSxcImZcIjpbXCJMYXlvdmVyOiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZHVyYXRpb25cIixcImxheW92ZXJcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXzEpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIsKgXCJdfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJsYXlvdmVyXCJdLFwic1wiOlwiXzAuYXNTZWNvbmRzKClcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJsaW5lXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsb2dvc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdG9wIGFsaWduZWQgYXZhdGFyIGltYWdlXCIsXCJzcmNcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVyLmxvZ29cIn1dLFwiYWx0XCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllci5uYW1lXCJ9XSxcInRpdGxlXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllci5uYW1lXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibmFtZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVyLm5hbWVcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZmxpZ2h0LW5vXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodFwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiY2FiaW5UeXBlXCJ9XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiZnJvbVwiLFwic3R5bGVcIjpcInRleHQtYWxpZ246IHJpZ2h0O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZnJvbS5haXJwb3J0Q29kZVwifSxcIjpcIl19LHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9XSxcIm5cIjo1MCxcInJcIjpcInNtYWxsXCIsXCJzXCI6dHJ1ZX0se1widFwiOjIsXCJ4XCI6e1wiclwiOltcImRlcGFydFwiXSxcInNcIjpcIl8wLmZvcm1hdChcXFwiZGRkIEhIOm1tXFxcIilcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNtYWxsXCIsXCJkZXBhcnRcIl0sXCJzXCI6XCJfMD9fMS5mb3JtYXQoXFxcIkQgTU1NXFxcIik6XzEuZm9ybWF0KFxcXCJEIE1NTSwgWVlZWVxcXCIpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYWlycG9ydFwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmcm9tLmFpcnBvcnRcIn0sXCIsIFwiLHtcInRcIjoyLFwiclwiOlwiZnJvbS5jaXR5XCJ9LFwiwqAoXCIse1widFwiOjIsXCJyXCI6XCJmcm9tLmFpcnBvcnRDb2RlXCJ9LFwiKSwgVGVybWluYWzCoFwiLHtcInRcIjoyLFwiclwiOlwib3JpZ2luVGVybWluYWxcIn1dfV0sXCJuXCI6NTEsXCJyXCI6XCJzbWFsbFwiLFwic1wiOnRydWV9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiZmxpZ2h0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkdXJhdGlvblwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImR1cmF0aW9uXCIsXCJ0aW1lXCJdLFwic1wiOlwiXzAuZm9ybWF0KF8xKVwifX1dfV19XSxcIm5cIjo1MSxcInJcIjpcInNtYWxsXCIsXCJzXCI6dHJ1ZX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidG8uYWlycG9ydENvZGVcIn0sXCI6XCJdfSx7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifV0sXCJuXCI6NTAsXCJyXCI6XCJzbWFsbFwiLFwic1wiOnRydWV9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJhcnJpdmVcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcImRkZCBISDptbVxcXCIpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJzbWFsbFwiLFwiYXJyaXZlXCJdLFwic1wiOlwiXzA/XzEuZm9ybWF0KFxcXCJEIE1NTVxcXCIpOl8xLmZvcm1hdChcXFwiRCBNTU0sIFlZWVlcXFwiKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidG8uYWlycG9ydFwifSxcIiwgXCIse1widFwiOjIsXCJyXCI6XCJ0by5jaXR5XCJ9LFwiwqAoXCIse1widFwiOjIsXCJyXCI6XCJ0by5haXJwb3J0Q29kZVwifSxcIiksIFRlcm1pbmFswqBcIix7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uVGVybWluYWxcIn1dfV0sXCJuXCI6NTEsXCJyXCI6XCJzbWFsbFwiLFwic1wiOnRydWV9XX1dfV0sXCJuXCI6NTIsXCJyXCI6XCIuXCJ9XX1dfV0sXCJuXCI6NTIsXCJyXCI6XCJzZWdtZW50c1wifV0sXCJyXCI6XCJmbGlnaHRcIn1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvaXRpbmVyYXJ5Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA3OFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyIGFsbENvdW50cmllcyA9IFtcclxuICAgIFtcclxuICAgICAgICBcIkluZGlhICjgpK3gpL7gpLDgpKQpXCIsXHJcbiAgICAgICAgXCJpblwiLFxyXG4gICAgICAgIFwiOTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFmZ2hhbmlzdGFuICjigKvYp9mB2LrYp9mG2LPYqtin2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJhZlwiLFxyXG4gICAgICAgIFwiOTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFsYmFuaWEgKFNocWlww6tyaSlcIixcclxuICAgICAgICBcImFsXCIsXHJcbiAgICAgICAgXCIzNTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFsZ2VyaWEgKOKAq9in2YTYrNiy2KfYptix4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiZHpcIixcclxuICAgICAgICBcIjIxM1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQW1lcmljYW4gU2Ftb2FcIixcclxuICAgICAgICBcImFzXCIsXHJcbiAgICAgICAgXCIxNjg0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBbmRvcnJhXCIsXHJcbiAgICAgICAgXCJhZFwiLFxyXG4gICAgICAgIFwiMzc2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBbmdvbGFcIixcclxuICAgICAgICBcImFvXCIsXHJcbiAgICAgICAgXCIyNDRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFuZ3VpbGxhXCIsXHJcbiAgICAgICAgXCJhaVwiLFxyXG4gICAgICAgIFwiMTI2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQW50aWd1YSBhbmQgQmFyYnVkYVwiLFxyXG4gICAgICAgIFwiYWdcIixcclxuICAgICAgICBcIjEyNjhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFyZ2VudGluYVwiLFxyXG4gICAgICAgIFwiYXJcIixcclxuICAgICAgICBcIjU0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBcm1lbmlhICjVgNWh1bXVodW91b/VodW2KVwiLFxyXG4gICAgICAgIFwiYW1cIixcclxuICAgICAgICBcIjM3NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQXJ1YmFcIixcclxuICAgICAgICBcImF3XCIsXHJcbiAgICAgICAgXCIyOTdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkF1c3RyYWxpYVwiLFxyXG4gICAgICAgIFwiYXVcIixcclxuICAgICAgICBcIjYxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBdXN0cmlhICjDlnN0ZXJyZWljaClcIixcclxuICAgICAgICBcImF0XCIsXHJcbiAgICAgICAgXCI0M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQXplcmJhaWphbiAoQXrJmXJiYXljYW4pXCIsXHJcbiAgICAgICAgXCJhelwiLFxyXG4gICAgICAgIFwiOTk0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCYWhhbWFzXCIsXHJcbiAgICAgICAgXCJic1wiLFxyXG4gICAgICAgIFwiMTI0MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmFocmFpbiAo4oCr2KfZhNio2K3YsdmK2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJiaFwiLFxyXG4gICAgICAgIFwiOTczXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCYW5nbGFkZXNoICjgpqzgpr7gpoLgprLgpr7gpqbgp4fgprYpXCIsXHJcbiAgICAgICAgXCJiZFwiLFxyXG4gICAgICAgIFwiODgwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCYXJiYWRvc1wiLFxyXG4gICAgICAgIFwiYmJcIixcclxuICAgICAgICBcIjEyNDZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJlbGFydXMgKNCR0LXQu9Cw0YDRg9GB0YwpXCIsXHJcbiAgICAgICAgXCJieVwiLFxyXG4gICAgICAgIFwiMzc1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZWxnaXVtIChCZWxnacOrKVwiLFxyXG4gICAgICAgIFwiYmVcIixcclxuICAgICAgICBcIjMyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZWxpemVcIixcclxuICAgICAgICBcImJ6XCIsXHJcbiAgICAgICAgXCI1MDFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJlbmluIChCw6luaW4pXCIsXHJcbiAgICAgICAgXCJialwiLFxyXG4gICAgICAgIFwiMjI5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZXJtdWRhXCIsXHJcbiAgICAgICAgXCJibVwiLFxyXG4gICAgICAgIFwiMTQ0MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmh1dGFuICjgvaDgvZbgvrLgvbTgvYIpXCIsXHJcbiAgICAgICAgXCJidFwiLFxyXG4gICAgICAgIFwiOTc1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCb2xpdmlhXCIsXHJcbiAgICAgICAgXCJib1wiLFxyXG4gICAgICAgIFwiNTkxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCb3NuaWEgYW5kIEhlcnplZ292aW5hICjQkdC+0YHQvdCwINC4INCl0LXRgNGG0LXQs9C+0LLQuNC90LApXCIsXHJcbiAgICAgICAgXCJiYVwiLFxyXG4gICAgICAgIFwiMzg3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCb3Rzd2FuYVwiLFxyXG4gICAgICAgIFwiYndcIixcclxuICAgICAgICBcIjI2N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQnJhemlsIChCcmFzaWwpXCIsXHJcbiAgICAgICAgXCJiclwiLFxyXG4gICAgICAgIFwiNTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJyaXRpc2ggSW5kaWFuIE9jZWFuIFRlcnJpdG9yeVwiLFxyXG4gICAgICAgIFwiaW9cIixcclxuICAgICAgICBcIjI0NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQnJpdGlzaCBWaXJnaW4gSXNsYW5kc1wiLFxyXG4gICAgICAgIFwidmdcIixcclxuICAgICAgICBcIjEyODRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJydW5laVwiLFxyXG4gICAgICAgIFwiYm5cIixcclxuICAgICAgICBcIjY3M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQnVsZ2FyaWEgKNCR0YrQu9Cz0LDRgNC40Y8pXCIsXHJcbiAgICAgICAgXCJiZ1wiLFxyXG4gICAgICAgIFwiMzU5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCdXJraW5hIEZhc29cIixcclxuICAgICAgICBcImJmXCIsXHJcbiAgICAgICAgXCIyMjZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJ1cnVuZGkgKFVidXJ1bmRpKVwiLFxyXG4gICAgICAgIFwiYmlcIixcclxuICAgICAgICBcIjI1N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2FtYm9kaWEgKOGegOGemOGfkuGeluGeu+Geh+GetilcIixcclxuICAgICAgICBcImtoXCIsXHJcbiAgICAgICAgXCI4NTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNhbWVyb29uIChDYW1lcm91bilcIixcclxuICAgICAgICBcImNtXCIsXHJcbiAgICAgICAgXCIyMzdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNhbmFkYVwiLFxyXG4gICAgICAgIFwiY2FcIixcclxuICAgICAgICBcIjFcIixcclxuICAgICAgICAxLFxyXG4gICAgICAgIFtcIjIwNFwiLCBcIjIyNlwiLCBcIjIzNlwiLCBcIjI0OVwiLCBcIjI1MFwiLCBcIjI4OVwiLCBcIjMwNlwiLCBcIjM0M1wiLCBcIjM2NVwiLCBcIjM4N1wiLCBcIjQwM1wiLCBcIjQxNlwiLCBcIjQxOFwiLCBcIjQzMVwiLCBcIjQzN1wiLCBcIjQzOFwiLCBcIjQ1MFwiLCBcIjUwNlwiLCBcIjUxNFwiLCBcIjUxOVwiLCBcIjU0OFwiLCBcIjU3OVwiLCBcIjU4MVwiLCBcIjU4N1wiLCBcIjYwNFwiLCBcIjYxM1wiLCBcIjYzOVwiLCBcIjY0N1wiLCBcIjY3MlwiLCBcIjcwNVwiLCBcIjcwOVwiLCBcIjc0MlwiLCBcIjc3OFwiLCBcIjc4MFwiLCBcIjc4MlwiLCBcIjgwN1wiLCBcIjgxOVwiLCBcIjgyNVwiLCBcIjg2N1wiLCBcIjg3M1wiLCBcIjkwMlwiLCBcIjkwNVwiXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNhcGUgVmVyZGUgKEthYnUgVmVyZGkpXCIsXHJcbiAgICAgICAgXCJjdlwiLFxyXG4gICAgICAgIFwiMjM4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDYXJpYmJlYW4gTmV0aGVybGFuZHNcIixcclxuICAgICAgICBcImJxXCIsXHJcbiAgICAgICAgXCI1OTlcIixcclxuICAgICAgICAxXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2F5bWFuIElzbGFuZHNcIixcclxuICAgICAgICBcImt5XCIsXHJcbiAgICAgICAgXCIxMzQ1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDZW50cmFsIEFmcmljYW4gUmVwdWJsaWMgKFLDqXB1YmxpcXVlIGNlbnRyYWZyaWNhaW5lKVwiLFxyXG4gICAgICAgIFwiY2ZcIixcclxuICAgICAgICBcIjIzNlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2hhZCAoVGNoYWQpXCIsXHJcbiAgICAgICAgXCJ0ZFwiLFxyXG4gICAgICAgIFwiMjM1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDaGlsZVwiLFxyXG4gICAgICAgIFwiY2xcIixcclxuICAgICAgICBcIjU2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDaGluYSAo5Lit5Zu9KVwiLFxyXG4gICAgICAgIFwiY25cIixcclxuICAgICAgICBcIjg2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb2xvbWJpYVwiLFxyXG4gICAgICAgIFwiY29cIixcclxuICAgICAgICBcIjU3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb21vcm9zICjigKvYrNiy2LEg2KfZhNmC2YXYseKArOKAjilcIixcclxuICAgICAgICBcImttXCIsXHJcbiAgICAgICAgXCIyNjlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNvbmdvIChEUkMpIChKYW1odXJpIHlhIEtpZGVtb2tyYXNpYSB5YSBLb25nbylcIixcclxuICAgICAgICBcImNkXCIsXHJcbiAgICAgICAgXCIyNDNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNvbmdvIChSZXB1YmxpYykgKENvbmdvLUJyYXp6YXZpbGxlKVwiLFxyXG4gICAgICAgIFwiY2dcIixcclxuICAgICAgICBcIjI0MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ29vayBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJja1wiLFxyXG4gICAgICAgIFwiNjgyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb3N0YSBSaWNhXCIsXHJcbiAgICAgICAgXCJjclwiLFxyXG4gICAgICAgIFwiNTA2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDw7R0ZSBk4oCZSXZvaXJlXCIsXHJcbiAgICAgICAgXCJjaVwiLFxyXG4gICAgICAgIFwiMjI1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDcm9hdGlhIChIcnZhdHNrYSlcIixcclxuICAgICAgICBcImhyXCIsXHJcbiAgICAgICAgXCIzODVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkN1YmFcIixcclxuICAgICAgICBcImN1XCIsXHJcbiAgICAgICAgXCI1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ3VyYcOnYW9cIixcclxuICAgICAgICBcImN3XCIsXHJcbiAgICAgICAgXCI1OTlcIixcclxuICAgICAgICAwXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ3lwcnVzICjOms+Nz4DPgc6/z4IpXCIsXHJcbiAgICAgICAgXCJjeVwiLFxyXG4gICAgICAgIFwiMzU3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDemVjaCBSZXB1YmxpYyAoxIxlc2vDoSByZXB1Ymxpa2EpXCIsXHJcbiAgICAgICAgXCJjelwiLFxyXG4gICAgICAgIFwiNDIwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJEZW5tYXJrIChEYW5tYXJrKVwiLFxyXG4gICAgICAgIFwiZGtcIixcclxuICAgICAgICBcIjQ1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJEamlib3V0aVwiLFxyXG4gICAgICAgIFwiZGpcIixcclxuICAgICAgICBcIjI1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRG9taW5pY2FcIixcclxuICAgICAgICBcImRtXCIsXHJcbiAgICAgICAgXCIxNzY3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJEb21pbmljYW4gUmVwdWJsaWMgKFJlcMO6YmxpY2EgRG9taW5pY2FuYSlcIixcclxuICAgICAgICBcImRvXCIsXHJcbiAgICAgICAgXCIxXCIsXHJcbiAgICAgICAgMixcclxuICAgICAgICBbXCI4MDlcIiwgXCI4MjlcIiwgXCI4NDlcIl1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFY3VhZG9yXCIsXHJcbiAgICAgICAgXCJlY1wiLFxyXG4gICAgICAgIFwiNTkzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFZ3lwdCAo4oCr2YXYtdix4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiZWdcIixcclxuICAgICAgICBcIjIwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFbCBTYWx2YWRvclwiLFxyXG4gICAgICAgIFwic3ZcIixcclxuICAgICAgICBcIjUwM1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRXF1YXRvcmlhbCBHdWluZWEgKEd1aW5lYSBFY3VhdG9yaWFsKVwiLFxyXG4gICAgICAgIFwiZ3FcIixcclxuICAgICAgICBcIjI0MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRXJpdHJlYVwiLFxyXG4gICAgICAgIFwiZXJcIixcclxuICAgICAgICBcIjI5MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRXN0b25pYSAoRWVzdGkpXCIsXHJcbiAgICAgICAgXCJlZVwiLFxyXG4gICAgICAgIFwiMzcyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFdGhpb3BpYVwiLFxyXG4gICAgICAgIFwiZXRcIixcclxuICAgICAgICBcIjI1MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRmFsa2xhbmQgSXNsYW5kcyAoSXNsYXMgTWFsdmluYXMpXCIsXHJcbiAgICAgICAgXCJma1wiLFxyXG4gICAgICAgIFwiNTAwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJGYXJvZSBJc2xhbmRzIChGw7hyb3lhcilcIixcclxuICAgICAgICBcImZvXCIsXHJcbiAgICAgICAgXCIyOThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZpamlcIixcclxuICAgICAgICBcImZqXCIsXHJcbiAgICAgICAgXCI2NzlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZpbmxhbmQgKFN1b21pKVwiLFxyXG4gICAgICAgIFwiZmlcIixcclxuICAgICAgICBcIjM1OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRnJhbmNlXCIsXHJcbiAgICAgICAgXCJmclwiLFxyXG4gICAgICAgIFwiMzNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZyZW5jaCBHdWlhbmEgKEd1eWFuZSBmcmFuw6dhaXNlKVwiLFxyXG4gICAgICAgIFwiZ2ZcIixcclxuICAgICAgICBcIjU5NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRnJlbmNoIFBvbHluZXNpYSAoUG9seW7DqXNpZSBmcmFuw6dhaXNlKVwiLFxyXG4gICAgICAgIFwicGZcIixcclxuICAgICAgICBcIjY4OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR2Fib25cIixcclxuICAgICAgICBcImdhXCIsXHJcbiAgICAgICAgXCIyNDFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdhbWJpYVwiLFxyXG4gICAgICAgIFwiZ21cIixcclxuICAgICAgICBcIjIyMFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR2VvcmdpYSAo4YOh4YOQ4YOl4YOQ4YOg4YOX4YOV4YOU4YOa4YOdKVwiLFxyXG4gICAgICAgIFwiZ2VcIixcclxuICAgICAgICBcIjk5NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR2VybWFueSAoRGV1dHNjaGxhbmQpXCIsXHJcbiAgICAgICAgXCJkZVwiLFxyXG4gICAgICAgIFwiNDlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdoYW5hIChHYWFuYSlcIixcclxuICAgICAgICBcImdoXCIsXHJcbiAgICAgICAgXCIyMzNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdpYnJhbHRhclwiLFxyXG4gICAgICAgIFwiZ2lcIixcclxuICAgICAgICBcIjM1MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR3JlZWNlICjOlc67zrvOrM60zrEpXCIsXHJcbiAgICAgICAgXCJnclwiLFxyXG4gICAgICAgIFwiMzBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdyZWVubGFuZCAoS2FsYWFsbGl0IE51bmFhdClcIixcclxuICAgICAgICBcImdsXCIsXHJcbiAgICAgICAgXCIyOTlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdyZW5hZGFcIixcclxuICAgICAgICBcImdkXCIsXHJcbiAgICAgICAgXCIxNDczXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdWFkZWxvdXBlXCIsXHJcbiAgICAgICAgXCJncFwiLFxyXG4gICAgICAgIFwiNTkwXCIsXHJcbiAgICAgICAgMFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkd1YW1cIixcclxuICAgICAgICBcImd1XCIsXHJcbiAgICAgICAgXCIxNjcxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdWF0ZW1hbGFcIixcclxuICAgICAgICBcImd0XCIsXHJcbiAgICAgICAgXCI1MDJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkd1aW5lYSAoR3VpbsOpZSlcIixcclxuICAgICAgICBcImduXCIsXHJcbiAgICAgICAgXCIyMjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkd1aW5lYS1CaXNzYXUgKEd1aW7DqSBCaXNzYXUpXCIsXHJcbiAgICAgICAgXCJnd1wiLFxyXG4gICAgICAgIFwiMjQ1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdXlhbmFcIixcclxuICAgICAgICBcImd5XCIsXHJcbiAgICAgICAgXCI1OTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkhhaXRpXCIsXHJcbiAgICAgICAgXCJodFwiLFxyXG4gICAgICAgIFwiNTA5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJIb25kdXJhc1wiLFxyXG4gICAgICAgIFwiaG5cIixcclxuICAgICAgICBcIjUwNFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSG9uZyBLb25nICjpppnmuK8pXCIsXHJcbiAgICAgICAgXCJoa1wiLFxyXG4gICAgICAgIFwiODUyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJIdW5nYXJ5IChNYWd5YXJvcnN6w6FnKVwiLFxyXG4gICAgICAgIFwiaHVcIixcclxuICAgICAgICBcIjM2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJJY2VsYW5kICjDjXNsYW5kKVwiLFxyXG4gICAgICAgIFwiaXNcIixcclxuICAgICAgICBcIjM1NFwiXHJcbiAgICBdLFxyXG4gICAgXHJcbiAgICBbXHJcbiAgICAgICAgXCJJbmRvbmVzaWFcIixcclxuICAgICAgICBcImlkXCIsXHJcbiAgICAgICAgXCI2MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXJhbiAo4oCr2KfbjNix2KfZhuKArOKAjilcIixcclxuICAgICAgICBcImlyXCIsXHJcbiAgICAgICAgXCI5OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXJhcSAo4oCr2KfZhNi52LHYp9mC4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiaXFcIixcclxuICAgICAgICBcIjk2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXJlbGFuZFwiLFxyXG4gICAgICAgIFwiaWVcIixcclxuICAgICAgICBcIjM1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXNyYWVsICjigKvXmdep16jXkNec4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiaWxcIixcclxuICAgICAgICBcIjk3MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXRhbHkgKEl0YWxpYSlcIixcclxuICAgICAgICBcIml0XCIsXHJcbiAgICAgICAgXCIzOVwiLFxyXG4gICAgICAgIDBcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJKYW1haWNhXCIsXHJcbiAgICAgICAgXCJqbVwiLFxyXG4gICAgICAgIFwiMTg3NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSmFwYW4gKOaXpeacrClcIixcclxuICAgICAgICBcImpwXCIsXHJcbiAgICAgICAgXCI4MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSm9yZGFuICjigKvYp9mE2KPYsdiv2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJqb1wiLFxyXG4gICAgICAgIFwiOTYyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJLYXpha2hzdGFuICjQmtCw0LfQsNGF0YHRgtCw0L0pXCIsXHJcbiAgICAgICAgXCJrelwiLFxyXG4gICAgICAgIFwiN1wiLFxyXG4gICAgICAgIDFcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJLZW55YVwiLFxyXG4gICAgICAgIFwia2VcIixcclxuICAgICAgICBcIjI1NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiS2lyaWJhdGlcIixcclxuICAgICAgICBcImtpXCIsXHJcbiAgICAgICAgXCI2ODZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkt1d2FpdCAo4oCr2KfZhNmD2YjZitiq4oCs4oCOKVwiLFxyXG4gICAgICAgIFwia3dcIixcclxuICAgICAgICBcIjk2NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiS3lyZ3l6c3RhbiAo0JrRi9GA0LPRi9C30YHRgtCw0L0pXCIsXHJcbiAgICAgICAgXCJrZ1wiLFxyXG4gICAgICAgIFwiOTk2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMYW9zICjguqXgurLguqcpXCIsXHJcbiAgICAgICAgXCJsYVwiLFxyXG4gICAgICAgIFwiODU2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMYXR2aWEgKExhdHZpamEpXCIsXHJcbiAgICAgICAgXCJsdlwiLFxyXG4gICAgICAgIFwiMzcxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMZWJhbm9uICjigKvZhNio2YbYp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwibGJcIixcclxuICAgICAgICBcIjk2MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGVzb3Rob1wiLFxyXG4gICAgICAgIFwibHNcIixcclxuICAgICAgICBcIjI2NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGliZXJpYVwiLFxyXG4gICAgICAgIFwibHJcIixcclxuICAgICAgICBcIjIzMVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGlieWEgKOKAq9mE2YrYqNmK2KfigKzigI4pXCIsXHJcbiAgICAgICAgXCJseVwiLFxyXG4gICAgICAgIFwiMjE4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMaWVjaHRlbnN0ZWluXCIsXHJcbiAgICAgICAgXCJsaVwiLFxyXG4gICAgICAgIFwiNDIzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMaXRodWFuaWEgKExpZXR1dmEpXCIsXHJcbiAgICAgICAgXCJsdFwiLFxyXG4gICAgICAgIFwiMzcwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMdXhlbWJvdXJnXCIsXHJcbiAgICAgICAgXCJsdVwiLFxyXG4gICAgICAgIFwiMzUyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYWNhdSAo5r6z6ZaAKVwiLFxyXG4gICAgICAgIFwibW9cIixcclxuICAgICAgICBcIjg1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFjZWRvbmlhIChGWVJPTSkgKNCc0LDQutC10LTQvtC90LjRmNCwKVwiLFxyXG4gICAgICAgIFwibWtcIixcclxuICAgICAgICBcIjM4OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFkYWdhc2NhciAoTWFkYWdhc2lrYXJhKVwiLFxyXG4gICAgICAgIFwibWdcIixcclxuICAgICAgICBcIjI2MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsYXdpXCIsXHJcbiAgICAgICAgXCJtd1wiLFxyXG4gICAgICAgIFwiMjY1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYWxheXNpYVwiLFxyXG4gICAgICAgIFwibXlcIixcclxuICAgICAgICBcIjYwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYWxkaXZlc1wiLFxyXG4gICAgICAgIFwibXZcIixcclxuICAgICAgICBcIjk2MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsaVwiLFxyXG4gICAgICAgIFwibWxcIixcclxuICAgICAgICBcIjIyM1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsdGFcIixcclxuICAgICAgICBcIm10XCIsXHJcbiAgICAgICAgXCIzNTZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hcnNoYWxsIElzbGFuZHNcIixcclxuICAgICAgICBcIm1oXCIsXHJcbiAgICAgICAgXCI2OTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hcnRpbmlxdWVcIixcclxuICAgICAgICBcIm1xXCIsXHJcbiAgICAgICAgXCI1OTZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hdXJpdGFuaWEgKOKAq9mF2YjYsdmK2KrYp9mG2YrYp+KArOKAjilcIixcclxuICAgICAgICBcIm1yXCIsXHJcbiAgICAgICAgXCIyMjJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hdXJpdGl1cyAoTW9yaXMpXCIsXHJcbiAgICAgICAgXCJtdVwiLFxyXG4gICAgICAgIFwiMjMwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNZXhpY28gKE3DqXhpY28pXCIsXHJcbiAgICAgICAgXCJteFwiLFxyXG4gICAgICAgIFwiNTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1pY3JvbmVzaWFcIixcclxuICAgICAgICBcImZtXCIsXHJcbiAgICAgICAgXCI2OTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vbGRvdmEgKFJlcHVibGljYSBNb2xkb3ZhKVwiLFxyXG4gICAgICAgIFwibWRcIixcclxuICAgICAgICBcIjM3M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTW9uYWNvXCIsXHJcbiAgICAgICAgXCJtY1wiLFxyXG4gICAgICAgIFwiMzc3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNb25nb2xpYSAo0JzQvtC90LPQvtC7KVwiLFxyXG4gICAgICAgIFwibW5cIixcclxuICAgICAgICBcIjk3NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTW9udGVuZWdybyAoQ3JuYSBHb3JhKVwiLFxyXG4gICAgICAgIFwibWVcIixcclxuICAgICAgICBcIjM4MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTW9udHNlcnJhdFwiLFxyXG4gICAgICAgIFwibXNcIixcclxuICAgICAgICBcIjE2NjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vcm9jY28gKOKAq9in2YTZhdi62LHYqOKArOKAjilcIixcclxuICAgICAgICBcIm1hXCIsXHJcbiAgICAgICAgXCIyMTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vemFtYmlxdWUgKE1vw6dhbWJpcXVlKVwiLFxyXG4gICAgICAgIFwibXpcIixcclxuICAgICAgICBcIjI1OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTXlhbm1hciAoQnVybWEpICjhgJnhgLzhgJThgLrhgJnhgKwpXCIsXHJcbiAgICAgICAgXCJtbVwiLFxyXG4gICAgICAgIFwiOTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5hbWliaWEgKE5hbWliacOrKVwiLFxyXG4gICAgICAgIFwibmFcIixcclxuICAgICAgICBcIjI2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmF1cnVcIixcclxuICAgICAgICBcIm5yXCIsXHJcbiAgICAgICAgXCI2NzRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5lcGFsICjgpKjgpYfgpKrgpL7gpLIpXCIsXHJcbiAgICAgICAgXCJucFwiLFxyXG4gICAgICAgIFwiOTc3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOZXRoZXJsYW5kcyAoTmVkZXJsYW5kKVwiLFxyXG4gICAgICAgIFwibmxcIixcclxuICAgICAgICBcIjMxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOZXcgQ2FsZWRvbmlhIChOb3V2ZWxsZS1DYWzDqWRvbmllKVwiLFxyXG4gICAgICAgIFwibmNcIixcclxuICAgICAgICBcIjY4N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmV3IFplYWxhbmRcIixcclxuICAgICAgICBcIm56XCIsXHJcbiAgICAgICAgXCI2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmljYXJhZ3VhXCIsXHJcbiAgICAgICAgXCJuaVwiLFxyXG4gICAgICAgIFwiNTA1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOaWdlciAoTmlqYXIpXCIsXHJcbiAgICAgICAgXCJuZVwiLFxyXG4gICAgICAgIFwiMjI3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOaWdlcmlhXCIsXHJcbiAgICAgICAgXCJuZ1wiLFxyXG4gICAgICAgIFwiMjM0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOaXVlXCIsXHJcbiAgICAgICAgXCJudVwiLFxyXG4gICAgICAgIFwiNjgzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOb3Jmb2xrIElzbGFuZFwiLFxyXG4gICAgICAgIFwibmZcIixcclxuICAgICAgICBcIjY3MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTm9ydGggS29yZWEgKOyhsOyEoCDrr7zso7zso7zsnZgg7J2466+8IOqzte2ZlOq1rSlcIixcclxuICAgICAgICBcImtwXCIsXHJcbiAgICAgICAgXCI4NTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5vcnRoZXJuIE1hcmlhbmEgSXNsYW5kc1wiLFxyXG4gICAgICAgIFwibXBcIixcclxuICAgICAgICBcIjE2NzBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5vcndheSAoTm9yZ2UpXCIsXHJcbiAgICAgICAgXCJub1wiLFxyXG4gICAgICAgIFwiNDdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk9tYW4gKOKAq9i52Y/Zhdin2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJvbVwiLFxyXG4gICAgICAgIFwiOTY4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYWtpc3RhbiAo4oCr2b7Yp9qp2LPYqtin2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJwa1wiLFxyXG4gICAgICAgIFwiOTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhbGF1XCIsXHJcbiAgICAgICAgXCJwd1wiLFxyXG4gICAgICAgIFwiNjgwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYWxlc3RpbmUgKOKAq9mB2YTYs9i32YrZhuKArOKAjilcIixcclxuICAgICAgICBcInBzXCIsXHJcbiAgICAgICAgXCI5NzBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhbmFtYSAoUGFuYW3DoSlcIixcclxuICAgICAgICBcInBhXCIsXHJcbiAgICAgICAgXCI1MDdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhcHVhIE5ldyBHdWluZWFcIixcclxuICAgICAgICBcInBnXCIsXHJcbiAgICAgICAgXCI2NzVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhcmFndWF5XCIsXHJcbiAgICAgICAgXCJweVwiLFxyXG4gICAgICAgIFwiNTk1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQZXJ1IChQZXLDuilcIixcclxuICAgICAgICBcInBlXCIsXHJcbiAgICAgICAgXCI1MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUGhpbGlwcGluZXNcIixcclxuICAgICAgICBcInBoXCIsXHJcbiAgICAgICAgXCI2M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUG9sYW5kIChQb2xza2EpXCIsXHJcbiAgICAgICAgXCJwbFwiLFxyXG4gICAgICAgIFwiNDhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBvcnR1Z2FsXCIsXHJcbiAgICAgICAgXCJwdFwiLFxyXG4gICAgICAgIFwiMzUxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQdWVydG8gUmljb1wiLFxyXG4gICAgICAgIFwicHJcIixcclxuICAgICAgICBcIjFcIixcclxuICAgICAgICAzLFxyXG4gICAgICAgIFtcIjc4N1wiLCBcIjkzOVwiXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlFhdGFyICjigKvZgti32LHigKzigI4pXCIsXHJcbiAgICAgICAgXCJxYVwiLFxyXG4gICAgICAgIFwiOTc0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJSw6l1bmlvbiAoTGEgUsOpdW5pb24pXCIsXHJcbiAgICAgICAgXCJyZVwiLFxyXG4gICAgICAgIFwiMjYyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJSb21hbmlhIChSb23Dom5pYSlcIixcclxuICAgICAgICBcInJvXCIsXHJcbiAgICAgICAgXCI0MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUnVzc2lhICjQoNC+0YHRgdC40Y8pXCIsXHJcbiAgICAgICAgXCJydVwiLFxyXG4gICAgICAgIFwiN1wiLFxyXG4gICAgICAgIDBcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJSd2FuZGFcIixcclxuICAgICAgICBcInJ3XCIsXHJcbiAgICAgICAgXCIyNTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IEJhcnRow6lsZW15IChTYWludC1CYXJ0aMOpbGVteSlcIixcclxuICAgICAgICBcImJsXCIsXHJcbiAgICAgICAgXCI1OTBcIixcclxuICAgICAgICAxXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2FpbnQgSGVsZW5hXCIsXHJcbiAgICAgICAgXCJzaFwiLFxyXG4gICAgICAgIFwiMjkwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBLaXR0cyBhbmQgTmV2aXNcIixcclxuICAgICAgICBcImtuXCIsXHJcbiAgICAgICAgXCIxODY5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBMdWNpYVwiLFxyXG4gICAgICAgIFwibGNcIixcclxuICAgICAgICBcIjE3NThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IE1hcnRpbiAoU2FpbnQtTWFydGluIChwYXJ0aWUgZnJhbsOnYWlzZSkpXCIsXHJcbiAgICAgICAgXCJtZlwiLFxyXG4gICAgICAgIFwiNTkwXCIsXHJcbiAgICAgICAgMlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IFBpZXJyZSBhbmQgTWlxdWVsb24gKFNhaW50LVBpZXJyZS1ldC1NaXF1ZWxvbilcIixcclxuICAgICAgICBcInBtXCIsXHJcbiAgICAgICAgXCI1MDhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IFZpbmNlbnQgYW5kIHRoZSBHcmVuYWRpbmVzXCIsXHJcbiAgICAgICAgXCJ2Y1wiLFxyXG4gICAgICAgIFwiMTc4NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2Ftb2FcIixcclxuICAgICAgICBcIndzXCIsXHJcbiAgICAgICAgXCI2ODVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhbiBNYXJpbm9cIixcclxuICAgICAgICBcInNtXCIsXHJcbiAgICAgICAgXCIzNzhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlPDo28gVG9tw6kgYW5kIFByw61uY2lwZSAoU8OjbyBUb23DqSBlIFByw61uY2lwZSlcIixcclxuICAgICAgICBcInN0XCIsXHJcbiAgICAgICAgXCIyMzlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhdWRpIEFyYWJpYSAo4oCr2KfZhNmF2YXZhNmD2Kkg2KfZhNi52LHYqNmK2Kkg2KfZhNiz2LnZiNiv2YrYqeKArOKAjilcIixcclxuICAgICAgICBcInNhXCIsXHJcbiAgICAgICAgXCI5NjZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNlbmVnYWwgKFPDqW7DqWdhbClcIixcclxuICAgICAgICBcInNuXCIsXHJcbiAgICAgICAgXCIyMjFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNlcmJpYSAo0KHRgNCx0LjRmNCwKVwiLFxyXG4gICAgICAgIFwicnNcIixcclxuICAgICAgICBcIjM4MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2V5Y2hlbGxlc1wiLFxyXG4gICAgICAgIFwic2NcIixcclxuICAgICAgICBcIjI0OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2llcnJhIExlb25lXCIsXHJcbiAgICAgICAgXCJzbFwiLFxyXG4gICAgICAgIFwiMjMyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTaW5nYXBvcmVcIixcclxuICAgICAgICBcInNnXCIsXHJcbiAgICAgICAgXCI2NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2ludCBNYWFydGVuXCIsXHJcbiAgICAgICAgXCJzeFwiLFxyXG4gICAgICAgIFwiMTcyMVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2xvdmFraWEgKFNsb3ZlbnNrbylcIixcclxuICAgICAgICBcInNrXCIsXHJcbiAgICAgICAgXCI0MjFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNsb3ZlbmlhIChTbG92ZW5pamEpXCIsXHJcbiAgICAgICAgXCJzaVwiLFxyXG4gICAgICAgIFwiMzg2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTb2xvbW9uIElzbGFuZHNcIixcclxuICAgICAgICBcInNiXCIsXHJcbiAgICAgICAgXCI2NzdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNvbWFsaWEgKFNvb21hYWxpeWEpXCIsXHJcbiAgICAgICAgXCJzb1wiLFxyXG4gICAgICAgIFwiMjUyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTb3V0aCBBZnJpY2FcIixcclxuICAgICAgICBcInphXCIsXHJcbiAgICAgICAgXCIyN1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU291dGggS29yZWEgKOuMgO2VnOuvvOq1rSlcIixcclxuICAgICAgICBcImtyXCIsXHJcbiAgICAgICAgXCI4MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU291dGggU3VkYW4gKOKAq9is2YbZiNioINin2YTYs9mI2K/Yp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwic3NcIixcclxuICAgICAgICBcIjIxMVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3BhaW4gKEVzcGHDsWEpXCIsXHJcbiAgICAgICAgXCJlc1wiLFxyXG4gICAgICAgIFwiMzRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNyaSBMYW5rYSAo4LeB4LeK4oCN4La74LeTIOC2veC2guC2muC3j+C3gClcIixcclxuICAgICAgICBcImxrXCIsXHJcbiAgICAgICAgXCI5NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3VkYW4gKOKAq9in2YTYs9mI2K/Yp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwic2RcIixcclxuICAgICAgICBcIjI0OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3VyaW5hbWVcIixcclxuICAgICAgICBcInNyXCIsXHJcbiAgICAgICAgXCI1OTdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlN3YXppbGFuZFwiLFxyXG4gICAgICAgIFwic3pcIixcclxuICAgICAgICBcIjI2OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3dlZGVuIChTdmVyaWdlKVwiLFxyXG4gICAgICAgIFwic2VcIixcclxuICAgICAgICBcIjQ2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTd2l0emVybGFuZCAoU2Nod2VpeilcIixcclxuICAgICAgICBcImNoXCIsXHJcbiAgICAgICAgXCI0MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3lyaWEgKOKAq9iz2YjYsdmK2KfigKzigI4pXCIsXHJcbiAgICAgICAgXCJzeVwiLFxyXG4gICAgICAgIFwiOTYzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUYWl3YW4gKOWPsOeBoylcIixcclxuICAgICAgICBcInR3XCIsXHJcbiAgICAgICAgXCI4ODZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRhamlraXN0YW5cIixcclxuICAgICAgICBcInRqXCIsXHJcbiAgICAgICAgXCI5OTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRhbnphbmlhXCIsXHJcbiAgICAgICAgXCJ0elwiLFxyXG4gICAgICAgIFwiMjU1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUaGFpbGFuZCAo4LmE4LiX4LiiKVwiLFxyXG4gICAgICAgIFwidGhcIixcclxuICAgICAgICBcIjY2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUaW1vci1MZXN0ZVwiLFxyXG4gICAgICAgIFwidGxcIixcclxuICAgICAgICBcIjY3MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVG9nb1wiLFxyXG4gICAgICAgIFwidGdcIixcclxuICAgICAgICBcIjIyOFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVG9rZWxhdVwiLFxyXG4gICAgICAgIFwidGtcIixcclxuICAgICAgICBcIjY5MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVG9uZ2FcIixcclxuICAgICAgICBcInRvXCIsXHJcbiAgICAgICAgXCI2NzZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRyaW5pZGFkIGFuZCBUb2JhZ29cIixcclxuICAgICAgICBcInR0XCIsXHJcbiAgICAgICAgXCIxODY4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUdW5pc2lhICjigKvYqtmI2YbYs+KArOKAjilcIixcclxuICAgICAgICBcInRuXCIsXHJcbiAgICAgICAgXCIyMTZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlR1cmtleSAoVMO8cmtpeWUpXCIsXHJcbiAgICAgICAgXCJ0clwiLFxyXG4gICAgICAgIFwiOTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlR1cmttZW5pc3RhblwiLFxyXG4gICAgICAgIFwidG1cIixcclxuICAgICAgICBcIjk5M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVHVya3MgYW5kIENhaWNvcyBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJ0Y1wiLFxyXG4gICAgICAgIFwiMTY0OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVHV2YWx1XCIsXHJcbiAgICAgICAgXCJ0dlwiLFxyXG4gICAgICAgIFwiNjg4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJVLlMuIFZpcmdpbiBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJ2aVwiLFxyXG4gICAgICAgIFwiMTM0MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVWdhbmRhXCIsXHJcbiAgICAgICAgXCJ1Z1wiLFxyXG4gICAgICAgIFwiMjU2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJVa3JhaW5lICjQo9C60YDQsNGX0L3QsClcIixcclxuICAgICAgICBcInVhXCIsXHJcbiAgICAgICAgXCIzODBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlVuaXRlZCBBcmFiIEVtaXJhdGVzICjigKvYp9mE2KXZhdin2LHYp9iqINin2YTYudix2KjZitipINin2YTZhdiq2K3Yr9ip4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiYWVcIixcclxuICAgICAgICBcIjk3MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVW5pdGVkIEtpbmdkb21cIixcclxuICAgICAgICBcImdiXCIsXHJcbiAgICAgICAgXCI0NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVW5pdGVkIFN0YXRlc1wiLFxyXG4gICAgICAgIFwidXNcIixcclxuICAgICAgICBcIjFcIixcclxuICAgICAgICAwXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVXJ1Z3VheVwiLFxyXG4gICAgICAgIFwidXlcIixcclxuICAgICAgICBcIjU5OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVXpiZWtpc3RhbiAoT8q7emJla2lzdG9uKVwiLFxyXG4gICAgICAgIFwidXpcIixcclxuICAgICAgICBcIjk5OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVmFudWF0dVwiLFxyXG4gICAgICAgIFwidnVcIixcclxuICAgICAgICBcIjY3OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVmF0aWNhbiBDaXR5IChDaXR0w6AgZGVsIFZhdGljYW5vKVwiLFxyXG4gICAgICAgIFwidmFcIixcclxuICAgICAgICBcIjM5XCIsXHJcbiAgICAgICAgMVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlZlbmV6dWVsYVwiLFxyXG4gICAgICAgIFwidmVcIixcclxuICAgICAgICBcIjU4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJWaWV0bmFtIChWaeG7h3QgTmFtKVwiLFxyXG4gICAgICAgIFwidm5cIixcclxuICAgICAgICBcIjg0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJXYWxsaXMgYW5kIEZ1dHVuYVwiLFxyXG4gICAgICAgIFwid2ZcIixcclxuICAgICAgICBcIjY4MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiWWVtZW4gKOKAq9in2YTZitmF2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJ5ZVwiLFxyXG4gICAgICAgIFwiOTY3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJaYW1iaWFcIixcclxuICAgICAgICBcInptXCIsXHJcbiAgICAgICAgXCIyNjBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlppbWJhYndlXCIsXHJcbiAgICAgICAgXCJ6d1wiLFxyXG4gICAgICAgIFwiMjYzXCJcclxuICAgIF1cclxuXTtcclxuXHJcbnZhciBvcHRpb25zID0gW107XHJcblxyXG4vLyBsb29wIG92ZXIgYWxsIG9mIHRoZSBjb3VudHJpZXMgYWJvdmVcclxuZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxDb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBjID0gYWxsQ291bnRyaWVzW2ldO1xyXG4gICAgb3B0aW9uc1tpXSA9IHtcclxuICAgICAgICBpZDogJysnICsgY1syXSxcclxuICAgICAgICB2YWx1ZTogJysnICsgY1syXSxcclxuICAgICAgICB0ZXh0OiBjWzBdICsgJyA8c3BhbiBjbGFzcz1cInNtYWxsXCI+KycgKyBjWzJdICsgJzwvc3Bhbj4nLFxyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50LmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiBNT0JJTEUgPyAnPGRpdiBjbGFzcz1cInNlbGVjdFwiPjwvZGl2PicgOiByZXF1aXJlKCd0ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL3NlbGVjdC5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKE1PQklMRSkge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMuZmluZCgnLnNlbGVjdCcpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGRlYm91bmNlLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQgPSBvcHRpb25zLnNsaWNlKCksXHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9ICcnLFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDtcclxuXHJcbiAgICAgICAgICAgIGVsLm1vYmlzY3JvbGwoKS5zZWxlY3Qoe1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW10sXHJcbiAgICAgICAgICAgICAgICB0aGVtZTogJ21vYmlzY3JvbGwnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ3RvcCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6ICcrOTEnLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0OiAnbGlxdWlkJyxcclxuICAgICAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgcm93czogMyxcclxuICAgICAgICAgICAgICAgIG9uTWFya3VwUmVhZHk6IGZ1bmN0aW9uIChtYXJrdXAsIGluc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCc8ZGl2IHN0eWxlPVwicGFkZGluZzouNWVtXCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJtZC1maWx0ZXItaW5wdXRcIiB2YWx1ZT1cIis5MVwiIHRhYmluZGV4PVwiMFwiIHBsYWNlaG9sZGVyPVwiQ291bnRyeSBjb2RlXCIgLz48L2Rpdj4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucHJlcGVuZFRvKCQoJy5kd2NjJywgbWFya3VwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhhdCA9ICQoJ2lucHV0JywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZGVib3VuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVib3VuY2UgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHRoYXQudmFsKCkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSAkLmdyZXAob3B0aW9ucywgZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLmlkLmluZGV4T2YocXVlcnkpID4gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MuZGF0YSA9IGZpbHRlcmVkLmxlbmd0aCA/IGZpbHRlcmVkIDogW3t0ZXh0OiAnTm8gcmVzdWx0cycsIHZhbHVlOiAnJ31dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MucGFyc2VWYWx1ZShpbnN0LnNldHRpbmdzLmRhdGFbMF0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3QucmVmcmVzaCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25CZWZvcmVTaG93OiBmdW5jdGlvbiAoaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MuZGF0YSA9IG9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uICh2LCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSAkKCc8c3Bhbj4nICsgdiArICc8L3NwYW4+JykuZmluZCgnLnNtYWxsJykudGV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndmFsdWUnLCBjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcubWJzYy1jb250cm9sJywgdmlldy5lbCkudmFsKGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLm1ic2MtY29udHJvbCcsIHZpZXcuZWwpLnZhbCh2KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5tYnNjLWNvbnRyb2wnLCB2aWV3LmVsKS52YWwodmlldy5nZXQoJ3ZhbHVlJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMuZmluZCgnLnVpLmRyb3Bkb3duJykpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRyb3Bkb3duKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFRleHRTZWFyY2g6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kcm9wZG93bignaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd2YWx1ZScsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZSgndmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5kZWxheShmdW5jdGlvbigpIHsgaWYgKHZpZXcuZ2V0KCdlcnJvcicpKSB2aWV3LnNldCgnZXJyb3InLCBmYWxzZSkgfSwgNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXQoJ29wdGlvbnMnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IF8uZmluZChvcHRpb25zLCB7aWQ6IHZhbHVlfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuZHJvcGRvd24oJ3NldCB2YWx1ZScsIG8uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuZHJvcGRvd24oJ3NldCB0ZXh0Jywgby5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbC5kcm9wZG93bigncmVzdG9yZSBkZWZhdWx0cycpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmluZCgnLnNlYXJjaCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmluZCgnLnNlYXJjaCcpKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGUud2hpY2ggPT0gMTMgKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy5zZXQoJ29wdGlvbnMnLCBudWxsKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9jb2RlLmpzXG4gKiogbW9kdWxlIGlkID0gNzlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIG1haWxjaGVjayA9IHJlcXVpcmUoJ21haWxjaGVjaycpO1xyXG5cclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHlwZTogJ2VtYWlsJ1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcblxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSlcclxuICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm1haWxjaGVjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGVkOiBmdW5jdGlvbihlbGVtZW50LCBzdWdnZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWdnZXN0aW9uJywgc3VnZ2VzdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VnZ2VzdGlvbicsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgY29ycmVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgdGhpcy5nZXQoJ3N1Z2dlc3Rpb24uZnVsbCcpKTtcclxuICAgICAgICB0aGlzLnNldCgnc3VnZ2VzdGlvbicsIG51bGwpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL2VtYWlsLmpzXG4gKiogbW9kdWxlIGlkID0gODBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDYgN1xuICoqLyIsIi8qXG4gKiBNYWlsY2hlY2sgaHR0cHM6Ly9naXRodWIuY29tL21haWxjaGVjay9tYWlsY2hlY2tcbiAqIEF1dGhvclxuICogRGVycmljayBLbyAoQGRlcnJpY2trbylcbiAqXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKlxuICogdiAxLjEuMVxuICovXG5cbnZhciBNYWlsY2hlY2sgPSB7XG4gIGRvbWFpblRocmVzaG9sZDogMixcbiAgc2Vjb25kTGV2ZWxUaHJlc2hvbGQ6IDIsXG4gIHRvcExldmVsVGhyZXNob2xkOiAyLFxuXG4gIGRlZmF1bHREb21haW5zOiBbJ21zbi5jb20nLCAnYmVsbHNvdXRoLm5ldCcsXG4gICAgJ3RlbHVzLm5ldCcsICdjb21jYXN0Lm5ldCcsICdvcHR1c25ldC5jb20uYXUnLFxuICAgICdlYXJ0aGxpbmsubmV0JywgJ3FxLmNvbScsICdza3kuY29tJywgJ2ljbG91ZC5jb20nLFxuICAgICdtYWMuY29tJywgJ3N5bXBhdGljby5jYScsICdnb29nbGVtYWlsLmNvbScsXG4gICAgJ2F0dC5uZXQnLCAneHRyYS5jby5ueicsICd3ZWIuZGUnLFxuICAgICdjb3gubmV0JywgJ2dtYWlsLmNvbScsICd5bWFpbC5jb20nLFxuICAgICdhaW0uY29tJywgJ3JvZ2Vycy5jb20nLCAndmVyaXpvbi5uZXQnLFxuICAgICdyb2NrZXRtYWlsLmNvbScsICdnb29nbGUuY29tJywgJ29wdG9ubGluZS5uZXQnLFxuICAgICdzYmNnbG9iYWwubmV0JywgJ2FvbC5jb20nLCAnbWUuY29tJywgJ2J0aW50ZXJuZXQuY29tJyxcbiAgICAnY2hhcnRlci5uZXQnLCAnc2hhdy5jYSddLFxuXG4gIGRlZmF1bHRTZWNvbmRMZXZlbERvbWFpbnM6IFtcInlhaG9vXCIsIFwiaG90bWFpbFwiLCBcIm1haWxcIiwgXCJsaXZlXCIsIFwib3V0bG9va1wiLCBcImdteFwiXSxcblxuICBkZWZhdWx0VG9wTGV2ZWxEb21haW5zOiBbXCJjb21cIiwgXCJjb20uYXVcIiwgXCJjb20udHdcIiwgXCJjYVwiLCBcImNvLm56XCIsIFwiY28udWtcIiwgXCJkZVwiLFxuICAgIFwiZnJcIiwgXCJpdFwiLCBcInJ1XCIsIFwibmV0XCIsIFwib3JnXCIsIFwiZWR1XCIsIFwiZ292XCIsIFwianBcIiwgXCJubFwiLCBcImtyXCIsIFwic2VcIiwgXCJldVwiLFxuICAgIFwiaWVcIiwgXCJjby5pbFwiLCBcInVzXCIsIFwiYXRcIiwgXCJiZVwiLCBcImRrXCIsIFwiaGtcIiwgXCJlc1wiLCBcImdyXCIsIFwiY2hcIiwgXCJub1wiLCBcImN6XCIsXG4gICAgXCJpblwiLCBcIm5ldFwiLCBcIm5ldC5hdVwiLCBcImluZm9cIiwgXCJiaXpcIiwgXCJtaWxcIiwgXCJjby5qcFwiLCBcInNnXCIsIFwiaHVcIl0sXG5cbiAgcnVuOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgb3B0cy5kb21haW5zID0gb3B0cy5kb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0RG9tYWlucztcbiAgICBvcHRzLnNlY29uZExldmVsRG9tYWlucyA9IG9wdHMuc2Vjb25kTGV2ZWxEb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0U2Vjb25kTGV2ZWxEb21haW5zO1xuICAgIG9wdHMudG9wTGV2ZWxEb21haW5zID0gb3B0cy50b3BMZXZlbERvbWFpbnMgfHwgTWFpbGNoZWNrLmRlZmF1bHRUb3BMZXZlbERvbWFpbnM7XG4gICAgb3B0cy5kaXN0YW5jZUZ1bmN0aW9uID0gb3B0cy5kaXN0YW5jZUZ1bmN0aW9uIHx8IE1haWxjaGVjay5zaWZ0M0Rpc3RhbmNlO1xuXG4gICAgdmFyIGRlZmF1bHRDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc3VsdCl7IHJldHVybiByZXN1bHQgfTtcbiAgICB2YXIgc3VnZ2VzdGVkQ2FsbGJhY2sgPSBvcHRzLnN1Z2dlc3RlZCB8fCBkZWZhdWx0Q2FsbGJhY2s7XG4gICAgdmFyIGVtcHR5Q2FsbGJhY2sgPSBvcHRzLmVtcHR5IHx8IGRlZmF1bHRDYWxsYmFjaztcblxuICAgIHZhciByZXN1bHQgPSBNYWlsY2hlY2suc3VnZ2VzdChNYWlsY2hlY2suZW5jb2RlRW1haWwob3B0cy5lbWFpbCksIG9wdHMuZG9tYWlucywgb3B0cy5zZWNvbmRMZXZlbERvbWFpbnMsIG9wdHMudG9wTGV2ZWxEb21haW5zLCBvcHRzLmRpc3RhbmNlRnVuY3Rpb24pO1xuXG4gICAgcmV0dXJuIHJlc3VsdCA/IHN1Z2dlc3RlZENhbGxiYWNrKHJlc3VsdCkgOiBlbXB0eUNhbGxiYWNrKClcbiAgfSxcblxuICBzdWdnZXN0OiBmdW5jdGlvbihlbWFpbCwgZG9tYWlucywgc2Vjb25kTGV2ZWxEb21haW5zLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24pIHtcbiAgICBlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB2YXIgZW1haWxQYXJ0cyA9IHRoaXMuc3BsaXRFbWFpbChlbWFpbCk7XG5cbiAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zICYmIHRvcExldmVsRG9tYWlucykge1xuICAgICAgICAvLyBJZiB0aGUgZW1haWwgaXMgYSB2YWxpZCAybmQtbGV2ZWwgKyB0b3AtbGV2ZWwsIGRvIG5vdCBzdWdnZXN0IGFueXRoaW5nLlxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zLmluZGV4T2YoZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbikgIT09IC0xICYmIHRvcExldmVsRG9tYWlucy5pbmRleE9mKGVtYWlsUGFydHMudG9wTGV2ZWxEb21haW4pICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNsb3Nlc3REb21haW4gPSB0aGlzLmZpbmRDbG9zZXN0RG9tYWluKGVtYWlsUGFydHMuZG9tYWluLCBkb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLmRvbWFpblRocmVzaG9sZCk7XG5cbiAgICBpZiAoY2xvc2VzdERvbWFpbikge1xuICAgICAgaWYgKGNsb3Nlc3REb21haW4gPT0gZW1haWxQYXJ0cy5kb21haW4pIHtcbiAgICAgICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgZXhhY3RseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWluczsgZG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24uXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGNsb3NlbHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnM7IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgcmV0dXJuIHsgYWRkcmVzczogZW1haWxQYXJ0cy5hZGRyZXNzLCBkb21haW46IGNsb3Nlc3REb21haW4sIGZ1bGw6IGVtYWlsUGFydHMuYWRkcmVzcyArIFwiQFwiICsgY2xvc2VzdERvbWFpbiB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGRvZXMgbm90IGNsb3NlbHkgbWF0Y2ggb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zXG4gICAgdmFyIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiA9IHRoaXMuZmluZENsb3Nlc3REb21haW4oZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbiwgc2Vjb25kTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLnNlY29uZExldmVsVGhyZXNob2xkKTtcbiAgICB2YXIgY2xvc2VzdFRvcExldmVsRG9tYWluICAgID0gdGhpcy5maW5kQ2xvc2VzdERvbWFpbihlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRoaXMudG9wTGV2ZWxUaHJlc2hvbGQpO1xuXG4gICAgaWYgKGVtYWlsUGFydHMuZG9tYWluKSB7XG4gICAgICB2YXIgY2xvc2VzdERvbWFpbiA9IGVtYWlsUGFydHMuZG9tYWluO1xuICAgICAgdmFyIHJ0cm4gPSBmYWxzZTtcblxuICAgICAgaWYoY2xvc2VzdFNlY29uZExldmVsRG9tYWluICYmIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHNlY29uZC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluLCBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4pO1xuICAgICAgICBydHJuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYoY2xvc2VzdFRvcExldmVsRG9tYWluICYmIGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHRvcC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluLCBjbG9zZXN0VG9wTGV2ZWxEb21haW4pO1xuICAgICAgICBydHJuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJ0cm4gPT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4geyBhZGRyZXNzOiBlbWFpbFBhcnRzLmFkZHJlc3MsIGRvbWFpbjogY2xvc2VzdERvbWFpbiwgZnVsbDogZW1haWxQYXJ0cy5hZGRyZXNzICsgXCJAXCIgKyBjbG9zZXN0RG9tYWluIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogVGhlIGVtYWlsIGFkZHJlc3MgZXhhY3RseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWlucywgZG9lcyBub3QgY2xvc2VseVxuICAgICAqIG1hdGNoIGFueSBkb21haW4gYW5kIGRvZXMgbm90IGFwcGVhciB0byBzaW1wbHkgaGF2ZSBhIG1pc3BlbGxlZCB0b3AtbGV2ZWwgZG9tYWluLFxuICAgICAqIG9yIGlzIGFuIGludmFsaWQgZW1haWwgYWRkcmVzczsgZG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24uXG4gICAgICovXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIGZpbmRDbG9zZXN0RG9tYWluOiBmdW5jdGlvbihkb21haW4sIGRvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRocmVzaG9sZCkge1xuICAgIHRocmVzaG9sZCA9IHRocmVzaG9sZCB8fCB0aGlzLnRvcExldmVsVGhyZXNob2xkO1xuICAgIHZhciBkaXN0O1xuICAgIHZhciBtaW5EaXN0ID0gOTk7XG4gICAgdmFyIGNsb3Nlc3REb21haW4gPSBudWxsO1xuXG4gICAgaWYgKCFkb21haW4gfHwgIWRvbWFpbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoIWRpc3RhbmNlRnVuY3Rpb24pIHtcbiAgICAgIGRpc3RhbmNlRnVuY3Rpb24gPSB0aGlzLnNpZnQzRGlzdGFuY2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkb21haW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZG9tYWluID09PSBkb21haW5zW2ldKSB7XG4gICAgICAgIHJldHVybiBkb21haW47XG4gICAgICB9XG4gICAgICBkaXN0ID0gZGlzdGFuY2VGdW5jdGlvbihkb21haW4sIGRvbWFpbnNbaV0pO1xuICAgICAgaWYgKGRpc3QgPCBtaW5EaXN0KSB7XG4gICAgICAgIG1pbkRpc3QgPSBkaXN0O1xuICAgICAgICBjbG9zZXN0RG9tYWluID0gZG9tYWluc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWluRGlzdCA8PSB0aHJlc2hvbGQgJiYgY2xvc2VzdERvbWFpbiAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNsb3Nlc3REb21haW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgc2lmdDNEaXN0YW5jZTogZnVuY3Rpb24oczEsIHMyKSB7XG4gICAgLy8gc2lmdDM6IGh0dHA6Ly9zaWRlcml0ZS5ibG9nc3BvdC5jb20vMjAwNy8wNC9zdXBlci1mYXN0LWFuZC1hY2N1cmF0ZS1zdHJpbmctZGlzdGFuY2UuaHRtbFxuICAgIGlmIChzMSA9PSBudWxsIHx8IHMxLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHMyID09IG51bGwgfHwgczIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHMyLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoczIgPT0gbnVsbCB8fCBzMi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBzMS5sZW5ndGg7XG4gICAgfVxuXG4gICAgdmFyIGMgPSAwO1xuICAgIHZhciBvZmZzZXQxID0gMDtcbiAgICB2YXIgb2Zmc2V0MiA9IDA7XG4gICAgdmFyIGxjcyA9IDA7XG4gICAgdmFyIG1heE9mZnNldCA9IDU7XG5cbiAgICB3aGlsZSAoKGMgKyBvZmZzZXQxIDwgczEubGVuZ3RoKSAmJiAoYyArIG9mZnNldDIgPCBzMi5sZW5ndGgpKSB7XG4gICAgICBpZiAoczEuY2hhckF0KGMgKyBvZmZzZXQxKSA9PSBzMi5jaGFyQXQoYyArIG9mZnNldDIpKSB7XG4gICAgICAgIGxjcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0MSA9IDA7XG4gICAgICAgIG9mZnNldDIgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heE9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgaWYgKChjICsgaSA8IHMxLmxlbmd0aCkgJiYgKHMxLmNoYXJBdChjICsgaSkgPT0gczIuY2hhckF0KGMpKSkge1xuICAgICAgICAgICAgb2Zmc2V0MSA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChjICsgaSA8IHMyLmxlbmd0aCkgJiYgKHMxLmNoYXJBdChjKSA9PSBzMi5jaGFyQXQoYyArIGkpKSkge1xuICAgICAgICAgICAgb2Zmc2V0MiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGMrKztcbiAgICB9XG4gICAgcmV0dXJuIChzMS5sZW5ndGggKyBzMi5sZW5ndGgpIC8yIC0gbGNzO1xuICB9LFxuXG4gIHNwbGl0RW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgdmFyIHBhcnRzID0gZW1haWwudHJpbSgpLnNwbGl0KCdAJyk7XG5cbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwYXJ0c1tpXSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkb21haW4gPSBwYXJ0cy5wb3AoKTtcbiAgICB2YXIgZG9tYWluUGFydHMgPSBkb21haW4uc3BsaXQoJy4nKTtcbiAgICB2YXIgc2xkID0gJyc7XG4gICAgdmFyIHRsZCA9ICcnO1xuXG4gICAgaWYgKGRvbWFpblBhcnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBkb2VzIG5vdCBoYXZlIGEgdG9wLWxldmVsIGRvbWFpblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZG9tYWluUGFydHMubGVuZ3RoID09IDEpIHtcbiAgICAgIC8vIFRoZSBhZGRyZXNzIGhhcyBvbmx5IGEgdG9wLWxldmVsIGRvbWFpbiAodmFsaWQgdW5kZXIgUkZDKVxuICAgICAgdGxkID0gZG9tYWluUGFydHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBhZGRyZXNzIGhhcyBhIGRvbWFpbiBhbmQgYSB0b3AtbGV2ZWwgZG9tYWluXG4gICAgICBzbGQgPSBkb21haW5QYXJ0c1swXTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZG9tYWluUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGxkICs9IGRvbWFpblBhcnRzW2ldICsgJy4nO1xuICAgICAgfVxuICAgICAgdGxkID0gdGxkLnN1YnN0cmluZygwLCB0bGQubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcExldmVsRG9tYWluOiB0bGQsXG4gICAgICBzZWNvbmRMZXZlbERvbWFpbjogc2xkLFxuICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICBhZGRyZXNzOiBwYXJ0cy5qb2luKCdAJylcbiAgICB9XG4gIH0sXG5cbiAgLy8gRW5jb2RlIHRoZSBlbWFpbCBhZGRyZXNzIHRvIHByZXZlbnQgWFNTIGJ1dCBsZWF2ZSBpbiB2YWxpZFxuICAvLyBjaGFyYWN0ZXJzLCBmb2xsb3dpbmcgdGhpcyBvZmZpY2lhbCBzcGVjOlxuICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0VtYWlsX2FkZHJlc3MjU3ludGF4XG4gIGVuY29kZUVtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgIHZhciByZXN1bHQgPSBlbmNvZGVVUkkoZW1haWwpO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCclMjAnLCAnICcpLnJlcGxhY2UoJyUyNScsICclJykucmVwbGFjZSgnJTVFJywgJ14nKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclNjAnLCAnYCcpLnJlcGxhY2UoJyU3QicsICd7JykucmVwbGFjZSgnJTdDJywgJ3wnKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclN0QnLCAnfScpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5cbi8vIEV4cG9ydCB0aGUgbWFpbGNoZWNrIG9iamVjdCBpZiB3ZSdyZSBpbiBhIENvbW1vbkpTIGVudiAoZS5nLiBOb2RlKS5cbi8vIE1vZGVsZWQgb2ZmIG9mIFVuZGVyc2NvcmUuanMuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haWxjaGVjaztcbn1cblxuLy8gU3VwcG9ydCBBTUQgc3R5bGUgZGVmaW5pdGlvbnNcbi8vIEJhc2VkIG9uIGpRdWVyeSAoc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE3OTU0ODgyLzEzMjI0MTApXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKFwibWFpbGNoZWNrXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWFpbGNoZWNrO1xuICB9KTtcbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qUXVlcnkpIHtcbiAgKGZ1bmN0aW9uKCQpe1xuICAgICQuZm4ubWFpbGNoZWNrID0gZnVuY3Rpb24ob3B0cykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKG9wdHMuc3VnZ2VzdGVkKSB7XG4gICAgICAgIHZhciBvbGRTdWdnZXN0ZWQgPSBvcHRzLnN1Z2dlc3RlZDtcbiAgICAgICAgb3B0cy5zdWdnZXN0ZWQgPSBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICBvbGRTdWdnZXN0ZWQoc2VsZiwgcmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMuZW1wdHkpIHtcbiAgICAgICAgdmFyIG9sZEVtcHR5ID0gb3B0cy5lbXB0eTtcbiAgICAgICAgb3B0cy5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG9sZEVtcHR5LmNhbGwobnVsbCwgc2VsZik7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9wdHMuZW1haWwgPSB0aGlzLnZhbCgpO1xuICAgICAgTWFpbGNoZWNrLnJ1bihvcHRzKTtcbiAgICB9XG4gIH0pKGpRdWVyeSk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL21haWxjaGVjay9zcmMvbWFpbGNoZWNrLmpzXG4gKiogbW9kdWxlIGlkID0gODFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDYgN1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyk7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMi5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIHBhc3NlbmdlcjogcmVxdWlyZSgnY29tcG9uZW50cy9wYXNzZW5nZXInKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBxYTogd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdxYScpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ2Jvb2tpbmcuc3RlcHMuMi5hY3RpdmUnLCBmdW5jdGlvbihhY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Njcm9sbCB0byB0b3AnKTtcclxuICAgICAgICBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy90cmF2ZWxlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgYm9va2luZ19pZDogdGhpcy5nZXQoJ2Jvb2tpbmcuaWQnKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dvdCB0cmF2ZWxlcnMnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd0cmF2ZWxlcnMnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHN1Ym1pdDogZnVuY3Rpb24oKSB7IHRoaXMuZ2V0KCdib29raW5nJykuc3RlcDIoKSB9LFxyXG5cclxuICAgIGNoZWNrQXZhaWxhYmlsaXR5OiBmdW5jdGlvbigpIHsgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5zdGVwMih7Y2hlY2s6IHRydWV9KSB9LFxyXG5cclxuICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpIHsgaWYgKCF0aGlzLmdldCgnYm9va2luZy5wYXltZW50LnBheW1lbnRfaWQnKSkgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5hY3RpdmF0ZSgyKTsgfSxcclxuXHJcbiAgICBiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmdldCgnYm9va2luZycpLmFjdGl2YXRlKDEpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxufSk7XHJcblxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuanNcbiAqKiBtb2R1bGUgaWQgPSA4MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGVwIGhlYWRlciBzdGVwMiBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiY29tcGxldGVkXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5jb21wbGV0ZWRcIn1dLFwiclwiOlwic3RlcC5hY3RpdmVcIn1dLFwicm9sZVwiOlwidGFiXCJ9LFwiZlwiOltcIlBhc3NlbmdlcnNcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzdGVwMi1zdW1tYXJ5IHNlZ21lbnRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJhY3RpdmF0ZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIlsyXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBob3Jpem9udGFsIGxpc3RcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwidXNlciBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLmZpcnN0bmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLmxhc3RuYW1lXCJ9XX1dfV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJib29raW5nLnBhc3NlbmdlcnNcIn1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic3RlcC5jb21wbGV0ZWRcIixcInN0ZXAuYWN0aXZlXCJdLFwic1wiOlwiXzAmJiFfMVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpbXCJ1aSBmb3JtIHNlZ21lbnQgc3RlcDIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5zdWJtaXR0aW5nXCJ9XX0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3Nlbmdlci1oZWFkZXIgaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwibWV0YS50cmF2ZWxlclR5cGVzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcInR5cGVfaWRcIn1dfX0sXCIoXCIse1widFwiOjIsXCJyXCI6XCJub1wifSxcIikqXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBhc3NlbmdlclwiLFwiYVwiOntcImNsYXNzXCI6XCJiYXNpY1wiLFwidmFsaWRhdGlvblwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcucGFzc2VuZ2VyVmFsaWRhdG9uXCJ9XSxcInRyYXZlbGVyc1wiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyc1wifV0sXCJwYXNzZW5nZXJcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XSxcImVycm9yc1wiOlt7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwic3RlcC5lcnJvcnNcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifV19fV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJib29raW5nLnBhc3NlbmdlcnNcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgb25lIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwidWkgd2l6YXJkIGJ1dHRvbiBtYXNzaXZlIGJsdWVcIn0sXCJmXCI6W1wiQ09OVElOVUVcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIHdpemFyZCBidXR0b24gbWFzc2l2ZSByZWRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJjaGVja0F2YWlsYWJpbGl0eVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiQ0hFQ0tcIl19XSxcIm5cIjo1MCxcInJcIjpcInFhXCJ9XX1dfV19XX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5hY3RpdmVcIn1dLFwieFwiOntcInJcIjpbXCJzdGVwLmNvbXBsZXRlZFwiLFwic3RlcC5hY3RpdmVcIl0sXCJzXCI6XCJfMCYmIV8xXCJ9fV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuc3RlcHMuMlwiXSxcInNcIjpcIntzdGVwOl8wfVwifX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMi5odG1sXG4gKiogbW9kdWxlIGlkID0gODNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuIFxyXG4gICAgO1xyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL3Bhc3Nlbmdlci5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgbW9iaWxlc2VsZWN0OiByZXF1aXJlKCdjb3JlL2Zvcm0vbW9iaWxlc2VsZWN0JyksXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIF86IF8sXHJcbiAgICAgICAgICAgIGRhdGVzdXBwb3J0ZWQ6dHJ1ZSxcclxuICAgICAgICAgICAgYWxsOiBmYWxzZSxcclxuICAgICAgICAgICAgZGF0ZTogcmVxdWlyZSgnaGVscGVycy9kYXRlJykoKSxcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24odGVybSwgdHJhdmVsZXJzKSB7XHJcbiAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKCdzZWFyY2gnLCBhcmd1bWVudHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRlcm0gPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVybSAmJiB0cmF2ZWxlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIodHJhdmVsZXJzLCBmdW5jdGlvbihpKSB7IHJldHVybiAtMSAhPT0gKGkuZmlyc3RuYW1lICsgJyAnICsgaS5sYXN0bmFtZSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0pOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYXZlbGVycyA/IHRyYXZlbGVycy5zbGljZSgwLCA0KSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAhZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIGEoZSx0KXtyZXR1cm4gdHlwZW9mIGU9PT10fWZ1bmN0aW9uIHMoZSl7dmFyIHQ9ci5jbGFzc05hbWUsbj1Nb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeHx8XCJcIjtpZihjJiYodD10LmJhc2VWYWwpLE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUpTQ2xhc3Mpe3ZhciBhPW5ldyBSZWdFeHAoXCIoXnxcXFxccylcIituK1wibm8tanMoXFxcXHN8JClcIik7dD10LnJlcGxhY2UoYSxcIiQxXCIrbitcImpzJDJcIil9TW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3NlcyYmKHQrPVwiIFwiK24rZS5qb2luKFwiIFwiK24pLGM/ci5jbGFzc05hbWUuYmFzZVZhbD10OnIuY2xhc3NOYW1lPXQpfWZ1bmN0aW9uIGkoKXt2YXIgZSx0LG4scyxpLG8scjtmb3IodmFyIGMgaW4gdSl7aWYoZT1bXSx0PXVbY10sdC5uYW1lJiYoZS5wdXNoKHQubmFtZS50b0xvd2VyQ2FzZSgpKSx0Lm9wdGlvbnMmJnQub3B0aW9ucy5hbGlhc2VzJiZ0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGgpKWZvcihuPTA7bjx0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGg7bisrKWUucHVzaCh0Lm9wdGlvbnMuYWxpYXNlc1tuXS50b0xvd2VyQ2FzZSgpKTtmb3Iocz1hKHQuZm4sXCJmdW5jdGlvblwiKT90LmZuKCk6dC5mbixpPTA7aTxlLmxlbmd0aDtpKyspbz1lW2ldLHI9by5zcGxpdChcIi5cIiksMT09PXIubGVuZ3RoP01vZGVybml6cltyWzBdXT1zOighTW9kZXJuaXpyW3JbMF1dfHxNb2Rlcm5penJbclswXV1pbnN0YW5jZW9mIEJvb2xlYW58fChNb2Rlcm5penJbclswXV09bmV3IEJvb2xlYW4oTW9kZXJuaXpyW3JbMF1dKSksTW9kZXJuaXpyW3JbMF1dW3JbMV1dPXMpLGwucHVzaCgocz9cIlwiOlwibm8tXCIpK3Iuam9pbihcIi1cIikpfX1mdW5jdGlvbiBvKCl7cmV0dXJuXCJmdW5jdGlvblwiIT10eXBlb2YgdC5jcmVhdGVFbGVtZW50P3QuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pOmM/dC5jcmVhdGVFbGVtZW50TlMuY2FsbCh0LFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixhcmd1bWVudHNbMF0pOnQuY3JlYXRlRWxlbWVudC5hcHBseSh0LGFyZ3VtZW50cyl9dmFyIGw9W10scj10LmRvY3VtZW50RWxlbWVudCxjPVwic3ZnXCI9PT1yLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksdT1bXSxmPXtfdmVyc2lvbjpcIjMuMC4wLWFscGhhLjRcIixfY29uZmlnOntjbGFzc1ByZWZpeDpcIlwiLGVuYWJsZUNsYXNzZXM6ITAsZW5hYmxlSlNDbGFzczohMCx1c2VQcmVmaXhlczohMH0sX3E6W10sb246ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0KG5bZV0pfSwwKX0sYWRkVGVzdDpmdW5jdGlvbihlLHQsbil7dS5wdXNoKHtuYW1lOmUsZm46dCxvcHRpb25zOm59KX0sYWRkQXN5bmNUZXN0OmZ1bmN0aW9uKGUpe3UucHVzaCh7bmFtZTpudWxsLGZuOmV9KX19LE1vZGVybml6cj1mdW5jdGlvbigpe307TW9kZXJuaXpyLnByb3RvdHlwZT1mLE1vZGVybml6cj1uZXcgTW9kZXJuaXpyO3ZhciBwPW8oXCJpbnB1dFwiKSxkPVwic2VhcmNoIHRlbCB1cmwgZW1haWwgZGF0ZXRpbWUgZGF0ZSBtb250aCB3ZWVrIHRpbWUgZGF0ZXRpbWUtbG9jYWwgbnVtYmVyIHJhbmdlIGNvbG9yXCIuc3BsaXQoXCIgXCIpLG09e307TW9kZXJuaXpyLmlucHV0dHlwZXM9ZnVuY3Rpb24oZSl7Zm9yKHZhciBhLHMsaSxvPWUubGVuZ3RoLGw9XCI6KVwiLGM9MDtvPmM7YysrKXAuc2V0QXR0cmlidXRlKFwidHlwZVwiLGE9ZVtjXSksaT1cInRleHRcIiE9PXAudHlwZSYmXCJzdHlsZVwiaW4gcCxpJiYocC52YWx1ZT1sLHAuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmFic29sdXRlO3Zpc2liaWxpdHk6aGlkZGVuO1wiLC9ecmFuZ2UkLy50ZXN0KGEpJiZwLnN0eWxlLldlYmtpdEFwcGVhcmFuY2UhPT1uPyhyLmFwcGVuZENoaWxkKHApLHM9dC5kZWZhdWx0VmlldyxpPXMuZ2V0Q29tcHV0ZWRTdHlsZSYmXCJ0ZXh0ZmllbGRcIiE9PXMuZ2V0Q29tcHV0ZWRTdHlsZShwLG51bGwpLldlYmtpdEFwcGVhcmFuY2UmJjAhPT1wLm9mZnNldEhlaWdodCxyLnJlbW92ZUNoaWxkKHApKTovXihzZWFyY2h8dGVsKSQvLnRlc3QoYSl8fChpPS9eKHVybHxlbWFpbHxudW1iZXIpJC8udGVzdChhKT9wLmNoZWNrVmFsaWRpdHkmJnAuY2hlY2tWYWxpZGl0eSgpPT09ITE6cC52YWx1ZSE9bCkpLG1bZVtjXV09ISFpO3JldHVybiBtfShkKSxpKCkscyhsKSxkZWxldGUgZi5hZGRUZXN0LGRlbGV0ZSBmLmFkZEFzeW5jVGVzdDtmb3IodmFyIGc9MDtnPE1vZGVybml6ci5fcS5sZW5ndGg7ZysrKU1vZGVybml6ci5fcVtnXSgpO2UuTW9kZXJuaXpyPU1vZGVybml6cn0od2luZG93LGRvY3VtZW50KTtcclxuICAgICAgICBpZiAoIU1vZGVybml6ci5pbnB1dHR5cGVzLmRhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ2RhdGVzdXBwb3J0ZWQnLGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8kKCBcIi5kb2JcIiApLmRhdGVwaWNrZXIoKTtcclxuICAgICAgXHJcbiAgICAgICAgaWYgKCFNT0JJTEUpIHtcclxuICAgICAgICAgICAgdmFyIGZuID0gJCh0aGlzLmZpbmQoJ2lucHV0LmZpcnN0bmFtZScpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5wb3B1cCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXA6ICQodGhpcy5maW5kKCcudHJhdmVsZXJzLnBvcHVwJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyOiAnb3Bwb3NpdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbigpIHsgZm4ucG9wdXAoJ3Nob3cnKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICAub24oJ2JsdXInLCBmdW5jdGlvbigpIHsgc2V0VGltZW91dChmdW5jdGlvbigpIHsgZm4ucG9wdXAoJ2hpZGUnKTsgfSwgMjAwKTsgfSlcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCd0cmF2ZWxlcnMnLCBmdW5jdGlvbih0cmF2ZWxlcnMpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRyYXZlbGVycyAmJiB0cmF2ZWxlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAkKCcudHBvcHVwJywgdmlldy5lbCkubW9iaXNjcm9sbCgpLnNlbGVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uICh2LCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IF8ucGFyc2VJbnQoJCgnLnRwb3B1cCcsIHZpZXcuZWwpLnZhbCgpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGVyID0gXy5maW5kV2hlcmUodmlldy5nZXQoJ3RyYXZlbGVycycpLCB7IGlkOiBpZCB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmF2ZWxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcucGlja1RyYXZlbGVyKHRyYXZlbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgJCh0aGlzKS5jbG9zZXN0KFwiLnBhc3NlbmdlcmNsYXNzXCIpLmZpbmQoJy50dCcpLnRleHQoXy5yZXN1bHQoXy5maW5kKHRpdGxlcywgeydpZCc6IHRyYXZlbGVyLnRpdGxlX2lkfSksICduYW1lJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgdmlldy5zZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci50aXRsZV9pZCcsdHJhdmVsZXIuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICBvblZhbHVlVGFwOiBmdW5jdGlvbiAodiwgaW5zdCkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2KTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codi5jb250ZXh0LmlubmVyVGV4dCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHYuY29udGV4dC5vdXRlckhUTUwpOyAgICAgXHJcbiAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHYuY29udGV4dC5hdHRyaWJ1dGVzWydkYXRhLXZhbCddLm5vZGVWYWx1ZSk7ICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gXy5wYXJzZUludCh2LmNvbnRleHQuYXR0cmlidXRlc1snZGF0YS12YWwnXS5ub2RlVmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhdmVsZXIgPSBfLmZpbmRXaGVyZSh2aWV3LmdldCgndHJhdmVsZXJzJyksIHsgaWQ6IGlkIH0pO1xyXG4gICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyh0cmF2ZWxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmF2ZWxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcucGlja1RyYXZlbGVyKHRyYXZlbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB2YXIgdGl0bGVzID0gdmlldy5nZXQoJ21ldGEudGl0bGVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICQodGhpcykuY2xvc2VzdChcIi5wYXNzZW5nZXJjbGFzc1wiKS5maW5kKCcudHQnKS50ZXh0KF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiB0cmF2ZWxlci50aXRsZV9pZH0pLCAnbmFtZScpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnRwb3B1cCcsIHZpZXcuZWwpLm1vYmlzY3JvbGwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4vLyAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiZG9iXCJdJykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcbi8vICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KHRoaXMudmFsdWUpOyAgICAgICAgIC8vRGF0ZSBpbiBmdWxsIGZvcm1hdCBhbGVydChuZXcgRGF0ZSh0aGlzLnZhbHVlKSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXREYXRlID0gdGhpcy52YWx1ZTsvL25ldyBEYXRlKHRoaXMudmFsdWUpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGU9aW5wdXREYXRlLnNwbGl0KFwiLVwiKTtcclxuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlucHV0RGF0ZSk7XHJcbi8vICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICB0cmF2ZWxlcnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgJCgnLnRwb3B1cCcsIHRoaXMuZWwpLm1vYmlzY3JvbGwoJ3Nob3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdGl0bGVzZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgJCgnLnRpdGxlcG9wdXAnLCB0aGlzLmVsKS5tb2Jpc2Nyb2xsKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNob3c6IGZ1bmN0aW9uKHNlY3Rpb24sIHZhbGlkYXRpb24sIGFsbCkge1xyXG4gICAgICAgIGlmIChhbGwpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoJ2JpcnRoJyA9PSBzZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnZG9tZXN0aWMnICE9ICd2YWxpZGF0aW9uJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgncGFzc3BvcnQnID09IHNlY3Rpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuICdmdWxsJyA9PSAndmFsaWRhdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwaWNrVHJhdmVsZXI6IGZ1bmN0aW9uKHRyYXZlbGVyKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICBpZCA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuaWQnKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKG5vKTtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0KCdwYXNzZW5nZXIudHJhdmVsZXInLCBudWxsKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwYXNzZW5nZXIudHJhdmVsZXInLCBfLmNsb25lRGVlcCh0cmF2ZWxlcikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzZXRkb2I6IGZ1bmN0aW9uKHRyYXZlbGVyKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0cmF2ZWxlcik7XHJcbiAgICAgICAgdmFyIG5vID0gXy5wYXJzZUludCh0cmF2ZWxlclsnbm8nXSk7XHJcbiAgICAgICAgdmFyIHQ9bm8tMTtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGVvZmJpcnRoPSQoXCIjZG9iX1wiK25vKS52YWwoKTtcclxuICAgICAgICB2YXIgZG9iPWRhdGVvZmJpcnRoLnNwbGl0KCctJyk7XHJcbiAgICAgICAgIHRoaXMuc2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGgnLCBkb2IpO1xyXG4gICAgfSxcclxuICAgIHNldGRvYnNpbXBsZTogZnVuY3Rpb24odHJhdmVsZXIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGVyKTtcclxuICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcmVnRXggPSAvXlxcZHsyfS1cXGR7Mn0tXFxkezR9JC87XHJcbiAgICAgICBcclxuICAgICAgICB2YXIgbm8gPSBfLnBhcnNlSW50KHRyYXZlbGVyWydubyddKTtcclxuICAgICAgICB2YXIgdD1uby0xO1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICB2YXIgZGF0ZW9mYmlydGg9JChcIiNkb2JfXCIrbm8pLnZhbCgpO1xyXG4gICAgICAgIGlmKGRhdGVvZmJpcnRoIT0nJyl7XHJcbiAgICAgICAgaWYoZGF0ZW9mYmlydGgubWF0Y2gocmVnRXgpICE9IG51bGwpe1xyXG4gICAgICAgIHZhciBkb2I9ZGF0ZW9mYmlydGguc3BsaXQoJy0nKTtcclxuICAgICAgICB2YXIgZG9iYj1bZG9iWzJdLGRvYlsxXSxkb2JbMF1dO1xyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzBdKT4zMSl7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RvYl9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzFdKT4xMil7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RvYl9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoJywgZG9iYik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RvYl9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgfSxcclxuICAgIFxyXG5cclxuc2V0cGFzc3BvcnRleHBpcnk6IGZ1bmN0aW9uKHRyYXZlbGVyKSB7XHJcbiAgICAgICAgdmFyIG5vID0gXy5wYXJzZUludCh0cmF2ZWxlclsnbm8nXSk7XHJcbiAgICAgICAgdmFyIHQ9bm8tMTsgICAgICAgXHJcbiAgICAgICAgdmFyIGRhdGVvZnBlZD0kKFwiI3BlZF9cIitubykudmFsKCk7XHJcbiAgICAgICAgdmFyIHBlZD1kYXRlb2ZwZWQuc3BsaXQoJy0nKTtcclxuICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeScsIHBlZCk7XHJcbiAgICB9LFxyXG4gICAgIHNldHBhc3Nwb3J0ZXhwaXJ5c2ltcGxlOiBmdW5jdGlvbih0cmF2ZWxlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsZXIpO1xyXG4gICAgICAgXHJcbiAgICAgICAgICAgIHZhciByZWdFeCA9IC9eXFxkezJ9LVxcZHsyfS1cXGR7NH0kLztcclxuICAgICAgIFxyXG4gICAgICAgIHZhciBubyA9IF8ucGFyc2VJbnQodHJhdmVsZXJbJ25vJ10pO1xyXG4gICAgICAgIHZhciB0PW5vLTE7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRlb2ZwZWQ9JChcIiNwZWRfXCIrbm8pLnZhbCgpO1xyXG4gICAgICAgIGlmKGRhdGVvZnBlZCE9Jycpe1xyXG4gICAgICAgIGlmKGRhdGVvZnBlZC5tYXRjaChyZWdFeCkgIT0gbnVsbCl7XHJcbiAgICAgICAgdmFyIGRvYj1kYXRlb2ZwZWQuc3BsaXQoJy0nKTtcclxuICAgICAgICB2YXIgZG9iYj1bZG9iWzJdLGRvYlsxXSxkb2JbMF1dO1xyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzBdKT4zMSl7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI3BlZF9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzFdKT4xMil7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI3BlZF9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeScsIGRvYmIpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBQdXQgRGF0ZSBpbiBERC1NTS1ZWVlZIEZvcm1hdFwiKTtcclxuICAgICAgICAgICAgJChcIiNwZWRfXCIrbm8pLnZhbCgnJykuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9nbGxlOmZ1bmN0aW9uKHRyYXZlbGVyKXtcclxuICAgICAgICAgdmFyIG5vID0gXy5wYXJzZUludCh0cmF2ZWxlclsnbm8nXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGgnKSE9bnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ2RhdGVzdXBwb3J0ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvYiA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGguMCcpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5iaXJ0aC4xJykgKyAnLScgKyB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoLjInKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZG9iX1wiICsgbm8pLnZhbChkb2IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvYiA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGguMicpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5iaXJ0aC4xJykgKyAnLScgKyB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoLjAnKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZG9iX1wiICsgbm8pLnZhbChkb2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeScpIT1udWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldCgnZGF0ZXN1cHBvcnRlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9iID0gdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMCcpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMScpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMicpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNwZWRfXCIgKyBubykudmFsKGRvYik7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvYiA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjInKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjEnKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjAnKTtcclxuICAgICAgICAgICAgICAgICQoXCIjcGVkX1wiICsgbm8pLnZhbChkb2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG9nZ2xlKCdhbGwnKTtcclxuICAgIH1cclxuXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL3Bhc3Nlbmdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDg0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIHNlZ21lbnQgcGFzc2VuZ2VyIFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibmFtZSB0cmVlIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGl0bGUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpdGxlXCIsXCJwbGFjZWhvbGRlclwiOlwiVGl0bGVcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcIm1ldGEuc2VsZWN0XCJdLFwic1wiOlwiXzAudGl0bGVzKClcIn19XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIudGl0bGVfaWRcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMudGl0bGVfaWRcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaXJzdCBuYW1lIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwiZmlyc3RuYW1lXCIsXCJjbGFzc1wiOlwiZmlyc3RuYW1lXCIsXCJwbGFjZWhvbGRlclwiOlwiRmlyc3QgJiBNaWRkbGUgTmFtZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5maXJzdG5hbWVcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuZmlyc3RuYW1lXCJ9XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRyYXZlbGVycyBwb3B1cCB2ZXJ0aWNhbCBtZW51XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJQaWNrIGEgdHJhdmVsZXJcIl19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicGlja1RyYXZlbGVyXCIsXCJhXCI6e1wiclwiOltcIi5cIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2VyIGljb25cIn19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiZmlyc3RuYW1lXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibGFzdG5hbWVcIn1dfV0sXCJuXCI6NTIsXCJyXCI6XCJ0cmF2ZWxlcnNcIn1dLFwiblwiOjUwLFwiclwiOlwidHJhdmVsZXJzLmxlbmd0aFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOltcIk5ldyB0cmF2ZWxlcj9cIl19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W1wiV2Ugd2lsbCByZWdpc3RlciB0cmF2ZWxlciBpbiB0aGUgc3lzdGVtIGZvciBmYXN0ZXIgYWNjZXNzLlwiXX1dLFwiclwiOlwidHJhdmVsZXJzLmxlbmd0aFwifV0sXCJ4XCI6e1wiclwiOltcInNlYXJjaFwiLFwidHJhdmVsZXIuZmlyc3RuYW1lXCIsXCJ0cmF2ZWxlcnNcIl0sXCJzXCI6XCJ7dHJhdmVsZXJzOl8wKF8xLF8yKX1cIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYXN0IG5hbWUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsYXN0bmFtZVwiLFwiY2xhc3NcIjpcImxhc3RuYW1lXCIsXCJwbGFjZWhvbGRlclwiOlwiTGFzdG5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIubGFzdG5hbWVcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMubGFzdG5hbWVcIn1dfX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJEYXRlIG9mIGJpcnRoXCIse1widFwiOjQsXCJmXCI6W1wiKlwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1widmFsaWRhdGlvblwiXSxcInNcIjpcIlxcXCJkb21lc3RpY1xcXCIhPV8wXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3Nwb3J0LWV4cGlyeSBkYXRlIHRocmVlIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRheVwiLFwicGxhY2Vob2xkZXJcIjpcIkRheVwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0LkRcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5iaXJ0aC4yXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmJpcnRoXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1vbnRoXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9udGhcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5NTU1NXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuYmlydGguMVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5iaXJ0aFwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJ5ZWFyXCIsXCJwbGFjZWhvbGRlclwiOlwiWWVhclwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZGF0ZS5zZWxlY3RcIixcIn4vdHlwZV9pZFwiXSxcInNcIjpcIl8wLmJpcnRoWWVhcnMoXzEpXCJ9fV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLmJpcnRoLjBcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuYmlydGhcIn1dfX1dfV19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwiY29sb3I6ICMzMzk5ZmY7IG1hcmdpbi10b3A6IC0yN3B4OyBtYXJnaW4tYm90dG9tOiAxMHB4OyBmb250LXNpemU6IDEzcHg7XCJ9LFwiZlwiOltcIlRoZSBkYXRlIG9mIGJpcnRoIGNhbiBiZSBjaGFuZ2VkIGxhdGVyXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFsbFwiLFwidmFsaWRhdGlvblwiXSxcInNcIjpcIl8wfHxcXFwiZG9tZXN0aWNcXFwiIT1fMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlBhc3Nwb3J0XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzcG9ydCB0d28gZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzcG9ydC1udW1iZXJcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzcG9ydCBOdW1iZXJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIucGFzc3BvcnRfbnVtYmVyXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLnBhc3Nwb3J0X251bWJlclwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIucGFzc3BvcnRfY291bnRyeV9pZFwifV0sXCJjbGFzc1wiOlwicGFzc3BvcnQtY291bnRyeVwiLFwic2VhcmNoXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3BvcnQgQ291bnRyeVwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibWV0YS5zZWxlY3RcIl0sXCJzXCI6XCJfMC5jb3VudHJpZXMoKVwifX1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc3BvcnRfY291bnRyeV9pZFwifV19LFwiZlwiOltdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiUGFzc3BvcnQgZXhwaXJ5IGRhdGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3Nwb3J0LWV4cGlyeSBkYXRlIHRocmVlIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRheVwiLFwicGxhY2Vob2xkZXJcIjpcIkRheVwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0LkRcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMlwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzcG9ydF9leHBpcnlcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwibW9udGhcIixcInBsYWNlaG9sZGVyXCI6XCJNb250aFwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0Lk1NTU1cIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzcG9ydF9leHBpcnlcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwieWVhclwiLFwicGxhY2Vob2xkZXJcIjpcIlllYXJcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5wYXNzcG9ydFllYXJzXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjBcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc3BvcnRfZXhwaXJ5XCJ9XX19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJhbGxcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJhbGlnblwiOlwiY2VudGVyXCIsXCJjbGFzc1wiOlwibW9yZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHRpbnkgY2lyY3VsYXIgYnV0dG9uXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJ0b2dnbGVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImFsbFxcXCJdXCJ9fX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIkxlc3MgSW5mb1wiXSxcIm5cIjo1MCxcInJcIjpcImFsbFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJNb3JlIEluZm9cIl0sXCJyXCI6XCJhbGxcIn1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJfXCIsXCJlcnJvcnNcIl0sXCJzXCI6XCJfMC5pc0FycmF5KF8xKXx8XzAuaXNPYmplY3QoXzEpXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwieFwiOntcInJcIjpbXCJfXCIsXCJlcnJvcnNcIl0sXCJzXCI6XCJfMC5pc0FycmF5KF8xKXx8XzAuaXNPYmplY3QoXzEpXCJ9fV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yc1wifV19XSxcInJcIjpcInBhc3NlbmdlclwifV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvcGFzc2VuZ2VyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA4NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyXHJcbiAgICBMQVJHRSA9ICdsYXJnZScsXHJcbiAgICBESVNBQkxFRCA9ICdkaXNhYmxlZCcsXHJcbiAgICBMT0FESU5HID0gJ2ljb24gbG9hZGluZycsXHJcbiAgICBERUNPUkFURUQgPSAnZGVjb3JhdGVkJyxcclxuICAgIEVSUk9SID0gJ2Vycm9yJyxcclxuICAgIElOID0gJ2luJyxcclxuICAgIFNFQVJDSCA9ICdzZWFyY2gnLFxyXG4gICAgSU5QVVQgPSAnaW5wdXQnXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9tb2JpbGVzZWxlY3QuaHRtbCcpLFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNsYXNzZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChkYXRhLnN0YXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmRpc2FibGVkIHx8IGRhdGEuc3RhdGUuc3VibWl0dGluZykgY2xhc3Nlcy5wdXNoKERJU0FCTEVEKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5sb2FkaW5nKSBjbGFzc2VzLnB1c2goTE9BRElORyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUuZXJyb3IpIGNsYXNzZXMucHVzaChFUlJPUik7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmxhcmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKElOUFVUKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goREVDT1JBVEVEKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goTEFSR0UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSB8fCBkYXRhLmZvY3VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChJTik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnNlYXJjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChTRUFSQ0gpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKERJU0FCTEVEKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLCBvO1xyXG5cclxuICAgICAgICB2YXIgZWwgPSAkKCcucG9wdXAnLCB2aWV3LmVsKS5tb2Jpc2Nyb2xsKCkuc2VsZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKHYsIGluc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZpZXcuZWwpLmZpbmQoJy50dCcpLnRleHQodik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU9IF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnbmFtZSc6IF8ucGFyc2VJbnQodil9KSwgJ2lkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndHJhdmVsZXIudGl0bGVfaWQnLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmlldy5nZXQoJ3RyYXZlbGVyJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb25WYWx1ZVRhcDogZnVuY3Rpb24gKHYsIGluc3QpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3BwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZXMgPXZpZXcuZ2V0KCdvcHRpb25zJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZT12LmNvbnRleHQuYXR0cmlidXRlc1snZGF0YS12YWwnXS5ub2RlVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZT0gXy5yZXN1bHQoXy5maW5kKHRpdGxlcywgeydpZCc6IF8ucGFyc2VJbnQodGl0bGUpfSksICduYW1lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICQodmlldy5lbCkuZmluZCgnLnR0JykudGV4dCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wb3B1cCcsIHZpZXcuZWwpLm1vYmlzY3JvbGwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3RyYXZlbGVyLnRpdGxlX2lkJyxfLnBhcnNlSW50KHRpdGxlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codmlldy5nZXQoJ3RyYXZlbGVyJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdwcCcrdGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgXHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmdldCgnb3B0aW9ucycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBfLmZpbmQob3B0aW9ucywge2lkOiB2YWx1ZX0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobykge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGVsLmRyb3Bkb3duKCdzZXQgdmFsdWUnLCBvLmlkKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlbC5kcm9wZG93bignc2V0IHRleHQnLCBvLnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgICAgIGVsLmRyb3Bkb3duKCdyZXN0b3JlIGRlZmF1bHRzJyk7XHJcblxyXG5cclxuICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuc2VsZWN0dmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICBcclxuICAgICAgIHZpZXcuc2V0KCd0cmF2ZWxlci50aXRsZV9pZCcsXy5wYXJzZUludCgkKHRoaXMuZmluZCgnLnBvcHVwJykpLnZhbCgpKSk7XHJcbiAgICAgLy8gIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCd0cmF2ZWxlcicpKTtcclxuICAgICAgLy8gY29uc29sZS5sb2codmlldy5nZXQoJ3ZhbHVlJykpO1xyXG4gICAgfSxcclxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLnNldCgnb3B0aW9ucycsIG51bGwpO1xyXG4gICAgfSxcclxuICAgICBkcm9wZG93bnNlbGVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICQoJy5wb3B1cCcsIHRoaXMuZWwpLm1vYmlzY3JvbGwoJ3Nob3cnKTtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZHJvcGRvd25zZWxlY3QnKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vbW9iaWxlc2VsZWN0LmpzXG4gKiogbW9kdWxlIGlkID0gODZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwiLFwiYWxpZ25cIjpcImNlbnRlclwifSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZHJvcGRvd24gXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiZHJvcGRvd25zZWxlY3RcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZWZhdWx0IHRleHQgdHRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiZHJvcGRvd24gaWNvblwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoaWRlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJwb3B1cFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImlkXCJ9XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibmFtZVwifV19XSxcInJcIjpcIm9wdGlvbnNcIn1dfV19XX1dLFwiblwiOjUwLFwiclwiOlwib3B0aW9ucy5sZW5ndGhcIn1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9tb2JpbGVzZWxlY3QuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDg3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBvdXQgPSB7XHJcbiAgICAgICAgRDogXy5yYW5nZSgxLDMyKSxcclxuICAgICAgICBNOiBfLnJhbmdlKDEsMTMpLFxyXG4gICAgICAgIE1NTU06IG1vbWVudC5tb250aHMoKVxyXG4gICAgfTtcclxuXHJcbiAgICBvdXQuc2VsZWN0ID0ge1xyXG4gICAgICAgIEQ6IF8ubWFwKG91dC5ELCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBfLnBhZExlZnQoaSwgMiwgMCksIHRleHQ6IGkgfTsgfSksXHJcbiAgICAgICAgTTogXy5tYXAob3V0Lk0sIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IF8ucGFkTGVmdChpLCAyLCAwKSwgdGV4dDogaSB9OyB9KSxcclxuICAgICAgICBNTU1NOiBfLm1hcChvdXQuTU1NTSwgZnVuY3Rpb24oaSwgaykgeyByZXR1cm4geyBpZDogXy5wYWRMZWZ0KGsgKyAxLCAyLCAwKSwgdGV4dDogaSB9OyB9KSxcclxuXHJcbiAgICAgICAgcGFzc3BvcnRZZWFyczogXy5tYXAoXy5yYW5nZShtb21lbnQoKS55ZWFyKCksIG1vbWVudCgpLnllYXIoKSArIDE1KSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogJycraSwgdGV4dDogJycraSB9OyB9KSxcclxuXHJcbiAgICAgICAgYmlydGhZZWFyczogZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5tYXAoXy5yYW5nZShtb21lbnQoKS55ZWFyKCksIDE4OTksIC0xKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogJycraSwgdGV4dDogJycraSB9OyB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjYXJkWWVhcnM6IF8ubWFwKF8ucmFuZ2UobW9tZW50KCkueWVhcigpLCBtb21lbnQoKS5hZGQoMjUsICd5ZWFycycpLnllYXIoKSksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6ICcnK2ksIHRleHQ6ICcnK2kgfTsgfSksXHJcbiAgICAgICAgY2FyZE1vbnRoczogXy5tYXAob3V0Lk1NTU0sIGZ1bmN0aW9uKGksIGspIHsgcmV0dXJuIHsgaWQ6IGsgKyAxLCB0ZXh0OiBfLnBhZExlZnQoaysxLCAyLCAnMCcpICsgJyAnICsgaSB9OyB9KVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG91dDtcclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvaGVscGVycy9kYXRlLmpzXG4gKiogbW9kdWxlIGlkID0gODhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDhcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbiAgICA7XHJcbnJlcXVpcmUoJ2pxdWVyeS5wYXltZW50Jyk7XHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcblxyXG4gICAgaF9tb25leSA9IHJlcXVpcmUoJ2hlbHBlcnMvbW9uZXknKSxcclxuICAgIGhfZHVyYXRpb24gPSByZXF1aXJlKCdoZWxwZXJzL2R1cmF0aW9uJykoKSxcclxuICAgIGhfZGF0ZSA9IHJlcXVpcmUoJ2hlbHBlcnMvZGF0ZScpKCksXHJcbiAgICBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpXHJcbiAgICA7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL3N0ZXAzLmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ3VpLWNjJzogcmVxdWlyZSgnY29yZS9mb3JtL2NjL251bWJlcicpLFxyXG4gICAgICAgICd1aS1jdnYnOiByZXF1aXJlKCdjb3JlL2Zvcm0vY2MvY3Z2JyksXHJcbiAgICAgICAgJ3VpLWV4cGlyeSc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9jYy9jYXJkZXhwaXJ5JylcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHByb21vY29kZTpudWxsLFxyXG4gICAgICAgICAgICBwcm9tb3ZhbHVlOm51bGwsXHJcbiAgICAgICAgICAgIHByb21vZXJyb3I6bnVsbCxcclxuICAgICAgICAgICAgYWNjZXB0ZWQ6dHJ1ZSxcclxuICAgICAgICAgICAgbW9uZXk6IGhfbW9uZXksXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBoX2R1cmF0aW9uLFxyXG4gICAgICAgICAgICBkYXRlOiBoX2RhdGUsXHJcbiAgICAgICAgICAgIGJhbmtzOiBbXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdBWElCJyAsIHRleHQ6ICdBWElTIEJhbmsgTmV0QmFua2luZycgfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0JPSUInICwgdGV4dDogJ0Jhbmsgb2YgSW5kaWEnIH0sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdCT01CJywgdGV4dDogJ0Jhbmsgb2YgTWFoYXJhc2h0cmEnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0NCSUInLCB0ZXh0OiAnQ2VudHJhbCBCYW5rIE9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdDUlBCJywgdGV4dDogJ0NvcnBvcmF0aW9uIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0RDQkInLCB0ZXh0OiAnRGV2ZWxvcG1lbnQgQ3JlZGl0IEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0ZFREInLCB0ZXh0OiAnRmVkZXJhbCBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdIREZCJywgdGV4dDogJ0hERkMgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAgLy97aWQ6ICdJQ0lCJywgdGV4dDogJ0lDSUNJIE5ldGJhbmtpbmcnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0lEQkInLCB0ZXh0OiAnSW5kdXN0cmlhbCBEZXZlbG9wbWVudCBCYW5rIG9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdJTkRCJywgdGV4dDogJ0luZGlhbiBCYW5rICd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSU5JQicsIHRleHQ6ICdJbmR1c0luZCBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdJTk9CJywgdGV4dDogJ0luZGlhbiBPdmVyc2VhcyBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdKQUtCJywgdGV4dDogJ0phbW11IGFuZCBLYXNobWlyIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0tSS0InLCB0ZXh0OiAnS2FybmF0YWthIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0tSVkInLCB0ZXh0OiAnS2FydXIgVnlzeWEgJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdTQkJKQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEJpa2FuZXIgYW5kIEphaXB1cid9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JIQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEh5ZGVyYWJhZCd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JJQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdTQk1CJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgTXlzb3JlJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdTQlRCJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgVHJhdmFuY29yZSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU09JQicsIHRleHQ6ICdTb3V0aCBJbmRpYW4gQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnVUJJQicsIHRleHQ6ICdVbmlvbiBCYW5rIG9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdVTklCJywgdGV4dDogJ1VuaXRlZCBCYW5rIE9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdWSllCJywgdGV4dDogJ1ZpamF5YSBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdZRVNCJywgdGV4dDogJ1llcyBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdDVUJCJywgdGV4dDogJ0NpdHlVbmlvbid9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQ0FCQicsIHRleHQ6ICdDYW5hcmEgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JQQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIFBhdGlhbGEnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0NJVE5CJywgdGV4dDogJ0NpdGkgQmFuayBOZXRCYW5raW5nJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdEU0hCJywgdGV4dDogJ0RldXRzY2hlIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJzE2MkInLCB0ZXh0OiAnS290YWsgQmFuayd9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGZvcm1hdFllYXI6IGZ1bmN0aW9uICh5ZWFyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhci5zbGljZSgtMik7O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRQYXlNb25leTpmdW5jdGlvbihhbW91bnQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoYW1vdW50LCAnPGkgY2xhc3M9XCJpbnIgaWNvbiBjdXJyZW5jeVwiPjwvaT4nLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCdib29raW5nLnN0ZXBzLjMuYWN0aXZlJywgZnVuY3Rpb24oYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL2NhcmRzJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IGJvb2tpbmdfaWQ6IHRoaXMuZ2V0KCdib29raW5nLmlkJykgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NhcmRzJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldENhcmQoZGF0YVtkYXRhLmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjYXJkcycsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb21vY29kZScsdmlldy5nZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScpKTtcclxuICAgICAgICAgICAgICAgICB2aWV3LnNldCgncHJvbW92YWx1ZScsdmlldy5nZXQoJ2Jvb2tpbmcucHJvbW9fdmFsdWUnKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCdib29raW5nLnBheW1lbnQuYWN0aXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldCgnYm9va2luZycpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2Jvb2tpbmcuc3RlcHMuMy5lcnJvcnMnLCBmYWxzZSk7XHJcbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICBcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHN1Ym1pdDogZnVuY3Rpb24oKSB7IFxyXG4gICAgICAgIHZhciBib29raW5nID0gdGhpcy5nZXQoJ2Jvb2tpbmcnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhib29raW5nKTtcclxuLy8gICAgICAgIHZhciBjYXJkZXhwaXJ5PSQoJyNjYy1leHAnKS52YWwoKTtcclxuLy8gICAgICAgIGNvbnNvbGUubG9nKGNhcmRleHBpcnkpO1xyXG4vLyAgICAgICAgaWYoY2FyZGV4cGlyeSAhPW51bGwgJiYgY2FyZGV4cGlyeSAhPScnKXtcclxuLy8gICAgICAgICAgICBjYXJkYXJyPWNhcmRleHBpcnkuc3BsaXQoJy8nKTtcclxuLy8gICAgICAgICAgICBib29raW5nLnNldCgncGF5bWVudC5jYy5leHBfbW9udGgnLHRyaW0oY2FyZGFyclswXSkpO1xyXG4vLyAgICAgICAgICAgIGJvb2tpbmcuc2V0KCdwYXltZW50LmNjLmV4cF95ZWFyJyx0cmltKGNhcmRhcnJbMV0pKTtcclxuLy8gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdldCgnYm9va2luZycpLnN0ZXAzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldENhcmQ6IGZ1bmN0aW9uKGNjKSB7XHJcbiAgICAgICAgdmFyIGJvb2tpbmcgPSB0aGlzLmdldCgnYm9va2luZycpO1xyXG5cclxuICAgICAgICBpZiAoYm9va2luZy5nZXQoJ3BheW1lbnQuY2MuaWQnKSAhPT0gY2MuaWQpIHtcclxuICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MnLCBjYyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MnLCB7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRDQzogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICB2YXIgYm9va2luZyA9IHRoaXMuZ2V0KCdib29raW5nJyksXHJcbiAgICAgICAgICAgIGUgPSBldmVudC5vcmlnaW5hbCxcclxuICAgICAgICAgICAgZWwgPSAkKGUuc3JjRWxlbWVudCksXHJcbiAgICAgICAgICAgIGlkID0gYm9va2luZy5nZXQoJ3BheW1lbnQuY2MuaWQnKSxcclxuICAgICAgICAgICAgeXVwID0gMCA9PSBlbC5wYXJlbnRzKCcudWkuaW5wdXQuY3Z2Jykuc2l6ZSgpICYmICgoJ0lOUFVUJyA9PSBlbFswXS50YWdOYW1lKSB8fCBlbC5oYXNDbGFzcygnZHJvcGRvd24nKSB8fCBlbC5wYXJlbnRzKCcudWkuZHJvcGRvd24nKS5zaXplKCkpO1xyXG5cclxuICAgICAgICBpZiAoaWQgJiYgeXVwKSB7XHJcbiAgICAgICAgICAgIGJvb2tpbmcuc2V0KCdwYXltZW50LmNjJywge30pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5hY3RpdmF0ZSgyKTtcclxuICAgIH0sXHJcblxyXG4gICAgYXBwbHlQcm9tb0NvZGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgXHJcbiAgICAgICAgICB2YXIgcHJvbW9jb2RlPXRoaXMuZ2V0KCdwcm9tb2NvZGUnKTtcclxuICAgICAgICAgIHRoaXMuc2V0KCdwcm9tb2Vycm9yJyxudWxsKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IHRoaXMuZ2V0KCdib29raW5nLmlkJykscHJvbW86cHJvbW9jb2RlfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvY2hlY2tQcm9tb0NvZGUnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ2Vycm9yJykpeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb21vZXJyb3InLGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoZGF0YS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb21vdmFsdWUnLGRhdGEudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdib29raW5nLnByb21vX3ZhbHVlJyxkYXRhLnZhbHVlKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScsZGF0YS5jb2RlKTsgXHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2aWV3LmdldCgncHJvbW92YWx1ZScpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICBcclxuICAgIH0sXHJcbiAgICByZW1vdmVQcm9tb0NvZGU6ZnVuY3Rpb24oKXtcclxuICAgICAvLyAgIGNvbnNvbGUubG9nKCdyZW1vdmVQcm9tb0NvZGUnKTtcclxuICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vY29kZScsbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vdmFsdWUnLG51bGwpOyBcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7ICAgICAgXHJcbiAgICAgICAgdmFyIGRhdGEgPSB7aWQ6IHRoaXMuZ2V0KCdib29raW5nLmlkJyl9O1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9yZW1vdmVQcm9tb0NvZGUnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdib29raW5nLnByb21vX3ZhbHVlJyxudWxsKTsgXHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb19jb2RlJyxudWxsKTsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICByZW1vdmVFcnJvck1zZzpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb2Vycm9yJyxudWxsKTtcclxuICAgIH0sXHJcbiAgICBjaGVja0V4cGlyeTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAkLmZuLnRvZ2dsZUlucHV0RXJyb3IgPSBmdW5jdGlvbihlcnJlZCkge1xyXG4gICAgICAgIHRoaXMucGFyZW50KCcuZm9ybS1ncm91cCcpLnRvZ2dsZUNsYXNzKCdoYXMtZXJyb3InLCBlcnJlZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH07XHJcbiAgICAgICQoJy5jYy1leHAnKS52YWwoKTtcclxuICAgICAgJC5wYXltZW50LnZhbGlkYXRlQ2FyZEV4cGlyeSgnMDUnLCAnMjAnKTsgLy89PiB0cnVlXHJcbiAgICAgICAgICQoJy5jYy1leHAnKS50b2dnbGVJbnB1dEVycm9yKCEkLnBheW1lbnQudmFsaWRhdGVDYXJkRXhwaXJ5KCQoJy5jYy1leHAnKS5wYXltZW50KCdjYXJkRXhwaXJ5VmFsJykpKTtcclxuICAgICAgICAgJCgnLnZhbGlkYXRpb24nKS5yZW1vdmVDbGFzcygndGV4dC1kYW5nZXIgdGV4dC1zdWNjZXNzJyk7XHJcbiAgICAgICAgICQoJy52YWxpZGF0aW9uJykuYWRkQ2xhc3MoJCgnLmhhcy1lcnJvcicpLmxlbmd0aCA/ICd0ZXh0LWRhbmdlcicgOiAndGV4dC1zdWNjZXNzJyk7XHJcbiAgICB9XHJcblxyXG5cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXAzLmpzXG4gKiogbW9kdWxlIGlkID0gODlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzXG4gKiovIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgY2FyZEZyb21OdW1iZXIsIGNhcmRGcm9tVHlwZSwgY2FyZHMsIGRlZmF1bHRGb3JtYXQsIGZvcm1hdEJhY2tDYXJkTnVtYmVyLCBmb3JtYXRCYWNrRXhwaXJ5LCBmb3JtYXRDYXJkTnVtYmVyLCBmb3JtYXRFeHBpcnksIGZvcm1hdEZvcndhcmRFeHBpcnksIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlLCBoYXNUZXh0U2VsZWN0ZWQsIGx1aG5DaGVjaywgcmVGb3JtYXRDVkMsIHJlRm9ybWF0Q2FyZE51bWJlciwgcmVGb3JtYXRFeHBpcnksIHJlRm9ybWF0TnVtZXJpYywgcmVzdHJpY3RDVkMsIHJlc3RyaWN0Q2FyZE51bWJlciwgcmVzdHJpY3RFeHBpcnksIHJlc3RyaWN0TnVtZXJpYywgc2V0Q2FyZFR5cGUsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gICQucGF5bWVudCA9IHt9O1xuXG4gICQucGF5bWVudC5mbiA9IHt9O1xuXG4gICQuZm4ucGF5bWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBtZXRob2Q7XG4gICAgbWV0aG9kID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICByZXR1cm4gJC5wYXltZW50LmZuW21ldGhvZF0uYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG5cbiAgZGVmYXVsdEZvcm1hdCA9IC8oXFxkezEsNH0pL2c7XG5cbiAgJC5wYXltZW50LmNhcmRzID0gY2FyZHMgPSBbXG4gICAge1xuICAgICAgdHlwZTogJ3Zpc2FlbGVjdHJvbicsXG4gICAgICBwYXR0ZXJuOiAvXjQoMDI2fDE3NTAwfDQwNXw1MDh8ODQ0fDkxWzM3XSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ21hZXN0cm8nLFxuICAgICAgcGF0dGVybjogL14oNSgwMTh8MFsyM118WzY4XSl8NigzOXw3KSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdmb3JicnVnc2ZvcmVuaW5nZW4nLFxuICAgICAgcGF0dGVybjogL142MDAvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2RhbmtvcnQnLFxuICAgICAgcGF0dGVybjogL141MDE5LyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICd2aXNhJyxcbiAgICAgIHBhdHRlcm46IC9eNC8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxMywgMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ21hc3RlcmNhcmQnLFxuICAgICAgcGF0dGVybjogL14oNVswLTVdfDJbMi03XSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2FtZXgnLFxuICAgICAgcGF0dGVybjogL14zWzQ3XS8sXG4gICAgICBmb3JtYXQ6IC8oXFxkezEsNH0pKFxcZHsxLDZ9KT8oXFxkezEsNX0pPy8sXG4gICAgICBsZW5ndGg6IFsxNV0sXG4gICAgICBjdmNMZW5ndGg6IFszLCA0XSxcbiAgICAgIGx1aG46IHRydWVcbiAgICB9LCB7XG4gICAgICB0eXBlOiAnZGluZXJzY2x1YicsXG4gICAgICBwYXR0ZXJuOiAvXjNbMDY4OV0vLFxuICAgICAgZm9ybWF0OiAvKFxcZHsxLDR9KShcXGR7MSw2fSk/KFxcZHsxLDR9KT8vLFxuICAgICAgbGVuZ3RoOiBbMTRdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2Rpc2NvdmVyJyxcbiAgICAgIHBhdHRlcm46IC9eNihbMDQ1XXwyMikvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ3VuaW9ucGF5JyxcbiAgICAgIHBhdHRlcm46IC9eKDYyfDg4KS8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxNiwgMTcsIDE4LCAxOV0sXG4gICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgIGx1aG46IGZhbHNlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2pjYicsXG4gICAgICBwYXR0ZXJuOiAvXjM1LyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH1cbiAgXTtcblxuICBjYXJkRnJvbU51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBfaSwgX2xlbjtcbiAgICBudW0gPSAobnVtICsgJycpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBjYXJkcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgY2FyZCA9IGNhcmRzW19pXTtcbiAgICAgIGlmIChjYXJkLnBhdHRlcm4udGVzdChudW0pKSB7XG4gICAgICAgIHJldHVybiBjYXJkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjYXJkRnJvbVR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgdmFyIGNhcmQsIF9pLCBfbGVuO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gY2FyZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGNhcmQgPSBjYXJkc1tfaV07XG4gICAgICBpZiAoY2FyZC50eXBlID09PSB0eXBlKSB7XG4gICAgICAgIHJldHVybiBjYXJkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBsdWhuQ2hlY2sgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgZGlnaXQsIGRpZ2l0cywgb2RkLCBzdW0sIF9pLCBfbGVuO1xuICAgIG9kZCA9IHRydWU7XG4gICAgc3VtID0gMDtcbiAgICBkaWdpdHMgPSAobnVtICsgJycpLnNwbGl0KCcnKS5yZXZlcnNlKCk7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBkaWdpdHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGRpZ2l0ID0gZGlnaXRzW19pXTtcbiAgICAgIGRpZ2l0ID0gcGFyc2VJbnQoZGlnaXQsIDEwKTtcbiAgICAgIGlmICgob2RkID0gIW9kZCkpIHtcbiAgICAgICAgZGlnaXQgKj0gMjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWdpdCA+IDkpIHtcbiAgICAgICAgZGlnaXQgLT0gOTtcbiAgICAgIH1cbiAgICAgIHN1bSArPSBkaWdpdDtcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAlIDEwID09PSAwO1xuICB9O1xuXG4gIGhhc1RleHRTZWxlY3RlZCA9IGZ1bmN0aW9uKCR0YXJnZXQpIHtcbiAgICB2YXIgX3JlZjtcbiAgICBpZiAoKCR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPSBudWxsKSAmJiAkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT09ICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uRW5kJykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudCAhPT0gbnVsbCA/IChfcmVmID0gZG9jdW1lbnQuc2VsZWN0aW9uKSAhPSBudWxsID8gX3JlZi5jcmVhdGVSYW5nZSA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZUZvcm1hdE51bWVyaWMgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZUZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSAkLnBheW1lbnQuZm9ybWF0Q2FyZE51bWJlcih2YWx1ZSk7XG4gICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGNhcmQsIGRpZ2l0LCBsZW5ndGgsIHJlLCB1cHBlckxlbmd0aCwgdmFsdWU7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKHZhbHVlICsgZGlnaXQpO1xuICAgIGxlbmd0aCA9ICh2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpICsgZGlnaXQpLmxlbmd0aDtcbiAgICB1cHBlckxlbmd0aCA9IDE2O1xuICAgIGlmIChjYXJkKSB7XG4gICAgICB1cHBlckxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID49IHVwcGVyTGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjYXJkICYmIGNhcmQudHlwZSA9PT0gJ2FtZXgnKSB7XG4gICAgICByZSA9IC9eKFxcZHs0fXxcXGR7NH1cXHNcXGR7Nn0pJC87XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlID0gLyg/Ol58XFxzKShcXGR7NH0pJC87XG4gICAgfVxuICAgIGlmIChyZS50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSArICcgJyArIGRpZ2l0KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmUudGVzdCh2YWx1ZSArIGRpZ2l0KSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSArIGRpZ2l0ICsgJyAnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmb3JtYXRCYWNrQ2FyZE51bWJlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgaWYgKGUud2hpY2ggIT09IDgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCgkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT0gbnVsbCkgJiYgJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9PSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKC9cXGRcXHMkLy50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZS5yZXBsYWNlKC9cXGRcXHMkLywgJycpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoL1xcc1xcZD8kLy50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZS5yZXBsYWNlKC9cXGQkLywgJycpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZUZvcm1hdEV4cGlyeSA9IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdGFyZ2V0LCB2YWx1ZTtcbiAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICB2YWx1ZSA9ICQucGF5bWVudC5mb3JtYXRFeHBpcnkodmFsdWUpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICBmb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWw7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgaWYgKC9eXFxkJC8udGVzdCh2YWwpICYmICh2YWwgIT09ICcwJyAmJiB2YWwgIT09ICcxJykpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCIwXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoL15cXGRcXGQkLy50ZXN0KHZhbCkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCJcIiArIHZhbCArIFwiIC8gXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdEZvcndhcmRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWw7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmICgvXlxcZFxcZCQvLnRlc3QodmFsKSkge1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICB9XG4gIH07XG5cbiAgZm9ybWF0Rm9yd2FyZFNsYXNoQW5kU3BhY2UgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIHZhbCwgd2hpY2g7XG4gICAgd2hpY2ggPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghKHdoaWNoID09PSAnLycgfHwgd2hpY2ggPT09ICcgJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiB2YWwgIT09ICcwJykge1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiMFwiICsgdmFsICsgXCIgLyBcIik7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdEJhY2tFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmIChlLndoaWNoICE9PSA4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgvXFxkXFxzXFwvXFxzJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkXFxzXFwvXFxzJC8sICcnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmVGb3JtYXRDVkMgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDQpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXN0cmljdE51bWVyaWMgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGlucHV0O1xuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGUud2hpY2ggPT09IDMyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChlLndoaWNoID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGUud2hpY2ggPCAzMykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlucHV0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICByZXR1cm4gISEvW1xcZFxcc10vLnRlc3QoaW5wdXQpO1xuICB9O1xuXG4gIHJlc3RyaWN0Q2FyZE51bWJlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgY2FyZCwgZGlnaXQsIHZhbHVlO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCgkdGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YWx1ZSA9ICgkdGFyZ2V0LnZhbCgpICsgZGlnaXQpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoY2FyZCkge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSAxNjtcbiAgICB9XG4gIH07XG5cbiAgcmVzdHJpY3RFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWx1ZTtcbiAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQoJHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPiA2KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHJlc3RyaWN0Q1ZDID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCgkdGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgcmV0dXJuIHZhbC5sZW5ndGggPD0gNDtcbiAgfTtcblxuICBzZXRDYXJkVHlwZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgYWxsVHlwZXMsIGNhcmQsIGNhcmRUeXBlLCB2YWw7XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGNhcmRUeXBlID0gJC5wYXltZW50LmNhcmRUeXBlKHZhbCkgfHwgJ3Vua25vd24nO1xuICAgIGlmICghJHRhcmdldC5oYXNDbGFzcyhjYXJkVHlwZSkpIHtcbiAgICAgIGFsbFR5cGVzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGNhcmRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgY2FyZCA9IGNhcmRzW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGNhcmQudHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ3Vua25vd24nKTtcbiAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoYWxsVHlwZXMuam9pbignICcpKTtcbiAgICAgICR0YXJnZXQuYWRkQ2xhc3MoY2FyZFR5cGUpO1xuICAgICAgJHRhcmdldC50b2dnbGVDbGFzcygnaWRlbnRpZmllZCcsIGNhcmRUeXBlICE9PSAndW5rbm93bicpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudHJpZ2dlcigncGF5bWVudC5jYXJkVHlwZScsIGNhcmRUeXBlKTtcbiAgICB9XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmZvcm1hdENhcmRDVkMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdENWQyk7XG4gICAgdGhpcy5vbigncGFzdGUnLCByZUZvcm1hdENWQyk7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRDVkMpO1xuICAgIHRoaXMub24oJ2lucHV0JywgcmVGb3JtYXRDVkMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gICQucGF5bWVudC5mbi5mb3JtYXRDYXJkRXhwaXJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdE51bWVyaWMpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3RFeHBpcnkpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0RXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlKTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdEZvcndhcmRFeHBpcnkpO1xuICAgIHRoaXMub24oJ2tleWRvd24nLCBmb3JtYXRCYWNrRXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCByZUZvcm1hdEV4cGlyeSk7XG4gICAgdGhpcy5vbignaW5wdXQnLCByZUZvcm1hdEV4cGlyeSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdENhcmROdW1iZXIpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbigna2V5ZG93bicsIGZvcm1hdEJhY2tDYXJkTnVtYmVyKTtcbiAgICB0aGlzLm9uKCdrZXl1cCcsIHNldENhcmRUeXBlKTtcbiAgICB0aGlzLm9uKCdwYXN0ZScsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRDYXJkTnVtYmVyKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbignaW5wdXQnLCBzZXRDYXJkVHlwZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLnJlc3RyaWN0TnVtZXJpYyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgICB0aGlzLm9uKCdwYXN0ZScsIHJlRm9ybWF0TnVtZXJpYyk7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXROdW1lcmljKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0TnVtZXJpYyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmNhcmRFeHBpcnlWYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJC5wYXltZW50LmNhcmRFeHBpcnlWYWwoJCh0aGlzKS52YWwoKSk7XG4gIH07XG5cbiAgJC5wYXltZW50LmNhcmRFeHBpcnlWYWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBtb250aCwgcHJlZml4LCB5ZWFyLCBfcmVmO1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICBfcmVmID0gdmFsdWUuc3BsaXQoJy8nLCAyKSwgbW9udGggPSBfcmVmWzBdLCB5ZWFyID0gX3JlZlsxXTtcbiAgICBpZiAoKHllYXIgIT0gbnVsbCA/IHllYXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMiAmJiAvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICBwcmVmaXggPSAobmV3IERhdGUpLmdldEZ1bGxZZWFyKCk7XG4gICAgICBwcmVmaXggPSBwcmVmaXgudG9TdHJpbmcoKS5zbGljZSgwLCAyKTtcbiAgICAgIHllYXIgPSBwcmVmaXggKyB5ZWFyO1xuICAgIH1cbiAgICBtb250aCA9IHBhcnNlSW50KG1vbnRoLCAxMCk7XG4gICAgeWVhciA9IHBhcnNlSW50KHllYXIsIDEwKTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgeWVhcjogeWVhclxuICAgIH07XG4gIH07XG5cbiAgJC5wYXltZW50LnZhbGlkYXRlQ2FyZE51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBfcmVmO1xuICAgIG51bSA9IChudW0gKyAnJykucmVwbGFjZSgvXFxzK3wtL2csICcnKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QobnVtKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICBpZiAoIWNhcmQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIChfcmVmID0gbnVtLmxlbmd0aCwgX19pbmRleE9mLmNhbGwoY2FyZC5sZW5ndGgsIF9yZWYpID49IDApICYmIChjYXJkLmx1aG4gPT09IGZhbHNlIHx8IGx1aG5DaGVjayhudW0pKTtcbiAgfTtcblxuICAkLnBheW1lbnQudmFsaWRhdGVDYXJkRXhwaXJ5ID0gZnVuY3Rpb24obW9udGgsIHllYXIpIHtcbiAgICB2YXIgY3VycmVudFRpbWUsIGV4cGlyeSwgX3JlZjtcbiAgICBpZiAodHlwZW9mIG1vbnRoID09PSAnb2JqZWN0JyAmJiAnbW9udGgnIGluIG1vbnRoKSB7XG4gICAgICBfcmVmID0gbW9udGgsIG1vbnRoID0gX3JlZi5tb250aCwgeWVhciA9IF9yZWYueWVhcjtcbiAgICB9XG4gICAgaWYgKCEobW9udGggJiYgeWVhcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbW9udGggPSAkLnRyaW0obW9udGgpO1xuICAgIHllYXIgPSAkLnRyaW0oeWVhcik7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KG1vbnRoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoeWVhcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCEoKDEgPD0gbW9udGggJiYgbW9udGggPD0gMTIpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoeWVhci5sZW5ndGggPT09IDIpIHtcbiAgICAgIGlmICh5ZWFyIDwgNzApIHtcbiAgICAgICAgeWVhciA9IFwiMjBcIiArIHllYXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB5ZWFyID0gXCIxOVwiICsgeWVhcjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHllYXIubGVuZ3RoICE9PSA0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGV4cGlyeSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKTtcbiAgICBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSAtIDEpO1xuICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSArIDEsIDEpO1xuICAgIHJldHVybiBleHBpcnkgPiBjdXJyZW50VGltZTtcbiAgfTtcblxuICAkLnBheW1lbnQudmFsaWRhdGVDYXJkQ1ZDID0gZnVuY3Rpb24oY3ZjLCB0eXBlKSB7XG4gICAgdmFyIGNhcmQsIF9yZWY7XG4gICAgY3ZjID0gJC50cmltKGN2Yyk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGN2YykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2FyZCA9IGNhcmRGcm9tVHlwZSh0eXBlKTtcbiAgICBpZiAoY2FyZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gX3JlZiA9IGN2Yy5sZW5ndGgsIF9faW5kZXhPZi5jYWxsKGNhcmQuY3ZjTGVuZ3RoLCBfcmVmKSA+PSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3ZjLmxlbmd0aCA+PSAzICYmIGN2Yy5sZW5ndGggPD0gNDtcbiAgICB9XG4gIH07XG5cbiAgJC5wYXltZW50LmNhcmRUeXBlID0gZnVuY3Rpb24obnVtKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgaWYgKCFudW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKChfcmVmID0gY2FyZEZyb21OdW1iZXIobnVtKSkgIT0gbnVsbCA/IF9yZWYudHlwZSA6IHZvaWQgMCkgfHwgbnVsbDtcbiAgfTtcblxuICAkLnBheW1lbnQuZm9ybWF0Q2FyZE51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBncm91cHMsIHVwcGVyTGVuZ3RoLCBfcmVmO1xuICAgIG51bSA9IG51bS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcihudW0pO1xuICAgIGlmICghY2FyZCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG4gICAgdXBwZXJMZW5ndGggPSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICBudW0gPSBudW0uc2xpY2UoMCwgdXBwZXJMZW5ndGgpO1xuICAgIGlmIChjYXJkLmZvcm1hdC5nbG9iYWwpIHtcbiAgICAgIHJldHVybiAoX3JlZiA9IG51bS5tYXRjaChjYXJkLmZvcm1hdCkpICE9IG51bGwgPyBfcmVmLmpvaW4oJyAnKSA6IHZvaWQgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JvdXBzID0gY2FyZC5mb3JtYXQuZXhlYyhudW0pO1xuICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGdyb3Vwcy5zaGlmdCgpO1xuICAgICAgZ3JvdXBzID0gJC5ncmVwKGdyb3VwcywgZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbjtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGdyb3Vwcy5qb2luKCcgJyk7XG4gICAgfVxuICB9O1xuXG4gICQucGF5bWVudC5mb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihleHBpcnkpIHtcbiAgICB2YXIgbW9uLCBwYXJ0cywgc2VwLCB5ZWFyO1xuICAgIHBhcnRzID0gZXhwaXJ5Lm1hdGNoKC9eXFxEKihcXGR7MSwyfSkoXFxEKyk/KFxcZHsxLDR9KT8vKTtcbiAgICBpZiAoIXBhcnRzKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIG1vbiA9IHBhcnRzWzFdIHx8ICcnO1xuICAgIHNlcCA9IHBhcnRzWzJdIHx8ICcnO1xuICAgIHllYXIgPSBwYXJ0c1szXSB8fCAnJztcbiAgICBpZiAoeWVhci5sZW5ndGggPiAwKSB7XG4gICAgICBzZXAgPSAnIC8gJztcbiAgICB9IGVsc2UgaWYgKHNlcCA9PT0gJyAvJykge1xuICAgICAgbW9uID0gbW9uLnN1YnN0cmluZygwLCAxKTtcbiAgICAgIHNlcCA9ICcnO1xuICAgIH0gZWxzZSBpZiAobW9uLmxlbmd0aCA9PT0gMiB8fCBzZXAubGVuZ3RoID4gMCkge1xuICAgICAgc2VwID0gJyAvICc7XG4gICAgfSBlbHNlIGlmIChtb24ubGVuZ3RoID09PSAxICYmIChtb24gIT09ICcwJyAmJiBtb24gIT09ICcxJykpIHtcbiAgICAgIG1vbiA9IFwiMFwiICsgbW9uO1xuICAgICAgc2VwID0gJyAvICc7XG4gICAgfVxuICAgIHJldHVybiBtb24gKyBzZXAgKyB5ZWFyO1xuICB9O1xuXG59KS5jYWxsKHRoaXMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3ZlbmRvci9qcXVlcnkucGF5bWVudC9saWIvanF1ZXJ5LnBheW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA5MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGVwIGhlYWRlciBzdGVwMyBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJjb21wbGV0ZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmNvbXBsZXRlZFwifV0sXCJyb2xlXCI6XCJ0YWJcIn0sXCJmXCI6W1wiUGF5bWVudCBEZXRhaWxzXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic3RlcC5hY3RpdmVcIixcInN0ZXAuY29tcGxldGVkXCJdLFwic1wiOlwiIV8wJiZfMVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpbXCJ1aSBmb3JtIHNlZ21lbnQgc3RlcDMgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5zdWJtaXR0aW5nXCJ9XX0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcG9pbnRpbmcgc2Vjb25kYXJ5IG1lbnVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjE9PV8wXCJ9fV0sXCJkYXRhLXRhYlwiOlwiZHVtbXlcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImJvb2tpbmcucGF5bWVudC5hY3RpdmVcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiQ1JFRElUIENBUkRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjI9PV8wXCJ9fV0sXCJkYXRhLXRhYlwiOlwiZHVtbXlcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImJvb2tpbmcucGF5bWVudC5hY3RpdmVcXFwiLDJdXCJ9fX0sXCJmXCI6W1wiREVCSVQgQ0FSRFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMz09XzBcIn19XSxcImRhdGEtdGFiXCI6XCJkdW1teVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiYm9va2luZy5wYXltZW50LmFjdGl2ZVxcXCIsM11cIn19fSxcImZcIjpbXCJORVQgQkFOS0lOR1wiXX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3JlZGl0LWNhcmRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHR3byBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVzZXRDQ1wiLFwiYVwiOntcInJcIjpbXCJldmVudFwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibnVtYmVyIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiQ3JlZGl0XCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLnBheW1lbnQuYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIkRlYml0XCJdLFwieFwiOntcInJcIjpbXCJib29raW5nLnBheW1lbnQuYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LFwiIENhcmQgTnVtYmVyIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY2NcIixcImFcIjp7XCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmlkXCJ9XSxcImNsYXNzXCI6XCJjYXJkLW51bWJlciBmbHVpZFwiLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MudHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLm51bWJlclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm51bWJlclwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aHJlZSBleHBpcnkgZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiRXhwaXJ5IE1vbnRoIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwibW9udGhcIixcInBsYWNlaG9sZGVyXCI6XCJNb250aFwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0LmNhcmRNb250aHNcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5leHBfbW9udGhcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5leHBfbW9udGhcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkV4cGlyeSBZZWFyIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwieWVhclwiLFwicGxhY2Vob2xkZXJcIjpcIlllYXJcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5jYXJkWWVhcnNcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5leHBfeWVhclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLmV4cF95ZWFyXCJ9XX0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCIsXCJzdHlsZVwiOlwicG9zaXRpb246IHJlbGF0aXZlO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiQ1ZWIE5vIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY3Z2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsdWlkIGN2dlwiLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MudHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmN2dlwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLmN2dlwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjdnYtaW1hZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIjQgZGlnaXQgQ1ZWIE51bWJlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2NC1pbWdcIn0sXCJmXCI6W1wiwqBcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiY2MudHlwZVwiXSxcInNcIjpcIlxcXCJhbWV4XFxcIj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIjMgZGlnaXQgQ1ZWIE51bWJlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2My1pbWdcIn0sXCJmXCI6W1wiwqBcIl19XSxcInhcIjp7XCJyXCI6W1wiY2MudHlwZVwiXSxcInNcIjpcIlxcXCJhbWV4XFxcIj09XzBcIn19XX1dLFwiblwiOjUwLFwiclwiOlwiY2MudHlwZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJudW1iZXIgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkNhcmQgSG9sZGVyJ3MgTmFtZSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MubmFtZVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm5hbWVcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic3RvcmUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuaWRcIn1dLFwidHlwZVwiOlwiY2hlY2tib3hcIixcImNoZWNrZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5zdG9yZVwifV19fSxcIiBTdG9yZSBjYXJkIGZvciBmdXR1cmUgdXNlLlwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlNhdmVkIGNhcmRzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBsaXN0XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0Q2FyZFwiLFwiYVwiOntcInJcIjpbXCIuXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm51bWJlclwiLFwic1wiOnRydWV9XX1dfV0sXCJuXCI6NTIsXCJyXCI6XCJjYXJkc1wifV19XX1dLFwiblwiOjUwLFwiclwiOlwiY2FyZHNcIn1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMHx8Mj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJuZXRiYW5raW5nXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJCYW5rIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJTZWxlY3QgWW91ciBCYW5rIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhbmsgZmx1aWRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibmV0YmFua2luZy5uZXRfYmFua2luZ1wifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm5ldF9iYW5raW5nXCJ9XSxcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJiYW5rc1wifV19fV19XX1dLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMHx8Mj09XzBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcInN0ZXAuZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5lcnJvcnNcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdHdvIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d28gZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJBcHBseSBQcm9tbyBDb2Rlc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicHJvbW9jb2RlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb21vY29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgXCIsXCJwbGFjZWhvbGRlclwiOlwiRW50ZXIgUHJvbW8gQ29kZVwiLFwiZGlzYWJsZWRcIjpcImRpc2FibGVkXCJ9LFwiZlwiOltdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwcm9tb2NvZGVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvbW9jb2RlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCBcIixcInBsYWNlaG9sZGVyXCI6XCJFbnRlciBQcm9tbyBDb2RlXCJ9LFwiZlwiOltdfV0sXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlbW92ZVByb21vQ29kZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJyZWQgcmVtb3ZlIGNpcmNsZSBvdXRsaW5lIGljb25cIixcImFsdFwiOlwiUmVtb3ZlIFByb21vIENvZGVcIixcInRpdGxlXCI6XCJSZW1vdmUgUHJvbW8gQ29kZVwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIGJ1dHRvblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImFwcGx5UHJvbW9Db2RlXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJBUFBMWVwiXX1dLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcImNsZWFyOmJvdGg7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzbWFsbCBmaWVsZCBuZWdhdGl2ZSBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlbW92ZUVycm9yTXNnXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJwcm9tb2Vycm9yXCJ9XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vZXJyb3JcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY2xpZW50U291cmNlSWRcIl0sXCJzXCI6XCJfMD09MVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5vdGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIlBsZWFzZSBOb3RlIDpcIl19LFwiIFRoZSBjaGFyZ2Ugd2lsbCBhcHBlYXIgb24geW91ciBjcmVkaXQgY2FyZCAvIEFjY291bnQgc3RhdGVtZW50IGFzICdBaXJ0aWNrZXRzIEluZGlhIFB2dCBMdGQnXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhZ3JlZW1lbnQgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImNoZWNrYm94XCIsXCJjaGVja2VkXCI6W3tcInRcIjoyLFwiclwiOlwiYWNjZXB0ZWRcIn1dfX0sXCIgSSBoYXZlIHJlYWQgYW5kIGFjY2VwdGVkIHRoZSBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIvYjJjL2Ntcy90ZXJtc0FuZENvbmRpdGlvbnMvMlwiLFwidGFyZ2V0XCI6XCJfYmxhbmtcIn0sXCJmXCI6W1wiVGVybXMgT2YgU2VydmljZVwiXX0sXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInByaWNlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbXCJDb252ZW5pZW5jZSBmZWUgXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIHdpbGwgYmUgY2hhcmdlZFwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCJdLFwic1wiOlwiXzA+MFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYW1vdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xK18yLF8zKVwifX0sXCIgLSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInByb21vdmFsdWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgPSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIixcInByb21vdmFsdWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xK18yLV8zLF80KVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCIoXCIse1widFwiOjIsXCJyXCI6XCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIn0sXCIgUHJpY2UgaXMgaW5kaWNhdGl2ZSBvbmx5LiBZb3Ugd2lsbCBiZSBjaGFyZ2VkIGVxdWl2YWxlbnQgaW4gSU5SLiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiZm9ybWF0UGF5TW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIixcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMChfMStfMi1fMylcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAhPVxcXCJJTlJcXFwiXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFtb3VudFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMStfMixfMylcIn19LFwiIC0gXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwcm9tb3ZhbHVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiID0gXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJwcm9tb3ZhbHVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMStfMi1fMyxfNClcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiKFRvdGFsIFBheWFibGUgQW1vdW50KVwiXX1dLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAhPVxcXCJJTlJcXFwiXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYW1vdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xK18yLF8zKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYW10Tm90aWNlXCJ9LFwiZlwiOltcIihcIix7XCJ0XCI6MixcInJcIjpcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwifSxcIiBQcmljZSBpcyBpbmRpY2F0aXZlIG9ubHkuIFlvdSB3aWxsIGJlIGNoYXJnZWQgZXF1aXZhbGVudCBpbiBJTlIuIFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJmb3JtYXRQYXlNb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5jb252ZW5pZW5jZUZlZVwiXSxcInNcIjpcIl8wKF8xK18yKVwifX0sXCIpXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMCE9XFxcIklOUlxcXCJcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYW1vdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xK18yLF8zKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCIoVG90YWwgUGF5YWJsZSBBbW91bnQpXCJdfV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMCE9XFxcIklOUlxcXCJcIn19XSxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInZlcmlmaWVkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL3ZlcmlmaWVkL3Zidl8yNTAuZ2lmXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL3ZlcmlmaWVkL21hc3RlcmNhcmRfc2VjdXJlY29kZS5naWZcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvdmVyaWZpZWQvQU1FWF9TYWZlS2V5XzE4MHg5OXB4LnBuZ1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy92ZXJpZmllZC9wY2ktZHNzLWNvbXBsaWFudC5qcGdcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvdmVyaWZpZWQvU1NMLXNlY3VyaXR5LXNlYWwucG5nXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6W1widWkgd2l6YXJkIGJ1dHRvbiBtYXNzaXZlIFwiLHtcInRcIjo0LFwiZlwiOltcImdyZWVuXCJdLFwiblwiOjUwLFwiclwiOlwiYWNjZXB0ZWRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wicmVkXCJdLFwiclwiOlwiYWNjZXB0ZWRcIn1dfSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWQ9XFxcImRpc2FibGVkXFxcIlwiXSxcIm5cIjo1MSxcInJcIjpcImFjY2VwdGVkXCJ9XSxcImZcIjpbXCJCT09LIEZMSUdIVFwiXX1dfV19XSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuYWN0aXZlXCJ9XSxcInhcIjp7XCJyXCI6W1wic3RlcC5hY3RpdmVcIixcInN0ZXAuY29tcGxldGVkXCJdLFwic1wiOlwiIV8wJiZfMVwifX1dLFwiblwiOjUxLFwiclwiOlwic3RlcC5jb21wbGV0ZWRcIn1dLFwieFwiOntcInJcIjpbXCJib29raW5nLnN0ZXBzLjNcIixcImJvb2tpbmcucGF5bWVudC5jY1wiLFwiYm9va2luZy5wYXltZW50Lm5ldGJhbmtpbmdcIixcImJvb2tpbmcucGF5bWVudC5hY3RpdmVcIl0sXCJzXCI6XCJ7c3RlcDpfMCxjYzpfMSxuZXRiYW5raW5nOl8yLGFjdGl2ZTpfM31cIn19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDMuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDkxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJ2pxdWVyeS5wYXltZW50Jyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuLi9pbnB1dCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vY2MuaHRtbCcpLFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcblxyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdmb3JtYXRDYXJkTnVtYmVyJyk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnY2N0eXBlJywgJC5wYXltZW50LmNhcmRUeXBlKHZhbHVlKSk7XHJcbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Rlc3Ryb3knKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9jYy9udW1iZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA5MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgaW5wdXQgXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcImVycm9yXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjbGFzc2VzXCIsXCJzdGF0ZVwiLFwibGFyZ2VcIixcInZhbHVlXCJdLFwic1wiOlwiXzAoXzEsXzIsXzMpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcGxhY2Vob2xkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJsYXJnZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJ0ZXh0XCJdLFwiblwiOjUwLFwiclwiOlwiZGlzYWJsZWRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widGVsXCJdLFwiclwiOlwiZGlzYWJsZWRcIn1dLFwibmFtZVwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJwbGFjZWhvbGRlcj1cXFwiXCIse1widFwiOjIsXCJyXCI6XCJwbGFjZWhvbGRlclwifSxcIlxcXCJcIl0sXCJuXCI6NTEsXCJyXCI6XCJsYXJnZVwifSx7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcImRpc2FibGVkXCJ9LHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0YXRlLmRpc2FibGVkXCIsXCJzdGF0ZS5zdWJtaXR0aW5nXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRMaXN0IGNsZWFyRml4IGZMZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJjYXJkVHlwZSBcIix7XCJ0XCI6MixcInJcIjpcImNjdHlwZVwifV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImNjdHlwZVwifV19XX1dLFwiblwiOjUwLFwiclwiOlwiY2N0eXBlXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRMaXN0IGNsZWFyRml4IGZMZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRUeXBlIHZpc2FcIn0sXCJmXCI6W1wiVmlzYVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSBtYXN0ZXJcIn0sXCJmXCI6W1wiTWFzdGVyY2FyZFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSBhbWV4XCJ9LFwiZlwiOltcIkFtZXJpY2FuIEV4cHJlc3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FyZFR5cGUgZGluZXJzXCJ9LFwiZlwiOltcIkRpbmVyc1wiXX1dfV0sXCJyXCI6XCJjY3R5cGVcIn1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NjLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA5M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJ2pxdWVyeS5wYXltZW50Jyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuLi9pbnB1dCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgIHR5cGU6ICd0ZWwnXHJcbiAgICAgICAgICAgLy8gdHlwZTogJ3Bhc3N3b3JkJ1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Zvcm1hdENhcmRDVkMnKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgb250ZWFkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkucGF5bWVudCgnZGVzdHJveScpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL2NjL2N2di5qc1xuICoqIG1vZHVsZSBpZCA9IDk0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnanF1ZXJ5LnBheW1lbnQnKTtcclxuXHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4uL2lucHV0JyksXHJcbiAgICAgICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICB0eXBlOiAndGVsJ1xyXG4gICAgICAgICAgIC8vIHR5cGU6ICdwYXNzd29yZCdcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG4gICAgICAgIHZhciB2aWV3PXRoaXM7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Zvcm1hdENhcmRFeHBpcnknKTtcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkua2V5dXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBib29raW5nID0gdmlldy5nZXQoJ2Jvb2tpbmcnKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY2FyZGV4cGlyeT0kKHZpZXcuZmluZCgnaW5wdXQnKSkudmFsKCk7XHJcbiAgICAgLy8gICBjb25zb2xlLmxvZyhjYXJkZXhwaXJ5KTtcclxuICAgICAgICBpZihjYXJkZXhwaXJ5ICE9bnVsbCAmJiBjYXJkZXhwaXJ5ICE9Jycpe1xyXG4gICAgICAgICAgICBjYXJkZXhwaXJ5LnJlcGxhY2UoLyAvZywnJyk7XHJcbiAgICAgICAgICAgIHZhciBjYXJkYXJyPWNhcmRleHBpcnkuc3BsaXQoJy8nKTtcclxuICAgICAgICAgICAgaWYoY2FyZGFyclswXSE9IG51bGwpe1xyXG4gICAgICAgICAgICBib29raW5nLnNldCgncGF5bWVudC5jYy5leHBfbW9udGgnLF8ucGFyc2VJbnQoY2FyZGFyclswXSkpO31cclxuICAgICAgICBpZihjYXJkYXJyWzFdIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBsZW49Y2FyZGFyclsxXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBjYXJkeWVhcj1fLnBhcnNlSW50KGNhcmRhcnJbMV0pO1xyXG4gICAgICAgICAgICBpZihjYXJkeWVhcjwxMDApe1xyXG4gICAgICAgICAgICAgICAgY2FyZHllYXI9MjAwMCtjYXJkeWVhcjtcclxuICAgICAgICAgICAgfWVsc2UgaWYoY2FyZHllYXI8MTAwMCl7XHJcbiAgICAgICAgICAgICAgICBjYXJkeWVhcj0yMDAwK2NhcmR5ZWFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgY29uc29sZS5sb2coY2FyZHllYXIpO1xyXG4gICAgICAgICAgICBib29raW5nLnNldCgncGF5bWVudC5jYy5leHBfeWVhcicsY2FyZHllYXIpO31cclxuICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgb250ZWFkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkucGF5bWVudCgnZGVzdHJveScpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL2NjL2NhcmRleHBpcnkuanNcbiAqKiBtb2R1bGUgaWQgPSA5NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG5cclxuICAgIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JykoKSxcclxuICAgIGhfZHVyYXRpb24gPSByZXF1aXJlKCdoZWxwZXJzL2R1cmF0aW9uJykoKSxcclxuICAgIGhfZGF0ZSA9IHJlcXVpcmUoJ2hlbHBlcnMvZGF0ZScpKClcclxuICAgIDtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDQuaHRtbCcpLFxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5hY3RpdmF0ZSgzKTtcclxuICAgIH0sXHJcbiAgICAgICAgXHJcbiAgIH0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9zdGVwNC5qc1xuICoqIG1vZHVsZSBpZCA9IDk2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInN0ZXAgaGVhZGVyIHN0ZXA0IGFjdGl2ZVwiLFwicm9sZVwiOlwidGFiXCJ9LFwiZlwiOltcIkJvb2tpbmdcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlwidWkgZm9ybSBzZWdtZW50IHN0ZXA0XCIsXCJzdHlsZVwiOlwiaGVpZ2h0OiA0MDBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tpbmctaWRcIn0sXCJmXCI6W1wiQm9va2luZyBJRDogXCIse1widFwiOjIsXCJyXCI6XCJib29raW5nLmFpcmNhcnRfaWRcIn1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibWVzc2FnZVwifSxcImZcIjpbXCJXZSBoYXZlIHJlY2VpdmVkIHlvdXIgUGF5bWVudCBhbmQgeW91ciBCb29raW5nIGlzIGluIHByb2Nlc3MsIG91ciBjdXN0b21lciBzdXBwb3J0IHRlYW0gd2lsbCBjb250YWN0IHlvdSBzaG9ydGx5LiBPciBDYWxsIG91ciBjdXN0b21lciBzdXBwb3J0IHRlYW0gZm9yIG1vcmUgZGV0YWlsLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6W1wiL2IyYy9haXJDYXJ0L215Ym9va2luZ3MvXCIse1widFwiOjIsXCJyXCI6XCJib29raW5nLmFpcmNhcnRfaWRcIn1dfSxcImZcIjpbXCJWaWV3IHlvdXIgdGlja2V0XCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmdcIixcImJvb2tpbmcuYWlyY2FydF9zdGF0dXNcIl0sXCJzXCI6XCJfMC5pc05ldyhfMSlcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibWVzc2FnZVwifSxcImZcIjpbXCJZb3VyIEJvb2tpbmcgaXMgU3VjY2Vzc2Z1bCFcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZ1wiLFwiYm9va2luZy5haXJjYXJ0X3N0YXR1c1wiXSxcInNcIjpcIl8wLmlzQm9va2VkKF8xKVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1lc3NhZ2VcIn0sXCJmXCI6W1wiWW91ciBCb29raW5nIGlzIGluIHByb2Nlc3MhXCJdfV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmdcIixcImJvb2tpbmcuYWlyY2FydF9zdGF0dXNcIl0sXCJzXCI6XCJfMC5pc0Jvb2tlZChfMSlcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOltcIi9iMmMvYWlyQ2FydC9teWJvb2tpbmdzL1wiLHtcInRcIjoyLFwiclwiOlwiYm9va2luZy5haXJjYXJ0X2lkXCJ9XX0sXCJmXCI6W1wiVmlldyB5b3VyIHRpY2tldFwiXX1dLFwieFwiOntcInJcIjpbXCJib29raW5nXCIsXCJib29raW5nLmFpcmNhcnRfc3RhdHVzXCJdLFwic1wiOlwiXzAuaXNOZXcoXzEpXCJ9fV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmNvbXBsZXRlZFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYWN0aXZlIGludmVydGVkIGRpbW1lclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdGV4dCBsb2FkZXJcIn0sXCJmXCI6W1wiWW91ciBib29raW5nIGlzIGluIHByb2dyZXNzLlwiXX1dfV0sXCJyXCI6XCJzdGVwLmNvbXBsZXRlZFwifV19XSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuYWN0aXZlXCJ9XSxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5zdGVwcy40XCJdLFwic1wiOlwie3N0ZXA6XzB9XCJ9fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL3N0ZXA0Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA5N1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDNcbiAqKi8iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9sZXNzL3dlYi9tb2R1bGVzL2Jvb2tpbmcubGVzc1xuICoqIG1vZHVsZSBpZCA9IDk5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgM1xuICoqLyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBwYWdlID0gcmVxdWlyZSgncGFnZScpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpLFxyXG4gICAgU2VhcmNoRm9ybSA9IHJlcXVpcmUoJ3BhZ2VzL2ZsaWdodHMvc2VhcmNoJyksXHJcbiAgICBTZWFyY2hSZXN1bHRzID0gIHJlcXVpcmUoJ3BhZ2VzL2ZsaWdodHMvcmVzdWx0cycpLFxyXG4gICAgQm9va2luZyA9ICByZXF1aXJlKCdwYWdlcy9mbGlnaHRzL2Jvb2tpbmcnKVxyXG4gICAgO1xyXG5cclxucmVxdWlyZSgnd2ViL21vZHVsZXMvZmxpZ2h0cy5sZXNzJyk7XHJcbnJlcXVpcmUoJ3dlYi9tb2R1bGVzL2Jvb2tpbmcubGVzcycpO1xyXG5cclxuZnVuY3Rpb24gcGFyc2VRdWVyeShxc3RyKSB7XHJcbiAgICB2YXIgcXVlcnkgPSB7fTtcclxuICAgIHZhciBhID0gcXN0ci5zcGxpdCgnJicpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGIgPSBhW2ldLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgcXVlcnlbZGVjb2RlVVJJQ29tcG9uZW50KGJbMF0pXSA9IGRlY29kZVVSSUNvbXBvbmVudChiWzFdIHx8ICcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBxdWVyeTtcclxufVxyXG5cclxudmFyIGFjdGlvbnMgPSB7XHJcbiAgICBmb3JtOiBmdW5jdGlvbihjdHgsIG5leHQpIHtcclxuICAgICAgICAobmV3IFNlYXJjaEZvcm0oKSkucmVuZGVyKCcjYXBwJykudGhlbihmdW5jdGlvbigpIHsgbmV4dCgpOyB9KTtcclxuICAgIH0sXHJcbiAgICBzZWFyY2g6IGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xyXG4gICAgICAgIHZhciBxdWVyeSA9IHBhcnNlUXVlcnkoY3R4LnF1ZXJ5c3RyaW5nKTtcclxuXHJcbiAgICAgICAgKG5ldyBTZWFyY2hSZXN1bHRzKHtkYXRhOiB7IHVybDogY3R4LnBhcmFtc1swXSwgZm9yY2U6IHF1ZXJ5LmZvcmNlIHx8IGZhbHNlLCBjczogcXVlcnkuY3MgfHwgbnVsbCB9fSkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XHJcbiAgICB9LFxyXG4gICAgYm9va2luZzogZnVuY3Rpb24oY3R4LCBuZXh0KSB7XHJcbiAgICAgICAgKG5ldyBCb29raW5nKHsgZGF0YTogeyBpZDogY3R4LnBhcmFtcy5pZCB9fSkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5NZXRhLmluc3RhbmNlKCkudGhlbihmdW5jdGlvbihtZXRhKSB7XHJcbiAgICBwYWdlKCcvYjJjL2Jvb2tpbmcvOmlkJywgYWN0aW9ucy5ib29raW5nKTtcclxuICAgIHBhZ2UoJy9iMmMvZmxpZ2h0cycsIGFjdGlvbnMuZm9ybSk7XHJcbiAgICBwYWdlKCcvYjJjL2ZsaWdodHMvc2VhcmNoJywgYWN0aW9ucy5mb3JtKTtcclxuICAgIHBhZ2UoL1xcL2IyY1xcL2ZsaWdodHNcXC9zZWFyY2hcXC8oLiopLywgYWN0aW9ucy5zZWFyY2gpO1xyXG5cclxuXHJcbiAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvZmxpZ2h0cy5qc1xuICoqIG1vZHVsZSBpZCA9IDIxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXHJcbiAgICA7XHJcblxyXG52YXIgUGFnZSA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvcGFnZScpLFxyXG4gICAgU2VhcmNoID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9zZWFyY2gnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdlLmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvc2VhcmNoLmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ3NlYXJjaC1mb3JtJzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9mb3JtJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlY2VudCA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZWFyY2hlcycpIHx8IG51bGwpIHx8IFtdO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZWFyY2g6IG5ldyBTZWFyY2goKSxcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3QsXHJcbiAgICAgICAgICAgIG1vbWVudDogbW9tZW50LFxyXG4gICAgICAgICAgICByZWNlbnQ6IF8ubWFwKHJlY2VudCwgZnVuY3Rpb24oaSkgeyByZXR1cm4gbW9tZW50KGkuc2VhcmNoLmZsaWdodHNbMF0uZGVwYXJ0X2F0KSA/IGkgOiBudWxsOyB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3BhZ2VzL2ZsaWdodHMvc2VhcmNoLmpzXG4gKiogbW9kdWxlIGlkID0gMjExXG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcclxuICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG5cclxuICAgIHBhcnRpYWxzOiB7XHJcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcclxuICAgIH0sXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIGxheW91dDogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvbGF5b3V0JylcclxuICAgIH0sXHJcblxyXG4gICAgc2lnbmluOiBmdW5jdGlvbigpIHsgQXV0aC5sb2dpbigpLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkgfSk7IH0sXHJcblxyXG4gICAgc2lnbnVwOiBmdW5jdGlvbigpIHsgQXV0aC5zaWdudXAoKTsgfSxcclxuXHJcbiAgICBsZWZ0TWVudTogZnVuY3Rpb24oKSB7IHRoaXMudG9nZ2xlKCdsZWZ0bWVudScpOyB9LFxyXG4gICAgXHJcbiAgICBzd2FwU2VhcmNoOiBmdW5jdGlvbihzZWFyY2gpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgc2VhcmNoID0gXy5jbG9uZURlZXAoc2VhcmNoKTtcclxuICAgICAgICBfLmVhY2goc2VhcmNoLmZsaWdodHMsIGZ1bmN0aW9uKGksIGspIHtcclxuICAgICAgICAgICAgaS5kZXBhcnRfYXQgPSBtb21lbnQoaS5kZXBhcnRfYXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGkucmV0dXJuX2F0KSB7XHJcbiAgICAgICAgICAgICAgICBpLnJldHVybl9hdCA9IG1vbWVudChpLnJldHVybl9hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2VhcmNoLnNhdmVkID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZ2V0KCdzZWFyY2gnKS5zZXQoc2VhcmNoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2aWV3LnNldCgnc2VhcmNoLnNhdmVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvcGFnZS5qc1xuICoqIG1vZHVsZSBpZCA9IDIxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwibGF5b3V0XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6IDEwMCVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJwYWRkaW5nLXJpZ2h0OiAxMHB4O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcmVsYXhlZCBzZWdtZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNlYXJjaC1mb3JtXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhc2ljIHNlZ21lbnRcIixcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV19fV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6IDQwMHB4OyBwYWRkaW5nLWxlZnQ6IDEwcHg7IHZlcnRpY2FsLWFsaWduOiB0b3A7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIixcInN0eWxlXCI6XCIgIGZvbnQtc2l6ZTogMTZweDsgZm9udC13ZWlnaHQ6IG5vcm1hbDsgY29sb3I6ICMyMDI2Mjk7IG1hcmdpbi1ib3R0b206IDEwcHg7XCJ9LFwiZlwiOltcIlJlY2VudCBTZWFyY2hlc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudCByZWNlbnQtc2VhcmNoZXNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJveFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIixcIi4vc2VhcmNoLmZsaWdodHMuMC5kZXBhcnRfYXRcIl0sXCJzXCI6XCJfMChfMSkuZm9ybWF0KFxcXCJNTU1cXFwiKVwifX0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIixcIi4vc2VhcmNoLmZsaWdodHMuMC5kZXBhcnRfYXRcIl0sXCJzXCI6XCJfMChfMSkuZm9ybWF0KFxcXCJERFxcXCIpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCIsXCJzdHlsZVwiOlwiY3Vyc29yOiBwb2ludGVyO1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInN3YXBTZWFyY2hcIixcImFcIjp7XCJyXCI6W1wic2VhcmNoXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImZyb20uY2l0eVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJiYWNrXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCIuL3NlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjI9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJ0b1wiXSxcInhcIjp7XCJyXCI6W1wiLi9zZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIyPT1fMFwifX1dfSxcImZcIjpbXCLCoFwiXX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJ0by5jaXR5XCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIihtdWx0aWNpdHkpXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCIuL3NlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjM9PV8wXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImluZm9cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi4vc2VhcmNoLnBhc3NlbmdlcnMuMFwifSxcIiBBZHVsdFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiLi9zZWFyY2gucGFzc2VuZ2Vycy4wXCJdLFwic1wiOlwiXzA+MFwifX0se1widFwiOjQsXCJmXCI6W1wiLCBcIix7XCJ0XCI6MixcInJcIjpcIi4vc2VhcmNoLnBhc3NlbmdlcnMuMVwifSxcIiBDaGlsZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiLi9zZWFyY2gucGFzc2VuZ2Vycy4xXCJdLFwic1wiOlwiXzA+MFwifX0se1widFwiOjQsXCJmXCI6W1wiLCBcIix7XCJ0XCI6MixcInJcIjpcIi4vc2VhcmNoLnBhc3NlbmdlcnMuMlwifSxcIiBJbmZhbnRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIi4vc2VhcmNoLnBhc3NlbmdlcnMuMlwiXSxcInNcIjpcIl8wPjBcIn19XX1dfV0sXCJuXCI6NTIsXCJyXCI6XCJyZWNlbnRcIn1dfV19XX1dLFwiblwiOjUwLFwiclwiOlwicmVjZW50XCJ9XX1dfSxcIiBcIl0sXCJwXCI6e1wicGFuZWxcIjpbe1widFwiOjgsXCJyXCI6XCJiYXNlLXBhbmVsXCJ9XX19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9wYWdlcy9mbGlnaHRzL3NlYXJjaC5odG1sXG4gKiogbW9kdWxlIGlkID0gMjEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UuanMnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXHJcbiAgICA7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvZm9ybS5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1zcGlubmVyJzogcmVxdWlyZSgnY29yZS9mb3JtL3NwaW5uZXInKSxcclxuICAgICAgICAndWktYWlycG9ydCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9haXJwb3J0JyksXHJcbiAgICAgICAgJ3VpLWNhbGVuZGFyJzogcmVxdWlyZSgnY29yZS9mb3JtL2NhbGVuZGFyJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3QsXHJcbiAgICAgICAgICAgIG1vbWVudDogbW9tZW50XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5vbignbmV4dCcsIGZ1bmN0aW9uKHZpZXcpIHtcclxuICAgICAgICAgICAgLy9UT0RPOiB0aGluayBvZiBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCdmb3JtJykpLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGlmeScpICYmICF0aGlzLmdldCgnc2VhcmNoLmRvbWVzdGljJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCduZXh0JykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gdmlldy5nZXQoJ25leHQnKS5zcGxpdCgnLScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgndG8nID09IG5leHRbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMuZmluZCgnLicgKyB2aWV3LmdldCgnbmV4dCcpICsgJyBpbnB1dC5zZWFyY2gnKSkuY2xpY2soKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgnZGVwYXJ0JyA9PSBuZXh0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLicgKyB2aWV3LmdldCgnbmV4dCcpKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgncmV0dXJuJyA9PSBuZXh0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLicgKyB2aWV3LmdldCgnbmV4dCcpKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgdmFyIG9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoeyBvbkhpZGRlbjogZnVuY3Rpb24oKSB7ICQoJyNtX2J0bicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpOyAgfSwgb25TaG93OiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9fSk7XHJcbiAgICAgICAgICAgICQoJy5kcm9wZG93bicpLmRyb3Bkb3duKCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbV9idG4nLCB0aGlzLmVsKS5vbignY2xpY2subGF5b3V0JyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJCgnLnB1c2hlcicpLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGlmeScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdvcGVuJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldCgnc2VhcmNoLmZsaWdodHMnLCB0aGlzLmdldCgnc2VhcmNoLmZsaWdodHMnKSk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2ZvciBuby4gb2YgdHJhdmVsbGVyXHJcbiAgICAgICAgJCgnLnRyYXZlbGxlcicpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLnRyYXZlbGxlcnNJbmZvJykuZmFkZUluKDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5jbG9zZWJ0bicpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLnRyYXZlbGxlcnNJbmZvJykuZmFkZU91dCg0MDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vZm9yIHRyYXZlbGxlciBjbGFzc1xyXG4gICAgICAgICQoJy50cmF2ZWxDbGFzcycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLkNsYXNzSW5mbycpLmZhZGVJbig0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAkKCcuQ2xhc3NJbmZvIGEnKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJy5DbGFzc0luZm8nKS5mYWRlT3V0KDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5jbG9zZWNsYXNzJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCcuQ2xhc3NJbmZvJykuZmFkZU91dCg0MDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYXJkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5zZXQoJ21vZGlmeScsIG51bGwpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0b2dnbGVSb3VuZHRyaXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICgyICE9PSB0aGlzLmdldCgnc2VhcmNoLnRyaXBUeXBlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3NlYXJjaC50cmlwVHlwZScsIDIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYWRkVHJhdmVsZXI6IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldCgnc2VhcmNoLnBhc3NlbmdlcnMuJyArIHR5cGUpO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPCA5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzZWFyY2gucGFzc2VuZ2Vycy4nICsgdHlwZSwgdmFsdWUgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoJ3NlYXJjaC5wYXNzZW5nZXJzLicgKyB0eXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnc2VhcmNoLnBhc3NlbmdlcnMuJyArIHR5cGUsIHZhbHVlIC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmVGbGlnaHQ6IGZ1bmN0aW9uKGkpIHsgdGhpcy5nZXQoJ3NlYXJjaCcpLnJlbW92ZUZsaWdodChpKTsgfSxcclxuICAgIGFkZEZsaWdodDogZnVuY3Rpb24oKSB7IHRoaXMuZ2V0KCdzZWFyY2gnKS5hZGRGbGlnaHQoKTsgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICB0aGlzLnBvc3QoUk9VVEVTLnNlYXJjaCwgdGhpcy5zZXJpYWxpemUoKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5nZXQoJ21vZGlmeScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBhZ2Uoc2VhcmNoLnVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5nZXQoJ3NlYXJjaCcpLnRvSlNPTigpOyB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL2Zvcm0uanNcbiAqKiBtb2R1bGUgaWQgPSAyMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbW9kaWZ5LXNlYXJjaCBzbWFsbCBtb2RhbFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJNb2RpZnkgU2VhcmNoXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCIsXCJzdHlsZVwiOlwicGFkZGluZzogMHB4O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo4LFwiclwiOlwiZm9ybVwifV0sXCJuXCI6NTAsXCJyXCI6XCJvcGVuXCJ9XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJtb2RpZnlcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo4LFwiclwiOlwiZm9ybVwifV0sXCJyXCI6XCJtb2RpZnlcIn0sXCIgXCJdLFwicFwiOntcImZvcm1cIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiaWRcIjpcImZsaWdodHMtc2VhcmNoXCIsXCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic2VhcmNoLnBlbmRpbmdcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvcnNcIn1dLFwiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOltcIlNlYXJjaCwgQm9vayAmIEZseSFcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIkxvd2VzdCBQcmljZXMgYW5kIDEwMCUgc2VjdXJlIVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdG9wIGF0dGFjaGVkIHRhYnVsYXIgbWVudVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpbe1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwiclwiOlwic2VhcmNoLmRvbWVzdGljXCJ9LFwiIGl0ZW0gdXBwZXJjYXNlXCJdLFwiZGF0YS10YWJcIjpcImRvbWVzdGljXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzZWFyY2guZG9tZXN0aWNcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiRG9tZXN0aWNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W3tcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLmRvbWVzdGljXCJdLFwic1wiOlwiIV8wXCJ9fSxcIiBpdGVtIHVwcGVyY2FzZVwiXSxcImRhdGEtdGFiXCI6XCJpbnRlcm5hdGlvbmFsXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzZWFyY2guZG9tZXN0aWNcXFwiLDBdXCJ9fX0sXCJmXCI6W1wiSW50ZXJuYXRpb25hbFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBib3R0b20gYXR0YWNoZWQgYWN0aXZlIHRhYiBzZWdtZW50IGJhc2ljXCJ9LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImNoZWNrYm94ZXNcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm11bHRpY2l0eVwifSxcInQxXCI6XCJmYWRlXCIsXCJmXCI6W3tcInRcIjo4LFwiclwiOlwibXVsdGljaXR5XCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFkZC1mbGlnaHRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOlwidWkgYmFzaWMgYnV0dG9uIGNpcmN1bGFyXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYWRkRmxpZ2h0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCIrIEFkZCBuZXdcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMz09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzaW1wbGVcIn0sXCJ0MVwiOlwiZmFkZVwiLFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcIml0aW5lcmFyeVwifSxcIiBcIix7XCJ0XCI6OCxcInJcIjpcImRhdGVzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcInJcIjpcImVycm9ycy5mbGlnaHQuMFwifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9ycy5mbGlnaHQuMFwifV19XSxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMz09XzBcIn19LFwiIFwiLHtcInRcIjo4LFwiclwiOlwicGFzc2VuZ2Vyc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOltdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJpXCJdLFwic1wiOlwiXFxcImZsaWdodFxcXCI9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcInhcIjp7XCJyXCI6W1wiaVwiXSxcInNcIjpcIlxcXCJmbGlnaHRcXFwiPT1fMFwifX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JzXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwidWkgYnV0dG9uIG1hc3NpdmUgZmx1aWQgdXBwZXJjYXNlXCJ9LFwiZlwiOltcIlNlYXJjaCBGbGlnaHRzXCJdfV19XX1dLFwiZGF0ZXNcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidHdvIGZpZWxkcyBmcm9tLXRvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1kYXRlXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwifV0sXCJjbGFzc1wiOlwiZmx1aWQgZGVwYXJ0LTAgcG9pbnRpbmcgdG9wIGxlZnRcIixcImxhcmdlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiREVQQVJUIE9OXCIsXCJtaW5cIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcIm1vbWVudFwiXSxcInNcIjpcIl8wKClcIn19XSxcIm1heFwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCIsXCJzZWFyY2guZmxpZ2h0cy4wLnJldHVybl9hdFwiXSxcInNcIjpcIjI9PV8wJiZfMVwifX1dLFwidHdvbW9udGhcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltdLFwic1wiOlwidHJ1ZVwifX1dLFwicmFuZ2VcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCIsXCJzZWFyY2guZmxpZ2h0cy4wLnJldHVybl9hdFwiXSxcInNcIjpcIltfMCxfMV1cIn19XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmZsaWdodC4wLmRlcGFydF9hdFwifV0sXCJuZXh0XCI6XCJyZXR1cm4tMFwifSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidG9nZ2xlUm91bmR0cmlwXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1kYXRlXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLnJldHVybl9hdFwifV0sXCJjbGFzc1wiOltcImZsdWlkIHJldHVybi0wIHBvaW50aW5nIHRvcCByaWdodCBcIix7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MSxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMj09XzBcIn19XSxcImxhcmdlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiUkVUVVJOIE9OXCIsXCJtaW5cIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCIsXCJtb21lbnRcIl0sXCJzXCI6XCJfMHx8XzEoKVwifX1dLFwidHdvbW9udGhcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltdLFwic1wiOlwidHJ1ZVwifX1dLFwicmFuZ2VcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCIsXCJzZWFyY2guZmxpZ2h0cy4wLnJldHVybl9hdFwiXSxcInNcIjpcIltfMCxfMV1cIn19XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmZsaWdodC4wLnJldHVybl9hdFwifV19LFwiZlwiOltdfV19XX1dLFwicGFzc2VuZ2Vyc1wiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmb3VyIGZpZWxkcyBwYXNzZW5nZXJzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zcGlubmVyXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4wXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJBZHVsdHNcIixcIm1pblwiOlwiMFwiLFwibWF4XCI6XCI5XCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzZW5nZXJzXCJ9XX0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc3Bpbm5lclwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLnBhc3NlbmdlcnMuMVwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcImxhcmdlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiQ2hpbGRyZW5cIixcIm1pblwiOlwiMFwiLFwibWF4XCI6XCI5XCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzZW5nZXJzXCJ9XX0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhpbnRcIn0sXCJmXCI6W1wiMi0xMiB5ZWFyc1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zcGlubmVyXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4yXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJJbmZhbnRzXCIsXCJtaW5cIjpcIjBcIixcIm1heFwiOlwiOVwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc2VuZ2Vyc1wifV19LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoaW50XCJ9LFwiZlwiOltcIkJlbG93IDIgeWVhcnNcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guY2FiaW5UeXBlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJDbGFzc1wiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibWV0YS5zZWxlY3RcIl0sXCJzXCI6XCJfMC5jYWJpblR5cGVzKClcIn19XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmNhYmluVHlwZVwifV19LFwiZlwiOltdfV19XX1dLFwiaXRpbmVyYXJ5XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d28gZmllbGRzIGZyb20tdG9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWFpcnBvcnRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5mbGlnaHRzLjAuZnJvbVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgZnJvbS0wXCIsXCJwbGFjZWhvbGRlclwiOlwiRlJPTVwiLFwic2VhcmNoXCI6XCIxXCIsXCJsYXJnZVwiOlwiMVwiLFwiZG9tZXN0aWNcIjpcIjFcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmZsaWdodC4wLmZyb21cIn1dLFwibmV4dFwiOlwidG8tMFwifSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWFpcnBvcnRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5mbGlnaHRzLjAudG9cIn1dLFwiY2xhc3NcIjpcImZsdWlkIHRvLTBcIixcInBsYWNlaG9sZGVyXCI6XCJUT1wiLFwic2VhcmNoXCI6XCIxXCIsXCJsYXJnZVwiOlwiMVwiLFwiZG9tZXN0aWNcIjpcIjFcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmZsaWdodC4wLnRvXCJ9XSxcIm5leHRcIjpcImRlcGFydC0wXCJ9LFwidlwiOntcIm5leHRcIjpcIm5leHRcIn0sXCJmXCI6W119XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInR3byBmaWVsZHMgZnJvbS10b1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktYWlycG9ydFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC5mcm9tXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCBmcm9tLTBcIixcInBsYWNlaG9sZGVyXCI6XCJGUk9NXCIsXCJzZWFyY2hcIjpcIjFcIixcImxhcmdlXCI6XCIxXCIsXCJkb21lc3RpY1wiOlwiMFwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjAuZnJvbVwifV0sXCJuZXh0XCI6XCJ0by0wXCJ9LFwidlwiOntcIm5leHRcIjpcIm5leHRcIn0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktYWlycG9ydFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC50b1wifV0sXCJjbGFzc1wiOlwiZmx1aWQgdG8tMFwiLFwicGxhY2Vob2xkZXJcIjpcIlRPXCIsXCJzZWFyY2hcIjpcIjFcIixcImxhcmdlXCI6XCIxXCIsXCJkb21lc3RpY1wiOlwiMFwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjAudG9cIn1dLFwibmV4dFwiOlwiZGVwYXJ0LTBcIn0sXCJ2XCI6e1wibmV4dFwiOlwibmV4dFwifSxcImZcIjpbXX1dfV19XSxcInJcIjpcInNlYXJjaC5kb21lc3RpY1wifV0sXCJtdWx0aWNpdHlcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRocmVlIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCIuL2Zyb21cIn1dLFwiY2xhc3NcIjpbXCJmbHVpZCBmcm9tLVwiLHtcInRcIjoyLFwiclwiOlwiaVwiLFwic1wiOnRydWV9XSxcInNlYXJjaFwiOlwiMVwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJGUk9NXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtZXRhLnNlbGVjdFwiXSxcInNcIjpcIl8wLmRvbWVzdGljKClcIn0sXCJzXCI6dHJ1ZX1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcImVycm9ycy5mbGlnaHRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifSxcImZyb21cIl19fV0sXCJuZXh0XCI6W1widG8tXCIse1widFwiOjIsXCJyXCI6XCJpXCIsXCJzXCI6dHJ1ZX1dfSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiLi90b1wifV0sXCJjbGFzc1wiOltcImZsdWlkIHRvLVwiLHtcInRcIjoyLFwiclwiOlwiaVwiLFwic1wiOnRydWV9XSxcInNlYXJjaFwiOlwiMVwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJUT1wiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibWV0YS5zZWxlY3RcIl0sXCJzXCI6XCJfMC5kb21lc3RpYygpXCJ9LFwic1wiOnRydWV9XSxcImVycm9yXCI6W3tcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJlcnJvcnMuZmxpZ2h0XCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImlcIn0sXCJ0b1wiXX19XSxcIm5leHRcIjpbXCJkZXBhcnQtXCIse1widFwiOjIsXCJyXCI6XCJpXCIsXCJzXCI6dHJ1ZX1dfSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWRhdGVcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwic2VhcmNoLmZsaWdodHNcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifSxcImRlcGFydF9hdFwiXX19XSxcImNsYXNzXCI6W1wiZmx1aWQgZGVwYXJ0LVwiLHtcInRcIjoyLFwiclwiOlwiaVwifSxcIiBwb2ludGluZyB0b3AgcmlnaHRcIl0sXCJsYXJnZVwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIkRFUEFSVCBPTlwiLFwibWluXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIl0sXCJzXCI6XCJfMCgpXCJ9fV0sXCJjYWxlbmRhclwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W10sXCJzXCI6XCJ7dHdvbW9udGg6dHJ1ZX1cIn19XSxcInR3b21vbnRoXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXSxcInNcIjpcInRydWVcIn19XSxcImVycm9yXCI6W3tcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJlcnJvcnMuZmxpZ2h0c1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJpXCJ9LFwiZGVwYXJ0X2F0XCJdfX1dLFwibmV4dFwiOltcImRlcGFydC1cIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiaVwiXSxcInNcIjpcIl8wKzFcIn0sXCJzXCI6dHJ1ZX1dfSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGVsZXRlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVtb3ZlRmxpZ2h0XCIsXCJhXCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W1wiwqBcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiXSxcInNcIjpcIl8wPjFcIn19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJyeFwiOntcInJcIjpcImVycm9ycy5mbGlnaHRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifV19fV19XSxcIm5cIjo1MCxcInJ4XCI6e1wiclwiOlwiZXJyb3JzLmZsaWdodFwiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJpXCJ9XX19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcInNlYXJjaC5mbGlnaHRzXCJ9XSxcImNoZWNrYm94ZXNcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGhyZWUgZmllbGRzIHRyYXZlbC10eXBlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImRlY28gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIxPT1fMFwifX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcmFkaW8gY2hlY2tib3hcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNlYXJjaC50cmlwVHlwZVxcXCIsMV1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInJhZGlvXCIsXCJjaGVja2VkXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIxPT1fMFwifX1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOltcIk9ORSBXQVlcIl19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiZGVjbyBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjI9PV8wXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSByYWRpbyBjaGVja2JveFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2VhcmNoLnRyaXBUeXBlXFxcIiwyXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwicmFkaW9cIixcImNoZWNrZWRcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjI9PV8wXCJ9fV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W1wiUk9VTkQgVFJJUFwiXX1dfV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwidDFcIjpcImZhZGVcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImRlY28gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIzPT1fMFwifX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcmFkaW8gY2hlY2tib3hcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNlYXJjaC50cmlwVHlwZVxcXCIsM11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInJhZGlvXCIsXCJjaGVja2VkXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIzPT1fMFwifX1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOltcIk1VTFRJIENJVFlcIl19XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcInNlYXJjaC5kb21lc3RpY1wifV19XX19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvZm9ybS5odG1sXG4gKiogbW9kdWxlIGlkID0gMjE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyXHJcbiAgICBMQVJHRSA9ICdsYXJnZScsXHJcbiAgICBESVNBQkxFRCA9ICdkaXNhYmxlZCcsXHJcbiAgICBMT0FESU5HID0gJ2ljb24gbG9hZGluZycsXHJcbiAgICBERUNPUkFURUQgPSAnZGVjb3JhdGVkJyxcclxuICAgIEVSUk9SID0gJ2Vycm9yJyxcclxuICAgIElOID0gJ2luJ1xyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vc3Bpbm5lci5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2xhc3NlczogZnVuY3Rpb24oc3RhdGUsIGxhcmdlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGRhdGEuc3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUuZGlzYWJsZWQgfHwgZGF0YS5zdGF0ZS5zdWJtaXR0aW5nKSBjbGFzc2VzLnB1c2goRElTQUJMRUQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmxvYWRpbmcpIGNsYXNzZXMucHVzaChMT0FESU5HKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5lcnJvcikgY2xhc3Nlcy5wdXNoKEVSUk9SKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubGFyZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goREVDT1JBVEVEKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goTEFSR0UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSB8fCBkYXRhLmZvY3VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChJTik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24oKSB7ICBpZiAodGhpcy5nZXQoJ2Vycm9yJykpIHRoaXMuc2V0KCdlcnJvcicsIGZhbHNlKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcblxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSlcclxuICAgICAgICAgICAgLm9uKCdmb2N1cy5hcGknLCBmdW5jdGlvbigpIHsgdmlldy5zZXQoJ2ZvY3VzJywgdHJ1ZSk7IH0pXHJcbiAgICAgICAgICAgIC5vbignYmx1ci5hcGknLCBmdW5jdGlvbigpIHsgdmlldy5zZXQoJ2ZvY3VzJywgZmFsc2UpOyB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgb250ZWFyZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLm9mZignLmFwaScpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgaW5jOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdiA9IF8ucGFyc2VJbnQodGhpcy5nZXQoJ3ZhbHVlJykpICsgMTtcclxuXHJcbiAgICAgICAgaWYgKHYgPD0gdGhpcy5nZXQoJ21heCcpKVxyXG4gICAgICAgICAgICB0aGlzLnNldCgndmFsdWUnLCB2KTtcclxuICAgIH0sXHJcblxyXG4gICAgZGVjOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdiA9IF8ucGFyc2VJbnQodGhpcy5nZXQoJ3ZhbHVlJykpIC0gMTtcclxuXHJcbiAgICAgICAgaWYgKHYgPj0gdGhpcy5nZXQoJ21pbicpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9zcGlubmVyLmpzXG4gKiogbW9kdWxlIGlkID0gMjE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDMgNiA3XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBzZWxlY3Rpb24gaW5wdXQgc3Bpbm5lciBkcm9wZG93biBpbiBcIix7XCJ0XCI6MixcInJcIjpcImNsYXNzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImVycm9yXCJdLFwiblwiOjUwLFwiclwiOlwiZXJyb3JcIn0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImNsYXNzZXNcIixcInN0YXRlXCIsXCJsYXJnZVwiLFwidmFsdWVcIl0sXCJzXCI6XCJfMChfMSxfMixfMylcIn19XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJoaWRkZW5cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHBsYWNlaG9sZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBsYWNlaG9sZGVyXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwibGFyZ2VcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGV4dFwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNwaW5uZXIgYnV0dG9uIGluY1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImluY1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiK1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc3Bpbm5lciBidXR0b24gZGVjXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiZGVjXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCItXCJdfV19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vc3Bpbm5lci5odG1sXG4gKiogbW9kdWxlIGlkID0gMjE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDMgNiA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIFNlbGVjdCA9IHJlcXVpcmUoJ2NvcmUvZm9ybS9zZWxlY3QnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3QuZXh0ZW5kKHtcclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFqYXgsIHRpbWVvdXQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldCgnZG9tZXN0aWMnKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnb3B0aW9ucycsIHRoaXMuZ2V0KCdtZXRhLnNlbGVjdC5kb21lc3RpYycpKCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldCgndmFsdWUnKSkge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2ZsaWdodHMvYWlycG9ydC8nICsgdGhpcy5nZXQoJ3ZhbHVlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdvcHRpb25zJywgW2RhdGFdKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkuc2VsZWN0aW9uJykpLmRyb3Bkb3duKCdzZXQgdmFsdWUnLCBkYXRhLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkuc2VsZWN0aW9uJykpLmRyb3Bkb3duKCdzZXQgdGV4dCcsIGRhdGEudGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGFqYXggPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhamF4KSB7IGFqYXguYWJvcnQoKTsgfVxyXG5cclxuICAgICAgICAgICAgICAgIGFqYXggPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9iMmMvZmxpZ2h0cy9haXJwb3J0LycgKyB0aGlzLmdldCgndmFsdWUnKSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ29wdGlvbnMnLCBbZGF0YV0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5zZWxlY3Rpb24nKSkuZHJvcGRvd24oJ3NldCB2YWx1ZScsIGRhdGEuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5zZWxlY3Rpb24nKSkuZHJvcGRvd24oJ3NldCB0ZXh0JywgZGF0YS50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoJ3NlYXJjaGZvcicsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWpheC5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhamF4ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL3NlYXJjaEFpcnBvcnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeyB0ZXJtOiB2YWx1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnb3B0aW9ucycsIF8ubWFwKGRhdGEsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IGkuaWQsIHRleHQ6IGkubGFiZWwgfTsgfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5zZWxlY3Rpb24nKSkuZHJvcGRvd24oJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWpheC5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ29wdGlvbnMnLCBbXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHsgaW5pdDogZmFsc2UgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYWlycG9ydC5qc1xuICoqIG1vZHVsZSBpZCA9IDIxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHBhZ2UgPSByZXF1aXJlKCdwYWdlLmpzJyk7XHJcblxyXG52YXIgUGFnZSA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvcGFnZScpLFxyXG4gICAgU2VhcmNoID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9zZWFyY2gnKSxcclxuICAgIEZsaWdodCA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQnKSxcclxuICAgIEZpbHRlciA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvZmlsdGVyJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbnZhciBST1VURVMgPSByZXF1aXJlKCdhcHAvcm91dGVzJykuZmxpZ2h0cztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFnZS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9wYWdlcy9mbGlnaHRzL3Jlc3VsdHMuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICAncmVzdWx0cyc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cycpLFxyXG5cclxuICAgICAgICAnbW9kaWZ5LXNpbmdsZSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L3NpbmdsZScpLFxyXG4gICAgICAgICdtb2RpZnktbXVsdGljaXR5JzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvbXVsdGljaXR5JyksXHJcblxyXG4gICAgICAgICdmaWx0ZXInOiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL2ZpbHRlcicpLFxyXG4gICAgICAgICdzZWFyY2gtZm9ybSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvZm9ybScpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1pbnBhbmVsOiB0cnVlLFxyXG5cclxuICAgICAgICAgICAgZm9yY2U6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgcGVuZGluZzogMSxcclxuICAgICAgICAgICAgc2VhcmNoOiBudWxsLFxyXG4gICAgICAgICAgICBmbGlnaHRzOiBbXSxcclxuXHJcbiAgICAgICAgICAgIG1ldGE6IE1ldGEub2JqZWN0XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnBlbmRpbmcgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCdwZW5kaW5nJykgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIE1hdGgubWluKDEwMCwgdmlldy5nZXQoJ3BlbmRpbmcnKSArIDAuMjUpKTtcclxuICAgICAgICB9LCA0MSk7XHJcblxyXG4gICAgICAgIFNlYXJjaC5sb2FkKHRoaXMuZ2V0KCd1cmwnKSwgdGhpcy5nZXQoJ2ZvcmNlJyksIHRoaXMuZ2V0KCdjcycpKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihzZWFyY2gpIHsgdmlldy5zZXQoJ3NlYXJjaCcsIHNlYXJjaCk7IHZpZXcuZmV0Y2hGbGlnaHRzKHNlYXJjaCk7IH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkgeyBwYWdlKFJPVVRFUy5zZWFyY2gpIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApO1xyXG5cclxuICAgICAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgICAgIHZhciBvcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICQoJyNtX21lbnUnKS5zaWRlYmFyKHsgb25IaWRkZW46IGZ1bmN0aW9uKCkgeyAkKCcjbV9idG4nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTsgIH0sIG9uU2hvdzogZnVuY3Rpb24oKSB7ICQoJyNtX2J0bicpLmFkZENsYXNzKCdkaXNhYmxlZCcpOyAgfX0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI2ZpbHRlcicsIHRoaXMuZWwpLm9uKCdjbGljay5sYXlvdXQnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcignc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBmZXRjaEZsaWdodHM6IGZ1bmN0aW9uKHNlYXJjaCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgRmxpZ2h0LmZldGNoKHNlYXJjaClcclxuICAgICAgICAgICAgLnByb2dyZXNzKGZ1bmN0aW9uKHJlcykgeyB2aWV3LnNldCgnZmxpZ2h0cycsIHJlcy5mbGlnaHRzKTsgfSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7IGNsZWFySW50ZXJ2YWwodmlldy5wZW5kaW5nKTsgdmlldy5maW5hbGl6ZShzZWFyY2gsIHJlcyk7IH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaW5hbGl6ZTogZnVuY3Rpb24oc2VhcmNoLCByZXMpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGZpbHRlciA9IEZpbHRlci5mYWN0b3J5KHNlYXJjaCwgcmVzLmZsaWdodHMpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZXQoeyBwZW5kaW5nOiBmYWxzZSwgZmxpZ2h0czogcmVzLmZsaWdodHMsIGZpbHRlcjogZmlsdGVyIH0pO1xyXG5cclxuICAgICAgICBpZiAoU2VhcmNoLlJPVU5EVFJJUCA9PSBzZWFyY2guZ2V0KCd0cmlwVHlwZScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdwcmljZXMnLCByZXMucHJpY2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZpbHRlci5vYnNlcnZlKCdmbGlnaHRzJywgZnVuY3Rpb24oZmxpZ2h0cykgeyB2aWV3LnNldCgnZmxpZ2h0cycsIGZsaWdodHMpOyB9LCB7aW5pdDogZmFsc2V9KTtcclxuXHJcblxyXG4gICAgICAgIGlmICghTU9CSUxFICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWdtZW50cyA9IHJlcy5mbGlnaHRzWzBdWzBdLnNlZ21lbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSBzZWdtZW50c1swXVswXS5mcm9tLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvID0gc2VnbWVudHNbMF1bc2VnbWVudHNbMF0ubGVuZ3RoLTFdLnRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb25lID0gc2VhcmNoLnRvSlNPTigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZmZmYnLCBzZWdtZW50cywgZnJvbSwgdG8pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmcm9tICYmIHRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlY2VudCA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZWFyY2hlcycpIHx8IG51bGwpIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY2VudC51bnNoaWZ0KHtmcm9tOiBmcm9tLCB0bzogdG8sIHNlYXJjaDogY2xvbmV9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzZWFyY2hlcycsIEpTT04uc3RyaW5naWZ5KHJlY2VudC5zbGljZSgwLDUpKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBhIGJpZyBkZWFsXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtb2RpZnlTZWFyY2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgcGFnZShST1VURVMuc2VhcmNoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnbW9kaWZ5JywgbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdtb2RpZnknLCBTZWFyY2gucGFyc2UodGhpcy5nZXQoJ3NlYXJjaCcpLnRvSlNPTigpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9wYWdlcy9mbGlnaHRzL3Jlc3VsdHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJyksXHJcbiAgICBTZWFyY2ggPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L3NlYXJjaCcpXHJcbiAgICA7XHJcblxyXG52YXIgdDJtID0gZnVuY3Rpb24odGltZSkge1xyXG4gICAgdmFyIGkgPSB0aW1lLnNwbGl0KCc6Jyk7XHJcbiAgICByZXR1cm4gXy5wYXJzZUludChpWzBdKSo2MCArIF8ucGFyc2VJbnQoaVsxXSk7XHJcbn07XHJcblxyXG52YXIgZmlsdGVyID0gZnVuY3Rpb24oZmxpZ2h0cywgZmlsdGVyZWQsIGJhY2t3YXJkKSB7XHJcbiAgICBiYWNrd2FyZCA9IGJhY2t3YXJkIHx8IGZhbHNlO1xyXG5cclxuICAgIHZhciBmID0gXy5jbG9uZURlZXAoZmlsdGVyZWQpLFxyXG4gICAgICAgIGxheW92ZXIgPSBmLmxheW92ZXIgPyBbdDJtKGYubGF5b3ZlclswXSksIHQybShmLmxheW92ZXJbMV0pXSA6IG51bGwsXHJcbiAgICAgICAgYXJyaXZlLCBkZXBhcnR1cmVcclxuICAgICAgICA7XHJcblxyXG4gICAgaWYgKCFiYWNrd2FyZCkge1xyXG4gICAgICAgIGFycml2ZSA9IGYuYXJyaXZhbCA/IFt0Mm0oZi5hcnJpdmFsWzBdKSwgdDJtKGYuYXJyaXZhbFsxXSldIDogbnVsbDtcclxuICAgICAgICBkZXBhcnR1cmUgPSBmLmRlcGFydHVyZSA/IFt0Mm0oZi5kZXBhcnR1cmVbMF0pLCB0Mm0oZi5kZXBhcnR1cmVbMV0pXSA6IG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFycml2ZSA9IGYuYXJyaXZhbDIgPyBbdDJtKGYuYXJyaXZhbDJbMF0pLCB0Mm0oZi5hcnJpdmFsMlsxXSldIDogbnVsbDtcclxuICAgICAgICBkZXBhcnR1cmUgPSBmLmRlcGFydHVyZTIgPyBbdDJtKGYuZGVwYXJ0dXJlMlswXSksIHQybShmLmRlcGFydHVyZTJbMV0pXSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIF8uZmlsdGVyKGZsaWdodHMuc2xpY2UoKSwgZnVuY3Rpb24oaSkge1xyXG4gICAgICAgIHZhciBvayA9IHRydWUsXHJcbiAgICAgICAgICAgIHMgPSBpLmdldCgnc2VnbWVudHMuMCcpO1xyXG5cclxuICAgICAgICBpZiAoZi5wcmljZXMgJiYgIV8uaW5SYW5nZShpLmdldCgncHJpY2UnKSwgZi5wcmljZXNbMF0tMC4wMDEsIGYucHJpY2VzWzFdKzAuMDAxKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZi5jYXJyaWVycyAmJiAtMSA9PSBfLmluZGV4T2YoZi5jYXJyaWVycywgc1swXS5jYXJyaWVyLmNvZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmLnN0b3BzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsID0gaS5nZXQoJ3NlZ21lbnRzJykubGVuZ3RoOyBqIDwgbDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoLTEgPT0gXy5pbmRleE9mKGYuc3RvcHMsIGkuZ2V0KCdzZWdtZW50cy4nICsgaikubGVuZ3RoLTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGVwYXJ0dXJlICYmICFfLmluUmFuZ2UodDJtKHNbMF0uZGVwYXJ0LmZvcm1hdCgnSEg6bW0nKSksIGRlcGFydHVyZVswXS0wLjAwMSwgZGVwYXJ0dXJlWzFdKzAuMDAxKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYXJyaXZlICYmICFfLmluUmFuZ2UodDJtKHNbcy5sZW5ndGgtMV0uYXJyaXZlLmZvcm1hdCgnSEg6bW0nKSksIGFycml2ZVswXS0wLjAwMSwgYXJyaXZlWzFdKzAuMDAxKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGF5b3Zlcikge1xyXG4gICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgIF8uZWFjaChpLmdldCgnc2VnbWVudHMnKSwgZnVuY3Rpb24oc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChzZWdtZW50cywgZnVuY3Rpb24oc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudC5sYXlvdmVyICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFfLmluUmFuZ2Uoc2VnbWVudC5sYXlvdmVyLmFzTWludXRlcygpLCBsYXlvdmVyWzBdLTAuMDAxLCBsYXlvdmVyWzFdKzAuMDAxKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmLnJlZnVuZGFibGUgJiYgMiAhPSBfLnBhcnNlSW50KGkuZ2V0KCdyZWZ1bmRhYmxlJykpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG52YXIgRmlsdGVyID0gU3RvcmUuZXh0ZW5kKHtcclxuICAgIHRpbWVvdXQ6IG51bGwsXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy5vYnNlcnZlKCdmaWx0ZXJlZCcsIGZ1bmN0aW9uKGZpbHRlcmVkKSB7IHRoaXMuZmlsdGVyKCk7IH0sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2ZpbHRlcmluZyBuYXgnKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGltZW91dCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRoaXMuZG9GaWx0ZXIoKTsgfS5iaW5kKHRoaXMpLCBGaWx0ZXIuVElNRU9VVClcclxuICAgIH0sXHJcblxyXG4gICAgZG9GaWx0ZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBmaWx0ZXJlZCA9IHRoaXMuZ2V0KCdmaWx0ZXJlZCcpO1xyXG5cclxuICAgICAgICBpZiAoU2VhcmNoLlJPVU5EVFJJUCA9PSB0aGlzLmdldCgndHJpcFR5cGUnKSAmJiB0aGlzLmdldCgnZG9tZXN0aWMnKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIFtmaWx0ZXIodGhpcy5nZXQoJ29yaWdpbmFsLjAnKSwgZmlsdGVyZWQpLCBmaWx0ZXIodGhpcy5nZXQoJ29yaWdpbmFsLjEnKSwgZmlsdGVyZWQsIHRydWUpXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIF8ubWFwKHRoaXMuZ2V0KCdvcmlnaW5hbCcpLCBmdW5jdGlvbihmbGlnaHRzKSB7IHJldHVybiBmaWx0ZXIoZmxpZ2h0cywgZmlsdGVyZWQpOyB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuRmlsdGVyLlRJTUVPVVQgPSAzMDA7XHJcblxyXG5GaWx0ZXIuZmFjdG9yeSA9IGZ1bmN0aW9uKHNlYXJjaCwgcmVzdWx0cykge1xyXG4gICAgdmFyIGZpbHRlciA9IG5ldyBGaWx0ZXIoKSxcclxuICAgICAgICBwcmljZXMgPSBbXSxcclxuICAgICAgICBjYXJyaWVycyA9IFtdLFxyXG4gICAgICAgIHN0b3BzID0gMDtcclxuXHJcbiAgICBfLmVhY2gocmVzdWx0cywgZnVuY3Rpb24oZmxpZ2h0cykge1xyXG4gICAgICAgIF8uZWFjaChmbGlnaHRzLCBmdW5jdGlvbihmbGlnaHQpIHtcclxuICAgICAgICAgICAgcHJpY2VzW3ByaWNlcy5sZW5ndGhdID0gZmxpZ2h0LmdldCgncHJpY2UnKTtcclxuICAgICAgICAgICAgY2FycmllcnNbY2FycmllcnMubGVuZ3RoXSA9IGZsaWdodC5nZXQoJ3NlZ21lbnRzLjAuMC5jYXJyaWVyJyk7XHJcblxyXG4gICAgICAgICAgICBfLmVhY2goZmxpZ2h0LmdldCgnc2VnbWVudHMnKSwgZnVuY3Rpb24oc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIHN0b3BzID0gTWF0aC5tYXgoc3RvcHMsIHNlZ21lbnRzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY2FycmllcnMgPSBfLnVuaXF1ZShjYXJyaWVycywgJ2NvZGUnKTtcclxuXHJcbiAgICBmaWx0ZXIuc2V0KHtcclxuICAgICAgICBkb21lc3RpYzogc2VhcmNoLmdldCgnZG9tZXN0aWMnKSxcclxuICAgICAgICB0cmlwVHlwZTogc2VhcmNoLmdldCgndHJpcFR5cGUnKSxcclxuICAgICAgICBzdG9wczogXy5yYW5nZSgwLCBzdG9wcysxKSxcclxuICAgICAgICBwcmljZXM6IFtNYXRoLm1pbi5hcHBseShudWxsLCBwcmljZXMpLCBNYXRoLm1heC5hcHBseShudWxsLCBwcmljZXMpXSxcclxuICAgICAgICBjYXJyaWVyczogY2FycmllcnMsXHJcbiAgICAgICAgZmlsdGVyZWQ6IHsgY2FycmllcnM6IF8ubWFwKGNhcnJpZXJzLCBmdW5jdGlvbihpKSB7IHJldHVybiBpLmNvZGU7IH0pLCBzdG9wczogXy5yYW5nZSgwLCBzdG9wcysxKSB9LFxyXG4gICAgICAgIGZsaWdodHM6IHJlc3VsdHMsXHJcbiAgICAgICAgb3JpZ2luYWw6IHJlc3VsdHNcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBmaWx0ZXI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlcjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL2ZsaWdodC9maWx0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWFyY2gtZm9ybVwiLFwiYVwiOntcImNsYXNzXCI6XCJiYXNpYyBzZWdtZW50XCIsXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJtb2RpZnlcIn1dLFwibW9kaWZ5XCI6W3tcInRcIjoyLFwiclwiOlwibW9kaWZ5XCJ9XX19XSxcIm5cIjo1MCxcInJcIjpcIm1vZGlmeVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZWdtZW50IGZsaWdodHMtcmVzdWx0c1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxvYWRpbmdcIixcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbmRpY2F0aW5nIHByb2dyZXNzIGFjdGl2ZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYmFyXCIsXCJzdHlsZVwiOltcImJhY2tncm91bmQtY29sb3I6ICNmZWUyNTI7IC13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbjogMzAwbXM7IHRyYW5zaXRpb24tZHVyYXRpb246IDMwMG1zOyB3aWR0aDogXCIse1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9LFwiJTtcIl19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJTZWFyY2hpbmcgZm9yIGZsaWdodHNcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn1dLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibW9kaWZ5LW11bHRpY2l0eVwiLFwiYVwiOntcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0c1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjM9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJtb2RpZnktc2luZ2xlXCIsXCJhXCI6e1wibW9kaWZ5XCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMz09XzBcIn19XSxcInJcIjpcInBlbmRpbmdcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicmVzdWx0c1wiLFwiYVwiOntcInBlbmRpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0c1wifV0sXCJwcmljZXNcIjpbe1widFwiOjIsXCJyXCI6XCJwcmljZXNcIn1dLFwiZmlsdGVyXCI6W3tcInRcIjoyLFwiclwiOlwiZmlsdGVyXCJ9XX19XSxcIm5cIjo1MCxcInJcIjpcImZsaWdodHNcIn1dfSxcIiBcIl0sXCJwXCI6e1wicGFuZWxcIjpbe1widFwiOjgsXCJyXCI6XCJiYXNlLXBhbmVsXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZmlsdGVyXCIsXCJhXCI6e1wic2VhcmNoXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoXCJ9XSxcImZpbHRlclwiOlt7XCJ0XCI6MixcInJcIjpcImZpbHRlclwifV0sXCJwZW5kaW5nXCI6W3tcInRcIjoyLFwiclwiOlwicGVuZGluZ1wifV19fV19fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvcGFnZXMvZmxpZ2h0cy9yZXN1bHRzLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICdyZXN1bHRzLW9uZXdheSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9vbmV3YXknKSxcclxuICAgICAgICAncmVzdWx0cy1yb3VuZHRyaXAnOiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvcm91bmR0cmlwJyksXHJcbiAgICAgICAgJ3Jlc3VsdHMtbXVsdGljaXR5JzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eScpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbC5yZXN1bHRzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKCAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpKjAuOCAgKSApIHtcclxuICAgICAgICAgICAgICAgIF8uZWFjaCh2aWV3LmZpbmRBbGxDb21wb25lbnRzKCdmbGlnaHRzJyksIGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgICAgIGZsaWdodHMubmV4dHBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhcmRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQod2luZG93KS5vZmYoJ3Njcm9sbC5yZXN1bHRzJyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJyZXN1bHRzLW9uZXdheVwiLFwiYVwiOntcInBlbmRpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0c1wifV19fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjE9PV8wXCJ9fSx7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicmVzdWx0cy1yb3VuZHRyaXBcIixcImFcIjp7XCJwZW5kaW5nXCI6W3tcInRcIjoyLFwiclwiOlwicGVuZGluZ1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwiZmxpZ2h0c1wiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodHNcIn1dLFwicHJpY2VzXCI6W3tcInRcIjoyLFwiclwiOlwicHJpY2VzXCJ9XSxcImZpbHRlclwiOlt7XCJ0XCI6MixcInJcIjpcImZpbHRlclwifV19fV0sXCJuXCI6NTAsXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicmVzdWx0cy1vbmV3YXlcIixcImFcIjp7XCJwZW5kaW5nXCI6W3tcInRcIjoyLFwiclwiOlwicGVuZGluZ1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwiZmxpZ2h0c1wiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodHNcIn1dfX1dLFwiclwiOlwic2VhcmNoLmRvbWVzdGljXCJ9XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMj09XzBcIn19LHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInJlc3VsdHMtbXVsdGljaXR5XCIsXCJhXCI6e1wicGVuZGluZ1wiOlt7XCJ0XCI6MixcInJcIjpcInBlbmRpbmdcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dLFwic2VhcmNoXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoXCJ9XSxcImZsaWdodHNcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHRzXCJ9XX19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMz09XzBcIn19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlLmpzJylcclxuICAgIDtcclxuXHJcbnZhciBCb29raW5nID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9ib29raW5nJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbnZhciBST1VURVMgPSByZXF1aXJlKCdhcHAvcm91dGVzJykuZmxpZ2h0cztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvb25ld2F5Lmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgZmxpZ2h0czogcmVxdWlyZSgnLi9mbGlnaHRzJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtZXRhOiBNZXRhLm9iamVjdCxcclxuICAgICAgICAgICAgYWN0aXZlOiAwLFxyXG4gICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24oZmxpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgQm9va2luZy5jcmVhdGUoW2ZsaWdodC5nZXQoJ3N5c3RlbScpXSwgeyBjczogdmlldy5nZXQoJ3NlYXJjaC5jcycpLCAgdXJsOiB2aWV3LmdldCgnc2VhcmNoLnVybCcpLGN1cjp2aWV3LmdldCgnbWV0YS5kaXNwbGF5X2N1cnJlbmN5JykgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihib29raW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UoUk9VVEVTLmJvb2tpbmcoYm9va2luZy5nZXQoJ2lkJykpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5kcm9wZG93bicsIHRoaXMuZWwpLmRyb3Bkb3duKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1vZGlmeVNlYXJjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yb290Lm1vZGlmeVNlYXJjaCgpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL29uZXdheS5qc1xuICoqIG1vZHVsZSBpZCA9IDIyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZmxpZ2h0c1wiLFwiYVwiOntcInNlbGVjdEZuXCI6W3tcInRcIjoyLFwiclwiOlwib25TZWxlY3RcIn1dLFwiZmxpZ2h0c1wiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodHMuMFwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwicGVuZGluZ1wiOlt7XCJ0XCI6MixcInJcIjpcInBlbmRpbmdcIn1dfX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvb25ld2F5Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJyksXHJcbiAgICBST1VURVMgPSByZXF1aXJlKCdhcHAvcm91dGVzJylcclxuICAgIDtcclxuXHJcbnZhciB0Mm0gPSBmdW5jdGlvbih0aW1lKSB7XHJcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcclxuXHJcbiAgICByZXR1cm4gXy5wYXJzZUludChpWzBdKSo2MCArIF8ucGFyc2VJbnQoaVsxXSk7XHJcbn07XHJcblxyXG52YXIgc29ydCA9IGZ1bmN0aW9uKGZsaWdodHMsIHNvcnRPbikge1xyXG4gICAgdmFyIG9uID0gc29ydE9uWzBdLFxyXG4gICAgICAgIGFzYyA9IHNvcnRPblsxXSxcclxuICAgICAgICBkYXRhID0gZmxpZ2h0cy5zbGljZSgpLFxyXG4gICAgICAgIHRpbWUgPSBfLm5vdygpO1xyXG5cclxuICAgIGRhdGEgPSBfLnNvcnRCeShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGkuZ2V0KCdwcmljZScpLFxyXG4gICAgICAgICAgICAgICAgcyA9IGkuZ2V0KCdzZWdtZW50cy4wJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJ2FpcmxpbmUnID09IG9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IF8udHJpbShzWzBdLmNhcnJpZXIubmFtZSkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCdkZXBhcnQnID09IG9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNbMF0uZGVwYXJ0LnVuaXgoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCdhcnJpdmUnID09IG9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNbcy5sZW5ndGggLSAxXS5hcnJpdmUudW5peCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoLTEgPT0gYXNjKSB7XHJcbiAgICAgICAgZGF0YS5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG59O1xyXG5cclxudmFyIGdyb3VwID0gZnVuY3Rpb24oZmxpZ2h0cywgc29ydG9uKSB7XHJcbiAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgcmV0dXJuIGZsaWdodHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIF8udmFsdWVzKF8uZ3JvdXBCeShmbGlnaHRzLCBmdW5jdGlvbihpKSB7IHJldHVybiAnbmF4XycgKyBpLmdldChzb3J0b25bMF0pICArICdfJyArIGkuZ2V0KCdwcmljZScpOyB9KSk7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHRzLmh0bWwnKSxcclxuICAgIHBhZ2U6IDEsXHJcbiAgICBsb2FkaW5nOiBmYWxzZSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgZmxpZ2h0OiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0JylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZpcnN0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiAxLFxyXG5cclxuICAgICAgICAgICAgZmxpZ2h0czogW10sXHJcbiAgICAgICAgICAgIHJlbmRlcmVkOiBbXSxcclxuICAgICAgICAgICAgc29ydGVkOiBbXSxcclxuICAgICAgICAgICAgb3Blbjoge30sXHJcblxyXG4gICAgICAgICAgICBzb3J0T246IFsncHJpY2UnLCAxXSxcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3RcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnc29ydE9uJywgZnVuY3Rpb24oc29ydE9uKSB7IHZpZXcuc29ydEZsaWdodHMoKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCdmbGlnaHRzJywgZnVuY3Rpb24oc29ydE9uKSB7IHZpZXcuc29ydEZsaWdodHMoKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgIHRoaXMuc29ydEZsaWdodHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQub24oJ25leHRwYWdlJywgZnVuY3Rpb24oKSB7IHRoaXMubmV4dHBhZ2UoKTsgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG5leHRwYWdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKCAhIHZpZXcubG9hZGluZyApe1xyXG4gICAgICAgICAgICB2aWV3LmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZCA9IHZpZXcuZ2V0KCdzb3J0ZWQnKS5zbGljZSh2aWV3LnBhZ2UqMTAsICh2aWV3LnBhZ2UrMSkqMTApO1xyXG4gICAgICAgICAgICBpZiAoYWRkICYmIGFkZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGFkZC51bnNoaWZ0KCdyZW5kZXJlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucHVzaC5hcHBseSh2aWV3LCBhZGQpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5wYWdlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc29ydE9uOiBmdW5jdGlvbihvbikge1xyXG4gICAgICAgIGlmIChvbiA9PSB0aGlzLmdldCgnc29ydE9uLjAnKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnc29ydE9uLjEnLCAtMSp0aGlzLmdldCgnc29ydE9uLjEnKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3NvcnRPbicsIFtvbiwgMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc29ydEZsaWdodHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBlbmRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2V0KCdyZW5kZXJlZCcsIG51bGwpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHZpZXcuZ2V0KCdzZWFyY2guZG9tZXN0aWMnKSkge1xyXG4gICAgICAgICAgICB2YXIgZmxpZ2h0cyA9IHNvcnQodmlldy5nZXQoJ2ZsaWdodHMnKSwgdmlldy5nZXQoJ3NvcnRPbicpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZmxpZ2h0cyA9IGdyb3VwKHNvcnQodmlldy5nZXQoJ2ZsaWdodHMnKSwgdmlldy5nZXQoJ3NvcnRPbicpKSwgdmlldy5nZXQoJ3NvcnRPbicpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2aWV3LnNldCgnc29ydGVkJywgZmxpZ2h0cyk7XHJcblxyXG4gICAgICAgIHZpZXcuc2V0KCdyZW5kZXJlZCcsIGZsaWdodHMuc2xpY2UoMCwgMTApKTtcclxuICAgICAgICB2aWV3LnBhZ2UgPSAxO1xyXG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcGFnZSgpXHJcbiAgICB9XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL2ZsaWdodHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBzZWdtZW50IGJhc2ljIGZsaWdodHMgXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJzdW1tYXJ5XCJdLFwiblwiOjUwLFwiclwiOlwic3VtbWFyeVwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJzbWFsbFwiXSxcIm5cIjo1MCxcInJcIjpcInNtYWxsXCJ9XSxcInN0eWxlXCI6XCJ3aWR0aDogMTAwJTtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImNhcHRpb25cIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInB1bGwgbGVmdFwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJpdGluZXJhcnlcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwdWxsIHJpZ2h0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSkuZGVwYXJ0LmZvcm1hdChcXFwiZGRkIEQsIE1NTVxcXCIpXCJ9fV19XSxcInJcIjpcImZsaWdodHMuMFwifV19XSxcIm5cIjo1MCxcInJcIjpcImNhcHRpb25cIixcInNcIjp0cnVlfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRoZWFkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJsaW5lXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic29ydE9uXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJhaXJsaW5lXFxcIl1cIn19fSxcImZcIjpbXCJBaXJsaW5lIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOltcImNhcmV0IFwiLHtcInRcIjo0LFwiZlwiOltcImRvd25cIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNvcnRPbi4xXCJdLFwic1wiOlwiMT09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcInVwXCJdLFwieFwiOntcInJcIjpbXCJzb3J0T24uMVwiXSxcInNcIjpcIjE9PV8wXCJ9fSxcIiBpY29uXCJdfX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzb3J0T24uMFwiXSxcInNcIjpcIlxcXCJhaXJsaW5lXFxcIj09XzBcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXBhcnRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzb3J0T25cIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImRlcGFydFxcXCJdXCJ9fX0sXCJmXCI6W1wiRGVwYXJ0IFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOltcImNhcmV0IFwiLHtcInRcIjo0LFwiZlwiOltcImRvd25cIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNvcnRPbi4xXCJdLFwic1wiOlwiMT09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcInVwXCJdLFwieFwiOntcInJcIjpbXCJzb3J0T24uMVwiXSxcInNcIjpcIjE9PV8wXCJ9fSxcIiBpY29uXCJdfX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzb3J0T24uMFwiXSxcInNcIjpcIlxcXCJkZXBhcnRcXFwiPT1fMFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFycm93XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFycml2ZVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNvcnRPblwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiYXJyaXZlXFxcIl1cIn19fSxcImZcIjpbXCJBcnJpdmUgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6W1wiY2FyZXQgXCIse1widFwiOjQsXCJmXCI6W1wiZG93blwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic29ydE9uLjFcIl0sXCJzXCI6XCIxPT1fMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widXBcIl0sXCJ4XCI6e1wiclwiOltcInNvcnRPbi4xXCJdLFwic1wiOlwiMT09XzBcIn19LFwiIGljb25cIl19fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNvcnRPbi4wXCJdLFwic1wiOlwiXFxcImFycml2ZVxcXCI9PV8wXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwicHJpY2VcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzb3J0T25cIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInByaWNlXFxcIl1cIn19fSxcImZcIjpbXCJQcmljZSBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJjYXJldCBcIix7XCJ0XCI6NCxcImZcIjpbXCJkb3duXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzb3J0T24uMVwiXSxcInNcIjpcIjE9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJ1cFwiXSxcInhcIjp7XCJyXCI6W1wic29ydE9uLjFcIl0sXCJzXCI6XCIxPT1fMFwifX0sXCIgaWNvblwiXX19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic29ydE9uLjBcIl0sXCJzXCI6XCJcXFwicHJpY2VcXFwiPT1fMFwifX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiYVwiOntcImNsYXNzXCI6XCJzcGFjZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjb2xzcGFuXCI6XCI1XCJ9LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNwYWNlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNvbHNwYW5cIjpcIjVcIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCJ9LFwiZlwiOltcIlNvcnJ5ISBXZSBjb3VsZCBub3QgZmluZCBhbnkgZmxpZ2h0IGZvciB0aGlzIHNlYXJjaC4gUGxlYXNlIHNlYXJjaCBBZ2Fpbi5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJiYWNrXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwidWkgYnV0dG9uIG1pZGRsZSBncmF5IGJhY2tcIn0sXCJmXCI6W1wiQmFja1wiXX1dfV19XSxcIm5cIjo1MSxcInhcIjp7XCJyXCI6W1wicGVuZGluZ1wiLFwiZmxpZ2h0cy5sZW5ndGhcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZsaWdodFwifV0sXCJuXCI6NTIsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MCxcInJ4XCI6e1wiclwiOlwib3BlblwiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJpXCJ9XX19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmbGlnaHRcIn1dLFwiclwiOlwiLi8wXCJ9XSxcInJ4XCI6e1wiclwiOlwib3BlblwiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJpXCJ9XX19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJ1ZGRpZXNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjb2xzcGFuXCI6XCI1XCIsXCJzdHlsZVwiOlwidGV4dC1hbGlnbjogY2VudGVyOyBwYWRkaW5nOiA0cHg7IGJvcmRlcjogbm9uZTtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyB0aW55IGNpcmN1bGFyIGJ1dHRvblwiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidG9nZ2xlXCIsXCJhXCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCJbXFxcIm9wZW4uXFxcIitfMCwxXVwifX19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCLigJNcIl0sXCJuXCI6NTAsXCJyeFwiOntcInJcIjpcIm9wZW5cIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifV19fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCIrXCJdLFwicnhcIjp7XCJyXCI6XCJvcGVuXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImlcIn1dfX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcIi4vbGVuZ3RoXCJdLFwic1wiOlwiXzAtMVwifX0sXCIgbW9yZSBvcHRpb25zIGF0IHNhbWUgcHJpY2VcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNwYWNlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNvbHNwYW5cIjpcIjVcIn0sXCJmXCI6W119XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCIuL2xlbmd0aFwiXSxcInNcIjpcIl8wPjFcIn19XSxcIm5cIjo1MCxcInJcIjpcIi4vbGVuZ3RoXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZsaWdodFwifV0sXCJyXCI6XCIuL2xlbmd0aFwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJyZW5kZXJlZFwifV19LFwiIFwiXSxcInBcIjp7XCJmbGlnaHRcIjpbe1widFwiOjcsXCJlXCI6XCJmbGlnaHRcIixcImFcIjp7XCJzZWxlY3RGblwiOlt7XCJ0XCI6MixcInJcIjpcInNlbGVjdEZuXCJ9XSxcInNtYWxsXCI6W3tcInRcIjoyLFwiclwiOlwic21hbGxcIn1dLFwic3VtbWFyeVwiOlt7XCJ0XCI6MixcInJcIjpcInN1bW1hcnlcIn1dLFwiZmxpZ2h0XCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic2VsZWN0ZWRcIjpbe1widFwiOjIsXCJyXCI6XCJzZWxlY3RlZFwifV0sXCJvbndhcmRcIjpbe1widFwiOjIsXCJyXCI6XCJvbndhcmRcIn1dLFwiYmFja3dhcmRcIjpbe1widFwiOjIsXCJyXCI6XCJiYWNrd2FyZFwifV19fV19fTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0cy5odG1sXG4gKiogbW9kdWxlIGlkID0gMjI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBCb29raW5nID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9ib29raW5nJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcblxyXG52YXIgbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JyksXHJcbiAgICBkdXJhdGlvbiA9IHJlcXVpcmUoJ2hlbHBlcnMvZHVyYXRpb24nKSgpLFxyXG4gICAgZGlzY291bnQgPSByZXF1aXJlKCdoZWxwZXJzL2ZsaWdodHMnKS5kaXNjb3VudDtcclxuXHJcblxyXG52YXIgZGF0YSA9IHtcclxuICAgIGhhc0dyb3VwaW5nczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdmbGlnaHQuZ3JvdXBpbmdzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdmbGlnaHQuZ3JvdXBpbmdzJykubGVuZ3RoIHx8IF8ua2V5cyh0aGlzLmdldCgnZmxpZ2h0Lmdyb3VwaW5ncycpKS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGRpc2NvdW50OiBkaXNjb3VudCxcclxuXHJcbiAgICAkOiBtb25leSxcclxuICAgIGR1cmF0aW9uOiBkdXJhdGlvblxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0Lmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgZmxpZ2h0OiB0aGlzLFxyXG4gICAgICAgIGl0aW5lcmFyeTogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL2l0aW5lcmFyeScpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ21ldGEnLCBNZXRhLm9iamVjdCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCcucHJpY2UgPiAuYW1vdW50JykpXHJcbiAgICAgICAgICAgIC5wb3B1cCh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA6ICdib3R0b20gcmlnaHQnLFxyXG4gICAgICAgICAgICAgICAgcG9wdXA6ICQodGhpcy5maW5kKCcuZmFyZS5wb3B1cCcpKSxcclxuICAgICAgICAgICAgICAgIG9uOiAnaG92ZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICB0b2dnbGVEZXRhaWxzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnRvZ2dsZSgnZGV0YWlscycpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldCgnZmxpZ2h0LmlkJykgPT09IHRoaXMuZ2V0KCdzZWxlY3RlZC5pZCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzZWxlY3RlZCcsIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZm4gPSB0aGlzLmdldCgnc2VsZWN0Rm4nKTsgICAgICAgIFxyXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZm4pKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmbih0aGlzLmdldCgnZmxpZ2h0JyksIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldCgnc3VtbWFyeScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHQuanNcbiAqKiBtb2R1bGUgaWQgPSAyMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuICAgIDtcclxuXHJcbnZhciBtb25leSA9IHJlcXVpcmUoJ2hlbHBlcnMvbW9uZXknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZHVyYXRpb246IHJlcXVpcmUoJ2hlbHBlcnMvZHVyYXRpb24nKSgpLFxyXG4gICAgbW9uZXk6IG1vbmV5LFxyXG5cclxuICAgIGl0aW5lcmFyeTogZnVuY3Rpb24oZmxpZ2h0KSB7XHJcbiAgICAgICAgdmFyIHMgPSBmbGlnaHQuZ2V0KCdzZWdtZW50cy4wJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBbc1swXS5mcm9tLmFpcnBvcnRDb2RlLCBzW3MubGVuZ3RoLTFdLnRvLmFpcnBvcnRDb2RlXS5qb2luKCcmbWRhc2g7Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRpbWVzOiBmdW5jdGlvbihmbGlnaHRzKSB7XHJcbiAgICAgICAgcmV0dXJuIFtmbGlnaHRzWzBdLmRlcGFydF9hdC5mb3JtYXQoJ0QgTU1NLCBZWVlZJyksIGZsaWdodHNbZmxpZ2h0cy5sZW5ndGgtMV0uZGVwYXJ0X2F0LmZvcm1hdCgnRCBNTU0sIFlZWVknKV0uam9pbignLScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjYW5ib29rOiBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgdmFyIG9rID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFhW2ldKVxyXG4gICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gb2s7XHJcbiAgICB9LFxyXG5cclxuICAgIHByaWNlOiBmdW5jdGlvbihzZWxlY3RlZCkge1xyXG4gICAgICAgIHZhciBwcmljZSA9IDA7XHJcblxyXG4gICAgICAgIF8uZWFjaChzZWxlY3RlZCwgZnVuY3Rpb24oaSkgeyBpZiAoaSkgcHJpY2UgKz0gaS5nZXQoJ3ByaWNlJyk7IH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJpY2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGRpc2NvdW50OiBmdW5jdGlvbihzZWxlY3RlZCkge1xyXG4gICAgICAgIGlmICgyID09IHNlbGVjdGVkLmxlbmd0aCAmJiBzZWxlY3RlZFswXSAmJiBzZWxlY3RlZFsxXSkge1xyXG4gICAgICAgICAgICB2YXIgb253YXJkID0gc2VsZWN0ZWRbMF0uZ2V0KCksXHJcbiAgICAgICAgICAgICAgICBiYWNrd2FyZCA9IHNlbGVjdGVkWzFdLmdldCgpLFxyXG4gICAgICAgICAgICAgICAgZ3JvdXBpbmdzID0gXy5pbnRlcnNlY3Rpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgb253YXJkLnN5c3RlbS5nZHMgPyBvbndhcmQuZ3JvdXBpbmdzIDogXy5rZXlzKG9ud2FyZC5ncm91cGluZ3MpLFxyXG4gICAgICAgICAgICAgICAgICAgIF8ua2V5cyhiYWNrd2FyZC5ncm91cGluZ3MpXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgZGlzY291bnRcclxuICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIGlmIChncm91cGluZ3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob253YXJkLnN5c3RlbS5nZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudCA9IGJhY2t3YXJkLmdyb3VwaW5nc1tncm91cGluZ3NbMF1dLmRpc2NvdW50O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudCA9IG9ud2FyZC5wcmljZSArIGJhY2t3YXJkLnByaWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC0gb253YXJkLmdyb3VwaW5nc1tncm91cGluZ3NbMF1dLnByaWNlIC0gYmFja3dhcmQuZ3JvdXBpbmdzW2dyb3VwaW5nc1swXV0ucHJpY2VcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9oZWxwZXJzL2ZsaWdodHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyMjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0Ym9keVwiLFwidlwiOntcImxvYWRcIjp7XCJtXCI6XCJzb3J0T25cIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImZsaWdodC50aW1lXFxcIl1cIn19LFwiY2xpY2tcIjp7XCJtXCI6XCJjbGlja1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJhXCI6e1wiY2xhc3NcIjpbXCJmbGlnaHQgXCIse1widFwiOjQsXCJmXCI6W1wiaGFzLWdyb3VwaW5nXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJoYXNHcm91cGluZ3NcIl0sXCJzXCI6XCJfMCgpXCJ9LFwic1wiOnRydWV9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcInNtYWxsXCJdLFwiblwiOjUwLFwiclwiOlwic21hbGxcIixcInNcIjp0cnVlfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJzdW1tYXJ5IGNsaWNrYWJsZVwiXSxcIm5cIjo1MCxcInJcIjpcInN1bW1hcnlcIixcInNcIjp0cnVlfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJkZXRhaWxzXCJdLFwiblwiOjUwLFwiclwiOlwiZGV0YWlsc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaWRcIixcInNlbGVjdGVkLmlkXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV19LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcIm1haW5cIn0sXCIgXCIse1widFwiOjgsXCJyXCI6XCJpbmZvXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRldGFpbHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjb2xzcGFuXCI6XCI1XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcIml0aW5lcmFyeVwiLFwiYVwiOntcInNtYWxsXCI6W3tcInRcIjoyLFwiclwiOlwic21hbGxcIn1dLFwiY2xhc3NcIjpcImNvbXBhY3QgZGFya1wiLFwiZmxpZ2h0XCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0XCJ9XX19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJkZXRhaWxzXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiYVwiOntcImNsYXNzXCI6XCJzcGFjZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjb2xzcGFuXCI6XCI1XCJ9LFwiZlwiOltdfV19XSxcInJcIjpcImZsaWdodFwifV0sXCJwXCI6e1wibWFpblwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1haW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiYWlybGluZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibG9nb3NcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0b3AgYWxpZ25lZCBhdmF0YXIgaW1hZ2VcIixcInNyY1wiOlt7XCJ0XCI6MixcInJcIjpcImxvZ29cIn1dLFwiYWx0XCI6W3tcInRcIjoyLFwiclwiOlwibmFtZVwifV0sXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn1dfX1dLFwiblwiOjUyLFwiclwiOlwiY2FycmllcnNcIn1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm11bHRpcGxlXCJ9LFwiZlwiOltcIk11bHRpcGxlIENhcnJpZXJzXCJdfV0sXCJuXCI6NTAsXCJyXCI6XCJjYXJyaWVycy4xXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJuYW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJzLjAubmFtZVwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJmbGlnaHQtbm9cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCIsIFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiXSxcInNcIjpcIjAhPV8wXCJ9fSx7XCJ0XCI6MixcInJcIjpcIi5mbGlnaHRcIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwic2VnbWVudHMuMFwifV19XX1dLFwiclwiOlwiY2FycmllcnMuMVwifV0sXCJuXCI6NTEsXCJyXCI6XCJzdW1tYXJ5XCIsXCJzXCI6dHJ1ZX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNvbHNwYW5cIjpcIjNcIixcInN0eWxlXCI6XCJwYWRkaW5nLXRvcDogMDsgcGFkZGluZy1ib3R0b206IDA7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlZ21lbnRzXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRlcGFydFwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIkhIOm1tIEQgTU1NXFxcIilcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJwb3J0XCIsXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuZnJvbS5haXJwb3J0XCJ9fSxcIiwgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmZyb20uY2l0eVwifX1dfSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmZyb20uYWlycG9ydENvZGVcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFycm93XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInZpYVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIixcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCIwIT09XzBcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcInRpdGxlXCI6W3tcInRcIjoyLFwiclwiOlwiLmFpcnBvcnRcIn0sXCIsIFwiLHtcInRcIjoyLFwiclwiOlwiLmNpdHlcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuYWlycG9ydENvZGVcIn1dfV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJhaXJwb3J0c1wifV19XSxcInhcIjp7XCJyXCI6W1widmlhXCIsXCIuXCJdLFwic1wiOlwie2FpcnBvcnRzOl8wKF8xKX1cIn19XSxcIm5cIjo1MSxcInJcIjpcInN1bW1hcnlcIixcInNcIjp0cnVlfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiYXJyaXZlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5hcnJpdmUuZm9ybWF0KFxcXCJISDptbSBEIE1NTVxcXCIpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYWlycG9ydFwiLFwidGl0bGVcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkudG8uYWlycG9ydFwifX0sXCIsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJsYXN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLnRvLmNpdHlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJsYXN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLnRvLmFpcnBvcnRDb2RlXCJ9fV19XX1dfV0sXCJuXCI6NTIsXCJyXCI6XCJmbGlnaHQuc2VnbWVudHNcIn1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZmxpZ2h0LnNlZ21lbnRzLmxlbmd0aFwiXSxcInNcIjpcIl8wPjFcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRlcGFydFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGltZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAmJl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJISDptbVxcXCIpXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJwb3J0XCIsXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMCYmXzAoXzEpLmZyb20uYWlycG9ydFwifX0sXCIsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wJiZfMChfMSkuZnJvbS5jaXR5XCJ9fV19LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMCYmXzAoXzEpLmZyb20uYWlycG9ydENvZGVcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGF0ZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAmJl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJEIE1NTVxcXCIpXCJ9fV19XSxcIm5cIjo1MSxcInJcIjpcInN1bW1hcnlcIixcInNcIjp0cnVlfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiYXJyb3dcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidmlhXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiLFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiXSxcInNcIjpcIjAhPT1fMFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1widGl0bGVcIjpbe1widFwiOjIsXCJyXCI6XCIuYWlycG9ydFwifSxcIiwgXCIse1widFwiOjIsXCJyXCI6XCIuY2l0eVwifV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5haXJwb3J0Q29kZVwifV19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImFpcnBvcnRzXCJ9XX1dLFwieFwiOntcInJcIjpbXCJ2aWFcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJ7YWlycG9ydHM6XzAmJl8wKF8xKX1cIn19XSxcIm5cIjo1MSxcInJcIjpcInN1bW1hcnlcIixcInNcIjp0cnVlfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiYXJyaXZlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wJiZfMChfMSkuYXJyaXZlLmZvcm1hdChcXFwiSEg6bW1cXFwiKVwifX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWlycG9ydFwiLFwidGl0bGVcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMCYmXzAoXzEpLnRvLmFpcnBvcnRcIn19LFwiLCBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wJiZfMChfMSkudG8uY2l0eVwifX1dfSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMCYmXzAoXzEpLnRvLmFpcnBvcnRDb2RlXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJsYXN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAmJl8wKF8xKS5hcnJpdmUuZm9ybWF0KFxcXCJEIE1NTVxcXCIpXCJ9fV19XSxcIm5cIjo1MSxcInJcIjpcInN1bW1hcnlcIixcInNcIjp0cnVlfV19XSxcInhcIjp7XCJyXCI6W1wiZmxpZ2h0LnNlZ21lbnRzLmxlbmd0aFwiXSxcInNcIjpcIl8wPjFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwicHJpY2VcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJhbW91bnRcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXNjb3VudFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzYXZlXCJdLFwic1wiOlwiXzA+MTBcIn19LFwiIFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCIkXCIsXCJwcmljZVwiLFwic2F2ZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEtXzIsXzMpXCJ9fV0sXCJuXCI6NTAsXCJyXCI6XCJzYXZlXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicHJpY2VcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX1dLFwiclwiOlwic2F2ZVwifV0sXCJ4XCI6e1wiclwiOltcImRpc2NvdW50XCIsXCJvbndhcmRcIixcImZsaWdodFwiXSxcInNcIjpcIntzYXZlOl8wKFtfMSxfMl0pfVwifX1dLFwiblwiOjUwLFwiclwiOlwib253YXJkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGlzY291bnRcIn0sXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCIkXCIsXCJwcmljZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2F2ZVwiXSxcInNcIjpcIl8wPjEwXCJ9fSxcIiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicHJpY2VcIixcInNhdmVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLV8yLF8zKVwifX1dLFwiblwiOjUwLFwiclwiOlwic2F2ZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XSxcInJcIjpcInNhdmVcIn1dLFwieFwiOntcInJcIjpbXCJkaXNjb3VudFwiLFwiZmxpZ2h0XCIsXCJiYWNrd2FyZFwiXSxcInNcIjpcIntzYXZlOl8wKFtfMSxfMl0pfVwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJiYWNrd2FyZFwiLFwic2VsZWN0ZWRcIl0sXCJzXCI6XCJfMCYmIV8xXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XSxcInhcIjp7XCJyXCI6W1wiYmFja3dhcmRcIixcInNlbGVjdGVkXCJdLFwic1wiOlwiXzAmJiFfMVwifX1dLFwiclwiOlwib253YXJkXCJ9XX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJ1dHRvbiBsYXJnZSBvcmFuZ2VcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZWxlY3RcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIkJPT0tcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCIsXCJzZWFyY2guZG9tZXN0aWNcIl0sXCJzXCI6XCIxPT1fMHx8IV8xXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJ1dHRvbiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsYXJnZVwiXSxcIm5cIjo1MSxcInJcIjpcInNtYWxsXCIsXCJzXCI6dHJ1ZX0sXCIgYmx1ZVwiXX0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZWxlY3RcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJERVNFTEVDVFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaWRcIixcInNlbGVjdGVkLmlkXCJdLFwic1wiOlwiXzA9PV8xXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJTRUxFQ1RcIl0sXCJ4XCI6e1wiclwiOltcImlkXCIsXCJzZWxlY3RlZC5pZFwiXSxcInNcIjpcIl8wPT1fMVwifX1dfV0sXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiLFwic2VhcmNoLmRvbWVzdGljXCJdLFwic1wiOlwiMT09XzB8fCFfMVwifX1dLFwiblwiOjUxLFwiclwiOlwic3VtbWFyeVwiLFwic1wiOnRydWV9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZhcmUgZmx1aWQgcG9wdXBcIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiBsZWZ0OyBtYXgtd2lkdGg6IDM1MHB4O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGF4VGF4ZXMuMS5jXCJ9LFwieCBhZHVsdHM6IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCIkXCIsXCJwYXhUYXhlcy4xLmJhc2ljX2ZhcmVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgWVE6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjEueXFcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgSk46XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjEuam5cIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgT1RIRVI6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjEub3RoZXJcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgVE9UQUw6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjEudG90YWxcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifV0sXCJuXCI6NTAsXCJyXCI6XCJwYXhUYXhlcy4xXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBheFRheGVzLjIuY1wifSxcInggY2hpbGRyZW46IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCIkXCIsXCJwYXhUYXhlcy4yLmJhc2ljX2ZhcmVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgWVE6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjIueXFcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgSk46XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjIuam5cIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgT1RIRVI6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjIub3RoZXJcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgVE9UQUw6XCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjIudG90YWxcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifV0sXCJuXCI6NTAsXCJyXCI6XCJwYXhUYXhlcy4yXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBheFRheGVzLjMuY1wifSxcInggaW5mYW50czogXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInBheFRheGVzLjMuYmFzaWNfZmFyZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBZUTpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicGF4VGF4ZXMuMy55cVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBKTjpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicGF4VGF4ZXMuMy5qblwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBPVEhFUjpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicGF4VGF4ZXMuMy5vdGhlclwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiBUT1RBTDpcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicGF4VGF4ZXMuMy50b3RhbFwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9XSxcIm5cIjo1MCxcInJcIjpcInBheFRheGVzLjNcIn1dfV19XX1dLFwiaW5mb1wiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJhXCI6e1wiY2xhc3NcIjpcImluZm9cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY29sc3BhblwiOlwiNVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVycy4wLm5hbWVcIn0sXCIsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wJiZfMChfMSkuZmxpZ2h0XCJ9fSxcIiB8IFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJkdXJhdGlvbi5mb3JtYXRcIixcImR1cmF0aW9uXCIsXCJmbGlnaHQudGltZVwiXSxcInNcIjpcIl8wJiZfMS5mb3JtYXQoXzIpXCJ9fSxcIiB8IFwiLHtcInRcIjo0LFwiZlwiOltcIm5vbi1zdG9wXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzdG9wc1wiLFwiZmxpZ2h0LnNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMCYmMD09XzAoXzEpXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInN0b3BzXCIsXCJmbGlnaHQuc2VnbWVudHMuMFwiXSxcInNcIjpcIl8wJiZfMChfMSlcIn19LFwiIHN0b3AocylcIl0sXCJ4XCI6e1wiclwiOltcInN0b3BzXCIsXCJmbGlnaHQuc2VnbWVudHMuMFwiXSxcInNcIjpcIl8wJiYwPT1fMChfMSlcIn19LFwiIHwgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZsaWdodC5yZWZ1bmRhYmxlXCJdLFwic1wiOlwiW251bGwsXFxcIk5vbiByZWZ1bmRhYmxlXFxcIixcXFwiUmVmdW5kYWJsZVxcXCJdW18wXVwifX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdW1tYXJ5XCIsXCJzXCI6dHJ1ZX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjb2xzcGFuXCI6XCI0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBkaXZpZGVkIHJlbGF4ZWQgaG9yaXpvbnRhbCBsaXN0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50IHRpbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJkdXJhdGlvbi5mb3JtYXRcIixcImR1cmF0aW9uXCIsXCJmbGlnaHQudGltZVwiXSxcInNcIjpcIl8wJiZfMS5mb3JtYXQoXzIpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbSBzdG9wc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiTk9OLVNUT1BcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0b3BzXCIsXCJmbGlnaHQuc2VnbWVudHMuMFwiXSxcInNcIjpcIl8wJiYwPT1fMChfMSlcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic3RvcHNcIixcImZsaWdodC5zZWdtZW50cy4wXCJdLFwic1wiOlwiXzAmJl8wKF8xKVwifX0sXCIgc3RvcChzKVwiXSxcInhcIjp7XCJyXCI6W1wic3RvcHNcIixcImZsaWdodC5zZWdtZW50cy4wXCJdLFwic1wiOlwiXzAmJjA9PV8wKF8xKVwifX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcInRleHQtYWxpZ246IGNlbnRlcjsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgZm9udC1zaXplOiAxMnB4O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidG9nZ2xlRGV0YWlsc1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiRmxpZ2h0IERldGFpbHNcIl19XX1dLFwiclwiOlwic3VtbWFyeVwifV19XX19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHQuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDIzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlLmpzJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBCb29raW5nID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9ib29raW5nJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbnZhciBST1VURVMgPSByZXF1aXJlKCdhcHAvcm91dGVzJykuZmxpZ2h0cztcclxuXHJcblxyXG52YXIgbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL3JvdW5kdHJpcC5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIGZsaWdodHM6IHJlcXVpcmUoJy4vZmxpZ2h0cycpLFxyXG4gICAgICAgIGZsaWdodDogcmVxdWlyZSgnLi9mbGlnaHQnKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gXy5leHRlbmQoe1xyXG4gICAgICAgICAgICBtZXRhOiBNZXRhLm9iamVjdCxcclxuXHJcbiAgICAgICAgICAgIGNhcnJpZXI6IC0xLFxyXG4gICAgICAgICAgICBzZWxlY3RlZDogW10sXHJcbiAgICAgICAgICAgIGNvdW50OiBmdW5jdGlvbihmbGlnaHRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5zdW0oXy5tYXAoZmxpZ2h0cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS5sZW5ndGg7IH0pKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2FycmllcnM6IGZ1bmN0aW9uKGNhcnJpZXJzLCBwcmljZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChfLmNsb25lRGVlcChjYXJyaWVycyksIGZ1bmN0aW9uKGkpIHsgaS5wcmljZSA9IHByaWNlc1tpLmNvZGVdIHx8IG51bGw7IHJldHVybiBpOyB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXAgPSBhLnByaWNlIHx8IDk5OTk5OTk5OSwgYnAgPSBiLnByaWNlIHx8IDk5OTk5OTk5OTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFwID09IGJwKSByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXAgPiBicCA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihmbGlnaHQsIHZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzZWxlY3RlZCcsIGZsaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE1PQklMRSAmJiAyID09IHRoaXMuZ2V0KCdzZWxlY3RlZCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9vaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICB9LCByZXF1aXJlKCdoZWxwZXJzL2ZsaWdodHMnKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2FycmllcnMgPSBbXTtcclxuXHJcbiAgICAgICAgXy5lYWNoKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICAgICAgXy5lYWNoKGZsaWdodHMsIGZ1bmN0aW9uKGZsaWdodCkge1xyXG4gICAgICAgICAgICAgICAgY2FycmllcnNbY2FycmllcnMubGVuZ3RoXSA9IGZsaWdodC5nZXQoJ3NlZ21lbnRzLjAuMC5jYXJyaWVyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnYWxsY2FycmllcnMnLCBfLnVuaXF1ZShjYXJyaWVycywgJ2NvZGUnKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplLnJvdW5kdHJpcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgIHZhciB3aWR0aCA9ICQoJy5mbGlnaHRzLWdyaWQnLCB0aGlzLmVsKS53aWR0aCgpO1xyXG5cclxuICAgICAgICAgICAgJCgnLmZsaWdodHMtZ3JpZCA+IHRib2R5ID4gdHIgPiB0ZCcsIHRoaXMuZWwpLndpZHRoKHdpZHRoLzIpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICQoJy5kcm9wZG93bicsIHRoaXMuZWwpLmRyb3Bkb3duKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGJvb2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLmdldCgnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgaWYgKDIgPT0gc2VsZWN0ZWQubGVuZ3RoICYmIHNlbGVjdGVkWzBdICYmIHNlbGVjdGVkWzFdKSB7XHJcbiAgICAgICAgICAgIHZhciBvbndhcmQgPSBzZWxlY3RlZFswXS5nZXQoKSxcclxuICAgICAgICAgICAgICAgIGJhY2t3YXJkID0gc2VsZWN0ZWRbMV0uZ2V0KCksXHJcbiAgICAgICAgICAgICAgICBncm91cGluZ3MgPSBfLmludGVyc2VjdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBvbndhcmQuc3lzdGVtLmdkcyA/IG9ud2FyZC5ncm91cGluZ3MgOiBfLmtleXMob253YXJkLmdyb3VwaW5ncyksXHJcbiAgICAgICAgICAgICAgICAgICAgXy5rZXlzKGJhY2t3YXJkLmdyb3VwaW5ncylcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBkaXNjb3VudFxyXG4gICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdyb3VwaW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbndhcmQuc3lzdGVtLmdkcykge1xyXG4gICAgICAgICAgICAgICAgICAgIEJvb2tpbmcuY3JlYXRlKFtiYWNrd2FyZC5ncm91cGluZ3NbZ3JvdXBpbmdzWzBdXS5zeXN0ZW1dLCB7IGNzOiB2aWV3LmdldCgnc2VhcmNoLmNzJyksICAgdXJsOiB2aWV3LmdldCgnc2VhcmNoLnVybCcpLGN1cjp2aWV3LmdldCgnbWV0YS5kaXNwbGF5X2N1cnJlbmN5JykgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oYm9va2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZShST1VURVMuYm9va2luZyhib29raW5nLmdldCgnaWQnKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYm9va2luZyA9IG9ud2FyZC5ncm91cGluZ3NbZ3JvdXBpbmdzWzBdXS5zeXN0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmcucmNzLnB1c2goYmFja3dhcmQuZ3JvdXBpbmdzW2dyb3VwaW5nc1swXV0uc3lzdGVtLnJjc1swXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEJvb2tpbmcuY3JlYXRlKFtib29raW5nXSwgeyBjczogdmlldy5nZXQoJ3NlYXJjaC5jcycpLCAgIHVybDogdmlldy5nZXQoJ3NlYXJjaC51cmwnKSxjdXI6dmlldy5nZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGJvb2tpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UoUk9VVEVTLmJvb2tpbmcoYm9va2luZy5nZXQoJ2lkJykpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQm9va2luZy5jcmVhdGUoXy5tYXAodGhpcy5nZXQoJ3NlbGVjdGVkJyksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIGkuZ2V0KCdzeXN0ZW0nKTsgfSksIHsgY3M6IHZpZXcuZ2V0KCdzZWFyY2guY3MnKSwgICB1cmw6IHZpZXcuZ2V0KCdzZWFyY2gudXJsJyksY3VyOnZpZXcuZ2V0KCdtZXRhLmRpc3BsYXlfY3VycmVuY3knKSB9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihib29raW5nKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlKFJPVVRFUy5ib29raW5nKGJvb2tpbmcuZ2V0KCdpZCcpKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93Q2FycmllcjogZnVuY3Rpb24oY29kZSkge1xyXG4gICAgICAgIHRoaXMuc2V0KCdjYXJyaWVyJywgY29kZSk7XHJcbiAgICAgICAgdGhpcy5nZXQoJ2ZpbHRlcicpLnNldCgnZmlsdGVyZWQuY2FycmllcnMnLCAtMSA9PSBjb2RlID8gZmFsc2UgOiBbY29kZV0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgbW9kaWZ5U2VhcmNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJvb3QubW9kaWZ5U2VhcmNoKCk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvcm91bmR0cmlwLmpzXG4gKiogbW9kdWxlIGlkID0gMjMxXG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgZXF1YWwgaGVpZ2h0IGdyaWQgZmxpZ2h0cy1zZWxlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInR3ZWx2ZSB3aWRlIGNvbHVtblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcmVsYXhlZCBob3Jpem9udGFsIGxpc3RcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCIsXCJzdHlsZVwiOlwid2lkdGg6IDIwMHB4O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRvcCBhbGlnbmVkIGF2YXRhciBpbWFnZVwiLFwic3JjXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5jYXJyaWVyLmxvZ29cIn19XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJpdGluZXJhcnlcIn1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSkuY2Fycmllci5uYW1lXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5mbGlnaHRcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIkhIOm1tXFxcIilcIn19LFwiIC0gXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSkuYXJyaXZlLmZvcm1hdChcXFwiSEg6bW1cXFwiKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZHVyYXRpb25cIixcInRpbWVcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXzEpXCJ9fSxcIiB8IFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic3RvcHNcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSlcIn19LFwiIHN0b3AocylcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0b3BzXCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJub24tc3RvcFwiXSxcInhcIjp7XCJyXCI6W1wic3RvcHNcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJEIE1NTSwgWVlZWVxcXCIpXCJ9fV19XX1dLFwiblwiOjUwLFwiclwiOlwic2VnbWVudHNcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcInRleHQtYWxpZ246IGNlbnRlcjtcIn0sXCJmXCI6W1wiTk9UIFNFTEVDVEVEXCJdfV0sXCJyXCI6XCJzZWdtZW50c1wifV19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcInNlbGVjdGVkXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmb3VyIHdpZGUgY29sdW1uIGNlbnRlciBhbGlnbmVkIGJvb2tcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpc2NvdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzYXZlXCJdLFwic1wiOlwiXzA+MTBcIn19LFwiIFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicHJpY2VcIixcInNhdmVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLV8yLF8zKVwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzYXZlXCJdLFwic1wiOlwiXzA+MFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicHJpY2VcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX1dLFwieFwiOntcInJcIjpbXCJzYXZlXCJdLFwic1wiOlwiXzA+MFwifX1dLFwieFwiOntcInJcIjpbXCJkaXNjb3VudFwiLFwicHJpY2VcIixcInNlbGVjdGVkXCJdLFwic1wiOlwie3NhdmU6XzAoXzIpLHByaWNlOl8xKF8yKX1cIn19XSxcIm5cIjo1MCxcInJcIjpcInNlbGVjdGVkXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJidXR0b25cIixcImNsYXNzXCI6XCJ1aSBidXR0b24gbGFyZ2Ugb3JhbmdlXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MSxcInhcIjp7XCJyXCI6W1wiY2FuYm9va1wiLFwic2VsZWN0ZWRcIixcImZsaWdodHNcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImJvb2tcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIkJPT0tcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiY2FuYm9va1wiLFwic2VsZWN0ZWRcIixcImZsaWdodHNcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzZWxlY3RlZFwifSx7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZGl2aWRlZCByZWxheGVkIGhvcml6b250YWwgbGlzdCBmbGlnaHRzLXRhYnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiY2FycmllclwiXSxcInNcIjpcIl8wPT0tMVwifX1dLFwic3R5bGVcIjpcImN1cnNvcjogcG9pbnRlcjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzaG93Q2FycmllclwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIlstMV1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy9pY29ucy9hZXJvcGxhbjIucG5nXCIsXCJhbGlnblwiOlwiYWJzbWlkZGxlXCIsXCJ3aWR0aFwiOlwiMjNcIixcImhlaWdodFwiOlwiMjNcIn19LFwiIEFsbCBBaXJsaW5lc1wiXX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcIml0ZW0gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJjYXJyaWVyXCIsXCJjb2RlXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV0sXCJzdHlsZVwiOlwiY3Vyc29yOiBwb2ludGVyO1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNob3dDYXJyaWVyXCIsXCJhXCI6e1wiclwiOltcImNvZGVcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6W3tcInRcIjoyLFwiclwiOlwibG9nb1wifV0sXCJjbGFzc1wiOlwidWkgdG9wIGFsaWduZWQgaW1hZ2VcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibmFtZVwifV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XSxcIm5cIjo1MCxcInJcIjpcInByaWNlXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIsKgXCJdLFwiclwiOlwicHJpY2VcIn1dfV19XSxcIm5cIjo1MixcInhcIjp7XCJyXCI6W1wiY2FycmllcnNcIixcImFsbGNhcnJpZXJzXCIsXCJwcmljZXNcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJmbGlnaHRzLWdyaWQgc21hbGxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGJvZHlcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcIndpZHRoOiA1MCU7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZsaWdodHNcIixcImFcIjp7XCJjYXB0aW9uXCI6XCIxXCIsXCJzZWxlY3RGblwiOlt7XCJ0XCI6MixcInJcIjpcIm9uU2VsZWN0XCJ9XSxcInNtYWxsXCI6XCIxXCIsXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0cy4wXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJzZWxlY3RlZFwiOlt7XCJ0XCI6MixcInJcIjpcInNlbGVjdGVkLjBcIn1dLFwiYmFja3dhcmRcIjpbe1widFwiOjIsXCJyXCI6XCJzZWxlY3RlZC4xXCJ9XSxcInBlbmRpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJ3aWR0aDogNTAlO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmbGlnaHRzXCIsXCJhXCI6e1wiY2FwdGlvblwiOlwiMVwiLFwic2VsZWN0Rm5cIjpbe1widFwiOjIsXCJyXCI6XCJvblNlbGVjdFwifV0sXCJzbWFsbFwiOlwiMVwiLFwiZmxpZ2h0c1wiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodHMuMVwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic2VsZWN0ZWRcIjpbe1widFwiOjIsXCJyXCI6XCJzZWxlY3RlZC4xXCJ9XSxcIm9ud2FyZFwiOlt7XCJ0XCI6MixcInJcIjpcInNlbGVjdGVkLjBcIn1dLFwicGVuZGluZ1wiOlt7XCJ0XCI6MixcInJcIjpcInBlbmRpbmdcIn1dfX1dfV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImNvdW50XCIsXCJmbGlnaHRzXCJdLFwic1wiOlwiXzAoXzEpPjBcIn19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL3JvdW5kdHJpcC5odG1sXG4gKiogbW9kdWxlIGlkID0gMjMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpLFxyXG4gICAgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UuanMnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEJvb2tpbmcgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L2Jvb2tpbmcnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxudmFyIFJPVVRFUyA9IHJlcXVpcmUoJ2FwcC9yb3V0ZXMnKS5mbGlnaHRzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICBmbGlnaHRzOiByZXF1aXJlKCcuL2ZsaWdodHMnKSxcclxuICAgICAgICAnbXVsdGljaXR5LXN1bW1hcnknOiByZXF1aXJlKCcuL211bHRpY2l0eS9zdW1tYXJ5JylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3QsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogMCxcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IFtdLFxyXG4gICAgICAgICAgICBwZXJjZW50OiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gMTAwL2FycmF5Lmxlbmd0aDsgfSxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGZsaWdodCwgdmlldykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuZ2V0KCdhY3RpdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCA9IHRoaXMuZ2V0KCdmbGlnaHRzJykubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzZWxlY3RlZCcsIGZsaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKC0xICE9PSBhY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlIDwgY291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdhY3RpdmUnLCBhY3RpdmUrMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2aWV3LmdldCgnc2VsZWN0ZWQnKS5sZW5ndGggPCBjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLmdldCgnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkgKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZWN0ZWRbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnYWN0aXZlJywgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE1PQklMRSAmJiBjb3VudCA9PSB0aGlzLmdldCgnc2VsZWN0ZWQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvb2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSwgcmVxdWlyZSgnaGVscGVycy9mbGlnaHRzJykpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcuZHJvcGRvd24nLCB0aGlzLmVsKS5kcm9wZG93bigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBib29rOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIEJvb2tpbmcuY3JlYXRlKF8ubWFwKHRoaXMuZ2V0KCdzZWxlY3RlZCcpLCBmdW5jdGlvbihpKSB7IHJldHVybiBpLmdldCgnc3lzdGVtJyk7IH0pLCB7IGNzOiB2aWV3LmdldCgnc2VhcmNoLmNzJyksIHVybDogdmlldy5nZXQoJ3NlYXJjaC51cmwnKSxjdXI6dmlldy5nZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScpIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGJvb2tpbmcpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UoUk9VVEVTLmJvb2tpbmcoYm9va2luZy5nZXQoJ2lkJykpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1vZGlmeVNlYXJjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yb290Lm1vZGlmeVNlYXJjaCgpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDIzM1xuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZWdtZW50IGVxdWFsIGhlaWdodCBncmlkIGZsaWdodHMtc2VsZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d2VsdmUgd2lkZSBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHJlbGF4ZWQgaG9yaXpvbnRhbCBsaXN0XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRvcCBhbGlnbmVkIGF2YXRhciBpbWFnZVwiLFwic3JjXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5jYXJyaWVyLmxvZ29cIn19XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJpdGluZXJhcnlcIn1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSkuY2Fycmllci5uYW1lXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5mbGlnaHRcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIkhIOm1tXFxcIilcIn19LFwiIC0gXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSkuYXJyaXZlLmZvcm1hdChcXFwiSEg6bW1cXFwiKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZHVyYXRpb25cIixcInRpbWVcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXzEpXCJ9fSxcIiB8IFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic3RvcHNcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSlcIn19LFwiIHN0b3AocylcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0b3BzXCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJub24tc3RvcFwiXSxcInhcIjp7XCJyXCI6W1wic3RvcHNcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJEIE1NTSwgWVlZWVxcXCIpXCJ9fV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzZWdtZW50c1wifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJzZWxlY3RlZFwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZm91ciB3aWRlIGNvbHVtbiBjZW50ZXIgYWxpZ25lZCBib29rXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwicHJpY2VcIixcInNlbGVjdGVkXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMShfMiksXzMpXCJ9fV0sXCJuXCI6NTAsXCJyXCI6XCJzZWxlY3RlZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOlwidWkgYnV0dG9uIGxhcmdlIG9yYW5nZVwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTEsXCJ4XCI6e1wiclwiOltcImNhbmJvb2tcIixcInNlbGVjdGVkXCIsXCJmbGlnaHRzXCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJib29rXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJCT09LXCJdfV19XX1dLFwiblwiOjUwLFwiclwiOlwic2VsZWN0ZWRcIn0se1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZGl2aWRlZCByZWxheGVkIGhvcml6b250YWwgbGlzdCBmbGlnaHRzLXRhYnNcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcInQxXCI6XCJmYWRlXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCIsXCJpXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV0sXCJzdHlsZVwiOlwiY3Vyc29yOiBwb2ludGVyO1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXCJpXCJdLFwic1wiOlwiW1xcXCJhY3RpdmVcXFwiLF8wXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIml0aW5lcmFyeVwifV19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJkZGQsIEQgTU1NXFxcIilcIn19XSxcInJcIjpcIi4vMFwifV19XX1dLFwiblwiOjUwLFwiclwiOlwiLi8wXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImZsaWdodHNcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJ0MVwiOlwiZmFkZVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIl8wPT0tMVwifX1dLFwic3R5bGVcIjpcImN1cnNvcjogcG9pbnRlcjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImFjdGl2ZVxcXCIsLTFdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJWSUVXIEFMTFwiXX0sXCIgRkxJR0hUU1wiXX1dfV0sXCJuXCI6NTEsXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6W1wiZmxpZ2h0cy1ncmlkIHNtYWxsIFwiLHtcInRcIjo0LFwiZlwiOltcInN1bW1hcnlcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIi0xPT1fMFwifX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0Ym9keVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJ2YWxpZ25cIjpcInRvcFwiLFwic3R5bGVcIjpbXCJ3aWR0aDogXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcInBlcmNlbnRcIixcImZsaWdodHNcIl0sXCJzXCI6XCJfMChfMSlcIn19LFwiJTtcIl19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZsaWdodHNcIixcImFcIjp7XCJjYXB0aW9uXCI6XCIxXCIsXCJzZWxlY3RGblwiOlt7XCJ0XCI6MixcInJcIjpcIm9uU2VsZWN0XCJ9XSxcInN1bW1hcnlcIjpcIjFcIixcImNsYXNzXCI6XCJ0aW55XCIsXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic2VsZWN0ZWRcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcInNlbGVjdGVkXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImlcIn1dfX1dLFwicGVuZGluZ1wiOlt7XCJ0XCI6MixcInJcIjpcInBlbmRpbmdcIn1dfX1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuLzBcIn1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCItMT09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInZhbGlnblwiOlwidG9wXCIsXCJzdHlsZVwiOlwid2lkdGg6IDEwMCU7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZsaWdodHNcIixcImFcIjp7XCJzZWxlY3RGblwiOlt7XCJ0XCI6MixcInJcIjpcIm9uU2VsZWN0XCJ9XSxcImZsaWdodHNcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJzZWxlY3RlZFwiOlt7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwic2VsZWN0ZWRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifV19fV0sXCJwZW5kaW5nXCI6W3tcInRcIjoyLFwiclwiOlwicGVuZGluZ1wifV19fV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiLFwiYWN0aXZlXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV0sXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIi0xPT1fMFwifX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZmxpZ2h0c1wifV19XX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDIzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eS9zdW1tYXJ5Lmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgZmxpZ2h0czogcmVxdWlyZSgnLi4vZmxpZ2h0cycpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBlcmNlbnQ6IGZ1bmN0aW9uKGFycmF5KSB7IHJldHVybiAxMDAvYXJyYXkubGVuZ3RoOyB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkvc3VtbWFyeS5qc1xuICoqIG1vZHVsZSBpZCA9IDIzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6IDEwMCVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJ2YWxpZ25cIjpcInRvcFwiLFwic3R5bGVcIjpbXCJ3aWR0aDogXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcInBlcmNlbnRcIixcInJlc3VsdHMuZmxpZ2h0c1wiXSxcInNcIjpcIl8wKF8xKVwifX0sXCIlO1wiXX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZmxpZ2h0c1wiLFwiYVwiOntcImNhcHRpb25cIjpcIjFcIixcInNlbGVjdEZuXCI6W3tcInRcIjoyLFwiclwiOlwic2VsZWN0Rm5cIn1dLFwic3VtbWFyeVwiOlwiMVwiLFwiY2xhc3NcIjpcInRpbnlcIixcImZsaWdodHNcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInJlc3VsdHMuc2VhcmNoXCJ9XSxcImZpbHRlcmVkXCI6W3tcInRcIjoyLFwiclwiOlwicmVzdWx0cy5maWx0ZXJlZFwifV0sXCJzZWxlY3RlZFwiOlt7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwic2VsZWN0ZWRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifV19fV19fV19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcInJlc3VsdHMuZmxpZ2h0c1wifV19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvbXVsdGljaXR5L3N1bW1hcnkuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDIzNlxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBTZWFyY2ggPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L3NlYXJjaCcpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ3VpLXNwaW5uZXInOiByZXF1aXJlKCdjb3JlL2Zvcm0vc3Bpbm5lcicpLFxyXG4gICAgICAgICd1aS1haXJwb3J0JzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL2FpcnBvcnQnKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtb21lbnQ6IG1vbWVudFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNldCgnc2VhcmNoJywgU2VhcmNoLnBhcnNlKHRoaXMuZ2V0KCdtb2RpZnknKS50b0pTT04oKSkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHBvcHVwID0gJCh0aGlzLmZpbmQoJy5leHRlbmRlZC5wb3B1cCcpKSxcclxuICAgICAgICAgICAgZm4gPSAkKHRoaXMuZmluZCgnLmV4dGVuZGVkLmRyb3Bkb3duJykpXHJcbiAgICAgICAgICAgICAgICAucG9wdXAoe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2JvdHRvbSByaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXA6ICQodGhpcy5maW5kKCcuZXh0ZW5kZWQucG9wdXAnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgb246IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlZmVyOiAnb3Bwb3NpdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBmbi5wb3B1cCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLm9uKCdjbGljay5tb2RpZnktc2VhcmNoJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2subW9kaWZ5LXNlYXJjaCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4ucG9wdXAoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKCdjbGljay5tb2RpZnktc2VhcmNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLm9mZignY2xpY2subW9kaWZ5LXNlYXJjaCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIDtcclxuICAgIH0sXHJcblxyXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnBvc3QoUk9VVEVTLnNlYXJjaCwgdGhpcy5zZXJpYWxpemUoKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2VhcmNoKSB7IHBhZ2Uoc2VhcmNoLnVybCk7IH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5nZXQoJ3NlYXJjaCcpLnRvSlNPTigpOyB9XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmpzXG4gKiogbW9kdWxlIGlkID0gMjM3XG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBmb3JtIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0sXCIgbW9kaWZ5LXNlYXJjaCBzaW5nbGVcIl0sXCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wifSxcInZcIjp7XCJzdWJtaXRcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsdWlkXCIsXCJjZWxsc3BhY2luZ1wiOlwiNVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcIm1pbi13aWR0aDogMjAwcHg7XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1haXJwb3J0XCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLmZyb21cIn1dLFwiY2xhc3NcIjpcImZsdWlkIHRyYW5zcGFyZW50XCIsXCJwbGFjZWhvbGRlclwiOlwiRlJPTVwiLFwic2VhcmNoXCI6XCIxXCIsXCJkb21lc3RpY1wiOlwiMVwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjAuZnJvbVwifV19LFwiZlwiOltdfV0sXCJuXCI6NTAsXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktYWlycG9ydFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC5mcm9tXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0cmFuc3BhcmVudCBmcm9tXCIsXCJwbGFjZWhvbGRlclwiOlwiRlJPTVwiLFwic2VhcmNoXCI6XCIxXCIsXCJkb21lc3RpY1wiOlwiMFwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjAuZnJvbVwifV19LFwiZlwiOltdfV0sXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcIm1pbi13aWR0aDogMjAwcHg7XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1haXJwb3J0XCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLnRvXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0cmFuc3BhcmVudFwiLFwicGxhY2Vob2xkZXJcIjpcIlRPXCIsXCJzZWFyY2hcIjpcIjFcIixcImRvbWVzdGljXCI6XCIxXCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5mbGlnaHQuMC50b1wifV19LFwiZlwiOltdfV0sXCJuXCI6NTAsXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktYWlycG9ydFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC50b1wifV0sXCJjbGFzc1wiOlwiZmx1aWQgdHJhbnNwYXJlbnRcIixcInBsYWNlaG9sZGVyXCI6XCJUT1wiLFwic2VhcmNoXCI6XCIxXCIsXCJkb21lc3RpY1wiOlwiMFwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjAudG9cIn1dfSxcImZcIjpbXX1dLFwiclwiOlwic2VhcmNoLmRvbWVzdGljXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJtaW4td2lkdGg6IDExMHB4O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1kYXRlXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwifV0sXCJjbGFzc1wiOlwiZmx1aWQgcG9pbnRpbmcgdG9wIGxlZnRcIixcInNpbXBsZVwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIkRFUEFSVCBPTlwiLFwibWluXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIl0sXCJzXCI6XCJfMCgpXCJ9fV0sXCJtYXhcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiLFwic2VhcmNoLmZsaWdodHMuMC5yZXR1cm5fYXRcIl0sXCJzXCI6XCIyPT1fMCYmXzFcIn19XSxcImNhbGVuZGFyXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXSxcInNcIjpcInt0d29tb250aDp0cnVlfVwifX1dLFwidHdvbW9udGhcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltdLFwic1wiOlwidHJ1ZVwifX1dLFwicmFuZ2VcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCIsXCJzZWFyY2guZmxpZ2h0cy4wLnJldHVybl9hdFwiXSxcInNcIjpcIltfMCxfMV1cIn19XX0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJzdHlsZVwiOlwibWluLXdpZHRoOiAxMTBweDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZGF0ZVwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC5yZXR1cm5fYXRcIn1dLFwiY2xhc3NcIjpcImZsdWlkIHBvaW50aW5nIHRvcCByaWdodFwiLFwic2ltcGxlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiUkVUVVJOIE9OXCIsXCJtaW5cIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCIsXCJtb21lbnRcIl0sXCJzXCI6XCJfMHx8XzEoKVwifX1dLFwidHdvbW9udGhcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltdLFwic1wiOlwidHJ1ZVwifX1dLFwicmFuZ2VcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCIsXCJzZWFyY2guZmxpZ2h0cy4wLnJldHVybl9hdFwiXSxcInNcIjpcIltfMCxfMV1cIn19XX0sXCJmXCI6W119XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIyPT1fMFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZWxlY3Rpb24gZXh0ZW5kZWQgZHJvcGRvd24gZmx1aWQgYWN0aXZlXCIsXCJ0YWJpbmRleFwiOlwiMFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGV4dFwiLFwic3R5bGVcIjpcIndoaXRlLXNwYWNlOiBub3dyYXA7IHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLnBhc3NlbmdlcnMuMFwifSxcIiBBZHVsdCxcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5wYXNzZW5nZXJzLjBcIl0sXCJzXCI6XCJfMD4wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4xXCJ9LFwiIENoaWxkLFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnBhc3NlbmdlcnMuMVwiXSxcInNcIjpcIl8wPjBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5wYXNzZW5nZXJzLjJcIn0sXCIgSW5mYW50LFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnBhc3NlbmdlcnMuMlwiXSxcInNcIjpcIl8wPjBcIn19LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJtZXRhLmNhYmluVHlwZXNcIixcIm1cIjpbe1wiclwiOltcInNlYXJjaC5jYWJpblR5cGVcIl0sXCJzXCI6XCJfMC0xXCJ9LFwibmFtZVwiXX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRyb3Bkb3duIGljb25cIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXh0ZW5kZWQgcG9wdXBcIixcInN0eWxlXCI6XCJ3aWR0aDogMTUwcHg7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zcGlubmVyXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4wXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJBZHVsdHNcIixcIm1pblwiOlwiMFwiLFwibWF4XCI6XCI5XCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzZW5nZXJzXCJ9XX0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc3Bpbm5lclwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLnBhc3NlbmdlcnMuMVwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcImxhcmdlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiQ2hpbGRyZW5cIixcIm1pblwiOlwiMFwiLFwibWF4XCI6XCI5XCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzZW5nZXJzXCJ9XX0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhpbnRcIn0sXCJmXCI6W1wiMi0xMiB5ZWFyc1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zcGlubmVyXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4yXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJJbmZhbnRzXCIsXCJtaW5cIjpcIjBcIixcIm1heFwiOlwiOVwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc2VuZ2Vyc1wifV19LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoaW50XCJ9LFwiZlwiOltcIkJlbG93IDIgeWVhcnNcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guY2FiaW5UeXBlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJDbGFzc1wiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibWV0YS5zZWxlY3RcIl0sXCJzXCI6XCJfMC5jYWJpblR5cGVzKClcIn19XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmNhYmluVHlwZVwifV19LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInB1bGwgcmlnaHRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbFwiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCIsXCJvbmNsaWNrXCI6XCIkKCcuZXh0ZW5kZWQucG9wdXAnKS5wb3B1cCgnaGlkZScpO1wifSxcImZcIjpbXCJDbG9zZVwiXX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJ3aWR0aDogYXV0bztcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwidWkgYnV0dG9uIGxhcmdlIGJsdWVcIn0sXCJmXCI6W1wiU2VhcmNoXCJdfV19XX1dfV19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyMzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eS5odG1sJyksXHJcblxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGl0aW5lcmFyeTogZnVuY3Rpb24oZmxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZsaWdodClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBmbGlnaHQuZ2V0KCdzZWdtZW50cy4wJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtzWzBdLmZyb20uYWlycG9ydENvZGUsIHNbcy5sZW5ndGgtMV0udG8uYWlycG9ydENvZGVdLmpvaW4oJy0nKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHRpbWVzOiBmdW5jdGlvbihmbGlnaHRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW2ZsaWdodHNbMF0uZGVwYXJ0X2F0LmZvcm1hdCgnRCBNTU0sIFlZWVknKSwgZmxpZ2h0c1tmbGlnaHRzLmxlbmd0aC0xXS5kZXBhcnRfYXQuZm9ybWF0KCdEIE1NTSwgWVlZWScpXS5qb2luKCctJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBtb2RpZnlTZWFyY2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5tb2RpZnlTZWFyY2goKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDIzOVxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgbW9kaWZ5LXNlYXJjaCBtdWx0aWNpdHlcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHJlbGF4ZWQgZGl2aWRlZCBob3Jpem9udGFsIGxpc3RcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJNVUxUSUNJVFkgVFJJUFwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJpdGluZXJhcnlcIixcIi4vMFwiXSxcInNcIjpcIl8wKF8xKVwifX0sXCLCoMKgXCJdLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZmxpZ2h0c1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOltcIlRJTUVcIl19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJ0aW1lc1wiLFwic2VhcmNoLmZsaWdodHNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50IHBhc3NlbmdlcnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJBRFVMVFwiXX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4wXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50IHBhc3NlbmdlcnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJDSElMRFwiXX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4xXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50IHBhc3NlbmdlcnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJJTkZBTlRcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwic2VhcmNoLnBhc3NlbmdlcnMuMlwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJmbG9hdDogcmlnaHRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJ1dHRvbiBsYXJnZSBibHVlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwibW9kaWZ5U2VhcmNoXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJNb2RpZnkgU2VhcmNoXCJdfV19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL21vZGlmeS9tdWx0aWNpdHkuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDI0MFxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9maWx0ZXIuaHRtbCcpLFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy90aGlzLm9ic2VydmUoJ2ZpbHRlcmVkJywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgLy8gICAgdGhpcy5zZXQoJ3Jlc2V0JywgdHJ1ZSkudGhlbihmdW5jdGlvbigpIHsgdGhpcy5zZXQoJ3Jlc2V0JywgZmFsc2UpOyB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAvL30sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLmFjY29yZGlvbicpKS5hY2NvcmRpb24oe2V4Y2x1c2l2ZTogZmFsc2V9KTtcclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5jaGVja2JveCcpKS5jaGVja2JveCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHByaWNlID0gJCh0aGlzLmZpbmQoJy5wcmljZS5zbGlkZXInKSkuaW9uUmFuZ2VTbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJkb3VibGVcIixcclxuICAgICAgICAgICAgICAgIGdyaWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZSA6IGZ1bmN0aW9uIChkYXRhKSB7IHZpZXcuZ2V0KCdmaWx0ZXInKS5zZXQoJ2ZpbHRlcmVkLnByaWNlcycsIFtkYXRhLmZyb20sIGRhdGEudG9dKTsgfVxyXG4gICAgICAgICAgICB9KS5kYXRhKCdpb25SYW5nZVNsaWRlcicpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy5kZXBhcnR1cmUuc2xpZGVyJykpLmlvblJhbmdlU2xpZGVyKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZG91YmxlXCIsXHJcbiAgICAgICAgICAgICAgICBtaW46ICttb21lbnQoKS5zdGFydE9mKCdkYXknKS5mb3JtYXQoXCJYXCIpLFxyXG4gICAgICAgICAgICAgICAgbWF4OiArbW9tZW50KCkuZW5kT2YoJ2RheScpLmZvcm1hdChcIlhcIiksXHJcbiAgICAgICAgICAgICAgICBwcmV0dGlmeTogZnVuY3Rpb24gKG51bSkgeyByZXR1cm4gbW9tZW50KG51bSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpOyB9LFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2UgOiBmdW5jdGlvbiAoZGF0YSkgeyB2aWV3LmdldCgnZmlsdGVyJykuc2V0KCdmaWx0ZXJlZC5kZXBhcnR1cmUnLCBbbW9tZW50KGRhdGEuZnJvbSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpLCBtb21lbnQoZGF0YS50bywgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpXSk7IH1cclxuICAgICAgICAgICAgfSkuZGF0YSgnaW9uUmFuZ2VTbGlkZXInKTtcclxuXHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLmxheW92ZXIuc2xpZGVyJykpLmlvblJhbmdlU2xpZGVyKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZG91YmxlXCIsXHJcbiAgICAgICAgICAgICAgICBtaW46ICttb21lbnQoKS5zdGFydE9mKCdkYXknKS5mb3JtYXQoXCJYXCIpLFxyXG4gICAgICAgICAgICAgICAgbWF4OiArbW9tZW50KCkuZW5kT2YoJ2RheScpLmZvcm1hdChcIlhcIiksXHJcbiAgICAgICAgICAgICAgICBwcmV0dGlmeTogZnVuY3Rpb24gKG51bSkgeyByZXR1cm4gbW9tZW50KG51bSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpOyB9LFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2UgOiBmdW5jdGlvbiAoZGF0YSkgeyB2aWV3LmdldCgnZmlsdGVyJykuc2V0KCdmaWx0ZXJlZC5sYXlvdmVyJywgW21vbWVudChkYXRhLmZyb20sIFwiWFwiKS5mb3JtYXQoXCJISDptbVwiKSwgbW9tZW50KGRhdGEudG8sIFwiWFwiKS5mb3JtYXQoXCJISDptbVwiKV0pOyB9XHJcbiAgICAgICAgICAgIH0pLmRhdGEoJ2lvblJhbmdlU2xpZGVyJyk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLmFycml2ZS5zbGlkZXInKSkuaW9uUmFuZ2VTbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJkb3VibGVcIixcclxuICAgICAgICAgICAgICAgIG1pbjogK21vbWVudCgpLnN0YXJ0T2YoJ2RheScpLmZvcm1hdChcIlhcIiksXHJcbiAgICAgICAgICAgICAgICBtYXg6ICttb21lbnQoKS5lbmRPZignZGF5JykuZm9ybWF0KFwiWFwiKSxcclxuICAgICAgICAgICAgICAgIHByZXR0aWZ5OiBmdW5jdGlvbiAobnVtKSB7IHJldHVybiBtb21lbnQobnVtLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIik7IH0sXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZSA6IGZ1bmN0aW9uIChkYXRhKSB7IHZpZXcuZ2V0KCdmaWx0ZXInKS5zZXQoJ2ZpbHRlcmVkLmFycml2YWwnLCBbbW9tZW50KGRhdGEuZnJvbSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpLCBtb21lbnQoZGF0YS50bywgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpXSk7IH1cclxuICAgICAgICAgICAgfSkuZGF0YSgnaW9uUmFuZ2VTbGlkZXInKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcuYmFja3dhcmQtYXJyaXZlLnNsaWRlcicpKS5pb25SYW5nZVNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvdWJsZVwiLFxyXG4gICAgICAgICAgICAgICAgbWluOiArbW9tZW50KCkuc3RhcnRPZignZGF5JykuZm9ybWF0KFwiWFwiKSxcclxuICAgICAgICAgICAgICAgIG1heDogK21vbWVudCgpLmVuZE9mKCdkYXknKS5mb3JtYXQoXCJYXCIpLFxyXG4gICAgICAgICAgICAgICAgcHJldHRpZnk6IGZ1bmN0aW9uIChudW0pIHsgcmV0dXJuIG1vbWVudChudW0sIFwiWFwiKS5mb3JtYXQoXCJISDptbVwiKTsgfSxcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlIDogZnVuY3Rpb24gKGRhdGEpIHsgdmlldy5nZXQoJ2ZpbHRlcicpLnNldCgnZmlsdGVyZWQuYXJyaXZhbDInLCBbbW9tZW50KGRhdGEuZnJvbSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpLCBtb21lbnQoZGF0YS50bywgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpXSk7IH1cclxuICAgICAgICAgICAgfSkuZGF0YSgnaW9uUmFuZ2VTbGlkZXInKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcuYmFja3dhcmQtZGVwYXJ0dXJlLnNsaWRlcicpKS5pb25SYW5nZVNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvdWJsZVwiLFxyXG4gICAgICAgICAgICAgICAgbWluOiArbW9tZW50KCkuc3RhcnRPZignZGF5JykuZm9ybWF0KFwiWFwiKSxcclxuICAgICAgICAgICAgICAgIG1heDogK21vbWVudCgpLmVuZE9mKCdkYXknKS5mb3JtYXQoXCJYXCIpLFxyXG4gICAgICAgICAgICAgICAgcHJldHRpZnk6IGZ1bmN0aW9uIChudW0pIHsgcmV0dXJuIG1vbWVudChudW0sIFwiWFwiKS5mb3JtYXQoXCJISDptbVwiKTsgfSxcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlIDogZnVuY3Rpb24gKGRhdGEpIHsgdmlldy5nZXQoJ2ZpbHRlcicpLnNldCgnZmlsdGVyZWQuZGVwYXJ0dXJlMicsIFttb21lbnQoZGF0YS5mcm9tLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIiksIG1vbWVudChkYXRhLnRvLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIildKTsgfVxyXG4gICAgICAgICAgICB9KS5kYXRhKCdpb25SYW5nZVNsaWRlcicpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgnZmlsdGVyLnByaWNlcycsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBwcmljZS51cGRhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbjogdmFsdWVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4OiB2YWx1ZVsxXSxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tOiB2YWx1ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0bzogdmFsdWVbMV1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sIHtpbml0OiB0cnVlfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoJ2ZpbHRlci5maWx0ZXJlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdmaWx0ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdmaWx0ZXInKS5maWx0ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpLCA1MDApO1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIG1vZGlmeVNlYXJjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yb290Lm1vZGlmeVNlYXJjaCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjYXJyaWVyczogZnVuY3Rpb24oZSwgc2hvdykge1xyXG4gICAgICAgIGUub3JpZ2luYWwuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdmaWx0ZXIuZmlsdGVyZWQuY2FycmllcnMnLCBzaG93ID8gXy5wbHVjayh0aGlzLmdldCgnZmlsdGVyLmNhcnJpZXJzJyksICdjb2RlJykgOiBbXSk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL2ZpbHRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI0MVxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlc3VsdHMtZmlsdGVyXCIsXCJzdHlsZVwiOlwid2lkdGg6MjI5cHhcIn0sXCJmXCI6W1wiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnQgd2l0aC1idXR0b25zXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIGJsdWUgZmx1aWQgYnV0dG9uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwibW9kaWZ5U2VhcmNoXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJNb2RpZnkgU2VhcmNoXCIse1widFwiOjIsXCJyXCI6XCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHN0eWxlZCBmbHVpZCBhY2NvcmRpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ0aXRsZSBcIix7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiYWN0aXZlXCJdLFwiclwiOlwicGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiZHJvcGRvd24gaWNvblwifX0sXCIgUHJpY2VcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJjb250ZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJhY3RpdmVcIl0sXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiaGlkZGVuXCIsXCJjbGFzc1wiOlwicHJpY2Ugc2xpZGVyXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJjaGVja2JveFwiLFwiY2hlY2tlZFwiOlt7XCJ0XCI6MixcInJcIjpcImZpbHRlci5maWx0ZXJlZC5yZWZ1bmRhYmxlXCJ9XX19LFwiIFNob3cgb25seSByZWZ1bmRhYmxlIGZhcmVzXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInRpdGxlIFwiLHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJhY3RpdmVcIl0sXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJkcm9wZG93biBpY29uXCJ9fSxcIiBTdG9wc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImNvbnRlbnQgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJwZW5kaW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcImFjdGl2ZVwiXSxcInJcIjpcInBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJjaGVja2JveFwiLFwibmFtZVwiOlt7XCJ0XCI6MixcInJcIjpcImZpbHRlci5maWx0ZXJlZC5zdG9wc1wifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfX0sXCLCoMKgwqBcIix7XCJ0XCI6NCxcImZcIjpbXCJOb24tc3RvcFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiLlwiXSxcInNcIjpcIjA9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9LFwiIHN0b3AocylcIl0sXCJ4XCI6e1wiclwiOltcIi5cIl0sXCJzXCI6XCIwPT1fMFwifX0sXCIgXCJdfSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9XSxcIm5cIjo1MixcInJcIjpcImZpbHRlci5zdG9wc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInRpdGxlIFwiLHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJhY3RpdmVcIl0sXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJkcm9wZG93biBpY29uXCJ9fSxcIiBBaXJsaW5lcyBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic21hbGwgcHVsbCByaWdodFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJjYXJyaWVyc1wiLFwiYVwiOntcInJcIjpbXCJldmVudFwiXSxcInNcIjpcIltfMCx0cnVlXVwifX19LFwiZlwiOltcIkFsbFwiXX0sXCIgfCBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImNhcnJpZXJzXCIsXCJhXCI6e1wiclwiOltcImV2ZW50XCJdLFwic1wiOlwiW18wLGZhbHNlXVwifX19LFwiZlwiOltcIk5vbmVcIl19XX1dLFwiblwiOjUxLFwieFwiOntcInJcIjpbXCJyZXN1bHRzLmZpbHRlclwiXSxcInNcIjpcIiFfMFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiY29udGVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiYWN0aXZlXCJdLFwiclwiOlwicGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImNoZWNrYm94XCIsXCJuYW1lXCI6W3tcInRcIjoyLFwiclwiOlwiZmlsdGVyLmZpbHRlcmVkLmNhcnJpZXJzXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiY29kZVwifV19fSxcIsKgwqDCoFwiLHtcInRcIjoyLFwiclwiOlwibmFtZVwifSxcIiBcIl19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn1dLFwiblwiOjUyLFwiclwiOlwiZmlsdGVyLmNhcnJpZXJzXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInRpdGxlIFwiLHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJhY3RpdmVcIl0sXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJkcm9wZG93biBpY29uXCJ9fSxcIiBPbndhcmQgRGVwYXJ0dXJlIFRpbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJjb250ZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJhY3RpdmVcIl0sXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiaGlkZGVuXCIsXCJjbGFzc1wiOlwiZGVwYXJ0dXJlIHNsaWRlclwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ0aXRsZSBcIix7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiYWN0aXZlXCJdLFwiclwiOlwicGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiZHJvcGRvd24gaWNvblwifX0sXCIgT253YXJkIEFycml2ZSBUaW1lXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiY29udGVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiYWN0aXZlXCJdLFwiclwiOlwicGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImhpZGRlblwiLFwiY2xhc3NcIjpcImFycml2ZSBzbGlkZXJcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widGl0bGUgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJwZW5kaW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcImFjdGl2ZVwiXSxcInJcIjpcInBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRyb3Bkb3duIGljb25cIn19LFwiIFJldHVybiBEZXBhcnR1cmUgVGltZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImNvbnRlbnQgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJwZW5kaW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcImFjdGl2ZVwiXSxcInJcIjpcInBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJoaWRkZW5cIixcImNsYXNzXCI6XCJiYWNrd2FyZC1kZXBhcnR1cmUgc2xpZGVyXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInRpdGxlIFwiLHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJhY3RpdmVcIl0sXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJkcm9wZG93biBpY29uXCJ9fSxcIiBSZXR1cm4gQXJyaXZlIFRpbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJjb250ZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJhY3RpdmVcIl0sXCJyXCI6XCJwZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiaGlkZGVuXCIsXCJjbGFzc1wiOlwiYmFja3dhcmQtYXJyaXZlIHNsaWRlclwifX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widGl0bGUgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJwZW5kaW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcImFjdGl2ZVwiXSxcInJcIjpcInBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRyb3Bkb3duIGljb25cIn19LFwiIERlcGFydHVyZSBUaW1lXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiY29udGVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiYWN0aXZlXCJdLFwiclwiOlwicGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImhpZGRlblwiLFwiY2xhc3NcIjpcImRlcGFydHVyZSBzbGlkZXJcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widGl0bGUgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJwZW5kaW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcImFjdGl2ZVwiXSxcInJcIjpcInBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRyb3Bkb3duIGljb25cIn19LFwiIEFycml2ZSBUaW1lXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiY29udGVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiYWN0aXZlXCJdLFwiclwiOlwicGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImhpZGRlblwiLFwiY2xhc3NcIjpcImFycml2ZSBzbGlkZXJcIn19XX1dfV0sXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjI9PV8wXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widGl0bGUgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJwZW5kaW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcImFjdGl2ZVwiXSxcInJcIjpcInBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRyb3Bkb3duIGljb25cIn19LFwiIExheW92ZXIgVGltZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImNvbnRlbnQgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJwZW5kaW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcImFjdGl2ZVwiXSxcInJcIjpcInBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJoaWRkZW5cIixcImNsYXNzXCI6XCJsYXlvdmVyIHNsaWRlclwifX1dfV19XX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvZmlsdGVyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyNDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQYWdlID0gcmVxdWlyZSgnY29tcG9uZW50cy9wYWdlJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFnZS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9wYWdlcy9mbGlnaHRzL2Jvb2tpbmcuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICAnYm9va2luZyc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3RcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoMCk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9wYWdlcy9mbGlnaHRzL2Jvb2tpbmcuanNcbiAqKiBtb2R1bGUgaWQgPSAyNDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiYVwiOntcInBhbmVsXCI6XCIwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJvb2tpbmdcIixcImFcIjp7XCJpZFwiOlt7XCJ0XCI6MixcInJcIjpcImlkXCJ9XX19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvYm9va2luZy5odG1sXG4gKiogbW9kdWxlIGlkID0gMjQ0XG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9sZXNzL3dlYi9tb2R1bGVzL2ZsaWdodHMubGVzc1xuICoqIG1vZHVsZSBpZCA9IDI0NVxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==