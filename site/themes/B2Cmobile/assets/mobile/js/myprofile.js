webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(208);


/***/ },

/***/ 76:
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

/***/ 79:
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

/***/ 80:
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

/***/ 81:
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 87:
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

/***/ 88:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui selection input spinner dropdown in ",{"t":2,"r":"class"}," ",{"t":4,"f":["error"],"n":50,"r":"error"}," ",{"t":2,"x":{"r":["classes","state","large","value"],"s":"_0(_1,_2,_3)"}}]},"f":[{"t":7,"e":"input","a":{"type":"hidden","value":[{"t":2,"r":"value"}]}}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui placeholder"},"f":[{"t":2,"r":"placeholder"}]}],"n":50,"r":"large"}," ",{"t":7,"e":"div","a":{"class":"text"},"f":[{"t":2,"r":"value"}]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button inc"},"v":{"click":{"m":"inc","a":{"r":[],"s":"[]"}}},"f":["+"]}," ",{"t":7,"e":"div","a":{"class":"ui spinner button dec"},"v":{"click":{"m":"dec","a":{"r":[],"s":"[]"}}},"f":["-"]}]}]};

/***/ },

/***/ 91:
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

/***/ 92:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":["ui calendar ",{"t":4,"f":["twomonth relaxed"],"n":50,"r":"twomonth","s":true}," grid"]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"eight wide column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column center aligned month"},"f":[{"t":7,"e":"a","a":{"class":"left"},"v":{"click":{"m":"prev","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle left icon"}}]}," ",{"t":2,"x":{"r":["./worker"],"s":"_0.format(\"MMMM YYYY\")"}}]}," ",{"t":8,"r":"month"}],"x":{"r":["formatCalendar","worker","value","min","max"],"s":"_0(_1,_2,_3,_4,false)"}}]}," ",{"t":7,"e":"div","a":{"class":"eight wide column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column center aligned month"},"f":[{"t":7,"e":"a","a":{"class":"right"},"v":{"click":{"m":"next","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle right icon"}}]}," ",{"t":2,"x":{"r":["./worker"],"s":"_0.format(\"MMMM YYYY\")"}}]}," ",{"t":8,"r":"month"}],"x":{"r":["formatCalendar","worker","value","min","max"],"s":"_0(_1,_2,_3,_4,true)"}}]}],"n":50,"r":"twomonth"},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column center aligned month"},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":"left"},"v":{"click":{"m":"prev","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle left icon"}}]}," ",{"t":7,"e":"a","a":{"class":"right"},"v":{"click":{"m":"next","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":7,"e":"i","a":{"class":"triangle right icon"}}]}," ",{"t":2,"x":{"r":["./worker"],"s":"_0.format(\"MMMM YYYY\")"}}],"n":50,"x":{"r":["changeyear"],"s":"_0!=\"1\""}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"ui input select small","style":"width:30%"},"f":[{"t":7,"e":"select","a":{"id":"selectedmonth"},"v":{"change":{"m":"selectmonth","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":4,"f":[{"t":7,"e":"option","m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["selectedmonth","i"],"s":"_0==_1"}}],"a":{"value":[{"t":2,"r":"i"}]},"f":[{"t":2,"r":"."}]}],"n":52,"i":"i","x":{"r":["moment"],"s":"_0.monthsShort()"}}]}]}," ",{"t":7,"e":"div","a":{"class":"ui input select small","style":"width:30%"},"f":[{"t":7,"e":"select","a":{"id":"selectedyear"},"v":{"change":{"m":"selectyear","a":{"r":["~/worker"],"s":"[_0]"}}},"f":[{"t":4,"f":[{"t":7,"e":"option","m":[{"t":4,"f":["selected"],"n":50,"x":{"r":["selectedyear","i","yearlist"],"s":"_0==_2[_1]"}}],"a":{"value":[{"t":2,"r":"."}]},"f":[{"t":2,"r":"."}]}],"n":52,"i":"i","r":"yearlist"}]}]}],"x":{"r":["changeyear"],"s":"_0!=\"1\""}}]}," ",{"t":8,"r":"month"}],"x":{"r":["formatCalendar","worker","value","min","max"],"s":"_0(_1,_2,_3,_4,false)"}}]}],"r":"twomonth"}]}],"p":{"month":[{"t":7,"e":"div","a":{"class":"ui seven column grid weekdays center aligned"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"column inactive"},"f":[{"t":2,"r":"."}]}],"n":52,"x":{"r":["moment"],"s":"_0.weekdaysShort()"}}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui seven column grid weekdays center aligned"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["column ",{"t":2,"r":"class"}," ",{"t":4,"f":["active"],"n":50,"r":"selected"}," ",{"t":4,"f":["inactive"],"n":50,"x":{"r":["date"],"s":"!_0"}}]},"v":{"click":{"m":"setValue","a":{"r":["year","month","date"],"s":"[[_0,_1,_2]]"}}},"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"class":"day"},"f":[{"t":2,"r":"./date"}]}],"n":50,"r":"./date"}]}],"n":52,"r":"days"}]}],"n":52,"r":"weeks"}]}};

/***/ },

/***/ 134:
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

/***/ 135:
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

/***/ 208:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  Myprofile = __webpack_require__(209);
	     
	     __webpack_require__(217);
	
	$(function() {
	    (new Myprofile()).render('#app');
	});

/***/ },

/***/ 209:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	    Myprofile = __webpack_require__(79),
	    Meta = __webpack_require__(76)
	    ;
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(210),
	
	    components: {
	        'layout': __webpack_require__(72),
	        'myprofile-form': __webpack_require__(211),
	        myprofileview: __webpack_require__(215),
	       // leftpanel:require('components/layouts/profile_sidebar')
	    },
	    partials: {
	        'base-panel': __webpack_require__(71)
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
	        
	        $('.ui.checkbox', this.el).checkbox();
	    }
	});

/***/ },

/***/ 210:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":7,"e":"header","f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"id":"m_btn","class":"main_mnu","href":"#"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/bars.png","alt":"menu"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"class":"logo","href":"javascript:;"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/logo.png","alt":"CheapTicket.in"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column right aligned"},"f":[{"t":7,"e":"a","a":{"id":"right_menu","class":"profile","href":"javascript:;"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/profile.png","alt":"Profile"}}]}]}]}," ",{"t":7,"e":"div","a":{"id":"m_menu","class":"ui left vertical sidebar menu push scale down overlay"},"f":[{"t":7,"e":"div","a":{"class":"avat"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"img","a":{"id":"avatar","class":"ui avatar liitle image","src":"/themes/B2C/img/mobile/avat.png"}}," ",{"t":7,"e":"div","a":{"class":"description"},"f":["WELCOME ",{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"h1","a":{"id":"name"},"f":[{"t":2,"r":"meta.user.name"}]}],"n":50,"x":{"r":["meta.user"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"h1","a":{"id":"name"},"f":["Guest User"]}],"x":{"r":["meta.user"],"s":"_0!=null"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"a","a":{"class":"ui blue fluid button","href":"/site/logout"},"f":["Logout"]}],"n":50,"r":"meta.user"}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"prof"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/myprofile/"},"f":["My Profile"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"book"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["My Bookings"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"trav"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mytraveller/"},"f":["Travellers"]}]}]}," ",{"t":7,"e":"span","a":{"id":"devider","class":"item"},"f":["QUICK TOOLS"]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"print"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["Print / View Ticket"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"cancel"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["Cancelations"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"change"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["Change / Reschedule"]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"div","a":{"class":"box my-travellers"},"f":[{"t":7,"e":"div","a":{"class":"left"},"f":[{"t":7,"e":"div","a":{"id":"myprofile"},"f":[{"t":4,"f":[{"t":7,"e":"myprofileview","a":{"myprofile":[{"t":2,"r":"myprofile"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"x":{"r":["myprofile.edit"],"s":"!_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"myprofile-form","a":{"myprofile":[{"t":2,"r":"myprofile"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["myprofile.edit"],"s":"!_0"}}]}]}]}]}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 211:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	        _ = __webpack_require__(35),
	        moment = __webpack_require__(20),
	        Myprofile = __webpack_require__(79),
	        validate = __webpack_require__(80)
	        ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(212),
	    components: {
	        'ui-spinner': __webpack_require__(87),
	        'ui-calendar': __webpack_require__(91),
	        'ui-tel': __webpack_require__(213),
	        'ui-email': __webpack_require__(134),
	        'ui-input': __webpack_require__(34),
	        'ui-date': __webpack_require__(39),
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

/***/ 212:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"h1","f":["My Profile"]}," ",{"t":7,"e":"form","a":{"action":"javascript:;","class":"ui form basic segment flight search"},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errors"}]}]}],"n":50,"r":"errors"}," ",{"t":7,"e":"div","a":{"class":"ui two column grid "},"f":[{"t":7,"e":"div","a":{"class":"details myprofileEdit"},"f":[" ",{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"calss":"column two"},"f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Name"]}," ",{"t":7,"e":"ui-input","a":{"name":"name","placeholder":"Name","value":[{"t":2,"r":"profileform.name"}]}}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Email Address"]}," ",{"t":7,"e":"ui-email","a":{"name":"email","placeholder":"E-Mail","value":[{"t":2,"r":"profileform.email"}]}}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Mobile Number"]}," ",{"t":7,"e":"ui-tel","a":{"name":"mobile","placeholder":"Mobile","value":[{"t":2,"r":"profileform.mobile"}]}}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Address"]}," ",{"t":7,"e":"ui-input","a":{"name":"address","placeholder":"Address","value":[{"t":2,"r":"profileform.address"}]}}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Country"]}," ",{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.countrycode"}],"class":"fluid transparent","placeholder":"Country","small":"1","search":"1","options":[{"t":2,"x":{"r":["formatCountryList","meta.countrylist"],"s":"_0(_1)"}}]},"f":[]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["State"]},{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.statecode"}],"class":"fluid transparent","placeholder":"State","search":"1","small":"1","options":[{"t":2,"x":{"r":["formatStateList","statelist"],"s":"_0(_1)"}}]},"f":[]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Pincode"]}," ",{"t":7,"e":"ui-input","a":{"name":"pincode","placeholder":"Pin Code","value":[{"t":2,"r":"profileform.pincode"}]}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[" "]}]}," ",{"t":7,"e":"table","a":{"style":"display:none;"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Name"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"name","placeholder":"Name","value":[{"t":2,"r":"profileform.name"}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Email Address"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-email","a":{"name":"email","placeholder":"E-Mail","value":[{"t":2,"r":"profileform.email"}]}}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Mobile Number"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-tel","a":{"name":"mobile","placeholder":"Mobile","value":[{"t":2,"r":"profileform.mobile"}]}}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Address"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"address","placeholder":"Address","value":[{"t":2,"r":"profileform.address"}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Country"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.countrycode"}],"class":"fluid transparent","placeholder":"Country","small":"1","search":"1","options":[{"t":2,"x":{"r":["formatCountryList","meta.countrylist"],"s":"_0(_1)"}}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["State"]}," ",{"t":7,"e":"td","a":{"id":"divstate"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.statecode"}],"class":"fluid transparent","placeholder":"State","search":"1","small":"1","options":[{"t":2,"x":{"r":["formatStateList","statelist"],"s":"_0(_1)"}}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["City"]}," ",{"t":7,"e":"td","a":{"id":"divcity"},"f":[{"t":7,"e":"ui-select","a":{"value":[{"t":2,"r":"profileform.citycode"}],"class":"fluid transparent","placeholder":"City","search":"1","small":"1","options":[{"t":2,"x":{"r":["formatCityList","citylist"],"s":"_0(_1)"}}]},"f":[]}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":["Pin Code"]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ui-input","a":{"name":"pincode","placeholder":"Pin Code","value":[{"t":2,"r":"profileform.pincode"}]}}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"one column row"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":4,"f":[{"t":7,"e":"div","v":{"click":{"m":"edit","a":{"r":[],"s":"[]"}}},"a":{"class":"ui button massive fluid"},"f":["Update Profile"]}],"n":50,"r":"myprofile.edit"}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ui four column grid"},"f":[{"t":7,"e":"div","a":{"class":"row"},"f":[{"t":7,"e":"div","a":{"class":"column"}}," ",{"t":7,"e":"div","a":{"class":"column"}}," ",{"t":7,"e":"div","a":{"class":"column"}}]}," ",{"t":7,"e":"div","a":{"class":"column"}}," ",{"t":7,"e":"div","a":{"class":"column"}}," ",{"t":7,"e":"div","a":{"class":"column"}}," ",{"t":7,"e":"div","a":{"class":"column"}}]}]}]};

/***/ },

/***/ 213:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(214);
	
	var $ = __webpack_require__(8);
	
	var Input = __webpack_require__(34);
	
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

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	International Telephone Input v5.8.7
	https://github.com/Bluefieldscom/intl-tel-input.git
	*/
	// wrap in UMD - see https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
	(function(factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(8) ], __WEBPACK_AMD_DEFINE_RESULT__ = function($) {
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

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	        moment = __webpack_require__(20),
	        _ = __webpack_require__(35)
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(216),
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

/***/ 216:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"h1","f":["My Profile"]}," ",{"t":7,"e":"div","a":{"class":[{"t":4,"f":["ui segment loading"],"n":50,"r":"myprofile.pending"}]},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"user-info"},"f":[{"t":7,"e":"img","a":{"src":[{"t":2,"r":"myprofile.baseUrl"},"/themes/B2C/img/guest.png"],"alt":""}}," ",{"t":7,"e":"div","a":{"class":"name"},"f":[{"t":2,"r":"myprofile.name"}]}," ",{"t":7,"e":"div","a":{"class":"customer-id"},"f":["User Id: ",{"t":2,"r":"myprofile.id"}]}," ",{"t":7,"e":"div","a":{"class":"phone"},"f":["Mobile No: ",{"t":2,"r":"myprofile.mobile"}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"button","v":{"click":{"m":"edit","a":{"r":[],"s":"[]"}}},"a":{"class":"small gray"},"f":["Edit"]}," "]}]}," ",{"t":7,"e":"div","a":{"class":"details"},"f":[{"t":7,"e":"table","a":{"style":"display:none;"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Email Address"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.email"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Mobile Number"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.mobile"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Address"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.address"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["City"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.city"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["State"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.state"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Country"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.country"}]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"h4","a":{"class":"ui header"},"f":["Pincode"]}]}," ",{"t":7,"e":"td","f":[{"t":2,"r":"myprofile.pincode"}]}]}]}," ",{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Email Address"]}," ",{"t":2,"r":"myprofile.email"}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Mobile Number"]}," ",{"t":2,"r":"myprofile.mobile"}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Address"]}," ",{"t":2,"r":"myprofile.address"}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["City"]}," ",{"t":2,"r":"myprofile.city"}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["State"]}," ",{"t":2,"r":"myprofile.state"}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Country"]}," ",{"t":2,"r":"myprofile.country"}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Pincode"]}," ",{"t":2,"r":"myprofile.pincode"}]}]}]}],"n":50,"r":"myprofile"},{"t":4,"n":51,"f":[],"r":"myprofile"}],"n":50,"x":{"r":["myprofile.pending"],"s":"!_0"}}]}]};

/***/ },

