webpackJsonp([10],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(393);


/***/ },

/***/ 69:
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

/***/ 70:
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

/***/ 80:
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

/***/ 81:
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

/***/ 94:
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

/***/ 98:
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

/***/ 99:
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

/***/ 100:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui input ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"input","a":{"type":[{"t":4,"f":["text"],"n":50,"r":"disabled"},{"t":4,"n":51,"f":["tel"],"r":"disabled"}],"name":[{"t":2,"r":"name"}],"value":[{"t":2,"r":"value"}]},"m":[{"t":4,"f":["placeholder=\"",{"t":2,"r":"placeholder"},"\""],"n":51,"r":"large"},{"t":4,"f":["disabled"],"n":50,"r":"disabled"},{"t":4,"f":["disabled=\"disabled\""],"n":50,"x":{"r":["state.disabled","state.submitting"],"s":"_0||_1"}}]}," ",{"t":4,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":["cardType ",{"t":2,"r":"cctype"}]},"f":[{"t":2,"r":"cctype"}]}]}],"n":50,"r":"cctype"},{"t":4,"n":51,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":"cardType visa"},"f":["Visa"]}," ",{"t":7,"e":"li","a":{"class":"cardType master"},"f":["Mastercard"]}," ",{"t":4,"f":[{"t":7,"e":"li","a":{"class":"cardType rupay"},"f":["Rupay"]}],"n":50,"x":{"r":["cardType"],"s":"1!=_0&&5!=_0"}}," ",{"t":4,"f":[{"t":7,"e":"li","a":{"class":"cardType amex"},"f":["American Express"]}," ",{"t":7,"e":"li","a":{"class":"cardType diners"},"f":["Diners"]}],"n":50,"x":{"r":["cardType"],"s":"1==_0||5==_0"}}]}],"r":"cctype"}]}]};

/***/ },

/***/ 101:
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

/***/ 393:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(33)
	    ;
	
	var Payment = __webpack_require__(394)
	    ;
	
	__webpack_require__(398);
	
	$(function() {
	    var payment = new Payment();
	    payment.set('payment', $('[data-payment]').data('payment'));
	    //console.log($('[data-payment]').data('payment'));
	    //console.log(payment.get('payment'));
	    payment.render('#app');
	});

/***/ },

/***/ 394:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(26),
	    _ = __webpack_require__(30)
	    ;
	
	var Form = __webpack_require__(34),
	    Meta = __webpack_require__(68),
	    Auth = __webpack_require__(80)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(395),
	
	    components: {
	        'layout': __webpack_require__(72),
	        'payment-form': __webpack_require__(396)
	    },
	
	    partials: {
	        'base-panel': __webpack_require__(105)
	    },
	
	    onconfig: function () {
	        Meta.instance()
	            .then(function (meta) { return this.set('meta', meta); }.bind(this))
	    },
	
	    signin: function() {
	        var view = this;
	        Auth.login()
	            .then(function(data) {
	                window.location.reload();
	            });
	    },
	
	    leftMenu: function() {
	        this.toggle('leftmenu');
	        //var flag=this.toggle('leftmenu'); this.set('leftmenu', !flag);
	    }
	});

/***/ },

/***/ 395:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":7,"e":"payment-form","a":{"payment":[{"t":2,"r":"payment"}],"meta":[{"t":2,"r":"meta"}]}}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 396:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	        $ = __webpack_require__(33)
	        ;
	
	var Form = __webpack_require__(34),
	        h_money = __webpack_require__(69),
	        h_duration = __webpack_require__(81)(),
	        h_date = __webpack_require__(94)()
	        ;
	
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
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(397),
	
	    components: {
	        'ui-cc': __webpack_require__(98),
	        'ui-cvv': __webpack_require__(101)
	    },
	
	    data: function () {
	        return {
	            active: 1,
	            cc: {
	                store: 1
	            },
	            accepted: true,
	            money: h_money,
	            duration: h_duration,
	            date: h_date,
	            banks: [
	
	                {id: 'AXIB', text: 'AXIS Bank', logo: 'axis_bank'}, // {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
	                {id: '1045', text: 'Bank of Baroda Corporate', logo: 'bank_of_baroda'},
	                {id: '1046', text: 'Bank of Baroda Retail', logo: 'bank_of_baroda'},
	                {id: 'BOIB', text: 'Bank of India', logo: 'bank_of_india'}, //Payu {id: 'BOIB' , text: 'Bank of India' }, Atom {id: '1012' , text: 'Bank of India' },
	                {id: 'BOMB', text: 'Bank of Maharashtra', logo: 'bank_of_maharashtra'}, //Payu {id: 'BOMB', text: 'Bank of Maharashtra'},
	                {id: '1030', text: 'Canara Bank NetBanking', logo: 'canara_bank'}, //{id: 'CABB', text: 'Canara Bank'},
	                {id: '1034', text: 'Canara Bank DebitCard', logo: 'canara_bank'},
	                {id: 'CSBN', text: 'Catholic Syrian Bank', logo: 'catholic_syrian_bank'},
	                {id: 'CBIB', text: 'Central Bank Of India', logo: 'central_bank_of_india'}, //{id: 'CBIB', text: 'Central Bank Of India'},
	                {id: '1020', text: 'City Union Bank', logo: 'city_union_bank'}, //{id: 'CUBB', text: 'CityUnion'},
	                /*{id: 'CITNB', text: 'Citi Bank NetBanking' , logo: 'citi_bank_netbanking'},*/
	                {id: 'CRPB', text: 'Corporation Bank', logo: 'corporation_bank'}, //{id: 'CRPB', text: 'Corporation Bank'},
	                {id: '1047', text: 'DBS Bank Ltd', logo: 'dsb_bank'},
	                {id: '1042', text: 'DCB Bank Business', logo: 'dcb_bank'}, //{id: 'DCBB', text: 'Development Credit Bank'},
	                {id: '1027', text: 'DCB Bank Personal', logo: 'dcb_bank'},
	                {id: 'DSHB', text: 'Deutsche Bank', logo: 'deutsche_bank'}, //{id: 'DSHB', text: 'Deutsche Bank'},
	                {id: 'DLSB', text: 'Dhanlaxmi Bank', logo: 'dhanlakshmi_bank'},
	                {id: 'FEDB', text: 'Federal Bank', logo: 'federal_bank'}, //{id: 'FEDB', text: 'Federal Bank'},
	                {id: 'HDFB', text: 'HDFC Bank', logo: 'hdfc_bank'},
	                {id: 'ICIB', text: 'ICICI Netbanking', logo: 'icici_bank'},
	                {id: 'IDBB', text: 'IDBI Bank', logo: 'idbi_bank'}, //{id: 'IDBB', text: 'Industrial Development Bank of India'},
	                {id: 'INDB', text: 'Indian Bank ', logo: 'indian_bank'}, //{id: 'INDB', text: 'Indian Bank '},
	                {id: 'INIB', text: 'IndusInd Bank', logo: 'indusind_bank'}, //{id: 'INIB', text: 'IndusInd Bank'},
	                {id: 'INOB', text: 'Indian Overseas Bank', logo: 'indian_overseas_bank'}, //{id: 'INOB', text: 'Indian Overseas Bank'},
	                {id: 'JAKB', text: 'Jammu and Kashmir Bank', logo: 'j_k_bank'}, //{id: 'JAKB', text: 'Jammu and Kashmir Bank'},
	                {id: 'KRKB', text: 'Karnataka Bank', logo: 'karnataka_bank'}, //{id: 'KRKB', text: 'Karnataka Bank'},
	                {id: '1018', text: 'Karur Vysya ', logo: 'karur_vysya'}, //{id: 'KRVB', text: 'Karur Vysya '},
	                {id: '162B', text: 'Kotak Mahindra Bank', logo: 'kotak_mahindra_bank'}, //{id: '162B', text: 'Kotak Bank'}
	                {id: '1009', text: 'Lakshmi Vilas Bank NetBanking', logo: 'lakshmi_vilas'},
	                {id: 'OBCB', text: 'Oriental Bank Of Commerce', logo: 'obc'},
	                {id: 'PSBNB', text: 'Punjab And Sind Bank', logo: 'punjab_sindh_bank'}, //{id: 'PSBNB', text: 'Punjab And Sind Bank'},
	                {id: 'PNBB', text: 'Punjab National Bank – Retail', logo: 'pnb_retail'},
	                /*{id: '1050', text: 'Royal Bank Of Scotland' , logo: 'royal_bank_scotland'},
	                 {id: '1053', text: 'SaraSwat Bank' , logo: 'saraswat_bank'},*/
	                {id: '1051', text: 'Standard Chartered Bank', logo: 'standard_chartered'},
	                {id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur', logo: 'sbbj'}, //{id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
	                {id: 'SBHB', text: 'State Bank of Hyderabad', /*logo: 'sbhb'*/}, //{id: 'SBHB', text: 'State Bank of Hyderabad'},
	                {id: 'SBIB', text: 'State Bank of India', logo: 'sbib'}, //{id: 'SBIB', text: 'State Bank of India'},
	                {id: 'SBMB', text: 'State Bank of Mysore', /*logo: 'sbmb'*/}, //{id: 'SBMB', text: 'State Bank of Mysore'},
	                {id: 'SBPB', text: 'State Bank of Patiala', logo: 'sbpb'}, //{id: 'SBPB', text: 'State Bank of Patiala'},
	                {id: 'SBTB', text: 'State Bank of Travancore', /*logo: 'sbtb'*/}, //{id: 'SBTB', text: 'State Bank of Travancore'},
	                {id: 'SOIB', text: 'South Indian Bank', logo: 'south_indian_bank'}, //{id: 'SOIB', text: 'South Indian Bank'},
	                {id: 'UBIB', text: 'Union Bank of India', logo: 'union_bank_of_india'},
	                {id: 'UNIB', text: 'United Bank Of India', logo: 'united_bank'}, //{id: 'UNIB', text: 'United Bank Of India'},
	                {id: 'VJYB', text: 'Vijaya Bank', logo: 'vijya_bank'}, //{id: 'VJYB', text: 'Vijaya Bank'},
	                {id: 'YESB', text: 'Yes Bank', logo: 'yes_bank'}, //{id: 'YESB', text: 'Yes Bank'},
	                {id: 'TMBB', text: 'Tamilnad Mercantile Bank', logo: 't_m_bank'},
	                {id: '1016', text: 'Union Bank', logo: 'union_bank'},
	                        //    {id: '2001', text: ' ATOM Test bank'},
	
	            ],
	            wallets: [
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
	                return year.slice(-2);
	                ;
	            },
	        }
	    },
	
	    onconfig: function () {
	        var view = this;
	
	        $.ajax({
	            type: 'GET',
	            url: '/b2c/booking/cards',
	            data: {},
	            success: function (data) {
	                if (data.length) {
	                    view.set('cards', data);
	                    //view.setCard(data[data.length - 1]);
	                }
	            }
	        });
	
	        this.observe('active', function () {
	            view.clearForm();
	            this.set('form.errors', false);
	        }, {init: false});
	    },
	
	    submit: function () {
	        var view = this,
	                data = {id: this.get('payment.id')}
	
	        view.set('form.submitting', true);
	        view.set('form.errors', {});
	
	
	        if (3 == this.get('active')) {
	            data.netbanking = this.get('netbanking');
	        } else if (4 == this.get('active')) {
	            data.wallet = this.get('wallet');
	        } else if (5 == this.get('active')) {
	            data.CCAvenueEmi = this.get('emi');
	            data.CCAvenueEmi.category = 'EMI';
	        } else if (6 == this.get('active')) {
	            data.UPI = this.get('booking.payment.upi');
	            data.category = 'upi';
	        } else {
	            data.cc = this.get('cc');
	            data.cc.store = data.cc.store ? 1 : 0;
	        }
	
	        $.ajax({
	            timeout: 60000,
	            type: 'POST',
	            url: '/b2c/booking/payment',
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
	                view.set('form.submitting', false);
	
	                try {
	                    var response = JSON.parse(xhr.responseText);
	
	
	                    if (response.errors) {
	                        view.set('form.errors', response.errors);
	                    } else {
	                        if (response.message) {
	                            view.set('form.errors', [response.message]);
	                        }
	                    }
	
	
	                } catch (e) {
	                    view.set('form.errors', ['Server returned error. Please try again later']);
	                }
	            }
	        });
	
	
	        //return deferred.promise;
	    },
	    clearForm: function () {
	        this.set('cc', {});
	        this.set('netbanking', {});
	    },
	    setCard: function (cc) {
	        if (this.get('cc.id') !== cc.id) {
	            this.set('cc', cc);
	        } else {
	            this.set('cc', {});
	        }
	
	    },
	
	    resetCC: function (event) {
	        var e = event.original,
	                el = $(e.srcElement),
	                id = this.get('cc.id'),
	                yup = 0 == el.parents('.ui.input.cvv').size() && (('INPUT' == el[0].tagName) || el.hasClass('dropdown') || el.parents('.ui.dropdown').size());
	
	        if (id && yup) {
	            this.set('cc', {});
	        }
	    },
	    CCAvenueEMI: function () {
	        var view = this,
	                response,
	                jsonData,
	                payment,
	                total,
	                jsonData, plans_emi
	                ;
	        payment = view.get('payment');
	        total = payment.amount;
	        response = $.ajax({
	            type: 'POST',
	            data: {total_amount: total, emi_flag: 'fare_difference'},
	            url: '/b2c/Booking/CCAvenueEMI',
	        });
	        response.done(function (data) {
	            if (data != '') {
	                try {
	                    jsonData = JSON.parse(data);
	                } catch (e) {
	                    return false;
	                }
	                view.set('emiOptions', jsonData);
	                $.each(jsonData, function (index, value) {
	                    if (value.payOpt == 'OPTEMI') {
	                        view.set('emiPaymentReady', true);
	                        view.set('emi.payment_option', value.payOpt);
	                        view.set('emi_banks', JSON.parse(value.EmiBanks));
	                        plans_emi = JSON.parse(value.EmiPlans);
	                        $.each(plans_emi, function (index1, value1) {
	                            value1.emiAmount = value1.emiAmount.toFixed(2);
	                            value1.total = value1.total.toFixed(2);
	                        });
	                        view.set('emi_plans', plans_emi);
	                    }
	                });
	            }
	        });
	        response.error(function (data) {
	            view.set('emi_unavailable', data.responseJSON.message);
	        });
	    },
	    showEmiPlans: function () {
	        var view = this;
	        view.set('selectedPlan', $("#emi_banks").val());
	        view.set('emi.planId', $("#emi_banks").val());
	        view.set('showEmiPlans', true);
	    },
	    showCardFields: function () {
	        var view = this;
	        $.each(view.get('emi_plans'), function (index, value) {
	            if (value.planId == view.get('emi.planId')) {
	                view.set('emi.emi_tenure_id', value.tenureId);
	                view.set('emi.currency', value.currency);
	            }
	        });
	        view.set('readyCardFields', true);
	    },
	    oncomplete: function () {
	        var view = this;
	        view.CCAvenueEMI();
	    }
	
	
	});

/***/ },

