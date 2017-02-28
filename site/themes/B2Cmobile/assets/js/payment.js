webpackJsonp([8],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(289);


/***/ },

/***/ 67:
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

/***/ 68:
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

/***/ 73:
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

/***/ 74:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui login small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":4,"f":["Login"],"n":51,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}," ",{"t":4,"f":["Sign-up"],"n":50,"r":"signup"}," ",{"t":4,"f":["Reset password"],"n":50,"r":"forgottenpass"}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":8,"r":"form"}]}]}],"n":50,"r":"popup"},{"t":4,"n":51,"f":[{"t":8,"r":"form"}],"r":"popup"}],"p":{"form":[{"t":7,"e":"form","a":{"action":"javascript:;","class":[{"t":4,"f":["form"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":["ui basic segment form"],"x":{"r":["popup"],"s":"!_0"}}," ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting"}],"style":"position: relative;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":50,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Login"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"password","type":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"submit","class":["ui ",{"t":4,"f":["small"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":["massive"],"x":{"r":["popup"],"s":"!_0"}}," fluid blue button uppercase"]},"f":["LOGIN"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;","class":"forgot-password"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"forgottenpass\",1]"}}},"f":["Forgot Password?"]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"p","f":["Don’t have a CheapTicket.in Account? ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"signup\",1]"}}},"f":["Sign up for one »"]}]}]}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"signup"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"email","value":[{"t":2,"r":"user.email"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"mobile","value":[{"t":2,"r":"user.mobile"}],"class":"fluid","placeholder":"Mobile"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"name","value":[{"t":2,"r":"user.name"}],"class":"fluid","placeholder":"Name"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password2","value":[{"t":2,"r":"user.password2"}],"class":"fluid","placeholder":"Password again"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui massive fluid blue button uppercase"},"v":{"click":{"m":"signup","a":{"r":[],"s":"[]"}}},"f":["Signup"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"signupsuccess"}]}," ",{"t":4,"f":["Your registration was success.",{"t":7,"e":"br"},"You will receive email with further instructions from us how to proceed.",{"t":7,"e":"br"},"Please check your inbox and if no email from us is found, check also your SPAM folder."],"n":50,"r":"signupsuccess"}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"forgottenpass"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui massive fluid blue button uppercase"},"v":{"click":{"m":"resetPassword","a":{"r":[],"s":"[]"}}},"f":["RESET"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"resetsuccess"}," ",{"t":4,"f":["Instructions how to revive your password has been sent to your email.",{"t":7,"e":"br"},"Please check your email."],"n":50,"r":"resetsuccess"}]}]}]}};

/***/ },

/***/ 75:
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

/***/ 88:
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

/***/ 90:
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

/***/ 92:
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

/***/ 93:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui input ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"input","a":{"type":[{"t":4,"f":["text"],"n":50,"r":"disabled"},{"t":4,"n":51,"f":["tel"],"r":"disabled"}],"name":[{"t":2,"r":"name"}],"value":[{"t":2,"r":"value"}]},"m":[{"t":4,"f":["placeholder=\"",{"t":2,"r":"placeholder"},"\""],"n":51,"r":"large"},{"t":4,"f":["disabled"],"n":50,"r":"disabled"},{"t":4,"f":["disabled=\"disabled\""],"n":50,"x":{"r":["state.disabled","state.submitting"],"s":"_0||_1"}}]}," ",{"t":4,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":["cardType ",{"t":2,"r":"cctype"}]},"f":[{"t":2,"r":"cctype"}]}]}],"n":50,"r":"cctype"},{"t":4,"n":51,"f":[{"t":7,"e":"ul","a":{"class":"cardList clearFix fLeft"},"f":[{"t":7,"e":"li","a":{"class":"cardType visa"},"f":["Visa"]}," ",{"t":7,"e":"li","a":{"class":"cardType master"},"f":["Mastercard"]}," ",{"t":7,"e":"li","a":{"class":"cardType amex"},"f":["American Express"]}," ",{"t":7,"e":"li","a":{"class":"cardType diners"},"f":["Diners"]}]}],"r":"cctype"}]}]};

/***/ },

/***/ 94:
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

/***/ 289:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $ = __webpack_require__(32)
	    ;
	
	var Payment = __webpack_require__(290)
	    ;
	
	__webpack_require__(294);
	
	$(function() {
	    var payment = new Payment();
	    payment.set('payment', $('[data-payment]').data('payment'));
	    //console.log($('[data-payment]').data('payment'));
	    //console.log(payment.get('payment'));
	    payment.render('#app');
	});

/***/ },

/***/ 290:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Q = __webpack_require__(26),
	    _ = __webpack_require__(29)
	    ;
	
	var Form = __webpack_require__(33),
	    Meta = __webpack_require__(66),
	    Auth = __webpack_require__(73)
	    ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(291),
	
	    components: {
	        'layout': __webpack_require__(70),
	        'payment-form': __webpack_require__(292)
	    },
	
	    partials: {
	        'base-panel': __webpack_require__(98)
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

/***/ 291:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":7,"e":"payment-form","a":{"payment":[{"t":2,"r":"payment"}],"meta":[{"t":2,"r":"meta"}]}}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 292:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    $ = __webpack_require__(32)
	    ;
	
	var Form = __webpack_require__(33),
	
	    h_money = __webpack_require__(67),
	    h_duration = __webpack_require__(75)(),
	    h_date = __webpack_require__(88)()
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
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(293),
	
	    components: {
	        'ui-cc': __webpack_require__(92),
	        'ui-cvv': __webpack_require__(94)
	    },
	
	    data: function() {
	        return {
	            active: 1,
	            cc: {
	                store: 1
	            },
	
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
	                {id: 'ICIB', text: 'ICICI Netbanking'},
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
	        }
	    },
	
	    onconfig: function() {
	        var view = this;
	
	        $.ajax({
	            type: 'GET',
	            url: '/b2c/booking/cards',
	            data: {},
	            success: function(data) {
	                if (data.length) {
	                    view.set('cards', data);
	                    view.setCard(data[data.length - 1]);
	                }
	            }
	        });
	
	        this.observe('active', function() { this.set('form.errors', false); }, {init: false});
	    },
	
	    submit: function() {
	        var view = this,
	            data = {id: this.get('payment.id')}
	
	        view.set('form.submitting', true);
	        view.set('form.errors', {});
	
	
	        if (3 == this.get('active')) {
	            data.netbanking = this.get('netbanking');
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
	
	
	        return deferred.promise;
	    },
	
	    setCard: function(cc) {
	        if (this.get('cc.id') !== cc.id) {
	            this.set('cc', cc);
	        } else {
	            this.set('cc', {});
	        }
	
	    },
	
	    resetCC: function(event) {
	        var e = event.original,
	            el = $(e.srcElement),
	            id = this.get('cc.id'),
	            yup = 0 == el.parents('.ui.input.cvv').size() && (('INPUT' == el[0].tagName) || el.hasClass('dropdown') || el.parents('.ui.dropdown').size());
	
	        if (id && yup) {
	            this.set('cc', {});
	        }
	    }
	
	
	});

/***/ },

/***/ 293:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form segment payment ",{"t":4,"f":["error"],"n":50,"r":"form.errors"}," ",{"t":4,"f":["loading"],"n":50,"r":"form.submitting"}]},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"div","a":{"class":"ui block header"},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":2,"r":"payment.client"}," ",{"t":7,"e":"div","a":{"class":"sub header"},"f":[{"t":2,"r":"payment.reason"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ui pointing secondary menu"},"f":[{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"1==_0"}}],"data-tab":"dummy"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",1]"}}},"f":["CREDIT CARD"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"2==_0"}}],"data-tab":"dummy"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",2]"}}},"f":["DEBIT CARD"]}," ",{"t":7,"e":"a","a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["active"],"s":"3==_0"}}],"data-tab":"dummy"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"active\",3]"}}},"f":["NET BANKING"]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"credit-card"},"f":[{"t":7,"e":"div","a":{"class":"ui two column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"v":{"click":{"m":"resetCC","a":{"r":["event"],"s":"[_0]"}}},"f":[{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":[{"t":4,"f":["Credit"],"n":50,"x":{"r":["active"],"s":"1==_0"}},{"t":4,"n":51,"f":["Debit"],"x":{"r":["active"],"s":"1==_0"}}," Card Number ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cc","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"card-number fluid","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.number"}],"error":[{"t":2,"r":"form.errors.number"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"three expiry fields"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Month ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"month","placeholder":"Month","options":[{"t":2,"r":"date.select.cardMonths"}],"value":[{"t":2,"r":"cc.exp_month"}],"error":[{"t":2,"r":"form.errors.exp_month"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Expiry Year ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"year","placeholder":"Year","options":[{"t":2,"r":"date.select.cardYears"}],"value":[{"t":2,"r":"cc.exp_year"}],"error":[{"t":2,"r":"form.errors.exp_year"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"field","style":"position: relative;"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["CVV No ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-cvv","a":{"class":"fluid cvv","cctype":[{"t":2,"r":"cc.type"}],"value":[{"t":2,"r":"cc.cvv"}],"error":[{"t":2,"r":"form.errors.cvv"}]},"v":{"click":"reset-cc"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"cvv-image"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["4 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv4-img"},"f":[" "]}],"n":50,"x":{"r":["cc.type"],"s":"\"amex\"==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","f":["3 digit CVV Number"]}," ",{"t":7,"e":"div","a":{"class":"cvv3-img"},"f":[" "]}],"x":{"r":["cc.type"],"s":"\"amex\"==_0"}}]}],"n":50,"r":"cc.type"}," ",{"t":7,"e":"div","a":{"class":"number field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Card Holder's Name ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-input","a":{"disabled":[{"t":2,"r":"cc.id"}],"class":"fluid","value":[{"t":2,"r":"cc.name"}],"error":[{"t":2,"r":"form.errors.name"}]},"v":{"click":"reset-cc"}}]}," ",{"t":7,"e":"div","a":{"class":"store field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"disabled":[{"t":2,"r":"cc.id"}],"type":"checkbox","checked":[{"t":2,"r":"cc.store"}]}}," Store card for future use."]}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui segment field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Saved cards"]}," ",{"t":7,"e":"div","a":{"class":"ui list"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"setCard","a":{"r":["."],"s":"[_0]"}}},"f":[{"t":2,"r":"number","s":true}]}]}],"n":52,"r":"cards"}]}]}],"n":50,"r":"cards"}]}]}]}],"n":50,"x":{"r":["active"],"s":"1==_0||2==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"netbanking"},"f":[{"t":7,"e":"div","a":{"class":"Bank field"},"f":[{"t":7,"e":"div","a":{"class":"label"},"f":["Select Your Bank ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"ui-select","a":{"class":"bank fluid","value":[{"t":2,"r":"netbanking.net_banking"}],"error":[{"t":2,"r":"form.errors.net_banking"}],"options":[{"t":2,"r":"banks"}]}}]}]}],"x":{"r":["active"],"s":"1==_0||2==_0"}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"form.errors"}]}],"n":50,"r":"form.errors"}," ",{"t":7,"e":"div","a":{"class":"note"},"f":[{"t":7,"e":"span","f":["Please Note :"]}," The charge will appear on your credit card / Account statement as 'Airtickets India Pvt Ltd'"]}," ",{"t":7,"e":"div","a":{"class":"agreement field"},"f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","checked":[{"t":2,"r":"accepted"}]}}," I have read and accepted the ",{"t":7,"e":"a","a":{"href":"/b2c/cms/termsAndConditions/2","target":"_blank"},"f":["Terms Of Service"]},"*"]}]}," ",{"t":7,"e":"div","a":{"class":"price"},"f":[{"t":4,"f":[{"t":7,"e":"div","f":["Convenience fee ",{"t":3,"x":{"r":["money","payment.convince_fee","meta.display_currency"],"s":"_0(_1,_2)"}}," will be charged"]}],"n":50,"x":{"r":["payment.convince_fee"],"s":"_0>0"}}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"class":"amount"},"f":[{"t":3,"x":{"r":["money","payment.amount","payment.convince_fee","meta.display_currency"],"s":"_0(parseInt(_1)+parseInt(_2),_3)"}}]}," ",{"t":7,"e":"span","f":["(Total Payable Amount)"]}],"n":50,"r":"meta.display_currency"}]}," ",{"t":7,"e":"div","a":{"class":"verified"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/vbv_250.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/mastercard_securecode.gif"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/AMEX_SafeKey_180x99px.png"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/pci-dss-compliant.jpg"}}," ",{"t":7,"e":"img","a":{"src":"/themes/B2C/img/verified/SSL-security-seal.png"}}]}]}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui wizard button massive orange"},"m":[{"t":4,"f":["disabled=\"disabled\""],"n":51,"r":"accepted"}],"f":["BOOK FLIGHT"]}]}]}]};

