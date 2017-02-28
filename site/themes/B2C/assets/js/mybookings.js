webpackJsonp([7],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(363);


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

/***/ 121:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

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

/***/ 363:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  Mybookings = __webpack_require__(364);
	     
	__webpack_require__(121);
	//$(function() {
	//    console.log('Inside Main mybookings');
	//    var mybookings = new Mybookings();
	//    var user = new User();    
	//
	//    mybookings.render('#content');
	//    user.render('#panel');
	//});
	
	
	$(function() {
	    (new Mybookings()).render('#app');
	});

/***/ },

/***/ 364:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        Auth = __webpack_require__(80),
	        MybookingData = __webpack_require__(64),
	        Meta = __webpack_require__(59)
	//    ,
	//    User = require('stores/user/user')
	        ;
	
	//require('modules/mybookings/mybookings.less');
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(365),
	    components: {
	        'layout': __webpack_require__(72),
	        summary: __webpack_require__(366),
	        details: __webpack_require__(357),
	        amendment: __webpack_require__(368),
	      //  leftpanel: require('components/layouts/profile_sidebar')
	                // travellerlist: require('./list'),
	                //  profilesidebar: require('../layouts/profile_sidebar')
	    },
	    partials: {
	        'base-panel': __webpack_require__(105)
	    },
	    onconfig: function () {
	       // console.log("Inside onconfig");
	        var idd = window.location.href.split('mybookings/')[1];
	         this.set('mybookings.print', false);
	        var id=null;
	        var urlid=null;
	        if(idd){
	            urlid=idd.split('#');
	            id=urlid[0];
	        }
	        if (id) {
	            var mm=Meta.instance()
	                    .then(function (meta) {
	                        this.set('meta', meta);
	                    }.bind(this));
	            this.set('mybookings.summary', false);
	            this.set('mybookings.pending', true);
	            this.set('mybookings.currentCartId', id);
	            if(urlid[1]=='print'){
	                            this.set('mybookings.print', true); 
	                            $('header').hide();
	                            $('body').css('padding-top','0px');
	                            $('.content').css('padding','0px');
	                        }
	            MybookingData.getCurrentCart(id)
	                    .then(function (data) {
	                        this.set('mybookings', data);
	                        this.get('mybookings').set('pending', false);
	                        if(urlid[1]=='print'){
	                            this.set('mybookings.print', true); 
	                            $('header').hide();
	                            $('body').css('padding-top','0px');
	                            $('.content').css('padding','0px');
	                            window.print();
	                        }
	                    }.bind(this)); 
	                 //   console.log(urlid[1]);
	                    
	        } else {
	            this.set('mybookings.amend', false);
	            this.set('mybookings.summary', true);
	            this.set('mybookings.pending', true);
	            Meta.instance()
	                    .then(function (meta) {
	                        this.set('meta', meta);
	                    }.bind(this));
	            MybookingData.fetch()
	                    .then(function (data) {
	                        this.set('mybookings', data);
	                        this.get('mybookings').set('pending', false);
	                         
	                    }.bind(this));
	        }
	
	        // this.set('user', User);
	        window.view = this;
	    },
	    data: function () {
	        return {
	            leftmenu: false,
	        }
	    },
	    leftMenu: function () {
	        var flag = this.get('leftmenu');
	        this.set('leftmenu', !flag);
	    },
	
	    signin: function () {
	        var view = this;
	        Auth.login()
	                .then(function (data) {
	            //        console.log(data);
	            if (data && data.id) {
	                window.location.href = '/b2c/airCart/mybookings/' + view.get('mybookings.currentCartDetails.id');
	            }
	                 });
	    },  
	    signup: function() {
	        Auth.signup();
	    },
	    oncomplete: function () {
	       
	//        this.observe('mybookings', function(value) {
	//            console.log("mybookings changed ");
	//            
	//            //this.get('mytraveller').set('currentTraveller', value);
	//        }, {init: false});
	
	    }
	});
	
	


/***/ },

/***/ 365:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}],"mybookings":[{"t":2,"r":"mybookings"}]},"f":[" ",{"t":4,"f":[{"t":7,"e":"amendment","a":{"class":"segment centered ","mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"r":"mybookings.amend"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"summary","a":{"class":"segment centered","mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"r":"mybookings.summary"},{"t":4,"n":51,"f":[{"t":7,"e":"details","a":{"class":"segment centered","mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"r":"mybookings.summary"}],"r":"mybookings.amend"}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 366:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        moment = __webpack_require__(44),
	        _ = __webpack_require__(30),
	        accounting = __webpack_require__(70);
	//,
	//Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(367),
	    data: function () {
	        
	        return {
	            uemail:null,
	            cid:null,
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
	            formatBookingDate: function (date) {
	                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ll');//format('MMM DD YYYY');        
	            },
	            formatBookingStatusClass: function (bs) {
	                if (bs == 1 || bs == 2 || bs == 3 || bs == 7)
	                    return "progress";
	                else if (bs == 4 || bs == 5 || bs == 6 || bs == 12)
	                    return "cancelled";
	                else if (bs == 8 || bs == 9 || bs == 10 || bs == 11)
	                    return "booked";
	
	            },
	            formatBookingStatusMessage: function (bs) {
	                var titles = this.get('meta').get('bookingStatus');
	                return  _.result(_.find(titles, {'id': bs}), 'name');
	            },
	            money: function (amount) {
	                return accounting.formatMoney(amount, '', 0);
	            }
	        }
	
	    },
	    oninit: function (options) {
	
	//        $(this.find('.action a')).on('click', function (e) {
	//            //console.log('inside cllick');
	//            e.stopPropagation();
	//            return false;
	//        });
	        this.on('closemessage', function (event) {
	          $('.ui.positive.message').fadeOut();
	        });
	        this.on('toggleemail', function (e, id,email) {
	                    
	            this.set('uemail', email);
	            this.set('cid', id);            
	            $(this.find('.ui.modal')).modal('show');
	            // e.stopPropagation();
	            return false;
	        });
	        this.on('getdetail', function (event, id) {
	
	            this.get('mybookings').set('currentCartId', id);
	            this.get('mybookings').set('pending', true);
	            this.get('mybookings').set('summary', false);
	            $.ajax({
	                context: this,
	                type: 'POST',
	                url: '/b2c/airCart/getCartDetails/' + _.parseInt(id),
	                dataType: 'json',
	                data: {'data': ''},
	                success: function (data) {
	
	                    var details = {
	                        id: data.id, email:data.email,upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency,
	                        fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,convfee:data.convfee,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,ticketstatusmsg:data.ticketstatusmsg, promodiscount:data.promo_discount,
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
	
	                 //   console.log(details);
	                    //console.log(data);
	                    this.get('mybookings').set('currentCartDetails', details);
	                    this.get('mybookings').set('summary', false);
	                    this.get('mybookings').set('pending', false);
	                },
	                error: function (error) {
	                    alert(error);
	                }
	            });
	        });
	
	
	
	
	    },
	    submit: function () {
	        var view = this;
	        this.set('submitting', true);
	        $('.message').fadeIn();
	        $.ajax({
	            type: 'POST',
	            url: '/b2c/airCart/sendEmail/' + this.get('cid'),
	            data: {email: this.get('uemail'), },
	            dataType: 'json',
	            complete: function () {
	                view.set('submitting', false);
	            },
	            success: function (data) {
	                $(view.find('.ui.modal')).modal('hide');
	
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
	
	        });
	    },
	    oncomplete: function () {
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
	        
	//        this.observe('uemail', function(value) {
	//            console.log(value);
	//             this.set('uemail', value);
	//        }, {init: false});
	//        this.observe('mytraveller.currentTravellerId', function(value) {
	//            //console.log("currentTravellerId changed ");
	//            //console.log(value);
	//            //this.get('mytraveller').set('currentTravellerId', value);
	//        }, {init: false});
	    }
	});

/***/ },

/***/ 367:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["box reschedule ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":7,"e":"div","a":{"class":"ui positive  message","style":"display: none"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":"closemessage"}}," Email Sent"]}," ",{"t":7,"e":"div","a":{"class":"ui modal small"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Email Ticket"]}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"form","a":{"class":["ui form ",{"t":4,"f":["loading"],"n":50,"r":"./submitting"}],"action":"javascript:;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"input","a":{"class":"ui input small","type":"text","value":[{"t":2,"r":"./uemail"}]}}," ",{"t":7,"e":"input","a":{"class":"ui input small","type":"hidden","id":"cid","value":[{"t":2,"r":"./cid"}]}}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":7,"e":"button","a":{"type":"submit","class":"ui small button"},"f":["Send"]}]}]}]}]}," ",{"t":7,"e":"h1","f":["My Bookings"]}," ",{"t":7,"e":"h2","f":["Upcoming Trips"]}," ",{"t":7,"e":"div","a":{"class":"group "},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.carts.length"],"s":"_0==0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.flgUpcoming"],"s":"!_0"}}],"x":{"r":["mybookings.carts.length"],"s":"_0==0"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["item stackable ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"to"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"back"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"name"},"  |  "],"i":"i","r":"traveler.0.src"}," ",{"t":2,"rx":{"r":"traveler.0.dest","m":[{"r":["traveler.0.dest.length"],"s":"_0-1"},"name"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"id"},"#print"],"target":"_blank","class":"print","title":"Print"}}," ",{"t":7,"e":"a","a":{"class":"email","title":"Email"},"v":{"click":{"n":"toggleemail","d":[{"t":2,"r":"id"},",",{"t":2,"r":"email"}]}}}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/asPDF/",{"t":2,"r":"id"}],"target":"_blank","class":"pdf","title":"Download PDF"}}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"a","a":{"class":"ui blue fluid button","style":"padding:5px;margin-top:8px;cursor:default;"},"v":{"click":{"n":"getdetail","d":[{"t":2,"r":"id"}]}},"f":["View Details"]}]}]}," ",{"t":7,"e":"div","a":{"class":"hr"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"traveller"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  "],"n":50,"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  | "],"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}}],"i":"i","r":"traveler"}]}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"r":"curency"}," ",{"t":2,"x":{"r":["money","totalAmount"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["formatBookingStatusMessage","booking_status"],"s":"_0(_1)"}}]}]}]}]}],"n":50,"x":{"r":["upcoming"],"s":"_0==\"true\""}}],"n":52,"i":"i","r":"mybookings.carts"}]}," ",{"t":7,"e":"h2","f":["Previous Trips"]}," ",{"t":7,"e":"div","a":{"class":"group"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.carts.length"],"s":"_0==0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.flgPrevious"],"s":"!_0"}}],"x":{"r":["mybookings.carts.length"],"s":"_0==0"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item  previous  stackable"},"f":[{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"to"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"back"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"name"},"  |  "],"i":"i","r":"traveler.0.src"}," ",{"t":2,"rx":{"r":"traveler.0.dest","m":[{"r":["traveler.0.dest.length"],"s":"_0-1"},"name"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"a","a":{"href":["/b2c/airCart/mybookings/",{"t":2,"r":"id"},"#print"],"target":"_blank","class":"print","title":"Print"}}," ",{"t":7,"e":"a","a":{"class":"email","title":"Email"},"v":{"click":{"n":"toggleemail","d":[{"t":2,"r":"id"},",",{"t":2,"r":"email"}]}}}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/asPDF/",{"t":2,"r":"id"}],"target":"_blank","class":"pdf","title":"Download PDF"}}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"a","a":{"class":"ui blue fluid button","style":"padding:5px;margin-top:8px;cursor:default;"},"v":{"click":{"n":"getdetail","d":[{"t":2,"r":"id"}]}},"f":["View Details"]}]}]}," ",{"t":7,"e":"div","a":{"class":"hr"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"traveller"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  "],"n":50,"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  | "],"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}}],"i":"i","r":"traveler"}]}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":3,"r":"curency"}," ",{"t":2,"x":{"r":["money","totalAmount"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["formatBookingStatusMessage","booking_status"],"s":"_0(_1)"}}]}]}]}]}],"n":50,"x":{"r":["upcoming"],"s":"_0==\"false\""}}],"n":52,"i":"i","r":"mybookings.carts"}]}]}]};

/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        moment = __webpack_require__(44),
	        _ = __webpack_require__(30),
	        Q = __webpack_require__(26),
	        accounting = __webpack_require__(70)
	        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(369),
	    data: function () {
	
	        return {
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
	                if (status == 1 || status == 2)
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
	                if (bs == 1 || bs == 2 || bs == 3 || bs == 7)
	                    return "progress";
	                else if (bs == 4 || bs == 5 || bs == 6 || bs == 12)
	                    return "cancelled";
	                else if (bs == 8 || bs == 9 || bs == 10 || bs == 11)
	                    return "booked";
	
	            },
	            formatBookingStatusMessage: function (bs) {
	                var titles = this.get('meta').get('bookingStatus');
	                return  _.result(_.find(titles, {'id': bs}), 'name');
	            },
	            convert: function (amount) {
	                return accounting.formatMoney(amount, '');
	            }
	        }
	
	    },
	    oninit: function (options) {
	
	        this.on('back', function (event) {
	            this.get('mybookings').set('summary', true);
	        });
	        this.on('printdiv', function (event) {
	            window.print();
	        });
	        this.on('asPDF', function (event, id) {
	            //window.location('/b2c/airCart/asPDF/'+id);
	            location.href = "/b2c/airCart/asPDF/" + id;
	        });
	
	    },
	    select: function (j, k) {
	
	        var value = this.get('mybookings').get('currentCartDetails.bookings[' + j + '].traveller[' + k + '].selected');
	        this.get('mybookings').set('currentCartDetails.bookings[' + j + '].traveller[' + k + '].selected', !value);
	
	    },
	    amendTicket: function (type) {
	        var cart = this.get('mybookings').get('currentCartDetails');
	        var arrayOfIds = [];
	        _.forEach(cart.bookings, function (b, bkey) {
	            // console.log(b, bkey);
	            var routeId = b.routes[0].id;
	            _.forEach(b.traveller, function (t, tkey) {
	                // console.log(n, key);
	                if (t.selected) {
	                    _.forEach(t.routes, function (r, rkey) {
	                        arrayOfIds.push({ar: r.id, ab: t.bookingid});
	                        //console.log(t.bookingid+'   '+r.id);
	                    });
	
	                }
	            });
	        });
	        if (arrayOfIds.length == 0) {
	            alert('No passenger is selected for cancellation!');
	            return false;
	        }
	       // console.log(arrayOfIds);
	        var amendmentTypes = this.get('meta').get('amendmentTypes');
	        var view = this.get('mybookings');
	        //     console.log(amendmentTypes);
	        //console.log(view);
	        var amendmentType = null;
	        if (type == 1) {
	            amendmentType = amendmentTypes.CANCEL;
	        } else if (type == 2) {
	            amendmentType = amendmentTypes.RESCHEDULE;
	        }
	        //console.log(amendmentType);
	        
	        
	        
	        if (amendmentType != null)
	            if ($('#amendReason').val().length < 5) { // The reason is too short
	                alert('The amendment reason is too short.\nPlease enter valid and detailed amendment reason!');
	            } else {
	            if(type == 1)
	                var x=window.confirm("Are you sure? \nThis will Cancel your Ticket!");
	            else if(type == 2)
	                var x=window.confirm("Are you sure? \nThis will Reschedule your Ticket!");
	            
	            if (x){
	                view.set('pending', true);
	                Q.Promise(function (resolve, reject, progress) {
	                    $.post('/airCart/amend/' + amendmentType, {
	                        items: arrayOfIds,
	                        reason: $('#amendReason').val()
	                    }, function (data) {
	                        if (data.result === 'success') {
	//                                    location.href = location.href.split('#')[0] + '#cartAmendments';
	                            //document.body.style.cursor = 'wait';
	                           // console.log(data);
	                            //location.reload();
	                            // location.hash = '#cartAmendments';
	                            resolve();
	                        } else {
	                        //    console.log('rejected');
	                            reject();
	                            alert('Not able to cancel. Please contact CheapTicket.in support');
	                        }
	                    }, 'json');
	                }).then(function () {                    
	                     return  view.refreshCurrentCart(view);                    
	                }, function (error) {
	                    console.log(error);
	                    view.set('pending', false);
	                    reject();
	                }).then(function () {
	                    $('.ui.modal').modal('hide');
	                    view.set('amend', false);
	                   // console.log('finished');
	                    resolve();
	                });
	            }
	        }
	
	    },
	    oncomplete: function () {
	        $('.ui.checkbox').checkbox();
	        
	        var view = this;
	        $(this.find('.ui.modal')).modal('setting', 'closable', false).modal('show');
	        $(this.find('.ui.modal')).modal('setting', 'onHidden', function () {
	            view.get('mybookings').set('amend', false);
	        });
	
	
	    },
	});


/***/ },

