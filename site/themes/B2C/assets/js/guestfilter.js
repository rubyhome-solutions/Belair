webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(350);


/***/ },

/***/ 56:
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

/***/ 57:
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

/***/ 61:
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

/***/ 62:
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

/***/ 63:
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 64:
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

/***/ 65:
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

/***/ 313:
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

/***/ 314:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","f":[{"t":7,"e":"table","a":{"style":"width: 100%"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"padding-right: 10px;"},"f":[{"t":7,"e":"div","a":{"class":"ui relaxed segment"},"f":[{"t":7,"e":"search-form","a":{"class":"basic segment","search":[{"t":2,"r":"search"}]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"class":"recent_searches"},"f":[{"t":7,"e":"div","a":{"class":"ui header","style":"  font-size: 16px; font-weight: normal; color: #202629; margin-bottom: 10px;"},"f":["Recent Searches"]}," ",{"t":7,"e":"div","a":{"class":"ui segment recent-searches"},"f":[{"t":7,"e":"div","a":{"class":"box"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"date"},"f":[{"t":2,"x":{"r":["moment","./search.flights.0.depart_at"],"s":"_0(_1).format(\"MMM\")"}},{"t":7,"e":"span","f":[{"t":2,"x":{"r":["moment","./search.flights.0.depart_at"],"s":"_0(_1).format(\"DD\")"}}]}]}," ",{"t":7,"e":"div","a":{"class":"direction","style":"cursor: pointer;"},"v":{"click":{"m":"swapSearch","a":{"r":["search"],"s":"[_0]"}}},"f":[{"t":2,"r":"from.city"}," ",{"t":7,"e":"span","a":{"class":[{"t":4,"f":["back"],"n":50,"x":{"r":["./search.tripType"],"s":"2==_0"}},{"t":4,"n":51,"f":["to"],"x":{"r":["./search.tripType"],"s":"2==_0"}}]},"f":[" "]}," ",{"t":2,"r":"to.city"}," ",{"t":4,"f":["(multicity)"],"n":50,"x":{"r":["./search.tripType"],"s":"3==_0"}}]}," ",{"t":7,"e":"div","a":{"class":"info"},"f":[{"t":4,"f":[{"t":2,"r":"./search.passengers.0"}," Adult"],"n":50,"x":{"r":["./search.passengers.0"],"s":"_0>0"}},{"t":4,"f":[", ",{"t":2,"r":"./search.passengers.1"}," Child"],"n":50,"x":{"r":["./search.passengers.1"],"s":"_0>0"}},{"t":4,"f":[", ",{"t":2,"r":"./search.passengers.2"}," Infant"],"n":50,"x":{"r":["./search.passengers.2"],"s":"_0>0"}}]}]}],"n":52,"r":"recent"}]}]}]}],"n":50,"r":"recent"}]}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 316:
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

/***/ 317:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui modify-search small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Modify Search"]}," ",{"t":7,"e":"div","a":{"class":"content","style":"padding: 0px;"},"f":[{"t":4,"f":[{"t":8,"r":"form"}],"n":50,"r":"open"}]}]}],"n":50,"r":"modify"},{"t":4,"n":51,"f":[{"t":8,"r":"form"}],"r":"modify"}," "],"p":{"form":[{"t":7,"e":"form","a":{"id":"flights-search","class":["ui form ",{"t":2,"r":"class"}," ",{"t":4,"f":["loading"],"n":50,"r":"search.pending"}," ",{"t":4,"f":["error"],"n":50,"r":"errors"}],"action":"javascript:;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"h1","f":["Search, Book & Fly!"]}," ",{"t":7,"e":"p","f":["Lowest Prices and 100% secure!"]}," ",{"t":7,"e":"div","a":{"class":"ui top attached tabular menu"},"f":[{"t":7,"e":"a","a":{"class":[{"t":4,"f":["active"],"n":50,"r":"search.domestic"}," item uppercase"],"data-tab":"domestic"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.domestic\",1]"}}},"f":["Domestic"]}," ",{"t":7,"e":"a","a":{"class":[{"t":4,"f":["active"],"n":50,"x":{"r":["search.domestic"],"s":"!_0"}}," item uppercase"],"data-tab":"international"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.domestic\",0]"}}},"f":["International"]}]}," ",{"t":7,"e":"div","a":{"class":"ui bottom attached active tab segment basic"},"f":[{"t":8,"r":"checkboxes"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"multicity"},"t1":"fade","f":[{"t":8,"r":"multicity"}," ",{"t":7,"e":"div","a":{"class":"add-flight"},"f":[{"t":7,"e":"button","a":{"type":"button","class":"ui basic button circular"},"v":{"click":{"m":"addFlight","a":{"r":[],"s":"[]"}}},"f":["+ Add new"]}]}]}," ",{"t":7,"e":"br"}],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"simple"},"t1":"fade","f":[{"t":8,"r":"itinerary"}," ",{"t":8,"r":"dates"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"r":"errors.flight.0"}]}],"n":50,"r":"errors.flight.0"}]}],"x":{"r":["search.tripType"],"s":"3==_0"}}," ",{"t":8,"r":"passengers"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[],"n":50,"x":{"r":["i"],"s":"\"flight\"==_0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"x":{"r":["i"],"s":"\"flight\"==_0"}}],"n":52,"i":"i","r":"errors"}]}],"n":50,"r":"errors"}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui button massive fluid uppercase"},"f":["Search Flights"]}]}]}],"dates":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.depart_at"}],"class":"fluid depart-0 pointing top left","large":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"max":[{"t":2,"x":{"r":["search.tripType","search.flights.0.return_at"],"s":"2==_0&&_1"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}],"error":[{"t":2,"r":"errors.flight.0.depart_at"}],"next":"return-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"v":{"click":{"m":"toggleRoundtrip","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"search.flights.0.return_at"}],"class":["fluid return-0 pointing top right ",{"t":4,"f":["disabled"],"n":51,"x":{"r":["search.tripType"],"s":"2==_0"}}],"large":"1","placeholder":"RETURN ON","min":[{"t":2,"x":{"r":["search.flights.0.depart_at","moment"],"s":"_0||_1()"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"range":[{"t":2,"x":{"r":["search.flights.0.depart_at","search.flights.0.return_at"],"s":"[_0,_1]"}}],"error":[{"t":2,"r":"errors.flight.0.return_at"}]},"f":[]}]}]}],"passengers":[{"t":7,"e":"div","a":{"class":"four fields passengers"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.0"}],"class":"fluid","large":"1","placeholder":"Adults","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.1"}],"class":"fluid","large":"1","placeholder":"Children","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["2-12 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-spinner","a":{"value":[{"t":2,"r":"search.passengers.2"}],"class":"fluid","large":"1","placeholder":"Infants","min":"0","max":"9","error":[{"t":2,"r":"errors.passengers"}]},"f":[]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["Below 2 years"]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"search.cabinType"}],"class":"fluid","large":"1","placeholder":"Class","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.cabinTypes()"}}],"error":[{"t":2,"r":"errors.cabinType"}]},"f":[]}]}]}],"itinerary":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid from-0","placeholder":"FROM","search":"1","large":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.from"}],"next":"to-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid to-0","placeholder":"TO","search":"1","large":"1","domestic":"1","error":[{"t":2,"r":"errors.flight.0.to"}],"next":"depart-0"},"v":{"next":"next"},"f":[]}]}]}],"n":50,"r":"search.domestic"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"two fields from-to"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.from"}],"class":"fluid from-0","placeholder":"FROM","search":"1","large":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.from"}],"next":"to-0"},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"ui-airport","a":{"meta":[{"t":2,"r":"meta"}],"value":[{"t":2,"r":"search.flights.0.to"}],"class":"fluid to-0","placeholder":"TO","search":"1","large":"1","domestic":"0","error":[{"t":2,"r":"errors.flight.0.to"}],"next":"depart-0"},"v":{"next":"next"},"f":[]}]}]}],"r":"search.domestic"}],"multicity":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"three fields"},"f":[{"t":7,"e":"div","a":{"class":"field airport_field_width"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"./from"}],"class":["fluid from-",{"t":2,"r":"i","s":true}],"search":"1","large":"1","placeholder":"FROM","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.domestic()"},"s":true}],"error":[{"t":2,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"},"from"]}}],"next":["to-",{"t":2,"r":"i","s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field airport_field_width"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"./to"}],"class":["fluid to-",{"t":2,"r":"i","s":true}],"search":"1","large":"1","placeholder":"TO","options":[{"t":2,"x":{"r":["meta.select"],"s":"_0.domestic()"},"s":true}],"error":[{"t":2,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"},"to"]}}],"next":["depart-",{"t":2,"r":"i","s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"field airport_field_width"},"f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"rx":{"r":"search.flights","m":[{"t":30,"n":"i"},"depart_at"]}}],"class":["fluid depart-",{"t":2,"r":"i"}," pointing top right"],"large":"1","placeholder":"DEPART ON","min":[{"t":2,"x":{"r":["moment"],"s":"_0()"}}],"calendar":[{"t":2,"x":{"r":[],"s":"{twomonth:true}"}}],"twomonth":[{"t":2,"x":{"r":[],"s":"true"}}],"error":[{"t":2,"rx":{"r":"errors.flights","m":[{"t":30,"n":"i"},"depart_at"]}}],"next":["depart-",{"t":2,"x":{"r":["i"],"s":"_0+1"},"s":true}]},"v":{"next":"next"},"f":[]}]}," ",{"t":7,"e":"div","a":{"class":"remove_icon"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"delete"},"v":{"click":{"m":"removeFlight","a":{"r":["i"],"s":"[_0]"}}},"f":[" "]}],"n":50,"x":{"r":["i"],"s":"_0>1"}}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}}]}],"n":50,"rx":{"r":"errors.flight","m":[{"t":30,"n":"i"}]}}],"n":52,"i":"i","r":"search.flights"}],"checkboxes":[{"t":7,"e":"div","a":{"class":"three fields travel-type"},"f":[{"t":7,"e":"div","a":{"class":"field width_ways"},"f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"1==_0"}}," width_ways_deco"]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",1]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"1==_0"}}]}}," ",{"t":7,"e":"label","f":["ONE WAY"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"field width_ways"},"f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"2==_0"}}," width_ways_deco"]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",2]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"2==_0"}}]}}," ",{"t":7,"e":"label","f":["ROUND TRIP"]}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field width_ways"},"t1":"fade","f":[{"t":7,"e":"div","a":{"class":["deco ",{"t":4,"f":["active"],"n":50,"x":{"r":["search.tripType"],"s":"3==_0"}}," width_ways_deco"]},"f":[{"t":7,"e":"div","a":{"class":"ui radio checkbox"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"search.tripType\",3]"}}},"f":[{"t":7,"e":"input","a":{"type":"radio","checked":[{"t":2,"x":{"r":["search.tripType"],"s":"3==_0"}}]}}," ",{"t":7,"e":"label","f":["MULTI CITY"]}]}]}]}],"n":50,"r":"search.domestic"}]}]}};

/***/ },

/***/ 318:
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

/***/ 319:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui selection input spinner dropdown in ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":7,"e":"input","a":{"type":"hidden","value":[{"t":2,"r":"value"}]}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"div","a":{"class":"text"},"f":[{"t":2,"r":"value"}]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button inc"},"v":{"click":{"m":"inc","a":{"r":[],"s":"[]"}}},"f":["+"]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button dec"},"v":{"click":{"m":"dec","a":{"r":[],"s":"[]"}}},"f":["-"]}]}]};

/***/ },

/***/ 347:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  GuestFilter = __webpack_require__(351);
	var SearchForm = __webpack_require__(353);
	// var SearchForm = require('pages/flights/search');
	     
	__webpack_require__(359);
	__webpack_require__(347);
	
	//$(function() {
	//    console.log('Inside Main mybookings');
	//    var mybookings = new Mybookings();
	//    var user = new User();    
	//
	//    mybookings.render('#content');
	//    user.render('#panel');
	//});
	
	
	$(function() {
	    (new GuestFilter()).render('#app');
	    // (new SearchForm()).render('#app');
	});

/***/ },

/***/ 351:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        Auth = __webpack_require__(80),
	        MybookingData = __webpack_require__(64),
	        Meta = __webpack_require__(59);
	        // SearchForm = require('components/flights/search/form');
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(352),
	    components: {
	        'layout': __webpack_require__(72),
	        auth: __webpack_require__(80),
	        'custom-form': __webpack_require__(353),
	        guestbooking: __webpack_require__(355),
	        details: __webpack_require__(357),
	    },
	    partials: {
	        'base-panel': __webpack_require__(105)
	    },
	    data: function () {
	       
	        return {
	            mybookings:{loggedin:false},
	            
	        };
	    },
	    onconfig: function () {
	     Meta.instance()
	                .then(function(meta) { this.set('meta', meta);}.bind(this));
	        // this.set('user', User);
	        window.view = this;
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
	    signin: function () {
	        var view = this;
	
	        Auth.login()
	                .then(function (data) {
	                 //   console.log(data);
	            if (data && data.id) {
	                window.location.href = '/b2c/airCart/mybookings';
	            }
	                 });
	    },
	      signup: function() {
	        Auth.signup();
	    },
	    back: function() {
	    	document.location.href="/";
	    }
	});

/***/ },

/***/ 352:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"id":"guestbooking","class":"content"},"f":[{"t":7,"e":"div","a":{"class":"step header step1 active"},"f":["Get Booking"]}," ",{"t":7,"e":"div","a":{"class":"ui segment"},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[" ",{"t":7,"e":"auth","a":{"meta":[{"t":2,"r":"meta"}]}}]}," ",{"t":7,"e":"div","a":{"class":"ui vertical divider"},"f":["Or"]}," ",{"t":7,"e":"div","a":{"class":"center aligned column"},"f":[{"t":7,"e":"custom-form","a":{"class":"basic segment"}}," "]}]}]}]}],"n":50,"x":{"r":["mybookings.loggedin"],"s":"!_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"details","a":{"mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["mybookings.loggedin"],"s":"!_0"}}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 353:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    moment = __webpack_require__(44)
	    ;
	
	var Page = __webpack_require__(313),
	    Search = __webpack_require__(56),
	    Meta = __webpack_require__(354)
	    ;
	
	module.exports = Page.extend({
	    template: __webpack_require__(314),
	
	    components: {
	        'search-form': __webpack_require__(400)
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

/***/ 354:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(33)
	    ;
	
	var View = __webpack_require__(55)
	    ;
	
	var Meta = View.extend({
	    data: function() {
	        var view = this;
	
	        var countries;
	
	        return {
	            select: {
	                titles: function() { return _.map(view.get('titles'), function(i) { return { id: i.id, text: i.name }; }); },
	                cabinTypes: function() { return _.map(view.get('cabinTypes'), function(i) { return { id: i.id, text: i.name }; }); },
	                domestic: function() {
	                    return _.map(view.get('domestic'), function(i) { return { id: i.id, text: i.city_name + ' (' + i.airport_code + ')' }; });
	                },
	                countries: function() {
	                    if (!countries) {
	                        countries =  _.map(view.get('countries'), function(i) { return { id: i.id, text: i.name }; });
	                    }
	
	                    return countries;
	                }
	            },
	
	            airport: function(id) {
	                return _.find(view.get('domestic'), { id: _.parseInt(id) });
	            }
	        }
	    }
	
	});
	
	Meta.parse = function(data) {
	    var meta = new Meta();
	    meta.set(data);
	    
	    meta.set('display_currency', 'INR');
	
	    return meta;
	};
	
	Meta.fetch = function() {
	    return Q.Promise(function(resolve, reject) {
	        $.getJSON('/b2c/flights/meta')
	            .then(function(data) { resolve(Meta.parse(data)); })
	            .fail(function(data) {
	                //TODO: handle error
	            });
	    });
	};
	
	
	
	Meta.object = null;
	Meta.instance = function() {
	    return Q.Promise(function(resolve, reject) {
	        if (Meta.object) {
	            resolve(Meta.object);
	            return;
	        }
	
	        Meta.fetch().then(function(meta) {
	            Meta.object = meta;
	            resolve(meta);
	        });
	    });
	};
	
	Meta.parseQuery = function(qstr) {
	    var query = {};
	    var a = qstr.split('&');
	    for (var i = 0; i < a.length; i++) {
	        var b = a[i].split('=');
	        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
	    }
	    return query;
	}
	
	module.exports = Meta;

/***/ },

/***/ 355:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(33),
	        Q = __webpack_require__(26)
	        ;
	var Form = __webpack_require__(34)
	        ;
	var GuestBooking = Form.extend({
	    template: __webpack_require__(356),
	    data: function () {
	        return {
	            action: 'guestbooking',
	            submitting: false,
	            mobile: '',
	            pnr: '',
	            lastname: '',
	            pnr2: ''
	        }
	    },
	    oncomplete: function () {
	
	    },
	    getticketbypnr: function () {
	        var view = this;
	        this.set('errorMsg', null);
	        this.set('error', null);
	        this.set('submitting', true);
	        this.set('mybookings.pending', true);
	        $.ajax({
	            type: 'POST',
	            context: this,
	            url: '/b2c/airCart/getguestbooking/',
	            data: {mobile: this.get('mobile'), pnr: this.get('pnr')},
	            dataType: 'json',
	            complete: function () {
	                view.set('submitting', false);
	            },
	            success: function (data) {
	                console.log(data.error);
	                if (typeof data.error == 'undefined') {
	                    var details = {
	                        id: data.id, upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity,curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
	                        bookings: _.map(data.bookings, function (i) {
	                            return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
	                                traveller: _.map(i.traveller, function (t) {
	                                    return {
	                                        id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
	                                        airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,
	                                        basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status, statusmsg: t.statusmsg, selected: false,
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
	
	                    //console.log(details);
	                    //console.log(data);
	                    this.set('mybookings.currentCartDetails', details);
	                    this.set('mybookings.summary', false);
	                    this.set('mybookings.pending', false);
	                    this.set('mybookings.loggedin', true);
	                } else {
	                    view.set('submitting', false);
	                    this.set('errorMsg', data.error);
	                    this.set('error', 'Not Found');
	                }
	            },
	            error: function (xhr) {
	                try {
	                    var response = JSON.parse(xhr.responseText);
	                    if (response.errors) {
	                        view.set('errors', response.errors);
	                    }
	                } catch (e) {
	                    view.set('errorMsg', 'Server returned error. Please try again later');
	                }
	            }
	        });
	    },
	    getticketbylastname: function () {
	        var view = this;
	        this.set('errorMsg2', null);
	        this.set('error2', null);
	        this.set('submitting2', true);
	        this.set('mybookings.pending', true);
	        $.ajax({
	            type: 'POST',
	            context: this,
	            url: '/b2c/airCart/getguestbooking/',
	            data: {lastname: this.get('lastname'), pnr2: this.get('pnr2')},
	            dataType: 'json',
	            complete: function () {
	                view.set('submitting2', false);
	            },
	            success: function (data) {
	
	                console.log(data.error);
	                if (typeof data.error == 'undefined') {
	                    var details = {
	                        id: data.id, upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
	                        bookings: _.map(data.bookings, function (i) {
	                            return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
	                                traveller: _.map(i.traveller, function (t) {
	                                    return {
	                                        id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
	                                        airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,
	                                        basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status, statusmsg: t.statusmsg, selected: false,
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
	
	                    //console.log(details);
	                    //console.log(data);
	                    this.set('mybookings.currentCartDetails', details);
	                    this.set('mybookings.summary', false);
	                    this.set('mybookings.pending', false);
	                    this.set('mybookings.loggedin', true);
	                } else {
	                    view.set('submitting', false);
	                    this.set('errorMsg2', data.error);
	                    this.set('error2', 'Not Found');
	                }
	            },
	            error: function (xhr) {
	                try {
	                    var response = JSON.parse(xhr.responseText);
	                    if (response.errors) {
	                        view.set('errors2', response.errors);
	                    }
	                } catch (e) {
	                    view.set('errorMsg2', 'Server returned error. Please try again later');
	                }
	            }
	        });
	    },
	});
	module.exports = GuestBooking;

/***/ },

/***/ 356:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting"}],"style":"position: relative;"},"v":{"submit":{"m":"getticketbypnr","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable "},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment","style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"mobile","value":[{"t":2,"r":"mobile"}],"class":"fluid ","placeholder":"Mobile / Email"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"pnr","value":[{"t":2,"r":"pnr"}],"class":"fluid","placeholder":"PNR / Booking Id."},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui small blue button "},"f":["SUBMIT"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ui horizontal divider"},"f":["OR"]}," ",{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors2","errorMsg2"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting2"}],"style":"position: relative;"},"v":{"submit":{"m":"getticketbylastname","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable "},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment","style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"lastname","value":[{"t":2,"r":"lastname"}],"class":"fluid ","placeholder":"Last Name"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"pnr2","value":[{"t":2,"r":"pnr2"}],"class":"fluid","placeholder":"PNR / Booking Id."},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg2"}]}],"n":50,"r":"errorMsg2"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors2"}]}],"n":50,"x":{"r":["errors2","errorMsg2"],"s":"_0||_1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui small blue button "},"f":["SUBMIT"]}]}]}]}]}]};

/***/ },

/***/ 357:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        Auth = __webpack_require__(80),
	        moment = __webpack_require__(44),
	        _ = __webpack_require__(30),
	        accounting = __webpack_require__(70)
	        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(358),
	    data: function () {
	
	        return {
	            email: false,
	            submitting: false,
	            formatBirthDate: function (date) {
	                if (moment.isMoment(date)) {
	                    // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
	                    return date.format('YYYY-MM-DD');
	                }
	                else {
	                    return date;
	                }
	            },
	            formatTitle: function (title) {
	                var titles = this.get('meta').get('titles');
	                //console.log(titles);
	                // console.log(title);
	                return  _.result(_.find(titles, {'id': title}), 'name');
	            },
	            formatName: function (name) {
	                var string = name.toLowerCase();
	                return  string.charAt(0).toUpperCase() + string.slice(1);
	            },
	            formatTravelDate: function (date) {
	                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ll');//format('MMM DD YYYY');        
	            },
	            formatTravelDate2: function (date) {
	                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ddd MMM D YYYY');//format('MMM DD YYYY');        
	            },
	            formatTravelDate3: function (date) {
	                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ddd HH:mm');//format('MMM DD YYYY');        
	            },
	            travellerBookingStatus: function (status) {
	                if (status == 2)
	                    return 'confirm';
	                else
	                    return 'notconfirm';
	            },
	            travellerBookingStatusMessage: function (status) {
	                if (status == 2)
	                    return 'confirmed';
	                else {
	                    var st = this.get('meta').get('abbookingStatus');
	                    return  _.result(_.find(st, {'id': status}), 'name');
	                }
	            },
	            diff: function (end, start) {
	
	                var ms = moment(end, "YYYY-MM-DD hh:mm:ss").diff(moment(start, "YYYY-MM-DD hh:mm:ss"));
	                var d = moment.duration(ms);
	                return Math.floor(d.asHours()) + 'h ' + d.minutes() + 'm';
	
	            },
	            formatBookingDate: function (date) {
	                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ll');//format('MMM DD YYYY');        
	            },
	            formatBookingStatusClass: function (bs) {
	                if (bs == 1 || bs == 2 || bs == 3 ||  bs == 7)
	                    return "progress";
	                else if (bs == 4 || bs == 5 || bs == 6 || bs == 12)
	                    return "cancelled";
	                else if (bs == 8 || bs == 9 || bs == 10 || bs == 11)
	                    return "booked";
	
	            },
	            formatBookingStatusMessage: function (bs) {
	                var bks = this.get('meta').get('bookingStatus');
	                return  _.result(_.find(bks, {'id': bs}), 'name');
	            },
	            convert: function (amount) {
	                return accounting.formatMoney(amount, '', 0);
	            },
	            convertIxigo: function (amount) {
	                return accounting.unformat(accounting.formatMoney(amount, '', 0));
	            }
	        }
	
	    },
	    toggleemail: function () {
	        var user = this.get('meta.user');
	            if (typeof user !== 'undefined') {
	        if (this.get('submitting'))
	            return false;
	        var email = this.get('meta.user.email');
	        //this.set('email', email);
	        $('#email').val(email);
	        $(this.find('.ui.modal')).modal('show');
	        return false;
	        } else {
	        $(this.find('.ui.modal')).modal('show');
	        return false;
	               // this.signin();
	        }
	    },
	    oninit: function (options) {
	        this.on('back', function (event) {
	            var currentURL = window.location.href;
	            if (currentURL.indexOf("mybookings/") > -1)
	                window.location.href = '/b2c/airCart/mybookings';
	            else if (currentURL.indexOf("mybookings") > -1)
	                this.get('mybookings').set('summary', true);
	            else if (currentURL.indexOf("guestbooking") > -1)
	                window.location.href = '/b2c/airCart/guestbooking';
	        });
	        this.on('cancel', function (event) {
	            var user = this.get('meta.user');
	            if (typeof user !== 'undefined') {
	                this.get('mybookings').set('amend', true);
	                this.get('mybookings').set('cancel', true);
	                this.get('mybookings').set('reschedule', false);
	            } else {
	                this.signinn();
	            }
	
	        });
	        this.on('reschedule', function (event) {
	            var user = this.get('meta.user');
	            if (typeof user !== 'undefined') {
	                this.get('mybookings').set('amend', true);
	                this.get('mybookings').set('reschedule', true);
	                this.get('mybookings').set('cancel', false);
	            } else {
	                this.signinn();
	            }
	        });
	        this.on('printdiv', function (event, id) {
	            //window.print();
	            var user = this.get('meta.user');
	            if (typeof user !== 'undefined') {
	                window.location.href = '/airCart/print/' + id;
	            } else {
	                this.signinn();
	            }
	        });
	        this.on('asPDF', function (event, id) {
	            //window.location('/b2c/airCart/asPDF/'+id);
	            var user = this.get('meta.user');
	            if (typeof user !== 'undefined') {
	                window.location.href = "/airCart/asPDF/" + id;
	            } else {
	                this.signinn();
	            }
	        });
	        this.on('closemessage', function (event) {
	            $('.ui.positive.message').fadeOut();
	        });
	
	    },
	    submit: function () {
	        var view = this;
	        var user = this.get('meta.user');
	        
	            this.set('submitting', true);
	            $('.message').fadeIn();
	            $.ajax({
	                type: 'POST',
	                url: '/b2c/airCart/sendEmail/' + view.get('mybookings.currentCartDetails.id'),
	                data: {email: $('#email').val(), },
	                dataType: 'json',
	                complete: function () {
	                    view.set('submitting', false);
	                    $(".email_sent").html("<div class='email_sent'>Email Sent</div>");
	                },
	                success: function (data) {
	                    if (view.deferred) {
	                        view.deferred.resolve(data);
	                    }
	                },
	                error: function (xhr) {
	                    try {
	                        var response = JSON.parse(xhr.responseText);
	
	                        if (response.errors) {
	                            view.set('errors', response.errors);
	                        }
	                    } catch (e) {
	                        view.set('errorMsg', 'Server returned error. Please try again later');
	                    }
	                }
	            }).then(function (data) {
	                $(view.find('.ui.modal')).modal('hide');
	            });
	       
	    },
	    signinn: function () {
	        var view = this;
	       // console.log(view.get('mybookings'));
	        Auth.login()
	                .then(function (data) {
	                    //   console.log(data);
	                    //   console.log(view.get('mybookings').currentCartDetails.id);
	
	                    if (data && data.id) {
	                        view.set('meta.user', data);
	                        window.location.href = '/b2c/airCart/mybookings/' + view.get('mybookings.currentCartDetails.id');
	                    }
	                });
	    },
	    oncomplete: function () {
	        
	    },
	    back: function() {
	    	document.location.href="/";
	    }
	});

/***/ },

/***/ 358:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui positive  message","style":"display: none"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":"closemessage"}}," ",{"t":4,"f":["Sending Email.."],"n":50,"r":"./submitting"},{"t":4,"n":51,"f":["Email Sent"],"r":"./submitting"}]}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}},{"t":7,"e":"div","a":{"class":["box my-bookings-details ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"noprint"},"f":[{"t":7,"e":"h1","a":{"style":"vertical-align: bottom"},"f":["My Bookings Details ",{"t":4,"f":[{"t":7,"e":"button","v":{"click":"reschedule"},"a":{"class":"small ui button orange"},"f":["Change/Reschedule"]}," ",{"t":7,"e":"button","v":{"click":"cancel"},"a":{"class":"small ui button red"},"f":["Cancel"]}],"n":50,"x":{"r":["upcoming","meta.user.email","mybookings.currentCartDetails.email"],"s":"_0==\"true\"&&_1==_2"}}," ",{"t":7,"e":"button","v":{"click":"back"},"a":{"class":"small ui button yellow"},"f":["Back"]}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"a","a":{"href":"#","class":"email"},"v":{"click":{"m":"toggleemail","a":{"r":[],"s":"[]"}}},"m":[{"t":4,"f":["disabled='disabled'"],"n":50,"x":{"r":["submitting"],"s":"!_0"}}],"f":["Email"]}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/asPDF/",{"t":2,"r":"mybookings.currentCartDetails.id"}],"target":"_blank","class":"pdf"},"f":["Ticket as PDF"]}," ",{"t":7,"e":"a","a":{"class":"ticket","href":["/b2c/airCart/mybookings/",{"t":2,"r":"mybookings.currentCartDetails.id"},"#print"],"target":"_blank"},"f":["Print E-Ticket"]}," ",{"t":7,"e":"div","a":{"class":"ui modal small"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Email Ticket"]}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"form","a":{"class":["ui form ",{"t":4,"f":["loading"],"n":50,"r":"./submitting"}],"action":"javascript:;"},"f":[{"t":7,"e":"input","a":{"class":"ui input small","type":"text","name":"email","id":"email","value":""}}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":7,"e":"button","v":{"click":{"m":"submit","a":{"r":[],"s":"[]"}}},"a":{"class":"ui small button"},"f":["Send"]}]}]}]}]}]}]}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}}," ",{"t":7,"e":"table","a":{"style":"width:95%"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"width:45%","colspan":"3"},"f":[{"t":3,"r":"ticketstatusmsg"}]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"width:35%"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/dev/img/logo.png"}}]}]}," ",{"t":7,"e":"td","a":{"style":"width:35%"},"f":[{"t":7,"e":"span","a":{"style":"font-size: x-large;font-weight:bold;"},"f":["E-TICKET"]}]}," ",{"t":7,"e":"td","a":{"style":"width:30%"},"f":[{"t":7,"e":"table","a":{"style":" text-align: initial;float: right;"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"b","f":["CheapTicket.in : Customer Support"]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"b","f":["Email:"]}," ",{"t":7,"e":"a","a":{"href":"mailto:CS@CheapTicket.in"},"f":["CS@CheapTicket.in"]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"b","f":["Phone"]}," ",{"t":7,"e":"a","a":{"href":"tel:0120-4887777"},"f":["0120-4887777"]}]}]}]}]}]}],"n":50,"r":"mybookings.print"}]}," ",{"t":7,"e":"div","a":{"class":["group ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":7,"e":"div","a":{"class":"table title"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"to","style":"margin-top: 3px;"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"back","style":"margin-top: 3px;"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"source"},"  |  "],"i":"i","r":"bookings"}," ",{"t":2,"rx":{"r":"bookings","m":[{"r":["bookings.length"],"s":"_0-1"},"destination"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"r":"booking_statusmsg"}]}," ",{"t":7,"e":"br"}," "]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column ","style":"height: auto !important;"},"f":[{"t":7,"e":"div","a":{"class":"ui segment flight-itinerary compact dark"},"f":[{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":7,"e":"span","a":{"class":"city"},"f":[{"t":2,"r":"source"}," → ",{"t":2,"r":"destination"}]}," ",{"t":2,"x":{"r":["formatTravelDate2","departure"],"s":"_0(_1)"}}," ",{"t":7,"e":"span","a":{"class":"time"},"f":[{"t":2,"r":"flighttime"}]}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"id":"airport_change_style"},"f":[{"t":2,"r":"airport_change"}]}],"n":50,"r":"airport_change"}," ",{"t":4,"f":[{"t":7,"e":"span","a":{"id":"transitvisa_msg_style"},"f":[{"t":2,"r":"transit"}]}],"n":50,"r":"transit"}]}," ",{"t":7,"e":"table","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"divider"},"f":[{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","a":{"class":"layover"},"f":["Layover: ",{"t":2,"x":{"r":["diff","k","j","bookings"],"s":"_0(_3[_2].routes[_1].departure,_3[_2].routes[_1-1].arrival)"}}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}]}],"n":50,"x":{"r":["k"],"s":"_0>0"}}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"carrier-logo"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":[{"t":2,"rx":{"r":"bookings","m":[{"t":30,"n":"j"},"routes",{"t":30,"n":"k"},"logo"]}}],"alt":[{"t":2,"r":"carrierName"}],"title":[{"t":2,"r":"carrierName"}]}}]}," ",{"t":7,"e":"td","a":{"class":"carrier-name"},"f":[{"t":2,"r":"carrierName"},{"t":7,"e":"br"},{"t":2,"r":"carrier"},"-",{"t":2,"r":"flightNumber"}]}," ",{"t":7,"e":"td","a":{"class":"from","style":"text-align: right;"},"f":[{"t":7,"e":"b","m":[{"t":4,"f":["id=\"background_airport_change\""],"n":50,"x":{"r":["airport_change_name.0","airport_change_name.1","airport_change_name.2","airport_change_name.3","origin","airport_change_name.4"],"s":"_4==_0||_4==_1||_4==_2||_4==_3||_4==_5"}}],"f":[{"t":2,"r":"origin"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"style":"text-align: right;","class":"airport"},"f":[{"t":2,"r":"originDetails"}]}]}," ",{"t":7,"e":"td","a":{"class":"flight"},"f":[" "]}," ",{"t":7,"e":"td","a":{"class":"to"},"f":[{"t":7,"e":"b","m":[{"t":4,"f":["id=\"background_airport_change\""],"n":50,"x":{"r":["airport_change_name.0","airport_change_name.1","airport_change_name.2","airport_change_name.3","destination","airport_change_name.4"],"s":"_4==_0||_4==_1||_4==_2||_4==_3||_4==_5"}}],"f":[{"t":2,"r":"destination"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"destinationDetails"}]}]}," ",{"t":7,"e":"td","a":{"class":"time-n-cabin"},"f":[{"t":7,"e":"div","f":[{"t":2,"r":"flighttime"},{"t":7,"e":"br"}," ",{"t":2,"rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller",{"r":[],"s":"0"},"cabin"]}}]}]}," ",{"t":4,"f":[{"t":7,"e":"td","a":{"class":"techStop"},"f":[{"t":7,"e":"span","f":["Technical Stop:",{"t":7,"e":"br"}," ",{"t":2,"rx":{"r":"bookings","m":[{"t":30,"n":"j"},"routes",{"t":30,"n":"k"},"techStop"]}}]}]}],"n":50,"x":{"r":["k","j","bookings"],"s":"_2[_1].routes[_0].techStop!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}],"x":{"r":["k","j","bookings"],"s":"_2[_1].routes[_0].techStop!=null"}}]}],"i":"k","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"routes"]}}]}]}]}," ",{"t":7,"e":"table","a":{"class":"passenger"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Passenger"]}," ",{"t":7,"e":"th","f":["CRS PNR"]}," ",{"t":7,"e":"th","f":["Air PNR"]}," ",{"t":7,"e":"th","f":["Ticket No."]}," ",{"t":7,"e":"th","f":["Remark"]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":2,"r":"title"}," ",{"t":2,"r":"first_name"}," ",{"t":2,"r":"last_name"}," (",{"t":2,"r":"type"},") ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["travellerBookingStatus","status"],"s":"_0(_1)"}}]},"f":[{"t":2,"r":"statusmsg"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"b","f":[{"t":2,"r":"crs_pnr"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"b","f":[{"t":2,"r":"airline_pnr"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"b","f":[{"t":2,"r":"ticket"}]}]}," ",{"t":7,"e":"td","f":[{"t":4,"f":[{"t":7,"e":"b","f":[{"t":7,"e":"div","a":{"class":"ticket_baggage_styling"},"f":["Hand baggage only(7kg One Piece Only)"]}]}],"n":50,"x":{"r":["product_class"],"s":"_0==\"LITE\""}}]}]}],"i":"t","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller"]}}]}]}],"i":"j","r":"bookings"}," ",{"t":7,"e":"div","a":{"class":"total"},"f":["TOTAL PRICE: ",{"t":7,"e":"span","f":[{"t":2,"r":"curency"}," ",{"t":2,"x":{"r":["convert","totalAmount"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"div","a":{"class":"taxes"},"f":["Basic Fare : ",{"t":2,"r":"baseprice"}," , Taxes : ",{"t":2,"r":"taxes"}," , Fee : ",{"t":2,"r":"fee"},", Other : ",{"t":2,"r":"convfee"},{"t":4,"f":[", Discount : ",{"t":2,"r":"promodiscount"}],"n":50,"x":{"r":["promodiscount"],"s":"_0>0"}}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"style":"clear: both;"}}," ",{"t":7,"e":"table","a":{"class":"passenger"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","a":{"colspan":"2"},"f":["Terms and Conditions"]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":["All flight timings shown are local times."]}," ",{"t":7,"e":"li","f":["Use ",{"t":7,"e":"b","f":["Ref No."]}," for communication with us."]}," ",{"t":7,"e":"li","f":["Use ",{"t":7,"e":"b","f":["Airline PNR"]}," for contacting the Airlines."]}," ",{"t":7,"e":"li","f":["Carry a print-out of e-ticket for check-in."]}," ",{"t":7,"e":"li","f":["In case of no-show, tickets are non-refundable."]}," ",{"t":7,"e":"li","f":["Ensure your passport is valid for more than 6 months."]}," ",{"t":7,"e":"li","f":["Please check Transit & Destination Visa Requirement."]}," ",{"t":7,"e":"li","f":["For cancellation, airline charges & ser. fee apply."]}," ",{"t":7,"e":"li","f":["All payments are charged in INR. If any other currency has been chosen the price in that currency is only indicative."]}," ",{"t":7,"e":"li","f":["The INR price is the final price."]}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":["Carry a photo ID/ Passport for check-in."]}," ",{"t":7,"e":"li","f":["Meals, Seat & Special Requests are not guaranteed."]}," ",{"t":7,"e":"li","f":["Present Frequent Flier Card at check-in."]}," ",{"t":7,"e":"li","f":["Carriage is subject to Airlines Terms & Conditions."]}," ",{"t":7,"e":"li","f":["Ensure passenger names are correct, name change is not permitted."]}," ",{"t":7,"e":"li","f":["For any change Airline charges, difference of fare & ser. fee apply."]}," ",{"t":7,"e":"li","f":["You might be asked to provide card copy & ID proof of card holder."]}]}]}]}]}," ",{"t":7,"e":"div","a":{"style":"clear: both;"}}," ",{"t":7,"e":"div","a":{"class":""},"f":["Disclaimer: CheapTicket is not liable for any deficiency in service by Airline or Service providers."]}]}," ",{"t":4,"f":[],"n":50,"r":"mybookings.print"}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"script","a":{"type":"text/javascript"},"f":["window.ixiTransactionTracker = function(tag) {\nfunction updateRedirect(tag, transactionID, pnr, saleValue, segmentNights) {\nreturn \"<img style='top:-999999px;left:-999999px;position:absolute' src='https://www.ixigo.com/ixi-api/tracker/updateConversion/\" + tag + \"?transactionId=\" + transactionID + \"&pnr=\" + pnr + \"&saleValue=\" + saleValue + \"&segmentNights=\" + segmentNights + \"' />\";\n}\ndocument.body.innerHTML += updateRedirect(tag, \"",{"t":2,"r":"mybookings.currentCartDetails.id"},"\", \"",{"t":2,"r":"mybookings.currentCartDetails.bookings.0.traveller.0.airline_pnr"},"\", ",{"t":2,"x":{"r":["convertIxigo","mybookings.currentCartDetails.totalAmount"],"s":"_0(_1)"}},", ",{"t":2,"r":"mybookings.currentCartDetails.segNights"}," );\n};"]}," ",{"t":7,"e":"script","a":{"src":"https://www.ixigo.com/ixi-api/tracker/track196","id":"tracker"}}],"n":50,"x":{"r":["mybookings.clientSourceId"],"s":"_0==4"}},{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"script","a":{"type":"text/javascript"},"f":["\nvar wego = wego || [];\n\n_wego.push(\n\n[ 'conversionId', 'fca77661-76eb-4ccd-af4c-3b67a300127b' ],\n\n[ 'transactionId', '",{"t":2,"r":"mybookings.currentCartDetails.id"},"' ],\n\n[ 'currencyCode', 'INR' ],\n\n[ 'commission', 0],\n\n[ 'totalBookingValue', ",{"t":2,"x":{"r":["convertIxigo","mybookings.currentCartDetails.totalAmount"],"s":"_0(_1)"}}," ]\n\n);\n\n(function () {\n\nvar s = document.getElementsByTagName('script')[0];\n\nvar wg = document.createElement('script');\n\nwg.type = 'text/javascript';\n\nwg.src = 'https://s.wego.com/conversion.js';\n\ns.parentNode.insertBefore(wg, s);\n\n})();\n"]}],"n":50,"x":{"r":["mybookings.clientSourceId"],"s":"_0==5"}}],"n":50,"x":{"r":["booking_status"],"s":"_0==8||_0==9||_0==10||_0==11"}}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}}]}],"r":"mybookings.currentCartDetails"}]};

