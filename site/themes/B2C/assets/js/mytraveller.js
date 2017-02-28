webpackJsonp([9],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(383);


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

/***/ 379:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 383:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  Mytraveller = __webpack_require__(384);
	     
	     __webpack_require__(379);
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

/***/ 384:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	   // Mytraveller = require('app/stores/mytraveller/mytraveller')
	    Mytraveller = __webpack_require__(385),
	    Meta = __webpack_require__(60)
	    //,
	   // User = require('stores/user/user')
	    ;
	
	//require('modules/mytraveller/mytraveller.less');
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(386),
	
	    components: {
	        'layout': __webpack_require__(72),
	        'traveller-form': __webpack_require__(387),
	        travellerview: __webpack_require__(389),
	        travellerlist: __webpack_require__(391),
	     //   leftpanel:require('components/layouts/profile_sidebar')
	      //  profilesidebar: require('../layouts/profile_sidebar')
	    },
	    partials: {
	        'base-panel': __webpack_require__(105)
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

/***/ 385:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(30),
	    Q = __webpack_require__(26),
	    $ = __webpack_require__(33),
	    moment = __webpack_require__(44),
	    validate = __webpack_require__(62)
	    
	    ;
	
	var Store = __webpack_require__(55)  ;
	
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
	    //console.log(JSON.stringify(data));
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

/***/ 386:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"box my-travellers"},"f":[{"t":7,"e":"div","a":{"class":"left"},"f":[{"t":7,"e":"div","a":{"id":"currentTraveler"},"f":[{"t":4,"f":[{"t":7,"e":"travellerview","a":{"mytraveller":[{"t":2,"r":"mytraveller"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"x":{"r":["mytraveller.add","mytraveller.edit"],"s":"!_0&&!_1"}},{"t":4,"n":51,"f":[{"t":7,"e":"traveller-form","a":{"mytraveller":[{"t":2,"r":"mytraveller"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["mytraveller.add","mytraveller.edit"],"s":"!_0&&!_1"}}]}]}," ",{"t":7,"e":"travellerlist","a":{"mytraveller":[{"t":2,"r":"mytraveller"}],"meta":[{"t":2,"r":"meta"}]}}]}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 387:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        _ = __webpack_require__(30),
	        moment = __webpack_require__(44),
	        Mytraveller = __webpack_require__(385)
	        ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(388),
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
	            error: null,
	            _:_,
	            state: {
	            },
	            //  meta: require('app/stores/meta').instance(),
	
	            formatTitles: function (titles) {
	                var data = _.cloneDeep(titles);
	
	                return _.map(data, function (i) {
	                    return {id: i.id, text: i.name};
	                });
	            },
	            formatCountries: function (countries) {
	                var data = _.cloneDeep(countries);
	
	                return _.map(data, function (i) {
	                    return {id: i.id, text: i.name};
	                });
	            },
	        }
	    },
	    oninit: function (options) {
	        var date;
	
	        if (this.get('mytraveller.currentTraveller') != null) {
	            date = this.get('mytraveller.currentTraveller.birthdate');
	            if (date != null && date != '') {
	                if (moment.isMoment(date)) {
	                    this.get('mytraveller').set('currentTraveller.birthdate', date);
	                } else {
	                    this.get('mytraveller').set('currentTraveller.birthdate', moment(date, 'YYYY-MM-DD'));
	                }
	            }
	        }
	        this.on('add', function (event) {
	
	            var newtraveller = this.get('mytraveller.currentTraveller');
	            if (newtraveller === null) {
	                return;
	            }
	            var travellers = this.get('mytraveller.travellers');
	            var birthdate = newtraveller.birthdate;
	            if (moment.isMoment(birthdate)) {
	                // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
	                birthdate = birthdate.format('YYYY-MM-DD');
	            }
	
	            var currenttraveller = {title: newtraveller.title, email: newtraveller.email, mobile: newtraveller.mobile, first_name: newtraveller.first_name,
	                last_name: newtraveller.last_name, birthdate: birthdate, baseUrl: '', passport_number: newtraveller.passport_number, passport_place: newtraveller.passport_place, passport_country_id: newtraveller.passport_country_id
	            };
	
	            $.ajax({
	                context: this,
	                type: 'POST',
	                url: '/b2c/traveler/create',
	                dataType: 'json',
	                data: {'data': JSON.stringify(currenttraveller)},
	                success: function (idd) {
	                    //console.log(idd);
	                    if (idd.result== 'error') {
	                        this.set('error', idd.message);
	                    } else {
	                        this.set('error', null);
	                        currenttraveller.id = idd.traveler_id;
	                        travellers.push(currenttraveller);
	                        this.get('mytraveller').set('travellers', travellers);
	                        this.get('mytraveller').set('currentTraveller', currenttraveller);
	                        this.get('mytraveller').set('currentTravellerId', currenttraveller.id);
	                        this.get('mytraveller').set('add', false);
	                    }
	                }
	            });
	        });
	
	        this.on('edit', function (event) {
	            var newtraveller = this.get('mytraveller.currentTraveller'),
	                travellers = this.get('mytraveller.travellers'),
	                birthdate = newtraveller.birthdate,
	                id = this.get('mytraveller.currentTraveller.id');
	            if (moment.isMoment(birthdate)) {
	                birthdate = birthdate.format('YYYY-MM-DD');
	            }
	            var currenttraveller = {id: id, title: newtraveller.title, email: newtraveller.email, mobile: newtraveller.mobile, first_name: newtraveller.first_name,
	                last_name: newtraveller.last_name, birthdate: birthdate, baseUrl: '', passport_number: newtraveller.passport_number, passport_place: newtraveller.passport_place, passport_country_id: newtraveller.passport_country_id
	            };
	            var update = function (arr, key, newval) {
	                var match = _.find(arr, key);
	                if (match)
	                    _.merge(match, newval);
	
	            };
	            $.ajax({
	                context: this,
	                type: 'POST',
	                url: '/b2c/traveler/update/' + _.parseInt(id),
	                dataType: 'json',
	                data: {'data': JSON.stringify(currenttraveller)},
	                success: function (idd) {
	                    if (idd.result == 'success') {
	                        _.mixin({'$update': update});
	                        _.$update(travellers, {id: id}, currenttraveller);
	                        this.get('mytraveller').set('travellers', travellers);
	                        this.get('mytraveller').set('currentTraveller', currenttraveller);
	                        this.get('mytraveller').set('currentTravellerId', id);
	                        this.get('mytraveller').set('edit', false);
	                    } else {
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

/***/ 388:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"form","a":{"action":"javascript:;","class":"ui form basic segment flight search"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[" ",{"t":7,"e":"div","a":{"class":"ui grid"},"f":[{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Personal Details"]}," ",{"t":7,"e":"table","f":[{"t":4,"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Title"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"mytraveller.currentTraveller.title"}],"class":"fluid transparent","placeholder":"Title","options":[{"t":2,"x":{"r":["formatTitles","meta.titles"],"s":"_0(_1)"}}],"error":[{"t":2,"r":"error.title"}]},"f":[]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.title"}],"n":50,"r":"error.title"}]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["First Name"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-input","a":{"name":"first_name","placeholder":"First Name","value":[{"t":2,"r":"mytraveller.currentTraveller.first_name"}],"error":[{"t":2,"r":"error.first_name"}]},"f":[]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.first_name"}],"n":50,"r":"error.first_name"}]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Last Name"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-input","a":{"name":"last_name","placeholder":"Last Name","value":[{"t":2,"r":"mytraveller.currentTraveller.last_name"}],"error":[{"t":2,"r":"error.last_name"}]},"f":[]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.last_name"}],"n":50,"r":"error.last_name"}]}]}]}],"n":50,"x":{"r":["mytraveller.add","mytraveller.edit"],"s":"_0||_1"}}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Date of Birth:"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-date","a":{"value":[{"t":2,"r":"mytraveller.currentTraveller.birthdate"}],"class":"fluid","large":"0","placeholder":"Date of Birth","changeyear":"1","error":[{"t":2,"r":"error.birthdate"}]},"f":[]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.birthdate"}],"n":50,"r":"error.birthdate"}]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Passport Country:"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"mytraveller.currentTraveller.passport_country_id"}],"class":"fluid transparent","placeholder":"Country","options":[{"t":2,"x":{"r":["formatCountries","meta.countries"],"s":"_0(_1)"}}],"error":[{"t":2,"r":"error.passport_country_id"}]},"f":[]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.passport_country_id"}],"n":50,"r":"error.passport_country_id"}]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Passport No:"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-input","a":{"name":"passport_number","placeholder":"Passport No","value":[{"t":2,"r":"mytraveller.currentTraveller.passport_number"}],"error":[{"t":2,"r":"error.passport_number"}]},"f":[]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.passport_number"}],"n":50,"r":"error.passport_number"}]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Issued Place:"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"passport_place","placeholder":"Issued Place","value":[{"t":2,"r":"mytraveller.currentTraveller.passport_place"}],"error":[{"t":2,"r":"error.passport_place"}]},"f":[]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.passport_place"}],"n":50,"r":"error.passport_place"}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Contact Details"]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Email Address:"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-email","a":{"name":"email","placeholder":"E-Mail","value":[{"t":2,"r":"mytraveller.currentTraveller.email"}],"error":[{"t":2,"r":"error.email"}]}}," "]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.email"}],"n":50,"r":"error.email"}]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Mobile Number:"]}," ",{"t":7,"e":"td","f":[" ",{"t":7,"e":"ui-tel","a":{"name":"mobile","placeholder":"Mobile","value":[{"t":2,"r":"mytraveller.currentTraveller.mobile"}],"error":[{"t":2,"r":"error.mobile"}]}}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":4,"f":[{"t":2,"r":"error.mobile"}],"n":50,"r":"error.mobile"}]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"one column row"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui small field negative message","style":"display:block"},"f":[{"t":2,"r":"error.user_info_id"}]}],"n":50,"r":"error.user_info_id"}," ",{"t":4,"f":[{"t":7,"e":"div","v":{"click":"add"},"a":{"class":"ui button massive fluid"},"f":["Add Traveller"]}],"n":50,"r":"mytraveller.add"}," ",{"t":4,"f":[{"t":7,"e":"div","v":{"click":"edit"},"a":{"class":"ui button massive fluid"},"f":["Edit Traveller"]}," "],"n":50,"r":"mytraveller.edit"}]}]}]}]}]};

/***/ },

/***/ 389:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        moment = __webpack_require__(44),
	        _ = __webpack_require__(30)
	        //,
	        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(390),
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
	            formatCountry: function (country) {
	                var countries = this.get('meta').get('countries');
	                //console.log(titles);
	                // console.log(title);
	                return  _.result(_.find(countries, {'id': country}), 'name');
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

/***/ 390:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"h1","f":["People you book travel for"]}," ",{"t":7,"e":"button","v":{"click":"add"},"a":{"class":"middle blue add-new"},"f":["Add New Traveller"]}," ",{"t":7,"e":"div","a":{"class":[{"t":4,"f":["ui segment loading"],"n":50,"r":"mytraveller.pending"}],"style":"min-height:50px"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"user-info"},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"mytraveller.currentTraveller.baseUrl"},"/themes/B2C/img/guest.png"],"alt":""}}," ",{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"x":{"r":["formatTitle","mytraveller.currentTraveller.title"],"s":"_0(_1)"}}," ",{"t":2,"r":"mytraveller.currentTraveller.first_name"}," ",{"t":2,"r":"mytraveller.currentTraveller.last_name"}]}," ",{"t":7,"e":"div","a":{"class":"phone"},"f":["Mobile No: ",{"t":2,"r":"mytraveller.currentTraveller.mobile"}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"button","v":{"click":"edit"},"a":{"class":"small gray"},"f":["Edit"]}," ",{"t":7,"e":"button","v":{"click":"delete"},"a":{"class":"small gray","style":"background-color:red;color:white"},"f":["Delete"]}," "]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Contact Details"]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Email Address:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.email"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Mobile Number:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.mobile"}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["Personal Details"]}," ",{"t":7,"e":"table","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Date of Birth:"]}," ",{"t":7,"e":"td","f":[{"t":2,"x":{"r":["formatBirthDate","mytraveller.currentTraveller.birthdate"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Passport No:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.passport_number"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Passport Country:"]}," ",{"t":7,"e":"td","f":[{"t":2,"x":{"r":["formatCountry","mytraveller.currentTraveller.passport_country_id"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Issued Place:"]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"mytraveller.currentTraveller.passport_place"}]}]}]}]}],"n":50,"r":"mytraveller.currentTraveller"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"h2","f":["No Traveller Added"]}]}],"r":"mytraveller.currentTraveller"}],"n":50,"x":{"r":["mytraveller.pending"],"s":"!_0"}}]}]};

/***/ },