/***/ 369:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui login modal "},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":4,"f":["Ticket Cancellation"],"n":50,"r":"mybookings.cancel"}," ",{"t":4,"f":["Ticket Reschedule"],"n":50,"r":"mybookings.reschedule"}]}," ",{"t":7,"e":"div","a":{"id":"confirm"}}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["my-bookings-details ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":7,"e":"div","a":{"class":["group ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":7,"e":"div","a":{"class":"table title"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"to"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"back"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"source"},"  |  "],"i":"i","r":"bookings"}," ",{"t":2,"rx":{"r":"bookings","m":[{"r":["bookings.length"],"s":"_0-1"},"destination"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["formatBookingStatusMessage","booking_status"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"br"}," "]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column ","style":"height: auto !important;"},"f":[{"t":7,"e":"div","a":{"class":"ui segment flight-itinerary compact dark"},"f":[{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":7,"e":"span","a":{"class":"city"},"f":[{"t":2,"r":"source"}," → ",{"t":2,"r":"destination"}]}," ",{"t":2,"x":{"r":["formatTravelDate2","departure"],"s":"_0(_1)"}}," ",{"t":7,"e":"span","a":{"class":"time"},"f":[{"t":2,"r":"flighttime"}]}]}," ",{"t":7,"e":"table","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"tr","a":{"class":"divider"},"f":[{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","a":{"class":"layover"},"f":["Layover: ",{"t":2,"x":{"r":["diff","k","j","bookings"],"s":"_0(_3[_2].routes[_1].departure,_3[_2].routes[_1-1].arrival)"}}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"span","f":[" "]}]}]}],"n":50,"x":{"r":["k"],"s":"_0>0"}}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","a":{"class":"carrier-logo"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":["/img/air_logos/",{"t":2,"r":"carrier"},".png"],"alt":[{"t":2,"r":"carrierName"}],"title":[{"t":2,"r":"carrierName"}]}}]}," ",{"t":7,"e":"td","a":{"class":"carrier-name"},"f":[{"t":2,"r":"carrierName"},{"t":7,"e":"br"},{"t":2,"r":"carrier"},"-",{"t":2,"r":"flightNumber"}]}," ",{"t":7,"e":"td","a":{"class":"from","style":"text-align: right;"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"origin"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"style":"text-align: right;","class":"airport"},"f":[{"t":2,"r":"originDetails"}]}]}," ",{"t":7,"e":"td","a":{"class":"flight"},"f":[" "]}," ",{"t":7,"e":"td","a":{"class":"to"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"destination"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"destinationDetails"}]}]}," ",{"t":7,"e":"td","a":{"class":"time-n-cabin"},"f":[{"t":7,"e":"div","f":[{"t":2,"r":"flighttime"},{"t":7,"e":"br"}," ",{"t":2,"rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller",{"r":[],"s":"0"},"cabin"]}}]}]}]}],"i":"k","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"routes"]}}]}]}]}," ",{"t":7,"e":"table","a":{"class":"passenger"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Passenger"]}," ",{"t":7,"e":"th","f":["CRS PNR"]}," ",{"t":7,"e":"th","f":["Air PNR"]}," ",{"t":7,"e":"th","f":["Ticket No."]}," ",{"t":7,"e":"th"}]}," ",{"t":4,"f":[{"t":7,"e":"tr","m":[{"t":4,"f":["class=\"negative\""],"n":50,"r":"selected"}],"f":[{"t":7,"e":"td","f":[{"t":2,"r":"title"}," ",{"t":2,"r":"first_name"}," ",{"t":2,"r":"last_name"}," (",{"t":2,"r":"type"},") ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["travellerBookingStatus","status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["travellerBookingStatusMessage","status"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"crs_pnr"}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"airline_pnr"}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"ticket"}]}," ",{"t":7,"e":"td","f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"ui checkbox "},"v":{"click":{"m":"select","a":{"r":["j","t"],"s":"[_0,_1]"}}},"f":[{"t":7,"e":"input","a":{"type":"checkbox","name":"selectedpassenger"}}," ",{"t":7,"e":"label","f":[{"t":4,"f":["Cancel"],"n":50,"r":"mybookings.cancel"}," ",{"t":4,"f":["Reschedule"],"n":50,"r":"mybookings.reschedule"}]}]}]}],"n":50,"x":{"r":["status","j","bookings"],"s":"(_0==2||_0==1)&&_2[_1].upcoming==\"true\""}}]}]}],"i":"t","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller"]}}]}]}],"i":"j","r":"bookings"}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"label","f":["Reason For ",{"t":4,"f":["Ticket Cancellation"],"n":50,"r":"mybookings.cancel"}," ",{"t":4,"f":["Ticket Reschedule"],"n":50,"r":"mybookings.reschedule"}]}," ",{"t":7,"e":"textarea","a":{"id":"amendReason","name":"amendReason"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"cancel"},"f":[{"t":4,"f":[{"t":7,"e":"button","v":{"click":{"m":"amendTicket","a":{"r":[],"s":"[2]"}}},"a":{"class":"large ui button red"},"f":["Reschedule"]}],"n":50,"r":"mybookings.reschedule"}," ",{"t":4,"f":[{"t":7,"e":"button","v":{"click":{"m":"amendTicket","a":{"r":[],"s":"[1]"}}},"a":{"class":"large ui button red"},"f":["Cancel"]}],"n":50,"r":"mybookings.cancel"}]}]}]}],"r":"mybookings.currentCartDetails"}]}]}]};

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanM/ZjZiNSoqKioiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanM/MGJiYSoqKioiLCJ3ZWJwYWNrOi8vLy4vanMvc3RvcmVzL215Ym9va2luZ3MvbXlib29raW5ncy5qcz9jZjQwKioiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL2FjY291bnRpbmcuanMvYWNjb3VudGluZy5qcz8yNzlhKioiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9hcHAvYXV0aC5qcz9iNjkyKioqKioiLCJ3ZWJwYWNrOi8vLy4vbGVzcy93ZWIvbW9kdWxlcy9teWJvb2tpbmdzL215Ym9va2luZ3MubGVzcz8yOWFmIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXlib29raW5ncy9kZXRhaWxzLmpzP2ZkNjciLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3MvZGV0YWlscy5odG1sP2ZhODciLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9teWJvb2tpbmdzLmpzIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXlib29raW5ncy9teWJvb2tpbmdzLmpzIiwid2VicGFjazovLy8uL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3Mvc3VtbWFyeS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9zdW1tYXJ5Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teWJvb2tpbmdzL2FtZW5kbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9hbWVuZG1lbnQuaHRtbCJdLCJuYW1lcyI6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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBNkIsT0FBTztBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNHQUFxRyxFQUFFO0FBQ3ZHOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNILEdBQUU7QUFDRjtBQUNBO0FBQ0Esa0RBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBQzs7Ozs7Ozs7QUMxWkQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVM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YywrRUFBK0UsRUFBRSxFQUFFLGdCQUFnQixxQkFBcUIsZUFBZSxlQUFlLEVBQUUsRUFBRSx5QkFBeUIsTUFBTSxxQkFBcUIsZUFBZSxPQUFPLHFCQUFxQixrQkFBa0IsT0FBTyxxQkFBcUIsZ0JBQWdCLE9BQU8sc0NBQXNDLGlFQUFpRSxNQUFNLG1FQUFtRSxFQUFFLE1BQU0sMEJBQTBCLHlDQUF5QyxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixpQkFBaUIsT0FBTyxZQUFZLHdCQUF3QixTQUFTLHVCQUF1QixtQkFBbUIsTUFBTSw4QkFBOEIsb0JBQW9CLHFDQUFxQyxNQUFNLFlBQVksd0JBQXdCLFNBQVMsdUJBQXVCLG1CQUFtQixNQUFNLDhCQUE4QixnQkFBZ0IsaUNBQWlDLEVBQUUsRUFBRSxFQUFFLHNDQUFzQyxFQUFFLEVBQUUsRyIsImZpbGUiOiJqcy9teWJvb2tpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gICAgIFZhbGlkYXRlLmpzIDAuNy4xXG5cbi8vICAgICAoYykgMjAxMy0yMDE1IE5pY2tsYXMgQW5zbWFuLCAyMDEzIFdyYXBwXG4vLyAgICAgVmFsaWRhdGUuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly92YWxpZGF0ZWpzLm9yZy9cblxuKGZ1bmN0aW9uKGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cy5cbiAgLy8gVGhlIG9wdGlvbnMgYXJlIHRoZSBmb2xsb3dpbmc6XG4gIC8vICAgLSBmb3JtYXQgKHN0cmluZykgLSBBbiBvcHRpb24gdGhhdCBjb250cm9scyBob3cgdGhlIHJldHVybmVkIHZhbHVlIGlzIGZvcm1hdHRlZFxuICAvLyAgICAgKiBmbGF0IC0gUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YganVzdCB0aGUgZXJyb3IgbWVzc2FnZXNcbiAgLy8gICAgICogZ3JvdXBlZCAtIFJldHVybnMgdGhlIG1lc3NhZ2VzIGdyb3VwZWQgYnkgYXR0cmlidXRlIChkZWZhdWx0KVxuICAvLyAgICAgKiBkZXRhaWxlZCAtIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJhdyB2YWxpZGF0aW9uIGRhdGFcbiAgLy8gICAtIGZ1bGxNZXNzYWdlcyAoYm9vbGVhbikgLSBJZiBgdHJ1ZWAgKGRlZmF1bHQpIHRoZSBhdHRyaWJ1dGUgbmFtZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGVycm9yLlxuICAvL1xuICAvLyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBvcHRpb25zIGFyZSBhbHNvIHBhc3NlZCB0byBlYWNoIHZhbGlkYXRvci5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpXG4gICAgICAsIGF0dHJcbiAgICAgICwgdmFsaWRhdG9yO1xuXG4gICAgZm9yIChhdHRyIGluIHJlc3VsdHMpIHtcbiAgICAgIGZvciAodmFsaWRhdG9yIGluIHJlc3VsdHNbYXR0cl0pIHtcbiAgICAgICAgaWYgKHYuaXNQcm9taXNlKHJlc3VsdHNbYXR0cl1bdmFsaWRhdG9yXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2UgdmFsaWRhdGUuYXN5bmMgaWYgeW91IHdhbnQgc3VwcG9ydCBmb3IgcHJvbWlzZXNcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRlLnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICB2YXIgdiA9IHZhbGlkYXRlO1xuXG4gIC8vIENvcGllcyBvdmVyIGF0dHJpYnV0ZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2VzIHRvIGEgc2luZ2xlIGRlc3RpbmF0aW9uLlxuICAvLyBWZXJ5IG11Y2ggc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgZXh0ZW5kLlxuICAvLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHRhcmdldCBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIHdpbGwgYmVcbiAgLy8gdXNlZCBhcyB0YXJnZXRzLlxuICB2LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgYXR0ciBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW2F0dHJdID0gc291cmNlW2F0dHJdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgdi5leHRlbmQodmFsaWRhdGUsIHtcbiAgICAvLyBUaGlzIGlzIHRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IGFzIGEgc2VtdmVyLlxuICAgIC8vIFRoZSB0b1N0cmluZyBmdW5jdGlvbiB3aWxsIGFsbG93IGl0IHRvIGJlIGNvZXJjZWQgaW50byBhIHN0cmluZ1xuICAgIHZlcnNpb246IHtcbiAgICAgIG1ham9yOiAwLFxuICAgICAgbWlub3I6IDcsXG4gICAgICBwYXRjaDogMSxcbiAgICAgIG1ldGFkYXRhOiBudWxsLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHYuZm9ybWF0KFwiJXttYWpvcn0uJXttaW5vcn0uJXtwYXRjaH1cIiwgdi52ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2LmlzRW1wdHkodi52ZXJzaW9uLm1ldGFkYXRhKSkge1xuICAgICAgICAgIHZlcnNpb24gKz0gXCIrXCIgKyB2LnZlcnNpb24ubWV0YWRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEJlbG93IGlzIHRoZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgdXNlZCBpbiB2YWxpZGF0ZS5qc1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIElmIHlvdSBhcmUgdXNpbmcgUS5qcywgUlNWUCBvciBhbnkgb3RoZXIgQSsgY29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIG92ZXJyaWRlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGF0IHByb21pc2UuXG4gICAgLy8gU2luY2UgalF1ZXJ5IHByb21pc2VzIGFyZW4ndCBBKyBjb21wYXRpYmxlIHRoZXkgd29uJ3Qgd29yay5cbiAgICBQcm9taXNlOiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFByb21pc2UgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgLy8gSWYgbW9tZW50IGlzIHVzZWQgaW4gbm9kZSwgYnJvd3NlcmlmeSBldGMgcGxlYXNlIHNldCB0aGlzIGF0dHJpYnV0ZVxuICAgIC8vIGxpa2UgdGhpczogYHZhbGlkYXRlLm1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG4gICAgbW9tZW50OiB0eXBlb2YgbW9tZW50ICE9PSBcInVuZGVmaW5lZFwiID8gbW9tZW50IDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIFhEYXRlOiB0eXBlb2YgWERhdGUgIT09IFwidW5kZWZpbmVkXCIgPyBYRGF0ZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBFTVBUWV9TVFJJTkdfUkVHRVhQOiAvXlxccyokLyxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cyBvYmplY3QuXG4gICAgLy8gV2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIGZvcm1hdDpcbiAgICAvLyAgICAgW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZSBuYW1lPlwiLCBlcnJvcjogXCI8dmFsaWRhdGlvbiByZXN1bHQ+XCJ9LCAuLi5dXG4gICAgcnVuVmFsaWRhdGlvbnM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgICwgYXR0clxuICAgICAgICAsIHZhbGlkYXRvck5hbWVcbiAgICAgICAgLCB2YWx1ZVxuICAgICAgICAsIHZhbGlkYXRvcnNcbiAgICAgICAgLCB2YWxpZGF0b3JcbiAgICAgICAgLCB2YWxpZGF0b3JPcHRpb25zXG4gICAgICAgICwgZXJyb3I7XG5cbiAgICAgIGlmICh2LmlzRG9tRWxlbWVudChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jb2xsZWN0Rm9ybVZhbHVlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcHMgdGhyb3VnaCBlYWNoIGNvbnN0cmFpbnRzLCBmaW5kcyB0aGUgY29ycmVjdCB2YWxpZGF0b3IgYW5kIHJ1biBpdC5cbiAgICAgIGZvciAoYXR0ciBpbiBjb25zdHJhaW50cykge1xuICAgICAgICB2YWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIGF0dHIpO1xuICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludHMgZm9yIGFuIGF0dHJpYnV0ZSB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgdmFsaWRhdG9ycyA9IHYucmVzdWx0KGNvbnN0cmFpbnRzW2F0dHJdLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuXG4gICAgICAgIGZvciAodmFsaWRhdG9yTmFtZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgdmFsaWRhdG9yID0gdi52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gdi5mb3JtYXQoXCJVbmtub3duIHZhbGlkYXRvciAle25hbWV9XCIsIHtuYW1lOiB2YWxpZGF0b3JOYW1lfSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBvcHRpb25zIHRvIGJlIGEgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlXG4gICAgICAgICAgLy8gY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHYucmVzdWx0KHZhbGlkYXRvck9wdGlvbnMsIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3JPcHRpb25zKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvcjogdmFsaWRhdG9yLmNhbGwodmFsaWRhdG9yLCB2YWx1ZSwgdmFsaWRhdG9yT3B0aW9ucywgYXR0cixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG5cbiAgICAvLyBUYWtlcyB0aGUgb3V0cHV0IGZyb20gcnVuVmFsaWRhdGlvbnMgYW5kIGNvbnZlcnRzIGl0IHRvIHRoZSBjb3JyZWN0XG4gICAgLy8gb3V0cHV0IGZvcm1hdC5cbiAgICBwcm9jZXNzVmFsaWRhdGlvblJlc3VsdHM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIGVycm9ycyA9IHYucHJ1bmVFbXB0eUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5leHBhbmRNdWx0aXBsZUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5jb252ZXJ0RXJyb3JNZXNzYWdlcyhlcnJvcnMsIG9wdGlvbnMpO1xuXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMuZm9ybWF0IHx8IFwiZ3JvdXBlZFwiKSB7XG4gICAgICAgIGNhc2UgXCJkZXRhaWxlZFwiOlxuICAgICAgICAgIC8vIERvIG5vdGhpbmcgbW9yZSB0byB0aGUgZXJyb3JzXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImZsYXRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9ycyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdyb3VwZWRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNbYXR0cl0gPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9yc1thdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHYuZm9ybWF0KFwiVW5rbm93biBmb3JtYXQgJXtmb3JtYXR9XCIsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuaXNFbXB0eShlcnJvcnMpID8gdW5kZWZpbmVkIDogZXJyb3JzO1xuICAgIH0sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0aW9ucyB3aXRoIHN1cHBvcnQgZm9yIHByb21pc2VzLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCB3aGVuIGFsbCB0aGVcbiAgICAvLyB2YWxpZGF0aW9uIHByb21pc2VzIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gICAgLy8gSXQgY2FuIGJlIGNhbGxlZCBldmVuIGlmIG5vIHZhbGlkYXRpb25zIHJldHVybmVkIGEgcHJvbWlzZS5cbiAgICBhc3luYzogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5hc3luYy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2LndhaXRGb3JSZXN1bHRzKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVycm9ycyA9IHYucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpbmdsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuc2luZ2xlLm9wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgZm9ybWF0OiBcImZsYXRcIixcbiAgICAgICAgZnVsbE1lc3NhZ2VzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdih7c2luZ2xlOiB2YWx1ZX0sIHtzaW5nbGU6IGNvbnN0cmFpbnRzfSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgcHJvbWlzZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcbiAgICAvLyBhcmUgc2V0dGxlZC4gVGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzIGFsd2F5cyByZXNvbHZlZCxcbiAgICAvLyBuZXZlciByZWplY3RlZC5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBpbnB1dCBhcmd1bWVudCwgaXQgcmVwbGFjZXMgdGhlIHByb21pc2VzXG4gICAgLy8gd2l0aCB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgcHJvbWlzZS5cbiAgICB3YWl0Rm9yUmVzdWx0czogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgLy8gQ3JlYXRlIGEgc2VxdWVuY2Ugb2YgYWxsIHRoZSByZXN1bHRzIHN0YXJ0aW5nIHdpdGggYSByZXNvbHZlZCBwcm9taXNlLlxuICAgICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHJlc3VsdCkge1xuICAgICAgICAvLyBJZiB0aGlzIHJlc3VsdCBpc24ndCBhIHByb21pc2Ugc2tpcCBpdCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIGlmICghdi5pc1Byb21pc2UocmVzdWx0LmVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lbW8udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmVycm9yLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAvLyBJZiBmb3Igc29tZSByZWFzb24gdGhlIHZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgbm9cbiAgICAgICAgICAgICAgLy8gZXJyb3Igd2FzIHNwZWNpZmllZC5cbiAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHYud2FybihcIlZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgZGlkbid0IHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcigpOyB9KSk7IC8vIEEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIH0sXG5cbiAgICAvLyBJZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBjYWxsOiBmdW5jdGlvbiB0aGUgYW5kOiBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlXG4gICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZS4gQWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXNcbiAgICAvLyBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmVzdWx0KCdmb28nKSAvLyAnZm9vJ1xuICAgIC8vIHJlc3VsdChNYXRoLm1heCwgMSwgMikgLy8gMlxuICAgIC8vIGBgYFxuICAgIHJlc3VsdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLiBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IGNvbnNpZGVyIE5hTiBhXG4gICAgLy8gbnVtYmVyIGxpa2UgbWFueSBvdGhlciBgaXNOdW1iZXJgIGZ1bmN0aW9ucyBkby5cbiAgICBpc051bWJlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBub3QgYSBmdW5jdGlvblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0sXG5cbiAgICAvLyBBIHNpbXBsZSBjaGVjayB0byB2ZXJpZnkgdGhhdCB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlci4gVXNlcyBgaXNOdW1iZXJgXG4gICAgLy8gYW5kIGEgc2ltcGxlIG1vZHVsbyBjaGVjay5cbiAgICBpc0ludGVnZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgJSAxID09PSAwO1xuICAgIH0sXG5cbiAgICAvLyBVc2VzIHRoZSBgT2JqZWN0YCBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYW4gb2JqZWN0LlxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICAgIH0sXG5cbiAgICAvLyBTaW1wbHkgY2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBkYXRlXG4gICAgaXNEYXRlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgYG51bGxgIG9mIGB1bmRlZmluZWRgXG4gICAgaXNEZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBwcm9taXNlLiBBbnl0aGluZyB3aXRoIGEgYHRoZW5gXG4gICAgLy8gZnVuY3Rpb24gaXMgY29uc2lkZXJlZCBhIHByb21pc2UuXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gISFwICYmIHYuaXNGdW5jdGlvbihwLnRoZW4pO1xuICAgIH0sXG5cbiAgICBpc0RvbUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvckFsbCkgfHwgIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3QoZG9jdW1lbnQpICYmIG8gPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvNjk5MzA0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG8gJiZcbiAgICAgICAgICB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgICBvLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgLy8gTnVsbCBhbmQgdW5kZWZpbmVkIGFyZSBlbXB0eVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaXRlc3BhY2Ugb25seSBzdHJpbmdzIGFyZSBlbXB0eVxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2LkVNUFRZX1NUUklOR19SRUdFWFAudGVzdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBhcnJheXMgd2UgdXNlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgIGlmICh2LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIGhhdmUgbm8gYXR0cmlidXRlcyBidXQgYXJlbid0IGVtcHR5XG4gICAgICBpZiAodi5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgZmluZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkgd2UgY29uc2lkZXIgaXQgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEZvcm1hdHMgdGhlIHNwZWNpZmllZCBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHZhbHVlcyBsaWtlIHNvOlxuICAgIC8vIGBgYFxuICAgIC8vIGZvcm1hdChcIkZvbzogJXtmb299XCIsIHtmb286IFwiYmFyXCJ9KSAvLyBcIkZvbyBiYXJcIlxuICAgIC8vIGBgYFxuICAgIC8vIElmIHlvdSB3YW50IHRvIHdyaXRlICV7Li4ufSB3aXRob3V0IGhhdmluZyBpdCByZXBsYWNlZCBzaW1wbHlcbiAgICAvLyBwcmVmaXggaXQgd2l0aCAlIGxpa2UgdGhpcyBgRm9vOiAlJXtmb299YCBhbmQgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIGFzIGBcIkZvbzogJXtmb299XCJgXG4gICAgZm9ybWF0OiB2LmV4dGVuZChmdW5jdGlvbihzdHIsIHZhbHMpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSh2LmZvcm1hdC5GT1JNQVRfUkVHRVhQLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgIGlmIChtMSA9PT0gJyUnKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJXtcIiArIG0yICsgXCJ9XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWxzW20yXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgIC8vIEZpbmRzICV7a2V5fSBzdHlsZSBwYXR0ZXJucyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICBGT1JNQVRfUkVHRVhQOiAvKCU/KSVcXHsoW15cXH1dKylcXH0vZ1xuICAgIH0pLFxuXG4gICAgLy8gXCJQcmV0dGlmaWVzXCIgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAvLyBQcmV0dGlmeWluZyBtZWFucyByZXBsYWNpbmcgWy5cXF8tXSB3aXRoIHNwYWNlcyBhcyB3ZWxsIGFzIHNwbGl0dGluZ1xuICAgIC8vIGNhbWVsIGNhc2Ugd29yZHMuXG4gICAgcHJldHRpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHYuaXNOdW1iZXIoc3RyKSkge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDIgZGVjaW1hbHMgcm91bmQgaXQgdG8gdHdvXG4gICAgICAgIGlmICgoc3RyICogMTAwKSAlIDEgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHN0ciAqIDEwMCkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNBcnJheShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHYucHJldHRpZnkocyk7IH0pLmpvaW4oXCIsIFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgc3RyaW5nIGlzIGFjdHVhbGx5IGEgc3RyaW5nXG4gICAgICBzdHIgPSBcIlwiICsgc3RyO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC8vIFNwbGl0cyBrZXlzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXHNdKVxcLihbXlxcc10pL2csICckMSAkMicpXG4gICAgICAgIC8vIFJlbW92ZXMgYmFja3NsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwrL2csICcnKVxuICAgICAgICAvLyBSZXBsYWNlcyAtIGFuZCAtIHdpdGggc3BhY2VcbiAgICAgICAgLnJlcGxhY2UoL1tfLV0vZywgJyAnKVxuICAgICAgICAvLyBTcGxpdHMgY2FtZWwgY2FzZWQgd29yZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIG0xICsgXCIgXCIgKyBtMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgc3RyaW5naWZ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5wcmV0dGlmeSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIGluIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0RGVlcE9iamVjdFZhbHVlOiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIGlmICghdi5pc09iamVjdChvYmopIHx8ICF2LmlzU3RyaW5nKGtleXBhdGgpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiXG4gICAgICAgICwgaVxuICAgICAgICAsIGVzY2FwZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cGF0aC5sZW5ndGg7ICsraSkge1xuICAgICAgICBzd2l0Y2ggKGtleXBhdGhbaV0pIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnLic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgICAgICAgICAgIGtleSA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnXFxcXCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cGF0aFtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzRGVmaW5lZChvYmopICYmIGtleSBpbiBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVGhpcyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtLlxuICAgIC8vIEl0IHVzZXMgdGhlIGlucHV0IG5hbWUgYXMga2V5IGFuZCB0aGUgdmFsdWUgYXMgdmFsdWVcbiAgICAvLyBTbyBmb3IgZXhhbXBsZSB0aGlzOlxuICAgIC8vIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiZm9vQGJhci5jb21cIiAvPlxuICAgIC8vIHdvdWxkIHJldHVybjpcbiAgICAvLyB7ZW1haWw6IFwiZm9vQGJhci5jb21cIn1cbiAgICBjb2xsZWN0Rm9ybVZhbHVlczogZnVuY3Rpb24oZm9ybSwgb3B0aW9ucykge1xuICAgICAgdmFyIHZhbHVlcyA9IHt9XG4gICAgICAgICwgaVxuICAgICAgICAsIGlucHV0XG4gICAgICAgICwgaW5wdXRzXG4gICAgICAgICwgdmFsdWU7XG5cbiAgICAgIGlmICghZm9ybSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF0dHJpYnV0ZXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0udmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LFxuXG4gICAgc2FuaXRpemVGb3JtVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmltICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5udWxsaWZ5ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgYWxsIGVycm9ycyB3aG8ncyBlcnJvciBhdHRyaWJ1dGUgaXMgZW1wdHkgKG51bGwgb3IgdW5kZWZpbmVkKVxuICAgIHBydW5lRW1wdHlFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICF2LmlzRW1wdHkoZXJyb3IuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIEluXG4gICAgLy8gW3tlcnJvcjogW1wiZXJyMVwiLCBcImVycjJcIl0sIC4uLn1dXG4gICAgLy8gT3V0XG4gICAgLy8gW3tlcnJvcjogXCJlcnIxXCIsIC4uLn0sIHtlcnJvcjogXCJlcnIyXCIsIC4uLn1dXG4gICAgLy9cbiAgICAvLyBBbGwgYXR0cmlidXRlcyBpbiBhbiBlcnJvciB3aXRoIG11bHRpcGxlIG1lc3NhZ2VzIGFyZSBkdXBsaWNhdGVkXG4gICAgLy8gd2hlbiBleHBhbmRpbmcgdGhlIGVycm9ycy5cbiAgICBleHBhbmRNdWx0aXBsZUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBSZW1vdmVzIGVycm9ycyB3aXRob3V0IGEgbWVzc2FnZVxuICAgICAgICBpZiAodi5pc0FycmF5KGVycm9yLmVycm9yKSkge1xuICAgICAgICAgIGVycm9yLmVycm9yLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3IsIHtlcnJvcjogbXNnfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0cyB0aGUgZXJyb3IgbWVzYWdlcyBieSBwcmVwZW5kaW5nIHRoZSBhdHRyaWJ1dGUgbmFtZSB1bmxlc3MgdGhlXG4gICAgLy8gbWVzc2FnZSBpcyBwcmVmaXhlZCBieSBeXG4gICAgY29udmVydEVycm9yTWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9ySW5mbykge1xuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckluZm8uZXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yWzBdID09PSAnXicpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yLnNsaWNlKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZnVsbE1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVycm9yID0gdi5jYXBpdGFsaXplKHYucHJldHRpZnkoZXJyb3JJbmZvLmF0dHJpYnV0ZSkpICsgXCIgXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IGVycm9yLnJlcGxhY2UoL1xcXFxcXF4vZywgXCJeXCIpO1xuICAgICAgICBlcnJvciA9IHYuZm9ybWF0KGVycm9yLCB7dmFsdWU6IHYuc3RyaW5naWZ5VmFsdWUoZXJyb3JJbmZvLnZhbHVlKX0pO1xuICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3JJbmZvLCB7ZXJyb3I6IGVycm9yfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8ge1wiPGF0dHJpYnV0ZU5hbWU+XCI6IFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XX1cbiAgICBncm91cEVycm9yc0J5QXR0cmlidXRlOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBsaXN0ID0gcmV0W2Vycm9yLmF0dHJpYnV0ZV07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgbGlzdC5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXRbZXJyb3IuYXR0cmlidXRlXSA9IFtlcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3tlcnJvcjogXCI8bWVzc2FnZSAxPlwiLCAuLi59LCB7ZXJyb3I6IFwiPG1lc3NhZ2UgMj5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8gW1wiPG1lc3NhZ2UgMT5cIiwgXCI8bWVzc2FnZSAyPlwiXVxuICAgIGZsYXR0ZW5FcnJvcnNUb0FycmF5OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKSB7IHJldHVybiBlcnJvci5lcnJvcjsgfSk7XG4gICAgfSxcblxuICAgIGV4cG9zZU1vZHVsZTogZnVuY3Rpb24odmFsaWRhdGUsIHJvb3QsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgICBpZiAodmFsaWRhdGUuaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXJuOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7XG4gICAgLy8gUHJlc2VuY2UgdmFsaWRhdGVzIHRoYXQgdGhlIHZhbHVlIGlzbid0IGVtcHR5XG4gICAgcHJlc2VuY2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImNhbid0IGJlIGJsYW5rXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpcyA9IG9wdGlvbnMuaXNcbiAgICAgICAgLCBtYXhpbXVtID0gb3B0aW9ucy5tYXhpbXVtXG4gICAgICAgICwgbWluaW11bSA9IG9wdGlvbnMubWluaW11bVxuICAgICAgICAsIHRva2VuaXplciA9IG9wdGlvbnMudG9rZW5pemVyIHx8IGZ1bmN0aW9uKHZhbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICwgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW107XG5cbiAgICAgIHZhbHVlID0gdG9rZW5pemVyKHZhbHVlKTtcbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICBpZighdi5pc051bWJlcihsZW5ndGgpKSB7XG4gICAgICAgIHYuZXJyb3Iodi5mb3JtYXQoXCJBdHRyaWJ1dGUgJXthdHRyfSBoYXMgYSBub24gbnVtZXJpYyB2YWx1ZSBmb3IgYGxlbmd0aGBcIiwge2F0dHI6IGF0dHJpYnV0ZX0pKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaGFzIGFuIGluY29ycmVjdCBsZW5ndGhcIjtcbiAgICAgIH1cblxuICAgICAgLy8gSXMgY2hlY2tzXG4gICAgICBpZiAodi5pc051bWJlcihpcykgJiYgbGVuZ3RoICE9PSBpcykge1xuICAgICAgICBlcnIgPSBvcHRpb25zLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIFwiaXMgdGhlIHdyb25nIGxlbmd0aCAoc2hvdWxkIGJlICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBpc30pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWluaW11bSkgJiYgbGVuZ3RoIDwgbWluaW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb1Nob3J0IHx8XG4gICAgICAgICAgdGhpcy50b29TaG9ydCB8fFxuICAgICAgICAgIFwiaXMgdG9vIHNob3J0IChtaW5pbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtaW5pbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtYXhpbXVtKSAmJiBsZW5ndGggPiBtYXhpbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTG9uZyB8fFxuICAgICAgICAgIHRoaXMudG9vTG9uZyB8fFxuICAgICAgICAgIFwiaXMgdG9vIGxvbmcgKG1heGltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1heGltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bWVyaWNhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgICAsIG5hbWVcbiAgICAgICAgLCBjb3VudFxuICAgICAgICAsIGNoZWNrcyA9IHtcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuOiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID4gYzsgfSxcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID49IGM7IH0sXG4gICAgICAgICAgICBlcXVhbFRvOiAgICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA9PT0gYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuOiAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDwgYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDw9IGM7IH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBDb2VyY2UgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIHVubGVzcyB3ZSdyZSBiZWluZyBzdHJpY3QuXG4gICAgICBpZiAob3B0aW9ucy5ub1N0cmluZ3MgIT09IHRydWUgJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIHdlIHNob3VsZG4ndCBjb250aW51ZSBzaW5jZSBpdCB3aWxsIGNvbXBhcmUgaXQuXG4gICAgICBpZiAoIXYuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImlzIG5vdCBhIG51bWJlclwiO1xuICAgICAgfVxuXG4gICAgICAvLyBTYW1lIGxvZ2ljIGFzIGFib3ZlLCBzb3J0IG9mLiBEb24ndCBib3RoZXIgd2l0aCBjb21wYXJpc29ucyBpZiB0aGlzXG4gICAgICAvLyBkb2Vzbid0IHBhc3MuXG4gICAgICBpZiAob3B0aW9ucy5vbmx5SW50ZWdlciAmJiAhdi5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RJbnRlZ2VyICB8fCBcIm11c3QgYmUgYW4gaW50ZWdlclwiO1xuICAgICAgfVxuXG4gICAgICBmb3IgKG5hbWUgaW4gY2hlY2tzKSB7XG4gICAgICAgIGNvdW50ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgaWYgKHYuaXNOdW1iZXIoY291bnQpICYmICFjaGVja3NbbmFtZV0odmFsdWUsIGNvdW50KSkge1xuICAgICAgICAgIC8vIFRoaXMgcGlja3MgdGhlIGRlZmF1bHQgbWVzc2FnZSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZSB0aGUgZ3JlYXRlclRoYW4gY2hlY2sgdXNlcyB0aGUgbWVzc2FnZSBmcm9tXG4gICAgICAgICAgLy8gdGhpcy5ub3RHcmVhdGVyVGhhbiBzbyB3ZSBjYXBpdGFsaXplIHRoZSBuYW1lIGFuZCBwcmVwZW5kIFwibm90XCJcbiAgICAgICAgICB2YXIgbXNnID0gdGhpc1tcIm5vdFwiICsgdi5jYXBpdGFsaXplKG5hbWUpXSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlICV7dHlwZX0gJXtjb3VudH1cIjtcblxuICAgICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KG1zZywge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgdHlwZTogdi5wcmV0dGlmeShuYW1lKVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5vZGQgJiYgdmFsdWUgJSAyICE9PSAxKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90T2RkIHx8IFwibXVzdCBiZSBvZGRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5ldmVuICYmIHZhbHVlICUgMiAhPT0gMCkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdEV2ZW4gfHwgXCJtdXN0IGJlIGV2ZW5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZXRpbWU6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW11cbiAgICAgICAgLCBlYXJsaWVzdCA9IG9wdGlvbnMuZWFybGllc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMuZWFybGllc3QsIG9wdGlvbnMpIDogTmFOXG4gICAgICAgICwgbGF0ZXN0ID0gb3B0aW9ucy5sYXRlc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMubGF0ZXN0LCBvcHRpb25zKSA6IE5hTjtcblxuICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlKHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgLy8gODY0MDAwMDAgaXMgdGhlIG51bWJlciBvZiBzZWNvbmRzIGluIGEgZGF5LCB0aGlzIGlzIHVzZWQgdG8gcmVtb3ZlXG4gICAgICAvLyB0aGUgdGltZSBmcm9tIHRoZSBkYXRlXG4gICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IG9wdGlvbnMuZGF0ZU9ubHkgJiYgdmFsdWUgJSA4NjQwMDAwMCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJtdXN0IGJlIGEgdmFsaWQgZGF0ZVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGVhcmxpZXN0KSAmJiB2YWx1ZSA8IGVhcmxpZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vRWFybHkgfHwgXCJtdXN0IGJlIG5vIGVhcmxpZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGVhcmxpZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGxhdGVzdCkgJiYgdmFsdWUgPiBsYXRlc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29MYXRlIHx8IFwibXVzdCBiZSBubyBsYXRlciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQobGF0ZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb252ZXJ0IGlucHV0IHRvIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIG1pbGxpcyBzaW5jZSB0aGUgZXBvY2guXG4gICAgICAvLyBJdCBzaG91bGQgcmV0dXJuIE5hTiBpZiBpdCdzIG5vdCBhIHZhbGlkIGRhdGUuXG4gICAgICBwYXJzZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgdi5YRGF0ZSh2YWx1ZSwgdHJ1ZSkuZ2V0VGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIHJldHVybiArdi5tb21lbnQudXRjKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH0sXG4gICAgICAvLyBGb3JtYXRzIHRoZSBnaXZlbiB0aW1lc3RhbXAuIFVzZXMgSVNPODYwMSB0byBmb3JtYXQgdGhlbS5cbiAgICAgIC8vIElmIG9wdGlvbnMuZGF0ZU9ubHkgaXMgdHJ1ZSB0aGVuIG9ubHkgdGhlIHllYXIsIG1vbnRoIGFuZCBkYXkgd2lsbCBiZVxuICAgICAgLy8gb3V0cHV0LlxuICAgICAgZm9ybWF0OiBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSBvcHRpb25zLmRhdGVGb3JtYXQ7XG5cbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwieXl5eS1NTS1kZFwiIDogXCJ5eXl5LU1NLWRkIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiBuZXcgWERhdGUoZGF0ZSwgdHJ1ZSkudG9TdHJpbmcoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcIllZWVktTU0tRERcIiA6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gdi5tb21lbnQudXRjKGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH0pLFxuICAgIGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIG9wdGlvbnMsIHtkYXRlT25seTogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHYudmFsaWRhdG9ycy5kYXRldGltZS5jYWxsKHYudmFsaWRhdG9ycy5kYXRldGltZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykgfHwgKG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7cGF0dGVybjogb3B0aW9uc307XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgaW52YWxpZFwiXG4gICAgICAgICwgcGF0dGVybiA9IG9wdGlvbnMucGF0dGVyblxuICAgICAgICAsIG1hdGNoO1xuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdGlvbnMucGF0dGVybiwgb3B0aW9ucy5mbGFncyk7XG4gICAgICB9XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyh2YWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoIHx8IG1hdGNoWzBdLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbmNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJeJXt2YWx1ZX0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0XCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZXhjbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICghdi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcIl4le3ZhbHVlfSBpcyByZXN0cmljdGVkXCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZW1haWw6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCBlbWFpbFwiO1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLlBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgUEFUVEVSTjogL15bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16XXsyLH0kL2lcbiAgICB9KSxcbiAgICBlcXVhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge2F0dHJpYnV0ZTogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJpcyBub3QgZXF1YWwgdG8gJXthdHRyaWJ1dGV9XCI7XG5cbiAgICAgIGlmICh2LmlzRW1wdHkob3B0aW9ucy5hdHRyaWJ1dGUpIHx8ICF2LmlzU3RyaW5nKG9wdGlvbnMuYXR0cmlidXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXR0cmlidXRlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3RoZXJWYWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlKVxuICAgICAgICAsIGNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3IgfHwgZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgICAgcmV0dXJuIHYxID09PSB2MjtcbiAgICAgICAgfTtcblxuICAgICAgaWYgKCFjb21wYXJhdG9yKHZhbHVlLCBvdGhlclZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7YXR0cmlidXRlOiB2LnByZXR0aWZ5KG9wdGlvbnMuYXR0cmlidXRlKX0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5leHBvc2VNb2R1bGUodmFsaWRhdGUsIHRoaXMsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKTtcbn0pLmNhbGwodGhpcyxcbiAgICAgICAgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZXhwb3J0cyA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbW9kdWxlIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBkZWZpbmUgOiBudWxsKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMyA0IDUgNiA3IDggOSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcImRlZmluZSBjYW5ub3QgYmUgdXNlZCBpbmRpcmVjdFwiKTsgfTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qc1xuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDMgNCA1IDYgNyA4IDkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXG4gICAgICAgIFEgPSByZXF1aXJlKCdxJyksXG4gICAgICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXG4gICAgICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxuXG4gICAgICAgIDtcblxudmFyIFN0b3JlID0gcmVxdWlyZSgnY29yZS9zdG9yZScpO1xuXG52YXIgTXlib29raW5nRGF0YSA9IFN0b3JlLmV4dGVuZCh7XG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgcHJpY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZnJlc2hDdXJyZW50Q2FydDogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlZnJlc2hDdXJyZW50Q2FydFwiKTtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldENhcnREZXRhaWxzLycgKyBfLnBhcnNlSW50KHZpZXcuZ2V0KCdjdXJyZW50Q2FydElkJykpLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsIGVtYWlsOiBkYXRhLmVtYWlsLCB1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsIGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyZW5jeTogZGF0YS5jdXJlbmN5LCBmb3A6IGRhdGEuZm9wLCBiYXNlcHJpY2U6IGRhdGEuYmFzZXByaWNlLCB0YXhlczogZGF0YS50YXhlcywgY29udmZlZTogZGF0YS5jb252ZmVlLCBmZWU6IGRhdGEuZmVlLCB0b3RhbEFtb3VudGlud29yZHM6IGRhdGEudG90YWxBbW91bnRpbndvcmRzLCBjdXN0b21lcmNhcmU6IGRhdGEuY3VzdG9tZXJjYXJlLCBwcm9tb2Rpc2NvdW50OiBkYXRhLnByb21vX2Rpc2NvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdXBjb21pbmc6IGkudXBjb21pbmcsIHNvdXJjZV9pZDogaS5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBpLmRlc3RpbmF0aW9uX2lkLCBzb3VyY2U6IGkuc291cmNlLCBmbGlnaHR0aW1lOiBpLmZsaWdodHRpbWUsIGRlc3RpbmF0aW9uOiBpLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IGkuZGVwYXJ0dXJlLCBhcnJpdmFsOiBpLmFycml2YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBib29raW5naWQ6IHQuYm9va2luZ2lkLCBmYXJldHlwZTogdC5mYXJldHlwZSwgdGl0bGU6IHQudGl0bGUsIHR5cGU6IHQudHlwZSwgZmlyc3RfbmFtZTogdC5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHQubGFzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4scHJvZHVjdF9jbGFzczp0LnByb2R1Y3RfY2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLCBzdGF0dXNtc2c6IHQuc3RhdHVzbXNnLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm8uaWQsIG9yaWdpbjogcm8ub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiByby5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHJvLmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHJvLmRlcGFydHVyZSwgYXJyaXZhbDogcm8uYXJyaXZhbCwgY2Fycmllcjogcm8uY2FycmllciwgbG9nbzogcm8ubG9nbywgY2Fycmllck5hbWU6IHJvLmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHJvLmZsaWdodE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBvcmlnaW46IHQub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiB0Lm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogdC5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiB0LmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHQuZGVwYXJ0dXJlLCBhcnJpdmFsOiB0LmFycml2YWwsIGNhcnJpZXI6IHQuY2FycmllciwgY2Fycmllck5hbWU6IHQuY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogdC5mbGlnaHROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2N1cnJlbnRDYXJ0RGV0YWlscycsIGRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleCh2aWV3LmdldCgnY2FydHMnKSwgeydpZCc6IGRldGFpbHMuaWR9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4OiAnK2luZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FydHMgPSB2aWV3LmdldCgnY2FydHMnKTtcbiAgICAgICAgICAgICAgICAgICAgY2FydHNbaW5kZXhdLmJvb2tpbmdfc3RhdHVzID0gZGV0YWlscy5ib29raW5nX3N0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NhcnRzJywgY2FydHMpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VtbWFyeScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbnNpaGVkIHN0b3JlOiAnKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxuTXlib29raW5nRGF0YS5nZXRDdXJyZW50Q2FydCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0Q3VycmVudENhcnRcIik7XG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldENhcnREZXRhaWxzLycgKyBfLnBhcnNlSW50KGlkKSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YS5ib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtjb25zb2xlLmxvZyhpKTt9KSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkb25lXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB2YXIgZGV0YWlsczEgPSB7XG4gICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c291cmNlOiBpLnNvdXJjZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtvcmlnaW46IHJvLm9yaWdpbiwgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9ufTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7b3JpZ2luOiB0Lm9yaWdpbiwgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb259O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KX07XG4gICAgICAgICAgICB2YXIgb2JqX2xlbmd0aCA9IGRldGFpbHMxLmJvb2tpbmdzWzBdLnJvdXRlcy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgYWxsb3JpZ2lucyA9IFtdO1xuICAgICAgICAgICAgdmFyIGFsbGRlc3RpbmF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBvYmpfbGVuZ3RoOyBhKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWxsb3JpZ2lucy5wdXNoKGRldGFpbHMxLmJvb2tpbmdzWzBdLnJvdXRlc1thXS5vcmlnaW4pO1xuICAgICAgICAgICAgICAgIGFsbGRlc3RpbmF0aW9ucy5wdXNoKGRldGFpbHMxLmJvb2tpbmdzWzBdLnJvdXRlc1thXS5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxsZGVzdGluYXRpb25zLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhbGxvcmlnaW5zKTtjb25zb2xlLmxvZyhhbGxkZXN0aW5hdGlvbnMpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2Vfb25lID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBhbGxkZXN0aW5hdGlvbnMubGVuZ3RoOyBiKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFsbG9yaWdpbnNbYiArIDFdICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFsbG9yaWdpbnNbYisxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3JpZ2luc1tiICsgMV0gIT0gYWxsZGVzdGluYXRpb25zW2JdKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSBcIkFDXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlX29uZS5wdXNoKGFsbG9yaWdpbnNbYiArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2Vfb25lLnB1c2goYWxsZGVzdGluYXRpb25zW2JdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbXNnICE9PSBcInVuZGVmaW5lZFwiICYmIG1zZyA9PSBcIkFDXCIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIkFpcnBvcnQgQ2hhbmdlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG1zZyk7Y29uc29sZS5sb2coY2hhbmdlX29uZSk7XG4gICAgICAgICAgICB2YXIgZGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICBhaXJwb3J0X2NoYW5nZTogbWVzc2FnZSwgYWlycG9ydF9jaGFuZ2VfbmFtZTogY2hhbmdlX29uZSwgdHJhbnNpdDogZGF0YS50cmFuc2l0LFxuICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDogZGF0YS5lbWFpbCwgdGlja2V0c3RhdHVzbXNnOiBkYXRhLnRpY2tldHN0YXR1c21zZywgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBjbGllbnRTb3VyY2VJZDogZGF0YS5jbGllbnRTb3VyY2VJZCwgc2VnTmlnaHRzOiBkYXRhLnNlZ05pZ2h0cyxcbiAgICAgICAgICAgICAgICBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LCBmb3A6IGRhdGEuZm9wLCBiYXNlcHJpY2U6IGRhdGEuYmFzZXByaWNlLCB0YXhlczogZGF0YS50YXhlcywgY29udmZlZTogZGF0YS5jb252ZmVlLCBmZWU6IGRhdGEuZmVlLCB0b3RhbEFtb3VudGlud29yZHM6IGRhdGEudG90YWxBbW91bnRpbndvcmRzLCBjdXN0b21lcmNhcmU6IGRhdGEuY3VzdG9tZXJjYXJlLCBwcm9tb2Rpc2NvdW50OiBkYXRhLnByb21vX2Rpc2NvdW50LFxuICAgICAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChkYXRhLmJvb2tpbmdzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4scHJvZHVjdF9jbGFzczp0LnByb2R1Y3RfY2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2ljZmFyZTogdC5iYXNpY2ZhcmUsIHRheGVzOiB0LnRheGVzLCB0b3RhbDogdC50b3RhbCwgc3RhdHVzOiB0LnN0YXR1cywgc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKHQucm91dGVzLCBmdW5jdGlvbiAocm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgbG9nbzogcm8ubG9nbywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogcm8uZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHJvLm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiByby5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiByby5tZWFsLCBzZWF0OiByby5zZWF0LCBhaXJjcmFmdDogcm8uYWlyY3JhZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgbG9nbzogdC5sb2dvLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiB0LmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiB0Lm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiB0LmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHQubWVhbCwgc2VhdDogdC5zZWF0LCBhaXJjcmFmdDogdC5haXJjcmFmdCwgdGVjaFN0b3A6IHQudGVjaFN0b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoeCwgeSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSl9O1xuXG4gICAgICAgICAgICAvKkNIRUNLIEFJUlBPUlQgQ0hBTkdFIEFORCBHRVQqL1xuXG4gICAgICAgICAgICAvKkNIRUNLIEFJUlBPUlQgQ0hBTkdFIEFORCBHRVQqL1xuXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRDYXJ0RGV0YWlscyA9IGRldGFpbHM7XG5cbiAgICAgICAgICAgIGRhdGEuY2FydHMgPSBbXTtcbiAgICAgICAgICAgIGRhdGEuY2FydHMucHVzaChkZXRhaWxzKTtcbiAgICAgICAgICAgIGRhdGEuY2FiaW5UeXBlID0gMTtcbiAgICAgICAgICAgIGRhdGEuYWRkID0gZmFsc2U7XG4gICAgICAgICAgICBkYXRhLmVkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGRhdGEuY3VycmVudENhcnRJZCA9IGRldGFpbHMuaWQ7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEuY3VycmVudENhcnREZXRhaWxzKTtcbiAgICAgICAgICAgIGRhdGEuc3VtbWFyeSA9IGZhbHNlO1xuICAgICAgICAgICAgZGF0YS5wcmludCA9IGZhbHNlO1xuICAgICAgICAgICAgZGF0YS5wZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBkYXRhLmFtZW5kID0gZmFsc2U7XG4gICAgICAgICAgICBkYXRhLmNhbmNlbCA9IGZhbHNlO1xuICAgICAgICAgICAgZGF0YS5yZXNjaGVkdWxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGRhdGEuZXJyb3JzID0ge307XG4gICAgICAgICAgICBkYXRhLnJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgZGF0YS5maWx0ZXIgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG5ldyBNeWJvb2tpbmdEYXRhKHtkYXRhOiBkYXRhfSkpO1xuXG5cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pXG4gICAgfSk7XG59O1xuXG5NeWJvb2tpbmdEYXRhLnBhcnNlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiTXlib29raW5nRGF0YS5wYXJzZVwiKTtcbiAgICAvL2RhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gRmxpZ2h0LnBhcnNlKGkpOyB9KTtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpOyAgIFxuICAgIHZhciBmbGdVcGNvbWluZyA9IGZhbHNlO1xuICAgIHZhciBmbGdQcmV2aW91cyA9IGZhbHNlO1xuICAgIGRhdGEuY2FydHMgPSBfLm1hcChkYXRhLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICBpZiAoaS51cGNvbWluZyA9PSAndHJ1ZScpXG4gICAgICAgICAgICBmbGdVcGNvbWluZyA9IHRydWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZsZ1ByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgZW1haWw6IGkuZW1haWwsIGNyZWF0ZWQ6IGkuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGkudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBpLmJvb2tpbmdfc3RhdHVzLFxuICAgICAgICAgICAgcmV0dXJuZGF0ZTogaS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogaS5pc011bHRpQ2l0eSwgY3VyZW5jeTogaS5jdXJlbmN5LCB1cGNvbWluZzogaS51cGNvbWluZyxcbiAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChpLmJvb2tpbmdzLCBmdW5jdGlvbiAoYikge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGIuaWQsIHNvdXJjZTogYi5zb3VyY2UsIGRlc3RpbmF0aW9uOiBiLmRlc3RpbmF0aW9uLCBzb3VyY2VfaWQ6IGIuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogYi5kZXN0aW5hdGlvbl9pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlOiBiLmRlcGFydHVyZSwgYXJyaXZhbDogYi5hcnJpdmFsLFxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxlcnM6IF8ubWFwKGIudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogdC5pZCwgbmFtZTogdC5uYW1lfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0cmF2ZWxlcjogXy5tYXAoaS50cmF2ZWxsZXJkdGwsIGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogai5pZCwgbmFtZTogai5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBzcmM6IF8ubWFwKGouc3JjLCBmdW5jdGlvbiAoZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBnfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IF8ubWFwKGouZGVzdCwgZnVuY3Rpb24gKGcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZTogZ307XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICBkYXRhLmNhcnRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHguaWQgPCB5LmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH1cbiAgICAgICAgO1xuXG4gICAgfSk7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmNhcnRzKTsgIFxuICAgIC8vICAgICAgICAgIGRhdGEuY3VycmVudFRyYXZlbGxlcj0gXy5maXJzdChkYXRhLnRyYXZlbGxlcnMpO1xuICAgIC8vICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXJJZD1kYXRhLmN1cnJlbnRUcmF2ZWxsZXIuaWQ7XG4gICAgZGF0YS5jYWJpblR5cGUgPSAxO1xuICAgIGRhdGEuYWRkID0gZmFsc2U7XG4gICAgZGF0YS5lZGl0ID0gZmFsc2U7XG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gbnVsbDtcbiAgICBkYXRhLmN1cnJlbnRDYXJ0RGV0YWlscyA9IG51bGw7XG4gICAgZGF0YS5zdW1tYXJ5ID0gdHJ1ZTtcbiAgICBkYXRhLnBlbmRpbmcgPSB0cnVlO1xuICAgIGRhdGEuYW1lbmQgPSBmYWxzZTtcbiAgICBkYXRhLmNhbmNlbCA9IGZhbHNlO1xuICAgIGRhdGEucHJpbnQgPSBmYWxzZTtcbiAgICBkYXRhLnJlc2NoZWR1bGUgPSBmYWxzZTtcbiAgICBkYXRhLmZsZ1VwY29taW5nID0gZmxnVXBjb21pbmc7XG4gICAgZGF0YS5mbGdQcmV2aW91cyA9IGZsZ1ByZXZpb3VzO1xuICAgIGRhdGEuZXJyb3JzID0ge307XG4gICAgZGF0YS5yZXN1bHRzID0gW107XG5cbiAgICBkYXRhLmZpbHRlciA9IHt9O1xuICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcbiAgICByZXR1cm4gbmV3IE15Ym9va2luZ0RhdGEoe2RhdGE6IGRhdGF9KTtcblxufTtcbk15Ym9va2luZ0RhdGEuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIk15Ym9va2luZ0RhdGEuZmV0Y2hcIik7XG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9haXJDYXJ0L2dldE15Qm9va2luZ3MnKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoTXlib29raW5nRGF0YS5wYXJzZShkYXRhKSk7XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IE15Ym9va2luZ0RhdGE7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9zdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmpzXG4vLyBtb2R1bGUgaWQgPSA2NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSA2IDciLCIvKiFcbiAqIGFjY291bnRpbmcuanMgdjAuMy4yXG4gKiBDb3B5cmlnaHQgMjAxMSwgSm9zcyBDcm93Y3JvZnRcbiAqXG4gKiBGcmVlbHkgZGlzdHJpYnV0YWJsZSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBQb3J0aW9ucyBvZiBhY2NvdW50aW5nLmpzIGFyZSBpbnNwaXJlZCBvciBib3Jyb3dlZCBmcm9tIHVuZGVyc2NvcmUuanNcbiAqXG4gKiBGdWxsIGRldGFpbHMgYW5kIGRvY3VtZW50YXRpb246XG4gKiBodHRwOi8vam9zc2Nyb3djcm9mdC5naXRodWIuY29tL2FjY291bnRpbmcuanMvXG4gKi9cblxuKGZ1bmN0aW9uKHJvb3QsIHVuZGVmaW5lZCkge1xuXG5cdC8qIC0tLSBTZXR1cCAtLS0gKi9cblxuXHQvLyBDcmVhdGUgdGhlIGxvY2FsIGxpYnJhcnkgb2JqZWN0LCB0byBiZSBleHBvcnRlZCBvciByZWZlcmVuY2VkIGdsb2JhbGx5IGxhdGVyXG5cdHZhciBsaWIgPSB7fTtcblxuXHQvLyBDdXJyZW50IHZlcnNpb25cblx0bGliLnZlcnNpb24gPSAnMC4zLjInO1xuXG5cblx0LyogLS0tIEV4cG9zZWQgc2V0dGluZ3MgLS0tICovXG5cblx0Ly8gVGhlIGxpYnJhcnkncyBzZXR0aW5ncyBjb25maWd1cmF0aW9uIG9iamVjdC4gQ29udGFpbnMgZGVmYXVsdCBwYXJhbWV0ZXJzIGZvclxuXHQvLyBjdXJyZW5jeSBhbmQgbnVtYmVyIGZvcm1hdHRpbmdcblx0bGliLnNldHRpbmdzID0ge1xuXHRcdGN1cnJlbmN5OiB7XG5cdFx0XHRzeW1ib2wgOiBcIiRcIixcdFx0Ly8gZGVmYXVsdCBjdXJyZW5jeSBzeW1ib2wgaXMgJyQnXG5cdFx0XHRmb3JtYXQgOiBcIiVzJXZcIixcdC8vIGNvbnRyb2xzIG91dHB1dDogJXMgPSBzeW1ib2wsICV2ID0gdmFsdWUgKGNhbiBiZSBvYmplY3QsIHNlZSBkb2NzKVxuXHRcdFx0ZGVjaW1hbCA6IFwiLlwiLFx0XHQvLyBkZWNpbWFsIHBvaW50IHNlcGFyYXRvclxuXHRcdFx0dGhvdXNhbmQgOiBcIixcIixcdFx0Ly8gdGhvdXNhbmRzIHNlcGFyYXRvclxuXHRcdFx0cHJlY2lzaW9uIDogMixcdFx0Ly8gZGVjaW1hbCBwbGFjZXNcblx0XHRcdGdyb3VwaW5nIDogM1x0XHQvLyBkaWdpdCBncm91cGluZyAobm90IGltcGxlbWVudGVkIHlldClcblx0XHR9LFxuXHRcdG51bWJlcjoge1xuXHRcdFx0cHJlY2lzaW9uIDogMCxcdFx0Ly8gZGVmYXVsdCBwcmVjaXNpb24gb24gbnVtYmVycyBpcyAwXG5cdFx0XHRncm91cGluZyA6IDMsXHRcdC8vIGRpZ2l0IGdyb3VwaW5nIChub3QgaW1wbGVtZW50ZWQgeWV0KVxuXHRcdFx0dGhvdXNhbmQgOiBcIixcIixcblx0XHRcdGRlY2ltYWwgOiBcIi5cIlxuXHRcdH1cblx0fTtcblxuXG5cdC8qIC0tLSBJbnRlcm5hbCBIZWxwZXIgTWV0aG9kcyAtLS0gKi9cblxuXHQvLyBTdG9yZSByZWZlcmVuY2UgdG8gcG9zc2libHktYXZhaWxhYmxlIEVDTUFTY3JpcHQgNSBtZXRob2RzIGZvciBsYXRlclxuXHR2YXIgbmF0aXZlTWFwID0gQXJyYXkucHJvdG90eXBlLm1hcCxcblx0XHRuYXRpdmVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSxcblx0XHR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgc3RyaW5nXG5cdCAqIGZyb20gdW5kZXJzY29yZS5qc1xuXHQgKi9cblx0ZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG5cdFx0cmV0dXJuICEhKG9iaiA9PT0gJycgfHwgKG9iaiAmJiBvYmouY2hhckNvZGVBdCAmJiBvYmouc3Vic3RyKSk7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSBzdHJpbmdcblx0ICogZnJvbSB1bmRlcnNjb3JlLmpzLCBkZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBcnJheShvYmopIHtcblx0XHRyZXR1cm4gbmF0aXZlSXNBcnJheSA/IG5hdGl2ZUlzQXJyYXkob2JqKSA6IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHRydWUgb2JqZWN0XG5cdCAqL1xuXHRmdW5jdGlvbiBpc09iamVjdChvYmopIHtcblx0XHRyZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcblx0fVxuXG5cdC8qKlxuXHQgKiBFeHRlbmRzIGFuIG9iamVjdCB3aXRoIGEgZGVmYXVsdHMgb2JqZWN0LCBzaW1pbGFyIHRvIHVuZGVyc2NvcmUncyBfLmRlZmF1bHRzXG5cdCAqXG5cdCAqIFVzZWQgZm9yIGFic3RyYWN0aW5nIHBhcmFtZXRlciBoYW5kbGluZyBmcm9tIEFQSSBtZXRob2RzXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWZhdWx0cyhvYmplY3QsIGRlZnMpIHtcblx0XHR2YXIga2V5O1xuXHRcdG9iamVjdCA9IG9iamVjdCB8fCB7fTtcblx0XHRkZWZzID0gZGVmcyB8fCB7fTtcblx0XHQvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IG5vbi1wcm90b3R5cGUgcHJvcGVydGllczpcblx0XHRmb3IgKGtleSBpbiBkZWZzKSB7XG5cdFx0XHRpZiAoZGVmcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdC8vIFJlcGxhY2UgdmFsdWVzIHdpdGggZGVmYXVsdHMgb25seSBpZiB1bmRlZmluZWQgKGFsbG93IGVtcHR5L3plcm8gdmFsdWVzKTpcblx0XHRcdFx0aWYgKG9iamVjdFtrZXldID09IG51bGwpIG9iamVjdFtrZXldID0gZGVmc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEltcGxlbWVudGF0aW9uIG9mIGBBcnJheS5tYXAoKWAgZm9yIGl0ZXJhdGlvbiBsb29wc1xuXHQgKlxuXHQgKiBSZXR1cm5zIGEgbmV3IEFycmF5IGFzIGEgcmVzdWx0IG9mIGNhbGxpbmcgYGl0ZXJhdG9yYCBvbiBlYWNoIGFycmF5IHZhbHVlLlxuXHQgKiBEZWZlcnMgdG8gbmF0aXZlIEFycmF5Lm1hcCBpZiBhdmFpbGFibGVcblx0ICovXG5cdGZ1bmN0aW9uIG1hcChvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG5cdFx0dmFyIHJlc3VsdHMgPSBbXSwgaSwgajtcblxuXHRcdGlmICghb2JqKSByZXR1cm4gcmVzdWx0cztcblxuXHRcdC8vIFVzZSBuYXRpdmUgLm1hcCBtZXRob2QgaWYgaXQgZXhpc3RzOlxuXHRcdGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG5cblx0XHQvLyBGYWxsYmFjayBmb3IgbmF0aXZlIC5tYXA6XG5cdFx0Zm9yIChpID0gMCwgaiA9IG9iai5sZW5ndGg7IGkgPCBqOyBpKysgKSB7XG5cdFx0XHRyZXN1bHRzW2ldID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaik7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGFuZCBub3JtYWxpc2UgdGhlIHZhbHVlIG9mIHByZWNpc2lvbiAobXVzdCBiZSBwb3NpdGl2ZSBpbnRlZ2VyKVxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tQcmVjaXNpb24odmFsLCBiYXNlKSB7XG5cdFx0dmFsID0gTWF0aC5yb3VuZChNYXRoLmFicyh2YWwpKTtcblx0XHRyZXR1cm4gaXNOYU4odmFsKT8gYmFzZSA6IHZhbDtcblx0fVxuXG5cblx0LyoqXG5cdCAqIFBhcnNlcyBhIGZvcm1hdCBzdHJpbmcgb3Igb2JqZWN0IGFuZCByZXR1cm5zIGZvcm1hdCBvYmogZm9yIHVzZSBpbiByZW5kZXJpbmdcblx0ICpcblx0ICogYGZvcm1hdGAgaXMgZWl0aGVyIGEgc3RyaW5nIHdpdGggdGhlIGRlZmF1bHQgKHBvc2l0aXZlKSBmb3JtYXQsIG9yIG9iamVjdFxuXHQgKiBjb250YWluaW5nIGBwb3NgIChyZXF1aXJlZCksIGBuZWdgIGFuZCBgemVyb2AgdmFsdWVzIChvciBhIGZ1bmN0aW9uIHJldHVybmluZ1xuXHQgKiBlaXRoZXIgYSBzdHJpbmcgb3Igb2JqZWN0KVxuXHQgKlxuXHQgKiBFaXRoZXIgc3RyaW5nIG9yIGZvcm1hdC5wb3MgbXVzdCBjb250YWluIFwiJXZcIiAodmFsdWUpIHRvIGJlIHZhbGlkXG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja0N1cnJlbmN5Rm9ybWF0KGZvcm1hdCkge1xuXHRcdHZhciBkZWZhdWx0cyA9IGxpYi5zZXR0aW5ncy5jdXJyZW5jeS5mb3JtYXQ7XG5cblx0XHQvLyBBbGxvdyBmdW5jdGlvbiBhcyBmb3JtYXQgcGFyYW1ldGVyIChzaG91bGQgcmV0dXJuIHN0cmluZyBvciBvYmplY3QpOlxuXHRcdGlmICggdHlwZW9mIGZvcm1hdCA9PT0gXCJmdW5jdGlvblwiICkgZm9ybWF0ID0gZm9ybWF0KCk7XG5cblx0XHQvLyBGb3JtYXQgY2FuIGJlIGEgc3RyaW5nLCBpbiB3aGljaCBjYXNlIGB2YWx1ZWAgKFwiJXZcIikgbXVzdCBiZSBwcmVzZW50OlxuXHRcdGlmICggaXNTdHJpbmcoIGZvcm1hdCApICYmIGZvcm1hdC5tYXRjaChcIiV2XCIpICkge1xuXG5cdFx0XHQvLyBDcmVhdGUgYW5kIHJldHVybiBwb3NpdGl2ZSwgbmVnYXRpdmUgYW5kIHplcm8gZm9ybWF0czpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHBvcyA6IGZvcm1hdCxcblx0XHRcdFx0bmVnIDogZm9ybWF0LnJlcGxhY2UoXCItXCIsIFwiXCIpLnJlcGxhY2UoXCIldlwiLCBcIi0ldlwiKSxcblx0XHRcdFx0emVybyA6IGZvcm1hdFxuXHRcdFx0fTtcblxuXHRcdC8vIElmIG5vIGZvcm1hdCwgb3Igb2JqZWN0IGlzIG1pc3NpbmcgdmFsaWQgcG9zaXRpdmUgdmFsdWUsIHVzZSBkZWZhdWx0czpcblx0XHR9IGVsc2UgaWYgKCAhZm9ybWF0IHx8ICFmb3JtYXQucG9zIHx8ICFmb3JtYXQucG9zLm1hdGNoKFwiJXZcIikgKSB7XG5cblx0XHRcdC8vIElmIGRlZmF1bHRzIGlzIGEgc3RyaW5nLCBjYXN0cyBpdCB0byBhbiBvYmplY3QgZm9yIGZhc3RlciBjaGVja2luZyBuZXh0IHRpbWU6XG5cdFx0XHRyZXR1cm4gKCAhaXNTdHJpbmcoIGRlZmF1bHRzICkgKSA/IGRlZmF1bHRzIDogbGliLnNldHRpbmdzLmN1cnJlbmN5LmZvcm1hdCA9IHtcblx0XHRcdFx0cG9zIDogZGVmYXVsdHMsXG5cdFx0XHRcdG5lZyA6IGRlZmF1bHRzLnJlcGxhY2UoXCIldlwiLCBcIi0ldlwiKSxcblx0XHRcdFx0emVybyA6IGRlZmF1bHRzXG5cdFx0XHR9O1xuXG5cdFx0fVxuXHRcdC8vIE90aGVyd2lzZSwgYXNzdW1lIGZvcm1hdCB3YXMgZmluZTpcblx0XHRyZXR1cm4gZm9ybWF0O1xuXHR9XG5cblxuXHQvKiAtLS0gQVBJIE1ldGhvZHMgLS0tICovXG5cblx0LyoqXG5cdCAqIFRha2VzIGEgc3RyaW5nL2FycmF5IG9mIHN0cmluZ3MsIHJlbW92ZXMgYWxsIGZvcm1hdHRpbmcvY3J1ZnQgYW5kIHJldHVybnMgdGhlIHJhdyBmbG9hdCB2YWx1ZVxuXHQgKiBhbGlhczogYWNjb3VudGluZy5gcGFyc2Uoc3RyaW5nKWBcblx0ICpcblx0ICogRGVjaW1hbCBtdXN0IGJlIGluY2x1ZGVkIGluIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWF0Y2ggZmxvYXRzIChkZWZhdWx0OiBcIi5cIiksIHNvIGlmIHRoZSBudW1iZXJcblx0ICogdXNlcyBhIG5vbi1zdGFuZGFyZCBkZWNpbWFsIHNlcGFyYXRvciwgcHJvdmlkZSBpdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHQgKlxuXHQgKiBBbHNvIG1hdGNoZXMgYnJhY2tldGVkIG5lZ2F0aXZlcyAoZWcuIFwiJCAoMS45OSlcIiA9PiAtMS45OSlcblx0ICpcblx0ICogRG9lc24ndCB0aHJvdyBhbnkgZXJyb3JzIChgTmFOYHMgYmVjb21lIDApIGJ1dCB0aGlzIG1heSBjaGFuZ2UgaW4gZnV0dXJlXG5cdCAqL1xuXHR2YXIgdW5mb3JtYXQgPSBsaWIudW5mb3JtYXQgPSBsaWIucGFyc2UgPSBmdW5jdGlvbih2YWx1ZSwgZGVjaW1hbCkge1xuXHRcdC8vIFJlY3Vyc2l2ZWx5IHVuZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdHJldHVybiBtYXAodmFsdWUsIGZ1bmN0aW9uKHZhbCkge1xuXHRcdFx0XHRyZXR1cm4gdW5mb3JtYXQodmFsLCBkZWNpbWFsKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIEZhaWxzIHNpbGVudGx5IChuZWVkIGRlY2VudCBlcnJvcnMpOlxuXHRcdHZhbHVlID0gdmFsdWUgfHwgMDtcblxuXHRcdC8vIFJldHVybiB0aGUgdmFsdWUgYXMtaXMgaWYgaXQncyBhbHJlYWR5IGEgbnVtYmVyOlxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHJldHVybiB2YWx1ZTtcblxuXHRcdC8vIERlZmF1bHQgZGVjaW1hbCBwb2ludCBpcyBcIi5cIiBidXQgY291bGQgYmUgc2V0IHRvIGVnLiBcIixcIiBpbiBvcHRzOlxuXHRcdGRlY2ltYWwgPSBkZWNpbWFsIHx8IFwiLlwiO1xuXG5cdFx0IC8vIEJ1aWxkIHJlZ2V4IHRvIHN0cmlwIG91dCBldmVyeXRoaW5nIGV4Y2VwdCBkaWdpdHMsIGRlY2ltYWwgcG9pbnQgYW5kIG1pbnVzIHNpZ246XG5cdFx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlteMC05LVwiICsgZGVjaW1hbCArIFwiXVwiLCBbXCJnXCJdKSxcblx0XHRcdHVuZm9ybWF0dGVkID0gcGFyc2VGbG9hdChcblx0XHRcdFx0KFwiXCIgKyB2YWx1ZSlcblx0XHRcdFx0LnJlcGxhY2UoL1xcKCguKilcXCkvLCBcIi0kMVwiKSAvLyByZXBsYWNlIGJyYWNrZXRlZCB2YWx1ZXMgd2l0aCBuZWdhdGl2ZXNcblx0XHRcdFx0LnJlcGxhY2UocmVnZXgsICcnKSAgICAgICAgIC8vIHN0cmlwIG91dCBhbnkgY3J1ZnRcblx0XHRcdFx0LnJlcGxhY2UoZGVjaW1hbCwgJy4nKSAgICAgIC8vIG1ha2Ugc3VyZSBkZWNpbWFsIHBvaW50IGlzIHN0YW5kYXJkXG5cdFx0XHQpO1xuXG5cdFx0Ly8gVGhpcyB3aWxsIGZhaWwgc2lsZW50bHkgd2hpY2ggbWF5IGNhdXNlIHRyb3VibGUsIGxldCdzIHdhaXQgYW5kIHNlZTpcblx0XHRyZXR1cm4gIWlzTmFOKHVuZm9ybWF0dGVkKSA/IHVuZm9ybWF0dGVkIDogMDtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRhdGlvbiBvZiB0b0ZpeGVkKCkgdGhhdCB0cmVhdHMgZmxvYXRzIG1vcmUgbGlrZSBkZWNpbWFsc1xuXHQgKlxuXHQgKiBGaXhlcyBiaW5hcnkgcm91bmRpbmcgaXNzdWVzIChlZy4gKDAuNjE1KS50b0ZpeGVkKDIpID09PSBcIjAuNjFcIikgdGhhdCBwcmVzZW50XG5cdCAqIHByb2JsZW1zIGZvciBhY2NvdW50aW5nLSBhbmQgZmluYW5jZS1yZWxhdGVkIHNvZnR3YXJlLlxuXHQgKi9cblx0dmFyIHRvRml4ZWQgPSBsaWIudG9GaXhlZCA9IGZ1bmN0aW9uKHZhbHVlLCBwcmVjaXNpb24pIHtcblx0XHRwcmVjaXNpb24gPSBjaGVja1ByZWNpc2lvbihwcmVjaXNpb24sIGxpYi5zZXR0aW5ncy5udW1iZXIucHJlY2lzaW9uKTtcblx0XHR2YXIgcG93ZXIgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcblxuXHRcdC8vIE11bHRpcGx5IHVwIGJ5IHByZWNpc2lvbiwgcm91bmQgYWNjdXJhdGVseSwgdGhlbiBkaXZpZGUgYW5kIHVzZSBuYXRpdmUgdG9GaXhlZCgpOlxuXHRcdHJldHVybiAoTWF0aC5yb3VuZChsaWIudW5mb3JtYXQodmFsdWUpICogcG93ZXIpIC8gcG93ZXIpLnRvRml4ZWQocHJlY2lzaW9uKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBudW1iZXIsIHdpdGggY29tbWEtc2VwYXJhdGVkIHRob3VzYW5kcyBhbmQgY3VzdG9tIHByZWNpc2lvbi9kZWNpbWFsIHBsYWNlc1xuXHQgKlxuXHQgKiBMb2NhbGlzZSBieSBvdmVycmlkaW5nIHRoZSBwcmVjaXNpb24gYW5kIHRob3VzYW5kIC8gZGVjaW1hbCBzZXBhcmF0b3JzXG5cdCAqIDJuZCBwYXJhbWV0ZXIgYHByZWNpc2lvbmAgY2FuIGJlIGFuIG9iamVjdCBtYXRjaGluZyBgc2V0dGluZ3MubnVtYmVyYFxuXHQgKi9cblx0dmFyIGZvcm1hdE51bWJlciA9IGxpYi5mb3JtYXROdW1iZXIgPSBmdW5jdGlvbihudW1iZXIsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwpIHtcblx0XHQvLyBSZXN1cnNpdmVseSBmb3JtYXQgYXJyYXlzOlxuXHRcdGlmIChpc0FycmF5KG51bWJlcikpIHtcblx0XHRcdHJldHVybiBtYXAobnVtYmVyLCBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0cmV0dXJuIGZvcm1hdE51bWJlcih2YWwsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgbnVtYmVyOlxuXHRcdG51bWJlciA9IHVuZm9ybWF0KG51bWJlcik7XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHByZWNpc2lvbikgPyBwcmVjaXNpb24gOiB7XG5cdFx0XHRcdFx0cHJlY2lzaW9uIDogcHJlY2lzaW9uLFxuXHRcdFx0XHRcdHRob3VzYW5kIDogdGhvdXNhbmQsXG5cdFx0XHRcdFx0ZGVjaW1hbCA6IGRlY2ltYWxcblx0XHRcdFx0fSksXG5cdFx0XHRcdGxpYi5zZXR0aW5ncy5udW1iZXJcblx0XHRcdCksXG5cblx0XHRcdC8vIENsZWFuIHVwIHByZWNpc2lvblxuXHRcdFx0dXNlUHJlY2lzaW9uID0gY2hlY2tQcmVjaXNpb24ob3B0cy5wcmVjaXNpb24pLFxuXG5cdFx0XHQvLyBEbyBzb21lIGNhbGM6XG5cdFx0XHRuZWdhdGl2ZSA9IG51bWJlciA8IDAgPyBcIi1cIiA6IFwiXCIsXG5cdFx0XHRiYXNlID0gcGFyc2VJbnQodG9GaXhlZChNYXRoLmFicyhudW1iZXIgfHwgMCksIHVzZVByZWNpc2lvbiksIDEwKSArIFwiXCIsXG5cdFx0XHRtb2QgPSBiYXNlLmxlbmd0aCA+IDMgPyBiYXNlLmxlbmd0aCAlIDMgOiAwO1xuXG5cdFx0Ly8gRm9ybWF0IHRoZSBudW1iZXI6XG5cdFx0cmV0dXJuIG5lZ2F0aXZlICsgKG1vZCA/IGJhc2Uuc3Vic3RyKDAsIG1vZCkgKyBvcHRzLnRob3VzYW5kIDogXCJcIikgKyBiYXNlLnN1YnN0cihtb2QpLnJlcGxhY2UoLyhcXGR7M30pKD89XFxkKS9nLCBcIiQxXCIgKyBvcHRzLnRob3VzYW5kKSArICh1c2VQcmVjaXNpb24gPyBvcHRzLmRlY2ltYWwgKyB0b0ZpeGVkKE1hdGguYWJzKG51bWJlciksIHVzZVByZWNpc2lvbikuc3BsaXQoJy4nKVsxXSA6IFwiXCIpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEZvcm1hdCBhIG51bWJlciBpbnRvIGN1cnJlbmN5XG5cdCAqXG5cdCAqIFVzYWdlOiBhY2NvdW50aW5nLmZvcm1hdE1vbmV5KG51bWJlciwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kc1NlcCwgZGVjaW1hbFNlcCwgZm9ybWF0KVxuXHQgKiBkZWZhdWx0czogKDAsIFwiJFwiLCAyLCBcIixcIiwgXCIuXCIsIFwiJXMldlwiKVxuXHQgKlxuXHQgKiBMb2NhbGlzZSBieSBvdmVycmlkaW5nIHRoZSBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQgLyBkZWNpbWFsIHNlcGFyYXRvcnMgYW5kIGZvcm1hdFxuXHQgKiBTZWNvbmQgcGFyYW0gY2FuIGJlIGFuIG9iamVjdCBtYXRjaGluZyBgc2V0dGluZ3MuY3VycmVuY3lgIHdoaWNoIGlzIHRoZSBlYXNpZXN0IHdheS5cblx0ICpcblx0ICogVG8gZG86IHRpZHkgdXAgdGhlIHBhcmFtZXRlcnNcblx0ICovXG5cdHZhciBmb3JtYXRNb25leSA9IGxpYi5mb3JtYXRNb25leSA9IGZ1bmN0aW9uKG51bWJlciwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpIHtcblx0XHQvLyBSZXN1cnNpdmVseSBmb3JtYXQgYXJyYXlzOlxuXHRcdGlmIChpc0FycmF5KG51bWJlcikpIHtcblx0XHRcdHJldHVybiBtYXAobnVtYmVyLCBmdW5jdGlvbih2YWwpe1xuXHRcdFx0XHRyZXR1cm4gZm9ybWF0TW9uZXkodmFsLCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwsIGZvcm1hdCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBDbGVhbiB1cCBudW1iZXI6XG5cdFx0bnVtYmVyID0gdW5mb3JtYXQobnVtYmVyKTtcblxuXHRcdC8vIEJ1aWxkIG9wdGlvbnMgb2JqZWN0IGZyb20gc2Vjb25kIHBhcmFtIChpZiBvYmplY3QpIG9yIGFsbCBwYXJhbXMsIGV4dGVuZGluZyBkZWZhdWx0czpcblx0XHR2YXIgb3B0cyA9IGRlZmF1bHRzKFxuXHRcdFx0XHQoaXNPYmplY3Qoc3ltYm9sKSA/IHN5bWJvbCA6IHtcblx0XHRcdFx0XHRzeW1ib2wgOiBzeW1ib2wsXG5cdFx0XHRcdFx0cHJlY2lzaW9uIDogcHJlY2lzaW9uLFxuXHRcdFx0XHRcdHRob3VzYW5kIDogdGhvdXNhbmQsXG5cdFx0XHRcdFx0ZGVjaW1hbCA6IGRlY2ltYWwsXG5cdFx0XHRcdFx0Zm9ybWF0IDogZm9ybWF0XG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MuY3VycmVuY3lcblx0XHRcdCksXG5cblx0XHRcdC8vIENoZWNrIGZvcm1hdCAocmV0dXJucyBvYmplY3Qgd2l0aCBwb3MsIG5lZyBhbmQgemVybyk6XG5cdFx0XHRmb3JtYXRzID0gY2hlY2tDdXJyZW5jeUZvcm1hdChvcHRzLmZvcm1hdCksXG5cblx0XHRcdC8vIENob29zZSB3aGljaCBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIHZhbHVlOlxuXHRcdFx0dXNlRm9ybWF0ID0gbnVtYmVyID4gMCA/IGZvcm1hdHMucG9zIDogbnVtYmVyIDwgMCA/IGZvcm1hdHMubmVnIDogZm9ybWF0cy56ZXJvO1xuXG5cdFx0Ly8gUmV0dXJuIHdpdGggY3VycmVuY3kgc3ltYm9sIGFkZGVkOlxuXHRcdHJldHVybiB1c2VGb3JtYXQucmVwbGFjZSgnJXMnLCBvcHRzLnN5bWJvbCkucmVwbGFjZSgnJXYnLCBmb3JtYXROdW1iZXIoTWF0aC5hYnMobnVtYmVyKSwgY2hlY2tQcmVjaXNpb24ob3B0cy5wcmVjaXNpb24pLCBvcHRzLnRob3VzYW5kLCBvcHRzLmRlY2ltYWwpKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBsaXN0IG9mIG51bWJlcnMgaW50byBhbiBhY2NvdW50aW5nIGNvbHVtbiwgcGFkZGluZyB3aXRoIHdoaXRlc3BhY2Vcblx0ICogdG8gbGluZSB1cCBjdXJyZW5jeSBzeW1ib2xzLCB0aG91c2FuZCBzZXBhcmF0b3JzIGFuZCBkZWNpbWFscyBwbGFjZXNcblx0ICpcblx0ICogTGlzdCBzaG91bGQgYmUgYW4gYXJyYXkgb2YgbnVtYmVyc1xuXHQgKiBTZWNvbmQgcGFyYW1ldGVyIGNhbiBiZSBhbiBvYmplY3QgY29udGFpbmluZyBrZXlzIHRoYXQgbWF0Y2ggdGhlIHBhcmFtc1xuXHQgKlxuXHQgKiBSZXR1cm5zIGFycmF5IG9mIGFjY291dGluZy1mb3JtYXR0ZWQgbnVtYmVyIHN0cmluZ3Mgb2Ygc2FtZSBsZW5ndGhcblx0ICpcblx0ICogTkI6IGB3aGl0ZS1zcGFjZTpwcmVgIENTUyBydWxlIGlzIHJlcXVpcmVkIG9uIHRoZSBsaXN0IGNvbnRhaW5lciB0byBwcmV2ZW50XG5cdCAqIGJyb3dzZXJzIGZyb20gY29sbGFwc2luZyB0aGUgd2hpdGVzcGFjZSBpbiB0aGUgb3V0cHV0IHN0cmluZ3MuXG5cdCAqL1xuXHRsaWIuZm9ybWF0Q29sdW1uID0gZnVuY3Rpb24obGlzdCwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpIHtcblx0XHRpZiAoIWxpc3QpIHJldHVybiBbXTtcblxuXHRcdC8vIEJ1aWxkIG9wdGlvbnMgb2JqZWN0IGZyb20gc2Vjb25kIHBhcmFtIChpZiBvYmplY3QpIG9yIGFsbCBwYXJhbXMsIGV4dGVuZGluZyBkZWZhdWx0czpcblx0XHR2YXIgb3B0cyA9IGRlZmF1bHRzKFxuXHRcdFx0XHQoaXNPYmplY3Qoc3ltYm9sKSA/IHN5bWJvbCA6IHtcblx0XHRcdFx0XHRzeW1ib2wgOiBzeW1ib2wsXG5cdFx0XHRcdFx0cHJlY2lzaW9uIDogcHJlY2lzaW9uLFxuXHRcdFx0XHRcdHRob3VzYW5kIDogdGhvdXNhbmQsXG5cdFx0XHRcdFx0ZGVjaW1hbCA6IGRlY2ltYWwsXG5cdFx0XHRcdFx0Zm9ybWF0IDogZm9ybWF0XG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MuY3VycmVuY3lcblx0XHRcdCksXG5cblx0XHRcdC8vIENoZWNrIGZvcm1hdCAocmV0dXJucyBvYmplY3Qgd2l0aCBwb3MsIG5lZyBhbmQgemVybyksIG9ubHkgbmVlZCBwb3MgZm9yIG5vdzpcblx0XHRcdGZvcm1hdHMgPSBjaGVja0N1cnJlbmN5Rm9ybWF0KG9wdHMuZm9ybWF0KSxcblxuXHRcdFx0Ly8gV2hldGhlciB0byBwYWQgYXQgc3RhcnQgb2Ygc3RyaW5nIG9yIGFmdGVyIGN1cnJlbmN5IHN5bWJvbDpcblx0XHRcdHBhZEFmdGVyU3ltYm9sID0gZm9ybWF0cy5wb3MuaW5kZXhPZihcIiVzXCIpIDwgZm9ybWF0cy5wb3MuaW5kZXhPZihcIiV2XCIpID8gdHJ1ZSA6IGZhbHNlLFxuXG5cdFx0XHQvLyBTdG9yZSB2YWx1ZSBmb3IgdGhlIGxlbmd0aCBvZiB0aGUgbG9uZ2VzdCBzdHJpbmcgaW4gdGhlIGNvbHVtbjpcblx0XHRcdG1heExlbmd0aCA9IDAsXG5cblx0XHRcdC8vIEZvcm1hdCB0aGUgbGlzdCBhY2NvcmRpbmcgdG8gb3B0aW9ucywgc3RvcmUgdGhlIGxlbmd0aCBvZiB0aGUgbG9uZ2VzdCBzdHJpbmc6XG5cdFx0XHRmb3JtYXR0ZWQgPSBtYXAobGlzdCwgZnVuY3Rpb24odmFsLCBpKSB7XG5cdFx0XHRcdGlmIChpc0FycmF5KHZhbCkpIHtcblx0XHRcdFx0XHQvLyBSZWN1cnNpdmVseSBmb3JtYXQgY29sdW1ucyBpZiBsaXN0IGlzIGEgbXVsdGktZGltZW5zaW9uYWwgYXJyYXk6XG5cdFx0XHRcdFx0cmV0dXJuIGxpYi5mb3JtYXRDb2x1bW4odmFsLCBvcHRzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBDbGVhbiB1cCB0aGUgdmFsdWVcblx0XHRcdFx0XHR2YWwgPSB1bmZvcm1hdCh2YWwpO1xuXG5cdFx0XHRcdFx0Ly8gQ2hvb3NlIHdoaWNoIGZvcm1hdCB0byB1c2UgZm9yIHRoaXMgdmFsdWUgKHBvcywgbmVnIG9yIHplcm8pOlxuXHRcdFx0XHRcdHZhciB1c2VGb3JtYXQgPSB2YWwgPiAwID8gZm9ybWF0cy5wb3MgOiB2YWwgPCAwID8gZm9ybWF0cy5uZWcgOiBmb3JtYXRzLnplcm8sXG5cblx0XHRcdFx0XHRcdC8vIEZvcm1hdCB0aGlzIHZhbHVlLCBwdXNoIGludG8gZm9ybWF0dGVkIGxpc3QgYW5kIHNhdmUgdGhlIGxlbmd0aDpcblx0XHRcdFx0XHRcdGZWYWwgPSB1c2VGb3JtYXQucmVwbGFjZSgnJXMnLCBvcHRzLnN5bWJvbCkucmVwbGFjZSgnJXYnLCBmb3JtYXROdW1iZXIoTWF0aC5hYnModmFsKSwgY2hlY2tQcmVjaXNpb24ob3B0cy5wcmVjaXNpb24pLCBvcHRzLnRob3VzYW5kLCBvcHRzLmRlY2ltYWwpKTtcblxuXHRcdFx0XHRcdGlmIChmVmFsLmxlbmd0aCA+IG1heExlbmd0aCkgbWF4TGVuZ3RoID0gZlZhbC5sZW5ndGg7XG5cdFx0XHRcdFx0cmV0dXJuIGZWYWw7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0Ly8gUGFkIGVhY2ggbnVtYmVyIGluIHRoZSBsaXN0IGFuZCBzZW5kIGJhY2sgdGhlIGNvbHVtbiBvZiBudW1iZXJzOlxuXHRcdHJldHVybiBtYXAoZm9ybWF0dGVkLCBmdW5jdGlvbih2YWwsIGkpIHtcblx0XHRcdC8vIE9ubHkgaWYgdGhpcyBpcyBhIHN0cmluZyAobm90IGEgbmVzdGVkIGFycmF5LCB3aGljaCB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBwYWRkZWQpOlxuXHRcdFx0aWYgKGlzU3RyaW5nKHZhbCkgJiYgdmFsLmxlbmd0aCA8IG1heExlbmd0aCkge1xuXHRcdFx0XHQvLyBEZXBlbmRpbmcgb24gc3ltYm9sIHBvc2l0aW9uLCBwYWQgYWZ0ZXIgc3ltYm9sIG9yIGF0IGluZGV4IDA6XG5cdFx0XHRcdHJldHVybiBwYWRBZnRlclN5bWJvbCA/IHZhbC5yZXBsYWNlKG9wdHMuc3ltYm9sLCBvcHRzLnN5bWJvbCsobmV3IEFycmF5KG1heExlbmd0aCAtIHZhbC5sZW5ndGggKyAxKS5qb2luKFwiIFwiKSkpIDogKG5ldyBBcnJheShtYXhMZW5ndGggLSB2YWwubGVuZ3RoICsgMSkuam9pbihcIiBcIikpICsgdmFsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9KTtcblx0fTtcblxuXG5cdC8qIC0tLSBNb2R1bGUgRGVmaW5pdGlvbiAtLS0gKi9cblxuXHQvLyBFeHBvcnQgYWNjb3VudGluZyBmb3IgQ29tbW9uSlMuIElmIGJlaW5nIGxvYWRlZCBhcyBhbiBBTUQgbW9kdWxlLCBkZWZpbmUgaXQgYXMgc3VjaC5cblx0Ly8gT3RoZXJ3aXNlLCBqdXN0IGFkZCBgYWNjb3VudGluZ2AgdG8gdGhlIGdsb2JhbCBvYmplY3Rcblx0aWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdFx0ZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbGliO1xuXHRcdH1cblx0XHRleHBvcnRzLmFjY291bnRpbmcgPSBsaWI7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gUmV0dXJuIHRoZSBsaWJyYXJ5IGFzIGFuIEFNRCBtb2R1bGU6XG5cdFx0ZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBsaWI7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gVXNlIGFjY291bnRpbmcubm9Db25mbGljdCB0byByZXN0b3JlIGBhY2NvdW50aW5nYCBiYWNrIHRvIGl0cyBvcmlnaW5hbCB2YWx1ZS5cblx0XHQvLyBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBsaWJyYXJ5J3MgYGFjY291bnRpbmdgIG9iamVjdDtcblx0XHQvLyBlLmcuIGB2YXIgbnVtYmVycyA9IGFjY291bnRpbmcubm9Db25mbGljdCgpO2Bcblx0XHRsaWIubm9Db25mbGljdCA9IChmdW5jdGlvbihvbGRBY2NvdW50aW5nKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIFJlc2V0IHRoZSB2YWx1ZSBvZiB0aGUgcm9vdCdzIGBhY2NvdW50aW5nYCB2YXJpYWJsZTpcblx0XHRcdFx0cm9vdC5hY2NvdW50aW5nID0gb2xkQWNjb3VudGluZztcblx0XHRcdFx0Ly8gRGVsZXRlIHRoZSBub0NvbmZsaWN0IG1ldGhvZDpcblx0XHRcdFx0bGliLm5vQ29uZmxpY3QgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdC8vIFJldHVybiByZWZlcmVuY2UgdG8gdGhlIGxpYnJhcnkgdG8gcmUtYXNzaWduIGl0OlxuXHRcdFx0XHRyZXR1cm4gbGliO1xuXHRcdFx0fTtcblx0XHR9KShyb290LmFjY291bnRpbmcpO1xuXG5cdFx0Ly8gRGVjbGFyZSBgZnhgIG9uIHRoZSByb290IChnbG9iYWwvd2luZG93KSBvYmplY3Q6XG5cdFx0cm9vdFsnYWNjb3VudGluZyddID0gbGliO1xuXHR9XG5cblx0Ly8gUm9vdCB3aWxsIGJlIGB3aW5kb3dgIGluIGJyb3dzZXIgb3IgYGdsb2JhbGAgb24gdGhlIHNlcnZlcjpcbn0odGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzXG4vLyBtb2R1bGUgaWQgPSA3MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgNSA2IDcgMTAiLCIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXG4gICAgUSA9IHJlcXVpcmUoJ3EnKVxuICAgIDtcblxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKVxuICAgIDtcblxudmFyIEF1dGggPSBGb3JtLmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sJyksXG5cbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2xvZ2luJyxcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgZm9yZ290dGVucGFzczogZmFsc2UsXG5cbiAgICAgICAgICAgIHVzZXI6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5nZXQoJ3BvcHVwJykpIHtcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnJywgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoLycgKyB0aGlzLmdldCgnYWN0aW9uJyksXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB0aGlzLmdldCgndXNlci5sb2dpbicpLCBwYXNzd29yZDogdGhpcy5nZXQoJ3VzZXIucGFzc3dvcmQnKSB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuZGVmZXJyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5kZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cdFx0XHRcdFx0aWYocmVzcG9uc2UuZXJyb3JzWyd1c2VybmFtZSddWzBdPT1cIllvdSBhcmUgYWxyZWFkeSBvdXIgQjJCIHVzZXIuXCIpIHtcblx0XHRcdFx0XHRcdCQoXCIjQjJCVXNlclBvcHVwXCIpLmhpZGUoKTtcblx0XHRcdFx0XHRcdCQoXCIubG9naW4gLmhlYWRlclwiKS5odG1sKCdCMkIgVXNlciBMb2dpbicpO1xuXHRcdFx0XHRcdFx0dmlldy5zZXQoJ0IyQlVzZXJMb2dpblBvcHVwTWVzc2FnZScsdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodmlldy5nZXQoJ3BvcHVwJyk9PW51bGwgJiYgZGF0YSAmJiBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVzZXRQYXNzd29yZDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL2ZvcmdvdHRlbnBhc3MnLFxuICAgICAgICAgICAgZGF0YTogeyBlbWFpbDogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Jlc2V0c3VjY2VzcycsIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbcmVzcG9uc2UubWVzc2FnZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2lnbnVwOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL3NpZ251cCcsXG4gICAgICAgICAgICBkYXRhOiBfLnBpY2sodGhpcy5nZXQoJ3VzZXInKSwgWydlbWFpbCcsJ25hbWUnLCAnbW9iaWxlJywgJ3Bhc3N3b3JkJywgJ3Bhc3N3b3JkMiddKSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzaWdudXBzdWNjZXNzJywgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cbkF1dGgubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XG5cbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGF1dGgucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XG5cbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xufTtcblxuQXV0aC5zaWdudXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XG5cbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcbiAgICBhdXRoLnNldCgnc2lnbnVwJywgdHJ1ZSk7XG4gICAgYXV0aC5kZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xuXG4gICAgcmV0dXJuIGF1dGguZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanNcbi8vIG1vZHVsZSBpZCA9IDgwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDMgNCA1IDYgNyAxMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9sZXNzL3dlYi9tb2R1bGVzL215Ym9va2luZ3MvbXlib29raW5ncy5sZXNzXG4vLyBtb2R1bGUgaWQgPSAxMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDciLCIndXNlIHN0cmljdCc7XG5cbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXG4gICAgICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXG4gICAgICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxuICAgICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXG4gICAgICAgIGFjY291bnRpbmcgPSByZXF1aXJlKCdhY2NvdW50aW5nLmpzJylcbiAgICAgICAgLy9NeXRyYXZlbGxlciA9IHJlcXVpcmUoJ2FwcC9zdG9yZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXInKSAgIDtcbiAgICAgICAgO1xuXG5cbnZhciB0Mm0gPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHZhciBpID0gdGltZS5zcGxpdCgnOicpO1xuXG4gICAgcmV0dXJuIGlbMF0gKiA2MCArIGlbMV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215Ym9va2luZ3MvZGV0YWlscy5odG1sJyksXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbWFpbDogZmFsc2UsXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGZvcm1hdEJpcnRoRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9tZW50LmlzTW9tZW50KGRhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0VGl0bGU6IGZ1bmN0aW9uICh0aXRsZSkge1xuICAgICAgICAgICAgICAgIHZhciB0aXRsZXMgPSB0aGlzLmdldCgnbWV0YScpLmdldCgndGl0bGVzJyk7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aXRsZXMpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRpdGxlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gIF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiB0aXRsZX0pLCAnbmFtZScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdE5hbWU6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0cmluZyA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdFRyYXZlbERhdGUyOiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIE1NTSBEIFlZWVknKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdFRyYXZlbERhdGUzOiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIEhIOm1tJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmF2ZWxsZXJCb29raW5nU3RhdHVzOiBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbmZpcm0nO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdub3Rjb25maXJtJztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmF2ZWxsZXJCb29raW5nU3RhdHVzTWVzc2FnZTogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb25maXJtZWQnO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3QgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYWJib29raW5nU3RhdHVzJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAgXy5yZXN1bHQoXy5maW5kKHN0LCB7J2lkJzogc3RhdHVzfSksICduYW1lJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpZmY6IGZ1bmN0aW9uIChlbmQsIHN0YXJ0KSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXMgPSBtb21lbnQoZW5kLCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZGlmZihtb21lbnQoc3RhcnQsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKSk7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSBtb21lbnQuZHVyYXRpb24obXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKGQuYXNIb3VycygpKSArICdoICcgKyBkLm1pbnV0ZXMoKSArICdtJztcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzczogZnVuY3Rpb24gKGJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJzID09IDEgfHwgYnMgPT0gMiB8fCBicyA9PSAzIHx8ICBicyA9PSA3KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJwcm9ncmVzc1wiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJzID09IDQgfHwgYnMgPT0gNSB8fCBicyA9PSA2IHx8IGJzID09IDEyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjYW5jZWxsZWRcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTEpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJvb2tlZFwiO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0Qm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChicykge1xuICAgICAgICAgICAgICAgIHZhciBia3MgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYm9va2luZ1N0YXR1cycpO1xuICAgICAgICAgICAgICAgIHJldHVybiAgXy5yZXN1bHQoXy5maW5kKGJrcywgeydpZCc6IGJzfSksICduYW1lJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udmVydDogZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2NvdW50aW5nLmZvcm1hdE1vbmV5KGFtb3VudCwgJycsIDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnZlcnRJeGlnbzogZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2NvdW50aW5nLnVuZm9ybWF0KGFjY291bnRpbmcuZm9ybWF0TW9uZXkoYW1vdW50LCAnJywgMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuICAgIHRvZ2dsZWVtYWlsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1c2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAodGhpcy5nZXQoJ3N1Ym1pdHRpbmcnKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGVtYWlsID0gdGhpcy5nZXQoJ21ldGEudXNlci5lbWFpbCcpO1xuICAgICAgICAvL3RoaXMuc2V0KCdlbWFpbCcsIGVtYWlsKTtcbiAgICAgICAgJCgnI2VtYWlsJykudmFsKGVtYWlsKTtcbiAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgLy8gdGhpcy5zaWduaW4oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25pbml0OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9uKCdiYWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRVUkwuaW5kZXhPZihcIm15Ym9va2luZ3MvXCIpID4gLTEpXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MnO1xuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwibXlib29raW5nc1wiKSA+IC0xKVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdzdW1tYXJ5JywgdHJ1ZSk7XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VVJMLmluZGV4T2YoXCJndWVzdGJvb2tpbmdcIikgPiAtMSlcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvZ3Vlc3Rib29raW5nJztcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub24oJ2NhbmNlbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2FtZW5kJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2NhbmNlbCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdyZXNjaGVkdWxlJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25pbm4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbigncmVzY2hlZHVsZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2FtZW5kJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3Jlc2NoZWR1bGUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnY2FuY2VsJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25pbm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub24oJ3ByaW50ZGl2JywgZnVuY3Rpb24gKGV2ZW50LCBpZCkge1xuICAgICAgICAgICAgLy93aW5kb3cucHJpbnQoKTtcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1c2VyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9haXJDYXJ0L3ByaW50LycgKyBpZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaWduaW5uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKCdhc1BERicsIGZ1bmN0aW9uIChldmVudCwgaWQpIHtcbiAgICAgICAgICAgIC8vd2luZG93LmxvY2F0aW9uKCcvYjJjL2FpckNhcnQvYXNQREYvJytpZCk7XG4gICAgICAgICAgICB2YXIgdXNlciA9IHRoaXMuZ2V0KCdtZXRhLnVzZXInKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FpckNhcnQvYXNQREYvXCIgKyBpZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaWduaW5uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKCdjbG9zZW1lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICQoJy51aS5wb3NpdGl2ZS5tZXNzYWdlJykuZmFkZU91dCgpO1xuICAgICAgICB9KTtcblxuICAgIH0sXG4gICAgc3VibWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcbiAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcbiAgICAgICAgICAgICQoJy5tZXNzYWdlJykuZmFkZUluKCk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvc2VuZEVtYWlsLycgKyB2aWV3LmdldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWQnKSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7ZW1haWw6ICQoJyNlbWFpbCcpLnZhbCgpLCB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuZW1haWxfc2VudFwiKS5odG1sKFwiPGRpdiBjbGFzcz0nZW1haWxfc2VudCc+RW1haWwgU2VudDwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3LmRlZmVycmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LmRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvck1zZycsICdTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICBcbiAgICB9LFxuICAgIHNpZ25pbm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCdteWJvb2tpbmdzJykpO1xuICAgICAgICBBdXRoLmxvZ2luKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCdteWJvb2tpbmdzJykuY3VycmVudENhcnREZXRhaWxzLmlkKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnbWV0YS51c2VyJywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvbXlib29raW5ncy8nICsgdmlldy5nZXQoJ215Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICBiYWNrOiBmdW5jdGlvbigpIHtcbiAgICBcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWY9XCIvXCI7XG4gICAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvZGV0YWlscy5qc1xuLy8gbW9kdWxlIGlkID0gMzU3XG4vLyBtb2R1bGUgY2h1bmtzID0gNiA3IiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcG9zaXRpdmUgIG1lc3NhZ2VcIixcInN0eWxlXCI6XCJkaXNwbGF5OiBub25lXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifSxcInZcIjp7XCJjbGlja1wiOlwiY2xvc2VtZXNzYWdlXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJTZW5kaW5nIEVtYWlsLi5cIl0sXCJuXCI6NTAsXCJyXCI6XCIuL3N1Ym1pdHRpbmdcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1wiRW1haWwgU2VudFwiXSxcInJcIjpcIi4vc3VibWl0dGluZ1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5wcmludFwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImJveCBteS1ib29raW5ncy1kZXRhaWxzIFwiLHtcInRcIjo0LFwiZlwiOltcInVpIHNlZ21lbnQgbG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibm9wcmludFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiYVwiOntcInN0eWxlXCI6XCJ2ZXJ0aWNhbC1hbGlnbjogYm90dG9tXCJ9LFwiZlwiOltcIk15IEJvb2tpbmdzIERldGFpbHMgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjpcInJlc2NoZWR1bGVcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsIHVpIGJ1dHRvbiBvcmFuZ2VcIn0sXCJmXCI6W1wiQ2hhbmdlL1Jlc2NoZWR1bGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjpcImNhbmNlbFwifSxcImFcIjp7XCJjbGFzc1wiOlwic21hbGwgdWkgYnV0dG9uIHJlZFwifSxcImZcIjpbXCJDYW5jZWxcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1widXBjb21pbmdcIixcIm1ldGEudXNlci5lbWFpbFwiLFwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuZW1haWxcIl0sXCJzXCI6XCJfMD09XFxcInRydWVcXFwiJiZfMT09XzJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjpcImJhY2tcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsIHVpIGJ1dHRvbiB5ZWxsb3dcIn0sXCJmXCI6W1wiQmFja1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiNcIixcImNsYXNzXCI6XCJlbWFpbFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInRvZ2dsZWVtYWlsXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiZGlzYWJsZWQ9J2Rpc2FibGVkJ1wiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic3VibWl0dGluZ1wiXSxcInNcIjpcIiFfMFwifX1dLFwiZlwiOltcIkVtYWlsXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6W1wiL2IyYy9haXJDYXJ0L2FzUERGL1wiLHtcInRcIjoyLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWRcIn1dLFwidGFyZ2V0XCI6XCJfYmxhbmtcIixcImNsYXNzXCI6XCJwZGZcIn0sXCJmXCI6W1wiVGlja2V0IGFzIFBERlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpY2tldFwiLFwiaHJlZlwiOltcIi9iMmMvYWlyQ2FydC9teWJvb2tpbmdzL1wiLHtcInRcIjoyLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWRcIn0sXCIjcHJpbnRcIl0sXCJ0YXJnZXRcIjpcIl9ibGFua1wifSxcImZcIjpbXCJQcmludCBFLVRpY2tldFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbW9kYWwgc21hbGxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W1wiRW1haWwgVGlja2V0XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBzZWdtZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcIi4vc3VibWl0dGluZ1wifV0sXCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbnB1dCBzbWFsbFwiLFwidHlwZVwiOlwidGV4dFwiLFwibmFtZVwiOlwiZW1haWxcIixcImlkXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpcIlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWN0aW9uc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNtYWxsIGJ1dHRvblwifSxcImZcIjpbXCJTZW5kXCJdfV19XX1dfV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MucHJpbnRcIl0sXCJzXCI6XCIhXzBcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6OTUlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJzdHlsZVwiOlwid2lkdGg6NDUlXCIsXCJjb2xzcGFuXCI6XCIzXCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInJcIjpcInRpY2tldHN0YXR1c21zZ1wifV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJ3aWR0aDozNSVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9kZXYvaW1nL2xvZ28ucG5nXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJ3aWR0aDozNSVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcInN0eWxlXCI6XCJmb250LXNpemU6IHgtbGFyZ2U7Zm9udC13ZWlnaHQ6Ym9sZDtcIn0sXCJmXCI6W1wiRS1USUNLRVRcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcInN0eWxlXCI6XCJ3aWR0aDozMCVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJzdHlsZVwiOlwiIHRleHQtYWxpZ246IGluaXRpYWw7ZmxvYXQ6IHJpZ2h0O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOltcIkNoZWFwVGlja2V0LmluIDogQ3VzdG9tZXIgU3VwcG9ydFwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJFbWFpbDpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIm1haWx0bzpDU0BDaGVhcFRpY2tldC5pblwifSxcImZcIjpbXCJDU0BDaGVhcFRpY2tldC5pblwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJQaG9uZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwidGVsOjAxMjAtNDg4Nzc3N1wifSxcImZcIjpbXCIwMTIwLTQ4ODc3NzdcIl19XX1dfV19XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnByaW50XCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImdyb3VwIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3NcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZSB0aXRsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuc291cmNlXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wiLFwic3R5bGVcIjpcIm1hcmdpbi10b3A6IDNweDtcIn0sXCJmXCI6W1wiwqBcIl19LHtcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5kZXN0aW5hdGlvblwifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicmV0dXJuZGF0ZVwiXSxcInNcIjpcIl8wPT1udWxsXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpcmVjdGlvblwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5ncy4wLnNvdXJjZVwifSx7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYmFja1wiLFwic3R5bGVcIjpcIm1hcmdpbi10b3A6IDNweDtcIn0sXCJmXCI6W1wiwqBcIl19LHtcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5kZXN0aW5hdGlvblwifV19XSxcInhcIjp7XCJyXCI6W1wicmV0dXJuZGF0ZVwiXSxcInNcIjpcIl8wPT1udWxsXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJzb3VyY2VcIn0sXCLCoCB8IMKgXCJdLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZ3NcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInJcIjpbXCJib29raW5ncy5sZW5ndGhcIl0sXCJzXCI6XCJfMC0xXCJ9LFwiZGVzdGluYXRpb25cIl19fV19XSxcInhcIjp7XCJyXCI6W1wiaXNNdWx0aUNpdHlcIl0sXCJzXCI6XCJfMD09XFxcImZhbHNlXFxcIlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJib29raW5ncy4wLmRlcGFydHVyZVwiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ1N0YXR1c0NsYXNzXCIsXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nX3N0YXR1c21zZ1wifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va2luZy1pZFwifSxcImZcIjpbXCJCb29raW5nIElkOiBcIix7XCJ0XCI6MixcInJcIjpcImlkXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tpbmctZGF0ZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdEYXRlXCIsXCJjcmVhdGVkXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2l4dGVlbiB3aWRlIGNvbHVtbiBcIixcInN0eWxlXCI6XCJoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnQgZmxpZ2h0LWl0aW5lcmFyeSBjb21wYWN0IGRhcmtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpdGxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiY2l0eVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJzb3VyY2VcIn0sXCIg4oaSIFwiLHtcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25cIn1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZTJcIixcImRlcGFydHVyZVwiXSxcInNcIjpcIl8wKF8xKVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0dGltZVwifV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJpZFwiOlwiYWlycG9ydF9jaGFuZ2Vfc3R5bGVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYWlycG9ydF9jaGFuZ2VcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJhaXJwb3J0X2NoYW5nZVwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiaWRcIjpcInRyYW5zaXR2aXNhX21zZ19zdHlsZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmFuc2l0XCJ9XX1dLFwiblwiOjUwLFwiclwiOlwidHJhbnNpdFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudHNcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXZpZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIsKgXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJsYXlvdmVyXCJ9LFwiZlwiOltcIkxheW92ZXI6IFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJkaWZmXCIsXCJrXCIsXCJqXCIsXCJib29raW5nc1wiXSxcInNcIjpcIl8wKF8zW18yXS5yb3V0ZXNbXzFdLmRlcGFydHVyZSxfM1tfMl0ucm91dGVzW18xLTFdLmFycml2YWwpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wia1wiXSxcInNcIjpcIl8wPjBcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLWxvZ29cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRvcCBhbGlnbmVkIGF2YXRhciBpbWFnZVwiLFwic3JjXCI6W3tcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwicm91dGVzXCIse1widFwiOjMwLFwiblwiOlwia1wifSxcImxvZ29cIl19fV0sXCJhbHRcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVyTmFtZVwifV0sXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLW5hbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllck5hbWVcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJcIn0sXCItXCIse1widFwiOjIsXCJyXCI6XCJmbGlnaHROdW1iZXJcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImZyb21cIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiByaWdodDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJpZD1cXFwiYmFja2dyb3VuZF9haXJwb3J0X2NoYW5nZVxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFpcnBvcnRfY2hhbmdlX25hbWUuMFwiLFwiYWlycG9ydF9jaGFuZ2VfbmFtZS4xXCIsXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjJcIixcImFpcnBvcnRfY2hhbmdlX25hbWUuM1wiLFwib3JpZ2luXCIsXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjRcIl0sXCJzXCI6XCJfND09XzB8fF80PT1fMXx8XzQ9PV8yfHxfND09XzN8fF80PT1fNVwifX1dLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm9yaWdpblwifSxcIjpcIl19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlM1wiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJkZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wic3R5bGVcIjpcInRleHQtYWxpZ246IHJpZ2h0O1wiLFwiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwib3JpZ2luRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJmbGlnaHRcIn0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwidG9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJpZD1cXFwiYmFja2dyb3VuZF9haXJwb3J0X2NoYW5nZVxcXCJcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImFpcnBvcnRfY2hhbmdlX25hbWUuMFwiLFwiYWlycG9ydF9jaGFuZ2VfbmFtZS4xXCIsXCJhaXJwb3J0X2NoYW5nZV9uYW1lLjJcIixcImFpcnBvcnRfY2hhbmdlX25hbWUuM1wiLFwiZGVzdGluYXRpb25cIixcImFpcnBvcnRfY2hhbmdlX25hbWUuNFwiXSxcInNcIjpcIl80PT1fMHx8XzQ9PV8xfHxfND09XzJ8fF80PT1fM3x8XzQ9PV81XCJ9fV0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25cIn0sXCI6XCJdfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZTNcIixcImFycml2YWxcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImFycml2YWxcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25EZXRhaWxzXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpbWUtbi1jYWJpblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHR0aW1lXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJ0cmF2ZWxsZXJcIix7XCJyXCI6W10sXCJzXCI6XCIwXCJ9LFwiY2FiaW5cIl19fV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwidGVjaFN0b3BcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIlRlY2huaWNhbCBTdG9wOlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJyb3V0ZXNcIix7XCJ0XCI6MzAsXCJuXCI6XCJrXCJ9LFwidGVjaFN0b3BcIl19fV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJrXCIsXCJqXCIsXCJib29raW5nc1wiXSxcInNcIjpcIl8yW18xXS5yb3V0ZXNbXzBdLnRlY2hTdG9wIT1udWxsXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfV0sXCJ4XCI6e1wiclwiOltcImtcIixcImpcIixcImJvb2tpbmdzXCJdLFwic1wiOlwiXzJbXzFdLnJvdXRlc1tfMF0udGVjaFN0b3AhPW51bGxcIn19XX1dLFwiaVwiOlwia1wiLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwicm91dGVzXCJdfX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzZW5nZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIlBhc3NlbmdlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIkNSUyBQTlJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJBaXIgUE5SXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJmXCI6W1wiVGlja2V0IE5vLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIlJlbWFya1wiXX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidGl0bGVcIn0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJmaXJzdF9uYW1lXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibGFzdF9uYW1lXCJ9LFwiIChcIix7XCJ0XCI6MixcInJcIjpcInR5cGVcIn0sXCIpIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6W1wic3RhdHVzIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJ0cmF2ZWxsZXJCb29raW5nU3RhdHVzXCIsXCJzdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwic3RhdHVzbXNnXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImNyc19wbnJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYWlybGluZV9wbnJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidGlja2V0XCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGlja2V0X2JhZ2dhZ2Vfc3R5bGluZ1wifSxcImZcIjpbXCJIYW5kIGJhZ2dhZ2Ugb25seSg3a2cgT25lIFBpZWNlIE9ubHkpXCJdfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicHJvZHVjdF9jbGFzc1wiXSxcInNcIjpcIl8wPT1cXFwiTElURVxcXCJcIn19XX1dfV0sXCJpXCI6XCJ0XCIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJ0cmF2ZWxsZXJcIl19fV19XX1dLFwiaVwiOlwialwiLFwiclwiOlwiYm9va2luZ3NcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidG90YWxcIn0sXCJmXCI6W1wiVE9UQUwgUFJJQ0U6IFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImN1cmVuY3lcIn0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImNvbnZlcnRcIixcInRvdGFsQW1vdW50XCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRheGVzXCJ9LFwiZlwiOltcIkJhc2ljIEZhcmUgOiBcIix7XCJ0XCI6MixcInJcIjpcImJhc2VwcmljZVwifSxcIiAsIFRheGVzIDogXCIse1widFwiOjIsXCJyXCI6XCJ0YXhlc1wifSxcIiAsIEZlZSA6IFwiLHtcInRcIjoyLFwiclwiOlwiZmVlXCJ9LFwiLCBPdGhlciA6IFwiLHtcInRcIjoyLFwiclwiOlwiY29udmZlZVwifSx7XCJ0XCI6NCxcImZcIjpbXCIsIERpc2NvdW50IDogXCIse1widFwiOjIsXCJyXCI6XCJwcm9tb2Rpc2NvdW50XCJ9XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicHJvbW9kaXNjb3VudFwiXSxcInNcIjpcIl8wPjBcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjogYm90aDtcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwicGFzc2VuZ2VyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhcIixcImFcIjp7XCJjb2xzcGFuXCI6XCIyXCJ9LFwiZlwiOltcIlRlcm1zIGFuZCBDb25kaXRpb25zXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJBbGwgZmxpZ2h0IHRpbWluZ3Mgc2hvd24gYXJlIGxvY2FsIHRpbWVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlVzZSBcIix7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJSZWYgTm8uXCJdfSxcIiBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIHVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlVzZSBcIix7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJBaXJsaW5lIFBOUlwiXX0sXCIgZm9yIGNvbnRhY3RpbmcgdGhlIEFpcmxpbmVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkNhcnJ5IGEgcHJpbnQtb3V0IG9mIGUtdGlja2V0IGZvciBjaGVjay1pbi5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJJbiBjYXNlIG9mIG5vLXNob3csIHRpY2tldHMgYXJlIG5vbi1yZWZ1bmRhYmxlLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkVuc3VyZSB5b3VyIHBhc3Nwb3J0IGlzIHZhbGlkIGZvciBtb3JlIHRoYW4gNiBtb250aHMuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiUGxlYXNlIGNoZWNrIFRyYW5zaXQgJiBEZXN0aW5hdGlvbiBWaXNhIFJlcXVpcmVtZW50LlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkZvciBjYW5jZWxsYXRpb24sIGFpcmxpbmUgY2hhcmdlcyAmIHNlci4gZmVlIGFwcGx5LlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkFsbCBwYXltZW50cyBhcmUgY2hhcmdlZCBpbiBJTlIuIElmIGFueSBvdGhlciBjdXJyZW5jeSBoYXMgYmVlbiBjaG9zZW4gdGhlIHByaWNlIGluIHRoYXQgY3VycmVuY3kgaXMgb25seSBpbmRpY2F0aXZlLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlRoZSBJTlIgcHJpY2UgaXMgdGhlIGZpbmFsIHByaWNlLlwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiQ2FycnkgYSBwaG90byBJRC8gUGFzc3BvcnQgZm9yIGNoZWNrLWluLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIk1lYWxzLCBTZWF0ICYgU3BlY2lhbCBSZXF1ZXN0cyBhcmUgbm90IGd1YXJhbnRlZWQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiUHJlc2VudCBGcmVxdWVudCBGbGllciBDYXJkIGF0IGNoZWNrLWluLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkNhcnJpYWdlIGlzIHN1YmplY3QgdG8gQWlybGluZXMgVGVybXMgJiBDb25kaXRpb25zLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkVuc3VyZSBwYXNzZW5nZXIgbmFtZXMgYXJlIGNvcnJlY3QsIG5hbWUgY2hhbmdlIGlzIG5vdCBwZXJtaXR0ZWQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiRm9yIGFueSBjaGFuZ2UgQWlybGluZSBjaGFyZ2VzLCBkaWZmZXJlbmNlIG9mIGZhcmUgJiBzZXIuIGZlZSBhcHBseS5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJZb3UgbWlnaHQgYmUgYXNrZWQgdG8gcHJvdmlkZSBjYXJkIGNvcHkgJiBJRCBwcm9vZiBvZiBjYXJkIGhvbGRlci5cIl19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwiY2xlYXI6IGJvdGg7XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJcIn0sXCJmXCI6W1wiRGlzY2xhaW1lcjogQ2hlYXBUaWNrZXQgaXMgbm90IGxpYWJsZSBmb3IgYW55IGRlZmljaWVuY3kgaW4gc2VydmljZSBieSBBaXJsaW5lIG9yIFNlcnZpY2UgcHJvdmlkZXJzLlwiXX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucHJpbnRcIn1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic2NyaXB0XCIsXCJhXCI6e1widHlwZVwiOlwidGV4dC9qYXZhc2NyaXB0XCJ9LFwiZlwiOltcIndpbmRvdy5peGlUcmFuc2FjdGlvblRyYWNrZXIgPSBmdW5jdGlvbih0YWcpIHtcXG5mdW5jdGlvbiB1cGRhdGVSZWRpcmVjdCh0YWcsIHRyYW5zYWN0aW9uSUQsIHBuciwgc2FsZVZhbHVlLCBzZWdtZW50TmlnaHRzKSB7XFxucmV0dXJuIFxcXCI8aW1nIHN0eWxlPSd0b3A6LTk5OTk5OXB4O2xlZnQ6LTk5OTk5OXB4O3Bvc2l0aW9uOmFic29sdXRlJyBzcmM9J2h0dHBzOi8vd3d3Lml4aWdvLmNvbS9peGktYXBpL3RyYWNrZXIvdXBkYXRlQ29udmVyc2lvbi9cXFwiICsgdGFnICsgXFxcIj90cmFuc2FjdGlvbklkPVxcXCIgKyB0cmFuc2FjdGlvbklEICsgXFxcIiZwbnI9XFxcIiArIHBuciArIFxcXCImc2FsZVZhbHVlPVxcXCIgKyBzYWxlVmFsdWUgKyBcXFwiJnNlZ21lbnROaWdodHM9XFxcIiArIHNlZ21lbnROaWdodHMgKyBcXFwiJyAvPlxcXCI7XFxufVxcbmRvY3VtZW50LmJvZHkuaW5uZXJIVE1MICs9IHVwZGF0ZVJlZGlyZWN0KHRhZywgXFxcIlwiLHtcInRcIjoyLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWRcIn0sXCJcXFwiLCBcXFwiXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5ib29raW5ncy4wLnRyYXZlbGxlci4wLmFpcmxpbmVfcG5yXCJ9LFwiXFxcIiwgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImNvbnZlcnRJeGlnb1wiLFwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMudG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19LFwiLCBcIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLnNlZ05pZ2h0c1wifSxcIiApO1xcbn07XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNjcmlwdFwiLFwiYVwiOntcInNyY1wiOlwiaHR0cHM6Ly93d3cuaXhpZ28uY29tL2l4aS1hcGkvdHJhY2tlci90cmFjazE5NlwiLFwiaWRcIjpcInRyYWNrZXJcIn19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5jbGllbnRTb3VyY2VJZFwiXSxcInNcIjpcIl8wPT00XCJ9fSx7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic2NyaXB0XCIsXCJhXCI6e1widHlwZVwiOlwidGV4dC9qYXZhc2NyaXB0XCJ9LFwiZlwiOltcIlxcbnZhciB3ZWdvID0gd2VnbyB8fCBbXTtcXG5cXG5fd2Vnby5wdXNoKFxcblxcblsgJ2NvbnZlcnNpb25JZCcsICdmY2E3NzY2MS03NmViLTRjY2QtYWY0Yy0zYjY3YTMwMDEyN2InIF0sXFxuXFxuWyAndHJhbnNhY3Rpb25JZCcsICdcIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkXCJ9LFwiJyBdLFxcblxcblsgJ2N1cnJlbmN5Q29kZScsICdJTlInIF0sXFxuXFxuWyAnY29tbWlzc2lvbicsIDBdLFxcblxcblsgJ3RvdGFsQm9va2luZ1ZhbHVlJywgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImNvbnZlcnRJeGlnb1wiLFwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMudG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19LFwiIF1cXG5cXG4pO1xcblxcbihmdW5jdGlvbiAoKSB7XFxuXFxudmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XFxuXFxudmFyIHdnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XFxuXFxud2cudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xcblxcbndnLnNyYyA9ICdodHRwczovL3Mud2Vnby5jb20vY29udmVyc2lvbi5qcyc7XFxuXFxucy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3Zywgcyk7XFxuXFxufSkoKTtcXG5cIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5jbGllbnRTb3VyY2VJZFwiXSxcInNcIjpcIl8wPT01XCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzA9PTh8fF8wPT05fHxfMD09MTB8fF8wPT0xMVwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLnByaW50XCJdLFwic1wiOlwiIV8wXCJ9fV19XSxcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzXCJ9XX07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9kZXRhaWxzLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDYgNyIsIid1c2Ugc3RyaWN0JztcblxudmFyICBNeWJvb2tpbmdzID0gcmVxdWlyZSgnY29tcG9uZW50cy9teWJvb2tpbmdzL215Ym9va2luZ3MnKTtcbiAgICAgXG5yZXF1aXJlKCd3ZWIvbW9kdWxlcy9teWJvb2tpbmdzL215Ym9va2luZ3MubGVzcycpO1xuLy8kKGZ1bmN0aW9uKCkge1xuLy8gICAgY29uc29sZS5sb2coJ0luc2lkZSBNYWluIG15Ym9va2luZ3MnKTtcbi8vICAgIHZhciBteWJvb2tpbmdzID0gbmV3IE15Ym9va2luZ3MoKTtcbi8vICAgIHZhciB1c2VyID0gbmV3IFVzZXIoKTsgICAgXG4vL1xuLy8gICAgbXlib29raW5ncy5yZW5kZXIoJyNjb250ZW50Jyk7XG4vLyAgICB1c2VyLnJlbmRlcignI3BhbmVsJyk7XG4vL30pO1xuXG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgKG5ldyBNeWJvb2tpbmdzKCkpLnJlbmRlcignI2FwcCcpO1xufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL215Ym9va2luZ3MuanNcbi8vIG1vZHVsZSBpZCA9IDM2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDciLCIndXNlIHN0cmljdCc7XG5cbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXG4gICAgICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXG4gICAgICAgIE15Ym9va2luZ0RhdGEgPSByZXF1aXJlKCdzdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzJyksXG4gICAgICAgIE1ldGEgPSByZXF1aXJlKCdzdG9yZXMvbXlib29raW5ncy9tZXRhJylcbi8vICAgICxcbi8vICAgIFVzZXIgPSByZXF1aXJlKCdzdG9yZXMvdXNlci91c2VyJylcbiAgICAgICAgO1xuXG4vL3JlcXVpcmUoJ21vZHVsZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmxlc3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XG4gICAgaXNvbGF0ZWQ6IHRydWUsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuaHRtbCcpLFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgJ2xheW91dCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2xheW91dCcpLFxuICAgICAgICBzdW1tYXJ5OiByZXF1aXJlKCdjb21wb25lbnRzL215Ym9va2luZ3Mvc3VtbWFyeScpLFxuICAgICAgICBkZXRhaWxzOiByZXF1aXJlKCdjb21wb25lbnRzL215Ym9va2luZ3MvZGV0YWlscycpLFxuICAgICAgICBhbWVuZG1lbnQ6IHJlcXVpcmUoJ2NvbXBvbmVudHMvbXlib29raW5ncy9hbWVuZG1lbnQnKSxcbiAgICAgIC8vICBsZWZ0cGFuZWw6IHJlcXVpcmUoJ2NvbXBvbmVudHMvbGF5b3V0cy9wcm9maWxlX3NpZGViYXInKVxuICAgICAgICAgICAgICAgIC8vIHRyYXZlbGxlcmxpc3Q6IHJlcXVpcmUoJy4vbGlzdCcpLFxuICAgICAgICAgICAgICAgIC8vICBwcm9maWxlc2lkZWJhcjogcmVxdWlyZSgnLi4vbGF5b3V0cy9wcm9maWxlX3NpZGViYXInKVxuICAgIH0sXG4gICAgcGFydGlhbHM6IHtcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcbiAgICB9LFxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgLy8gY29uc29sZS5sb2coXCJJbnNpZGUgb25jb25maWdcIik7XG4gICAgICAgIHZhciBpZGQgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnbXlib29raW5ncy8nKVsxXTtcbiAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnByaW50JywgZmFsc2UpO1xuICAgICAgICB2YXIgaWQ9bnVsbDtcbiAgICAgICAgdmFyIHVybGlkPW51bGw7XG4gICAgICAgIGlmKGlkZCl7XG4gICAgICAgICAgICB1cmxpZD1pZGQuc3BsaXQoJyMnKTtcbiAgICAgICAgICAgIGlkPXVybGlkWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgdmFyIG1tPU1ldGEuaW5zdGFuY2UoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ21ldGEnLCBtZXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnN1bW1hcnknLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wZW5kaW5nJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5jdXJyZW50Q2FydElkJywgaWQpO1xuICAgICAgICAgICAgaWYodXJsaWRbMV09PSdwcmludCcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnByaW50JywgdHJ1ZSk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2hlYWRlcicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcsJzBweCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50JykuY3NzKCdwYWRkaW5nJywnMHB4Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBNeWJvb2tpbmdEYXRhLmdldEN1cnJlbnRDYXJ0KGlkKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdwZW5kaW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodXJsaWRbMV09PSdwcmludCcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnByaW50JywgdHJ1ZSk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2hlYWRlcicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcsJzBweCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5jb250ZW50JykuY3NzKCdwYWRkaW5nJywnMHB4Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnByaW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7IFxuICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHVybGlkWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5hbWVuZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnN1bW1hcnknLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnBlbmRpbmcnLCB0cnVlKTtcbiAgICAgICAgICAgIE1ldGEuaW5zdGFuY2UoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ21ldGEnLCBtZXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIE15Ym9va2luZ0RhdGEuZmV0Y2goKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdwZW5kaW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5zZXQoJ3VzZXInLCBVc2VyKTtcbiAgICAgICAgd2luZG93LnZpZXcgPSB0aGlzO1xuICAgIH0sXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdG1lbnU6IGZhbHNlLFxuICAgICAgICB9XG4gICAgfSxcbiAgICBsZWZ0TWVudTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmxhZyA9IHRoaXMuZ2V0KCdsZWZ0bWVudScpO1xuICAgICAgICB0aGlzLnNldCgnbGVmdG1lbnUnLCAhZmxhZyk7XG4gICAgfSxcblxuICAgIHNpZ25pbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIEF1dGgubG9naW4oKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MvJyArIHZpZXcuZ2V0KCdteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9KTtcbiAgICB9LCAgXG4gICAgc2lnbnVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgQXV0aC5zaWdudXAoKTtcbiAgICB9LFxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICBcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215Ym9va2luZ3MnLCBmdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm15Ym9va2luZ3MgY2hhbmdlZCBcIik7XG4vLyAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcicsIHZhbHVlKTtcbi8vICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcblxuICAgIH1cbn0pO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9teWJvb2tpbmdzL215Ym9va2luZ3MuanNcbi8vIG1vZHVsZSBpZCA9IDM2NFxuLy8gbW9kdWxlIGNodW5rcyA9IDciLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJsYXlvdXRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJteWJvb2tpbmdzXCI6W3tcInRcIjoyLFwiclwiOlwibXlib29raW5nc1wifV19LFwiZlwiOltcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhbWVuZG1lbnRcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudCBjZW50ZXJlZCBcIixcIm15Ym9va2luZ3NcIjpbe1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MuYW1lbmRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInN1bW1hcnlcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudCBjZW50ZXJlZFwiLFwibXlib29raW5nc1wiOlt7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3NcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5zdW1tYXJ5XCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRldGFpbHNcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudCBjZW50ZXJlZFwiLFwibXlib29raW5nc1wiOlt7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3NcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiclwiOlwibXlib29raW5ncy5zdW1tYXJ5XCJ9XSxcInJcIjpcIm15Ym9va2luZ3MuYW1lbmRcIn0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3MvbXlib29raW5ncy5odG1sXG4vLyBtb2R1bGUgaWQgPSAzNjVcbi8vIG1vZHVsZSBjaHVua3MgPSA3IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxuICAgICAgICBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpO1xuLy8sXG4vL015dHJhdmVsbGVyID0gcmVxdWlyZSgnYXBwL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpICAgO1xuO1xuXG5cbnZhciB0Mm0gPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHZhciBpID0gdGltZS5zcGxpdCgnOicpO1xuXG4gICAgcmV0dXJuIGlbMF0gKiA2MCArIGlbMV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcbiAgICBpc29sYXRlZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215Ym9va2luZ3Mvc3VtbWFyeS5odG1sJyksXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVlbWFpbDpudWxsLFxuICAgICAgICAgICAgY2lkOm51bGwsXG4gICAgICAgICAgICBmb3JtYXRCaXJ0aERhdGU6IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXIuYmlydGhkYXRlJywgZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdFRpdGxlOiBmdW5jdGlvbiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGl0bGVzKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXROYW1lOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0VHJhdmVsRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2xsJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2xsJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3M6IGZ1bmN0aW9uIChicykge1xuICAgICAgICAgICAgICAgIGlmIChicyA9PSAxIHx8IGJzID09IDIgfHwgYnMgPT0gMyB8fCBicyA9PSA3KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJwcm9ncmVzc1wiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJzID09IDQgfHwgYnMgPT0gNSB8fCBicyA9PSA2IHx8IGJzID09IDEyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjYW5jZWxsZWRcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTEpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJvb2tlZFwiO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0Qm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChicykge1xuICAgICAgICAgICAgICAgIHZhciB0aXRsZXMgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYm9va2luZ1N0YXR1cycpO1xuICAgICAgICAgICAgICAgIHJldHVybiAgXy5yZXN1bHQoXy5maW5kKHRpdGxlcywgeydpZCc6IGJzfSksICduYW1lJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW9uZXk6IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICcnLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBvbmluaXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbi8vICAgICAgICAkKHRoaXMuZmluZCgnLmFjdGlvbiBhJykpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2luc2lkZSBjbGxpY2snKTtcbi8vICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbi8vICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuLy8gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKCdjbG9zZW1lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAkKCcudWkucG9zaXRpdmUubWVzc2FnZScpLmZhZGVPdXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub24oJ3RvZ2dsZWVtYWlsJywgZnVuY3Rpb24gKGUsIGlkLGVtYWlsKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zZXQoJ3VlbWFpbCcsIGVtYWlsKTtcbiAgICAgICAgICAgIHRoaXMuc2V0KCdjaWQnLCBpZCk7ICAgICAgICAgICAgXG4gICAgICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbignZ2V0ZGV0YWlsJywgZnVuY3Rpb24gKGV2ZW50LCBpZCkge1xuXG4gICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnY3VycmVudENhcnRJZCcsIGlkKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdwZW5kaW5nJywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnc3VtbWFyeScsIGZhbHNlKTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldENhcnREZXRhaWxzLycgKyBfLnBhcnNlSW50KGlkKSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsIGVtYWlsOmRhdGEuZW1haWwsdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGNvbnZmZWU6ZGF0YS5jb252ZmVlLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLHRpY2tldHN0YXR1c21zZzpkYXRhLnRpY2tldHN0YXR1c21zZywgcHJvbW9kaXNjb3VudDpkYXRhLnByb21vX2Rpc2NvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdXBjb21pbmc6IGkudXBjb21pbmcsIHNvdXJjZV9pZDogaS5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBpLmRlc3RpbmF0aW9uX2lkLCBzb3VyY2U6IGkuc291cmNlLCBmbGlnaHR0aW1lOiBpLmZsaWdodHRpbWUsIGRlc3RpbmF0aW9uOiBpLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IGkuZGVwYXJ0dXJlLCBhcnJpdmFsOiBpLmFycml2YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBib29raW5naWQ6IHQuYm9va2luZ2lkLCBmYXJldHlwZTogdC5mYXJldHlwZSwgdGl0bGU6IHQudGl0bGUsIHR5cGU6IHQudHlwZSwgZmlyc3RfbmFtZTogdC5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHQubGFzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLCBzdGF0dXNtc2c6IHQuc3RhdHVzbXNnLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm8uaWQsIG9yaWdpbjogcm8ub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiByby5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHJvLmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHJvLmRlcGFydHVyZSwgYXJyaXZhbDogcm8uYXJyaXZhbCwgY2Fycmllcjogcm8uY2FycmllciwgY2Fycmllck5hbWU6IHJvLmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHJvLmZsaWdodE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcChpLnJvdXRlcywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiB0LmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiB0Lm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiB0LmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHQubWVhbCwgc2VhdDogdC5zZWF0LCBhaXJjcmFmdDogdC5haXJjcmFmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIH07XG5cbiAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhkZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2N1cnJlbnRDYXJ0RGV0YWlscycsIGRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnc3VtbWFyeScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuXG5cbiAgICB9LFxuICAgIHN1Ym1pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XG4gICAgICAgICQoJy5tZXNzYWdlJykuZmFkZUluKCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvc2VuZEVtYWlsLycgKyB0aGlzLmdldCgnY2lkJyksXG4gICAgICAgICAgICBkYXRhOiB7ZW1haWw6IHRoaXMuZ2V0KCd1ZW1haWwnKSwgfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuZGVmZXJyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5kZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhocikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvck1zZycsICdTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKE1PQklMRSkge1xuICAgICAgICAgICAgdmFyIG9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICQoJyNtX21lbnUnKS5zaWRlYmFyKHsgb25IaWRkZW46IGZ1bmN0aW9uKCkgeyAkKCcjbV9idG4nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTsgIH0sIG9uU2hvdzogZnVuY3Rpb24oKSB7ICQoJyNtX2J0bicpLmFkZENsYXNzKCdkaXNhYmxlZCcpOyAgfX0pO1xuICAgICAgICAgICAgJCgnLmRyb3Bkb3duJykuZHJvcGRvd24oKTtcblxuICAgICAgICAgICAgJCgnI21fYnRuJywgdGhpcy5lbCkub24oJ2NsaWNrLmxheW91dCcsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI21fbWVudScpLnNpZGViYXIoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcucHVzaGVyJykub25lKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ3VlbWFpbCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbi8vICAgICAgICAgICAgIHRoaXMuc2V0KCd1ZW1haWwnLCB2YWx1ZSk7XG4vLyAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XG4vLyAgICAgICAgdGhpcy5vYnNlcnZlKCdteXRyYXZlbGxlci5jdXJyZW50VHJhdmVsbGVySWQnLCBmdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY3VycmVudFRyYXZlbGxlcklkIGNoYW5nZWQgXCIpO1xuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHZhbHVlKTtcbi8vICAgICAgICAgICAgLy90aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXJJZCcsIHZhbHVlKTtcbi8vICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcbiAgICB9XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvbXBvbmVudHMvbXlib29raW5ncy9zdW1tYXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAzNjZcbi8vIG1vZHVsZSBjaHVua3MgPSA3IiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJib3ggcmVzY2hlZHVsZSBcIix7XCJ0XCI6NCxcImZcIjpbXCJ1aSBzZWdtZW50IGxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgcG9zaXRpdmUgIG1lc3NhZ2VcIixcInN0eWxlXCI6XCJkaXNwbGF5OiBub25lXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifSxcInZcIjp7XCJjbGlja1wiOlwiY2xvc2VtZXNzYWdlXCJ9fSxcIiBFbWFpbCBTZW50XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBtb2RhbCBzbWFsbFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJFbWFpbCBUaWNrZXRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgZm9ybSBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9XSxcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaW5wdXQgc21hbGxcIixcInR5cGVcIjpcInRleHRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwiLi91ZW1haWxcIn1dfX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbnB1dCBzbWFsbFwiLFwidHlwZVwiOlwiaGlkZGVuXCIsXCJpZFwiOlwiY2lkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIi4vY2lkXCJ9XX19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFjdGlvbnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJhXCI6e1widHlwZVwiOlwic3VibWl0XCIsXCJjbGFzc1wiOlwidWkgc21hbGwgYnV0dG9uXCJ9LFwiZlwiOltcIlNlbmRcIl19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJoMVwiLFwiZlwiOltcIk15IEJvb2tpbmdzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImgyXCIsXCJmXCI6W1wiVXBjb21pbmcgVHJpcHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImdyb3VwIFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W1wiTm8gVHJpcHMgRm91bmQgISFcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5jYXJ0cy5sZW5ndGhcIl0sXCJzXCI6XCJfMD09MFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOltcIk5vIFRyaXBzIEZvdW5kICEhXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MuZmxnVXBjb21pbmdcIl0sXCJzXCI6XCIhXzBcIn19XSxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5jYXJ0cy5sZW5ndGhcIl0sXCJzXCI6XCJfMD09MFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiaXRlbSBzdGFja2FibGUgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuMC5zcmMuMC5uYW1lXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci4wLmRlc3QuMC5uYW1lXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLjAuc3JjLjAubmFtZVwifSx7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYmFja1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci4wLmRlc3QuMC5uYW1lXCJ9XX1dLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaXNNdWx0aUNpdHlcIl0sXCJzXCI6XCJfMD09XFxcImZhbHNlXFxcIlwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn0sXCLCoCB8IMKgXCJdLFwiaVwiOlwiaVwiLFwiclwiOlwidHJhdmVsZXIuMC5zcmNcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcInRyYXZlbGVyLjAuZGVzdFwiLFwibVwiOlt7XCJyXCI6W1widHJhdmVsZXIuMC5kZXN0Lmxlbmd0aFwiXSxcInNcIjpcIl8wLTFcIn0sXCJuYW1lXCJdfX1dfV0sXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZVwiLFwiYm9va2luZ3MuMC5kZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvbXlib29raW5ncy9cIix7XCJ0XCI6MixcInJcIjpcImlkXCJ9LFwiI3ByaW50XCJdLFwidGFyZ2V0XCI6XCJfYmxhbmtcIixcImNsYXNzXCI6XCJwcmludFwiLFwidGl0bGVcIjpcIlByaW50XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiZW1haWxcIixcInRpdGxlXCI6XCJFbWFpbFwifSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcInRvZ2dsZWVtYWlsXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn0sXCIsXCIse1widFwiOjIsXCJyXCI6XCJlbWFpbFwifV19fX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOltcIi9iMmMvYWlyQ2FydC9hc1BERi9cIix7XCJ0XCI6MixcInJcIjpcImlkXCJ9XSxcInRhcmdldFwiOlwiX2JsYW5rXCIsXCJjbGFzc1wiOlwicGRmXCIsXCJ0aXRsZVwiOlwiRG93bmxvYWQgUERGXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWlkXCJ9LFwiZlwiOltcIkJvb2tpbmcgSWQ6IFwiLHtcInRcIjoyLFwiclwiOlwiaWRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va2luZy1kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ0RhdGVcIixcImNyZWF0ZWRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJsdWUgZmx1aWQgYnV0dG9uXCIsXCJzdHlsZVwiOlwicGFkZGluZzo1cHg7bWFyZ2luLXRvcDo4cHg7Y3Vyc29yOmRlZmF1bHQ7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wiblwiOlwiZ2V0ZGV0YWlsXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn1dfX0sXCJmXCI6W1wiVmlldyBEZXRhaWxzXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaHJcIn0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidHJhdmVsbGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiNcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXROYW1lXCIsXCJpXCIsXCJ0cmF2ZWxlclwiXSxcInNcIjpcIl8wKF8yW18xXS5uYW1lKVwifX1dfSxcIiDCoFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiLFwidHJhdmVsZXIubGVuZ3RoXCJdLFwic1wiOlwiXzA9PShfMS0xKVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiNcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXROYW1lXCIsXCJpXCIsXCJ0cmF2ZWxlclwiXSxcInNcIjpcIl8wKF8yW18xXS5uYW1lKVwifX1dfSxcIiDCoHzCoFwiXSxcInhcIjp7XCJyXCI6W1wiaVwiLFwidHJhdmVsZXIubGVuZ3RoXCJdLFwic1wiOlwiXzA9PShfMS0xKVwifX1dLFwiaVwiOlwiaVwiLFwiclwiOlwidHJhdmVsZXJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjMsXCJyXCI6XCJjdXJlbmN5XCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwidG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGF0dXMgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzTWVzc2FnZVwiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJ1cGNvbWluZ1wiXSxcInNcIjpcIl8wPT1cXFwidHJ1ZVxcXCJcIn19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcIm15Ym9va2luZ3MuY2FydHNcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImgyXCIsXCJmXCI6W1wiUHJldmlvdXMgVHJpcHNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImdyb3VwXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbXCJObyBUcmlwcyBGb3VuZCAhIVwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLmNhcnRzLmxlbmd0aFwiXSxcInNcIjpcIl8wPT0wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W1wiTm8gVHJpcHMgRm91bmQgISFcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5mbGdQcmV2aW91c1wiXSxcInNcIjpcIiFfMFwifX1dLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLmNhcnRzLmxlbmd0aFwiXSxcInNcIjpcIl8wPT0wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW0gIHByZXZpb3VzICBzdGFja2FibGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuMC5zcmMuMC5uYW1lXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci4wLmRlc3QuMC5uYW1lXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLjAuc3JjLjAubmFtZVwifSx7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYmFja1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci4wLmRlc3QuMC5uYW1lXCJ9XX1dLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaXNNdWx0aUNpdHlcIl0sXCJzXCI6XCJfMD09XFxcImZhbHNlXFxcIlwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn0sXCLCoCB8IMKgXCJdLFwiaVwiOlwiaVwiLFwiclwiOlwidHJhdmVsZXIuMC5zcmNcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcInRyYXZlbGVyLjAuZGVzdFwiLFwibVwiOlt7XCJyXCI6W1widHJhdmVsZXIuMC5kZXN0Lmxlbmd0aFwiXSxcInNcIjpcIl8wLTFcIn0sXCJuYW1lXCJdfX1dfV0sXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZVwiLFwiYm9va2luZ3MuMC5kZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvbXlib29raW5ncy9cIix7XCJ0XCI6MixcInJcIjpcImlkXCJ9LFwiI3ByaW50XCJdLFwidGFyZ2V0XCI6XCJfYmxhbmtcIixcImNsYXNzXCI6XCJwcmludFwiLFwidGl0bGVcIjpcIlByaW50XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiZW1haWxcIixcInRpdGxlXCI6XCJFbWFpbFwifSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcInRvZ2dsZWVtYWlsXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn0sXCIsXCIse1widFwiOjIsXCJyXCI6XCJlbWFpbFwifV19fX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOltcIi9iMmMvYWlyQ2FydC9hc1BERi9cIix7XCJ0XCI6MixcInJcIjpcImlkXCJ9XSxcInRhcmdldFwiOlwiX2JsYW5rXCIsXCJjbGFzc1wiOlwicGRmXCIsXCJ0aXRsZVwiOlwiRG93bmxvYWQgUERGXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWlkXCJ9LFwiZlwiOltcIkJvb2tpbmcgSWQ6IFwiLHtcInRcIjoyLFwiclwiOlwiaWRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va2luZy1kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ0RhdGVcIixcImNyZWF0ZWRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJsdWUgZmx1aWQgYnV0dG9uXCIsXCJzdHlsZVwiOlwicGFkZGluZzo1cHg7bWFyZ2luLXRvcDo4cHg7Y3Vyc29yOmRlZmF1bHQ7XCJ9LFwidlwiOntcImNsaWNrXCI6e1wiblwiOlwiZ2V0ZGV0YWlsXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn1dfX0sXCJmXCI6W1wiVmlldyBEZXRhaWxzXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaHJcIn0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidHJhdmVsbGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiNcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXROYW1lXCIsXCJpXCIsXCJ0cmF2ZWxlclwiXSxcInNcIjpcIl8wKF8yW18xXS5uYW1lKVwifX1dfSxcIiDCoFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiLFwidHJhdmVsZXIubGVuZ3RoXCJdLFwic1wiOlwiXzA9PShfMS0xKVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiNcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXROYW1lXCIsXCJpXCIsXCJ0cmF2ZWxlclwiXSxcInNcIjpcIl8wKF8yW18xXS5uYW1lKVwifX1dfSxcIiDCoHzCoFwiXSxcInhcIjp7XCJyXCI6W1wiaVwiLFwidHJhdmVsZXIubGVuZ3RoXCJdLFwic1wiOlwiXzA9PShfMS0xKVwifX1dLFwiaVwiOlwiaVwiLFwiclwiOlwidHJhdmVsZXJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjMsXCJyXCI6XCJjdXJlbmN5XCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwidG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGF0dXMgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzTWVzc2FnZVwiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJ1cGNvbWluZ1wiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJteWJvb2tpbmdzLmNhcnRzXCJ9XX1dfV19O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3Mvc3VtbWFyeS5odG1sXG4vLyBtb2R1bGUgaWQgPSAzNjdcbi8vIG1vZHVsZSBjaHVua3MgPSA3IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxuICAgICAgICBRID0gcmVxdWlyZSgncScpLFxuICAgICAgICBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpXG4gICAgICAgIC8vTXl0cmF2ZWxsZXIgPSByZXF1aXJlKCdhcHAvc3RvcmVzL215dHJhdmVsbGVyL215dHJhdmVsbGVyJykgICA7XG4gICAgICAgIDtcblxuXG52YXIgdDJtID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcblxuICAgIHJldHVybiBpWzBdICogNjAgKyBpWzFdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XG4gICAgaXNvbGF0ZWQ6IHRydWUsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9teWJvb2tpbmdzL2FtZW5kbWVudC5odG1sJyksXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmb3JtYXRCaXJ0aERhdGU6IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmdldCgnbXl0cmF2ZWxsZXInKS5zZXQoJ2N1cnJlbnRUcmF2ZWxsZXIuYmlydGhkYXRlJywgZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdFRpdGxlOiBmdW5jdGlvbiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGl0bGVzKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXROYW1lOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0VHJhdmVsRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2xsJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMjogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2RkZCBNTU0gRCBZWVlZJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMzogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2RkZCBISDptbScpOy8vZm9ybWF0KCdNTU0gREQgWVlZWScpOyAgICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1czogZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMSB8fCBzdGF0dXMgPT0gMilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb25maXJtJztcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbm90Y29uZmlybSc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IDIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29uZmlybWVkJztcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ2FiYm9va2luZ1N0YXR1cycpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIF8ucmVzdWx0KF8uZmluZChzdCwgeydpZCc6IHN0YXR1c30pLCAnbmFtZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaWZmOiBmdW5jdGlvbiAoZW5kLCBzdGFydCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIG1zID0gbW9tZW50KGVuZCwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmRpZmYobW9tZW50KHN0YXJ0LCBcIllZWVktTU0tREQgaGg6bW06c3NcIikpO1xuICAgICAgICAgICAgICAgIHZhciBkID0gbW9tZW50LmR1cmF0aW9uKG1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihkLmFzSG91cnMoKSkgKyAnaCAnICsgZC5taW51dGVzKCkgKyAnbSc7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKS5mb3JtYXQoJ2xsJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3M6IGZ1bmN0aW9uIChicykge1xuICAgICAgICAgICAgICAgIGlmIChicyA9PSAxIHx8IGJzID09IDIgfHwgYnMgPT0gMyB8fCBicyA9PSA3KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJwcm9ncmVzc1wiO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJzID09IDQgfHwgYnMgPT0gNSB8fCBicyA9PSA2IHx8IGJzID09IDEyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjYW5jZWxsZWRcIjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTEpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJvb2tlZFwiO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9ybWF0Qm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChicykge1xuICAgICAgICAgICAgICAgIHZhciB0aXRsZXMgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYm9va2luZ1N0YXR1cycpO1xuICAgICAgICAgICAgICAgIHJldHVybiAgXy5yZXN1bHQoXy5maW5kKHRpdGxlcywgeydpZCc6IGJzfSksICduYW1lJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udmVydDogZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2NvdW50aW5nLmZvcm1hdE1vbmV5KGFtb3VudCwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuICAgIG9uaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICAgICB0aGlzLm9uKCdiYWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnc3VtbWFyeScsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbigncHJpbnRkaXYnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5wcmludCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbignYXNQREYnLCBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XG4gICAgICAgICAgICAvL3dpbmRvdy5sb2NhdGlvbignL2IyYy9haXJDYXJ0L2FzUERGLycraWQpO1xuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IFwiL2IyYy9haXJDYXJ0L2FzUERGL1wiICsgaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgfSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChqLCBrKSB7XG5cbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5nZXQoJ2N1cnJlbnRDYXJ0RGV0YWlscy5ib29raW5nc1snICsgaiArICddLnRyYXZlbGxlclsnICsgayArICddLnNlbGVjdGVkJyk7XG4gICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdjdXJyZW50Q2FydERldGFpbHMuYm9va2luZ3NbJyArIGogKyAnXS50cmF2ZWxsZXJbJyArIGsgKyAnXS5zZWxlY3RlZCcsICF2YWx1ZSk7XG5cbiAgICB9LFxuICAgIGFtZW5kVGlja2V0OiBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICB2YXIgY2FydCA9IHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuZ2V0KCdjdXJyZW50Q2FydERldGFpbHMnKTtcbiAgICAgICAgdmFyIGFycmF5T2ZJZHMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGNhcnQuYm9va2luZ3MsIGZ1bmN0aW9uIChiLCBia2V5KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhiLCBia2V5KTtcbiAgICAgICAgICAgIHZhciByb3V0ZUlkID0gYi5yb3V0ZXNbMF0uaWQ7XG4gICAgICAgICAgICBfLmZvckVhY2goYi50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0LCB0a2V5KSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobiwga2V5KTtcbiAgICAgICAgICAgICAgICBpZiAodC5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2godC5yb3V0ZXMsIGZ1bmN0aW9uIChyLCBya2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheU9mSWRzLnB1c2goe2FyOiByLmlkLCBhYjogdC5ib29raW5naWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codC5ib29raW5naWQrJyAgICcrci5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoYXJyYXlPZklkcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgYWxlcnQoJ05vIHBhc3NlbmdlciBpcyBzZWxlY3RlZCBmb3IgY2FuY2VsbGF0aW9uIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgLy8gY29uc29sZS5sb2coYXJyYXlPZklkcyk7XG4gICAgICAgIHZhciBhbWVuZG1lbnRUeXBlcyA9IHRoaXMuZ2V0KCdtZXRhJykuZ2V0KCdhbWVuZG1lbnRUeXBlcycpO1xuICAgICAgICB2YXIgdmlldyA9IHRoaXMuZ2V0KCdteWJvb2tpbmdzJyk7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhhbWVuZG1lbnRUeXBlcyk7XG4gICAgICAgIC8vY29uc29sZS5sb2codmlldyk7XG4gICAgICAgIHZhciBhbWVuZG1lbnRUeXBlID0gbnVsbDtcbiAgICAgICAgaWYgKHR5cGUgPT0gMSkge1xuICAgICAgICAgICAgYW1lbmRtZW50VHlwZSA9IGFtZW5kbWVudFR5cGVzLkNBTkNFTDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IDIpIHtcbiAgICAgICAgICAgIGFtZW5kbWVudFR5cGUgPSBhbWVuZG1lbnRUeXBlcy5SRVNDSEVEVUxFO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coYW1lbmRtZW50VHlwZSk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmIChhbWVuZG1lbnRUeXBlICE9IG51bGwpXG4gICAgICAgICAgICBpZiAoJCgnI2FtZW5kUmVhc29uJykudmFsKCkubGVuZ3RoIDwgNSkgeyAvLyBUaGUgcmVhc29uIGlzIHRvbyBzaG9ydFxuICAgICAgICAgICAgICAgIGFsZXJ0KCdUaGUgYW1lbmRtZW50IHJlYXNvbiBpcyB0b28gc2hvcnQuXFxuUGxlYXNlIGVudGVyIHZhbGlkIGFuZCBkZXRhaWxlZCBhbWVuZG1lbnQgcmVhc29uIScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGUgPT0gMSlcbiAgICAgICAgICAgICAgICB2YXIgeD13aW5kb3cuY29uZmlybShcIkFyZSB5b3Ugc3VyZT8gXFxuVGhpcyB3aWxsIENhbmNlbCB5b3VyIFRpY2tldCFcIik7XG4gICAgICAgICAgICBlbHNlIGlmKHR5cGUgPT0gMilcbiAgICAgICAgICAgICAgICB2YXIgeD13aW5kb3cuY29uZmlybShcIkFyZSB5b3Ugc3VyZT8gXFxuVGhpcyB3aWxsIFJlc2NoZWR1bGUgeW91ciBUaWNrZXQhXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoeCl7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5wb3N0KCcvYWlyQ2FydC9hbWVuZC8nICsgYW1lbmRtZW50VHlwZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IGFycmF5T2ZJZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFzb246ICQoJyNhbWVuZFJlYXNvbicpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdzdWNjZXNzJykge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgJyNjYXJ0QW1lbmRtZW50cyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICd3YWl0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9jYXRpb24uaGFzaCA9ICcjY2FydEFtZW5kbWVudHMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZygncmVqZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnTm90IGFibGUgdG8gY2FuY2VsLiBQbGVhc2UgY29udGFjdCBDaGVhcFRpY2tldC5pbiBzdXBwb3J0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sICdqc29uJyk7XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiAgdmlldy5yZWZyZXNoQ3VycmVudENhcnQodmlldyk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS5tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdhbWVuZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZmluaXNoZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLnVpLmNoZWNrYm94JykuY2hlY2tib3goKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcbiAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2V0dGluZycsICdjbG9zYWJsZScsIGZhbHNlKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzZXR0aW5nJywgJ29uSGlkZGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmlldy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2FtZW5kJywgZmFsc2UpO1xuICAgICAgICB9KTtcblxuXG4gICAgfSxcbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvYW1lbmRtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAzNjhcbi8vIG1vZHVsZSBjaHVua3MgPSA3IiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGxvZ2luIG1vZGFsIFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiVGlja2V0IENhbmNlbGxhdGlvblwiXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MuY2FuY2VsXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlRpY2tldCBSZXNjaGVkdWxlXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5yZXNjaGVkdWxlXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwiY29uZmlybVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImNvbnRlbnQgXCIse1widFwiOjQsXCJmXCI6W1widWkgc2VnbWVudCBsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5wZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wibXktYm9va2luZ3MtZGV0YWlscyBcIix7XCJ0XCI6NCxcImZcIjpbXCJ1aSBzZWdtZW50IGxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImdyb3VwIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3NcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZSB0aXRsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuc291cmNlXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJib29raW5ncy4wLmRlc3RpbmF0aW9uXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuc291cmNlXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJiYWNrXCJ9LFwiZlwiOltcIsKgXCJdfSx7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuZGVzdGluYXRpb25cIn1dfV0sXCJ4XCI6e1wiclwiOltcInJldHVybmRhdGVcIl0sXCJzXCI6XCJfMD09bnVsbFwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJpc011bHRpQ2l0eVwiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpcmVjdGlvblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwic291cmNlXCJ9LFwiwqAgfCDCoFwiXSxcImlcIjpcImlcIixcInJcIjpcImJvb2tpbmdzXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJyXCI6W1wiYm9va2luZ3MubGVuZ3RoXCJdLFwic1wiOlwiXzAtMVwifSxcImRlc3RpbmF0aW9uXCJdfX1dfV0sXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZVwiLFwiYm9va2luZ3MuMC5kZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGF0dXMgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzTWVzc2FnZVwiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWlkXCJ9LFwiZlwiOltcIkJvb2tpbmcgSWQ6IFwiLHtcInRcIjoyLFwiclwiOlwiaWRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va2luZy1kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ0RhdGVcIixcImNyZWF0ZWRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzaXh0ZWVuIHdpZGUgY29sdW1uIFwiLFwic3R5bGVcIjpcImhlaWdodDogYXV0byAhaW1wb3J0YW50O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudCBmbGlnaHQtaXRpbmVyYXJ5IGNvbXBhY3QgZGFya1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGl0bGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjaXR5XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInNvdXJjZVwifSxcIiDihpIgXCIse1widFwiOjIsXCJyXCI6XCJkZXN0aW5hdGlvblwifV19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlMlwiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidGltZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHR0aW1lXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRhYmxlXCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlZ21lbnRzXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImFcIjp7XCJjbGFzc1wiOlwiZGl2aWRlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCLCoFwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIsKgXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwibGF5b3ZlclwifSxcImZcIjpbXCJMYXlvdmVyOiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZGlmZlwiLFwia1wiLFwialwiLFwiYm9va2luZ3NcIl0sXCJzXCI6XCJfMChfM1tfMl0ucm91dGVzW18xXS5kZXBhcnR1cmUsXzNbXzJdLnJvdXRlc1tfMS0xXS5hcnJpdmFsKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiwqBcIl19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImtcIl0sXCJzXCI6XCJfMD4wXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwiY2Fycmllci1sb2dvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0b3AgYWxpZ25lZCBhdmF0YXIgaW1hZ2VcIixcInNyY1wiOltcIi9pbWcvYWlyX2xvZ29zL1wiLHtcInRcIjoyLFwiclwiOlwiY2FycmllclwifSxcIi5wbmdcIl0sXCJhbHRcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVyTmFtZVwifV0sXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLW5hbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllck5hbWVcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJcIn0sXCItXCIse1widFwiOjIsXCJyXCI6XCJmbGlnaHROdW1iZXJcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJhXCI6e1wiY2xhc3NcIjpcImZyb21cIixcInN0eWxlXCI6XCJ0ZXh0LWFsaWduOiByaWdodDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm9yaWdpblwifSxcIjpcIl19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlM1wiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJkZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wic3R5bGVcIjpcInRleHQtYWxpZ246IHJpZ2h0O1wiLFwiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwib3JpZ2luRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJmbGlnaHRcIn0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJjbGFzc1wiOlwidG9cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uXCJ9LFwiOlwiXX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGUzXCIsXCJhcnJpdmFsXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJhcnJpdmFsXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJhaXJwb3J0XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImRlc3RpbmF0aW9uRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lLW4tY2FiaW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0dGltZVwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwidHJhdmVsbGVyXCIse1wiclwiOltdLFwic1wiOlwiMFwifSxcImNhYmluXCJdfX1dfV19XX1dLFwiaVwiOlwia1wiLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwicm91dGVzXCJdfX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcImNsYXNzXCI6XCJwYXNzZW5nZXJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIlBhc3NlbmdlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwiLFwiZlwiOltcIkNSUyBQTlJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGhcIixcImZcIjpbXCJBaXIgUE5SXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRoXCIsXCJmXCI6W1wiVGlja2V0IE5vLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0aFwifV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcImNsYXNzPVxcXCJuZWdhdGl2ZVxcXCJcIl0sXCJuXCI6NTAsXCJyXCI6XCJzZWxlY3RlZFwifV0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ0aXRsZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImZpcnN0X25hbWVcIn0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJsYXN0X25hbWVcIn0sXCIgKFwiLHtcInRcIjoyLFwiclwiOlwidHlwZVwifSxcIikgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGF0dXMgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcInRyYXZlbGxlckJvb2tpbmdTdGF0dXNcIixcInN0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcInRyYXZlbGxlckJvb2tpbmdTdGF0dXNNZXNzYWdlXCIsXCJzdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY3JzX3BuclwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJhaXJsaW5lX3BuclwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ0aWNrZXRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgY2hlY2tib3ggXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2VsZWN0XCIsXCJhXCI6e1wiclwiOltcImpcIixcInRcIl0sXCJzXCI6XCJbXzAsXzFdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJjaGVja2JveFwiLFwibmFtZVwiOlwic2VsZWN0ZWRwYXNzZW5nZXJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiQ2FuY2VsXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5jYW5jZWxcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiUmVzY2hlZHVsZVwiXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucmVzY2hlZHVsZVwifV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInN0YXR1c1wiLFwialwiLFwiYm9va2luZ3NcIl0sXCJzXCI6XCIoXzA9PTJ8fF8wPT0xKSYmXzJbXzFdLnVwY29taW5nPT1cXFwidHJ1ZVxcXCJcIn19XX1dfV0sXCJpXCI6XCJ0XCIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJ0cmF2ZWxsZXJcIl19fV19XX1dLFwiaVwiOlwialwiLFwiclwiOlwiYm9va2luZ3NcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZm9ybVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbXCJSZWFzb24gRm9yIFwiLHtcInRcIjo0LFwiZlwiOltcIlRpY2tldCBDYW5jZWxsYXRpb25cIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLmNhbmNlbFwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJUaWNrZXQgUmVzY2hlZHVsZVwiXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucmVzY2hlZHVsZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGV4dGFyZWFcIixcImFcIjp7XCJpZFwiOlwiYW1lbmRSZWFzb25cIixcIm5hbWVcIjpcImFtZW5kUmVhc29uXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjYW5jZWxcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYW1lbmRUaWNrZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbMl1cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwibGFyZ2UgdWkgYnV0dG9uIHJlZFwifSxcImZcIjpbXCJSZXNjaGVkdWxlXCJdfV0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnJlc2NoZWR1bGVcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJhbWVuZFRpY2tldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIlsxXVwifX19LFwiYVwiOntcImNsYXNzXCI6XCJsYXJnZSB1aSBidXR0b24gcmVkXCJ9LFwiZlwiOltcIkNhbmNlbFwiXX1dLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5jYW5jZWxcIn1dfV19XX1dLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHNcIn1dfV19XX07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAvd2ViL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9hbWVuZG1lbnQuaHRtbFxuLy8gbW9kdWxlIGlkID0gMzY5XG4vLyBtb2R1bGUgY2h1bmtzID0gNyJdLCJzb3VyY2VSb290IjoiIn0=