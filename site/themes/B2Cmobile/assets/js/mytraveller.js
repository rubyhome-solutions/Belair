webpackJsonp([7],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(279);


/***/ },

/***/ 58:
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

/***/ 60:
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

/***/ 61:
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 63:
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

/***/ 80:
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

/***/ 81:
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

/***/ 216:
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

/***/ 217:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui selection input spinner dropdown in ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":7,"e":"input","a":{"type":"hidden","value":[{"t":2,"r":"value"}]}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"div","a":{"class":"text"},"f":[{"t":2,"r":"value"}]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button inc"},"v":{"click":{"m":"inc","a":{"r":[],"s":"[]"}}},"f":["+"]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button dec"},"v":{"click":{"m":"dec","a":{"r":[],"s":"[]"}}},"f":["-"]}]}]};

/***/ },

/***/ 271:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(272);
	
	var $ = __webpack_require__(32);
	
	var Input = __webpack_require__(36);
	
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
	
	        input.on('keydown', function(e) {
	            e.preventDefault();
	        });
	    },
	
	    onteadown: function() {
	        $(this.find('input')).intlTelInput('destroy');
	    }
	});

/***/ },

/***/ 272:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	International Telephone Input v5.8.7
	https://github.com/Bluefieldscom/intl-tel-input.git
	*/
	// wrap in UMD - see https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
	(function(factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(32) ], __WEBPACK_AMD_DEFINE_RESULT__ = function($) {
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

/***/ 275:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  Mytraveller = __webpack_require__(280);
	     
	     __webpack_require__(275);
	//$(function() {
	//    console.log('Inside Main mytraveller');
	//    var mytraveller = new Mytraveller();
	//    var user = new User();    
	//
	//    mytraveller.render('#content');
	//    user.render('#panel');
	//});
	
	$(function() {
	    (new Mytraveller()).render('#app');
	});

/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	   // Mytraveller = require('app/stores/mytraveller/mytraveller')
	    Mytraveller = __webpack_require__(281),
	    Meta = __webpack_require__(58)
	    //,
	   // User = require('stores/user/user')
	    ;
	
	//require('modules/mytraveller/mytraveller.less');
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(282),
	
	    components: {
	        'layout': __webpack_require__(70),
	        'traveller-form': __webpack_require__(283),
	        travellerview: __webpack_require__(285),
	        travellerlist: __webpack_require__(287),
	     //   leftpanel:require('components/layouts/profile_sidebar')
	      //  profilesidebar: require('../layouts/profile_sidebar')
	    },
	    partials: {
	        'base-panel': __webpack_require__(98)
	    },
	    
	    onconfig: function() {
	        this.set('mytraveller.pending', true);
	        Meta.instance()
	                .then(function(meta) { this.set('meta', meta);}.bind(this));
	       Mytraveller.fetch()
	                .then(function(travelers) { this.set('mytraveller.pending', false); this.set('mytraveller', travelers); }.bind(this));
	       
	       // console.log(User.data());
	       //this.set('user', User.data());
	       // window.view = this;
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

/***/ 281:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(29),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(32),
	    moment = __webpack_require__(43),
	    validate = __webpack_require__(60)
	    
	    ;
	
	var Store = __webpack_require__(53)  ;
	
	var Traveler = Store.extend({
	    computed: {
	        price: function() {
	            _.reduce(this.get(' '))
	        }
	    }
	});
	
	Traveler.parse = function(data) {
	            
	    data.travellers= _.map(data, function(i) {
	        
	        return { id: i.id,user_info_id:i.user_info_id,title:i.traveler_title_id,gender_id:i.gender_id,passport_country_id:i.passport_country_id,city_id:i.city_id, email: i.email, mobile: i.mobile,passport_number:i.passport_number, passport_issue:i.passport_issue,
	                passport_expiry:i.passport_expiry, passport_place:i.passport_place, pincode:i.pincode,address:i.address,phone:i.phone,email2:i.email2,
	               first_name: i.first_name, last_name:i.last_name,birthdate:i.birthdate,baseUrl:''}; }); 
	         // console.log(data.travellers); 
	          var url=window.location.href;
	          if(url.indexOf('mytravelers/')>-1){
	              var cid=url.split('mytravelers/')[1];              
	              data.currentTraveller=_.last(_.filter(data.travellers, {'id': _.parseInt(cid)}));              
	              if(data.currentTraveller!=null)
	                data.currentTravellerId=data.currentTraveller.id;
	          }else{
	            data.currentTraveller= _.first(data.travellers);
	            if(data.currentTraveller!=null)
	            data.currentTravellerId=data.currentTraveller.id;
	          }
	            data.cabinType= 1;
	            data.add=false;
	            data.edit=false;
	            data.passengers= [1, 0, 0];
	            data.pending= false;
	            data.errors= {};
	            data.results= [];
	
	            data.filter= {};
	            data.filtered= {};
	    return new Traveler({data: data});
	
	};
	Traveler.add= function(data) {
	    //console.log("Inside Traveler.add");
	    console.log(JSON.stringify(data));
	      return Q.Promise(function(resolve, reject) {
	        //$.post('/b2c/traveler/create', JSON.stringify(data), 'json')
	       $.ajax({
	    type: 'POST',
	    url: '/b2c/traveler/create',
	    dataType: 'json',
	    data: {'data': JSON.stringify(data)},
	    success: function(msg) {
	     // console.log("Success");
	    }
	  })     .then(function(rdata) { console.log(rdata);resolve({data:rdata.traveler_id});
	                
	            })
	            .fail(function(data) {
	                //TODO: handle error
	             console.log("failed");
	             console.log(data);
	            });
	    });
	    };
	Traveler.fetch = function(id) {
	   // console.log("Traveler.fetch");
	    return Q.Promise(function(resolve, reject) {
	        $.getJSON('/b2c/traveler/getMyTravelersList')
	            .then(function(data) {  resolve(Traveler.parse(data));
	                
	            })
	            .fail(function(data) {
	                //TODO: handle error
	             console.log("failed");
	             console.log(data);
	            });
	    });
	};
	
	module.exports = Traveler;

/***/ },

/***/ 282:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"box my-travellers"},"f":[{"t":7,"e":"div","a":{"class":"left"},"f":[{"t":7,"e":"div","a":{"id":"currentTraveler"},"f":[{"t":4,"f":[{"t":7,"e":"travellerview","a":{"mytraveller":[{"t":2,"r":"mytraveller"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"x":{"r":["mytraveller.add","mytraveller.edit"],"s":"!_0&&!_1"}},{"t":4,"n":51,"f":[{"t":7,"e":"traveller-form","a":{"mytraveller":[{"t":2,"r":"mytraveller"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["mytraveller.add","mytraveller.edit"],"s":"!_0&&!_1"}}]}]}," ",{"t":7,"e":"travellerlist","a":{"mytraveller":[{"t":2,"r":"mytraveller"}],"meta":[{"t":2,"r":"meta"}]}}]}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 283:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	        _ = __webpack_require__(29),
	        moment = __webpack_require__(43),
	        Mytraveller = __webpack_require__(281)
	        ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(284),
	    components: {
	        'ui-spinner': __webpack_require__(216),
	        'ui-calendar': __webpack_require__(42),
	        'ui-tel': __webpack_require__(271),
	        'ui-email': __webpack_require__(80),
	        'ui-input': __webpack_require__(36),
	        'ui-date': __webpack_require__(40),
	    },
	    data: function () {
	        return {
	            error:null,
	            state: {
	            },
	            //  meta: require('app/stores/meta').instance(),
	
	            formatTitles: function (titles) {
	                var data = _.cloneDeep(titles);
	
	                return _.map(data, function (i) {
	                    return {id: i.id, text: i.name};
	                });
	            },
	        }
	    },
	    oninit: function (options) {
	        var date;
	        
	        if(this.get('mytraveller.currentTraveller')!=null){
	            date = this.get('mytraveller.currentTraveller.birthdate');
	            if(date!=null&&date!='') {
	                if (moment.isMoment(date)) {
	                    this.get('mytraveller').set('currentTraveller.birthdate', date);
	                } else {
	                    this.get('mytraveller').set('currentTraveller.birthdate', moment(date, 'YYYY-MM-DD'));
	                }
	            }
	        }
	        this.on('add', function (event) {
	            
	            var newtraveller = this.get('mytraveller.currentTraveller');
	            var travellers = this.get('mytraveller.travellers');
	            var t = newtraveller.title;           
	            var birthdate = newtraveller.birthdate;
	            if (moment.isMoment(birthdate)) {
	                // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
	                birthdate = birthdate.format('YYYY-MM-DD');
	            }
	
	            var currenttraveller = {title: newtraveller.title, email: newtraveller.email, mobile: newtraveller.mobile, first_name: newtraveller.first_name,
	                last_name: newtraveller.last_name, birthdate: birthdate, baseUrl: '', passport_number: newtraveller.passport_number, passport_place: newtraveller.passport_place
	            };
	
	            $.ajax({
	                context: this,
	                type: 'POST',
	                url: '/b2c/traveler/create',
	                dataType: 'json',
	                data: {'data': JSON.stringify(currenttraveller)},
	                success: function (idd) {
	                    console.log(idd);
	                    if(idd.error){
	                        this.set('error', idd.error);
	                    }else{
	                        this.set('error', null);
	                    currenttraveller.id = idd.traveler_id;
	                    travellers.push(currenttraveller);
	                    this.get('mytraveller').set('travellers', travellers);
	                    this.get('mytraveller').set('currentTraveller', currenttraveller);
	                    this.get('mytraveller').set('currentTravellerId', currenttraveller.id);
	                    this.get('mytraveller').set('add', false);}
	                },
	                error:function(error){
	                    console.log(error);
	                    this.set('error', idd.error);
	                }
	            });
	
	
	        });
	
	        this.on('edit', function (event) {
	            //console.log("Inside Edit");
	            var newtraveller = this.get('mytraveller.currentTraveller');
	
	            console.log(this.get('mytraveller.currentTraveller'));
	            var travellers = this.get('mytraveller.travellers');
	            var t = newtraveller.title;
	            //var titles=_.cloneDeep(this.get('mytraveller').titles);
	            //var title;
	            // _.each(titles, function(i, k) { if (i.id==t) title=i.text; });
	            var birthdate = newtraveller.birthdate;
	            if (moment.isMoment(birthdate)) {
	                // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
	                birthdate = birthdate.format('YYYY-MM-DD');
	            }
	            var id = this.get('mytraveller.currentTraveller.id');
	            var currenttraveller = {id: id,title: newtraveller.title, email: newtraveller.email, mobile: newtraveller.mobile, first_name: newtraveller.first_name,
	                last_name: newtraveller.last_name, birthdate: birthdate, baseUrl: '', passport_number: newtraveller.passport_number, passport_place: newtraveller.passport_place
	            };
	           var update = function(arr, key, newval) {
	                        var match = _.find(arr, key);
	                        if(match)
	                          _.merge(match, newval);
	                            
	                      };
	           $.ajax({
	                context: this,
	                type: 'POST',
	                url: '/b2c/traveler/update/'+ _.parseInt(id),
	                dataType: 'json',
	                data: {'data': JSON.stringify(currenttraveller)},
	                success: function (idd) {
	                    if(idd.result=='success'){
	                    _.mixin({ '$update': update });
	                    _.$update(travellers, {id:id}, currenttraveller);
	                    //this.get('mytraveller').splice('travellers', index, 1);
	                    console.log(currenttraveller);
	                   // travellers.push(currenttraveller);
	                    //console.log(travellers);
	                    this.get('mytraveller').set('travellers', travellers);
	                    this.get('mytraveller').set('currentTraveller', currenttraveller);
	                    this.get('mytraveller').set('currentTravellerId', id);
	                    this.get('mytraveller').set('edit', false);
	                }
	                else {
	                        this.set('error', idd.message);
	                    }
	                }
	            });
	           
	            
	        });
	    },
	    submit: function () {
	
	        
	    },
	    addJourney: function () {
	        //  this.get('search').push('flights', { from: 2336, to: 627, depart_at: moment().endOf('month'), return_at: null});
	    },
	    oncomplete: function () {
	//        this.observe('mytraveller.currentTraveller', function(value) {
	//            console.log("currentTraveller changed ");
	//            //console.log(value);
	//            //this.get('mytraveller').set('currentTraveller', value);
	//        }, {init: false});
	//        this.observe('mytraveller.currentTravellerId', function(value) {
	//            //console.log("currentTravellerId changed ");
	//            //console.log(value);
	//            //this.get('mytraveller').set('currentTravellerId', value);
	//        }, {init: false});
	    }
	});

/***/ },

/***/ 284:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"form","a":{"action":"javascript:;","class":"ui form basic segment flight search"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":7,"e":"p","f":[{"t":2,"r":"error"}]}]}],"n":50,"r":"error"}," ",{"t":7,"e":"div","a":{"class":"ui grid"},"f":[{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Personal Details"]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Title"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"mytraveller.currentTraveller.title"}],"class":"fluid transparent","placeholder":"Title","options":[{"t":2,"x":{"r":["formatTitles","meta.titles"],"s":"_0(_1)"}}]},"f":[]}]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["First Name"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-input","a":{"name":"first_name","placeholder":"First Name","value":[{"t":2,"r":"mytraveller.currentTraveller.first_name"}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Last Name"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-input","a":{"name":"last_name","placeholder":"Last Name","value":[{"t":2,"r":"mytraveller.currentTraveller.last_name"}]},"f":[]}]}]}],"n":50,"x":{"r":["mytraveller.add","mytraveller.edit"],"s":"_0||_1"}}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Date of Birth:"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"mytraveller.currentTraveller.birthdate"}],"class":"fluid","large":"0","placeholder":"Date of Birth","changeyear":"1"},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Passport No:"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-input","a":{"name":"passport_place","placeholder":"Passport No","value":[{"t":2,"r":"mytraveller.currentTraveller.passport_number"}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Issued Place:"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"passport_place","placeholder":"Issued Place","value":[{"t":2,"r":"mytraveller.currentTraveller.passport_place"}]},"f":[]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Contact Details"]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Email Address:"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-email","a":{"name":"email","placeholder":"E-Mail","value":[{"t":2,"r":"mytraveller.currentTraveller.email"}]}}," "]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Mobile Number:"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-tel","a":{"name":"mobile","placeholder":"Mobile","value":[{"t":2,"r":"mytraveller.currentTraveller.mobile"}]}}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"one column row"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","v":{"click":"add"},"a":{"class":"ui button massive fluid"},"f":["Add Traveller"]}],"n":50,"r":"mytraveller.add"}," ",{"t":4,"f":[{"t":7,"e":"div","v":{"click":"edit"},"a":{"class":"ui button massive fluid"},"f":["Edit Traveller"]}," "],"n":50,"r":"mytraveller.edit"}]}]}]}]}]};

/***/ },

/***/ 285:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	        moment = __webpack_require__(43),
	        _ = __webpack_require__(29)
	        //,
	        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(286),
	    data: function () {
	
	        return {
	            //mytraveller:this.get('mytraveller'),
	            //mytraveller:new Mytraveller(),
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
	        }
	
	    },
	    sortOn: function (on) {
	        if (on == this.get('sortOn.0')) {
	            this.set('sortOn.1', -1 * this.get('sortOn.1'));
	        } else {
	            this.set('sortOn', [on, 1]);
	        }
	    },
	    oninit: function (options) {
	        
	        this.on('add', function (event) {
	
	            this.get('mytraveller').set('add', true);
	            this.get('mytraveller').set('currentTraveller', null);
	            //this.get('mytraveller').set('currentTraveller', _.last(_.filter(this.get('mytraveller').travellers, {'id': id})));
	
	        });
	        this.on('edit', function (event) {
	            this.set('mytraveller.edit',true);
	            this.update('mytraveller');
	            // console.log("Inside edit");
	            // console.log(this.get('mytraveller'));
	            //this.get('mytraveller').set('currentTravellerId', id);
	            //this.get('mytraveller').set('currentTraveller', _.last(_.filter(this.get('mytraveller').travellers, {'id': id})));
	
	        });
	        this.on('delete', function (event) {
	            var id = this.get('mytraveller').get('currentTravellerId');
	            $.ajax({
	                context: this,
	                type: 'POST',
	                url: '/b2c/traveler/delete/'+ _.parseInt(id),
	                dataType: 'json',
	                data: {'data': ''},
	                success: function (idd) {
	                    if(idd.result=='success'){
	                    var index = _.findIndex(this.get('mytraveller.travellers'), {'id': id});
	                    this.splice('mytraveller.travellers', index, 1);
	                    this.get('mytraveller').set('currentTraveller', _.first(this.get('mytraveller.travellers')));
	                    this.get('mytraveller').set('currentTravellerId', this.get('mytraveller.currentTraveller.id'));
	                }else{
	                    alert(idd.msg);
	                }
	                },
	                error:function(error){
	                    alert(error);
	                }
	            });
	
	
	            //  console.log('index '+_.findIndex(this.get('mytraveller').travellers, function(chr) {  return chr.id == id;}));
	            //  this.splice(this.get('mytraveller').travellers, _.findIndex(this.get('mytraveller').travellers, function(chr) {  return chr.id == id;}), 1);
	
	        });
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

/***/ 286:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"h1","f":["People you book travel for"]}," ",{"t":7,"e":"button","v":{"click":"add"},"a":{"class":"middle blue add-new"},"f":["Add New Traveller"]}," ",{"t":7,"e":"div","a":{"class":[{"t":4,"f":["ui segment loading"],"n":50,"r":"mytraveller.pending"}],"style":"min-height:50px"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"user-info"},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"mytraveller.currentTraveller.baseUrl"},"/themes/B2C/img/guest.png"],"alt":""}}," ",{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"x":{"r":["formatTitle","mytraveller.currentTraveller.title"],"s":"_0(_1)"}}," ",{"t":2,"r":"mytraveller.currentTraveller.first_name"}," ",{"t":2,"r":"mytraveller.currentTraveller.last_name"}]}," ",{"t":7,"e":"div","a":{"class":"customer-id"},"f":["Customer Id: ",{"t":2,"r":"mytraveller.currentTraveller.id"}]}," ",{"t":7,"e":"div","a":{"class":"phone"},"f":["Mobile No: ",{"t":2,"r":"mytraveller.currentTraveller.mobile"}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"button","v":{"click":"edit"},"a":{"class":"small gray"},"f":["Edit"]}," "]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Contact Details"]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Email Address:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.email"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Mobile Number:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.mobile"}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Personal Details"]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Date of Birth:"]}," ",{"t":7,"e":"td","f":[{"t":2,"x":{"r":["formatBirthDate","mytraveller.currentTraveller.birthdate"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Passport No:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.passport_number"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Issued Place:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.passport_place"}]}]}]}]}],"n":50,"r":"mytraveller.currentTraveller"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["No Traveller Added"]}]}],"r":"mytraveller.currentTraveller"}],"n":50,"x":{"r":["mytraveller.pending"],"s":"!_0"}}]}]};

/***/ },

/***/ 287:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	    moment = __webpack_require__(43),
	    _ = __webpack_require__(29),
	   Mytraveller = __webpack_require__(63)   
	    ;
	
	
	var t2m = function(time) {
	    var i = time.split(':');
	
	    return i[0]*60+i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(288),
	
	
	    data: function() {
	        return {        
	        }
	    },
	
	    oninit: function ( options ) {
	
	    },
	    mobileselect:function(id){
	        var view=this;
			//console.log('inside mobileselect');
	        $('.ui.dimmer').addClass('hideimp');
			$('body').removeClass('dimmable');
			$('body').removeClass('dimmed');
			$('body').removeClass('scrolling');
			$('body').removeAttr("style");
			
			$('.listtraveller').click(function(){
				$('.ui.dimmer').removeClass('hideimp');
				
				$('body').addClass('dimmable');
			$('body').addClass('dimmed');
			$('body').addClass('scrolling');
			//$('body').removeAttr('height');
				});
			
			
			    if(view.get('mytraveller.edit')){                
	                window.location.href='/b2c/traveler/mytravelers/'+id;                
	            }else{
	            this.get('mytraveller').set('edit',false);
	            this.get('mytraveller').set('add',false);
	            view.get('mytraveller').set('currentTraveller',null);            
	            view.get('mytraveller').set('currentTravellerId', id);
	            var ct=_.last(_.filter(view.get('mytraveller.travellers'), {'id': id}));
	            view.get('mytraveller').set('currentTraveller', ct);
	        
			
			
			}
			},
			
			 test:function(id){
	        var view=this;
	            if(view.get('mytraveller.edit')){                
	                window.location.href='/b2c/traveler/mytravelers/'+id;                
	            }else{
	            this.get('mytraveller').set('edit',false);
	            this.get('mytraveller').set('add',false);
	            view.get('mytraveller').set('currentTraveller',null);            
	            view.get('mytraveller').set('currentTravellerId', id);
	            var ct=_.last(_.filter(view.get('mytraveller.travellers'), {'id': id}));
	            view.get('mytraveller').set('currentTraveller', ct);
	        }	
	
	    },
		
	    oncomplete: function() {
	
	    }
	});

/***/ },

/***/ 288:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"right"},"f":[{"t":7,"e":"h2","f":["My Travellers"]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":["No Traveller Found."]}],"n":50,"x":{"r":["mytraveller.travellers.length"],"s":"_0==0"}}," ",{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"test","a":{"r":["id"],"s":"[_0]"}}},"a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["mytraveller.currentTraveller.id","id"],"s":"_0==_1"}}],"id":[{"t":2,"r":"id"}]},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"baseUrl"},"/themes/B2C/img/guest.png"],"alt":""}}," ",{"t":2,"r":"first_name"}," ",{"t":2,"r":"last_name"}]}],"n":52,"r":"mytraveller.travellers"}]}]};