/***/ 217:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlwcm9maWxlL21ldGEuanM/MmU3ZiIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlwcm9maWxlL215cHJvZmlsZS5qcz9kYzdhIiwid2VicGFjazovLy8uL3ZlbmRvci92YWxpZGF0ZS92YWxpZGF0ZS5qcz9mNmI1KioiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanM/MGJiYSoqIiwid2VicGFjazovLy8uL2pzL2NvcmUvZm9ybS9zcGlubmVyLmpzPzQwOWMiLCJ3ZWJwYWNrOi8vLy4vanMvdGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWw/YTE1NyIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vY2FsZW5kYXIuanM/OTdhMiIsIndlYnBhY2s6Ly8vLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NhbGVuZGFyLmh0bWw/NmNmZiIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vZW1haWwuanM/NDk0NiIsIndlYnBhY2s6Ly8vLi92ZW5kb3IvbWFpbGNoZWNrL3NyYy9tYWlsY2hlY2suanM/NGQ2ZiIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL215cHJvZmlsZS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL215cHJvZmlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL2luZGV4Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXByb2ZpbGUvZm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL2Zvcm0uaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb3JlL2Zvcm0vdGVsLmpzIiwid2VicGFjazovLy8uL3ZlbmRvci9pbnRsLXRlbC1pbnB1dC9idWlsZC9qcy9pbnRsVGVsSW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teXByb2ZpbGUvdmlldy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL3ZpZXcuaHRtbCIsIndlYnBhY2s6Ly8vLi9sZXNzL21vYmlsZS9teXRyYXZlbGxlci5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQW9DLCtDQUErQyxTQUFTLDBCQUEwQixFQUFFLEVBQUUsRUFBRTtBQUM1SDtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7QUFFRDtBQUNBLHNCQUFxQixXQUFXO0FBQ2hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQywyQkFBMkIsRUFBRTtBQUMvRDtBQUNBO0FBQ0EsY0FBYTtBQUNiLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE1BQUs7QUFDTDs7QUFFQSx1Qjs7Ozs7OztBQ25EQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1QsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFD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QkFBa0IsTUFBTSxxQkFBcUIsa0JBQWtCLE1BQU0scUJBQXFCLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLGtCQUFrQixNQUFNLHFCQUFxQixrQkFBa0IsTUFBTSxxQkFBcUIsa0JBQWtCLE1BQU0scUJBQXFCLGtCQUFrQixFQUFFLEVBQUUsRzs7Ozs7OztBQ0EzeEo7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7QUFDVCxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEVBQUMsRTs7Ozs7OztBQ2pDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsTUFBSztBQUNMO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLG1DQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7Ozs7QUMxb0NEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxNQUFLO0FBQ0w7Ozs7QUFJQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLEdBQUcsV0FBVztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsR0FBRyxZQUFZO0FBQzFCO0FBQ0EsRUFBQyxFOzs7Ozs7O0FDNUNELGlCQUFnQixZQUFZLGtDQUFrQyxNQUFNLHFCQUFxQixVQUFVLGdFQUFnRSxFQUFFLE9BQU8sWUFBWSxZQUFZLHFCQUFxQixvQkFBb0IsT0FBTyxxQkFBcUIsUUFBUSw4QkFBOEIsd0NBQXdDLE1BQU0scUJBQXFCLGVBQWUsT0FBTywyQkFBMkIsRUFBRSxNQUFNLHFCQUFxQixzQkFBc0IsbUJBQW1CLHlCQUF5QixFQUFFLE1BQU0scUJBQXFCLGdCQUFnQixxQkFBcUIsNkJBQTZCLEVBQUUsTUFBTSxxQkFBcUIsaUJBQWlCLE9BQU8sd0JBQXdCLFNBQVMsZ0JBQWdCLGtCQUFrQixNQUFNLHFCQUFxQixjQUFjLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixrQkFBa0IsT0FBTyx1QkFBdUIsc0JBQXNCLEVBQUUsT0FBTyxxQkFBcUIscUJBQXFCLG9CQUFvQixvQkFBb0IsdUJBQXVCLEVBQUUsTUFBTSxxQkFBcUIsNEJBQTRCLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixxQkFBcUIsb0JBQW9CLG9CQUFvQix1QkFBdUIsRUFBRSxNQUFNLHFCQUFxQiw2QkFBNkIsRUFBRSxFQUFFLE1BQU0scUJBQXFCLHFCQUFxQixvQkFBb0Isb0JBQW9CLGlCQUFpQixFQUFFLE1BQU0scUJBQXFCLDhCQUE4QixFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLG9CQUFvQixvQkFBb0IsY0FBYyxFQUFFLE1BQU0scUJBQXFCLDJCQUEyQixFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLG9CQUFvQixvQkFBb0IsZUFBZSxFQUFFLE1BQU0scUJBQXFCLDRCQUE0QixFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLG9CQUFvQixvQkFBb0IsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsOEJBQThCLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixxQkFBcUIsb0JBQW9CLG9CQUFvQixpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQiw4QkFBOEIsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLHVDQUF1QyxNQUFNLDRCQUE0QixFQUFFLE1BQU0scUJBQXFCLHVDQUF1QyxNQUFNLDZCQUE2QixFQUFFLE1BQU0scUJBQXFCLGlDQUFpQyxNQUFNLDhCQUE4QixFQUFFLE1BQU0scUJBQXFCLDhCQUE4QixNQUFNLDJCQUEyQixFQUFFLE1BQU0scUJBQXFCLCtCQUErQixNQUFNLDRCQUE0QixFQUFFLE1BQU0scUJBQXFCLGlDQUFpQyxNQUFNLDhCQUE4QixFQUFFLE1BQU0scUJBQXFCLGlDQUFpQyxNQUFNLDhCQUE4QixFQUFFLEVBQUUsRUFBRSx5QkFBeUIsRUFBRSxvQ0FBb0MsY0FBYyxxQ0FBcUMsRUFBRSxHOzs7Ozs7O0FDQWowRiwwQyIsImZpbGUiOiJqcy9teXByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIFZpZXcgPSByZXF1aXJlKCdjb3JlL3N0b3JlJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gVmlldy5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZWxlY3Q6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlczogZnVuY3Rpb24oKSB7IHJldHVybiBfLm1hcCh2aWV3LmdldCgndGl0bGVzJyksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IGkuaWQsIHRleHQ6IGkubmFtZSB9OyB9KTsgfSxcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5NZXRhLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIG5ldyBNZXRhKHtkYXRhOiBkYXRhfSk7XHJcbn07XHJcblxyXG5NZXRhLmZldGNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy91c2Vycy9tZXRhJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyByZXNvbHZlKE1ldGEucGFyc2UoZGF0YSkpOyB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxudmFyIGluc3RhbmNlID0gbnVsbDtcclxuTWV0YS5pbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RhbmNlID0gTWV0YS5mZXRjaCgpO1xyXG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9zdG9yZXMvbXlwcm9maWxlL21ldGEuanNcbiAqKiBtb2R1bGUgaWQgPSA3NlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDRcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgdmFsaWRhdGUgPSByZXF1aXJlKCd2YWxpZGF0ZScpXHJcbiAgICBcclxuICAgIDtcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKSAgO1xyXG5cclxudmFyIE15cHJvZmlsZSA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIHByaWNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXy5yZWR1Y2UodGhpcy5nZXQoJyAnKSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0U3RhdGVMaXN0OiBmdW5jdGlvbiAodmlldykge1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coXCJnZXRTdGF0ZUxpc3RcIik7XHJcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy91c2Vycy9nZXRTdGF0ZUxpc3QvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ3Byb2ZpbGVmb3JtLmNvdW50cnljb2RlJykpLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RhdGVsaXN0JyxudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3RhdGVsaXN0JywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScsIHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy51cGRhdGUoJ3Byb2ZpbGVmb3JtLnN0YXRlY29kZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZmluc2loZWQgc3RvcmU6ICcpO1xyXG4gICAgICAgICAgICB2YXIgdGVtcD12aWV3LmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJyk7XHJcbiAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCBudWxsKTtcclxuICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCB0ZW1wKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRDaXR5TGlzdDogZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ2V0Q2l0eUxpc3RcIik7XHJcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2IyYy91c2Vycy9nZXRDaXR5TGlzdC8nICsgXy5wYXJzZUludCh2aWV3LmdldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJykpLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjaXR5bGlzdCcsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5jaXR5Y29kZScsIHZpZXcuZ2V0KCdwcm9maWxlZm9ybS5jaXR5Y29kZScpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgJCgnI2RpdmNpdHkgLnVpLmRyb3Bkb3duJykuZHJvcGRvd24oJ3NldCBzZWxlY3RlZCcsICQoJyNkaXZjaXR5IC5pdGVtLmFjdGl2ZS5zZWxlY3RlZCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbn0pO1xyXG5cclxuTXlwcm9maWxlLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7ICBcclxuICAgICAgICAgICBkYXRhLmJhc2VVcmw9Jyc7XHJcbiAgICAgICAgICAgIGRhdGEuYWRkPWZhbHNlO1xyXG4gICAgICAgICAgICBkYXRhLmVkaXQ9ZmFsc2U7ICAgICAgICAgICBcclxuICAgICAgICAgICAgZGF0YS5wZW5kaW5nPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICByZXR1cm4gbmV3IE15cHJvZmlsZSh7ZGF0YTogZGF0YX0pO1xyXG5cclxufTtcclxuTXlwcm9maWxlLmZldGNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy91c2Vycy9nZXRQcm9maWxlJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyAgcmVzb2x2ZShNeXByb2ZpbGUucGFyc2UoZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZhaWxlZFwiKTtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeXByb2ZpbGU7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teXByb2ZpbGUvbXlwcm9maWxlLmpzXG4gKiogbW9kdWxlIGlkID0gNzlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSA0XG4gKiovIiwiLy8gICAgIFZhbGlkYXRlLmpzIDAuNy4xXG5cbi8vICAgICAoYykgMjAxMy0yMDE1IE5pY2tsYXMgQW5zbWFuLCAyMDEzIFdyYXBwXG4vLyAgICAgVmFsaWRhdGUuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly92YWxpZGF0ZWpzLm9yZy9cblxuKGZ1bmN0aW9uKGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cy5cbiAgLy8gVGhlIG9wdGlvbnMgYXJlIHRoZSBmb2xsb3dpbmc6XG4gIC8vICAgLSBmb3JtYXQgKHN0cmluZykgLSBBbiBvcHRpb24gdGhhdCBjb250cm9scyBob3cgdGhlIHJldHVybmVkIHZhbHVlIGlzIGZvcm1hdHRlZFxuICAvLyAgICAgKiBmbGF0IC0gUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YganVzdCB0aGUgZXJyb3IgbWVzc2FnZXNcbiAgLy8gICAgICogZ3JvdXBlZCAtIFJldHVybnMgdGhlIG1lc3NhZ2VzIGdyb3VwZWQgYnkgYXR0cmlidXRlIChkZWZhdWx0KVxuICAvLyAgICAgKiBkZXRhaWxlZCAtIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJhdyB2YWxpZGF0aW9uIGRhdGFcbiAgLy8gICAtIGZ1bGxNZXNzYWdlcyAoYm9vbGVhbikgLSBJZiBgdHJ1ZWAgKGRlZmF1bHQpIHRoZSBhdHRyaWJ1dGUgbmFtZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGVycm9yLlxuICAvL1xuICAvLyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBvcHRpb25zIGFyZSBhbHNvIHBhc3NlZCB0byBlYWNoIHZhbGlkYXRvci5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpXG4gICAgICAsIGF0dHJcbiAgICAgICwgdmFsaWRhdG9yO1xuXG4gICAgZm9yIChhdHRyIGluIHJlc3VsdHMpIHtcbiAgICAgIGZvciAodmFsaWRhdG9yIGluIHJlc3VsdHNbYXR0cl0pIHtcbiAgICAgICAgaWYgKHYuaXNQcm9taXNlKHJlc3VsdHNbYXR0cl1bdmFsaWRhdG9yXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2UgdmFsaWRhdGUuYXN5bmMgaWYgeW91IHdhbnQgc3VwcG9ydCBmb3IgcHJvbWlzZXNcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRlLnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICB2YXIgdiA9IHZhbGlkYXRlO1xuXG4gIC8vIENvcGllcyBvdmVyIGF0dHJpYnV0ZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2VzIHRvIGEgc2luZ2xlIGRlc3RpbmF0aW9uLlxuICAvLyBWZXJ5IG11Y2ggc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgZXh0ZW5kLlxuICAvLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHRhcmdldCBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIHdpbGwgYmVcbiAgLy8gdXNlZCBhcyB0YXJnZXRzLlxuICB2LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgYXR0ciBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW2F0dHJdID0gc291cmNlW2F0dHJdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgdi5leHRlbmQodmFsaWRhdGUsIHtcbiAgICAvLyBUaGlzIGlzIHRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IGFzIGEgc2VtdmVyLlxuICAgIC8vIFRoZSB0b1N0cmluZyBmdW5jdGlvbiB3aWxsIGFsbG93IGl0IHRvIGJlIGNvZXJjZWQgaW50byBhIHN0cmluZ1xuICAgIHZlcnNpb246IHtcbiAgICAgIG1ham9yOiAwLFxuICAgICAgbWlub3I6IDcsXG4gICAgICBwYXRjaDogMSxcbiAgICAgIG1ldGFkYXRhOiBudWxsLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHYuZm9ybWF0KFwiJXttYWpvcn0uJXttaW5vcn0uJXtwYXRjaH1cIiwgdi52ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2LmlzRW1wdHkodi52ZXJzaW9uLm1ldGFkYXRhKSkge1xuICAgICAgICAgIHZlcnNpb24gKz0gXCIrXCIgKyB2LnZlcnNpb24ubWV0YWRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEJlbG93IGlzIHRoZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgdXNlZCBpbiB2YWxpZGF0ZS5qc1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIElmIHlvdSBhcmUgdXNpbmcgUS5qcywgUlNWUCBvciBhbnkgb3RoZXIgQSsgY29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIG92ZXJyaWRlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGF0IHByb21pc2UuXG4gICAgLy8gU2luY2UgalF1ZXJ5IHByb21pc2VzIGFyZW4ndCBBKyBjb21wYXRpYmxlIHRoZXkgd29uJ3Qgd29yay5cbiAgICBQcm9taXNlOiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFByb21pc2UgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgLy8gSWYgbW9tZW50IGlzIHVzZWQgaW4gbm9kZSwgYnJvd3NlcmlmeSBldGMgcGxlYXNlIHNldCB0aGlzIGF0dHJpYnV0ZVxuICAgIC8vIGxpa2UgdGhpczogYHZhbGlkYXRlLm1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG4gICAgbW9tZW50OiB0eXBlb2YgbW9tZW50ICE9PSBcInVuZGVmaW5lZFwiID8gbW9tZW50IDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIFhEYXRlOiB0eXBlb2YgWERhdGUgIT09IFwidW5kZWZpbmVkXCIgPyBYRGF0ZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBFTVBUWV9TVFJJTkdfUkVHRVhQOiAvXlxccyokLyxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cyBvYmplY3QuXG4gICAgLy8gV2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIGZvcm1hdDpcbiAgICAvLyAgICAgW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZSBuYW1lPlwiLCBlcnJvcjogXCI8dmFsaWRhdGlvbiByZXN1bHQ+XCJ9LCAuLi5dXG4gICAgcnVuVmFsaWRhdGlvbnM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgICwgYXR0clxuICAgICAgICAsIHZhbGlkYXRvck5hbWVcbiAgICAgICAgLCB2YWx1ZVxuICAgICAgICAsIHZhbGlkYXRvcnNcbiAgICAgICAgLCB2YWxpZGF0b3JcbiAgICAgICAgLCB2YWxpZGF0b3JPcHRpb25zXG4gICAgICAgICwgZXJyb3I7XG5cbiAgICAgIGlmICh2LmlzRG9tRWxlbWVudChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jb2xsZWN0Rm9ybVZhbHVlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcHMgdGhyb3VnaCBlYWNoIGNvbnN0cmFpbnRzLCBmaW5kcyB0aGUgY29ycmVjdCB2YWxpZGF0b3IgYW5kIHJ1biBpdC5cbiAgICAgIGZvciAoYXR0ciBpbiBjb25zdHJhaW50cykge1xuICAgICAgICB2YWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIGF0dHIpO1xuICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludHMgZm9yIGFuIGF0dHJpYnV0ZSB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgdmFsaWRhdG9ycyA9IHYucmVzdWx0KGNvbnN0cmFpbnRzW2F0dHJdLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuXG4gICAgICAgIGZvciAodmFsaWRhdG9yTmFtZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgdmFsaWRhdG9yID0gdi52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gdi5mb3JtYXQoXCJVbmtub3duIHZhbGlkYXRvciAle25hbWV9XCIsIHtuYW1lOiB2YWxpZGF0b3JOYW1lfSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBvcHRpb25zIHRvIGJlIGEgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlXG4gICAgICAgICAgLy8gY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHYucmVzdWx0KHZhbGlkYXRvck9wdGlvbnMsIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3JPcHRpb25zKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvcjogdmFsaWRhdG9yLmNhbGwodmFsaWRhdG9yLCB2YWx1ZSwgdmFsaWRhdG9yT3B0aW9ucywgYXR0cixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG5cbiAgICAvLyBUYWtlcyB0aGUgb3V0cHV0IGZyb20gcnVuVmFsaWRhdGlvbnMgYW5kIGNvbnZlcnRzIGl0IHRvIHRoZSBjb3JyZWN0XG4gICAgLy8gb3V0cHV0IGZvcm1hdC5cbiAgICBwcm9jZXNzVmFsaWRhdGlvblJlc3VsdHM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIGVycm9ycyA9IHYucHJ1bmVFbXB0eUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5leHBhbmRNdWx0aXBsZUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5jb252ZXJ0RXJyb3JNZXNzYWdlcyhlcnJvcnMsIG9wdGlvbnMpO1xuXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMuZm9ybWF0IHx8IFwiZ3JvdXBlZFwiKSB7XG4gICAgICAgIGNhc2UgXCJkZXRhaWxlZFwiOlxuICAgICAgICAgIC8vIERvIG5vdGhpbmcgbW9yZSB0byB0aGUgZXJyb3JzXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImZsYXRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9ycyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdyb3VwZWRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNbYXR0cl0gPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9yc1thdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHYuZm9ybWF0KFwiVW5rbm93biBmb3JtYXQgJXtmb3JtYXR9XCIsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuaXNFbXB0eShlcnJvcnMpID8gdW5kZWZpbmVkIDogZXJyb3JzO1xuICAgIH0sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0aW9ucyB3aXRoIHN1cHBvcnQgZm9yIHByb21pc2VzLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCB3aGVuIGFsbCB0aGVcbiAgICAvLyB2YWxpZGF0aW9uIHByb21pc2VzIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gICAgLy8gSXQgY2FuIGJlIGNhbGxlZCBldmVuIGlmIG5vIHZhbGlkYXRpb25zIHJldHVybmVkIGEgcHJvbWlzZS5cbiAgICBhc3luYzogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5hc3luYy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2LndhaXRGb3JSZXN1bHRzKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVycm9ycyA9IHYucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpbmdsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuc2luZ2xlLm9wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgZm9ybWF0OiBcImZsYXRcIixcbiAgICAgICAgZnVsbE1lc3NhZ2VzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdih7c2luZ2xlOiB2YWx1ZX0sIHtzaW5nbGU6IGNvbnN0cmFpbnRzfSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgcHJvbWlzZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcbiAgICAvLyBhcmUgc2V0dGxlZC4gVGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzIGFsd2F5cyByZXNvbHZlZCxcbiAgICAvLyBuZXZlciByZWplY3RlZC5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBpbnB1dCBhcmd1bWVudCwgaXQgcmVwbGFjZXMgdGhlIHByb21pc2VzXG4gICAgLy8gd2l0aCB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgcHJvbWlzZS5cbiAgICB3YWl0Rm9yUmVzdWx0czogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgLy8gQ3JlYXRlIGEgc2VxdWVuY2Ugb2YgYWxsIHRoZSByZXN1bHRzIHN0YXJ0aW5nIHdpdGggYSByZXNvbHZlZCBwcm9taXNlLlxuICAgICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHJlc3VsdCkge1xuICAgICAgICAvLyBJZiB0aGlzIHJlc3VsdCBpc24ndCBhIHByb21pc2Ugc2tpcCBpdCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIGlmICghdi5pc1Byb21pc2UocmVzdWx0LmVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lbW8udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmVycm9yLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAvLyBJZiBmb3Igc29tZSByZWFzb24gdGhlIHZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgbm9cbiAgICAgICAgICAgICAgLy8gZXJyb3Igd2FzIHNwZWNpZmllZC5cbiAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHYud2FybihcIlZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgZGlkbid0IHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcigpOyB9KSk7IC8vIEEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIH0sXG5cbiAgICAvLyBJZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBjYWxsOiBmdW5jdGlvbiB0aGUgYW5kOiBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlXG4gICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZS4gQWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXNcbiAgICAvLyBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmVzdWx0KCdmb28nKSAvLyAnZm9vJ1xuICAgIC8vIHJlc3VsdChNYXRoLm1heCwgMSwgMikgLy8gMlxuICAgIC8vIGBgYFxuICAgIHJlc3VsdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLiBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IGNvbnNpZGVyIE5hTiBhXG4gICAgLy8gbnVtYmVyIGxpa2UgbWFueSBvdGhlciBgaXNOdW1iZXJgIGZ1bmN0aW9ucyBkby5cbiAgICBpc051bWJlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBub3QgYSBmdW5jdGlvblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0sXG5cbiAgICAvLyBBIHNpbXBsZSBjaGVjayB0byB2ZXJpZnkgdGhhdCB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlci4gVXNlcyBgaXNOdW1iZXJgXG4gICAgLy8gYW5kIGEgc2ltcGxlIG1vZHVsbyBjaGVjay5cbiAgICBpc0ludGVnZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgJSAxID09PSAwO1xuICAgIH0sXG5cbiAgICAvLyBVc2VzIHRoZSBgT2JqZWN0YCBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYW4gb2JqZWN0LlxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICAgIH0sXG5cbiAgICAvLyBTaW1wbHkgY2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBkYXRlXG4gICAgaXNEYXRlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgYG51bGxgIG9mIGB1bmRlZmluZWRgXG4gICAgaXNEZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBwcm9taXNlLiBBbnl0aGluZyB3aXRoIGEgYHRoZW5gXG4gICAgLy8gZnVuY3Rpb24gaXMgY29uc2lkZXJlZCBhIHByb21pc2UuXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gISFwICYmIHYuaXNGdW5jdGlvbihwLnRoZW4pO1xuICAgIH0sXG5cbiAgICBpc0RvbUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvckFsbCkgfHwgIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3QoZG9jdW1lbnQpICYmIG8gPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvNjk5MzA0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG8gJiZcbiAgICAgICAgICB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgICBvLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgLy8gTnVsbCBhbmQgdW5kZWZpbmVkIGFyZSBlbXB0eVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaXRlc3BhY2Ugb25seSBzdHJpbmdzIGFyZSBlbXB0eVxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2LkVNUFRZX1NUUklOR19SRUdFWFAudGVzdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBhcnJheXMgd2UgdXNlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgIGlmICh2LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIGhhdmUgbm8gYXR0cmlidXRlcyBidXQgYXJlbid0IGVtcHR5XG4gICAgICBpZiAodi5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgZmluZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkgd2UgY29uc2lkZXIgaXQgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEZvcm1hdHMgdGhlIHNwZWNpZmllZCBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHZhbHVlcyBsaWtlIHNvOlxuICAgIC8vIGBgYFxuICAgIC8vIGZvcm1hdChcIkZvbzogJXtmb299XCIsIHtmb286IFwiYmFyXCJ9KSAvLyBcIkZvbyBiYXJcIlxuICAgIC8vIGBgYFxuICAgIC8vIElmIHlvdSB3YW50IHRvIHdyaXRlICV7Li4ufSB3aXRob3V0IGhhdmluZyBpdCByZXBsYWNlZCBzaW1wbHlcbiAgICAvLyBwcmVmaXggaXQgd2l0aCAlIGxpa2UgdGhpcyBgRm9vOiAlJXtmb299YCBhbmQgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIGFzIGBcIkZvbzogJXtmb299XCJgXG4gICAgZm9ybWF0OiB2LmV4dGVuZChmdW5jdGlvbihzdHIsIHZhbHMpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSh2LmZvcm1hdC5GT1JNQVRfUkVHRVhQLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgIGlmIChtMSA9PT0gJyUnKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJXtcIiArIG0yICsgXCJ9XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWxzW20yXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgIC8vIEZpbmRzICV7a2V5fSBzdHlsZSBwYXR0ZXJucyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICBGT1JNQVRfUkVHRVhQOiAvKCU/KSVcXHsoW15cXH1dKylcXH0vZ1xuICAgIH0pLFxuXG4gICAgLy8gXCJQcmV0dGlmaWVzXCIgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAvLyBQcmV0dGlmeWluZyBtZWFucyByZXBsYWNpbmcgWy5cXF8tXSB3aXRoIHNwYWNlcyBhcyB3ZWxsIGFzIHNwbGl0dGluZ1xuICAgIC8vIGNhbWVsIGNhc2Ugd29yZHMuXG4gICAgcHJldHRpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHYuaXNOdW1iZXIoc3RyKSkge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDIgZGVjaW1hbHMgcm91bmQgaXQgdG8gdHdvXG4gICAgICAgIGlmICgoc3RyICogMTAwKSAlIDEgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHN0ciAqIDEwMCkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNBcnJheShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHYucHJldHRpZnkocyk7IH0pLmpvaW4oXCIsIFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgc3RyaW5nIGlzIGFjdHVhbGx5IGEgc3RyaW5nXG4gICAgICBzdHIgPSBcIlwiICsgc3RyO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC8vIFNwbGl0cyBrZXlzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXHNdKVxcLihbXlxcc10pL2csICckMSAkMicpXG4gICAgICAgIC8vIFJlbW92ZXMgYmFja3NsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwrL2csICcnKVxuICAgICAgICAvLyBSZXBsYWNlcyAtIGFuZCAtIHdpdGggc3BhY2VcbiAgICAgICAgLnJlcGxhY2UoL1tfLV0vZywgJyAnKVxuICAgICAgICAvLyBTcGxpdHMgY2FtZWwgY2FzZWQgd29yZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIG0xICsgXCIgXCIgKyBtMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgc3RyaW5naWZ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5wcmV0dGlmeSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIGluIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0RGVlcE9iamVjdFZhbHVlOiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIGlmICghdi5pc09iamVjdChvYmopIHx8ICF2LmlzU3RyaW5nKGtleXBhdGgpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiXG4gICAgICAgICwgaVxuICAgICAgICAsIGVzY2FwZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cGF0aC5sZW5ndGg7ICsraSkge1xuICAgICAgICBzd2l0Y2ggKGtleXBhdGhbaV0pIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnLic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgICAgICAgICAgIGtleSA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnXFxcXCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cGF0aFtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzRGVmaW5lZChvYmopICYmIGtleSBpbiBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVGhpcyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtLlxuICAgIC8vIEl0IHVzZXMgdGhlIGlucHV0IG5hbWUgYXMga2V5IGFuZCB0aGUgdmFsdWUgYXMgdmFsdWVcbiAgICAvLyBTbyBmb3IgZXhhbXBsZSB0aGlzOlxuICAgIC8vIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiZm9vQGJhci5jb21cIiAvPlxuICAgIC8vIHdvdWxkIHJldHVybjpcbiAgICAvLyB7ZW1haWw6IFwiZm9vQGJhci5jb21cIn1cbiAgICBjb2xsZWN0Rm9ybVZhbHVlczogZnVuY3Rpb24oZm9ybSwgb3B0aW9ucykge1xuICAgICAgdmFyIHZhbHVlcyA9IHt9XG4gICAgICAgICwgaVxuICAgICAgICAsIGlucHV0XG4gICAgICAgICwgaW5wdXRzXG4gICAgICAgICwgdmFsdWU7XG5cbiAgICAgIGlmICghZm9ybSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF0dHJpYnV0ZXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0udmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LFxuXG4gICAgc2FuaXRpemVGb3JtVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmltICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5udWxsaWZ5ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgYWxsIGVycm9ycyB3aG8ncyBlcnJvciBhdHRyaWJ1dGUgaXMgZW1wdHkgKG51bGwgb3IgdW5kZWZpbmVkKVxuICAgIHBydW5lRW1wdHlFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICF2LmlzRW1wdHkoZXJyb3IuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIEluXG4gICAgLy8gW3tlcnJvcjogW1wiZXJyMVwiLCBcImVycjJcIl0sIC4uLn1dXG4gICAgLy8gT3V0XG4gICAgLy8gW3tlcnJvcjogXCJlcnIxXCIsIC4uLn0sIHtlcnJvcjogXCJlcnIyXCIsIC4uLn1dXG4gICAgLy9cbiAgICAvLyBBbGwgYXR0cmlidXRlcyBpbiBhbiBlcnJvciB3aXRoIG11bHRpcGxlIG1lc3NhZ2VzIGFyZSBkdXBsaWNhdGVkXG4gICAgLy8gd2hlbiBleHBhbmRpbmcgdGhlIGVycm9ycy5cbiAgICBleHBhbmRNdWx0aXBsZUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBSZW1vdmVzIGVycm9ycyB3aXRob3V0IGEgbWVzc2FnZVxuICAgICAgICBpZiAodi5pc0FycmF5KGVycm9yLmVycm9yKSkge1xuICAgICAgICAgIGVycm9yLmVycm9yLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3IsIHtlcnJvcjogbXNnfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0cyB0aGUgZXJyb3IgbWVzYWdlcyBieSBwcmVwZW5kaW5nIHRoZSBhdHRyaWJ1dGUgbmFtZSB1bmxlc3MgdGhlXG4gICAgLy8gbWVzc2FnZSBpcyBwcmVmaXhlZCBieSBeXG4gICAgY29udmVydEVycm9yTWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9ySW5mbykge1xuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckluZm8uZXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yWzBdID09PSAnXicpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yLnNsaWNlKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZnVsbE1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVycm9yID0gdi5jYXBpdGFsaXplKHYucHJldHRpZnkoZXJyb3JJbmZvLmF0dHJpYnV0ZSkpICsgXCIgXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IGVycm9yLnJlcGxhY2UoL1xcXFxcXF4vZywgXCJeXCIpO1xuICAgICAgICBlcnJvciA9IHYuZm9ybWF0KGVycm9yLCB7dmFsdWU6IHYuc3RyaW5naWZ5VmFsdWUoZXJyb3JJbmZvLnZhbHVlKX0pO1xuICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3JJbmZvLCB7ZXJyb3I6IGVycm9yfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8ge1wiPGF0dHJpYnV0ZU5hbWU+XCI6IFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XX1cbiAgICBncm91cEVycm9yc0J5QXR0cmlidXRlOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBsaXN0ID0gcmV0W2Vycm9yLmF0dHJpYnV0ZV07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgbGlzdC5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXRbZXJyb3IuYXR0cmlidXRlXSA9IFtlcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3tlcnJvcjogXCI8bWVzc2FnZSAxPlwiLCAuLi59LCB7ZXJyb3I6IFwiPG1lc3NhZ2UgMj5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8gW1wiPG1lc3NhZ2UgMT5cIiwgXCI8bWVzc2FnZSAyPlwiXVxuICAgIGZsYXR0ZW5FcnJvcnNUb0FycmF5OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKSB7IHJldHVybiBlcnJvci5lcnJvcjsgfSk7XG4gICAgfSxcblxuICAgIGV4cG9zZU1vZHVsZTogZnVuY3Rpb24odmFsaWRhdGUsIHJvb3QsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgICBpZiAodmFsaWRhdGUuaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXJuOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7XG4gICAgLy8gUHJlc2VuY2UgdmFsaWRhdGVzIHRoYXQgdGhlIHZhbHVlIGlzbid0IGVtcHR5XG4gICAgcHJlc2VuY2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImNhbid0IGJlIGJsYW5rXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpcyA9IG9wdGlvbnMuaXNcbiAgICAgICAgLCBtYXhpbXVtID0gb3B0aW9ucy5tYXhpbXVtXG4gICAgICAgICwgbWluaW11bSA9IG9wdGlvbnMubWluaW11bVxuICAgICAgICAsIHRva2VuaXplciA9IG9wdGlvbnMudG9rZW5pemVyIHx8IGZ1bmN0aW9uKHZhbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICwgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW107XG5cbiAgICAgIHZhbHVlID0gdG9rZW5pemVyKHZhbHVlKTtcbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICBpZighdi5pc051bWJlcihsZW5ndGgpKSB7XG4gICAgICAgIHYuZXJyb3Iodi5mb3JtYXQoXCJBdHRyaWJ1dGUgJXthdHRyfSBoYXMgYSBub24gbnVtZXJpYyB2YWx1ZSBmb3IgYGxlbmd0aGBcIiwge2F0dHI6IGF0dHJpYnV0ZX0pKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaGFzIGFuIGluY29ycmVjdCBsZW5ndGhcIjtcbiAgICAgIH1cblxuICAgICAgLy8gSXMgY2hlY2tzXG4gICAgICBpZiAodi5pc051bWJlcihpcykgJiYgbGVuZ3RoICE9PSBpcykge1xuICAgICAgICBlcnIgPSBvcHRpb25zLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIFwiaXMgdGhlIHdyb25nIGxlbmd0aCAoc2hvdWxkIGJlICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBpc30pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWluaW11bSkgJiYgbGVuZ3RoIDwgbWluaW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb1Nob3J0IHx8XG4gICAgICAgICAgdGhpcy50b29TaG9ydCB8fFxuICAgICAgICAgIFwiaXMgdG9vIHNob3J0IChtaW5pbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtaW5pbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtYXhpbXVtKSAmJiBsZW5ndGggPiBtYXhpbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTG9uZyB8fFxuICAgICAgICAgIHRoaXMudG9vTG9uZyB8fFxuICAgICAgICAgIFwiaXMgdG9vIGxvbmcgKG1heGltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1heGltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bWVyaWNhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgICAsIG5hbWVcbiAgICAgICAgLCBjb3VudFxuICAgICAgICAsIGNoZWNrcyA9IHtcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuOiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID4gYzsgfSxcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID49IGM7IH0sXG4gICAgICAgICAgICBlcXVhbFRvOiAgICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA9PT0gYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuOiAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDwgYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDw9IGM7IH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBDb2VyY2UgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIHVubGVzcyB3ZSdyZSBiZWluZyBzdHJpY3QuXG4gICAgICBpZiAob3B0aW9ucy5ub1N0cmluZ3MgIT09IHRydWUgJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIHdlIHNob3VsZG4ndCBjb250aW51ZSBzaW5jZSBpdCB3aWxsIGNvbXBhcmUgaXQuXG4gICAgICBpZiAoIXYuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImlzIG5vdCBhIG51bWJlclwiO1xuICAgICAgfVxuXG4gICAgICAvLyBTYW1lIGxvZ2ljIGFzIGFib3ZlLCBzb3J0IG9mLiBEb24ndCBib3RoZXIgd2l0aCBjb21wYXJpc29ucyBpZiB0aGlzXG4gICAgICAvLyBkb2Vzbid0IHBhc3MuXG4gICAgICBpZiAob3B0aW9ucy5vbmx5SW50ZWdlciAmJiAhdi5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RJbnRlZ2VyICB8fCBcIm11c3QgYmUgYW4gaW50ZWdlclwiO1xuICAgICAgfVxuXG4gICAgICBmb3IgKG5hbWUgaW4gY2hlY2tzKSB7XG4gICAgICAgIGNvdW50ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgaWYgKHYuaXNOdW1iZXIoY291bnQpICYmICFjaGVja3NbbmFtZV0odmFsdWUsIGNvdW50KSkge1xuICAgICAgICAgIC8vIFRoaXMgcGlja3MgdGhlIGRlZmF1bHQgbWVzc2FnZSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZSB0aGUgZ3JlYXRlclRoYW4gY2hlY2sgdXNlcyB0aGUgbWVzc2FnZSBmcm9tXG4gICAgICAgICAgLy8gdGhpcy5ub3RHcmVhdGVyVGhhbiBzbyB3ZSBjYXBpdGFsaXplIHRoZSBuYW1lIGFuZCBwcmVwZW5kIFwibm90XCJcbiAgICAgICAgICB2YXIgbXNnID0gdGhpc1tcIm5vdFwiICsgdi5jYXBpdGFsaXplKG5hbWUpXSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlICV7dHlwZX0gJXtjb3VudH1cIjtcblxuICAgICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KG1zZywge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgdHlwZTogdi5wcmV0dGlmeShuYW1lKVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5vZGQgJiYgdmFsdWUgJSAyICE9PSAxKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90T2RkIHx8IFwibXVzdCBiZSBvZGRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5ldmVuICYmIHZhbHVlICUgMiAhPT0gMCkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdEV2ZW4gfHwgXCJtdXN0IGJlIGV2ZW5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZXRpbWU6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW11cbiAgICAgICAgLCBlYXJsaWVzdCA9IG9wdGlvbnMuZWFybGllc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMuZWFybGllc3QsIG9wdGlvbnMpIDogTmFOXG4gICAgICAgICwgbGF0ZXN0ID0gb3B0aW9ucy5sYXRlc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMubGF0ZXN0LCBvcHRpb25zKSA6IE5hTjtcblxuICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlKHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgLy8gODY0MDAwMDAgaXMgdGhlIG51bWJlciBvZiBzZWNvbmRzIGluIGEgZGF5LCB0aGlzIGlzIHVzZWQgdG8gcmVtb3ZlXG4gICAgICAvLyB0aGUgdGltZSBmcm9tIHRoZSBkYXRlXG4gICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IG9wdGlvbnMuZGF0ZU9ubHkgJiYgdmFsdWUgJSA4NjQwMDAwMCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJtdXN0IGJlIGEgdmFsaWQgZGF0ZVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGVhcmxpZXN0KSAmJiB2YWx1ZSA8IGVhcmxpZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vRWFybHkgfHwgXCJtdXN0IGJlIG5vIGVhcmxpZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGVhcmxpZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGxhdGVzdCkgJiYgdmFsdWUgPiBsYXRlc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29MYXRlIHx8IFwibXVzdCBiZSBubyBsYXRlciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQobGF0ZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb252ZXJ0IGlucHV0IHRvIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIG1pbGxpcyBzaW5jZSB0aGUgZXBvY2guXG4gICAgICAvLyBJdCBzaG91bGQgcmV0dXJuIE5hTiBpZiBpdCdzIG5vdCBhIHZhbGlkIGRhdGUuXG4gICAgICBwYXJzZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgdi5YRGF0ZSh2YWx1ZSwgdHJ1ZSkuZ2V0VGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIHJldHVybiArdi5tb21lbnQudXRjKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH0sXG4gICAgICAvLyBGb3JtYXRzIHRoZSBnaXZlbiB0aW1lc3RhbXAuIFVzZXMgSVNPODYwMSB0byBmb3JtYXQgdGhlbS5cbiAgICAgIC8vIElmIG9wdGlvbnMuZGF0ZU9ubHkgaXMgdHJ1ZSB0aGVuIG9ubHkgdGhlIHllYXIsIG1vbnRoIGFuZCBkYXkgd2lsbCBiZVxuICAgICAgLy8gb3V0cHV0LlxuICAgICAgZm9ybWF0OiBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSBvcHRpb25zLmRhdGVGb3JtYXQ7XG5cbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwieXl5eS1NTS1kZFwiIDogXCJ5eXl5LU1NLWRkIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiBuZXcgWERhdGUoZGF0ZSwgdHJ1ZSkudG9TdHJpbmcoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcIllZWVktTU0tRERcIiA6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gdi5tb21lbnQudXRjKGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH0pLFxuICAgIGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIG9wdGlvbnMsIHtkYXRlT25seTogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHYudmFsaWRhdG9ycy5kYXRldGltZS5jYWxsKHYudmFsaWRhdG9ycy5kYXRldGltZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykgfHwgKG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7cGF0dGVybjogb3B0aW9uc307XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgaW52YWxpZFwiXG4gICAgICAgICwgcGF0dGVybiA9IG9wdGlvbnMucGF0dGVyblxuICAgICAgICAsIG1hdGNoO1xuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdGlvbnMucGF0dGVybiwgb3B0aW9ucy5mbGFncyk7XG4gICAgICB9XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyh2YWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoIHx8IG1hdGNoWzBdLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbmNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJeJXt2YWx1ZX0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0XCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZXhjbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICghdi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcIl4le3ZhbHVlfSBpcyByZXN0cmljdGVkXCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZW1haWw6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCBlbWFpbFwiO1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLlBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgUEFUVEVSTjogL15bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16XXsyLH0kL2lcbiAgICB9KSxcbiAgICBlcXVhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge2F0dHJpYnV0ZTogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJpcyBub3QgZXF1YWwgdG8gJXthdHRyaWJ1dGV9XCI7XG5cbiAgICAgIGlmICh2LmlzRW1wdHkob3B0aW9ucy5hdHRyaWJ1dGUpIHx8ICF2LmlzU3RyaW5nKG9wdGlvbnMuYXR0cmlidXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXR0cmlidXRlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3RoZXJWYWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlKVxuICAgICAgICAsIGNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3IgfHwgZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgICAgcmV0dXJuIHYxID09PSB2MjtcbiAgICAgICAgfTtcblxuICAgICAgaWYgKCFjb21wYXJhdG9yKHZhbHVlLCBvdGhlclZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7YXR0cmlidXRlOiB2LnByZXR0aWZ5KG9wdGlvbnMuYXR0cmlidXRlKX0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5leHBvc2VNb2R1bGUodmFsaWRhdGUsIHRoaXMsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKTtcbn0pLmNhbGwodGhpcyxcbiAgICAgICAgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZXhwb3J0cyA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbW9kdWxlIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBkZWZpbmUgOiBudWxsKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSA4MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDVcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJkZWZpbmUgY2Fubm90IGJlIHVzZWQgaW5kaXJlY3RcIik7IH07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qc1xuICoqIG1vZHVsZSBpZCA9IDgxXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudCcpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbiAgICA7XHJcblxyXG52YXJcclxuICAgIExBUkdFID0gJ2xhcmdlJyxcclxuICAgIERJU0FCTEVEID0gJ2Rpc2FibGVkJyxcclxuICAgIExPQURJTkcgPSAnaWNvbiBsb2FkaW5nJyxcclxuICAgIERFQ09SQVRFRCA9ICdkZWNvcmF0ZWQnLFxyXG4gICAgRVJST1IgPSAnZXJyb3InLFxyXG4gICAgSU4gPSAnaW4nXHJcbiAgICA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL2NvbXBvbmVudHMvZm9ybS9zcGlubmVyLmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjbGFzc2VzOiBmdW5jdGlvbihzdGF0ZSwgbGFyZ2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZGF0YS5zdGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0ZS5kaXNhYmxlZCB8fCBkYXRhLnN0YXRlLnN1Ym1pdHRpbmcpIGNsYXNzZXMucHVzaChESVNBQkxFRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdGUubG9hZGluZykgY2xhc3Nlcy5wdXNoKExPQURJTkcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXRlLmVycm9yKSBjbGFzc2VzLnB1c2goRVJST1IpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sYXJnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChERUNPUkFURUQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChMQVJHRSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlIHx8IGRhdGEuZm9jdXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKElOKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndmFsdWUnLCBmdW5jdGlvbigpIHsgIGlmICh0aGlzLmdldCgnZXJyb3InKSkgdGhpcy5zZXQoJ2Vycm9yJywgZmFsc2UpOyB9LCB7aW5pdDogZmFsc2V9KTtcclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKVxyXG4gICAgICAgICAgICAub24oJ2ZvY3VzLmFwaScsIGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgnZm9jdXMnLCB0cnVlKTsgfSlcclxuICAgICAgICAgICAgLm9uKCdibHVyLmFwaScsIGZ1bmN0aW9uKCkgeyB2aWV3LnNldCgnZm9jdXMnLCBmYWxzZSk7IH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYXJkb3duOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnaW5wdXQnKSkub2ZmKCcuYXBpJyk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBpbmM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2ID0gXy5wYXJzZUludCh0aGlzLmdldCgndmFsdWUnKSkgKyAxO1xyXG5cclxuICAgICAgICBpZiAodiA8PSB0aGlzLmdldCgnbWF4JykpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xyXG4gICAgfSxcclxuXHJcbiAgICBkZWM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB2ID0gXy5wYXJzZUludCh0aGlzLmdldCgndmFsdWUnKSkgLSAxO1xyXG5cclxuICAgICAgICBpZiAodiA+PSB0aGlzLmdldCgnbWluJykpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgdik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvY29yZS9mb3JtL3NwaW5uZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA4N1xuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgc2VsZWN0aW9uIGlucHV0IHNwaW5uZXIgZHJvcGRvd24gaW4gXCIse1widFwiOjIsXCJyXCI6XCJjbGFzc1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInJcIjpcImVycm9yXCJ9LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjbGFzc2VzXCIsXCJzdGF0ZVwiLFwibGFyZ2VcIixcInZhbHVlXCJdLFwic1wiOlwiXzAoXzEsXzIsXzMpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwiaGlkZGVuXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInZhbHVlXCJ9XX19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwbGFjZWhvbGRlclwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJwbGFjZWhvbGRlclwifV19XSxcIm5cIjo1MCxcInJcIjpcImxhcmdlXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRleHRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidmFsdWVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzcGlubmVyIGJ1dHRvbiBpbmNcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJpbmNcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIitcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNwaW5uZXIgYnV0dG9uIGRlY1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImRlY1wiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiLVwiXX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL3NwaW5uZXIuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDg4XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgNCA1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50JyksXHJcbiAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuICAgIDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50LmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NhbGVuZGFyLmh0bWwnKSxcclxuXHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtb21lbnQ6IG1vbWVudCxcclxuICAgICAgICAgICAgd29ya2VyOiBtb21lbnQoKS5zdGFydE9mKCdtb250aCcpLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuXHJcbiAgICAgICAgICAgIGZvcm1hdENhbGVuZGFyOiBmdW5jdGlvbiAod29ya2VyLCB2YWx1ZSwgbWluLCBtYXgsIHNlY29uZCkge1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kID0gc2Vjb25kIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWNvbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrZXIgPSB3b3JrZXIuY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNoaWZ0ID0gd29ya2VyLnN0YXJ0T2YoJ21vbnRoJykud2Vla2RheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRheXMgPSB3b3JrZXIuZW5kT2YoJ21vbnRoJykuZGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlID0gdGhpcy5nZXQoJ3JhbmdlJykgfHwgW10sXHJcbiAgICAgICAgICAgICAgICAgICAgd2Vla3MgPSBbXSxcclxuXHQgICAgICAgICAgICB5ZWFybGlzdCA9IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB5ZWFycyA9IG1vbWVudCgpLmRpZmYobW9tZW50KCksICd5ZWFycycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRZZWFyID0gbW9tZW50KCkueWVhcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB5ZWFybGlzdC5wdXNoKGN1cnJlbnRZZWFyIC0gaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIF8uZWFjaChfLnJhbmdlKDEsIGRheXMrMSksIGZ1bmN0aW9uICh2LCBrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQoW3dvcmtlci55ZWFyKCksIHdvcmtlci5tb250aCgpLCB2XSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kID0gc2hpZnQgKyBrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gKF9kLzcpID4+IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBfZCAlIDcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYWN0aXZlID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNscyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghd2Vla3Nbd10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vla3Nbd10gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXlzOiBfLnJhbmdlKDcpLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiBudWxsOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiAmJiBtLmlzQmVmb3JlKG1pbiwgJ2RheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXggJiYgbS5pc0FmdGVyKG1heCwgJ2RheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5hY3RpdmUpIGNsc1tjbHMubGVuZ3RoXSA9ICdpbmFjdGl2ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlWzBdICYmIG0uaXNTYW1lKHJhbmdlWzBdLCAnZGF5JykpIGNsc1tjbHMubGVuZ3RoXSA9ICdyYW5nZSBzdGFydCc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlWzFdICYmIG0uaXNTYW1lKHJhbmdlWzFdLCAnZGF5JykpIGNsc1tjbHMubGVuZ3RoXSA9ICdyYW5nZSBlbmQnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW5nZVswXSAmJiByYW5nZVsxXSAmJiBtLmlzQmV0d2VlbihyYW5nZVswXSwgcmFuZ2VbMV0sICdkYXknKSkgY2xzW2Nscy5sZW5ndGhdID0gJ3JhbmdlJztcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY2xzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2Vla3Nbd10uZGF5c1tkXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogdixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHZhbHVlID8gbS5pc1NhbWUodmFsdWUsICdkYXknKSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogY2xzLmpvaW4oJyAnKVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbW9udGg6IHdvcmtlci5tb250aCgpLCB5ZWFyOiB3b3JrZXIueWVhcigpLCB3ZWVrczogd2Vla3MsIHdvcmtlcjogd29ya2VyLHllYXJsaXN0OiB5ZWFybGlzdCwgc2VsZWN0ZWRtb250aDogd29ya2VyLm1vbnRoKCksIHNlbGVjdGVkeWVhcjogd29ya2VyLnllYXIoKSB9O1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbmZpZzogZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgnbWluJywgZnVuY3Rpb24obWluKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCBtaW4gPyBtaW4uY2xvbmUoKS5zdGFydE9mKCdtb250aCcpIDogbW9tZW50KCkuc3RhcnRPZignbW9udGgnKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2ID0gbW9tZW50KHZhbHVlKS5jbG9uZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHcgPSB0aGlzLmdldCgnd29ya2VyJykuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldCgndHdvbW9udGgnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAody5zdGFydE9mKCdtb250aCcpLmlzQWZ0ZXIodikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCB2LnN0YXJ0T2YoJ21vbnRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAody5hZGQoMSwgJ21vbnRoJykuZW5kT2YoJ21vbnRoJykuaXNCZWZvcmUodikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCB2LnN0YXJ0T2YoJ21vbnRoJykuc3Vic3RyYWN0KDEsICdtb250aCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnd29ya2VyJywgbW9tZW50KHZhbHVlKS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnd29ya2VyJywgbW9tZW50KHZhbHVlKS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSwge2luaXQ6IHRydWV9KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtb21lbnQodmFsdWUpO1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdtYXgnKSAmJiB2YWx1ZS5pc0FmdGVyKHRoaXMuZ2V0KCdtYXgnKS5lbmRPZignZGF5JykpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldCgnbWluJykgJiYgdmFsdWUuaXNCZWZvcmUodGhpcy5nZXQoJ21pbicpLnN0YXJ0T2YoJ2RheScpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldCgndmFsdWUnLCBtb21lbnQodmFsdWUpKTtcclxuICAgIH0sXHJcblxyXG4gICAgbmV4dDogZnVuY3Rpb24od29ya2VyKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3dvcmtlcicsIHdvcmtlci5hZGQoMSwgJ21vbnRoJykpO1xyXG4gICAgfSxcclxuXHJcbiAgICBwcmV2OiBmdW5jdGlvbih3b3JrZXIpIHtcclxuICAgICAgICB0aGlzLnNldCgnd29ya2VyJywgd29ya2VyLmFkZCgtMSwgJ21vbnRoJykpO1xyXG4gICAgfSxcclxuXHRzZWxlY3Rtb250aDogZnVuY3Rpb24gKHdvcmtlcikge1xyXG4gICAgICAgIHZhciB5ZWFyID0gd29ya2VyLnllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSAkKCcjc2VsZWN0ZWRtb250aCcpLnZhbCgpO1xyXG4gICAgICAgIHRoaXMuc2V0KCd3b3JrZXInLCBtb21lbnQoW3llYXIsIG1vbnRoXSkpO1xyXG4gICAgfSxcclxuICAgIHNlbGVjdHllYXI6IGZ1bmN0aW9uICh3b3JrZXIpIHsgICAgICAgXHJcbiAgICAgICAgdmFyIHllYXIgPSAkKCcjc2VsZWN0ZWR5ZWFyJykudmFsKCk7XHJcbiAgICAgICAgdmFyIG1vbnRoID0gd29ya2VyLm1vbnRoKCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3dvcmtlcicsIG1vbWVudChbeWVhciwgbW9udGhdKSk7ICAgICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCcjc2VsZWN0ZWRtb250aCcpKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJyNzZWxlY3RlZHllYXInKSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHRcclxuXHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb3JlL2Zvcm0vY2FsZW5kYXIuanNcbiAqKiBtb2R1bGUgaWQgPSA5MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgY2FsZW5kYXIgXCIse1widFwiOjQsXCJmXCI6W1widHdvbW9udGggcmVsYXhlZFwiXSxcIm5cIjo1MCxcInJcIjpcInR3b21vbnRoXCIsXCJzXCI6dHJ1ZX0sXCIgZ3JpZFwiXX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJlaWdodCB3aWRlIGNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNpeHRlZW4gd2lkZSBjb2x1bW4gY2VudGVyIGFsaWduZWQgbW9udGhcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJsZWZ0XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicHJldlwiLFwiYVwiOntcInJcIjpbXCJ+L3dvcmtlclwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRyaWFuZ2xlIGxlZnQgaWNvblwifX1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiLi93b3JrZXJcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcIk1NTU0gWVlZWVxcXCIpXCJ9fV19LFwiIFwiLHtcInRcIjo4LFwiclwiOlwibW9udGhcIn1dLFwieFwiOntcInJcIjpbXCJmb3JtYXRDYWxlbmRhclwiLFwid29ya2VyXCIsXCJ2YWx1ZVwiLFwibWluXCIsXCJtYXhcIl0sXCJzXCI6XCJfMChfMSxfMixfMyxfNCxmYWxzZSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZWlnaHQgd2lkZSBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzaXh0ZWVuIHdpZGUgY29sdW1uIGNlbnRlciBhbGlnbmVkIG1vbnRoXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwicmlnaHRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJuZXh0XCIsXCJhXCI6e1wiclwiOltcIn4vd29ya2VyXCJdLFwic1wiOlwiW18wXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwidHJpYW5nbGUgcmlnaHQgaWNvblwifX1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiLi93b3JrZXJcIl0sXCJzXCI6XCJfMC5mb3JtYXQoXFxcIk1NTU0gWVlZWVxcXCIpXCJ9fV19LFwiIFwiLHtcInRcIjo4LFwiclwiOlwibW9udGhcIn1dLFwieFwiOntcInJcIjpbXCJmb3JtYXRDYWxlbmRhclwiLFwid29ya2VyXCIsXCJ2YWx1ZVwiLFwibWluXCIsXCJtYXhcIl0sXCJzXCI6XCJfMChfMSxfMixfMyxfNCx0cnVlKVwifX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJ0d29tb250aFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2l4dGVlbiB3aWRlIGNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNpeHRlZW4gd2lkZSBjb2x1bW4gY2VudGVyIGFsaWduZWQgbW9udGhcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwibGVmdFwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInByZXZcIixcImFcIjp7XCJyXCI6W1wifi93b3JrZXJcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJ0cmlhbmdsZSBsZWZ0IGljb25cIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJpZ2h0XCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwibmV4dFwiLFwiYVwiOntcInJcIjpbXCJ+L3dvcmtlclwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRyaWFuZ2xlIHJpZ2h0IGljb25cIn19XX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcIi4vd29ya2VyXCJdLFwic1wiOlwiXzAuZm9ybWF0KFxcXCJNTU1NIFlZWVlcXFwiKVwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJjaGFuZ2V5ZWFyXCJdLFwic1wiOlwiXzAhPVxcXCIxXFxcIlwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGlucHV0IHNlbGVjdCBzbWFsbFwiLFwic3R5bGVcIjpcIndpZHRoOjMwJVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWxlY3RcIixcImFcIjp7XCJpZFwiOlwic2VsZWN0ZWRtb250aFwifSxcInZcIjp7XCJjaGFuZ2VcIjp7XCJtXCI6XCJzZWxlY3Rtb250aFwiLFwiYVwiOntcInJcIjpbXCJ+L3dvcmtlclwiXSxcInNcIjpcIltfMF1cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwib3B0aW9uXCIsXCJtXCI6W3tcInRcIjo0LFwiZlwiOltcInNlbGVjdGVkXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzZWxlY3RlZG1vbnRoXCIsXCJpXCJdLFwic1wiOlwiXzA9PV8xXCJ9fV0sXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJpXCJ9XX0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MixcImlcIjpcImlcIixcInhcIjp7XCJyXCI6W1wibW9tZW50XCJdLFwic1wiOlwiXzAubW9udGhzU2hvcnQoKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGlucHV0IHNlbGVjdCBzbWFsbFwiLFwic3R5bGVcIjpcIndpZHRoOjMwJVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzZWxlY3RcIixcImFcIjp7XCJpZFwiOlwic2VsZWN0ZWR5ZWFyXCJ9LFwidlwiOntcImNoYW5nZVwiOntcIm1cIjpcInNlbGVjdHllYXJcIixcImFcIjp7XCJyXCI6W1wifi93b3JrZXJcIl0sXCJzXCI6XCJbXzBdXCJ9fX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcIm9wdGlvblwiLFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJzZWxlY3RlZFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic2VsZWN0ZWR5ZWFyXCIsXCJpXCIsXCJ5ZWFybGlzdFwiXSxcInNcIjpcIl8wPT1fMltfMV1cIn19XSxcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwieWVhcmxpc3RcIn1dfV19XSxcInhcIjp7XCJyXCI6W1wiY2hhbmdleWVhclwiXSxcInNcIjpcIl8wIT1cXFwiMVxcXCJcIn19XX0sXCIgXCIse1widFwiOjgsXCJyXCI6XCJtb250aFwifV0sXCJ4XCI6e1wiclwiOltcImZvcm1hdENhbGVuZGFyXCIsXCJ3b3JrZXJcIixcInZhbHVlXCIsXCJtaW5cIixcIm1heFwiXSxcInNcIjpcIl8wKF8xLF8yLF8zLF80LGZhbHNlKVwifX1dfV0sXCJyXCI6XCJ0d29tb250aFwifV19XSxcInBcIjp7XCJtb250aFwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZXZlbiBjb2x1bW4gZ3JpZCB3ZWVrZGF5cyBjZW50ZXIgYWxpZ25lZFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtbiBpbmFjdGl2ZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUyLFwieFwiOntcInJcIjpbXCJtb21lbnRcIl0sXCJzXCI6XCJfMC53ZWVrZGF5c1Nob3J0KClcIn19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNldmVuIGNvbHVtbiBncmlkIHdlZWtkYXlzIGNlbnRlciBhbGlnbmVkXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImNvbHVtbiBcIix7XCJ0XCI6MixcInJcIjpcImNsYXNzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImFjdGl2ZVwiXSxcIm5cIjo1MCxcInJcIjpcInNlbGVjdGVkXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImluYWN0aXZlXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJkYXRlXCJdLFwic1wiOlwiIV8wXCJ9fV19LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0VmFsdWVcIixcImFcIjp7XCJyXCI6W1wieWVhclwiLFwibW9udGhcIixcImRhdGVcIl0sXCJzXCI6XCJbW18wLF8xLF8yXV1cIn19fSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXlcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLi9kYXRlXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLi9kYXRlXCJ9XX1dLFwiblwiOjUyLFwiclwiOlwiZGF5c1wifV19XSxcIm5cIjo1MixcInJcIjpcIndlZWtzXCJ9XX19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy90ZW1wbGF0ZXMvY29tcG9uZW50cy9mb3JtL2NhbGVuZGFyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA5MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBtYWlsY2hlY2sgPSByZXF1aXJlKCdtYWlsY2hlY2snKTtcclxuXHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQuZXh0ZW5kKHtcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdlbWFpbCdcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJ2lucHV0JykpXHJcbiAgICAgICAgICAgIC5vbignYmx1cicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5tYWlsY2hlY2soe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3RlZDogZnVuY3Rpb24oZWxlbWVudCwgc3VnZ2VzdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VnZ2VzdGlvbicsIHN1Z2dlc3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Z2dlc3Rpb24nLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNvcnJlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHRoaXMuZ2V0KCdzdWdnZXN0aW9uLmZ1bGwnKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Z2dlc3Rpb24nLCBudWxsKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS9lbWFpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDEzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDQgNVxuICoqLyIsIi8qXG4gKiBNYWlsY2hlY2sgaHR0cHM6Ly9naXRodWIuY29tL21haWxjaGVjay9tYWlsY2hlY2tcbiAqIEF1dGhvclxuICogRGVycmljayBLbyAoQGRlcnJpY2trbylcbiAqXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKlxuICogdiAxLjEuMVxuICovXG5cbnZhciBNYWlsY2hlY2sgPSB7XG4gIGRvbWFpblRocmVzaG9sZDogMixcbiAgc2Vjb25kTGV2ZWxUaHJlc2hvbGQ6IDIsXG4gIHRvcExldmVsVGhyZXNob2xkOiAyLFxuXG4gIGRlZmF1bHREb21haW5zOiBbJ21zbi5jb20nLCAnYmVsbHNvdXRoLm5ldCcsXG4gICAgJ3RlbHVzLm5ldCcsICdjb21jYXN0Lm5ldCcsICdvcHR1c25ldC5jb20uYXUnLFxuICAgICdlYXJ0aGxpbmsubmV0JywgJ3FxLmNvbScsICdza3kuY29tJywgJ2ljbG91ZC5jb20nLFxuICAgICdtYWMuY29tJywgJ3N5bXBhdGljby5jYScsICdnb29nbGVtYWlsLmNvbScsXG4gICAgJ2F0dC5uZXQnLCAneHRyYS5jby5ueicsICd3ZWIuZGUnLFxuICAgICdjb3gubmV0JywgJ2dtYWlsLmNvbScsICd5bWFpbC5jb20nLFxuICAgICdhaW0uY29tJywgJ3JvZ2Vycy5jb20nLCAndmVyaXpvbi5uZXQnLFxuICAgICdyb2NrZXRtYWlsLmNvbScsICdnb29nbGUuY29tJywgJ29wdG9ubGluZS5uZXQnLFxuICAgICdzYmNnbG9iYWwubmV0JywgJ2FvbC5jb20nLCAnbWUuY29tJywgJ2J0aW50ZXJuZXQuY29tJyxcbiAgICAnY2hhcnRlci5uZXQnLCAnc2hhdy5jYSddLFxuXG4gIGRlZmF1bHRTZWNvbmRMZXZlbERvbWFpbnM6IFtcInlhaG9vXCIsIFwiaG90bWFpbFwiLCBcIm1haWxcIiwgXCJsaXZlXCIsIFwib3V0bG9va1wiLCBcImdteFwiXSxcblxuICBkZWZhdWx0VG9wTGV2ZWxEb21haW5zOiBbXCJjb21cIiwgXCJjb20uYXVcIiwgXCJjb20udHdcIiwgXCJjYVwiLCBcImNvLm56XCIsIFwiY28udWtcIiwgXCJkZVwiLFxuICAgIFwiZnJcIiwgXCJpdFwiLCBcInJ1XCIsIFwibmV0XCIsIFwib3JnXCIsIFwiZWR1XCIsIFwiZ292XCIsIFwianBcIiwgXCJubFwiLCBcImtyXCIsIFwic2VcIiwgXCJldVwiLFxuICAgIFwiaWVcIiwgXCJjby5pbFwiLCBcInVzXCIsIFwiYXRcIiwgXCJiZVwiLCBcImRrXCIsIFwiaGtcIiwgXCJlc1wiLCBcImdyXCIsIFwiY2hcIiwgXCJub1wiLCBcImN6XCIsXG4gICAgXCJpblwiLCBcIm5ldFwiLCBcIm5ldC5hdVwiLCBcImluZm9cIiwgXCJiaXpcIiwgXCJtaWxcIiwgXCJjby5qcFwiLCBcInNnXCIsIFwiaHVcIl0sXG5cbiAgcnVuOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgb3B0cy5kb21haW5zID0gb3B0cy5kb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0RG9tYWlucztcbiAgICBvcHRzLnNlY29uZExldmVsRG9tYWlucyA9IG9wdHMuc2Vjb25kTGV2ZWxEb21haW5zIHx8IE1haWxjaGVjay5kZWZhdWx0U2Vjb25kTGV2ZWxEb21haW5zO1xuICAgIG9wdHMudG9wTGV2ZWxEb21haW5zID0gb3B0cy50b3BMZXZlbERvbWFpbnMgfHwgTWFpbGNoZWNrLmRlZmF1bHRUb3BMZXZlbERvbWFpbnM7XG4gICAgb3B0cy5kaXN0YW5jZUZ1bmN0aW9uID0gb3B0cy5kaXN0YW5jZUZ1bmN0aW9uIHx8IE1haWxjaGVjay5zaWZ0M0Rpc3RhbmNlO1xuXG4gICAgdmFyIGRlZmF1bHRDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc3VsdCl7IHJldHVybiByZXN1bHQgfTtcbiAgICB2YXIgc3VnZ2VzdGVkQ2FsbGJhY2sgPSBvcHRzLnN1Z2dlc3RlZCB8fCBkZWZhdWx0Q2FsbGJhY2s7XG4gICAgdmFyIGVtcHR5Q2FsbGJhY2sgPSBvcHRzLmVtcHR5IHx8IGRlZmF1bHRDYWxsYmFjaztcblxuICAgIHZhciByZXN1bHQgPSBNYWlsY2hlY2suc3VnZ2VzdChNYWlsY2hlY2suZW5jb2RlRW1haWwob3B0cy5lbWFpbCksIG9wdHMuZG9tYWlucywgb3B0cy5zZWNvbmRMZXZlbERvbWFpbnMsIG9wdHMudG9wTGV2ZWxEb21haW5zLCBvcHRzLmRpc3RhbmNlRnVuY3Rpb24pO1xuXG4gICAgcmV0dXJuIHJlc3VsdCA/IHN1Z2dlc3RlZENhbGxiYWNrKHJlc3VsdCkgOiBlbXB0eUNhbGxiYWNrKClcbiAgfSxcblxuICBzdWdnZXN0OiBmdW5jdGlvbihlbWFpbCwgZG9tYWlucywgc2Vjb25kTGV2ZWxEb21haW5zLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24pIHtcbiAgICBlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB2YXIgZW1haWxQYXJ0cyA9IHRoaXMuc3BsaXRFbWFpbChlbWFpbCk7XG5cbiAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zICYmIHRvcExldmVsRG9tYWlucykge1xuICAgICAgICAvLyBJZiB0aGUgZW1haWwgaXMgYSB2YWxpZCAybmQtbGV2ZWwgKyB0b3AtbGV2ZWwsIGRvIG5vdCBzdWdnZXN0IGFueXRoaW5nLlxuICAgICAgICBpZiAoc2Vjb25kTGV2ZWxEb21haW5zLmluZGV4T2YoZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbikgIT09IC0xICYmIHRvcExldmVsRG9tYWlucy5pbmRleE9mKGVtYWlsUGFydHMudG9wTGV2ZWxEb21haW4pICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNsb3Nlc3REb21haW4gPSB0aGlzLmZpbmRDbG9zZXN0RG9tYWluKGVtYWlsUGFydHMuZG9tYWluLCBkb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLmRvbWFpblRocmVzaG9sZCk7XG5cbiAgICBpZiAoY2xvc2VzdERvbWFpbikge1xuICAgICAgaWYgKGNsb3Nlc3REb21haW4gPT0gZW1haWxQYXJ0cy5kb21haW4pIHtcbiAgICAgICAgLy8gVGhlIGVtYWlsIGFkZHJlc3MgZXhhY3RseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWluczsgZG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24uXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGNsb3NlbHkgbWF0Y2hlcyBvbmUgb2YgdGhlIHN1cHBsaWVkIGRvbWFpbnM7IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgcmV0dXJuIHsgYWRkcmVzczogZW1haWxQYXJ0cy5hZGRyZXNzLCBkb21haW46IGNsb3Nlc3REb21haW4sIGZ1bGw6IGVtYWlsUGFydHMuYWRkcmVzcyArIFwiQFwiICsgY2xvc2VzdERvbWFpbiB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIGRvZXMgbm90IGNsb3NlbHkgbWF0Y2ggb25lIG9mIHRoZSBzdXBwbGllZCBkb21haW5zXG4gICAgdmFyIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiA9IHRoaXMuZmluZENsb3Nlc3REb21haW4oZW1haWxQYXJ0cy5zZWNvbmRMZXZlbERvbWFpbiwgc2Vjb25kTGV2ZWxEb21haW5zLCBkaXN0YW5jZUZ1bmN0aW9uLCB0aGlzLnNlY29uZExldmVsVGhyZXNob2xkKTtcbiAgICB2YXIgY2xvc2VzdFRvcExldmVsRG9tYWluICAgID0gdGhpcy5maW5kQ2xvc2VzdERvbWFpbihlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluLCB0b3BMZXZlbERvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRoaXMudG9wTGV2ZWxUaHJlc2hvbGQpO1xuXG4gICAgaWYgKGVtYWlsUGFydHMuZG9tYWluKSB7XG4gICAgICB2YXIgY2xvc2VzdERvbWFpbiA9IGVtYWlsUGFydHMuZG9tYWluO1xuICAgICAgdmFyIHJ0cm4gPSBmYWxzZTtcblxuICAgICAgaWYoY2xvc2VzdFNlY29uZExldmVsRG9tYWluICYmIGNsb3Nlc3RTZWNvbmRMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHNlY29uZC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShlbWFpbFBhcnRzLnNlY29uZExldmVsRG9tYWluLCBjbG9zZXN0U2Vjb25kTGV2ZWxEb21haW4pO1xuICAgICAgICBydHJuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYoY2xvc2VzdFRvcExldmVsRG9tYWluICYmIGNsb3Nlc3RUb3BMZXZlbERvbWFpbiAhPSBlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluKSB7XG4gICAgICAgIC8vIFRoZSBlbWFpbCBhZGRyZXNzIG1heSBoYXZlIGEgbWlzcGVsbGVkIHRvcC1sZXZlbCBkb21haW47IHJldHVybiBhIHN1Z2dlc3Rpb25cbiAgICAgICAgY2xvc2VzdERvbWFpbiA9IGNsb3Nlc3REb21haW4ucmVwbGFjZShlbWFpbFBhcnRzLnRvcExldmVsRG9tYWluLCBjbG9zZXN0VG9wTGV2ZWxEb21haW4pO1xuICAgICAgICBydHJuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJ0cm4gPT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4geyBhZGRyZXNzOiBlbWFpbFBhcnRzLmFkZHJlc3MsIGRvbWFpbjogY2xvc2VzdERvbWFpbiwgZnVsbDogZW1haWxQYXJ0cy5hZGRyZXNzICsgXCJAXCIgKyBjbG9zZXN0RG9tYWluIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogVGhlIGVtYWlsIGFkZHJlc3MgZXhhY3RseSBtYXRjaGVzIG9uZSBvZiB0aGUgc3VwcGxpZWQgZG9tYWlucywgZG9lcyBub3QgY2xvc2VseVxuICAgICAqIG1hdGNoIGFueSBkb21haW4gYW5kIGRvZXMgbm90IGFwcGVhciB0byBzaW1wbHkgaGF2ZSBhIG1pc3BlbGxlZCB0b3AtbGV2ZWwgZG9tYWluLFxuICAgICAqIG9yIGlzIGFuIGludmFsaWQgZW1haWwgYWRkcmVzczsgZG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24uXG4gICAgICovXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIGZpbmRDbG9zZXN0RG9tYWluOiBmdW5jdGlvbihkb21haW4sIGRvbWFpbnMsIGRpc3RhbmNlRnVuY3Rpb24sIHRocmVzaG9sZCkge1xuICAgIHRocmVzaG9sZCA9IHRocmVzaG9sZCB8fCB0aGlzLnRvcExldmVsVGhyZXNob2xkO1xuICAgIHZhciBkaXN0O1xuICAgIHZhciBtaW5EaXN0ID0gOTk7XG4gICAgdmFyIGNsb3Nlc3REb21haW4gPSBudWxsO1xuXG4gICAgaWYgKCFkb21haW4gfHwgIWRvbWFpbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoIWRpc3RhbmNlRnVuY3Rpb24pIHtcbiAgICAgIGRpc3RhbmNlRnVuY3Rpb24gPSB0aGlzLnNpZnQzRGlzdGFuY2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkb21haW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZG9tYWluID09PSBkb21haW5zW2ldKSB7XG4gICAgICAgIHJldHVybiBkb21haW47XG4gICAgICB9XG4gICAgICBkaXN0ID0gZGlzdGFuY2VGdW5jdGlvbihkb21haW4sIGRvbWFpbnNbaV0pO1xuICAgICAgaWYgKGRpc3QgPCBtaW5EaXN0KSB7XG4gICAgICAgIG1pbkRpc3QgPSBkaXN0O1xuICAgICAgICBjbG9zZXN0RG9tYWluID0gZG9tYWluc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWluRGlzdCA8PSB0aHJlc2hvbGQgJiYgY2xvc2VzdERvbWFpbiAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNsb3Nlc3REb21haW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgc2lmdDNEaXN0YW5jZTogZnVuY3Rpb24oczEsIHMyKSB7XG4gICAgLy8gc2lmdDM6IGh0dHA6Ly9zaWRlcml0ZS5ibG9nc3BvdC5jb20vMjAwNy8wNC9zdXBlci1mYXN0LWFuZC1hY2N1cmF0ZS1zdHJpbmctZGlzdGFuY2UuaHRtbFxuICAgIGlmIChzMSA9PSBudWxsIHx8IHMxLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHMyID09IG51bGwgfHwgczIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHMyLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoczIgPT0gbnVsbCB8fCBzMi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBzMS5sZW5ndGg7XG4gICAgfVxuXG4gICAgdmFyIGMgPSAwO1xuICAgIHZhciBvZmZzZXQxID0gMDtcbiAgICB2YXIgb2Zmc2V0MiA9IDA7XG4gICAgdmFyIGxjcyA9IDA7XG4gICAgdmFyIG1heE9mZnNldCA9IDU7XG5cbiAgICB3aGlsZSAoKGMgKyBvZmZzZXQxIDwgczEubGVuZ3RoKSAmJiAoYyArIG9mZnNldDIgPCBzMi5sZW5ndGgpKSB7XG4gICAgICBpZiAoczEuY2hhckF0KGMgKyBvZmZzZXQxKSA9PSBzMi5jaGFyQXQoYyArIG9mZnNldDIpKSB7XG4gICAgICAgIGxjcysrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0MSA9IDA7XG4gICAgICAgIG9mZnNldDIgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heE9mZnNldDsgaSsrKSB7XG4gICAgICAgICAgaWYgKChjICsgaSA8IHMxLmxlbmd0aCkgJiYgKHMxLmNoYXJBdChjICsgaSkgPT0gczIuY2hhckF0KGMpKSkge1xuICAgICAgICAgICAgb2Zmc2V0MSA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChjICsgaSA8IHMyLmxlbmd0aCkgJiYgKHMxLmNoYXJBdChjKSA9PSBzMi5jaGFyQXQoYyArIGkpKSkge1xuICAgICAgICAgICAgb2Zmc2V0MiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGMrKztcbiAgICB9XG4gICAgcmV0dXJuIChzMS5sZW5ndGggKyBzMi5sZW5ndGgpIC8yIC0gbGNzO1xuICB9LFxuXG4gIHNwbGl0RW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgdmFyIHBhcnRzID0gZW1haWwudHJpbSgpLnNwbGl0KCdAJyk7XG5cbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwYXJ0c1tpXSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkb21haW4gPSBwYXJ0cy5wb3AoKTtcbiAgICB2YXIgZG9tYWluUGFydHMgPSBkb21haW4uc3BsaXQoJy4nKTtcbiAgICB2YXIgc2xkID0gJyc7XG4gICAgdmFyIHRsZCA9ICcnO1xuXG4gICAgaWYgKGRvbWFpblBhcnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBUaGUgYWRkcmVzcyBkb2VzIG5vdCBoYXZlIGEgdG9wLWxldmVsIGRvbWFpblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZG9tYWluUGFydHMubGVuZ3RoID09IDEpIHtcbiAgICAgIC8vIFRoZSBhZGRyZXNzIGhhcyBvbmx5IGEgdG9wLWxldmVsIGRvbWFpbiAodmFsaWQgdW5kZXIgUkZDKVxuICAgICAgdGxkID0gZG9tYWluUGFydHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBhZGRyZXNzIGhhcyBhIGRvbWFpbiBhbmQgYSB0b3AtbGV2ZWwgZG9tYWluXG4gICAgICBzbGQgPSBkb21haW5QYXJ0c1swXTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZG9tYWluUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGxkICs9IGRvbWFpblBhcnRzW2ldICsgJy4nO1xuICAgICAgfVxuICAgICAgdGxkID0gdGxkLnN1YnN0cmluZygwLCB0bGQubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcExldmVsRG9tYWluOiB0bGQsXG4gICAgICBzZWNvbmRMZXZlbERvbWFpbjogc2xkLFxuICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICBhZGRyZXNzOiBwYXJ0cy5qb2luKCdAJylcbiAgICB9XG4gIH0sXG5cbiAgLy8gRW5jb2RlIHRoZSBlbWFpbCBhZGRyZXNzIHRvIHByZXZlbnQgWFNTIGJ1dCBsZWF2ZSBpbiB2YWxpZFxuICAvLyBjaGFyYWN0ZXJzLCBmb2xsb3dpbmcgdGhpcyBvZmZpY2lhbCBzcGVjOlxuICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0VtYWlsX2FkZHJlc3MjU3ludGF4XG4gIGVuY29kZUVtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgIHZhciByZXN1bHQgPSBlbmNvZGVVUkkoZW1haWwpO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCclMjAnLCAnICcpLnJlcGxhY2UoJyUyNScsICclJykucmVwbGFjZSgnJTVFJywgJ14nKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclNjAnLCAnYCcpLnJlcGxhY2UoJyU3QicsICd7JykucmVwbGFjZSgnJTdDJywgJ3wnKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclN0QnLCAnfScpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5cbi8vIEV4cG9ydCB0aGUgbWFpbGNoZWNrIG9iamVjdCBpZiB3ZSdyZSBpbiBhIENvbW1vbkpTIGVudiAoZS5nLiBOb2RlKS5cbi8vIE1vZGVsZWQgb2ZmIG9mIFVuZGVyc2NvcmUuanMuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE1haWxjaGVjaztcbn1cblxuLy8gU3VwcG9ydCBBTUQgc3R5bGUgZGVmaW5pdGlvbnNcbi8vIEJhc2VkIG9uIGpRdWVyeSAoc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE3OTU0ODgyLzEzMjI0MTApXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKFwibWFpbGNoZWNrXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWFpbGNoZWNrO1xuICB9KTtcbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qUXVlcnkpIHtcbiAgKGZ1bmN0aW9uKCQpe1xuICAgICQuZm4ubWFpbGNoZWNrID0gZnVuY3Rpb24ob3B0cykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKG9wdHMuc3VnZ2VzdGVkKSB7XG4gICAgICAgIHZhciBvbGRTdWdnZXN0ZWQgPSBvcHRzLnN1Z2dlc3RlZDtcbiAgICAgICAgb3B0cy5zdWdnZXN0ZWQgPSBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICBvbGRTdWdnZXN0ZWQoc2VsZiwgcmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMuZW1wdHkpIHtcbiAgICAgICAgdmFyIG9sZEVtcHR5ID0gb3B0cy5lbXB0eTtcbiAgICAgICAgb3B0cy5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG9sZEVtcHR5LmNhbGwobnVsbCwgc2VsZik7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9wdHMuZW1haWwgPSB0aGlzLnZhbCgpO1xuICAgICAgTWFpbGNoZWNrLnJ1bihvcHRzKTtcbiAgICB9XG4gIH0pKGpRdWVyeSk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL21haWxjaGVjay9zcmMvbWFpbGNoZWNrLmpzXG4gKiogbW9kdWxlIGlkID0gMTM1XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgNCA1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICBNeXByb2ZpbGUgPSByZXF1aXJlKCdjb21wb25lbnRzL215cHJvZmlsZS9pbmRleCcpO1xyXG4gICAgIFxyXG4gICAgIHJlcXVpcmUoJ21vYmlsZS9teXRyYXZlbGxlci5sZXNzJyk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICAgKG5ldyBNeXByb2ZpbGUoKSkucmVuZGVyKCcjYXBwJyk7XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL215cHJvZmlsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDIwOFxuICoqIG1vZHVsZSBjaHVua3MgPSA0XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgIE15cHJvZmlsZSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXByb2ZpbGUvbXlwcm9maWxlJyksXHJcbiAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL215cHJvZmlsZS9tZXRhJylcclxuICAgIDtcclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXlwcm9maWxlL2luZGV4Lmh0bWwnKSxcclxuXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ2xheW91dCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2xheW91dCcpLFxyXG4gICAgICAgICdteXByb2ZpbGUtZm9ybSc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvbXlwcm9maWxlL2Zvcm0nKSxcclxuICAgICAgICBteXByb2ZpbGV2aWV3OiByZXF1aXJlKCdjb21wb25lbnRzL215cHJvZmlsZS92aWV3JyksXHJcbiAgICAgICAvLyBsZWZ0cGFuZWw6cmVxdWlyZSgnY29tcG9uZW50cy9sYXlvdXRzL3Byb2ZpbGVfc2lkZWJhcicpXHJcbiAgICB9LFxyXG4gICAgcGFydGlhbHM6IHtcclxuICAgICAgICAnYmFzZS1wYW5lbCc6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvbGF5b3V0L3BhbmVsLmh0bWwnKVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KCdteXByb2ZpbGUucGVuZGluZycsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdteXByb2ZpbGUuZWRpdCcsIGZhbHNlKTtcclxuICAgICAgIE15cHJvZmlsZS5mZXRjaCgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihteXByb2ZpbGUpIHsgdGhpcy5zZXQoJ215cHJvZmlsZS5wZW5kaW5nJywgZmFsc2UpOyB0aGlzLnNldCgnbXlwcm9maWxlJywgbXlwcm9maWxlKTsgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgIE1ldGEuaW5zdGFuY2UoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obWV0YSkgeyB0aGlzLnNldCgnbWV0YScsIG1ldGEpO30uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgd2luZG93LnZpZXcgPSB0aGlzO1xyXG4gICAgfSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkgeyAgICAgXHJcbiAgICAgICAgcmV0dXJuIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgbGVmdG1lbnU6ZmFsc2UsXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuIGxlZnRNZW51OmZ1bmN0aW9uKCkgeyB2YXIgZmxhZz10aGlzLmdldCgnbGVmdG1lbnUnKTsgdGhpcy5zZXQoJ2xlZnRtZW51JywgIWZsYWcpO30sXHJcbiAgIFxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKE1PQklMRSkge1xyXG4gICAgICAgICAgICB2YXIgb3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcih7IG9uSGlkZGVuOiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9LCBvblNob3c6IGZ1bmN0aW9uKCkgeyAkKCcjbV9idG4nKS5hZGRDbGFzcygnZGlzYWJsZWQnKTsgIH19KTtcclxuICAgICAgICAgICAgJCgnLmRyb3Bkb3duJykuZHJvcGRvd24oKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNtX2J0bicsIHRoaXMuZWwpLm9uKCdjbGljay5sYXlvdXQnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcignc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcucHVzaGVyJykub25lKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnLnVpLmNoZWNrYm94JywgdGhpcy5lbCkuY2hlY2tib3goKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvbXlwcm9maWxlL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMjA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDRcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJsYXlvdXRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImhlYWRlclwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0aHJlZSBjb2x1bW4gZ3JpZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJpZFwiOlwibV9idG5cIixcImNsYXNzXCI6XCJtYWluX21udVwiLFwiaHJlZlwiOlwiI1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy9tb2JpbGUvYmFycy5wbmdcIixcImFsdFwiOlwibWVudVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcImxvZ29cIixcImhyZWZcIjpcImphdmFzY3JpcHQ6O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy9tb2JpbGUvbG9nby5wbmdcIixcImFsdFwiOlwiQ2hlYXBUaWNrZXQuaW5cIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW4gcmlnaHQgYWxpZ25lZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaWRcIjpcInJpZ2h0X21lbnVcIixcImNsYXNzXCI6XCJwcm9maWxlXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL3Byb2ZpbGUucG5nXCIsXCJhbHRcIjpcIlByb2ZpbGVcIn19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcIm1fbWVudVwiLFwiY2xhc3NcIjpcInVpIGxlZnQgdmVydGljYWwgc2lkZWJhciBtZW51IHB1c2ggc2NhbGUgZG93biBvdmVybGF5XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhdmF0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcImlkXCI6XCJhdmF0YXJcIixcImNsYXNzXCI6XCJ1aSBhdmF0YXIgbGlpdGxlIGltYWdlXCIsXCJzcmNcIjpcIi90aGVtZXMvQjJDL2ltZy9tb2JpbGUvYXZhdC5wbmdcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImRlc2NyaXB0aW9uXCJ9LFwiZlwiOltcIldFTENPTUUgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMVwiLFwiYVwiOntcImlkXCI6XCJuYW1lXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGEudXNlci5uYW1lXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJtZXRhLnVzZXJcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImFcIjp7XCJpZFwiOlwibmFtZVwifSxcImZcIjpbXCJHdWVzdCBVc2VyXCJdfV0sXCJ4XCI6e1wiclwiOltcIm1ldGEudXNlclwiXSxcInNcIjpcIl8wIT1udWxsXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJsdWUgZmx1aWQgYnV0dG9uXCIsXCJocmVmXCI6XCIvc2l0ZS9sb2dvdXRcIn0sXCJmXCI6W1wiTG9nb3V0XCJdfV0sXCJuXCI6NTAsXCJyXCI6XCJtZXRhLnVzZXJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInByb2ZcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIvYjJjL21vYmlsZS9teXByb2ZpbGUvXCJ9LFwiZlwiOltcIk15IFByb2ZpbGVcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvbW9iaWxlL215Ym9va2luZ3MvXCJ9LFwiZlwiOltcIk15IEJvb2tpbmdzXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRyYXZcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIvYjJjL21vYmlsZS9teXRyYXZlbGxlci9cIn0sXCJmXCI6W1wiVHJhdmVsbGVyc1wiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImlkXCI6XCJkZXZpZGVyXCIsXCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbXCJRVUlDSyBUT09MU1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInByaW50XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvbXlib29raW5ncy9cIn0sXCJmXCI6W1wiUHJpbnQgLyBWaWV3IFRpY2tldFwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjYW5jZWxcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIvYjJjL21vYmlsZS9teWJvb2tpbmdzL1wifSxcImZcIjpbXCJDYW5jZWxhdGlvbnNcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY2hhbmdlXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvbXlib29raW5ncy9cIn0sXCJmXCI6W1wiQ2hhbmdlIC8gUmVzY2hlZHVsZVwiXX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJib3ggbXktdHJhdmVsbGVyc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibGVmdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJpZFwiOlwibXlwcm9maWxlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJteXByb2ZpbGV2aWV3XCIsXCJhXCI6e1wibXlwcm9maWxlXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlwcm9maWxlLmVkaXRcIl0sXCJzXCI6XCIhXzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcIm15cHJvZmlsZS1mb3JtXCIsXCJhXCI6e1wibXlwcm9maWxlXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcInhcIjp7XCJyXCI6W1wibXlwcm9maWxlLmVkaXRcIl0sXCJzXCI6XCIhXzBcIn19XX1dfV19XX0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL2luZGV4Lmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gNFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgICAgIE15cHJvZmlsZSA9IHJlcXVpcmUoJ3N0b3Jlcy9teXByb2ZpbGUvbXlwcm9maWxlJyksXHJcbiAgICAgICAgdmFsaWRhdGUgPSByZXF1aXJlKCd2YWxpZGF0ZScpXHJcbiAgICAgICAgO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXlwcm9maWxlL2Zvcm0uaHRtbCcpLFxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICd1aS1zcGlubmVyJzogcmVxdWlyZSgnY29yZS9mb3JtL3NwaW5uZXInKSxcclxuICAgICAgICAndWktY2FsZW5kYXInOiByZXF1aXJlKCdjb3JlL2Zvcm0vY2FsZW5kYXInKSxcclxuICAgICAgICAndWktdGVsJzogcmVxdWlyZSgnY29yZS9mb3JtL3RlbCcpLFxyXG4gICAgICAgICd1aS1lbWFpbCc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9lbWFpbCcpLFxyXG4gICAgICAgICd1aS1pbnB1dCc6IHJlcXVpcmUoJ2NvcmUvZm9ybS9pbnB1dCcpLFxyXG4gICAgICAgICd1aS1kYXRlJzogcmVxdWlyZSgnY29yZS9mb3JtL2RhdGUnKSxcclxuICAgIH0sXHJcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXJyb3JzOm51bGwsXHJcbiAgICAgICAgICAgIHN0YXRlbGlzdDogW10sXHJcbiAgICAgICAgICAgIGNpdHlsaXN0OiBbXSxcclxuICAgICAgICAgICAgZm9ybWF0U3RhdGVMaXN0OiBmdW5jdGlvbiAoc3RhdGVsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IF8uY2xvbmVEZWVwKHN0YXRlbGlzdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKGRhdGEsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdGV4dDogaS5uYW1lfTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRDaXR5TGlzdDogZnVuY3Rpb24gKGNpdHlsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IF8uY2xvbmVEZWVwKGNpdHlsaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB0ZXh0OiBpLm5hbWV9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdENvdW50cnlMaXN0OiBmdW5jdGlvbiAoY291bnRyeWxpc3QpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gXy5jbG9uZURlZXAoY291bnRyeWxpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChkYXRhLCBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHRleHQ6IGkubmFtZX07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25jb25maWc6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuICAgIG9uaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLm5hbWUnLCB0aGlzLmdldCgnbXlwcm9maWxlLm5hbWUnKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLmVtYWlsJywgdGhpcy5nZXQoJ215cHJvZmlsZS5lbWFpbCcpKTtcclxuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0ubW9iaWxlJywgdGhpcy5nZXQoJ215cHJvZmlsZS5tb2JpbGUnKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLmFkZHJlc3MnLCB0aGlzLmdldCgnbXlwcm9maWxlLmFkZHJlc3MnKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLmNvdW50cnknLCB0aGlzLmdldCgnbXlwcm9maWxlLmNvdW50cnknKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Byb2ZpbGVmb3JtLmNvdW50cnljb2RlJywgdGhpcy5nZXQoJ215cHJvZmlsZS5jb3VudHJ5Y29kZScpKTtcclxuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0uc3RhdGUnLCB0aGlzLmdldCgnbXlwcm9maWxlLnN0YXRlJykpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCB0aGlzLmdldCgnbXlwcm9maWxlLnN0YXRlY29kZScpKTtcclxuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0uY2l0eScsIHRoaXMuZ2V0KCdteXByb2ZpbGUuY2l0eScpKTtcclxuICAgICAgICB0aGlzLnNldCgncHJvZmlsZWZvcm0uY2l0eWNvZGUnLCB0aGlzLmdldCgnbXlwcm9maWxlLmNpdHljb2RlJykpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdwcm9maWxlZm9ybS5waW5jb2RlJywgdGhpcy5nZXQoJ215cHJvZmlsZS5waW5jb2RlJykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXQoJ215cHJvZmlsZS5jb3VudHJ5Y29kZScpICE9IG51bGwgJiYgdGhpcy5nZXQoJ215cHJvZmlsZS5jb3VudHJ5Y29kZScpICE9ICcnKSB7XHJcbiAgICAgICAgICAgIHZpZXcuZ2V0KCdteXByb2ZpbGUnKS5nZXRTdGF0ZUxpc3Qodmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdldCgnbXlwcm9maWxlLnN0YXRlY29kZScpICE9IG51bGwgJiYgdGhpcy5nZXQoJ215cHJvZmlsZS5zdGF0ZWNvZGUnKSAhPSAnJykge1xyXG4gICAgICAgICAgICB2aWV3LmdldCgnbXlwcm9maWxlJykuZ2V0Q2l0eUxpc3Qodmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub24oJ2Nsb3NlbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgJCgnLnVpLnBvc2l0aXZlLm1lc3NhZ2UnKS5mYWRlT3V0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgZWRpdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvdXNlcnMvdXBkYXRlU2VsZi8nLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiBKU09OLnN0cmluZ2lmeSh2aWV3LmdldCgncHJvZmlsZWZvcm0nKSl9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaWRkKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlkZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWRkLnJlc3VsdCA9PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nL2IyYy91c2Vycy9teXByb2ZpbGUnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGlkZC5yZXN1bHQgPT0gJ2Vycm9yJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsaWRkLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkZC5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgLy90ZXh0KHRoaXMuZ2V0KCdwcm9maWxlZm9ybScpLmNpdHkpO1xyXG4gICAgICAgJCgnI2RpdnN0YXRlJykub24oJ2NsaWNrJyxmdW5jdGlvbihldmVudCl7JCgnI2RpdmNpdHkgLnVpLmRyb3Bkb3duJykuZHJvcGRvd24oJ3Jlc3RvcmUgZGVmYXVsdCB0ZXh0Jyk7XHJcbiAgICAgICAgLy92aWV3LnNldCgncHJvZmlsZWZvcm0uc3RhdGVjb2RlJywkKCcjZGl2c3RhdGUgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICBpZigodHlwZW9mKHZpZXcuZ2V0KCdjaXR5bGlzdCcpKSAhPSBcInVuZGVmaW5lZFwiKSlcclxuICAgICAgICB2aWV3LnNldCgnY2l0eWxpc3QnLG51bGwpO1xyXG4gICAgICAgfSk7XHJcbiAgICAgICAkKCcjZGl2Y2l0eScpLm9uKCdjbGljaycsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgIC8vY29uc29sZS5sb2coJ29uY2xpaWNrIGlkICcrJCgnI2RpdmNpdHkgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICAgLy8gICQoJyNkaXZjaXR5IC51aS5kcm9wZG93bicpLmRyb3Bkb3duKCdzZXQgc2VsZWN0ZWQnLCAkKCcjZGl2Y2l0eSAuaXRlbS5hY3RpdmUuc2VsZWN0ZWQnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgICAgLy8gdmlldy5zZXQoJ3Byb2ZpbGVmb3JtLmNpdHljb2RlJywkKCcjZGl2Y2l0eSAuaXRlbS5hY3RpdmUuc2VsZWN0ZWQnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgfSk7XHJcbiAgICAgICAkKCcjZGl2Y291bnRyeScpLm9uKCdjbGljaycsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgIGlmKCh0eXBlb2Yodmlldy5nZXQoJ3N0YXRlbGlzdCcpKSAhPSBcInVuZGVmaW5lZFwiKSlcclxuICAgICAgICAgICAgdmlldy5zZXQoJ3N0YXRlbGlzdCcsbnVsbCk7XHJcbiAgICAgICAgaWYoKHR5cGVvZih2aWV3LmdldCgnY2l0eWxpc3QnKSkgIT0gXCJ1bmRlZmluZWRcIikpXHJcbiAgICAgICAgdmlldy5zZXQoJ2NpdHlsaXN0JyxudWxsKTtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdvbmNsaWljayBpZCAnKyQoJyNkaXZjaXR5IC5pdGVtLmFjdGl2ZS5zZWxlY3RlZCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgICAgIC8vICAkKCcjZGl2Y2l0eSAudWkuZHJvcGRvd24nKS5kcm9wZG93bignc2V0IHNlbGVjdGVkJywgJCgnI2RpdmNpdHkgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICAgIC8vIHZpZXcuc2V0KCdwcm9maWxlZm9ybS5jaXR5Y29kZScsJCgnI2RpdmNpdHkgLml0ZW0uYWN0aXZlLnNlbGVjdGVkJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZSgncHJvZmlsZWZvcm0uY291bnRyeWNvZGUnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdwcm9maWxlZm9ybS5jb3VudHJ5Y29kZScpICE9IG51bGwgJiYgdGhpcy5nZXQoJ3Byb2ZpbGVmb3JtLmNvdW50cnljb2RlJykgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuZ2V0KCdteXByb2ZpbGUnKS5nZXRTdGF0ZUxpc3Qodmlldyk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlKCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKSAhPSBudWxsICYmIHRoaXMuZ2V0KCdwcm9maWxlZm9ybS5zdGF0ZWNvZGUnKSAhPSAnJykgeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICB2aWV3LmdldCgnbXlwcm9maWxlJykuZ2V0Q2l0eUxpc3Qodmlldyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcclxuICAgICAgICBcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvbXlwcm9maWxlL2Zvcm0uanNcbiAqKiBtb2R1bGUgaWQgPSAyMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gNFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImgxXCIsXCJmXCI6W1wiTXkgUHJvZmlsZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6XCJ1aSBmb3JtIGJhc2ljIHNlZ21lbnQgZmxpZ2h0IHNlYXJjaFwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIixcInN0eWxlXCI6XCJkaXNwbGF5OmJsb2NrXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvcnNcIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0d28gY29sdW1uIGdyaWQgXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXRhaWxzIG15cHJvZmlsZUVkaXRcIn0sXCJmXCI6W1wiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjYWxzc1wiOlwiY29sdW1uIHR3b1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIk5hbWVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJuYW1lXCIsXCJwbGFjZWhvbGRlclwiOlwiTmFtZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5uYW1lXCJ9XX19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJFbWFpbCBBZGRyZXNzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWVtYWlsXCIsXCJhXCI6e1wibmFtZVwiOlwiZW1haWxcIixcInBsYWNlaG9sZGVyXCI6XCJFLU1haWxcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvZmlsZWZvcm0uZW1haWxcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIk1vYmlsZSBOdW1iZXJcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktdGVsXCIsXCJhXCI6e1wibmFtZVwiOlwibW9iaWxlXCIsXCJwbGFjZWhvbGRlclwiOlwiTW9iaWxlXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLm1vYmlsZVwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiQWRkcmVzc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImFkZHJlc3NcIixcInBsYWNlaG9sZGVyXCI6XCJBZGRyZXNzXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLmFkZHJlc3NcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIkNvdW50cnlcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5jb3VudHJ5Y29kZVwifV0sXCJjbGFzc1wiOlwiZmx1aWQgdHJhbnNwYXJlbnRcIixcInBsYWNlaG9sZGVyXCI6XCJDb3VudHJ5XCIsXCJzbWFsbFwiOlwiMVwiLFwic2VhcmNoXCI6XCIxXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRDb3VudHJ5TGlzdFwiLFwibWV0YS5jb3VudHJ5bGlzdFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIlN0YXRlXCJdfSx7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvZmlsZWZvcm0uc3RhdGVjb2RlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0cmFuc3BhcmVudFwiLFwicGxhY2Vob2xkZXJcIjpcIlN0YXRlXCIsXCJzZWFyY2hcIjpcIjFcIixcInNtYWxsXCI6XCIxXCIsXCJvcHRpb25zXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRTdGF0ZUxpc3RcIixcInN0YXRlbGlzdFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIlBpbmNvZGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwaW5jb2RlXCIsXCJwbGFjZWhvbGRlclwiOlwiUGluIENvZGVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvZmlsZWZvcm0ucGluY29kZVwifV19fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W1wiwqBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcInN0eWxlXCI6XCJkaXNwbGF5Om5vbmU7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJOYW1lXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJuYW1lXCIsXCJwbGFjZWhvbGRlclwiOlwiTmFtZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5uYW1lXCJ9XX0sXCJmXCI6W119XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbXCJFbWFpbCBBZGRyZXNzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktZW1haWxcIixcImFcIjp7XCJuYW1lXCI6XCJlbWFpbFwiLFwicGxhY2Vob2xkZXJcIjpcIkUtTWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5lbWFpbFwifV19fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiTW9iaWxlIE51bWJlclwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXRlbFwiLFwiYVwiOntcIm5hbWVcIjpcIm1vYmlsZVwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5tb2JpbGVcIn1dfX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIkFkZHJlc3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImFkZHJlc3NcIixcInBsYWNlaG9sZGVyXCI6XCJBZGRyZXNzXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLmFkZHJlc3NcIn1dfSxcImZcIjpbXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOltcIkNvdW50cnlcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1zZWxlY3RcIixcImFcIjp7XCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInByb2ZpbGVmb3JtLmNvdW50cnljb2RlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZCB0cmFuc3BhcmVudFwiLFwicGxhY2Vob2xkZXJcIjpcIkNvdW50cnlcIixcInNtYWxsXCI6XCIxXCIsXCJzZWFyY2hcIjpcIjFcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdENvdW50cnlMaXN0XCIsXCJtZXRhLmNvdW50cnlsaXN0XCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOltdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiU3RhdGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImFcIjp7XCJpZFwiOlwiZGl2c3RhdGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktc2VsZWN0XCIsXCJhXCI6e1widmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5zdGF0ZWNvZGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIHRyYW5zcGFyZW50XCIsXCJwbGFjZWhvbGRlclwiOlwiU3RhdGVcIixcInNlYXJjaFwiOlwiMVwiLFwic21hbGxcIjpcIjFcIixcIm9wdGlvbnNcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFN0YXRlTGlzdFwiLFwic3RhdGVsaXN0XCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOltdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiQ2l0eVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiYVwiOntcImlkXCI6XCJkaXZjaXR5XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLXNlbGVjdFwiLFwiYVwiOntcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicHJvZmlsZWZvcm0uY2l0eWNvZGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIHRyYW5zcGFyZW50XCIsXCJwbGFjZWhvbGRlclwiOlwiQ2l0eVwiLFwic2VhcmNoXCI6XCIxXCIsXCJzbWFsbFwiOlwiMVwiLFwib3B0aW9uc1wiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Q2l0eUxpc3RcIixcImNpdHlsaXN0XCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOltdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W1wiUGluIENvZGVcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInBpbmNvZGVcIixcInBsYWNlaG9sZGVyXCI6XCJQaW4gQ29kZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJwcm9maWxlZm9ybS5waW5jb2RlXCJ9XX19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwib25lIGNvbHVtbiByb3dcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJlZGl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwidWkgYnV0dG9uIG1hc3NpdmUgZmx1aWRcIn0sXCJmXCI6W1wiVXBkYXRlIFByb2ZpbGVcIl19XSxcIm5cIjo1MCxcInJcIjpcIm15cHJvZmlsZS5lZGl0XCJ9XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGZvdXIgY29sdW1uIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInJvd1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn19XX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlwcm9maWxlL2Zvcm0uaHRtbFxuICoqIG1vZHVsZSBpZCA9IDIxMlxuICoqIG1vZHVsZSBjaHVua3MgPSA0XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnaW50bC10ZWwtaW5wdXQvYnVpbGQvanMvaW50bFRlbElucHV0Jyk7XHJcblxyXG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dC5leHRlbmQoe1xyXG4gICAgXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzLFxyXG4gICAgICAgICAgICBpbnB1dCA9ICQodGhpcy5maW5kKCdpbnB1dCcpKVxyXG4gICAgICAgICAgICA7XHJcblxyXG5cclxuICAgICAgICBpbnB1dC5pbnRsVGVsSW5wdXQoe1xyXG4gICAgICAgICAgICBhdXRvUGxhY2Vob2xkZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBwcmVmZXJyZWRDb3VudHJpZXM6IFsnaW4nLCd1cycsJ2diJywncnUnXSxcclxuICAgICAgICAgICAgbmF0aW9uYWxNb2RlOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbnB1dC5vbigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbnRlYWRvd246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcy5maW5kKCdpbnB1dCcpKS5pbnRsVGVsSW5wdXQoJ2Rlc3Ryb3knKTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvcmUvZm9ybS90ZWwuanNcbiAqKiBtb2R1bGUgaWQgPSAyMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gNCA1XG4gKiovIiwiLypcbkludGVybmF0aW9uYWwgVGVsZXBob25lIElucHV0IHY1LjguN1xuaHR0cHM6Ly9naXRodWIuY29tL0JsdWVmaWVsZHNjb20vaW50bC10ZWwtaW5wdXQuZ2l0XG4qL1xuLy8gd3JhcCBpbiBVTUQgLSBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9qcXVlcnlQbHVnaW4uanNcbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbIFwianF1ZXJ5XCIgXSwgZnVuY3Rpb24oJCkge1xuICAgICAgICAgICAgZmFjdG9yeSgkLCB3aW5kb3csIGRvY3VtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuICAgIH1cbn0pKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8vIHRoZXNlIHZhcnMgcGVyc2lzdCB0aHJvdWdoIGFsbCBpbnN0YW5jZXMgb2YgdGhlIHBsdWdpblxuICAgIHZhciBwbHVnaW5OYW1lID0gXCJpbnRsVGVsSW5wdXRcIiwgaWQgPSAxLCAvLyBnaXZlIGVhY2ggaW5zdGFuY2UgaXQncyBvd24gaWQgZm9yIG5hbWVzcGFjZWQgZXZlbnQgaGFuZGxpbmdcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgLy8gdHlwaW5nIGRpZ2l0cyBhZnRlciBhIHZhbGlkIG51bWJlciB3aWxsIGJlIGFkZGVkIHRvIHRoZSBleHRlbnNpb24gcGFydCBvZiB0aGUgbnVtYmVyXG4gICAgICAgIGFsbG93RXh0ZW5zaW9uczogZmFsc2UsXG4gICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgZm9ybWF0IHRoZSBudW1iZXIgYWNjb3JkaW5nIHRvIHRoZSBzZWxlY3RlZCBjb3VudHJ5XG4gICAgICAgIGF1dG9Gb3JtYXQ6IHRydWUsXG4gICAgICAgIC8vIGFkZCBvciByZW1vdmUgaW5wdXQgcGxhY2Vob2xkZXIgd2l0aCBhbiBleGFtcGxlIG51bWJlciBmb3IgdGhlIHNlbGVjdGVkIGNvdW50cnlcbiAgICAgICAgYXV0b1BsYWNlaG9sZGVyOiB0cnVlLFxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBqdXN0IGEgZGlhbCBjb2RlIGluIHRoZSBpbnB1dDogcmVtb3ZlIGl0IG9uIGJsdXIsIGFuZCByZS1hZGQgaXQgb24gZm9jdXNcbiAgICAgICAgYXV0b0hpZGVEaWFsQ29kZTogdHJ1ZSxcbiAgICAgICAgLy8gZGVmYXVsdCBjb3VudHJ5XG4gICAgICAgIGRlZmF1bHRDb3VudHJ5OiBcIlwiLFxuICAgICAgICAvLyB0b2tlbiBmb3IgaXBpbmZvIC0gcmVxdWlyZWQgZm9yIGh0dHBzIG9yIG92ZXIgMTAwMCBkYWlseSBwYWdlIHZpZXdzIHN1cHBvcnRcbiAgICAgICAgaXBpbmZvVG9rZW46IFwiXCIsXG4gICAgICAgIC8vIGRvbid0IGluc2VydCBpbnRlcm5hdGlvbmFsIGRpYWwgY29kZXNcbiAgICAgICAgbmF0aW9uYWxNb2RlOiB0cnVlLFxuICAgICAgICAvLyBudW1iZXIgdHlwZSB0byB1c2UgZm9yIHBsYWNlaG9sZGVyc1xuICAgICAgICBudW1iZXJUeXBlOiBcIk1PQklMRVwiLFxuICAgICAgICAvLyBkaXNwbGF5IG9ubHkgdGhlc2UgY291bnRyaWVzXG4gICAgICAgIG9ubHlDb3VudHJpZXM6IFtdLFxuICAgICAgICAvLyB0aGUgY291bnRyaWVzIGF0IHRoZSB0b3Agb2YgdGhlIGxpc3QuIGRlZmF1bHRzIHRvIHVuaXRlZCBzdGF0ZXMgYW5kIHVuaXRlZCBraW5nZG9tXG4gICAgICAgIHByZWZlcnJlZENvdW50cmllczogWyBcInVzXCIsIFwiZ2JcIiBdLFxuICAgICAgICAvLyBzcGVjaWZ5IHRoZSBwYXRoIHRvIHRoZSBsaWJwaG9uZW51bWJlciBzY3JpcHQgdG8gZW5hYmxlIHZhbGlkYXRpb24vZm9ybWF0dGluZ1xuICAgICAgICB1dGlsc1NjcmlwdDogXCJcIlxuICAgIH0sIGtleXMgPSB7XG4gICAgICAgIFVQOiAzOCxcbiAgICAgICAgRE9XTjogNDAsXG4gICAgICAgIEVOVEVSOiAxMyxcbiAgICAgICAgRVNDOiAyNyxcbiAgICAgICAgUExVUzogNDMsXG4gICAgICAgIEE6IDY1LFxuICAgICAgICBaOiA5MCxcbiAgICAgICAgWkVSTzogNDgsXG4gICAgICAgIE5JTkU6IDU3LFxuICAgICAgICBTUEFDRTogMzIsXG4gICAgICAgIEJTUEFDRTogOCxcbiAgICAgICAgREVMOiA0NixcbiAgICAgICAgQ1RSTDogMTcsXG4gICAgICAgIENNRDE6IDkxLFxuICAgICAgICAvLyBDaHJvbWVcbiAgICAgICAgQ01EMjogMjI0XG4gICAgfSwgd2luZG93TG9hZGVkID0gZmFsc2U7XG4gICAgLy8ga2VlcCB0cmFjayBvZiBpZiB0aGUgd2luZG93LmxvYWQgZXZlbnQgaGFzIGZpcmVkIGFzIGltcG9zc2libGUgdG8gY2hlY2sgYWZ0ZXIgdGhlIGZhY3RcbiAgICAkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93TG9hZGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBQbHVnaW4oZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICAvLyBldmVudCBuYW1lc3BhY2VcbiAgICAgICAgdGhpcy5ucyA9IFwiLlwiICsgcGx1Z2luTmFtZSArIGlkKys7XG4gICAgICAgIC8vIENocm9tZSwgRkYsIFNhZmFyaSwgSUU5K1xuICAgICAgICB0aGlzLmlzR29vZEJyb3dzZXIgPSBCb29sZWFuKGVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UpO1xuICAgICAgICB0aGlzLmhhZEluaXRpYWxQbGFjZWhvbGRlciA9IEJvb2xlYW4oJChlbGVtZW50KS5hdHRyKFwicGxhY2Vob2xkZXJcIikpO1xuICAgICAgICB0aGlzLl9uYW1lID0gcGx1Z2luTmFtZTtcbiAgICB9XG4gICAgUGx1Z2luLnByb3RvdHlwZSA9IHtcbiAgICAgICAgX2luaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaWYgaW4gbmF0aW9uYWxNb2RlLCBkaXNhYmxlIG9wdGlvbnMgcmVsYXRpbmcgdG8gZGlhbCBjb2Rlc1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5uYXRpb25hbE1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuYXV0b0hpZGVEaWFsQ29kZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSUUgTW9iaWxlIGRvZXNuJ3Qgc3VwcG9ydCB0aGUga2V5cHJlc3MgZXZlbnQgKHNlZSBpc3N1ZSA2OCkgd2hpY2ggbWFrZXMgYXV0b0Zvcm1hdCBpbXBvc3NpYmxlXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvSUVNb2JpbGUvaSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuYXV0b0Zvcm1hdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2UgY2Fubm90IGp1c3QgdGVzdCBzY3JlZW4gc2l6ZSBhcyBzb21lIHNtYXJ0cGhvbmVzL3dlYnNpdGUgbWV0YSB0YWdzIHdpbGwgcmVwb3J0IGRlc2t0b3AgcmVzb2x1dGlvbnNcbiAgICAgICAgICAgIC8vIE5vdGU6IGZvciBzb21lIHJlYXNvbiBqYXNtaW5lIGZ1Y2tzIHVwIGlmIHlvdSBwdXQgdGhpcyBpbiB0aGUgbWFpbiBQbHVnaW4gZnVuY3Rpb24gd2l0aCB0aGUgcmVzdCBvZiB0aGVzZSBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgIC8vIE5vdGU6IHRvIHRhcmdldCBBbmRyb2lkIE1vYmlsZXMgKGFuZCBub3QgVGFibGV0cyksIHdlIG11c3QgZmluZCBcIkFuZHJvaWRcIiBhbmQgXCJNb2JpbGVcIlxuICAgICAgICAgICAgdGhpcy5pc01vYmlsZSA9IC9BbmRyb2lkLitNb2JpbGV8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgICAgICAgLy8gd2UgcmV0dXJuIHRoZXNlIGRlZmVycmVkIG9iamVjdHMgZnJvbSB0aGUgX2luaXQoKSBjYWxsIHNvIHRoZXkgY2FuIGJlIHdhdGNoZWQsIGFuZCB0aGVuIHdlIHJlc29sdmUgdGhlbSB3aGVuIGVhY2ggc3BlY2lmaWMgcmVxdWVzdCByZXR1cm5zXG4gICAgICAgICAgICAvLyBOb3RlOiBhZ2FpbiwgamFzbWluZSBoYWQgYSBzcGF6eiB3aGVuIEkgcHV0IHRoZXNlIGluIHRoZSBQbHVnaW4gZnVuY3Rpb25cbiAgICAgICAgICAgIHRoaXMuYXV0b0NvdW50cnlEZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgICAgICAgICB0aGlzLnV0aWxzU2NyaXB0RGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgICAgICAgICAgLy8gcHJvY2VzcyBhbGwgdGhlIGRhdGE6IG9ubHlDb3VudHJpZXMsIHByZWZlcnJlZENvdW50cmllcyBldGNcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NDb3VudHJ5RGF0YSgpO1xuICAgICAgICAgICAgLy8gZ2VuZXJhdGUgdGhlIG1hcmt1cFxuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVNYXJrdXAoKTtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgaW5wdXQgdmFsdWUgYW5kIHRoZSBzZWxlY3RlZCBmbGFnXG4gICAgICAgICAgICB0aGlzLl9zZXRJbml0aWFsU3RhdGUoKTtcbiAgICAgICAgICAgIC8vIHN0YXJ0IGFsbCBvZiB0aGUgZXZlbnQgbGlzdGVuZXJzOiBhdXRvSGlkZURpYWxDb2RlLCBpbnB1dCBrZXlkb3duLCBzZWxlY3RlZEZsYWcgY2xpY2tcbiAgICAgICAgICAgIHRoaXMuX2luaXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIC8vIHV0aWxzIHNjcmlwdCwgYW5kIGF1dG8gY291bnRyeVxuICAgICAgICAgICAgdGhpcy5faW5pdFJlcXVlc3RzKCk7XG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIGRlZmVycmVkc1xuICAgICAgICAgICAgcmV0dXJuIFsgdGhpcy5hdXRvQ291bnRyeURlZmVycmVkLCB0aGlzLnV0aWxzU2NyaXB0RGVmZXJyZWQgXTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAqICBQUklWQVRFIE1FVEhPRFNcbiAgICoqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAvLyBwcmVwYXJlIGFsbCBvZiB0aGUgY291bnRyeSBkYXRhLCBpbmNsdWRpbmcgb25seUNvdW50cmllcyBhbmQgcHJlZmVycmVkQ291bnRyaWVzIG9wdGlvbnNcbiAgICAgICAgX3Byb2Nlc3NDb3VudHJ5RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBzZXQgdGhlIGluc3RhbmNlcyBjb3VudHJ5IGRhdGEgb2JqZWN0c1xuICAgICAgICAgICAgdGhpcy5fc2V0SW5zdGFuY2VDb3VudHJ5RGF0YSgpO1xuICAgICAgICAgICAgLy8gc2V0IHRoZSBwcmVmZXJyZWRDb3VudHJpZXMgcHJvcGVydHlcbiAgICAgICAgICAgIHRoaXMuX3NldFByZWZlcnJlZENvdW50cmllcygpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBhZGQgYSBjb3VudHJ5IGNvZGUgdG8gdGhpcy5jb3VudHJ5Q29kZXNcbiAgICAgICAgX2FkZENvdW50cnlDb2RlOiBmdW5jdGlvbihpc28yLCBkaWFsQ29kZSwgcHJpb3JpdHkpIHtcbiAgICAgICAgICAgIGlmICghKGRpYWxDb2RlIGluIHRoaXMuY291bnRyeUNvZGVzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUNvZGVzW2RpYWxDb2RlXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcHJpb3JpdHkgfHwgMDtcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUNvZGVzW2RpYWxDb2RlXVtpbmRleF0gPSBpc28yO1xuICAgICAgICB9LFxuICAgICAgICAvLyBwcm9jZXNzIG9ubHlDb3VudHJpZXMgYXJyYXkgaWYgcHJlc2VudCwgYW5kIGdlbmVyYXRlIHRoZSBjb3VudHJ5Q29kZXMgbWFwXG4gICAgICAgIF9zZXRJbnN0YW5jZUNvdW50cnlEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgLy8gcHJvY2VzcyBvbmx5Q291bnRyaWVzIG9wdGlvblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbmx5Q291bnRyaWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIHN0YW5kYXJkaXNlIGNhc2VcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm9ubHlDb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9ubHlDb3VudHJpZXNbaV0gPSB0aGlzLm9wdGlvbnMub25seUNvdW50cmllc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBidWlsZCBpbnN0YW5jZSBjb3VudHJ5IGFycmF5XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJpZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYWxsQ291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoYWxsQ291bnRyaWVzW2ldLmlzbzIsIHRoaXMub3B0aW9ucy5vbmx5Q291bnRyaWVzKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3VudHJpZXMucHVzaChhbGxDb3VudHJpZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cmllcyA9IGFsbENvdW50cmllcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIGNvdW50cnlDb2RlcyBtYXBcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUNvZGVzID0ge307XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5jb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHRoaXMuY291bnRyaWVzW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FkZENvdW50cnlDb2RlKGMuaXNvMiwgYy5kaWFsQ29kZSwgYy5wcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgLy8gYXJlYSBjb2Rlc1xuICAgICAgICAgICAgICAgIGlmIChjLmFyZWFDb2Rlcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGMuYXJlYUNvZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmdWxsIGRpYWwgY29kZSBpcyBjb3VudHJ5IGNvZGUgKyBkaWFsIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZENvdW50cnlDb2RlKGMuaXNvMiwgYy5kaWFsQ29kZSArIGMuYXJlYUNvZGVzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHJvY2VzcyBwcmVmZXJyZWQgY291bnRyaWVzIC0gaXRlcmF0ZSB0aHJvdWdoIHRoZSBwcmVmZXJlbmNlcyxcbiAgICAgICAgLy8gZmV0Y2hpbmcgdGhlIGNvdW50cnkgZGF0YSBmb3IgZWFjaCBvbmVcbiAgICAgICAgX3NldFByZWZlcnJlZENvdW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnByZWZlcnJlZENvdW50cmllcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMucHJlZmVycmVkQ291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvdW50cnlDb2RlID0gdGhpcy5vcHRpb25zLnByZWZlcnJlZENvdW50cmllc1tpXS50b0xvd2VyQ2FzZSgpLCBjb3VudHJ5RGF0YSA9IHRoaXMuX2dldENvdW50cnlEYXRhKGNvdW50cnlDb2RlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50cnlEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZmVycmVkQ291bnRyaWVzLnB1c2goY291bnRyeURhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2VuZXJhdGUgYWxsIG9mIHRoZSBtYXJrdXAgZm9yIHRoZSBwbHVnaW46IHRoZSBzZWxlY3RlZCBmbGFnIG92ZXJsYXksIGFuZCB0aGUgZHJvcGRvd25cbiAgICAgICAgX2dlbmVyYXRlTWFya3VwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIHRlbGVwaG9uZSBpbnB1dFxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dCA9ICQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIC8vIHByZXZlbnQgYXV0b2NvbXBsZXRlIGFzIHRoZXJlJ3Mgbm8gc2FmZSwgY3Jvc3MtYnJvd3NlciBldmVudCB3ZSBjYW4gcmVhY3QgdG8sIHNvIGl0IGNhbiBlYXNpbHkgcHV0IHRoZSBwbHVnaW4gaW4gYW4gaW5jb25zaXN0ZW50IHN0YXRlIGUuZy4gdGhlIHdyb25nIGZsYWcgc2VsZWN0ZWQgZm9yIHRoZSBhdXRvY29tcGxldGVkIG51bWJlciwgd2hpY2ggb24gc3VibWl0IGNvdWxkIG1lYW4gdGhlIHdyb25nIG51bWJlciBpcyBzYXZlZCAoZXNwIGluIG5hdGlvbmFsTW9kZSlcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQuYXR0cihcImF1dG9jb21wbGV0ZVwiLCBcIm9mZlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5lcnMgKG1vc3RseSBmb3IgcG9zaXRpb25pbmcpXG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LndyYXAoJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaW50bC10ZWwtaW5wdXRcIlxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdmFyIGZsYWdzQ29udGFpbmVyID0gJChcIjxkaXY+XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiZmxhZy1kcm9wZG93blwiXG4gICAgICAgICAgICB9KS5pbnNlcnRBZnRlcih0aGlzLnRlbElucHV0KTtcbiAgICAgICAgICAgIC8vIGN1cnJlbnRseSBzZWxlY3RlZCBmbGFnIChkaXNwbGF5ZWQgdG8gbGVmdCBvZiBpbnB1dClcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEZsYWcgPSAkKFwiPGRpdj5cIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzZWxlY3RlZC1mbGFnXCJcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKGZsYWdzQ29udGFpbmVyKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIgPSAkKFwiPGRpdj5cIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJpdGktZmxhZ1wiXG4gICAgICAgICAgICB9KS5hcHBlbmRUbyhzZWxlY3RlZEZsYWcpO1xuICAgICAgICAgICAgLy8gQ1NTIHRyaWFuZ2xlXG4gICAgICAgICAgICAkKFwiPGRpdj5cIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJhcnJvd1wiXG4gICAgICAgICAgICB9KS5hcHBlbmRUbyhzZWxlY3RlZEZsYWcpO1xuICAgICAgICAgICAgLy8gY291bnRyeSBsaXN0XG4gICAgICAgICAgICAvLyBtb2JpbGUgaXMganVzdCBhIG5hdGl2ZSBzZWxlY3QgZWxlbWVudFxuICAgICAgICAgICAgLy8gZGVza3RvcCBpcyBhIHByb3BlciBsaXN0IGNvbnRhaW5pbmc6IHByZWZlcnJlZCBjb3VudHJpZXMsIHRoZW4gZGl2aWRlciwgdGhlbiBhbGwgY291bnRyaWVzXG4gICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QgPSAkKFwiPHNlbGVjdD5cIikuYXBwZW5kVG8oZmxhZ3NDb250YWluZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0ID0gJChcIjx1bD5cIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY291bnRyeS1saXN0IHYtaGlkZVwiXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oZmxhZ3NDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZWZlcnJlZENvdW50cmllcy5sZW5ndGggJiYgIXRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kTGlzdEl0ZW1zKHRoaXMucHJlZmVycmVkQ291bnRyaWVzLCBcInByZWZlcnJlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIjxsaT5cIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpdmlkZXJcIlxuICAgICAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbyh0aGlzLmNvdW50cnlMaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hcHBlbmRMaXN0SXRlbXModGhpcy5jb3VudHJpZXMsIFwiXCIpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgLy8gbm93IHdlIGNhbiBncmFiIHRoZSBkcm9wZG93biBoZWlnaHQsIGFuZCBoaWRlIGl0IHByb3Blcmx5XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bkhlaWdodCA9IHRoaXMuY291bnRyeUxpc3Qub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0LnJlbW92ZUNsYXNzKFwidi1oaWRlXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHVzZWZ1bCBpbiBsb3RzIG9mIHBsYWNlc1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3RJdGVtcyA9IHRoaXMuY291bnRyeUxpc3QuY2hpbGRyZW4oXCIuY291bnRyeVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gYWRkIGEgY291bnRyeSA8bGk+IHRvIHRoZSBjb3VudHJ5TGlzdCA8dWw+IGNvbnRhaW5lclxuICAgICAgICAvLyBVUERBVEU6IGlmIGlzTW9iaWxlLCBhZGQgYW4gPG9wdGlvbj4gdG8gdGhlIGNvdW50cnlMaXN0IDxzZWxlY3Q+IGNvbnRhaW5lclxuICAgICAgICBfYXBwZW5kTGlzdEl0ZW1zOiBmdW5jdGlvbihjb3VudHJpZXMsIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgLy8gd2UgY3JlYXRlIHNvIG1hbnkgRE9NIGVsZW1lbnRzLCBpdCBpcyBmYXN0ZXIgdG8gYnVpbGQgYSB0ZW1wIHN0cmluZ1xuICAgICAgICAgICAgLy8gYW5kIHRoZW4gYWRkIGV2ZXJ5dGhpbmcgdG8gdGhlIERPTSBpbiBvbmUgZ28gYXQgdGhlIGVuZFxuICAgICAgICAgICAgdmFyIHRtcCA9IFwiXCI7XG4gICAgICAgICAgICAvLyBmb3IgZWFjaCBjb3VudHJ5XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjID0gY291bnRyaWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjxvcHRpb24gZGF0YS1kaWFsLWNvZGU9J1wiICsgYy5kaWFsQ29kZSArIFwiJyB2YWx1ZT0nXCIgKyBjLmlzbzIgKyBcIic+XCI7XG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBjLm5hbWUgKyBcIiArXCIgKyBjLmRpYWxDb2RlO1xuICAgICAgICAgICAgICAgICAgICB0bXAgKz0gXCI8L29wdGlvbj5cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBvcGVuIHRoZSBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPGxpIGNsYXNzPSdjb3VudHJ5IFwiICsgY2xhc3NOYW1lICsgXCInIGRhdGEtZGlhbC1jb2RlPSdcIiArIGMuZGlhbENvZGUgKyBcIicgZGF0YS1jb3VudHJ5LWNvZGU9J1wiICsgYy5pc28yICsgXCInPlwiO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGZsYWdcbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPGRpdiBjbGFzcz0nZmxhZyc+PGRpdiBjbGFzcz0naXRpLWZsYWcgXCIgKyBjLmlzbzIgKyBcIic+PC9kaXY+PC9kaXY+XCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCB0aGUgY291bnRyeSBuYW1lIGFuZCBkaWFsIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPHNwYW4gY2xhc3M9J2NvdW50cnktbmFtZSc+XCIgKyBjLm5hbWUgKyBcIjwvc3Bhbj5cIjtcbiAgICAgICAgICAgICAgICAgICAgdG1wICs9IFwiPHNwYW4gY2xhc3M9J2RpYWwtY29kZSc+K1wiICsgYy5kaWFsQ29kZSArIFwiPC9zcGFuPlwiO1xuICAgICAgICAgICAgICAgICAgICAvLyBjbG9zZSB0aGUgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgICAgIHRtcCArPSBcIjwvbGk+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5hcHBlbmQodG1wKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2V0IHRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBpbnB1dCB2YWx1ZSBhbmQgdGhlIHNlbGVjdGVkIGZsYWdcbiAgICAgICAgX3NldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy50ZWxJbnB1dC52YWwoKTtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgbnVtYmVyLCBhbmQgaXQncyB2YWxpZCwgd2UgY2FuIGdvIGFoZWFkIGFuZCBzZXQgdGhlIGZsYWcsIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHRcbiAgICAgICAgICAgIGlmICh0aGlzLl9nZXREaWFsQ29kZSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRmxhZ0Zyb21OdW1iZXIodmFsLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmRlZmF1bHRDb3VudHJ5ICE9IFwiYXV0b1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgdGhlIGRlZmF1bHRDb3VudHJ5IG9wdGlvbiwgZWxzZSBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGluIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPSB0aGlzLl9nZXRDb3VudHJ5RGF0YSh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkudG9Mb3dlckNhc2UoKSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPSB0aGlzLnByZWZlcnJlZENvdW50cmllcy5sZW5ndGggPyB0aGlzLnByZWZlcnJlZENvdW50cmllc1swXSA6IHRoaXMuY291bnRyaWVzWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RGbGFnKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeS5pc28yKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBlbXB0eSwgaW5zZXJ0IHRoZSBkZWZhdWx0IGRpYWwgY29kZSAodGhpcyBmdW5jdGlvbiB3aWxsIGNoZWNrICFuYXRpb25hbE1vZGUgYW5kICFhdXRvSGlkZURpYWxDb2RlKVxuICAgICAgICAgICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURpYWxDb2RlKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeS5kaWFsQ29kZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGZvcm1hdFxuICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgd29udCBiZSBydW4gYWZ0ZXIgX3VwZGF0ZURpYWxDb2RlIGFzIHRoYXQncyBvbmx5IGNhbGxlZCBpZiBubyB2YWxcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWYWwodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gaW5pdGlhbGlzZSB0aGUgbWFpbiBldmVudCBsaXN0ZW5lcnM6IGlucHV0IGtleXVwLCBhbmQgY2xpY2sgc2VsZWN0ZWQgZmxhZ1xuICAgICAgICBfaW5pdExpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLl9pbml0S2V5TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAvLyBhdXRvRm9ybWF0IHByZXZlbnRzIHRoZSBjaGFuZ2UgZXZlbnQgZnJvbSBmaXJpbmcsIHNvIHdlIG5lZWQgdG8gY2hlY2sgZm9yIGNoYW5nZXMgYmV0d2VlbiBmb2N1cyBhbmQgYmx1ciBpbiBvcmRlciB0byBtYW51YWxseSB0cmlnZ2VyIGl0XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUgfHwgdGhpcy5vcHRpb25zLmF1dG9Gb3JtYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0Rm9jdXNMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5vbihcImNoYW5nZVwiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9zZWxlY3RMaXN0SXRlbSgkKHRoaXMpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBoYWNrIGZvciBpbnB1dCBuZXN0ZWQgaW5zaWRlIGxhYmVsOiBjbGlja2luZyB0aGUgc2VsZWN0ZWQtZmxhZyB0byBvcGVuIHRoZSBkcm9wZG93biB3b3VsZCB0aGVuIGF1dG9tYXRpY2FsbHkgdHJpZ2dlciBhIDJuZCBjbGljayBvbiB0aGUgaW5wdXQgd2hpY2ggd291bGQgY2xvc2UgaXQgYWdhaW5cbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnRlbElucHV0LmNsb3Nlc3QoXCJsYWJlbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsLm9uKFwiY2xpY2tcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBkcm9wZG93biBpcyBjbG9zZWQsIHRoZW4gZm9jdXMgdGhlIGlucHV0LCBlbHNlIGlnbm9yZSB0aGUgY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmNvdW50cnlMaXN0Lmhhc0NsYXNzKFwiaGlkZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdG9nZ2xlIGNvdW50cnkgZHJvcGRvd24gb24gY2xpY2tcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRGbGFnID0gdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEZsYWcub24oXCJjbGlja1wiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IGludGVyY2VwdCB0aGlzIGV2ZW50IGlmIHdlJ3JlIG9wZW5pbmcgdGhlIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgbGV0IGl0IGJ1YmJsZSB1cCB0byB0aGUgdG9wIChcImNsaWNrLW9mZi10by1jbG9zZVwiIGxpc3RlbmVyKVxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjYW5ub3QganVzdCBzdG9wUHJvcGFnYXRpb24gYXMgaXQgbWF5IGJlIG5lZWRlZCB0byBjbG9zZSBhbm90aGVyIGluc3RhbmNlXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmNvdW50cnlMaXN0Lmhhc0NsYXNzKFwiaGlkZVwiKSAmJiAhdGhhdC50ZWxJbnB1dC5wcm9wKFwiZGlzYWJsZWRcIikgJiYgIXRoYXQudGVsSW5wdXQucHJvcChcInJlYWRvbmx5XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9zaG93RHJvcGRvd24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfaW5pdFJlcXVlc3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGhhcyBzcGVjaWZpZWQgdGhlIHBhdGggdG8gdGhlIHV0aWxzIHNjcmlwdCwgZmV0Y2ggaXQgb24gd2luZG93LmxvYWRcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudXRpbHNTY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcGx1Z2luIGlzIGJlaW5nIGluaXRpYWxpc2VkIGFmdGVyIHRoZSB3aW5kb3cubG9hZCBldmVudCBoYXMgYWxyZWFkeSBiZWVuIGZpcmVkXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvd0xvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRVdGlscygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdhaXQgdW50aWwgdGhlIGxvYWQgZXZlbnQgc28gd2UgZG9uJ3QgYmxvY2sgYW55IG90aGVyIHJlcXVlc3RzIGUuZy4gdGhlIGZsYWdzIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2FkVXRpbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV0aWxzU2NyaXB0RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSA9PSBcImF1dG9cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRBdXRvQ291bnRyeSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9Db3VudHJ5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfbG9hZEF1dG9Db3VudHJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBjb29raWVcbiAgICAgICAgICAgIHZhciBjb29raWVBdXRvQ291bnRyeSA9ICQuY29va2llID8gJC5jb29raWUoXCJpdGlBdXRvQ291bnRyeVwiKSA6IFwiXCI7XG4gICAgICAgICAgICBpZiAoY29va2llQXV0b0NvdW50cnkpIHtcbiAgICAgICAgICAgICAgICAkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5ID0gY29va2llQXV0b0NvdW50cnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAzIG9wdGlvbnM6XG4gICAgICAgICAgICAvLyAxKSBhbHJlYWR5IGxvYWRlZCAod2UncmUgZG9uZSlcbiAgICAgICAgICAgIC8vIDIpIG5vdCBhbHJlYWR5IHN0YXJ0ZWQgbG9hZGluZyAoc3RhcnQpXG4gICAgICAgICAgICAvLyAzKSBhbHJlYWR5IHN0YXJ0ZWQgbG9hZGluZyAoZG8gbm90aGluZyAtIGp1c3Qgd2FpdCBmb3IgbG9hZGluZyBjYWxsYmFjayB0byBmaXJlKVxuICAgICAgICAgICAgaWYgKCQuZm5bcGx1Z2luTmFtZV0uYXV0b0NvdW50cnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9Db3VudHJ5TG9hZGVkKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCEkLmZuW3BsdWdpbk5hbWVdLnN0YXJ0ZWRMb2FkaW5nQXV0b0NvdW50cnkpIHtcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBkbyB0aGlzIHR3aWNlIVxuICAgICAgICAgICAgICAgICQuZm5bcGx1Z2luTmFtZV0uc3RhcnRlZExvYWRpbmdBdXRvQ291bnRyeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGlwaW5mb1VSTCA9IFwiLy9pcGluZm8uaW9cIjtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlwaW5mb1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlwaW5mb1VSTCArPSBcIj90b2tlbj1cIiArIHRoaXMub3B0aW9ucy5pcGluZm9Ub2tlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG9udCBib3RoZXIgd2l0aCB0aGUgc3VjY2VzcyBmdW5jdGlvbiBhcmcgLSBpbnN0ZWFkIHVzZSBhbHdheXMoKSBhcyBzaG91bGQgc3RpbGwgc2V0IGEgZGVmYXVsdENvdW50cnkgZXZlbiBpZiB0aGUgbG9va3VwIGZhaWxzXG4gICAgICAgICAgICAgICAgJC5nZXQoaXBpbmZvVVJMLCBmdW5jdGlvbigpIHt9LCBcImpzb25wXCIpLmFsd2F5cyhmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZm5bcGx1Z2luTmFtZV0uYXV0b0NvdW50cnkgPSByZXNwICYmIHJlc3AuY291bnRyeSA/IHJlc3AuY291bnRyeS50b0xvd2VyQ2FzZSgpIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuY29va2llKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmNvb2tpZShcIml0aUF1dG9Db3VudHJ5XCIsICQuZm5bcGx1Z2luTmFtZV0uYXV0b0NvdW50cnksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBcIi9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdGVsbCBhbGwgaW5zdGFuY2VzIHRoZSBhdXRvIGNvdW50cnkgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogdGhpcyBzaG91bGQganVzdCBiZSB0aGUgY3VycmVudCBpbnN0YW5jZXNcbiAgICAgICAgICAgICAgICAgICAgJChcIi5pbnRsLXRlbC1pbnB1dCBpbnB1dFwiKS5pbnRsVGVsSW5wdXQoXCJhdXRvQ291bnRyeUxvYWRlZFwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2luaXRLZXlMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgLy8gZm9ybWF0IG51bWJlciBhbmQgdXBkYXRlIGZsYWcgb24ga2V5cHJlc3NcbiAgICAgICAgICAgICAgICAvLyB1c2Uga2V5cHJlc3MgZXZlbnQgYXMgd2Ugd2FudCB0byBpZ25vcmUgYWxsIGlucHV0IGV4Y2VwdCBmb3IgYSBzZWxlY3QgZmV3IGtleXMsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHdlIGRvbnQgd2FudCB0byBpZ25vcmUgdGhlIG5hdmlnYXRpb24ga2V5cyBsaWtlIHRoZSBhcnJvd3MgZXRjLlxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IG5vIHBvaW50IGluIHJlZmFjdG9yaW5nIHRoaXMgdG8gb25seSBiaW5kIHRoZXNlIGxpc3RlbmVycyBvbiBmb2N1cy9ibHVyIGJlY2F1c2UgdGhlbiB5b3Ugd291bGQgbmVlZCB0byBoYXZlIHRob3NlIDIgbGlzdGVuZXJzIHJ1bm5pbmcgdGhlIHdob2xlIHRpbWUgYW55d2F5Li4uXG4gICAgICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcImtleXByZXNzXCIgKyB0aGlzLm5zLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDMyIGlzIHNwYWNlLCBhbmQgYWZ0ZXIgdGhhdCBpdCdzIGFsbCBjaGFycyAobm90IG1ldGEvbmF2IGtleXMpXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgZml4IGlzIG5lZWRlZCBmb3IgRmlyZWZveCwgd2hpY2ggdHJpZ2dlcnMga2V5cHJlc3MgZXZlbnQgZm9yIHNvbWUgbWV0YS9uYXYga2V5c1xuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGU6IGFsc28gaWdub3JlIGlmIHRoaXMgaXMgYSBtZXRhS2V5IGUuZy4gRkYgYW5kIFNhZmFyaSB0cmlnZ2VyIGtleXByZXNzIG9uIHRoZSB2IG9mIEN0cmwrdlxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGU6IGFsc28gaWdub3JlIGlmIGN0cmxLZXkgKEZGIG9uIFdpbmRvd3MvVWJ1bnR1KVxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGU6IGFsc28gY2hlY2sgdGhhdCB3ZSBoYXZlIHV0aWxzIGJlZm9yZSB3ZSBkbyBhbnkgYXV0b0Zvcm1hdCBzdHVmZlxuICAgICAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA+PSBrZXlzLlNQQUNFICYmICFlLmN0cmxLZXkgJiYgIWUubWV0YUtleSAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgJiYgIXRoYXQudGVsSW5wdXQucHJvcChcInJlYWRvbmx5XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGxvd2VkIGtleXMgYXJlIGp1c3QgbnVtZXJpYyBrZXlzIGFuZCBwbHVzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBtdXN0IGFsbG93IHBsdXMgZm9yIHRoZSBjYXNlIHdoZXJlIHRoZSB1c2VyIGRvZXMgc2VsZWN0LWFsbCBhbmQgdGhlbiBoaXRzIHBsdXMgdG8gc3RhcnQgdHlwaW5nIGEgbmV3IG51bWJlci4gd2UgY291bGQgcmVmaW5lIHRoaXMgbG9naWMgdG8gZmlyc3QgY2hlY2sgdGhhdCB0aGUgc2VsZWN0aW9uIGNvbnRhaW5zIGEgcGx1cywgYnV0IHRoYXQgd29udCB3b3JrIGluIG9sZCBicm93c2VycywgYW5kIEkgdGhpbmsgaXQncyBvdmVya2lsbCBhbnl3YXlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0FsbG93ZWRLZXkgPSBlLndoaWNoID49IGtleXMuWkVSTyAmJiBlLndoaWNoIDw9IGtleXMuTklORSB8fCBlLndoaWNoID09IGtleXMuUExVUywgaW5wdXQgPSB0aGF0LnRlbElucHV0WzBdLCBub1NlbGVjdGlvbiA9IHRoYXQuaXNHb29kQnJvd3NlciAmJiBpbnB1dC5zZWxlY3Rpb25TdGFydCA9PSBpbnB1dC5zZWxlY3Rpb25FbmQsIG1heCA9IHRoYXQudGVsSW5wdXQuYXR0cihcIm1heGxlbmd0aFwiKSwgdmFsID0gdGhhdC50ZWxJbnB1dC52YWwoKSwgLy8gYXNzdW1lcyB0aGF0IGlmIG1heCBleGlzdHMsIGl0IGlzID4wXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0JlbG93TWF4ID0gbWF4ID8gdmFsLmxlbmd0aCA8IG1heCA6IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdDogZW5zdXJlIHdlIGRvbnQgZ28gb3ZlciBtYXhsZW5ndGguIHdlIG11c3QgZG8gdGhpcyBoZXJlIHRvIHByZXZlbnQgYWRkaW5nIGRpZ2l0cyBpbiB0aGUgbWlkZGxlIG9mIHRoZSBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0aWxsIHJlZm9ybWF0IGV2ZW4gaWYgbm90IGFuIGFsbG93ZWQga2V5IGFzIHRoZXkgY291bGQgYnkgdHlwaW5nIGEgZm9ybWF0dGluZyBjaGFyLCBidXQgaWdub3JlIGlmIHRoZXJlJ3MgYSBzZWxlY3Rpb24gYXMgZG9lc24ndCBtYWtlIHNlbnNlIHRvIHJlcGxhY2Ugc2VsZWN0aW9uIHdpdGggaWxsZWdhbCBjaGFyIGFuZCB0aGVuIGltbWVkaWF0ZWx5IHJlbW92ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmVsb3dNYXggJiYgKGlzQWxsb3dlZEtleSB8fCBub1NlbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Q2hhciA9IGlzQWxsb3dlZEtleSA/IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZUlucHV0S2V5KG5ld0NoYXIsIHRydWUsIGlzQWxsb3dlZEtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgc29tZXRoaW5nIGhhcyBjaGFuZ2VkLCB0cmlnZ2VyIHRoZSBpbnB1dCBldmVudCAod2hpY2ggd2FzIG90aGVyd2lzZWQgc3F1YXNoZWQgYnkgdGhlIHByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT0gdGhhdC50ZWxJbnB1dC52YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LnRyaWdnZXIoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQWxsb3dlZEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZUludmFsaWRLZXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaGFuZGxlIGN1dC9wYXN0ZSBldmVudCAobm93IHN1cHBvcnRlZCBpbiBhbGwgbWFqb3IgYnJvd3NlcnMpXG4gICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9uKFwiY3V0XCIgKyB0aGlzLm5zICsgXCIgcGFzdGVcIiArIHRoaXMubnMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGhhY2sgYmVjYXVzZSBcInBhc3RlXCIgZXZlbnQgaXMgZmlyZWQgYmVmb3JlIGlucHV0IGlzIHVwZGF0ZWRcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmF1dG9Gb3JtYXQgJiYgd2luZG93LmludGxUZWxJbnB1dFV0aWxzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3Vyc29yQXRFbmQgPSB0aGF0LmlzR29vZEJyb3dzZXIgJiYgdGhhdC50ZWxJbnB1dFswXS5zZWxlY3Rpb25TdGFydCA9PSB0aGF0LnRlbElucHV0LnZhbCgpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZUlucHV0S2V5KG51bGwsIGN1cnNvckF0RW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2Vuc3VyZVBsdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vIGF1dG9Gb3JtYXQsIGp1c3QgdXBkYXRlIGZsYWdcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3VwZGF0ZUZsYWdGcm9tTnVtYmVyKHRoYXQudGVsSW5wdXQudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBrZXl1cCBldmVudFxuICAgICAgICAgICAgLy8gaWYgYXV0b0Zvcm1hdCBlbmFibGVkOiB3ZSB1c2Uga2V5dXAgdG8gY2F0Y2ggZGVsZXRlIGV2ZW50cyAoYWZ0ZXIgdGhlIGZhY3QpXG4gICAgICAgICAgICAvLyBpZiBubyBhdXRvRm9ybWF0LCB0aGlzIGlzIHVzZWQgdG8gdXBkYXRlIHRoZSBmbGFnXG4gICAgICAgICAgICB0aGlzLnRlbElucHV0Lm9uKFwia2V5dXBcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGUgXCJlbnRlclwiIGtleSBldmVudCBmcm9tIHNlbGVjdGluZyBhIGRyb3Bkb3duIGl0ZW0gaXMgdHJpZ2dlcmVkIGhlcmUgb24gdGhlIGlucHV0LCBiZWNhdXNlIHRoZSBkb2N1bWVudC5rZXlkb3duIGhhbmRsZXIgdGhhdCBpbml0aWFsbHkgaGFuZGxlcyB0aGF0IGV2ZW50IHRyaWdnZXJzIGEgZm9jdXMgb24gdGhlIGlucHV0LCBhbmQgc28gdGhlIGtleXVwIGZvciB0aGF0IHNhbWUga2V5IGV2ZW50IGdldHMgdHJpZ2dlcmVkIGhlcmUuIHdlaXJkLCBidXQganVzdCBtYWtlIHN1cmUgd2UgZG9udCBib3RoZXIgZG9pbmcgYW55IHJlLWZvcm1hdHRpbmcgaW4gdGhpcyBjYXNlICh3ZSd2ZSBhbHJlYWR5IGRvbmUgcHJldmVudERlZmF1bHQgaW4gdGhlIGtleWRvd24gaGFuZGxlciwgc28gaXQgd29udCBhY3R1YWxseSBzdWJtaXQgdGhlIGZvcm0gb3IgYW55dGhpbmcpLlxuICAgICAgICAgICAgICAgIC8vIEFMU086IGlnbm9yZSBrZXl1cCBpZiByZWFkb25seVxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleXMuRU5URVIgfHwgdGhhdC50ZWxJbnB1dC5wcm9wKFwicmVhZG9ubHlcIikpIHt9IGVsc2UgaWYgKHRoYXQub3B0aW9ucy5hdXRvRm9ybWF0ICYmIHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjdXJzb3JBdEVuZCBkZWZhdWx0cyB0byBmYWxzZSBmb3IgYmFkIGJyb3dzZXJzIGVsc2UgdGhleSB3b3VsZCBuZXZlciBnZXQgYSByZWZvcm1hdCBvbiBkZWxldGVcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnNvckF0RW5kID0gdGhhdC5pc0dvb2RCcm93c2VyICYmIHRoYXQudGVsSW5wdXRbMF0uc2VsZWN0aW9uU3RhcnQgPT0gdGhhdC50ZWxJbnB1dC52YWwoKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC50ZWxJbnB1dC52YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhleSBqdXN0IGNsZWFyZWQgdGhlIGlucHV0LCB1cGRhdGUgdGhlIGZsYWcgdG8gdGhlIGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3VwZGF0ZUZsYWdGcm9tTnVtYmVyKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT0ga2V5cy5ERUwgJiYgIWN1cnNvckF0RW5kIHx8IGUud2hpY2ggPT0ga2V5cy5CU1BBQ0UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGRlbGV0ZSBpbiB0aGUgbWlkZGxlOiByZWZvcm1hdCB3aXRoIG5vIHN1ZmZpeCAobm8gbmVlZCB0byByZWZvcm1hdCBpZiBkZWxldGUgYXQgZW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgYmFja3NwYWNlOiByZWZvcm1hdCB3aXRoIG5vIHN1ZmZpeCAobmVlZCB0byByZWZvcm1hdCBpZiBhdCBlbmQgdG8gcmVtb3ZlIGFueSBsaW5nZXJpbmcgc3VmZml4IC0gdGhpcyBpcyBhIGZlYXR1cmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbXBvcnRhbnQgdG8gcmVtZW1iZXIgbmV2ZXIgdG8gYWRkIHN1ZmZpeCBvbiBhbnkgZGVsZXRlIGtleSBhcyBjYW4gZnVjayB1cCBpbiBpZTggc28geW91IGNhbiBuZXZlciBkZWxldGUgYSBmb3JtYXR0aW5nIGNoYXIgYXQgdGhlIGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5faGFuZGxlSW5wdXRLZXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9lbnN1cmVQbHVzKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm8gYXV0b0Zvcm1hdCwganVzdCB1cGRhdGUgZmxhZ1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll91cGRhdGVGbGFnRnJvbU51bWJlcih0aGF0LnRlbElucHV0LnZhbCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHJldmVudCBkZWxldGluZyB0aGUgcGx1cyAoaWYgbm90IGluIG5hdGlvbmFsTW9kZSlcbiAgICAgICAgX2Vuc3VyZVBsdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudGVsSW5wdXQudmFsKCksIGlucHV0ID0gdGhpcy50ZWxJbnB1dFswXTtcbiAgICAgICAgICAgICAgICBpZiAodmFsLmNoYXJBdCgwKSAhPSBcIitcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBuZXdDdXJzb3JQb3MgaXMgY3VycmVudCBwb3MgKyAxIHRvIGFjY291bnQgZm9yIHRoZSBwbHVzIHdlIGFyZSBhYm91dCB0byBhZGRcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0N1cnNvclBvcyA9IHRoaXMuaXNHb29kQnJvd3NlciA/IGlucHV0LnNlbGVjdGlvblN0YXJ0ICsgMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXQudmFsKFwiK1wiICsgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UobmV3Q3Vyc29yUG9zLCBuZXdDdXJzb3JQb3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBhbGVydCB0aGUgdXNlciB0byBhbiBpbnZhbGlkIGtleSBldmVudFxuICAgICAgICBfaGFuZGxlSW52YWxpZEtleTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LnRyaWdnZXIoXCJpbnZhbGlka2V5XCIpLmFkZENsYXNzKFwiaXRpLWludmFsaWQta2V5XCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LnJlbW92ZUNsYXNzKFwiaXRpLWludmFsaWQta2V5XCIpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gd2hlbiBhdXRvRm9ybWF0IGlzIGVuYWJsZWQ6IGhhbmRsZSB2YXJpb3VzIGtleSBldmVudHMgb24gdGhlIGlucHV0OlxuICAgICAgICAvLyAxKSBhZGRpbmcgYSBuZXcgbnVtYmVyIGNoYXJhY3Rlciwgd2hpY2ggd2lsbCByZXBsYWNlIGFueSBzZWxlY3Rpb24sIHJlZm9ybWF0LCBhbmQgcHJlc2VydmUgdGhlIGN1cnNvciBwb3NpdGlvblxuICAgICAgICAvLyAyKSByZWZvcm1hdHRpbmcgb24gYmFja3NwYWNlL2RlbGV0ZVxuICAgICAgICAvLyAzKSBjdXQvcGFzdGUgZXZlbnRcbiAgICAgICAgX2hhbmRsZUlucHV0S2V5OiBmdW5jdGlvbihuZXdOdW1lcmljQ2hhciwgYWRkU3VmZml4LCBpc0FsbG93ZWRLZXkpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnRlbElucHV0LnZhbCgpLCBjbGVhbkJlZm9yZSA9IHRoaXMuX2dldENsZWFuKHZhbCksIG9yaWdpbmFsTGVmdENoYXJzLCAvLyByYXcgRE9NIGVsZW1lbnRcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy50ZWxJbnB1dFswXSwgZGlnaXRzT25SaWdodCA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0dvb2RCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgLy8gY3Vyc29yIHN0cmF0ZWd5OiBtYWludGFpbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvbiB0aGUgcmlnaHQuIHdlIHVzZSB0aGUgcmlnaHQgaW5zdGVhZCBvZiB0aGUgbGVmdCBzbyB0aGF0IEEpIHdlIGRvbnQgaGF2ZSB0byBhY2NvdW50IGZvciB0aGUgbmV3IGRpZ2l0IChvciBtdWx0aXBsZSBkaWdpdHMgaWYgcGFzdGUgZXZlbnQpLCBhbmQgQikgd2UncmUgYWx3YXlzIG9uIHRoZSByaWdodCBzaWRlIG9mIGZvcm1hdHRpbmcgc3VmZml4ZXNcbiAgICAgICAgICAgICAgICBkaWdpdHNPblJpZ2h0ID0gdGhpcy5fZ2V0RGlnaXRzT25SaWdodCh2YWwsIGlucHV0LnNlbGVjdGlvbkVuZCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgaGFuZGxpbmcgYSBuZXcgbnVtYmVyIGNoYXJhY3RlcjogaW5zZXJ0IGl0IGluIHRoZSByaWdodCBwbGFjZVxuICAgICAgICAgICAgICAgIGlmIChuZXdOdW1lcmljQ2hhcikge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXBsYWNlIGFueSBzZWxlY3Rpb24gdGhleSBtYXkgaGF2ZSBtYWRlIHdpdGggdGhlIG5ldyBjaGFyXG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IHZhbC5zdWJzdHIoMCwgaW5wdXQuc2VsZWN0aW9uU3RhcnQpICsgbmV3TnVtZXJpY0NoYXIgKyB2YWwuc3Vic3RyaW5nKGlucHV0LnNlbGVjdGlvbkVuZCwgdmFsLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGVyZSB3ZSdyZSBub3QgaGFuZGxpbmcgYSBuZXcgY2hhciwgd2UncmUganVzdCBkb2luZyBhIHJlLWZvcm1hdCAoZS5nLiBvbiBkZWxldGUvYmFja3NwYWNlL3Bhc3RlLCBhZnRlciB0aGUgZmFjdCksIGJ1dCB3ZSBzdGlsbCBuZWVkIHRvIG1haW50YWluIHRoZSBjdXJzb3IgcG9zaXRpb24uIHNvIG1ha2Ugbm90ZSBvZiB0aGUgY2hhciBvbiB0aGUgbGVmdCwgYW5kIHRoZW4gYWZ0ZXIgdGhlIHJlLWZvcm1hdCwgd2UnbGwgY291bnQgaW4gdGhlIHNhbWUgbnVtYmVyIG9mIGRpZ2l0cyBmcm9tIHRoZSByaWdodCwgYW5kIHRoZW4ga2VlcCBnb2luZyB0aHJvdWdoIGFueSBmb3JtYXR0aW5nIGNoYXJzIHVudGlsIHdlIGhpdCB0aGUgc2FtZSBsZWZ0IGNoYXIgdGhhdCB3ZSBoYWQgYmVmb3JlLlxuICAgICAgICAgICAgICAgICAgICAvLyBVUERBVEU6IG5vdyBoYXZlIHRvIHN0b3JlIDIgY2hhcnMgYXMgZXh0ZW5zaW9ucyBmb3JtYXR0aW5nIGNvbnRhaW5zIDIgc3BhY2VzIHNvIHlvdSBuZWVkIHRvIGJlIGFibGUgdG8gZGlzdGluZ3Vpc2hcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxMZWZ0Q2hhcnMgPSB2YWwuc3Vic3RyKGlucHV0LnNlbGVjdGlvblN0YXJ0IC0gMiwgMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdOdW1lcmljQ2hhcikge1xuICAgICAgICAgICAgICAgIHZhbCArPSBuZXdOdW1lcmljQ2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgbnVtYmVyIGFuZCBmbGFnXG4gICAgICAgICAgICB0aGlzLnNldE51bWJlcih2YWwsIG51bGwsIGFkZFN1ZmZpeCwgdHJ1ZSwgaXNBbGxvd2VkS2V5KTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY3Vyc29yIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAodGhpcy5pc0dvb2RCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0N1cnNvcjtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLnRlbElucHV0LnZhbCgpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGl0IHdhcyBhdCB0aGUgZW5kLCBrZWVwIGl0IHRoZXJlXG4gICAgICAgICAgICAgICAgaWYgKCFkaWdpdHNPblJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0N1cnNvciA9IHZhbC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBjb3VudCBpbiB0aGUgc2FtZSBudW1iZXIgb2YgZGlnaXRzIGZyb20gdGhlIHJpZ2h0XG4gICAgICAgICAgICAgICAgICAgIG5ld0N1cnNvciA9IHRoaXMuX2dldEN1cnNvckZyb21EaWdpdHNPblJpZ2h0KHZhbCwgZGlnaXRzT25SaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBpZiBkZWxldGUvcGFzdGUgZXRjLCBrZWVwIGdvaW5nIGxlZnQgdW50aWwgaGl0IHRoZSBzYW1lIGxlZnQgY2hhciBhcyBiZWZvcmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdOdW1lcmljQ2hhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q3Vyc29yID0gdGhpcy5fZ2V0Q3Vyc29yRnJvbUxlZnRDaGFyKHZhbCwgbmV3Q3Vyc29yLCBvcmlnaW5hbExlZnRDaGFycyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSBuZXcgY3Vyc29yXG4gICAgICAgICAgICAgICAgaW5wdXQuc2V0U2VsZWN0aW9uUmFuZ2UobmV3Q3Vyc29yLCBuZXdDdXJzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyB3ZSBzdGFydCBmcm9tIHRoZSBwb3NpdGlvbiBpbiBndWVzc0N1cnNvciwgYW5kIHdvcmsgb3VyIHdheSBsZWZ0IHVudGlsIHdlIGhpdCB0aGUgb3JpZ2luYWxMZWZ0Q2hhcnMgb3IgYSBudW1iZXIgdG8gbWFrZSBzdXJlIHRoYXQgYWZ0ZXIgcmVmb3JtYXR0aW5nIHRoZSBjdXJzb3IgaGFzIHRoZSBzYW1lIGNoYXIgb24gdGhlIGxlZnQgaW4gdGhlIGNhc2Ugb2YgYSBkZWxldGUgZXRjXG4gICAgICAgIF9nZXRDdXJzb3JGcm9tTGVmdENoYXI6IGZ1bmN0aW9uKHZhbCwgZ3Vlc3NDdXJzb3IsIG9yaWdpbmFsTGVmdENoYXJzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gZ3Vlc3NDdXJzb3I7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdENoYXIgPSB2YWwuY2hhckF0KGkgLSAxKTtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc051bWVyaWMobGVmdENoYXIpIHx8IHZhbC5zdWJzdHIoaSAtIDIsIDIpID09IG9yaWdpbmFsTGVmdENoYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9LFxuICAgICAgICAvLyBhZnRlciBhIHJlZm9ybWF0IHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZXJlIGFyZSBzdGlsbCB0aGUgc2FtZSBudW1iZXIgb2YgZGlnaXRzIHRvIHRoZSByaWdodCBvZiB0aGUgY3Vyc29yXG4gICAgICAgIF9nZXRDdXJzb3JGcm9tRGlnaXRzT25SaWdodDogZnVuY3Rpb24odmFsLCBkaWdpdHNPblJpZ2h0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gdmFsLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNOdW1lcmljKHZhbC5jaGFyQXQoaSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgtLWRpZ2l0c09uUmlnaHQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdldCB0aGUgbnVtYmVyIG9mIG51bWVyaWMgZGlnaXRzIHRvIHRoZSByaWdodCBvZiB0aGUgY3Vyc29yIHNvIHdlIGNhbiByZXBvc2l0aW9uIHRoZSBjdXJzb3IgY29ycmVjdGx5IGFmdGVyIHRoZSByZWZvcm1hdCBoYXMgaGFwcGVuZWRcbiAgICAgICAgX2dldERpZ2l0c09uUmlnaHQ6IGZ1bmN0aW9uKHZhbCwgc2VsZWN0aW9uRW5kKSB7XG4gICAgICAgICAgICB2YXIgZGlnaXRzT25SaWdodCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc2VsZWN0aW9uRW5kOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNOdW1lcmljKHZhbC5jaGFyQXQoaSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpZ2l0c09uUmlnaHQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGlnaXRzT25SaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gbGlzdGVuIGZvciBmb2N1cyBhbmQgYmx1clxuICAgICAgICBfaW5pdEZvY3VzTGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0hpZGVEaWFsQ29kZSkge1xuICAgICAgICAgICAgICAgIC8vIG1vdXNlZG93biBkZWNpZGVzIHdoZXJlIHRoZSBjdXJzb3IgZ29lcywgc28gaWYgd2UncmUgZm9jdXNpbmcgd2UgbXVzdCBwcmV2ZW50RGVmYXVsdCBhcyB3ZSdsbCBiZSBpbnNlcnRpbmcgdGhlIGRpYWwgY29kZSwgYW5kIHdlIHdhbnQgdGhlIGN1cnNvciB0byBiZSBhdCB0aGUgZW5kIG5vIG1hdHRlciB3aGVyZSB0aGV5IGNsaWNrXG4gICAgICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcIm1vdXNlZG93blwiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQudGVsSW5wdXQuaXMoXCI6Zm9jdXNcIikgJiYgIXRoYXQudGVsSW5wdXQudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCB0aGlzIGFsc28gY2FuY2VscyB0aGUgZm9jdXMsIHNvIHdlIG11c3QgdHJpZ2dlciB0aGF0IG1hbnVhbGx5XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQub24oXCJmb2N1c1wiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoYXQudGVsSW5wdXQudmFsKCk7XG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0aGlzIHRvIGNvbXBhcmUgb24gYmx1clxuICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQuZGF0YShcImZvY3VzVmFsXCIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAvLyBvbiBmb2N1czogaWYgZW1wdHksIGluc2VydCB0aGUgZGlhbCBjb2RlIGZvciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGZsYWdcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUgJiYgIXZhbHVlICYmICF0aGF0LnRlbElucHV0LnByb3AoXCJyZWFkb25seVwiKSAmJiB0aGF0LnNlbGVjdGVkQ291bnRyeURhdGEuZGlhbENvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fdXBkYXRlVmFsKFwiK1wiICsgdGhhdC5zZWxlY3RlZENvdW50cnlEYXRhLmRpYWxDb2RlLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgYXV0by1pbnNlcnRpbmcgYSBkaWFsIGNvZGUsIGlmIHRoZSBmaXJzdCBrZXkgdGhleSBoaXQgaXMgJysnIHRoZW4gYXNzdW1lIHRoZXkgYXJlIGVudGVyaW5nIGEgbmV3IG51bWJlciwgc28gcmVtb3ZlIHRoZSBkaWFsIGNvZGUuIHVzZSBrZXlwcmVzcyBpbnN0ZWFkIG9mIGtleWRvd24gYmVjYXVzZSBrZXlkb3duIGdldHMgdHJpZ2dlcmVkIGZvciB0aGUgc2hpZnQga2V5IChyZXF1aXJlZCB0byBoaXQgdGhlICsga2V5KSwgYW5kIGluc3RlYWQgb2Yga2V5dXAgYmVjYXVzZSB0aGF0IHNob3dzIHRoZSBuZXcgJysnIGJlZm9yZSByZW1vdmluZyB0aGUgb2xkIG9uZVxuICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0Lm9uZShcImtleXByZXNzLnBsdXNcIiArIHRoYXQubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleXMuUExVUykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQgaXMgZW5hYmxlZCwgdGhpcyBrZXkgZXZlbnQgd2lsbCBoYXZlIGFscmVhZHkgaGF2ZSBiZWVuIGhhbmRsZWQgYnkgYW5vdGhlciBrZXlwcmVzcyBsaXN0ZW5lciAoaGVuY2Ugd2UgbmVlZCB0byBhZGQgdGhlIFwiK1wiKS4gaWYgZGlzYWJsZWQsIGl0IHdpbGwgYmUgaGFuZGxlZCBhZnRlciB0aGlzIGJ5IGEga2V5dXAgbGlzdGVuZXIgKGhlbmNlIG5vIG5lZWQgdG8gYWRkIHRoZSBcIitcIikuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHRoYXQub3B0aW9ucy5hdXRvRm9ybWF0ICYmIHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscyA/IFwiK1wiIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LnZhbChuZXdWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgdGFiYmluZyBpbiwgbWFrZSBzdXJlIHRoZSBjdXJzb3IgaXMgYXQgdGhlIGVuZCB3ZSBtdXN0IHVzZSBzZXRUaW1lb3V0IHRvIGdldCBvdXRzaWRlIG9mIHRoZSBmb2N1cyBoYW5kbGVyIGFzIGl0IHNlZW1zIHRoZSBzZWxlY3Rpb24gaGFwcGVucyBhZnRlciB0aGF0XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGF0LnRlbElucHV0WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuaXNHb29kQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSB0aGF0LnRlbElucHV0LnZhbCgpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5zZXRTZWxlY3Rpb25SYW5nZShsZW4sIGxlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vbihcImJsdXJcIiArIHRoaXMubnMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuYXV0b0hpZGVEaWFsQ29kZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbiBibHVyOiBpZiBqdXN0IGEgZGlhbCBjb2RlIHRoZW4gcmVtb3ZlIGl0XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoYXQudGVsSW5wdXQudmFsKCksIHN0YXJ0c1BsdXMgPSB2YWx1ZS5jaGFyQXQoMCkgPT0gXCIrXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydHNQbHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtZXJpYyA9IHRoYXQuX2dldE51bWVyaWModmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYganVzdCBhIHBsdXMsIG9yIGlmIGp1c3QgYSBkaWFsIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbnVtZXJpYyB8fCB0aGF0LnNlbGVjdGVkQ291bnRyeURhdGEuZGlhbENvZGUgPT0gbnVtZXJpYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudGVsSW5wdXQudmFsKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUga2V5cHJlc3MgbGlzdGVuZXIgd2UgYWRkZWQgb24gZm9jdXNcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50ZWxJbnB1dC5vZmYoXCJrZXlwcmVzcy5wbHVzXCIgKyB0aGF0Lm5zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgYXV0b0Zvcm1hdCwgd2UgbXVzdCBtYW51YWxseSB0cmlnZ2VyIGNoYW5nZSBldmVudCBpZiB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB3aW5kb3cuaW50bFRlbElucHV0VXRpbHMgJiYgdGhhdC50ZWxJbnB1dC52YWwoKSAhPSB0aGF0LnRlbElucHV0LmRhdGEoXCJmb2N1c1ZhbFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnRlbElucHV0LnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGV4dHJhY3QgdGhlIG51bWVyaWMgZGlnaXRzIGZyb20gdGhlIGdpdmVuIHN0cmluZ1xuICAgICAgICBfZ2V0TnVtZXJpYzogZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvXFxEL2csIFwiXCIpO1xuICAgICAgICB9LFxuICAgICAgICBfZ2V0Q2xlYW46IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBzLmNoYXJBdCgwKSA9PSBcIitcIiA/IFwiK1wiIDogXCJcIjtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyB0aGlzLl9nZXROdW1lcmljKHMpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBzaG93IHRoZSBkcm9wZG93blxuICAgICAgICBfc2hvd0Ryb3Bkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldERyb3Bkb3duUG9zaXRpb24oKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBoaWdobGlnaHRpbmcgYW5kIHNjcm9sbCB0byBhY3RpdmUgbGlzdCBpdGVtXG4gICAgICAgICAgICB2YXIgYWN0aXZlTGlzdEl0ZW0gPSB0aGlzLmNvdW50cnlMaXN0LmNoaWxkcmVuKFwiLmFjdGl2ZVwiKTtcbiAgICAgICAgICAgIGlmIChhY3RpdmVMaXN0SXRlbS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oaWdobGlnaHRMaXN0SXRlbShhY3RpdmVMaXN0SXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzaG93IGl0XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0LnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIGlmIChhY3RpdmVMaXN0SXRlbS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxUbyhhY3RpdmVMaXN0SXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBiaW5kIGFsbCB0aGUgZHJvcGRvd24tcmVsYXRlZCBsaXN0ZW5lcnM6IG1vdXNlb3ZlciwgY2xpY2ssIGNsaWNrLW9mZiwga2V5ZG93blxuICAgICAgICAgICAgdGhpcy5fYmluZERyb3Bkb3duTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGFycm93XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmxhZ0lubmVyLmNoaWxkcmVuKFwiLmFycm93XCIpLmFkZENsYXNzKFwidXBcIik7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRlY2lkZSB3aGVyZSB0byBwb3NpdGlvbiBkcm9wZG93biAoZGVwZW5kcyBvbiBwb3NpdGlvbiB3aXRoaW4gdmlld3BvcnQsIGFuZCBzY3JvbGwpXG4gICAgICAgIF9zZXREcm9wZG93blBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dFRvcCA9IHRoaXMudGVsSW5wdXQub2Zmc2V0KCkudG9wLCB3aW5kb3dUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksIC8vIGRyb3Bkb3duRml0c0JlbG93ID0gKGRyb3Bkb3duQm90dG9tIDwgd2luZG93Qm90dG9tKVxuICAgICAgICAgICAgZHJvcGRvd25GaXRzQmVsb3cgPSBpbnB1dFRvcCArIHRoaXMudGVsSW5wdXQub3V0ZXJIZWlnaHQoKSArIHRoaXMuZHJvcGRvd25IZWlnaHQgPCB3aW5kb3dUb3AgKyAkKHdpbmRvdykuaGVpZ2h0KCksIGRyb3Bkb3duRml0c0Fib3ZlID0gaW5wdXRUb3AgLSB0aGlzLmRyb3Bkb3duSGVpZ2h0ID4gd2luZG93VG9wO1xuICAgICAgICAgICAgLy8gZHJvcGRvd25IZWlnaHQgLSAxIGZvciBib3JkZXJcbiAgICAgICAgICAgIHZhciBjc3NUb3AgPSAhZHJvcGRvd25GaXRzQmVsb3cgJiYgZHJvcGRvd25GaXRzQWJvdmUgPyBcIi1cIiArICh0aGlzLmRyb3Bkb3duSGVpZ2h0IC0gMSkgKyBcInB4XCIgOiBcIlwiO1xuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5jc3MoXCJ0b3BcIiwgY3NzVG9wKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gd2Ugb25seSBiaW5kIGRyb3Bkb3duIGxpc3RlbmVycyB3aGVuIHRoZSBkcm9wZG93biBpcyBvcGVuXG4gICAgICAgIF9iaW5kRHJvcGRvd25MaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgLy8gd2hlbiBtb3VzZSBvdmVyIGEgbGlzdCBpdGVtLCBqdXN0IGhpZ2hsaWdodCB0aGF0IG9uZVxuICAgICAgICAgICAgLy8gd2UgYWRkIHRoZSBjbGFzcyBcImhpZ2hsaWdodFwiLCBzbyBpZiB0aGV5IGhpdCBcImVudGVyXCIgd2Uga25vdyB3aGljaCBvbmUgdG8gc2VsZWN0XG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0Lm9uKFwibW91c2VvdmVyXCIgKyB0aGlzLm5zLCBcIi5jb3VudHJ5XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB0aGF0Ll9oaWdobGlnaHRMaXN0SXRlbSgkKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gbGlzdGVuIGZvciBjb3VudHJ5IHNlbGVjdGlvblxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC5vbihcImNsaWNrXCIgKyB0aGlzLm5zLCBcIi5jb3VudHJ5XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB0aGF0Ll9zZWxlY3RMaXN0SXRlbSgkKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gY2xpY2sgb2ZmIHRvIGNsb3NlXG4gICAgICAgICAgICAvLyAoZXhjZXB0IHdoZW4gdGhpcyBpbml0aWFsIG9wZW5pbmcgY2xpY2sgaXMgYnViYmxpbmcgdXApXG4gICAgICAgICAgICAvLyB3ZSBjYW5ub3QganVzdCBzdG9wUHJvcGFnYXRpb24gYXMgaXQgbWF5IGJlIG5lZWRlZCB0byBjbG9zZSBhbm90aGVyIGluc3RhbmNlXG4gICAgICAgICAgICB2YXIgaXNPcGVuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICQoXCJodG1sXCIpLm9uKFwiY2xpY2tcIiArIHRoaXMubnMsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzT3BlbmluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzT3BlbmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBsaXN0ZW4gZm9yIHVwL2Rvd24gc2Nyb2xsaW5nLCBlbnRlciB0byBzZWxlY3QsIG9yIGxldHRlcnMgdG8ganVtcCB0byBjb3VudHJ5IG5hbWUuXG4gICAgICAgICAgICAvLyB1c2Uga2V5ZG93biBhcyBrZXlwcmVzcyBkb2Vzbid0IGZpcmUgZm9yIG5vbi1jaGFyIGtleXMgYW5kIHdlIHdhbnQgdG8gY2F0Y2ggaWYgdGhleVxuICAgICAgICAgICAgLy8ganVzdCBoaXQgZG93biBhbmQgaG9sZCBpdCB0byBzY3JvbGwgZG93biAobm8ga2V5dXAgZXZlbnQpLlxuICAgICAgICAgICAgLy8gbGlzdGVuIG9uIHRoZSBkb2N1bWVudCBiZWNhdXNlIHRoYXQncyB3aGVyZSBrZXkgZXZlbnRzIGFyZSB0cmlnZ2VyZWQgaWYgbm8gaW5wdXQgaGFzIGZvY3VzXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBcIlwiLCBxdWVyeVRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiICsgdGhpcy5ucywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgZG93biBrZXkgZnJvbSBzY3JvbGxpbmcgdGhlIHdob2xlIHBhZ2UsXG4gICAgICAgICAgICAgICAgLy8gYW5kIGVudGVyIGtleSBmcm9tIHN1Ym1pdHRpbmcgYSBmb3JtIGV0Y1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlzLlVQIHx8IGUud2hpY2ggPT0ga2V5cy5ET1dOKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwIGFuZCBkb3duIHRvIG5hdmlnYXRlXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2hhbmRsZVVwRG93bktleShlLndoaWNoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT0ga2V5cy5FTlRFUikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbnRlciB0byBzZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5faGFuZGxlRW50ZXJLZXkoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT0ga2V5cy5FU0MpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNjIHRvIGNsb3NlXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2Nsb3NlRHJvcGRvd24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPj0ga2V5cy5BICYmIGUud2hpY2ggPD0ga2V5cy5aIHx8IGUud2hpY2ggPT0ga2V5cy5TUEFDRSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlciBjYXNlIGxldHRlcnMgKG5vdGU6IGtleXVwL2tleWRvd24gb25seSByZXR1cm4gdXBwZXIgY2FzZSBsZXR0ZXJzKVxuICAgICAgICAgICAgICAgICAgICAvLyBqdW1wIHRvIGNvdW50cmllcyB0aGF0IHN0YXJ0IHdpdGggdGhlIHF1ZXJ5IHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAocXVlcnlUaW1lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHF1ZXJ5VGltZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3NlYXJjaEZvckNvdW50cnkocXVlcnkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgdGltZXIgaGl0cyAxIHNlY29uZCwgcmVzZXQgdGhlIHF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9LCAxZTMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyBoaWdobGlnaHQgdGhlIG5leHQvcHJldiBpdGVtIGluIHRoZSBsaXN0IChhbmQgZW5zdXJlIGl0IGlzIHZpc2libGUpXG4gICAgICAgIF9oYW5kbGVVcERvd25LZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmNvdW50cnlMaXN0LmNoaWxkcmVuKFwiLmhpZ2hsaWdodFwiKS5maXJzdCgpO1xuICAgICAgICAgICAgdmFyIG5leHQgPSBrZXkgPT0ga2V5cy5VUCA/IGN1cnJlbnQucHJldigpIDogY3VycmVudC5uZXh0KCk7XG4gICAgICAgICAgICBpZiAobmV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBza2lwIHRoZSBkaXZpZGVyXG4gICAgICAgICAgICAgICAgaWYgKG5leHQuaGFzQ2xhc3MoXCJkaXZpZGVyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBrZXkgPT0ga2V5cy5VUCA/IG5leHQucHJldigpIDogbmV4dC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hsaWdodExpc3RJdGVtKG5leHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvKG5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBzZWxlY3QgdGhlIGN1cnJlbnRseSBoaWdobGlnaHRlZCBpdGVtXG4gICAgICAgIF9oYW5kbGVFbnRlcktleTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudENvdW50cnkgPSB0aGlzLmNvdW50cnlMaXN0LmNoaWxkcmVuKFwiLmhpZ2hsaWdodFwiKS5maXJzdCgpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb3VudHJ5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdExpc3RJdGVtKGN1cnJlbnRDb3VudHJ5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gZmluZCB0aGUgZmlyc3QgbGlzdCBpdGVtIHdob3NlIG5hbWUgc3RhcnRzIHdpdGggdGhlIHF1ZXJ5IHN0cmluZ1xuICAgICAgICBfc2VhcmNoRm9yQ291bnRyeTogZnVuY3Rpb24ocXVlcnkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb3VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3RhcnRzV2l0aCh0aGlzLmNvdW50cmllc1tpXS5uYW1lLCBxdWVyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RJdGVtID0gdGhpcy5jb3VudHJ5TGlzdC5jaGlsZHJlbihcIltkYXRhLWNvdW50cnktY29kZT1cIiArIHRoaXMuY291bnRyaWVzW2ldLmlzbzIgKyBcIl1cIikubm90KFwiLnByZWZlcnJlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGhpZ2hsaWdodGluZyBhbmQgc2Nyb2xsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hsaWdodExpc3RJdGVtKGxpc3RJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG8obGlzdEl0ZW0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNoZWNrIGlmICh1cHBlcmNhc2UpIHN0cmluZyBhIHN0YXJ0cyB3aXRoIHN0cmluZyBiXG4gICAgICAgIF9zdGFydHNXaXRoOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5zdWJzdHIoMCwgYi5sZW5ndGgpLnRvVXBwZXJDYXNlKCkgPT0gYjtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBpbnB1dCdzIHZhbHVlIHRvIHRoZSBnaXZlbiB2YWxcbiAgICAgICAgLy8gaWYgYXV0b0Zvcm1hdD10cnVlLCBmb3JtYXQgaXQgZmlyc3QgYWNjb3JkaW5nIHRvIHRoZSBjb3VudHJ5LXNwZWNpZmljIGZvcm1hdHRpbmcgcnVsZXNcbiAgICAgICAgLy8gTm90ZTogcHJldmVudENvbnZlcnNpb24gd2lsbCBiZSBmYWxzZSAoaS5lLiB3ZSBhbGxvdyBjb252ZXJzaW9uKSBvbiBpbml0IGFuZCB3aGVuIGRldiBjYWxscyBwdWJsaWMgbWV0aG9kIHNldE51bWJlclxuICAgICAgICBfdXBkYXRlVmFsOiBmdW5jdGlvbih2YWwsIGZvcm1hdCwgYWRkU3VmZml4LCBwcmV2ZW50Q29udmVyc2lvbiwgaXNBbGxvd2VkS2V5KSB7XG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvRm9ybWF0ICYmIHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscyAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZvcm1hdCA9PSBcIm51bWJlclwiICYmIGludGxUZWxJbnB1dFV0aWxzLmlzVmFsaWROdW1iZXIodmFsLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdXNlciBzcGVjaWZpZWQgYSBmb3JtYXQsIGFuZCBpdCdzIGEgdmFsaWQgbnVtYmVyLCB0aGVuIGZvcm1hdCBpdCBhY2NvcmRpbmdseVxuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgPSBpbnRsVGVsSW5wdXRVdGlscy5mb3JtYXROdW1iZXJCeVR5cGUodmFsLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgZm9ybWF0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFwcmV2ZW50Q29udmVyc2lvbiAmJiB0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlICYmIHZhbC5jaGFyQXQoMCkgPT0gXCIrXCIgJiYgaW50bFRlbElucHV0VXRpbHMuaXNWYWxpZE51bWJlcih2YWwsIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBuYXRpb25hbE1vZGUgYW5kIHdlIGhhdmUgYSB2YWxpZCBpbnRsIG51bWJlciwgY29udmVydCBpdCB0byBudGxcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkID0gaW50bFRlbElucHV0VXRpbHMuZm9ybWF0TnVtYmVyQnlUeXBlKHZhbCwgdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIGludGxUZWxJbnB1dFV0aWxzLm51bWJlckZvcm1hdC5OQVRJT05BTCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBkbyB0aGUgcmVndWxhciBBc1lvdVR5cGUgZm9ybWF0dGluZ1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgPSBpbnRsVGVsSW5wdXRVdGlscy5mb3JtYXROdW1iZXIodmFsLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMiwgYWRkU3VmZml4LCB0aGlzLm9wdGlvbnMuYWxsb3dFeHRlbnNpb25zLCBpc0FsbG93ZWRLZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBlbnN1cmUgd2UgZG9udCBnbyBvdmVyIG1heGxlbmd0aC4gd2UgbXVzdCBkbyB0aGlzIGhlcmUgdG8gdHJ1bmNhdGUgYW55IGZvcm1hdHRpbmcgc3VmZml4LCBhbmQgYWxzbyBoYW5kbGUgcGFzdGUgZXZlbnRzXG4gICAgICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMudGVsSW5wdXQuYXR0cihcIm1heGxlbmd0aFwiKTtcbiAgICAgICAgICAgICAgICBpZiAobWF4ICYmIGZvcm1hdHRlZC5sZW5ndGggPiBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkID0gZm9ybWF0dGVkLnN1YnN0cigwLCBtYXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbm8gYXV0b0Zvcm1hdCwgc28ganVzdCBpbnNlcnQgdGhlIG9yaWdpbmFsIHZhbHVlXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVkID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC52YWwoZm9ybWF0dGVkKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2hlY2sgaWYgbmVlZCB0byBzZWxlY3QgYSBuZXcgZmxhZyBiYXNlZCBvbiB0aGUgZ2l2ZW4gbnVtYmVyXG4gICAgICAgIF91cGRhdGVGbGFnRnJvbU51bWJlcjogZnVuY3Rpb24obnVtYmVyLCB1cGRhdGVEZWZhdWx0KSB7XG4gICAgICAgICAgICAvLyBpZiB3ZSdyZSBpbiBuYXRpb25hbE1vZGUgYW5kIHdlJ3JlIG9uIFVTL0NhbmFkYSwgbWFrZSBzdXJlIHRoZSBudW1iZXIgc3RhcnRzIHdpdGggYSArMSBzbyBfZ2V0RGlhbENvZGUgd2lsbCBiZSBhYmxlIHRvIGV4dHJhY3QgdGhlIGFyZWEgY29kZVxuICAgICAgICAgICAgLy8gdXBkYXRlOiBpZiB3ZSBkb250IHlldCBoYXZlIHNlbGVjdGVkQ291bnRyeURhdGEsIGJ1dCB3ZSdyZSBoZXJlICh0cnlpbmcgdG8gdXBkYXRlIHRoZSBmbGFnIGZyb20gdGhlIG51bWJlciksIHRoYXQgbWVhbnMgd2UncmUgaW5pdGlhbGlzaW5nIHRoZSBwbHVnaW4gd2l0aCBhIG51bWJlciB0aGF0IGFscmVhZHkgaGFzIGEgZGlhbCBjb2RlLCBzbyBmaW5lIHRvIGlnbm9yZSB0aGlzIGJpdFxuICAgICAgICAgICAgaWYgKG51bWJlciAmJiB0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlICYmIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YSAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuZGlhbENvZGUgPT0gXCIxXCIgJiYgbnVtYmVyLmNoYXJBdCgwKSAhPSBcIitcIikge1xuICAgICAgICAgICAgICAgIGlmIChudW1iZXIuY2hhckF0KDApICE9IFwiMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlciA9IFwiMVwiICsgbnVtYmVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBudW1iZXIgPSBcIitcIiArIG51bWJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRyeSBhbmQgZXh0cmFjdCB2YWxpZCBkaWFsIGNvZGUgZnJvbSBpbnB1dFxuICAgICAgICAgICAgdmFyIGRpYWxDb2RlID0gdGhpcy5fZ2V0RGlhbENvZGUobnVtYmVyKSwgY291bnRyeUNvZGUgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGRpYWxDb2RlKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgb25lIG9mIHRoZSBtYXRjaGluZyBjb3VudHJpZXMgaXMgYWxyZWFkeSBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIHZhciBjb3VudHJ5Q29kZXMgPSB0aGlzLmNvdW50cnlDb2Rlc1t0aGlzLl9nZXROdW1lcmljKGRpYWxDb2RlKV0sIGFscmVhZHlTZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YSAmJiAkLmluQXJyYXkodGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIsIGNvdW50cnlDb2RlcykgIT0gLTE7XG4gICAgICAgICAgICAgICAgLy8gaWYgYSBtYXRjaGluZyBjb3VudHJ5IGlzIG5vdCBhbHJlYWR5IHNlbGVjdGVkIChvciB0aGlzIGlzIGFuIHVua25vd24gTkFOUCBhcmVhIGNvZGUpOiBjaG9vc2UgdGhlIGZpcnN0IGluIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgaWYgKCFhbHJlYWR5U2VsZWN0ZWQgfHwgdGhpcy5faXNVbmtub3duTmFucChudW1iZXIsIGRpYWxDb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB1c2luZyBvbmx5Q291bnRyaWVzIG9wdGlvbiwgY291bnRyeUNvZGVzWzBdIG1heSBiZSBlbXB0eSwgc28gd2UgbXVzdCBmaW5kIHRoZSBmaXJzdCBub24tZW1wdHkgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb3VudHJ5Q29kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3VudHJ5Q29kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZSA9IGNvdW50cnlDb2Rlc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyLmNoYXJBdCgwKSA9PSBcIitcIiAmJiB0aGlzLl9nZXROdW1lcmljKG51bWJlcikubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gaW52YWxpZCBkaWFsIGNvZGUsIHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgLy8gTm90ZTogdXNlIGdldE51bWVyaWMgaGVyZSBiZWNhdXNlIHRoZSBudW1iZXIgaGFzIG5vdCBiZWVuIGZvcm1hdHRlZCB5ZXQsIHNvIGNvdWxkIGNvbnRhaW4gYmFkIHNoaXRcbiAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZSA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFudW1iZXIgfHwgbnVtYmVyID09IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gZW1wdHksIG9yIGp1c3QgYSBwbHVzLCBzbyBkZWZhdWx0XG4gICAgICAgICAgICAgICAgY291bnRyeUNvZGUgPSB0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkuaXNvMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudHJ5Q29kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEZsYWcoY291bnRyeUNvZGUsIHVwZGF0ZURlZmF1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBjaGVjayBpZiB0aGUgZ2l2ZW4gbnVtYmVyIGNvbnRhaW5zIGFuIHVua25vd24gYXJlYSBjb2RlIGZyb20gdGhlIE5vcnRoIEFtZXJpY2FuIE51bWJlcmluZyBQbGFuIGkuZS4gdGhlIG9ubHkgZGlhbENvZGUgdGhhdCBjb3VsZCBiZSBleHRyYWN0ZWQgd2FzICsxIGJ1dCB0aGUgYWN0dWFsIG51bWJlcidzIGxlbmd0aCBpcyA+PTRcbiAgICAgICAgX2lzVW5rbm93bk5hbnA6IGZ1bmN0aW9uKG51bWJlciwgZGlhbENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkaWFsQ29kZSA9PSBcIisxXCIgJiYgdGhpcy5fZ2V0TnVtZXJpYyhudW1iZXIpLmxlbmd0aCA+PSA0O1xuICAgICAgICB9LFxuICAgICAgICAvLyByZW1vdmUgaGlnaGxpZ2h0aW5nIGZyb20gb3RoZXIgbGlzdCBpdGVtcyBhbmQgaGlnaGxpZ2h0IHRoZSBnaXZlbiBpdGVtXG4gICAgICAgIF9oaWdobGlnaHRMaXN0SXRlbTogZnVuY3Rpb24obGlzdEl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3RJdGVtcy5yZW1vdmVDbGFzcyhcImhpZ2hsaWdodFwiKTtcbiAgICAgICAgICAgIGxpc3RJdGVtLmFkZENsYXNzKFwiaGlnaGxpZ2h0XCIpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBmaW5kIHRoZSBjb3VudHJ5IGRhdGEgZm9yIHRoZSBnaXZlbiBjb3VudHJ5IGNvZGVcbiAgICAgICAgLy8gdGhlIGlnbm9yZU9ubHlDb3VudHJpZXNPcHRpb24gaXMgb25seSB1c2VkIGR1cmluZyBpbml0KCkgd2hpbGUgcGFyc2luZyB0aGUgb25seUNvdW50cmllcyBhcnJheVxuICAgICAgICBfZ2V0Q291bnRyeURhdGE6IGZ1bmN0aW9uKGNvdW50cnlDb2RlLCBpZ25vcmVPbmx5Q291bnRyaWVzT3B0aW9uLCBhbGxvd0ZhaWwpIHtcbiAgICAgICAgICAgIHZhciBjb3VudHJ5TGlzdCA9IGlnbm9yZU9ubHlDb3VudHJpZXNPcHRpb24gPyBhbGxDb3VudHJpZXMgOiB0aGlzLmNvdW50cmllcztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRyeUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoY291bnRyeUxpc3RbaV0uaXNvMiA9PSBjb3VudHJ5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY291bnRyeUxpc3RbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFsbG93RmFpbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBjb3VudHJ5IGRhdGEgZm9yICdcIiArIGNvdW50cnlDb2RlICsgXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBzZWxlY3QgdGhlIGdpdmVuIGZsYWcsIHVwZGF0ZSB0aGUgcGxhY2Vob2xkZXIgYW5kIHRoZSBhY3RpdmUgbGlzdCBpdGVtXG4gICAgICAgIF9zZWxlY3RGbGFnOiBmdW5jdGlvbihjb3VudHJ5Q29kZSwgdXBkYXRlRGVmYXVsdCkge1xuICAgICAgICAgICAgLy8gZG8gdGhpcyBmaXJzdCBhcyBpdCB3aWxsIHRocm93IGFuIGVycm9yIGFuZCBzdG9wIGlmIGNvdW50cnlDb2RlIGlzIGludmFsaWRcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YSA9IGNvdW50cnlDb2RlID8gdGhpcy5fZ2V0Q291bnRyeURhdGEoY291bnRyeUNvZGUsIGZhbHNlLCBmYWxzZSkgOiB7fTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgXCJkZWZhdWx0Q291bnRyeVwiIC0gd2Ugb25seSBuZWVkIHRoZSBpc28yIGZyb20gbm93IG9uLCBzbyBqdXN0IHN0b3JlIHRoYXRcbiAgICAgICAgICAgIGlmICh1cGRhdGVEZWZhdWx0ICYmIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yKSB7XG4gICAgICAgICAgICAgICAgLy8gY2FuJ3QganVzdCBtYWtlIHRoaXMgZXF1YWwgdG8gc2VsZWN0ZWRDb3VudHJ5RGF0YSBhcyB3b3VsZCBiZSBhIHJlZiB0byB0aGF0IG9iamVjdFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZWZhdWx0Q291bnRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgaXNvMjogdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5hdHRyKFwiY2xhc3NcIiwgXCJpdGktZmxhZyBcIiArIGNvdW50cnlDb2RlKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgY291bnRyeSdzIHRpdGxlIGF0dHJpYnV0ZVxuICAgICAgICAgICAgdmFyIHRpdGxlID0gY291bnRyeUNvZGUgPyB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEubmFtZSArIFwiOiArXCIgKyB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuZGlhbENvZGUgOiBcIlVua25vd25cIjtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGbGFnSW5uZXIucGFyZW50KCkuYXR0cihcInRpdGxlXCIsIHRpdGxlKTtcbiAgICAgICAgICAgIC8vIGFuZCB0aGUgaW5wdXQncyBwbGFjZWhvbGRlclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXIoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudHJ5TGlzdC52YWwoY291bnRyeUNvZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGFjdGl2ZSBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0SXRlbXMucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50cnlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3RJdGVtcy5maW5kKFwiLml0aS1mbGFnLlwiICsgY291bnRyeUNvZGUpLmZpcnN0KCkuY2xvc2VzdChcIi5jb3VudHJ5XCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBpbnB1dCBwbGFjZWhvbGRlciB0byBhbiBleGFtcGxlIG51bWJlciBmcm9tIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY291bnRyeVxuICAgICAgICBfdXBkYXRlUGxhY2Vob2xkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscyAmJiAhdGhpcy5oYWRJbml0aWFsUGxhY2Vob2xkZXIgJiYgdGhpcy5vcHRpb25zLmF1dG9QbGFjZWhvbGRlciAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNvMiA9IHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCBudW1iZXJUeXBlID0gaW50bFRlbElucHV0VXRpbHMubnVtYmVyVHlwZVt0aGlzLm9wdGlvbnMubnVtYmVyVHlwZSB8fCBcIkZJWEVEX0xJTkVcIl0sIHBsYWNlaG9sZGVyID0gaXNvMiA/IGludGxUZWxJbnB1dFV0aWxzLmdldEV4YW1wbGVOdW1iZXIoaXNvMiwgdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSwgbnVtYmVyVHlwZSkgOiBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXQuYXR0cihcInBsYWNlaG9sZGVyXCIsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGxpc3QgaXRlbSBmcm9tIHRoZSBkcm9wZG93blxuICAgICAgICBfc2VsZWN0TGlzdEl0ZW06IGZ1bmN0aW9uKGxpc3RJdGVtKSB7XG4gICAgICAgICAgICB2YXIgY291bnRyeUNvZGVBdHRyID0gdGhpcy5pc01vYmlsZSA/IFwidmFsdWVcIiA6IFwiZGF0YS1jb3VudHJ5LWNvZGVcIjtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBzZWxlY3RlZCBmbGFnIGFuZCBhY3RpdmUgbGlzdCBpdGVtXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RGbGFnKGxpc3RJdGVtLmF0dHIoY291bnRyeUNvZGVBdHRyKSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVEaWFsQ29kZShsaXN0SXRlbS5hdHRyKFwiZGF0YS1kaWFsLWNvZGVcIiksIHRydWUpO1xuICAgICAgICAgICAgLy8gYWx3YXlzIGZpcmUgdGhlIGNoYW5nZSBldmVudCBhcyBldmVuIGlmIG5hdGlvbmFsTW9kZT10cnVlIChhbmQgd2UgaGF2ZW4ndCB1cGRhdGVkIHRoZSBpbnB1dCB2YWwpLCB0aGUgc3lzdGVtIGFzIGEgd2hvbGUgaGFzIHN0aWxsIGNoYW5nZWQgLSBzZWUgY291bnRyeS1zeW5jIGV4YW1wbGUuIHRoaW5rIG9mIGl0IGFzIG1ha2luZyBhIHNlbGVjdGlvbiBmcm9tIGEgc2VsZWN0IGVsZW1lbnQuXG4gICAgICAgICAgICB0aGlzLnRlbElucHV0LnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgICAgICAgICAvLyBmb2N1cyB0aGUgaW5wdXRcbiAgICAgICAgICAgIHRoaXMudGVsSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgIC8vIGZpeCBmb3IgRkYgYW5kIElFMTEgKHdpdGggbmF0aW9uYWxNb2RlPWZhbHNlIGkuZS4gYXV0byBpbnNlcnRpbmcgZGlhbCBjb2RlKSwgd2hvIHRyeSB0byBwdXQgdGhlIGN1cnNvciBhdCB0aGUgYmVnaW5uaW5nIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAgICBpZiAodGhpcy5pc0dvb2RCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IHRoaXMudGVsSW5wdXQudmFsKCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXRbMF0uc2V0U2VsZWN0aW9uUmFuZ2UobGVuLCBsZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBjbG9zZSB0aGUgZHJvcGRvd24gYW5kIHVuYmluZCBhbnkgbGlzdGVuZXJzXG4gICAgICAgIF9jbG9zZURyb3Bkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3QuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBhcnJvd1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5jaGlsZHJlbihcIi5hcnJvd1wiKS5yZW1vdmVDbGFzcyhcInVwXCIpO1xuICAgICAgICAgICAgLy8gdW5iaW5kIGtleSBldmVudHNcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9mZih0aGlzLm5zKTtcbiAgICAgICAgICAgIC8vIHVuYmluZCBjbGljay1vZmYtdG8tY2xvc2VcbiAgICAgICAgICAgICQoXCJodG1sXCIpLm9mZih0aGlzLm5zKTtcbiAgICAgICAgICAgIC8vIHVuYmluZCBob3ZlciBhbmQgY2xpY2sgbGlzdGVuZXJzXG4gICAgICAgICAgICB0aGlzLmNvdW50cnlMaXN0Lm9mZih0aGlzLm5zKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gY2hlY2sgaWYgYW4gZWxlbWVudCBpcyB2aXNpYmxlIHdpdGhpbiBpdCdzIGNvbnRhaW5lciwgZWxzZSBzY3JvbGwgdW50aWwgaXQgaXNcbiAgICAgICAgX3Njcm9sbFRvOiBmdW5jdGlvbihlbGVtZW50LCBtaWRkbGUpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvdW50cnlMaXN0LCBjb250YWluZXJIZWlnaHQgPSBjb250YWluZXIuaGVpZ2h0KCksIGNvbnRhaW5lclRvcCA9IGNvbnRhaW5lci5vZmZzZXQoKS50b3AsIGNvbnRhaW5lckJvdHRvbSA9IGNvbnRhaW5lclRvcCArIGNvbnRhaW5lckhlaWdodCwgZWxlbWVudEhlaWdodCA9IGVsZW1lbnQub3V0ZXJIZWlnaHQoKSwgZWxlbWVudFRvcCA9IGVsZW1lbnQub2Zmc2V0KCkudG9wLCBlbGVtZW50Qm90dG9tID0gZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHQsIG5ld1Njcm9sbFRvcCA9IGVsZW1lbnRUb3AgLSBjb250YWluZXJUb3AgKyBjb250YWluZXIuc2Nyb2xsVG9wKCksIG1pZGRsZU9mZnNldCA9IGNvbnRhaW5lckhlaWdodCAvIDIgLSBlbGVtZW50SGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIGlmIChlbGVtZW50VG9wIDwgY29udGFpbmVyVG9wKSB7XG4gICAgICAgICAgICAgICAgLy8gc2Nyb2xsIHVwXG4gICAgICAgICAgICAgICAgaWYgKG1pZGRsZSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdTY3JvbGxUb3AgLT0gbWlkZGxlT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wKG5ld1Njcm9sbFRvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRCb3R0b20gPiBjb250YWluZXJCb3R0b20pIHtcbiAgICAgICAgICAgICAgICAvLyBzY3JvbGwgZG93blxuICAgICAgICAgICAgICAgIGlmIChtaWRkbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U2Nyb2xsVG9wICs9IG1pZGRsZU9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodERpZmZlcmVuY2UgPSBjb250YWluZXJIZWlnaHQgLSBlbGVtZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AobmV3U2Nyb2xsVG9wIC0gaGVpZ2h0RGlmZmVyZW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHJlcGxhY2UgYW55IGV4aXN0aW5nIGRpYWwgY29kZSB3aXRoIHRoZSBuZXcgb25lIChpZiBub3QgaW4gbmF0aW9uYWxNb2RlKVxuICAgICAgICAvLyBhbHNvIHdlIG5lZWQgdG8ga25vdyBpZiB3ZSdyZSBmb2N1c2luZyBmb3IgYSBjb3VwbGUgb2YgcmVhc29ucyBlLmcuIGlmIHNvLCB3ZSB3YW50IHRvIGFkZCBhbnkgZm9ybWF0dGluZyBzdWZmaXgsIGFsc28gaWYgdGhlIGlucHV0IGlzIGVtcHR5IGFuZCB3ZSdyZSBub3QgaW4gbmF0aW9uYWxNb2RlLCB0aGVuIHdlIHdhbnQgdG8gaW5zZXJ0IHRoZSBkaWFsIGNvZGVcbiAgICAgICAgX3VwZGF0ZURpYWxDb2RlOiBmdW5jdGlvbihuZXdEaWFsQ29kZSwgZm9jdXNpbmcpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dFZhbCA9IHRoaXMudGVsSW5wdXQudmFsKCksIG5ld051bWJlcjtcbiAgICAgICAgICAgIC8vIHNhdmUgaGF2aW5nIHRvIHBhc3MgdGhpcyBldmVyeSB0aW1lXG4gICAgICAgICAgICBuZXdEaWFsQ29kZSA9IFwiK1wiICsgbmV3RGlhbENvZGU7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSAmJiBpbnB1dFZhbC5jaGFyQXQoMCkgIT0gXCIrXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBuYXRpb25hbE1vZGUsIHdlIGp1c3Qgd2FudCB0byByZS1mb3JtYXRcbiAgICAgICAgICAgICAgICBuZXdOdW1iZXIgPSBpbnB1dFZhbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRWYWwpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcHJldmlvdXMgbnVtYmVyIGNvbnRhaW5lZCBhIHZhbGlkIGRpYWwgY29kZSwgcmVwbGFjZSBpdFxuICAgICAgICAgICAgICAgIC8vIChpZiBtb3JlIHRoYW4ganVzdCBhIHBsdXMgY2hhcmFjdGVyKVxuICAgICAgICAgICAgICAgIHZhciBwcmV2RGlhbENvZGUgPSB0aGlzLl9nZXREaWFsQ29kZShpbnB1dFZhbCk7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZEaWFsQ29kZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld051bWJlciA9IGlucHV0VmFsLnJlcGxhY2UocHJldkRpYWxDb2RlLCBuZXdEaWFsQ29kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZXZpb3VzIG51bWJlciBkaWRuJ3QgY29udGFpbiBhIGRpYWwgY29kZSwgd2Ugc2hvdWxkIHBlcnNpc3QgaXRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4aXN0aW5nTnVtYmVyID0gaW5wdXRWYWwuY2hhckF0KDApICE9IFwiK1wiID8gJC50cmltKGlucHV0VmFsKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIG5ld051bWJlciA9IG5ld0RpYWxDb2RlICsgZXhpc3RpbmdOdW1iZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdOdW1iZXIgPSAhdGhpcy5vcHRpb25zLmF1dG9IaWRlRGlhbENvZGUgfHwgZm9jdXNpbmcgPyBuZXdEaWFsQ29kZSA6IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVWYWwobmV3TnVtYmVyLCBudWxsLCBmb2N1c2luZyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHRyeSBhbmQgZXh0cmFjdCBhIHZhbGlkIGludGVybmF0aW9uYWwgZGlhbCBjb2RlIGZyb20gYSBmdWxsIHRlbGVwaG9uZSBudW1iZXJcbiAgICAgICAgLy8gTm90ZTogcmV0dXJucyB0aGUgcmF3IHN0cmluZyBpbmMgcGx1cyBjaGFyYWN0ZXIgYW5kIGFueSB3aGl0ZXNwYWNlL2RvdHMgZXRjXG4gICAgICAgIF9nZXREaWFsQ29kZTogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgZGlhbENvZGUgPSBcIlwiO1xuICAgICAgICAgICAgLy8gb25seSBpbnRlcmVzdGVkIGluIGludGVybmF0aW9uYWwgbnVtYmVycyAoc3RhcnRpbmcgd2l0aCBhIHBsdXMpXG4gICAgICAgICAgICBpZiAobnVtYmVyLmNoYXJBdCgwKSA9PSBcIitcIikge1xuICAgICAgICAgICAgICAgIHZhciBudW1lcmljQ2hhcnMgPSBcIlwiO1xuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBjaGFyc1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gbnVtYmVyLmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgY2hhciBpcyBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaXNOdW1lcmljKGMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1lcmljQ2hhcnMgKz0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGN1cnJlbnQgbnVtZXJpY0NoYXJzIG1ha2UgYSB2YWxpZCBkaWFsIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvdW50cnlDb2Rlc1tudW1lcmljQ2hhcnNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGFjdHVhbCByYXcgc3RyaW5nICh1c2VmdWwgZm9yIG1hdGNoaW5nIGxhdGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxDb2RlID0gbnVtYmVyLnN1YnN0cigwLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb25nZXN0IGRpYWwgY29kZSBpcyA0IGNoYXJzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtZXJpY0NoYXJzLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGlhbENvZGU7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKlxuICAgKiAgUFVCTElDIE1FVEhPRFNcbiAgICoqKioqKioqKioqKioqKioqKioqL1xuICAgICAgICAvLyB0aGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBpcGluZm8gY2FsbCByZXR1cm5zXG4gICAgICAgIGF1dG9Db3VudHJ5TG9hZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPT0gXCJhdXRvXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGVmYXVsdENvdW50cnkgPSAkLmZuW3BsdWdpbk5hbWVdLmF1dG9Db3VudHJ5O1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEluaXRpYWxTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b0NvdW50cnlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIHJlbW92ZSBwbHVnaW5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGRyb3Bkb3duIGlzIGNsb3NlZCAoYW5kIHVuYmluZCBsaXN0ZW5lcnMpXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VEcm9wZG93bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8ga2V5IGV2ZW50cywgYW5kIGZvY3VzL2JsdXIgZXZlbnRzIGlmIGF1dG9IaWRlRGlhbENvZGU9dHJ1ZVxuICAgICAgICAgICAgdGhpcy50ZWxJbnB1dC5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZSBldmVudCBvbiBzZWxlY3QgY291bnRyeVxuICAgICAgICAgICAgICAgIHRoaXMuY291bnRyeUxpc3Qub2ZmKHRoaXMubnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjbGljayBldmVudCB0byBvcGVuIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5wYXJlbnQoKS5vZmYodGhpcy5ucyk7XG4gICAgICAgICAgICAgICAgLy8gbGFiZWwgY2xpY2sgaGFja1xuICAgICAgICAgICAgICAgIHRoaXMudGVsSW5wdXQuY2xvc2VzdChcImxhYmVsXCIpLm9mZih0aGlzLm5zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlbW92ZSBtYXJrdXBcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLnRlbElucHV0LnBhcmVudCgpO1xuICAgICAgICAgICAgY29udGFpbmVyLmJlZm9yZSh0aGlzLnRlbElucHV0KS5yZW1vdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZXh0cmFjdCB0aGUgcGhvbmUgbnVtYmVyIGV4dGVuc2lvbiBpZiBwcmVzZW50XG4gICAgICAgIGdldEV4dGVuc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZWxJbnB1dC52YWwoKS5zcGxpdChcIiBleHQuIFwiKVsxXSB8fCBcIlwiO1xuICAgICAgICB9LFxuICAgICAgICAvLyBmb3JtYXQgdGhlIG51bWJlciB0byB0aGUgZ2l2ZW4gdHlwZVxuICAgICAgICBnZXROdW1iZXI6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW50bFRlbElucHV0VXRpbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50bFRlbElucHV0VXRpbHMuZm9ybWF0TnVtYmVyQnlUeXBlKHRoaXMudGVsSW5wdXQudmFsKCksIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yLCB0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9LFxuICAgICAgICAvLyBnZXQgdGhlIHR5cGUgb2YgdGhlIGVudGVyZWQgbnVtYmVyIGUuZy4gbGFuZGxpbmUvbW9iaWxlXG4gICAgICAgIGdldE51bWJlclR5cGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnRsVGVsSW5wdXRVdGlscy5nZXROdW1iZXJUeXBlKHRoaXMudGVsSW5wdXQudmFsKCksIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YS5pc28yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtOTk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGdldCB0aGUgY291bnRyeSBkYXRhIGZvciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGZsYWdcbiAgICAgICAgZ2V0U2VsZWN0ZWRDb3VudHJ5RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIHVuZGVmaW5lZCwgdGhlIHBsdWdpbiB3aWxsIHJldHVybiBpdCdzIGluc3RhbmNlIGluc3RlYWQsIHNvIGluIHRoYXQgY2FzZSBhbiBlbXB0eSBvYmplY3QgbWFrZXMgbW9yZSBzZW5zZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRDb3VudHJ5RGF0YSB8fCB7fTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0IHRoZSB2YWxpZGF0aW9uIGVycm9yXG4gICAgICAgIGdldFZhbGlkYXRpb25FcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmludGxUZWxJbnB1dFV0aWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGxUZWxJbnB1dFV0aWxzLmdldFZhbGlkYXRpb25FcnJvcih0aGlzLnRlbElucHV0LnZhbCgpLCB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuaXNvMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTk5O1xuICAgICAgICB9LFxuICAgICAgICAvLyB2YWxpZGF0ZSB0aGUgaW5wdXQgdmFsIC0gYXNzdW1lcyB0aGUgZ2xvYmFsIGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIgKGZyb20gdXRpbHNTY3JpcHQpXG4gICAgICAgIGlzVmFsaWROdW1iZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHZhbCA9ICQudHJpbSh0aGlzLnRlbElucHV0LnZhbCgpKSwgY291bnRyeUNvZGUgPSB0aGlzLm9wdGlvbnMubmF0aW9uYWxNb2RlID8gdGhpcy5zZWxlY3RlZENvdW50cnlEYXRhLmlzbzIgOiBcIlwiO1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbnRsVGVsSW5wdXRVdGlscykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnRsVGVsSW5wdXRVdGlscy5pc1ZhbGlkTnVtYmVyKHZhbCwgY291bnRyeUNvZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICAvLyBsb2FkIHRoZSB1dGlscyBzY3JpcHRcbiAgICAgICAgbG9hZFV0aWxzOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdXRpbHNTY3JpcHQgPSBwYXRoIHx8IHRoaXMub3B0aW9ucy51dGlsc1NjcmlwdDtcbiAgICAgICAgICAgIGlmICghJC5mbltwbHVnaW5OYW1lXS5sb2FkZWRVdGlsc1NjcmlwdCAmJiB1dGlsc1NjcmlwdCkge1xuICAgICAgICAgICAgICAgIC8vIGRvbid0IGRvIHRoaXMgdHdpY2UhIChkb250IGp1c3QgY2hlY2sgaWYgdGhlIGdsb2JhbCBpbnRsVGVsSW5wdXRVdGlscyBleGlzdHMgYXMgaWYgaW5pdCBwbHVnaW4gbXVsdGlwbGUgdGltZXMgaW4gcXVpY2sgc3VjY2Vzc2lvbiwgaXQgbWF5IG5vdCBoYXZlIGZpbmlzaGVkIGxvYWRpbmcgeWV0KVxuICAgICAgICAgICAgICAgICQuZm5bcGx1Z2luTmFtZV0ubG9hZGVkVXRpbHNTY3JpcHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIGRvbnQgdXNlICQuZ2V0U2NyaXB0IGFzIGl0IHByZXZlbnRzIGNhY2hpbmdcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHV0aWxzU2NyaXB0LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlbGwgYWxsIGluc3RhbmNlcyB0aGUgdXRpbHMgYXJlIHJlYWR5XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmludGwtdGVsLWlucHV0IGlucHV0XCIpLmludGxUZWxJbnB1dChcInV0aWxzTG9hZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnV0aWxzU2NyaXB0RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dGlsc1NjcmlwdERlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzZWxlY3RlZCBmbGFnLCBhbmQgdXBkYXRlIHRoZSBpbnB1dCB2YWwgYWNjb3JkaW5nbHlcbiAgICAgICAgc2VsZWN0Q291bnRyeTogZnVuY3Rpb24oY291bnRyeUNvZGUpIHtcbiAgICAgICAgICAgIGNvdW50cnlDb2RlID0gY291bnRyeUNvZGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGFscmVhZHkgc2VsZWN0ZWRcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZEZsYWdJbm5lci5oYXNDbGFzcyhjb3VudHJ5Q29kZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RGbGFnKGNvdW50cnlDb2RlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEaWFsQ29kZSh0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEuZGlhbENvZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2V0IHRoZSBpbnB1dCB2YWx1ZSBhbmQgdXBkYXRlIHRoZSBmbGFnXG4gICAgICAgIHNldE51bWJlcjogZnVuY3Rpb24obnVtYmVyLCBmb3JtYXQsIGFkZFN1ZmZpeCwgcHJldmVudENvbnZlcnNpb24sIGlzQWxsb3dlZEtleSkge1xuICAgICAgICAgICAgLy8gZW5zdXJlIHN0YXJ0cyB3aXRoIHBsdXNcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLm5hdGlvbmFsTW9kZSAmJiBudW1iZXIuY2hhckF0KDApICE9IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyID0gXCIrXCIgKyBudW1iZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB3ZSBtdXN0IHVwZGF0ZSB0aGUgZmxhZyBmaXJzdCwgd2hpY2ggdXBkYXRlcyB0aGlzLnNlbGVjdGVkQ291bnRyeURhdGEsIHdoaWNoIGlzIHVzZWQgbGF0ZXIgZm9yIGZvcm1hdHRpbmcgdGhlIG51bWJlciBiZWZvcmUgZGlzcGxheWluZyBpdFxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRmxhZ0Zyb21OdW1iZXIobnVtYmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbChudW1iZXIsIGZvcm1hdCwgYWRkU3VmZml4LCBwcmV2ZW50Q29udmVyc2lvbiwgaXNBbGxvd2VkS2V5KTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgdXRpbHMgYXJlIHJlYWR5XG4gICAgICAgIHV0aWxzTG9hZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGlmIGF1dG9Gb3JtYXQgaXMgZW5hYmxlZCBhbmQgdGhlcmUncyBhbiBpbml0aWFsIHZhbHVlIGluIHRoZSBpbnB1dCwgdGhlbiBmb3JtYXQgaXRcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b0Zvcm1hdCAmJiB0aGlzLnRlbElucHV0LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsKHRoaXMudGVsSW5wdXQudmFsKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gYWRhcHRlZCB0byBhbGxvdyBwdWJsaWMgZnVuY3Rpb25zXG4gICAgLy8gdXNpbmcgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS1ib2lsZXJwbGF0ZS9qcXVlcnktYm9pbGVycGxhdGUvd2lraS9FeHRlbmRpbmctalF1ZXJ5LUJvaWxlcnBsYXRlXG4gICAgJC5mbltwbHVnaW5OYW1lXSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIC8vIElzIHRoZSBmaXJzdCBwYXJhbWV0ZXIgYW4gb2JqZWN0IChvcHRpb25zKSwgb3Igd2FzIG9taXR0ZWQsXG4gICAgICAgIC8vIGluc3RhbnRpYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBwbHVnaW4uXG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIG9wdGlvbnMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQuZGF0YSh0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBQbHVnaW4odGhpcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZURlZmVycmVkcyA9IGluc3RhbmNlLl9pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIG5vdyBoYXZlIDIgZGVmZmVyZWRzOiAxIGZvciBhdXRvIGNvdW50cnksIDEgZm9yIHV0aWxzIHNjcmlwdFxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZHMucHVzaChpbnN0YW5jZURlZmVycmVkc1swXSk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkcy5wdXNoKGluc3RhbmNlRGVmZXJyZWRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsIFwicGx1Z2luX1wiICsgcGx1Z2luTmFtZSwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBwcm9taXNlIGZyb20gdGhlIFwibWFzdGVyXCIgZGVmZXJyZWQgb2JqZWN0IHRoYXQgdHJhY2tzIGFsbCB0aGUgb3RoZXJzXG4gICAgICAgICAgICByZXR1cm4gJC53aGVuLmFwcGx5KG51bGwsIGRlZmVycmVkcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIgJiYgb3B0aW9uc1swXSAhPT0gXCJfXCIpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcgYW5kIGl0IGRvZXNuJ3Qgc3RhcnRcbiAgICAgICAgICAgIC8vIHdpdGggYW4gdW5kZXJzY29yZSBvciBcImNvbnRhaW5zXCIgdGhlIGBpbml0YC1mdW5jdGlvbixcbiAgICAgICAgICAgIC8vIHRyZWF0IHRoaXMgYXMgYSBjYWxsIHRvIGEgcHVibGljIG1ldGhvZC5cbiAgICAgICAgICAgIC8vIENhY2hlIHRoZSBtZXRob2QgY2FsbCB0byBtYWtlIGl0IHBvc3NpYmxlIHRvIHJldHVybiBhIHZhbHVlXG4gICAgICAgICAgICB2YXIgcmV0dXJucztcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkLmRhdGEodGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBUZXN0cyB0aGF0IHRoZXJlJ3MgYWxyZWFkeSBhIHBsdWdpbi1pbnN0YW5jZVxuICAgICAgICAgICAgICAgIC8vIGFuZCBjaGVja3MgdGhhdCB0aGUgcmVxdWVzdGVkIHB1YmxpYyBtZXRob2QgZXhpc3RzXG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUGx1Z2luICYmIHR5cGVvZiBpbnN0YW5jZVtvcHRpb25zXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIG1ldGhvZCBvZiBvdXIgcGx1Z2luIGluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgcGFzcyBpdCB0aGUgc3VwcGxpZWQgYXJndW1lbnRzLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm5zID0gaW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoaW5zdGFuY2UsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQWxsb3cgaW5zdGFuY2VzIHRvIGJlIGRlc3Ryb3llZCB2aWEgdGhlICdkZXN0cm95JyBtZXRob2RcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyA9PT0gXCJkZXN0cm95XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsIFwicGx1Z2luX1wiICsgcGx1Z2luTmFtZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZWFybGllciBjYWNoZWQgbWV0aG9kIGdpdmVzIGEgdmFsdWUgYmFjayByZXR1cm4gdGhlIHZhbHVlLFxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHJldHVybiB0aGlzIHRvIHByZXNlcnZlIGNoYWluYWJpbGl0eS5cbiAgICAgICAgICAgIHJldHVybiByZXR1cm5zICE9PSB1bmRlZmluZWQgPyByZXR1cm5zIDogdGhpcztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqKioqKioqKioqKioqKioqKioqXG4gKiAgU1RBVElDIE1FVEhPRFNcbiAqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvLyBnZXQgdGhlIGNvdW50cnkgZGF0YSBvYmplY3RcbiAgICAkLmZuW3BsdWdpbk5hbWVdLmdldENvdW50cnlEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhbGxDb3VudHJpZXM7XG4gICAgfTtcbiAgICAvLyBUZWxsIEpTSGludCB0byBpZ25vcmUgdGhpcyB3YXJuaW5nOiBcImNoYXJhY3RlciBtYXkgZ2V0IHNpbGVudGx5IGRlbGV0ZWQgYnkgb25lIG9yIG1vcmUgYnJvd3NlcnNcIlxuICAgIC8vIGpzaGludCAtVzEwMFxuICAgIC8vIEFycmF5IG9mIGNvdW50cnkgb2JqZWN0cyBmb3IgdGhlIGZsYWcgZHJvcGRvd24uXG4gICAgLy8gRWFjaCBjb250YWlucyBhIG5hbWUsIGNvdW50cnkgY29kZSAoSVNPIDMxNjYtMSBhbHBoYS0yKSBhbmQgZGlhbCBjb2RlLlxuICAgIC8vIE9yaWdpbmFsbHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWxlZG96ZS9jb3VudHJpZXNcbiAgICAvLyB0aGVuIG1vZGlmaWVkIHVzaW5nIHRoZSBmb2xsb3dpbmcgSmF2YVNjcmlwdCAoTk9XIE9VVCBPRiBEQVRFKTpcbiAgICAvKlxudmFyIHJlc3VsdCA9IFtdO1xuXy5lYWNoKGNvdW50cmllcywgZnVuY3Rpb24oYykge1xuICAvLyBpZ25vcmUgY291bnRyaWVzIHdpdGhvdXQgYSBkaWFsIGNvZGVcbiAgaWYgKGMuY2FsbGluZ0NvZGVbMF0ubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnB1c2goe1xuICAgICAgLy8gdmFyIGxvY2FscyBjb250YWlucyBjb3VudHJ5IG5hbWVzIHdpdGggbG9jYWxpc2VkIHZlcnNpb25zIGluIGJyYWNrZXRzXG4gICAgICBuOiBfLmZpbmRXaGVyZShsb2NhbHMsIHtcbiAgICAgICAgY291bnRyeUNvZGU6IGMuY2NhMlxuICAgICAgfSkubmFtZSxcbiAgICAgIGk6IGMuY2NhMi50b0xvd2VyQ2FzZSgpLFxuICAgICAgZDogYy5jYWxsaW5nQ29kZVswXVxuICAgIH0pO1xuICB9XG59KTtcbkpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4qL1xuICAgIC8vIHRoZW4gd2l0aCBhIGNvdXBsZSBvZiBtYW51YWwgcmUtYXJyYW5nZW1lbnRzIHRvIGJlIGFscGhhYmV0aWNhbFxuICAgIC8vIHRoZW4gY2hhbmdlZCBLYXpha2hzdGFuIGZyb20gKzc2IHRvICs3XG4gICAgLy8gYW5kIFZhdGljYW4gQ2l0eSBmcm9tICszNzkgdG8gKzM5IChzZWUgaXNzdWUgNTApXG4gICAgLy8gYW5kIENhcmliZWFuIE5ldGhlcmxhbmRzIGZyb20gKzU5OTcgdG8gKzU5OVxuICAgIC8vIGFuZCBDdXJhY2FvIGZyb20gKzU5OTkgdG8gKzU5OVxuICAgIC8vIFJlbW92ZWQ6IMOFbGFuZCBJc2xhbmRzLCBDaHJpc3RtYXMgSXNsYW5kLCBDb2NvcyBJc2xhbmRzLCBHdWVybnNleSwgSXNsZSBvZiBNYW4sIEplcnNleSwgS29zb3ZvLCBNYXlvdHRlLCBQaXRjYWlybiBJc2xhbmRzLCBTb3V0aCBHZW9yZ2lhLCBTdmFsYmFyZCwgV2VzdGVybiBTYWhhcmFcbiAgICAvLyBVcGRhdGU6IGNvbnZlcnRlZCBvYmplY3RzIHRvIGFycmF5cyB0byBzYXZlIGJ5dGVzIVxuICAgIC8vIFVwZGF0ZTogYWRkZWQgXCJwcmlvcml0eVwiIGZvciBjb3VudHJpZXMgd2l0aCB0aGUgc2FtZSBkaWFsQ29kZSBhcyBvdGhlcnNcbiAgICAvLyBVcGRhdGU6IGFkZGVkIGFycmF5IG9mIGFyZWEgY29kZXMgZm9yIGNvdW50cmllcyB3aXRoIHRoZSBzYW1lIGRpYWxDb2RlIGFzIG90aGVyc1xuICAgIC8vIFNvIGVhY2ggY291bnRyeSBhcnJheSBoYXMgdGhlIGZvbGxvd2luZyBpbmZvcm1hdGlvbjpcbiAgICAvLyBbXG4gICAgLy8gICAgQ291bnRyeSBuYW1lLFxuICAgIC8vICAgIGlzbzIgY29kZSxcbiAgICAvLyAgICBJbnRlcm5hdGlvbmFsIGRpYWwgY29kZSxcbiAgICAvLyAgICBPcmRlciAoaWYgPjEgY291bnRyeSB3aXRoIHNhbWUgZGlhbCBjb2RlKSxcbiAgICAvLyAgICBBcmVhIGNvZGVzIChpZiA+MSBjb3VudHJ5IHdpdGggc2FtZSBkaWFsIGNvZGUpXG4gICAgLy8gXVxuICAgIHZhciBhbGxDb3VudHJpZXMgPSBbIFsgXCJBZmdoYW5pc3RhbiAo4oCr2KfZgdi62KfZhtiz2KrYp9mG4oCs4oCOKVwiLCBcImFmXCIsIFwiOTNcIiBdLCBbIFwiQWxiYW5pYSAoU2hxaXDDq3JpKVwiLCBcImFsXCIsIFwiMzU1XCIgXSwgWyBcIkFsZ2VyaWEgKOKAq9in2YTYrNiy2KfYptix4oCs4oCOKVwiLCBcImR6XCIsIFwiMjEzXCIgXSwgWyBcIkFtZXJpY2FuIFNhbW9hXCIsIFwiYXNcIiwgXCIxNjg0XCIgXSwgWyBcIkFuZG9ycmFcIiwgXCJhZFwiLCBcIjM3NlwiIF0sIFsgXCJBbmdvbGFcIiwgXCJhb1wiLCBcIjI0NFwiIF0sIFsgXCJBbmd1aWxsYVwiLCBcImFpXCIsIFwiMTI2NFwiIF0sIFsgXCJBbnRpZ3VhIGFuZCBCYXJidWRhXCIsIFwiYWdcIiwgXCIxMjY4XCIgXSwgWyBcIkFyZ2VudGluYVwiLCBcImFyXCIsIFwiNTRcIiBdLCBbIFwiQXJtZW5pYSAo1YDVodW11aHVvdW/1aHVtilcIiwgXCJhbVwiLCBcIjM3NFwiIF0sIFsgXCJBcnViYVwiLCBcImF3XCIsIFwiMjk3XCIgXSwgWyBcIkF1c3RyYWxpYVwiLCBcImF1XCIsIFwiNjFcIiBdLCBbIFwiQXVzdHJpYSAow5ZzdGVycmVpY2gpXCIsIFwiYXRcIiwgXCI0M1wiIF0sIFsgXCJBemVyYmFpamFuIChBesmZcmJheWNhbilcIiwgXCJhelwiLCBcIjk5NFwiIF0sIFsgXCJCYWhhbWFzXCIsIFwiYnNcIiwgXCIxMjQyXCIgXSwgWyBcIkJhaHJhaW4gKOKAq9in2YTYqNit2LHZitmG4oCs4oCOKVwiLCBcImJoXCIsIFwiOTczXCIgXSwgWyBcIkJhbmdsYWRlc2ggKOCmrOCmvuCmguCmsuCmvuCmpuCnh+CmtilcIiwgXCJiZFwiLCBcIjg4MFwiIF0sIFsgXCJCYXJiYWRvc1wiLCBcImJiXCIsIFwiMTI0NlwiIF0sIFsgXCJCZWxhcnVzICjQkdC10LvQsNGA0YPRgdGMKVwiLCBcImJ5XCIsIFwiMzc1XCIgXSwgWyBcIkJlbGdpdW0gKEJlbGdpw6spXCIsIFwiYmVcIiwgXCIzMlwiIF0sIFsgXCJCZWxpemVcIiwgXCJielwiLCBcIjUwMVwiIF0sIFsgXCJCZW5pbiAoQsOpbmluKVwiLCBcImJqXCIsIFwiMjI5XCIgXSwgWyBcIkJlcm11ZGFcIiwgXCJibVwiLCBcIjE0NDFcIiBdLCBbIFwiQmh1dGFuICjgvaDgvZbgvrLgvbTgvYIpXCIsIFwiYnRcIiwgXCI5NzVcIiBdLCBbIFwiQm9saXZpYVwiLCBcImJvXCIsIFwiNTkxXCIgXSwgWyBcIkJvc25pYSBhbmQgSGVyemVnb3ZpbmEgKNCR0L7RgdC90LAg0Lgg0KXQtdGA0YbQtdCz0L7QstC40L3QsClcIiwgXCJiYVwiLCBcIjM4N1wiIF0sIFsgXCJCb3Rzd2FuYVwiLCBcImJ3XCIsIFwiMjY3XCIgXSwgWyBcIkJyYXppbCAoQnJhc2lsKVwiLCBcImJyXCIsIFwiNTVcIiBdLCBbIFwiQnJpdGlzaCBJbmRpYW4gT2NlYW4gVGVycml0b3J5XCIsIFwiaW9cIiwgXCIyNDZcIiBdLCBbIFwiQnJpdGlzaCBWaXJnaW4gSXNsYW5kc1wiLCBcInZnXCIsIFwiMTI4NFwiIF0sIFsgXCJCcnVuZWlcIiwgXCJiblwiLCBcIjY3M1wiIF0sIFsgXCJCdWxnYXJpYSAo0JHRitC70LPQsNGA0LjRjylcIiwgXCJiZ1wiLCBcIjM1OVwiIF0sIFsgXCJCdXJraW5hIEZhc29cIiwgXCJiZlwiLCBcIjIyNlwiIF0sIFsgXCJCdXJ1bmRpIChVYnVydW5kaSlcIiwgXCJiaVwiLCBcIjI1N1wiIF0sIFsgXCJDYW1ib2RpYSAo4Z6A4Z6Y4Z+S4Z6W4Z674Z6H4Z62KVwiLCBcImtoXCIsIFwiODU1XCIgXSwgWyBcIkNhbWVyb29uIChDYW1lcm91bilcIiwgXCJjbVwiLCBcIjIzN1wiIF0sIFsgXCJDYW5hZGFcIiwgXCJjYVwiLCBcIjFcIiwgMSwgWyBcIjIwNFwiLCBcIjIyNlwiLCBcIjIzNlwiLCBcIjI0OVwiLCBcIjI1MFwiLCBcIjI4OVwiLCBcIjMwNlwiLCBcIjM0M1wiLCBcIjM2NVwiLCBcIjM4N1wiLCBcIjQwM1wiLCBcIjQxNlwiLCBcIjQxOFwiLCBcIjQzMVwiLCBcIjQzN1wiLCBcIjQzOFwiLCBcIjQ1MFwiLCBcIjUwNlwiLCBcIjUxNFwiLCBcIjUxOVwiLCBcIjU0OFwiLCBcIjU3OVwiLCBcIjU4MVwiLCBcIjU4N1wiLCBcIjYwNFwiLCBcIjYxM1wiLCBcIjYzOVwiLCBcIjY0N1wiLCBcIjY3MlwiLCBcIjcwNVwiLCBcIjcwOVwiLCBcIjc0MlwiLCBcIjc3OFwiLCBcIjc4MFwiLCBcIjc4MlwiLCBcIjgwN1wiLCBcIjgxOVwiLCBcIjgyNVwiLCBcIjg2N1wiLCBcIjg3M1wiLCBcIjkwMlwiLCBcIjkwNVwiIF0gXSwgWyBcIkNhcGUgVmVyZGUgKEthYnUgVmVyZGkpXCIsIFwiY3ZcIiwgXCIyMzhcIiBdLCBbIFwiQ2FyaWJiZWFuIE5ldGhlcmxhbmRzXCIsIFwiYnFcIiwgXCI1OTlcIiwgMSBdLCBbIFwiQ2F5bWFuIElzbGFuZHNcIiwgXCJreVwiLCBcIjEzNDVcIiBdLCBbIFwiQ2VudHJhbCBBZnJpY2FuIFJlcHVibGljIChSw6lwdWJsaXF1ZSBjZW50cmFmcmljYWluZSlcIiwgXCJjZlwiLCBcIjIzNlwiIF0sIFsgXCJDaGFkIChUY2hhZClcIiwgXCJ0ZFwiLCBcIjIzNVwiIF0sIFsgXCJDaGlsZVwiLCBcImNsXCIsIFwiNTZcIiBdLCBbIFwiQ2hpbmEgKOS4reWbvSlcIiwgXCJjblwiLCBcIjg2XCIgXSwgWyBcIkNvbG9tYmlhXCIsIFwiY29cIiwgXCI1N1wiIF0sIFsgXCJDb21vcm9zICjigKvYrNiy2LEg2KfZhNmC2YXYseKArOKAjilcIiwgXCJrbVwiLCBcIjI2OVwiIF0sIFsgXCJDb25nbyAoRFJDKSAoSmFtaHVyaSB5YSBLaWRlbW9rcmFzaWEgeWEgS29uZ28pXCIsIFwiY2RcIiwgXCIyNDNcIiBdLCBbIFwiQ29uZ28gKFJlcHVibGljKSAoQ29uZ28tQnJhenphdmlsbGUpXCIsIFwiY2dcIiwgXCIyNDJcIiBdLCBbIFwiQ29vayBJc2xhbmRzXCIsIFwiY2tcIiwgXCI2ODJcIiBdLCBbIFwiQ29zdGEgUmljYVwiLCBcImNyXCIsIFwiNTA2XCIgXSwgWyBcIkPDtHRlIGTigJlJdm9pcmVcIiwgXCJjaVwiLCBcIjIyNVwiIF0sIFsgXCJDcm9hdGlhIChIcnZhdHNrYSlcIiwgXCJoclwiLCBcIjM4NVwiIF0sIFsgXCJDdWJhXCIsIFwiY3VcIiwgXCI1M1wiIF0sIFsgXCJDdXJhw6dhb1wiLCBcImN3XCIsIFwiNTk5XCIsIDAgXSwgWyBcIkN5cHJ1cyAozprPjc+Az4HOv8+CKVwiLCBcImN5XCIsIFwiMzU3XCIgXSwgWyBcIkN6ZWNoIFJlcHVibGljICjEjGVza8OhIHJlcHVibGlrYSlcIiwgXCJjelwiLCBcIjQyMFwiIF0sIFsgXCJEZW5tYXJrIChEYW5tYXJrKVwiLCBcImRrXCIsIFwiNDVcIiBdLCBbIFwiRGppYm91dGlcIiwgXCJkalwiLCBcIjI1M1wiIF0sIFsgXCJEb21pbmljYVwiLCBcImRtXCIsIFwiMTc2N1wiIF0sIFsgXCJEb21pbmljYW4gUmVwdWJsaWMgKFJlcMO6YmxpY2EgRG9taW5pY2FuYSlcIiwgXCJkb1wiLCBcIjFcIiwgMiwgWyBcIjgwOVwiLCBcIjgyOVwiLCBcIjg0OVwiIF0gXSwgWyBcIkVjdWFkb3JcIiwgXCJlY1wiLCBcIjU5M1wiIF0sIFsgXCJFZ3lwdCAo4oCr2YXYtdix4oCs4oCOKVwiLCBcImVnXCIsIFwiMjBcIiBdLCBbIFwiRWwgU2FsdmFkb3JcIiwgXCJzdlwiLCBcIjUwM1wiIF0sIFsgXCJFcXVhdG9yaWFsIEd1aW5lYSAoR3VpbmVhIEVjdWF0b3JpYWwpXCIsIFwiZ3FcIiwgXCIyNDBcIiBdLCBbIFwiRXJpdHJlYVwiLCBcImVyXCIsIFwiMjkxXCIgXSwgWyBcIkVzdG9uaWEgKEVlc3RpKVwiLCBcImVlXCIsIFwiMzcyXCIgXSwgWyBcIkV0aGlvcGlhXCIsIFwiZXRcIiwgXCIyNTFcIiBdLCBbIFwiRmFsa2xhbmQgSXNsYW5kcyAoSXNsYXMgTWFsdmluYXMpXCIsIFwiZmtcIiwgXCI1MDBcIiBdLCBbIFwiRmFyb2UgSXNsYW5kcyAoRsO4cm95YXIpXCIsIFwiZm9cIiwgXCIyOThcIiBdLCBbIFwiRmlqaVwiLCBcImZqXCIsIFwiNjc5XCIgXSwgWyBcIkZpbmxhbmQgKFN1b21pKVwiLCBcImZpXCIsIFwiMzU4XCIgXSwgWyBcIkZyYW5jZVwiLCBcImZyXCIsIFwiMzNcIiBdLCBbIFwiRnJlbmNoIEd1aWFuYSAoR3V5YW5lIGZyYW7Dp2Fpc2UpXCIsIFwiZ2ZcIiwgXCI1OTRcIiBdLCBbIFwiRnJlbmNoIFBvbHluZXNpYSAoUG9seW7DqXNpZSBmcmFuw6dhaXNlKVwiLCBcInBmXCIsIFwiNjg5XCIgXSwgWyBcIkdhYm9uXCIsIFwiZ2FcIiwgXCIyNDFcIiBdLCBbIFwiR2FtYmlhXCIsIFwiZ21cIiwgXCIyMjBcIiBdLCBbIFwiR2VvcmdpYSAo4YOh4YOQ4YOl4YOQ4YOg4YOX4YOV4YOU4YOa4YOdKVwiLCBcImdlXCIsIFwiOTk1XCIgXSwgWyBcIkdlcm1hbnkgKERldXRzY2hsYW5kKVwiLCBcImRlXCIsIFwiNDlcIiBdLCBbIFwiR2hhbmEgKEdhYW5hKVwiLCBcImdoXCIsIFwiMjMzXCIgXSwgWyBcIkdpYnJhbHRhclwiLCBcImdpXCIsIFwiMzUwXCIgXSwgWyBcIkdyZWVjZSAozpXOu867zqzOtM6xKVwiLCBcImdyXCIsIFwiMzBcIiBdLCBbIFwiR3JlZW5sYW5kIChLYWxhYWxsaXQgTnVuYWF0KVwiLCBcImdsXCIsIFwiMjk5XCIgXSwgWyBcIkdyZW5hZGFcIiwgXCJnZFwiLCBcIjE0NzNcIiBdLCBbIFwiR3VhZGVsb3VwZVwiLCBcImdwXCIsIFwiNTkwXCIsIDAgXSwgWyBcIkd1YW1cIiwgXCJndVwiLCBcIjE2NzFcIiBdLCBbIFwiR3VhdGVtYWxhXCIsIFwiZ3RcIiwgXCI1MDJcIiBdLCBbIFwiR3VpbmVhIChHdWluw6llKVwiLCBcImduXCIsIFwiMjI0XCIgXSwgWyBcIkd1aW5lYS1CaXNzYXUgKEd1aW7DqSBCaXNzYXUpXCIsIFwiZ3dcIiwgXCIyNDVcIiBdLCBbIFwiR3V5YW5hXCIsIFwiZ3lcIiwgXCI1OTJcIiBdLCBbIFwiSGFpdGlcIiwgXCJodFwiLCBcIjUwOVwiIF0sIFsgXCJIb25kdXJhc1wiLCBcImhuXCIsIFwiNTA0XCIgXSwgWyBcIkhvbmcgS29uZyAo6aaZ5rivKVwiLCBcImhrXCIsIFwiODUyXCIgXSwgWyBcIkh1bmdhcnkgKE1hZ3lhcm9yc3rDoWcpXCIsIFwiaHVcIiwgXCIzNlwiIF0sIFsgXCJJY2VsYW5kICjDjXNsYW5kKVwiLCBcImlzXCIsIFwiMzU0XCIgXSwgWyBcIkluZGlhICjgpK3gpL7gpLDgpKQpXCIsIFwiaW5cIiwgXCI5MVwiIF0sIFsgXCJJbmRvbmVzaWFcIiwgXCJpZFwiLCBcIjYyXCIgXSwgWyBcIklyYW4gKOKAq9in24zYsdin2YbigKzigI4pXCIsIFwiaXJcIiwgXCI5OFwiIF0sIFsgXCJJcmFxICjigKvYp9mE2LnYsdin2YLigKzigI4pXCIsIFwiaXFcIiwgXCI5NjRcIiBdLCBbIFwiSXJlbGFuZFwiLCBcImllXCIsIFwiMzUzXCIgXSwgWyBcIklzcmFlbCAo4oCr15nXqdeo15DXnOKArOKAjilcIiwgXCJpbFwiLCBcIjk3MlwiIF0sIFsgXCJJdGFseSAoSXRhbGlhKVwiLCBcIml0XCIsIFwiMzlcIiwgMCBdLCBbIFwiSmFtYWljYVwiLCBcImptXCIsIFwiMTg3NlwiIF0sIFsgXCJKYXBhbiAo5pel5pysKVwiLCBcImpwXCIsIFwiODFcIiBdLCBbIFwiSm9yZGFuICjigKvYp9mE2KPYsdiv2YbigKzigI4pXCIsIFwiam9cIiwgXCI5NjJcIiBdLCBbIFwiS2F6YWtoc3RhbiAo0JrQsNC30LDRhdGB0YLQsNC9KVwiLCBcImt6XCIsIFwiN1wiLCAxIF0sIFsgXCJLZW55YVwiLCBcImtlXCIsIFwiMjU0XCIgXSwgWyBcIktpcmliYXRpXCIsIFwia2lcIiwgXCI2ODZcIiBdLCBbIFwiS3V3YWl0ICjigKvYp9mE2YPZiNmK2KrigKzigI4pXCIsIFwia3dcIiwgXCI5NjVcIiBdLCBbIFwiS3lyZ3l6c3RhbiAo0JrRi9GA0LPRi9C30YHRgtCw0L0pXCIsIFwia2dcIiwgXCI5OTZcIiBdLCBbIFwiTGFvcyAo4Lql4Lqy4LqnKVwiLCBcImxhXCIsIFwiODU2XCIgXSwgWyBcIkxhdHZpYSAoTGF0dmlqYSlcIiwgXCJsdlwiLCBcIjM3MVwiIF0sIFsgXCJMZWJhbm9uICjigKvZhNio2YbYp9mG4oCs4oCOKVwiLCBcImxiXCIsIFwiOTYxXCIgXSwgWyBcIkxlc290aG9cIiwgXCJsc1wiLCBcIjI2NlwiIF0sIFsgXCJMaWJlcmlhXCIsIFwibHJcIiwgXCIyMzFcIiBdLCBbIFwiTGlieWEgKOKAq9mE2YrYqNmK2KfigKzigI4pXCIsIFwibHlcIiwgXCIyMThcIiBdLCBbIFwiTGllY2h0ZW5zdGVpblwiLCBcImxpXCIsIFwiNDIzXCIgXSwgWyBcIkxpdGh1YW5pYSAoTGlldHV2YSlcIiwgXCJsdFwiLCBcIjM3MFwiIF0sIFsgXCJMdXhlbWJvdXJnXCIsIFwibHVcIiwgXCIzNTJcIiBdLCBbIFwiTWFjYXUgKOa+s+mWgClcIiwgXCJtb1wiLCBcIjg1M1wiIF0sIFsgXCJNYWNlZG9uaWEgKEZZUk9NKSAo0JzQsNC60LXQtNC+0L3QuNGY0LApXCIsIFwibWtcIiwgXCIzODlcIiBdLCBbIFwiTWFkYWdhc2NhciAoTWFkYWdhc2lrYXJhKVwiLCBcIm1nXCIsIFwiMjYxXCIgXSwgWyBcIk1hbGF3aVwiLCBcIm13XCIsIFwiMjY1XCIgXSwgWyBcIk1hbGF5c2lhXCIsIFwibXlcIiwgXCI2MFwiIF0sIFsgXCJNYWxkaXZlc1wiLCBcIm12XCIsIFwiOTYwXCIgXSwgWyBcIk1hbGlcIiwgXCJtbFwiLCBcIjIyM1wiIF0sIFsgXCJNYWx0YVwiLCBcIm10XCIsIFwiMzU2XCIgXSwgWyBcIk1hcnNoYWxsIElzbGFuZHNcIiwgXCJtaFwiLCBcIjY5MlwiIF0sIFsgXCJNYXJ0aW5pcXVlXCIsIFwibXFcIiwgXCI1OTZcIiBdLCBbIFwiTWF1cml0YW5pYSAo4oCr2YXZiNix2YrYqtin2YbZitin4oCs4oCOKVwiLCBcIm1yXCIsIFwiMjIyXCIgXSwgWyBcIk1hdXJpdGl1cyAoTW9yaXMpXCIsIFwibXVcIiwgXCIyMzBcIiBdLCBbIFwiTWV4aWNvIChNw6l4aWNvKVwiLCBcIm14XCIsIFwiNTJcIiBdLCBbIFwiTWljcm9uZXNpYVwiLCBcImZtXCIsIFwiNjkxXCIgXSwgWyBcIk1vbGRvdmEgKFJlcHVibGljYSBNb2xkb3ZhKVwiLCBcIm1kXCIsIFwiMzczXCIgXSwgWyBcIk1vbmFjb1wiLCBcIm1jXCIsIFwiMzc3XCIgXSwgWyBcIk1vbmdvbGlhICjQnNC+0L3Qs9C+0LspXCIsIFwibW5cIiwgXCI5NzZcIiBdLCBbIFwiTW9udGVuZWdybyAoQ3JuYSBHb3JhKVwiLCBcIm1lXCIsIFwiMzgyXCIgXSwgWyBcIk1vbnRzZXJyYXRcIiwgXCJtc1wiLCBcIjE2NjRcIiBdLCBbIFwiTW9yb2NjbyAo4oCr2KfZhNmF2LrYsdio4oCs4oCOKVwiLCBcIm1hXCIsIFwiMjEyXCIgXSwgWyBcIk1vemFtYmlxdWUgKE1vw6dhbWJpcXVlKVwiLCBcIm16XCIsIFwiMjU4XCIgXSwgWyBcIk15YW5tYXIgKEJ1cm1hKSAo4YCZ4YC84YCU4YC64YCZ4YCsKVwiLCBcIm1tXCIsIFwiOTVcIiBdLCBbIFwiTmFtaWJpYSAoTmFtaWJpw6spXCIsIFwibmFcIiwgXCIyNjRcIiBdLCBbIFwiTmF1cnVcIiwgXCJuclwiLCBcIjY3NFwiIF0sIFsgXCJOZXBhbCAo4KSo4KWH4KSq4KS+4KSyKVwiLCBcIm5wXCIsIFwiOTc3XCIgXSwgWyBcIk5ldGhlcmxhbmRzIChOZWRlcmxhbmQpXCIsIFwibmxcIiwgXCIzMVwiIF0sIFsgXCJOZXcgQ2FsZWRvbmlhIChOb3V2ZWxsZS1DYWzDqWRvbmllKVwiLCBcIm5jXCIsIFwiNjg3XCIgXSwgWyBcIk5ldyBaZWFsYW5kXCIsIFwibnpcIiwgXCI2NFwiIF0sIFsgXCJOaWNhcmFndWFcIiwgXCJuaVwiLCBcIjUwNVwiIF0sIFsgXCJOaWdlciAoTmlqYXIpXCIsIFwibmVcIiwgXCIyMjdcIiBdLCBbIFwiTmlnZXJpYVwiLCBcIm5nXCIsIFwiMjM0XCIgXSwgWyBcIk5pdWVcIiwgXCJudVwiLCBcIjY4M1wiIF0sIFsgXCJOb3Jmb2xrIElzbGFuZFwiLCBcIm5mXCIsIFwiNjcyXCIgXSwgWyBcIk5vcnRoIEtvcmVhICjsobDshKAg66+87KO87KO87J2YIOyduOuvvCDqs7XtmZTqta0pXCIsIFwia3BcIiwgXCI4NTBcIiBdLCBbIFwiTm9ydGhlcm4gTWFyaWFuYSBJc2xhbmRzXCIsIFwibXBcIiwgXCIxNjcwXCIgXSwgWyBcIk5vcndheSAoTm9yZ2UpXCIsIFwibm9cIiwgXCI0N1wiIF0sIFsgXCJPbWFuICjigKvYudmP2YXYp9mG4oCs4oCOKVwiLCBcIm9tXCIsIFwiOTY4XCIgXSwgWyBcIlBha2lzdGFuICjigKvZvtin2qnYs9iq2KfZhuKArOKAjilcIiwgXCJwa1wiLCBcIjkyXCIgXSwgWyBcIlBhbGF1XCIsIFwicHdcIiwgXCI2ODBcIiBdLCBbIFwiUGFsZXN0aW5lICjigKvZgdmE2LPYt9mK2YbigKzigI4pXCIsIFwicHNcIiwgXCI5NzBcIiBdLCBbIFwiUGFuYW1hIChQYW5hbcOhKVwiLCBcInBhXCIsIFwiNTA3XCIgXSwgWyBcIlBhcHVhIE5ldyBHdWluZWFcIiwgXCJwZ1wiLCBcIjY3NVwiIF0sIFsgXCJQYXJhZ3VheVwiLCBcInB5XCIsIFwiNTk1XCIgXSwgWyBcIlBlcnUgKFBlcsO6KVwiLCBcInBlXCIsIFwiNTFcIiBdLCBbIFwiUGhpbGlwcGluZXNcIiwgXCJwaFwiLCBcIjYzXCIgXSwgWyBcIlBvbGFuZCAoUG9sc2thKVwiLCBcInBsXCIsIFwiNDhcIiBdLCBbIFwiUG9ydHVnYWxcIiwgXCJwdFwiLCBcIjM1MVwiIF0sIFsgXCJQdWVydG8gUmljb1wiLCBcInByXCIsIFwiMVwiLCAzLCBbIFwiNzg3XCIsIFwiOTM5XCIgXSBdLCBbIFwiUWF0YXIgKOKAq9mC2LfYseKArOKAjilcIiwgXCJxYVwiLCBcIjk3NFwiIF0sIFsgXCJSw6l1bmlvbiAoTGEgUsOpdW5pb24pXCIsIFwicmVcIiwgXCIyNjJcIiBdLCBbIFwiUm9tYW5pYSAoUm9tw6JuaWEpXCIsIFwicm9cIiwgXCI0MFwiIF0sIFsgXCJSdXNzaWEgKNCg0L7RgdGB0LjRjylcIiwgXCJydVwiLCBcIjdcIiwgMCBdLCBbIFwiUndhbmRhXCIsIFwicndcIiwgXCIyNTBcIiBdLCBbIFwiU2FpbnQgQmFydGjDqWxlbXkgKFNhaW50LUJhcnRow6lsZW15KVwiLCBcImJsXCIsIFwiNTkwXCIsIDEgXSwgWyBcIlNhaW50IEhlbGVuYVwiLCBcInNoXCIsIFwiMjkwXCIgXSwgWyBcIlNhaW50IEtpdHRzIGFuZCBOZXZpc1wiLCBcImtuXCIsIFwiMTg2OVwiIF0sIFsgXCJTYWludCBMdWNpYVwiLCBcImxjXCIsIFwiMTc1OFwiIF0sIFsgXCJTYWludCBNYXJ0aW4gKFNhaW50LU1hcnRpbiAocGFydGllIGZyYW7Dp2Fpc2UpKVwiLCBcIm1mXCIsIFwiNTkwXCIsIDIgXSwgWyBcIlNhaW50IFBpZXJyZSBhbmQgTWlxdWVsb24gKFNhaW50LVBpZXJyZS1ldC1NaXF1ZWxvbilcIiwgXCJwbVwiLCBcIjUwOFwiIF0sIFsgXCJTYWludCBWaW5jZW50IGFuZCB0aGUgR3JlbmFkaW5lc1wiLCBcInZjXCIsIFwiMTc4NFwiIF0sIFsgXCJTYW1vYVwiLCBcIndzXCIsIFwiNjg1XCIgXSwgWyBcIlNhbiBNYXJpbm9cIiwgXCJzbVwiLCBcIjM3OFwiIF0sIFsgXCJTw6NvIFRvbcOpIGFuZCBQcsOtbmNpcGUgKFPDo28gVG9tw6kgZSBQcsOtbmNpcGUpXCIsIFwic3RcIiwgXCIyMzlcIiBdLCBbIFwiU2F1ZGkgQXJhYmlhICjigKvYp9mE2YXZhdmE2YPYqSDYp9mE2LnYsdio2YrYqSDYp9mE2LPYudmI2K/Zitip4oCs4oCOKVwiLCBcInNhXCIsIFwiOTY2XCIgXSwgWyBcIlNlbmVnYWwgKFPDqW7DqWdhbClcIiwgXCJzblwiLCBcIjIyMVwiIF0sIFsgXCJTZXJiaWEgKNCh0YDQsdC40ZjQsClcIiwgXCJyc1wiLCBcIjM4MVwiIF0sIFsgXCJTZXljaGVsbGVzXCIsIFwic2NcIiwgXCIyNDhcIiBdLCBbIFwiU2llcnJhIExlb25lXCIsIFwic2xcIiwgXCIyMzJcIiBdLCBbIFwiU2luZ2Fwb3JlXCIsIFwic2dcIiwgXCI2NVwiIF0sIFsgXCJTaW50IE1hYXJ0ZW5cIiwgXCJzeFwiLCBcIjE3MjFcIiBdLCBbIFwiU2xvdmFraWEgKFNsb3ZlbnNrbylcIiwgXCJza1wiLCBcIjQyMVwiIF0sIFsgXCJTbG92ZW5pYSAoU2xvdmVuaWphKVwiLCBcInNpXCIsIFwiMzg2XCIgXSwgWyBcIlNvbG9tb24gSXNsYW5kc1wiLCBcInNiXCIsIFwiNjc3XCIgXSwgWyBcIlNvbWFsaWEgKFNvb21hYWxpeWEpXCIsIFwic29cIiwgXCIyNTJcIiBdLCBbIFwiU291dGggQWZyaWNhXCIsIFwiemFcIiwgXCIyN1wiIF0sIFsgXCJTb3V0aCBLb3JlYSAo64yA7ZWc66+86rWtKVwiLCBcImtyXCIsIFwiODJcIiBdLCBbIFwiU291dGggU3VkYW4gKOKAq9is2YbZiNioINin2YTYs9mI2K/Yp9mG4oCs4oCOKVwiLCBcInNzXCIsIFwiMjExXCIgXSwgWyBcIlNwYWluIChFc3Bhw7FhKVwiLCBcImVzXCIsIFwiMzRcIiBdLCBbIFwiU3JpIExhbmthICjgt4Hgt4rigI3gtrvgt5Mg4La94LaC4Laa4LeP4LeAKVwiLCBcImxrXCIsIFwiOTRcIiBdLCBbIFwiU3VkYW4gKOKAq9in2YTYs9mI2K/Yp9mG4oCs4oCOKVwiLCBcInNkXCIsIFwiMjQ5XCIgXSwgWyBcIlN1cmluYW1lXCIsIFwic3JcIiwgXCI1OTdcIiBdLCBbIFwiU3dhemlsYW5kXCIsIFwic3pcIiwgXCIyNjhcIiBdLCBbIFwiU3dlZGVuIChTdmVyaWdlKVwiLCBcInNlXCIsIFwiNDZcIiBdLCBbIFwiU3dpdHplcmxhbmQgKFNjaHdlaXopXCIsIFwiY2hcIiwgXCI0MVwiIF0sIFsgXCJTeXJpYSAo4oCr2LPZiNix2YrYp+KArOKAjilcIiwgXCJzeVwiLCBcIjk2M1wiIF0sIFsgXCJUYWl3YW4gKOWPsOeBoylcIiwgXCJ0d1wiLCBcIjg4NlwiIF0sIFsgXCJUYWppa2lzdGFuXCIsIFwidGpcIiwgXCI5OTJcIiBdLCBbIFwiVGFuemFuaWFcIiwgXCJ0elwiLCBcIjI1NVwiIF0sIFsgXCJUaGFpbGFuZCAo4LmE4LiX4LiiKVwiLCBcInRoXCIsIFwiNjZcIiBdLCBbIFwiVGltb3ItTGVzdGVcIiwgXCJ0bFwiLCBcIjY3MFwiIF0sIFsgXCJUb2dvXCIsIFwidGdcIiwgXCIyMjhcIiBdLCBbIFwiVG9rZWxhdVwiLCBcInRrXCIsIFwiNjkwXCIgXSwgWyBcIlRvbmdhXCIsIFwidG9cIiwgXCI2NzZcIiBdLCBbIFwiVHJpbmlkYWQgYW5kIFRvYmFnb1wiLCBcInR0XCIsIFwiMTg2OFwiIF0sIFsgXCJUdW5pc2lhICjigKvYqtmI2YbYs+KArOKAjilcIiwgXCJ0blwiLCBcIjIxNlwiIF0sIFsgXCJUdXJrZXkgKFTDvHJraXllKVwiLCBcInRyXCIsIFwiOTBcIiBdLCBbIFwiVHVya21lbmlzdGFuXCIsIFwidG1cIiwgXCI5OTNcIiBdLCBbIFwiVHVya3MgYW5kIENhaWNvcyBJc2xhbmRzXCIsIFwidGNcIiwgXCIxNjQ5XCIgXSwgWyBcIlR1dmFsdVwiLCBcInR2XCIsIFwiNjg4XCIgXSwgWyBcIlUuUy4gVmlyZ2luIElzbGFuZHNcIiwgXCJ2aVwiLCBcIjEzNDBcIiBdLCBbIFwiVWdhbmRhXCIsIFwidWdcIiwgXCIyNTZcIiBdLCBbIFwiVWtyYWluZSAo0KPQutGA0LDRl9C90LApXCIsIFwidWFcIiwgXCIzODBcIiBdLCBbIFwiVW5pdGVkIEFyYWIgRW1pcmF0ZXMgKOKAq9in2YTYpdmF2KfYsdin2Kog2KfZhNi52LHYqNmK2Kkg2KfZhNmF2KrYrdiv2KnigKzigI4pXCIsIFwiYWVcIiwgXCI5NzFcIiBdLCBbIFwiVW5pdGVkIEtpbmdkb21cIiwgXCJnYlwiLCBcIjQ0XCIgXSwgWyBcIlVuaXRlZCBTdGF0ZXNcIiwgXCJ1c1wiLCBcIjFcIiwgMCBdLCBbIFwiVXJ1Z3VheVwiLCBcInV5XCIsIFwiNTk4XCIgXSwgWyBcIlV6YmVraXN0YW4gKE/Ku3piZWtpc3RvbilcIiwgXCJ1elwiLCBcIjk5OFwiIF0sIFsgXCJWYW51YXR1XCIsIFwidnVcIiwgXCI2NzhcIiBdLCBbIFwiVmF0aWNhbiBDaXR5IChDaXR0w6AgZGVsIFZhdGljYW5vKVwiLCBcInZhXCIsIFwiMzlcIiwgMSBdLCBbIFwiVmVuZXp1ZWxhXCIsIFwidmVcIiwgXCI1OFwiIF0sIFsgXCJWaWV0bmFtIChWaeG7h3QgTmFtKVwiLCBcInZuXCIsIFwiODRcIiBdLCBbIFwiV2FsbGlzIGFuZCBGdXR1bmFcIiwgXCJ3ZlwiLCBcIjY4MVwiIF0sIFsgXCJZZW1lbiAo4oCr2KfZhNmK2YXZhuKArOKAjilcIiwgXCJ5ZVwiLCBcIjk2N1wiIF0sIFsgXCJaYW1iaWFcIiwgXCJ6bVwiLCBcIjI2MFwiIF0sIFsgXCJaaW1iYWJ3ZVwiLCBcInp3XCIsIFwiMjYzXCIgXSBdO1xuICAgIC8vIGxvb3Agb3ZlciBhbGwgb2YgdGhlIGNvdW50cmllcyBhYm92ZVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsQ291bnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjID0gYWxsQ291bnRyaWVzW2ldO1xuICAgICAgICBhbGxDb3VudHJpZXNbaV0gPSB7XG4gICAgICAgICAgICBuYW1lOiBjWzBdLFxuICAgICAgICAgICAgaXNvMjogY1sxXSxcbiAgICAgICAgICAgIGRpYWxDb2RlOiBjWzJdLFxuICAgICAgICAgICAgcHJpb3JpdHk6IGNbM10gfHwgMCxcbiAgICAgICAgICAgIGFyZWFDb2RlczogY1s0XSB8fCBudWxsXG4gICAgICAgIH07XG4gICAgfVxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3ZlbmRvci9pbnRsLXRlbC1pbnB1dC9idWlsZC9qcy9pbnRsVGVsSW5wdXQuanNcbiAqKiBtb2R1bGUgaWQgPSAyMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gNCA1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuICAgICAgICA7XHJcblxyXG5cclxudmFyIHQybSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcclxuXHJcbiAgICByZXR1cm4gaVswXSAqIDYwICsgaVsxXTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215cHJvZmlsZS92aWV3Lmh0bWwnKSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIG9uaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBlZGl0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkluc2lkZSBlZGl0XCIpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdteXByb2ZpbGUuZWRpdCcsIHRydWUpO1xyXG4gICAgfSxcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgIHRoaXMub2JzZXJ2ZSgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcicsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbi8vICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnNpZGUgdmlldyBjdXJyZW50VHJhdmVsbGVyIGNoYW5nZWRcIik7XHJcbi8vICAgICAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xyXG4vLyAgICAgICAgICAgIFxyXG4vLyAgICAgICAgfSwge2luaXQ6IHRydWV9KTtcclxuLy8gICAgICAgIHRoaXMub2JzZXJ2ZSgnbXl0cmF2ZWxsZXIuY3VycmVudFRyYXZlbGxlcklkJywgZnVuY3Rpb24odmFsdWUpIHtcclxuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY3VycmVudFRyYXZlbGxlcklkIGNoYW5nZWQgXCIpO1xyXG4vLyAgICAgICAgICAgIC8vY29uc29sZS5sb2codmFsdWUpO1xyXG4vLyAgICAgICAgICAgIC8vdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVySWQnLCB2YWx1ZSk7XHJcbi8vICAgICAgICB9LCB7aW5pdDogZmFsc2V9KTtcclxuICAgIH1cclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvbXlwcm9maWxlL3ZpZXcuanNcbiAqKiBtb2R1bGUgaWQgPSAyMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gNFxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImgxXCIsXCJmXCI6W1wiTXkgUHJvZmlsZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJ1aSBzZWdtZW50IGxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJteXByb2ZpbGUucGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVzZXItaW5mb1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJzcmNcIjpbe1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUuYmFzZVVybFwifSxcIi90aGVtZXMvQjJDL2ltZy9ndWVzdC5wbmdcIl0sXCJhbHRcIjpcIlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwibmFtZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUubmFtZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImN1c3RvbWVyLWlkXCJ9LFwiZlwiOltcIlVzZXIgSWQ6IFwiLHtcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLmlkXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwicGhvbmVcIn0sXCJmXCI6W1wiTW9iaWxlIE5vOiBcIix7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5tb2JpbGVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJlZGl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwic21hbGwgZ3JheVwifSxcImZcIjpbXCJFZGl0XCJdfSxcIiBcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGV0YWlsc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0YWJsZVwiLFwiYVwiOntcInN0eWxlXCI6XCJkaXNwbGF5Om5vbmU7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIn0sXCJmXCI6W1wiRW1haWwgQWRkcmVzc1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLmVtYWlsXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIn0sXCJmXCI6W1wiTW9iaWxlIE51bWJlclwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLm1vYmlsZVwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0clwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaGVhZGVyXCJ9LFwiZlwiOltcIkFkZHJlc3NcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5hZGRyZXNzXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIn0sXCJmXCI6W1wiQ2l0eVwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLmNpdHlcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImg0XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGhlYWRlclwifSxcImZcIjpbXCJTdGF0ZVwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLnN0YXRlXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoNFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBoZWFkZXJcIn0sXCJmXCI6W1wiQ291bnRyeVwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInRkXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLmNvdW50cnlcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImg0XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGhlYWRlclwifSxcImZcIjpbXCJQaW5jb2RlXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUucGluY29kZVwifV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiRW1haWwgQWRkcmVzc1wiXX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUuZW1haWxcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIk1vYmlsZSBOdW1iZXJcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLm1vYmlsZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiQWRkcmVzc1wiXX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUuYWRkcmVzc1wifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiQ2l0eVwiXX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJteXByb2ZpbGUuY2l0eVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiU3RhdGVcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwibXlwcm9maWxlLnN0YXRlXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJDb3VudHJ5XCJdfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5jb3VudHJ5XCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJQaW5jb2RlXCJdfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcIm15cHJvZmlsZS5waW5jb2RlXCJ9XX1dfV19XSxcIm5cIjo1MCxcInJcIjpcIm15cHJvZmlsZVwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXSxcInJcIjpcIm15cHJvZmlsZVwifV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15cHJvZmlsZS5wZW5kaW5nXCJdLFwic1wiOlwiIV8wXCJ9fV19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9teXByb2ZpbGUvdmlldy5odG1sXG4gKiogbW9kdWxlIGlkID0gMjE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDRcbiAqKi8iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9sZXNzL21vYmlsZS9teXRyYXZlbGxlci5sZXNzXG4gKiogbW9kdWxlIGlkID0gMjE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDQgNVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=