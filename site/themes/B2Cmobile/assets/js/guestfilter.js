webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(248);


/***/ },

/***/ 57:
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

/***/ 62:
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

/***/ 248:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  GuestFilter = __webpack_require__(249);
	     
	__webpack_require__(255);
	
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
	});

/***/ },

/***/ 249:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	        Auth = __webpack_require__(73),
	        MybookingData = __webpack_require__(62),
	        Meta = __webpack_require__(57)
	        ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(250),
	    components: {
	        'layout': __webpack_require__(70),
	        auth: __webpack_require__(73),
	        guestbooking: __webpack_require__(251),
	        details: __webpack_require__(253),
	    },
	    partials: {
	        'base-panel': __webpack_require__(98)
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
	                    console.log(data);
	            if (data && data.id) {
	                window.location.href = '/b2c/airCart/mybookings';
	            }
	                 });
	    },
	      signup: function() {
	        Auth.signup();
	    },
	});

/***/ },

/***/ 250:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"id":"guestbooking","class":"content"},"f":[{"t":7,"e":"div","a":{"class":"step header step1 active"},"f":["Get Booking"]}," ",{"t":7,"e":"div","a":{"class":"ui segment"},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[" ",{"t":7,"e":"auth","a":{"meta":[{"t":2,"r":"meta"}]}}]}," ",{"t":7,"e":"div","a":{"class":"ui vertical divider"},"f":["Or"]}," ",{"t":7,"e":"div","a":{"class":"center aligned column"},"f":[{"t":7,"e":"guestbooking","a":{"mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}]}]}]}]}],"n":50,"x":{"r":["mybookings.loggedin"],"s":"!_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"details","a":{"mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["mybookings.loggedin"],"s":"!_0"}}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 251:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(32),
	        Q = __webpack_require__(26)
	        ;
	var Form = __webpack_require__(33)
	        ;
	var GuestBooking = Form.extend({
	    template: __webpack_require__(252),
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

/***/ 252:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting"}],"style":"position: relative;"},"v":{"submit":{"m":"getticketbypnr","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable "},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment","style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"mobile","value":[{"t":2,"r":"mobile"}],"class":"fluid ","placeholder":"Mobile / Email"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"pnr","value":[{"t":2,"r":"pnr"}],"class":"fluid","placeholder":"PNR / Booking Id."},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui small blue button "},"f":["SUBMIT"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ui horizontal divider"},"f":["OR"]}," ",{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors2","errorMsg2"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting2"}],"style":"position: relative;"},"v":{"submit":{"m":"getticketbylastname","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable "},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment","style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"lastname","value":[{"t":2,"r":"lastname"}],"class":"fluid ","placeholder":"Last Name"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"pnr2","value":[{"t":2,"r":"pnr2"}],"class":"fluid","placeholder":"PNR / Booking Id."},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg2"}]}],"n":50,"r":"errorMsg2"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors2"}]}],"n":50,"x":{"r":["errors2","errorMsg2"],"s":"_0||_1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui small blue button "},"f":["SUBMIT"]}]}]}]}]}]};

/***/ },

/***/ 253:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(33),
	        Auth = __webpack_require__(73),
	        moment = __webpack_require__(43),
	        _ = __webpack_require__(29),
	        accounting = __webpack_require__(68)
	        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(254),
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
	        console.log(view.get('mybookings'));
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
	        
	    }
	});

/***/ },

/***/ 254:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui positive  message","style":"display: none"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":"closemessage"}}," ",{"t":4,"f":["Sending Email.."],"n":50,"r":"./submitting"},{"t":4,"n":51,"f":["Email Sent"],"r":"./submitting"}]}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}},{"t":7,"e":"div","a":{"class":["box my-bookings-details ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"noprint"},"f":[{"t":7,"e":"h1","a":{"style":"vertical-align: bottom"},"f":["My Bookings Details ",{"t":4,"f":[{"t":7,"e":"button","v":{"click":"reschedule"},"a":{"class":"small ui button orange"},"f":["Change/Reschedule"]}," ",{"t":7,"e":"button","v":{"click":"cancel"},"a":{"class":"small ui button red"},"f":["Cancel"]}],"n":50,"x":{"r":["upcoming","meta.user.email","mybookings.currentCartDetails.email"],"s":"_0==\"true\"&&_1==_2"}}," ",{"t":7,"e":"button","v":{"click":"back"},"a":{"class":"small ui button yellow"},"f":["Back"]}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"a","a":{"href":"#","class":"email"},"v":{"click":{"m":"toggleemail","a":{"r":[],"s":"[]"}}},"m":[{"t":4,"f":["disabled='disabled'"],"n":50,"x":{"r":["submitting"],"s":"!_0"}}],"f":["Email"]}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/asPDF/",{"t":2,"r":"mybookings.currentCartDetails.id"}],"target":"_blank","class":"pdf"},"f":["Ticket as PDF"]}," ",{"t":7,"e":"a","a":{"class":"ticket","href":["/b2c/airCart/mybookings/",{"t":2,"r":"mybookings.currentCartDetails.id"},"#print"],"target":"_blank"},"f":["Print E-Ticket"]}," ",{"t":7,"e":"div","a":{"class":"ui modal small"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Email Ticket"]}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"form","a":{"class":["ui form ",{"t":4,"f":["loading"],"n":50,"r":"./submitting"}],"action":"javascript:;"},"f":[{"t":7,"e":"input","a":{"class":"ui input small","type":"text","name":"email","id":"email","value":""}}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":7,"e":"button","v":{"click":{"m":"submit","a":{"r":[],"s":"[]"}}},"a":{"class":"ui small button"},"f":["Send"]}]}]}]}]}]}]}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}}," ",{"t":7,"e":"table","a":{"style":"width:95%"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"width:45%","colspan":"3"},"f":[{"t":3,"r":"ticketstatusmsg"}]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"style":"width:35%"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/dev/img/logo.png"}}]}]}," ",{"t":7,"e":"td","a":{"style":"width:35%"},"f":[{"t":7,"e":"span","a":{"style":"font-size: x-large;font-weight:bold;"},"f":["E-TICKET"]}]}," ",{"t":7,"e":"td","a":{"style":"width:30%"},"f":[{"t":7,"e":"table","a":{"style":" text-align: initial;float: right;"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"b","f":["CheapTicket.in : Customer Support"]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"b","f":["Email:"]}," ",{"t":7,"e":"a","a":{"href":"mailto:CS@CheapTicket.in"},"f":["CS@CheapTicket.in"]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"b","f":["Phone"]}," ",{"t":7,"e":"a","a":{"href":"tel:0120-4887777"},"f":["0120-4887777"]}]}]}]}]}]}],"n":50,"r":"mybookings.print"}]}," ",{"t":7,"e":"div","a":{"class":["group ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":7,"e":"div","a":{"class":"table title"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"to","style":"margin-top: 3px;"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"back","style":"margin-top: 3px;"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"source"},"  |  "],"i":"i","r":"bookings"}," ",{"t":2,"rx":{"r":"bookings","m":[{"r":["bookings.length"],"s":"_0-1"},"destination"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"r":"booking_statusmsg"}]}," ",{"t":7,"e":"br"}," "]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column ","style":"height: auto !important;"},"f":[{"t":7,"e":"div","a":{"class":"ui segment flight-itinerary compact dark"},"f":[{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":7,"e":"span","a":{"class":"city"},"f":[{"t":2,"r":"source"}," → ",{"t":2,"r":"destination"}]}," ",{"t":2,"x":{"r":["formatTravelDate2","departure"],"s":"_0(_1)"}}," ",{"t":7,"e":"span","a":{"class":"time"},"f":[{"t":2,"r":"flighttime"}]}]}," ",{"t":7,"e":"table","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"divider"},"f":[{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","a":{"class":"layover"},"f":["Layover: ",{"t":2,"x":{"r":["diff","k","j","bookings"],"s":"_0(_3[_2].routes[_1].departure,_3[_2].routes[_1-1].arrival)"}}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}]}],"n":50,"x":{"r":["k"],"s":"_0>0"}}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"carrier-logo"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":["/img/air_logos/",{"t":2,"r":"carrier"},".png"],"alt":[{"t":2,"r":"carrierName"}],"title":[{"t":2,"r":"carrierName"}]}}]}," ",{"t":7,"e":"td","a":{"class":"carrier-name"},"f":[{"t":2,"r":"carrierName"},{"t":7,"e":"br"},{"t":2,"r":"carrier"},"-",{"t":2,"r":"flightNumber"}]}," ",{"t":7,"e":"td","a":{"class":"from","style":"text-align: right;"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"origin"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"style":"text-align: right;","class":"airport"},"f":[{"t":2,"r":"originDetails"}]}]}," ",{"t":7,"e":"td","a":{"class":"flight"},"f":[" "]}," ",{"t":7,"e":"td","a":{"class":"to"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"destination"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"destinationDetails"}]}]}," ",{"t":7,"e":"td","a":{"class":"time-n-cabin"},"f":[{"t":7,"e":"div","f":[{"t":2,"r":"flighttime"},{"t":7,"e":"br"}," ",{"t":2,"rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller",{"r":[],"s":"0"},"cabin"]}}]}]}]}],"i":"k","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"routes"]}}]}]}]}," ",{"t":7,"e":"table","a":{"class":"passenger"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Passenger"]}," ",{"t":7,"e":"th","f":["CRS PNR"]}," ",{"t":7,"e":"th","f":["Air PNR"]}," ",{"t":7,"e":"th","f":["Ticket No."]}]}," ",{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":2,"r":"title"}," ",{"t":2,"r":"first_name"}," ",{"t":2,"r":"last_name"}," (",{"t":2,"r":"type"},") ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["travellerBookingStatus","status"],"s":"_0(_1)"}}]},"f":[{"t":2,"r":"statusmsg"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"b","f":[{"t":2,"r":"crs_pnr"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"b","f":[{"t":2,"r":"airline_pnr"}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"b","f":[{"t":2,"r":"ticket"}]}]}]}],"i":"t","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller"]}}]}]}],"i":"j","r":"bookings"}," ",{"t":7,"e":"div","a":{"class":"total"},"f":["TOTAL PRICE: ",{"t":7,"e":"span","f":[{"t":2,"r":"curency"}," ",{"t":2,"x":{"r":["convert","totalAmount"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"div","a":{"class":"taxes"},"f":["Basic Fare : ",{"t":2,"r":"baseprice"}," , Taxes : ",{"t":2,"r":"taxes"}," , Fee : ",{"t":2,"r":"fee"}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"style":"clear: both;"}}," ",{"t":7,"e":"table","a":{"class":"passenger"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","a":{"colspan":"2"},"f":["Terms and Conditions"]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":["All flight timings shown are local times."]}," ",{"t":7,"e":"li","f":["Use ",{"t":7,"e":"b","f":["Ref No."]}," for communication with us."]}," ",{"t":7,"e":"li","f":["Use ",{"t":7,"e":"b","f":["Airline PNR"]}," for contacting the Airlines."]}," ",{"t":7,"e":"li","f":["Carry a print-out of e-ticket for check-in."]}," ",{"t":7,"e":"li","f":["In case of no-show, tickets are non-refundable."]}," ",{"t":7,"e":"li","f":["Ensure your passport is valid for more than 6 months."]}," ",{"t":7,"e":"li","f":["Please check Transit & Destination Visa Requirement."]}," ",{"t":7,"e":"li","f":["For cancellation, airline charges & ser. fee apply."]}," ",{"t":7,"e":"li","f":["All payments are charged in INR. If any other currency has been chosen the price in that currency is only indicative."]}," ",{"t":7,"e":"li","f":["The INR price is the final price."]}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":["Carry a photo ID/ Passport for check-in."]}," ",{"t":7,"e":"li","f":["Meals, Seat & Special Requests are not guaranteed."]}," ",{"t":7,"e":"li","f":["Present Frequent Flier Card at check-in."]}," ",{"t":7,"e":"li","f":["Carriage is subject to Airlines Terms & Conditions."]}," ",{"t":7,"e":"li","f":["Ensure passenger names are correct, name change is not permitted."]}," ",{"t":7,"e":"li","f":["For any change Airline charges, difference of fare & ser. fee apply."]}," ",{"t":7,"e":"li","f":["You might be asked to provide card copy & ID proof of card holder."]}]}]}]}]}," ",{"t":7,"e":"div","a":{"style":"clear: both;"}}," ",{"t":7,"e":"div","a":{"class":""},"f":["Disclaimer: CheapTicket is not liable for any deficiency in service by Airline or Service providers."]}]}," ",{"t":4,"f":[],"n":50,"r":"mybookings.print"}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"script","a":{"type":"text/javascript"},"f":["window.ixiTransactionTracker = function(tag) {\r\nfunction updateRedirect(tag, transactionID, pnr, saleValue, segmentNights) {\r\nreturn \"<img style='top:-999999px;left:-999999px;position:absolute' src='https://www.ixigo.com/ixi-api/tracker/updateConversion/\" + tag + \"?transactionId=\" + transactionID + \"&pnr=\" + pnr + \"&saleValue=\" + saleValue + \"&segmentNights=\" + segmentNights + \"' />\";\r\n}\r\ndocument.body.innerHTML += updateRedirect(tag, \"",{"t":2,"r":"mybookings.currentCartDetails.id"},"\", \"",{"t":2,"r":"mybookings.currentCartDetails.bookings.0.traveller.0.airline_pnr"},"\", ",{"t":2,"x":{"r":["convertIxigo","mybookings.currentCartDetails.totalAmount"],"s":"_0(_1)"}},", ",{"t":2,"r":"mybookings.currentCartDetails.segNights"}," );\r\n};"]}," ",{"t":7,"e":"script","a":{"src":"https://www.ixigo.com/ixi-api/tracker/track196","id":"tracker"}}],"n":50,"x":{"r":["mybookings.clientSourceId"],"s":"_0==4"}}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}}]}],"r":"mybookings.currentCartDetails"}]};

/***/ },

