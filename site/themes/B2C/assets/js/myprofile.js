webpackJsonp([8],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(370);


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

/***/ 86:
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

/***/ 87:
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

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  Myprofile = __webpack_require__(371);
	     
	     __webpack_require__(379);
	
	$(function() {
	    (new Myprofile()).render('#app');
	});

/***/ },

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	    Myprofile = __webpack_require__(61),
	    Meta = __webpack_require__(58)
	    ;
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(372),
	
	    components: {
	        'layout': __webpack_require__(72),
	        'myprofile-form': __webpack_require__(373),
	        myprofileview: __webpack_require__(377),
	       // leftpanel:require('components/layouts/profile_sidebar')
	    },
	    partials: {
	        'base-panel': __webpack_require__(105)
	    },
	    
	    onconfig: function() {
	        this.set('myprofile.pending', true);
	        this.set('myprofile.edit', false);
	       Myprofile.fetch()
	                .then(function(myprofile) { this.set('myprofile.pending', false); this.set('myprofile', myprofile); }.bind(this));
	       Meta.instance()
	                .then(function(meta) { this.set('meta', meta);}.bind(this));
	        window.view = this;
	    },
	    data: function() {     
	        return {            
	            leftmenu:false,
	        }
	    },
	 leftMenu:function() { var flag=this.get('leftmenu'); this.set('leftmenu', !flag);},
	   
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
	        
	        $('.ui.checkbox', this.el).checkbox();
	    }
	});

/***/ },

/***/ 372:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"box my-travellers"},"f":[{"t":7,"e":"div","a":{"class":"left"},"f":[{"t":7,"e":"div","a":{"id":"myprofile"},"f":[{"t":4,"f":[{"t":7,"e":"myprofileview","a":{"myprofile":[{"t":2,"r":"myprofile"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"x":{"r":["myprofile.edit"],"s":"!_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"myprofile-form","a":{"myprofile":[{"t":2,"r":"myprofile"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["myprofile.edit"],"s":"!_0"}}]}]}]}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 373:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        _ = __webpack_require__(30),
	        moment = __webpack_require__(44),
	        Myprofile = __webpack_require__(61),
	        validate = __webpack_require__(62)
	        ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(374),
	    components: {
	        'ui-spinner': __webpack_require__(318),
	        'ui-calendar': __webpack_require__(43),
	        'ui-tel': __webpack_require__(375),
	        'ui-email': __webpack_require__(86),
	        'ui-input': __webpack_require__(37),
	        'ui-date': __webpack_require__(41),
	    },
	    data: function () {
	        return {
	            errors:null,
	            statelist: [],
	            citylist: [],
	            formatStateList: function (statelist) {
	                var data = _.cloneDeep(statelist);
	
	                return _.map(data, function (i) {
	                    return {id: i.id, text: i.name};
	                });
	            },
	            formatCityList: function (citylist) {
	                var data = _.cloneDeep(citylist);
	
	                return _.map(data, function (i) {
	                    return {id: i.id, text: i.name};
	                });
	            },
	            formatCountryList: function (countrylist) {
	                var data = _.cloneDeep(countrylist);
	
	                return _.map(data, function (i) {
	                    return {id: i.id, text: i.name};
	                });
	            },
	        }
	    },
	    onconfig: function (options) {
	        
	
	    },
	    oninit: function (options) {
	        var view = this;
	        this.set('profileform.name', this.get('myprofile.name'));
	        this.set('profileform.email', this.get('myprofile.email'));
	        this.set('profileform.mobile', this.get('myprofile.mobile'));
	        this.set('profileform.address', this.get('myprofile.address'));
	        this.set('profileform.country', this.get('myprofile.country'));
	        this.set('profileform.countrycode', this.get('myprofile.countrycode'));
	        this.set('profileform.state', this.get('myprofile.state'));
	        this.set('profileform.statecode', this.get('myprofile.statecode'));
	        this.set('profileform.city', this.get('myprofile.city'));
	        this.set('profileform.citycode', this.get('myprofile.citycode'));
	        this.set('profileform.pincode', this.get('myprofile.pincode'));
	
	        if (this.get('myprofile.countrycode') != null && this.get('myprofile.countrycode') != '') {
	            view.get('myprofile').getStateList(view);
	        }
	        if (this.get('myprofile.statecode') != null && this.get('myprofile.statecode') != '') {
	            view.get('myprofile').getCityList(view);
	        }
	        this.on('closemessage', function (event) {
	          $('.ui.positive.message').fadeOut();
	        });
	        
	    },
	    edit: function () {
	        var view = this;
	        
	        $.ajax({
	            type: 'POST',
	            url: '/b2c/users/updateSelf/',
	            dataType: 'json',
	            data: {'data': JSON.stringify(view.get('profileform'))},
	            success: function (idd) {
	                //console.log(idd);
	                if (idd.result == 'success') {
	                    window.location.href='/b2c/users/myprofile'
	                }
	                else if(idd.result == 'error'){
	                    view.set('errors',idd.message);
	                    console.log(idd.message);
	                }
	            }
	        });
	
	    },
	    oncomplete: function () {
	        var view = this;
	       //text(this.get('profileform').city);
	       $('#divstate').on('click',function(event){$('#divcity .ui.dropdown').dropdown('restore default text');
	        //view.set('profileform.statecode',$('#divstate .item.active.selected').attr('data-value'));
	        if((typeof(view.get('citylist')) != "undefined"))
	        view.set('citylist',null);
	       });
	       $('#divcity').on('click',function(event){
	           //console.log('oncliick id '+$('#divcity .item.active.selected').attr('data-value'));
	         //  $('#divcity .ui.dropdown').dropdown('set selected', $('#divcity .item.active.selected').attr('data-value'));
	          // view.set('profileform.citycode',$('#divcity .item.active.selected').attr('data-value'));
	       });
	       $('#divcountry').on('click',function(event){
	           if((typeof(view.get('statelist')) != "undefined"))
	            view.set('statelist',null);
	        if((typeof(view.get('citylist')) != "undefined"))
	        view.set('citylist',null);
	           //console.log('oncliick id '+$('#divcity .item.active.selected').attr('data-value'));
	         //  $('#divcity .ui.dropdown').dropdown('set selected', $('#divcity .item.active.selected').attr('data-value'));
	          // view.set('profileform.citycode',$('#divcity .item.active.selected').attr('data-value'));
	       });
	        this.observe('profileform.countrycode', function (value) {
	            if (this.get('profileform.countrycode') != null && this.get('profileform.countrycode') != '') {
	                view.get('myprofile').getStateList(view);                
	            }
	        }, {init: false});
	        this.observe('profileform.statecode', function (value) {
	            if (this.get('profileform.statecode') != null && this.get('profileform.statecode') != '') {               
	                  view.get('myprofile').getCityList(view);
	            }
	        }, {init: false});
	        
	    }
	});

/***/ },

/***/ 374:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"h1","f":["My Profile"]}," ",{"t":7,"e":"form","a":{"action":"javascript:;","class":"ui form basic segment flight search"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errors"}]}]}],"n":50,"r":"errors"}," ",{"t":7,"e":"div","a":{"class":"ui grid"},"f":[{"t":7,"e":"div","a":{"class":"details"},"f":[" ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Name"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"name","placeholder":"Name","value":[{"t":2,"r":"profileform.name"}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Email Address"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-email","a":{"name":"email","placeholder":"E-Mail","value":[{"t":2,"r":"profileform.email"}]}}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Mobile Number"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-tel","a":{"name":"mobile","placeholder":"Mobile","value":[{"t":2,"r":"profileform.mobile"}]}}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Address"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"address","placeholder":"Address","value":[{"t":2,"r":"profileform.address"}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Country"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.countrycode"}],"class":"fluid transparent","placeholder":"Country","small":"1","search":"1","options":[{"t":2,"x":{"r":["formatCountryList","meta.countrylist"],"s":"_0(_1)"}}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["State"]}," ",{"t":7,"e":"td","a":{"id":"divstate"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.statecode"}],"class":"fluid transparent","placeholder":"State","search":"1","small":"1","options":[{"t":2,"x":{"r":["formatStateList","statelist"],"s":"_0(_1)"}}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["City"]}," ",{"t":7,"e":"td","a":{"id":"divcity"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.citycode"}],"class":"fluid transparent","placeholder":"City","search":"1","small":"1","options":[{"t":2,"x":{"r":["formatCityList","citylist"],"s":"_0(_1)"}}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Pin Code"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"pincode","placeholder":"Pin Code","value":[{"t":2,"r":"profileform.pincode"}]}}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"one column row"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"edit","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button massive fluid"},"f":["Update Profile"]}],"n":50,"r":"myprofile.edit"}]}]}]}]}]};

/***/ },

/***/ 375:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(376);
	
	var $ = __webpack_require__(33);
	
	var Input = __webpack_require__(37);
	
	module.exports = Input.extend({
	    
	    oncomplete: function() {
	        this._super();
	
	
	        var view = this,
	            input = $(this.find('input'))
	            ;
	
	
	        input.intlTelInput({
	            autoPlaceholder: false,
	            preferredCountries: ['in','us','gb','ru'],
	            nationalMode: false
	        });
	        /*
	        input.on('keydown', function(e) {
	            e.preventDefault();
	        });*/
	    },
	
	    onteadown: function() {
	        $(this.find('input')).intlTelInput('destroy');
	    }
	});

/***/ },

/***/ 376:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	International Telephone Input v5.8.7
	https://github.com/Bluefieldscom/intl-tel-input.git
	*/
	// wrap in UMD - see https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
	(function(factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(33) ], __WEBPACK_AMD_DEFINE_RESULT__ = function($) {
	            factory($, window, document);
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        factory(jQuery, window, document);
	    }
	})(function($, window, document, undefined) {
	    "use strict";
	    // these vars persist through all instances of the plugin
	    var pluginName = "intlTelInput", id = 1, // give each instance it's own id for namespaced event handling
	    defaults = {
	        // typing digits after a valid number will be added to the extension part of the number
	        allowExtensions: false,
	        // automatically format the number according to the selected country
	        autoFormat: true,
	        // add or remove input placeholder with an example number for the selected country
	        autoPlaceholder: true,
	        // if there is just a dial code in the input: remove it on blur, and re-add it on focus
	        autoHideDialCode: true,
	        // default country
	        defaultCountry: "",
	        // token for ipinfo - required for https or over 1000 daily page views support
	        ipinfoToken: "",
	        // don't insert international dial codes
	        nationalMode: true,
	        // number type to use for placeholders
	        numberType: "MOBILE",
	        // display only these countries
	        onlyCountries: [],
	        // the countries at the top of the list. defaults to united states and united kingdom
	        preferredCountries: [ "us", "gb" ],
	        // specify the path to the libphonenumber script to enable validation/formatting
	        utilsScript: ""
	    }, keys = {
	        UP: 38,
	        DOWN: 40,
	        ENTER: 13,
	        ESC: 27,
	        PLUS: 43,
	        A: 65,
	        Z: 90,
	        ZERO: 48,
	        NINE: 57,
	        SPACE: 32,
	        BSPACE: 8,
	        DEL: 46,
	        CTRL: 17,
	        CMD1: 91,
	        // Chrome
	        CMD2: 224
	    }, windowLoaded = false;
	    // keep track of if the window.load event has fired as impossible to check after the fact
	    $(window).load(function() {
	        windowLoaded = true;
	    });
	    function Plugin(element, options) {
	        this.element = element;
	        this.options = $.extend({}, defaults, options);
	        this._defaults = defaults;
	        // event namespace
	        this.ns = "." + pluginName + id++;
	        // Chrome, FF, Safari, IE9+
	        this.isGoodBrowser = Boolean(element.setSelectionRange);
	        this.hadInitialPlaceholder = Boolean($(element).attr("placeholder"));
	        this._name = pluginName;
	    }
	    Plugin.prototype = {
	        _init: function() {
	            // if in nationalMode, disable options relating to dial codes
	            if (this.options.nationalMode) {
	                this.options.autoHideDialCode = false;
	            }
	            // IE Mobile doesn't support the keypress event (see issue 68) which makes autoFormat impossible
	            if (navigator.userAgent.match(/IEMobile/i)) {
	                this.options.autoFormat = false;
	            }
	            // we cannot just test screen size as some smartphones/website meta tags will report desktop resolutions
	            // Note: for some reason jasmine fucks up if you put this in the main Plugin function with the rest of these declarations
	            // Note: to target Android Mobiles (and not Tablets), we must find "Android" and "Mobile"
	            this.isMobile = /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	            // we return these deferred objects from the _init() call so they can be watched, and then we resolve them when each specific request returns
	            // Note: again, jasmine had a spazz when I put these in the Plugin function
	            this.autoCountryDeferred = new $.Deferred();
	            this.utilsScriptDeferred = new $.Deferred();
	            // process all the data: onlyCountries, preferredCountries etc
	            this._processCountryData();
	            // generate the markup
	            this._generateMarkup();
	            // set the initial state of the input value and the selected flag
	            this._setInitialState();
	            // start all of the event listeners: autoHideDialCode, input keydown, selectedFlag click
	            this._initListeners();
	            // utils script, and auto country
	            this._initRequests();
	            // return the deferreds
	            return [ this.autoCountryDeferred, this.utilsScriptDeferred ];
	        },
	        /********************
	   *  PRIVATE METHODS
	   ********************/
	        // prepare all of the country data, including onlyCountries and preferredCountries options
	        _processCountryData: function() {
	            // set the instances country data objects
	            this._setInstanceCountryData();
	            // set the preferredCountries property
	            this._setPreferredCountries();
	        },
	        // add a country code to this.countryCodes
	        _addCountryCode: function(iso2, dialCode, priority) {
	            if (!(dialCode in this.countryCodes)) {
	                this.countryCodes[dialCode] = [];
	            }
	            var index = priority || 0;
	            this.countryCodes[dialCode][index] = iso2;
	        },
	        // process onlyCountries array if present, and generate the countryCodes map
	        _setInstanceCountryData: function() {
	            var i;
	            // process onlyCountries option
	            if (this.options.onlyCountries.length) {
	                // standardise case
	                for (i = 0; i < this.options.onlyCountries.length; i++) {
	                    this.options.onlyCountries[i] = this.options.onlyCountries[i].toLowerCase();
	                }
	                // build instance country array
	                this.countries = [];
	                for (i = 0; i < allCountries.length; i++) {
	                    if ($.inArray(allCountries[i].iso2, this.options.onlyCountries) != -1) {
	                        this.countries.push(allCountries[i]);
	                    }
	                }
	            } else {
	                this.countries = allCountries;
	            }
	            // generate countryCodes map
	            this.countryCodes = {};
	            for (i = 0; i < this.countries.length; i++) {
	                var c = this.countries[i];
	                this._addCountryCode(c.iso2, c.dialCode, c.priority);
	                // area codes
	                if (c.areaCodes) {
	                    for (var j = 0; j < c.areaCodes.length; j++) {
	                        // full dial code is country code + dial code
	                        this._addCountryCode(c.iso2, c.dialCode + c.areaCodes[j]);
	                    }
	                }
	            }
	        },
	        // process preferred countries - iterate through the preferences,
	        // fetching the country data for each one
	        _setPreferredCountries: function() {
	            this.preferredCountries = [];
	            for (var i = 0; i < this.options.preferredCountries.length; i++) {
	                var countryCode = this.options.preferredCountries[i].toLowerCase(), countryData = this._getCountryData(countryCode, false, true);
	                if (countryData) {
	                    this.preferredCountries.push(countryData);
	                }
	            }
	        },
	        // generate all of the markup for the plugin: the selected flag overlay, and the dropdown
	        _generateMarkup: function() {
	            // telephone input
	            this.telInput = $(this.element);
	            // prevent autocomplete as there's no safe, cross-browser event we can react to, so it can easily put the plugin in an inconsistent state e.g. the wrong flag selected for the autocompleted number, which on submit could mean the wrong number is saved (esp in nationalMode)
	            this.telInput.attr("autocomplete", "off");
	            // containers (mostly for positioning)
	            this.telInput.wrap($("<div>", {
	                "class": "intl-tel-input"
	            }));
	            var flagsContainer = $("<div>", {
	                "class": "flag-dropdown"
	            }).insertAfter(this.telInput);
	            // currently selected flag (displayed to left of input)
	            var selectedFlag = $("<div>", {
	                "class": "selected-flag"
	            }).appendTo(flagsContainer);
	            this.selectedFlagInner = $("<div>", {
	                "class": "iti-flag"
	            }).appendTo(selectedFlag);
	            // CSS triangle
	            $("<div>", {
	                "class": "arrow"
	            }).appendTo(selectedFlag);
	            // country list
	            // mobile is just a native select element
	            // desktop is a proper list containing: preferred countries, then divider, then all countries
	            if (this.isMobile) {
	                this.countryList = $("<select>").appendTo(flagsContainer);
	            } else {
	                this.countryList = $("<ul>", {
	                    "class": "country-list v-hide"
	                }).appendTo(flagsContainer);
	                if (this.preferredCountries.length && !this.isMobile) {
	                    this._appendListItems(this.preferredCountries, "preferred");
	                    $("<li>", {
	                        "class": "divider"
	                    }).appendTo(this.countryList);
	                }
	            }
	            this._appendListItems(this.countries, "");
	            if (!this.isMobile) {
	                // now we can grab the dropdown height, and hide it properly
	                this.dropdownHeight = this.countryList.outerHeight();
	                this.countryList.removeClass("v-hide").addClass("hide");
	                // this is useful in lots of places
	                this.countryListItems = this.countryList.children(".country");
	            }
	        },
	        // add a country <li> to the countryList <ul> container
	        // UPDATE: if isMobile, add an <option> to the countryList <select> container
	        _appendListItems: function(countries, className) {
	            // we create so many DOM elements, it is faster to build a temp string
	            // and then add everything to the DOM in one go at the end
	            var tmp = "";
	            // for each country
	            for (var i = 0; i < countries.length; i++) {
	                var c = countries[i];
	                if (this.isMobile) {
	                    tmp += "<option data-dial-code='" + c.dialCode + "' value='" + c.iso2 + "'>";
	                    tmp += c.name + " +" + c.dialCode;
	                    tmp += "</option>";
	                } else {
	                    // open the list item
	                    tmp += "<li class='country " + className + "' data-dial-code='" + c.dialCode + "' data-country-code='" + c.iso2 + "'>";
	                    // add the flag
	                    tmp += "<div class='flag'><div class='iti-flag " + c.iso2 + "'></div></div>";
	                    // and the country name and dial code
	                    tmp += "<span class='country-name'>" + c.name + "</span>";
	                    tmp += "<span class='dial-code'>+" + c.dialCode + "</span>";
	                    // close the list item
	                    tmp += "</li>";
	                }
	            }
	            this.countryList.append(tmp);
	        },
	        // set the initial state of the input value and the selected flag
	        _setInitialState: function() {
	            var val = this.telInput.val();
	            // if there is a number, and it's valid, we can go ahead and set the flag, else fall back to default
	            if (this._getDialCode(val)) {
	                this._updateFlagFromNumber(val, true);
	            } else if (this.options.defaultCountry != "auto") {
	                // check the defaultCountry option, else fall back to the first in the list
	                if (this.options.defaultCountry) {
	                    this.options.defaultCountry = this._getCountryData(this.options.defaultCountry.toLowerCase(), false, false);
	                } else {
	                    this.options.defaultCountry = this.preferredCountries.length ? this.preferredCountries[0] : this.countries[0];
	                }
	                this._selectFlag(this.options.defaultCountry.iso2);
	                // if empty, insert the default dial code (this function will check !nationalMode and !autoHideDialCode)
	                if (!val) {
	                    this._updateDialCode(this.options.defaultCountry.dialCode, false);
	                }
	            }
	            // format
	            if (val) {
	                // this wont be run after _updateDialCode as that's only called if no val
	                this._updateVal(val);
	            }
	        },
	        // initialise the main event listeners: input keyup, and click selected flag
	        _initListeners: function() {
	            var that = this;
	            this._initKeyListeners();
	            // autoFormat prevents the change event from firing, so we need to check for changes between focus and blur in order to manually trigger it
	            if (this.options.autoHideDialCode || this.options.autoFormat) {
	                this._initFocusListeners();
	            }
	            if (this.isMobile) {
	                this.countryList.on("change" + this.ns, function(e) {
	                    that._selectListItem($(this).find("option:selected"));
	                });
	            } else {
	                // hack for input nested inside label: clicking the selected-flag to open the dropdown would then automatically trigger a 2nd click on the input which would close it again
	                var label = this.telInput.closest("label");
	                if (label.length) {
	                    label.on("click" + this.ns, function(e) {
	                        // if the dropdown is closed, then focus the input, else ignore the click
	                        if (that.countryList.hasClass("hide")) {
	                            that.telInput.focus();
	                        } else {
	                            e.preventDefault();
	                        }
	                    });
	                }
	                // toggle country dropdown on click
	                var selectedFlag = this.selectedFlagInner.parent();
	                selectedFlag.on("click" + this.ns, function(e) {
	                    // only intercept this event if we're opening the dropdown
	                    // else let it bubble up to the top ("click-off-to-close" listener)
	                    // we cannot just stopPropagation as it may be needed to close another instance
	                    if (that.countryList.hasClass("hide") && !that.telInput.prop("disabled") && !that.telInput.prop("readonly")) {
	                        that._showDropdown();
	                    }
	                });
	            }
	        },
	        _initRequests: function() {
	            var that = this;
	            // if the user has specified the path to the utils script, fetch it on window.load
	            if (this.options.utilsScript) {
	                // if the plugin is being initialised after the window.load event has already been fired
	                if (windowLoaded) {
	                    this.loadUtils();
	                } else {
	                    // wait until the load event so we don't block any other requests e.g. the flags image
	                    $(window).load(function() {
	                        that.loadUtils();
	                    });
	                }
	            } else {
	                this.utilsScriptDeferred.resolve();
	            }
	            if (this.options.defaultCountry == "auto") {
	                this._loadAutoCountry();
	            } else {
	                this.autoCountryDeferred.resolve();
	            }
	        },
	        _loadAutoCountry: function() {
	            var that = this;
	            // check for cookie
	            var cookieAutoCountry = $.cookie ? $.cookie("itiAutoCountry") : "";
	            if (cookieAutoCountry) {
	                $.fn[pluginName].autoCountry = cookieAutoCountry;
	            }
	            // 3 options:
	            // 1) already loaded (we're done)
	            // 2) not already started loading (start)
	            // 3) already started loading (do nothing - just wait for loading callback to fire)
	            if ($.fn[pluginName].autoCountry) {
	                this.autoCountryLoaded();
	            } else if (!$.fn[pluginName].startedLoadingAutoCountry) {
	                // don't do this twice!
	                $.fn[pluginName].startedLoadingAutoCountry = true;
	                var ipinfoURL = "//ipinfo.io";
	                if (this.options.ipinfoToken) {
	                    ipinfoURL += "?token=" + this.options.ipinfoToken;
	                }
	                // dont bother with the success function arg - instead use always() as should still set a defaultCountry even if the lookup fails
	                $.get(ipinfoURL, function() {}, "jsonp").always(function(resp) {
	                    $.fn[pluginName].autoCountry = resp && resp.country ? resp.country.toLowerCase() : "";
	                    if ($.cookie) {
	                        $.cookie("itiAutoCountry", $.fn[pluginName].autoCountry, {
	                            path: "/"
	                        });
	                    }
	                    // tell all instances the auto country is ready
	                    // TODO: this should just be the current instances
	                    $(".intl-tel-input input").intlTelInput("autoCountryLoaded");
	                });
	            }
	        },
	        _initKeyListeners: function() {
	            var that = this;
	            if (this.options.autoFormat) {
	                // format number and update flag on keypress
	                // use keypress event as we want to ignore all input except for a select few keys,
	                // but we dont want to ignore the navigation keys like the arrows etc.
	                // NOTE: no point in refactoring this to only bind these listeners on focus/blur because then you would need to have those 2 listeners running the whole time anyway...
	                this.telInput.on("keypress" + this.ns, function(e) {
	                    // 32 is space, and after that it's all chars (not meta/nav keys)
	                    // this fix is needed for Firefox, which triggers keypress event for some meta/nav keys
	                    // Update: also ignore if this is a metaKey e.g. FF and Safari trigger keypress on the v of Ctrl+v
	                    // Update: also ignore if ctrlKey (FF on Windows/Ubuntu)
	                    // Update: also check that we have utils before we do any autoFormat stuff
	                    if (e.which >= keys.SPACE && !e.ctrlKey && !e.metaKey && window.intlTelInputUtils && !that.telInput.prop("readonly")) {
	                        e.preventDefault();
	                        // allowed keys are just numeric keys and plus
	                        // we must allow plus for the case where the user does select-all and then hits plus to start typing a new number. we could refine this logic to first check that the selection contains a plus, but that wont work in old browsers, and I think it's overkill anyway
	                        var isAllowedKey = e.which >= keys.ZERO && e.which <= keys.NINE || e.which == keys.PLUS, input = that.telInput[0], noSelection = that.isGoodBrowser && input.selectionStart == input.selectionEnd, max = that.telInput.attr("maxlength"), val = that.telInput.val(), // assumes that if max exists, it is >0
	                        isBelowMax = max ? val.length < max : true;
	                        // first: ensure we dont go over maxlength. we must do this here to prevent adding digits in the middle of the number
	                        // still reformat even if not an allowed key as they could by typing a formatting char, but ignore if there's a selection as doesn't make sense to replace selection with illegal char and then immediately remove it
	                        if (isBelowMax && (isAllowedKey || noSelection)) {
	                            var newChar = isAllowedKey ? String.fromCharCode(e.which) : null;
	                            that._handleInputKey(newChar, true, isAllowedKey);
	                            // if something has changed, trigger the input event (which was otherwised squashed by the preventDefault)
	                            if (val != that.telInput.val()) {
	                                that.telInput.trigger("input");
	                            }
	                        }
	                        if (!isAllowedKey) {
	                            that._handleInvalidKey();
	                        }
	                    }
	                });
	            }
	            // handle cut/paste event (now supported in all major browsers)
	            this.telInput.on("cut" + this.ns + " paste" + this.ns, function() {
	                // hack because "paste" event is fired before input is updated
	                setTimeout(function() {
	                    if (that.options.autoFormat && window.intlTelInputUtils) {
	                        var cursorAtEnd = that.isGoodBrowser && that.telInput[0].selectionStart == that.telInput.val().length;
	                        that._handleInputKey(null, cursorAtEnd);
	                        that._ensurePlus();
	                    } else {
	                        // if no autoFormat, just update flag
	                        that._updateFlagFromNumber(that.telInput.val());
	                    }
	                });
	            });
	            // handle keyup event
	            // if autoFormat enabled: we use keyup to catch delete events (after the fact)
	            // if no autoFormat, this is used to update the flag
	            this.telInput.on("keyup" + this.ns, function(e) {
	                // the "enter" key event from selecting a dropdown item is triggered here on the input, because the document.keydown handler that initially handles that event triggers a focus on the input, and so the keyup for that same key event gets triggered here. weird, but just make sure we dont bother doing any re-formatting in this case (we've already done preventDefault in the keydown handler, so it wont actually submit the form or anything).
	                // ALSO: ignore keyup if readonly
	                if (e.which == keys.ENTER || that.telInput.prop("readonly")) {} else if (that.options.autoFormat && window.intlTelInputUtils) {
	                    // cursorAtEnd defaults to false for bad browsers else they would never get a reformat on delete
	                    var cursorAtEnd = that.isGoodBrowser && that.telInput[0].selectionStart == that.telInput.val().length;
	                    if (!that.telInput.val()) {
	                        // if they just cleared the input, update the flag to the default
	                        that._updateFlagFromNumber("");
	                    } else if (e.which == keys.DEL && !cursorAtEnd || e.which == keys.BSPACE) {
	                        // if delete in the middle: reformat with no suffix (no need to reformat if delete at end)
	                        // if backspace: reformat with no suffix (need to reformat if at end to remove any lingering suffix - this is a feature)
	                        // important to remember never to add suffix on any delete key as can fuck up in ie8 so you can never delete a formatting char at the end
	                        that._handleInputKey();
	                    }
	                    that._ensurePlus();
	                } else {
	                    // if no autoFormat, just update flag
	                    that._updateFlagFromNumber(that.telInput.val());
	                }
	            });
	        },
	        // prevent deleting the plus (if not in nationalMode)
	        _ensurePlus: function() {
	            if (!this.options.nationalMode) {
	                var val = this.telInput.val(), input = this.telInput[0];
	                if (val.charAt(0) != "+") {
	                    // newCursorPos is current pos + 1 to account for the plus we are about to add
	                    var newCursorPos = this.isGoodBrowser ? input.selectionStart + 1 : 0;
	                    this.telInput.val("+" + val);
	                    if (this.isGoodBrowser) {
	                        input.setSelectionRange(newCursorPos, newCursorPos);
	                    }
	                }
	            }
	        },
	        // alert the user to an invalid key event
	        _handleInvalidKey: function() {
	            var that = this;
	            this.telInput.trigger("invalidkey").addClass("iti-invalid-key");
	            setTimeout(function() {
	                that.telInput.removeClass("iti-invalid-key");
	            }, 100);
	        },
	        // when autoFormat is enabled: handle various key events on the input:
	        // 1) adding a new number character, which will replace any selection, reformat, and preserve the cursor position
	        // 2) reformatting on backspace/delete
	        // 3) cut/paste event
	        _handleInputKey: function(newNumericChar, addSuffix, isAllowedKey) {
	            var val = this.telInput.val(), cleanBefore = this._getClean(val), originalLeftChars, // raw DOM element
	            input = this.telInput[0], digitsOnRight = 0;
	            if (this.isGoodBrowser) {
	                // cursor strategy: maintain the number of digits on the right. we use the right instead of the left so that A) we dont have to account for the new digit (or multiple digits if paste event), and B) we're always on the right side of formatting suffixes
	                digitsOnRight = this._getDigitsOnRight(val, input.selectionEnd);
	                // if handling a new number character: insert it in the right place
	                if (newNumericChar) {
	                    // replace any selection they may have made with the new char
	                    val = val.substr(0, input.selectionStart) + newNumericChar + val.substring(input.selectionEnd, val.length);
	                } else {
	                    // here we're not handling a new char, we're just doing a re-format (e.g. on delete/backspace/paste, after the fact), but we still need to maintain the cursor position. so make note of the char on the left, and then after the re-format, we'll count in the same number of digits from the right, and then keep going through any formatting chars until we hit the same left char that we had before.
	                    // UPDATE: now have to store 2 chars as extensions formatting contains 2 spaces so you need to be able to distinguish
	                    originalLeftChars = val.substr(input.selectionStart - 2, 2);
	                }
	            } else if (newNumericChar) {
	                val += newNumericChar;
	            }
	            // update the number and flag
	            this.setNumber(val, null, addSuffix, true, isAllowedKey);
	            // update the cursor position
	            if (this.isGoodBrowser) {
	                var newCursor;
	                val = this.telInput.val();
	                // if it was at the end, keep it there
	                if (!digitsOnRight) {
	                    newCursor = val.length;
	                } else {
	                    // else count in the same number of digits from the right
	                    newCursor = this._getCursorFromDigitsOnRight(val, digitsOnRight);
	                    // but if delete/paste etc, keep going left until hit the same left char as before
	                    if (!newNumericChar) {
	                        newCursor = this._getCursorFromLeftChar(val, newCursor, originalLeftChars);
	                    }
	                }
	                // set the new cursor
	                input.setSelectionRange(newCursor, newCursor);
	            }
	        },
	        // we start from the position in guessCursor, and work our way left until we hit the originalLeftChars or a number to make sure that after reformatting the cursor has the same char on the left in the case of a delete etc
	        _getCursorFromLeftChar: function(val, guessCursor, originalLeftChars) {
	            for (var i = guessCursor; i > 0; i--) {
	                var leftChar = val.charAt(i - 1);
	                if ($.isNumeric(leftChar) || val.substr(i - 2, 2) == originalLeftChars) {
	                    return i;
	                }
	            }
	            return 0;
	        },
	        // after a reformat we need to make sure there are still the same number of digits to the right of the cursor
	        _getCursorFromDigitsOnRight: function(val, digitsOnRight) {
	            for (var i = val.length - 1; i >= 0; i--) {
	                if ($.isNumeric(val.charAt(i))) {
	                    if (--digitsOnRight === 0) {
	                        return i;
	                    }
	                }
	            }
	            return 0;
	        },
	        // get the number of numeric digits to the right of the cursor so we can reposition the cursor correctly after the reformat has happened
	        _getDigitsOnRight: function(val, selectionEnd) {
	            var digitsOnRight = 0;
	            for (var i = selectionEnd; i < val.length; i++) {
	                if ($.isNumeric(val.charAt(i))) {
	                    digitsOnRight++;
	                }
	            }
	            return digitsOnRight;
	        },
	        // listen for focus and blur
	        _initFocusListeners: function() {
	            var that = this;
	            if (this.options.autoHideDialCode) {
	                // mousedown decides where the cursor goes, so if we're focusing we must preventDefault as we'll be inserting the dial code, and we want the cursor to be at the end no matter where they click
	                this.telInput.on("mousedown" + this.ns, function(e) {
	                    if (!that.telInput.is(":focus") && !that.telInput.val()) {
	                        e.preventDefault();
	                        // but this also cancels the focus, so we must trigger that manually
	                        that.telInput.focus();
	                    }
	                });
	            }
	            this.telInput.on("focus" + this.ns, function(e) {
	                var value = that.telInput.val();
	                // save this to compare on blur
	                that.telInput.data("focusVal", value);
	                // on focus: if empty, insert the dial code for the currently selected flag
	                if (that.options.autoHideDialCode && !value && !that.telInput.prop("readonly") && that.selectedCountryData.dialCode) {
	                    that._updateVal("+" + that.selectedCountryData.dialCode, null, true);
	                    // after auto-inserting a dial code, if the first key they hit is '+' then assume they are entering a new number, so remove the dial code. use keypress instead of keydown because keydown gets triggered for the shift key (required to hit the + key), and instead of keyup because that shows the new '+' before removing the old one
	                    that.telInput.one("keypress.plus" + that.ns, function(e) {
	                        if (e.which == keys.PLUS) {
	                            // if autoFormat is enabled, this key event will have already have been handled by another keypress listener (hence we need to add the "+"). if disabled, it will be handled after this by a keyup listener (hence no need to add the "+").
	                            var newVal = that.options.autoFormat && window.intlTelInputUtils ? "+" : "";
	                            that.telInput.val(newVal);
	                        }
	                    });
	                    // after tabbing in, make sure the cursor is at the end we must use setTimeout to get outside of the focus handler as it seems the selection happens after that
	                    setTimeout(function() {
	                        var input = that.telInput[0];
	                        if (that.isGoodBrowser) {
	                            var len = that.telInput.val().length;
	                            input.setSelectionRange(len, len);
	                        }
	                    });
	                }
	            });
	            this.telInput.on("blur" + this.ns, function() {
	                if (that.options.autoHideDialCode) {
	                    // on blur: if just a dial code then remove it
	                    var value = that.telInput.val(), startsPlus = value.charAt(0) == "+";
	                    if (startsPlus) {
	                        var numeric = that._getNumeric(value);
	                        // if just a plus, or if just a dial code
	                        if (!numeric || that.selectedCountryData.dialCode == numeric) {
	                            that.telInput.val("");
	                        }
	                    }
	                    // remove the keypress listener we added on focus
	                    that.telInput.off("keypress.plus" + that.ns);
	                }
	                // if autoFormat, we must manually trigger change event if value has changed
	                if (that.options.autoFormat && window.intlTelInputUtils && that.telInput.val() != that.telInput.data("focusVal")) {
	                    that.telInput.trigger("change");
	                }
	            });
	        },
	        // extract the numeric digits from the given string
	        _getNumeric: function(s) {
	            return s.replace(/\D/g, "");
	        },
	        _getClean: function(s) {
	            var prefix = s.charAt(0) == "+" ? "+" : "";
	            return prefix + this._getNumeric(s);
	        },
	        // show the dropdown
	        _showDropdown: function() {
	            this._setDropdownPosition();
	            // update highlighting and scroll to active list item
	            var activeListItem = this.countryList.children(".active");
	            if (activeListItem.length) {
	                this._highlightListItem(activeListItem);
	            }
	            // show it
	            this.countryList.removeClass("hide");
	            if (activeListItem.length) {
	                this._scrollTo(activeListItem);
	            }
	            // bind all the dropdown-related listeners: mouseover, click, click-off, keydown
	            this._bindDropdownListeners();
	            // update the arrow
	            this.selectedFlagInner.children(".arrow").addClass("up");
	        },
	        // decide where to position dropdown (depends on position within viewport, and scroll)
	        _setDropdownPosition: function() {
	            var inputTop = this.telInput.offset().top, windowTop = $(window).scrollTop(), // dropdownFitsBelow = (dropdownBottom < windowBottom)
	            dropdownFitsBelow = inputTop + this.telInput.outerHeight() + this.dropdownHeight < windowTop + $(window).height(), dropdownFitsAbove = inputTop - this.dropdownHeight > windowTop;
	            // dropdownHeight - 1 for border
	            var cssTop = !dropdownFitsBelow && dropdownFitsAbove ? "-" + (this.dropdownHeight - 1) + "px" : "";
	            this.countryList.css("top", cssTop);
	        },
	        // we only bind dropdown listeners when the dropdown is open
	        _bindDropdownListeners: function() {
	            var that = this;
	            // when mouse over a list item, just highlight that one
	            // we add the class "highlight", so if they hit "enter" we know which one to select
	            this.countryList.on("mouseover" + this.ns, ".country", function(e) {
	                that._highlightListItem($(this));
	            });
	            // listen for country selection
	            this.countryList.on("click" + this.ns, ".country", function(e) {
	                that._selectListItem($(this));
	            });
	            // click off to close
	            // (except when this initial opening click is bubbling up)
	            // we cannot just stopPropagation as it may be needed to close another instance
	            var isOpening = true;
	            $("html").on("click" + this.ns, function(e) {
	                if (!isOpening) {
	                    that._closeDropdown();
	                }
	                isOpening = false;
	            });
	            // listen for up/down scrolling, enter to select, or letters to jump to country name.
	            // use keydown as keypress doesn't fire for non-char keys and we want to catch if they
	            // just hit down and hold it to scroll down (no keyup event).
	            // listen on the document because that's where key events are triggered if no input has focus
	            var query = "", queryTimer = null;
	            $(document).on("keydown" + this.ns, function(e) {
	                // prevent down key from scrolling the whole page,
	                // and enter key from submitting a form etc
	                e.preventDefault();
	                if (e.which == keys.UP || e.which == keys.DOWN) {
	                    // up and down to navigate
	                    that._handleUpDownKey(e.which);
	                } else if (e.which == keys.ENTER) {
	                    // enter to select
	                    that._handleEnterKey();
	                } else if (e.which == keys.ESC) {
	                    // esc to close
	                    that._closeDropdown();
	                } else if (e.which >= keys.A && e.which <= keys.Z || e.which == keys.SPACE) {
	                    // upper case letters (note: keyup/keydown only return upper case letters)
	                    // jump to countries that start with the query string
	                    if (queryTimer) {
	                        clearTimeout(queryTimer);
	                    }
	                    query += String.fromCharCode(e.which);
	                    that._searchForCountry(query);
	                    // if the timer hits 1 second, reset the query
	                    queryTimer = setTimeout(function() {
	                        query = "";
	                    }, 1e3);
	                }
	            });
	        },
	        // highlight the next/prev item in the list (and ensure it is visible)
	        _handleUpDownKey: function(key) {
	            var current = this.countryList.children(".highlight").first();
	            var next = key == keys.UP ? current.prev() : current.next();
	            if (next.length) {
	                // skip the divider
	                if (next.hasClass("divider")) {
	                    next = key == keys.UP ? next.prev() : next.next();
	                }
	                this._highlightListItem(next);
	                this._scrollTo(next);
	            }
	        },
	        // select the currently highlighted item
	        _handleEnterKey: function() {
	            var currentCountry = this.countryList.children(".highlight").first();
	            if (currentCountry.length) {
	                this._selectListItem(currentCountry);
	            }
	        },
	        // find the first list item whose name starts with the query string
	        _searchForCountry: function(query) {
	            for (var i = 0; i < this.countries.length; i++) {
	                if (this._startsWith(this.countries[i].name, query)) {
	                    var listItem = this.countryList.children("[data-country-code=" + this.countries[i].iso2 + "]").not(".preferred");
	                    // update highlighting and scroll
	                    this._highlightListItem(listItem);
	                    this._scrollTo(listItem, true);
	                    break;
	                }
	            }
	        },
	        // check if (uppercase) string a starts with string b
	        _startsWith: function(a, b) {
	            return a.substr(0, b.length).toUpperCase() == b;
	        },
	        // update the input's value to the given val
	        // if autoFormat=true, format it first according to the country-specific formatting rules
	        // Note: preventConversion will be false (i.e. we allow conversion) on init and when dev calls public method setNumber
	        _updateVal: function(val, format, addSuffix, preventConversion, isAllowedKey) {
	            var formatted;
	            if (this.options.autoFormat && window.intlTelInputUtils && this.selectedCountryData) {
	                if (typeof format == "number" && intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
	                    // if user specified a format, and it's a valid number, then format it accordingly
	                    formatted = intlTelInputUtils.formatNumberByType(val, this.selectedCountryData.iso2, format);
	                } else if (!preventConversion && this.options.nationalMode && val.charAt(0) == "+" && intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
	                    // if nationalMode and we have a valid intl number, convert it to ntl
	                    formatted = intlTelInputUtils.formatNumberByType(val, this.selectedCountryData.iso2, intlTelInputUtils.numberFormat.NATIONAL);
	                } else {
	                    // else do the regular AsYouType formatting
	                    formatted = intlTelInputUtils.formatNumber(val, this.selectedCountryData.iso2, addSuffix, this.options.allowExtensions, isAllowedKey);
	                }
	                // ensure we dont go over maxlength. we must do this here to truncate any formatting suffix, and also handle paste events
	                var max = this.telInput.attr("maxlength");
	                if (max && formatted.length > max) {
	                    formatted = formatted.substr(0, max);
	                }
	            } else {
	                // no autoFormat, so just insert the original value
	                formatted = val;
	            }
	            this.telInput.val(formatted);
	        },
	        // check if need to select a new flag based on the given number
	        _updateFlagFromNumber: function(number, updateDefault) {
	            // if we're in nationalMode and we're on US/Canada, make sure the number starts with a +1 so _getDialCode will be able to extract the area code
	            // update: if we dont yet have selectedCountryData, but we're here (trying to update the flag from the number), that means we're initialising the plugin with a number that already has a dial code, so fine to ignore this bit
	            if (number && this.options.nationalMode && this.selectedCountryData && this.selectedCountryData.dialCode == "1" && number.charAt(0) != "+") {
	                if (number.charAt(0) != "1") {
	                    number = "1" + number;
	                }
	                number = "+" + number;
	            }
	            // try and extract valid dial code from input
	            var dialCode = this._getDialCode(number), countryCode = null;
	            if (dialCode) {
	                // check if one of the matching countries is already selected
	                var countryCodes = this.countryCodes[this._getNumeric(dialCode)], alreadySelected = this.selectedCountryData && $.inArray(this.selectedCountryData.iso2, countryCodes) != -1;
	                // if a matching country is not already selected (or this is an unknown NANP area code): choose the first in the list
	                if (!alreadySelected || this._isUnknownNanp(number, dialCode)) {
	                    // if using onlyCountries option, countryCodes[0] may be empty, so we must find the first non-empty index
	                    for (var j = 0; j < countryCodes.length; j++) {
	                        if (countryCodes[j]) {
	                            countryCode = countryCodes[j];
	                            break;
	                        }
	                    }
	                }
	            } else if (number.charAt(0) == "+" && this._getNumeric(number).length) {
	                // invalid dial code, so empty
	                // Note: use getNumeric here because the number has not been formatted yet, so could contain bad shit
	                countryCode = "";
	            } else if (!number || number == "+") {
	                // empty, or just a plus, so default
	                countryCode = this.options.defaultCountry.iso2;
	            }
	            if (countryCode !== null) {
	                this._selectFlag(countryCode, updateDefault);
	            }
	        },
	        // check if the given number contains an unknown area code from the North American Numbering Plan i.e. the only dialCode that could be extracted was +1 but the actual number's length is >=4
	        _isUnknownNanp: function(number, dialCode) {
	            return dialCode == "+1" && this._getNumeric(number).length >= 4;
	        },
	        // remove highlighting from other list items and highlight the given item
	        _highlightListItem: function(listItem) {
	            this.countryListItems.removeClass("highlight");
	            listItem.addClass("highlight");
	        },
	        // find the country data for the given country code
	        // the ignoreOnlyCountriesOption is only used during init() while parsing the onlyCountries array
	        _getCountryData: function(countryCode, ignoreOnlyCountriesOption, allowFail) {
	            var countryList = ignoreOnlyCountriesOption ? allCountries : this.countries;
	            for (var i = 0; i < countryList.length; i++) {
	                if (countryList[i].iso2 == countryCode) {
	                    return countryList[i];
	                }
	            }
	            if (allowFail) {
	                return null;
	            } else {
	                throw new Error("No country data for '" + countryCode + "'");
	            }
	        },
	        // select the given flag, update the placeholder and the active list item
	        _selectFlag: function(countryCode, updateDefault) {
	            // do this first as it will throw an error and stop if countryCode is invalid
	            this.selectedCountryData = countryCode ? this._getCountryData(countryCode, false, false) : {};
	            // update the "defaultCountry" - we only need the iso2 from now on, so just store that
	            if (updateDefault && this.selectedCountryData.iso2) {
	                // can't just make this equal to selectedCountryData as would be a ref to that object
	                this.options.defaultCountry = {
	                    iso2: this.selectedCountryData.iso2
	                };
	            }
	            this.selectedFlagInner.attr("class", "iti-flag " + countryCode);
	            // update the selected country's title attribute
	            var title = countryCode ? this.selectedCountryData.name + ": +" + this.selectedCountryData.dialCode : "Unknown";
	            this.selectedFlagInner.parent().attr("title", title);
	            // and the input's placeholder
	            this._updatePlaceholder();
	            if (this.isMobile) {
	                this.countryList.val(countryCode);
	            } else {
	                // update the active list item
	                this.countryListItems.removeClass("active");
	                if (countryCode) {
	                    this.countryListItems.find(".iti-flag." + countryCode).first().closest(".country").addClass("active");
	                }
	            }
	        },
	        // update the input placeholder to an example number from the currently selected country
	        _updatePlaceholder: function() {
	            if (window.intlTelInputUtils && !this.hadInitialPlaceholder && this.options.autoPlaceholder && this.selectedCountryData) {
	                var iso2 = this.selectedCountryData.iso2, numberType = intlTelInputUtils.numberType[this.options.numberType || "FIXED_LINE"], placeholder = iso2 ? intlTelInputUtils.getExampleNumber(iso2, this.options.nationalMode, numberType) : "";
	                this.telInput.attr("placeholder", placeholder);
	            }
	        },
	        // called when the user selects a list item from the dropdown
	        _selectListItem: function(listItem) {
	            var countryCodeAttr = this.isMobile ? "value" : "data-country-code";
	            // update selected flag and active list item
	            this._selectFlag(listItem.attr(countryCodeAttr), true);
	            if (!this.isMobile) {
	                this._closeDropdown();
	            }
	            this._updateDialCode(listItem.attr("data-dial-code"), true);
	            // always fire the change event as even if nationalMode=true (and we haven't updated the input val), the system as a whole has still changed - see country-sync example. think of it as making a selection from a select element.
	            this.telInput.trigger("change");
	            // focus the input
	            this.telInput.focus();
	            // fix for FF and IE11 (with nationalMode=false i.e. auto inserting dial code), who try to put the cursor at the beginning the first time
	            if (this.isGoodBrowser) {
	                var len = this.telInput.val().length;
	                this.telInput[0].setSelectionRange(len, len);
	            }
	        },
	        // close the dropdown and unbind any listeners
	        _closeDropdown: function() {
	            this.countryList.addClass("hide");
	            // update the arrow
	            this.selectedFlagInner.children(".arrow").removeClass("up");
	            // unbind key events
	            $(document).off(this.ns);
	            // unbind click-off-to-close
	            $("html").off(this.ns);
	            // unbind hover and click listeners
	            this.countryList.off(this.ns);
	        },
	        // check if an element is visible within it's container, else scroll until it is
	        _scrollTo: function(element, middle) {
	            var container = this.countryList, containerHeight = container.height(), containerTop = container.offset().top, containerBottom = containerTop + containerHeight, elementHeight = element.outerHeight(), elementTop = element.offset().top, elementBottom = elementTop + elementHeight, newScrollTop = elementTop - containerTop + container.scrollTop(), middleOffset = containerHeight / 2 - elementHeight / 2;
	            if (elementTop < containerTop) {
	                // scroll up
	                if (middle) {
	                    newScrollTop -= middleOffset;
	                }
	                container.scrollTop(newScrollTop);
	            } else if (elementBottom > containerBottom) {
	                // scroll down
	                if (middle) {
	                    newScrollTop += middleOffset;
	                }
	                var heightDifference = containerHeight - elementHeight;
	                container.scrollTop(newScrollTop - heightDifference);
	            }
	        },
	        // replace any existing dial code with the new one (if not in nationalMode)
	        // also we need to know if we're focusing for a couple of reasons e.g. if so, we want to add any formatting suffix, also if the input is empty and we're not in nationalMode, then we want to insert the dial code
	        _updateDialCode: function(newDialCode, focusing) {
	            var inputVal = this.telInput.val(), newNumber;
	            // save having to pass this every time
	            newDialCode = "+" + newDialCode;
	            if (this.options.nationalMode && inputVal.charAt(0) != "+") {
	                // if nationalMode, we just want to re-format
	                newNumber = inputVal;
	            } else if (inputVal) {
	                // if the previous number contained a valid dial code, replace it
	                // (if more than just a plus character)
	                var prevDialCode = this._getDialCode(inputVal);
	                if (prevDialCode.length > 1) {
	                    newNumber = inputVal.replace(prevDialCode, newDialCode);
	                } else {
	                    // if the previous number didn't contain a dial code, we should persist it
	                    var existingNumber = inputVal.charAt(0) != "+" ? $.trim(inputVal) : "";
	                    newNumber = newDialCode + existingNumber;
	                }
	            } else {
	                newNumber = !this.options.autoHideDialCode || focusing ? newDialCode : "";
	            }
	            this._updateVal(newNumber, null, focusing);
	        },
	        // try and extract a valid international dial code from a full telephone number
	        // Note: returns the raw string inc plus character and any whitespace/dots etc
	        _getDialCode: function(number) {
	            var dialCode = "";
	            // only interested in international numbers (starting with a plus)
	            if (number.charAt(0) == "+") {
	                var numericChars = "";
	                // iterate over chars
	                for (var i = 0; i < number.length; i++) {
	                    var c = number.charAt(i);
	                    // if char is number
	                    if ($.isNumeric(c)) {
	                        numericChars += c;
	                        // if current numericChars make a valid dial code
	                        if (this.countryCodes[numericChars]) {
	                            // store the actual raw string (useful for matching later)
	                            dialCode = number.substr(0, i + 1);
	                        }
	                        // longest dial code is 4 chars
	                        if (numericChars.length == 4) {
	                            break;
	                        }
	                    }
	                }
	            }
	            return dialCode;
	        },
	        /********************
	   *  PUBLIC METHODS
	   ********************/
	        // this is called when the ipinfo call returns
	        autoCountryLoaded: function() {
	            if (this.options.defaultCountry == "auto") {
	                this.options.defaultCountry = $.fn[pluginName].autoCountry;
	                this._setInitialState();
	                this.autoCountryDeferred.resolve();
	            }
	        },
	        // remove plugin
	        destroy: function() {
	            if (!this.isMobile) {
	                // make sure the dropdown is closed (and unbind listeners)
	                this._closeDropdown();
	            }
	            // key events, and focus/blur events if autoHideDialCode=true
	            this.telInput.off(this.ns);
	            if (this.isMobile) {
	                // change event on select country
	                this.countryList.off(this.ns);
	            } else {
	                // click event to open dropdown
	                this.selectedFlagInner.parent().off(this.ns);
	                // label click hack
	                this.telInput.closest("label").off(this.ns);
	            }
	            // remove markup
	            var container = this.telInput.parent();
	            container.before(this.telInput).remove();
	        },
	        // extract the phone number extension if present
	        getExtension: function() {
	            return this.telInput.val().split(" ext. ")[1] || "";
	        },
	        // format the number to the given type
	        getNumber: function(type) {
	            if (window.intlTelInputUtils) {
	                return intlTelInputUtils.formatNumberByType(this.telInput.val(), this.selectedCountryData.iso2, type);
	            }
	            return "";
	        },
	        // get the type of the entered number e.g. landline/mobile
	        getNumberType: function() {
	            if (window.intlTelInputUtils) {
	                return intlTelInputUtils.getNumberType(this.telInput.val(), this.selectedCountryData.iso2);
	            }
	            return -99;
	        },
	        // get the country data for the currently selected flag
	        getSelectedCountryData: function() {
	            // if this is undefined, the plugin will return it's instance instead, so in that case an empty object makes more sense
	            return this.selectedCountryData || {};
	        },
	        // get the validation error
	        getValidationError: function() {
	            if (window.intlTelInputUtils) {
	                return intlTelInputUtils.getValidationError(this.telInput.val(), this.selectedCountryData.iso2);
	            }
	            return -99;
	        },
	        // validate the input val - assumes the global function isValidNumber (from utilsScript)
	        isValidNumber: function() {
	            var val = $.trim(this.telInput.val()), countryCode = this.options.nationalMode ? this.selectedCountryData.iso2 : "";
	            if (window.intlTelInputUtils) {
	                return intlTelInputUtils.isValidNumber(val, countryCode);
	            }
	            return false;
	        },
	        // load the utils script
	        loadUtils: function(path) {
	            var that = this;
	            var utilsScript = path || this.options.utilsScript;
	            if (!$.fn[pluginName].loadedUtilsScript && utilsScript) {
	                // don't do this twice! (dont just check if the global intlTelInputUtils exists as if init plugin multiple times in quick succession, it may not have finished loading yet)
	                $.fn[pluginName].loadedUtilsScript = true;
	                // dont use $.getScript as it prevents caching
	                $.ajax({
	                    url: utilsScript,
	                    success: function() {
	                        // tell all instances the utils are ready
	                        $(".intl-tel-input input").intlTelInput("utilsLoaded");
	                    },
	                    complete: function() {
	                        that.utilsScriptDeferred.resolve();
	                    },
	                    dataType: "script",
	                    cache: true
	                });
	            } else {
	                this.utilsScriptDeferred.resolve();
	            }
	        },
	        // update the selected flag, and update the input val accordingly
	        selectCountry: function(countryCode) {
	            countryCode = countryCode.toLowerCase();
	            // check if already selected
	            if (!this.selectedFlagInner.hasClass(countryCode)) {
	                this._selectFlag(countryCode, true);
	                this._updateDialCode(this.selectedCountryData.dialCode, false);
	            }
	        },
	        // set the input value and update the flag
	        setNumber: function(number, format, addSuffix, preventConversion, isAllowedKey) {
	            // ensure starts with plus
	            if (!this.options.nationalMode && number.charAt(0) != "+") {
	                number = "+" + number;
	            }
	            // we must update the flag first, which updates this.selectedCountryData, which is used later for formatting the number before displaying it
	            this._updateFlagFromNumber(number);
	            this._updateVal(number, format, addSuffix, preventConversion, isAllowedKey);
	        },
	        // this is called when the utils are ready
	        utilsLoaded: function() {
	            // if autoFormat is enabled and there's an initial value in the input, then format it
	            if (this.options.autoFormat && this.telInput.val()) {
	                this._updateVal(this.telInput.val());
	            }
	            this._updatePlaceholder();
	        }
	    };
	    // adapted to allow public functions
	    // using https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/Extending-jQuery-Boilerplate
	    $.fn[pluginName] = function(options) {
	        var args = arguments;
	        // Is the first parameter an object (options), or was omitted,
	        // instantiate a new instance of the plugin.
	        if (options === undefined || typeof options === "object") {
	            var deferreds = [];
	            this.each(function() {
	                if (!$.data(this, "plugin_" + pluginName)) {
	                    var instance = new Plugin(this, options);
	                    var instanceDeferreds = instance._init();
	                    // we now have 2 deffereds: 1 for auto country, 1 for utils script
	                    deferreds.push(instanceDeferreds[0]);
	                    deferreds.push(instanceDeferreds[1]);
	                    $.data(this, "plugin_" + pluginName, instance);
	                }
	            });
	            // return the promise from the "master" deferred object that tracks all the others
	            return $.when.apply(null, deferreds);
	        } else if (typeof options === "string" && options[0] !== "_") {
	            // If the first parameter is a string and it doesn't start
	            // with an underscore or "contains" the `init`-function,
	            // treat this as a call to a public method.
	            // Cache the method call to make it possible to return a value
	            var returns;
	            this.each(function() {
	                var instance = $.data(this, "plugin_" + pluginName);
	                // Tests that there's already a plugin-instance
	                // and checks that the requested public method exists
	                if (instance instanceof Plugin && typeof instance[options] === "function") {
	                    // Call the method of our plugin instance,
	                    // and pass it the supplied arguments.
	                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
	                }
	                // Allow instances to be destroyed via the 'destroy' method
	                if (options === "destroy") {
	                    $.data(this, "plugin_" + pluginName, null);
	                }
	            });
	            // If the earlier cached method gives a value back return the value,
	            // otherwise return this to preserve chainability.
	            return returns !== undefined ? returns : this;
	        }
	    };
	    /********************
	 *  STATIC METHODS
	 ********************/
	    // get the country data object
	    $.fn[pluginName].getCountryData = function() {
	        return allCountries;
	    };
	    // Tell JSHint to ignore this warning: "character may get silently deleted by one or more browsers"
	    // jshint -W100
	    // Array of country objects for the flag dropdown.
	    // Each contains a name, country code (ISO 3166-1 alpha-2) and dial code.
	    // Originally from https://github.com/mledoze/countries
	    // then modified using the following JavaScript (NOW OUT OF DATE):
	    /*
	var result = [];
	_.each(countries, function(c) {
	  // ignore countries without a dial code
	  if (c.callingCode[0].length) {
	    result.push({
	      // var locals contains country names with localised versions in brackets
	      n: _.findWhere(locals, {
	        countryCode: c.cca2
	      }).name,
	      i: c.cca2.toLowerCase(),
	      d: c.callingCode[0]
	    });
	  }
	});
	JSON.stringify(result);
	*/
	    // then with a couple of manual re-arrangements to be alphabetical
	    // then changed Kazakhstan from +76 to +7
	    // and Vatican City from +379 to +39 (see issue 50)
	    // and Caribean Netherlands from +5997 to +599
	    // and Curacao from +5999 to +599
	    // Removed: Åland Islands, Christmas Island, Cocos Islands, Guernsey, Isle of Man, Jersey, Kosovo, Mayotte, Pitcairn Islands, South Georgia, Svalbard, Western Sahara
	    // Update: converted objects to arrays to save bytes!
	    // Update: added "priority" for countries with the same dialCode as others
	    // Update: added array of area codes for countries with the same dialCode as others
	    // So each country array has the following information:
	    // [
	    //    Country name,
	    //    iso2 code,
	    //    International dial code,
	    //    Order (if >1 country with same dial code),
	    //    Area codes (if >1 country with same dial code)
	    // ]
	    var allCountries = [ [ "Afghanistan (‫افغانستان‬‎)", "af", "93" ], [ "Albania (Shqipëri)", "al", "355" ], [ "Algeria (‫الجزائر‬‎)", "dz", "213" ], [ "American Samoa", "as", "1684" ], [ "Andorra", "ad", "376" ], [ "Angola", "ao", "244" ], [ "Anguilla", "ai", "1264" ], [ "Antigua and Barbuda", "ag", "1268" ], [ "Argentina", "ar", "54" ], [ "Armenia (Հայաստան)", "am", "374" ], [ "Aruba", "aw", "297" ], [ "Australia", "au", "61" ], [ "Austria (Österreich)", "at", "43" ], [ "Azerbaijan (Azərbaycan)", "az", "994" ], [ "Bahamas", "bs", "1242" ], [ "Bahrain (‫البحرين‬‎)", "bh", "973" ], [ "Bangladesh (বাংলাদেশ)", "bd", "880" ], [ "Barbados", "bb", "1246" ], [ "Belarus (Беларусь)", "by", "375" ], [ "Belgium (België)", "be", "32" ], [ "Belize", "bz", "501" ], [ "Benin (Bénin)", "bj", "229" ], [ "Bermuda", "bm", "1441" ], [ "Bhutan (འབྲུག)", "bt", "975" ], [ "Bolivia", "bo", "591" ], [ "Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387" ], [ "Botswana", "bw", "267" ], [ "Brazil (Brasil)", "br", "55" ], [ "British Indian Ocean Territory", "io", "246" ], [ "British Virgin Islands", "vg", "1284" ], [ "Brunei", "bn", "673" ], [ "Bulgaria (България)", "bg", "359" ], [ "Burkina Faso", "bf", "226" ], [ "Burundi (Uburundi)", "bi", "257" ], [ "Cambodia (កម្ពុជា)", "kh", "855" ], [ "Cameroon (Cameroun)", "cm", "237" ], [ "Canada", "ca", "1", 1, [ "204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905" ] ], [ "Cape Verde (Kabu Verdi)", "cv", "238" ], [ "Caribbean Netherlands", "bq", "599", 1 ], [ "Cayman Islands", "ky", "1345" ], [ "Central African Republic (République centrafricaine)", "cf", "236" ], [ "Chad (Tchad)", "td", "235" ], [ "Chile", "cl", "56" ], [ "China (中国)", "cn", "86" ], [ "Colombia", "co", "57" ], [ "Comoros (‫جزر القمر‬‎)", "km", "269" ], [ "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243" ], [ "Congo (Republic) (Congo-Brazzaville)", "cg", "242" ], [ "Cook Islands", "ck", "682" ], [ "Costa Rica", "cr", "506" ], [ "Côte d’Ivoire", "ci", "225" ], [ "Croatia (Hrvatska)", "hr", "385" ], [ "Cuba", "cu", "53" ], [ "Curaçao", "cw", "599", 0 ], [ "Cyprus (Κύπρος)", "cy", "357" ], [ "Czech Republic (Česká republika)", "cz", "420" ], [ "Denmark (Danmark)", "dk", "45" ], [ "Djibouti", "dj", "253" ], [ "Dominica", "dm", "1767" ], [ "Dominican Republic (República Dominicana)", "do", "1", 2, [ "809", "829", "849" ] ], [ "Ecuador", "ec", "593" ], [ "Egypt (‫مصر‬‎)", "eg", "20" ], [ "El Salvador", "sv", "503" ], [ "Equatorial Guinea (Guinea Ecuatorial)", "gq", "240" ], [ "Eritrea", "er", "291" ], [ "Estonia (Eesti)", "ee", "372" ], [ "Ethiopia", "et", "251" ], [ "Falkland Islands (Islas Malvinas)", "fk", "500" ], [ "Faroe Islands (Føroyar)", "fo", "298" ], [ "Fiji", "fj", "679" ], [ "Finland (Suomi)", "fi", "358" ], [ "France", "fr", "33" ], [ "French Guiana (Guyane française)", "gf", "594" ], [ "French Polynesia (Polynésie française)", "pf", "689" ], [ "Gabon", "ga", "241" ], [ "Gambia", "gm", "220" ], [ "Georgia (საქართველო)", "ge", "995" ], [ "Germany (Deutschland)", "de", "49" ], [ "Ghana (Gaana)", "gh", "233" ], [ "Gibraltar", "gi", "350" ], [ "Greece (Ελλάδα)", "gr", "30" ], [ "Greenland (Kalaallit Nunaat)", "gl", "299" ], [ "Grenada", "gd", "1473" ], [ "Guadeloupe", "gp", "590", 0 ], [ "Guam", "gu", "1671" ], [ "Guatemala", "gt", "502" ], [ "Guinea (Guinée)", "gn", "224" ], [ "Guinea-Bissau (Guiné Bissau)", "gw", "245" ], [ "Guyana", "gy", "592" ], [ "Haiti", "ht", "509" ], [ "Honduras", "hn", "504" ], [ "Hong Kong (香港)", "hk", "852" ], [ "Hungary (Magyarország)", "hu", "36" ], [ "Iceland (Ísland)", "is", "354" ], [ "India (भारत)", "in", "91" ], [ "Indonesia", "id", "62" ], [ "Iran (‫ایران‬‎)", "ir", "98" ], [ "Iraq (‫العراق‬‎)", "iq", "964" ], [ "Ireland", "ie", "353" ], [ "Israel (‫ישראל‬‎)", "il", "972" ], [ "Italy (Italia)", "it", "39", 0 ], [ "Jamaica", "jm", "1876" ], [ "Japan (日本)", "jp", "81" ], [ "Jordan (‫الأردن‬‎)", "jo", "962" ], [ "Kazakhstan (Казахстан)", "kz", "7", 1 ], [ "Kenya", "ke", "254" ], [ "Kiribati", "ki", "686" ], [ "Kuwait (‫الكويت‬‎)", "kw", "965" ], [ "Kyrgyzstan (Кыргызстан)", "kg", "996" ], [ "Laos (ລາວ)", "la", "856" ], [ "Latvia (Latvija)", "lv", "371" ], [ "Lebanon (‫لبنان‬‎)", "lb", "961" ], [ "Lesotho", "ls", "266" ], [ "Liberia", "lr", "231" ], [ "Libya (‫ليبيا‬‎)", "ly", "218" ], [ "Liechtenstein", "li", "423" ], [ "Lithuania (Lietuva)", "lt", "370" ], [ "Luxembourg", "lu", "352" ], [ "Macau (澳門)", "mo", "853" ], [ "Macedonia (FYROM) (Македонија)", "mk", "389" ], [ "Madagascar (Madagasikara)", "mg", "261" ], [ "Malawi", "mw", "265" ], [ "Malaysia", "my", "60" ], [ "Maldives", "mv", "960" ], [ "Mali", "ml", "223" ], [ "Malta", "mt", "356" ], [ "Marshall Islands", "mh", "692" ], [ "Martinique", "mq", "596" ], [ "Mauritania (‫موريتانيا‬‎)", "mr", "222" ], [ "Mauritius (Moris)", "mu", "230" ], [ "Mexico (México)", "mx", "52" ], [ "Micronesia", "fm", "691" ], [ "Moldova (Republica Moldova)", "md", "373" ], [ "Monaco", "mc", "377" ], [ "Mongolia (Монгол)", "mn", "976" ], [ "Montenegro (Crna Gora)", "me", "382" ], [ "Montserrat", "ms", "1664" ], [ "Morocco (‫المغرب‬‎)", "ma", "212" ], [ "Mozambique (Moçambique)", "mz", "258" ], [ "Myanmar (Burma) (မြန်မာ)", "mm", "95" ], [ "Namibia (Namibië)", "na", "264" ], [ "Nauru", "nr", "674" ], [ "Nepal (नेपाल)", "np", "977" ], [ "Netherlands (Nederland)", "nl", "31" ], [ "New Caledonia (Nouvelle-Calédonie)", "nc", "687" ], [ "New Zealand", "nz", "64" ], [ "Nicaragua", "ni", "505" ], [ "Niger (Nijar)", "ne", "227" ], [ "Nigeria", "ng", "234" ], [ "Niue", "nu", "683" ], [ "Norfolk Island", "nf", "672" ], [ "North Korea (조선 민주주의 인민 공화국)", "kp", "850" ], [ "Northern Mariana Islands", "mp", "1670" ], [ "Norway (Norge)", "no", "47" ], [ "Oman (‫عُمان‬‎)", "om", "968" ], [ "Pakistan (‫پاکستان‬‎)", "pk", "92" ], [ "Palau", "pw", "680" ], [ "Palestine (‫فلسطين‬‎)", "ps", "970" ], [ "Panama (Panamá)", "pa", "507" ], [ "Papua New Guinea", "pg", "675" ], [ "Paraguay", "py", "595" ], [ "Peru (Perú)", "pe", "51" ], [ "Philippines", "ph", "63" ], [ "Poland (Polska)", "pl", "48" ], [ "Portugal", "pt", "351" ], [ "Puerto Rico", "pr", "1", 3, [ "787", "939" ] ], [ "Qatar (‫قطر‬‎)", "qa", "974" ], [ "Réunion (La Réunion)", "re", "262" ], [ "Romania (România)", "ro", "40" ], [ "Russia (Россия)", "ru", "7", 0 ], [ "Rwanda", "rw", "250" ], [ "Saint Barthélemy (Saint-Barthélemy)", "bl", "590", 1 ], [ "Saint Helena", "sh", "290" ], [ "Saint Kitts and Nevis", "kn", "1869" ], [ "Saint Lucia", "lc", "1758" ], [ "Saint Martin (Saint-Martin (partie française))", "mf", "590", 2 ], [ "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508" ], [ "Saint Vincent and the Grenadines", "vc", "1784" ], [ "Samoa", "ws", "685" ], [ "San Marino", "sm", "378" ], [ "São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239" ], [ "Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966" ], [ "Senegal (Sénégal)", "sn", "221" ], [ "Serbia (Србија)", "rs", "381" ], [ "Seychelles", "sc", "248" ], [ "Sierra Leone", "sl", "232" ], [ "Singapore", "sg", "65" ], [ "Sint Maarten", "sx", "1721" ], [ "Slovakia (Slovensko)", "sk", "421" ], [ "Slovenia (Slovenija)", "si", "386" ], [ "Solomon Islands", "sb", "677" ], [ "Somalia (Soomaaliya)", "so", "252" ], [ "South Africa", "za", "27" ], [ "South Korea (대한민국)", "kr", "82" ], [ "South Sudan (‫جنوب السودان‬‎)", "ss", "211" ], [ "Spain (España)", "es", "34" ], [ "Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94" ], [ "Sudan (‫السودان‬‎)", "sd", "249" ], [ "Suriname", "sr", "597" ], [ "Swaziland", "sz", "268" ], [ "Sweden (Sverige)", "se", "46" ], [ "Switzerland (Schweiz)", "ch", "41" ], [ "Syria (‫سوريا‬‎)", "sy", "963" ], [ "Taiwan (台灣)", "tw", "886" ], [ "Tajikistan", "tj", "992" ], [ "Tanzania", "tz", "255" ], [ "Thailand (ไทย)", "th", "66" ], [ "Timor-Leste", "tl", "670" ], [ "Togo", "tg", "228" ], [ "Tokelau", "tk", "690" ], [ "Tonga", "to", "676" ], [ "Trinidad and Tobago", "tt", "1868" ], [ "Tunisia (‫تونس‬‎)", "tn", "216" ], [ "Turkey (Türkiye)", "tr", "90" ], [ "Turkmenistan", "tm", "993" ], [ "Turks and Caicos Islands", "tc", "1649" ], [ "Tuvalu", "tv", "688" ], [ "U.S. Virgin Islands", "vi", "1340" ], [ "Uganda", "ug", "256" ], [ "Ukraine (Україна)", "ua", "380" ], [ "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971" ], [ "United Kingdom", "gb", "44" ], [ "United States", "us", "1", 0 ], [ "Uruguay", "uy", "598" ], [ "Uzbekistan (Oʻzbekiston)", "uz", "998" ], [ "Vanuatu", "vu", "678" ], [ "Vatican City (Città del Vaticano)", "va", "39", 1 ], [ "Venezuela", "ve", "58" ], [ "Vietnam (Việt Nam)", "vn", "84" ], [ "Wallis and Futuna", "wf", "681" ], [ "Yemen (‫اليمن‬‎)", "ye", "967" ], [ "Zambia", "zm", "260" ], [ "Zimbabwe", "zw", "263" ] ];
	    // loop over all of the countries above
	    for (var i = 0; i < allCountries.length; i++) {
	        var c = allCountries[i];
	        allCountries[i] = {
	            name: c[0],
	            iso2: c[1],
	            dialCode: c[2],
	            priority: c[3] || 0,
	            areaCodes: c[4] || null
	        };
	    }
	});

/***/ },

/***/ 377:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        moment = __webpack_require__(44),
	        _ = __webpack_require__(30)
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(378),
	    data: function () {
	
	        return {
	        }
	
	    },
	    oninit: function (options) {
	        
	        
	        
	    },
	    edit:function(){
	        //console.log("Inside edit");
	        this.set('myprofile.edit', true);
	    },
	    oncomplete: function () {
	//        this.observe('mytraveller.currentTraveller', function(value) {
	//            console.log("Inside view currentTraveller changed");
	//            console.log(value);
	//            
	//        }, {init: true});
	//        this.observe('mytraveller.currentTravellerId', function(value) {
	//            //console.log("currentTravellerId changed ");
	//            //console.log(value);
	//            //this.get('mytraveller').set('currentTravellerId', value);
	//        }, {init: false});
	    }
	});

/***/ },

/***/ 378:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"h1","f":["My Profile"]}," ",{"t":7,"e":"div","a":{"class":[{"t":4,"f":["ui segment loading"],"n":50,"r":"myprofile.pending"}]},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"user-info"},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"myprofile.baseUrl"},"/themes/B2C/img/guest.png"],"alt":""}}," ",{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"r":"myprofile.name"}]}," ",{"t":7,"e":"div","a":{"class":"customer-id"},"f":["User Id: ",{"t":2,"r":"myprofile.id"}]}," ",{"t":7,"e":"div","a":{"class":"phone"},"f":["Mobile No: ",{"t":2,"r":"myprofile.mobile"}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"button","v":{"click":{"m":"edit","a":{"r":[],"s":"[]"}}},"a":{"class":"small gray"},"f":["Edit"]}," "]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Email Address"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.email"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Mobile Number"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.mobile"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Address"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.address"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["City"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.city"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["State"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.state"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Country"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.country"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Pincode"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.pincode"}]}]}]}]}],"n":50,"r":"myprofile"},{"t":4,"n":51,"f":[],"r":"myprofile"}],"n":50,"x":{"r":["myprofile.pending"],"s":"!_0"}}]}]};