/***/ },

/***/ 359:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 400:
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
	        'ui-airport': __webpack_require__(401),
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

/***/ 401:
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
	            // console.log("ODEMATEFE: ", this.get('meta.select.domestic'));
	            this.set('options', this.get('meta.select.domestic'));
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

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvZmxpZ2h0L3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvcm91dGVzLmpzIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teXByb2ZpbGUvbXlwcm9maWxlLmpzIiwid2VicGFjazovLy8uL3ZlbmRvci92YWxpZGF0ZS92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmpzIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qcyIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9wYWdlLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9wYWdlcy9mbGlnaHRzL3NlYXJjaC5odG1sIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9mbGlnaHQvc2VhcmNoX2N1c3RvbS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvZm9ybS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9zcGlubmVyLmpzIiwid2VicGFjazovLy8uL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vc3Bpbm5lci5odG1sIiwid2VicGFjazovLy8uL2xlc3Mvd2ViL21vZHVsZXMvZmxpZ2h0cy5sZXNzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvZ3Vlc3RmaWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9ndWVzdHRpY2tldC9ndWVzdGZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZ3Vlc3R0aWNrZXQvZ3Vlc3RmaWx0ZXIuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9wYWdlcy9mbGlnaHRzL3NlYXJjaF9jdXN0b20uanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL2ZsaWdodC9tZXRhMS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvZ3Vlc3R0aWNrZXQvZ3Vlc3Rib29raW5nLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teWJvb2tpbmdzL2RldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3MvZGV0YWlscy5odG1sIiwid2VicGFjazovLy8uL2xlc3Mvd2ViL21vZHVsZXMvZ3Vlc3RmaWx0ZXIubGVzcyIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2ZsaWdodHMvc2VhcmNoL2Zvcm0xLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9haXJwb3J0MS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF3Qix1RkFBdUY7O0FBRS9HOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1Q0FBc0Msc0VBQXNFO0FBQzVHLGNBQWE7QUFDYix1Q0FBc0MsMERBQTBEO0FBQ2hHOztBQUVBLFVBQVMsR0FBRyxjQUFjOztBQUUxQjtBQUNBO0FBQ0EsK0NBQThDLHdDQUF3QztBQUN0Rjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFVBQVMs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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDhCQUE2QixPQUFPO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0dBQXFHLEVBQUU7QUFDdkc7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0gsR0FBRTtBQUNGO0FBQ0E7QUFDQSxrREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFDOzs7Ozs7OztBQzFaRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHdFQUF3RTtBQUMzRjtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0I7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBLDBDQUF5QztBQUN6QztBQUNBLDBCQUF5QjtBQUN6QixzQkFBcUI7OztBQUdyQixrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhLEdBQUcsWUFBWTtBQUM1Qjs7O0FBR0E7QUFDQSxFQUFDLEUiLCJmaWxlIjoianMvZ3Vlc3RmaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcbiAgICA7XG5cbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxuICAgIDtcblxudmFyIFJPVVRFUyA9IHJlcXVpcmUoJ2FwcC9yb3V0ZXMnKS5mbGlnaHRzO1xuXG52YXIgU2VhcmNoID0gU3RvcmUuZXh0ZW5kKHtcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbWVzdGljOiAxLFxuICAgICAgICAgICAgdHJpcFR5cGU6IFNlYXJjaC5PTkVXQVksXG4gICAgICAgICAgICBjYWJpblR5cGU6IFNlYXJjaC5FQ09OT01ZLFxuICAgICAgICAgICAgZmxpZ2h0czogWyB7IGZyb206IFNlYXJjaC5ERUwsIHRvOiBTZWFyY2guQk9NLCBkZXBhcnRfYXQ6IG1vbWVudCgpLmFkZCgxLCAnZGF5JyksIHJldHVybl9hdDogbnVsbCB9IF0sXG5cbiAgICAgICAgICAgIHBhc3NlbmdlcnM6IFsxLCAwLCAwXSxcblxuICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnZG9tZXN0aWMnLCBmdW5jdGlvbihkb21lc3RpYykge1xuICAgICAgICAgICAgaWYgKCFkb21lc3RpYyAmJiBTZWFyY2guTVVMVElDSVRZID09IHRoaXMuZ2V0KCd0cmlwVHlwZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ3RyaXBUeXBlJywgU2VhcmNoLk9ORVdBWSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkb21lc3RpYykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzJywgW3sgZnJvbTogU2VhcmNoLkRFTCwgdG86IFNlYXJjaC5CT00sIGRlcGFydF9hdDogbW9tZW50KCkuYWRkKDEsICdkYXknKSB9XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzJywgW3sgZnJvbTogbnVsbCwgdG86IG51bGwsIGRlcGFydF9hdDogbW9tZW50KCkuYWRkKDEsICdkYXknKSB9XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgeyBpbml0OiBmYWxzZSB9KTtcblxuICAgICAgICB0aGlzLm9ic2VydmUoJ3RyaXBUeXBlJywgZnVuY3Rpb24odmFsdWUsIG9sZCkge1xuICAgICAgICAgICAgaWYgKFNlYXJjaC5NVUxUSUNJVFkgPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGljZSgnZmxpZ2h0cycsIDEsIDAsIHsgZnJvbTogbnVsbCwgdG86IG51bGwsIGRlcGFydF9hdDogbnVsbCB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFNlYXJjaC5NVUxUSUNJVFkgPT0gb2xkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2ZsaWdodHMnLCBbdGhpcy5nZXQoJ2ZsaWdodHMuMCcpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChTZWFyY2guUk9VTkRUUklQID09IG9sZCkgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cy4wLnJldHVybl9hdCcsIG51bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHsgaW5pdDogZmFsc2UgfSk7XG4gICAgfSxcblxuICAgIHJlbW92ZUZsaWdodDogZnVuY3Rpb24oaSkge1xuICAgICAgICB0aGlzLnNwbGljZSgnZmxpZ2h0cycsIGksIDEpO1xuICAgIH0sXG5cbiAgICBhZGRGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnB1c2goJ2ZsaWdodHMnLCB7fSk7XG4gICAgfSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb3JtID0gdGhpcztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3M6IHRoaXMuZ2V0KCdjcycpLFxuICAgICAgICAgICAgZG9tZXN0aWM6IHRoaXMuZ2V0KCdkb21lc3RpYycpLFxuICAgICAgICAgICAgdHJpcFR5cGU6IHRoaXMuZ2V0KCd0cmlwVHlwZScpLFxuICAgICAgICAgICAgY2FiaW5UeXBlOiB0aGlzLmdldCgnY2FiaW5UeXBlJyksXG4gICAgICAgICAgICBwYXNzZW5nZXJzOiB0aGlzLmdldCgncGFzc2VuZ2VycycpLFxuXG4gICAgICAgICAgICBmbGlnaHRzOiBfLm1hcCh0aGlzLmdldCgnZmxpZ2h0cycpLCBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBmcm9tOiBmbGlnaHQuZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgdG86IGZsaWdodC50byxcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0X2F0OiBtb21lbnQuaXNNb21lbnQoZmxpZ2h0LmRlcGFydF9hdCkgPyBmbGlnaHQuZGVwYXJ0X2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuX2F0OiAyID09IGZvcm0uZ2V0KCd0cmlwVHlwZScpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IChtb21lbnQuaXNNb21lbnQoZmxpZ2h0LnJldHVybl9hdCkgPyBmbGlnaHQucmV0dXJuX2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgIH1cbn0pO1xuXG5TZWFyY2guTVVMVElDSVRZID0gMztcblNlYXJjaC5ST1VORFRSSVAgPSAyO1xuU2VhcmNoLk9ORVdBWSA9IDE7XG5cblNlYXJjaC5ERUwgPSAxMjM2O1xuU2VhcmNoLkJPTSA9IDk0NjtcblxuU2VhcmNoLkVDT05PTVkgPSAxO1xuU2VhcmNoLlBFUk1JVU1fRUNPTk9NWSA9IDI7XG5TZWFyY2guQlVTSU5FU1MgPSAzO1xuU2VhcmNoLkZJUlNUID0gNDtcblxuU2VhcmNoLk1BWF9XQUlUX1RJTUUgPSA2MDAwMDtcblNlYXJjaC5JTlRFUlZBTCA9IDUwMDA7XG5cblNlYXJjaC5sb2FkID0gZnVuY3Rpb24odXJsLCBmb3JjZSwgY3MpIHtcbiAgICBjcyA9IGNzIHx8IG51bGw7XG5cbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IFJPVVRFUy5zZWFyY2gsXG4gICAgICAgICAgICBkYXRhOiB7IHF1ZXJ5OiB1cmwsIGZvcmNlOiBmb3JjZSB8fCAwLCBjczogY3MgfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoU2VhcmNoLnBhcnNlKGRhdGEpKTsgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSlcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cblNlYXJjaC5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBkYXRhLmZsaWdodHMgPSBfLm1hcChkYXRhLmZsaWdodHMsIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgaS5kZXBhcnRfYXQgPSBtb21lbnQoaS5kZXBhcnRfYXQpO1xuICAgICAgICBpLnJldHVybl9hdCA9IGkucmV0dXJuX2F0ICYmIG1vbWVudChpLnJldHVybl9hdCk7XG5cbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSk7XG5cbiAgICB2YXIgc2VhcmNoID0gbmV3IFNlYXJjaCh7ZGF0YTogZGF0YX0pO1xuXG5cbiAgICByZXR1cm4gc2VhcmNoO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL3N0b3Jlcy9mbGlnaHQvc2VhcmNoLmpzXG4vLyBtb2R1bGUgaWQgPSA1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSA2IiwidmFyIEZMSUdIVFMgPSAnL2IyYy9mbGlnaHRzJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZmxpZ2h0czoge1xuICAgICAgICBzZWFyY2g6IEZMSUdIVFMgKyAnL3NlYXJjaCcsXG4gICAgICAgIGJvb2tpbmc6IGZ1bmN0aW9uKGlkKSB7IHJldHVybiAnL2IyYy9ib29raW5nLycgKyBpZDsgfSxcbiAgICB9LFxufTtcblxuLy9uZXdcbnZhciBwcm9maWxlbWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXByb2ZpbGUvbWV0YScpLFxuICAgIGJvb2tpbmdlbWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL21ldGEnKSxcbiAgICB0cmF2ZWxsZXJtZXRhID0gcmVxdWlyZSgnc3RvcmVzL215dHJhdmVsbGVyL21ldGEnKSxcbiAgICBteVByb2ZpbGUgPSByZXF1aXJlKCdzdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZScpLFxuICAgIG15Qm9va2luZyA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MnKSxcbiAgICBteVRyYXZlbGxlciA9IHJlcXVpcmUoJ3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpO1xuICAgIFxudmFyIGFjdGlvbnMgPSB7XG4gICAgcHJvZmlsZTogZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICAgIChuZXcgbXlQcm9maWxlKCkpLnJlbmRlcignI2FwcCcpLnRoZW4oZnVuY3Rpb24oKSB7IG5leHQoKTsgfSk7XG4gICAgfSxcbiAgICBib29raW5nOiBmdW5jdGlvbihjdHgsIG5leHQpIHtcbiAgICAgICAgKG5ldyBteUJvb2tpbmcoKSkucmVuZGVyKCcjYXBwJykudGhlbihmdW5jdGlvbigpIHsgbmV4dCgpOyB9KTtcbiAgICB9LFxuICAgIHRyYXZlbGxlcjogZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICAgIChuZXcgbXlUcmF2ZWxsZXIoKSkucmVuZGVyKCcjYXBwJykudGhlbihmdW5jdGlvbigpIHsgbmV4dCgpOyB9KTtcbiAgICB9LFxufTtcblxucHJvZmlsZW1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKG1ldGEpIHtcbiAgICBwYWdlKCcvYjJjL3VzZXJzL215cHJvZmlsZS8nLCBhY3Rpb25zLnByb2ZpbGUpO1xuICAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcbn0pO1xuXG5ib29raW5nZW1ldGEuaW5zdGFuY2UoKS50aGVuKGZ1bmN0aW9uKG1ldGEpIHtcbiAgICBwYWdlKCcvYjJjL3VzZXJzL215Ym9va2luZ3MvJywgYWN0aW9ucy5ib29raW5nKTtcbiAgICAgcGFnZSh7Y2xpY2s6IGZhbHNlfSk7XG59KTtcblxudHJhdmVsbGVybWV0YS5pbnN0YW5jZSgpLnRoZW4oZnVuY3Rpb24obWV0YSkge1xuICAgIHBhZ2UoJy9iMmMvdXNlcnMvbXl0cmF2ZWxsZXIvJywgYWN0aW9ucy50cmF2ZWxsZXIpO1xuICAgICBwYWdlKHtjbGljazogZmFsc2V9KTtcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3JvdXRlcy5qc1xuLy8gbW9kdWxlIGlkID0gNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDUgNiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcbiAgICBRID0gcmVxdWlyZSgncScpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICB2YWxpZGF0ZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlJylcbiAgICBcbiAgICA7XG5cbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSAgO1xuXG52YXIgTXlwcm9maWxlID0gU3RvcmUuZXh0ZW5kKHtcbiAgICBjb21wdXRlZDoge1xuICAgICAgICBwcmljZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfLnJlZHVjZSh0aGlzLmdldCgnICcpKVxuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRTdGF0ZUxpc3Q6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgLy8gY29uc29sZS5sb2coXCJnZXRTdGF0ZUxpc3RcIik7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJy9iMmMvdXNlcnMvZ2V0U3RhdGVMaXN0LycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5jb3VudHJ5Y29kZScpKSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RhdGVsaXN0JyxudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N0YXRlbGlzdCcsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgdmlldy5nZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy51cGRhdGUoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmaW5zaWhlZCBzdG9yZTogJyk7XG4gICAgICAgICAgICB2YXIgdGVtcD12aWV3LmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJyk7XG4gICAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgbnVsbCk7XG4gICAgICAgICAgdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScsIHRlbXApO1xuICAgICAgICAgIFxuICAgICAgICAgIFxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRDaXR5TGlzdDogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImdldENpdHlMaXN0XCIpO1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL3VzZXJzL2dldENpdHlMaXN0LycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKSksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NpdHlsaXN0JyxudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NpdHlsaXN0JywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5jaXR5Y29kZScsIHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5jaXR5Y29kZScpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAkKCcjZGl2Y2l0eSAudWkuZHJvcGRvd24nKS5kcm9wZG93bignc2V0IHNlbGVjdGVkJywgJCgnI2RpdmNpdHkgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxuTXlwcm9maWxlLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpOyAgXG4gICAgICAgICAgIGRhdGEuYmFzZVVybD0nJztcbiAgICAgICAgICAgIGRhdGEuYWRkPWZhbHNlO1xuICAgICAgICAgICAgZGF0YS5lZGl0PWZhbHNlOyAgICAgICAgICAgXG4gICAgICAgICAgICBkYXRhLnBlbmRpbmc9IGZhbHNlO1xuICAgICAgICAgICAgXG4gICAgcmV0dXJuIG5ldyBNeXByb2ZpbGUoe2RhdGE6IGRhdGF9KTtcblxufTtcbk15cHJvZmlsZS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICQuZ2V0SlNPTignL2IyYy91c2Vycy9nZXRQcm9maWxlJylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgIHJlc29sdmUoTXlwcm9maWxlLnBhcnNlKGRhdGEpKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZhaWxlZFwiKTtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNeXByb2ZpbGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9zdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZS5qc1xuLy8gbW9kdWxlIGlkID0gNjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDUgNiA4IiwiLy8gICAgIFZhbGlkYXRlLmpzIDAuNy4xXG5cbi8vICAgICAoYykgMjAxMy0yMDE1IE5pY2tsYXMgQW5zbWFuLCAyMDEzIFdyYXBwXG4vLyAgICAgVmFsaWRhdGUuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly92YWxpZGF0ZWpzLm9yZy9cblxuKGZ1bmN0aW9uKGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cy5cbiAgLy8gVGhlIG9wdGlvbnMgYXJlIHRoZSBmb2xsb3dpbmc6XG4gIC8vICAgLSBmb3JtYXQgKHN0cmluZykgLSBBbiBvcHRpb24gdGhhdCBjb250cm9scyBob3cgdGhlIHJldHVybmVkIHZhbHVlIGlzIGZvcm1hdHRlZFxuICAvLyAgICAgKiBmbGF0IC0gUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YganVzdCB0aGUgZXJyb3IgbWVzc2FnZXNcbiAgLy8gICAgICogZ3JvdXBlZCAtIFJldHVybnMgdGhlIG1lc3NhZ2VzIGdyb3VwZWQgYnkgYXR0cmlidXRlIChkZWZhdWx0KVxuICAvLyAgICAgKiBkZXRhaWxlZCAtIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJhdyB2YWxpZGF0aW9uIGRhdGFcbiAgLy8gICAtIGZ1bGxNZXNzYWdlcyAoYm9vbGVhbikgLSBJZiBgdHJ1ZWAgKGRlZmF1bHQpIHRoZSBhdHRyaWJ1dGUgbmFtZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGVycm9yLlxuICAvL1xuICAvLyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBvcHRpb25zIGFyZSBhbHNvIHBhc3NlZCB0byBlYWNoIHZhbGlkYXRvci5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpXG4gICAgICAsIGF0dHJcbiAgICAgICwgdmFsaWRhdG9yO1xuXG4gICAgZm9yIChhdHRyIGluIHJlc3VsdHMpIHtcbiAgICAgIGZvciAodmFsaWRhdG9yIGluIHJlc3VsdHNbYXR0cl0pIHtcbiAgICAgICAgaWYgKHYuaXNQcm9taXNlKHJlc3VsdHNbYXR0cl1bdmFsaWRhdG9yXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2UgdmFsaWRhdGUuYXN5bmMgaWYgeW91IHdhbnQgc3VwcG9ydCBmb3IgcHJvbWlzZXNcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRlLnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICB2YXIgdiA9IHZhbGlkYXRlO1xuXG4gIC8vIENvcGllcyBvdmVyIGF0dHJpYnV0ZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2VzIHRvIGEgc2luZ2xlIGRlc3RpbmF0aW9uLlxuICAvLyBWZXJ5IG11Y2ggc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgZXh0ZW5kLlxuICAvLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHRhcmdldCBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIHdpbGwgYmVcbiAgLy8gdXNlZCBhcyB0YXJnZXRzLlxuICB2LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgYXR0ciBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW2F0dHJdID0gc291cmNlW2F0dHJdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgdi5leHRlbmQodmFsaWRhdGUsIHtcbiAgICAvLyBUaGlzIGlzIHRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IGFzIGEgc2VtdmVyLlxuICAgIC8vIFRoZSB0b1N0cmluZyBmdW5jdGlvbiB3aWxsIGFsbG93IGl0IHRvIGJlIGNvZXJjZWQgaW50byBhIHN0cmluZ1xuICAgIHZlcnNpb246IHtcbiAgICAgIG1ham9yOiAwLFxuICAgICAgbWlub3I6IDcsXG4gICAgICBwYXRjaDogMSxcbiAgICAgIG1ldGFkYXRhOiBudWxsLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHYuZm9ybWF0KFwiJXttYWpvcn0uJXttaW5vcn0uJXtwYXRjaH1cIiwgdi52ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2LmlzRW1wdHkodi52ZXJzaW9uLm1ldGFkYXRhKSkge1xuICAgICAgICAgIHZlcnNpb24gKz0gXCIrXCIgKyB2LnZlcnNpb24ubWV0YWRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEJlbG93IGlzIHRoZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgdXNlZCBpbiB2YWxpZGF0ZS5qc1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIElmIHlvdSBhcmUgdXNpbmcgUS5qcywgUlNWUCBvciBhbnkgb3RoZXIgQSsgY29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIG92ZXJyaWRlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGF0IHByb21pc2UuXG4gICAgLy8gU2luY2UgalF1ZXJ5IHByb21pc2VzIGFyZW4ndCBBKyBjb21wYXRpYmxlIHRoZXkgd29uJ3Qgd29yay5cbiAgICBQcm9taXNlOiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFByb21pc2UgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgLy8gSWYgbW9tZW50IGlzIHVzZWQgaW4gbm9kZSwgYnJvd3NlcmlmeSBldGMgcGxlYXNlIHNldCB0aGlzIGF0dHJpYnV0ZVxuICAgIC8vIGxpa2UgdGhpczogYHZhbGlkYXRlLm1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG4gICAgbW9tZW50OiB0eXBlb2YgbW9tZW50ICE9PSBcInVuZGVmaW5lZFwiID8gbW9tZW50IDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIFhEYXRlOiB0eXBlb2YgWERhdGUgIT09IFwidW5kZWZpbmVkXCIgPyBYRGF0ZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBFTVBUWV9TVFJJTkdfUkVHRVhQOiAvXlxccyokLyxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cyBvYmplY3QuXG4gICAgLy8gV2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIGZvcm1hdDpcbiAgICAvLyAgICAgW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZSBuYW1lPlwiLCBlcnJvcjogXCI8dmFsaWRhdGlvbiByZXN1bHQ+XCJ9LCAuLi5dXG4gICAgcnVuVmFsaWRhdGlvbnM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgICwgYXR0clxuICAgICAgICAsIHZhbGlkYXRvck5hbWVcbiAgICAgICAgLCB2YWx1ZVxuICAgICAgICAsIHZhbGlkYXRvcnNcbiAgICAgICAgLCB2YWxpZGF0b3JcbiAgICAgICAgLCB2YWxpZGF0b3JPcHRpb25zXG4gICAgICAgICwgZXJyb3I7XG5cbiAgICAgIGlmICh2LmlzRG9tRWxlbWVudChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jb2xsZWN0Rm9ybVZhbHVlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcHMgdGhyb3VnaCBlYWNoIGNvbnN0cmFpbnRzLCBmaW5kcyB0aGUgY29ycmVjdCB2YWxpZGF0b3IgYW5kIHJ1biBpdC5cbiAgICAgIGZvciAoYXR0ciBpbiBjb25zdHJhaW50cykge1xuICAgICAgICB2YWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIGF0dHIpO1xuICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludHMgZm9yIGFuIGF0dHJpYnV0ZSB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgdmFsaWRhdG9ycyA9IHYucmVzdWx0KGNvbnN0cmFpbnRzW2F0dHJdLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuXG4gICAgICAgIGZvciAodmFsaWRhdG9yTmFtZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgdmFsaWRhdG9yID0gdi52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gdi5mb3JtYXQoXCJVbmtub3duIHZhbGlkYXRvciAle25hbWV9XCIsIHtuYW1lOiB2YWxpZGF0b3JOYW1lfSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBvcHRpb25zIHRvIGJlIGEgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlXG4gICAgICAgICAgLy8gY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHYucmVzdWx0KHZhbGlkYXRvck9wdGlvbnMsIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3JPcHRpb25zKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvcjogdmFsaWRhdG9yLmNhbGwodmFsaWRhdG9yLCB2YWx1ZSwgdmFsaWRhdG9yT3B0aW9ucywgYXR0cixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG5cbiAgICAvLyBUYWtlcyB0aGUgb3V0cHV0IGZyb20gcnVuVmFsaWRhdGlvbnMgYW5kIGNvbnZlcnRzIGl0IHRvIHRoZSBjb3JyZWN0XG4gICAgLy8gb3V0cHV0IGZvcm1hdC5cbiAgICBwcm9jZXNzVmFsaWRhdGlvblJlc3VsdHM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIGVycm9ycyA9IHYucHJ1bmVFbXB0eUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5leHBhbmRNdWx0aXBsZUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5jb252ZXJ0RXJyb3JNZXNzYWdlcyhlcnJvcnMsIG9wdGlvbnMpO1xuXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMuZm9ybWF0IHx8IFwiZ3JvdXBlZFwiKSB7XG4gICAgICAgIGNhc2UgXCJkZXRhaWxlZFwiOlxuICAgICAgICAgIC8vIERvIG5vdGhpbmcgbW9yZSB0byB0aGUgZXJyb3JzXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImZsYXRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9ycyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdyb3VwZWRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNbYXR0cl0gPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9yc1thdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHYuZm9ybWF0KFwiVW5rbm93biBmb3JtYXQgJXtmb3JtYXR9XCIsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuaXNFbXB0eShlcnJvcnMpID8gdW5kZWZpbmVkIDogZXJyb3JzO1xuICAgIH0sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0aW9ucyB3aXRoIHN1cHBvcnQgZm9yIHByb21pc2VzLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCB3aGVuIGFsbCB0aGVcbiAgICAvLyB2YWxpZGF0aW9uIHByb21pc2VzIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gICAgLy8gSXQgY2FuIGJlIGNhbGxlZCBldmVuIGlmIG5vIHZhbGlkYXRpb25zIHJldHVybmVkIGEgcHJvbWlzZS5cbiAgICBhc3luYzogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5hc3luYy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2LndhaXRGb3JSZXN1bHRzKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVycm9ycyA9IHYucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpbmdsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuc2luZ2xlLm9wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgZm9ybWF0OiBcImZsYXRcIixcbiAgICAgICAgZnVsbE1lc3NhZ2VzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdih7c2luZ2xlOiB2YWx1ZX0sIHtzaW5nbGU6IGNvbnN0cmFpbnRzfSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgcHJvbWlzZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcbiAgICAvLyBhcmUgc2V0dGxlZC4gVGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzIGFsd2F5cyByZXNvbHZlZCxcbiAgICAvLyBuZXZlciByZWplY3RlZC5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBpbnB1dCBhcmd1bWVudCwgaXQgcmVwbGFjZXMgdGhlIHByb21pc2VzXG4gICAgLy8gd2l0aCB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgcHJvbWlzZS5cbiAgICB3YWl0Rm9yUmVzdWx0czogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgLy8gQ3JlYXRlIGEgc2VxdWVuY2Ugb2YgYWxsIHRoZSByZXN1bHRzIHN0YXJ0aW5nIHdpdGggYSByZXNvbHZlZCBwcm9taXNlLlxuICAgICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHJlc3VsdCkge1xuICAgICAgICAvLyBJZiB0aGlzIHJlc3VsdCBpc24ndCBhIHByb21pc2Ugc2tpcCBpdCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIGlmICghdi5pc1Byb21pc2UocmVzdWx0LmVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lbW8udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmVycm9yLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAvLyBJZiBmb3Igc29tZSByZWFzb24gdGhlIHZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgbm9cbiAgICAgICAgICAgICAgLy8gZXJyb3Igd2FzIHNwZWNpZmllZC5cbiAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHYud2FybihcIlZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgZGlkbid0IHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcigpOyB9KSk7IC8vIEEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIH0sXG5cbiAgICAvLyBJZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBjYWxsOiBmdW5jdGlvbiB0aGUgYW5kOiBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlXG4gICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZS4gQWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXNcbiAgICAvLyBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmVzdWx0KCdmb28nKSAvLyAnZm9vJ1xuICAgIC8vIHJlc3VsdChNYXRoLm1heCwgMSwgMikgLy8gMlxuICAgIC8vIGBgYFxuICAgIHJlc3VsdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLiBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IGNvbnNpZGVyIE5hTiBhXG4gICAgLy8gbnVtYmVyIGxpa2UgbWFueSBvdGhlciBgaXNOdW1iZXJgIGZ1bmN0aW9ucyBkby5cbiAgICBpc051bWJlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBub3QgYSBmdW5jdGlvblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0sXG5cbiAgICAvLyBBIHNpbXBsZSBjaGVjayB0byB2ZXJpZnkgdGhhdCB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlci4gVXNlcyBgaXNOdW1iZXJgXG4gICAgLy8gYW5kIGEgc2ltcGxlIG1vZHVsbyBjaGVjay5cbiAgICBpc0ludGVnZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgJSAxID09PSAwO1xuICAgIH0sXG5cbiAgICAvLyBVc2VzIHRoZSBgT2JqZWN0YCBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYW4gb2JqZWN0LlxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICAgIH0sXG5cbiAgICAvLyBTaW1wbHkgY2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBkYXRlXG4gICAgaXNEYXRlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgYG51bGxgIG9mIGB1bmRlZmluZWRgXG4gICAgaXNEZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBwcm9taXNlLiBBbnl0aGluZyB3aXRoIGEgYHRoZW5gXG4gICAgLy8gZnVuY3Rpb24gaXMgY29uc2lkZXJlZCBhIHByb21pc2UuXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gISFwICYmIHYuaXNGdW5jdGlvbihwLnRoZW4pO1xuICAgIH0sXG5cbiAgICBpc0RvbUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvckFsbCkgfHwgIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3QoZG9jdW1lbnQpICYmIG8gPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvNjk5MzA0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG8gJiZcbiAgICAgICAgICB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgICBvLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgLy8gTnVsbCBhbmQgdW5kZWZpbmVkIGFyZSBlbXB0eVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaXRlc3BhY2Ugb25seSBzdHJpbmdzIGFyZSBlbXB0eVxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2LkVNUFRZX1NUUklOR19SRUdFWFAudGVzdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBhcnJheXMgd2UgdXNlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgIGlmICh2LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIGhhdmUgbm8gYXR0cmlidXRlcyBidXQgYXJlbid0IGVtcHR5XG4gICAgICBpZiAodi5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgZmluZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkgd2UgY29uc2lkZXIgaXQgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEZvcm1hdHMgdGhlIHNwZWNpZmllZCBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHZhbHVlcyBsaWtlIHNvOlxuICAgIC8vIGBgYFxuICAgIC8vIGZvcm1hdChcIkZvbzogJXtmb299XCIsIHtmb286IFwiYmFyXCJ9KSAvLyBcIkZvbyBiYXJcIlxuICAgIC8vIGBgYFxuICAgIC8vIElmIHlvdSB3YW50IHRvIHdyaXRlICV7Li4ufSB3aXRob3V0IGhhdmluZyBpdCByZXBsYWNlZCBzaW1wbHlcbiAgICAvLyBwcmVmaXggaXQgd2l0aCAlIGxpa2UgdGhpcyBgRm9vOiAlJXtmb299YCBhbmQgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIGFzIGBcIkZvbzogJXtmb299XCJgXG4gICAgZm9ybWF0OiB2LmV4dGVuZChmdW5jdGlvbihzdHIsIHZhbHMpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSh2LmZvcm1hdC5GT1JNQVRfUkVHRVhQLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgIGlmIChtMSA9PT0gJyUnKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJXtcIiArIG0yICsgXCJ9XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWxzW20yXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgIC8vIEZpbmRzICV7a2V5fSBzdHlsZSBwYXR0ZXJucyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICBGT1JNQVRfUkVHRVhQOiAvKCU/KSVcXHsoW15cXH1dKylcXH0vZ1xuICAgIH0pLFxuXG4gICAgLy8gXCJQcmV0dGlmaWVzXCIgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAvLyBQcmV0dGlmeWluZyBtZWFucyByZXBsYWNpbmcgWy5cXF8tXSB3aXRoIHNwYWNlcyBhcyB3ZWxsIGFzIHNwbGl0dGluZ1xuICAgIC8vIGNhbWVsIGNhc2Ugd29yZHMuXG4gICAgcHJldHRpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHYuaXNOdW1iZXIoc3RyKSkge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDIgZGVjaW1hbHMgcm91bmQgaXQgdG8gdHdvXG4gICAgICAgIGlmICgoc3RyICogMTAwKSAlIDEgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHN0ciAqIDEwMCkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNBcnJheShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHYucHJldHRpZnkocyk7IH0pLmpvaW4oXCIsIFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgc3RyaW5nIGlzIGFjdHVhbGx5IGEgc3RyaW5nXG4gICAgICBzdHIgPSBcIlwiICsgc3RyO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC8vIFNwbGl0cyBrZXlzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXHNdKVxcLihbXlxcc10pL2csICckMSAkMicpXG4gICAgICAgIC8vIFJlbW92ZXMgYmFja3NsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwrL2csICcnKVxuICAgICAgICAvLyBSZXBsYWNlcyAtIGFuZCAtIHdpdGggc3BhY2VcbiAgICAgICAgLnJlcGxhY2UoL1tfLV0vZywgJyAnKVxuICAgICAgICAvLyBTcGxpdHMgY2FtZWwgY2FzZWQgd29yZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIG0xICsgXCIgXCIgKyBtMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgc3RyaW5naWZ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5wcmV0dGlmeSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIGluIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0RGVlcE9iamVjdFZhbHVlOiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIGlmICghdi5pc09iamVjdChvYmopIHx8ICF2LmlzU3RyaW5nKGtleXBhdGgpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiXG4gICAgICAgICwgaVxuICAgICAgICAsIGVzY2FwZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cGF0aC5sZW5ndGg7ICsraSkge1xuICAgICAgICBzd2l0Y2ggKGtleXBhdGhbaV0pIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnLic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgICAgICAgICAgIGtleSA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnXFxcXCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cGF0aFtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzRGVmaW5lZChvYmopICYmIGtleSBpbiBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVGhpcyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtLlxuICAgIC8vIEl0IHVzZXMgdGhlIGlucHV0IG5hbWUgYXMga2V5IGFuZCB0aGUgdmFsdWUgYXMgdmFsdWVcbiAgICAvLyBTbyBmb3IgZXhhbXBsZSB0aGlzOlxuICAgIC8vIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiZm9vQGJhci5jb21cIiAvPlxuICAgIC8vIHdvdWxkIHJldHVybjpcbiAgICAvLyB7ZW1haWw6IFwiZm9vQGJhci5jb21cIn1cbiAgICBjb2xsZWN0Rm9ybVZhbHVlczogZnVuY3Rpb24oZm9ybSwgb3B0aW9ucykge1xuICAgICAgdmFyIHZhbHVlcyA9IHt9XG4gICAgICAgICwgaVxuICAgICAgICAsIGlucHV0XG4gICAgICAgICwgaW5wdXRzXG4gICAgICAgICwgdmFsdWU7XG5cbiAgICAgIGlmICghZm9ybSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF0dHJpYnV0ZXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0udmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LFxuXG4gICAgc2FuaXRpemVGb3JtVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmltICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5udWxsaWZ5ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgYWxsIGVycm9ycyB3aG8ncyBlcnJvciBhdHRyaWJ1dGUgaXMgZW1wdHkgKG51bGwgb3IgdW5kZWZpbmVkKVxuICAgIHBydW5lRW1wdHlFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICF2LmlzRW1wdHkoZXJyb3IuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIEluXG4gICAgLy8gW3tlcnJvcjogW1wiZXJyMVwiLCBcImVycjJcIl0sIC4uLn1dXG4gICAgLy8gT3V0XG4gICAgLy8gW3tlcnJvcjogXCJlcnIxXCIsIC4uLn0sIHtlcnJvcjogXCJlcnIyXCIsIC4uLn1dXG4gICAgLy9cbiAgICAvLyBBbGwgYXR0cmlidXRlcyBpbiBhbiBlcnJvciB3aXRoIG11bHRpcGxlIG1lc3NhZ2VzIGFyZSBkdXBsaWNhdGVkXG4gICAgLy8gd2hlbiBleHBhbmRpbmcgdGhlIGVycm9ycy5cbiAgICBleHBhbmRNdWx0aXBsZUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBSZW1vdmVzIGVycm9ycyB3aXRob3V0IGEgbWVzc2FnZVxuICAgICAgICBpZiAodi5pc0FycmF5KGVycm9yLmVycm9yKSkge1xuICAgICAgICAgIGVycm9yLmVycm9yLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3IsIHtlcnJvcjogbXNnfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0cyB0aGUgZXJyb3IgbWVzYWdlcyBieSBwcmVwZW5kaW5nIHRoZSBhdHRyaWJ1dGUgbmFtZSB1bmxlc3MgdGhlXG4gICAgLy8gbWVzc2FnZSBpcyBwcmVmaXhlZCBieSBeXG4gICAgY29udmVydEVycm9yTWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9ySW5mbykge1xuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckluZm8uZXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yWzBdID09PSAnXicpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yLnNsaWNlKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZnVsbE1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVycm9yID0gdi5jYXBpdGFsaXplKHYucHJldHRpZnkoZXJyb3JJbmZvLmF0dHJpYnV0ZSkpICsgXCIgXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IGVycm9yLnJlcGxhY2UoL1xcXFxcXF4vZywgXCJeXCIpO1xuICAgICAgICBlcnJvciA9IHYuZm9ybWF0KGVycm9yLCB7dmFsdWU6IHYuc3RyaW5naWZ5VmFsdWUoZXJyb3JJbmZvLnZhbHVlKX0pO1xuICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3JJbmZvLCB7ZXJyb3I6IGVycm9yfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8ge1wiPGF0dHJpYnV0ZU5hbWU+XCI6IFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XX1cbiAgICBncm91cEVycm9yc0J5QXR0cmlidXRlOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBsaXN0ID0gcmV0W2Vycm9yLmF0dHJpYnV0ZV07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgbGlzdC5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXRbZXJyb3IuYXR0cmlidXRlXSA9IFtlcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3tlcnJvcjogXCI8bWVzc2FnZSAxPlwiLCAuLi59LCB7ZXJyb3I6IFwiPG1lc3NhZ2UgMj5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8gW1wiPG1lc3NhZ2UgMT5cIiwgXCI8bWVzc2FnZSAyPlwiXVxuICAgIGZsYXR0ZW5FcnJvcnNUb0FycmF5OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKSB7IHJldHVybiBlcnJvci5lcnJvcjsgfSk7XG4gICAgfSxcblxuICAgIGV4cG9zZU1vZHVsZTogZnVuY3Rpb24odmFsaWRhdGUsIHJvb3QsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgICBpZiAodmFsaWRhdGUuaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXJuOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7XG4gICAgLy8gUHJlc2VuY2UgdmFsaWRhdGVzIHRoYXQgdGhlIHZhbHVlIGlzbid0IGVtcHR5XG4gICAgcHJlc2VuY2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImNhbid0IGJlIGJsYW5rXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpcyA9IG9wdGlvbnMuaXNcbiAgICAgICAgLCBtYXhpbXVtID0gb3B0aW9ucy5tYXhpbXVtXG4gICAgICAgICwgbWluaW11bSA9IG9wdGlvbnMubWluaW11bVxuICAgICAgICAsIHRva2VuaXplciA9IG9wdGlvbnMudG9rZW5pemVyIHx8IGZ1bmN0aW9uKHZhbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICwgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW107XG5cbiAgICAgIHZhbHVlID0gdG9rZW5pemVyKHZhbHVlKTtcbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICBpZighdi5pc051bWJlcihsZW5ndGgpKSB7XG4gICAgICAgIHYuZXJyb3Iodi5mb3JtYXQoXCJBdHRyaWJ1dGUgJXthdHRyfSBoYXMgYSBub24gbnVtZXJpYyB2YWx1ZSBmb3IgYGxlbmd0aGBcIiwge2F0dHI6IGF0dHJpYnV0ZX0pKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaGFzIGFuIGluY29ycmVjdCBsZW5ndGhcIjtcbiAgICAgIH1cblxuICAgICAgLy8gSXMgY2hlY2tzXG4gICAgICBpZiAodi5pc051bWJlcihpcykgJiYgbGVuZ3RoICE9PSBpcykge1xuICAgICAgICBlcnIgPSBvcHRpb25zLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIFwiaXMgdGhlIHdyb25nIGxlbmd0aCAoc2hvdWxkIGJlICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBpc30pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWluaW11bSkgJiYgbGVuZ3RoIDwgbWluaW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb1Nob3J0IHx8XG4gICAgICAgICAgdGhpcy50b29TaG9ydCB8fFxuICAgICAgICAgIFwiaXMgdG9vIHNob3J0IChtaW5pbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtaW5pbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtYXhpbXVtKSAmJiBsZW5ndGggPiBtYXhpbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTG9uZyB8fFxuICAgICAgICAgIHRoaXMudG9vTG9uZyB8fFxuICAgICAgICAgIFwiaXMgdG9vIGxvbmcgKG1heGltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1heGltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bWVyaWNhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgICAsIG5hbWVcbiAgICAgICAgLCBjb3VudFxuICAgICAgICAsIGNoZWNrcyA9IHtcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuOiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID4gYzsgfSxcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID49IGM7IH0sXG4gICAgICAgICAgICBlcXVhbFRvOiAgICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA9PT0gYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuOiAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDwgYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDw9IGM7IH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBDb2VyY2UgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIHVubGVzcyB3ZSdyZSBiZWluZyBzdHJpY3QuXG4gICAgICBpZiAob3B0aW9ucy5ub1N0cmluZ3MgIT09IHRydWUgJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIHdlIHNob3VsZG4ndCBjb250aW51ZSBzaW5jZSBpdCB3aWxsIGNvbXBhcmUgaXQuXG4gICAgICBpZiAoIXYuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImlzIG5vdCBhIG51bWJlclwiO1xuICAgICAgfVxuXG4gICAgICAvLyBTYW1lIGxvZ2ljIGFzIGFib3ZlLCBzb3J0IG9mLiBEb24ndCBib3RoZXIgd2l0aCBjb21wYXJpc29ucyBpZiB0aGlzXG4gICAgICAvLyBkb2Vzbid0IHBhc3MuXG4gICAgICBpZiAob3B0aW9ucy5vbmx5SW50ZWdlciAmJiAhdi5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RJbnRlZ2VyICB8fCBcIm11c3QgYmUgYW4gaW50ZWdlclwiO1xuICAgICAgfVxuXG4gICAgICBmb3IgKG5hbWUgaW4gY2hlY2tzKSB7XG4gICAgICAgIGNvdW50ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgaWYgKHYuaXNOdW1iZXIoY291bnQpICYmICFjaGVja3NbbmFtZV0odmFsdWUsIGNvdW50KSkge1xuICAgICAgICAgIC8vIFRoaXMgcGlja3MgdGhlIGRlZmF1bHQgbWVzc2FnZSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZSB0aGUgZ3JlYXRlclRoYW4gY2hlY2sgdXNlcyB0aGUgbWVzc2FnZSBmcm9tXG4gICAgICAgICAgLy8gdGhpcy5ub3RHcmVhdGVyVGhhbiBzbyB3ZSBjYXBpdGFsaXplIHRoZSBuYW1lIGFuZCBwcmVwZW5kIFwibm90XCJcbiAgICAgICAgICB2YXIgbXNnID0gdGhpc1tcIm5vdFwiICsgdi5jYXBpdGFsaXplKG5hbWUpXSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlICV7dHlwZX0gJXtjb3VudH1cIjtcblxuICAgICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KG1zZywge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgdHlwZTogdi5wcmV0dGlmeShuYW1lKVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5vZGQgJiYgdmFsdWUgJSAyICE9PSAxKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90T2RkIHx8IFwibXVzdCBiZSBvZGRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5ldmVuICYmIHZhbHVlICUgMiAhPT0gMCkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdEV2ZW4gfHwgXCJtdXN0IGJlIGV2ZW5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZXRpbWU6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW11cbiAgICAgICAgLCBlYXJsaWVzdCA9IG9wdGlvbnMuZWFybGllc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMuZWFybGllc3QsIG9wdGlvbnMpIDogTmFOXG4gICAgICAgICwgbGF0ZXN0ID0gb3B0aW9ucy5sYXRlc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMubGF0ZXN0LCBvcHRpb25zKSA6IE5hTjtcblxuICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlKHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgLy8gODY0MDAwMDAgaXMgdGhlIG51bWJlciBvZiBzZWNvbmRzIGluIGEgZGF5LCB0aGlzIGlzIHVzZWQgdG8gcmVtb3ZlXG4gICAgICAvLyB0aGUgdGltZSBmcm9tIHRoZSBkYXRlXG4gICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IG9wdGlvbnMuZGF0ZU9ubHkgJiYgdmFsdWUgJSA4NjQwMDAwMCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJtdXN0IGJlIGEgdmFsaWQgZGF0ZVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGVhcmxpZXN0KSAmJiB2YWx1ZSA8IGVhcmxpZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vRWFybHkgfHwgXCJtdXN0IGJlIG5vIGVhcmxpZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGVhcmxpZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGxhdGVzdCkgJiYgdmFsdWUgPiBsYXRlc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29MYXRlIHx8IFwibXVzdCBiZSBubyBsYXRlciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQobGF0ZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb252ZXJ0IGlucHV0IHRvIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIG1pbGxpcyBzaW5jZSB0aGUgZXBvY2guXG4gICAgICAvLyBJdCBzaG91bGQgcmV0dXJuIE5hTiBpZiBpdCdzIG5vdCBhIHZhbGlkIGRhdGUuXG4gICAgICBwYXJzZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgdi5YRGF0ZSh2YWx1ZSwgdHJ1ZSkuZ2V0VGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIHJldHVybiArdi5tb21lbnQudXRjKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH0sXG4gICAgICAvLyBGb3JtYXRzIHRoZSBnaXZlbiB0aW1lc3RhbXAuIFVzZXMgSVNPODYwMSB0byBmb3JtYXQgdGhlbS5cbiAgICAgIC8vIElmIG9wdGlvbnMuZGF0ZU9ubHkgaXMgdHJ1ZSB0aGVuIG9ubHkgdGhlIHllYXIsIG1vbnRoIGFuZCBkYXkgd2lsbCBiZVxuICAgICAgLy8gb3V0cHV0LlxuICAgICAgZm9ybWF0OiBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSBvcHRpb25zLmRhdGVGb3JtYXQ7XG5cbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwieXl5eS1NTS1kZFwiIDogXCJ5eXl5LU1NLWRkIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiBuZXcgWERhdGUoZGF0ZSwgdHJ1ZSkudG9TdHJpbmcoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcIllZWVktTU0tRERcIiA6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gdi5tb21lbnQudXRjKGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH0pLFxuICAgIGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIG9wdGlvbnMsIHtkYXRlT25seTogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHYudmFsaWRhdG9ycy5kYXRldGltZS5jYWxsKHYudmFsaWRhdG9ycy5kYXRldGltZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykgfHwgKG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7cGF0dGVybjogb3B0aW9uc307XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgaW52YWxpZFwiXG4gICAgICAgICwgcGF0dGVybiA9IG9wdGlvbnMucGF0dGVyblxuICAgICAgICAsIG1hdGNoO1xuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdGlvbnMucGF0dGVybiwgb3B0aW9ucy5mbGFncyk7XG4gICAgICB9XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyh2YWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoIHx8IG1hdGNoWzBdLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbmNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJeJXt2YWx1ZX0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0XCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZXhjbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICghdi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcIl4le3ZhbHVlfSBpcyByZXN0cmljdGVkXCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZW1haWw6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCBlbWFpbFwiO1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLlBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgUEFUVEVSTjogL15bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16XXsyLH0kL2lcbiAgICB9KSxcbiAgICBlcXVhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge2F0dHJpYnV0ZTogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJpcyBub3QgZXF1YWwgdG8gJXthdHRyaWJ1dGV9XCI7XG5cbiAgICAgIGlmICh2LmlzRW1wdHkob3B0aW9ucy5hdHRyaWJ1dGUpIHx8ICF2LmlzU3RyaW5nKG9wdGlvbnMuYXR0cmlidXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXR0cmlidXRlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3RoZXJWYWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlKVxuICAgICAgICAsIGNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3IgfHwgZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgICAgcmV0dXJuIHYxID09PSB2MjtcbiAgICAgICAgfTtcblxuICAgICAgaWYgKCFjb21wYXJhdG9yKHZhbHVlLCBvdGhlclZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7YXR0cmlidXRlOiB2LnByZXR0aWZ5KG9wdGlvbnMuYXR0cmlidXRlKX0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5leHBvc2VNb2R1bGUodmFsaWRhdGUsIHRoaXMsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKTtcbn0pLmNhbGwodGhpcyxcbiAgICAgICAgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZXhwb3J0cyA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbW9kdWxlIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBkZWZpbmUgOiBudWxsKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMyA0IDUgNiA3IDggOSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcImRlZmluZSBjYW5ub3QgYmUgdXNlZCBpbmRpcmVjdFwiKTsgfTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qc1xuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDMgNCA1IDYgNyA4IDkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXG4gICAgICAgIFEgPSByZXF1aXJlKCdxJyksXG4gICAgICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXG4gICAgICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxuXG4gICAgICAgIDtcblxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpO1xuXG52YXIgTXlib29raW5nRGF0YSA9IFN0b3JlLmV4dGVuZCh7XG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgcHJpY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZnJlc2hDdXJyZW50Q2FydDogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlZnJlc2hDdXJyZW50Q2FydFwiKTtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldENhcnREZXRhaWxzLycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdjdXJyZW50Q2FydElkJykpLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsIGVtYWlsOiBkYXRhLmVtYWlsLCB1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsIGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyZW5jeTogZGF0YS5jdXJlbmN5LCBmb3A6IGRhdGEuZm9wLCBiYXNlcHJpY2U6IGRhdGEuYmFzZXByaWNlLCB0YXhlczogZGF0YS50YXhlcywgY29udmZlZTogZGF0YS5jb252ZmVlLCBmZWU6IGRhdGEuZmVlLCB0b3RhbEFtb3VudGlud29yZHM6IGRhdGEudG90YWxBbW91bnRpbndvcmRzLCBjdXN0b21lcmNhcmU6IGRhdGEuY3VzdG9tZXJjYXJlLCBwcm9tb2Rpc2NvdW50OiBkYXRhLnByb21vX2Rpc2NvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdXBjb21pbmc6IGkudXBjb21pbmcsIHNvdXJjZV9pZDogaS5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBpLmRlc3RpbmF0aW9uX2lkLCBzb3VyY2U6IGkuc291cmNlLCBmbGlnaHR0aW1lOiBpLmZsaWdodHRpbWUsIGRlc3RpbmF0aW9uOiBpLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IGkuZGVwYXJ0dXJlLCBhcnJpdmFsOiBpLmFycml2YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBib29raW5naWQ6IHQuYm9va2luZ2lkLCBmYXJldHlwZTogdC5mYXJldHlwZSwgdGl0bGU6IHQudGl0bGUsIHR5cGU6IHQudHlwZSwgZmlyc3RfbmFtZTogdC5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHQubGFzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4scHJvZHVjdF9jbGFzczp0LnByb2R1Y3RfY2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLCBzdGF0dXNtc2c6IHQuc3RhdHVzbXNnLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm8uaWQsIG9yaWdpbjogcm8ub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiByby5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHJvLmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHJvLmRlcGFydHVyZSwgYXJyaXZhbDogcm8uYXJyaXZhbCwgY2Fycmllcjogcm8uY2FycmllciwgbG9nbzogcm8ubG9nbywgY2Fycmllck5hbWU6IHJvLmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHJvLmZsaWdodE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBvcmlnaW46IHQub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiB0Lm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogdC5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiB0LmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHQuZGVwYXJ0dXJlLCBhcnJpdmFsOiB0LmFycml2YWwsIGNhcnJpZXI6IHQuY2FycmllciwgY2Fycmllck5hbWU6IHQuY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogdC5mbGlnaHROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2N1cnJlbnRDYXJ0RGV0YWlscycsIGRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleCh2aWV3LmdldCgnY2FydHMnKSwgeydpZCc6IGRldGFpbHMuaWR9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4OiAnK2luZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FydHMgPSB2aWV3LmdldCgnY2FydHMnKTtcbiAgICAgICAgICAgICAgICAgICAgY2FydHNbaW5kZXhdLmJvb2tpbmdfc3RhdHVzID0gZGV0YWlscy5ib29raW5nX3N0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NhcnRzJywgY2FydHMpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VtbWFyeScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbnNpaGVkIHN0b3JlOiAnKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxuTXlib29raW5nRGF0YS5nZXRDdXJyZW50Q2FydCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0Q3VycmVudENhcnRcIik7XG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldENhcnREZXRhaWxzLycgKyBfLnBhcnNlSW50KGlkKSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YS5ib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtjb25zb2xlLmxvZyhpKTt9KSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkb25lXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB2YXIgZGV0YWlsczEgPSB7XG4gICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c291cmNlOiBpLnNvdXJjZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtvcmlnaW46IHJvLm9yaWdpbiwgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9ufTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7b3JpZ2luOiB0Lm9yaWdpbiwgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb259O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KX07XG4gICAgICAgICAgICB2YXIgb2JqX2xlbmd0aCA9IGRldGFpbHMxLmJvb2tpbmdzWzBdLnJvdXRlcy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgYWxsb3JpZ2lucyA9IFtdO1xuICAgICAgICAgICAgdmFyIGFsbGRlc3RpbmF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBvYmpfbGVuZ3RoOyBhKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWxsb3JpZ2lucy5wdXNoKGRldGFpbHMxLmJvb2tpbmdzWzBdLnJvdXRlc1thXS5vcmlnaW4pO1xuICAgICAgICAgICAgICAgIGFsbGRlc3RpbmF0aW9ucy5wdXNoKGRldGFpbHMxLmJvb2tpbmdzWzBdLnJvdXRlc1thXS5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxsZGVzdGluYXRpb25zLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhbGxvcmlnaW5zKTtjb25zb2xlLmxvZyhhbGxkZXN0aW5hdGlvbnMpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2Vfb25lID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBhbGxkZXN0aW5hdGlvbnMubGVuZ3RoOyBiKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFsbG9yaWdpbnNbYiArIDFdICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFsbG9yaWdpbnNbYisxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3JpZ2luc1tiICsgMV0gIT0gYWxsZGVzdGluYXRpb25zW2JdKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSBcIkFDXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlX29uZS5wdXNoKGFsbG9yaWdpbnNbYiArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2Vfb25lLnB1c2goYWxsZGVzdGluYXRpb25zW2JdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbXNnICE9PSBcInVuZGVmaW5lZFwiICYmIG1zZyA9PSBcIkFDXCIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIkFpcnBvcnQgQ2hhbmdlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG1zZyk7Y29uc29sZS5sb2coY2hhbmdlX29uZSk7XG4gICAgICAgICAgICB2YXIgZGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICBhaXJwb3J0X2NoYW5nZTogbWVzc2FnZSwgYWlycG9ydF9jaGFuZ2VfbmFtZTogY2hhbmdlX29uZSwgdHJhbnNpdDogZGF0YS50cmFuc2l0LFxuICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDogZGF0YS5lbWFpbCwgdGlja2V0c3RhdHVzbXNnOiBkYXRhLnRpY2tldHN0YXR1c21zZywgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBjbGllbnRTb3VyY2VJZDogZGF0YS5jbGllbnRTb3VyY2VJZCwgc2VnTmlnaHRzOiBkYXRhLnNlZ05pZ2h0cyxcbiAgICAgICAgICAgICAgICBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LCBmb3A6IGRhdGEuZm9wLCBiYXNlcHJpY2U6IGRhdGEuYmFzZXByaWNlLCB0YXhlczogZGF0YS50YXhlcywgY29udmZlZTogZGF0YS5jb252ZmVlLCBmZWU6IGRhdGEuZmVlLCB0b3RhbEFtb3VudGlud29yZHM6IGRhdGEudG90YWxBbW91bnRpbndvcmRzLCBjdXN0b21lcmNhcmU6IGRhdGEuY3VzdG9tZXJjYXJlLCBwcm9tb2Rpc2NvdW50OiBkYXRhLnByb21vX2Rpc2NvdW50LFxuICAgICAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChkYXRhLmJvb2tpbmdzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4scHJvZHVjdF9jbGFzczp0LnByb2R1Y3RfY2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2ljZmFyZTogdC5iYXNpY2ZhcmUsIHRheGVzOiB0LnRheGVzLCB0b3RhbDogdC50b3RhbCwgc3RhdHVzOiB0LnN0YXR1cywgc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKHQucm91dGVzLCBmdW5jdGlvbiAocm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgbG9nbzogcm8ubG9nbywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogcm8uZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHJvLm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiByby5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiByby5tZWFsLCBzZWF0OiByby5zZWF0LCBhaXJjcmFmdDogcm8uYWlyY3JhZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgbG9nbzogdC5sb2dvLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiB0LmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiB0Lm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiB0LmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHQubWVhbCwgc2VhdDogdC5zZWF0LCBhaXJjcmFmdDogdC5haXJjcmFmdCwgdGVjaFN0b3A6IHQudGVjaFN0b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoeCwgeSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSl9O1xuXG4gICAgICAgICAgICAvKkNIRUNLIEFJUlBPUlQgQ0hBTkdFIEFORCBHRVQqL1xuXG4gICAgICAgICAgICAvKkNIRUNLIEFJUlBPUlQgQ0hBTkdFIEFORCBHRVQqL1xuXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRDYXJ0RGV0YWlscyA9IGRldGFpbHM7XG5cbiAgICAgICAgICAgIGRhdGEuY2FydHMgPSBbXTtcbiAgICAgICAgICAgIGRhdGEuY2FydHMucHVzaChkZXRhaWxzKTtcbiAgICAgICAgICAgIGRhdGEuY2FiaW5UeXBlID0gMTtcbiAgICAgICAgICAgIGRhdGEuYWRkID0gZmFsc2U7XG4gICAgICAgICAgICBkYXRhLmVkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGRhdGEuY3VycmVudENhcnRJZCA9IGRldGFpbHMuaWQ7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEuY3VycmVudENhcnREZXRhaWxzKTtcbiAgICAgICAgICAgIGRhdGEuc3VtbWFyeSA9IGZhbHNlO1xuICAgICAgICAgICAgZGF0YS5wcmludCA9IGZhbHNlO1xuICAgICAgICAgICAgZGF0YS5wZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBkYXRhLmFtZW5kID0gZmFsc2U7XG4gICAgICAgICAgICBkYXRhLmNhbmNlbCA9IGZhbHNlO1xuICAgICAgICAgICAgZGF0YS5yZXNjaGVkdWxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGRhdGEuZXJyb3JzID0ge307XG4gICAgICAgICAgICBkYXRhLnJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgZGF0YS5maWx0ZXIgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG5ldyBNeWJvb2tpbmdEYXRhKHtkYXRhOiBkYXRhfSkpO1xuXG5cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pXG4gICAgfSk7XG59O1xuXG5NeWJvb2tpbmdEYXRhLnBhcnNlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiTXlib29raW5nRGF0YS5wYXJzZVwiKTtcbiAgICAvL2RhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gRmxpZ2h0LnBhcnNlKGkpOyB9KTtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpOyAgIFxuICAgIHZhciBmbGdVcGNvbWluZyA9IGZhbHNlO1xuICAgIHZhciBmbGdQcmV2aW91cyA9IGZhbHNlO1xuICAgIGRhdGEuY2FydHMgPSBfLm1hcChkYXRhLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICBpZiAoaS51cGNvbWluZyA9PSAndHJ1ZScpXG4gICAgICAgICAgICBmbGdVcGNvbWluZyA9IHRydWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZsZ1ByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgZW1haWw6IGkuZW1haWwsIGNyZWF0ZWQ6IGkuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGkudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBpLmJvb2tpbmdfc3RhdHVzLFxuICAgICAgICAgICAgcmV0dXJuZGF0ZTogaS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogaS5pc011bHRpQ2l0eSwgY3VyZW5jeTogaS5jdXJlbmN5LCB1cGNvbWluZzogaS51cGNvbWluZyxcbiAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChpLmJvb2tpbmdzLCBmdW5jdGlvbiAoYikge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGIuaWQsIHNvdXJjZTogYi5zb3VyY2UsIGRlc3RpbmF0aW9uOiBiLmRlc3RpbmF0aW9uLCBzb3VyY2VfaWQ6IGIuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogYi5kZXN0aW5hdGlvbl9pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlOiBiLmRlcGFydHVyZSwgYXJyaXZhbDogYi5hcnJpdmFsLFxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxlcnM6IF8ubWFwKGIudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogdC5pZCwgbmFtZTogdC5uYW1lfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0cmF2ZWxlcjogXy5tYXAoaS50cmF2ZWxsZXJkdGwsIGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogai5pZCwgbmFtZTogai5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBzcmM6IF8ubWFwKGouc3JjLCBmdW5jdGlvbiAoZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBnfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IF8ubWFwKGouZGVzdCwgZnVuY3Rpb24gKGcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZTogZ307XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICBkYXRhLmNhcnRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHguaWQgPCB5LmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH1cbiAgICAgICAgO1xuXG4gICAgfSk7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmNhcnRzKTsgIFxuICAgIC8vICAgICAgICAgIGRhdGEuY3VycmVudFRyYXZlbGxlcj0gXy5maXJzdChkYXRhLnRyYXZlbGxlcnMpO1xuICAgIC8vICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXJJZD1kYXRhLmN1cnJlbnRUcmF2ZWxsZXIuaWQ7XG4gICAgZGF0YS5jYWJpblR5cGUgPSAxO1xuICAgIGRhdGEuYWRkID0gZmFsc2U7XG4gICAgZGF0YS5lZGl0ID0gZmFsc2U7XG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gbnVsbDtcbiAgICBkYXRhLmN1cnJlbnRDYXJ0RGV0YWlscyA9IG51bGw7XG4gICAgZGF0YS5zdW1tYXJ5ID0gdHJ1ZTtcbiAgICBkYXRhLnBlbmRpbmcgPSB0cnVlO1xuICAgIGRhdGEuYW1lbmQgPSBmYWxzZTtcbiAgICBkYXRhLmNhbmNlbCA9IGZhbHNlO1xuICAgIGRhdGEucHJpbnQgPSBmYWxzZTtcbiAgICBkYXRhLnJlc2NoZWR1bGUgPSBmYWxzZTtcbiAgICBkYXRhLmZsZ1VwY29taW5nID0gZmxnVXBjb21pbmc7XG4gICAgZGF0YS5mbGdQcmV2aW91cyA9IGZsZ1ByZXZpb3VzO1xuICAgIGRhdGEuZXJyb3JzID0ge307XG4gICAgZGF0YS5yZXN1bHRzID0gW107XG5cbiAgICBkYXRhLmZpbHRlciA9IHt9O1xuICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcbiAgICByZXR1cm4gbmV3IE15Ym9va2luZ0RhdGEoe2RhdGE6IGRhdGF9KTtcblxufTtcbk15Ym9va2luZ0RhdGEuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIk15Ym9va2luZ0RhdGEuZmV0Y2hcIik7XG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9haXJDYXJ0L2dldE15Qm9va2luZ3MnKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoTXlib29raW5nRGF0YS5wYXJzZShkYXRhKSk7XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IE15Ym9va2luZ0RhdGE7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9zdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmpzXG4vLyBtb2R1bGUgaWQgPSA2NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSA2IDciLCIndXNlIHN0cmljdCc7XG5cbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSxcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICB2YWxpZGF0ZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICAgIDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdG9yZS5leHRlbmQoe1xuICAgIHF1ZW5lOiBbXSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGdldERhdGE9ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZ2V0RGF0YTE9ZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBkb2FqYXg9ZnVuY3Rpb24oZ2V0RGF0YSl7XG4gICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdXJsOiAnYjJjL3RyYXZlbGVyL2dldE15VHJhdmVsZXJzTGlzdCcsICBcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBnZXREYXRhLFxuICAgICAgICAgICAgICAgIGVycm9yOiBnZXREYXRhMVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcbiAgICAgICAgZG9hamF4KGdldERhdGEpO1xuICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVyOiB7aWQ6IDEsdGl0bGU6J01yLicsIGVtYWlsOiAncHJhc2hhbnRAZ21haWwuY29tJywgbW9iaWxlOiAnOTQxMjM1NzkyNicsICBmaXJzdF9uYW1lOiAnUHJhc2hhbnQnLCBcbiAgICAgICAgICAgICAgICBsYXN0X25hbWU6J0t1bWFyJyxiaXJ0aGRhdGU6JzIwMDEtMDUtMzAnLGJhc2VVcmw6JycscGFzc3BvcnRfbnVtYmVyOiczNDIxMjMnLHBhc3Nwb3J0X3BsYWNlOidJbmRpYSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVySWQ6MSxcbiAgICAgICAgICAgIGNhYmluVHlwZTogMSxcbiAgICAgICAgICAgIGFkZDpmYWxzZSxcbiAgICAgICAgICAgIGVkaXQ6ZmFsc2UsXG4gICAgICAgICAgICB0aXRsZXM6W3tpZDoxLHRleHQ6J01yLid9LHtpZDoyLHRleHQ6J01ycy4nfSx7aWQ6Myx0ZXh0OidNcy4nfSx7aWQ6NCx0ZXh0OidNaXNzJ30se2lkOjUsdGV4dDonTXN0ci4nfSx7aWQ6Nix0ZXh0OidJbmYuJ31dLFxuICAgICAgICAgICAgcGFzc2VuZ2VyczogWzEsIDAsIDBdLFxuICAgICAgICAgICAgdHJhdmVsbGVyczogW1xuICAgICAgICAgICAgICAgIHsgaWQ6IDEsdGl0bGU6J01yLicsIGVtYWlsOiAncHJhc2hhbnRAZ21haWwuY29tJywgbW9iaWxlOiAnOTQxMjM1NzkyNicscGFzc3BvcnRfbnVtYmVyOicyNTQyMzQyJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnLCBcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogJ1ByYXNoYW50JywgbGFzdF9uYW1lOidLdW1hcicsYmlydGhkYXRlOicyMDAxLTA1LTMwJyxiYXNlVXJsOicnfSxcbiAgICAgICAgICAgICAgICB7IGlkOiAyLHRpdGxlOidNci4nLCBlbWFpbDogJ01pY2hhZWxAZ21haWwuY29tJywgbW9iaWxlOiAnMTIzNDU2Nzg5MCcscGFzc3BvcnRfbnVtYmVyOiczMTIzMTIzJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnLCBcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogJ01pY2hhZWwnLCBsYXN0X25hbWU6J0phaW4nLGJpcnRoZGF0ZTonMjAwNS0wMy0wMycsYmFzZVVybDonJ30sXG4gICAgICAgICAgICAgICAgeyBpZDogMyx0aXRsZTonTXIuJywgZW1haWw6ICdiZWxhaXJAZ21haWwuY29tJywgbW9iaWxlOiAnMTIzNDU2Nzg5MCcscGFzc3BvcnRfbnVtYmVyOicxMjMxMjMxJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnLFxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnQmVsYWlyJywgbGFzdF9uYW1lOidUcmF2ZWxzJyxiaXJ0aGRhdGU6JzIwMDItMDItMjAnLGJhc2VVcmw6Jyd9XG4gICAgICAgICAgICBdLFxuXG4gICAgICAgICAgICBwZW5kaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yczoge30sXG4gICAgICAgICAgICByZXN1bHRzOiBbXSxcblxuICAgICAgICAgICAgZmlsdGVyOiB7fSxcbiAgICAgICAgICAgIGZpbHRlcmVkOiB7fSxcbiAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuICAgIGlmKHRoaXMuZ2V0KCkuYWRkKXsgICAgICAgIFxuICAgICAgICB2YXIgbmV3dHJhdmVsbGVyPV8ucGljayh0aGlzLmdldCgpLCAnY3VycmVudFRyYXZlbGxlcicpOyBcbiAgICAgICAgdmFyIHRyYXZlbGxlcnM9dGhpcy5nZXQoKS50cmF2ZWxsZXJzO1xuICAgICAgICB2YXIgdD1uZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci50aXRsZTtcbiAgICAgICAgdmFyIHRpdGxlcz1fLmNsb25lRGVlcCh0aGlzLmdldCgpLnRpdGxlcyk7XG4gICAgICAgIHZhciB0aXRsZTtcbiAgICAgICAgIF8uZWFjaCh0aXRsZXMsIGZ1bmN0aW9uKGksIGspIHsgaWYgKGkuaWQ9PXQpIHRpdGxlPWkudGV4dDsgfSk7XG4gICAgICBcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiA0LHRpdGxlOnRpdGxlLCBlbWFpbDogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZW1haWwsIG1vYmlsZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZmlyc3RfbmFtZSwgXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOm5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmxhc3RfbmFtZSxiaXJ0aGRhdGU6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuYmlydGhkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpLGJhc2VVcmw6JycscGFzc3BvcnRfbnVtYmVyOm5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnBhc3Nwb3J0X251bWJlcixwYXNzcG9ydF9wbGFjZTpuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5wYXNzcG9ydF9wbGFjZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGxlcnMpO1xuICAgICAgICB0aGlzLnNldCgndHJhdmVsbGVycycsdHJhdmVsbGVycyk7XG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxjdXJyZW50dHJhdmVsbGVyKTtcbiAgICAgICAgdGhpcy5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcsNCk7XG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5nZXQoKS5lZGl0KXtcbiAgICAgICAgdmFyIG5ld3RyYXZlbGxlcj10aGlzLmdldCgpLmN1cnJlbnRUcmF2ZWxsZXI7IFxuICAgICAgICB2YXIgdHJhdmVsbGVycz10aGlzLmdldCgpLnRyYXZlbGxlcnM7XG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci50aXRsZTtcbiAgICAgICAgdmFyIHRpdGxlcz1fLmNsb25lRGVlcCh0aGlzLmdldCgpLnRpdGxlcyk7XG4gICAgICAgIHZhciB0aXRsZTtcbiAgICAgICAgdmFyIGlkPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcklkO1xuICAgICAgICAgXy5lYWNoKHRpdGxlcywgZnVuY3Rpb24oaSwgaykgeyAvKmNvbnNvbGUubG9nKGkpOyovIGlmIChpLmlkPT10KSB0aXRsZT1pLnRleHQ7IH0pO1xuICAgICAgXG4gICAgICAgIHZhciBjdXJyZW50dHJhdmVsbGVyPXtpZDogaWQsdGl0bGU6dGl0bGUsIGVtYWlsOiBuZXd0cmF2ZWxsZXIuZW1haWwsIG1vYmlsZTogbmV3dHJhdmVsbGVyLm1vYmlsZSwgIGZpcnN0X25hbWU6IG5ld3RyYXZlbGxlci5maXJzdF9uYW1lLCBcbiAgICAgICAgICAgICAgICBsYXN0X25hbWU6bmV3dHJhdmVsbGVyLmxhc3RfbmFtZSxiaXJ0aGRhdGU6bmV3dHJhdmVsbGVyLmJpcnRoZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSxiYXNlVXJsOicnLHBhc3Nwb3J0X251bWJlcjpuZXd0cmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyLHBhc3Nwb3J0X3BsYWNlOm5ld3RyYXZlbGxlci5wYXNzcG9ydF9wbGFjZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgdmFyIGluZGV4PSBfLmZpbmRJbmRleCh0aGlzLmdldCgpLnRyYXZlbGxlcnMsIHsgJ2lkJzogaWR9KTtcbiAgICAgICAgdGhpcy5zcGxpY2UoJ3RyYXZlbGxlcnMnLCBpbmRleCwgMSk7XG4gICAgICAvLyAgY29uc29sZS5sb2coY3VycmVudHRyYXZlbGxlcik7XG4gICAgICAgIHRyYXZlbGxlcnMucHVzaChjdXJyZW50dHJhdmVsbGVyKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0cmF2ZWxsZXJzKTtcbiAgICAgICAgdGhpcy5zZXQoJ3RyYXZlbGxlcnMnLHRyYXZlbGxlcnMpO1xuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcicsY3VycmVudHRyYXZlbGxlcik7ICAgICAgICBcbiAgICB9XG4gICAgICAgIHRoaXMuc2V0KCdhZGQnLGZhbHNlKTsgXG4gICAgICAgIHRoaXMuc2V0KCdlZGl0JyxmYWxzZSk7IFxuICAgICAgICAvLyxcbiAgICAgLyogICAgICAgc2VhcmNoID0gXy5waWNrKHRoaXMuZ2V0KCksIFsndHJpcFR5cGUnLCAnY2FiaW5UeXBlJywgJ3Bhc3NlbmdlcnMnXSk7XG5cbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIHt9KTtcbiAgICAgICAgdGhpcy5zZXQoJ3BlbmRpbmcnLCB0cnVlKTtcbiAgICAgICAgdGhpcy5xdWVuZSA9IFtdO1xuXG5cbiAgICAgICAgXy5lYWNoKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKGksIGspIHtcbiAgICAgICAgICAgIHZpZXcucXVlbmVbdmlldy5xdWVuZS5sZW5ndGhdID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9mbGlnaHRzL3NlYXJjaCcsXG4gICAgICAgICAgICAgICAgZGF0YTogXy5leHRlbmQoe30sIHNlYXJjaCwge1xuICAgICAgICAgICAgICAgICAgICBmcm9tOiBpLmZyb20sXG4gICAgICAgICAgICAgICAgICAgIHRvOiBpLnRvLFxuICAgICAgICAgICAgICAgICAgICBkZXBhcnRfYXQ6IG1vbWVudC5pc01vbWVudChpLmRlcGFydF9hdCkgPyBpLmRlcGFydF9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHJldHVybl9hdDogbW9tZW50LmlzTW9tZW50KGkucmV0dXJuX2F0KSA/IGkucmV0dXJuX2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyB2aWV3LmltcG9ydFJlc3VsdHMoaywgZGF0YSk7IH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikgeyB2aWV3LmhhbmRsZUVycm9yKGssIHhocik7IH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQud2hlbi5hcHBseSh1bmRlZmluZWQsIHRoaXMucXVlbmUpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbigpIHsgdmlldy5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7IHZpZXcuc2V0KCdmaW5pc2hlZCcsIHRydWUpOyB9KTsgKi9cbiAgICB9LFxuXG4gICAgaW1wb3J0UmVzdWx0czogZnVuY3Rpb24oaywgZGF0YSkge1xuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQnLCB7fSk7XG4gICAgICAgIHRoaXMuc2V0KCdyZXN1bHRzLicgKyBrLCBkYXRhKTtcblxuICAgICAgICB2YXIgcHJpY2VzID0gW10sXG4gICAgICAgICAgICBjYXJyaWVycyA9IFtdO1xuXG4gICAgICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICBwcmljZXNbcHJpY2VzLmxlbmd0aF0gPSBpLnByaWNlO1xuICAgICAgICAgICAgY2FycmllcnNbY2FycmllcnMubGVuZ3RoXSA9IGkuaXRpbmVyYXJ5WzBdLnNlZ21lbnRzWzBdLmNhcnJpZXI7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgY2FycmllcnMgPSBfLnVuaXF1ZShjYXJyaWVycywgJ2NvZGUnKTtcblxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyJywge1xuICAgICAgICAgICAgcHJpY2VzOiBbTWF0aC5taW4uYXBwbHkobnVsbCwgcHJpY2VzKSwgTWF0aC5tYXguYXBwbHkobnVsbCwgcHJpY2VzKV0sXG4gICAgICAgICAgICBjYXJyaWVyczogY2FycmllcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZXQoJ2ZpbHRlcmVkLmNhcnJpZXJzJywgXy5tYXAoY2FycmllcnMsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIGkuY29kZTsgfSkpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVFcnJvcjogZnVuY3Rpb24oaywgeGhyKSB7XG5cbiAgICB9XG5cblxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCA1IDYgOSIsIi8qIVxuICogYWNjb3VudGluZy5qcyB2MC4zLjJcbiAqIENvcHlyaWdodCAyMDExLCBKb3NzIENyb3djcm9mdFxuICpcbiAqIEZyZWVseSBkaXN0cmlidXRhYmxlIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIFBvcnRpb25zIG9mIGFjY291bnRpbmcuanMgYXJlIGluc3BpcmVkIG9yIGJvcnJvd2VkIGZyb20gdW5kZXJzY29yZS5qc1xuICpcbiAqIEZ1bGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbiAqIGh0dHA6Ly9qb3NzY3Jvd2Nyb2Z0LmdpdGh1Yi5jb20vYWNjb3VudGluZy5qcy9cbiAqL1xuXG4oZnVuY3Rpb24ocm9vdCwgdW5kZWZpbmVkKSB7XG5cblx0LyogLS0tIFNldHVwIC0tLSAqL1xuXG5cdC8vIENyZWF0ZSB0aGUgbG9jYWwgbGlicmFyeSBvYmplY3QsIHRvIGJlIGV4cG9ydGVkIG9yIHJlZmVyZW5jZWQgZ2xvYmFsbHkgbGF0ZXJcblx0dmFyIGxpYiA9IHt9O1xuXG5cdC8vIEN1cnJlbnQgdmVyc2lvblxuXHRsaWIudmVyc2lvbiA9ICcwLjMuMic7XG5cblxuXHQvKiAtLS0gRXhwb3NlZCBzZXR0aW5ncyAtLS0gKi9cblxuXHQvLyBUaGUgbGlicmFyeSdzIHNldHRpbmdzIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBDb250YWlucyBkZWZhdWx0IHBhcmFtZXRlcnMgZm9yXG5cdC8vIGN1cnJlbmN5IGFuZCBudW1iZXIgZm9ybWF0dGluZ1xuXHRsaWIuc2V0dGluZ3MgPSB7XG5cdFx0Y3VycmVuY3k6IHtcblx0XHRcdHN5bWJvbCA6IFwiJFwiLFx0XHQvLyBkZWZhdWx0IGN1cnJlbmN5IHN5bWJvbCBpcyAnJCdcblx0XHRcdGZvcm1hdCA6IFwiJXMldlwiLFx0Ly8gY29udHJvbHMgb3V0cHV0OiAlcyA9IHN5bWJvbCwgJXYgPSB2YWx1ZSAoY2FuIGJlIG9iamVjdCwgc2VlIGRvY3MpXG5cdFx0XHRkZWNpbWFsIDogXCIuXCIsXHRcdC8vIGRlY2ltYWwgcG9pbnQgc2VwYXJhdG9yXG5cdFx0XHR0aG91c2FuZCA6IFwiLFwiLFx0XHQvLyB0aG91c2FuZHMgc2VwYXJhdG9yXG5cdFx0XHRwcmVjaXNpb24gOiAyLFx0XHQvLyBkZWNpbWFsIHBsYWNlc1xuXHRcdFx0Z3JvdXBpbmcgOiAzXHRcdC8vIGRpZ2l0IGdyb3VwaW5nIChub3QgaW1wbGVtZW50ZWQgeWV0KVxuXHRcdH0sXG5cdFx0bnVtYmVyOiB7XG5cdFx0XHRwcmVjaXNpb24gOiAwLFx0XHQvLyBkZWZhdWx0IHByZWNpc2lvbiBvbiBudW1iZXJzIGlzIDBcblx0XHRcdGdyb3VwaW5nIDogMyxcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0XHR0aG91c2FuZCA6IFwiLFwiLFxuXHRcdFx0ZGVjaW1hbCA6IFwiLlwiXG5cdFx0fVxuXHR9O1xuXG5cblx0LyogLS0tIEludGVybmFsIEhlbHBlciBNZXRob2RzIC0tLSAqL1xuXG5cdC8vIFN0b3JlIHJlZmVyZW5jZSB0byBwb3NzaWJseS1hdmFpbGFibGUgRUNNQVNjcmlwdCA1IG1ldGhvZHMgZm9yIGxhdGVyXG5cdHZhciBuYXRpdmVNYXAgPSBBcnJheS5wcm90b3R5cGUubWFwLFxuXHRcdG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5LFxuXHRcdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSBzdHJpbmdcblx0ICogZnJvbSB1bmRlcnNjb3JlLmpzXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcblx0XHRyZXR1cm4gISEob2JqID09PSAnJyB8fCAob2JqICYmIG9iai5jaGFyQ29kZUF0ICYmIG9iai5zdWJzdHIpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanMsIGRlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuXHRcdHJldHVybiBuYXRpdmVJc0FycmF5ID8gbmF0aXZlSXNBcnJheShvYmopIDogdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgdHJ1ZSBvYmplY3Rcblx0ICovXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuXHRcdHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4dGVuZHMgYW4gb2JqZWN0IHdpdGggYSBkZWZhdWx0cyBvYmplY3QsIHNpbWlsYXIgdG8gdW5kZXJzY29yZSdzIF8uZGVmYXVsdHNcblx0ICpcblx0ICogVXNlZCBmb3IgYWJzdHJhY3RpbmcgcGFyYW1ldGVyIGhhbmRsaW5nIGZyb20gQVBJIG1ldGhvZHNcblx0ICovXG5cdGZ1bmN0aW9uIGRlZmF1bHRzKG9iamVjdCwgZGVmcykge1xuXHRcdHZhciBrZXk7XG5cdFx0b2JqZWN0ID0gb2JqZWN0IHx8IHt9O1xuXHRcdGRlZnMgPSBkZWZzIHx8IHt9O1xuXHRcdC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qgbm9uLXByb3RvdHlwZSBwcm9wZXJ0aWVzOlxuXHRcdGZvciAoa2V5IGluIGRlZnMpIHtcblx0XHRcdGlmIChkZWZzLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0Ly8gUmVwbGFjZSB2YWx1ZXMgd2l0aCBkZWZhdWx0cyBvbmx5IGlmIHVuZGVmaW5lZCAoYWxsb3cgZW1wdHkvemVybyB2YWx1ZXMpOlxuXHRcdFx0XHRpZiAob2JqZWN0W2tleV0gPT0gbnVsbCkgb2JqZWN0W2tleV0gPSBkZWZzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvYmplY3Q7XG5cdH1cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgYEFycmF5Lm1hcCgpYCBmb3IgaXRlcmF0aW9uIGxvb3BzXG5cdCAqXG5cdCAqIFJldHVybnMgYSBuZXcgQXJyYXkgYXMgYSByZXN1bHQgb2YgY2FsbGluZyBgaXRlcmF0b3JgIG9uIGVhY2ggYXJyYXkgdmFsdWUuXG5cdCAqIERlZmVycyB0byBuYXRpdmUgQXJyYXkubWFwIGlmIGF2YWlsYWJsZVxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcblx0XHR2YXIgcmVzdWx0cyA9IFtdLCBpLCBqO1xuXG5cdFx0aWYgKCFvYmopIHJldHVybiByZXN1bHRzO1xuXG5cdFx0Ly8gVXNlIG5hdGl2ZSAubWFwIG1ldGhvZCBpZiBpdCBleGlzdHM6XG5cdFx0aWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcblxuXHRcdC8vIEZhbGxiYWNrIGZvciBuYXRpdmUgLm1hcDpcblx0XHRmb3IgKGkgPSAwLCBqID0gb2JqLmxlbmd0aDsgaSA8IGo7IGkrKyApIHtcblx0XHRcdHJlc3VsdHNbaV0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgYW5kIG5vcm1hbGlzZSB0aGUgdmFsdWUgb2YgcHJlY2lzaW9uIChtdXN0IGJlIHBvc2l0aXZlIGludGVnZXIpXG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja1ByZWNpc2lvbih2YWwsIGJhc2UpIHtcblx0XHR2YWwgPSBNYXRoLnJvdW5kKE1hdGguYWJzKHZhbCkpO1xuXHRcdHJldHVybiBpc05hTih2YWwpPyBiYXNlIDogdmFsO1xuXHR9XG5cblxuXHQvKipcblx0ICogUGFyc2VzIGEgZm9ybWF0IHN0cmluZyBvciBvYmplY3QgYW5kIHJldHVybnMgZm9ybWF0IG9iaiBmb3IgdXNlIGluIHJlbmRlcmluZ1xuXHQgKlxuXHQgKiBgZm9ybWF0YCBpcyBlaXRoZXIgYSBzdHJpbmcgd2l0aCB0aGUgZGVmYXVsdCAocG9zaXRpdmUpIGZvcm1hdCwgb3Igb2JqZWN0XG5cdCAqIGNvbnRhaW5pbmcgYHBvc2AgKHJlcXVpcmVkKSwgYG5lZ2AgYW5kIGB6ZXJvYCB2YWx1ZXMgKG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nXG5cdCAqIGVpdGhlciBhIHN0cmluZyBvciBvYmplY3QpXG5cdCAqXG5cdCAqIEVpdGhlciBzdHJpbmcgb3IgZm9ybWF0LnBvcyBtdXN0IGNvbnRhaW4gXCIldlwiICh2YWx1ZSkgdG8gYmUgdmFsaWRcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrQ3VycmVuY3lGb3JtYXQoZm9ybWF0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gbGliLnNldHRpbmdzLmN1cnJlbmN5LmZvcm1hdDtcblxuXHRcdC8vIEFsbG93IGZ1bmN0aW9uIGFzIGZvcm1hdCBwYXJhbWV0ZXIgKHNob3VsZCByZXR1cm4gc3RyaW5nIG9yIG9iamVjdCk6XG5cdFx0aWYgKCB0eXBlb2YgZm9ybWF0ID09PSBcImZ1bmN0aW9uXCIgKSBmb3JtYXQgPSBmb3JtYXQoKTtcblxuXHRcdC8vIEZvcm1hdCBjYW4gYmUgYSBzdHJpbmcsIGluIHdoaWNoIGNhc2UgYHZhbHVlYCAoXCIldlwiKSBtdXN0IGJlIHByZXNlbnQ6XG5cdFx0aWYgKCBpc1N0cmluZyggZm9ybWF0ICkgJiYgZm9ybWF0Lm1hdGNoKFwiJXZcIikgKSB7XG5cblx0XHRcdC8vIENyZWF0ZSBhbmQgcmV0dXJuIHBvc2l0aXZlLCBuZWdhdGl2ZSBhbmQgemVybyBmb3JtYXRzOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cG9zIDogZm9ybWF0LFxuXHRcdFx0XHRuZWcgOiBmb3JtYXQucmVwbGFjZShcIi1cIiwgXCJcIikucmVwbGFjZShcIiV2XCIsIFwiLSV2XCIpLFxuXHRcdFx0XHR6ZXJvIDogZm9ybWF0XG5cdFx0XHR9O1xuXG5cdFx0Ly8gSWYgbm8gZm9ybWF0LCBvciBvYmplY3QgaXMgbWlzc2luZyB2YWxpZCBwb3NpdGl2ZSB2YWx1ZSwgdXNlIGRlZmF1bHRzOlxuXHRcdH0gZWxzZSBpZiAoICFmb3JtYXQgfHwgIWZvcm1hdC5wb3MgfHwgIWZvcm1hdC5wb3MubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gSWYgZGVmYXVsdHMgaXMgYSBzdHJpbmcsIGNhc3RzIGl0IHRvIGFuIG9iamVjdCBmb3IgZmFzdGVyIGNoZWNraW5nIG5leHQgdGltZTpcblx0XHRcdHJldHVybiAoICFpc1N0cmluZyggZGVmYXVsdHMgKSApID8gZGVmYXVsdHMgOiBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0ID0ge1xuXHRcdFx0XHRwb3MgOiBkZWZhdWx0cyxcblx0XHRcdFx0bmVnIDogZGVmYXVsdHMucmVwbGFjZShcIiV2XCIsIFwiLSV2XCIpLFxuXHRcdFx0XHR6ZXJvIDogZGVmYXVsdHNcblx0XHRcdH07XG5cblx0XHR9XG5cdFx0Ly8gT3RoZXJ3aXNlLCBhc3N1bWUgZm9ybWF0IHdhcyBmaW5lOlxuXHRcdHJldHVybiBmb3JtYXQ7XG5cdH1cblxuXG5cdC8qIC0tLSBBUEkgTWV0aG9kcyAtLS0gKi9cblxuXHQvKipcblx0ICogVGFrZXMgYSBzdHJpbmcvYXJyYXkgb2Ygc3RyaW5ncywgcmVtb3ZlcyBhbGwgZm9ybWF0dGluZy9jcnVmdCBhbmQgcmV0dXJucyB0aGUgcmF3IGZsb2F0IHZhbHVlXG5cdCAqIGFsaWFzOiBhY2NvdW50aW5nLmBwYXJzZShzdHJpbmcpYFxuXHQgKlxuXHQgKiBEZWNpbWFsIG11c3QgYmUgaW5jbHVkZWQgaW4gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBmbG9hdHMgKGRlZmF1bHQ6IFwiLlwiKSwgc28gaWYgdGhlIG51bWJlclxuXHQgKiB1c2VzIGEgbm9uLXN0YW5kYXJkIGRlY2ltYWwgc2VwYXJhdG9yLCBwcm92aWRlIGl0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdCAqXG5cdCAqIEFsc28gbWF0Y2hlcyBicmFja2V0ZWQgbmVnYXRpdmVzIChlZy4gXCIkICgxLjk5KVwiID0+IC0xLjk5KVxuXHQgKlxuXHQgKiBEb2Vzbid0IHRocm93IGFueSBlcnJvcnMgKGBOYU5gcyBiZWNvbWUgMCkgYnV0IHRoaXMgbWF5IGNoYW5nZSBpbiBmdXR1cmVcblx0ICovXG5cdHZhciB1bmZvcm1hdCA9IGxpYi51bmZvcm1hdCA9IGxpYi5wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVjdXJzaXZlbHkgdW5mb3JtYXQgYXJyYXlzOlxuXHRcdGlmIChpc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIG1hcCh2YWx1ZSwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiB1bmZvcm1hdCh2YWwsIGRlY2ltYWwpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gRmFpbHMgc2lsZW50bHkgKG5lZWQgZGVjZW50IGVycm9ycyk6XG5cdFx0dmFsdWUgPSB2YWx1ZSB8fCAwO1xuXG5cdFx0Ly8gUmV0dXJuIHRoZSB2YWx1ZSBhcy1pcyBpZiBpdCdzIGFscmVhZHkgYSBudW1iZXI6XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHZhbHVlO1xuXG5cdFx0Ly8gRGVmYXVsdCBkZWNpbWFsIHBvaW50IGlzIFwiLlwiIGJ1dCBjb3VsZCBiZSBzZXQgdG8gZWcuIFwiLFwiIGluIG9wdHM6XG5cdFx0ZGVjaW1hbCA9IGRlY2ltYWwgfHwgXCIuXCI7XG5cblx0XHQgLy8gQnVpbGQgcmVnZXggdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgZXhjZXB0IGRpZ2l0cywgZGVjaW1hbCBwb2ludCBhbmQgbWludXMgc2lnbjpcblx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiW14wLTktXCIgKyBkZWNpbWFsICsgXCJdXCIsIFtcImdcIl0pLFxuXHRcdFx0dW5mb3JtYXR0ZWQgPSBwYXJzZUZsb2F0KFxuXHRcdFx0XHQoXCJcIiArIHZhbHVlKVxuXHRcdFx0XHQucmVwbGFjZSgvXFwoKC4qKVxcKS8sIFwiLSQxXCIpIC8vIHJlcGxhY2UgYnJhY2tldGVkIHZhbHVlcyB3aXRoIG5lZ2F0aXZlc1xuXHRcdFx0XHQucmVwbGFjZShyZWdleCwgJycpICAgICAgICAgLy8gc3RyaXAgb3V0IGFueSBjcnVmdFxuXHRcdFx0XHQucmVwbGFjZShkZWNpbWFsLCAnLicpICAgICAgLy8gbWFrZSBzdXJlIGRlY2ltYWwgcG9pbnQgaXMgc3RhbmRhcmRcblx0XHRcdCk7XG5cblx0XHQvLyBUaGlzIHdpbGwgZmFpbCBzaWxlbnRseSB3aGljaCBtYXkgY2F1c2UgdHJvdWJsZSwgbGV0J3Mgd2FpdCBhbmQgc2VlOlxuXHRcdHJldHVybiAhaXNOYU4odW5mb3JtYXR0ZWQpID8gdW5mb3JtYXR0ZWQgOiAwO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEltcGxlbWVudGF0aW9uIG9mIHRvRml4ZWQoKSB0aGF0IHRyZWF0cyBmbG9hdHMgbW9yZSBsaWtlIGRlY2ltYWxzXG5cdCAqXG5cdCAqIEZpeGVzIGJpbmFyeSByb3VuZGluZyBpc3N1ZXMgKGVnLiAoMC42MTUpLnRvRml4ZWQoMikgPT09IFwiMC42MVwiKSB0aGF0IHByZXNlbnRcblx0ICogcHJvYmxlbXMgZm9yIGFjY291bnRpbmctIGFuZCBmaW5hbmNlLXJlbGF0ZWQgc29mdHdhcmUuXG5cdCAqL1xuXHR2YXIgdG9GaXhlZCA9IGxpYi50b0ZpeGVkID0gZnVuY3Rpb24odmFsdWUsIHByZWNpc2lvbikge1xuXHRcdHByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKHByZWNpc2lvbiwgbGliLnNldHRpbmdzLm51bWJlci5wcmVjaXNpb24pO1xuXHRcdHZhciBwb3dlciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuXG5cdFx0Ly8gTXVsdGlwbHkgdXAgYnkgcHJlY2lzaW9uLCByb3VuZCBhY2N1cmF0ZWx5LCB0aGVuIGRpdmlkZSBhbmQgdXNlIG5hdGl2ZSB0b0ZpeGVkKCk6XG5cdFx0cmV0dXJuIChNYXRoLnJvdW5kKGxpYi51bmZvcm1hdCh2YWx1ZSkgKiBwb3dlcikgLyBwb3dlcikudG9GaXhlZChwcmVjaXNpb24pO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEZvcm1hdCBhIG51bWJlciwgd2l0aCBjb21tYS1zZXBhcmF0ZWQgdGhvdXNhbmRzIGFuZCBjdXN0b20gcHJlY2lzaW9uL2RlY2ltYWwgcGxhY2VzXG5cdCAqXG5cdCAqIExvY2FsaXNlIGJ5IG92ZXJyaWRpbmcgdGhlIHByZWNpc2lvbiBhbmQgdGhvdXNhbmQgLyBkZWNpbWFsIHNlcGFyYXRvcnNcblx0ICogMm5kIHBhcmFtZXRlciBgcHJlY2lzaW9uYCBjYW4gYmUgYW4gb2JqZWN0IG1hdGNoaW5nIGBzZXR0aW5ncy5udW1iZXJgXG5cdCAqL1xuXHR2YXIgZm9ybWF0TnVtYmVyID0gbGliLmZvcm1hdE51bWJlciA9IGZ1bmN0aW9uKG51bWJlciwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCkge1xuXHRcdC8vIFJlc3Vyc2l2ZWx5IGZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkobnVtYmVyKSkge1xuXHRcdFx0cmV0dXJuIG1hcChudW1iZXIsIGZ1bmN0aW9uKHZhbCkge1xuXHRcdFx0XHRyZXR1cm4gZm9ybWF0TnVtYmVyKHZhbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBDbGVhbiB1cCBudW1iZXI6XG5cdFx0bnVtYmVyID0gdW5mb3JtYXQobnVtYmVyKTtcblxuXHRcdC8vIEJ1aWxkIG9wdGlvbnMgb2JqZWN0IGZyb20gc2Vjb25kIHBhcmFtIChpZiBvYmplY3QpIG9yIGFsbCBwYXJhbXMsIGV4dGVuZGluZyBkZWZhdWx0czpcblx0XHR2YXIgb3B0cyA9IGRlZmF1bHRzKFxuXHRcdFx0XHQoaXNPYmplY3QocHJlY2lzaW9uKSA/IHByZWNpc2lvbiA6IHtcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLm51bWJlclxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgcHJlY2lzaW9uXG5cdFx0XHR1c2VQcmVjaXNpb24gPSBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksXG5cblx0XHRcdC8vIERvIHNvbWUgY2FsYzpcblx0XHRcdG5lZ2F0aXZlID0gbnVtYmVyIDwgMCA/IFwiLVwiIDogXCJcIixcblx0XHRcdGJhc2UgPSBwYXJzZUludCh0b0ZpeGVkKE1hdGguYWJzKG51bWJlciB8fCAwKSwgdXNlUHJlY2lzaW9uKSwgMTApICsgXCJcIixcblx0XHRcdG1vZCA9IGJhc2UubGVuZ3RoID4gMyA/IGJhc2UubGVuZ3RoICUgMyA6IDA7XG5cblx0XHQvLyBGb3JtYXQgdGhlIG51bWJlcjpcblx0XHRyZXR1cm4gbmVnYXRpdmUgKyAobW9kID8gYmFzZS5zdWJzdHIoMCwgbW9kKSArIG9wdHMudGhvdXNhbmQgOiBcIlwiKSArIGJhc2Uuc3Vic3RyKG1vZCkucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csIFwiJDFcIiArIG9wdHMudGhvdXNhbmQpICsgKHVzZVByZWNpc2lvbiA/IG9wdHMuZGVjaW1hbCArIHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyKSwgdXNlUHJlY2lzaW9uKS5zcGxpdCgnLicpWzFdIDogXCJcIik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyIGludG8gY3VycmVuY3lcblx0ICpcblx0ICogVXNhZ2U6IGFjY291bnRpbmcuZm9ybWF0TW9uZXkobnVtYmVyLCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmRzU2VwLCBkZWNpbWFsU2VwLCBmb3JtYXQpXG5cdCAqIGRlZmF1bHRzOiAoMCwgXCIkXCIsIDIsIFwiLFwiLCBcIi5cIiwgXCIlcyV2XCIpXG5cdCAqXG5cdCAqIExvY2FsaXNlIGJ5IG92ZXJyaWRpbmcgdGhlIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9ycyBhbmQgZm9ybWF0XG5cdCAqIFNlY29uZCBwYXJhbSBjYW4gYmUgYW4gb2JqZWN0IG1hdGNoaW5nIGBzZXR0aW5ncy5jdXJyZW5jeWAgd2hpY2ggaXMgdGhlIGVhc2llc3Qgd2F5LlxuXHQgKlxuXHQgKiBUbyBkbzogdGlkeSB1cCB0aGUgcGFyYW1ldGVyc1xuXHQgKi9cblx0dmFyIGZvcm1hdE1vbmV5ID0gbGliLmZvcm1hdE1vbmV5ID0gZnVuY3Rpb24obnVtYmVyLCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwsIGZvcm1hdCkge1xuXHRcdC8vIFJlc3Vyc2l2ZWx5IGZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkobnVtYmVyKSkge1xuXHRcdFx0cmV0dXJuIG1hcChudW1iZXIsIGZ1bmN0aW9uKHZhbCl7XG5cdFx0XHRcdHJldHVybiBmb3JtYXRNb25leSh2YWwsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChzeW1ib2wpID8gc3ltYm9sIDoge1xuXHRcdFx0XHRcdHN5bWJvbCA6IHN5bWJvbCxcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbCxcblx0XHRcdFx0XHRmb3JtYXQgOiBmb3JtYXRcblx0XHRcdFx0fSksXG5cdFx0XHRcdGxpYi5zZXR0aW5ncy5jdXJyZW5jeVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2hlY2sgZm9ybWF0IChyZXR1cm5zIG9iamVjdCB3aXRoIHBvcywgbmVnIGFuZCB6ZXJvKTpcblx0XHRcdGZvcm1hdHMgPSBjaGVja0N1cnJlbmN5Rm9ybWF0KG9wdHMuZm9ybWF0KSxcblxuXHRcdFx0Ly8gQ2hvb3NlIHdoaWNoIGZvcm1hdCB0byB1c2UgZm9yIHRoaXMgdmFsdWU6XG5cdFx0XHR1c2VGb3JtYXQgPSBudW1iZXIgPiAwID8gZm9ybWF0cy5wb3MgOiBudW1iZXIgPCAwID8gZm9ybWF0cy5uZWcgOiBmb3JtYXRzLnplcm87XG5cblx0XHQvLyBSZXR1cm4gd2l0aCBjdXJyZW5jeSBzeW1ib2wgYWRkZWQ6XG5cdFx0cmV0dXJuIHVzZUZvcm1hdC5yZXBsYWNlKCclcycsIG9wdHMuc3ltYm9sKS5yZXBsYWNlKCcldicsIGZvcm1hdE51bWJlcihNYXRoLmFicyhudW1iZXIpLCBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksIG9wdHMudGhvdXNhbmQsIG9wdHMuZGVjaW1hbCkpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEZvcm1hdCBhIGxpc3Qgb2YgbnVtYmVycyBpbnRvIGFuIGFjY291bnRpbmcgY29sdW1uLCBwYWRkaW5nIHdpdGggd2hpdGVzcGFjZVxuXHQgKiB0byBsaW5lIHVwIGN1cnJlbmN5IHN5bWJvbHMsIHRob3VzYW5kIHNlcGFyYXRvcnMgYW5kIGRlY2ltYWxzIHBsYWNlc1xuXHQgKlxuXHQgKiBMaXN0IHNob3VsZCBiZSBhbiBhcnJheSBvZiBudW1iZXJzXG5cdCAqIFNlY29uZCBwYXJhbWV0ZXIgY2FuIGJlIGFuIG9iamVjdCBjb250YWluaW5nIGtleXMgdGhhdCBtYXRjaCB0aGUgcGFyYW1zXG5cdCAqXG5cdCAqIFJldHVybnMgYXJyYXkgb2YgYWNjb3V0aW5nLWZvcm1hdHRlZCBudW1iZXIgc3RyaW5ncyBvZiBzYW1lIGxlbmd0aFxuXHQgKlxuXHQgKiBOQjogYHdoaXRlLXNwYWNlOnByZWAgQ1NTIHJ1bGUgaXMgcmVxdWlyZWQgb24gdGhlIGxpc3QgY29udGFpbmVyIHRvIHByZXZlbnRcblx0ICogYnJvd3NlcnMgZnJvbSBjb2xsYXBzaW5nIHRoZSB3aGl0ZXNwYWNlIGluIHRoZSBvdXRwdXQgc3RyaW5ncy5cblx0ICovXG5cdGxpYi5mb3JtYXRDb2x1bW4gPSBmdW5jdGlvbihsaXN0LCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwsIGZvcm1hdCkge1xuXHRcdGlmICghbGlzdCkgcmV0dXJuIFtdO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChzeW1ib2wpID8gc3ltYm9sIDoge1xuXHRcdFx0XHRcdHN5bWJvbCA6IHN5bWJvbCxcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbCxcblx0XHRcdFx0XHRmb3JtYXQgOiBmb3JtYXRcblx0XHRcdFx0fSksXG5cdFx0XHRcdGxpYi5zZXR0aW5ncy5jdXJyZW5jeVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2hlY2sgZm9ybWF0IChyZXR1cm5zIG9iamVjdCB3aXRoIHBvcywgbmVnIGFuZCB6ZXJvKSwgb25seSBuZWVkIHBvcyBmb3Igbm93OlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBXaGV0aGVyIHRvIHBhZCBhdCBzdGFydCBvZiBzdHJpbmcgb3IgYWZ0ZXIgY3VycmVuY3kgc3ltYm9sOlxuXHRcdFx0cGFkQWZ0ZXJTeW1ib2wgPSBmb3JtYXRzLnBvcy5pbmRleE9mKFwiJXNcIikgPCBmb3JtYXRzLnBvcy5pbmRleE9mKFwiJXZcIikgPyB0cnVlIDogZmFsc2UsXG5cblx0XHRcdC8vIFN0b3JlIHZhbHVlIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IHN0cmluZyBpbiB0aGUgY29sdW1uOlxuXHRcdFx0bWF4TGVuZ3RoID0gMCxcblxuXHRcdFx0Ly8gRm9ybWF0IHRoZSBsaXN0IGFjY29yZGluZyB0byBvcHRpb25zLCBzdG9yZSB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IHN0cmluZzpcblx0XHRcdGZvcm1hdHRlZCA9IG1hcChsaXN0LCBmdW5jdGlvbih2YWwsIGkpIHtcblx0XHRcdFx0aWYgKGlzQXJyYXkodmFsKSkge1xuXHRcdFx0XHRcdC8vIFJlY3Vyc2l2ZWx5IGZvcm1hdCBjb2x1bW5zIGlmIGxpc3QgaXMgYSBtdWx0aS1kaW1lbnNpb25hbCBhcnJheTpcblx0XHRcdFx0XHRyZXR1cm4gbGliLmZvcm1hdENvbHVtbih2YWwsIG9wdHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIENsZWFuIHVwIHRoZSB2YWx1ZVxuXHRcdFx0XHRcdHZhbCA9IHVuZm9ybWF0KHZhbCk7XG5cblx0XHRcdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZSAocG9zLCBuZWcgb3IgemVybyk6XG5cdFx0XHRcdFx0dmFyIHVzZUZvcm1hdCA9IHZhbCA+IDAgPyBmb3JtYXRzLnBvcyA6IHZhbCA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybyxcblxuXHRcdFx0XHRcdFx0Ly8gRm9ybWF0IHRoaXMgdmFsdWUsIHB1c2ggaW50byBmb3JtYXR0ZWQgbGlzdCBhbmQgc2F2ZSB0aGUgbGVuZ3RoOlxuXHRcdFx0XHRcdFx0ZlZhbCA9IHVzZUZvcm1hdC5yZXBsYWNlKCclcycsIG9wdHMuc3ltYm9sKS5yZXBsYWNlKCcldicsIGZvcm1hdE51bWJlcihNYXRoLmFicyh2YWwpLCBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksIG9wdHMudGhvdXNhbmQsIG9wdHMuZGVjaW1hbCkpO1xuXG5cdFx0XHRcdFx0aWYgKGZWYWwubGVuZ3RoID4gbWF4TGVuZ3RoKSBtYXhMZW5ndGggPSBmVmFsLmxlbmd0aDtcblx0XHRcdFx0XHRyZXR1cm4gZlZhbDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHQvLyBQYWQgZWFjaCBudW1iZXIgaW4gdGhlIGxpc3QgYW5kIHNlbmQgYmFjayB0aGUgY29sdW1uIG9mIG51bWJlcnM6XG5cdFx0cmV0dXJuIG1hcChmb3JtYXR0ZWQsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0Ly8gT25seSBpZiB0aGlzIGlzIGEgc3RyaW5nIChub3QgYSBuZXN0ZWQgYXJyYXksIHdoaWNoIHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIHBhZGRlZCk6XG5cdFx0XHRpZiAoaXNTdHJpbmcodmFsKSAmJiB2YWwubGVuZ3RoIDwgbWF4TGVuZ3RoKSB7XG5cdFx0XHRcdC8vIERlcGVuZGluZyBvbiBzeW1ib2wgcG9zaXRpb24sIHBhZCBhZnRlciBzeW1ib2wgb3IgYXQgaW5kZXggMDpcblx0XHRcdFx0cmV0dXJuIHBhZEFmdGVyU3ltYm9sID8gdmFsLnJlcGxhY2Uob3B0cy5zeW1ib2wsIG9wdHMuc3ltYm9sKyhuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSkgOiAobmV3IEFycmF5KG1heExlbmd0aCAtIHZhbC5sZW5ndGggKyAxKS5qb2luKFwiIFwiKSkgKyB2YWw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsO1xuXHRcdH0pO1xuXHR9O1xuXG5cblx0LyogLS0tIE1vZHVsZSBEZWZpbml0aW9uIC0tLSAqL1xuXG5cdC8vIEV4cG9ydCBhY2NvdW50aW5nIGZvciBDb21tb25KUy4gSWYgYmVpbmcgbG9hZGVkIGFzIGFuIEFNRCBtb2R1bGUsIGRlZmluZSBpdCBhcyBzdWNoLlxuXHQvLyBPdGhlcndpc2UsIGp1c3QgYWRkIGBhY2NvdW50aW5nYCB0byB0aGUgZ2xvYmFsIG9iamVjdFxuXHRpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0XHRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBsaWI7XG5cdFx0fVxuXHRcdGV4cG9ydHMuYWNjb3VudGluZyA9IGxpYjtcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBSZXR1cm4gdGhlIGxpYnJhcnkgYXMgYW4gQU1EIG1vZHVsZTpcblx0XHRkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGxpYjtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHQvLyBVc2UgYWNjb3VudGluZy5ub0NvbmZsaWN0IHRvIHJlc3RvcmUgYGFjY291bnRpbmdgIGJhY2sgdG8gaXRzIG9yaWdpbmFsIHZhbHVlLlxuXHRcdC8vIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIGxpYnJhcnkncyBgYWNjb3VudGluZ2Agb2JqZWN0O1xuXHRcdC8vIGUuZy4gYHZhciBudW1iZXJzID0gYWNjb3VudGluZy5ub0NvbmZsaWN0KCk7YFxuXHRcdGxpYi5ub0NvbmZsaWN0ID0gKGZ1bmN0aW9uKG9sZEFjY291bnRpbmcpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gUmVzZXQgdGhlIHZhbHVlIG9mIHRoZSByb290J3MgYGFjY291bnRpbmdgIHZhcmlhYmxlOlxuXHRcdFx0XHRyb290LmFjY291bnRpbmcgPSBvbGRBY2NvdW50aW5nO1xuXHRcdFx0XHQvLyBEZWxldGUgdGhlIG5vQ29uZmxpY3QgbWV0aG9kOlxuXHRcdFx0XHRsaWIubm9Db25mbGljdCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0Ly8gUmV0dXJuIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSB0byByZS1hc3NpZ24gaXQ6XG5cdFx0XHRcdHJldHVybiBsaWI7XG5cdFx0XHR9O1xuXHRcdH0pKHJvb3QuYWNjb3VudGluZyk7XG5cblx0XHQvLyBEZWNsYXJlIGBmeGAgb24gdGhlIHJvb3QgKGdsb2JhbC93aW5kb3cpIG9iamVjdDpcblx0XHRyb290WydhY2NvdW50aW5nJ10gPSBsaWI7XG5cdH1cblxuXHQvLyBSb290IHdpbGwgYmUgYHdpbmRvd2AgaW4gYnJvd3NlciBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyOlxufSh0aGlzKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3ZlbmRvci9hY2NvdW50aW5nLmpzL2FjY291bnRpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCA1IDYgNyAxMCIsIid1c2Ugc3RyaWN0JztcblxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBRID0gcmVxdWlyZSgncScpXG4gICAgO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpXG4gICAgO1xuXG52YXIgQXV0aCA9IEZvcm0uZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9hdXRoLmh0bWwnKSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWN0aW9uOiAnbG9naW4nLFxuICAgICAgICAgICAgc3VibWl0dGluZzogZmFsc2UsXG4gICAgICAgICAgICBmb3Jnb3R0ZW5wYXNzOiBmYWxzZSxcblxuICAgICAgICAgICAgdXNlcjoge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmdldCgncG9wdXAnKSkge1xuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN1Ym1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcblxuICAgICAgICB0aGlzLnNldCgnZXJyb3JNc2cnLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yJywgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvJyArIHRoaXMuZ2V0KCdhY3Rpb24nKSxcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHRoaXMuZ2V0KCd1c2VyLmxvZ2luJyksIHBhc3N3b3JkOiB0aGlzLmdldCgndXNlci5wYXNzd29yZCcpIH0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdoaWRlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LmRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblx0XHRcdFx0XHRpZihyZXNwb25zZS5lcnJvcnNbJ3VzZXJuYW1lJ11bMF09PVwiWW91IGFyZSBhbHJlYWR5IG91ciBCMkIgdXNlci5cIikge1xuXHRcdFx0XHRcdFx0JChcIiNCMkJVc2VyUG9wdXBcIikuaGlkZSgpO1xuXHRcdFx0XHRcdFx0JChcIi5sb2dpbiAuaGVhZGVyXCIpLmh0bWwoJ0IyQiBVc2VyIExvZ2luJyk7XG5cdFx0XHRcdFx0XHR2aWV3LnNldCgnQjJCVXNlckxvZ2luUG9wdXBNZXNzYWdlJyx0cnVlKTtcblx0XHRcdFx0XHR9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh2aWV3LmdldCgncG9wdXAnKT09bnVsbCAmJiBkYXRhICYmIGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvbXlib29raW5ncyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXNldFBhc3N3b3JkOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvZm9yZ290dGVucGFzcycsXG4gICAgICAgICAgICBkYXRhOiB7IGVtYWlsOiB0aGlzLmdldCgndXNlci5sb2dpbicpIH0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgncmVzZXRzdWNjZXNzJywgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzaWdudXA6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcblxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvc2lnbnVwJyxcbiAgICAgICAgICAgIGRhdGE6IF8ucGljayh0aGlzLmdldCgndXNlcicpLCBbJ2VtYWlsJywnbmFtZScsICdtb2JpbGUnLCAncGFzc3dvcmQnLCAncGFzc3dvcmQyJ10pLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3NpZ251cHN1Y2Nlc3MnLCB0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgW3Jlc3BvbnNlLm1lc3NhZ2VdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cblxuQXV0aC5sb2dpbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcblxuICAgIGF1dGguc2V0KCdwb3B1cCcsIHRydWUpO1xuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgYXV0aC5yZW5kZXIoJyNwb3B1cC1jb250YWluZXInKTtcblxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XG59O1xuXG5BdXRoLnNpZ251cCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcblxuICAgIGF1dGguc2V0KCdwb3B1cCcsIHRydWUpO1xuICAgIGF1dGguc2V0KCdzaWdudXAnLCB0cnVlKTtcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGF1dGgucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XG5cbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9hcHAvYXV0aC5qc1xuLy8gbW9kdWxlIGlkID0gODBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMyA0IDUgNiA3IDEwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQnKSxcbiAgICBBdXRoID0gcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvYXV0aCcpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuICAgIDtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcblxuICAgIHBhcnRpYWxzOiB7XG4gICAgICAgICdiYXNlLXBhbmVsJzogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9sYXlvdXQvcGFuZWwuaHRtbCcpXG4gICAgfSxcblxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgbGF5b3V0OiByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9sYXlvdXQnKVxuICAgIH0sXG5cbiAgICBzaWduaW46IGZ1bmN0aW9uKCkgeyBBdXRoLmxvZ2luKCkudGhlbihmdW5jdGlvbihkYXRhKSB7IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKSB9KTsgfSxcblxuICAgIHNpZ251cDogZnVuY3Rpb24oKSB7IEF1dGguc2lnbnVwKCk7IH0sXG5cbiAgICBsZWZ0TWVudTogZnVuY3Rpb24oKSB7IHRoaXMudG9nZ2xlKCdsZWZ0bWVudScpOyB9LFxuICAgIFxuICAgIHN3YXBTZWFyY2g6IGZ1bmN0aW9uKHNlYXJjaCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIHNlYXJjaCA9IF8uY2xvbmVEZWVwKHNlYXJjaCk7XG4gICAgICAgIF8uZWFjaChzZWFyY2guZmxpZ2h0cywgZnVuY3Rpb24oaSwgaykge1xuICAgICAgICAgICAgaS5kZXBhcnRfYXQgPSBtb21lbnQoaS5kZXBhcnRfYXQpO1xuXG4gICAgICAgICAgICBpZiAoaS5yZXR1cm5fYXQpIHtcbiAgICAgICAgICAgICAgICBpLnJldHVybl9hdCA9IG1vbWVudChpLnJldHVybl9hdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlYXJjaC5zYXZlZCA9IHRydWU7XG5cblxuICAgICAgICB0aGlzLmdldCgnc2VhcmNoJykuc2V0KHNlYXJjaCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZXcuc2V0KCdzZWFyY2guc2F2ZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb21wb25lbnRzL3BhZ2UuanNcbi8vIG1vZHVsZSBpZCA9IDMxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDUgNiIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wic3R5bGVcIjpcIndpZHRoOiAxMDAlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJzdHlsZVwiOlwicGFkZGluZy1yaWdodDogMTBweDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHJlbGF4ZWQgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWFyY2gtZm9ybVwiLFwiYVwiOntcImNsYXNzXCI6XCJiYXNpYyBzZWdtZW50XCIsXCJzZWFyY2hcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2hcIn1dfX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlY2VudF9zZWFyY2hlc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaGVhZGVyXCIsXCJzdHlsZVwiOlwiICBmb250LXNpemU6IDE2cHg7IGZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiAjMjAyNjI5OyBtYXJnaW4tYm90dG9tOiAxMHB4O1wifSxcImZcIjpbXCJSZWNlbnQgU2VhcmNoZXNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgcmVjZW50LXNlYXJjaGVzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJib3hcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibW9tZW50XCIsXCIuL3NlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCJdLFwic1wiOlwiXzAoXzEpLmZvcm1hdChcXFwiTU1NXFxcIilcIn19LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibW9tZW50XCIsXCIuL3NlYXJjaC5mbGlnaHRzLjAuZGVwYXJ0X2F0XCJdLFwic1wiOlwiXzAoXzEpLmZvcm1hdChcXFwiRERcXFwiKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpcmVjdGlvblwiLFwic3R5bGVcIjpcImN1cnNvcjogcG9pbnRlcjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzd2FwU2VhcmNoXCIsXCJhXCI6e1wiclwiOltcInNlYXJjaFwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmcm9tLmNpdHlcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpbe1widFwiOjQsXCJmXCI6W1wiYmFja1wiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiLi9zZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIyPT1fMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widG9cIl0sXCJ4XCI6e1wiclwiOltcIi4vc2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMj09XzBcIn19XX0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwidG8uY2l0eVwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCIobXVsdGljaXR5KVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiLi9zZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIzPT1fMFwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpbmZvXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuL3NlYXJjaC5wYXNzZW5nZXJzLjBcIn0sXCIgQWR1bHRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIi4vc2VhcmNoLnBhc3NlbmdlcnMuMFwiXSxcInNcIjpcIl8wPjBcIn19LHtcInRcIjo0LFwiZlwiOltcIiwgXCIse1widFwiOjIsXCJyXCI6XCIuL3NlYXJjaC5wYXNzZW5nZXJzLjFcIn0sXCIgQ2hpbGRcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIi4vc2VhcmNoLnBhc3NlbmdlcnMuMVwiXSxcInNcIjpcIl8wPjBcIn19LHtcInRcIjo0LFwiZlwiOltcIiwgXCIse1widFwiOjIsXCJyXCI6XCIuL3NlYXJjaC5wYXNzZW5nZXJzLjJcIn0sXCIgSW5mYW50XCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCIuL3NlYXJjaC5wYXNzZW5nZXJzLjJcIl0sXCJzXCI6XCJfMD4wXCJ9fV19XX1dLFwiblwiOjUyLFwiclwiOlwicmVjZW50XCJ9XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcInJlY2VudFwifV19XX0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvc2VhcmNoLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDMxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDUgNiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuICAgIDtcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxyXG4gICAgO1xyXG5cclxudmFyIFJPVVRFUyA9IHJlcXVpcmUoJ2FwcC9yb3V0ZXMnKS5mbGlnaHRzO1xyXG5cclxudmFyIFNlYXJjaCA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkb21lc3RpYzogMSxcclxuICAgICAgICAgICAgdHJpcFR5cGU6IFNlYXJjaC5PTkVXQVksXHJcbiAgICAgICAgICAgIGNhYmluVHlwZTogU2VhcmNoLkVDT05PTVksXHJcbiAgICAgICAgICAgIGZsaWdodHM6IFsgeyBmcm9tOiBTZWFyY2guREVMLCB0bzogU2VhcmNoLkJPTSwgZGVwYXJ0X2F0OiBtb21lbnQoKS5hZGQoMSwgJ2RheScpLCByZXR1cm5fYXQ6IG51bGwgfSBdLFxyXG5cclxuICAgICAgICAgICAgcGFzc2VuZ2VyczogWzEsIDAsIDBdLFxyXG5cclxuICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmUoJ2RvbWVzdGljJywgZnVuY3Rpb24oZG9tZXN0aWMpIHtcclxuICAgICAgICAgICAgaWYgKCFkb21lc3RpYyAmJiBTZWFyY2guTVVMVElDSVRZID09IHRoaXMuZ2V0KCd0cmlwVHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgndHJpcFR5cGUnLCBTZWFyY2guT05FV0FZKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRvbWVzdGljKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldCgnZmxpZ2h0cycsIFt7IGZyb206IFNlYXJjaC5ERUwsIHRvOiBTZWFyY2guQk9NLCBkZXBhcnRfYXQ6IG1vbWVudCgpLmFkZCgxLCAnZGF5JykgfV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2ZsaWdodHMnLCBbeyBmcm9tOiBudWxsLCB0bzogbnVsbCwgZGVwYXJ0X2F0OiBtb21lbnQoKS5hZGQoMSwgJ2RheScpIH1dKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCB7IGluaXQ6IGZhbHNlIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm9ic2VydmUoJ3RyaXBUeXBlJywgZnVuY3Rpb24odmFsdWUsIG9sZCkge1xyXG4gICAgICAgICAgICBpZiAoU2VhcmNoLk1VTFRJQ0lUWSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UoJ2ZsaWdodHMnLCAxLCAwLCB7IGZyb206IG51bGwsIHRvOiBudWxsLCBkZXBhcnRfYXQ6IG51bGwgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChTZWFyY2guTVVMVElDSVRZID09IG9sZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2ZsaWdodHMnLCBbdGhpcy5nZXQoJ2ZsaWdodHMuMCcpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChTZWFyY2guUk9VTkRUUklQID09IG9sZCkgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdmbGlnaHRzLjAucmV0dXJuX2F0JywgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgeyBpbml0OiBmYWxzZSB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlRmxpZ2h0OiBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgdGhpcy5zcGxpY2UoJ2ZsaWdodHMnLCBpLCAxKTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkRmxpZ2h0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnB1c2goJ2ZsaWdodHMnLCB7fSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjczogdGhpcy5nZXQoJ2NzJyksXHJcbiAgICAgICAgICAgIGRvbWVzdGljOiB0aGlzLmdldCgnZG9tZXN0aWMnKSxcclxuICAgICAgICAgICAgdHJpcFR5cGU6IHRoaXMuZ2V0KCd0cmlwVHlwZScpLFxyXG4gICAgICAgICAgICBjYWJpblR5cGU6IHRoaXMuZ2V0KCdjYWJpblR5cGUnKSxcclxuICAgICAgICAgICAgcGFzc2VuZ2VyczogdGhpcy5nZXQoJ3Bhc3NlbmdlcnMnKSxcclxuXHJcbiAgICAgICAgICAgIGZsaWdodHM6IF8ubWFwKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKGZsaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBmbGlnaHQuZnJvbSxcclxuICAgICAgICAgICAgICAgICAgICB0bzogZmxpZ2h0LnRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydF9hdDogbW9tZW50LmlzTW9tZW50KGZsaWdodC5kZXBhcnRfYXQpID8gZmxpZ2h0LmRlcGFydF9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuX2F0OiAyID09IGZvcm0uZ2V0KCd0cmlwVHlwZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKG1vbWVudC5pc01vbWVudChmbGlnaHQucmV0dXJuX2F0KSA/IGZsaWdodC5yZXR1cm5fYXQuZm9ybWF0KCdZWVlZLU1NLUREJykgOiBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG5TZWFyY2guTVVMVElDSVRZID0gMztcclxuU2VhcmNoLlJPVU5EVFJJUCA9IDI7XHJcblNlYXJjaC5PTkVXQVkgPSAxO1xyXG5cclxuU2VhcmNoLkRFTCA9IDEyMzY7XHJcblNlYXJjaC5CT00gPSA5NDY7XHJcblxyXG5TZWFyY2guRUNPTk9NWSA9IDE7XHJcblNlYXJjaC5QRVJNSVVNX0VDT05PTVkgPSAyO1xyXG5TZWFyY2guQlVTSU5FU1MgPSAzO1xyXG5TZWFyY2guRklSU1QgPSA0O1xyXG5cclxuU2VhcmNoLk1BWF9XQUlUX1RJTUUgPSA2MDAwMDtcclxuU2VhcmNoLklOVEVSVkFMID0gNTAwMDtcclxuXHJcblNlYXJjaC5sb2FkID0gZnVuY3Rpb24odXJsLCBmb3JjZSwgY3MpIHtcclxuICAgIGNzID0gY3MgfHwgbnVsbDtcclxuXHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6IFJPVVRFUy5zZWFyY2gsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgcXVlcnk6IHVybCwgZm9yY2U6IGZvcmNlIHx8IDAsIGNzOiBjcyB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoU2VhcmNoLnBhcnNlKGRhdGEpKTsgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU2VhcmNoLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgZGF0YS5mbGlnaHRzID0gXy5tYXAoZGF0YS5mbGlnaHRzLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgaS5kZXBhcnRfYXQgPSBtb21lbnQoaS5kZXBhcnRfYXQpO1xyXG4gICAgICAgIGkucmV0dXJuX2F0ID0gaS5yZXR1cm5fYXQgJiYgbW9tZW50KGkucmV0dXJuX2F0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgc2VhcmNoID0gbmV3IFNlYXJjaCh7ZGF0YTogZGF0YX0pO1xyXG5cclxuXHJcbiAgICByZXR1cm4gc2VhcmNoO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvc3RvcmVzL2ZsaWdodC9zZWFyY2hfY3VzdG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAzMTZcbi8vIG1vZHVsZSBjaHVua3MgPSA1IDYiLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIG1vZGlmeS1zZWFyY2ggc21hbGwgbW9kYWxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W1wiTW9kaWZ5IFNlYXJjaFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwiLFwic3R5bGVcIjpcInBhZGRpbmc6IDBweDtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZvcm1cIn1dLFwiblwiOjUwLFwiclwiOlwib3BlblwifV19XX1dLFwiblwiOjUwLFwiclwiOlwibW9kaWZ5XCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZvcm1cIn1dLFwiclwiOlwibW9kaWZ5XCJ9LFwiIFwiXSxcInBcIjp7XCJmb3JtXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImlkXCI6XCJmbGlnaHRzLXNlYXJjaFwiLFwiY2xhc3NcIjpbXCJ1aSBmb3JtIFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInNlYXJjaC5wZW5kaW5nXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImVycm9yXCJdLFwiblwiOjUwLFwiclwiOlwiZXJyb3JzXCJ9XSxcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImZcIjpbXCJTZWFyY2gsIEJvb2sgJiBGbHkhXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbXCJMb3dlc3QgUHJpY2VzIGFuZCAxMDAlIHNlY3VyZSFcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRvcCBhdHRhY2hlZCB0YWJ1bGFyIG1lbnVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6W3tcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInJcIjpcInNlYXJjaC5kb21lc3RpY1wifSxcIiBpdGVtIHVwcGVyY2FzZVwiXSxcImRhdGEtdGFiXCI6XCJkb21lc3RpY1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2VhcmNoLmRvbWVzdGljXFxcIiwxXVwifX19LFwiZlwiOltcIkRvbWVzdGljXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC5kb21lc3RpY1wiXSxcInNcIjpcIiFfMFwifX0sXCIgaXRlbSB1cHBlcmNhc2VcIl0sXCJkYXRhLXRhYlwiOlwiaW50ZXJuYXRpb25hbFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2VhcmNoLmRvbWVzdGljXFxcIiwwXVwifX19LFwiZlwiOltcIkludGVybmF0aW9uYWxcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYm90dG9tIGF0dGFjaGVkIGFjdGl2ZSB0YWIgc2VnbWVudCBiYXNpY1wifSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJjaGVja2JveGVzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJtdWx0aWNpdHlcIn0sXCJ0MVwiOlwiZmFkZVwiLFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcIm11bHRpY2l0eVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhZGQtZmxpZ2h0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIGJhc2ljIGJ1dHRvbiBjaXJjdWxhclwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImFkZEZsaWdodFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiKyBBZGQgbmV3XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjM9PV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2ltcGxlXCJ9LFwidDFcIjpcImZhZGVcIixcImZcIjpbe1widFwiOjgsXCJyXCI6XCJpdGluZXJhcnlcIn0sXCIgXCIse1widFwiOjgsXCJyXCI6XCJkYXRlc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjBcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvcnMuZmxpZ2h0LjBcIn1dfV0sXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjM9PV8wXCJ9fSxcIiBcIix7XCJ0XCI6OCxcInJcIjpcInBhc3NlbmdlcnNcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiXSxcInNcIjpcIlxcXCJmbGlnaHRcXFwiPT1fMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJ4XCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCJcXFwiZmxpZ2h0XFxcIj09XzBcIn19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIGJ1dHRvbiBtYXNzaXZlIGZsdWlkIHVwcGVyY2FzZVwifSxcImZcIjpbXCJTZWFyY2ggRmxpZ2h0c1wiXX1dfV19XSxcImRhdGVzXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInR3byBmaWVsZHMgZnJvbS10b1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZGF0ZVwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC5kZXBhcnRfYXRcIn1dLFwiY2xhc3NcIjpcImZsdWlkIGRlcGFydC0wIHBvaW50aW5nIHRvcCBsZWZ0XCIsXCJsYXJnZVwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIkRFUEFSVCBPTlwiLFwibWluXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIl0sXCJzXCI6XCJfMCgpXCJ9fV0sXCJtYXhcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiLFwic2VhcmNoLmZsaWdodHMuMC5yZXR1cm5fYXRcIl0sXCJzXCI6XCIyPT1fMCYmXzFcIn19XSxcInR3b21vbnRoXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXSxcInNcIjpcInRydWVcIn19XSxcInJhbmdlXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwiLFwic2VhcmNoLmZsaWdodHMuMC5yZXR1cm5fYXRcIl0sXCJzXCI6XCJbXzAsXzFdXCJ9fV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5mbGlnaHQuMC5kZXBhcnRfYXRcIn1dLFwibmV4dFwiOlwicmV0dXJuLTBcIn0sXCJ2XCI6e1wibmV4dFwiOlwibmV4dFwifSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInRvZ2dsZVJvdW5kdHJpcFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZGF0ZVwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmZsaWdodHMuMC5yZXR1cm5fYXRcIn1dLFwiY2xhc3NcIjpbXCJmbHVpZCByZXR1cm4tMCBwb2ludGluZyB0b3AgcmlnaHQgXCIse1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWRcIl0sXCJuXCI6NTEsXCJ4XCI6e1wiclwiOltcInNlYXJjaC50cmlwVHlwZVwiXSxcInNcIjpcIjI9PV8wXCJ9fV0sXCJsYXJnZVwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIlJFVFVSTiBPTlwiLFwibWluXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwiLFwibW9tZW50XCJdLFwic1wiOlwiXzB8fF8xKClcIn19XSxcInR3b21vbnRoXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXSxcInNcIjpcInRydWVcIn19XSxcInJhbmdlXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2guZmxpZ2h0cy4wLmRlcGFydF9hdFwiLFwic2VhcmNoLmZsaWdodHMuMC5yZXR1cm5fYXRcIl0sXCJzXCI6XCJbXzAsXzFdXCJ9fV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5mbGlnaHQuMC5yZXR1cm5fYXRcIn1dfSxcImZcIjpbXX1dfV19XSxcInBhc3NlbmdlcnNcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZm91ciBmaWVsZHMgcGFzc2VuZ2Vyc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc3Bpbm5lclwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLnBhc3NlbmdlcnMuMFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcImxhcmdlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiQWR1bHRzXCIsXCJtaW5cIjpcIjBcIixcIm1heFwiOlwiOVwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc2VuZ2Vyc1wifV19LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNwaW5uZXJcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5wYXNzZW5nZXJzLjFcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJsYXJnZVwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIkNoaWxkcmVuXCIsXCJtaW5cIjpcIjBcIixcIm1heFwiOlwiOVwiLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnMucGFzc2VuZ2Vyc1wifV19LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoaW50XCJ9LFwiZlwiOltcIjItMTIgeWVhcnNcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc3Bpbm5lclwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLnBhc3NlbmdlcnMuMlwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcImxhcmdlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiSW5mYW50c1wiLFwibWluXCI6XCIwXCIsXCJtYXhcIjpcIjlcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLnBhc3NlbmdlcnNcIn1dfSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGludFwifSxcImZcIjpbXCJCZWxvdyAyIHllYXJzXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwic2VhcmNoLmNhYmluVHlwZVwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcImxhcmdlXCI6XCIxXCIsXCJwbGFjZWhvbGRlclwiOlwiQ2xhc3NcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcIm1ldGEuc2VsZWN0XCJdLFwic1wiOlwiXzAuY2FiaW5UeXBlcygpXCJ9fV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5jYWJpblR5cGVcIn1dfSxcImZcIjpbXX1dfV19XSxcIml0aW5lcmFyeVwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidHdvIGZpZWxkcyBmcm9tLXRvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1haXJwb3J0XCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLmZyb21cIn1dLFwiY2xhc3NcIjpcImZsdWlkIGZyb20tMFwiLFwicGxhY2Vob2xkZXJcIjpcIkZST01cIixcInNlYXJjaFwiOlwiMVwiLFwibGFyZ2VcIjpcIjFcIixcImRvbWVzdGljXCI6XCIxXCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5mbGlnaHQuMC5mcm9tXCJ9XSxcIm5leHRcIjpcInRvLTBcIn0sXCJ2XCI6e1wibmV4dFwiOlwibmV4dFwifSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1haXJwb3J0XCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0cy4wLnRvXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0by0wXCIsXCJwbGFjZWhvbGRlclwiOlwiVE9cIixcInNlYXJjaFwiOlwiMVwiLFwibGFyZ2VcIjpcIjFcIixcImRvbWVzdGljXCI6XCIxXCIsXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9ycy5mbGlnaHQuMC50b1wifV0sXCJuZXh0XCI6XCJkZXBhcnQtMFwifSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfV19XX1dLFwiblwiOjUwLFwiclwiOlwic2VhcmNoLmRvbWVzdGljXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0d28gZmllbGRzIGZyb20tdG9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWFpcnBvcnRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5mbGlnaHRzLjAuZnJvbVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgZnJvbS0wXCIsXCJwbGFjZWhvbGRlclwiOlwiRlJPTVwiLFwic2VhcmNoXCI6XCIxXCIsXCJsYXJnZVwiOlwiMVwiLFwiZG9tZXN0aWNcIjpcIjBcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmZsaWdodC4wLmZyb21cIn1dLFwibmV4dFwiOlwidG8tMFwifSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWFpcnBvcnRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInNlYXJjaC5mbGlnaHRzLjAudG9cIn1dLFwiY2xhc3NcIjpcImZsdWlkIHRvLTBcIixcInBsYWNlaG9sZGVyXCI6XCJUT1wiLFwic2VhcmNoXCI6XCIxXCIsXCJsYXJnZVwiOlwiMVwiLFwiZG9tZXN0aWNcIjpcIjBcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JzLmZsaWdodC4wLnRvXCJ9XSxcIm5leHRcIjpcImRlcGFydC0wXCJ9LFwidlwiOntcIm5leHRcIjpcIm5leHRcIn0sXCJmXCI6W119XX1dfV0sXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn1dLFwibXVsdGljaXR5XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aHJlZSBmaWVsZHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkIGFpcnBvcnRfZmllbGRfd2lkdGhcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCIuL2Zyb21cIn1dLFwiY2xhc3NcIjpbXCJmbHVpZCBmcm9tLVwiLHtcInRcIjoyLFwiclwiOlwiaVwiLFwic1wiOnRydWV9XSxcInNlYXJjaFwiOlwiMVwiLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJGUk9NXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtZXRhLnNlbGVjdFwiXSxcInNcIjpcIl8wLmRvbWVzdGljKClcIn0sXCJzXCI6dHJ1ZX1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcImVycm9ycy5mbGlnaHRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifSxcImZyb21cIl19fV0sXCJuZXh0XCI6W1widG8tXCIse1widFwiOjIsXCJyXCI6XCJpXCIsXCJzXCI6dHJ1ZX1dfSxcInZcIjp7XCJuZXh0XCI6XCJuZXh0XCJ9LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkIGFpcnBvcnRfZmllbGRfd2lkdGhcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCIuL3RvXCJ9XSxcImNsYXNzXCI6W1wiZmx1aWQgdG8tXCIse1widFwiOjIsXCJyXCI6XCJpXCIsXCJzXCI6dHJ1ZX1dLFwic2VhcmNoXCI6XCIxXCIsXCJsYXJnZVwiOlwiMVwiLFwicGxhY2Vob2xkZXJcIjpcIlRPXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJtZXRhLnNlbGVjdFwiXSxcInNcIjpcIl8wLmRvbWVzdGljKClcIn0sXCJzXCI6dHJ1ZX1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcImVycm9ycy5mbGlnaHRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifSxcInRvXCJdfX1dLFwibmV4dFwiOltcImRlcGFydC1cIix7XCJ0XCI6MixcInJcIjpcImlcIixcInNcIjp0cnVlfV19LFwidlwiOntcIm5leHRcIjpcIm5leHRcIn0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGQgYWlycG9ydF9maWVsZF93aWR0aFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1kYXRlXCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyeFwiOntcInJcIjpcInNlYXJjaC5mbGlnaHRzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImlcIn0sXCJkZXBhcnRfYXRcIl19fV0sXCJjbGFzc1wiOltcImZsdWlkIGRlcGFydC1cIix7XCJ0XCI6MixcInJcIjpcImlcIn0sXCIgcG9pbnRpbmcgdG9wIHJpZ2h0XCJdLFwibGFyZ2VcIjpcIjFcIixcInBsYWNlaG9sZGVyXCI6XCJERVBBUlQgT05cIixcIm1pblwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibW9tZW50XCJdLFwic1wiOlwiXzAoKVwifX1dLFwiY2FsZW5kYXJcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltdLFwic1wiOlwie3R3b21vbnRoOnRydWV9XCJ9fV0sXCJ0d29tb250aFwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W10sXCJzXCI6XCJ0cnVlXCJ9fV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwiZXJyb3JzLmZsaWdodHNcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifSxcImRlcGFydF9hdFwiXX19XSxcIm5leHRcIjpbXCJkZXBhcnQtXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCJfMCsxXCJ9LFwic1wiOnRydWV9XX0sXCJ2XCI6e1wibmV4dFwiOlwibmV4dFwifSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJyZW1vdmVfaWNvblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRlbGV0ZVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlbW92ZUZsaWdodFwiLFwiYVwiOntcInJcIjpbXCJpXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOltcIsKgXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlcIl0sXCJzXCI6XCJfMD4xXCJ9fV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwicnhcIjp7XCJyXCI6XCJlcnJvcnMuZmxpZ2h0XCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImlcIn1dfX1dfV0sXCJuXCI6NTAsXCJyeFwiOntcInJcIjpcImVycm9ycy5mbGlnaHRcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwiaVwifV19fV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJzZWFyY2guZmxpZ2h0c1wifV0sXCJjaGVja2JveGVzXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRocmVlIGZpZWxkcyB0cmF2ZWwtdHlwZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGQgd2lkdGhfd2F5c1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImRlY28gXCIse1widFwiOjQsXCJmXCI6W1wiYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIxPT1fMFwifX0sXCIgd2lkdGhfd2F5c19kZWNvXCJdfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcmFkaW8gY2hlY2tib3hcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNlYXJjaC50cmlwVHlwZVxcXCIsMV1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInJhZGlvXCIsXCJjaGVja2VkXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJzZWFyY2gudHJpcFR5cGVcIl0sXCJzXCI6XCIxPT1fMFwifX1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOltcIk9ORSBXQVlcIl19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkIHdpZHRoX3dheXNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJkZWNvIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMj09XzBcIn19LFwiIHdpZHRoX3dheXNfZGVjb1wiXX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHJhZGlvIGNoZWNrYm94XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzZWFyY2gudHJpcFR5cGVcXFwiLDJdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJyYWRpb1wiLFwiY2hlY2tlZFwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMj09XzBcIn19XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbXCJST1VORCBUUklQXCJdfV19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGQgd2lkdGhfd2F5c1wifSxcInQxXCI6XCJmYWRlXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJkZWNvIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMz09XzBcIn19LFwiIHdpZHRoX3dheXNfZGVjb1wiXX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHJhZGlvIGNoZWNrYm94XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzZWFyY2gudHJpcFR5cGVcXFwiLDNdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJyYWRpb1wiLFwiY2hlY2tlZFwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wic2VhcmNoLnRyaXBUeXBlXCJdLFwic1wiOlwiMz09XzBcIn19XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbXCJNVUxUSSBDSVRZXCJdfV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJzZWFyY2guZG9tZXN0aWNcIn1dfV19fTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9mbGlnaHRzL3NlYXJjaC9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDMxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDUgNiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50JyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICAgIDtcblxudmFyXG4gICAgTEFSR0UgPSAnbGFyZ2UnLFxuICAgIERJU0FCTEVEID0gJ2Rpc2FibGVkJyxcbiAgICBMT0FESU5HID0gJ2ljb24gbG9hZGluZycsXG4gICAgREVDT1JBVEVEID0gJ2RlY29yYXRlZCcsXG4gICAgRVJST1IgPSAnZXJyb3InLFxuICAgIElOID0gJ2luJ1xuICAgIDtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWwnKSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2xhc3NlczogZnVuY3Rpb24oc3RhdGUsIGxhcmdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldCgpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChkYXRhLnN0YXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5kaXNhYmxlZCB8fCBkYXRhLnN0YXRlLnN1Ym1pdHRpbmcpIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmxvYWRpbmcpIGNsYXNzZXMucHVzaChMT0FESU5HKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUuZXJyb3IpIGNsYXNzZXMucHVzaChFUlJPUik7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sYXJnZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goREVDT1JBVEVEKTtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKExBUkdFKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSB8fCBkYXRhLmZvY3VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goSU4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24oKSB7ICBpZiAodGhpcy5nZXQoJ2Vycm9yJykpIHRoaXMuc2V0KCdlcnJvcicsIGZhbHNlKTsgfSwge2luaXQ6IGZhbHNlfSk7XG5cbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSlcbiAgICAgICAgICAgIC5vbignZm9jdXMuYXBpJywgZnVuY3Rpb24oKSB7IHZpZXcuc2V0KCdmb2N1cycsIHRydWUpOyB9KVxuICAgICAgICAgICAgLm9uKCdibHVyLmFwaScsIGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgnZm9jdXMnLCBmYWxzZSk7IH0pO1xuICAgIH0sXG5cbiAgICBvbnRlYXJkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLm9mZignLmFwaScpO1xuICAgIH0sXG5cblxuICAgIGluYzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ID0gXy5wYXJzZUludCh0aGlzLmdldCgndmFsdWUnKSkgKyAxO1xuXG4gICAgICAgIGlmICh2IDw9IHRoaXMuZ2V0KCdtYXgnKSlcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xuICAgIH0sXG5cbiAgICBkZWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdiA9IF8ucGFyc2VJbnQodGhpcy5nZXQoJ3ZhbHVlJykpIC0gMTtcblxuICAgICAgICBpZiAodiA+PSB0aGlzLmdldCgnbWluJykpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb3JlL2Zvcm0vc3Bpbm5lci5qc1xuLy8gbW9kdWxlIGlkID0gMzE4XG4vLyBtb2R1bGUgY2h1bmtzID0gNSA2IDggOSIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgc2VsZWN0aW9uIGlucHV0IHNwaW5uZXIgZHJvcGRvd24gaW4gXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcImVycm9yXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjbGFzc2VzXCIsXCJzdGF0ZVwiLFwibGFyZ2VcIixcInZhbHVlXCJdLFwic1wiOlwiXzAoXzEsXzIsXzMpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiaGlkZGVuXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInZhbHVlXCJ9XX19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwbGFjZWhvbGRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwbGFjZWhvbGRlclwifV19XSxcIm5cIjo1MCxcInJcIjpcImxhcmdlXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRleHRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzcGlubmVyIGJ1dHRvbiBpbmNcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJpbmNcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIitcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNwaW5uZXIgYnV0dG9uIGRlY1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImRlY1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiLVwiXX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDMxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDUgNiA4IDkiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGVzcy93ZWIvbW9kdWxlcy9mbGlnaHRzLmxlc3Ncbi8vIG1vZHVsZSBpZCA9IDM0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDUgNiIsIid1c2Ugc3RyaWN0JztcblxudmFyICBHdWVzdEZpbHRlciA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvZ3Vlc3R0aWNrZXQvZ3Vlc3RmaWx0ZXInKTtcbnZhciBTZWFyY2hGb3JtID0gcmVxdWlyZSgncGFnZXMvZmxpZ2h0cy9zZWFyY2hfY3VzdG9tJyk7XG4vLyB2YXIgU2VhcmNoRm9ybSA9IHJlcXVpcmUoJ3BhZ2VzL2ZsaWdodHMvc2VhcmNoJyk7XG4gICAgIFxucmVxdWlyZSgnd2ViL21vZHVsZXMvZ3Vlc3RmaWx0ZXIubGVzcycpO1xucmVxdWlyZSgnd2ViL21vZHVsZXMvZmxpZ2h0cy5sZXNzJyk7XG5cbi8vJChmdW5jdGlvbigpIHtcbi8vICAgIGNvbnNvbGUubG9nKCdJbnNpZGUgTWFpbiBteWJvb2tpbmdzJyk7XG4vLyAgICB2YXIgbXlib29raW5ncyA9IG5ldyBNeWJvb2tpbmdzKCk7XG4vLyAgICB2YXIgdXNlciA9IG5ldyBVc2VyKCk7ICAgIFxuLy9cbi8vICAgIG15Ym9va2luZ3MucmVuZGVyKCcjY29udGVudCcpO1xuLy8gICAgdXNlci5yZW5kZXIoJyNwYW5lbCcpO1xuLy99KTtcblxuXG4kKGZ1bmN0aW9uKCkge1xuICAgIChuZXcgR3Vlc3RGaWx0ZXIoKSkucmVuZGVyKCcjYXBwJyk7XG4gICAgLy8gKG5ldyBTZWFyY2hGb3JtKCkpLnJlbmRlcignI2FwcCcpO1xufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL2d1ZXN0ZmlsdGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzNTBcbi8vIG1vZHVsZSBjaHVua3MgPSA2IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgICAgICBBdXRoID0gcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvYXV0aCcpLFxuICAgICAgICBNeWJvb2tpbmdEYXRhID0gcmVxdWlyZSgnc3RvcmVzL215Ym9va2luZ3MvbXlib29raW5ncycpLFxuICAgICAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL215Ym9va2luZ3MvbWV0YScpO1xuICAgICAgICAvLyBTZWFyY2hGb3JtID0gcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9mb3JtJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XG4gICAgaXNvbGF0ZWQ6IHRydWUsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9ndWVzdHRpY2tldC9ndWVzdGZpbHRlci5odG1sJyksXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICAnbGF5b3V0JzogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvbGF5b3V0JyksXG4gICAgICAgIGF1dGg6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2F1dGgnKSxcbiAgICAgICAgJ2N1c3RvbS1mb3JtJzogcmVxdWlyZSgncGFnZXMvZmxpZ2h0cy9zZWFyY2hfY3VzdG9tJyksXG4gICAgICAgIGd1ZXN0Ym9va2luZzogcmVxdWlyZSgnY29tcG9uZW50cy9ndWVzdHRpY2tldC9ndWVzdGJvb2tpbmcnKSxcbiAgICAgICAgZGV0YWlsczogcmVxdWlyZSgnY29tcG9uZW50cy9teWJvb2tpbmdzL2RldGFpbHMnKSxcbiAgICB9LFxuICAgIHBhcnRpYWxzOiB7XG4gICAgICAgICdiYXNlLXBhbmVsJzogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9sYXlvdXQvcGFuZWwuaHRtbCcpXG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBteWJvb2tpbmdzOntsb2dnZWRpbjpmYWxzZX0sXG4gICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XG4gICAgIE1ldGEuaW5zdGFuY2UoKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG1ldGEpIHsgdGhpcy5zZXQoJ21ldGEnLCBtZXRhKTt9LmJpbmQodGhpcykpO1xuICAgICAgICAvLyB0aGlzLnNldCgndXNlcicsIFVzZXIpO1xuICAgICAgICB3aW5kb3cudmlldyA9IHRoaXM7XG4gICAgfSxcbiAgICBzaG93OiBmdW5jdGlvbiAoc2VjdGlvbiwgdmFsaWRhdGlvbiwgYWxsKSB7XG4gICAgICAgIGlmIChhbGwpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBpZiAoJ2JpcnRoJyA9PSBzZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2RvbWVzdGljJyAhPSAndmFsaWRhdGlvbic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ3Bhc3Nwb3J0JyA9PSBzZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Z1bGwnID09ICd2YWxpZGF0aW9uJztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2lnbmluOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcblxuICAgICAgICBBdXRoLmxvZ2luKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfSk7XG4gICAgfSxcbiAgICAgIHNpZ251cDogZnVuY3Rpb24oKSB7XG4gICAgICAgIEF1dGguc2lnbnVwKCk7XG4gICAgfSxcbiAgICBiYWNrOiBmdW5jdGlvbigpIHtcbiAgICBcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWY9XCIvXCI7XG4gICAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb21wb25lbnRzL2d1ZXN0dGlja2V0L2d1ZXN0ZmlsdGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzNTFcbi8vIG1vZHVsZSBjaHVua3MgPSA2IiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwibGF5b3V0XCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcImd1ZXN0Ym9va2luZ1wiLFwiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInN0ZXAgaGVhZGVyIHN0ZXAxIGFjdGl2ZVwifSxcImZcIjpbXCJHZXQgQm9va2luZ1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdHdvIGNvbHVtbiBtaWRkbGUgYWxpZ25lZCBjZW50ZXIgYWxpZ25lZCByZWxheGVkIGZpdHRlZCBzdGFja2FibGUgZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcImF1dGhcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHZlcnRpY2FsIGRpdmlkZXJcIn0sXCJmXCI6W1wiT3JcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNlbnRlciBhbGlnbmVkIGNvbHVtblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJjdXN0b20tZm9ybVwiLFwiYVwiOntcImNsYXNzXCI6XCJiYXNpYyBzZWdtZW50XCJ9fSxcIiBcIl19XX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5sb2dnZWRpblwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGV0YWlsc1wiLFwiYVwiOntcIm15Ym9va2luZ3NcIjpbe1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5sb2dnZWRpblwiXSxcInNcIjpcIiFfMFwifX0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0ZmlsdGVyLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDYiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuICAgIDtcclxuXHJcbnZhciBQYWdlID0gcmVxdWlyZSgnY29tcG9uZW50cy9wYWdlJyksXHJcbiAgICBTZWFyY2ggPSByZXF1aXJlKCdzdG9yZXMvZmxpZ2h0L3NlYXJjaCcpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YTEnKVxyXG4gICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdlLmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL3BhZ2VzL2ZsaWdodHMvc2VhcmNoLmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ3NlYXJjaC1mb3JtJzogcmVxdWlyZSgnY29tcG9uZW50cy9mbGlnaHRzL3NlYXJjaC9mb3JtMScpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByZWNlbnQgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2VhcmNoZXMnKSB8fCBudWxsKSB8fCBbXTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk1FVEE6IFwiLCBNZXRhLm9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VhcmNoOiBuZXcgU2VhcmNoKCksXHJcbiAgICAgICAgICAgIG1ldGE6IE1ldGEub2JqZWN0LFxyXG4gICAgICAgICAgICBtb21lbnQ6IG1vbWVudCxcclxuICAgICAgICAgICAgLy8gcmVjZW50OiBfLm1hcChyZWNlbnQsIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIG1vbWVudChpLnNlYXJjaC5mbGlnaHRzWzBdLmRlcGFydF9hdCkgPyBpIDogbnVsbDsgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvcGFnZXMvZmxpZ2h0cy9zZWFyY2hfY3VzdG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAzNTNcbi8vIG1vZHVsZSBjaHVua3MgPSA2IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxuICAgIFEgPSByZXF1aXJlKCdxJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG4gICAgO1xuXG52YXIgVmlldyA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxuICAgIDtcblxudmFyIE1ldGEgPSBWaWV3LmV4dGVuZCh7XG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcblxuICAgICAgICB2YXIgY291bnRyaWVzO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICAgICAgICB0aXRsZXM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5tYXAodmlldy5nZXQoJ3RpdGxlcycpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBpLmlkLCB0ZXh0OiBpLm5hbWUgfTsgfSk7IH0sXG4gICAgICAgICAgICAgICAgY2FiaW5UeXBlczogZnVuY3Rpb24oKSB7IHJldHVybiBfLm1hcCh2aWV3LmdldCgnY2FiaW5UeXBlcycpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBpLmlkLCB0ZXh0OiBpLm5hbWUgfTsgfSk7IH0sXG4gICAgICAgICAgICAgICAgZG9tZXN0aWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAodmlldy5nZXQoJ2RvbWVzdGljJyksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IGkuaWQsIHRleHQ6IGkuY2l0eV9uYW1lICsgJyAoJyArIGkuYWlycG9ydF9jb2RlICsgJyknIH07IH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY291bnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb3VudHJpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50cmllcyA9ICBfLm1hcCh2aWV3LmdldCgnY291bnRyaWVzJyksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IGkuaWQsIHRleHQ6IGkubmFtZSB9OyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3VudHJpZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgYWlycG9ydDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5maW5kKHZpZXcuZ2V0KCdkb21lc3RpYycpLCB7IGlkOiBfLnBhcnNlSW50KGlkKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbk1ldGEucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIG1ldGEgPSBuZXcgTWV0YSgpO1xuICAgIG1ldGEuc2V0KGRhdGEpO1xuICAgIFxuICAgIG1ldGEuc2V0KCdkaXNwbGF5X2N1cnJlbmN5JywgJ0lOUicpO1xuXG4gICAgcmV0dXJuIG1ldGE7XG59O1xuXG5NZXRhLmZldGNoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL2ZsaWdodHMvbWV0YScpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoTWV0YS5wYXJzZShkYXRhKSk7IH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG5cbk1ldGEub2JqZWN0ID0gbnVsbDtcbk1ldGEuaW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBpZiAoTWV0YS5vYmplY3QpIHtcbiAgICAgICAgICAgIHJlc29sdmUoTWV0YS5vYmplY3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgTWV0YS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24obWV0YSkge1xuICAgICAgICAgICAgTWV0YS5vYmplY3QgPSBtZXRhO1xuICAgICAgICAgICAgcmVzb2x2ZShtZXRhKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5NZXRhLnBhcnNlUXVlcnkgPSBmdW5jdGlvbihxc3RyKSB7XG4gICAgdmFyIHF1ZXJ5ID0ge307XG4gICAgdmFyIGEgPSBxc3RyLnNwbGl0KCcmJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBiID0gYVtpXS5zcGxpdCgnPScpO1xuICAgICAgICBxdWVyeVtkZWNvZGVVUklDb21wb25lbnQoYlswXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KGJbMV0gfHwgJycpO1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL3N0b3Jlcy9mbGlnaHQvbWV0YTEuanNcbi8vIG1vZHVsZSBpZCA9IDM1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDYiLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgICAgICBRID0gcmVxdWlyZSgncScpXG4gICAgICAgIDtcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJylcbiAgICAgICAgO1xudmFyIEd1ZXN0Qm9va2luZyA9IEZvcm0uZXh0ZW5kKHtcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5odG1sJyksXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWN0aW9uOiAnZ3Vlc3Rib29raW5nJyxcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgbW9iaWxlOiAnJyxcbiAgICAgICAgICAgIHBucjogJycsXG4gICAgICAgICAgICBsYXN0bmFtZTogJycsXG4gICAgICAgICAgICBwbnIyOiAnJ1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGdldHRpY2tldGJ5cG5yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnJywgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xuICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wZW5kaW5nJywgdHJ1ZSk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldGd1ZXN0Ym9va2luZy8nLFxuICAgICAgICAgICAgZGF0YToge21vYmlsZTogdGhpcy5nZXQoJ21vYmlsZScpLCBwbnI6IHRoaXMuZ2V0KCdwbnInKX0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5lcnJvciA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLCB1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsIGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LGN1cmVuY3k6IGRhdGEuY3VyZW5jeSxmb3A6ZGF0YS5mb3AsYmFzZXByaWNlOmRhdGEuYmFzZXByaWNlLHRheGVzOmRhdGEudGF4ZXMsZmVlOmRhdGEuZmVlLHRvdGFsQW1vdW50aW53b3JkczpkYXRhLnRvdGFsQW1vdW50aW53b3JkcyxjdXN0b21lcmNhcmU6ZGF0YS5jdXN0b21lcmNhcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhdmVsbGVyOiBfLm1hcChpLnRyYXZlbGxlciwgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWlybGluZV9wbnI6IHQuYWlybGluZV9wbnIsIGNyc19wbnI6IHQuY3JzX3BuciwgdGlja2V0OiB0LnRpY2tldCwgYm9va2luZ19jbGFzczogdC5ib29raW5nX2NsYXNzLCBjYWJpbjogdC5jYWJpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsIHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKHQucm91dGVzLCBmdW5jdGlvbiAocm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogcm8uZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHJvLm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiByby5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiByby5tZWFsLCBzZWF0OiByby5zZWF0LCBhaXJjcmFmdDogcm8uYWlyY3JhZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgb3JpZ2luOiB0Lm9yaWdpbiwgb3JpZ2luRGV0YWlsczogdC5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzJywgZGV0YWlscyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnN1bW1hcnknLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnBlbmRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLmxvZ2dlZGluJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnZXJyb3InLCAnTm90IEZvdW5kJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvck1zZycsICdTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0dGlja2V0YnlsYXN0bmFtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZzInLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yMicsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZzInLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MucGVuZGluZycsIHRydWUpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9nZXRndWVzdGJvb2tpbmcvJyxcbiAgICAgICAgICAgIGRhdGE6IHtsYXN0bmFtZTogdGhpcy5nZXQoJ2xhc3RuYW1lJyksIHBucjI6IHRoaXMuZ2V0KCdwbnIyJyl9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcyJywgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmVycm9yKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEuZXJyb3IgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRldGFpbHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCwgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChkYXRhLmJvb2tpbmdzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2ljZmFyZTogdC5iYXNpY2ZhcmUsIHRheGVzOiB0LnRheGVzLCB0b3RhbDogdC50b3RhbCwgc3RhdHVzOiB0LnN0YXR1cywgc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBvcmlnaW46IHQub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiB0Lm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogdC5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiB0LmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHQuZGVwYXJ0dXJlLCBhcnJpdmFsOiB0LmFycml2YWwsIGNhcnJpZXI6IHQuY2FycmllciwgY2Fycmllck5hbWU6IHQuY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogdC5mbGlnaHROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgfTtcblxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMnLCBkZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3Muc3VtbWFyeScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MucGVuZGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MubG9nZ2VkaW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnMicsIGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnZXJyb3IyJywgJ05vdCBGb3VuZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMyJywgcmVzcG9uc2UuZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9yTXNnMicsICdTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcbm1vZHVsZS5leHBvcnRzID0gR3Vlc3RCb29raW5nO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9ndWVzdHRpY2tldC9ndWVzdGJvb2tpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDM1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDYiLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W1widWkgZm9ybSBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInN1Ym1pdHRpbmdcIn1dLFwic3R5bGVcIjpcInBvc2l0aW9uOiByZWxhdGl2ZTtcIn0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwiZ2V0dGlja2V0YnlwbnJcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0d28gY29sdW1uIG1pZGRsZSBhbGlnbmVkIGNlbnRlciBhbGlnbmVkIHJlbGF4ZWQgZml0dGVkIHN0YWNrYWJsZSBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIixcInN0eWxlXCI6XCJtYXgtd2lkdGg6IDMwMHB4OyBtYXJnaW46IGF1dG87IHRleHQtYWxpZ246IGxlZnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibW9iaWxlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIm1vYmlsZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9iaWxlIC8gRW1haWxcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwbnJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicG5yXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIlBOUiAvIEJvb2tpbmcgSWQuXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIHNtYWxsIGJsdWUgYnV0dG9uIFwifSxcImZcIjpbXCJTVUJNSVRcIl19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGhvcml6b250YWwgZGl2aWRlclwifSxcImZcIjpbXCJPUlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W1widWkgZm9ybSBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzMlwiLFwiZXJyb3JNc2cyXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3VibWl0dGluZzJcIn1dLFwic3R5bGVcIjpcInBvc2l0aW9uOiByZWxhdGl2ZTtcIn0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwiZ2V0dGlja2V0YnlsYXN0bmFtZVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHR3byBjb2x1bW4gbWlkZGxlIGFsaWduZWQgY2VudGVyIGFsaWduZWQgcmVsYXhlZCBmaXR0ZWQgc3RhY2thYmxlIFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgc2VnbWVudFwiLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsYXN0bmFtZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJsYXN0bmFtZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgXCIsXCJwbGFjZWhvbGRlclwiOlwiTGFzdCBOYW1lXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicG5yMlwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwbnIyXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIlBOUiAvIEJvb2tpbmcgSWQuXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZzJcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZzJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnMyXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnMyXCIsXCJlcnJvck1zZzJcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwidWkgc21hbGwgYmx1ZSBidXR0b24gXCJ9LFwiZlwiOltcIlNVQk1JVFwiXX1dfV19XX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5odG1sXG4vLyBtb2R1bGUgaWQgPSAzNTZcbi8vIG1vZHVsZSBjaHVua3MgPSA2IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgICAgICBBdXRoID0gcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvYXV0aCcpLFxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxuICAgICAgICBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpXG4gICAgICAgIC8vTXl0cmF2ZWxsZXIgPSByZXF1aXJlKCdhcHAvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJykgICA7XG4gICAgICAgIDtcblxuXG52YXIgdDJtID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcblxuICAgIHJldHVybiBpWzBdICogNjAgKyBpWzFdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XG4gICAgaXNvbGF0ZWQ6IHRydWUsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teWJvb2tpbmdzL2RldGFpbHMuaHRtbCcpLFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1haWw6IGZhbHNlLFxuICAgICAgICAgICAgc3VibWl0dGluZzogZmFsc2UsXG4gICAgICAgICAgICBmb3JtYXRCaXJ0aERhdGU6IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXIuYmlydGhkYXRlJywgZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdFRpdGxlOiBmdW5jdGlvbiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGl0bGVzKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXROYW1lOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0VHJhdmVsRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2xsJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMjogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2RkZCBNTU0gRCBZWVlZJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMzogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2RkZCBISDptbScpOy8vZm9ybWF0KCdNTU0gREQgWVlZWScpOyAgICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1czogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb25maXJtJztcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbm90Y29uZmlybSc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IDIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29uZmlybWVkJztcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ2FiYm9va2luZ1N0YXR1cycpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIF8ucmVzdWx0KF8uZmluZChzdCwgeydpZCc6IHN0YXR1c30pLCAnbmFtZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaWZmOiBmdW5jdGlvbiAoZW5kLCBzdGFydCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIG1zID0gbW9tZW50KGVuZCwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmRpZmYobW9tZW50KHN0YXJ0LCBcIllZWVktTU0tREQgaGg6bW06c3NcIikpO1xuICAgICAgICAgICAgICAgIHZhciBkID0gbW9tZW50LmR1cmF0aW9uKG1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihkLmFzSG91cnMoKSkgKyAnaCAnICsgZC5taW51dGVzKCkgKyAnbSc7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2xsJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3M6IGZ1bmN0aW9uIChicykge1xuICAgICAgICAgICAgICAgIGlmIChicyA9PSAxIHx8IGJzID09IDIgfHwgYnMgPT0gMyB8fCAgYnMgPT0gNylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicHJvZ3Jlc3NcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA0IHx8IGJzID09IDUgfHwgYnMgPT0gNiB8fCBicyA9PSAxMilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY2FuY2VsbGVkXCI7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnMgPT0gOCB8fCBicyA9PSA5IHx8IGJzID09IDEwIHx8IGJzID09IDExKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJib29rZWRcIjtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdTdGF0dXNNZXNzYWdlOiBmdW5jdGlvbiAoYnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgYmtzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ2Jvb2tpbmdTdGF0dXMnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gIF8ucmVzdWx0KF8uZmluZChia3MsIHsnaWQnOiBic30pLCAnbmFtZScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnZlcnQ6IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICcnLCAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb252ZXJ0SXhpZ286IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjb3VudGluZy51bmZvcm1hdChhY2NvdW50aW5nLmZvcm1hdE1vbmV5KGFtb3VudCwgJycsIDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICB0b2dnbGVlbWFpbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdXNlciA9IHRoaXMuZ2V0KCdtZXRhLnVzZXInKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdzdWJtaXR0aW5nJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0KCdtZXRhLnVzZXIuZW1haWwnKTtcbiAgICAgICAgLy90aGlzLnNldCgnZW1haWwnLCBlbWFpbCk7XG4gICAgICAgICQoJyNlbWFpbCcpLnZhbChlbWFpbCk7XG4gICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgIC8vIHRoaXMuc2lnbmluKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vbignYmFjaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgICAgIGlmIChjdXJyZW50VVJMLmluZGV4T2YoXCJteWJvb2tpbmdzL1wiKSA+IC0xKVxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcbiAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVUkwuaW5kZXhPZihcIm15Ym9va2luZ3NcIikgPiAtMSlcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnc3VtbWFyeScsIHRydWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwiZ3Vlc3Rib29raW5nXCIpID4gLTEpXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L2d1ZXN0Ym9va2luZyc7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKCdjYW5jZWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1c2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdhbWVuZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdjYW5jZWwnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgncmVzY2hlZHVsZScsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaWduaW5uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub24oJ3Jlc2NoZWR1bGUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1c2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdhbWVuZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdyZXNjaGVkdWxlJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2NhbmNlbCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaWduaW5uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKCdwcmludGRpdicsIGZ1bmN0aW9uIChldmVudCwgaWQpIHtcbiAgICAgICAgICAgIC8vd2luZG93LnByaW50KCk7XG4gICAgICAgICAgICB2YXIgdXNlciA9IHRoaXMuZ2V0KCdtZXRhLnVzZXInKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYWlyQ2FydC9wcmludC8nICsgaWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbignYXNQREYnLCBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XG4gICAgICAgICAgICAvL3dpbmRvdy5sb2NhdGlvbignL2IyYy9haXJDYXJ0L2FzUERGLycraWQpO1xuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9haXJDYXJ0L2FzUERGL1wiICsgaWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbignY2xvc2VtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAkKCcudWkucG9zaXRpdmUubWVzc2FnZScpLmZhZGVPdXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9LFxuICAgIHN1Ym1pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XG4gICAgICAgICAgICAkKCcubWVzc2FnZScpLmZhZGVJbigpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L3NlbmRFbWFpbC8nICsgdmlldy5nZXQoJ215Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkJyksXG4gICAgICAgICAgICAgICAgZGF0YToge2VtYWlsOiAkKCcjZW1haWwnKS52YWwoKSwgfSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmVtYWlsX3NlbnRcIikuaHRtbChcIjxkaXYgY2xhc3M9J2VtYWlsX3NlbnQnPkVtYWlsIFNlbnQ8L2Rpdj5cIik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5kZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JNc2cnLCAnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgXG4gICAgfSxcbiAgICBzaWduaW5uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcbiAgICAgICAvLyBjb25zb2xlLmxvZyh2aWV3LmdldCgnbXlib29raW5ncycpKTtcbiAgICAgICAgQXV0aC5sb2dpbigpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyh2aWV3LmdldCgnbXlib29raW5ncycpLmN1cnJlbnRDYXJ0RGV0YWlscy5pZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ21ldGEudXNlcicsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MvJyArIHZpZXcuZ2V0KCdteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XG4gICAgXHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmPVwiL1wiO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9teWJvb2tpbmdzL2RldGFpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDM1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDYgNyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHBvc2l0aXZlICBtZXNzYWdlXCIsXCJzdHlsZVwiOlwiZGlzcGxheTogbm9uZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn0sXCJ2XCI6e1wiY2xpY2tcIjpcImNsb3NlbWVzc2FnZVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiU2VuZGluZyBFbWFpbC4uXCJdLFwiblwiOjUwLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltcIkVtYWlsIFNlbnRcIl0sXCJyXCI6XCIuL3N1Ym1pdHRpbmdcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MucHJpbnRcIl0sXCJzXCI6XCIhXzBcIn19LHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJib3ggbXktYm9va2luZ3MtZGV0YWlscyBcIix7XCJ0XCI6NCxcImZcIjpbXCJ1aSBzZWdtZW50IGxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5vcHJpbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImFcIjp7XCJzdHlsZVwiOlwidmVydGljYWwtYWxpZ246IGJvdHRvbVwifSxcImZcIjpbXCJNeSBCb29raW5ncyBEZXRhaWxzIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJyZXNjaGVkdWxlXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbCB1aSBidXR0b24gb3JhbmdlXCJ9LFwiZlwiOltcIkNoYW5nZS9SZXNjaGVkdWxlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJjYW5jZWxcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsIHVpIGJ1dHRvbiByZWRcIn0sXCJmXCI6W1wiQ2FuY2VsXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInVwY29taW5nXCIsXCJtZXRhLnVzZXIuZW1haWxcIixcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmVtYWlsXCJdLFwic1wiOlwiXzA9PVxcXCJ0cnVlXFxcIiYmXzE9PV8yXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJiYWNrXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbCB1aSBidXR0b24geWVsbG93XCJ9LFwiZlwiOltcIkJhY2tcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIjXCIsXCJjbGFzc1wiOlwiZW1haWxcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJ0b2dnbGVlbWFpbFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImRpc2FibGVkPSdkaXNhYmxlZCdcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN1Ym1pdHRpbmdcIl0sXCJzXCI6XCIhXzBcIn19XSxcImZcIjpbXCJFbWFpbFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOltcIi9iMmMvYWlyQ2FydC9hc1BERi9cIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkXCJ9XSxcInRhcmdldFwiOlwiX2JsYW5rXCIsXCJjbGFzc1wiOlwicGRmXCJ9LFwiZlwiOltcIlRpY2tldCBhcyBQREZcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aWNrZXRcIixcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvbXlib29raW5ncy9cIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkXCJ9LFwiI3ByaW50XCJdLFwidGFyZ2V0XCI6XCJfYmxhbmtcIn0sXCJmXCI6W1wiUHJpbnQgRS1UaWNrZXRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIG1vZGFsIHNtYWxsXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOltcIkVtYWlsIFRpY2tldFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgYmFzaWMgc2VnbWVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBmb3JtIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCIuL3N1Ym1pdHRpbmdcIn1dLFwiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaW5wdXQgc21hbGxcIixcInR5cGVcIjpcInRleHRcIixcIm5hbWVcIjpcImVtYWlsXCIsXCJpZFwiOlwiZW1haWxcIixcInZhbHVlXCI6XCJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFjdGlvbnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzbWFsbCBidXR0b25cIn0sXCJmXCI6W1wiU2VuZFwiXX1dfV19XX1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLnByaW50XCJdLFwic1wiOlwiIV8wXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wic3R5bGVcIjpcIndpZHRoOjk1JVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcIndpZHRoOjQ1JVwiLFwiY29sc3BhblwiOlwiM1wifSxcImZcIjpbe1widFwiOjMsXCJyXCI6XCJ0aWNrZXRzdGF0dXNtc2dcIn1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6MzUlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvZGV2L2ltZy9sb2dvLnBuZ1wifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6MzUlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJzdHlsZVwiOlwiZm9udC1zaXplOiB4LWxhcmdlO2ZvbnQtd2VpZ2h0OmJvbGQ7XCJ9LFwiZlwiOltcIkUtVElDS0VUXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6MzAlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wic3R5bGVcIjpcIiB0ZXh0LWFsaWduOiBpbml0aWFsO2Zsb2F0OiByaWdodDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJDaGVhcFRpY2tldC5pbiA6IEN1c3RvbWVyIFN1cHBvcnRcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W1wiRW1haWw6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJtYWlsdG86Q1NAQ2hlYXBUaWNrZXQuaW5cIn0sXCJmXCI6W1wiQ1NAQ2hlYXBUaWNrZXQuaW5cIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W1wiUGhvbmVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcInRlbDowMTIwLTQ4ODc3NzdcIn0sXCJmXCI6W1wiMDEyMC00ODg3Nzc3XCJdfV19XX1dfV19XX1dLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5wcmludFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJncm91cCBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ1N0YXR1c0NsYXNzXCIsXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGFibGUgdGl0bGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpcmVjdGlvblwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5ncy4wLnNvdXJjZVwifSx7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidG9cIixcInN0eWxlXCI6XCJtYXJnaW4tdG9wOiAzcHg7XCJ9LFwiZlwiOltcIsKgXCJdfSx7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuZGVzdGluYXRpb25cIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInJldHVybmRhdGVcIl0sXCJzXCI6XCJfMD09bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5zb3VyY2VcIn0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhY2tcIixcInN0eWxlXCI6XCJtYXJnaW4tdG9wOiAzcHg7XCJ9LFwiZlwiOltcIsKgXCJdfSx7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuZGVzdGluYXRpb25cIn1dfV0sXCJ4XCI6e1wiclwiOltcInJldHVybmRhdGVcIl0sXCJzXCI6XCJfMD09bnVsbFwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJpc011bHRpQ2l0eVwiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpcmVjdGlvblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwic291cmNlXCJ9LFwiwqAgfCDCoFwiXSxcImlcIjpcImlcIixcInJcIjpcImJvb2tpbmdzXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJyXCI6W1wiYm9va2luZ3MubGVuZ3RoXCJdLFwic1wiOlwiXzAtMVwifSxcImRlc3RpbmF0aW9uXCJdfX1dfV0sXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZVwiLFwiYm9va2luZ3MuMC5kZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGF0dXMgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ19zdGF0dXNtc2dcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tpbmctaWRcIn0sXCJmXCI6W1wiQm9va2luZyBJZDogXCIse1widFwiOjIsXCJyXCI6XCJpZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nRGF0ZVwiLFwiY3JlYXRlZFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNpeHRlZW4gd2lkZSBjb2x1bW4gXCIsXCJzdHlsZVwiOlwiaGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZWdtZW50IGZsaWdodC1pdGluZXJhcnkgY29tcGFjdCBkYXJrXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aXRsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNpdHlcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwic291cmNlXCJ9LFwiIOKGkiBcIix7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uXCJ9XX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGUyXCIsXCJkZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImZsaWdodHRpbWVcIn1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiaWRcIjpcImFpcnBvcnRfY2hhbmdlX3N0eWxlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImFpcnBvcnRfY2hhbmdlXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiYWlycG9ydF9jaGFuZ2VcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImlkXCI6XCJ0cmFuc2l0dmlzYV9tc2dfc3R5bGVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidHJhbnNpdFwifV19XSxcIm5cIjo1MCxcInJcIjpcInRyYW5zaXRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlZ21lbnRzXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImFcIjp7XCJjbGFzc1wiOlwiZGl2aWRlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIsKgXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwibGF5b3ZlclwifSxcImZcIjpbXCJMYXlvdmVyOiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZGlmZlwiLFwia1wiLFwialwiLFwiYm9va2luZ3NcIl0sXCJzXCI6XCJfMChfM1tfMl0ucm91dGVzW18xXS5kZXBhcnR1cmUsXzNbXzJdLnJvdXRlc1tfMS0xXS5hcnJpdmFsKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImtcIl0sXCJzXCI6XCJfMD4wXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiY2Fycmllci1sb2dvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0b3AgYWxpZ25lZCBhdmF0YXIgaW1hZ2VcIixcInNyY1wiOlt7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwiYm9va2luZ3NcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwialwifSxcInJvdXRlc1wiLHtcInRcIjozMCxcIm5cIjpcImtcIn0sXCJsb2dvXCJdfX1dLFwiYWx0XCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllck5hbWVcIn1dLFwidGl0bGVcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVyTmFtZVwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiY2Fycmllci1uYW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjIsXCJyXCI6XCJjYXJyaWVyXCJ9LFwiLVwiLHtcInRcIjoyLFwiclwiOlwiZmxpZ2h0TnVtYmVyXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJmcm9tXCIsXCJzdHlsZVwiOlwidGV4dC1hbGlnbjogcmlnaHQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiaWQ9XFxcImJhY2tncm91bmRfYWlycG9ydF9jaGFuZ2VcXFwiXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjBcIixcImFpcnBvcnRfY2hhbmdlX25hbWUuMVwiLFwiYWlycG9ydF9jaGFuZ2VfbmFtZS4yXCIsXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjNcIixcIm9yaWdpblwiLFwiYWlycG9ydF9jaGFuZ2VfbmFtZS40XCJdLFwic1wiOlwiXzQ9PV8wfHxfND09XzF8fF80PT1fMnx8XzQ9PV8zfHxfND09XzVcIn19XSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJvcmlnaW5cIn0sXCI6XCJdfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZTNcIixcImRlcGFydHVyZVwiXSxcInNcIjpcIl8wKF8xKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZVwiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiByaWdodDtcIixcImNsYXNzXCI6XCJhaXJwb3J0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm9yaWdpbkRldGFpbHNcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiZmxpZ2h0XCJ9LFwiZlwiOltcIsKgXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiaWQ9XFxcImJhY2tncm91bmRfYWlycG9ydF9jaGFuZ2VcXFwiXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjBcIixcImFpcnBvcnRfY2hhbmdlX25hbWUuMVwiLFwiYWlycG9ydF9jaGFuZ2VfbmFtZS4yXCIsXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjNcIixcImRlc3RpbmF0aW9uXCIsXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjRcIl0sXCJzXCI6XCJfND09XzB8fF80PT1fMXx8XzQ9PV8yfHxfND09XzN8fF80PT1fNVwifX1dLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uXCJ9LFwiOlwiXX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGUzXCIsXCJhcnJpdmFsXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJhcnJpdmFsXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJwb3J0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lLW4tY2FiaW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0dGltZVwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwidHJhdmVsbGVyXCIse1wiclwiOltdLFwic1wiOlwiMFwifSxcImNhYmluXCJdfX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRlY2hTdG9wXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJUZWNobmljYWwgU3RvcDpcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwicm91dGVzXCIse1widFwiOjMwLFwiblwiOlwia1wifSxcInRlY2hTdG9wXCJdfX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wia1wiLFwialwiLFwiYm9va2luZ3NcIl0sXCJzXCI6XCJfMltfMV0ucm91dGVzW18wXS50ZWNoU3RvcCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX1dLFwieFwiOntcInJcIjpbXCJrXCIsXCJqXCIsXCJib29raW5nc1wiXSxcInNcIjpcIl8yW18xXS5yb3V0ZXNbXzBdLnRlY2hTdG9wIT1udWxsXCJ9fV19XSxcImlcIjpcImtcIixcInJ4XCI6e1wiclwiOlwiYm9va2luZ3NcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwialwifSxcInJvdXRlc1wiXX19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwicGFzc2VuZ2VyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJQYXNzZW5nZXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJDUlMgUE5SXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJmXCI6W1wiQWlyIFBOUlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIlRpY2tldCBOby5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJSZW1hcmtcIl19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRpdGxlXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiZmlyc3RfbmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImxhc3RfbmFtZVwifSxcIiAoXCIse1widFwiOjIsXCJyXCI6XCJ0eXBlXCJ9LFwiKSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1widHJhdmVsbGVyQm9va2luZ1N0YXR1c1wiLFwic3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInN0YXR1c21zZ1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjcnNfcG5yXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImFpcmxpbmVfcG5yXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRpY2tldFwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpY2tldF9iYWdnYWdlX3N0eWxpbmdcIn0sXCJmXCI6W1wiSGFuZCBiYWdnYWdlIG9ubHkoN2tnIE9uZSBQaWVjZSBPbmx5KVwiXX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb2R1Y3RfY2xhc3NcIl0sXCJzXCI6XCJfMD09XFxcIkxJVEVcXFwiXCJ9fV19XX1dLFwiaVwiOlwidFwiLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwidHJhdmVsbGVyXCJdfX1dfV19XSxcImlcIjpcImpcIixcInJcIjpcImJvb2tpbmdzXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRvdGFsXCJ9LFwiZlwiOltcIlRPVEFMIFBSSUNFOiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJjdXJlbmN5XCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjb252ZXJ0XCIsXCJ0b3RhbEFtb3VudFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YXhlc1wifSxcImZcIjpbXCJCYXNpYyBGYXJlIDogXCIse1widFwiOjIsXCJyXCI6XCJiYXNlcHJpY2VcIn0sXCIgLCBUYXhlcyA6IFwiLHtcInRcIjoyLFwiclwiOlwidGF4ZXNcIn0sXCIgLCBGZWUgOiBcIix7XCJ0XCI6MixcInJcIjpcImZlZVwifSxcIiwgT3RoZXIgOiBcIix7XCJ0XCI6MixcInJcIjpcImNvbnZmZWVcIn0se1widFwiOjQsXCJmXCI6W1wiLCBEaXNjb3VudCA6IFwiLHtcInRcIjoyLFwiclwiOlwicHJvbW9kaXNjb3VudFwifV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInByb21vZGlzY291bnRcIl0sXCJzXCI6XCJfMD4wXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwiY2xlYXI6IGJvdGg7XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJhXCI6e1wiY29sc3BhblwiOlwiMlwifSxcImZcIjpbXCJUZXJtcyBhbmQgQ29uZGl0aW9uc1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiQWxsIGZsaWdodCB0aW1pbmdzIHNob3duIGFyZSBsb2NhbCB0aW1lcy5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJVc2UgXCIse1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W1wiUmVmIE5vLlwiXX0sXCIgZm9yIGNvbW11bmljYXRpb24gd2l0aCB1cy5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJVc2UgXCIse1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W1wiQWlybGluZSBQTlJcIl19LFwiIGZvciBjb250YWN0aW5nIHRoZSBBaXJsaW5lcy5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJDYXJyeSBhIHByaW50LW91dCBvZiBlLXRpY2tldCBmb3IgY2hlY2staW4uXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiSW4gY2FzZSBvZiBuby1zaG93LCB0aWNrZXRzIGFyZSBub24tcmVmdW5kYWJsZS5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJFbnN1cmUgeW91ciBwYXNzcG9ydCBpcyB2YWxpZCBmb3IgbW9yZSB0aGFuIDYgbW9udGhzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlBsZWFzZSBjaGVjayBUcmFuc2l0ICYgRGVzdGluYXRpb24gVmlzYSBSZXF1aXJlbWVudC5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJGb3IgY2FuY2VsbGF0aW9uLCBhaXJsaW5lIGNoYXJnZXMgJiBzZXIuIGZlZSBhcHBseS5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJBbGwgcGF5bWVudHMgYXJlIGNoYXJnZWQgaW4gSU5SLiBJZiBhbnkgb3RoZXIgY3VycmVuY3kgaGFzIGJlZW4gY2hvc2VuIHRoZSBwcmljZSBpbiB0aGF0IGN1cnJlbmN5IGlzIG9ubHkgaW5kaWNhdGl2ZS5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJUaGUgSU5SIHByaWNlIGlzIHRoZSBmaW5hbCBwcmljZS5cIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkNhcnJ5IGEgcGhvdG8gSUQvIFBhc3Nwb3J0IGZvciBjaGVjay1pbi5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJNZWFscywgU2VhdCAmIFNwZWNpYWwgUmVxdWVzdHMgYXJlIG5vdCBndWFyYW50ZWVkLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlByZXNlbnQgRnJlcXVlbnQgRmxpZXIgQ2FyZCBhdCBjaGVjay1pbi5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJDYXJyaWFnZSBpcyBzdWJqZWN0IHRvIEFpcmxpbmVzIFRlcm1zICYgQ29uZGl0aW9ucy5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJFbnN1cmUgcGFzc2VuZ2VyIG5hbWVzIGFyZSBjb3JyZWN0LCBuYW1lIGNoYW5nZSBpcyBub3QgcGVybWl0dGVkLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkZvciBhbnkgY2hhbmdlIEFpcmxpbmUgY2hhcmdlcywgZGlmZmVyZW5jZSBvZiBmYXJlICYgc2VyLiBmZWUgYXBwbHkuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiWW91IG1pZ2h0IGJlIGFza2VkIHRvIHByb3ZpZGUgY2FyZCBjb3B5ICYgSUQgcHJvb2Ygb2YgY2FyZCBob2xkZXIuXCJdfV19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcImNsZWFyOiBib3RoO1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiXCJ9LFwiZlwiOltcIkRpc2NsYWltZXI6IENoZWFwVGlja2V0IGlzIG5vdCBsaWFibGUgZm9yIGFueSBkZWZpY2llbmN5IGluIHNlcnZpY2UgYnkgQWlybGluZSBvciBTZXJ2aWNlIHByb3ZpZGVycy5cIl19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W10sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnByaW50XCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNjcmlwdFwiLFwiYVwiOntcInR5cGVcIjpcInRleHQvamF2YXNjcmlwdFwifSxcImZcIjpbXCJ3aW5kb3cuaXhpVHJhbnNhY3Rpb25UcmFja2VyID0gZnVuY3Rpb24odGFnKSB7XFxuZnVuY3Rpb24gdXBkYXRlUmVkaXJlY3QodGFnLCB0cmFuc2FjdGlvbklELCBwbnIsIHNhbGVWYWx1ZSwgc2VnbWVudE5pZ2h0cykge1xcbnJldHVybiBcXFwiPGltZyBzdHlsZT0ndG9wOi05OTk5OTlweDtsZWZ0Oi05OTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZScgc3JjPSdodHRwczovL3d3dy5peGlnby5jb20vaXhpLWFwaS90cmFja2VyL3VwZGF0ZUNvbnZlcnNpb24vXFxcIiArIHRhZyArIFxcXCI/dHJhbnNhY3Rpb25JZD1cXFwiICsgdHJhbnNhY3Rpb25JRCArIFxcXCImcG5yPVxcXCIgKyBwbnIgKyBcXFwiJnNhbGVWYWx1ZT1cXFwiICsgc2FsZVZhbHVlICsgXFxcIiZzZWdtZW50TmlnaHRzPVxcXCIgKyBzZWdtZW50TmlnaHRzICsgXFxcIicgLz5cXFwiO1xcbn1cXG5kb2N1bWVudC5ib2R5LmlubmVySFRNTCArPSB1cGRhdGVSZWRpcmVjdCh0YWcsIFxcXCJcIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkXCJ9LFwiXFxcIiwgXFxcIlwiLHtcInRcIjoyLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuYm9va2luZ3MuMC50cmF2ZWxsZXIuMC5haXJsaW5lX3BuclwifSxcIlxcXCIsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjb252ZXJ0SXhpZ29cIixcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLnRvdGFsQW1vdW50XCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiwgXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5zZWdOaWdodHNcIn0sXCIgKTtcXG59O1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzY3JpcHRcIixcImFcIjp7XCJzcmNcIjpcImh0dHBzOi8vd3d3Lml4aWdvLmNvbS9peGktYXBpL3RyYWNrZXIvdHJhY2sxOTZcIixcImlkXCI6XCJ0cmFja2VyXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MuY2xpZW50U291cmNlSWRcIl0sXCJzXCI6XCJfMD09NFwifX0se1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNjcmlwdFwiLFwiYVwiOntcInR5cGVcIjpcInRleHQvamF2YXNjcmlwdFwifSxcImZcIjpbXCJcXG52YXIgd2VnbyA9IHdlZ28gfHwgW107XFxuXFxuX3dlZ28ucHVzaChcXG5cXG5bICdjb252ZXJzaW9uSWQnLCAnZmNhNzc2NjEtNzZlYi00Y2NkLWFmNGMtM2I2N2EzMDAxMjdiJyBdLFxcblxcblsgJ3RyYW5zYWN0aW9uSWQnLCAnXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZFwifSxcIicgXSxcXG5cXG5bICdjdXJyZW5jeUNvZGUnLCAnSU5SJyBdLFxcblxcblsgJ2NvbW1pc3Npb24nLCAwXSxcXG5cXG5bICd0b3RhbEJvb2tpbmdWYWx1ZScsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjb252ZXJ0SXhpZ29cIixcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLnRvdGFsQW1vdW50XCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiBdXFxuXFxuKTtcXG5cXG4oZnVuY3Rpb24gKCkge1xcblxcbnZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xcblxcbnZhciB3ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xcblxcbndnLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcXG5cXG53Zy5zcmMgPSAnaHR0cHM6Ly9zLndlZ28uY29tL2NvbnZlcnNpb24uanMnO1xcblxcbnMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod2csIHMpO1xcblxcbn0pKCk7XFxuXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MuY2xpZW50U291cmNlSWRcIl0sXCJzXCI6XCJfMD09NVwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wPT04fHxfMD09OXx8XzA9PTEwfHxfMD09MTFcIn19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5wcmludFwiXSxcInNcIjpcIiFfMFwifX1dfV0sXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlsc1wifV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3MvZGV0YWlscy5odG1sXG4vLyBtb2R1bGUgaWQgPSAzNThcbi8vIG1vZHVsZSBjaHVua3MgPSA2IDciLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGVzcy93ZWIvbW9kdWxlcy9ndWVzdGZpbHRlci5sZXNzXG4vLyBtb2R1bGUgaWQgPSAzNTlcbi8vIG1vZHVsZSBjaHVua3MgPSA2IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHBhZ2UgPSByZXF1aXJlKCdwYWdlLmpzJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG4gICAgO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIFNlYXJjaCA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvc2VhcmNoX2N1c3RvbScpLFxyXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9mbGlnaHQvbWV0YScpXHJcbiAgICA7XHJcblxyXG52YXIgUk9VVEVTID0gcmVxdWlyZSgnYXBwL3JvdXRlcycpLmZsaWdodHM7XHJcbi8vIGNvbnNvbGUubG9nKFJPVVRFUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvZmxpZ2h0cy9zZWFyY2gvZm9ybS5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1zcGlubmVyJzogcmVxdWlyZSgnY29yZS9mb3JtL3NwaW5uZXInKSxcclxuICAgICAgICAndWktYWlycG9ydCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZmxpZ2h0cy9haXJwb3J0MScpLFxyXG4gICAgICAgICd1aS1jYWxlbmRhcic6IHJlcXVpcmUoJ2NvcmUvZm9ybS9jYWxlbmRhcicpXHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHZhciByZWNlbnQgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2VhcmNoZXMnKSB8fCBudWxsKSB8fCBbXTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtZXRhOiBNZXRhLm9iamVjdCxcclxuICAgICAgICAgICAgbW9tZW50OiBtb21lbnQsXHJcbiAgICAgICAgICAgIC8vIHNlYXJjaDogbmV3IFNlYXJjaCgpLFxyXG4gICAgICAgICAgICAvLyByZWNlbnQ6IF8ubWFwKHJlY2VudCwgZnVuY3Rpb24oaSkgeyByZXR1cm4gbW9tZW50KGkuc2VhcmNoLmZsaWdodHNbMF0uZGVwYXJ0X2F0KSA/IGkgOiBudWxsOyB9KSAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdNRVRBOiAnLCBNRVRBLm9iamVjdCk7XHJcbiAgICAgICAgdGhpcy5vbignbmV4dCcsIGZ1bmN0aW9uKHZpZXcpIHtcclxuICAgICAgICAgICAgLy9UT0RPOiB0aGluayBvZiBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCdmb3JtJykpLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGlmeScpICYmICF0aGlzLmdldCgnc2VhcmNoLmRvbWVzdGljJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCduZXh0JykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGVcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gdmlldy5nZXQoJ25leHQnKS5zcGxpdCgnLScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgndG8nID09IG5leHRbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMuZmluZCgnLicgKyB2aWV3LmdldCgnbmV4dCcpICsgJyBpbnB1dC5zZWFyY2gnKSkuY2xpY2soKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgnZGVwYXJ0JyA9PSBuZXh0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLicgKyB2aWV3LmdldCgnbmV4dCcpKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgncmV0dXJuJyA9PSBuZXh0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLicgKyB2aWV3LmdldCgnbmV4dCcpKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChNT0JJTEUpIHtcclxuICAgICAgICAgICAgdmFyIG9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoeyBvbkhpZGRlbjogZnVuY3Rpb24oKSB7ICQoJyNtX2J0bicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpOyAgfSwgb25TaG93OiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9fSk7XHJcbiAgICAgICAgICAgICQoJy5kcm9wZG93bicpLmRyb3Bkb3duKCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjbV9idG4nLCB0aGlzLmVsKS5vbignY2xpY2subGF5b3V0JyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnLnB1c2hlcicpLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGlmeScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdvcGVuJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldCgnc2VhcmNoLmZsaWdodHMnLCB0aGlzLmdldCgnc2VhcmNoLmZsaWdodHMnKSk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb250ZWFyZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdtb2RpZnknLCBudWxsKTtcclxuICAgIH0sXHJcblxyXG4gICAgdG9nZ2xlUm91bmR0cmlwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoMiAhPT0gdGhpcy5nZXQoJ3NlYXJjaC50cmlwVHlwZScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzZWFyY2gudHJpcFR5cGUnLCAyKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFRyYXZlbGVyOiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoJ3NlYXJjaC5wYXNzZW5nZXJzLicgKyB0eXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlIDwgOSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnc2VhcmNoLnBhc3NlbmdlcnMuJyArIHR5cGUsIHZhbHVlICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZW1vdmVUcmF2ZWxlcjogZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KCdzZWFyY2gucGFzc2VuZ2Vycy4nICsgdHlwZSk7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3NlYXJjaC5wYXNzZW5nZXJzLicgKyB0eXBlLCB2YWx1ZSAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVtb3ZlRmxpZ2h0OiBmdW5jdGlvbihpKSB7IHRoaXMuZ2V0KCdzZWFyY2gnKS5yZW1vdmVGbGlnaHQoaSk7IH0sXHJcbiAgICBhZGRGbGlnaHQ6IGZ1bmN0aW9uKCkgeyB0aGlzLmdldCgnc2VhcmNoJykuYWRkRmxpZ2h0KCk7IH0sXHJcblxyXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wb3N0KFJPVVRFUy5zZWFyY2gsIHRoaXMuc2VyaWFsaXplKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHNlYXJjaCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuZ2V0KCdtb2RpZnknKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwYWdlKHNlYXJjaC51cmwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2VyaWFsaXplOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuZ2V0KCdzZWFyY2gnKS50b0pTT04oKTsgfVxyXG5cdFxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9zZWFyY2gvZm9ybTEuanNcbi8vIG1vZHVsZSBpZCA9IDQwMFxuLy8gbW9kdWxlIGNodW5rcyA9IDYiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgICAgIDtcclxuXHJcbnZhciBTZWxlY3QgPSByZXF1aXJlKCdjb3JlL2Zvcm0vc2VsZWN0JylcclxuICAgICAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdC5leHRlbmQoe1xyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFqYXgsIHRpbWVvdXQ7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdkb21lc3RpYycpKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT0RFTUFURUZFOiBcIiwgdGhpcy5nZXQoJ21ldGEuc2VsZWN0LmRvbWVzdGljJykpO1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnb3B0aW9ucycsIHRoaXMuZ2V0KCdtZXRhLnNlbGVjdC5kb21lc3RpYycpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbWVzdGljIG5vdFwiKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCd2YWx1ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRvbWVzdGljIHZhbHVlXCIpO1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2ZsaWdodHMvYWlycG9ydC8nICsgdGhpcy5nZXQoJ3ZhbHVlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnb3B0aW9ucycsIFtkYXRhXSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLnNlbGVjdGlvbicpKS5kcm9wZG93bignc2V0IHZhbHVlJywgZGF0YS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLnNlbGVjdGlvbicpKS5kcm9wZG93bignc2V0IHRleHQnLCBkYXRhLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBhamF4ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCd2YWx1ZScsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJvYnNlcnZlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhamF4LmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXQoJ3ZhbHVlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBhamF4ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy9iMmMvZmxpZ2h0cy9haXJwb3J0LycgKyB0aGlzLmdldCgndmFsdWUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdvcHRpb25zJywgW2RhdGFdKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLnNlbGVjdGlvbicpKS5kcm9wZG93bignc2V0IHZhbHVlJywgZGF0YS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5zZWxlY3Rpb24nKSkuZHJvcGRvd24oJ3NldCB0ZXh0JywgZGF0YS50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoJ3NlYXJjaGZvcicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhamF4LmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFqYXggPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2Jvb2tpbmcvc2VhcmNoQWlycG9ydCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7dGVybTogdmFsdWV9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ29wdGlvbnMnLCBfLm1hcChkYXRhLCBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB0ZXh0OiBpLmxhYmVsfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLnNlbGVjdGlvbicpKS5kcm9wZG93bignc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWpheC5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ29wdGlvbnMnLCBbXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvbXBvbmVudHMvZmxpZ2h0cy9haXJwb3J0MS5qc1xuLy8gbW9kdWxlIGlkID0gNDAxXG4vLyBtb2R1bGUgY2h1bmtzID0gNiJdLCJzb3VyY2VSb290IjoiIn0=