/***/ 397:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment payment ",{"t":4,"f":["error"],"n":50,"r":"form.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"form.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"div","a":{"class":"ui block header"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":2,"r":"payment.client"}," ",{"t":7,"e":"div","a":{"class":"sub header"},"f":[{"t":2,"r":"payment.reason"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"pay_div_left"},"f":[{"t":7,"e":"div","a":{"class":"div_left_source"},"f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"1==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",1]"}}},"f":["CREDIT CARD"]}," ",{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"2==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",2]"}}},"f":["DEBIT CARD"]}," ",{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"3==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",3]"}}},"f":["NET BANKING"]}," ",{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"4==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",4]"}}},"f":["WALLET"]}," ",{"t":4,"f":[{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"5==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",5]"}}},"f":["EMI"]}],"n":50,"r":"emiPaymentReady"}," ",{"t":7,"e":"li","m":[{"t":4,"f":["class=\"payment_highlight\""],"n":50,"x":{"r":["active"],"s":"6==_0"}}],"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",6]"}}},"f":["UPI"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"pay_div_right"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"credit-card"},"f":[{"t":7,"e":"div","a":{"class":"ui two column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"v":{"click":{"m":"resetCC","a":{"r":["event"],"s":"[_0]"}}},"f":[{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":[{"t":4,"f":["Credit"],"n":50,"x":{"r":["active"],"s":"1==_0"}},{"t":4,"n":51,"f":["Debit"],"x":{"r":["active"],"s":"1==_0"}}," Card Number ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cc","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"card-number fluid","cardType":[{"t":2,"r":"active"}],"cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.number"}],"error":[{"t":2,"r":"form.errors.number"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"three expiry fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Month ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.cardMonths"}],"value":[{"t":2,"r":"cc.exp_month"}],"error":[{"t":2,"r":"form.errors.exp_month"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Year ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.cardYears"}],"value":[{"t":2,"r":"cc.exp_year"}],"error":[{"t":2,"r":"form.errors.exp_year"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["CVV No ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cvv","a":{"class":"fluid cvv","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.cvv"}],"error":[{"t":2,"r":"form.errors.cvv"}]},"v":{"click":"reset-cc"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"cvv-image"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["4 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv4-img"},"f":[" "]}],"n":50,"x":{"r":["cc.type"],"s":"\"amex\"==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","f":["3 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv3-img"},"f":[" "]}],"x":{"r":["cc.type"],"s":"\"amex\"==_0"}}]}],"n":50,"r":"cc.type"}," ",{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Card Holder's Name ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"fluid","value":[{"t":2,"r":"cc.name"}],"error":[{"t":2,"r":"form.errors.name"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"store field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"disabled":[{"t":2,"r":"cc.id"}],"type":"checkbox","checked":[{"t":2,"r":"cc.store"}]}}," Store card for future use."]}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Saved cards"]}," ",{"t":7,"e":"div","a":{"class":"ui list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"setCard","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"r":"number","s":true}]}]}],"n":52,"r":"cards"}]}]}],"n":50,"r":"cards"}]}]}]}],"n":50,"x":{"r":["active"],"s":"1==_0||2==_0"}},{"t":4,"n":51,"f":[{"t":4,"n":50,"x":{"r":["active"],"s":"_0==3"},"f":[{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"Bank field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select Your Bank ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"class":"bank fluid","value":[{"t":2,"r":"netbanking.net_banking"}],"error":[{"t":2,"r":"form.errors.net_banking"}],"options":[{"t":2,"r":"banks"}]}}]}]}]},{"t":4,"n":50,"x":{"r":["active"],"s":"(!(_0==3))&&(_0==4)"},"f":[" ",{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"mobi_content field step3wallet"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select Your Wallet ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"class":"wallet fluid","value":[{"t":2,"r":"wallet.wallet_type"}],"error":[{"t":2,"r":"step.errors.wallet_type"}],"options":[{"t":2,"r":"wallets"}]},"f":[]}]}]}]},{"t":4,"n":50,"x":{"r":["active"],"s":"(!(_0==3))&&((!(_0==4))&&(_0==5))"},"f":[" ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"mobi_content field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Pay Through: ",{"t":7,"e":"span","a":{"class":"required"},"f":["*",{"t":7,"e":"div","a":{"class":"emi_warning"},"f":["(Please note:EMI payment is applicable only for credit card.)"]}]}]}," ",{"t":7,"e":"select","a":{"name":"emi_banks","id":"emi_banks"},"v":{"change":{"m":"showEmiPlans","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"option","a":{"value":"","style":"display:none;"}}," ",{"t":4,"f":[{"t":7,"e":"option","a":{"value":[{"t":2,"r":".planId"}],"class":[{"t":2,"r":".BINs"}],"id":[{"t":2,"r":".subventionPaidBy"}],"data-value":[{"t":2,"r":".midProcesses"}]},"f":[{"t":2,"r":".gtwName"}]}],"r":"emi_banks"}]}]}," ",{"t":7,"e":"div","f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select You Plan: ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"table","a":{"id":"planTable","border":"1","class":"emiTable"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th"}," ",{"t":7,"e":"th","f":["EMI Plans"]}," ",{"t":7,"e":"th","f":["Monthly Installments"]}," ",{"t":7,"e":"th","f":["Total Cost"]}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"input","a":{"type":"radio","name":"emi_plan_radio","id":"emi_plan_radio","value":[{"t":2,"r":".tenureId"}],"class":"emi_plan_radio"},"v":{"click":{"m":"showCardFields","a":{"r":[],"s":"[]"}}}}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":".tenureMonths"}," Months @ ",{"t":2,"r":".processingFeePercent"}," % p.a"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":".currency"}," ",{"t":2,"r":".emiAmount"}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":".currency"}," ",{"t":2,"r":".total"}]}]}],"n":50,"x":{"r":[".planId","selectedPlan"],"s":"_0==_1"}}],"r":"emi_plans"}]}],"n":50,"r":"showEmiPlans"}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Credit Card Number ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cc","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"card-number fluid","cardType":[{"t":2,"r":"active"}],"cctype":[{"t":2,"r":"emi.card_type"}],"value":[{"t":2,"r":"emi.card_number"}],"error":[{"t":2,"r":"step.errors.number"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"store field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"disabled":[{"t":2,"r":"emi.id"}],"type":"checkbox","checked":[{"t":2,"r":"emi.store"}]}}," Store card for future use."]}]}," ",{"t":7,"e":"div","a":{"class":"three expiry fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Month ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.cardMonths"}],"value":[{"t":2,"r":"emi.exp_month"}],"error":[{"t":2,"r":"step.errors.exp_month"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Year ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.cardYears"}],"value":[{"t":2,"r":"emi.exp_year"}],"error":[{"t":2,"r":"step.errors.exp_year"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["CVV No ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cvv","a":{"class":"fluid cvv","cctype":[{"t":2,"r":"emi.card_type"}],"value":[{"t":2,"r":"emi.cvv"}],"error":[{"t":2,"r":"step.errors.cvv"}]},"v":{"click":"reset-cc"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"cvv-image"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["4 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv4-img"},"f":[" "]}],"n":50,"x":{"r":["emi.type"],"s":"\"amex\"==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","f":["3 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv3-img"},"f":[" "]}],"x":{"r":["emi.type"],"s":"\"amex\"==_0"}}]}],"n":50,"r":"emi.type"}," ",{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Card Holder's Name ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"disabled":[{"t":2,"r":"emi.id"}],"class":"fluid","value":[{"t":2,"r":"emi.name"}],"error":[{"t":2,"r":"step.errors.name"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"mobi_content field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Issuing Bank: ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"value":[{"t":2,"r":"emi.issuing_bank"}],"placeholder":"Issuing Bank","id":"issuing_bank"}}]}],"n":50,"r":"readyCardFields"}]}],"n":50,"r":"emiPaymentReady"},{"t":4,"n":51,"f":[{"t":4,"n":50,"x":{"r":["emi_unavailable"],"s":"_0"},"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message"},"f":[{"t":2,"r":"emi_unavailable"}]}]},{"t":4,"n":50,"x":{"r":["emi_unavailable"],"s":"!(_0)"},"f":[" ",{"t":7,"e":"div","a":{"class":"payment_loader"},"f":[{"t":7,"e":"div","a":{"class":"ui active inverted dimmer"},"f":[{"t":7,"e":"div","a":{"class":"wait_text"},"f":["Please Wait"]}," ",{"t":7,"e":"div","a":{"class":"ui text loader loader_position"}}]}]}]}],"r":"emiPaymentReady"}]},{"t":4,"n":50,"x":{"r":["active"],"s":"(!(_0==3))&&((!(_0==4))&&((!(_0==5))&&(_0==6)))"},"f":[" ",{"t":7,"e":"div","a":{"class":"mobi_content field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Enter Your VPA ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"value":[{"t":2,"r":"booking.payment.upi.virtual_address"}],"placeholder":"Enter Virtual Payment Address","id":"upi_cli_virtual_add"},"f":[]}," ",{"t":7,"e":"button","a":{"style":"display:none;","type":"button","class":["ui wizard button massive ",{"t":4,"f":["green"],"n":50,"r":"accepted"},{"t":4,"n":51,"f":["red"],"r":"accepted"}]},"m":[{"t":4,"f":["disabled=\"disabled\""],"n":51,"r":"accepted"}],"f":["Get Status"]}]}," ",{"t":7,"e":"div","a":{"class":"lead","id":"message"}}]}],"x":{"r":["active"],"s":"1==_0||2==_0"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"form.errors"}]}],"n":50,"r":"form.errors"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"note"},"f":[{"t":7,"e":"span","f":["Please Note :"]}," The charge will appear on your credit card / Account statement as 'Airtickets India Pvt Ltd'"]}," ",{"t":7,"e":"div","a":{"class":"agreement field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"accepted"}]}}," I have read and accepted the ",{"t":7,"e":"a","a":{"href":"/b2c/cms/termsofservices/2","target":"_blank"},"f":["Terms Of Service"]},"*"]}]}," ",{"t":7,"e":"div","a":{"class":"price"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["Convenience fee ",{"t":3,"x":{"r":["money","payment.convince_fee","meta.display_currency"],"s":"_0(_1,_2)"}}," will be charged"]}],"n":50,"x":{"r":["payment.convince_fee"],"s":"_0>0"}}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","payment.amount","payment.convince_fee","meta.display_currency"],"s":"_0(parseInt(_1)+parseInt(_2),_3)"}}]}," ",{"t":7,"e":"span","f":["(Total Payable Amount)"]}],"n":50,"r":"meta.display_currency"}]}," ",{"t":7,"e":"div","a":{"style":"width:100%"},"f":[{"t":7,"e":"div","a":{"style":"width:25%; float:left"},"f":[{"t":7,"e":"button","a":{"type":"submit","style":"width: 100%;","class":"ui wizard button  orange"},"m":[{"t":4,"f":["disabled=\"disabled\""],"n":51,"r":"accepted"}],"f":["MAKE PAYMENT"]}]}," ",{"t":7,"e":"div","a":{"class":"verified"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/vbv_250.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/mastercard_securecode.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/AMEX_SafeKey_180x99px.png"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/pci-dss-compliant.jpg"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/SSL-security-seal.png"}}]}]}]}],"n":50,"x":{"r":["emiPaymentReady","active"],"s":"_0||_1==1||_1==2||_1==3||_1==4||_1==6"}}]}]}]}]};

/***/ },

/***/ 398:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9oZWxwZXJzL21vbmV5LmpzPzJjZWIqIiwid2VicGFjazovLy8uL3ZlbmRvci9hY2NvdW50aW5nLmpzL2FjY291bnRpbmcuanM/Mjc5YSoqKiIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2FwcC9hdXRoLmpzP2I2OTIqKioqKioiLCJ3ZWJwYWNrOi8vLy4vanMvaGVscGVycy9kdXJhdGlvbi5qcz81ZTA1KiIsIndlYnBhY2s6Ly8vLi9qcy9oZWxwZXJzL2RhdGUuanM/YjQyYyoiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2NjL251bWJlci5qcz9lMjYxKiIsIndlYnBhY2s6Ly8vLi4vanMvanF1ZXJ5LnBheW1lbnQuanM/NTMzMSoiLCJ3ZWJwYWNrOi8vLy4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9jYy5odG1sPzZlZmEqIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9jYy9jdnYuanM/MWVlMSoiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9wYXltZW50LmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvcGF5bWVudC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvcGF5bWVudC9pbmRleC5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvcGF5bWVudC9mb3JtLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9wYXltZW50L2Zvcm0uaHRtbCIsIndlYnBhY2s6Ly8vLi9sZXNzL3dlYi9tb2R1bGVzL3BheW1lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHOzs7Ozs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOEJBQTZCLE9BQU87QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzR0FBcUcsRUFBRTtBQUN2Rzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSCxHQUFFO0FBQ0Y7QUFDQTtBQUNBLGtEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFD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RyxpQkFBaUIsR0FBRyxhQUFhLEdBQUcsa0JBQWtCLEdBQUc7QUFDdE07QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsMEJBQXlCLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSTtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBeUMsV0FBVzs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQXlDLFdBQVc7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEMsV0FBVztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF1QixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDdEMsVUFBUztBQUNULCtCQUE4QixFQUFFO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQsV0FBVztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LHdCQUF3QixxQ0FBcUMscUNBQXFDLE9BQU8sMERBQTBELHVCQUF1QixFQUFFLE1BQU0scUJBQXFCLG1CQUFtQixPQUFPLHNCQUFzQixxQkFBcUIsOENBQThDLE1BQU0scUJBQXFCLDREQUE0RCxNQUFNLHFCQUFxQiw0REFBNEQsTUFBTSxxQkFBcUIsd0RBQXdELE1BQU0scUJBQXFCLHdEQUF3RCxFQUFFLEVBQUUsRUFBRSxjQUFjLDhFQUE4RSxFQUFFLEVBQUUsRUFBRSxHOzs7Ozs7O0FDQWhzZCwwQyIsImZpbGUiOiJqcy9wYXltZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYWNjb3VudGluZyA9IHJlcXVpcmUoJ2FjY291bnRpbmcuanMnKVxuICAgIDtcblxudmFyIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKVxuICAgIDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhbW91bnQpIHtcbiAgICBpZiAoTWV0YS5vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoXG4gICAgICAgICAgICBhbW91bnQgKiBNZXRhLm9iamVjdC5nZXQoJ3hDaGFuZ2UnKVtNZXRhLm9iamVjdC5nZXQoJ2Rpc3BsYXlfY3VycmVuY3knKV0sXG4gICAgICAgICAgICAnPGkgY2xhc3M9XCInICsgTWV0YS5vYmplY3QuZ2V0KCdkaXNwbGF5X2N1cnJlbmN5JykudG9Mb3dlckNhc2UoKSAgKyAnIGljb24gY3VycmVuY3lcIj48L2k+JyxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICc8aSBjbGFzcz1cImluciBpY29uIGN1cnJlbmN5XCI+PC9pPicsIDApO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2hlbHBlcnMvbW9uZXkuanNcbi8vIG1vZHVsZSBpZCA9IDY5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCA1IDEwIiwiLyohXG4gKiBhY2NvdW50aW5nLmpzIHYwLjMuMlxuICogQ29weXJpZ2h0IDIwMTEsIEpvc3MgQ3Jvd2Nyb2Z0XG4gKlxuICogRnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogUG9ydGlvbnMgb2YgYWNjb3VudGluZy5qcyBhcmUgaW5zcGlyZWQgb3IgYm9ycm93ZWQgZnJvbSB1bmRlcnNjb3JlLmpzXG4gKlxuICogRnVsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuICogaHR0cDovL2pvc3Njcm93Y3JvZnQuZ2l0aHViLmNvbS9hY2NvdW50aW5nLmpzL1xuICovXG5cbihmdW5jdGlvbihyb290LCB1bmRlZmluZWQpIHtcblxuXHQvKiAtLS0gU2V0dXAgLS0tICovXG5cblx0Ly8gQ3JlYXRlIHRoZSBsb2NhbCBsaWJyYXJ5IG9iamVjdCwgdG8gYmUgZXhwb3J0ZWQgb3IgcmVmZXJlbmNlZCBnbG9iYWxseSBsYXRlclxuXHR2YXIgbGliID0ge307XG5cblx0Ly8gQ3VycmVudCB2ZXJzaW9uXG5cdGxpYi52ZXJzaW9uID0gJzAuMy4yJztcblxuXG5cdC8qIC0tLSBFeHBvc2VkIHNldHRpbmdzIC0tLSAqL1xuXG5cdC8vIFRoZSBsaWJyYXJ5J3Mgc2V0dGluZ3MgY29uZmlndXJhdGlvbiBvYmplY3QuIENvbnRhaW5zIGRlZmF1bHQgcGFyYW1ldGVycyBmb3Jcblx0Ly8gY3VycmVuY3kgYW5kIG51bWJlciBmb3JtYXR0aW5nXG5cdGxpYi5zZXR0aW5ncyA9IHtcblx0XHRjdXJyZW5jeToge1xuXHRcdFx0c3ltYm9sIDogXCIkXCIsXHRcdC8vIGRlZmF1bHQgY3VycmVuY3kgc3ltYm9sIGlzICckJ1xuXHRcdFx0Zm9ybWF0IDogXCIlcyV2XCIsXHQvLyBjb250cm9scyBvdXRwdXQ6ICVzID0gc3ltYm9sLCAldiA9IHZhbHVlIChjYW4gYmUgb2JqZWN0LCBzZWUgZG9jcylcblx0XHRcdGRlY2ltYWwgOiBcIi5cIixcdFx0Ly8gZGVjaW1hbCBwb2ludCBzZXBhcmF0b3Jcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXHRcdC8vIHRob3VzYW5kcyBzZXBhcmF0b3Jcblx0XHRcdHByZWNpc2lvbiA6IDIsXHRcdC8vIGRlY2ltYWwgcGxhY2VzXG5cdFx0XHRncm91cGluZyA6IDNcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0fSxcblx0XHRudW1iZXI6IHtcblx0XHRcdHByZWNpc2lvbiA6IDAsXHRcdC8vIGRlZmF1bHQgcHJlY2lzaW9uIG9uIG51bWJlcnMgaXMgMFxuXHRcdFx0Z3JvdXBpbmcgOiAzLFx0XHQvLyBkaWdpdCBncm91cGluZyAobm90IGltcGxlbWVudGVkIHlldClcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXG5cdFx0XHRkZWNpbWFsIDogXCIuXCJcblx0XHR9XG5cdH07XG5cblxuXHQvKiAtLS0gSW50ZXJuYWwgSGVscGVyIE1ldGhvZHMgLS0tICovXG5cblx0Ly8gU3RvcmUgcmVmZXJlbmNlIHRvIHBvc3NpYmx5LWF2YWlsYWJsZSBFQ01BU2NyaXB0IDUgbWV0aG9kcyBmb3IgbGF0ZXJcblx0dmFyIG5hdGl2ZU1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAsXG5cdFx0bmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanNcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuXHRcdHJldHVybiAhIShvYmogPT09ICcnIHx8IChvYmogJiYgb2JqLmNoYXJDb2RlQXQgJiYgb2JqLnN1YnN0cikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgc3RyaW5nXG5cdCAqIGZyb20gdW5kZXJzY29yZS5qcywgZGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUlzQXJyYXkgPyBuYXRpdmVJc0FycmF5KG9iaikgOiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSB0cnVlIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG5cdFx0cmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBhIGRlZmF1bHRzIG9iamVjdCwgc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgXy5kZWZhdWx0c1xuXHQgKlxuXHQgKiBVc2VkIGZvciBhYnN0cmFjdGluZyBwYXJhbWV0ZXIgaGFuZGxpbmcgZnJvbSBBUEkgbWV0aG9kc1xuXHQgKi9cblx0ZnVuY3Rpb24gZGVmYXVsdHMob2JqZWN0LCBkZWZzKSB7XG5cdFx0dmFyIGtleTtcblx0XHRvYmplY3QgPSBvYmplY3QgfHwge307XG5cdFx0ZGVmcyA9IGRlZnMgfHwge307XG5cdFx0Ly8gSXRlcmF0ZSBvdmVyIG9iamVjdCBub24tcHJvdG90eXBlIHByb3BlcnRpZXM6XG5cdFx0Zm9yIChrZXkgaW4gZGVmcykge1xuXHRcdFx0aWYgKGRlZnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHQvLyBSZXBsYWNlIHZhbHVlcyB3aXRoIGRlZmF1bHRzIG9ubHkgaWYgdW5kZWZpbmVkIChhbGxvdyBlbXB0eS96ZXJvIHZhbHVlcyk6XG5cdFx0XHRcdGlmIChvYmplY3Rba2V5XSA9PSBudWxsKSBvYmplY3Rba2V5XSA9IGRlZnNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRhdGlvbiBvZiBgQXJyYXkubWFwKClgIGZvciBpdGVyYXRpb24gbG9vcHNcblx0ICpcblx0ICogUmV0dXJucyBhIG5ldyBBcnJheSBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBpdGVyYXRvcmAgb24gZWFjaCBhcnJheSB2YWx1ZS5cblx0ICogRGVmZXJzIHRvIG5hdGl2ZSBBcnJheS5tYXAgaWYgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuXHRcdHZhciByZXN1bHRzID0gW10sIGksIGo7XG5cblx0XHRpZiAoIW9iaikgcmV0dXJuIHJlc3VsdHM7XG5cblx0XHQvLyBVc2UgbmF0aXZlIC5tYXAgbWV0aG9kIGlmIGl0IGV4aXN0czpcblx0XHRpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuXG5cdFx0Ly8gRmFsbGJhY2sgZm9yIG5hdGl2ZSAubWFwOlxuXHRcdGZvciAoaSA9IDAsIGogPSBvYmoubGVuZ3RoOyBpIDwgajsgaSsrICkge1xuXHRcdFx0cmVzdWx0c1tpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBhbmQgbm9ybWFsaXNlIHRoZSB2YWx1ZSBvZiBwcmVjaXNpb24gKG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlcilcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrUHJlY2lzaW9uKHZhbCwgYmFzZSkge1xuXHRcdHZhbCA9IE1hdGgucm91bmQoTWF0aC5hYnModmFsKSk7XG5cdFx0cmV0dXJuIGlzTmFOKHZhbCk/IGJhc2UgOiB2YWw7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBmb3JtYXQgc3RyaW5nIG9yIG9iamVjdCBhbmQgcmV0dXJucyBmb3JtYXQgb2JqIGZvciB1c2UgaW4gcmVuZGVyaW5nXG5cdCAqXG5cdCAqIGBmb3JtYXRgIGlzIGVpdGhlciBhIHN0cmluZyB3aXRoIHRoZSBkZWZhdWx0IChwb3NpdGl2ZSkgZm9ybWF0LCBvciBvYmplY3Rcblx0ICogY29udGFpbmluZyBgcG9zYCAocmVxdWlyZWQpLCBgbmVnYCBhbmQgYHplcm9gIHZhbHVlcyAob3IgYSBmdW5jdGlvbiByZXR1cm5pbmdcblx0ICogZWl0aGVyIGEgc3RyaW5nIG9yIG9iamVjdClcblx0ICpcblx0ICogRWl0aGVyIHN0cmluZyBvciBmb3JtYXQucG9zIG11c3QgY29udGFpbiBcIiV2XCIgKHZhbHVlKSB0byBiZSB2YWxpZFxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDdXJyZW5jeUZvcm1hdChmb3JtYXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0O1xuXG5cdFx0Ly8gQWxsb3cgZnVuY3Rpb24gYXMgZm9ybWF0IHBhcmFtZXRlciAoc2hvdWxkIHJldHVybiBzdHJpbmcgb3Igb2JqZWN0KTpcblx0XHRpZiAoIHR5cGVvZiBmb3JtYXQgPT09IFwiZnVuY3Rpb25cIiApIGZvcm1hdCA9IGZvcm1hdCgpO1xuXG5cdFx0Ly8gRm9ybWF0IGNhbiBiZSBhIHN0cmluZywgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIChcIiV2XCIpIG11c3QgYmUgcHJlc2VudDpcblx0XHRpZiAoIGlzU3RyaW5nKCBmb3JtYXQgKSAmJiBmb3JtYXQubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGFuZCByZXR1cm4gcG9zaXRpdmUsIG5lZ2F0aXZlIGFuZCB6ZXJvIGZvcm1hdHM6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwb3MgOiBmb3JtYXQsXG5cdFx0XHRcdG5lZyA6IGZvcm1hdC5yZXBsYWNlKFwiLVwiLCBcIlwiKS5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBmb3JtYXRcblx0XHRcdH07XG5cblx0XHQvLyBJZiBubyBmb3JtYXQsIG9yIG9iamVjdCBpcyBtaXNzaW5nIHZhbGlkIHBvc2l0aXZlIHZhbHVlLCB1c2UgZGVmYXVsdHM6XG5cdFx0fSBlbHNlIGlmICggIWZvcm1hdCB8fCAhZm9ybWF0LnBvcyB8fCAhZm9ybWF0LnBvcy5tYXRjaChcIiV2XCIpICkge1xuXG5cdFx0XHQvLyBJZiBkZWZhdWx0cyBpcyBhIHN0cmluZywgY2FzdHMgaXQgdG8gYW4gb2JqZWN0IGZvciBmYXN0ZXIgY2hlY2tpbmcgbmV4dCB0aW1lOlxuXHRcdFx0cmV0dXJuICggIWlzU3RyaW5nKCBkZWZhdWx0cyApICkgPyBkZWZhdWx0cyA6IGxpYi5zZXR0aW5ncy5jdXJyZW5jeS5mb3JtYXQgPSB7XG5cdFx0XHRcdHBvcyA6IGRlZmF1bHRzLFxuXHRcdFx0XHRuZWcgOiBkZWZhdWx0cy5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBkZWZhdWx0c1xuXHRcdFx0fTtcblxuXHRcdH1cblx0XHQvLyBPdGhlcndpc2UsIGFzc3VtZSBmb3JtYXQgd2FzIGZpbmU6XG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fVxuXG5cblx0LyogLS0tIEFQSSBNZXRob2RzIC0tLSAqL1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIHN0cmluZy9hcnJheSBvZiBzdHJpbmdzLCByZW1vdmVzIGFsbCBmb3JtYXR0aW5nL2NydWZ0IGFuZCByZXR1cm5zIHRoZSByYXcgZmxvYXQgdmFsdWVcblx0ICogYWxpYXM6IGFjY291bnRpbmcuYHBhcnNlKHN0cmluZylgXG5cdCAqXG5cdCAqIERlY2ltYWwgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGZsb2F0cyAoZGVmYXVsdDogXCIuXCIpLCBzbyBpZiB0aGUgbnVtYmVyXG5cdCAqIHVzZXMgYSBub24tc3RhbmRhcmQgZGVjaW1hbCBzZXBhcmF0b3IsIHByb3ZpZGUgaXQgYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0ICpcblx0ICogQWxzbyBtYXRjaGVzIGJyYWNrZXRlZCBuZWdhdGl2ZXMgKGVnLiBcIiQgKDEuOTkpXCIgPT4gLTEuOTkpXG5cdCAqXG5cdCAqIERvZXNuJ3QgdGhyb3cgYW55IGVycm9ycyAoYE5hTmBzIGJlY29tZSAwKSBidXQgdGhpcyBtYXkgY2hhbmdlIGluIGZ1dHVyZVxuXHQgKi9cblx0dmFyIHVuZm9ybWF0ID0gbGliLnVuZm9ybWF0ID0gbGliLnBhcnNlID0gZnVuY3Rpb24odmFsdWUsIGRlY2ltYWwpIHtcblx0XHQvLyBSZWN1cnNpdmVseSB1bmZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZm9ybWF0KHZhbCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBGYWlscyBzaWxlbnRseSAobmVlZCBkZWNlbnQgZXJyb3JzKTpcblx0XHR2YWx1ZSA9IHZhbHVlIHx8IDA7XG5cblx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGFzLWlzIGlmIGl0J3MgYWxyZWFkeSBhIG51bWJlcjpcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gdmFsdWU7XG5cblx0XHQvLyBEZWZhdWx0IGRlY2ltYWwgcG9pbnQgaXMgXCIuXCIgYnV0IGNvdWxkIGJlIHNldCB0byBlZy4gXCIsXCIgaW4gb3B0czpcblx0XHRkZWNpbWFsID0gZGVjaW1hbCB8fCBcIi5cIjtcblxuXHRcdCAvLyBCdWlsZCByZWdleCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBleGNlcHQgZGlnaXRzLCBkZWNpbWFsIHBvaW50IGFuZCBtaW51cyBzaWduOlxuXHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXjAtOS1cIiArIGRlY2ltYWwgKyBcIl1cIiwgW1wiZ1wiXSksXG5cdFx0XHR1bmZvcm1hdHRlZCA9IHBhcnNlRmxvYXQoXG5cdFx0XHRcdChcIlwiICsgdmFsdWUpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCgoLiopXFwpLywgXCItJDFcIikgLy8gcmVwbGFjZSBicmFja2V0ZWQgdmFsdWVzIHdpdGggbmVnYXRpdmVzXG5cdFx0XHRcdC5yZXBsYWNlKHJlZ2V4LCAnJykgICAgICAgICAvLyBzdHJpcCBvdXQgYW55IGNydWZ0XG5cdFx0XHRcdC5yZXBsYWNlKGRlY2ltYWwsICcuJykgICAgICAvLyBtYWtlIHN1cmUgZGVjaW1hbCBwb2ludCBpcyBzdGFuZGFyZFxuXHRcdFx0KTtcblxuXHRcdC8vIFRoaXMgd2lsbCBmYWlsIHNpbGVudGx5IHdoaWNoIG1heSBjYXVzZSB0cm91YmxlLCBsZXQncyB3YWl0IGFuZCBzZWU6XG5cdFx0cmV0dXJuICFpc05hTih1bmZvcm1hdHRlZCkgPyB1bmZvcm1hdHRlZCA6IDA7XG5cdH07XG5cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcblx0ICpcblx0ICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gXCIwLjYxXCIpIHRoYXQgcHJlc2VudFxuXHQgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cblx0ICovXG5cdHZhciB0b0ZpeGVkID0gbGliLnRvRml4ZWQgPSBmdW5jdGlvbih2YWx1ZSwgcHJlY2lzaW9uKSB7XG5cdFx0cHJlY2lzaW9uID0gY2hlY2tQcmVjaXNpb24ocHJlY2lzaW9uLCBsaWIuc2V0dGluZ3MubnVtYmVyLnByZWNpc2lvbik7XG5cdFx0dmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG5cblx0XHQvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcblx0XHRyZXR1cm4gKE1hdGgucm91bmQobGliLnVuZm9ybWF0KHZhbHVlKSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyLCB3aXRoIGNvbW1hLXNlcGFyYXRlZCB0aG91c2FuZHMgYW5kIGN1c3RvbSBwcmVjaXNpb24vZGVjaW1hbCBwbGFjZXNcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgcHJlY2lzaW9uIGFuZCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9yc1xuXHQgKiAybmQgcGFyYW1ldGVyIGBwcmVjaXNpb25gIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLm51bWJlcmBcblx0ICovXG5cdHZhciBmb3JtYXROdW1iZXIgPSBsaWIuZm9ybWF0TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiBmb3JtYXROdW1iZXIodmFsLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChwcmVjaXNpb24pID8gcHJlY2lzaW9uIDoge1xuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MubnVtYmVyXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDbGVhbiB1cCBwcmVjaXNpb25cblx0XHRcdHVzZVByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSxcblxuXHRcdFx0Ly8gRG8gc29tZSBjYWxjOlxuXHRcdFx0bmVnYXRpdmUgPSBudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiLFxuXHRcdFx0YmFzZSA9IHBhcnNlSW50KHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyIHx8IDApLCB1c2VQcmVjaXNpb24pLCAxMCkgKyBcIlwiLFxuXHRcdFx0bW9kID0gYmFzZS5sZW5ndGggPiAzID8gYmFzZS5sZW5ndGggJSAzIDogMDtcblxuXHRcdC8vIEZvcm1hdCB0aGUgbnVtYmVyOlxuXHRcdHJldHVybiBuZWdhdGl2ZSArIChtb2QgPyBiYXNlLnN1YnN0cigwLCBtb2QpICsgb3B0cy50aG91c2FuZCA6IFwiXCIpICsgYmFzZS5zdWJzdHIobW9kKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgb3B0cy50aG91c2FuZCkgKyAodXNlUHJlY2lzaW9uID8gb3B0cy5kZWNpbWFsICsgdG9GaXhlZChNYXRoLmFicyhudW1iZXIpLCB1c2VQcmVjaXNpb24pLnNwbGl0KCcuJylbMV0gOiBcIlwiKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBudW1iZXIgaW50byBjdXJyZW5jeVxuXHQgKlxuXHQgKiBVc2FnZTogYWNjb3VudGluZy5mb3JtYXRNb25leShudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZHNTZXAsIGRlY2ltYWxTZXAsIGZvcm1hdClcblx0ICogZGVmYXVsdHM6ICgwLCBcIiRcIiwgMiwgXCIsXCIsIFwiLlwiLCBcIiVzJXZcIilcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kIC8gZGVjaW1hbCBzZXBhcmF0b3JzIGFuZCBmb3JtYXRcblx0ICogU2Vjb25kIHBhcmFtIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLmN1cnJlbmN5YCB3aGljaCBpcyB0aGUgZWFzaWVzdCB3YXkuXG5cdCAqXG5cdCAqIFRvIGRvOiB0aWR5IHVwIHRoZSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHR2YXIgZm9ybWF0TW9uZXkgPSBsaWIuZm9ybWF0TW9uZXkgPSBmdW5jdGlvbihudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKXtcblx0XHRcdFx0cmV0dXJuIGZvcm1hdE1vbmV5KHZhbCwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgbnVtYmVyOlxuXHRcdG51bWJlciA9IHVuZm9ybWF0KG51bWJlcik7XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pOlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZTpcblx0XHRcdHVzZUZvcm1hdCA9IG51bWJlciA+IDAgPyBmb3JtYXRzLnBvcyA6IG51bWJlciA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybztcblxuXHRcdC8vIFJldHVybiB3aXRoIGN1cnJlbmN5IHN5bWJvbCBhZGRlZDpcblx0XHRyZXR1cm4gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKG51bWJlciksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbGlzdCBvZiBudW1iZXJzIGludG8gYW4gYWNjb3VudGluZyBjb2x1bW4sIHBhZGRpbmcgd2l0aCB3aGl0ZXNwYWNlXG5cdCAqIHRvIGxpbmUgdXAgY3VycmVuY3kgc3ltYm9scywgdGhvdXNhbmQgc2VwYXJhdG9ycyBhbmQgZGVjaW1hbHMgcGxhY2VzXG5cdCAqXG5cdCAqIExpc3Qgc2hvdWxkIGJlIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICogU2Vjb25kIHBhcmFtZXRlciBjYW4gYmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyB0aGF0IG1hdGNoIHRoZSBwYXJhbXNcblx0ICpcblx0ICogUmV0dXJucyBhcnJheSBvZiBhY2NvdXRpbmctZm9ybWF0dGVkIG51bWJlciBzdHJpbmdzIG9mIHNhbWUgbGVuZ3RoXG5cdCAqXG5cdCAqIE5COiBgd2hpdGUtc3BhY2U6cHJlYCBDU1MgcnVsZSBpcyByZXF1aXJlZCBvbiB0aGUgbGlzdCBjb250YWluZXIgdG8gcHJldmVudFxuXHQgKiBicm93c2VycyBmcm9tIGNvbGxhcHNpbmcgdGhlIHdoaXRlc3BhY2UgaW4gdGhlIG91dHB1dCBzdHJpbmdzLlxuXHQgKi9cblx0bGliLmZvcm1hdENvbHVtbiA9IGZ1bmN0aW9uKGxpc3QsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0aWYgKCFsaXN0KSByZXR1cm4gW107XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pLCBvbmx5IG5lZWQgcG9zIGZvciBub3c6XG5cdFx0XHRmb3JtYXRzID0gY2hlY2tDdXJyZW5jeUZvcm1hdChvcHRzLmZvcm1hdCksXG5cblx0XHRcdC8vIFdoZXRoZXIgdG8gcGFkIGF0IHN0YXJ0IG9mIHN0cmluZyBvciBhZnRlciBjdXJyZW5jeSBzeW1ib2w6XG5cdFx0XHRwYWRBZnRlclN5bWJvbCA9IGZvcm1hdHMucG9zLmluZGV4T2YoXCIlc1wiKSA8IGZvcm1hdHMucG9zLmluZGV4T2YoXCIldlwiKSA/IHRydWUgOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RvcmUgdmFsdWUgZm9yIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nIGluIHRoZSBjb2x1bW46XG5cdFx0XHRtYXhMZW5ndGggPSAwLFxuXG5cdFx0XHQvLyBGb3JtYXQgdGhlIGxpc3QgYWNjb3JkaW5nIHRvIG9wdGlvbnMsIHN0b3JlIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nOlxuXHRcdFx0Zm9ybWF0dGVkID0gbWFwKGxpc3QsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheSh2YWwpKSB7XG5cdFx0XHRcdFx0Ly8gUmVjdXJzaXZlbHkgZm9ybWF0IGNvbHVtbnMgaWYgbGlzdCBpcyBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5OlxuXHRcdFx0XHRcdHJldHVybiBsaWIuZm9ybWF0Q29sdW1uKHZhbCwgb3B0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYW4gdXAgdGhlIHZhbHVlXG5cdFx0XHRcdFx0dmFsID0gdW5mb3JtYXQodmFsKTtcblxuXHRcdFx0XHRcdC8vIENob29zZSB3aGljaCBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIHZhbHVlIChwb3MsIG5lZyBvciB6ZXJvKTpcblx0XHRcdFx0XHR2YXIgdXNlRm9ybWF0ID0gdmFsID4gMCA/IGZvcm1hdHMucG9zIDogdmFsIDwgMCA/IGZvcm1hdHMubmVnIDogZm9ybWF0cy56ZXJvLFxuXG5cdFx0XHRcdFx0XHQvLyBGb3JtYXQgdGhpcyB2YWx1ZSwgcHVzaCBpbnRvIGZvcm1hdHRlZCBsaXN0IGFuZCBzYXZlIHRoZSBsZW5ndGg6XG5cdFx0XHRcdFx0XHRmVmFsID0gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKHZhbCksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cblx0XHRcdFx0XHRpZiAoZlZhbC5sZW5ndGggPiBtYXhMZW5ndGgpIG1heExlbmd0aCA9IGZWYWwubGVuZ3RoO1xuXHRcdFx0XHRcdHJldHVybiBmVmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIFBhZCBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBhbmQgc2VuZCBiYWNrIHRoZSBjb2x1bW4gb2YgbnVtYmVyczpcblx0XHRyZXR1cm4gbWFwKGZvcm1hdHRlZCwgZnVuY3Rpb24odmFsLCBpKSB7XG5cdFx0XHQvLyBPbmx5IGlmIHRoaXMgaXMgYSBzdHJpbmcgKG5vdCBhIG5lc3RlZCBhcnJheSwgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcGFkZGVkKTpcblx0XHRcdGlmIChpc1N0cmluZyh2YWwpICYmIHZhbC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcblx0XHRcdFx0Ly8gRGVwZW5kaW5nIG9uIHN5bWJvbCBwb3NpdGlvbiwgcGFkIGFmdGVyIHN5bWJvbCBvciBhdCBpbmRleCAwOlxuXHRcdFx0XHRyZXR1cm4gcGFkQWZ0ZXJTeW1ib2wgPyB2YWwucmVwbGFjZShvcHRzLnN5bWJvbCwgb3B0cy5zeW1ib2wrKG5ldyBBcnJheShtYXhMZW5ndGggLSB2YWwubGVuZ3RoICsgMSkuam9pbihcIiBcIikpKSA6IChuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSArIHZhbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvKiAtLS0gTW9kdWxlIERlZmluaXRpb24gLS0tICovXG5cblx0Ly8gRXhwb3J0IGFjY291bnRpbmcgZm9yIENvbW1vbkpTLiBJZiBiZWluZyBsb2FkZWQgYXMgYW4gQU1EIG1vZHVsZSwgZGVmaW5lIGl0IGFzIHN1Y2guXG5cdC8vIE90aGVyd2lzZSwganVzdCBhZGQgYGFjY291bnRpbmdgIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5cdGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRcdGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblx0XHR9XG5cdFx0ZXhwb3J0cy5hY2NvdW50aW5nID0gbGliO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIFJldHVybiB0aGUgbGlicmFyeSBhcyBhbiBBTUQgbW9kdWxlOlxuXHRcdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbGliO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFVzZSBhY2NvdW50aW5nLm5vQ29uZmxpY3QgdG8gcmVzdG9yZSBgYWNjb3VudGluZ2AgYmFjayB0byBpdHMgb3JpZ2luYWwgdmFsdWUuXG5cdFx0Ly8gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSdzIGBhY2NvdW50aW5nYCBvYmplY3Q7XG5cdFx0Ly8gZS5nLiBgdmFyIG51bWJlcnMgPSBhY2NvdW50aW5nLm5vQ29uZmxpY3QoKTtgXG5cdFx0bGliLm5vQ29uZmxpY3QgPSAoZnVuY3Rpb24ob2xkQWNjb3VudGluZykge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBSZXNldCB0aGUgdmFsdWUgb2YgdGhlIHJvb3QncyBgYWNjb3VudGluZ2AgdmFyaWFibGU6XG5cdFx0XHRcdHJvb3QuYWNjb3VudGluZyA9IG9sZEFjY291bnRpbmc7XG5cdFx0XHRcdC8vIERlbGV0ZSB0aGUgbm9Db25mbGljdCBtZXRob2Q6XG5cdFx0XHRcdGxpYi5ub0NvbmZsaWN0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHQvLyBSZXR1cm4gcmVmZXJlbmNlIHRvIHRoZSBsaWJyYXJ5IHRvIHJlLWFzc2lnbiBpdDpcblx0XHRcdFx0cmV0dXJuIGxpYjtcblx0XHRcdH07XG5cdFx0fSkocm9vdC5hY2NvdW50aW5nKTtcblxuXHRcdC8vIERlY2xhcmUgYGZ4YCBvbiB0aGUgcm9vdCAoZ2xvYmFsL3dpbmRvdykgb2JqZWN0OlxuXHRcdHJvb3RbJ2FjY291bnRpbmcnXSA9IGxpYjtcblx0fVxuXG5cdC8vIFJvb3Qgd2lsbCBiZSBgd2luZG93YCBpbiBicm93c2VyIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXI6XG59KHRoaXMpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdmVuZG9yL2FjY291bnRpbmcuanMvYWNjb3VudGluZy5qc1xuLy8gbW9kdWxlIGlkID0gNzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDUgNiA3IDEwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIFEgPSByZXF1aXJlKCdxJylcbiAgICA7XG5cbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJylcbiAgICA7XG5cbnZhciBBdXRoID0gRm9ybS5leHRlbmQoe1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2F1dGguaHRtbCcpLFxuXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhY3Rpb246ICdsb2dpbicsXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGZvcmdvdHRlbnBhc3M6IGZhbHNlLFxuXG4gICAgICAgICAgICB1c2VyOiB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdwb3B1cCcpKSB7XG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnZXJyb3InLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC8nICsgdGhpcy5nZXQoJ2FjdGlvbicpLFxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSwgcGFzc3dvcmQ6IHRoaXMuZ2V0KCd1c2VyLnBhc3N3b3JkJykgfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ2hpZGUnKTtcblxuICAgICAgICAgICAgICAgIGlmICh2aWV3LmRlZmVycmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXHRcdFx0XHRcdGlmKHJlc3BvbnNlLmVycm9yc1sndXNlcm5hbWUnXVswXT09XCJZb3UgYXJlIGFscmVhZHkgb3VyIEIyQiB1c2VyLlwiKSB7XG5cdFx0XHRcdFx0XHQkKFwiI0IyQlVzZXJQb3B1cFwiKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHQkKFwiLmxvZ2luIC5oZWFkZXJcIikuaHRtbCgnQjJCIFVzZXIgTG9naW4nKTtcblx0XHRcdFx0XHRcdHZpZXcuc2V0KCdCMkJVc2VyTG9naW5Qb3B1cE1lc3NhZ2UnLHRydWUpO1xuXHRcdFx0XHRcdH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCdwb3B1cCcpPT1udWxsICYmIGRhdGEgJiYgZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcblxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC9mb3Jnb3R0ZW5wYXNzJyxcbiAgICAgICAgICAgIGRhdGE6IHsgZW1haWw6IHRoaXMuZ2V0KCd1c2VyLmxvZ2luJykgfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdyZXNldHN1Y2Nlc3MnLCB0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpZ251cDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC9zaWdudXAnLFxuICAgICAgICAgICAgZGF0YTogXy5waWNrKHRoaXMuZ2V0KCd1c2VyJyksIFsnZW1haWwnLCduYW1lJywgJ21vYmlsZScsICdwYXNzd29yZCcsICdwYXNzd29yZDInXSksXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc2lnbnVwc3VjY2VzcycsIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbcmVzcG9uc2UubWVzc2FnZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuXG5BdXRoLmxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aCgpO1xuXG4gICAgYXV0aC5zZXQoJ3BvcHVwJywgdHJ1ZSk7XG4gICAgYXV0aC5kZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xuXG4gICAgcmV0dXJuIGF1dGguZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkF1dGguc2lnbnVwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aCgpO1xuXG4gICAgYXV0aC5zZXQoJ3BvcHVwJywgdHJ1ZSk7XG4gICAgYXV0aC5zZXQoJ3NpZ251cCcsIHRydWUpO1xuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgYXV0aC5yZW5kZXIoJyNwb3B1cC1jb250YWluZXInKTtcblxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGg7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb21wb25lbnRzL2FwcC9hdXRoLmpzXG4vLyBtb2R1bGUgaWQgPSA4MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAzIDQgNSA2IDcgMTAiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHBhZGR5KG4sIHAsIGMpIHtcbiAgICB2YXIgcGFkX2NoYXIgPSB0eXBlb2YgYyAhPT0gJ3VuZGVmaW5lZCcgPyBjIDogJzAnO1xuICAgIHZhciBwYWQgPSBuZXcgQXJyYXkoMSArIHApLmpvaW4ocGFkX2NoYXIpO1xuICAgIHJldHVybiAocGFkICsgbikuc2xpY2UoLXBhZC5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm1hdDogZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICAgICAgICAgIGlmICghZHVyYXRpb24pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgaSA9IGR1cmF0aW9uLmFzTWludXRlcygpLFxuICAgICAgICAgICAgICAgIGhvdXJzID0gTWF0aC5mbG9vcihpLzYwKSxcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gaSAlIDYwXG4gICAgICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICByZXR1cm4gcGFkZHkoaG91cnMsIDIpICsgJ2ggJyArIHBhZGR5KG1pbnV0ZXMsIDIpICsgJ20nO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9oZWxwZXJzL2R1cmF0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA4MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSAxMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuICAgIDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0ge1xuICAgICAgICBEOiBfLnJhbmdlKDEsMzIpLFxuICAgICAgICBNOiBfLnJhbmdlKDEsMTMpLFxuICAgICAgICBNTU1NOiBtb21lbnQubW9udGhzKClcbiAgICB9O1xuXG4gICAgb3V0LnNlbGVjdCA9IHtcbiAgICAgICAgRDogXy5tYXAob3V0LkQsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IF8ucGFkTGVmdChpLCAyLCAwKSwgdGV4dDogaSB9OyB9KSxcbiAgICAgICAgTTogXy5tYXAob3V0Lk0sIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IF8ucGFkTGVmdChpLCAyLCAwKSwgdGV4dDogaSB9OyB9KSxcbiAgICAgICAgTU1NTTogXy5tYXAob3V0Lk1NTU0sIGZ1bmN0aW9uKGksIGspIHsgcmV0dXJuIHsgaWQ6IF8ucGFkTGVmdChrICsgMSwgMiwgMCksIHRleHQ6IGkgfTsgfSksXG5cbiAgICAgICAgcGFzc3BvcnRZZWFyczogXy5tYXAoXy5yYW5nZShtb21lbnQoKS55ZWFyKCksIG1vbWVudCgpLnllYXIoKSArIDE1KSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogJycraSwgdGV4dDogJycraSB9OyB9KSxcblxuICAgICAgICBiaXJ0aFllYXJzOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5tYXAoXy5yYW5nZShtb21lbnQoKS55ZWFyKCksIDE4OTksIC0xKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogJycraSwgdGV4dDogJycraSB9OyB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYXJkWWVhcnM6IF8ubWFwKF8ucmFuZ2UobW9tZW50KCkueWVhcigpLCBtb21lbnQoKS5hZGQoMjUsICd5ZWFycycpLnllYXIoKSksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6ICcnK2ksIHRleHQ6ICcnK2kgfTsgfSksXG4gICAgICAgIGNhcmRNb250aHM6IF8ubWFwKG91dC5NTU1NLCBmdW5jdGlvbihpLCBrKSB7IHJldHVybiB7IGlkOiBrICsgMSwgdGV4dDogXy5wYWRMZWZ0KGsrMSwgMiwgJzAnKSArICcgJyArIGkgfTsgfSlcblxuICAgIH07XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2hlbHBlcnMvZGF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gOTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDUgMTAiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uLy4uLy4uLy4uLy4uL2pzL2pxdWVyeS5wYXltZW50Jyk7XG5cbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4uL2lucHV0JyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0LmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vY2MuaHRtbCcpLFxuXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG5cbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Zvcm1hdENhcmROdW1iZXInKTtcblxuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KCdjY3R5cGUnLCAkLnBheW1lbnQuY2FyZFR5cGUodmFsdWUpKTtcbiAgICAgICAgICAgIHZhciBib29raW5nID0gdGhpcy5wYXJlbnQuZ2V0KCdib29raW5nJyk7XG4gICAgICAgICAgICBpZihib29raW5nICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHZhciBiaW5fZGlnaXRzID0gdmFsdWUucmVwbGFjZSgnICcsJycpLnNsaWNlKDAsNik7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgPT0gJycgfHwgYmluX2RpZ2l0cy5sZW5ndGggPCA2KXtcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZy5zZXQoJ2NvbnZlbmllbmNlRmVlJywgMCk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wcmV2Q0NUeXBlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucHJldkNhcmRUeXBlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZigodGhpcy5nZXQoJ2NjdHlwZScpICE9IHdpbmRvdy5wcmV2Q0NUeXBlIHx8IFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ2NhcmRUeXBlJykgIT0gd2luZG93LnByZXZDYXJkVHlwZSkgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5fZGlnaXRzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXJkX3R5cGUgPSBwYXJzZUludCh0aGlzLmdldCgnY2FyZFR5cGUnKSkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZy5weW10Q29udkZlZShjYXJkX3R5cGUgLHRoaXMuZ2V0KCdjY3R5cGUnKSwgYmluX2RpZ2l0cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnByZXZDQ1R5cGUgPSB0aGlzLmdldCgnY2N0eXBlJyk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wcmV2Q2FyZFR5cGUgPSB0aGlzLmdldCgnY2FyZFR5cGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XG4gICAgfSxcblxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdkZXN0cm95Jyk7XG4gICAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb3JlL2Zvcm0vY2MvbnVtYmVyLmpzXG4vLyBtb2R1bGUgaWQgPSA5OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSAxMCIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbihmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FyZEZyb21OdW1iZXIsIGNhcmRGcm9tVHlwZSwgY2FyZHMsIGRlZmF1bHRGb3JtYXQsIGZvcm1hdEJhY2tDYXJkTnVtYmVyLCBmb3JtYXRCYWNrRXhwaXJ5LCBmb3JtYXRDYXJkTnVtYmVyLCBmb3JtYXRFeHBpcnksIGZvcm1hdEZvcndhcmRFeHBpcnksIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlLCBoYXNUZXh0U2VsZWN0ZWQsIGx1aG5DaGVjaywgcmVGb3JtYXRDVkMsIHJlRm9ybWF0Q2FyZE51bWJlciwgcmVGb3JtYXRFeHBpcnksIHJlRm9ybWF0TnVtZXJpYywgcmVzdHJpY3RDVkMsIHJlc3RyaWN0Q2FyZE51bWJlciwgcmVzdHJpY3RFeHBpcnksIHJlc3RyaWN0TnVtZXJpYywgc2V0Q2FyZFR5cGUsXG4gICAgICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICAgICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgICAkLnBheW1lbnQgPSB7fTtcblxuICAgICQucGF5bWVudC5mbiA9IHt9O1xuXG4gICAgJC5mbi5wYXltZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzLCBtZXRob2Q7XG4gICAgICAgIG1ldGhvZCA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICAgIHJldHVybiAkLnBheW1lbnQuZm5bbWV0aG9kXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuXG4gICAgZGVmYXVsdEZvcm1hdCA9IC8oXFxkezEsNH0pL2c7XG5cbiAgICAkLnBheW1lbnQuY2FyZHMgPSBjYXJkcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdydXBheScsXG4gICAgICAgICAgcGF0dGVybjovXig1MDhbNS05XVswLTldezEyfSl8KDYwNjlbOC05XVswLTldezExfSl8KDYwN1swLThdWzAtOV17MTJ9KXwoNjA3OVswLThdWzAtOV17MTF9KXwoNjA4WzAtNV1bMC05XXsxMn0pfCg2NTIxWzUtOV1bMC05XXsxMX0pfCg2NTJbMi05XVswLTldezEyfSl8KDY1MzBbMC05XXsxMn0pfCg2NTMxWzAtNF1bMC05XXsxMX0pLyxcbiAgICAgICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgICAgIGx1aG46IGZhbHNlXG4gICAgICAgIH0gLCAgICAgICAgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICd2aXNhZWxlY3Ryb24nLFxuICAgICAgICAgICAgcGF0dGVybjogL140KDAyNnwxNzUwMHw0MDV8NTA4fDg0NHw5MVszN10pLyxcbiAgICAgICAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgICAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgICAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgICAgICAgbHVobjogdHJ1ZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0eXBlOiAnbWFlc3RybycsXG4gICAgICAgICAgICBwYXR0ZXJuOiAvXig1KDAxOHwwWzIzXXxbNjhdKXw2KDM5fDcpKS8sXG4gICAgICAgICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICAgICAgICBsZW5ndGg6IFsxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgICAgICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICAgICAgICBsdWhuOiB0cnVlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6ICdmb3JicnVnc2ZvcmVuaW5nZW4nLFxuICAgICAgICAgICAgcGF0dGVybjogL142MDAvLFxuICAgICAgICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICAgICAgICBsdWhuOiB0cnVlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6ICdkYW5rb3J0JyxcbiAgICAgICAgICAgIHBhdHRlcm46IC9eNTAxOS8sXG4gICAgICAgICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICAgICAgICBsZW5ndGg6IFsxNl0sXG4gICAgICAgICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgICAgICAgIGx1aG46IHRydWVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdHlwZTogJ3Zpc2EnLFxuICAgICAgICAgICAgcGF0dGVybjogL140LyxcbiAgICAgICAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgICAgICAgIGxlbmd0aDogWzEzLCAxNl0sXG4gICAgICAgICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgICAgICAgIGx1aG46IHRydWVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdHlwZTogJ21hc3RlcmNhcmQnLFxuICAgICAgICAgICAgcGF0dGVybjogL141WzAtNV0vLFxuICAgICAgICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICAgICAgICBsdWhuOiB0cnVlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6ICdhbWV4JyxcbiAgICAgICAgICAgIHBhdHRlcm46IC9eM1s0N10vLFxuICAgICAgICAgICAgZm9ybWF0OiAvKFxcZHsxLDR9KShcXGR7MSw2fSk/KFxcZHsxLDV9KT8vLFxuICAgICAgICAgICAgbGVuZ3RoOiBbMTVdLFxuICAgICAgICAgICAgY3ZjTGVuZ3RoOiBbMywgNF0sXG4gICAgICAgICAgICBsdWhuOiB0cnVlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6ICdkaW5lcnNjbHViJyxcbiAgICAgICAgICAgIHBhdHRlcm46IC9eM1swNjg5XS8sXG4gICAgICAgICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICAgICAgICBsZW5ndGg6IFsxNF0sXG4gICAgICAgICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgICAgICAgIGx1aG46IHRydWVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdHlwZTogJ2Rpc2NvdmVyJyxcbiAgICAgICAgICAgIHBhdHRlcm46IC9eNihbMDQ1XXwyMikvLFxuICAgICAgICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICAgICAgICBsdWhuOiB0cnVlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6ICd1bmlvbnBheScsXG4gICAgICAgICAgICBwYXR0ZXJuOiAvXig2Mnw4OCkvLFxuICAgICAgICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgICAgICAgbGVuZ3RoOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgICAgICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICAgICAgICBsdWhuOiBmYWxzZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0eXBlOiAnamNiJyxcbiAgICAgICAgICAgIHBhdHRlcm46IC9eMzUvLFxuICAgICAgICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICAgICAgICBsdWhuOiB0cnVlXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgY2FyZEZyb21OdW1iZXIgPSBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgdmFyIGNhcmQsIF9pLCBfbGVuO1xuICAgICAgICBudW0gPSAobnVtICsgJycpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gY2FyZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FyZCA9IGNhcmRzW19pXTtcbiAgICAgICAgICAgIGlmKGNhcmQudHlwZSA9PSAncnVwYXknKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpbl9kaWdpdHMgPSBudW0ucmVwbGFjZSgnICcsJycpLnNsaWNlKDAsNik7XG4gICAgICAgICAgICAgICAgaWYoKGJpbl9kaWdpdHMgPj0gNTA4NTAwICYmIGJpbl9kaWdpdHM8PTUwODk5OSkgfHxcbiAgICAgICAgICAgICAgICAgICAoYmluX2RpZ2l0cyA+PSA2MDY5ODUgJiYgYmluX2RpZ2l0czw9NjA3OTg0KSB8fFxuICAgICAgICAgICAgICAgICAgIChiaW5fZGlnaXRzID49IDYwODAwMSAmJiBiaW5fZGlnaXRzPD02MDg1MDApIHx8XG4gICAgICAgICAgICAgICAgICAgKGJpbl9kaWdpdHMgPj0gNjUyMTUwICYmIGJpbl9kaWdpdHM8PTY1MzE0OSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhcmQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FyZC5wYXR0ZXJuLnRlc3QobnVtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FyZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY2FyZEZyb21UeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgY2FyZCwgX2ksIF9sZW47XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gY2FyZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGNhcmQgPSBjYXJkc1tfaV07XG4gICAgICAgICAgICBpZiAoY2FyZC50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbHVobkNoZWNrID0gZnVuY3Rpb24obnVtKSB7XG4gICAgICAgIHZhciBkaWdpdCwgZGlnaXRzLCBvZGQsIHN1bSwgX2ksIF9sZW47XG4gICAgICAgIG9kZCA9IHRydWU7XG4gICAgICAgIHN1bSA9IDA7XG4gICAgICAgIGRpZ2l0cyA9IChudW0gKyAnJykuc3BsaXQoJycpLnJldmVyc2UoKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBkaWdpdHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGRpZ2l0ID0gZGlnaXRzW19pXTtcbiAgICAgICAgICAgIGRpZ2l0ID0gcGFyc2VJbnQoZGlnaXQsIDEwKTtcbiAgICAgICAgICAgIGlmICgob2RkID0gIW9kZCkpIHtcbiAgICAgICAgICAgICAgICBkaWdpdCAqPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRpZ2l0ID4gOSkge1xuICAgICAgICAgICAgICAgIGRpZ2l0IC09IDk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW0gKz0gZGlnaXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1bSAlIDEwID09PSAwO1xuICAgIH07XG5cbiAgICBoYXNUZXh0U2VsZWN0ZWQgPSBmdW5jdGlvbigkdGFyZ2V0KSB7XG4gICAgICAgIHZhciBfcmVmO1xuICAgICAgICBpZiAoKCR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPSBudWxsKSAmJiAkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT09ICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uRW5kJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50ICE9PSBudWxsID8gKF9yZWYgPSBkb2N1bWVudC5zZWxlY3Rpb24pICE9IG51bGwgPyBfcmVmLmNyZWF0ZVJhbmdlIDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgcmVGb3JtYXROdW1lcmljID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGFyZ2V0LCB2YWx1ZTtcbiAgICAgICAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmVGb3JtYXRDYXJkTnVtYmVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGFyZ2V0LCB2YWx1ZTtcbiAgICAgICAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICAgICAgICB2YWx1ZSA9ICQucGF5bWVudC5mb3JtYXRDYXJkTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3JtYXRDYXJkTnVtYmVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgJHRhcmdldCwgY2FyZCwgZGlnaXQsIGxlbmd0aCwgcmUsIHVwcGVyTGVuZ3RoLCB2YWx1ZTtcbiAgICAgICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgICAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIodmFsdWUgKyBkaWdpdCk7XG4gICAgICAgIGxlbmd0aCA9ICh2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpICsgZGlnaXQpLmxlbmd0aDtcbiAgICAgICAgdXBwZXJMZW5ndGggPSAxNjtcbiAgICAgICAgaWYgKGNhcmQpIHtcbiAgICAgICAgICAgIHVwcGVyTGVuZ3RoID0gY2FyZC5sZW5ndGhbY2FyZC5sZW5ndGgubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlbmd0aCA+PSB1cHBlckxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhcmQgJiYgY2FyZC50eXBlID09PSAnYW1leCcpIHtcbiAgICAgICAgICAgIHJlID0gL14oXFxkezR9fFxcZHs0fVxcc1xcZHs2fSkkLztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlID0gLyg/Ol58XFxzKShcXGR7NH0pJC87XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUgKyAnICcgKyBkaWdpdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChyZS50ZXN0KHZhbHVlICsgZGlnaXQpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUgKyBkaWdpdCArICcgJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmb3JtYXRCYWNrQ2FyZE51bWJlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICAgIGlmIChlLndoaWNoICE9PSA4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCgkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT0gbnVsbCkgJiYgJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9PSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoL1xcZFxccyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkXFxzJC8sICcnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgvXFxzXFxkPyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkJC8sICcnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZUZvcm1hdEV4cGlyeSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAgICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgICAgICAgdmFsdWUgPSAkLnBheW1lbnQuZm9ybWF0RXhwaXJ5KHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsO1xuICAgICAgICBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCk7XG4gICAgICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgICAgIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiAodmFsICE9PSAnMCcgJiYgdmFsICE9PSAnMScpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCIwXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKC9eXFxkXFxkJC8udGVzdCh2YWwpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCJcIiArIHZhbCArIFwiIC8gXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9ybWF0Rm9yd2FyZEV4cGlyeSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWw7XG4gICAgICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIHZhbCA9ICR0YXJnZXQudmFsKCk7XG4gICAgICAgIGlmICgvXlxcZFxcZCQvLnRlc3QodmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmb3JtYXRGb3J3YXJkU2xhc2hBbmRTcGFjZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICR0YXJnZXQsIHZhbCwgd2hpY2g7XG4gICAgICAgIHdoaWNoID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICAgICAgaWYgKCEod2hpY2ggPT09ICcvJyB8fCB3aGljaCA9PT0gJyAnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIHZhbCA9ICR0YXJnZXQudmFsKCk7XG4gICAgICAgIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiB2YWwgIT09ICcwJykge1xuICAgICAgICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiMFwiICsgdmFsICsgXCIgLyBcIik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9ybWF0QmFja0V4cGlyeSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICAgIGlmIChlLndoaWNoICE9PSA4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCgkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT0gbnVsbCkgJiYgJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9PSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoL1xcZFxcc1xcL1xccyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkXFxzXFwvXFxzJC8sICcnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZUZvcm1hdENWQyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAgICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDQpO1xuICAgICAgICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJlc3RyaWN0TnVtZXJpYyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGlucHV0O1xuICAgICAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDMyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLndoaWNoIDwgMzMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICAgICAgcmV0dXJuICEhL1tcXGRcXHNdLy50ZXN0KGlucHV0KTtcbiAgICB9O1xuXG4gICAgcmVzdHJpY3RDYXJkTnVtYmVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgJHRhcmdldCwgY2FyZCwgZGlnaXQsIHZhbHVlO1xuICAgICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCk7XG4gICAgICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzVGV4dFNlbGVjdGVkKCR0YXJnZXQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgPSAoJHRhcmdldC52YWwoKSArIGRpZ2l0KS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgICAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIodmFsdWUpO1xuICAgICAgICBpZiAoY2FyZCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPD0gMTY7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVzdHJpY3RFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsdWU7XG4gICAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQoJHRhcmdldCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCkgKyBkaWdpdDtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gNikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJlc3RyaWN0Q1ZDID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgJHRhcmdldCwgZGlnaXQsIHZhbDtcbiAgICAgICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgICAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc1RleHRTZWxlY3RlZCgkdGFyZ2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhbCA9ICR0YXJnZXQudmFsKCkgKyBkaWdpdDtcbiAgICAgICAgcmV0dXJuIHZhbC5sZW5ndGggPD0gNDtcbiAgICB9O1xuXG4gICAgc2V0Q2FyZFR5cGUgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkdGFyZ2V0LCBhbGxUeXBlcywgY2FyZCwgY2FyZFR5cGUsIHZhbDtcbiAgICAgICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgdmFsID0gJHRhcmdldC52YWwoKTtcbiAgICAgICAgY2FyZFR5cGUgPSAkLnBheW1lbnQuY2FyZFR5cGUodmFsKSB8fCAndW5rbm93bic7XG4gICAgICAgIGlmICghJHRhcmdldC5oYXNDbGFzcyhjYXJkVHlwZSkpIHtcbiAgICAgICAgICAgIGFsbFR5cGVzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBfaSwgX2xlbiwgX3Jlc3VsdHM7XG4gICAgICAgICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGNhcmRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmQgPSBjYXJkc1tfaV07XG4gICAgICAgICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goY2FyZC50eXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ3Vua25vd24nKTtcbiAgICAgICAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoYWxsVHlwZXMuam9pbignICcpKTtcbiAgICAgICAgICAgICR0YXJnZXQuYWRkQ2xhc3MoY2FyZFR5cGUpO1xuICAgICAgICAgICAgJHRhcmdldC50b2dnbGVDbGFzcygnaWRlbnRpZmllZCcsIGNhcmRUeXBlICE9PSAndW5rbm93bicpO1xuICAgICAgICAgICAgcmV0dXJuICR0YXJnZXQudHJpZ2dlcigncGF5bWVudC5jYXJkVHlwZScsIGNhcmRUeXBlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLnBheW1lbnQuZm4uZm9ybWF0Q2FyZENWQyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3RDVkMpO1xuICAgICAgICB0aGlzLm9uKCdwYXN0ZScsIHJlRm9ybWF0Q1ZDKTtcbiAgICAgICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRDVkMpO1xuICAgICAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0Q1ZDKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgICQucGF5bWVudC5mbi5mb3JtYXRDYXJkRXhwaXJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgICAgICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdEV4cGlyeSk7XG4gICAgICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0RXhwaXJ5KTtcbiAgICAgICAgdGhpcy5vbigna2V5cHJlc3MnLCBmb3JtYXRGb3J3YXJkU2xhc2hBbmRTcGFjZSk7XG4gICAgICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0Rm9yd2FyZEV4cGlyeSk7XG4gICAgICAgIHRoaXMub24oJ2tleWRvd24nLCBmb3JtYXRCYWNrRXhwaXJ5KTtcbiAgICAgICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRFeHBpcnkpO1xuICAgICAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0RXhwaXJ5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgICQucGF5bWVudC5mbi5mb3JtYXRDYXJkTnVtYmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgICAgICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdENhcmROdW1iZXIpO1xuICAgICAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdENhcmROdW1iZXIpO1xuICAgICAgICB0aGlzLm9uKCdrZXlkb3duJywgZm9ybWF0QmFja0NhcmROdW1iZXIpO1xuICAgICAgICB0aGlzLm9uKCdrZXl1cCcsIHNldENhcmRUeXBlKTtcbiAgICAgICAgdGhpcy5vbigncGFzdGUnLCByZUZvcm1hdENhcmROdW1iZXIpO1xuICAgICAgICB0aGlzLm9uKCdjaGFuZ2UnLCByZUZvcm1hdENhcmROdW1iZXIpO1xuICAgICAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgICAgIHRoaXMub24oJ2lucHV0Jywgc2V0Q2FyZFR5cGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgJC5wYXltZW50LmZuLnJlc3RyaWN0TnVtZXJpYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgICAgIHRoaXMub24oJ3Bhc3RlJywgcmVGb3JtYXROdW1lcmljKTtcbiAgICAgICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXROdW1lcmljKTtcbiAgICAgICAgdGhpcy5vbignaW5wdXQnLCByZUZvcm1hdE51bWVyaWMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgJC5wYXltZW50LmZuLmNhcmRFeHBpcnlWYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQucGF5bWVudC5jYXJkRXhwaXJ5VmFsKCQodGhpcykudmFsKCkpO1xuICAgIH07XG5cbiAgICAkLnBheW1lbnQuY2FyZEV4cGlyeVZhbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciBtb250aCwgcHJlZml4LCB5ZWFyLCBfcmVmO1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAgICAgIF9yZWYgPSB2YWx1ZS5zcGxpdCgnLycsIDIpLCBtb250aCA9IF9yZWZbMF0sIHllYXIgPSBfcmVmWzFdO1xuICAgICAgICBpZiAoKHllYXIgIT0gbnVsbCA/IHllYXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMiAmJiAvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICAgICAgICBwcmVmaXggPSAobmV3IERhdGUpLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICBwcmVmaXggPSBwcmVmaXgudG9TdHJpbmcoKS5zbGljZSgwLCAyKTtcbiAgICAgICAgICAgIHllYXIgPSBwcmVmaXggKyB5ZWFyO1xuICAgICAgICB9XG4gICAgICAgIG1vbnRoID0gcGFyc2VJbnQobW9udGgsIDEwKTtcbiAgICAgICAgeWVhciA9IHBhcnNlSW50KHllYXIsIDEwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgIHllYXI6IHllYXJcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgJC5wYXltZW50LnZhbGlkYXRlQ2FyZE51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICB2YXIgY2FyZCwgX3JlZjtcbiAgICAgICAgbnVtID0gKG51bSArICcnKS5yZXBsYWNlKC9cXHMrfC0vZywgJycpO1xuICAgICAgICBpZiAoIS9eXFxkKyQvLnRlc3QobnVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcihudW0pO1xuICAgICAgICBpZiAoIWNhcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKF9yZWYgPSBudW0ubGVuZ3RoLCBfX2luZGV4T2YuY2FsbChjYXJkLmxlbmd0aCwgX3JlZikgPj0gMCkgJiYgKGNhcmQubHVobiA9PT0gZmFsc2UgfHwgbHVobkNoZWNrKG51bSkpO1xuICAgIH07XG5cbiAgICAkLnBheW1lbnQudmFsaWRhdGVDYXJkRXhwaXJ5ID0gZnVuY3Rpb24obW9udGgsIHllYXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRUaW1lLCBleHBpcnksIF9yZWY7XG4gICAgICAgIGlmICh0eXBlb2YgbW9udGggPT09ICdvYmplY3QnICYmICdtb250aCcgaW4gbW9udGgpIHtcbiAgICAgICAgICAgIF9yZWYgPSBtb250aCwgbW9udGggPSBfcmVmLm1vbnRoLCB5ZWFyID0gX3JlZi55ZWFyO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKG1vbnRoICYmIHllYXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbW9udGggPSAkLnRyaW0obW9udGgpO1xuICAgICAgICB5ZWFyID0gJC50cmltKHllYXIpO1xuICAgICAgICBpZiAoIS9eXFxkKyQvLnRlc3QobW9udGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoKDEgPD0gbW9udGggJiYgbW9udGggPD0gMTIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5ZWFyLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgaWYgKHllYXIgPCA3MCkge1xuICAgICAgICAgICAgICAgIHllYXIgPSBcIjIwXCIgKyB5ZWFyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB5ZWFyID0gXCIxOVwiICsgeWVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoeWVhci5sZW5ndGggIT09IDQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBleHBpcnkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCk7XG4gICAgICAgIGN1cnJlbnRUaW1lID0gbmV3IERhdGU7XG4gICAgICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSAtIDEpO1xuICAgICAgICBleHBpcnkuc2V0TW9udGgoZXhwaXJ5LmdldE1vbnRoKCkgKyAxLCAxKTtcbiAgICAgICAgcmV0dXJuIGV4cGlyeSA+IGN1cnJlbnRUaW1lO1xuICAgIH07XG5cbiAgICAkLnBheW1lbnQudmFsaWRhdGVDYXJkQ1ZDID0gZnVuY3Rpb24oY3ZjLCB0eXBlKSB7XG4gICAgICAgIHZhciBjYXJkLCBfcmVmO1xuICAgICAgICBjdmMgPSAkLnRyaW0oY3ZjKTtcbiAgICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KGN2YykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjYXJkID0gY2FyZEZyb21UeXBlKHR5cGUpO1xuICAgICAgICBpZiAoY2FyZCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlZiA9IGN2Yy5sZW5ndGgsIF9faW5kZXhPZi5jYWxsKGNhcmQuY3ZjTGVuZ3RoLCBfcmVmKSA+PSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGN2Yy5sZW5ndGggPj0gMyAmJiBjdmMubGVuZ3RoIDw9IDQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJC5wYXltZW50LmNhcmRUeXBlID0gZnVuY3Rpb24obnVtKSB7XG4gICAgICAgIHZhciBfcmVmO1xuICAgICAgICBpZiAoIW51bSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgoX3JlZiA9IGNhcmRGcm9tTnVtYmVyKG51bSkpICE9IG51bGwgPyBfcmVmLnR5cGUgOiB2b2lkIDApIHx8IG51bGw7XG4gICAgfTtcblxuICAgICQucGF5bWVudC5mb3JtYXRDYXJkTnVtYmVyID0gZnVuY3Rpb24obnVtKSB7XG4gICAgICAgIHZhciBjYXJkLCBncm91cHMsIHVwcGVyTGVuZ3RoLCBfcmVmO1xuICAgICAgICBudW0gPSBudW0ucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICAgICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKG51bSk7XG4gICAgICAgIGlmICghY2FyZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bTtcbiAgICAgICAgfVxuICAgICAgICB1cHBlckxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuICAgICAgICBudW0gPSBudW0uc2xpY2UoMCwgdXBwZXJMZW5ndGgpO1xuICAgICAgICBpZiAoY2FyZC5mb3JtYXQuZ2xvYmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gKF9yZWYgPSBudW0ubWF0Y2goY2FyZC5mb3JtYXQpKSAhPSBudWxsID8gX3JlZi5qb2luKCcgJykgOiB2b2lkIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm91cHMgPSBjYXJkLmZvcm1hdC5leGVjKG51bSk7XG4gICAgICAgICAgICBpZiAoZ3JvdXBzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cHMuc2hpZnQoKTtcbiAgICAgICAgICAgIGdyb3VwcyA9ICQuZ3JlcChncm91cHMsIGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGdyb3Vwcy5qb2luKCcgJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJC5wYXltZW50LmZvcm1hdEV4cGlyeSA9IGZ1bmN0aW9uKGV4cGlyeSkge1xuICAgICAgICB2YXIgbW9uLCBwYXJ0cywgc2VwLCB5ZWFyO1xuICAgICAgICBwYXJ0cyA9IGV4cGlyeS5tYXRjaCgvXlxcRCooXFxkezEsMn0pKFxcRCspPyhcXGR7MSw0fSk/Lyk7XG4gICAgICAgIGlmICghcGFydHMpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBtb24gPSBwYXJ0c1sxXSB8fCAnJztcbiAgICAgICAgc2VwID0gcGFydHNbMl0gfHwgJyc7XG4gICAgICAgIHllYXIgPSBwYXJ0c1szXSB8fCAnJztcbiAgICAgICAgaWYgKHllYXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VwID0gJyAvICc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VwID09PSAnIC8nKSB7XG4gICAgICAgICAgICBtb24gPSBtb24uc3Vic3RyaW5nKDAsIDEpO1xuICAgICAgICAgICAgc2VwID0gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAobW9uLmxlbmd0aCA9PT0gMiB8fCBzZXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VwID0gJyAvICc7XG4gICAgICAgIH0gZWxzZSBpZiAobW9uLmxlbmd0aCA9PT0gMSAmJiAobW9uICE9PSAnMCcgJiYgbW9uICE9PSAnMScpKSB7XG4gICAgICAgICAgICBtb24gPSBcIjBcIiArIG1vbjtcbiAgICAgICAgICAgIHNlcCA9ICcgLyAnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb24gKyBzZXAgKyB5ZWFyO1xuICAgIH07XG5cbn0pLmNhbGwodGhpcyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9qcy9qcXVlcnkucGF5bWVudC5qc1xuLy8gbW9kdWxlIGlkID0gOTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDUgMTAiLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGlucHV0IFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY2xhc3Nlc1wiLFwic3RhdGVcIixcImxhcmdlXCIsXCJ2YWx1ZVwiXSxcInNcIjpcIl8wKF8xLF8yLF8zKVwifX1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHBsYWNlaG9sZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBsYWNlaG9sZGVyXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwibGFyZ2VcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpbe1widFwiOjQsXCJmXCI6W1widGV4dFwiXSxcIm5cIjo1MCxcInJcIjpcImRpc2FibGVkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcInRlbFwiXSxcInJcIjpcImRpc2FibGVkXCJ9XSxcIm5hbWVcIjpbe1widFwiOjIsXCJyXCI6XCJuYW1lXCJ9XSxcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wicGxhY2Vob2xkZXI9XFxcIlwiLHtcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn0sXCJcXFwiXCJdLFwiblwiOjUxLFwiclwiOlwibGFyZ2VcIn0se1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTAsXCJyXCI6XCJkaXNhYmxlZFwifSx7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZD1cXFwiZGlzYWJsZWRcXFwiXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzdGF0ZS5kaXNhYmxlZFwiLFwic3RhdGUuc3VibWl0dGluZ1wiXSxcInNcIjpcIl8wfHxfMVwifX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkTGlzdCBjbGVhckZpeCBmTGVmdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6W1wiY2FyZFR5cGUgXCIse1widFwiOjIsXCJyXCI6XCJjY3R5cGVcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjY3R5cGVcIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcImNjdHlwZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkTGlzdCBjbGVhckZpeCBmTGVmdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSB2aXNhXCJ9LFwiZlwiOltcIlZpc2FcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FyZFR5cGUgbWFzdGVyXCJ9LFwiZlwiOltcIk1hc3RlcmNhcmRcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRUeXBlIHJ1cGF5XCJ9LFwiZlwiOltcIlJ1cGF5XCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImNhcmRUeXBlXCJdLFwic1wiOlwiMSE9XzAmJjUhPV8wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSBhbWV4XCJ9LFwiZlwiOltcIkFtZXJpY2FuIEV4cHJlc3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FyZFR5cGUgZGluZXJzXCJ9LFwiZlwiOltcIkRpbmVyc1wiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJjYXJkVHlwZVwiXSxcInNcIjpcIjE9PV8wfHw1PT1fMFwifX1dfV0sXCJyXCI6XCJjY3R5cGVcIn1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9jYy5odG1sXG4vLyBtb2R1bGUgaWQgPSAxMDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDUgMTAiLCIndXNlIHN0cmljdCc7XG5cbi8vcmVxdWlyZSgnanF1ZXJ5LnBheW1lbnQnKTtcbnJlcXVpcmUoJy4uLy4uLy4uLy4uLy4uL2pzL2pxdWVyeS5wYXltZW50Jyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuLi9pbnB1dCcpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgIHR5cGU6ICd0ZWwnXG4gICAgICAgICAgIC8vIHR5cGU6ICdwYXNzd29yZCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdmb3JtYXRDYXJkQ1ZDJyk7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkucGF5bWVudCgnZGVzdHJveScpO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29yZS9mb3JtL2NjL2N2di5qc1xuLy8gbW9kdWxlIGlkID0gMTAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCA1IDEwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG4gICAgO1xuXG52YXIgUGF5bWVudCA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvcGF5bWVudCcpXG4gICAgO1xuXG5yZXF1aXJlKCd3ZWIvbW9kdWxlcy9wYXltZW50Lmxlc3MnKTtcblxuJChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF5bWVudCA9IG5ldyBQYXltZW50KCk7XG4gICAgcGF5bWVudC5zZXQoJ3BheW1lbnQnLCAkKCdbZGF0YS1wYXltZW50XScpLmRhdGEoJ3BheW1lbnQnKSk7XG4gICAgLy9jb25zb2xlLmxvZygkKCdbZGF0YS1wYXltZW50XScpLmRhdGEoJ3BheW1lbnQnKSk7XG4gICAgLy9jb25zb2xlLmxvZyhwYXltZW50LmdldCgncGF5bWVudCcpKTtcbiAgICBwYXltZW50LnJlbmRlcignI2FwcCcpO1xufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL3BheW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDM5M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUSA9IHJlcXVpcmUoJ3EnKSxcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcbiAgICA7XG5cbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpLFxuICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJylcbiAgICA7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xuICAgIGlzb2xhdGVkOiB0cnVlLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvcGF5bWVudC9pbmRleC5odG1sJyksXG5cbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdsYXlvdXQnOiByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9sYXlvdXQnKSxcbiAgICAgICAgJ3BheW1lbnQtZm9ybSc6IHJlcXVpcmUoJy4vZm9ybScpXG4gICAgfSxcblxuICAgIHBhcnRpYWxzOiB7XG4gICAgICAgICdiYXNlLXBhbmVsJzogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9sYXlvdXQvcGFuZWwuaHRtbCcpXG4gICAgfSxcblxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE1ldGEuaW5zdGFuY2UoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKG1ldGEpIHsgcmV0dXJuIHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7IH0uYmluZCh0aGlzKSlcbiAgICB9LFxuXG4gICAgc2lnbmluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuICAgICAgICBBdXRoLmxvZ2luKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgbGVmdE1lbnU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRvZ2dsZSgnbGVmdG1lbnUnKTtcbiAgICAgICAgLy92YXIgZmxhZz10aGlzLnRvZ2dsZSgnbGVmdG1lbnUnKTsgdGhpcy5zZXQoJ2xlZnRtZW51JywgIWZsYWcpO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9wYXltZW50L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzOTRcbi8vIG1vZHVsZSBjaHVua3MgPSAxMCIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicGF5bWVudC1mb3JtXCIsXCJhXCI6e1wicGF5bWVudFwiOlt7XCJ0XCI6MixcInJcIjpcInBheW1lbnRcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL3BheW1lbnQvaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gMzk1XG4vLyBtb2R1bGUgY2h1bmtzID0gMTAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXG4gICAgICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxuICAgICAgICA7XG5cbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXG4gICAgICAgIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JyksXG4gICAgICAgIGhfZHVyYXRpb24gPSByZXF1aXJlKCdoZWxwZXJzL2R1cmF0aW9uJykoKSxcbiAgICAgICAgaF9kYXRlID0gcmVxdWlyZSgnaGVscGVycy9kYXRlJykoKVxuICAgICAgICA7XG5cbnZhciBkb1BheSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGZvcm07XG4gICAgZm9ybSA9ICQoJzxmb3JtIC8+Jywge1xuICAgICAgICBpZDogJ3RtcEZvcm0nLFxuICAgICAgICBhY3Rpb246IGRhdGEudXJsLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgc3R5bGU6ICdkaXNwbGF5OiBub25lOydcbiAgICB9KTtcblxuICAgIHZhciBpbnB1dCA9IGRhdGEuZGF0YTtcbiAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAndW5kZWZpbmVkJyAmJiBpbnB1dCAhPT0gbnVsbCkge1xuICAgICAgICAkLmVhY2goaW5wdXQsIGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJCgnPGlucHV0IC8+Jywge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oZm9ybSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvcm0uYXBwZW5kVG8oJ2JvZHknKS5zdWJtaXQoKTtcbn07XG5cbnZhciBjaGVja1VwaVN0YXR1cyA9IGZ1bmN0aW9uIChkYXRhLCB2aWV3KSB7XG4gICAgdmFyIHJlc3BvbnNlID0gZGF0YS5kYXRhO1xuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gJ1NVQ0NFU1MnICYmIHJlc3BvbnNlLm9yZGVySWQpIHtcbiAgICAgICAgdmFyIHRpbWVyID0gMDtcbiAgICAgICAgdmFyIHRpbWVySUQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGltZXIgPT0gKDYwICogMTAwMCAqIDExKSkge1xuICAgICAgICAgICAgICAgIHN0ZXAuY29tcGxldGUodmlldywgMyk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcklEKTtcbiAgICAgICAgICAgICAgICAkKCcjbWVzc2FnZScpLmh0bWwoJ1RyYW5zYWN0aW9uIHRpbWVkIG91dC5QbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAvL3RpbWVvdXQ6IDYwMDAwLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvaGRmY1VQSScsXG4gICAgICAgICAgICAgICAgZGF0YTogeydvcmRlcklkJzogcmVzcG9uc2Uub3JkZXJJZH0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzICE9ICdQRU5ESU5HJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcklEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9wYXlHYXRlL3VwaVZpZXcvb3JkZXJJZC8nICsgcmVzcG9uc2UuZGF0YS5vcmRlcklkO1xuICAgICAgICAgICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyICs9IDEwMDAwO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcklEKTtcbiAgICAgICAgICAgICAgICAgICAgc3RlcC5jb21wbGV0ZSh2aWV3LCAzKTtcbiAgICAgICAgICAgICAgICAgICAgc3RlcC5lcnJvcih2aWV3LCAzLCB4aHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sIDEwMDAwKTtcbiAgICB9XG59O1xuXG52YXIgdXBpUGF5bWVudFJlc3BvbnNlID0gZnVuY3Rpb24gKGRhdGEsIHZpZXcpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBkYXRhLmRhdGE7XG5cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09ICdGQUlMRUQnKSB7XG4gICAgICAgIHN0ZXAuY29tcGxldGUodmlldywgMyk7XG4gICAgICAgIERpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgIGhlYWRlcjogJ1RyYW5zYWN0aW9uIEFsZXJ0JyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHJlc3BvbnNlLm1lc3NhZ2UgKyAnPC9kaXY+JyxcblxuICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgIFsnQmFjayB0byBTZWFyY2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2ZsaWdodHMnICsgdmlldy5nZXQoJ3NlYXJjaHVybCcpICsgJz9mb3JjZT0xJztcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjbG9zZUJ1dHRvbjogZmFsc2VcbiAgICAgICAgfSwgMik7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09ICdTVUNDRVNTJykge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiPGRpdiBzdHlsZT0nZm9udC1zaXplOjE2cHg7Jz5XZSBoYXZlIHNlbnQgcGF5bWVudCBub3RpZmljYXRpb24gdG8geW91ciBtb2JpbGUgZGV2aWNlLjxici8+UGxlYXNlIGNvbXBsZXRlIHRoZSB0cmFuc2FjdGlvbiB1c2luZyB5b3VyIG1vYmlsZS48L2Rpdj5cIjtcbiAgICAgICAgJCgnLndhaXRfdGV4dCcpLmh0bWwobWVzc2FnZSk7XG4gICAgICAgIGNoZWNrVXBpU3RhdHVzKGRhdGEsIHZpZXcpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xuICAgIGlzb2xhdGVkOiB0cnVlLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvcGF5bWVudC9mb3JtLmh0bWwnKSxcblxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ3VpLWNjJzogcmVxdWlyZSgnY29yZS9mb3JtL2NjL251bWJlcicpLFxuICAgICAgICAndWktY3Z2JzogcmVxdWlyZSgnY29yZS9mb3JtL2NjL2N2dicpXG4gICAgfSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjdGl2ZTogMSxcbiAgICAgICAgICAgIGNjOiB7XG4gICAgICAgICAgICAgICAgc3RvcmU6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhY2NlcHRlZDogdHJ1ZSxcbiAgICAgICAgICAgIG1vbmV5OiBoX21vbmV5LFxuICAgICAgICAgICAgZHVyYXRpb246IGhfZHVyYXRpb24sXG4gICAgICAgICAgICBkYXRlOiBoX2RhdGUsXG4gICAgICAgICAgICBiYW5rczogW1xuXG4gICAgICAgICAgICAgICAge2lkOiAnQVhJQicsIHRleHQ6ICdBWElTIEJhbmsnLCBsb2dvOiAnYXhpc19iYW5rJ30sIC8vIHtpZDogJ0FYSUInICwgdGV4dDogJ0FYSVMgQmFuayBOZXRCYW5raW5nJyB9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwNDUnLCB0ZXh0OiAnQmFuayBvZiBCYXJvZGEgQ29ycG9yYXRlJywgbG9nbzogJ2Jhbmtfb2ZfYmFyb2RhJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnMTA0NicsIHRleHQ6ICdCYW5rIG9mIEJhcm9kYSBSZXRhaWwnLCBsb2dvOiAnYmFua19vZl9iYXJvZGEnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdCT0lCJywgdGV4dDogJ0Jhbmsgb2YgSW5kaWEnLCBsb2dvOiAnYmFua19vZl9pbmRpYSd9LCAvL1BheXUge2lkOiAnQk9JQicgLCB0ZXh0OiAnQmFuayBvZiBJbmRpYScgfSwgQXRvbSB7aWQ6ICcxMDEyJyAsIHRleHQ6ICdCYW5rIG9mIEluZGlhJyB9LFxuICAgICAgICAgICAgICAgIHtpZDogJ0JPTUInLCB0ZXh0OiAnQmFuayBvZiBNYWhhcmFzaHRyYScsIGxvZ286ICdiYW5rX29mX21haGFyYXNodHJhJ30sIC8vUGF5dSB7aWQ6ICdCT01CJywgdGV4dDogJ0Jhbmsgb2YgTWFoYXJhc2h0cmEnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDMwJywgdGV4dDogJ0NhbmFyYSBCYW5rIE5ldEJhbmtpbmcnLCBsb2dvOiAnY2FuYXJhX2JhbmsnfSwgLy97aWQ6ICdDQUJCJywgdGV4dDogJ0NhbmFyYSBCYW5rJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnMTAzNCcsIHRleHQ6ICdDYW5hcmEgQmFuayBEZWJpdENhcmQnLCBsb2dvOiAnY2FuYXJhX2JhbmsnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdDU0JOJywgdGV4dDogJ0NhdGhvbGljIFN5cmlhbiBCYW5rJywgbG9nbzogJ2NhdGhvbGljX3N5cmlhbl9iYW5rJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnQ0JJQicsIHRleHQ6ICdDZW50cmFsIEJhbmsgT2YgSW5kaWEnLCBsb2dvOiAnY2VudHJhbF9iYW5rX29mX2luZGlhJ30sIC8ve2lkOiAnQ0JJQicsIHRleHQ6ICdDZW50cmFsIEJhbmsgT2YgSW5kaWEnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDIwJywgdGV4dDogJ0NpdHkgVW5pb24gQmFuaycsIGxvZ286ICdjaXR5X3VuaW9uX2JhbmsnfSwgLy97aWQ6ICdDVUJCJywgdGV4dDogJ0NpdHlVbmlvbid9LFxuICAgICAgICAgICAgICAgIC8qe2lkOiAnQ0lUTkInLCB0ZXh0OiAnQ2l0aSBCYW5rIE5ldEJhbmtpbmcnICwgbG9nbzogJ2NpdGlfYmFua19uZXRiYW5raW5nJ30sKi9cbiAgICAgICAgICAgICAgICB7aWQ6ICdDUlBCJywgdGV4dDogJ0NvcnBvcmF0aW9uIEJhbmsnLCBsb2dvOiAnY29ycG9yYXRpb25fYmFuayd9LCAvL3tpZDogJ0NSUEInLCB0ZXh0OiAnQ29ycG9yYXRpb24gQmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwNDcnLCB0ZXh0OiAnREJTIEJhbmsgTHRkJywgbG9nbzogJ2RzYl9iYW5rJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnMTA0MicsIHRleHQ6ICdEQ0IgQmFuayBCdXNpbmVzcycsIGxvZ286ICdkY2JfYmFuayd9LCAvL3tpZDogJ0RDQkInLCB0ZXh0OiAnRGV2ZWxvcG1lbnQgQ3JlZGl0IEJhbmsnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDI3JywgdGV4dDogJ0RDQiBCYW5rIFBlcnNvbmFsJywgbG9nbzogJ2RjYl9iYW5rJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnRFNIQicsIHRleHQ6ICdEZXV0c2NoZSBCYW5rJywgbG9nbzogJ2RldXRzY2hlX2JhbmsnfSwgLy97aWQ6ICdEU0hCJywgdGV4dDogJ0RldXRzY2hlIEJhbmsnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdETFNCJywgdGV4dDogJ0RoYW5sYXhtaSBCYW5rJywgbG9nbzogJ2RoYW5sYWtzaG1pX2JhbmsnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdGRURCJywgdGV4dDogJ0ZlZGVyYWwgQmFuaycsIGxvZ286ICdmZWRlcmFsX2JhbmsnfSwgLy97aWQ6ICdGRURCJywgdGV4dDogJ0ZlZGVyYWwgQmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ0hERkInLCB0ZXh0OiAnSERGQyBCYW5rJywgbG9nbzogJ2hkZmNfYmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ0lDSUInLCB0ZXh0OiAnSUNJQ0kgTmV0YmFua2luZycsIGxvZ286ICdpY2ljaV9iYW5rJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnSURCQicsIHRleHQ6ICdJREJJIEJhbmsnLCBsb2dvOiAnaWRiaV9iYW5rJ30sIC8ve2lkOiAnSURCQicsIHRleHQ6ICdJbmR1c3RyaWFsIERldmVsb3BtZW50IEJhbmsgb2YgSW5kaWEnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdJTkRCJywgdGV4dDogJ0luZGlhbiBCYW5rICcsIGxvZ286ICdpbmRpYW5fYmFuayd9LCAvL3tpZDogJ0lOREInLCB0ZXh0OiAnSW5kaWFuIEJhbmsgJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnSU5JQicsIHRleHQ6ICdJbmR1c0luZCBCYW5rJywgbG9nbzogJ2luZHVzaW5kX2JhbmsnfSwgLy97aWQ6ICdJTklCJywgdGV4dDogJ0luZHVzSW5kIEJhbmsnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdJTk9CJywgdGV4dDogJ0luZGlhbiBPdmVyc2VhcyBCYW5rJywgbG9nbzogJ2luZGlhbl9vdmVyc2Vhc19iYW5rJ30sIC8ve2lkOiAnSU5PQicsIHRleHQ6ICdJbmRpYW4gT3ZlcnNlYXMgQmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ0pBS0InLCB0ZXh0OiAnSmFtbXUgYW5kIEthc2htaXIgQmFuaycsIGxvZ286ICdqX2tfYmFuayd9LCAvL3tpZDogJ0pBS0InLCB0ZXh0OiAnSmFtbXUgYW5kIEthc2htaXIgQmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ0tSS0InLCB0ZXh0OiAnS2FybmF0YWthIEJhbmsnLCBsb2dvOiAna2FybmF0YWthX2JhbmsnfSwgLy97aWQ6ICdLUktCJywgdGV4dDogJ0thcm5hdGFrYSBCYW5rJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnMTAxOCcsIHRleHQ6ICdLYXJ1ciBWeXN5YSAnLCBsb2dvOiAna2FydXJfdnlzeWEnfSwgLy97aWQ6ICdLUlZCJywgdGV4dDogJ0thcnVyIFZ5c3lhICd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzE2MkInLCB0ZXh0OiAnS290YWsgTWFoaW5kcmEgQmFuaycsIGxvZ286ICdrb3Rha19tYWhpbmRyYV9iYW5rJ30sIC8ve2lkOiAnMTYyQicsIHRleHQ6ICdLb3RhayBCYW5rJ31cbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDA5JywgdGV4dDogJ0xha3NobWkgVmlsYXMgQmFuayBOZXRCYW5raW5nJywgbG9nbzogJ2xha3NobWlfdmlsYXMnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdPQkNCJywgdGV4dDogJ09yaWVudGFsIEJhbmsgT2YgQ29tbWVyY2UnLCBsb2dvOiAnb2JjJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnUFNCTkInLCB0ZXh0OiAnUHVuamFiIEFuZCBTaW5kIEJhbmsnLCBsb2dvOiAncHVuamFiX3NpbmRoX2JhbmsnfSwgLy97aWQ6ICdQU0JOQicsIHRleHQ6ICdQdW5qYWIgQW5kIFNpbmQgQmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ1BOQkInLCB0ZXh0OiAnUHVuamFiIE5hdGlvbmFsIEJhbmsg4oCTIFJldGFpbCcsIGxvZ286ICdwbmJfcmV0YWlsJ30sXG4gICAgICAgICAgICAgICAgLyp7aWQ6ICcxMDUwJywgdGV4dDogJ1JveWFsIEJhbmsgT2YgU2NvdGxhbmQnICwgbG9nbzogJ3JveWFsX2Jhbmtfc2NvdGxhbmQnfSxcbiAgICAgICAgICAgICAgICAge2lkOiAnMTA1MycsIHRleHQ6ICdTYXJhU3dhdCBCYW5rJyAsIGxvZ286ICdzYXJhc3dhdF9iYW5rJ30sKi9cbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDUxJywgdGV4dDogJ1N0YW5kYXJkIENoYXJ0ZXJlZCBCYW5rJywgbG9nbzogJ3N0YW5kYXJkX2NoYXJ0ZXJlZCd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ1NCQkpCJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgQmlrYW5lciBhbmQgSmFpcHVyJywgbG9nbzogJ3NiYmonfSwgLy97aWQ6ICdTQkJKQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEJpa2FuZXIgYW5kIEphaXB1cid9LFxuICAgICAgICAgICAgICAgIHtpZDogJ1NCSEInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBIeWRlcmFiYWQnLCAvKmxvZ286ICdzYmhiJyovfSwgLy97aWQ6ICdTQkhCJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgSHlkZXJhYmFkJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnU0JJQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEluZGlhJywgbG9nbzogJ3NiaWInfSwgLy97aWQ6ICdTQklCJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgSW5kaWEnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdTQk1CJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgTXlzb3JlJywgLypsb2dvOiAnc2JtYicqL30sIC8ve2lkOiAnU0JNQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIE15c29yZSd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ1NCUEInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBQYXRpYWxhJywgbG9nbzogJ3NicGInfSwgLy97aWQ6ICdTQlBCJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgUGF0aWFsYSd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ1NCVEInLCB0ZXh0OiAnU3RhdGUgQmFuayBvZiBUcmF2YW5jb3JlJywgLypsb2dvOiAnc2J0YicqL30sIC8ve2lkOiAnU0JUQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIFRyYXZhbmNvcmUnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdTT0lCJywgdGV4dDogJ1NvdXRoIEluZGlhbiBCYW5rJywgbG9nbzogJ3NvdXRoX2luZGlhbl9iYW5rJ30sIC8ve2lkOiAnU09JQicsIHRleHQ6ICdTb3V0aCBJbmRpYW4gQmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJ1VCSUInLCB0ZXh0OiAnVW5pb24gQmFuayBvZiBJbmRpYScsIGxvZ286ICd1bmlvbl9iYW5rX29mX2luZGlhJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnVU5JQicsIHRleHQ6ICdVbml0ZWQgQmFuayBPZiBJbmRpYScsIGxvZ286ICd1bml0ZWRfYmFuayd9LCAvL3tpZDogJ1VOSUInLCB0ZXh0OiAnVW5pdGVkIEJhbmsgT2YgSW5kaWEnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdWSllCJywgdGV4dDogJ1ZpamF5YSBCYW5rJywgbG9nbzogJ3ZpanlhX2JhbmsnfSwgLy97aWQ6ICdWSllCJywgdGV4dDogJ1ZpamF5YSBCYW5rJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnWUVTQicsIHRleHQ6ICdZZXMgQmFuaycsIGxvZ286ICd5ZXNfYmFuayd9LCAvL3tpZDogJ1lFU0InLCB0ZXh0OiAnWWVzIEJhbmsnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICdUTUJCJywgdGV4dDogJ1RhbWlsbmFkIE1lcmNhbnRpbGUgQmFuaycsIGxvZ286ICd0X21fYmFuayd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwMTYnLCB0ZXh0OiAnVW5pb24gQmFuaycsIGxvZ286ICd1bmlvbl9iYW5rJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB7aWQ6ICcyMDAxJywgdGV4dDogJyBBVE9NIFRlc3QgYmFuayd9LFxuXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgd2FsbGV0czogW1xuICAgICAgICAgICAgICAgIHtpZDogJzEwMDEnLCB0ZXh0OiAnTW9iaUt3aWsnLCBsb2dvOiAnbW9iaWt3aWtfYmFja2dyb3VuZCd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwMDInLCB0ZXh0OiAnUGF5dG0nLCBsb2dvOiAncGF5dG1fYmFja2dyb3VuZCd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwMDMnLCB0ZXh0OiAnSWRlYSBNb25leScsIGxvZ286ICdpZGVhbW9uZXlfYmFja2dyb3VuZCd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwMDQnLCB0ZXh0OiAnRnJlZUNoYXJnZScsIGxvZ286ICdmcmVlY2hhcmdlX2JhY2tncm91bmQnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDA1JywgdGV4dDogJ094aWdlbicsIGxvZ286ICdveGlnZW5fYmFja2dyb3VuZCd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwMDYnLCB0ZXh0OiAnU0JJIEJ1ZGR5JywgbG9nbzogJ3NiaV9idWRkeV9iYWNrZ3JvdW5kJ30sXG4gICAgICAgICAgICAgICAge2lkOiAnMTAwNycsIHRleHQ6ICdUaGUgTW9iaWxlIFdhbGxldCcsIGxvZ286ICd0aGVfbW9iaWxlX3dhbGxldCd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwMDgnLCB0ZXh0OiAnamlvTW9uZXknLCBsb2dvOiAnamlvbW9uZXlfYmFja2dyb3VuZCd9LFxuICAgICAgICAgICAgICAgIHtpZDogJzEwMDknLCB0ZXh0OiAnSmFuYSBDYXNoJywgbG9nbzogJ2phbmFjYWNoX2JhY2tncm91bmQnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDEwJywgdGV4dDogJ1ppZ2dpdCBieSBJREZDIEJhbmsnLCBsb2dvOiAnemlnZ2l0X2JhY2tncm91bmQnfSxcbiAgICAgICAgICAgICAgICB7aWQ6ICcxMDExJywgdGV4dDogJ0lDYXNoIENhcmQnLCBsb2dvOiAnaWNhc2hfYmFja2dyb3VuZCd9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZm9ybWF0WWVhcjogZnVuY3Rpb24gKHllYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhci5zbGljZSgtMik7XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbmNvbmZpZzogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL2NhcmRzJyxcbiAgICAgICAgICAgIGRhdGE6IHt9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NhcmRzJywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIC8vdmlldy5zZXRDYXJkKGRhdGFbZGF0YS5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9ic2VydmUoJ2FjdGl2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZpZXcuY2xlYXJGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLnNldCgnZm9ybS5lcnJvcnMnLCBmYWxzZSk7XG4gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xuICAgIH0sXG5cbiAgICBzdWJtaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB7aWQ6IHRoaXMuZ2V0KCdwYXltZW50LmlkJyl9XG5cbiAgICAgICAgdmlldy5zZXQoJ2Zvcm0uc3VibWl0dGluZycsIHRydWUpO1xuICAgICAgICB2aWV3LnNldCgnZm9ybS5lcnJvcnMnLCB7fSk7XG5cblxuICAgICAgICBpZiAoMyA9PSB0aGlzLmdldCgnYWN0aXZlJykpIHtcbiAgICAgICAgICAgIGRhdGEubmV0YmFua2luZyA9IHRoaXMuZ2V0KCduZXRiYW5raW5nJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoNCA9PSB0aGlzLmdldCgnYWN0aXZlJykpIHtcbiAgICAgICAgICAgIGRhdGEud2FsbGV0ID0gdGhpcy5nZXQoJ3dhbGxldCcpO1xuICAgICAgICB9IGVsc2UgaWYgKDUgPT0gdGhpcy5nZXQoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICBkYXRhLkNDQXZlbnVlRW1pID0gdGhpcy5nZXQoJ2VtaScpO1xuICAgICAgICAgICAgZGF0YS5DQ0F2ZW51ZUVtaS5jYXRlZ29yeSA9ICdFTUknO1xuICAgICAgICB9IGVsc2UgaWYgKDYgPT0gdGhpcy5nZXQoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICBkYXRhLlVQSSA9IHRoaXMuZ2V0KCdib29raW5nLnBheW1lbnQudXBpJyk7XG4gICAgICAgICAgICBkYXRhLmNhdGVnb3J5ID0gJ3VwaSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLmNjID0gdGhpcy5nZXQoJ2NjJyk7XG4gICAgICAgICAgICBkYXRhLmNjLnN0b3JlID0gZGF0YS5jYy5zdG9yZSA/IDEgOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9ib29raW5nL3BheW1lbnQnLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9QYXkoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBpUGF5bWVudFJlc3BvbnNlKGRhdGEsIHZpZXcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdmb3JtLnN1Ym1pdHRpbmcnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Zvcm0uZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Zvcm0uZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdmb3JtLmVycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvL3JldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgY2xlYXJGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0KCdjYycsIHt9KTtcbiAgICAgICAgdGhpcy5zZXQoJ25ldGJhbmtpbmcnLCB7fSk7XG4gICAgfSxcbiAgICBzZXRDYXJkOiBmdW5jdGlvbiAoY2MpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdjYy5pZCcpICE9PSBjYy5pZCkge1xuICAgICAgICAgICAgdGhpcy5zZXQoJ2NjJywgY2MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXQoJ2NjJywge30pO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgcmVzZXRDQzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBlID0gZXZlbnQub3JpZ2luYWwsXG4gICAgICAgICAgICAgICAgZWwgPSAkKGUuc3JjRWxlbWVudCksXG4gICAgICAgICAgICAgICAgaWQgPSB0aGlzLmdldCgnY2MuaWQnKSxcbiAgICAgICAgICAgICAgICB5dXAgPSAwID09IGVsLnBhcmVudHMoJy51aS5pbnB1dC5jdnYnKS5zaXplKCkgJiYgKCgnSU5QVVQnID09IGVsWzBdLnRhZ05hbWUpIHx8IGVsLmhhc0NsYXNzKCdkcm9wZG93bicpIHx8IGVsLnBhcmVudHMoJy51aS5kcm9wZG93bicpLnNpemUoKSk7XG5cbiAgICAgICAgaWYgKGlkICYmIHl1cCkge1xuICAgICAgICAgICAgdGhpcy5zZXQoJ2NjJywge30pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBDQ0F2ZW51ZUVNSTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgICAgICAgICAganNvbkRhdGEsXG4gICAgICAgICAgICAgICAgcGF5bWVudCxcbiAgICAgICAgICAgICAgICB0b3RhbCxcbiAgICAgICAgICAgICAgICBqc29uRGF0YSwgcGxhbnNfZW1pXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICBwYXltZW50ID0gdmlldy5nZXQoJ3BheW1lbnQnKTtcbiAgICAgICAgdG90YWwgPSBwYXltZW50LmFtb3VudDtcbiAgICAgICAgcmVzcG9uc2UgPSAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YToge3RvdGFsX2Ftb3VudDogdG90YWwsIGVtaV9mbGFnOiAnZmFyZV9kaWZmZXJlbmNlJ30sXG4gICAgICAgICAgICB1cmw6ICcvYjJjL0Jvb2tpbmcvQ0NBdmVudWVFTUknLFxuICAgICAgICB9KTtcbiAgICAgICAgcmVzcG9uc2UuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEgIT0gJycpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBqc29uRGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlbWlPcHRpb25zJywganNvbkRhdGEpO1xuICAgICAgICAgICAgICAgICQuZWFjaChqc29uRGF0YSwgZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUucGF5T3B0ID09ICdPUFRFTUknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZW1pUGF5bWVudFJlYWR5JywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZW1pLnBheW1lbnRfb3B0aW9uJywgdmFsdWUucGF5T3B0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlbWlfYmFua3MnLCBKU09OLnBhcnNlKHZhbHVlLkVtaUJhbmtzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFuc19lbWkgPSBKU09OLnBhcnNlKHZhbHVlLkVtaVBsYW5zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChwbGFuc19lbWksIGZ1bmN0aW9uIChpbmRleDEsIHZhbHVlMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlMS5lbWlBbW91bnQgPSB2YWx1ZTEuZW1pQW1vdW50LnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUxLnRvdGFsID0gdmFsdWUxLnRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlbWlfcGxhbnMnLCBwbGFuc19lbWkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXNwb25zZS5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmlldy5zZXQoJ2VtaV91bmF2YWlsYWJsZScsIGRhdGEucmVzcG9uc2VKU09OLm1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dFbWlQbGFuczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIHZpZXcuc2V0KCdzZWxlY3RlZFBsYW4nLCAkKFwiI2VtaV9iYW5rc1wiKS52YWwoKSk7XG4gICAgICAgIHZpZXcuc2V0KCdlbWkucGxhbklkJywgJChcIiNlbWlfYmFua3NcIikudmFsKCkpO1xuICAgICAgICB2aWV3LnNldCgnc2hvd0VtaVBsYW5zJywgdHJ1ZSk7XG4gICAgfSxcbiAgICBzaG93Q2FyZEZpZWxkczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgICQuZWFjaCh2aWV3LmdldCgnZW1pX3BsYW5zJyksIGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5wbGFuSWQgPT0gdmlldy5nZXQoJ2VtaS5wbGFuSWQnKSkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlbWkuZW1pX3RlbnVyZV9pZCcsIHZhbHVlLnRlbnVyZUlkKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnZW1pLmN1cnJlbmN5JywgdmFsdWUuY3VycmVuY3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmlldy5zZXQoJ3JlYWR5Q2FyZEZpZWxkcycsIHRydWUpO1xuICAgIH0sXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIHZpZXcuQ0NBdmVudWVFTUkoKTtcbiAgICB9XG5cblxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb21wb25lbnRzL3BheW1lbnQvZm9ybS5qc1xuLy8gbW9kdWxlIGlkID0gMzk2XG4vLyBtb2R1bGUgY2h1bmtzID0gMTAiLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W1widWkgZm9ybSBzZWdtZW50IHBheW1lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJmb3JtLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwiZm9ybS5zdWJtaXR0aW5nXCJ9XX0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmxvY2sgaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInBheW1lbnQuY2xpZW50XCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInN1YiBoZWFkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGF5bWVudC5yZWFzb25cIn1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicGF5X2Rpdl9sZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXZfbGVmdF9zb3VyY2VcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJjbGFzcz1cXFwicGF5bWVudF9oaWdobGlnaHRcXFwiXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMFwifX1dLFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJhY3RpdmVcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiQ1JFRElUIENBUkRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiY2xhc3M9XFxcInBheW1lbnRfaGlnaGxpZ2h0XFxcIlwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMj09XzBcIn19XSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiYWN0aXZlXFxcIiwyXVwifX19LFwiZlwiOltcIkRFQklUIENBUkRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiY2xhc3M9XFxcInBheW1lbnRfaGlnaGxpZ2h0XFxcIlwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMz09XzBcIn19XSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiYWN0aXZlXFxcIiwzXVwifX19LFwiZlwiOltcIk5FVCBCQU5LSU5HXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImNsYXNzPVxcXCJwYXltZW50X2hpZ2hsaWdodFxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjQ9PV8wXCJ9fV0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImFjdGl2ZVxcXCIsNF1cIn19fSxcImZcIjpbXCJXQUxMRVRcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImNsYXNzPVxcXCJwYXltZW50X2hpZ2hsaWdodFxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjU9PV8wXCJ9fV0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImFjdGl2ZVxcXCIsNV1cIn19fSxcImZcIjpbXCJFTUlcIl19XSxcIm5cIjo1MCxcInJcIjpcImVtaVBheW1lbnRSZWFkeVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImNsYXNzPVxcXCJwYXltZW50X2hpZ2hsaWdodFxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjY9PV8wXCJ9fV0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImFjdGl2ZVxcXCIsNl1cIn19fSxcImZcIjpbXCJVUElcIl19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBheV9kaXZfcmlnaHRcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjcmVkaXQtY2FyZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdHdvIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZXNldENDXCIsXCJhXCI6e1wiclwiOltcImV2ZW50XCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJudW1iZXIgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJDcmVkaXRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjE9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJEZWJpdFwiXSxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LFwiIENhcmQgTnVtYmVyIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY2NcIixcImFcIjp7XCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmlkXCJ9XSxcImNsYXNzXCI6XCJjYXJkLW51bWJlciBmbHVpZFwiLFwiY2FyZFR5cGVcIjpbe1widFwiOjIsXCJyXCI6XCJhY3RpdmVcIn1dLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MudHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLm51bWJlclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLm51bWJlclwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aHJlZSBleHBpcnkgZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiRXhwaXJ5IE1vbnRoIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwibW9udGhcIixcInBsYWNlaG9sZGVyXCI6XCJNb250aFwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0LmNhcmRNb250aHNcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5leHBfbW9udGhcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJmb3JtLmVycm9ycy5leHBfbW9udGhcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkV4cGlyeSBZZWFyIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwieWVhclwiLFwicGxhY2Vob2xkZXJcIjpcIlllYXJcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5jYXJkWWVhcnNcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5leHBfeWVhclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLmV4cF95ZWFyXCJ9XX0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCIsXCJzdHlsZVwiOlwicG9zaXRpb246IHJlbGF0aXZlO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiQ1ZWIE5vIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY3Z2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsdWlkIGN2dlwiLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MudHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmN2dlwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLmN2dlwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjdnYtaW1hZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIjQgZGlnaXQgQ1ZWIE51bWJlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2NC1pbWdcIn0sXCJmXCI6W1wiwqBcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiY2MudHlwZVwiXSxcInNcIjpcIlxcXCJhbWV4XFxcIj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIjMgZGlnaXQgQ1ZWIE51bWJlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2My1pbWdcIn0sXCJmXCI6W1wiwqBcIl19XSxcInhcIjp7XCJyXCI6W1wiY2MudHlwZVwiXSxcInNcIjpcIlxcXCJhbWV4XFxcIj09XzBcIn19XX1dLFwiblwiOjUwLFwiclwiOlwiY2MudHlwZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJudW1iZXIgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkNhcmQgSG9sZGVyJ3MgTmFtZSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MubmFtZVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLm5hbWVcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic3RvcmUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuaWRcIn1dLFwidHlwZVwiOlwiY2hlY2tib3hcIixcImNoZWNrZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5zdG9yZVwifV19fSxcIiBTdG9yZSBjYXJkIGZvciBmdXR1cmUgdXNlLlwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlNhdmVkIGNhcmRzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBsaXN0XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0Q2FyZFwiLFwiYVwiOntcInJcIjpbXCIuXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm51bWJlclwiLFwic1wiOnRydWV9XX1dfV0sXCJuXCI6NTIsXCJyXCI6XCJjYXJkc1wifV19XX1dLFwiblwiOjUwLFwiclwiOlwiY2FyZHNcIn1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMHx8Mj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiXzA9PTNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5ldGJhbmtpbmdcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIkJhbmsgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlNlbGVjdCBZb3VyIEJhbmsgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlcXVpcmVkXCJ9LFwiZlwiOltcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJjbGFzc1wiOlwiYmFuayBmbHVpZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJuZXRiYW5raW5nLm5ldF9iYW5raW5nXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZm9ybS5lcnJvcnMubmV0X2JhbmtpbmdcIn1dLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImJhbmtzXCJ9XX19XX1dfV19LHtcInRcIjo0LFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIoIShfMD09MykpJiYoXzA9PTQpXCJ9LFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJuZXRiYW5raW5nXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtb2JpX2NvbnRlbnQgZmllbGQgc3RlcDN3YWxsZXRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlNlbGVjdCBZb3VyIFdhbGxldCBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImNsYXNzXCI6XCJ3YWxsZXQgZmx1aWRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwid2FsbGV0LndhbGxldF90eXBlXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMud2FsbGV0X3R5cGVcIn1dLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcIndhbGxldHNcIn1dfSxcImZcIjpbXX1dfV19XX0se1widFwiOjQsXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIighKF8wPT0zKSkmJigoIShfMD09NCkpJiYoXzA9PTUpKVwifSxcImZcIjpbXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5ldGJhbmtpbmdcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1vYmlfY29udGVudCBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiUGF5IFRocm91Z2g6IFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZW1pX3dhcm5pbmdcIn0sXCJmXCI6W1wiKFBsZWFzZSBub3RlOkVNSSBwYXltZW50IGlzIGFwcGxpY2FibGUgb25seSBmb3IgY3JlZGl0IGNhcmQuKVwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic2VsZWN0XCIsXCJhXCI6e1wibmFtZVwiOlwiZW1pX2JhbmtzXCIsXCJpZFwiOlwiZW1pX2JhbmtzXCJ9LFwidlwiOntcImNoYW5nZVwiOntcIm1cIjpcInNob3dFbWlQbGFuc1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJhXCI6e1widmFsdWVcIjpcIlwiLFwic3R5bGVcIjpcImRpc3BsYXk6bm9uZTtcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiLnBsYW5JZFwifV0sXCJjbGFzc1wiOlt7XCJ0XCI6MixcInJcIjpcIi5CSU5zXCJ9XSxcImlkXCI6W3tcInRcIjoyLFwiclwiOlwiLnN1YnZlbnRpb25QYWlkQnlcIn1dLFwiZGF0YS12YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIi5taWRQcm9jZXNzZXNcIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuZ3R3TmFtZVwifV19XSxcInJcIjpcImVtaV9iYW5rc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlNlbGVjdCBZb3UgUGxhbjogXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlcXVpcmVkXCJ9LFwiZlwiOltcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImlkXCI6XCJwbGFuVGFibGVcIixcImJvcmRlclwiOlwiMVwiLFwiY2xhc3NcIjpcImVtaVRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIkVNSSBQbGFuc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIk1vbnRobHkgSW5zdGFsbG1lbnRzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJmXCI6W1wiVG90YWwgQ29zdFwiXX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwicmFkaW9cIixcIm5hbWVcIjpcImVtaV9wbGFuX3JhZGlvXCIsXCJpZFwiOlwiZW1pX3BsYW5fcmFkaW9cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiLnRlbnVyZUlkXCJ9XSxcImNsYXNzXCI6XCJlbWlfcGxhbl9yYWRpb1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNob3dDYXJkRmllbGRzXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLnRlbnVyZU1vbnRoc1wifSxcIiBNb250aHMgQCBcIix7XCJ0XCI6MixcInJcIjpcIi5wcm9jZXNzaW5nRmVlUGVyY2VudFwifSxcIiAlIHAuYVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5jdXJyZW5jeVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcIi5lbWlBbW91bnRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLmN1cnJlbmN5XCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiLnRvdGFsXCJ9XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIi5wbGFuSWRcIixcInNlbGVjdGVkUGxhblwiXSxcInNcIjpcIl8wPT1fMVwifX1dLFwiclwiOlwiZW1pX3BsYW5zXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwic2hvd0VtaVBsYW5zXCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm51bWJlciBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiQ3JlZGl0IENhcmQgTnVtYmVyIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY2NcIixcImFcIjp7XCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInJcIjpcImVtaS5pZFwifV0sXCJjbGFzc1wiOlwiY2FyZC1udW1iZXIgZmx1aWRcIixcImNhcmRUeXBlXCI6W3tcInRcIjoyLFwiclwiOlwiYWN0aXZlXCJ9XSxcImNjdHlwZVwiOlt7XCJ0XCI6MixcInJcIjpcImVtaS5jYXJkX3R5cGVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJlbWkuY2FyZF9udW1iZXJcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5udW1iZXJcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic3RvcmUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiZW1pLmlkXCJ9XSxcInR5cGVcIjpcImNoZWNrYm94XCIsXCJjaGVja2VkXCI6W3tcInRcIjoyLFwiclwiOlwiZW1pLnN0b3JlXCJ9XX19LFwiIFN0b3JlIGNhcmQgZm9yIGZ1dHVyZSB1c2UuXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRocmVlIGV4cGlyeSBmaWVsZHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJFeHBpcnkgTW9udGggXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlcXVpcmVkXCJ9LFwiZlwiOltcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInJcIjpcImVtaS5pZFwifV0sXCJjbGFzc1wiOlwibW9udGhcIixcInBsYWNlaG9sZGVyXCI6XCJNb250aFwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0LmNhcmRNb250aHNcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJlbWkuZXhwX21vbnRoXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwic3RlcC5lcnJvcnMuZXhwX21vbnRoXCJ9XX0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJFeHBpcnkgWWVhciBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiZW1pLmlkXCJ9XSxcImNsYXNzXCI6XCJ5ZWFyXCIsXCJwbGFjZWhvbGRlclwiOlwiWWVhclwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0LmNhcmRZZWFyc1wifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImVtaS5leHBfeWVhclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLmV4cF95ZWFyXCJ9XX0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCIsXCJzdHlsZVwiOlwicG9zaXRpb246IHJlbGF0aXZlO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiQ1ZWIE5vIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY3Z2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsdWlkIGN2dlwiLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiZW1pLmNhcmRfdHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImVtaS5jdnZcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJzdGVwLmVycm9ycy5jdnZcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2LWltYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbXCI0IGRpZ2l0IENWViBOdW1iZXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImN2djQtaW1nXCJ9LFwiZlwiOltcIsKgXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVtaS50eXBlXCJdLFwic1wiOlwiXFxcImFtZXhcXFwiPT1fMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W1wiMyBkaWdpdCBDVlYgTnVtYmVyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjdnYzLWltZ1wifSxcImZcIjpbXCLCoFwiXX1dLFwieFwiOntcInJcIjpbXCJlbWkudHlwZVwiXSxcInNcIjpcIlxcXCJhbWV4XFxcIj09XzBcIn19XX1dLFwiblwiOjUwLFwiclwiOlwiZW1pLnR5cGVcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibnVtYmVyIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJDYXJkIEhvbGRlcidzIE5hbWUgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlcXVpcmVkXCJ9LFwiZlwiOltcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiZW1pLmlkXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJlbWkubmFtZVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcInN0ZXAuZXJyb3JzLm5hbWVcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibW9iaV9jb250ZW50IGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJJc3N1aW5nIEJhbms6IFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImVtaS5pc3N1aW5nX2JhbmtcIn1dLFwicGxhY2Vob2xkZXJcIjpcIklzc3VpbmcgQmFua1wiLFwiaWRcIjpcImlzc3VpbmdfYmFua1wifX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJyZWFkeUNhcmRGaWVsZHNcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlbWlQYXltZW50UmVhZHlcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlbWlfdW5hdmFpbGFibGVcIl0sXCJzXCI6XCJfMFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc21hbGwgZmllbGQgbmVnYXRpdmUgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlbWlfdW5hdmFpbGFibGVcIn1dfV19LHtcInRcIjo0LFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlbWlfdW5hdmFpbGFibGVcIl0sXCJzXCI6XCIhKF8wKVwifSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicGF5bWVudF9sb2FkZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGFjdGl2ZSBpbnZlcnRlZCBkaW1tZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIndhaXRfdGV4dFwifSxcImZcIjpbXCJQbGVhc2UgV2FpdFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdGV4dCBsb2FkZXIgbG9hZGVyX3Bvc2l0aW9uXCJ9fV19XX1dfV0sXCJyXCI6XCJlbWlQYXltZW50UmVhZHlcIn1dfSx7XCJ0XCI6NCxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiKCEoXzA9PTMpKSYmKCghKF8wPT00KSkmJigoIShfMD09NSkpJiYoXzA9PTYpKSlcIn0sXCJmXCI6W1wiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm1vYmlfY29udGVudCBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiRW50ZXIgWW91ciBWUEEgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlcXVpcmVkXCJ9LFwiZlwiOltcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZy5wYXltZW50LnVwaS52aXJ0dWFsX2FkZHJlc3NcIn1dLFwicGxhY2Vob2xkZXJcIjpcIkVudGVyIFZpcnR1YWwgUGF5bWVudCBBZGRyZXNzXCIsXCJpZFwiOlwidXBpX2NsaV92aXJ0dWFsX2FkZFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJzdHlsZVwiOlwiZGlzcGxheTpub25lO1wiLFwidHlwZVwiOlwiYnV0dG9uXCIsXCJjbGFzc1wiOltcInVpIHdpemFyZCBidXR0b24gbWFzc2l2ZSBcIix7XCJ0XCI6NCxcImZcIjpbXCJncmVlblwiXSxcIm5cIjo1MCxcInJcIjpcImFjY2VwdGVkXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcInJlZFwiXSxcInJcIjpcImFjY2VwdGVkXCJ9XX0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJcIl0sXCJuXCI6NTEsXCJyXCI6XCJhY2NlcHRlZFwifV0sXCJmXCI6W1wiR2V0IFN0YXR1c1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsZWFkXCIsXCJpZFwiOlwibWVzc2FnZVwifX1dfV0sXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjE9PV8wfHwyPT1fMFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZm9ybS5lcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJmb3JtLmVycm9yc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibm90ZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiUGxlYXNlIE5vdGUgOlwiXX0sXCIgVGhlIGNoYXJnZSB3aWxsIGFwcGVhciBvbiB5b3VyIGNyZWRpdCBjYXJkIC8gQWNjb3VudCBzdGF0ZW1lbnQgYXMgJ0FpcnRpY2tldHMgSW5kaWEgUHZ0IEx0ZCdcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFncmVlbWVudCBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiY2hlY2tib3hcIixcImNoZWNrZWRcIjpbe1widFwiOjIsXCJyXCI6XCJhY2NlcHRlZFwifV19fSxcIiBJIGhhdmUgcmVhZCBhbmQgYWNjZXB0ZWQgdGhlIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvY21zL3Rlcm1zb2ZzZXJ2aWNlcy8yXCIsXCJ0YXJnZXRcIjpcIl9ibGFua1wifSxcImZcIjpbXCJUZXJtcyBPZiBTZXJ2aWNlXCJdfSxcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicHJpY2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIkNvbnZlbmllbmNlIGZlZSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheW1lbnQuY29udmluY2VfZmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIHdpbGwgYmUgY2hhcmdlZFwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwYXltZW50LmNvbnZpbmNlX2ZlZVwiXSxcInNcIjpcIl8wPjBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYW1vdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheW1lbnQuYW1vdW50XCIsXCJwYXltZW50LmNvbnZpbmNlX2ZlZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAocGFyc2VJbnQoXzEpK3BhcnNlSW50KF8yKSxfMylcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiKFRvdGFsIFBheWFibGUgQW1vdW50KVwiXX1dLFwiblwiOjUwLFwiclwiOlwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6MTAwJVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6MjUlOyBmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwic3R5bGVcIjpcIndpZHRoOiAxMDAlO1wiLFwiY2xhc3NcIjpcInVpIHdpemFyZCBidXR0b24gIG9yYW5nZVwifSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWQ9XFxcImRpc2FibGVkXFxcIlwiXSxcIm5cIjo1MSxcInJcIjpcImFjY2VwdGVkXCJ9XSxcImZcIjpbXCJNQUtFIFBBWU1FTlRcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidmVyaWZpZWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvdmVyaWZpZWQvdmJ2XzI1MC5naWZcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvdmVyaWZpZWQvbWFzdGVyY2FyZF9zZWN1cmVjb2RlLmdpZlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy92ZXJpZmllZC9BTUVYX1NhZmVLZXlfMTgweDk5cHgucG5nXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL3ZlcmlmaWVkL3BjaS1kc3MtY29tcGxpYW50LmpwZ1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy92ZXJpZmllZC9TU0wtc2VjdXJpdHktc2VhbC5wbmdcIn19XX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZW1pUGF5bWVudFJlYWR5XCIsXCJhY3RpdmVcIl0sXCJzXCI6XCJfMHx8XzE9PTF8fF8xPT0yfHxfMT09M3x8XzE9PTR8fF8xPT02XCJ9fV19XX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL3BheW1lbnQvZm9ybS5odG1sXG4vLyBtb2R1bGUgaWQgPSAzOTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9sZXNzL3dlYi9tb2R1bGVzL3BheW1lbnQubGVzc1xuLy8gbW9kdWxlIGlkID0gMzk4XG4vLyBtb2R1bGUgY2h1bmtzID0gMTAiXSwic291cmNlUm9vdCI6IiJ9