/***/ },

/***/ 294:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9oZWxwZXJzL21vbmV5LmpzPzJjZWIqIiwid2VicGFjazovLy8uL3ZlbmRvci9hY2NvdW50aW5nLmpzL2FjY291bnRpbmcuanM/Mjc5YSoqKiIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2FwcC9hdXRoLmpzP2I2OTIqKioqIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sPzRiYzMqKioqIiwid2VicGFjazovLy8uL2pzL2hlbHBlcnMvZHVyYXRpb24uanM/NWUwNSoiLCJ3ZWJwYWNrOi8vLy4vanMvaGVscGVycy9kYXRlLmpzP2I0MmMqIiwid2VicGFjazovLy8uL3ZlbmRvci9qcXVlcnkucGF5bWVudC9saWIvanF1ZXJ5LnBheW1lbnQuanM/ZWFiZCoiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2NjL251bWJlci5qcz9lMjYxKiIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NjLmh0bWw/NmVmYSoiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2NjL2N2di5qcz8xZWUxKiIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL3BheW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9wYXltZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9wYXltZW50L2luZGV4Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9wYXltZW50L2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL3BheW1lbnQvZm9ybS5odG1sIiwid2VicGFjazovLy8uL2xlc3Mvd2ViL21vZHVsZXMvcGF5bWVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEc7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBNkIsT0FBTztBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNHQUFxRyxFQUFFO0FBQ3ZHOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBeUMsV0FBVztBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFrQyxJQUFJLFdBQVcsSUFBSTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7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RUFBRSxtQkFBbUIscUJBQXFCLHFCQUFxQixPQUFPLHFCQUFxQixxQkFBcUIsT0FBTyxxQkFBcUIsZ0JBQWdCLDJCQUEyQixzQkFBc0IsbUJBQW1CLFdBQVcsRUFBRSxNQUFNLDJCQUEyQiwrQkFBK0IsbUNBQW1DLFlBQVksb0NBQW9DLGNBQWMsa0JBQWtCLEdBQUcsRUFBRSxFQUFFLE9BQU8sbUNBQW1DLE1BQU0sWUFBWSxxQkFBcUIsMkJBQTJCLE9BQU8sWUFBWSxZQUFZLG9CQUFvQixjQUFjLEVBQUUsaUJBQWlCLG1DQUFtQyxFQUFFLDJCQUEyQixNQUFNLHFCQUFxQixlQUFlLE9BQU8sdUNBQXVDLGtHQUFrRyxNQUFNLHFCQUFxQiwwQkFBMEIsT0FBTyx3QkFBd0IsdUJBQXVCLDhCQUE4QixxQkFBcUIsR0FBRyxtQ0FBbUMsbUJBQW1CLHlEQUF5RCwwQkFBMEIsTUFBTSxFQUFFLE1BQU0scUJBQXFCLGdCQUFnQixPQUFPLFlBQVkseUNBQXlDLFdBQVcsOEVBQThFLHFCQUFxQixjQUFjLHlDQUF5QyxNQUFNLFlBQVksc0JBQXNCLGlCQUFpQixPQUFPLFdBQVcsc0hBQXNILEVBQUUsTUFBTSxnREFBZ0QscUNBQXFDLEVBQUUsTUFBTSxxQkFBcUIsbUJBQW1CLE9BQU8sc0JBQXNCLHFCQUFxQiw4Q0FBOEMsTUFBTSxxQkFBcUIsNERBQTRELE1BQU0scUJBQXFCLDREQUE0RCxNQUFNLHFCQUFxQix3REFBd0QsTUFBTSxxQkFBcUIsd0RBQXdELEVBQUUsRUFBRSxNQUFNLHdCQUF3QiwwREFBMEQsT0FBTywwREFBMEQsc0JBQXNCLEVBQUUsRUFBRSxHOzs7Ozs7O0FDQXBnTywwQyIsImZpbGUiOiJqcy9wYXltZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGFjY291bnRpbmcgPSByZXF1aXJlKCdhY2NvdW50aW5nLmpzJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL2ZsaWdodC9tZXRhJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYW1vdW50KSB7XHJcbiAgICBpZiAoTWV0YS5vYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gYWNjb3VudGluZy5mb3JtYXRNb25leShcclxuICAgICAgICAgICAgYW1vdW50ICogTWV0YS5vYmplY3QuZ2V0KCd4Q2hhbmdlJylbTWV0YS5vYmplY3QuZ2V0KCdkaXNwbGF5X2N1cnJlbmN5JyldLFxyXG4gICAgICAgICAgICAnPGkgY2xhc3M9XCInICsgTWV0YS5vYmplY3QuZ2V0KCdkaXNwbGF5X2N1cnJlbmN5JykudG9Mb3dlckNhc2UoKSAgKyAnIGljb24gY3VycmVuY3lcIj48L2k+JyxcclxuICAgICAgICAgICAgMFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoYW1vdW50LCAnPGkgY2xhc3M9XCJpbnIgaWNvbiBjdXJyZW5jeVwiPjwvaT4nLCAwKTtcclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvaGVscGVycy9tb25leS5qc1xuICoqIG1vZHVsZSBpZCA9IDY3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA4XG4gKiovIiwiLyohXG4gKiBhY2NvdW50aW5nLmpzIHYwLjMuMlxuICogQ29weXJpZ2h0IDIwMTEsIEpvc3MgQ3Jvd2Nyb2Z0XG4gKlxuICogRnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogUG9ydGlvbnMgb2YgYWNjb3VudGluZy5qcyBhcmUgaW5zcGlyZWQgb3IgYm9ycm93ZWQgZnJvbSB1bmRlcnNjb3JlLmpzXG4gKlxuICogRnVsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuICogaHR0cDovL2pvc3Njcm93Y3JvZnQuZ2l0aHViLmNvbS9hY2NvdW50aW5nLmpzL1xuICovXG5cbihmdW5jdGlvbihyb290LCB1bmRlZmluZWQpIHtcblxuXHQvKiAtLS0gU2V0dXAgLS0tICovXG5cblx0Ly8gQ3JlYXRlIHRoZSBsb2NhbCBsaWJyYXJ5IG9iamVjdCwgdG8gYmUgZXhwb3J0ZWQgb3IgcmVmZXJlbmNlZCBnbG9iYWxseSBsYXRlclxuXHR2YXIgbGliID0ge307XG5cblx0Ly8gQ3VycmVudCB2ZXJzaW9uXG5cdGxpYi52ZXJzaW9uID0gJzAuMy4yJztcblxuXG5cdC8qIC0tLSBFeHBvc2VkIHNldHRpbmdzIC0tLSAqL1xuXG5cdC8vIFRoZSBsaWJyYXJ5J3Mgc2V0dGluZ3MgY29uZmlndXJhdGlvbiBvYmplY3QuIENvbnRhaW5zIGRlZmF1bHQgcGFyYW1ldGVycyBmb3Jcblx0Ly8gY3VycmVuY3kgYW5kIG51bWJlciBmb3JtYXR0aW5nXG5cdGxpYi5zZXR0aW5ncyA9IHtcblx0XHRjdXJyZW5jeToge1xuXHRcdFx0c3ltYm9sIDogXCIkXCIsXHRcdC8vIGRlZmF1bHQgY3VycmVuY3kgc3ltYm9sIGlzICckJ1xuXHRcdFx0Zm9ybWF0IDogXCIlcyV2XCIsXHQvLyBjb250cm9scyBvdXRwdXQ6ICVzID0gc3ltYm9sLCAldiA9IHZhbHVlIChjYW4gYmUgb2JqZWN0LCBzZWUgZG9jcylcblx0XHRcdGRlY2ltYWwgOiBcIi5cIixcdFx0Ly8gZGVjaW1hbCBwb2ludCBzZXBhcmF0b3Jcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXHRcdC8vIHRob3VzYW5kcyBzZXBhcmF0b3Jcblx0XHRcdHByZWNpc2lvbiA6IDIsXHRcdC8vIGRlY2ltYWwgcGxhY2VzXG5cdFx0XHRncm91cGluZyA6IDNcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0fSxcblx0XHRudW1iZXI6IHtcblx0XHRcdHByZWNpc2lvbiA6IDAsXHRcdC8vIGRlZmF1bHQgcHJlY2lzaW9uIG9uIG51bWJlcnMgaXMgMFxuXHRcdFx0Z3JvdXBpbmcgOiAzLFx0XHQvLyBkaWdpdCBncm91cGluZyAobm90IGltcGxlbWVudGVkIHlldClcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXG5cdFx0XHRkZWNpbWFsIDogXCIuXCJcblx0XHR9XG5cdH07XG5cblxuXHQvKiAtLS0gSW50ZXJuYWwgSGVscGVyIE1ldGhvZHMgLS0tICovXG5cblx0Ly8gU3RvcmUgcmVmZXJlbmNlIHRvIHBvc3NpYmx5LWF2YWlsYWJsZSBFQ01BU2NyaXB0IDUgbWV0aG9kcyBmb3IgbGF0ZXJcblx0dmFyIG5hdGl2ZU1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAsXG5cdFx0bmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanNcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuXHRcdHJldHVybiAhIShvYmogPT09ICcnIHx8IChvYmogJiYgb2JqLmNoYXJDb2RlQXQgJiYgb2JqLnN1YnN0cikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgc3RyaW5nXG5cdCAqIGZyb20gdW5kZXJzY29yZS5qcywgZGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUlzQXJyYXkgPyBuYXRpdmVJc0FycmF5KG9iaikgOiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSB0cnVlIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG5cdFx0cmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBhIGRlZmF1bHRzIG9iamVjdCwgc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgXy5kZWZhdWx0c1xuXHQgKlxuXHQgKiBVc2VkIGZvciBhYnN0cmFjdGluZyBwYXJhbWV0ZXIgaGFuZGxpbmcgZnJvbSBBUEkgbWV0aG9kc1xuXHQgKi9cblx0ZnVuY3Rpb24gZGVmYXVsdHMob2JqZWN0LCBkZWZzKSB7XG5cdFx0dmFyIGtleTtcblx0XHRvYmplY3QgPSBvYmplY3QgfHwge307XG5cdFx0ZGVmcyA9IGRlZnMgfHwge307XG5cdFx0Ly8gSXRlcmF0ZSBvdmVyIG9iamVjdCBub24tcHJvdG90eXBlIHByb3BlcnRpZXM6XG5cdFx0Zm9yIChrZXkgaW4gZGVmcykge1xuXHRcdFx0aWYgKGRlZnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHQvLyBSZXBsYWNlIHZhbHVlcyB3aXRoIGRlZmF1bHRzIG9ubHkgaWYgdW5kZWZpbmVkIChhbGxvdyBlbXB0eS96ZXJvIHZhbHVlcyk6XG5cdFx0XHRcdGlmIChvYmplY3Rba2V5XSA9PSBudWxsKSBvYmplY3Rba2V5XSA9IGRlZnNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRhdGlvbiBvZiBgQXJyYXkubWFwKClgIGZvciBpdGVyYXRpb24gbG9vcHNcblx0ICpcblx0ICogUmV0dXJucyBhIG5ldyBBcnJheSBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBpdGVyYXRvcmAgb24gZWFjaCBhcnJheSB2YWx1ZS5cblx0ICogRGVmZXJzIHRvIG5hdGl2ZSBBcnJheS5tYXAgaWYgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuXHRcdHZhciByZXN1bHRzID0gW10sIGksIGo7XG5cblx0XHRpZiAoIW9iaikgcmV0dXJuIHJlc3VsdHM7XG5cblx0XHQvLyBVc2UgbmF0aXZlIC5tYXAgbWV0aG9kIGlmIGl0IGV4aXN0czpcblx0XHRpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuXG5cdFx0Ly8gRmFsbGJhY2sgZm9yIG5hdGl2ZSAubWFwOlxuXHRcdGZvciAoaSA9IDAsIGogPSBvYmoubGVuZ3RoOyBpIDwgajsgaSsrICkge1xuXHRcdFx0cmVzdWx0c1tpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBhbmQgbm9ybWFsaXNlIHRoZSB2YWx1ZSBvZiBwcmVjaXNpb24gKG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlcilcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrUHJlY2lzaW9uKHZhbCwgYmFzZSkge1xuXHRcdHZhbCA9IE1hdGgucm91bmQoTWF0aC5hYnModmFsKSk7XG5cdFx0cmV0dXJuIGlzTmFOKHZhbCk/IGJhc2UgOiB2YWw7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBmb3JtYXQgc3RyaW5nIG9yIG9iamVjdCBhbmQgcmV0dXJucyBmb3JtYXQgb2JqIGZvciB1c2UgaW4gcmVuZGVyaW5nXG5cdCAqXG5cdCAqIGBmb3JtYXRgIGlzIGVpdGhlciBhIHN0cmluZyB3aXRoIHRoZSBkZWZhdWx0IChwb3NpdGl2ZSkgZm9ybWF0LCBvciBvYmplY3Rcblx0ICogY29udGFpbmluZyBgcG9zYCAocmVxdWlyZWQpLCBgbmVnYCBhbmQgYHplcm9gIHZhbHVlcyAob3IgYSBmdW5jdGlvbiByZXR1cm5pbmdcblx0ICogZWl0aGVyIGEgc3RyaW5nIG9yIG9iamVjdClcblx0ICpcblx0ICogRWl0aGVyIHN0cmluZyBvciBmb3JtYXQucG9zIG11c3QgY29udGFpbiBcIiV2XCIgKHZhbHVlKSB0byBiZSB2YWxpZFxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDdXJyZW5jeUZvcm1hdChmb3JtYXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0O1xuXG5cdFx0Ly8gQWxsb3cgZnVuY3Rpb24gYXMgZm9ybWF0IHBhcmFtZXRlciAoc2hvdWxkIHJldHVybiBzdHJpbmcgb3Igb2JqZWN0KTpcblx0XHRpZiAoIHR5cGVvZiBmb3JtYXQgPT09IFwiZnVuY3Rpb25cIiApIGZvcm1hdCA9IGZvcm1hdCgpO1xuXG5cdFx0Ly8gRm9ybWF0IGNhbiBiZSBhIHN0cmluZywgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIChcIiV2XCIpIG11c3QgYmUgcHJlc2VudDpcblx0XHRpZiAoIGlzU3RyaW5nKCBmb3JtYXQgKSAmJiBmb3JtYXQubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGFuZCByZXR1cm4gcG9zaXRpdmUsIG5lZ2F0aXZlIGFuZCB6ZXJvIGZvcm1hdHM6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwb3MgOiBmb3JtYXQsXG5cdFx0XHRcdG5lZyA6IGZvcm1hdC5yZXBsYWNlKFwiLVwiLCBcIlwiKS5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBmb3JtYXRcblx0XHRcdH07XG5cblx0XHQvLyBJZiBubyBmb3JtYXQsIG9yIG9iamVjdCBpcyBtaXNzaW5nIHZhbGlkIHBvc2l0aXZlIHZhbHVlLCB1c2UgZGVmYXVsdHM6XG5cdFx0fSBlbHNlIGlmICggIWZvcm1hdCB8fCAhZm9ybWF0LnBvcyB8fCAhZm9ybWF0LnBvcy5tYXRjaChcIiV2XCIpICkge1xuXG5cdFx0XHQvLyBJZiBkZWZhdWx0cyBpcyBhIHN0cmluZywgY2FzdHMgaXQgdG8gYW4gb2JqZWN0IGZvciBmYXN0ZXIgY2hlY2tpbmcgbmV4dCB0aW1lOlxuXHRcdFx0cmV0dXJuICggIWlzU3RyaW5nKCBkZWZhdWx0cyApICkgPyBkZWZhdWx0cyA6IGxpYi5zZXR0aW5ncy5jdXJyZW5jeS5mb3JtYXQgPSB7XG5cdFx0XHRcdHBvcyA6IGRlZmF1bHRzLFxuXHRcdFx0XHRuZWcgOiBkZWZhdWx0cy5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBkZWZhdWx0c1xuXHRcdFx0fTtcblxuXHRcdH1cblx0XHQvLyBPdGhlcndpc2UsIGFzc3VtZSBmb3JtYXQgd2FzIGZpbmU6XG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fVxuXG5cblx0LyogLS0tIEFQSSBNZXRob2RzIC0tLSAqL1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIHN0cmluZy9hcnJheSBvZiBzdHJpbmdzLCByZW1vdmVzIGFsbCBmb3JtYXR0aW5nL2NydWZ0IGFuZCByZXR1cm5zIHRoZSByYXcgZmxvYXQgdmFsdWVcblx0ICogYWxpYXM6IGFjY291bnRpbmcuYHBhcnNlKHN0cmluZylgXG5cdCAqXG5cdCAqIERlY2ltYWwgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGZsb2F0cyAoZGVmYXVsdDogXCIuXCIpLCBzbyBpZiB0aGUgbnVtYmVyXG5cdCAqIHVzZXMgYSBub24tc3RhbmRhcmQgZGVjaW1hbCBzZXBhcmF0b3IsIHByb3ZpZGUgaXQgYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0ICpcblx0ICogQWxzbyBtYXRjaGVzIGJyYWNrZXRlZCBuZWdhdGl2ZXMgKGVnLiBcIiQgKDEuOTkpXCIgPT4gLTEuOTkpXG5cdCAqXG5cdCAqIERvZXNuJ3QgdGhyb3cgYW55IGVycm9ycyAoYE5hTmBzIGJlY29tZSAwKSBidXQgdGhpcyBtYXkgY2hhbmdlIGluIGZ1dHVyZVxuXHQgKi9cblx0dmFyIHVuZm9ybWF0ID0gbGliLnVuZm9ybWF0ID0gbGliLnBhcnNlID0gZnVuY3Rpb24odmFsdWUsIGRlY2ltYWwpIHtcblx0XHQvLyBSZWN1cnNpdmVseSB1bmZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZm9ybWF0KHZhbCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBGYWlscyBzaWxlbnRseSAobmVlZCBkZWNlbnQgZXJyb3JzKTpcblx0XHR2YWx1ZSA9IHZhbHVlIHx8IDA7XG5cblx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGFzLWlzIGlmIGl0J3MgYWxyZWFkeSBhIG51bWJlcjpcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gdmFsdWU7XG5cblx0XHQvLyBEZWZhdWx0IGRlY2ltYWwgcG9pbnQgaXMgXCIuXCIgYnV0IGNvdWxkIGJlIHNldCB0byBlZy4gXCIsXCIgaW4gb3B0czpcblx0XHRkZWNpbWFsID0gZGVjaW1hbCB8fCBcIi5cIjtcblxuXHRcdCAvLyBCdWlsZCByZWdleCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBleGNlcHQgZGlnaXRzLCBkZWNpbWFsIHBvaW50IGFuZCBtaW51cyBzaWduOlxuXHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXjAtOS1cIiArIGRlY2ltYWwgKyBcIl1cIiwgW1wiZ1wiXSksXG5cdFx0XHR1bmZvcm1hdHRlZCA9IHBhcnNlRmxvYXQoXG5cdFx0XHRcdChcIlwiICsgdmFsdWUpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCgoLiopXFwpLywgXCItJDFcIikgLy8gcmVwbGFjZSBicmFja2V0ZWQgdmFsdWVzIHdpdGggbmVnYXRpdmVzXG5cdFx0XHRcdC5yZXBsYWNlKHJlZ2V4LCAnJykgICAgICAgICAvLyBzdHJpcCBvdXQgYW55IGNydWZ0XG5cdFx0XHRcdC5yZXBsYWNlKGRlY2ltYWwsICcuJykgICAgICAvLyBtYWtlIHN1cmUgZGVjaW1hbCBwb2ludCBpcyBzdGFuZGFyZFxuXHRcdFx0KTtcblxuXHRcdC8vIFRoaXMgd2lsbCBmYWlsIHNpbGVudGx5IHdoaWNoIG1heSBjYXVzZSB0cm91YmxlLCBsZXQncyB3YWl0IGFuZCBzZWU6XG5cdFx0cmV0dXJuICFpc05hTih1bmZvcm1hdHRlZCkgPyB1bmZvcm1hdHRlZCA6IDA7XG5cdH07XG5cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcblx0ICpcblx0ICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gXCIwLjYxXCIpIHRoYXQgcHJlc2VudFxuXHQgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cblx0ICovXG5cdHZhciB0b0ZpeGVkID0gbGliLnRvRml4ZWQgPSBmdW5jdGlvbih2YWx1ZSwgcHJlY2lzaW9uKSB7XG5cdFx0cHJlY2lzaW9uID0gY2hlY2tQcmVjaXNpb24ocHJlY2lzaW9uLCBsaWIuc2V0dGluZ3MubnVtYmVyLnByZWNpc2lvbik7XG5cdFx0dmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG5cblx0XHQvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcblx0XHRyZXR1cm4gKE1hdGgucm91bmQobGliLnVuZm9ybWF0KHZhbHVlKSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyLCB3aXRoIGNvbW1hLXNlcGFyYXRlZCB0aG91c2FuZHMgYW5kIGN1c3RvbSBwcmVjaXNpb24vZGVjaW1hbCBwbGFjZXNcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgcHJlY2lzaW9uIGFuZCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9yc1xuXHQgKiAybmQgcGFyYW1ldGVyIGBwcmVjaXNpb25gIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLm51bWJlcmBcblx0ICovXG5cdHZhciBmb3JtYXROdW1iZXIgPSBsaWIuZm9ybWF0TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiBmb3JtYXROdW1iZXIodmFsLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChwcmVjaXNpb24pID8gcHJlY2lzaW9uIDoge1xuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MubnVtYmVyXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDbGVhbiB1cCBwcmVjaXNpb25cblx0XHRcdHVzZVByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSxcblxuXHRcdFx0Ly8gRG8gc29tZSBjYWxjOlxuXHRcdFx0bmVnYXRpdmUgPSBudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiLFxuXHRcdFx0YmFzZSA9IHBhcnNlSW50KHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyIHx8IDApLCB1c2VQcmVjaXNpb24pLCAxMCkgKyBcIlwiLFxuXHRcdFx0bW9kID0gYmFzZS5sZW5ndGggPiAzID8gYmFzZS5sZW5ndGggJSAzIDogMDtcblxuXHRcdC8vIEZvcm1hdCB0aGUgbnVtYmVyOlxuXHRcdHJldHVybiBuZWdhdGl2ZSArIChtb2QgPyBiYXNlLnN1YnN0cigwLCBtb2QpICsgb3B0cy50aG91c2FuZCA6IFwiXCIpICsgYmFzZS5zdWJzdHIobW9kKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgb3B0cy50aG91c2FuZCkgKyAodXNlUHJlY2lzaW9uID8gb3B0cy5kZWNpbWFsICsgdG9GaXhlZChNYXRoLmFicyhudW1iZXIpLCB1c2VQcmVjaXNpb24pLnNwbGl0KCcuJylbMV0gOiBcIlwiKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBudW1iZXIgaW50byBjdXJyZW5jeVxuXHQgKlxuXHQgKiBVc2FnZTogYWNjb3VudGluZy5mb3JtYXRNb25leShudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZHNTZXAsIGRlY2ltYWxTZXAsIGZvcm1hdClcblx0ICogZGVmYXVsdHM6ICgwLCBcIiRcIiwgMiwgXCIsXCIsIFwiLlwiLCBcIiVzJXZcIilcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kIC8gZGVjaW1hbCBzZXBhcmF0b3JzIGFuZCBmb3JtYXRcblx0ICogU2Vjb25kIHBhcmFtIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLmN1cnJlbmN5YCB3aGljaCBpcyB0aGUgZWFzaWVzdCB3YXkuXG5cdCAqXG5cdCAqIFRvIGRvOiB0aWR5IHVwIHRoZSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHR2YXIgZm9ybWF0TW9uZXkgPSBsaWIuZm9ybWF0TW9uZXkgPSBmdW5jdGlvbihudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKXtcblx0XHRcdFx0cmV0dXJuIGZvcm1hdE1vbmV5KHZhbCwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgbnVtYmVyOlxuXHRcdG51bWJlciA9IHVuZm9ybWF0KG51bWJlcik7XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pOlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZTpcblx0XHRcdHVzZUZvcm1hdCA9IG51bWJlciA+IDAgPyBmb3JtYXRzLnBvcyA6IG51bWJlciA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybztcblxuXHRcdC8vIFJldHVybiB3aXRoIGN1cnJlbmN5IHN5bWJvbCBhZGRlZDpcblx0XHRyZXR1cm4gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKG51bWJlciksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbGlzdCBvZiBudW1iZXJzIGludG8gYW4gYWNjb3VudGluZyBjb2x1bW4sIHBhZGRpbmcgd2l0aCB3aGl0ZXNwYWNlXG5cdCAqIHRvIGxpbmUgdXAgY3VycmVuY3kgc3ltYm9scywgdGhvdXNhbmQgc2VwYXJhdG9ycyBhbmQgZGVjaW1hbHMgcGxhY2VzXG5cdCAqXG5cdCAqIExpc3Qgc2hvdWxkIGJlIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICogU2Vjb25kIHBhcmFtZXRlciBjYW4gYmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyB0aGF0IG1hdGNoIHRoZSBwYXJhbXNcblx0ICpcblx0ICogUmV0dXJucyBhcnJheSBvZiBhY2NvdXRpbmctZm9ybWF0dGVkIG51bWJlciBzdHJpbmdzIG9mIHNhbWUgbGVuZ3RoXG5cdCAqXG5cdCAqIE5COiBgd2hpdGUtc3BhY2U6cHJlYCBDU1MgcnVsZSBpcyByZXF1aXJlZCBvbiB0aGUgbGlzdCBjb250YWluZXIgdG8gcHJldmVudFxuXHQgKiBicm93c2VycyBmcm9tIGNvbGxhcHNpbmcgdGhlIHdoaXRlc3BhY2UgaW4gdGhlIG91dHB1dCBzdHJpbmdzLlxuXHQgKi9cblx0bGliLmZvcm1hdENvbHVtbiA9IGZ1bmN0aW9uKGxpc3QsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0aWYgKCFsaXN0KSByZXR1cm4gW107XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pLCBvbmx5IG5lZWQgcG9zIGZvciBub3c6XG5cdFx0XHRmb3JtYXRzID0gY2hlY2tDdXJyZW5jeUZvcm1hdChvcHRzLmZvcm1hdCksXG5cblx0XHRcdC8vIFdoZXRoZXIgdG8gcGFkIGF0IHN0YXJ0IG9mIHN0cmluZyBvciBhZnRlciBjdXJyZW5jeSBzeW1ib2w6XG5cdFx0XHRwYWRBZnRlclN5bWJvbCA9IGZvcm1hdHMucG9zLmluZGV4T2YoXCIlc1wiKSA8IGZvcm1hdHMucG9zLmluZGV4T2YoXCIldlwiKSA/IHRydWUgOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RvcmUgdmFsdWUgZm9yIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nIGluIHRoZSBjb2x1bW46XG5cdFx0XHRtYXhMZW5ndGggPSAwLFxuXG5cdFx0XHQvLyBGb3JtYXQgdGhlIGxpc3QgYWNjb3JkaW5nIHRvIG9wdGlvbnMsIHN0b3JlIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nOlxuXHRcdFx0Zm9ybWF0dGVkID0gbWFwKGxpc3QsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheSh2YWwpKSB7XG5cdFx0XHRcdFx0Ly8gUmVjdXJzaXZlbHkgZm9ybWF0IGNvbHVtbnMgaWYgbGlzdCBpcyBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5OlxuXHRcdFx0XHRcdHJldHVybiBsaWIuZm9ybWF0Q29sdW1uKHZhbCwgb3B0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYW4gdXAgdGhlIHZhbHVlXG5cdFx0XHRcdFx0dmFsID0gdW5mb3JtYXQodmFsKTtcblxuXHRcdFx0XHRcdC8vIENob29zZSB3aGljaCBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIHZhbHVlIChwb3MsIG5lZyBvciB6ZXJvKTpcblx0XHRcdFx0XHR2YXIgdXNlRm9ybWF0ID0gdmFsID4gMCA/IGZvcm1hdHMucG9zIDogdmFsIDwgMCA/IGZvcm1hdHMubmVnIDogZm9ybWF0cy56ZXJvLFxuXG5cdFx0XHRcdFx0XHQvLyBGb3JtYXQgdGhpcyB2YWx1ZSwgcHVzaCBpbnRvIGZvcm1hdHRlZCBsaXN0IGFuZCBzYXZlIHRoZSBsZW5ndGg6XG5cdFx0XHRcdFx0XHRmVmFsID0gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKHZhbCksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cblx0XHRcdFx0XHRpZiAoZlZhbC5sZW5ndGggPiBtYXhMZW5ndGgpIG1heExlbmd0aCA9IGZWYWwubGVuZ3RoO1xuXHRcdFx0XHRcdHJldHVybiBmVmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIFBhZCBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBhbmQgc2VuZCBiYWNrIHRoZSBjb2x1bW4gb2YgbnVtYmVyczpcblx0XHRyZXR1cm4gbWFwKGZvcm1hdHRlZCwgZnVuY3Rpb24odmFsLCBpKSB7XG5cdFx0XHQvLyBPbmx5IGlmIHRoaXMgaXMgYSBzdHJpbmcgKG5vdCBhIG5lc3RlZCBhcnJheSwgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcGFkZGVkKTpcblx0XHRcdGlmIChpc1N0cmluZyh2YWwpICYmIHZhbC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcblx0XHRcdFx0Ly8gRGVwZW5kaW5nIG9uIHN5bWJvbCBwb3NpdGlvbiwgcGFkIGFmdGVyIHN5bWJvbCBvciBhdCBpbmRleCAwOlxuXHRcdFx0XHRyZXR1cm4gcGFkQWZ0ZXJTeW1ib2wgPyB2YWwucmVwbGFjZShvcHRzLnN5bWJvbCwgb3B0cy5zeW1ib2wrKG5ldyBBcnJheShtYXhMZW5ndGggLSB2YWwubGVuZ3RoICsgMSkuam9pbihcIiBcIikpKSA6IChuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSArIHZhbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvKiAtLS0gTW9kdWxlIERlZmluaXRpb24gLS0tICovXG5cblx0Ly8gRXhwb3J0IGFjY291bnRpbmcgZm9yIENvbW1vbkpTLiBJZiBiZWluZyBsb2FkZWQgYXMgYW4gQU1EIG1vZHVsZSwgZGVmaW5lIGl0IGFzIHN1Y2guXG5cdC8vIE90aGVyd2lzZSwganVzdCBhZGQgYGFjY291bnRpbmdgIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5cdGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRcdGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblx0XHR9XG5cdFx0ZXhwb3J0cy5hY2NvdW50aW5nID0gbGliO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIFJldHVybiB0aGUgbGlicmFyeSBhcyBhbiBBTUQgbW9kdWxlOlxuXHRcdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbGliO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFVzZSBhY2NvdW50aW5nLm5vQ29uZmxpY3QgdG8gcmVzdG9yZSBgYWNjb3VudGluZ2AgYmFjayB0byBpdHMgb3JpZ2luYWwgdmFsdWUuXG5cdFx0Ly8gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSdzIGBhY2NvdW50aW5nYCBvYmplY3Q7XG5cdFx0Ly8gZS5nLiBgdmFyIG51bWJlcnMgPSBhY2NvdW50aW5nLm5vQ29uZmxpY3QoKTtgXG5cdFx0bGliLm5vQ29uZmxpY3QgPSAoZnVuY3Rpb24ob2xkQWNjb3VudGluZykge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBSZXNldCB0aGUgdmFsdWUgb2YgdGhlIHJvb3QncyBgYWNjb3VudGluZ2AgdmFyaWFibGU6XG5cdFx0XHRcdHJvb3QuYWNjb3VudGluZyA9IG9sZEFjY291bnRpbmc7XG5cdFx0XHRcdC8vIERlbGV0ZSB0aGUgbm9Db25mbGljdCBtZXRob2Q6XG5cdFx0XHRcdGxpYi5ub0NvbmZsaWN0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHQvLyBSZXR1cm4gcmVmZXJlbmNlIHRvIHRoZSBsaWJyYXJ5IHRvIHJlLWFzc2lnbiBpdDpcblx0XHRcdFx0cmV0dXJuIGxpYjtcblx0XHRcdH07XG5cdFx0fSkocm9vdC5hY2NvdW50aW5nKTtcblxuXHRcdC8vIERlY2xhcmUgYGZ4YCBvbiB0aGUgcm9vdCAoZ2xvYmFsL3dpbmRvdykgb2JqZWN0OlxuXHRcdHJvb3RbJ2FjY291bnRpbmcnXSA9IGxpYjtcblx0fVxuXG5cdC8vIFJvb3Qgd2lsbCBiZSBgd2luZG93YCBpbiBicm93c2VyIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXI6XG59KHRoaXMpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzXG4gKiogbW9kdWxlIGlkID0gNjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJylcclxuICAgIDtcclxuXHJcbnZhciBBdXRoID0gRm9ybS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnbG9naW4nLFxyXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZm9yZ290dGVucGFzczogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICB1c2VyOiB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3BvcHVwJykpIHtcclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvJyArIHRoaXMuZ2V0KCdhY3Rpb24nKSxcclxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSwgcGFzc3dvcmQ6IHRoaXMuZ2V0KCd1c2VyLnBhc3N3b3JkJykgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2aWV3LmdldCgncG9wdXAnKT09bnVsbCAmJiBkYXRhICYmIGRhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldFBhc3N3b3JkOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL2ZvcmdvdHRlbnBhc3MnLFxyXG4gICAgICAgICAgICBkYXRhOiB7IGVtYWlsOiB0aGlzLmdldCgndXNlci5sb2dpbicpIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgncmVzZXRzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaWdudXA6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC9zaWdudXAnLFxyXG4gICAgICAgICAgICBkYXRhOiBfLnBpY2sodGhpcy5nZXQoJ3VzZXInKSwgWydlbWFpbCcsJ25hbWUnLCAnbW9iaWxlJywgJ3Bhc3N3b3JkJywgJ3Bhc3N3b3JkMiddKSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzaWdudXBzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5BdXRoLmxvZ2luID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XHJcblxyXG4gICAgYXV0aC5zZXQoJ3BvcHVwJywgdHJ1ZSk7XHJcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xyXG4gICAgYXV0aC5yZW5kZXIoJyNwb3B1cC1jb250YWluZXInKTtcclxuXHJcbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xyXG59O1xyXG5cclxuQXV0aC5zaWdudXAgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcclxuXHJcbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcclxuICAgIGF1dGguc2V0KCdzaWdudXAnLCB0cnVlKTtcclxuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGg7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanNcbiAqKiBtb2R1bGUgaWQgPSA3M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMyA0IDUgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbG9naW4gc21hbGwgbW9kYWxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIkxvZ2luXCJdLFwiblwiOjUxLFwieFwiOntcInJcIjpbXCJmb3Jnb3R0ZW5wYXNzXCIsXCJzaWdudXBcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlNpZ24tdXBcIl0sXCJuXCI6NTAsXCJyXCI6XCJzaWdudXBcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiUmVzZXQgcGFzc3dvcmRcIl0sXCJuXCI6NTAsXCJyXCI6XCJmb3Jnb3R0ZW5wYXNzXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJwb3B1cFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XSxcInJcIjpcInBvcHVwXCJ9XSxcInBcIjp7XCJmb3JtXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJmb3JtXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widWkgYmFzaWMgc2VnbWVudCBmb3JtXCJdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdWJtaXR0aW5nXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImhpZGVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImZvcmdvdHRlbnBhc3NcIixcInNpZ251cFwiXSxcInNcIjpcIl8wfHxfMVwifX1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsb2dpblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmxvZ2luXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkxvZ2luXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicGFzc3dvcmRcIixcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIucGFzc3dvcmRcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmRcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6W1widWkgXCIse1widFwiOjQsXCJmXCI6W1wic21hbGxcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJtYXNzaXZlXCJdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJdfSxcImZcIjpbXCJMT0dJTlwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6XCJmb3Jnb3QtcGFzc3dvcmRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImZvcmdvdHRlbnBhc3NcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiRm9yZ290IFBhc3N3b3JkP1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIkRvbuKAmXQgaGF2ZSBhIENoZWFwVGlja2V0LmluIEFjY291bnQ/IFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzaWdudXBcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiU2lnbiB1cCBmb3Igb25lIMK7XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcInNpZ251cFwifV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmVtYWlsXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibW9iaWxlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIubW9iaWxlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZVwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIm5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5uYW1lXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIk5hbWVcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwibmFtZVwiOlwicGFzc3dvcmRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJuYW1lXCI6XCJwYXNzd29yZDJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZDJcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmQgYWdhaW5cIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJidXR0b25cIixcImNsYXNzXCI6XCJ1aSBtYXNzaXZlIGZsdWlkIGJsdWUgYnV0dG9uIHVwcGVyY2FzZVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNpZ251cFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiU2lnbnVwXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV0sXCJuXCI6NTEsXCJyXCI6XCJzaWdudXBzdWNjZXNzXCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiWW91ciByZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3MuXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIllvdSB3aWxsIHJlY2VpdmUgZW1haWwgd2l0aCBmdXJ0aGVyIGluc3RydWN0aW9ucyBmcm9tIHVzIGhvdyB0byBwcm9jZWVkLlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJQbGVhc2UgY2hlY2sgeW91ciBpbmJveCBhbmQgaWYgbm8gZW1haWwgZnJvbSB1cyBpcyBmb3VuZCwgY2hlY2sgYWxzbyB5b3VyIFNQQU0gZm9sZGVyLlwiXSxcIm5cIjo1MCxcInJcIjpcInNpZ251cHN1Y2Nlc3NcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcImZvcmdvdHRlbnBhc3NcIn1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibG9naW5cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5sb2dpblwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJFbWFpbFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIG1hc3NpdmUgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVzZXRQYXNzd29yZFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiUkVTRVRcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yTXNnXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2dcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19XSxcIm5cIjo1MSxcInJcIjpcInJlc2V0c3VjY2Vzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJJbnN0cnVjdGlvbnMgaG93IHRvIHJldml2ZSB5b3VyIHBhc3N3b3JkIGhhcyBiZWVuIHNlbnQgdG8geW91ciBlbWFpbC5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwuXCJdLFwiblwiOjUwLFwiclwiOlwicmVzZXRzdWNjZXNzXCJ9XX1dfV19fTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2FwcC9hdXRoLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA3NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMyA0IDUgOFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIHBhZGR5KG4sIHAsIGMpIHtcclxuICAgIHZhciBwYWRfY2hhciA9IHR5cGVvZiBjICE9PSAndW5kZWZpbmVkJyA/IGMgOiAnMCc7XHJcbiAgICB2YXIgcGFkID0gbmV3IEFycmF5KDEgKyBwKS5qb2luKHBhZF9jaGFyKTtcclxuICAgIHJldHVybiAocGFkICsgbikuc2xpY2UoLXBhZC5sZW5ndGgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmb3JtYXQ6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghZHVyYXRpb24pXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB2YXIgaSA9IGR1cmF0aW9uLmFzTWludXRlcygpLFxyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBNYXRoLmZsb29yKGkvNjApLFxyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IGkgJSA2MFxyXG4gICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhZGR5KGhvdXJzLCAyKSArICdoICcgKyBwYWRkeShtaW51dGVzLCAyKSArICdtJztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9oZWxwZXJzL2R1cmF0aW9uLmpzXG4gKiogbW9kdWxlIGlkID0gNzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDhcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgb3V0ID0ge1xyXG4gICAgICAgIEQ6IF8ucmFuZ2UoMSwzMiksXHJcbiAgICAgICAgTTogXy5yYW5nZSgxLDEzKSxcclxuICAgICAgICBNTU1NOiBtb21lbnQubW9udGhzKClcclxuICAgIH07XHJcblxyXG4gICAgb3V0LnNlbGVjdCA9IHtcclxuICAgICAgICBEOiBfLm1hcChvdXQuRCwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogXy5wYWRMZWZ0KGksIDIsIDApLCB0ZXh0OiBpIH07IH0pLFxyXG4gICAgICAgIE06IF8ubWFwKG91dC5NLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBfLnBhZExlZnQoaSwgMiwgMCksIHRleHQ6IGkgfTsgfSksXHJcbiAgICAgICAgTU1NTTogXy5tYXAob3V0Lk1NTU0sIGZ1bmN0aW9uKGksIGspIHsgcmV0dXJuIHsgaWQ6IF8ucGFkTGVmdChrICsgMSwgMiwgMCksIHRleHQ6IGkgfTsgfSksXHJcblxyXG4gICAgICAgIHBhc3Nwb3J0WWVhcnM6IF8ubWFwKF8ucmFuZ2UobW9tZW50KCkueWVhcigpLCBtb21lbnQoKS55ZWFyKCkgKyAxNSksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6ICcnK2ksIHRleHQ6ICcnK2kgfTsgfSksXHJcblxyXG4gICAgICAgIGJpcnRoWWVhcnM6IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKF8ucmFuZ2UobW9tZW50KCkueWVhcigpLCAxODk5LCAtMSksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6ICcnK2ksIHRleHQ6ICcnK2kgfTsgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2FyZFllYXJzOiBfLm1hcChfLnJhbmdlKG1vbWVudCgpLnllYXIoKSwgbW9tZW50KCkuYWRkKDI1LCAneWVhcnMnKS55ZWFyKCkpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiAnJytpLCB0ZXh0OiAnJytpIH07IH0pLFxyXG4gICAgICAgIGNhcmRNb250aHM6IF8ubWFwKG91dC5NTU1NLCBmdW5jdGlvbihpLCBrKSB7IHJldHVybiB7IGlkOiBrICsgMSwgdGV4dDogXy5wYWRMZWZ0KGsrMSwgMiwgJzAnKSArICcgJyArIGkgfTsgfSlcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2hlbHBlcnMvZGF0ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDg4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA4XG4gKiovIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgY2FyZEZyb21OdW1iZXIsIGNhcmRGcm9tVHlwZSwgY2FyZHMsIGRlZmF1bHRGb3JtYXQsIGZvcm1hdEJhY2tDYXJkTnVtYmVyLCBmb3JtYXRCYWNrRXhwaXJ5LCBmb3JtYXRDYXJkTnVtYmVyLCBmb3JtYXRFeHBpcnksIGZvcm1hdEZvcndhcmRFeHBpcnksIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlLCBoYXNUZXh0U2VsZWN0ZWQsIGx1aG5DaGVjaywgcmVGb3JtYXRDVkMsIHJlRm9ybWF0Q2FyZE51bWJlciwgcmVGb3JtYXRFeHBpcnksIHJlRm9ybWF0TnVtZXJpYywgcmVzdHJpY3RDVkMsIHJlc3RyaWN0Q2FyZE51bWJlciwgcmVzdHJpY3RFeHBpcnksIHJlc3RyaWN0TnVtZXJpYywgc2V0Q2FyZFR5cGUsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gICQucGF5bWVudCA9IHt9O1xuXG4gICQucGF5bWVudC5mbiA9IHt9O1xuXG4gICQuZm4ucGF5bWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBtZXRob2Q7XG4gICAgbWV0aG9kID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICByZXR1cm4gJC5wYXltZW50LmZuW21ldGhvZF0uYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG5cbiAgZGVmYXVsdEZvcm1hdCA9IC8oXFxkezEsNH0pL2c7XG5cbiAgJC5wYXltZW50LmNhcmRzID0gY2FyZHMgPSBbXG4gICAge1xuICAgICAgdHlwZTogJ3Zpc2FlbGVjdHJvbicsXG4gICAgICBwYXR0ZXJuOiAvXjQoMDI2fDE3NTAwfDQwNXw1MDh8ODQ0fDkxWzM3XSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ21hZXN0cm8nLFxuICAgICAgcGF0dGVybjogL14oNSgwMTh8MFsyM118WzY4XSl8NigzOXw3KSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICdmb3JicnVnc2ZvcmVuaW5nZW4nLFxuICAgICAgcGF0dGVybjogL142MDAvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2RhbmtvcnQnLFxuICAgICAgcGF0dGVybjogL141MDE5LyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIHR5cGU6ICd2aXNhJyxcbiAgICAgIHBhdHRlcm46IC9eNC8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxMywgMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ21hc3RlcmNhcmQnLFxuICAgICAgcGF0dGVybjogL14oNVswLTVdfDJbMi03XSkvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2FtZXgnLFxuICAgICAgcGF0dGVybjogL14zWzQ3XS8sXG4gICAgICBmb3JtYXQ6IC8oXFxkezEsNH0pKFxcZHsxLDZ9KT8oXFxkezEsNX0pPy8sXG4gICAgICBsZW5ndGg6IFsxNV0sXG4gICAgICBjdmNMZW5ndGg6IFszLCA0XSxcbiAgICAgIGx1aG46IHRydWVcbiAgICB9LCB7XG4gICAgICB0eXBlOiAnZGluZXJzY2x1YicsXG4gICAgICBwYXR0ZXJuOiAvXjNbMDY4OV0vLFxuICAgICAgZm9ybWF0OiAvKFxcZHsxLDR9KShcXGR7MSw2fSk/KFxcZHsxLDR9KT8vLFxuICAgICAgbGVuZ3RoOiBbMTRdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2Rpc2NvdmVyJyxcbiAgICAgIHBhdHRlcm46IC9eNihbMDQ1XXwyMikvLFxuICAgICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgICAgbGVuZ3RoOiBbMTZdLFxuICAgICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgICBsdWhuOiB0cnVlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ3VuaW9ucGF5JyxcbiAgICAgIHBhdHRlcm46IC9eKDYyfDg4KS8sXG4gICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgICBsZW5ndGg6IFsxNiwgMTcsIDE4LCAxOV0sXG4gICAgICBjdmNMZW5ndGg6IFszXSxcbiAgICAgIGx1aG46IGZhbHNlXG4gICAgfSwge1xuICAgICAgdHlwZTogJ2pjYicsXG4gICAgICBwYXR0ZXJuOiAvXjM1LyxcbiAgICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICAgIGxlbmd0aDogWzE2XSxcbiAgICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgICAgbHVobjogdHJ1ZVxuICAgIH1cbiAgXTtcblxuICBjYXJkRnJvbU51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBfaSwgX2xlbjtcbiAgICBudW0gPSAobnVtICsgJycpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBjYXJkcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgY2FyZCA9IGNhcmRzW19pXTtcbiAgICAgIGlmIChjYXJkLnBhdHRlcm4udGVzdChudW0pKSB7XG4gICAgICAgIHJldHVybiBjYXJkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjYXJkRnJvbVR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgdmFyIGNhcmQsIF9pLCBfbGVuO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gY2FyZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGNhcmQgPSBjYXJkc1tfaV07XG4gICAgICBpZiAoY2FyZC50eXBlID09PSB0eXBlKSB7XG4gICAgICAgIHJldHVybiBjYXJkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBsdWhuQ2hlY2sgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgZGlnaXQsIGRpZ2l0cywgb2RkLCBzdW0sIF9pLCBfbGVuO1xuICAgIG9kZCA9IHRydWU7XG4gICAgc3VtID0gMDtcbiAgICBkaWdpdHMgPSAobnVtICsgJycpLnNwbGl0KCcnKS5yZXZlcnNlKCk7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBkaWdpdHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGRpZ2l0ID0gZGlnaXRzW19pXTtcbiAgICAgIGRpZ2l0ID0gcGFyc2VJbnQoZGlnaXQsIDEwKTtcbiAgICAgIGlmICgob2RkID0gIW9kZCkpIHtcbiAgICAgICAgZGlnaXQgKj0gMjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWdpdCA+IDkpIHtcbiAgICAgICAgZGlnaXQgLT0gOTtcbiAgICAgIH1cbiAgICAgIHN1bSArPSBkaWdpdDtcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAlIDEwID09PSAwO1xuICB9O1xuXG4gIGhhc1RleHRTZWxlY3RlZCA9IGZ1bmN0aW9uKCR0YXJnZXQpIHtcbiAgICB2YXIgX3JlZjtcbiAgICBpZiAoKCR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPSBudWxsKSAmJiAkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT09ICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uRW5kJykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudCAhPT0gbnVsbCA/IChfcmVmID0gZG9jdW1lbnQuc2VsZWN0aW9uKSAhPSBudWxsID8gX3JlZi5jcmVhdGVSYW5nZSA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZUZvcm1hdE51bWVyaWMgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZUZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSAkLnBheW1lbnQuZm9ybWF0Q2FyZE51bWJlcih2YWx1ZSk7XG4gICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGNhcmQsIGRpZ2l0LCBsZW5ndGgsIHJlLCB1cHBlckxlbmd0aCwgdmFsdWU7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKHZhbHVlICsgZGlnaXQpO1xuICAgIGxlbmd0aCA9ICh2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpICsgZGlnaXQpLmxlbmd0aDtcbiAgICB1cHBlckxlbmd0aCA9IDE2O1xuICAgIGlmIChjYXJkKSB7XG4gICAgICB1cHBlckxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID49IHVwcGVyTGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjYXJkICYmIGNhcmQudHlwZSA9PT0gJ2FtZXgnKSB7XG4gICAgICByZSA9IC9eKFxcZHs0fXxcXGR7NH1cXHNcXGR7Nn0pJC87XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlID0gLyg/Ol58XFxzKShcXGR7NH0pJC87XG4gICAgfVxuICAgIGlmIChyZS50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSArICcgJyArIGRpZ2l0KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmUudGVzdCh2YWx1ZSArIGRpZ2l0KSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZSArIGRpZ2l0ICsgJyAnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmb3JtYXRCYWNrQ2FyZE51bWJlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgaWYgKGUud2hpY2ggIT09IDgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCgkdGFyZ2V0LnByb3AoJ3NlbGVjdGlvblN0YXJ0JykgIT0gbnVsbCkgJiYgJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9PSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKC9cXGRcXHMkLy50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZS5yZXBsYWNlKC9cXGRcXHMkLywgJycpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoL1xcc1xcZD8kLy50ZXN0KHZhbHVlKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0LnZhbCh2YWx1ZS5yZXBsYWNlKC9cXGQkLywgJycpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZUZvcm1hdEV4cGlyeSA9IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdGFyZ2V0LCB2YWx1ZTtcbiAgICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICB2YWx1ZSA9ICR0YXJnZXQudmFsKCk7XG4gICAgICB2YWx1ZSA9ICQucGF5bWVudC5mb3JtYXRFeHBpcnkodmFsdWUpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICBmb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWw7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgaWYgKC9eXFxkJC8udGVzdCh2YWwpICYmICh2YWwgIT09ICcwJyAmJiB2YWwgIT09ICcxJykpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCIwXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoL15cXGRcXGQkLy50ZXN0KHZhbCkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwoXCJcIiArIHZhbCArIFwiIC8gXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdEZvcndhcmRFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWw7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmICgvXlxcZFxcZCQvLnRlc3QodmFsKSkge1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiXCIgKyB2YWwgKyBcIiAvIFwiKTtcbiAgICB9XG4gIH07XG5cbiAgZm9ybWF0Rm9yd2FyZFNsYXNoQW5kU3BhY2UgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIHZhbCwgd2hpY2g7XG4gICAgd2hpY2ggPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghKHdoaWNoID09PSAnLycgfHwgd2hpY2ggPT09ICcgJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiB2YWwgIT09ICcwJykge1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKFwiMFwiICsgdmFsICsgXCIgLyBcIik7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdEJhY2tFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIHZhbHVlO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGlmIChlLndoaWNoICE9PSA4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoJHRhcmdldC5wcm9wKCdzZWxlY3Rpb25TdGFydCcpICE9IG51bGwpICYmICR0YXJnZXQucHJvcCgnc2VsZWN0aW9uU3RhcnQnKSAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgvXFxkXFxzXFwvXFxzJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC52YWwodmFsdWUucmVwbGFjZSgvXFxkXFxzXFwvXFxzJC8sICcnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmVGb3JtYXRDVkMgPSBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRhcmdldCwgdmFsdWU7XG4gICAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDQpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudmFsKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXN0cmljdE51bWVyaWMgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGlucHV0O1xuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGUud2hpY2ggPT09IDMyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChlLndoaWNoID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGUud2hpY2ggPCAzMykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlucHV0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICByZXR1cm4gISEvW1xcZFxcc10vLnRlc3QoaW5wdXQpO1xuICB9O1xuXG4gIHJlc3RyaWN0Q2FyZE51bWJlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgY2FyZCwgZGlnaXQsIHZhbHVlO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCgkdGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YWx1ZSA9ICgkdGFyZ2V0LnZhbCgpICsgZGlnaXQpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoY2FyZCkge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSAxNjtcbiAgICB9XG4gIH07XG5cbiAgcmVzdHJpY3RFeHBpcnkgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyICR0YXJnZXQsIGRpZ2l0LCB2YWx1ZTtcbiAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQoJHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFsdWUgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPiA2KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIHJlc3RyaWN0Q1ZDID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciAkdGFyZ2V0LCBkaWdpdCwgdmFsO1xuICAgICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCgkdGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpICsgZGlnaXQ7XG4gICAgcmV0dXJuIHZhbC5sZW5ndGggPD0gNDtcbiAgfTtcblxuICBzZXRDYXJkVHlwZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgJHRhcmdldCwgYWxsVHlwZXMsIGNhcmQsIGNhcmRUeXBlLCB2YWw7XG4gICAgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YWwgPSAkdGFyZ2V0LnZhbCgpO1xuICAgIGNhcmRUeXBlID0gJC5wYXltZW50LmNhcmRUeXBlKHZhbCkgfHwgJ3Vua25vd24nO1xuICAgIGlmICghJHRhcmdldC5oYXNDbGFzcyhjYXJkVHlwZSkpIHtcbiAgICAgIGFsbFR5cGVzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGNhcmRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgY2FyZCA9IGNhcmRzW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGNhcmQudHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ3Vua25vd24nKTtcbiAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoYWxsVHlwZXMuam9pbignICcpKTtcbiAgICAgICR0YXJnZXQuYWRkQ2xhc3MoY2FyZFR5cGUpO1xuICAgICAgJHRhcmdldC50b2dnbGVDbGFzcygnaWRlbnRpZmllZCcsIGNhcmRUeXBlICE9PSAndW5rbm93bicpO1xuICAgICAgcmV0dXJuICR0YXJnZXQudHJpZ2dlcigncGF5bWVudC5jYXJkVHlwZScsIGNhcmRUeXBlKTtcbiAgICB9XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmZvcm1hdENhcmRDVkMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdENWQyk7XG4gICAgdGhpcy5vbigncGFzdGUnLCByZUZvcm1hdENWQyk7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRDVkMpO1xuICAgIHRoaXMub24oJ2lucHV0JywgcmVGb3JtYXRDVkMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gICQucGF5bWVudC5mbi5mb3JtYXRDYXJkRXhwaXJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdE51bWVyaWMpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3RFeHBpcnkpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0RXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdEZvcndhcmRTbGFzaEFuZFNwYWNlKTtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIGZvcm1hdEZvcndhcmRFeHBpcnkpO1xuICAgIHRoaXMub24oJ2tleWRvd24nLCBmb3JtYXRCYWNrRXhwaXJ5KTtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCByZUZvcm1hdEV4cGlyeSk7XG4gICAgdGhpcy5vbignaW5wdXQnLCByZUZvcm1hdEV4cGlyeSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmZvcm1hdENhcmROdW1iZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9uKCdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCByZXN0cmljdENhcmROdW1iZXIpO1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgZm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbigna2V5ZG93bicsIGZvcm1hdEJhY2tDYXJkTnVtYmVyKTtcbiAgICB0aGlzLm9uKCdrZXl1cCcsIHNldENhcmRUeXBlKTtcbiAgICB0aGlzLm9uKCdwYXN0ZScsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXRDYXJkTnVtYmVyKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgdGhpcy5vbignaW5wdXQnLCBzZXRDYXJkVHlwZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLnJlc3RyaWN0TnVtZXJpYyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMub24oJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgICB0aGlzLm9uKCdwYXN0ZScsIHJlRm9ybWF0TnVtZXJpYyk7XG4gICAgdGhpcy5vbignY2hhbmdlJywgcmVGb3JtYXROdW1lcmljKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHJlRm9ybWF0TnVtZXJpYyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5wYXltZW50LmZuLmNhcmRFeHBpcnlWYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJC5wYXltZW50LmNhcmRFeHBpcnlWYWwoJCh0aGlzKS52YWwoKSk7XG4gIH07XG5cbiAgJC5wYXltZW50LmNhcmRFeHBpcnlWYWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBtb250aCwgcHJlZml4LCB5ZWFyLCBfcmVmO1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICBfcmVmID0gdmFsdWUuc3BsaXQoJy8nLCAyKSwgbW9udGggPSBfcmVmWzBdLCB5ZWFyID0gX3JlZlsxXTtcbiAgICBpZiAoKHllYXIgIT0gbnVsbCA/IHllYXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMiAmJiAvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICBwcmVmaXggPSAobmV3IERhdGUpLmdldEZ1bGxZZWFyKCk7XG4gICAgICBwcmVmaXggPSBwcmVmaXgudG9TdHJpbmcoKS5zbGljZSgwLCAyKTtcbiAgICAgIHllYXIgPSBwcmVmaXggKyB5ZWFyO1xuICAgIH1cbiAgICBtb250aCA9IHBhcnNlSW50KG1vbnRoLCAxMCk7XG4gICAgeWVhciA9IHBhcnNlSW50KHllYXIsIDEwKTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgeWVhcjogeWVhclxuICAgIH07XG4gIH07XG5cbiAgJC5wYXltZW50LnZhbGlkYXRlQ2FyZE51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBfcmVmO1xuICAgIG51bSA9IChudW0gKyAnJykucmVwbGFjZSgvXFxzK3wtL2csICcnKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QobnVtKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICBpZiAoIWNhcmQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIChfcmVmID0gbnVtLmxlbmd0aCwgX19pbmRleE9mLmNhbGwoY2FyZC5sZW5ndGgsIF9yZWYpID49IDApICYmIChjYXJkLmx1aG4gPT09IGZhbHNlIHx8IGx1aG5DaGVjayhudW0pKTtcbiAgfTtcblxuICAkLnBheW1lbnQudmFsaWRhdGVDYXJkRXhwaXJ5ID0gZnVuY3Rpb24obW9udGgsIHllYXIpIHtcbiAgICB2YXIgY3VycmVudFRpbWUsIGV4cGlyeSwgX3JlZjtcbiAgICBpZiAodHlwZW9mIG1vbnRoID09PSAnb2JqZWN0JyAmJiAnbW9udGgnIGluIG1vbnRoKSB7XG4gICAgICBfcmVmID0gbW9udGgsIG1vbnRoID0gX3JlZi5tb250aCwgeWVhciA9IF9yZWYueWVhcjtcbiAgICB9XG4gICAgaWYgKCEobW9udGggJiYgeWVhcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbW9udGggPSAkLnRyaW0obW9udGgpO1xuICAgIHllYXIgPSAkLnRyaW0oeWVhcik7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KG1vbnRoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoeWVhcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCEoKDEgPD0gbW9udGggJiYgbW9udGggPD0gMTIpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoeWVhci5sZW5ndGggPT09IDIpIHtcbiAgICAgIGlmICh5ZWFyIDwgNzApIHtcbiAgICAgICAgeWVhciA9IFwiMjBcIiArIHllYXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB5ZWFyID0gXCIxOVwiICsgeWVhcjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHllYXIubGVuZ3RoICE9PSA0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGV4cGlyeSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKTtcbiAgICBjdXJyZW50VGltZSA9IG5ldyBEYXRlO1xuICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSAtIDEpO1xuICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSArIDEsIDEpO1xuICAgIHJldHVybiBleHBpcnkgPiBjdXJyZW50VGltZTtcbiAgfTtcblxuICAkLnBheW1lbnQudmFsaWRhdGVDYXJkQ1ZDID0gZnVuY3Rpb24oY3ZjLCB0eXBlKSB7XG4gICAgdmFyIGNhcmQsIF9yZWY7XG4gICAgY3ZjID0gJC50cmltKGN2Yyk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGN2YykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2FyZCA9IGNhcmRGcm9tVHlwZSh0eXBlKTtcbiAgICBpZiAoY2FyZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gX3JlZiA9IGN2Yy5sZW5ndGgsIF9faW5kZXhPZi5jYWxsKGNhcmQuY3ZjTGVuZ3RoLCBfcmVmKSA+PSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3ZjLmxlbmd0aCA+PSAzICYmIGN2Yy5sZW5ndGggPD0gNDtcbiAgICB9XG4gIH07XG5cbiAgJC5wYXltZW50LmNhcmRUeXBlID0gZnVuY3Rpb24obnVtKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgaWYgKCFudW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKChfcmVmID0gY2FyZEZyb21OdW1iZXIobnVtKSkgIT0gbnVsbCA/IF9yZWYudHlwZSA6IHZvaWQgMCkgfHwgbnVsbDtcbiAgfTtcblxuICAkLnBheW1lbnQuZm9ybWF0Q2FyZE51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBjYXJkLCBncm91cHMsIHVwcGVyTGVuZ3RoLCBfcmVmO1xuICAgIG51bSA9IG51bS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcihudW0pO1xuICAgIGlmICghY2FyZCkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG4gICAgdXBwZXJMZW5ndGggPSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICBudW0gPSBudW0uc2xpY2UoMCwgdXBwZXJMZW5ndGgpO1xuICAgIGlmIChjYXJkLmZvcm1hdC5nbG9iYWwpIHtcbiAgICAgIHJldHVybiAoX3JlZiA9IG51bS5tYXRjaChjYXJkLmZvcm1hdCkpICE9IG51bGwgPyBfcmVmLmpvaW4oJyAnKSA6IHZvaWQgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JvdXBzID0gY2FyZC5mb3JtYXQuZXhlYyhudW0pO1xuICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGdyb3Vwcy5zaGlmdCgpO1xuICAgICAgZ3JvdXBzID0gJC5ncmVwKGdyb3VwcywgZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbjtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGdyb3Vwcy5qb2luKCcgJyk7XG4gICAgfVxuICB9O1xuXG4gICQucGF5bWVudC5mb3JtYXRFeHBpcnkgPSBmdW5jdGlvbihleHBpcnkpIHtcbiAgICB2YXIgbW9uLCBwYXJ0cywgc2VwLCB5ZWFyO1xuICAgIHBhcnRzID0gZXhwaXJ5Lm1hdGNoKC9eXFxEKihcXGR7MSwyfSkoXFxEKyk/KFxcZHsxLDR9KT8vKTtcbiAgICBpZiAoIXBhcnRzKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIG1vbiA9IHBhcnRzWzFdIHx8ICcnO1xuICAgIHNlcCA9IHBhcnRzWzJdIHx8ICcnO1xuICAgIHllYXIgPSBwYXJ0c1szXSB8fCAnJztcbiAgICBpZiAoeWVhci5sZW5ndGggPiAwKSB7XG4gICAgICBzZXAgPSAnIC8gJztcbiAgICB9IGVsc2UgaWYgKHNlcCA9PT0gJyAvJykge1xuICAgICAgbW9uID0gbW9uLnN1YnN0cmluZygwLCAxKTtcbiAgICAgIHNlcCA9ICcnO1xuICAgIH0gZWxzZSBpZiAobW9uLmxlbmd0aCA9PT0gMiB8fCBzZXAubGVuZ3RoID4gMCkge1xuICAgICAgc2VwID0gJyAvICc7XG4gICAgfSBlbHNlIGlmIChtb24ubGVuZ3RoID09PSAxICYmIChtb24gIT09ICcwJyAmJiBtb24gIT09ICcxJykpIHtcbiAgICAgIG1vbiA9IFwiMFwiICsgbW9uO1xuICAgICAgc2VwID0gJyAvICc7XG4gICAgfVxuICAgIHJldHVybiBtb24gKyBzZXAgKyB5ZWFyO1xuICB9O1xuXG59KS5jYWxsKHRoaXMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3ZlbmRvci9qcXVlcnkucGF5bWVudC9saWIvanF1ZXJ5LnBheW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA5MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJ2pxdWVyeS5wYXltZW50Jyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuLi9pbnB1dCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vY2MuaHRtbCcpLFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcblxyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5wYXltZW50KCdmb3JtYXRDYXJkTnVtYmVyJyk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnY2N0eXBlJywgJC5wYXltZW50LmNhcmRUeXBlKHZhbHVlKSk7XHJcbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Rlc3Ryb3knKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9jYy9udW1iZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA5MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgaW5wdXQgXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcImVycm9yXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjbGFzc2VzXCIsXCJzdGF0ZVwiLFwibGFyZ2VcIixcInZhbHVlXCJdLFwic1wiOlwiXzAoXzEsXzIsXzMpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcGxhY2Vob2xkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJsYXJnZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJ0ZXh0XCJdLFwiblwiOjUwLFwiclwiOlwiZGlzYWJsZWRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widGVsXCJdLFwiclwiOlwiZGlzYWJsZWRcIn1dLFwibmFtZVwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJwbGFjZWhvbGRlcj1cXFwiXCIse1widFwiOjIsXCJyXCI6XCJwbGFjZWhvbGRlclwifSxcIlxcXCJcIl0sXCJuXCI6NTEsXCJyXCI6XCJsYXJnZVwifSx7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZFwiXSxcIm5cIjo1MCxcInJcIjpcImRpc2FibGVkXCJ9LHtcInRcIjo0LFwiZlwiOltcImRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0YXRlLmRpc2FibGVkXCIsXCJzdGF0ZS5zdWJtaXR0aW5nXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRMaXN0IGNsZWFyRml4IGZMZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJjYXJkVHlwZSBcIix7XCJ0XCI6MixcInJcIjpcImNjdHlwZVwifV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImNjdHlwZVwifV19XX1dLFwiblwiOjUwLFwiclwiOlwiY2N0eXBlXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRMaXN0IGNsZWFyRml4IGZMZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhcmRUeXBlIHZpc2FcIn0sXCJmXCI6W1wiVmlzYVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSBtYXN0ZXJcIn0sXCJmXCI6W1wiTWFzdGVyY2FyZFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJkVHlwZSBhbWV4XCJ9LFwiZlwiOltcIkFtZXJpY2FuIEV4cHJlc3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2FyZFR5cGUgZGluZXJzXCJ9LFwiZlwiOltcIkRpbmVyc1wiXX1dfV0sXCJyXCI6XCJjY3R5cGVcIn1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NjLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA5M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgOFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJ2pxdWVyeS5wYXltZW50Jyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuLi9pbnB1dCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgIHR5cGU6ICd0ZWwnXHJcbiAgICAgICAgICAgLy8gdHlwZTogJ3Bhc3N3b3JkJ1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLnBheW1lbnQoJ2Zvcm1hdENhcmRDVkMnKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgb250ZWFkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkucGF5bWVudCgnZGVzdHJveScpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL2NjL2N2di5qc1xuICoqIG1vZHVsZSBpZCA9IDk0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIFBheW1lbnQgPSByZXF1aXJlKCdjb21wb25lbnRzL3BheW1lbnQnKVxyXG4gICAgO1xyXG5cclxucmVxdWlyZSgnd2ViL21vZHVsZXMvcGF5bWVudC5sZXNzJyk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHBheW1lbnQgPSBuZXcgUGF5bWVudCgpO1xyXG4gICAgcGF5bWVudC5zZXQoJ3BheW1lbnQnLCAkKCdbZGF0YS1wYXltZW50XScpLmRhdGEoJ3BheW1lbnQnKSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCQoJ1tkYXRhLXBheW1lbnRdJykuZGF0YSgncGF5bWVudCcpKTtcclxuICAgIC8vY29uc29sZS5sb2cocGF5bWVudC5nZXQoJ3BheW1lbnQnKSk7XHJcbiAgICBwYXltZW50LnJlbmRlcignI2FwcCcpO1xyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9wYXltZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMjg5XG4gKiogbW9kdWxlIGNodW5rcyA9IDhcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L21ldGEnKSxcclxuICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL3BheW1lbnQvaW5kZXguaHRtbCcpLFxyXG5cclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICAnbGF5b3V0JzogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvbGF5b3V0JyksXHJcbiAgICAgICAgJ3BheW1lbnQtZm9ybSc6IHJlcXVpcmUoJy4vZm9ybScpXHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnRpYWxzOiB7XHJcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBNZXRhLmluc3RhbmNlKClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKG1ldGEpIHsgcmV0dXJuIHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7IH0uYmluZCh0aGlzKSlcclxuICAgIH0sXHJcblxyXG4gICAgc2lnbmluOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgQXV0aC5sb2dpbigpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxlZnRNZW51OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnRvZ2dsZSgnbGVmdG1lbnUnKTtcclxuICAgICAgICAvL3ZhciBmbGFnPXRoaXMudG9nZ2xlKCdsZWZ0bWVudScpOyB0aGlzLnNldCgnbGVmdG1lbnUnLCAhZmxhZyk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL3BheW1lbnQvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAyOTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicGF5bWVudC1mb3JtXCIsXCJhXCI6e1wicGF5bWVudFwiOlt7XCJ0XCI6MixcInJcIjpcInBheW1lbnRcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvcGF5bWVudC9pbmRleC5odG1sXG4gKiogbW9kdWxlIGlkID0gMjkxXG4gKiogbW9kdWxlIGNodW5rcyA9IDhcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbiAgICA7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG5cclxuICAgIGhfbW9uZXkgPSByZXF1aXJlKCdoZWxwZXJzL21vbmV5JyksXHJcbiAgICBoX2R1cmF0aW9uID0gcmVxdWlyZSgnaGVscGVycy9kdXJhdGlvbicpKCksXHJcbiAgICBoX2RhdGUgPSByZXF1aXJlKCdoZWxwZXJzL2RhdGUnKSgpXHJcbiAgICA7XHJcblxyXG52YXIgZG9QYXkgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIGZvcm07XHJcbiAgICBmb3JtID0gJCgnPGZvcm0gLz4nLCB7XHJcbiAgICAgICAgaWQ6ICd0bXBGb3JtJyxcclxuICAgICAgICBhY3Rpb246IGRhdGEudXJsLFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIHN0eWxlOiAnZGlzcGxheTogbm9uZTsnXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgaW5wdXQgPSBkYXRhLmRhdGE7XHJcbiAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAndW5kZWZpbmVkJyAmJiBpbnB1dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICQuZWFjaChpbnB1dCwgZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgJCgnPGlucHV0IC8+Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbyhmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm0uYXBwZW5kVG8oJ2JvZHknKS5zdWJtaXQoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL3BheW1lbnQvZm9ybS5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1jYyc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9jYy9udW1iZXInKSxcclxuICAgICAgICAndWktY3Z2JzogcmVxdWlyZSgnY29yZS9mb3JtL2NjL2N2dicpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFjdGl2ZTogMSxcclxuICAgICAgICAgICAgY2M6IHtcclxuICAgICAgICAgICAgICAgIHN0b3JlOiAxXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBtb25leTogaF9tb25leSxcclxuICAgICAgICAgICAgZHVyYXRpb246IGhfZHVyYXRpb24sXHJcbiAgICAgICAgICAgIGRhdGU6IGhfZGF0ZSxcclxuICAgICAgICAgICAgYmFua3M6IFtcclxuICAgICAgICAgICAgICAgIHtpZDogJ0FYSUInICwgdGV4dDogJ0FYSVMgQmFuayBOZXRCYW5raW5nJyB9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQk9JQicgLCB0ZXh0OiAnQmFuayBvZiBJbmRpYScgfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0JPTUInLCB0ZXh0OiAnQmFuayBvZiBNYWhhcmFzaHRyYSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQ0JJQicsIHRleHQ6ICdDZW50cmFsIEJhbmsgT2YgSW5kaWEnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0NSUEInLCB0ZXh0OiAnQ29ycG9yYXRpb24gQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnRENCQicsIHRleHQ6ICdEZXZlbG9wbWVudCBDcmVkaXQgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnRkVEQicsIHRleHQ6ICdGZWRlcmFsIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0hERkInLCB0ZXh0OiAnSERGQyBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdJQ0lCJywgdGV4dDogJ0lDSUNJIE5ldGJhbmtpbmcnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0lEQkInLCB0ZXh0OiAnSW5kdXN0cmlhbCBEZXZlbG9wbWVudCBCYW5rIG9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdJTkRCJywgdGV4dDogJ0luZGlhbiBCYW5rICd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnSU5JQicsIHRleHQ6ICdJbmR1c0luZCBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdJTk9CJywgdGV4dDogJ0luZGlhbiBPdmVyc2VhcyBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdKQUtCJywgdGV4dDogJ0phbW11IGFuZCBLYXNobWlyIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0tSS0InLCB0ZXh0OiAnS2FybmF0YWthIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0tSVkInLCB0ZXh0OiAnS2FydXIgVnlzeWEgJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdTQkJKQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEJpa2FuZXIgYW5kIEphaXB1cid9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JIQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEh5ZGVyYWJhZCd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JJQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdTQk1CJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgTXlzb3JlJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdTQlRCJywgdGV4dDogJ1N0YXRlIEJhbmsgb2YgVHJhdmFuY29yZSd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU09JQicsIHRleHQ6ICdTb3V0aCBJbmRpYW4gQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnVUJJQicsIHRleHQ6ICdVbmlvbiBCYW5rIG9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdVTklCJywgdGV4dDogJ1VuaXRlZCBCYW5rIE9mIEluZGlhJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdWSllCJywgdGV4dDogJ1ZpamF5YSBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdZRVNCJywgdGV4dDogJ1llcyBCYW5rJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdDVUJCJywgdGV4dDogJ0NpdHlVbmlvbid9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnQ0FCQicsIHRleHQ6ICdDYW5hcmEgQmFuayd9LFxyXG4gICAgICAgICAgICAgICAge2lkOiAnU0JQQicsIHRleHQ6ICdTdGF0ZSBCYW5rIG9mIFBhdGlhbGEnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJ0NJVE5CJywgdGV4dDogJ0NpdGkgQmFuayBOZXRCYW5raW5nJ30sXHJcbiAgICAgICAgICAgICAgICB7aWQ6ICdEU0hCJywgdGV4dDogJ0RldXRzY2hlIEJhbmsnfSxcclxuICAgICAgICAgICAgICAgIHtpZDogJzE2MkInLCB0ZXh0OiAnS290YWsgQmFuayd9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGZvcm1hdFllYXI6IGZ1bmN0aW9uICh5ZWFyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhci5zbGljZSgtMik7O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9jYXJkcycsXHJcbiAgICAgICAgICAgIGRhdGE6IHt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2FyZHMnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldENhcmQoZGF0YVtkYXRhLmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm9ic2VydmUoJ2FjdGl2ZScsIGZ1bmN0aW9uKCkgeyB0aGlzLnNldCgnZm9ybS5lcnJvcnMnLCBmYWxzZSk7IH0sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcclxuICAgICAgICAgICAgZGF0YSA9IHtpZDogdGhpcy5nZXQoJ3BheW1lbnQuaWQnKX1cclxuXHJcbiAgICAgICAgdmlldy5zZXQoJ2Zvcm0uc3VibWl0dGluZycsIHRydWUpO1xyXG4gICAgICAgIHZpZXcuc2V0KCdmb3JtLmVycm9ycycsIHt9KTtcclxuXHJcblxyXG4gICAgICAgIGlmICgzID09IHRoaXMuZ2V0KCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBkYXRhLm5ldGJhbmtpbmcgPSB0aGlzLmdldCgnbmV0YmFua2luZycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRhdGEuY2MgPSB0aGlzLmdldCgnY2MnKTtcclxuICAgICAgICAgICAgZGF0YS5jYy5zdG9yZSA9IGRhdGEuY2Muc3RvcmUgPyAxIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYm9va2luZy9wYXltZW50JyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS51cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb1BheShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdmb3JtLnN1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZm9ybS5lcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZm9ybS5lcnJvcnMnLCBbcmVzcG9uc2UubWVzc2FnZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Zvcm0uZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRDYXJkOiBmdW5jdGlvbihjYykge1xyXG4gICAgICAgIGlmICh0aGlzLmdldCgnY2MuaWQnKSAhPT0gY2MuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ2NjJywgY2MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdjYycsIHt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICByZXNldENDOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHZhciBlID0gZXZlbnQub3JpZ2luYWwsXHJcbiAgICAgICAgICAgIGVsID0gJChlLnNyY0VsZW1lbnQpLFxyXG4gICAgICAgICAgICBpZCA9IHRoaXMuZ2V0KCdjYy5pZCcpLFxyXG4gICAgICAgICAgICB5dXAgPSAwID09IGVsLnBhcmVudHMoJy51aS5pbnB1dC5jdnYnKS5zaXplKCkgJiYgKCgnSU5QVVQnID09IGVsWzBdLnRhZ05hbWUpIHx8IGVsLmhhc0NsYXNzKCdkcm9wZG93bicpIHx8IGVsLnBhcmVudHMoJy51aS5kcm9wZG93bicpLnNpemUoKSk7XHJcblxyXG4gICAgICAgIGlmIChpZCAmJiB5dXApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ2NjJywge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9wYXltZW50L2Zvcm0uanNcbiAqKiBtb2R1bGUgaWQgPSAyOTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wiLFwiY2xhc3NcIjpbXCJ1aSBmb3JtIHNlZ21lbnQgcGF5bWVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcImZvcm0uZXJyb3JzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJmb3JtLnN1Ym1pdHRpbmdcIn1dfSxcInZcIjp7XCJzdWJtaXRcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBzZWdtZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBibG9jayBoZWFkZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGF5bWVudC5jbGllbnRcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic3ViIGhlYWRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwYXltZW50LnJlYXNvblwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwb2ludGluZyBzZWNvbmRhcnkgbWVudVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19XSxcImRhdGEtdGFiXCI6XCJkdW1teVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiYWN0aXZlXFxcIiwxXVwifX19LFwiZlwiOltcIkNSRURJVCBDQVJEXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOltcIml0ZW0gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIyPT1fMFwifX1dLFwiZGF0YS10YWJcIjpcImR1bW15XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJhY3RpdmVcXFwiLDJdXCJ9fX0sXCJmXCI6W1wiREVCSVQgQ0FSRFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMz09XzBcIn19XSxcImRhdGEtdGFiXCI6XCJkdW1teVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwiYWN0aXZlXFxcIiwzXVwifX19LFwiZlwiOltcIk5FVCBCQU5LSU5HXCJdfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjcmVkaXQtY2FyZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdHdvIGNvbHVtbiBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZXNldENDXCIsXCJhXCI6e1wiclwiOltcImV2ZW50XCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJudW1iZXIgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJDcmVkaXRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFjdGl2ZVwiXSxcInNcIjpcIjE9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJEZWJpdFwiXSxcInhcIjp7XCJyXCI6W1wiYWN0aXZlXCJdLFwic1wiOlwiMT09XzBcIn19LFwiIENhcmQgTnVtYmVyIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY2NcIixcImFcIjp7XCJkaXNhYmxlZFwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmlkXCJ9XSxcImNsYXNzXCI6XCJjYXJkLW51bWJlciBmbHVpZFwiLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MudHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLm51bWJlclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLm51bWJlclwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aHJlZSBleHBpcnkgZmllbGRzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiRXhwaXJ5IE1vbnRoIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwibW9udGhcIixcInBsYWNlaG9sZGVyXCI6XCJNb250aFwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInJcIjpcImRhdGUuc2VsZWN0LmNhcmRNb250aHNcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5leHBfbW9udGhcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJmb3JtLmVycm9ycy5leHBfbW9udGhcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkV4cGlyeSBZZWFyIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwieWVhclwiLFwicGxhY2Vob2xkZXJcIjpcIlllYXJcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJkYXRlLnNlbGVjdC5jYXJkWWVhcnNcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5leHBfeWVhclwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLmV4cF95ZWFyXCJ9XX0sXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2V0LWNjXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCIsXCJzdHlsZVwiOlwicG9zaXRpb246IHJlbGF0aXZlO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGFiZWxcIn0sXCJmXCI6W1wiQ1ZWIE5vIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktY3Z2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZsdWlkIGN2dlwiLFwiY2N0eXBlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MudHlwZVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcImNjLmN2dlwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLmN2dlwifV19LFwidlwiOntcImNsaWNrXCI6XCJyZXNldC1jY1wifX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjdnYtaW1hZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIjQgZGlnaXQgQ1ZWIE51bWJlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2NC1pbWdcIn0sXCJmXCI6W1wiwqBcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiY2MudHlwZVwiXSxcInNcIjpcIlxcXCJhbWV4XFxcIj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIjMgZGlnaXQgQ1ZWIE51bWJlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3Z2My1pbWdcIn0sXCJmXCI6W1wiwqBcIl19XSxcInhcIjp7XCJyXCI6W1wiY2MudHlwZVwiXSxcInNcIjpcIlxcXCJhbWV4XFxcIj09XzBcIn19XX1dLFwiblwiOjUwLFwiclwiOlwiY2MudHlwZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJudW1iZXIgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIkNhcmQgSG9sZGVyJ3MgTmFtZSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wiZGlzYWJsZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5pZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiY2MubmFtZVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLm5hbWVcIn1dfSxcInZcIjp7XCJjbGlja1wiOlwicmVzZXQtY2NcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic3RvcmUgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImRpc2FibGVkXCI6W3tcInRcIjoyLFwiclwiOlwiY2MuaWRcIn1dLFwidHlwZVwiOlwiY2hlY2tib3hcIixcImNoZWNrZWRcIjpbe1widFwiOjIsXCJyXCI6XCJjYy5zdG9yZVwifV19fSxcIiBTdG9yZSBjYXJkIGZvciBmdXR1cmUgdXNlLlwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxhYmVsXCJ9LFwiZlwiOltcIlNhdmVkIGNhcmRzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBsaXN0XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0Q2FyZFwiLFwiYVwiOntcInJcIjpbXCIuXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm51bWJlclwiLFwic1wiOnRydWV9XX1dfV0sXCJuXCI6NTIsXCJyXCI6XCJjYXJkc1wifV19XX1dLFwiblwiOjUwLFwiclwiOlwiY2FyZHNcIn1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMHx8Mj09XzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJuZXRiYW5raW5nXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJCYW5rIGZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsYWJlbFwifSxcImZcIjpbXCJTZWxlY3QgWW91ciBCYW5rIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhbmsgZmx1aWRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibmV0YmFua2luZy5uZXRfYmFua2luZ1wifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImZvcm0uZXJyb3JzLm5ldF9iYW5raW5nXCJ9XSxcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJyXCI6XCJiYW5rc1wifV19fV19XX1dLFwieFwiOntcInJcIjpbXCJhY3RpdmVcIl0sXCJzXCI6XCIxPT1fMHx8Mj09XzBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImZvcm0uZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZm9ybS5lcnJvcnNcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibm90ZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiUGxlYXNlIE5vdGUgOlwiXX0sXCIgVGhlIGNoYXJnZSB3aWxsIGFwcGVhciBvbiB5b3VyIGNyZWRpdCBjYXJkIC8gQWNjb3VudCBzdGF0ZW1lbnQgYXMgJ0FpcnRpY2tldHMgSW5kaWEgUHZ0IEx0ZCdcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFncmVlbWVudCBmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiY2hlY2tib3hcIixcImNoZWNrZWRcIjpbe1widFwiOjIsXCJyXCI6XCJhY2NlcHRlZFwifV19fSxcIiBJIGhhdmUgcmVhZCBhbmQgYWNjZXB0ZWQgdGhlIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvY21zL3Rlcm1zQW5kQ29uZGl0aW9ucy8yXCIsXCJ0YXJnZXRcIjpcIl9ibGFua1wifSxcImZcIjpbXCJUZXJtcyBPZiBTZXJ2aWNlXCJdfSxcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicHJpY2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOltcIkNvbnZlbmllbmNlIGZlZSBcIix7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheW1lbnQuY29udmluY2VfZmVlXCIsXCJtZXRhLmRpc3BsYXlfY3VycmVuY3lcIl0sXCJzXCI6XCJfMChfMSxfMilcIn19LFwiIHdpbGwgYmUgY2hhcmdlZFwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwYXltZW50LmNvbnZpbmNlX2ZlZVwiXSxcInNcIjpcIl8wPjBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYW1vdW50XCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInBheW1lbnQuYW1vdW50XCIsXCJwYXltZW50LmNvbnZpbmNlX2ZlZVwiLFwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJdLFwic1wiOlwiXzAocGFyc2VJbnQoXzEpK3BhcnNlSW50KF8yKSxfMylcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiKFRvdGFsIFBheWFibGUgQW1vdW50KVwiXX1dLFwiblwiOjUwLFwiclwiOlwibWV0YS5kaXNwbGF5X2N1cnJlbmN5XCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidmVyaWZpZWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvdmVyaWZpZWQvdmJ2XzI1MC5naWZcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvdmVyaWZpZWQvbWFzdGVyY2FyZF9zZWN1cmVjb2RlLmdpZlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy92ZXJpZmllZC9BTUVYX1NhZmVLZXlfMTgweDk5cHgucG5nXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL3ZlcmlmaWVkL3BjaS1kc3MtY29tcGxpYW50LmpwZ1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy92ZXJpZmllZC9TU0wtc2VjdXJpdHktc2VhbC5wbmdcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIHdpemFyZCBidXR0b24gbWFzc2l2ZSBvcmFuZ2VcIn0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJcIl0sXCJuXCI6NTEsXCJyXCI6XCJhY2NlcHRlZFwifV0sXCJmXCI6W1wiQk9PSyBGTElHSFRcIl19XX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvcGF5bWVudC9mb3JtLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyOTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gOFxuICoqLyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2xlc3Mvd2ViL21vZHVsZXMvcGF5bWVudC5sZXNzXG4gKiogbW9kdWxlIGlkID0gMjk0XG4gKiogbW9kdWxlIGNodW5rcyA9IDhcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9