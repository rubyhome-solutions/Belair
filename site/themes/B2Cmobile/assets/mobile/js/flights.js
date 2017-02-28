webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(64);


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
/* 25 */,
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
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(8),
	    page = __webpack_require__(27)
	    ;
	
	var Meta = __webpack_require__(65),
	    SearchForm = __webpack_require__(67),
	    SearchResults =  __webpack_require__(93),
	    Booking =  __webpack_require__(127)
	    ;
	
	__webpack_require__(152);
	
	var actions = {
	    form: function(ctx, next) {
	        (new SearchForm()).render('#app').then(function() { next(); });
	    },
	    search: function(ctx, next) {
	        (new SearchResults({data: { url: ctx.params[0], force: 'force' == ctx.querystring }})).render('#app').then(function() { next(); });
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
/* 65 */,
/* 66 */,
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    moment = __webpack_require__(20)
	    ;
	
	var Page = __webpack_require__(68),
	    Search = __webpack_require__(74),
	    Meta = __webpack_require__(65)
	    ;
	
	module.exports = Page.extend({
	    template: __webpack_require__(84),
	
	    components: {
	        'search-form': __webpack_require__(85)
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
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(33),
	    Auth = __webpack_require__(69),
	    _ = __webpack_require__(35),
	    moment = __webpack_require__(20)
	    ;
	
	module.exports = Component.extend({
	    isolated: true,
	
	    partials: {
	        'base-panel': __webpack_require__(71)
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
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(8),
	    Q = __webpack_require__(30)
	    ;
	
	var Form = __webpack_require__(29)
	    ;
	
	var Auth = Form.extend({
	    template: __webpack_require__(70),
	
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
/* 70 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui login small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":4,"f":["Login"],"n":51,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}," ",{"t":4,"f":["Sign-up"],"n":50,"r":"signup"}," ",{"t":4,"f":["Reset password"],"n":50,"r":"forgottenpass"}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":8,"r":"form"}]}]}],"n":50,"r":"popup"},{"t":4,"n":51,"f":[{"t":8,"r":"form"}],"r":"popup"}],"p":{"form":[{"t":7,"e":"form","a":{"action":"javascript:;","class":[{"t":4,"f":["form"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":["ui basic segment form"],"x":{"r":["popup"],"s":"!_0"}}," ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting"}],"style":"position: relative;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":50,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Login"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"password","type":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"submit","class":["ui ",{"t":4,"f":["small"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":[],"x":{"r":["popup"],"s":"!_0"}}," fluid blue button uppercase"]},"f":["LOGIN"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;","class":"forgot-password"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"forgottenpass\",1]"}}},"f":["Forgot Password?"]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"p","f":["Don't have a CheapTicket.in Account? ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"signup\",1]"}}},"f":["Sign up for one »"]}]}]}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"signup"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"email","value":[{"t":2,"r":"user.email"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"email","value":[{"t":2,"r":"user.mobile"}],"class":"fluid","placeholder":"Mobile"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password2","value":[{"t":2,"r":"user.password2"}],"class":"fluid","placeholder":"Password again"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui fluid blue button uppercase"},"v":{"click":{"m":"signup","a":{"r":[],"s":"[]"}}},"f":["Signup"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"signupsuccess"}]}," ",{"t":4,"f":["Your registration was success.",{"t":7,"e":"br"},"You will receive email with further instructions from us how to proceed.",{"t":7,"e":"br"},"Please check your inbox and if no email from us is found, check also your SPAM folder."],"n":50,"r":"signupsuccess"}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"forgottenpass"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui fluid blue button uppercase"},"v":{"click":{"m":"resetPassword","a":{"r":[],"s":"[]"}}},"f":["RESET"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"resetsuccess"}," ",{"t":4,"f":["Instructions how to revive your password has been sent to your email.",{"t":7,"e":"br"},"Please check your email."],"n":50,"r":"resetsuccess"}]}]}]}};

/***/ },
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    Q = __webpack_require__(30),
	    $ = __webpack_require__(8),
	    moment = __webpack_require__(20)
	    ;
	
	var Store = __webpack_require__(66)
	    ;
	
	var ROUTES = __webpack_require__(75).flights;
	
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
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var FLIGHTS = '/b2c/flights';
	
	module.exports = {
	    flights: {
	        search: FLIGHTS + '/search',
	        booking: function(id) { return '/b2c/booking/' + id; },
	    },
	};
	
	//new
	var profilemeta = __webpack_require__(76),
	    bookingemeta = __webpack_require__(77),
	    travellermeta = __webpack_require__(78),
	    myProfile = __webpack_require__(79),
	    myBooking = __webpack_require__(82),
	    myTraveller = __webpack_require__(83);
	    
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
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    Q = __webpack_require__(30),
	    $ = __webpack_require__(8)
	    ;
	
	var View = __webpack_require__(66)
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
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    Q = __webpack_require__(30),
	    $ = __webpack_require__(8)
	    ;
	
	var View = __webpack_require__(66)
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
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    Q = __webpack_require__(30),
	    $ = __webpack_require__(8)
	    ;
	
	var View = __webpack_require__(66)
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
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    Q = __webpack_require__(30),
	    $ = __webpack_require__(8),
	    moment = __webpack_require__(20),
	    validate = __webpack_require__(80)
	    
	    ;
	
	var Store = __webpack_require__(66)  ;
	
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
/* 80 */
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
	
	  validate.exposeModule(validate, this, exports, module, __webpack_require__(81));
	}).call(this,
	         true ? /* istanbul ignore next */ exports : null,
	         true ? /* istanbul ignore next */ module : null,
	        __webpack_require__(81));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module)))

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	        Q = __webpack_require__(30),
	        $ = __webpack_require__(8),
	        moment = __webpack_require__(20),
	        validate = __webpack_require__(80)
	
	        ;
	
	var Store = __webpack_require__(66);
	
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
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Store = __webpack_require__(66),
	    moment = __webpack_require__(20),
	    validate = __webpack_require__(80),
	    $ = __webpack_require__(8),
	    _ = __webpack_require__(35)
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
/* 84 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"search-form","a":{"class":"basic segment","search":[{"t":2,"r":"search"}]}}]};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var page = __webpack_require__(27),
	    moment = __webpack_require__(20)
	    ;
	
	var Form = __webpack_require__(29),
	    Meta = __webpack_require__(65)
	    ;
	
	var ROUTES = __webpack_require__(75).flights;
	
	module.exports = Form.extend({
	    template: __webpack_require__(86),
	
	    components: {
	        'ui-spinner': __webpack_require__(87),
	        'ui-airport': __webpack_require__(89),
	        'ui-calendar': __webpack_require__(91)
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
	        if (true) {
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
/* 86 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"style","f":["#app .ui.dropdown.search .menu {\r\n        margin-top: 10px;\r\n    }\r\n\r\n    #app .ui.dropdown.search input.search {\r\n        text-align: left;\r\n    }\r\n\r\n    .infodateban > div {\r\n        cursor: pointer;\r\n    }\r\n\r\n    .date_info {\r\n        position: absolute;\r\n        top: 12px;\r\n        bottom: 12px;\r\n        left: 12px;\r\n        right: 12px;\r\n    }\r\n\r\n    .date_info.disabled {\r\n        cursor: default;\r\n        color: gray !important;\r\n    }"]}," ",{"t":7,"e":"header","f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"id":"m_btn","class":"main_mnu","href":"#"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/bars.png","alt":"menu"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"class":"logo","href":"javascript:;"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/logo.png","alt":"CheapTicket.in"}}]}]}]}," ",{"t":7,"e":"div","a":{"id":"m_menu","class":"ui left vertical sidebar menu push scale down overlay"},"f":[{"t":7,"e":"div","a":{"class":"avat"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"img","a":{"id":"avatar","class":"ui avatar liitle image","src":"/themes/B2C/img/mobile/avat.png"}}," ",{"t":7,"e":"div","a":{"class":"description"},"f":["WELCOME ",{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"h1","a":{"id":"name"},"f":[{"t":2,"r":"meta.user.name"}]}],"n":50,"x":{"r":["meta.user"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"h1","a":{"id":"name"},"f":["Guest User"]}],"x":{"r":["meta.user"],"s":"_0!=null"}}]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"prof"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/myprofile/"},"f":["My Profile"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"book"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["My Bookings"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"trav"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mytraveller/"},"f":["Travellers"]}]}]}," ",{"t":7,"e":"span","a":{"id":"devider","class":"item"},"f":["QUICK TOOLS"]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"print"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["Print / View Ticket"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"cancel"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["Cancelations"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"change"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["Change / Reschedule"]}]}]}," ",{"t":4,"f":[{"t":7,"e":"a","a":{"class":"ui blue fluid button","href":"/site/logout"},"f":["Logout"]}],"n":50,"r":"meta.user"}]}]}," ",{"t":7,"e":"section","f":[{"t":7,"e":"div","a":{"class":"ui secondary pointing three item demo menu tripType"},"f":[{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"1==_0"}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",1]"}}},"f":["One Way"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",2]"}}},"f":["Round Trip"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",3]"}}},"f":["Multi-City"]}]}," ",{"t":7,"e":"div","a":{"class":["ui form ",{"t":4,"f":["loading"],"n":50,"r":"search.pending"}]},"f":[{"t":4,"f":[{"t":8,"r":"multicity"}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}},{"t":4,"n":51,"f":[{"t":8,"r":"signle"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui form error"},"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"r":"errors.flight.0"}]}]}],"n":50,"r":"errors.flight.0"}],"x":{"r":["search.tripType"],"s":"3==_0"}}," ",{"t":7,"e":"div","a":{"class":"infodateban"},"f":[{"t":7,"e":"div","a":{"class":"infodateban_left"},"f":[{"t":7,"e":"div","a":{"class":"traveller"},"f":[{"t":7,"e":"p","f":[{"t":2,"x":{"r":["search.passengers.0","search.passengers.1","search.passengers.2"],"s":"_0+_1+_2"}}," ",{"t":7,"e":"span","f":["Traveller"]}]}," ",{"t":7,"e":"div","a":{"class":"thumbleft traveller"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/traveller.png"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"infodateban_right"},"f":[{"t":7,"e":"div","a":{"class":"travelClass"},"f":[{"t":7,"e":"div","a":{"class":"thumbright trClass"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/class.png"}}]}," ",{"t":7,"e":"p","f":[{"t":4,"f":["Economic"],"n":50,"x":{"r":["search.cabinType"],"s":"1==_0"}}," ",{"t":4,"f":["Premium Economic"],"n":50,"x":{"r":["search.cabinType"],"s":"2==_0"}}," ",{"t":4,"f":["Business"],"n":50,"x":{"r":["search.cabinType"],"s":"3==_0"}}," ",{"t":4,"f":["First"],"n":50,"x":{"r":["search.cabinType"],"s":"4==_0"}}," ",{"t":7,"e":"span","f":["Class"]}]}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui form error"},"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[],"n":50,"x":{"r":["i"],"s":"\"flight\"==_0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"x":{"r":["i"],"s":"\"flight\"==_0"}}],"n":52,"i":"i","r":"errors"}]}]}],"n":50,"r":"errors"}," ",{"t":7,"e":"div","a":{"id":"btn_passenger","class":"fluid huge ui blue button"},"v":{"click":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":["SEARCH FLIGHTS"]}]}]}," ",{"t":7,"e":"div","a":{"class":"travellersInfo"},"f":[{"t":7,"e":"i","a":{"class":"close icon closebtn"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Travellers"]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"description"},"f":[{"t":7,"e":"div","a":{"class":"pink_age"},"f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"id":"yrs_col_1","class":"column"},"f":["ADULT (12+ YRS) ",{"t":7,"e":"div","a":{"class":"yrs"},"f":[{"t":7,"e":"a","a":{"class":"minus","href":"javascript:;"},"v":{"click":{"m":"removeTraveler","a":{"r":[],"s":"[0]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/minus.png","alt":"min"}}]}," ",{"t":7,"e":"input","a":{"type":"text","name":"a","value":[{"t":2,"r":"search.passengers.0"}],"id":"c1"}}," ",{"t":7,"e":"a","a":{"class":"plus","href":"javascript:;"},"v":{"click":{"m":"addTraveler","a":{"r":[],"s":"[0]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/pluse.png","alt":"pluse"}}]}]}]}," ",{"t":7,"e":"div","a":{"id":"yrs_col_2","class":"column"},"f":["CHILD (2-12 YRS) ",{"t":7,"e":"div","a":{"class":"yrs"},"f":[{"t":7,"e":"a","a":{"class":"minus","href":"javascript:;"},"v":{"click":{"m":"removeTraveler","a":{"r":[],"s":"[1]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/minus.png","alt":"min"}}]}," ",{"t":7,"e":"input","a":{"type":"text","name":"a","value":[{"t":2,"r":"search.passengers.1"}],"id":"c1"}}," ",{"t":7,"e":"a","a":{"class":"plus","href":"javascript:;"},"v":{"click":{"m":"addTraveler","a":{"r":[],"s":"[1]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/pluse.png","alt":"pluse"}}]}]}]}," ",{"t":7,"e":"div","a":{"id":"yrs_col_3","class":"column"},"f":["INFANT (0-2 YRS) ",{"t":7,"e":"div","a":{"class":"yrs"},"f":[{"t":7,"e":"a","a":{"class":"minus","href":"javascript:;"},"v":{"click":{"m":"removeTraveler","a":{"r":[],"s":"[2]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/minus.png","alt":"min"}}]}," ",{"t":7,"e":"input","a":{"type":"text","name":"a","value":[{"t":2,"r":"search.passengers.2"}],"id":"c1"}}," ",{"t":7,"e":"a","a":{"class":"plus","href":"javascript:;"},"v":{"click":{"m":"addTraveler","a":{"r":[],"s":"[2]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/pluse.png","alt":"pluse"}}]}]}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":7,"e":"div","a":{"class":"ui blue button closebtn"},"f":["Done"]}]}]}," ",{"t":7,"e":"div","a":{"class":"ClassInfo"},"f":[{"t":7,"e":"i","a":{"class":"close icon closeclass"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Travel Class"]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"description"},"f":[{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.cabinType"],"s":"1==_0"}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.cabinType\",1]"}}},"f":["Economy"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.cabinType"],"s":"3==_0"}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.cabinType\",3]"}}},"f":["Business"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.cabinType"],"s":"2==_0"}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.cabinType\",2]"}}},"f":["Premium Economy"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.cabinType"],"s":"4==_0"}}]},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.cabinType\",4]"}}},"f":["First"]}]}]}]}],"p":{"multicity":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"formscreen multiCity"},"f":[{"t":7,"e":"div","a":{"class":"three fields"},"f":[{"t":7,"e":"h3","a":{"class":"text-center"},"f":["Journey ",{"t":2,"x":{"r":["i"],"s":"_0+1"}}]},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"value":[{"t":2,"r":"./from"}],"class":"fluid transparent","placeholder":"FROM","meta":[{"t":2,"r":"meta"}],"domestic":"1"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"value":[{"t":2,"r":"./to"}],"class":"fluid transparent","placeholder":"TO","domestic":"1","meta":[{"t":2,"r":"meta"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field","style":"position: relative;"},"f":[{"t":7,"e":"ui-date","a":{"input":"1","value":[{"t":2,"r":"./depart_at"}],"class":"fluid","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}]},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"delete"},"v":{"click":{"m":"removeFlight","a":{"r":["i"],"s":"[_0]"}}},"f":[" "]}],"n":50,"x":{"r":["i"],"s":"_0>1"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui form error"},"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}}]}]}],"n":50,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}},{"t":7,"e":"hr"}],"n":52,"i":"i","r":"search.flights"},{"t":7,"e":"div","a":{"class":"add-flight","style":"text-align: center;"},"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui basic button circular"},"v":{"click":{"m":"addFlight","a":{"r":[],"s":"[]"}}},"f":["+ Add new"]}]}],"signle":[{"t":7,"e":"div","a":{"class":"formscreen"},"f":[{"t":7,"e":"div","a":{"class":"dir_change"},"f":[{"t":7,"e":"div","a":{"class":"ui two column grid"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"column full-column fromAirport"},"f":[{"t":7,"e":"ui-airport","a":{"big":"1","class":"fluid left","transparent":"1","placeholder":"FROM","meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"domestic":"1"},"f":[]}]}," ",{"t":7,"e":"div","a":{"id":"fsd_r","class":"column full-column toAirport"},"f":[{"t":7,"e":"ui-airport","a":{"big":"1","class":"fluid left","transparent":"1","placeholder":"TO","meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"domestic":"1"},"f":[]}]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"ui-airport","a":{"big":"1","class":"fluid left","transparent":"1","placeholder":"FROM","meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"domestic":"0"},"f":[]}]}," ",{"t":7,"e":"div","a":{"id":"fsd_r","class":"column"},"f":[{"t":7,"e":"ui-airport","a":{"big":"1","class":"fluid left","transparent":"1","placeholder":"TO","meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"domestic":"0"},"f":[]}]}],"r":"search.domestic"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"infodateban"},"f":[{"t":7,"e":"div","a":{"class":"infodateban_left","style":"position: relative;"},"f":[{"t":7,"e":"ui-date","a":{"class":"date_depart_info","value":[{"t":2,"r":"search.flights.0.depart_at"}],"label":"DEPARTURE","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"max":[{"t":2,"x":{"r":["search.tripType","search.flights.0.return_at"],"s":"2==_0&&_1"}}]}}]}," ",{"t":7,"e":"div","a":{"class":"infodateban_right","style":"position: relative;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",2]"}}},"f":[{"t":7,"e":"ui-date","a":{"class":"date_return_info","value":[{"t":2,"r":"search.flights.0.return_at"}],"label":"RETURN","min":[{"t":2,"x":{"r":["search.flights.0.depart_at","moment"],"s":"_0||_1()"}}]}}]}]}]}};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(33),
	    $ = __webpack_require__(8),
	    _ = __webpack_require__(35)
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
	    template: __webpack_require__(88),
	
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
/* 88 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui selection input spinner dropdown in ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":7,"e":"input","a":{"type":"hidden","value":[{"t":2,"r":"value"}]}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"div","a":{"class":"text"},"f":[{"t":2,"r":"value"}]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button inc"},"v":{"click":{"m":"inc","a":{"r":[],"s":"[]"}}},"f":["+"]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button dec"},"v":{"click":{"m":"dec","a":{"r":[],"s":"[]"}}},"f":["-"]}]}]};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    $ = __webpack_require__(8)
	    ;
	
	var Component = __webpack_require__(33)
	    ;
	
	module.exports = Component.extend({
	    template: __webpack_require__(90),
	
	    data: function() {
	        return {
	            id: _.uniqueId('airport_')
	        };
	    },
	
	    onconfig: function() {
	        var view = this, meta = this.get('meta'), ap;
	
	        if (this.get('value')) {
	            if (ap = meta.get('airport')(this.get('value'))) {
	                this.set('value', ap.id);
	                this.set('city', ap.city_name);
	                this.set('code', ap.airport_code);
	            }
	
	            $.ajax({
	                type: 'GET',
	                url: '/b2c/flights/airport/' + this.get('value'),
	                dataType: 'json',
	                success: function(data) {
	                    view.set('value', data.id);
	                    view.set('code', data.text.slice(-4, -1));
	                    view.set('city', data.text.slice(0, -6));
	                }
	            })
	        }
	    },
	
	    oncomplete: function() {
	        var view = this,
	            debounce,
	            airps,
	            filtered,
	            airports = this.get('domestic') ? this.get('meta.domestic') : [],
	            query = '',
	            id = this.get('id'),
	            el = this.find('input.airport'),
	            timeout, ajax;
	
	        airps = $.map(airports, function (val, i) {
	            return {
	                text: '<div><div class="md-airport-name" data-id="' +  val.id + '">' + val.city_name + ' (' + val.airport_code + ')' + '</div></div>',
	                value: val.id,
	                city: val.city_name,
	                code: val.airport_code
	            };
	        });
	
	        filtered = airps;
	
	        $(el).mobiscroll().select({
	            buttons: [],
	            theme: 'mobiscroll',
	            display: 'top',
	            data: filtered,
	            layout: 'liquid',
	            showLabel: false,
	            height: 40,
	            rows: 3,
	            onMarkupReady: function (markup, inst) {
	                markup.addClass('md-airports');
	
	                $('<div style="padding:.5em"><input class="md-filter-input" tabindex="0" placeholder="City name or airport code" /></div>')
	                    .prependTo($('.dwcc', markup))
	                    .on('keydown', function (e) { e.stopPropagation(); })
	                    .on('keyup', function (e) {
	                        var that = $('input', this);
	                        clearTimeout(debounce);
	                        debounce = setTimeout(function () {
	                            query = that.val().toLowerCase();
	
	                            filtered = $.grep(airps, function (val) {
	                                return 0 == val.city.toLowerCase().indexOf(query) || 0 == val.code.toLowerCase().indexOf(query);
	                            });
	
	                            if (filtered.length) {
	                                inst.settings.data = filtered.length ? filtered : [{text: 'No results', value: ''}];
	                                inst.settings.parseValue(inst.settings.data[0].value);
	                                inst.refresh();
	                            } else {
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
	                                        data: { term: query },
	                                        dataType: 'json',
	                                        success: function(data) {
	                                            filtered = _.map(data, function(i) {
	                                                return {
	                                                    value: i.id,
	                                                    text: '<div><div class="md-airport-name" data-id="' +  i.id + '">' + i.label + '</div></div>'
	                                                };
	                                            });
	
	                                            inst.settings.data = filtered.length ? filtered : [{text: 'No results', value: ''}];
	                                            inst.settings.parseValue(inst.settings.data[0].value);
	                                            inst.refresh();
	                                        }
	                                    });
	                                }, 500);
	                            }
	
	
	                        }, 500);
	                    });
	            },
	            onBeforeShow: function (inst) {
	                inst.settings.data = airps;
	                inst.refresh();
	            },
	            onSelect: function (v, inst) {
	                var data = $(v).find('div').data(),
	                    label = $(v).text();
	
	                view.set('code', label.slice(-4, -1));
	                view.set('city', label.slice(0, -6));
	                view.set('value', data.id);
	
	
	                $('#' + id + '_dummy').val(label);
	            },
	            onValueTap: function (item, inst) {
	                //var data = $(v).find('div').data(),
	                //    label = $(v).text();
	                //
	                //$('#' + id + '_dummy').val(label);
	            },
	            onShow: function () {
	
	            }
	        });
	
	        this.ms = $(el).mobiscroll('getInst');
	    },
	
	    show: function() {
	        this.ms.show();
	    }
	});
	


/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"airport"},"v":{"click":{"m":"show","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"code"},"f":[{"t":2,"r":"code"}]}," ",{"t":7,"e":"div","a":{"class":"city"},"f":[{"t":2,"r":"city"}]}],"n":50,"r":"value"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"r":"value"}]}],"n":50,"r":"big"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui input medium"},"v":{"click":{"m":"show","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"input","a":{"placeholder":[{"t":2,"r":"placeholder"}],"type":"text","readonly":"readonly","value":[{"t":4,"f":[{"t":2,"r":"city"}," (",{"t":2,"r":"code"},")"],"n":50,"r":"value"}]}}]}],"r":"big"},{"t":7,"e":"div","a":{"style":"display: none;"},"f":[{"t":7,"e":"input","a":{"id":[{"t":2,"r":"id"}],"class":"airport","type":"hidden","value":[{"t":2,"r":"value"}]}}]}]};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(33),
	    _ = __webpack_require__(35),
	    moment = __webpack_require__(20),
	     $ = __webpack_require__(8)
	    ;
	
	module.exports = Component.extend({
	    isolated: true,
	    template: __webpack_require__(92),
	
	    data: function() {
	        return {
	            moment: moment,
	            worker: moment().startOf('month'),
	            value: null,
	
	            formatCalendar: function (worker, value, min, max, second) {
	                second = second || false;
	
	                if (second) {
	                    worker = worker.clone().add(1, 'month');
	                }
	
	                var shift = worker.startOf('month').weekday(),
	                    days = worker.endOf('month').date(),
	                    range = this.get('range') || [],
	                    weeks = [],
		            yearlist = []
	                    ;
	
	                var years = moment().diff(moment(), 'years');
	                var currentYear = moment().year();
	
	                for (var i = 0; i < 100; i++) {
	                    yearlist.push(currentYear - i);
	                }
	
	
	                _.each(_.range(1, days+1), function (v, k) {
	                    var m = moment([worker.year(), worker.month(), v]),
	                        _d = shift + k,
	                        w = (_d/7) >> 0,
	                        d = _d % 7,
	                        inactive = false,
	                        cls = [];
	                        ;
	
	                    if (!weeks[w]) {
	                        weeks[w] = {
	                            days: _.range(7).map(function () { return null; })
	                        };
	                    }
	
	                    if (min && m.isBefore(min, 'day')) {
	                        inactive = true;
	                    }
	
	                    if (max && m.isAfter(max, 'day')) {
	                        inactive = true;
	                    }
	
	
	                    if (inactive) cls[cls.length] = 'inactive';
	                    if (range[0] && m.isSame(range[0], 'day')) cls[cls.length] = 'range start';
	                    if (range[1] && m.isSame(range[1], 'day')) cls[cls.length] = 'range end';
	                    if (range[0] && range[1] && m.isBetween(range[0], range[1], 'day')) cls[cls.length] = 'range';
	
	
	                    //console.log(cls);
	
	                    weeks[w].days[d] = {
	                        date: v,
	                        selected: value ? m.isSame(value, 'day') : false,
	                        class: cls.join(' ')
	                    };
	
	                });
	
	                return { month: worker.month(), year: worker.year(), weeks: weeks, worker: worker,yearlist: yearlist, selectedmonth: worker.month(), selectedyear: worker.year() };
	
	            }
	
	
	        }
	    },
	
	    onconfig: function(options) {
	        this.observe('min', function(min) {
	            this.set('worker', min ? min.clone().startOf('month') : moment().startOf('month'));
	        });
	
	        this.observe('value', function(value) {
	            if (value) {
	                var v = moment(value).clone(),
	                    w = this.get('worker').clone();
	
	                try {
	                    if (this.get('twomonth')) {
	                        if (w.startOf('month').isAfter(v)) {
	                            this.set('worker', v.startOf('month'));
	                        }
	
	                        if (w.add(1, 'month').endOf('month').isBefore(v)) {
	                            this.set('worker', v.startOf('month').substract(1, 'month'));
	                        }
	
	                    } else {
	                        this.set('worker', moment(value).clone().startOf('month'));
	                    }
	                } catch (e) {
	                    this.set('worker', moment(value).clone().startOf('month'));
	                }
	
	            }
	
	
	        }, {init: true});
	    },
	
	    setValue: function(value) {
	        value = moment(value);
	        if (!value) {
	            return false;
	        }
	
	        if (this.get('max') && value.isAfter(this.get('max').endOf('day'))) {
	            return false;
	        }
	
	        if (this.get('min') && value.isBefore(this.get('min').startOf('day'))) {
	            return false;
	        }
	
	        this.set('value', moment(value));
	    },
	
	    next: function(worker) {
	        this.set('worker', worker.add(1, 'month'));
	    },
	
	    prev: function(worker) {
	        this.set('worker', worker.add(-1, 'month'));
	    },
		selectmonth: function (worker) {
	        var year = worker.year();
	        var month = $('#selectedmonth').val();
	        this.set('worker', moment([year, month]));
	    },
	    selectyear: function (worker) {       
	        var year = $('#selectedyear').val();
	        var month = worker.month();
	        this.set('worker', moment([year, month]));            
	    },
	    oncomplete: function () {
	        $(this.find('#selectedmonth')).on('change', function () {
	            return false;
	        });
	        $(this.find('#selectedyear')).on('change', function () {
	            return false;
	        });
	
	    }
		
	
	});

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui calendar ",{"t":4,"f":["twomonth relaxed"],"n":50,"r":"twomonth","s":true}," grid"]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"eight wide column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column center aligned month"},"f":[{"t":7,"e":"a","a":{"class":"left"},"v":{"click":{"m":"prev","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle left icon"}}]}," ",{"t":2,"x":{"r":["./worker"],"s":"_0.format(\"MMMM YYYY\")"}}]}," ",{"t":8,"r":"month"}],"x":{"r":["formatCalendar","worker","value","min","max"],"s":"_0(_1,_2,_3,_4,false)"}}]}," ",{"t":7,"e":"div","a":{"class":"eight wide column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column center aligned month"},"f":[{"t":7,"e":"a","a":{"class":"right"},"v":{"click":{"m":"next","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle right icon"}}]}," ",{"t":2,"x":{"r":["./worker"],"s":"_0.format(\"MMMM YYYY\")"}}]}," ",{"t":8,"r":"month"}],"x":{"r":["formatCalendar","worker","value","min","max"],"s":"_0(_1,_2,_3,_4,true)"}}]}],"n":50,"r":"twomonth"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column center aligned month"},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":"left"},"v":{"click":{"m":"prev","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle left icon"}}]}," ",{"t":7,"e":"a","a":{"class":"right"},"v":{"click":{"m":"next","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle right icon"}}]}," ",{"t":2,"x":{"r":["./worker"],"s":"_0.format(\"MMMM YYYY\")"}}],"n":50,"x":{"r":["changeyear"],"s":"_0!=\"1\""}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui input select small","style":"width:30%"},"f":[{"t":7,"e":"select","a":{"id":"selectedmonth"},"v":{"change":{"m":"selectmonth","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":4,"f":[{"t":7,"e":"option","m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["selectedmonth","i"],"s":"_0==_1"}}],"a":{"value":[{"t":2,"r":"i"}]},"f":[{"t":2,"r":"."}]}],"n":52,"i":"i","x":{"r":["moment"],"s":"_0.monthsShort()"}}]}]}," ",{"t":7,"e":"div","a":{"class":"ui input select small","style":"width:30%"},"f":[{"t":7,"e":"select","a":{"id":"selectedyear"},"v":{"change":{"m":"selectyear","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":4,"f":[{"t":7,"e":"option","m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["selectedyear","i","yearlist"],"s":"_0==_2[_1]"}}],"a":{"value":[{"t":2,"r":"."}]},"f":[{"t":2,"r":"."}]}],"n":52,"i":"i","r":"yearlist"}]}]}],"x":{"r":["changeyear"],"s":"_0!=\"1\""}}]}," ",{"t":8,"r":"month"}],"x":{"r":["formatCalendar","worker","value","min","max"],"s":"_0(_1,_2,_3,_4,false)"}}]}],"r":"twomonth"}]}],"p":{"month":[{"t":7,"e":"div","a":{"class":"ui seven column grid weekdays center aligned"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"column inactive"},"f":[{"t":2,"r":"."}]}],"n":52,"x":{"r":["moment"],"s":"_0.weekdaysShort()"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui seven column grid weekdays center aligned"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["column ",{"t":2,"r":"class"}," ",{"t":4,"f":["active"],"n":50,"r":"selected"}," ",{"t":4,"f":["inactive"],"n":50,"x":{"r":["date"],"s":"!_0"}}]},"v":{"click":{"m":"setValue","a":{"r":["year","month","date"],"s":"[[_0,_1,_2]]"}}},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":"day"},"f":[{"t":2,"r":"./date"}]}],"n":50,"r":"./date"}]}],"n":52,"r":"days"}]}],"n":52,"r":"weeks"}]}};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var page = __webpack_require__(27);
	
	var Page = __webpack_require__(68),
	    Search = __webpack_require__(74),
	    Flight = __webpack_require__(94),
	    Filter = __webpack_require__(95),
	    Meta = __webpack_require__(65)
	    ;
	
	var ROUTES = __webpack_require__(75).flights;
	
	module.exports = Page.extend({
	    template: __webpack_require__(96),
	
	    components: {
	        'results': __webpack_require__(97),
	
	        'modify-single': __webpack_require__(121),
	        'modify-multicity': __webpack_require__(123),
	
	        'filter': __webpack_require__(125),
	        'search-form': __webpack_require__(85)
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
	
	        if (true) {
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
	
	
	        if (false) {
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
	        if (true) {
	            page(ROUTES.search);
	        } else {
	            this.set('modify', null);
	            this.set('modify', Search.parse(this.get('search').toJSON()));
	        }
	
	
	    }
	});

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    $ = __webpack_require__(8),
	    moment = __webpack_require__(20),
	    Q = __webpack_require__(30)
	    ;
	
	var Store = __webpack_require__(66),
	    Search = __webpack_require__(74),
	    ROUTES = __webpack_require__(75).flights
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
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35);
	
	var Store = __webpack_require__(66),
	    Search = __webpack_require__(74)
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
/* 96 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"id":"back_btn","class":"back_page","href":"javascript:;"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/arrow_back.png","alt":"back"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"class":"logo","href":"javascript:;"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/logo.png","alt":"CheapTicket.in"}}]}]}," "]}," ",{"t":7,"e":"div","a":{"id":"m_menu","class":"ui left vertical sidebar menu push scale down overlay"},"f":[]}]}," ",{"t":4,"f":[{"t":7,"e":"section","f":[{"t":7,"e":"div","a":{"class":"loading","style":"height: 100px; position: relative; margin: 20px;"},"f":[{"t":7,"e":"div","a":{"class":"ui indicating progress active"},"f":[{"t":7,"e":"div","a":{"class":"bar","style":["background-color: #fee252; -webkit-transition-duration: 300ms; transition-duration: 300ms; width: ",{"t":2,"r":"pending"},"%;"]}}," ",{"t":7,"e":"div","a":{"class":"label"},"f":["Searching for flights"]}]}]}]}],"n":50,"r":"pending"},{"t":4,"n":51,"f":[{"t":7,"e":"results","a":{"pending":[{"t":2,"r":"pending"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"prices":[{"t":2,"r":"prices"}],"filter":[{"t":2,"r":"filter"}]}}],"r":"pending"}]};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	    _ = __webpack_require__(35),
	    moment = __webpack_require__(20)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(98),
	
	    components: {
	        'results-oneway': __webpack_require__(99),
	        'results-roundtrip': __webpack_require__(115),
	        'results-multicity': __webpack_require__(117)
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
/* 98 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"results-oneway","a":{"pending":[{"t":2,"r":"pending"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"1==_0"}},{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"results-roundtrip","a":{"pending":[{"t":2,"r":"pending"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}],"prices":[{"t":2,"r":"prices"}],"filter":[{"t":2,"r":"filter"}]}}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"results-oneway","a":{"pending":[{"t":2,"r":"pending"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"r":"search.domestic"}],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}},{"t":4,"f":[{"t":7,"e":"results-multicity","a":{"pending":[{"t":2,"r":"pending"}],"search":[{"t":2,"r":"search"}],"flights":[{"t":2,"r":"flights"}]}}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}}]};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	    _ = __webpack_require__(35),
	    moment = __webpack_require__(20),
	    page = __webpack_require__(27)
	    ;
	
	var Booking = __webpack_require__(100),
	    Meta = __webpack_require__(65)
	    ;
	
	var ROUTES = __webpack_require__(75).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(106),
	
	    components: {
	        flights: __webpack_require__(107)
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
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    Q = __webpack_require__(30),
	    $ = __webpack_require__(8),
	    page = __webpack_require__(27)
	    ;
	
	var View = __webpack_require__(101),
	    Flight = __webpack_require__(94),
	    Dialog = __webpack_require__(102),
	    Meta = __webpack_require__(65)
	    ;
	
	var money = __webpack_require__(104);
	
	
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
	
	    if (true) {
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
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(33);
	
	module.exports = Component.extend({
	
	});

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(8),
	    Q = __webpack_require__(30)
	    ;
	
	var Form = __webpack_require__(29)
	    ;
	
	var Dialog = Form.extend({
	    template: __webpack_require__(103),
	
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
/* 103 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui  small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":2,"r":"header"}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":3,"r":"message"}]}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui button"},"v":{"click":{"m":"click","a":{"r":["event","./1"],"s":"[_0,_1]"}}},"f":[{"t":2,"r":"./0"}]}],"n":52,"r":"buttons"}]}]}]};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var accounting = __webpack_require__(105)
	    ;
	
	var Meta = __webpack_require__(65)
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
/* 105 */
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
/* 106 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"section","f":[{"t":7,"e":"div","a":{"class":"search"},"f":[{"t":7,"e":"div","a":{"class":"select_date"},"f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"div","a":{"class":"ui blue button"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":["Modify"]}]}," ",{"t":7,"e":"div","a":{"class":"column center aligned"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"column right aligned"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui floating sorting dropdown icon top right pointing blue button"},"f":[{"t":7,"e":"span","a":{"class":"text"},"f":["Price"]}," ",{"t":7,"e":"div","a":{"class":"menu transition hidden","tabindex":"-1"},"f":[{"t":7,"e":"div","a":{"class":"item active selected"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"price\"]"}}},"f":["Price"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"arrive\"]"}}},"f":["Arrive"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"depart\"]"}}},"f":["Depart"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"airline\"]"}}},"f":["Airline"]}]}]}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"direction_search"},"f":[{"t":7,"e":"div","a":{"class":"mult_fromto"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).from.city"}}," → ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).to.city"}}]}," ",{"t":7,"e":"div","a":{"class":"cur_date"},"f":[{"t":7,"e":"div","a":{"class":"day_month"}}," ",{"t":7,"e":"div","a":{"class":"day_week"},"f":[{"t":7,"e":"i","a":{"class":"calendar icon"}}," ",{"t":2,"x":{"r":["search.flights.0.depart_at"],"s":"_0.format(\"D MMM\")"}}," ",{"t":2,"x":{"r":["search.flights.0.depart_at"],"s":"_0.format(\"dddd\")"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"age"},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":2,"r":"passengers.0"}," Adults, ",{"t":2,"r":"passengers.1"}," Childs, ",{"t":2,"r":"passengers.2"}," Infants"]}],"r":"search"}]}],"r":"flights.0.0"}," ",{"t":7,"e":"div","a":{"class":""},"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.0"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}],"pending":[{"t":2,"r":"pending"}]}}]}]}]}]};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    moment = __webpack_require__(20),
	    page = __webpack_require__(27)
	    ;
	
	var Form = __webpack_require__(29),
	    Meta = __webpack_require__(65),
	    ROUTES = __webpack_require__(75)
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
	    if (true) {
	        return flights;
	    }
	
	    return _.values(_.groupBy(flights, function(i) { return 'nax_' + i.get(sorton[0])  + '_' + i.get('price'); }));
	};
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(108),
	    page: 1,
	    loading: false,
	
	    components: {
	        flight: __webpack_require__(109)
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
/* 108 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"flight","a":{"selectFn":[{"t":2,"r":"selectFn"}],"small":[{"t":2,"r":"small"}],"summary":[{"t":2,"r":"summary"}],"flight":[{"t":2,"r":"."}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected"}],"onward":[{"t":2,"r":"onward"}],"backward":[{"t":2,"r":"backward"}]}}],"n":52,"r":"rendered"}]};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    moment = __webpack_require__(20)
	    ;
	
	var Form = __webpack_require__(29),
	    Booking = __webpack_require__(100),
	    Meta = __webpack_require__(65)
	    ;
	
	
	var money = __webpack_require__(104),
	    duration = __webpack_require__(110)(),
	    discount = __webpack_require__(111).discount;
	
	
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
	    template: __webpack_require__(112),
	
	    components: {
	        flight: this,
	        itinerary: __webpack_require__(113)
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
/* 110 */
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
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35)
	    ;
	
	var money = __webpack_require__(104);
	
	module.exports = {
	    duration: __webpack_require__(110)(),
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
/* 112 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["mult_info_ban fff ",{"t":4,"f":["selected"],"n":50,"x":{"r":["selected","."],"s":"_0==_1"}}]},"v":{"click":{"m":"select","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui four column grid"},"f":[{"t":7,"e":"div","a":{"class":"column flightDetail"},"f":[{"t":7,"e":"img","a":{"class":"country","src":[{"t":2,"r":"carriers.0.logo"}],"alt":"india"}}," ",{"t":7,"e":"div","a":{"class":"flight"},"f":[{"t":2,"r":"carriers.0.name"}," ",{"t":7,"e":"br"},{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).flight"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column departTime"},"f":[{"t":7,"e":"div","a":{"class":"mult_dep_time"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"HH:mm\")"}}]}," ",{"t":7,"e":"div","a":{"class":"mult_dep_date"},"f":[{"t":2,"x":{"r":["duration","first","segments.0"],"s":"_0.format(_1(_2).time)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column  arrivalTime"},"f":[{"t":7,"e":"div","a":{"class":"mult_dep_time"},"f":[{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).arrive.format(\"HH:mm\")"}}]}," ",{"t":7,"e":"div","a":{"class":"mult_dep_date"},"f":[{"t":4,"f":[{"t":4,"f":["non-stop"],"n":50,"x":{"r":["n"],"s":"0==_0"}},{"t":4,"n":51,"f":[{"t":2,"r":"n"}," stop(s)"],"x":{"r":["n"],"s":"0==_0"}}],"x":{"r":["stops","segments.0"],"s":"{n:_0(_1)}"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column flightPrice"},"f":[{"t":7,"e":"div","a":{"class":"mult_price"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}," ",{"t":3,"x":{"r":["$","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"r":"save"},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"r":"save"}],"x":{"r":["discount","onward","flight"],"s":"{save:_0([_1,_2])}"}}],"n":50,"r":"onward"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"discount"},"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}]}," ",{"t":3,"x":{"r":["$","price","save","meta.display_currency"],"s":"_0(_1-_2,_3)"}}],"n":50,"r":"save"},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"r":"save"}],"x":{"r":["discount","flight","backward"],"s":"{save:_0([_1,_2])}"}}],"n":50,"x":{"r":["backward","selected"],"s":"_0&&!_1"}},{"t":4,"n":51,"f":[{"t":3,"x":{"r":["$","price","meta.display_currency"],"s":"_0(_1,_2)"}}],"x":{"r":["backward","selected"],"s":"_0&&!_1"}}],"r":"onward"}]}]}]}]}],"r":"flight"}]};

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	    moment = __webpack_require__(20),
	    _ = __webpack_require__(35),
	
	    h_money = __webpack_require__(104)(),
	    h_duration = __webpack_require__(110)()
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(114),
	
	    data: function() {
	        return _.extend(
	            { moment: moment, money: h_money.money, duration: h_duration }
	        );
	    }
	});

/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports={"t":[],"v":3};

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    $ = __webpack_require__(8),
	    page = __webpack_require__(27)
	    ;
	
	var Form = __webpack_require__(29),
	    Booking = __webpack_require__(100),
	    Meta = __webpack_require__(65)
	    ;
	
	var ROUTES = __webpack_require__(75).flights;
	
	
	var money = __webpack_require__(104);
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(116),
	
	    components: {
	        flights: __webpack_require__(107),
	        flight: __webpack_require__(109)
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
	
	                if ((true) && 2 == this.get('selected').length) {
	                    this.book();
	                }
	            }.bind(this)
	        }, __webpack_require__(111));
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
/* 116 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"section","f":[{"t":7,"e":"div","a":{"class":"search_2"},"f":[{"t":7,"e":"div","a":{"class":"select_date"},"f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"div","a":{"class":"ui blue button"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":["Modify"]}]}," ",{"t":7,"e":"div","a":{"class":"column center aligned"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"column right aligned"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui floating sorting dropdown icon top right pointing labeled blue button"},"f":[{"t":7,"e":"span","a":{"class":"text"},"f":["Price"]}," ",{"t":7,"e":"i","a":{"class":"dropdown icon"}}," ",{"t":7,"e":"div","a":{"class":"menu transition hidden","tabindex":"-1"},"f":[{"t":7,"e":"div","a":{"class":"item active selected"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"price\"]"}}},"f":["Price"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"arrive\"]"}}},"f":["Arrive"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"depart\"]"}}},"f":["Depart"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"airline\"]"}}},"f":["Airline"]}]}]}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"direction_search"},"f":[{"t":7,"e":"div","a":{"class":"mult_fromto"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).from.city"}}," → ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).to.city"}}]}," ",{"t":7,"e":"div","a":{"class":"cur_date"},"f":[{"t":7,"e":"div","a":{"class":"day_month"}}," ",{"t":7,"e":"div","a":{"class":"day_week"},"f":[{"t":7,"e":"i","a":{"class":"calendar icon"}}," ",{"t":2,"x":{"r":["search.flights.0.depart_at"],"s":"_0.format(\"D MMM\")"}}," ",{"t":2,"x":{"r":["search.flights.0.depart_at"],"s":"_0.format(\"dddd\")"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"age"},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":2,"r":"passengers.0"}," Adults, ",{"t":2,"r":"passengers.1"}," Childs, ",{"t":2,"r":"passengers.2"}," Infants"]}],"r":"search"}]}],"r":"flights.0.0"}," ",{"t":7,"e":"div","a":{"class":""},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"sel_departure"},"f":[{"t":7,"e":"div","a":{"class":"info_ban_selected"},"f":[{"t":7,"e":"div","a":{"class":"sel_dep"},"f":[{"t":7,"e":"p","f":["Your Selected Departure"]}," ",{"t":7,"e":"i","a":{"class":"checkmark icon"}}]}," ",{"t":7,"e":"div","a":{"class":"direct_change"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).from.airportCode"}}," - ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).to.airportCode"}}," (",{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).depart.format(\"ddd, DD MMM\")"}},")"]}],"r":"selected.0"}," ",{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"selected\",[]]"}}},"f":["Change"]}]}," ",{"t":7,"e":"div","a":{"class":"info_ban"},"f":[{"t":7,"e":"flight","a":{"flight":[{"t":2,"r":"selected.0"}],"search":[{"t":2,"r":"search"}],"selected":[{"t":2,"r":"selected.0"}]}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ret_flight"},"f":[{"t":7,"e":"h3","f":["Now Select your return flight"]}," ",{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.1"}],"selected":[{"t":2,"r":"selected.1"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}],"onward":[{"t":2,"r":"selected.0"}]}}]}],"n":50,"r":"selected"},{"t":4,"n":51,"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.0"}],"selected":[{"t":2,"r":"selected.0"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}]}}],"r":"selected"}]}]}]}]};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    moment = __webpack_require__(20),
	    accounting = __webpack_require__(105),
	    page = __webpack_require__(27)
	    ;
	
	var Form = __webpack_require__(29),
	    Booking = __webpack_require__(100),
	    Meta = __webpack_require__(65)
	    ;
	
	var ROUTES = __webpack_require__(75).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(118),
	
	    components: {
	        flights: __webpack_require__(107),
	        'multicity-summary': __webpack_require__(119)
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
	
	                if ((true) && count == this.get('selected').length) {
	                    this.book();
	                }
	            }.bind(this)
	        }, __webpack_require__(111));
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
/* 118 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"section","f":[{"t":7,"e":"div","a":{"class":"multicity"},"f":[{"t":7,"e":"div","a":{"id":"tog_dir","class":"ui secondary pointing four demo item menu"},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["i","active"],"s":"_0==_1"}}]},"v":{"click":{"m":"set","a":{"r":["i"],"s":"[\"active\",_0]"}}},"f":[{"t":4,"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).from.airportCode"}}," – ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).to.airportCode"}}],"r":"./0"}]}],"n":52,"i":"i","r":"flights"}]}," ",{"t":7,"e":"div","a":{"class":"select_date"},"f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"div","a":{"class":"ui blue button"},"v":{"click":{"m":"modifySearch","a":{"r":[],"s":"[]"}}},"f":["Modify"]}]}," ",{"t":7,"e":"div","a":{"class":"column center aligned"},"f":[" ",{"t":7,"e":"div","a":{"class":"cur_date"},"f":[{"t":7,"e":"div","a":{"class":"day_month"},"f":[{"t":2,"x":{"r":["search.flights.0.depart_at"],"s":"_0.format(\"D MMM\")"}}]}," ",{"t":7,"e":"div","a":{"class":"day_week"},"f":[{"t":2,"x":{"r":["search.flights.0.depart_at"],"s":"_0.format(\"dddd\")"}}]}]}," "]}," ",{"t":7,"e":"div","a":{"class":"column right aligned"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui floating sorting dropdown icon top right pointing labeled blue button"},"f":[{"t":7,"e":"span","a":{"class":"text"},"f":["Price"]}," ",{"t":7,"e":"i","a":{"class":"dropdown icon"}}," ",{"t":7,"e":"div","a":{"class":"menu transition hidden","tabindex":"-1"},"f":[{"t":7,"e":"div","a":{"class":"item active selected"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"price\"]"}}},"f":["Price"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"arrive\"]"}}},"f":["Arrive"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"depart\"]"}}},"f":["Depart"]}," ",{"t":7,"e":"div","a":{"class":"item"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"sortOn.0\",\"airline\"]"}}},"f":["Airline"]}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"info_area"},"f":[{"t":4,"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.0"}],"selected":[{"t":2,"r":"selected.0"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}]}}],"n":50,"x":{"r":["active"],"s":"0==_0"}}," ",{"t":4,"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.1"}],"selected":[{"t":2,"r":"selected.1"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}]}}],"n":50,"x":{"r":["active"],"s":"1==_0"}}," ",{"t":4,"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.2"}],"selected":[{"t":2,"r":"selected.2"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}]}}],"n":50,"x":{"r":["active"],"s":"2==_0"}}," ",{"t":4,"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.3"}],"selected":[{"t":2,"r":"selected.3"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}]}}],"n":50,"x":{"r":["active"],"s":"3==_0"}}," ",{"t":4,"f":[{"t":7,"e":"flights","a":{"selectFn":[{"t":2,"r":"onSelect"}],"flights":[{"t":2,"r":"flights.4"}],"selected":[{"t":2,"r":"selected.4"}],"search":[{"t":2,"r":"search"}],"sortOn":[{"t":2,"r":"sortOn"}]}}],"n":50,"x":{"r":["active"],"s":"4==_0"}}]}]}]}]};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	    _ = __webpack_require__(35),
	    moment = __webpack_require__(20)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(120),
	
	    components: {
	        flights: __webpack_require__(107)
	    },
	
	    data: function() {
	        return {
	            percent: function(array) { return 100/array.length; }
	        };
	    }
	});

/***/ },
/* 120 */
/***/ function(module, exports) {

	module.exports={"t":[],"v":3};

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(30),
	    _ = __webpack_require__(35),
	    moment = __webpack_require__(20),
	    page = __webpack_require__(27)
	    ;
	
	var Form = __webpack_require__(29),
	    Search = __webpack_require__(74)
	    ;
	
	var ROUTES = __webpack_require__(75).flights;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(122),
	
	    components: {
	        'ui-spinner': __webpack_require__(87),
	        'ui-airport': __webpack_require__(89)
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
/* 122 */
/***/ function(module, exports) {

	module.exports={"t":[],"v":3};

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	    _ = __webpack_require__(35),
	    moment = __webpack_require__(20)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(124),
	
	
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
/* 124 */
/***/ function(module, exports) {

	module.exports={"t":[],"v":3};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	    moment = __webpack_require__(20),
	    _ = __webpack_require__(35)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(126),
	
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
/* 126 */
/***/ function(module, exports) {

	module.exports={"t":[],"v":3};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Page = __webpack_require__(68),
	    Meta = __webpack_require__(65)
	    ;
	
	module.exports = Page.extend({
	    template: __webpack_require__(128),
	
	    components: {
	        'booking': __webpack_require__(129)
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
/* 128 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"panel":"0"},"f":[{"t":7,"e":"booking","a":{"id":[{"t":2,"r":"id"}]}}]}]};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(30),
	    _ = __webpack_require__(35),
	    page = __webpack_require__(27),
	    $ = __webpack_require__(8)
	    ;
	
	var Form = __webpack_require__(29),
	    Booking = __webpack_require__(100),
	    Meta = __webpack_require__(65)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(130),
	
	    components: {
	        layout: __webpack_require__(72),
	        step1: __webpack_require__(131),
	        step2: __webpack_require__(136),
	        step3: __webpack_require__(143),
	        step4: __webpack_require__(150)
	    },
	
	    partials: {
	        'base-panel': __webpack_require__(71)
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
/* 130 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"id":"back_btn","class":"back_page","href":"javascript:;"},"v":{"click":{"m":"back","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/arrow_back.png","alt":"back"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"class":"logo","href":"javascript:;"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/logo.png","alt":"CheapTicket.in"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column right aligned"}}]}]}," ",{"t":7,"e":"div","a":{"class":"currencyWrap"},"f":[{"t":7,"e":"span","f":["Currency:"]}," ",{"t":7,"e":"select","a":{"class":"menu transition","style":"z-index: 1010;","id":"currency1"},"v":{"change":{"m":"setCurrencyBooking","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"option","a":{"value":"INR"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"INR\""}}],"f":[{"t":7,"e":"i","a":{"class":"inr icon currency"}}," Rupee"]}," ",{"t":7,"e":"option","a":{"value":"USD"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"USD\""}}],"f":[{"t":7,"e":"i","a":{"class":"usd icon currency"}}," US Dollar"]}," ",{"t":7,"e":"option","a":{"value":"EUR"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"EUR\""}}],"f":[{"t":7,"e":"i","a":{"class":"eur icon currency"}}," Euro"]}," ",{"t":7,"e":"option","a":{"value":"GBP"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"GBP\""}}],"f":[{"t":7,"e":"i","a":{"class":"gbp icon currency"}}," UK Pound"]}," ",{"t":7,"e":"option","a":{"value":"AUD"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"AUD\""}}],"f":[{"t":7,"e":"i","a":{"class":"usd icon currency"}}," Australian Dollar"]}," ",{"t":7,"e":"option","a":{"value":"JPY"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"JPY\""}}],"f":[{"t":7,"e":"i","a":{"class":"jpy icon currency"}}," Japanese Yen"]}," ",{"t":7,"e":"option","a":{"value":"RUB"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"RUB\""}}],"f":[{"t":7,"e":"i","a":{"class":"rub icon currency"}}," Russian Ruble"]}," ",{"t":7,"e":"option","a":{"value":"AED"},"m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["booking.currency"],"s":"_0==\"AED\""}}],"f":[{"t":7,"e":"i","a":{"class":"aed icon currency"}}," Dirham"]}]}]}," ",{"t":7,"e":"div","a":{"class":"clear"}}," ",{"t":7,"e":"step1","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step2","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step3","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"step4","a":{"booking":[{"t":2,"r":"booking"}],"meta":[{"t":2,"r":"meta"}]}}," ",{"t":7,"e":"div","a":{"id":"popup-container"},"f":[]}]};

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35)
	    ;
	
	var Form = __webpack_require__(29),
	    Auth = __webpack_require__(69)
	    ;
	
	var h_money = __webpack_require__(104),
	    h_duration = __webpack_require__(110)()
	    ;
	
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(132),
	
	    components: {
	        itinerary: __webpack_require__(113),
	        'ui-code': __webpack_require__(133),
	        'ui-email': __webpack_require__(134)
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
	
	        if ((true) && window.localStorage) {
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
/* 132 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"section","f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form confermation ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"step.submitting"}],"novalidate":0},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"title_stripe"},"f":["Review Your Itinerary"]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"direction"},"f":[{"t":7,"e":"div","a":{"class":"fromto"},"f":[{"t":2,"x":{"r":["first","segments.0"],"s":"_0(_1).from.city"}}," → ",{"t":2,"x":{"r":["last","segments.0"],"s":"_0(_1).to.city"}}," (",{"t":4,"f":["Non-stop"],"n":50,"x":{"r":["stops","segments.0"],"s":"0==_0(_1)"}},{"t":4,"n":51,"f":[{"t":2,"x":{"r":["stops","segments.0"],"s":"_0(_1)"}}," stop(s)"],"x":{"r":["stops","segments.0"],"s":"0==_0(_1)"}},")"]}," ",{"t":7,"e":"div","a":{"class":"time"},"f":[{"t":7,"e":"i","a":{"class":"history icon"}}," ",{"t":2,"x":{"r":["duration","time"],"s":"_0.format(_1)"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ItineraryReview"},"f":[{"t":7,"e":"div","a":{"class":"mult_info_ban fff"},"f":[{"t":7,"e":"div","a":{"class":"ui four column grid"},"f":[{"t":7,"e":"div","a":{"class":"column flightDetail"},"f":[{"t":7,"e":"img","a":{"class":"country","src":[{"t":2,"r":"carriers.0.logo"}]}}," ",{"t":7,"e":"div","a":{"class":"flight"},"f":[{"t":2,"r":"carriers.0.name"}," ",{"t":7,"e":"br"},{"t":2,"x":{"r":["first","."],"s":"_0(_1).flight"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column departTime"},"f":[{"t":7,"e":"div","a":{"class":"mult_dep_time"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).from.airportCode"}}," ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"HH:mm\")"}}]}," ",{"t":7,"e":"div","a":{"class":"mult_dep_date"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"MMM D\")"}},{"t":7,"e":"br"}," ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"YYYY\")"}},", ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).depart.format(\"ddd\")"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"div","a":{"class":"via_bom"},"f":[{"t":4,"f":[{"t":4,"f":["Via"],"n":50,"r":"airports"}," ",{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":4,"f":[","],"n":50,"x":{"r":["i"],"s":"0!==_0"}}," ",{"t":7,"e":"span","a":{"title":[{"t":2,"r":".airport"},", ",{"t":2,"r":".city"}]},"f":[{"t":2,"r":".airportCode"}]}],"n":52,"i":"i","r":"airports"}],"x":{"r":["via","segments.0"],"s":"{airports:_0(_1)}"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column arrivalTime"},"f":[{"t":7,"e":"div","a":{"class":"mult_dep_time"},"f":[{"t":2,"x":{"r":["last","."],"s":"_0(_1).to.airportCode"}}," ",{"t":2,"x":{"r":["last","."],"s":"_0(_1).arrive.format(\"HH:mm\")"}}]}," ",{"t":7,"e":"div","a":{"class":"mult_dep_date"},"f":[{"t":2,"x":{"r":["first","."],"s":"_0(_1).arrive.format(\"MMM D\")"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["first","."],"s":"_0(_1).arrive.format(\"YYYY\")"}},", ",{"t":2,"x":{"r":["first","."],"s":"_0(_1).arrive.format(\"ddd\")"}}]}]}]}]}]}],"n":52,"r":"segments"}],"n":52,"r":"booking.flights"},{"t":7,"e":"div","a":{"class":"price_det"},"f":["Total Price: ",{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}}]}," ",{"t":7,"e":"div","a":{"class":"contact_det"},"f":["Contact Details"]}," ",{"t":7,"e":"div","a":{"class":"ui basic segment mailid","style":"text-align: left;"},"f":[{"t":7,"e":"div","a":{"class":"right aligned column"},"f":[{"t":7,"e":"label","a":{"style":"font-size:14px!important;"},"f":["Already have an account?"]}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui button small blue"},"v":{"click":{"m":"signin","a":{"r":[],"s":"[]"}}},"f":["Sign in"]}]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field "},"f":[{"t":7,"e":"ui-email","a":{"class":"full","name":"email","placeholder":"E-mail","value":[{"t":2,"r":"booking.user.email"}],"error":[{"t":2,"r":"step.errors.email"}]}}," ",{"t":7,"e":"label","f":[{"t":7,"e":"p","f":["(Tickets will be sent to this email id)"]}]}]}]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field mobile"},"f":[{"t":7,"e":"ui-input","a":{"class":"code input","type":"tel","name":"mobile","placeholder":"Code","error":[{"t":2,"r":"step.errors.mobile"}],"value":[{"t":2,"r":"booking.user.country"}]}}," ",{"t":7,"e":"ui-input","a":{"class":"mNumber","type":"tel","name":"mobile","placeholder":"Mobile","value":[{"t":2,"r":"booking.user.mobile"}],"error":[{"t":2,"r":"step.errors.mobile"}]}}," ",{"t":7,"e":"label","f":[{"t":7,"e":"p","f":["(Your PNR will be sent to this number)"]}]}]}]}," ",{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui form error"},"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"step.errors"}]}]}],"n":50,"r":"step.errors"}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"item promoCode"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code","disabled":"disabled"},"f":[]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code"},"f":[]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"removePromoCode","a":{"r":[],"s":"[]"}}},"f":["Applied",{"t":7,"e":"i","a":{"class":"red remove circle outline icon","alt":"Remove Promo Code","title":"Remove Promo Code"}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui basic button small"},"v":{"click":{"m":"applyPromoCode","a":{"r":[],"s":"[]"}}},"f":["APPLY"]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"style":"clear:both;"},"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":{"m":"removeErrorMsg","a":{"r":[],"s":"[]"}}}}," ",{"t":2,"r":"promoerror"}]}]}],"n":50,"x":{"r":["promoerror"],"s":"_0!=null"}}]}],"n":50,"x":{"r":["booking.clientSourceId"],"s":"_0==1"}}]}]}," ",{"t":7,"e":"div","a":{"class":"contact_det"},"f":["Price Details"]}," ",{"t":7,"e":"div","a":{"class":"price_area"},"f":[{"t":7,"e":"div","a":{"class":"ui two column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"div","a":{"class":"base_price"},"f":["Base Fare"]}," ",{"t":7,"e":"div","a":{"class":"taxes_price"},"f":["Taxes & Fee"]}," ",{"t":7,"e":"div","a":{"class":"total_price"},"f":["Price"]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"div","a":{"class":"base_amount"},"f":[{"t":3,"x":{"r":["money","booking.taxes.basic_fare","booking.currency"],"s":"_0(_1,_2)"}}]}," ",{"t":7,"e":"div","a":{"class":"taxes_amount"},"f":[{"t":3,"x":{"r":["money","booking.taxes.yq","booking.taxes.jn","booking.taxes.other","booking.currency"],"s":"_0(_1+_2+_3,_4)"}}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"total_amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}}," - ",{"t":3,"x":{"r":["money","promovalue","booking.currency"],"s":"_0(_1,_2)"}}," = ",{"t":3,"x":{"r":["money","booking.price","promovalue","booking.currency"],"s":"_0(_1-_2,_3)"}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"total_amount"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}}]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}," ",{"t":7,"e":"button","a":{"id":"Totop","type":"submit","class":"fluid huge ui blue button"},"f":["CONTINUE"]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["booking.steps.1"],"s":"{step:_0}"}}]};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(33),
	    $ = __webpack_require__(8),
	    _ = __webpack_require__(35)
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
	    template:  true ? '<div class="select"></div>' : require('templates/components/form/select.html'),
	
	    data: function() {
	        return {
	            options: options
	        };
	    },
	
	    oncomplete: function() {
	        var view = this;
	
	        if (true) {
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
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mailcheck = __webpack_require__(135);
	
	var Input = __webpack_require__(34);
	
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
/* 135 */
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
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29);
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(137),
	
	    components: {
	        passenger: __webpack_require__(138)
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
/* 137 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"section","f":[{"t":7,"e":"div","a":{"class":"title_stripe"},"f":["Passenger Details"]}," ",{"t":7,"e":"div","a":{"class":"passenger"},"f":[{"t":7,"e":"form","a":{"class":["ui huge form ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"step.submitting"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"passenger-header header CountStrip"},"f":[{"t":2,"rx":{"r":"meta.travelerTypes","m":[{"t":30,"n":"type_id"}]}},"(",{"t":2,"r":"no"},")"]}," ",{"t":7,"e":"passenger","a":{"class":"basic","validation":[{"t":2,"r":"booking.passengerValidaton"}],"travelers":[{"t":2,"r":"travelers"}],"passenger":[{"t":2,"r":"."}],"errors":[{"t":2,"rx":{"r":"step.errors","m":[{"t":30,"n":"i"}]}}],"meta":[{"t":2,"r":"meta"}]}}],"n":52,"i":"i","r":"booking.passengers"}," ",{"t":7,"e":"div","a":{"id":"btn_passenger","class":"fluid huge ui blue button"},"v":{"click":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":["Continue"]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["booking.steps.2"],"s":"{step:_0}"}}]};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	 $ = __webpack_require__(8);
	 
	    ;
	var Form = __webpack_require__(29),
	    Meta = __webpack_require__(65)
	    ;
	
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(139),
	
	    components: {
	    mobileselect: __webpack_require__(140),
	    },
	
	    data: function() {
	        return {
	            _: _,
	            datesupported:true,
	            all: false,
	            date: __webpack_require__(142)(),
	
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
	      
	        if (false) {
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
	        if (true) {
	            $('.tpopup', this.el).mobiscroll('show');
	        }
	    },
	    titleselect: function() {
	        if (true) {
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
/* 139 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["ui segment passenger passengerclass ",{"t":2,"r":"class"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field","align":"center","style":"display:none"},"f":[{"t":7,"e":"a","a":{"class":"ui tiny circular button","href":"javascript:;"},"v":{"click":{"m":"travelers","a":{"r":[],"s":"[]"}}},"f":["Pick existing"]}," ",{"t":7,"e":"div","a":{"class":"hide"},"f":[{"t":7,"e":"select","a":{"class":"tpopup"},"f":[{"t":4,"f":[{"t":7,"e":"option","a":{"value":[{"t":2,"r":"id"}]},"f":[{"t":2,"r":"firstname"}," ",{"t":2,"r":"lastname"}]}],"n":52,"r":"travelers"}]}]}]}],"n":50,"r":"travelers.length"}," ",{"t":7,"e":"div","a":{"class":"name three fields"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Title *"]}," ",{"t":7,"e":"div","a":{"class":"title field"},"f":[{"t":7,"e":"mobileselect","a":{"class":"title","placeholder":"Title","options":[{"t":2,"r":"meta.titles"}],"value":[{"t":2,"r":"traveler.title_id"}],"error":[{"t":2,"r":"errors.title_id"}],"traveler":[{"t":2,"r":"traveler"}]}}]}," ",{"t":7,"e":"div","a":{"class":"first name field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["First & Middle Name *"]}," ",{"t":7,"e":"ui-input","a":{"class":"firstname","placeholder":"First & Middle Name","value":[{"t":2,"r":"traveler.firstname"}],"error":[{"t":2,"r":"errors.firstname"}]}}," ",{"t":7,"e":"div","a":{"class":"ui travelers popup vertical menu hidden","style":"max-width: none; width: 100%;"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["Pick a traveler"]},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"a","a":{"class":"item"},"v":{"click":{"m":"pickTraveler","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"user icon"}}," ",{"t":2,"r":"firstname"}," ",{"t":2,"r":"lastname"}]}],"n":52,"r":"travelers"}],"n":50,"r":"travelers.length"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"header"},"f":["New traveler?"]},{"t":7,"e":"br"}," ",{"t":7,"e":"p","f":["We will register traveler in the system for faster access."]}],"r":"travelers.length"}],"x":{"r":["search","traveler.firstname","travelers"],"s":"{travelers:_0(_1,_2)}"}}]}]}," ",{"t":7,"e":"div","a":{"class":"last name field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Last Name *"]}," ",{"t":7,"e":"ui-input","a":{"class":"lastname","placeholder":"Last Name","value":[{"t":2,"r":"traveler.lastname"}],"error":[{"t":2,"r":"errors.lastname"}]}}]}]}," ",{"t":7,"e":"div","a":{"class":"infoWrap"},"f":[{"t":7,"e":"div","a":{"class":"field","style":["display:",{"t":4,"f":[],"n":50,"x":{"r":["all","validation"],"s":"_0||\"domestic\"!=_1"}},{"t":4,"n":51,"f":["none"],"x":{"r":["all","validation"],"s":"_0||\"domestic\"!=_1"}}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Date of Birth ",{"t":4,"f":["*"],"n":50,"x":{"r":["validation"],"s":"\"domestic\"!=_0"}}]}," ",{"t":7,"e":"div","a":{"class":"passport-expiry date field"},"f":[{"t":7,"e":"input","a":{"type":"date","placeholder":"YYYY-MM-DD","id":["dob_",{"t":2,"r":"no"}],"value":"","class":"dob"},"v":{"change":{"m":"setdob","a":{"r":["."],"s":"[_0]"}}}}," ",{"t":4,"f":[{"t":7,"e":"div","f":[{"t":7,"e":"small","a":{"style":"color:#9a9a9a; font-family:arial; font-size:12px; line-height:1.2;"},"f":["Date of Birth can be changed later."]}]}],"n":50,"x":{"r":["validation"],"s":"\"domestic\"!=_0"}}]}],"n":50,"r":"datesupported"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Date of Birth (DD-MM-YYYY) ",{"t":4,"f":["*"],"n":50,"x":{"r":["validation"],"s":"\"domestic\"!=_0"}}]}," ",{"t":7,"e":"div","a":{"class":"passport-expiry date field"},"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"DD-MM-YYYY","id":["dob_",{"t":2,"r":"no"}],"value":"","class":"dob"},"v":{"blur":{"m":"setdobsimple","a":{"r":["."],"s":"[_0]"}}}}]}],"r":"datesupported"}," "]}," ",{"t":7,"e":"div","a":{"style":["display:",{"t":4,"f":[],"n":50,"x":{"r":["all","validation"],"s":"_0||\"full\"==_1"}},{"t":4,"n":51,"f":["none"],"x":{"r":["all","validation"],"s":"_0||\"full\"==_1"}}]},"f":[{"t":7,"e":"div","a":{"class":"passport two fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Passport No."]}," ",{"t":7,"e":"ui-input","a":{"class":"passport-number","placeholder":"Passport Number","value":[{"t":2,"r":"traveler.passport_number"}],"error":[{"t":2,"r":"errors.passport_number"}]}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Country"]}," ",{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"traveler.passport_country_id"}],"class":"passport-country","search":"1","placeholder":"Passport Country","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.countries()"}}],"error":[{"t":2,"r":"errors.passport_country_id"}]},"f":[]}]}]}," ",{"t":7,"e":"div","a":{"class":"label"},"f":["Passport Expiry Date"]}," ",{"t":7,"e":"div","a":{"class":"passport-expiry date field"},"f":[{"t":4,"f":[{"t":7,"e":"input","a":{"type":"date","placeholder":"Passport expiry date YYYY-MM-DD","id":["ped_",{"t":2,"r":"no"}]},"v":{"change":{"m":"setpassportexpiry","a":{"r":["."],"s":"[_0]"}}}}],"n":50,"r":"datesupported"},{"t":4,"n":51,"f":[{"t":7,"e":"input","a":{"type":"text","placeholder":"DD-MM-YYYY","id":["ped_",{"t":2,"r":"no"}]},"v":{"blur":{"m":"setpassportexpirysimple","a":{"r":["."],"s":"[_0]"}}}}],"r":"datesupported"}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"align":"right","class":"more"},"f":[{"t":7,"e":"span","a":{"style":"font-size:12px; color:#aeaeae; font-family:arial;"},"f":["Optional"]}," ",{"t":7,"e":"a","a":{"class":"ui basic tiny circular button","href":"javascript:;"},"v":{"click":{"m":"toglle","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":4,"f":["– Less"],"n":50,"r":"all"},{"t":4,"n":51,"f":["+ More"],"r":"all"}," Info"]}]}],"n":50,"x":{"r":["validation"],"s":"\"full\"!=_0"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"r":"errors"}]}],"r":"passenger"}]};

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Component = __webpack_require__(33),
	    $ = __webpack_require__(8),
	    _ = __webpack_require__(35)
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
	    template: __webpack_require__(141),
	
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
/* 141 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field","align":"center"},"f":[" ",{"t":7,"e":"div","a":{"class":"ui dropdown "},"v":{"click":{"m":"dropdownselect","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"default text tt"},"f":[{"t":2,"r":"placeholder"}]}," ",{"t":7,"e":"i","a":{"class":"dropdown icon"}}]}," ",{"t":7,"e":"div","a":{"class":"hide"},"f":[{"t":7,"e":"select","a":{"class":"popup","value":[{"t":2,"r":"value"}]},"f":[{"t":4,"f":[{"t":7,"e":"option","a":{"value":[{"t":2,"r":"id"}]},"f":[{"t":2,"r":"name"}]}],"r":"options"}]}]}]}],"n":50,"r":"options.length"}]};

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    moment = __webpack_require__(20)
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
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35),
	    $ = __webpack_require__(8)
	    ;
	__webpack_require__(144);
	var Form = __webpack_require__(29),
	
	    h_money = __webpack_require__(104),
	    h_duration = __webpack_require__(110)(),
	    h_date = __webpack_require__(142)(),
	    accounting = __webpack_require__(105)
	    ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(145),
	
	    components: {
	        'ui-cc': __webpack_require__(146),
	        'ui-cvv': __webpack_require__(148),
	        'ui-expiry': __webpack_require__(149)
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
/* 144 */
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
/* 145 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"section","f":[{"t":7,"e":"div","a":{"class":"title_stripe"},"f":["Payment Details"]}," ",{"t":7,"e":"div","a":{"style":"font-size: 18px; text-align: center; margin: 20px 0 0; font-weight: 600;"},"f":["Payable Amount: ",{"t":3,"x":{"r":["money","booking.price","booking.currency"],"s":"_0(_1,_2)"}}]}," ",{"t":7,"e":"div","a":{"class":["payment ui form ",{"t":4,"f":["error"],"n":50,"r":"step.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"step.submitting"}]},"f":[{"t":7,"e":"div","a":{"class":"ui accordion"},"f":[{"t":7,"e":"div","a":{"id":"act_title","class":["title ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"1==_0"}}]},"v":{"click":{"m":"set","a":{"r":["active"],"s":"[\"booking.payment.active\",1!=_0?1:-1]"}}},"f":["Credit Card ",{"t":7,"e":"i","a":{"class":"angle down icon"}}]}," ",{"t":7,"e":"div","a":{"id":"cont_accord","class":["content ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"1==_0"}}]},"f":[{"t":8,"r":"card"}]}," ",{"t":7,"e":"div","a":{"id":"act_title","class":["title ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"2==_0"}}]},"v":{"click":{"m":"set","a":{"r":["active"],"s":"[\"booking.payment.active\",2!=_0?2:-1]"}}},"f":["Debit Card ",{"t":7,"e":"i","a":{"class":"angle down icon"}}]}," ",{"t":7,"e":"div","a":{"id":"cont_accord","class":["content ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"2==_0"}}]},"f":[{"t":8,"r":"card"}]}," ",{"t":7,"e":"div","a":{"id":"act_title","class":["title ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"3==_0"}}]},"v":{"click":{"m":"set","a":{"r":["active"],"s":"[\"booking.payment.active\",3!=_0?3:-1]"}}},"f":["Net Banking ",{"t":7,"e":"i","a":{"class":"angle down icon"}}]}," ",{"t":7,"e":"div","a":{"id":"cont_accord","class":["content ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"3==_0"}}]},"f":[{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"bank field"},"f":[{"t":7,"e":"label","f":["Select Your Bank"]}," ",{"t":7,"e":"ui-select","a":{"class":"bank fluid","value":[{"t":2,"r":"netbanking.net_banking"}],"error":[{"t":2,"r":"step.errors.net_banking"}],"options":[{"t":2,"r":"banks"}]}}]}]}," ",{"t":8,"r":"contact"}]}]}]}]}],"n":50,"r":"step.active"}],"x":{"r":["booking.steps.3","booking.payment.cc","booking.payment.netbanking","booking.payment.active"],"s":"{step:_0,cc:_1,netbanking:_2,active:_3}"}}," "],"p":{"card":[{"t":7,"e":"form","a":{"class":["ui huge form ",{"t":4,"f":["error"],"n":50,"r":"step.errors.cc"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":4,"f":[{"t":7,"e":"label","f":["Use saved card"]}," ",{"t":7,"e":"div","a":{"class":"ui list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"setCard","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"r":"number","s":true}]}]}],"n":52,"r":"cards"}]}],"n":50,"r":"cards"}]}]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}],"n":50,"r":"cards"}," ",{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field"},"v":{"click":{"m":"resetCC","a":{"r":["event"],"s":"[_0]"}}},"f":[{"t":7,"e":"label","f":[{"t":4,"f":["Credit"],"n":50,"x":{"r":["booking.payment.active"],"s":"1==_0"}},{"t":4,"n":51,"f":["Debit"],"x":{"r":["booking.payment.active"],"s":"1==_0"}}," Card Number"]}," ",{"t":7,"e":"ui-cc","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"card-number fluid","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.number"}],"error":[{"t":2,"r":"step.errors.cc.number"}]},"v":{"click":"reset-cc"}}]}]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"label","f":["Expiry Date"]}," ",{"t":4,"f":[{"t":7,"e":"ui-expiry","a":{"class":"fluid","id":"cc-exp","disabled":[{"t":2,"r":"cc.id"}],"booking":[{"t":2,"r":"booking"}],"value":[{"t":4,"f":[{"t":2,"r":"cc.exp_month"}," / ",{"t":2,"x":{"r":["formatYear","cc.exp_year"],"s":"_0(_1)"}}],"n":50,"r":"cc.id"}],"error":[{"t":2,"r":"step.errors.cc.exp_month"}],"placeholder":"MM / YYYY"},"v":{"click":"reset-cc"}}],"n":50,"r":"cc.id"},{"t":4,"n":51,"f":[{"t":7,"e":"ui-expiry","a":{"class":"fluid","id":"cc-exp","booking":[{"t":2,"r":"booking"}],"value":"","error":[{"t":2,"r":"step.errors.cc.exp_month"}],"placeholder":"MM / YY"},"v":{"click":"reset-cc"}}],"r":"cc.id"}]}]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"label","f":["CVV"]},{"t":7,"e":"img","a":{"class":"cvv","src":"/themes/B2C/img/mobile/cvv.png","alt":"cvv"}}," ",{"t":7,"e":"ui-cvv","a":{"class":"fluid","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.cvv"}],"error":[{"t":2,"r":"step.errors.cc.cvv"}]}}]}]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field"},"v":{"click":{"m":"resetCC","a":{"r":["event"],"s":"[_0]"}}},"f":[{"t":7,"e":"label","f":[{"t":4,"f":["Credit"],"n":50,"x":{"r":["booking.payment.active"],"s":"1==_0"}},{"t":4,"n":51,"f":["Debit"],"x":{"r":["booking.payment.active"],"s":"1==_0"}}," Card Holder Name"]}," ",{"t":7,"e":"ui-input","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"card-number fluid","value":[{"t":2,"r":"cc.name"}],"error":[{"t":2,"r":"step.errors.cc.name"}]},"v":{"click":"reset-cc"}}]}]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"h4","a":{"class":"validation"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui form error"},"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"step.errors"}]}]}],"n":50,"r":"step.errors"}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"two grouped fields"},"f":[{"t":7,"e":"label","f":["Apply Promo Codes"]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code","disabled":"disabled"},"f":[]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"ui-input","a":{"name":"promocode","value":[{"t":2,"r":"promocode"}],"class":"fluid ","placeholder":"Enter Promo Code"},"f":[]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"removePromoCode","a":{"r":[],"s":"[]"}}},"f":["Applied",{"t":7,"e":"i","a":{"class":"red remove circle outline icon","alt":"Remove Promo Code","title":"Remove Promo Code"}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui basic button"},"v":{"click":{"m":"applyPromoCode","a":{"r":[],"s":"[]"}}},"f":["APPLY"]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"style":"clear:both;"},"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":{"m":"removeErrorMsg","a":{"r":[],"s":"[]"}}}}," ",{"t":2,"r":"promoerror"}]}]}],"n":50,"x":{"r":["promoerror"],"s":"_0!=null"}}]}]}],"n":50,"x":{"r":["booking.clientSourceId"],"s":"_0==1"}}]}," ",{"t":8,"r":"contact"}]}],"contact":[{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui section divider"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"agreement field"},"f":[{"t":7,"e":"label","a":{"style":"font-size:14px!important;"},"f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"accepted"}]}}," I have read and accepted the ",{"t":7,"e":"a","a":{"href":"/b2c/cms/termsAndConditions/2","target":"_blank"},"f":["Terms Of Service"]},"*"]}]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui grid"},"f":[{"t":7,"e":"div","a":{"class":"two column row"},"f":[{"t":7,"e":"div","a":{"id":"pay_amount","class":"column"},"f":["Total Amount:"]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"id":"pay_rs","class":"column right aligned"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","meta.display_currency"],"s":"_0(_1+_2,_3)"}}," - ",{"t":3,"x":{"r":["money","promovalue","meta.display_currency"],"s":"_0(_1,_2)"}}," = ",{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","promovalue","meta.display_currency"],"s":"_0(_1+_2-_3,_4)"}}]}],"n":50,"x":{"r":["promovalue"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"id":"pay_rs","class":"column right aligned"},"f":[{"t":3,"x":{"r":["money","booking.price","booking.convenienceFee","meta.display_currency"],"s":"_0(_1+_2,_3)"}}]}],"x":{"r":["promovalue"],"s":"_0!=null"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"cur_cond"},"f":["(",{"t":2,"r":"booking.currency"}," Price is indicative only. You will be charged equivalent in INR. ",{"t":7,"e":"br"}," ",{"t":3,"x":{"r":["formatPayMoney","booking.price"],"s":"_0(_1)"}},")"]}],"n":50,"x":{"r":["booking.currency"],"s":"_0!=\"INR\""}},{"t":7,"e":"br"},{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"id":"btn_payment","class":"fluid huge ui green button"},"v":{"click":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":["PAY NOW"]}],"n":50,"r":"accepted"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"id":"btn_payment","class":"fluid huge ui red button"},"f":["PAY NOW"]}],"r":"accepted"}]}};

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(144);
	
	var Input = __webpack_require__(34),
	    $ = __webpack_require__(8);
	
	module.exports = Input.extend({
	    template: __webpack_require__(147),
	
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
/* 147 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui input ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"input","a":{"type":[{"t":4,"f":["text"],"n":50,"r":"disabled"},{"t":4,"n":51,"f":["tel"],"r":"disabled"}],"name":[{"t":2,"r":"name"}],"value":[{"t":2,"r":"value"}]},"m":[{"t":4,"f":["placeholder=\"",{"t":2,"r":"placeholder"},"\""],"n":51,"r":"large"},{"t":4,"f":["disabled"],"n":50,"r":"disabled"},{"t":4,"f":["disabled=\"disabled\""],"n":50,"x":{"r":["state.disabled","state.submitting"],"s":"_0||_1"}}]}," ",{"t":4,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":["cardType ",{"t":2,"r":"cctype"}]},"f":[{"t":2,"r":"cctype"}]}]}],"n":50,"r":"cctype"},{"t":4,"n":51,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":"cardType visa"},"f":["Visa"]}," ",{"t":7,"e":"li","a":{"class":"cardType master"},"f":["Mastercard"]}," ",{"t":7,"e":"li","a":{"class":"cardType amex"},"f":["American Express"]}," ",{"t":7,"e":"li","a":{"class":"cardType diners"},"f":["Diners"]}]}],"r":"cctype"}]}]};

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(144);
	
	var Input = __webpack_require__(34),
	    $ = __webpack_require__(8);
	
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
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(144);
	
	var Input = __webpack_require__(34),
	         _ = __webpack_require__(35),
	    $ = __webpack_require__(8);
	
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
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(35)
	    ;
	
	var Form = __webpack_require__(29),
	
	    h_money = __webpack_require__(104)(),
	    h_duration = __webpack_require__(110)(),
	    h_date = __webpack_require__(142)()
	    ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(151),
	    back: function() {
	        this.get('booking').activate(3);
	    },
	        
	   });

/***/ },
/* 151 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":"ui form segment step4","style":"height: 400px; text-align: center;"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"booking-id"},"f":["Booking ID: ",{"t":2,"r":"booking.aircart_id"}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["We have received your Payment and your Booking is in process, our customer support team will contact you shortly. Or Call our customer support team for more detail."]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"booking.aircart_id"}]},"f":["View your ticket"]}],"n":50,"x":{"r":["booking","booking.aircart_status"],"s":"_0.isNew(_1)"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["Your Booking is Successful!"]}],"n":50,"x":{"r":["booking","booking.aircart_status"],"s":"_0.isBooked(_1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"message"},"f":["Your Booking is in process!"]}],"x":{"r":["booking","booking.aircart_status"],"s":"_0.isBooked(_1)"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"booking.aircart_id"}]},"f":["View your ticket"]}],"x":{"r":["booking","booking.aircart_status"],"s":"_0.isNew(_1)"}}],"n":50,"r":"step.completed"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"ui text loader"},"f":["Your booking is in progress."]}]}],"r":"step.completed"}]}],"n":50,"r":"step.active"}],"x":{"r":["booking.steps.4"],"s":"{step:_0}"}}]};

/***/ },
/* 152 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL2ZsaWdodHMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvcGFnZXMvZmxpZ2h0cy9zZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9wYWdlLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2FwcC9hdXRoLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL2ZsaWdodC9zZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3JvdXRlcy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlwcm9maWxlL21ldGEuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215Ym9va2luZ3MvbWV0YS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvbWV0YS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZS5qcyIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215Ym9va2luZ3MvbXlib29raW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvc2VhcmNoLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9mb3JtLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9mb3JtLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL3NwaW5uZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvY29tcG9uZW50cy9mbGlnaHRzL2FpcnBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYWlycG9ydC5odG1sIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jYWxlbmRhci5qcyIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NhbGVuZGFyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvcGFnZXMvZmxpZ2h0cy9yZXN1bHRzLmpzIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9mbGlnaHQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL2ZsaWdodC9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvcmVzdWx0cy5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9vbmV3YXkuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL2ZsaWdodC9ib29raW5nLmpzIiwid2VicGFjazovLy8uL2pzL2NvcmUvdmlldy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9kaWFsb2cuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9kaWFsb2cuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9oZWxwZXJzL21vbmV5LmpzIiwid2VicGFjazovLy8uL3ZlbmRvci9hY2NvdW50aW5nLmpzL2FjY291bnRpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvb25ld2F5Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL2ZsaWdodHMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0cy5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvaGVscGVycy9kdXJhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9qcy9oZWxwZXJzL2ZsaWdodHMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2l0aW5lcmFyeS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9pdGluZXJhcnkuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvcm91bmR0cmlwLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL3JvdW5kdHJpcC5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvbXVsdGljaXR5Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eS9zdW1tYXJ5LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eS9zdW1tYXJ5Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvbXVsdGljaXR5LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvbXVsdGljaXR5Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL2ZpbHRlci5odG1sIiwid2VicGFjazovLy8uL2pzL3BhZ2VzL2ZsaWdodHMvYm9va2luZy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvcGFnZXMvZmxpZ2h0cy9ib29raW5nLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXAxLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vZW1haWwuanMiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL21haWxjaGVjay9zcmMvbWFpbGNoZWNrLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXAyLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL3Bhc3Nlbmdlci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvcGFzc2VuZ2VyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL21vYmlsZXNlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL21vYmlsZXNlbGVjdC5odG1sIiwid2VicGFjazovLy8uL2pzL2hlbHBlcnMvZGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5qcyIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvanF1ZXJ5LnBheW1lbnQvbGliL2pxdWVyeS5wYXltZW50LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDMuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vY2MvbnVtYmVyLmpzIiwid2VicGFjazovLy8uL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vY2MuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vY2MvY3Z2LmpzIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jYy9jYXJkZXhwaXJ5LmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXA0LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDQuaHRtbCIsIndlYnBhY2s6Ly8vLi9sZXNzL21vYmlsZS9mbGlnaHRzLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNERBQTJELFFBQVEsRUFBRTtBQUNyRSxNQUFLO0FBQ0w7QUFDQSw2QkFBNEIsT0FBTyx5REFBeUQsbUNBQW1DLFFBQVEsRUFBRTtBQUN6SSxNQUFLO0FBQ0w7QUFDQSx1QkFBc0IsUUFBUSxxQkFBcUIsbUNBQW1DLFFBQVEsRUFBRTtBQUNoRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLFdBQVUsYUFBYTtBQUN2QixFQUFDLEU7Ozs7Ozs7O0FDbENEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBK0MseURBQXlELEVBQUU7QUFDMUc7QUFDQTtBQUNBLEVBQUMsRTs7Ozs7O0FDNUJEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTCx5QkFBd0IsbUNBQW1DLDJCQUEyQixFQUFFLEVBQUU7O0FBRTFGLHlCQUF3QixlQUFlLEVBQUU7O0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0dBQXFHLEVBQUU7QUFDdkc7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFXO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNoQyxNQUFLO0FBQ0wseUJBQXdCLEVBQUU7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QyxXQUFXO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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dmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJyksXHJcbiAgICBTZWFyY2hGb3JtID0gcmVxdWlyZSgncGFnZXMvZmxpZ2h0cy9zZWFyY2gnKSxcclxuICAgIFNlYXJjaFJlc3VsdHMgPSAgcmVxdWlyZSgncGFnZXMvZmxpZ2h0cy9yZXN1bHRzJyksXHJcbiAgICBCb29raW5nID0gIHJlcXVpcmUoJ3BhZ2VzL2ZsaWdodHMvYm9va2luZycpXHJcbiAgICA7XHJcblxyXG5yZXF1aXJlKCdtb2JpbGUvZmxpZ2h0cy5sZXNzJyk7XHJcblxyXG52YXIgYWN0aW9ucyA9IHtcclxuICAgIGZvcm06IGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xyXG4gICAgICAgIChuZXcgU2VhcmNoRm9ybSgpKS5yZW5kZXIoJyNhcHAnKS50aGVuKGZ1bmN0aW9uKCkgeyBuZXh0KCk7IH0pO1xyXG4gICAgfSxcclxuICAgIHNlYXJjaDogZnVuY3Rpb24oY3R4LCBuZXh0KSB7XHJcbiAgICAgICAgKG5ldyBTZWFyY2hSZXN1bHRzKHtkYXRhOiB7IHVybDogY3R4LnBhcmFtc1swXSwgZm9yY2U6ICdmb3JjZScgPT0gY3R4LnF1ZXJ5c3RyaW5nIH19KSkucmVuZGVyKCcjYXBwJykudGhlbihmdW5jdGlvbigpIHsgbmV4dCgpOyB9KTtcclxuICAgIH0sXHJcbiAgICBib29raW5nOiBmdW5jdGlvbihjdHgsIG5leHQpIHtcclxuICAgICAgICAobmV3IEJvb2tpbmcoeyBkYXRhOiB7IGlkOiBjdHgucGFyYW1zLmlkIH19KSkucmVuZGVyKCcjYXBwJykudGhlbihmdW5jdGlvbigpIHsgbmV4dCgpOyB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbk1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKG1ldGEpIHtcclxuICAgIHBhZ2UoJy9iMmMvYm9va2luZy86aWQnLCBhY3Rpb25zLmJvb2tpbmcpO1xyXG4gICAgcGFnZSgnL2IyYy9mbGlnaHRzJywgYWN0aW9ucy5mb3JtKTtcclxuICAgIHBhZ2UoJy9iMmMvZmxpZ2h0cy9zZWFyY2gnLCBhY3Rpb25zLmZvcm0pO1xyXG4gICAgcGFnZSgvXFwvYjJjXFwvZmxpZ2h0c1xcL3NlYXJjaFxcLyguKikvLCBhY3Rpb25zLnNlYXJjaCk7XHJcblxyXG5cclxuICAgIHBhZ2Uoe2NsaWNrOiBmYWxzZX0pO1xyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9mbGlnaHRzLmpzXG4gKiogbW9kdWxlIGlkID0gNjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxudmFyIFBhZ2UgPSByZXF1aXJlKCdjb21wb25lbnRzL3BhZ2UnKSxcclxuICAgIFNlYXJjaCA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvc2VhcmNoJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFnZS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9wYWdlcy9mbGlnaHRzL3NlYXJjaC5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICdzZWFyY2gtZm9ybSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvZm9ybScpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByZWNlbnQgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2VhcmNoZXMnKSB8fCBudWxsKSB8fCBbXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VhcmNoOiBuZXcgU2VhcmNoKCksXHJcbiAgICAgICAgICAgIG1ldGE6IE1ldGEub2JqZWN0LFxyXG4gICAgICAgICAgICBtb21lbnQ6IG1vbWVudCxcclxuICAgICAgICAgICAgcmVjZW50OiBfLm1hcChyZWNlbnQsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIG1vbWVudChpLnNlYXJjaC5mbGlnaHRzWzBdLmRlcGFydF9hdCkgPyBpIDogbnVsbDsgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9wYWdlcy9mbGlnaHRzL3NlYXJjaC5qc1xuICoqIG1vZHVsZSBpZCA9IDY3XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcclxuICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG5cclxuICAgIHBhcnRpYWxzOiB7XHJcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcclxuICAgIH0sXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIGxheW91dDogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvbGF5b3V0JylcclxuICAgIH0sXHJcblxyXG4gICAgc2lnbmluOiBmdW5jdGlvbigpIHsgQXV0aC5sb2dpbigpLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkgfSk7IH0sXHJcblxyXG4gICAgc2lnbnVwOiBmdW5jdGlvbigpIHsgQXV0aC5zaWdudXAoKTsgfSxcclxuXHJcbiAgICBsZWZ0TWVudTogZnVuY3Rpb24oKSB7IHRoaXMudG9nZ2xlKCdsZWZ0bWVudScpOyB9LFxyXG4gICAgXHJcbiAgICBzd2FwU2VhcmNoOiBmdW5jdGlvbihzZWFyY2gpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgc2VhcmNoID0gXy5jbG9uZURlZXAoc2VhcmNoKTtcclxuICAgICAgICBfLmVhY2goc2VhcmNoLmZsaWdodHMsIGZ1bmN0aW9uKGksIGspIHtcclxuICAgICAgICAgICAgaS5kZXBhcnRfYXQgPSBtb21lbnQoaS5kZXBhcnRfYXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGkucmV0dXJuX2F0KSB7XHJcbiAgICAgICAgICAgICAgICBpLnJldHVybl9hdCA9IG1vbWVudChpLnJldHVybl9hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2VhcmNoLnNhdmVkID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZ2V0KCdzZWFyY2gnKS5zZXQoc2VhcmNoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2aWV3LnNldCgnc2VhcmNoLnNhdmVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvcGFnZS5qc1xuICoqIG1vZHVsZSBpZCA9IDY4XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKVxyXG4gICAgO1xyXG5cclxudmFyIEF1dGggPSBGb3JtLmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9hdXRoLmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdsb2dpbicsXHJcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBmb3Jnb3R0ZW5wYXNzOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldCgncG9wdXAnKSkge1xyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC8nICsgdGhpcy5nZXQoJ2FjdGlvbicpLFxyXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB0aGlzLmdldCgndXNlci5sb2dpbicpLCBwYXNzd29yZDogdGhpcy5nZXQoJ3VzZXIucGFzc3dvcmQnKSB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2aWV3LmRlZmVycmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5kZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCdwb3B1cCcpPT1udWxsICYmIGRhdGEgJiYgZGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvZm9yZ290dGVucGFzcycsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgZW1haWw6IHRoaXMuZ2V0KCd1c2VyLmxvZ2luJykgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdyZXNldHN1Y2Nlc3MnLCB0cnVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNpZ251cDogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCBudWxsKTtcclxuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL3NpZ251cCcsXHJcbiAgICAgICAgICAgIGRhdGE6IF8ucGljayh0aGlzLmdldCgndXNlcicpLCBbJ2VtYWlsJywnbmFtZScsICdtb2JpbGUnLCAncGFzc3dvcmQnLCAncGFzc3dvcmQyJ10pLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3NpZ251cHN1Y2Nlc3MnLCB0cnVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbkF1dGgubG9naW4gPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcclxuXHJcbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcclxuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XHJcbn07XHJcblxyXG5BdXRoLnNpZ251cCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aCgpO1xyXG5cclxuICAgIGF1dGguc2V0KCdwb3B1cCcsIHRydWUpO1xyXG4gICAgYXV0aC5zZXQoJ3NpZ251cCcsIHRydWUpO1xyXG4gICAgYXV0aC5kZWZlcnJlZCA9IFEuZGVmZXIoKTtcclxuICAgIGF1dGgucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XHJcblxyXG4gICAgcmV0dXJuIGF1dGguZGVmZXJyZWQucHJvbWlzZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXV0aDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9hcHAvYXV0aC5qc1xuICoqIG1vZHVsZSBpZCA9IDY5XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDZcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGxvZ2luIHNtYWxsIG1vZGFsXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJMb2dpblwiXSxcIm5cIjo1MSxcInhcIjp7XCJyXCI6W1wiZm9yZ290dGVucGFzc1wiLFwic2lnbnVwXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJTaWduLXVwXCJdLFwiblwiOjUwLFwiclwiOlwic2lnbnVwXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlJlc2V0IHBhc3N3b3JkXCJdLFwiblwiOjUwLFwiclwiOlwiZm9yZ290dGVucGFzc1wifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo4LFwiclwiOlwiZm9ybVwifV19XX1dLFwiblwiOjUwLFwiclwiOlwicG9wdXBcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo4LFwiclwiOlwiZm9ybVwifV0sXCJyXCI6XCJwb3B1cFwifV0sXCJwXCI6e1wiZm9ybVwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpbe1widFwiOjQsXCJmXCI6W1wiZm9ybVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicG9wdXBcIl0sXCJzXCI6XCIhXzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcInVpIGJhc2ljIHNlZ21lbnQgZm9ybVwiXSxcInhcIjp7XCJyXCI6W1wicG9wdXBcIl0sXCJzXCI6XCIhXzBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImVycm9yXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3VibWl0dGluZ1wifV0sXCJzdHlsZVwiOlwicG9zaXRpb246IHJlbGF0aXZlO1wifSxcInZcIjp7XCJzdWJtaXRcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgYmFzaWMgc2VnbWVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJoaWRlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJmb3Jnb3R0ZW5wYXNzXCIsXCJzaWdudXBcIl0sXCJzXCI6XCJfMHx8XzFcIn19XSxcInN0eWxlXCI6XCJtYXgtd2lkdGg6IDMwMHB4OyBtYXJnaW46IGF1dG87IHRleHQtYWxpZ246IGxlZnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibG9naW5cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5sb2dpblwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJMb2dpblwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInBhc3N3b3JkXCIsXCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLnBhc3N3b3JkXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3N3b3JkXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOltcInVpIFwiLHtcInRcIjo0LFwiZlwiOltcInNtYWxsXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W10sXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSxcIiBmbHVpZCBibHVlIGJ1dHRvbiB1cHBlcmNhc2VcIl19LFwiZlwiOltcIkxPR0lOXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpcImZvcmdvdC1wYXNzd29yZFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiZm9yZ290dGVucGFzc1xcXCIsMV1cIn19fSxcImZcIjpbXCJGb3Jnb3QgUGFzc3dvcmQ/XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W1wiRG9uJ3QgaGF2ZSBhIENoZWFwVGlja2V0LmluIEFjY291bnQ/IFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzaWdudXBcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiU2lnbiB1cCBmb3Igb25lIMK7XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcInNpZ251cFwifV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmVtYWlsXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwiZW1haWxcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5tb2JpbGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9iaWxlXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwicGFzc3dvcmRcIixcIm5hbWVcIjpcInBhc3N3b3JkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIucGFzc3dvcmRcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmRcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwibmFtZVwiOlwicGFzc3dvcmQyXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIucGFzc3dvcmQyXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3N3b3JkIGFnYWluXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOlwidWkgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2lnbnVwXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJTaWdudXBcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yTXNnXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2dcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19XSxcIm5cIjo1MSxcInJcIjpcInNpZ251cHN1Y2Nlc3NcIn1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJZb3VyIHJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzcy5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiWW91IHdpbGwgcmVjZWl2ZSBlbWFpbCB3aXRoIGZ1cnRoZXIgaW5zdHJ1Y3Rpb25zIGZyb20gdXMgaG93IHRvIHByb2NlZWQuXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIlBsZWFzZSBjaGVjayB5b3VyIGluYm94IGFuZCBpZiBubyBlbWFpbCBmcm9tIHVzIGlzIGZvdW5kLCBjaGVjayBhbHNvIHlvdXIgU1BBTSBmb2xkZXIuXCJdLFwiblwiOjUwLFwiclwiOlwic2lnbnVwc3VjY2Vzc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgYmFzaWMgc2VnbWVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJoaWRlXCJdLFwiblwiOjUxLFwiclwiOlwiZm9yZ290dGVucGFzc1wifV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsb2dpblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmxvZ2luXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOlwidWkgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVzZXRQYXNzd29yZFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiUkVTRVRcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yTXNnXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2dcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19XSxcIm5cIjo1MSxcInJcIjpcInJlc2V0c3VjY2Vzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJJbnN0cnVjdGlvbnMgaG93IHRvIHJldml2ZSB5b3VyIHBhc3N3b3JkIGhhcyBiZWVuIHNlbnQgdG8geW91ciBlbWFpbC5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwuXCJdLFwiblwiOjUwLFwiclwiOlwicmVzZXRzdWNjZXNzXCJ9XX1dfV19fTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2FwcC9hdXRoLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA3MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA2XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG52YXIgU2VhcmNoID0gU3RvcmUuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRvbWVzdGljOiAxLFxyXG4gICAgICAgICAgICB0cmlwVHlwZTogU2VhcmNoLk9ORVdBWSxcclxuICAgICAgICAgICAgY2FiaW5UeXBlOiBTZWFyY2guRUNPTk9NWSxcclxuICAgICAgICAgICAgZmxpZ2h0czogWyB7IGZyb206IFNlYXJjaC5ERUwsIHRvOiBTZWFyY2guQk9NLCBkZXBhcnRfYXQ6IG1vbWVudCgpLmFkZCgxLCAnZGF5JyksIHJldHVybl9hdDogbnVsbCB9IF0sXHJcblxyXG4gICAgICAgICAgICBwYXNzZW5nZXJzOiBbMSwgMCwgMF0sXHJcblxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnZG9tZXN0aWMnLCBmdW5jdGlvbihkb21lc3RpYykge1xyXG4gICAgICAgICAgICBpZiAoIWRvbWVzdGljICYmIFNlYXJjaC5NVUxUSUNJVFkgPT0gdGhpcy5nZXQoJ3RyaXBUeXBlJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCd0cmlwVHlwZScsIFNlYXJjaC5PTkVXQVkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9tZXN0aWMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzJywgW3sgZnJvbTogU2VhcmNoLkRFTCwgdG86IFNlYXJjaC5CT00sIGRlcGFydF9hdDogbW9tZW50KCkuYWRkKDEsICdkYXknKSB9XSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIFt7IGZyb206IG51bGwsIHRvOiBudWxsLCBkZXBhcnRfYXQ6IG1vbWVudCgpLmFkZCgxLCAnZGF5JykgfV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHsgaW5pdDogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndHJpcFR5cGUnLCBmdW5jdGlvbih2YWx1ZSwgb2xkKSB7XHJcbiAgICAgICAgICAgIGlmIChTZWFyY2guTVVMVElDSVRZID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGljZSgnZmxpZ2h0cycsIDEsIDAsIHsgZnJvbTogbnVsbCwgdG86IG51bGwsIGRlcGFydF9hdDogbnVsbCB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFNlYXJjaC5NVUxUSUNJVFkgPT0gb2xkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIFt0aGlzLmdldCgnZmxpZ2h0cy4wJyldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFNlYXJjaC5ST1VORFRSSVAgPT0gb2xkKSAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2ZsaWdodHMuMC5yZXR1cm5fYXQnLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7IGluaXQ6IGZhbHNlIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmVGbGlnaHQ6IGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICB0aGlzLnNwbGljZSgnZmxpZ2h0cycsIGksIDEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRGbGlnaHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucHVzaCgnZmxpZ2h0cycsIHt9KTtcclxuICAgIH0sXHJcblxyXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZm9ybSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNzOiB0aGlzLmdldCgnY3MnKSxcclxuICAgICAgICAgICAgZG9tZXN0aWM6IHRoaXMuZ2V0KCdkb21lc3RpYycpLFxyXG4gICAgICAgICAgICB0cmlwVHlwZTogdGhpcy5nZXQoJ3RyaXBUeXBlJyksXHJcbiAgICAgICAgICAgIGNhYmluVHlwZTogdGhpcy5nZXQoJ2NhYmluVHlwZScpLFxyXG4gICAgICAgICAgICBwYXNzZW5nZXJzOiB0aGlzLmdldCgncGFzc2VuZ2VycycpLFxyXG5cclxuICAgICAgICAgICAgZmxpZ2h0czogXy5tYXAodGhpcy5nZXQoJ2ZsaWdodHMnKSwgZnVuY3Rpb24oZmxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IGZsaWdodC5mcm9tLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiBmbGlnaHQudG8sXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0X2F0OiBtb21lbnQuaXNNb21lbnQoZmxpZ2h0LmRlcGFydF9hdCkgPyBmbGlnaHQuZGVwYXJ0X2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5fYXQ6IDIgPT0gZm9ybS5nZXQoJ3RyaXBUeXBlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAobW9tZW50LmlzTW9tZW50KGZsaWdodC5yZXR1cm5fYXQpID8gZmxpZ2h0LnJldHVybl9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuXHJcblNlYXJjaC5NVUxUSUNJVFkgPSAzO1xyXG5TZWFyY2guUk9VTkRUUklQID0gMjtcclxuU2VhcmNoLk9ORVdBWSA9IDE7XHJcblxyXG5TZWFyY2guREVMID0gMTIzNjtcclxuU2VhcmNoLkJPTSA9IDk0NjtcclxuXHJcblNlYXJjaC5FQ09OT01ZID0gMTtcclxuU2VhcmNoLlBFUk1JVU1fRUNPTk9NWSA9IDI7XHJcblNlYXJjaC5CVVNJTkVTUyA9IDM7XHJcblNlYXJjaC5GSVJTVCA9IDQ7XHJcblxyXG5TZWFyY2guTUFYX1dBSVRfVElNRSA9IDYwMDAwO1xyXG5TZWFyY2guSU5URVJWQUwgPSA1MDAwO1xyXG5cclxuU2VhcmNoLmxvYWQgPSBmdW5jdGlvbih1cmwsIGZvcmNlLCBjcykge1xyXG4gICAgY3MgPSBjcyB8fCBudWxsO1xyXG5cclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogUk9VVEVTLnNlYXJjaCxcclxuICAgICAgICAgICAgZGF0YTogeyBxdWVyeTogdXJsLCBmb3JjZTogZm9yY2UgfHwgMCwgY3M6IGNzIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgcmVzb2x2ZShTZWFyY2gucGFyc2UoZGF0YSkpOyB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU2VhcmNoLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgZGF0YS5mbGlnaHRzID0gXy5tYXAoZGF0YS5mbGlnaHRzLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgaS5kZXBhcnRfYXQgPSBtb21lbnQoaS5kZXBhcnRfYXQpO1xyXG4gICAgICAgIGkucmV0dXJuX2F0ID0gaS5yZXR1cm5fYXQgJiYgbW9tZW50KGkucmV0dXJuX2F0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgc2VhcmNoID0gbmV3IFNlYXJjaCh7ZGF0YTogZGF0YX0pO1xyXG5cclxuXHJcbiAgICByZXR1cm4gc2VhcmNoO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvZmxpZ2h0L3NlYXJjaC5qc1xuICoqIG1vZHVsZSBpZCA9IDc0XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJ2YXIgRkxJR0hUUyA9ICcvYjJjL2ZsaWdodHMnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBmbGlnaHRzOiB7XHJcbiAgICAgICAgc2VhcmNoOiBGTElHSFRTICsgJy9zZWFyY2gnLFxyXG4gICAgICAgIGJvb2tpbmc6IGZ1bmN0aW9uKGlkKSB7IHJldHVybiAnL2IyYy9ib29raW5nLycgKyBpZDsgfSxcclxuICAgIH0sXHJcbn07XHJcblxyXG4vL25ld1xyXG52YXIgcHJvZmlsZW1ldGEgPSByZXF1aXJlKCdzdG9yZXMvbXlwcm9maWxlL21ldGEnKSxcclxuICAgIGJvb2tpbmdlbWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL21ldGEnKSxcclxuICAgIHRyYXZlbGxlcm1ldGEgPSByZXF1aXJlKCdzdG9yZXMvbXl0cmF2ZWxsZXIvbWV0YScpLFxyXG4gICAgbXlQcm9maWxlID0gcmVxdWlyZSgnc3RvcmVzL215cHJvZmlsZS9teXByb2ZpbGUnKSxcclxuICAgIG15Qm9va2luZyA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MnKSxcclxuICAgIG15VHJhdmVsbGVyID0gcmVxdWlyZSgnc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJyk7XHJcbiAgICBcclxudmFyIGFjdGlvbnMgPSB7XHJcbiAgICBwcm9maWxlOiBmdW5jdGlvbihjdHgsIG5leHQpIHtcclxuICAgICAgICAobmV3IG15UHJvZmlsZSgpKS5yZW5kZXIoJyNhcHAnKS50aGVuKGZ1bmN0aW9uKCkgeyBuZXh0KCk7IH0pO1xyXG4gICAgfSxcclxuICAgIGJvb2tpbmc6IGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xyXG4gICAgICAgIChuZXcgbXlCb29raW5nKCkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XHJcbiAgICB9LFxyXG4gICAgdHJhdmVsbGVyOiBmdW5jdGlvbihjdHgsIG5leHQpIHtcclxuICAgICAgICAobmV3IG15VHJhdmVsbGVyKCkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XHJcbiAgICB9LFxyXG59O1xyXG5cclxucHJvZmlsZW1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKG1ldGEpIHtcclxuICAgIHBhZ2UoJy9iMmMvdXNlcnMvbXlwcm9maWxlLycsIGFjdGlvbnMucHJvZmlsZSk7XHJcbiAgICAgcGFnZSh7Y2xpY2s6IGZhbHNlfSk7XHJcbn0pO1xyXG5cclxuYm9va2luZ2VtZXRhLmluc3RhbmNlKCkudGhlbihmdW5jdGlvbihtZXRhKSB7XHJcbiAgICBwYWdlKCcvYjJjL3VzZXJzL215Ym9va2luZ3MvJywgYWN0aW9ucy5ib29raW5nKTtcclxuICAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcclxufSk7XHJcblxyXG50cmF2ZWxsZXJtZXRhLmluc3RhbmNlKCkudGhlbihmdW5jdGlvbihtZXRhKSB7XHJcbiAgICBwYWdlKCcvYjJjL3VzZXJzL215dHJhdmVsbGVyLycsIGFjdGlvbnMudHJhdmVsbGVyKTtcclxuICAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9yb3V0ZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA3NVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnY29yZS9zdG9yZScpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IFZpZXcuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZXM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5tYXAodmlldy5nZXQoJ3RpdGxlcycpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBpLmlkLCB0ZXh0OiBpLm5hbWUgfTsgfSk7IH0sXHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuTWV0YS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHJldHVybiBuZXcgTWV0YSh7ZGF0YTogZGF0YX0pO1xyXG59O1xyXG5cclxuTWV0YS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvdXNlcnMvbWV0YScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgcmVzb2x2ZShNZXRhLnBhcnNlKGRhdGEpKTsgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbnZhciBpbnN0YW5jZSA9IG51bGw7XHJcbk1ldGEuaW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0YW5jZSA9IE1ldGEuZmV0Y2goKTtcclxuICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL215cHJvZmlsZS9tZXRhLmpzXG4gKiogbW9kdWxlIGlkID0gNzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA0XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnY29yZS9zdG9yZScpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IFZpZXcuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZXM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5tYXAodmlldy5nZXQoJ3RpdGxlcycpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBpLmlkLCB0ZXh0OiBpLm5hbWUgfTsgfSk7IH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuTWV0YS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHJldHVybiBuZXcgTWV0YSh7ZGF0YTogZGF0YX0pO1xyXG59O1xyXG5cclxuTWV0YS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvYWlyQ2FydC9tZXRhJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyByZXNvbHZlKE1ldGEucGFyc2UoZGF0YSkpOyB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxudmFyIGluc3RhbmNlID0gbnVsbDtcclxuTWV0YS5pbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlID0gTWV0YS5mZXRjaCgpO1xyXG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlib29raW5ncy9tZXRhLmpzXG4gKiogbW9kdWxlIGlkID0gNzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIFZpZXcgPSByZXF1aXJlKCdjb3JlL3N0b3JlJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gVmlldy5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk1ldGEucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gbmV3IE1ldGEoe2RhdGE6IGRhdGF9KTtcclxufTtcclxuXHJcbk1ldGEuZmV0Y2ggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL3RyYXZlbGVyL21ldGEnKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoTWV0YS5wYXJzZShkYXRhKSk7IH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG52YXIgaW5zdGFuY2UgPSBudWxsO1xyXG5NZXRhLmluc3RhbmNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdGFuY2UgPSBNZXRhLmZldGNoKCk7XHJcbiAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9tZXRhLmpzXG4gKiogbW9kdWxlIGlkID0gNzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxyXG4gICAgXHJcbiAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJykgIDtcclxuXHJcbnZhciBNeXByb2ZpbGUgPSBTdG9yZS5leHRlbmQoe1xyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICBwcmljZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldFN0YXRlTGlzdDogZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0U3RhdGVMaXN0XCIpO1xyXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iMmMvdXNlcnMvZ2V0U3RhdGVMaXN0LycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5jb3VudHJ5Y29kZScpKSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0YXRlbGlzdCcsbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0YXRlbGlzdCcsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCB2aWV3LmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcudXBkYXRlKCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZpbnNpaGVkIHN0b3JlOiAnKTtcclxuICAgICAgICAgICAgdmFyIHRlbXA9dmlldy5nZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpO1xyXG4gICAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgbnVsbCk7XHJcbiAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgdGVtcCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2l0eUxpc3Q6IGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImdldENpdHlMaXN0XCIpO1xyXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iMmMvdXNlcnMvZ2V0Q2l0eUxpc3QvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpKSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NpdHlsaXN0JyxudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uY2l0eWNvZGUnLCB2aWV3LmdldCgncHJvZmlsZWZvcm0uY2l0eWNvZGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICQoJyNkaXZjaXR5IC51aS5kcm9wZG93bicpLmRyb3Bkb3duKCdzZXQgc2VsZWN0ZWQnLCAkKCcjZGl2Y2l0eSAuaXRlbS5hY3RpdmUuc2VsZWN0ZWQnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbk15cHJvZmlsZS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpOyAgXHJcbiAgICAgICAgICAgZGF0YS5iYXNlVXJsPScnO1xyXG4gICAgICAgICAgICBkYXRhLmFkZD1mYWxzZTtcclxuICAgICAgICAgICAgZGF0YS5lZGl0PWZhbHNlOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRhdGEucGVuZGluZz0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgcmV0dXJuIG5ldyBNeXByb2ZpbGUoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcbk15cHJvZmlsZS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvdXNlcnMvZ2V0UHJvZmlsZScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgIHJlc29sdmUoTXlwcm9maWxlLnBhcnNlKGRhdGEpKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWRcIik7XHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTXlwcm9maWxlO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDc5XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgNFxuICoqLyIsIi8vICAgICBWYWxpZGF0ZS5qcyAwLjcuMVxuXG4vLyAgICAgKGMpIDIwMTMtMjAxNSBOaWNrbGFzIEFuc21hbiwgMjAxMyBXcmFwcFxuLy8gICAgIFZhbGlkYXRlLmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLy8gICAgIEZvciBhbGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbi8vICAgICBodHRwOi8vdmFsaWRhdGVqcy5vcmcvXG5cbihmdW5jdGlvbihleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUaGUgbWFpbiBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMuXG4gIC8vIFRoZSBvcHRpb25zIGFyZSB0aGUgZm9sbG93aW5nOlxuICAvLyAgIC0gZm9ybWF0IChzdHJpbmcpIC0gQW4gb3B0aW9uIHRoYXQgY29udHJvbHMgaG93IHRoZSByZXR1cm5lZCB2YWx1ZSBpcyBmb3JtYXR0ZWRcbiAgLy8gICAgICogZmxhdCAtIFJldHVybnMgYSBmbGF0IGFycmF5IG9mIGp1c3QgdGhlIGVycm9yIG1lc3NhZ2VzXG4gIC8vICAgICAqIGdyb3VwZWQgLSBSZXR1cm5zIHRoZSBtZXNzYWdlcyBncm91cGVkIGJ5IGF0dHJpYnV0ZSAoZGVmYXVsdClcbiAgLy8gICAgICogZGV0YWlsZWQgLSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByYXcgdmFsaWRhdGlvbiBkYXRhXG4gIC8vICAgLSBmdWxsTWVzc2FnZXMgKGJvb2xlYW4pIC0gSWYgYHRydWVgIChkZWZhdWx0KSB0aGUgYXR0cmlidXRlIG5hbWUgaXMgcHJlcGVuZGVkIHRvIHRoZSBlcnJvci5cbiAgLy9cbiAgLy8gUGxlYXNlIG5vdGUgdGhhdCB0aGUgb3B0aW9ucyBhcmUgYWxzbyBwYXNzZWQgdG8gZWFjaCB2YWxpZGF0b3IuXG4gIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2Lm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKVxuICAgICAgLCBhdHRyXG4gICAgICAsIHZhbGlkYXRvcjtcblxuICAgIGZvciAoYXR0ciBpbiByZXN1bHRzKSB7XG4gICAgICBmb3IgKHZhbGlkYXRvciBpbiByZXN1bHRzW2F0dHJdKSB7XG4gICAgICAgIGlmICh2LmlzUHJvbWlzZShyZXN1bHRzW2F0dHJdW3ZhbGlkYXRvcl0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVXNlIHZhbGlkYXRlLmFzeW5jIGlmIHlvdSB3YW50IHN1cHBvcnQgZm9yIHByb21pc2VzXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0ZS5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gIH07XG5cbiAgdmFyIHYgPSB2YWxpZGF0ZTtcblxuICAvLyBDb3BpZXMgb3ZlciBhdHRyaWJ1dGVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlcyB0byBhIHNpbmdsZSBkZXN0aW5hdGlvbi5cbiAgLy8gVmVyeSBtdWNoIHNpbWlsYXIgdG8gdW5kZXJzY29yZSdzIGV4dGVuZC5cbiAgLy8gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSB0YXJnZXQgb2JqZWN0IGFuZCB0aGUgcmVtYWluaW5nIGFyZ3VtZW50cyB3aWxsIGJlXG4gIC8vIHVzZWQgYXMgdGFyZ2V0cy5cbiAgdi5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIGF0dHIgaW4gc291cmNlKSB7XG4gICAgICAgIG9ialthdHRyXSA9IHNvdXJjZVthdHRyXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIHYuZXh0ZW5kKHZhbGlkYXRlLCB7XG4gICAgLy8gVGhpcyBpcyB0aGUgdmVyc2lvbiBvZiB0aGUgbGlicmFyeSBhcyBhIHNlbXZlci5cbiAgICAvLyBUaGUgdG9TdHJpbmcgZnVuY3Rpb24gd2lsbCBhbGxvdyBpdCB0byBiZSBjb2VyY2VkIGludG8gYSBzdHJpbmdcbiAgICB2ZXJzaW9uOiB7XG4gICAgICBtYWpvcjogMCxcbiAgICAgIG1pbm9yOiA3LFxuICAgICAgcGF0Y2g6IDEsXG4gICAgICBtZXRhZGF0YTogbnVsbCxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZlcnNpb24gPSB2LmZvcm1hdChcIiV7bWFqb3J9LiV7bWlub3J9LiV7cGF0Y2h9XCIsIHYudmVyc2lvbik7XG4gICAgICAgIGlmICghdi5pc0VtcHR5KHYudmVyc2lvbi5tZXRhZGF0YSkpIHtcbiAgICAgICAgICB2ZXJzaW9uICs9IFwiK1wiICsgdi52ZXJzaW9uLm1ldGFkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBCZWxvdyBpcyB0aGUgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIHVzZWQgaW4gdmFsaWRhdGUuanNcblxuICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgUHJvbWlzZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAvLyBJZiB5b3UgYXJlIHVzaW5nIFEuanMsIFJTVlAgb3IgYW55IG90aGVyIEErIGNvbXBhdGlibGUgaW1wbGVtZW50YXRpb25cbiAgICAvLyBvdmVycmlkZSB0aGlzIGF0dHJpYnV0ZSB0byBiZSB0aGUgY29uc3RydWN0b3Igb2YgdGhhdCBwcm9taXNlLlxuICAgIC8vIFNpbmNlIGpRdWVyeSBwcm9taXNlcyBhcmVuJ3QgQSsgY29tcGF0aWJsZSB0aGV5IHdvbid0IHdvcmsuXG4gICAgUHJvbWlzZTogdHlwZW9mIFByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgPyBQcm9taXNlIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIC8vIElmIG1vbWVudCBpcyB1c2VkIGluIG5vZGUsIGJyb3dzZXJpZnkgZXRjIHBsZWFzZSBzZXQgdGhpcyBhdHRyaWJ1dGVcbiAgICAvLyBsaWtlIHRoaXM6IGB2YWxpZGF0ZS5tb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuICAgIG1vbWVudDogdHlwZW9mIG1vbWVudCAhPT0gXCJ1bmRlZmluZWRcIiA/IG1vbWVudCA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBYRGF0ZTogdHlwZW9mIFhEYXRlICE9PSBcInVuZGVmaW5lZFwiID8gWERhdGUgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgRU1QVFlfU1RSSU5HX1JFR0VYUDogL15cXHMqJC8sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMgb2JqZWN0LlxuICAgIC8vIFdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBmb3JtYXQ6XG4gICAgLy8gICAgIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGUgbmFtZT5cIiwgZXJyb3I6IFwiPHZhbGlkYXRpb24gcmVzdWx0PlwifSwgLi4uXVxuICAgIHJ1blZhbGlkYXRpb25zOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXVxuICAgICAgICAsIGF0dHJcbiAgICAgICAgLCB2YWxpZGF0b3JOYW1lXG4gICAgICAgICwgdmFsdWVcbiAgICAgICAgLCB2YWxpZGF0b3JzXG4gICAgICAgICwgdmFsaWRhdG9yXG4gICAgICAgICwgdmFsaWRhdG9yT3B0aW9uc1xuICAgICAgICAsIGVycm9yO1xuXG4gICAgICBpZiAodi5pc0RvbUVsZW1lbnQoYXR0cmlidXRlcykpIHtcbiAgICAgICAgYXR0cmlidXRlcyA9IHYuY29sbGVjdEZvcm1WYWx1ZXMoYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIExvb3BzIHRocm91Z2ggZWFjaCBjb25zdHJhaW50cywgZmluZHMgdGhlIGNvcnJlY3QgdmFsaWRhdG9yIGFuZCBydW4gaXQuXG4gICAgICBmb3IgKGF0dHIgaW4gY29uc3RyYWludHMpIHtcbiAgICAgICAgdmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBhdHRyKTtcbiAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIGNvbnN0cmFpbnRzIGZvciBhbiBhdHRyaWJ1dGUgdG8gYmUgYSBmdW5jdGlvbi5cbiAgICAgICAgLy8gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgIHZhbGlkYXRvcnMgPSB2LnJlc3VsdChjb25zdHJhaW50c1thdHRyXSwgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcblxuICAgICAgICBmb3IgKHZhbGlkYXRvck5hbWUgaW4gdmFsaWRhdG9ycykge1xuICAgICAgICAgIHZhbGlkYXRvciA9IHYudmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcblxuICAgICAgICAgIGlmICghdmFsaWRhdG9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IHYuZm9ybWF0KFwiVW5rbm93biB2YWxpZGF0b3IgJXtuYW1lfVwiLCB7bmFtZTogdmFsaWRhdG9yTmFtZX0pO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcbiAgICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgb3B0aW9ucyB0byBiZSBhIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gd2lsbCBiZVxuICAgICAgICAgIC8vIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2LnJlc3VsdCh2YWxpZGF0b3JPcHRpb25zLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuICAgICAgICAgIGlmICghdmFsaWRhdG9yT3B0aW9ucykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBhdHRyaWJ1dGU6IGF0dHIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvck5hbWUsXG4gICAgICAgICAgICBvcHRpb25zOiB2YWxpZGF0b3JPcHRpb25zLFxuICAgICAgICAgICAgZXJyb3I6IHZhbGlkYXRvci5jYWxsKHZhbGlkYXRvciwgdmFsdWUsIHZhbGlkYXRvck9wdGlvbnMsIGF0dHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9LFxuXG4gICAgLy8gVGFrZXMgdGhlIG91dHB1dCBmcm9tIHJ1blZhbGlkYXRpb25zIGFuZCBjb252ZXJ0cyBpdCB0byB0aGUgY29ycmVjdFxuICAgIC8vIG91dHB1dCBmb3JtYXQuXG4gICAgcHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICBlcnJvcnMgPSB2LnBydW5lRW1wdHlFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuZXhwYW5kTXVsdGlwbGVFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuY29udmVydEVycm9yTWVzc2FnZXMoZXJyb3JzLCBvcHRpb25zKTtcblxuICAgICAgc3dpdGNoIChvcHRpb25zLmZvcm1hdCB8fCBcImdyb3VwZWRcIikge1xuICAgICAgICBjYXNlIFwiZGV0YWlsZWRcIjpcbiAgICAgICAgICAvLyBEbyBub3RoaW5nIG1vcmUgdG8gdGhlIGVycm9yc1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJmbGF0XCI6XG4gICAgICAgICAgZXJyb3JzID0gdi5mbGF0dGVuRXJyb3JzVG9BcnJheShlcnJvcnMpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJncm91cGVkXCI6XG4gICAgICAgICAgZXJyb3JzID0gdi5ncm91cEVycm9yc0J5QXR0cmlidXRlKGVycm9ycyk7XG4gICAgICAgICAgZm9yIChhdHRyIGluIGVycm9ycykge1xuICAgICAgICAgICAgZXJyb3JzW2F0dHJdID0gdi5mbGF0dGVuRXJyb3JzVG9BcnJheShlcnJvcnNbYXR0cl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcih2LmZvcm1hdChcIlVua25vd24gZm9ybWF0ICV7Zm9ybWF0fVwiLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2LmlzRW1wdHkoZXJyb3JzKSA/IHVuZGVmaW5lZCA6IGVycm9ycztcbiAgICB9LFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdGlvbnMgd2l0aCBzdXBwb3J0IGZvciBwcm9taXNlcy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgd2hlbiBhbGwgdGhlXG4gICAgLy8gdmFsaWRhdGlvbiBwcm9taXNlcyBoYXZlIGJlZW4gY29tcGxldGVkLlxuICAgIC8vIEl0IGNhbiBiZSBjYWxsZWQgZXZlbiBpZiBubyB2YWxpZGF0aW9ucyByZXR1cm5lZCBhIHByb21pc2UuXG4gICAgYXN5bmM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuYXN5bmMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdi53YWl0Rm9yUmVzdWx0cyhyZXN1bHRzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBlcnJvcnMgPSB2LnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzaW5nbGU6IGZ1bmN0aW9uKHZhbHVlLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LnNpbmdsZS5vcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgIGZvcm1hdDogXCJmbGF0XCIsXG4gICAgICAgIGZ1bGxNZXNzYWdlczogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHYoe3NpbmdsZTogdmFsdWV9LCB7c2luZ2xlOiBjb25zdHJhaW50c30sIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gYWxsIHByb21pc2VzIGluIHRoZSByZXN1bHRzIGFycmF5XG4gICAgLy8gYXJlIHNldHRsZWQuIFRoZSBwcm9taXNlIHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbiBpcyBhbHdheXMgcmVzb2x2ZWQsXG4gICAgLy8gbmV2ZXIgcmVqZWN0ZWQuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBtb2RpZmllcyB0aGUgaW5wdXQgYXJndW1lbnQsIGl0IHJlcGxhY2VzIHRoZSBwcm9taXNlc1xuICAgIC8vIHdpdGggdGhlIHZhbHVlIHJldHVybmVkIGZyb20gdGhlIHByb21pc2UuXG4gICAgd2FpdEZvclJlc3VsdHM6IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgIC8vIENyZWF0ZSBhIHNlcXVlbmNlIG9mIGFsbCB0aGUgcmVzdWx0cyBzdGFydGluZyB3aXRoIGEgcmVzb2x2ZWQgcHJvbWlzZS5cbiAgICAgIHJldHVybiByZXN1bHRzLnJlZHVjZShmdW5jdGlvbihtZW1vLCByZXN1bHQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyByZXN1bHQgaXNuJ3QgYSBwcm9taXNlIHNraXAgaXQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICBpZiAoIXYuaXNQcm9taXNlKHJlc3VsdC5lcnJvcikpIHtcbiAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZW1vLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5lcnJvci50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgLy8gSWYgZm9yIHNvbWUgcmVhc29uIHRoZSB2YWxpZGF0b3IgcHJvbWlzZSB3YXMgcmVqZWN0ZWQgYnV0IG5vXG4gICAgICAgICAgICAgIC8vIGVycm9yIHdhcyBzcGVjaWZpZWQuXG4gICAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB2Lndhcm4oXCJWYWxpZGF0b3IgcHJvbWlzZSB3YXMgcmVqZWN0ZWQgYnV0IGRpZG4ndCByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyKSB7IHIoKTsgfSkpOyAvLyBBIHJlc29sdmVkIHByb21pc2VcbiAgICB9LFxuXG4gICAgLy8gSWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgY2FsbDogZnVuY3Rpb24gdGhlIGFuZDogZnVuY3Rpb24gcmV0dXJuIHRoZSB2YWx1ZVxuICAgIC8vIG90aGVyd2lzZSBqdXN0IHJldHVybiB0aGUgdmFsdWUuIEFkZGl0aW9uYWwgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzXG4gICAgLy8gYXJndW1lbnRzIHRvIHRoZSBmdW5jdGlvbi5cbiAgICAvLyBFeGFtcGxlOlxuICAgIC8vIGBgYFxuICAgIC8vIHJlc3VsdCgnZm9vJykgLy8gJ2ZvbydcbiAgICAvLyByZXN1bHQoTWF0aC5tYXgsIDEsIDIpIC8vIDJcbiAgICAvLyBgYGBcbiAgICByZXN1bHQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIG51bWJlci4gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBjb25zaWRlciBOYU4gYVxuICAgIC8vIG51bWJlciBsaWtlIG1hbnkgb3RoZXIgYGlzTnVtYmVyYCBmdW5jdGlvbnMgZG8uXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgbm90IGEgZnVuY3Rpb25cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9LFxuXG4gICAgLy8gQSBzaW1wbGUgY2hlY2sgdG8gdmVyaWZ5IHRoYXQgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIuIFVzZXMgYGlzTnVtYmVyYFxuICAgIC8vIGFuZCBhIHNpbXBsZSBtb2R1bG8gY2hlY2suXG4gICAgaXNJbnRlZ2VyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYuaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlICUgMSA9PT0gMDtcbiAgICB9LFxuXG4gICAgLy8gVXNlcyB0aGUgYE9iamVjdGAgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGFuIG9iamVjdC5cbiAgICBpc09iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgICB9LFxuXG4gICAgLy8gU2ltcGx5IGNoZWNrcyBpZiB0aGUgb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGEgZGF0ZVxuICAgIGlzRGF0ZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIGBudWxsYCBvZiBgdW5kZWZpbmVkYFxuICAgIGlzRGVmaW5lZDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIG9iaiAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgcHJvbWlzZS4gQW55dGhpbmcgd2l0aCBhIGB0aGVuYFxuICAgIC8vIGZ1bmN0aW9uIGlzIGNvbnNpZGVyZWQgYSBwcm9taXNlLlxuICAgIGlzUHJvbWlzZTogZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuICEhcCAmJiB2LmlzRnVuY3Rpb24ocC50aGVuKTtcbiAgICB9LFxuXG4gICAgaXNEb21FbGVtZW50OiBmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoIW8pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3JBbGwpIHx8ICF2LmlzRnVuY3Rpb24oby5xdWVyeVNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KGRvY3VtZW50KSAmJiBvID09PSBkb2N1bWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzg0MzgwLzY5OTMwNFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvICYmXG4gICAgICAgICAgdHlwZW9mIG8gPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICBvICE9PSBudWxsICYmXG4gICAgICAgICAgby5ub2RlVHlwZSA9PT0gMSAmJlxuICAgICAgICAgIHR5cGVvZiBvLm5vZGVOYW1lID09PSBcInN0cmluZ1wiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIC8vIE51bGwgYW5kIHVuZGVmaW5lZCBhcmUgZW1wdHlcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBmdW5jdGlvbnMgYXJlIG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBXaGl0ZXNwYWNlIG9ubHkgc3RyaW5ncyBhcmUgZW1wdHlcbiAgICAgIGlmICh2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdi5FTVBUWV9TVFJJTkdfUkVHRVhQLnRlc3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgYXJyYXlzIHdlIHVzZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICBpZiAodi5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID09PSAwO1xuICAgICAgfVxuXG4gICAgICAvLyBEYXRlcyBoYXZlIG5vIGF0dHJpYnV0ZXMgYnV0IGFyZW4ndCBlbXB0eVxuICAgICAgaWYgKHYuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIGZpbmQgYXQgbGVhc3Qgb25lIHByb3BlcnR5IHdlIGNvbnNpZGVyIGl0IG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIGZvciAoYXR0ciBpbiB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBGb3JtYXRzIHRoZSBzcGVjaWZpZWQgc3RyaW5ncyB3aXRoIHRoZSBnaXZlbiB2YWx1ZXMgbGlrZSBzbzpcbiAgICAvLyBgYGBcbiAgICAvLyBmb3JtYXQoXCJGb286ICV7Zm9vfVwiLCB7Zm9vOiBcImJhclwifSkgLy8gXCJGb28gYmFyXCJcbiAgICAvLyBgYGBcbiAgICAvLyBJZiB5b3Ugd2FudCB0byB3cml0ZSAley4uLn0gd2l0aG91dCBoYXZpbmcgaXQgcmVwbGFjZWQgc2ltcGx5XG4gICAgLy8gcHJlZml4IGl0IHdpdGggJSBsaWtlIHRoaXMgYEZvbzogJSV7Zm9vfWAgYW5kIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBhcyBgXCJGb286ICV7Zm9vfVwiYFxuICAgIGZvcm1hdDogdi5leHRlbmQoZnVuY3Rpb24oc3RyLCB2YWxzKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2Uodi5mb3JtYXQuRk9STUFUX1JFR0VYUCwgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICBpZiAobTEgPT09ICclJykge1xuICAgICAgICAgIHJldHVybiBcIiV7XCIgKyBtMiArIFwifVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsc1ttMl0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCB7XG4gICAgICAvLyBGaW5kcyAle2tleX0gc3R5bGUgcGF0dGVybnMgaW4gdGhlIGdpdmVuIHN0cmluZ1xuICAgICAgRk9STUFUX1JFR0VYUDogLyglPyklXFx7KFteXFx9XSspXFx9L2dcbiAgICB9KSxcblxuICAgIC8vIFwiUHJldHRpZmllc1wiIHRoZSBnaXZlbiBzdHJpbmcuXG4gICAgLy8gUHJldHRpZnlpbmcgbWVhbnMgcmVwbGFjaW5nIFsuXFxfLV0gd2l0aCBzcGFjZXMgYXMgd2VsbCBhcyBzcGxpdHRpbmdcbiAgICAvLyBjYW1lbCBjYXNlIHdvcmRzLlxuICAgIHByZXR0aWZ5OiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICh2LmlzTnVtYmVyKHN0cikpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAyIGRlY2ltYWxzIHJvdW5kIGl0IHRvIHR3b1xuICAgICAgICBpZiAoKHN0ciAqIDEwMCkgJSAxID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBzdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoTWF0aC5yb3VuZChzdHIgKiAxMDApIC8gMTAwKS50b0ZpeGVkKDIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzQXJyYXkoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLm1hcChmdW5jdGlvbihzKSB7IHJldHVybiB2LnByZXR0aWZ5KHMpOyB9KS5qb2luKFwiLCBcIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci50b1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICAvLyBFbnN1cmUgdGhlIHN0cmluZyBpcyBhY3R1YWxseSBhIHN0cmluZ1xuICAgICAgc3RyID0gXCJcIiArIHN0cjtcblxuICAgICAgcmV0dXJuIHN0clxuICAgICAgICAvLyBTcGxpdHMga2V5cyBzZXBhcmF0ZWQgYnkgcGVyaW9kc1xuICAgICAgICAucmVwbGFjZSgvKFteXFxzXSlcXC4oW15cXHNdKS9nLCAnJDEgJDInKVxuICAgICAgICAvLyBSZW1vdmVzIGJhY2tzbGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcKy9nLCAnJylcbiAgICAgICAgLy8gUmVwbGFjZXMgLSBhbmQgLSB3aXRoIHNwYWNlXG4gICAgICAgIC5yZXBsYWNlKC9bXy1dL2csICcgJylcbiAgICAgICAgLy8gU3BsaXRzIGNhbWVsIGNhc2VkIHdvcmRzXG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBtMSArIFwiIFwiICsgbTIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuICAgIHN0cmluZ2lmeVZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYucHJldHRpZnkodmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24ob2JqLCB2YWx1ZSkge1xuICAgICAgaWYgKCF2LmlzRGVmaW5lZChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZSBpbiBvYmo7XG4gICAgfSxcblxuICAgIGdldERlZXBPYmplY3RWYWx1ZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoKSB7XG4gICAgICBpZiAoIXYuaXNPYmplY3Qob2JqKSB8fCAhdi5pc1N0cmluZyhrZXlwYXRoKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5ID0gXCJcIlxuICAgICAgICAsIGlcbiAgICAgICAgLCBlc2NhcGUgPSBmYWxzZTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGtleXBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3dpdGNoIChrZXlwYXRoW2ldKSB7XG4gICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJy4nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgIG9iaiA9IG9ialtrZXldO1xuICAgICAgICAgICAgICBrZXkgPSBcIlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnXFxcXCc6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJ1xcXFwnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAga2V5ICs9IGtleXBhdGhbaV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodi5pc0RlZmluZWQob2JqKSAmJiBrZXkgaW4gb2JqKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFRoaXMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHZhbHVlcyBvZiB0aGUgZm9ybS5cbiAgICAvLyBJdCB1c2VzIHRoZSBpbnB1dCBuYW1lIGFzIGtleSBhbmQgdGhlIHZhbHVlIGFzIHZhbHVlXG4gICAgLy8gU28gZm9yIGV4YW1wbGUgdGhpczpcbiAgICAvLyA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZW1haWxcIiB2YWx1ZT1cImZvb0BiYXIuY29tXCIgLz5cbiAgICAvLyB3b3VsZCByZXR1cm46XG4gICAgLy8ge2VtYWlsOiBcImZvb0BiYXIuY29tXCJ9XG4gICAgY29sbGVjdEZvcm1WYWx1ZXM6IGZ1bmN0aW9uKGZvcm0sIG9wdGlvbnMpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSB7fVxuICAgICAgICAsIGlcbiAgICAgICAgLCBpbnB1dFxuICAgICAgICAsIGlucHV0c1xuICAgICAgICAsIHZhbHVlO1xuXG4gICAgICBpZiAoIWZvcm0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZChpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlnbm9yZWRcIikpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoaW5wdXQudmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgICAgIGlmIChpbnB1dC5hdHRyaWJ1dGVzLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBpbnB1dC5jaGVja2VkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2lucHV0Lm5hbWVdIHx8IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhbHVlc1tpbnB1dC5uYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWxlY3RbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC5vcHRpb25zW2lucHV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfSxcblxuICAgIHNhbml0aXplRm9ybVZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMudHJpbSAmJiB2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubnVsbGlmeSAhPT0gZmFsc2UgJiYgdmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKCF2LmlzU3RyaW5nKHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIGFsbCBlcnJvcnMgd2hvJ3MgZXJyb3IgYXR0cmlidXRlIGlzIGVtcHR5IChudWxsIG9yIHVuZGVmaW5lZClcbiAgICBwcnVuZUVtcHR5RXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMuZmlsdGVyKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAhdi5pc0VtcHR5KGVycm9yLmVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBJblxuICAgIC8vIFt7ZXJyb3I6IFtcImVycjFcIiwgXCJlcnIyXCJdLCAuLi59XVxuICAgIC8vIE91dFxuICAgIC8vIFt7ZXJyb3I6IFwiZXJyMVwiLCAuLi59LCB7ZXJyb3I6IFwiZXJyMlwiLCAuLi59XVxuICAgIC8vXG4gICAgLy8gQWxsIGF0dHJpYnV0ZXMgaW4gYW4gZXJyb3Igd2l0aCBtdWx0aXBsZSBtZXNzYWdlcyBhcmUgZHVwbGljYXRlZFxuICAgIC8vIHdoZW4gZXhwYW5kaW5nIHRoZSBlcnJvcnMuXG4gICAgZXhwYW5kTXVsdGlwbGVFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgLy8gUmVtb3ZlcyBlcnJvcnMgd2l0aG91dCBhIG1lc3NhZ2VcbiAgICAgICAgaWYgKHYuaXNBcnJheShlcnJvci5lcnJvcikpIHtcbiAgICAgICAgICBlcnJvci5lcnJvci5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9yLCB7ZXJyb3I6IG1zZ30pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXQucHVzaChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydHMgdGhlIGVycm9yIG1lc2FnZXMgYnkgcHJlcGVuZGluZyB0aGUgYXR0cmlidXRlIG5hbWUgdW5sZXNzIHRoZVxuICAgIC8vIG1lc3NhZ2UgaXMgcHJlZml4ZWQgYnkgXlxuICAgIGNvbnZlcnRFcnJvck1lc3NhZ2VzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvckluZm8pIHtcbiAgICAgICAgdmFyIGVycm9yID0gZXJyb3JJbmZvLmVycm9yO1xuXG4gICAgICAgIGlmIChlcnJvclswXSA9PT0gJ14nKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvci5zbGljZSgxKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmZ1bGxNZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlcnJvciA9IHYuY2FwaXRhbGl6ZSh2LnByZXR0aWZ5KGVycm9ySW5mby5hdHRyaWJ1dGUpKSArIFwiIFwiICsgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSBlcnJvci5yZXBsYWNlKC9cXFxcXFxeL2csIFwiXlwiKTtcbiAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChlcnJvciwge3ZhbHVlOiB2LnN0cmluZ2lmeVZhbHVlKGVycm9ySW5mby52YWx1ZSl9KTtcbiAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9ySW5mbywge2Vycm9yOiBlcnJvcn0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIHtcIjxhdHRyaWJ1dGVOYW1lPlwiOiBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV19XG4gICAgZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0ge307XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICB2YXIgbGlzdCA9IHJldFtlcnJvci5hdHRyaWJ1dGVdO1xuICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgIGxpc3QucHVzaChlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0W2Vycm9yLmF0dHJpYnV0ZV0gPSBbZXJyb3JdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7ZXJyb3I6IFwiPG1lc3NhZ2UgMT5cIiwgLi4ufSwge2Vycm9yOiBcIjxtZXNzYWdlIDI+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIFtcIjxtZXNzYWdlIDE+XCIsIFwiPG1lc3NhZ2UgMj5cIl1cbiAgICBmbGF0dGVuRXJyb3JzVG9BcnJheTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzLm1hcChmdW5jdGlvbihlcnJvcikgeyByZXR1cm4gZXJyb3IuZXJyb3I7IH0pO1xuICAgIH0sXG5cbiAgICBleHBvc2VNb2R1bGU6IGZ1bmN0aW9uKHZhbGlkYXRlLCByb290LCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICAgICAgaWYgKGV4cG9ydHMpIHtcbiAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRlO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHMudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgICAgaWYgKHZhbGlkYXRlLmlzRnVuY3Rpb24oZGVmaW5lKSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWxpZGF0ZTsgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2FybjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2Fybihtc2cpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlcnJvcjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB2YWxpZGF0ZS52YWxpZGF0b3JzID0ge1xuICAgIC8vIFByZXNlbmNlIHZhbGlkYXRlcyB0aGF0IHRoZSB2YWx1ZSBpc24ndCBlbXB0eVxuICAgIHByZXNlbmNlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJjYW4ndCBiZSBibGFua1wiO1xuICAgICAgfVxuICAgIH0sXG4gICAgbGVuZ3RoOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgaXMgPSBvcHRpb25zLmlzXG4gICAgICAgICwgbWF4aW11bSA9IG9wdGlvbnMubWF4aW11bVxuICAgICAgICAsIG1pbmltdW0gPSBvcHRpb25zLm1pbmltdW1cbiAgICAgICAgLCB0b2tlbml6ZXIgPSBvcHRpb25zLnRva2VuaXplciB8fCBmdW5jdGlvbih2YWwpIHsgcmV0dXJuIHZhbDsgfVxuICAgICAgICAsIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdO1xuXG4gICAgICB2YWx1ZSA9IHRva2VuaXplcih2YWx1ZSk7XG4gICAgICB2YXIgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgaWYoIXYuaXNOdW1iZXIobGVuZ3RoKSkge1xuICAgICAgICB2LmVycm9yKHYuZm9ybWF0KFwiQXR0cmlidXRlICV7YXR0cn0gaGFzIGEgbm9uIG51bWVyaWMgdmFsdWUgZm9yIGBsZW5ndGhgXCIsIHthdHRyOiBhdHRyaWJ1dGV9KSk7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImhhcyBhbiBpbmNvcnJlY3QgbGVuZ3RoXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIElzIGNoZWNrc1xuICAgICAgaWYgKHYuaXNOdW1iZXIoaXMpICYmIGxlbmd0aCAhPT0gaXMpIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIHRoaXMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICBcImlzIHRoZSB3cm9uZyBsZW5ndGggKHNob3VsZCBiZSAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogaXN9KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1pbmltdW0pICYmIGxlbmd0aCA8IG1pbmltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29TaG9ydCB8fFxuICAgICAgICAgIHRoaXMudG9vU2hvcnQgfHxcbiAgICAgICAgICBcImlzIHRvbyBzaG9ydCAobWluaW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWluaW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWF4aW11bSkgJiYgbGVuZ3RoID4gbWF4aW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb0xvbmcgfHxcbiAgICAgICAgICB0aGlzLnRvb0xvbmcgfHxcbiAgICAgICAgICBcImlzIHRvbyBsb25nIChtYXhpbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtYXhpbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBudW1lcmljYWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyb3JzID0gW11cbiAgICAgICAgLCBuYW1lXG4gICAgICAgICwgY291bnRcbiAgICAgICAgLCBjaGVja3MgPSB7XG4gICAgICAgICAgICBncmVhdGVyVGhhbjogICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+IGM7IH0sXG4gICAgICAgICAgICBncmVhdGVyVGhhbk9yRXF1YWxUbzogZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+PSBjOyB9LFxuICAgICAgICAgICAgZXF1YWxUbzogICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPT09IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbjogICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbk9yRXF1YWxUbzogICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8PSBjOyB9XG4gICAgICAgICAgfTtcblxuICAgICAgLy8gQ29lcmNlIHRoZSB2YWx1ZSB0byBhIG51bWJlciB1bmxlc3Mgd2UncmUgYmVpbmcgc3RyaWN0LlxuICAgICAgaWYgKG9wdGlvbnMubm9TdHJpbmdzICE9PSB0cnVlICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdCdzIG5vdCBhIG51bWJlciB3ZSBzaG91bGRuJ3QgY29udGludWUgc2luY2UgaXQgd2lsbCBjb21wYXJlIGl0LlxuICAgICAgaWYgKCF2LmlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJpcyBub3QgYSBudW1iZXJcIjtcbiAgICAgIH1cblxuICAgICAgLy8gU2FtZSBsb2dpYyBhcyBhYm92ZSwgc29ydCBvZi4gRG9uJ3QgYm90aGVyIHdpdGggY29tcGFyaXNvbnMgaWYgdGhpc1xuICAgICAgLy8gZG9lc24ndCBwYXNzLlxuICAgICAgaWYgKG9wdGlvbnMub25seUludGVnZXIgJiYgIXYuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90SW50ZWdlciAgfHwgXCJtdXN0IGJlIGFuIGludGVnZXJcIjtcbiAgICAgIH1cblxuICAgICAgZm9yIChuYW1lIGluIGNoZWNrcykge1xuICAgICAgICBjb3VudCA9IG9wdGlvbnNbbmFtZV07XG4gICAgICAgIGlmICh2LmlzTnVtYmVyKGNvdW50KSAmJiAhY2hlY2tzW25hbWVdKHZhbHVlLCBjb3VudCkpIHtcbiAgICAgICAgICAvLyBUaGlzIHBpY2tzIHRoZSBkZWZhdWx0IG1lc3NhZ2UgaWYgc3BlY2lmaWVkXG4gICAgICAgICAgLy8gRm9yIGV4YW1wbGUgdGhlIGdyZWF0ZXJUaGFuIGNoZWNrIHVzZXMgdGhlIG1lc3NhZ2UgZnJvbVxuICAgICAgICAgIC8vIHRoaXMubm90R3JlYXRlclRoYW4gc28gd2UgY2FwaXRhbGl6ZSB0aGUgbmFtZSBhbmQgcHJlcGVuZCBcIm5vdFwiXG4gICAgICAgICAgdmFyIG1zZyA9IHRoaXNbXCJub3RcIiArIHYuY2FwaXRhbGl6ZShuYW1lKV0gfHxcbiAgICAgICAgICAgIFwibXVzdCBiZSAle3R5cGV9ICV7Y291bnR9XCI7XG5cbiAgICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChtc2csIHtcbiAgICAgICAgICAgIGNvdW50OiBjb3VudCxcbiAgICAgICAgICAgIHR5cGU6IHYucHJldHRpZnkobmFtZSlcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMub2RkICYmIHZhbHVlICUgMiAhPT0gMSkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdE9kZCB8fCBcIm11c3QgYmUgb2RkXCIpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuZXZlbiAmJiB2YWx1ZSAlIDIgIT09IDApIHtcbiAgICAgICAgZXJyb3JzLnB1c2godGhpcy5ub3RFdmVuIHx8IFwibXVzdCBiZSBldmVuXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGV0aW1lOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdXG4gICAgICAgICwgZWFybGllc3QgPSBvcHRpb25zLmVhcmxpZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmVhcmxpZXN0LCBvcHRpb25zKSA6IE5hTlxuICAgICAgICAsIGxhdGVzdCA9IG9wdGlvbnMubGF0ZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmxhdGVzdCwgb3B0aW9ucykgOiBOYU47XG5cbiAgICAgIHZhbHVlID0gdGhpcy5wYXJzZSh2YWx1ZSwgb3B0aW9ucyk7XG5cbiAgICAgIC8vIDg2NDAwMDAwIGlzIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBpbiBhIGRheSwgdGhpcyBpcyB1c2VkIHRvIHJlbW92ZVxuICAgICAgLy8gdGhlIHRpbWUgZnJvbSB0aGUgZGF0ZVxuICAgICAgaWYgKGlzTmFOKHZhbHVlKSB8fCBvcHRpb25zLmRhdGVPbmx5ICYmIHZhbHVlICUgODY0MDAwMDAgIT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwibXVzdCBiZSBhIHZhbGlkIGRhdGVcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihlYXJsaWVzdCkgJiYgdmFsdWUgPCBlYXJsaWVzdCkge1xuICAgICAgICBlcnIgPSB0aGlzLnRvb0Vhcmx5IHx8IFwibXVzdCBiZSBubyBlYXJsaWVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtkYXRlOiB0aGlzLmZvcm1hdChlYXJsaWVzdCwgb3B0aW9ucyl9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihsYXRlc3QpICYmIHZhbHVlID4gbGF0ZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vTGF0ZSB8fCBcIm11c3QgYmUgbm8gbGF0ZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGxhdGVzdCwgb3B0aW9ucyl9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gY29udmVydCBpbnB1dCB0byB0aGUgbnVtYmVyXG4gICAgICAvLyBvZiBtaWxsaXMgc2luY2UgdGhlIGVwb2NoLlxuICAgICAgLy8gSXQgc2hvdWxkIHJldHVybiBOYU4gaWYgaXQncyBub3QgYSB2YWxpZCBkYXRlLlxuICAgICAgcGFyc2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICh2LmlzRnVuY3Rpb24odi5YRGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IHYuWERhdGUodmFsdWUsIHRydWUpLmdldFRpbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICByZXR1cm4gK3YubW9tZW50LnV0Yyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWl0aGVyIFhEYXRlIG9yIG1vbWVudC5qcyB3YXMgZm91bmRcIik7XG4gICAgICB9LFxuICAgICAgLy8gRm9ybWF0cyB0aGUgZ2l2ZW4gdGltZXN0YW1wLiBVc2VzIElTTzg2MDEgdG8gZm9ybWF0IHRoZW0uXG4gICAgICAvLyBJZiBvcHRpb25zLmRhdGVPbmx5IGlzIHRydWUgdGhlbiBvbmx5IHRoZSB5ZWFyLCBtb250aCBhbmQgZGF5IHdpbGwgYmVcbiAgICAgIC8vIG91dHB1dC5cbiAgICAgIGZvcm1hdDogZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgZm9ybWF0ID0gb3B0aW9ucy5kYXRlRm9ybWF0O1xuXG4gICAgICAgIGlmICh2LmlzRnVuY3Rpb24odi5YRGF0ZSkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcInl5eXktTU0tZGRcIiA6IFwieXl5eS1NTS1kZCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gbmV3IFhEYXRlKGRhdGUsIHRydWUpLnRvU3RyaW5nKGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodi5pc0RlZmluZWQodi5tb21lbnQpKSB7XG4gICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IChvcHRpb25zLmRhdGVPbmx5ID8gXCJZWVlZLU1NLUREXCIgOiBcIllZWVktTU0tREQgSEg6bW06c3NcIik7XG4gICAgICAgICAgcmV0dXJuIHYubW9tZW50LnV0YyhkYXRlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH1cbiAgICB9KSxcbiAgICBkYXRlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCBvcHRpb25zLCB7ZGF0ZU9ubHk6IHRydWV9KTtcbiAgICAgIHJldHVybiB2LnZhbGlkYXRvcnMuZGF0ZXRpbWUuY2FsbCh2LnZhbGlkYXRvcnMuZGF0ZXRpbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpIHx8IChvcHRpb25zIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICBvcHRpb25zID0ge3BhdHRlcm46IG9wdGlvbnN9O1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIGludmFsaWRcIlxuICAgICAgICAsIHBhdHRlcm4gPSBvcHRpb25zLnBhdHRlcm5cbiAgICAgICAgLCBtYXRjaDtcblxuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhwYXR0ZXJuKSkge1xuICAgICAgICBwYXR0ZXJuID0gbmV3IFJlZ0V4cChvcHRpb25zLnBhdHRlcm4sIG9wdGlvbnMuZmxhZ3MpO1xuICAgICAgfVxuICAgICAgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWModmFsdWUpO1xuICAgICAgaWYgKCFtYXRjaCB8fCBtYXRjaFswXS5sZW5ndGggIT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5jbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICh2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiXiV7dmFsdWV9IGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgbGlzdFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGV4Y2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAoIXYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJeJXt2YWx1ZX0gaXMgcmVzdHJpY3RlZFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGVtYWlsOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgbm90IGEgdmFsaWQgZW1haWxcIjtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5QQVRURVJOLmV4ZWModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIFBBVFRFUk46IC9eW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2Etel17Mix9JC9pXG4gICAgfSksXG4gICAgZXF1YWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHthdHRyaWJ1dGU6IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiaXMgbm90IGVxdWFsIHRvICV7YXR0cmlidXRlfVwiO1xuXG4gICAgICBpZiAodi5pc0VtcHR5KG9wdGlvbnMuYXR0cmlidXRlKSB8fCAhdi5pc1N0cmluZyhvcHRpb25zLmF0dHJpYnV0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGF0dHJpYnV0ZSBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG90aGVyVmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBvcHRpb25zLmF0dHJpYnV0ZSlcbiAgICAgICAgLCBjb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yIHx8IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgICAgIHJldHVybiB2MSA9PT0gdjI7XG4gICAgICAgIH07XG5cbiAgICAgIGlmICghY29tcGFyYXRvcih2YWx1ZSwgb3RoZXJWYWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzKSkge1xuICAgICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge2F0dHJpYnV0ZTogdi5wcmV0dGlmeShvcHRpb25zLmF0dHJpYnV0ZSl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFsaWRhdGUuZXhwb3NlTW9kdWxlKHZhbGlkYXRlLCB0aGlzLCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSk7XG59KS5jYWxsKHRoaXMsXG4gICAgICAgIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGV4cG9ydHMgOiBudWxsLFxuICAgICAgICB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG1vZHVsZSA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZGVmaW5lIDogbnVsbCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzXG4gKiogbW9kdWxlIGlkID0gODBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpOyB9O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSA4MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDVcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAgICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxyXG5cclxuICAgICAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJyk7XHJcblxyXG52YXIgTXlib29raW5nRGF0YSA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIHByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlZnJlc2hDdXJyZW50Q2FydDogZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hDdXJyZW50Q2FydFwiKTtcclxuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Q2FydERldGFpbHMvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ2N1cnJlbnRDYXJ0SWQnKSksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHVwY29taW5nOiBkYXRhLnVwY29taW5nLCBjcmVhdGVkOiBkYXRhLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBkYXRhLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogZGF0YS5ib29raW5nX3N0YXR1cyxib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjdXJyZW50Q2FydERldGFpbHMnLCBkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleCh2aWV3LmdldCgnY2FydHMnKSwgeydpZCc6IGRldGFpbHMuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXg6ICcraW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FydHMgPSB2aWV3LmdldCgnY2FydHMnKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJ0c1tpbmRleF0uYm9va2luZ19zdGF0dXMgPSBkZXRhaWxzLmJvb2tpbmdfc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjYXJ0cycsIGNhcnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluc2loZWQgc3RvcmU6ICcpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbk15Ym9va2luZ0RhdGEuZ2V0Q3VycmVudENhcnQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgLy8gY29uc29sZS5sb2coXCJnZXRDdXJyZW50Q2FydFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9nZXRDYXJ0RGV0YWlscy8nICsgXy5wYXJzZUludChpZCksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkb25lXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHRpY2tldHN0YXR1c21zZzpkYXRhLnRpY2tldHN0YXR1c21zZyx1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsY2xpZW50U291cmNlSWQ6ZGF0YS5jbGllbnRTb3VyY2VJZCxzZWdOaWdodHM6ZGF0YS5zZWdOaWdodHMsXHJcbiAgICAgICAgICAgIGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LCBjdXJlbmN5OiBkYXRhLmN1cmVuY3ksZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLFxyXG4gICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgb3JpZ2luOiB0Lm9yaWdpbiwgb3JpZ2luRGV0YWlsczogdC5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSksIH07XHJcbiAgICAgICAgZGF0YS5jdXJyZW50Q2FydERldGFpbHM9IGRldGFpbHM7XHJcbiAgICAgICAgZGF0YS5jYXJ0cz1bXTtcclxuICAgICAgICBkYXRhLmNhcnRzLnB1c2goZGV0YWlscyk7XHJcbiAgICAgICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gZGV0YWlscy5pZDtcclxuIC8vICAgY29uc29sZS5sb2coZGF0YS5jdXJyZW50Q2FydERldGFpbHMpO1xyXG4gICAgZGF0YS5zdW1tYXJ5ID0gZmFsc2U7XHJcbiAgICBkYXRhLnByaW50ID0gZmFsc2U7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSBmYWxzZTtcclxuICAgIGRhdGEuYW1lbmQgPSBmYWxzZTtcclxuICAgIGRhdGEuY2FuY2VsID0gZmFsc2U7XHJcbiAgICBkYXRhLnJlc2NoZWR1bGUgPSBmYWxzZTtcclxuICAgXHJcbiAgICBkYXRhLmVycm9ycyA9IHt9O1xyXG4gICAgZGF0YS5yZXN1bHRzID0gW107XHJcblxyXG4gICAgZGF0YS5maWx0ZXIgPSB7fTtcclxuICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuICAgIHJldHVybiByZXNvbHZlKG5ldyBNeWJvb2tpbmdEYXRhKHtkYXRhOiBkYXRhfSkpO1xyXG5cclxuICAgICAgICBcclxuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH0pXHJcbiAgICB9KTtcclxufTtcclxuXHJcbk15Ym9va2luZ0RhdGEucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIk15Ym9va2luZ0RhdGEucGFyc2VcIik7XHJcbiAgICAvL2RhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gRmxpZ2h0LnBhcnNlKGkpOyB9KTtcclxuICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7ICAgXHJcbiAgICB2YXIgZmxnVXBjb21pbmcgPSBmYWxzZTtcclxuICAgIHZhciBmbGdQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYXJ0cyA9IF8ubWFwKGRhdGEsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgaWYgKGkudXBjb21pbmcgPT0gJ3RydWUnKVxyXG4gICAgICAgICAgICBmbGdVcGNvbWluZyA9IHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmbGdQcmV2aW91cyA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHtpZDogaS5pZCxlbWFpbDppLmVtYWlsLCBjcmVhdGVkOiBpLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBpLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogaS5ib29raW5nX3N0YXR1cyxcclxuICAgICAgICAgICAgcmV0dXJuZGF0ZTogaS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogaS5pc011bHRpQ2l0eSwgY3VyZW5jeTogaS5jdXJlbmN5LCB1cGNvbWluZzogaS51cGNvbWluZyxcclxuICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGkuYm9va2luZ3MsIGZ1bmN0aW9uIChiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogYi5pZCwgc291cmNlOiBiLnNvdXJjZSwgZGVzdGluYXRpb246IGIuZGVzdGluYXRpb24sIHNvdXJjZV9pZDogYi5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBiLmRlc3RpbmF0aW9uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZTogYi5kZXBhcnR1cmUsIGFycml2YWw6IGIuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxlcnM6IF8ubWFwKGIudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiB0LmlkLCBuYW1lOiB0Lm5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0cmF2ZWxlcjogXy5tYXAoaS50cmF2ZWxsZXJkdGwsIGZ1bmN0aW9uIChqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBqLmlkLCBuYW1lOiBqLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBfLm1hcChqLnNyYywgZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBnfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBfLm1hcChqLmRlc3QsIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZTogZ307XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLmNhcnRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICBpZiAoeC5pZCA8IHkuaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG5cclxuICAgIH0pO1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmNhcnRzKTsgIFxyXG4gICAgLy8gICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVyPSBfLmZpcnN0KGRhdGEudHJhdmVsbGVycyk7XHJcbiAgICAvLyAgICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVySWQ9ZGF0YS5jdXJyZW50VHJhdmVsbGVyLmlkO1xyXG4gICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gbnVsbDtcclxuICAgIGRhdGEuY3VycmVudENhcnREZXRhaWxzID0gbnVsbDtcclxuICAgIGRhdGEuc3VtbWFyeSA9IHRydWU7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSB0cnVlO1xyXG4gICAgZGF0YS5hbWVuZCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYW5jZWwgPSBmYWxzZTtcclxuICAgIGRhdGEucHJpbnQgPSBmYWxzZTtcclxuICAgIGRhdGEucmVzY2hlZHVsZSA9IGZhbHNlO1xyXG4gICAgZGF0YS5mbGdVcGNvbWluZyA9IGZsZ1VwY29taW5nO1xyXG4gICAgZGF0YS5mbGdQcmV2aW91cyA9IGZsZ1ByZXZpb3VzO1xyXG4gICAgZGF0YS5lcnJvcnMgPSB7fTtcclxuICAgIGRhdGEucmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGRhdGEuZmlsdGVyID0ge307XHJcbiAgICBkYXRhLmZpbHRlcmVkID0ge307XHJcbiAgICByZXR1cm4gbmV3IE15Ym9va2luZ0RhdGEoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcbk15Ym9va2luZ0RhdGEuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiTXlib29raW5nRGF0YS5mZXRjaFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9haXJDYXJ0L2dldE15Qm9va2luZ3MnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKE15Ym9va2luZ0RhdGEucGFyc2UoZGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE15Ym9va2luZ0RhdGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuanNcbiAqKiBtb2R1bGUgaWQgPSA4MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgdmFsaWRhdGUgPSByZXF1aXJlKCd2YWxpZGF0ZScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBxdWVuZTogW10sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGdldERhdGE9ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGdldERhdGExPWZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBkb2FqYXg9ZnVuY3Rpb24oZ2V0RGF0YSl7XHJcbiAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYjJjL3RyYXZlbGVyL2dldE15VHJhdmVsZXJzTGlzdCcsICBcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGdldERhdGEsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZ2V0RGF0YTFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgICAgIGRvYWpheChnZXREYXRhKTtcclxuICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVyOiB7aWQ6IDEsdGl0bGU6J01yLicsIGVtYWlsOiAncHJhc2hhbnRAZ21haWwuY29tJywgbW9iaWxlOiAnOTQxMjM1NzkyNicsICBmaXJzdF9uYW1lOiAnUHJhc2hhbnQnLCBcclxuICAgICAgICAgICAgICAgIGxhc3RfbmFtZTonS3VtYXInLGJpcnRoZGF0ZTonMjAwMS0wNS0zMCcsYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6JzM0MjEyMycscGFzc3BvcnRfcGxhY2U6J0luZGlhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVySWQ6MSxcclxuICAgICAgICAgICAgY2FiaW5UeXBlOiAxLFxyXG4gICAgICAgICAgICBhZGQ6ZmFsc2UsXHJcbiAgICAgICAgICAgIGVkaXQ6ZmFsc2UsXHJcbiAgICAgICAgICAgIHRpdGxlczpbe2lkOjEsdGV4dDonTXIuJ30se2lkOjIsdGV4dDonTXJzLid9LHtpZDozLHRleHQ6J01zLid9LHtpZDo0LHRleHQ6J01pc3MnfSx7aWQ6NSx0ZXh0OidNc3RyLid9LHtpZDo2LHRleHQ6J0luZi4nfV0sXHJcbiAgICAgICAgICAgIHBhc3NlbmdlcnM6IFsxLCAwLCAwXSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyczogW1xyXG4gICAgICAgICAgICAgICAgeyBpZDogMSx0aXRsZTonTXIuJywgZW1haWw6ICdwcmFzaGFudEBnbWFpbC5jb20nLCBtb2JpbGU6ICc5NDEyMzU3OTI2JyxwYXNzcG9ydF9udW1iZXI6JzI1NDIzNDInLHBhc3Nwb3J0X3BsYWNlOidJbmRpYScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6ICdQcmFzaGFudCcsIGxhc3RfbmFtZTonS3VtYXInLGJpcnRoZGF0ZTonMjAwMS0wNS0zMCcsYmFzZVVybDonJ30sXHJcbiAgICAgICAgICAgICAgICB7IGlkOiAyLHRpdGxlOidNci4nLCBlbWFpbDogJ01pY2hhZWxAZ21haWwuY29tJywgbW9iaWxlOiAnMTIzNDU2Nzg5MCcscGFzc3BvcnRfbnVtYmVyOiczMTIzMTIzJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnLCBcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnTWljaGFlbCcsIGxhc3RfbmFtZTonSmFpbicsYmlydGhkYXRlOicyMDA1LTAzLTAzJyxiYXNlVXJsOicnfSxcclxuICAgICAgICAgICAgICAgIHsgaWQ6IDMsdGl0bGU6J01yLicsIGVtYWlsOiAnYmVsYWlyQGdtYWlsLmNvbScsIG1vYmlsZTogJzEyMzQ1Njc4OTAnLHBhc3Nwb3J0X251bWJlcjonMTIzMTIzMScscGFzc3BvcnRfcGxhY2U6J0luZGlhJyxcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnQmVsYWlyJywgbGFzdF9uYW1lOidUcmF2ZWxzJyxiaXJ0aGRhdGU6JzIwMDItMDItMjAnLGJhc2VVcmw6Jyd9XHJcbiAgICAgICAgICAgIF0sXHJcblxyXG4gICAgICAgICAgICBwZW5kaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZXJyb3JzOiB7fSxcclxuICAgICAgICAgICAgcmVzdWx0czogW10sXHJcblxyXG4gICAgICAgICAgICBmaWx0ZXI6IHt9LFxyXG4gICAgICAgICAgICBmaWx0ZXJlZDoge30sXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgaWYodGhpcy5nZXQoKS5hZGQpeyAgICAgICAgXHJcbiAgICAgICAgdmFyIG5ld3RyYXZlbGxlcj1fLnBpY2sodGhpcy5nZXQoKSwgJ2N1cnJlbnRUcmF2ZWxsZXInKTsgXHJcbiAgICAgICAgdmFyIHRyYXZlbGxlcnM9dGhpcy5nZXQoKS50cmF2ZWxsZXJzO1xyXG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnRpdGxlO1xyXG4gICAgICAgIHZhciB0aXRsZXM9Xy5jbG9uZURlZXAodGhpcy5nZXQoKS50aXRsZXMpO1xyXG4gICAgICAgIHZhciB0aXRsZTtcclxuICAgICAgICAgXy5lYWNoKHRpdGxlcywgZnVuY3Rpb24oaSwgaykgeyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiA0LHRpdGxlOnRpdGxlLCBlbWFpbDogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZW1haWwsIG1vYmlsZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZmlyc3RfbmFtZSwgXHJcbiAgICAgICAgICAgICAgICBsYXN0X25hbWU6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubGFzdF9uYW1lLGJpcnRoZGF0ZTpuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyksYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyLHBhc3Nwb3J0X3BsYWNlOm5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnBhc3Nwb3J0X3BsYWNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsbGVycyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3RyYXZlbGxlcnMnLHRyYXZlbGxlcnMpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxjdXJyZW50dHJhdmVsbGVyKTtcclxuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcklkJyw0KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYodGhpcy5nZXQoKS5lZGl0KXtcclxuICAgICAgICB2YXIgbmV3dHJhdmVsbGVyPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcjsgXHJcbiAgICAgICAgdmFyIHRyYXZlbGxlcnM9dGhpcy5nZXQoKS50cmF2ZWxsZXJzO1xyXG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci50aXRsZTtcclxuICAgICAgICB2YXIgdGl0bGVzPV8uY2xvbmVEZWVwKHRoaXMuZ2V0KCkudGl0bGVzKTtcclxuICAgICAgICB2YXIgdGl0bGU7XHJcbiAgICAgICAgdmFyIGlkPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcklkO1xyXG4gICAgICAgICBfLmVhY2godGl0bGVzLCBmdW5jdGlvbihpLCBrKSB7IGNvbnNvbGUubG9nKGkpOyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiBpZCx0aXRsZTp0aXRsZSwgZW1haWw6IG5ld3RyYXZlbGxlci5lbWFpbCwgbW9iaWxlOiBuZXd0cmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmZpcnN0X25hbWUsIFxyXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOm5ld3RyYXZlbGxlci5sYXN0X25hbWUsYmlydGhkYXRlOm5ld3RyYXZlbGxlci5iaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyksYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6bmV3dHJhdmVsbGVyLnBhc3Nwb3J0X251bWJlcixwYXNzcG9ydF9wbGFjZTpuZXd0cmF2ZWxsZXIucGFzc3BvcnRfcGxhY2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB2YXIgaW5kZXg9IF8uZmluZEluZGV4KHRoaXMuZ2V0KCkudHJhdmVsbGVycywgeyAnaWQnOiBpZH0pO1xyXG4gICAgICAgIHRoaXMuc3BsaWNlKCd0cmF2ZWxsZXJzJywgaW5kZXgsIDEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIHRyYXZlbGxlcnMucHVzaChjdXJyZW50dHJhdmVsbGVyKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGxlcnMpO1xyXG4gICAgICAgIHRoaXMuc2V0KCd0cmF2ZWxsZXJzJyx0cmF2ZWxsZXJzKTtcclxuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcicsY3VycmVudHRyYXZlbGxlcik7ICAgICAgICBcclxuICAgIH1cclxuICAgICAgICB0aGlzLnNldCgnYWRkJyxmYWxzZSk7IFxyXG4gICAgICAgIHRoaXMuc2V0KCdlZGl0JyxmYWxzZSk7IFxyXG4gICAgICAgIC8vLFxyXG4gICAgIC8qICAgICAgIHNlYXJjaCA9IF8ucGljayh0aGlzLmdldCgpLCBbJ3RyaXBUeXBlJywgJ2NhYmluVHlwZScsICdwYXNzZW5nZXJzJ10pO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywge30pO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwZW5kaW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5xdWVuZSA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgXy5lYWNoKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKGksIGspIHtcclxuICAgICAgICAgICAgdmlldy5xdWVuZVt2aWV3LnF1ZW5lLmxlbmd0aF0gPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9mbGlnaHRzL3NlYXJjaCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmV4dGVuZCh7fSwgc2VhcmNoLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogaS5mcm9tLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiBpLnRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydF9hdDogbW9tZW50LmlzTW9tZW50KGkuZGVwYXJ0X2F0KSA/IGkuZGVwYXJ0X2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5fYXQ6IG1vbWVudC5pc01vbWVudChpLnJldHVybl9hdCkgPyBpLnJldHVybl9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgdmlldy5pbXBvcnRSZXN1bHRzKGssIGRhdGEpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikgeyB2aWV3LmhhbmRsZUVycm9yKGssIHhocik7IH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJC53aGVuLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy5xdWVuZSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7IHZpZXcuc2V0KCdwZW5kaW5nJywgZmFsc2UpOyB2aWV3LnNldCgnZmluaXNoZWQnLCB0cnVlKTsgfSk7ICovXHJcbiAgICB9LFxyXG5cclxuICAgIGltcG9ydFJlc3VsdHM6IGZ1bmN0aW9uKGssIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQnLCB7fSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Jlc3VsdHMuJyArIGssIGRhdGEpO1xyXG5cclxuICAgICAgICB2YXIgcHJpY2VzID0gW10sXHJcbiAgICAgICAgICAgIGNhcnJpZXJzID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgIHByaWNlc1twcmljZXMubGVuZ3RoXSA9IGkucHJpY2U7XHJcbiAgICAgICAgICAgIGNhcnJpZXJzW2NhcnJpZXJzLmxlbmd0aF0gPSBpLml0aW5lcmFyeVswXS5zZWdtZW50c1swXS5jYXJyaWVyO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgY2FycmllcnMgPSBfLnVuaXF1ZShjYXJyaWVycywgJ2NvZGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2ZpbHRlcicsIHtcclxuICAgICAgICAgICAgcHJpY2VzOiBbTWF0aC5taW4uYXBwbHkobnVsbCwgcHJpY2VzKSwgTWF0aC5tYXguYXBwbHkobnVsbCwgcHJpY2VzKV0sXHJcbiAgICAgICAgICAgIGNhcnJpZXJzOiBjYXJyaWVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQuY2FycmllcnMnLCBfLm1hcChjYXJyaWVycywgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS5jb2RlOyB9KSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZUVycm9yOiBmdW5jdGlvbihrLCB4aHIpIHtcclxuXHJcbiAgICB9XHJcblxyXG5cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDgzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgNVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcInNlYXJjaC1mb3JtXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhc2ljIHNlZ21lbnRcIixcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV19fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvcGFnZXMvZmxpZ2h0cy9zZWFyY2guaHRtbFxuICoqIG1vZHVsZSBpZCA9IDg0XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UuanMnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXHJcbiAgICA7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvZm9ybS5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1zcGlubmVyJzogcmVxdWlyZSgnY29yZS9mb3JtL3NwaW5uZXInKSxcclxuICAgICAgICAndWktYWlycG9ydCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9haXJwb3J0JyksXHJcbiAgICAgICAgJ3VpLWNhbGVuZGFyJzogcmVxdWlyZSgnY29yZS9mb3JtL2NhbGVuZGFyJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3QsXHJcbiAgICAgICAgICAgIG1vbWVudDogbW9tZW50XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5vbignbmV4dCcsIGZ1bmN0aW9uKHZpZXcpIHtcclxuICAgICAgICAgICAgLy9UT0RPOiB0aGluayBvZiBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCdmb3JtJykpLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGlmeScpICYmICF0aGlzLmdldCgnc2VhcmNoLmRvbWVzdGljJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCduZXh0JykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gdmlldy5nZXQoJ25leHQnKS5zcGxpdCgnLScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgndG8nID09IG5leHRbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMuZmluZCgnLicgKyB2aWV3LmdldCgnbmV4dCcpICsgJyBpbnB1dC5zZWFyY2gnKSkuY2xpY2soKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgnZGVwYXJ0JyA9PSBuZXh0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLicgKyB2aWV3LmdldCgnbmV4dCcpKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgncmV0dXJuJyA9PSBuZXh0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLicgKyB2aWV3LmdldCgnbmV4dCcpKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgdmFyIG9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoeyBvbkhpZGRlbjogZnVuY3Rpb24oKSB7ICQoJyNtX2J0bicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpOyAgfSwgb25TaG93OiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9fSk7XHJcbiAgICAgICAgICAgICQoJy5kcm9wZG93bicpLmRyb3Bkb3duKCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbV9idG4nLCB0aGlzLmVsKS5vbignY2xpY2subGF5b3V0JyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJCgnLnB1c2hlcicpLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGlmeScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdvcGVuJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldCgnc2VhcmNoLmZsaWdodHMnLCB0aGlzLmdldCgnc2VhcmNoLmZsaWdodHMnKSk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2ZvciBuby4gb2YgdHJhdmVsbGVyXHJcbiAgICAgICAgJCgnLnRyYXZlbGxlcicpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLnRyYXZlbGxlcnNJbmZvJykuZmFkZUluKDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5jbG9zZWJ0bicpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLnRyYXZlbGxlcnNJbmZvJykuZmFkZU91dCg0MDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vZm9yIHRyYXZlbGxlciBjbGFzc1xyXG4gICAgICAgICQoJy50cmF2ZWxDbGFzcycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCgnLkNsYXNzSW5mbycpLmZhZGVJbig0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAkKCcuQ2xhc3NJbmZvIGEnKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJy5DbGFzc0luZm8nKS5mYWRlT3V0KDQwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5jbG9zZWNsYXNzJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCcuQ2xhc3NJbmZvJykuZmFkZU91dCg0MDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYXJkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5zZXQoJ21vZGlmeScsIG51bGwpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0b2dnbGVSb3VuZHRyaXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICgyICE9PSB0aGlzLmdldCgnc2VhcmNoLnRyaXBUeXBlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3NlYXJjaC50cmlwVHlwZScsIDIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYWRkVHJhdmVsZXI6IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldCgnc2VhcmNoLnBhc3NlbmdlcnMuJyArIHR5cGUpO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPCA5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzZWFyY2gucGFzc2VuZ2Vycy4nICsgdHlwZSwgdmFsdWUgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZVRyYXZlbGVyOiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoJ3NlYXJjaC5wYXNzZW5nZXJzLicgKyB0eXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnc2VhcmNoLnBhc3NlbmdlcnMuJyArIHR5cGUsIHZhbHVlIC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmVGbGlnaHQ6IGZ1bmN0aW9uKGkpIHsgdGhpcy5nZXQoJ3NlYXJjaCcpLnJlbW92ZUZsaWdodChpKTsgfSxcclxuICAgIGFkZEZsaWdodDogZnVuY3Rpb24oKSB7IHRoaXMuZ2V0KCdzZWFyY2gnKS5hZGRGbGlnaHQoKTsgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICB0aGlzLnBvc3QoUk9VVEVTLnNlYXJjaCwgdGhpcy5zZXJpYWxpemUoKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5nZXQoJ21vZGlmeScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBhZ2Uoc2VhcmNoLnVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5nZXQoJ3NlYXJjaCcpLnRvSlNPTigpOyB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL2Zvcm0uanNcbiAqKiBtb2R1bGUgaWQgPSA4NVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwic3R5bGVcIixcImZcIjpbXCIjYXBwIC51aS5kcm9wZG93bi5zZWFyY2ggLm1lbnUge1xcclxcbiAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAjYXBwIC51aS5kcm9wZG93bi5zZWFyY2ggaW5wdXQuc2VhcmNoIHtcXHJcXG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLmluZm9kYXRlYmFuID4gZGl2IHtcXHJcXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuZGF0ZV9pbmZvIHtcXHJcXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgIHRvcDogMTJweDtcXHJcXG4gICAgICAgIGJvdHRvbTogMTJweDtcXHJcXG4gICAgICAgIGxlZnQ6IDEycHg7XFxyXFxuICAgICAgICByaWdodDogMTJweDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuZGF0ZV9pbmZvLmRpc2FibGVkIHtcXHJcXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdDtcXHJcXG4gICAgICAgIGNvbG9yOiBncmF5ICFpbXBvcnRhbnQ7XFxyXFxuICAgIH1cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaGVhZGVyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRocmVlIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImlkXCI6XCJtX2J0blwiLFwiY2xhc3NcIjpcIm1haW5fbW51XCIsXCJocmVmXCI6XCIjXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9iYXJzLnBuZ1wiLFwiYWx0XCI6XCJtZW51XCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwibG9nb1wiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9sb2dvLnBuZ1wiLFwiYWx0XCI6XCJDaGVhcFRpY2tldC5pblwifX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwibV9tZW51XCIsXCJjbGFzc1wiOlwidWkgbGVmdCB2ZXJ0aWNhbCBzaWRlYmFyIG1lbnUgcHVzaCBzY2FsZSBkb3duIG92ZXJsYXlcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImF2YXRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiaWRcIjpcImF2YXRhclwiLFwiY2xhc3NcIjpcInVpIGF2YXRhciBsaWl0bGUgaW1hZ2VcIixcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9hdmF0LnBuZ1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGVzY3JpcHRpb25cIn0sXCJmXCI6W1wiV0VMQ09NRSBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgxXCIsXCJhXCI6e1wiaWRcIjpcIm5hbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YS51c2VyLm5hbWVcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm1ldGEudXNlclwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiYVwiOntcImlkXCI6XCJuYW1lXCJ9LFwiZlwiOltcIkd1ZXN0IFVzZXJcIl19XSxcInhcIjp7XCJyXCI6W1wibWV0YS51c2VyXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwcm9mXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvbXlwcm9maWxlL1wifSxcImZcIjpbXCJNeSBQcm9maWxlXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIvYjJjL21vYmlsZS9teWJvb2tpbmdzL1wifSxcImZcIjpbXCJNeSBCb29raW5nc1wiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0cmF2XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvbXl0cmF2ZWxsZXIvXCJ9LFwiZlwiOltcIlRyYXZlbGxlcnNcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJpZFwiOlwiZGV2aWRlclwiLFwiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W1wiUVVJQ0sgVE9PTFNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmludFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvbW9iaWxlL215Ym9va2luZ3MvXCJ9LFwiZlwiOltcIlByaW50IC8gVmlldyBUaWNrZXRcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FuY2VsXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvbXlib29raW5ncy9cIn0sXCJmXCI6W1wiQ2FuY2VsYXRpb25zXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNoYW5nZVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvbW9iaWxlL215Ym9va2luZ3MvXCJ9LFwiZlwiOltcIkNoYW5nZSAvIFJlc2NoZWR1bGVcIl19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJsdWUgZmx1aWQgYnV0dG9uXCIsXCJocmVmXCI6XCIvc2l0ZS9sb2dvdXRcIn0sXCJmXCI6W1wiTG9nb3V0XCJdfV0sXCJuXCI6NTAsXCJyXCI6XCJtZXRhLnVzZXJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic2VjdGlvblwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZWNvbmRhcnkgcG9pbnRpbmcgdGhyZWUgaXRlbSBkZW1vIG1lbnUgdHJpcFR5cGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjE9PV8wXCJ9fV19LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzZWFyY2gudHJpcFR5cGVcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiT25lIFdheVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMj09XzBcIn19XX0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNlYXJjaC50cmlwVHlwZVxcXCIsMl1cIn19fSxcImZcIjpbXCJSb3VuZCBUcmlwXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOltcIml0ZW0gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIzPT1fMFwifX1dfSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2VhcmNoLnRyaXBUeXBlXFxcIiwzXVwifX19LFwiZlwiOltcIk11bHRpLUNpdHlcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInNlYXJjaC5wZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcIm11bHRpY2l0eVwifV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjM9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJzaWdubGVcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZvcm0gZXJyb3JcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiclwiOlwiZXJyb3JzLmZsaWdodC4wXCJ9XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjBcIn1dLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIzPT1fMFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaW5mb2RhdGViYW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImluZm9kYXRlYmFuX2xlZnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRyYXZlbGxlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2gucGFzc2VuZ2Vycy4wXCIsXCJzZWFyY2gucGFzc2VuZ2Vycy4xXCIsXCJzZWFyY2gucGFzc2VuZ2Vycy4yXCJdLFwic1wiOlwiXzArXzErXzJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIlRyYXZlbGxlclwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aHVtYmxlZnQgdHJhdmVsbGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS90cmF2ZWxsZXIucG5nXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpbmZvZGF0ZWJhbl9yaWdodFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidHJhdmVsQ2xhc3NcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRodW1icmlnaHQgdHJDbGFzc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy9tb2JpbGUvY2xhc3MucG5nXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJFY29ub21pY1wiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLmNhYmluVHlwZVwiXSxcInNcIjpcIjE9PV8wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJQcmVtaXVtIEVjb25vbWljXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2guY2FiaW5UeXBlXCJdLFwic1wiOlwiMj09XzBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIkJ1c2luZXNzXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2guY2FiaW5UeXBlXCJdLFwic1wiOlwiMz09XzBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIkZpcnN0XCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2guY2FiaW5UeXBlXCJdLFwic1wiOlwiND09XzBcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIkNsYXNzXCJdfV19XX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmb3JtIGVycm9yXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W10sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCJcXFwiZmxpZ2h0XFxcIj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwieFwiOntcInJcIjpbXCJpXCJdLFwic1wiOlwiXFxcImZsaWdodFxcXCI9PV8wXCJ9fV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJidG5fcGFzc2VuZ2VyXCIsXCJjbGFzc1wiOlwiZmx1aWQgaHVnZSB1aSBibHVlIGJ1dHRvblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiU0VBUkNIIEZMSUdIVFNcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0cmF2ZWxsZXJzSW5mb1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb24gY2xvc2VidG5cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJUcmF2ZWxsZXJzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXNjcmlwdGlvblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicGlua19hZ2VcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRocmVlIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJ5cnNfY29sXzFcIixcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W1wiQURVTFQgKDEyKyBZUlMpIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInlyc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1pbnVzXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZW1vdmVUcmF2ZWxlclwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIlswXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9taW51cy5wbmdcIixcImFsdFwiOlwibWluXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJ0ZXh0XCIsXCJuYW1lXCI6XCJhXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5wYXNzZW5nZXJzLjBcIn1dLFwiaWRcIjpcImMxXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwicGx1c1wiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYWRkVHJhdmVsZXJcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbMF1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy9tb2JpbGUvcGx1c2UucG5nXCIsXCJhbHRcIjpcInBsdXNlXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJ5cnNfY29sXzJcIixcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W1wiQ0hJTEQgKDItMTIgWVJTKSBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ5cnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJtaW51c1wiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVtb3ZlVHJhdmVsZXJcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbMV1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy9tb2JpbGUvbWludXMucG5nXCIsXCJhbHRcIjpcIm1pblwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwidGV4dFwiLFwibmFtZVwiOlwiYVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2gucGFzc2VuZ2Vycy4xXCJ9XSxcImlkXCI6XCJjMVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInBsdXNcIixcImhyZWZcIjpcImphdmFzY3JpcHQ6O1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImFkZFRyYXZlbGVyXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiWzFdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL3BsdXNlLnBuZ1wiLFwiYWx0XCI6XCJwbHVzZVwifX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwieXJzX2NvbF8zXCIsXCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOltcIklORkFOVCAoMC0yIFlSUykgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwieXJzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwibWludXNcIixcImhyZWZcIjpcImphdmFzY3JpcHQ6O1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlbW92ZVRyYXZlbGVyXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiWzJdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL21pbnVzLnBuZ1wiLFwiYWx0XCI6XCJtaW5cIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInRleHRcIixcIm5hbWVcIjpcImFcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLnBhc3NlbmdlcnMuMlwifV0sXCJpZFwiOlwiYzFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJwbHVzXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJhZGRUcmF2ZWxlclwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIlsyXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9wbHVzZS5wbmdcIixcImFsdFwiOlwicGx1c2VcIn19XX1dfV19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWN0aW9uc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmx1ZSBidXR0b24gY2xvc2VidG5cIn0sXCJmXCI6W1wiRG9uZVwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIkNsYXNzSW5mb1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb24gY2xvc2VjbGFzc1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOltcIlRyYXZlbCBDbGFzc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGVzY3JpcHRpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5jYWJpblR5cGVcIl0sXCJzXCI6XCIxPT1fMFwifX1dfSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2VhcmNoLmNhYmluVHlwZVxcXCIsMV1cIn19fSxcImZcIjpbXCJFY29ub215XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOltcIml0ZW0gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2guY2FiaW5UeXBlXCJdLFwic1wiOlwiMz09XzBcIn19XX0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNlYXJjaC5jYWJpblR5cGVcXFwiLDNdXCJ9fX0sXCJmXCI6W1wiQnVzaW5lc3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5jYWJpblR5cGVcIl0sXCJzXCI6XCIyPT1fMFwifX1dfSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2VhcmNoLmNhYmluVHlwZVxcXCIsMl1cIn19fSxcImZcIjpbXCJQcmVtaXVtIEVjb25vbXlcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5jYWJpblR5cGVcIl0sXCJzXCI6XCI0PT1fMFwifX1dfSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2VhcmNoLmNhYmluVHlwZVxcXCIsNF1cIn19fSxcImZcIjpbXCJGaXJzdFwiXX1dfV19XX1dLFwicFwiOntcIm11bHRpY2l0eVwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZm9ybXNjcmVlbiBtdWx0aUNpdHlcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRocmVlIGZpZWxkc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoM1wiLFwiYVwiOntcImNsYXNzXCI6XCJ0ZXh0LWNlbnRlclwifSxcImZcIjpbXCJKb3VybmV5IFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJpXCJdLFwic1wiOlwiXzArMVwifX1dfSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWFpcnBvcnRcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIi4vZnJvbVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgdHJhbnNwYXJlbnRcIixcInBsYWNlaG9sZGVyXCI6XCJGUk9NXCIsXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJkb21lc3RpY1wiOlwiMVwifSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1haXJwb3J0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCIuL3RvXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0cmFuc3BhcmVudFwiLFwicGxhY2Vob2xkZXJcIjpcIlRPXCIsXCJkb21lc3RpY1wiOlwiMVwiLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwiLFwic3R5bGVcIjpcInBvc2l0aW9uOiByZWxhdGl2ZTtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZGF0ZVwiLFwiYVwiOntcImlucHV0XCI6XCIxXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIi4vZGVwYXJ0X2F0XCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkRFUEFSVCBPTlwiLFwibWluXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIl0sXCJzXCI6XCJfMCgpXCJ9fV19LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGVsZXRlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVtb3ZlRmxpZ2h0XCIsXCJhXCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W1wiwqBcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiXSxcInNcIjpcIl8wPjFcIn19XX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmb3JtIGVycm9yXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcInJ4XCI6e1wiclwiOlwiZXJyb3JzLmZsaWdodFwiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJpXCJ9XX19XX1dfV0sXCJuXCI6NTAsXCJyeFwiOntcInJcIjpcImVycm9ycy5mbGlnaHRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifV19fSx7XCJ0XCI6NyxcImVcIjpcImhyXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcInNlYXJjaC5mbGlnaHRzXCJ9LHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFkZC1mbGlnaHRcIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIGJhc2ljIGJ1dHRvbiBjaXJjdWxhclwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImFkZEZsaWdodFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiKyBBZGQgbmV3XCJdfV19XSxcInNpZ25sZVwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmb3Jtc2NyZWVuXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJfY2hhbmdlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0d28gY29sdW1uIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW4gZnVsbC1jb2x1bW4gZnJvbUFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktYWlycG9ydFwiLFwiYVwiOntcImJpZ1wiOlwiMVwiLFwiY2xhc3NcIjpcImZsdWlkIGxlZnRcIixcInRyYW5zcGFyZW50XCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiRlJPTVwiLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLmZyb21cIn1dLFwiZG9tZXN0aWNcIjpcIjFcIn0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiZnNkX3JcIixcImNsYXNzXCI6XCJjb2x1bW4gZnVsbC1jb2x1bW4gdG9BaXJwb3J0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWFpcnBvcnRcIixcImFcIjp7XCJiaWdcIjpcIjFcIixcImNsYXNzXCI6XCJmbHVpZCBsZWZ0XCIsXCJ0cmFuc3BhcmVudFwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIlRPXCIsXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5mbGlnaHRzLjAudG9cIn1dLFwiZG9tZXN0aWNcIjpcIjFcIn0sXCJmXCI6W119XX1dLFwiblwiOjUwLFwiclwiOlwic2VhcmNoLmRvbWVzdGljXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktYWlycG9ydFwiLFwiYVwiOntcImJpZ1wiOlwiMVwiLFwiY2xhc3NcIjpcImZsdWlkIGxlZnRcIixcInRyYW5zcGFyZW50XCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiRlJPTVwiLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLmZyb21cIn1dLFwiZG9tZXN0aWNcIjpcIjBcIn0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiZnNkX3JcIixcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktYWlycG9ydFwiLFwiYVwiOntcImJpZ1wiOlwiMVwiLFwiY2xhc3NcIjpcImZsdWlkIGxlZnRcIixcInRyYW5zcGFyZW50XCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiVE9cIixcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC50b1wifV0sXCJkb21lc3RpY1wiOlwiMFwifSxcImZcIjpbXX1dfV0sXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaW5mb2RhdGViYW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImluZm9kYXRlYmFuX2xlZnRcIixcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWRhdGVcIixcImFcIjp7XCJjbGFzc1wiOlwiZGF0ZV9kZXBhcnRfaW5mb1wiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwifV0sXCJsYWJlbFwiOlwiREVQQVJUVVJFXCIsXCJtaW5cIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcIm1vbWVudFwiXSxcInNcIjpcIl8wKClcIn19XSxcIm1heFwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCIsXCJzZWFyY2guZmxpZ2h0cy4wLnJldHVybl9hdFwiXSxcInNcIjpcIjI9PV8wJiZfMVwifX1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpbmZvZGF0ZWJhbl9yaWdodFwiLFwic3R5bGVcIjpcInBvc2l0aW9uOiByZWxhdGl2ZTtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNlYXJjaC50cmlwVHlwZVxcXCIsMl1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1kYXRlXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRhdGVfcmV0dXJuX2luZm9cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC5yZXR1cm5fYXRcIn1dLFwibGFiZWxcIjpcIlJFVFVSTlwiLFwibWluXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwiLFwibW9tZW50XCJdLFwic1wiOlwiXzB8fF8xKClcIn19XX19XX1dfV19fTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL2Zvcm0uaHRtbFxuICoqIG1vZHVsZSBpZCA9IDg2XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyXHJcbiAgICBMQVJHRSA9ICdsYXJnZScsXHJcbiAgICBESVNBQkxFRCA9ICdkaXNhYmxlZCcsXHJcbiAgICBMT0FESU5HID0gJ2ljb24gbG9hZGluZycsXHJcbiAgICBERUNPUkFURUQgPSAnZGVjb3JhdGVkJyxcclxuICAgIEVSUk9SID0gJ2Vycm9yJyxcclxuICAgIElOID0gJ2luJ1xyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vc3Bpbm5lci5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2xhc3NlczogZnVuY3Rpb24oc3RhdGUsIGxhcmdlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGRhdGEuc3RhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUuZGlzYWJsZWQgfHwgZGF0YS5zdGF0ZS5zdWJtaXR0aW5nKSBjbGFzc2VzLnB1c2goRElTQUJMRUQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmxvYWRpbmcpIGNsYXNzZXMucHVzaChMT0FESU5HKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5lcnJvcikgY2xhc3Nlcy5wdXNoKEVSUk9SKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubGFyZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goREVDT1JBVEVEKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goTEFSR0UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSB8fCBkYXRhLmZvY3VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChJTik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24oKSB7ICBpZiAodGhpcy5nZXQoJ2Vycm9yJykpIHRoaXMuc2V0KCdlcnJvcicsIGZhbHNlKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcblxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSlcclxuICAgICAgICAgICAgLm9uKCdmb2N1cy5hcGknLCBmdW5jdGlvbigpIHsgdmlldy5zZXQoJ2ZvY3VzJywgdHJ1ZSk7IH0pXHJcbiAgICAgICAgICAgIC5vbignYmx1ci5hcGknLCBmdW5jdGlvbigpIHsgdmlldy5zZXQoJ2ZvY3VzJywgZmFsc2UpOyB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgb250ZWFyZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLm9mZignLmFwaScpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgaW5jOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdiA9IF8ucGFyc2VJbnQodGhpcy5nZXQoJ3ZhbHVlJykpICsgMTtcclxuXHJcbiAgICAgICAgaWYgKHYgPD0gdGhpcy5nZXQoJ21heCcpKVxyXG4gICAgICAgICAgICB0aGlzLnNldCgndmFsdWUnLCB2KTtcclxuICAgIH0sXHJcblxyXG4gICAgZGVjOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdiA9IF8ucGFyc2VJbnQodGhpcy5nZXQoJ3ZhbHVlJykpIC0gMTtcclxuXHJcbiAgICAgICAgaWYgKHYgPj0gdGhpcy5nZXQoJ21pbicpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9zcGlubmVyLmpzXG4gKiogbW9kdWxlIGlkID0gODdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA0IDVcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIHNlbGVjdGlvbiBpbnB1dCBzcGlubmVyIGRyb3Bkb3duIGluIFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY2xhc3Nlc1wiLFwic3RhdGVcIixcImxhcmdlXCIsXCJ2YWx1ZVwiXSxcInNcIjpcIl8wKF8xLF8yLF8zKVwifX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImhpZGRlblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcGxhY2Vob2xkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJsYXJnZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0ZXh0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInZhbHVlXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc3Bpbm5lciBidXR0b24gaW5jXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiaW5jXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCIrXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzcGlubmVyIGJ1dHRvbiBkZWNcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJkZWNcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIi1cIl19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA4OFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbnZhciBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudCcpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL2FpcnBvcnQuaHRtbCcpLFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlkOiBfLnVuaXF1ZUlkKCdhaXJwb3J0XycpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcywgbWV0YSA9IHRoaXMuZ2V0KCdtZXRhJyksIGFwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3ZhbHVlJykpIHtcclxuICAgICAgICAgICAgaWYgKGFwID0gbWV0YS5nZXQoJ2FpcnBvcnQnKSh0aGlzLmdldCgndmFsdWUnKSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIGFwLmlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdjaXR5JywgYXAuY2l0eV9uYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdjb2RlJywgYXAuYWlycG9ydF9jb2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9mbGlnaHRzL2FpcnBvcnQvJyArIHRoaXMuZ2V0KCd2YWx1ZScpLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndmFsdWUnLCBkYXRhLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY29kZScsIGRhdGEudGV4dC5zbGljZSgtNCwgLTEpKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2l0eScsIGRhdGEudGV4dC5zbGljZSgwLCAtNikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICBkZWJvdW5jZSxcclxuICAgICAgICAgICAgYWlycHMsXHJcbiAgICAgICAgICAgIGZpbHRlcmVkLFxyXG4gICAgICAgICAgICBhaXJwb3J0cyA9IHRoaXMuZ2V0KCdkb21lc3RpYycpID8gdGhpcy5nZXQoJ21ldGEuZG9tZXN0aWMnKSA6IFtdLFxyXG4gICAgICAgICAgICBxdWVyeSA9ICcnLFxyXG4gICAgICAgICAgICBpZCA9IHRoaXMuZ2V0KCdpZCcpLFxyXG4gICAgICAgICAgICBlbCA9IHRoaXMuZmluZCgnaW5wdXQuYWlycG9ydCcpLFxyXG4gICAgICAgICAgICB0aW1lb3V0LCBhamF4O1xyXG5cclxuICAgICAgICBhaXJwcyA9ICQubWFwKGFpcnBvcnRzLCBmdW5jdGlvbiAodmFsLCBpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnPGRpdj48ZGl2IGNsYXNzPVwibWQtYWlycG9ydC1uYW1lXCIgZGF0YS1pZD1cIicgKyAgdmFsLmlkICsgJ1wiPicgKyB2YWwuY2l0eV9uYW1lICsgJyAoJyArIHZhbC5haXJwb3J0X2NvZGUgKyAnKScgKyAnPC9kaXY+PC9kaXY+JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWwuaWQsXHJcbiAgICAgICAgICAgICAgICBjaXR5OiB2YWwuY2l0eV9uYW1lLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdmFsLmFpcnBvcnRfY29kZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmaWx0ZXJlZCA9IGFpcnBzO1xyXG5cclxuICAgICAgICAkKGVsKS5tb2Jpc2Nyb2xsKCkuc2VsZWN0KHtcclxuICAgICAgICAgICAgYnV0dG9uczogW10sXHJcbiAgICAgICAgICAgIHRoZW1lOiAnbW9iaXNjcm9sbCcsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6ICd0b3AnLFxyXG4gICAgICAgICAgICBkYXRhOiBmaWx0ZXJlZCxcclxuICAgICAgICAgICAgbGF5b3V0OiAnbGlxdWlkJyxcclxuICAgICAgICAgICAgc2hvd0xhYmVsOiBmYWxzZSxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgcm93czogMyxcclxuICAgICAgICAgICAgb25NYXJrdXBSZWFkeTogZnVuY3Rpb24gKG1hcmt1cCwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgbWFya3VwLmFkZENsYXNzKCdtZC1haXJwb3J0cycpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJzxkaXYgc3R5bGU9XCJwYWRkaW5nOi41ZW1cIj48aW5wdXQgY2xhc3M9XCJtZC1maWx0ZXItaW5wdXRcIiB0YWJpbmRleD1cIjBcIiBwbGFjZWhvbGRlcj1cIkNpdHkgbmFtZSBvciBhaXJwb3J0IGNvZGVcIiAvPjwvZGl2PicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnByZXBlbmRUbygkKCcuZHdjYycsIG1hcmt1cCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICAub24oJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSAkKCdpbnB1dCcsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZGVib3VuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJvdW5jZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSB0aGF0LnZhbCgpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSAkLmdyZXAoYWlycHMsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMCA9PSB2YWwuY2l0eS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkpIHx8IDAgPT0gdmFsLmNvZGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LnNldHRpbmdzLmRhdGEgPSBmaWx0ZXJlZC5sZW5ndGggPyBmaWx0ZXJlZCA6IFt7dGV4dDogJ05vIHJlc3VsdHMnLCB2YWx1ZTogJyd9XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LnNldHRpbmdzLnBhcnNlVmFsdWUoaW5zdC5zZXR0aW5ncy5kYXRhWzBdLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhamF4LmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFqYXggPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvc2VhcmNoQWlycG9ydCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IHRlcm06IHF1ZXJ5IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gXy5tYXAoZGF0YSwgZnVuY3Rpb24oaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGkuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnPGRpdj48ZGl2IGNsYXNzPVwibWQtYWlycG9ydC1uYW1lXCIgZGF0YS1pZD1cIicgKyAgaS5pZCArICdcIj4nICsgaS5sYWJlbCArICc8L2Rpdj48L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MuZGF0YSA9IGZpbHRlcmVkLmxlbmd0aCA/IGZpbHRlcmVkIDogW3t0ZXh0OiAnTm8gcmVzdWx0cycsIHZhbHVlOiAnJ31dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MucGFyc2VWYWx1ZShpbnN0LnNldHRpbmdzLmRhdGFbMF0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3QucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQmVmb3JlU2hvdzogZnVuY3Rpb24gKGluc3QpIHtcclxuICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MuZGF0YSA9IGFpcnBzO1xyXG4gICAgICAgICAgICAgICAgaW5zdC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAodiwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSAkKHYpLmZpbmQoJ2RpdicpLmRhdGEoKSxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9ICQodikudGV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjb2RlJywgbGFiZWwuc2xpY2UoLTQsIC0xKSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2l0eScsIGxhYmVsLnNsaWNlKDAsIC02KSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgndmFsdWUnLCBkYXRhLmlkKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgJCgnIycgKyBpZCArICdfZHVtbXknKS52YWwobGFiZWwpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvblZhbHVlVGFwOiBmdW5jdGlvbiAoaXRlbSwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgLy92YXIgZGF0YSA9ICQodikuZmluZCgnZGl2JykuZGF0YSgpLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgbGFiZWwgPSAkKHYpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyQoJyMnICsgaWQgKyAnX2R1bW15JykudmFsKGxhYmVsKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25TaG93OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubXMgPSAkKGVsKS5tb2Jpc2Nyb2xsKCdnZXRJbnN0Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMubXMuc2hvdygpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS9jb21wb25lbnRzL2ZsaWdodHMvYWlycG9ydC5qc1xuICoqIG1vZHVsZSBpZCA9IDg5XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzaG93XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvZGVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY29kZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNpdHlcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY2l0eVwifV19XSxcIm5cIjo1MCxcInJcIjpcInZhbHVlXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwbGFjZWhvbGRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwbGFjZWhvbGRlclwifV19XSxcInJcIjpcInZhbHVlXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiYmlnXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbnB1dCBtZWRpdW1cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzaG93XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInBsYWNlaG9sZGVyXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dLFwidHlwZVwiOlwidGV4dFwiLFwicmVhZG9ubHlcIjpcInJlYWRvbmx5XCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjaXR5XCJ9LFwiIChcIix7XCJ0XCI6MixcInJcIjpcImNvZGVcIn0sXCIpXCJdLFwiblwiOjUwLFwiclwiOlwidmFsdWVcIn1dfX1dfV0sXCJyXCI6XCJiaWdcIn0se1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwiZGlzcGxheTogbm9uZTtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJpZFwiOlt7XCJ0XCI6MixcInJcIjpcImlkXCJ9XSxcImNsYXNzXCI6XCJhaXJwb3J0XCIsXCJ0eXBlXCI6XCJoaWRkZW5cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9haXJwb3J0Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA5MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50LmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NhbGVuZGFyLmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtb21lbnQ6IG1vbWVudCxcclxuICAgICAgICAgICAgd29ya2VyOiBtb21lbnQoKS5zdGFydE9mKCdtb250aCcpLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuXHJcbiAgICAgICAgICAgIGZvcm1hdENhbGVuZGFyOiBmdW5jdGlvbiAod29ya2VyLCB2YWx1ZSwgbWluLCBtYXgsIHNlY29uZCkge1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kID0gc2Vjb25kIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWNvbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrZXIgPSB3b3JrZXIuY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNoaWZ0ID0gd29ya2VyLnN0YXJ0T2YoJ21vbnRoJykud2Vla2RheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRheXMgPSB3b3JrZXIuZW5kT2YoJ21vbnRoJykuZGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlID0gdGhpcy5nZXQoJ3JhbmdlJykgfHwgW10sXHJcbiAgICAgICAgICAgICAgICAgICAgd2Vla3MgPSBbXSxcclxuXHQgICAgICAgICAgICB5ZWFybGlzdCA9IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB5ZWFycyA9IG1vbWVudCgpLmRpZmYobW9tZW50KCksICd5ZWFycycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRZZWFyID0gbW9tZW50KCkueWVhcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB5ZWFybGlzdC5wdXNoKGN1cnJlbnRZZWFyIC0gaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIF8uZWFjaChfLnJhbmdlKDEsIGRheXMrMSksIGZ1bmN0aW9uICh2LCBrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQoW3dvcmtlci55ZWFyKCksIHdvcmtlci5tb250aCgpLCB2XSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kID0gc2hpZnQgKyBrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gKF9kLzcpID4+IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBfZCAlIDcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYWN0aXZlID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNscyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghd2Vla3Nbd10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vla3Nbd10gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXlzOiBfLnJhbmdlKDcpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBudWxsOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiAmJiBtLmlzQmVmb3JlKG1pbiwgJ2RheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXggJiYgbS5pc0FmdGVyKG1heCwgJ2RheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5hY3RpdmUpIGNsc1tjbHMubGVuZ3RoXSA9ICdpbmFjdGl2ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlWzBdICYmIG0uaXNTYW1lKHJhbmdlWzBdLCAnZGF5JykpIGNsc1tjbHMubGVuZ3RoXSA9ICdyYW5nZSBzdGFydCc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlWzFdICYmIG0uaXNTYW1lKHJhbmdlWzFdLCAnZGF5JykpIGNsc1tjbHMubGVuZ3RoXSA9ICdyYW5nZSBlbmQnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW5nZVswXSAmJiByYW5nZVsxXSAmJiBtLmlzQmV0d2VlbihyYW5nZVswXSwgcmFuZ2VbMV0sICdkYXknKSkgY2xzW2Nscy5sZW5ndGhdID0gJ3JhbmdlJztcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY2xzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2Vla3Nbd10uZGF5c1tkXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogdixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHZhbHVlID8gbS5pc1NhbWUodmFsdWUsICdkYXknKSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogY2xzLmpvaW4oJyAnKVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbW9udGg6IHdvcmtlci5tb250aCgpLCB5ZWFyOiB3b3JrZXIueWVhcigpLCB3ZWVrczogd2Vla3MsIHdvcmtlcjogd29ya2VyLHllYXJsaXN0OiB5ZWFybGlzdCwgc2VsZWN0ZWRtb250aDogd29ya2VyLm1vbnRoKCksIHNlbGVjdGVkeWVhcjogd29ya2VyLnllYXIoKSB9O1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnbWluJywgZnVuY3Rpb24obWluKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCBtaW4gPyBtaW4uY2xvbmUoKS5zdGFydE9mKCdtb250aCcpIDogbW9tZW50KCkuc3RhcnRPZignbW9udGgnKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gbW9tZW50KHZhbHVlKS5jbG9uZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHcgPSB0aGlzLmdldCgnd29ya2VyJykuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldCgndHdvbW9udGgnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAody5zdGFydE9mKCdtb250aCcpLmlzQWZ0ZXIodikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCB2LnN0YXJ0T2YoJ21vbnRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAody5hZGQoMSwgJ21vbnRoJykuZW5kT2YoJ21vbnRoJykuaXNCZWZvcmUodikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCB2LnN0YXJ0T2YoJ21vbnRoJykuc3Vic3RyYWN0KDEsICdtb250aCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnd29ya2VyJywgbW9tZW50KHZhbHVlKS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnd29ya2VyJywgbW9tZW50KHZhbHVlKS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSwge2luaXQ6IHRydWV9KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtb21lbnQodmFsdWUpO1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdtYXgnKSAmJiB2YWx1ZS5pc0FmdGVyKHRoaXMuZ2V0KCdtYXgnKS5lbmRPZignZGF5JykpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldCgnbWluJykgJiYgdmFsdWUuaXNCZWZvcmUodGhpcy5nZXQoJ21pbicpLnN0YXJ0T2YoJ2RheScpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldCgndmFsdWUnLCBtb21lbnQodmFsdWUpKTtcclxuICAgIH0sXHJcblxyXG4gICAgbmV4dDogZnVuY3Rpb24od29ya2VyKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3dvcmtlcicsIHdvcmtlci5hZGQoMSwgJ21vbnRoJykpO1xyXG4gICAgfSxcclxuXHJcbiAgICBwcmV2OiBmdW5jdGlvbih3b3JrZXIpIHtcclxuICAgICAgICB0aGlzLnNldCgnd29ya2VyJywgd29ya2VyLmFkZCgtMSwgJ21vbnRoJykpO1xyXG4gICAgfSxcclxuXHRzZWxlY3Rtb250aDogZnVuY3Rpb24gKHdvcmtlcikge1xyXG4gICAgICAgIHZhciB5ZWFyID0gd29ya2VyLnllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSAkKCcjc2VsZWN0ZWRtb250aCcpLnZhbCgpO1xyXG4gICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCBtb21lbnQoW3llYXIsIG1vbnRoXSkpO1xyXG4gICAgfSxcclxuICAgIHNlbGVjdHllYXI6IGZ1bmN0aW9uICh3b3JrZXIpIHsgICAgICAgXHJcbiAgICAgICAgdmFyIHllYXIgPSAkKCcjc2VsZWN0ZWR5ZWFyJykudmFsKCk7XHJcbiAgICAgICAgdmFyIG1vbnRoID0gd29ya2VyLm1vbnRoKCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3dvcmtlcicsIG1vbWVudChbeWVhciwgbW9udGhdKSk7ICAgICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCcjc2VsZWN0ZWRtb250aCcpKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJyNzZWxlY3RlZHllYXInKSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHRcclxuXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vY2FsZW5kYXIuanNcbiAqKiBtb2R1bGUgaWQgPSA5MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgY2FsZW5kYXIgXCIse1widFwiOjQsXCJmXCI6W1widHdvbW9udGggcmVsYXhlZFwiXSxcIm5cIjo1MCxcInJcIjpcInR3b21vbnRoXCIsXCJzXCI6dHJ1ZX0sXCIgZ3JpZFwiXX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJlaWdodCB3aWRlIGNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNpeHRlZW4gd2lkZSBjb2x1bW4gY2VudGVyIGFsaWduZWQgbW9udGhcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJsZWZ0XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicHJldlwiLFwiYVwiOntcInJcIjpbXCJ+L3dvcmtlclwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRyaWFuZ2xlIGxlZnQgaWNvblwifX1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiLi93b3JrZXJcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcIk1NTU0gWVlZWVxcXCIpXCJ9fV19LFwiIFwiLHtcInRcIjo4LFwiclwiOlwibW9udGhcIn1dLFwieFwiOntcInJcIjpbXCJmb3JtYXRDYWxlbmRhclwiLFwid29ya2VyXCIsXCJ2YWx1ZVwiLFwibWluXCIsXCJtYXhcIl0sXCJzXCI6XCJfMChfMSxfMixfMyxfNCxmYWxzZSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZWlnaHQgd2lkZSBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzaXh0ZWVuIHdpZGUgY29sdW1uIGNlbnRlciBhbGlnbmVkIG1vbnRoXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwicmlnaHRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJuZXh0XCIsXCJhXCI6e1wiclwiOltcIn4vd29ya2VyXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwidHJpYW5nbGUgcmlnaHQgaWNvblwifX1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiLi93b3JrZXJcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcIk1NTU0gWVlZWVxcXCIpXCJ9fV19LFwiIFwiLHtcInRcIjo4LFwiclwiOlwibW9udGhcIn1dLFwieFwiOntcInJcIjpbXCJmb3JtYXRDYWxlbmRhclwiLFwid29ya2VyXCIsXCJ2YWx1ZVwiLFwibWluXCIsXCJtYXhcIl0sXCJzXCI6XCJfMChfMSxfMixfMyxfNCx0cnVlKVwifX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJ0d29tb250aFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2l4dGVlbiB3aWRlIGNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNpeHRlZW4gd2lkZSBjb2x1bW4gY2VudGVyIGFsaWduZWQgbW9udGhcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwibGVmdFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInByZXZcIixcImFcIjp7XCJyXCI6W1wifi93b3JrZXJcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ0cmlhbmdsZSBsZWZ0IGljb25cIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJpZ2h0XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwibmV4dFwiLFwiYVwiOntcInJcIjpbXCJ+L3dvcmtlclwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRyaWFuZ2xlIHJpZ2h0IGljb25cIn19XX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcIi4vd29ya2VyXCJdLFwic1wiOlwiXzAuZm9ybWF0KFxcXCJNTU1NIFlZWVlcXFwiKVwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJjaGFuZ2V5ZWFyXCJdLFwic1wiOlwiXzAhPVxcXCIxXFxcIlwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGlucHV0IHNlbGVjdCBzbWFsbFwiLFwic3R5bGVcIjpcIndpZHRoOjMwJVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWxlY3RcIixcImFcIjp7XCJpZFwiOlwic2VsZWN0ZWRtb250aFwifSxcInZcIjp7XCJjaGFuZ2VcIjp7XCJtXCI6XCJzZWxlY3Rtb250aFwiLFwiYVwiOntcInJcIjpbXCJ+L3dvcmtlclwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWxlY3RlZG1vbnRoXCIsXCJpXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV0sXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJpXCJ9XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInhcIjp7XCJyXCI6W1wibW9tZW50XCJdLFwic1wiOlwiXzAubW9udGhzU2hvcnQoKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGlucHV0IHNlbGVjdCBzbWFsbFwiLFwic3R5bGVcIjpcIndpZHRoOjMwJVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWxlY3RcIixcImFcIjp7XCJpZFwiOlwic2VsZWN0ZWR5ZWFyXCJ9LFwidlwiOntcImNoYW5nZVwiOntcIm1cIjpcInNlbGVjdHllYXJcIixcImFcIjp7XCJyXCI6W1wifi93b3JrZXJcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VsZWN0ZWR5ZWFyXCIsXCJpXCIsXCJ5ZWFybGlzdFwiXSxcInNcIjpcIl8wPT1fMltfMV1cIn19XSxcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwieWVhcmxpc3RcIn1dfV19XSxcInhcIjp7XCJyXCI6W1wiY2hhbmdleWVhclwiXSxcInNcIjpcIl8wIT1cXFwiMVxcXCJcIn19XX0sXCIgXCIse1widFwiOjgsXCJyXCI6XCJtb250aFwifV0sXCJ4XCI6e1wiclwiOltcImZvcm1hdENhbGVuZGFyXCIsXCJ3b3JrZXJcIixcInZhbHVlXCIsXCJtaW5cIixcIm1heFwiXSxcInNcIjpcIl8wKF8xLF8yLF8zLF80LGZhbHNlKVwifX1dfV0sXCJyXCI6XCJ0d29tb250aFwifV19XSxcInBcIjp7XCJtb250aFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZXZlbiBjb2x1bW4gZ3JpZCB3ZWVrZGF5cyBjZW50ZXIgYWxpZ25lZFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiBpbmFjdGl2ZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIl0sXCJzXCI6XCJfMC53ZWVrZGF5c1Nob3J0KClcIn19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNldmVuIGNvbHVtbiBncmlkIHdlZWtkYXlzIGNlbnRlciBhbGlnbmVkXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImNvbHVtbiBcIix7XCJ0XCI6MixcInJcIjpcImNsYXNzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInJcIjpcInNlbGVjdGVkXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImluYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJkYXRlXCJdLFwic1wiOlwiIV8wXCJ9fV19LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0VmFsdWVcIixcImFcIjp7XCJyXCI6W1wieWVhclwiLFwibW9udGhcIixcImRhdGVcIl0sXCJzXCI6XCJbW18wLF8xLF8yXV1cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXlcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLi9kYXRlXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLi9kYXRlXCJ9XX1dLFwiblwiOjUyLFwiclwiOlwiZGF5c1wifV19XSxcIm5cIjo1MixcInJcIjpcIndlZWtzXCJ9XX19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NhbGVuZGFyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA5MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBwYWdlID0gcmVxdWlyZSgncGFnZS5qcycpO1xyXG5cclxudmFyIFBhZ2UgPSByZXF1aXJlKCdjb21wb25lbnRzL3BhZ2UnKSxcclxuICAgIFNlYXJjaCA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvc2VhcmNoJyksXHJcbiAgICBGbGlnaHQgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0JyksXHJcbiAgICBGaWx0ZXIgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L2ZpbHRlcicpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2UuZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvcGFnZXMvZmxpZ2h0cy9yZXN1bHRzLmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ3Jlc3VsdHMnOiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMnKSxcclxuXHJcbiAgICAgICAgJ21vZGlmeS1zaW5nbGUnOiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL21vZGlmeS9zaW5nbGUnKSxcclxuICAgICAgICAnbW9kaWZ5LW11bHRpY2l0eSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eScpLFxyXG5cclxuICAgICAgICAnZmlsdGVyJzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9maWx0ZXInKSxcclxuICAgICAgICAnc2VhcmNoLWZvcm0nOiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL2Zvcm0nKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtaW5wYW5lbDogdHJ1ZSxcclxuXHJcbiAgICAgICAgICAgIGZvcmNlOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIHBlbmRpbmc6IDEsXHJcbiAgICAgICAgICAgIHNlYXJjaDogbnVsbCxcclxuICAgICAgICAgICAgZmxpZ2h0czogW10sXHJcblxyXG4gICAgICAgICAgICBtZXRhOiBNZXRhLm9iamVjdFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5wZW5kaW5nID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh2aWV3LmdldCgncGVuZGluZycpID49IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCBNYXRoLm1pbigxMDAsIHZpZXcuZ2V0KCdwZW5kaW5nJykgKyAwLjI1KSk7XHJcbiAgICAgICAgfSwgNDEpO1xyXG5cclxuICAgICAgICBTZWFyY2gubG9hZCh0aGlzLmdldCgndXJsJyksIHRoaXMuZ2V0KCdmb3JjZScpLCB0aGlzLmdldCgnY3MnKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2VhcmNoKSB7IHZpZXcuc2V0KCdzZWFyY2gnLCBzZWFyY2gpOyB2aWV3LmZldGNoRmxpZ2h0cyhzZWFyY2gpOyB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHsgcGFnZShST1VURVMuc2VhcmNoKSB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKTtcclxuXHJcbiAgICAgICAgaWYgKE1PQklMRSkge1xyXG4gICAgICAgICAgICB2YXIgb3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcih7IG9uSGlkZGVuOiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9LCBvblNob3c6IGZ1bmN0aW9uKCkgeyAkKCcjbV9idG4nKS5hZGRDbGFzcygnZGlzYWJsZWQnKTsgIH19KTtcclxuXHJcbiAgICAgICAgICAgICQoJyNmaWx0ZXInLCB0aGlzLmVsKS5vbignY2xpY2subGF5b3V0JyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZmV0Y2hGbGlnaHRzOiBmdW5jdGlvbihzZWFyY2gpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIEZsaWdodC5mZXRjaChzZWFyY2gpXHJcbiAgICAgICAgICAgIC5wcm9ncmVzcyhmdW5jdGlvbihyZXMpIHsgdmlldy5zZXQoJ2ZsaWdodHMnLCByZXMuZmxpZ2h0cyk7IH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykgeyBjbGVhckludGVydmFsKHZpZXcucGVuZGluZyk7IHZpZXcuZmluYWxpemUoc2VhcmNoLCByZXMpOyB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgZmluYWxpemU6IGZ1bmN0aW9uKHNlYXJjaCwgcmVzKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICBmaWx0ZXIgPSBGaWx0ZXIuZmFjdG9yeShzZWFyY2gsIHJlcy5mbGlnaHRzKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2V0KHsgcGVuZGluZzogZmFsc2UsIGZsaWdodHM6IHJlcy5mbGlnaHRzLCBmaWx0ZXI6IGZpbHRlciB9KTtcclxuXHJcbiAgICAgICAgaWYgKFNlYXJjaC5ST1VORFRSSVAgPT0gc2VhcmNoLmdldCgndHJpcFR5cGUnKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgncHJpY2VzJywgcmVzLnByaWNlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmaWx0ZXIub2JzZXJ2ZSgnZmxpZ2h0cycsIGZ1bmN0aW9uKGZsaWdodHMpIHsgdmlldy5zZXQoJ2ZsaWdodHMnLCBmbGlnaHRzKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcblxyXG5cclxuICAgICAgICBpZiAoIU1PQklMRSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VnbWVudHMgPSByZXMuZmxpZ2h0c1swXVswXS5zZWdtZW50cyxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tID0gc2VnbWVudHNbMF1bMF0uZnJvbSxcclxuICAgICAgICAgICAgICAgICAgICB0byA9IHNlZ21lbnRzWzBdW3NlZ21lbnRzWzBdLmxlbmd0aC0xXS50byxcclxuICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNlYXJjaC50b0pTT04oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmZmZmJywgc2VnbWVudHMsIGZyb20sIHRvKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZnJvbSAmJiB0bykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWNlbnQgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2VhcmNoZXMnKSB8fCBudWxsKSB8fCBbXTtcclxuICAgICAgICAgICAgICAgICAgICByZWNlbnQudW5zaGlmdCh7ZnJvbTogZnJvbSwgdG86IHRvLCBzZWFyY2g6IGNsb25lfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2VhcmNoZXMnLCBKU09OLnN0cmluZ2lmeShyZWNlbnQuc2xpY2UoMCw1KSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBub3QgYSBiaWcgZGVhbFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW9kaWZ5U2VhcmNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgICAgIHBhZ2UoUk9VVEVTLnNlYXJjaCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ21vZGlmeScsIG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnbW9kaWZ5JywgU2VhcmNoLnBhcnNlKHRoaXMuZ2V0KCdzZWFyY2gnKS50b0pTT04oKSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvcGFnZXMvZmxpZ2h0cy9yZXN1bHRzLmpzXG4gKiogbW9kdWxlIGlkID0gOTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJylcclxuICAgIDtcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSxcclxuICAgIFNlYXJjaCA9IHJlcXVpcmUoJy4vc2VhcmNoJyksXHJcbiAgICBST1VURVMgPSByZXF1aXJlKCdhcHAvcm91dGVzJykuZmxpZ2h0c1xyXG4gICAgO1xyXG5cclxudmFyIEZsaWdodCA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZWdtZW50czogW10sXHJcbiAgICAgICAgICAgIHByaWNlOiBudWxsLFxyXG4gICAgICAgICAgICByZWZ1bmRhYmxlOiAwLFxyXG5cclxuXHJcbiAgICAgICAgICAgIGZpcnN0OiBmdW5jdGlvbihzZWdtZW50cykgeyByZXR1cm4gc2VnbWVudHNbMF07IH0sXHJcbiAgICAgICAgICAgIGxhc3Q6IGZ1bmN0aW9uKHNlZ21lbnRzKSB7IHJldHVybiBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGgtMV07IH0sXHJcbiAgICAgICAgICAgIHN0b3BzOiBmdW5jdGlvbihzZWdtZW50cykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRzLmxlbmd0aC0xO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZWd0aW1lOiBmdW5jdGlvbihzZWdtZW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzZWdtZW50cylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZSA9IG1vbWVudC5kdXJhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIF8uZWFjaChzZWdtZW50cywgZnVuY3Rpb24oaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWUuYWRkKGkudGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZS5hZGQoaS5sYXlvdmVyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aW1lO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdmlhOiBmdW5jdGlvbihzZWdtZW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzZWdtZW50cylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChzZWdtZW50cy5zbGljZSgxKSwgZnVuY3Rpb24oaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaS5mcm9tO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICBkZXBhcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoJ3NlZ21lbnRzLjAuMC5kZXBhcnQnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBhcnJpdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoJ3NlZ21lbnRzLjAuJyArICh0aGlzLmdldCgnc2VnbWVudHMuMC5sZW5ndGgnKSAtIDEpICsgJy5hcnJpdmUnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpdGluZXJhcnk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuZ2V0KCdzZWdtZW50cy4wJyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gW3NbMF0uZnJvbS5haXJwb3J0Q29kZSwgc1tzLmxlbmd0aC0xXS50by5haXJwb3J0Q29kZV0uam9pbignLScpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNhcnJpZXJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8udW5pcXVlKFxyXG4gICAgICAgICAgICAgICAgXy51bmlvbi5hcHBseShudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIF8ubWFwKHRoaXMuZ2V0KCdzZWdtZW50cycpLCBmdW5jdGlvbihzZWdtZW50cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoc2VnbWVudHMsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIGkuY2FycmllcjsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAnY29kZSdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuRmxpZ2h0LnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgZGF0YS5pZCA9IF8udW5pcXVlSWQoJ2ZsaWdodF8nKTtcclxuICAgIGRhdGEudGltZSA9IG1vbWVudC5kdXJhdGlvbigpO1xyXG4gICAgZGF0YS5zZWdtZW50cyA9IF8ubWFwKGRhdGEuc2VnbWVudHMsIGZ1bmN0aW9uKHNlZ21lbnRzKSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHNlZ21lbnRzLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWdtZW50ID0gXy5leHRlbmQoaSwge1xyXG4gICAgICAgICAgICAgICAgZGVwYXJ0OiBtb21lbnQoaS5kZXBhcnQpLFxyXG4gICAgICAgICAgICAgICAgYXJyaXZlOiBtb21lbnQoaS5hcnJpdmUpLFxyXG4gICAgICAgICAgICAgICAgdGltZTogbW9tZW50LmR1cmF0aW9uKGkudGltZSksXHJcbiAgICAgICAgICAgICAgICBsYXlvdmVyOiBtb21lbnQuZHVyYXRpb24oaS5sYXlvdmVyKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRhdGEudGltZSA9IGRhdGEudGltZS5hZGQoc2VnbWVudC50aW1lKS5hZGQoc2VnbWVudC5sYXlvdmVyKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBGbGlnaHQoe2RhdGE6IGRhdGF9KTtcclxufTtcclxuXHJcbkZsaWdodC5mZXRjaCA9IGZ1bmN0aW9uKHNlYXJjaCwgZGVmZXJyZWQpIHtcclxuICAgIGRlZmVycmVkID0gZGVmZXJyZWQgfHwgUS5kZWZlcigpO1xyXG5cclxuXHJcbiAgICBpZiAoIWRlZmVycmVkLnN0YXJ0ZWQpIHtcclxuICAgICAgICBkZWZlcnJlZC5zdGFydGVkID0gXy5ub3coKTtcclxuICAgICAgICBkZWZlcnJlZC51cGRhdGVkID0gbnVsbDtcclxuICAgICAgICBkZWZlcnJlZC5mbGlnaHRzID0gU2VhcmNoLlJPVU5EVFJJUCA9PSBfLnBhcnNlSW50KHNlYXJjaC5nZXQoJ3RyaXBUeXBlJykpID8gW1tdLCBbXV0gOiBfLm1hcChzZWFyY2guZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKCkgeyByZXR1cm4gW107IH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnY29uc3RydWN0ZWQgZmxpZ2h0cycsIGRlZmVycmVkLmZsaWdodHMsIHNlYXJjaC5nZXQoJ2ZsaWdodHMnKSk7XHJcbiAgICB9IGVsc2UgaWYgKF8ubm93KCkgLSBkZWZlcnJlZC5zdGFydGVkID4gU2VhcmNoLk1BWF9XQUlUX1RJTUUpIHtcclxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHsgc2VhcmNoOiBzZWFyY2gsIGZsaWdodHM6IGRlZmVycmVkLmZsaWdodHN9KTtcclxuICAgIH1cclxuXHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgIHVybDogUk9VVEVTLnNlYXJjaCxcclxuICAgICAgICBkYXRhOiB7IGlkczogc2VhcmNoLmdldCgnaWRzJyksIG9wdGlvbnM6IHNlYXJjaC50b0pTT04oKSwgdXBkYXRlZDogZGVmZXJyZWQudXBkYXRlZCB9LFxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdyZXNwb25zZSB0aW1lJywgXy5ub3coKSAtIHRpbWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oZmxpZ2h0cykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKGZsaWdodHMsIGZ1bmN0aW9uKGZsaWdodCkgeyByZXR1cm4gRmxpZ2h0LnBhcnNlKGZsaWdodCkgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGVmZXJyZWQubm90aWZ5KHsgc2VhcmNoOiBzZWFyY2gsIGRlZmVycmVkOiBkZWZlcnJlZCwgZmxpZ2h0czogZmxpZ2h0c30pO1xyXG5cclxuICAgICAgICAgICAgXy5lYWNoKGRlZmVycmVkLmZsaWdodHMsIGZ1bmN0aW9uKHYsIGspIHtcclxuICAgICAgICAgICAgICAgIGlmIChmbGlnaHRzW2tdKVxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLmZsaWdodHNba10gPSBfLnVuaW9uKHYsIGZsaWdodHNba10pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YS5wZW5kaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC51cGRhdGVkID0gZGF0YS51cGRhdGVkO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgRmxpZ2h0LmZldGNoKHNlYXJjaCwgZGVmZXJyZWQpOyB9LCBTZWFyY2guSU5URVJWQUwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7IHNlYXJjaDogc2VhcmNoLCBmbGlnaHRzOiBkZWZlcnJlZC5mbGlnaHRzLCBwcmljZXM6IGRhdGEucHJpY2VzIHx8IG51bGx9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGbGlnaHQ7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9mbGlnaHQvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA5NFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSxcclxuICAgIFNlYXJjaCA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvc2VhcmNoJylcclxuICAgIDtcclxuXHJcbnZhciB0Mm0gPSBmdW5jdGlvbih0aW1lKSB7XHJcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcclxuICAgIHJldHVybiBfLnBhcnNlSW50KGlbMF0pKjYwICsgXy5wYXJzZUludChpWzFdKTtcclxufTtcclxuXHJcbnZhciBmaWx0ZXIgPSBmdW5jdGlvbihmbGlnaHRzLCBmaWx0ZXJlZCwgYmFja3dhcmQpIHtcclxuICAgIGJhY2t3YXJkID0gYmFja3dhcmQgfHwgZmFsc2U7XHJcblxyXG4gICAgdmFyIGYgPSBfLmNsb25lRGVlcChmaWx0ZXJlZCksXHJcbiAgICAgICAgbGF5b3ZlciA9IGYubGF5b3ZlciA/IFt0Mm0oZi5sYXlvdmVyWzBdKSwgdDJtKGYubGF5b3ZlclsxXSldIDogbnVsbCxcclxuICAgICAgICBhcnJpdmUsIGRlcGFydHVyZVxyXG4gICAgICAgIDtcclxuXHJcbiAgICBpZiAoIWJhY2t3YXJkKSB7XHJcbiAgICAgICAgYXJyaXZlID0gZi5hcnJpdmFsID8gW3QybShmLmFycml2YWxbMF0pLCB0Mm0oZi5hcnJpdmFsWzFdKV0gOiBudWxsO1xyXG4gICAgICAgIGRlcGFydHVyZSA9IGYuZGVwYXJ0dXJlID8gW3QybShmLmRlcGFydHVyZVswXSksIHQybShmLmRlcGFydHVyZVsxXSldIDogbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJyaXZlID0gZi5hcnJpdmFsMiA/IFt0Mm0oZi5hcnJpdmFsMlswXSksIHQybShmLmFycml2YWwyWzFdKV0gOiBudWxsO1xyXG4gICAgICAgIGRlcGFydHVyZSA9IGYuZGVwYXJ0dXJlMiA/IFt0Mm0oZi5kZXBhcnR1cmUyWzBdKSwgdDJtKGYuZGVwYXJ0dXJlMlsxXSldIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gXy5maWx0ZXIoZmxpZ2h0cy5zbGljZSgpLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgdmFyIG9rID0gdHJ1ZSxcclxuICAgICAgICAgICAgcyA9IGkuZ2V0KCdzZWdtZW50cy4wJyk7XHJcblxyXG4gICAgICAgIGlmIChmLnByaWNlcyAmJiAhXy5pblJhbmdlKGkuZ2V0KCdwcmljZScpLCBmLnByaWNlc1swXS0wLjAwMSwgZi5wcmljZXNbMV0rMC4wMDEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmLmNhcnJpZXJzICYmIC0xID09IF8uaW5kZXhPZihmLmNhcnJpZXJzLCBzWzBdLmNhcnJpZXIuY29kZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGYuc3RvcHMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGwgPSBpLmdldCgnc2VnbWVudHMnKS5sZW5ndGg7IGogPCBsOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICgtMSA9PSBfLmluZGV4T2YoZi5zdG9wcywgaS5nZXQoJ3NlZ21lbnRzLicgKyBqKS5sZW5ndGgtMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkZXBhcnR1cmUgJiYgIV8uaW5SYW5nZSh0Mm0oc1swXS5kZXBhcnQuZm9ybWF0KCdISDptbScpKSwgZGVwYXJ0dXJlWzBdLTAuMDAxLCBkZXBhcnR1cmVbMV0rMC4wMDEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhcnJpdmUgJiYgIV8uaW5SYW5nZSh0Mm0oc1tzLmxlbmd0aC0xXS5hcnJpdmUuZm9ybWF0KCdISDptbScpKSwgYXJyaXZlWzBdLTAuMDAxLCBhcnJpdmVbMV0rMC4wMDEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYXlvdmVyKSB7XHJcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgXy5lYWNoKGkuZ2V0KCdzZWdtZW50cycpLCBmdW5jdGlvbihzZWdtZW50cykge1xyXG4gICAgICAgICAgICAgICAgXy5lYWNoKHNlZ21lbnRzLCBmdW5jdGlvbihzZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50LmxheW92ZXIgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgIV8uaW5SYW5nZShzZWdtZW50LmxheW92ZXIuYXNNaW51dGVzKCksIGxheW92ZXJbMF0tMC4wMDEsIGxheW92ZXJbMV0rMC4wMDEpXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG9rO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGYucmVmdW5kYWJsZSAmJiAyICE9IF8ucGFyc2VJbnQoaS5nZXQoJ3JlZnVuZGFibGUnKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbnZhciBGaWx0ZXIgPSBTdG9yZS5leHRlbmQoe1xyXG4gICAgdGltZW91dDogbnVsbCxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLm9ic2VydmUoJ2ZpbHRlcmVkJywgZnVuY3Rpb24oZmlsdGVyZWQpIHsgdGhpcy5maWx0ZXIoKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbHRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZmlsdGVyaW5nIG5heCcpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhpcy5kb0ZpbHRlcigpOyB9LmJpbmQodGhpcyksIEZpbHRlci5USU1FT1VUKVxyXG4gICAgfSxcclxuXHJcbiAgICBkb0ZpbHRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZpbHRlcmVkID0gdGhpcy5nZXQoJ2ZpbHRlcmVkJyk7XHJcblxyXG4gICAgICAgIGlmIChTZWFyY2guUk9VTkRUUklQID09IHRoaXMuZ2V0KCd0cmlwVHlwZScpICYmIHRoaXMuZ2V0KCdkb21lc3RpYycpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzJywgW2ZpbHRlcih0aGlzLmdldCgnb3JpZ2luYWwuMCcpLCBmaWx0ZXJlZCksIGZpbHRlcih0aGlzLmdldCgnb3JpZ2luYWwuMScpLCBmaWx0ZXJlZCwgdHJ1ZSldKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzJywgXy5tYXAodGhpcy5nZXQoJ29yaWdpbmFsJyksIGZ1bmN0aW9uKGZsaWdodHMpIHsgcmV0dXJuIGZpbHRlcihmbGlnaHRzLCBmaWx0ZXJlZCk7IH0pKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufSk7XHJcblxyXG5GaWx0ZXIuVElNRU9VVCA9IDMwMDtcclxuXHJcbkZpbHRlci5mYWN0b3J5ID0gZnVuY3Rpb24oc2VhcmNoLCByZXN1bHRzKSB7XHJcbiAgICB2YXIgZmlsdGVyID0gbmV3IEZpbHRlcigpLFxyXG4gICAgICAgIHByaWNlcyA9IFtdLFxyXG4gICAgICAgIGNhcnJpZXJzID0gW10sXHJcbiAgICAgICAgc3RvcHMgPSAwO1xyXG5cclxuICAgIF8uZWFjaChyZXN1bHRzLCBmdW5jdGlvbihmbGlnaHRzKSB7XHJcbiAgICAgICAgXy5lYWNoKGZsaWdodHMsIGZ1bmN0aW9uKGZsaWdodCkge1xyXG4gICAgICAgICAgICBwcmljZXNbcHJpY2VzLmxlbmd0aF0gPSBmbGlnaHQuZ2V0KCdwcmljZScpO1xyXG4gICAgICAgICAgICBjYXJyaWVyc1tjYXJyaWVycy5sZW5ndGhdID0gZmxpZ2h0LmdldCgnc2VnbWVudHMuMC4wLmNhcnJpZXInKTtcclxuXHJcbiAgICAgICAgICAgIF8uZWFjaChmbGlnaHQuZ2V0KCdzZWdtZW50cycpLCBmdW5jdGlvbihzZWdtZW50cykge1xyXG4gICAgICAgICAgICAgICAgc3RvcHMgPSBNYXRoLm1heChzdG9wcywgc2VnbWVudHMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjYXJyaWVycyA9IF8udW5pcXVlKGNhcnJpZXJzLCAnY29kZScpO1xyXG5cclxuICAgIGZpbHRlci5zZXQoe1xyXG4gICAgICAgIGRvbWVzdGljOiBzZWFyY2guZ2V0KCdkb21lc3RpYycpLFxyXG4gICAgICAgIHRyaXBUeXBlOiBzZWFyY2guZ2V0KCd0cmlwVHlwZScpLFxyXG4gICAgICAgIHN0b3BzOiBfLnJhbmdlKDAsIHN0b3BzKzEpLFxyXG4gICAgICAgIHByaWNlczogW01hdGgubWluLmFwcGx5KG51bGwsIHByaWNlcyksIE1hdGgubWF4LmFwcGx5KG51bGwsIHByaWNlcyldLFxyXG4gICAgICAgIGNhcnJpZXJzOiBjYXJyaWVycyxcclxuICAgICAgICBmaWx0ZXJlZDogeyBjYXJyaWVyczogXy5tYXAoY2FycmllcnMsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIGkuY29kZTsgfSksIHN0b3BzOiBfLnJhbmdlKDAsIHN0b3BzKzEpIH0sXHJcbiAgICAgICAgZmxpZ2h0czogcmVzdWx0cyxcclxuICAgICAgICBvcmlnaW5hbDogcmVzdWx0c1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGZpbHRlcjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvZmxpZ2h0L2ZpbHRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDk1XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJoZWFkZXJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdGhyZWUgY29sdW1uIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaWRcIjpcImJhY2tfYnRuXCIsXCJjbGFzc1wiOlwiYmFja19wYWdlXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJtb2RpZnlTZWFyY2hcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9hcnJvd19iYWNrLnBuZ1wiLFwiYWx0XCI6XCJiYWNrXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwibG9nb1wiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9sb2dvLnBuZ1wiLFwiYWx0XCI6XCJDaGVhcFRpY2tldC5pblwifX1dfV19LFwiIFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwibV9tZW51XCIsXCJjbGFzc1wiOlwidWkgbGVmdCB2ZXJ0aWNhbCBzaWRlYmFyIG1lbnUgcHVzaCBzY2FsZSBkb3duIG92ZXJsYXlcIn0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic2VjdGlvblwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsb2FkaW5nXCIsXCJzdHlsZVwiOlwiaGVpZ2h0OiAxMDBweDsgcG9zaXRpb246IHJlbGF0aXZlOyBtYXJnaW46IDIwcHg7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbmRpY2F0aW5nIHByb2dyZXNzIGFjdGl2ZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYmFyXCIsXCJzdHlsZVwiOltcImJhY2tncm91bmQtY29sb3I6ICNmZWUyNTI7IC13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbjogMzAwbXM7IHRyYW5zaXRpb24tZHVyYXRpb246IDMwMG1zOyB3aWR0aDogXCIse1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9LFwiJTtcIl19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJTZWFyY2hpbmcgZm9yIGZsaWdodHNcIl19XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcInBlbmRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicmVzdWx0c1wiLFwiYVwiOntcInBlbmRpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0c1wifV0sXCJwcmljZXNcIjpbe1widFwiOjIsXCJyXCI6XCJwcmljZXNcIn1dLFwiZmlsdGVyXCI6W3tcInRcIjoyLFwiclwiOlwiZmlsdGVyXCJ9XX19XSxcInJcIjpcInBlbmRpbmdcIn1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvcmVzdWx0cy5odG1sXG4gKiogbW9kdWxlIGlkID0gOTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICdyZXN1bHRzLW9uZXdheSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9vbmV3YXknKSxcclxuICAgICAgICAncmVzdWx0cy1yb3VuZHRyaXAnOiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvcm91bmR0cmlwJyksXHJcbiAgICAgICAgJ3Jlc3VsdHMtbXVsdGljaXR5JzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eScpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbC5yZXN1bHRzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKCAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpKjAuOCAgKSApIHtcclxuICAgICAgICAgICAgICAgIF8uZWFjaCh2aWV3LmZpbmRBbGxDb21wb25lbnRzKCdmbGlnaHRzJyksIGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgICAgIGZsaWdodHMubmV4dHBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhcmRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQod2luZG93KS5vZmYoJ3Njcm9sbC5yZXN1bHRzJyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMuanNcbiAqKiBtb2R1bGUgaWQgPSA5N1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInJlc3VsdHMtb25ld2F5XCIsXCJhXCI6e1wicGVuZGluZ1wiOlt7XCJ0XCI6MixcInJcIjpcInBlbmRpbmdcIn1dLFwic2VhcmNoXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoXCJ9XSxcImZsaWdodHNcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHRzXCJ9XX19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMT09XzBcIn19LHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJyZXN1bHRzLXJvdW5kdHJpcFwiLFwiYVwiOntcInBlbmRpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0c1wifV0sXCJwcmljZXNcIjpbe1widFwiOjIsXCJyXCI6XCJwcmljZXNcIn1dLFwiZmlsdGVyXCI6W3tcInRcIjoyLFwiclwiOlwiZmlsdGVyXCJ9XX19XSxcIm5cIjo1MCxcInJcIjpcInNlYXJjaC5kb21lc3RpY1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJyZXN1bHRzLW9uZXdheVwiLFwiYVwiOntcInBlbmRpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJwZW5kaW5nXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0c1wifV19fV0sXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIyPT1fMFwifX0se1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicmVzdWx0cy1tdWx0aWNpdHlcIixcImFcIjp7XCJwZW5kaW5nXCI6W3tcInRcIjoyLFwiclwiOlwicGVuZGluZ1wifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwiZmxpZ2h0c1wiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodHNcIn1dfX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIzPT1fMFwifX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDk4XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICBwYWdlID0gcmVxdWlyZSgncGFnZS5qcycpXHJcbiAgICA7XHJcblxyXG52YXIgQm9va2luZyA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvYm9va2luZycpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL29uZXdheS5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIGZsaWdodHM6IHJlcXVpcmUoJy4vZmxpZ2h0cycpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3QsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogMCxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGZsaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgIEJvb2tpbmcuY3JlYXRlKFtmbGlnaHQuZ2V0KCdzeXN0ZW0nKV0sIHsgY3M6IHZpZXcuZ2V0KCdzZWFyY2guY3MnKSwgIHVybDogdmlldy5nZXQoJ3NlYXJjaC51cmwnKSxjdXI6dmlldy5nZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oYm9va2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlKFJPVVRFUy5ib29raW5nKGJvb2tpbmcuZ2V0KCdpZCcpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcuZHJvcGRvd24nLCB0aGlzLmVsKS5kcm9wZG93bigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtb2RpZnlTZWFyY2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5tb2RpZnlTZWFyY2goKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9vbmV3YXkuanNcbiAqKiBtb2R1bGUgaWQgPSA5OVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBwYWdlID0gcmVxdWlyZSgncGFnZScpXHJcbiAgICA7XHJcblxyXG52YXIgVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldycpLFxyXG4gICAgRmxpZ2h0ID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodCcpLFxyXG4gICAgRGlhbG9nID0gcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvZGlhbG9nJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbnZhciBtb25leSA9IHJlcXVpcmUoJ2hlbHBlcnMvbW9uZXknKTtcclxuXHJcblxyXG52YXIgc3RlcCA9IHtcclxuICAgIHN1Ym1pdDogZnVuY3Rpb24gKHZpZXcsIGkpIHtcclxuICAgICAgICB2aWV3LnNldCgnc3RlcHMuJyArIGkgKyAnLnN1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICB2aWV3LnNldCgnc3RlcHMuJyArIGkgKyAnLmVycm9ycycsIHt9KTtcclxuICAgIH0sXHJcbiAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHZpZXcsIGkpIHtcclxuICAgICAgICB2aWV3LnNldCgnc3RlcHMuJyArIGkgKyAnLnN1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICB9LFxyXG4gICAgZXJyb3I6IGZ1bmN0aW9uICh2aWV3LCBpLCB4aHIpIHtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGlmICgzID09IHJlc3BvbnNlLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcicsIHJlc3BvbnNlLm1lc3NhZ2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKDQgPT0gcmVzcG9uc2UuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgRGlhbG9nLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjogJ1BheW1lbnQgRmFpbGVkJyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXNwb25zZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWydUcnkgQWdhaW4nLCBmdW5jdGlvbigpIHsgfV1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICg1ID09IHJlc3BvbnNlLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIERpYWxvZy5vcGVuKHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6ICdQcmljZSBDaGFuZ2UgQWxlcnQnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+U29ycnkhIFRoZSBwcmljZSBmb3IgeW91ciBib29raW5nIGhhcyBpbmNyZWFzZWQgYnkgPGJyPicgKyBtb25leShyZXNwb25zZS5lcnJvcnMucHJpY2VEaWZmLCBtZXRhLmdldCgnZGlzcGxheV9jdXJyZW5jeScpICsgJzwvZGl2PicpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1lc3NhZ2U6ICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+U29ycnkhIFRoZSBwcmljZSBmb3IgeW91ciBib29raW5nIGhhcyBpbmNyZWFzZWQgITxicj4gTmV3IHByaWNlIGlzICcgKyBtb25leShyZXNwb25zZS5lcnJvcnMucHJpY2UsIG1ldGEuZ2V0KCdkaXNwbGF5X2N1cnJlbmN5JykgKyAnPC9kaXY+JyksXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbJ0JhY2sgdG8gU2VhcmNoJywgZnVuY3Rpb24oKSB7IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvZmxpZ2h0cycgKyB2aWV3LmdldCgnc2VhcmNodXJsJykgKyAnP2ZvcmNlJzsgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFsnQ29udGludWUnLCBmdW5jdGlvbigpIHsgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9ib29raW5nLycgKyB2aWV3LmdldCgnaWQnKSArICc/Xz0nICsgXy5ub3coKSB9XVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLicgKyBpICsgJy5lcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RlcHMuJyArIGkgKyAnLmVycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLicgKyBpICsgJy5lcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgZG9QYXkgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIGZvcm07XHJcbiAgICBmb3JtID0gJCgnPGZvcm0gLz4nLCB7XHJcbiAgICAgICAgaWQ6ICd0bXBGb3JtJyxcclxuICAgICAgICBhY3Rpb246IGRhdGEudXJsLFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIHN0eWxlOiAnZGlzcGxheTogbm9uZTsnXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgaW5wdXQgPSBkYXRhLmRhdGE7XHJcbiAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAndW5kZWZpbmVkJyAmJiBpbnB1dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICQuZWFjaChpbnB1dCwgZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgJCgnPGlucHV0IC8+Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbyhmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm0uYXBwZW5kVG8oJ2JvZHknKS5zdWJtaXQoKTtcclxufTtcclxuXHJcbnZhciBtZXRhID0gbnVsbDtcclxudmFyIEJvb2tpbmcgPSBWaWV3LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaXNCb29rZWQ6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJzID09IDggfHwgYnMgPT0gOSB8fCBicyA9PSAxMCB8fCBicyA9PSAxMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaW5Qcm9jZXNzOiBmdW5jdGlvbiAoYnMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhKGJzID09IDggfHwgYnMgPT0gOSB8fCBicyA9PSAxMCB8fCBicyA9PSAxMSkgJiYgIShicyA9PSAxKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXNOZXc6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDEgPT0gYnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgcHJpY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ucmVkdWNlKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uIChyZXN1bHQsIGkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgKyBpLmdldCgncHJpY2UnKTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdzdGVwcy40LmFjdGl2ZScpICYmICF0aGlzLmdldCgnYm9va2luZy5haXJjYXJ0X2lkJykpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGVwNCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdwYXltZW50LmVycm9yJykpIHtcclxuICAgICAgICAgICAgRGlhbG9nLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyOiAnUGF5bWVudCBGYWlsZWQnLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5nZXQoJ3BheW1lbnQuZXJyb3InKSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICBbJ1RyeSBBZ2FpbicsIGZ1bmN0aW9uKCkgeyB9XVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKGkpIHsgbWV0YSA9IGk7IH0pO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgYWN0aXZhdGU6IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N0ZXBzLiouYWN0aXZlJywgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdGVwcy4nICsgaSArICcuYWN0aXZlJywgdHJ1ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0ZXBzLicgKyBpICsgJy5hY3RpdmUnKTtcclxuICAgIH0sXHJcbiAgICBzdGVwMTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gUS5kZWZlcigpO1xyXG5cclxuICAgICAgICBzdGVwLnN1Ym1pdCh0aGlzLCAxKTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdGltZW91dDogNjAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL3N0ZXAxJyxcclxuICAgICAgICAgICAgZGF0YToge2lkOiB0aGlzLmdldCgnaWQnKSwgdXNlcjogdGhpcy5nZXQoJ3VzZXInKX0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLmNvbXBsZXRlKHZpZXcsIDEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd1c2VyLmlkJywgZGF0YS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3VzZXIubG9nZ2VkX2luJywgZGF0YS5sb2dnZWRfaW4pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb252ZW5pZW5jZUZlZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY29udmVuaWVuY2VGZWUnLCBkYXRhLmNvbnZlbmllbmNlRmVlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLjEuY29tcGxldGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5hY3RpdmF0ZSgyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXAuZXJyb3IodmlldywgMSwgeGhyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9LFxyXG4gICAgc3RlcDI6IGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcblxyXG4gICAgICAgIHN0ZXAuc3VibWl0KHRoaXMsIDIpO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiA2MDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvc3RlcDInLFxyXG4gICAgICAgICAgICBkYXRhOiB7aWQ6IHRoaXMuZ2V0KCdpZCcpLCBjaGVjazogbyAmJiBvLmNoZWNrID8gMSA6IDAsIHBhc3NlbmdlcnM6IHRoaXMuZ2V0KCdwYXNzZW5nZXJzJyksICdzY2VuYXJpbyc6IHRoaXMuZ2V0KCdwYXNzZW5nZXJWYWxpZGF0b24nKX0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLmNvbXBsZXRlKHZpZXcsIDIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG8gJiYgby5jaGVjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbiAoaWQsIGspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Bhc3NlbmdlcnMuJyArIGsgKyAnLnRyYXZlbGVyLmlkJywgaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLjIuY29tcGxldGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5hY3RpdmF0ZSgzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5nZXQoJ21vYmlsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0ZXBzLjIuY29tcGxldGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5hY3RpdmF0ZSgzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgc3RlcC5lcnJvcih2aWV3LCAyLCB4aHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgIH0sXHJcbiAgICBzdGVwMzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gUS5kZWZlcigpLFxyXG4gICAgICAgICAgICAgICAgZGF0YSA9IHtpZDogdGhpcy5nZXQoJ2lkJyl9O1xyXG5cclxuICAgICAgICBzdGVwLnN1Ym1pdCh0aGlzLCAzKTtcclxuXHJcbiAgICAgICAgaWYgKDMgPT0gdGhpcy5nZXQoJ3BheW1lbnQuYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgZGF0YS5uZXRiYW5raW5nID0gdGhpcy5nZXQoJ3BheW1lbnQubmV0YmFua2luZycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRhdGEuY2MgPSB0aGlzLmdldCgncGF5bWVudC5jYycpO1xyXG4gICAgICAgICAgICBkYXRhLmNjLnN0b3JlID0gZGF0YS5jYy5zdG9yZSA/IDEgOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdGltZW91dDogNjAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL3N0ZXAzJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb1BheShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHN0ZXAuY29tcGxldGUodmlldywgMyk7XHJcbiAgICAgICAgICAgICAgICBzdGVwLmVycm9yKHZpZXcsIDMsIHhocik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfSxcclxuICAgIHN0ZXA0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSBRLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBkYXRhID0ge2lkOiB0aGlzLmdldCgnaWQnKX07XHJcblxyXG5cclxuICAgICAgICAkLmFqYXgoeyAgICAgICAgICBcclxuICAgICAgICAgICAvLyB0aW1lb3V0OiAyMDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvc3RlcDQnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy9zdGVwLmNvbXBsZXRlKHZpZXcsIDQpOyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ2FpcmNhcnRfaWQnLCBkYXRhLmFpcmNhcnRfaWQpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ2FpcmNhcnRfc3RhdHVzJywgZGF0YS5haXJjYXJ0X3N0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RlcHMuNC5jb21wbGV0ZWQnLCB0cnVlKTtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCd1c2VyLmVtYWlsJykpO1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJy9iMmMvYWlyQ2FydC9zZW5kRW1haWwvJyArIHZpZXcuZ2V0KCdhaXJjYXJ0X2lkJykpO1xyXG4vLyAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuLy8gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuLy8gICAgICAgICAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9zZW5kRW1haWwvJyArIHBhcnNlSW50KHZpZXcuZ2V0KCdhaXJjYXJ0X2lkJykpLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgZGF0YToge2VtYWlsOiB2aWV3LmdldCgndXNlci5lbWFpbCcpLCB9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuLy9cclxuLy8gICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy9pZiAodmlldy5pc0Jvb2tlZChkYXRhLmFpcmNhcnRfc3RhdHVzKSB8fCB2aWV3LmlzUHJvY2VzcyhkYXRhLmFpcmNhcnRfc3RhdHVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvbXlib29raW5ncy8nICsgdmlldy5nZXQoJ2FpcmNhcnRfaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHhocik7IFxyXG4vLyAgICAgICAgICAgICAgICAgaWYoeGhyLnN0YXR1c1RleHQ9PT0ndGltZW91dCcpe1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCkpO1xyXG4vLyAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgIHN0ZXAuZXJyb3IodmlldywgNCwgeGhyKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9LFxyXG4gICAgaXNCb29rZWQ6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgIHJldHVybiBicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTE7XHJcbiAgICB9LFxyXG4gICAgaW5Qcm9jZXNzOiBmdW5jdGlvbiAoYnIpIHtcclxuICAgICAgICByZXR1cm4gIShicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTEpICYmICEoYnMgPT0gMSk7XHJcbiAgICB9LFxyXG4gICAgaXNOZXc6IGZ1bmN0aW9uIChicikge1xyXG4gICAgICAgIHJldHVybiAxID09IGJzO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5Cb29raW5nLnBhcnNlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHZhciBhY3RpdmUgPSAxO1xyXG5cclxuICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAvL2lmIChkYXRhLnVzZXIubW9iaWxlKSB7XHJcbiAgICAgICAgLy8gICAgZGF0YS51c2VyLm1vYmlsZSA9IGRhdGEudXNlci5jb3VudHJ5ICsgZGF0YS51c2VyLm1vYmlsZTtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgZGF0YS5wYXltZW50LmFjdGl2ZSA9IC0xO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEudXNlci5lbWFpbCAmJiB3aW5kb3cubG9jYWxTdG9yYWdlICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va2luZ19lbWFpbCcpKSB7XHJcbiAgICAgICAgICAgIGRhdGEudXNlci5lbWFpbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va2luZ19lbWFpbCcpO1xyXG4gICAgICAgICAgICBkYXRhLnVzZXIuY291bnRyeSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYm9va2luZ19jb3VudHJ5Jyk7XHJcbiAgICAgICAgICAgIGRhdGEudXNlci5tb2JpbGUgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tpbmdfbW9iaWxlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkYXRhLmZsaWdodHMgPSBfLm1hcChkYXRhLmZsaWdodHMsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgcmV0dXJuIEZsaWdodC5wYXJzZShpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChkYXRhLnVzZXIgJiYgZGF0YS51c2VyLmlkKSB7XHJcbiAgICAgICAgZGF0YS5zdGVwc1sxXS5jb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGRhdGEuc3RlcHNbMV0uYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgYWN0aXZlID0gMjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5wYXNzZW5nZXJzWzBdLnRyYXZlbGVyLmlkKSB7XHJcbiAgICAgICAgZGF0YS5zdGVwc1syXS5jb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGRhdGEuc3RlcHNbMl0uYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgYWN0aXZlID0gMztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5wYXltZW50LnBheW1lbnRfaWQpIHtcclxuICAgICAgICBkYXRhLnN0ZXBzWzNdLmNvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgZGF0YS5zdGVwc1szXS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBhY3RpdmUgPSA0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLmFpcmNhcnRfaWQpIHtcclxuICAgICAgICBkYXRhLnN0ZXBzWzRdLmNvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgYWN0aXZlID0gNDtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLnN0ZXBzW2FjdGl2ZV0uYWN0aXZlID0gdHJ1ZTsgICBcclxuICAgICBjb25zb2xlLmxvZygnYm9va2luZyBkYXRhJyk7XHJcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgIHJldHVybiBuZXcgQm9va2luZyh7ZGF0YTogZGF0YX0pO1xyXG5cclxufTtcclxuXHJcbkJvb2tpbmcuZmV0Y2ggPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9ib29raW5nLycgKyBfLnBhcnNlSW50KGlkKSlcclxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShCb29raW5nLnBhcnNlKGRhdGEpKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkJvb2tpbmcuY3JlYXRlID0gZnVuY3Rpb24gKGZsaWdodHMsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nJyxcclxuICAgICAgICAgICAgZGF0YTogXy5leHRlbmQoe2ZsaWdodHM6IGZsaWdodHN9LCBvcHRpb25zIHx8IHt9KSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoQm9va2luZy5wYXJzZShkYXRhKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuQm9va2luZy5vcGVuID0gZnVuY3Rpb24gKGZsaWdodHMsIG9wdGlvbnMpIHtcclxuICAgIEJvb2tpbmcuY3JlYXRlKGZsaWdodHMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChib29raW5nKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2Jvb2tpbmcvJyArIGJvb2tpbmcuZ2V0KCdpZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm9va2luZztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL2ZsaWdodC9ib29raW5nLmpzXG4gKiogbW9kdWxlIGlkID0gMTAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50LmV4dGVuZCh7XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS92aWV3LmpzXG4gKiogbW9kdWxlIGlkID0gMTAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKVxyXG4gICAgO1xyXG5cclxudmFyIERpYWxvZyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2RpYWxvZy5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaGVhZGVyOiAnaGVhZGVyJyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ21lc3NhZ2UnLFxyXG4gICAgICAgICAgICBidXR0b25zOiBbXHJcbiAgICAgICAgICAgICAgICBbJ09rJywgZnVuY3Rpb24oKSB7IGFsZXJ0KCd6enonKTsgfV0sXHJcbiAgICAgICAgICAgICAgICBbJ0NhbmNlbCcsIGZ1bmN0aW9uKCkgeyBhbGVydCgneXl5JykgfV1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGljazogZnVuY3Rpb24oZXZlbnQsIGNiKSB7XHJcbiAgICAgICAgY2IuYmluZCh0aGlzKShldmVudCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbkRpYWxvZy5vcGVuID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdmFyIGRpYWxvZyA9IG5ldyBEaWFsb2coKTtcclxuICAgIGRpYWxvZy5zZXQob3B0aW9ucyk7XHJcbiAgICBkaWFsb2cucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpYWxvZztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvZGlhbG9nLmpzXG4gKiogbW9kdWxlIGlkID0gMTAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgIHNtYWxsIG1vZGFsXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImhlYWRlclwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjozLFwiclwiOlwibWVzc2FnZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFjdGlvbnNcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBidXR0b25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJjbGlja1wiLFwiYVwiOntcInJcIjpbXCJldmVudFwiLFwiLi8xXCJdLFwic1wiOlwiW18wLF8xXVwifX19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi4vMFwifV19XSxcIm5cIjo1MixcInJcIjpcImJ1dHRvbnNcIn1dfV19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvZGlhbG9nLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxMDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFtb3VudCkge1xyXG4gICAgaWYgKE1ldGEub2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoXHJcbiAgICAgICAgICAgIGFtb3VudCAqIE1ldGEub2JqZWN0LmdldCgneENoYW5nZScpW01ldGEub2JqZWN0LmdldCgnZGlzcGxheV9jdXJyZW5jeScpXSxcclxuICAgICAgICAgICAgJzxpIGNsYXNzPVwiJyArIE1ldGEub2JqZWN0LmdldCgnZGlzcGxheV9jdXJyZW5jeScpLnRvTG93ZXJDYXNlKCkgICsgJyBpY29uIGN1cnJlbmN5XCI+PC9pPicsXHJcbiAgICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2NvdW50aW5nLmZvcm1hdE1vbmV5KGFtb3VudCwgJzxpIGNsYXNzPVwiaW5yIGljb24gY3VycmVuY3lcIj48L2k+JywgMCk7XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2hlbHBlcnMvbW9uZXkuanNcbiAqKiBtb2R1bGUgaWQgPSAxMDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA2XG4gKiovIiwiLyohXG4gKiBhY2NvdW50aW5nLmpzIHYwLjMuMlxuICogQ29weXJpZ2h0IDIwMTEsIEpvc3MgQ3Jvd2Nyb2Z0XG4gKlxuICogRnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogUG9ydGlvbnMgb2YgYWNjb3VudGluZy5qcyBhcmUgaW5zcGlyZWQgb3IgYm9ycm93ZWQgZnJvbSB1bmRlcnNjb3JlLmpzXG4gKlxuICogRnVsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuICogaHR0cDovL2pvc3Njcm93Y3JvZnQuZ2l0aHViLmNvbS9hY2NvdW50aW5nLmpzL1xuICovXG5cbihmdW5jdGlvbihyb290LCB1bmRlZmluZWQpIHtcblxuXHQvKiAtLS0gU2V0dXAgLS0tICovXG5cblx0Ly8gQ3JlYXRlIHRoZSBsb2NhbCBsaWJyYXJ5IG9iamVjdCwgdG8gYmUgZXhwb3J0ZWQgb3IgcmVmZXJlbmNlZCBnbG9iYWxseSBsYXRlclxuXHR2YXIgbGliID0ge307XG5cblx0Ly8gQ3VycmVudCB2ZXJzaW9uXG5cdGxpYi52ZXJzaW9uID0gJzAuMy4yJztcblxuXG5cdC8qIC0tLSBFeHBvc2VkIHNldHRpbmdzIC0tLSAqL1xuXG5cdC8vIFRoZSBsaWJyYXJ5J3Mgc2V0dGluZ3MgY29uZmlndXJhdGlvbiBvYmplY3QuIENvbnRhaW5zIGRlZmF1bHQgcGFyYW1ldGVycyBmb3Jcblx0Ly8gY3VycmVuY3kgYW5kIG51bWJlciBmb3JtYXR0aW5nXG5cdGxpYi5zZXR0aW5ncyA9IHtcblx0XHRjdXJyZW5jeToge1xuXHRcdFx0c3ltYm9sIDogXCIkXCIsXHRcdC8vIGRlZmF1bHQgY3VycmVuY3kgc3ltYm9sIGlzICckJ1xuXHRcdFx0Zm9ybWF0IDogXCIlcyV2XCIsXHQvLyBjb250cm9scyBvdXRwdXQ6ICVzID0gc3ltYm9sLCAldiA9IHZhbHVlIChjYW4gYmUgb2JqZWN0LCBzZWUgZG9jcylcblx0XHRcdGRlY2ltYWwgOiBcIi5cIixcdFx0Ly8gZGVjaW1hbCBwb2ludCBzZXBhcmF0b3Jcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXHRcdC8vIHRob3VzYW5kcyBzZXBhcmF0b3Jcblx0XHRcdHByZWNpc2lvbiA6IDIsXHRcdC8vIGRlY2ltYWwgcGxhY2VzXG5cdFx0XHRncm91cGluZyA6IDNcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0fSxcblx0XHRudW1iZXI6IHtcblx0XHRcdHByZWNpc2lvbiA6IDAsXHRcdC8vIGRlZmF1bHQgcHJlY2lzaW9uIG9uIG51bWJlcnMgaXMgMFxuXHRcdFx0Z3JvdXBpbmcgOiAzLFx0XHQvLyBkaWdpdCBncm91cGluZyAobm90IGltcGxlbWVudGVkIHlldClcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXG5cdFx0XHRkZWNpbWFsIDogXCIuXCJcblx0XHR9XG5cdH07XG5cblxuXHQvKiAtLS0gSW50ZXJuYWwgSGVscGVyIE1ldGhvZHMgLS0tICovXG5cblx0Ly8gU3RvcmUgcmVmZXJlbmNlIHRvIHBvc3NpYmx5LWF2YWlsYWJsZSBFQ01BU2NyaXB0IDUgbWV0aG9kcyBmb3IgbGF0ZXJcblx0dmFyIG5hdGl2ZU1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAsXG5cdFx0bmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanNcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuXHRcdHJldHVybiAhIShvYmogPT09ICcnIHx8IChvYmogJiYgb2JqLmNoYXJDb2RlQXQgJiYgb2JqLnN1YnN0cikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgc3RyaW5nXG5cdCAqIGZyb20gdW5kZXJzY29yZS5qcywgZGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUlzQXJyYXkgPyBuYXRpdmVJc0FycmF5KG9iaikgOiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSB0cnVlIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG5cdFx0cmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBhIGRlZmF1bHRzIG9iamVjdCwgc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgXy5kZWZhdWx0c1xuXHQgKlxuXHQgKiBVc2VkIGZvciBhYnN0cmFjdGluZyBwYXJhbWV0ZXIgaGFuZGxpbmcgZnJvbSBBUEkgbWV0aG9kc1xuXHQgKi9cblx0ZnVuY3Rpb24gZGVmYXVsdHMob2JqZWN0LCBkZWZzKSB7XG5cdFx0dmFyIGtleTtcblx0XHRvYmplY3QgPSBvYmplY3QgfHwge307XG5cdFx0ZGVmcyA9IGRlZnMgfHwge307XG5cdFx0Ly8gSXRlcmF0ZSBvdmVyIG9iamVjdCBub24tcHJvdG90eXBlIHByb3BlcnRpZXM6XG5cdFx0Zm9yIChrZXkgaW4gZGVmcykge1xuXHRcdFx0aWYgKGRlZnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHQvLyBSZXBsYWNlIHZhbHVlcyB3aXRoIGRlZmF1bHRzIG9ubHkgaWYgdW5kZWZpbmVkIChhbGxvdyBlbXB0eS96ZXJvIHZhbHVlcyk6XG5cdFx0XHRcdGlmIChvYmplY3Rba2V5XSA9PSBudWxsKSBvYmplY3Rba2V5XSA9IGRlZnNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRhdGlvbiBvZiBgQXJyYXkubWFwKClgIGZvciBpdGVyYXRpb24gbG9vcHNcblx0ICpcblx0ICogUmV0dXJucyBhIG5ldyBBcnJheSBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBpdGVyYXRvcmAgb24gZWFjaCBhcnJheSB2YWx1ZS5cblx0ICogRGVmZXJzIHRvIG5hdGl2ZSBBcnJheS5tYXAgaWYgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuXHRcdHZhciByZXN1bHRzID0gW10sIGksIGo7XG5cblx0XHRpZiAoIW9iaikgcmV0dXJuIHJlc3VsdHM7XG5cblx0XHQvLyBVc2UgbmF0aXZlIC5tYXAgbWV0aG9kIGlmIGl0IGV4aXN0czpcblx0XHRpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuXG5cdFx0Ly8gRmFsbGJhY2sgZm9yIG5hdGl2ZSAubWFwOlxuXHRcdGZvciAoaSA9IDAsIGogPSBvYmoubGVuZ3RoOyBpIDwgajsgaSsrICkge1xuXHRcdFx0cmVzdWx0c1tpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBhbmQgbm9ybWFsaXNlIHRoZSB2YWx1ZSBvZiBwcmVjaXNpb24gKG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlcilcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrUHJlY2lzaW9uKHZhbCwgYmFzZSkge1xuXHRcdHZhbCA9IE1hdGgucm91bmQoTWF0aC5hYnModmFsKSk7XG5cdFx0cmV0dXJuIGlzTmFOKHZhbCk/IGJhc2UgOiB2YWw7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBmb3JtYXQgc3RyaW5nIG9yIG9iamVjdCBhbmQgcmV0dXJucyBmb3JtYXQgb2JqIGZvciB1c2UgaW4gcmVuZGVyaW5nXG5cdCAqXG5cdCAqIGBmb3JtYXRgIGlzIGVpdGhlciBhIHN0cmluZyB3aXRoIHRoZSBkZWZhdWx0IChwb3NpdGl2ZSkgZm9ybWF0LCBvciBvYmplY3Rcblx0ICogY29udGFpbmluZyBgcG9zYCAocmVxdWlyZWQpLCBgbmVnYCBhbmQgYHplcm9gIHZhbHVlcyAob3IgYSBmdW5jdGlvbiByZXR1cm5pbmdcblx0ICogZWl0aGVyIGEgc3RyaW5nIG9yIG9iamVjdClcblx0ICpcblx0ICogRWl0aGVyIHN0cmluZyBvciBmb3JtYXQucG9zIG11c3QgY29udGFpbiBcIiV2XCIgKHZhbHVlKSB0byBiZSB2YWxpZFxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDdXJyZW5jeUZvcm1hdChmb3JtYXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0O1xuXG5cdFx0Ly8gQWxsb3cgZnVuY3Rpb24gYXMgZm9ybWF0IHBhcmFtZXRlciAoc2hvdWxkIHJldHVybiBzdHJpbmcgb3Igb2JqZWN0KTpcblx0XHRpZiAoIHR5cGVvZiBmb3JtYXQgPT09IFwiZnVuY3Rpb25cIiApIGZvcm1hdCA9IGZvcm1hdCgpO1xuXG5cdFx0Ly8gRm9ybWF0IGNhbiBiZSBhIHN0cmluZywgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIChcIiV2XCIpIG11c3QgYmUgcHJlc2VudDpcblx0XHRpZiAoIGlzU3RyaW5nKCBmb3JtYXQgKSAmJiBmb3JtYXQubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGFuZCByZXR1cm4gcG9zaXRpdmUsIG5lZ2F0aXZlIGFuZCB6ZXJvIGZvcm1hdHM6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwb3MgOiBmb3JtYXQsXG5cdFx0XHRcdG5lZyA6IGZvcm1hdC5yZXBsYWNlKFwiLVwiLCBcIlwiKS5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBmb3JtYXRcblx0XHRcdH07XG5cblx0XHQvLyBJZiBubyBmb3JtYXQsIG9yIG9iamVjdCBpcyBtaXNzaW5nIHZhbGlkIHBvc2l0aXZlIHZhbHVlLCB1c2UgZGVmYXVsdHM6XG5cdFx0fSBlbHNlIGlmICggIWZvcm1hdCB8fCAhZm9ybWF0LnBvcyB8fCAhZm9ybWF0LnBvcy5tYXRjaChcIiV2XCIpICkge1xuXG5cdFx0XHQvLyBJZiBkZWZhdWx0cyBpcyBhIHN0cmluZywgY2FzdHMgaXQgdG8gYW4gb2JqZWN0IGZvciBmYXN0ZXIgY2hlY2tpbmcgbmV4dCB0aW1lOlxuXHRcdFx0cmV0dXJuICggIWlzU3RyaW5nKCBkZWZhdWx0cyApICkgPyBkZWZhdWx0cyA6IGxpYi5zZXR0aW5ncy5jdXJyZW5jeS5mb3JtYXQgPSB7XG5cdFx0XHRcdHBvcyA6IGRlZmF1bHRzLFxuXHRcdFx0XHRuZWcgOiBkZWZhdWx0cy5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBkZWZhdWx0c1xuXHRcdFx0fTtcblxuXHRcdH1cblx0XHQvLyBPdGhlcndpc2UsIGFzc3VtZSBmb3JtYXQgd2FzIGZpbmU6XG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fVxuXG5cblx0LyogLS0tIEFQSSBNZXRob2RzIC0tLSAqL1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIHN0cmluZy9hcnJheSBvZiBzdHJpbmdzLCByZW1vdmVzIGFsbCBmb3JtYXR0aW5nL2NydWZ0IGFuZCByZXR1cm5zIHRoZSByYXcgZmxvYXQgdmFsdWVcblx0ICogYWxpYXM6IGFjY291bnRpbmcuYHBhcnNlKHN0cmluZylgXG5cdCAqXG5cdCAqIERlY2ltYWwgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGZsb2F0cyAoZGVmYXVsdDogXCIuXCIpLCBzbyBpZiB0aGUgbnVtYmVyXG5cdCAqIHVzZXMgYSBub24tc3RhbmRhcmQgZGVjaW1hbCBzZXBhcmF0b3IsIHByb3ZpZGUgaXQgYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0ICpcblx0ICogQWxzbyBtYXRjaGVzIGJyYWNrZXRlZCBuZWdhdGl2ZXMgKGVnLiBcIiQgKDEuOTkpXCIgPT4gLTEuOTkpXG5cdCAqXG5cdCAqIERvZXNuJ3QgdGhyb3cgYW55IGVycm9ycyAoYE5hTmBzIGJlY29tZSAwKSBidXQgdGhpcyBtYXkgY2hhbmdlIGluIGZ1dHVyZVxuXHQgKi9cblx0dmFyIHVuZm9ybWF0ID0gbGliLnVuZm9ybWF0ID0gbGliLnBhcnNlID0gZnVuY3Rpb24odmFsdWUsIGRlY2ltYWwpIHtcblx0XHQvLyBSZWN1cnNpdmVseSB1bmZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZm9ybWF0KHZhbCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBGYWlscyBzaWxlbnRseSAobmVlZCBkZWNlbnQgZXJyb3JzKTpcblx0XHR2YWx1ZSA9IHZhbHVlIHx8IDA7XG5cblx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGFzLWlzIGlmIGl0J3MgYWxyZWFkeSBhIG51bWJlcjpcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gdmFsdWU7XG5cblx0XHQvLyBEZWZhdWx0IGRlY2ltYWwgcG9pbnQgaXMgXCIuXCIgYnV0IGNvdWxkIGJlIHNldCB0byBlZy4gXCIsXCIgaW4gb3B0czpcblx0XHRkZWNpbWFsID0gZGVjaW1hbCB8fCBcIi5cIjtcblxuXHRcdCAvLyBCdWlsZCByZWdleCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBleGNlcHQgZGlnaXRzLCBkZWNpbWFsIHBvaW50IGFuZCBtaW51cyBzaWduOlxuXHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXjAtOS1cIiArIGRlY2ltYWwgKyBcIl1cIiwgW1wiZ1wiXSksXG5cdFx0XHR1bmZvcm1hdHRlZCA9IHBhcnNlRmxvYXQoXG5cdFx0XHRcdChcIlwiICsgdmFsdWUpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCgoLiopXFwpLywgXCItJDFcIikgLy8gcmVwbGFjZSBicmFja2V0ZWQgdmFsdWVzIHdpdGggbmVnYXRpdmVzXG5cdFx0XHRcdC5yZXBsYWNlKHJlZ2V4LCAnJykgICAgICAgICAvLyBzdHJpcCBvdXQgYW55IGNydWZ0XG5cdFx0XHRcdC5yZXBsYWNlKGRlY2ltYWwsICcuJykgICAgICAvLyBtYWtlIHN1cmUgZGVjaW1hbCBwb2ludCBpcyBzdGFuZGFyZFxuXHRcdFx0KTtcblxuXHRcdC8vIFRoaXMgd2lsbCBmYWlsIHNpbGVudGx5IHdoaWNoIG1heSBjYXVzZSB0cm91YmxlLCBsZXQncyB3YWl0IGFuZCBzZWU6XG5cdFx0cmV0dXJuICFpc05hTih1bmZvcm1hdHRlZCkgPyB1bmZvcm1hdHRlZCA6IDA7XG5cdH07XG5cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcblx0ICpcblx0ICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gXCIwLjYxXCIpIHRoYXQgcHJlc2VudFxuXHQgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cblx0ICovXG5cdHZhciB0b0ZpeGVkID0gbGliLnRvRml4ZWQgPSBmdW5jdGlvbih2YWx1ZSwgcHJlY2lzaW9uKSB7XG5cdFx0cHJlY2lzaW9uID0gY2hlY2tQcmVjaXNpb24ocHJlY2lzaW9uLCBsaWIuc2V0dGluZ3MubnVtYmVyLnByZWNpc2lvbik7XG5cdFx0dmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG5cblx0XHQvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcblx0XHRyZXR1cm4gKE1hdGgucm91bmQobGliLnVuZm9ybWF0KHZhbHVlKSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyLCB3aXRoIGNvbW1hLXNlcGFyYXRlZCB0aG91c2FuZHMgYW5kIGN1c3RvbSBwcmVjaXNpb24vZGVjaW1hbCBwbGFjZXNcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgcHJlY2lzaW9uIGFuZCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9yc1xuXHQgKiAybmQgcGFyYW1ldGVyIGBwcmVjaXNpb25gIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLm51bWJlcmBcblx0ICovXG5cdHZhciBmb3JtYXROdW1iZXIgPSBsaWIuZm9ybWF0TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiBmb3JtYXROdW1iZXIodmFsLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChwcmVjaXNpb24pID8gcHJlY2lzaW9uIDoge1xuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MubnVtYmVyXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDbGVhbiB1cCBwcmVjaXNpb25cblx0XHRcdHVzZVByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSxcblxuXHRcdFx0Ly8gRG8gc29tZSBjYWxjOlxuXHRcdFx0bmVnYXRpdmUgPSBudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiLFxuXHRcdFx0YmFzZSA9IHBhcnNlSW50KHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyIHx8IDApLCB1c2VQcmVjaXNpb24pLCAxMCkgKyBcIlwiLFxuXHRcdFx0bW9kID0gYmFzZS5sZW5ndGggPiAzID8gYmFzZS5sZW5ndGggJSAzIDogMDtcblxuXHRcdC8vIEZvcm1hdCB0aGUgbnVtYmVyOlxuXHRcdHJldHVybiBuZWdhdGl2ZSArIChtb2QgPyBiYXNlLnN1YnN0cigwLCBtb2QpICsgb3B0cy50aG91c2FuZCA6IFwiXCIpICsgYmFzZS5zdWJzdHIobW9kKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgb3B0cy50aG91c2FuZCkgKyAodXNlUHJlY2lzaW9uID8gb3B0cy5kZWNpbWFsICsgdG9GaXhlZChNYXRoLmFicyhudW1iZXIpLCB1c2VQcmVjaXNpb24pLnNwbGl0KCcuJylbMV0gOiBcIlwiKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBudW1iZXIgaW50byBjdXJyZW5jeVxuXHQgKlxuXHQgKiBVc2FnZTogYWNjb3VudGluZy5mb3JtYXRNb25leShudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZHNTZXAsIGRlY2ltYWxTZXAsIGZvcm1hdClcblx0ICogZGVmYXVsdHM6ICgwLCBcIiRcIiwgMiwgXCIsXCIsIFwiLlwiLCBcIiVzJXZcIilcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kIC8gZGVjaW1hbCBzZXBhcmF0b3JzIGFuZCBmb3JtYXRcblx0ICogU2Vjb25kIHBhcmFtIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLmN1cnJlbmN5YCB3aGljaCBpcyB0aGUgZWFzaWVzdCB3YXkuXG5cdCAqXG5cdCAqIFRvIGRvOiB0aWR5IHVwIHRoZSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHR2YXIgZm9ybWF0TW9uZXkgPSBsaWIuZm9ybWF0TW9uZXkgPSBmdW5jdGlvbihudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKXtcblx0XHRcdFx0cmV0dXJuIGZvcm1hdE1vbmV5KHZhbCwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgbnVtYmVyOlxuXHRcdG51bWJlciA9IHVuZm9ybWF0KG51bWJlcik7XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pOlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZTpcblx0XHRcdHVzZUZvcm1hdCA9IG51bWJlciA+IDAgPyBmb3JtYXRzLnBvcyA6IG51bWJlciA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybztcblxuXHRcdC8vIFJldHVybiB3aXRoIGN1cnJlbmN5IHN5bWJvbCBhZGRlZDpcblx0XHRyZXR1cm4gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKG51bWJlciksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbGlzdCBvZiBudW1iZXJzIGludG8gYW4gYWNjb3VudGluZyBjb2x1bW4sIHBhZGRpbmcgd2l0aCB3aGl0ZXNwYWNlXG5cdCAqIHRvIGxpbmUgdXAgY3VycmVuY3kgc3ltYm9scywgdGhvdXNhbmQgc2VwYXJhdG9ycyBhbmQgZGVjaW1hbHMgcGxhY2VzXG5cdCAqXG5cdCAqIExpc3Qgc2hvdWxkIGJlIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICogU2Vjb25kIHBhcmFtZXRlciBjYW4gYmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyB0aGF0IG1hdGNoIHRoZSBwYXJhbXNcblx0ICpcblx0ICogUmV0dXJucyBhcnJheSBvZiBhY2NvdXRpbmctZm9ybWF0dGVkIG51bWJlciBzdHJpbmdzIG9mIHNhbWUgbGVuZ3RoXG5cdCAqXG5cdCAqIE5COiBgd2hpdGUtc3BhY2U6cHJlYCBDU1MgcnVsZSBpcyByZXF1aXJlZCBvbiB0aGUgbGlzdCBjb250YWluZXIgdG8gcHJldmVudFxuXHQgKiBicm93c2VycyBmcm9tIGNvbGxhcHNpbmcgdGhlIHdoaXRlc3BhY2UgaW4gdGhlIG91dHB1dCBzdHJpbmdzLlxuXHQgKi9cblx0bGliLmZvcm1hdENvbHVtbiA9IGZ1bmN0aW9uKGxpc3QsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0aWYgKCFsaXN0KSByZXR1cm4gW107XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pLCBvbmx5IG5lZWQgcG9zIGZvciBub3c6XG5cdFx0XHRmb3JtYXRzID0gY2hlY2tDdXJyZW5jeUZvcm1hdChvcHRzLmZvcm1hdCksXG5cblx0XHRcdC8vIFdoZXRoZXIgdG8gcGFkIGF0IHN0YXJ0IG9mIHN0cmluZyBvciBhZnRlciBjdXJyZW5jeSBzeW1ib2w6XG5cdFx0XHRwYWRBZnRlclN5bWJvbCA9IGZvcm1hdHMucG9zLmluZGV4T2YoXCIlc1wiKSA8IGZvcm1hdHMucG9zLmluZGV4T2YoXCIldlwiKSA/IHRydWUgOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RvcmUgdmFsdWUgZm9yIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nIGluIHRoZSBjb2x1bW46XG5cdFx0XHRtYXhMZW5ndGggPSAwLFxuXG5cdFx0XHQvLyBGb3JtYXQgdGhlIGxpc3QgYWNjb3JkaW5nIHRvIG9wdGlvbnMsIHN0b3JlIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nOlxuXHRcdFx0Zm9ybWF0dGVkID0gbWFwKGxpc3QsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheSh2YWwpKSB7XG5cdFx0XHRcdFx0Ly8gUmVjdXJzaXZlbHkgZm9ybWF0IGNvbHVtbnMgaWYgbGlzdCBpcyBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5OlxuXHRcdFx0XHRcdHJldHVybiBsaWIuZm9ybWF0Q29sdW1uKHZhbCwgb3B0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYW4gdXAgdGhlIHZhbHVlXG5cdFx0XHRcdFx0dmFsID0gdW5mb3JtYXQodmFsKTtcblxuXHRcdFx0XHRcdC8vIENob29zZSB3aGljaCBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIHZhbHVlIChwb3MsIG5lZyBvciB6ZXJvKTpcblx0XHRcdFx0XHR2YXIgdXNlRm9ybWF0ID0gdmFsID4gMCA/IGZvcm1hdHMucG9zIDogdmFsIDwgMCA/IGZvcm1hdHMubmVnIDogZm9ybWF0cy56ZXJvLFxuXG5cdFx0XHRcdFx0XHQvLyBGb3JtYXQgdGhpcyB2YWx1ZSwgcHVzaCBpbnRvIGZvcm1hdHRlZCBsaXN0IGFuZCBzYXZlIHRoZSBsZW5ndGg6XG5cdFx0XHRcdFx0XHRmVmFsID0gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKHZhbCksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cblx0XHRcdFx0XHRpZiAoZlZhbC5sZW5ndGggPiBtYXhMZW5ndGgpIG1heExlbmd0aCA9IGZWYWwubGVuZ3RoO1xuXHRcdFx0XHRcdHJldHVybiBmVmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIFBhZCBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBhbmQgc2VuZCBiYWNrIHRoZSBjb2x1bW4gb2YgbnVtYmVyczpcblx0XHRyZXR1cm4gbWFwKGZvcm1hdHRlZCwgZnVuY3Rpb24odmFsLCBpKSB7XG5cdFx0XHQvLyBPbmx5IGlmIHRoaXMgaXMgYSBzdHJpbmcgKG5vdCBhIG5lc3RlZCBhcnJheSwgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcGFkZGVkKTpcblx0XHRcdGlmIChpc1N0cmluZyh2YWwpICYmIHZhbC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcblx0XHRcdFx0Ly8gRGVwZW5kaW5nIG9uIHN5bWJvbCBwb3NpdGlvbiwgcGFkIGFmdGVyIHN5bWJvbCBvciBhdCBpbmRleCAwOlxuXHRcdFx0XHRyZXR1cm4gcGFkQWZ0ZXJTeW1ib2wgPyB2YWwucmVwbGFjZShvcHRzLnN5bWJvbCwgb3B0cy5zeW1ib2wrKG5ldyBBcnJheShtYXhMZW5ndGggLSB2YWwubGVuZ3RoICsgMSkuam9pbihcIiBcIikpKSA6IChuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSArIHZhbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvKiAtLS0gTW9kdWxlIERlZmluaXRpb24gLS0tICovXG5cblx0Ly8gRXhwb3J0IGFjY291bnRpbmcgZm9yIENvbW1vbkpTLiBJZiBiZWluZyBsb2FkZWQgYXMgYW4gQU1EIG1vZHVsZSwgZGVmaW5lIGl0IGFzIHN1Y2guXG5cdC8vIE90aGVyd2lzZSwganVzdCBhZGQgYGFjY291bnRpbmdgIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5cdGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRcdGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblx0XHR9XG5cdFx0ZXhwb3J0cy5hY2NvdW50aW5nID0gbGliO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIFJldHVybiB0aGUgbGlicmFyeSBhcyBhbiBBTUQgbW9kdWxlOlxuXHRcdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbGliO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFVzZSBhY2NvdW50aW5nLm5vQ29uZmxpY3QgdG8gcmVzdG9yZSBgYWNjb3VudGluZ2AgYmFjayB0byBpdHMgb3JpZ2luYWwgdmFsdWUuXG5cdFx0Ly8gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSdzIGBhY2NvdW50aW5nYCBvYmplY3Q7XG5cdFx0Ly8gZS5nLiBgdmFyIG51bWJlcnMgPSBhY2NvdW50aW5nLm5vQ29uZmxpY3QoKTtgXG5cdFx0bGliLm5vQ29uZmxpY3QgPSAoZnVuY3Rpb24ob2xkQWNjb3VudGluZykge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBSZXNldCB0aGUgdmFsdWUgb2YgdGhlIHJvb3QncyBgYWNjb3VudGluZ2AgdmFyaWFibGU6XG5cdFx0XHRcdHJvb3QuYWNjb3VudGluZyA9IG9sZEFjY291bnRpbmc7XG5cdFx0XHRcdC8vIERlbGV0ZSB0aGUgbm9Db25mbGljdCBtZXRob2Q6XG5cdFx0XHRcdGxpYi5ub0NvbmZsaWN0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHQvLyBSZXR1cm4gcmVmZXJlbmNlIHRvIHRoZSBsaWJyYXJ5IHRvIHJlLWFzc2lnbiBpdDpcblx0XHRcdFx0cmV0dXJuIGxpYjtcblx0XHRcdH07XG5cdFx0fSkocm9vdC5hY2NvdW50aW5nKTtcblxuXHRcdC8vIERlY2xhcmUgYGZ4YCBvbiB0aGUgcm9vdCAoZ2xvYmFsL3dpbmRvdykgb2JqZWN0OlxuXHRcdHJvb3RbJ2FjY291bnRpbmcnXSA9IGxpYjtcblx0fVxuXG5cdC8vIFJvb3Qgd2lsbCBiZSBgd2luZG93YCBpbiBicm93c2VyIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXI6XG59KHRoaXMpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzXG4gKiogbW9kdWxlIGlkID0gMTA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDZcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJzZWN0aW9uXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlYXJjaFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2VsZWN0X2RhdGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRocmVlIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJsdWUgYnV0dG9uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwibW9kaWZ5U2VhcmNoXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJNb2RpZnlcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIGNlbnRlciBhbGlnbmVkXCJ9LFwiZlwiOltcIiBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiByaWdodCBhbGlnbmVkXCJ9LFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmbG9hdGluZyBzb3J0aW5nIGRyb3Bkb3duIGljb24gdG9wIHJpZ2h0IHBvaW50aW5nIGJsdWUgYnV0dG9uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidGV4dFwifSxcImZcIjpbXCJQcmljZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibWVudSB0cmFuc2l0aW9uIGhpZGRlblwiLFwidGFiaW5kZXhcIjpcIi0xXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtIGFjdGl2ZSBzZWxlY3RlZFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic29ydE9uLjBcXFwiLFxcXCJwcmljZVxcXCJdXCJ9fX0sXCJmXCI6W1wiUHJpY2VcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNvcnRPbi4wXFxcIixcXFwiYXJyaXZlXFxcIl1cIn19fSxcImZcIjpbXCJBcnJpdmVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNvcnRPbi4wXFxcIixcXFwiZGVwYXJ0XFxcIl1cIn19fSxcImZcIjpbXCJEZXBhcnRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNvcnRPbi4wXFxcIixcXFwiYWlybGluZVxcXCJdXCJ9fX0sXCJmXCI6W1wiQWlybGluZVwiXX1dfV19XX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25fc2VhcmNoXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0X2Zyb210b1wifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpLmZyb20uY2l0eVwifX0sXCIg4oaSIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJsYXN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpLnRvLmNpdHlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3VyX2RhdGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRheV9tb250aFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGF5X3dlZWtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYWxlbmRhciBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VhcmNoLmZsaWdodHMuMC5kZXBhcnRfYXRcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcIkQgTU1NXFxcIilcIn19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwiXSxcInNcIjpcIl8wLmZvcm1hdChcXFwiZGRkZFxcXCIpXCJ9fV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFnZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVzZXIgaWNvblwifX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJwYXNzZW5nZXJzLjBcIn0sXCIgQWR1bHRzLCBcIix7XCJ0XCI6MixcInJcIjpcInBhc3NlbmdlcnMuMVwifSxcIiBDaGlsZHMsIFwiLHtcInRcIjoyLFwiclwiOlwicGFzc2VuZ2Vycy4yXCJ9LFwiIEluZmFudHNcIl19XSxcInJcIjpcInNlYXJjaFwifV19XSxcInJcIjpcImZsaWdodHMuMC4wXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIlwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmbGlnaHRzXCIsXCJhXCI6e1wic2VsZWN0Rm5cIjpbe1widFwiOjIsXCJyXCI6XCJvblNlbGVjdFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0cy4wXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJzb3J0T25cIjpbe1widFwiOjIsXCJyXCI6XCJzb3J0T25cIn1dLFwicGVuZGluZ1wiOlt7XCJ0XCI6MixcInJcIjpcInBlbmRpbmdcIn1dfX1dfV19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvb25ld2F5Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxMDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJyksXHJcbiAgICBST1VURVMgPSByZXF1aXJlKCdhcHAvcm91dGVzJylcclxuICAgIDtcclxuXHJcbnZhciB0Mm0gPSBmdW5jdGlvbih0aW1lKSB7XHJcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcclxuXHJcbiAgICByZXR1cm4gXy5wYXJzZUludChpWzBdKSo2MCArIF8ucGFyc2VJbnQoaVsxXSk7XHJcbn07XHJcblxyXG52YXIgc29ydCA9IGZ1bmN0aW9uKGZsaWdodHMsIHNvcnRPbikge1xyXG4gICAgdmFyIG9uID0gc29ydE9uWzBdLFxyXG4gICAgICAgIGFzYyA9IHNvcnRPblsxXSxcclxuICAgICAgICBkYXRhID0gZmxpZ2h0cy5zbGljZSgpLFxyXG4gICAgICAgIHRpbWUgPSBfLm5vdygpO1xyXG5cclxuICAgIGRhdGEgPSBfLnNvcnRCeShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGkuZ2V0KCdwcmljZScpLFxyXG4gICAgICAgICAgICAgICAgcyA9IGkuZ2V0KCdzZWdtZW50cy4wJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJ2FpcmxpbmUnID09IG9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IF8udHJpbShzWzBdLmNhcnJpZXIubmFtZSkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCdkZXBhcnQnID09IG9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNbMF0uZGVwYXJ0LnVuaXgoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCdhcnJpdmUnID09IG9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNbcy5sZW5ndGggLSAxXS5hcnJpdmUudW5peCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoLTEgPT0gYXNjKSB7XHJcbiAgICAgICAgZGF0YS5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG59O1xyXG5cclxudmFyIGdyb3VwID0gZnVuY3Rpb24oZmxpZ2h0cywgc29ydG9uKSB7XHJcbiAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgcmV0dXJuIGZsaWdodHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIF8udmFsdWVzKF8uZ3JvdXBCeShmbGlnaHRzLCBmdW5jdGlvbihpKSB7IHJldHVybiAnbmF4XycgKyBpLmdldChzb3J0b25bMF0pICArICdfJyArIGkuZ2V0KCdwcmljZScpOyB9KSk7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHRzLmh0bWwnKSxcclxuICAgIHBhZ2U6IDEsXHJcbiAgICBsb2FkaW5nOiBmYWxzZSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgZmxpZ2h0OiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvZmxpZ2h0JylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZpcnN0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiAxLFxyXG5cclxuICAgICAgICAgICAgZmxpZ2h0czogW10sXHJcbiAgICAgICAgICAgIHJlbmRlcmVkOiBbXSxcclxuICAgICAgICAgICAgc29ydGVkOiBbXSxcclxuICAgICAgICAgICAgb3Blbjoge30sXHJcblxyXG4gICAgICAgICAgICBzb3J0T246IFsncHJpY2UnLCAxXSxcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3RcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnc29ydE9uJywgZnVuY3Rpb24oc29ydE9uKSB7IHZpZXcuc29ydEZsaWdodHMoKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCdmbGlnaHRzJywgZnVuY3Rpb24oc29ydE9uKSB7IHZpZXcuc29ydEZsaWdodHMoKTsgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgIHRoaXMuc29ydEZsaWdodHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQub24oJ25leHRwYWdlJywgZnVuY3Rpb24oKSB7IHRoaXMubmV4dHBhZ2UoKTsgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG5leHRwYWdlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKCAhIHZpZXcubG9hZGluZyApe1xyXG4gICAgICAgICAgICB2aWV3LmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkZCA9IHZpZXcuZ2V0KCdzb3J0ZWQnKS5zbGljZSh2aWV3LnBhZ2UqMTAsICh2aWV3LnBhZ2UrMSkqMTApO1xyXG4gICAgICAgICAgICBpZiAoYWRkICYmIGFkZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGFkZC51bnNoaWZ0KCdyZW5kZXJlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucHVzaC5hcHBseSh2aWV3LCBhZGQpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5wYWdlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc29ydE9uOiBmdW5jdGlvbihvbikge1xyXG4gICAgICAgIGlmIChvbiA9PSB0aGlzLmdldCgnc29ydE9uLjAnKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnc29ydE9uLjEnLCAtMSp0aGlzLmdldCgnc29ydE9uLjEnKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3NvcnRPbicsIFtvbiwgMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc29ydEZsaWdodHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBlbmRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2V0KCdyZW5kZXJlZCcsIG51bGwpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHZpZXcuZ2V0KCdzZWFyY2guZG9tZXN0aWMnKSkge1xyXG4gICAgICAgICAgICB2YXIgZmxpZ2h0cyA9IHNvcnQodmlldy5nZXQoJ2ZsaWdodHMnKSwgdmlldy5nZXQoJ3NvcnRPbicpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZmxpZ2h0cyA9IGdyb3VwKHNvcnQodmlldy5nZXQoJ2ZsaWdodHMnKSwgdmlldy5nZXQoJ3NvcnRPbicpKSwgdmlldy5nZXQoJ3NvcnRPbicpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2aWV3LnNldCgnc29ydGVkJywgZmxpZ2h0cyk7XHJcblxyXG4gICAgICAgIHZpZXcuc2V0KCdyZW5kZXJlZCcsIGZsaWdodHMuc2xpY2UoMCwgMTApKTtcclxuICAgICAgICB2aWV3LnBhZ2UgPSAxO1xyXG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcGFnZSgpXHJcbiAgICB9XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL2ZsaWdodHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmbGlnaHRcIixcImFcIjp7XCJzZWxlY3RGblwiOlt7XCJ0XCI6MixcInJcIjpcInNlbGVjdEZuXCJ9XSxcInNtYWxsXCI6W3tcInRcIjoyLFwiclwiOlwic21hbGxcIn1dLFwic3VtbWFyeVwiOlt7XCJ0XCI6MixcInJcIjpcInN1bW1hcnlcIn1dLFwiZmxpZ2h0XCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic2VsZWN0ZWRcIjpbe1widFwiOjIsXCJyXCI6XCJzZWxlY3RlZFwifV0sXCJvbndhcmRcIjpbe1widFwiOjIsXCJyXCI6XCJvbndhcmRcIn1dLFwiYmFja3dhcmRcIjpbe1widFwiOjIsXCJyXCI6XCJiYWNrd2FyZFwifV19fV0sXCJuXCI6NTIsXCJyXCI6XCJyZW5kZXJlZFwifV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHRzLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxMDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEJvb2tpbmcgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L2Jvb2tpbmcnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxuXHJcbnZhciBtb25leSA9IHJlcXVpcmUoJ2hlbHBlcnMvbW9uZXknKSxcclxuICAgIGR1cmF0aW9uID0gcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKCksXHJcbiAgICBkaXNjb3VudCA9IHJlcXVpcmUoJ2hlbHBlcnMvZmxpZ2h0cycpLmRpc2NvdW50O1xyXG5cclxuXHJcbnZhciBkYXRhID0ge1xyXG4gICAgaGFzR3JvdXBpbmdzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ2ZsaWdodC5ncm91cGluZ3MnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoJ2ZsaWdodC5ncm91cGluZ3MnKS5sZW5ndGggfHwgXy5rZXlzKHRoaXMuZ2V0KCdmbGlnaHQuZ3JvdXBpbmdzJykpLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgZGlzY291bnQ6IGRpc2NvdW50LFxyXG5cclxuICAgICQ6IG1vbmV5LFxyXG4gICAgZHVyYXRpb246IGR1cmF0aW9uXHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9mbGlnaHQuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICBmbGlnaHQ6IHRoaXMsXHJcbiAgICAgICAgaXRpbmVyYXJ5OiByZXF1aXJlKCdjb21wb25lbnRzL2ZsaWdodHMvaXRpbmVyYXJ5JylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNldCgnbWV0YScsIE1ldGEub2JqZWN0KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJy5wcmljZSA+IC5hbW91bnQnKSlcclxuICAgICAgICAgICAgLnBvcHVwKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2JvdHRvbSByaWdodCcsXHJcbiAgICAgICAgICAgICAgICBwb3B1cDogJCh0aGlzLmZpbmQoJy5mYXJlLnBvcHVwJykpLFxyXG4gICAgICAgICAgICAgICAgb246ICdob3ZlcidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRvZ2dsZURldGFpbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKCdkZXRhaWxzJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNlbGVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdmbGlnaHQuaWQnKSA9PT0gdGhpcy5nZXQoJ3NlbGVjdGVkLmlkJykpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3NlbGVjdGVkJywgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmbiA9IHRoaXMuZ2V0KCdzZWxlY3RGbicpOyAgICAgICAgXHJcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmbikpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZuKHRoaXMuZ2V0KCdmbGlnaHQnKSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGljazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdzdW1tYXJ5JykpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL2ZsaWdodC5qc1xuICoqIG1vZHVsZSBpZCA9IDEwOVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gcGFkZHkobiwgcCwgYykge1xyXG4gICAgdmFyIHBhZF9jaGFyID0gdHlwZW9mIGMgIT09ICd1bmRlZmluZWQnID8gYyA6ICcwJztcclxuICAgIHZhciBwYWQgPSBuZXcgQXJyYXkoMSArIHApLmpvaW4ocGFkX2NoYXIpO1xyXG4gICAgcmV0dXJuIChwYWQgKyBuKS5zbGljZSgtcGFkLmxlbmd0aCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZvcm1hdDogZnVuY3Rpb24oZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKCFkdXJhdGlvbilcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBpID0gZHVyYXRpb24uYXNNaW51dGVzKCksXHJcbiAgICAgICAgICAgICAgICBob3VycyA9IE1hdGguZmxvb3IoaS82MCksXHJcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gaSAlIDYwXHJcbiAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFkZHkoaG91cnMsIDIpICsgJ2ggJyArIHBhZGR5KG1pbnV0ZXMsIDIpICsgJ20nO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2hlbHBlcnMvZHVyYXRpb24uanNcbiAqKiBtb2R1bGUgaWQgPSAxMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA2XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyIG1vbmV5ID0gcmVxdWlyZSgnaGVscGVycy9tb25leScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBkdXJhdGlvbjogcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKCksXHJcbiAgICBtb25leTogbW9uZXksXHJcblxyXG4gICAgaXRpbmVyYXJ5OiBmdW5jdGlvbihmbGlnaHQpIHtcclxuICAgICAgICB2YXIgcyA9IGZsaWdodC5nZXQoJ3NlZ21lbnRzLjAnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtzWzBdLmZyb20uYWlycG9ydENvZGUsIHNbcy5sZW5ndGgtMV0udG8uYWlycG9ydENvZGVdLmpvaW4oJyZtZGFzaDsnKTtcclxuICAgIH0sXHJcblxyXG4gICAgdGltZXM6IGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICByZXR1cm4gW2ZsaWdodHNbMF0uZGVwYXJ0X2F0LmZvcm1hdCgnRCBNTU0sIFlZWVknKSwgZmxpZ2h0c1tmbGlnaHRzLmxlbmd0aC0xXS5kZXBhcnRfYXQuZm9ybWF0KCdEIE1NTSwgWVlZWScpXS5qb2luKCctJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNhbmJvb2s6IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICB2YXIgb2sgPSB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIWFbaV0pXHJcbiAgICAgICAgICAgICAgICBvayA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiBvaztcclxuICAgIH0sXHJcblxyXG4gICAgcHJpY2U6IGZ1bmN0aW9uKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgdmFyIHByaWNlID0gMDtcclxuXHJcbiAgICAgICAgXy5lYWNoKHNlbGVjdGVkLCBmdW5jdGlvbihpKSB7IGlmIChpKSBwcmljZSArPSBpLmdldCgncHJpY2UnKTsgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwcmljZTtcclxuICAgIH0sXHJcblxyXG4gICAgZGlzY291bnQ6IGZ1bmN0aW9uKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgaWYgKDIgPT0gc2VsZWN0ZWQubGVuZ3RoICYmIHNlbGVjdGVkWzBdICYmIHNlbGVjdGVkWzFdKSB7XHJcbiAgICAgICAgICAgIHZhciBvbndhcmQgPSBzZWxlY3RlZFswXS5nZXQoKSxcclxuICAgICAgICAgICAgICAgIGJhY2t3YXJkID0gc2VsZWN0ZWRbMV0uZ2V0KCksXHJcbiAgICAgICAgICAgICAgICBncm91cGluZ3MgPSBfLmludGVyc2VjdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBvbndhcmQuc3lzdGVtLmdkcyA/IG9ud2FyZC5ncm91cGluZ3MgOiBfLmtleXMob253YXJkLmdyb3VwaW5ncyksXHJcbiAgICAgICAgICAgICAgICAgICAgXy5rZXlzKGJhY2t3YXJkLmdyb3VwaW5ncylcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBkaXNjb3VudFxyXG4gICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdyb3VwaW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbndhcmQuc3lzdGVtLmdkcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50ID0gYmFja3dhcmQuZ3JvdXBpbmdzW2dyb3VwaW5nc1swXV0uZGlzY291bnQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50ID0gb253YXJkLnByaWNlICsgYmFja3dhcmQucHJpY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLSBvbndhcmQuZ3JvdXBpbmdzW2dyb3VwaW5nc1swXV0ucHJpY2UgLSBiYWNrd2FyZC5ncm91cGluZ3NbZ3JvdXBpbmdzWzBdXS5wcmljZVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBkaXNjb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2hlbHBlcnMvZmxpZ2h0cy5qc1xuICoqIG1vZHVsZSBpZCA9IDExMVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wibXVsdF9pbmZvX2JhbiBmZmYgXCIse1widFwiOjQsXCJmXCI6W1wic2VsZWN0ZWRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlbGVjdGVkXCIsXCIuXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV19LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2VsZWN0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZm91ciBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIGZsaWdodERldGFpbFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJjbGFzc1wiOlwiY291bnRyeVwiLFwic3JjXCI6W3tcInRcIjoyLFwiclwiOlwiY2FycmllcnMuMC5sb2dvXCJ9XSxcImFsdFwiOlwiaW5kaWFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsaWdodFwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVycy4wLm5hbWVcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSkuZmxpZ2h0XCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIGRlcGFydFRpbWVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm11bHRfZGVwX3RpbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJISDptbVxcXCIpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm11bHRfZGVwX2RhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJkdXJhdGlvblwiLFwiZmlyc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXzEoXzIpLnRpbWUpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uICBhcnJpdmFsVGltZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibXVsdF9kZXBfdGltZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJfMChfMSkuYXJyaXZlLmZvcm1hdChcXFwiSEg6bW1cXFwiKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0X2RlcF9kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wibm9uLXN0b3BcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm5cIl0sXCJzXCI6XCIwPT1fMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiblwifSxcIiBzdG9wKHMpXCJdLFwieFwiOntcInJcIjpbXCJuXCJdLFwic1wiOlwiMD09XzBcIn19XSxcInhcIjp7XCJyXCI6W1wic3RvcHNcIixcInNlZ21lbnRzLjBcIl0sXCJzXCI6XCJ7bjpfMChfMSl9XCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIGZsaWdodFByaWNlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0X3ByaWNlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXNjb3VudFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XX0sXCIgXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInByaWNlXCIsXCJzYXZlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMS1fMixfMylcIn19XSxcIm5cIjo1MCxcInJcIjpcInNhdmVcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCIkXCIsXCJwcmljZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV0sXCJyXCI6XCJzYXZlXCJ9XSxcInhcIjp7XCJyXCI6W1wiZGlzY291bnRcIixcIm9ud2FyZFwiLFwiZmxpZ2h0XCJdLFwic1wiOlwie3NhdmU6XzAoW18xLF8yXSl9XCJ9fV0sXCJuXCI6NTAsXCJyXCI6XCJvbndhcmRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpc2NvdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicHJpY2VcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX1dfSxcIiBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wiJFwiLFwicHJpY2VcIixcInNhdmVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLV8yLF8zKVwifX1dLFwiblwiOjUwLFwiclwiOlwic2F2ZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XSxcInJcIjpcInNhdmVcIn1dLFwieFwiOntcInJcIjpbXCJkaXNjb3VudFwiLFwiZmxpZ2h0XCIsXCJiYWNrd2FyZFwiXSxcInNcIjpcIntzYXZlOl8wKFtfMSxfMl0pfVwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJiYWNrd2FyZFwiLFwic2VsZWN0ZWRcIl0sXCJzXCI6XCJfMCYmIV8xXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIiRcIixcInByaWNlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19XSxcInhcIjp7XCJyXCI6W1wiYmFja3dhcmRcIixcInNlbGVjdGVkXCJdLFwic1wiOlwiXzAmJiFfMVwifX1dLFwiclwiOlwib253YXJkXCJ9XX1dfV19XX1dLFwiclwiOlwiZmxpZ2h0XCJ9XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL2ZsaWdodC5odG1sXG4gKiogbW9kdWxlIGlkID0gMTEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcblxyXG4gICAgaF9tb25leSA9IHJlcXVpcmUoJ2hlbHBlcnMvbW9uZXknKSgpLFxyXG4gICAgaF9kdXJhdGlvbiA9IHJlcXVpcmUoJ2hlbHBlcnMvZHVyYXRpb24nKSgpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL2l0aW5lcmFyeS5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKFxyXG4gICAgICAgICAgICB7IG1vbWVudDogbW9tZW50LCBtb25leTogaF9tb25leS5tb25leSwgZHVyYXRpb246IGhfZHVyYXRpb24gfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvaXRpbmVyYXJ5LmpzXG4gKiogbW9kdWxlIGlkID0gMTEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ0XCI6W10sXCJ2XCI6M307XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2l0aW5lcmFyeS5odG1sXG4gKiogbW9kdWxlIGlkID0gMTE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UuanMnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEJvb2tpbmcgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L2Jvb2tpbmcnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxudmFyIFJPVVRFUyA9IHJlcXVpcmUoJ2FwcC9yb3V0ZXMnKS5mbGlnaHRzO1xyXG5cclxuXHJcbnZhciBtb25leSA9IHJlcXVpcmUoJ2hlbHBlcnMvbW9uZXknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvcm91bmR0cmlwLmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgZmxpZ2h0czogcmVxdWlyZSgnLi9mbGlnaHRzJyksXHJcbiAgICAgICAgZmxpZ2h0OiByZXF1aXJlKCcuL2ZsaWdodCcpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIG1ldGE6IE1ldGEub2JqZWN0LFxyXG5cclxuICAgICAgICAgICAgY2FycmllcjogLTEsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkOiBbXSxcclxuICAgICAgICAgICAgY291bnQ6IGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfLnN1bShfLm1hcChmbGlnaHRzLCBmdW5jdGlvbihpKSB7IHJldHVybiBpLmxlbmd0aDsgfSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYXJyaWVyczogZnVuY3Rpb24oY2FycmllcnMsIHByaWNlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKF8uY2xvbmVEZWVwKGNhcnJpZXJzKSwgZnVuY3Rpb24oaSkgeyBpLnByaWNlID0gcHJpY2VzW2kuY29kZV0gfHwgbnVsbDsgcmV0dXJuIGk7IH0pLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcCA9IGEucHJpY2UgfHwgOTk5OTk5OTk5LCBicCA9IGIucHJpY2UgfHwgOTk5OTk5OTk5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXAgPT0gYnApIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcCA+IGJwID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGZsaWdodCwgdmlldykge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3NlbGVjdGVkJywgZmxpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoTU9CSUxFICYmIDIgPT0gdGhpcy5nZXQoJ3NlbGVjdGVkJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib29rKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgIH0sIHJlcXVpcmUoJ2hlbHBlcnMvZmxpZ2h0cycpKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjYXJyaWVycyA9IFtdO1xyXG5cclxuICAgICAgICBfLmVhY2godGhpcy5nZXQoJ2ZsaWdodHMnKSwgZnVuY3Rpb24oZmxpZ2h0cykge1xyXG4gICAgICAgICAgICBfLmVhY2goZmxpZ2h0cywgZnVuY3Rpb24oZmxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXJyaWVyc1tjYXJyaWVycy5sZW5ndGhdID0gZmxpZ2h0LmdldCgnc2VnbWVudHMuMC4wLmNhcnJpZXInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdhbGxjYXJyaWVycycsIF8udW5pcXVlKGNhcnJpZXJzLCAnY29kZScpKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUucm91bmR0cmlwJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgdmFyIHdpZHRoID0gJCgnLmZsaWdodHMtZ3JpZCcsIHRoaXMuZWwpLndpZHRoKCk7XHJcblxyXG4gICAgICAgICAgICAkKCcuZmxpZ2h0cy1ncmlkID4gdGJvZHkgPiB0ciA+IHRkJywgdGhpcy5lbCkud2lkdGgod2lkdGgvMik7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgJCgnLmRyb3Bkb3duJywgdGhpcy5lbCkuZHJvcGRvd24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgYm9vazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuZ2V0KCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICBpZiAoMiA9PSBzZWxlY3RlZC5sZW5ndGggJiYgc2VsZWN0ZWRbMF0gJiYgc2VsZWN0ZWRbMV0pIHtcclxuICAgICAgICAgICAgdmFyIG9ud2FyZCA9IHNlbGVjdGVkWzBdLmdldCgpLFxyXG4gICAgICAgICAgICAgICAgYmFja3dhcmQgPSBzZWxlY3RlZFsxXS5nZXQoKSxcclxuICAgICAgICAgICAgICAgIGdyb3VwaW5ncyA9IF8uaW50ZXJzZWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIG9ud2FyZC5zeXN0ZW0uZ2RzID8gb253YXJkLmdyb3VwaW5ncyA6IF8ua2V5cyhvbndhcmQuZ3JvdXBpbmdzKSxcclxuICAgICAgICAgICAgICAgICAgICBfLmtleXMoYmFja3dhcmQuZ3JvdXBpbmdzKVxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIGRpc2NvdW50XHJcbiAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ3JvdXBpbmdzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9ud2FyZC5zeXN0ZW0uZ2RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQm9va2luZy5jcmVhdGUoW2JhY2t3YXJkLmdyb3VwaW5nc1tncm91cGluZ3NbMF1dLnN5c3RlbV0sIHsgY3M6IHZpZXcuZ2V0KCdzZWFyY2guY3MnKSwgICB1cmw6IHZpZXcuZ2V0KCdzZWFyY2gudXJsJyksY3VyOnZpZXcuZ2V0KCdtZXRhLmRpc3BsYXlfY3VycmVuY3knKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihib29raW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlKFJPVVRFUy5ib29raW5nKGJvb2tpbmcuZ2V0KCdpZCcpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBib29raW5nID0gb253YXJkLmdyb3VwaW5nc1tncm91cGluZ3NbMF1dLnN5c3RlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZy5yY3MucHVzaChiYWNrd2FyZC5ncm91cGluZ3NbZ3JvdXBpbmdzWzBdXS5zeXN0ZW0ucmNzWzBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgQm9va2luZy5jcmVhdGUoW2Jvb2tpbmddLCB7IGNzOiB2aWV3LmdldCgnc2VhcmNoLmNzJyksICAgdXJsOiB2aWV3LmdldCgnc2VhcmNoLnVybCcpLGN1cjp2aWV3LmdldCgnbWV0YS5kaXNwbGF5X2N1cnJlbmN5JykgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oYm9va2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZShST1VURVMuYm9va2luZyhib29raW5nLmdldCgnaWQnKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBCb29raW5nLmNyZWF0ZShfLm1hcCh0aGlzLmdldCgnc2VsZWN0ZWQnKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS5nZXQoJ3N5c3RlbScpOyB9KSwgeyBjczogdmlldy5nZXQoJ3NlYXJjaC5jcycpLCAgIHVybDogdmlldy5nZXQoJ3NlYXJjaC51cmwnKSxjdXI6dmlldy5nZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScpIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGJvb2tpbmcpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UoUk9VVEVTLmJvb2tpbmcoYm9va2luZy5nZXQoJ2lkJykpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dDYXJyaWVyOiBmdW5jdGlvbihjb2RlKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2NhcnJpZXInLCBjb2RlKTtcclxuICAgICAgICB0aGlzLmdldCgnZmlsdGVyJykuc2V0KCdmaWx0ZXJlZC5jYXJyaWVycycsIC0xID09IGNvZGUgPyBmYWxzZSA6IFtjb2RlXSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBtb2RpZnlTZWFyY2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5tb2RpZnlTZWFyY2goKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9yb3VuZHRyaXAuanNcbiAqKiBtb2R1bGUgaWQgPSAxMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcInNlY3Rpb25cIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2VhcmNoXzJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlbGVjdF9kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0aHJlZSBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBibHVlIGJ1dHRvblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcIm1vZGlmeVNlYXJjaFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiTW9kaWZ5XCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiBjZW50ZXIgYWxpZ25lZFwifSxcImZcIjpbXCIgXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW4gcmlnaHQgYWxpZ25lZFwifSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZmxvYXRpbmcgc29ydGluZyBkcm9wZG93biBpY29uIHRvcCByaWdodCBwb2ludGluZyBsYWJlbGVkIGJsdWUgYnV0dG9uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidGV4dFwifSxcImZcIjpbXCJQcmljZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRyb3Bkb3duIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1lbnUgdHJhbnNpdGlvbiBoaWRkZW5cIixcInRhYmluZGV4XCI6XCItMVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbSBhY3RpdmUgc2VsZWN0ZWRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNvcnRPbi4wXFxcIixcXFwicHJpY2VcXFwiXVwifX19LFwiZlwiOltcIlByaWNlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzb3J0T24uMFxcXCIsXFxcImFycml2ZVxcXCJdXCJ9fX0sXCJmXCI6W1wiQXJyaXZlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzb3J0T24uMFxcXCIsXFxcImRlcGFydFxcXCJdXCJ9fX0sXCJmXCI6W1wiRGVwYXJ0XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzb3J0T24uMFxcXCIsXFxcImFpcmxpbmVcXFwiXVwifX19LFwiZlwiOltcIkFpcmxpbmVcIl19XX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uX3NlYXJjaFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibXVsdF9mcm9tdG9cIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5mcm9tLmNpdHlcIn19LFwiIOKGkiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS50by5jaXR5XCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImN1cl9kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXlfbW9udGhcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRheV93ZWVrXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FsZW5kYXIgaWNvblwifX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCJdLFwic1wiOlwiXzAuZm9ybWF0KFxcXCJEIE1NTVxcXCIpXCJ9fSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VhcmNoLmZsaWdodHMuMC5kZXBhcnRfYXRcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcImRkZGRcXFwiKVwifX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhZ2VcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2VyIGljb25cIn19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwicGFzc2VuZ2Vycy4wXCJ9LFwiIEFkdWx0cywgXCIse1widFwiOjIsXCJyXCI6XCJwYXNzZW5nZXJzLjFcIn0sXCIgQ2hpbGRzLCBcIix7XCJ0XCI6MixcInJcIjpcInBhc3NlbmdlcnMuMlwifSxcIiBJbmZhbnRzXCJdfV0sXCJyXCI6XCJzZWFyY2hcIn1dfV0sXCJyXCI6XCJmbGlnaHRzLjAuMFwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzZWxfZGVwYXJ0dXJlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpbmZvX2Jhbl9zZWxlY3RlZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2VsX2RlcFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W1wiWW91ciBTZWxlY3RlZCBEZXBhcnR1cmVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjaGVja21hcmsgaWNvblwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3RfY2hhbmdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5mcm9tLmFpcnBvcnRDb2RlXCJ9fSxcIiAtIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJsYXN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpLnRvLmFpcnBvcnRDb2RlXCJ9fSxcIiAoXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcImRkZCwgREQgTU1NXFxcIilcIn19LFwiKVwiXX1dLFwiclwiOlwic2VsZWN0ZWQuMFwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNlbGVjdGVkXFxcIixbXV1cIn19fSxcImZcIjpbXCJDaGFuZ2VcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaW5mb19iYW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZmxpZ2h0XCIsXCJhXCI6e1wiZmxpZ2h0XCI6W3tcInRcIjoyLFwiclwiOlwic2VsZWN0ZWQuMFwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic2VsZWN0ZWRcIjpbe1widFwiOjIsXCJyXCI6XCJzZWxlY3RlZC4wXCJ9XX19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJldF9mbGlnaHRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDNcIixcImZcIjpbXCJOb3cgU2VsZWN0IHlvdXIgcmV0dXJuIGZsaWdodFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJmbGlnaHRzXCIsXCJhXCI6e1wic2VsZWN0Rm5cIjpbe1widFwiOjIsXCJyXCI6XCJvblNlbGVjdFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0cy4xXCJ9XSxcInNlbGVjdGVkXCI6W3tcInRcIjoyLFwiclwiOlwic2VsZWN0ZWQuMVwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic29ydE9uXCI6W3tcInRcIjoyLFwiclwiOlwic29ydE9uXCJ9XSxcIm9ud2FyZFwiOlt7XCJ0XCI6MixcInJcIjpcInNlbGVjdGVkLjBcIn1dfX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzZWxlY3RlZFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmbGlnaHRzXCIsXCJhXCI6e1wic2VsZWN0Rm5cIjpbe1widFwiOjIsXCJyXCI6XCJvblNlbGVjdFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0cy4wXCJ9XSxcInNlbGVjdGVkXCI6W3tcInRcIjoyLFwiclwiOlwic2VsZWN0ZWQuMFwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic29ydE9uXCI6W3tcInRcIjoyLFwiclwiOlwic29ydE9uXCJ9XX19XSxcInJcIjpcInNlbGVjdGVkXCJ9XX1dfV19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL3JvdW5kdHJpcC5odG1sXG4gKiogbW9kdWxlIGlkID0gMTE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpLFxyXG4gICAgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UuanMnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEJvb2tpbmcgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L2Jvb2tpbmcnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxudmFyIFJPVVRFUyA9IHJlcXVpcmUoJ2FwcC9yb3V0ZXMnKS5mbGlnaHRzO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICBmbGlnaHRzOiByZXF1aXJlKCcuL2ZsaWdodHMnKSxcclxuICAgICAgICAnbXVsdGljaXR5LXN1bW1hcnknOiByZXF1aXJlKCcuL211bHRpY2l0eS9zdW1tYXJ5JylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3QsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogMCxcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IFtdLFxyXG4gICAgICAgICAgICBwZXJjZW50OiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gMTAwL2FycmF5Lmxlbmd0aDsgfSxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGZsaWdodCwgdmlldykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuZ2V0KCdhY3RpdmUnKSxcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCA9IHRoaXMuZ2V0KCdmbGlnaHRzJykubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzZWxlY3RlZCcsIGZsaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKC0xICE9PSBhY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlIDwgY291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdhY3RpdmUnLCBhY3RpdmUrMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2aWV3LmdldCgnc2VsZWN0ZWQnKS5sZW5ndGggPCBjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLmdldCgnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkgKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZWN0ZWRbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnYWN0aXZlJywgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE1PQklMRSAmJiBjb3VudCA9PSB0aGlzLmdldCgnc2VsZWN0ZWQnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvb2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgfSwgcmVxdWlyZSgnaGVscGVycy9mbGlnaHRzJykpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcuZHJvcGRvd24nLCB0aGlzLmVsKS5kcm9wZG93bigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBib29rOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIEJvb2tpbmcuY3JlYXRlKF8ubWFwKHRoaXMuZ2V0KCdzZWxlY3RlZCcpLCBmdW5jdGlvbihpKSB7IHJldHVybiBpLmdldCgnc3lzdGVtJyk7IH0pLCB7IGNzOiB2aWV3LmdldCgnc2VhcmNoLmNzJyksIHVybDogdmlldy5nZXQoJ3NlYXJjaC51cmwnKSxjdXI6dmlldy5nZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScpIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGJvb2tpbmcpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UoUk9VVEVTLmJvb2tpbmcoYm9va2luZy5nZXQoJ2lkJykpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1vZGlmeVNlYXJjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yb290Lm1vZGlmeVNlYXJjaCgpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9yZXN1bHRzL211bHRpY2l0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDExN1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwic2VjdGlvblwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0aWNpdHlcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcInRvZ19kaXJcIixcImNsYXNzXCI6XCJ1aSBzZWNvbmRhcnkgcG9pbnRpbmcgZm91ciBkZW1vIGl0ZW0gbWVudVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlcIixcImFjdGl2ZVwiXSxcInNcIjpcIl8wPT1fMVwifX1dfSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXCJpXCJdLFwic1wiOlwiW1xcXCJhY3RpdmVcXFwiLF8wXVwifX19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpLmZyb20uYWlycG9ydENvZGVcIn19LFwiIOKAkyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS50by5haXJwb3J0Q29kZVwifX1dLFwiclwiOlwiLi8wXCJ9XX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZmxpZ2h0c1wifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlbGVjdF9kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0aHJlZSBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBibHVlIGJ1dHRvblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcIm1vZGlmeVNlYXJjaFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiTW9kaWZ5XCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiBjZW50ZXIgYWxpZ25lZFwifSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3VyX2RhdGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRheV9tb250aFwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCJdLFwic1wiOlwiXzAuZm9ybWF0KFxcXCJEIE1NTVxcXCIpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRheV93ZWVrXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VhcmNoLmZsaWdodHMuMC5kZXBhcnRfYXRcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcImRkZGRcXFwiKVwifX1dfV19LFwiIFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIHJpZ2h0IGFsaWduZWRcIn0sXCJmXCI6W1wiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZsb2F0aW5nIHNvcnRpbmcgZHJvcGRvd24gaWNvbiB0b3AgcmlnaHQgcG9pbnRpbmcgbGFiZWxlZCBibHVlIGJ1dHRvblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRleHRcIn0sXCJmXCI6W1wiUHJpY2VcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJkcm9wZG93biBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtZW51IHRyYW5zaXRpb24gaGlkZGVuXCIsXCJ0YWJpbmRleFwiOlwiLTFcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW0gYWN0aXZlIHNlbGVjdGVkXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzb3J0T24uMFxcXCIsXFxcInByaWNlXFxcIl1cIn19fSxcImZcIjpbXCJQcmljZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic29ydE9uLjBcXFwiLFxcXCJhcnJpdmVcXFwiXVwifX19LFwiZlwiOltcIkFycml2ZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic29ydE9uLjBcXFwiLFxcXCJkZXBhcnRcXFwiXVwifX19LFwiZlwiOltcIkRlcGFydFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic29ydE9uLjBcXFwiLFxcXCJhaXJsaW5lXFxcIl1cIn19fSxcImZcIjpbXCJBaXJsaW5lXCJdfV19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaW5mb19hcmVhXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmbGlnaHRzXCIsXCJhXCI6e1wic2VsZWN0Rm5cIjpbe1widFwiOjIsXCJyXCI6XCJvblNlbGVjdFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0cy4wXCJ9XSxcInNlbGVjdGVkXCI6W3tcInRcIjoyLFwiclwiOlwic2VsZWN0ZWQuMFwifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic29ydE9uXCI6W3tcInRcIjoyLFwiclwiOlwic29ydE9uXCJ9XX19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMD09XzBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZsaWdodHNcIixcImFcIjp7XCJzZWxlY3RGblwiOlt7XCJ0XCI6MixcInJcIjpcIm9uU2VsZWN0XCJ9XSxcImZsaWdodHNcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHRzLjFcIn1dLFwic2VsZWN0ZWRcIjpbe1widFwiOjIsXCJyXCI6XCJzZWxlY3RlZC4xXCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJzb3J0T25cIjpbe1widFwiOjIsXCJyXCI6XCJzb3J0T25cIn1dfX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZmxpZ2h0c1wiLFwiYVwiOntcInNlbGVjdEZuXCI6W3tcInRcIjoyLFwiclwiOlwib25TZWxlY3RcIn1dLFwiZmxpZ2h0c1wiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodHMuMlwifV0sXCJzZWxlY3RlZFwiOlt7XCJ0XCI6MixcInJcIjpcInNlbGVjdGVkLjJcIn1dLFwic2VhcmNoXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoXCJ9XSxcInNvcnRPblwiOlt7XCJ0XCI6MixcInJcIjpcInNvcnRPblwifV19fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjI9PV8wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmbGlnaHRzXCIsXCJhXCI6e1wic2VsZWN0Rm5cIjpbe1widFwiOjIsXCJyXCI6XCJvblNlbGVjdFwifV0sXCJmbGlnaHRzXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0cy4zXCJ9XSxcInNlbGVjdGVkXCI6W3tcInRcIjoyLFwiclwiOlwic2VsZWN0ZWQuM1wifV0sXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dLFwic29ydE9uXCI6W3tcInRcIjoyLFwiclwiOlwic29ydE9uXCJ9XX19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMz09XzBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZsaWdodHNcIixcImFcIjp7XCJzZWxlY3RGblwiOlt7XCJ0XCI6MixcInJcIjpcIm9uU2VsZWN0XCJ9XSxcImZsaWdodHNcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHRzLjRcIn1dLFwic2VsZWN0ZWRcIjpbe1widFwiOjIsXCJyXCI6XCJzZWxlY3RlZC40XCJ9XSxcInNlYXJjaFwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaFwifV0sXCJzb3J0T25cIjpbe1widFwiOjIsXCJyXCI6XCJzb3J0T25cIn1dfX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCI0PT1fMFwifX1dfV19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvbXVsdGljaXR5Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvcmVzdWx0cy9tdWx0aWNpdHkvc3VtbWFyeS5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIGZsaWdodHM6IHJlcXVpcmUoJy4uL2ZsaWdodHMnKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwZXJjZW50OiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gMTAwL2FycmF5Lmxlbmd0aDsgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvbXVsdGljaXR5L3N1bW1hcnkuanNcbiAqKiBtb2R1bGUgaWQgPSAxMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInRcIjpbXSxcInZcIjozfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL3Jlc3VsdHMvbXVsdGljaXR5L3N1bW1hcnkuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDEyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBTZWFyY2ggPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L3NlYXJjaCcpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ3VpLXNwaW5uZXInOiByZXF1aXJlKCdjb3JlL2Zvcm0vc3Bpbm5lcicpLFxyXG4gICAgICAgICd1aS1haXJwb3J0JzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL2FpcnBvcnQnKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtb21lbnQ6IG1vbWVudFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNldCgnc2VhcmNoJywgU2VhcmNoLnBhcnNlKHRoaXMuZ2V0KCdtb2RpZnknKS50b0pTT04oKSkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHBvcHVwID0gJCh0aGlzLmZpbmQoJy5leHRlbmRlZC5wb3B1cCcpKSxcclxuICAgICAgICAgICAgZm4gPSAkKHRoaXMuZmluZCgnLmV4dGVuZGVkLmRyb3Bkb3duJykpXHJcbiAgICAgICAgICAgICAgICAucG9wdXAoe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2JvdHRvbSByaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXA6ICQodGhpcy5maW5kKCcuZXh0ZW5kZWQucG9wdXAnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgb246IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlZmVyOiAnb3Bwb3NpdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBmbi5wb3B1cCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLm9uKCdjbGljay5tb2RpZnktc2VhcmNoJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2subW9kaWZ5LXNlYXJjaCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4ucG9wdXAoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKCdjbGljay5tb2RpZnktc2VhcmNoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLm9mZignY2xpY2subW9kaWZ5LXNlYXJjaCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIDtcclxuICAgIH0sXHJcblxyXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnBvc3QoUk9VVEVTLnNlYXJjaCwgdGhpcy5zZXJpYWxpemUoKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2VhcmNoKSB7IHBhZ2Uoc2VhcmNoLnVybCk7IH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5nZXQoJ3NlYXJjaCcpLnRvSlNPTigpOyB9XHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmpzXG4gKiogbW9kdWxlIGlkID0gMTIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ0XCI6W10sXCJ2XCI6M307XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9tb2RpZnkvc2luZ2xlLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eS5odG1sJyksXHJcblxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGl0aW5lcmFyeTogZnVuY3Rpb24oZmxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZsaWdodClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBmbGlnaHQuZ2V0KCdzZWdtZW50cy4wJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtzWzBdLmZyb20uYWlycG9ydENvZGUsIHNbcy5sZW5ndGgtMV0udG8uYWlycG9ydENvZGVdLmpvaW4oJy0nKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHRpbWVzOiBmdW5jdGlvbihmbGlnaHRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW2ZsaWdodHNbMF0uZGVwYXJ0X2F0LmZvcm1hdCgnRCBNTU0sIFlZWVknKSwgZmxpZ2h0c1tmbGlnaHRzLmxlbmd0aC0xXS5kZXBhcnRfYXQuZm9ybWF0KCdEIE1NTSwgWVlZWScpXS5qb2luKCctJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBtb2RpZnlTZWFyY2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5tb2RpZnlTZWFyY2goKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDEyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widFwiOltdLFwidlwiOjN9O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvbW9kaWZ5L211bHRpY2l0eS5odG1sXG4gKiogbW9kdWxlIGlkID0gMTI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvc2VhcmNoL2ZpbHRlci5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL3RoaXMub2JzZXJ2ZSgnZmlsdGVyZWQnLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAvLyAgICB0aGlzLnNldCgncmVzZXQnLCB0cnVlKS50aGVuKGZ1bmN0aW9uKCkgeyB0aGlzLnNldCgncmVzZXQnLCBmYWxzZSk7IH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIC8vfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcudWkuYWNjb3JkaW9uJykpLmFjY29yZGlvbih7ZXhjbHVzaXZlOiBmYWxzZX0pO1xyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLmNoZWNrYm94JykpLmNoZWNrYm94KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJpY2UgPSAkKHRoaXMuZmluZCgnLnByaWNlLnNsaWRlcicpKS5pb25SYW5nZVNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvdWJsZVwiLFxyXG4gICAgICAgICAgICAgICAgZ3JpZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlIDogZnVuY3Rpb24gKGRhdGEpIHsgdmlldy5nZXQoJ2ZpbHRlcicpLnNldCgnZmlsdGVyZWQucHJpY2VzJywgW2RhdGEuZnJvbSwgZGF0YS50b10pOyB9XHJcbiAgICAgICAgICAgIH0pLmRhdGEoJ2lvblJhbmdlU2xpZGVyJyk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLmRlcGFydHVyZS5zbGlkZXInKSkuaW9uUmFuZ2VTbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJkb3VibGVcIixcclxuICAgICAgICAgICAgICAgIG1pbjogK21vbWVudCgpLnN0YXJ0T2YoJ2RheScpLmZvcm1hdChcIlhcIiksXHJcbiAgICAgICAgICAgICAgICBtYXg6ICttb21lbnQoKS5lbmRPZignZGF5JykuZm9ybWF0KFwiWFwiKSxcclxuICAgICAgICAgICAgICAgIHByZXR0aWZ5OiBmdW5jdGlvbiAobnVtKSB7IHJldHVybiBtb21lbnQobnVtLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIik7IH0sXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZSA6IGZ1bmN0aW9uIChkYXRhKSB7IHZpZXcuZ2V0KCdmaWx0ZXInKS5zZXQoJ2ZpbHRlcmVkLmRlcGFydHVyZScsIFttb21lbnQoZGF0YS5mcm9tLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIiksIG1vbWVudChkYXRhLnRvLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIildKTsgfVxyXG4gICAgICAgICAgICB9KS5kYXRhKCdpb25SYW5nZVNsaWRlcicpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcubGF5b3Zlci5zbGlkZXInKSkuaW9uUmFuZ2VTbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJkb3VibGVcIixcclxuICAgICAgICAgICAgICAgIG1pbjogK21vbWVudCgpLnN0YXJ0T2YoJ2RheScpLmZvcm1hdChcIlhcIiksXHJcbiAgICAgICAgICAgICAgICBtYXg6ICttb21lbnQoKS5lbmRPZignZGF5JykuZm9ybWF0KFwiWFwiKSxcclxuICAgICAgICAgICAgICAgIHByZXR0aWZ5OiBmdW5jdGlvbiAobnVtKSB7IHJldHVybiBtb21lbnQobnVtLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIik7IH0sXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZSA6IGZ1bmN0aW9uIChkYXRhKSB7IHZpZXcuZ2V0KCdmaWx0ZXInKS5zZXQoJ2ZpbHRlcmVkLmxheW92ZXInLCBbbW9tZW50KGRhdGEuZnJvbSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpLCBtb21lbnQoZGF0YS50bywgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpXSk7IH1cclxuICAgICAgICAgICAgfSkuZGF0YSgnaW9uUmFuZ2VTbGlkZXInKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcuYXJyaXZlLnNsaWRlcicpKS5pb25SYW5nZVNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRvdWJsZVwiLFxyXG4gICAgICAgICAgICAgICAgbWluOiArbW9tZW50KCkuc3RhcnRPZignZGF5JykuZm9ybWF0KFwiWFwiKSxcclxuICAgICAgICAgICAgICAgIG1heDogK21vbWVudCgpLmVuZE9mKCdkYXknKS5mb3JtYXQoXCJYXCIpLFxyXG4gICAgICAgICAgICAgICAgcHJldHRpZnk6IGZ1bmN0aW9uIChudW0pIHsgcmV0dXJuIG1vbWVudChudW0sIFwiWFwiKS5mb3JtYXQoXCJISDptbVwiKTsgfSxcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlIDogZnVuY3Rpb24gKGRhdGEpIHsgdmlldy5nZXQoJ2ZpbHRlcicpLnNldCgnZmlsdGVyZWQuYXJyaXZhbCcsIFttb21lbnQoZGF0YS5mcm9tLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIiksIG1vbWVudChkYXRhLnRvLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIildKTsgfVxyXG4gICAgICAgICAgICB9KS5kYXRhKCdpb25SYW5nZVNsaWRlcicpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy5iYWNrd2FyZC1hcnJpdmUuc2xpZGVyJykpLmlvblJhbmdlU2xpZGVyKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZG91YmxlXCIsXHJcbiAgICAgICAgICAgICAgICBtaW46ICttb21lbnQoKS5zdGFydE9mKCdkYXknKS5mb3JtYXQoXCJYXCIpLFxyXG4gICAgICAgICAgICAgICAgbWF4OiArbW9tZW50KCkuZW5kT2YoJ2RheScpLmZvcm1hdChcIlhcIiksXHJcbiAgICAgICAgICAgICAgICBwcmV0dGlmeTogZnVuY3Rpb24gKG51bSkgeyByZXR1cm4gbW9tZW50KG51bSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpOyB9LFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2UgOiBmdW5jdGlvbiAoZGF0YSkgeyB2aWV3LmdldCgnZmlsdGVyJykuc2V0KCdmaWx0ZXJlZC5hcnJpdmFsMicsIFttb21lbnQoZGF0YS5mcm9tLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIiksIG1vbWVudChkYXRhLnRvLCBcIlhcIikuZm9ybWF0KFwiSEg6bW1cIildKTsgfVxyXG4gICAgICAgICAgICB9KS5kYXRhKCdpb25SYW5nZVNsaWRlcicpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy5iYWNrd2FyZC1kZXBhcnR1cmUuc2xpZGVyJykpLmlvblJhbmdlU2xpZGVyKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZG91YmxlXCIsXHJcbiAgICAgICAgICAgICAgICBtaW46ICttb21lbnQoKS5zdGFydE9mKCdkYXknKS5mb3JtYXQoXCJYXCIpLFxyXG4gICAgICAgICAgICAgICAgbWF4OiArbW9tZW50KCkuZW5kT2YoJ2RheScpLmZvcm1hdChcIlhcIiksXHJcbiAgICAgICAgICAgICAgICBwcmV0dGlmeTogZnVuY3Rpb24gKG51bSkgeyByZXR1cm4gbW9tZW50KG51bSwgXCJYXCIpLmZvcm1hdChcIkhIOm1tXCIpOyB9LFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2UgOiBmdW5jdGlvbiAoZGF0YSkgeyB2aWV3LmdldCgnZmlsdGVyJykuc2V0KCdmaWx0ZXJlZC5kZXBhcnR1cmUyJywgW21vbWVudChkYXRhLmZyb20sIFwiWFwiKS5mb3JtYXQoXCJISDptbVwiKSwgbW9tZW50KGRhdGEudG8sIFwiWFwiKS5mb3JtYXQoXCJISDptbVwiKV0pOyB9XHJcbiAgICAgICAgICAgIH0pLmRhdGEoJ2lvblJhbmdlU2xpZGVyJyk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCdmaWx0ZXIucHJpY2VzJywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHByaWNlLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluOiB2YWx1ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICBtYXg6IHZhbHVlWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IHZhbHVlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiB2YWx1ZVsxXVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSwge2luaXQ6IHRydWV9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgnZmlsdGVyLmZpbHRlcmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXQoJ2ZpbHRlcicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ2ZpbHRlcicpLmZpbHRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcclxuICAgICAgICB9LmJpbmQodGhpcyksIDUwMCk7XHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgbW9kaWZ5U2VhcmNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJvb3QubW9kaWZ5U2VhcmNoKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNhcnJpZXJzOiBmdW5jdGlvbihlLCBzaG93KSB7XHJcbiAgICAgICAgZS5vcmlnaW5hbC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2ZpbHRlci5maWx0ZXJlZC5jYXJyaWVycycsIHNob3cgPyBfLnBsdWNrKHRoaXMuZ2V0KCdmaWx0ZXIuY2FycmllcnMnKSwgJ2NvZGUnKSA6IFtdKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvZmlsdGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ0XCI6W10sXCJ2XCI6M307XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9maWx0ZXIuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDEyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFBhZ2UgPSByZXF1aXJlKCdjb21wb25lbnRzL3BhZ2UnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdlLmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvYm9va2luZy5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICdib29raW5nJzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcnKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtZXRhOiBNZXRhLm9iamVjdFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3BhZ2VzL2ZsaWdodHMvYm9va2luZy5qc1xuICoqIG1vZHVsZSBpZCA9IDEyN1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwibGF5b3V0XCIsXCJhXCI6e1wicGFuZWxcIjpcIjBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYm9va2luZ1wiLFwiYVwiOntcImlkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn1dfX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvcGFnZXMvZmxpZ2h0cy9ib29raW5nLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UuanMnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEJvb2tpbmcgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L2Jvb2tpbmcnKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9ib29raW5nL2luZGV4Lmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgbGF5b3V0OiByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9sYXlvdXQnKSxcclxuICAgICAgICBzdGVwMTogcmVxdWlyZSgnLi9zdGVwMScpLFxyXG4gICAgICAgIHN0ZXAyOiByZXF1aXJlKCcuL3N0ZXAyJyksXHJcbiAgICAgICAgc3RlcDM6IHJlcXVpcmUoJy4vc3RlcDMnKSxcclxuICAgICAgICBzdGVwNDogcmVxdWlyZSgnLi9zdGVwNCcpXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnRpYWxzOiB7XHJcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcclxuICAgIH0sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWV0YTogTWV0YS5vYmplY3RcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgQm9va2luZy5mZXRjaCh0aGlzLmdldCgnaWQnKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGJvb2tpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0KCdib29raW5nJywgYm9va2luZyk7IFxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuICAgIG9uY29tcGxldGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcudWkuZHJvcGRvd24uY3VycmVuY3knKS5oaWRlKCk7XHJcbiAgICAgICB0aGlzLm9ic2VydmUoJ2Jvb2tpbmcuY3VycmVuY3knLCBmdW5jdGlvbihjdXIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGN1cj10aGlzLmdldCgnYm9va2luZy5jdXJyZW5jeScpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjdXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2Jvb2tpbmcuY3VycmVuY3knLGN1ciApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ21ldGEuZGlzcGxheV9jdXJyZW5jeScsY3VyICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCdtZXRhJyk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmdldCgnbWV0YScpKTtcclxuICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgXHJcbiAgICB9LFxyXG4gICAgb250ZWFyZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnNob3dQYW5lbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oZm9yY2UpIHtcclxuICAgICAgICBmb3JjZSA9IGZvcmNlIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gJy9iMmMvZmxpZ2h0cycgKyB0aGlzLmdldCgnYm9va2luZy5zZWFyY2h1cmwnKSxcclxuICAgICAgICAgICAgY3MgPSB0aGlzLmdldCgnYm9va2luZy5jbGllbnRTb3VyY2VJZCcpLFxyXG4gICAgICAgICAgICBwYXJhbXMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGNzICYmIGNzID4gMSkge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaCgnY3M9JyArIGNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmb3JjZSkge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaCgnZm9yY2U9MScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdXJsICs9ICc/JyArIHBhcmFtcy5qb2luKCcmJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYWdlKHVybCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGJhY2syOiBmdW5jdGlvbigpIHsgdGhpcy5iYWNrKHRydWUpOyB9LFxyXG4gICAgc2V0Q3VycmVuY3lCb29raW5nOiBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGNvZGU9JCgnI2N1cnJlbmN5MScpLnZhbCgpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY29kZSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Jvb2tpbmcuY3VycmVuY3knLCBjb2RlKTtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZ2V0KCdib29raW5nLmN1cnJlbmN5JykpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCdib29raW5nLmN1cnJlbmN5Jyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDEyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiaGVhZGVyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRocmVlIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImlkXCI6XCJiYWNrX2J0blwiLFwiY2xhc3NcIjpcImJhY2tfcGFnZVwiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYmFja1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL2Fycm93X2JhY2sucG5nXCIsXCJhbHRcIjpcImJhY2tcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJsb2dvXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL2xvZ28ucG5nXCIsXCJhbHRcIjpcIkNoZWFwVGlja2V0LmluXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIHJpZ2h0IGFsaWduZWRcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjdXJyZW5jeVdyYXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIkN1cnJlbmN5OlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwibWVudSB0cmFuc2l0aW9uXCIsXCJzdHlsZVwiOlwiei1pbmRleDogMTAxMDtcIixcImlkXCI6XCJjdXJyZW5jeTFcIn0sXCJ2XCI6e1wiY2hhbmdlXCI6e1wibVwiOlwic2V0Q3VycmVuY3lCb29raW5nXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiSU5SXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiSU5SXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiaW5yIGljb24gY3VycmVuY3lcIn19LFwiIFJ1cGVlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJVU0RcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJVU0RcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2QgaWNvbiBjdXJyZW5jeVwifX0sXCIgVVMgRG9sbGFyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJFVVJcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJFVVJcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJldXIgaWNvbiBjdXJyZW5jeVwifX0sXCIgRXVyb1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlwiR0JQXCJ9LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wPT1cXFwiR0JQXFxcIlwifX1dLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiZ2JwIGljb24gY3VycmVuY3lcIn19LFwiIFVLIFBvdW5kXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJBVURcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJBVURcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2QgaWNvbiBjdXJyZW5jeVwifX0sXCIgQXVzdHJhbGlhbiBEb2xsYXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpcIkpQWVwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wic2VsZWN0ZWRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMD09XFxcIkpQWVxcXCJcIn19XSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImpweSBpY29uIGN1cnJlbmN5XCJ9fSxcIiBKYXBhbmVzZSBZZW5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpcIlJVQlwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wic2VsZWN0ZWRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMD09XFxcIlJVQlxcXCJcIn19XSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJ1YiBpY29uIGN1cnJlbmN5XCJ9fSxcIiBSdXNzaWFuIFJ1YmxlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6XCJBRURcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzA9PVxcXCJBRURcXFwiXCJ9fV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJhZWQgaWNvbiBjdXJyZW5jeVwifX0sXCIgRGlyaGFtXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xlYXJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3RlcDFcIixcImFcIjp7XCJib29raW5nXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInN0ZXAyXCIsXCJhXCI6e1wiYm9va2luZ1wiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzdGVwM1wiLFwiYVwiOntcImJvb2tpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3RlcDRcIixcImFcIjp7XCJib29raW5nXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJwb3B1cC1jb250YWluZXJcIn0sXCJmXCI6W119XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvaW5kZXguaHRtbFxuICoqIG1vZHVsZSBpZCA9IDEzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJylcclxuICAgIDtcclxuXHJcbnZhciBoX21vbmV5ID0gcmVxdWlyZSgnaGVscGVycy9tb25leScpLFxyXG4gICAgaF9kdXJhdGlvbiA9IHJlcXVpcmUoJ2hlbHBlcnMvZHVyYXRpb24nKSgpXHJcbiAgICA7XHJcblxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDEuaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICBpdGluZXJhcnk6IHJlcXVpcmUoJy4uL2l0aW5lcmFyeScpLFxyXG4gICAgICAgICd1aS1jb2RlJzogcmVxdWlyZSgnY29yZS9mb3JtL2NvZGUnKSxcclxuICAgICAgICAndWktZW1haWwnOiByZXF1aXJlKCdjb3JlL2Zvcm0vZW1haWwnKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcm9tb2NvZGU6bnVsbCxcclxuICAgICAgICAgICAgcHJvbW92YWx1ZTpudWxsLFxyXG4gICAgICAgICAgICBwcm9tb2Vycm9yOm51bGwsXHJcbiAgICAgICAgICAgIG1vbmV5OiBoX21vbmV5LFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogaF9kdXJhdGlvbixcclxuXHJcbiAgICAgICAgICAgIHNlZ19sZW5ndGg6IGZ1bmN0aW9uKGZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gMDtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChmbGlnaHRzLCBmdW5jdGlvbihmbGlnaHQpIHsgYyArPSBmbGlnaHQuZ2V0KCdzZWdtZW50cycpLmxlbmd0aDsgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ2Jvb2tpbmcuc3RlcHMuMS5hY3RpdmUnLCBmdW5jdGlvbihhY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGE9dGhpcy5nZXQoJ2Jvb2tpbmcnKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5nZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgncHJvbW9jb2RlJyx0aGlzLmdldCgnYm9va2luZy5wcm9tb19jb2RlJykpO1xyXG4gICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdwcm9tb3ZhbHVlJyx0aGlzLmdldCgnYm9va2luZy5wcm9tb192YWx1ZScpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjdXI9dGhpcy5nZXQoJ2Jvb2tpbmcuY3VycmVuY3knKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3VyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdtZXRhLmRpc3BsYXlfY3VycmVuY3knLGN1ciApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgnbWV0YScpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5nZXQoJ21ldGEnKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSxcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCcucHJpY2UnKSlcclxuICAgICAgICAgICAgLnBvcHVwKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2JvdHRvbSByaWdodCcsXHJcbiAgICAgICAgICAgICAgICBwb3B1cDogJCh0aGlzLmZpbmQoJy5mYXJlLnBvcHVwJykpLFxyXG4gICAgICAgICAgICAgICAgb246ICdob3ZlcidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5nZXQoJ2Jvb2tpbmcuaWQnKSk7XHJcbiAgICAgICAvLyAkKHRoaXMuZmluZCgnZm9ybScpKS5hamF4U3VibWl0KHt1cmw6ICdhYm91dDpibGFuaycsIG1ldGhvZDogJ1BPU1QnLCBpZnJhbWU6IHRydWV9KTtcclxuICAgICAgICB0aGlzLmdldCgnYm9va2luZycpLnN0ZXAxKCk7XHJcblxyXG4gICAgICAgIGlmIChNT0JJTEUgJiYgd2luZG93LmxvY2FsU3RvcmFnZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tpbmdfZW1haWwnLCB0aGlzLmdldCgnYm9va2luZy51c2VyLmVtYWlsJykpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jvb2tpbmdfY291bnRyeScsIHRoaXMuZ2V0KCdib29raW5nLnVzZXIuY291bnRyeScpKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdib29raW5nX21vYmlsZScsIHRoaXMuZ2V0KCdib29raW5nLnVzZXIubW9iaWxlJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQuYmFjaygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7IGlmICghdGhpcy5nZXQoJ2Jvb2tpbmcucGF5bWVudC5wYXltZW50X2lkJykpIHRoaXMuZ2V0KCdib29raW5nJykuYWN0aXZhdGUoMSk7IH0sXHJcblxyXG4gICAgc2lnbmluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIEF1dGgubG9naW4oKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnbWV0YS51c2VyJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy51c2VyJywgeyBpZDogZGF0YS5pZCwgZW1haWw6IGRhdGEuZW1haWwsIG1vYmlsZTogZGF0YS5tb2JpbGUsY291bnRyeTpkYXRhLmNvdW50cnksIGxvZ2dlZF9pbjogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgYXBwbHlQcm9tb0NvZGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgXHJcbiAgICAgICAgICB2YXIgcHJvbW9jb2RlPXRoaXMuZ2V0KCdwcm9tb2NvZGUnKTtcclxuICAgICAgICAgIHRoaXMuc2V0KCdwcm9tb2Vycm9yJyxudWxsKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzOyAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpLHByb21vOnByb21vY29kZX07XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL2NoZWNrUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmhhc093blByb3BlcnR5KCdlcnJvcicpKXsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb2Vycm9yJyxkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb3ZhbHVlJyxkYXRhLnZhbHVlKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Jvb2tpbmcucHJvbW9fdmFsdWUnLGRhdGEudmFsdWUpOyBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb19jb2RlJyxkYXRhLmNvZGUpOyBcclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUHJvbW9Db2RlOmZ1bmN0aW9uKCl7XHJcbiAgICAgLy8gICBjb25zb2xlLmxvZygncmVtb3ZlUHJvbW9Db2RlJyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vZXJyb3InLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb2NvZGUnLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb3ZhbHVlJyxudWxsKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzOyAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvcmVtb3ZlUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb192YWx1ZScsbnVsbCk7IFxyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScsbnVsbCk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlRXJyb3JNc2c6ZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICB9XHJcblxyXG5cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9ib29raW5nL3N0ZXAxLmpzXG4gKiogbW9kdWxlIGlkID0gMTMxXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNlY3Rpb25cIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W1widWkgZm9ybSBjb25mZXJtYXRpb24gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5zdWJtaXR0aW5nXCJ9XSxcIm5vdmFsaWRhdGVcIjowfSxcInZcIjp7XCJzdWJtaXRcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aXRsZV9zdHJpcGVcIn0sXCJmXCI6W1wiUmV2aWV3IFlvdXIgSXRpbmVyYXJ5XCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmcm9tdG9cIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS5mcm9tLmNpdHlcIn19LFwiIOKGkiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIl8wKF8xKS50by5jaXR5XCJ9fSxcIiAoXCIse1widFwiOjQsXCJmXCI6W1wiTm9uLXN0b3BcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0b3BzXCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiMD09XzAoXzEpXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInN0b3BzXCIsXCJzZWdtZW50cy4wXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiBzdG9wKHMpXCJdLFwieFwiOntcInJcIjpbXCJzdG9wc1wiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcIjA9PV8wKF8xKVwifX0sXCIpXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiaGlzdG9yeSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZHVyYXRpb25cIixcInRpbWVcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXzEpXCJ9fV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIkl0aW5lcmFyeVJldmlld1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibXVsdF9pbmZvX2JhbiBmZmZcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZvdXIgY29sdW1uIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiBmbGlnaHREZXRhaWxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvdW50cnlcIixcInNyY1wiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJzLjAubG9nb1wifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmbGlnaHRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY2FycmllcnMuMC5uYW1lXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmZsaWdodFwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiBkZXBhcnRUaW1lXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0X2RlcF90aW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuZnJvbS5haXJwb3J0Q29kZVwifX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIkhIOm1tXFxcIilcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibXVsdF9kZXBfZGF0ZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIk1NTSBEXFxcIilcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmRlcGFydC5mb3JtYXQoXFxcIllZWVlcXFwiKVwifX0sXCIsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmaXJzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS5kZXBhcnQuZm9ybWF0KFxcXCJkZGRcXFwiKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidmlhX2JvbVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIlZpYVwiXSxcIm5cIjo1MCxcInJcIjpcImFpcnBvcnRzXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIixcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCIwIT09XzBcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcInRpdGxlXCI6W3tcInRcIjoyLFwiclwiOlwiLmFpcnBvcnRcIn0sXCIsIFwiLHtcInRcIjoyLFwiclwiOlwiLmNpdHlcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuYWlycG9ydENvZGVcIn1dfV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJhaXJwb3J0c1wifV0sXCJ4XCI6e1wiclwiOltcInZpYVwiLFwic2VnbWVudHMuMFwiXSxcInNcIjpcInthaXJwb3J0czpfMChfMSl9XCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIGFycml2YWxUaW1lXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0X2RlcF90aW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibGFzdFwiLFwiLlwiXSxcInNcIjpcIl8wKF8xKS50by5haXJwb3J0Q29kZVwifX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImxhc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuYXJyaXZlLmZvcm1hdChcXFwiSEg6bW1cXFwiKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0X2RlcF9kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuYXJyaXZlLmZvcm1hdChcXFwiTU1NIERcXFwiKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZmlyc3RcIixcIi5cIl0sXCJzXCI6XCJfMChfMSkuYXJyaXZlLmZvcm1hdChcXFwiWVlZWVxcXCIpXCJ9fSxcIiwgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZpcnN0XCIsXCIuXCJdLFwic1wiOlwiXzAoXzEpLmFycml2ZS5mb3JtYXQoXFxcImRkZFxcXCIpXCJ9fV19XX1dfV19XX1dLFwiblwiOjUyLFwiclwiOlwic2VnbWVudHNcIn1dLFwiblwiOjUyLFwiclwiOlwiYm9va2luZy5mbGlnaHRzXCJ9LHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInByaWNlX2RldFwifSxcImZcIjpbXCJUb3RhbCBQcmljZTogXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRhY3RfZGV0XCJ9LFwiZlwiOltcIkNvbnRhY3QgRGV0YWlsc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgc2VnbWVudCBtYWlsaWRcIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicmlnaHQgYWxpZ25lZCBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImFcIjp7XCJzdHlsZVwiOlwiZm9udC1zaXplOjE0cHghaW1wb3J0YW50O1wifSxcImZcIjpbXCJBbHJlYWR5IGhhdmUgYW4gYWNjb3VudD9cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOlwidWkgYnV0dG9uIHNtYWxsIGJsdWVcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzaWduaW5cIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIlNpZ24gaW5cIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZvcm1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkIFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1lbWFpbFwiLFwiYVwiOntcImNsYXNzXCI6XCJmdWxsXCIsXCJuYW1lXCI6XCJlbWFpbFwiLFwicGxhY2Vob2xkZXJcIjpcIkUtbWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nLnVzZXIuZW1haWxcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5lbWFpbFwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIihUaWNrZXRzIHdpbGwgYmUgc2VudCB0byB0aGlzIGVtYWlsIGlkKVwiXX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmb3JtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZCBtb2JpbGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwiY29kZSBpbnB1dFwiLFwidHlwZVwiOlwidGVsXCIsXCJuYW1lXCI6XCJtb2JpbGVcIixcInBsYWNlaG9sZGVyXCI6XCJDb2RlXCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm1vYmlsZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcudXNlci5jb3VudHJ5XCJ9XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwibU51bWJlclwiLFwidHlwZVwiOlwidGVsXCIsXCJuYW1lXCI6XCJtb2JpbGVcIixcInBsYWNlaG9sZGVyXCI6XCJNb2JpbGVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZy51c2VyLm1vYmlsZVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm1vYmlsZVwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIihZb3VyIFBOUiB3aWxsIGJlIHNlbnQgdG8gdGhpcyBudW1iZXIpXCJdfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmb3JtIGVycm9yXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcInN0ZXAuZXJyb3JzXCJ9XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d28gZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbSBwcm9tb0NvZGVcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicHJvbW9jb2RlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb21vY29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgXCIsXCJwbGFjZWhvbGRlclwiOlwiRW50ZXIgUHJvbW8gQ29kZVwiLFwiZGlzYWJsZWRcIjpcImRpc2FibGVkXCJ9LFwiZlwiOltdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwcm9tb2NvZGVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvbW9jb2RlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCBcIixcInBsYWNlaG9sZGVyXCI6XCJFbnRlciBQcm9tbyBDb2RlXCJ9LFwiZlwiOltdfV0sXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlbW92ZVByb21vQ29kZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiQXBwbGllZFwiLHtcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJyZWQgcmVtb3ZlIGNpcmNsZSBvdXRsaW5lIGljb25cIixcImFsdFwiOlwiUmVtb3ZlIFByb21vIENvZGVcIixcInRpdGxlXCI6XCJSZW1vdmUgUHJvbW8gQ29kZVwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIGJ1dHRvbiBzbWFsbFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImFwcGx5UHJvbW9Db2RlXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJBUFBMWVwiXX1dLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcImNsZWFyOmJvdGg7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzbWFsbCBmaWVsZCBuZWdhdGl2ZSBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlbW92ZUVycm9yTXNnXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJwcm9tb2Vycm9yXCJ9XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vZXJyb3JcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY2xpZW50U291cmNlSWRcIl0sXCJzXCI6XCJfMD09MVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRhY3RfZGV0XCJ9LFwiZlwiOltcIlByaWNlIERldGFpbHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInByaWNlX2FyZWFcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHR3byBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJiYXNlX3ByaWNlXCJ9LFwiZlwiOltcIkJhc2UgRmFyZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGF4ZXNfcHJpY2VcIn0sXCJmXCI6W1wiVGF4ZXMgJiBGZWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRvdGFsX3ByaWNlXCJ9LFwiZlwiOltcIlByaWNlXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYmFzZV9hbW91bnRcIn0sXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy50YXhlcy5iYXNpY19mYXJlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRheGVzX2Ftb3VudFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnRheGVzLnlxXCIsXCJib29raW5nLnRheGVzLmpuXCIsXCJib29raW5nLnRheGVzLm90aGVyXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzErXzIrXzMsXzQpXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidG90YWxfYW1vdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIC0gXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJwcm9tb3ZhbHVlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fSxcIiA9IFwiLHtcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwicHJvbW92YWx1ZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLV8yLF8zKVwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b3RhbF9hbW91bnRcIn0sXCJmXCI6W3tcInRcIjozLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwiYm9va2luZy5wcmljZVwiLFwiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX1dfV0sXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1wiaWRcIjpcIlRvdG9wXCIsXCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6XCJmbHVpZCBodWdlIHVpIGJsdWUgYnV0dG9uXCJ9LFwiZlwiOltcIkNPTlRJTlVFXCJdfV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuc3RlcHMuMVwiXSxcInNcIjpcIntzdGVwOl8wfVwifX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMS5odG1sXG4gKiogbW9kdWxlIGlkID0gMTMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyIGFsbENvdW50cmllcyA9IFtcclxuICAgIFtcclxuICAgICAgICBcIkluZGlhICjgpK3gpL7gpLDgpKQpXCIsXHJcbiAgICAgICAgXCJpblwiLFxyXG4gICAgICAgIFwiOTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFmZ2hhbmlzdGFuICjigKvYp9mB2LrYp9mG2LPYqtin2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJhZlwiLFxyXG4gICAgICAgIFwiOTNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFsYmFuaWEgKFNocWlww6tyaSlcIixcclxuICAgICAgICBcImFsXCIsXHJcbiAgICAgICAgXCIzNTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFsZ2VyaWEgKOKAq9in2YTYrNiy2KfYptix4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiZHpcIixcclxuICAgICAgICBcIjIxM1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQW1lcmljYW4gU2Ftb2FcIixcclxuICAgICAgICBcImFzXCIsXHJcbiAgICAgICAgXCIxNjg0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBbmRvcnJhXCIsXHJcbiAgICAgICAgXCJhZFwiLFxyXG4gICAgICAgIFwiMzc2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBbmdvbGFcIixcclxuICAgICAgICBcImFvXCIsXHJcbiAgICAgICAgXCIyNDRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFuZ3VpbGxhXCIsXHJcbiAgICAgICAgXCJhaVwiLFxyXG4gICAgICAgIFwiMTI2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQW50aWd1YSBhbmQgQmFyYnVkYVwiLFxyXG4gICAgICAgIFwiYWdcIixcclxuICAgICAgICBcIjEyNjhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkFyZ2VudGluYVwiLFxyXG4gICAgICAgIFwiYXJcIixcclxuICAgICAgICBcIjU0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBcm1lbmlhICjVgNWh1bXVodW91b/VodW2KVwiLFxyXG4gICAgICAgIFwiYW1cIixcclxuICAgICAgICBcIjM3NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQXJ1YmFcIixcclxuICAgICAgICBcImF3XCIsXHJcbiAgICAgICAgXCIyOTdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkF1c3RyYWxpYVwiLFxyXG4gICAgICAgIFwiYXVcIixcclxuICAgICAgICBcIjYxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJBdXN0cmlhICjDlnN0ZXJyZWljaClcIixcclxuICAgICAgICBcImF0XCIsXHJcbiAgICAgICAgXCI0M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQXplcmJhaWphbiAoQXrJmXJiYXljYW4pXCIsXHJcbiAgICAgICAgXCJhelwiLFxyXG4gICAgICAgIFwiOTk0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCYWhhbWFzXCIsXHJcbiAgICAgICAgXCJic1wiLFxyXG4gICAgICAgIFwiMTI0MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmFocmFpbiAo4oCr2KfZhNio2K3YsdmK2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJiaFwiLFxyXG4gICAgICAgIFwiOTczXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCYW5nbGFkZXNoICjgpqzgpr7gpoLgprLgpr7gpqbgp4fgprYpXCIsXHJcbiAgICAgICAgXCJiZFwiLFxyXG4gICAgICAgIFwiODgwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCYXJiYWRvc1wiLFxyXG4gICAgICAgIFwiYmJcIixcclxuICAgICAgICBcIjEyNDZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJlbGFydXMgKNCR0LXQu9Cw0YDRg9GB0YwpXCIsXHJcbiAgICAgICAgXCJieVwiLFxyXG4gICAgICAgIFwiMzc1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZWxnaXVtIChCZWxnacOrKVwiLFxyXG4gICAgICAgIFwiYmVcIixcclxuICAgICAgICBcIjMyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZWxpemVcIixcclxuICAgICAgICBcImJ6XCIsXHJcbiAgICAgICAgXCI1MDFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJlbmluIChCw6luaW4pXCIsXHJcbiAgICAgICAgXCJialwiLFxyXG4gICAgICAgIFwiMjI5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCZXJtdWRhXCIsXHJcbiAgICAgICAgXCJibVwiLFxyXG4gICAgICAgIFwiMTQ0MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQmh1dGFuICjgvaDgvZbgvrLgvbTgvYIpXCIsXHJcbiAgICAgICAgXCJidFwiLFxyXG4gICAgICAgIFwiOTc1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCb2xpdmlhXCIsXHJcbiAgICAgICAgXCJib1wiLFxyXG4gICAgICAgIFwiNTkxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCb3NuaWEgYW5kIEhlcnplZ292aW5hICjQkdC+0YHQvdCwINC4INCl0LXRgNGG0LXQs9C+0LLQuNC90LApXCIsXHJcbiAgICAgICAgXCJiYVwiLFxyXG4gICAgICAgIFwiMzg3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCb3Rzd2FuYVwiLFxyXG4gICAgICAgIFwiYndcIixcclxuICAgICAgICBcIjI2N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQnJhemlsIChCcmFzaWwpXCIsXHJcbiAgICAgICAgXCJiclwiLFxyXG4gICAgICAgIFwiNTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJyaXRpc2ggSW5kaWFuIE9jZWFuIFRlcnJpdG9yeVwiLFxyXG4gICAgICAgIFwiaW9cIixcclxuICAgICAgICBcIjI0NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQnJpdGlzaCBWaXJnaW4gSXNsYW5kc1wiLFxyXG4gICAgICAgIFwidmdcIixcclxuICAgICAgICBcIjEyODRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJydW5laVwiLFxyXG4gICAgICAgIFwiYm5cIixcclxuICAgICAgICBcIjY3M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQnVsZ2FyaWEgKNCR0YrQu9Cz0LDRgNC40Y8pXCIsXHJcbiAgICAgICAgXCJiZ1wiLFxyXG4gICAgICAgIFwiMzU5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJCdXJraW5hIEZhc29cIixcclxuICAgICAgICBcImJmXCIsXHJcbiAgICAgICAgXCIyMjZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkJ1cnVuZGkgKFVidXJ1bmRpKVwiLFxyXG4gICAgICAgIFwiYmlcIixcclxuICAgICAgICBcIjI1N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2FtYm9kaWEgKOGegOGemOGfkuGeluGeu+Geh+GetilcIixcclxuICAgICAgICBcImtoXCIsXHJcbiAgICAgICAgXCI4NTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNhbWVyb29uIChDYW1lcm91bilcIixcclxuICAgICAgICBcImNtXCIsXHJcbiAgICAgICAgXCIyMzdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNhbmFkYVwiLFxyXG4gICAgICAgIFwiY2FcIixcclxuICAgICAgICBcIjFcIixcclxuICAgICAgICAxLFxyXG4gICAgICAgIFtcIjIwNFwiLCBcIjIyNlwiLCBcIjIzNlwiLCBcIjI0OVwiLCBcIjI1MFwiLCBcIjI4OVwiLCBcIjMwNlwiLCBcIjM0M1wiLCBcIjM2NVwiLCBcIjM4N1wiLCBcIjQwM1wiLCBcIjQxNlwiLCBcIjQxOFwiLCBcIjQzMVwiLCBcIjQzN1wiLCBcIjQzOFwiLCBcIjQ1MFwiLCBcIjUwNlwiLCBcIjUxNFwiLCBcIjUxOVwiLCBcIjU0OFwiLCBcIjU3OVwiLCBcIjU4MVwiLCBcIjU4N1wiLCBcIjYwNFwiLCBcIjYxM1wiLCBcIjYzOVwiLCBcIjY0N1wiLCBcIjY3MlwiLCBcIjcwNVwiLCBcIjcwOVwiLCBcIjc0MlwiLCBcIjc3OFwiLCBcIjc4MFwiLCBcIjc4MlwiLCBcIjgwN1wiLCBcIjgxOVwiLCBcIjgyNVwiLCBcIjg2N1wiLCBcIjg3M1wiLCBcIjkwMlwiLCBcIjkwNVwiXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNhcGUgVmVyZGUgKEthYnUgVmVyZGkpXCIsXHJcbiAgICAgICAgXCJjdlwiLFxyXG4gICAgICAgIFwiMjM4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDYXJpYmJlYW4gTmV0aGVybGFuZHNcIixcclxuICAgICAgICBcImJxXCIsXHJcbiAgICAgICAgXCI1OTlcIixcclxuICAgICAgICAxXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2F5bWFuIElzbGFuZHNcIixcclxuICAgICAgICBcImt5XCIsXHJcbiAgICAgICAgXCIxMzQ1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDZW50cmFsIEFmcmljYW4gUmVwdWJsaWMgKFLDqXB1YmxpcXVlIGNlbnRyYWZyaWNhaW5lKVwiLFxyXG4gICAgICAgIFwiY2ZcIixcclxuICAgICAgICBcIjIzNlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ2hhZCAoVGNoYWQpXCIsXHJcbiAgICAgICAgXCJ0ZFwiLFxyXG4gICAgICAgIFwiMjM1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDaGlsZVwiLFxyXG4gICAgICAgIFwiY2xcIixcclxuICAgICAgICBcIjU2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDaGluYSAo5Lit5Zu9KVwiLFxyXG4gICAgICAgIFwiY25cIixcclxuICAgICAgICBcIjg2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb2xvbWJpYVwiLFxyXG4gICAgICAgIFwiY29cIixcclxuICAgICAgICBcIjU3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb21vcm9zICjigKvYrNiy2LEg2KfZhNmC2YXYseKArOKAjilcIixcclxuICAgICAgICBcImttXCIsXHJcbiAgICAgICAgXCIyNjlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNvbmdvIChEUkMpIChKYW1odXJpIHlhIEtpZGVtb2tyYXNpYSB5YSBLb25nbylcIixcclxuICAgICAgICBcImNkXCIsXHJcbiAgICAgICAgXCIyNDNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkNvbmdvIChSZXB1YmxpYykgKENvbmdvLUJyYXp6YXZpbGxlKVwiLFxyXG4gICAgICAgIFwiY2dcIixcclxuICAgICAgICBcIjI0MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ29vayBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJja1wiLFxyXG4gICAgICAgIFwiNjgyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDb3N0YSBSaWNhXCIsXHJcbiAgICAgICAgXCJjclwiLFxyXG4gICAgICAgIFwiNTA2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDw7R0ZSBk4oCZSXZvaXJlXCIsXHJcbiAgICAgICAgXCJjaVwiLFxyXG4gICAgICAgIFwiMjI1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDcm9hdGlhIChIcnZhdHNrYSlcIixcclxuICAgICAgICBcImhyXCIsXHJcbiAgICAgICAgXCIzODVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkN1YmFcIixcclxuICAgICAgICBcImN1XCIsXHJcbiAgICAgICAgXCI1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ3VyYcOnYW9cIixcclxuICAgICAgICBcImN3XCIsXHJcbiAgICAgICAgXCI1OTlcIixcclxuICAgICAgICAwXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiQ3lwcnVzICjOms+Nz4DPgc6/z4IpXCIsXHJcbiAgICAgICAgXCJjeVwiLFxyXG4gICAgICAgIFwiMzU3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJDemVjaCBSZXB1YmxpYyAoxIxlc2vDoSByZXB1Ymxpa2EpXCIsXHJcbiAgICAgICAgXCJjelwiLFxyXG4gICAgICAgIFwiNDIwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJEZW5tYXJrIChEYW5tYXJrKVwiLFxyXG4gICAgICAgIFwiZGtcIixcclxuICAgICAgICBcIjQ1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJEamlib3V0aVwiLFxyXG4gICAgICAgIFwiZGpcIixcclxuICAgICAgICBcIjI1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRG9taW5pY2FcIixcclxuICAgICAgICBcImRtXCIsXHJcbiAgICAgICAgXCIxNzY3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJEb21pbmljYW4gUmVwdWJsaWMgKFJlcMO6YmxpY2EgRG9taW5pY2FuYSlcIixcclxuICAgICAgICBcImRvXCIsXHJcbiAgICAgICAgXCIxXCIsXHJcbiAgICAgICAgMixcclxuICAgICAgICBbXCI4MDlcIiwgXCI4MjlcIiwgXCI4NDlcIl1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFY3VhZG9yXCIsXHJcbiAgICAgICAgXCJlY1wiLFxyXG4gICAgICAgIFwiNTkzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFZ3lwdCAo4oCr2YXYtdix4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiZWdcIixcclxuICAgICAgICBcIjIwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFbCBTYWx2YWRvclwiLFxyXG4gICAgICAgIFwic3ZcIixcclxuICAgICAgICBcIjUwM1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRXF1YXRvcmlhbCBHdWluZWEgKEd1aW5lYSBFY3VhdG9yaWFsKVwiLFxyXG4gICAgICAgIFwiZ3FcIixcclxuICAgICAgICBcIjI0MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRXJpdHJlYVwiLFxyXG4gICAgICAgIFwiZXJcIixcclxuICAgICAgICBcIjI5MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRXN0b25pYSAoRWVzdGkpXCIsXHJcbiAgICAgICAgXCJlZVwiLFxyXG4gICAgICAgIFwiMzcyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJFdGhpb3BpYVwiLFxyXG4gICAgICAgIFwiZXRcIixcclxuICAgICAgICBcIjI1MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRmFsa2xhbmQgSXNsYW5kcyAoSXNsYXMgTWFsdmluYXMpXCIsXHJcbiAgICAgICAgXCJma1wiLFxyXG4gICAgICAgIFwiNTAwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJGYXJvZSBJc2xhbmRzIChGw7hyb3lhcilcIixcclxuICAgICAgICBcImZvXCIsXHJcbiAgICAgICAgXCIyOThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZpamlcIixcclxuICAgICAgICBcImZqXCIsXHJcbiAgICAgICAgXCI2NzlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZpbmxhbmQgKFN1b21pKVwiLFxyXG4gICAgICAgIFwiZmlcIixcclxuICAgICAgICBcIjM1OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRnJhbmNlXCIsXHJcbiAgICAgICAgXCJmclwiLFxyXG4gICAgICAgIFwiMzNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkZyZW5jaCBHdWlhbmEgKEd1eWFuZSBmcmFuw6dhaXNlKVwiLFxyXG4gICAgICAgIFwiZ2ZcIixcclxuICAgICAgICBcIjU5NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiRnJlbmNoIFBvbHluZXNpYSAoUG9seW7DqXNpZSBmcmFuw6dhaXNlKVwiLFxyXG4gICAgICAgIFwicGZcIixcclxuICAgICAgICBcIjY4OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR2Fib25cIixcclxuICAgICAgICBcImdhXCIsXHJcbiAgICAgICAgXCIyNDFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdhbWJpYVwiLFxyXG4gICAgICAgIFwiZ21cIixcclxuICAgICAgICBcIjIyMFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR2VvcmdpYSAo4YOh4YOQ4YOl4YOQ4YOg4YOX4YOV4YOU4YOa4YOdKVwiLFxyXG4gICAgICAgIFwiZ2VcIixcclxuICAgICAgICBcIjk5NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR2VybWFueSAoRGV1dHNjaGxhbmQpXCIsXHJcbiAgICAgICAgXCJkZVwiLFxyXG4gICAgICAgIFwiNDlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdoYW5hIChHYWFuYSlcIixcclxuICAgICAgICBcImdoXCIsXHJcbiAgICAgICAgXCIyMzNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdpYnJhbHRhclwiLFxyXG4gICAgICAgIFwiZ2lcIixcclxuICAgICAgICBcIjM1MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiR3JlZWNlICjOlc67zrvOrM60zrEpXCIsXHJcbiAgICAgICAgXCJnclwiLFxyXG4gICAgICAgIFwiMzBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdyZWVubGFuZCAoS2FsYWFsbGl0IE51bmFhdClcIixcclxuICAgICAgICBcImdsXCIsXHJcbiAgICAgICAgXCIyOTlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkdyZW5hZGFcIixcclxuICAgICAgICBcImdkXCIsXHJcbiAgICAgICAgXCIxNDczXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdWFkZWxvdXBlXCIsXHJcbiAgICAgICAgXCJncFwiLFxyXG4gICAgICAgIFwiNTkwXCIsXHJcbiAgICAgICAgMFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkd1YW1cIixcclxuICAgICAgICBcImd1XCIsXHJcbiAgICAgICAgXCIxNjcxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdWF0ZW1hbGFcIixcclxuICAgICAgICBcImd0XCIsXHJcbiAgICAgICAgXCI1MDJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkd1aW5lYSAoR3VpbsOpZSlcIixcclxuICAgICAgICBcImduXCIsXHJcbiAgICAgICAgXCIyMjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkd1aW5lYS1CaXNzYXUgKEd1aW7DqSBCaXNzYXUpXCIsXHJcbiAgICAgICAgXCJnd1wiLFxyXG4gICAgICAgIFwiMjQ1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJHdXlhbmFcIixcclxuICAgICAgICBcImd5XCIsXHJcbiAgICAgICAgXCI1OTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkhhaXRpXCIsXHJcbiAgICAgICAgXCJodFwiLFxyXG4gICAgICAgIFwiNTA5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJIb25kdXJhc1wiLFxyXG4gICAgICAgIFwiaG5cIixcclxuICAgICAgICBcIjUwNFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSG9uZyBLb25nICjpppnmuK8pXCIsXHJcbiAgICAgICAgXCJoa1wiLFxyXG4gICAgICAgIFwiODUyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJIdW5nYXJ5IChNYWd5YXJvcnN6w6FnKVwiLFxyXG4gICAgICAgIFwiaHVcIixcclxuICAgICAgICBcIjM2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJJY2VsYW5kICjDjXNsYW5kKVwiLFxyXG4gICAgICAgIFwiaXNcIixcclxuICAgICAgICBcIjM1NFwiXHJcbiAgICBdLFxyXG4gICAgXHJcbiAgICBbXHJcbiAgICAgICAgXCJJbmRvbmVzaWFcIixcclxuICAgICAgICBcImlkXCIsXHJcbiAgICAgICAgXCI2MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXJhbiAo4oCr2KfbjNix2KfZhuKArOKAjilcIixcclxuICAgICAgICBcImlyXCIsXHJcbiAgICAgICAgXCI5OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXJhcSAo4oCr2KfZhNi52LHYp9mC4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiaXFcIixcclxuICAgICAgICBcIjk2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXJlbGFuZFwiLFxyXG4gICAgICAgIFwiaWVcIixcclxuICAgICAgICBcIjM1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXNyYWVsICjigKvXmdep16jXkNec4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiaWxcIixcclxuICAgICAgICBcIjk3MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSXRhbHkgKEl0YWxpYSlcIixcclxuICAgICAgICBcIml0XCIsXHJcbiAgICAgICAgXCIzOVwiLFxyXG4gICAgICAgIDBcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJKYW1haWNhXCIsXHJcbiAgICAgICAgXCJqbVwiLFxyXG4gICAgICAgIFwiMTg3NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSmFwYW4gKOaXpeacrClcIixcclxuICAgICAgICBcImpwXCIsXHJcbiAgICAgICAgXCI4MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiSm9yZGFuICjigKvYp9mE2KPYsdiv2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJqb1wiLFxyXG4gICAgICAgIFwiOTYyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJLYXpha2hzdGFuICjQmtCw0LfQsNGF0YHRgtCw0L0pXCIsXHJcbiAgICAgICAgXCJrelwiLFxyXG4gICAgICAgIFwiN1wiLFxyXG4gICAgICAgIDFcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJLZW55YVwiLFxyXG4gICAgICAgIFwia2VcIixcclxuICAgICAgICBcIjI1NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiS2lyaWJhdGlcIixcclxuICAgICAgICBcImtpXCIsXHJcbiAgICAgICAgXCI2ODZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIkt1d2FpdCAo4oCr2KfZhNmD2YjZitiq4oCs4oCOKVwiLFxyXG4gICAgICAgIFwia3dcIixcclxuICAgICAgICBcIjk2NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiS3lyZ3l6c3RhbiAo0JrRi9GA0LPRi9C30YHRgtCw0L0pXCIsXHJcbiAgICAgICAgXCJrZ1wiLFxyXG4gICAgICAgIFwiOTk2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMYW9zICjguqXgurLguqcpXCIsXHJcbiAgICAgICAgXCJsYVwiLFxyXG4gICAgICAgIFwiODU2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMYXR2aWEgKExhdHZpamEpXCIsXHJcbiAgICAgICAgXCJsdlwiLFxyXG4gICAgICAgIFwiMzcxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMZWJhbm9uICjigKvZhNio2YbYp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwibGJcIixcclxuICAgICAgICBcIjk2MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGVzb3Rob1wiLFxyXG4gICAgICAgIFwibHNcIixcclxuICAgICAgICBcIjI2NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGliZXJpYVwiLFxyXG4gICAgICAgIFwibHJcIixcclxuICAgICAgICBcIjIzMVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTGlieWEgKOKAq9mE2YrYqNmK2KfigKzigI4pXCIsXHJcbiAgICAgICAgXCJseVwiLFxyXG4gICAgICAgIFwiMjE4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMaWVjaHRlbnN0ZWluXCIsXHJcbiAgICAgICAgXCJsaVwiLFxyXG4gICAgICAgIFwiNDIzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMaXRodWFuaWEgKExpZXR1dmEpXCIsXHJcbiAgICAgICAgXCJsdFwiLFxyXG4gICAgICAgIFwiMzcwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJMdXhlbWJvdXJnXCIsXHJcbiAgICAgICAgXCJsdVwiLFxyXG4gICAgICAgIFwiMzUyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYWNhdSAo5r6z6ZaAKVwiLFxyXG4gICAgICAgIFwibW9cIixcclxuICAgICAgICBcIjg1M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFjZWRvbmlhIChGWVJPTSkgKNCc0LDQutC10LTQvtC90LjRmNCwKVwiLFxyXG4gICAgICAgIFwibWtcIixcclxuICAgICAgICBcIjM4OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFkYWdhc2NhciAoTWFkYWdhc2lrYXJhKVwiLFxyXG4gICAgICAgIFwibWdcIixcclxuICAgICAgICBcIjI2MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsYXdpXCIsXHJcbiAgICAgICAgXCJtd1wiLFxyXG4gICAgICAgIFwiMjY1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYWxheXNpYVwiLFxyXG4gICAgICAgIFwibXlcIixcclxuICAgICAgICBcIjYwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNYWxkaXZlc1wiLFxyXG4gICAgICAgIFwibXZcIixcclxuICAgICAgICBcIjk2MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsaVwiLFxyXG4gICAgICAgIFwibWxcIixcclxuICAgICAgICBcIjIyM1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTWFsdGFcIixcclxuICAgICAgICBcIm10XCIsXHJcbiAgICAgICAgXCIzNTZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hcnNoYWxsIElzbGFuZHNcIixcclxuICAgICAgICBcIm1oXCIsXHJcbiAgICAgICAgXCI2OTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hcnRpbmlxdWVcIixcclxuICAgICAgICBcIm1xXCIsXHJcbiAgICAgICAgXCI1OTZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hdXJpdGFuaWEgKOKAq9mF2YjYsdmK2KrYp9mG2YrYp+KArOKAjilcIixcclxuICAgICAgICBcIm1yXCIsXHJcbiAgICAgICAgXCIyMjJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1hdXJpdGl1cyAoTW9yaXMpXCIsXHJcbiAgICAgICAgXCJtdVwiLFxyXG4gICAgICAgIFwiMjMwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNZXhpY28gKE3DqXhpY28pXCIsXHJcbiAgICAgICAgXCJteFwiLFxyXG4gICAgICAgIFwiNTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1pY3JvbmVzaWFcIixcclxuICAgICAgICBcImZtXCIsXHJcbiAgICAgICAgXCI2OTFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vbGRvdmEgKFJlcHVibGljYSBNb2xkb3ZhKVwiLFxyXG4gICAgICAgIFwibWRcIixcclxuICAgICAgICBcIjM3M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTW9uYWNvXCIsXHJcbiAgICAgICAgXCJtY1wiLFxyXG4gICAgICAgIFwiMzc3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJNb25nb2xpYSAo0JzQvtC90LPQvtC7KVwiLFxyXG4gICAgICAgIFwibW5cIixcclxuICAgICAgICBcIjk3NlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTW9udGVuZWdybyAoQ3JuYSBHb3JhKVwiLFxyXG4gICAgICAgIFwibWVcIixcclxuICAgICAgICBcIjM4MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTW9udHNlcnJhdFwiLFxyXG4gICAgICAgIFwibXNcIixcclxuICAgICAgICBcIjE2NjRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vcm9jY28gKOKAq9in2YTZhdi62LHYqOKArOKAjilcIixcclxuICAgICAgICBcIm1hXCIsXHJcbiAgICAgICAgXCIyMTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk1vemFtYmlxdWUgKE1vw6dhbWJpcXVlKVwiLFxyXG4gICAgICAgIFwibXpcIixcclxuICAgICAgICBcIjI1OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTXlhbm1hciAoQnVybWEpICjhgJnhgLzhgJThgLrhgJnhgKwpXCIsXHJcbiAgICAgICAgXCJtbVwiLFxyXG4gICAgICAgIFwiOTVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5hbWliaWEgKE5hbWliacOrKVwiLFxyXG4gICAgICAgIFwibmFcIixcclxuICAgICAgICBcIjI2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmF1cnVcIixcclxuICAgICAgICBcIm5yXCIsXHJcbiAgICAgICAgXCI2NzRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5lcGFsICjgpKjgpYfgpKrgpL7gpLIpXCIsXHJcbiAgICAgICAgXCJucFwiLFxyXG4gICAgICAgIFwiOTc3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOZXRoZXJsYW5kcyAoTmVkZXJsYW5kKVwiLFxyXG4gICAgICAgIFwibmxcIixcclxuICAgICAgICBcIjMxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOZXcgQ2FsZWRvbmlhIChOb3V2ZWxsZS1DYWzDqWRvbmllKVwiLFxyXG4gICAgICAgIFwibmNcIixcclxuICAgICAgICBcIjY4N1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmV3IFplYWxhbmRcIixcclxuICAgICAgICBcIm56XCIsXHJcbiAgICAgICAgXCI2NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTmljYXJhZ3VhXCIsXHJcbiAgICAgICAgXCJuaVwiLFxyXG4gICAgICAgIFwiNTA1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOaWdlciAoTmlqYXIpXCIsXHJcbiAgICAgICAgXCJuZVwiLFxyXG4gICAgICAgIFwiMjI3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOaWdlcmlhXCIsXHJcbiAgICAgICAgXCJuZ1wiLFxyXG4gICAgICAgIFwiMjM0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOaXVlXCIsXHJcbiAgICAgICAgXCJudVwiLFxyXG4gICAgICAgIFwiNjgzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJOb3Jmb2xrIElzbGFuZFwiLFxyXG4gICAgICAgIFwibmZcIixcclxuICAgICAgICBcIjY3MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiTm9ydGggS29yZWEgKOyhsOyEoCDrr7zso7zso7zsnZgg7J2466+8IOqzte2ZlOq1rSlcIixcclxuICAgICAgICBcImtwXCIsXHJcbiAgICAgICAgXCI4NTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5vcnRoZXJuIE1hcmlhbmEgSXNsYW5kc1wiLFxyXG4gICAgICAgIFwibXBcIixcclxuICAgICAgICBcIjE2NzBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk5vcndheSAoTm9yZ2UpXCIsXHJcbiAgICAgICAgXCJub1wiLFxyXG4gICAgICAgIFwiNDdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIk9tYW4gKOKAq9i52Y/Zhdin2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJvbVwiLFxyXG4gICAgICAgIFwiOTY4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYWtpc3RhbiAo4oCr2b7Yp9qp2LPYqtin2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJwa1wiLFxyXG4gICAgICAgIFwiOTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhbGF1XCIsXHJcbiAgICAgICAgXCJwd1wiLFxyXG4gICAgICAgIFwiNjgwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQYWxlc3RpbmUgKOKAq9mB2YTYs9i32YrZhuKArOKAjilcIixcclxuICAgICAgICBcInBzXCIsXHJcbiAgICAgICAgXCI5NzBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhbmFtYSAoUGFuYW3DoSlcIixcclxuICAgICAgICBcInBhXCIsXHJcbiAgICAgICAgXCI1MDdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhcHVhIE5ldyBHdWluZWFcIixcclxuICAgICAgICBcInBnXCIsXHJcbiAgICAgICAgXCI2NzVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBhcmFndWF5XCIsXHJcbiAgICAgICAgXCJweVwiLFxyXG4gICAgICAgIFwiNTk1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQZXJ1IChQZXLDuilcIixcclxuICAgICAgICBcInBlXCIsXHJcbiAgICAgICAgXCI1MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUGhpbGlwcGluZXNcIixcclxuICAgICAgICBcInBoXCIsXHJcbiAgICAgICAgXCI2M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUG9sYW5kIChQb2xza2EpXCIsXHJcbiAgICAgICAgXCJwbFwiLFxyXG4gICAgICAgIFwiNDhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlBvcnR1Z2FsXCIsXHJcbiAgICAgICAgXCJwdFwiLFxyXG4gICAgICAgIFwiMzUxXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJQdWVydG8gUmljb1wiLFxyXG4gICAgICAgIFwicHJcIixcclxuICAgICAgICBcIjFcIixcclxuICAgICAgICAzLFxyXG4gICAgICAgIFtcIjc4N1wiLCBcIjkzOVwiXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlFhdGFyICjigKvZgti32LHigKzigI4pXCIsXHJcbiAgICAgICAgXCJxYVwiLFxyXG4gICAgICAgIFwiOTc0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJSw6l1bmlvbiAoTGEgUsOpdW5pb24pXCIsXHJcbiAgICAgICAgXCJyZVwiLFxyXG4gICAgICAgIFwiMjYyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJSb21hbmlhIChSb23Dom5pYSlcIixcclxuICAgICAgICBcInJvXCIsXHJcbiAgICAgICAgXCI0MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiUnVzc2lhICjQoNC+0YHRgdC40Y8pXCIsXHJcbiAgICAgICAgXCJydVwiLFxyXG4gICAgICAgIFwiN1wiLFxyXG4gICAgICAgIDBcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJSd2FuZGFcIixcclxuICAgICAgICBcInJ3XCIsXHJcbiAgICAgICAgXCIyNTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IEJhcnRow6lsZW15IChTYWludC1CYXJ0aMOpbGVteSlcIixcclxuICAgICAgICBcImJsXCIsXHJcbiAgICAgICAgXCI1OTBcIixcclxuICAgICAgICAxXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2FpbnQgSGVsZW5hXCIsXHJcbiAgICAgICAgXCJzaFwiLFxyXG4gICAgICAgIFwiMjkwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBLaXR0cyBhbmQgTmV2aXNcIixcclxuICAgICAgICBcImtuXCIsXHJcbiAgICAgICAgXCIxODY5XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTYWludCBMdWNpYVwiLFxyXG4gICAgICAgIFwibGNcIixcclxuICAgICAgICBcIjE3NThcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IE1hcnRpbiAoU2FpbnQtTWFydGluIChwYXJ0aWUgZnJhbsOnYWlzZSkpXCIsXHJcbiAgICAgICAgXCJtZlwiLFxyXG4gICAgICAgIFwiNTkwXCIsXHJcbiAgICAgICAgMlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IFBpZXJyZSBhbmQgTWlxdWVsb24gKFNhaW50LVBpZXJyZS1ldC1NaXF1ZWxvbilcIixcclxuICAgICAgICBcInBtXCIsXHJcbiAgICAgICAgXCI1MDhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhaW50IFZpbmNlbnQgYW5kIHRoZSBHcmVuYWRpbmVzXCIsXHJcbiAgICAgICAgXCJ2Y1wiLFxyXG4gICAgICAgIFwiMTc4NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2Ftb2FcIixcclxuICAgICAgICBcIndzXCIsXHJcbiAgICAgICAgXCI2ODVcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhbiBNYXJpbm9cIixcclxuICAgICAgICBcInNtXCIsXHJcbiAgICAgICAgXCIzNzhcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlPDo28gVG9tw6kgYW5kIFByw61uY2lwZSAoU8OjbyBUb23DqSBlIFByw61uY2lwZSlcIixcclxuICAgICAgICBcInN0XCIsXHJcbiAgICAgICAgXCIyMzlcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNhdWRpIEFyYWJpYSAo4oCr2KfZhNmF2YXZhNmD2Kkg2KfZhNi52LHYqNmK2Kkg2KfZhNiz2LnZiNiv2YrYqeKArOKAjilcIixcclxuICAgICAgICBcInNhXCIsXHJcbiAgICAgICAgXCI5NjZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNlbmVnYWwgKFPDqW7DqWdhbClcIixcclxuICAgICAgICBcInNuXCIsXHJcbiAgICAgICAgXCIyMjFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNlcmJpYSAo0KHRgNCx0LjRmNCwKVwiLFxyXG4gICAgICAgIFwicnNcIixcclxuICAgICAgICBcIjM4MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2V5Y2hlbGxlc1wiLFxyXG4gICAgICAgIFwic2NcIixcclxuICAgICAgICBcIjI0OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2llcnJhIExlb25lXCIsXHJcbiAgICAgICAgXCJzbFwiLFxyXG4gICAgICAgIFwiMjMyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTaW5nYXBvcmVcIixcclxuICAgICAgICBcInNnXCIsXHJcbiAgICAgICAgXCI2NVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2ludCBNYWFydGVuXCIsXHJcbiAgICAgICAgXCJzeFwiLFxyXG4gICAgICAgIFwiMTcyMVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU2xvdmFraWEgKFNsb3ZlbnNrbylcIixcclxuICAgICAgICBcInNrXCIsXHJcbiAgICAgICAgXCI0MjFcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNsb3ZlbmlhIChTbG92ZW5pamEpXCIsXHJcbiAgICAgICAgXCJzaVwiLFxyXG4gICAgICAgIFwiMzg2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTb2xvbW9uIElzbGFuZHNcIixcclxuICAgICAgICBcInNiXCIsXHJcbiAgICAgICAgXCI2NzdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNvbWFsaWEgKFNvb21hYWxpeWEpXCIsXHJcbiAgICAgICAgXCJzb1wiLFxyXG4gICAgICAgIFwiMjUyXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTb3V0aCBBZnJpY2FcIixcclxuICAgICAgICBcInphXCIsXHJcbiAgICAgICAgXCIyN1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU291dGggS29yZWEgKOuMgO2VnOuvvOq1rSlcIixcclxuICAgICAgICBcImtyXCIsXHJcbiAgICAgICAgXCI4MlwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU291dGggU3VkYW4gKOKAq9is2YbZiNioINin2YTYs9mI2K/Yp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwic3NcIixcclxuICAgICAgICBcIjIxMVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3BhaW4gKEVzcGHDsWEpXCIsXHJcbiAgICAgICAgXCJlc1wiLFxyXG4gICAgICAgIFwiMzRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlNyaSBMYW5rYSAo4LeB4LeK4oCN4La74LeTIOC2veC2guC2muC3j+C3gClcIixcclxuICAgICAgICBcImxrXCIsXHJcbiAgICAgICAgXCI5NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3VkYW4gKOKAq9in2YTYs9mI2K/Yp9mG4oCs4oCOKVwiLFxyXG4gICAgICAgIFwic2RcIixcclxuICAgICAgICBcIjI0OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3VyaW5hbWVcIixcclxuICAgICAgICBcInNyXCIsXHJcbiAgICAgICAgXCI1OTdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlN3YXppbGFuZFwiLFxyXG4gICAgICAgIFwic3pcIixcclxuICAgICAgICBcIjI2OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3dlZGVuIChTdmVyaWdlKVwiLFxyXG4gICAgICAgIFwic2VcIixcclxuICAgICAgICBcIjQ2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJTd2l0emVybGFuZCAoU2Nod2VpeilcIixcclxuICAgICAgICBcImNoXCIsXHJcbiAgICAgICAgXCI0MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiU3lyaWEgKOKAq9iz2YjYsdmK2KfigKzigI4pXCIsXHJcbiAgICAgICAgXCJzeVwiLFxyXG4gICAgICAgIFwiOTYzXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUYWl3YW4gKOWPsOeBoylcIixcclxuICAgICAgICBcInR3XCIsXHJcbiAgICAgICAgXCI4ODZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRhamlraXN0YW5cIixcclxuICAgICAgICBcInRqXCIsXHJcbiAgICAgICAgXCI5OTJcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRhbnphbmlhXCIsXHJcbiAgICAgICAgXCJ0elwiLFxyXG4gICAgICAgIFwiMjU1XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUaGFpbGFuZCAo4LmE4LiX4LiiKVwiLFxyXG4gICAgICAgIFwidGhcIixcclxuICAgICAgICBcIjY2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUaW1vci1MZXN0ZVwiLFxyXG4gICAgICAgIFwidGxcIixcclxuICAgICAgICBcIjY3MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVG9nb1wiLFxyXG4gICAgICAgIFwidGdcIixcclxuICAgICAgICBcIjIyOFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVG9rZWxhdVwiLFxyXG4gICAgICAgIFwidGtcIixcclxuICAgICAgICBcIjY5MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVG9uZ2FcIixcclxuICAgICAgICBcInRvXCIsXHJcbiAgICAgICAgXCI2NzZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlRyaW5pZGFkIGFuZCBUb2JhZ29cIixcclxuICAgICAgICBcInR0XCIsXHJcbiAgICAgICAgXCIxODY4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJUdW5pc2lhICjigKvYqtmI2YbYs+KArOKAjilcIixcclxuICAgICAgICBcInRuXCIsXHJcbiAgICAgICAgXCIyMTZcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlR1cmtleSAoVMO8cmtpeWUpXCIsXHJcbiAgICAgICAgXCJ0clwiLFxyXG4gICAgICAgIFwiOTBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlR1cmttZW5pc3RhblwiLFxyXG4gICAgICAgIFwidG1cIixcclxuICAgICAgICBcIjk5M1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVHVya3MgYW5kIENhaWNvcyBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJ0Y1wiLFxyXG4gICAgICAgIFwiMTY0OVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVHV2YWx1XCIsXHJcbiAgICAgICAgXCJ0dlwiLFxyXG4gICAgICAgIFwiNjg4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJVLlMuIFZpcmdpbiBJc2xhbmRzXCIsXHJcbiAgICAgICAgXCJ2aVwiLFxyXG4gICAgICAgIFwiMTM0MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVWdhbmRhXCIsXHJcbiAgICAgICAgXCJ1Z1wiLFxyXG4gICAgICAgIFwiMjU2XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJVa3JhaW5lICjQo9C60YDQsNGX0L3QsClcIixcclxuICAgICAgICBcInVhXCIsXHJcbiAgICAgICAgXCIzODBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlVuaXRlZCBBcmFiIEVtaXJhdGVzICjigKvYp9mE2KXZhdin2LHYp9iqINin2YTYudix2KjZitipINin2YTZhdiq2K3Yr9ip4oCs4oCOKVwiLFxyXG4gICAgICAgIFwiYWVcIixcclxuICAgICAgICBcIjk3MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVW5pdGVkIEtpbmdkb21cIixcclxuICAgICAgICBcImdiXCIsXHJcbiAgICAgICAgXCI0NFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVW5pdGVkIFN0YXRlc1wiLFxyXG4gICAgICAgIFwidXNcIixcclxuICAgICAgICBcIjFcIixcclxuICAgICAgICAwXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVXJ1Z3VheVwiLFxyXG4gICAgICAgIFwidXlcIixcclxuICAgICAgICBcIjU5OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVXpiZWtpc3RhbiAoT8q7emJla2lzdG9uKVwiLFxyXG4gICAgICAgIFwidXpcIixcclxuICAgICAgICBcIjk5OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVmFudWF0dVwiLFxyXG4gICAgICAgIFwidnVcIixcclxuICAgICAgICBcIjY3OFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiVmF0aWNhbiBDaXR5IChDaXR0w6AgZGVsIFZhdGljYW5vKVwiLFxyXG4gICAgICAgIFwidmFcIixcclxuICAgICAgICBcIjM5XCIsXHJcbiAgICAgICAgMVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlZlbmV6dWVsYVwiLFxyXG4gICAgICAgIFwidmVcIixcclxuICAgICAgICBcIjU4XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJWaWV0bmFtIChWaeG7h3QgTmFtKVwiLFxyXG4gICAgICAgIFwidm5cIixcclxuICAgICAgICBcIjg0XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJXYWxsaXMgYW5kIEZ1dHVuYVwiLFxyXG4gICAgICAgIFwid2ZcIixcclxuICAgICAgICBcIjY4MVwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFwiWWVtZW4gKOKAq9in2YTZitmF2YbigKzigI4pXCIsXHJcbiAgICAgICAgXCJ5ZVwiLFxyXG4gICAgICAgIFwiOTY3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgXCJaYW1iaWFcIixcclxuICAgICAgICBcInptXCIsXHJcbiAgICAgICAgXCIyNjBcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBcIlppbWJhYndlXCIsXHJcbiAgICAgICAgXCJ6d1wiLFxyXG4gICAgICAgIFwiMjYzXCJcclxuICAgIF1cclxuXTtcclxuXHJcbnZhciBvcHRpb25zID0gW107XHJcblxyXG4vLyBsb29wIG92ZXIgYWxsIG9mIHRoZSBjb3VudHJpZXMgYWJvdmVcclxuZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxDb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBjID0gYWxsQ291bnRyaWVzW2ldO1xyXG4gICAgb3B0aW9uc1tpXSA9IHtcclxuICAgICAgICBpZDogJysnICsgY1syXSxcclxuICAgICAgICB2YWx1ZTogJysnICsgY1syXSxcclxuICAgICAgICB0ZXh0OiBjWzBdICsgJyA8c3BhbiBjbGFzcz1cInNtYWxsXCI+KycgKyBjWzJdICsgJzwvc3Bhbj4nLFxyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50LmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiBNT0JJTEUgPyAnPGRpdiBjbGFzcz1cInNlbGVjdFwiPjwvZGl2PicgOiByZXF1aXJlKCd0ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL3NlbGVjdC5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKE1PQklMRSkge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMuZmluZCgnLnNlbGVjdCcpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGRlYm91bmNlLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQgPSBvcHRpb25zLnNsaWNlKCksXHJcbiAgICAgICAgICAgICAgICBxdWVyeSA9ICcnLFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDtcclxuXHJcbiAgICAgICAgICAgIGVsLm1vYmlzY3JvbGwoKS5zZWxlY3Qoe1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW10sXHJcbiAgICAgICAgICAgICAgICB0aGVtZTogJ21vYmlzY3JvbGwnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ3RvcCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6ICcrOTEnLFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0OiAnbGlxdWlkJyxcclxuICAgICAgICAgICAgICAgIHNob3dMYWJlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgcm93czogMyxcclxuICAgICAgICAgICAgICAgIG9uTWFya3VwUmVhZHk6IGZ1bmN0aW9uIChtYXJrdXAsIGluc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCc8ZGl2IHN0eWxlPVwicGFkZGluZzouNWVtXCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJtZC1maWx0ZXItaW5wdXRcIiB2YWx1ZT1cIis5MVwiIHRhYmluZGV4PVwiMFwiIHBsYWNlaG9sZGVyPVwiQ291bnRyeSBjb2RlXCIgLz48L2Rpdj4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucHJlcGVuZFRvKCQoJy5kd2NjJywgbWFya3VwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhhdCA9ICQoJ2lucHV0JywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZGVib3VuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVib3VuY2UgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IHRoYXQudmFsKCkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSAkLmdyZXAob3B0aW9ucywgZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLmlkLmluZGV4T2YocXVlcnkpID4gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MuZGF0YSA9IGZpbHRlcmVkLmxlbmd0aCA/IGZpbHRlcmVkIDogW3t0ZXh0OiAnTm8gcmVzdWx0cycsIHZhbHVlOiAnJ31dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MucGFyc2VWYWx1ZShpbnN0LnNldHRpbmdzLmRhdGFbMF0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3QucmVmcmVzaCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25CZWZvcmVTaG93OiBmdW5jdGlvbiAoaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3Quc2V0dGluZ3MuZGF0YSA9IG9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uICh2LCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSAkKCc8c3Bhbj4nICsgdiArICc8L3NwYW4+JykuZmluZCgnLnNtYWxsJykudGV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgndmFsdWUnLCBjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcubWJzYy1jb250cm9sJywgdmlldy5lbCkudmFsKGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLm1ic2MtY29udHJvbCcsIHZpZXcuZWwpLnZhbCh2KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5tYnNjLWNvbnRyb2wnLCB2aWV3LmVsKS52YWwodmlldy5nZXQoJ3ZhbHVlJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMuZmluZCgnLnVpLmRyb3Bkb3duJykpXHJcbiAgICAgICAgICAgICAgICAgICAgLmRyb3Bkb3duKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFRleHRTZWFyY2g6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kcm9wZG93bignaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd2YWx1ZScsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZSgndmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5kZWxheShmdW5jdGlvbigpIHsgaWYgKHZpZXcuZ2V0KCdlcnJvcicpKSB2aWV3LnNldCgnZXJyb3InLCBmYWxzZSkgfSwgNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXQoJ29wdGlvbnMnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IF8uZmluZChvcHRpb25zLCB7aWQ6IHZhbHVlfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuZHJvcGRvd24oJ3NldCB2YWx1ZScsIG8uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuZHJvcGRvd24oJ3NldCB0ZXh0Jywgby5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbC5kcm9wZG93bigncmVzdG9yZSBkZWZhdWx0cycpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZmluZCgnLnNlYXJjaCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmluZCgnLnNlYXJjaCcpKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGUud2hpY2ggPT0gMTMgKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy5zZXQoJ29wdGlvbnMnLCBudWxsKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9jb2RlLmpzXG4gKiogbW9kdWxlIGlkID0gMTMzXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbWFpbGNoZWNrID0gcmVxdWlyZSgnbWFpbGNoZWNrJyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiAnZW1haWwnXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKVxyXG4gICAgICAgICAgICAub24oJ2JsdXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykubWFpbGNoZWNrKHtcclxuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0ZWQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHN1Z2dlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Z2dlc3Rpb24nLCBzdWdnZXN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWdnZXN0aW9uJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb3JyZWN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNldCgndmFsdWUnLCB0aGlzLmdldCgnc3VnZ2VzdGlvbi5mdWxsJykpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWdnZXN0aW9uJywgbnVsbCk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vZW1haWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxMzRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA0IDVcbiAqKi8iLCIvKlxuICogTWFpbGNoZWNrIGh0dHBzOi8vZ2l0aHViLmNvbS9tYWlsY2hlY2svbWFpbGNoZWNrXG4gKiBBdXRob3JcbiAqIERlcnJpY2sgS28gKEBkZXJyaWNra28pXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICpcbiAqIHYgMS4xLjFcbiAqL1xuXG52YXIgTWFpbGNoZWNrID0ge1xuICBkb21haW5UaHJlc2hvbGQ6IDIsXG4gIHNlY29uZExldmVsVGhyZXNob2xkOiAyLFxuICB0b3BMZXZlbFRocmVzaG9sZDogMixcblxuICBkZWZhdWx0RG9tYWluczogWydtc24uY29tJywgJ2JlbGxzb3V0aC5uZXQnLFxuICAgICd0ZWx1cy5uZXQnLCAnY29tY2FzdC5uZXQnLCAnb3B0dXNuZXQuY29tLmF1JyxcbiAgICAnZWFydGhsaW5rLm5ldCcsICdxcS5jb20nLCAnc2t5LmNvbScsICdpY2xvdWQuY29tJyxcbiAgICAnbWFjLmNvbScsICdzeW1wYXRpY28uY2EnLCAnZ29vZ2xlbWFpbC5jb20nLFxuICAgICdhdHQubmV0JywgJ3h0cmEuY28ubnonLCAnd2ViLmRlJyxcbiAgICAnY294Lm5ldCcsICdnbWFpbC5jb20nLCAneW1haWwuY29tJyxcbiAgICAnYWltLmNvbScsICdyb2dlcnMuY29tJywgJ3Zlcml6b24ubmV0JyxcbiAgICAncm9ja2V0bWFpbC5jb20nLCAnZ29vZ2xlLmNvbScsICdvcHRvbmxpbmUubmV0JyxcbiAgICAnc2JjZ2xvYmFsLm5ldCcsICdhb2wuY29tJywgJ21lLmNvbScsICdidGludGVybmV0LmNvbScsXG4gICAgJ2NoYXJ0ZXIubmV0JywgJ3NoYXcuY2EnXSxcblxuICBkZWZhdWx0U2Vjb25kTGV2ZWxEb21haW5zOiBbXCJ5YWhvb1wiLCBcImhvdG1haWxcIiwgXCJtYWlsXCIsIFwibGl2ZVwiLCBcIm91dGxvb2tcIiwgXCJnbXhcIl0sXG5cbiAgZGVmYXVsdFRvcExldmVsRG9tYWluczogW1wiY29tXCIsIFwiY29tLmF1XCIsIFwiY29tLnR3XCIsIFwiY2FcIiwgXCJjby5uelwiLCBcImNvLnVrXCIsIFwiZGVcIixcbiAgICBcImZyXCIsIFwiaXRcIiwgXCJydVwiLCBcIm5ldFwiLCBcIm9yZ1wiLCBcImVkdVwiLCBcImdvdlwiLCBcImpwXCIsIFwibmxcIiwgXCJrclwiLCBcInNlXCIsIFwiZXVcIixcbiAgICBcImllXCIsIFwiY28uaWxcIiwgXCJ1c1wiLCBcImF0XCIsIFwiYmVcIiwgXCJka1wiLCBcImhrXCIsIFwiZXNcIiwgXCJnclwiLCBcImNoXCIsIFwibm9cIiwgXCJjelwiLFxuICAgIFwiaW5cIiwgXCJuZXRcIiwgXCJuZXQuYXVcIiwgXCJpbmZvXCIsIFwiYml6XCIsIFwibWlsXCIsIFwiY28uanBcIiwgXCJzZ1wiLCBcImh1XCJdLFxuXG4gIHJ1bjogZnVuY3Rpb24ob3B0cykge1xuICAgIG9wdHMuZG9tYWlucyA9IG9wdHMuZG9tYWlucyB8fCBNYWlsY2hlY2suZGVmYXVsdERvbWFpbnM7XG4gICAgb3B0cy5zZWNvbmRMZXZlbERvbWFpbnMgPSBvcHRzLnNlY29uZExldmVsRG9tYWlucyB8fCBNYWlsY2hlY2suZGVmYXVsdFNlY29uZExldmVsRG9tYWlucztcbiAgICBvcHRzLnRvcExldmVsRG9tYWlucyA9IG9wdHMudG9wTGV2ZWxEb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0VG9wTGV2ZWxEb21haW5zO1xuICAgIG9wdHMuZGlzdGFuY2VGdW5jdGlvbiA9IG9wdHMuZGlzdGFuY2VGdW5jdGlvbiB8fCBNYWlsY2hlY2suc2lmdDNEaXN0YW5jZTtcblxuICAgIHZhciBkZWZhdWx0Q2FsbGJhY2sgPSBmdW5jdGlvbihyZXN1bHQpeyByZXR1cm4gcmVzdWx0IH07XG4gICAgdmFyIHN1Z2dlc3RlZENhbGxiYWNrID0gb3B0cy5zdWdnZXN0ZWQgfHwgZGVmYXVsdENhbGxiYWNrO1xuICAgIHZhciBlbXB0eUNhbGxiYWNrID0gb3B0cy5lbXB0eSB8fCBkZWZhdWx0Q2FsbGJhY2s7XG5cbiAgICB2YXIgcmVzdWx0ID0gTWFpbGNoZWNrLnN1Z2dlc3QoTWFpbGNoZWNrLmVuY29kZUVtYWlsKG9wdHMuZW1haWwpLCBvcHRzLmRvbWFpbnMsIG9wdHMuc2Vjb25kTGV2ZWxEb21haW5zLCBvcHRzLnRvcExldmVsRG9tYWlucywgb3B0cy5kaXN0YW5jZUZ1bmN0aW9uKTtcblxuICAgIHJldHVybiByZXN1bHQgPyBzdWdnZXN0ZWRDYWxsYmFjayhyZXN1bHQpIDogZW1wdHlDYWxsYmFjaygpXG4gIH0sXG5cbiAgc3VnZ2VzdDogZnVuY3Rpb24oZW1haWwsIGRvbWFpbnMsIHNlY29uZExldmVsRG9tYWlucywgdG9wTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uKSB7XG4gICAgZW1haWwgPSBlbWFpbC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdmFyIGVtYWlsUGFydHMgPSB0aGlzLnNwbGl0RW1haWwoZW1haWwpO1xuXG4gICAgaWYgKHNlY29uZExldmVsRG9tYWlucyAmJiB0b3BMZXZlbERvbWFpbnMpIHtcbiAgICAgICAgLy8gSWYgdGhlIGVtYWlsIGlzIGEgdmFsaWQgMm5kLWxldmVsICsgdG9wLWxldmVsLCBkbyBub3Qgc3VnZ2VzdCBhbnl0aGluZy5cbiAgICAgICAgaWYgKHNlY29uZExldmVsRG9tYWlucy5pbmRleE9mKGVtYWlsUGFydHMuc2Vjb25kTGV2ZWxEb21haW4pICE9PSAtMSAmJiB0b3BMZXZlbERvbWFpbnMuaW5kZXhPZihlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjbG9zZXN0RG9tYWluID0gdGhpcy5maW5kQ2xvc2VzdERvbWFpbihlbWFpbFBhcnRzLmRvbWFpbiwgZG9tYWlucywgZGlzdGFuY2VGdW5jdGlvbiwgdGhpcy5kb21haW5UaHJlc2hvbGQpO1xuXG4gICAgaWYgKGNsb3Nlc3REb21haW4pIHtcbiAgICAgIGlmIChjbG9zZXN0RG9tYWluID09IGVtYWlsUGFydHMuZG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGV4YWN0bHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnM7IGRvIG5vdCByZXR1cm4gYSBzdWdnZXN0aW9uLlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBjbG9zZWx5IG1hdGNoZXMgb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zOyByZXR1cm4gYSBzdWdnZXN0aW9uXG4gICAgICAgIHJldHVybiB7IGFkZHJlc3M6IGVtYWlsUGFydHMuYWRkcmVzcywgZG9tYWluOiBjbG9zZXN0RG9tYWluLCBmdWxsOiBlbWFpbFBhcnRzLmFkZHJlc3MgKyBcIkBcIiArIGNsb3Nlc3REb21haW4gfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBkb2VzIG5vdCBjbG9zZWx5IG1hdGNoIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWluc1xuICAgIHZhciBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4gPSB0aGlzLmZpbmRDbG9zZXN0RG9tYWluKGVtYWlsUGFydHMuc2Vjb25kTGV2ZWxEb21haW4sIHNlY29uZExldmVsRG9tYWlucywgZGlzdGFuY2VGdW5jdGlvbiwgdGhpcy5zZWNvbmRMZXZlbFRocmVzaG9sZCk7XG4gICAgdmFyIGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAgICA9IHRoaXMuZmluZENsb3Nlc3REb21haW4oZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbiwgdG9wTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLnRvcExldmVsVGhyZXNob2xkKTtcblxuICAgIGlmIChlbWFpbFBhcnRzLmRvbWFpbikge1xuICAgICAgdmFyIGNsb3Nlc3REb21haW4gPSBlbWFpbFBhcnRzLmRvbWFpbjtcbiAgICAgIHZhciBydHJuID0gZmFsc2U7XG5cbiAgICAgIGlmKGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiAmJiBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4gIT0gZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbikge1xuICAgICAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBtYXkgaGF2ZSBhIG1pc3BlbGxlZCBzZWNvbmQtbGV2ZWwgZG9tYWluOyByZXR1cm4gYSBzdWdnZXN0aW9uXG4gICAgICAgIGNsb3Nlc3REb21haW4gPSBjbG9zZXN0RG9tYWluLnJlcGxhY2UoZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbiwgY2xvc2VzdFNlY29uZExldmVsRG9tYWluKTtcbiAgICAgICAgcnRybiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmKGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAmJiBjbG9zZXN0VG9wTGV2ZWxEb21haW4gIT0gZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbikge1xuICAgICAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBtYXkgaGF2ZSBhIG1pc3BlbGxlZCB0b3AtbGV2ZWwgZG9tYWluOyByZXR1cm4gYSBzdWdnZXN0aW9uXG4gICAgICAgIGNsb3Nlc3REb21haW4gPSBjbG9zZXN0RG9tYWluLnJlcGxhY2UoZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbiwgY2xvc2VzdFRvcExldmVsRG9tYWluKTtcbiAgICAgICAgcnRybiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChydHJuID09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHsgYWRkcmVzczogZW1haWxQYXJ0cy5hZGRyZXNzLCBkb21haW46IGNsb3Nlc3REb21haW4sIGZ1bGw6IGVtYWlsUGFydHMuYWRkcmVzcyArIFwiQFwiICsgY2xvc2VzdERvbWFpbiB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIFRoZSBlbWFpbCBhZGRyZXNzIGV4YWN0bHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnMsIGRvZXMgbm90IGNsb3NlbHlcbiAgICAgKiBtYXRjaCBhbnkgZG9tYWluIGFuZCBkb2VzIG5vdCBhcHBlYXIgdG8gc2ltcGx5IGhhdmUgYSBtaXNwZWxsZWQgdG9wLWxldmVsIGRvbWFpbixcbiAgICAgKiBvciBpcyBhbiBpbnZhbGlkIGVtYWlsIGFkZHJlc3M7IGRvIG5vdCByZXR1cm4gYSBzdWdnZXN0aW9uLlxuICAgICAqL1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBmaW5kQ2xvc2VzdERvbWFpbjogZnVuY3Rpb24oZG9tYWluLCBkb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aHJlc2hvbGQpIHtcbiAgICB0aHJlc2hvbGQgPSB0aHJlc2hvbGQgfHwgdGhpcy50b3BMZXZlbFRocmVzaG9sZDtcbiAgICB2YXIgZGlzdDtcbiAgICB2YXIgbWluRGlzdCA9IDk5O1xuICAgIHZhciBjbG9zZXN0RG9tYWluID0gbnVsbDtcblxuICAgIGlmICghZG9tYWluIHx8ICFkb21haW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKCFkaXN0YW5jZUZ1bmN0aW9uKSB7XG4gICAgICBkaXN0YW5jZUZ1bmN0aW9uID0gdGhpcy5zaWZ0M0Rpc3RhbmNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9tYWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRvbWFpbiA9PT0gZG9tYWluc1tpXSkge1xuICAgICAgICByZXR1cm4gZG9tYWluO1xuICAgICAgfVxuICAgICAgZGlzdCA9IGRpc3RhbmNlRnVuY3Rpb24oZG9tYWluLCBkb21haW5zW2ldKTtcbiAgICAgIGlmIChkaXN0IDwgbWluRGlzdCkge1xuICAgICAgICBtaW5EaXN0ID0gZGlzdDtcbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGRvbWFpbnNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1pbkRpc3QgPD0gdGhyZXNob2xkICYmIGNsb3Nlc3REb21haW4gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBjbG9zZXN0RG9tYWluO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIHNpZnQzRGlzdGFuY2U6IGZ1bmN0aW9uKHMxLCBzMikge1xuICAgIC8vIHNpZnQzOiBodHRwOi8vc2lkZXJpdGUuYmxvZ3Nwb3QuY29tLzIwMDcvMDQvc3VwZXItZmFzdC1hbmQtYWNjdXJhdGUtc3RyaW5nLWRpc3RhbmNlLmh0bWxcbiAgICBpZiAoczEgPT0gbnVsbCB8fCBzMS5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChzMiA9PSBudWxsIHx8IHMyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzMi5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHMyID09IG51bGwgfHwgczIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gczEubGVuZ3RoO1xuICAgIH1cblxuICAgIHZhciBjID0gMDtcbiAgICB2YXIgb2Zmc2V0MSA9IDA7XG4gICAgdmFyIG9mZnNldDIgPSAwO1xuICAgIHZhciBsY3MgPSAwO1xuICAgIHZhciBtYXhPZmZzZXQgPSA1O1xuXG4gICAgd2hpbGUgKChjICsgb2Zmc2V0MSA8IHMxLmxlbmd0aCkgJiYgKGMgKyBvZmZzZXQyIDwgczIubGVuZ3RoKSkge1xuICAgICAgaWYgKHMxLmNoYXJBdChjICsgb2Zmc2V0MSkgPT0gczIuY2hhckF0KGMgKyBvZmZzZXQyKSkge1xuICAgICAgICBsY3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZnNldDEgPSAwO1xuICAgICAgICBvZmZzZXQyID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhPZmZzZXQ7IGkrKykge1xuICAgICAgICAgIGlmICgoYyArIGkgPCBzMS5sZW5ndGgpICYmIChzMS5jaGFyQXQoYyArIGkpID09IHMyLmNoYXJBdChjKSkpIHtcbiAgICAgICAgICAgIG9mZnNldDEgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoYyArIGkgPCBzMi5sZW5ndGgpICYmIChzMS5jaGFyQXQoYykgPT0gczIuY2hhckF0KGMgKyBpKSkpIHtcbiAgICAgICAgICAgIG9mZnNldDIgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjKys7XG4gICAgfVxuICAgIHJldHVybiAoczEubGVuZ3RoICsgczIubGVuZ3RoKSAvMiAtIGxjcztcbiAgfSxcblxuICBzcGxpdEVtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgIHZhciBwYXJ0cyA9IGVtYWlsLnRyaW0oKS5zcGxpdCgnQCcpO1xuXG4gICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocGFydHNbaV0gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZG9tYWluID0gcGFydHMucG9wKCk7XG4gICAgdmFyIGRvbWFpblBhcnRzID0gZG9tYWluLnNwbGl0KCcuJyk7XG4gICAgdmFyIHNsZCA9ICcnO1xuICAgIHZhciB0bGQgPSAnJztcblxuICAgIGlmIChkb21haW5QYXJ0cy5sZW5ndGggPT0gMCkge1xuICAgICAgLy8gVGhlIGFkZHJlc3MgZG9lcyBub3QgaGF2ZSBhIHRvcC1sZXZlbCBkb21haW5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRvbWFpblBhcnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBoYXMgb25seSBhIHRvcC1sZXZlbCBkb21haW4gKHZhbGlkIHVuZGVyIFJGQylcbiAgICAgIHRsZCA9IGRvbWFpblBhcnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBoYXMgYSBkb21haW4gYW5kIGEgdG9wLWxldmVsIGRvbWFpblxuICAgICAgc2xkID0gZG9tYWluUGFydHNbMF07XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGRvbWFpblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRsZCArPSBkb21haW5QYXJ0c1tpXSArICcuJztcbiAgICAgIH1cbiAgICAgIHRsZCA9IHRsZC5zdWJzdHJpbmcoMCwgdGxkLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b3BMZXZlbERvbWFpbjogdGxkLFxuICAgICAgc2Vjb25kTGV2ZWxEb21haW46IHNsZCxcbiAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgYWRkcmVzczogcGFydHMuam9pbignQCcpXG4gICAgfVxuICB9LFxuXG4gIC8vIEVuY29kZSB0aGUgZW1haWwgYWRkcmVzcyB0byBwcmV2ZW50IFhTUyBidXQgbGVhdmUgaW4gdmFsaWRcbiAgLy8gY2hhcmFjdGVycywgZm9sbG93aW5nIHRoaXMgb2ZmaWNpYWwgc3BlYzpcbiAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FbWFpbF9hZGRyZXNzI1N5bnRheFxuICBlbmNvZGVFbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW5jb2RlVVJJKGVtYWlsKTtcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnJTIwJywgJyAnKS5yZXBsYWNlKCclMjUnLCAnJScpLnJlcGxhY2UoJyU1RScsICdeJylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJTYwJywgJ2AnKS5yZXBsYWNlKCclN0InLCAneycpLnJlcGxhY2UoJyU3QycsICd8JylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJTdEJywgJ30nKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuXG4vLyBFeHBvcnQgdGhlIG1haWxjaGVjayBvYmplY3QgaWYgd2UncmUgaW4gYSBDb21tb25KUyBlbnYgKGUuZy4gTm9kZSkuXG4vLyBNb2RlbGVkIG9mZiBvZiBVbmRlcnNjb3JlLmpzLlxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWlsY2hlY2s7XG59XG5cbi8vIFN1cHBvcnQgQU1EIHN0eWxlIGRlZmluaXRpb25zXG4vLyBCYXNlZCBvbiBqUXVlcnkgKHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNzk1NDg4Mi8xMzIyNDEwKVxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShcIm1haWxjaGVja1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1haWxjaGVjaztcbiAgfSk7XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cualF1ZXJ5KSB7XG4gIChmdW5jdGlvbigkKXtcbiAgICAkLmZuLm1haWxjaGVjayA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmIChvcHRzLnN1Z2dlc3RlZCkge1xuICAgICAgICB2YXIgb2xkU3VnZ2VzdGVkID0gb3B0cy5zdWdnZXN0ZWQ7XG4gICAgICAgIG9wdHMuc3VnZ2VzdGVkID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgb2xkU3VnZ2VzdGVkKHNlbGYsIHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmVtcHR5KSB7XG4gICAgICAgIHZhciBvbGRFbXB0eSA9IG9wdHMuZW1wdHk7XG4gICAgICAgIG9wdHMuZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBvbGRFbXB0eS5jYWxsKG51bGwsIHNlbGYpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcHRzLmVtYWlsID0gdGhpcy52YWwoKTtcbiAgICAgIE1haWxjaGVjay5ydW4ob3B0cyk7XG4gICAgfVxuICB9KShqUXVlcnkpO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3ZlbmRvci9tYWlsY2hlY2svc3JjL21haWxjaGVjay5qc1xuICoqIG1vZHVsZSBpZCA9IDEzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyk7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMi5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgIHBhc3NlbmdlcjogcmVxdWlyZSgnY29tcG9uZW50cy9wYXNzZW5nZXInKVxyXG4gICAgfSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBxYTogd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdxYScpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ2Jvb2tpbmcuc3RlcHMuMi5hY3RpdmUnLCBmdW5jdGlvbihhY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Njcm9sbCB0byB0b3AnKTtcclxuICAgICAgICBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy90cmF2ZWxlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgYm9va2luZ19pZDogdGhpcy5nZXQoJ2Jvb2tpbmcuaWQnKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dvdCB0cmF2ZWxlcnMnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd0cmF2ZWxlcnMnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHN1Ym1pdDogZnVuY3Rpb24oKSB7IHRoaXMuZ2V0KCdib29raW5nJykuc3RlcDIoKSB9LFxyXG5cclxuICAgIGNoZWNrQXZhaWxhYmlsaXR5OiBmdW5jdGlvbigpIHsgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5zdGVwMih7Y2hlY2s6IHRydWV9KSB9LFxyXG5cclxuICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpIHsgaWYgKCF0aGlzLmdldCgnYm9va2luZy5wYXltZW50LnBheW1lbnRfaWQnKSkgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5hY3RpdmF0ZSgyKTsgfSxcclxuXHJcbiAgICBiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmdldCgnYm9va2luZycpLmFjdGl2YXRlKDEpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxufSk7XHJcblxyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuanNcbiAqKiBtb2R1bGUgaWQgPSAxMzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic2VjdGlvblwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aXRsZV9zdHJpcGVcIn0sXCJmXCI6W1wiUGFzc2VuZ2VyIERldGFpbHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBodWdlIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuZXJyb3JzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLnN1Ym1pdHRpbmdcIn1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3Nlbmdlci1oZWFkZXIgaGVhZGVyIENvdW50U3RyaXBcIn0sXCJmXCI6W3tcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJtZXRhLnRyYXZlbGVyVHlwZXNcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwidHlwZV9pZFwifV19fSxcIihcIix7XCJ0XCI6MixcInJcIjpcIm5vXCJ9LFwiKVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwYXNzZW5nZXJcIixcImFcIjp7XCJjbGFzc1wiOlwiYmFzaWNcIixcInZhbGlkYXRpb25cIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nLnBhc3NlbmdlclZhbGlkYXRvblwifV0sXCJ0cmF2ZWxlcnNcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlcnNcIn1dLFwicGFzc2VuZ2VyXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV0sXCJlcnJvcnNcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcInN0ZXAuZXJyb3JzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImlcIn1dfX1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZy5wYXNzZW5nZXJzXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcImJ0bl9wYXNzZW5nZXJcIixcImNsYXNzXCI6XCJmbHVpZCBodWdlIHVpIGJsdWUgYnV0dG9uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJDb250aW51ZVwiXX1dfV19XX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5hY3RpdmVcIn1dLFwieFwiOntcInJcIjpbXCJib29raW5nLnN0ZXBzLjJcIl0sXCJzXCI6XCJ7c3RlcDpfMH1cIn19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDIuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDEzN1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuIFxyXG4gICAgO1xyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL3Bhc3Nlbmdlci5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgbW9iaWxlc2VsZWN0OiByZXF1aXJlKCdjb3JlL2Zvcm0vbW9iaWxlc2VsZWN0JyksXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIF86IF8sXHJcbiAgICAgICAgICAgIGRhdGVzdXBwb3J0ZWQ6dHJ1ZSxcclxuICAgICAgICAgICAgYWxsOiBmYWxzZSxcclxuICAgICAgICAgICAgZGF0ZTogcmVxdWlyZSgnaGVscGVycy9kYXRlJykoKSxcclxuXHJcbiAgICAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24odGVybSwgdHJhdmVsZXJzKSB7XHJcbiAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKCdzZWFyY2gnLCBhcmd1bWVudHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRlcm0gPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVybSAmJiB0cmF2ZWxlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIodHJhdmVsZXJzLCBmdW5jdGlvbihpKSB7IHJldHVybiAtMSAhPT0gKGkuZmlyc3RuYW1lICsgJyAnICsgaS5sYXN0bmFtZSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0pOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYXZlbGVycyA/IHRyYXZlbGVycy5zbGljZSgwLCA0KSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAhZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIGEoZSx0KXtyZXR1cm4gdHlwZW9mIGU9PT10fWZ1bmN0aW9uIHMoZSl7dmFyIHQ9ci5jbGFzc05hbWUsbj1Nb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeHx8XCJcIjtpZihjJiYodD10LmJhc2VWYWwpLE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUpTQ2xhc3Mpe3ZhciBhPW5ldyBSZWdFeHAoXCIoXnxcXFxccylcIituK1wibm8tanMoXFxcXHN8JClcIik7dD10LnJlcGxhY2UoYSxcIiQxXCIrbitcImpzJDJcIil9TW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3NlcyYmKHQrPVwiIFwiK24rZS5qb2luKFwiIFwiK24pLGM/ci5jbGFzc05hbWUuYmFzZVZhbD10OnIuY2xhc3NOYW1lPXQpfWZ1bmN0aW9uIGkoKXt2YXIgZSx0LG4scyxpLG8scjtmb3IodmFyIGMgaW4gdSl7aWYoZT1bXSx0PXVbY10sdC5uYW1lJiYoZS5wdXNoKHQubmFtZS50b0xvd2VyQ2FzZSgpKSx0Lm9wdGlvbnMmJnQub3B0aW9ucy5hbGlhc2VzJiZ0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGgpKWZvcihuPTA7bjx0Lm9wdGlvbnMuYWxpYXNlcy5sZW5ndGg7bisrKWUucHVzaCh0Lm9wdGlvbnMuYWxpYXNlc1tuXS50b0xvd2VyQ2FzZSgpKTtmb3Iocz1hKHQuZm4sXCJmdW5jdGlvblwiKT90LmZuKCk6dC5mbixpPTA7aTxlLmxlbmd0aDtpKyspbz1lW2ldLHI9by5zcGxpdChcIi5cIiksMT09PXIubGVuZ3RoP01vZGVybml6cltyWzBdXT1zOighTW9kZXJuaXpyW3JbMF1dfHxNb2Rlcm5penJbclswXV1pbnN0YW5jZW9mIEJvb2xlYW58fChNb2Rlcm5penJbclswXV09bmV3IEJvb2xlYW4oTW9kZXJuaXpyW3JbMF1dKSksTW9kZXJuaXpyW3JbMF1dW3JbMV1dPXMpLGwucHVzaCgocz9cIlwiOlwibm8tXCIpK3Iuam9pbihcIi1cIikpfX1mdW5jdGlvbiBvKCl7cmV0dXJuXCJmdW5jdGlvblwiIT10eXBlb2YgdC5jcmVhdGVFbGVtZW50P3QuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pOmM/dC5jcmVhdGVFbGVtZW50TlMuY2FsbCh0LFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixhcmd1bWVudHNbMF0pOnQuY3JlYXRlRWxlbWVudC5hcHBseSh0LGFyZ3VtZW50cyl9dmFyIGw9W10scj10LmRvY3VtZW50RWxlbWVudCxjPVwic3ZnXCI9PT1yLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksdT1bXSxmPXtfdmVyc2lvbjpcIjMuMC4wLWFscGhhLjRcIixfY29uZmlnOntjbGFzc1ByZWZpeDpcIlwiLGVuYWJsZUNsYXNzZXM6ITAsZW5hYmxlSlNDbGFzczohMCx1c2VQcmVmaXhlczohMH0sX3E6W10sb246ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0KG5bZV0pfSwwKX0sYWRkVGVzdDpmdW5jdGlvbihlLHQsbil7dS5wdXNoKHtuYW1lOmUsZm46dCxvcHRpb25zOm59KX0sYWRkQXN5bmNUZXN0OmZ1bmN0aW9uKGUpe3UucHVzaCh7bmFtZTpudWxsLGZuOmV9KX19LE1vZGVybml6cj1mdW5jdGlvbigpe307TW9kZXJuaXpyLnByb3RvdHlwZT1mLE1vZGVybml6cj1uZXcgTW9kZXJuaXpyO3ZhciBwPW8oXCJpbnB1dFwiKSxkPVwic2VhcmNoIHRlbCB1cmwgZW1haWwgZGF0ZXRpbWUgZGF0ZSBtb250aCB3ZWVrIHRpbWUgZGF0ZXRpbWUtbG9jYWwgbnVtYmVyIHJhbmdlIGNvbG9yXCIuc3BsaXQoXCIgXCIpLG09e307TW9kZXJuaXpyLmlucHV0dHlwZXM9ZnVuY3Rpb24oZSl7Zm9yKHZhciBhLHMsaSxvPWUubGVuZ3RoLGw9XCI6KVwiLGM9MDtvPmM7YysrKXAuc2V0QXR0cmlidXRlKFwidHlwZVwiLGE9ZVtjXSksaT1cInRleHRcIiE9PXAudHlwZSYmXCJzdHlsZVwiaW4gcCxpJiYocC52YWx1ZT1sLHAuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmFic29sdXRlO3Zpc2liaWxpdHk6aGlkZGVuO1wiLC9ecmFuZ2UkLy50ZXN0KGEpJiZwLnN0eWxlLldlYmtpdEFwcGVhcmFuY2UhPT1uPyhyLmFwcGVuZENoaWxkKHApLHM9dC5kZWZhdWx0VmlldyxpPXMuZ2V0Q29tcHV0ZWRTdHlsZSYmXCJ0ZXh0ZmllbGRcIiE9PXMuZ2V0Q29tcHV0ZWRTdHlsZShwLG51bGwpLldlYmtpdEFwcGVhcmFuY2UmJjAhPT1wLm9mZnNldEhlaWdodCxyLnJlbW92ZUNoaWxkKHApKTovXihzZWFyY2h8dGVsKSQvLnRlc3QoYSl8fChpPS9eKHVybHxlbWFpbHxudW1iZXIpJC8udGVzdChhKT9wLmNoZWNrVmFsaWRpdHkmJnAuY2hlY2tWYWxpZGl0eSgpPT09ITE6cC52YWx1ZSE9bCkpLG1bZVtjXV09ISFpO3JldHVybiBtfShkKSxpKCkscyhsKSxkZWxldGUgZi5hZGRUZXN0LGRlbGV0ZSBmLmFkZEFzeW5jVGVzdDtmb3IodmFyIGc9MDtnPE1vZGVybml6ci5fcS5sZW5ndGg7ZysrKU1vZGVybml6ci5fcVtnXSgpO2UuTW9kZXJuaXpyPU1vZGVybml6cn0od2luZG93LGRvY3VtZW50KTtcclxuICAgICAgICBpZiAoIU1vZGVybml6ci5pbnB1dHR5cGVzLmRhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ2RhdGVzdXBwb3J0ZWQnLGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8kKCBcIi5kb2JcIiApLmRhdGVwaWNrZXIoKTtcclxuICAgICAgXHJcbiAgICAgICAgaWYgKCFNT0JJTEUpIHtcclxuICAgICAgICAgICAgdmFyIGZuID0gJCh0aGlzLmZpbmQoJ2lucHV0LmZpcnN0bmFtZScpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5wb3B1cCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXA6ICQodGhpcy5maW5kKCcudHJhdmVsZXJzLnBvcHVwJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyOiAnb3Bwb3NpdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbigpIHsgZm4ucG9wdXAoJ3Nob3cnKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICAub24oJ2JsdXInLCBmdW5jdGlvbigpIHsgc2V0VGltZW91dChmdW5jdGlvbigpIHsgZm4ucG9wdXAoJ2hpZGUnKTsgfSwgMjAwKTsgfSlcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCd0cmF2ZWxlcnMnLCBmdW5jdGlvbih0cmF2ZWxlcnMpIHtcclxuICAgICAgICAgICAgICAgaWYgKHRyYXZlbGVycyAmJiB0cmF2ZWxlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAkKCcudHBvcHVwJywgdmlldy5lbCkubW9iaXNjcm9sbCgpLnNlbGVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uICh2LCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IF8ucGFyc2VJbnQoJCgnLnRwb3B1cCcsIHZpZXcuZWwpLnZhbCgpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGVyID0gXy5maW5kV2hlcmUodmlldy5nZXQoJ3RyYXZlbGVycycpLCB7IGlkOiBpZCB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmF2ZWxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcucGlja1RyYXZlbGVyKHRyYXZlbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgJCh0aGlzKS5jbG9zZXN0KFwiLnBhc3NlbmdlcmNsYXNzXCIpLmZpbmQoJy50dCcpLnRleHQoXy5yZXN1bHQoXy5maW5kKHRpdGxlcywgeydpZCc6IHRyYXZlbGVyLnRpdGxlX2lkfSksICduYW1lJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgdmlldy5zZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci50aXRsZV9pZCcsdHJhdmVsZXIuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICBvblZhbHVlVGFwOiBmdW5jdGlvbiAodiwgaW5zdCkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2KTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codi5jb250ZXh0LmlubmVyVGV4dCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHYuY29udGV4dC5vdXRlckhUTUwpOyAgICAgXHJcbiAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHYuY29udGV4dC5hdHRyaWJ1dGVzWydkYXRhLXZhbCddLm5vZGVWYWx1ZSk7ICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gXy5wYXJzZUludCh2LmNvbnRleHQuYXR0cmlidXRlc1snZGF0YS12YWwnXS5ub2RlVmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhdmVsZXIgPSBfLmZpbmRXaGVyZSh2aWV3LmdldCgndHJhdmVsZXJzJyksIHsgaWQ6IGlkIH0pO1xyXG4gICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyh0cmF2ZWxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmF2ZWxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcucGlja1RyYXZlbGVyKHRyYXZlbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB2YXIgdGl0bGVzID0gdmlldy5nZXQoJ21ldGEudGl0bGVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICQodGhpcykuY2xvc2VzdChcIi5wYXNzZW5nZXJjbGFzc1wiKS5maW5kKCcudHQnKS50ZXh0KF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiB0cmF2ZWxlci50aXRsZV9pZH0pLCAnbmFtZScpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnRwb3B1cCcsIHZpZXcuZWwpLm1vYmlzY3JvbGwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4vLyAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiZG9iXCJdJykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcbi8vICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KHRoaXMudmFsdWUpOyAgICAgICAgIC8vRGF0ZSBpbiBmdWxsIGZvcm1hdCBhbGVydChuZXcgRGF0ZSh0aGlzLnZhbHVlKSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXREYXRlID0gdGhpcy52YWx1ZTsvL25ldyBEYXRlKHRoaXMudmFsdWUpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGU9aW5wdXREYXRlLnNwbGl0KFwiLVwiKTtcclxuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlucHV0RGF0ZSk7XHJcbi8vICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICB0cmF2ZWxlcnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgJCgnLnRwb3B1cCcsIHRoaXMuZWwpLm1vYmlzY3JvbGwoJ3Nob3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdGl0bGVzZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgJCgnLnRpdGxlcG9wdXAnLCB0aGlzLmVsKS5tb2Jpc2Nyb2xsKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNob3c6IGZ1bmN0aW9uKHNlY3Rpb24sIHZhbGlkYXRpb24sIGFsbCkge1xyXG4gICAgICAgIGlmIChhbGwpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoJ2JpcnRoJyA9PSBzZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnZG9tZXN0aWMnICE9ICd2YWxpZGF0aW9uJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgncGFzc3BvcnQnID09IHNlY3Rpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuICdmdWxsJyA9PSAndmFsaWRhdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwaWNrVHJhdmVsZXI6IGZ1bmN0aW9uKHRyYXZlbGVyKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICBpZCA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuaWQnKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKG5vKTtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0KCdwYXNzZW5nZXIudHJhdmVsZXInLCBudWxsKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwYXNzZW5nZXIudHJhdmVsZXInLCBfLmNsb25lRGVlcCh0cmF2ZWxlcikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzZXRkb2I6IGZ1bmN0aW9uKHRyYXZlbGVyKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0cmF2ZWxlcik7XHJcbiAgICAgICAgdmFyIG5vID0gXy5wYXJzZUludCh0cmF2ZWxlclsnbm8nXSk7XHJcbiAgICAgICAgdmFyIHQ9bm8tMTtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRhdGVvZmJpcnRoPSQoXCIjZG9iX1wiK25vKS52YWwoKTtcclxuICAgICAgICB2YXIgZG9iPWRhdGVvZmJpcnRoLnNwbGl0KCctJyk7XHJcbiAgICAgICAgIHRoaXMuc2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGgnLCBkb2IpO1xyXG4gICAgfSxcclxuICAgIHNldGRvYnNpbXBsZTogZnVuY3Rpb24odHJhdmVsZXIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGVyKTtcclxuICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcmVnRXggPSAvXlxcZHsyfS1cXGR7Mn0tXFxkezR9JC87XHJcbiAgICAgICBcclxuICAgICAgICB2YXIgbm8gPSBfLnBhcnNlSW50KHRyYXZlbGVyWydubyddKTtcclxuICAgICAgICB2YXIgdD1uby0xO1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICB2YXIgZGF0ZW9mYmlydGg9JChcIiNkb2JfXCIrbm8pLnZhbCgpO1xyXG4gICAgICAgIGlmKGRhdGVvZmJpcnRoIT0nJyl7XHJcbiAgICAgICAgaWYoZGF0ZW9mYmlydGgubWF0Y2gocmVnRXgpICE9IG51bGwpe1xyXG4gICAgICAgIHZhciBkb2I9ZGF0ZW9mYmlydGguc3BsaXQoJy0nKTtcclxuICAgICAgICB2YXIgZG9iYj1bZG9iWzJdLGRvYlsxXSxkb2JbMF1dO1xyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzBdKT4zMSl7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RvYl9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzFdKT4xMil7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RvYl9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoJywgZG9iYik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RvYl9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgfSxcclxuICAgIFxyXG5cclxuc2V0cGFzc3BvcnRleHBpcnk6IGZ1bmN0aW9uKHRyYXZlbGVyKSB7XHJcbiAgICAgICAgdmFyIG5vID0gXy5wYXJzZUludCh0cmF2ZWxlclsnbm8nXSk7XHJcbiAgICAgICAgdmFyIHQ9bm8tMTsgICAgICAgXHJcbiAgICAgICAgdmFyIGRhdGVvZnBlZD0kKFwiI3BlZF9cIitubykudmFsKCk7XHJcbiAgICAgICAgdmFyIHBlZD1kYXRlb2ZwZWQuc3BsaXQoJy0nKTtcclxuICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeScsIHBlZCk7XHJcbiAgICB9LFxyXG4gICAgIHNldHBhc3Nwb3J0ZXhwaXJ5c2ltcGxlOiBmdW5jdGlvbih0cmF2ZWxlcikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsZXIpO1xyXG4gICAgICAgXHJcbiAgICAgICAgICAgIHZhciByZWdFeCA9IC9eXFxkezJ9LVxcZHsyfS1cXGR7NH0kLztcclxuICAgICAgIFxyXG4gICAgICAgIHZhciBubyA9IF8ucGFyc2VJbnQodHJhdmVsZXJbJ25vJ10pO1xyXG4gICAgICAgIHZhciB0PW5vLTE7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkYXRlb2ZwZWQ9JChcIiNwZWRfXCIrbm8pLnZhbCgpO1xyXG4gICAgICAgIGlmKGRhdGVvZnBlZCE9Jycpe1xyXG4gICAgICAgIGlmKGRhdGVvZnBlZC5tYXRjaChyZWdFeCkgIT0gbnVsbCl7XHJcbiAgICAgICAgdmFyIGRvYj1kYXRlb2ZwZWQuc3BsaXQoJy0nKTtcclxuICAgICAgICB2YXIgZG9iYj1bZG9iWzJdLGRvYlsxXSxkb2JbMF1dO1xyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzBdKT4zMSl7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI3BlZF9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKF8ucGFyc2VJbnQoZG9iWzFdKT4xMil7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIFB1dCBWYWxpZCBEYXRlIGluIERELU1NLVlZWVkgRm9ybWF0XCIpO1xyXG4gICAgICAgICAgICAkKFwiI3BlZF9cIitubykudmFsKCcnKS5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICB0aGlzLnNldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeScsIGRvYmIpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBQdXQgRGF0ZSBpbiBERC1NTS1ZWVlZIEZvcm1hdFwiKTtcclxuICAgICAgICAgICAgJChcIiNwZWRfXCIrbm8pLnZhbCgnJykuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9nbGxlOmZ1bmN0aW9uKHRyYXZlbGVyKXtcclxuICAgICAgICAgdmFyIG5vID0gXy5wYXJzZUludCh0cmF2ZWxlclsnbm8nXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGgnKSE9bnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ2RhdGVzdXBwb3J0ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvYiA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGguMCcpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5iaXJ0aC4xJykgKyAnLScgKyB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoLjInKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZG9iX1wiICsgbm8pLnZhbChkb2IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvYiA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIuYmlydGguMicpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5iaXJ0aC4xJykgKyAnLScgKyB0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLmJpcnRoLjAnKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZG9iX1wiICsgbm8pLnZhbChkb2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdldCgncGFzc2VuZ2VyLnRyYXZlbGVyLnBhc3Nwb3J0X2V4cGlyeScpIT1udWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldCgnZGF0ZXN1cHBvcnRlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9iID0gdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMCcpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMScpICsgJy0nICsgdGhpcy5nZXQoJ3Bhc3Nlbmdlci50cmF2ZWxlci5wYXNzcG9ydF9leHBpcnkuMicpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNwZWRfXCIgKyBubykudmFsKGRvYik7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvYiA9IHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjInKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjEnKSArICctJyArIHRoaXMuZ2V0KCdwYXNzZW5nZXIudHJhdmVsZXIucGFzc3BvcnRfZXhwaXJ5LjAnKTtcclxuICAgICAgICAgICAgICAgICQoXCIjcGVkX1wiICsgbm8pLnZhbChkb2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG9nZ2xlKCdhbGwnKTtcclxuICAgIH1cclxuXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL3Bhc3Nlbmdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEzOFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgc2VnbWVudCBwYXNzZW5nZXIgcGFzc2VuZ2VyY2xhc3MgXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIixcImFsaWduXCI6XCJjZW50ZXJcIixcInN0eWxlXCI6XCJkaXNwbGF5Om5vbmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0aW55IGNpcmN1bGFyIGJ1dHRvblwiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidHJhdmVsZXJzXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJQaWNrIGV4aXN0aW5nXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoaWRlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJ0cG9wdXBcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmaXJzdG5hbWVcIn0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJsYXN0bmFtZVwifV19XSxcIm5cIjo1MixcInJcIjpcInRyYXZlbGVyc1wifV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJ0cmF2ZWxlcnMubGVuZ3RoXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5hbWUgdGhyZWUgZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJUaXRsZSAqXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aXRsZSBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJtb2JpbGVzZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwidGl0bGVcIixcInBsYWNlaG9sZGVyXCI6XCJUaXRsZVwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGEudGl0bGVzXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIudGl0bGVfaWRcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMudGl0bGVfaWRcIn1dLFwidHJhdmVsZXJcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlclwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpcnN0IG5hbWUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkZpcnN0ICYgTWlkZGxlIE5hbWUgKlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJmaXJzdG5hbWVcIixcInBsYWNlaG9sZGVyXCI6XCJGaXJzdCAmIE1pZGRsZSBOYW1lXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLmZpcnN0bmFtZVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5maXJzdG5hbWVcIn1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdHJhdmVsZXJzIHBvcHVwIHZlcnRpY2FsIG1lbnUgaGlkZGVuXCIsXCJzdHlsZVwiOlwibWF4LXdpZHRoOiBub25lOyB3aWR0aDogMTAwJTtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOltcIlBpY2sgYSB0cmF2ZWxlclwiXX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJwaWNrVHJhdmVsZXJcIixcImFcIjp7XCJyXCI6W1wiLlwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVzZXIgaWNvblwifX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJmaXJzdG5hbWVcIn0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJsYXN0bmFtZVwifV19XSxcIm5cIjo1MixcInJcIjpcInRyYXZlbGVyc1wifV0sXCJuXCI6NTAsXCJyXCI6XCJ0cmF2ZWxlcnMubGVuZ3RoXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W1wiTmV3IHRyYXZlbGVyP1wiXX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbXCJXZSB3aWxsIHJlZ2lzdGVyIHRyYXZlbGVyIGluIHRoZSBzeXN0ZW0gZm9yIGZhc3RlciBhY2Nlc3MuXCJdfV0sXCJyXCI6XCJ0cmF2ZWxlcnMubGVuZ3RoXCJ9XSxcInhcIjp7XCJyXCI6W1wic2VhcmNoXCIsXCJ0cmF2ZWxlci5maXJzdG5hbWVcIixcInRyYXZlbGVyc1wiXSxcInNcIjpcInt0cmF2ZWxlcnM6XzAoXzEsXzIpfVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhc3QgbmFtZSBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiTGFzdCBOYW1lICpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwibGFzdG5hbWVcIixcInBsYWNlaG9sZGVyXCI6XCJMYXN0IE5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIubGFzdG5hbWVcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMubGFzdG5hbWVcIn1dfX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImluZm9XcmFwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwiLFwic3R5bGVcIjpbXCJkaXNwbGF5OlwiLHtcInRcIjo0LFwiZlwiOltdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhbGxcIixcInZhbGlkYXRpb25cIl0sXCJzXCI6XCJfMHx8XFxcImRvbWVzdGljXFxcIiE9XzFcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIm5vbmVcIl0sXCJ4XCI6e1wiclwiOltcImFsbFwiLFwidmFsaWRhdGlvblwiXSxcInNcIjpcIl8wfHxcXFwiZG9tZXN0aWNcXFwiIT1fMVwifX1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkRhdGUgb2YgQmlydGggXCIse1widFwiOjQsXCJmXCI6W1wiKlwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1widmFsaWRhdGlvblwiXSxcInNcIjpcIlxcXCJkb21lc3RpY1xcXCIhPV8wXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3Nwb3J0LWV4cGlyeSBkYXRlIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiZGF0ZVwiLFwicGxhY2Vob2xkZXJcIjpcIllZWVktTU0tRERcIixcImlkXCI6W1wiZG9iX1wiLHtcInRcIjoyLFwiclwiOlwibm9cIn1dLFwidmFsdWVcIjpcIlwiLFwiY2xhc3NcIjpcImRvYlwifSxcInZcIjp7XCJjaGFuZ2VcIjp7XCJtXCI6XCJzZXRkb2JcIixcImFcIjp7XCJyXCI6W1wiLlwiXSxcInNcIjpcIltfMF1cIn19fX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic21hbGxcIixcImFcIjp7XCJzdHlsZVwiOlwiY29sb3I6IzlhOWE5YTsgZm9udC1mYW1pbHk6YXJpYWw7IGZvbnQtc2l6ZToxMnB4OyBsaW5lLWhlaWdodDoxLjI7XCJ9LFwiZlwiOltcIkRhdGUgb2YgQmlydGggY2FuIGJlIGNoYW5nZWQgbGF0ZXIuXCJdfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1widmFsaWRhdGlvblwiXSxcInNcIjpcIlxcXCJkb21lc3RpY1xcXCIhPV8wXCJ9fV19XSxcIm5cIjo1MCxcInJcIjpcImRhdGVzdXBwb3J0ZWRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkRhdGUgb2YgQmlydGggKERELU1NLVlZWVkpIFwiLHtcInRcIjo0LFwiZlwiOltcIipcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInZhbGlkYXRpb25cIl0sXCJzXCI6XCJcXFwiZG9tZXN0aWNcXFwiIT1fMFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzcG9ydC1leHBpcnkgZGF0ZSBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInRleHRcIixcInBsYWNlaG9sZGVyXCI6XCJERC1NTS1ZWVlZXCIsXCJpZFwiOltcImRvYl9cIix7XCJ0XCI6MixcInJcIjpcIm5vXCJ9XSxcInZhbHVlXCI6XCJcIixcImNsYXNzXCI6XCJkb2JcIn0sXCJ2XCI6e1wiYmx1clwiOntcIm1cIjpcInNldGRvYnNpbXBsZVwiLFwiYVwiOntcInJcIjpbXCIuXCJdLFwic1wiOlwiW18wXVwifX19fV19XSxcInJcIjpcImRhdGVzdXBwb3J0ZWRcIn0sXCIgXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6W1wiZGlzcGxheTpcIix7XCJ0XCI6NCxcImZcIjpbXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWxsXCIsXCJ2YWxpZGF0aW9uXCJdLFwic1wiOlwiXzB8fFxcXCJmdWxsXFxcIj09XzFcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIm5vbmVcIl0sXCJ4XCI6e1wiclwiOltcImFsbFwiLFwidmFsaWRhdGlvblwiXSxcInNcIjpcIl8wfHxcXFwiZnVsbFxcXCI9PV8xXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzcG9ydCB0d28gZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiUGFzc3BvcnQgTm8uXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3Nwb3J0LW51bWJlclwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3Nwb3J0IE51bWJlclwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5wYXNzcG9ydF9udW1iZXJcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc3BvcnRfbnVtYmVyXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkNvdW50cnlcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci5wYXNzcG9ydF9jb3VudHJ5X2lkXCJ9XSxcImNsYXNzXCI6XCJwYXNzcG9ydC1jb3VudHJ5XCIsXCJzZWFyY2hcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzcG9ydCBDb3VudHJ5XCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtZXRhLnNlbGVjdFwiXSxcInNcIjpcIl8wLmNvdW50cmllcygpXCJ9fV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5wYXNzcG9ydF9jb3VudHJ5X2lkXCJ9XX0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJQYXNzcG9ydCBFeHBpcnkgRGF0ZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicGFzc3BvcnQtZXhwaXJ5IGRhdGUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiZGF0ZVwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3Nwb3J0IGV4cGlyeSBkYXRlIFlZWVktTU0tRERcIixcImlkXCI6W1wicGVkX1wiLHtcInRcIjoyLFwiclwiOlwibm9cIn1dfSxcInZcIjp7XCJjaGFuZ2VcIjp7XCJtXCI6XCJzZXRwYXNzcG9ydGV4cGlyeVwiLFwiYVwiOntcInJcIjpbXCIuXCJdLFwic1wiOlwiW18wXVwifX19fV0sXCJuXCI6NTAsXCJyXCI6XCJkYXRlc3VwcG9ydGVkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwidGV4dFwiLFwicGxhY2Vob2xkZXJcIjpcIkRELU1NLVlZWVlcIixcImlkXCI6W1wicGVkX1wiLHtcInRcIjoyLFwiclwiOlwibm9cIn1dfSxcInZcIjp7XCJibHVyXCI6e1wibVwiOlwic2V0cGFzc3BvcnRleHBpcnlzaW1wbGVcIixcImFcIjp7XCJyXCI6W1wiLlwiXSxcInNcIjpcIltfMF1cIn19fX1dLFwiclwiOlwiZGF0ZXN1cHBvcnRlZFwifV19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJhbGlnblwiOlwicmlnaHRcIixcImNsYXNzXCI6XCJtb3JlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJzdHlsZVwiOlwiZm9udC1zaXplOjEycHg7IGNvbG9yOiNhZWFlYWU7IGZvbnQtZmFtaWx5OmFyaWFsO1wifSxcImZcIjpbXCJPcHRpb25hbFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHRpbnkgY2lyY3VsYXIgYnV0dG9uXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJ0b2dsbGVcIixcImFcIjp7XCJyXCI6W1wiLlwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wi4oCTIExlc3NcIl0sXCJuXCI6NTAsXCJyXCI6XCJhbGxcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiKyBNb3JlXCJdLFwiclwiOlwiYWxsXCJ9LFwiIEluZm9cIl19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJ2YWxpZGF0aW9uXCJdLFwic1wiOlwiXFxcImZ1bGxcXFwiIT1fMFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiclwiOlwicGFzc2VuZ2VyXCJ9XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9wYXNzZW5nZXIuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDEzOVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50JyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuICAgIDtcclxuXHJcbnZhclxyXG4gICAgTEFSR0UgPSAnbGFyZ2UnLFxyXG4gICAgRElTQUJMRUQgPSAnZGlzYWJsZWQnLFxyXG4gICAgTE9BRElORyA9ICdpY29uIGxvYWRpbmcnLFxyXG4gICAgREVDT1JBVEVEID0gJ2RlY29yYXRlZCcsXHJcbiAgICBFUlJPUiA9ICdlcnJvcicsXHJcbiAgICBJTiA9ICdpbicsXHJcbiAgICBTRUFSQ0ggPSAnc2VhcmNoJyxcclxuICAgIElOUFVUID0gJ2lucHV0J1xyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vbW9iaWxlc2VsZWN0Lmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjbGFzc2VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZGF0YS5zdGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5kaXNhYmxlZCB8fCBkYXRhLnN0YXRlLnN1Ym1pdHRpbmcpIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUubG9hZGluZykgY2xhc3Nlcy5wdXNoKExPQURJTkcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmVycm9yKSBjbGFzc2VzLnB1c2goRVJST1IpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sYXJnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChJTlBVVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKERFQ09SQVRFRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKExBUkdFKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgfHwgZGF0YS5mb2N1cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goSU4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goU0VBUkNIKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcywgbztcclxuXHJcbiAgICAgICAgdmFyIGVsID0gJCgnLnBvcHVwJywgdmlldy5lbCkubW9iaXNjcm9sbCgpLnNlbGVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uICh2LCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmVsKS5maW5kKCcudHQnKS50ZXh0KHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlPSBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J25hbWUnOiBfLnBhcnNlSW50KHYpfSksICdpZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3RyYXZlbGVyLnRpdGxlX2lkJyx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCd0cmF2ZWxlcicpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9uVmFsdWVUYXA6IGZ1bmN0aW9uICh2LCBpbnN0KSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID12aWV3LmdldCgnb3B0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGU9di5jb250ZXh0LmF0dHJpYnV0ZXNbJ2RhdGEtdmFsJ10ubm9kZVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU9IF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiBfLnBhcnNlSW50KHRpdGxlKX0pLCAnbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZpZXcuZWwpLmZpbmQoJy50dCcpLnRleHQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcucG9wdXAnLCB2aWV3LmVsKS5tb2Jpc2Nyb2xsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCd0cmF2ZWxlci50aXRsZV9pZCcsXy5wYXJzZUludCh0aXRsZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHZpZXcuZ2V0KCd0cmF2ZWxlcicpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncHAnK3RpdGxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCd2YWx1ZScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXQoJ29wdGlvbnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gXy5maW5kKG9wdGlvbnMsIHtpZDogdmFsdWV9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG8pIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICBlbC5kcm9wZG93bignc2V0IHZhbHVlJywgby5pZCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZWwuZHJvcGRvd24oJ3NldCB0ZXh0Jywgby50ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICBlbC5kcm9wZG93bigncmVzdG9yZSBkZWZhdWx0cycpO1xyXG5cclxuXHJcbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcbnNlbGVjdHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgXHJcbiAgICAgICB2aWV3LnNldCgndHJhdmVsZXIudGl0bGVfaWQnLF8ucGFyc2VJbnQoJCh0aGlzLmZpbmQoJy5wb3B1cCcpKS52YWwoKSkpO1xyXG4gICAgIC8vICBjb25zb2xlLmxvZyh2aWV3LmdldCgndHJhdmVsZXInKSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCd2YWx1ZScpKTtcclxuICAgIH0sXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy5zZXQoJ29wdGlvbnMnLCBudWxsKTtcclxuICAgIH0sXHJcbiAgICAgZHJvcGRvd25zZWxlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAkKCcucG9wdXAnLCB0aGlzLmVsKS5tb2Jpc2Nyb2xsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2Ryb3Bkb3duc2VsZWN0Jyk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL21vYmlsZXNlbGVjdC5qc1xuICoqIG1vZHVsZSBpZCA9IDE0MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwiLFwiYWxpZ25cIjpcImNlbnRlclwifSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZHJvcGRvd24gXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiZHJvcGRvd25zZWxlY3RcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZWZhdWx0IHRleHQgdHRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiZHJvcGRvd24gaWNvblwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoaWRlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJwb3B1cFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJvcHRpb25cIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImlkXCJ9XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibmFtZVwifV19XSxcInJcIjpcIm9wdGlvbnNcIn1dfV19XX1dLFwiblwiOjUwLFwiclwiOlwib3B0aW9ucy5sZW5ndGhcIn1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9tb2JpbGVzZWxlY3QuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDE0MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG91dCA9IHtcclxuICAgICAgICBEOiBfLnJhbmdlKDEsMzIpLFxyXG4gICAgICAgIE06IF8ucmFuZ2UoMSwxMyksXHJcbiAgICAgICAgTU1NTTogbW9tZW50Lm1vbnRocygpXHJcbiAgICB9O1xyXG5cclxuICAgIG91dC5zZWxlY3QgPSB7XHJcbiAgICAgICAgRDogXy5tYXAob3V0LkQsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IF8ucGFkTGVmdChpLCAyLCAwKSwgdGV4dDogaSB9OyB9KSxcclxuICAgICAgICBNOiBfLm1hcChvdXQuTSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogXy5wYWRMZWZ0KGksIDIsIDApLCB0ZXh0OiBpIH07IH0pLFxyXG4gICAgICAgIE1NTU06IF8ubWFwKG91dC5NTU1NLCBmdW5jdGlvbihpLCBrKSB7IHJldHVybiB7IGlkOiBfLnBhZExlZnQoayArIDEsIDIsIDApLCB0ZXh0OiBpIH07IH0pLFxyXG5cclxuICAgICAgICBwYXNzcG9ydFllYXJzOiBfLm1hcChfLnJhbmdlKG1vbWVudCgpLnllYXIoKSwgbW9tZW50KCkueWVhcigpICsgMTUpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiAnJytpLCB0ZXh0OiAnJytpIH07IH0pLFxyXG5cclxuICAgICAgICBiaXJ0aFllYXJzOiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLm1hcChfLnJhbmdlKG1vbWVudCgpLnllYXIoKSwgMTg5OSwgLTEpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiAnJytpLCB0ZXh0OiAnJytpIH07IH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNhcmRZZWFyczogXy5tYXAoXy5yYW5nZShtb21lbnQoKS55ZWFyKCksIG1vbWVudCgpLmFkZCgyNSwgJ3llYXJzJykueWVhcigpKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogJycraSwgdGV4dDogJycraSB9OyB9KSxcclxuICAgICAgICBjYXJkTW9udGhzOiBfLm1hcChvdXQuTU1NTSwgZnVuY3Rpb24oaSwgaykgeyByZXR1cm4geyBpZDogayArIDEsIHRleHQ6IF8ucGFkTGVmdChrKzEsIDIsICcwJykgKyAnICcgKyBpIH07IH0pXHJcblxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9oZWxwZXJzL2RhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSAxNDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA2XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5yZXF1aXJlKCdqcXVlcnkucGF5bWVudCcpO1xyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG5cclxuICAgIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JyksXHJcbiAgICBoX2R1cmF0aW9uID0gcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKCksXHJcbiAgICBoX2RhdGUgPSByZXF1aXJlKCdoZWxwZXJzL2RhdGUnKSgpLFxyXG4gICAgYWNjb3VudGluZyA9IHJlcXVpcmUoJ2FjY291bnRpbmcuanMnKVxyXG4gICAgO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1jYyc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9jYy9udW1iZXInKSxcclxuICAgICAgICAndWktY3Z2JzogcmVxdWlyZSgnY29yZS9mb3JtL2NjL2N2dicpLFxyXG4gICAgICAgICd1aS1leHBpcnknOiByZXF1aXJlKCdjb3JlL2Zvcm0vY2MvY2FyZGV4cGlyeScpXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcm9tb2NvZGU6bnVsbCxcclxuICAgICAgICAgICAgcHJvbW92YWx1ZTpudWxsLFxyXG4gICAgICAgICAgICBwcm9tb2Vycm9yOm51bGwsXHJcbiAgICAgICAgICAgIGFjY2VwdGVkOnRydWUsXHJcbiAgICAgICAgICAgIG1vbmV5OiBoX21vbmV5LFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogaF9kdXJhdGlvbixcclxuICAgICAgICAgICAgZGF0ZTogaF9kYXRlLFxyXG4gICAgICAgICAgICBiYW5rczogW1xyXG4gICAgICAgICAgICAgICAge2lkOiAnQVhJQicgLCB0ZXh0OiAnQVhJUyBCYW5rIE5ldEJhbmtpbmcnIH0sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdCT0lCJyAsIHRleHQ6ICdCYW5rIG9mIEluZGlhJyB9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQk9NQicsIHRleHQ6ICdCYW5rIG9mIE1haGFyYXNodHJhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdDQklCJywgdGV4dDogJ0NlbnRyYWwgQmFuayBPZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQ1JQQicsIHRleHQ6ICdDb3Jwb3JhdGlvbiBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdEQ0JCJywgdGV4dDogJ0RldmVsb3BtZW50IENyZWRpdCBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdGRURCJywgdGV4dDogJ0ZlZGVyYWwgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSERGQicsIHRleHQ6ICdIREZDIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIC8ve2lkOiAnSUNJQicsIHRleHQ6ICdJQ0lDSSBOZXRiYW5raW5nJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdJREJCJywgdGV4dDogJ0luZHVzdHJpYWwgRGV2ZWxvcG1lbnQgQmFuayBvZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSU5EQicsIHRleHQ6ICdJbmRpYW4gQmFuayAnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0lOSUInLCB0ZXh0OiAnSW5kdXNJbmQgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSU5PQicsIHRleHQ6ICdJbmRpYW4gT3ZlcnNlYXMgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSkFLQicsIHRleHQ6ICdKYW1tdSBhbmQgS2FzaG1pciBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdLUktCJywgdGV4dDogJ0thcm5hdGFrYSBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdLUlZCJywgdGV4dDogJ0thcnVyIFZ5c3lhICd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JCSkInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBCaWthbmVyIGFuZCBKYWlwdXInfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NCSEInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBIeWRlcmFiYWQnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NCSUInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JNQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIE15c29yZSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JUQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIFRyYXZhbmNvcmUnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NPSUInLCB0ZXh0OiAnU291dGggSW5kaWFuIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1VCSUInLCB0ZXh0OiAnVW5pb24gQmFuayBvZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnVU5JQicsIHRleHQ6ICdVbml0ZWQgQmFuayBPZiBJbmRpYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnVkpZQicsIHRleHQ6ICdWaWpheWEgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnWUVTQicsIHRleHQ6ICdZZXMgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQ1VCQicsIHRleHQ6ICdDaXR5VW5pb24nfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0NBQkInLCB0ZXh0OiAnQ2FuYXJhIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ1NCUEInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBQYXRpYWxhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdDSVROQicsIHRleHQ6ICdDaXRpIEJhbmsgTmV0QmFua2luZyd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnRFNIQicsIHRleHQ6ICdEZXV0c2NoZSBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICcxNjJCJywgdGV4dDogJ0tvdGFrIEJhbmsnfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBmb3JtYXRZZWFyOiBmdW5jdGlvbiAoeWVhcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHllYXIuc2xpY2UoLTIpOztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0UGF5TW9uZXk6ZnVuY3Rpb24oYW1vdW50KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2NvdW50aW5nLmZvcm1hdE1vbmV5KGFtb3VudCwgJzxpIGNsYXNzPVwiaW5yIGljb24gY3VycmVuY3lcIj48L2k+JywgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnYm9va2luZy5zdGVwcy4zLmFjdGl2ZScsIGZ1bmN0aW9uKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9jYXJkcycsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBib29raW5nX2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjYXJkcycsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXRDYXJkKGRhdGFbZGF0YS5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2FyZHMnLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb2NvZGUnLHZpZXcuZ2V0KCdib29raW5nLnByb21vX2NvZGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb21vdmFsdWUnLHZpZXcuZ2V0KCdib29raW5nLnByb21vX3ZhbHVlJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnYm9va2luZy5wYXltZW50LmFjdGl2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ2Jvb2tpbmcnKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdib29raW5nLnN0ZXBzLjMuZXJyb3JzJywgZmFsc2UpO1xyXG4gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICB2YXIgYm9va2luZyA9IHRoaXMuZ2V0KCdib29raW5nJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYm9va2luZyk7XHJcbi8vICAgICAgICB2YXIgY2FyZGV4cGlyeT0kKCcjY2MtZXhwJykudmFsKCk7XHJcbi8vICAgICAgICBjb25zb2xlLmxvZyhjYXJkZXhwaXJ5KTtcclxuLy8gICAgICAgIGlmKGNhcmRleHBpcnkgIT1udWxsICYmIGNhcmRleHBpcnkgIT0nJyl7XHJcbi8vICAgICAgICAgICAgY2FyZGFycj1jYXJkZXhwaXJ5LnNwbGl0KCcvJyk7XHJcbi8vICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MuZXhwX21vbnRoJyx0cmltKGNhcmRhcnJbMF0pKTtcclxuLy8gICAgICAgICAgICBib29raW5nLnNldCgncGF5bWVudC5jYy5leHBfeWVhcicsdHJpbShjYXJkYXJyWzFdKSk7XHJcbi8vICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5zdGVwMygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRDYXJkOiBmdW5jdGlvbihjYykge1xyXG4gICAgICAgIHZhciBib29raW5nID0gdGhpcy5nZXQoJ2Jvb2tpbmcnKTtcclxuXHJcbiAgICAgICAgaWYgKGJvb2tpbmcuZ2V0KCdwYXltZW50LmNjLmlkJykgIT09IGNjLmlkKSB7XHJcbiAgICAgICAgICAgIGJvb2tpbmcuc2V0KCdwYXltZW50LmNjJywgY2MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJvb2tpbmcuc2V0KCdwYXltZW50LmNjJywge30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0Q0M6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGJvb2tpbmcgPSB0aGlzLmdldCgnYm9va2luZycpLFxyXG4gICAgICAgICAgICBlID0gZXZlbnQub3JpZ2luYWwsXHJcbiAgICAgICAgICAgIGVsID0gJChlLnNyY0VsZW1lbnQpLFxyXG4gICAgICAgICAgICBpZCA9IGJvb2tpbmcuZ2V0KCdwYXltZW50LmNjLmlkJyksXHJcbiAgICAgICAgICAgIHl1cCA9IDAgPT0gZWwucGFyZW50cygnLnVpLmlucHV0LmN2dicpLnNpemUoKSAmJiAoKCdJTlBVVCcgPT0gZWxbMF0udGFnTmFtZSkgfHwgZWwuaGFzQ2xhc3MoJ2Ryb3Bkb3duJykgfHwgZWwucGFyZW50cygnLnVpLmRyb3Bkb3duJykuc2l6ZSgpKTtcclxuXHJcbiAgICAgICAgaWYgKGlkICYmIHl1cCkge1xyXG4gICAgICAgICAgICBib29raW5nLnNldCgncGF5bWVudC5jYycsIHt9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZ2V0KCdib29raW5nJykuYWN0aXZhdGUoMik7XHJcbiAgICB9LFxyXG5cclxuICAgIGFwcGx5UHJvbW9Db2RlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIHByb21vY29kZT10aGlzLmdldCgncHJvbW9jb2RlJyk7XHJcbiAgICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpLHByb21vOnByb21vY29kZX07XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL2NoZWNrUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmhhc093blByb3BlcnR5KCdlcnJvcicpKXsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb2Vycm9yJyxkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGRhdGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9tb3ZhbHVlJyxkYXRhLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb192YWx1ZScsZGF0YS52YWx1ZSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdib29raW5nLnByb21vX2NvZGUnLGRhdGEuY29kZSk7IFxyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmlldy5nZXQoJ3Byb21vdmFsdWUnKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUHJvbW9Db2RlOmZ1bmN0aW9uKCl7XHJcbiAgICAgLy8gICBjb25zb2xlLmxvZygncmVtb3ZlUHJvbW9Db2RlJyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb21vZXJyb3InLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb2NvZGUnLG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9tb3ZhbHVlJyxudWxsKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzOyAgICAgIFxyXG4gICAgICAgIHZhciBkYXRhID0ge2lkOiB0aGlzLmdldCgnYm9va2luZy5pZCcpfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvcmVtb3ZlUHJvbW9Db2RlJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnYm9va2luZy5wcm9tb192YWx1ZScsbnVsbCk7IFxyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Jvb2tpbmcucHJvbW9fY29kZScsbnVsbCk7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlRXJyb3JNc2c6ZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnNldCgncHJvbW9lcnJvcicsbnVsbCk7XHJcbiAgICB9LFxyXG4gICAgY2hlY2tFeHBpcnk6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgJC5mbi50b2dnbGVJbnB1dEVycm9yID0gZnVuY3Rpb24oZXJyZWQpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCgnLmZvcm0tZ3JvdXAnKS50b2dnbGVDbGFzcygnaGFzLWVycm9yJywgZXJyZWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9O1xyXG4gICAgICAkKCcuY2MtZXhwJykudmFsKCk7XHJcbiAgICAgICQucGF5bWVudC52YWxpZGF0ZUNhcmRFeHBpcnkoJzA1JywgJzIwJyk7IC8vPT4gdHJ1ZVxyXG4gICAgICAgICAkKCcuY2MtZXhwJykudG9nZ2xlSW5wdXRFcnJvcighJC5wYXltZW50LnZhbGlkYXRlQ2FyZEV4cGlyeSgkKCcuY2MtZXhwJykucGF5bWVudCgnY2FyZEV4cGlyeVZhbCcpKSk7XHJcbiAgICAgICAgICQoJy52YWxpZGF0aW9uJykucmVtb3ZlQ2xhc3MoJ3RleHQtZGFuZ2VyIHRleHQtc3VjY2VzcycpO1xyXG4gICAgICAgICAkKCcudmFsaWRhdGlvbicpLmFkZENsYXNzKCQoJy5oYXMtZXJyb3InKS5sZW5ndGggPyAndGV4dC1kYW5nZXInIDogJ3RleHQtc3VjY2VzcycpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5qc1xuICoqIG1vZHVsZSBpZCA9IDE0M1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgY2FyZEZyb21OdW1iZXIsIGNhcmRGcm9tVHlwZSwgY2FyZHMsIGRlZmF1bHRGb3JtYXQsIGZvcm1hdEJhY2tDYXJkTnVtYmVyLCBmb3JtYXRCYWNrRXhwaXJ5LCBmb3JtYXRDYXJkTnVtYmVyLCBmb3JtYXRFeHBpcnksIGZvcm1hdEZvcndhcmRFeHBpcnksIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlLCBoYXNUZXh0U2VsZWN0ZWQsIGx1aG5DaGVjaywgcmVGb3JtYXRDVkMsIHJlRm9ybWF0Q2FyZE51bWJlciwgcmVGb3JtYXRFeHBpcnksIHJlRm9ybWF0TnVtZXJpYywgcmVzdHJpY3RDVkMsIHJlc3RyaWN0Q2FyZE51bWJlciwgcmVzdHJpY3RFeHBpcnksIHJlc3RyaWN0TnVtZXJpYywgc2V0Q2FyZFR5cGUsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gICQucGF5bWVudCA9IHt9O1xuXG4gICQucGF5bWVudC5mbiA9IHt9O1xuXG4gICQuZm4ucGF5bWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBtZXRob2Q7XG4gICAgbWV0aG9kID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICByZXR1cm4gJC5wYXltZW50LmZuW21ldGhvZF0uYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG5cbiAgZGVmYXVsdEZvcm1hdCA9IC8oXFxkezEsNH0pL2c7XG5cbiAgJC5wYXltZW50LmNhcmRzID0gY2FyZHMgPSBbXG4gICAge1xuICAgICAgdHlwZTogJ3Zpc2FlbGVjdHJvbicsXG4gICAgICBwYXR0ZXJuOiAvXjQoMDI2fDE3NTAwfDQwNXw1MDh8ODQ0fDkxWzM3XSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ21hZXN0cm8nLFxuICAgICAgcGF0dGVybjogL14oNSgwMTh8MFsyM118WzY4XSl8NigzOXw3KSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdmb3JicnVnc2ZvcmVuaW5nZW4nLFxuICAgICAgcGF0dGVybjogL142MDAvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2RhbmtvcnQnLFxuICAgICAgcGF0dGVybjogL141MDE5LyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICd2aXNhJyxcbiAgICAgIHBhdHRlcm46IC9eNC8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxMywgMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ21hc3RlcmNhcmQnLFxuICAgICAgcGF0dGVybjogL14oNVswLTVdfDJbMi03XSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2FtZXgnLFxuICAgICAgcGF0dGVybjogL14zWzQ3XS8sXG4gICAgICBmb3JtYXQ6IC8oXFxkezEsNH0pKFxcZHsxLDZ9KT8oXFxkezEsNX0pPy8sXG4gICAgICBsZW5ndGg6IFsxNV0sXG4gICAgICBjdmNMZW5ndGg6IFszLCA0XSxcbiAgICAgIGx1aG46IHRydWVcbiAgICB9LCB7XG4gICAgICB0eXBlOiAnZGluZXJzY2x1YicsXG4gICAgICBwYXR0ZXJuOiAvXjNbMDY4OV0vLFxuICAgICAgZm9ybWF0OiAvKFxcZHsxLDR9KShcXGR7MSw2fSk/KFxcZHsxLDR9KT8vLFxuICAgICAgbGVuZ3RoOiBbMTRdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2Rpc2NvdmVyJyxcbiAgICAgIHBhdHRlcm46IC9eNihbMDQ1XXwyMikvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ3VuaW9ucGF5JyxcbiAgICAgIHBhdHRlcm46IC9eKDYyfDg4KS8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxNiwgMTcsIDE4LCAxOV0sXG4gICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgIGx1aG46IGZhbHNlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2pjYicsXG4gICAgICBwYXR0ZXJuOiAvXjM1LyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH1cbiAgXTtcblxuICBjYXJkRnJvbU51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBfaSwgX2xlbjtcbiAgICBudW0gPSAobnVtICsgJycpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBjYXJkcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgY2FyZCA9IGNhcmRzW19pXTtcbiAgICAgIGlmIChjYXJkLnBhdHRlcm4udGVzdChudW0pKSB7XG4gICAgICAgIHJldHVybiBjYXJkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjYXJkRnJvbVR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgdmFyIGNhcmQsIF9pLCBfbGVuO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gY2FyZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGNhcmQgPSBjYXJkc1tfaV07XG4gICAgICBpZiAoY2FyZC50eXBlID09PSB0eXBlKSB7XG4gICAgICAgIHJldHVybiBjYXJkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBsdWhuQ2hlY2sgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgZGlnaXQsIGRpZ2l0cywgb2RkLCBzdW0sIF9pLCBfbGVuO1xuICAgIG9kZCA9IHRydWU7XG4gICAgc3VtID0gMDtcbiAgICBkaWdpdHMgPSAobnVtICsgJycpLnNwbGl0KCcnKS5yZXZlcnNlKCk7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBkaWdpdHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGRpZ2l0ID0gZGlnaXRzW19pXTtcbiAgICAgIGRpZ2l0ID0gcGFyc2VJbnQoZGlnaXQsIDEwKTtcbiAgICAgIGlmICgob2RkID0gIW9kZCkpIHtcbiAgICAgICAgZGlnaXQgKj0gMjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWdpdCA+IDkpIHtcbiAgICAgICAgZGlnaXQgLT0gOTtcbiAgICAgIH1cbiAgICAgIHN1bSArPSBkaWdpdDtcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAlIDEwID09PSAwO1xuICB9O1xuXG4gIGhhc1RleHRTZWxlY3RlZCA9IGZ1bmN0aW9uKCR0YXJnZXQpIHtcbiAgICB2YXIgX3JlZjtcbiAgICBpZiAoKCR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPSBudWxsKSAmJiAkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT09ICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uRW5kJykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudCAhPT0gbnVsbCA/IChfcmVmID0gZG9jdW1lbnQuc2VsZWN0aW9uKSAhPSBudWxsID8gX3JlZi5jcmVhdGVSYW5nZSA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZUZvcm1hdE51bWVyaWMgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZUZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSAkLnBheW1lbnQuZm9ybWF0Q2FyZE51bWJlcih2YWx1ZSk7XG4gICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGNhcmQsIGRpZ2l0LCBsZW5ndGgsIHJlLCB1cHBlckxlbmd0aCwgdmFsdWU7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKHZhbHVlICsgZGlnaXQpO1xuICAgIGxlbmd0aCA9ICh2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpICsgZGlnaXQpLmxlbmd0aDtcbiAgICB1cHBlckxlbmd0aCA9IDE2O1xuICAgIGlmIChjYXJkKSB7XG4gICAgICB1cHBlckxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID49IHVwcGVyTGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjYXJkICYmIGNhcmQudHlwZSA9PT0gJ2FtZXgnKSB7XG4gICAgICByZSA9IC9eKFxcZHs0fXxcXGR7NH1cXHNcXGR7Nn0pJC87XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlID0gLyg/Ol58XFxzKShcXGR7NH0pJC87XG4gICAgfVxuICAgIGlmIChyZS50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSArICcgJyArIGRpZ2l0KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmUudGVzdCh2YWx1ZSArIGRpZ2l0KSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSArIGRpZ2l0ICsgJyAnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmb3JtYXRCYWNrQ2FyZE51bWJlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgaWYgKGUud2hpY2ggIT09IDgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCgkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT0gbnVsbCkgJiYgJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9PSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKC9cXGRcXHMkLy50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZS5yZXBsYWNlKC9cXGRcXHMkLywgJycpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoL1xcc1xcZD8kLy50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZS5yZXBsYWNlKC9cXGQkLywgJycpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZUZvcm1hdEV4cGlyeSA9IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdGFyZ2V0LCB2YWx1ZTtcbiAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICB2YWx1ZSA9ICQucGF5bWVudC5mb3JtYXRFeHBpcnkodmFsdWUpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICBmb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWw7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgaWYgKC9eXFxkJC8udGVzdCh2YWwpICYmICh2YWwgIT09ICcwJyAmJiB2YWwgIT09ICcxJykpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCIwXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoL15cXGRcXGQkLy50ZXN0KHZhbCkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCJcIiArIHZhbCArIFwiIC8gXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdEZvcndhcmRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWw7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmICgvXlxcZFxcZCQvLnRlc3QodmFsKSkge1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICB9XG4gIH07XG5cbiAgZm9ybWF0Rm9yd2FyZFNsYXNoQW5kU3BhY2UgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIHZhbCwgd2hpY2g7XG4gICAgd2hpY2ggPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghKHdoaWNoID09PSAnLycgfHwgd2hpY2ggPT09ICcgJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiB2YWwgIT09ICcwJykge1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiMFwiICsgdmFsICsgXCIgLyBcIik7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdEJhY2tFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmIChlLndoaWNoICE9PSA4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgvXFxkXFxzXFwvXFxzJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkXFxzXFwvXFxzJC8sICcnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmVGb3JtYXRDVkMgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDQpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXN0cmljdE51bWVyaWMgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGlucHV0O1xuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGUud2hpY2ggPT09IDMyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChlLndoaWNoID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGUud2hpY2ggPCAzMykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlucHV0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICByZXR1cm4gISEvW1xcZFxcc10vLnRlc3QoaW5wdXQpO1xuICB9O1xuXG4gIHJlc3RyaWN0Q2FyZE51bWJlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgY2FyZCwgZGlnaXQsIHZhbHVlO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCgkdGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YWx1ZSA9ICgkdGFyZ2V0LnZhbCgpICsgZGlnaXQpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoY2FyZCkge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSAxNjtcbiAgICB9XG4gIH07XG5cbiAgcmVzdHJpY3RFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWx1ZTtcbiAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQoJHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPiA2KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHJlc3RyaWN0Q1ZDID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCgkdGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgcmV0dXJuIHZhbC5sZW5ndGggPD0gNDtcbiAgfTtcblxuICBzZXRDYXJkVHlwZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgYWxsVHlwZXMsIGNhcmQsIGNhcmRUeXBlLCB2YWw7XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGNhcmRUeXBlID0gJC5wYXltZW50LmNhcmRUeXBlKHZhbCkgfHwgJ3Vua25vd24nO1xuICAgIGlmICghJHRhcmdldC5oYXNDbGFzcyhjYXJkVHlwZSkpIHtcbiAgICAgIGFsbFR5cGVzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGNhcmRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgY2FyZCA9IGNhcmRzW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGNhcmQudHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ3Vua25vd24nKTtcbiAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoYWxsVHlwZXMuam9pbignICcpKTtcbiAgICAgICR0YXJnZXQuYWRkQ2xhc3MoY2FyZFR5cGUpO1xuICAgICAgJHRhcmdldC50b2dnbGVDbGFzcygnaWRlbnRpZmllZCcsIGNhcmRUeXBlICE9PSAndW5rbm93bicpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudHJpZ2dlcigncGF5bWVudC5jYXJkVHlwZScsIGNhcmRUeXBlKTtcbiAgICB9XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmZvcm1hdENhcmRDVkMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdENWQyk7XG4gICAgdGhpcy5vbigncGFzdGUnLCByZUZvcm1hdENWQyk7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRDVkMpO1xuICAgIHRoaXMub24oJ2lucHV0JywgcmVGb3JtYXRDVkMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gICQucGF5bWVudC5mbi5mb3JtYXRDYXJkRXhwaXJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdE51bWVyaWMpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3RFeHBpcnkpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0RXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlKTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdEZvcndhcmRFeHBpcnkpO1xuICAgIHRoaXMub24oJ2tleWRvd24nLCBmb3JtYXRCYWNrRXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCByZUZvcm1hdEV4cGlyeSk7XG4gICAgdGhpcy5vbignaW5wdXQnLCByZUZvcm1hdEV4cGlyeSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdENhcmROdW1iZXIpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbigna2V5ZG93bicsIGZvcm1hdEJhY2tDYXJkTnVtYmVyKTtcbiAgICB0aGlzLm9uKCdrZXl1cCcsIHNldENhcmRUeXBlKTtcbiAgICB0aGlzLm9uKCdwYXN0ZScsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRDYXJkTnVtYmVyKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbignaW5wdXQnLCBzZXRDYXJkVHlwZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLnJlc3RyaWN0TnVtZXJpYyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgICB0aGlzLm9uKCdwYXN0ZScsIHJlRm9ybWF0TnVtZXJpYyk7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXROdW1lcmljKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0TnVtZXJpYyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmNhcmRFeHBpcnlWYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJC5wYXltZW50LmNhcmRFeHBpcnlWYWwoJCh0aGlzKS52YWwoKSk7XG4gIH07XG5cbiAgJC5wYXltZW50LmNhcmRFeHBpcnlWYWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBtb250aCwgcHJlZml4LCB5ZWFyLCBfcmVmO1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICBfcmVmID0gdmFsdWUuc3BsaXQoJy8nLCAyKSwgbW9udGggPSBfcmVmWzBdLCB5ZWFyID0gX3JlZlsxXTtcbiAgICBpZiAoKHllYXIgIT0gbnVsbCA/IHllYXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMiAmJiAvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICBwcmVmaXggPSAobmV3IERhdGUpLmdldEZ1bGxZZWFyKCk7XG4gICAgICBwcmVmaXggPSBwcmVmaXgudG9TdHJpbmcoKS5zbGljZSgwLCAyKTtcbiAgICAgIHllYXIgPSBwcmVmaXggKyB5ZWFyO1xuICAgIH1cbiAgICBtb250aCA9IHBhcnNlSW50KG1vbnRoLCAxMCk7XG4gICAgeWVhciA9IHBhcnNlSW50KHllYXIsIDEwKTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgeWVhcjogeWVhclxuICAgIH07XG4gIH07XG5cbiAgJC5wYXltZW50LnZhbGlkYXRlQ2FyZE51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBfcmVmO1xuICAgIG51bSA9IChudW0gKyAnJykucmVwbGFjZSgvXFxzK3wtL2csICcnKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QobnVtKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICBpZiAoIWNhcmQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIChfcmVmID0gbnVtLmxlbmd0aCwgX19pbmRleE9mLmNhbGwoY2FyZC5sZW5ndGgsIF9yZWYpID49IDApICYmIChjYXJkLmx1aG4gPT09IGZhbHNlIHx8IGx1aG5DaGVjayhudW0pKTtcbiAgfTtcblxuICAkLnBheW1lbnQudmFsaWRhdGVDYXJkRXhwaXJ5ID0gZnVuY3Rpb24obW9udGgsIHllYXIpIHtcbiAgICB2YXIgY3VycmVudFRpbWUsIGV4cGlyeSwgX3JlZjtcbiAgICBpZiAodHlwZW9mIG1vbnRoID09PSAnb2JqZWN0JyAmJiAnbW9udGgnIGluIG1vbnRoKSB7XG4gICAgICBfcmVmID0gbW9udGgsIG1vbnRoID0gX3JlZi5tb250aCwgeWVhciA9IF9yZWYueWVhcjtcbiAgICB9XG4gICAgaWYgKCEobW9udGggJiYgeWVhcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbW9udGggPSAkLnRyaW0obW9udGgpO1xuICAgIHllYXIgPSAkLnRyaW0oeWVhcik7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KG1vbnRoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoeWVhcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCEoKDEgPD0gbW9udGggJiYgbW9udGggPD0gMTIpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoeWVhci5sZW5ndGggPT09IDIpIHtcbiAgICAgIGlmICh5ZWFyIDwgNzApIHtcbiAgICAgICAgeWVhciA9IFwiMjBcIiArIHllYXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB5ZWFyID0gXCIxOVwiICsgeWVhcjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHllYXIubGVuZ3RoICE9PSA0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGV4cGlyeSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKTtcbiAgICBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSAtIDEpO1xuICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSArIDEsIDEpO1xuICAgIHJldHVybiBleHBpcnkgPiBjdXJyZW50VGltZTtcbiAgfTtcblxuICAkLnBheW1lbnQudmFsaWRhdGVDYXJkQ1ZDID0gZnVuY3Rpb24oY3ZjLCB0eXBlKSB7XG4gICAgdmFyIGNhcmQsIF9yZWY7XG4gICAgY3ZjID0gJC50cmltKGN2Yyk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGN2YykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2FyZCA9IGNhcmRGcm9tVHlwZSh0eXBlKTtcbiAgICBpZiAoY2FyZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gX3JlZiA9IGN2Yy5sZW5ndGgsIF9faW5kZXhPZi5jYWxsKGNhcmQuY3ZjTGVuZ3RoLCBfcmVmKSA+PSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3ZjLmxlbmd0aCA+PSAzICYmIGN2Yy5sZW5ndGggPD0gNDtcbiAgICB9XG4gIH07XG5cbiAgJC5wYXltZW50LmNhcmRUeXBlID0gZnVuY3Rpb24obnVtKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgaWYgKCFudW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKChfcmVmID0gY2FyZEZyb21OdW1iZXIobnVtKSkgIT0gbnVsbCA/IF9yZWYudHlwZSA6IHZvaWQgMCkgfHwgbnVsbDtcbiAgfTtcblxuICAkLnBheW1lbnQuZm9ybWF0Q2FyZE51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBncm91cHMsIHVwcGVyTGVuZ3RoLCBfcmVmO1xuICAgIG51bSA9IG51bS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcihudW0pO1xuICAgIGlmICghY2FyZCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG4gICAgdXBwZXJMZW5ndGggPSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICBudW0gPSBudW0uc2xpY2UoMCwgdXBwZXJMZW5ndGgpO1xuICAgIGlmIChjYXJkLmZvcm1hdC5nbG9iYWwpIHtcbiAgICAgIHJldHVybiAoX3JlZiA9IG51bS5tYXRjaChjYXJkLmZvcm1hdCkpICE9IG51bGwgPyBfcmVmLmpvaW4oJyAnKSA6IHZvaWQgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JvdXBzID0gY2FyZC5mb3JtYXQuZXhlYyhudW0pO1xuICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGdyb3Vwcy5zaGlmdCgpO1xuICAgICAgZ3JvdXBzID0gJC5ncmVwKGdyb3VwcywgZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbjtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGdyb3Vwcy5qb2luKCcgJyk7XG4gICAgfVxuICB9O1xuXG4gICQucGF5bWVudC5mb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihleHBpcnkpIHtcbiAgICB2YXIgbW9uLCBwYXJ0cywgc2VwLCB5ZWFyO1xuICAgIHBhcnRzID0gZXhwaXJ5Lm1hdGNoKC9eXFxEKihcXGR7MSwyfSkoXFxEKyk/KFxcZHsxLDR9KT8vKTtcbiAgICBpZiAoIXBhcnRzKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIG1vbiA9IHBhcnRzWzFdIHx8ICcnO1xuICAgIHNlcCA9IHBhcnRzWzJdIHx8ICcnO1xuICAgIHllYXIgPSBwYXJ0c1szXSB8fCAnJztcbiAgICBpZiAoeWVhci5sZW5ndGggPiAwKSB7XG4gICAgICBzZXAgPSAnIC8gJztcbiAgICB9IGVsc2UgaWYgKHNlcCA9PT0gJyAvJykge1xuICAgICAgbW9uID0gbW9uLnN1YnN0cmluZygwLCAxKTtcbiAgICAgIHNlcCA9ICcnO1xuICAgIH0gZWxzZSBpZiAobW9uLmxlbmd0aCA9PT0gMiB8fCBzZXAubGVuZ3RoID4gMCkge1xuICAgICAgc2VwID0gJyAvICc7XG4gICAgfSBlbHNlIGlmIChtb24ubGVuZ3RoID09PSAxICYmIChtb24gIT09ICcwJyAmJiBtb24gIT09ICcxJykpIHtcbiAgICAgIG1vbiA9IFwiMFwiICsgbW9uO1xuICAgICAgc2VwID0gJyAvICc7XG4gICAgfVxuICAgIHJldHVybiBtb24gKyBzZXAgKyB5ZWFyO1xuICB9O1xuXG59KS5jYWxsKHRoaXMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3ZlbmRvci9qcXVlcnkucGF5bWVudC9saWIvanF1ZXJ5LnBheW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxNDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA2XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWN0aW9uXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpdGxlX3N0cmlwZVwifSxcImZcIjpbXCJQYXltZW50IERldGFpbHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcImZvbnQtc2l6ZTogMThweDsgdGV4dC1hbGlnbjogY2VudGVyOyBtYXJnaW46IDIwcHggMCAwOyBmb250LXdlaWdodDogNjAwO1wifSxcImZcIjpbXCJQYXlhYmxlIEFtb3VudDogXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmN1cnJlbmN5XCJdLFwic1wiOlwiXzAoXzEsXzIpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJwYXltZW50IHVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3RlcC5zdWJtaXR0aW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGFjY29yZGlvblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiYWN0X3RpdGxlXCIsXCJjbGFzc1wiOltcInRpdGxlIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19XX0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiW1xcXCJib29raW5nLnBheW1lbnQuYWN0aXZlXFxcIiwxIT1fMD8xOi0xXVwifX19LFwiZlwiOltcIkNyZWRpdCBDYXJkIFwiLHtcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJhbmdsZSBkb3duIGljb25cIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiY29udF9hY2NvcmRcIixcImNsYXNzXCI6W1wiY29udGVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjE9PV8wXCJ9fV19LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImNhcmRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJhY3RfdGl0bGVcIixcImNsYXNzXCI6W1widGl0bGUgXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIyPT1fMFwifX1dfSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCJbXFxcImJvb2tpbmcucGF5bWVudC5hY3RpdmVcXFwiLDIhPV8wPzI6LTFdXCJ9fX0sXCJmXCI6W1wiRGViaXQgQ2FyZCBcIix7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiYW5nbGUgZG93biBpY29uXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcImNvbnRfYWNjb3JkXCIsXCJjbGFzc1wiOltcImNvbnRlbnQgXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIyPT1fMFwifX1dfSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJjYXJkXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiYWN0X3RpdGxlXCIsXCJjbGFzc1wiOltcInRpdGxlIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMz09XzBcIn19XX0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiW1xcXCJib29raW5nLnBheW1lbnQuYWN0aXZlXFxcIiwzIT1fMD8zOi0xXVwifX19LFwiZlwiOltcIk5ldCBCYW5raW5nIFwiLHtcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJhbmdsZSBkb3duIGljb25cIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiY29udF9hY2NvcmRcIixcImNsYXNzXCI6W1wiY29udGVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjM9PV8wXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmb3JtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJiYW5rIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W1wiU2VsZWN0IFlvdXIgQmFua1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwiYmFuayBmbHVpZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJuZXRiYW5raW5nLm5ldF9iYW5raW5nXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMubmV0X2JhbmtpbmdcIn1dLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImJhbmtzXCJ9XX19XX1dfSxcIiBcIix7XCJ0XCI6OCxcInJcIjpcImNvbnRhY3RcIn1dfV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmFjdGl2ZVwifV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuc3RlcHMuM1wiLFwiYm9va2luZy5wYXltZW50LmNjXCIsXCJib29raW5nLnBheW1lbnQubmV0YmFua2luZ1wiLFwiYm9va2luZy5wYXltZW50LmFjdGl2ZVwiXSxcInNcIjpcIntzdGVwOl8wLGNjOl8xLG5ldGJhbmtpbmc6XzIsYWN0aXZlOl8zfVwifX0sXCIgXCJdLFwicFwiOntcImNhcmRcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBodWdlIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdGVwLmVycm9ycy5jY1wifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZm9ybVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W1wiVXNlIHNhdmVkIGNhcmRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGxpc3RcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRDYXJkXCIsXCJhXCI6e1wiclwiOltcIi5cIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibnVtYmVyXCIsXCJzXCI6dHJ1ZX1dfV19XSxcIm5cIjo1MixcInJcIjpcImNhcmRzXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiY2FyZHNcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifV0sXCJuXCI6NTAsXCJyXCI6XCJjYXJkc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmb3JtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlc2V0Q0NcIixcImFcIjp7XCJyXCI6W1wiZXZlbnRcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiQ3JlZGl0XCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLnBheW1lbnQuYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIkRlYml0XCJdLFwieFwiOntcInJcIjpbXCJib29raW5nLnBheW1lbnQuYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LFwiIENhcmQgTnVtYmVyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWNjXCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwiY2FyZC1udW1iZXIgZmx1aWRcIixcImNjdHlwZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLnR5cGVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5udW1iZXJcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5jYy5udW1iZXJcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZvcm1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W1wiRXhwaXJ5IERhdGVcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWV4cGlyeVwiLFwiYVwiOntcImNsYXNzXCI6XCJmbHVpZFwiLFwiaWRcIjpcImNjLWV4cFwiLFwiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJib29raW5nXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ1wifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5leHBfbW9udGhcIn0sXCIgLyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0WWVhclwiLFwiY2MuZXhwX3llYXJcIl0sXCJzXCI6XCJfMChfMSlcIn19XSxcIm5cIjo1MCxcInJcIjpcImNjLmlkXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMuY2MuZXhwX21vbnRoXCJ9XSxcInBsYWNlaG9sZGVyXCI6XCJNTSAvIFlZWVlcIn0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV0sXCJuXCI6NTAsXCJyXCI6XCJjYy5pZFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1leHBpcnlcIixcImFcIjp7XCJjbGFzc1wiOlwiZmx1aWRcIixcImlkXCI6XCJjYy1leHBcIixcImJvb2tpbmdcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nXCJ9XSxcInZhbHVlXCI6XCJcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMuY2MuZXhwX21vbnRoXCJ9XSxcInBsYWNlaG9sZGVyXCI6XCJNTSAvIFlZXCJ9LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dLFwiclwiOlwiY2MuaWRcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZm9ybVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbXCJDVlZcIl19LHtcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcImN2dlwiLFwic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL2N2di5wbmdcIixcImFsdFwiOlwiY3Z2XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWN2dlwiLFwiYVwiOntcImNsYXNzXCI6XCJmbHVpZFwiLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MudHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmN2dlwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLmNjLmN2dlwifV19fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBmb3JtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlc2V0Q0NcIixcImFcIjp7XCJyXCI6W1wiZXZlbnRcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiQ3JlZGl0XCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nLnBheW1lbnQuYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIkRlYml0XCJdLFwieFwiOntcInJcIjpbXCJib29raW5nLnBheW1lbnQuYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LFwiIENhcmQgSG9sZGVyIE5hbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmlkXCJ9XSxcImNsYXNzXCI6XCJjYXJkLW51bWJlciBmbHVpZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5uYW1lXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMuY2MubmFtZVwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcImNsYXNzXCI6XCJ2YWxpZGF0aW9uXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZm9ybSBlcnJvclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJzdGVwLmVycm9yc1wifV19XX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5lcnJvcnNcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZm9ybVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidHdvIGdyb3VwZWQgZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJmXCI6W1wiQXBwbHkgUHJvbW8gQ29kZXNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInByb21vY29kZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9tb2NvZGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIkVudGVyIFByb21vIENvZGVcIixcImRpc2FibGVkXCI6XCJkaXNhYmxlZFwifSxcImZcIjpbXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicHJvbW9jb2RlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb21vY29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgXCIsXCJwbGFjZWhvbGRlclwiOlwiRW50ZXIgUHJvbW8gQ29kZVwifSxcImZcIjpbXX1dLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZW1vdmVQcm9tb0NvZGVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIkFwcGxpZWRcIix7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwicmVkIHJlbW92ZSBjaXJjbGUgb3V0bGluZSBpY29uXCIsXCJhbHRcIjpcIlJlbW92ZSBQcm9tbyBDb2RlXCIsXCJ0aXRsZVwiOlwiUmVtb3ZlIFByb21vIENvZGVcIn19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBidXR0b25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJhcHBseVByb21vQ29kZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiQVBQTFlcIl19XSxcInhcIjp7XCJyXCI6W1wicHJvbW92YWx1ZVwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjpib3RoO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc21hbGwgZmllbGQgbmVnYXRpdmUgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZW1vdmVFcnJvck1zZ1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwicHJvbW9lcnJvclwifV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwcm9tb2Vycm9yXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmcuY2xpZW50U291cmNlSWRcIl0sXCJzXCI6XCJfMD09MVwifX1dfSxcIiBcIix7XCJ0XCI6OCxcInJcIjpcImNvbnRhY3RcIn1dfV0sXCJjb250YWN0XCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VjdGlvbiBkaXZpZGVyXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFncmVlbWVudCBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiYVwiOntcInN0eWxlXCI6XCJmb250LXNpemU6MTRweCFpbXBvcnRhbnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiY2hlY2tib3hcIixcImNoZWNrZWRcIjpbe1widFwiOjIsXCJyXCI6XCJhY2NlcHRlZFwifV19fSxcIiBJIGhhdmUgcmVhZCBhbmQgYWNjZXB0ZWQgdGhlIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvY21zL3Rlcm1zQW5kQ29uZGl0aW9ucy8yXCIsXCJ0YXJnZXRcIjpcIl9ibGFua1wifSxcImZcIjpbXCJUZXJtcyBPZiBTZXJ2aWNlXCJdfSxcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d28gY29sdW1uIHJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwicGF5X2Ftb3VudFwiLFwiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbXCJUb3RhbCBBbW91bnQ6XCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiaWRcIjpcInBheV9yc1wiLFwiY2xhc3NcIjpcImNvbHVtbiByaWdodCBhbGlnbmVkXCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xK18yLF8zKVwifX0sXCIgLSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInByb21vdmFsdWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xLF8yKVwifX0sXCIgPSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcImJvb2tpbmcucHJpY2VcIixcImJvb2tpbmcuY29udmVuaWVuY2VGZWVcIixcInByb21vdmFsdWVcIixcIm1ldGEuZGlzcGxheV9jdXJyZW5jeVwiXSxcInNcIjpcIl8wKF8xK18yLV8zLF80KVwifX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vdmFsdWVcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImlkXCI6XCJwYXlfcnNcIixcImNsYXNzXCI6XCJjb2x1bW4gcmlnaHQgYWxpZ25lZFwifSxcImZcIjpbe1widFwiOjMsXCJ4XCI6e1wiclwiOltcIm1vbmV5XCIsXCJib29raW5nLnByaWNlXCIsXCJib29raW5nLmNvbnZlbmllbmNlRmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMStfMixfMylcIn19XX1dLFwieFwiOntcInJcIjpbXCJwcm9tb3ZhbHVlXCJdLFwic1wiOlwiXzAhPW51bGxcIn19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3VyX2NvbmRcIn0sXCJmXCI6W1wiKFwiLHtcInRcIjoyLFwiclwiOlwiYm9va2luZy5jdXJyZW5jeVwifSxcIiBQcmljZSBpcyBpbmRpY2F0aXZlIG9ubHkuIFlvdSB3aWxsIGJlIGNoYXJnZWQgZXF1aXZhbGVudCBpbiBJTlIuIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjMsXCJ4XCI6e1wiclwiOltcImZvcm1hdFBheU1vbmV5XCIsXCJib29raW5nLnByaWNlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIilcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZy5jdXJyZW5jeVwiXSxcInNcIjpcIl8wIT1cXFwiSU5SXFxcIlwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcImJ0bl9wYXltZW50XCIsXCJjbGFzc1wiOlwiZmx1aWQgaHVnZSB1aSBncmVlbiBidXR0b25cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIlBBWSBOT1dcIl19XSxcIm5cIjo1MCxcInJcIjpcImFjY2VwdGVkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJidG5fcGF5bWVudFwiLFwiY2xhc3NcIjpcImZsdWlkIGh1Z2UgdWkgcmVkIGJ1dHRvblwifSxcImZcIjpbXCJQQVkgTk9XXCJdfV0sXCJyXCI6XCJhY2NlcHRlZFwifV19fTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2ZsaWdodHMvYm9va2luZy9zdGVwMy5odG1sXG4gKiogbW9kdWxlIGlkID0gMTQ1XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCdqcXVlcnkucGF5bWVudCcpO1xyXG5cclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi4vaW5wdXQnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NjLmh0bWwnKSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkucGF5bWVudCgnZm9ybWF0Q2FyZE51bWJlcicpO1xyXG5cclxuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ2NjdHlwZScsICQucGF5bWVudC5jYXJkVHlwZSh2YWx1ZSkpO1xyXG4gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdkZXN0cm95Jyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vY2MvbnVtYmVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTQ2XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgNlxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgaW5wdXQgXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcImVycm9yXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjbGFzc2VzXCIsXCJzdGF0ZVwiLFwibGFyZ2VcIixcInZhbHVlXCJdLFwic1wiOlwiXzAoXzEsXzIsXzMpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcGxhY2Vob2xkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJsYXJnZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJ0ZXh0XCJdLFwiblwiOjUwLFwiclwiOlwiZGlzYWJsZWRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widGVsXCJdLFwiclwiOlwiZGlzYWJsZWRcIn1dLFwibmFtZVwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJwbGFjZWhvbGRlcj1cXFwiXCIse1widFwiOjIsXCJyXCI6XCJwbGFjZWhvbGRlclwifSxcIlxcXCJcIl0sXCJuXCI6NTEsXCJyXCI6XCJsYXJnZVwifSx7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcImRpc2FibGVkXCJ9LHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0YXRlLmRpc2FibGVkXCIsXCJzdGF0ZS5zdWJtaXR0aW5nXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRMaXN0IGNsZWFyRml4IGZMZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJjYXJkVHlwZSBcIix7XCJ0XCI6MixcInJcIjpcImNjdHlwZVwifV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImNjdHlwZVwifV19XX1dLFwiblwiOjUwLFwiclwiOlwiY2N0eXBlXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRMaXN0IGNsZWFyRml4IGZMZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRUeXBlIHZpc2FcIn0sXCJmXCI6W1wiVmlzYVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSBtYXN0ZXJcIn0sXCJmXCI6W1wiTWFzdGVyY2FyZFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSBhbWV4XCJ9LFwiZlwiOltcIkFtZXJpY2FuIEV4cHJlc3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FyZFR5cGUgZGluZXJzXCJ9LFwiZlwiOltcIkRpbmVyc1wiXX1dfV0sXCJyXCI6XCJjY3R5cGVcIn1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NjLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxNDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA2XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnanF1ZXJ5LnBheW1lbnQnKTtcclxuXHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4uL2lucHV0JyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgdHlwZTogJ3RlbCdcclxuICAgICAgICAgICAvLyB0eXBlOiAncGFzc3dvcmQnXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkucGF5bWVudCgnZm9ybWF0Q2FyZENWQycpO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdkZXN0cm95Jyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vY2MvY3Z2LmpzXG4gKiogbW9kdWxlIGlkID0gMTQ4XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgNlxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJ2pxdWVyeS5wYXltZW50Jyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuLi9pbnB1dCcpLFxyXG4gICAgICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgdHlwZTogJ3RlbCdcclxuICAgICAgICAgICAvLyB0eXBlOiAncGFzc3dvcmQnXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuICAgICAgICB2YXIgdmlldz10aGlzO1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdmb3JtYXRDYXJkRXhwaXJ5Jyk7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLmtleXVwKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgYm9va2luZyA9IHZpZXcuZ2V0KCdib29raW5nJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGNhcmRleHBpcnk9JCh2aWV3LmZpbmQoJ2lucHV0JykpLnZhbCgpO1xyXG4gICAgIC8vICAgY29uc29sZS5sb2coY2FyZGV4cGlyeSk7XHJcbiAgICAgICAgaWYoY2FyZGV4cGlyeSAhPW51bGwgJiYgY2FyZGV4cGlyeSAhPScnKXtcclxuICAgICAgICAgICAgY2FyZGV4cGlyeS5yZXBsYWNlKC8gL2csJycpO1xyXG4gICAgICAgICAgICB2YXIgY2FyZGFycj1jYXJkZXhwaXJ5LnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgIGlmKGNhcmRhcnJbMF0hPSBudWxsKXtcclxuICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MuZXhwX21vbnRoJyxfLnBhcnNlSW50KGNhcmRhcnJbMF0pKTt9XHJcbiAgICAgICAgaWYoY2FyZGFyclsxXSE9IG51bGwpe1xyXG4gICAgICAgICAgICB2YXIgbGVuPWNhcmRhcnJbMV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgY2FyZHllYXI9Xy5wYXJzZUludChjYXJkYXJyWzFdKTtcclxuICAgICAgICAgICAgaWYoY2FyZHllYXI8MTAwKXtcclxuICAgICAgICAgICAgICAgIGNhcmR5ZWFyPTIwMDArY2FyZHllYXI7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKGNhcmR5ZWFyPDEwMDApe1xyXG4gICAgICAgICAgICAgICAgY2FyZHllYXI9MjAwMCtjYXJkeWVhcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgIGNvbnNvbGUubG9nKGNhcmR5ZWFyKTtcclxuICAgICAgICAgICAgYm9va2luZy5zZXQoJ3BheW1lbnQuY2MuZXhwX3llYXInLGNhcmR5ZWFyKTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Rlc3Ryb3knKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9jYy9jYXJkZXhwaXJ5LmpzXG4gKiogbW9kdWxlIGlkID0gMTQ5XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG5cclxuICAgIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JykoKSxcclxuICAgIGhfZHVyYXRpb24gPSByZXF1aXJlKCdoZWxwZXJzL2R1cmF0aW9uJykoKSxcclxuICAgIGhfZGF0ZSA9IHJlcXVpcmUoJ2hlbHBlcnMvZGF0ZScpKClcclxuICAgIDtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDQuaHRtbCcpLFxyXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nZXQoJ2Jvb2tpbmcnKS5hY3RpdmF0ZSgzKTtcclxuICAgIH0sXHJcbiAgICAgICAgXHJcbiAgIH0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvYm9va2luZy9zdGVwNC5qc1xuICoqIG1vZHVsZSBpZCA9IDE1MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6XCJ1aSBmb3JtIHNlZ21lbnQgc3RlcDRcIixcInN0eWxlXCI6XCJoZWlnaHQ6IDQwMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va2luZy1pZFwifSxcImZcIjpbXCJCb29raW5nIElEOiBcIix7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcuYWlyY2FydF9pZFwifV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtZXNzYWdlXCJ9LFwiZlwiOltcIldlIGhhdmUgcmVjZWl2ZWQgeW91ciBQYXltZW50IGFuZCB5b3VyIEJvb2tpbmcgaXMgaW4gcHJvY2Vzcywgb3VyIGN1c3RvbWVyIHN1cHBvcnQgdGVhbSB3aWxsIGNvbnRhY3QgeW91IHNob3J0bHkuIE9yIENhbGwgb3VyIGN1c3RvbWVyIHN1cHBvcnQgdGVhbSBmb3IgbW9yZSBkZXRhaWwuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvbXlib29raW5ncy9cIix7XCJ0XCI6MixcInJcIjpcImJvb2tpbmcuYWlyY2FydF9pZFwifV19LFwiZlwiOltcIlZpZXcgeW91ciB0aWNrZXRcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYm9va2luZ1wiLFwiYm9va2luZy5haXJjYXJ0X3N0YXR1c1wiXSxcInNcIjpcIl8wLmlzTmV3KF8xKVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtZXNzYWdlXCJ9LFwiZlwiOltcIllvdXIgQm9va2luZyBpcyBTdWNjZXNzZnVsIVwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nXCIsXCJib29raW5nLmFpcmNhcnRfc3RhdHVzXCJdLFwic1wiOlwiXzAuaXNCb29rZWQoXzEpXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibWVzc2FnZVwifSxcImZcIjpbXCJZb3VyIEJvb2tpbmcgaXMgaW4gcHJvY2VzcyFcIl19XSxcInhcIjp7XCJyXCI6W1wiYm9va2luZ1wiLFwiYm9va2luZy5haXJjYXJ0X3N0YXR1c1wiXSxcInNcIjpcIl8wLmlzQm9va2VkKF8xKVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6W1wiL2IyYy9haXJDYXJ0L215Ym9va2luZ3MvXCIse1widFwiOjIsXCJyXCI6XCJib29raW5nLmFpcmNhcnRfaWRcIn1dfSxcImZcIjpbXCJWaWV3IHlvdXIgdGlja2V0XCJdfV0sXCJ4XCI6e1wiclwiOltcImJvb2tpbmdcIixcImJvb2tpbmcuYWlyY2FydF9zdGF0dXNcIl0sXCJzXCI6XCJfMC5pc05ldyhfMSlcIn19XSxcIm5cIjo1MCxcInJcIjpcInN0ZXAuY29tcGxldGVkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBhY3RpdmUgaW52ZXJ0ZWQgZGltbWVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0ZXh0IGxvYWRlclwifSxcImZcIjpbXCJZb3VyIGJvb2tpbmcgaXMgaW4gcHJvZ3Jlc3MuXCJdfV19XSxcInJcIjpcInN0ZXAuY29tcGxldGVkXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwic3RlcC5hY3RpdmVcIn1dLFwieFwiOntcInJcIjpbXCJib29raW5nLnN0ZXBzLjRcIl0sXCJzXCI6XCJ7c3RlcDpfMH1cIn19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL2Jvb2tpbmcvc3RlcDQuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDE1MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGVzcy9tb2JpbGUvZmxpZ2h0cy5sZXNzXG4gKiogbW9kdWxlIGlkID0gMTUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgNlxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=