/***/ },

/***/ 379:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZS5qcz9kYzdhKioiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzP2Y2YjUqKioqKiIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qcz8wYmJhKioqKioiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2VtYWlsLmpzPzQ5NDYqIiwid2VicGFjazovLy8uL3ZlbmRvci9tYWlsY2hlY2svc3JjL21haWxjaGVjay5qcz80ZDZmKiIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vc3Bpbm5lci5qcz80MDljKiIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL3NwaW5uZXIuaHRtbD9hMTU3KiIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL215cHJvZmlsZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL215cHJvZmlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL2luZGV4Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXByb2ZpbGUvZm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL2Zvcm0uaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vdGVsLmpzIiwid2VicGFjazovLy8uL3ZlbmRvci9pbnRsLXRlbC1pbnB1dC9idWlsZC9qcy9pbnRsVGVsSW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXByb2ZpbGUvdmlldy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL3ZpZXcuaHRtbCIsIndlYnBhY2s6Ly8vLi9sZXNzL3dlYi9tb2R1bGVzL215dHJhdmVs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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7Ozs7QUMxb0NEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxNQUFLO0FBQ0w7Ozs7QUFJQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLEdBQUcsV0FBVztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsR0FBRyxZQUFZO0FBQzFCO0FBQ0EsRUFBQyxFOzs7Ozs7O0FDNUNELGlCQUFnQixZQUFZLGtDQUFrQyxNQUFNLHFCQUFxQixVQUFVLGdFQUFnRSxFQUFFLE9BQU8sWUFBWSxZQUFZLHFCQUFxQixvQkFBb0IsT0FBTyxxQkFBcUIsUUFBUSw4QkFBOEIsd0NBQXdDLE1BQU0scUJBQXFCLGVBQWUsT0FBTywyQkFBMkIsRUFBRSxNQUFNLHFCQUFxQixzQkFBc0IsbUJBQW1CLHlCQUF5QixFQUFFLE1BQU0scUJBQXFCLGdCQUFnQixxQkFBcUIsNkJBQTZCLEVBQUUsTUFBTSxxQkFBcUIsaUJBQWlCLE9BQU8sd0JBQXdCLFNBQVMsZ0JBQWdCLGtCQUFrQixNQUFNLHFCQUFxQixjQUFjLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixrQkFBa0IsT0FBTyx3QkFBd0IscUJBQXFCLHFCQUFxQixvQkFBb0Isb0JBQW9CLHVCQUF1QixFQUFFLE1BQU0scUJBQXFCLDRCQUE0QixFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLG9CQUFvQixvQkFBb0IsdUJBQXVCLEVBQUUsTUFBTSxxQkFBcUIsNkJBQTZCLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixxQkFBcUIsb0JBQW9CLG9CQUFvQixpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQiw4QkFBOEIsRUFBRSxFQUFFLE1BQU0scUJBQXFCLHFCQUFxQixvQkFBb0Isb0JBQW9CLGNBQWMsRUFBRSxNQUFNLHFCQUFxQiwyQkFBMkIsRUFBRSxFQUFFLE1BQU0scUJBQXFCLHFCQUFxQixvQkFBb0Isb0JBQW9CLGVBQWUsRUFBRSxNQUFNLHFCQUFxQiw0QkFBNEIsRUFBRSxFQUFFLE1BQU0scUJBQXFCLHFCQUFxQixvQkFBb0Isb0JBQW9CLGlCQUFpQixFQUFFLE1BQU0scUJBQXFCLDhCQUE4QixFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLG9CQUFvQixvQkFBb0IsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsOEJBQThCLEVBQUUsRUFBRSxFQUFFLEVBQUUseUJBQXlCLEVBQUUsb0NBQW9DLGNBQWMscUNBQXFDLEVBQUUsRzs7Ozs7OztBQ0EvbEUsMEMiLCJmaWxlIjoianMvbXlwcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxuICAgIFEgPSByZXF1aXJlKCdxJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxuICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxuICAgIFxuICAgIDtcblxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpICA7XG5cbnZhciBNeXByb2ZpbGUgPSBTdG9yZS5leHRlbmQoe1xuICAgIGNvbXB1dGVkOiB7XG4gICAgICAgIHByaWNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFN0YXRlTGlzdDogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldFN0YXRlTGlzdFwiKTtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy91c2Vycy9nZXRTdGF0ZUxpc3QvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ3Byb2ZpbGVmb3JtLmNvdW50cnljb2RlJykpLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdGF0ZWxpc3QnLG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RhdGVsaXN0JywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCB2aWV3LmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJykpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZSgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZpbnNpaGVkIHN0b3JlOiAnKTtcbiAgICAgICAgICAgIHZhciB0ZW1wPXZpZXcuZ2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKTtcbiAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCBudWxsKTtcbiAgICAgICAgICB2aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywgdGVtcCk7XG4gICAgICAgICAgXG4gICAgICAgICAgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldENpdHlMaXN0OiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ2V0Q2l0eUxpc3RcIik7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJy9iMmMvdXNlcnMvZ2V0Q2l0eUxpc3QvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpKSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLmNpdHljb2RlJywgdmlldy5nZXQoJ3Byb2ZpbGVmb3JtLmNpdHljb2RlJykpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICQoJyNkaXZjaXR5IC51aS5kcm9wZG93bicpLmRyb3Bkb3duKCdzZXQgc2VsZWN0ZWQnLCAkKCcjZGl2Y2l0eSAuaXRlbS5hY3RpdmUuc2VsZWN0ZWQnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuXG5NeXByb2ZpbGUucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7ICBcbiAgICAgICAgICAgZGF0YS5iYXNlVXJsPScnO1xuICAgICAgICAgICAgZGF0YS5hZGQ9ZmFsc2U7XG4gICAgICAgICAgICBkYXRhLmVkaXQ9ZmFsc2U7ICAgICAgICAgICBcbiAgICAgICAgICAgIGRhdGEucGVuZGluZz0gZmFsc2U7XG4gICAgICAgICAgICBcbiAgICByZXR1cm4gbmV3IE15cHJvZmlsZSh7ZGF0YTogZGF0YX0pO1xuXG59O1xuTXlwcm9maWxlLmZldGNoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL3VzZXJzL2dldFByb2ZpbGUnKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyAgcmVzb2x2ZShNeXByb2ZpbGUucGFyc2UoZGF0YSkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkXCIpO1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE15cHJvZmlsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL3N0b3Jlcy9teXByb2ZpbGUvbXlwcm9maWxlLmpzXG4vLyBtb2R1bGUgaWQgPSA2MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSA2IDgiLCIvLyAgICAgVmFsaWRhdGUuanMgMC43LjFcblxuLy8gICAgIChjKSAyMDEzLTIwMTUgTmlja2xhcyBBbnNtYW4sIDIwMTMgV3JhcHBcbi8vICAgICBWYWxpZGF0ZS5qcyBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8vICAgICBGb3IgYWxsIGRldGFpbHMgYW5kIGRvY3VtZW50YXRpb246XG4vLyAgICAgaHR0cDovL3ZhbGlkYXRlanMub3JnL1xuXG4oZnVuY3Rpb24oZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVGhlIG1haW4gZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzLlxuICAvLyBUaGUgb3B0aW9ucyBhcmUgdGhlIGZvbGxvd2luZzpcbiAgLy8gICAtIGZvcm1hdCAoc3RyaW5nKSAtIEFuIG9wdGlvbiB0aGF0IGNvbnRyb2xzIGhvdyB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZm9ybWF0dGVkXG4gIC8vICAgICAqIGZsYXQgLSBSZXR1cm5zIGEgZmxhdCBhcnJheSBvZiBqdXN0IHRoZSBlcnJvciBtZXNzYWdlc1xuICAvLyAgICAgKiBncm91cGVkIC0gUmV0dXJucyB0aGUgbWVzc2FnZXMgZ3JvdXBlZCBieSBhdHRyaWJ1dGUgKGRlZmF1bHQpXG4gIC8vICAgICAqIGRldGFpbGVkIC0gUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcmF3IHZhbGlkYXRpb24gZGF0YVxuICAvLyAgIC0gZnVsbE1lc3NhZ2VzIChib29sZWFuKSAtIElmIGB0cnVlYCAoZGVmYXVsdCkgdGhlIGF0dHJpYnV0ZSBuYW1lIGlzIHByZXBlbmRlZCB0byB0aGUgZXJyb3IuXG4gIC8vXG4gIC8vIFBsZWFzZSBub3RlIHRoYXQgdGhlIG9wdGlvbnMgYXJlIGFsc28gcGFzc2VkIHRvIGVhY2ggdmFsaWRhdG9yLlxuICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucylcbiAgICAgICwgYXR0clxuICAgICAgLCB2YWxpZGF0b3I7XG5cbiAgICBmb3IgKGF0dHIgaW4gcmVzdWx0cykge1xuICAgICAgZm9yICh2YWxpZGF0b3IgaW4gcmVzdWx0c1thdHRyXSkge1xuICAgICAgICBpZiAodi5pc1Byb21pc2UocmVzdWx0c1thdHRyXVt2YWxpZGF0b3JdKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVzZSB2YWxpZGF0ZS5hc3luYyBpZiB5b3Ugd2FudCBzdXBwb3J0IGZvciBwcm9taXNlc1wiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdGUucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHZhciB2ID0gdmFsaWRhdGU7XG5cbiAgLy8gQ29waWVzIG92ZXIgYXR0cmlidXRlcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZXMgdG8gYSBzaW5nbGUgZGVzdGluYXRpb24uXG4gIC8vIFZlcnkgbXVjaCBzaW1pbGFyIHRvIHVuZGVyc2NvcmUncyBleHRlbmQuXG4gIC8vIFRoZSBmaXJzdCBhcmd1bWVudCBpcyB0aGUgdGFyZ2V0IG9iamVjdCBhbmQgdGhlIHJlbWFpbmluZyBhcmd1bWVudHMgd2lsbCBiZVxuICAvLyB1c2VkIGFzIHRhcmdldHMuXG4gIHYuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBhdHRyIGluIHNvdXJjZSkge1xuICAgICAgICBvYmpbYXR0cl0gPSBzb3VyY2VbYXR0cl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICB2LmV4dGVuZCh2YWxpZGF0ZSwge1xuICAgIC8vIFRoaXMgaXMgdGhlIHZlcnNpb24gb2YgdGhlIGxpYnJhcnkgYXMgYSBzZW12ZXIuXG4gICAgLy8gVGhlIHRvU3RyaW5nIGZ1bmN0aW9uIHdpbGwgYWxsb3cgaXQgdG8gYmUgY29lcmNlZCBpbnRvIGEgc3RyaW5nXG4gICAgdmVyc2lvbjoge1xuICAgICAgbWFqb3I6IDAsXG4gICAgICBtaW5vcjogNyxcbiAgICAgIHBhdGNoOiAxLFxuICAgICAgbWV0YWRhdGE6IG51bGwsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdi5mb3JtYXQoXCIle21ham9yfS4le21pbm9yfS4le3BhdGNofVwiLCB2LnZlcnNpb24pO1xuICAgICAgICBpZiAoIXYuaXNFbXB0eSh2LnZlcnNpb24ubWV0YWRhdGEpKSB7XG4gICAgICAgICAgdmVyc2lvbiArPSBcIitcIiArIHYudmVyc2lvbi5tZXRhZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQmVsb3cgaXMgdGhlIGRlcGVuZGVuY2llcyB0aGF0IGFyZSB1c2VkIGluIHZhbGlkYXRlLmpzXG5cbiAgICAvLyBUaGUgY29uc3RydWN0b3Igb2YgdGhlIFByb21pc2UgaW1wbGVtZW50YXRpb24uXG4gICAgLy8gSWYgeW91IGFyZSB1c2luZyBRLmpzLCBSU1ZQIG9yIGFueSBvdGhlciBBKyBjb21wYXRpYmxlIGltcGxlbWVudGF0aW9uXG4gICAgLy8gb3ZlcnJpZGUgdGhpcyBhdHRyaWJ1dGUgdG8gYmUgdGhlIGNvbnN0cnVjdG9yIG9mIHRoYXQgcHJvbWlzZS5cbiAgICAvLyBTaW5jZSBqUXVlcnkgcHJvbWlzZXMgYXJlbid0IEErIGNvbXBhdGlibGUgdGhleSB3b24ndCB3b3JrLlxuICAgIFByb21pc2U6IHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiID8gUHJvbWlzZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICAvLyBJZiBtb21lbnQgaXMgdXNlZCBpbiBub2RlLCBicm93c2VyaWZ5IGV0YyBwbGVhc2Ugc2V0IHRoaXMgYXR0cmlidXRlXG4gICAgLy8gbGlrZSB0aGlzOiBgdmFsaWRhdGUubW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbiAgICBtb21lbnQ6IHR5cGVvZiBtb21lbnQgIT09IFwidW5kZWZpbmVkXCIgPyBtb21lbnQgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgWERhdGU6IHR5cGVvZiBYRGF0ZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFhEYXRlIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIEVNUFRZX1NUUklOR19SRUdFWFA6IC9eXFxzKiQvLFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzIG9iamVjdC5cbiAgICAvLyBXaWxsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgZm9ybWF0OlxuICAgIC8vICAgICBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlIG5hbWU+XCIsIGVycm9yOiBcIjx2YWxpZGF0aW9uIHJlc3VsdD5cIn0sIC4uLl1cbiAgICBydW5WYWxpZGF0aW9uczogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW11cbiAgICAgICAgLCBhdHRyXG4gICAgICAgICwgdmFsaWRhdG9yTmFtZVxuICAgICAgICAsIHZhbHVlXG4gICAgICAgICwgdmFsaWRhdG9yc1xuICAgICAgICAsIHZhbGlkYXRvclxuICAgICAgICAsIHZhbGlkYXRvck9wdGlvbnNcbiAgICAgICAgLCBlcnJvcjtcblxuICAgICAgaWYgKHYuaXNEb21FbGVtZW50KGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSB2LmNvbGxlY3RGb3JtVmFsdWVzKGF0dHJpYnV0ZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29wcyB0aHJvdWdoIGVhY2ggY29uc3RyYWludHMsIGZpbmRzIHRoZSBjb3JyZWN0IHZhbGlkYXRvciBhbmQgcnVuIGl0LlxuICAgICAgZm9yIChhdHRyIGluIGNvbnN0cmFpbnRzKSB7XG4gICAgICAgIHZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgYXR0cik7XG4gICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBjb25zdHJhaW50cyBmb3IgYW4gYXR0cmlidXRlIHRvIGJlIGEgZnVuY3Rpb24uXG4gICAgICAgIC8vIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICB2YWxpZGF0b3JzID0gdi5yZXN1bHQoY29uc3RyYWludHNbYXR0cl0sIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG5cbiAgICAgICAgZm9yICh2YWxpZGF0b3JOYW1lIGluIHZhbGlkYXRvcnMpIHtcbiAgICAgICAgICB2YWxpZGF0b3IgPSB2LnZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG5cbiAgICAgICAgICBpZiAoIXZhbGlkYXRvcikge1xuICAgICAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChcIlVua25vd24gdmFsaWRhdG9yICV7bmFtZX1cIiwge25hbWU6IHZhbGlkYXRvck5hbWV9KTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG4gICAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIG9wdGlvbnMgdG8gYmUgYSBmdW5jdGlvbi4gVGhlIGZ1bmN0aW9uIHdpbGwgYmVcbiAgICAgICAgICAvLyBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdi5yZXN1bHQodmFsaWRhdG9yT3B0aW9ucywgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcbiAgICAgICAgICBpZiAoIXZhbGlkYXRvck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgYXR0cmlidXRlOiBhdHRyLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JOYW1lLFxuICAgICAgICAgICAgb3B0aW9uczogdmFsaWRhdG9yT3B0aW9ucyxcbiAgICAgICAgICAgIGVycm9yOiB2YWxpZGF0b3IuY2FsbCh2YWxpZGF0b3IsIHZhbHVlLCB2YWxpZGF0b3JPcHRpb25zLCBhdHRyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSxcblxuICAgIC8vIFRha2VzIHRoZSBvdXRwdXQgZnJvbSBydW5WYWxpZGF0aW9ucyBhbmQgY29udmVydHMgaXQgdG8gdGhlIGNvcnJlY3RcbiAgICAvLyBvdXRwdXQgZm9ybWF0LlxuICAgIHByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0czogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgZXJyb3JzID0gdi5wcnVuZUVtcHR5RXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmV4cGFuZE11bHRpcGxlRXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmNvbnZlcnRFcnJvck1lc3NhZ2VzKGVycm9ycywgb3B0aW9ucyk7XG5cbiAgICAgIHN3aXRjaCAob3B0aW9ucy5mb3JtYXQgfHwgXCJncm91cGVkXCIpIHtcbiAgICAgICAgY2FzZSBcImRldGFpbGVkXCI6XG4gICAgICAgICAgLy8gRG8gbm90aGluZyBtb3JlIHRvIHRoZSBlcnJvcnNcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZmxhdFwiOlxuICAgICAgICAgIGVycm9ycyA9IHYuZmxhdHRlbkVycm9yc1RvQXJyYXkoZXJyb3JzKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ3JvdXBlZFwiOlxuICAgICAgICAgIGVycm9ycyA9IHYuZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZShlcnJvcnMpO1xuICAgICAgICAgIGZvciAoYXR0ciBpbiBlcnJvcnMpIHtcbiAgICAgICAgICAgIGVycm9yc1thdHRyXSA9IHYuZmxhdHRlbkVycm9yc1RvQXJyYXkoZXJyb3JzW2F0dHJdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Iodi5mb3JtYXQoXCJVbmtub3duIGZvcm1hdCAle2Zvcm1hdH1cIiwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdi5pc0VtcHR5KGVycm9ycykgPyB1bmRlZmluZWQgOiBlcnJvcnM7XG4gICAgfSxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRpb25zIHdpdGggc3VwcG9ydCBmb3IgcHJvbWlzZXMuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiBhIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIHdoZW4gYWxsIHRoZVxuICAgIC8vIHZhbGlkYXRpb24gcHJvbWlzZXMgaGF2ZSBiZWVuIGNvbXBsZXRlZC5cbiAgICAvLyBJdCBjYW4gYmUgY2FsbGVkIGV2ZW4gaWYgbm8gdmFsaWRhdGlvbnMgcmV0dXJuZWQgYSBwcm9taXNlLlxuICAgIGFzeW5jOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LmFzeW5jLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHYud2FpdEZvclJlc3VsdHMocmVzdWx0cykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZXJyb3JzID0gdi5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUoYXR0cmlidXRlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2luZ2xlOiBmdW5jdGlvbih2YWx1ZSwgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5zaW5nbGUub3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgICBmb3JtYXQ6IFwiZmxhdFwiLFxuICAgICAgICBmdWxsTWVzc2FnZXM6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2KHtzaW5nbGU6IHZhbHVlfSwge3NpbmdsZTogY29uc3RyYWludHN9LCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGFsbCBwcm9taXNlcyBpbiB0aGUgcmVzdWx0cyBhcnJheVxuICAgIC8vIGFyZSBzZXR0bGVkLiBUaGUgcHJvbWlzZSByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gaXMgYWx3YXlzIHJlc29sdmVkLFxuICAgIC8vIG5ldmVyIHJlamVjdGVkLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gbW9kaWZpZXMgdGhlIGlucHV0IGFyZ3VtZW50LCBpdCByZXBsYWNlcyB0aGUgcHJvbWlzZXNcbiAgICAvLyB3aXRoIHRoZSB2YWx1ZSByZXR1cm5lZCBmcm9tIHRoZSBwcm9taXNlLlxuICAgIHdhaXRGb3JSZXN1bHRzOiBmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAvLyBDcmVhdGUgYSBzZXF1ZW5jZSBvZiBhbGwgdGhlIHJlc3VsdHMgc3RhcnRpbmcgd2l0aCBhIHJlc29sdmVkIHByb21pc2UuXG4gICAgICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgcmVzdWx0KSB7XG4gICAgICAgIC8vIElmIHRoaXMgcmVzdWx0IGlzbid0IGEgcHJvbWlzZSBza2lwIGl0IGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgaWYgKCF2LmlzUHJvbWlzZShyZXN1bHQuZXJyb3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVtby50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZXJyb3IudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIC8vIElmIGZvciBzb21lIHJlYXNvbiB0aGUgdmFsaWRhdG9yIHByb21pc2Ugd2FzIHJlamVjdGVkIGJ1dCBub1xuICAgICAgICAgICAgICAvLyBlcnJvciB3YXMgc3BlY2lmaWVkLlxuICAgICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgdi53YXJuKFwiVmFsaWRhdG9yIHByb21pc2Ugd2FzIHJlamVjdGVkIGJ1dCBkaWRuJ3QgcmV0dXJuIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0sIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocikgeyByKCk7IH0pKTsgLy8gQSByZXNvbHZlZCBwcm9taXNlXG4gICAgfSxcblxuICAgIC8vIElmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIGNhbGw6IGZ1bmN0aW9uIHRoZSBhbmQ6IGZ1bmN0aW9uIHJldHVybiB0aGUgdmFsdWVcbiAgICAvLyBvdGhlcndpc2UganVzdCByZXR1cm4gdGhlIHZhbHVlLiBBZGRpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhc1xuICAgIC8vIGFyZ3VtZW50cyB0byB0aGUgZnVuY3Rpb24uXG4gICAgLy8gRXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByZXN1bHQoJ2ZvbycpIC8vICdmb28nXG4gICAgLy8gcmVzdWx0KE1hdGgubWF4LCAxLCAyKSAvLyAyXG4gICAgLy8gYGBgXG4gICAgcmVzdWx0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgdmFsdWUgaXMgYSBudW1iZXIuIFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgY29uc2lkZXIgTmFOIGFcbiAgICAvLyBudW1iZXIgbGlrZSBtYW55IG90aGVyIGBpc051bWJlcmAgZnVuY3Rpb25zIGRvLlxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIG5vdCBhIGZ1bmN0aW9uXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG4gICAgfSxcblxuICAgIC8vIEEgc2ltcGxlIGNoZWNrIHRvIHZlcmlmeSB0aGF0IHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLiBVc2VzIGBpc051bWJlcmBcbiAgICAvLyBhbmQgYSBzaW1wbGUgbW9kdWxvIGNoZWNrLlxuICAgIGlzSW50ZWdlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LmlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAlIDEgPT09IDA7XG4gICAgfSxcblxuICAgIC8vIFVzZXMgdGhlIGBPYmplY3RgIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhbiBvYmplY3QuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gICAgfSxcblxuICAgIC8vIFNpbXBseSBjaGVja3MgaWYgdGhlIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhIGRhdGVcbiAgICBpc0RhdGU6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERhdGU7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBgbnVsbGAgb2YgYHVuZGVmaW5lZGBcbiAgICBpc0RlZmluZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiBvYmogIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIHByb21pc2UuIEFueXRoaW5nIHdpdGggYSBgdGhlbmBcbiAgICAvLyBmdW5jdGlvbiBpcyBjb25zaWRlcmVkIGEgcHJvbWlzZS5cbiAgICBpc1Byb21pc2U6IGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiAhIXAgJiYgdi5pc0Z1bmN0aW9uKHAudGhlbik7XG4gICAgfSxcblxuICAgIGlzRG9tRWxlbWVudDogZnVuY3Rpb24obykge1xuICAgICAgaWYgKCFvKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2LmlzRnVuY3Rpb24oby5xdWVyeVNlbGVjdG9yQWxsKSB8fCAhdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChkb2N1bWVudCkgJiYgbyA9PT0gZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM4NDM4MC82OTkzMDRcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbyAmJlxuICAgICAgICAgIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgbyAhPT0gbnVsbCAmJlxuICAgICAgICAgIG8ubm9kZVR5cGUgPT09IDEgJiZcbiAgICAgICAgICB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gXCJzdHJpbmdcIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICAvLyBOdWxsIGFuZCB1bmRlZmluZWQgYXJlIGVtcHR5XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZnVuY3Rpb25zIGFyZSBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hpdGVzcGFjZSBvbmx5IHN0cmluZ3MgYXJlIGVtcHR5XG4gICAgICBpZiAodi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHYuRU1QVFlfU1RSSU5HX1JFR0VYUC50ZXN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIGFycmF5cyB3ZSB1c2UgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgaWYgKHYuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgICAgIH1cblxuICAgICAgLy8gRGF0ZXMgaGF2ZSBubyBhdHRyaWJ1dGVzIGJ1dCBhcmVuJ3QgZW1wdHlcbiAgICAgIGlmICh2LmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBmaW5kIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eSB3ZSBjb25zaWRlciBpdCBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICBmb3IgKGF0dHIgaW4gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gRm9ybWF0cyB0aGUgc3BlY2lmaWVkIHN0cmluZ3Mgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzIGxpa2Ugc286XG4gICAgLy8gYGBgXG4gICAgLy8gZm9ybWF0KFwiRm9vOiAle2Zvb31cIiwge2ZvbzogXCJiYXJcIn0pIC8vIFwiRm9vIGJhclwiXG4gICAgLy8gYGBgXG4gICAgLy8gSWYgeW91IHdhbnQgdG8gd3JpdGUgJXsuLi59IHdpdGhvdXQgaGF2aW5nIGl0IHJlcGxhY2VkIHNpbXBseVxuICAgIC8vIHByZWZpeCBpdCB3aXRoICUgbGlrZSB0aGlzIGBGb286ICUle2Zvb31gIGFuZCBpdCB3aWxsIGJlIHJldHVybmVkXG4gICAgLy8gYXMgYFwiRm9vOiAle2Zvb31cImBcbiAgICBmb3JtYXQ6IHYuZXh0ZW5kKGZ1bmN0aW9uKHN0ciwgdmFscykge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHYuZm9ybWF0LkZPUk1BVF9SRUdFWFAsIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgaWYgKG0xID09PSAnJScpIHtcbiAgICAgICAgICByZXR1cm4gXCIle1wiICsgbTIgKyBcIn1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHNbbTJdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwge1xuICAgICAgLy8gRmluZHMgJXtrZXl9IHN0eWxlIHBhdHRlcm5zIGluIHRoZSBnaXZlbiBzdHJpbmdcbiAgICAgIEZPUk1BVF9SRUdFWFA6IC8oJT8pJVxceyhbXlxcfV0rKVxcfS9nXG4gICAgfSksXG5cbiAgICAvLyBcIlByZXR0aWZpZXNcIiB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgIC8vIFByZXR0aWZ5aW5nIG1lYW5zIHJlcGxhY2luZyBbLlxcXy1dIHdpdGggc3BhY2VzIGFzIHdlbGwgYXMgc3BsaXR0aW5nXG4gICAgLy8gY2FtZWwgY2FzZSB3b3Jkcy5cbiAgICBwcmV0dGlmeTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAodi5pc051bWJlcihzdHIpKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMiBkZWNpbWFscyByb3VuZCBpdCB0byB0d29cbiAgICAgICAgaWYgKChzdHIgKiAxMDApICUgMSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgc3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KE1hdGgucm91bmQoc3RyICogMTAwKSAvIDEwMCkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodi5pc0FycmF5KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5tYXAoZnVuY3Rpb24ocykgeyByZXR1cm4gdi5wcmV0dGlmeShzKTsgfSkuam9pbihcIiwgXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRW5zdXJlIHRoZSBzdHJpbmcgaXMgYWN0dWFsbHkgYSBzdHJpbmdcbiAgICAgIHN0ciA9IFwiXCIgKyBzdHI7XG5cbiAgICAgIHJldHVybiBzdHJcbiAgICAgICAgLy8gU3BsaXRzIGtleXMgc2VwYXJhdGVkIGJ5IHBlcmlvZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbXlxcc10pXFwuKFteXFxzXSkvZywgJyQxICQyJylcbiAgICAgICAgLy8gUmVtb3ZlcyBiYWNrc2xhc2hlc1xuICAgICAgICAucmVwbGFjZSgvXFxcXCsvZywgJycpXG4gICAgICAgIC8vIFJlcGxhY2VzIC0gYW5kIC0gd2l0aCBzcGFjZVxuICAgICAgICAucmVwbGFjZSgvW18tXS9nLCAnICcpXG4gICAgICAgIC8vIFNwbGl0cyBjYW1lbCBjYXNlZCB3b3Jkc1xuICAgICAgICAucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgbTEgKyBcIiBcIiArIG0yLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cbiAgICBzdHJpbmdpZnlWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LnByZXR0aWZ5KHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKG9iaiwgdmFsdWUpIHtcbiAgICAgIGlmICghdi5pc0RlZmluZWQob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUgaW4gb2JqO1xuICAgIH0sXG5cbiAgICBnZXREZWVwT2JqZWN0VmFsdWU6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCkge1xuICAgICAgaWYgKCF2LmlzT2JqZWN0KG9iaikgfHwgIXYuaXNTdHJpbmcoa2V5cGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGtleSA9IFwiXCJcbiAgICAgICAgLCBpXG4gICAgICAgICwgZXNjYXBlID0gZmFsc2U7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlwYXRoLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5cGF0aFtpXSkge1xuICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICcuJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgICBvYmogPSBvYmpba2V5XTtcbiAgICAgICAgICAgICAga2V5ID0gXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ1xcXFwnOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICdcXFxcJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGtleSArPSBrZXlwYXRoW2ldO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNEZWZpbmVkKG9iaikgJiYga2V5IGluIG9iaikge1xuICAgICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBUaGlzIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYWxsIHRoZSB2YWx1ZXMgb2YgdGhlIGZvcm0uXG4gICAgLy8gSXQgdXNlcyB0aGUgaW5wdXQgbmFtZSBhcyBrZXkgYW5kIHRoZSB2YWx1ZSBhcyB2YWx1ZVxuICAgIC8vIFNvIGZvciBleGFtcGxlIHRoaXM6XG4gICAgLy8gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImVtYWlsXCIgdmFsdWU9XCJmb29AYmFyLmNvbVwiIC8+XG4gICAgLy8gd291bGQgcmV0dXJuOlxuICAgIC8vIHtlbWFpbDogXCJmb29AYmFyLmNvbVwifVxuICAgIGNvbGxlY3RGb3JtVmFsdWVzOiBmdW5jdGlvbihmb3JtLCBvcHRpb25zKSB7XG4gICAgICB2YXIgdmFsdWVzID0ge31cbiAgICAgICAgLCBpXG4gICAgICAgICwgaW5wdXRcbiAgICAgICAgLCBpbnB1dHNcbiAgICAgICAgLCB2YWx1ZTtcblxuICAgICAgaWYgKCFmb3JtKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcblxuICAgICAgICBpZiAodi5pc0RlZmluZWQoaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZ25vcmVkXCIpKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0LnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuYXR0cmlidXRlcy52YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2lucHV0Lm5hbWVdIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gaW5wdXQuY2hlY2tlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwic2VsZWN0W25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoaW5wdXQub3B0aW9uc1tpbnB1dC5zZWxlY3RlZEluZGV4XS52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIHZhbHVlc1tpbnB1dC5uYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH0sXG5cbiAgICBzYW5pdGl6ZUZvcm1WYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnRyaW0gJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm51bGxpZnkgIT09IGZhbHNlICYmIHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICghdi5pc1N0cmluZyhzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSBhbGwgZXJyb3JzIHdobydzIGVycm9yIGF0dHJpYnV0ZSBpcyBlbXB0eSAobnVsbCBvciB1bmRlZmluZWQpXG4gICAgcHJ1bmVFbXB0eUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzLmZpbHRlcihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZXR1cm4gIXYuaXNFbXB0eShlcnJvci5lcnJvcik7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gSW5cbiAgICAvLyBbe2Vycm9yOiBbXCJlcnIxXCIsIFwiZXJyMlwiXSwgLi4ufV1cbiAgICAvLyBPdXRcbiAgICAvLyBbe2Vycm9yOiBcImVycjFcIiwgLi4ufSwge2Vycm9yOiBcImVycjJcIiwgLi4ufV1cbiAgICAvL1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzIGluIGFuIGVycm9yIHdpdGggbXVsdGlwbGUgbWVzc2FnZXMgYXJlIGR1cGxpY2F0ZWRcbiAgICAvLyB3aGVuIGV4cGFuZGluZyB0aGUgZXJyb3JzLlxuICAgIGV4cGFuZE11bHRpcGxlRXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgZXJyb3JzIHdpdGhvdXQgYSBtZXNzYWdlXG4gICAgICAgIGlmICh2LmlzQXJyYXkoZXJyb3IuZXJyb3IpKSB7XG4gICAgICAgICAgZXJyb3IuZXJyb3IuZm9yRWFjaChmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvciwge2Vycm9yOiBtc2d9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0LnB1c2goZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnRzIHRoZSBlcnJvciBtZXNhZ2VzIGJ5IHByZXBlbmRpbmcgdGhlIGF0dHJpYnV0ZSBuYW1lIHVubGVzcyB0aGVcbiAgICAvLyBtZXNzYWdlIGlzIHByZWZpeGVkIGJ5IF5cbiAgICBjb252ZXJ0RXJyb3JNZXNzYWdlczogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3JJbmZvKSB7XG4gICAgICAgIHZhciBlcnJvciA9IGVycm9ySW5mby5lcnJvcjtcblxuICAgICAgICBpZiAoZXJyb3JbMF0gPT09ICdeJykge1xuICAgICAgICAgIGVycm9yID0gZXJyb3Iuc2xpY2UoMSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5mdWxsTWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgZXJyb3IgPSB2LmNhcGl0YWxpemUodi5wcmV0dGlmeShlcnJvckluZm8uYXR0cmlidXRlKSkgKyBcIiBcIiArIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gZXJyb3IucmVwbGFjZSgvXFxcXFxcXi9nLCBcIl5cIik7XG4gICAgICAgIGVycm9yID0gdi5mb3JtYXQoZXJyb3IsIHt2YWx1ZTogdi5zdHJpbmdpZnlWYWx1ZShlcnJvckluZm8udmFsdWUpfSk7XG4gICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvckluZm8sIHtlcnJvcjogZXJyb3J9KSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyB7XCI8YXR0cmlidXRlTmFtZT5cIjogW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dfVxuICAgIGdyb3VwRXJyb3JzQnlBdHRyaWJ1dGU6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IHt9O1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgdmFyIGxpc3QgPSByZXRbZXJyb3IuYXR0cmlidXRlXTtcbiAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICBsaXN0LnB1c2goZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldFtlcnJvci5hdHRyaWJ1dGVdID0gW2Vycm9yXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2Vycm9yOiBcIjxtZXNzYWdlIDE+XCIsIC4uLn0sIHtlcnJvcjogXCI8bWVzc2FnZSAyPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyBbXCI8bWVzc2FnZSAxPlwiLCBcIjxtZXNzYWdlIDI+XCJdXG4gICAgZmxhdHRlbkVycm9yc1RvQXJyYXk6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5tYXAoZnVuY3Rpb24oZXJyb3IpIHsgcmV0dXJuIGVycm9yLmVycm9yOyB9KTtcbiAgICB9LFxuXG4gICAgZXhwb3NlTW9kdWxlOiBmdW5jdGlvbih2YWxpZGF0ZSwgcm9vdCwgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgICAgIGlmIChleHBvcnRzKSB7XG4gICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB2YWxpZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290LnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICAgIGlmICh2YWxpZGF0ZS5pc0Z1bmN0aW9uKGRlZmluZSkgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGU7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhcm46IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXJyb3I6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFsaWRhdGUudmFsaWRhdG9ycyA9IHtcbiAgICAvLyBQcmVzZW5jZSB2YWxpZGF0ZXMgdGhhdCB0aGUgdmFsdWUgaXNuJ3QgZW1wdHlcbiAgICBwcmVzZW5jZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiY2FuJ3QgYmUgYmxhbmtcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxlbmd0aDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSkge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGlzID0gb3B0aW9ucy5pc1xuICAgICAgICAsIG1heGltdW0gPSBvcHRpb25zLm1heGltdW1cbiAgICAgICAgLCBtaW5pbXVtID0gb3B0aW9ucy5taW5pbXVtXG4gICAgICAgICwgdG9rZW5pemVyID0gb3B0aW9ucy50b2tlbml6ZXIgfHwgZnVuY3Rpb24odmFsKSB7IHJldHVybiB2YWw7IH1cbiAgICAgICAgLCBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXTtcblxuICAgICAgdmFsdWUgPSB0b2tlbml6ZXIodmFsdWUpO1xuICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgIGlmKCF2LmlzTnVtYmVyKGxlbmd0aCkpIHtcbiAgICAgICAgdi5lcnJvcih2LmZvcm1hdChcIkF0dHJpYnV0ZSAle2F0dHJ9IGhhcyBhIG5vbiBudW1lcmljIHZhbHVlIGZvciBgbGVuZ3RoYFwiLCB7YXR0cjogYXR0cmlidXRlfSkpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJoYXMgYW4gaW5jb3JyZWN0IGxlbmd0aFwiO1xuICAgICAgfVxuXG4gICAgICAvLyBJcyBjaGVja3NcbiAgICAgIGlmICh2LmlzTnVtYmVyKGlzKSAmJiBsZW5ndGggIT09IGlzKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICB0aGlzLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgXCJpcyB0aGUgd3JvbmcgbGVuZ3RoIChzaG91bGQgYmUgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IGlzfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtaW5pbXVtKSAmJiBsZW5ndGggPCBtaW5pbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vU2hvcnQgfHxcbiAgICAgICAgICB0aGlzLnRvb1Nob3J0IHx8XG4gICAgICAgICAgXCJpcyB0b28gc2hvcnQgKG1pbmltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1pbmltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1heGltdW0pICYmIGxlbmd0aCA+IG1heGltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29Mb25nIHx8XG4gICAgICAgICAgdGhpcy50b29Mb25nIHx8XG4gICAgICAgICAgXCJpcyB0b28gbG9uZyAobWF4aW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWF4aW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVtZXJpY2FsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVycm9ycyA9IFtdXG4gICAgICAgICwgbmFtZVxuICAgICAgICAsIGNvdW50XG4gICAgICAgICwgY2hlY2tzID0ge1xuICAgICAgICAgICAgZ3JlYXRlclRoYW46ICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPiBjOyB9LFxuICAgICAgICAgICAgZ3JlYXRlclRoYW5PckVxdWFsVG86IGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPj0gYzsgfSxcbiAgICAgICAgICAgIGVxdWFsVG86ICAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID09PSBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW46ICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPCBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW5PckVxdWFsVG86ICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPD0gYzsgfVxuICAgICAgICAgIH07XG5cbiAgICAgIC8vIENvZXJjZSB0aGUgdmFsdWUgdG8gYSBudW1iZXIgdW5sZXNzIHdlJ3JlIGJlaW5nIHN0cmljdC5cbiAgICAgIGlmIChvcHRpb25zLm5vU3RyaW5ncyAhPT0gdHJ1ZSAmJiB2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQncyBub3QgYSBudW1iZXIgd2Ugc2hvdWxkbid0IGNvbnRpbnVlIHNpbmNlIGl0IHdpbGwgY29tcGFyZSBpdC5cbiAgICAgIGlmICghdi5pc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaXMgbm90IGEgbnVtYmVyXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIFNhbWUgbG9naWMgYXMgYWJvdmUsIHNvcnQgb2YuIERvbid0IGJvdGhlciB3aXRoIGNvbXBhcmlzb25zIGlmIHRoaXNcbiAgICAgIC8vIGRvZXNuJ3QgcGFzcy5cbiAgICAgIGlmIChvcHRpb25zLm9ubHlJbnRlZ2VyICYmICF2LmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdEludGVnZXIgIHx8IFwibXVzdCBiZSBhbiBpbnRlZ2VyXCI7XG4gICAgICB9XG5cbiAgICAgIGZvciAobmFtZSBpbiBjaGVja3MpIHtcbiAgICAgICAgY291bnQgPSBvcHRpb25zW25hbWVdO1xuICAgICAgICBpZiAodi5pc051bWJlcihjb3VudCkgJiYgIWNoZWNrc1tuYW1lXSh2YWx1ZSwgY291bnQpKSB7XG4gICAgICAgICAgLy8gVGhpcyBwaWNrcyB0aGUgZGVmYXVsdCBtZXNzYWdlIGlmIHNwZWNpZmllZFxuICAgICAgICAgIC8vIEZvciBleGFtcGxlIHRoZSBncmVhdGVyVGhhbiBjaGVjayB1c2VzIHRoZSBtZXNzYWdlIGZyb21cbiAgICAgICAgICAvLyB0aGlzLm5vdEdyZWF0ZXJUaGFuIHNvIHdlIGNhcGl0YWxpemUgdGhlIG5hbWUgYW5kIHByZXBlbmQgXCJub3RcIlxuICAgICAgICAgIHZhciBtc2cgPSB0aGlzW1wibm90XCIgKyB2LmNhcGl0YWxpemUobmFtZSldIHx8XG4gICAgICAgICAgICBcIm11c3QgYmUgJXt0eXBlfSAle2NvdW50fVwiO1xuXG4gICAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQobXNnLCB7XG4gICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICB0eXBlOiB2LnByZXR0aWZ5KG5hbWUpXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm9kZCAmJiB2YWx1ZSAlIDIgIT09IDEpIHtcbiAgICAgICAgZXJyb3JzLnB1c2godGhpcy5ub3RPZGQgfHwgXCJtdXN0IGJlIG9kZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmV2ZW4gJiYgdmFsdWUgJSAyICE9PSAwKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90RXZlbiB8fCBcIm11c3QgYmUgZXZlblwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRldGltZTogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXVxuICAgICAgICAsIGVhcmxpZXN0ID0gb3B0aW9ucy5lYXJsaWVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5lYXJsaWVzdCwgb3B0aW9ucykgOiBOYU5cbiAgICAgICAgLCBsYXRlc3QgPSBvcHRpb25zLmxhdGVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5sYXRlc3QsIG9wdGlvbnMpIDogTmFOO1xuXG4gICAgICB2YWx1ZSA9IHRoaXMucGFyc2UodmFsdWUsIG9wdGlvbnMpO1xuXG4gICAgICAvLyA4NjQwMDAwMCBpcyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgaW4gYSBkYXksIHRoaXMgaXMgdXNlZCB0byByZW1vdmVcbiAgICAgIC8vIHRoZSB0aW1lIGZyb20gdGhlIGRhdGVcbiAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgb3B0aW9ucy5kYXRlT25seSAmJiB2YWx1ZSAlIDg2NDAwMDAwICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcIm11c3QgYmUgYSB2YWxpZCBkYXRlXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oZWFybGllc3QpICYmIHZhbHVlIDwgZWFybGllc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29FYXJseSB8fCBcIm11c3QgYmUgbm8gZWFybGllciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQoZWFybGllc3QsIG9wdGlvbnMpfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4obGF0ZXN0KSAmJiB2YWx1ZSA+IGxhdGVzdCkge1xuICAgICAgICBlcnIgPSB0aGlzLnRvb0xhdGUgfHwgXCJtdXN0IGJlIG5vIGxhdGVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtkYXRlOiB0aGlzLmZvcm1hdChsYXRlc3QsIG9wdGlvbnMpfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGNvbnZlcnQgaW5wdXQgdG8gdGhlIG51bWJlclxuICAgICAgLy8gb2YgbWlsbGlzIHNpbmNlIHRoZSBlcG9jaC5cbiAgICAgIC8vIEl0IHNob3VsZCByZXR1cm4gTmFOIGlmIGl0J3Mgbm90IGEgdmFsaWQgZGF0ZS5cbiAgICAgIHBhcnNlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAodi5pc0Z1bmN0aW9uKHYuWERhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyB2LlhEYXRlKHZhbHVlLCB0cnVlKS5nZXRUaW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodi5pc0RlZmluZWQodi5tb21lbnQpKSB7XG4gICAgICAgICAgcmV0dXJuICt2Lm1vbWVudC51dGModmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfSxcbiAgICAgIC8vIEZvcm1hdHMgdGhlIGdpdmVuIHRpbWVzdGFtcC4gVXNlcyBJU084NjAxIHRvIGZvcm1hdCB0aGVtLlxuICAgICAgLy8gSWYgb3B0aW9ucy5kYXRlT25seSBpcyB0cnVlIHRoZW4gb25seSB0aGUgeWVhciwgbW9udGggYW5kIGRheSB3aWxsIGJlXG4gICAgICAvLyBvdXRwdXQuXG4gICAgICBmb3JtYXQ6IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IG9wdGlvbnMuZGF0ZUZvcm1hdDtcblxuICAgICAgICBpZiAodi5pc0Z1bmN0aW9uKHYuWERhdGUpKSB7XG4gICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IChvcHRpb25zLmRhdGVPbmx5ID8gXCJ5eXl5LU1NLWRkXCIgOiBcInl5eXktTU0tZGQgSEg6bW06c3NcIik7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYRGF0ZShkYXRlLCB0cnVlKS50b1N0cmluZyhmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwiWVlZWS1NTS1ERFwiIDogXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiB2Lm1vbWVudC51dGMoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWl0aGVyIFhEYXRlIG9yIG1vbWVudC5qcyB3YXMgZm91bmRcIik7XG4gICAgICB9XG4gICAgfSksXG4gICAgZGF0ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgb3B0aW9ucywge2RhdGVPbmx5OiB0cnVlfSk7XG4gICAgICByZXR1cm4gdi52YWxpZGF0b3JzLmRhdGV0aW1lLmNhbGwodi52YWxpZGF0b3JzLmRhdGV0aW1lLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSB8fCAob3B0aW9ucyBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgb3B0aW9ucyA9IHtwYXR0ZXJuOiBvcHRpb25zfTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBpbnZhbGlkXCJcbiAgICAgICAgLCBwYXR0ZXJuID0gb3B0aW9ucy5wYXR0ZXJuXG4gICAgICAgICwgbWF0Y2g7XG5cbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcocGF0dGVybikpIHtcbiAgICAgICAgcGF0dGVybiA9IG5ldyBSZWdFeHAob3B0aW9ucy5wYXR0ZXJuLCBvcHRpb25zLmZsYWdzKTtcbiAgICAgIH1cbiAgICAgIG1hdGNoID0gcGF0dGVybi5leGVjKHZhbHVlKTtcbiAgICAgIGlmICghbWF0Y2ggfHwgbWF0Y2hbMF0ubGVuZ3RoICE9IHZhbHVlLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluY2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcIl4le3ZhbHVlfSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGxpc3RcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBleGNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKCF2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiXiV7dmFsdWV9IGlzIHJlc3RyaWN0ZWRcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBlbWFpbDogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIG5vdCBhIHZhbGlkIGVtYWlsXCI7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuUEFUVEVSTi5leGVjKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBQQVRURVJOOiAvXlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXpdezIsfSQvaVxuICAgIH0pLFxuICAgIGVxdWFsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7YXR0cmlidXRlOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcImlzIG5vdCBlcXVhbCB0byAle2F0dHJpYnV0ZX1cIjtcblxuICAgICAgaWYgKHYuaXNFbXB0eShvcHRpb25zLmF0dHJpYnV0ZSkgfHwgIXYuaXNTdHJpbmcob3B0aW9ucy5hdHRyaWJ1dGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhdHRyaWJ1dGUgbXVzdCBiZSBhIG5vbiBlbXB0eSBzdHJpbmdcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciBvdGhlclZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgb3B0aW9ucy5hdHRyaWJ1dGUpXG4gICAgICAgICwgY29tcGFyYXRvciA9IG9wdGlvbnMuY29tcGFyYXRvciB8fCBmdW5jdGlvbih2MSwgdjIpIHtcbiAgICAgICAgICByZXR1cm4gdjEgPT09IHYyO1xuICAgICAgICB9O1xuXG4gICAgICBpZiAoIWNvbXBhcmF0b3IodmFsdWUsIG90aGVyVmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykpIHtcbiAgICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHthdHRyaWJ1dGU6IHYucHJldHRpZnkob3B0aW9ucy5hdHRyaWJ1dGUpfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhbGlkYXRlLmV4cG9zZU1vZHVsZSh2YWxpZGF0ZSwgdGhpcywgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpO1xufSkuY2FsbCh0aGlzLFxuICAgICAgICB0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBleHBvcnRzIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBtb2R1bGUgOiBudWxsLFxuICAgICAgICB0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGRlZmluZSA6IG51bGwpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA2IDcgOCA5IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpOyB9O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9hbWQtZGVmaW5lLmpzXG4vLyBtb2R1bGUgaWQgPSA2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMyA0IDUgNiA3IDggOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1haWxjaGVjayA9IHJlcXVpcmUoJ21haWxjaGVjaycpO1xuXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdlbWFpbCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG5cbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSlcbiAgICAgICAgICAgIC5vbignYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykubWFpbGNoZWNrKHtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGVkOiBmdW5jdGlvbihlbGVtZW50LCBzdWdnZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VnZ2VzdGlvbicsIHN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Z2dlc3Rpb24nLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNvcnJlY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldCgndmFsdWUnLCB0aGlzLmdldCgnc3VnZ2VzdGlvbi5mdWxsJykpO1xuICAgICAgICB0aGlzLnNldCgnc3VnZ2VzdGlvbicsIG51bGwpO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29yZS9mb3JtL2VtYWlsLmpzXG4vLyBtb2R1bGUgaWQgPSA4NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSA4IDkiLCIvKlxuICogTWFpbGNoZWNrIGh0dHBzOi8vZ2l0aHViLmNvbS9tYWlsY2hlY2svbWFpbGNoZWNrXG4gKiBBdXRob3JcbiAqIERlcnJpY2sgS28gKEBkZXJyaWNra28pXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICpcbiAqIHYgMS4xLjJcbiAqL1xuXG52YXIgTWFpbGNoZWNrID0ge1xuICBkb21haW5UaHJlc2hvbGQ6IDIsXG4gIHNlY29uZExldmVsVGhyZXNob2xkOiAyLFxuICB0b3BMZXZlbFRocmVzaG9sZDogMixcblxuICBkZWZhdWx0RG9tYWluczogWydtc24uY29tJywgJ2JlbGxzb3V0aC5uZXQnLFxuICAgICd0ZWx1cy5uZXQnLCAnY29tY2FzdC5uZXQnLCAnb3B0dXNuZXQuY29tLmF1JyxcbiAgICAnZWFydGhsaW5rLm5ldCcsICdxcS5jb20nLCAnc2t5LmNvbScsICdpY2xvdWQuY29tJyxcbiAgICAnbWFjLmNvbScsICdzeW1wYXRpY28uY2EnLCAnZ29vZ2xlbWFpbC5jb20nLFxuICAgICdhdHQubmV0JywgJ3h0cmEuY28ubnonLCAnd2ViLmRlJyxcbiAgICAnY294Lm5ldCcsICdnbWFpbC5jb20nLCAneW1haWwuY29tJyxcbiAgICAnYWltLmNvbScsICdyb2dlcnMuY29tJywgJ3Zlcml6b24ubmV0JyxcbiAgICAncm9ja2V0bWFpbC5jb20nLCAnZ29vZ2xlLmNvbScsICdvcHRvbmxpbmUubmV0JyxcbiAgICAnc2JjZ2xvYmFsLm5ldCcsICdhb2wuY29tJywgJ21lLmNvbScsICdidGludGVybmV0LmNvbScsXG4gICAgJ2NoYXJ0ZXIubmV0JywgJ3NoYXcuY2EnXSxcblxuICBkZWZhdWx0U2Vjb25kTGV2ZWxEb21haW5zOiBbXCJ5YWhvb1wiLCBcImhvdG1haWxcIiwgXCJtYWlsXCIsIFwibGl2ZVwiLCBcIm91dGxvb2tcIiwgXCJnbXhcIl0sXG5cbiAgZGVmYXVsdFRvcExldmVsRG9tYWluczogW1wiY29tXCIsIFwiY29tLmF1XCIsIFwiY29tLnR3XCIsIFwiY2FcIiwgXCJjby5uelwiLCBcImNvLnVrXCIsIFwiZGVcIixcbiAgICBcImZyXCIsIFwiaXRcIiwgXCJydVwiLCBcIm5ldFwiLCBcIm9yZ1wiLCBcImVkdVwiLCBcImdvdlwiLCBcImpwXCIsIFwibmxcIiwgXCJrclwiLCBcInNlXCIsIFwiZXVcIixcbiAgICBcImllXCIsIFwiY28uaWxcIiwgXCJ1c1wiLCBcImF0XCIsIFwiYmVcIiwgXCJka1wiLCBcImhrXCIsIFwiZXNcIiwgXCJnclwiLCBcImNoXCIsIFwibm9cIiwgXCJjelwiLFxuICAgIFwiaW5cIiwgXCJuZXRcIiwgXCJuZXQuYXVcIiwgXCJpbmZvXCIsIFwiYml6XCIsIFwibWlsXCIsIFwiY28uanBcIiwgXCJzZ1wiLCBcImh1XCIsIFwidWtcIl0sXG5cbiAgcnVuOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgb3B0cy5kb21haW5zID0gb3B0cy5kb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0RG9tYWlucztcbiAgICBvcHRzLnNlY29uZExldmVsRG9tYWlucyA9IG9wdHMuc2Vjb25kTGV2ZWxEb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0U2Vjb25kTGV2ZWxEb21haW5zO1xuICAgIG9wdHMudG9wTGV2ZWxEb21haW5zID0gb3B0cy50b3BMZXZlbERvbWFpbnMgfHwgTWFpbGNoZWNrLmRlZmF1bHRUb3BMZXZlbERvbWFpbnM7XG4gICAgb3B0cy5kaXN0YW5jZUZ1bmN0aW9uID0gb3B0cy5kaXN0YW5jZUZ1bmN0aW9uIHx8IE1haWxjaGVjay5zaWZ0M0Rpc3RhbmNlO1xuXG4gICAgdmFyIGRlZmF1bHRDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc3VsdCl7IHJldHVybiByZXN1bHQgfTtcbiAgICB2YXIgc3VnZ2VzdGVkQ2FsbGJhY2sgPSBvcHRzLnN1Z2dlc3RlZCB8fCBkZWZhdWx0Q2FsbGJhY2s7XG4gICAgdmFyIGVtcHR5Q2FsbGJhY2sgPSBvcHRzLmVtcHR5IHx8IGRlZmF1bHRDYWxsYmFjaztcblxuICAgIHZhciByZXN1bHQgPSBNYWlsY2hlY2suc3VnZ2VzdChNYWlsY2hlY2suZW5jb2RlRW1haWwob3B0cy5lbWFpbCksIG9wdHMuZG9tYWlucywgb3B0cy5zZWNvbmRMZXZlbERvbWFpbnMsIG9wdHMudG9wTGV2ZWxEb21haW5zLCBvcHRzLmRpc3RhbmNlRnVuY3Rpb24pO1xuXG4gICAgcmV0dXJuIHJlc3VsdCA/IHN1Z2dlc3RlZENhbGxiYWNrKHJlc3VsdCkgOiBlbXB0eUNhbGxiYWNrKClcbiAgfSxcblxuICBzdWdnZXN0OiBmdW5jdGlvbihlbWFpbCwgZG9tYWlucywgc2Vjb25kTGV2ZWxEb21haW5zLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24pIHtcbiAgICBlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB2YXIgZW1haWxQYXJ0cyA9IHRoaXMuc3BsaXRFbWFpbChlbWFpbCk7XG5cbiAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zICYmIHRvcExldmVsRG9tYWlucykge1xuICAgICAgICAvLyBJZiB0aGUgZW1haWwgaXMgYSB2YWxpZCAybmQtbGV2ZWwgKyB0b3AtbGV2ZWwsIGRvIG5vdCBzdWdnZXN0IGFueXRoaW5nLlxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zLmluZGV4T2YoZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbikgIT09IC0xICYmIHRvcExldmVsRG9tYWlucy5pbmRleE9mKGVtYWlsUGFydHMudG9wTGV2ZWxEb21haW4pICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNsb3Nlc3REb21haW4gPSB0aGlzLmZpbmRDbG9zZXN0RG9tYWluKGVtYWlsUGFydHMuZG9tYWluLCBkb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLmRvbWFpblRocmVzaG9sZCk7XG5cbiAgICBpZiAoY2xvc2VzdERvbWFpbikge1xuICAgICAgaWYgKGNsb3Nlc3REb21haW4gPT0gZW1haWxQYXJ0cy5kb21haW4pIHtcbiAgICAgICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgZXhhY3RseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWluczsgZG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24uXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGNsb3NlbHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnM7IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgcmV0dXJuIHsgYWRkcmVzczogZW1haWxQYXJ0cy5hZGRyZXNzLCBkb21haW46IGNsb3Nlc3REb21haW4sIGZ1bGw6IGVtYWlsUGFydHMuYWRkcmVzcyArIFwiQFwiICsgY2xvc2VzdERvbWFpbiB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGRvZXMgbm90IGNsb3NlbHkgbWF0Y2ggb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zXG4gICAgdmFyIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiA9IHRoaXMuZmluZENsb3Nlc3REb21haW4oZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbiwgc2Vjb25kTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLnNlY29uZExldmVsVGhyZXNob2xkKTtcbiAgICB2YXIgY2xvc2VzdFRvcExldmVsRG9tYWluICAgID0gdGhpcy5maW5kQ2xvc2VzdERvbWFpbihlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRoaXMudG9wTGV2ZWxUaHJlc2hvbGQpO1xuXG4gICAgaWYgKGVtYWlsUGFydHMuZG9tYWluKSB7XG4gICAgICB2YXIgY2xvc2VzdERvbWFpbiA9IGVtYWlsUGFydHMuZG9tYWluO1xuICAgICAgdmFyIHJ0cm4gPSBmYWxzZTtcblxuICAgICAgaWYoY2xvc2VzdFNlY29uZExldmVsRG9tYWluICYmIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHNlY29uZC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluLCBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4pO1xuICAgICAgICBydHJuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYoY2xvc2VzdFRvcExldmVsRG9tYWluICYmIGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHRvcC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShuZXcgUmVnRXhwKGVtYWlsUGFydHMudG9wTGV2ZWxEb21haW4gKyBcIiRcIiksIGNsb3Nlc3RUb3BMZXZlbERvbWFpbik7XG4gICAgICAgIHJ0cm4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocnRybiA9PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB7IGFkZHJlc3M6IGVtYWlsUGFydHMuYWRkcmVzcywgZG9tYWluOiBjbG9zZXN0RG9tYWluLCBmdWxsOiBlbWFpbFBhcnRzLmFkZHJlc3MgKyBcIkBcIiArIGNsb3Nlc3REb21haW4gfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBUaGUgZW1haWwgYWRkcmVzcyBleGFjdGx5IG1hdGNoZXMgb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zLCBkb2VzIG5vdCBjbG9zZWx5XG4gICAgICogbWF0Y2ggYW55IGRvbWFpbiBhbmQgZG9lcyBub3QgYXBwZWFyIHRvIHNpbXBseSBoYXZlIGEgbWlzcGVsbGVkIHRvcC1sZXZlbCBkb21haW4sXG4gICAgICogb3IgaXMgYW4gaW52YWxpZCBlbWFpbCBhZGRyZXNzOyBkbyBub3QgcmV0dXJuIGEgc3VnZ2VzdGlvbi5cbiAgICAgKi9cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgZmluZENsb3Nlc3REb21haW46IGZ1bmN0aW9uKGRvbWFpbiwgZG9tYWlucywgZGlzdGFuY2VGdW5jdGlvbiwgdGhyZXNob2xkKSB7XG4gICAgdGhyZXNob2xkID0gdGhyZXNob2xkIHx8IHRoaXMudG9wTGV2ZWxUaHJlc2hvbGQ7XG4gICAgdmFyIGRpc3Q7XG4gICAgdmFyIG1pbkRpc3QgPSBJbmZpbml0eTtcbiAgICB2YXIgY2xvc2VzdERvbWFpbiA9IG51bGw7XG5cbiAgICBpZiAoIWRvbWFpbiB8fCAhZG9tYWlucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZighZGlzdGFuY2VGdW5jdGlvbikge1xuICAgICAgZGlzdGFuY2VGdW5jdGlvbiA9IHRoaXMuc2lmdDNEaXN0YW5jZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRvbWFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkb21haW4gPT09IGRvbWFpbnNbaV0pIHtcbiAgICAgICAgcmV0dXJuIGRvbWFpbjtcbiAgICAgIH1cbiAgICAgIGRpc3QgPSBkaXN0YW5jZUZ1bmN0aW9uKGRvbWFpbiwgZG9tYWluc1tpXSk7XG4gICAgICBpZiAoZGlzdCA8IG1pbkRpc3QpIHtcbiAgICAgICAgbWluRGlzdCA9IGRpc3Q7XG4gICAgICAgIGNsb3Nlc3REb21haW4gPSBkb21haW5zW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtaW5EaXN0IDw9IHRocmVzaG9sZCAmJiBjbG9zZXN0RG9tYWluICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY2xvc2VzdERvbWFpbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICBzaWZ0M0Rpc3RhbmNlOiBmdW5jdGlvbihzMSwgczIpIHtcbiAgICAvLyBzaWZ0MzogaHR0cDovL3NpZGVyaXRlLmJsb2dzcG90LmNvbS8yMDA3LzA0L3N1cGVyLWZhc3QtYW5kLWFjY3VyYXRlLXN0cmluZy1kaXN0YW5jZS5odG1sXG4gICAgaWYgKHMxID09IG51bGwgfHwgczEubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAoczIgPT0gbnVsbCB8fCBzMi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gczIubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzMiA9PSBudWxsIHx8IHMyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHMxLmxlbmd0aDtcbiAgICB9XG5cbiAgICB2YXIgYyA9IDA7XG4gICAgdmFyIG9mZnNldDEgPSAwO1xuICAgIHZhciBvZmZzZXQyID0gMDtcbiAgICB2YXIgbGNzID0gMDtcbiAgICB2YXIgbWF4T2Zmc2V0ID0gNTtcblxuICAgIHdoaWxlICgoYyArIG9mZnNldDEgPCBzMS5sZW5ndGgpICYmIChjICsgb2Zmc2V0MiA8IHMyLmxlbmd0aCkpIHtcbiAgICAgIGlmIChzMS5jaGFyQXQoYyArIG9mZnNldDEpID09IHMyLmNoYXJBdChjICsgb2Zmc2V0MikpIHtcbiAgICAgICAgbGNzKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvZmZzZXQxID0gMDtcbiAgICAgICAgb2Zmc2V0MiA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4T2Zmc2V0OyBpKyspIHtcbiAgICAgICAgICBpZiAoKGMgKyBpIDwgczEubGVuZ3RoKSAmJiAoczEuY2hhckF0KGMgKyBpKSA9PSBzMi5jaGFyQXQoYykpKSB7XG4gICAgICAgICAgICBvZmZzZXQxID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKGMgKyBpIDwgczIubGVuZ3RoKSAmJiAoczEuY2hhckF0KGMpID09IHMyLmNoYXJBdChjICsgaSkpKSB7XG4gICAgICAgICAgICBvZmZzZXQyID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYysrO1xuICAgIH1cbiAgICByZXR1cm4gKHMxLmxlbmd0aCArIHMyLmxlbmd0aCkgLzIgLSBsY3M7XG4gIH0sXG5cbiAgc3BsaXRFbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICB2YXIgcGFydHMgPSBlbWFpbC50cmltKCkuc3BsaXQoJ0AnKTtcblxuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHBhcnRzW2ldID09PSAnJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGRvbWFpbiA9IHBhcnRzLnBvcCgpO1xuICAgIHZhciBkb21haW5QYXJ0cyA9IGRvbWFpbi5zcGxpdCgnLicpO1xuICAgIHZhciBzbGQgPSAnJztcbiAgICB2YXIgdGxkID0gJyc7XG5cbiAgICBpZiAoZG9tYWluUGFydHMubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFRoZSBhZGRyZXNzIGRvZXMgbm90IGhhdmUgYSB0b3AtbGV2ZWwgZG9tYWluXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChkb21haW5QYXJ0cy5sZW5ndGggPT0gMSkge1xuICAgICAgLy8gVGhlIGFkZHJlc3MgaGFzIG9ubHkgYSB0b3AtbGV2ZWwgZG9tYWluICh2YWxpZCB1bmRlciBSRkMpXG4gICAgICB0bGQgPSBkb21haW5QYXJ0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIGFkZHJlc3MgaGFzIGEgZG9tYWluIGFuZCBhIHRvcC1sZXZlbCBkb21haW5cbiAgICAgIHNsZCA9IGRvbWFpblBhcnRzWzBdO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBkb21haW5QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0bGQgKz0gZG9tYWluUGFydHNbaV0gKyAnLic7XG4gICAgICB9XG4gICAgICB0bGQgPSB0bGQuc3Vic3RyaW5nKDAsIHRsZC5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9wTGV2ZWxEb21haW46IHRsZCxcbiAgICAgIHNlY29uZExldmVsRG9tYWluOiBzbGQsXG4gICAgICBkb21haW46IGRvbWFpbixcbiAgICAgIGFkZHJlc3M6IHBhcnRzLmpvaW4oJ0AnKVxuICAgIH1cbiAgfSxcblxuICAvLyBFbmNvZGUgdGhlIGVtYWlsIGFkZHJlc3MgdG8gcHJldmVudCBYU1MgYnV0IGxlYXZlIGluIHZhbGlkXG4gIC8vIGNoYXJhY3RlcnMsIGZvbGxvd2luZyB0aGlzIG9mZmljaWFsIHNwZWM6XG4gIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRW1haWxfYWRkcmVzcyNTeW50YXhcbiAgZW5jb2RlRW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVuY29kZVVSSShlbWFpbCk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoJyUyMCcsICcgJykucmVwbGFjZSgnJTI1JywgJyUnKS5yZXBsYWNlKCclNUUnLCAnXicpXG4gICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyU2MCcsICdgJykucmVwbGFjZSgnJTdCJywgJ3snKS5yZXBsYWNlKCclN0MnLCAnfCcpXG4gICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyU3RCcsICd9Jyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcblxuLy8gRXhwb3J0IHRoZSBtYWlsY2hlY2sgb2JqZWN0IGlmIHdlJ3JlIGluIGEgQ29tbW9uSlMgZW52IChlLmcuIE5vZGUpLlxuLy8gTW9kZWxlZCBvZmYgb2YgVW5kZXJzY29yZS5qcy5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gTWFpbGNoZWNrO1xufVxuXG4vLyBTdXBwb3J0IEFNRCBzdHlsZSBkZWZpbml0aW9uc1xuLy8gQmFzZWQgb24galF1ZXJ5IChzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTc5NTQ4ODIvMTMyMjQxMClcbmlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoXCJtYWlsY2hlY2tcIiwgW10sIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNYWlsY2hlY2s7XG4gIH0pO1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmpRdWVyeSkge1xuICAoZnVuY3Rpb24oJCl7XG4gICAgJC5mbi5tYWlsY2hlY2sgPSBmdW5jdGlvbihvcHRzKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAob3B0cy5zdWdnZXN0ZWQpIHtcbiAgICAgICAgdmFyIG9sZFN1Z2dlc3RlZCA9IG9wdHMuc3VnZ2VzdGVkO1xuICAgICAgICBvcHRzLnN1Z2dlc3RlZCA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIG9sZFN1Z2dlc3RlZChzZWxmLCByZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5lbXB0eSkge1xuICAgICAgICB2YXIgb2xkRW1wdHkgPSBvcHRzLmVtcHR5O1xuICAgICAgICBvcHRzLmVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgb2xkRW1wdHkuY2FsbChudWxsLCBzZWxmKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3B0cy5lbWFpbCA9IHRoaXMudmFsKCk7XG4gICAgICBNYWlsY2hlY2sucnVuKG9wdHMpO1xuICAgIH1cbiAgfSkoalF1ZXJ5KTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdmVuZG9yL21haWxjaGVjay9zcmMvbWFpbGNoZWNrLmpzXG4vLyBtb2R1bGUgaWQgPSA4N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSA4IDkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudCcpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcbiAgICA7XG5cbnZhclxuICAgIExBUkdFID0gJ2xhcmdlJyxcbiAgICBESVNBQkxFRCA9ICdkaXNhYmxlZCcsXG4gICAgTE9BRElORyA9ICdpY29uIGxvYWRpbmcnLFxuICAgIERFQ09SQVRFRCA9ICdkZWNvcmF0ZWQnLFxuICAgIEVSUk9SID0gJ2Vycm9yJyxcbiAgICBJTiA9ICdpbidcbiAgICA7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50LmV4dGVuZCh7XG4gICAgaXNvbGF0ZWQ6IHRydWUsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vc3Bpbm5lci5odG1sJyksXG5cbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNsYXNzZXM6IGZ1bmN0aW9uKHN0YXRlLCBsYXJnZSkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZGF0YS5zdGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUuZGlzYWJsZWQgfHwgZGF0YS5zdGF0ZS5zdWJtaXR0aW5nKSBjbGFzc2VzLnB1c2goRElTQUJMRUQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5sb2FkaW5nKSBjbGFzc2VzLnB1c2goTE9BRElORyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmVycm9yKSBjbGFzc2VzLnB1c2goRVJST1IpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubGFyZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKERFQ09SQVRFRCk7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChMQVJHRSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgfHwgZGF0YS5mb2N1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKElOKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlKCd2YWx1ZScsIGZ1bmN0aW9uKCkgeyAgaWYgKHRoaXMuZ2V0KCdlcnJvcicpKSB0aGlzLnNldCgnZXJyb3InLCBmYWxzZSk7IH0sIHtpbml0OiBmYWxzZX0pO1xuXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpXG4gICAgICAgICAgICAub24oJ2ZvY3VzLmFwaScsIGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgnZm9jdXMnLCB0cnVlKTsgfSlcbiAgICAgICAgICAgIC5vbignYmx1ci5hcGknLCBmdW5jdGlvbigpIHsgdmlldy5zZXQoJ2ZvY3VzJywgZmFsc2UpOyB9KTtcbiAgICB9LFxuXG4gICAgb250ZWFyZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5vZmYoJy5hcGknKTtcbiAgICB9LFxuXG5cbiAgICBpbmM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdiA9IF8ucGFyc2VJbnQodGhpcy5nZXQoJ3ZhbHVlJykpICsgMTtcblxuICAgICAgICBpZiAodiA8PSB0aGlzLmdldCgnbWF4JykpXG4gICAgICAgICAgICB0aGlzLnNldCgndmFsdWUnLCB2KTtcbiAgICB9LFxuXG4gICAgZGVjOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHYgPSBfLnBhcnNlSW50KHRoaXMuZ2V0KCd2YWx1ZScpKSAtIDE7XG5cbiAgICAgICAgaWYgKHYgPj0gdGhpcy5nZXQoJ21pbicpKSB7XG4gICAgICAgICAgICB0aGlzLnNldCgndmFsdWUnLCB2KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29yZS9mb3JtL3NwaW5uZXIuanNcbi8vIG1vZHVsZSBpZCA9IDMxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDUgNiA4IDkiLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIHNlbGVjdGlvbiBpbnB1dCBzcGlubmVyIGRyb3Bkb3duIGluIFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY2xhc3Nlc1wiLFwic3RhdGVcIixcImxhcmdlXCIsXCJ2YWx1ZVwiXSxcInNcIjpcIl8wKF8xLF8yLF8zKVwifX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImhpZGRlblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcGxhY2Vob2xkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJsYXJnZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0ZXh0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInZhbHVlXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc3Bpbm5lciBidXR0b24gaW5jXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiaW5jXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCIrXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzcGlubmVyIGJ1dHRvbiBkZWNcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJkZWNcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIi1cIl19XX1dfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL3RlbXBsYXRlcy9jb21wb25lbnRzL2Zvcm0vc3Bpbm5lci5odG1sXG4vLyBtb2R1bGUgaWQgPSAzMTlcbi8vIG1vZHVsZSBjaHVua3MgPSA1IDYgOCA5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgIE15cHJvZmlsZSA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvbXlwcm9maWxlL2luZGV4Jyk7XG4gICAgIFxuICAgICByZXF1aXJlKCd3ZWIvbW9kdWxlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5sZXNzJyk7XG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgKG5ldyBNeXByb2ZpbGUoKSkucmVuZGVyKCcjYXBwJyk7XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2FwcC93ZWIvbXlwcm9maWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAzNzBcbi8vIG1vZHVsZSBjaHVua3MgPSA4IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgIE15cHJvZmlsZSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXByb2ZpbGUvbXlwcm9maWxlJyksXG4gICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXByb2ZpbGUvbWV0YScpXG4gICAgO1xubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XG4gICAgaXNvbGF0ZWQ6IHRydWUsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teXByb2ZpbGUvaW5kZXguaHRtbCcpLFxuXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICAnbGF5b3V0JzogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvbGF5b3V0JyksXG4gICAgICAgICdteXByb2ZpbGUtZm9ybSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvbXlwcm9maWxlL2Zvcm0nKSxcbiAgICAgICAgbXlwcm9maWxldmlldzogcmVxdWlyZSgnY29tcG9uZW50cy9teXByb2ZpbGUvdmlldycpLFxuICAgICAgIC8vIGxlZnRwYW5lbDpyZXF1aXJlKCdjb21wb25lbnRzL2xheW91dHMvcHJvZmlsZV9zaWRlYmFyJylcbiAgICB9LFxuICAgIHBhcnRpYWxzOiB7XG4gICAgICAgICdiYXNlLXBhbmVsJzogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9sYXlvdXQvcGFuZWwuaHRtbCcpXG4gICAgfSxcbiAgICBcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KCdteXByb2ZpbGUucGVuZGluZycsIHRydWUpO1xuICAgICAgICB0aGlzLnNldCgnbXlwcm9maWxlLmVkaXQnLCBmYWxzZSk7XG4gICAgICAgTXlwcm9maWxlLmZldGNoKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihteXByb2ZpbGUpIHsgdGhpcy5zZXQoJ215cHJvZmlsZS5wZW5kaW5nJywgZmFsc2UpOyB0aGlzLnNldCgnbXlwcm9maWxlJywgbXlwcm9maWxlKTsgfS5iaW5kKHRoaXMpKTtcbiAgICAgICBNZXRhLmluc3RhbmNlKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihtZXRhKSB7IHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7fS5iaW5kKHRoaXMpKTtcbiAgICAgICAgd2luZG93LnZpZXcgPSB0aGlzO1xuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7ICAgICBcbiAgICAgICAgcmV0dXJuIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIGxlZnRtZW51OmZhbHNlLFxuICAgICAgICB9XG4gICAgfSxcbiBsZWZ0TWVudTpmdW5jdGlvbigpIHsgdmFyIGZsYWc9dGhpcy5nZXQoJ2xlZnRtZW51Jyk7IHRoaXMuc2V0KCdsZWZ0bWVudScsICFmbGFnKTt9LFxuICAgXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChNT0JJTEUpIHtcbiAgICAgICAgICAgIHZhciBvcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcih7IG9uSGlkZGVuOiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9LCBvblNob3c6IGZ1bmN0aW9uKCkgeyAkKCcjbV9idG4nKS5hZGRDbGFzcygnZGlzYWJsZWQnKTsgIH19KTtcbiAgICAgICAgICAgICQoJy5kcm9wZG93bicpLmRyb3Bkb3duKCk7XG5cbiAgICAgICAgICAgICQoJyNtX2J0bicsIHRoaXMuZWwpLm9uKCdjbGljay5sYXlvdXQnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNtX21lbnUnKS5zaWRlYmFyKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnLnB1c2hlcicpLm9uZSgnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICQoJy51aS5jaGVja2JveCcsIHRoaXMuZWwpLmNoZWNrYm94KCk7XG4gICAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb21wb25lbnRzL215cHJvZmlsZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzcxXG4vLyBtb2R1bGUgY2h1bmtzID0gOCIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJveCBteS10cmF2ZWxsZXJzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJteXByb2ZpbGVcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcIm15cHJvZmlsZXZpZXdcIixcImFcIjp7XCJteXByb2ZpbGVcIjpbe1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGVcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteXByb2ZpbGUuZWRpdFwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibXlwcm9maWxlLWZvcm1cIixcImFcIjp7XCJteXByb2ZpbGVcIjpbe1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGVcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwieFwiOntcInJcIjpbXCJteXByb2ZpbGUuZWRpdFwiXSxcInNcIjpcIiFfMFwifX1dfV19XX1dfSxcIiBcIl0sXCJwXCI6e1wicGFuZWxcIjpbe1widFwiOjgsXCJyXCI6XCJiYXNlLXBhbmVsXCJ9XX19XX07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM3MlxuLy8gbW9kdWxlIGNodW5rcyA9IDgiLCIndXNlIHN0cmljdCc7XG5cbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXG4gICAgICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXG4gICAgICAgIE15cHJvZmlsZSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXByb2ZpbGUvbXlwcm9maWxlJyksXG4gICAgICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxuICAgICAgICA7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xuICAgIGlzb2xhdGVkOiB0cnVlLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXlwcm9maWxlL2Zvcm0uaHRtbCcpLFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ3VpLXNwaW5uZXInOiByZXF1aXJlKCdjb3JlL2Zvcm0vc3Bpbm5lcicpLFxuICAgICAgICAndWktY2FsZW5kYXInOiByZXF1aXJlKCdjb3JlL2Zvcm0vY2FsZW5kYXInKSxcbiAgICAgICAgJ3VpLXRlbCc6IHJlcXVpcmUoJ2NvcmUvZm9ybS90ZWwnKSxcbiAgICAgICAgJ3VpLWVtYWlsJzogcmVxdWlyZSgnY29yZS9mb3JtL2VtYWlsJyksXG4gICAgICAgICd1aS1pbnB1dCc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9pbnB1dCcpLFxuICAgICAgICAndWktZGF0ZSc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9kYXRlJyksXG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcnM6bnVsbCxcbiAgICAgICAgICAgIHN0YXRlbGlzdDogW10sXG4gICAgICAgICAgICBjaXR5bGlzdDogW10sXG4gICAgICAgICAgICBmb3JtYXRTdGF0ZUxpc3Q6IGZ1bmN0aW9uIChzdGF0ZWxpc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IF8uY2xvbmVEZWVwKHN0YXRlbGlzdCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdGV4dDogaS5uYW1lfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRDaXR5TGlzdDogZnVuY3Rpb24gKGNpdHlsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBfLmNsb25lRGVlcChjaXR5bGlzdCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdGV4dDogaS5uYW1lfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRDb3VudHJ5TGlzdDogZnVuY3Rpb24gKGNvdW50cnlsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBfLmNsb25lRGVlcChjb3VudHJ5bGlzdCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdGV4dDogaS5uYW1lfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBcblxuICAgIH0sXG4gICAgb25pbml0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0KCdwcm9maWxlZm9ybS5uYW1lJywgdGhpcy5nZXQoJ215cHJvZmlsZS5uYW1lJykpO1xuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0uZW1haWwnLCB0aGlzLmdldCgnbXlwcm9maWxlLmVtYWlsJykpO1xuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0ubW9iaWxlJywgdGhpcy5nZXQoJ215cHJvZmlsZS5tb2JpbGUnKSk7XG4gICAgICAgIHRoaXMuc2V0KCdwcm9maWxlZm9ybS5hZGRyZXNzJywgdGhpcy5nZXQoJ215cHJvZmlsZS5hZGRyZXNzJykpO1xuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0uY291bnRyeScsIHRoaXMuZ2V0KCdteXByb2ZpbGUuY291bnRyeScpKTtcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLmNvdW50cnljb2RlJywgdGhpcy5nZXQoJ215cHJvZmlsZS5jb3VudHJ5Y29kZScpKTtcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlJywgdGhpcy5nZXQoJ215cHJvZmlsZS5zdGF0ZScpKTtcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScsIHRoaXMuZ2V0KCdteXByb2ZpbGUuc3RhdGVjb2RlJykpO1xuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0uY2l0eScsIHRoaXMuZ2V0KCdteXByb2ZpbGUuY2l0eScpKTtcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLmNpdHljb2RlJywgdGhpcy5nZXQoJ215cHJvZmlsZS5jaXR5Y29kZScpKTtcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLnBpbmNvZGUnLCB0aGlzLmdldCgnbXlwcm9maWxlLnBpbmNvZGUnKSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdteXByb2ZpbGUuY291bnRyeWNvZGUnKSAhPSBudWxsICYmIHRoaXMuZ2V0KCdteXByb2ZpbGUuY291bnRyeWNvZGUnKSAhPSAnJykge1xuICAgICAgICAgICAgdmlldy5nZXQoJ215cHJvZmlsZScpLmdldFN0YXRlTGlzdCh2aWV3KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXQoJ215cHJvZmlsZS5zdGF0ZWNvZGUnKSAhPSBudWxsICYmIHRoaXMuZ2V0KCdteXByb2ZpbGUuc3RhdGVjb2RlJykgIT0gJycpIHtcbiAgICAgICAgICAgIHZpZXcuZ2V0KCdteXByb2ZpbGUnKS5nZXRDaXR5TGlzdCh2aWV3KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uKCdjbG9zZW1lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAkKCcudWkucG9zaXRpdmUubWVzc2FnZScpLmZhZGVPdXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy91c2Vycy91cGRhdGVTZWxmLycsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YTogeydkYXRhJzogSlNPTi5zdHJpbmdpZnkodmlldy5nZXQoJ3Byb2ZpbGVmb3JtJykpfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChpZGQpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlkZCk7XG4gICAgICAgICAgICAgICAgaWYgKGlkZC5yZXN1bHQgPT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPScvYjJjL3VzZXJzL215cHJvZmlsZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihpZGQucmVzdWx0ID09ICdlcnJvcicpe1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJyxpZGQubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkZC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSxcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcbiAgICAgICAvL3RleHQodGhpcy5nZXQoJ3Byb2ZpbGVmb3JtJykuY2l0eSk7XG4gICAgICAgJCgnI2RpdnN0YXRlJykub24oJ2NsaWNrJyxmdW5jdGlvbihldmVudCl7JCgnI2RpdmNpdHkgLnVpLmRyb3Bkb3duJykuZHJvcGRvd24oJ3Jlc3RvcmUgZGVmYXVsdCB0ZXh0Jyk7XG4gICAgICAgIC8vdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScsJCgnI2RpdnN0YXRlIC5pdGVtLmFjdGl2ZS5zZWxlY3RlZCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XG4gICAgICAgIGlmKCh0eXBlb2Yodmlldy5nZXQoJ2NpdHlsaXN0JykpICE9IFwidW5kZWZpbmVkXCIpKVxuICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLG51bGwpO1xuICAgICAgIH0pO1xuICAgICAgICQoJyNkaXZjaXR5Jykub24oJ2NsaWNrJyxmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgIC8vY29uc29sZS5sb2coJ29uY2xpaWNrIGlkICcrJCgnI2RpdmNpdHkgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcbiAgICAgICAgIC8vICAkKCcjZGl2Y2l0eSAudWkuZHJvcGRvd24nKS5kcm9wZG93bignc2V0IHNlbGVjdGVkJywgJCgnI2RpdmNpdHkgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcbiAgICAgICAgICAvLyB2aWV3LnNldCgncHJvZmlsZWZvcm0uY2l0eWNvZGUnLCQoJyNkaXZjaXR5IC5pdGVtLmFjdGl2ZS5zZWxlY3RlZCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XG4gICAgICAgfSk7XG4gICAgICAgJCgnI2RpdmNvdW50cnknKS5vbignY2xpY2snLGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgaWYoKHR5cGVvZih2aWV3LmdldCgnc3RhdGVsaXN0JykpICE9IFwidW5kZWZpbmVkXCIpKVxuICAgICAgICAgICAgdmlldy5zZXQoJ3N0YXRlbGlzdCcsbnVsbCk7XG4gICAgICAgIGlmKCh0eXBlb2Yodmlldy5nZXQoJ2NpdHlsaXN0JykpICE9IFwidW5kZWZpbmVkXCIpKVxuICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLG51bGwpO1xuICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdvbmNsaWljayBpZCAnKyQoJyNkaXZjaXR5IC5pdGVtLmFjdGl2ZS5zZWxlY3RlZCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XG4gICAgICAgICAvLyAgJCgnI2RpdmNpdHkgLnVpLmRyb3Bkb3duJykuZHJvcGRvd24oJ3NldCBzZWxlY3RlZCcsICQoJyNkaXZjaXR5IC5pdGVtLmFjdGl2ZS5zZWxlY3RlZCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XG4gICAgICAgICAgLy8gdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLmNpdHljb2RlJywkKCcjZGl2Y2l0eSAuaXRlbS5hY3RpdmUuc2VsZWN0ZWQnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xuICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9ic2VydmUoJ3Byb2ZpbGVmb3JtLmNvdW50cnljb2RlJywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ3Byb2ZpbGVmb3JtLmNvdW50cnljb2RlJykgIT0gbnVsbCAmJiB0aGlzLmdldCgncHJvZmlsZWZvcm0uY291bnRyeWNvZGUnKSAhPSAnJykge1xuICAgICAgICAgICAgICAgIHZpZXcuZ2V0KCdteXByb2ZpbGUnKS5nZXRTdGF0ZUxpc3Qodmlldyk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcbiAgICAgICAgdGhpcy5vYnNlcnZlKCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJykgIT0gbnVsbCAmJiB0aGlzLmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJykgIT0gJycpIHsgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIHZpZXcuZ2V0KCdteXByb2ZpbGUnKS5nZXRDaXR5TGlzdCh2aWV3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XG4gICAgICAgIFxuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9teXByb2ZpbGUvZm9ybS5qc1xuLy8gbW9kdWxlIGlkID0gMzczXG4vLyBtb2R1bGUgY2h1bmtzID0gOCIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImgxXCIsXCJmXCI6W1wiTXkgUHJvZmlsZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6XCJ1aSBmb3JtIGJhc2ljIHNlZ21lbnQgZmxpZ2h0IHNlYXJjaFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIixcInN0eWxlXCI6XCJkaXNwbGF5OmJsb2NrXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnNcIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBncmlkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXRhaWxzXCJ9LFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIk5hbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIm5hbWVcIixcInBsYWNlaG9sZGVyXCI6XCJOYW1lXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLm5hbWVcIn1dfSxcImZcIjpbXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIkVtYWlsIEFkZHJlc3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1lbWFpbFwiLFwiYVwiOntcIm5hbWVcIjpcImVtYWlsXCIsXCJwbGFjZWhvbGRlclwiOlwiRS1NYWlsXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLmVtYWlsXCJ9XX19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJNb2JpbGUgTnVtYmVyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktdGVsXCIsXCJhXCI6e1wibmFtZVwiOlwibW9iaWxlXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9iaWxlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLm1vYmlsZVwifV19fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiQWRkcmVzc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwiYWRkcmVzc1wiLFwicGxhY2Vob2xkZXJcIjpcIkFkZHJlc3NcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvZmlsZWZvcm0uYWRkcmVzc1wifV19LFwiZlwiOltdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiQ291bnRyeVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvZmlsZWZvcm0uY291bnRyeWNvZGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIHRyYW5zcGFyZW50XCIsXCJwbGFjZWhvbGRlclwiOlwiQ291bnRyeVwiLFwic21hbGxcIjpcIjFcIixcInNlYXJjaFwiOlwiMVwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Q291bnRyeUxpc3RcIixcIm1ldGEuY291bnRyeWxpc3RcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJTdGF0ZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImlkXCI6XCJkaXZzdGF0ZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLnN0YXRlY29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgdHJhbnNwYXJlbnRcIixcInBsYWNlaG9sZGVyXCI6XCJTdGF0ZVwiLFwic2VhcmNoXCI6XCIxXCIsXCJzbWFsbFwiOlwiMVwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0U3RhdGVMaXN0XCIsXCJzdGF0ZWxpc3RcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJDaXR5XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiaWRcIjpcImRpdmNpdHlcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5jaXR5Y29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgdHJhbnNwYXJlbnRcIixcInBsYWNlaG9sZGVyXCI6XCJDaXR5XCIsXCJzZWFyY2hcIjpcIjFcIixcInNtYWxsXCI6XCIxXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRDaXR5TGlzdFwiLFwiY2l0eWxpc3RcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJQaW4gQ29kZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicGluY29kZVwiLFwicGxhY2Vob2xkZXJcIjpcIlBpbiBDb2RlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLnBpbmNvZGVcIn1dfX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJvbmUgY29sdW1uIHJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImVkaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiYVwiOntcImNsYXNzXCI6XCJ1aSBidXR0b24gbWFzc2l2ZSBmbHVpZFwifSxcImZcIjpbXCJVcGRhdGUgUHJvZmlsZVwiXX1dLFwiblwiOjUwLFwiclwiOlwibXlwcm9maWxlLmVkaXRcIn1dfV19XX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215cHJvZmlsZS9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM3NFxuLy8gbW9kdWxlIGNodW5rcyA9IDgiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ2ludGwtdGVsLWlucHV0L2J1aWxkL2pzL2ludGxUZWxJbnB1dCcpO1xuXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcbiAgICBcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcblxuXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcbiAgICAgICAgICAgIGlucHV0ID0gJCh0aGlzLmZpbmQoJ2lucHV0JykpXG4gICAgICAgICAgICA7XG5cblxuICAgICAgICBpbnB1dC5pbnRsVGVsSW5wdXQoe1xuICAgICAgICAgICAgYXV0b1BsYWNlaG9sZGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHByZWZlcnJlZENvdW50cmllczogWydpbicsJ3VzJywnZ2InLCdydSddLFxuICAgICAgICAgICAgbmF0aW9uYWxNb2RlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgLypcbiAgICAgICAgaW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pOyovXG4gICAgfSxcblxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5pbnRsVGVsSW5wdXQoJ2Rlc3Ryb3knKTtcbiAgICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvcmUvZm9ybS90ZWwuanNcbi8vIG1vZHVsZSBpZCA9IDM3NVxuLy8gbW9kdWxlIGNodW5rcyA9IDggOSIsIi8qXG5JbnRlcm5hdGlvbmFsIFRlbGVwaG9uZSBJbnB1dCB2NS44Ljdcbmh0dHBzOi8vZ2l0aHViLmNvbS9CbHVlZmllbGRzY29tL2ludGwtdGVsLWlucHV0LmdpdFxuKi9cbi8vIHdyYXAgaW4gVU1EIC0gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvanF1ZXJ5UGx1Z2luLmpzXG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWyBcImpxdWVyeVwiIF0sIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiAgICB9XG59KShmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyB0aGVzZSB2YXJzIHBlcnNpc3QgdGhyb3VnaCBhbGwgaW5zdGFuY2VzIG9mIHRoZSBwbHVnaW5cbiAgICB2YXIgcGx1Z2luTmFtZSA9IFwiaW50bFRlbElucHV0XCIsIGlkID0gMSwgLy8gZ2l2ZSBlYWNoIGluc3RhbmNlIGl0J3Mgb3duIGlkIGZvciBuYW1lc3BhY2VkIGV2ZW50IGhhbmRsaW5nXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHR5cGluZyBkaWdpdHMgYWZ0ZXIgYSB2YWxpZCBudW1iZXIgd2lsbCBiZSBhZGRlZCB0byB0aGUgZXh0ZW5zaW9uIHBhcnQgb2YgdGhlIG51bWJlclxuICAgICAgICBhbGxvd0V4dGVuc2lvbnM6IGZhbHNlLFxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IGZvcm1hdCB0aGUgbnVtYmVyIGFjY29yZGluZyB0byB0aGUgc2VsZWN0ZWQgY291bnRyeVxuICAgICAgICBhdXRvRm9ybWF0OiB0cnVlLFxuICAgICAgICAvLyBhZGQgb3IgcmVtb3ZlIGlucHV0IHBsYWNlaG9sZGVyIHdpdGggYW4gZXhhbXBsZSBudW1iZXIgZm9yIHRoZSBzZWxlY3RlZCBjb3VudHJ5XG4gICAgICAgIGF1dG9QbGFjZWhvbGRlcjogdHJ1ZSxcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMganVzdCBhIGRpYWwgY29kZSBpbiB0aGUgaW5wdXQ6IHJlbW92ZSBpdCBvbiBibHVyLCBhbmQgcmUtYWRkIGl0IG9uIGZvY3VzXG4gICAgICAgIGF1dG9IaWRlRGlhbENvZGU6IHRydWUsXG4gICAgICAgIC8vIGRlZmF1bHQgY291bnRyeVxuICAgICAgICBkZWZhdWx0Q291bnRyeTogXCJcIixcbiAgICAgICAgLy8gdG9rZW4gZm9yIGlwaW5mbyAtIHJlcXVpcmVkIGZvciBodHRwcyBvciBvdmVyIDEwMDAgZGFpbHkgcGFnZSB2aWV3cyBzdXBwb3J0XG4gICAgICAgIGlwaW5mb1Rva2VuOiBcIlwiLFxuICAgICAgICAvLyBkb24ndCBpbnNlcnQgaW50ZXJuYXRpb25hbCBkaWFsIGNvZGVzXG4gICAgICAgIG5hdGlvbmFsTW9kZTogdHJ1ZSxcbiAgICAgICAgLy8gbnVtYmVyIHR5cGUgdG8gdXNlIGZvciBwbGFjZWhvbGRlcnNcbiAgICAgICAgbnVtYmVyVHlwZTogXCJNT0JJTEVcIixcbiAgICAgICAgLy8gZGlzcGxheSBvbmx5IHRoZXNlIGNvdW50cmllc1xuICAgICAgICBvbmx5Q291bnRyaWVzOiBbXSxcbiAgICAgICAgLy8gdGhlIGNvdW50cmllcyBhdCB0aGUgdG9wIG9mIHRoZSBsaXN0LiBkZWZhdWx0cyB0byB1bml0ZWQgc3RhdGVzIGFuZCB1bml0ZWQga2luZ2RvbVxuICAgICAgICBwcmVmZXJyZWRDb3VudHJpZXM6IFsgXCJ1c1wiLCBcImdiXCIgXSxcbiAgICAgICAgLy8gc3BlY2lmeSB0aGUgcGF0aCB0byB0aGUgbGlicGhvbmVudW1iZXIgc2NyaXB0IHRvIGVuYWJsZSB2YWxpZGF0aW9uL2Zvcm1hdHRpbmdcbiAgICAgICAgdXRpbHNTY3JpcHQ6IFwiXCJcbiAgICB9LCBrZXlzID0ge1xuICAgICAgICBVUDogMzgsXG4gICAgICAgIERPV046IDQwLFxuICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgIEVTQzogMjcsXG4gICAgICAgIFBMVVM6IDQzLFxuICAgICAgICBBOiA2NSxcbiAgICAgICAgWjogOTAsXG4gICAgICAgIFpFUk86IDQ4LFxuICAgICAgICBOSU5FOiA1NyxcbiAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICBCU1BBQ0U6IDgsXG4gICAgICAgIERFTDogNDYsXG4gICAgICAgIENUUkw6IDE3LFxuICAgICAgICBDTUQxOiA5MSxcbiAgICAgICAgLy8gQ2hyb21lXG4gICAgICAgIENNRDI6IDIyNFxuICAgIH0sIHdpbmRvd0xvYWRlZCA9IGZhbHNlO1xuICAgIC8vIGtlZXAgdHJhY2sgb2YgaWYgdGhlIHdpbmRvdy5sb2FkIGV2ZW50IGhhcyBmaXJlZCBhcyBpbXBvc3NpYmxlIHRvIGNoZWNrIGFmdGVyIHRoZSBmYWN0XG4gICAgJCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvd0xvYWRlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gUGx1Z2luKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgLy8gZXZlbnQgbmFtZXNwYWNlXG4gICAgICAgIHRoaXMubnMgPSBcIi5cIiArIHBsdWdpbk5hbWUgKyBpZCsrO1xuICAgICAgICAvLyBDaHJvbWUsIEZGLCBTYWZhcmksIElFOStcbiAgICAgICAgdGhpcy5pc0dvb2RCcm93c2VyID0gQm9vbGVhbihlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKTtcbiAgICAgICAgdGhpcy5oYWRJbml0aWFsUGxhY2Vob2xkZXIgPSBCb29sZWFuKCQoZWxlbWVudCkuYXR0cihcInBsYWNlaG9sZGVyXCIpKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IHBsdWdpbk5hbWU7XG4gICAgfVxuICAgIFBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgICAgIF9pbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGlmIGluIG5hdGlvbmFsTW9kZSwgZGlzYWJsZSBvcHRpb25zIHJlbGF0aW5nIHRvIGRpYWwgY29kZXNcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElFIE1vYmlsZSBkb2Vzbid0IHN1cHBvcnQgdGhlIGtleXByZXNzIGV2ZW50IChzZWUgaXNzdWUgNjgpIHdoaWNoIG1ha2VzIGF1dG9Gb3JtYXQgaW1wb3NzaWJsZVxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmF1dG9Gb3JtYXQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBqdXN0IHRlc3Qgc2NyZWVuIHNpemUgYXMgc29tZSBzbWFydHBob25lcy93ZWJzaXRlIG1ldGEgdGFncyB3aWxsIHJlcG9ydCBkZXNrdG9wIHJlc29sdXRpb25zXG4gICAgICAgICAgICAvLyBOb3RlOiBmb3Igc29tZSByZWFzb24gamFzbWluZSBmdWNrcyB1cCBpZiB5b3UgcHV0IHRoaXMgaW4gdGhlIG1haW4gUGx1Z2luIGZ1bmN0aW9uIHdpdGggdGhlIHJlc3Qgb2YgdGhlc2UgZGVjbGFyYXRpb25zXG4gICAgICAgICAgICAvLyBOb3RlOiB0byB0YXJnZXQgQW5kcm9pZCBNb2JpbGVzIChhbmQgbm90IFRhYmxldHMpLCB3ZSBtdXN0IGZpbmQgXCJBbmRyb2lkXCIgYW5kIFwiTW9iaWxlXCJcbiAgICAgICAgICAgIHRoaXMuaXNNb2JpbGUgPSAvQW5kcm9pZC4rTW9iaWxlfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgICAgIC8vIHdlIHJldHVybiB0aGVzZSBkZWZlcnJlZCBvYmplY3RzIGZyb20gdGhlIF9pbml0KCkgY2FsbCBzbyB0aGV5IGNhbiBiZSB3YXRjaGVkLCBhbmQgdGhlbiB3ZSByZXNvbHZlIHRoZW0gd2hlbiBlYWNoIHNwZWNpZmljIHJlcXVlc3QgcmV0dXJuc1xuICAgICAgICAgICAgLy8gTm90ZTogYWdhaW4sIGphc21pbmUgaGFkIGEgc3Bhenogd2hlbiBJIHB1dCB0aGVzZSBpbiB0aGUgUGx1Z2luIGZ1bmN0aW9uXG4gICAgICAgICAgICB0aGlzLmF1dG9Db3VudHJ5RGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgdGhpcy51dGlsc1NjcmlwdERlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgICAgIC8vIHByb2Nlc3MgYWxsIHRoZSBkYXRhOiBvbmx5Q291bnRyaWVzLCBwcmVmZXJyZWRDb3VudHJpZXMgZXRjXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzQ291bnRyeURhdGEoKTtcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIHRoZSBtYXJrdXBcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlTWFya3VwKCk7XG4gICAgICAgICAgICAvLyBzZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGlucHV0IHZhbHVlIGFuZCB0aGUgc2VsZWN0ZWQgZmxhZ1xuICAgICAgICAgICAgdGhpcy5fc2V0SW5pdGlhbFN0YXRlKCk7XG4gICAgICAgICAgICAvLyBzdGFydCBhbGwgb2YgdGhlIGV2ZW50IGxpc3RlbmVyczogYXV0b0hpZGVEaWFsQ29kZSwgaW5wdXQga2V5ZG93biwgc2VsZWN0ZWRGbGFnIGNsaWNrXG4gICAgICAgICAgICB0aGlzLl9pbml0TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAvLyB1dGlscyBzY3JpcHQsIGFuZCBhdXRvIGNvdW50cnlcbiAgICAgICAgICAgIHRoaXMuX2luaXRSZXF1ZXN0cygpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBkZWZlcnJlZHNcbiAgICAgICAgICAgIHJldHVybiBbIHRoaXMuYXV0b0NvdW50cnlEZWZlcnJlZCwgdGhpcy51dGlsc1NjcmlwdERlZmVycmVkIF07XG4gICAgICAgIH0sXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKlxuICAgKiAgUFJJVkFURSBNRVRIT0RTXG4gICAqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgLy8gcHJlcGFyZSBhbGwgb2YgdGhlIGNvdW50cnkgZGF0YSwgaW5jbHVkaW5nIG9ubHlDb3VudHJpZXMgYW5kIHByZWZlcnJlZENvdW50cmllcyBvcHRpb25zXG4gICAgICAgIF9wcm9jZXNzQ291bnRyeURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gc2V0IHRoZSBpbnN0YW5jZXMgY291bnRyeSBkYXRhIG9iamVjdHNcbiAgICAgICAgICAgIHRoaXMuX3NldEluc3RhbmNlQ291bnRyeURhdGEoKTtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgcHJlZmVycmVkQ291bnRyaWVzIHByb3BlcnR5XG4gICAgICAgICAgICB0aGlzLl9zZXRQcmVmZXJyZWRDb3VudHJpZXMoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gYWRkIGEgY291bnRyeSBjb2RlIHRvIHRoaXMuY291bnRyeUNvZGVzXG4gICAgICAgIF9hZGRDb3VudHJ5Q29kZTogZnVuY3Rpb24oaXNvMiwgZGlhbENvZGUsIHByaW9yaXR5KSB7XG4gICAgICAgICAgICBpZiAoIShkaWFsQ29kZSBpbiB0aGlzLmNvdW50cnlDb2RlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlDb2Rlc1tkaWFsQ29kZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpbmRleCA9IHByaW9yaXR5IHx8IDA7XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlDb2Rlc1tkaWFsQ29kZV1baW5kZXhdID0gaXNvMjtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHJvY2VzcyBvbmx5Q291bnRyaWVzIGFycmF5IGlmIHByZXNlbnQsIGFuZCBnZW5lcmF0ZSB0aGUgY291bnRyeUNvZGVzIG1hcFxuICAgICAgICBfc2V0SW5zdGFuY2VDb3VudHJ5RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIC8vIHByb2Nlc3Mgb25seUNvdW50cmllcyBvcHRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25seUNvdW50cmllcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBzdGFuZGFyZGlzZSBjYXNlXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5vbmx5Q291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbmx5Q291bnRyaWVzW2ldID0gdGhpcy5vcHRpb25zLm9ubHlDb3VudHJpZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgaW5zdGFuY2UgY291bnRyeSBhcnJheVxuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyaWVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFsbENvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGFsbENvdW50cmllc1tpXS5pc28yLCB0aGlzLm9wdGlvbnMub25seUNvdW50cmllcykgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnRyaWVzLnB1c2goYWxsQ291bnRyaWVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJpZXMgPSBhbGxDb3VudHJpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBjb3VudHJ5Q29kZXMgbWFwXG4gICAgICAgICAgICB0aGlzLmNvdW50cnlDb2RlcyA9IHt9O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmNvdW50cmllc1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hZGRDb3VudHJ5Q29kZShjLmlzbzIsIGMuZGlhbENvZGUsIGMucHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgIC8vIGFyZWEgY29kZXNcbiAgICAgICAgICAgICAgICBpZiAoYy5hcmVhQ29kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjLmFyZWFDb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnVsbCBkaWFsIGNvZGUgaXMgY291bnRyeSBjb2RlICsgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRDb3VudHJ5Q29kZShjLmlzbzIsIGMuZGlhbENvZGUgKyBjLmFyZWFDb2Rlc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHByb2Nlc3MgcHJlZmVycmVkIGNvdW50cmllcyAtIGl0ZXJhdGUgdGhyb3VnaCB0aGUgcHJlZmVyZW5jZXMsXG4gICAgICAgIC8vIGZldGNoaW5nIHRoZSBjb3VudHJ5IGRhdGEgZm9yIGVhY2ggb25lXG4gICAgICAgIF9zZXRQcmVmZXJyZWRDb3VudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wcmVmZXJyZWRDb3VudHJpZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLnByZWZlcnJlZENvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb3VudHJ5Q29kZSA9IHRoaXMub3B0aW9ucy5wcmVmZXJyZWRDb3VudHJpZXNbaV0udG9Mb3dlckNhc2UoKSwgY291bnRyeURhdGEgPSB0aGlzLl9nZXRDb3VudHJ5RGF0YShjb3VudHJ5Q29kZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChjb3VudHJ5RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWZlcnJlZENvdW50cmllcy5wdXNoKGNvdW50cnlEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdlbmVyYXRlIGFsbCBvZiB0aGUgbWFya3VwIGZvciB0aGUgcGx1Z2luOiB0aGUgc2VsZWN0ZWQgZmxhZyBvdmVybGF5LCBhbmQgdGhlIGRyb3Bkb3duXG4gICAgICAgIF9nZW5lcmF0ZU1hcmt1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyB0ZWxlcGhvbmUgaW5wdXRcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQgPSAkKHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAvLyBwcmV2ZW50IGF1dG9jb21wbGV0ZSBhcyB0aGVyZSdzIG5vIHNhZmUsIGNyb3NzLWJyb3dzZXIgZXZlbnQgd2UgY2FuIHJlYWN0IHRvLCBzbyBpdCBjYW4gZWFzaWx5IHB1dCB0aGUgcGx1Z2luIGluIGFuIGluY29uc2lzdGVudCBzdGF0ZSBlLmcuIHRoZSB3cm9uZyBmbGFnIHNlbGVjdGVkIGZvciB0aGUgYXV0b2NvbXBsZXRlZCBudW1iZXIsIHdoaWNoIG9uIHN1Ym1pdCBjb3VsZCBtZWFuIHRoZSB3cm9uZyBudW1iZXIgaXMgc2F2ZWQgKGVzcCBpbiBuYXRpb25hbE1vZGUpXG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LmF0dHIoXCJhdXRvY29tcGxldGVcIiwgXCJvZmZcIik7XG4gICAgICAgICAgICAvLyBjb250YWluZXJzIChtb3N0bHkgZm9yIHBvc2l0aW9uaW5nKVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC53cmFwKCQoXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImludGwtdGVsLWlucHV0XCJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHZhciBmbGFnc0NvbnRhaW5lciA9ICQoXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZsYWctZHJvcGRvd25cIlxuICAgICAgICAgICAgfSkuaW5zZXJ0QWZ0ZXIodGhpcy50ZWxJbnB1dCk7XG4gICAgICAgICAgICAvLyBjdXJyZW50bHkgc2VsZWN0ZWQgZmxhZyAoZGlzcGxheWVkIHRvIGxlZnQgb2YgaW5wdXQpXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRGbGFnID0gJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic2VsZWN0ZWQtZmxhZ1wiXG4gICAgICAgICAgICB9KS5hcHBlbmRUbyhmbGFnc0NvbnRhaW5lcik7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyID0gJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaXRpLWZsYWdcIlxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oc2VsZWN0ZWRGbGFnKTtcbiAgICAgICAgICAgIC8vIENTUyB0cmlhbmdsZVxuICAgICAgICAgICAgJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYXJyb3dcIlxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oc2VsZWN0ZWRGbGFnKTtcbiAgICAgICAgICAgIC8vIGNvdW50cnkgbGlzdFxuICAgICAgICAgICAgLy8gbW9iaWxlIGlzIGp1c3QgYSBuYXRpdmUgc2VsZWN0IGVsZW1lbnRcbiAgICAgICAgICAgIC8vIGRlc2t0b3AgaXMgYSBwcm9wZXIgbGlzdCBjb250YWluaW5nOiBwcmVmZXJyZWQgY291bnRyaWVzLCB0aGVuIGRpdmlkZXIsIHRoZW4gYWxsIGNvdW50cmllc1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0ID0gJChcIjxzZWxlY3Q+XCIpLmFwcGVuZFRvKGZsYWdzQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdCA9ICQoXCI8dWw+XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNvdW50cnktbGlzdCB2LWhpZGVcIlxuICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKGZsYWdzQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVmZXJyZWRDb3VudHJpZXMubGVuZ3RoICYmICF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FwcGVuZExpc3RJdGVtcyh0aGlzLnByZWZlcnJlZENvdW50cmllcywgXCJwcmVmZXJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCI8bGk+XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkaXZpZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8odGhpcy5jb3VudHJ5TGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYXBwZW5kTGlzdEl0ZW1zKHRoaXMuY291bnRyaWVzLCBcIlwiKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vIG5vdyB3ZSBjYW4gZ3JhYiB0aGUgZHJvcGRvd24gaGVpZ2h0LCBhbmQgaGlkZSBpdCBwcm9wZXJseVxuICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd25IZWlnaHQgPSB0aGlzLmNvdW50cnlMaXN0Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5yZW1vdmVDbGFzcyhcInYtaGlkZVwiKS5hZGRDbGFzcyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyB1c2VmdWwgaW4gbG90cyBvZiBwbGFjZXNcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0SXRlbXMgPSB0aGlzLmNvdW50cnlMaXN0LmNoaWxkcmVuKFwiLmNvdW50cnlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFkZCBhIGNvdW50cnkgPGxpPiB0byB0aGUgY291bnRyeUxpc3QgPHVsPiBjb250YWluZXJcbiAgICAgICAgLy8gVVBEQVRFOiBpZiBpc01vYmlsZSwgYWRkIGFuIDxvcHRpb24+IHRvIHRoZSBjb3VudHJ5TGlzdCA8c2VsZWN0PiBjb250YWluZXJcbiAgICAgICAgX2FwcGVuZExpc3RJdGVtczogZnVuY3Rpb24oY291bnRyaWVzLCBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIC8vIHdlIGNyZWF0ZSBzbyBtYW55IERPTSBlbGVtZW50cywgaXQgaXMgZmFzdGVyIHRvIGJ1aWxkIGEgdGVtcCBzdHJpbmdcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGFkZCBldmVyeXRoaW5nIHRvIHRoZSBET00gaW4gb25lIGdvIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIHZhciB0bXAgPSBcIlwiO1xuICAgICAgICAgICAgLy8gZm9yIGVhY2ggY291bnRyeVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGNvdW50cmllc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8b3B0aW9uIGRhdGEtZGlhbC1jb2RlPSdcIiArIGMuZGlhbENvZGUgKyBcIicgdmFsdWU9J1wiICsgYy5pc28yICsgXCInPlwiO1xuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gYy5uYW1lICsgXCIgK1wiICsgYy5kaWFsQ29kZTtcbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPC9vcHRpb24+XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb3BlbiB0aGUgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxsaSBjbGFzcz0nY291bnRyeSBcIiArIGNsYXNzTmFtZSArIFwiJyBkYXRhLWRpYWwtY29kZT0nXCIgKyBjLmRpYWxDb2RlICsgXCInIGRhdGEtY291bnRyeS1jb2RlPSdcIiArIGMuaXNvMiArIFwiJz5cIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxkaXYgY2xhc3M9J2ZsYWcnPjxkaXYgY2xhc3M9J2l0aS1mbGFnIFwiICsgYy5pc28yICsgXCInPjwvZGl2PjwvZGl2PlwiO1xuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlIGNvdW50cnkgbmFtZSBhbmQgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxzcGFuIGNsYXNzPSdjb3VudHJ5LW5hbWUnPlwiICsgYy5uYW1lICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxzcGFuIGNsYXNzPSdkaWFsLWNvZGUnPitcIiArIGMuZGlhbENvZGUgKyBcIjwvc3Bhbj5cIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2UgdGhlIGxpc3QgaXRlbVxuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8L2xpPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QuYXBwZW5kKHRtcCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNldCB0aGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgaW5wdXQgdmFsdWUgYW5kIHRoZSBzZWxlY3RlZCBmbGFnXG4gICAgICAgIF9zZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudGVsSW5wdXQudmFsKCk7XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIG51bWJlciwgYW5kIGl0J3MgdmFsaWQsIHdlIGNhbiBnbyBhaGVhZCBhbmQgc2V0IHRoZSBmbGFnLCBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0XG4gICAgICAgICAgICBpZiAodGhpcy5fZ2V0RGlhbENvZGUodmFsKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUZsYWdGcm9tTnVtYmVyKHZhbCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSAhPSBcImF1dG9cIikge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRoZSBkZWZhdWx0Q291bnRyeSBvcHRpb24sIGVsc2UgZmFsbCBiYWNrIHRvIHRoZSBmaXJzdCBpbiB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID0gdGhpcy5fZ2V0Q291bnRyeURhdGEodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5LnRvTG93ZXJDYXNlKCksIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID0gdGhpcy5wcmVmZXJyZWRDb3VudHJpZXMubGVuZ3RoID8gdGhpcy5wcmVmZXJyZWRDb3VudHJpZXNbMF0gOiB0aGlzLmNvdW50cmllc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0RmxhZyh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkuaXNvMik7XG4gICAgICAgICAgICAgICAgLy8gaWYgZW1wdHksIGluc2VydCB0aGUgZGVmYXVsdCBkaWFsIGNvZGUgKHRoaXMgZnVuY3Rpb24gd2lsbCBjaGVjayAhbmF0aW9uYWxNb2RlIGFuZCAhYXV0b0hpZGVEaWFsQ29kZSlcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEaWFsQ29kZSh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkuZGlhbENvZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBmb3JtYXRcbiAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHdvbnQgYmUgcnVuIGFmdGVyIF91cGRhdGVEaWFsQ29kZSBhcyB0aGF0J3Mgb25seSBjYWxsZWQgaWYgbm8gdmFsXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGluaXRpYWxpc2UgdGhlIG1haW4gZXZlbnQgbGlzdGVuZXJzOiBpbnB1dCBrZXl1cCwgYW5kIGNsaWNrIHNlbGVjdGVkIGZsYWdcbiAgICAgICAgX2luaXRMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5faW5pdEtleUxpc3RlbmVycygpO1xuICAgICAgICAgICAgLy8gYXV0b0Zvcm1hdCBwcmV2ZW50cyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gZmlyaW5nLCBzbyB3ZSBuZWVkIHRvIGNoZWNrIGZvciBjaGFuZ2VzIGJldHdlZW4gZm9jdXMgYW5kIGJsdXIgaW4gb3JkZXIgdG8gbWFudWFsbHkgdHJpZ2dlciBpdFxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlIHx8IHRoaXMub3B0aW9ucy5hdXRvRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdEZvY3VzTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3Qub24oXCJjaGFuZ2VcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fc2VsZWN0TGlzdEl0ZW0oJCh0aGlzKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaGFjayBmb3IgaW5wdXQgbmVzdGVkIGluc2lkZSBsYWJlbDogY2xpY2tpbmcgdGhlIHNlbGVjdGVkLWZsYWcgdG8gb3BlbiB0aGUgZHJvcGRvd24gd291bGQgdGhlbiBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgYSAybmQgY2xpY2sgb24gdGhlIGlucHV0IHdoaWNoIHdvdWxkIGNsb3NlIGl0IGFnYWluXG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy50ZWxJbnB1dC5jbG9zZXN0KFwibGFiZWxcIik7XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbC5vbihcImNsaWNrXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCB0aGVuIGZvY3VzIHRoZSBpbnB1dCwgZWxzZSBpZ25vcmUgdGhlIGNsaWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5jb3VudHJ5TGlzdC5oYXNDbGFzcyhcImhpZGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHRvZ2dsZSBjb3VudHJ5IGRyb3Bkb3duIG9uIGNsaWNrXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkRmxhZyA9IHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRGbGFnLm9uKFwiY2xpY2tcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSBpbnRlcmNlcHQgdGhpcyBldmVudCBpZiB3ZSdyZSBvcGVuaW5nIHRoZSBkcm9wZG93blxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGxldCBpdCBidWJibGUgdXAgdG8gdGhlIHRvcCAoXCJjbGljay1vZmYtdG8tY2xvc2VcIiBsaXN0ZW5lcilcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2Fubm90IGp1c3Qgc3RvcFByb3BhZ2F0aW9uIGFzIGl0IG1heSBiZSBuZWVkZWQgdG8gY2xvc2UgYW5vdGhlciBpbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5jb3VudHJ5TGlzdC5oYXNDbGFzcyhcImhpZGVcIikgJiYgIXRoYXQudGVsSW5wdXQucHJvcChcImRpc2FibGVkXCIpICYmICF0aGF0LnRlbElucHV0LnByb3AoXCJyZWFkb25seVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fc2hvd0Ryb3Bkb3duKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2luaXRSZXF1ZXN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBoYXMgc3BlY2lmaWVkIHRoZSBwYXRoIHRvIHRoZSB1dGlscyBzY3JpcHQsIGZldGNoIGl0IG9uIHdpbmRvdy5sb2FkXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnV0aWxzU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBsdWdpbiBpcyBiZWluZyBpbml0aWFsaXNlZCBhZnRlciB0aGUgd2luZG93LmxvYWQgZXZlbnQgaGFzIGFscmVhZHkgYmVlbiBmaXJlZFxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3dMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVXRpbHMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyB3YWl0IHVudGlsIHRoZSBsb2FkIGV2ZW50IHNvIHdlIGRvbid0IGJsb2NrIGFueSBvdGhlciByZXF1ZXN0cyBlLmcuIHRoZSBmbGFncyBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubG9hZFV0aWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dGlsc1NjcmlwdERlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPT0gXCJhdXRvXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkQXV0b0NvdW50cnkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvQ291bnRyeURlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2xvYWRBdXRvQ291bnRyeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgY29va2llXG4gICAgICAgICAgICB2YXIgY29va2llQXV0b0NvdW50cnkgPSAkLmNvb2tpZSA/ICQuY29va2llKFwiaXRpQXV0b0NvdW50cnlcIikgOiBcIlwiO1xuICAgICAgICAgICAgaWYgKGNvb2tpZUF1dG9Db3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgJC5mbltwbHVnaW5OYW1lXS5hdXRvQ291bnRyeSA9IGNvb2tpZUF1dG9Db3VudHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gMyBvcHRpb25zOlxuICAgICAgICAgICAgLy8gMSkgYWxyZWFkeSBsb2FkZWQgKHdlJ3JlIGRvbmUpXG4gICAgICAgICAgICAvLyAyKSBub3QgYWxyZWFkeSBzdGFydGVkIGxvYWRpbmcgKHN0YXJ0KVxuICAgICAgICAgICAgLy8gMykgYWxyZWFkeSBzdGFydGVkIGxvYWRpbmcgKGRvIG5vdGhpbmcgLSBqdXN0IHdhaXQgZm9yIGxvYWRpbmcgY2FsbGJhY2sgdG8gZmlyZSlcbiAgICAgICAgICAgIGlmICgkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvQ291bnRyeUxvYWRlZCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghJC5mbltwbHVnaW5OYW1lXS5zdGFydGVkTG9hZGluZ0F1dG9Db3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgZG8gdGhpcyB0d2ljZSFcbiAgICAgICAgICAgICAgICAkLmZuW3BsdWdpbk5hbWVdLnN0YXJ0ZWRMb2FkaW5nQXV0b0NvdW50cnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBpcGluZm9VUkwgPSBcIi8vaXBpbmZvLmlvXCI7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pcGluZm9Ub2tlbikge1xuICAgICAgICAgICAgICAgICAgICBpcGluZm9VUkwgKz0gXCI/dG9rZW49XCIgKyB0aGlzLm9wdGlvbnMuaXBpbmZvVG9rZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvbnQgYm90aGVyIHdpdGggdGhlIHN1Y2Nlc3MgZnVuY3Rpb24gYXJnIC0gaW5zdGVhZCB1c2UgYWx3YXlzKCkgYXMgc2hvdWxkIHN0aWxsIHNldCBhIGRlZmF1bHRDb3VudHJ5IGV2ZW4gaWYgdGhlIGxvb2t1cCBmYWlsc1xuICAgICAgICAgICAgICAgICQuZ2V0KGlwaW5mb1VSTCwgZnVuY3Rpb24oKSB7fSwgXCJqc29ucFwiKS5hbHdheXMoZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICAgICAgICAgICAgICAkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5ID0gcmVzcCAmJiByZXNwLmNvdW50cnkgPyByZXNwLmNvdW50cnkudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmNvb2tpZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoXCJpdGlBdXRvQ291bnRyeVwiLCAkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogXCIvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbGwgYWxsIGluc3RhbmNlcyB0aGUgYXV0byBjb3VudHJ5IGlzIHJlYWR5XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgc2hvdWxkIGp1c3QgYmUgdGhlIGN1cnJlbnQgaW5zdGFuY2VzXG4gICAgICAgICAgICAgICAgICAgICQoXCIuaW50bC10ZWwtaW5wdXQgaW5wdXRcIikuaW50bFRlbElucHV0KFwiYXV0b0NvdW50cnlMb2FkZWRcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9pbml0S2V5TGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIC8vIGZvcm1hdCBudW1iZXIgYW5kIHVwZGF0ZSBmbGFnIG9uIGtleXByZXNzXG4gICAgICAgICAgICAgICAgLy8gdXNlIGtleXByZXNzIGV2ZW50IGFzIHdlIHdhbnQgdG8gaWdub3JlIGFsbCBpbnB1dCBleGNlcHQgZm9yIGEgc2VsZWN0IGZldyBrZXlzLFxuICAgICAgICAgICAgICAgIC8vIGJ1dCB3ZSBkb250IHdhbnQgdG8gaWdub3JlIHRoZSBuYXZpZ2F0aW9uIGtleXMgbGlrZSB0aGUgYXJyb3dzIGV0Yy5cbiAgICAgICAgICAgICAgICAvLyBOT1RFOiBubyBwb2ludCBpbiByZWZhY3RvcmluZyB0aGlzIHRvIG9ubHkgYmluZCB0aGVzZSBsaXN0ZW5lcnMgb24gZm9jdXMvYmx1ciBiZWNhdXNlIHRoZW4geW91IHdvdWxkIG5lZWQgdG8gaGF2ZSB0aG9zZSAyIGxpc3RlbmVycyBydW5uaW5nIHRoZSB3aG9sZSB0aW1lIGFueXdheS4uLlxuICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJrZXlwcmVzc1wiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAzMiBpcyBzcGFjZSwgYW5kIGFmdGVyIHRoYXQgaXQncyBhbGwgY2hhcnMgKG5vdCBtZXRhL25hdiBrZXlzKVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGZpeCBpcyBuZWVkZWQgZm9yIEZpcmVmb3gsIHdoaWNoIHRyaWdnZXJzIGtleXByZXNzIGV2ZW50IGZvciBzb21lIG1ldGEvbmF2IGtleXNcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlOiBhbHNvIGlnbm9yZSBpZiB0aGlzIGlzIGEgbWV0YUtleSBlLmcuIEZGIGFuZCBTYWZhcmkgdHJpZ2dlciBrZXlwcmVzcyBvbiB0aGUgdiBvZiBDdHJsK3ZcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlOiBhbHNvIGlnbm9yZSBpZiBjdHJsS2V5IChGRiBvbiBXaW5kb3dzL1VidW50dSlcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlOiBhbHNvIGNoZWNrIHRoYXQgd2UgaGF2ZSB1dGlscyBiZWZvcmUgd2UgZG8gYW55IGF1dG9Gb3JtYXQgc3R1ZmZcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPj0ga2V5cy5TUEFDRSAmJiAhZS5jdHJsS2V5ICYmICFlLm1ldGFLZXkgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzICYmICF0aGF0LnRlbElucHV0LnByb3AoXCJyZWFkb25seVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsb3dlZCBrZXlzIGFyZSBqdXN0IG51bWVyaWMga2V5cyBhbmQgcGx1c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgbXVzdCBhbGxvdyBwbHVzIGZvciB0aGUgY2FzZSB3aGVyZSB0aGUgdXNlciBkb2VzIHNlbGVjdC1hbGwgYW5kIHRoZW4gaGl0cyBwbHVzIHRvIHN0YXJ0IHR5cGluZyBhIG5ldyBudW1iZXIuIHdlIGNvdWxkIHJlZmluZSB0aGlzIGxvZ2ljIHRvIGZpcnN0IGNoZWNrIHRoYXQgdGhlIHNlbGVjdGlvbiBjb250YWlucyBhIHBsdXMsIGJ1dCB0aGF0IHdvbnQgd29yayBpbiBvbGQgYnJvd3NlcnMsIGFuZCBJIHRoaW5rIGl0J3Mgb3ZlcmtpbGwgYW55d2F5XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNBbGxvd2VkS2V5ID0gZS53aGljaCA+PSBrZXlzLlpFUk8gJiYgZS53aGljaCA8PSBrZXlzLk5JTkUgfHwgZS53aGljaCA9PSBrZXlzLlBMVVMsIGlucHV0ID0gdGhhdC50ZWxJbnB1dFswXSwgbm9TZWxlY3Rpb24gPSB0aGF0LmlzR29vZEJyb3dzZXIgJiYgaW5wdXQuc2VsZWN0aW9uU3RhcnQgPT0gaW5wdXQuc2VsZWN0aW9uRW5kLCBtYXggPSB0aGF0LnRlbElucHV0LmF0dHIoXCJtYXhsZW5ndGhcIiksIHZhbCA9IHRoYXQudGVsSW5wdXQudmFsKCksIC8vIGFzc3VtZXMgdGhhdCBpZiBtYXggZXhpc3RzLCBpdCBpcyA+MFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNCZWxvd01heCA9IG1heCA/IHZhbC5sZW5ndGggPCBtYXggOiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Q6IGVuc3VyZSB3ZSBkb250IGdvIG92ZXIgbWF4bGVuZ3RoLiB3ZSBtdXN0IGRvIHRoaXMgaGVyZSB0byBwcmV2ZW50IGFkZGluZyBkaWdpdHMgaW4gdGhlIG1pZGRsZSBvZiB0aGUgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdGlsbCByZWZvcm1hdCBldmVuIGlmIG5vdCBhbiBhbGxvd2VkIGtleSBhcyB0aGV5IGNvdWxkIGJ5IHR5cGluZyBhIGZvcm1hdHRpbmcgY2hhciwgYnV0IGlnbm9yZSBpZiB0aGVyZSdzIGEgc2VsZWN0aW9uIGFzIGRvZXNuJ3QgbWFrZSBzZW5zZSB0byByZXBsYWNlIHNlbGVjdGlvbiB3aXRoIGlsbGVnYWwgY2hhciBhbmQgdGhlbiBpbW1lZGlhdGVseSByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0JlbG93TWF4ICYmIChpc0FsbG93ZWRLZXkgfHwgbm9TZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0NoYXIgPSBpc0FsbG93ZWRLZXkgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVJbnB1dEtleShuZXdDaGFyLCB0cnVlLCBpc0FsbG93ZWRLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHNvbWV0aGluZyBoYXMgY2hhbmdlZCwgdHJpZ2dlciB0aGUgaW5wdXQgZXZlbnQgKHdoaWNoIHdhcyBvdGhlcndpc2VkIHNxdWFzaGVkIGJ5IHRoZSBwcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9IHRoYXQudGVsSW5wdXQudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FsbG93ZWRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVJbnZhbGlkS2V5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGhhbmRsZSBjdXQvcGFzdGUgZXZlbnQgKG5vdyBzdXBwb3J0ZWQgaW4gYWxsIG1ham9yIGJyb3dzZXJzKVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcImN1dFwiICsgdGhpcy5ucyArIFwiIHBhc3RlXCIgKyB0aGlzLm5zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBoYWNrIGJlY2F1c2UgXCJwYXN0ZVwiIGV2ZW50IGlzIGZpcmVkIGJlZm9yZSBpbnB1dCBpcyB1cGRhdGVkXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5hdXRvRm9ybWF0ICYmIHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnNvckF0RW5kID0gdGhhdC5pc0dvb2RCcm93c2VyICYmIHRoYXQudGVsSW5wdXRbMF0uc2VsZWN0aW9uU3RhcnQgPT0gdGhhdC50ZWxJbnB1dC52YWwoKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVJbnB1dEtleShudWxsLCBjdXJzb3JBdEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9lbnN1cmVQbHVzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBubyBhdXRvRm9ybWF0LCBqdXN0IHVwZGF0ZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll91cGRhdGVGbGFnRnJvbU51bWJlcih0aGF0LnRlbElucHV0LnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBoYW5kbGUga2V5dXAgZXZlbnRcbiAgICAgICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQgZW5hYmxlZDogd2UgdXNlIGtleXVwIHRvIGNhdGNoIGRlbGV0ZSBldmVudHMgKGFmdGVyIHRoZSBmYWN0KVxuICAgICAgICAgICAgLy8gaWYgbm8gYXV0b0Zvcm1hdCwgdGhpcyBpcyB1c2VkIHRvIHVwZGF0ZSB0aGUgZmxhZ1xuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcImtleXVwXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIFwiZW50ZXJcIiBrZXkgZXZlbnQgZnJvbSBzZWxlY3RpbmcgYSBkcm9wZG93biBpdGVtIGlzIHRyaWdnZXJlZCBoZXJlIG9uIHRoZSBpbnB1dCwgYmVjYXVzZSB0aGUgZG9jdW1lbnQua2V5ZG93biBoYW5kbGVyIHRoYXQgaW5pdGlhbGx5IGhhbmRsZXMgdGhhdCBldmVudCB0cmlnZ2VycyBhIGZvY3VzIG9uIHRoZSBpbnB1dCwgYW5kIHNvIHRoZSBrZXl1cCBmb3IgdGhhdCBzYW1lIGtleSBldmVudCBnZXRzIHRyaWdnZXJlZCBoZXJlLiB3ZWlyZCwgYnV0IGp1c3QgbWFrZSBzdXJlIHdlIGRvbnQgYm90aGVyIGRvaW5nIGFueSByZS1mb3JtYXR0aW5nIGluIHRoaXMgY2FzZSAod2UndmUgYWxyZWFkeSBkb25lIHByZXZlbnREZWZhdWx0IGluIHRoZSBrZXlkb3duIGhhbmRsZXIsIHNvIGl0IHdvbnQgYWN0dWFsbHkgc3VibWl0IHRoZSBmb3JtIG9yIGFueXRoaW5nKS5cbiAgICAgICAgICAgICAgICAvLyBBTFNPOiBpZ25vcmUga2V5dXAgaWYgcmVhZG9ubHlcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlzLkVOVEVSIHx8IHRoYXQudGVsSW5wdXQucHJvcChcInJlYWRvbmx5XCIpKSB7fSBlbHNlIGlmICh0aGF0Lm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY3Vyc29yQXRFbmQgZGVmYXVsdHMgdG8gZmFsc2UgZm9yIGJhZCBicm93c2VycyBlbHNlIHRoZXkgd291bGQgbmV2ZXIgZ2V0IGEgcmVmb3JtYXQgb24gZGVsZXRlXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJzb3JBdEVuZCA9IHRoYXQuaXNHb29kQnJvd3NlciAmJiB0aGF0LnRlbElucHV0WzBdLnNlbGVjdGlvblN0YXJ0ID09IHRoYXQudGVsSW5wdXQudmFsKCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQudGVsSW5wdXQudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXkganVzdCBjbGVhcmVkIHRoZSBpbnB1dCwgdXBkYXRlIHRoZSBmbGFnIHRvIHRoZSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll91cGRhdGVGbGFnRnJvbU51bWJlcihcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09IGtleXMuREVMICYmICFjdXJzb3JBdEVuZCB8fCBlLndoaWNoID09IGtleXMuQlNQQUNFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBkZWxldGUgaW4gdGhlIG1pZGRsZTogcmVmb3JtYXQgd2l0aCBubyBzdWZmaXggKG5vIG5lZWQgdG8gcmVmb3JtYXQgaWYgZGVsZXRlIGF0IGVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGJhY2tzcGFjZTogcmVmb3JtYXQgd2l0aCBubyBzdWZmaXggKG5lZWQgdG8gcmVmb3JtYXQgaWYgYXQgZW5kIHRvIHJlbW92ZSBhbnkgbGluZ2VyaW5nIHN1ZmZpeCAtIHRoaXMgaXMgYSBmZWF0dXJlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0YW50IHRvIHJlbWVtYmVyIG5ldmVyIHRvIGFkZCBzdWZmaXggb24gYW55IGRlbGV0ZSBrZXkgYXMgY2FuIGZ1Y2sgdXAgaW4gaWU4IHNvIHlvdSBjYW4gbmV2ZXIgZGVsZXRlIGEgZm9ybWF0dGluZyBjaGFyIGF0IHRoZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZUlucHV0S2V5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fZW5zdXJlUGx1cygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGF1dG9Gb3JtYXQsIGp1c3QgdXBkYXRlIGZsYWdcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fdXBkYXRlRmxhZ0Zyb21OdW1iZXIodGhhdC50ZWxJbnB1dC52YWwoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHByZXZlbnQgZGVsZXRpbmcgdGhlIHBsdXMgKGlmIG5vdCBpbiBuYXRpb25hbE1vZGUpXG4gICAgICAgIF9lbnN1cmVQbHVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnRlbElucHV0LnZhbCgpLCBpbnB1dCA9IHRoaXMudGVsSW5wdXRbMF07XG4gICAgICAgICAgICAgICAgaWYgKHZhbC5jaGFyQXQoMCkgIT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV3Q3Vyc29yUG9zIGlzIGN1cnJlbnQgcG9zICsgMSB0byBhY2NvdW50IGZvciB0aGUgcGx1cyB3ZSBhcmUgYWJvdXQgdG8gYWRkXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdDdXJzb3JQb3MgPSB0aGlzLmlzR29vZEJyb3dzZXIgPyBpbnB1dC5zZWxlY3Rpb25TdGFydCArIDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0LnZhbChcIitcIiArIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzR29vZEJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnNldFNlbGVjdGlvblJhbmdlKG5ld0N1cnNvclBvcywgbmV3Q3Vyc29yUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gYWxlcnQgdGhlIHVzZXIgdG8gYW4gaW52YWxpZCBrZXkgZXZlbnRcbiAgICAgICAgX2hhbmRsZUludmFsaWRLZXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC50cmlnZ2VyKFwiaW52YWxpZGtleVwiKS5hZGRDbGFzcyhcIml0aS1pbnZhbGlkLWtleVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5yZW1vdmVDbGFzcyhcIml0aS1pbnZhbGlkLWtleVwiKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHdoZW4gYXV0b0Zvcm1hdCBpcyBlbmFibGVkOiBoYW5kbGUgdmFyaW91cyBrZXkgZXZlbnRzIG9uIHRoZSBpbnB1dDpcbiAgICAgICAgLy8gMSkgYWRkaW5nIGEgbmV3IG51bWJlciBjaGFyYWN0ZXIsIHdoaWNoIHdpbGwgcmVwbGFjZSBhbnkgc2VsZWN0aW9uLCByZWZvcm1hdCwgYW5kIHByZXNlcnZlIHRoZSBjdXJzb3IgcG9zaXRpb25cbiAgICAgICAgLy8gMikgcmVmb3JtYXR0aW5nIG9uIGJhY2tzcGFjZS9kZWxldGVcbiAgICAgICAgLy8gMykgY3V0L3Bhc3RlIGV2ZW50XG4gICAgICAgIF9oYW5kbGVJbnB1dEtleTogZnVuY3Rpb24obmV3TnVtZXJpY0NoYXIsIGFkZFN1ZmZpeCwgaXNBbGxvd2VkS2V5KSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy50ZWxJbnB1dC52YWwoKSwgY2xlYW5CZWZvcmUgPSB0aGlzLl9nZXRDbGVhbih2YWwpLCBvcmlnaW5hbExlZnRDaGFycywgLy8gcmF3IERPTSBlbGVtZW50XG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMudGVsSW5wdXRbMF0sIGRpZ2l0c09uUmlnaHQgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIC8vIGN1cnNvciBzdHJhdGVneTogbWFpbnRhaW4gdGhlIG51bWJlciBvZiBkaWdpdHMgb24gdGhlIHJpZ2h0LiB3ZSB1c2UgdGhlIHJpZ2h0IGluc3RlYWQgb2YgdGhlIGxlZnQgc28gdGhhdCBBKSB3ZSBkb250IGhhdmUgdG8gYWNjb3VudCBmb3IgdGhlIG5ldyBkaWdpdCAob3IgbXVsdGlwbGUgZGlnaXRzIGlmIHBhc3RlIGV2ZW50KSwgYW5kIEIpIHdlJ3JlIGFsd2F5cyBvbiB0aGUgcmlnaHQgc2lkZSBvZiBmb3JtYXR0aW5nIHN1ZmZpeGVzXG4gICAgICAgICAgICAgICAgZGlnaXRzT25SaWdodCA9IHRoaXMuX2dldERpZ2l0c09uUmlnaHQodmFsLCBpbnB1dC5zZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGhhbmRsaW5nIGEgbmV3IG51bWJlciBjaGFyYWN0ZXI6IGluc2VydCBpdCBpbiB0aGUgcmlnaHQgcGxhY2VcbiAgICAgICAgICAgICAgICBpZiAobmV3TnVtZXJpY0NoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBhbnkgc2VsZWN0aW9uIHRoZXkgbWF5IGhhdmUgbWFkZSB3aXRoIHRoZSBuZXcgY2hhclxuICAgICAgICAgICAgICAgICAgICB2YWwgPSB2YWwuc3Vic3RyKDAsIGlucHV0LnNlbGVjdGlvblN0YXJ0KSArIG5ld051bWVyaWNDaGFyICsgdmFsLnN1YnN0cmluZyhpbnB1dC5zZWxlY3Rpb25FbmQsIHZhbC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhlcmUgd2UncmUgbm90IGhhbmRsaW5nIGEgbmV3IGNoYXIsIHdlJ3JlIGp1c3QgZG9pbmcgYSByZS1mb3JtYXQgKGUuZy4gb24gZGVsZXRlL2JhY2tzcGFjZS9wYXN0ZSwgYWZ0ZXIgdGhlIGZhY3QpLCBidXQgd2Ugc3RpbGwgbmVlZCB0byBtYWludGFpbiB0aGUgY3Vyc29yIHBvc2l0aW9uLiBzbyBtYWtlIG5vdGUgb2YgdGhlIGNoYXIgb24gdGhlIGxlZnQsIGFuZCB0aGVuIGFmdGVyIHRoZSByZS1mb3JtYXQsIHdlJ2xsIGNvdW50IGluIHRoZSBzYW1lIG51bWJlciBvZiBkaWdpdHMgZnJvbSB0aGUgcmlnaHQsIGFuZCB0aGVuIGtlZXAgZ29pbmcgdGhyb3VnaCBhbnkgZm9ybWF0dGluZyBjaGFycyB1bnRpbCB3ZSBoaXQgdGhlIHNhbWUgbGVmdCBjaGFyIHRoYXQgd2UgaGFkIGJlZm9yZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gVVBEQVRFOiBub3cgaGF2ZSB0byBzdG9yZSAyIGNoYXJzIGFzIGV4dGVuc2lvbnMgZm9ybWF0dGluZyBjb250YWlucyAyIHNwYWNlcyBzbyB5b3UgbmVlZCB0byBiZSBhYmxlIHRvIGRpc3Rpbmd1aXNoXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsTGVmdENoYXJzID0gdmFsLnN1YnN0cihpbnB1dC5zZWxlY3Rpb25TdGFydCAtIDIsIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3TnVtZXJpY0NoYXIpIHtcbiAgICAgICAgICAgICAgICB2YWwgKz0gbmV3TnVtZXJpY0NoYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIG51bWJlciBhbmQgZmxhZ1xuICAgICAgICAgICAgdGhpcy5zZXROdW1iZXIodmFsLCBudWxsLCBhZGRTdWZmaXgsIHRydWUsIGlzQWxsb3dlZEtleSk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGN1cnNvciBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIHZhciBuZXdDdXJzb3I7XG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy50ZWxJbnB1dC52YWwoKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCB3YXMgYXQgdGhlIGVuZCwga2VlcCBpdCB0aGVyZVxuICAgICAgICAgICAgICAgIGlmICghZGlnaXRzT25SaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdDdXJzb3IgPSB2YWwubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgY291bnQgaW4gdGhlIHNhbWUgbnVtYmVyIG9mIGRpZ2l0cyBmcm9tIHRoZSByaWdodFxuICAgICAgICAgICAgICAgICAgICBuZXdDdXJzb3IgPSB0aGlzLl9nZXRDdXJzb3JGcm9tRGlnaXRzT25SaWdodCh2YWwsIGRpZ2l0c09uUmlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBidXQgaWYgZGVsZXRlL3Bhc3RlIGV0Yywga2VlcCBnb2luZyBsZWZ0IHVudGlsIGhpdCB0aGUgc2FtZSBsZWZ0IGNoYXIgYXMgYmVmb3JlXG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV3TnVtZXJpY0NoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0N1cnNvciA9IHRoaXMuX2dldEN1cnNvckZyb21MZWZ0Q2hhcih2YWwsIG5ld0N1cnNvciwgb3JpZ2luYWxMZWZ0Q2hhcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgbmV3IGN1cnNvclxuICAgICAgICAgICAgICAgIGlucHV0LnNldFNlbGVjdGlvblJhbmdlKG5ld0N1cnNvciwgbmV3Q3Vyc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gd2Ugc3RhcnQgZnJvbSB0aGUgcG9zaXRpb24gaW4gZ3Vlc3NDdXJzb3IsIGFuZCB3b3JrIG91ciB3YXkgbGVmdCB1bnRpbCB3ZSBoaXQgdGhlIG9yaWdpbmFsTGVmdENoYXJzIG9yIGEgbnVtYmVyIHRvIG1ha2Ugc3VyZSB0aGF0IGFmdGVyIHJlZm9ybWF0dGluZyB0aGUgY3Vyc29yIGhhcyB0aGUgc2FtZSBjaGFyIG9uIHRoZSBsZWZ0IGluIHRoZSBjYXNlIG9mIGEgZGVsZXRlIGV0Y1xuICAgICAgICBfZ2V0Q3Vyc29yRnJvbUxlZnRDaGFyOiBmdW5jdGlvbih2YWwsIGd1ZXNzQ3Vyc29yLCBvcmlnaW5hbExlZnRDaGFycykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGd1ZXNzQ3Vyc29yOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRDaGFyID0gdmFsLmNoYXJBdChpIC0gMSk7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNOdW1lcmljKGxlZnRDaGFyKSB8fCB2YWwuc3Vic3RyKGkgLSAyLCAyKSA9PSBvcmlnaW5hbExlZnRDaGFycykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gYWZ0ZXIgYSByZWZvcm1hdCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgc3RpbGwgdGhlIHNhbWUgbnVtYmVyIG9mIGRpZ2l0cyB0byB0aGUgcmlnaHQgb2YgdGhlIGN1cnNvclxuICAgICAgICBfZ2V0Q3Vyc29yRnJvbURpZ2l0c09uUmlnaHQ6IGZ1bmN0aW9uKHZhbCwgZGlnaXRzT25SaWdodCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHZhbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyh2YWwuY2hhckF0KGkpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoLS1kaWdpdHNPblJpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9LFxuICAgICAgICAvLyBnZXQgdGhlIG51bWJlciBvZiBudW1lcmljIGRpZ2l0cyB0byB0aGUgcmlnaHQgb2YgdGhlIGN1cnNvciBzbyB3ZSBjYW4gcmVwb3NpdGlvbiB0aGUgY3Vyc29yIGNvcnJlY3RseSBhZnRlciB0aGUgcmVmb3JtYXQgaGFzIGhhcHBlbmVkXG4gICAgICAgIF9nZXREaWdpdHNPblJpZ2h0OiBmdW5jdGlvbih2YWwsIHNlbGVjdGlvbkVuZCkge1xuICAgICAgICAgICAgdmFyIGRpZ2l0c09uUmlnaHQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNlbGVjdGlvbkVuZDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyh2YWwuY2hhckF0KGkpKSkge1xuICAgICAgICAgICAgICAgICAgICBkaWdpdHNPblJpZ2h0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRpZ2l0c09uUmlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGxpc3RlbiBmb3IgZm9jdXMgYW5kIGJsdXJcbiAgICAgICAgX2luaXRGb2N1c0xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBtb3VzZWRvd24gZGVjaWRlcyB3aGVyZSB0aGUgY3Vyc29yIGdvZXMsIHNvIGlmIHdlJ3JlIGZvY3VzaW5nIHdlIG11c3QgcHJldmVudERlZmF1bHQgYXMgd2UnbGwgYmUgaW5zZXJ0aW5nIHRoZSBkaWFsIGNvZGUsIGFuZCB3ZSB3YW50IHRoZSBjdXJzb3IgdG8gYmUgYXQgdGhlIGVuZCBubyBtYXR0ZXIgd2hlcmUgdGhleSBjbGlja1xuICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJtb3VzZWRvd25cIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LnRlbElucHV0LmlzKFwiOmZvY3VzXCIpICYmICF0aGF0LnRlbElucHV0LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBidXQgdGhpcyBhbHNvIGNhbmNlbHMgdGhlIGZvY3VzLCBzbyB3ZSBtdXN0IHRyaWdnZXIgdGhhdCBtYW51YWxseVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9uKFwiZm9jdXNcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGF0LnRlbElucHV0LnZhbCgpO1xuICAgICAgICAgICAgICAgIC8vIHNhdmUgdGhpcyB0byBjb21wYXJlIG9uIGJsdXJcbiAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LmRhdGEoXCJmb2N1c1ZhbFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gb24gZm9jdXM6IGlmIGVtcHR5LCBpbnNlcnQgdGhlIGRpYWwgY29kZSBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmbGFnXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlICYmICF2YWx1ZSAmJiAhdGhhdC50ZWxJbnB1dC5wcm9wKFwicmVhZG9ubHlcIikgJiYgdGhhdC5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3VwZGF0ZVZhbChcIitcIiArIHRoYXQuc2VsZWN0ZWRDb3VudHJ5RGF0YS5kaWFsQ29kZSwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIGF1dG8taW5zZXJ0aW5nIGEgZGlhbCBjb2RlLCBpZiB0aGUgZmlyc3Qga2V5IHRoZXkgaGl0IGlzICcrJyB0aGVuIGFzc3VtZSB0aGV5IGFyZSBlbnRlcmluZyBhIG5ldyBudW1iZXIsIHNvIHJlbW92ZSB0aGUgZGlhbCBjb2RlLiB1c2Uga2V5cHJlc3MgaW5zdGVhZCBvZiBrZXlkb3duIGJlY2F1c2Uga2V5ZG93biBnZXRzIHRyaWdnZXJlZCBmb3IgdGhlIHNoaWZ0IGtleSAocmVxdWlyZWQgdG8gaGl0IHRoZSArIGtleSksIGFuZCBpbnN0ZWFkIG9mIGtleXVwIGJlY2F1c2UgdGhhdCBzaG93cyB0aGUgbmV3ICcrJyBiZWZvcmUgcmVtb3ZpbmcgdGhlIG9sZCBvbmVcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5vbmUoXCJrZXlwcmVzcy5wbHVzXCIgKyB0aGF0Lm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlzLlBMVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhdXRvRm9ybWF0IGlzIGVuYWJsZWQsIHRoaXMga2V5IGV2ZW50IHdpbGwgaGF2ZSBhbHJlYWR5IGhhdmUgYmVlbiBoYW5kbGVkIGJ5IGFub3RoZXIga2V5cHJlc3MgbGlzdGVuZXIgKGhlbmNlIHdlIG5lZWQgdG8gYWRkIHRoZSBcIitcIikuIGlmIGRpc2FibGVkLCBpdCB3aWxsIGJlIGhhbmRsZWQgYWZ0ZXIgdGhpcyBieSBhIGtleXVwIGxpc3RlbmVyIChoZW5jZSBubyBuZWVkIHRvIGFkZCB0aGUgXCIrXCIpLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWwgPSB0aGF0Lm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgPyBcIitcIiA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC52YWwobmV3VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRhYmJpbmcgaW4sIG1ha2Ugc3VyZSB0aGUgY3Vyc29yIGlzIGF0IHRoZSBlbmQgd2UgbXVzdCB1c2Ugc2V0VGltZW91dCB0byBnZXQgb3V0c2lkZSBvZiB0aGUgZm9jdXMgaGFuZGxlciBhcyBpdCBzZWVtcyB0aGUgc2VsZWN0aW9uIGhhcHBlbnMgYWZ0ZXIgdGhhdFxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhhdC50ZWxJbnB1dFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmlzR29vZEJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gdGhhdC50ZWxJbnB1dC52YWwoKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UobGVuLCBsZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJibHVyXCIgKyB0aGlzLm5zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb24gYmx1cjogaWYganVzdCBhIGRpYWwgY29kZSB0aGVuIHJlbW92ZSBpdFxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGF0LnRlbElucHV0LnZhbCgpLCBzdGFydHNQbHVzID0gdmFsdWUuY2hhckF0KDApID09IFwiK1wiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRzUGx1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bWVyaWMgPSB0aGF0Ll9nZXROdW1lcmljKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGp1c3QgYSBwbHVzLCBvciBpZiBqdXN0IGEgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW51bWVyaWMgfHwgdGhhdC5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlID09IG51bWVyaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LnZhbChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIGtleXByZXNzIGxpc3RlbmVyIHdlIGFkZGVkIG9uIGZvY3VzXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQub2ZmKFwia2V5cHJlc3MucGx1c1wiICsgdGhhdC5ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQsIHdlIG11c3QgbWFudWFsbHkgdHJpZ2dlciBjaGFuZ2UgZXZlbnQgaWYgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzICYmIHRoYXQudGVsSW5wdXQudmFsKCkgIT0gdGhhdC50ZWxJbnB1dC5kYXRhKFwiZm9jdXNWYWxcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyBleHRyYWN0IHRoZSBudW1lcmljIGRpZ2l0cyBmcm9tIHRoZSBnaXZlbiBzdHJpbmdcbiAgICAgICAgX2dldE51bWVyaWM6IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgX2dldENsZWFuOiBmdW5jdGlvbihzKSB7XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gcy5jaGFyQXQoMCkgPT0gXCIrXCIgPyBcIitcIiA6IFwiXCI7XG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgdGhpcy5fZ2V0TnVtZXJpYyhzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2hvdyB0aGUgZHJvcGRvd25cbiAgICAgICAgX3Nob3dEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXREcm9wZG93blBvc2l0aW9uKCk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgaGlnaGxpZ2h0aW5nIGFuZCBzY3JvbGwgdG8gYWN0aXZlIGxpc3QgaXRlbVxuICAgICAgICAgICAgdmFyIGFjdGl2ZUxpc3RJdGVtID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIi5hY3RpdmVcIik7XG4gICAgICAgICAgICBpZiAoYWN0aXZlTGlzdEl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0TGlzdEl0ZW0oYWN0aXZlTGlzdEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2hvdyBpdFxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG4gICAgICAgICAgICBpZiAoYWN0aXZlTGlzdEl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG8oYWN0aXZlTGlzdEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYmluZCBhbGwgdGhlIGRyb3Bkb3duLXJlbGF0ZWQgbGlzdGVuZXJzOiBtb3VzZW92ZXIsIGNsaWNrLCBjbGljay1vZmYsIGtleWRvd25cbiAgICAgICAgICAgIHRoaXMuX2JpbmREcm9wZG93bkxpc3RlbmVycygpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBhcnJvd1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5jaGlsZHJlbihcIi5hcnJvd1wiKS5hZGRDbGFzcyhcInVwXCIpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBkZWNpZGUgd2hlcmUgdG8gcG9zaXRpb24gZHJvcGRvd24gKGRlcGVuZHMgb24gcG9zaXRpb24gd2l0aGluIHZpZXdwb3J0LCBhbmQgc2Nyb2xsKVxuICAgICAgICBfc2V0RHJvcGRvd25Qb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRUb3AgPSB0aGlzLnRlbElucHV0Lm9mZnNldCgpLnRvcCwgd2luZG93VG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLCAvLyBkcm9wZG93bkZpdHNCZWxvdyA9IChkcm9wZG93bkJvdHRvbSA8IHdpbmRvd0JvdHRvbSlcbiAgICAgICAgICAgIGRyb3Bkb3duRml0c0JlbG93ID0gaW5wdXRUb3AgKyB0aGlzLnRlbElucHV0Lm91dGVySGVpZ2h0KCkgKyB0aGlzLmRyb3Bkb3duSGVpZ2h0IDwgd2luZG93VG9wICsgJCh3aW5kb3cpLmhlaWdodCgpLCBkcm9wZG93bkZpdHNBYm92ZSA9IGlucHV0VG9wIC0gdGhpcy5kcm9wZG93bkhlaWdodCA+IHdpbmRvd1RvcDtcbiAgICAgICAgICAgIC8vIGRyb3Bkb3duSGVpZ2h0IC0gMSBmb3IgYm9yZGVyXG4gICAgICAgICAgICB2YXIgY3NzVG9wID0gIWRyb3Bkb3duRml0c0JlbG93ICYmIGRyb3Bkb3duRml0c0Fib3ZlID8gXCItXCIgKyAodGhpcy5kcm9wZG93bkhlaWdodCAtIDEpICsgXCJweFwiIDogXCJcIjtcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QuY3NzKFwidG9wXCIsIGNzc1RvcCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHdlIG9ubHkgYmluZCBkcm9wZG93biBsaXN0ZW5lcnMgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlblxuICAgICAgICBfYmluZERyb3Bkb3duTGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIC8vIHdoZW4gbW91c2Ugb3ZlciBhIGxpc3QgaXRlbSwganVzdCBoaWdobGlnaHQgdGhhdCBvbmVcbiAgICAgICAgICAgIC8vIHdlIGFkZCB0aGUgY2xhc3MgXCJoaWdobGlnaHRcIiwgc28gaWYgdGhleSBoaXQgXCJlbnRlclwiIHdlIGtub3cgd2hpY2ggb25lIHRvIHNlbGVjdFxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5vbihcIm1vdXNlb3ZlclwiICsgdGhpcy5ucywgXCIuY291bnRyeVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5faGlnaGxpZ2h0TGlzdEl0ZW0oJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGxpc3RlbiBmb3IgY291bnRyeSBzZWxlY3Rpb25cbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3Qub24oXCJjbGlja1wiICsgdGhpcy5ucywgXCIuY291bnRyeVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5fc2VsZWN0TGlzdEl0ZW0oJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNsaWNrIG9mZiB0byBjbG9zZVxuICAgICAgICAgICAgLy8gKGV4Y2VwdCB3aGVuIHRoaXMgaW5pdGlhbCBvcGVuaW5nIGNsaWNrIGlzIGJ1YmJsaW5nIHVwKVxuICAgICAgICAgICAgLy8gd2UgY2Fubm90IGp1c3Qgc3RvcFByb3BhZ2F0aW9uIGFzIGl0IG1heSBiZSBuZWVkZWQgdG8gY2xvc2UgYW5vdGhlciBpbnN0YW5jZVxuICAgICAgICAgICAgdmFyIGlzT3BlbmluZyA9IHRydWU7XG4gICAgICAgICAgICAkKFwiaHRtbFwiKS5vbihcImNsaWNrXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc09wZW5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY2xvc2VEcm9wZG93bigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpc09wZW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gbGlzdGVuIGZvciB1cC9kb3duIHNjcm9sbGluZywgZW50ZXIgdG8gc2VsZWN0LCBvciBsZXR0ZXJzIHRvIGp1bXAgdG8gY291bnRyeSBuYW1lLlxuICAgICAgICAgICAgLy8gdXNlIGtleWRvd24gYXMga2V5cHJlc3MgZG9lc24ndCBmaXJlIGZvciBub24tY2hhciBrZXlzIGFuZCB3ZSB3YW50IHRvIGNhdGNoIGlmIHRoZXlcbiAgICAgICAgICAgIC8vIGp1c3QgaGl0IGRvd24gYW5kIGhvbGQgaXQgdG8gc2Nyb2xsIGRvd24gKG5vIGtleXVwIGV2ZW50KS5cbiAgICAgICAgICAgIC8vIGxpc3RlbiBvbiB0aGUgZG9jdW1lbnQgYmVjYXVzZSB0aGF0J3Mgd2hlcmUga2V5IGV2ZW50cyBhcmUgdHJpZ2dlcmVkIGlmIG5vIGlucHV0IGhhcyBmb2N1c1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gXCJcIiwgcXVlcnlUaW1lciA9IG51bGw7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbihcImtleWRvd25cIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IGRvd24ga2V5IGZyb20gc2Nyb2xsaW5nIHRoZSB3aG9sZSBwYWdlLFxuICAgICAgICAgICAgICAgIC8vIGFuZCBlbnRlciBrZXkgZnJvbSBzdWJtaXR0aW5nIGEgZm9ybSBldGNcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5cy5VUCB8fCBlLndoaWNoID09IGtleXMuRE9XTikge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cCBhbmQgZG93biB0byBuYXZpZ2F0ZVxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVVcERvd25LZXkoZS53aGljaCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09IGtleXMuRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZW50ZXIgdG8gc2VsZWN0XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZUVudGVyS2V5KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09IGtleXMuRVNDKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVzYyB0byBjbG9zZVxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID49IGtleXMuQSAmJiBlLndoaWNoIDw9IGtleXMuWiB8fCBlLndoaWNoID09IGtleXMuU1BBQ0UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXIgY2FzZSBsZXR0ZXJzIChub3RlOiBrZXl1cC9rZXlkb3duIG9ubHkgcmV0dXJuIHVwcGVyIGNhc2UgbGV0dGVycylcbiAgICAgICAgICAgICAgICAgICAgLy8ganVtcCB0byBjb3VudHJpZXMgdGhhdCBzdGFydCB3aXRoIHRoZSBxdWVyeSBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXJ5VGltZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChxdWVyeVRpbWVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBxdWVyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9zZWFyY2hGb3JDb3VudHJ5KHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHRpbWVyIGhpdHMgMSBzZWNvbmQsIHJlc2V0IHRoZSBxdWVyeVxuICAgICAgICAgICAgICAgICAgICBxdWVyeVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfSwgMWUzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBuZXh0L3ByZXYgaXRlbSBpbiB0aGUgbGlzdCAoYW5kIGVuc3VyZSBpdCBpcyB2aXNpYmxlKVxuICAgICAgICBfaGFuZGxlVXBEb3duS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIi5oaWdobGlnaHRcIikuZmlyc3QoKTtcbiAgICAgICAgICAgIHZhciBuZXh0ID0ga2V5ID09IGtleXMuVVAgPyBjdXJyZW50LnByZXYoKSA6IGN1cnJlbnQubmV4dCgpO1xuICAgICAgICAgICAgaWYgKG5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCB0aGUgZGl2aWRlclxuICAgICAgICAgICAgICAgIGlmIChuZXh0Lmhhc0NsYXNzKFwiZGl2aWRlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0ID0ga2V5ID09IGtleXMuVVAgPyBuZXh0LnByZXYoKSA6IG5leHQubmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9oaWdobGlnaHRMaXN0SXRlbShuZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxUbyhuZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2VsZWN0IHRoZSBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgaXRlbVxuICAgICAgICBfaGFuZGxlRW50ZXJLZXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3VudHJ5ID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIi5oaWdobGlnaHRcIikuZmlyc3QoKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q291bnRyeS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RMaXN0SXRlbShjdXJyZW50Q291bnRyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IGxpc3QgaXRlbSB3aG9zZSBuYW1lIHN0YXJ0cyB3aXRoIHRoZSBxdWVyeSBzdHJpbmdcbiAgICAgICAgX3NlYXJjaEZvckNvdW50cnk6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXJ0c1dpdGgodGhpcy5jb3VudHJpZXNbaV0ubmFtZSwgcXVlcnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0SXRlbSA9IHRoaXMuY291bnRyeUxpc3QuY2hpbGRyZW4oXCJbZGF0YS1jb3VudHJ5LWNvZGU9XCIgKyB0aGlzLmNvdW50cmllc1tpXS5pc28yICsgXCJdXCIpLm5vdChcIi5wcmVmZXJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBoaWdobGlnaHRpbmcgYW5kIHNjcm9sbFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdobGlnaHRMaXN0SXRlbShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvKGxpc3RJdGVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBjaGVjayBpZiAodXBwZXJjYXNlKSBzdHJpbmcgYSBzdGFydHMgd2l0aCBzdHJpbmcgYlxuICAgICAgICBfc3RhcnRzV2l0aDogZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEuc3Vic3RyKDAsIGIubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09IGI7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgaW5wdXQncyB2YWx1ZSB0byB0aGUgZ2l2ZW4gdmFsXG4gICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQ9dHJ1ZSwgZm9ybWF0IGl0IGZpcnN0IGFjY29yZGluZyB0byB0aGUgY291bnRyeS1zcGVjaWZpYyBmb3JtYXR0aW5nIHJ1bGVzXG4gICAgICAgIC8vIE5vdGU6IHByZXZlbnRDb252ZXJzaW9uIHdpbGwgYmUgZmFsc2UgKGkuZS4gd2UgYWxsb3cgY29udmVyc2lvbikgb24gaW5pdCBhbmQgd2hlbiBkZXYgY2FsbHMgcHVibGljIG1ldGhvZCBzZXROdW1iZXJcbiAgICAgICAgX3VwZGF0ZVZhbDogZnVuY3Rpb24odmFsLCBmb3JtYXQsIGFkZFN1ZmZpeCwgcHJldmVudENvbnZlcnNpb24sIGlzQWxsb3dlZEtleSkge1xuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZDtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXQgPT0gXCJudW1iZXJcIiAmJiBpbnRsVGVsSW5wdXRVdGlscy5pc1ZhbGlkTnVtYmVyKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHVzZXIgc3BlY2lmaWVkIGEgZm9ybWF0LCBhbmQgaXQncyBhIHZhbGlkIG51bWJlciwgdGhlbiBmb3JtYXQgaXQgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkID0gaW50bFRlbElucHV0VXRpbHMuZm9ybWF0TnVtYmVyQnlUeXBlKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIGZvcm1hdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcHJldmVudENvbnZlcnNpb24gJiYgdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSAmJiB2YWwuY2hhckF0KDApID09IFwiK1wiICYmIGludGxUZWxJbnB1dFV0aWxzLmlzVmFsaWROdW1iZXIodmFsLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbmF0aW9uYWxNb2RlIGFuZCB3ZSBoYXZlIGEgdmFsaWQgaW50bCBudW1iZXIsIGNvbnZlcnQgaXQgdG8gbnRsXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IGludGxUZWxJbnB1dFV0aWxzLmZvcm1hdE51bWJlckJ5VHlwZSh2YWwsIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCBpbnRsVGVsSW5wdXRVdGlscy5udW1iZXJGb3JtYXQuTkFUSU9OQUwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgZG8gdGhlIHJlZ3VsYXIgQXNZb3VUeXBlIGZvcm1hdHRpbmdcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkID0gaW50bFRlbElucHV0VXRpbHMuZm9ybWF0TnVtYmVyKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIGFkZFN1ZmZpeCwgdGhpcy5vcHRpb25zLmFsbG93RXh0ZW5zaW9ucywgaXNBbGxvd2VkS2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZW5zdXJlIHdlIGRvbnQgZ28gb3ZlciBtYXhsZW5ndGguIHdlIG11c3QgZG8gdGhpcyBoZXJlIHRvIHRydW5jYXRlIGFueSBmb3JtYXR0aW5nIHN1ZmZpeCwgYW5kIGFsc28gaGFuZGxlIHBhc3RlIGV2ZW50c1xuICAgICAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLnRlbElucHV0LmF0dHIoXCJtYXhsZW5ndGhcIik7XG4gICAgICAgICAgICAgICAgaWYgKG1heCAmJiBmb3JtYXR0ZWQubGVuZ3RoID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5zdWJzdHIoMCwgbWF4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vIGF1dG9Gb3JtYXQsIHNvIGp1c3QgaW5zZXJ0IHRoZSBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQudmFsKGZvcm1hdHRlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNoZWNrIGlmIG5lZWQgdG8gc2VsZWN0IGEgbmV3IGZsYWcgYmFzZWQgb24gdGhlIGdpdmVuIG51bWJlclxuICAgICAgICBfdXBkYXRlRmxhZ0Zyb21OdW1iZXI6IGZ1bmN0aW9uKG51bWJlciwgdXBkYXRlRGVmYXVsdCkge1xuICAgICAgICAgICAgLy8gaWYgd2UncmUgaW4gbmF0aW9uYWxNb2RlIGFuZCB3ZSdyZSBvbiBVUy9DYW5hZGEsIG1ha2Ugc3VyZSB0aGUgbnVtYmVyIHN0YXJ0cyB3aXRoIGEgKzEgc28gX2dldERpYWxDb2RlIHdpbGwgYmUgYWJsZSB0byBleHRyYWN0IHRoZSBhcmVhIGNvZGVcbiAgICAgICAgICAgIC8vIHVwZGF0ZTogaWYgd2UgZG9udCB5ZXQgaGF2ZSBzZWxlY3RlZENvdW50cnlEYXRhLCBidXQgd2UncmUgaGVyZSAodHJ5aW5nIHRvIHVwZGF0ZSB0aGUgZmxhZyBmcm9tIHRoZSBudW1iZXIpLCB0aGF0IG1lYW5zIHdlJ3JlIGluaXRpYWxpc2luZyB0aGUgcGx1Z2luIHdpdGggYSBudW1iZXIgdGhhdCBhbHJlYWR5IGhhcyBhIGRpYWwgY29kZSwgc28gZmluZSB0byBpZ25vcmUgdGhpcyBiaXRcbiAgICAgICAgICAgIGlmIChudW1iZXIgJiYgdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlID09IFwiMVwiICYmIG51bWJlci5jaGFyQXQoMCkgIT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyLmNoYXJBdCgwKSAhPSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICBudW1iZXIgPSBcIjFcIiArIG51bWJlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbnVtYmVyID0gXCIrXCIgKyBudW1iZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0cnkgYW5kIGV4dHJhY3QgdmFsaWQgZGlhbCBjb2RlIGZyb20gaW5wdXRcbiAgICAgICAgICAgIHZhciBkaWFsQ29kZSA9IHRoaXMuX2dldERpYWxDb2RlKG51bWJlciksIGNvdW50cnlDb2RlID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChkaWFsQ29kZSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIG9uZSBvZiB0aGUgbWF0Y2hpbmcgY291bnRyaWVzIGlzIGFscmVhZHkgc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICB2YXIgY291bnRyeUNvZGVzID0gdGhpcy5jb3VudHJ5Q29kZXNbdGhpcy5fZ2V0TnVtZXJpYyhkaWFsQ29kZSldLCBhbHJlYWR5U2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgJiYgJC5pbkFycmF5KHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCBjb3VudHJ5Q29kZXMpICE9IC0xO1xuICAgICAgICAgICAgICAgIC8vIGlmIGEgbWF0Y2hpbmcgY291bnRyeSBpcyBub3QgYWxyZWFkeSBzZWxlY3RlZCAob3IgdGhpcyBpcyBhbiB1bmtub3duIE5BTlAgYXJlYSBjb2RlKTogY2hvb3NlIHRoZSBmaXJzdCBpbiB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGlmICghYWxyZWFkeVNlbGVjdGVkIHx8IHRoaXMuX2lzVW5rbm93bk5hbnAobnVtYmVyLCBkaWFsQ29kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdXNpbmcgb25seUNvdW50cmllcyBvcHRpb24sIGNvdW50cnlDb2Rlc1swXSBtYXkgYmUgZW1wdHksIHNvIHdlIG11c3QgZmluZCB0aGUgZmlyc3Qgbm9uLWVtcHR5IGluZGV4XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY291bnRyeUNvZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRyeUNvZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRyeUNvZGUgPSBjb3VudHJ5Q29kZXNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlci5jaGFyQXQoMCkgPT0gXCIrXCIgJiYgdGhpcy5fZ2V0TnVtZXJpYyhudW1iZXIpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIGludmFsaWQgZGlhbCBjb2RlLCBzbyBlbXB0eVxuICAgICAgICAgICAgICAgIC8vIE5vdGU6IHVzZSBnZXROdW1lcmljIGhlcmUgYmVjYXVzZSB0aGUgbnVtYmVyIGhhcyBub3QgYmVlbiBmb3JtYXR0ZWQgeWV0LCBzbyBjb3VsZCBjb250YWluIGJhZCBzaGl0XG4gICAgICAgICAgICAgICAgY291bnRyeUNvZGUgPSBcIlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghbnVtYmVyIHx8IG51bWJlciA9PSBcIitcIikge1xuICAgICAgICAgICAgICAgIC8vIGVtcHR5LCBvciBqdXN0IGEgcGx1cywgc28gZGVmYXVsdFxuICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlID0gdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5LmlzbzI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY291bnRyeUNvZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RGbGFnKGNvdW50cnlDb2RlLCB1cGRhdGVEZWZhdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGdpdmVuIG51bWJlciBjb250YWlucyBhbiB1bmtub3duIGFyZWEgY29kZSBmcm9tIHRoZSBOb3J0aCBBbWVyaWNhbiBOdW1iZXJpbmcgUGxhbiBpLmUuIHRoZSBvbmx5IGRpYWxDb2RlIHRoYXQgY291bGQgYmUgZXh0cmFjdGVkIHdhcyArMSBidXQgdGhlIGFjdHVhbCBudW1iZXIncyBsZW5ndGggaXMgPj00XG4gICAgICAgIF9pc1Vua25vd25OYW5wOiBmdW5jdGlvbihudW1iZXIsIGRpYWxDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGlhbENvZGUgPT0gXCIrMVwiICYmIHRoaXMuX2dldE51bWVyaWMobnVtYmVyKS5sZW5ndGggPj0gNDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcmVtb3ZlIGhpZ2hsaWdodGluZyBmcm9tIG90aGVyIGxpc3QgaXRlbXMgYW5kIGhpZ2hsaWdodCB0aGUgZ2l2ZW4gaXRlbVxuICAgICAgICBfaGlnaGxpZ2h0TGlzdEl0ZW06IGZ1bmN0aW9uKGxpc3RJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0SXRlbXMucmVtb3ZlQ2xhc3MoXCJoaWdobGlnaHRcIik7XG4gICAgICAgICAgICBsaXN0SXRlbS5hZGRDbGFzcyhcImhpZ2hsaWdodFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZmluZCB0aGUgY291bnRyeSBkYXRhIGZvciB0aGUgZ2l2ZW4gY291bnRyeSBjb2RlXG4gICAgICAgIC8vIHRoZSBpZ25vcmVPbmx5Q291bnRyaWVzT3B0aW9uIGlzIG9ubHkgdXNlZCBkdXJpbmcgaW5pdCgpIHdoaWxlIHBhcnNpbmcgdGhlIG9ubHlDb3VudHJpZXMgYXJyYXlcbiAgICAgICAgX2dldENvdW50cnlEYXRhOiBmdW5jdGlvbihjb3VudHJ5Q29kZSwgaWdub3JlT25seUNvdW50cmllc09wdGlvbiwgYWxsb3dGYWlsKSB7XG4gICAgICAgICAgICB2YXIgY291bnRyeUxpc3QgPSBpZ25vcmVPbmx5Q291bnRyaWVzT3B0aW9uID8gYWxsQ291bnRyaWVzIDogdGhpcy5jb3VudHJpZXM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50cnlMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50cnlMaXN0W2ldLmlzbzIgPT0gY291bnRyeUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50cnlMaXN0W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbGxvd0ZhaWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gY291bnRyeSBkYXRhIGZvciAnXCIgKyBjb3VudHJ5Q29kZSArIFwiJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2VsZWN0IHRoZSBnaXZlbiBmbGFnLCB1cGRhdGUgdGhlIHBsYWNlaG9sZGVyIGFuZCB0aGUgYWN0aXZlIGxpc3QgaXRlbVxuICAgICAgICBfc2VsZWN0RmxhZzogZnVuY3Rpb24oY291bnRyeUNvZGUsIHVwZGF0ZURlZmF1bHQpIHtcbiAgICAgICAgICAgIC8vIGRvIHRoaXMgZmlyc3QgYXMgaXQgd2lsbCB0aHJvdyBhbiBlcnJvciBhbmQgc3RvcCBpZiBjb3VudHJ5Q29kZSBpcyBpbnZhbGlkXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgPSBjb3VudHJ5Q29kZSA/IHRoaXMuX2dldENvdW50cnlEYXRhKGNvdW50cnlDb2RlLCBmYWxzZSwgZmFsc2UpIDoge307XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIFwiZGVmYXVsdENvdW50cnlcIiAtIHdlIG9ubHkgbmVlZCB0aGUgaXNvMiBmcm9tIG5vdyBvbiwgc28ganVzdCBzdG9yZSB0aGF0XG4gICAgICAgICAgICBpZiAodXBkYXRlRGVmYXVsdCAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMikge1xuICAgICAgICAgICAgICAgIC8vIGNhbid0IGp1c3QgbWFrZSB0aGlzIGVxdWFsIHRvIHNlbGVjdGVkQ291bnRyeURhdGEgYXMgd291bGQgYmUgYSByZWYgdG8gdGhhdCBvYmplY3RcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzbzI6IHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIuYXR0cihcImNsYXNzXCIsIFwiaXRpLWZsYWcgXCIgKyBjb3VudHJ5Q29kZSk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHNlbGVjdGVkIGNvdW50cnkncyB0aXRsZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IGNvdW50cnlDb2RlID8gdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLm5hbWUgKyBcIjogK1wiICsgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlIDogXCJVbmtub3duXCI7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLnBhcmVudCgpLmF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgICAgICAgICAvLyBhbmQgdGhlIGlucHV0J3MgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QudmFsKGNvdW50cnlDb2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBhY3RpdmUgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdEl0ZW1zLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjb3VudHJ5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0SXRlbXMuZmluZChcIi5pdGktZmxhZy5cIiArIGNvdW50cnlDb2RlKS5maXJzdCgpLmNsb3Nlc3QoXCIuY291bnRyeVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgaW5wdXQgcGxhY2Vob2xkZXIgdG8gYW4gZXhhbXBsZSBudW1iZXIgZnJvbSB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvdW50cnlcbiAgICAgICAgX3VwZGF0ZVBsYWNlaG9sZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgJiYgIXRoaXMuaGFkSW5pdGlhbFBsYWNlaG9sZGVyICYmIHRoaXMub3B0aW9ucy5hdXRvUGxhY2Vob2xkZXIgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzbzIgPSB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgbnVtYmVyVHlwZSA9IGludGxUZWxJbnB1dFV0aWxzLm51bWJlclR5cGVbdGhpcy5vcHRpb25zLm51bWJlclR5cGUgfHwgXCJGSVhFRF9MSU5FXCJdLCBwbGFjZWhvbGRlciA9IGlzbzIgPyBpbnRsVGVsSW5wdXRVdGlscy5nZXRFeGFtcGxlTnVtYmVyKGlzbzIsIHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUsIG51bWJlclR5cGUpIDogXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0LmF0dHIoXCJwbGFjZWhvbGRlclwiLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBsaXN0IGl0ZW0gZnJvbSB0aGUgZHJvcGRvd25cbiAgICAgICAgX3NlbGVjdExpc3RJdGVtOiBmdW5jdGlvbihsaXN0SXRlbSkge1xuICAgICAgICAgICAgdmFyIGNvdW50cnlDb2RlQXR0ciA9IHRoaXMuaXNNb2JpbGUgPyBcInZhbHVlXCIgOiBcImRhdGEtY291bnRyeS1jb2RlXCI7XG4gICAgICAgICAgICAvLyB1cGRhdGUgc2VsZWN0ZWQgZmxhZyBhbmQgYWN0aXZlIGxpc3QgaXRlbVxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0RmxhZyhsaXN0SXRlbS5hdHRyKGNvdW50cnlDb2RlQXR0ciksIHRydWUpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VEcm9wZG93bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlhbENvZGUobGlzdEl0ZW0uYXR0cihcImRhdGEtZGlhbC1jb2RlXCIpLCB0cnVlKTtcbiAgICAgICAgICAgIC8vIGFsd2F5cyBmaXJlIHRoZSBjaGFuZ2UgZXZlbnQgYXMgZXZlbiBpZiBuYXRpb25hbE1vZGU9dHJ1ZSAoYW5kIHdlIGhhdmVuJ3QgdXBkYXRlZCB0aGUgaW5wdXQgdmFsKSwgdGhlIHN5c3RlbSBhcyBhIHdob2xlIGhhcyBzdGlsbCBjaGFuZ2VkIC0gc2VlIGNvdW50cnktc3luYyBleGFtcGxlLiB0aGluayBvZiBpdCBhcyBtYWtpbmcgYSBzZWxlY3Rpb24gZnJvbSBhIHNlbGVjdCBlbGVtZW50LlxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgLy8gZm9jdXMgdGhlIGlucHV0XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAvLyBmaXggZm9yIEZGIGFuZCBJRTExICh3aXRoIG5hdGlvbmFsTW9kZT1mYWxzZSBpLmUuIGF1dG8gaW5zZXJ0aW5nIGRpYWwgY29kZSksIHdobyB0cnkgdG8gcHV0IHRoZSBjdXJzb3IgYXQgdGhlIGJlZ2lubmluZyB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIHZhciBsZW4gPSB0aGlzLnRlbElucHV0LnZhbCgpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0WzBdLnNldFNlbGVjdGlvblJhbmdlKGxlbiwgbGVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2xvc2UgdGhlIGRyb3Bkb3duIGFuZCB1bmJpbmQgYW55IGxpc3RlbmVyc1xuICAgICAgICBfY2xvc2VEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0LmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIuY2hpbGRyZW4oXCIuYXJyb3dcIikucmVtb3ZlQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgICAgIC8vIHVuYmluZCBrZXkgZXZlbnRzXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICAvLyB1bmJpbmQgY2xpY2stb2ZmLXRvLWNsb3NlXG4gICAgICAgICAgICAkKFwiaHRtbFwiKS5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICAvLyB1bmJpbmQgaG92ZXIgYW5kIGNsaWNrIGxpc3RlbmVyc1xuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5vZmYodGhpcy5ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNoZWNrIGlmIGFuIGVsZW1lbnQgaXMgdmlzaWJsZSB3aXRoaW4gaXQncyBjb250YWluZXIsIGVsc2Ugc2Nyb2xsIHVudGlsIGl0IGlzXG4gICAgICAgIF9zY3JvbGxUbzogZnVuY3Rpb24oZWxlbWVudCwgbWlkZGxlKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb3VudHJ5TGlzdCwgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCgpLCBjb250YWluZXJUb3AgPSBjb250YWluZXIub2Zmc2V0KCkudG9wLCBjb250YWluZXJCb3R0b20gPSBjb250YWluZXJUb3AgKyBjb250YWluZXJIZWlnaHQsIGVsZW1lbnRIZWlnaHQgPSBlbGVtZW50Lm91dGVySGVpZ2h0KCksIGVsZW1lbnRUb3AgPSBlbGVtZW50Lm9mZnNldCgpLnRvcCwgZWxlbWVudEJvdHRvbSA9IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0LCBuZXdTY3JvbGxUb3AgPSBlbGVtZW50VG9wIC0gY29udGFpbmVyVG9wICsgY29udGFpbmVyLnNjcm9sbFRvcCgpLCBtaWRkbGVPZmZzZXQgPSBjb250YWluZXJIZWlnaHQgLyAyIC0gZWxlbWVudEhlaWdodCAvIDI7XG4gICAgICAgICAgICBpZiAoZWxlbWVudFRvcCA8IGNvbnRhaW5lclRvcCkge1xuICAgICAgICAgICAgICAgIC8vIHNjcm9sbCB1cFxuICAgICAgICAgICAgICAgIGlmIChtaWRkbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U2Nyb2xsVG9wIC09IG1pZGRsZU9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvcChuZXdTY3JvbGxUb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Qm90dG9tID4gY29udGFpbmVyQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgLy8gc2Nyb2xsIGRvd25cbiAgICAgICAgICAgICAgICBpZiAobWlkZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1Njcm9sbFRvcCArPSBtaWRkbGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHREaWZmZXJlbmNlID0gY29udGFpbmVySGVpZ2h0IC0gZWxlbWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wKG5ld1Njcm9sbFRvcCAtIGhlaWdodERpZmZlcmVuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyByZXBsYWNlIGFueSBleGlzdGluZyBkaWFsIGNvZGUgd2l0aCB0aGUgbmV3IG9uZSAoaWYgbm90IGluIG5hdGlvbmFsTW9kZSlcbiAgICAgICAgLy8gYWxzbyB3ZSBuZWVkIHRvIGtub3cgaWYgd2UncmUgZm9jdXNpbmcgZm9yIGEgY291cGxlIG9mIHJlYXNvbnMgZS5nLiBpZiBzbywgd2Ugd2FudCB0byBhZGQgYW55IGZvcm1hdHRpbmcgc3VmZml4LCBhbHNvIGlmIHRoZSBpbnB1dCBpcyBlbXB0eSBhbmQgd2UncmUgbm90IGluIG5hdGlvbmFsTW9kZSwgdGhlbiB3ZSB3YW50IHRvIGluc2VydCB0aGUgZGlhbCBjb2RlXG4gICAgICAgIF91cGRhdGVEaWFsQ29kZTogZnVuY3Rpb24obmV3RGlhbENvZGUsIGZvY3VzaW5nKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRWYWwgPSB0aGlzLnRlbElucHV0LnZhbCgpLCBuZXdOdW1iZXI7XG4gICAgICAgICAgICAvLyBzYXZlIGhhdmluZyB0byBwYXNzIHRoaXMgZXZlcnkgdGltZVxuICAgICAgICAgICAgbmV3RGlhbENvZGUgPSBcIitcIiArIG5ld0RpYWxDb2RlO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUgJiYgaW5wdXRWYWwuY2hhckF0KDApICE9IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgbmF0aW9uYWxNb2RlLCB3ZSBqdXN0IHdhbnQgdG8gcmUtZm9ybWF0XG4gICAgICAgICAgICAgICAgbmV3TnVtYmVyID0gaW5wdXRWYWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0VmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZXZpb3VzIG51bWJlciBjb250YWluZWQgYSB2YWxpZCBkaWFsIGNvZGUsIHJlcGxhY2UgaXRcbiAgICAgICAgICAgICAgICAvLyAoaWYgbW9yZSB0aGFuIGp1c3QgYSBwbHVzIGNoYXJhY3RlcilcbiAgICAgICAgICAgICAgICB2YXIgcHJldkRpYWxDb2RlID0gdGhpcy5fZ2V0RGlhbENvZGUoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2RGlhbENvZGUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdOdW1iZXIgPSBpbnB1dFZhbC5yZXBsYWNlKHByZXZEaWFsQ29kZSwgbmV3RGlhbENvZGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcmV2aW91cyBudW1iZXIgZGlkbid0IGNvbnRhaW4gYSBkaWFsIGNvZGUsIHdlIHNob3VsZCBwZXJzaXN0IGl0XG4gICAgICAgICAgICAgICAgICAgIHZhciBleGlzdGluZ051bWJlciA9IGlucHV0VmFsLmNoYXJBdCgwKSAhPSBcIitcIiA/ICQudHJpbShpbnB1dFZhbCkgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBuZXdOdW1iZXIgPSBuZXdEaWFsQ29kZSArIGV4aXN0aW5nTnVtYmVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3TnVtYmVyID0gIXRoaXMub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlIHx8IGZvY3VzaW5nID8gbmV3RGlhbENvZGUgOiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsKG5ld051bWJlciwgbnVsbCwgZm9jdXNpbmcpO1xuICAgICAgICB9LFxuICAgICAgICAvLyB0cnkgYW5kIGV4dHJhY3QgYSB2YWxpZCBpbnRlcm5hdGlvbmFsIGRpYWwgY29kZSBmcm9tIGEgZnVsbCB0ZWxlcGhvbmUgbnVtYmVyXG4gICAgICAgIC8vIE5vdGU6IHJldHVybnMgdGhlIHJhdyBzdHJpbmcgaW5jIHBsdXMgY2hhcmFjdGVyIGFuZCBhbnkgd2hpdGVzcGFjZS9kb3RzIGV0Y1xuICAgICAgICBfZ2V0RGlhbENvZGU6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGRpYWxDb2RlID0gXCJcIjtcbiAgICAgICAgICAgIC8vIG9ubHkgaW50ZXJlc3RlZCBpbiBpbnRlcm5hdGlvbmFsIG51bWJlcnMgKHN0YXJ0aW5nIHdpdGggYSBwbHVzKVxuICAgICAgICAgICAgaWYgKG51bWJlci5jaGFyQXQoMCkgPT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbnVtZXJpY0NoYXJzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgY2hhcnNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IG51bWJlci5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGNoYXIgaXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyhjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpY0NoYXJzICs9IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBjdXJyZW50IG51bWVyaWNDaGFycyBtYWtlIGEgdmFsaWQgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb3VudHJ5Q29kZXNbbnVtZXJpY0NoYXJzXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBhY3R1YWwgcmF3IHN0cmluZyAodXNlZnVsIGZvciBtYXRjaGluZyBsYXRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsQ29kZSA9IG51bWJlci5zdWJzdHIoMCwgaSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9uZ2VzdCBkaWFsIGNvZGUgaXMgNCBjaGFyc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bWVyaWNDaGFycy5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRpYWxDb2RlO1xuICAgICAgICB9LFxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICogIFBVQkxJQyBNRVRIT0RTXG4gICAqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgLy8gdGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgaXBpbmZvIGNhbGwgcmV0dXJuc1xuICAgICAgICBhdXRvQ291bnRyeUxvYWRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID09IFwiYXV0b1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID0gJC5mbltwbHVnaW5OYW1lXS5hdXRvQ291bnRyeTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRJbml0aWFsU3RhdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9Db3VudHJ5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyByZW1vdmUgcGx1Z2luXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBkcm9wZG93biBpcyBjbG9zZWQgKGFuZCB1bmJpbmQgbGlzdGVuZXJzKVxuICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGtleSBldmVudHMsIGFuZCBmb2N1cy9ibHVyIGV2ZW50cyBpZiBhdXRvSGlkZURpYWxDb2RlPXRydWVcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgZXZlbnQgb24gc2VsZWN0IGNvdW50cnlcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0Lm9mZih0aGlzLm5zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xpY2sgZXZlbnQgdG8gb3BlbiBkcm9wZG93blxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIucGFyZW50KCkub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgICAgIC8vIGxhYmVsIGNsaWNrIGhhY2tcbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0LmNsb3Nlc3QoXCJsYWJlbFwiKS5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZW1vdmUgbWFya3VwXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy50ZWxJbnB1dC5wYXJlbnQoKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5iZWZvcmUodGhpcy50ZWxJbnB1dCkucmVtb3ZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGV4dHJhY3QgdGhlIHBob25lIG51bWJlciBleHRlbnNpb24gaWYgcHJlc2VudFxuICAgICAgICBnZXRFeHRlbnNpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGVsSW5wdXQudmFsKCkuc3BsaXQoXCIgZXh0LiBcIilbMV0gfHwgXCJcIjtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZm9ybWF0IHRoZSBudW1iZXIgdG8gdGhlIGdpdmVuIHR5cGVcbiAgICAgICAgZ2V0TnVtYmVyOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmludGxUZWxJbnB1dFV0aWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGxUZWxJbnB1dFV0aWxzLmZvcm1hdE51bWJlckJ5VHlwZSh0aGlzLnRlbElucHV0LnZhbCgpLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgdHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0IHRoZSB0eXBlIG9mIHRoZSBlbnRlcmVkIG51bWJlciBlLmcuIGxhbmRsaW5lL21vYmlsZVxuICAgICAgICBnZXROdW1iZXJUeXBlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50bFRlbElucHV0VXRpbHMuZ2V0TnVtYmVyVHlwZSh0aGlzLnRlbElucHV0LnZhbCgpLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTk5O1xuICAgICAgICB9LFxuICAgICAgICAvLyBnZXQgdGhlIGNvdW50cnkgZGF0YSBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmbGFnXG4gICAgICAgIGdldFNlbGVjdGVkQ291bnRyeURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyB1bmRlZmluZWQsIHRoZSBwbHVnaW4gd2lsbCByZXR1cm4gaXQncyBpbnN0YW5jZSBpbnN0ZWFkLCBzbyBpbiB0aGF0IGNhc2UgYW4gZW1wdHkgb2JqZWN0IG1ha2VzIG1vcmUgc2Vuc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgfHwge307XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdldCB0aGUgdmFsaWRhdGlvbiBlcnJvclxuICAgICAgICBnZXRWYWxpZGF0aW9uRXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnRsVGVsSW5wdXRVdGlscy5nZXRWYWxpZGF0aW9uRXJyb3IodGhpcy50ZWxJbnB1dC52YWwoKSwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC05OTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdmFsaWRhdGUgdGhlIGlucHV0IHZhbCAtIGFzc3VtZXMgdGhlIGdsb2JhbCBmdW5jdGlvbiBpc1ZhbGlkTnVtYmVyIChmcm9tIHV0aWxzU2NyaXB0KVxuICAgICAgICBpc1ZhbGlkTnVtYmVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSAkLnRyaW0odGhpcy50ZWxJbnB1dC52YWwoKSksIGNvdW50cnlDb2RlID0gdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSA/IHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yIDogXCJcIjtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50bFRlbElucHV0VXRpbHMuaXNWYWxpZE51bWJlcih2YWwsIGNvdW50cnlDb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gbG9hZCB0aGUgdXRpbHMgc2NyaXB0XG4gICAgICAgIGxvYWRVdGlsczogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHV0aWxzU2NyaXB0ID0gcGF0aCB8fCB0aGlzLm9wdGlvbnMudXRpbHNTY3JpcHQ7XG4gICAgICAgICAgICBpZiAoISQuZm5bcGx1Z2luTmFtZV0ubG9hZGVkVXRpbHNTY3JpcHQgJiYgdXRpbHNTY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBkbyB0aGlzIHR3aWNlISAoZG9udCBqdXN0IGNoZWNrIGlmIHRoZSBnbG9iYWwgaW50bFRlbElucHV0VXRpbHMgZXhpc3RzIGFzIGlmIGluaXQgcGx1Z2luIG11bHRpcGxlIHRpbWVzIGluIHF1aWNrIHN1Y2Nlc3Npb24sIGl0IG1heSBub3QgaGF2ZSBmaW5pc2hlZCBsb2FkaW5nIHlldClcbiAgICAgICAgICAgICAgICAkLmZuW3BsdWdpbk5hbWVdLmxvYWRlZFV0aWxzU2NyaXB0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBkb250IHVzZSAkLmdldFNjcmlwdCBhcyBpdCBwcmV2ZW50cyBjYWNoaW5nXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1dGlsc1NjcmlwdCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZWxsIGFsbCBpbnN0YW5jZXMgdGhlIHV0aWxzIGFyZSByZWFkeVxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5pbnRsLXRlbC1pbnB1dCBpbnB1dFwiKS5pbnRsVGVsSW5wdXQoXCJ1dGlsc0xvYWRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51dGlsc1NjcmlwdERlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXRpbHNTY3JpcHREZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgZmxhZywgYW5kIHVwZGF0ZSB0aGUgaW5wdXQgdmFsIGFjY29yZGluZ2x5XG4gICAgICAgIHNlbGVjdENvdW50cnk6IGZ1bmN0aW9uKGNvdW50cnlDb2RlKSB7XG4gICAgICAgICAgICBjb3VudHJ5Q29kZSA9IGNvdW50cnlDb2RlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIuaGFzQ2xhc3MoY291bnRyeUNvZGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0RmxhZyhjb3VudHJ5Q29kZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlhbENvZGUodGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNldCB0aGUgaW5wdXQgdmFsdWUgYW5kIHVwZGF0ZSB0aGUgZmxhZ1xuICAgICAgICBzZXROdW1iZXI6IGZ1bmN0aW9uKG51bWJlciwgZm9ybWF0LCBhZGRTdWZmaXgsIHByZXZlbnRDb252ZXJzaW9uLCBpc0FsbG93ZWRLZXkpIHtcbiAgICAgICAgICAgIC8vIGVuc3VyZSBzdGFydHMgd2l0aCBwbHVzXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUgJiYgbnVtYmVyLmNoYXJBdCgwKSAhPSBcIitcIikge1xuICAgICAgICAgICAgICAgIG51bWJlciA9IFwiK1wiICsgbnVtYmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2UgbXVzdCB1cGRhdGUgdGhlIGZsYWcgZmlyc3QsIHdoaWNoIHVwZGF0ZXMgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLCB3aGljaCBpcyB1c2VkIGxhdGVyIGZvciBmb3JtYXR0aW5nIHRoZSBudW1iZXIgYmVmb3JlIGRpc3BsYXlpbmcgaXRcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUZsYWdGcm9tTnVtYmVyKG51bWJlcik7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVWYWwobnVtYmVyLCBmb3JtYXQsIGFkZFN1ZmZpeCwgcHJldmVudENvbnZlcnNpb24sIGlzQWxsb3dlZEtleSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIHV0aWxzIGFyZSByZWFkeVxuICAgICAgICB1dGlsc0xvYWRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiBhdXRvRm9ybWF0IGlzIGVuYWJsZWQgYW5kIHRoZXJlJ3MgYW4gaW5pdGlhbCB2YWx1ZSBpbiB0aGUgaW5wdXQsIHRoZW4gZm9ybWF0IGl0XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgdGhpcy50ZWxJbnB1dC52YWwoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbCh0aGlzLnRlbElucHV0LnZhbCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIGFkYXB0ZWQgdG8gYWxsb3cgcHVibGljIGZ1bmN0aW9uc1xuICAgIC8vIHVzaW5nIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktYm9pbGVycGxhdGUvanF1ZXJ5LWJvaWxlcnBsYXRlL3dpa2kvRXh0ZW5kaW5nLWpRdWVyeS1Cb2lsZXJwbGF0ZVxuICAgICQuZm5bcGx1Z2luTmFtZV0gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAvLyBJcyB0aGUgZmlyc3QgcGFyYW1ldGVyIGFuIG9iamVjdCAob3B0aW9ucyksIG9yIHdhcyBvbWl0dGVkLFxuICAgICAgICAvLyBpbnN0YW50aWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgcGx1Z2luLlxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBvcHRpb25zID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWRzID0gW107XG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgUGx1Z2luKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2VEZWZlcnJlZHMgPSBpbnN0YW5jZS5faW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBub3cgaGF2ZSAyIGRlZmZlcmVkczogMSBmb3IgYXV0byBjb3VudHJ5LCAxIGZvciB1dGlscyBzY3JpcHRcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWRzLnB1c2goaW5zdGFuY2VEZWZlcnJlZHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZHMucHVzaChpbnN0YW5jZURlZmVycmVkc1sxXSk7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUsIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgcHJvbWlzZSBmcm9tIHRoZSBcIm1hc3RlclwiIGRlZmVycmVkIG9iamVjdCB0aGF0IHRyYWNrcyBhbGwgdGhlIG90aGVyc1xuICAgICAgICAgICAgcmV0dXJuICQud2hlbi5hcHBseShudWxsLCBkZWZlcnJlZHMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiICYmIG9wdGlvbnNbMF0gIT09IFwiX1wiKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZmlyc3QgcGFyYW1ldGVyIGlzIGEgc3RyaW5nIGFuZCBpdCBkb2Vzbid0IHN0YXJ0XG4gICAgICAgICAgICAvLyB3aXRoIGFuIHVuZGVyc2NvcmUgb3IgXCJjb250YWluc1wiIHRoZSBgaW5pdGAtZnVuY3Rpb24sXG4gICAgICAgICAgICAvLyB0cmVhdCB0aGlzIGFzIGEgY2FsbCB0byBhIHB1YmxpYyBtZXRob2QuXG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbWV0aG9kIGNhbGwgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byByZXR1cm4gYSB2YWx1ZVxuICAgICAgICAgICAgdmFyIHJldHVybnM7XG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gJC5kYXRhKHRoaXMsIFwicGx1Z2luX1wiICsgcGx1Z2luTmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gVGVzdHMgdGhhdCB0aGVyZSdzIGFscmVhZHkgYSBwbHVnaW4taW5zdGFuY2VcbiAgICAgICAgICAgICAgICAvLyBhbmQgY2hlY2tzIHRoYXQgdGhlIHJlcXVlc3RlZCBwdWJsaWMgbWV0aG9kIGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFBsdWdpbiAmJiB0eXBlb2YgaW5zdGFuY2Vbb3B0aW9uc10gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBtZXRob2Qgb2Ygb3VyIHBsdWdpbiBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHBhc3MgaXQgdGhlIHN1cHBsaWVkIGFyZ3VtZW50cy5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJucyA9IGluc3RhbmNlW29wdGlvbnNdLmFwcGx5KGluc3RhbmNlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEFsbG93IGluc3RhbmNlcyB0byBiZSBkZXN0cm95ZWQgdmlhIHRoZSAnZGVzdHJveScgbWV0aG9kXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09IFwiZGVzdHJveVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gSWYgdGhlIGVhcmxpZXIgY2FjaGVkIG1ldGhvZCBnaXZlcyBhIHZhbHVlIGJhY2sgcmV0dXJuIHRoZSB2YWx1ZSxcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSByZXR1cm4gdGhpcyB0byBwcmVzZXJ2ZSBjaGFpbmFiaWxpdHkuXG4gICAgICAgICAgICByZXR1cm4gcmV0dXJucyAhPT0gdW5kZWZpbmVkID8gcmV0dXJucyA6IHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKioqKioqKioqKioqKioqKioqKlxuICogIFNUQVRJQyBNRVRIT0RTXG4gKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8gZ2V0IHRoZSBjb3VudHJ5IGRhdGEgb2JqZWN0XG4gICAgJC5mbltwbHVnaW5OYW1lXS5nZXRDb3VudHJ5RGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYWxsQ291bnRyaWVzO1xuICAgIH07XG4gICAgLy8gVGVsbCBKU0hpbnQgdG8gaWdub3JlIHRoaXMgd2FybmluZzogXCJjaGFyYWN0ZXIgbWF5IGdldCBzaWxlbnRseSBkZWxldGVkIGJ5IG9uZSBvciBtb3JlIGJyb3dzZXJzXCJcbiAgICAvLyBqc2hpbnQgLVcxMDBcbiAgICAvLyBBcnJheSBvZiBjb3VudHJ5IG9iamVjdHMgZm9yIHRoZSBmbGFnIGRyb3Bkb3duLlxuICAgIC8vIEVhY2ggY29udGFpbnMgYSBuYW1lLCBjb3VudHJ5IGNvZGUgKElTTyAzMTY2LTEgYWxwaGEtMikgYW5kIGRpYWwgY29kZS5cbiAgICAvLyBPcmlnaW5hbGx5IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21sZWRvemUvY291bnRyaWVzXG4gICAgLy8gdGhlbiBtb2RpZmllZCB1c2luZyB0aGUgZm9sbG93aW5nIEphdmFTY3JpcHQgKE5PVyBPVVQgT0YgREFURSk6XG4gICAgLypcbnZhciByZXN1bHQgPSBbXTtcbl8uZWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGMpIHtcbiAgLy8gaWdub3JlIGNvdW50cmllcyB3aXRob3V0IGEgZGlhbCBjb2RlXG4gIGlmIChjLmNhbGxpbmdDb2RlWzBdLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIC8vIHZhciBsb2NhbHMgY29udGFpbnMgY291bnRyeSBuYW1lcyB3aXRoIGxvY2FsaXNlZCB2ZXJzaW9ucyBpbiBicmFja2V0c1xuICAgICAgbjogXy5maW5kV2hlcmUobG9jYWxzLCB7XG4gICAgICAgIGNvdW50cnlDb2RlOiBjLmNjYTJcbiAgICAgIH0pLm5hbWUsXG4gICAgICBpOiBjLmNjYTIudG9Mb3dlckNhc2UoKSxcbiAgICAgIGQ6IGMuY2FsbGluZ0NvZGVbMF1cbiAgICB9KTtcbiAgfVxufSk7XG5KU09OLnN0cmluZ2lmeShyZXN1bHQpO1xuKi9cbiAgICAvLyB0aGVuIHdpdGggYSBjb3VwbGUgb2YgbWFudWFsIHJlLWFycmFuZ2VtZW50cyB0byBiZSBhbHBoYWJldGljYWxcbiAgICAvLyB0aGVuIGNoYW5nZWQgS2F6YWtoc3RhbiBmcm9tICs3NiB0byArN1xuICAgIC8vIGFuZCBWYXRpY2FuIENpdHkgZnJvbSArMzc5IHRvICszOSAoc2VlIGlzc3VlIDUwKVxuICAgIC8vIGFuZCBDYXJpYmVhbiBOZXRoZXJsYW5kcyBmcm9tICs1OTk3IHRvICs1OTlcbiAgICAvLyBhbmQgQ3VyYWNhbyBmcm9tICs1OTk5IHRvICs1OTlcbiAgICAvLyBSZW1vdmVkOiDDhWxhbmQgSXNsYW5kcywgQ2hyaXN0bWFzIElzbGFuZCwgQ29jb3MgSXNsYW5kcywgR3Vlcm5zZXksIElzbGUgb2YgTWFuLCBKZXJzZXksIEtvc292bywgTWF5b3R0ZSwgUGl0Y2Fpcm4gSXNsYW5kcywgU291dGggR2VvcmdpYSwgU3ZhbGJhcmQsIFdlc3Rlcm4gU2FoYXJhXG4gICAgLy8gVXBkYXRlOiBjb252ZXJ0ZWQgb2JqZWN0cyB0byBhcnJheXMgdG8gc2F2ZSBieXRlcyFcbiAgICAvLyBVcGRhdGU6IGFkZGVkIFwicHJpb3JpdHlcIiBmb3IgY291bnRyaWVzIHdpdGggdGhlIHNhbWUgZGlhbENvZGUgYXMgb3RoZXJzXG4gICAgLy8gVXBkYXRlOiBhZGRlZCBhcnJheSBvZiBhcmVhIGNvZGVzIGZvciBjb3VudHJpZXMgd2l0aCB0aGUgc2FtZSBkaWFsQ29kZSBhcyBvdGhlcnNcbiAgICAvLyBTbyBlYWNoIGNvdW50cnkgYXJyYXkgaGFzIHRoZSBmb2xsb3dpbmcgaW5mb3JtYXRpb246XG4gICAgLy8gW1xuICAgIC8vICAgIENvdW50cnkgbmFtZSxcbiAgICAvLyAgICBpc28yIGNvZGUsXG4gICAgLy8gICAgSW50ZXJuYXRpb25hbCBkaWFsIGNvZGUsXG4gICAgLy8gICAgT3JkZXIgKGlmID4xIGNvdW50cnkgd2l0aCBzYW1lIGRpYWwgY29kZSksXG4gICAgLy8gICAgQXJlYSBjb2RlcyAoaWYgPjEgY291bnRyeSB3aXRoIHNhbWUgZGlhbCBjb2RlKVxuICAgIC8vIF1cbiAgICB2YXIgYWxsQ291bnRyaWVzID0gWyBbIFwiQWZnaGFuaXN0YW4gKOKAq9in2YHYutin2YbYs9iq2KfZhuKArOKAjilcIiwgXCJhZlwiLCBcIjkzXCIgXSwgWyBcIkFsYmFuaWEgKFNocWlww6tyaSlcIiwgXCJhbFwiLCBcIjM1NVwiIF0sIFsgXCJBbGdlcmlhICjigKvYp9mE2KzYstin2KbYseKArOKAjilcIiwgXCJkelwiLCBcIjIxM1wiIF0sIFsgXCJBbWVyaWNhbiBTYW1vYVwiLCBcImFzXCIsIFwiMTY4NFwiIF0sIFsgXCJBbmRvcnJhXCIsIFwiYWRcIiwgXCIzNzZcIiBdLCBbIFwiQW5nb2xhXCIsIFwiYW9cIiwgXCIyNDRcIiBdLCBbIFwiQW5ndWlsbGFcIiwgXCJhaVwiLCBcIjEyNjRcIiBdLCBbIFwiQW50aWd1YSBhbmQgQmFyYnVkYVwiLCBcImFnXCIsIFwiMTI2OFwiIF0sIFsgXCJBcmdlbnRpbmFcIiwgXCJhclwiLCBcIjU0XCIgXSwgWyBcIkFybWVuaWEgKNWA1aHVtdWh1b3Vv9Wh1bYpXCIsIFwiYW1cIiwgXCIzNzRcIiBdLCBbIFwiQXJ1YmFcIiwgXCJhd1wiLCBcIjI5N1wiIF0sIFsgXCJBdXN0cmFsaWFcIiwgXCJhdVwiLCBcIjYxXCIgXSwgWyBcIkF1c3RyaWEgKMOWc3RlcnJlaWNoKVwiLCBcImF0XCIsIFwiNDNcIiBdLCBbIFwiQXplcmJhaWphbiAoQXrJmXJiYXljYW4pXCIsIFwiYXpcIiwgXCI5OTRcIiBdLCBbIFwiQmFoYW1hc1wiLCBcImJzXCIsIFwiMTI0MlwiIF0sIFsgXCJCYWhyYWluICjigKvYp9mE2KjYrdix2YrZhuKArOKAjilcIiwgXCJiaFwiLCBcIjk3M1wiIF0sIFsgXCJCYW5nbGFkZXNoICjgpqzgpr7gpoLgprLgpr7gpqbgp4fgprYpXCIsIFwiYmRcIiwgXCI4ODBcIiBdLCBbIFwiQmFyYmFkb3NcIiwgXCJiYlwiLCBcIjEyNDZcIiBdLCBbIFwiQmVsYXJ1cyAo0JHQtdC70LDRgNGD0YHRjClcIiwgXCJieVwiLCBcIjM3NVwiIF0sIFsgXCJCZWxnaXVtIChCZWxnacOrKVwiLCBcImJlXCIsIFwiMzJcIiBdLCBbIFwiQmVsaXplXCIsIFwiYnpcIiwgXCI1MDFcIiBdLCBbIFwiQmVuaW4gKELDqW5pbilcIiwgXCJialwiLCBcIjIyOVwiIF0sIFsgXCJCZXJtdWRhXCIsIFwiYm1cIiwgXCIxNDQxXCIgXSwgWyBcIkJodXRhbiAo4L2g4L2W4L6y4L204L2CKVwiLCBcImJ0XCIsIFwiOTc1XCIgXSwgWyBcIkJvbGl2aWFcIiwgXCJib1wiLCBcIjU5MVwiIF0sIFsgXCJCb3NuaWEgYW5kIEhlcnplZ292aW5hICjQkdC+0YHQvdCwINC4INCl0LXRgNGG0LXQs9C+0LLQuNC90LApXCIsIFwiYmFcIiwgXCIzODdcIiBdLCBbIFwiQm90c3dhbmFcIiwgXCJid1wiLCBcIjI2N1wiIF0sIFsgXCJCcmF6aWwgKEJyYXNpbClcIiwgXCJiclwiLCBcIjU1XCIgXSwgWyBcIkJyaXRpc2ggSW5kaWFuIE9jZWFuIFRlcnJpdG9yeVwiLCBcImlvXCIsIFwiMjQ2XCIgXSwgWyBcIkJyaXRpc2ggVmlyZ2luIElzbGFuZHNcIiwgXCJ2Z1wiLCBcIjEyODRcIiBdLCBbIFwiQnJ1bmVpXCIsIFwiYm5cIiwgXCI2NzNcIiBdLCBbIFwiQnVsZ2FyaWEgKNCR0YrQu9Cz0LDRgNC40Y8pXCIsIFwiYmdcIiwgXCIzNTlcIiBdLCBbIFwiQnVya2luYSBGYXNvXCIsIFwiYmZcIiwgXCIyMjZcIiBdLCBbIFwiQnVydW5kaSAoVWJ1cnVuZGkpXCIsIFwiYmlcIiwgXCIyNTdcIiBdLCBbIFwiQ2FtYm9kaWEgKOGegOGemOGfkuGeluGeu+Geh+GetilcIiwgXCJraFwiLCBcIjg1NVwiIF0sIFsgXCJDYW1lcm9vbiAoQ2FtZXJvdW4pXCIsIFwiY21cIiwgXCIyMzdcIiBdLCBbIFwiQ2FuYWRhXCIsIFwiY2FcIiwgXCIxXCIsIDEsIFsgXCIyMDRcIiwgXCIyMjZcIiwgXCIyMzZcIiwgXCIyNDlcIiwgXCIyNTBcIiwgXCIyODlcIiwgXCIzMDZcIiwgXCIzNDNcIiwgXCIzNjVcIiwgXCIzODdcIiwgXCI0MDNcIiwgXCI0MTZcIiwgXCI0MThcIiwgXCI0MzFcIiwgXCI0MzdcIiwgXCI0MzhcIiwgXCI0NTBcIiwgXCI1MDZcIiwgXCI1MTRcIiwgXCI1MTlcIiwgXCI1NDhcIiwgXCI1NzlcIiwgXCI1ODFcIiwgXCI1ODdcIiwgXCI2MDRcIiwgXCI2MTNcIiwgXCI2MzlcIiwgXCI2NDdcIiwgXCI2NzJcIiwgXCI3MDVcIiwgXCI3MDlcIiwgXCI3NDJcIiwgXCI3NzhcIiwgXCI3ODBcIiwgXCI3ODJcIiwgXCI4MDdcIiwgXCI4MTlcIiwgXCI4MjVcIiwgXCI4NjdcIiwgXCI4NzNcIiwgXCI5MDJcIiwgXCI5MDVcIiBdIF0sIFsgXCJDYXBlIFZlcmRlIChLYWJ1IFZlcmRpKVwiLCBcImN2XCIsIFwiMjM4XCIgXSwgWyBcIkNhcmliYmVhbiBOZXRoZXJsYW5kc1wiLCBcImJxXCIsIFwiNTk5XCIsIDEgXSwgWyBcIkNheW1hbiBJc2xhbmRzXCIsIFwia3lcIiwgXCIxMzQ1XCIgXSwgWyBcIkNlbnRyYWwgQWZyaWNhbiBSZXB1YmxpYyAoUsOpcHVibGlxdWUgY2VudHJhZnJpY2FpbmUpXCIsIFwiY2ZcIiwgXCIyMzZcIiBdLCBbIFwiQ2hhZCAoVGNoYWQpXCIsIFwidGRcIiwgXCIyMzVcIiBdLCBbIFwiQ2hpbGVcIiwgXCJjbFwiLCBcIjU2XCIgXSwgWyBcIkNoaW5hICjkuK3lm70pXCIsIFwiY25cIiwgXCI4NlwiIF0sIFsgXCJDb2xvbWJpYVwiLCBcImNvXCIsIFwiNTdcIiBdLCBbIFwiQ29tb3JvcyAo4oCr2KzYstixINin2YTZgtmF2LHigKzigI4pXCIsIFwia21cIiwgXCIyNjlcIiBdLCBbIFwiQ29uZ28gKERSQykgKEphbWh1cmkgeWEgS2lkZW1va3Jhc2lhIHlhIEtvbmdvKVwiLCBcImNkXCIsIFwiMjQzXCIgXSwgWyBcIkNvbmdvIChSZXB1YmxpYykgKENvbmdvLUJyYXp6YXZpbGxlKVwiLCBcImNnXCIsIFwiMjQyXCIgXSwgWyBcIkNvb2sgSXNsYW5kc1wiLCBcImNrXCIsIFwiNjgyXCIgXSwgWyBcIkNvc3RhIFJpY2FcIiwgXCJjclwiLCBcIjUwNlwiIF0sIFsgXCJDw7R0ZSBk4oCZSXZvaXJlXCIsIFwiY2lcIiwgXCIyMjVcIiBdLCBbIFwiQ3JvYXRpYSAoSHJ2YXRza2EpXCIsIFwiaHJcIiwgXCIzODVcIiBdLCBbIFwiQ3ViYVwiLCBcImN1XCIsIFwiNTNcIiBdLCBbIFwiQ3VyYcOnYW9cIiwgXCJjd1wiLCBcIjU5OVwiLCAwIF0sIFsgXCJDeXBydXMgKM6az43PgM+Bzr/PgilcIiwgXCJjeVwiLCBcIjM1N1wiIF0sIFsgXCJDemVjaCBSZXB1YmxpYyAoxIxlc2vDoSByZXB1Ymxpa2EpXCIsIFwiY3pcIiwgXCI0MjBcIiBdLCBbIFwiRGVubWFyayAoRGFubWFyaylcIiwgXCJka1wiLCBcIjQ1XCIgXSwgWyBcIkRqaWJvdXRpXCIsIFwiZGpcIiwgXCIyNTNcIiBdLCBbIFwiRG9taW5pY2FcIiwgXCJkbVwiLCBcIjE3NjdcIiBdLCBbIFwiRG9taW5pY2FuIFJlcHVibGljIChSZXDDumJsaWNhIERvbWluaWNhbmEpXCIsIFwiZG9cIiwgXCIxXCIsIDIsIFsgXCI4MDlcIiwgXCI4MjlcIiwgXCI4NDlcIiBdIF0sIFsgXCJFY3VhZG9yXCIsIFwiZWNcIiwgXCI1OTNcIiBdLCBbIFwiRWd5cHQgKOKAq9mF2LXYseKArOKAjilcIiwgXCJlZ1wiLCBcIjIwXCIgXSwgWyBcIkVsIFNhbHZhZG9yXCIsIFwic3ZcIiwgXCI1MDNcIiBdLCBbIFwiRXF1YXRvcmlhbCBHdWluZWEgKEd1aW5lYSBFY3VhdG9yaWFsKVwiLCBcImdxXCIsIFwiMjQwXCIgXSwgWyBcIkVyaXRyZWFcIiwgXCJlclwiLCBcIjI5MVwiIF0sIFsgXCJFc3RvbmlhIChFZXN0aSlcIiwgXCJlZVwiLCBcIjM3MlwiIF0sIFsgXCJFdGhpb3BpYVwiLCBcImV0XCIsIFwiMjUxXCIgXSwgWyBcIkZhbGtsYW5kIElzbGFuZHMgKElzbGFzIE1hbHZpbmFzKVwiLCBcImZrXCIsIFwiNTAwXCIgXSwgWyBcIkZhcm9lIElzbGFuZHMgKEbDuHJveWFyKVwiLCBcImZvXCIsIFwiMjk4XCIgXSwgWyBcIkZpamlcIiwgXCJmalwiLCBcIjY3OVwiIF0sIFsgXCJGaW5sYW5kIChTdW9taSlcIiwgXCJmaVwiLCBcIjM1OFwiIF0sIFsgXCJGcmFuY2VcIiwgXCJmclwiLCBcIjMzXCIgXSwgWyBcIkZyZW5jaCBHdWlhbmEgKEd1eWFuZSBmcmFuw6dhaXNlKVwiLCBcImdmXCIsIFwiNTk0XCIgXSwgWyBcIkZyZW5jaCBQb2x5bmVzaWEgKFBvbHluw6lzaWUgZnJhbsOnYWlzZSlcIiwgXCJwZlwiLCBcIjY4OVwiIF0sIFsgXCJHYWJvblwiLCBcImdhXCIsIFwiMjQxXCIgXSwgWyBcIkdhbWJpYVwiLCBcImdtXCIsIFwiMjIwXCIgXSwgWyBcIkdlb3JnaWEgKOGDoeGDkOGDpeGDkOGDoOGDl+GDleGDlOGDmuGDnSlcIiwgXCJnZVwiLCBcIjk5NVwiIF0sIFsgXCJHZXJtYW55IChEZXV0c2NobGFuZClcIiwgXCJkZVwiLCBcIjQ5XCIgXSwgWyBcIkdoYW5hIChHYWFuYSlcIiwgXCJnaFwiLCBcIjIzM1wiIF0sIFsgXCJHaWJyYWx0YXJcIiwgXCJnaVwiLCBcIjM1MFwiIF0sIFsgXCJHcmVlY2UgKM6VzrvOu86szrTOsSlcIiwgXCJnclwiLCBcIjMwXCIgXSwgWyBcIkdyZWVubGFuZCAoS2FsYWFsbGl0IE51bmFhdClcIiwgXCJnbFwiLCBcIjI5OVwiIF0sIFsgXCJHcmVuYWRhXCIsIFwiZ2RcIiwgXCIxNDczXCIgXSwgWyBcIkd1YWRlbG91cGVcIiwgXCJncFwiLCBcIjU5MFwiLCAwIF0sIFsgXCJHdWFtXCIsIFwiZ3VcIiwgXCIxNjcxXCIgXSwgWyBcIkd1YXRlbWFsYVwiLCBcImd0XCIsIFwiNTAyXCIgXSwgWyBcIkd1aW5lYSAoR3VpbsOpZSlcIiwgXCJnblwiLCBcIjIyNFwiIF0sIFsgXCJHdWluZWEtQmlzc2F1IChHdWluw6kgQmlzc2F1KVwiLCBcImd3XCIsIFwiMjQ1XCIgXSwgWyBcIkd1eWFuYVwiLCBcImd5XCIsIFwiNTkyXCIgXSwgWyBcIkhhaXRpXCIsIFwiaHRcIiwgXCI1MDlcIiBdLCBbIFwiSG9uZHVyYXNcIiwgXCJoblwiLCBcIjUwNFwiIF0sIFsgXCJIb25nIEtvbmcgKOmmmea4rylcIiwgXCJoa1wiLCBcIjg1MlwiIF0sIFsgXCJIdW5nYXJ5IChNYWd5YXJvcnN6w6FnKVwiLCBcImh1XCIsIFwiMzZcIiBdLCBbIFwiSWNlbGFuZCAow41zbGFuZClcIiwgXCJpc1wiLCBcIjM1NFwiIF0sIFsgXCJJbmRpYSAo4KSt4KS+4KSw4KSkKVwiLCBcImluXCIsIFwiOTFcIiBdLCBbIFwiSW5kb25lc2lhXCIsIFwiaWRcIiwgXCI2MlwiIF0sIFsgXCJJcmFuICjigKvYp9uM2LHYp9mG4oCs4oCOKVwiLCBcImlyXCIsIFwiOThcIiBdLCBbIFwiSXJhcSAo4oCr2KfZhNi52LHYp9mC4oCs4oCOKVwiLCBcImlxXCIsIFwiOTY0XCIgXSwgWyBcIklyZWxhbmRcIiwgXCJpZVwiLCBcIjM1M1wiIF0sIFsgXCJJc3JhZWwgKOKAq9eZ16nXqNeQ15zigKzigI4pXCIsIFwiaWxcIiwgXCI5NzJcIiBdLCBbIFwiSXRhbHkgKEl0YWxpYSlcIiwgXCJpdFwiLCBcIjM5XCIsIDAgXSwgWyBcIkphbWFpY2FcIiwgXCJqbVwiLCBcIjE4NzZcIiBdLCBbIFwiSmFwYW4gKOaXpeacrClcIiwgXCJqcFwiLCBcIjgxXCIgXSwgWyBcIkpvcmRhbiAo4oCr2KfZhNij2LHYr9mG4oCs4oCOKVwiLCBcImpvXCIsIFwiOTYyXCIgXSwgWyBcIkthemFraHN0YW4gKNCa0LDQt9Cw0YXRgdGC0LDQvSlcIiwgXCJrelwiLCBcIjdcIiwgMSBdLCBbIFwiS2VueWFcIiwgXCJrZVwiLCBcIjI1NFwiIF0sIFsgXCJLaXJpYmF0aVwiLCBcImtpXCIsIFwiNjg2XCIgXSwgWyBcIkt1d2FpdCAo4oCr2KfZhNmD2YjZitiq4oCs4oCOKVwiLCBcImt3XCIsIFwiOTY1XCIgXSwgWyBcIkt5cmd5enN0YW4gKNCa0YvRgNCz0YvQt9GB0YLQsNC9KVwiLCBcImtnXCIsIFwiOTk2XCIgXSwgWyBcIkxhb3MgKOC6peC6suC6pylcIiwgXCJsYVwiLCBcIjg1NlwiIF0sIFsgXCJMYXR2aWEgKExhdHZpamEpXCIsIFwibHZcIiwgXCIzNzFcIiBdLCBbIFwiTGViYW5vbiAo4oCr2YTYqNmG2KfZhuKArOKAjilcIiwgXCJsYlwiLCBcIjk2MVwiIF0sIFsgXCJMZXNvdGhvXCIsIFwibHNcIiwgXCIyNjZcIiBdLCBbIFwiTGliZXJpYVwiLCBcImxyXCIsIFwiMjMxXCIgXSwgWyBcIkxpYnlhICjigKvZhNmK2KjZitin4oCs4oCOKVwiLCBcImx5XCIsIFwiMjE4XCIgXSwgWyBcIkxpZWNodGVuc3RlaW5cIiwgXCJsaVwiLCBcIjQyM1wiIF0sIFsgXCJMaXRodWFuaWEgKExpZXR1dmEpXCIsIFwibHRcIiwgXCIzNzBcIiBdLCBbIFwiTHV4ZW1ib3VyZ1wiLCBcImx1XCIsIFwiMzUyXCIgXSwgWyBcIk1hY2F1ICjmvrPploApXCIsIFwibW9cIiwgXCI4NTNcIiBdLCBbIFwiTWFjZWRvbmlhIChGWVJPTSkgKNCc0LDQutC10LTQvtC90LjRmNCwKVwiLCBcIm1rXCIsIFwiMzg5XCIgXSwgWyBcIk1hZGFnYXNjYXIgKE1hZGFnYXNpa2FyYSlcIiwgXCJtZ1wiLCBcIjI2MVwiIF0sIFsgXCJNYWxhd2lcIiwgXCJtd1wiLCBcIjI2NVwiIF0sIFsgXCJNYWxheXNpYVwiLCBcIm15XCIsIFwiNjBcIiBdLCBbIFwiTWFsZGl2ZXNcIiwgXCJtdlwiLCBcIjk2MFwiIF0sIFsgXCJNYWxpXCIsIFwibWxcIiwgXCIyMjNcIiBdLCBbIFwiTWFsdGFcIiwgXCJtdFwiLCBcIjM1NlwiIF0sIFsgXCJNYXJzaGFsbCBJc2xhbmRzXCIsIFwibWhcIiwgXCI2OTJcIiBdLCBbIFwiTWFydGluaXF1ZVwiLCBcIm1xXCIsIFwiNTk2XCIgXSwgWyBcIk1hdXJpdGFuaWEgKOKAq9mF2YjYsdmK2KrYp9mG2YrYp+KArOKAjilcIiwgXCJtclwiLCBcIjIyMlwiIF0sIFsgXCJNYXVyaXRpdXMgKE1vcmlzKVwiLCBcIm11XCIsIFwiMjMwXCIgXSwgWyBcIk1leGljbyAoTcOpeGljbylcIiwgXCJteFwiLCBcIjUyXCIgXSwgWyBcIk1pY3JvbmVzaWFcIiwgXCJmbVwiLCBcIjY5MVwiIF0sIFsgXCJNb2xkb3ZhIChSZXB1YmxpY2EgTW9sZG92YSlcIiwgXCJtZFwiLCBcIjM3M1wiIF0sIFsgXCJNb25hY29cIiwgXCJtY1wiLCBcIjM3N1wiIF0sIFsgXCJNb25nb2xpYSAo0JzQvtC90LPQvtC7KVwiLCBcIm1uXCIsIFwiOTc2XCIgXSwgWyBcIk1vbnRlbmVncm8gKENybmEgR29yYSlcIiwgXCJtZVwiLCBcIjM4MlwiIF0sIFsgXCJNb250c2VycmF0XCIsIFwibXNcIiwgXCIxNjY0XCIgXSwgWyBcIk1vcm9jY28gKOKAq9in2YTZhdi62LHYqOKArOKAjilcIiwgXCJtYVwiLCBcIjIxMlwiIF0sIFsgXCJNb3phbWJpcXVlIChNb8OnYW1iaXF1ZSlcIiwgXCJtelwiLCBcIjI1OFwiIF0sIFsgXCJNeWFubWFyIChCdXJtYSkgKOGAmeGAvOGAlOGAuuGAmeGArClcIiwgXCJtbVwiLCBcIjk1XCIgXSwgWyBcIk5hbWliaWEgKE5hbWliacOrKVwiLCBcIm5hXCIsIFwiMjY0XCIgXSwgWyBcIk5hdXJ1XCIsIFwibnJcIiwgXCI2NzRcIiBdLCBbIFwiTmVwYWwgKOCkqOClh+CkquCkvuCksilcIiwgXCJucFwiLCBcIjk3N1wiIF0sIFsgXCJOZXRoZXJsYW5kcyAoTmVkZXJsYW5kKVwiLCBcIm5sXCIsIFwiMzFcIiBdLCBbIFwiTmV3IENhbGVkb25pYSAoTm91dmVsbGUtQ2Fsw6lkb25pZSlcIiwgXCJuY1wiLCBcIjY4N1wiIF0sIFsgXCJOZXcgWmVhbGFuZFwiLCBcIm56XCIsIFwiNjRcIiBdLCBbIFwiTmljYXJhZ3VhXCIsIFwibmlcIiwgXCI1MDVcIiBdLCBbIFwiTmlnZXIgKE5pamFyKVwiLCBcIm5lXCIsIFwiMjI3XCIgXSwgWyBcIk5pZ2VyaWFcIiwgXCJuZ1wiLCBcIjIzNFwiIF0sIFsgXCJOaXVlXCIsIFwibnVcIiwgXCI2ODNcIiBdLCBbIFwiTm9yZm9sayBJc2xhbmRcIiwgXCJuZlwiLCBcIjY3MlwiIF0sIFsgXCJOb3J0aCBLb3JlYSAo7KGw7ISgIOuvvOyjvOyjvOydmCDsnbjrr7wg6rO17ZmU6rWtKVwiLCBcImtwXCIsIFwiODUwXCIgXSwgWyBcIk5vcnRoZXJuIE1hcmlhbmEgSXNsYW5kc1wiLCBcIm1wXCIsIFwiMTY3MFwiIF0sIFsgXCJOb3J3YXkgKE5vcmdlKVwiLCBcIm5vXCIsIFwiNDdcIiBdLCBbIFwiT21hbiAo4oCr2LnZj9mF2KfZhuKArOKAjilcIiwgXCJvbVwiLCBcIjk2OFwiIF0sIFsgXCJQYWtpc3RhbiAo4oCr2b7Yp9qp2LPYqtin2YbigKzigI4pXCIsIFwicGtcIiwgXCI5MlwiIF0sIFsgXCJQYWxhdVwiLCBcInB3XCIsIFwiNjgwXCIgXSwgWyBcIlBhbGVzdGluZSAo4oCr2YHZhNiz2LfZitmG4oCs4oCOKVwiLCBcInBzXCIsIFwiOTcwXCIgXSwgWyBcIlBhbmFtYSAoUGFuYW3DoSlcIiwgXCJwYVwiLCBcIjUwN1wiIF0sIFsgXCJQYXB1YSBOZXcgR3VpbmVhXCIsIFwicGdcIiwgXCI2NzVcIiBdLCBbIFwiUGFyYWd1YXlcIiwgXCJweVwiLCBcIjU5NVwiIF0sIFsgXCJQZXJ1IChQZXLDuilcIiwgXCJwZVwiLCBcIjUxXCIgXSwgWyBcIlBoaWxpcHBpbmVzXCIsIFwicGhcIiwgXCI2M1wiIF0sIFsgXCJQb2xhbmQgKFBvbHNrYSlcIiwgXCJwbFwiLCBcIjQ4XCIgXSwgWyBcIlBvcnR1Z2FsXCIsIFwicHRcIiwgXCIzNTFcIiBdLCBbIFwiUHVlcnRvIFJpY29cIiwgXCJwclwiLCBcIjFcIiwgMywgWyBcIjc4N1wiLCBcIjkzOVwiIF0gXSwgWyBcIlFhdGFyICjigKvZgti32LHigKzigI4pXCIsIFwicWFcIiwgXCI5NzRcIiBdLCBbIFwiUsOpdW5pb24gKExhIFLDqXVuaW9uKVwiLCBcInJlXCIsIFwiMjYyXCIgXSwgWyBcIlJvbWFuaWEgKFJvbcOibmlhKVwiLCBcInJvXCIsIFwiNDBcIiBdLCBbIFwiUnVzc2lhICjQoNC+0YHRgdC40Y8pXCIsIFwicnVcIiwgXCI3XCIsIDAgXSwgWyBcIlJ3YW5kYVwiLCBcInJ3XCIsIFwiMjUwXCIgXSwgWyBcIlNhaW50IEJhcnRow6lsZW15IChTYWludC1CYXJ0aMOpbGVteSlcIiwgXCJibFwiLCBcIjU5MFwiLCAxIF0sIFsgXCJTYWludCBIZWxlbmFcIiwgXCJzaFwiLCBcIjI5MFwiIF0sIFsgXCJTYWludCBLaXR0cyBhbmQgTmV2aXNcIiwgXCJrblwiLCBcIjE4NjlcIiBdLCBbIFwiU2FpbnQgTHVjaWFcIiwgXCJsY1wiLCBcIjE3NThcIiBdLCBbIFwiU2FpbnQgTWFydGluIChTYWludC1NYXJ0aW4gKHBhcnRpZSBmcmFuw6dhaXNlKSlcIiwgXCJtZlwiLCBcIjU5MFwiLCAyIF0sIFsgXCJTYWludCBQaWVycmUgYW5kIE1pcXVlbG9uIChTYWludC1QaWVycmUtZXQtTWlxdWVsb24pXCIsIFwicG1cIiwgXCI1MDhcIiBdLCBbIFwiU2FpbnQgVmluY2VudCBhbmQgdGhlIEdyZW5hZGluZXNcIiwgXCJ2Y1wiLCBcIjE3ODRcIiBdLCBbIFwiU2Ftb2FcIiwgXCJ3c1wiLCBcIjY4NVwiIF0sIFsgXCJTYW4gTWFyaW5vXCIsIFwic21cIiwgXCIzNzhcIiBdLCBbIFwiU8OjbyBUb23DqSBhbmQgUHLDrW5jaXBlIChTw6NvIFRvbcOpIGUgUHLDrW5jaXBlKVwiLCBcInN0XCIsIFwiMjM5XCIgXSwgWyBcIlNhdWRpIEFyYWJpYSAo4oCr2KfZhNmF2YXZhNmD2Kkg2KfZhNi52LHYqNmK2Kkg2KfZhNiz2LnZiNiv2YrYqeKArOKAjilcIiwgXCJzYVwiLCBcIjk2NlwiIF0sIFsgXCJTZW5lZ2FsIChTw6luw6lnYWwpXCIsIFwic25cIiwgXCIyMjFcIiBdLCBbIFwiU2VyYmlhICjQodGA0LHQuNGY0LApXCIsIFwicnNcIiwgXCIzODFcIiBdLCBbIFwiU2V5Y2hlbGxlc1wiLCBcInNjXCIsIFwiMjQ4XCIgXSwgWyBcIlNpZXJyYSBMZW9uZVwiLCBcInNsXCIsIFwiMjMyXCIgXSwgWyBcIlNpbmdhcG9yZVwiLCBcInNnXCIsIFwiNjVcIiBdLCBbIFwiU2ludCBNYWFydGVuXCIsIFwic3hcIiwgXCIxNzIxXCIgXSwgWyBcIlNsb3Zha2lhIChTbG92ZW5za28pXCIsIFwic2tcIiwgXCI0MjFcIiBdLCBbIFwiU2xvdmVuaWEgKFNsb3ZlbmlqYSlcIiwgXCJzaVwiLCBcIjM4NlwiIF0sIFsgXCJTb2xvbW9uIElzbGFuZHNcIiwgXCJzYlwiLCBcIjY3N1wiIF0sIFsgXCJTb21hbGlhIChTb29tYWFsaXlhKVwiLCBcInNvXCIsIFwiMjUyXCIgXSwgWyBcIlNvdXRoIEFmcmljYVwiLCBcInphXCIsIFwiMjdcIiBdLCBbIFwiU291dGggS29yZWEgKOuMgO2VnOuvvOq1rSlcIiwgXCJrclwiLCBcIjgyXCIgXSwgWyBcIlNvdXRoIFN1ZGFuICjigKvYrNmG2YjYqCDYp9mE2LPZiNiv2KfZhuKArOKAjilcIiwgXCJzc1wiLCBcIjIxMVwiIF0sIFsgXCJTcGFpbiAoRXNwYcOxYSlcIiwgXCJlc1wiLCBcIjM0XCIgXSwgWyBcIlNyaSBMYW5rYSAo4LeB4LeK4oCN4La74LeTIOC2veC2guC2muC3j+C3gClcIiwgXCJsa1wiLCBcIjk0XCIgXSwgWyBcIlN1ZGFuICjigKvYp9mE2LPZiNiv2KfZhuKArOKAjilcIiwgXCJzZFwiLCBcIjI0OVwiIF0sIFsgXCJTdXJpbmFtZVwiLCBcInNyXCIsIFwiNTk3XCIgXSwgWyBcIlN3YXppbGFuZFwiLCBcInN6XCIsIFwiMjY4XCIgXSwgWyBcIlN3ZWRlbiAoU3ZlcmlnZSlcIiwgXCJzZVwiLCBcIjQ2XCIgXSwgWyBcIlN3aXR6ZXJsYW5kIChTY2h3ZWl6KVwiLCBcImNoXCIsIFwiNDFcIiBdLCBbIFwiU3lyaWEgKOKAq9iz2YjYsdmK2KfigKzigI4pXCIsIFwic3lcIiwgXCI5NjNcIiBdLCBbIFwiVGFpd2FuICjlj7DngaMpXCIsIFwidHdcIiwgXCI4ODZcIiBdLCBbIFwiVGFqaWtpc3RhblwiLCBcInRqXCIsIFwiOTkyXCIgXSwgWyBcIlRhbnphbmlhXCIsIFwidHpcIiwgXCIyNTVcIiBdLCBbIFwiVGhhaWxhbmQgKOC5hOC4l+C4oilcIiwgXCJ0aFwiLCBcIjY2XCIgXSwgWyBcIlRpbW9yLUxlc3RlXCIsIFwidGxcIiwgXCI2NzBcIiBdLCBbIFwiVG9nb1wiLCBcInRnXCIsIFwiMjI4XCIgXSwgWyBcIlRva2VsYXVcIiwgXCJ0a1wiLCBcIjY5MFwiIF0sIFsgXCJUb25nYVwiLCBcInRvXCIsIFwiNjc2XCIgXSwgWyBcIlRyaW5pZGFkIGFuZCBUb2JhZ29cIiwgXCJ0dFwiLCBcIjE4NjhcIiBdLCBbIFwiVHVuaXNpYSAo4oCr2KrZiNmG2LPigKzigI4pXCIsIFwidG5cIiwgXCIyMTZcIiBdLCBbIFwiVHVya2V5IChUw7xya2l5ZSlcIiwgXCJ0clwiLCBcIjkwXCIgXSwgWyBcIlR1cmttZW5pc3RhblwiLCBcInRtXCIsIFwiOTkzXCIgXSwgWyBcIlR1cmtzIGFuZCBDYWljb3MgSXNsYW5kc1wiLCBcInRjXCIsIFwiMTY0OVwiIF0sIFsgXCJUdXZhbHVcIiwgXCJ0dlwiLCBcIjY4OFwiIF0sIFsgXCJVLlMuIFZpcmdpbiBJc2xhbmRzXCIsIFwidmlcIiwgXCIxMzQwXCIgXSwgWyBcIlVnYW5kYVwiLCBcInVnXCIsIFwiMjU2XCIgXSwgWyBcIlVrcmFpbmUgKNCj0LrRgNCw0ZfQvdCwKVwiLCBcInVhXCIsIFwiMzgwXCIgXSwgWyBcIlVuaXRlZCBBcmFiIEVtaXJhdGVzICjigKvYp9mE2KXZhdin2LHYp9iqINin2YTYudix2KjZitipINin2YTZhdiq2K3Yr9ip4oCs4oCOKVwiLCBcImFlXCIsIFwiOTcxXCIgXSwgWyBcIlVuaXRlZCBLaW5nZG9tXCIsIFwiZ2JcIiwgXCI0NFwiIF0sIFsgXCJVbml0ZWQgU3RhdGVzXCIsIFwidXNcIiwgXCIxXCIsIDAgXSwgWyBcIlVydWd1YXlcIiwgXCJ1eVwiLCBcIjU5OFwiIF0sIFsgXCJVemJla2lzdGFuIChPyrt6YmVraXN0b24pXCIsIFwidXpcIiwgXCI5OThcIiBdLCBbIFwiVmFudWF0dVwiLCBcInZ1XCIsIFwiNjc4XCIgXSwgWyBcIlZhdGljYW4gQ2l0eSAoQ2l0dMOgIGRlbCBWYXRpY2FubylcIiwgXCJ2YVwiLCBcIjM5XCIsIDEgXSwgWyBcIlZlbmV6dWVsYVwiLCBcInZlXCIsIFwiNThcIiBdLCBbIFwiVmlldG5hbSAoVmnhu4d0IE5hbSlcIiwgXCJ2blwiLCBcIjg0XCIgXSwgWyBcIldhbGxpcyBhbmQgRnV0dW5hXCIsIFwid2ZcIiwgXCI2ODFcIiBdLCBbIFwiWWVtZW4gKOKAq9in2YTZitmF2YbigKzigI4pXCIsIFwieWVcIiwgXCI5NjdcIiBdLCBbIFwiWmFtYmlhXCIsIFwiem1cIiwgXCIyNjBcIiBdLCBbIFwiWmltYmFid2VcIiwgXCJ6d1wiLCBcIjI2M1wiIF0gXTtcbiAgICAvLyBsb29wIG92ZXIgYWxsIG9mIHRoZSBjb3VudHJpZXMgYWJvdmVcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbENvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGFsbENvdW50cmllc1tpXTtcbiAgICAgICAgYWxsQ291bnRyaWVzW2ldID0ge1xuICAgICAgICAgICAgbmFtZTogY1swXSxcbiAgICAgICAgICAgIGlzbzI6IGNbMV0sXG4gICAgICAgICAgICBkaWFsQ29kZTogY1syXSxcbiAgICAgICAgICAgIHByaW9yaXR5OiBjWzNdIHx8IDAsXG4gICAgICAgICAgICBhcmVhQ29kZXM6IGNbNF0gfHwgbnVsbFxuICAgICAgICB9O1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdmVuZG9yL2ludGwtdGVsLWlucHV0L2J1aWxkL2pzL2ludGxUZWxJbnB1dC5qc1xuLy8gbW9kdWxlIGlkID0gMzc2XG4vLyBtb2R1bGUgY2h1bmtzID0gOCA5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gICAgICAgIDtcblxuXG52YXIgdDJtID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcblxuICAgIHJldHVybiBpWzBdICogNjAgKyBpWzFdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XG4gICAgaXNvbGF0ZWQ6IHRydWUsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teXByb2ZpbGUvdmlldy5odG1sJyksXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgb25pbml0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIFxuICAgIH0sXG4gICAgZWRpdDpmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiSW5zaWRlIGVkaXRcIik7XG4gICAgICAgIHRoaXMuc2V0KCdteXByb2ZpbGUuZWRpdCcsIHRydWUpO1xuICAgIH0sXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgIHRoaXMub2JzZXJ2ZSgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcicsIGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5zaWRlIHZpZXcgY3VycmVudFRyYXZlbGxlciBjaGFuZ2VkXCIpO1xuLy8gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4vLyAgICAgICAgICAgIFxuLy8gICAgICAgIH0sIHtpbml0OiB0cnVlfSk7XG4vLyAgICAgICAgdGhpcy5vYnNlcnZlKCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVySWQnLCBmdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY3VycmVudFRyYXZlbGxlcklkIGNoYW5nZWQgXCIpO1xuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHZhbHVlKTtcbi8vICAgICAgICAgICAgLy90aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcsIHZhbHVlKTtcbi8vICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcbiAgICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvbXBvbmVudHMvbXlwcm9maWxlL3ZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDM3N1xuLy8gbW9kdWxlIGNodW5rcyA9IDgiLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOltcIk15IFByb2ZpbGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbe1widFwiOjQsXCJmXCI6W1widWkgc2VnbWVudCBsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwibXlwcm9maWxlLnBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2VyLWluZm9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLmJhc2VVcmxcIn0sXCIvdGhlbWVzL0IyQy9pbWcvZ3Vlc3QucG5nXCJdLFwiYWx0XCI6XCJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm5hbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLm5hbWVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjdXN0b21lci1pZFwifSxcImZcIjpbXCJVc2VyIElkOiBcIix7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5pZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBob25lXCJ9LFwiZlwiOltcIk1vYmlsZSBObzogXCIse1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUubW9iaWxlXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiZWRpdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsIGdyYXlcIn0sXCJmXCI6W1wiRWRpdFwiXX0sXCIgXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRldGFpbHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaGVhZGVyXCJ9LFwiZlwiOltcIkVtYWlsIEFkZHJlc3NcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5lbWFpbFwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaGVhZGVyXCJ9LFwiZlwiOltcIk1vYmlsZSBOdW1iZXJcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5tb2JpbGVcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImg0XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGhlYWRlclwifSxcImZcIjpbXCJBZGRyZXNzXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUuYWRkcmVzc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaGVhZGVyXCJ9LFwiZlwiOltcIkNpdHlcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5jaXR5XCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIn0sXCJmXCI6W1wiU3RhdGVcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5zdGF0ZVwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaGVhZGVyXCJ9LFwiZlwiOltcIkNvdW50cnlcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5jb3VudHJ5XCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIn0sXCJmXCI6W1wiUGluY29kZVwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLnBpbmNvZGVcIn1dfV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJteXByb2ZpbGVcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W10sXCJyXCI6XCJteXByb2ZpbGVcIn1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteXByb2ZpbGUucGVuZGluZ1wiXSxcInNcIjpcIiFfMFwifX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215cHJvZmlsZS92aWV3Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM3OFxuLy8gbW9kdWxlIGNodW5rcyA9IDgiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGVzcy93ZWIvbW9kdWxlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5sZXNzXG4vLyBtb2R1bGUgaWQgPSAzNzlcbi8vIG1vZHVsZSBjaHVua3MgPSA4IDkiXSwic291cmNlUm9vdCI6IiJ9