/***/ 255:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlib29raW5ncy9tZXRhLmpzPzE0YzUqKiIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanM/ZjZiNSoiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanM/MGJiYSoiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215Ym9va2luZ3MvbXlib29raW5ncy5qcz9jZjQwKiIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzPzI3OWEqIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanM/YjY5MioqIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sPzRiYzMqKiIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL2d1ZXN0ZmlsdGVyLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvZ3Vlc3R0aWNrZXQvZ3Vlc3RmaWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0ZmlsdGVyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9ndWVzdHRpY2tldC9ndWVzdGJvb2tpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXlib29raW5ncy9kZXRhaWxzLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9teWJvb2tpbmdzL2RldGFpbHMuaHRtbCIsIndlYnBhY2s6Ly8vLi9sZXNzL3dlYi9tb2R1bGVzL2d1ZXN0ZmlsdGVyLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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QUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOEJBQTZCLE9BQU87QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzR0FBcUcsRUFBRTtBQUN2Rzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSCxHQUFFO0FBQ0Y7QUFDQTtBQUNBLGtEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7O0FDMVpEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsd0VB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LGdDQUFnQyxNQUFNLDRCQUE0QixrQ0FBa0Msa0NBQWtDLE1BQU0sbUVBQW1FLE1BQU0sdUVBQXVFLE1BQU0sNkVBQTZFLE1BQU0sNEVBQTRFLE1BQU0sMkVBQTJFLE1BQU0sNklBQTZJLE1BQU0seURBQXlELEVBQUUsRUFBRSxNQUFNLHFCQUFxQixxQkFBcUIsZ0VBQWdFLE1BQU0sMEVBQTBFLE1BQU0sZ0VBQWdFLE1BQU0sMkVBQTJFLE1BQU0seUZBQXlGLE1BQU0sNEZBQTRGLE1BQU0sMEZBQTBGLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLEdBQUcsTUFBTSxxQkFBcUIsV0FBVyw4R0FBOEcsRUFBRSxNQUFNLDJDQUEyQyxFQUFFLE1BQU0sWUFBWSxZQUFZLHdCQUF3Qix5QkFBeUIscURBQXFELGdGQUFnRix1Q0FBdUMsZUFBZSwrTkFBK04sS0FBSyx3REFBd0QsNkNBQTZDLFdBQVcsNkVBQTZFLFNBQVMsV0FBVywrRUFBK0UsT0FBTyxvREFBb0QsS0FBSyxNQUFNLEdBQUcsTUFBTSx3QkFBd0IsdUVBQXVFLGNBQWMsK0NBQStDLGNBQWMsb0NBQW9DLEVBQUUsc0NBQXNDLEc7Ozs7Ozs7QUNBenRYLDBDIiwiZmlsZSI6ImpzL2d1ZXN0ZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnY29yZS9zdG9yZScpXHJcbiAgICA7XHJcblxyXG52YXIgTWV0YSA9IFZpZXcuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZXM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5tYXAodmlldy5nZXQoJ3RpdGxlcycpLCBmdW5jdGlvbihpKSB7IHJldHVybiB7IGlkOiBpLmlkLCB0ZXh0OiBpLm5hbWUgfTsgfSk7IH0sXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuTWV0YS5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHJldHVybiBuZXcgTWV0YSh7ZGF0YTogZGF0YX0pO1xyXG59O1xyXG5cclxuTWV0YS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAkLmdldEpTT04oJy9iMmMvYWlyQ2FydC9tZXRhJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyByZXNvbHZlKE1ldGEucGFyc2UoZGF0YSkpOyB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxudmFyIGluc3RhbmNlID0gbnVsbDtcclxuTWV0YS5pbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlID0gTWV0YS5mZXRjaCgpO1xyXG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlib29raW5ncy9tZXRhLmpzXG4gKiogbW9kdWxlIGlkID0gNTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDMgNCA1XG4gKiovIiwiLy8gICAgIFZhbGlkYXRlLmpzIDAuNy4xXG5cbi8vICAgICAoYykgMjAxMy0yMDE1IE5pY2tsYXMgQW5zbWFuLCAyMDEzIFdyYXBwXG4vLyAgICAgVmFsaWRhdGUuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly92YWxpZGF0ZWpzLm9yZy9cblxuKGZ1bmN0aW9uKGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cy5cbiAgLy8gVGhlIG9wdGlvbnMgYXJlIHRoZSBmb2xsb3dpbmc6XG4gIC8vICAgLSBmb3JtYXQgKHN0cmluZykgLSBBbiBvcHRpb24gdGhhdCBjb250cm9scyBob3cgdGhlIHJldHVybmVkIHZhbHVlIGlzIGZvcm1hdHRlZFxuICAvLyAgICAgKiBmbGF0IC0gUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YganVzdCB0aGUgZXJyb3IgbWVzc2FnZXNcbiAgLy8gICAgICogZ3JvdXBlZCAtIFJldHVybnMgdGhlIG1lc3NhZ2VzIGdyb3VwZWQgYnkgYXR0cmlidXRlIChkZWZhdWx0KVxuICAvLyAgICAgKiBkZXRhaWxlZCAtIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJhdyB2YWxpZGF0aW9uIGRhdGFcbiAgLy8gICAtIGZ1bGxNZXNzYWdlcyAoYm9vbGVhbikgLSBJZiBgdHJ1ZWAgKGRlZmF1bHQpIHRoZSBhdHRyaWJ1dGUgbmFtZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGVycm9yLlxuICAvL1xuICAvLyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBvcHRpb25zIGFyZSBhbHNvIHBhc3NlZCB0byBlYWNoIHZhbGlkYXRvci5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpXG4gICAgICAsIGF0dHJcbiAgICAgICwgdmFsaWRhdG9yO1xuXG4gICAgZm9yIChhdHRyIGluIHJlc3VsdHMpIHtcbiAgICAgIGZvciAodmFsaWRhdG9yIGluIHJlc3VsdHNbYXR0cl0pIHtcbiAgICAgICAgaWYgKHYuaXNQcm9taXNlKHJlc3VsdHNbYXR0cl1bdmFsaWRhdG9yXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2UgdmFsaWRhdGUuYXN5bmMgaWYgeW91IHdhbnQgc3VwcG9ydCBmb3IgcHJvbWlzZXNcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRlLnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICB2YXIgdiA9IHZhbGlkYXRlO1xuXG4gIC8vIENvcGllcyBvdmVyIGF0dHJpYnV0ZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2VzIHRvIGEgc2luZ2xlIGRlc3RpbmF0aW9uLlxuICAvLyBWZXJ5IG11Y2ggc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgZXh0ZW5kLlxuICAvLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHRhcmdldCBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIHdpbGwgYmVcbiAgLy8gdXNlZCBhcyB0YXJnZXRzLlxuICB2LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgYXR0ciBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW2F0dHJdID0gc291cmNlW2F0dHJdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgdi5leHRlbmQodmFsaWRhdGUsIHtcbiAgICAvLyBUaGlzIGlzIHRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IGFzIGEgc2VtdmVyLlxuICAgIC8vIFRoZSB0b1N0cmluZyBmdW5jdGlvbiB3aWxsIGFsbG93IGl0IHRvIGJlIGNvZXJjZWQgaW50byBhIHN0cmluZ1xuICAgIHZlcnNpb246IHtcbiAgICAgIG1ham9yOiAwLFxuICAgICAgbWlub3I6IDcsXG4gICAgICBwYXRjaDogMSxcbiAgICAgIG1ldGFkYXRhOiBudWxsLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHYuZm9ybWF0KFwiJXttYWpvcn0uJXttaW5vcn0uJXtwYXRjaH1cIiwgdi52ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2LmlzRW1wdHkodi52ZXJzaW9uLm1ldGFkYXRhKSkge1xuICAgICAgICAgIHZlcnNpb24gKz0gXCIrXCIgKyB2LnZlcnNpb24ubWV0YWRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEJlbG93IGlzIHRoZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgdXNlZCBpbiB2YWxpZGF0ZS5qc1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIElmIHlvdSBhcmUgdXNpbmcgUS5qcywgUlNWUCBvciBhbnkgb3RoZXIgQSsgY29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIG92ZXJyaWRlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGF0IHByb21pc2UuXG4gICAgLy8gU2luY2UgalF1ZXJ5IHByb21pc2VzIGFyZW4ndCBBKyBjb21wYXRpYmxlIHRoZXkgd29uJ3Qgd29yay5cbiAgICBQcm9taXNlOiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFByb21pc2UgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgLy8gSWYgbW9tZW50IGlzIHVzZWQgaW4gbm9kZSwgYnJvd3NlcmlmeSBldGMgcGxlYXNlIHNldCB0aGlzIGF0dHJpYnV0ZVxuICAgIC8vIGxpa2UgdGhpczogYHZhbGlkYXRlLm1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG4gICAgbW9tZW50OiB0eXBlb2YgbW9tZW50ICE9PSBcInVuZGVmaW5lZFwiID8gbW9tZW50IDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIFhEYXRlOiB0eXBlb2YgWERhdGUgIT09IFwidW5kZWZpbmVkXCIgPyBYRGF0ZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBFTVBUWV9TVFJJTkdfUkVHRVhQOiAvXlxccyokLyxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cyBvYmplY3QuXG4gICAgLy8gV2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIGZvcm1hdDpcbiAgICAvLyAgICAgW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZSBuYW1lPlwiLCBlcnJvcjogXCI8dmFsaWRhdGlvbiByZXN1bHQ+XCJ9LCAuLi5dXG4gICAgcnVuVmFsaWRhdGlvbnM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgICwgYXR0clxuICAgICAgICAsIHZhbGlkYXRvck5hbWVcbiAgICAgICAgLCB2YWx1ZVxuICAgICAgICAsIHZhbGlkYXRvcnNcbiAgICAgICAgLCB2YWxpZGF0b3JcbiAgICAgICAgLCB2YWxpZGF0b3JPcHRpb25zXG4gICAgICAgICwgZXJyb3I7XG5cbiAgICAgIGlmICh2LmlzRG9tRWxlbWVudChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jb2xsZWN0Rm9ybVZhbHVlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcHMgdGhyb3VnaCBlYWNoIGNvbnN0cmFpbnRzLCBmaW5kcyB0aGUgY29ycmVjdCB2YWxpZGF0b3IgYW5kIHJ1biBpdC5cbiAgICAgIGZvciAoYXR0ciBpbiBjb25zdHJhaW50cykge1xuICAgICAgICB2YWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIGF0dHIpO1xuICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludHMgZm9yIGFuIGF0dHJpYnV0ZSB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgdmFsaWRhdG9ycyA9IHYucmVzdWx0KGNvbnN0cmFpbnRzW2F0dHJdLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuXG4gICAgICAgIGZvciAodmFsaWRhdG9yTmFtZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgdmFsaWRhdG9yID0gdi52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gdi5mb3JtYXQoXCJVbmtub3duIHZhbGlkYXRvciAle25hbWV9XCIsIHtuYW1lOiB2YWxpZGF0b3JOYW1lfSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBvcHRpb25zIHRvIGJlIGEgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlXG4gICAgICAgICAgLy8gY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHYucmVzdWx0KHZhbGlkYXRvck9wdGlvbnMsIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3JPcHRpb25zKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvcjogdmFsaWRhdG9yLmNhbGwodmFsaWRhdG9yLCB2YWx1ZSwgdmFsaWRhdG9yT3B0aW9ucywgYXR0cixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG5cbiAgICAvLyBUYWtlcyB0aGUgb3V0cHV0IGZyb20gcnVuVmFsaWRhdGlvbnMgYW5kIGNvbnZlcnRzIGl0IHRvIHRoZSBjb3JyZWN0XG4gICAgLy8gb3V0cHV0IGZvcm1hdC5cbiAgICBwcm9jZXNzVmFsaWRhdGlvblJlc3VsdHM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIGVycm9ycyA9IHYucHJ1bmVFbXB0eUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5leHBhbmRNdWx0aXBsZUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5jb252ZXJ0RXJyb3JNZXNzYWdlcyhlcnJvcnMsIG9wdGlvbnMpO1xuXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMuZm9ybWF0IHx8IFwiZ3JvdXBlZFwiKSB7XG4gICAgICAgIGNhc2UgXCJkZXRhaWxlZFwiOlxuICAgICAgICAgIC8vIERvIG5vdGhpbmcgbW9yZSB0byB0aGUgZXJyb3JzXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImZsYXRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9ycyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdyb3VwZWRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNbYXR0cl0gPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9yc1thdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHYuZm9ybWF0KFwiVW5rbm93biBmb3JtYXQgJXtmb3JtYXR9XCIsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuaXNFbXB0eShlcnJvcnMpID8gdW5kZWZpbmVkIDogZXJyb3JzO1xuICAgIH0sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0aW9ucyB3aXRoIHN1cHBvcnQgZm9yIHByb21pc2VzLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCB3aGVuIGFsbCB0aGVcbiAgICAvLyB2YWxpZGF0aW9uIHByb21pc2VzIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gICAgLy8gSXQgY2FuIGJlIGNhbGxlZCBldmVuIGlmIG5vIHZhbGlkYXRpb25zIHJldHVybmVkIGEgcHJvbWlzZS5cbiAgICBhc3luYzogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5hc3luYy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2LndhaXRGb3JSZXN1bHRzKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVycm9ycyA9IHYucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpbmdsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuc2luZ2xlLm9wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgZm9ybWF0OiBcImZsYXRcIixcbiAgICAgICAgZnVsbE1lc3NhZ2VzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdih7c2luZ2xlOiB2YWx1ZX0sIHtzaW5nbGU6IGNvbnN0cmFpbnRzfSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgcHJvbWlzZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcbiAgICAvLyBhcmUgc2V0dGxlZC4gVGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzIGFsd2F5cyByZXNvbHZlZCxcbiAgICAvLyBuZXZlciByZWplY3RlZC5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBpbnB1dCBhcmd1bWVudCwgaXQgcmVwbGFjZXMgdGhlIHByb21pc2VzXG4gICAgLy8gd2l0aCB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgcHJvbWlzZS5cbiAgICB3YWl0Rm9yUmVzdWx0czogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgLy8gQ3JlYXRlIGEgc2VxdWVuY2Ugb2YgYWxsIHRoZSByZXN1bHRzIHN0YXJ0aW5nIHdpdGggYSByZXNvbHZlZCBwcm9taXNlLlxuICAgICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHJlc3VsdCkge1xuICAgICAgICAvLyBJZiB0aGlzIHJlc3VsdCBpc24ndCBhIHByb21pc2Ugc2tpcCBpdCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIGlmICghdi5pc1Byb21pc2UocmVzdWx0LmVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lbW8udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmVycm9yLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAvLyBJZiBmb3Igc29tZSByZWFzb24gdGhlIHZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgbm9cbiAgICAgICAgICAgICAgLy8gZXJyb3Igd2FzIHNwZWNpZmllZC5cbiAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHYud2FybihcIlZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgZGlkbid0IHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcigpOyB9KSk7IC8vIEEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIH0sXG5cbiAgICAvLyBJZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBjYWxsOiBmdW5jdGlvbiB0aGUgYW5kOiBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlXG4gICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZS4gQWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXNcbiAgICAvLyBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmVzdWx0KCdmb28nKSAvLyAnZm9vJ1xuICAgIC8vIHJlc3VsdChNYXRoLm1heCwgMSwgMikgLy8gMlxuICAgIC8vIGBgYFxuICAgIHJlc3VsdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLiBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IGNvbnNpZGVyIE5hTiBhXG4gICAgLy8gbnVtYmVyIGxpa2UgbWFueSBvdGhlciBgaXNOdW1iZXJgIGZ1bmN0aW9ucyBkby5cbiAgICBpc051bWJlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBub3QgYSBmdW5jdGlvblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0sXG5cbiAgICAvLyBBIHNpbXBsZSBjaGVjayB0byB2ZXJpZnkgdGhhdCB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlci4gVXNlcyBgaXNOdW1iZXJgXG4gICAgLy8gYW5kIGEgc2ltcGxlIG1vZHVsbyBjaGVjay5cbiAgICBpc0ludGVnZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgJSAxID09PSAwO1xuICAgIH0sXG5cbiAgICAvLyBVc2VzIHRoZSBgT2JqZWN0YCBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYW4gb2JqZWN0LlxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICAgIH0sXG5cbiAgICAvLyBTaW1wbHkgY2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBkYXRlXG4gICAgaXNEYXRlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgYG51bGxgIG9mIGB1bmRlZmluZWRgXG4gICAgaXNEZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBwcm9taXNlLiBBbnl0aGluZyB3aXRoIGEgYHRoZW5gXG4gICAgLy8gZnVuY3Rpb24gaXMgY29uc2lkZXJlZCBhIHByb21pc2UuXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gISFwICYmIHYuaXNGdW5jdGlvbihwLnRoZW4pO1xuICAgIH0sXG5cbiAgICBpc0RvbUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvckFsbCkgfHwgIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3QoZG9jdW1lbnQpICYmIG8gPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvNjk5MzA0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG8gJiZcbiAgICAgICAgICB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgICBvLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgLy8gTnVsbCBhbmQgdW5kZWZpbmVkIGFyZSBlbXB0eVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaXRlc3BhY2Ugb25seSBzdHJpbmdzIGFyZSBlbXB0eVxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2LkVNUFRZX1NUUklOR19SRUdFWFAudGVzdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBhcnJheXMgd2UgdXNlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgIGlmICh2LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIGhhdmUgbm8gYXR0cmlidXRlcyBidXQgYXJlbid0IGVtcHR5XG4gICAgICBpZiAodi5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgZmluZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkgd2UgY29uc2lkZXIgaXQgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEZvcm1hdHMgdGhlIHNwZWNpZmllZCBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHZhbHVlcyBsaWtlIHNvOlxuICAgIC8vIGBgYFxuICAgIC8vIGZvcm1hdChcIkZvbzogJXtmb299XCIsIHtmb286IFwiYmFyXCJ9KSAvLyBcIkZvbyBiYXJcIlxuICAgIC8vIGBgYFxuICAgIC8vIElmIHlvdSB3YW50IHRvIHdyaXRlICV7Li4ufSB3aXRob3V0IGhhdmluZyBpdCByZXBsYWNlZCBzaW1wbHlcbiAgICAvLyBwcmVmaXggaXQgd2l0aCAlIGxpa2UgdGhpcyBgRm9vOiAlJXtmb299YCBhbmQgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIGFzIGBcIkZvbzogJXtmb299XCJgXG4gICAgZm9ybWF0OiB2LmV4dGVuZChmdW5jdGlvbihzdHIsIHZhbHMpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSh2LmZvcm1hdC5GT1JNQVRfUkVHRVhQLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgIGlmIChtMSA9PT0gJyUnKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJXtcIiArIG0yICsgXCJ9XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWxzW20yXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgIC8vIEZpbmRzICV7a2V5fSBzdHlsZSBwYXR0ZXJucyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICBGT1JNQVRfUkVHRVhQOiAvKCU/KSVcXHsoW15cXH1dKylcXH0vZ1xuICAgIH0pLFxuXG4gICAgLy8gXCJQcmV0dGlmaWVzXCIgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAvLyBQcmV0dGlmeWluZyBtZWFucyByZXBsYWNpbmcgWy5cXF8tXSB3aXRoIHNwYWNlcyBhcyB3ZWxsIGFzIHNwbGl0dGluZ1xuICAgIC8vIGNhbWVsIGNhc2Ugd29yZHMuXG4gICAgcHJldHRpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHYuaXNOdW1iZXIoc3RyKSkge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDIgZGVjaW1hbHMgcm91bmQgaXQgdG8gdHdvXG4gICAgICAgIGlmICgoc3RyICogMTAwKSAlIDEgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHN0ciAqIDEwMCkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNBcnJheShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHYucHJldHRpZnkocyk7IH0pLmpvaW4oXCIsIFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgc3RyaW5nIGlzIGFjdHVhbGx5IGEgc3RyaW5nXG4gICAgICBzdHIgPSBcIlwiICsgc3RyO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC8vIFNwbGl0cyBrZXlzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXHNdKVxcLihbXlxcc10pL2csICckMSAkMicpXG4gICAgICAgIC8vIFJlbW92ZXMgYmFja3NsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwrL2csICcnKVxuICAgICAgICAvLyBSZXBsYWNlcyAtIGFuZCAtIHdpdGggc3BhY2VcbiAgICAgICAgLnJlcGxhY2UoL1tfLV0vZywgJyAnKVxuICAgICAgICAvLyBTcGxpdHMgY2FtZWwgY2FzZWQgd29yZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIG0xICsgXCIgXCIgKyBtMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgc3RyaW5naWZ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5wcmV0dGlmeSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIGluIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0RGVlcE9iamVjdFZhbHVlOiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIGlmICghdi5pc09iamVjdChvYmopIHx8ICF2LmlzU3RyaW5nKGtleXBhdGgpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiXG4gICAgICAgICwgaVxuICAgICAgICAsIGVzY2FwZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cGF0aC5sZW5ndGg7ICsraSkge1xuICAgICAgICBzd2l0Y2ggKGtleXBhdGhbaV0pIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnLic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgICAgICAgICAgIGtleSA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnXFxcXCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cGF0aFtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzRGVmaW5lZChvYmopICYmIGtleSBpbiBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVGhpcyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtLlxuICAgIC8vIEl0IHVzZXMgdGhlIGlucHV0IG5hbWUgYXMga2V5IGFuZCB0aGUgdmFsdWUgYXMgdmFsdWVcbiAgICAvLyBTbyBmb3IgZXhhbXBsZSB0aGlzOlxuICAgIC8vIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiZm9vQGJhci5jb21cIiAvPlxuICAgIC8vIHdvdWxkIHJldHVybjpcbiAgICAvLyB7ZW1haWw6IFwiZm9vQGJhci5jb21cIn1cbiAgICBjb2xsZWN0Rm9ybVZhbHVlczogZnVuY3Rpb24oZm9ybSwgb3B0aW9ucykge1xuICAgICAgdmFyIHZhbHVlcyA9IHt9XG4gICAgICAgICwgaVxuICAgICAgICAsIGlucHV0XG4gICAgICAgICwgaW5wdXRzXG4gICAgICAgICwgdmFsdWU7XG5cbiAgICAgIGlmICghZm9ybSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF0dHJpYnV0ZXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0udmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LFxuXG4gICAgc2FuaXRpemVGb3JtVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmltICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5udWxsaWZ5ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgYWxsIGVycm9ycyB3aG8ncyBlcnJvciBhdHRyaWJ1dGUgaXMgZW1wdHkgKG51bGwgb3IgdW5kZWZpbmVkKVxuICAgIHBydW5lRW1wdHlFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICF2LmlzRW1wdHkoZXJyb3IuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIEluXG4gICAgLy8gW3tlcnJvcjogW1wiZXJyMVwiLCBcImVycjJcIl0sIC4uLn1dXG4gICAgLy8gT3V0XG4gICAgLy8gW3tlcnJvcjogXCJlcnIxXCIsIC4uLn0sIHtlcnJvcjogXCJlcnIyXCIsIC4uLn1dXG4gICAgLy9cbiAgICAvLyBBbGwgYXR0cmlidXRlcyBpbiBhbiBlcnJvciB3aXRoIG11bHRpcGxlIG1lc3NhZ2VzIGFyZSBkdXBsaWNhdGVkXG4gICAgLy8gd2hlbiBleHBhbmRpbmcgdGhlIGVycm9ycy5cbiAgICBleHBhbmRNdWx0aXBsZUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBSZW1vdmVzIGVycm9ycyB3aXRob3V0IGEgbWVzc2FnZVxuICAgICAgICBpZiAodi5pc0FycmF5KGVycm9yLmVycm9yKSkge1xuICAgICAgICAgIGVycm9yLmVycm9yLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3IsIHtlcnJvcjogbXNnfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0cyB0aGUgZXJyb3IgbWVzYWdlcyBieSBwcmVwZW5kaW5nIHRoZSBhdHRyaWJ1dGUgbmFtZSB1bmxlc3MgdGhlXG4gICAgLy8gbWVzc2FnZSBpcyBwcmVmaXhlZCBieSBeXG4gICAgY29udmVydEVycm9yTWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9ySW5mbykge1xuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckluZm8uZXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yWzBdID09PSAnXicpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yLnNsaWNlKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZnVsbE1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVycm9yID0gdi5jYXBpdGFsaXplKHYucHJldHRpZnkoZXJyb3JJbmZvLmF0dHJpYnV0ZSkpICsgXCIgXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IGVycm9yLnJlcGxhY2UoL1xcXFxcXF4vZywgXCJeXCIpO1xuICAgICAgICBlcnJvciA9IHYuZm9ybWF0KGVycm9yLCB7dmFsdWU6IHYuc3RyaW5naWZ5VmFsdWUoZXJyb3JJbmZvLnZhbHVlKX0pO1xuICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3JJbmZvLCB7ZXJyb3I6IGVycm9yfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8ge1wiPGF0dHJpYnV0ZU5hbWU+XCI6IFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XX1cbiAgICBncm91cEVycm9yc0J5QXR0cmlidXRlOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBsaXN0ID0gcmV0W2Vycm9yLmF0dHJpYnV0ZV07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgbGlzdC5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXRbZXJyb3IuYXR0cmlidXRlXSA9IFtlcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3tlcnJvcjogXCI8bWVzc2FnZSAxPlwiLCAuLi59LCB7ZXJyb3I6IFwiPG1lc3NhZ2UgMj5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8gW1wiPG1lc3NhZ2UgMT5cIiwgXCI8bWVzc2FnZSAyPlwiXVxuICAgIGZsYXR0ZW5FcnJvcnNUb0FycmF5OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKSB7IHJldHVybiBlcnJvci5lcnJvcjsgfSk7XG4gICAgfSxcblxuICAgIGV4cG9zZU1vZHVsZTogZnVuY3Rpb24odmFsaWRhdGUsIHJvb3QsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgICBpZiAodmFsaWRhdGUuaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXJuOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7XG4gICAgLy8gUHJlc2VuY2UgdmFsaWRhdGVzIHRoYXQgdGhlIHZhbHVlIGlzbid0IGVtcHR5XG4gICAgcHJlc2VuY2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImNhbid0IGJlIGJsYW5rXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpcyA9IG9wdGlvbnMuaXNcbiAgICAgICAgLCBtYXhpbXVtID0gb3B0aW9ucy5tYXhpbXVtXG4gICAgICAgICwgbWluaW11bSA9IG9wdGlvbnMubWluaW11bVxuICAgICAgICAsIHRva2VuaXplciA9IG9wdGlvbnMudG9rZW5pemVyIHx8IGZ1bmN0aW9uKHZhbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICwgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW107XG5cbiAgICAgIHZhbHVlID0gdG9rZW5pemVyKHZhbHVlKTtcbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICBpZighdi5pc051bWJlcihsZW5ndGgpKSB7XG4gICAgICAgIHYuZXJyb3Iodi5mb3JtYXQoXCJBdHRyaWJ1dGUgJXthdHRyfSBoYXMgYSBub24gbnVtZXJpYyB2YWx1ZSBmb3IgYGxlbmd0aGBcIiwge2F0dHI6IGF0dHJpYnV0ZX0pKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaGFzIGFuIGluY29ycmVjdCBsZW5ndGhcIjtcbiAgICAgIH1cblxuICAgICAgLy8gSXMgY2hlY2tzXG4gICAgICBpZiAodi5pc051bWJlcihpcykgJiYgbGVuZ3RoICE9PSBpcykge1xuICAgICAgICBlcnIgPSBvcHRpb25zLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIFwiaXMgdGhlIHdyb25nIGxlbmd0aCAoc2hvdWxkIGJlICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBpc30pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWluaW11bSkgJiYgbGVuZ3RoIDwgbWluaW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb1Nob3J0IHx8XG4gICAgICAgICAgdGhpcy50b29TaG9ydCB8fFxuICAgICAgICAgIFwiaXMgdG9vIHNob3J0IChtaW5pbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtaW5pbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtYXhpbXVtKSAmJiBsZW5ndGggPiBtYXhpbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTG9uZyB8fFxuICAgICAgICAgIHRoaXMudG9vTG9uZyB8fFxuICAgICAgICAgIFwiaXMgdG9vIGxvbmcgKG1heGltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1heGltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bWVyaWNhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgICAsIG5hbWVcbiAgICAgICAgLCBjb3VudFxuICAgICAgICAsIGNoZWNrcyA9IHtcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuOiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID4gYzsgfSxcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID49IGM7IH0sXG4gICAgICAgICAgICBlcXVhbFRvOiAgICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA9PT0gYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuOiAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDwgYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDw9IGM7IH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBDb2VyY2UgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIHVubGVzcyB3ZSdyZSBiZWluZyBzdHJpY3QuXG4gICAgICBpZiAob3B0aW9ucy5ub1N0cmluZ3MgIT09IHRydWUgJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIHdlIHNob3VsZG4ndCBjb250aW51ZSBzaW5jZSBpdCB3aWxsIGNvbXBhcmUgaXQuXG4gICAgICBpZiAoIXYuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImlzIG5vdCBhIG51bWJlclwiO1xuICAgICAgfVxuXG4gICAgICAvLyBTYW1lIGxvZ2ljIGFzIGFib3ZlLCBzb3J0IG9mLiBEb24ndCBib3RoZXIgd2l0aCBjb21wYXJpc29ucyBpZiB0aGlzXG4gICAgICAvLyBkb2Vzbid0IHBhc3MuXG4gICAgICBpZiAob3B0aW9ucy5vbmx5SW50ZWdlciAmJiAhdi5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RJbnRlZ2VyICB8fCBcIm11c3QgYmUgYW4gaW50ZWdlclwiO1xuICAgICAgfVxuXG4gICAgICBmb3IgKG5hbWUgaW4gY2hlY2tzKSB7XG4gICAgICAgIGNvdW50ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgaWYgKHYuaXNOdW1iZXIoY291bnQpICYmICFjaGVja3NbbmFtZV0odmFsdWUsIGNvdW50KSkge1xuICAgICAgICAgIC8vIFRoaXMgcGlja3MgdGhlIGRlZmF1bHQgbWVzc2FnZSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZSB0aGUgZ3JlYXRlclRoYW4gY2hlY2sgdXNlcyB0aGUgbWVzc2FnZSBmcm9tXG4gICAgICAgICAgLy8gdGhpcy5ub3RHcmVhdGVyVGhhbiBzbyB3ZSBjYXBpdGFsaXplIHRoZSBuYW1lIGFuZCBwcmVwZW5kIFwibm90XCJcbiAgICAgICAgICB2YXIgbXNnID0gdGhpc1tcIm5vdFwiICsgdi5jYXBpdGFsaXplKG5hbWUpXSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlICV7dHlwZX0gJXtjb3VudH1cIjtcblxuICAgICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KG1zZywge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgdHlwZTogdi5wcmV0dGlmeShuYW1lKVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5vZGQgJiYgdmFsdWUgJSAyICE9PSAxKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90T2RkIHx8IFwibXVzdCBiZSBvZGRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5ldmVuICYmIHZhbHVlICUgMiAhPT0gMCkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdEV2ZW4gfHwgXCJtdXN0IGJlIGV2ZW5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZXRpbWU6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW11cbiAgICAgICAgLCBlYXJsaWVzdCA9IG9wdGlvbnMuZWFybGllc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMuZWFybGllc3QsIG9wdGlvbnMpIDogTmFOXG4gICAgICAgICwgbGF0ZXN0ID0gb3B0aW9ucy5sYXRlc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMubGF0ZXN0LCBvcHRpb25zKSA6IE5hTjtcblxuICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlKHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgLy8gODY0MDAwMDAgaXMgdGhlIG51bWJlciBvZiBzZWNvbmRzIGluIGEgZGF5LCB0aGlzIGlzIHVzZWQgdG8gcmVtb3ZlXG4gICAgICAvLyB0aGUgdGltZSBmcm9tIHRoZSBkYXRlXG4gICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IG9wdGlvbnMuZGF0ZU9ubHkgJiYgdmFsdWUgJSA4NjQwMDAwMCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJtdXN0IGJlIGEgdmFsaWQgZGF0ZVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGVhcmxpZXN0KSAmJiB2YWx1ZSA8IGVhcmxpZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vRWFybHkgfHwgXCJtdXN0IGJlIG5vIGVhcmxpZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGVhcmxpZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGxhdGVzdCkgJiYgdmFsdWUgPiBsYXRlc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29MYXRlIHx8IFwibXVzdCBiZSBubyBsYXRlciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQobGF0ZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb252ZXJ0IGlucHV0IHRvIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIG1pbGxpcyBzaW5jZSB0aGUgZXBvY2guXG4gICAgICAvLyBJdCBzaG91bGQgcmV0dXJuIE5hTiBpZiBpdCdzIG5vdCBhIHZhbGlkIGRhdGUuXG4gICAgICBwYXJzZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgdi5YRGF0ZSh2YWx1ZSwgdHJ1ZSkuZ2V0VGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIHJldHVybiArdi5tb21lbnQudXRjKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH0sXG4gICAgICAvLyBGb3JtYXRzIHRoZSBnaXZlbiB0aW1lc3RhbXAuIFVzZXMgSVNPODYwMSB0byBmb3JtYXQgdGhlbS5cbiAgICAgIC8vIElmIG9wdGlvbnMuZGF0ZU9ubHkgaXMgdHJ1ZSB0aGVuIG9ubHkgdGhlIHllYXIsIG1vbnRoIGFuZCBkYXkgd2lsbCBiZVxuICAgICAgLy8gb3V0cHV0LlxuICAgICAgZm9ybWF0OiBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSBvcHRpb25zLmRhdGVGb3JtYXQ7XG5cbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwieXl5eS1NTS1kZFwiIDogXCJ5eXl5LU1NLWRkIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiBuZXcgWERhdGUoZGF0ZSwgdHJ1ZSkudG9TdHJpbmcoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcIllZWVktTU0tRERcIiA6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gdi5tb21lbnQudXRjKGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH0pLFxuICAgIGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIG9wdGlvbnMsIHtkYXRlT25seTogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHYudmFsaWRhdG9ycy5kYXRldGltZS5jYWxsKHYudmFsaWRhdG9ycy5kYXRldGltZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykgfHwgKG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7cGF0dGVybjogb3B0aW9uc307XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgaW52YWxpZFwiXG4gICAgICAgICwgcGF0dGVybiA9IG9wdGlvbnMucGF0dGVyblxuICAgICAgICAsIG1hdGNoO1xuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdGlvbnMucGF0dGVybiwgb3B0aW9ucy5mbGFncyk7XG4gICAgICB9XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyh2YWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoIHx8IG1hdGNoWzBdLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbmNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJeJXt2YWx1ZX0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0XCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZXhjbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICghdi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcIl4le3ZhbHVlfSBpcyByZXN0cmljdGVkXCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZW1haWw6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCBlbWFpbFwiO1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLlBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgUEFUVEVSTjogL15bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16XXsyLH0kL2lcbiAgICB9KSxcbiAgICBlcXVhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge2F0dHJpYnV0ZTogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJpcyBub3QgZXF1YWwgdG8gJXthdHRyaWJ1dGV9XCI7XG5cbiAgICAgIGlmICh2LmlzRW1wdHkob3B0aW9ucy5hdHRyaWJ1dGUpIHx8ICF2LmlzU3RyaW5nKG9wdGlvbnMuYXR0cmlidXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXR0cmlidXRlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3RoZXJWYWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlKVxuICAgICAgICAsIGNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3IgfHwgZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgICAgcmV0dXJuIHYxID09PSB2MjtcbiAgICAgICAgfTtcblxuICAgICAgaWYgKCFjb21wYXJhdG9yKHZhbHVlLCBvdGhlclZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7YXR0cmlidXRlOiB2LnByZXR0aWZ5KG9wdGlvbnMuYXR0cmlidXRlKX0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5leHBvc2VNb2R1bGUodmFsaWRhdGUsIHRoaXMsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKTtcbn0pLmNhbGwodGhpcyxcbiAgICAgICAgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZXhwb3J0cyA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbW9kdWxlIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBkZWZpbmUgOiBudWxsKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSA2MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgNCA1IDYgN1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcImRlZmluZSBjYW5ub3QgYmUgdXNlZCBpbmRpcmVjdFwiKTsgfTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvYnVpbGRpbi9hbWQtZGVmaW5lLmpzXG4gKiogbW9kdWxlIGlkID0gNjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA2IDdcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAgICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxyXG5cclxuICAgICAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJyk7XHJcblxyXG52YXIgTXlib29raW5nRGF0YSA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIHByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlZnJlc2hDdXJyZW50Q2FydDogZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hDdXJyZW50Q2FydFwiKTtcclxuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Q2FydERldGFpbHMvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ2N1cnJlbnRDYXJ0SWQnKSksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHVwY29taW5nOiBkYXRhLnVwY29taW5nLCBjcmVhdGVkOiBkYXRhLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBkYXRhLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogZGF0YS5ib29raW5nX3N0YXR1cyxib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjdXJyZW50Q2FydERldGFpbHMnLCBkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleCh2aWV3LmdldCgnY2FydHMnKSwgeydpZCc6IGRldGFpbHMuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXg6ICcraW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FydHMgPSB2aWV3LmdldCgnY2FydHMnKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJ0c1tpbmRleF0uYm9va2luZ19zdGF0dXMgPSBkZXRhaWxzLmJvb2tpbmdfc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjYXJ0cycsIGNhcnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluc2loZWQgc3RvcmU6ICcpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbk15Ym9va2luZ0RhdGEuZ2V0Q3VycmVudENhcnQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgLy8gY29uc29sZS5sb2coXCJnZXRDdXJyZW50Q2FydFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9nZXRDYXJ0RGV0YWlscy8nICsgXy5wYXJzZUludChpZCksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkb25lXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHRpY2tldHN0YXR1c21zZzpkYXRhLnRpY2tldHN0YXR1c21zZyx1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsY2xpZW50U291cmNlSWQ6ZGF0YS5jbGllbnRTb3VyY2VJZCxzZWdOaWdodHM6ZGF0YS5zZWdOaWdodHMsXHJcbiAgICAgICAgICAgIGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LCBjdXJlbmN5OiBkYXRhLmN1cmVuY3ksZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLFxyXG4gICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgb3JpZ2luOiB0Lm9yaWdpbiwgb3JpZ2luRGV0YWlsczogdC5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSksIH07XHJcbiAgICAgICAgZGF0YS5jdXJyZW50Q2FydERldGFpbHM9IGRldGFpbHM7XHJcbiAgICAgICAgZGF0YS5jYXJ0cz1bXTtcclxuICAgICAgICBkYXRhLmNhcnRzLnB1c2goZGV0YWlscyk7XHJcbiAgICAgICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gZGV0YWlscy5pZDtcclxuIC8vICAgY29uc29sZS5sb2coZGF0YS5jdXJyZW50Q2FydERldGFpbHMpO1xyXG4gICAgZGF0YS5zdW1tYXJ5ID0gZmFsc2U7XHJcbiAgICBkYXRhLnByaW50ID0gZmFsc2U7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSBmYWxzZTtcclxuICAgIGRhdGEuYW1lbmQgPSBmYWxzZTtcclxuICAgIGRhdGEuY2FuY2VsID0gZmFsc2U7XHJcbiAgICBkYXRhLnJlc2NoZWR1bGUgPSBmYWxzZTtcclxuICAgXHJcbiAgICBkYXRhLmVycm9ycyA9IHt9O1xyXG4gICAgZGF0YS5yZXN1bHRzID0gW107XHJcblxyXG4gICAgZGF0YS5maWx0ZXIgPSB7fTtcclxuICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuICAgIHJldHVybiByZXNvbHZlKG5ldyBNeWJvb2tpbmdEYXRhKHtkYXRhOiBkYXRhfSkpO1xyXG5cclxuICAgICAgICBcclxuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH0pXHJcbiAgICB9KTtcclxufTtcclxuXHJcbk15Ym9va2luZ0RhdGEucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIk15Ym9va2luZ0RhdGEucGFyc2VcIik7XHJcbiAgICAvL2RhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gRmxpZ2h0LnBhcnNlKGkpOyB9KTtcclxuICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7ICAgXHJcbiAgICB2YXIgZmxnVXBjb21pbmcgPSBmYWxzZTtcclxuICAgIHZhciBmbGdQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYXJ0cyA9IF8ubWFwKGRhdGEsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgaWYgKGkudXBjb21pbmcgPT0gJ3RydWUnKVxyXG4gICAgICAgICAgICBmbGdVcGNvbWluZyA9IHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmbGdQcmV2aW91cyA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHtpZDogaS5pZCxlbWFpbDppLmVtYWlsLCBjcmVhdGVkOiBpLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBpLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogaS5ib29raW5nX3N0YXR1cyxcclxuICAgICAgICAgICAgcmV0dXJuZGF0ZTogaS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogaS5pc011bHRpQ2l0eSwgY3VyZW5jeTogaS5jdXJlbmN5LCB1cGNvbWluZzogaS51cGNvbWluZyxcclxuICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGkuYm9va2luZ3MsIGZ1bmN0aW9uIChiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogYi5pZCwgc291cmNlOiBiLnNvdXJjZSwgZGVzdGluYXRpb246IGIuZGVzdGluYXRpb24sIHNvdXJjZV9pZDogYi5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBiLmRlc3RpbmF0aW9uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZTogYi5kZXBhcnR1cmUsIGFycml2YWw6IGIuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxlcnM6IF8ubWFwKGIudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiB0LmlkLCBuYW1lOiB0Lm5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0cmF2ZWxlcjogXy5tYXAoaS50cmF2ZWxsZXJkdGwsIGZ1bmN0aW9uIChqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBqLmlkLCBuYW1lOiBqLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBfLm1hcChqLnNyYywgZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBnfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBfLm1hcChqLmRlc3QsIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZTogZ307XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLmNhcnRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICBpZiAoeC5pZCA8IHkuaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG5cclxuICAgIH0pO1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmNhcnRzKTsgIFxyXG4gICAgLy8gICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVyPSBfLmZpcnN0KGRhdGEudHJhdmVsbGVycyk7XHJcbiAgICAvLyAgICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVySWQ9ZGF0YS5jdXJyZW50VHJhdmVsbGVyLmlkO1xyXG4gICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gbnVsbDtcclxuICAgIGRhdGEuY3VycmVudENhcnREZXRhaWxzID0gbnVsbDtcclxuICAgIGRhdGEuc3VtbWFyeSA9IHRydWU7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSB0cnVlO1xyXG4gICAgZGF0YS5hbWVuZCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYW5jZWwgPSBmYWxzZTtcclxuICAgIGRhdGEucHJpbnQgPSBmYWxzZTtcclxuICAgIGRhdGEucmVzY2hlZHVsZSA9IGZhbHNlO1xyXG4gICAgZGF0YS5mbGdVcGNvbWluZyA9IGZsZ1VwY29taW5nO1xyXG4gICAgZGF0YS5mbGdQcmV2aW91cyA9IGZsZ1ByZXZpb3VzO1xyXG4gICAgZGF0YS5lcnJvcnMgPSB7fTtcclxuICAgIGRhdGEucmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGRhdGEuZmlsdGVyID0ge307XHJcbiAgICBkYXRhLmZpbHRlcmVkID0ge307XHJcbiAgICByZXR1cm4gbmV3IE15Ym9va2luZ0RhdGEoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcbk15Ym9va2luZ0RhdGEuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiTXlib29raW5nRGF0YS5mZXRjaFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9haXJDYXJ0L2dldE15Qm9va2luZ3MnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKE15Ym9va2luZ0RhdGEucGFyc2UoZGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE15Ym9va2luZ0RhdGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuanNcbiAqKiBtb2R1bGUgaWQgPSA2MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDMgNCA1XG4gKiovIiwiLyohXG4gKiBhY2NvdW50aW5nLmpzIHYwLjMuMlxuICogQ29weXJpZ2h0IDIwMTEsIEpvc3MgQ3Jvd2Nyb2Z0XG4gKlxuICogRnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogUG9ydGlvbnMgb2YgYWNjb3VudGluZy5qcyBhcmUgaW5zcGlyZWQgb3IgYm9ycm93ZWQgZnJvbSB1bmRlcnNjb3JlLmpzXG4gKlxuICogRnVsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuICogaHR0cDovL2pvc3Njcm93Y3JvZnQuZ2l0aHViLmNvbS9hY2NvdW50aW5nLmpzL1xuICovXG5cbihmdW5jdGlvbihyb290LCB1bmRlZmluZWQpIHtcblxuXHQvKiAtLS0gU2V0dXAgLS0tICovXG5cblx0Ly8gQ3JlYXRlIHRoZSBsb2NhbCBsaWJyYXJ5IG9iamVjdCwgdG8gYmUgZXhwb3J0ZWQgb3IgcmVmZXJlbmNlZCBnbG9iYWxseSBsYXRlclxuXHR2YXIgbGliID0ge307XG5cblx0Ly8gQ3VycmVudCB2ZXJzaW9uXG5cdGxpYi52ZXJzaW9uID0gJzAuMy4yJztcblxuXG5cdC8qIC0tLSBFeHBvc2VkIHNldHRpbmdzIC0tLSAqL1xuXG5cdC8vIFRoZSBsaWJyYXJ5J3Mgc2V0dGluZ3MgY29uZmlndXJhdGlvbiBvYmplY3QuIENvbnRhaW5zIGRlZmF1bHQgcGFyYW1ldGVycyBmb3Jcblx0Ly8gY3VycmVuY3kgYW5kIG51bWJlciBmb3JtYXR0aW5nXG5cdGxpYi5zZXR0aW5ncyA9IHtcblx0XHRjdXJyZW5jeToge1xuXHRcdFx0c3ltYm9sIDogXCIkXCIsXHRcdC8vIGRlZmF1bHQgY3VycmVuY3kgc3ltYm9sIGlzICckJ1xuXHRcdFx0Zm9ybWF0IDogXCIlcyV2XCIsXHQvLyBjb250cm9scyBvdXRwdXQ6ICVzID0gc3ltYm9sLCAldiA9IHZhbHVlIChjYW4gYmUgb2JqZWN0LCBzZWUgZG9jcylcblx0XHRcdGRlY2ltYWwgOiBcIi5cIixcdFx0Ly8gZGVjaW1hbCBwb2ludCBzZXBhcmF0b3Jcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXHRcdC8vIHRob3VzYW5kcyBzZXBhcmF0b3Jcblx0XHRcdHByZWNpc2lvbiA6IDIsXHRcdC8vIGRlY2ltYWwgcGxhY2VzXG5cdFx0XHRncm91cGluZyA6IDNcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0fSxcblx0XHRudW1iZXI6IHtcblx0XHRcdHByZWNpc2lvbiA6IDAsXHRcdC8vIGRlZmF1bHQgcHJlY2lzaW9uIG9uIG51bWJlcnMgaXMgMFxuXHRcdFx0Z3JvdXBpbmcgOiAzLFx0XHQvLyBkaWdpdCBncm91cGluZyAobm90IGltcGxlbWVudGVkIHlldClcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXG5cdFx0XHRkZWNpbWFsIDogXCIuXCJcblx0XHR9XG5cdH07XG5cblxuXHQvKiAtLS0gSW50ZXJuYWwgSGVscGVyIE1ldGhvZHMgLS0tICovXG5cblx0Ly8gU3RvcmUgcmVmZXJlbmNlIHRvIHBvc3NpYmx5LWF2YWlsYWJsZSBFQ01BU2NyaXB0IDUgbWV0aG9kcyBmb3IgbGF0ZXJcblx0dmFyIG5hdGl2ZU1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAsXG5cdFx0bmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanNcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuXHRcdHJldHVybiAhIShvYmogPT09ICcnIHx8IChvYmogJiYgb2JqLmNoYXJDb2RlQXQgJiYgb2JqLnN1YnN0cikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgc3RyaW5nXG5cdCAqIGZyb20gdW5kZXJzY29yZS5qcywgZGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUlzQXJyYXkgPyBuYXRpdmVJc0FycmF5KG9iaikgOiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSB0cnVlIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG5cdFx0cmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBhIGRlZmF1bHRzIG9iamVjdCwgc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgXy5kZWZhdWx0c1xuXHQgKlxuXHQgKiBVc2VkIGZvciBhYnN0cmFjdGluZyBwYXJhbWV0ZXIgaGFuZGxpbmcgZnJvbSBBUEkgbWV0aG9kc1xuXHQgKi9cblx0ZnVuY3Rpb24gZGVmYXVsdHMob2JqZWN0LCBkZWZzKSB7XG5cdFx0dmFyIGtleTtcblx0XHRvYmplY3QgPSBvYmplY3QgfHwge307XG5cdFx0ZGVmcyA9IGRlZnMgfHwge307XG5cdFx0Ly8gSXRlcmF0ZSBvdmVyIG9iamVjdCBub24tcHJvdG90eXBlIHByb3BlcnRpZXM6XG5cdFx0Zm9yIChrZXkgaW4gZGVmcykge1xuXHRcdFx0aWYgKGRlZnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHQvLyBSZXBsYWNlIHZhbHVlcyB3aXRoIGRlZmF1bHRzIG9ubHkgaWYgdW5kZWZpbmVkIChhbGxvdyBlbXB0eS96ZXJvIHZhbHVlcyk6XG5cdFx0XHRcdGlmIChvYmplY3Rba2V5XSA9PSBudWxsKSBvYmplY3Rba2V5XSA9IGRlZnNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRhdGlvbiBvZiBgQXJyYXkubWFwKClgIGZvciBpdGVyYXRpb24gbG9vcHNcblx0ICpcblx0ICogUmV0dXJucyBhIG5ldyBBcnJheSBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBpdGVyYXRvcmAgb24gZWFjaCBhcnJheSB2YWx1ZS5cblx0ICogRGVmZXJzIHRvIG5hdGl2ZSBBcnJheS5tYXAgaWYgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuXHRcdHZhciByZXN1bHRzID0gW10sIGksIGo7XG5cblx0XHRpZiAoIW9iaikgcmV0dXJuIHJlc3VsdHM7XG5cblx0XHQvLyBVc2UgbmF0aXZlIC5tYXAgbWV0aG9kIGlmIGl0IGV4aXN0czpcblx0XHRpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuXG5cdFx0Ly8gRmFsbGJhY2sgZm9yIG5hdGl2ZSAubWFwOlxuXHRcdGZvciAoaSA9IDAsIGogPSBvYmoubGVuZ3RoOyBpIDwgajsgaSsrICkge1xuXHRcdFx0cmVzdWx0c1tpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBhbmQgbm9ybWFsaXNlIHRoZSB2YWx1ZSBvZiBwcmVjaXNpb24gKG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlcilcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrUHJlY2lzaW9uKHZhbCwgYmFzZSkge1xuXHRcdHZhbCA9IE1hdGgucm91bmQoTWF0aC5hYnModmFsKSk7XG5cdFx0cmV0dXJuIGlzTmFOKHZhbCk/IGJhc2UgOiB2YWw7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBmb3JtYXQgc3RyaW5nIG9yIG9iamVjdCBhbmQgcmV0dXJucyBmb3JtYXQgb2JqIGZvciB1c2UgaW4gcmVuZGVyaW5nXG5cdCAqXG5cdCAqIGBmb3JtYXRgIGlzIGVpdGhlciBhIHN0cmluZyB3aXRoIHRoZSBkZWZhdWx0IChwb3NpdGl2ZSkgZm9ybWF0LCBvciBvYmplY3Rcblx0ICogY29udGFpbmluZyBgcG9zYCAocmVxdWlyZWQpLCBgbmVnYCBhbmQgYHplcm9gIHZhbHVlcyAob3IgYSBmdW5jdGlvbiByZXR1cm5pbmdcblx0ICogZWl0aGVyIGEgc3RyaW5nIG9yIG9iamVjdClcblx0ICpcblx0ICogRWl0aGVyIHN0cmluZyBvciBmb3JtYXQucG9zIG11c3QgY29udGFpbiBcIiV2XCIgKHZhbHVlKSB0byBiZSB2YWxpZFxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDdXJyZW5jeUZvcm1hdChmb3JtYXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0O1xuXG5cdFx0Ly8gQWxsb3cgZnVuY3Rpb24gYXMgZm9ybWF0IHBhcmFtZXRlciAoc2hvdWxkIHJldHVybiBzdHJpbmcgb3Igb2JqZWN0KTpcblx0XHRpZiAoIHR5cGVvZiBmb3JtYXQgPT09IFwiZnVuY3Rpb25cIiApIGZvcm1hdCA9IGZvcm1hdCgpO1xuXG5cdFx0Ly8gRm9ybWF0IGNhbiBiZSBhIHN0cmluZywgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIChcIiV2XCIpIG11c3QgYmUgcHJlc2VudDpcblx0XHRpZiAoIGlzU3RyaW5nKCBmb3JtYXQgKSAmJiBmb3JtYXQubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGFuZCByZXR1cm4gcG9zaXRpdmUsIG5lZ2F0aXZlIGFuZCB6ZXJvIGZvcm1hdHM6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwb3MgOiBmb3JtYXQsXG5cdFx0XHRcdG5lZyA6IGZvcm1hdC5yZXBsYWNlKFwiLVwiLCBcIlwiKS5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBmb3JtYXRcblx0XHRcdH07XG5cblx0XHQvLyBJZiBubyBmb3JtYXQsIG9yIG9iamVjdCBpcyBtaXNzaW5nIHZhbGlkIHBvc2l0aXZlIHZhbHVlLCB1c2UgZGVmYXVsdHM6XG5cdFx0fSBlbHNlIGlmICggIWZvcm1hdCB8fCAhZm9ybWF0LnBvcyB8fCAhZm9ybWF0LnBvcy5tYXRjaChcIiV2XCIpICkge1xuXG5cdFx0XHQvLyBJZiBkZWZhdWx0cyBpcyBhIHN0cmluZywgY2FzdHMgaXQgdG8gYW4gb2JqZWN0IGZvciBmYXN0ZXIgY2hlY2tpbmcgbmV4dCB0aW1lOlxuXHRcdFx0cmV0dXJuICggIWlzU3RyaW5nKCBkZWZhdWx0cyApICkgPyBkZWZhdWx0cyA6IGxpYi5zZXR0aW5ncy5jdXJyZW5jeS5mb3JtYXQgPSB7XG5cdFx0XHRcdHBvcyA6IGRlZmF1bHRzLFxuXHRcdFx0XHRuZWcgOiBkZWZhdWx0cy5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBkZWZhdWx0c1xuXHRcdFx0fTtcblxuXHRcdH1cblx0XHQvLyBPdGhlcndpc2UsIGFzc3VtZSBmb3JtYXQgd2FzIGZpbmU6XG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fVxuXG5cblx0LyogLS0tIEFQSSBNZXRob2RzIC0tLSAqL1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIHN0cmluZy9hcnJheSBvZiBzdHJpbmdzLCByZW1vdmVzIGFsbCBmb3JtYXR0aW5nL2NydWZ0IGFuZCByZXR1cm5zIHRoZSByYXcgZmxvYXQgdmFsdWVcblx0ICogYWxpYXM6IGFjY291bnRpbmcuYHBhcnNlKHN0cmluZylgXG5cdCAqXG5cdCAqIERlY2ltYWwgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGZsb2F0cyAoZGVmYXVsdDogXCIuXCIpLCBzbyBpZiB0aGUgbnVtYmVyXG5cdCAqIHVzZXMgYSBub24tc3RhbmRhcmQgZGVjaW1hbCBzZXBhcmF0b3IsIHByb3ZpZGUgaXQgYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0ICpcblx0ICogQWxzbyBtYXRjaGVzIGJyYWNrZXRlZCBuZWdhdGl2ZXMgKGVnLiBcIiQgKDEuOTkpXCIgPT4gLTEuOTkpXG5cdCAqXG5cdCAqIERvZXNuJ3QgdGhyb3cgYW55IGVycm9ycyAoYE5hTmBzIGJlY29tZSAwKSBidXQgdGhpcyBtYXkgY2hhbmdlIGluIGZ1dHVyZVxuXHQgKi9cblx0dmFyIHVuZm9ybWF0ID0gbGliLnVuZm9ybWF0ID0gbGliLnBhcnNlID0gZnVuY3Rpb24odmFsdWUsIGRlY2ltYWwpIHtcblx0XHQvLyBSZWN1cnNpdmVseSB1bmZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZm9ybWF0KHZhbCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBGYWlscyBzaWxlbnRseSAobmVlZCBkZWNlbnQgZXJyb3JzKTpcblx0XHR2YWx1ZSA9IHZhbHVlIHx8IDA7XG5cblx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGFzLWlzIGlmIGl0J3MgYWxyZWFkeSBhIG51bWJlcjpcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gdmFsdWU7XG5cblx0XHQvLyBEZWZhdWx0IGRlY2ltYWwgcG9pbnQgaXMgXCIuXCIgYnV0IGNvdWxkIGJlIHNldCB0byBlZy4gXCIsXCIgaW4gb3B0czpcblx0XHRkZWNpbWFsID0gZGVjaW1hbCB8fCBcIi5cIjtcblxuXHRcdCAvLyBCdWlsZCByZWdleCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBleGNlcHQgZGlnaXRzLCBkZWNpbWFsIHBvaW50IGFuZCBtaW51cyBzaWduOlxuXHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXjAtOS1cIiArIGRlY2ltYWwgKyBcIl1cIiwgW1wiZ1wiXSksXG5cdFx0XHR1bmZvcm1hdHRlZCA9IHBhcnNlRmxvYXQoXG5cdFx0XHRcdChcIlwiICsgdmFsdWUpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCgoLiopXFwpLywgXCItJDFcIikgLy8gcmVwbGFjZSBicmFja2V0ZWQgdmFsdWVzIHdpdGggbmVnYXRpdmVzXG5cdFx0XHRcdC5yZXBsYWNlKHJlZ2V4LCAnJykgICAgICAgICAvLyBzdHJpcCBvdXQgYW55IGNydWZ0XG5cdFx0XHRcdC5yZXBsYWNlKGRlY2ltYWwsICcuJykgICAgICAvLyBtYWtlIHN1cmUgZGVjaW1hbCBwb2ludCBpcyBzdGFuZGFyZFxuXHRcdFx0KTtcblxuXHRcdC8vIFRoaXMgd2lsbCBmYWlsIHNpbGVudGx5IHdoaWNoIG1heSBjYXVzZSB0cm91YmxlLCBsZXQncyB3YWl0IGFuZCBzZWU6XG5cdFx0cmV0dXJuICFpc05hTih1bmZvcm1hdHRlZCkgPyB1bmZvcm1hdHRlZCA6IDA7XG5cdH07XG5cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcblx0ICpcblx0ICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gXCIwLjYxXCIpIHRoYXQgcHJlc2VudFxuXHQgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cblx0ICovXG5cdHZhciB0b0ZpeGVkID0gbGliLnRvRml4ZWQgPSBmdW5jdGlvbih2YWx1ZSwgcHJlY2lzaW9uKSB7XG5cdFx0cHJlY2lzaW9uID0gY2hlY2tQcmVjaXNpb24ocHJlY2lzaW9uLCBsaWIuc2V0dGluZ3MubnVtYmVyLnByZWNpc2lvbik7XG5cdFx0dmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG5cblx0XHQvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcblx0XHRyZXR1cm4gKE1hdGgucm91bmQobGliLnVuZm9ybWF0KHZhbHVlKSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyLCB3aXRoIGNvbW1hLXNlcGFyYXRlZCB0aG91c2FuZHMgYW5kIGN1c3RvbSBwcmVjaXNpb24vZGVjaW1hbCBwbGFjZXNcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgcHJlY2lzaW9uIGFuZCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9yc1xuXHQgKiAybmQgcGFyYW1ldGVyIGBwcmVjaXNpb25gIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLm51bWJlcmBcblx0ICovXG5cdHZhciBmb3JtYXROdW1iZXIgPSBsaWIuZm9ybWF0TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiBmb3JtYXROdW1iZXIodmFsLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChwcmVjaXNpb24pID8gcHJlY2lzaW9uIDoge1xuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MubnVtYmVyXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDbGVhbiB1cCBwcmVjaXNpb25cblx0XHRcdHVzZVByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSxcblxuXHRcdFx0Ly8gRG8gc29tZSBjYWxjOlxuXHRcdFx0bmVnYXRpdmUgPSBudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiLFxuXHRcdFx0YmFzZSA9IHBhcnNlSW50KHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyIHx8IDApLCB1c2VQcmVjaXNpb24pLCAxMCkgKyBcIlwiLFxuXHRcdFx0bW9kID0gYmFzZS5sZW5ndGggPiAzID8gYmFzZS5sZW5ndGggJSAzIDogMDtcblxuXHRcdC8vIEZvcm1hdCB0aGUgbnVtYmVyOlxuXHRcdHJldHVybiBuZWdhdGl2ZSArIChtb2QgPyBiYXNlLnN1YnN0cigwLCBtb2QpICsgb3B0cy50aG91c2FuZCA6IFwiXCIpICsgYmFzZS5zdWJzdHIobW9kKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgb3B0cy50aG91c2FuZCkgKyAodXNlUHJlY2lzaW9uID8gb3B0cy5kZWNpbWFsICsgdG9GaXhlZChNYXRoLmFicyhudW1iZXIpLCB1c2VQcmVjaXNpb24pLnNwbGl0KCcuJylbMV0gOiBcIlwiKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBudW1iZXIgaW50byBjdXJyZW5jeVxuXHQgKlxuXHQgKiBVc2FnZTogYWNjb3VudGluZy5mb3JtYXRNb25leShudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZHNTZXAsIGRlY2ltYWxTZXAsIGZvcm1hdClcblx0ICogZGVmYXVsdHM6ICgwLCBcIiRcIiwgMiwgXCIsXCIsIFwiLlwiLCBcIiVzJXZcIilcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kIC8gZGVjaW1hbCBzZXBhcmF0b3JzIGFuZCBmb3JtYXRcblx0ICogU2Vjb25kIHBhcmFtIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLmN1cnJlbmN5YCB3aGljaCBpcyB0aGUgZWFzaWVzdCB3YXkuXG5cdCAqXG5cdCAqIFRvIGRvOiB0aWR5IHVwIHRoZSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHR2YXIgZm9ybWF0TW9uZXkgPSBsaWIuZm9ybWF0TW9uZXkgPSBmdW5jdGlvbihudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKXtcblx0XHRcdFx0cmV0dXJuIGZvcm1hdE1vbmV5KHZhbCwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgbnVtYmVyOlxuXHRcdG51bWJlciA9IHVuZm9ybWF0KG51bWJlcik7XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pOlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZTpcblx0XHRcdHVzZUZvcm1hdCA9IG51bWJlciA+IDAgPyBmb3JtYXRzLnBvcyA6IG51bWJlciA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybztcblxuXHRcdC8vIFJldHVybiB3aXRoIGN1cnJlbmN5IHN5bWJvbCBhZGRlZDpcblx0XHRyZXR1cm4gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKG51bWJlciksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbGlzdCBvZiBudW1iZXJzIGludG8gYW4gYWNjb3VudGluZyBjb2x1bW4sIHBhZGRpbmcgd2l0aCB3aGl0ZXNwYWNlXG5cdCAqIHRvIGxpbmUgdXAgY3VycmVuY3kgc3ltYm9scywgdGhvdXNhbmQgc2VwYXJhdG9ycyBhbmQgZGVjaW1hbHMgcGxhY2VzXG5cdCAqXG5cdCAqIExpc3Qgc2hvdWxkIGJlIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICogU2Vjb25kIHBhcmFtZXRlciBjYW4gYmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyB0aGF0IG1hdGNoIHRoZSBwYXJhbXNcblx0ICpcblx0ICogUmV0dXJucyBhcnJheSBvZiBhY2NvdXRpbmctZm9ybWF0dGVkIG51bWJlciBzdHJpbmdzIG9mIHNhbWUgbGVuZ3RoXG5cdCAqXG5cdCAqIE5COiBgd2hpdGUtc3BhY2U6cHJlYCBDU1MgcnVsZSBpcyByZXF1aXJlZCBvbiB0aGUgbGlzdCBjb250YWluZXIgdG8gcHJldmVudFxuXHQgKiBicm93c2VycyBmcm9tIGNvbGxhcHNpbmcgdGhlIHdoaXRlc3BhY2UgaW4gdGhlIG91dHB1dCBzdHJpbmdzLlxuXHQgKi9cblx0bGliLmZvcm1hdENvbHVtbiA9IGZ1bmN0aW9uKGxpc3QsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0aWYgKCFsaXN0KSByZXR1cm4gW107XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pLCBvbmx5IG5lZWQgcG9zIGZvciBub3c6XG5cdFx0XHRmb3JtYXRzID0gY2hlY2tDdXJyZW5jeUZvcm1hdChvcHRzLmZvcm1hdCksXG5cblx0XHRcdC8vIFdoZXRoZXIgdG8gcGFkIGF0IHN0YXJ0IG9mIHN0cmluZyBvciBhZnRlciBjdXJyZW5jeSBzeW1ib2w6XG5cdFx0XHRwYWRBZnRlclN5bWJvbCA9IGZvcm1hdHMucG9zLmluZGV4T2YoXCIlc1wiKSA8IGZvcm1hdHMucG9zLmluZGV4T2YoXCIldlwiKSA/IHRydWUgOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RvcmUgdmFsdWUgZm9yIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nIGluIHRoZSBjb2x1bW46XG5cdFx0XHRtYXhMZW5ndGggPSAwLFxuXG5cdFx0XHQvLyBGb3JtYXQgdGhlIGxpc3QgYWNjb3JkaW5nIHRvIG9wdGlvbnMsIHN0b3JlIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nOlxuXHRcdFx0Zm9ybWF0dGVkID0gbWFwKGxpc3QsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheSh2YWwpKSB7XG5cdFx0XHRcdFx0Ly8gUmVjdXJzaXZlbHkgZm9ybWF0IGNvbHVtbnMgaWYgbGlzdCBpcyBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5OlxuXHRcdFx0XHRcdHJldHVybiBsaWIuZm9ybWF0Q29sdW1uKHZhbCwgb3B0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYW4gdXAgdGhlIHZhbHVlXG5cdFx0XHRcdFx0dmFsID0gdW5mb3JtYXQodmFsKTtcblxuXHRcdFx0XHRcdC8vIENob29zZSB3aGljaCBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIHZhbHVlIChwb3MsIG5lZyBvciB6ZXJvKTpcblx0XHRcdFx0XHR2YXIgdXNlRm9ybWF0ID0gdmFsID4gMCA/IGZvcm1hdHMucG9zIDogdmFsIDwgMCA/IGZvcm1hdHMubmVnIDogZm9ybWF0cy56ZXJvLFxuXG5cdFx0XHRcdFx0XHQvLyBGb3JtYXQgdGhpcyB2YWx1ZSwgcHVzaCBpbnRvIGZvcm1hdHRlZCBsaXN0IGFuZCBzYXZlIHRoZSBsZW5ndGg6XG5cdFx0XHRcdFx0XHRmVmFsID0gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKHZhbCksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cblx0XHRcdFx0XHRpZiAoZlZhbC5sZW5ndGggPiBtYXhMZW5ndGgpIG1heExlbmd0aCA9IGZWYWwubGVuZ3RoO1xuXHRcdFx0XHRcdHJldHVybiBmVmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIFBhZCBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBhbmQgc2VuZCBiYWNrIHRoZSBjb2x1bW4gb2YgbnVtYmVyczpcblx0XHRyZXR1cm4gbWFwKGZvcm1hdHRlZCwgZnVuY3Rpb24odmFsLCBpKSB7XG5cdFx0XHQvLyBPbmx5IGlmIHRoaXMgaXMgYSBzdHJpbmcgKG5vdCBhIG5lc3RlZCBhcnJheSwgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcGFkZGVkKTpcblx0XHRcdGlmIChpc1N0cmluZyh2YWwpICYmIHZhbC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcblx0XHRcdFx0Ly8gRGVwZW5kaW5nIG9uIHN5bWJvbCBwb3NpdGlvbiwgcGFkIGFmdGVyIHN5bWJvbCBvciBhdCBpbmRleCAwOlxuXHRcdFx0XHRyZXR1cm4gcGFkQWZ0ZXJTeW1ib2wgPyB2YWwucmVwbGFjZShvcHRzLnN5bWJvbCwgb3B0cy5zeW1ib2wrKG5ldyBBcnJheShtYXhMZW5ndGggLSB2YWwubGVuZ3RoICsgMSkuam9pbihcIiBcIikpKSA6IChuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSArIHZhbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvKiAtLS0gTW9kdWxlIERlZmluaXRpb24gLS0tICovXG5cblx0Ly8gRXhwb3J0IGFjY291bnRpbmcgZm9yIENvbW1vbkpTLiBJZiBiZWluZyBsb2FkZWQgYXMgYW4gQU1EIG1vZHVsZSwgZGVmaW5lIGl0IGFzIHN1Y2guXG5cdC8vIE90aGVyd2lzZSwganVzdCBhZGQgYGFjY291bnRpbmdgIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5cdGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRcdGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblx0XHR9XG5cdFx0ZXhwb3J0cy5hY2NvdW50aW5nID0gbGliO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIFJldHVybiB0aGUgbGlicmFyeSBhcyBhbiBBTUQgbW9kdWxlOlxuXHRcdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbGliO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFVzZSBhY2NvdW50aW5nLm5vQ29uZmxpY3QgdG8gcmVzdG9yZSBgYWNjb3VudGluZ2AgYmFjayB0byBpdHMgb3JpZ2luYWwgdmFsdWUuXG5cdFx0Ly8gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSdzIGBhY2NvdW50aW5nYCBvYmplY3Q7XG5cdFx0Ly8gZS5nLiBgdmFyIG51bWJlcnMgPSBhY2NvdW50aW5nLm5vQ29uZmxpY3QoKTtgXG5cdFx0bGliLm5vQ29uZmxpY3QgPSAoZnVuY3Rpb24ob2xkQWNjb3VudGluZykge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBSZXNldCB0aGUgdmFsdWUgb2YgdGhlIHJvb3QncyBgYWNjb3VudGluZ2AgdmFyaWFibGU6XG5cdFx0XHRcdHJvb3QuYWNjb3VudGluZyA9IG9sZEFjY291bnRpbmc7XG5cdFx0XHRcdC8vIERlbGV0ZSB0aGUgbm9Db25mbGljdCBtZXRob2Q6XG5cdFx0XHRcdGxpYi5ub0NvbmZsaWN0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHQvLyBSZXR1cm4gcmVmZXJlbmNlIHRvIHRoZSBsaWJyYXJ5IHRvIHJlLWFzc2lnbiBpdDpcblx0XHRcdFx0cmV0dXJuIGxpYjtcblx0XHRcdH07XG5cdFx0fSkocm9vdC5hY2NvdW50aW5nKTtcblxuXHRcdC8vIERlY2xhcmUgYGZ4YCBvbiB0aGUgcm9vdCAoZ2xvYmFsL3dpbmRvdykgb2JqZWN0OlxuXHRcdHJvb3RbJ2FjY291bnRpbmcnXSA9IGxpYjtcblx0fVxuXG5cdC8vIFJvb3Qgd2lsbCBiZSBgd2luZG93YCBpbiBicm93c2VyIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXI6XG59KHRoaXMpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzXG4gKiogbW9kdWxlIGlkID0gNjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJylcclxuICAgIDtcclxuXHJcbnZhciBBdXRoID0gRm9ybS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnbG9naW4nLFxyXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZm9yZ290dGVucGFzczogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICB1c2VyOiB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3BvcHVwJykpIHtcclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvJyArIHRoaXMuZ2V0KCdhY3Rpb24nKSxcclxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSwgcGFzc3dvcmQ6IHRoaXMuZ2V0KCd1c2VyLnBhc3N3b3JkJykgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2aWV3LmdldCgncG9wdXAnKT09bnVsbCAmJiBkYXRhICYmIGRhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldFBhc3N3b3JkOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL2ZvcmdvdHRlbnBhc3MnLFxyXG4gICAgICAgICAgICBkYXRhOiB7IGVtYWlsOiB0aGlzLmdldCgndXNlci5sb2dpbicpIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgncmVzZXRzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaWdudXA6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC9zaWdudXAnLFxyXG4gICAgICAgICAgICBkYXRhOiBfLnBpY2sodGhpcy5nZXQoJ3VzZXInKSwgWydlbWFpbCcsJ25hbWUnLCAnbW9iaWxlJywgJ3Bhc3N3b3JkJywgJ3Bhc3N3b3JkMiddKSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzaWdudXBzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5BdXRoLmxvZ2luID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XHJcblxyXG4gICAgYXV0aC5zZXQoJ3BvcHVwJywgdHJ1ZSk7XHJcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xyXG4gICAgYXV0aC5yZW5kZXIoJyNwb3B1cC1jb250YWluZXInKTtcclxuXHJcbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xyXG59O1xyXG5cclxuQXV0aC5zaWdudXAgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcclxuXHJcbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcclxuICAgIGF1dGguc2V0KCdzaWdudXAnLCB0cnVlKTtcclxuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGg7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanNcbiAqKiBtb2R1bGUgaWQgPSA3M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMyA0IDUgOFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbG9naW4gc21hbGwgbW9kYWxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIkxvZ2luXCJdLFwiblwiOjUxLFwieFwiOntcInJcIjpbXCJmb3Jnb3R0ZW5wYXNzXCIsXCJzaWdudXBcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlNpZ24tdXBcIl0sXCJuXCI6NTAsXCJyXCI6XCJzaWdudXBcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiUmVzZXQgcGFzc3dvcmRcIl0sXCJuXCI6NTAsXCJyXCI6XCJmb3Jnb3R0ZW5wYXNzXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJwb3B1cFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XSxcInJcIjpcInBvcHVwXCJ9XSxcInBcIjp7XCJmb3JtXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJmb3JtXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widWkgYmFzaWMgc2VnbWVudCBmb3JtXCJdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdWJtaXR0aW5nXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImhpZGVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImZvcmdvdHRlbnBhc3NcIixcInNpZ251cFwiXSxcInNcIjpcIl8wfHxfMVwifX1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsb2dpblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmxvZ2luXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkxvZ2luXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicGFzc3dvcmRcIixcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIucGFzc3dvcmRcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmRcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6W1widWkgXCIse1widFwiOjQsXCJmXCI6W1wic21hbGxcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJtYXNzaXZlXCJdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJdfSxcImZcIjpbXCJMT0dJTlwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6XCJmb3Jnb3QtcGFzc3dvcmRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImZvcmdvdHRlbnBhc3NcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiRm9yZ290IFBhc3N3b3JkP1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIkRvbuKAmXQgaGF2ZSBhIENoZWFwVGlja2V0LmluIEFjY291bnQ/IFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJzaWdudXBcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiU2lnbiB1cCBmb3Igb25lIMK7XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcInNpZ251cFwifV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmVtYWlsXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibW9iaWxlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIubW9iaWxlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZVwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIm5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5uYW1lXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIk5hbWVcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwibmFtZVwiOlwicGFzc3dvcmRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJuYW1lXCI6XCJwYXNzd29yZDJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZDJcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmQgYWdhaW5cIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJidXR0b25cIixcImNsYXNzXCI6XCJ1aSBtYXNzaXZlIGZsdWlkIGJsdWUgYnV0dG9uIHVwcGVyY2FzZVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNpZ251cFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiU2lnbnVwXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV0sXCJuXCI6NTEsXCJyXCI6XCJzaWdudXBzdWNjZXNzXCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiWW91ciByZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3MuXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIllvdSB3aWxsIHJlY2VpdmUgZW1haWwgd2l0aCBmdXJ0aGVyIGluc3RydWN0aW9ucyBmcm9tIHVzIGhvdyB0byBwcm9jZWVkLlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJQbGVhc2UgY2hlY2sgeW91ciBpbmJveCBhbmQgaWYgbm8gZW1haWwgZnJvbSB1cyBpcyBmb3VuZCwgY2hlY2sgYWxzbyB5b3VyIFNQQU0gZm9sZGVyLlwiXSxcIm5cIjo1MCxcInJcIjpcInNpZ251cHN1Y2Nlc3NcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcImZvcmdvdHRlbnBhc3NcIn1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibG9naW5cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5sb2dpblwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJFbWFpbFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIG1hc3NpdmUgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVzZXRQYXNzd29yZFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiUkVTRVRcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yTXNnXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2dcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19XSxcIm5cIjo1MSxcInJcIjpcInJlc2V0c3VjY2Vzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJJbnN0cnVjdGlvbnMgaG93IHRvIHJldml2ZSB5b3VyIHBhc3N3b3JkIGhhcyBiZWVuIHNlbnQgdG8geW91ciBlbWFpbC5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwuXCJdLFwiblwiOjUwLFwiclwiOlwicmVzZXRzdWNjZXNzXCJ9XX1dfV19fTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2FwcC9hdXRoLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA3NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMyA0IDUgOFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciAgR3Vlc3RGaWx0ZXIgPSByZXF1aXJlKCdjb21wb25lbnRzL2d1ZXN0dGlja2V0L2d1ZXN0ZmlsdGVyJyk7XHJcbiAgICAgXHJcbnJlcXVpcmUoJ3dlYi9tb2R1bGVzL2d1ZXN0ZmlsdGVyLmxlc3MnKTtcclxuXHJcbi8vJChmdW5jdGlvbigpIHtcclxuLy8gICAgY29uc29sZS5sb2coJ0luc2lkZSBNYWluIG15Ym9va2luZ3MnKTtcclxuLy8gICAgdmFyIG15Ym9va2luZ3MgPSBuZXcgTXlib29raW5ncygpO1xyXG4vLyAgICB2YXIgdXNlciA9IG5ldyBVc2VyKCk7ICAgIFxyXG4vL1xyXG4vLyAgICBteWJvb2tpbmdzLnJlbmRlcignI2NvbnRlbnQnKTtcclxuLy8gICAgdXNlci5yZW5kZXIoJyNwYW5lbCcpO1xyXG4vL30pO1xyXG5cclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgICAobmV3IEd1ZXN0RmlsdGVyKCkpLnJlbmRlcignI2FwcCcpO1xyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9ndWVzdGZpbHRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI0OFxuICoqIG1vZHVsZSBjaHVua3MgPSA0XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgICAgICBBdXRoID0gcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvYXV0aCcpLFxyXG4gICAgICAgIE15Ym9va2luZ0RhdGEgPSByZXF1aXJlKCdzdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzJyksXHJcbiAgICAgICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL21ldGEnKVxyXG4gICAgICAgIDtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9ndWVzdHRpY2tldC9ndWVzdGZpbHRlci5odG1sJyksXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ2xheW91dCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2xheW91dCcpLFxyXG4gICAgICAgIGF1dGg6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2F1dGgnKSxcclxuICAgICAgICBndWVzdGJvb2tpbmc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZ3Vlc3R0aWNrZXQvZ3Vlc3Rib29raW5nJyksXHJcbiAgICAgICAgZGV0YWlsczogcmVxdWlyZSgnY29tcG9uZW50cy9teWJvb2tpbmdzL2RldGFpbHMnKSxcclxuICAgIH0sXHJcbiAgICBwYXJ0aWFsczoge1xyXG4gICAgICAgICdiYXNlLXBhbmVsJzogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9sYXlvdXQvcGFuZWwuaHRtbCcpXHJcbiAgICB9LFxyXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbXlib29raW5nczp7bG9nZ2VkaW46ZmFsc2V9LFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgTWV0YS5pbnN0YW5jZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihtZXRhKSB7IHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7fS5iaW5kKHRoaXMpKTtcclxuICAgICAgICAvLyB0aGlzLnNldCgndXNlcicsIFVzZXIpO1xyXG4gICAgICAgIHdpbmRvdy52aWV3ID0gdGhpcztcclxuICAgIH0sXHJcbiAgICBzaG93OiBmdW5jdGlvbiAoc2VjdGlvbiwgdmFsaWRhdGlvbiwgYWxsKSB7XHJcbiAgICAgICAgaWYgKGFsbClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGlmICgnYmlydGgnID09IHNlY3Rpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkb21lc3RpYycgIT0gJ3ZhbGlkYXRpb24nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCdwYXNzcG9ydCcgPT0gc2VjdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Z1bGwnID09ICd2YWxpZGF0aW9uJztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2lnbmluOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICBBdXRoLmxvZ2luKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgICAgc2lnbnVwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBBdXRoLnNpZ251cCgpO1xyXG4gICAgfSxcclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZ3Vlc3R0aWNrZXQvZ3Vlc3RmaWx0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gNFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJndWVzdGJvb2tpbmdcIixcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzdGVwIGhlYWRlciBzdGVwMSBhY3RpdmVcIn0sXCJmXCI6W1wiR2V0IEJvb2tpbmdcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHR3byBjb2x1bW4gbWlkZGxlIGFsaWduZWQgY2VudGVyIGFsaWduZWQgcmVsYXhlZCBmaXR0ZWQgc3RhY2thYmxlIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJhdXRoXCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB2ZXJ0aWNhbCBkaXZpZGVyXCJ9LFwiZlwiOltcIk9yXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjZW50ZXIgYWxpZ25lZCBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZ3Vlc3Rib29raW5nXCIsXCJhXCI6e1wibXlib29raW5nc1wiOlt7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3NcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dfV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MubG9nZ2VkaW5cIl0sXCJzXCI6XCIhXzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRldGFpbHNcIixcImFcIjp7XCJteWJvb2tpbmdzXCI6W3tcInRcIjoyLFwiclwiOlwibXlib29raW5nc1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV0sXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MubG9nZ2VkaW5cIl0sXCJzXCI6XCIhXzBcIn19LFwiIFwiXSxcInBcIjp7XCJwYW5lbFwiOlt7XCJ0XCI6OCxcInJcIjpcImJhc2UtcGFuZWxcIn1dfX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0ZmlsdGVyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyNTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gNFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgICAgICBRID0gcmVxdWlyZSgncScpXHJcbiAgICAgICAgO1xyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpXHJcbiAgICAgICAgO1xyXG52YXIgR3Vlc3RCb29raW5nID0gRm9ybS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9ndWVzdHRpY2tldC9ndWVzdGJvb2tpbmcuaHRtbCcpLFxyXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2d1ZXN0Ym9va2luZycsXHJcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBtb2JpbGU6ICcnLFxyXG4gICAgICAgICAgICBwbnI6ICcnLFxyXG4gICAgICAgICAgICBsYXN0bmFtZTogJycsXHJcbiAgICAgICAgICAgIHBucjI6ICcnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgZ2V0dGlja2V0YnlwbnI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wZW5kaW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Z3Vlc3Rib29raW5nLycsXHJcbiAgICAgICAgICAgIGRhdGE6IHttb2JpbGU6IHRoaXMuZ2V0KCdtb2JpbGUnKSwgcG5yOiB0aGlzLmdldCgncG5yJyl9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5lcnJvciA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCwgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSxjdXJlbmN5OiBkYXRhLmN1cmVuY3ksZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsIHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzJywgZGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3Muc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wZW5kaW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLmxvZ2dlZGluJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsICdOb3QgRm91bmQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JNc2cnLCAnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXR0aWNrZXRieWxhc3RuYW1lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZzInLCBudWxsKTtcclxuICAgICAgICB0aGlzLnNldCgnZXJyb3IyJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcyJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MucGVuZGluZycsIHRydWUpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgY29udGV4dDogdGhpcyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldGd1ZXN0Ym9va2luZy8nLFxyXG4gICAgICAgICAgICBkYXRhOiB7bGFzdG5hbWU6IHRoaXMuZ2V0KCdsYXN0bmFtZScpLCBwbnIyOiB0aGlzLmdldCgncG5yMicpfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nMicsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5lcnJvciA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCwgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLCBzdGF0dXNtc2c6IHQuc3RhdHVzbXNnLCBzZWxlY3RlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKHQucm91dGVzLCBmdW5jdGlvbiAocm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm8uaWQsIG9yaWdpbjogcm8ub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiByby5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHJvLmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHJvLmRlcGFydHVyZSwgYXJyaXZhbDogcm8uYXJyaXZhbCwgY2Fycmllcjogcm8uY2FycmllciwgY2Fycmllck5hbWU6IHJvLmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHJvLmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogcm8uZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHJvLm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiByby5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiByby5tZWFsLCBzZWF0OiByby5zZWF0LCBhaXJjcmFmdDogcm8uYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcChpLnJvdXRlcywgZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBvcmlnaW46IHQub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiB0Lm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogdC5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiB0LmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHQuZGVwYXJ0dXJlLCBhcnJpdmFsOiB0LmFycml2YWwsIGNhcnJpZXI6IHQuY2FycmllciwgY2Fycmllck5hbWU6IHQuY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogdC5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiB0LmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiB0Lm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiB0LmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHQubWVhbCwgc2VhdDogdC5zZWF0LCBhaXJjcmFmdDogdC5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscycsIGRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnN1bW1hcnknLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MucGVuZGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5sb2dnZWRpbicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnZXJyb3JNc2cyJywgZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2Vycm9yMicsICdOb3QgRm91bmQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMyJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9yTXNnMicsICdTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxufSk7XHJcbm1vZHVsZS5leHBvcnRzID0gR3Vlc3RCb29raW5nO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5qc1xuICoqIG1vZHVsZSBpZCA9IDI1MVxuICoqIG1vZHVsZSBjaHVua3MgPSA0XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdWJtaXR0aW5nXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcImdldHRpY2tldGJ5cG5yXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdHdvIGNvbHVtbiBtaWRkbGUgYWxpZ25lZCBjZW50ZXIgYWxpZ25lZCByZWxheGVkIGZpdHRlZCBzdGFja2FibGUgXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBzZWdtZW50XCIsXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIm1vYmlsZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJtb2JpbGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZSAvIEVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicG5yXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInBuclwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQTlIgLyBCb29raW5nIElkLlwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6XCJ1aSBzbWFsbCBibHVlIGJ1dHRvbiBcIn0sXCJmXCI6W1wiU1VCTUlUXCJdfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBob3Jpem9udGFsIGRpdmlkZXJcIn0sXCJmXCI6W1wiT1JcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yczJcIixcImVycm9yTXNnMlwiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInN1Ym1pdHRpbmcyXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcImdldHRpY2tldGJ5bGFzdG5hbWVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0d28gY29sdW1uIG1pZGRsZSBhbGlnbmVkIGNlbnRlciBhbGlnbmVkIHJlbGF4ZWQgZml0dGVkIHN0YWNrYWJsZSBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIixcInN0eWxlXCI6XCJtYXgtd2lkdGg6IDMwMHB4OyBtYXJnaW46IGF1dG87IHRleHQtYWxpZ246IGxlZnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibGFzdG5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibGFzdG5hbWVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIkxhc3QgTmFtZVwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInBucjJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicG5yMlwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQTlIgLyBCb29raW5nIElkLlwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2cyXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2cyXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzMlwifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzMlwiLFwiZXJyb3JNc2cyXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIHNtYWxsIGJsdWUgYnV0dG9uIFwifSxcImZcIjpbXCJTVUJNSVRcIl19XX1dfV19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5odG1sXG4gKiogbW9kdWxlIGlkID0gMjUyXG4gKiogbW9kdWxlIGNodW5rcyA9IDRcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXHJcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIGFjY291bnRpbmcgPSByZXF1aXJlKCdhY2NvdW50aW5nLmpzJylcclxuICAgICAgICAvL015dHJhdmVsbGVyID0gcmVxdWlyZSgnYXBwL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpICAgO1xyXG4gICAgICAgIDtcclxuXHJcblxyXG52YXIgdDJtID0gZnVuY3Rpb24gKHRpbWUpIHtcclxuICAgIHZhciBpID0gdGltZS5zcGxpdCgnOicpO1xyXG5cclxuICAgIHJldHVybiBpWzBdICogNjAgKyBpWzFdO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXlib29raW5ncy9kZXRhaWxzLmh0bWwnKSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZW1haWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZm9ybWF0QmlydGhEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUaXRsZTogZnVuY3Rpb24gKHRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aXRsZXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0VHJhdmVsRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMjogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIE1NTSBEIFlZWVknKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMzogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIEhIOm1tJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1czogZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29uZmlybSc7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdub3Rjb25maXJtJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbmZpcm1lZCc7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3QgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYWJib29raW5nU3RhdHVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQoc3QsIHsnaWQnOiBzdGF0dXN9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlmZjogZnVuY3Rpb24gKGVuZCwgc3RhcnQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbXMgPSBtb21lbnQoZW5kLCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZGlmZihtb21lbnQoc3RhcnQsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG1vbWVudC5kdXJhdGlvbihtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihkLmFzSG91cnMoKSkgKyAnaCAnICsgZC5taW51dGVzKCkgKyAnbSc7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3M6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJzID09IDEgfHwgYnMgPT0gMiB8fCBicyA9PSAzIHx8ICBicyA9PSA3KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInByb2dyZXNzXCI7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA0IHx8IGJzID09IDUgfHwgYnMgPT0gNiB8fCBicyA9PSAxMilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjYW5jZWxsZWRcIjtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJzID09IDggfHwgYnMgPT0gOSB8fCBicyA9PSAxMCB8fCBicyA9PSAxMSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJib29rZWRcIjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdTdGF0dXNNZXNzYWdlOiBmdW5jdGlvbiAoYnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBia3MgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYm9va2luZ1N0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQoYmtzLCB7J2lkJzogYnN9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udmVydDogZnVuY3Rpb24gKGFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoYW1vdW50LCAnJywgMCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnZlcnRJeGlnbzogZnVuY3Rpb24gKGFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY291bnRpbmcudW5mb3JtYXQoYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICcnLCAwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIHRvZ2dsZWVtYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3N1Ym1pdHRpbmcnKSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0KCdtZXRhLnVzZXIuZW1haWwnKTtcclxuICAgICAgICAvL3RoaXMuc2V0KCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAkKCcjZW1haWwnKS52YWwoZW1haWwpO1xyXG4gICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAvLyB0aGlzLnNpZ25pbigpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbmluaXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vbignYmFjaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwibXlib29raW5ncy9cIikgPiAtMSlcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwibXlib29raW5nc1wiKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3N1bW1hcnknLCB0cnVlKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwiZ3Vlc3Rib29raW5nXCIpID4gLTEpXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvZ3Vlc3Rib29raW5nJztcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdjYW5jZWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdhbWVuZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2NhbmNlbCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3Jlc2NoZWR1bGUnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25pbm4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdyZXNjaGVkdWxlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnYW1lbmQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdyZXNjaGVkdWxlJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnY2FuY2VsJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaWduaW5uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdwcmludGRpdicsIGZ1bmN0aW9uIChldmVudCwgaWQpIHtcclxuICAgICAgICAgICAgLy93aW5kb3cucHJpbnQoKTtcclxuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9haXJDYXJ0L3ByaW50LycgKyBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbignYXNQREYnLCBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XHJcbiAgICAgICAgICAgIC8vd2luZG93LmxvY2F0aW9uKCcvYjJjL2FpckNhcnQvYXNQREYvJytpZCk7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FpckNhcnQvYXNQREYvXCIgKyBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbignY2xvc2VtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICQoJy51aS5wb3NpdGl2ZS5tZXNzYWdlJykuZmFkZU91dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICQoJy5tZXNzYWdlJykuZmFkZUluKCk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvc2VuZEVtYWlsLycgKyB2aWV3LmdldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWQnKSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtlbWFpbDogJCgnI2VtYWlsJykudmFsKCksIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LmRlZmVycmVkLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JNc2cnLCAnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgXHJcbiAgICB9LFxyXG4gICAgc2lnbmlubjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyh2aWV3LmdldCgnbXlib29raW5ncycpKTtcclxuICAgICAgICBBdXRoLmxvZ2luKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCdteWJvb2tpbmdzJykuY3VycmVudENhcnREZXRhaWxzLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnbWV0YS51c2VyJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzLycgKyB2aWV3LmdldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvZGV0YWlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDI1M1xuICoqIG1vZHVsZSBjaHVua3MgPSA0IDVcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwb3NpdGl2ZSAgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6IG5vbmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9LFwidlwiOntcImNsaWNrXCI6XCJjbG9zZW1lc3NhZ2VcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlNlbmRpbmcgRW1haWwuLlwiXSxcIm5cIjo1MCxcInJcIjpcIi4vc3VibWl0dGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJFbWFpbCBTZW50XCJdLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLnByaW50XCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiYm94IG15LWJvb2tpbmdzLWRldGFpbHMgXCIse1widFwiOjQsXCJmXCI6W1widWkgc2VnbWVudCBsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5wZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJub3ByaW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgxXCIsXCJhXCI6e1wic3R5bGVcIjpcInZlcnRpY2FsLWFsaWduOiBib3R0b21cIn0sXCJmXCI6W1wiTXkgQm9va2luZ3MgRGV0YWlscyBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOlwicmVzY2hlZHVsZVwifSxcImFcIjp7XCJjbGFzc1wiOlwic21hbGwgdWkgYnV0dG9uIG9yYW5nZVwifSxcImZcIjpbXCJDaGFuZ2UvUmVzY2hlZHVsZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOlwiY2FuY2VsXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbCB1aSBidXR0b24gcmVkXCJ9LFwiZlwiOltcIkNhbmNlbFwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJ1cGNvbWluZ1wiLFwibWV0YS51c2VyLmVtYWlsXCIsXCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5lbWFpbFwiXSxcInNcIjpcIl8wPT1cXFwidHJ1ZVxcXCImJl8xPT1fMlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOlwiYmFja1wifSxcImFcIjp7XCJjbGFzc1wiOlwic21hbGwgdWkgYnV0dG9uIHllbGxvd1wifSxcImZcIjpbXCJCYWNrXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFjdGlvblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiI1wiLFwiY2xhc3NcIjpcImVtYWlsXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidG9nZ2xlZW1haWxcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZD0nZGlzYWJsZWQnXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzdWJtaXR0aW5nXCJdLFwic1wiOlwiIV8wXCJ9fV0sXCJmXCI6W1wiRW1haWxcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvYXNQREYvXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZFwifV0sXCJ0YXJnZXRcIjpcIl9ibGFua1wiLFwiY2xhc3NcIjpcInBkZlwifSxcImZcIjpbXCJUaWNrZXQgYXMgUERGXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwidGlja2V0XCIsXCJocmVmXCI6W1wiL2IyYy9haXJDYXJ0L215Ym9va2luZ3MvXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZFwifSxcIiNwcmludFwiXSxcInRhcmdldFwiOlwiX2JsYW5rXCJ9LFwiZlwiOltcIlByaW50IEUtVGlja2V0XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBtb2RhbCBzbWFsbFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJFbWFpbCBUaWNrZXRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgZm9ybSBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9XSxcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGlucHV0IHNtYWxsXCIsXCJ0eXBlXCI6XCJ0ZXh0XCIsXCJuYW1lXCI6XCJlbWFpbFwiLFwiaWRcIjpcImVtYWlsXCIsXCJ2YWx1ZVwiOlwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25zXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwidWkgc21hbGwgYnV0dG9uXCJ9LFwiZlwiOltcIlNlbmRcIl19XX1dfV19XX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5wcmludFwiXSxcInNcIjpcIiFfMFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcInN0eWxlXCI6XCJ3aWR0aDo5NSVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJ3aWR0aDo0NSVcIixcImNvbHNwYW5cIjpcIjNcIn0sXCJmXCI6W3tcInRcIjozLFwiclwiOlwidGlja2V0c3RhdHVzbXNnXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcIndpZHRoOjM1JVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2Rldi9pbWcvbG9nby5wbmdcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcIndpZHRoOjM1JVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wic3R5bGVcIjpcImZvbnQtc2l6ZTogeC1sYXJnZTtmb250LXdlaWdodDpib2xkO1wifSxcImZcIjpbXCJFLVRJQ0tFVFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wic3R5bGVcIjpcIndpZHRoOjMwJVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcInN0eWxlXCI6XCIgdGV4dC1hbGlnbjogaW5pdGlhbDtmbG9hdDogcmlnaHQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W1wiQ2hlYXBUaWNrZXQuaW4gOiBDdXN0b21lciBTdXBwb3J0XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOltcIkVtYWlsOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwibWFpbHRvOkNTQENoZWFwVGlja2V0LmluXCJ9LFwiZlwiOltcIkNTQENoZWFwVGlja2V0LmluXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOltcIlBob25lXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJ0ZWw6MDEyMC00ODg3Nzc3XCJ9LFwiZlwiOltcIjAxMjAtNDg4Nzc3N1wiXX1dfV19XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucHJpbnRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiZ3JvdXAgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlIHRpdGxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5zb3VyY2VcIn0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRvXCIsXCJzdHlsZVwiOlwibWFyZ2luLXRvcDogM3B4O1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJib29raW5ncy4wLmRlc3RpbmF0aW9uXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuc291cmNlXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJiYWNrXCIsXCJzdHlsZVwiOlwibWFyZ2luLXRvcDogM3B4O1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJib29raW5ncy4wLmRlc3RpbmF0aW9uXCJ9XX1dLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaXNNdWx0aUNpdHlcIl0sXCJzXCI6XCJfMD09XFxcImZhbHNlXFxcIlwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInNvdXJjZVwifSxcIsKgIHwgwqBcIl0sXCJpXCI6XCJpXCIsXCJyXCI6XCJib29raW5nc1wifSxcIiBcIix7XCJ0XCI6MixcInJ4XCI6e1wiclwiOlwiYm9va2luZ3NcIixcIm1cIjpbe1wiclwiOltcImJvb2tpbmdzLmxlbmd0aFwiXSxcInNcIjpcIl8wLTFcIn0sXCJkZXN0aW5hdGlvblwiXX19XX1dLFwieFwiOntcInJcIjpbXCJpc011bHRpQ2l0eVwiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGF0ZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImJvb2tpbmdzLjAuZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6W1wic3RhdHVzIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3NcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdfc3RhdHVzbXNnXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWlkXCJ9LFwiZlwiOltcIkJvb2tpbmcgSWQ6IFwiLHtcInRcIjoyLFwiclwiOlwiaWRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va2luZy1kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ0RhdGVcIixcImNyZWF0ZWRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzaXh0ZWVuIHdpZGUgY29sdW1uIFwiLFwic3R5bGVcIjpcImhlaWdodDogYXV0byAhaW1wb3J0YW50O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudCBmbGlnaHQtaXRpbmVyYXJ5IGNvbXBhY3QgZGFya1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGl0bGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjaXR5XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInNvdXJjZVwifSxcIiDihpIgXCIse1widFwiOjIsXCJyXCI6XCJkZXN0aW5hdGlvblwifV19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlMlwiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidGltZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHR0aW1lXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlZ21lbnRzXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImFcIjp7XCJjbGFzc1wiOlwiZGl2aWRlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIsKgXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwibGF5b3ZlclwifSxcImZcIjpbXCJMYXlvdmVyOiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZGlmZlwiLFwia1wiLFwialwiLFwiYm9va2luZ3NcIl0sXCJzXCI6XCJfMChfM1tfMl0ucm91dGVzW18xXS5kZXBhcnR1cmUsXzNbXzJdLnJvdXRlc1tfMS0xXS5hcnJpdmFsKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImtcIl0sXCJzXCI6XCJfMD4wXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiY2Fycmllci1sb2dvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0b3AgYWxpZ25lZCBhdmF0YXIgaW1hZ2VcIixcInNyY1wiOltcIi9pbWcvYWlyX2xvZ29zL1wiLHtcInRcIjoyLFwiclwiOlwiY2FycmllclwifSxcIi5wbmdcIl0sXCJhbHRcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVyTmFtZVwifV0sXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLW5hbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllck5hbWVcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJcIn0sXCItXCIse1widFwiOjIsXCJyXCI6XCJmbGlnaHROdW1iZXJcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImZyb21cIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiByaWdodDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm9yaWdpblwifSxcIjpcIl19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlM1wiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJkZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wic3R5bGVcIjpcInRleHQtYWxpZ246IHJpZ2h0O1wiLFwiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwib3JpZ2luRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJmbGlnaHRcIn0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwidG9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uXCJ9LFwiOlwiXX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGUzXCIsXCJhcnJpdmFsXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJhcnJpdmFsXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJwb3J0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lLW4tY2FiaW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0dGltZVwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwidHJhdmVsbGVyXCIse1wiclwiOltdLFwic1wiOlwiMFwifSxcImNhYmluXCJdfX1dfV19XX1dLFwiaVwiOlwia1wiLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwicm91dGVzXCJdfX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzZW5nZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIlBhc3NlbmdlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIkNSUyBQTlJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJBaXIgUE5SXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJmXCI6W1wiVGlja2V0IE5vLlwiXX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidGl0bGVcIn0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJmaXJzdF9uYW1lXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibGFzdF9uYW1lXCJ9LFwiIChcIix7XCJ0XCI6MixcInJcIjpcInR5cGVcIn0sXCIpIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6W1wic3RhdHVzIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJ0cmF2ZWxsZXJCb29raW5nU3RhdHVzXCIsXCJzdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwic3RhdHVzbXNnXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImNyc19wbnJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYWlybGluZV9wbnJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidGlja2V0XCJ9XX1dfV19XSxcImlcIjpcInRcIixcInJ4XCI6e1wiclwiOlwiYm9va2luZ3NcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwialwifSxcInRyYXZlbGxlclwiXX19XX1dfV0sXCJpXCI6XCJqXCIsXCJyXCI6XCJib29raW5nc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b3RhbFwifSxcImZcIjpbXCJUT1RBTCBQUklDRTogXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY3VyZW5jeVwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY29udmVydFwiLFwidG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGF4ZXNcIn0sXCJmXCI6W1wiQmFzaWMgRmFyZSA6IFwiLHtcInRcIjoyLFwiclwiOlwiYmFzZXByaWNlXCJ9LFwiICwgVGF4ZXMgOiBcIix7XCJ0XCI6MixcInJcIjpcInRheGVzXCJ9LFwiICwgRmVlIDogXCIse1widFwiOjIsXCJyXCI6XCJmZWVcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wic3R5bGVcIjpcImNsZWFyOiBib3RoO1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzZW5nZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiYVwiOntcImNvbHNwYW5cIjpcIjJcIn0sXCJmXCI6W1wiVGVybXMgYW5kIENvbmRpdGlvbnNcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkFsbCBmbGlnaHQgdGltaW5ncyBzaG93biBhcmUgbG9jYWwgdGltZXMuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiVXNlIFwiLHtcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOltcIlJlZiBOby5cIl19LFwiIGZvciBjb21tdW5pY2F0aW9uIHdpdGggdXMuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiVXNlIFwiLHtcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOltcIkFpcmxpbmUgUE5SXCJdfSxcIiBmb3IgY29udGFjdGluZyB0aGUgQWlybGluZXMuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiQ2FycnkgYSBwcmludC1vdXQgb2YgZS10aWNrZXQgZm9yIGNoZWNrLWluLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkluIGNhc2Ugb2Ygbm8tc2hvdywgdGlja2V0cyBhcmUgbm9uLXJlZnVuZGFibGUuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiRW5zdXJlIHlvdXIgcGFzc3BvcnQgaXMgdmFsaWQgZm9yIG1vcmUgdGhhbiA2IG1vbnRocy5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJQbGVhc2UgY2hlY2sgVHJhbnNpdCAmIERlc3RpbmF0aW9uIFZpc2EgUmVxdWlyZW1lbnQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiRm9yIGNhbmNlbGxhdGlvbiwgYWlybGluZSBjaGFyZ2VzICYgc2VyLiBmZWUgYXBwbHkuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiQWxsIHBheW1lbnRzIGFyZSBjaGFyZ2VkIGluIElOUi4gSWYgYW55IG90aGVyIGN1cnJlbmN5IGhhcyBiZWVuIGNob3NlbiB0aGUgcHJpY2UgaW4gdGhhdCBjdXJyZW5jeSBpcyBvbmx5IGluZGljYXRpdmUuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiVGhlIElOUiBwcmljZSBpcyB0aGUgZmluYWwgcHJpY2UuXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJDYXJyeSBhIHBob3RvIElELyBQYXNzcG9ydCBmb3IgY2hlY2staW4uXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiTWVhbHMsIFNlYXQgJiBTcGVjaWFsIFJlcXVlc3RzIGFyZSBub3QgZ3VhcmFudGVlZC5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJQcmVzZW50IEZyZXF1ZW50IEZsaWVyIENhcmQgYXQgY2hlY2staW4uXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiQ2FycmlhZ2UgaXMgc3ViamVjdCB0byBBaXJsaW5lcyBUZXJtcyAmIENvbmRpdGlvbnMuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiRW5zdXJlIHBhc3NlbmdlciBuYW1lcyBhcmUgY29ycmVjdCwgbmFtZSBjaGFuZ2UgaXMgbm90IHBlcm1pdHRlZC5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJGb3IgYW55IGNoYW5nZSBBaXJsaW5lIGNoYXJnZXMsIGRpZmZlcmVuY2Ugb2YgZmFyZSAmIHNlci4gZmVlIGFwcGx5LlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIllvdSBtaWdodCBiZSBhc2tlZCB0byBwcm92aWRlIGNhcmQgY29weSAmIElEIHByb29mIG9mIGNhcmQgaG9sZGVyLlwiXX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjogYm90aDtcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIlwifSxcImZcIjpbXCJEaXNjbGFpbWVyOiBDaGVhcFRpY2tldCBpcyBub3QgbGlhYmxlIGZvciBhbnkgZGVmaWNpZW5jeSBpbiBzZXJ2aWNlIGJ5IEFpcmxpbmUgb3IgU2VydmljZSBwcm92aWRlcnMuXCJdfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5wcmludFwifV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzY3JpcHRcIixcImFcIjp7XCJ0eXBlXCI6XCJ0ZXh0L2phdmFzY3JpcHRcIn0sXCJmXCI6W1wid2luZG93Lml4aVRyYW5zYWN0aW9uVHJhY2tlciA9IGZ1bmN0aW9uKHRhZykge1xcclxcbmZ1bmN0aW9uIHVwZGF0ZVJlZGlyZWN0KHRhZywgdHJhbnNhY3Rpb25JRCwgcG5yLCBzYWxlVmFsdWUsIHNlZ21lbnROaWdodHMpIHtcXHJcXG5yZXR1cm4gXFxcIjxpbWcgc3R5bGU9J3RvcDotOTk5OTk5cHg7bGVmdDotOTk5OTk5cHg7cG9zaXRpb246YWJzb2x1dGUnIHNyYz0naHR0cHM6Ly93d3cuaXhpZ28uY29tL2l4aS1hcGkvdHJhY2tlci91cGRhdGVDb252ZXJzaW9uL1xcXCIgKyB0YWcgKyBcXFwiP3RyYW5zYWN0aW9uSWQ9XFxcIiArIHRyYW5zYWN0aW9uSUQgKyBcXFwiJnBucj1cXFwiICsgcG5yICsgXFxcIiZzYWxlVmFsdWU9XFxcIiArIHNhbGVWYWx1ZSArIFxcXCImc2VnbWVudE5pZ2h0cz1cXFwiICsgc2VnbWVudE5pZ2h0cyArIFxcXCInIC8+XFxcIjtcXHJcXG59XFxyXFxuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgKz0gdXBkYXRlUmVkaXJlY3QodGFnLCBcXFwiXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZFwifSxcIlxcXCIsIFxcXCJcIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmJvb2tpbmdzLjAudHJhdmVsbGVyLjAuYWlybGluZV9wbnJcIn0sXCJcXFwiLCBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY29udmVydEl4aWdvXCIsXCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy50b3RhbEFtb3VudFwiXSxcInNcIjpcIl8wKF8xKVwifX0sXCIsIFwiLHtcInRcIjoyLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuc2VnTmlnaHRzXCJ9LFwiICk7XFxyXFxufTtcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic2NyaXB0XCIsXCJhXCI6e1wic3JjXCI6XCJodHRwczovL3d3dy5peGlnby5jb20vaXhpLWFwaS90cmFja2VyL3RyYWNrMTk2XCIsXCJpZFwiOlwidHJhY2tlclwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLmNsaWVudFNvdXJjZUlkXCJdLFwic1wiOlwiXzA9PTRcIn19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5wcmludFwiXSxcInNcIjpcIiFfMFwifX1dfV0sXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlsc1wifV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9kZXRhaWxzLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyNTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gNCA1XG4gKiovIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGVzcy93ZWIvbW9kdWxlcy9ndWVzdGZpbHRlci5sZXNzXG4gKiogbW9kdWxlIGlkID0gMjU1XG4gKiogbW9kdWxlIGNodW5rcyA9IDRcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9