/***/ 391:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	    moment = __webpack_require__(44),
	    _ = __webpack_require__(30),
	   Mytraveller = __webpack_require__(65)   
	    ;
	
	
	var t2m = function(time) {
	    var i = time.split(':');
	
	    return i[0]*60+i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(392),
	
	
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

/***/ 392:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"right"},"f":[{"t":7,"e":"h2","f":["My Travellers"]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":["No Traveller Found."]}],"n":50,"x":{"r":["mytraveller.travellers.length"],"s":"_0==0"}}," ",{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"test","a":{"r":["id"],"s":"[_0]"}}},"a":{"class":["item ",{"t":4,"f":["active"],"n":50,"x":{"r":["mytraveller.currentTraveller.id","id"],"s":"_0==_1"}}],"id":[{"t":2,"r":"id"}]},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"baseUrl"},"/themes/B2C/img/guest.png"],"alt":""}}," ",{"t":2,"r":"first_name"}," ",{"t":2,"r":"last_name"}]}],"n":52,"r":"mytraveller.travellers"}]}]};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanM/ZjZiNSoqKioqKiIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qcz8wYmJhKioqKioqIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qcz9lOWY0KioiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL2VtYWlsLmpzPzQ5NDYqKiIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvbWFpbGNoZWNrL3NyYy9tYWlsY2hlY2suanM/NGQ2ZioqIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9zcGlubmVyLmpzPzQwOWMqKiIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL3NwaW5uZXIuaHRtbD9hMTU3KioiLCJ3ZWJwYWNrOi8vLy4vanMvY29yZS9mb3JtL3RlbC5qcz9mNWNhIiwid2VicGFjazovLy8uL3ZlbmRvci9pbnRsLXRlbC1pbnB1dC9idWlsZC9qcy9pbnRsVGVsSW5wdXQuanM/ZmIzYyIsIndlYnBhY2s6Ly8vLi9sZXNzL3dlYi9tb2R1bGVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyLmxlc3M/Njc5YiIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL215dHJhdmVsbGVyLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215dHJhdmVsbGVyL3RyYXZlbGVyLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvZm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvZm9ybS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvdmlldy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvdmlldy5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvbGlzdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQyxNQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU07QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWEsNERBQTREO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBa0QsS0FBSyxJQUFJLG9CQUFvQjtBQUMvRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQixjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsTUFBSztB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RSxTQUFTO0FBQ2pGO0FBQ0EsVTs7QUFFQSxNQUFLOztBQUVMOztBQUVBO0FBQ0EsRUFBQyxFOzs7Ozs7O0FDaEZELGlCQUFnQixZQUFZLHFCQUFxQixnQkFBZ0IsT0FBTyxxQ0FBcUMsTUFBTSxZQUFZLHFCQUFxQixlQUFlLDZCQUE2QixjQUFjLG1EQUFtRCxNQUFNLFlBQVkscUJBQXFCLFNBQVMsZ0JBQWdCLHdCQUF3QixNQUFNLGtCQUFrQixpQ0FBaUMsMkRBQTJELFNBQVMsZUFBZSxFQUFFLE9BQU8scUJBQXFCLFFBQVEsb0JBQW9CLHdDQUF3QyxNQUFNLHVCQUF1QixNQUFNLHNCQUFzQixFQUFFLHNDQUFzQyxFQUFFLEciLCJmaWxlIjoianMvbXl0cmF2ZWxsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAgICAgVmFsaWRhdGUuanMgMC43LjFcblxuLy8gICAgIChjKSAyMDEzLTIwMTUgTmlja2xhcyBBbnNtYW4sIDIwMTMgV3JhcHBcbi8vICAgICBWYWxpZGF0ZS5qcyBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8vICAgICBGb3IgYWxsIGRldGFpbHMgYW5kIGRvY3VtZW50YXRpb246XG4vLyAgICAgaHR0cDovL3ZhbGlkYXRlanMub3JnL1xuXG4oZnVuY3Rpb24oZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVGhlIG1haW4gZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzLlxuICAvLyBUaGUgb3B0aW9ucyBhcmUgdGhlIGZvbGxvd2luZzpcbiAgLy8gICAtIGZvcm1hdCAoc3RyaW5nKSAtIEFuIG9wdGlvbiB0aGF0IGNvbnRyb2xzIGhvdyB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZm9ybWF0dGVkXG4gIC8vICAgICAqIGZsYXQgLSBSZXR1cm5zIGEgZmxhdCBhcnJheSBvZiBqdXN0IHRoZSBlcnJvciBtZXNzYWdlc1xuICAvLyAgICAgKiBncm91cGVkIC0gUmV0dXJucyB0aGUgbWVzc2FnZXMgZ3JvdXBlZCBieSBhdHRyaWJ1dGUgKGRlZmF1bHQpXG4gIC8vICAgICAqIGRldGFpbGVkIC0gUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcmF3IHZhbGlkYXRpb24gZGF0YVxuICAvLyAgIC0gZnVsbE1lc3NhZ2VzIChib29sZWFuKSAtIElmIGB0cnVlYCAoZGVmYXVsdCkgdGhlIGF0dHJpYnV0ZSBuYW1lIGlzIHByZXBlbmRlZCB0byB0aGUgZXJyb3IuXG4gIC8vXG4gIC8vIFBsZWFzZSBub3RlIHRoYXQgdGhlIG9wdGlvbnMgYXJlIGFsc28gcGFzc2VkIHRvIGVhY2ggdmFsaWRhdG9yLlxuICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucylcbiAgICAgICwgYXR0clxuICAgICAgLCB2YWxpZGF0b3I7XG5cbiAgICBmb3IgKGF0dHIgaW4gcmVzdWx0cykge1xuICAgICAgZm9yICh2YWxpZGF0b3IgaW4gcmVzdWx0c1thdHRyXSkge1xuICAgICAgICBpZiAodi5pc1Byb21pc2UocmVzdWx0c1thdHRyXVt2YWxpZGF0b3JdKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVzZSB2YWxpZGF0ZS5hc3luYyBpZiB5b3Ugd2FudCBzdXBwb3J0IGZvciBwcm9taXNlc1wiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdGUucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHZhciB2ID0gdmFsaWRhdGU7XG5cbiAgLy8gQ29waWVzIG92ZXIgYXR0cmlidXRlcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZXMgdG8gYSBzaW5nbGUgZGVzdGluYXRpb24uXG4gIC8vIFZlcnkgbXVjaCBzaW1pbGFyIHRvIHVuZGVyc2NvcmUncyBleHRlbmQuXG4gIC8vIFRoZSBmaXJzdCBhcmd1bWVudCBpcyB0aGUgdGFyZ2V0IG9iamVjdCBhbmQgdGhlIHJlbWFpbmluZyBhcmd1bWVudHMgd2lsbCBiZVxuICAvLyB1c2VkIGFzIHRhcmdldHMuXG4gIHYuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBhdHRyIGluIHNvdXJjZSkge1xuICAgICAgICBvYmpbYXR0cl0gPSBzb3VyY2VbYXR0cl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICB2LmV4dGVuZCh2YWxpZGF0ZSwge1xuICAgIC8vIFRoaXMgaXMgdGhlIHZlcnNpb24gb2YgdGhlIGxpYnJhcnkgYXMgYSBzZW12ZXIuXG4gICAgLy8gVGhlIHRvU3RyaW5nIGZ1bmN0aW9uIHdpbGwgYWxsb3cgaXQgdG8gYmUgY29lcmNlZCBpbnRvIGEgc3RyaW5nXG4gICAgdmVyc2lvbjoge1xuICAgICAgbWFqb3I6IDAsXG4gICAgICBtaW5vcjogNyxcbiAgICAgIHBhdGNoOiAxLFxuICAgICAgbWV0YWRhdGE6IG51bGwsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdi5mb3JtYXQoXCIle21ham9yfS4le21pbm9yfS4le3BhdGNofVwiLCB2LnZlcnNpb24pO1xuICAgICAgICBpZiAoIXYuaXNFbXB0eSh2LnZlcnNpb24ubWV0YWRhdGEpKSB7XG4gICAgICAgICAgdmVyc2lvbiArPSBcIitcIiArIHYudmVyc2lvbi5tZXRhZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQmVsb3cgaXMgdGhlIGRlcGVuZGVuY2llcyB0aGF0IGFyZSB1c2VkIGluIHZhbGlkYXRlLmpzXG5cbiAgICAvLyBUaGUgY29uc3RydWN0b3Igb2YgdGhlIFByb21pc2UgaW1wbGVtZW50YXRpb24uXG4gICAgLy8gSWYgeW91IGFyZSB1c2luZyBRLmpzLCBSU1ZQIG9yIGFueSBvdGhlciBBKyBjb21wYXRpYmxlIGltcGxlbWVudGF0aW9uXG4gICAgLy8gb3ZlcnJpZGUgdGhpcyBhdHRyaWJ1dGUgdG8gYmUgdGhlIGNvbnN0cnVjdG9yIG9mIHRoYXQgcHJvbWlzZS5cbiAgICAvLyBTaW5jZSBqUXVlcnkgcHJvbWlzZXMgYXJlbid0IEErIGNvbXBhdGlibGUgdGhleSB3b24ndCB3b3JrLlxuICAgIFByb21pc2U6IHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiID8gUHJvbWlzZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICAvLyBJZiBtb21lbnQgaXMgdXNlZCBpbiBub2RlLCBicm93c2VyaWZ5IGV0YyBwbGVhc2Ugc2V0IHRoaXMgYXR0cmlidXRlXG4gICAgLy8gbGlrZSB0aGlzOiBgdmFsaWRhdGUubW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbiAgICBtb21lbnQ6IHR5cGVvZiBtb21lbnQgIT09IFwidW5kZWZpbmVkXCIgPyBtb21lbnQgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgWERhdGU6IHR5cGVvZiBYRGF0ZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFhEYXRlIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIEVNUFRZX1NUUklOR19SRUdFWFA6IC9eXFxzKiQvLFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzIG9iamVjdC5cbiAgICAvLyBXaWxsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgZm9ybWF0OlxuICAgIC8vICAgICBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlIG5hbWU+XCIsIGVycm9yOiBcIjx2YWxpZGF0aW9uIHJlc3VsdD5cIn0sIC4uLl1cbiAgICBydW5WYWxpZGF0aW9uczogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW11cbiAgICAgICAgLCBhdHRyXG4gICAgICAgICwgdmFsaWRhdG9yTmFtZVxuICAgICAgICAsIHZhbHVlXG4gICAgICAgICwgdmFsaWRhdG9yc1xuICAgICAgICAsIHZhbGlkYXRvclxuICAgICAgICAsIHZhbGlkYXRvck9wdGlvbnNcbiAgICAgICAgLCBlcnJvcjtcblxuICAgICAgaWYgKHYuaXNEb21FbGVtZW50KGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSB2LmNvbGxlY3RGb3JtVmFsdWVzKGF0dHJpYnV0ZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29wcyB0aHJvdWdoIGVhY2ggY29uc3RyYWludHMsIGZpbmRzIHRoZSBjb3JyZWN0IHZhbGlkYXRvciBhbmQgcnVuIGl0LlxuICAgICAgZm9yIChhdHRyIGluIGNvbnN0cmFpbnRzKSB7XG4gICAgICAgIHZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgYXR0cik7XG4gICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBjb25zdHJhaW50cyBmb3IgYW4gYXR0cmlidXRlIHRvIGJlIGEgZnVuY3Rpb24uXG4gICAgICAgIC8vIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICB2YWxpZGF0b3JzID0gdi5yZXN1bHQoY29uc3RyYWludHNbYXR0cl0sIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG5cbiAgICAgICAgZm9yICh2YWxpZGF0b3JOYW1lIGluIHZhbGlkYXRvcnMpIHtcbiAgICAgICAgICB2YWxpZGF0b3IgPSB2LnZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG5cbiAgICAgICAgICBpZiAoIXZhbGlkYXRvcikge1xuICAgICAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChcIlVua25vd24gdmFsaWRhdG9yICV7bmFtZX1cIiwge25hbWU6IHZhbGlkYXRvck5hbWV9KTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG4gICAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIG9wdGlvbnMgdG8gYmUgYSBmdW5jdGlvbi4gVGhlIGZ1bmN0aW9uIHdpbGwgYmVcbiAgICAgICAgICAvLyBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdi5yZXN1bHQodmFsaWRhdG9yT3B0aW9ucywgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcbiAgICAgICAgICBpZiAoIXZhbGlkYXRvck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgYXR0cmlidXRlOiBhdHRyLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JOYW1lLFxuICAgICAgICAgICAgb3B0aW9uczogdmFsaWRhdG9yT3B0aW9ucyxcbiAgICAgICAgICAgIGVycm9yOiB2YWxpZGF0b3IuY2FsbCh2YWxpZGF0b3IsIHZhbHVlLCB2YWxpZGF0b3JPcHRpb25zLCBhdHRyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSxcblxuICAgIC8vIFRha2VzIHRoZSBvdXRwdXQgZnJvbSBydW5WYWxpZGF0aW9ucyBhbmQgY29udmVydHMgaXQgdG8gdGhlIGNvcnJlY3RcbiAgICAvLyBvdXRwdXQgZm9ybWF0LlxuICAgIHByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0czogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgZXJyb3JzID0gdi5wcnVuZUVtcHR5RXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmV4cGFuZE11bHRpcGxlRXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmNvbnZlcnRFcnJvck1lc3NhZ2VzKGVycm9ycywgb3B0aW9ucyk7XG5cbiAgICAgIHN3aXRjaCAob3B0aW9ucy5mb3JtYXQgfHwgXCJncm91cGVkXCIpIHtcbiAgICAgICAgY2FzZSBcImRldGFpbGVkXCI6XG4gICAgICAgICAgLy8gRG8gbm90aGluZyBtb3JlIHRvIHRoZSBlcnJvcnNcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZmxhdFwiOlxuICAgICAgICAgIGVycm9ycyA9IHYuZmxhdHRlbkVycm9yc1RvQXJyYXkoZXJyb3JzKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiZ3JvdXBlZFwiOlxuICAgICAgICAgIGVycm9ycyA9IHYuZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZShlcnJvcnMpO1xuICAgICAgICAgIGZvciAoYXR0ciBpbiBlcnJvcnMpIHtcbiAgICAgICAgICAgIGVycm9yc1thdHRyXSA9IHYuZmxhdHRlbkVycm9yc1RvQXJyYXkoZXJyb3JzW2F0dHJdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Iodi5mb3JtYXQoXCJVbmtub3duIGZvcm1hdCAle2Zvcm1hdH1cIiwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdi5pc0VtcHR5KGVycm9ycykgPyB1bmRlZmluZWQgOiBlcnJvcnM7XG4gICAgfSxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRpb25zIHdpdGggc3VwcG9ydCBmb3IgcHJvbWlzZXMuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiBhIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIHdoZW4gYWxsIHRoZVxuICAgIC8vIHZhbGlkYXRpb24gcHJvbWlzZXMgaGF2ZSBiZWVuIGNvbXBsZXRlZC5cbiAgICAvLyBJdCBjYW4gYmUgY2FsbGVkIGV2ZW4gaWYgbm8gdmFsaWRhdGlvbnMgcmV0dXJuZWQgYSBwcm9taXNlLlxuICAgIGFzeW5jOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LmFzeW5jLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHYud2FpdEZvclJlc3VsdHMocmVzdWx0cykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZXJyb3JzID0gdi5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUoYXR0cmlidXRlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2luZ2xlOiBmdW5jdGlvbih2YWx1ZSwgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5zaW5nbGUub3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgICBmb3JtYXQ6IFwiZmxhdFwiLFxuICAgICAgICBmdWxsTWVzc2FnZXM6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2KHtzaW5nbGU6IHZhbHVlfSwge3NpbmdsZTogY29uc3RyYWludHN9LCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGFsbCBwcm9taXNlcyBpbiB0aGUgcmVzdWx0cyBhcnJheVxuICAgIC8vIGFyZSBzZXR0bGVkLiBUaGUgcHJvbWlzZSByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gaXMgYWx3YXlzIHJlc29sdmVkLFxuICAgIC8vIG5ldmVyIHJlamVjdGVkLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gbW9kaWZpZXMgdGhlIGlucHV0IGFyZ3VtZW50LCBpdCByZXBsYWNlcyB0aGUgcHJvbWlzZXNcbiAgICAvLyB3aXRoIHRoZSB2YWx1ZSByZXR1cm5lZCBmcm9tIHRoZSBwcm9taXNlLlxuICAgIHdhaXRGb3JSZXN1bHRzOiBmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAvLyBDcmVhdGUgYSBzZXF1ZW5jZSBvZiBhbGwgdGhlIHJlc3VsdHMgc3RhcnRpbmcgd2l0aCBhIHJlc29sdmVkIHByb21pc2UuXG4gICAgICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgcmVzdWx0KSB7XG4gICAgICAgIC8vIElmIHRoaXMgcmVzdWx0IGlzbid0IGEgcHJvbWlzZSBza2lwIGl0IGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgaWYgKCF2LmlzUHJvbWlzZShyZXN1bHQuZXJyb3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVtby50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZXJyb3IudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIC8vIElmIGZvciBzb21lIHJlYXNvbiB0aGUgdmFsaWRhdG9yIHByb21pc2Ugd2FzIHJlamVjdGVkIGJ1dCBub1xuICAgICAgICAgICAgICAvLyBlcnJvciB3YXMgc3BlY2lmaWVkLlxuICAgICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgdi53YXJuKFwiVmFsaWRhdG9yIHByb21pc2Ugd2FzIHJlamVjdGVkIGJ1dCBkaWRuJ3QgcmV0dXJuIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0sIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocikgeyByKCk7IH0pKTsgLy8gQSByZXNvbHZlZCBwcm9taXNlXG4gICAgfSxcblxuICAgIC8vIElmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIGNhbGw6IGZ1bmN0aW9uIHRoZSBhbmQ6IGZ1bmN0aW9uIHJldHVybiB0aGUgdmFsdWVcbiAgICAvLyBvdGhlcndpc2UganVzdCByZXR1cm4gdGhlIHZhbHVlLiBBZGRpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhc1xuICAgIC8vIGFyZ3VtZW50cyB0byB0aGUgZnVuY3Rpb24uXG4gICAgLy8gRXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByZXN1bHQoJ2ZvbycpIC8vICdmb28nXG4gICAgLy8gcmVzdWx0KE1hdGgubWF4LCAxLCAyKSAvLyAyXG4gICAgLy8gYGBgXG4gICAgcmVzdWx0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgdmFsdWUgaXMgYSBudW1iZXIuIFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgY29uc2lkZXIgTmFOIGFcbiAgICAvLyBudW1iZXIgbGlrZSBtYW55IG90aGVyIGBpc051bWJlcmAgZnVuY3Rpb25zIGRvLlxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIG5vdCBhIGZ1bmN0aW9uXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG4gICAgfSxcblxuICAgIC8vIEEgc2ltcGxlIGNoZWNrIHRvIHZlcmlmeSB0aGF0IHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLiBVc2VzIGBpc051bWJlcmBcbiAgICAvLyBhbmQgYSBzaW1wbGUgbW9kdWxvIGNoZWNrLlxuICAgIGlzSW50ZWdlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LmlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAlIDEgPT09IDA7XG4gICAgfSxcblxuICAgIC8vIFVzZXMgdGhlIGBPYmplY3RgIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhbiBvYmplY3QuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gICAgfSxcblxuICAgIC8vIFNpbXBseSBjaGVja3MgaWYgdGhlIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhIGRhdGVcbiAgICBpc0RhdGU6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERhdGU7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBgbnVsbGAgb2YgYHVuZGVmaW5lZGBcbiAgICBpc0RlZmluZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiBvYmogIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIHByb21pc2UuIEFueXRoaW5nIHdpdGggYSBgdGhlbmBcbiAgICAvLyBmdW5jdGlvbiBpcyBjb25zaWRlcmVkIGEgcHJvbWlzZS5cbiAgICBpc1Byb21pc2U6IGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiAhIXAgJiYgdi5pc0Z1bmN0aW9uKHAudGhlbik7XG4gICAgfSxcblxuICAgIGlzRG9tRWxlbWVudDogZnVuY3Rpb24obykge1xuICAgICAgaWYgKCFvKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2LmlzRnVuY3Rpb24oby5xdWVyeVNlbGVjdG9yQWxsKSB8fCAhdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChkb2N1bWVudCkgJiYgbyA9PT0gZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM4NDM4MC82OTkzMDRcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbyAmJlxuICAgICAgICAgIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgbyAhPT0gbnVsbCAmJlxuICAgICAgICAgIG8ubm9kZVR5cGUgPT09IDEgJiZcbiAgICAgICAgICB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gXCJzdHJpbmdcIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICAvLyBOdWxsIGFuZCB1bmRlZmluZWQgYXJlIGVtcHR5XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZnVuY3Rpb25zIGFyZSBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hpdGVzcGFjZSBvbmx5IHN0cmluZ3MgYXJlIGVtcHR5XG4gICAgICBpZiAodi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHYuRU1QVFlfU1RSSU5HX1JFR0VYUC50ZXN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIGFycmF5cyB3ZSB1c2UgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgaWYgKHYuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgICAgIH1cblxuICAgICAgLy8gRGF0ZXMgaGF2ZSBubyBhdHRyaWJ1dGVzIGJ1dCBhcmVuJ3QgZW1wdHlcbiAgICAgIGlmICh2LmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBmaW5kIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eSB3ZSBjb25zaWRlciBpdCBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICBmb3IgKGF0dHIgaW4gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gRm9ybWF0cyB0aGUgc3BlY2lmaWVkIHN0cmluZ3Mgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzIGxpa2Ugc286XG4gICAgLy8gYGBgXG4gICAgLy8gZm9ybWF0KFwiRm9vOiAle2Zvb31cIiwge2ZvbzogXCJiYXJcIn0pIC8vIFwiRm9vIGJhclwiXG4gICAgLy8gYGBgXG4gICAgLy8gSWYgeW91IHdhbnQgdG8gd3JpdGUgJXsuLi59IHdpdGhvdXQgaGF2aW5nIGl0IHJlcGxhY2VkIHNpbXBseVxuICAgIC8vIHByZWZpeCBpdCB3aXRoICUgbGlrZSB0aGlzIGBGb286ICUle2Zvb31gIGFuZCBpdCB3aWxsIGJlIHJldHVybmVkXG4gICAgLy8gYXMgYFwiRm9vOiAle2Zvb31cImBcbiAgICBmb3JtYXQ6IHYuZXh0ZW5kKGZ1bmN0aW9uKHN0ciwgdmFscykge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHYuZm9ybWF0LkZPUk1BVF9SRUdFWFAsIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgaWYgKG0xID09PSAnJScpIHtcbiAgICAgICAgICByZXR1cm4gXCIle1wiICsgbTIgKyBcIn1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHNbbTJdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwge1xuICAgICAgLy8gRmluZHMgJXtrZXl9IHN0eWxlIHBhdHRlcm5zIGluIHRoZSBnaXZlbiBzdHJpbmdcbiAgICAgIEZPUk1BVF9SRUdFWFA6IC8oJT8pJVxceyhbXlxcfV0rKVxcfS9nXG4gICAgfSksXG5cbiAgICAvLyBcIlByZXR0aWZpZXNcIiB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgIC8vIFByZXR0aWZ5aW5nIG1lYW5zIHJlcGxhY2luZyBbLlxcXy1dIHdpdGggc3BhY2VzIGFzIHdlbGwgYXMgc3BsaXR0aW5nXG4gICAgLy8gY2FtZWwgY2FzZSB3b3Jkcy5cbiAgICBwcmV0dGlmeTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAodi5pc051bWJlcihzdHIpKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMiBkZWNpbWFscyByb3VuZCBpdCB0byB0d29cbiAgICAgICAgaWYgKChzdHIgKiAxMDApICUgMSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgc3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KE1hdGgucm91bmQoc3RyICogMTAwKSAvIDEwMCkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodi5pc0FycmF5KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5tYXAoZnVuY3Rpb24ocykgeyByZXR1cm4gdi5wcmV0dGlmeShzKTsgfSkuam9pbihcIiwgXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRW5zdXJlIHRoZSBzdHJpbmcgaXMgYWN0dWFsbHkgYSBzdHJpbmdcbiAgICAgIHN0ciA9IFwiXCIgKyBzdHI7XG5cbiAgICAgIHJldHVybiBzdHJcbiAgICAgICAgLy8gU3BsaXRzIGtleXMgc2VwYXJhdGVkIGJ5IHBlcmlvZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbXlxcc10pXFwuKFteXFxzXSkvZywgJyQxICQyJylcbiAgICAgICAgLy8gUmVtb3ZlcyBiYWNrc2xhc2hlc1xuICAgICAgICAucmVwbGFjZSgvXFxcXCsvZywgJycpXG4gICAgICAgIC8vIFJlcGxhY2VzIC0gYW5kIC0gd2l0aCBzcGFjZVxuICAgICAgICAucmVwbGFjZSgvW18tXS9nLCAnICcpXG4gICAgICAgIC8vIFNwbGl0cyBjYW1lbCBjYXNlZCB3b3Jkc1xuICAgICAgICAucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgbTEgKyBcIiBcIiArIG0yLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cbiAgICBzdHJpbmdpZnlWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LnByZXR0aWZ5KHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKG9iaiwgdmFsdWUpIHtcbiAgICAgIGlmICghdi5pc0RlZmluZWQob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUgaW4gb2JqO1xuICAgIH0sXG5cbiAgICBnZXREZWVwT2JqZWN0VmFsdWU6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCkge1xuICAgICAgaWYgKCF2LmlzT2JqZWN0KG9iaikgfHwgIXYuaXNTdHJpbmcoa2V5cGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGtleSA9IFwiXCJcbiAgICAgICAgLCBpXG4gICAgICAgICwgZXNjYXBlID0gZmFsc2U7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlwYXRoLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5cGF0aFtpXSkge1xuICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICcuJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgICBvYmogPSBvYmpba2V5XTtcbiAgICAgICAgICAgICAga2V5ID0gXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ1xcXFwnOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICdcXFxcJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGtleSArPSBrZXlwYXRoW2ldO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNEZWZpbmVkKG9iaikgJiYga2V5IGluIG9iaikge1xuICAgICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBUaGlzIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYWxsIHRoZSB2YWx1ZXMgb2YgdGhlIGZvcm0uXG4gICAgLy8gSXQgdXNlcyB0aGUgaW5wdXQgbmFtZSBhcyBrZXkgYW5kIHRoZSB2YWx1ZSBhcyB2YWx1ZVxuICAgIC8vIFNvIGZvciBleGFtcGxlIHRoaXM6XG4gICAgLy8gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImVtYWlsXCIgdmFsdWU9XCJmb29AYmFyLmNvbVwiIC8+XG4gICAgLy8gd291bGQgcmV0dXJuOlxuICAgIC8vIHtlbWFpbDogXCJmb29AYmFyLmNvbVwifVxuICAgIGNvbGxlY3RGb3JtVmFsdWVzOiBmdW5jdGlvbihmb3JtLCBvcHRpb25zKSB7XG4gICAgICB2YXIgdmFsdWVzID0ge31cbiAgICAgICAgLCBpXG4gICAgICAgICwgaW5wdXRcbiAgICAgICAgLCBpbnB1dHNcbiAgICAgICAgLCB2YWx1ZTtcblxuICAgICAgaWYgKCFmb3JtKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcblxuICAgICAgICBpZiAodi5pc0RlZmluZWQoaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZ25vcmVkXCIpKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0LnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuYXR0cmlidXRlcy52YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2lucHV0Lm5hbWVdIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gaW5wdXQuY2hlY2tlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwic2VsZWN0W25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoaW5wdXQub3B0aW9uc1tpbnB1dC5zZWxlY3RlZEluZGV4XS52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIHZhbHVlc1tpbnB1dC5uYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH0sXG5cbiAgICBzYW5pdGl6ZUZvcm1WYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnRyaW0gJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm51bGxpZnkgIT09IGZhbHNlICYmIHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICghdi5pc1N0cmluZyhzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSBhbGwgZXJyb3JzIHdobydzIGVycm9yIGF0dHJpYnV0ZSBpcyBlbXB0eSAobnVsbCBvciB1bmRlZmluZWQpXG4gICAgcHJ1bmVFbXB0eUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzLmZpbHRlcihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZXR1cm4gIXYuaXNFbXB0eShlcnJvci5lcnJvcik7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gSW5cbiAgICAvLyBbe2Vycm9yOiBbXCJlcnIxXCIsIFwiZXJyMlwiXSwgLi4ufV1cbiAgICAvLyBPdXRcbiAgICAvLyBbe2Vycm9yOiBcImVycjFcIiwgLi4ufSwge2Vycm9yOiBcImVycjJcIiwgLi4ufV1cbiAgICAvL1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzIGluIGFuIGVycm9yIHdpdGggbXVsdGlwbGUgbWVzc2FnZXMgYXJlIGR1cGxpY2F0ZWRcbiAgICAvLyB3aGVuIGV4cGFuZGluZyB0aGUgZXJyb3JzLlxuICAgIGV4cGFuZE11bHRpcGxlRXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgZXJyb3JzIHdpdGhvdXQgYSBtZXNzYWdlXG4gICAgICAgIGlmICh2LmlzQXJyYXkoZXJyb3IuZXJyb3IpKSB7XG4gICAgICAgICAgZXJyb3IuZXJyb3IuZm9yRWFjaChmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvciwge2Vycm9yOiBtc2d9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0LnB1c2goZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnRzIHRoZSBlcnJvciBtZXNhZ2VzIGJ5IHByZXBlbmRpbmcgdGhlIGF0dHJpYnV0ZSBuYW1lIHVubGVzcyB0aGVcbiAgICAvLyBtZXNzYWdlIGlzIHByZWZpeGVkIGJ5IF5cbiAgICBjb252ZXJ0RXJyb3JNZXNzYWdlczogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3JJbmZvKSB7XG4gICAgICAgIHZhciBlcnJvciA9IGVycm9ySW5mby5lcnJvcjtcblxuICAgICAgICBpZiAoZXJyb3JbMF0gPT09ICdeJykge1xuICAgICAgICAgIGVycm9yID0gZXJyb3Iuc2xpY2UoMSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5mdWxsTWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgZXJyb3IgPSB2LmNhcGl0YWxpemUodi5wcmV0dGlmeShlcnJvckluZm8uYXR0cmlidXRlKSkgKyBcIiBcIiArIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gZXJyb3IucmVwbGFjZSgvXFxcXFxcXi9nLCBcIl5cIik7XG4gICAgICAgIGVycm9yID0gdi5mb3JtYXQoZXJyb3IsIHt2YWx1ZTogdi5zdHJpbmdpZnlWYWx1ZShlcnJvckluZm8udmFsdWUpfSk7XG4gICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvckluZm8sIHtlcnJvcjogZXJyb3J9KSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyB7XCI8YXR0cmlidXRlTmFtZT5cIjogW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dfVxuICAgIGdyb3VwRXJyb3JzQnlBdHRyaWJ1dGU6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IHt9O1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgdmFyIGxpc3QgPSByZXRbZXJyb3IuYXR0cmlidXRlXTtcbiAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICBsaXN0LnB1c2goZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldFtlcnJvci5hdHRyaWJ1dGVdID0gW2Vycm9yXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2Vycm9yOiBcIjxtZXNzYWdlIDE+XCIsIC4uLn0sIHtlcnJvcjogXCI8bWVzc2FnZSAyPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyBbXCI8bWVzc2FnZSAxPlwiLCBcIjxtZXNzYWdlIDI+XCJdXG4gICAgZmxhdHRlbkVycm9yc1RvQXJyYXk6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5tYXAoZnVuY3Rpb24oZXJyb3IpIHsgcmV0dXJuIGVycm9yLmVycm9yOyB9KTtcbiAgICB9LFxuXG4gICAgZXhwb3NlTW9kdWxlOiBmdW5jdGlvbih2YWxpZGF0ZSwgcm9vdCwgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgICAgIGlmIChleHBvcnRzKSB7XG4gICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB2YWxpZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290LnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICAgIGlmICh2YWxpZGF0ZS5pc0Z1bmN0aW9uKGRlZmluZSkgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGU7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhcm46IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXJyb3I6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFsaWRhdGUudmFsaWRhdG9ycyA9IHtcbiAgICAvLyBQcmVzZW5jZSB2YWxpZGF0ZXMgdGhhdCB0aGUgdmFsdWUgaXNuJ3QgZW1wdHlcbiAgICBwcmVzZW5jZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiY2FuJ3QgYmUgYmxhbmtcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxlbmd0aDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSkge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGlzID0gb3B0aW9ucy5pc1xuICAgICAgICAsIG1heGltdW0gPSBvcHRpb25zLm1heGltdW1cbiAgICAgICAgLCBtaW5pbXVtID0gb3B0aW9ucy5taW5pbXVtXG4gICAgICAgICwgdG9rZW5pemVyID0gb3B0aW9ucy50b2tlbml6ZXIgfHwgZnVuY3Rpb24odmFsKSB7IHJldHVybiB2YWw7IH1cbiAgICAgICAgLCBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXTtcblxuICAgICAgdmFsdWUgPSB0b2tlbml6ZXIodmFsdWUpO1xuICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgIGlmKCF2LmlzTnVtYmVyKGxlbmd0aCkpIHtcbiAgICAgICAgdi5lcnJvcih2LmZvcm1hdChcIkF0dHJpYnV0ZSAle2F0dHJ9IGhhcyBhIG5vbiBudW1lcmljIHZhbHVlIGZvciBgbGVuZ3RoYFwiLCB7YXR0cjogYXR0cmlidXRlfSkpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJoYXMgYW4gaW5jb3JyZWN0IGxlbmd0aFwiO1xuICAgICAgfVxuXG4gICAgICAvLyBJcyBjaGVja3NcbiAgICAgIGlmICh2LmlzTnVtYmVyKGlzKSAmJiBsZW5ndGggIT09IGlzKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICB0aGlzLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgXCJpcyB0aGUgd3JvbmcgbGVuZ3RoIChzaG91bGQgYmUgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IGlzfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtaW5pbXVtKSAmJiBsZW5ndGggPCBtaW5pbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vU2hvcnQgfHxcbiAgICAgICAgICB0aGlzLnRvb1Nob3J0IHx8XG4gICAgICAgICAgXCJpcyB0b28gc2hvcnQgKG1pbmltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1pbmltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1heGltdW0pICYmIGxlbmd0aCA+IG1heGltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29Mb25nIHx8XG4gICAgICAgICAgdGhpcy50b29Mb25nIHx8XG4gICAgICAgICAgXCJpcyB0b28gbG9uZyAobWF4aW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWF4aW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVtZXJpY2FsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVycm9ycyA9IFtdXG4gICAgICAgICwgbmFtZVxuICAgICAgICAsIGNvdW50XG4gICAgICAgICwgY2hlY2tzID0ge1xuICAgICAgICAgICAgZ3JlYXRlclRoYW46ICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPiBjOyB9LFxuICAgICAgICAgICAgZ3JlYXRlclRoYW5PckVxdWFsVG86IGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPj0gYzsgfSxcbiAgICAgICAgICAgIGVxdWFsVG86ICAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID09PSBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW46ICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPCBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW5PckVxdWFsVG86ICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPD0gYzsgfVxuICAgICAgICAgIH07XG5cbiAgICAgIC8vIENvZXJjZSB0aGUgdmFsdWUgdG8gYSBudW1iZXIgdW5sZXNzIHdlJ3JlIGJlaW5nIHN0cmljdC5cbiAgICAgIGlmIChvcHRpb25zLm5vU3RyaW5ncyAhPT0gdHJ1ZSAmJiB2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQncyBub3QgYSBudW1iZXIgd2Ugc2hvdWxkbid0IGNvbnRpbnVlIHNpbmNlIGl0IHdpbGwgY29tcGFyZSBpdC5cbiAgICAgIGlmICghdi5pc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaXMgbm90IGEgbnVtYmVyXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIFNhbWUgbG9naWMgYXMgYWJvdmUsIHNvcnQgb2YuIERvbid0IGJvdGhlciB3aXRoIGNvbXBhcmlzb25zIGlmIHRoaXNcbiAgICAgIC8vIGRvZXNuJ3QgcGFzcy5cbiAgICAgIGlmIChvcHRpb25zLm9ubHlJbnRlZ2VyICYmICF2LmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdEludGVnZXIgIHx8IFwibXVzdCBiZSBhbiBpbnRlZ2VyXCI7XG4gICAgICB9XG5cbiAgICAgIGZvciAobmFtZSBpbiBjaGVja3MpIHtcbiAgICAgICAgY291bnQgPSBvcHRpb25zW25hbWVdO1xuICAgICAgICBpZiAodi5pc051bWJlcihjb3VudCkgJiYgIWNoZWNrc1tuYW1lXSh2YWx1ZSwgY291bnQpKSB7XG4gICAgICAgICAgLy8gVGhpcyBwaWNrcyB0aGUgZGVmYXVsdCBtZXNzYWdlIGlmIHNwZWNpZmllZFxuICAgICAgICAgIC8vIEZvciBleGFtcGxlIHRoZSBncmVhdGVyVGhhbiBjaGVjayB1c2VzIHRoZSBtZXNzYWdlIGZyb21cbiAgICAgICAgICAvLyB0aGlzLm5vdEdyZWF0ZXJUaGFuIHNvIHdlIGNhcGl0YWxpemUgdGhlIG5hbWUgYW5kIHByZXBlbmQgXCJub3RcIlxuICAgICAgICAgIHZhciBtc2cgPSB0aGlzW1wibm90XCIgKyB2LmNhcGl0YWxpemUobmFtZSldIHx8XG4gICAgICAgICAgICBcIm11c3QgYmUgJXt0eXBlfSAle2NvdW50fVwiO1xuXG4gICAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQobXNnLCB7XG4gICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICB0eXBlOiB2LnByZXR0aWZ5KG5hbWUpXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm9kZCAmJiB2YWx1ZSAlIDIgIT09IDEpIHtcbiAgICAgICAgZXJyb3JzLnB1c2godGhpcy5ub3RPZGQgfHwgXCJtdXN0IGJlIG9kZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmV2ZW4gJiYgdmFsdWUgJSAyICE9PSAwKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90RXZlbiB8fCBcIm11c3QgYmUgZXZlblwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRldGltZTogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXVxuICAgICAgICAsIGVhcmxpZXN0ID0gb3B0aW9ucy5lYXJsaWVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5lYXJsaWVzdCwgb3B0aW9ucykgOiBOYU5cbiAgICAgICAgLCBsYXRlc3QgPSBvcHRpb25zLmxhdGVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5sYXRlc3QsIG9wdGlvbnMpIDogTmFOO1xuXG4gICAgICB2YWx1ZSA9IHRoaXMucGFyc2UodmFsdWUsIG9wdGlvbnMpO1xuXG4gICAgICAvLyA4NjQwMDAwMCBpcyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgaW4gYSBkYXksIHRoaXMgaXMgdXNlZCB0byByZW1vdmVcbiAgICAgIC8vIHRoZSB0aW1lIGZyb20gdGhlIGRhdGVcbiAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgb3B0aW9ucy5kYXRlT25seSAmJiB2YWx1ZSAlIDg2NDAwMDAwICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcIm11c3QgYmUgYSB2YWxpZCBkYXRlXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oZWFybGllc3QpICYmIHZhbHVlIDwgZWFybGllc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29FYXJseSB8fCBcIm11c3QgYmUgbm8gZWFybGllciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQoZWFybGllc3QsIG9wdGlvbnMpfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4obGF0ZXN0KSAmJiB2YWx1ZSA+IGxhdGVzdCkge1xuICAgICAgICBlcnIgPSB0aGlzLnRvb0xhdGUgfHwgXCJtdXN0IGJlIG5vIGxhdGVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtkYXRlOiB0aGlzLmZvcm1hdChsYXRlc3QsIG9wdGlvbnMpfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGNvbnZlcnQgaW5wdXQgdG8gdGhlIG51bWJlclxuICAgICAgLy8gb2YgbWlsbGlzIHNpbmNlIHRoZSBlcG9jaC5cbiAgICAgIC8vIEl0IHNob3VsZCByZXR1cm4gTmFOIGlmIGl0J3Mgbm90IGEgdmFsaWQgZGF0ZS5cbiAgICAgIHBhcnNlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAodi5pc0Z1bmN0aW9uKHYuWERhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyB2LlhEYXRlKHZhbHVlLCB0cnVlKS5nZXRUaW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodi5pc0RlZmluZWQodi5tb21lbnQpKSB7XG4gICAgICAgICAgcmV0dXJuICt2Lm1vbWVudC51dGModmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfSxcbiAgICAgIC8vIEZvcm1hdHMgdGhlIGdpdmVuIHRpbWVzdGFtcC4gVXNlcyBJU084NjAxIHRvIGZvcm1hdCB0aGVtLlxuICAgICAgLy8gSWYgb3B0aW9ucy5kYXRlT25seSBpcyB0cnVlIHRoZW4gb25seSB0aGUgeWVhciwgbW9udGggYW5kIGRheSB3aWxsIGJlXG4gICAgICAvLyBvdXRwdXQuXG4gICAgICBmb3JtYXQ6IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IG9wdGlvbnMuZGF0ZUZvcm1hdDtcblxuICAgICAgICBpZiAodi5pc0Z1bmN0aW9uKHYuWERhdGUpKSB7XG4gICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IChvcHRpb25zLmRhdGVPbmx5ID8gXCJ5eXl5LU1NLWRkXCIgOiBcInl5eXktTU0tZGQgSEg6bW06c3NcIik7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYRGF0ZShkYXRlLCB0cnVlKS50b1N0cmluZyhmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwiWVlZWS1NTS1ERFwiIDogXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiB2Lm1vbWVudC51dGMoZGF0ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWl0aGVyIFhEYXRlIG9yIG1vbWVudC5qcyB3YXMgZm91bmRcIik7XG4gICAgICB9XG4gICAgfSksXG4gICAgZGF0ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgb3B0aW9ucywge2RhdGVPbmx5OiB0cnVlfSk7XG4gICAgICByZXR1cm4gdi52YWxpZGF0b3JzLmRhdGV0aW1lLmNhbGwodi52YWxpZGF0b3JzLmRhdGV0aW1lLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSB8fCAob3B0aW9ucyBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgb3B0aW9ucyA9IHtwYXR0ZXJuOiBvcHRpb25zfTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBpbnZhbGlkXCJcbiAgICAgICAgLCBwYXR0ZXJuID0gb3B0aW9ucy5wYXR0ZXJuXG4gICAgICAgICwgbWF0Y2g7XG5cbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcocGF0dGVybikpIHtcbiAgICAgICAgcGF0dGVybiA9IG5ldyBSZWdFeHAob3B0aW9ucy5wYXR0ZXJuLCBvcHRpb25zLmZsYWdzKTtcbiAgICAgIH1cbiAgICAgIG1hdGNoID0gcGF0dGVybi5leGVjKHZhbHVlKTtcbiAgICAgIGlmICghbWF0Y2ggfHwgbWF0Y2hbMF0ubGVuZ3RoICE9IHZhbHVlLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluY2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcIl4le3ZhbHVlfSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGxpc3RcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBleGNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKCF2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiXiV7dmFsdWV9IGlzIHJlc3RyaWN0ZWRcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBlbWFpbDogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIG5vdCBhIHZhbGlkIGVtYWlsXCI7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuUEFUVEVSTi5leGVjKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBQQVRURVJOOiAvXlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXpdezIsfSQvaVxuICAgIH0pLFxuICAgIGVxdWFsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7YXR0cmlidXRlOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcImlzIG5vdCBlcXVhbCB0byAle2F0dHJpYnV0ZX1cIjtcblxuICAgICAgaWYgKHYuaXNFbXB0eShvcHRpb25zLmF0dHJpYnV0ZSkgfHwgIXYuaXNTdHJpbmcob3B0aW9ucy5hdHRyaWJ1dGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhdHRyaWJ1dGUgbXVzdCBiZSBhIG5vbiBlbXB0eSBzdHJpbmdcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciBvdGhlclZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgb3B0aW9ucy5hdHRyaWJ1dGUpXG4gICAgICAgICwgY29tcGFyYXRvciA9IG9wdGlvbnMuY29tcGFyYXRvciB8fCBmdW5jdGlvbih2MSwgdjIpIHtcbiAgICAgICAgICByZXR1cm4gdjEgPT09IHYyO1xuICAgICAgICB9O1xuXG4gICAgICBpZiAoIWNvbXBhcmF0b3IodmFsdWUsIG90aGVyVmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykpIHtcbiAgICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHthdHRyaWJ1dGU6IHYucHJldHRpZnkob3B0aW9ucy5hdHRyaWJ1dGUpfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhbGlkYXRlLmV4cG9zZU1vZHVsZSh2YWxpZGF0ZSwgdGhpcywgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpO1xufSkuY2FsbCh0aGlzLFxuICAgICAgICB0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBleHBvcnRzIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBtb2R1bGUgOiBudWxsLFxuICAgICAgICB0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGRlZmluZSA6IG51bGwpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAzIDQgNSA2IDcgOCA5IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpOyB9O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9hbWQtZGVmaW5lLmpzXG4vLyBtb2R1bGUgaWQgPSA2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMyA0IDUgNiA3IDggOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpLFxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxuICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG4gICAgO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlLmV4dGVuZCh7XG4gICAgcXVlbmU6IFtdLFxuXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZ2V0RGF0YT1mdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBnZXREYXRhMT1mdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGRvYWpheD1mdW5jdGlvbihnZXREYXRhKXtcbiAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB1cmw6ICdiMmMvdHJhdmVsZXIvZ2V0TXlUcmF2ZWxlcnNMaXN0JywgIFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGdldERhdGEsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGdldERhdGExXG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuICAgICAgICBkb2FqYXgoZ2V0RGF0YSk7XG4gICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGN1cnJlbnRUcmF2ZWxsZXI6IHtpZDogMSx0aXRsZTonTXIuJywgZW1haWw6ICdwcmFzaGFudEBnbWFpbC5jb20nLCBtb2JpbGU6ICc5NDEyMzU3OTI2JywgIGZpcnN0X25hbWU6ICdQcmFzaGFudCcsIFxuICAgICAgICAgICAgICAgIGxhc3RfbmFtZTonS3VtYXInLGJpcnRoZGF0ZTonMjAwMS0wNS0zMCcsYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6JzM0MjEyMycscGFzc3BvcnRfcGxhY2U6J0luZGlhJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGN1cnJlbnRUcmF2ZWxsZXJJZDoxLFxuICAgICAgICAgICAgY2FiaW5UeXBlOiAxLFxuICAgICAgICAgICAgYWRkOmZhbHNlLFxuICAgICAgICAgICAgZWRpdDpmYWxzZSxcbiAgICAgICAgICAgIHRpdGxlczpbe2lkOjEsdGV4dDonTXIuJ30se2lkOjIsdGV4dDonTXJzLid9LHtpZDozLHRleHQ6J01zLid9LHtpZDo0LHRleHQ6J01pc3MnfSx7aWQ6NSx0ZXh0OidNc3RyLid9LHtpZDo2LHRleHQ6J0luZi4nfV0sXG4gICAgICAgICAgICBwYXNzZW5nZXJzOiBbMSwgMCwgMF0sXG4gICAgICAgICAgICB0cmF2ZWxsZXJzOiBbXG4gICAgICAgICAgICAgICAgeyBpZDogMSx0aXRsZTonTXIuJywgZW1haWw6ICdwcmFzaGFudEBnbWFpbC5jb20nLCBtb2JpbGU6ICc5NDEyMzU3OTI2JyxwYXNzcG9ydF9udW1iZXI6JzI1NDIzNDInLHBhc3Nwb3J0X3BsYWNlOidJbmRpYScsIFxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnUHJhc2hhbnQnLCBsYXN0X25hbWU6J0t1bWFyJyxiaXJ0aGRhdGU6JzIwMDEtMDUtMzAnLGJhc2VVcmw6Jyd9LFxuICAgICAgICAgICAgICAgIHsgaWQ6IDIsdGl0bGU6J01yLicsIGVtYWlsOiAnTWljaGFlbEBnbWFpbC5jb20nLCBtb2JpbGU6ICcxMjM0NTY3ODkwJyxwYXNzcG9ydF9udW1iZXI6JzMxMjMxMjMnLHBhc3Nwb3J0X3BsYWNlOidJbmRpYScsIFxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnTWljaGFlbCcsIGxhc3RfbmFtZTonSmFpbicsYmlydGhkYXRlOicyMDA1LTAzLTAzJyxiYXNlVXJsOicnfSxcbiAgICAgICAgICAgICAgICB7IGlkOiAzLHRpdGxlOidNci4nLCBlbWFpbDogJ2JlbGFpckBnbWFpbC5jb20nLCBtb2JpbGU6ICcxMjM0NTY3ODkwJyxwYXNzcG9ydF9udW1iZXI6JzEyMzEyMzEnLHBhc3Nwb3J0X3BsYWNlOidJbmRpYScsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6ICdCZWxhaXInLCBsYXN0X25hbWU6J1RyYXZlbHMnLGJpcnRoZGF0ZTonMjAwMi0wMi0yMCcsYmFzZVVybDonJ31cbiAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgIHBlbmRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3JzOiB7fSxcbiAgICAgICAgICAgIHJlc3VsdHM6IFtdLFxuXG4gICAgICAgICAgICBmaWx0ZXI6IHt9LFxuICAgICAgICAgICAgZmlsdGVyZWQ6IHt9LFxuICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcbiAgICBydW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgaWYodGhpcy5nZXQoKS5hZGQpeyAgICAgICAgXG4gICAgICAgIHZhciBuZXd0cmF2ZWxsZXI9Xy5waWNrKHRoaXMuZ2V0KCksICdjdXJyZW50VHJhdmVsbGVyJyk7IFxuICAgICAgICB2YXIgdHJhdmVsbGVycz10aGlzLmdldCgpLnRyYXZlbGxlcnM7XG4gICAgICAgIHZhciB0PW5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnRpdGxlO1xuICAgICAgICB2YXIgdGl0bGVzPV8uY2xvbmVEZWVwKHRoaXMuZ2V0KCkudGl0bGVzKTtcbiAgICAgICAgdmFyIHRpdGxlO1xuICAgICAgICAgXy5lYWNoKHRpdGxlcywgZnVuY3Rpb24oaSwgaykgeyBpZiAoaS5pZD09dCkgdGl0bGU9aS50ZXh0OyB9KTtcbiAgICAgIFxuICAgICAgICB2YXIgY3VycmVudHRyYXZlbGxlcj17aWQ6IDQsdGl0bGU6dGl0bGUsIGVtYWlsOiBuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5lbWFpbCwgbW9iaWxlOiBuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5tb2JpbGUsICBmaXJzdF9uYW1lOiBuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5maXJzdF9uYW1lLCBcbiAgICAgICAgICAgICAgICBsYXN0X25hbWU6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIubGFzdF9uYW1lLGJpcnRoZGF0ZTpuZXd0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyksYmFzZVVybDonJyxwYXNzcG9ydF9udW1iZXI6bmV3dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyLHBhc3Nwb3J0X3BsYWNlOm5ld3RyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnBhc3Nwb3J0X3BsYWNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB0cmF2ZWxsZXJzLnB1c2goY3VycmVudHRyYXZlbGxlcik7XG4gICAgICAgIC8vY29uc29sZS5sb2codHJhdmVsbGVycyk7XG4gICAgICAgIHRoaXMuc2V0KCd0cmF2ZWxsZXJzJyx0cmF2ZWxsZXJzKTtcbiAgICAgICAgdGhpcy5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLGN1cnJlbnR0cmF2ZWxsZXIpO1xuICAgICAgICB0aGlzLnNldCgnY3VycmVudFRyYXZlbGxlcklkJyw0KTtcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLmdldCgpLmVkaXQpe1xuICAgICAgICB2YXIgbmV3dHJhdmVsbGVyPXRoaXMuZ2V0KCkuY3VycmVudFRyYXZlbGxlcjsgXG4gICAgICAgIHZhciB0cmF2ZWxsZXJzPXRoaXMuZ2V0KCkudHJhdmVsbGVycztcbiAgICAgICAgdmFyIHQ9bmV3dHJhdmVsbGVyLnRpdGxlO1xuICAgICAgICB2YXIgdGl0bGVzPV8uY2xvbmVEZWVwKHRoaXMuZ2V0KCkudGl0bGVzKTtcbiAgICAgICAgdmFyIHRpdGxlO1xuICAgICAgICB2YXIgaWQ9dGhpcy5nZXQoKS5jdXJyZW50VHJhdmVsbGVySWQ7XG4gICAgICAgICBfLmVhY2godGl0bGVzLCBmdW5jdGlvbihpLCBrKSB7IC8qY29uc29sZS5sb2coaSk7Ki8gaWYgKGkuaWQ9PXQpIHRpdGxlPWkudGV4dDsgfSk7XG4gICAgICBcbiAgICAgICAgdmFyIGN1cnJlbnR0cmF2ZWxsZXI9e2lkOiBpZCx0aXRsZTp0aXRsZSwgZW1haWw6IG5ld3RyYXZlbGxlci5lbWFpbCwgbW9iaWxlOiBuZXd0cmF2ZWxsZXIubW9iaWxlLCAgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmZpcnN0X25hbWUsIFxuICAgICAgICAgICAgICAgIGxhc3RfbmFtZTpuZXd0cmF2ZWxsZXIubGFzdF9uYW1lLGJpcnRoZGF0ZTpuZXd0cmF2ZWxsZXIuYmlydGhkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpLGJhc2VVcmw6JycscGFzc3BvcnRfbnVtYmVyOm5ld3RyYXZlbGxlci5wYXNzcG9ydF9udW1iZXIscGFzc3BvcnRfcGxhY2U6bmV3dHJhdmVsbGVyLnBhc3Nwb3J0X3BsYWNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB2YXIgaW5kZXg9IF8uZmluZEluZGV4KHRoaXMuZ2V0KCkudHJhdmVsbGVycywgeyAnaWQnOiBpZH0pO1xuICAgICAgICB0aGlzLnNwbGljZSgndHJhdmVsbGVycycsIGluZGV4LCAxKTtcbiAgICAgIC8vICBjb25zb2xlLmxvZyhjdXJyZW50dHJhdmVsbGVyKTtcbiAgICAgICAgdHJhdmVsbGVycy5wdXNoKGN1cnJlbnR0cmF2ZWxsZXIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYXZlbGxlcnMpO1xuICAgICAgICB0aGlzLnNldCgndHJhdmVsbGVycycsdHJhdmVsbGVycyk7XG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxjdXJyZW50dHJhdmVsbGVyKTsgICAgICAgIFxuICAgIH1cbiAgICAgICAgdGhpcy5zZXQoJ2FkZCcsZmFsc2UpOyBcbiAgICAgICAgdGhpcy5zZXQoJ2VkaXQnLGZhbHNlKTsgXG4gICAgICAgIC8vLFxuICAgICAvKiAgICAgICBzZWFyY2ggPSBfLnBpY2sodGhpcy5nZXQoKSwgWyd0cmlwVHlwZScsICdjYWJpblR5cGUnLCAncGFzc2VuZ2VycyddKTtcblxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywge30pO1xuICAgICAgICB0aGlzLnNldCgncGVuZGluZycsIHRydWUpO1xuICAgICAgICB0aGlzLnF1ZW5lID0gW107XG5cblxuICAgICAgICBfLmVhY2godGhpcy5nZXQoJ2ZsaWdodHMnKSwgZnVuY3Rpb24oaSwgaykge1xuICAgICAgICAgICAgdmlldy5xdWVuZVt2aWV3LnF1ZW5lLmxlbmd0aF0gPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2ZsaWdodHMvc2VhcmNoJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmV4dGVuZCh7fSwgc2VhcmNoLCB7XG4gICAgICAgICAgICAgICAgICAgIGZyb206IGkuZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgdG86IGkudG8sXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydF9hdDogbW9tZW50LmlzTW9tZW50KGkuZGVwYXJ0X2F0KSA/IGkuZGVwYXJ0X2F0LmZvcm1hdCgnWVlZWS1NTS1ERCcpIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuX2F0OiBtb21lbnQuaXNNb21lbnQoaS5yZXR1cm5fYXQpID8gaS5yZXR1cm5fYXQuZm9ybWF0KCdZWVlZLU1NLUREJykgOiBudWxsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IHZpZXcuaW1wb3J0UmVzdWx0cyhrLCBkYXRhKTsgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7IHZpZXcuaGFuZGxlRXJyb3IoaywgeGhyKTsgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC53aGVuLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy5xdWVuZSlcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTsgdmlldy5zZXQoJ2ZpbmlzaGVkJywgdHJ1ZSk7IH0pOyAqL1xuICAgIH0sXG5cbiAgICBpbXBvcnRSZXN1bHRzOiBmdW5jdGlvbihrLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuc2V0KCdmaWx0ZXJlZCcsIHt9KTtcbiAgICAgICAgdGhpcy5zZXQoJ3Jlc3VsdHMuJyArIGssIGRhdGEpO1xuXG4gICAgICAgIHZhciBwcmljZXMgPSBbXSxcbiAgICAgICAgICAgIGNhcnJpZXJzID0gW107XG5cbiAgICAgICAgXy5lYWNoKGRhdGEsIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHByaWNlc1twcmljZXMubGVuZ3RoXSA9IGkucHJpY2U7XG4gICAgICAgICAgICBjYXJyaWVyc1tjYXJyaWVycy5sZW5ndGhdID0gaS5pdGluZXJhcnlbMF0uc2VnbWVudHNbMF0uY2FycmllcjtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBjYXJyaWVycyA9IF8udW5pcXVlKGNhcnJpZXJzLCAnY29kZScpO1xuXG4gICAgICAgIHRoaXMuc2V0KCdmaWx0ZXInLCB7XG4gICAgICAgICAgICBwcmljZXM6IFtNYXRoLm1pbi5hcHBseShudWxsLCBwcmljZXMpLCBNYXRoLm1heC5hcHBseShudWxsLCBwcmljZXMpXSxcbiAgICAgICAgICAgIGNhcnJpZXJzOiBjYXJyaWVyc1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNldCgnZmlsdGVyZWQuY2FycmllcnMnLCBfLm1hcChjYXJyaWVycywgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS5jb2RlOyB9KSk7XG4gICAgfSxcblxuICAgIGhhbmRsZUVycm9yOiBmdW5jdGlvbihrLCB4aHIpIHtcblxuICAgIH1cblxuXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gNjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDUgNiA5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWFpbGNoZWNrID0gcmVxdWlyZSgnbWFpbGNoZWNrJyk7XG5cbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2VtYWlsJ1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcblxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKVxuICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5tYWlsY2hlY2soe1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0ZWQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHN1Z2dlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWdnZXN0aW9uJywgc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VnZ2VzdGlvbicsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY29ycmVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHRoaXMuZ2V0KCdzdWdnZXN0aW9uLmZ1bGwnKSk7XG4gICAgICAgIHRoaXMuc2V0KCdzdWdnZXN0aW9uJywgbnVsbCk7XG4gICAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb3JlL2Zvcm0vZW1haWwuanNcbi8vIG1vZHVsZSBpZCA9IDg2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCA1IDggOSIsIi8qXG4gKiBNYWlsY2hlY2sgaHR0cHM6Ly9naXRodWIuY29tL21haWxjaGVjay9tYWlsY2hlY2tcbiAqIEF1dGhvclxuICogRGVycmljayBLbyAoQGRlcnJpY2trbylcbiAqXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKlxuICogdiAxLjEuMlxuICovXG5cbnZhciBNYWlsY2hlY2sgPSB7XG4gIGRvbWFpblRocmVzaG9sZDogMixcbiAgc2Vjb25kTGV2ZWxUaHJlc2hvbGQ6IDIsXG4gIHRvcExldmVsVGhyZXNob2xkOiAyLFxuXG4gIGRlZmF1bHREb21haW5zOiBbJ21zbi5jb20nLCAnYmVsbHNvdXRoLm5ldCcsXG4gICAgJ3RlbHVzLm5ldCcsICdjb21jYXN0Lm5ldCcsICdvcHR1c25ldC5jb20uYXUnLFxuICAgICdlYXJ0aGxpbmsubmV0JywgJ3FxLmNvbScsICdza3kuY29tJywgJ2ljbG91ZC5jb20nLFxuICAgICdtYWMuY29tJywgJ3N5bXBhdGljby5jYScsICdnb29nbGVtYWlsLmNvbScsXG4gICAgJ2F0dC5uZXQnLCAneHRyYS5jby5ueicsICd3ZWIuZGUnLFxuICAgICdjb3gubmV0JywgJ2dtYWlsLmNvbScsICd5bWFpbC5jb20nLFxuICAgICdhaW0uY29tJywgJ3JvZ2Vycy5jb20nLCAndmVyaXpvbi5uZXQnLFxuICAgICdyb2NrZXRtYWlsLmNvbScsICdnb29nbGUuY29tJywgJ29wdG9ubGluZS5uZXQnLFxuICAgICdzYmNnbG9iYWwubmV0JywgJ2FvbC5jb20nLCAnbWUuY29tJywgJ2J0aW50ZXJuZXQuY29tJyxcbiAgICAnY2hhcnRlci5uZXQnLCAnc2hhdy5jYSddLFxuXG4gIGRlZmF1bHRTZWNvbmRMZXZlbERvbWFpbnM6IFtcInlhaG9vXCIsIFwiaG90bWFpbFwiLCBcIm1haWxcIiwgXCJsaXZlXCIsIFwib3V0bG9va1wiLCBcImdteFwiXSxcblxuICBkZWZhdWx0VG9wTGV2ZWxEb21haW5zOiBbXCJjb21cIiwgXCJjb20uYXVcIiwgXCJjb20udHdcIiwgXCJjYVwiLCBcImNvLm56XCIsIFwiY28udWtcIiwgXCJkZVwiLFxuICAgIFwiZnJcIiwgXCJpdFwiLCBcInJ1XCIsIFwibmV0XCIsIFwib3JnXCIsIFwiZWR1XCIsIFwiZ292XCIsIFwianBcIiwgXCJubFwiLCBcImtyXCIsIFwic2VcIiwgXCJldVwiLFxuICAgIFwiaWVcIiwgXCJjby5pbFwiLCBcInVzXCIsIFwiYXRcIiwgXCJiZVwiLCBcImRrXCIsIFwiaGtcIiwgXCJlc1wiLCBcImdyXCIsIFwiY2hcIiwgXCJub1wiLCBcImN6XCIsXG4gICAgXCJpblwiLCBcIm5ldFwiLCBcIm5ldC5hdVwiLCBcImluZm9cIiwgXCJiaXpcIiwgXCJtaWxcIiwgXCJjby5qcFwiLCBcInNnXCIsIFwiaHVcIiwgXCJ1a1wiXSxcblxuICBydW46IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICBvcHRzLmRvbWFpbnMgPSBvcHRzLmRvbWFpbnMgfHwgTWFpbGNoZWNrLmRlZmF1bHREb21haW5zO1xuICAgIG9wdHMuc2Vjb25kTGV2ZWxEb21haW5zID0gb3B0cy5zZWNvbmRMZXZlbERvbWFpbnMgfHwgTWFpbGNoZWNrLmRlZmF1bHRTZWNvbmRMZXZlbERvbWFpbnM7XG4gICAgb3B0cy50b3BMZXZlbERvbWFpbnMgPSBvcHRzLnRvcExldmVsRG9tYWlucyB8fCBNYWlsY2hlY2suZGVmYXVsdFRvcExldmVsRG9tYWlucztcbiAgICBvcHRzLmRpc3RhbmNlRnVuY3Rpb24gPSBvcHRzLmRpc3RhbmNlRnVuY3Rpb24gfHwgTWFpbGNoZWNrLnNpZnQzRGlzdGFuY2U7XG5cbiAgICB2YXIgZGVmYXVsdENhbGxiYWNrID0gZnVuY3Rpb24ocmVzdWx0KXsgcmV0dXJuIHJlc3VsdCB9O1xuICAgIHZhciBzdWdnZXN0ZWRDYWxsYmFjayA9IG9wdHMuc3VnZ2VzdGVkIHx8IGRlZmF1bHRDYWxsYmFjaztcbiAgICB2YXIgZW1wdHlDYWxsYmFjayA9IG9wdHMuZW1wdHkgfHwgZGVmYXVsdENhbGxiYWNrO1xuXG4gICAgdmFyIHJlc3VsdCA9IE1haWxjaGVjay5zdWdnZXN0KE1haWxjaGVjay5lbmNvZGVFbWFpbChvcHRzLmVtYWlsKSwgb3B0cy5kb21haW5zLCBvcHRzLnNlY29uZExldmVsRG9tYWlucywgb3B0cy50b3BMZXZlbERvbWFpbnMsIG9wdHMuZGlzdGFuY2VGdW5jdGlvbik7XG5cbiAgICByZXR1cm4gcmVzdWx0ID8gc3VnZ2VzdGVkQ2FsbGJhY2socmVzdWx0KSA6IGVtcHR5Q2FsbGJhY2soKVxuICB9LFxuXG4gIHN1Z2dlc3Q6IGZ1bmN0aW9uKGVtYWlsLCBkb21haW5zLCBzZWNvbmRMZXZlbERvbWFpbnMsIHRvcExldmVsRG9tYWlucywgZGlzdGFuY2VGdW5jdGlvbikge1xuICAgIGVtYWlsID0gZW1haWwudG9Mb3dlckNhc2UoKTtcblxuICAgIHZhciBlbWFpbFBhcnRzID0gdGhpcy5zcGxpdEVtYWlsKGVtYWlsKTtcblxuICAgIGlmIChzZWNvbmRMZXZlbERvbWFpbnMgJiYgdG9wTGV2ZWxEb21haW5zKSB7XG4gICAgICAgIC8vIElmIHRoZSBlbWFpbCBpcyBhIHZhbGlkIDJuZC1sZXZlbCArIHRvcC1sZXZlbCwgZG8gbm90IHN1Z2dlc3QgYW55dGhpbmcuXG4gICAgICAgIGlmIChzZWNvbmRMZXZlbERvbWFpbnMuaW5kZXhPZihlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluKSAhPT0gLTEgJiYgdG9wTGV2ZWxEb21haW5zLmluZGV4T2YoZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbikgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2xvc2VzdERvbWFpbiA9IHRoaXMuZmluZENsb3Nlc3REb21haW4oZW1haWxQYXJ0cy5kb21haW4sIGRvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRoaXMuZG9tYWluVGhyZXNob2xkKTtcblxuICAgIGlmIChjbG9zZXN0RG9tYWluKSB7XG4gICAgICBpZiAoY2xvc2VzdERvbWFpbiA9PSBlbWFpbFBhcnRzLmRvbWFpbikge1xuICAgICAgICAvLyBUaGUgZW1haWwgYWRkcmVzcyBleGFjdGx5IG1hdGNoZXMgb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zOyBkbyBub3QgcmV0dXJuIGEgc3VnZ2VzdGlvbi5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgY2xvc2VseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWluczsgcmV0dXJuIGEgc3VnZ2VzdGlvblxuICAgICAgICByZXR1cm4geyBhZGRyZXNzOiBlbWFpbFBhcnRzLmFkZHJlc3MsIGRvbWFpbjogY2xvc2VzdERvbWFpbiwgZnVsbDogZW1haWxQYXJ0cy5hZGRyZXNzICsgXCJAXCIgKyBjbG9zZXN0RG9tYWluIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgZG9lcyBub3QgY2xvc2VseSBtYXRjaCBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnNcbiAgICB2YXIgY2xvc2VzdFNlY29uZExldmVsRG9tYWluID0gdGhpcy5maW5kQ2xvc2VzdERvbWFpbihlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluLCBzZWNvbmRMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRoaXMuc2Vjb25kTGV2ZWxUaHJlc2hvbGQpO1xuICAgIHZhciBjbG9zZXN0VG9wTGV2ZWxEb21haW4gICAgPSB0aGlzLmZpbmRDbG9zZXN0RG9tYWluKGVtYWlsUGFydHMudG9wTGV2ZWxEb21haW4sIHRvcExldmVsRG9tYWlucywgZGlzdGFuY2VGdW5jdGlvbiwgdGhpcy50b3BMZXZlbFRocmVzaG9sZCk7XG5cbiAgICBpZiAoZW1haWxQYXJ0cy5kb21haW4pIHtcbiAgICAgIHZhciBjbG9zZXN0RG9tYWluID0gZW1haWxQYXJ0cy5kb21haW47XG4gICAgICB2YXIgcnRybiA9IGZhbHNlO1xuXG4gICAgICBpZihjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4gJiYgY2xvc2VzdFNlY29uZExldmVsRG9tYWluICE9IGVtYWlsUGFydHMuc2Vjb25kTGV2ZWxEb21haW4pIHtcbiAgICAgICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgbWF5IGhhdmUgYSBtaXNwZWxsZWQgc2Vjb25kLWxldmVsIGRvbWFpbjsgcmV0dXJuIGEgc3VnZ2VzdGlvblxuICAgICAgICBjbG9zZXN0RG9tYWluID0gY2xvc2VzdERvbWFpbi5yZXBsYWNlKGVtYWlsUGFydHMuc2Vjb25kTGV2ZWxEb21haW4sIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbik7XG4gICAgICAgIHJ0cm4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZihjbG9zZXN0VG9wTGV2ZWxEb21haW4gJiYgY2xvc2VzdFRvcExldmVsRG9tYWluICE9IGVtYWlsUGFydHMudG9wTGV2ZWxEb21haW4pIHtcbiAgICAgICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgbWF5IGhhdmUgYSBtaXNwZWxsZWQgdG9wLWxldmVsIGRvbWFpbjsgcmV0dXJuIGEgc3VnZ2VzdGlvblxuICAgICAgICBjbG9zZXN0RG9tYWluID0gY2xvc2VzdERvbWFpbi5yZXBsYWNlKG5ldyBSZWdFeHAoZW1haWxQYXJ0cy50b3BMZXZlbERvbWFpbiArIFwiJFwiKSwgY2xvc2VzdFRvcExldmVsRG9tYWluKTtcbiAgICAgICAgcnRybiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChydHJuID09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHsgYWRkcmVzczogZW1haWxQYXJ0cy5hZGRyZXNzLCBkb21haW46IGNsb3Nlc3REb21haW4sIGZ1bGw6IGVtYWlsUGFydHMuYWRkcmVzcyArIFwiQFwiICsgY2xvc2VzdERvbWFpbiB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIFRoZSBlbWFpbCBhZGRyZXNzIGV4YWN0bHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnMsIGRvZXMgbm90IGNsb3NlbHlcbiAgICAgKiBtYXRjaCBhbnkgZG9tYWluIGFuZCBkb2VzIG5vdCBhcHBlYXIgdG8gc2ltcGx5IGhhdmUgYSBtaXNwZWxsZWQgdG9wLWxldmVsIGRvbWFpbixcbiAgICAgKiBvciBpcyBhbiBpbnZhbGlkIGVtYWlsIGFkZHJlc3M7IGRvIG5vdCByZXR1cm4gYSBzdWdnZXN0aW9uLlxuICAgICAqL1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBmaW5kQ2xvc2VzdERvbWFpbjogZnVuY3Rpb24oZG9tYWluLCBkb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aHJlc2hvbGQpIHtcbiAgICB0aHJlc2hvbGQgPSB0aHJlc2hvbGQgfHwgdGhpcy50b3BMZXZlbFRocmVzaG9sZDtcbiAgICB2YXIgZGlzdDtcbiAgICB2YXIgbWluRGlzdCA9IEluZmluaXR5O1xuICAgIHZhciBjbG9zZXN0RG9tYWluID0gbnVsbDtcblxuICAgIGlmICghZG9tYWluIHx8ICFkb21haW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKCFkaXN0YW5jZUZ1bmN0aW9uKSB7XG4gICAgICBkaXN0YW5jZUZ1bmN0aW9uID0gdGhpcy5zaWZ0M0Rpc3RhbmNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9tYWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRvbWFpbiA9PT0gZG9tYWluc1tpXSkge1xuICAgICAgICByZXR1cm4gZG9tYWluO1xuICAgICAgfVxuICAgICAgZGlzdCA9IGRpc3RhbmNlRnVuY3Rpb24oZG9tYWluLCBkb21haW5zW2ldKTtcbiAgICAgIGlmIChkaXN0IDwgbWluRGlzdCkge1xuICAgICAgICBtaW5EaXN0ID0gZGlzdDtcbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGRvbWFpbnNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1pbkRpc3QgPD0gdGhyZXNob2xkICYmIGNsb3Nlc3REb21haW4gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBjbG9zZXN0RG9tYWluO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIHNpZnQzRGlzdGFuY2U6IGZ1bmN0aW9uKHMxLCBzMikge1xuICAgIC8vIHNpZnQzOiBodHRwOi8vc2lkZXJpdGUuYmxvZ3Nwb3QuY29tLzIwMDcvMDQvc3VwZXItZmFzdC1hbmQtYWNjdXJhdGUtc3RyaW5nLWRpc3RhbmNlLmh0bWxcbiAgICBpZiAoczEgPT0gbnVsbCB8fCBzMS5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChzMiA9PSBudWxsIHx8IHMyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzMi5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHMyID09IG51bGwgfHwgczIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gczEubGVuZ3RoO1xuICAgIH1cblxuICAgIHZhciBjID0gMDtcbiAgICB2YXIgb2Zmc2V0MSA9IDA7XG4gICAgdmFyIG9mZnNldDIgPSAwO1xuICAgIHZhciBsY3MgPSAwO1xuICAgIHZhciBtYXhPZmZzZXQgPSA1O1xuXG4gICAgd2hpbGUgKChjICsgb2Zmc2V0MSA8IHMxLmxlbmd0aCkgJiYgKGMgKyBvZmZzZXQyIDwgczIubGVuZ3RoKSkge1xuICAgICAgaWYgKHMxLmNoYXJBdChjICsgb2Zmc2V0MSkgPT0gczIuY2hhckF0KGMgKyBvZmZzZXQyKSkge1xuICAgICAgICBsY3MrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZnNldDEgPSAwO1xuICAgICAgICBvZmZzZXQyID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhPZmZzZXQ7IGkrKykge1xuICAgICAgICAgIGlmICgoYyArIGkgPCBzMS5sZW5ndGgpICYmIChzMS5jaGFyQXQoYyArIGkpID09IHMyLmNoYXJBdChjKSkpIHtcbiAgICAgICAgICAgIG9mZnNldDEgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoYyArIGkgPCBzMi5sZW5ndGgpICYmIChzMS5jaGFyQXQoYykgPT0gczIuY2hhckF0KGMgKyBpKSkpIHtcbiAgICAgICAgICAgIG9mZnNldDIgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjKys7XG4gICAgfVxuICAgIHJldHVybiAoczEubGVuZ3RoICsgczIubGVuZ3RoKSAvMiAtIGxjcztcbiAgfSxcblxuICBzcGxpdEVtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgIHZhciBwYXJ0cyA9IGVtYWlsLnRyaW0oKS5zcGxpdCgnQCcpO1xuXG4gICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocGFydHNbaV0gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZG9tYWluID0gcGFydHMucG9wKCk7XG4gICAgdmFyIGRvbWFpblBhcnRzID0gZG9tYWluLnNwbGl0KCcuJyk7XG4gICAgdmFyIHNsZCA9ICcnO1xuICAgIHZhciB0bGQgPSAnJztcblxuICAgIGlmIChkb21haW5QYXJ0cy5sZW5ndGggPT0gMCkge1xuICAgICAgLy8gVGhlIGFkZHJlc3MgZG9lcyBub3QgaGF2ZSBhIHRvcC1sZXZlbCBkb21haW5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRvbWFpblBhcnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBoYXMgb25seSBhIHRvcC1sZXZlbCBkb21haW4gKHZhbGlkIHVuZGVyIFJGQylcbiAgICAgIHRsZCA9IGRvbWFpblBhcnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBoYXMgYSBkb21haW4gYW5kIGEgdG9wLWxldmVsIGRvbWFpblxuICAgICAgc2xkID0gZG9tYWluUGFydHNbMF07XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGRvbWFpblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRsZCArPSBkb21haW5QYXJ0c1tpXSArICcuJztcbiAgICAgIH1cbiAgICAgIHRsZCA9IHRsZC5zdWJzdHJpbmcoMCwgdGxkLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b3BMZXZlbERvbWFpbjogdGxkLFxuICAgICAgc2Vjb25kTGV2ZWxEb21haW46IHNsZCxcbiAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgYWRkcmVzczogcGFydHMuam9pbignQCcpXG4gICAgfVxuICB9LFxuXG4gIC8vIEVuY29kZSB0aGUgZW1haWwgYWRkcmVzcyB0byBwcmV2ZW50IFhTUyBidXQgbGVhdmUgaW4gdmFsaWRcbiAgLy8gY2hhcmFjdGVycywgZm9sbG93aW5nIHRoaXMgb2ZmaWNpYWwgc3BlYzpcbiAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9FbWFpbF9hZGRyZXNzI1N5bnRheFxuICBlbmNvZGVFbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW5jb2RlVVJJKGVtYWlsKTtcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnJTIwJywgJyAnKS5yZXBsYWNlKCclMjUnLCAnJScpLnJlcGxhY2UoJyU1RScsICdeJylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJTYwJywgJ2AnKS5yZXBsYWNlKCclN0InLCAneycpLnJlcGxhY2UoJyU3QycsICd8JylcbiAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJTdEJywgJ30nKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuXG4vLyBFeHBvcnQgdGhlIG1haWxjaGVjayBvYmplY3QgaWYgd2UncmUgaW4gYSBDb21tb25KUyBlbnYgKGUuZy4gTm9kZSkuXG4vLyBNb2RlbGVkIG9mZiBvZiBVbmRlcnNjb3JlLmpzLlxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYWlsY2hlY2s7XG59XG5cbi8vIFN1cHBvcnQgQU1EIHN0eWxlIGRlZmluaXRpb25zXG4vLyBCYXNlZCBvbiBqUXVlcnkgKHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNzk1NDg4Mi8xMzIyNDEwKVxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShcIm1haWxjaGVja1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1haWxjaGVjaztcbiAgfSk7XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cualF1ZXJ5KSB7XG4gIChmdW5jdGlvbigkKXtcbiAgICAkLmZuLm1haWxjaGVjayA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmIChvcHRzLnN1Z2dlc3RlZCkge1xuICAgICAgICB2YXIgb2xkU3VnZ2VzdGVkID0gb3B0cy5zdWdnZXN0ZWQ7XG4gICAgICAgIG9wdHMuc3VnZ2VzdGVkID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgb2xkU3VnZ2VzdGVkKHNlbGYsIHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmVtcHR5KSB7XG4gICAgICAgIHZhciBvbGRFbXB0eSA9IG9wdHMuZW1wdHk7XG4gICAgICAgIG9wdHMuZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBvbGRFbXB0eS5jYWxsKG51bGwsIHNlbGYpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcHRzLmVtYWlsID0gdGhpcy52YWwoKTtcbiAgICAgIE1haWxjaGVjay5ydW4ob3B0cyk7XG4gICAgfVxuICB9KShqUXVlcnkpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92ZW5kb3IvbWFpbGNoZWNrL3NyYy9tYWlsY2hlY2suanNcbi8vIG1vZHVsZSBpZCA9IDg3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCA1IDggOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50JyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICAgIDtcblxudmFyXG4gICAgTEFSR0UgPSAnbGFyZ2UnLFxuICAgIERJU0FCTEVEID0gJ2Rpc2FibGVkJyxcbiAgICBMT0FESU5HID0gJ2ljb24gbG9hZGluZycsXG4gICAgREVDT1JBVEVEID0gJ2RlY29yYXRlZCcsXG4gICAgRVJST1IgPSAnZXJyb3InLFxuICAgIElOID0gJ2luJ1xuICAgIDtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQuZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWwnKSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2xhc3NlczogZnVuY3Rpb24oc3RhdGUsIGxhcmdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldCgpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChkYXRhLnN0YXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5kaXNhYmxlZCB8fCBkYXRhLnN0YXRlLnN1Ym1pdHRpbmcpIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmxvYWRpbmcpIGNsYXNzZXMucHVzaChMT0FESU5HKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUuZXJyb3IpIGNsYXNzZXMucHVzaChFUlJPUik7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sYXJnZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goREVDT1JBVEVEKTtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKExBUkdFKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSB8fCBkYXRhLmZvY3VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goSU4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9ic2VydmUoJ3ZhbHVlJywgZnVuY3Rpb24oKSB7ICBpZiAodGhpcy5nZXQoJ2Vycm9yJykpIHRoaXMuc2V0KCdlcnJvcicsIGZhbHNlKTsgfSwge2luaXQ6IGZhbHNlfSk7XG5cbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSlcbiAgICAgICAgICAgIC5vbignZm9jdXMuYXBpJywgZnVuY3Rpb24oKSB7IHZpZXcuc2V0KCdmb2N1cycsIHRydWUpOyB9KVxuICAgICAgICAgICAgLm9uKCdibHVyLmFwaScsIGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgnZm9jdXMnLCBmYWxzZSk7IH0pO1xuICAgIH0sXG5cbiAgICBvbnRlYXJkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpLm9mZignLmFwaScpO1xuICAgIH0sXG5cblxuICAgIGluYzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ID0gXy5wYXJzZUludCh0aGlzLmdldCgndmFsdWUnKSkgKyAxO1xuXG4gICAgICAgIGlmICh2IDw9IHRoaXMuZ2V0KCdtYXgnKSlcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xuICAgIH0sXG5cbiAgICBkZWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdiA9IF8ucGFyc2VJbnQodGhpcy5nZXQoJ3ZhbHVlJykpIC0gMTtcblxuICAgICAgICBpZiAodiA+PSB0aGlzLmdldCgnbWluJykpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb3JlL2Zvcm0vc3Bpbm5lci5qc1xuLy8gbW9kdWxlIGlkID0gMzE4XG4vLyBtb2R1bGUgY2h1bmtzID0gNSA2IDggOSIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgc2VsZWN0aW9uIGlucHV0IHNwaW5uZXIgZHJvcGRvd24gaW4gXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcImVycm9yXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjbGFzc2VzXCIsXCJzdGF0ZVwiLFwibGFyZ2VcIixcInZhbHVlXCJdLFwic1wiOlwiXzAoXzEsXzIsXzMpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiaGlkZGVuXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInZhbHVlXCJ9XX19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwbGFjZWhvbGRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwbGFjZWhvbGRlclwifV19XSxcIm5cIjo1MCxcInJcIjpcImxhcmdlXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRleHRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzcGlubmVyIGJ1dHRvbiBpbmNcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJpbmNcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIitcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNwaW5uZXIgYnV0dG9uIGRlY1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImRlY1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiLVwiXX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDMxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDUgNiA4IDkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ2ludGwtdGVsLWlucHV0L2J1aWxkL2pzL2ludGxUZWxJbnB1dCcpO1xuXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcbiAgICBcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcblxuXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcyxcbiAgICAgICAgICAgIGlucHV0ID0gJCh0aGlzLmZpbmQoJ2lucHV0JykpXG4gICAgICAgICAgICA7XG5cblxuICAgICAgICBpbnB1dC5pbnRsVGVsSW5wdXQoe1xuICAgICAgICAgICAgYXV0b1BsYWNlaG9sZGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHByZWZlcnJlZENvdW50cmllczogWydpbicsJ3VzJywnZ2InLCdydSddLFxuICAgICAgICAgICAgbmF0aW9uYWxNb2RlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgLypcbiAgICAgICAgaW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pOyovXG4gICAgfSxcblxuICAgIG9udGVhZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5pbnRsVGVsSW5wdXQoJ2Rlc3Ryb3knKTtcbiAgICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvcmUvZm9ybS90ZWwuanNcbi8vIG1vZHVsZSBpZCA9IDM3NVxuLy8gbW9kdWxlIGNodW5rcyA9IDggOSIsIi8qXG5JbnRlcm5hdGlvbmFsIFRlbGVwaG9uZSBJbnB1dCB2NS44Ljdcbmh0dHBzOi8vZ2l0aHViLmNvbS9CbHVlZmllbGRzY29tL2ludGwtdGVsLWlucHV0LmdpdFxuKi9cbi8vIHdyYXAgaW4gVU1EIC0gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvanF1ZXJ5UGx1Z2luLmpzXG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWyBcImpxdWVyeVwiIF0sIGZ1bmN0aW9uKCQpIHtcbiAgICAgICAgICAgIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiAgICB9XG59KShmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyB0aGVzZSB2YXJzIHBlcnNpc3QgdGhyb3VnaCBhbGwgaW5zdGFuY2VzIG9mIHRoZSBwbHVnaW5cbiAgICB2YXIgcGx1Z2luTmFtZSA9IFwiaW50bFRlbElucHV0XCIsIGlkID0gMSwgLy8gZ2l2ZSBlYWNoIGluc3RhbmNlIGl0J3Mgb3duIGlkIGZvciBuYW1lc3BhY2VkIGV2ZW50IGhhbmRsaW5nXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHR5cGluZyBkaWdpdHMgYWZ0ZXIgYSB2YWxpZCBudW1iZXIgd2lsbCBiZSBhZGRlZCB0byB0aGUgZXh0ZW5zaW9uIHBhcnQgb2YgdGhlIG51bWJlclxuICAgICAgICBhbGxvd0V4dGVuc2lvbnM6IGZhbHNlLFxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IGZvcm1hdCB0aGUgbnVtYmVyIGFjY29yZGluZyB0byB0aGUgc2VsZWN0ZWQgY291bnRyeVxuICAgICAgICBhdXRvRm9ybWF0OiB0cnVlLFxuICAgICAgICAvLyBhZGQgb3IgcmVtb3ZlIGlucHV0IHBsYWNlaG9sZGVyIHdpdGggYW4gZXhhbXBsZSBudW1iZXIgZm9yIHRoZSBzZWxlY3RlZCBjb3VudHJ5XG4gICAgICAgIGF1dG9QbGFjZWhvbGRlcjogdHJ1ZSxcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMganVzdCBhIGRpYWwgY29kZSBpbiB0aGUgaW5wdXQ6IHJlbW92ZSBpdCBvbiBibHVyLCBhbmQgcmUtYWRkIGl0IG9uIGZvY3VzXG4gICAgICAgIGF1dG9IaWRlRGlhbENvZGU6IHRydWUsXG4gICAgICAgIC8vIGRlZmF1bHQgY291bnRyeVxuICAgICAgICBkZWZhdWx0Q291bnRyeTogXCJcIixcbiAgICAgICAgLy8gdG9rZW4gZm9yIGlwaW5mbyAtIHJlcXVpcmVkIGZvciBodHRwcyBvciBvdmVyIDEwMDAgZGFpbHkgcGFnZSB2aWV3cyBzdXBwb3J0XG4gICAgICAgIGlwaW5mb1Rva2VuOiBcIlwiLFxuICAgICAgICAvLyBkb24ndCBpbnNlcnQgaW50ZXJuYXRpb25hbCBkaWFsIGNvZGVzXG4gICAgICAgIG5hdGlvbmFsTW9kZTogdHJ1ZSxcbiAgICAgICAgLy8gbnVtYmVyIHR5cGUgdG8gdXNlIGZvciBwbGFjZWhvbGRlcnNcbiAgICAgICAgbnVtYmVyVHlwZTogXCJNT0JJTEVcIixcbiAgICAgICAgLy8gZGlzcGxheSBvbmx5IHRoZXNlIGNvdW50cmllc1xuICAgICAgICBvbmx5Q291bnRyaWVzOiBbXSxcbiAgICAgICAgLy8gdGhlIGNvdW50cmllcyBhdCB0aGUgdG9wIG9mIHRoZSBsaXN0LiBkZWZhdWx0cyB0byB1bml0ZWQgc3RhdGVzIGFuZCB1bml0ZWQga2luZ2RvbVxuICAgICAgICBwcmVmZXJyZWRDb3VudHJpZXM6IFsgXCJ1c1wiLCBcImdiXCIgXSxcbiAgICAgICAgLy8gc3BlY2lmeSB0aGUgcGF0aCB0byB0aGUgbGlicGhvbmVudW1iZXIgc2NyaXB0IHRvIGVuYWJsZSB2YWxpZGF0aW9uL2Zvcm1hdHRpbmdcbiAgICAgICAgdXRpbHNTY3JpcHQ6IFwiXCJcbiAgICB9LCBrZXlzID0ge1xuICAgICAgICBVUDogMzgsXG4gICAgICAgIERPV046IDQwLFxuICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgIEVTQzogMjcsXG4gICAgICAgIFBMVVM6IDQzLFxuICAgICAgICBBOiA2NSxcbiAgICAgICAgWjogOTAsXG4gICAgICAgIFpFUk86IDQ4LFxuICAgICAgICBOSU5FOiA1NyxcbiAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICBCU1BBQ0U6IDgsXG4gICAgICAgIERFTDogNDYsXG4gICAgICAgIENUUkw6IDE3LFxuICAgICAgICBDTUQxOiA5MSxcbiAgICAgICAgLy8gQ2hyb21lXG4gICAgICAgIENNRDI6IDIyNFxuICAgIH0sIHdpbmRvd0xvYWRlZCA9IGZhbHNlO1xuICAgIC8vIGtlZXAgdHJhY2sgb2YgaWYgdGhlIHdpbmRvdy5sb2FkIGV2ZW50IGhhcyBmaXJlZCBhcyBpbXBvc3NpYmxlIHRvIGNoZWNrIGFmdGVyIHRoZSBmYWN0XG4gICAgJCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvd0xvYWRlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gUGx1Z2luKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgLy8gZXZlbnQgbmFtZXNwYWNlXG4gICAgICAgIHRoaXMubnMgPSBcIi5cIiArIHBsdWdpbk5hbWUgKyBpZCsrO1xuICAgICAgICAvLyBDaHJvbWUsIEZGLCBTYWZhcmksIElFOStcbiAgICAgICAgdGhpcy5pc0dvb2RCcm93c2VyID0gQm9vbGVhbihlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKTtcbiAgICAgICAgdGhpcy5oYWRJbml0aWFsUGxhY2Vob2xkZXIgPSBCb29sZWFuKCQoZWxlbWVudCkuYXR0cihcInBsYWNlaG9sZGVyXCIpKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IHBsdWdpbk5hbWU7XG4gICAgfVxuICAgIFBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgICAgIF9pbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGlmIGluIG5hdGlvbmFsTW9kZSwgZGlzYWJsZSBvcHRpb25zIHJlbGF0aW5nIHRvIGRpYWwgY29kZXNcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElFIE1vYmlsZSBkb2Vzbid0IHN1cHBvcnQgdGhlIGtleXByZXNzIGV2ZW50IChzZWUgaXNzdWUgNjgpIHdoaWNoIG1ha2VzIGF1dG9Gb3JtYXQgaW1wb3NzaWJsZVxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlL2kpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmF1dG9Gb3JtYXQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBqdXN0IHRlc3Qgc2NyZWVuIHNpemUgYXMgc29tZSBzbWFydHBob25lcy93ZWJzaXRlIG1ldGEgdGFncyB3aWxsIHJlcG9ydCBkZXNrdG9wIHJlc29sdXRpb25zXG4gICAgICAgICAgICAvLyBOb3RlOiBmb3Igc29tZSByZWFzb24gamFzbWluZSBmdWNrcyB1cCBpZiB5b3UgcHV0IHRoaXMgaW4gdGhlIG1haW4gUGx1Z2luIGZ1bmN0aW9uIHdpdGggdGhlIHJlc3Qgb2YgdGhlc2UgZGVjbGFyYXRpb25zXG4gICAgICAgICAgICAvLyBOb3RlOiB0byB0YXJnZXQgQW5kcm9pZCBNb2JpbGVzIChhbmQgbm90IFRhYmxldHMpLCB3ZSBtdXN0IGZpbmQgXCJBbmRyb2lkXCIgYW5kIFwiTW9iaWxlXCJcbiAgICAgICAgICAgIHRoaXMuaXNNb2JpbGUgPSAvQW5kcm9pZC4rTW9iaWxlfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgICAgIC8vIHdlIHJldHVybiB0aGVzZSBkZWZlcnJlZCBvYmplY3RzIGZyb20gdGhlIF9pbml0KCkgY2FsbCBzbyB0aGV5IGNhbiBiZSB3YXRjaGVkLCBhbmQgdGhlbiB3ZSByZXNvbHZlIHRoZW0gd2hlbiBlYWNoIHNwZWNpZmljIHJlcXVlc3QgcmV0dXJuc1xuICAgICAgICAgICAgLy8gTm90ZTogYWdhaW4sIGphc21pbmUgaGFkIGEgc3Bhenogd2hlbiBJIHB1dCB0aGVzZSBpbiB0aGUgUGx1Z2luIGZ1bmN0aW9uXG4gICAgICAgICAgICB0aGlzLmF1dG9Db3VudHJ5RGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgdGhpcy51dGlsc1NjcmlwdERlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgICAgIC8vIHByb2Nlc3MgYWxsIHRoZSBkYXRhOiBvbmx5Q291bnRyaWVzLCBwcmVmZXJyZWRDb3VudHJpZXMgZXRjXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzQ291bnRyeURhdGEoKTtcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIHRoZSBtYXJrdXBcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlTWFya3VwKCk7XG4gICAgICAgICAgICAvLyBzZXQgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIGlucHV0IHZhbHVlIGFuZCB0aGUgc2VsZWN0ZWQgZmxhZ1xuICAgICAgICAgICAgdGhpcy5fc2V0SW5pdGlhbFN0YXRlKCk7XG4gICAgICAgICAgICAvLyBzdGFydCBhbGwgb2YgdGhlIGV2ZW50IGxpc3RlbmVyczogYXV0b0hpZGVEaWFsQ29kZSwgaW5wdXQga2V5ZG93biwgc2VsZWN0ZWRGbGFnIGNsaWNrXG4gICAgICAgICAgICB0aGlzLl9pbml0TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAvLyB1dGlscyBzY3JpcHQsIGFuZCBhdXRvIGNvdW50cnlcbiAgICAgICAgICAgIHRoaXMuX2luaXRSZXF1ZXN0cygpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBkZWZlcnJlZHNcbiAgICAgICAgICAgIHJldHVybiBbIHRoaXMuYXV0b0NvdW50cnlEZWZlcnJlZCwgdGhpcy51dGlsc1NjcmlwdERlZmVycmVkIF07XG4gICAgICAgIH0sXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKlxuICAgKiAgUFJJVkFURSBNRVRIT0RTXG4gICAqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgLy8gcHJlcGFyZSBhbGwgb2YgdGhlIGNvdW50cnkgZGF0YSwgaW5jbHVkaW5nIG9ubHlDb3VudHJpZXMgYW5kIHByZWZlcnJlZENvdW50cmllcyBvcHRpb25zXG4gICAgICAgIF9wcm9jZXNzQ291bnRyeURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gc2V0IHRoZSBpbnN0YW5jZXMgY291bnRyeSBkYXRhIG9iamVjdHNcbiAgICAgICAgICAgIHRoaXMuX3NldEluc3RhbmNlQ291bnRyeURhdGEoKTtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgcHJlZmVycmVkQ291bnRyaWVzIHByb3BlcnR5XG4gICAgICAgICAgICB0aGlzLl9zZXRQcmVmZXJyZWRDb3VudHJpZXMoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gYWRkIGEgY291bnRyeSBjb2RlIHRvIHRoaXMuY291bnRyeUNvZGVzXG4gICAgICAgIF9hZGRDb3VudHJ5Q29kZTogZnVuY3Rpb24oaXNvMiwgZGlhbENvZGUsIHByaW9yaXR5KSB7XG4gICAgICAgICAgICBpZiAoIShkaWFsQ29kZSBpbiB0aGlzLmNvdW50cnlDb2RlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlDb2Rlc1tkaWFsQ29kZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpbmRleCA9IHByaW9yaXR5IHx8IDA7XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlDb2Rlc1tkaWFsQ29kZV1baW5kZXhdID0gaXNvMjtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHJvY2VzcyBvbmx5Q291bnRyaWVzIGFycmF5IGlmIHByZXNlbnQsIGFuZCBnZW5lcmF0ZSB0aGUgY291bnRyeUNvZGVzIG1hcFxuICAgICAgICBfc2V0SW5zdGFuY2VDb3VudHJ5RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIC8vIHByb2Nlc3Mgb25seUNvdW50cmllcyBvcHRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25seUNvdW50cmllcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBzdGFuZGFyZGlzZSBjYXNlXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5vbmx5Q291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbmx5Q291bnRyaWVzW2ldID0gdGhpcy5vcHRpb25zLm9ubHlDb3VudHJpZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgaW5zdGFuY2UgY291bnRyeSBhcnJheVxuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyaWVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFsbENvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGFsbENvdW50cmllc1tpXS5pc28yLCB0aGlzLm9wdGlvbnMub25seUNvdW50cmllcykgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnRyaWVzLnB1c2goYWxsQ291bnRyaWVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJpZXMgPSBhbGxDb3VudHJpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBjb3VudHJ5Q29kZXMgbWFwXG4gICAgICAgICAgICB0aGlzLmNvdW50cnlDb2RlcyA9IHt9O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmNvdW50cmllc1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hZGRDb3VudHJ5Q29kZShjLmlzbzIsIGMuZGlhbENvZGUsIGMucHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgIC8vIGFyZWEgY29kZXNcbiAgICAgICAgICAgICAgICBpZiAoYy5hcmVhQ29kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjLmFyZWFDb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnVsbCBkaWFsIGNvZGUgaXMgY291bnRyeSBjb2RlICsgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRDb3VudHJ5Q29kZShjLmlzbzIsIGMuZGlhbENvZGUgKyBjLmFyZWFDb2Rlc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHByb2Nlc3MgcHJlZmVycmVkIGNvdW50cmllcyAtIGl0ZXJhdGUgdGhyb3VnaCB0aGUgcHJlZmVyZW5jZXMsXG4gICAgICAgIC8vIGZldGNoaW5nIHRoZSBjb3VudHJ5IGRhdGEgZm9yIGVhY2ggb25lXG4gICAgICAgIF9zZXRQcmVmZXJyZWRDb3VudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wcmVmZXJyZWRDb3VudHJpZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLnByZWZlcnJlZENvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb3VudHJ5Q29kZSA9IHRoaXMub3B0aW9ucy5wcmVmZXJyZWRDb3VudHJpZXNbaV0udG9Mb3dlckNhc2UoKSwgY291bnRyeURhdGEgPSB0aGlzLl9nZXRDb3VudHJ5RGF0YShjb3VudHJ5Q29kZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChjb3VudHJ5RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWZlcnJlZENvdW50cmllcy5wdXNoKGNvdW50cnlEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdlbmVyYXRlIGFsbCBvZiB0aGUgbWFya3VwIGZvciB0aGUgcGx1Z2luOiB0aGUgc2VsZWN0ZWQgZmxhZyBvdmVybGF5LCBhbmQgdGhlIGRyb3Bkb3duXG4gICAgICAgIF9nZW5lcmF0ZU1hcmt1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyB0ZWxlcGhvbmUgaW5wdXRcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQgPSAkKHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAvLyBwcmV2ZW50IGF1dG9jb21wbGV0ZSBhcyB0aGVyZSdzIG5vIHNhZmUsIGNyb3NzLWJyb3dzZXIgZXZlbnQgd2UgY2FuIHJlYWN0IHRvLCBzbyBpdCBjYW4gZWFzaWx5IHB1dCB0aGUgcGx1Z2luIGluIGFuIGluY29uc2lzdGVudCBzdGF0ZSBlLmcuIHRoZSB3cm9uZyBmbGFnIHNlbGVjdGVkIGZvciB0aGUgYXV0b2NvbXBsZXRlZCBudW1iZXIsIHdoaWNoIG9uIHN1Ym1pdCBjb3VsZCBtZWFuIHRoZSB3cm9uZyBudW1iZXIgaXMgc2F2ZWQgKGVzcCBpbiBuYXRpb25hbE1vZGUpXG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LmF0dHIoXCJhdXRvY29tcGxldGVcIiwgXCJvZmZcIik7XG4gICAgICAgICAgICAvLyBjb250YWluZXJzIChtb3N0bHkgZm9yIHBvc2l0aW9uaW5nKVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC53cmFwKCQoXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImludGwtdGVsLWlucHV0XCJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHZhciBmbGFnc0NvbnRhaW5lciA9ICQoXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImZsYWctZHJvcGRvd25cIlxuICAgICAgICAgICAgfSkuaW5zZXJ0QWZ0ZXIodGhpcy50ZWxJbnB1dCk7XG4gICAgICAgICAgICAvLyBjdXJyZW50bHkgc2VsZWN0ZWQgZmxhZyAoZGlzcGxheWVkIHRvIGxlZnQgb2YgaW5wdXQpXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRGbGFnID0gJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic2VsZWN0ZWQtZmxhZ1wiXG4gICAgICAgICAgICB9KS5hcHBlbmRUbyhmbGFnc0NvbnRhaW5lcik7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyID0gJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaXRpLWZsYWdcIlxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oc2VsZWN0ZWRGbGFnKTtcbiAgICAgICAgICAgIC8vIENTUyB0cmlhbmdsZVxuICAgICAgICAgICAgJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYXJyb3dcIlxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oc2VsZWN0ZWRGbGFnKTtcbiAgICAgICAgICAgIC8vIGNvdW50cnkgbGlzdFxuICAgICAgICAgICAgLy8gbW9iaWxlIGlzIGp1c3QgYSBuYXRpdmUgc2VsZWN0IGVsZW1lbnRcbiAgICAgICAgICAgIC8vIGRlc2t0b3AgaXMgYSBwcm9wZXIgbGlzdCBjb250YWluaW5nOiBwcmVmZXJyZWQgY291bnRyaWVzLCB0aGVuIGRpdmlkZXIsIHRoZW4gYWxsIGNvdW50cmllc1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0ID0gJChcIjxzZWxlY3Q+XCIpLmFwcGVuZFRvKGZsYWdzQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdCA9ICQoXCI8dWw+XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNvdW50cnktbGlzdCB2LWhpZGVcIlxuICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKGZsYWdzQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVmZXJyZWRDb3VudHJpZXMubGVuZ3RoICYmICF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FwcGVuZExpc3RJdGVtcyh0aGlzLnByZWZlcnJlZENvdW50cmllcywgXCJwcmVmZXJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCI8bGk+XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkaXZpZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8odGhpcy5jb3VudHJ5TGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYXBwZW5kTGlzdEl0ZW1zKHRoaXMuY291bnRyaWVzLCBcIlwiKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vIG5vdyB3ZSBjYW4gZ3JhYiB0aGUgZHJvcGRvd24gaGVpZ2h0LCBhbmQgaGlkZSBpdCBwcm9wZXJseVxuICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd25IZWlnaHQgPSB0aGlzLmNvdW50cnlMaXN0Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5yZW1vdmVDbGFzcyhcInYtaGlkZVwiKS5hZGRDbGFzcyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyB1c2VmdWwgaW4gbG90cyBvZiBwbGFjZXNcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0SXRlbXMgPSB0aGlzLmNvdW50cnlMaXN0LmNoaWxkcmVuKFwiLmNvdW50cnlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFkZCBhIGNvdW50cnkgPGxpPiB0byB0aGUgY291bnRyeUxpc3QgPHVsPiBjb250YWluZXJcbiAgICAgICAgLy8gVVBEQVRFOiBpZiBpc01vYmlsZSwgYWRkIGFuIDxvcHRpb24+IHRvIHRoZSBjb3VudHJ5TGlzdCA8c2VsZWN0PiBjb250YWluZXJcbiAgICAgICAgX2FwcGVuZExpc3RJdGVtczogZnVuY3Rpb24oY291bnRyaWVzLCBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIC8vIHdlIGNyZWF0ZSBzbyBtYW55IERPTSBlbGVtZW50cywgaXQgaXMgZmFzdGVyIHRvIGJ1aWxkIGEgdGVtcCBzdHJpbmdcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGFkZCBldmVyeXRoaW5nIHRvIHRoZSBET00gaW4gb25lIGdvIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIHZhciB0bXAgPSBcIlwiO1xuICAgICAgICAgICAgLy8gZm9yIGVhY2ggY291bnRyeVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGNvdW50cmllc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8b3B0aW9uIGRhdGEtZGlhbC1jb2RlPSdcIiArIGMuZGlhbENvZGUgKyBcIicgdmFsdWU9J1wiICsgYy5pc28yICsgXCInPlwiO1xuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gYy5uYW1lICsgXCIgK1wiICsgYy5kaWFsQ29kZTtcbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPC9vcHRpb24+XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb3BlbiB0aGUgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxsaSBjbGFzcz0nY291bnRyeSBcIiArIGNsYXNzTmFtZSArIFwiJyBkYXRhLWRpYWwtY29kZT0nXCIgKyBjLmRpYWxDb2RlICsgXCInIGRhdGEtY291bnRyeS1jb2RlPSdcIiArIGMuaXNvMiArIFwiJz5cIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxkaXYgY2xhc3M9J2ZsYWcnPjxkaXYgY2xhc3M9J2l0aS1mbGFnIFwiICsgYy5pc28yICsgXCInPjwvZGl2PjwvZGl2PlwiO1xuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlIGNvdW50cnkgbmFtZSBhbmQgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxzcGFuIGNsYXNzPSdjb3VudHJ5LW5hbWUnPlwiICsgYy5uYW1lICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxzcGFuIGNsYXNzPSdkaWFsLWNvZGUnPitcIiArIGMuZGlhbENvZGUgKyBcIjwvc3Bhbj5cIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2UgdGhlIGxpc3QgaXRlbVxuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8L2xpPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QuYXBwZW5kKHRtcCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNldCB0aGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgaW5wdXQgdmFsdWUgYW5kIHRoZSBzZWxlY3RlZCBmbGFnXG4gICAgICAgIF9zZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudGVsSW5wdXQudmFsKCk7XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIG51bWJlciwgYW5kIGl0J3MgdmFsaWQsIHdlIGNhbiBnbyBhaGVhZCBhbmQgc2V0IHRoZSBmbGFnLCBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0XG4gICAgICAgICAgICBpZiAodGhpcy5fZ2V0RGlhbENvZGUodmFsKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUZsYWdGcm9tTnVtYmVyKHZhbCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSAhPSBcImF1dG9cIikge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRoZSBkZWZhdWx0Q291bnRyeSBvcHRpb24sIGVsc2UgZmFsbCBiYWNrIHRvIHRoZSBmaXJzdCBpbiB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID0gdGhpcy5fZ2V0Q291bnRyeURhdGEodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5LnRvTG93ZXJDYXNlKCksIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID0gdGhpcy5wcmVmZXJyZWRDb3VudHJpZXMubGVuZ3RoID8gdGhpcy5wcmVmZXJyZWRDb3VudHJpZXNbMF0gOiB0aGlzLmNvdW50cmllc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0RmxhZyh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkuaXNvMik7XG4gICAgICAgICAgICAgICAgLy8gaWYgZW1wdHksIGluc2VydCB0aGUgZGVmYXVsdCBkaWFsIGNvZGUgKHRoaXMgZnVuY3Rpb24gd2lsbCBjaGVjayAhbmF0aW9uYWxNb2RlIGFuZCAhYXV0b0hpZGVEaWFsQ29kZSlcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEaWFsQ29kZSh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkuZGlhbENvZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBmb3JtYXRcbiAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHdvbnQgYmUgcnVuIGFmdGVyIF91cGRhdGVEaWFsQ29kZSBhcyB0aGF0J3Mgb25seSBjYWxsZWQgaWYgbm8gdmFsXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGluaXRpYWxpc2UgdGhlIG1haW4gZXZlbnQgbGlzdGVuZXJzOiBpbnB1dCBrZXl1cCwgYW5kIGNsaWNrIHNlbGVjdGVkIGZsYWdcbiAgICAgICAgX2luaXRMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5faW5pdEtleUxpc3RlbmVycygpO1xuICAgICAgICAgICAgLy8gYXV0b0Zvcm1hdCBwcmV2ZW50cyB0aGUgY2hhbmdlIGV2ZW50IGZyb20gZmlyaW5nLCBzbyB3ZSBuZWVkIHRvIGNoZWNrIGZvciBjaGFuZ2VzIGJldHdlZW4gZm9jdXMgYW5kIGJsdXIgaW4gb3JkZXIgdG8gbWFudWFsbHkgdHJpZ2dlciBpdFxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlIHx8IHRoaXMub3B0aW9ucy5hdXRvRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdEZvY3VzTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3Qub24oXCJjaGFuZ2VcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fc2VsZWN0TGlzdEl0ZW0oJCh0aGlzKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaGFjayBmb3IgaW5wdXQgbmVzdGVkIGluc2lkZSBsYWJlbDogY2xpY2tpbmcgdGhlIHNlbGVjdGVkLWZsYWcgdG8gb3BlbiB0aGUgZHJvcGRvd24gd291bGQgdGhlbiBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgYSAybmQgY2xpY2sgb24gdGhlIGlucHV0IHdoaWNoIHdvdWxkIGNsb3NlIGl0IGFnYWluXG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy50ZWxJbnB1dC5jbG9zZXN0KFwibGFiZWxcIik7XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbC5vbihcImNsaWNrXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCB0aGVuIGZvY3VzIHRoZSBpbnB1dCwgZWxzZSBpZ25vcmUgdGhlIGNsaWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5jb3VudHJ5TGlzdC5oYXNDbGFzcyhcImhpZGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHRvZ2dsZSBjb3VudHJ5IGRyb3Bkb3duIG9uIGNsaWNrXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkRmxhZyA9IHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRGbGFnLm9uKFwiY2xpY2tcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSBpbnRlcmNlcHQgdGhpcyBldmVudCBpZiB3ZSdyZSBvcGVuaW5nIHRoZSBkcm9wZG93blxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGxldCBpdCBidWJibGUgdXAgdG8gdGhlIHRvcCAoXCJjbGljay1vZmYtdG8tY2xvc2VcIiBsaXN0ZW5lcilcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2Fubm90IGp1c3Qgc3RvcFByb3BhZ2F0aW9uIGFzIGl0IG1heSBiZSBuZWVkZWQgdG8gY2xvc2UgYW5vdGhlciBpbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5jb3VudHJ5TGlzdC5oYXNDbGFzcyhcImhpZGVcIikgJiYgIXRoYXQudGVsSW5wdXQucHJvcChcImRpc2FibGVkXCIpICYmICF0aGF0LnRlbElucHV0LnByb3AoXCJyZWFkb25seVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fc2hvd0Ryb3Bkb3duKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2luaXRSZXF1ZXN0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBoYXMgc3BlY2lmaWVkIHRoZSBwYXRoIHRvIHRoZSB1dGlscyBzY3JpcHQsIGZldGNoIGl0IG9uIHdpbmRvdy5sb2FkXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnV0aWxzU2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBsdWdpbiBpcyBiZWluZyBpbml0aWFsaXNlZCBhZnRlciB0aGUgd2luZG93LmxvYWQgZXZlbnQgaGFzIGFscmVhZHkgYmVlbiBmaXJlZFxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3dMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVXRpbHMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyB3YWl0IHVudGlsIHRoZSBsb2FkIGV2ZW50IHNvIHdlIGRvbid0IGJsb2NrIGFueSBvdGhlciByZXF1ZXN0cyBlLmcuIHRoZSBmbGFncyBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubG9hZFV0aWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dGlsc1NjcmlwdERlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPT0gXCJhdXRvXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkQXV0b0NvdW50cnkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvQ291bnRyeURlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2xvYWRBdXRvQ291bnRyeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgY29va2llXG4gICAgICAgICAgICB2YXIgY29va2llQXV0b0NvdW50cnkgPSAkLmNvb2tpZSA/ICQuY29va2llKFwiaXRpQXV0b0NvdW50cnlcIikgOiBcIlwiO1xuICAgICAgICAgICAgaWYgKGNvb2tpZUF1dG9Db3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgJC5mbltwbHVnaW5OYW1lXS5hdXRvQ291bnRyeSA9IGNvb2tpZUF1dG9Db3VudHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gMyBvcHRpb25zOlxuICAgICAgICAgICAgLy8gMSkgYWxyZWFkeSBsb2FkZWQgKHdlJ3JlIGRvbmUpXG4gICAgICAgICAgICAvLyAyKSBub3QgYWxyZWFkeSBzdGFydGVkIGxvYWRpbmcgKHN0YXJ0KVxuICAgICAgICAgICAgLy8gMykgYWxyZWFkeSBzdGFydGVkIGxvYWRpbmcgKGRvIG5vdGhpbmcgLSBqdXN0IHdhaXQgZm9yIGxvYWRpbmcgY2FsbGJhY2sgdG8gZmlyZSlcbiAgICAgICAgICAgIGlmICgkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvQ291bnRyeUxvYWRlZCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghJC5mbltwbHVnaW5OYW1lXS5zdGFydGVkTG9hZGluZ0F1dG9Db3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgZG8gdGhpcyB0d2ljZSFcbiAgICAgICAgICAgICAgICAkLmZuW3BsdWdpbk5hbWVdLnN0YXJ0ZWRMb2FkaW5nQXV0b0NvdW50cnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBpcGluZm9VUkwgPSBcIi8vaXBpbmZvLmlvXCI7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pcGluZm9Ub2tlbikge1xuICAgICAgICAgICAgICAgICAgICBpcGluZm9VUkwgKz0gXCI/dG9rZW49XCIgKyB0aGlzLm9wdGlvbnMuaXBpbmZvVG9rZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvbnQgYm90aGVyIHdpdGggdGhlIHN1Y2Nlc3MgZnVuY3Rpb24gYXJnIC0gaW5zdGVhZCB1c2UgYWx3YXlzKCkgYXMgc2hvdWxkIHN0aWxsIHNldCBhIGRlZmF1bHRDb3VudHJ5IGV2ZW4gaWYgdGhlIGxvb2t1cCBmYWlsc1xuICAgICAgICAgICAgICAgICQuZ2V0KGlwaW5mb1VSTCwgZnVuY3Rpb24oKSB7fSwgXCJqc29ucFwiKS5hbHdheXMoZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICAgICAgICAgICAgICAkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5ID0gcmVzcCAmJiByZXNwLmNvdW50cnkgPyByZXNwLmNvdW50cnkudG9Mb3dlckNhc2UoKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmNvb2tpZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoXCJpdGlBdXRvQ291bnRyeVwiLCAkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogXCIvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbGwgYWxsIGluc3RhbmNlcyB0aGUgYXV0byBjb3VudHJ5IGlzIHJlYWR5XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgc2hvdWxkIGp1c3QgYmUgdGhlIGN1cnJlbnQgaW5zdGFuY2VzXG4gICAgICAgICAgICAgICAgICAgICQoXCIuaW50bC10ZWwtaW5wdXQgaW5wdXRcIikuaW50bFRlbElucHV0KFwiYXV0b0NvdW50cnlMb2FkZWRcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9pbml0S2V5TGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIC8vIGZvcm1hdCBudW1iZXIgYW5kIHVwZGF0ZSBmbGFnIG9uIGtleXByZXNzXG4gICAgICAgICAgICAgICAgLy8gdXNlIGtleXByZXNzIGV2ZW50IGFzIHdlIHdhbnQgdG8gaWdub3JlIGFsbCBpbnB1dCBleGNlcHQgZm9yIGEgc2VsZWN0IGZldyBrZXlzLFxuICAgICAgICAgICAgICAgIC8vIGJ1dCB3ZSBkb250IHdhbnQgdG8gaWdub3JlIHRoZSBuYXZpZ2F0aW9uIGtleXMgbGlrZSB0aGUgYXJyb3dzIGV0Yy5cbiAgICAgICAgICAgICAgICAvLyBOT1RFOiBubyBwb2ludCBpbiByZWZhY3RvcmluZyB0aGlzIHRvIG9ubHkgYmluZCB0aGVzZSBsaXN0ZW5lcnMgb24gZm9jdXMvYmx1ciBiZWNhdXNlIHRoZW4geW91IHdvdWxkIG5lZWQgdG8gaGF2ZSB0aG9zZSAyIGxpc3RlbmVycyBydW5uaW5nIHRoZSB3aG9sZSB0aW1lIGFueXdheS4uLlxuICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJrZXlwcmVzc1wiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAzMiBpcyBzcGFjZSwgYW5kIGFmdGVyIHRoYXQgaXQncyBhbGwgY2hhcnMgKG5vdCBtZXRhL25hdiBrZXlzKVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGZpeCBpcyBuZWVkZWQgZm9yIEZpcmVmb3gsIHdoaWNoIHRyaWdnZXJzIGtleXByZXNzIGV2ZW50IGZvciBzb21lIG1ldGEvbmF2IGtleXNcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlOiBhbHNvIGlnbm9yZSBpZiB0aGlzIGlzIGEgbWV0YUtleSBlLmcuIEZGIGFuZCBTYWZhcmkgdHJpZ2dlciBrZXlwcmVzcyBvbiB0aGUgdiBvZiBDdHJsK3ZcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlOiBhbHNvIGlnbm9yZSBpZiBjdHJsS2V5IChGRiBvbiBXaW5kb3dzL1VidW50dSlcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlOiBhbHNvIGNoZWNrIHRoYXQgd2UgaGF2ZSB1dGlscyBiZWZvcmUgd2UgZG8gYW55IGF1dG9Gb3JtYXQgc3R1ZmZcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPj0ga2V5cy5TUEFDRSAmJiAhZS5jdHJsS2V5ICYmICFlLm1ldGFLZXkgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzICYmICF0aGF0LnRlbElucHV0LnByb3AoXCJyZWFkb25seVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsb3dlZCBrZXlzIGFyZSBqdXN0IG51bWVyaWMga2V5cyBhbmQgcGx1c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgbXVzdCBhbGxvdyBwbHVzIGZvciB0aGUgY2FzZSB3aGVyZSB0aGUgdXNlciBkb2VzIHNlbGVjdC1hbGwgYW5kIHRoZW4gaGl0cyBwbHVzIHRvIHN0YXJ0IHR5cGluZyBhIG5ldyBudW1iZXIuIHdlIGNvdWxkIHJlZmluZSB0aGlzIGxvZ2ljIHRvIGZpcnN0IGNoZWNrIHRoYXQgdGhlIHNlbGVjdGlvbiBjb250YWlucyBhIHBsdXMsIGJ1dCB0aGF0IHdvbnQgd29yayBpbiBvbGQgYnJvd3NlcnMsIGFuZCBJIHRoaW5rIGl0J3Mgb3ZlcmtpbGwgYW55d2F5XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNBbGxvd2VkS2V5ID0gZS53aGljaCA+PSBrZXlzLlpFUk8gJiYgZS53aGljaCA8PSBrZXlzLk5JTkUgfHwgZS53aGljaCA9PSBrZXlzLlBMVVMsIGlucHV0ID0gdGhhdC50ZWxJbnB1dFswXSwgbm9TZWxlY3Rpb24gPSB0aGF0LmlzR29vZEJyb3dzZXIgJiYgaW5wdXQuc2VsZWN0aW9uU3RhcnQgPT0gaW5wdXQuc2VsZWN0aW9uRW5kLCBtYXggPSB0aGF0LnRlbElucHV0LmF0dHIoXCJtYXhsZW5ndGhcIiksIHZhbCA9IHRoYXQudGVsSW5wdXQudmFsKCksIC8vIGFzc3VtZXMgdGhhdCBpZiBtYXggZXhpc3RzLCBpdCBpcyA+MFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNCZWxvd01heCA9IG1heCA/IHZhbC5sZW5ndGggPCBtYXggOiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Q6IGVuc3VyZSB3ZSBkb250IGdvIG92ZXIgbWF4bGVuZ3RoLiB3ZSBtdXN0IGRvIHRoaXMgaGVyZSB0byBwcmV2ZW50IGFkZGluZyBkaWdpdHMgaW4gdGhlIG1pZGRsZSBvZiB0aGUgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdGlsbCByZWZvcm1hdCBldmVuIGlmIG5vdCBhbiBhbGxvd2VkIGtleSBhcyB0aGV5IGNvdWxkIGJ5IHR5cGluZyBhIGZvcm1hdHRpbmcgY2hhciwgYnV0IGlnbm9yZSBpZiB0aGVyZSdzIGEgc2VsZWN0aW9uIGFzIGRvZXNuJ3QgbWFrZSBzZW5zZSB0byByZXBsYWNlIHNlbGVjdGlvbiB3aXRoIGlsbGVnYWwgY2hhciBhbmQgdGhlbiBpbW1lZGlhdGVseSByZW1vdmUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0JlbG93TWF4ICYmIChpc0FsbG93ZWRLZXkgfHwgbm9TZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0NoYXIgPSBpc0FsbG93ZWRLZXkgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVJbnB1dEtleShuZXdDaGFyLCB0cnVlLCBpc0FsbG93ZWRLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHNvbWV0aGluZyBoYXMgY2hhbmdlZCwgdHJpZ2dlciB0aGUgaW5wdXQgZXZlbnQgKHdoaWNoIHdhcyBvdGhlcndpc2VkIHNxdWFzaGVkIGJ5IHRoZSBwcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9IHRoYXQudGVsSW5wdXQudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FsbG93ZWRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVJbnZhbGlkS2V5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGhhbmRsZSBjdXQvcGFzdGUgZXZlbnQgKG5vdyBzdXBwb3J0ZWQgaW4gYWxsIG1ham9yIGJyb3dzZXJzKVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcImN1dFwiICsgdGhpcy5ucyArIFwiIHBhc3RlXCIgKyB0aGlzLm5zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBoYWNrIGJlY2F1c2UgXCJwYXN0ZVwiIGV2ZW50IGlzIGZpcmVkIGJlZm9yZSBpbnB1dCBpcyB1cGRhdGVkXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5hdXRvRm9ybWF0ICYmIHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnNvckF0RW5kID0gdGhhdC5pc0dvb2RCcm93c2VyICYmIHRoYXQudGVsSW5wdXRbMF0uc2VsZWN0aW9uU3RhcnQgPT0gdGhhdC50ZWxJbnB1dC52YWwoKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVJbnB1dEtleShudWxsLCBjdXJzb3JBdEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9lbnN1cmVQbHVzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBubyBhdXRvRm9ybWF0LCBqdXN0IHVwZGF0ZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll91cGRhdGVGbGFnRnJvbU51bWJlcih0aGF0LnRlbElucHV0LnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBoYW5kbGUga2V5dXAgZXZlbnRcbiAgICAgICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQgZW5hYmxlZDogd2UgdXNlIGtleXVwIHRvIGNhdGNoIGRlbGV0ZSBldmVudHMgKGFmdGVyIHRoZSBmYWN0KVxuICAgICAgICAgICAgLy8gaWYgbm8gYXV0b0Zvcm1hdCwgdGhpcyBpcyB1c2VkIHRvIHVwZGF0ZSB0aGUgZmxhZ1xuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcImtleXVwXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIFwiZW50ZXJcIiBrZXkgZXZlbnQgZnJvbSBzZWxlY3RpbmcgYSBkcm9wZG93biBpdGVtIGlzIHRyaWdnZXJlZCBoZXJlIG9uIHRoZSBpbnB1dCwgYmVjYXVzZSB0aGUgZG9jdW1lbnQua2V5ZG93biBoYW5kbGVyIHRoYXQgaW5pdGlhbGx5IGhhbmRsZXMgdGhhdCBldmVudCB0cmlnZ2VycyBhIGZvY3VzIG9uIHRoZSBpbnB1dCwgYW5kIHNvIHRoZSBrZXl1cCBmb3IgdGhhdCBzYW1lIGtleSBldmVudCBnZXRzIHRyaWdnZXJlZCBoZXJlLiB3ZWlyZCwgYnV0IGp1c3QgbWFrZSBzdXJlIHdlIGRvbnQgYm90aGVyIGRvaW5nIGFueSByZS1mb3JtYXR0aW5nIGluIHRoaXMgY2FzZSAod2UndmUgYWxyZWFkeSBkb25lIHByZXZlbnREZWZhdWx0IGluIHRoZSBrZXlkb3duIGhhbmRsZXIsIHNvIGl0IHdvbnQgYWN0dWFsbHkgc3VibWl0IHRoZSBmb3JtIG9yIGFueXRoaW5nKS5cbiAgICAgICAgICAgICAgICAvLyBBTFNPOiBpZ25vcmUga2V5dXAgaWYgcmVhZG9ubHlcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlzLkVOVEVSIHx8IHRoYXQudGVsSW5wdXQucHJvcChcInJlYWRvbmx5XCIpKSB7fSBlbHNlIGlmICh0aGF0Lm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY3Vyc29yQXRFbmQgZGVmYXVsdHMgdG8gZmFsc2UgZm9yIGJhZCBicm93c2VycyBlbHNlIHRoZXkgd291bGQgbmV2ZXIgZ2V0IGEgcmVmb3JtYXQgb24gZGVsZXRlXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJzb3JBdEVuZCA9IHRoYXQuaXNHb29kQnJvd3NlciAmJiB0aGF0LnRlbElucHV0WzBdLnNlbGVjdGlvblN0YXJ0ID09IHRoYXQudGVsSW5wdXQudmFsKCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQudGVsSW5wdXQudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXkganVzdCBjbGVhcmVkIHRoZSBpbnB1dCwgdXBkYXRlIHRoZSBmbGFnIHRvIHRoZSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll91cGRhdGVGbGFnRnJvbU51bWJlcihcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09IGtleXMuREVMICYmICFjdXJzb3JBdEVuZCB8fCBlLndoaWNoID09IGtleXMuQlNQQUNFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBkZWxldGUgaW4gdGhlIG1pZGRsZTogcmVmb3JtYXQgd2l0aCBubyBzdWZmaXggKG5vIG5lZWQgdG8gcmVmb3JtYXQgaWYgZGVsZXRlIGF0IGVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGJhY2tzcGFjZTogcmVmb3JtYXQgd2l0aCBubyBzdWZmaXggKG5lZWQgdG8gcmVmb3JtYXQgaWYgYXQgZW5kIHRvIHJlbW92ZSBhbnkgbGluZ2VyaW5nIHN1ZmZpeCAtIHRoaXMgaXMgYSBmZWF0dXJlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0YW50IHRvIHJlbWVtYmVyIG5ldmVyIHRvIGFkZCBzdWZmaXggb24gYW55IGRlbGV0ZSBrZXkgYXMgY2FuIGZ1Y2sgdXAgaW4gaWU4IHNvIHlvdSBjYW4gbmV2ZXIgZGVsZXRlIGEgZm9ybWF0dGluZyBjaGFyIGF0IHRoZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZUlucHV0S2V5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fZW5zdXJlUGx1cygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGF1dG9Gb3JtYXQsIGp1c3QgdXBkYXRlIGZsYWdcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fdXBkYXRlRmxhZ0Zyb21OdW1iZXIodGhhdC50ZWxJbnB1dC52YWwoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHByZXZlbnQgZGVsZXRpbmcgdGhlIHBsdXMgKGlmIG5vdCBpbiBuYXRpb25hbE1vZGUpXG4gICAgICAgIF9lbnN1cmVQbHVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnRlbElucHV0LnZhbCgpLCBpbnB1dCA9IHRoaXMudGVsSW5wdXRbMF07XG4gICAgICAgICAgICAgICAgaWYgKHZhbC5jaGFyQXQoMCkgIT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV3Q3Vyc29yUG9zIGlzIGN1cnJlbnQgcG9zICsgMSB0byBhY2NvdW50IGZvciB0aGUgcGx1cyB3ZSBhcmUgYWJvdXQgdG8gYWRkXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdDdXJzb3JQb3MgPSB0aGlzLmlzR29vZEJyb3dzZXIgPyBpbnB1dC5zZWxlY3Rpb25TdGFydCArIDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0LnZhbChcIitcIiArIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzR29vZEJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnNldFNlbGVjdGlvblJhbmdlKG5ld0N1cnNvclBvcywgbmV3Q3Vyc29yUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gYWxlcnQgdGhlIHVzZXIgdG8gYW4gaW52YWxpZCBrZXkgZXZlbnRcbiAgICAgICAgX2hhbmRsZUludmFsaWRLZXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC50cmlnZ2VyKFwiaW52YWxpZGtleVwiKS5hZGRDbGFzcyhcIml0aS1pbnZhbGlkLWtleVwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5yZW1vdmVDbGFzcyhcIml0aS1pbnZhbGlkLWtleVwiKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHdoZW4gYXV0b0Zvcm1hdCBpcyBlbmFibGVkOiBoYW5kbGUgdmFyaW91cyBrZXkgZXZlbnRzIG9uIHRoZSBpbnB1dDpcbiAgICAgICAgLy8gMSkgYWRkaW5nIGEgbmV3IG51bWJlciBjaGFyYWN0ZXIsIHdoaWNoIHdpbGwgcmVwbGFjZSBhbnkgc2VsZWN0aW9uLCByZWZvcm1hdCwgYW5kIHByZXNlcnZlIHRoZSBjdXJzb3IgcG9zaXRpb25cbiAgICAgICAgLy8gMikgcmVmb3JtYXR0aW5nIG9uIGJhY2tzcGFjZS9kZWxldGVcbiAgICAgICAgLy8gMykgY3V0L3Bhc3RlIGV2ZW50XG4gICAgICAgIF9oYW5kbGVJbnB1dEtleTogZnVuY3Rpb24obmV3TnVtZXJpY0NoYXIsIGFkZFN1ZmZpeCwgaXNBbGxvd2VkS2V5KSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy50ZWxJbnB1dC52YWwoKSwgY2xlYW5CZWZvcmUgPSB0aGlzLl9nZXRDbGVhbih2YWwpLCBvcmlnaW5hbExlZnRDaGFycywgLy8gcmF3IERPTSBlbGVtZW50XG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMudGVsSW5wdXRbMF0sIGRpZ2l0c09uUmlnaHQgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIC8vIGN1cnNvciBzdHJhdGVneTogbWFpbnRhaW4gdGhlIG51bWJlciBvZiBkaWdpdHMgb24gdGhlIHJpZ2h0LiB3ZSB1c2UgdGhlIHJpZ2h0IGluc3RlYWQgb2YgdGhlIGxlZnQgc28gdGhhdCBBKSB3ZSBkb250IGhhdmUgdG8gYWNjb3VudCBmb3IgdGhlIG5ldyBkaWdpdCAob3IgbXVsdGlwbGUgZGlnaXRzIGlmIHBhc3RlIGV2ZW50KSwgYW5kIEIpIHdlJ3JlIGFsd2F5cyBvbiB0aGUgcmlnaHQgc2lkZSBvZiBmb3JtYXR0aW5nIHN1ZmZpeGVzXG4gICAgICAgICAgICAgICAgZGlnaXRzT25SaWdodCA9IHRoaXMuX2dldERpZ2l0c09uUmlnaHQodmFsLCBpbnB1dC5zZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGhhbmRsaW5nIGEgbmV3IG51bWJlciBjaGFyYWN0ZXI6IGluc2VydCBpdCBpbiB0aGUgcmlnaHQgcGxhY2VcbiAgICAgICAgICAgICAgICBpZiAobmV3TnVtZXJpY0NoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBhbnkgc2VsZWN0aW9uIHRoZXkgbWF5IGhhdmUgbWFkZSB3aXRoIHRoZSBuZXcgY2hhclxuICAgICAgICAgICAgICAgICAgICB2YWwgPSB2YWwuc3Vic3RyKDAsIGlucHV0LnNlbGVjdGlvblN0YXJ0KSArIG5ld051bWVyaWNDaGFyICsgdmFsLnN1YnN0cmluZyhpbnB1dC5zZWxlY3Rpb25FbmQsIHZhbC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhlcmUgd2UncmUgbm90IGhhbmRsaW5nIGEgbmV3IGNoYXIsIHdlJ3JlIGp1c3QgZG9pbmcgYSByZS1mb3JtYXQgKGUuZy4gb24gZGVsZXRlL2JhY2tzcGFjZS9wYXN0ZSwgYWZ0ZXIgdGhlIGZhY3QpLCBidXQgd2Ugc3RpbGwgbmVlZCB0byBtYWludGFpbiB0aGUgY3Vyc29yIHBvc2l0aW9uLiBzbyBtYWtlIG5vdGUgb2YgdGhlIGNoYXIgb24gdGhlIGxlZnQsIGFuZCB0aGVuIGFmdGVyIHRoZSByZS1mb3JtYXQsIHdlJ2xsIGNvdW50IGluIHRoZSBzYW1lIG51bWJlciBvZiBkaWdpdHMgZnJvbSB0aGUgcmlnaHQsIGFuZCB0aGVuIGtlZXAgZ29pbmcgdGhyb3VnaCBhbnkgZm9ybWF0dGluZyBjaGFycyB1bnRpbCB3ZSBoaXQgdGhlIHNhbWUgbGVmdCBjaGFyIHRoYXQgd2UgaGFkIGJlZm9yZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gVVBEQVRFOiBub3cgaGF2ZSB0byBzdG9yZSAyIGNoYXJzIGFzIGV4dGVuc2lvbnMgZm9ybWF0dGluZyBjb250YWlucyAyIHNwYWNlcyBzbyB5b3UgbmVlZCB0byBiZSBhYmxlIHRvIGRpc3Rpbmd1aXNoXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsTGVmdENoYXJzID0gdmFsLnN1YnN0cihpbnB1dC5zZWxlY3Rpb25TdGFydCAtIDIsIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3TnVtZXJpY0NoYXIpIHtcbiAgICAgICAgICAgICAgICB2YWwgKz0gbmV3TnVtZXJpY0NoYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIG51bWJlciBhbmQgZmxhZ1xuICAgICAgICAgICAgdGhpcy5zZXROdW1iZXIodmFsLCBudWxsLCBhZGRTdWZmaXgsIHRydWUsIGlzQWxsb3dlZEtleSk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGN1cnNvciBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIHZhciBuZXdDdXJzb3I7XG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy50ZWxJbnB1dC52YWwoKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCB3YXMgYXQgdGhlIGVuZCwga2VlcCBpdCB0aGVyZVxuICAgICAgICAgICAgICAgIGlmICghZGlnaXRzT25SaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdDdXJzb3IgPSB2YWwubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgY291bnQgaW4gdGhlIHNhbWUgbnVtYmVyIG9mIGRpZ2l0cyBmcm9tIHRoZSByaWdodFxuICAgICAgICAgICAgICAgICAgICBuZXdDdXJzb3IgPSB0aGlzLl9nZXRDdXJzb3JGcm9tRGlnaXRzT25SaWdodCh2YWwsIGRpZ2l0c09uUmlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBidXQgaWYgZGVsZXRlL3Bhc3RlIGV0Yywga2VlcCBnb2luZyBsZWZ0IHVudGlsIGhpdCB0aGUgc2FtZSBsZWZ0IGNoYXIgYXMgYmVmb3JlXG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV3TnVtZXJpY0NoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0N1cnNvciA9IHRoaXMuX2dldEN1cnNvckZyb21MZWZ0Q2hhcih2YWwsIG5ld0N1cnNvciwgb3JpZ2luYWxMZWZ0Q2hhcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgbmV3IGN1cnNvclxuICAgICAgICAgICAgICAgIGlucHV0LnNldFNlbGVjdGlvblJhbmdlKG5ld0N1cnNvciwgbmV3Q3Vyc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gd2Ugc3RhcnQgZnJvbSB0aGUgcG9zaXRpb24gaW4gZ3Vlc3NDdXJzb3IsIGFuZCB3b3JrIG91ciB3YXkgbGVmdCB1bnRpbCB3ZSBoaXQgdGhlIG9yaWdpbmFsTGVmdENoYXJzIG9yIGEgbnVtYmVyIHRvIG1ha2Ugc3VyZSB0aGF0IGFmdGVyIHJlZm9ybWF0dGluZyB0aGUgY3Vyc29yIGhhcyB0aGUgc2FtZSBjaGFyIG9uIHRoZSBsZWZ0IGluIHRoZSBjYXNlIG9mIGEgZGVsZXRlIGV0Y1xuICAgICAgICBfZ2V0Q3Vyc29yRnJvbUxlZnRDaGFyOiBmdW5jdGlvbih2YWwsIGd1ZXNzQ3Vyc29yLCBvcmlnaW5hbExlZnRDaGFycykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGd1ZXNzQ3Vyc29yOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRDaGFyID0gdmFsLmNoYXJBdChpIC0gMSk7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNOdW1lcmljKGxlZnRDaGFyKSB8fCB2YWwuc3Vic3RyKGkgLSAyLCAyKSA9PSBvcmlnaW5hbExlZnRDaGFycykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gYWZ0ZXIgYSByZWZvcm1hdCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgc3RpbGwgdGhlIHNhbWUgbnVtYmVyIG9mIGRpZ2l0cyB0byB0aGUgcmlnaHQgb2YgdGhlIGN1cnNvclxuICAgICAgICBfZ2V0Q3Vyc29yRnJvbURpZ2l0c09uUmlnaHQ6IGZ1bmN0aW9uKHZhbCwgZGlnaXRzT25SaWdodCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHZhbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyh2YWwuY2hhckF0KGkpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoLS1kaWdpdHNPblJpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9LFxuICAgICAgICAvLyBnZXQgdGhlIG51bWJlciBvZiBudW1lcmljIGRpZ2l0cyB0byB0aGUgcmlnaHQgb2YgdGhlIGN1cnNvciBzbyB3ZSBjYW4gcmVwb3NpdGlvbiB0aGUgY3Vyc29yIGNvcnJlY3RseSBhZnRlciB0aGUgcmVmb3JtYXQgaGFzIGhhcHBlbmVkXG4gICAgICAgIF9nZXREaWdpdHNPblJpZ2h0OiBmdW5jdGlvbih2YWwsIHNlbGVjdGlvbkVuZCkge1xuICAgICAgICAgICAgdmFyIGRpZ2l0c09uUmlnaHQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNlbGVjdGlvbkVuZDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyh2YWwuY2hhckF0KGkpKSkge1xuICAgICAgICAgICAgICAgICAgICBkaWdpdHNPblJpZ2h0Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRpZ2l0c09uUmlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGxpc3RlbiBmb3IgZm9jdXMgYW5kIGJsdXJcbiAgICAgICAgX2luaXRGb2N1c0xpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBtb3VzZWRvd24gZGVjaWRlcyB3aGVyZSB0aGUgY3Vyc29yIGdvZXMsIHNvIGlmIHdlJ3JlIGZvY3VzaW5nIHdlIG11c3QgcHJldmVudERlZmF1bHQgYXMgd2UnbGwgYmUgaW5zZXJ0aW5nIHRoZSBkaWFsIGNvZGUsIGFuZCB3ZSB3YW50IHRoZSBjdXJzb3IgdG8gYmUgYXQgdGhlIGVuZCBubyBtYXR0ZXIgd2hlcmUgdGhleSBjbGlja1xuICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJtb3VzZWRvd25cIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LnRlbElucHV0LmlzKFwiOmZvY3VzXCIpICYmICF0aGF0LnRlbElucHV0LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBidXQgdGhpcyBhbHNvIGNhbmNlbHMgdGhlIGZvY3VzLCBzbyB3ZSBtdXN0IHRyaWdnZXIgdGhhdCBtYW51YWxseVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9uKFwiZm9jdXNcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGF0LnRlbElucHV0LnZhbCgpO1xuICAgICAgICAgICAgICAgIC8vIHNhdmUgdGhpcyB0byBjb21wYXJlIG9uIGJsdXJcbiAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LmRhdGEoXCJmb2N1c1ZhbFwiLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gb24gZm9jdXM6IGlmIGVtcHR5LCBpbnNlcnQgdGhlIGRpYWwgY29kZSBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmbGFnXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlICYmICF2YWx1ZSAmJiAhdGhhdC50ZWxJbnB1dC5wcm9wKFwicmVhZG9ubHlcIikgJiYgdGhhdC5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3VwZGF0ZVZhbChcIitcIiArIHRoYXQuc2VsZWN0ZWRDb3VudHJ5RGF0YS5kaWFsQ29kZSwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIGF1dG8taW5zZXJ0aW5nIGEgZGlhbCBjb2RlLCBpZiB0aGUgZmlyc3Qga2V5IHRoZXkgaGl0IGlzICcrJyB0aGVuIGFzc3VtZSB0aGV5IGFyZSBlbnRlcmluZyBhIG5ldyBudW1iZXIsIHNvIHJlbW92ZSB0aGUgZGlhbCBjb2RlLiB1c2Uga2V5cHJlc3MgaW5zdGVhZCBvZiBrZXlkb3duIGJlY2F1c2Uga2V5ZG93biBnZXRzIHRyaWdnZXJlZCBmb3IgdGhlIHNoaWZ0IGtleSAocmVxdWlyZWQgdG8gaGl0IHRoZSArIGtleSksIGFuZCBpbnN0ZWFkIG9mIGtleXVwIGJlY2F1c2UgdGhhdCBzaG93cyB0aGUgbmV3ICcrJyBiZWZvcmUgcmVtb3ZpbmcgdGhlIG9sZCBvbmVcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5vbmUoXCJrZXlwcmVzcy5wbHVzXCIgKyB0aGF0Lm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlzLlBMVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhdXRvRm9ybWF0IGlzIGVuYWJsZWQsIHRoaXMga2V5IGV2ZW50IHdpbGwgaGF2ZSBhbHJlYWR5IGhhdmUgYmVlbiBoYW5kbGVkIGJ5IGFub3RoZXIga2V5cHJlc3MgbGlzdGVuZXIgKGhlbmNlIHdlIG5lZWQgdG8gYWRkIHRoZSBcIitcIikuIGlmIGRpc2FibGVkLCBpdCB3aWxsIGJlIGhhbmRsZWQgYWZ0ZXIgdGhpcyBieSBhIGtleXVwIGxpc3RlbmVyIChoZW5jZSBubyBuZWVkIHRvIGFkZCB0aGUgXCIrXCIpLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWwgPSB0aGF0Lm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgPyBcIitcIiA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC52YWwobmV3VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRhYmJpbmcgaW4sIG1ha2Ugc3VyZSB0aGUgY3Vyc29yIGlzIGF0IHRoZSBlbmQgd2UgbXVzdCB1c2Ugc2V0VGltZW91dCB0byBnZXQgb3V0c2lkZSBvZiB0aGUgZm9jdXMgaGFuZGxlciBhcyBpdCBzZWVtcyB0aGUgc2VsZWN0aW9uIGhhcHBlbnMgYWZ0ZXIgdGhhdFxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhhdC50ZWxJbnB1dFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmlzR29vZEJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gdGhhdC50ZWxJbnB1dC52YWwoKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UobGVuLCBsZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJibHVyXCIgKyB0aGlzLm5zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb24gYmx1cjogaWYganVzdCBhIGRpYWwgY29kZSB0aGVuIHJlbW92ZSBpdFxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGF0LnRlbElucHV0LnZhbCgpLCBzdGFydHNQbHVzID0gdmFsdWUuY2hhckF0KDApID09IFwiK1wiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRzUGx1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bWVyaWMgPSB0aGF0Ll9nZXROdW1lcmljKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGp1c3QgYSBwbHVzLCBvciBpZiBqdXN0IGEgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW51bWVyaWMgfHwgdGhhdC5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlID09IG51bWVyaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LnZhbChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIGtleXByZXNzIGxpc3RlbmVyIHdlIGFkZGVkIG9uIGZvY3VzXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQub2ZmKFwia2V5cHJlc3MucGx1c1wiICsgdGhhdC5ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQsIHdlIG11c3QgbWFudWFsbHkgdHJpZ2dlciBjaGFuZ2UgZXZlbnQgaWYgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzICYmIHRoYXQudGVsSW5wdXQudmFsKCkgIT0gdGhhdC50ZWxJbnB1dC5kYXRhKFwiZm9jdXNWYWxcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyBleHRyYWN0IHRoZSBudW1lcmljIGRpZ2l0cyBmcm9tIHRoZSBnaXZlbiBzdHJpbmdcbiAgICAgICAgX2dldE51bWVyaWM6IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgX2dldENsZWFuOiBmdW5jdGlvbihzKSB7XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gcy5jaGFyQXQoMCkgPT0gXCIrXCIgPyBcIitcIiA6IFwiXCI7XG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgdGhpcy5fZ2V0TnVtZXJpYyhzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2hvdyB0aGUgZHJvcGRvd25cbiAgICAgICAgX3Nob3dEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXREcm9wZG93blBvc2l0aW9uKCk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgaGlnaGxpZ2h0aW5nIGFuZCBzY3JvbGwgdG8gYWN0aXZlIGxpc3QgaXRlbVxuICAgICAgICAgICAgdmFyIGFjdGl2ZUxpc3RJdGVtID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIi5hY3RpdmVcIik7XG4gICAgICAgICAgICBpZiAoYWN0aXZlTGlzdEl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0TGlzdEl0ZW0oYWN0aXZlTGlzdEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2hvdyBpdFxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG4gICAgICAgICAgICBpZiAoYWN0aXZlTGlzdEl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG8oYWN0aXZlTGlzdEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYmluZCBhbGwgdGhlIGRyb3Bkb3duLXJlbGF0ZWQgbGlzdGVuZXJzOiBtb3VzZW92ZXIsIGNsaWNrLCBjbGljay1vZmYsIGtleWRvd25cbiAgICAgICAgICAgIHRoaXMuX2JpbmREcm9wZG93bkxpc3RlbmVycygpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBhcnJvd1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5jaGlsZHJlbihcIi5hcnJvd1wiKS5hZGRDbGFzcyhcInVwXCIpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBkZWNpZGUgd2hlcmUgdG8gcG9zaXRpb24gZHJvcGRvd24gKGRlcGVuZHMgb24gcG9zaXRpb24gd2l0aGluIHZpZXdwb3J0LCBhbmQgc2Nyb2xsKVxuICAgICAgICBfc2V0RHJvcGRvd25Qb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRUb3AgPSB0aGlzLnRlbElucHV0Lm9mZnNldCgpLnRvcCwgd2luZG93VG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLCAvLyBkcm9wZG93bkZpdHNCZWxvdyA9IChkcm9wZG93bkJvdHRvbSA8IHdpbmRvd0JvdHRvbSlcbiAgICAgICAgICAgIGRyb3Bkb3duRml0c0JlbG93ID0gaW5wdXRUb3AgKyB0aGlzLnRlbElucHV0Lm91dGVySGVpZ2h0KCkgKyB0aGlzLmRyb3Bkb3duSGVpZ2h0IDwgd2luZG93VG9wICsgJCh3aW5kb3cpLmhlaWdodCgpLCBkcm9wZG93bkZpdHNBYm92ZSA9IGlucHV0VG9wIC0gdGhpcy5kcm9wZG93bkhlaWdodCA+IHdpbmRvd1RvcDtcbiAgICAgICAgICAgIC8vIGRyb3Bkb3duSGVpZ2h0IC0gMSBmb3IgYm9yZGVyXG4gICAgICAgICAgICB2YXIgY3NzVG9wID0gIWRyb3Bkb3duRml0c0JlbG93ICYmIGRyb3Bkb3duRml0c0Fib3ZlID8gXCItXCIgKyAodGhpcy5kcm9wZG93bkhlaWdodCAtIDEpICsgXCJweFwiIDogXCJcIjtcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QuY3NzKFwidG9wXCIsIGNzc1RvcCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHdlIG9ubHkgYmluZCBkcm9wZG93biBsaXN0ZW5lcnMgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlblxuICAgICAgICBfYmluZERyb3Bkb3duTGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIC8vIHdoZW4gbW91c2Ugb3ZlciBhIGxpc3QgaXRlbSwganVzdCBoaWdobGlnaHQgdGhhdCBvbmVcbiAgICAgICAgICAgIC8vIHdlIGFkZCB0aGUgY2xhc3MgXCJoaWdobGlnaHRcIiwgc28gaWYgdGhleSBoaXQgXCJlbnRlclwiIHdlIGtub3cgd2hpY2ggb25lIHRvIHNlbGVjdFxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5vbihcIm1vdXNlb3ZlclwiICsgdGhpcy5ucywgXCIuY291bnRyeVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5faGlnaGxpZ2h0TGlzdEl0ZW0oJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGxpc3RlbiBmb3IgY291bnRyeSBzZWxlY3Rpb25cbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3Qub24oXCJjbGlja1wiICsgdGhpcy5ucywgXCIuY291bnRyeVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5fc2VsZWN0TGlzdEl0ZW0oJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNsaWNrIG9mZiB0byBjbG9zZVxuICAgICAgICAgICAgLy8gKGV4Y2VwdCB3aGVuIHRoaXMgaW5pdGlhbCBvcGVuaW5nIGNsaWNrIGlzIGJ1YmJsaW5nIHVwKVxuICAgICAgICAgICAgLy8gd2UgY2Fubm90IGp1c3Qgc3RvcFByb3BhZ2F0aW9uIGFzIGl0IG1heSBiZSBuZWVkZWQgdG8gY2xvc2UgYW5vdGhlciBpbnN0YW5jZVxuICAgICAgICAgICAgdmFyIGlzT3BlbmluZyA9IHRydWU7XG4gICAgICAgICAgICAkKFwiaHRtbFwiKS5vbihcImNsaWNrXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc09wZW5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fY2xvc2VEcm9wZG93bigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpc09wZW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gbGlzdGVuIGZvciB1cC9kb3duIHNjcm9sbGluZywgZW50ZXIgdG8gc2VsZWN0LCBvciBsZXR0ZXJzIHRvIGp1bXAgdG8gY291bnRyeSBuYW1lLlxuICAgICAgICAgICAgLy8gdXNlIGtleWRvd24gYXMga2V5cHJlc3MgZG9lc24ndCBmaXJlIGZvciBub24tY2hhciBrZXlzIGFuZCB3ZSB3YW50IHRvIGNhdGNoIGlmIHRoZXlcbiAgICAgICAgICAgIC8vIGp1c3QgaGl0IGRvd24gYW5kIGhvbGQgaXQgdG8gc2Nyb2xsIGRvd24gKG5vIGtleXVwIGV2ZW50KS5cbiAgICAgICAgICAgIC8vIGxpc3RlbiBvbiB0aGUgZG9jdW1lbnQgYmVjYXVzZSB0aGF0J3Mgd2hlcmUga2V5IGV2ZW50cyBhcmUgdHJpZ2dlcmVkIGlmIG5vIGlucHV0IGhhcyBmb2N1c1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gXCJcIiwgcXVlcnlUaW1lciA9IG51bGw7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbihcImtleWRvd25cIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IGRvd24ga2V5IGZyb20gc2Nyb2xsaW5nIHRoZSB3aG9sZSBwYWdlLFxuICAgICAgICAgICAgICAgIC8vIGFuZCBlbnRlciBrZXkgZnJvbSBzdWJtaXR0aW5nIGEgZm9ybSBldGNcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5cy5VUCB8fCBlLndoaWNoID09IGtleXMuRE9XTikge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cCBhbmQgZG93biB0byBuYXZpZ2F0ZVxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9oYW5kbGVVcERvd25LZXkoZS53aGljaCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09IGtleXMuRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZW50ZXIgdG8gc2VsZWN0XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZUVudGVyS2V5KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09IGtleXMuRVNDKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVzYyB0byBjbG9zZVxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID49IGtleXMuQSAmJiBlLndoaWNoIDw9IGtleXMuWiB8fCBlLndoaWNoID09IGtleXMuU1BBQ0UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXIgY2FzZSBsZXR0ZXJzIChub3RlOiBrZXl1cC9rZXlkb3duIG9ubHkgcmV0dXJuIHVwcGVyIGNhc2UgbGV0dGVycylcbiAgICAgICAgICAgICAgICAgICAgLy8ganVtcCB0byBjb3VudHJpZXMgdGhhdCBzdGFydCB3aXRoIHRoZSBxdWVyeSBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXJ5VGltZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChxdWVyeVRpbWVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBxdWVyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9zZWFyY2hGb3JDb3VudHJ5KHF1ZXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHRpbWVyIGhpdHMgMSBzZWNvbmQsIHJlc2V0IHRoZSBxdWVyeVxuICAgICAgICAgICAgICAgICAgICBxdWVyeVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfSwgMWUzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBuZXh0L3ByZXYgaXRlbSBpbiB0aGUgbGlzdCAoYW5kIGVuc3VyZSBpdCBpcyB2aXNpYmxlKVxuICAgICAgICBfaGFuZGxlVXBEb3duS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIi5oaWdobGlnaHRcIikuZmlyc3QoKTtcbiAgICAgICAgICAgIHZhciBuZXh0ID0ga2V5ID09IGtleXMuVVAgPyBjdXJyZW50LnByZXYoKSA6IGN1cnJlbnQubmV4dCgpO1xuICAgICAgICAgICAgaWYgKG5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCB0aGUgZGl2aWRlclxuICAgICAgICAgICAgICAgIGlmIChuZXh0Lmhhc0NsYXNzKFwiZGl2aWRlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0ID0ga2V5ID09IGtleXMuVVAgPyBuZXh0LnByZXYoKSA6IG5leHQubmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9oaWdobGlnaHRMaXN0SXRlbShuZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxUbyhuZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2VsZWN0IHRoZSBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgaXRlbVxuICAgICAgICBfaGFuZGxlRW50ZXJLZXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3VudHJ5ID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIi5oaWdobGlnaHRcIikuZmlyc3QoKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q291bnRyeS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RMaXN0SXRlbShjdXJyZW50Q291bnRyeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IGxpc3QgaXRlbSB3aG9zZSBuYW1lIHN0YXJ0cyB3aXRoIHRoZSBxdWVyeSBzdHJpbmdcbiAgICAgICAgX3NlYXJjaEZvckNvdW50cnk6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXJ0c1dpdGgodGhpcy5jb3VudHJpZXNbaV0ubmFtZSwgcXVlcnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0SXRlbSA9IHRoaXMuY291bnRyeUxpc3QuY2hpbGRyZW4oXCJbZGF0YS1jb3VudHJ5LWNvZGU9XCIgKyB0aGlzLmNvdW50cmllc1tpXS5pc28yICsgXCJdXCIpLm5vdChcIi5wcmVmZXJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBoaWdobGlnaHRpbmcgYW5kIHNjcm9sbFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWdobGlnaHRMaXN0SXRlbShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvKGxpc3RJdGVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBjaGVjayBpZiAodXBwZXJjYXNlKSBzdHJpbmcgYSBzdGFydHMgd2l0aCBzdHJpbmcgYlxuICAgICAgICBfc3RhcnRzV2l0aDogZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEuc3Vic3RyKDAsIGIubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09IGI7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgaW5wdXQncyB2YWx1ZSB0byB0aGUgZ2l2ZW4gdmFsXG4gICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQ9dHJ1ZSwgZm9ybWF0IGl0IGZpcnN0IGFjY29yZGluZyB0byB0aGUgY291bnRyeS1zcGVjaWZpYyBmb3JtYXR0aW5nIHJ1bGVzXG4gICAgICAgIC8vIE5vdGU6IHByZXZlbnRDb252ZXJzaW9uIHdpbGwgYmUgZmFsc2UgKGkuZS4gd2UgYWxsb3cgY29udmVyc2lvbikgb24gaW5pdCBhbmQgd2hlbiBkZXYgY2FsbHMgcHVibGljIG1ldGhvZCBzZXROdW1iZXJcbiAgICAgICAgX3VwZGF0ZVZhbDogZnVuY3Rpb24odmFsLCBmb3JtYXQsIGFkZFN1ZmZpeCwgcHJldmVudENvbnZlcnNpb24sIGlzQWxsb3dlZEtleSkge1xuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZDtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXQgPT0gXCJudW1iZXJcIiAmJiBpbnRsVGVsSW5wdXRVdGlscy5pc1ZhbGlkTnVtYmVyKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHVzZXIgc3BlY2lmaWVkIGEgZm9ybWF0LCBhbmQgaXQncyBhIHZhbGlkIG51bWJlciwgdGhlbiBmb3JtYXQgaXQgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkID0gaW50bFRlbElucHV0VXRpbHMuZm9ybWF0TnVtYmVyQnlUeXBlKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIGZvcm1hdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcHJldmVudENvbnZlcnNpb24gJiYgdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSAmJiB2YWwuY2hhckF0KDApID09IFwiK1wiICYmIGludGxUZWxJbnB1dFV0aWxzLmlzVmFsaWROdW1iZXIodmFsLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbmF0aW9uYWxNb2RlIGFuZCB3ZSBoYXZlIGEgdmFsaWQgaW50bCBudW1iZXIsIGNvbnZlcnQgaXQgdG8gbnRsXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IGludGxUZWxJbnB1dFV0aWxzLmZvcm1hdE51bWJlckJ5VHlwZSh2YWwsIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCBpbnRsVGVsSW5wdXRVdGlscy5udW1iZXJGb3JtYXQuTkFUSU9OQUwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgZG8gdGhlIHJlZ3VsYXIgQXNZb3VUeXBlIGZvcm1hdHRpbmdcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkID0gaW50bFRlbElucHV0VXRpbHMuZm9ybWF0TnVtYmVyKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIGFkZFN1ZmZpeCwgdGhpcy5vcHRpb25zLmFsbG93RXh0ZW5zaW9ucywgaXNBbGxvd2VkS2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZW5zdXJlIHdlIGRvbnQgZ28gb3ZlciBtYXhsZW5ndGguIHdlIG11c3QgZG8gdGhpcyBoZXJlIHRvIHRydW5jYXRlIGFueSBmb3JtYXR0aW5nIHN1ZmZpeCwgYW5kIGFsc28gaGFuZGxlIHBhc3RlIGV2ZW50c1xuICAgICAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLnRlbElucHV0LmF0dHIoXCJtYXhsZW5ndGhcIik7XG4gICAgICAgICAgICAgICAgaWYgKG1heCAmJiBmb3JtYXR0ZWQubGVuZ3RoID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5zdWJzdHIoMCwgbWF4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vIGF1dG9Gb3JtYXQsIHNvIGp1c3QgaW5zZXJ0IHRoZSBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICAgICAgICAgIGZvcm1hdHRlZCA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQudmFsKGZvcm1hdHRlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNoZWNrIGlmIG5lZWQgdG8gc2VsZWN0IGEgbmV3IGZsYWcgYmFzZWQgb24gdGhlIGdpdmVuIG51bWJlclxuICAgICAgICBfdXBkYXRlRmxhZ0Zyb21OdW1iZXI6IGZ1bmN0aW9uKG51bWJlciwgdXBkYXRlRGVmYXVsdCkge1xuICAgICAgICAgICAgLy8gaWYgd2UncmUgaW4gbmF0aW9uYWxNb2RlIGFuZCB3ZSdyZSBvbiBVUy9DYW5hZGEsIG1ha2Ugc3VyZSB0aGUgbnVtYmVyIHN0YXJ0cyB3aXRoIGEgKzEgc28gX2dldERpYWxDb2RlIHdpbGwgYmUgYWJsZSB0byBleHRyYWN0IHRoZSBhcmVhIGNvZGVcbiAgICAgICAgICAgIC8vIHVwZGF0ZTogaWYgd2UgZG9udCB5ZXQgaGF2ZSBzZWxlY3RlZENvdW50cnlEYXRhLCBidXQgd2UncmUgaGVyZSAodHJ5aW5nIHRvIHVwZGF0ZSB0aGUgZmxhZyBmcm9tIHRoZSBudW1iZXIpLCB0aGF0IG1lYW5zIHdlJ3JlIGluaXRpYWxpc2luZyB0aGUgcGx1Z2luIHdpdGggYSBudW1iZXIgdGhhdCBhbHJlYWR5IGhhcyBhIGRpYWwgY29kZSwgc28gZmluZSB0byBpZ25vcmUgdGhpcyBiaXRcbiAgICAgICAgICAgIGlmIChudW1iZXIgJiYgdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlID09IFwiMVwiICYmIG51bWJlci5jaGFyQXQoMCkgIT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyLmNoYXJBdCgwKSAhPSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICBudW1iZXIgPSBcIjFcIiArIG51bWJlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbnVtYmVyID0gXCIrXCIgKyBudW1iZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0cnkgYW5kIGV4dHJhY3QgdmFsaWQgZGlhbCBjb2RlIGZyb20gaW5wdXRcbiAgICAgICAgICAgIHZhciBkaWFsQ29kZSA9IHRoaXMuX2dldERpYWxDb2RlKG51bWJlciksIGNvdW50cnlDb2RlID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChkaWFsQ29kZSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIG9uZSBvZiB0aGUgbWF0Y2hpbmcgY291bnRyaWVzIGlzIGFscmVhZHkgc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICB2YXIgY291bnRyeUNvZGVzID0gdGhpcy5jb3VudHJ5Q29kZXNbdGhpcy5fZ2V0TnVtZXJpYyhkaWFsQ29kZSldLCBhbHJlYWR5U2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgJiYgJC5pbkFycmF5KHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCBjb3VudHJ5Q29kZXMpICE9IC0xO1xuICAgICAgICAgICAgICAgIC8vIGlmIGEgbWF0Y2hpbmcgY291bnRyeSBpcyBub3QgYWxyZWFkeSBzZWxlY3RlZCAob3IgdGhpcyBpcyBhbiB1bmtub3duIE5BTlAgYXJlYSBjb2RlKTogY2hvb3NlIHRoZSBmaXJzdCBpbiB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGlmICghYWxyZWFkeVNlbGVjdGVkIHx8IHRoaXMuX2lzVW5rbm93bk5hbnAobnVtYmVyLCBkaWFsQ29kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdXNpbmcgb25seUNvdW50cmllcyBvcHRpb24sIGNvdW50cnlDb2Rlc1swXSBtYXkgYmUgZW1wdHksIHNvIHdlIG11c3QgZmluZCB0aGUgZmlyc3Qgbm9uLWVtcHR5IGluZGV4XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY291bnRyeUNvZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291bnRyeUNvZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRyeUNvZGUgPSBjb3VudHJ5Q29kZXNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlci5jaGFyQXQoMCkgPT0gXCIrXCIgJiYgdGhpcy5fZ2V0TnVtZXJpYyhudW1iZXIpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIGludmFsaWQgZGlhbCBjb2RlLCBzbyBlbXB0eVxuICAgICAgICAgICAgICAgIC8vIE5vdGU6IHVzZSBnZXROdW1lcmljIGhlcmUgYmVjYXVzZSB0aGUgbnVtYmVyIGhhcyBub3QgYmVlbiBmb3JtYXR0ZWQgeWV0LCBzbyBjb3VsZCBjb250YWluIGJhZCBzaGl0XG4gICAgICAgICAgICAgICAgY291bnRyeUNvZGUgPSBcIlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghbnVtYmVyIHx8IG51bWJlciA9PSBcIitcIikge1xuICAgICAgICAgICAgICAgIC8vIGVtcHR5LCBvciBqdXN0IGEgcGx1cywgc28gZGVmYXVsdFxuICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlID0gdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5LmlzbzI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY291bnRyeUNvZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RGbGFnKGNvdW50cnlDb2RlLCB1cGRhdGVEZWZhdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGdpdmVuIG51bWJlciBjb250YWlucyBhbiB1bmtub3duIGFyZWEgY29kZSBmcm9tIHRoZSBOb3J0aCBBbWVyaWNhbiBOdW1iZXJpbmcgUGxhbiBpLmUuIHRoZSBvbmx5IGRpYWxDb2RlIHRoYXQgY291bGQgYmUgZXh0cmFjdGVkIHdhcyArMSBidXQgdGhlIGFjdHVhbCBudW1iZXIncyBsZW5ndGggaXMgPj00XG4gICAgICAgIF9pc1Vua25vd25OYW5wOiBmdW5jdGlvbihudW1iZXIsIGRpYWxDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGlhbENvZGUgPT0gXCIrMVwiICYmIHRoaXMuX2dldE51bWVyaWMobnVtYmVyKS5sZW5ndGggPj0gNDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcmVtb3ZlIGhpZ2hsaWdodGluZyBmcm9tIG90aGVyIGxpc3QgaXRlbXMgYW5kIGhpZ2hsaWdodCB0aGUgZ2l2ZW4gaXRlbVxuICAgICAgICBfaGlnaGxpZ2h0TGlzdEl0ZW06IGZ1bmN0aW9uKGxpc3RJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0SXRlbXMucmVtb3ZlQ2xhc3MoXCJoaWdobGlnaHRcIik7XG4gICAgICAgICAgICBsaXN0SXRlbS5hZGRDbGFzcyhcImhpZ2hsaWdodFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZmluZCB0aGUgY291bnRyeSBkYXRhIGZvciB0aGUgZ2l2ZW4gY291bnRyeSBjb2RlXG4gICAgICAgIC8vIHRoZSBpZ25vcmVPbmx5Q291bnRyaWVzT3B0aW9uIGlzIG9ubHkgdXNlZCBkdXJpbmcgaW5pdCgpIHdoaWxlIHBhcnNpbmcgdGhlIG9ubHlDb3VudHJpZXMgYXJyYXlcbiAgICAgICAgX2dldENvdW50cnlEYXRhOiBmdW5jdGlvbihjb3VudHJ5Q29kZSwgaWdub3JlT25seUNvdW50cmllc09wdGlvbiwgYWxsb3dGYWlsKSB7XG4gICAgICAgICAgICB2YXIgY291bnRyeUxpc3QgPSBpZ25vcmVPbmx5Q291bnRyaWVzT3B0aW9uID8gYWxsQ291bnRyaWVzIDogdGhpcy5jb3VudHJpZXM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50cnlMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50cnlMaXN0W2ldLmlzbzIgPT0gY291bnRyeUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50cnlMaXN0W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbGxvd0ZhaWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gY291bnRyeSBkYXRhIGZvciAnXCIgKyBjb3VudHJ5Q29kZSArIFwiJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2VsZWN0IHRoZSBnaXZlbiBmbGFnLCB1cGRhdGUgdGhlIHBsYWNlaG9sZGVyIGFuZCB0aGUgYWN0aXZlIGxpc3QgaXRlbVxuICAgICAgICBfc2VsZWN0RmxhZzogZnVuY3Rpb24oY291bnRyeUNvZGUsIHVwZGF0ZURlZmF1bHQpIHtcbiAgICAgICAgICAgIC8vIGRvIHRoaXMgZmlyc3QgYXMgaXQgd2lsbCB0aHJvdyBhbiBlcnJvciBhbmQgc3RvcCBpZiBjb3VudHJ5Q29kZSBpcyBpbnZhbGlkXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgPSBjb3VudHJ5Q29kZSA/IHRoaXMuX2dldENvdW50cnlEYXRhKGNvdW50cnlDb2RlLCBmYWxzZSwgZmFsc2UpIDoge307XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIFwiZGVmYXVsdENvdW50cnlcIiAtIHdlIG9ubHkgbmVlZCB0aGUgaXNvMiBmcm9tIG5vdyBvbiwgc28ganVzdCBzdG9yZSB0aGF0XG4gICAgICAgICAgICBpZiAodXBkYXRlRGVmYXVsdCAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMikge1xuICAgICAgICAgICAgICAgIC8vIGNhbid0IGp1c3QgbWFrZSB0aGlzIGVxdWFsIHRvIHNlbGVjdGVkQ291bnRyeURhdGEgYXMgd291bGQgYmUgYSByZWYgdG8gdGhhdCBvYmplY3RcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzbzI6IHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIuYXR0cihcImNsYXNzXCIsIFwiaXRpLWZsYWcgXCIgKyBjb3VudHJ5Q29kZSk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHNlbGVjdGVkIGNvdW50cnkncyB0aXRsZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IGNvdW50cnlDb2RlID8gdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLm5hbWUgKyBcIjogK1wiICsgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlIDogXCJVbmtub3duXCI7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLnBhcmVudCgpLmF0dHIoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgICAgICAgICAvLyBhbmQgdGhlIGlucHV0J3MgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QudmFsKGNvdW50cnlDb2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBhY3RpdmUgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdEl0ZW1zLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjb3VudHJ5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0SXRlbXMuZmluZChcIi5pdGktZmxhZy5cIiArIGNvdW50cnlDb2RlKS5maXJzdCgpLmNsb3Nlc3QoXCIuY291bnRyeVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgaW5wdXQgcGxhY2Vob2xkZXIgdG8gYW4gZXhhbXBsZSBudW1iZXIgZnJvbSB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvdW50cnlcbiAgICAgICAgX3VwZGF0ZVBsYWNlaG9sZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgJiYgIXRoaXMuaGFkSW5pdGlhbFBsYWNlaG9sZGVyICYmIHRoaXMub3B0aW9ucy5hdXRvUGxhY2Vob2xkZXIgJiYgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzbzIgPSB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgbnVtYmVyVHlwZSA9IGludGxUZWxJbnB1dFV0aWxzLm51bWJlclR5cGVbdGhpcy5vcHRpb25zLm51bWJlclR5cGUgfHwgXCJGSVhFRF9MSU5FXCJdLCBwbGFjZWhvbGRlciA9IGlzbzIgPyBpbnRsVGVsSW5wdXRVdGlscy5nZXRFeGFtcGxlTnVtYmVyKGlzbzIsIHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUsIG51bWJlclR5cGUpIDogXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0LmF0dHIoXCJwbGFjZWhvbGRlclwiLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBsaXN0IGl0ZW0gZnJvbSB0aGUgZHJvcGRvd25cbiAgICAgICAgX3NlbGVjdExpc3RJdGVtOiBmdW5jdGlvbihsaXN0SXRlbSkge1xuICAgICAgICAgICAgdmFyIGNvdW50cnlDb2RlQXR0ciA9IHRoaXMuaXNNb2JpbGUgPyBcInZhbHVlXCIgOiBcImRhdGEtY291bnRyeS1jb2RlXCI7XG4gICAgICAgICAgICAvLyB1cGRhdGUgc2VsZWN0ZWQgZmxhZyBhbmQgYWN0aXZlIGxpc3QgaXRlbVxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0RmxhZyhsaXN0SXRlbS5hdHRyKGNvdW50cnlDb2RlQXR0ciksIHRydWUpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VEcm9wZG93bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlhbENvZGUobGlzdEl0ZW0uYXR0cihcImRhdGEtZGlhbC1jb2RlXCIpLCB0cnVlKTtcbiAgICAgICAgICAgIC8vIGFsd2F5cyBmaXJlIHRoZSBjaGFuZ2UgZXZlbnQgYXMgZXZlbiBpZiBuYXRpb25hbE1vZGU9dHJ1ZSAoYW5kIHdlIGhhdmVuJ3QgdXBkYXRlZCB0aGUgaW5wdXQgdmFsKSwgdGhlIHN5c3RlbSBhcyBhIHdob2xlIGhhcyBzdGlsbCBjaGFuZ2VkIC0gc2VlIGNvdW50cnktc3luYyBleGFtcGxlLiB0aGluayBvZiBpdCBhcyBtYWtpbmcgYSBzZWxlY3Rpb24gZnJvbSBhIHNlbGVjdCBlbGVtZW50LlxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgLy8gZm9jdXMgdGhlIGlucHV0XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAvLyBmaXggZm9yIEZGIGFuZCBJRTExICh3aXRoIG5hdGlvbmFsTW9kZT1mYWxzZSBpLmUuIGF1dG8gaW5zZXJ0aW5nIGRpYWwgY29kZSksIHdobyB0cnkgdG8gcHV0IHRoZSBjdXJzb3IgYXQgdGhlIGJlZ2lubmluZyB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIHZhciBsZW4gPSB0aGlzLnRlbElucHV0LnZhbCgpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0WzBdLnNldFNlbGVjdGlvblJhbmdlKGxlbiwgbGVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2xvc2UgdGhlIGRyb3Bkb3duIGFuZCB1bmJpbmQgYW55IGxpc3RlbmVyc1xuICAgICAgICBfY2xvc2VEcm9wZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0LmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIuY2hpbGRyZW4oXCIuYXJyb3dcIikucmVtb3ZlQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgICAgIC8vIHVuYmluZCBrZXkgZXZlbnRzXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICAvLyB1bmJpbmQgY2xpY2stb2ZmLXRvLWNsb3NlXG4gICAgICAgICAgICAkKFwiaHRtbFwiKS5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICAvLyB1bmJpbmQgaG92ZXIgYW5kIGNsaWNrIGxpc3RlbmVyc1xuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5vZmYodGhpcy5ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNoZWNrIGlmIGFuIGVsZW1lbnQgaXMgdmlzaWJsZSB3aXRoaW4gaXQncyBjb250YWluZXIsIGVsc2Ugc2Nyb2xsIHVudGlsIGl0IGlzXG4gICAgICAgIF9zY3JvbGxUbzogZnVuY3Rpb24oZWxlbWVudCwgbWlkZGxlKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb3VudHJ5TGlzdCwgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCgpLCBjb250YWluZXJUb3AgPSBjb250YWluZXIub2Zmc2V0KCkudG9wLCBjb250YWluZXJCb3R0b20gPSBjb250YWluZXJUb3AgKyBjb250YWluZXJIZWlnaHQsIGVsZW1lbnRIZWlnaHQgPSBlbGVtZW50Lm91dGVySGVpZ2h0KCksIGVsZW1lbnRUb3AgPSBlbGVtZW50Lm9mZnNldCgpLnRvcCwgZWxlbWVudEJvdHRvbSA9IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0LCBuZXdTY3JvbGxUb3AgPSBlbGVtZW50VG9wIC0gY29udGFpbmVyVG9wICsgY29udGFpbmVyLnNjcm9sbFRvcCgpLCBtaWRkbGVPZmZzZXQgPSBjb250YWluZXJIZWlnaHQgLyAyIC0gZWxlbWVudEhlaWdodCAvIDI7XG4gICAgICAgICAgICBpZiAoZWxlbWVudFRvcCA8IGNvbnRhaW5lclRvcCkge1xuICAgICAgICAgICAgICAgIC8vIHNjcm9sbCB1cFxuICAgICAgICAgICAgICAgIGlmIChtaWRkbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U2Nyb2xsVG9wIC09IG1pZGRsZU9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvcChuZXdTY3JvbGxUb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Qm90dG9tID4gY29udGFpbmVyQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgLy8gc2Nyb2xsIGRvd25cbiAgICAgICAgICAgICAgICBpZiAobWlkZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1Njcm9sbFRvcCArPSBtaWRkbGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHREaWZmZXJlbmNlID0gY29udGFpbmVySGVpZ2h0IC0gZWxlbWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wKG5ld1Njcm9sbFRvcCAtIGhlaWdodERpZmZlcmVuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyByZXBsYWNlIGFueSBleGlzdGluZyBkaWFsIGNvZGUgd2l0aCB0aGUgbmV3IG9uZSAoaWYgbm90IGluIG5hdGlvbmFsTW9kZSlcbiAgICAgICAgLy8gYWxzbyB3ZSBuZWVkIHRvIGtub3cgaWYgd2UncmUgZm9jdXNpbmcgZm9yIGEgY291cGxlIG9mIHJlYXNvbnMgZS5nLiBpZiBzbywgd2Ugd2FudCB0byBhZGQgYW55IGZvcm1hdHRpbmcgc3VmZml4LCBhbHNvIGlmIHRoZSBpbnB1dCBpcyBlbXB0eSBhbmQgd2UncmUgbm90IGluIG5hdGlvbmFsTW9kZSwgdGhlbiB3ZSB3YW50IHRvIGluc2VydCB0aGUgZGlhbCBjb2RlXG4gICAgICAgIF91cGRhdGVEaWFsQ29kZTogZnVuY3Rpb24obmV3RGlhbENvZGUsIGZvY3VzaW5nKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRWYWwgPSB0aGlzLnRlbElucHV0LnZhbCgpLCBuZXdOdW1iZXI7XG4gICAgICAgICAgICAvLyBzYXZlIGhhdmluZyB0byBwYXNzIHRoaXMgZXZlcnkgdGltZVxuICAgICAgICAgICAgbmV3RGlhbENvZGUgPSBcIitcIiArIG5ld0RpYWxDb2RlO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUgJiYgaW5wdXRWYWwuY2hhckF0KDApICE9IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgbmF0aW9uYWxNb2RlLCB3ZSBqdXN0IHdhbnQgdG8gcmUtZm9ybWF0XG4gICAgICAgICAgICAgICAgbmV3TnVtYmVyID0gaW5wdXRWYWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0VmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZXZpb3VzIG51bWJlciBjb250YWluZWQgYSB2YWxpZCBkaWFsIGNvZGUsIHJlcGxhY2UgaXRcbiAgICAgICAgICAgICAgICAvLyAoaWYgbW9yZSB0aGFuIGp1c3QgYSBwbHVzIGNoYXJhY3RlcilcbiAgICAgICAgICAgICAgICB2YXIgcHJldkRpYWxDb2RlID0gdGhpcy5fZ2V0RGlhbENvZGUoaW5wdXRWYWwpO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2RGlhbENvZGUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdOdW1iZXIgPSBpbnB1dFZhbC5yZXBsYWNlKHByZXZEaWFsQ29kZSwgbmV3RGlhbENvZGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcmV2aW91cyBudW1iZXIgZGlkbid0IGNvbnRhaW4gYSBkaWFsIGNvZGUsIHdlIHNob3VsZCBwZXJzaXN0IGl0XG4gICAgICAgICAgICAgICAgICAgIHZhciBleGlzdGluZ051bWJlciA9IGlucHV0VmFsLmNoYXJBdCgwKSAhPSBcIitcIiA/ICQudHJpbShpbnB1dFZhbCkgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBuZXdOdW1iZXIgPSBuZXdEaWFsQ29kZSArIGV4aXN0aW5nTnVtYmVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3TnVtYmVyID0gIXRoaXMub3B0aW9ucy5hdXRvSGlkZURpYWxDb2RlIHx8IGZvY3VzaW5nID8gbmV3RGlhbENvZGUgOiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsKG5ld051bWJlciwgbnVsbCwgZm9jdXNpbmcpO1xuICAgICAgICB9LFxuICAgICAgICAvLyB0cnkgYW5kIGV4dHJhY3QgYSB2YWxpZCBpbnRlcm5hdGlvbmFsIGRpYWwgY29kZSBmcm9tIGEgZnVsbCB0ZWxlcGhvbmUgbnVtYmVyXG4gICAgICAgIC8vIE5vdGU6IHJldHVybnMgdGhlIHJhdyBzdHJpbmcgaW5jIHBsdXMgY2hhcmFjdGVyIGFuZCBhbnkgd2hpdGVzcGFjZS9kb3RzIGV0Y1xuICAgICAgICBfZ2V0RGlhbENvZGU6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGRpYWxDb2RlID0gXCJcIjtcbiAgICAgICAgICAgIC8vIG9ubHkgaW50ZXJlc3RlZCBpbiBpbnRlcm5hdGlvbmFsIG51bWJlcnMgKHN0YXJ0aW5nIHdpdGggYSBwbHVzKVxuICAgICAgICAgICAgaWYgKG51bWJlci5jaGFyQXQoMCkgPT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbnVtZXJpY0NoYXJzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgY2hhcnNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IG51bWJlci5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGNoYXIgaXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmlzTnVtZXJpYyhjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpY0NoYXJzICs9IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBjdXJyZW50IG51bWVyaWNDaGFycyBtYWtlIGEgdmFsaWQgZGlhbCBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb3VudHJ5Q29kZXNbbnVtZXJpY0NoYXJzXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBhY3R1YWwgcmF3IHN0cmluZyAodXNlZnVsIGZvciBtYXRjaGluZyBsYXRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsQ29kZSA9IG51bWJlci5zdWJzdHIoMCwgaSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9uZ2VzdCBkaWFsIGNvZGUgaXMgNCBjaGFyc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bWVyaWNDaGFycy5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRpYWxDb2RlO1xuICAgICAgICB9LFxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICogIFBVQkxJQyBNRVRIT0RTXG4gICAqKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgLy8gdGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgaXBpbmZvIGNhbGwgcmV0dXJuc1xuICAgICAgICBhdXRvQ291bnRyeUxvYWRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID09IFwiYXV0b1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ID0gJC5mbltwbHVnaW5OYW1lXS5hdXRvQ291bnRyeTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRJbml0aWFsU3RhdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9Db3VudHJ5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyByZW1vdmUgcGx1Z2luXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBkcm9wZG93biBpcyBjbG9zZWQgKGFuZCB1bmJpbmQgbGlzdGVuZXJzKVxuICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGtleSBldmVudHMsIGFuZCBmb2N1cy9ibHVyIGV2ZW50cyBpZiBhdXRvSGlkZURpYWxDb2RlPXRydWVcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgZXZlbnQgb24gc2VsZWN0IGNvdW50cnlcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0Lm9mZih0aGlzLm5zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xpY2sgZXZlbnQgdG8gb3BlbiBkcm9wZG93blxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIucGFyZW50KCkub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgICAgIC8vIGxhYmVsIGNsaWNrIGhhY2tcbiAgICAgICAgICAgICAgICB0aGlzLnRlbElucHV0LmNsb3Nlc3QoXCJsYWJlbFwiKS5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZW1vdmUgbWFya3VwXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy50ZWxJbnB1dC5wYXJlbnQoKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5iZWZvcmUodGhpcy50ZWxJbnB1dCkucmVtb3ZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGV4dHJhY3QgdGhlIHBob25lIG51bWJlciBleHRlbnNpb24gaWYgcHJlc2VudFxuICAgICAgICBnZXRFeHRlbnNpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGVsSW5wdXQudmFsKCkuc3BsaXQoXCIgZXh0LiBcIilbMV0gfHwgXCJcIjtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZm9ybWF0IHRoZSBudW1iZXIgdG8gdGhlIGdpdmVuIHR5cGVcbiAgICAgICAgZ2V0TnVtYmVyOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmludGxUZWxJbnB1dFV0aWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGxUZWxJbnB1dFV0aWxzLmZvcm1hdE51bWJlckJ5VHlwZSh0aGlzLnRlbElucHV0LnZhbCgpLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgdHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0IHRoZSB0eXBlIG9mIHRoZSBlbnRlcmVkIG51bWJlciBlLmcuIGxhbmRsaW5lL21vYmlsZVxuICAgICAgICBnZXROdW1iZXJUeXBlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50bFRlbElucHV0VXRpbHMuZ2V0TnVtYmVyVHlwZSh0aGlzLnRlbElucHV0LnZhbCgpLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTk5O1xuICAgICAgICB9LFxuICAgICAgICAvLyBnZXQgdGhlIGNvdW50cnkgZGF0YSBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmbGFnXG4gICAgICAgIGdldFNlbGVjdGVkQ291bnRyeURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyB1bmRlZmluZWQsIHRoZSBwbHVnaW4gd2lsbCByZXR1cm4gaXQncyBpbnN0YW5jZSBpbnN0ZWFkLCBzbyBpbiB0aGF0IGNhc2UgYW4gZW1wdHkgb2JqZWN0IG1ha2VzIG1vcmUgc2Vuc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEgfHwge307XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdldCB0aGUgdmFsaWRhdGlvbiBlcnJvclxuICAgICAgICBnZXRWYWxpZGF0aW9uRXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnRsVGVsSW5wdXRVdGlscy5nZXRWYWxpZGF0aW9uRXJyb3IodGhpcy50ZWxJbnB1dC52YWwoKSwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC05OTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdmFsaWRhdGUgdGhlIGlucHV0IHZhbCAtIGFzc3VtZXMgdGhlIGdsb2JhbCBmdW5jdGlvbiBpc1ZhbGlkTnVtYmVyIChmcm9tIHV0aWxzU2NyaXB0KVxuICAgICAgICBpc1ZhbGlkTnVtYmVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSAkLnRyaW0odGhpcy50ZWxJbnB1dC52YWwoKSksIGNvdW50cnlDb2RlID0gdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSA/IHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yIDogXCJcIjtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50bFRlbElucHV0VXRpbHMuaXNWYWxpZE51bWJlcih2YWwsIGNvdW50cnlDb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gbG9hZCB0aGUgdXRpbHMgc2NyaXB0XG4gICAgICAgIGxvYWRVdGlsczogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHV0aWxzU2NyaXB0ID0gcGF0aCB8fCB0aGlzLm9wdGlvbnMudXRpbHNTY3JpcHQ7XG4gICAgICAgICAgICBpZiAoISQuZm5bcGx1Z2luTmFtZV0ubG9hZGVkVXRpbHNTY3JpcHQgJiYgdXRpbHNTY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBkbyB0aGlzIHR3aWNlISAoZG9udCBqdXN0IGNoZWNrIGlmIHRoZSBnbG9iYWwgaW50bFRlbElucHV0VXRpbHMgZXhpc3RzIGFzIGlmIGluaXQgcGx1Z2luIG11bHRpcGxlIHRpbWVzIGluIHF1aWNrIHN1Y2Nlc3Npb24sIGl0IG1heSBub3QgaGF2ZSBmaW5pc2hlZCBsb2FkaW5nIHlldClcbiAgICAgICAgICAgICAgICAkLmZuW3BsdWdpbk5hbWVdLmxvYWRlZFV0aWxzU2NyaXB0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBkb250IHVzZSAkLmdldFNjcmlwdCBhcyBpdCBwcmV2ZW50cyBjYWNoaW5nXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1dGlsc1NjcmlwdCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZWxsIGFsbCBpbnN0YW5jZXMgdGhlIHV0aWxzIGFyZSByZWFkeVxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5pbnRsLXRlbC1pbnB1dCBpbnB1dFwiKS5pbnRsVGVsSW5wdXQoXCJ1dGlsc0xvYWRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51dGlsc1NjcmlwdERlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXRpbHNTY3JpcHREZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgZmxhZywgYW5kIHVwZGF0ZSB0aGUgaW5wdXQgdmFsIGFjY29yZGluZ2x5XG4gICAgICAgIHNlbGVjdENvdW50cnk6IGZ1bmN0aW9uKGNvdW50cnlDb2RlKSB7XG4gICAgICAgICAgICBjb3VudHJ5Q29kZSA9IGNvdW50cnlDb2RlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIuaGFzQ2xhc3MoY291bnRyeUNvZGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0RmxhZyhjb3VudHJ5Q29kZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlhbENvZGUodGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNldCB0aGUgaW5wdXQgdmFsdWUgYW5kIHVwZGF0ZSB0aGUgZmxhZ1xuICAgICAgICBzZXROdW1iZXI6IGZ1bmN0aW9uKG51bWJlciwgZm9ybWF0LCBhZGRTdWZmaXgsIHByZXZlbnRDb252ZXJzaW9uLCBpc0FsbG93ZWRLZXkpIHtcbiAgICAgICAgICAgIC8vIGVuc3VyZSBzdGFydHMgd2l0aCBwbHVzXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUgJiYgbnVtYmVyLmNoYXJBdCgwKSAhPSBcIitcIikge1xuICAgICAgICAgICAgICAgIG51bWJlciA9IFwiK1wiICsgbnVtYmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2UgbXVzdCB1cGRhdGUgdGhlIGZsYWcgZmlyc3QsIHdoaWNoIHVwZGF0ZXMgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLCB3aGljaCBpcyB1c2VkIGxhdGVyIGZvciBmb3JtYXR0aW5nIHRoZSBudW1iZXIgYmVmb3JlIGRpc3BsYXlpbmcgaXRcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUZsYWdGcm9tTnVtYmVyKG51bWJlcik7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVWYWwobnVtYmVyLCBmb3JtYXQsIGFkZFN1ZmZpeCwgcHJldmVudENvbnZlcnNpb24sIGlzQWxsb3dlZEtleSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIHV0aWxzIGFyZSByZWFkeVxuICAgICAgICB1dGlsc0xvYWRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiBhdXRvRm9ybWF0IGlzIGVuYWJsZWQgYW5kIHRoZXJlJ3MgYW4gaW5pdGlhbCB2YWx1ZSBpbiB0aGUgaW5wdXQsIHRoZW4gZm9ybWF0IGl0XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgdGhpcy50ZWxJbnB1dC52YWwoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbCh0aGlzLnRlbElucHV0LnZhbCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIGFkYXB0ZWQgdG8gYWxsb3cgcHVibGljIGZ1bmN0aW9uc1xuICAgIC8vIHVzaW5nIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktYm9pbGVycGxhdGUvanF1ZXJ5LWJvaWxlcnBsYXRlL3dpa2kvRXh0ZW5kaW5nLWpRdWVyeS1Cb2lsZXJwbGF0ZVxuICAgICQuZm5bcGx1Z2luTmFtZV0gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAvLyBJcyB0aGUgZmlyc3QgcGFyYW1ldGVyIGFuIG9iamVjdCAob3B0aW9ucyksIG9yIHdhcyBvbWl0dGVkLFxuICAgICAgICAvLyBpbnN0YW50aWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgcGx1Z2luLlxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBvcHRpb25zID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB2YXIgZGVmZXJyZWRzID0gW107XG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgUGx1Z2luKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2VEZWZlcnJlZHMgPSBpbnN0YW5jZS5faW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBub3cgaGF2ZSAyIGRlZmZlcmVkczogMSBmb3IgYXV0byBjb3VudHJ5LCAxIGZvciB1dGlscyBzY3JpcHRcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWRzLnB1c2goaW5zdGFuY2VEZWZlcnJlZHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZHMucHVzaChpbnN0YW5jZURlZmVycmVkc1sxXSk7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUsIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgcHJvbWlzZSBmcm9tIHRoZSBcIm1hc3RlclwiIGRlZmVycmVkIG9iamVjdCB0aGF0IHRyYWNrcyBhbGwgdGhlIG90aGVyc1xuICAgICAgICAgICAgcmV0dXJuICQud2hlbi5hcHBseShudWxsLCBkZWZlcnJlZHMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiICYmIG9wdGlvbnNbMF0gIT09IFwiX1wiKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZmlyc3QgcGFyYW1ldGVyIGlzIGEgc3RyaW5nIGFuZCBpdCBkb2Vzbid0IHN0YXJ0XG4gICAgICAgICAgICAvLyB3aXRoIGFuIHVuZGVyc2NvcmUgb3IgXCJjb250YWluc1wiIHRoZSBgaW5pdGAtZnVuY3Rpb24sXG4gICAgICAgICAgICAvLyB0cmVhdCB0aGlzIGFzIGEgY2FsbCB0byBhIHB1YmxpYyBtZXRob2QuXG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbWV0aG9kIGNhbGwgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byByZXR1cm4gYSB2YWx1ZVxuICAgICAgICAgICAgdmFyIHJldHVybnM7XG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gJC5kYXRhKHRoaXMsIFwicGx1Z2luX1wiICsgcGx1Z2luTmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gVGVzdHMgdGhhdCB0aGVyZSdzIGFscmVhZHkgYSBwbHVnaW4taW5zdGFuY2VcbiAgICAgICAgICAgICAgICAvLyBhbmQgY2hlY2tzIHRoYXQgdGhlIHJlcXVlc3RlZCBwdWJsaWMgbWV0aG9kIGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFBsdWdpbiAmJiB0eXBlb2YgaW5zdGFuY2Vbb3B0aW9uc10gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBtZXRob2Qgb2Ygb3VyIHBsdWdpbiBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHBhc3MgaXQgdGhlIHN1cHBsaWVkIGFyZ3VtZW50cy5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJucyA9IGluc3RhbmNlW29wdGlvbnNdLmFwcGx5KGluc3RhbmNlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEFsbG93IGluc3RhbmNlcyB0byBiZSBkZXN0cm95ZWQgdmlhIHRoZSAnZGVzdHJveScgbWV0aG9kXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09IFwiZGVzdHJveVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gSWYgdGhlIGVhcmxpZXIgY2FjaGVkIG1ldGhvZCBnaXZlcyBhIHZhbHVlIGJhY2sgcmV0dXJuIHRoZSB2YWx1ZSxcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSByZXR1cm4gdGhpcyB0byBwcmVzZXJ2ZSBjaGFpbmFiaWxpdHkuXG4gICAgICAgICAgICByZXR1cm4gcmV0dXJucyAhPT0gdW5kZWZpbmVkID8gcmV0dXJucyA6IHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKioqKioqKioqKioqKioqKioqKlxuICogIFNUQVRJQyBNRVRIT0RTXG4gKioqKioqKioqKioqKioqKioqKiovXG4gICAgLy8gZ2V0IHRoZSBjb3VudHJ5IGRhdGEgb2JqZWN0XG4gICAgJC5mbltwbHVnaW5OYW1lXS5nZXRDb3VudHJ5RGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYWxsQ291bnRyaWVzO1xuICAgIH07XG4gICAgLy8gVGVsbCBKU0hpbnQgdG8gaWdub3JlIHRoaXMgd2FybmluZzogXCJjaGFyYWN0ZXIgbWF5IGdldCBzaWxlbnRseSBkZWxldGVkIGJ5IG9uZSBvciBtb3JlIGJyb3dzZXJzXCJcbiAgICAvLyBqc2hpbnQgLVcxMDBcbiAgICAvLyBBcnJheSBvZiBjb3VudHJ5IG9iamVjdHMgZm9yIHRoZSBmbGFnIGRyb3Bkb3duLlxuICAgIC8vIEVhY2ggY29udGFpbnMgYSBuYW1lLCBjb3VudHJ5IGNvZGUgKElTTyAzMTY2LTEgYWxwaGEtMikgYW5kIGRpYWwgY29kZS5cbiAgICAvLyBPcmlnaW5hbGx5IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21sZWRvemUvY291bnRyaWVzXG4gICAgLy8gdGhlbiBtb2RpZmllZCB1c2luZyB0aGUgZm9sbG93aW5nIEphdmFTY3JpcHQgKE5PVyBPVVQgT0YgREFURSk6XG4gICAgLypcbnZhciByZXN1bHQgPSBbXTtcbl8uZWFjaChjb3VudHJpZXMsIGZ1bmN0aW9uKGMpIHtcbiAgLy8gaWdub3JlIGNvdW50cmllcyB3aXRob3V0IGEgZGlhbCBjb2RlXG4gIGlmIChjLmNhbGxpbmdDb2RlWzBdLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIC8vIHZhciBsb2NhbHMgY29udGFpbnMgY291bnRyeSBuYW1lcyB3aXRoIGxvY2FsaXNlZCB2ZXJzaW9ucyBpbiBicmFja2V0c1xuICAgICAgbjogXy5maW5kV2hlcmUobG9jYWxzLCB7XG4gICAgICAgIGNvdW50cnlDb2RlOiBjLmNjYTJcbiAgICAgIH0pLm5hbWUsXG4gICAgICBpOiBjLmNjYTIudG9Mb3dlckNhc2UoKSxcbiAgICAgIGQ6IGMuY2FsbGluZ0NvZGVbMF1cbiAgICB9KTtcbiAgfVxufSk7XG5KU09OLnN0cmluZ2lmeShyZXN1bHQpO1xuKi9cbiAgICAvLyB0aGVuIHdpdGggYSBjb3VwbGUgb2YgbWFudWFsIHJlLWFycmFuZ2VtZW50cyB0byBiZSBhbHBoYWJldGljYWxcbiAgICAvLyB0aGVuIGNoYW5nZWQgS2F6YWtoc3RhbiBmcm9tICs3NiB0byArN1xuICAgIC8vIGFuZCBWYXRpY2FuIENpdHkgZnJvbSArMzc5IHRvICszOSAoc2VlIGlzc3VlIDUwKVxuICAgIC8vIGFuZCBDYXJpYmVhbiBOZXRoZXJsYW5kcyBmcm9tICs1OTk3IHRvICs1OTlcbiAgICAvLyBhbmQgQ3VyYWNhbyBmcm9tICs1OTk5IHRvICs1OTlcbiAgICAvLyBSZW1vdmVkOiDDhWxhbmQgSXNsYW5kcywgQ2hyaXN0bWFzIElzbGFuZCwgQ29jb3MgSXNsYW5kcywgR3Vlcm5zZXksIElzbGUgb2YgTWFuLCBKZXJzZXksIEtvc292bywgTWF5b3R0ZSwgUGl0Y2Fpcm4gSXNsYW5kcywgU291dGggR2VvcmdpYSwgU3ZhbGJhcmQsIFdlc3Rlcm4gU2FoYXJhXG4gICAgLy8gVXBkYXRlOiBjb252ZXJ0ZWQgb2JqZWN0cyB0byBhcnJheXMgdG8gc2F2ZSBieXRlcyFcbiAgICAvLyBVcGRhdGU6IGFkZGVkIFwicHJpb3JpdHlcIiBmb3IgY291bnRyaWVzIHdpdGggdGhlIHNhbWUgZGlhbENvZGUgYXMgb3RoZXJzXG4gICAgLy8gVXBkYXRlOiBhZGRlZCBhcnJheSBvZiBhcmVhIGNvZGVzIGZvciBjb3VudHJpZXMgd2l0aCB0aGUgc2FtZSBkaWFsQ29kZSBhcyBvdGhlcnNcbiAgICAvLyBTbyBlYWNoIGNvdW50cnkgYXJyYXkgaGFzIHRoZSBmb2xsb3dpbmcgaW5mb3JtYXRpb246XG4gICAgLy8gW1xuICAgIC8vICAgIENvdW50cnkgbmFtZSxcbiAgICAvLyAgICBpc28yIGNvZGUsXG4gICAgLy8gICAgSW50ZXJuYXRpb25hbCBkaWFsIGNvZGUsXG4gICAgLy8gICAgT3JkZXIgKGlmID4xIGNvdW50cnkgd2l0aCBzYW1lIGRpYWwgY29kZSksXG4gICAgLy8gICAgQXJlYSBjb2RlcyAoaWYgPjEgY291bnRyeSB3aXRoIHNhbWUgZGlhbCBjb2RlKVxuICAgIC8vIF1cbiAgICB2YXIgYWxsQ291bnRyaWVzID0gWyBbIFwiQWZnaGFuaXN0YW4gKOKAq9in2YHYutin2YbYs9iq2KfZhuKArOKAjilcIiwgXCJhZlwiLCBcIjkzXCIgXSwgWyBcIkFsYmFuaWEgKFNocWlww6tyaSlcIiwgXCJhbFwiLCBcIjM1NVwiIF0sIFsgXCJBbGdlcmlhICjigKvYp9mE2KzYstin2KbYseKArOKAjilcIiwgXCJkelwiLCBcIjIxM1wiIF0sIFsgXCJBbWVyaWNhbiBTYW1vYVwiLCBcImFzXCIsIFwiMTY4NFwiIF0sIFsgXCJBbmRvcnJhXCIsIFwiYWRcIiwgXCIzNzZcIiBdLCBbIFwiQW5nb2xhXCIsIFwiYW9cIiwgXCIyNDRcIiBdLCBbIFwiQW5ndWlsbGFcIiwgXCJhaVwiLCBcIjEyNjRcIiBdLCBbIFwiQW50aWd1YSBhbmQgQmFyYnVkYVwiLCBcImFnXCIsIFwiMTI2OFwiIF0sIFsgXCJBcmdlbnRpbmFcIiwgXCJhclwiLCBcIjU0XCIgXSwgWyBcIkFybWVuaWEgKNWA1aHVtdWh1b3Vv9Wh1bYpXCIsIFwiYW1cIiwgXCIzNzRcIiBdLCBbIFwiQXJ1YmFcIiwgXCJhd1wiLCBcIjI5N1wiIF0sIFsgXCJBdXN0cmFsaWFcIiwgXCJhdVwiLCBcIjYxXCIgXSwgWyBcIkF1c3RyaWEgKMOWc3RlcnJlaWNoKVwiLCBcImF0XCIsIFwiNDNcIiBdLCBbIFwiQXplcmJhaWphbiAoQXrJmXJiYXljYW4pXCIsIFwiYXpcIiwgXCI5OTRcIiBdLCBbIFwiQmFoYW1hc1wiLCBcImJzXCIsIFwiMTI0MlwiIF0sIFsgXCJCYWhyYWluICjigKvYp9mE2KjYrdix2YrZhuKArOKAjilcIiwgXCJiaFwiLCBcIjk3M1wiIF0sIFsgXCJCYW5nbGFkZXNoICjgpqzgpr7gpoLgprLgpr7gpqbgp4fgprYpXCIsIFwiYmRcIiwgXCI4ODBcIiBdLCBbIFwiQmFyYmFkb3NcIiwgXCJiYlwiLCBcIjEyNDZcIiBdLCBbIFwiQmVsYXJ1cyAo0JHQtdC70LDRgNGD0YHRjClcIiwgXCJieVwiLCBcIjM3NVwiIF0sIFsgXCJCZWxnaXVtIChCZWxnacOrKVwiLCBcImJlXCIsIFwiMzJcIiBdLCBbIFwiQmVsaXplXCIsIFwiYnpcIiwgXCI1MDFcIiBdLCBbIFwiQmVuaW4gKELDqW5pbilcIiwgXCJialwiLCBcIjIyOVwiIF0sIFsgXCJCZXJtdWRhXCIsIFwiYm1cIiwgXCIxNDQxXCIgXSwgWyBcIkJodXRhbiAo4L2g4L2W4L6y4L204L2CKVwiLCBcImJ0XCIsIFwiOTc1XCIgXSwgWyBcIkJvbGl2aWFcIiwgXCJib1wiLCBcIjU5MVwiIF0sIFsgXCJCb3NuaWEgYW5kIEhlcnplZ292aW5hICjQkdC+0YHQvdCwINC4INCl0LXRgNGG0LXQs9C+0LLQuNC90LApXCIsIFwiYmFcIiwgXCIzODdcIiBdLCBbIFwiQm90c3dhbmFcIiwgXCJid1wiLCBcIjI2N1wiIF0sIFsgXCJCcmF6aWwgKEJyYXNpbClcIiwgXCJiclwiLCBcIjU1XCIgXSwgWyBcIkJyaXRpc2ggSW5kaWFuIE9jZWFuIFRlcnJpdG9yeVwiLCBcImlvXCIsIFwiMjQ2XCIgXSwgWyBcIkJyaXRpc2ggVmlyZ2luIElzbGFuZHNcIiwgXCJ2Z1wiLCBcIjEyODRcIiBdLCBbIFwiQnJ1bmVpXCIsIFwiYm5cIiwgXCI2NzNcIiBdLCBbIFwiQnVsZ2FyaWEgKNCR0YrQu9Cz0LDRgNC40Y8pXCIsIFwiYmdcIiwgXCIzNTlcIiBdLCBbIFwiQnVya2luYSBGYXNvXCIsIFwiYmZcIiwgXCIyMjZcIiBdLCBbIFwiQnVydW5kaSAoVWJ1cnVuZGkpXCIsIFwiYmlcIiwgXCIyNTdcIiBdLCBbIFwiQ2FtYm9kaWEgKOGegOGemOGfkuGeluGeu+Geh+GetilcIiwgXCJraFwiLCBcIjg1NVwiIF0sIFsgXCJDYW1lcm9vbiAoQ2FtZXJvdW4pXCIsIFwiY21cIiwgXCIyMzdcIiBdLCBbIFwiQ2FuYWRhXCIsIFwiY2FcIiwgXCIxXCIsIDEsIFsgXCIyMDRcIiwgXCIyMjZcIiwgXCIyMzZcIiwgXCIyNDlcIiwgXCIyNTBcIiwgXCIyODlcIiwgXCIzMDZcIiwgXCIzNDNcIiwgXCIzNjVcIiwgXCIzODdcIiwgXCI0MDNcIiwgXCI0MTZcIiwgXCI0MThcIiwgXCI0MzFcIiwgXCI0MzdcIiwgXCI0MzhcIiwgXCI0NTBcIiwgXCI1MDZcIiwgXCI1MTRcIiwgXCI1MTlcIiwgXCI1NDhcIiwgXCI1NzlcIiwgXCI1ODFcIiwgXCI1ODdcIiwgXCI2MDRcIiwgXCI2MTNcIiwgXCI2MzlcIiwgXCI2NDdcIiwgXCI2NzJcIiwgXCI3MDVcIiwgXCI3MDlcIiwgXCI3NDJcIiwgXCI3NzhcIiwgXCI3ODBcIiwgXCI3ODJcIiwgXCI4MDdcIiwgXCI4MTlcIiwgXCI4MjVcIiwgXCI4NjdcIiwgXCI4NzNcIiwgXCI5MDJcIiwgXCI5MDVcIiBdIF0sIFsgXCJDYXBlIFZlcmRlIChLYWJ1IFZlcmRpKVwiLCBcImN2XCIsIFwiMjM4XCIgXSwgWyBcIkNhcmliYmVhbiBOZXRoZXJsYW5kc1wiLCBcImJxXCIsIFwiNTk5XCIsIDEgXSwgWyBcIkNheW1hbiBJc2xhbmRzXCIsIFwia3lcIiwgXCIxMzQ1XCIgXSwgWyBcIkNlbnRyYWwgQWZyaWNhbiBSZXB1YmxpYyAoUsOpcHVibGlxdWUgY2VudHJhZnJpY2FpbmUpXCIsIFwiY2ZcIiwgXCIyMzZcIiBdLCBbIFwiQ2hhZCAoVGNoYWQpXCIsIFwidGRcIiwgXCIyMzVcIiBdLCBbIFwiQ2hpbGVcIiwgXCJjbFwiLCBcIjU2XCIgXSwgWyBcIkNoaW5hICjkuK3lm70pXCIsIFwiY25cIiwgXCI4NlwiIF0sIFsgXCJDb2xvbWJpYVwiLCBcImNvXCIsIFwiNTdcIiBdLCBbIFwiQ29tb3JvcyAo4oCr2KzYstixINin2YTZgtmF2LHigKzigI4pXCIsIFwia21cIiwgXCIyNjlcIiBdLCBbIFwiQ29uZ28gKERSQykgKEphbWh1cmkgeWEgS2lkZW1va3Jhc2lhIHlhIEtvbmdvKVwiLCBcImNkXCIsIFwiMjQzXCIgXSwgWyBcIkNvbmdvIChSZXB1YmxpYykgKENvbmdvLUJyYXp6YXZpbGxlKVwiLCBcImNnXCIsIFwiMjQyXCIgXSwgWyBcIkNvb2sgSXNsYW5kc1wiLCBcImNrXCIsIFwiNjgyXCIgXSwgWyBcIkNvc3RhIFJpY2FcIiwgXCJjclwiLCBcIjUwNlwiIF0sIFsgXCJDw7R0ZSBk4oCZSXZvaXJlXCIsIFwiY2lcIiwgXCIyMjVcIiBdLCBbIFwiQ3JvYXRpYSAoSHJ2YXRza2EpXCIsIFwiaHJcIiwgXCIzODVcIiBdLCBbIFwiQ3ViYVwiLCBcImN1XCIsIFwiNTNcIiBdLCBbIFwiQ3VyYcOnYW9cIiwgXCJjd1wiLCBcIjU5OVwiLCAwIF0sIFsgXCJDeXBydXMgKM6az43PgM+Bzr/PgilcIiwgXCJjeVwiLCBcIjM1N1wiIF0sIFsgXCJDemVjaCBSZXB1YmxpYyAoxIxlc2vDoSByZXB1Ymxpa2EpXCIsIFwiY3pcIiwgXCI0MjBcIiBdLCBbIFwiRGVubWFyayAoRGFubWFyaylcIiwgXCJka1wiLCBcIjQ1XCIgXSwgWyBcIkRqaWJvdXRpXCIsIFwiZGpcIiwgXCIyNTNcIiBdLCBbIFwiRG9taW5pY2FcIiwgXCJkbVwiLCBcIjE3NjdcIiBdLCBbIFwiRG9taW5pY2FuIFJlcHVibGljIChSZXDDumJsaWNhIERvbWluaWNhbmEpXCIsIFwiZG9cIiwgXCIxXCIsIDIsIFsgXCI4MDlcIiwgXCI4MjlcIiwgXCI4NDlcIiBdIF0sIFsgXCJFY3VhZG9yXCIsIFwiZWNcIiwgXCI1OTNcIiBdLCBbIFwiRWd5cHQgKOKAq9mF2LXYseKArOKAjilcIiwgXCJlZ1wiLCBcIjIwXCIgXSwgWyBcIkVsIFNhbHZhZG9yXCIsIFwic3ZcIiwgXCI1MDNcIiBdLCBbIFwiRXF1YXRvcmlhbCBHdWluZWEgKEd1aW5lYSBFY3VhdG9yaWFsKVwiLCBcImdxXCIsIFwiMjQwXCIgXSwgWyBcIkVyaXRyZWFcIiwgXCJlclwiLCBcIjI5MVwiIF0sIFsgXCJFc3RvbmlhIChFZXN0aSlcIiwgXCJlZVwiLCBcIjM3MlwiIF0sIFsgXCJFdGhpb3BpYVwiLCBcImV0XCIsIFwiMjUxXCIgXSwgWyBcIkZhbGtsYW5kIElzbGFuZHMgKElzbGFzIE1hbHZpbmFzKVwiLCBcImZrXCIsIFwiNTAwXCIgXSwgWyBcIkZhcm9lIElzbGFuZHMgKEbDuHJveWFyKVwiLCBcImZvXCIsIFwiMjk4XCIgXSwgWyBcIkZpamlcIiwgXCJmalwiLCBcIjY3OVwiIF0sIFsgXCJGaW5sYW5kIChTdW9taSlcIiwgXCJmaVwiLCBcIjM1OFwiIF0sIFsgXCJGcmFuY2VcIiwgXCJmclwiLCBcIjMzXCIgXSwgWyBcIkZyZW5jaCBHdWlhbmEgKEd1eWFuZSBmcmFuw6dhaXNlKVwiLCBcImdmXCIsIFwiNTk0XCIgXSwgWyBcIkZyZW5jaCBQb2x5bmVzaWEgKFBvbHluw6lzaWUgZnJhbsOnYWlzZSlcIiwgXCJwZlwiLCBcIjY4OVwiIF0sIFsgXCJHYWJvblwiLCBcImdhXCIsIFwiMjQxXCIgXSwgWyBcIkdhbWJpYVwiLCBcImdtXCIsIFwiMjIwXCIgXSwgWyBcIkdlb3JnaWEgKOGDoeGDkOGDpeGDkOGDoOGDl+GDleGDlOGDmuGDnSlcIiwgXCJnZVwiLCBcIjk5NVwiIF0sIFsgXCJHZXJtYW55IChEZXV0c2NobGFuZClcIiwgXCJkZVwiLCBcIjQ5XCIgXSwgWyBcIkdoYW5hIChHYWFuYSlcIiwgXCJnaFwiLCBcIjIzM1wiIF0sIFsgXCJHaWJyYWx0YXJcIiwgXCJnaVwiLCBcIjM1MFwiIF0sIFsgXCJHcmVlY2UgKM6VzrvOu86szrTOsSlcIiwgXCJnclwiLCBcIjMwXCIgXSwgWyBcIkdyZWVubGFuZCAoS2FsYWFsbGl0IE51bmFhdClcIiwgXCJnbFwiLCBcIjI5OVwiIF0sIFsgXCJHcmVuYWRhXCIsIFwiZ2RcIiwgXCIxNDczXCIgXSwgWyBcIkd1YWRlbG91cGVcIiwgXCJncFwiLCBcIjU5MFwiLCAwIF0sIFsgXCJHdWFtXCIsIFwiZ3VcIiwgXCIxNjcxXCIgXSwgWyBcIkd1YXRlbWFsYVwiLCBcImd0XCIsIFwiNTAyXCIgXSwgWyBcIkd1aW5lYSAoR3VpbsOpZSlcIiwgXCJnblwiLCBcIjIyNFwiIF0sIFsgXCJHdWluZWEtQmlzc2F1IChHdWluw6kgQmlzc2F1KVwiLCBcImd3XCIsIFwiMjQ1XCIgXSwgWyBcIkd1eWFuYVwiLCBcImd5XCIsIFwiNTkyXCIgXSwgWyBcIkhhaXRpXCIsIFwiaHRcIiwgXCI1MDlcIiBdLCBbIFwiSG9uZHVyYXNcIiwgXCJoblwiLCBcIjUwNFwiIF0sIFsgXCJIb25nIEtvbmcgKOmmmea4rylcIiwgXCJoa1wiLCBcIjg1MlwiIF0sIFsgXCJIdW5nYXJ5IChNYWd5YXJvcnN6w6FnKVwiLCBcImh1XCIsIFwiMzZcIiBdLCBbIFwiSWNlbGFuZCAow41zbGFuZClcIiwgXCJpc1wiLCBcIjM1NFwiIF0sIFsgXCJJbmRpYSAo4KSt4KS+4KSw4KSkKVwiLCBcImluXCIsIFwiOTFcIiBdLCBbIFwiSW5kb25lc2lhXCIsIFwiaWRcIiwgXCI2MlwiIF0sIFsgXCJJcmFuICjigKvYp9uM2LHYp9mG4oCs4oCOKVwiLCBcImlyXCIsIFwiOThcIiBdLCBbIFwiSXJhcSAo4oCr2KfZhNi52LHYp9mC4oCs4oCOKVwiLCBcImlxXCIsIFwiOTY0XCIgXSwgWyBcIklyZWxhbmRcIiwgXCJpZVwiLCBcIjM1M1wiIF0sIFsgXCJJc3JhZWwgKOKAq9eZ16nXqNeQ15zigKzigI4pXCIsIFwiaWxcIiwgXCI5NzJcIiBdLCBbIFwiSXRhbHkgKEl0YWxpYSlcIiwgXCJpdFwiLCBcIjM5XCIsIDAgXSwgWyBcIkphbWFpY2FcIiwgXCJqbVwiLCBcIjE4NzZcIiBdLCBbIFwiSmFwYW4gKOaXpeacrClcIiwgXCJqcFwiLCBcIjgxXCIgXSwgWyBcIkpvcmRhbiAo4oCr2KfZhNij2LHYr9mG4oCs4oCOKVwiLCBcImpvXCIsIFwiOTYyXCIgXSwgWyBcIkthemFraHN0YW4gKNCa0LDQt9Cw0YXRgdGC0LDQvSlcIiwgXCJrelwiLCBcIjdcIiwgMSBdLCBbIFwiS2VueWFcIiwgXCJrZVwiLCBcIjI1NFwiIF0sIFsgXCJLaXJpYmF0aVwiLCBcImtpXCIsIFwiNjg2XCIgXSwgWyBcIkt1d2FpdCAo4oCr2KfZhNmD2YjZitiq4oCs4oCOKVwiLCBcImt3XCIsIFwiOTY1XCIgXSwgWyBcIkt5cmd5enN0YW4gKNCa0YvRgNCz0YvQt9GB0YLQsNC9KVwiLCBcImtnXCIsIFwiOTk2XCIgXSwgWyBcIkxhb3MgKOC6peC6suC6pylcIiwgXCJsYVwiLCBcIjg1NlwiIF0sIFsgXCJMYXR2aWEgKExhdHZpamEpXCIsIFwibHZcIiwgXCIzNzFcIiBdLCBbIFwiTGViYW5vbiAo4oCr2YTYqNmG2KfZhuKArOKAjilcIiwgXCJsYlwiLCBcIjk2MVwiIF0sIFsgXCJMZXNvdGhvXCIsIFwibHNcIiwgXCIyNjZcIiBdLCBbIFwiTGliZXJpYVwiLCBcImxyXCIsIFwiMjMxXCIgXSwgWyBcIkxpYnlhICjigKvZhNmK2KjZitin4oCs4oCOKVwiLCBcImx5XCIsIFwiMjE4XCIgXSwgWyBcIkxpZWNodGVuc3RlaW5cIiwgXCJsaVwiLCBcIjQyM1wiIF0sIFsgXCJMaXRodWFuaWEgKExpZXR1dmEpXCIsIFwibHRcIiwgXCIzNzBcIiBdLCBbIFwiTHV4ZW1ib3VyZ1wiLCBcImx1XCIsIFwiMzUyXCIgXSwgWyBcIk1hY2F1ICjmvrPploApXCIsIFwibW9cIiwgXCI4NTNcIiBdLCBbIFwiTWFjZWRvbmlhIChGWVJPTSkgKNCc0LDQutC10LTQvtC90LjRmNCwKVwiLCBcIm1rXCIsIFwiMzg5XCIgXSwgWyBcIk1hZGFnYXNjYXIgKE1hZGFnYXNpa2FyYSlcIiwgXCJtZ1wiLCBcIjI2MVwiIF0sIFsgXCJNYWxhd2lcIiwgXCJtd1wiLCBcIjI2NVwiIF0sIFsgXCJNYWxheXNpYVwiLCBcIm15XCIsIFwiNjBcIiBdLCBbIFwiTWFsZGl2ZXNcIiwgXCJtdlwiLCBcIjk2MFwiIF0sIFsgXCJNYWxpXCIsIFwibWxcIiwgXCIyMjNcIiBdLCBbIFwiTWFsdGFcIiwgXCJtdFwiLCBcIjM1NlwiIF0sIFsgXCJNYXJzaGFsbCBJc2xhbmRzXCIsIFwibWhcIiwgXCI2OTJcIiBdLCBbIFwiTWFydGluaXF1ZVwiLCBcIm1xXCIsIFwiNTk2XCIgXSwgWyBcIk1hdXJpdGFuaWEgKOKAq9mF2YjYsdmK2KrYp9mG2YrYp+KArOKAjilcIiwgXCJtclwiLCBcIjIyMlwiIF0sIFsgXCJNYXVyaXRpdXMgKE1vcmlzKVwiLCBcIm11XCIsIFwiMjMwXCIgXSwgWyBcIk1leGljbyAoTcOpeGljbylcIiwgXCJteFwiLCBcIjUyXCIgXSwgWyBcIk1pY3JvbmVzaWFcIiwgXCJmbVwiLCBcIjY5MVwiIF0sIFsgXCJNb2xkb3ZhIChSZXB1YmxpY2EgTW9sZG92YSlcIiwgXCJtZFwiLCBcIjM3M1wiIF0sIFsgXCJNb25hY29cIiwgXCJtY1wiLCBcIjM3N1wiIF0sIFsgXCJNb25nb2xpYSAo0JzQvtC90LPQvtC7KVwiLCBcIm1uXCIsIFwiOTc2XCIgXSwgWyBcIk1vbnRlbmVncm8gKENybmEgR29yYSlcIiwgXCJtZVwiLCBcIjM4MlwiIF0sIFsgXCJNb250c2VycmF0XCIsIFwibXNcIiwgXCIxNjY0XCIgXSwgWyBcIk1vcm9jY28gKOKAq9in2YTZhdi62LHYqOKArOKAjilcIiwgXCJtYVwiLCBcIjIxMlwiIF0sIFsgXCJNb3phbWJpcXVlIChNb8OnYW1iaXF1ZSlcIiwgXCJtelwiLCBcIjI1OFwiIF0sIFsgXCJNeWFubWFyIChCdXJtYSkgKOGAmeGAvOGAlOGAuuGAmeGArClcIiwgXCJtbVwiLCBcIjk1XCIgXSwgWyBcIk5hbWliaWEgKE5hbWliacOrKVwiLCBcIm5hXCIsIFwiMjY0XCIgXSwgWyBcIk5hdXJ1XCIsIFwibnJcIiwgXCI2NzRcIiBdLCBbIFwiTmVwYWwgKOCkqOClh+CkquCkvuCksilcIiwgXCJucFwiLCBcIjk3N1wiIF0sIFsgXCJOZXRoZXJsYW5kcyAoTmVkZXJsYW5kKVwiLCBcIm5sXCIsIFwiMzFcIiBdLCBbIFwiTmV3IENhbGVkb25pYSAoTm91dmVsbGUtQ2Fsw6lkb25pZSlcIiwgXCJuY1wiLCBcIjY4N1wiIF0sIFsgXCJOZXcgWmVhbGFuZFwiLCBcIm56XCIsIFwiNjRcIiBdLCBbIFwiTmljYXJhZ3VhXCIsIFwibmlcIiwgXCI1MDVcIiBdLCBbIFwiTmlnZXIgKE5pamFyKVwiLCBcIm5lXCIsIFwiMjI3XCIgXSwgWyBcIk5pZ2VyaWFcIiwgXCJuZ1wiLCBcIjIzNFwiIF0sIFsgXCJOaXVlXCIsIFwibnVcIiwgXCI2ODNcIiBdLCBbIFwiTm9yZm9sayBJc2xhbmRcIiwgXCJuZlwiLCBcIjY3MlwiIF0sIFsgXCJOb3J0aCBLb3JlYSAo7KGw7ISgIOuvvOyjvOyjvOydmCDsnbjrr7wg6rO17ZmU6rWtKVwiLCBcImtwXCIsIFwiODUwXCIgXSwgWyBcIk5vcnRoZXJuIE1hcmlhbmEgSXNsYW5kc1wiLCBcIm1wXCIsIFwiMTY3MFwiIF0sIFsgXCJOb3J3YXkgKE5vcmdlKVwiLCBcIm5vXCIsIFwiNDdcIiBdLCBbIFwiT21hbiAo4oCr2LnZj9mF2KfZhuKArOKAjilcIiwgXCJvbVwiLCBcIjk2OFwiIF0sIFsgXCJQYWtpc3RhbiAo4oCr2b7Yp9qp2LPYqtin2YbigKzigI4pXCIsIFwicGtcIiwgXCI5MlwiIF0sIFsgXCJQYWxhdVwiLCBcInB3XCIsIFwiNjgwXCIgXSwgWyBcIlBhbGVzdGluZSAo4oCr2YHZhNiz2LfZitmG4oCs4oCOKVwiLCBcInBzXCIsIFwiOTcwXCIgXSwgWyBcIlBhbmFtYSAoUGFuYW3DoSlcIiwgXCJwYVwiLCBcIjUwN1wiIF0sIFsgXCJQYXB1YSBOZXcgR3VpbmVhXCIsIFwicGdcIiwgXCI2NzVcIiBdLCBbIFwiUGFyYWd1YXlcIiwgXCJweVwiLCBcIjU5NVwiIF0sIFsgXCJQZXJ1IChQZXLDuilcIiwgXCJwZVwiLCBcIjUxXCIgXSwgWyBcIlBoaWxpcHBpbmVzXCIsIFwicGhcIiwgXCI2M1wiIF0sIFsgXCJQb2xhbmQgKFBvbHNrYSlcIiwgXCJwbFwiLCBcIjQ4XCIgXSwgWyBcIlBvcnR1Z2FsXCIsIFwicHRcIiwgXCIzNTFcIiBdLCBbIFwiUHVlcnRvIFJpY29cIiwgXCJwclwiLCBcIjFcIiwgMywgWyBcIjc4N1wiLCBcIjkzOVwiIF0gXSwgWyBcIlFhdGFyICjigKvZgti32LHigKzigI4pXCIsIFwicWFcIiwgXCI5NzRcIiBdLCBbIFwiUsOpdW5pb24gKExhIFLDqXVuaW9uKVwiLCBcInJlXCIsIFwiMjYyXCIgXSwgWyBcIlJvbWFuaWEgKFJvbcOibmlhKVwiLCBcInJvXCIsIFwiNDBcIiBdLCBbIFwiUnVzc2lhICjQoNC+0YHRgdC40Y8pXCIsIFwicnVcIiwgXCI3XCIsIDAgXSwgWyBcIlJ3YW5kYVwiLCBcInJ3XCIsIFwiMjUwXCIgXSwgWyBcIlNhaW50IEJhcnRow6lsZW15IChTYWludC1CYXJ0aMOpbGVteSlcIiwgXCJibFwiLCBcIjU5MFwiLCAxIF0sIFsgXCJTYWludCBIZWxlbmFcIiwgXCJzaFwiLCBcIjI5MFwiIF0sIFsgXCJTYWludCBLaXR0cyBhbmQgTmV2aXNcIiwgXCJrblwiLCBcIjE4NjlcIiBdLCBbIFwiU2FpbnQgTHVjaWFcIiwgXCJsY1wiLCBcIjE3NThcIiBdLCBbIFwiU2FpbnQgTWFydGluIChTYWludC1NYXJ0aW4gKHBhcnRpZSBmcmFuw6dhaXNlKSlcIiwgXCJtZlwiLCBcIjU5MFwiLCAyIF0sIFsgXCJTYWludCBQaWVycmUgYW5kIE1pcXVlbG9uIChTYWludC1QaWVycmUtZXQtTWlxdWVsb24pXCIsIFwicG1cIiwgXCI1MDhcIiBdLCBbIFwiU2FpbnQgVmluY2VudCBhbmQgdGhlIEdyZW5hZGluZXNcIiwgXCJ2Y1wiLCBcIjE3ODRcIiBdLCBbIFwiU2Ftb2FcIiwgXCJ3c1wiLCBcIjY4NVwiIF0sIFsgXCJTYW4gTWFyaW5vXCIsIFwic21cIiwgXCIzNzhcIiBdLCBbIFwiU8OjbyBUb23DqSBhbmQgUHLDrW5jaXBlIChTw6NvIFRvbcOpIGUgUHLDrW5jaXBlKVwiLCBcInN0XCIsIFwiMjM5XCIgXSwgWyBcIlNhdWRpIEFyYWJpYSAo4oCr2KfZhNmF2YXZhNmD2Kkg2KfZhNi52LHYqNmK2Kkg2KfZhNiz2LnZiNiv2YrYqeKArOKAjilcIiwgXCJzYVwiLCBcIjk2NlwiIF0sIFsgXCJTZW5lZ2FsIChTw6luw6lnYWwpXCIsIFwic25cIiwgXCIyMjFcIiBdLCBbIFwiU2VyYmlhICjQodGA0LHQuNGY0LApXCIsIFwicnNcIiwgXCIzODFcIiBdLCBbIFwiU2V5Y2hlbGxlc1wiLCBcInNjXCIsIFwiMjQ4XCIgXSwgWyBcIlNpZXJyYSBMZW9uZVwiLCBcInNsXCIsIFwiMjMyXCIgXSwgWyBcIlNpbmdhcG9yZVwiLCBcInNnXCIsIFwiNjVcIiBdLCBbIFwiU2ludCBNYWFydGVuXCIsIFwic3hcIiwgXCIxNzIxXCIgXSwgWyBcIlNsb3Zha2lhIChTbG92ZW5za28pXCIsIFwic2tcIiwgXCI0MjFcIiBdLCBbIFwiU2xvdmVuaWEgKFNsb3ZlbmlqYSlcIiwgXCJzaVwiLCBcIjM4NlwiIF0sIFsgXCJTb2xvbW9uIElzbGFuZHNcIiwgXCJzYlwiLCBcIjY3N1wiIF0sIFsgXCJTb21hbGlhIChTb29tYWFsaXlhKVwiLCBcInNvXCIsIFwiMjUyXCIgXSwgWyBcIlNvdXRoIEFmcmljYVwiLCBcInphXCIsIFwiMjdcIiBdLCBbIFwiU291dGggS29yZWEgKOuMgO2VnOuvvOq1rSlcIiwgXCJrclwiLCBcIjgyXCIgXSwgWyBcIlNvdXRoIFN1ZGFuICjigKvYrNmG2YjYqCDYp9mE2LPZiNiv2KfZhuKArOKAjilcIiwgXCJzc1wiLCBcIjIxMVwiIF0sIFsgXCJTcGFpbiAoRXNwYcOxYSlcIiwgXCJlc1wiLCBcIjM0XCIgXSwgWyBcIlNyaSBMYW5rYSAo4LeB4LeK4oCN4La74LeTIOC2veC2guC2muC3j+C3gClcIiwgXCJsa1wiLCBcIjk0XCIgXSwgWyBcIlN1ZGFuICjigKvYp9mE2LPZiNiv2KfZhuKArOKAjilcIiwgXCJzZFwiLCBcIjI0OVwiIF0sIFsgXCJTdXJpbmFtZVwiLCBcInNyXCIsIFwiNTk3XCIgXSwgWyBcIlN3YXppbGFuZFwiLCBcInN6XCIsIFwiMjY4XCIgXSwgWyBcIlN3ZWRlbiAoU3ZlcmlnZSlcIiwgXCJzZVwiLCBcIjQ2XCIgXSwgWyBcIlN3aXR6ZXJsYW5kIChTY2h3ZWl6KVwiLCBcImNoXCIsIFwiNDFcIiBdLCBbIFwiU3lyaWEgKOKAq9iz2YjYsdmK2KfigKzigI4pXCIsIFwic3lcIiwgXCI5NjNcIiBdLCBbIFwiVGFpd2FuICjlj7DngaMpXCIsIFwidHdcIiwgXCI4ODZcIiBdLCBbIFwiVGFqaWtpc3RhblwiLCBcInRqXCIsIFwiOTkyXCIgXSwgWyBcIlRhbnphbmlhXCIsIFwidHpcIiwgXCIyNTVcIiBdLCBbIFwiVGhhaWxhbmQgKOC5hOC4l+C4oilcIiwgXCJ0aFwiLCBcIjY2XCIgXSwgWyBcIlRpbW9yLUxlc3RlXCIsIFwidGxcIiwgXCI2NzBcIiBdLCBbIFwiVG9nb1wiLCBcInRnXCIsIFwiMjI4XCIgXSwgWyBcIlRva2VsYXVcIiwgXCJ0a1wiLCBcIjY5MFwiIF0sIFsgXCJUb25nYVwiLCBcInRvXCIsIFwiNjc2XCIgXSwgWyBcIlRyaW5pZGFkIGFuZCBUb2JhZ29cIiwgXCJ0dFwiLCBcIjE4NjhcIiBdLCBbIFwiVHVuaXNpYSAo4oCr2KrZiNmG2LPigKzigI4pXCIsIFwidG5cIiwgXCIyMTZcIiBdLCBbIFwiVHVya2V5IChUw7xya2l5ZSlcIiwgXCJ0clwiLCBcIjkwXCIgXSwgWyBcIlR1cmttZW5pc3RhblwiLCBcInRtXCIsIFwiOTkzXCIgXSwgWyBcIlR1cmtzIGFuZCBDYWljb3MgSXNsYW5kc1wiLCBcInRjXCIsIFwiMTY0OVwiIF0sIFsgXCJUdXZhbHVcIiwgXCJ0dlwiLCBcIjY4OFwiIF0sIFsgXCJVLlMuIFZpcmdpbiBJc2xhbmRzXCIsIFwidmlcIiwgXCIxMzQwXCIgXSwgWyBcIlVnYW5kYVwiLCBcInVnXCIsIFwiMjU2XCIgXSwgWyBcIlVrcmFpbmUgKNCj0LrRgNCw0ZfQvdCwKVwiLCBcInVhXCIsIFwiMzgwXCIgXSwgWyBcIlVuaXRlZCBBcmFiIEVtaXJhdGVzICjigKvYp9mE2KXZhdin2LHYp9iqINin2YTYudix2KjZitipINin2YTZhdiq2K3Yr9ip4oCs4oCOKVwiLCBcImFlXCIsIFwiOTcxXCIgXSwgWyBcIlVuaXRlZCBLaW5nZG9tXCIsIFwiZ2JcIiwgXCI0NFwiIF0sIFsgXCJVbml0ZWQgU3RhdGVzXCIsIFwidXNcIiwgXCIxXCIsIDAgXSwgWyBcIlVydWd1YXlcIiwgXCJ1eVwiLCBcIjU5OFwiIF0sIFsgXCJVemJla2lzdGFuIChPyrt6YmVraXN0b24pXCIsIFwidXpcIiwgXCI5OThcIiBdLCBbIFwiVmFudWF0dVwiLCBcInZ1XCIsIFwiNjc4XCIgXSwgWyBcIlZhdGljYW4gQ2l0eSAoQ2l0dMOgIGRlbCBWYXRpY2FubylcIiwgXCJ2YVwiLCBcIjM5XCIsIDEgXSwgWyBcIlZlbmV6dWVsYVwiLCBcInZlXCIsIFwiNThcIiBdLCBbIFwiVmlldG5hbSAoVmnhu4d0IE5hbSlcIiwgXCJ2blwiLCBcIjg0XCIgXSwgWyBcIldhbGxpcyBhbmQgRnV0dW5hXCIsIFwid2ZcIiwgXCI2ODFcIiBdLCBbIFwiWWVtZW4gKOKAq9in2YTZitmF2YbigKzigI4pXCIsIFwieWVcIiwgXCI5NjdcIiBdLCBbIFwiWmFtYmlhXCIsIFwiem1cIiwgXCIyNjBcIiBdLCBbIFwiWmltYmFid2VcIiwgXCJ6d1wiLCBcIjI2M1wiIF0gXTtcbiAgICAvLyBsb29wIG92ZXIgYWxsIG9mIHRoZSBjb3VudHJpZXMgYWJvdmVcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbENvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGFsbENvdW50cmllc1tpXTtcbiAgICAgICAgYWxsQ291bnRyaWVzW2ldID0ge1xuICAgICAgICAgICAgbmFtZTogY1swXSxcbiAgICAgICAgICAgIGlzbzI6IGNbMV0sXG4gICAgICAgICAgICBkaWFsQ29kZTogY1syXSxcbiAgICAgICAgICAgIHByaW9yaXR5OiBjWzNdIHx8IDAsXG4gICAgICAgICAgICBhcmVhQ29kZXM6IGNbNF0gfHwgbnVsbFxuICAgICAgICB9O1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdmVuZG9yL2ludGwtdGVsLWlucHV0L2J1aWxkL2pzL2ludGxUZWxJbnB1dC5qc1xuLy8gbW9kdWxlIGlkID0gMzc2XG4vLyBtb2R1bGUgY2h1bmtzID0gOCA5IiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xlc3Mvd2ViL21vZHVsZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIubGVzc1xuLy8gbW9kdWxlIGlkID0gMzc5XG4vLyBtb2R1bGUgY2h1bmtzID0gOCA5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgIE15dHJhdmVsbGVyID0gcmVxdWlyZSgnY29tcG9uZW50cy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpO1xuICAgICBcbiAgICAgcmVxdWlyZSgnd2ViL21vZHVsZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIubGVzcycpO1xuLy8kKGZ1bmN0aW9uKCkge1xuLy8gICAgY29uc29sZS5sb2coJ0luc2lkZSBNYWluIG15dHJhdmVsbGVyJyk7XG4vLyAgICB2YXIgbXl0cmF2ZWxsZXIgPSBuZXcgTXl0cmF2ZWxsZXIoKTtcbi8vICAgIHZhciB1c2VyID0gbmV3IFVzZXIoKTsgICAgXG4vL1xuLy8gICAgbXl0cmF2ZWxsZXIucmVuZGVyKCcjY29udGVudCcpO1xuLy8gICAgdXNlci5yZW5kZXIoJyNwYW5lbCcpO1xuLy99KTtcblxuJChmdW5jdGlvbigpIHtcbiAgICAobmV3IE15dHJhdmVsbGVyKCkpLnJlbmRlcignI2FwcCcpO1xufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL215dHJhdmVsbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzODNcbi8vIG1vZHVsZSBjaHVua3MgPSA5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgLy8gTXl0cmF2ZWxsZXIgPSByZXF1aXJlKCdhcHAvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJylcbiAgICBNeXRyYXZlbGxlciA9IHJlcXVpcmUoJ3N0b3Jlcy9teXRyYXZlbGxlci90cmF2ZWxlcicpLFxuICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvbXl0cmF2ZWxsZXIvbWV0YScpXG4gICAgLy8sXG4gICAvLyBVc2VyID0gcmVxdWlyZSgnc3RvcmVzL3VzZXIvdXNlcicpXG4gICAgO1xuXG4vL3JlcXVpcmUoJ21vZHVsZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIubGVzcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyLmh0bWwnKSxcblxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ2xheW91dCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2xheW91dCcpLFxuICAgICAgICAndHJhdmVsbGVyLWZvcm0nOiByZXF1aXJlKCdjb21wb25lbnRzL215dHJhdmVsbGVyL2Zvcm0nKSxcbiAgICAgICAgdHJhdmVsbGVydmlldzogcmVxdWlyZSgnY29tcG9uZW50cy9teXRyYXZlbGxlci92aWV3JyksXG4gICAgICAgIHRyYXZlbGxlcmxpc3Q6IHJlcXVpcmUoJ2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvbGlzdCcpLFxuICAgICAvLyAgIGxlZnRwYW5lbDpyZXF1aXJlKCdjb21wb25lbnRzL2xheW91dHMvcHJvZmlsZV9zaWRlYmFyJylcbiAgICAgIC8vICBwcm9maWxlc2lkZWJhcjogcmVxdWlyZSgnLi4vbGF5b3V0cy9wcm9maWxlX3NpZGViYXInKVxuICAgIH0sXG4gICAgcGFydGlhbHM6IHtcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcbiAgICB9LFxuICAgIFxuICAgIG9uY29uZmlnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQoJ215dHJhdmVsbGVyLnBlbmRpbmcnLCB0cnVlKTtcbiAgICAgICAgTWV0YS5pbnN0YW5jZSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obWV0YSkgeyB0aGlzLnNldCgnbWV0YScsIG1ldGEpO30uYmluZCh0aGlzKSk7XG4gICAgICAgTXl0cmF2ZWxsZXIuZmV0Y2goKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHRyYXZlbGVycykgeyB0aGlzLnNldCgnbXl0cmF2ZWxsZXIucGVuZGluZycsIGZhbHNlKTsgdGhpcy5zZXQoJ215dHJhdmVsbGVyJywgdHJhdmVsZXJzKTsgfS5iaW5kKHRoaXMpKTtcbiAgICAgICBcbiAgICAgICAvLyBjb25zb2xlLmxvZyhVc2VyLmRhdGEoKSk7XG4gICAgICAgLy90aGlzLnNldCgndXNlcicsIFVzZXIuZGF0YSgpKTtcbiAgICAgICAvLyB3aW5kb3cudmlldyA9IHRoaXM7XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgXG4gICAgICAgIHJldHVybiB7ICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0bWVudTpmYWxzZSxcbiAgICAgICAgfVxuICAgIH0sXG4gbGVmdE1lbnU6ZnVuY3Rpb24oKSB7IHZhciBmbGFnPXRoaXMuZ2V0KCdsZWZ0bWVudScpOyB0aGlzLnNldCgnbGVmdG1lbnUnLCAhZmxhZyk7fSxcbiAgIFxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoTU9CSUxFKSB7XG4gICAgICAgICAgICB2YXIgb3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoeyBvbkhpZGRlbjogZnVuY3Rpb24oKSB7ICQoJyNtX2J0bicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpOyAgfSwgb25TaG93OiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9fSk7XG4gICAgICAgICAgICAkKCcuZHJvcGRvd24nKS5kcm9wZG93bigpO1xuXG4gICAgICAgICAgICAkKCcjbV9idG4nLCB0aGlzLmVsKS5vbignY2xpY2subGF5b3V0JyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcignc2hvdycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJy5wdXNoZXInKS5vbmUoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkKCcudWkuY2hlY2tib3gnLCB0aGlzLmVsKS5jaGVja2JveCgpO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci9teXRyYXZlbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMzg0XG4vLyBtb2R1bGUgY2h1bmtzID0gOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcbiAgICBRID0gcmVxdWlyZSgncScpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICB2YWxpZGF0ZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlJylcbiAgICBcbiAgICA7XG5cbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSAgO1xuXG52YXIgVHJhdmVsZXIgPSBTdG9yZS5leHRlbmQoe1xuICAgIGNvbXB1dGVkOiB7XG4gICAgICAgIHByaWNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuVHJhdmVsZXIucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBcbiAgICBkYXRhLnRyYXZlbGxlcnM9IF8ubWFwKGRhdGEsIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7IGlkOiBpLmlkLHVzZXJfaW5mb19pZDppLnVzZXJfaW5mb19pZCx0aXRsZTppLnRyYXZlbGVyX3RpdGxlX2lkLGdlbmRlcl9pZDppLmdlbmRlcl9pZCxwYXNzcG9ydF9jb3VudHJ5X2lkOmkucGFzc3BvcnRfY291bnRyeV9pZCxjaXR5X2lkOmkuY2l0eV9pZCwgZW1haWw6IGkuZW1haWwsIG1vYmlsZTogaS5tb2JpbGUscGFzc3BvcnRfbnVtYmVyOmkucGFzc3BvcnRfbnVtYmVyLCBwYXNzcG9ydF9pc3N1ZTppLnBhc3Nwb3J0X2lzc3VlLFxuICAgICAgICAgICAgICAgIHBhc3Nwb3J0X2V4cGlyeTppLnBhc3Nwb3J0X2V4cGlyeSwgcGFzc3BvcnRfcGxhY2U6aS5wYXNzcG9ydF9wbGFjZSwgcGluY29kZTppLnBpbmNvZGUsYWRkcmVzczppLmFkZHJlc3MscGhvbmU6aS5waG9uZSxlbWFpbDI6aS5lbWFpbDIsXG4gICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBpLmZpcnN0X25hbWUsIGxhc3RfbmFtZTppLmxhc3RfbmFtZSxiaXJ0aGRhdGU6aS5iaXJ0aGRhdGUsYmFzZVVybDonJ307IH0pOyBcbiAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEudHJhdmVsbGVycyk7IFxuICAgICAgICAgIHZhciB1cmw9d2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgICAgaWYodXJsLmluZGV4T2YoJ215dHJhdmVsZXJzLycpPi0xKXtcbiAgICAgICAgICAgICAgdmFyIGNpZD11cmwuc3BsaXQoJ215dHJhdmVsZXJzLycpWzFdOyAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGRhdGEuY3VycmVudFRyYXZlbGxlcj1fLmxhc3QoXy5maWx0ZXIoZGF0YS50cmF2ZWxsZXJzLCB7J2lkJzogXy5wYXJzZUludChjaWQpfSkpOyAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmKGRhdGEuY3VycmVudFRyYXZlbGxlciE9bnVsbClcbiAgICAgICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXJJZD1kYXRhLmN1cnJlbnRUcmF2ZWxsZXIuaWQ7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXI9IF8uZmlyc3QoZGF0YS50cmF2ZWxsZXJzKTtcbiAgICAgICAgICAgIGlmKGRhdGEuY3VycmVudFRyYXZlbGxlciE9bnVsbClcbiAgICAgICAgICAgIGRhdGEuY3VycmVudFRyYXZlbGxlcklkPWRhdGEuY3VycmVudFRyYXZlbGxlci5pZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhLmNhYmluVHlwZT0gMTtcbiAgICAgICAgICAgIGRhdGEuYWRkPWZhbHNlO1xuICAgICAgICAgICAgZGF0YS5lZGl0PWZhbHNlO1xuICAgICAgICAgICAgZGF0YS5wYXNzZW5nZXJzPSBbMSwgMCwgMF07XG4gICAgICAgICAgICBkYXRhLnBlbmRpbmc9IGZhbHNlO1xuICAgICAgICAgICAgZGF0YS5lcnJvcnM9IHt9O1xuICAgICAgICAgICAgZGF0YS5yZXN1bHRzPSBbXTtcblxuICAgICAgICAgICAgZGF0YS5maWx0ZXI9IHt9O1xuICAgICAgICAgICAgZGF0YS5maWx0ZXJlZD0ge307XG4gICAgcmV0dXJuIG5ldyBUcmF2ZWxlcih7ZGF0YTogZGF0YX0pO1xuXG59O1xuVHJhdmVsZXIuYWRkPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIkluc2lkZSBUcmF2ZWxlci5hZGRcIik7XG4gICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvLyQucG9zdCgnL2IyYy90cmF2ZWxlci9jcmVhdGUnLCBKU09OLnN0cmluZ2lmeShkYXRhKSwgJ2pzb24nKVxuICAgICAgICQuYWpheCh7XG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIHVybDogJy9iMmMvdHJhdmVsZXIvY3JlYXRlJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgIGRhdGE6IHsnZGF0YSc6IEpTT04uc3RyaW5naWZ5KGRhdGEpfSxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgLy8gY29uc29sZS5sb2coXCJTdWNjZXNzXCIpO1xuICAgIH1cbiAgfSkgICAgIC50aGVuKGZ1bmN0aW9uKHJkYXRhKSB7IGNvbnNvbGUubG9nKHJkYXRhKTtyZXNvbHZlKHtkYXRhOnJkYXRhLnRyYXZlbGVyX2lkfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWRcIik7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB9O1xuVHJhdmVsZXIuZmV0Y2ggPSBmdW5jdGlvbihpZCkge1xuICAgLy8gY29uc29sZS5sb2coXCJUcmF2ZWxlci5mZXRjaFwiKTtcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAkLmdldEpTT04oJy9iMmMvdHJhdmVsZXIvZ2V0TXlUcmF2ZWxlcnNMaXN0JylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgIHJlc29sdmUoVHJhdmVsZXIucGFyc2UoZGF0YSkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkXCIpO1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYXZlbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvc3RvcmVzL215dHJhdmVsbGVyL3RyYXZlbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzODVcbi8vIG1vZHVsZSBjaHVua3MgPSA5IiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwibGF5b3V0XCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYm94IG15LXRyYXZlbGxlcnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImxlZnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcImN1cnJlbnRUcmF2ZWxlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJhdmVsbGVydmlld1wiLFwiYVwiOntcIm15dHJhdmVsbGVyXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXJcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteXRyYXZlbGxlci5hZGRcIixcIm15dHJhdmVsbGVyLmVkaXRcIl0sXCJzXCI6XCIhXzAmJiFfMVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJhdmVsbGVyLWZvcm1cIixcImFcIjp7XCJteXRyYXZlbGxlclwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcInhcIjp7XCJyXCI6W1wibXl0cmF2ZWxsZXIuYWRkXCIsXCJteXRyYXZlbGxlci5lZGl0XCJdLFwic1wiOlwiIV8wJiYhXzFcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyYXZlbGxlcmxpc3RcIixcImFcIjp7XCJteXRyYXZlbGxlclwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XX1dfSxcIiBcIl0sXCJwXCI6e1wicGFuZWxcIjpbe1widFwiOjgsXCJyXCI6XCJiYXNlLXBhbmVsXCJ9XX19XX07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXIuaHRtbFxuLy8gbW9kdWxlIGlkID0gMzg2XG4vLyBtb2R1bGUgY2h1bmtzID0gOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICAgICAgTXl0cmF2ZWxsZXIgPSByZXF1aXJlKCdzdG9yZXMvbXl0cmF2ZWxsZXIvdHJhdmVsZXInKVxuICAgICAgICA7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xuICAgIGlzb2xhdGVkOiB0cnVlLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvZm9ybS5odG1sJyksXG4gICAgY29tcG9uZW50czoge1xuICAgICAgICAndWktc3Bpbm5lcic6IHJlcXVpcmUoJ2NvcmUvZm9ybS9zcGlubmVyJyksXG4gICAgICAgICd1aS1jYWxlbmRhcic6IHJlcXVpcmUoJ2NvcmUvZm9ybS9jYWxlbmRhcicpLFxuICAgICAgICAndWktdGVsJzogcmVxdWlyZSgnY29yZS9mb3JtL3RlbCcpLFxuICAgICAgICAndWktZW1haWwnOiByZXF1aXJlKCdjb3JlL2Zvcm0vZW1haWwnKSxcbiAgICAgICAgJ3VpLWlucHV0JzogcmVxdWlyZSgnY29yZS9mb3JtL2lucHV0JyksXG4gICAgICAgICd1aS1kYXRlJzogcmVxdWlyZSgnY29yZS9mb3JtL2RhdGUnKSxcbiAgICB9LFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgXzpfLFxuICAgICAgICAgICAgc3RhdGU6IHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyAgbWV0YTogcmVxdWlyZSgnYXBwL3N0b3Jlcy9tZXRhJykuaW5zdGFuY2UoKSxcblxuICAgICAgICAgICAgZm9ybWF0VGl0bGVzOiBmdW5jdGlvbiAodGl0bGVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBfLmNsb25lRGVlcCh0aXRsZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKGRhdGEsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHRleHQ6IGkubmFtZX07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0Q291bnRyaWVzOiBmdW5jdGlvbiAoY291bnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBfLmNsb25lRGVlcChjb3VudHJpZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKGRhdGEsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHRleHQ6IGkubmFtZX07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgfSxcbiAgICBvbmluaXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBkYXRlO1xuXG4gICAgICAgIGlmICh0aGlzLmdldCgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcicpICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRhdGUgPSB0aGlzLmdldCgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnKTtcbiAgICAgICAgICAgIGlmIChkYXRlICE9IG51bGwgJiYgZGF0ZSAhPSAnJykge1xuICAgICAgICAgICAgICAgIGlmIChtb21lbnQuaXNNb21lbnQoZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZScsIGRhdGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBtb21lbnQoZGF0ZSwgJ1lZWVktTU0tREQnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMub24oJ2FkZCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICB2YXIgbmV3dHJhdmVsbGVyID0gdGhpcy5nZXQoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXInKTtcbiAgICAgICAgICAgIGlmIChuZXd0cmF2ZWxsZXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdHJhdmVsbGVycyA9IHRoaXMuZ2V0KCdteXRyYXZlbGxlci50cmF2ZWxsZXJzJyk7XG4gICAgICAgICAgICB2YXIgYmlydGhkYXRlID0gbmV3dHJhdmVsbGVyLmJpcnRoZGF0ZTtcbiAgICAgICAgICAgIGlmIChtb21lbnQuaXNNb21lbnQoYmlydGhkYXRlKSkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcbiAgICAgICAgICAgICAgICBiaXJ0aGRhdGUgPSBiaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50dHJhdmVsbGVyID0ge3RpdGxlOiBuZXd0cmF2ZWxsZXIudGl0bGUsIGVtYWlsOiBuZXd0cmF2ZWxsZXIuZW1haWwsIG1vYmlsZTogbmV3dHJhdmVsbGVyLm1vYmlsZSwgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBuZXd0cmF2ZWxsZXIubGFzdF9uYW1lLCBiaXJ0aGRhdGU6IGJpcnRoZGF0ZSwgYmFzZVVybDogJycsIHBhc3Nwb3J0X251bWJlcjogbmV3dHJhdmVsbGVyLnBhc3Nwb3J0X251bWJlciwgcGFzc3BvcnRfcGxhY2U6IG5ld3RyYXZlbGxlci5wYXNzcG9ydF9wbGFjZSwgcGFzc3BvcnRfY291bnRyeV9pZDogbmV3dHJhdmVsbGVyLnBhc3Nwb3J0X2NvdW50cnlfaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy90cmF2ZWxlci9jcmVhdGUnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogSlNPTi5zdHJpbmdpZnkoY3VycmVudHRyYXZlbGxlcil9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChpZGQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpZGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRkLnJlc3VsdD09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIGlkZC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudHRyYXZlbGxlci5pZCA9IGlkZC50cmF2ZWxlcl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcnMucHVzaChjdXJyZW50dHJhdmVsbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgndHJhdmVsbGVycycsIHRyYXZlbGxlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJywgY3VycmVudHRyYXZlbGxlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcsIGN1cnJlbnR0cmF2ZWxsZXIuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdhZGQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vbignZWRpdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG5ld3RyYXZlbGxlciA9IHRoaXMuZ2V0KCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyJyksXG4gICAgICAgICAgICAgICAgdHJhdmVsbGVycyA9IHRoaXMuZ2V0KCdteXRyYXZlbGxlci50cmF2ZWxsZXJzJyksXG4gICAgICAgICAgICAgICAgYmlydGhkYXRlID0gbmV3dHJhdmVsbGVyLmJpcnRoZGF0ZSxcbiAgICAgICAgICAgICAgICBpZCA9IHRoaXMuZ2V0KCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmlkJyk7XG4gICAgICAgICAgICBpZiAobW9tZW50LmlzTW9tZW50KGJpcnRoZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBiaXJ0aGRhdGUgPSBiaXJ0aGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY3VycmVudHRyYXZlbGxlciA9IHtpZDogaWQsIHRpdGxlOiBuZXd0cmF2ZWxsZXIudGl0bGUsIGVtYWlsOiBuZXd0cmF2ZWxsZXIuZW1haWwsIG1vYmlsZTogbmV3dHJhdmVsbGVyLm1vYmlsZSwgZmlyc3RfbmFtZTogbmV3dHJhdmVsbGVyLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBuZXd0cmF2ZWxsZXIubGFzdF9uYW1lLCBiaXJ0aGRhdGU6IGJpcnRoZGF0ZSwgYmFzZVVybDogJycsIHBhc3Nwb3J0X251bWJlcjogbmV3dHJhdmVsbGVyLnBhc3Nwb3J0X251bWJlciwgcGFzc3BvcnRfcGxhY2U6IG5ld3RyYXZlbGxlci5wYXNzcG9ydF9wbGFjZSwgcGFzc3BvcnRfY291bnRyeV9pZDogbmV3dHJhdmVsbGVyLnBhc3Nwb3J0X2NvdW50cnlfaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKGFyciwga2V5LCBuZXd2YWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBfLmZpbmQoYXJyLCBrZXkpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaClcbiAgICAgICAgICAgICAgICAgICAgXy5tZXJnZShtYXRjaCwgbmV3dmFsKTtcblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy90cmF2ZWxlci91cGRhdGUvJyArIF8ucGFyc2VJbnQoaWQpLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogSlNPTi5zdHJpbmdpZnkoY3VycmVudHRyYXZlbGxlcil9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChpZGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkZC5yZXN1bHQgPT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLm1peGluKHsnJHVwZGF0ZSc6IHVwZGF0ZX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy4kdXBkYXRlKHRyYXZlbGxlcnMsIHtpZDogaWR9LCBjdXJyZW50dHJhdmVsbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgndHJhdmVsbGVycycsIHRyYXZlbGxlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJywgY3VycmVudHRyYXZlbGxlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcsIGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnZWRpdCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIGlkZC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHN1Ym1pdDogZnVuY3Rpb24gKCkge1xuXG5cbiAgICB9LFxuICAgIGFkZEpvdXJuZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gIHRoaXMuZ2V0KCdzZWFyY2gnKS5wdXNoKCdmbGlnaHRzJywgeyBmcm9tOiAyMzM2LCB0bzogNjI3LCBkZXBhcnRfYXQ6IG1vbWVudCgpLmVuZE9mKCdtb250aCcpLCByZXR1cm5fYXQ6IG51bGx9KTtcbiAgICB9LFxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXInLCBmdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnRUcmF2ZWxsZXIgY2hhbmdlZCBcIik7XG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2codmFsdWUpO1xuLy8gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcicsIHZhbHVlKTtcbi8vICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXJJZCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjdXJyZW50VHJhdmVsbGVySWQgY2hhbmdlZCBcIik7XG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2codmFsdWUpO1xuLy8gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgdmFsdWUpO1xuLy8gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci9mb3JtLmpzXG4vLyBtb2R1bGUgaWQgPSAzODdcbi8vIG1vZHVsZSBjaHVua3MgPSA5IiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlwidWkgZm9ybSBiYXNpYyBzZWdtZW50IGZsaWdodCBzZWFyY2hcIn0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGV0YWlsc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMlwiLFwiZlwiOltcIlBlcnNvbmFsIERldGFpbHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIlRpdGxlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnRpdGxlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0cmFuc3BhcmVudFwiLFwicGxhY2Vob2xkZXJcIjpcIlRpdGxlXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUaXRsZXNcIixcIm1ldGEudGl0bGVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yLnRpdGxlXCJ9XX0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCIsXCJzdHlsZVwiOlwiZGlzcGxheTpibG9ja1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IudGl0bGVcIn1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3IudGl0bGVcIn1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiRmlyc3QgTmFtZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwiZmlyc3RfbmFtZVwiLFwicGxhY2Vob2xkZXJcIjpcIkZpcnN0IE5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5maXJzdF9uYW1lXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IuZmlyc3RfbmFtZVwifV19LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6YmxvY2tcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yLmZpcnN0X25hbWVcIn1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3IuZmlyc3RfbmFtZVwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJMYXN0IE5hbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImxhc3RfbmFtZVwiLFwicGxhY2Vob2xkZXJcIjpcIkxhc3QgTmFtZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmxhc3RfbmFtZVwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yLmxhc3RfbmFtZVwifV19LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6YmxvY2tcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yLmxhc3RfbmFtZVwifV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvci5sYXN0X25hbWVcIn1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteXRyYXZlbGxlci5hZGRcIixcIm15dHJhdmVsbGVyLmVkaXRcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIkRhdGUgb2YgQmlydGg6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZGF0ZVwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJsYXJnZVwiOlwiMFwiLFwicGxhY2Vob2xkZXJcIjpcIkRhdGUgb2YgQmlydGhcIixcImNoYW5nZXllYXJcIjpcIjFcIixcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IuYmlydGhkYXRlXCJ9XX0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCIsXCJzdHlsZVwiOlwiZGlzcGxheTpibG9ja1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IuYmlydGhkYXRlXCJ9XSxcIm5cIjo1MCxcInJcIjpcImVycm9yLmJpcnRoZGF0ZVwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJQYXNzcG9ydCBDb3VudHJ5OlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5wYXNzcG9ydF9jb3VudHJ5X2lkXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0cmFuc3BhcmVudFwiLFwicGxhY2Vob2xkZXJcIjpcIkNvdW50cnlcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdENvdW50cmllc1wiLFwibWV0YS5jb3VudHJpZXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IucGFzc3BvcnRfY291bnRyeV9pZFwifV19LFwiZlwiOltdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6YmxvY2tcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yLnBhc3Nwb3J0X2NvdW50cnlfaWRcIn1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3IucGFzc3BvcnRfY291bnRyeV9pZFwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJQYXNzcG9ydCBObzpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInBhc3Nwb3J0X251bWJlclwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3Nwb3J0IE5vXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IucGFzc3BvcnRfbnVtYmVyXCJ9XX0sXCJmXCI6W119XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCIsXCJzdHlsZVwiOlwiZGlzcGxheTpibG9ja1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IucGFzc3BvcnRfbnVtYmVyXCJ9XSxcIm5cIjo1MCxcInJcIjpcImVycm9yLnBhc3Nwb3J0X251bWJlclwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJJc3N1ZWQgUGxhY2U6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwYXNzcG9ydF9wbGFjZVwiLFwicGxhY2Vob2xkZXJcIjpcIklzc3VlZCBQbGFjZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLnBhc3Nwb3J0X3BsYWNlXCJ9XSxcImVycm9yXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IucGFzc3BvcnRfcGxhY2VcIn1dfSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIixcInN0eWxlXCI6XCJkaXNwbGF5OmJsb2NrXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvci5wYXNzcG9ydF9wbGFjZVwifV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvci5wYXNzcG9ydF9wbGFjZVwifV19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGV0YWlsc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMlwiLFwiZlwiOltcIkNvbnRhY3QgRGV0YWlsc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJFbWFpbCBBZGRyZXNzOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWVtYWlsXCIsXCJhXCI6e1wibmFtZVwiOlwiZW1haWxcIixcInBsYWNlaG9sZGVyXCI6XCJFLU1haWxcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5lbWFpbFwifV0sXCJlcnJvclwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yLmVtYWlsXCJ9XX19LFwiIFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCIsXCJzdHlsZVwiOlwiZGlzcGxheTpibG9ja1wifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IuZW1haWxcIn1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3IuZW1haWxcIn1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiTW9iaWxlIE51bWJlcjpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS10ZWxcIixcImFcIjp7XCJuYW1lXCI6XCJtb2JpbGVcIixcInBsYWNlaG9sZGVyXCI6XCJNb2JpbGVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5tb2JpbGVcIn1dLFwiZXJyb3JcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvci5tb2JpbGVcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIixcInN0eWxlXCI6XCJkaXNwbGF5OmJsb2NrXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvci5tb2JpbGVcIn1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3IubW9iaWxlXCJ9XX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJvbmUgY29sdW1uIHJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc21hbGwgZmllbGQgbmVnYXRpdmUgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6YmxvY2tcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3IudXNlcl9pbmZvX2lkXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3IudXNlcl9pbmZvX2lkXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwidlwiOntcImNsaWNrXCI6XCJhZGRcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJ1dHRvbiBtYXNzaXZlIGZsdWlkXCJ9LFwiZlwiOltcIkFkZCBUcmF2ZWxsZXJcIl19XSxcIm5cIjo1MCxcInJcIjpcIm15dHJhdmVsbGVyLmFkZFwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcInZcIjp7XCJjbGlja1wiOlwiZWRpdFwifSxcImFcIjp7XCJjbGFzc1wiOlwidWkgYnV0dG9uIG1hc3NpdmUgZmx1aWRcIn0sXCJmXCI6W1wiRWRpdCBUcmF2ZWxsZXJcIl19LFwiIFwiXSxcIm5cIjo1MCxcInJcIjpcIm15dHJhdmVsbGVyLmVkaXRcIn1dfV19XX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215dHJhdmVsbGVyL2Zvcm0uaHRtbFxuLy8gbW9kdWxlIGlkID0gMzg4XG4vLyBtb2R1bGUgY2h1bmtzID0gOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXG4gICAgICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuICAgICAgICAvLyxcbiAgICAgICAgLy9NeXRyYXZlbGxlciA9IHJlcXVpcmUoJ2FwcC9zdG9yZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXInKSAgIDtcbiAgICAgICAgO1xuXG5cbnZhciB0Mm0gPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHZhciBpID0gdGltZS5zcGxpdCgnOicpO1xuXG4gICAgcmV0dXJuIGlbMF0gKiA2MCArIGlbMV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215dHJhdmVsbGVyL3ZpZXcuaHRtbCcpLFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy9teXRyYXZlbGxlcjp0aGlzLmdldCgnbXl0cmF2ZWxsZXInKSxcbiAgICAgICAgICAgIC8vbXl0cmF2ZWxsZXI6bmV3IE15dHJhdmVsbGVyKCksXG4gICAgICAgICAgICBmb3JtYXRCaXJ0aERhdGU6IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXIuYmlydGhkYXRlJywgZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdFRpdGxlOiBmdW5jdGlvbiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGl0bGVzKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRDb3VudHJ5OiBmdW5jdGlvbiAoY291bnRyeSkge1xuICAgICAgICAgICAgICAgIHZhciBjb3VudHJpZXMgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnY291bnRyaWVzJyk7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aXRsZXMpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRpdGxlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gIF8ucmVzdWx0KF8uZmluZChjb3VudHJpZXMsIHsnaWQnOiBjb3VudHJ5fSksICduYW1lJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG5cbiAgICB9LFxuICAgIHNvcnRPbjogZnVuY3Rpb24gKG9uKSB7XG4gICAgICAgIGlmIChvbiA9PSB0aGlzLmdldCgnc29ydE9uLjAnKSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoJ3NvcnRPbi4xJywgLTEgKiB0aGlzLmdldCgnc29ydE9uLjEnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldCgnc29ydE9uJywgW29uLCAxXSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub24oJ2FkZCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2FkZCcsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJywgbnVsbCk7XG4gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcicsIF8ubGFzdChfLmZpbHRlcih0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS50cmF2ZWxsZXJzLCB7J2lkJzogaWR9KSkpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKCdlZGl0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNldCgnbXl0cmF2ZWxsZXIuZWRpdCcsdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgnbXl0cmF2ZWxsZXInKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSW5zaWRlIGVkaXRcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmdldCgnbXl0cmF2ZWxsZXInKSk7XG4gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgaWQpO1xuICAgICAgICAgICAgLy90aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLCBfLmxhc3QoXy5maWx0ZXIodGhpcy5nZXQoJ215dHJhdmVsbGVyJykudHJhdmVsbGVycywgeydpZCc6IGlkfSkpKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbignZGVsZXRlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5nZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL3RyYXZlbGVyL2RlbGV0ZS8nKyBfLnBhcnNlSW50KGlkKSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlkZC5yZXN1bHQ9PSdzdWNjZXNzJyl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IF8uZmluZEluZGV4KHRoaXMuZ2V0KCdteXRyYXZlbGxlci50cmF2ZWxsZXJzJyksIHsnaWQnOiBpZH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGljZSgnbXl0cmF2ZWxsZXIudHJhdmVsbGVycycsIGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJywgXy5maXJzdCh0aGlzLmdldCgnbXl0cmF2ZWxsZXIudHJhdmVsbGVycycpKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgdGhpcy5nZXQoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuaWQnKSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGlkZC5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZygnaW5kZXggJytfLmZpbmRJbmRleCh0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS50cmF2ZWxsZXJzLCBmdW5jdGlvbihjaHIpIHsgIHJldHVybiBjaHIuaWQgPT0gaWQ7fSkpO1xuICAgICAgICAgICAgLy8gIHRoaXMuc3BsaWNlKHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnRyYXZlbGxlcnMsIF8uZmluZEluZGV4KHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnRyYXZlbGxlcnMsIGZ1bmN0aW9uKGNocikgeyAgcmV0dXJuIGNoci5pZCA9PSBpZDt9KSwgMSk7XG5cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgdGhpcy5vYnNlcnZlKCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyJywgZnVuY3Rpb24odmFsdWUpIHtcbi8vICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnNpZGUgdmlldyBjdXJyZW50VHJhdmVsbGVyIGNoYW5nZWRcIik7XG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbi8vICAgICAgICAgICAgXG4vLyAgICAgICAgfSwge2luaXQ6IHRydWV9KTtcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXJJZCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjdXJyZW50VHJhdmVsbGVySWQgY2hhbmdlZCBcIik7XG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2codmFsdWUpO1xuLy8gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgdmFsdWUpO1xuLy8gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9teXRyYXZlbGxlci92aWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAzODlcbi8vIG1vZHVsZSBjaHVua3MgPSA5IiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImZcIjpbXCJQZW9wbGUgeW91IGJvb2sgdHJhdmVsIGZvclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOlwiYWRkXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJtaWRkbGUgYmx1ZSBhZGQtbmV3XCJ9LFwiZlwiOltcIkFkZCBOZXcgVHJhdmVsbGVyXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W3tcInRcIjo0LFwiZlwiOltcInVpIHNlZ21lbnQgbG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcIm15dHJhdmVsbGVyLnBlbmRpbmdcIn1dLFwic3R5bGVcIjpcIm1pbi1oZWlnaHQ6NTBweFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1c2VyLWluZm9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5iYXNlVXJsXCJ9LFwiL3RoZW1lcy9CMkMvaW1nL2d1ZXN0LnBuZ1wiXSxcImFsdFwiOlwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJuYW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VGl0bGVcIixcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIudGl0bGVcIl0sXCJzXCI6XCJfMChfMSlcIn19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5maXJzdF9uYW1lXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5sYXN0X25hbWVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwaG9uZVwifSxcImZcIjpbXCJNb2JpbGUgTm86IFwiLHtcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5tb2JpbGVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjpcImVkaXRcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsIGdyYXlcIn0sXCJmXCI6W1wiRWRpdFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOlwiZGVsZXRlXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbCBncmF5XCIsXCJzdHlsZVwiOlwiYmFja2dyb3VuZC1jb2xvcjpyZWQ7Y29sb3I6d2hpdGVcIn0sXCJmXCI6W1wiRGVsZXRlXCJdfSxcIiBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGV0YWlsc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMlwiLFwiZlwiOltcIkNvbnRhY3QgRGV0YWlsc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJFbWFpbCBBZGRyZXNzOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuZW1haWxcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIk1vYmlsZSBOdW1iZXI6XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5tb2JpbGVcIn1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXRhaWxzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgyXCIsXCJmXCI6W1wiUGVyc29uYWwgRGV0YWlsc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJEYXRlIG9mIEJpcnRoOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0QmlydGhEYXRlXCIsXCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZVwiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIlBhc3Nwb3J0IE5vOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfbnVtYmVyXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJQYXNzcG9ydCBDb3VudHJ5OlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Q291bnRyeVwiLFwibXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlci5wYXNzcG9ydF9jb3VudHJ5X2lkXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiSXNzdWVkIFBsYWNlOlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIucGFzc3BvcnRfcGxhY2VcIn1dfV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVyXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXRhaWxzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgyXCIsXCJmXCI6W1wiTm8gVHJhdmVsbGVyIEFkZGVkXCJdfV19XSxcInJcIjpcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXJcIn1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteXRyYXZlbGxlci5wZW5kaW5nXCJdLFwic1wiOlwiIV8wXCJ9fV19XX07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvdmlldy5odG1sXG4vLyBtb2R1bGUgaWQgPSAzOTBcbi8vIG1vZHVsZSBjaHVua3MgPSA5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKSxcbiAgIE15dHJhdmVsbGVyID0gcmVxdWlyZSgnc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJykgICBcbiAgICA7XG5cblxudmFyIHQybSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcblxuICAgIHJldHVybiBpWzBdKjYwK2lbMV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215dHJhdmVsbGVyL2xpc3QuaHRtbCcpLFxuXG5cbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgICAgICAgIFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uaW5pdDogZnVuY3Rpb24gKCBvcHRpb25zICkge1xuXG4gICAgfSxcbiAgICBtb2JpbGVzZWxlY3Q6ZnVuY3Rpb24oaWQpe1xuICAgICAgICB2YXIgdmlldz10aGlzO1xuXHRcdC8vY29uc29sZS5sb2coJ2luc2lkZSBtb2JpbGVzZWxlY3QnKTtcbiAgICAgICAgJCgnLnVpLmRpbW1lcicpLmFkZENsYXNzKCdoaWRlaW1wJyk7XG5cdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdkaW1tYWJsZScpO1xuXHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZGltbWVkJyk7XG5cdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdzY3JvbGxpbmcnKTtcblx0XHQkKCdib2R5JykucmVtb3ZlQXR0cihcInN0eWxlXCIpO1xuXHRcdFxuXHRcdCQoJy5saXN0dHJhdmVsbGVyJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdCQoJy51aS5kaW1tZXInKS5yZW1vdmVDbGFzcygnaGlkZWltcCcpO1xuXHRcdFx0XG5cdFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ2RpbW1hYmxlJyk7XG5cdFx0JCgnYm9keScpLmFkZENsYXNzKCdkaW1tZWQnKTtcblx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ3Njcm9sbGluZycpO1xuXHRcdC8vJCgnYm9keScpLnJlbW92ZUF0dHIoJ2hlaWdodCcpO1xuXHRcdFx0fSk7XG5cdFx0XG5cdFx0XG5cdFx0ICAgIGlmKHZpZXcuZ2V0KCdteXRyYXZlbGxlci5lZGl0JykpeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nL2IyYy90cmF2ZWxlci9teXRyYXZlbGVycy8nK2lkOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdlZGl0JyxmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2FkZCcsZmFsc2UpO1xuICAgICAgICAgICAgdmlldy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxudWxsKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHZpZXcuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgaWQpO1xuICAgICAgICAgICAgdmFyIGN0PV8ubGFzdChfLmZpbHRlcih2aWV3LmdldCgnbXl0cmF2ZWxsZXIudHJhdmVsbGVycycpLCB7J2lkJzogaWR9KSk7XG4gICAgICAgICAgICB2aWV3LmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLCBjdCk7XG4gICAgICAgIFxuXHRcdFxuXHRcdFxuXHRcdH1cblx0XHR9LFxuXHRcdFxuXHRcdCB0ZXN0OmZ1bmN0aW9uKGlkKXtcbiAgICAgICAgdmFyIHZpZXc9dGhpcztcbiAgICAgICAgICAgIGlmKHZpZXcuZ2V0KCdteXRyYXZlbGxlci5lZGl0JykpeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nL2IyYy90cmF2ZWxlci9teXRyYXZlbGVycy8nK2lkOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdlZGl0JyxmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2FkZCcsZmFsc2UpO1xuICAgICAgICAgICAgdmlldy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyJyxudWxsKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHZpZXcuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgaWQpO1xuICAgICAgICAgICAgdmFyIGN0PV8ubGFzdChfLmZpbHRlcih2aWV3LmdldCgnbXl0cmF2ZWxsZXIudHJhdmVsbGVycycpLCB7J2lkJzogaWR9KSk7XG4gICAgICAgICAgICB2aWV3LmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXInLCBjdCk7XG4gICAgICAgIH1cdFxuXG4gICAgfSxcblx0XG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvbXBvbmVudHMvbXl0cmF2ZWxsZXIvbGlzdC5qc1xuLy8gbW9kdWxlIGlkID0gMzkxXG4vLyBtb2R1bGUgY2h1bmtzID0gOSIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJyaWdodFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMlwiLFwiZlwiOltcIk15IFRyYXZlbGxlcnNcIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOltcIk5vIFRyYXZlbGxlciBGb3VuZC5cIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXl0cmF2ZWxsZXIudHJhdmVsbGVycy5sZW5ndGhcIl0sXCJzXCI6XCJfMD09MFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJ0ZXN0XCIsXCJhXCI6e1wiclwiOltcImlkXCJdLFwic1wiOlwiW18wXVwifX19LFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBcIix7XCJ0XCI6NCxcImZcIjpbXCJhY3RpdmVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXIuaWRcIixcImlkXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV0sXCJpZFwiOlt7XCJ0XCI6MixcInJcIjpcImlkXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6W3tcInRcIjoyLFwiclwiOlwiYmFzZVVybFwifSxcIi90aGVtZXMvQjJDL2ltZy9ndWVzdC5wbmdcIl0sXCJhbHRcIjpcIlwifX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJmaXJzdF9uYW1lXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibGFzdF9uYW1lXCJ9XX1dLFwiblwiOjUyLFwiclwiOlwibXl0cmF2ZWxsZXIudHJhdmVsbGVyc1wifV19XX07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXl0cmF2ZWxsZXIvbGlzdC5odG1sXG4vLyBtb2R1bGUgaWQgPSAzOTJcbi8vIG1vZHVsZSBjaHVua3MgPSA5Il0sInNvdXJjZVJvb3QiOiIifQ==