/***/ }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvbWV0YS5qcz8zMzQ5KiIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanM/ZjZiNSoqKioiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanM/MGJiYSoqKioiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyLmpzP2U5ZjQqIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9lbWFpbC5qcz80OTQ2KioiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL21haWxjaGVjay9zcmMvbWFpbGNoZWNrLmpzPzRkNmYqKiIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vc3Bpbm5lci5qcz80MDljKiIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL3NwaW5uZXIuaHRtbD9hMTU3KiIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vdGVsLmpzP2Y1Y2EiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL2ludGwtdGVsLWlucHV0L2J1aWxkL2pzL2ludGxUZWxJbnB1dC5qcz9mYjNjIiwid2VicGFjazovLy8uL2xlc3Mvd2ViL21vZHVsZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIubGVzcz82NzliIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbXl0cmF2ZWxsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvdHJhdmVsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci9mb3JtLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9teXRyYXZlbGxlci9mb3JtLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci92aWV3LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9teXRyYXZlbGxlci92aWV3Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci9saXN0LmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9teXRyYXZlbGxlci9saXN0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsRUFBQzs7QUFFRDtBQUNBLHNCQUFxQixXQUFXO0FBQ2hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQywyQkFBMkIsRUFBRTtBQUMvRDtBQUNBO0FBQ0EsY0FBYTtBQUNiLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE1BQUs7QUFDTDs7QUFFQSx1Qjs7Ozs7OztBQ2pEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQyxNQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU07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QkFBeUI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLHdCQUF3QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQixjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUEwQyxFQUFFLHFDQUFxQyxjQUFjLHVDQUF1QyxFQUFFLEc7Ozs7Ozs7QUNBejFFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsaUI7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUEsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7OztBQUdKLHdDO0FBQ0Esc0U7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLGtFO0FBQ0E7QUFDQSx5RUFBd0UsU0FBUztBQUNqRjs7OztBQUlBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsOEM7QUFDQSxzRTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0Esa0U7QUFDQTtBQUNBLHlFQUF3RSxTQUFTO0FBQ2pGO0FBQ0EsVTs7QUFFQSxNQUFLOztBQUVMOztBQUVBO0FBQ0EsRUFBQyxFOzs7Ozs7O0FDaEZELGlCQUFnQixZQUFZLHFCQUFxQixnQkFBZ0IsT0FBTyxxQ0FBcUMsTUFBTSxZQUFZLHFCQUFxQixlQUFlLDZCQUE2QixjQUFjLG1EQUFtRCxNQUFNLFlBQVkscUJBQXFCLFNBQVMsZ0JBQWdCLHdCQUF3QixNQUFNLGtCQUFrQixpQ0FBaUMsMkRBQTJELFNBQVMsZUFBZSxFQUFFLE9BQU8scUJBQXFCLFFBQVEsb0JBQW9CLHdDQUF3QyxNQUFNLHVCQUF1QixNQUFNLHNCQUFzQixFQUFFLHNDQUFzQyxFQUFFLEciLCJmaWxlIjoianMvbXl0cmF2ZWxsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIFZpZXcgPSByZXF1aXJlKCdjb3JlL3N0b3JlJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gVmlldy5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk1ldGEucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gbmV3IE1ldGEoe2RhdGE6IGRhdGF9KTtcclxufTtcclxuXHJcbk1ldGEuZmV0Y2ggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL3RyYXZlbGVyL21ldGEnKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoTWV0YS5wYXJzZShkYXRhKSk7IH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG52YXIgaW5zdGFuY2UgPSBudWxsO1xyXG5NZXRhLmluc3RhbmNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdGFuY2UgPSBNZXRhLmZldGNoKCk7XHJcbiAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9tZXRhLmpzXG4gKiogbW9kdWxlIGlkID0gNThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDdcbiAqKi8iLCIvLyAgICAgVmFsaWRhdGUuanMgMC43LjFcblxuLy8gICAgIChjKSAyMDEzLTIwMTUgTmlja2xhcyBBbnNtYW4sIDIwMTMgV3JhcHBcbi8vICAgICBWYWxpZGF0ZS5qcyBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8vICAgICBGb3IgYWxsIGRldGFpbHMgYW5kIGRvY3VtZW50YXRpb246XG4vLyAgICAgaHR0cDovL3ZhbGlkYXRlanMub3JnL1xuXG4oZnVuY3Rpb24oZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVGhlIG1haW4gZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzLlxuICAvLyBUaGUgb3B0aW9ucyBhcmUgdGhlIGZvbGxvd2luZzpcbiAgLy8gICAtIGZvcm1hdCAoc3RyaW5nKSAtIEFuIG9wdGlvbiB0aGF0IGNvbnRyb2xzIGhvdyB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZm9ybWF0dGVkXG4gIC8vICAgICAqIGZsYXQgLSBSZXR1cm5zIGEgZmxhdCBhcnJheSBvZiBqdXN0IHRoZSBlcnJvciBtZXNzYWdlc1xuICAvLyAgICAgKiBncm91cGVkIC0gUmV0dXJucyB0aGUgbWVzc2FnZXMgZ3JvdXBlZCBieSBhdHRyaWJ1dGUgKGRlZmF1bHQpXG4gIC8vICAgICAqIGRldGFpbGVkIC0gUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcmF3IHZhbGlkYXRpb24gZGF0YVxuICAvLyAgIC0gZnVsbE1lc3NhZ2VzIChib29sZWFuKSAtIElmIGB0cnVlYCAoZGVmYXVsdCkgdGhlIGF0dHJpYnV0ZSBuYW1lIGlzIHByZXBlbmRlZCB0byB0aGUgZXJyb3IuXG4gIC8vXG4gIC8vIFBsZWFzZSBub3RlIHRoYXQgdGhlIG9wdGlvbnMgYXJlIGFsc28gcGFzc2VkIHRvIGVhY2ggdmFsaWRhdG9yLlxuICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucylcbiAgICAgICwgYXR0clxuICAgICAgLCB2YWxpZGF0b3I7XG5cbiAgICBmb3IgKGF0dHIgaW4gcmVzdWx0cykge1xuICAgICAgZm9yICh2YWxpZGF0b3IgaW4gcmVzdWx0c1thdHRyXSkge1xuICAgICAgICBpZiAodi5pc1Byb21pc2UocmVzdWx0c1thdHRyXVt2YWxpZGF0b3JdKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVzZSB2YWxpZGF0ZS5hc3luYyBpZiB5b3Ugd2FudCBzdXBwb3J0IGZvciBwcm9taXNlc1wiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdGUucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHZhciB2ID0gdmFsaWRhdGU7XG5cbiAgLy8gQ29waWVzIG92ZXIgYXR0cmlidXRlcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZXMgdG8gYSBzaW5nbGUgZGVzdGluYXRpb24uXG4gIC8vIFZlcnkgbXVjaCBzaW1pbGFyIHRvIHVuZGVyc2NvcmUncyBleHRlbmQuXG4gIC8vIFRoZSBmaXJzdCBhcmd1bWVudCBpcyB0aGUgdGFyZ2V0IG9iamVjdCBhbmQgdGhlIHJlbWFpbmluZyBhcmd1bWVudHMgd2lsbCBiZVxuICAvLyB1c2VkIGFzIHRhcmdldHMuXG4gIHYuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBhdHRyIGluIHNvdXJjZSkge1xuICAgICAgICBvYmpbYXR0cl0gPSBzb3VyY2VbYXR0cl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICB2LmV4dGVuZCh2YWxpZGF0ZSwge1xuICAgIC8vIFRoaXMgaXMgdGhlIHZlcnNpb24gb2YgdGhlIGxpYnJhcnkgYXMgYSBzZW12ZXIuXG4gICAgLy8gVGhlIHRvU3RyaW5nIGZ1bmN0aW9uIHdpbGwgYWxsb3cgaXQgdG8gYmUgY29lcmNlZCBpbnRvIGEgc3RyaW5nXG4gICAgdmVyc2lvbjoge1xuICAgICAgbWFqb3I6IDAsXG4gICAgICBtaW5vcjogNyxcbiAgICAgIHBhdGNoOiAxLFxuICAgICAgbWV0YWRhdGE6IG51bGwsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdi5mb3JtYXQoXCIle21ham9yfS4le21pbm9yfS4le3BhdGNofVwiLCB2LnZlcnNpb24pO1xuICAgICAgICBpZiAoIXYuaXNFbXB0eSh2LnZlcnNpb24ubWV0YWRhdGEpKSB7XG4gICAgICAgICAgdmVyc2lvbiArPSBcIitcIiArIHYudmVyc2lvbi5tZXRhZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQmVsb3cgaXMgdGhlIGRlcGVuZGVuY2llcyB0aGF0IGFyZSB1c2VkIGluIHZhbGlkYXRlLmpzXG5cbiAgICAvLyBUaGUgY29uc3RydWN0b3Igb2YgdGhlIFByb21pc2UgaW1wbGVtZW50YXRpb24uXG4gICAgLy8gSWYgeW91IGFyZSB1c2luZyBRLmpzLCBSU1ZQIG9yIGFueSBvdGhlciBBKyBjb21wYXRpYmxlIGltcGxlbWVudGF0aW9uXG4gICAgLy8gb3ZlcnJpZGUgdGhpcyBhdHRyaWJ1dGUgdG8gYmUgdGhlIGNvbnN0cnVjdG9yIG9mIHRoYXQgcHJvbWlzZS5cbiAgICAvLyBTaW5jZSBqUXVlcnkgcHJvbWlzZXMgYXJlbid0IEErIGNvbXBhdGlibGUgdGhleSB3b24ndCB3b3JrLlxuICAgIFByb21pc2U6IHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiID8gUHJvbWlzZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICAvLyBJZiBtb21lbnQgaXMgdXNlZCBpbiBub2RlLCBicm93c2VyaWZ5IGV0YyBwbGVhc2Ugc2V0IHRoaXMgYXR0cmlidXRlXG4gICAgLy8gbGlrZSB0aGlzOiBgdmFsaWRhdGUubW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbiAgICBtb21lbnQ6IHR5cGVvZiBtb21lbnQgIT09IFwidW5kZWZpbmVkXCIgPyBtb21lbnQgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgWERhdGU6IHR5cGVvZiBYRGF0ZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFhEYXRlIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIEVNUFRZX1NUUklOR19SRUdFWFA6IC9eXFxzKiQvLFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzIG9iamVjdC5cbiAgICAvLyBXaWxsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgZm9ybWF0OlxuICAgIC8vICAgICBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlIG5hbWU+XCIsIGVycm9yOiBcIjx2YWxpZGF0aW9uIHJlc3VsdD5cIn0sIC4uLl1cbiAgICBydW5WYWxpZGF0aW9uczogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW11cbiAgICAgICAgLCBhdHRyXG4gICAgICAgICwgdmFsaWRhdG9yTmFtZVxuICAgICAgICAsIHZhbHVlXG4gICAgICAgICwgdmFsaWRhdG9yc1xuICAgICAgICAsIHZhbGlkYXRvclxuICAgICAgICAsIHZhbGlkYXRvck9wdGlvbnNcbiAgICAgICAgLCBlcnJvcjtcblxuICAgICAgaWYgKHYuaXNEb21FbGVtZW50KGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSB2LmNvbGxlY3RGb3JtVmFsdWVzKGF0dHJpYnV0ZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29wcyB0aHJvdWdoIGVhY2ggY29uc3RyYWludHMsIGZpbmRzIHRoZSBjb3JyZWN0IHZhbGlkYXRvciBhbmQgcnVuIGl0LlxuICAgICAgZm9yIChhdHRyIGluIGNvbnN0cmFpbnRzKSB7XG4gICAgICAgIHZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgYXR0cik7XG4gICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBjb25zdHJhaW50cyBmb3IgYW4gYXR0cmlidXRlIHRvIGJlIGEgZnVuY3Rpb24uXG4gICAgICAgIC8vIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICB2YWxpZGF0b3JzID0gdi5yZXN1bHQoY29uc3RyYWludHNbYXR0cl0sIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG5cbiAgICAgICAgZm9yICh2YWxpZGF0b3JOYW1lIGluIHZhbGlkYXRvcnMpIHtcbiAgICAgICAgICB2YWxpZGF0b3IgPSB2LnZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG5cbiAgICAgICAgICBpZiAoIXZhbGlkYXRvcikge1xuICAgICAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChcIlVua25vd24gdmFsaWRhdG9yICV7bmFtZX1cIiwge25hbWU6IHZhbGlkYXRvck5hbWV9KTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG4gICAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIG9wdGlvbnMgdG8gYmUgYSBmdW5jdGlvbi4gVGhlIGZ1bmN0aW9uIHdpbGwgYmVcbiAgICAgICAgICAvLyBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdi5yZXN1bHQodmFsaWRhdG9yT3B0aW9ucywgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcbiAgICAgICAgICBpZiAoIXZhbGlkYXRvck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgYXR0cmlidXRlOiBhdHRyLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JOYW1lLFxuICAgICAgICAgICAgb3B0aW9uczogdmFsaWRhdG9yT3B0aW9ucyxcbiAgICAgICAgICAgIGVycm9yOiB2YWxpZGF0b3IuY2FsbCh2YWxpZGF0b3IsIHZhbHVlLCB2YWxpZGF0b3JPcHRpb25zLCBhdHRyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSxcblxuICAgIC8vIFRha2VzIHRoZSBvdXRwdXQgZnJvbSBydW5WYWxpZGF0aW9ucyBhbmQgY29udmVydHMgaXQgdG8gdGhlIGNvcnJlY3RcbiAgICAvLyBvdXRwdXQgZm9ybWF0LlxuICAgIHByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0czogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgZXJyb3JzID0gdi5wcnVuZUVtcHR5RXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmV4cGFuZE11bHRpcGxlRXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmNvbnZlcnRFcnJvck1lc3NhZ2VzKGVycm9ycywgb3B0aW9ucyk7XG5cbiAgICAgIHN3aXRjaCAob3B0aW9ucy5mb3JtYXQgfHwgXCJncm91cGVkXCIpIHtcbiAgICAgICAgY2FzZSBcImRldGFpbGVkXCI6XG4gICAgICAgICAgLy8gRG8gbm90aGluZyBtb3JlIHRvIHRoZSBlcnJvcnNcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZmxhdFwiOlxuICAgICAgICAgIGVycm9ycyA9IHYuZmxhdHRlbkVycm9yc1RvQXJyYXkoZXJyb3JzKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ3JvdXBlZFwiOlxuICAgICAgICAgIGVycm9ycyA9IHYuZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZShlcnJvcnMpO1xuICAgICAgICAgIGZvciAoYXR0ciBpbiBlcnJvcnMpIHtcbiAgICAgICAgICAgIGVycm9yc1thdHRyXSA9IHYuZmxhdHRlbkVycm9yc1RvQXJyYXkoZXJyb3JzW2F0dHJdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Iodi5mb3JtYXQoXCJVbmtub3duIGZvcm1hdCAle2Zvcm1hdH1cIiwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdi5pc0VtcHR5KGVycm9ycykgPyB1bmRlZmluZWQgOiBlcnJvcnM7XG4gICAgfSxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRpb25zIHdpdGggc3VwcG9ydCBmb3IgcHJvbWlzZXMuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiBhIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIHdoZW4gYWxsIHRoZVxuICAgIC8vIHZhbGlkYXRpb24gcHJvbWlzZXMgaGF2ZSBiZWVuIGNvbXBsZXRlZC5cbiAgICAvLyBJdCBjYW4gYmUgY2FsbGVkIGV2ZW4gaWYgbm8gdmFsaWRhdGlvbnMgcmV0dXJuZWQgYSBwcm9taXNlLlxuICAgIGFzeW5jOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LmFzeW5jLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHYud2FpdEZvclJlc3VsdHMocmVzdWx0cykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZXJyb3JzID0gdi5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUoYXR0cmlidXRlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2luZ2xlOiBmdW5jdGlvbih2YWx1ZSwgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5zaW5nbGUub3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgICBmb3JtYXQ6IFwiZmxhdFwiLFxuICAgICAgICBmdWxsTWVzc2FnZXM6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2KHtzaW5nbGU6IHZhbHVlfSwge3NpbmdsZTogY29uc3RyYWludHN9LCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGFsbCBwcm9taXNlcyBpbiB0aGUgcmVzdWx0cyBhcnJheVxuICAgIC8vIGFyZSBzZXR0bGVkLiBUaGUgcHJvbWlzZSByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gaXMgYWx3YXlzIHJlc29sdmVkLFxuICAgIC8vIG5ldmVyIHJlamVjdGVkLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gbW9kaWZpZXMgdGhlIGlucHV0IGFyZ3VtZW50LCBpdCByZXBsYWNlcyB0aGUgcHJvbWlzZXNcbiAgICAvLyB3aXRoIHRoZSB2YWx1ZSByZXR1cm5lZCBmcm9tIHRoZSBwcm9taXNlLlxuICAgIHdhaXRGb3JSZXN1bHRzOiBmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAvLyBDcmVhdGUgYSBzZXF1ZW5jZSBvZiBhbGwgdGhlIHJlc3VsdHMgc3RhcnRpbmcgd2l0aCBhIHJlc29sdmVkIHByb21pc2UuXG4gICAgICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgcmVzdWx0KSB7XG4gICAgICAgIC8vIElmIHRoaXMgcmVzdWx0IGlzbid0IGEgcHJvbWlzZSBza2lwIGl0IGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgaWYgKCF2LmlzUHJvbWlzZShyZXN1bHQuZXJyb3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVtby50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZXJyb3IudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIC8vIElmIGZvciBzb21lIHJlYXNvbiB0aGUgdmFsaWRhdG9yIHByb21pc2Ugd2FzIHJlamVjdGVkIGJ1dCBub1xuICAgICAgICAgICAgICAvLyBlcnJvciB3YXMgc3BlY2lmaWVkLlxuICAgICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgdi53YXJuKFwiVmFsaWRhdG9yIHByb21pc2Ugd2FzIHJlamVjdGVkIGJ1dCBkaWRuJ3QgcmV0dXJuIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0sIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocikgeyByKCk7IH0pKTsgLy8gQSByZXNvbHZlZCBwcm9taXNlXG4gICAgfSxcblxuICAgIC8vIElmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIGNhbGw6IGZ1bmN0aW9uIHRoZSBhbmQ6IGZ1bmN0aW9uIHJldHVybiB0aGUgdmFsdWVcbiAgICAvLyBvdGhlcndpc2UganVzdCByZXR1cm4gdGhlIHZhbHVlLiBBZGRpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhc1xuICAgIC8vIGFyZ3VtZW50cyB0byB0aGUgZnVuY3Rpb24uXG4gICAgLy8gRXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByZXN1bHQoJ2ZvbycpIC8vICdmb28nXG4gICAgLy8gcmVzdWx0KE1hdGgubWF4LCAxLCAyKSAvLyAyXG4gICAgLy8gYGBgXG4gICAgcmVzdWx0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgdmFsdWUgaXMgYSBudW1iZXIuIFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgY29uc2lkZXIgTmFOIGFcbiAgICAvLyBudW1iZXIgbGlrZSBtYW55IG90aGVyIGBpc051bWJlcmAgZnVuY3Rpb25zIGRvLlxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIG5vdCBhIGZ1bmN0aW9uXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG4gICAgfSxcblxuICAgIC8vIEEgc2ltcGxlIGNoZWNrIHRvIHZlcmlmeSB0aGF0IHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLiBVc2VzIGBpc051bWJlcmBcbiAgICAvLyBhbmQgYSBzaW1wbGUgbW9kdWxvIGNoZWNrLlxuICAgIGlzSW50ZWdlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LmlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAlIDEgPT09IDA7XG4gICAgfSxcblxuICAgIC8vIFVzZXMgdGhlIGBPYmplY3RgIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhbiBvYmplY3QuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gICAgfSxcblxuICAgIC8vIFNpbXBseSBjaGVja3MgaWYgdGhlIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhIGRhdGVcbiAgICBpc0RhdGU6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERhdGU7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBgbnVsbGAgb2YgYHVuZGVmaW5lZGBcbiAgICBpc0RlZmluZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiBvYmogIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIHByb21pc2UuIEFueXRoaW5nIHdpdGggYSBgdGhlbmBcbiAgICAvLyBmdW5jdGlvbiBpcyBjb25zaWRlcmVkIGEgcHJvbWlzZS5cbiAgICBpc1Byb21pc2U6IGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiAhIXAgJiYgdi5pc0Z1bmN0aW9uKHAudGhlbik7XG4gICAgfSxcblxuICAgIGlzRG9tRWxlbWVudDogZnVuY3Rpb24obykge1xuICAgICAgaWYgKCFvKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2LmlzRnVuY3Rpb24oby5xdWVyeVNlbGVjdG9yQWxsKSB8fCAhdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChkb2N1bWVudCkgJiYgbyA9PT0gZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM4NDM4MC82OTkzMDRcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbyAmJlxuICAgICAgICAgIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgbyAhPT0gbnVsbCAmJlxuICAgICAgICAgIG8ubm9kZVR5cGUgPT09IDEgJiZcbiAgICAgICAgICB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gXCJzdHJpbmdcIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICAvLyBOdWxsIGFuZCB1bmRlZmluZWQgYXJlIGVtcHR5XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZnVuY3Rpb25zIGFyZSBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hpdGVzcGFjZSBvbmx5IHN0cmluZ3MgYXJlIGVtcHR5XG4gICAgICBpZiAodi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHYuRU1QVFlfU1RSSU5HX1JFR0VYUC50ZXN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIGFycmF5cyB3ZSB1c2UgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgaWYgKHYuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgICAgIH1cblxuICAgICAgLy8gRGF0ZXMgaGF2ZSBubyBhdHRyaWJ1dGVzIGJ1dCBhcmVuJ3QgZW1wdHlcbiAgICAgIGlmICh2LmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBmaW5kIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eSB3ZSBjb25zaWRlciBpdCBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICBmb3IgKGF0dHIgaW4gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gRm9ybWF0cyB0aGUgc3BlY2lmaWVkIHN0cmluZ3Mgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzIGxpa2Ugc286XG4gICAgLy8gYGBgXG4gICAgLy8gZm9ybWF0KFwiRm9vOiAle2Zvb31cIiwge2ZvbzogXCJiYXJcIn0pIC8vIFwiRm9vIGJhclwiXG4gICAgLy8gYGBgXG4gICAgLy8gSWYgeW91IHdhbnQgdG8gd3JpdGUgJXsuLi59IHdpdGhvdXQgaGF2aW5nIGl0IHJlcGxhY2VkIHNpbXBseVxuICAgIC8vIHByZWZpeCBpdCB3aXRoICUgbGlrZSB0aGlzIGBGb286ICUle2Zvb31gIGFuZCBpdCB3aWxsIGJlIHJldHVybmVkXG4gICAgLy8gYXMgYFwiRm9vOiAle2Zvb31cImBcbiAgICBmb3JtYXQ6IHYuZXh0ZW5kKGZ1bmN0aW9uKHN0ciwgdmFscykge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHYuZm9ybWF0LkZPUk1BVF9SRUdFWFAsIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgaWYgKG0xID09PSAnJScpIHtcbiAgICAgICAgICByZXR1cm4gXCIle1wiICsgbTIgKyBcIn1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHNbbTJdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwge1xuICAgICAgLy8gRmluZHMgJXtrZXl9IHN0eWxlIHBhdHRlcm5zIGluIHRoZSBnaXZlbiBzdHJpbmdcbiAgICAgIEZPUk1BVF9SRUdFWFA6IC8oJT8pJVxceyhbXlxcfV0rKVxcfS9nXG4gICAgfSksXG5cbiAgICAvLyBcIlByZXR0aWZpZXNcIiB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgIC8vIFByZXR0aWZ5aW5nIG1lYW5zIHJlcGxhY2luZyBbLlxcXy1dIHdpdGggc3BhY2VzIGFzIHdlbGwgYXMgc3BsaXR0aW5nXG4gICAgLy8gY2FtZWwgY2FzZSB3b3Jkcy5cbiAgICBwcmV0dGlmeTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAodi5pc051bWJlcihzdHIpKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMiBkZWNpbWFscyByb3VuZCBpdCB0byB0d29cbiAgICAgICAgaWYgKChzdHIgKiAxMDApICUgMSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgc3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KE1hdGgucm91bmQoc3RyICogMTAwKSAvIDEwMCkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodi5pc0FycmF5KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5tYXAoZnVuY3Rpb24ocykgeyByZXR1cm4gdi5wcmV0dGlmeShzKTsgfSkuam9pbihcIiwgXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRW5zdXJlIHRoZSBzdHJpbmcgaXMgYWN0dWFsbHkgYSBzdHJpbmdcbiAgICAgIHN0ciA9IFwiXCIgKyBzdHI7XG5cbiAgICAgIHJldHVybiBzdHJcbiAgICAgICAgLy8gU3BsaXRzIGtleXMgc2VwYXJhdGVkIGJ5IHBlcmlvZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbXlxcc10pXFwuKFteXFxzXSkvZywgJyQxICQyJylcbiAgICAgICAgLy8gUmVtb3ZlcyBiYWNrc2xhc2hlc1xuICAgICAgICAucmVwbGFjZSgvXFxcXCsvZywgJycpXG4gICAgICAgIC8vIFJlcGxhY2VzIC0gYW5kIC0gd2l0aCBzcGFjZVxuICAgICAgICAucmVwbGFjZSgvW18tXS9nLCAnICcpXG4gICAgICAgIC8vIFNwbGl0cyBjYW1lbCBjYXNlZCB3b3Jkc1xuICAgICAgICAucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgbTEgKyBcIiBcIiArIG0yLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cbiAgICBzdHJpbmdpZnlWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LnByZXR0aWZ5KHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKG9iaiwgdmFsdWUpIHtcbiAgICAgIGlmICghdi5pc0RlZmluZWQob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUgaW4gb2JqO1xuICAgIH0sXG5cbiAgICBnZXREZWVwT2JqZWN0VmFsdWU6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCkge1xuICAgICAgaWYgKCF2LmlzT2JqZWN0KG9iaikgfHwgIXYuaXNTdHJpbmcoa2V5cGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGtleSA9IFwiXCJcbiAgICAgICAgLCBpXG4gICAgICAgICwgZXNjYXBlID0gZmFsc2U7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlwYXRoLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5cGF0aFtpXSkge1xuICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICcuJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgICBvYmogPSBvYmpba2V5XTtcbiAgICAgICAgICAgICAga2V5ID0gXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ1xcXFwnOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICdcXFxcJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGtleSArPSBrZXlwYXRoW2ldO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNEZWZpbmVkKG9iaikgJiYga2V5IGluIG9iaikge1xuICAgICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBUaGlzIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYWxsIHRoZSB2YWx1ZXMgb2YgdGhlIGZvcm0uXG4gICAgLy8gSXQgdXNlcyB0aGUgaW5wdXQgbmFtZSBhcyBrZXkgYW5kIHRoZSB2YWx1ZSBhcyB2YWx1ZVxuICAgIC8vIFNvIGZvciBleGFtcGxlIHRoaXM6XG4gICAgLy8gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImVtYWlsXCIgdmFsdWU9XCJmb29AYmFyLmNvbVwiIC8+XG4gICAgLy8gd291bGQgcmV0dXJuOlxuICAgIC8vIHtlbWFpbDogXCJmb29AYmFyLmNvbVwifVxuICAgIGNvbGxlY3RGb3JtVmFsdWVzOiBmdW5jdGlvbihmb3JtLCBvcHRpb25zKSB7XG4gICAgICB2YXIgdmFsdWVzID0ge31cbiAgICAgICAgLCBpXG4gICAgICAgICwgaW5wdXRcbiAgICAgICAgLCBpbnB1dHNcbiAgICAgICAgLCB2YWx1ZTtcblxuICAgICAgaWYgKCFmb3JtKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcblxuICAgICAgICBpZiAodi5pc0RlZmluZWQoaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZ25vcmVkXCIpKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0LnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuYXR0cmlidXRlcy52YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2lucHV0Lm5hbWVdIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gaW5wdXQuY2hlY2tlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwic2VsZWN0W25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoaW5wdXQub3B0aW9uc1tpbnB1dC5zZWxlY3RlZEluZGV4XS52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIHZhbHVlc1tpbnB1dC5uYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH0sXG5cbiAgICBzYW5pdGl6ZUZvcm1WYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnRyaW0gJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm51bGxpZnkgIT09IGZhbHNlICYmIHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICghdi5pc1N0cmluZyhzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSBhbGwgZXJyb3JzIHdobydzIGVycm9yIGF0dHJpYnV0ZSBpcyBlbXB0eSAobnVsbCBvciB1bmRlZmluZWQpXG4gICAgcHJ1bmVFbXB0eUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzLmZpbHRlcihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZXR1cm4gIXYuaXNFbXB0eShlcnJvci5lcnJvcik7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gSW5cbiAgICAvLyBbe2Vycm9yOiBbXCJlcnIxXCIsIFwiZXJyMlwiXSwgLi4ufV1cbiAgICAvLyBPdXRcbiAgICAvLyBbe2Vycm9yOiBcImVycjFcIiwgLi4ufSwge2Vycm9yOiBcImVycjJcIiwgLi4ufV1cbiAgICAvL1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzIGluIGFuIGVycm9yIHdpdGggbXVsdGlwbGUgbWVzc2FnZXMgYXJlIGR1cGxpY2F0ZWRcbiAgICAvLyB3aGVuIGV4cGFuZGluZyB0aGUgZXJyb3JzLlxuICAgIGV4cGFuZE11bHRpcGxlRXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgZXJyb3JzIHdpdGhvdXQgYSBtZXNzYWdlXG4gICAgICAgIGlmICh2LmlzQXJyYXkoZXJyb3IuZXJyb3IpKSB7XG4gICAgICAgICAgZXJyb3IuZXJyb3IuZm9yRWFjaChmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvciwge2Vycm9yOiBtc2d9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0LnB1c2goZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnRzIHRoZSBlcnJvciBtZXNhZ2VzIGJ5IHByZXBlbmRpbmcgdGhlIGF0dHJpYnV0ZSBuYW1lIHVubGVzcyB0aGVcbiAgICAvLyBtZXNzYWdlIGlzIHByZWZpeGVkIGJ5IF5cbiAgICBjb252ZXJ0RXJyb3JNZXNzYWdlczogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3JJbmZvKSB7XG4gICAgICAgIHZhciBlcnJvciA9IGVycm9ySW5mby5lcnJvcjtcblxuICAgICAgICBpZiAoZXJyb3JbMF0gPT09ICdeJykge1xuICAgICAgICAgIGVycm9yID0gZXJyb3Iuc2xpY2UoMSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5mdWxsTWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgZXJyb3IgPSB2LmNhcGl0YWxpemUodi5wcmV0dGlmeShlcnJvckluZm8uYXR0cmlidXRlKSkgKyBcIiBcIiArIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gZXJyb3IucmVwbGFjZSgvXFxcXFxcXi9nLCBcIl5cIik7XG4gICAgICAgIGVycm9yID0gdi5mb3JtYXQoZXJyb3IsIHt2YWx1ZTogdi5zdHJpbmdpZnlWYWx1ZShlcnJvckluZm8udmFsdWUpfSk7XG4gICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvckluZm8sIHtlcnJvcjogZXJyb3J9KSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyB7XCI8YXR0cmlidXRlTmFtZT5cIjogW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dfVxuICAgIGdyb3VwRXJyb3JzQnlBdHRyaWJ1dGU6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IHt9O1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgdmFyIGxpc3QgPSByZXRbZXJyb3IuYXR0cmlidXRlXTtcbiAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICBsaXN0LnB1c2goZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldFtlcnJvci5hdHRyaWJ1dGVdID0gW2Vycm9yXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2Vycm9yOiBcIjxtZXNzYWdlIDE+XCIsIC4uLn0sIHtlcnJvcjogXCI8bWVzc2FnZSAyPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyBbXCI8bWVzc2FnZSAxPlwiLCBcIjxtZXNzYWdlIDI+XCJdXG4gICAgZmxhdHRlbkVycm9yc1RvQXJyYXk6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5tYXAoZnVuY3Rpb24oZXJyb3IpIHsgcmV0dXJuIGVycm9yLmVycm9yOyB9KTtcbiAgICB9LFxuXG4gICAgZXhwb3NlTW9kdWxlOiBmdW5jdGlvbih2YWxpZGF0ZSwgcm9vdCwgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgICAgIGlmIChleHBvcnRzKSB7XG4gICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB2YWxpZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290LnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICAgIGlmICh2YWxpZGF0ZS5pc0Z1bmN0aW9uKGRlZmluZSkgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGU7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhcm46IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXJyb3I6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFsaWRhdGUudmFsaWRhdG9ycyA9IHtcbiAgICAvLyBQcmVzZW5jZSB2YWxpZGF0ZXMgdGhhdCB0aGUgdmFsdWUgaXNuJ3QgZW1wdHlcbiAgICBwcmVzZW5jZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiY2FuJ3QgYmUgYmxhbmtcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxlbmd0aDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSkge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGlzID0gb3B0aW9ucy5pc1xuICAgICAgICAsIG1heGltdW0gPSBvcHRpb25zLm1heGltdW1cbiAgICAgICAgLCBtaW5pbXVtID0gb3B0aW9ucy5taW5pbXVtXG4gICAgICAgICwgdG9rZW5pemVyID0gb3B0aW9ucy50b2tlbml6ZXIgfHwgZnVuY3Rpb24odmFsKSB7IHJldHVybiB2YWw7IH1cbiAgICAgICAgLCBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXTtcblxuICAgICAgdmFsdWUgPSB0b2tlbml6ZXIodmFsdWUpO1xuICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgIGlmKCF2LmlzTnVtYmVyKGxlbmd0aCkpIHtcbiAgICAgICAgdi5lcnJvcih2LmZvcm1hdChcIkF0dHJpYnV0ZSAle2F0dHJ9IGhhcyBhIG5vbiBudW1lcmljIHZhbHVlIGZvciBgbGVuZ3RoYFwiLCB7YXR0cjogYXR0cmlidXRlfSkpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJoYXMgYW4gaW5jb3JyZWN0IGxlbmd0aFwiO1xuICAgICAgfVxuXG4gICAgICAvLyBJcyBjaGVja3NcbiAgICAgIGlmICh2LmlzTnVtYmVyKGlzKSAmJiBsZW5ndGggIT09IGlzKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICB0aGlzLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgXCJpcyB0aGUgd3JvbmcgbGVuZ3RoIChzaG91bGQgYmUgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IGlzfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtaW5pbXVtKSAmJiBsZW5ndGggPCBtaW5pbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vU2hvcnQgfHxcbiAgICAgICAgICB0aGlzLnRvb1Nob3J0IHx8XG4gICAgICAgICAgXCJpcyB0b28gc2hvcnQgKG1pbmltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1pbmltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1heGltdW0pICYmIGxlbmd0aCA+IG1heGltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29Mb25nIHx8XG4gICAgICAgICAgdGhpcy50b29Mb25nIHx8XG4gICAgICAgICAgXCJpcyB0b28gbG9uZyAobWF4aW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWF4aW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVtZXJpY2FsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVycm9ycyA9IFtdXG4gICAgICAgICwgbmFtZVxuICAgICAgICAsIGNvdW50XG4gICAgICAgICwgY2hlY2tzID0ge1xuICAgICAgICAgICAgZ3JlYXRlclRoYW46ICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPiBjOyB9LFxuICAgICAgICAgICAgZ3JlYXRlclRoYW5PckVxdWFsVG86IGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPj0gYzsgfSxcbiAgICAgICAgICAgIGVxdWFsVG86ICAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID09PSBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW46ICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPCBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW5PckVxdWFsVG86ICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPD0gYzsgfVxuICAgICAgICAgIH07XG5cbiAgICAgIC8vIENvZXJjZSB0aGUgdmFsdWUgdG8gYSBudW1iZXIgdW5sZXNzIHdlJ3JlIGJlaW5nIHN0cmljdC5cbiAgICAgIGlmIChvcHRpb25zLm5vU3RyaW5ncyAhPT0gdHJ1ZSAmJiB2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQncyBub3QgYSBudW1iZXIgd2Ugc2hvdWxkbid0IGNvbnRpbnVlIHNpbmNlIGl0IHdpbGwgY29tcGFyZSBpdC5cbiAgICAgIGlmICghdi5pc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaXMgbm90IGEgbnVtYmVyXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIFNhbWUgbG9naWMgYXMgYWJvdmUsIHNvcnQgb2YuIERvbid0IGJvdGhlciB3aXRoIGNvbXBhcmlzb25zIGlmIHRoaXNcbiAgICAgIC8vIGRvZXNuJ3QgcGFzcy5cbiAgICAgIGlmIChvcHRpb25zLm9ubHlJbnRlZ2VyICYmICF2LmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdEludGVnZXIgIHx8IFwibXVzdCBiZSBhbiBpbnRlZ2VyXCI7XG4gICAgICB9XG5cbiAgICAgIGZvciAobmFtZSBpbiBjaGVja3MpIHtcbiAgICAgICAgY291bnQgPSBvcHRpb25zW25hbWVdO1xuICAgICAgICBpZiAodi5pc051bWJlcihjb3VudCkgJiYgIWNoZWNrc1tuYW1lXSh2YWx1ZSwgY291bnQpKSB7XG4gICAgICAgICAgLy8gVGhpcyBwaWNrcyB0aGUgZGVmYXVsdCBtZXNzYWdlIGlmIHNwZWNpZmllZFxuICAgICAgICAgIC8vIEZvciBleGFtcGxlIHRoZSBncmVhdGVyVGhhbiBjaGVjayB1c2VzIHRoZSBtZXNzYWdlIGZyb21cbiAgICAgICAgICAvLyB0aGlzLm5vdEdyZWF0ZXJUaGFuIHNvIHdlIGNhcGl0YWxpemUgdGhlIG5hbWUgYW5kIHByZXBlbmQgXCJub3RcIlxuICAgICAgICAgIHZhciBtc2cgPSB0aGlzW1wibm90XCIgKyB2LmNhcGl0YWxpemUobmFtZSldIHx8XG4gICAgICAgICAgICBcIm11c3QgYmUgJXt0eXBlfSAle2NvdW50fVwiO1xuXG4gICAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQobXNnLCB7XG4gICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICB0eXBlOiB2LnByZXR0aWZ5KG5hbWUpXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm9kZCAmJiB2YWx1ZSAlIDIgIT09IDEpIHtcbiAgICAgICAgZXJyb3JzLnB1c2godGhpcy5ub3RPZGQgfHwgXCJtdXN0IGJlIG9kZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmV2ZW4gJiYgdmFsdWUgJSAyICE9PSAwKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90RXZlbiB8fCBcIm11c3QgYmUgZXZlblwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRldGltZTogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXVxuICAgICAgICAsIGVhcmxpZXN0ID0gb3B0aW9ucy5lYXJsaWVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5lYXJsaWVzdCwgb3B0aW9ucykgOiBOYU5cbiAgICAgICAgLCBsYXRlc3QgPSBvcHRpb25zLmxhdGVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5sYXRlc3QsIG9wdGlvbnMpIDogTmFOO1xuXG4gICAgICB2YWx1ZSA9IHRoaXMucGFyc2UodmFsdWUsIG9wdGlvbnMpO1xuXG4gICAgICAvLyA4NjQwMDAwMCBpcyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgaW4gYSBkYXksIHRoaXMgaXMgdXNlZCB0byByZW1vdmVcbiAgICAgIC8vIHRoZSB0aW1lIGZyb20gdGhlIGRhdGVcbiAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgb3B0aW9ucy5kYXRlT25seSAmJiB2YWx1ZSAlIDg2NDAwMDAwICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcIm11c3QgYmUgYSB2YWxpZCBkYXRlXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oZWFybGllc3QpICYmIHZhbHVlIDwgZWFybGllc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29FYXJseSB8fCBcIm11c3QgYmUgbm8gZWFybGllciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQoZWFybGllc3QsIG9wdGlvbnMpfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4obGF0ZXN0KSAmJiB2YWx1ZSA+IGxhdGVzdCkge1xuICAgICAgICBlcnIgPSB0aGlzLnRvb0xhdGUgfHwgXCJtdXN0IGJlIG5vIGxhdGVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtkYXRlOiB0aGlzLmZvcm1hdChsYXRlc3QsIG9wdGlvbnMpfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGNvbnZlcnQgaW5wdXQgdG8gdGhlIG51bWJlclxuICAgICAgLy8gb2YgbWlsbGlzIHNpbmNlIHRoZSBlcG9jaC5cbiAgICAgIC8vIEl0IHNob3VsZCByZXR1cm4gTmFOIGlmIGl0J3Mgbm90IGEgdmFsaWQgZGF0ZS5cbiAgICAgIHBhcnNlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAodi5pc0Z1bmN0aW9uKHYuWERhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyB2LlhEYXRlKHZhbHVlLCB0cnVlKS5nZXRUaW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodi5pc0RlZmluZWQodi5tb21lbnQpKSB7XG4gICAgICAgICAgcmV0dXJuICt2Lm1vbWVudC51dGModmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfSxcbiAgICAgIC8vIEZvcm1hdHMgdGhlIGdpdmVuIHRpbWVzdGFtcC4gVXNlcyBJU084NjAxIHRvIGZvcm1hdCB0aGVtLlxuICAgICAgLy8gSWYgb3B0aW9ucy5kYXRlT25seSBpcyB0cnVlIHRoZW4gb25seSB0aGUgeWVhciwgbW9udGggYW5kIGRheSB3aWxsIGJlXG4gICAgICAvLyBvdXRwdXQuXG4gICAgICBmb3JtYXQ6IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IG9wdGlvbnMuZGF0ZUZvcm1hdDtcblxuICAgICAgICBpZiAodi5pc0Z1bmN0aW9uKHYuWERhdGUpKSB7XG4gICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IChvcHRpb25zLmRhdGVPbmx5ID8gXCJ5eXl5LU1NLWRkXCIgOiBcInl5eXktTU0tZGQgSEg6bW06c3NcIik7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYRGF0ZShkYXRlLCB0cnVlKS50b1N0cmluZyhmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwiWVlZWS1NTS1ERFwiIDogXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiB2Lm1vbWVudC51dGMoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWl0aGVyIFhEYXRlIG9yIG1vbWVudC5qcyB3YXMgZm91bmRcIik7XG4gICAgICB9XG4gICAgfSksXG4gICAgZGF0ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgb3B0aW9ucywge2RhdGVPbmx5OiB0cnVlfSk7XG4gICAgICByZXR1cm4gdi52YWxpZGF0b3JzLmRhdGV0aW1lLmNhbGwodi52YWxpZGF0b3JzLmRhdGV0aW1lLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSB8fCAob3B0aW9ucyBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgb3B0aW9ucyA9IHtwYXR0ZXJuOiBvcHRpb25zfTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBpbnZhbGlkXCJcbiAgICAgICAgLCBwYXR0ZXJuID0gb3B0aW9ucy5wYXR0ZXJuXG4gICAgICAgICwgbWF0Y2g7XG5cbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcocGF0dGVybikpIHtcbiAgICAgICAgcGF0dGVybiA9IG5ldyBSZWdFeHAob3B0aW9ucy5wYXR0ZXJuLCBvcHRpb25zLmZsYWdzKTtcbiAgICAgIH1cbiAgICAgIG1hdGNoID0gcGF0dGVybi5leGVjKHZhbHVlKTtcbiAgICAgIGlmICghbWF0Y2ggfHwgbWF0Y2hbMF0ubGVuZ3RoICE9IHZhbHVlLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluY2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcIl4le3ZhbHVlfSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGxpc3RcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBleGNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKCF2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiXiV7dmFsdWV9IGlzIHJlc3RyaWN0ZWRcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBlbWFpbDogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIG5vdCBhIHZhbGlkIGVtYWlsXCI7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuUEFUVEVSTi5leGVjKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBQQVRURVJOOiAvXlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXpdezIsfSQvaVxuICAgIH0pLFxuICAgIGVxdWFsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7YXR0cmlidXRlOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcImlzIG5vdCBlcXVhbCB0byAle2F0dHJpYnV0ZX1cIjtcblxuICAgICAgaWYgKHYuaXNFbXB0eShvcHRpb25zLmF0dHJpYnV0ZSkgfHwgIXYuaXNTdHJpbmcob3B0aW9ucy5hdHRyaWJ1dGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhdHRyaWJ1dGUgbXVzdCBiZSBhIG5vbiBlbXB0eSBzdHJpbmdcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciBvdGhlclZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgb3B0aW9ucy5hdHRyaWJ1dGUpXG4gICAgICAgICwgY29tcGFyYXRvciA9IG9wdGlvbnMuY29tcGFyYXRvciB8fCBmdW5jdGlvbih2MSwgdjIpIHtcbiAgICAgICAgICByZXR1cm4gdjEgPT09IHYyO1xuICAgICAgICB9O1xuXG4gICAgICBpZiAoIWNvbXBhcmF0b3IodmFsdWUsIG90aGVyVmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykpIHtcbiAgICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHthdHRyaWJ1dGU6IHYucHJldHRpZnkob3B0aW9ucy5hdHRyaWJ1dGUpfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhbGlkYXRlLmV4cG9zZU1vZHVsZSh2YWxpZGF0ZSwgdGhpcywgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpO1xufSkuY2FsbCh0aGlzLFxuICAgICAgICB0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBleHBvcnRzIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBtb2R1bGUgOiBudWxsLFxuICAgICAgICB0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGRlZmluZSA6IG51bGwpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3ZlbmRvci92YWxpZGF0ZS92YWxpZGF0ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDYwXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA0IDUgNiA3XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpOyB9O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSA2MVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgNCA1IDYgN1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgdmFsaWRhdGUgPSByZXF1aXJlKCd2YWxpZGF0ZScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBxdWVuZTogW10sXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGdldERhdGE9ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGdldERhdGExPWZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBkb2FqYXg9ZnVuY3Rpb24oZ2V0RGF0YSl7XHJcbiAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYjJjL3RyYXZlbGVyL2dldE15VHJhdmVsZXJzTGlzdCcsICBcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGdldERhdGEsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZ2V0RGF0YTFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgICAgIGRvYWpheChnZXREYXRhKTtcclxuICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVyOiB7aWQ6IDEsdGl0bGU6J01yLicsIGVtYWlsOiAncHJhc2hhbnRAZ21haWwuY29tJywgbW9iaWxlOiAnOTQxMjM1NzkyNicsICBmaXJzdF9uYW1lOiAnUHJhc2hhbnQnLCBcclxuICAgICAgICAgICAgICAgIGxhc3RfbmFtZTonS3VtYXInLGJpcnRoZGF0ZTonMjAwMS0wNS0zMCcsYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6JzM0MjEyMycscGFzc3BvcnRfcGxhY2U6J0luZGlhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjdXJyZW50VHJhdmVsbGVySWQ6MSxcclxuICAgICAgICAgICAgY2FiaW5UeXBlOiAxLFxyXG4gICAgICAgICAgICBhZGQ6ZmFsc2UsXHJcbiAgICAgICAgICAgIGVkaXQ6ZmFsc2UsXHJcbiAgICAgICAgICAgIHRpdGxlczpbe2lkOjEsdGV4dDonTXIuJ30se2lkOjIsdGV4dDonTXJzLid9LHtpZDozLHRleHQ6J01zLid9LHtpZDo0LHRleHQ6J01pc3MnfSx7aWQ6NSx0ZXh0OidNc3RyLid9LHtpZDo2LHRleHQ6J0luZi4nfV0sXHJcbiAgICAgICAgICAgIHBhc3NlbmdlcnM6IFsxLCAwLCAwXSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyczogW1xyXG4gICAgICAgICAgICAgICAgeyBpZDogMSx0aXRsZTonTXIuJywgZW1haWw6ICdwcmFzaGFudEBnbWFpbC5jb20nLCBtb2JpbGU6ICc5NDEyMzU3OTI2JyxwYXNzcG9ydF9udW1iZXI6JzI1NDIzNDInLHBhc3Nwb3J0X3BsYWNlOidJbmRpYScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6ICdQcmFzaGFudCcsIGxhc3RfbmFtZTonS3VtYXInLGJpcnRoZGF0ZTonMjAwMS0wNS0zMCcsYmFzZVVybDonJ30sXHJcbiAgICAgICAgICAgICAgICB7IGlkOiAyLHRpdGxlOidNci4nLCBlbWFpbDogJ01pY2hhZWxAZ21haWwuY29tJywgbW9iaWxlOiAnMTIzNDU2Nzg5MCcscGFzc3BvcnRfbnVtYmVyOiczMTIzMTIzJyxwYXNzcG9ydF9wbGFjZTonSW5kaWEnLCBcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnTWljaGFlbCcsIGxhc3RfbmFtZTonSmFpbicsYmlydGhkYXRlOicyMDA1LTAzLTAzJyxiYXNlVXJsOicnfSxcclxuICAgICAgICAgICAgICAgIHsgaWQ6IDMsdGl0bGU6J01yLicsIGVtYWlsOiAnYmVsYWlyQGdtYWlsLmNvbScsIG1vYmlsZTogJzEyMzQ1Njc4OTAnLHBhc3Nwb3J0X251bWJlcjonMTIzMTIzMScscGFzc3BvcnRfcGxhY2U6J0luZGlhJyxcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnQmVsYWlyJywgbGFzdF9uYW1lOidUcmF2ZWxzJyxiaXJ0aGRhdGU6JzIwMDItMDItMjAnLGJhc2VVcmw6Jyd9XHJcbiAgICAgICAgICAgIF0sXHJcblxyXG4gICAgICAgICAgICBwZW5kaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZXJyb3JzOiB7fSxcclxuICAgICAgICAgICAgcmVzdWx0czogW10sXHJcblxyXG4gICAgICAgICAgICBmaWx0ZXI6IHt9LFxyXG4gICAgICAgICAgICBmaWx0ZXJlZDoge30sXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgaWYodGhpcy5nZXQoKS5hZGQpeyAgICAgICAgXHJcbiAgICAgICAgdmFyIG5ld3RyYXZlbGxlcj1fLnBpY2sodGhpcy5nZXQoKSwgJ2N1cnJlbnRUcmF2ZWxsZXInKTsgXHJcbiAgICAgICAgdmFyIHRyYXZlbGxlcnM9dGhpcy5nZXQoKS50cmF2ZWxsZXJzO1xyXG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnRpdGxlO1xyXG4gICAgICAgIHZhciB0aXRsZXM9Xy5jbG9uZURlZXAodGhpcy5nZXQoKS50aXRsZXMpO1xyXG4gICAgICAgIHZhciB0aXRsZTtcclxuICAgICAgICAgXy5lYWNoKHRpdGxlcywgZnVuY3Rpb24oaSwgaykgeyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiA0LHRpdGxlOnRpdGxlLCBlbWFpbDogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZW1haWwsIG1vYmlsZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZmlyc3RfbmFtZSwgXHJcbiAgICAgICAgICAgICAgICBsYXN0X25hbWU6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubGFzdF9uYW1lLGJpcnRoZGF0ZTpuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyksYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyLHBhc3Nwb3J0X3BsYWNlOm5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnBhc3Nwb3J0X3BsYWNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsbGVycyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3RyYXZlbGxlcnMnLHRyYXZlbGxlcnMpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxjdXJyZW50dHJhdmVsbGVyKTtcclxuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcklkJyw0KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYodGhpcy5nZXQoKS5lZGl0KXtcclxuICAgICAgICB2YXIgbmV3dHJhdmVsbGVyPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcjsgXHJcbiAgICAgICAgdmFyIHRyYXZlbGxlcnM9dGhpcy5nZXQoKS50cmF2ZWxsZXJzO1xyXG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci50aXRsZTtcclxuICAgICAgICB2YXIgdGl0bGVzPV8uY2xvbmVEZWVwKHRoaXMuZ2V0KCkudGl0bGVzKTtcclxuICAgICAgICB2YXIgdGl0bGU7XHJcbiAgICAgICAgdmFyIGlkPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcklkO1xyXG4gICAgICAgICBfLmVhY2godGl0bGVzLCBmdW5jdGlvbihpLCBrKSB7IGNvbnNvbGUubG9nKGkpOyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcclxuICAgICAgXHJcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiBpZCx0aXRsZTp0aXRsZSwgZW1haWw6IG5ld3RyYXZlbGxlci5lbWFpbCwgbW9iaWxlOiBuZXd0cmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmZpcnN0X25hbWUsIFxyXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOm5ld3RyYXZlbGxlci5sYXN0X25hbWUsYmlydGhkYXRlOm5ld3RyYXZlbGxlci5iaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyksYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6bmV3dHJhdmVsbGVyLnBhc3Nwb3J0X251bWJlcixwYXNzcG9ydF9wbGFjZTpuZXd0cmF2ZWxsZXIucGFzc3BvcnRfcGxhY2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB2YXIgaW5kZXg9IF8uZmluZEluZGV4KHRoaXMuZ2V0KCkudHJhdmVsbGVycywgeyAnaWQnOiBpZH0pO1xyXG4gICAgICAgIHRoaXMuc3BsaWNlKCd0cmF2ZWxsZXJzJywgaW5kZXgsIDEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgIHRyYXZlbGxlcnMucHVzaChjdXJyZW50dHJhdmVsbGVyKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGxlcnMpO1xyXG4gICAgICAgIHRoaXMuc2V0KCd0cmF2ZWxsZXJzJyx0cmF2ZWxsZXJzKTtcclxuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcicsY3VycmVudHRyYXZlbGxlcik7ICAgICAgICBcclxuICAgIH1cclxuICAgICAgICB0aGlzLnNldCgnYWRkJyxmYWxzZSk7IFxyXG4gICAgICAgIHRoaXMuc2V0KCdlZGl0JyxmYWxzZSk7IFxyXG4gICAgICAgIC8vLFxyXG4gICAgIC8qICAgICAgIHNlYXJjaCA9IF8ucGljayh0aGlzLmdldCgpLCBbJ3RyaXBUeXBlJywgJ2NhYmluVHlwZScsICdwYXNzZW5nZXJzJ10pO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywge30pO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwZW5kaW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5xdWVuZSA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgXy5lYWNoKHRoaXMuZ2V0KCdmbGlnaHRzJyksIGZ1bmN0aW9uKGksIGspIHtcclxuICAgICAgICAgICAgdmlldy5xdWVuZVt2aWV3LnF1ZW5lLmxlbmd0aF0gPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9mbGlnaHRzL3NlYXJjaCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmV4dGVuZCh7fSwgc2VhcmNoLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogaS5mcm9tLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiBpLnRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydF9hdDogbW9tZW50LmlzTW9tZW50KGkuZGVwYXJ0X2F0KSA/IGkuZGVwYXJ0X2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5fYXQ6IG1vbWVudC5pc01vbWVudChpLnJldHVybl9hdCkgPyBpLnJldHVybl9hdC5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgdmlldy5pbXBvcnRSZXN1bHRzKGssIGRhdGEpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikgeyB2aWV3LmhhbmRsZUVycm9yKGssIHhocik7IH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJC53aGVuLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy5xdWVuZSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7IHZpZXcuc2V0KCdwZW5kaW5nJywgZmFsc2UpOyB2aWV3LnNldCgnZmluaXNoZWQnLCB0cnVlKTsgfSk7ICovXHJcbiAgICB9LFxyXG5cclxuICAgIGltcG9ydFJlc3VsdHM6IGZ1bmN0aW9uKGssIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQnLCB7fSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Jlc3VsdHMuJyArIGssIGRhdGEpO1xyXG5cclxuICAgICAgICB2YXIgcHJpY2VzID0gW10sXHJcbiAgICAgICAgICAgIGNhcnJpZXJzID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgIHByaWNlc1twcmljZXMubGVuZ3RoXSA9IGkucHJpY2U7XHJcbiAgICAgICAgICAgIGNhcnJpZXJzW2NhcnJpZXJzLmxlbmd0aF0gPSBpLml0aW5lcmFyeVswXS5zZWdtZW50c1swXS5jYXJyaWVyO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgY2FycmllcnMgPSBfLnVuaXF1ZShjYXJyaWVycywgJ2NvZGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2ZpbHRlcicsIHtcclxuICAgICAgICAgICAgcHJpY2VzOiBbTWF0aC5taW4uYXBwbHkobnVsbCwgcHJpY2VzKSwgTWF0aC5tYXguYXBwbHkobnVsbCwgcHJpY2VzKV0sXHJcbiAgICAgICAgICAgIGNhcnJpZXJzOiBjYXJyaWVyc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQuY2FycmllcnMnLCBfLm1hcChjYXJyaWVycywgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS5jb2RlOyB9KSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZUVycm9yOiBmdW5jdGlvbihrLCB4aHIpIHtcclxuXHJcbiAgICB9XHJcblxyXG5cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDYzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMyA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIG1haWxjaGVjayA9IHJlcXVpcmUoJ21haWxjaGVjaycpO1xyXG5cclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHlwZTogJ2VtYWlsJ1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcblxyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSlcclxuICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm1haWxjaGVjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGVkOiBmdW5jdGlvbihlbGVtZW50LCBzdWdnZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWdnZXN0aW9uJywgc3VnZ2VzdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VnZ2VzdGlvbicsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgY29ycmVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgdGhpcy5nZXQoJ3N1Z2dlc3Rpb24uZnVsbCcpKTtcclxuICAgICAgICB0aGlzLnNldCgnc3VnZ2VzdGlvbicsIG51bGwpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL2VtYWlsLmpzXG4gKiogbW9kdWxlIGlkID0gODBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDYgN1xuICoqLyIsIi8qXG4gKiBNYWlsY2hlY2sgaHR0cHM6Ly9naXRodWIuY29tL21haWxjaGVjay9tYWlsY2hlY2tcbiAqIEF1dGhvclxuICogRGVycmljayBLbyAoQGRlcnJpY2trbylcbiAqXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKlxuICogdiAxLjEuMVxuICovXG5cbnZhciBNYWlsY2hlY2sgPSB7XG4gIGRvbWFpblRocmVzaG9sZDogMixcbiAgc2Vjb25kTGV2ZWxUaHJlc2hvbGQ6IDIsXG4gIHRvcExldmVsVGhyZXNob2xkOiAyLFxuXG4gIGRlZmF1bHREb21haW5zOiBbJ21zbi5jb20nLCAnYmVsbHNvdXRoLm5ldCcsXG4gICAgJ3RlbHVzLm5ldCcsICdjb21jYXN0Lm5ldCcsICdvcHR1c25ldC5jb20uYXUnLFxuICAgICdlYXJ0aGxpbmsubmV0JywgJ3FxLmNvbScsICdza3kuY29tJywgJ2ljbG91ZC5jb20nLFxuICAgICdtYWMuY29tJywgJ3N5bXBhdGljby5jYScsICdnb29nbGVtYWlsLmNvbScsXG4gICAgJ2F0dC5uZXQnLCAneHRyYS5jby5ueicsICd3ZWIuZGUnLFxuICAgICdjb3gubmV0JywgJ2dtYWlsLmNvbScsICd5bWFpbC5jb20nLFxuICAgICdhaW0uY29tJywgJ3JvZ2Vycy5jb20nLCAndmVyaXpvbi5uZXQnLFxuICAgICdyb2NrZXRtYWlsLmNvbScsICdnb29nbGUuY29tJywgJ29wdG9ubGluZS5uZXQnLFxuICAgICdzYmNnbG9iYWwubmV0JywgJ2FvbC5jb20nLCAnbWUuY29tJywgJ2J0aW50ZXJuZXQuY29tJyxcbiAgICAnY2hhcnRlci5uZXQnLCAnc2hhdy5jYSddLFxuXG4gIGRlZmF1bHRTZWNvbmRMZXZlbERvbWFpbnM6IFtcInlhaG9vXCIsIFwiaG90bWFpbFwiLCBcIm1haWxcIiwgXCJsaXZlXCIsIFwib3V0bG9va1wiLCBcImdteFwiXSxcblxuICBkZWZhdWx0VG9wTGV2ZWxEb21haW5zOiBbXCJjb21cIiwgXCJjb20uYXVcIiwgXCJjb20udHdcIiwgXCJjYVwiLCBcImNvLm56XCIsIFwiY28udWtcIiwgXCJkZVwiLFxuICAgIFwiZnJcIiwgXCJpdFwiLCBcInJ1XCIsIFwibmV0XCIsIFwib3JnXCIsIFwiZWR1XCIsIFwiZ292XCIsIFwianBcIiwgXCJubFwiLCBcImtyXCIsIFwic2VcIiwgXCJldVwiLFxuICAgIFwiaWVcIiwgXCJjby5pbFwiLCBcInVzXCIsIFwiYXRcIiwgXCJiZVwiLCBcImRrXCIsIFwiaGtcIiwgXCJlc1wiLCBcImdyXCIsIFwiY2hcIiwgXCJub1wiLCBcImN6XCIsXG4gICAgXCJpblwiLCBcIm5ldFwiLCBcIm5ldC5hdVwiLCBcImluZm9cIiwgXCJiaXpcIiwgXCJtaWxcIiwgXCJjby5qcFwiLCBcInNnXCIsIFwiaHVcIl0sXG5cbiAgcnVuOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgb3B0cy5kb21haW5zID0gb3B0cy5kb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0RG9tYWlucztcbiAgICBvcHRzLnNlY29uZExldmVsRG9tYWlucyA9IG9wdHMuc2Vjb25kTGV2ZWxEb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0U2Vjb25kTGV2ZWxEb21haW5zO1xuICAgIG9wdHMudG9wTGV2ZWxEb21haW5zID0gb3B0cy50b3BMZXZlbERvbWFpbnMgfHwgTWFpbGNoZWNrLmRlZmF1bHRUb3BMZXZlbERvbWFpbnM7XG4gICAgb3B0cy5kaXN0YW5jZUZ1bmN0aW9uID0gb3B0cy5kaXN0YW5jZUZ1bmN0aW9uIHx8IE1haWxjaGVjay5zaWZ0M0Rpc3RhbmNlO1xuXG4gICAgdmFyIGRlZmF1bHRDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc3VsdCl7IHJldHVybiByZXN1bHQgfTtcbiAgICB2YXIgc3VnZ2VzdGVkQ2FsbGJhY2sgPSBvcHRzLnN1Z2dlc3RlZCB8fCBkZWZhdWx0Q2FsbGJhY2s7XG4gICAgdmFyIGVtcHR5Q2FsbGJhY2sgPSBvcHRzLmVtcHR5IHx8IGRlZmF1bHRDYWxsYmFjaztcblxuICAgIHZhciByZXN1bHQgPSBNYWlsY2hlY2suc3VnZ2VzdChNYWlsY2hlY2suZW5jb2RlRW1haWwob3B0cy5lbWFpbCksIG9wdHMuZG9tYWlucywgb3B0cy5zZWNvbmRMZXZlbERvbWFpbnMsIG9wdHMudG9wTGV2ZWxEb21haW5zLCBvcHRzLmRpc3RhbmNlRnVuY3Rpb24pO1xuXG4gICAgcmV0dXJuIHJlc3VsdCA/IHN1Z2dlc3RlZENhbGxiYWNrKHJlc3VsdCkgOiBlbXB0eUNhbGxiYWNrKClcbiAgfSxcblxuICBzdWdnZXN0OiBmdW5jdGlvbihlbWFpbCwgZG9tYWlucywgc2Vjb25kTGV2ZWxEb21haW5zLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24pIHtcbiAgICBlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB2YXIgZW1haWxQYXJ0cyA9IHRoaXMuc3BsaXRFbWFpbChlbWFpbCk7XG5cbiAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zICYmIHRvcExldmVsRG9tYWlucykge1xuICAgICAgICAvLyBJZiB0aGUgZW1haWwgaXMgYSB2YWxpZCAybmQtbGV2ZWwgKyB0b3AtbGV2ZWwsIGRvIG5vdCBzdWdnZXN0IGFueXRoaW5nLlxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zLmluZGV4T2YoZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbikgIT09IC0xICYmIHRvcExldmVsRG9tYWlucy5pbmRleE9mKGVtYWlsUGFydHMudG9wTGV2ZWxEb21haW4pICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNsb3Nlc3REb21haW4gPSB0aGlzLmZpbmRDbG9zZXN0RG9tYWluKGVtYWlsUGFydHMuZG9tYWluLCBkb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLmRvbWFpblRocmVzaG9sZCk7XG5cbiAgICBpZiAoY2xvc2VzdERvbWFpbikge1xuICAgICAgaWYgKGNsb3Nlc3REb21haW4gPT0gZW1haWxQYXJ0cy5kb21haW4pIHtcbiAgICAgICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgZXhhY3RseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWluczsgZG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24uXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGNsb3NlbHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnM7IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgcmV0dXJuIHsgYWRkcmVzczogZW1haWxQYXJ0cy5hZGRyZXNzLCBkb21haW46IGNsb3Nlc3REb21haW4sIGZ1bGw6IGVtYWlsUGFydHMuYWRkcmVzcyArIFwiQFwiICsgY2xvc2VzdERvbWFpbiB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGRvZXMgbm90IGNsb3NlbHkgbWF0Y2ggb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zXG4gICAgdmFyIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiA9IHRoaXMuZmluZENsb3Nlc3REb21haW4oZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbiwgc2Vjb25kTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLnNlY29uZExldmVsVGhyZXNob2xkKTtcbiAgICB2YXIgY2xvc2VzdFRvcExldmVsRG9tYWluICAgID0gdGhpcy5maW5kQ2xvc2VzdERvbWFpbihlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRoaXMudG9wTGV2ZWxUaHJlc2hvbGQpO1xuXG4gICAgaWYgKGVtYWlsUGFydHMuZG9tYWluKSB7XG4gICAgICB2YXIgY2xvc2VzdERvbWFpbiA9IGVtYWlsUGFydHMuZG9tYWluO1xuICAgICAgdmFyIHJ0cm4gPSBmYWxzZTtcblxuICAgICAgaWYoY2xvc2VzdFNlY29uZExldmVsRG9tYWluICYmIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHNlY29uZC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluLCBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4pO1xuICAgICAgICBydHJuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYoY2xvc2VzdFRvcExldmVsRG9tYWluICYmIGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHRvcC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluLCBjbG9zZXN0VG9wTGV2ZWxEb21haW4pO1xuICAgICAgICBydHJuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJ0cm4gPT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4geyBhZGRyZXNzOiBlbWFpbFBhcnRzLmFkZHJlc3MsIGRvbWFpbjogY2xvc2VzdERvbWFpbiwgZnVsbDogZW1haWxQYXJ0cy5hZGRyZXNzICsgXCJAXCIgKyBjbG9zZXN0RG9tYWluIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogVGhlIGVtYWlsIGFkZHJlc3MgZXhhY3RseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWlucywgZG9lcyBub3QgY2xvc2VseVxuICAgICAqIG1hdGNoIGFueSBkb21haW4gYW5kIGRvZXMgbm90IGFwcGVhciB0byBzaW1wbHkgaGF2ZSBhIG1pc3BlbGxlZCB0b3AtbGV2ZWwgZG9tYWluLFxuICAgICAqIG9yIGlzIGFuIGludmFsaWQgZW1haWwgYWRkcmVzczsgZG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24uXG4gICAgICovXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIGZpbmRDbG9zZXN0RG9tYWluOiBmdW5jdGlvbihkb21haW4sIGRvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRocmVzaG9sZCkge1xuICAgIHRocmVzaG9sZCA9IHRocmVzaG9sZCB8fCB0aGlzLnRvcExldmVsVGhyZXNob2xkO1xuICAgIHZhciBkaXN0O1xuICAgIHZhciBtaW5EaXN0ID0gOTk7XG4gICAgdmFyIGNsb3Nlc3REb21haW4gPSBudWxsO1xuXG4gICAgaWYgKCFkb21haW4gfHwgIWRvbWFpbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoIWRpc3RhbmNlRnVuY3Rpb24pIHtcbiAgICAgIGRpc3RhbmNlRnVuY3Rpb24gPSB0aGlzLnNpZnQzRGlzdGFuY2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkb21haW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZG9tYWluID09PSBkb21haW5zW2ldKSB7XG4gICAgICAgIHJldHVybiBkb21haW47XG4gICAgICB9XG4gICAgICBkaXN0ID0gZGlzdGFuY2VGdW5jdGlvbihkb21haW4sIGRvbWFpbnNbaV0pO1xuICAgICAgaWYgKGRpc3QgPCBtaW5EaXN0KSB7XG4gICAgICAgIG1pbkRpc3QgPSBkaXN0O1xuICAgICAgICBjbG9zZXN0RG9tYWluID0gZG9tYWluc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWluRGlzdCA8PSB0aHJlc2hvbGQgJiYgY2xvc2VzdERvbWFpbiAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNsb3Nlc3REb21haW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgc2lmdDNEaXN0YW5jZTogZnVuY3Rpb24oczEsIHMyKSB7XG4gICAgLy8gc2lmdDM6IGh0dHA6Ly9zaWRlcml0ZS5ibG9nc3BvdC5jb20vMjAwNy8wNC9zdXBlci1mYXN0LWFuZC1hY2N1cmF0ZS1zdHJpbmctZGlzdGFuY2UuaHRtbFxuICAgIGlmIChzMSA9PSBudWxsIHx8IHMxLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHMyID09IG51bGwgfHwgczIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHMyLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoczIgPT0gbnVsbCB8fCBzMi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBzMS5sZW5ndGg7XG4gICAgfVxuXG4gICAgdmFyIGMgPSAwO1xuICAgIHZhciBvZmZzZXQxID0gMDtcbiAgICB2YXIgb2Zmc2V0MiA9IDA7XG4gICAgdmFyIGxjcyA9IDA7XG4gICAgdmFyIG1heE9mZnNldCA9IDU7XG5cbiAgICB3aGlsZSAoKGMgKyBvZmZzZXQxIDwgczEubGVuZ3RoKSAmJiAoYyArIG9mZnNldDIgPCBzMi5sZW5ndGgpKSB7XG4gICAgICBpZiAoczEuY2hhckF0KGMgKyBvZmZzZXQxKSA9PSBzMi5jaGFyQXQoYyArIG9mZnNldDIpKSB7XG4gICAgICAgIGxjcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0MSA9IDA7XG4gICAgICAgIG9mZnNldDIgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heE9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgaWYgKChjICsgaSA8IHMxLmxlbmd0aCkgJiYgKHMxLmNoYXJBdChjICsgaSkgPT0gczIuY2hhckF0KGMpKSkge1xuICAgICAgICAgICAgb2Zmc2V0MSA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChjICsgaSA8IHMyLmxlbmd0aCkgJiYgKHMxLmNoYXJBdChjKSA9PSBzMi5jaGFyQXQoYyArIGkpKSkge1xuICAgICAgICAgICAgb2Zmc2V0MiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGMrKztcbiAgICB9XG4gICAgcmV0dXJuIChzMS5sZW5ndGggKyBzMi5sZW5ndGgpIC8yIC0gbGNzO1xuICB9LFxuXG4gIHNwbGl0RW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgdmFyIHBhcnRzID0gZW1haWwudHJpbSgpLnNwbGl0KCdAJyk7XG5cbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwYXJ0c1tpXSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkb21haW4gPSBwYXJ0cy5wb3AoKTtcbiAgICB2YXIgZG9tYWluUGFydHMgPSBkb21haW4uc3BsaXQoJy4nKTtcbiAgICB2YXIgc2xkID0gJyc7XG4gICAgdmFyIHRsZCA9ICcnO1xuXG4gICAgaWYgKGRvbWFpblBhcnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBkb2VzIG5vdCBoYXZlIGEgdG9wLWxldmVsIGRvbWFpblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZG9tYWluUGFydHMubGVuZ3RoID09IDEpIHtcbiAgICAgIC8vIFRoZSBhZGRyZXNzIGhhcyBvbmx5IGEgdG9wLWxldmVsIGRvbWFpbiAodmFsaWQgdW5kZXIgUkZDKVxuICAgICAgdGxkID0gZG9tYWluUGFydHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBhZGRyZXNzIGhhcyBhIGRvbWFpbiBhbmQgYSB0b3AtbGV2ZWwgZG9tYWluXG4gICAgICBzbGQgPSBkb21haW5QYXJ0c1swXTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZG9tYWluUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGxkICs9IGRvbWFpblBhcnRzW2ldICsgJy4nO1xuICAgICAgfVxuICAgICAgdGxkID0gdGxkLnN1YnN0cmluZygwLCB0bGQubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcExldmVsRG9tYWluOiB0bGQsXG4gICAgICBzZWNvbmRMZXZlbERvbWFpbjogc2xkLFxuICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICBhZGRyZXNzOiBwYXJ0cy5qb2luKCdAJylcbiAgICB9XG4gIH0sXG5cbiAgLy8gRW5jb2RlIHRoZSBlbWFpbCBhZGRyZXNzIHRvIHByZXZlbnQgWFNTIGJ1dCBsZWF2ZSBpbiB2YWxpZFxuICAvLyBjaGFyYWN0ZXJzLCBmb2xsb3dpbmcgdGhpcyBvZmZpY2lhbCBzcGVjOlxuICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0VtYWlsX2FkZHJlc3MjU3ludGF4XG4gIGVuY29kZUVtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgIHZhciByZXN1bHQgPSBlbmNvZGVVUkkoZW1haWwpO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCclMjAnLCAnICcpLnJlcGxhY2UoJyUyNScsICclJykucmVwbGFjZSgnJTVFJywgJ14nKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclNjAnLCAnYCcpLnJlcGxhY2UoJyU3QicsICd7JykucmVwbGFjZSgnJTdDJywgJ3wnKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclN0QnLCAnfScpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5cbi8vIEV4cG9ydCB0aGUgbWFpbGNoZWNrIG9iamVjdCBpZiB3ZSdyZSBpbiBhIENvbW1vbkpTIGVudiAoZS5nLiBOb2RlKS5cbi8vIE1vZGVsZWQgb2ZmIG9mIFVuZGVyc2NvcmUuanMuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haWxjaGVjaztcbn1cblxuLy8gU3VwcG9ydCBBTUQgc3R5bGUgZGVmaW5pdGlvbnNcbi8vIEJhc2VkIG9uIGpRdWVyeSAoc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE3OTU0ODgyLzEzMjI0MTApXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKFwibWFpbGNoZWNrXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWFpbGNoZWNrO1xuICB9KTtcbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qUXVlcnkpIHtcbiAgKGZ1bmN0aW9uKCQpe1xuICAgICQuZm4ubWFpbGNoZWNrID0gZnVuY3Rpb24ob3B0cykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKG9wdHMuc3VnZ2VzdGVkKSB7XG4gICAgICAgIHZhciBvbGRTdWdnZXN0ZWQgPSBvcHRzLnN1Z2dlc3RlZDtcbiAgICAgICAgb3B0cy5zdWdnZXN0ZWQgPSBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICBvbGRTdWdnZXN0ZWQoc2VsZiwgcmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMuZW1wdHkpIHtcbiAgICAgICAgdmFyIG9sZEVtcHR5ID0gb3B0cy5lbXB0eTtcbiAgICAgICAgb3B0cy5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG9sZEVtcHR5LmNhbGwobnVsbCwgc2VsZik7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9wdHMuZW1haWwgPSB0aGlzLnZhbCgpO1xuICAgICAgTWFpbGNoZWNrLnJ1bihvcHRzKTtcbiAgICB9XG4gIH0pKGpRdWVyeSk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL21haWxjaGVjay9zcmMvbWFpbGNoZWNrLmpzXG4gKiogbW9kdWxlIGlkID0gODFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDYgN1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG52YXJcclxuICAgIExBUkdFID0gJ2xhcmdlJyxcclxuICAgIERJU0FCTEVEID0gJ2Rpc2FibGVkJyxcclxuICAgIExPQURJTkcgPSAnaWNvbiBsb2FkaW5nJyxcclxuICAgIERFQ09SQVRFRCA9ICdkZWNvcmF0ZWQnLFxyXG4gICAgRVJST1IgPSAnZXJyb3InLFxyXG4gICAgSU4gPSAnaW4nXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjbGFzc2VzOiBmdW5jdGlvbihzdGF0ZSwgbGFyZ2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZGF0YS5zdGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5kaXNhYmxlZCB8fCBkYXRhLnN0YXRlLnN1Ym1pdHRpbmcpIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUubG9hZGluZykgY2xhc3Nlcy5wdXNoKExPQURJTkcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmVycm9yKSBjbGFzc2VzLnB1c2goRVJST1IpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sYXJnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChERUNPUkFURUQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChMQVJHRSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlIHx8IGRhdGEuZm9jdXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKElOKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndmFsdWUnLCBmdW5jdGlvbigpIHsgIGlmICh0aGlzLmdldCgnZXJyb3InKSkgdGhpcy5zZXQoJ2Vycm9yJywgZmFsc2UpOyB9LCB7aW5pdDogZmFsc2V9KTtcclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKVxyXG4gICAgICAgICAgICAub24oJ2ZvY3VzLmFwaScsIGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgnZm9jdXMnLCB0cnVlKTsgfSlcclxuICAgICAgICAgICAgLm9uKCdibHVyLmFwaScsIGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgnZm9jdXMnLCBmYWxzZSk7IH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYXJkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkub2ZmKCcuYXBpJyk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBpbmM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2ID0gXy5wYXJzZUludCh0aGlzLmdldCgndmFsdWUnKSkgKyAxO1xyXG5cclxuICAgICAgICBpZiAodiA8PSB0aGlzLmdldCgnbWF4JykpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xyXG4gICAgfSxcclxuXHJcbiAgICBkZWM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2ID0gXy5wYXJzZUludCh0aGlzLmdldCgndmFsdWUnKSkgLSAxO1xyXG5cclxuICAgICAgICBpZiAodiA+PSB0aGlzLmdldCgnbWluJykpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgdik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL3NwaW5uZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMyA2IDdcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIHNlbGVjdGlvbiBpbnB1dCBzcGlubmVyIGRyb3Bkb3duIGluIFwiLHtcInRcIjoyLFwiclwiOlwiY2xhc3NcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvclwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY2xhc3Nlc1wiLFwic3RhdGVcIixcImxhcmdlXCIsXCJ2YWx1ZVwiXSxcInNcIjpcIl8wKF8xLF8yLF8zKVwifX1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImhpZGRlblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ2YWx1ZVwifV19fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcGxhY2Vob2xkZXJcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwicGxhY2Vob2xkZXJcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJsYXJnZVwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0ZXh0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInZhbHVlXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc3Bpbm5lciBidXR0b24gaW5jXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiaW5jXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCIrXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzcGlubmVyIGJ1dHRvbiBkZWNcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJkZWNcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIi1cIl19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMyA2IDdcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCdpbnRsLXRlbC1pbnB1dC9idWlsZC9qcy9pbnRsVGVsSW5wdXQnKTtcclxuXHJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcblxyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0LmV4dGVuZCh7XHJcbiAgICBcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgdmlldyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGlucHV0ID0gJCh0aGlzLmZpbmQoJ2lucHV0JykpXHJcbiAgICAgICAgICAgIDtcclxuXHJcblxyXG4gICAgICAgIGlucHV0LmludGxUZWxJbnB1dCh7XHJcbiAgICAgICAgICAgIGF1dG9QbGFjZWhvbGRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHByZWZlcnJlZENvdW50cmllczogWydpbicsJ3VzJywnZ2InLCdydSddLFxyXG4gICAgICAgICAgICBuYXRpb25hbE1vZGU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlucHV0Lm9uKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLmludGxUZWxJbnB1dCgnZGVzdHJveScpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL3RlbC5qc1xuICoqIG1vZHVsZSBpZCA9IDI3MVxuICoqIG1vZHVsZSBjaHVua3MgPSA2IDdcbiAqKi8iLCIvKlxuSW50ZXJuYXRpb25hbCBUZWxlcGhvbmUgSW5wdXQgdjUuOC43XG5odHRwczovL2dpdGh1Yi5jb20vQmx1ZWZpZWxkc2NvbS9pbnRsLXRlbC1pbnB1dC5naXRcbiovXG4vLyB3cmFwIGluIFVNRCAtIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL2pxdWVyeVBsdWdpbi5qc1xuKGZ1bmN0aW9uKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFsgXCJqcXVlcnlcIiBdLCBmdW5jdGlvbigkKSB7XG4gICAgICAgICAgICBmYWN0b3J5KCQsIHdpbmRvdywgZG9jdW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgfVxufSkoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLy8gdGhlc2UgdmFycyBwZXJzaXN0IHRocm91Z2ggYWxsIGluc3RhbmNlcyBvZiB0aGUgcGx1Z2luXG4gICAgdmFyIHBsdWdpbk5hbWUgPSBcImludGxUZWxJbnB1dFwiLCBpZCA9IDEsIC8vIGdpdmUgZWFjaCBpbnN0YW5jZSBpdCdzIG93biBpZCBmb3IgbmFtZXNwYWNlZCBldmVudCBoYW5kbGluZ1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAvLyB0eXBpbmcgZGlnaXRzIGFmdGVyIGEgdmFsaWQgbnVtYmVyIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGV4dGVuc2lvbiBwYXJ0IG9mIHRoZSBudW1iZXJcbiAgICAgICAgYWxsb3dFeHRlbnNpb25zOiBmYWxzZSxcbiAgICAgICAgLy8gYXV0b21hdGljYWxseSBmb3JtYXQgdGhlIG51bWJlciBhY2NvcmRpbmcgdG8gdGhlIHNlbGVjdGVkIGNvdW50cnlcbiAgICAgICAgYXV0b0Zvcm1hdDogdHJ1ZSxcbiAgICAgICAgLy8gYWRkIG9yIHJlbW92ZSBpbnB1dCBwbGFjZWhvbGRlciB3aXRoIGFuIGV4YW1wbGUgbnVtYmVyIGZvciB0aGUgc2VsZWN0ZWQgY291bnRyeVxuICAgICAgICBhdXRvUGxhY2Vob2xkZXI6IHRydWUsXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGp1c3QgYSBkaWFsIGNvZGUgaW4gdGhlIGlucHV0OiByZW1vdmUgaXQgb24gYmx1ciwgYW5kIHJlLWFkZCBpdCBvbiBmb2N1c1xuICAgICAgICBhdXRvSGlkZURpYWxDb2RlOiB0cnVlLFxuICAgICAgICAvLyBkZWZhdWx0IGNvdW50cnlcbiAgICAgICAgZGVmYXVsdENvdW50cnk6IFwiXCIsXG4gICAgICAgIC8vIHRva2VuIGZvciBpcGluZm8gLSByZXF1aXJlZCBmb3IgaHR0cHMgb3Igb3ZlciAxMDAwIGRhaWx5IHBhZ2Ugdmlld3Mgc3VwcG9ydFxuICAgICAgICBpcGluZm9Ub2tlbjogXCJcIixcbiAgICAgICAgLy8gZG9uJ3QgaW5zZXJ0IGludGVybmF0aW9uYWwgZGlhbCBjb2Rlc1xuICAgICAgICBuYXRpb25hbE1vZGU6IHRydWUsXG4gICAgICAgIC8vIG51bWJlciB0eXBlIHRvIHVzZSBmb3IgcGxhY2Vob2xkZXJzXG4gICAgICAgIG51bWJlclR5cGU6IFwiTU9CSUxFXCIsXG4gICAgICAgIC8vIGRpc3BsYXkgb25seSB0aGVzZSBjb3VudHJpZXNcbiAgICAgICAgb25seUNvdW50cmllczogW10sXG4gICAgICAgIC8vIHRoZSBjb3VudHJpZXMgYXQgdGhlIHRvcCBvZiB0aGUgbGlzdC4gZGVmYXVsdHMgdG8gdW5pdGVkIHN0YXRlcyBhbmQgdW5pdGVkIGtpbmdkb21cbiAgICAgICAgcHJlZmVycmVkQ291bnRyaWVzOiBbIFwidXNcIiwgXCJnYlwiIF0sXG4gICAgICAgIC8vIHNwZWNpZnkgdGhlIHBhdGggdG8gdGhlIGxpYnBob25lbnVtYmVyIHNjcmlwdCB0byBlbmFibGUgdmFsaWRhdGlvbi9mb3JtYXR0aW5nXG4gICAgICAgIHV0aWxzU2NyaXB0OiBcIlwiXG4gICAgfSwga2V5cyA9IHtcbiAgICAgICAgVVA6IDM4LFxuICAgICAgICBET1dOOiA0MCxcbiAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICBFU0M6IDI3LFxuICAgICAgICBQTFVTOiA0MyxcbiAgICAgICAgQTogNjUsXG4gICAgICAgIFo6IDkwLFxuICAgICAgICBaRVJPOiA0OCxcbiAgICAgICAgTklORTogNTcsXG4gICAgICAgIFNQQUNFOiAzMixcbiAgICAgICAgQlNQQUNFOiA4LFxuICAgICAgICBERUw6IDQ2LFxuICAgICAgICBDVFJMOiAxNyxcbiAgICAgICAgQ01EMTogOTEsXG4gICAgICAgIC8vIENocm9tZVxuICAgICAgICBDTUQyOiAyMjRcbiAgICB9LCB3aW5kb3dMb2FkZWQgPSBmYWxzZTtcbiAgICAvLyBrZWVwIHRyYWNrIG9mIGlmIHRoZSB3aW5kb3cubG9hZCBldmVudCBoYXMgZmlyZWQgYXMgaW1wb3NzaWJsZSB0byBjaGVjayBhZnRlciB0aGUgZmFjdFxuICAgICQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3dMb2FkZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIGZ1bmN0aW9uIFBsdWdpbihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgICAgIC8vIGV2ZW50IG5hbWVzcGFjZVxuICAgICAgICB0aGlzLm5zID0gXCIuXCIgKyBwbHVnaW5OYW1lICsgaWQrKztcbiAgICAgICAgLy8gQ2hyb21lLCBGRiwgU2FmYXJpLCBJRTkrXG4gICAgICAgIHRoaXMuaXNHb29kQnJvd3NlciA9IEJvb2xlYW4oZWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgIHRoaXMuaGFkSW5pdGlhbFBsYWNlaG9sZGVyID0gQm9vbGVhbigkKGVsZW1lbnQpLmF0dHIoXCJwbGFjZWhvbGRlclwiKSk7XG4gICAgICAgIHRoaXMuX25hbWUgPSBwbHVnaW5OYW1lO1xuICAgIH1cbiAgICBQbHVnaW4ucHJvdG90eXBlID0ge1xuICAgICAgICBfaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiBpbiBuYXRpb25hbE1vZGUsIGRpc2FibGUgb3B0aW9ucyByZWxhdGluZyB0byBkaWFsIGNvZGVzXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJRSBNb2JpbGUgZG9lc24ndCBzdXBwb3J0IHRoZSBrZXlwcmVzcyBldmVudCAoc2VlIGlzc3VlIDY4KSB3aGljaCBtYWtlcyBhdXRvRm9ybWF0IGltcG9zc2libGVcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9JRU1vYmlsZS9pKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hdXRvRm9ybWF0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB3ZSBjYW5ub3QganVzdCB0ZXN0IHNjcmVlbiBzaXplIGFzIHNvbWUgc21hcnRwaG9uZXMvd2Vic2l0ZSBtZXRhIHRhZ3Mgd2lsbCByZXBvcnQgZGVza3RvcCByZXNvbHV0aW9uc1xuICAgICAgICAgICAgLy8gTm90ZTogZm9yIHNvbWUgcmVhc29uIGphc21pbmUgZnVja3MgdXAgaWYgeW91IHB1dCB0aGlzIGluIHRoZSBtYWluIFBsdWdpbiBmdW5jdGlvbiB3aXRoIHRoZSByZXN0IG9mIHRoZXNlIGRlY2xhcmF0aW9uc1xuICAgICAgICAgICAgLy8gTm90ZTogdG8gdGFyZ2V0IEFuZHJvaWQgTW9iaWxlcyAoYW5kIG5vdCBUYWJsZXRzKSwgd2UgbXVzdCBmaW5kIFwiQW5kcm9pZFwiIGFuZCBcIk1vYmlsZVwiXG4gICAgICAgICAgICB0aGlzLmlzTW9iaWxlID0gL0FuZHJvaWQuK01vYmlsZXx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICAgICAgICAvLyB3ZSByZXR1cm4gdGhlc2UgZGVmZXJyZWQgb2JqZWN0cyBmcm9tIHRoZSBfaW5pdCgpIGNhbGwgc28gdGhleSBjYW4gYmUgd2F0Y2hlZCwgYW5kIHRoZW4gd2UgcmVzb2x2ZSB0aGVtIHdoZW4gZWFjaCBzcGVjaWZpYyByZXF1ZXN0IHJldHVybnNcbiAgICAgICAgICAgIC8vIE5vdGU6IGFnYWluLCBqYXNtaW5lIGhhZCBhIHNwYXp6IHdoZW4gSSBwdXQgdGhlc2UgaW4gdGhlIFBsdWdpbiBmdW5jdGlvblxuICAgICAgICAgICAgdGhpcy5hdXRvQ291bnRyeURlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgICAgIHRoaXMudXRpbHNTY3JpcHREZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgICAgICAgICAvLyBwcm9jZXNzIGFsbCB0aGUgZGF0YTogb25seUNvdW50cmllcywgcHJlZmVycmVkQ291bnRyaWVzIGV0Y1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc0NvdW50cnlEYXRhKCk7XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSB0aGUgbWFya3VwXG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZU1hcmt1cCgpO1xuICAgICAgICAgICAgLy8gc2V0IHRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBpbnB1dCB2YWx1ZSBhbmQgdGhlIHNlbGVjdGVkIGZsYWdcbiAgICAgICAgICAgIHRoaXMuX3NldEluaXRpYWxTdGF0ZSgpO1xuICAgICAgICAgICAgLy8gc3RhcnQgYWxsIG9mIHRoZSBldmVudCBsaXN0ZW5lcnM6IGF1dG9IaWRlRGlhbENvZGUsIGlucHV0IGtleWRvd24sIHNlbGVjdGVkRmxhZyBjbGlja1xuICAgICAgICAgICAgdGhpcy5faW5pdExpc3RlbmVycygpO1xuICAgICAgICAgICAgLy8gdXRpbHMgc2NyaXB0LCBhbmQgYXV0byBjb3VudHJ5XG4gICAgICAgICAgICB0aGlzLl9pbml0UmVxdWVzdHMoKTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgZGVmZXJyZWRzXG4gICAgICAgICAgICByZXR1cm4gWyB0aGlzLmF1dG9Db3VudHJ5RGVmZXJyZWQsIHRoaXMudXRpbHNTY3JpcHREZWZlcnJlZCBdO1xuICAgICAgICB9LFxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICogIFBSSVZBVEUgTUVUSE9EU1xuICAgKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgIC8vIHByZXBhcmUgYWxsIG9mIHRoZSBjb3VudHJ5IGRhdGEsIGluY2x1ZGluZyBvbmx5Q291bnRyaWVzIGFuZCBwcmVmZXJyZWRDb3VudHJpZXMgb3B0aW9uc1xuICAgICAgICBfcHJvY2Vzc0NvdW50cnlEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgaW5zdGFuY2VzIGNvdW50cnkgZGF0YSBvYmplY3RzXG4gICAgICAgICAgICB0aGlzLl9zZXRJbnN0YW5jZUNvdW50cnlEYXRhKCk7XG4gICAgICAgICAgICAvLyBzZXQgdGhlIHByZWZlcnJlZENvdW50cmllcyBwcm9wZXJ0eVxuICAgICAgICAgICAgdGhpcy5fc2V0UHJlZmVycmVkQ291bnRyaWVzKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFkZCBhIGNvdW50cnkgY29kZSB0byB0aGlzLmNvdW50cnlDb2Rlc1xuICAgICAgICBfYWRkQ291bnRyeUNvZGU6IGZ1bmN0aW9uKGlzbzIsIGRpYWxDb2RlLCBwcmlvcml0eSkge1xuICAgICAgICAgICAgaWYgKCEoZGlhbENvZGUgaW4gdGhpcy5jb3VudHJ5Q29kZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5Q29kZXNbZGlhbENvZGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwcmlvcml0eSB8fCAwO1xuICAgICAgICAgICAgdGhpcy5jb3VudHJ5Q29kZXNbZGlhbENvZGVdW2luZGV4XSA9IGlzbzI7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHByb2Nlc3Mgb25seUNvdW50cmllcyBhcnJheSBpZiBwcmVzZW50LCBhbmQgZ2VuZXJhdGUgdGhlIGNvdW50cnlDb2RlcyBtYXBcbiAgICAgICAgX3NldEluc3RhbmNlQ291bnRyeURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAvLyBwcm9jZXNzIG9ubHlDb3VudHJpZXMgb3B0aW9uXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9ubHlDb3VudHJpZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gc3RhbmRhcmRpc2UgY2FzZVxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMub25seUNvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25seUNvdW50cmllc1tpXSA9IHRoaXMub3B0aW9ucy5vbmx5Q291bnRyaWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGJ1aWxkIGluc3RhbmNlIGNvdW50cnkgYXJyYXlcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cmllcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbGxDb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShhbGxDb3VudHJpZXNbaV0uaXNvMiwgdGhpcy5vcHRpb25zLm9ubHlDb3VudHJpZXMpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50cmllcy5wdXNoKGFsbENvdW50cmllc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyaWVzID0gYWxsQ291bnRyaWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZ2VuZXJhdGUgY291bnRyeUNvZGVzIG1hcFxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5Q29kZXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5jb3VudHJpZXNbaV07XG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkQ291bnRyeUNvZGUoYy5pc28yLCBjLmRpYWxDb2RlLCBjLnByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICAvLyBhcmVhIGNvZGVzXG4gICAgICAgICAgICAgICAgaWYgKGMuYXJlYUNvZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYy5hcmVhQ29kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZ1bGwgZGlhbCBjb2RlIGlzIGNvdW50cnkgY29kZSArIGRpYWwgY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkQ291bnRyeUNvZGUoYy5pc28yLCBjLmRpYWxDb2RlICsgYy5hcmVhQ29kZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBwcm9jZXNzIHByZWZlcnJlZCBjb3VudHJpZXMgLSBpdGVyYXRlIHRocm91Z2ggdGhlIHByZWZlcmVuY2VzLFxuICAgICAgICAvLyBmZXRjaGluZyB0aGUgY291bnRyeSBkYXRhIGZvciBlYWNoIG9uZVxuICAgICAgICBfc2V0UHJlZmVycmVkQ291bnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucHJlZmVycmVkQ291bnRyaWVzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5wcmVmZXJyZWRDb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY291bnRyeUNvZGUgPSB0aGlzLm9wdGlvbnMucHJlZmVycmVkQ291bnRyaWVzW2ldLnRvTG93ZXJDYXNlKCksIGNvdW50cnlEYXRhID0gdGhpcy5fZ2V0Q291bnRyeURhdGEoY291bnRyeUNvZGUsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoY291bnRyeURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVmZXJyZWRDb3VudHJpZXMucHVzaChjb3VudHJ5RGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBnZW5lcmF0ZSBhbGwgb2YgdGhlIG1hcmt1cCBmb3IgdGhlIHBsdWdpbjogdGhlIHNlbGVjdGVkIGZsYWcgb3ZlcmxheSwgYW5kIHRoZSBkcm9wZG93blxuICAgICAgICBfZ2VuZXJhdGVNYXJrdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gdGVsZXBob25lIGlucHV0XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0ID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgLy8gcHJldmVudCBhdXRvY29tcGxldGUgYXMgdGhlcmUncyBubyBzYWZlLCBjcm9zcy1icm93c2VyIGV2ZW50IHdlIGNhbiByZWFjdCB0bywgc28gaXQgY2FuIGVhc2lseSBwdXQgdGhlIHBsdWdpbiBpbiBhbiBpbmNvbnNpc3RlbnQgc3RhdGUgZS5nLiB0aGUgd3JvbmcgZmxhZyBzZWxlY3RlZCBmb3IgdGhlIGF1dG9jb21wbGV0ZWQgbnVtYmVyLCB3aGljaCBvbiBzdWJtaXQgY291bGQgbWVhbiB0aGUgd3JvbmcgbnVtYmVyIGlzIHNhdmVkIChlc3AgaW4gbmF0aW9uYWxNb2RlKVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5hdHRyKFwiYXV0b2NvbXBsZXRlXCIsIFwib2ZmXCIpO1xuICAgICAgICAgICAgLy8gY29udGFpbmVycyAobW9zdGx5IGZvciBwb3NpdGlvbmluZylcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQud3JhcCgkKFwiPGRpdj5cIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJpbnRsLXRlbC1pbnB1dFwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB2YXIgZmxhZ3NDb250YWluZXIgPSAkKFwiPGRpdj5cIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJmbGFnLWRyb3Bkb3duXCJcbiAgICAgICAgICAgIH0pLmluc2VydEFmdGVyKHRoaXMudGVsSW5wdXQpO1xuICAgICAgICAgICAgLy8gY3VycmVudGx5IHNlbGVjdGVkIGZsYWcgKGRpc3BsYXllZCB0byBsZWZ0IG9mIGlucHV0KVxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkRmxhZyA9ICQoXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInNlbGVjdGVkLWZsYWdcIlxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oZmxhZ3NDb250YWluZXIpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZsYWdJbm5lciA9ICQoXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIml0aS1mbGFnXCJcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKHNlbGVjdGVkRmxhZyk7XG4gICAgICAgICAgICAvLyBDU1MgdHJpYW5nbGVcbiAgICAgICAgICAgICQoXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFycm93XCJcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKHNlbGVjdGVkRmxhZyk7XG4gICAgICAgICAgICAvLyBjb3VudHJ5IGxpc3RcbiAgICAgICAgICAgIC8vIG1vYmlsZSBpcyBqdXN0IGEgbmF0aXZlIHNlbGVjdCBlbGVtZW50XG4gICAgICAgICAgICAvLyBkZXNrdG9wIGlzIGEgcHJvcGVyIGxpc3QgY29udGFpbmluZzogcHJlZmVycmVkIGNvdW50cmllcywgdGhlbiBkaXZpZGVyLCB0aGVuIGFsbCBjb3VudHJpZXNcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdCA9ICQoXCI8c2VsZWN0PlwiKS5hcHBlbmRUbyhmbGFnc0NvbnRhaW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QgPSAkKFwiPHVsPlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjb3VudHJ5LWxpc3Qgdi1oaWRlXCJcbiAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbyhmbGFnc0NvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlZmVycmVkQ291bnRyaWVzLmxlbmd0aCAmJiAhdGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBlbmRMaXN0SXRlbXModGhpcy5wcmVmZXJyZWRDb3VudHJpZXMsIFwicHJlZmVycmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiPGxpPlwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiZGl2aWRlclwiXG4gICAgICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKHRoaXMuY291bnRyeUxpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZExpc3RJdGVtcyh0aGlzLmNvdW50cmllcywgXCJcIik7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAvLyBub3cgd2UgY2FuIGdyYWIgdGhlIGRyb3Bkb3duIGhlaWdodCwgYW5kIGhpZGUgaXQgcHJvcGVybHlcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duSGVpZ2h0ID0gdGhpcy5jb3VudHJ5TGlzdC5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QucmVtb3ZlQ2xhc3MoXCJ2LWhpZGVcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgdXNlZnVsIGluIGxvdHMgb2YgcGxhY2VzXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdEl0ZW1zID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIi5jb3VudHJ5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBhZGQgYSBjb3VudHJ5IDxsaT4gdG8gdGhlIGNvdW50cnlMaXN0IDx1bD4gY29udGFpbmVyXG4gICAgICAgIC8vIFVQREFURTogaWYgaXNNb2JpbGUsIGFkZCBhbiA8b3B0aW9uPiB0byB0aGUgY291bnRyeUxpc3QgPHNlbGVjdD4gY29udGFpbmVyXG4gICAgICAgIF9hcHBlbmRMaXN0SXRlbXM6IGZ1bmN0aW9uKGNvdW50cmllcywgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAvLyB3ZSBjcmVhdGUgc28gbWFueSBET00gZWxlbWVudHMsIGl0IGlzIGZhc3RlciB0byBidWlsZCBhIHRlbXAgc3RyaW5nXG4gICAgICAgICAgICAvLyBhbmQgdGhlbiBhZGQgZXZlcnl0aGluZyB0byB0aGUgRE9NIGluIG9uZSBnbyBhdCB0aGUgZW5kXG4gICAgICAgICAgICB2YXIgdG1wID0gXCJcIjtcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIGNvdW50cnlcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBjb3VudHJpZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPG9wdGlvbiBkYXRhLWRpYWwtY29kZT0nXCIgKyBjLmRpYWxDb2RlICsgXCInIHZhbHVlPSdcIiArIGMuaXNvMiArIFwiJz5cIjtcbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IGMubmFtZSArIFwiICtcIiArIGMuZGlhbENvZGU7XG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjwvb3B0aW9uPlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9wZW4gdGhlIGxpc3QgaXRlbVxuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8bGkgY2xhc3M9J2NvdW50cnkgXCIgKyBjbGFzc05hbWUgKyBcIicgZGF0YS1kaWFsLWNvZGU9J1wiICsgYy5kaWFsQ29kZSArIFwiJyBkYXRhLWNvdW50cnktY29kZT0nXCIgKyBjLmlzbzIgKyBcIic+XCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgZmxhZ1xuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8ZGl2IGNsYXNzPSdmbGFnJz48ZGl2IGNsYXNzPSdpdGktZmxhZyBcIiArIGMuaXNvMiArIFwiJz48L2Rpdj48L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZSBjb3VudHJ5IG5hbWUgYW5kIGRpYWwgY29kZVxuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8c3BhbiBjbGFzcz0nY291bnRyeS1uYW1lJz5cIiArIGMubmFtZSArIFwiPC9zcGFuPlwiO1xuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8c3BhbiBjbGFzcz0nZGlhbC1jb2RlJz4rXCIgKyBjLmRpYWxDb2RlICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNsb3NlIHRoZSBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPC9saT5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0LmFwcGVuZCh0bXApO1xuICAgICAgICB9LFxuICAgICAgICAvLyBzZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGlucHV0IHZhbHVlIGFuZCB0aGUgc2VsZWN0ZWQgZmxhZ1xuICAgICAgICBfc2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnRlbElucHV0LnZhbCgpO1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBudW1iZXIsIGFuZCBpdCdzIHZhbGlkLCB3ZSBjYW4gZ28gYWhlYWQgYW5kIHNldCB0aGUgZmxhZywgZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdFxuICAgICAgICAgICAgaWYgKHRoaXMuX2dldERpYWxDb2RlKHZhbCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVGbGFnRnJvbU51bWJlcih2YWwsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgIT0gXCJhdXRvXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayB0aGUgZGVmYXVsdENvdW50cnkgb3B0aW9uLCBlbHNlIGZhbGwgYmFjayB0byB0aGUgZmlyc3QgaW4gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSA9IHRoaXMuX2dldENvdW50cnlEYXRhKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeS50b0xvd2VyQ2FzZSgpLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSA9IHRoaXMucHJlZmVycmVkQ291bnRyaWVzLmxlbmd0aCA/IHRoaXMucHJlZmVycmVkQ291bnRyaWVzWzBdIDogdGhpcy5jb3VudHJpZXNbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEZsYWcodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5LmlzbzIpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGVtcHR5LCBpbnNlcnQgdGhlIGRlZmF1bHQgZGlhbCBjb2RlICh0aGlzIGZ1bmN0aW9uIHdpbGwgY2hlY2sgIW5hdGlvbmFsTW9kZSBhbmQgIWF1dG9IaWRlRGlhbENvZGUpXG4gICAgICAgICAgICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlhbENvZGUodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5LmRpYWxDb2RlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZm9ybWF0XG4gICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyB3b250IGJlIHJ1biBhZnRlciBfdXBkYXRlRGlhbENvZGUgYXMgdGhhdCdzIG9ubHkgY2FsbGVkIGlmIG5vIHZhbFxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBpbml0aWFsaXNlIHRoZSBtYWluIGV2ZW50IGxpc3RlbmVyczogaW5wdXQga2V5dXAsIGFuZCBjbGljayBzZWxlY3RlZCBmbGFnXG4gICAgICAgIF9pbml0TGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuX2luaXRLZXlMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIC8vIGF1dG9Gb3JtYXQgcHJldmVudHMgdGhlIGNoYW5nZSBldmVudCBmcm9tIGZpcmluZywgc28gd2UgbmVlZCB0byBjaGVjayBmb3IgY2hhbmdlcyBiZXR3ZWVuIGZvY3VzIGFuZCBibHVyIGluIG9yZGVyIHRvIG1hbnVhbGx5IHRyaWdnZXIgaXRcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0hpZGVEaWFsQ29kZSB8fCB0aGlzLm9wdGlvbnMuYXV0b0Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRGb2N1c0xpc3RlbmVycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0Lm9uKFwiY2hhbmdlXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3NlbGVjdExpc3RJdGVtKCQodGhpcykuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGhhY2sgZm9yIGlucHV0IG5lc3RlZCBpbnNpZGUgbGFiZWw6IGNsaWNraW5nIHRoZSBzZWxlY3RlZC1mbGFnIHRvIG9wZW4gdGhlIGRyb3Bkb3duIHdvdWxkIHRoZW4gYXV0b21hdGljYWxseSB0cmlnZ2VyIGEgMm5kIGNsaWNrIG9uIHRoZSBpbnB1dCB3aGljaCB3b3VsZCBjbG9zZSBpdCBhZ2FpblxuICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHRoaXMudGVsSW5wdXQuY2xvc2VzdChcImxhYmVsXCIpO1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwub24oXCJjbGlja1wiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGRyb3Bkb3duIGlzIGNsb3NlZCwgdGhlbiBmb2N1cyB0aGUgaW5wdXQsIGVsc2UgaWdub3JlIHRoZSBjbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuY291bnRyeUxpc3QuaGFzQ2xhc3MoXCJoaWRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0b2dnbGUgY291bnRyeSBkcm9wZG93biBvbiBjbGlja1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZEZsYWcgPSB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLnBhcmVudCgpO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkRmxhZy5vbihcImNsaWNrXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgaW50ZXJjZXB0IHRoaXMgZXZlbnQgaWYgd2UncmUgb3BlbmluZyB0aGUgZHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBsZXQgaXQgYnViYmxlIHVwIHRvIHRoZSB0b3AgKFwiY2xpY2stb2ZmLXRvLWNsb3NlXCIgbGlzdGVuZXIpXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBqdXN0IHN0b3BQcm9wYWdhdGlvbiBhcyBpdCBtYXkgYmUgbmVlZGVkIHRvIGNsb3NlIGFub3RoZXIgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuY291bnRyeUxpc3QuaGFzQ2xhc3MoXCJoaWRlXCIpICYmICF0aGF0LnRlbElucHV0LnByb3AoXCJkaXNhYmxlZFwiKSAmJiAhdGhhdC50ZWxJbnB1dC5wcm9wKFwicmVhZG9ubHlcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3Nob3dEcm9wZG93bigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9pbml0UmVxdWVzdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaGFzIHNwZWNpZmllZCB0aGUgcGF0aCB0byB0aGUgdXRpbHMgc2NyaXB0LCBmZXRjaCBpdCBvbiB3aW5kb3cubG9hZFxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51dGlsc1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwbHVnaW4gaXMgYmVpbmcgaW5pdGlhbGlzZWQgYWZ0ZXIgdGhlIHdpbmRvdy5sb2FkIGV2ZW50IGhhcyBhbHJlYWR5IGJlZW4gZmlyZWRcbiAgICAgICAgICAgICAgICBpZiAod2luZG93TG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFV0aWxzKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2FpdCB1bnRpbCB0aGUgbG9hZCBldmVudCBzbyB3ZSBkb24ndCBibG9jayBhbnkgb3RoZXIgcmVxdWVzdHMgZS5nLiB0aGUgZmxhZ3MgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmxvYWRVdGlscygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXRpbHNTY3JpcHREZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID09IFwiYXV0b1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZEF1dG9Db3VudHJ5KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b0NvdW50cnlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9sb2FkQXV0b0NvdW50cnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGNvb2tpZVxuICAgICAgICAgICAgdmFyIGNvb2tpZUF1dG9Db3VudHJ5ID0gJC5jb29raWUgPyAkLmNvb2tpZShcIml0aUF1dG9Db3VudHJ5XCIpIDogXCJcIjtcbiAgICAgICAgICAgIGlmIChjb29raWVBdXRvQ291bnRyeSkge1xuICAgICAgICAgICAgICAgICQuZm5bcGx1Z2luTmFtZV0uYXV0b0NvdW50cnkgPSBjb29raWVBdXRvQ291bnRyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIDMgb3B0aW9uczpcbiAgICAgICAgICAgIC8vIDEpIGFscmVhZHkgbG9hZGVkICh3ZSdyZSBkb25lKVxuICAgICAgICAgICAgLy8gMikgbm90IGFscmVhZHkgc3RhcnRlZCBsb2FkaW5nIChzdGFydClcbiAgICAgICAgICAgIC8vIDMpIGFscmVhZHkgc3RhcnRlZCBsb2FkaW5nIChkbyBub3RoaW5nIC0ganVzdCB3YWl0IGZvciBsb2FkaW5nIGNhbGxiYWNrIHRvIGZpcmUpXG4gICAgICAgICAgICBpZiAoJC5mbltwbHVnaW5OYW1lXS5hdXRvQ291bnRyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b0NvdW50cnlMb2FkZWQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoISQuZm5bcGx1Z2luTmFtZV0uc3RhcnRlZExvYWRpbmdBdXRvQ291bnRyeSkge1xuICAgICAgICAgICAgICAgIC8vIGRvbid0IGRvIHRoaXMgdHdpY2UhXG4gICAgICAgICAgICAgICAgJC5mbltwbHVnaW5OYW1lXS5zdGFydGVkTG9hZGluZ0F1dG9Db3VudHJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgaXBpbmZvVVJMID0gXCIvL2lwaW5mby5pb1wiO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXBpbmZvVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaXBpbmZvVVJMICs9IFwiP3Rva2VuPVwiICsgdGhpcy5vcHRpb25zLmlwaW5mb1Rva2VuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkb250IGJvdGhlciB3aXRoIHRoZSBzdWNjZXNzIGZ1bmN0aW9uIGFyZyAtIGluc3RlYWQgdXNlIGFsd2F5cygpIGFzIHNob3VsZCBzdGlsbCBzZXQgYSBkZWZhdWx0Q291bnRyeSBldmVuIGlmIHRoZSBsb29rdXAgZmFpbHNcbiAgICAgICAgICAgICAgICAkLmdldChpcGluZm9VUkwsIGZ1bmN0aW9uKCkge30sIFwianNvbnBcIikuYWx3YXlzKGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgICAgICAgICAgICAgJC5mbltwbHVnaW5OYW1lXS5hdXRvQ291bnRyeSA9IHJlc3AgJiYgcmVzcC5jb3VudHJ5ID8gcmVzcC5jb3VudHJ5LnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJC5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuY29va2llKFwiaXRpQXV0b0NvdW50cnlcIiwgJC5mbltwbHVnaW5OYW1lXS5hdXRvQ291bnRyeSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IFwiL1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB0ZWxsIGFsbCBpbnN0YW5jZXMgdGhlIGF1dG8gY291bnRyeSBpcyByZWFkeVxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBqdXN0IGJlIHRoZSBjdXJyZW50IGluc3RhbmNlc1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmludGwtdGVsLWlucHV0IGlucHV0XCIpLmludGxUZWxJbnB1dChcImF1dG9Db3VudHJ5TG9hZGVkXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfaW5pdEtleUxpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Gb3JtYXQpIHtcbiAgICAgICAgICAgICAgICAvLyBmb3JtYXQgbnVtYmVyIGFuZCB1cGRhdGUgZmxhZyBvbiBrZXlwcmVzc1xuICAgICAgICAgICAgICAgIC8vIHVzZSBrZXlwcmVzcyBldmVudCBhcyB3ZSB3YW50IHRvIGlnbm9yZSBhbGwgaW5wdXQgZXhjZXB0IGZvciBhIHNlbGVjdCBmZXcga2V5cyxcbiAgICAgICAgICAgICAgICAvLyBidXQgd2UgZG9udCB3YW50IHRvIGlnbm9yZSB0aGUgbmF2aWdhdGlvbiBrZXlzIGxpa2UgdGhlIGFycm93cyBldGMuXG4gICAgICAgICAgICAgICAgLy8gTk9URTogbm8gcG9pbnQgaW4gcmVmYWN0b3JpbmcgdGhpcyB0byBvbmx5IGJpbmQgdGhlc2UgbGlzdGVuZXJzIG9uIGZvY3VzL2JsdXIgYmVjYXVzZSB0aGVuIHlvdSB3b3VsZCBuZWVkIHRvIGhhdmUgdGhvc2UgMiBsaXN0ZW5lcnMgcnVubmluZyB0aGUgd2hvbGUgdGltZSBhbnl3YXkuLi5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9uKFwia2V5cHJlc3NcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gMzIgaXMgc3BhY2UsIGFuZCBhZnRlciB0aGF0IGl0J3MgYWxsIGNoYXJzIChub3QgbWV0YS9uYXYga2V5cylcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBmaXggaXMgbmVlZGVkIGZvciBGaXJlZm94LCB3aGljaCB0cmlnZ2VycyBrZXlwcmVzcyBldmVudCBmb3Igc29tZSBtZXRhL25hdiBrZXlzXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZTogYWxzbyBpZ25vcmUgaWYgdGhpcyBpcyBhIG1ldGFLZXkgZS5nLiBGRiBhbmQgU2FmYXJpIHRyaWdnZXIga2V5cHJlc3Mgb24gdGhlIHYgb2YgQ3RybCt2XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZTogYWxzbyBpZ25vcmUgaWYgY3RybEtleSAoRkYgb24gV2luZG93cy9VYnVudHUpXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZTogYWxzbyBjaGVjayB0aGF0IHdlIGhhdmUgdXRpbHMgYmVmb3JlIHdlIGRvIGFueSBhdXRvRm9ybWF0IHN0dWZmXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID49IGtleXMuU1BBQ0UgJiYgIWUuY3RybEtleSAmJiAhZS5tZXRhS2V5ICYmIHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscyAmJiAhdGhhdC50ZWxJbnB1dC5wcm9wKFwicmVhZG9ubHlcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbG93ZWQga2V5cyBhcmUganVzdCBudW1lcmljIGtleXMgYW5kIHBsdXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIG11c3QgYWxsb3cgcGx1cyBmb3IgdGhlIGNhc2Ugd2hlcmUgdGhlIHVzZXIgZG9lcyBzZWxlY3QtYWxsIGFuZCB0aGVuIGhpdHMgcGx1cyB0byBzdGFydCB0eXBpbmcgYSBuZXcgbnVtYmVyLiB3ZSBjb3VsZCByZWZpbmUgdGhpcyBsb2dpYyB0byBmaXJzdCBjaGVjayB0aGF0IHRoZSBzZWxlY3Rpb24gY29udGFpbnMgYSBwbHVzLCBidXQgdGhhdCB3b250IHdvcmsgaW4gb2xkIGJyb3dzZXJzLCBhbmQgSSB0aGluayBpdCdzIG92ZXJraWxsIGFueXdheVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzQWxsb3dlZEtleSA9IGUud2hpY2ggPj0ga2V5cy5aRVJPICYmIGUud2hpY2ggPD0ga2V5cy5OSU5FIHx8IGUud2hpY2ggPT0ga2V5cy5QTFVTLCBpbnB1dCA9IHRoYXQudGVsSW5wdXRbMF0sIG5vU2VsZWN0aW9uID0gdGhhdC5pc0dvb2RCcm93c2VyICYmIGlucHV0LnNlbGVjdGlvblN0YXJ0ID09IGlucHV0LnNlbGVjdGlvbkVuZCwgbWF4ID0gdGhhdC50ZWxJbnB1dC5hdHRyKFwibWF4bGVuZ3RoXCIpLCB2YWwgPSB0aGF0LnRlbElucHV0LnZhbCgpLCAvLyBhc3N1bWVzIHRoYXQgaWYgbWF4IGV4aXN0cywgaXQgaXMgPjBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQmVsb3dNYXggPSBtYXggPyB2YWwubGVuZ3RoIDwgbWF4IDogdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0OiBlbnN1cmUgd2UgZG9udCBnbyBvdmVyIG1heGxlbmd0aC4gd2UgbXVzdCBkbyB0aGlzIGhlcmUgdG8gcHJldmVudCBhZGRpbmcgZGlnaXRzIGluIHRoZSBtaWRkbGUgb2YgdGhlIG51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RpbGwgcmVmb3JtYXQgZXZlbiBpZiBub3QgYW4gYWxsb3dlZCBrZXkgYXMgdGhleSBjb3VsZCBieSB0eXBpbmcgYSBmb3JtYXR0aW5nIGNoYXIsIGJ1dCBpZ25vcmUgaWYgdGhlcmUncyBhIHNlbGVjdGlvbiBhcyBkb2Vzbid0IG1ha2Ugc2Vuc2UgdG8gcmVwbGFjZSBzZWxlY3Rpb24gd2l0aCBpbGxlZ2FsIGNoYXIgYW5kIHRoZW4gaW1tZWRpYXRlbHkgcmVtb3ZlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNCZWxvd01heCAmJiAoaXNBbGxvd2VkS2V5IHx8IG5vU2VsZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdDaGFyID0gaXNBbGxvd2VkS2V5ID8gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5faGFuZGxlSW5wdXRLZXkobmV3Q2hhciwgdHJ1ZSwgaXNBbGxvd2VkS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBzb21ldGhpbmcgaGFzIGNoYW5nZWQsIHRyaWdnZXIgdGhlIGlucHV0IGV2ZW50ICh3aGljaCB3YXMgb3RoZXJ3aXNlZCBzcXVhc2hlZCBieSB0aGUgcHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPSB0aGF0LnRlbElucHV0LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQudHJpZ2dlcihcImlucHV0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBbGxvd2VkS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5faGFuZGxlSW52YWxpZEtleSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBoYW5kbGUgY3V0L3Bhc3RlIGV2ZW50IChub3cgc3VwcG9ydGVkIGluIGFsbCBtYWpvciBicm93c2VycylcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJjdXRcIiArIHRoaXMubnMgKyBcIiBwYXN0ZVwiICsgdGhpcy5ucywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gaGFjayBiZWNhdXNlIFwicGFzdGVcIiBldmVudCBpcyBmaXJlZCBiZWZvcmUgaW5wdXQgaXMgdXBkYXRlZFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJzb3JBdEVuZCA9IHRoYXQuaXNHb29kQnJvd3NlciAmJiB0aGF0LnRlbElucHV0WzBdLnNlbGVjdGlvblN0YXJ0ID09IHRoYXQudGVsSW5wdXQudmFsKCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5faGFuZGxlSW5wdXRLZXkobnVsbCwgY3Vyc29yQXRFbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fZW5zdXJlUGx1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm8gYXV0b0Zvcm1hdCwganVzdCB1cGRhdGUgZmxhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fdXBkYXRlRmxhZ0Zyb21OdW1iZXIodGhhdC50ZWxJbnB1dC52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gaGFuZGxlIGtleXVwIGV2ZW50XG4gICAgICAgICAgICAvLyBpZiBhdXRvRm9ybWF0IGVuYWJsZWQ6IHdlIHVzZSBrZXl1cCB0byBjYXRjaCBkZWxldGUgZXZlbnRzIChhZnRlciB0aGUgZmFjdClcbiAgICAgICAgICAgIC8vIGlmIG5vIGF1dG9Gb3JtYXQsIHRoaXMgaXMgdXNlZCB0byB1cGRhdGUgdGhlIGZsYWdcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJrZXl1cFwiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIC8vIHRoZSBcImVudGVyXCIga2V5IGV2ZW50IGZyb20gc2VsZWN0aW5nIGEgZHJvcGRvd24gaXRlbSBpcyB0cmlnZ2VyZWQgaGVyZSBvbiB0aGUgaW5wdXQsIGJlY2F1c2UgdGhlIGRvY3VtZW50LmtleWRvd24gaGFuZGxlciB0aGF0IGluaXRpYWxseSBoYW5kbGVzIHRoYXQgZXZlbnQgdHJpZ2dlcnMgYSBmb2N1cyBvbiB0aGUgaW5wdXQsIGFuZCBzbyB0aGUga2V5dXAgZm9yIHRoYXQgc2FtZSBrZXkgZXZlbnQgZ2V0cyB0cmlnZ2VyZWQgaGVyZS4gd2VpcmQsIGJ1dCBqdXN0IG1ha2Ugc3VyZSB3ZSBkb250IGJvdGhlciBkb2luZyBhbnkgcmUtZm9ybWF0dGluZyBpbiB0aGlzIGNhc2UgKHdlJ3ZlIGFscmVhZHkgZG9uZSBwcmV2ZW50RGVmYXVsdCBpbiB0aGUga2V5ZG93biBoYW5kbGVyLCBzbyBpdCB3b250IGFjdHVhbGx5IHN1Ym1pdCB0aGUgZm9ybSBvciBhbnl0aGluZykuXG4gICAgICAgICAgICAgICAgLy8gQUxTTzogaWdub3JlIGtleXVwIGlmIHJlYWRvbmx5XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5cy5FTlRFUiB8fCB0aGF0LnRlbElucHV0LnByb3AoXCJyZWFkb25seVwiKSkge30gZWxzZSBpZiAodGhhdC5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGN1cnNvckF0RW5kIGRlZmF1bHRzIHRvIGZhbHNlIGZvciBiYWQgYnJvd3NlcnMgZWxzZSB0aGV5IHdvdWxkIG5ldmVyIGdldCBhIHJlZm9ybWF0IG9uIGRlbGV0ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgY3Vyc29yQXRFbmQgPSB0aGF0LmlzR29vZEJyb3dzZXIgJiYgdGhhdC50ZWxJbnB1dFswXS5zZWxlY3Rpb25TdGFydCA9PSB0aGF0LnRlbElucHV0LnZhbCgpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LnRlbElucHV0LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGV5IGp1c3QgY2xlYXJlZCB0aGUgaW5wdXQsIHVwZGF0ZSB0aGUgZmxhZyB0byB0aGUgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fdXBkYXRlRmxhZ0Zyb21OdW1iZXIoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PSBrZXlzLkRFTCAmJiAhY3Vyc29yQXRFbmQgfHwgZS53aGljaCA9PSBrZXlzLkJTUEFDRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgZGVsZXRlIGluIHRoZSBtaWRkbGU6IHJlZm9ybWF0IHdpdGggbm8gc3VmZml4IChubyBuZWVkIHRvIHJlZm9ybWF0IGlmIGRlbGV0ZSBhdCBlbmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBiYWNrc3BhY2U6IHJlZm9ybWF0IHdpdGggbm8gc3VmZml4IChuZWVkIHRvIHJlZm9ybWF0IGlmIGF0IGVuZCB0byByZW1vdmUgYW55IGxpbmdlcmluZyBzdWZmaXggLSB0aGlzIGlzIGEgZmVhdHVyZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGltcG9ydGFudCB0byByZW1lbWJlciBuZXZlciB0byBhZGQgc3VmZml4IG9uIGFueSBkZWxldGUga2V5IGFzIGNhbiBmdWNrIHVwIGluIGllOCBzbyB5b3UgY2FuIG5ldmVyIGRlbGV0ZSBhIGZvcm1hdHRpbmcgY2hhciBhdCB0aGUgZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVJbnB1dEtleSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2Vuc3VyZVBsdXMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBubyBhdXRvRm9ybWF0LCBqdXN0IHVwZGF0ZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3VwZGF0ZUZsYWdGcm9tTnVtYmVyKHRoYXQudGVsSW5wdXQudmFsKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyBwcmV2ZW50IGRlbGV0aW5nIHRoZSBwbHVzIChpZiBub3QgaW4gbmF0aW9uYWxNb2RlKVxuICAgICAgICBfZW5zdXJlUGx1czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gdGhpcy50ZWxJbnB1dC52YWwoKSwgaW5wdXQgPSB0aGlzLnRlbElucHV0WzBdO1xuICAgICAgICAgICAgICAgIGlmICh2YWwuY2hhckF0KDApICE9IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5ld0N1cnNvclBvcyBpcyBjdXJyZW50IHBvcyArIDEgdG8gYWNjb3VudCBmb3IgdGhlIHBsdXMgd2UgYXJlIGFib3V0IHRvIGFkZFxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Q3Vyc29yUG9zID0gdGhpcy5pc0dvb2RCcm93c2VyID8gaW5wdXQuc2VsZWN0aW9uU3RhcnQgKyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC52YWwoXCIrXCIgKyB2YWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0dvb2RCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShuZXdDdXJzb3JQb3MsIG5ld0N1cnNvclBvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFsZXJ0IHRoZSB1c2VyIHRvIGFuIGludmFsaWQga2V5IGV2ZW50XG4gICAgICAgIF9oYW5kbGVJbnZhbGlkS2V5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQudHJpZ2dlcihcImludmFsaWRrZXlcIikuYWRkQ2xhc3MoXCJpdGktaW52YWxpZC1rZXlcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQucmVtb3ZlQ2xhc3MoXCJpdGktaW52YWxpZC1rZXlcIik7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9LFxuICAgICAgICAvLyB3aGVuIGF1dG9Gb3JtYXQgaXMgZW5hYmxlZDogaGFuZGxlIHZhcmlvdXMga2V5IGV2ZW50cyBvbiB0aGUgaW5wdXQ6XG4gICAgICAgIC8vIDEpIGFkZGluZyBhIG5ldyBudW1iZXIgY2hhcmFjdGVyLCB3aGljaCB3aWxsIHJlcGxhY2UgYW55IHNlbGVjdGlvbiwgcmVmb3JtYXQsIGFuZCBwcmVzZXJ2ZSB0aGUgY3Vyc29yIHBvc2l0aW9uXG4gICAgICAgIC8vIDIpIHJlZm9ybWF0dGluZyBvbiBiYWNrc3BhY2UvZGVsZXRlXG4gICAgICAgIC8vIDMpIGN1dC9wYXN0ZSBldmVudFxuICAgICAgICBfaGFuZGxlSW5wdXRLZXk6IGZ1bmN0aW9uKG5ld051bWVyaWNDaGFyLCBhZGRTdWZmaXgsIGlzQWxsb3dlZEtleSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudGVsSW5wdXQudmFsKCksIGNsZWFuQmVmb3JlID0gdGhpcy5fZ2V0Q2xlYW4odmFsKSwgb3JpZ2luYWxMZWZ0Q2hhcnMsIC8vIHJhdyBET00gZWxlbWVudFxuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLnRlbElucHV0WzBdLCBkaWdpdHNPblJpZ2h0ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzR29vZEJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBjdXJzb3Igc3RyYXRlZ3k6IG1haW50YWluIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9uIHRoZSByaWdodC4gd2UgdXNlIHRoZSByaWdodCBpbnN0ZWFkIG9mIHRoZSBsZWZ0IHNvIHRoYXQgQSkgd2UgZG9udCBoYXZlIHRvIGFjY291bnQgZm9yIHRoZSBuZXcgZGlnaXQgKG9yIG11bHRpcGxlIGRpZ2l0cyBpZiBwYXN0ZSBldmVudCksIGFuZCBCKSB3ZSdyZSBhbHdheXMgb24gdGhlIHJpZ2h0IHNpZGUgb2YgZm9ybWF0dGluZyBzdWZmaXhlc1xuICAgICAgICAgICAgICAgIGRpZ2l0c09uUmlnaHQgPSB0aGlzLl9nZXREaWdpdHNPblJpZ2h0KHZhbCwgaW5wdXQuc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBoYW5kbGluZyBhIG5ldyBudW1iZXIgY2hhcmFjdGVyOiBpbnNlcnQgaXQgaW4gdGhlIHJpZ2h0IHBsYWNlXG4gICAgICAgICAgICAgICAgaWYgKG5ld051bWVyaWNDaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgYW55IHNlbGVjdGlvbiB0aGV5IG1heSBoYXZlIG1hZGUgd2l0aCB0aGUgbmV3IGNoYXJcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gdmFsLnN1YnN0cigwLCBpbnB1dC5zZWxlY3Rpb25TdGFydCkgKyBuZXdOdW1lcmljQ2hhciArIHZhbC5zdWJzdHJpbmcoaW5wdXQuc2VsZWN0aW9uRW5kLCB2YWwubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBoZXJlIHdlJ3JlIG5vdCBoYW5kbGluZyBhIG5ldyBjaGFyLCB3ZSdyZSBqdXN0IGRvaW5nIGEgcmUtZm9ybWF0IChlLmcuIG9uIGRlbGV0ZS9iYWNrc3BhY2UvcGFzdGUsIGFmdGVyIHRoZSBmYWN0KSwgYnV0IHdlIHN0aWxsIG5lZWQgdG8gbWFpbnRhaW4gdGhlIGN1cnNvciBwb3NpdGlvbi4gc28gbWFrZSBub3RlIG9mIHRoZSBjaGFyIG9uIHRoZSBsZWZ0LCBhbmQgdGhlbiBhZnRlciB0aGUgcmUtZm9ybWF0LCB3ZSdsbCBjb3VudCBpbiB0aGUgc2FtZSBudW1iZXIgb2YgZGlnaXRzIGZyb20gdGhlIHJpZ2h0LCBhbmQgdGhlbiBrZWVwIGdvaW5nIHRocm91Z2ggYW55IGZvcm1hdHRpbmcgY2hhcnMgdW50aWwgd2UgaGl0IHRoZSBzYW1lIGxlZnQgY2hhciB0aGF0IHdlIGhhZCBiZWZvcmUuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVQREFURTogbm93IGhhdmUgdG8gc3RvcmUgMiBjaGFycyBhcyBleHRlbnNpb25zIGZvcm1hdHRpbmcgY29udGFpbnMgMiBzcGFjZXMgc28geW91IG5lZWQgdG8gYmUgYWJsZSB0byBkaXN0aW5ndWlzaFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbExlZnRDaGFycyA9IHZhbC5zdWJzdHIoaW5wdXQuc2VsZWN0aW9uU3RhcnQgLSAyLCAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld051bWVyaWNDaGFyKSB7XG4gICAgICAgICAgICAgICAgdmFsICs9IG5ld051bWVyaWNDaGFyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBudW1iZXIgYW5kIGZsYWdcbiAgICAgICAgICAgIHRoaXMuc2V0TnVtYmVyKHZhbCwgbnVsbCwgYWRkU3VmZml4LCB0cnVlLCBpc0FsbG93ZWRLZXkpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjdXJzb3IgcG9zaXRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLmlzR29vZEJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3Q3Vyc29yO1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMudGVsSW5wdXQudmFsKCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgd2FzIGF0IHRoZSBlbmQsIGtlZXAgaXQgdGhlcmVcbiAgICAgICAgICAgICAgICBpZiAoIWRpZ2l0c09uUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q3Vyc29yID0gdmFsLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGNvdW50IGluIHRoZSBzYW1lIG51bWJlciBvZiBkaWdpdHMgZnJvbSB0aGUgcmlnaHRcbiAgICAgICAgICAgICAgICAgICAgbmV3Q3Vyc29yID0gdGhpcy5fZ2V0Q3Vyc29yRnJvbURpZ2l0c09uUmlnaHQodmFsLCBkaWdpdHNPblJpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGlmIGRlbGV0ZS9wYXN0ZSBldGMsIGtlZXAgZ29pbmcgbGVmdCB1bnRpbCBoaXQgdGhlIHNhbWUgbGVmdCBjaGFyIGFzIGJlZm9yZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5ld051bWVyaWNDaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDdXJzb3IgPSB0aGlzLl9nZXRDdXJzb3JGcm9tTGVmdENoYXIodmFsLCBuZXdDdXJzb3IsIG9yaWdpbmFsTGVmdENoYXJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIG5ldyBjdXJzb3JcbiAgICAgICAgICAgICAgICBpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShuZXdDdXJzb3IsIG5ld0N1cnNvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHdlIHN0YXJ0IGZyb20gdGhlIHBvc2l0aW9uIGluIGd1ZXNzQ3Vyc29yLCBhbmQgd29yayBvdXIgd2F5IGxlZnQgdW50aWwgd2UgaGl0IHRoZSBvcmlnaW5hbExlZnRDaGFycyBvciBhIG51bWJlciB0byBtYWtlIHN1cmUgdGhhdCBhZnRlciByZWZvcm1hdHRpbmcgdGhlIGN1cnNvciBoYXMgdGhlIHNhbWUgY2hhciBvbiB0aGUgbGVmdCBpbiB0aGUgY2FzZSBvZiBhIGRlbGV0ZSBldGNcbiAgICAgICAgX2dldEN1cnNvckZyb21MZWZ0Q2hhcjogZnVuY3Rpb24odmFsLCBndWVzc0N1cnNvciwgb3JpZ2luYWxMZWZ0Q2hhcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBndWVzc0N1cnNvcjsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0Q2hhciA9IHZhbC5jaGFyQXQoaSAtIDEpO1xuICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyhsZWZ0Q2hhcikgfHwgdmFsLnN1YnN0cihpIC0gMiwgMikgPT0gb3JpZ2luYWxMZWZ0Q2hhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFmdGVyIGEgcmVmb3JtYXQgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlcmUgYXJlIHN0aWxsIHRoZSBzYW1lIG51bWJlciBvZiBkaWdpdHMgdG8gdGhlIHJpZ2h0IG9mIHRoZSBjdXJzb3JcbiAgICAgICAgX2dldEN1cnNvckZyb21EaWdpdHNPblJpZ2h0OiBmdW5jdGlvbih2YWwsIGRpZ2l0c09uUmlnaHQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSB2YWwubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc051bWVyaWModmFsLmNoYXJBdChpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tZGlnaXRzT25SaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0IHRoZSBudW1iZXIgb2YgbnVtZXJpYyBkaWdpdHMgdG8gdGhlIHJpZ2h0IG9mIHRoZSBjdXJzb3Igc28gd2UgY2FuIHJlcG9zaXRpb24gdGhlIGN1cnNvciBjb3JyZWN0bHkgYWZ0ZXIgdGhlIHJlZm9ybWF0IGhhcyBoYXBwZW5lZFxuICAgICAgICBfZ2V0RGlnaXRzT25SaWdodDogZnVuY3Rpb24odmFsLCBzZWxlY3Rpb25FbmQpIHtcbiAgICAgICAgICAgIHZhciBkaWdpdHNPblJpZ2h0ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzZWxlY3Rpb25FbmQ7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc051bWVyaWModmFsLmNoYXJBdChpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlnaXRzT25SaWdodCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkaWdpdHNPblJpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICAvLyBsaXN0ZW4gZm9yIGZvY3VzIGFuZCBibHVyXG4gICAgICAgIF9pbml0Rm9jdXNMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlKSB7XG4gICAgICAgICAgICAgICAgLy8gbW91c2Vkb3duIGRlY2lkZXMgd2hlcmUgdGhlIGN1cnNvciBnb2VzLCBzbyBpZiB3ZSdyZSBmb2N1c2luZyB3ZSBtdXN0IHByZXZlbnREZWZhdWx0IGFzIHdlJ2xsIGJlIGluc2VydGluZyB0aGUgZGlhbCBjb2RlLCBhbmQgd2Ugd2FudCB0aGUgY3Vyc29yIHRvIGJlIGF0IHRoZSBlbmQgbm8gbWF0dGVyIHdoZXJlIHRoZXkgY2xpY2tcbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9uKFwibW91c2Vkb3duXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC50ZWxJbnB1dC5pcyhcIjpmb2N1c1wiKSAmJiAhdGhhdC50ZWxJbnB1dC52YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IHRoaXMgYWxzbyBjYW5jZWxzIHRoZSBmb2N1cywgc28gd2UgbXVzdCB0cmlnZ2VyIHRoYXQgbWFudWFsbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcImZvY3VzXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhhdC50ZWxJbnB1dC52YWwoKTtcbiAgICAgICAgICAgICAgICAvLyBzYXZlIHRoaXMgdG8gY29tcGFyZSBvbiBibHVyXG4gICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5kYXRhKFwiZm9jdXNWYWxcIiwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIC8vIG9uIGZvY3VzOiBpZiBlbXB0eSwgaW5zZXJ0IHRoZSBkaWFsIGNvZGUgZm9yIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZmxhZ1xuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuYXV0b0hpZGVEaWFsQ29kZSAmJiAhdmFsdWUgJiYgIXRoYXQudGVsSW5wdXQucHJvcChcInJlYWRvbmx5XCIpICYmIHRoYXQuc2VsZWN0ZWRDb3VudHJ5RGF0YS5kaWFsQ29kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll91cGRhdGVWYWwoXCIrXCIgKyB0aGF0LnNlbGVjdGVkQ291bnRyeURhdGEuZGlhbENvZGUsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciBhdXRvLWluc2VydGluZyBhIGRpYWwgY29kZSwgaWYgdGhlIGZpcnN0IGtleSB0aGV5IGhpdCBpcyAnKycgdGhlbiBhc3N1bWUgdGhleSBhcmUgZW50ZXJpbmcgYSBuZXcgbnVtYmVyLCBzbyByZW1vdmUgdGhlIGRpYWwgY29kZS4gdXNlIGtleXByZXNzIGluc3RlYWQgb2Yga2V5ZG93biBiZWNhdXNlIGtleWRvd24gZ2V0cyB0cmlnZ2VyZWQgZm9yIHRoZSBzaGlmdCBrZXkgKHJlcXVpcmVkIHRvIGhpdCB0aGUgKyBrZXkpLCBhbmQgaW5zdGVhZCBvZiBrZXl1cCBiZWNhdXNlIHRoYXQgc2hvd3MgdGhlIG5ldyAnKycgYmVmb3JlIHJlbW92aW5nIHRoZSBvbGQgb25lXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQub25lKFwia2V5cHJlc3MucGx1c1wiICsgdGhhdC5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5cy5QTFVTKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgYXV0b0Zvcm1hdCBpcyBlbmFibGVkLCB0aGlzIGtleSBldmVudCB3aWxsIGhhdmUgYWxyZWFkeSBoYXZlIGJlZW4gaGFuZGxlZCBieSBhbm90aGVyIGtleXByZXNzIGxpc3RlbmVyIChoZW5jZSB3ZSBuZWVkIHRvIGFkZCB0aGUgXCIrXCIpLiBpZiBkaXNhYmxlZCwgaXQgd2lsbCBiZSBoYW5kbGVkIGFmdGVyIHRoaXMgYnkgYSBrZXl1cCBsaXN0ZW5lciAoaGVuY2Ugbm8gbmVlZCB0byBhZGQgdGhlIFwiK1wiKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsID0gdGhhdC5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzID8gXCIrXCIgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQudmFsKG5ld1ZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0YWJiaW5nIGluLCBtYWtlIHN1cmUgdGhlIGN1cnNvciBpcyBhdCB0aGUgZW5kIHdlIG11c3QgdXNlIHNldFRpbWVvdXQgdG8gZ2V0IG91dHNpZGUgb2YgdGhlIGZvY3VzIGhhbmRsZXIgYXMgaXQgc2VlbXMgdGhlIHNlbGVjdGlvbiBoYXBwZW5zIGFmdGVyIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoYXQudGVsSW5wdXRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5pc0dvb2RCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IHRoYXQudGVsSW5wdXQudmFsKCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnNldFNlbGVjdGlvblJhbmdlKGxlbiwgbGVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9uKFwiYmx1clwiICsgdGhpcy5ucywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9uIGJsdXI6IGlmIGp1c3QgYSBkaWFsIGNvZGUgdGhlbiByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhhdC50ZWxJbnB1dC52YWwoKSwgc3RhcnRzUGx1cyA9IHZhbHVlLmNoYXJBdCgwKSA9PSBcIitcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0c1BsdXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lcmljID0gdGhhdC5fZ2V0TnVtZXJpYyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBqdXN0IGEgcGx1cywgb3IgaWYganVzdCBhIGRpYWwgY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFudW1lcmljIHx8IHRoYXQuc2VsZWN0ZWRDb3VudHJ5RGF0YS5kaWFsQ29kZSA9PSBudW1lcmljKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC52YWwoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBrZXlwcmVzcyBsaXN0ZW5lciB3ZSBhZGRlZCBvbiBmb2N1c1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0Lm9mZihcImtleXByZXNzLnBsdXNcIiArIHRoYXQubnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiBhdXRvRm9ybWF0LCB3ZSBtdXN0IG1hbnVhbGx5IHRyaWdnZXIgY2hhbmdlIGV2ZW50IGlmIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5hdXRvRm9ybWF0ICYmIHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscyAmJiB0aGF0LnRlbElucHV0LnZhbCgpICE9IHRoYXQudGVsSW5wdXQuZGF0YShcImZvY3VzVmFsXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZXh0cmFjdCB0aGUgbnVtZXJpYyBkaWdpdHMgZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICAgIF9nZXROdW1lcmljOiBmdW5jdGlvbihzKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9cXEQvZywgXCJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIF9nZXRDbGVhbjogZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgdmFyIHByZWZpeCA9IHMuY2hhckF0KDApID09IFwiK1wiID8gXCIrXCIgOiBcIlwiO1xuICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIHRoaXMuX2dldE51bWVyaWMocyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNob3cgdGhlIGRyb3Bkb3duXG4gICAgICAgIF9zaG93RHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0RHJvcGRvd25Qb3NpdGlvbigpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIGhpZ2hsaWdodGluZyBhbmQgc2Nyb2xsIHRvIGFjdGl2ZSBsaXN0IGl0ZW1cbiAgICAgICAgICAgIHZhciBhY3RpdmVMaXN0SXRlbSA9IHRoaXMuY291bnRyeUxpc3QuY2hpbGRyZW4oXCIuYWN0aXZlXCIpO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZUxpc3RJdGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hsaWdodExpc3RJdGVtKGFjdGl2ZUxpc3RJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNob3cgaXRcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZUxpc3RJdGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvKGFjdGl2ZUxpc3RJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJpbmQgYWxsIHRoZSBkcm9wZG93bi1yZWxhdGVkIGxpc3RlbmVyczogbW91c2VvdmVyLCBjbGljaywgY2xpY2stb2ZmLCBrZXlkb3duXG4gICAgICAgICAgICB0aGlzLl9iaW5kRHJvcGRvd25MaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIuY2hpbGRyZW4oXCIuYXJyb3dcIikuYWRkQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZGVjaWRlIHdoZXJlIHRvIHBvc2l0aW9uIGRyb3Bkb3duIChkZXBlbmRzIG9uIHBvc2l0aW9uIHdpdGhpbiB2aWV3cG9ydCwgYW5kIHNjcm9sbClcbiAgICAgICAgX3NldERyb3Bkb3duUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlucHV0VG9wID0gdGhpcy50ZWxJbnB1dC5vZmZzZXQoKS50b3AsIHdpbmRvd1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSwgLy8gZHJvcGRvd25GaXRzQmVsb3cgPSAoZHJvcGRvd25Cb3R0b20gPCB3aW5kb3dCb3R0b20pXG4gICAgICAgICAgICBkcm9wZG93bkZpdHNCZWxvdyA9IGlucHV0VG9wICsgdGhpcy50ZWxJbnB1dC5vdXRlckhlaWdodCgpICsgdGhpcy5kcm9wZG93bkhlaWdodCA8IHdpbmRvd1RvcCArICQod2luZG93KS5oZWlnaHQoKSwgZHJvcGRvd25GaXRzQWJvdmUgPSBpbnB1dFRvcCAtIHRoaXMuZHJvcGRvd25IZWlnaHQgPiB3aW5kb3dUb3A7XG4gICAgICAgICAgICAvLyBkcm9wZG93bkhlaWdodCAtIDEgZm9yIGJvcmRlclxuICAgICAgICAgICAgdmFyIGNzc1RvcCA9ICFkcm9wZG93bkZpdHNCZWxvdyAmJiBkcm9wZG93bkZpdHNBYm92ZSA/IFwiLVwiICsgKHRoaXMuZHJvcGRvd25IZWlnaHQgLSAxKSArIFwicHhcIiA6IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0LmNzcyhcInRvcFwiLCBjc3NUb3ApO1xuICAgICAgICB9LFxuICAgICAgICAvLyB3ZSBvbmx5IGJpbmQgZHJvcGRvd24gbGlzdGVuZXJzIHdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW5cbiAgICAgICAgX2JpbmREcm9wZG93bkxpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAvLyB3aGVuIG1vdXNlIG92ZXIgYSBsaXN0IGl0ZW0sIGp1c3QgaGlnaGxpZ2h0IHRoYXQgb25lXG4gICAgICAgICAgICAvLyB3ZSBhZGQgdGhlIGNsYXNzIFwiaGlnaGxpZ2h0XCIsIHNvIGlmIHRoZXkgaGl0IFwiZW50ZXJcIiB3ZSBrbm93IHdoaWNoIG9uZSB0byBzZWxlY3RcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3Qub24oXCJtb3VzZW92ZXJcIiArIHRoaXMubnMsIFwiLmNvdW50cnlcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHRoYXQuX2hpZ2hsaWdodExpc3RJdGVtKCQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBsaXN0ZW4gZm9yIGNvdW50cnkgc2VsZWN0aW9uXG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0Lm9uKFwiY2xpY2tcIiArIHRoaXMubnMsIFwiLmNvdW50cnlcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHRoYXQuX3NlbGVjdExpc3RJdGVtKCQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBjbGljayBvZmYgdG8gY2xvc2VcbiAgICAgICAgICAgIC8vIChleGNlcHQgd2hlbiB0aGlzIGluaXRpYWwgb3BlbmluZyBjbGljayBpcyBidWJibGluZyB1cClcbiAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBqdXN0IHN0b3BQcm9wYWdhdGlvbiBhcyBpdCBtYXkgYmUgbmVlZGVkIHRvIGNsb3NlIGFub3RoZXIgaW5zdGFuY2VcbiAgICAgICAgICAgIHZhciBpc09wZW5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgJChcImh0bWxcIikub24oXCJjbGlja1wiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNPcGVuaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2Nsb3NlRHJvcGRvd24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXNPcGVuaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGxpc3RlbiBmb3IgdXAvZG93biBzY3JvbGxpbmcsIGVudGVyIHRvIHNlbGVjdCwgb3IgbGV0dGVycyB0byBqdW1wIHRvIGNvdW50cnkgbmFtZS5cbiAgICAgICAgICAgIC8vIHVzZSBrZXlkb3duIGFzIGtleXByZXNzIGRvZXNuJ3QgZmlyZSBmb3Igbm9uLWNoYXIga2V5cyBhbmQgd2Ugd2FudCB0byBjYXRjaCBpZiB0aGV5XG4gICAgICAgICAgICAvLyBqdXN0IGhpdCBkb3duIGFuZCBob2xkIGl0IHRvIHNjcm9sbCBkb3duIChubyBrZXl1cCBldmVudCkuXG4gICAgICAgICAgICAvLyBsaXN0ZW4gb24gdGhlIGRvY3VtZW50IGJlY2F1c2UgdGhhdCdzIHdoZXJlIGtleSBldmVudHMgYXJlIHRyaWdnZXJlZCBpZiBubyBpbnB1dCBoYXMgZm9jdXNcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IFwiXCIsIHF1ZXJ5VGltZXIgPSBudWxsO1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgLy8gcHJldmVudCBkb3duIGtleSBmcm9tIHNjcm9sbGluZyB0aGUgd2hvbGUgcGFnZSxcbiAgICAgICAgICAgICAgICAvLyBhbmQgZW50ZXIga2V5IGZyb20gc3VibWl0dGluZyBhIGZvcm0gZXRjXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleXMuVVAgfHwgZS53aGljaCA9PSBrZXlzLkRPV04pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXAgYW5kIGRvd24gdG8gbmF2aWdhdGVcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5faGFuZGxlVXBEb3duS2V5KGUud2hpY2gpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PSBrZXlzLkVOVEVSKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVudGVyIHRvIHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVFbnRlcktleSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PSBrZXlzLkVTQykge1xuICAgICAgICAgICAgICAgICAgICAvLyBlc2MgdG8gY2xvc2VcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY2xvc2VEcm9wZG93bigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA+PSBrZXlzLkEgJiYgZS53aGljaCA8PSBrZXlzLlogfHwgZS53aGljaCA9PSBrZXlzLlNQQUNFKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyIGNhc2UgbGV0dGVycyAobm90ZToga2V5dXAva2V5ZG93biBvbmx5IHJldHVybiB1cHBlciBjYXNlIGxldHRlcnMpXG4gICAgICAgICAgICAgICAgICAgIC8vIGp1bXAgdG8gY291bnRyaWVzIHRoYXQgc3RhcnQgd2l0aCB0aGUgcXVlcnkgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmIChxdWVyeVRpbWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocXVlcnlUaW1lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcXVlcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fc2VhcmNoRm9yQ291bnRyeShxdWVyeSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB0aW1lciBoaXRzIDEgc2Vjb25kLCByZXNldCB0aGUgcXVlcnlcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH0sIDFlMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGhpZ2hsaWdodCB0aGUgbmV4dC9wcmV2IGl0ZW0gaW4gdGhlIGxpc3QgKGFuZCBlbnN1cmUgaXQgaXMgdmlzaWJsZSlcbiAgICAgICAgX2hhbmRsZVVwRG93bktleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuY291bnRyeUxpc3QuY2hpbGRyZW4oXCIuaGlnaGxpZ2h0XCIpLmZpcnN0KCk7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IGtleSA9PSBrZXlzLlVQID8gY3VycmVudC5wcmV2KCkgOiBjdXJyZW50Lm5leHQoKTtcbiAgICAgICAgICAgIGlmIChuZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIHNraXAgdGhlIGRpdmlkZXJcbiAgICAgICAgICAgICAgICBpZiAobmV4dC5oYXNDbGFzcyhcImRpdmlkZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IGtleSA9PSBrZXlzLlVQID8gbmV4dC5wcmV2KCkgOiBuZXh0Lm5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0TGlzdEl0ZW0obmV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG8obmV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNlbGVjdCB0aGUgY3VycmVudGx5IGhpZ2hsaWdodGVkIGl0ZW1cbiAgICAgICAgX2hhbmRsZUVudGVyS2V5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q291bnRyeSA9IHRoaXMuY291bnRyeUxpc3QuY2hpbGRyZW4oXCIuaGlnaGxpZ2h0XCIpLmZpcnN0KCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudENvdW50cnkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0TGlzdEl0ZW0oY3VycmVudENvdW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBmaW5kIHRoZSBmaXJzdCBsaXN0IGl0ZW0gd2hvc2UgbmFtZSBzdGFydHMgd2l0aCB0aGUgcXVlcnkgc3RyaW5nXG4gICAgICAgIF9zZWFyY2hGb3JDb3VudHJ5OiBmdW5jdGlvbihxdWVyeSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydHNXaXRoKHRoaXMuY291bnRyaWVzW2ldLm5hbWUsIHF1ZXJ5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdEl0ZW0gPSB0aGlzLmNvdW50cnlMaXN0LmNoaWxkcmVuKFwiW2RhdGEtY291bnRyeS1jb2RlPVwiICsgdGhpcy5jb3VudHJpZXNbaV0uaXNvMiArIFwiXVwiKS5ub3QoXCIucHJlZmVycmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgaGlnaGxpZ2h0aW5nIGFuZCBzY3JvbGxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0TGlzdEl0ZW0obGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxUbyhsaXN0SXRlbSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2hlY2sgaWYgKHVwcGVyY2FzZSkgc3RyaW5nIGEgc3RhcnRzIHdpdGggc3RyaW5nIGJcbiAgICAgICAgX3N0YXJ0c1dpdGg6IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnN1YnN0cigwLCBiLmxlbmd0aCkudG9VcHBlckNhc2UoKSA9PSBiO1xuICAgICAgICB9LFxuICAgICAgICAvLyB1cGRhdGUgdGhlIGlucHV0J3MgdmFsdWUgdG8gdGhlIGdpdmVuIHZhbFxuICAgICAgICAvLyBpZiBhdXRvRm9ybWF0PXRydWUsIGZvcm1hdCBpdCBmaXJzdCBhY2NvcmRpbmcgdG8gdGhlIGNvdW50cnktc3BlY2lmaWMgZm9ybWF0dGluZyBydWxlc1xuICAgICAgICAvLyBOb3RlOiBwcmV2ZW50Q29udmVyc2lvbiB3aWxsIGJlIGZhbHNlIChpLmUuIHdlIGFsbG93IGNvbnZlcnNpb24pIG9uIGluaXQgYW5kIHdoZW4gZGV2IGNhbGxzIHB1YmxpYyBtZXRob2Qgc2V0TnVtYmVyXG4gICAgICAgIF91cGRhdGVWYWw6IGZ1bmN0aW9uKHZhbCwgZm9ybWF0LCBhZGRTdWZmaXgsIHByZXZlbnRDb252ZXJzaW9uLCBpc0FsbG93ZWRLZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzICYmIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm9ybWF0ID09IFwibnVtYmVyXCIgJiYgaW50bFRlbElucHV0VXRpbHMuaXNWYWxpZE51bWJlcih2YWwsIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2VyIHNwZWNpZmllZCBhIGZvcm1hdCwgYW5kIGl0J3MgYSB2YWxpZCBudW1iZXIsIHRoZW4gZm9ybWF0IGl0IGFjY29yZGluZ2x5XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IGludGxUZWxJbnB1dFV0aWxzLmZvcm1hdE51bWJlckJ5VHlwZSh2YWwsIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCBmb3JtYXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXByZXZlbnRDb252ZXJzaW9uICYmIHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUgJiYgdmFsLmNoYXJBdCgwKSA9PSBcIitcIiAmJiBpbnRsVGVsSW5wdXRVdGlscy5pc1ZhbGlkTnVtYmVyKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5hdGlvbmFsTW9kZSBhbmQgd2UgaGF2ZSBhIHZhbGlkIGludGwgbnVtYmVyLCBjb252ZXJ0IGl0IHRvIG50bFxuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgPSBpbnRsVGVsSW5wdXRVdGlscy5mb3JtYXROdW1iZXJCeVR5cGUodmFsLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgaW50bFRlbElucHV0VXRpbHMubnVtYmVyRm9ybWF0Lk5BVElPTkFMKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGRvIHRoZSByZWd1bGFyIEFzWW91VHlwZSBmb3JtYXR0aW5nXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IGludGxUZWxJbnB1dFV0aWxzLmZvcm1hdE51bWJlcih2YWwsIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCBhZGRTdWZmaXgsIHRoaXMub3B0aW9ucy5hbGxvd0V4dGVuc2lvbnMsIGlzQWxsb3dlZEtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB3ZSBkb250IGdvIG92ZXIgbWF4bGVuZ3RoLiB3ZSBtdXN0IGRvIHRoaXMgaGVyZSB0byB0cnVuY2F0ZSBhbnkgZm9ybWF0dGluZyBzdWZmaXgsIGFuZCBhbHNvIGhhbmRsZSBwYXN0ZSBldmVudHNcbiAgICAgICAgICAgICAgICB2YXIgbWF4ID0gdGhpcy50ZWxJbnB1dC5hdHRyKFwibWF4bGVuZ3RoXCIpO1xuICAgICAgICAgICAgICAgIGlmIChtYXggJiYgZm9ybWF0dGVkLmxlbmd0aCA+IG1heCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgPSBmb3JtYXR0ZWQuc3Vic3RyKDAsIG1heCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBubyBhdXRvRm9ybWF0LCBzbyBqdXN0IGluc2VydCB0aGUgb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LnZhbChmb3JtYXR0ZWQpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBjaGVjayBpZiBuZWVkIHRvIHNlbGVjdCBhIG5ldyBmbGFnIGJhc2VkIG9uIHRoZSBnaXZlbiBudW1iZXJcbiAgICAgICAgX3VwZGF0ZUZsYWdGcm9tTnVtYmVyOiBmdW5jdGlvbihudW1iZXIsIHVwZGF0ZURlZmF1bHQpIHtcbiAgICAgICAgICAgIC8vIGlmIHdlJ3JlIGluIG5hdGlvbmFsTW9kZSBhbmQgd2UncmUgb24gVVMvQ2FuYWRhLCBtYWtlIHN1cmUgdGhlIG51bWJlciBzdGFydHMgd2l0aCBhICsxIHNvIF9nZXREaWFsQ29kZSB3aWxsIGJlIGFibGUgdG8gZXh0cmFjdCB0aGUgYXJlYSBjb2RlXG4gICAgICAgICAgICAvLyB1cGRhdGU6IGlmIHdlIGRvbnQgeWV0IGhhdmUgc2VsZWN0ZWRDb3VudHJ5RGF0YSwgYnV0IHdlJ3JlIGhlcmUgKHRyeWluZyB0byB1cGRhdGUgdGhlIGZsYWcgZnJvbSB0aGUgbnVtYmVyKSwgdGhhdCBtZWFucyB3ZSdyZSBpbml0aWFsaXNpbmcgdGhlIHBsdWdpbiB3aXRoIGEgbnVtYmVyIHRoYXQgYWxyZWFkeSBoYXMgYSBkaWFsIGNvZGUsIHNvIGZpbmUgdG8gaWdub3JlIHRoaXMgYml0XG4gICAgICAgICAgICBpZiAobnVtYmVyICYmIHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhICYmIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5kaWFsQ29kZSA9PSBcIjFcIiAmJiBudW1iZXIuY2hhckF0KDApICE9IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlci5jaGFyQXQoMCkgIT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyID0gXCIxXCIgKyBudW1iZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG51bWJlciA9IFwiK1wiICsgbnVtYmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdHJ5IGFuZCBleHRyYWN0IHZhbGlkIGRpYWwgY29kZSBmcm9tIGlucHV0XG4gICAgICAgICAgICB2YXIgZGlhbENvZGUgPSB0aGlzLl9nZXREaWFsQ29kZShudW1iZXIpLCBjb3VudHJ5Q29kZSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoZGlhbENvZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBvbmUgb2YgdGhlIG1hdGNoaW5nIGNvdW50cmllcyBpcyBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50cnlDb2RlcyA9IHRoaXMuY291bnRyeUNvZGVzW3RoaXMuX2dldE51bWVyaWMoZGlhbENvZGUpXSwgYWxyZWFkeVNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhICYmICQuaW5BcnJheSh0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgY291bnRyeUNvZGVzKSAhPSAtMTtcbiAgICAgICAgICAgICAgICAvLyBpZiBhIG1hdGNoaW5nIGNvdW50cnkgaXMgbm90IGFscmVhZHkgc2VsZWN0ZWQgKG9yIHRoaXMgaXMgYW4gdW5rbm93biBOQU5QIGFyZWEgY29kZSk6IGNob29zZSB0aGUgZmlyc3QgaW4gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBpZiAoIWFscmVhZHlTZWxlY3RlZCB8fCB0aGlzLl9pc1Vua25vd25OYW5wKG51bWJlciwgZGlhbENvZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHVzaW5nIG9ubHlDb3VudHJpZXMgb3B0aW9uLCBjb3VudHJ5Q29kZXNbMF0gbWF5IGJlIGVtcHR5LCBzbyB3ZSBtdXN0IGZpbmQgdGhlIGZpcnN0IG5vbi1lbXB0eSBpbmRleFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvdW50cnlDb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50cnlDb2Rlc1tqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlID0gY291bnRyeUNvZGVzW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIuY2hhckF0KDApID09IFwiK1wiICYmIHRoaXMuX2dldE51bWVyaWMobnVtYmVyKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIGRpYWwgY29kZSwgc28gZW1wdHlcbiAgICAgICAgICAgICAgICAvLyBOb3RlOiB1c2UgZ2V0TnVtZXJpYyBoZXJlIGJlY2F1c2UgdGhlIG51bWJlciBoYXMgbm90IGJlZW4gZm9ybWF0dGVkIHlldCwgc28gY291bGQgY29udGFpbiBiYWQgc2hpdFxuICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlID0gXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIW51bWJlciB8fCBudW1iZXIgPT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBlbXB0eSwgb3IganVzdCBhIHBsdXMsIHNvIGRlZmF1bHRcbiAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZSA9IHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeS5pc28yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvdW50cnlDb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0RmxhZyhjb3VudHJ5Q29kZSwgdXBkYXRlRGVmYXVsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBnaXZlbiBudW1iZXIgY29udGFpbnMgYW4gdW5rbm93biBhcmVhIGNvZGUgZnJvbSB0aGUgTm9ydGggQW1lcmljYW4gTnVtYmVyaW5nIFBsYW4gaS5lLiB0aGUgb25seSBkaWFsQ29kZSB0aGF0IGNvdWxkIGJlIGV4dHJhY3RlZCB3YXMgKzEgYnV0IHRoZSBhY3R1YWwgbnVtYmVyJ3MgbGVuZ3RoIGlzID49NFxuICAgICAgICBfaXNVbmtub3duTmFucDogZnVuY3Rpb24obnVtYmVyLCBkaWFsQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRpYWxDb2RlID09IFwiKzFcIiAmJiB0aGlzLl9nZXROdW1lcmljKG51bWJlcikubGVuZ3RoID49IDQ7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHJlbW92ZSBoaWdobGlnaHRpbmcgZnJvbSBvdGhlciBsaXN0IGl0ZW1zIGFuZCBoaWdobGlnaHQgdGhlIGdpdmVuIGl0ZW1cbiAgICAgICAgX2hpZ2hsaWdodExpc3RJdGVtOiBmdW5jdGlvbihsaXN0SXRlbSkge1xuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdEl0ZW1zLnJlbW92ZUNsYXNzKFwiaGlnaGxpZ2h0XCIpO1xuICAgICAgICAgICAgbGlzdEl0ZW0uYWRkQ2xhc3MoXCJoaWdobGlnaHRcIik7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGZpbmQgdGhlIGNvdW50cnkgZGF0YSBmb3IgdGhlIGdpdmVuIGNvdW50cnkgY29kZVxuICAgICAgICAvLyB0aGUgaWdub3JlT25seUNvdW50cmllc09wdGlvbiBpcyBvbmx5IHVzZWQgZHVyaW5nIGluaXQoKSB3aGlsZSBwYXJzaW5nIHRoZSBvbmx5Q291bnRyaWVzIGFycmF5XG4gICAgICAgIF9nZXRDb3VudHJ5RGF0YTogZnVuY3Rpb24oY291bnRyeUNvZGUsIGlnbm9yZU9ubHlDb3VudHJpZXNPcHRpb24sIGFsbG93RmFpbCkge1xuICAgICAgICAgICAgdmFyIGNvdW50cnlMaXN0ID0gaWdub3JlT25seUNvdW50cmllc09wdGlvbiA/IGFsbENvdW50cmllcyA6IHRoaXMuY291bnRyaWVzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudHJ5TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChjb3VudHJ5TGlzdFtpXS5pc28yID09IGNvdW50cnlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3VudHJ5TGlzdFtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxsb3dGYWlsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGNvdW50cnkgZGF0YSBmb3IgJ1wiICsgY291bnRyeUNvZGUgKyBcIidcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNlbGVjdCB0aGUgZ2l2ZW4gZmxhZywgdXBkYXRlIHRoZSBwbGFjZWhvbGRlciBhbmQgdGhlIGFjdGl2ZSBsaXN0IGl0ZW1cbiAgICAgICAgX3NlbGVjdEZsYWc6IGZ1bmN0aW9uKGNvdW50cnlDb2RlLCB1cGRhdGVEZWZhdWx0KSB7XG4gICAgICAgICAgICAvLyBkbyB0aGlzIGZpcnN0IGFzIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3IgYW5kIHN0b3AgaWYgY291bnRyeUNvZGUgaXMgaW52YWxpZFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhID0gY291bnRyeUNvZGUgPyB0aGlzLl9nZXRDb3VudHJ5RGF0YShjb3VudHJ5Q29kZSwgZmFsc2UsIGZhbHNlKSA6IHt9O1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBcImRlZmF1bHRDb3VudHJ5XCIgLSB3ZSBvbmx5IG5lZWQgdGhlIGlzbzIgZnJvbSBub3cgb24sIHNvIGp1c3Qgc3RvcmUgdGhhdFxuICAgICAgICAgICAgaWYgKHVwZGF0ZURlZmF1bHQgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIpIHtcbiAgICAgICAgICAgICAgICAvLyBjYW4ndCBqdXN0IG1ha2UgdGhpcyBlcXVhbCB0byBzZWxlY3RlZENvdW50cnlEYXRhIGFzIHdvdWxkIGJlIGEgcmVmIHRvIHRoYXQgb2JqZWN0XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICBpc28yOiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLmF0dHIoXCJjbGFzc1wiLCBcIml0aS1mbGFnIFwiICsgY291bnRyeUNvZGUpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBzZWxlY3RlZCBjb3VudHJ5J3MgdGl0bGUgYXR0cmlidXRlXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBjb3VudHJ5Q29kZSA/IHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5uYW1lICsgXCI6ICtcIiArIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5kaWFsQ29kZSA6IFwiVW5rbm93blwiO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5wYXJlbnQoKS5hdHRyKFwidGl0bGVcIiwgdGl0bGUpO1xuICAgICAgICAgICAgLy8gYW5kIHRoZSBpbnB1dCdzIHBsYWNlaG9sZGVyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQbGFjZWhvbGRlcigpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0LnZhbChjb3VudHJ5Q29kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgYWN0aXZlIGxpc3QgaXRlbVxuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3RJdGVtcy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY291bnRyeUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdEl0ZW1zLmZpbmQoXCIuaXRpLWZsYWcuXCIgKyBjb3VudHJ5Q29kZSkuZmlyc3QoKS5jbG9zZXN0KFwiLmNvdW50cnlcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyB1cGRhdGUgdGhlIGlucHV0IHBsYWNlaG9sZGVyIHRvIGFuIGV4YW1wbGUgbnVtYmVyIGZyb20gdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb3VudHJ5XG4gICAgICAgIF91cGRhdGVQbGFjZWhvbGRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmludGxUZWxJbnB1dFV0aWxzICYmICF0aGlzLmhhZEluaXRpYWxQbGFjZWhvbGRlciAmJiB0aGlzLm9wdGlvbnMuYXV0b1BsYWNlaG9sZGVyICYmIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBpc28yID0gdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIG51bWJlclR5cGUgPSBpbnRsVGVsSW5wdXRVdGlscy5udW1iZXJUeXBlW3RoaXMub3B0aW9ucy5udW1iZXJUeXBlIHx8IFwiRklYRURfTElORVwiXSwgcGxhY2Vob2xkZXIgPSBpc28yID8gaW50bFRlbElucHV0VXRpbHMuZ2V0RXhhbXBsZU51bWJlcihpc28yLCB0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlLCBudW1iZXJUeXBlKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5hdHRyKFwicGxhY2Vob2xkZXJcIiwgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBjYWxsZWQgd2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgbGlzdCBpdGVtIGZyb20gdGhlIGRyb3Bkb3duXG4gICAgICAgIF9zZWxlY3RMaXN0SXRlbTogZnVuY3Rpb24obGlzdEl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBjb3VudHJ5Q29kZUF0dHIgPSB0aGlzLmlzTW9iaWxlID8gXCJ2YWx1ZVwiIDogXCJkYXRhLWNvdW50cnktY29kZVwiO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHNlbGVjdGVkIGZsYWcgYW5kIGFjdGl2ZSBsaXN0IGl0ZW1cbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdEZsYWcobGlzdEl0ZW0uYXR0cihjb3VudHJ5Q29kZUF0dHIpLCB0cnVlKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURpYWxDb2RlKGxpc3RJdGVtLmF0dHIoXCJkYXRhLWRpYWwtY29kZVwiKSwgdHJ1ZSk7XG4gICAgICAgICAgICAvLyBhbHdheXMgZmlyZSB0aGUgY2hhbmdlIGV2ZW50IGFzIGV2ZW4gaWYgbmF0aW9uYWxNb2RlPXRydWUgKGFuZCB3ZSBoYXZlbid0IHVwZGF0ZWQgdGhlIGlucHV0IHZhbCksIHRoZSBzeXN0ZW0gYXMgYSB3aG9sZSBoYXMgc3RpbGwgY2hhbmdlZCAtIHNlZSBjb3VudHJ5LXN5bmMgZXhhbXBsZS4gdGhpbmsgb2YgaXQgYXMgbWFraW5nIGEgc2VsZWN0aW9uIGZyb20gYSBzZWxlY3QgZWxlbWVudC5cbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICAgICAgICAgIC8vIGZvY3VzIHRoZSBpbnB1dFxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgLy8gZml4IGZvciBGRiBhbmQgSUUxMSAod2l0aCBuYXRpb25hbE1vZGU9ZmFsc2UgaS5lLiBhdXRvIGluc2VydGluZyBkaWFsIGNvZGUpLCB3aG8gdHJ5IHRvIHB1dCB0aGUgY3Vyc29yIGF0IHRoZSBiZWdpbm5pbmcgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgICAgIGlmICh0aGlzLmlzR29vZEJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVuID0gdGhpcy50ZWxJbnB1dC52YWwoKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy50ZWxJbnB1dFswXS5zZXRTZWxlY3Rpb25SYW5nZShsZW4sIGxlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNsb3NlIHRoZSBkcm9wZG93biBhbmQgdW5iaW5kIGFueSBsaXN0ZW5lcnNcbiAgICAgICAgX2Nsb3NlRHJvcGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5hZGRDbGFzcyhcImhpZGVcIik7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGFycm93XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLmNoaWxkcmVuKFwiLmFycm93XCIpLnJlbW92ZUNsYXNzKFwidXBcIik7XG4gICAgICAgICAgICAvLyB1bmJpbmQga2V5IGV2ZW50c1xuICAgICAgICAgICAgJChkb2N1bWVudCkub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgLy8gdW5iaW5kIGNsaWNrLW9mZi10by1jbG9zZVxuICAgICAgICAgICAgJChcImh0bWxcIikub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgLy8gdW5iaW5kIGhvdmVyIGFuZCBjbGljayBsaXN0ZW5lcnNcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3Qub2ZmKHRoaXMubnMpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBjaGVjayBpZiBhbiBlbGVtZW50IGlzIHZpc2libGUgd2l0aGluIGl0J3MgY29udGFpbmVyLCBlbHNlIHNjcm9sbCB1bnRpbCBpdCBpc1xuICAgICAgICBfc2Nyb2xsVG86IGZ1bmN0aW9uKGVsZW1lbnQsIG1pZGRsZSkge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY291bnRyeUxpc3QsIGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQoKSwgY29udGFpbmVyVG9wID0gY29udGFpbmVyLm9mZnNldCgpLnRvcCwgY29udGFpbmVyQm90dG9tID0gY29udGFpbmVyVG9wICsgY29udGFpbmVySGVpZ2h0LCBlbGVtZW50SGVpZ2h0ID0gZWxlbWVudC5vdXRlckhlaWdodCgpLCBlbGVtZW50VG9wID0gZWxlbWVudC5vZmZzZXQoKS50b3AsIGVsZW1lbnRCb3R0b20gPSBlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCwgbmV3U2Nyb2xsVG9wID0gZWxlbWVudFRvcCAtIGNvbnRhaW5lclRvcCArIGNvbnRhaW5lci5zY3JvbGxUb3AoKSwgbWlkZGxlT2Zmc2V0ID0gY29udGFpbmVySGVpZ2h0IC8gMiAtIGVsZW1lbnRIZWlnaHQgLyAyO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRUb3AgPCBjb250YWluZXJUb3ApIHtcbiAgICAgICAgICAgICAgICAvLyBzY3JvbGwgdXBcbiAgICAgICAgICAgICAgICBpZiAobWlkZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1Njcm9sbFRvcCAtPSBtaWRkbGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AobmV3U2Nyb2xsVG9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudEJvdHRvbSA+IGNvbnRhaW5lckJvdHRvbSkge1xuICAgICAgICAgICAgICAgIC8vIHNjcm9sbCBkb3duXG4gICAgICAgICAgICAgICAgaWYgKG1pZGRsZSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdTY3JvbGxUb3AgKz0gbWlkZGxlT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0RGlmZmVyZW5jZSA9IGNvbnRhaW5lckhlaWdodCAtIGVsZW1lbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvcChuZXdTY3JvbGxUb3AgLSBoZWlnaHREaWZmZXJlbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcmVwbGFjZSBhbnkgZXhpc3RpbmcgZGlhbCBjb2RlIHdpdGggdGhlIG5ldyBvbmUgKGlmIG5vdCBpbiBuYXRpb25hbE1vZGUpXG4gICAgICAgIC8vIGFsc28gd2UgbmVlZCB0byBrbm93IGlmIHdlJ3JlIGZvY3VzaW5nIGZvciBhIGNvdXBsZSBvZiByZWFzb25zIGUuZy4gaWYgc28sIHdlIHdhbnQgdG8gYWRkIGFueSBmb3JtYXR0aW5nIHN1ZmZpeCwgYWxzbyBpZiB0aGUgaW5wdXQgaXMgZW1wdHkgYW5kIHdlJ3JlIG5vdCBpbiBuYXRpb25hbE1vZGUsIHRoZW4gd2Ugd2FudCB0byBpbnNlcnQgdGhlIGRpYWwgY29kZVxuICAgICAgICBfdXBkYXRlRGlhbENvZGU6IGZ1bmN0aW9uKG5ld0RpYWxDb2RlLCBmb2N1c2luZykge1xuICAgICAgICAgICAgdmFyIGlucHV0VmFsID0gdGhpcy50ZWxJbnB1dC52YWwoKSwgbmV3TnVtYmVyO1xuICAgICAgICAgICAgLy8gc2F2ZSBoYXZpbmcgdG8gcGFzcyB0aGlzIGV2ZXJ5IHRpbWVcbiAgICAgICAgICAgIG5ld0RpYWxDb2RlID0gXCIrXCIgKyBuZXdEaWFsQ29kZTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlICYmIGlucHV0VmFsLmNoYXJBdCgwKSAhPSBcIitcIikge1xuICAgICAgICAgICAgICAgIC8vIGlmIG5hdGlvbmFsTW9kZSwgd2UganVzdCB3YW50IHRvIHJlLWZvcm1hdFxuICAgICAgICAgICAgICAgIG5ld051bWJlciA9IGlucHV0VmFsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dFZhbCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcmV2aW91cyBudW1iZXIgY29udGFpbmVkIGEgdmFsaWQgZGlhbCBjb2RlLCByZXBsYWNlIGl0XG4gICAgICAgICAgICAgICAgLy8gKGlmIG1vcmUgdGhhbiBqdXN0IGEgcGx1cyBjaGFyYWN0ZXIpXG4gICAgICAgICAgICAgICAgdmFyIHByZXZEaWFsQ29kZSA9IHRoaXMuX2dldERpYWxDb2RlKGlucHV0VmFsKTtcbiAgICAgICAgICAgICAgICBpZiAocHJldkRpYWxDb2RlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3TnVtYmVyID0gaW5wdXRWYWwucmVwbGFjZShwcmV2RGlhbENvZGUsIG5ld0RpYWxDb2RlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcHJldmlvdXMgbnVtYmVyIGRpZG4ndCBjb250YWluIGEgZGlhbCBjb2RlLCB3ZSBzaG91bGQgcGVyc2lzdCBpdFxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhpc3RpbmdOdW1iZXIgPSBpbnB1dFZhbC5jaGFyQXQoMCkgIT0gXCIrXCIgPyAkLnRyaW0oaW5wdXRWYWwpIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgbmV3TnVtYmVyID0gbmV3RGlhbENvZGUgKyBleGlzdGluZ051bWJlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld051bWJlciA9ICF0aGlzLm9wdGlvbnMuYXV0b0hpZGVEaWFsQ29kZSB8fCBmb2N1c2luZyA/IG5ld0RpYWxDb2RlIDogXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbChuZXdOdW1iZXIsIG51bGwsIGZvY3VzaW5nKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdHJ5IGFuZCBleHRyYWN0IGEgdmFsaWQgaW50ZXJuYXRpb25hbCBkaWFsIGNvZGUgZnJvbSBhIGZ1bGwgdGVsZXBob25lIG51bWJlclxuICAgICAgICAvLyBOb3RlOiByZXR1cm5zIHRoZSByYXcgc3RyaW5nIGluYyBwbHVzIGNoYXJhY3RlciBhbmQgYW55IHdoaXRlc3BhY2UvZG90cyBldGNcbiAgICAgICAgX2dldERpYWxDb2RlOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBkaWFsQ29kZSA9IFwiXCI7XG4gICAgICAgICAgICAvLyBvbmx5IGludGVyZXN0ZWQgaW4gaW50ZXJuYXRpb25hbCBudW1iZXJzIChzdGFydGluZyB3aXRoIGEgcGx1cylcbiAgICAgICAgICAgIGlmIChudW1iZXIuY2hhckF0KDApID09IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIG51bWVyaWNDaGFycyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGNoYXJzXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBudW1iZXIuY2hhckF0KGkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBjaGFyIGlzIG51bWJlclxuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pc051bWVyaWMoYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bWVyaWNDaGFycyArPSBjO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgY3VycmVudCBudW1lcmljQ2hhcnMgbWFrZSBhIHZhbGlkIGRpYWwgY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY291bnRyeUNvZGVzW251bWVyaWNDaGFyc10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSB0aGUgYWN0dWFsIHJhdyBzdHJpbmcgKHVzZWZ1bCBmb3IgbWF0Y2hpbmcgbGF0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlhbENvZGUgPSBudW1iZXIuc3Vic3RyKDAsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvbmdlc3QgZGlhbCBjb2RlIGlzIDQgY2hhcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1lcmljQ2hhcnMubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkaWFsQ29kZTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAqICBQVUJMSUMgTUVUSE9EU1xuICAgKioqKioqKioqKioqKioqKioqKiovXG4gICAgICAgIC8vIHRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIGlwaW5mbyBjYWxsIHJldHVybnNcbiAgICAgICAgYXV0b0NvdW50cnlMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSA9PSBcImF1dG9cIikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSA9ICQuZm5bcGx1Z2luTmFtZV0uYXV0b0NvdW50cnk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0SW5pdGlhbFN0YXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvQ291bnRyeURlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcmVtb3ZlIHBsdWdpblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgZHJvcGRvd24gaXMgY2xvc2VkIChhbmQgdW5iaW5kIGxpc3RlbmVycylcbiAgICAgICAgICAgICAgICB0aGlzLl9jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBrZXkgZXZlbnRzLCBhbmQgZm9jdXMvYmx1ciBldmVudHMgaWYgYXV0b0hpZGVEaWFsQ29kZT10cnVlXG4gICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9mZih0aGlzLm5zKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlIGV2ZW50IG9uIHNlbGVjdCBjb3VudHJ5XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNsaWNrIGV2ZW50IHRvIG9wZW4gZHJvcGRvd25cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLnBhcmVudCgpLm9mZih0aGlzLm5zKTtcbiAgICAgICAgICAgICAgICAvLyBsYWJlbCBjbGljayBoYWNrXG4gICAgICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5jbG9zZXN0KFwibGFiZWxcIikub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVtb3ZlIG1hcmt1cFxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMudGVsSW5wdXQucGFyZW50KCk7XG4gICAgICAgICAgICBjb250YWluZXIuYmVmb3JlKHRoaXMudGVsSW5wdXQpLnJlbW92ZSgpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBleHRyYWN0IHRoZSBwaG9uZSBudW1iZXIgZXh0ZW5zaW9uIGlmIHByZXNlbnRcbiAgICAgICAgZ2V0RXh0ZW5zaW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRlbElucHV0LnZhbCgpLnNwbGl0KFwiIGV4dC4gXCIpWzFdIHx8IFwiXCI7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGZvcm1hdCB0aGUgbnVtYmVyIHRvIHRoZSBnaXZlbiB0eXBlXG4gICAgICAgIGdldE51bWJlcjogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnRsVGVsSW5wdXRVdGlscy5mb3JtYXROdW1iZXJCeVR5cGUodGhpcy50ZWxJbnB1dC52YWwoKSwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdldCB0aGUgdHlwZSBvZiB0aGUgZW50ZXJlZCBudW1iZXIgZS5nLiBsYW5kbGluZS9tb2JpbGVcbiAgICAgICAgZ2V0TnVtYmVyVHlwZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmludGxUZWxJbnB1dFV0aWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGxUZWxJbnB1dFV0aWxzLmdldE51bWJlclR5cGUodGhpcy50ZWxJbnB1dC52YWwoKSwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC05OTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0IHRoZSBjb3VudHJ5IGRhdGEgZm9yIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZmxhZ1xuICAgICAgICBnZXRTZWxlY3RlZENvdW50cnlEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgdW5kZWZpbmVkLCB0aGUgcGx1Z2luIHdpbGwgcmV0dXJuIGl0J3MgaW5zdGFuY2UgaW5zdGVhZCwgc28gaW4gdGhhdCBjYXNlIGFuIGVtcHR5IG9iamVjdCBtYWtlcyBtb3JlIHNlbnNlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhIHx8IHt9O1xuICAgICAgICB9LFxuICAgICAgICAvLyBnZXQgdGhlIHZhbGlkYXRpb24gZXJyb3JcbiAgICAgICAgZ2V0VmFsaWRhdGlvbkVycm9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50bFRlbElucHV0VXRpbHMuZ2V0VmFsaWRhdGlvbkVycm9yKHRoaXMudGVsSW5wdXQudmFsKCksIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtOTk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHZhbGlkYXRlIHRoZSBpbnB1dCB2YWwgLSBhc3N1bWVzIHRoZSBnbG9iYWwgZnVuY3Rpb24gaXNWYWxpZE51bWJlciAoZnJvbSB1dGlsc1NjcmlwdClcbiAgICAgICAgaXNWYWxpZE51bWJlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gJC50cmltKHRoaXMudGVsSW5wdXQudmFsKCkpLCBjb3VudHJ5Q29kZSA9IHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUgPyB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiA6IFwiXCI7XG4gICAgICAgICAgICBpZiAod2luZG93LmludGxUZWxJbnB1dFV0aWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGxUZWxJbnB1dFV0aWxzLmlzVmFsaWROdW1iZXIodmFsLCBjb3VudHJ5Q29kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGxvYWQgdGhlIHV0aWxzIHNjcmlwdFxuICAgICAgICBsb2FkVXRpbHM6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciB1dGlsc1NjcmlwdCA9IHBhdGggfHwgdGhpcy5vcHRpb25zLnV0aWxzU2NyaXB0O1xuICAgICAgICAgICAgaWYgKCEkLmZuW3BsdWdpbk5hbWVdLmxvYWRlZFV0aWxzU2NyaXB0ICYmIHV0aWxzU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgZG8gdGhpcyB0d2ljZSEgKGRvbnQganVzdCBjaGVjayBpZiB0aGUgZ2xvYmFsIGludGxUZWxJbnB1dFV0aWxzIGV4aXN0cyBhcyBpZiBpbml0IHBsdWdpbiBtdWx0aXBsZSB0aW1lcyBpbiBxdWljayBzdWNjZXNzaW9uLCBpdCBtYXkgbm90IGhhdmUgZmluaXNoZWQgbG9hZGluZyB5ZXQpXG4gICAgICAgICAgICAgICAgJC5mbltwbHVnaW5OYW1lXS5sb2FkZWRVdGlsc1NjcmlwdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gZG9udCB1c2UgJC5nZXRTY3JpcHQgYXMgaXQgcHJldmVudHMgY2FjaGluZ1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXRpbHNTY3JpcHQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGVsbCBhbGwgaW5zdGFuY2VzIHRoZSB1dGlscyBhcmUgcmVhZHlcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuaW50bC10ZWwtaW5wdXQgaW5wdXRcIikuaW50bFRlbElucHV0KFwidXRpbHNMb2FkZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXRpbHNTY3JpcHREZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcInNjcmlwdFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV0aWxzU2NyaXB0RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNlbGVjdGVkIGZsYWcsIGFuZCB1cGRhdGUgdGhlIGlucHV0IHZhbCBhY2NvcmRpbmdseVxuICAgICAgICBzZWxlY3RDb3VudHJ5OiBmdW5jdGlvbihjb3VudHJ5Q29kZSkge1xuICAgICAgICAgICAgY291bnRyeUNvZGUgPSBjb3VudHJ5Q29kZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgYWxyZWFkeSBzZWxlY3RlZFxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLmhhc0NsYXNzKGNvdW50cnlDb2RlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEZsYWcoY291bnRyeUNvZGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURpYWxDb2RlKHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5kaWFsQ29kZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBzZXQgdGhlIGlucHV0IHZhbHVlIGFuZCB1cGRhdGUgdGhlIGZsYWdcbiAgICAgICAgc2V0TnVtYmVyOiBmdW5jdGlvbihudW1iZXIsIGZvcm1hdCwgYWRkU3VmZml4LCBwcmV2ZW50Q29udmVyc2lvbiwgaXNBbGxvd2VkS2V5KSB7XG4gICAgICAgICAgICAvLyBlbnN1cmUgc3RhcnRzIHdpdGggcGx1c1xuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlICYmIG51bWJlci5jaGFyQXQoMCkgIT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICBudW1iZXIgPSBcIitcIiArIG51bWJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdlIG11c3QgdXBkYXRlIHRoZSBmbGFnIGZpcnN0LCB3aGljaCB1cGRhdGVzIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YSwgd2hpY2ggaXMgdXNlZCBsYXRlciBmb3IgZm9ybWF0dGluZyB0aGUgbnVtYmVyIGJlZm9yZSBkaXNwbGF5aW5nIGl0XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVGbGFnRnJvbU51bWJlcihudW1iZXIpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsKG51bWJlciwgZm9ybWF0LCBhZGRTdWZmaXgsIHByZXZlbnRDb252ZXJzaW9uLCBpc0FsbG93ZWRLZXkpO1xuICAgICAgICB9LFxuICAgICAgICAvLyB0aGlzIGlzIGNhbGxlZCB3aGVuIHRoZSB1dGlscyBhcmUgcmVhZHlcbiAgICAgICAgdXRpbHNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaWYgYXV0b0Zvcm1hdCBpcyBlbmFibGVkIGFuZCB0aGVyZSdzIGFuIGluaXRpYWwgdmFsdWUgaW4gdGhlIGlucHV0LCB0aGVuIGZvcm1hdCBpdFxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvRm9ybWF0ICYmIHRoaXMudGVsSW5wdXQudmFsKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWYWwodGhpcy50ZWxJbnB1dC52YWwoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQbGFjZWhvbGRlcigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBhZGFwdGVkIHRvIGFsbG93IHB1YmxpYyBmdW5jdGlvbnNcbiAgICAvLyB1c2luZyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LWJvaWxlcnBsYXRlL2pxdWVyeS1ib2lsZXJwbGF0ZS93aWtpL0V4dGVuZGluZy1qUXVlcnktQm9pbGVycGxhdGVcbiAgICAkLmZuW3BsdWdpbk5hbWVdID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgLy8gSXMgdGhlIGZpcnN0IHBhcmFtZXRlciBhbiBvYmplY3QgKG9wdGlvbnMpLCBvciB3YXMgb21pdHRlZCxcbiAgICAgICAgLy8gaW5zdGFudGlhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHBsdWdpbi5cbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsIFwicGx1Z2luX1wiICsgcGx1Z2luTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gbmV3IFBsdWdpbih0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGVmZXJyZWRzID0gaW5zdGFuY2UuX2luaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2Ugbm93IGhhdmUgMiBkZWZmZXJlZHM6IDEgZm9yIGF1dG8gY291bnRyeSwgMSBmb3IgdXRpbHMgc2NyaXB0XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkcy5wdXNoKGluc3RhbmNlRGVmZXJyZWRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWRzLnB1c2goaW5zdGFuY2VEZWZlcnJlZHNbMV0pO1xuICAgICAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIHByb21pc2UgZnJvbSB0aGUgXCJtYXN0ZXJcIiBkZWZlcnJlZCBvYmplY3QgdGhhdCB0cmFja3MgYWxsIHRoZSBvdGhlcnNcbiAgICAgICAgICAgIHJldHVybiAkLndoZW4uYXBwbHkobnVsbCwgZGVmZXJyZWRzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIiAmJiBvcHRpb25zWzBdICE9PSBcIl9cIikge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBhIHN0cmluZyBhbmQgaXQgZG9lc24ndCBzdGFydFxuICAgICAgICAgICAgLy8gd2l0aCBhbiB1bmRlcnNjb3JlIG9yIFwiY29udGFpbnNcIiB0aGUgYGluaXRgLWZ1bmN0aW9uLFxuICAgICAgICAgICAgLy8gdHJlYXQgdGhpcyBhcyBhIGNhbGwgdG8gYSBwdWJsaWMgbWV0aG9kLlxuICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIG1ldGhvZCBjYWxsIHRvIG1ha2UgaXQgcG9zc2libGUgdG8gcmV0dXJuIGEgdmFsdWVcbiAgICAgICAgICAgIHZhciByZXR1cm5zO1xuICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQuZGF0YSh0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIFRlc3RzIHRoYXQgdGhlcmUncyBhbHJlYWR5IGEgcGx1Z2luLWluc3RhbmNlXG4gICAgICAgICAgICAgICAgLy8gYW5kIGNoZWNrcyB0aGF0IHRoZSByZXF1ZXN0ZWQgcHVibGljIG1ldGhvZCBleGlzdHNcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBQbHVnaW4gJiYgdHlwZW9mIGluc3RhbmNlW29wdGlvbnNdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgbWV0aG9kIG9mIG91ciBwbHVnaW4gaW5zdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBwYXNzIGl0IHRoZSBzdXBwbGllZCBhcmd1bWVudHMuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybnMgPSBpbnN0YW5jZVtvcHRpb25zXS5hcHBseShpbnN0YW5jZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBbGxvdyBpbnN0YW5jZXMgdG8gYmUgZGVzdHJveWVkIHZpYSB0aGUgJ2Rlc3Ryb3knIG1ldGhvZFxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zID09PSBcImRlc3Ryb3lcIikge1xuICAgICAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBlYXJsaWVyIGNhY2hlZCBtZXRob2QgZ2l2ZXMgYSB2YWx1ZSBiYWNrIHJldHVybiB0aGUgdmFsdWUsXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UgcmV0dXJuIHRoaXMgdG8gcHJlc2VydmUgY2hhaW5hYmlsaXR5LlxuICAgICAgICAgICAgcmV0dXJuIHJldHVybnMgIT09IHVuZGVmaW5lZCA/IHJldHVybnMgOiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKioqKioqKioqKioqKioqKioqKipcbiAqICBTVEFUSUMgTUVUSE9EU1xuICoqKioqKioqKioqKioqKioqKioqL1xuICAgIC8vIGdldCB0aGUgY291bnRyeSBkYXRhIG9iamVjdFxuICAgICQuZm5bcGx1Z2luTmFtZV0uZ2V0Q291bnRyeURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFsbENvdW50cmllcztcbiAgICB9O1xuICAgIC8vIFRlbGwgSlNIaW50IHRvIGlnbm9yZSB0aGlzIHdhcm5pbmc6IFwiY2hhcmFjdGVyIG1heSBnZXQgc2lsZW50bHkgZGVsZXRlZCBieSBvbmUgb3IgbW9yZSBicm93c2Vyc1wiXG4gICAgLy8ganNoaW50IC1XMTAwXG4gICAgLy8gQXJyYXkgb2YgY291bnRyeSBvYmplY3RzIGZvciB0aGUgZmxhZyBkcm9wZG93bi5cbiAgICAvLyBFYWNoIGNvbnRhaW5zIGEgbmFtZSwgY291bnRyeSBjb2RlIChJU08gMzE2Ni0xIGFscGhhLTIpIGFuZCBkaWFsIGNvZGUuXG4gICAgLy8gT3JpZ2luYWxseSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tbGVkb3plL2NvdW50cmllc1xuICAgIC8vIHRoZW4gbW9kaWZpZWQgdXNpbmcgdGhlIGZvbGxvd2luZyBKYXZhU2NyaXB0IChOT1cgT1VUIE9GIERBVEUpOlxuICAgIC8qXG52YXIgcmVzdWx0ID0gW107XG5fLmVhY2goY291bnRyaWVzLCBmdW5jdGlvbihjKSB7XG4gIC8vIGlnbm9yZSBjb3VudHJpZXMgd2l0aG91dCBhIGRpYWwgY29kZVxuICBpZiAoYy5jYWxsaW5nQ29kZVswXS5sZW5ndGgpIHtcbiAgICByZXN1bHQucHVzaCh7XG4gICAgICAvLyB2YXIgbG9jYWxzIGNvbnRhaW5zIGNvdW50cnkgbmFtZXMgd2l0aCBsb2NhbGlzZWQgdmVyc2lvbnMgaW4gYnJhY2tldHNcbiAgICAgIG46IF8uZmluZFdoZXJlKGxvY2Fscywge1xuICAgICAgICBjb3VudHJ5Q29kZTogYy5jY2EyXG4gICAgICB9KS5uYW1lLFxuICAgICAgaTogYy5jY2EyLnRvTG93ZXJDYXNlKCksXG4gICAgICBkOiBjLmNhbGxpbmdDb2RlWzBdXG4gICAgfSk7XG4gIH1cbn0pO1xuSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiovXG4gICAgLy8gdGhlbiB3aXRoIGEgY291cGxlIG9mIG1hbnVhbCByZS1hcnJhbmdlbWVudHMgdG8gYmUgYWxwaGFiZXRpY2FsXG4gICAgLy8gdGhlbiBjaGFuZ2VkIEthemFraHN0YW4gZnJvbSArNzYgdG8gKzdcbiAgICAvLyBhbmQgVmF0aWNhbiBDaXR5IGZyb20gKzM3OSB0byArMzkgKHNlZSBpc3N1ZSA1MClcbiAgICAvLyBhbmQgQ2FyaWJlYW4gTmV0aGVybGFuZHMgZnJvbSArNTk5NyB0byArNTk5XG4gICAgLy8gYW5kIEN1cmFjYW8gZnJvbSArNTk5OSB0byArNTk5XG4gICAgLy8gUmVtb3ZlZDogw4VsYW5kIElzbGFuZHMsIENocmlzdG1hcyBJc2xhbmQsIENvY29zIElzbGFuZHMsIEd1ZXJuc2V5LCBJc2xlIG9mIE1hbiwgSmVyc2V5LCBLb3Nvdm8sIE1heW90dGUsIFBpdGNhaXJuIElzbGFuZHMsIFNvdXRoIEdlb3JnaWEsIFN2YWxiYXJkLCBXZXN0ZXJuIFNhaGFyYVxuICAgIC8vIFVwZGF0ZTogY29udmVydGVkIG9iamVjdHMgdG8gYXJyYXlzIHRvIHNhdmUgYnl0ZXMhXG4gICAgLy8gVXBkYXRlOiBhZGRlZCBcInByaW9yaXR5XCIgZm9yIGNvdW50cmllcyB3aXRoIHRoZSBzYW1lIGRpYWxDb2RlIGFzIG90aGVyc1xuICAgIC8vIFVwZGF0ZTogYWRkZWQgYXJyYXkgb2YgYXJlYSBjb2RlcyBmb3IgY291bnRyaWVzIHdpdGggdGhlIHNhbWUgZGlhbENvZGUgYXMgb3RoZXJzXG4gICAgLy8gU28gZWFjaCBjb3VudHJ5IGFycmF5IGhhcyB0aGUgZm9sbG93aW5nIGluZm9ybWF0aW9uOlxuICAgIC8vIFtcbiAgICAvLyAgICBDb3VudHJ5IG5hbWUsXG4gICAgLy8gICAgaXNvMiBjb2RlLFxuICAgIC8vICAgIEludGVybmF0aW9uYWwgZGlhbCBjb2RlLFxuICAgIC8vICAgIE9yZGVyIChpZiA+MSBjb3VudHJ5IHdpdGggc2FtZSBkaWFsIGNvZGUpLFxuICAgIC8vICAgIEFyZWEgY29kZXMgKGlmID4xIGNvdW50cnkgd2l0aCBzYW1lIGRpYWwgY29kZSlcbiAgICAvLyBdXG4gICAgdmFyIGFsbENvdW50cmllcyA9IFsgWyBcIkFmZ2hhbmlzdGFuICjigKvYp9mB2LrYp9mG2LPYqtin2YbigKzigI4pXCIsIFwiYWZcIiwgXCI5M1wiIF0sIFsgXCJBbGJhbmlhIChTaHFpcMOrcmkpXCIsIFwiYWxcIiwgXCIzNTVcIiBdLCBbIFwiQWxnZXJpYSAo4oCr2KfZhNis2LLYp9im2LHigKzigI4pXCIsIFwiZHpcIiwgXCIyMTNcIiBdLCBbIFwiQW1lcmljYW4gU2Ftb2FcIiwgXCJhc1wiLCBcIjE2ODRcIiBdLCBbIFwiQW5kb3JyYVwiLCBcImFkXCIsIFwiMzc2XCIgXSwgWyBcIkFuZ29sYVwiLCBcImFvXCIsIFwiMjQ0XCIgXSwgWyBcIkFuZ3VpbGxhXCIsIFwiYWlcIiwgXCIxMjY0XCIgXSwgWyBcIkFudGlndWEgYW5kIEJhcmJ1ZGFcIiwgXCJhZ1wiLCBcIjEyNjhcIiBdLCBbIFwiQXJnZW50aW5hXCIsIFwiYXJcIiwgXCI1NFwiIF0sIFsgXCJBcm1lbmlhICjVgNWh1bXVodW91b/VodW2KVwiLCBcImFtXCIsIFwiMzc0XCIgXSwgWyBcIkFydWJhXCIsIFwiYXdcIiwgXCIyOTdcIiBdLCBbIFwiQXVzdHJhbGlhXCIsIFwiYXVcIiwgXCI2MVwiIF0sIFsgXCJBdXN0cmlhICjDlnN0ZXJyZWljaClcIiwgXCJhdFwiLCBcIjQzXCIgXSwgWyBcIkF6ZXJiYWlqYW4gKEF6yZlyYmF5Y2FuKVwiLCBcImF6XCIsIFwiOTk0XCIgXSwgWyBcIkJhaGFtYXNcIiwgXCJic1wiLCBcIjEyNDJcIiBdLCBbIFwiQmFocmFpbiAo4oCr2KfZhNio2K3YsdmK2YbigKzigI4pXCIsIFwiYmhcIiwgXCI5NzNcIiBdLCBbIFwiQmFuZ2xhZGVzaCAo4Kas4Ka+4KaC4Kay4Ka+4Kam4KeH4Ka2KVwiLCBcImJkXCIsIFwiODgwXCIgXSwgWyBcIkJhcmJhZG9zXCIsIFwiYmJcIiwgXCIxMjQ2XCIgXSwgWyBcIkJlbGFydXMgKNCR0LXQu9Cw0YDRg9GB0YwpXCIsIFwiYnlcIiwgXCIzNzVcIiBdLCBbIFwiQmVsZ2l1bSAoQmVsZ2nDqylcIiwgXCJiZVwiLCBcIjMyXCIgXSwgWyBcIkJlbGl6ZVwiLCBcImJ6XCIsIFwiNTAxXCIgXSwgWyBcIkJlbmluIChCw6luaW4pXCIsIFwiYmpcIiwgXCIyMjlcIiBdLCBbIFwiQmVybXVkYVwiLCBcImJtXCIsIFwiMTQ0MVwiIF0sIFsgXCJCaHV0YW4gKOC9oOC9luC+suC9tOC9gilcIiwgXCJidFwiLCBcIjk3NVwiIF0sIFsgXCJCb2xpdmlhXCIsIFwiYm9cIiwgXCI1OTFcIiBdLCBbIFwiQm9zbmlhIGFuZCBIZXJ6ZWdvdmluYSAo0JHQvtGB0L3QsCDQuCDQpdC10YDRhtC10LPQvtCy0LjQvdCwKVwiLCBcImJhXCIsIFwiMzg3XCIgXSwgWyBcIkJvdHN3YW5hXCIsIFwiYndcIiwgXCIyNjdcIiBdLCBbIFwiQnJhemlsIChCcmFzaWwpXCIsIFwiYnJcIiwgXCI1NVwiIF0sIFsgXCJCcml0aXNoIEluZGlhbiBPY2VhbiBUZXJyaXRvcnlcIiwgXCJpb1wiLCBcIjI0NlwiIF0sIFsgXCJCcml0aXNoIFZpcmdpbiBJc2xhbmRzXCIsIFwidmdcIiwgXCIxMjg0XCIgXSwgWyBcIkJydW5laVwiLCBcImJuXCIsIFwiNjczXCIgXSwgWyBcIkJ1bGdhcmlhICjQkdGK0LvQs9Cw0YDQuNGPKVwiLCBcImJnXCIsIFwiMzU5XCIgXSwgWyBcIkJ1cmtpbmEgRmFzb1wiLCBcImJmXCIsIFwiMjI2XCIgXSwgWyBcIkJ1cnVuZGkgKFVidXJ1bmRpKVwiLCBcImJpXCIsIFwiMjU3XCIgXSwgWyBcIkNhbWJvZGlhICjhnoDhnpjhn5LhnpbhnrvhnofhnrYpXCIsIFwia2hcIiwgXCI4NTVcIiBdLCBbIFwiQ2FtZXJvb24gKENhbWVyb3VuKVwiLCBcImNtXCIsIFwiMjM3XCIgXSwgWyBcIkNhbmFkYVwiLCBcImNhXCIsIFwiMVwiLCAxLCBbIFwiMjA0XCIsIFwiMjI2XCIsIFwiMjM2XCIsIFwiMjQ5XCIsIFwiMjUwXCIsIFwiMjg5XCIsIFwiMzA2XCIsIFwiMzQzXCIsIFwiMzY1XCIsIFwiMzg3XCIsIFwiNDAzXCIsIFwiNDE2XCIsIFwiNDE4XCIsIFwiNDMxXCIsIFwiNDM3XCIsIFwiNDM4XCIsIFwiNDUwXCIsIFwiNTA2XCIsIFwiNTE0XCIsIFwiNTE5XCIsIFwiNTQ4XCIsIFwiNTc5XCIsIFwiNTgxXCIsIFwiNTg3XCIsIFwiNjA0XCIsIFwiNjEzXCIsIFwiNjM5XCIsIFwiNjQ3XCIsIFwiNjcyXCIsIFwiNzA1XCIsIFwiNzA5XCIsIFwiNzQyXCIsIFwiNzc4XCIsIFwiNzgwXCIsIFwiNzgyXCIsIFwiODA3XCIsIFwiODE5XCIsIFwiODI1XCIsIFwiODY3XCIsIFwiODczXCIsIFwiOTAyXCIsIFwiOTA1XCIgXSBdLCBbIFwiQ2FwZSBWZXJkZSAoS2FidSBWZXJkaSlcIiwgXCJjdlwiLCBcIjIzOFwiIF0sIFsgXCJDYXJpYmJlYW4gTmV0aGVybGFuZHNcIiwgXCJicVwiLCBcIjU5OVwiLCAxIF0sIFsgXCJDYXltYW4gSXNsYW5kc1wiLCBcImt5XCIsIFwiMTM0NVwiIF0sIFsgXCJDZW50cmFsIEFmcmljYW4gUmVwdWJsaWMgKFLDqXB1YmxpcXVlIGNlbnRyYWZyaWNhaW5lKVwiLCBcImNmXCIsIFwiMjM2XCIgXSwgWyBcIkNoYWQgKFRjaGFkKVwiLCBcInRkXCIsIFwiMjM1XCIgXSwgWyBcIkNoaWxlXCIsIFwiY2xcIiwgXCI1NlwiIF0sIFsgXCJDaGluYSAo5Lit5Zu9KVwiLCBcImNuXCIsIFwiODZcIiBdLCBbIFwiQ29sb21iaWFcIiwgXCJjb1wiLCBcIjU3XCIgXSwgWyBcIkNvbW9yb3MgKOKAq9is2LLYsSDYp9mE2YLZhdix4oCs4oCOKVwiLCBcImttXCIsIFwiMjY5XCIgXSwgWyBcIkNvbmdvIChEUkMpIChKYW1odXJpIHlhIEtpZGVtb2tyYXNpYSB5YSBLb25nbylcIiwgXCJjZFwiLCBcIjI0M1wiIF0sIFsgXCJDb25nbyAoUmVwdWJsaWMpIChDb25nby1CcmF6emF2aWxsZSlcIiwgXCJjZ1wiLCBcIjI0MlwiIF0sIFsgXCJDb29rIElzbGFuZHNcIiwgXCJja1wiLCBcIjY4MlwiIF0sIFsgXCJDb3N0YSBSaWNhXCIsIFwiY3JcIiwgXCI1MDZcIiBdLCBbIFwiQ8O0dGUgZOKAmUl2b2lyZVwiLCBcImNpXCIsIFwiMjI1XCIgXSwgWyBcIkNyb2F0aWEgKEhydmF0c2thKVwiLCBcImhyXCIsIFwiMzg1XCIgXSwgWyBcIkN1YmFcIiwgXCJjdVwiLCBcIjUzXCIgXSwgWyBcIkN1cmHDp2FvXCIsIFwiY3dcIiwgXCI1OTlcIiwgMCBdLCBbIFwiQ3lwcnVzICjOms+Nz4DPgc6/z4IpXCIsIFwiY3lcIiwgXCIzNTdcIiBdLCBbIFwiQ3plY2ggUmVwdWJsaWMgKMSMZXNrw6EgcmVwdWJsaWthKVwiLCBcImN6XCIsIFwiNDIwXCIgXSwgWyBcIkRlbm1hcmsgKERhbm1hcmspXCIsIFwiZGtcIiwgXCI0NVwiIF0sIFsgXCJEamlib3V0aVwiLCBcImRqXCIsIFwiMjUzXCIgXSwgWyBcIkRvbWluaWNhXCIsIFwiZG1cIiwgXCIxNzY3XCIgXSwgWyBcIkRvbWluaWNhbiBSZXB1YmxpYyAoUmVww7pibGljYSBEb21pbmljYW5hKVwiLCBcImRvXCIsIFwiMVwiLCAyLCBbIFwiODA5XCIsIFwiODI5XCIsIFwiODQ5XCIgXSBdLCBbIFwiRWN1YWRvclwiLCBcImVjXCIsIFwiNTkzXCIgXSwgWyBcIkVneXB0ICjigKvZhdi12LHigKzigI4pXCIsIFwiZWdcIiwgXCIyMFwiIF0sIFsgXCJFbCBTYWx2YWRvclwiLCBcInN2XCIsIFwiNTAzXCIgXSwgWyBcIkVxdWF0b3JpYWwgR3VpbmVhIChHdWluZWEgRWN1YXRvcmlhbClcIiwgXCJncVwiLCBcIjI0MFwiIF0sIFsgXCJFcml0cmVhXCIsIFwiZXJcIiwgXCIyOTFcIiBdLCBbIFwiRXN0b25pYSAoRWVzdGkpXCIsIFwiZWVcIiwgXCIzNzJcIiBdLCBbIFwiRXRoaW9waWFcIiwgXCJldFwiLCBcIjI1MVwiIF0sIFsgXCJGYWxrbGFuZCBJc2xhbmRzIChJc2xhcyBNYWx2aW5hcylcIiwgXCJma1wiLCBcIjUwMFwiIF0sIFsgXCJGYXJvZSBJc2xhbmRzIChGw7hyb3lhcilcIiwgXCJmb1wiLCBcIjI5OFwiIF0sIFsgXCJGaWppXCIsIFwiZmpcIiwgXCI2NzlcIiBdLCBbIFwiRmlubGFuZCAoU3VvbWkpXCIsIFwiZmlcIiwgXCIzNThcIiBdLCBbIFwiRnJhbmNlXCIsIFwiZnJcIiwgXCIzM1wiIF0sIFsgXCJGcmVuY2ggR3VpYW5hIChHdXlhbmUgZnJhbsOnYWlzZSlcIiwgXCJnZlwiLCBcIjU5NFwiIF0sIFsgXCJGcmVuY2ggUG9seW5lc2lhIChQb2x5bsOpc2llIGZyYW7Dp2Fpc2UpXCIsIFwicGZcIiwgXCI2ODlcIiBdLCBbIFwiR2Fib25cIiwgXCJnYVwiLCBcIjI0MVwiIF0sIFsgXCJHYW1iaWFcIiwgXCJnbVwiLCBcIjIyMFwiIF0sIFsgXCJHZW9yZ2lhICjhg6Hhg5Dhg6Xhg5Dhg6Dhg5fhg5Xhg5Thg5rhg50pXCIsIFwiZ2VcIiwgXCI5OTVcIiBdLCBbIFwiR2VybWFueSAoRGV1dHNjaGxhbmQpXCIsIFwiZGVcIiwgXCI0OVwiIF0sIFsgXCJHaGFuYSAoR2FhbmEpXCIsIFwiZ2hcIiwgXCIyMzNcIiBdLCBbIFwiR2licmFsdGFyXCIsIFwiZ2lcIiwgXCIzNTBcIiBdLCBbIFwiR3JlZWNlICjOlc67zrvOrM60zrEpXCIsIFwiZ3JcIiwgXCIzMFwiIF0sIFsgXCJHcmVlbmxhbmQgKEthbGFhbGxpdCBOdW5hYXQpXCIsIFwiZ2xcIiwgXCIyOTlcIiBdLCBbIFwiR3JlbmFkYVwiLCBcImdkXCIsIFwiMTQ3M1wiIF0sIFsgXCJHdWFkZWxvdXBlXCIsIFwiZ3BcIiwgXCI1OTBcIiwgMCBdLCBbIFwiR3VhbVwiLCBcImd1XCIsIFwiMTY3MVwiIF0sIFsgXCJHdWF0ZW1hbGFcIiwgXCJndFwiLCBcIjUwMlwiIF0sIFsgXCJHdWluZWEgKEd1aW7DqWUpXCIsIFwiZ25cIiwgXCIyMjRcIiBdLCBbIFwiR3VpbmVhLUJpc3NhdSAoR3VpbsOpIEJpc3NhdSlcIiwgXCJnd1wiLCBcIjI0NVwiIF0sIFsgXCJHdXlhbmFcIiwgXCJneVwiLCBcIjU5MlwiIF0sIFsgXCJIYWl0aVwiLCBcImh0XCIsIFwiNTA5XCIgXSwgWyBcIkhvbmR1cmFzXCIsIFwiaG5cIiwgXCI1MDRcIiBdLCBbIFwiSG9uZyBLb25nICjpppnmuK8pXCIsIFwiaGtcIiwgXCI4NTJcIiBdLCBbIFwiSHVuZ2FyeSAoTWFneWFyb3JzesOhZylcIiwgXCJodVwiLCBcIjM2XCIgXSwgWyBcIkljZWxhbmQgKMONc2xhbmQpXCIsIFwiaXNcIiwgXCIzNTRcIiBdLCBbIFwiSW5kaWEgKOCkreCkvuCksOCkpClcIiwgXCJpblwiLCBcIjkxXCIgXSwgWyBcIkluZG9uZXNpYVwiLCBcImlkXCIsIFwiNjJcIiBdLCBbIFwiSXJhbiAo4oCr2KfbjNix2KfZhuKArOKAjilcIiwgXCJpclwiLCBcIjk4XCIgXSwgWyBcIklyYXEgKOKAq9in2YTYudix2KfZguKArOKAjilcIiwgXCJpcVwiLCBcIjk2NFwiIF0sIFsgXCJJcmVsYW5kXCIsIFwiaWVcIiwgXCIzNTNcIiBdLCBbIFwiSXNyYWVsICjigKvXmdep16jXkNec4oCs4oCOKVwiLCBcImlsXCIsIFwiOTcyXCIgXSwgWyBcIkl0YWx5IChJdGFsaWEpXCIsIFwiaXRcIiwgXCIzOVwiLCAwIF0sIFsgXCJKYW1haWNhXCIsIFwiam1cIiwgXCIxODc2XCIgXSwgWyBcIkphcGFuICjml6XmnKwpXCIsIFwianBcIiwgXCI4MVwiIF0sIFsgXCJKb3JkYW4gKOKAq9in2YTYo9ix2K/ZhuKArOKAjilcIiwgXCJqb1wiLCBcIjk2MlwiIF0sIFsgXCJLYXpha2hzdGFuICjQmtCw0LfQsNGF0YHRgtCw0L0pXCIsIFwia3pcIiwgXCI3XCIsIDEgXSwgWyBcIktlbnlhXCIsIFwia2VcIiwgXCIyNTRcIiBdLCBbIFwiS2lyaWJhdGlcIiwgXCJraVwiLCBcIjY4NlwiIF0sIFsgXCJLdXdhaXQgKOKAq9in2YTZg9mI2YrYquKArOKAjilcIiwgXCJrd1wiLCBcIjk2NVwiIF0sIFsgXCJLeXJneXpzdGFuICjQmtGL0YDQs9GL0LfRgdGC0LDQvSlcIiwgXCJrZ1wiLCBcIjk5NlwiIF0sIFsgXCJMYW9zICjguqXgurLguqcpXCIsIFwibGFcIiwgXCI4NTZcIiBdLCBbIFwiTGF0dmlhIChMYXR2aWphKVwiLCBcImx2XCIsIFwiMzcxXCIgXSwgWyBcIkxlYmFub24gKOKAq9mE2KjZhtin2YbigKzigI4pXCIsIFwibGJcIiwgXCI5NjFcIiBdLCBbIFwiTGVzb3Rob1wiLCBcImxzXCIsIFwiMjY2XCIgXSwgWyBcIkxpYmVyaWFcIiwgXCJsclwiLCBcIjIzMVwiIF0sIFsgXCJMaWJ5YSAo4oCr2YTZitio2YrYp+KArOKAjilcIiwgXCJseVwiLCBcIjIxOFwiIF0sIFsgXCJMaWVjaHRlbnN0ZWluXCIsIFwibGlcIiwgXCI0MjNcIiBdLCBbIFwiTGl0aHVhbmlhIChMaWV0dXZhKVwiLCBcImx0XCIsIFwiMzcwXCIgXSwgWyBcIkx1eGVtYm91cmdcIiwgXCJsdVwiLCBcIjM1MlwiIF0sIFsgXCJNYWNhdSAo5r6z6ZaAKVwiLCBcIm1vXCIsIFwiODUzXCIgXSwgWyBcIk1hY2Vkb25pYSAoRllST00pICjQnNCw0LrQtdC00L7QvdC40ZjQsClcIiwgXCJta1wiLCBcIjM4OVwiIF0sIFsgXCJNYWRhZ2FzY2FyIChNYWRhZ2FzaWthcmEpXCIsIFwibWdcIiwgXCIyNjFcIiBdLCBbIFwiTWFsYXdpXCIsIFwibXdcIiwgXCIyNjVcIiBdLCBbIFwiTWFsYXlzaWFcIiwgXCJteVwiLCBcIjYwXCIgXSwgWyBcIk1hbGRpdmVzXCIsIFwibXZcIiwgXCI5NjBcIiBdLCBbIFwiTWFsaVwiLCBcIm1sXCIsIFwiMjIzXCIgXSwgWyBcIk1hbHRhXCIsIFwibXRcIiwgXCIzNTZcIiBdLCBbIFwiTWFyc2hhbGwgSXNsYW5kc1wiLCBcIm1oXCIsIFwiNjkyXCIgXSwgWyBcIk1hcnRpbmlxdWVcIiwgXCJtcVwiLCBcIjU5NlwiIF0sIFsgXCJNYXVyaXRhbmlhICjigKvZhdmI2LHZitiq2KfZhtmK2KfigKzigI4pXCIsIFwibXJcIiwgXCIyMjJcIiBdLCBbIFwiTWF1cml0aXVzIChNb3JpcylcIiwgXCJtdVwiLCBcIjIzMFwiIF0sIFsgXCJNZXhpY28gKE3DqXhpY28pXCIsIFwibXhcIiwgXCI1MlwiIF0sIFsgXCJNaWNyb25lc2lhXCIsIFwiZm1cIiwgXCI2OTFcIiBdLCBbIFwiTW9sZG92YSAoUmVwdWJsaWNhIE1vbGRvdmEpXCIsIFwibWRcIiwgXCIzNzNcIiBdLCBbIFwiTW9uYWNvXCIsIFwibWNcIiwgXCIzNzdcIiBdLCBbIFwiTW9uZ29saWEgKNCc0L7QvdCz0L7QuylcIiwgXCJtblwiLCBcIjk3NlwiIF0sIFsgXCJNb250ZW5lZ3JvIChDcm5hIEdvcmEpXCIsIFwibWVcIiwgXCIzODJcIiBdLCBbIFwiTW9udHNlcnJhdFwiLCBcIm1zXCIsIFwiMTY2NFwiIF0sIFsgXCJNb3JvY2NvICjigKvYp9mE2YXYutix2KjigKzigI4pXCIsIFwibWFcIiwgXCIyMTJcIiBdLCBbIFwiTW96YW1iaXF1ZSAoTW/Dp2FtYmlxdWUpXCIsIFwibXpcIiwgXCIyNThcIiBdLCBbIFwiTXlhbm1hciAoQnVybWEpICjhgJnhgLzhgJThgLrhgJnhgKwpXCIsIFwibW1cIiwgXCI5NVwiIF0sIFsgXCJOYW1pYmlhIChOYW1pYmnDqylcIiwgXCJuYVwiLCBcIjI2NFwiIF0sIFsgXCJOYXVydVwiLCBcIm5yXCIsIFwiNjc0XCIgXSwgWyBcIk5lcGFsICjgpKjgpYfgpKrgpL7gpLIpXCIsIFwibnBcIiwgXCI5NzdcIiBdLCBbIFwiTmV0aGVybGFuZHMgKE5lZGVybGFuZClcIiwgXCJubFwiLCBcIjMxXCIgXSwgWyBcIk5ldyBDYWxlZG9uaWEgKE5vdXZlbGxlLUNhbMOpZG9uaWUpXCIsIFwibmNcIiwgXCI2ODdcIiBdLCBbIFwiTmV3IFplYWxhbmRcIiwgXCJuelwiLCBcIjY0XCIgXSwgWyBcIk5pY2FyYWd1YVwiLCBcIm5pXCIsIFwiNTA1XCIgXSwgWyBcIk5pZ2VyIChOaWphcilcIiwgXCJuZVwiLCBcIjIyN1wiIF0sIFsgXCJOaWdlcmlhXCIsIFwibmdcIiwgXCIyMzRcIiBdLCBbIFwiTml1ZVwiLCBcIm51XCIsIFwiNjgzXCIgXSwgWyBcIk5vcmZvbGsgSXNsYW5kXCIsIFwibmZcIiwgXCI2NzJcIiBdLCBbIFwiTm9ydGggS29yZWEgKOyhsOyEoCDrr7zso7zso7zsnZgg7J2466+8IOqzte2ZlOq1rSlcIiwgXCJrcFwiLCBcIjg1MFwiIF0sIFsgXCJOb3J0aGVybiBNYXJpYW5hIElzbGFuZHNcIiwgXCJtcFwiLCBcIjE2NzBcIiBdLCBbIFwiTm9yd2F5IChOb3JnZSlcIiwgXCJub1wiLCBcIjQ3XCIgXSwgWyBcIk9tYW4gKOKAq9i52Y/Zhdin2YbigKzigI4pXCIsIFwib21cIiwgXCI5NjhcIiBdLCBbIFwiUGFraXN0YW4gKOKAq9m+2Kfaqdiz2KrYp9mG4oCs4oCOKVwiLCBcInBrXCIsIFwiOTJcIiBdLCBbIFwiUGFsYXVcIiwgXCJwd1wiLCBcIjY4MFwiIF0sIFsgXCJQYWxlc3RpbmUgKOKAq9mB2YTYs9i32YrZhuKArOKAjilcIiwgXCJwc1wiLCBcIjk3MFwiIF0sIFsgXCJQYW5hbWEgKFBhbmFtw6EpXCIsIFwicGFcIiwgXCI1MDdcIiBdLCBbIFwiUGFwdWEgTmV3IEd1aW5lYVwiLCBcInBnXCIsIFwiNjc1XCIgXSwgWyBcIlBhcmFndWF5XCIsIFwicHlcIiwgXCI1OTVcIiBdLCBbIFwiUGVydSAoUGVyw7opXCIsIFwicGVcIiwgXCI1MVwiIF0sIFsgXCJQaGlsaXBwaW5lc1wiLCBcInBoXCIsIFwiNjNcIiBdLCBbIFwiUG9sYW5kIChQb2xza2EpXCIsIFwicGxcIiwgXCI0OFwiIF0sIFsgXCJQb3J0dWdhbFwiLCBcInB0XCIsIFwiMzUxXCIgXSwgWyBcIlB1ZXJ0byBSaWNvXCIsIFwicHJcIiwgXCIxXCIsIDMsIFsgXCI3ODdcIiwgXCI5MzlcIiBdIF0sIFsgXCJRYXRhciAo4oCr2YLYt9ix4oCs4oCOKVwiLCBcInFhXCIsIFwiOTc0XCIgXSwgWyBcIlLDqXVuaW9uIChMYSBSw6l1bmlvbilcIiwgXCJyZVwiLCBcIjI2MlwiIF0sIFsgXCJSb21hbmlhIChSb23Dom5pYSlcIiwgXCJyb1wiLCBcIjQwXCIgXSwgWyBcIlJ1c3NpYSAo0KDQvtGB0YHQuNGPKVwiLCBcInJ1XCIsIFwiN1wiLCAwIF0sIFsgXCJSd2FuZGFcIiwgXCJyd1wiLCBcIjI1MFwiIF0sIFsgXCJTYWludCBCYXJ0aMOpbGVteSAoU2FpbnQtQmFydGjDqWxlbXkpXCIsIFwiYmxcIiwgXCI1OTBcIiwgMSBdLCBbIFwiU2FpbnQgSGVsZW5hXCIsIFwic2hcIiwgXCIyOTBcIiBdLCBbIFwiU2FpbnQgS2l0dHMgYW5kIE5ldmlzXCIsIFwia25cIiwgXCIxODY5XCIgXSwgWyBcIlNhaW50IEx1Y2lhXCIsIFwibGNcIiwgXCIxNzU4XCIgXSwgWyBcIlNhaW50IE1hcnRpbiAoU2FpbnQtTWFydGluIChwYXJ0aWUgZnJhbsOnYWlzZSkpXCIsIFwibWZcIiwgXCI1OTBcIiwgMiBdLCBbIFwiU2FpbnQgUGllcnJlIGFuZCBNaXF1ZWxvbiAoU2FpbnQtUGllcnJlLWV0LU1pcXVlbG9uKVwiLCBcInBtXCIsIFwiNTA4XCIgXSwgWyBcIlNhaW50IFZpbmNlbnQgYW5kIHRoZSBHcmVuYWRpbmVzXCIsIFwidmNcIiwgXCIxNzg0XCIgXSwgWyBcIlNhbW9hXCIsIFwid3NcIiwgXCI2ODVcIiBdLCBbIFwiU2FuIE1hcmlub1wiLCBcInNtXCIsIFwiMzc4XCIgXSwgWyBcIlPDo28gVG9tw6kgYW5kIFByw61uY2lwZSAoU8OjbyBUb23DqSBlIFByw61uY2lwZSlcIiwgXCJzdFwiLCBcIjIzOVwiIF0sIFsgXCJTYXVkaSBBcmFiaWEgKOKAq9in2YTZhdmF2YTZg9ipINin2YTYudix2KjZitipINin2YTYs9i52YjYr9mK2KnigKzigI4pXCIsIFwic2FcIiwgXCI5NjZcIiBdLCBbIFwiU2VuZWdhbCAoU8OpbsOpZ2FsKVwiLCBcInNuXCIsIFwiMjIxXCIgXSwgWyBcIlNlcmJpYSAo0KHRgNCx0LjRmNCwKVwiLCBcInJzXCIsIFwiMzgxXCIgXSwgWyBcIlNleWNoZWxsZXNcIiwgXCJzY1wiLCBcIjI0OFwiIF0sIFsgXCJTaWVycmEgTGVvbmVcIiwgXCJzbFwiLCBcIjIzMlwiIF0sIFsgXCJTaW5nYXBvcmVcIiwgXCJzZ1wiLCBcIjY1XCIgXSwgWyBcIlNpbnQgTWFhcnRlblwiLCBcInN4XCIsIFwiMTcyMVwiIF0sIFsgXCJTbG92YWtpYSAoU2xvdmVuc2tvKVwiLCBcInNrXCIsIFwiNDIxXCIgXSwgWyBcIlNsb3ZlbmlhIChTbG92ZW5pamEpXCIsIFwic2lcIiwgXCIzODZcIiBdLCBbIFwiU29sb21vbiBJc2xhbmRzXCIsIFwic2JcIiwgXCI2NzdcIiBdLCBbIFwiU29tYWxpYSAoU29vbWFhbGl5YSlcIiwgXCJzb1wiLCBcIjI1MlwiIF0sIFsgXCJTb3V0aCBBZnJpY2FcIiwgXCJ6YVwiLCBcIjI3XCIgXSwgWyBcIlNvdXRoIEtvcmVhICjrjIDtlZzrr7zqta0pXCIsIFwia3JcIiwgXCI4MlwiIF0sIFsgXCJTb3V0aCBTdWRhbiAo4oCr2KzZhtmI2Kgg2KfZhNiz2YjYr9in2YbigKzigI4pXCIsIFwic3NcIiwgXCIyMTFcIiBdLCBbIFwiU3BhaW4gKEVzcGHDsWEpXCIsIFwiZXNcIiwgXCIzNFwiIF0sIFsgXCJTcmkgTGFua2EgKOC3geC3iuKAjeC2u+C3kyDgtr3gtoLgtprgt4/gt4ApXCIsIFwibGtcIiwgXCI5NFwiIF0sIFsgXCJTdWRhbiAo4oCr2KfZhNiz2YjYr9in2YbigKzigI4pXCIsIFwic2RcIiwgXCIyNDlcIiBdLCBbIFwiU3VyaW5hbWVcIiwgXCJzclwiLCBcIjU5N1wiIF0sIFsgXCJTd2F6aWxhbmRcIiwgXCJzelwiLCBcIjI2OFwiIF0sIFsgXCJTd2VkZW4gKFN2ZXJpZ2UpXCIsIFwic2VcIiwgXCI0NlwiIF0sIFsgXCJTd2l0emVybGFuZCAoU2Nod2VpeilcIiwgXCJjaFwiLCBcIjQxXCIgXSwgWyBcIlN5cmlhICjigKvYs9mI2LHZitin4oCs4oCOKVwiLCBcInN5XCIsIFwiOTYzXCIgXSwgWyBcIlRhaXdhbiAo5Y+w54GjKVwiLCBcInR3XCIsIFwiODg2XCIgXSwgWyBcIlRhamlraXN0YW5cIiwgXCJ0alwiLCBcIjk5MlwiIF0sIFsgXCJUYW56YW5pYVwiLCBcInR6XCIsIFwiMjU1XCIgXSwgWyBcIlRoYWlsYW5kICjguYTguJfguKIpXCIsIFwidGhcIiwgXCI2NlwiIF0sIFsgXCJUaW1vci1MZXN0ZVwiLCBcInRsXCIsIFwiNjcwXCIgXSwgWyBcIlRvZ29cIiwgXCJ0Z1wiLCBcIjIyOFwiIF0sIFsgXCJUb2tlbGF1XCIsIFwidGtcIiwgXCI2OTBcIiBdLCBbIFwiVG9uZ2FcIiwgXCJ0b1wiLCBcIjY3NlwiIF0sIFsgXCJUcmluaWRhZCBhbmQgVG9iYWdvXCIsIFwidHRcIiwgXCIxODY4XCIgXSwgWyBcIlR1bmlzaWEgKOKAq9iq2YjZhtiz4oCs4oCOKVwiLCBcInRuXCIsIFwiMjE2XCIgXSwgWyBcIlR1cmtleSAoVMO8cmtpeWUpXCIsIFwidHJcIiwgXCI5MFwiIF0sIFsgXCJUdXJrbWVuaXN0YW5cIiwgXCJ0bVwiLCBcIjk5M1wiIF0sIFsgXCJUdXJrcyBhbmQgQ2FpY29zIElzbGFuZHNcIiwgXCJ0Y1wiLCBcIjE2NDlcIiBdLCBbIFwiVHV2YWx1XCIsIFwidHZcIiwgXCI2ODhcIiBdLCBbIFwiVS5TLiBWaXJnaW4gSXNsYW5kc1wiLCBcInZpXCIsIFwiMTM0MFwiIF0sIFsgXCJVZ2FuZGFcIiwgXCJ1Z1wiLCBcIjI1NlwiIF0sIFsgXCJVa3JhaW5lICjQo9C60YDQsNGX0L3QsClcIiwgXCJ1YVwiLCBcIjM4MFwiIF0sIFsgXCJVbml0ZWQgQXJhYiBFbWlyYXRlcyAo4oCr2KfZhNil2YXYp9ix2KfYqiDYp9mE2LnYsdio2YrYqSDYp9mE2YXYqtit2K/YqeKArOKAjilcIiwgXCJhZVwiLCBcIjk3MVwiIF0sIFsgXCJVbml0ZWQgS2luZ2RvbVwiLCBcImdiXCIsIFwiNDRcIiBdLCBbIFwiVW5pdGVkIFN0YXRlc1wiLCBcInVzXCIsIFwiMVwiLCAwIF0sIFsgXCJVcnVndWF5XCIsIFwidXlcIiwgXCI1OThcIiBdLCBbIFwiVXpiZWtpc3RhbiAoT8q7emJla2lzdG9uKVwiLCBcInV6XCIsIFwiOTk4XCIgXSwgWyBcIlZhbnVhdHVcIiwgXCJ2dVwiLCBcIjY3OFwiIF0sIFsgXCJWYXRpY2FuIENpdHkgKENpdHTDoCBkZWwgVmF0aWNhbm8pXCIsIFwidmFcIiwgXCIzOVwiLCAxIF0sIFsgXCJWZW5lenVlbGFcIiwgXCJ2ZVwiLCBcIjU4XCIgXSwgWyBcIlZpZXRuYW0gKFZp4buHdCBOYW0pXCIsIFwidm5cIiwgXCI4NFwiIF0sIFsgXCJXYWxsaXMgYW5kIEZ1dHVuYVwiLCBcIndmXCIsIFwiNjgxXCIgXSwgWyBcIlllbWVuICjigKvYp9mE2YrZhdmG4oCs4oCOKVwiLCBcInllXCIsIFwiOTY3XCIgXSwgWyBcIlphbWJpYVwiLCBcInptXCIsIFwiMjYwXCIgXSwgWyBcIlppbWJhYndlXCIsIFwiendcIiwgXCIyNjNcIiBdIF07XG4gICAgLy8gbG9vcCBvdmVyIGFsbCBvZiB0aGUgY291bnRyaWVzIGFib3ZlXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxDb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBhbGxDb3VudHJpZXNbaV07XG4gICAgICAgIGFsbENvdW50cmllc1tpXSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGNbMF0sXG4gICAgICAgICAgICBpc28yOiBjWzFdLFxuICAgICAgICAgICAgZGlhbENvZGU6IGNbMl0sXG4gICAgICAgICAgICBwcmlvcml0eTogY1szXSB8fCAwLFxuICAgICAgICAgICAgYXJlYUNvZGVzOiBjWzRdIHx8IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL2ludGwtdGVsLWlucHV0L2J1aWxkL2pzL2ludGxUZWxJbnB1dC5qc1xuICoqIG1vZHVsZSBpZCA9IDI3MlxuICoqIG1vZHVsZSBjaHVua3MgPSA2IDdcbiAqKi8iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9sZXNzL3dlYi9tb2R1bGVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyLmxlc3NcbiAqKiBtb2R1bGUgaWQgPSAyNzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gNiA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICBNeXRyYXZlbGxlciA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXInKTtcclxuICAgICBcclxuICAgICByZXF1aXJlKCd3ZWIvbW9kdWxlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5sZXNzJyk7XHJcbi8vJChmdW5jdGlvbigpIHtcclxuLy8gICAgY29uc29sZS5sb2coJ0luc2lkZSBNYWluIG15dHJhdmVsbGVyJyk7XHJcbi8vICAgIHZhciBteXRyYXZlbGxlciA9IG5ldyBNeXRyYXZlbGxlcigpO1xyXG4vLyAgICB2YXIgdXNlciA9IG5ldyBVc2VyKCk7ICAgIFxyXG4vL1xyXG4vLyAgICBteXRyYXZlbGxlci5yZW5kZXIoJyNjb250ZW50Jyk7XHJcbi8vICAgIHVzZXIucmVuZGVyKCcjcGFuZWwnKTtcclxuLy99KTtcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgICAobmV3IE15dHJhdmVsbGVyKCkpLnJlbmRlcignI2FwcCcpO1xyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9teXRyYXZlbGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI3OVxuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgLy8gTXl0cmF2ZWxsZXIgPSByZXF1aXJlKCdhcHAvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJylcclxuICAgIE15dHJhdmVsbGVyID0gcmVxdWlyZSgnc3RvcmVzL215dHJhdmVsbGVyL3RyYXZlbGVyJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL215dHJhdmVsbGVyL21ldGEnKVxyXG4gICAgLy8sXHJcbiAgIC8vIFVzZXIgPSByZXF1aXJlKCdzdG9yZXMvdXNlci91c2VyJylcclxuICAgIDtcclxuXHJcbi8vcmVxdWlyZSgnbW9kdWxlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5sZXNzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5odG1sJyksXHJcblxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICdsYXlvdXQnOiByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9sYXlvdXQnKSxcclxuICAgICAgICAndHJhdmVsbGVyLWZvcm0nOiByZXF1aXJlKCdjb21wb25lbnRzL215dHJhdmVsbGVyL2Zvcm0nKSxcclxuICAgICAgICB0cmF2ZWxsZXJ2aWV3OiByZXF1aXJlKCdjb21wb25lbnRzL215dHJhdmVsbGVyL3ZpZXcnKSxcclxuICAgICAgICB0cmF2ZWxsZXJsaXN0OiByZXF1aXJlKCdjb21wb25lbnRzL215dHJhdmVsbGVyL2xpc3QnKSxcclxuICAgICAvLyAgIGxlZnRwYW5lbDpyZXF1aXJlKCdjb21wb25lbnRzL2xheW91dHMvcHJvZmlsZV9zaWRlYmFyJylcclxuICAgICAgLy8gIHByb2ZpbGVzaWRlYmFyOiByZXF1aXJlKCcuLi9sYXlvdXRzL3Byb2ZpbGVfc2lkZWJhcicpXHJcbiAgICB9LFxyXG4gICAgcGFydGlhbHM6IHtcclxuICAgICAgICAnYmFzZS1wYW5lbCc6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvbGF5b3V0L3BhbmVsLmh0bWwnKVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KCdteXRyYXZlbGxlci5wZW5kaW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgTWV0YS5pbnN0YW5jZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihtZXRhKSB7IHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7fS5iaW5kKHRoaXMpKTtcclxuICAgICAgIE15dHJhdmVsbGVyLmZldGNoKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHRyYXZlbGVycykgeyB0aGlzLnNldCgnbXl0cmF2ZWxsZXIucGVuZGluZycsIGZhbHNlKTsgdGhpcy5zZXQoJ215dHJhdmVsbGVyJywgdHJhdmVsZXJzKTsgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgIFxyXG4gICAgICAgLy8gY29uc29sZS5sb2coVXNlci5kYXRhKCkpO1xyXG4gICAgICAgLy90aGlzLnNldCgndXNlcicsIFVzZXIuZGF0YSgpKTtcclxuICAgICAgIC8vIHdpbmRvdy52aWV3ID0gdGhpcztcclxuICAgIH0sXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICBcclxuICAgICAgICByZXR1cm4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZWZ0bWVudTpmYWxzZSxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gbGVmdE1lbnU6ZnVuY3Rpb24oKSB7IHZhciBmbGFnPXRoaXMuZ2V0KCdsZWZ0bWVudScpOyB0aGlzLnNldCgnbGVmdG1lbnUnLCAhZmxhZyk7fSxcclxuICAgXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoTU9CSUxFKSB7XHJcbiAgICAgICAgICAgIHZhciBvcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICQoJyNtX21lbnUnKS5zaWRlYmFyKHsgb25IaWRkZW46IGZ1bmN0aW9uKCkgeyAkKCcjbV9idG4nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTsgIH0sIG9uU2hvdzogZnVuY3Rpb24oKSB7ICQoJyNtX2J0bicpLmFkZENsYXNzKCdkaXNhYmxlZCcpOyAgfX0pO1xyXG4gICAgICAgICAgICAkKCcuZHJvcGRvd24nKS5kcm9wZG93bigpO1xyXG5cclxuICAgICAgICAgICAgJCgnI21fYnRuJywgdGhpcy5lbCkub24oJ2NsaWNrLmxheW91dCcsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNtX21lbnUnKS5zaWRlYmFyKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJy5wdXNoZXInKS5vbmUoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAkKCcudWkuY2hlY2tib3gnLCB0aGlzLmVsKS5jaGVja2JveCgpO1xyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI4MFxuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxyXG4gICAgXHJcbiAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJykgIDtcclxuXHJcbnZhciBUcmF2ZWxlciA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIHByaWNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXy5yZWR1Y2UodGhpcy5nZXQoJyAnKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuVHJhdmVsZXIucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgZGF0YS50cmF2ZWxsZXJzPSBfLm1hcChkYXRhLCBmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHsgaWQ6IGkuaWQsdXNlcl9pbmZvX2lkOmkudXNlcl9pbmZvX2lkLHRpdGxlOmkudHJhdmVsZXJfdGl0bGVfaWQsZ2VuZGVyX2lkOmkuZ2VuZGVyX2lkLHBhc3Nwb3J0X2NvdW50cnlfaWQ6aS5wYXNzcG9ydF9jb3VudHJ5X2lkLGNpdHlfaWQ6aS5jaXR5X2lkLCBlbWFpbDogaS5lbWFpbCwgbW9iaWxlOiBpLm1vYmlsZSxwYXNzcG9ydF9udW1iZXI6aS5wYXNzcG9ydF9udW1iZXIsIHBhc3Nwb3J0X2lzc3VlOmkucGFzc3BvcnRfaXNzdWUsXHJcbiAgICAgICAgICAgICAgICBwYXNzcG9ydF9leHBpcnk6aS5wYXNzcG9ydF9leHBpcnksIHBhc3Nwb3J0X3BsYWNlOmkucGFzc3BvcnRfcGxhY2UsIHBpbmNvZGU6aS5waW5jb2RlLGFkZHJlc3M6aS5hZGRyZXNzLHBob25lOmkucGhvbmUsZW1haWwyOmkuZW1haWwyLFxyXG4gICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBpLmZpcnN0X25hbWUsIGxhc3RfbmFtZTppLmxhc3RfbmFtZSxiaXJ0aGRhdGU6aS5iaXJ0aGRhdGUsYmFzZVVybDonJ307IH0pOyBcclxuICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YS50cmF2ZWxsZXJzKTsgXHJcbiAgICAgICAgICB2YXIgdXJsPXdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgaWYodXJsLmluZGV4T2YoJ215dHJhdmVsZXJzLycpPi0xKXtcclxuICAgICAgICAgICAgICB2YXIgY2lkPXVybC5zcGxpdCgnbXl0cmF2ZWxlcnMvJylbMV07ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXI9Xy5sYXN0KF8uZmlsdGVyKGRhdGEudHJhdmVsbGVycywgeydpZCc6IF8ucGFyc2VJbnQoY2lkKX0pKTsgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmKGRhdGEuY3VycmVudFRyYXZlbGxlciE9bnVsbClcclxuICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudFRyYXZlbGxlcklkPWRhdGEuY3VycmVudFRyYXZlbGxlci5pZDtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXI9IF8uZmlyc3QoZGF0YS50cmF2ZWxsZXJzKTtcclxuICAgICAgICAgICAgaWYoZGF0YS5jdXJyZW50VHJhdmVsbGVyIT1udWxsKVxyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXJJZD1kYXRhLmN1cnJlbnRUcmF2ZWxsZXIuaWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGEuY2FiaW5UeXBlPSAxO1xyXG4gICAgICAgICAgICBkYXRhLmFkZD1mYWxzZTtcclxuICAgICAgICAgICAgZGF0YS5lZGl0PWZhbHNlO1xyXG4gICAgICAgICAgICBkYXRhLnBhc3NlbmdlcnM9IFsxLCAwLCAwXTtcclxuICAgICAgICAgICAgZGF0YS5wZW5kaW5nPSBmYWxzZTtcclxuICAgICAgICAgICAgZGF0YS5lcnJvcnM9IHt9O1xyXG4gICAgICAgICAgICBkYXRhLnJlc3VsdHM9IFtdO1xyXG5cclxuICAgICAgICAgICAgZGF0YS5maWx0ZXI9IHt9O1xyXG4gICAgICAgICAgICBkYXRhLmZpbHRlcmVkPSB7fTtcclxuICAgIHJldHVybiBuZXcgVHJhdmVsZXIoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcblRyYXZlbGVyLmFkZD0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIkluc2lkZSBUcmF2ZWxlci5hZGRcIik7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgLy8kLnBvc3QoJy9iMmMvdHJhdmVsZXIvY3JlYXRlJywgSlNPTi5zdHJpbmdpZnkoZGF0YSksICdqc29uJylcclxuICAgICAgICQuYWpheCh7XHJcbiAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICB1cmw6ICcvYjJjL3RyYXZlbGVyL2NyZWF0ZScsXHJcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgZGF0YTogeydkYXRhJzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9LFxyXG4gICAgc3VjY2VzczogZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgLy8gY29uc29sZS5sb2coXCJTdWNjZXNzXCIpO1xyXG4gICAgfVxyXG4gIH0pICAgICAudGhlbihmdW5jdGlvbihyZGF0YSkgeyBjb25zb2xlLmxvZyhyZGF0YSk7cmVzb2x2ZSh7ZGF0YTpyZGF0YS50cmF2ZWxlcl9pZH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZhaWxlZFwiKTtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgfTtcclxuVHJhdmVsZXIuZmV0Y2ggPSBmdW5jdGlvbihpZCkge1xyXG4gICAvLyBjb25zb2xlLmxvZyhcIlRyYXZlbGVyLmZldGNoXCIpO1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvdHJhdmVsZXIvZ2V0TXlUcmF2ZWxlcnNMaXN0JylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyAgcmVzb2x2ZShUcmF2ZWxlci5wYXJzZShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkXCIpO1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYXZlbGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXl0cmF2ZWxsZXIvdHJhdmVsZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyODFcbiAqKiBtb2R1bGUgY2h1bmtzID0gN1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJveCBteS10cmF2ZWxsZXJzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJjdXJyZW50VHJhdmVsZXJcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyYXZlbGxlcnZpZXdcIixcImFcIjp7XCJteXRyYXZlbGxlclwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXl0cmF2ZWxsZXIuYWRkXCIsXCJteXRyYXZlbGxlci5lZGl0XCJdLFwic1wiOlwiIV8wJiYhXzFcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyYXZlbGxlci1mb3JtXCIsXCJhXCI6e1wibXl0cmF2ZWxsZXJcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlclwifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV0sXCJ4XCI6e1wiclwiOltcIm15dHJhdmVsbGVyLmFkZFwiLFwibXl0cmF2ZWxsZXIuZWRpdFwiXSxcInNcIjpcIiFfMCYmIV8xXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0cmF2ZWxsZXJsaXN0XCIsXCJhXCI6e1wibXl0cmF2ZWxsZXJcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlclwifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV19XX0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDI4MlxuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICAgICAgTXl0cmF2ZWxsZXIgPSByZXF1aXJlKCdzdG9yZXMvbXl0cmF2ZWxsZXIvdHJhdmVsZXInKVxyXG4gICAgICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215dHJhdmVsbGVyL2Zvcm0uaHRtbCcpLFxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1zcGlubmVyJzogcmVxdWlyZSgnY29yZS9mb3JtL3NwaW5uZXInKSxcclxuICAgICAgICAndWktY2FsZW5kYXInOiByZXF1aXJlKCdjb3JlL2Zvcm0vY2FsZW5kYXInKSxcclxuICAgICAgICAndWktdGVsJzogcmVxdWlyZSgnY29yZS9mb3JtL3RlbCcpLFxyXG4gICAgICAgICd1aS1lbWFpbCc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9lbWFpbCcpLFxyXG4gICAgICAgICd1aS1pbnB1dCc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9pbnB1dCcpLFxyXG4gICAgICAgICd1aS1kYXRlJzogcmVxdWlyZSgnY29yZS9mb3JtL2RhdGUnKSxcclxuICAgIH0sXHJcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3I6bnVsbCxcclxuICAgICAgICAgICAgc3RhdGU6IHtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gIG1ldGE6IHJlcXVpcmUoJ2FwcC9zdG9yZXMvbWV0YScpLmluc3RhbmNlKCksXHJcblxyXG4gICAgICAgICAgICBmb3JtYXRUaXRsZXM6IGZ1bmN0aW9uICh0aXRsZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gXy5jbG9uZURlZXAodGl0bGVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB0ZXh0OiBpLm5hbWV9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgZGF0ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmdldCgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcicpIT1udWxsKXtcclxuICAgICAgICAgICAgZGF0ZSA9IHRoaXMuZ2V0KCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZScpO1xyXG4gICAgICAgICAgICBpZihkYXRlIT1udWxsJiZkYXRlIT0nJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZScsIG1vbWVudChkYXRlLCAnWVlZWS1NTS1ERCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uKCdhZGQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBuZXd0cmF2ZWxsZXIgPSB0aGlzLmdldCgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcicpO1xyXG4gICAgICAgICAgICB2YXIgdHJhdmVsbGVycyA9IHRoaXMuZ2V0KCdteXRyYXZlbGxlci50cmF2ZWxsZXJzJyk7XHJcbiAgICAgICAgICAgIHZhciB0ID0gbmV3dHJhdmVsbGVyLnRpdGxlOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBiaXJ0aGRhdGUgPSBuZXd0cmF2ZWxsZXIuYmlydGhkYXRlO1xyXG4gICAgICAgICAgICBpZiAobW9tZW50LmlzTW9tZW50KGJpcnRoZGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcclxuICAgICAgICAgICAgICAgIGJpcnRoZGF0ZSA9IGJpcnRoZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXIgPSB7dGl0bGU6IG5ld3RyYXZlbGxlci50aXRsZSwgZW1haWw6IG5ld3RyYXZlbGxlci5lbWFpbCwgbW9iaWxlOiBuZXd0cmF2ZWxsZXIubW9iaWxlLCBmaXJzdF9uYW1lOiBuZXd0cmF2ZWxsZXIuZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgIGxhc3RfbmFtZTogbmV3dHJhdmVsbGVyLmxhc3RfbmFtZSwgYmlydGhkYXRlOiBiaXJ0aGRhdGUsIGJhc2VVcmw6ICcnLCBwYXNzcG9ydF9udW1iZXI6IG5ld3RyYXZlbGxlci5wYXNzcG9ydF9udW1iZXIsIHBhc3Nwb3J0X3BsYWNlOiBuZXd0cmF2ZWxsZXIucGFzc3BvcnRfcGxhY2VcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy90cmF2ZWxlci9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6IEpTT04uc3RyaW5naWZ5KGN1cnJlbnR0cmF2ZWxsZXIpfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChpZGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGlkZC5lcnJvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIGlkZC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnR0cmF2ZWxsZXIuaWQgPSBpZGQudHJhdmVsZXJfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgndHJhdmVsbGVycycsIHRyYXZlbGxlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcicsIGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgY3VycmVudHRyYXZlbGxlci5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdhZGQnLCBmYWxzZSk7fVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2Vycm9yJywgaWRkLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbignZWRpdCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiSW5zaWRlIEVkaXRcIik7XHJcbiAgICAgICAgICAgIHZhciBuZXd0cmF2ZWxsZXIgPSB0aGlzLmdldCgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcicpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5nZXQoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXInKSk7XHJcbiAgICAgICAgICAgIHZhciB0cmF2ZWxsZXJzID0gdGhpcy5nZXQoJ215dHJhdmVsbGVyLnRyYXZlbGxlcnMnKTtcclxuICAgICAgICAgICAgdmFyIHQgPSBuZXd0cmF2ZWxsZXIudGl0bGU7XHJcbiAgICAgICAgICAgIC8vdmFyIHRpdGxlcz1fLmNsb25lRGVlcCh0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS50aXRsZXMpO1xyXG4gICAgICAgICAgICAvL3ZhciB0aXRsZTtcclxuICAgICAgICAgICAgLy8gXy5lYWNoKHRpdGxlcywgZnVuY3Rpb24oaSwgaykgeyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcclxuICAgICAgICAgICAgdmFyIGJpcnRoZGF0ZSA9IG5ld3RyYXZlbGxlci5iaXJ0aGRhdGU7XHJcbiAgICAgICAgICAgIGlmIChtb21lbnQuaXNNb21lbnQoYmlydGhkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZScsIGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykpO1xyXG4gICAgICAgICAgICAgICAgYmlydGhkYXRlID0gYmlydGhkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZ2V0KCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmlkJyk7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50dHJhdmVsbGVyID0ge2lkOiBpZCx0aXRsZTogbmV3dHJhdmVsbGVyLnRpdGxlLCBlbWFpbDogbmV3dHJhdmVsbGVyLmVtYWlsLCBtb2JpbGU6IG5ld3RyYXZlbGxlci5tb2JpbGUsIGZpcnN0X25hbWU6IG5ld3RyYXZlbGxlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBuZXd0cmF2ZWxsZXIubGFzdF9uYW1lLCBiaXJ0aGRhdGU6IGJpcnRoZGF0ZSwgYmFzZVVybDogJycsIHBhc3Nwb3J0X251bWJlcjogbmV3dHJhdmVsbGVyLnBhc3Nwb3J0X251bWJlciwgcGFzc3BvcnRfcGxhY2U6IG5ld3RyYXZlbGxlci5wYXNzcG9ydF9wbGFjZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbihhcnIsIGtleSwgbmV3dmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IF8uZmluZChhcnIsIGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1hdGNoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF8ubWVyZ2UobWF0Y2gsIG5ld3ZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL3RyYXZlbGVyL3VwZGF0ZS8nKyBfLnBhcnNlSW50KGlkKSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiBKU09OLnN0cmluZ2lmeShjdXJyZW50dHJhdmVsbGVyKX0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaWRkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaWRkLnJlc3VsdD09J3N1Y2Nlc3MnKXtcclxuICAgICAgICAgICAgICAgICAgICBfLm1peGluKHsgJyR1cGRhdGUnOiB1cGRhdGUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy4kdXBkYXRlKHRyYXZlbGxlcnMsIHtpZDppZH0sIGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc3BsaWNlKCd0cmF2ZWxsZXJzJywgaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsbGVycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCd0cmF2ZWxsZXJzJywgdHJhdmVsbGVycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJywgY3VycmVudHRyYXZlbGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVySWQnLCBpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdlZGl0JywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIGlkZC5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgYWRkSm91cm5leTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vICB0aGlzLmdldCgnc2VhcmNoJykucHVzaCgnZmxpZ2h0cycsIHsgZnJvbTogMjMzNiwgdG86IDYyNywgZGVwYXJ0X2F0OiBtb21lbnQoKS5lbmRPZignbW9udGgnKSwgcmV0dXJuX2F0OiBudWxsfSk7XHJcbiAgICB9LFxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgdGhpcy5vYnNlcnZlKCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyJywgZnVuY3Rpb24odmFsdWUpIHtcclxuLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnRUcmF2ZWxsZXIgY2hhbmdlZCBcIik7XHJcbi8vICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh2YWx1ZSk7XHJcbi8vICAgICAgICAgICAgLy90aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLCB2YWx1ZSk7XHJcbi8vICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcclxuLy8gICAgICAgIHRoaXMub2JzZXJ2ZSgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcklkJywgZnVuY3Rpb24odmFsdWUpIHtcclxuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY3VycmVudFRyYXZlbGxlcklkIGNoYW5nZWQgXCIpO1xyXG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2codmFsdWUpO1xyXG4vLyAgICAgICAgICAgIC8vdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVySWQnLCB2YWx1ZSk7XHJcbi8vICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvZm9ybS5qc1xuICoqIG1vZHVsZSBpZCA9IDI4M1xuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlwidWkgZm9ybSBiYXNpYyBzZWdtZW50IGZsaWdodCBzZWFyY2hcIn0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIixcInN0eWxlXCI6XCJkaXNwbGF5OmJsb2NrXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvclwifV19XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGV0YWlsc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMlwiLFwiZlwiOltcIlBlcnNvbmFsIERldGFpbHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiVGl0bGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIudGl0bGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIHRyYW5zcGFyZW50XCIsXCJwbGFjZWhvbGRlclwiOlwiVGl0bGVcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRpdGxlc1wiLFwibWV0YS50aXRsZXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiRmlyc3QgTmFtZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwiZmlyc3RfbmFtZVwiLFwicGxhY2Vob2xkZXJcIjpcIkZpcnN0IE5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5maXJzdF9uYW1lXCJ9XX0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJMYXN0IE5hbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImxhc3RfbmFtZVwiLFwicGxhY2Vob2xkZXJcIjpcIkxhc3QgTmFtZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmxhc3RfbmFtZVwifV19LFwiZlwiOltdfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteXRyYXZlbGxlci5hZGRcIixcIm15dHJhdmVsbGVyLmVkaXRcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIkRhdGUgb2YgQmlydGg6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZGF0ZVwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJsYXJnZVwiOlwiMFwiLFwicGxhY2Vob2xkZXJcIjpcIkRhdGUgb2YgQmlydGhcIixcImNoYW5nZXllYXJcIjpcIjFcIn0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJQYXNzcG9ydCBObzpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInBhc3Nwb3J0X3BsYWNlXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3BvcnQgTm9cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5wYXNzcG9ydF9udW1iZXJcIn1dfSxcImZcIjpbXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIklzc3VlZCBQbGFjZTpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInBhc3Nwb3J0X3BsYWNlXCIsXCJwbGFjZWhvbGRlclwiOlwiSXNzdWVkIFBsYWNlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfcGxhY2VcIn1dfSxcImZcIjpbXX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXRhaWxzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgyXCIsXCJmXCI6W1wiQ29udGFjdCBEZXRhaWxzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIkVtYWlsIEFkZHJlc3M6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZW1haWxcIixcImFcIjp7XCJuYW1lXCI6XCJlbWFpbFwiLFwicGxhY2Vob2xkZXJcIjpcIkUtTWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmVtYWlsXCJ9XX19LFwiIFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJNb2JpbGUgTnVtYmVyOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLXRlbFwiLFwiYVwiOntcIm5hbWVcIjpcIm1vYmlsZVwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLm1vYmlsZVwifV19fV19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm9uZSBjb2x1bW4gcm93XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwidlwiOntcImNsaWNrXCI6XCJhZGRcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJ1dHRvbiBtYXNzaXZlIGZsdWlkXCJ9LFwiZlwiOltcIkFkZCBUcmF2ZWxsZXJcIl19XSxcIm5cIjo1MCxcInJcIjpcIm15dHJhdmVsbGVyLmFkZFwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcInZcIjp7XCJjbGlja1wiOlwiZWRpdFwifSxcImFcIjp7XCJjbGFzc1wiOlwidWkgYnV0dG9uIG1hc3NpdmUgZmx1aWRcIn0sXCJmXCI6W1wiRWRpdCBUcmF2ZWxsZXJcIl19LFwiIFwiXSxcIm5cIjo1MCxcInJcIjpcIm15dHJhdmVsbGVyLmVkaXRcIn1dfV19XX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvZm9ybS5odG1sXG4gKiogbW9kdWxlIGlkID0gMjg0XG4gKiogbW9kdWxlIGNodW5rcyA9IDdcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG4gICAgICAgIC8vLFxyXG4gICAgICAgIC8vTXl0cmF2ZWxsZXIgPSByZXF1aXJlKCdhcHAvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJykgICA7XHJcbiAgICAgICAgO1xyXG5cclxuXHJcbnZhciB0Mm0gPSBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgdmFyIGkgPSB0aW1lLnNwbGl0KCc6Jyk7XHJcblxyXG4gICAgcmV0dXJuIGlbMF0gKiA2MCArIGlbMV07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teXRyYXZlbGxlci92aWV3Lmh0bWwnKSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy9teXRyYXZlbGxlcjp0aGlzLmdldCgnbXl0cmF2ZWxsZXInKSxcclxuICAgICAgICAgICAgLy9teXRyYXZlbGxlcjpuZXcgTXl0cmF2ZWxsZXIoKSxcclxuICAgICAgICAgICAgZm9ybWF0QmlydGhEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUaXRsZTogZnVuY3Rpb24gKHRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aXRsZXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIHNvcnRPbjogZnVuY3Rpb24gKG9uKSB7XHJcbiAgICAgICAgaWYgKG9uID09IHRoaXMuZ2V0KCdzb3J0T24uMCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzb3J0T24uMScsIC0xICogdGhpcy5nZXQoJ3NvcnRPbi4xJykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzb3J0T24nLCBbb24sIDFdKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25pbml0OiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub24oJ2FkZCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdhZGQnLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJywgbnVsbCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJywgXy5sYXN0KF8uZmlsdGVyKHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnRyYXZlbGxlcnMsIHsnaWQnOiBpZH0pKSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMub24oJ2VkaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ215dHJhdmVsbGVyLmVkaXQnLHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgnbXl0cmF2ZWxsZXInKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJJbnNpZGUgZWRpdFwiKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5nZXQoJ215dHJhdmVsbGVyJykpO1xyXG4gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgaWQpO1xyXG4gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcicsIF8ubGFzdChfLmZpbHRlcih0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS50cmF2ZWxsZXJzLCB7J2lkJzogaWR9KSkpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdkZWxldGUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuZ2V0KCdjdXJyZW50VHJhdmVsbGVySWQnKTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL3RyYXZlbGVyL2RlbGV0ZS8nKyBfLnBhcnNlSW50KGlkKSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaWRkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaWRkLnJlc3VsdD09J3N1Y2Nlc3MnKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLmdldCgnbXl0cmF2ZWxsZXIudHJhdmVsbGVycycpLCB7J2lkJzogaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGljZSgnbXl0cmF2ZWxsZXIudHJhdmVsbGVycycsIGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLCBfLmZpcnN0KHRoaXMuZ2V0KCdteXRyYXZlbGxlci50cmF2ZWxsZXJzJykpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcsIHRoaXMuZ2V0KCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmlkJykpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoaWRkLm1zZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKCdpbmRleCAnK18uZmluZEluZGV4KHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnRyYXZlbGxlcnMsIGZ1bmN0aW9uKGNocikgeyAgcmV0dXJuIGNoci5pZCA9PSBpZDt9KSk7XHJcbiAgICAgICAgICAgIC8vICB0aGlzLnNwbGljZSh0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS50cmF2ZWxsZXJzLCBfLmZpbmRJbmRleCh0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS50cmF2ZWxsZXJzLCBmdW5jdGlvbihjaHIpIHsgIHJldHVybiBjaHIuaWQgPT0gaWQ7fSksIDEpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXInLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5zaWRlIHZpZXcgY3VycmVudFRyYXZlbGxlciBjaGFuZ2VkXCIpO1xyXG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcclxuLy8gICAgICAgICAgICBcclxuLy8gICAgICAgIH0sIHtpbml0OiB0cnVlfSk7XHJcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXJJZCcsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbi8vICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImN1cnJlbnRUcmF2ZWxsZXJJZCBjaGFuZ2VkIFwiKTtcclxuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHZhbHVlKTtcclxuLy8gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgdmFsdWUpO1xyXG4vLyAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL215dHJhdmVsbGVyL3ZpZXcuanNcbiAqKiBtb2R1bGUgaWQgPSAyODVcbiAqKiBtb2R1bGUgY2h1bmtzID0gN1xuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImgxXCIsXCJmXCI6W1wiUGVvcGxlIHlvdSBib29rIHRyYXZlbCBmb3JcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjpcImFkZFwifSxcImFcIjp7XCJjbGFzc1wiOlwibWlkZGxlIGJsdWUgYWRkLW5ld1wifSxcImZcIjpbXCJBZGQgTmV3IFRyYXZlbGxlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJ1aSBzZWdtZW50IGxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJteXRyYXZlbGxlci5wZW5kaW5nXCJ9XSxcInN0eWxlXCI6XCJtaW4taGVpZ2h0OjUwcHhcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidXNlci1pbmZvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuYmFzZVVybFwifSxcIi90aGVtZXMvQjJDL2ltZy9ndWVzdC5wbmdcIl0sXCJhbHRcIjpcIlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibmFtZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRpdGxlXCIsXCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnRpdGxlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiBcIix7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZmlyc3RfbmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubGFzdF9uYW1lXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY3VzdG9tZXItaWRcIn0sXCJmXCI6W1wiQ3VzdG9tZXIgSWQ6IFwiLHtcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5pZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBob25lXCJ9LFwiZlwiOltcIk1vYmlsZSBObzogXCIse1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLm1vYmlsZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFjdGlvblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOlwiZWRpdFwifSxcImFcIjp7XCJjbGFzc1wiOlwic21hbGwgZ3JheVwifSxcImZcIjpbXCJFZGl0XCJdfSxcIiBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGV0YWlsc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMlwiLFwiZlwiOltcIkNvbnRhY3QgRGV0YWlsc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJFbWFpbCBBZGRyZXNzOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZW1haWxcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIk1vYmlsZSBOdW1iZXI6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5tb2JpbGVcIn1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXRhaWxzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgyXCIsXCJmXCI6W1wiUGVyc29uYWwgRGV0YWlsc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJEYXRlIG9mIEJpcnRoOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0QmlydGhEYXRlXCIsXCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZVwiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIlBhc3Nwb3J0IE5vOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJJc3N1ZWQgUGxhY2U6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5wYXNzcG9ydF9wbGFjZVwifV19XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXJcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRldGFpbHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDJcIixcImZcIjpbXCJObyBUcmF2ZWxsZXIgQWRkZWRcIl19XX1dLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlclwifV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15dHJhdmVsbGVyLnBlbmRpbmdcIl0sXCJzXCI6XCIhXzBcIn19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215dHJhdmVsbGVyL3ZpZXcuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDI4NlxuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICBNeXRyYXZlbGxlciA9IHJlcXVpcmUoJ3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpICAgXHJcbiAgICA7XHJcblxyXG5cclxudmFyIHQybSA9IGZ1bmN0aW9uKHRpbWUpIHtcclxuICAgIHZhciBpID0gdGltZS5zcGxpdCgnOicpO1xyXG5cclxuICAgIHJldHVybiBpWzBdKjYwK2lbMV07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teXRyYXZlbGxlci9saXN0Lmh0bWwnKSxcclxuXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25pbml0OiBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XHJcblxyXG4gICAgfSxcclxuICAgIG1vYmlsZXNlbGVjdDpmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgdmFyIHZpZXc9dGhpcztcclxuXHRcdC8vY29uc29sZS5sb2coJ2luc2lkZSBtb2JpbGVzZWxlY3QnKTtcclxuICAgICAgICAkKCcudWkuZGltbWVyJykuYWRkQ2xhc3MoJ2hpZGVpbXAnKTtcclxuXHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZGltbWFibGUnKTtcclxuXHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZGltbWVkJyk7XHJcblx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3Njcm9sbGluZycpO1xyXG5cdFx0JCgnYm9keScpLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcclxuXHRcdFxyXG5cdFx0JCgnLmxpc3R0cmF2ZWxsZXInKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcudWkuZGltbWVyJykucmVtb3ZlQ2xhc3MoJ2hpZGVpbXAnKTtcclxuXHRcdFx0XHJcblx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnZGltbWFibGUnKTtcclxuXHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnZGltbWVkJyk7XHJcblx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ3Njcm9sbGluZycpO1xyXG5cdFx0Ly8kKCdib2R5JykucmVtb3ZlQXR0cignaGVpZ2h0Jyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdCAgICBpZih2aWV3LmdldCgnbXl0cmF2ZWxsZXIuZWRpdCcpKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nL2IyYy90cmF2ZWxlci9teXRyYXZlbGVycy8nK2lkOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnZWRpdCcsZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2FkZCcsZmFsc2UpO1xyXG4gICAgICAgICAgICB2aWV3LmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLG51bGwpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcsIGlkKTtcclxuICAgICAgICAgICAgdmFyIGN0PV8ubGFzdChfLmZpbHRlcih2aWV3LmdldCgnbXl0cmF2ZWxsZXIudHJhdmVsbGVycycpLCB7J2lkJzogaWR9KSk7XHJcbiAgICAgICAgICAgIHZpZXcuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcicsIGN0KTtcclxuICAgICAgICBcclxuXHRcdFxyXG5cdFx0XHJcblx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XHJcblx0XHQgdGVzdDpmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgdmFyIHZpZXc9dGhpcztcclxuICAgICAgICAgICAgaWYodmlldy5nZXQoJ215dHJhdmVsbGVyLmVkaXQnKSl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9Jy9iMmMvdHJhdmVsZXIvbXl0cmF2ZWxlcnMvJytpZDsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2VkaXQnLGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdhZGQnLGZhbHNlKTtcclxuICAgICAgICAgICAgdmlldy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxudWxsKTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVySWQnLCBpZCk7XHJcbiAgICAgICAgICAgIHZhciBjdD1fLmxhc3QoXy5maWx0ZXIodmlldy5nZXQoJ215dHJhdmVsbGVyLnRyYXZlbGxlcnMnKSwgeydpZCc6IGlkfSkpO1xyXG4gICAgICAgICAgICB2aWV3LmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLCBjdCk7XHJcbiAgICAgICAgfVx0XHJcblxyXG4gICAgfSxcclxuXHRcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvbGlzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDI4N1xuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJpZ2h0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgyXCIsXCJmXCI6W1wiTXkgVHJhdmVsbGVyc1wiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W1wiTm8gVHJhdmVsbGVyIEZvdW5kLlwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteXRyYXZlbGxlci50cmF2ZWxsZXJzLmxlbmd0aFwiXSxcInNcIjpcIl8wPT0wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInRlc3RcIixcImFcIjp7XCJyXCI6W1wiaWRcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5pZFwiLFwiaWRcIl0sXCJzXCI6XCJfMD09XzFcIn19XSxcImlkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpbe1widFwiOjIsXCJyXCI6XCJiYXNlVXJsXCJ9LFwiL3RoZW1lcy9CMkMvaW1nL2d1ZXN0LnBuZ1wiXSxcImFsdFwiOlwiXCJ9fSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImZpcnN0X25hbWVcIn0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJsYXN0X25hbWVcIn1dfV0sXCJuXCI6NTIsXCJyXCI6XCJteXRyYXZlbGxlci50cmF2ZWxsZXJzXCJ9XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215dHJhdmVsbGVyL2xpc3QuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDI4OFxuICoqIG1vZHVsZSBjaHVua3MgPSA3XG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==