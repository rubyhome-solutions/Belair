webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(156);


/***/ },

/***/ 69:
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

/***/ 70:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui login small modal"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":4,"f":["Login"],"n":51,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}," ",{"t":4,"f":["Sign-up"],"n":50,"r":"signup"}," ",{"t":4,"f":["Reset password"],"n":50,"r":"forgottenpass"}]}," ",{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":8,"r":"form"}]}]}],"n":50,"r":"popup"},{"t":4,"n":51,"f":[{"t":8,"r":"form"}],"r":"popup"}],"p":{"form":[{"t":7,"e":"form","a":{"action":"javascript:;","class":[{"t":4,"f":["form"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":["ui basic segment form"],"x":{"r":["popup"],"s":"!_0"}}," ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting"}],"style":"position: relative;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":50,"x":{"r":["forgottenpass","signup"],"s":"_0||_1"}}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Login"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"password","type":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"submit","class":["ui ",{"t":4,"f":["small"],"n":50,"x":{"r":["popup"],"s":"!_0"}},{"t":4,"n":51,"f":[],"x":{"r":["popup"],"s":"!_0"}}," fluid blue button uppercase"]},"f":["LOGIN"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;","class":"forgot-password"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"forgottenpass\",1]"}}},"f":["Forgot Password?"]}," ",{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"p","f":["Don't have a CheapTicket.in Account? ",{"t":7,"e":"br"}," ",{"t":7,"e":"a","a":{"href":"javascript:;"},"v":{"click":{"m":"set","a":{"r":[],"s":"[\"signup\",1]"}}},"f":["Sign up for one »"]}]}]}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"signup"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"email","value":[{"t":2,"r":"user.email"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"email","value":[{"t":2,"r":"user.mobile"}],"class":"fluid","placeholder":"Mobile"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password","value":[{"t":2,"r":"user.password"}],"class":"fluid","placeholder":"Password"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"type":"password","name":"password2","value":[{"t":2,"r":"user.password2"}],"class":"fluid","placeholder":"Password again"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui fluid blue button uppercase"},"v":{"click":{"m":"signup","a":{"r":[],"s":"[]"}}},"f":["Signup"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"signupsuccess"}]}," ",{"t":4,"f":["Your registration was success.",{"t":7,"e":"br"},"You will receive email with further instructions from us how to proceed.",{"t":7,"e":"br"},"Please check your inbox and if no email from us is found, check also your SPAM folder."],"n":50,"r":"signupsuccess"}," ",{"t":7,"e":"div","a":{"class":["ui basic segment ",{"t":4,"f":["hide"],"n":51,"r":"forgottenpass"}],"style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":4,"f":[{"t":7,"e":"ui-input","a":{"name":"login","value":[{"t":2,"r":"user.login"}],"class":"fluid","placeholder":"Email"},"f":[]}," ",{"t":7,"e":"br"}," ",{"t":7,"e":"button","a":{"type":"button","class":"ui fluid blue button uppercase"},"v":{"click":{"m":"resetPassword","a":{"r":[],"s":"[]"}}},"f":["RESET"]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}],"n":51,"r":"resetsuccess"}," ",{"t":4,"f":["Instructions how to revive your password has been sent to your email.",{"t":7,"e":"br"},"Please check your email."],"n":50,"r":"resetsuccess"}]}]}]}};

/***/ },

/***/ 77:
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

/***/ 82:
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

/***/ 105:
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

/***/ 156:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  GuestFilter = __webpack_require__(157);
	__webpack_require__(163);
	
	$(function() {
	    (new GuestFilter()).render('#app');
	});

/***/ },

/***/ 157:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	        Auth = __webpack_require__(69),
	        MybookingData = __webpack_require__(82),
	        Meta = __webpack_require__(77)
	        ;
	
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(158),
	    components: {
	        'layout': __webpack_require__(72),
	        auth: __webpack_require__(69),
	        guestbooking: __webpack_require__(159),
	        details: __webpack_require__(161),
	    },
	    partials: {
	        'base-panel': __webpack_require__(71)
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

/***/ 158:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"id":"guestbooking","class":"content"},"f":[{"t":7,"e":"div","a":{"class":"step header step1 active"},"f":["Get Booking"]}," ",{"t":7,"e":"div","a":{"class":"ui segment"},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[" ",{"t":7,"e":"auth","a":{"meta":[{"t":2,"r":"meta"}]}}]}," ",{"t":7,"e":"div","a":{"class":"ui vertical divider"},"f":["Or"]}," ",{"t":7,"e":"div","a":{"class":"center aligned column"},"f":[{"t":7,"e":"guestbooking","a":{"mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}]}]}]}]}],"n":50,"x":{"r":["mybookings.loggedin"],"s":"!_0"}},{"t":4,"n":51,"f":[{"t":7,"e":"details","a":{"mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"x":{"r":["mybookings.loggedin"],"s":"!_0"}}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 159:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(8),
	        Q = __webpack_require__(30)
	        ;
	var Form = __webpack_require__(29)
	        ;
	var GuestBooking = Form.extend({
	    template: __webpack_require__(160),
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

/***/ 160:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"content"},"f":[{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting"}],"style":"position: relative;"},"v":{"submit":{"m":"getticketbypnr","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable "},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment","style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"mobile","value":[{"t":2,"r":"mobile"}],"class":"fluid ","placeholder":"Mobile / Email"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"pnr","value":[{"t":2,"r":"pnr"}],"class":"fluid","placeholder":"PNR / Booking Id."},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg"}]}],"n":50,"r":"errorMsg"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors"}]}],"n":50,"x":{"r":["errors","errorMsg"],"s":"_0||_1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui fluid blue button "},"f":["SUBMIT"]}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ui horizontal divider"},"f":["OR"]}," ",{"t":7,"e":"form","a":{"action":"javascript:;","class":["ui form ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors2","errorMsg2"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"submitting2"}],"style":"position: relative;"},"v":{"submit":{"m":"getticketbylastname","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"ui two column middle aligned center aligned relaxed fitted stackable "},"f":[{"t":7,"e":"div","a":{"class":"ui basic segment","style":"max-width: 300px; margin: auto; text-align: left;"},"f":[{"t":7,"e":"ui-input","a":{"name":"lastname","value":[{"t":2,"r":"lastname"}],"class":"fluid ","placeholder":"Last Name"},"f":[]}," ",{"t":7,"e":"ui-input","a":{"name":"pnr2","value":[{"t":2,"r":"pnr2"}],"class":"fluid","placeholder":"PNR / Booking Id."},"f":[]}," ",{"t":4,"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"div","a":{"class":"ui error message"},"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errorMsg2"}]}],"n":50,"r":"errorMsg2"}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"p","f":[{"t":2,"r":"."}]}],"n":50,"r":"."}],"n":52,"i":"i","r":"errors2"}]}],"n":50,"x":{"r":["errors2","errorMsg2"],"s":"_0||_1"}}," ",{"t":7,"e":"button","a":{"type":"submit","class":"ui fluid blue button "},"f":["SUBMIT"]}]}]}]}]}]};

/***/ },

/***/ 161:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	        Auth = __webpack_require__(69),
	        moment = __webpack_require__(20),
	        _ = __webpack_require__(35),
	        accounting = __webpack_require__(105)
	        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(162),
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

/***/ 162:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui positive  message","style":"display: none"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":"closemessage"}}," ",{"t":4,"f":["Sending Email.."],"n":50,"r":"./submitting"},{"t":4,"n":51,"f":["Email Sent"],"r":"./submitting"}]}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}},{"t":7,"e":"div","a":{"class":["box my-bookings-details ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":7,"e":"h3","f":["My Bookings Details"]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":" noprint ui grid three column"},"f":[{"t":4,"f":[{"t":7,"e":"button","v":{"click":"reschedule"},"a":{"class":"smaller ui button orange"},"f":["Change"]}," ",{"t":7,"e":"button","v":{"click":"cancel"},"a":{"class":"smaller ui button red"},"f":["Cancel"]}],"n":50,"x":{"r":["upcoming"],"s":"_0==\"true\""}}," ",{"t":7,"e":"button","v":{"click":"back"},"a":{"class":"smaller ui button yellow"},"f":["Back"]}]}," ",{"t":7,"e":"div","a":{"class":" noprint ui grid three column","style":"width:100%"},"f":[{"t":7,"e":"div","a":{"class":"action"},"f":[{"t":7,"e":"a","a":{"href":"#","class":"email"},"v":{"click":{"m":"toggleemail","a":{"r":[],"s":"[]"}}},"m":[{"t":4,"f":["disabled='disabled'"],"n":50,"x":{"r":["submitting"],"s":"!_0"}}],"f":["Email"]}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/asPDF/",{"t":2,"r":"mybookings.currentCartDetails.id"}],"target":"_blank","class":"pdf"},"f":["PDF"]}]}," ",{"t":7,"e":"div","a":{"class":"ui modal small mailticket"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Email Ticket"]}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"form","a":{"class":["ui form ",{"t":4,"f":["loading"],"n":50,"r":"./submitting"}],"action":"javascript:;"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"input","a":{"class":"ui input small","type":"text","name":"email","id":"email","value":""}}]}," ",{"t":7,"e":"div","a":{"class":""},"f":[{"t":7,"e":"button","v":{"click":{"m":"submit","a":{"r":[],"s":"[]"}}},"a":{"class":"ui small button fluid yellow"},"f":["Send"]}]}]}]}]}]}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}}," ",{"t":7,"e":"div","a":{"class":["ui grid group ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":7,"e":"div","a":{"class":"ui grid two column","style":"width:100%"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":" table title ","style":"float:left"},"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"to","style":"margin-top: 3px;"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"table title","style":"float:left"},"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"back","style":"margin-top: 3px;"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"column table title","style":"float:left"},"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"source"},"  |  "],"i":"i","r":"bookings"}," ",{"t":2,"rx":{"r":"bookings","m":[{"r":["bookings.length"],"s":"_0-1"},"destination"]}}]}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"div","a":{"class":" table title","style":"float:left"},"f":[{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"ui grid two column","style":"width:100%"},"f":[{"t":7,"e":"div","a":{"class":" table title","style":"float:left"},"f":[{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"r":"booking_statusmsg"}]}]}," ",{"t":7,"e":"div","a":{"class":" table title","style":"float:left"},"f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"passengerWrap"},"f":[{"t":7,"e":"div","a":{"class":"passenger"},"f":[{"t":4,"f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Passenger:"]}," ",{"t":2,"r":"title"}," ",{"t":2,"r":"first_name"}," ",{"t":2,"r":"last_name"}," (",{"t":2,"r":"type"},") ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["travellerBookingStatus","status"],"s":"_0(_1)"}}]},"f":[{"t":2,"r":"statusmsg"}]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["CRS PNR:"]},{"t":2,"r":"crs_pnr"},", ",{"t":7,"e":"span","f":["Air PNR:"]},{"t":2,"r":"airline_pnr"},", ",{"t":7,"e":"span","f":["Ticket No.:"]}," ",{"t":2,"r":"ticket"}]}]}],"i":"t","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller"]}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column ","style":"height: auto !important;"},"f":[{"t":7,"e":"div","a":{"class":"ui segment flight-itinerary compact dark"},"f":[{"t":7,"e":"div","a":{"class":"title"},"f":[{"t":7,"e":"span","a":{"class":"city"},"f":[{"t":2,"r":"source"}," → ",{"t":2,"r":"destination"}]}," ",{"t":2,"x":{"r":["formatTravelDate2","departure"],"s":"_0(_1)"}}," ",{"t":7,"e":"span","a":{"class":"time"},"f":[{"t":2,"r":"flighttime"}]}]}," ",{"t":7,"e":"div","a":{"class":"segmentWrap"},"f":[{"t":7,"e":"div","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"divider"},"f":[{"t":7,"e":"span","a":{"class":"layover"},"f":["Layover: ",{"t":2,"x":{"r":["diff","k","j","bookings"],"s":"_0(_3[_2].routes[_1].departure,_3[_2].routes[_1-1].arrival)"}}]}]}],"n":50,"x":{"r":["k"],"s":"_0>0"}}," ",{"t":7,"e":"div","a":{"class":"carrier-name"},"f":[{"t":7,"e":"span","a":{"class":"carrier-logo"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":["/img/air_logos/",{"t":2,"r":"carrier"},".png"],"alt":[{"t":2,"r":"carrierName"}],"title":[{"t":2,"r":"carrierName"}]}}]}," ",{"t":2,"r":"carrierName"}," ",{"t":2,"r":"carrier"},"-",{"t":2,"r":"flightNumber"}]}," ",{"t":7,"e":"div","a":{"class":"from"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"origin"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"style":"text-align: right;","class":"airport"},"f":[{"t":2,"r":"originDetails"}]}]}," ",{"t":7,"e":"div","a":{"class":"flight"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"to"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"destination"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"destinationDetails"}]}]}," ",{"t":7,"e":"div","a":{"class":"time-n-cabin"},"f":[{"t":7,"e":"div","f":[{"t":2,"r":"flighttime"},{"t":7,"e":"br"}," ",{"t":2,"rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller",{"r":[],"s":"0"},"cabin"]}}]}]}],"i":"k","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"routes"]}}]}]}]}]}]}],"i":"j","r":"bookings"}," ",{"t":7,"e":"div","a":{"class":"total"},"f":["TOTAL PRICE: ",{"t":7,"e":"span","f":[{"t":2,"r":"curency"}," ",{"t":2,"x":{"r":["convert","totalAmount"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"div","a":{"class":"taxes"},"f":["Basic Fare : ",{"t":2,"r":"baseprice"}," , Taxes : ",{"t":2,"r":"taxes"}," , Fee : ",{"t":2,"r":"fee"}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"style":"clear: both;"}}," ",{"t":7,"e":"table","a":{"class":"passenger"},"f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","a":{"colspan":"4"},"f":["Terms and Conditions"]}]}," ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":["All flight timings shown are local times."]}," ",{"t":7,"e":"li","f":["Use ",{"t":7,"e":"b","f":["Ref No."]}," for communication with us."]}," ",{"t":7,"e":"li","f":["Use ",{"t":7,"e":"b","f":["Airline PNR"]}," for contacting the Airlines."]}," ",{"t":7,"e":"li","f":["Carry a print-out of e-ticket for check-in."]}," ",{"t":7,"e":"li","f":["In case of no-show, tickets are non-refundable."]}," ",{"t":7,"e":"li","f":["Ensure your passport is valid for more than 6 months."]}," ",{"t":7,"e":"li","f":["Please check Transit & Destination Visa Requirement."]}," ",{"t":7,"e":"li","f":["For cancellation, airline charges & ser. fee apply."]}]}]}," ",{"t":7,"e":"td","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":["Carry a photo ID/ Passport for check-in."]}," ",{"t":7,"e":"li","f":["Meals, Seat & Special Requests are not guaranteed."]}," ",{"t":7,"e":"li","f":["Present Frequent Flier Card at check-in."]}," ",{"t":7,"e":"li","f":["Carriage is subject to Airlines Terms & Conditions."]}," ",{"t":7,"e":"li","f":["Ensure passenger names are correct, name change is not permitted."]}," ",{"t":7,"e":"li","f":["For any change Airline charges, difference of fare & ser. fee apply."]}," ",{"t":7,"e":"li","f":["You might be asked to provide card copy & ID proof of card holder."]}]}]}]}]}," ",{"t":7,"e":"div","a":{"style":"clear: both;"}}," ",{"t":7,"e":"div","a":{"class":""},"f":["Disclaimer: CheapTicket is not liable for any deficiency in service by Airline or Service providers."]}]}],"n":50,"r":"mybookings.print"}]}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"script","a":{"type":"text/javascript"},"f":["window.ixiTransactionTracker = function(tag) {\r\nfunction updateRedirect(tag, transactionID, pnr, saleValue, segmentNights) {\r\nreturn \"<img style='top:-999999px;left:-999999px;position:absolute' src='https://www.ixigo.com/ixi-api/tracker/updateConversion/\" + tag + \"?transactionId=\" + transactionID + \"&pnr=\" + pnr + \"&saleValue=\" + saleValue + \"&segmentNights=\" + segmentNights + \"' />\";\r\n}\r\ndocument.body.innerHTML += updateRedirect(tag, \"",{"t":2,"r":"mybookings.currentCartDetails.id"},"\", \"",{"t":2,"r":"mybookings.currentCartDetails.bookings.0.traveller.0.airline_pnr"},"\", ",{"t":2,"x":{"r":["convertIxigo","mybookings.currentCartDetails.totalAmount"],"s":"_0(_1)"}},", ",{"t":2,"r":"mybookings.currentCartDetails.segNights"}," );\r\n};"]}," ",{"t":7,"e":"script","a":{"src":"https://www.ixigo.com/ixi-api/tracker/track196","id":"tracker"}}],"n":50,"x":{"r":["mybookings.clientSourceId"],"s":"_0==4"}}],"n":50,"x":{"r":["mybookings.print"],"s":"!_0"}}]}],"r":"mybookings.currentCartDetails"}]};

/***/ },

/***/ 163:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2FwcC9hdXRoLmpzP2I2OTIiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2FwcC9hdXRoLmh0bWw/ZmM5YyIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlib29raW5ncy9tZXRhLmpzPzE0YzUiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzP2Y2YjUiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanM/MGJiYSIsIndlYnBhY2s6Ly8vLi9qcy9zdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmpzP2NmNDAiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL2FjY291bnRpbmcuanMvYWNjb3VudGluZy5qcz8yNzlhIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvZ3Vlc3RmaWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9ndWVzdHRpY2tldC9ndWVzdGZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvZ3Vlc3R0aWNrZXQvZ3Vlc3RmaWx0ZXIuaHRtbCIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvZ3Vlc3R0aWNrZXQvZ3Vlc3Rib29raW5nLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teWJvb2tpbmdzL2RldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3MvZGV0YWlscy5odG1sIiwid2VicGFjazovLy8uL2xlc3MvbW9iaWxlL2d1ZXN0ZmlsdGVyLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNHQUFxRyxFQUFFO0FBQ3ZHOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNILEdBQUU7QUFDRjtBQUNBO0FBQ0Esa0RBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBQzs7Ozs7Ozs7QUMxWkQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQyxFOzs7Ozs7O0FDUEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0EseUJBQXdCLGVBQWU7O0FBRXZDO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSx1Q0FBc0MseUJBQXlCO0FBQy9EO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEIsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsRUFBQyxFOzs7Ozs7O0FDNURELGlCQUFnQixZQUFZLHdCQUF3QixTQUFTLGlCQUFpQixFQUFFLE9BQU8sWUFBWSxxQkFBcUIsc0NBQXNDLE9BQU8scUJBQXFCLG1DQUFtQyxxQkFBcUIsTUFBTSxxQkFBcUIscUJBQXFCLE9BQU8scUJBQXFCLG9GQUFvRixPQUFPLHFCQUFxQixpQkFBaUIsV0FBVyxzQkFBc0IsU0FBUyxpQkFBaUIsR0FBRyxFQUFFLE1BQU0scUJBQXFCLDhCQUE4QixZQUFZLE1BQU0scUJBQXFCLGdDQUFnQyxPQUFPLDhCQUE4QixlQUFlLHVCQUF1QixXQUFXLGlCQUFpQixHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsY0FBYyx1Q0FBdUMsRUFBRSxtQkFBbUIseUJBQXlCLGVBQWUsdUJBQXVCLFdBQVcsaUJBQWlCLEdBQUcsT0FBTyx1Q0FBdUMsV0FBVyxVQUFVLHVCQUF1QixHQUFHLEc7Ozs7Ozs7QUNBdC9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUEsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGlEQUFpRDtBQUNwRTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQXlDO0FBQ3pDO0FBQ0Esa0NBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBaUM7QUFDakM7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBOztBQUVBLDBCQUF5Qjs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHVEQUF1RDtBQUMxRTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QztBQUN6QztBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWlDO0FBQ2pDO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQSwwQkFBeUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULE1BQUs7QUFDTCxFQUFDO0FBQ0QsK0I7Ozs7Ozs7QUNuTEEsaUJBQWdCLFlBQVkscUJBQXFCLGtCQUFrQixPQUFPLHNCQUFzQixzQkFBc0IsdUJBQXVCLGdDQUFnQyx3Q0FBd0MsTUFBTSw4Q0FBOEMsOEJBQThCLEVBQUUsTUFBTSxVQUFVLDBCQUEwQixrQkFBa0IsT0FBTyxxQkFBcUIsZ0ZBQWdGLE9BQU8scUJBQXFCLHFEQUFxRCxjQUFjLGtCQUFrQixFQUFFLE9BQU8sMEJBQTBCLDBCQUEwQixtQkFBbUIsa0RBQWtELFFBQVEsTUFBTSwwQkFBMEIsdUJBQXVCLGdCQUFnQixvREFBb0QsUUFBUSxNQUFNLFlBQVksZUFBZSxFQUFFLGVBQWUsTUFBTSxxQkFBcUIsMkJBQTJCLE9BQU8sWUFBWSxvQkFBb0IscUJBQXFCLEVBQUUsd0JBQXdCLE1BQU0sWUFBWSxZQUFZLG9CQUFvQixjQUFjLEVBQUUsaUJBQWlCLDhCQUE4QixFQUFFLGNBQWMsd0NBQXdDLE1BQU0sd0JBQXdCLGdEQUFnRCxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsZ0NBQWdDLFlBQVksTUFBTSxzQkFBc0Isc0JBQXNCLHVCQUF1QixnQ0FBZ0MsMENBQTBDLE1BQU0sK0NBQStDLDhCQUE4QixFQUFFLE1BQU0sVUFBVSwrQkFBK0Isa0JBQWtCLE9BQU8scUJBQXFCLGdGQUFnRixPQUFPLHFCQUFxQixxREFBcUQsY0FBYyxrQkFBa0IsRUFBRSxPQUFPLDBCQUEwQiw0QkFBNEIscUJBQXFCLDZDQUE2QyxRQUFRLE1BQU0sMEJBQTBCLHdCQUF3QixpQkFBaUIsb0RBQW9ELFFBQVEsTUFBTSxZQUFZLGVBQWUsRUFBRSxlQUFlLE1BQU0scUJBQXFCLDJCQUEyQixPQUFPLFlBQVksb0JBQW9CLHNCQUFzQixFQUFFLHlCQUF5QixNQUFNLFlBQVksWUFBWSxvQkFBb0IsY0FBYyxFQUFFLGlCQUFpQiwrQkFBK0IsRUFBRSxjQUFjLDBDQUEwQyxNQUFNLHdCQUF3QixnREFBZ0QsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRzs7Ozs7OztBQ0F2a0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWlELFlBQVk7QUFDN0QsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBLHlFQUF3RSx3QjtBQUN4RSxjQUFhO0FBQ2I7QUFDQSxxRkFBb0Ysd0I7QUFDcEYsY0FBYTtBQUNiO0FBQ0EsZ0ZBQStFLHdCO0FBQy9FLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQsYUFBYTtBQUM5RDtBQUNBLGNBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYTtBQUNiO0FBQ0EseUVBQXdFLHdCO0FBQ3hFLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLCtDQUE4QyxTQUFTO0FBQ3ZELGNBQWE7QUFDYjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUEsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFVBQVM7O0FBRVQsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLDJCQUEyQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTs7QUFFYixNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakIsTUFBSztBQUNMOztBQUVBO0FBQ0EsRUFBQyxFOzs7Ozs7O0FDOU5ELGlCQUFnQixZQUFZLFlBQVksWUFBWSxxQkFBcUIsdURBQXVELE9BQU8sbUJBQW1CLHFCQUFxQixNQUFNLHdCQUF3QixNQUFNLHdEQUF3RCxFQUFFLG1EQUFtRCxFQUFFLGNBQWMsb0NBQW9DLEVBQUUscUJBQXFCLHFDQUFxQyxpRUFBaUUsRUFBRSxPQUFPLDJDQUEyQyxNQUFNLFlBQVkscUJBQXFCLHdDQUF3QyxPQUFPLFlBQVksd0JBQXdCLHFCQUFxQixNQUFNLG1DQUFtQyxnQkFBZ0IsTUFBTSx3QkFBd0IsaUJBQWlCLE1BQU0sZ0NBQWdDLGdCQUFnQixjQUFjLHFDQUFxQyxNQUFNLHdCQUF3QixlQUFlLE1BQU0sbUNBQW1DLGNBQWMsRUFBRSxNQUFNLHFCQUFxQiw2REFBNkQsT0FBTyxxQkFBcUIsaUJBQWlCLE9BQU8sbUJBQW1CLDJCQUEyQixNQUFNLFNBQVMsdUJBQXVCLGtCQUFrQixPQUFPLDhDQUE4Qyw4QkFBOEIsZ0JBQWdCLE1BQU0sbUJBQW1CLCtCQUErQiw2Q0FBNkMsa0NBQWtDLGFBQWEsRUFBRSxNQUFNLHFCQUFxQixvQ0FBb0MsT0FBTyxtQkFBbUIsc0JBQXNCLE1BQU0scUJBQXFCLGlCQUFpQixzQkFBc0IsTUFBTSxxQkFBcUIsMkJBQTJCLE9BQU8sc0JBQXNCLHFCQUFxQixnREFBZ0Qsd0JBQXdCLEVBQUUsT0FBTyxxQkFBcUIsZ0JBQWdCLE9BQU8sdUJBQXVCLCtFQUErRSxFQUFFLE1BQU0scUJBQXFCLFdBQVcsT0FBTyx3QkFBd0IsU0FBUyxrQkFBa0Isa0JBQWtCLE1BQU0sdUNBQXVDLGNBQWMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLGNBQWMsb0NBQW9DLE1BQU0scUJBQXFCLDJCQUEyQixXQUFXLGdFQUFnRSxFQUFFLE9BQU8scUJBQXFCLGtEQUFrRCxPQUFPLFlBQVksWUFBWSxxQkFBcUIsNkNBQTZDLE9BQU8sc0JBQXNCLG9CQUFvQixPQUFPLDhCQUE4QixFQUFFLHNCQUFzQixzQ0FBc0MsRUFBRSxXQUFXLEVBQUUsbUNBQW1DLEVBQUUsRUFBRSxjQUFjLG1DQUFtQyxFQUFFLG1CQUFtQixxQkFBcUIsMkNBQTJDLE9BQU8sc0JBQXNCLG9CQUFvQixPQUFPLDhCQUE4QixFQUFFLHNCQUFzQix3Q0FBd0MsRUFBRSxXQUFXLEVBQUUsbUNBQW1DLEVBQUUsRUFBRSxPQUFPLG1DQUFtQyxjQUFjLHlDQUF5QyxFQUFFLG1CQUFtQixxQkFBcUIsa0RBQWtELE9BQU8sc0JBQXNCLG9CQUFvQixPQUFPLFlBQVksbUJBQW1CLGlDQUFpQyxNQUFNLFlBQVkscUJBQXFCLG1DQUFtQyxpQkFBaUIsRUFBRSxFQUFFLE9BQU8seUNBQXlDLE1BQU0scUJBQXFCLDRDQUE0QyxPQUFPLHNCQUFzQixlQUFlLE9BQU8sV0FBVyw4REFBOEQsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsa0RBQWtELE9BQU8scUJBQXFCLDRDQUE0QyxPQUFPLHNCQUFzQixvQkFBb0IsV0FBVyxnRUFBZ0UsRUFBRSxPQUFPLDhCQUE4QixFQUFFLEVBQUUsTUFBTSxxQkFBcUIsNENBQTRDLE9BQU8sc0JBQXNCLHFCQUFxQixzQkFBc0IsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLHVCQUF1QixPQUFPLFdBQVcsa0RBQWtELEVBQUUsRUFBRSxFQUFFLE1BQU0sWUFBWSxxQkFBcUIsZUFBZSxPQUFPLHFCQUFxQix3QkFBd0IsT0FBTyxxQkFBcUIsb0JBQW9CLE9BQU8sWUFBWSxxQkFBcUIscUJBQXFCLG9DQUFvQyxNQUFNLGtCQUFrQixNQUFNLHVCQUF1QixNQUFNLHNCQUFzQixPQUFPLGlCQUFpQixPQUFPLHNCQUFzQixvQkFBb0IsV0FBVyxzREFBc0QsRUFBRSxPQUFPLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxxQkFBcUIsa0NBQWtDLEVBQUUsb0JBQW9CLE9BQU8sa0NBQWtDLEVBQUUsd0JBQXdCLE9BQU8scUNBQXFDLE1BQU0sbUJBQW1CLEVBQUUsRUFBRSxnQkFBZ0IscUJBQXFCLGVBQWUsZUFBZSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixlQUFlLE9BQU8scUJBQXFCLGdFQUFnRSxFQUFFLE9BQU8scUJBQXFCLG1EQUFtRCxPQUFPLHFCQUFxQixnQkFBZ0IsT0FBTyxzQkFBc0IsZUFBZSxPQUFPLG1CQUFtQixRQUFRLHdCQUF3QixFQUFFLE1BQU0sV0FBVyxvREFBb0QsTUFBTSxzQkFBc0IsZUFBZSxPQUFPLHVCQUF1QixFQUFFLEVBQUUsTUFBTSxxQkFBcUIsc0JBQXNCLE9BQU8scUJBQXFCLG1CQUFtQixPQUFPLFlBQVksWUFBWSxxQkFBcUIsa0JBQWtCLE9BQU8sc0JBQXNCLGtCQUFrQixtQkFBbUIsV0FBVyxtR0FBbUcsRUFBRSxFQUFFLGNBQWMsc0JBQXNCLE1BQU0scUJBQXFCLHVCQUF1QixPQUFPLHNCQUFzQix1QkFBdUIsT0FBTyxxQkFBcUIsZ0VBQWdFLG9CQUFvQixpQkFBaUIsd0JBQXdCLFlBQVksd0JBQXdCLEdBQUcsRUFBRSxNQUFNLHdCQUF3QixNQUFNLG9CQUFvQixNQUFNLHlCQUF5QixFQUFFLE1BQU0scUJBQXFCLGVBQWUsT0FBTyxvQkFBb0IsbUJBQW1CLE1BQU0sTUFBTSxXQUFXLG9EQUFvRCxFQUFFLGVBQWUsRUFBRSxXQUFXLG1EQUFtRCxFQUFFLGVBQWUsTUFBTSxzQkFBc0IsMkJBQTJCLG9CQUFvQixPQUFPLDBCQUEwQixFQUFFLEVBQUUsTUFBTSxxQkFBcUIsaUJBQWlCLFdBQVcsTUFBTSxxQkFBcUIsYUFBYSxPQUFPLG9CQUFvQix3QkFBd0IsTUFBTSxNQUFNLFdBQVcsa0RBQWtELEVBQUUsZUFBZSxFQUFFLFdBQVcsaURBQWlELEVBQUUsZUFBZSxNQUFNLHNCQUFzQixrQkFBa0IsT0FBTywrQkFBK0IsRUFBRSxFQUFFLE1BQU0scUJBQXFCLHVCQUF1QixPQUFPLHNCQUFzQix1QkFBdUIsRUFBRSxlQUFlLE1BQU0sWUFBWSxxQkFBcUIsZUFBZSxjQUFjLGVBQWUsV0FBVyxFQUFFLEVBQUUsZ0JBQWdCLHFCQUFxQixlQUFlLFlBQVksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLHlCQUF5QixNQUFNLHFCQUFxQixnQkFBZ0IsdUJBQXVCLHVCQUF1QixvQkFBb0IsTUFBTSxXQUFXLDRDQUE0QyxFQUFFLE1BQU0scUJBQXFCLGdCQUFnQix1QkFBdUIsc0JBQXNCLGdCQUFnQixrQkFBa0IsY0FBYyxnQkFBZ0IsRUFBRSxFQUFFLE1BQU0sWUFBWSxxQkFBcUIsZUFBZSxPQUFPLHFCQUFxQixxQkFBcUIsR0FBRyxNQUFNLHVCQUF1QixvQkFBb0IsT0FBTyxxQkFBcUIsb0JBQW9CLGNBQWMsOEJBQThCLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLHFCQUFxQixpRUFBaUUsTUFBTSw0QkFBNEIsOEJBQThCLGdDQUFnQyxNQUFNLDRCQUE0QixrQ0FBa0Msa0NBQWtDLE1BQU0sbUVBQW1FLE1BQU0sdUVBQXVFLE1BQU0sNkVBQTZFLE1BQU0sNEVBQTRFLE1BQU0sMkVBQTJFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixxQkFBcUIsZ0VBQWdFLE1BQU0sMEVBQTBFLE1BQU0sZ0VBQWdFLE1BQU0sMkVBQTJFLE1BQU0seUZBQXlGLE1BQU0sNEZBQTRGLE1BQU0sMEZBQTBGLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIscUJBQXFCLEdBQUcsTUFBTSxxQkFBcUIsV0FBVyw4R0FBOEcsRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLFlBQVksWUFBWSx3QkFBd0IseUJBQXlCLHFEQUFxRCxnRkFBZ0YsdUNBQXVDLGVBQWUsK05BQStOLEtBQUssd0RBQXdELDZDQUE2QyxXQUFXLDZFQUE2RSxTQUFTLFdBQVcsK0VBQStFLE9BQU8sb0RBQW9ELEtBQUssTUFBTSxHQUFHLE1BQU0sd0JBQXdCLHVFQUF1RSxjQUFjLCtDQUErQyxjQUFjLG9DQUFvQyxFQUFFLHNDQUFzQyxHOzs7Ozs7O0FDQTdpViwwQyIsImZpbGUiOiJqcy9ndWVzdGZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpXHJcbiAgICA7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpXHJcbiAgICA7XHJcblxyXG52YXIgQXV0aCA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2F1dGguaHRtbCcpLFxyXG5cclxuICAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2xvZ2luJyxcclxuICAgICAgICAgICAgc3VibWl0dGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgIGZvcmdvdHRlbnBhc3M6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgdXNlcjoge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdwb3B1cCcpKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHN1Ym1pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JNc2cnLCBudWxsKTtcclxuICAgICAgICB0aGlzLnNldCgnZXJyb3InLCBudWxsKTtcclxuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoLycgKyB0aGlzLmdldCgnYWN0aW9uJyksXHJcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHRoaXMuZ2V0KCd1c2VyLmxvZ2luJyksIHBhc3N3b3JkOiB0aGlzLmdldCgndXNlci5wYXNzd29yZCcpIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuZGVmZXJyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmRlZmVycmVkLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodmlldy5nZXQoJ3BvcHVwJyk9PW51bGwgJiYgZGF0YSAmJiBkYXRhLmlkKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvbXlib29raW5ncyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRQYXNzd29yZDogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCBudWxsKTtcclxuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC9mb3Jnb3R0ZW5wYXNzJyxcclxuICAgICAgICAgICAgZGF0YTogeyBlbWFpbDogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Jlc2V0c3VjY2VzcycsIHRydWUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbcmVzcG9uc2UubWVzc2FnZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2lnbnVwOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvc2lnbnVwJyxcclxuICAgICAgICAgICAgZGF0YTogXy5waWNrKHRoaXMuZ2V0KCd1c2VyJyksIFsnZW1haWwnLCduYW1lJywgJ21vYmlsZScsICdwYXNzd29yZCcsICdwYXNzd29yZDInXSksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc2lnbnVwc3VjY2VzcycsIHRydWUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbcmVzcG9uc2UubWVzc2FnZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuQXV0aC5sb2dpbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aCgpO1xyXG5cclxuICAgIGF1dGguc2V0KCdwb3B1cCcsIHRydWUpO1xyXG4gICAgYXV0aC5kZWZlcnJlZCA9IFEuZGVmZXIoKTtcclxuICAgIGF1dGgucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XHJcblxyXG4gICAgcmV0dXJuIGF1dGguZGVmZXJyZWQucHJvbWlzZTtcclxufTtcclxuXHJcbkF1dGguc2lnbnVwID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XHJcblxyXG4gICAgYXV0aC5zZXQoJ3BvcHVwJywgdHJ1ZSk7XHJcbiAgICBhdXRoLnNldCgnc2lnbnVwJywgdHJ1ZSk7XHJcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xyXG4gICAgYXV0aC5yZW5kZXIoJyNwb3B1cC1jb250YWluZXInKTtcclxuXHJcbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBdXRoO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2FwcC9hdXRoLmpzXG4gKiogbW9kdWxlIGlkID0gNjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNlxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbG9naW4gc21hbGwgbW9kYWxcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOltcIkxvZ2luXCJdLFwiblwiOjUxLFwieFwiOntcInJcIjpbXCJmb3Jnb3R0ZW5wYXNzXCIsXCJzaWdudXBcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlNpZ24tdXBcIl0sXCJuXCI6NTAsXCJyXCI6XCJzaWdudXBcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiUmVzZXQgcGFzc3dvcmRcIl0sXCJuXCI6NTAsXCJyXCI6XCJmb3Jnb3R0ZW5wYXNzXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udGVudFwifSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJwb3B1cFwifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjgsXCJyXCI6XCJmb3JtXCJ9XSxcInJcIjpcInBvcHVwXCJ9XSxcInBcIjp7XCJmb3JtXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlt7XCJ0XCI6NCxcImZcIjpbXCJmb3JtXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W1widWkgYmFzaWMgc2VnbWVudCBmb3JtXCJdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdWJtaXR0aW5nXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcInN1Ym1pdFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImhpZGVcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImZvcmdvdHRlbnBhc3NcIixcInNpZ251cFwiXSxcInNcIjpcIl8wfHxfMVwifX1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJsb2dpblwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLmxvZ2luXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIkxvZ2luXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicGFzc3dvcmRcIixcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIucGFzc3dvcmRcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmRcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6W1widWkgXCIse1widFwiOjQsXCJmXCI6W1wic21hbGxcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXSxcInhcIjp7XCJyXCI6W1wicG9wdXBcIl0sXCJzXCI6XCIhXzBcIn19LFwiIGZsdWlkIGJsdWUgYnV0dG9uIHVwcGVyY2FzZVwiXX0sXCJmXCI6W1wiTE9HSU5cIl19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yTXNnXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2dcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCIuXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiLlwifV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJlcnJvcnNcIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOlwiZm9yZ290LXBhc3N3b3JkXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwic2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW1xcXCJmb3Jnb3R0ZW5wYXNzXFxcIiwxXVwifX19LFwiZlwiOltcIkZvcmdvdCBQYXNzd29yZD9cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbXCJEb24ndCBoYXZlIGEgQ2hlYXBUaWNrZXQuaW4gQWNjb3VudD8gXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcInNpZ251cFxcXCIsMV1cIn19fSxcImZcIjpbXCJTaWduIHVwIGZvciBvbmUgwrtcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgYmFzaWMgc2VnbWVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJoaWRlXCJdLFwiblwiOjUxLFwiclwiOlwic2lnbnVwXCJ9XSxcInN0eWxlXCI6XCJtYXgtd2lkdGg6IDMwMHB4OyBtYXJnaW46IGF1dG87IHRleHQtYWxpZ246IGxlZnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImVtYWlsXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIuZW1haWxcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiRW1haWxcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLm1vYmlsZVwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJNb2JpbGVcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJ0eXBlXCI6XCJwYXNzd29yZFwiLFwibmFtZVwiOlwicGFzc3dvcmRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJuYW1lXCI6XCJwYXNzd29yZDJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZDJcIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiUGFzc3dvcmQgYWdhaW5cIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJidXR0b25cIixcImNsYXNzXCI6XCJ1aSBmbHVpZCBibHVlIGJ1dHRvbiB1cHBlcmNhc2VcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzaWdudXBcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIlNpZ251cFwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX1dLFwiblwiOjUxLFwiclwiOlwic2lnbnVwc3VjY2Vzc1wifV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIllvdXIgcmVnaXN0cmF0aW9uIHdhcyBzdWNjZXNzLlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJZb3Ugd2lsbCByZWNlaXZlIGVtYWlsIHdpdGggZnVydGhlciBpbnN0cnVjdGlvbnMgZnJvbSB1cyBob3cgdG8gcHJvY2VlZC5cIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiUGxlYXNlIGNoZWNrIHlvdXIgaW5ib3ggYW5kIGlmIG5vIGVtYWlsIGZyb20gdXMgaXMgZm91bmQsIGNoZWNrIGFsc28geW91ciBTUEFNIGZvbGRlci5cIl0sXCJuXCI6NTAsXCJyXCI6XCJzaWdudXBzdWNjZXNzXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImhpZGVcIl0sXCJuXCI6NTEsXCJyXCI6XCJmb3Jnb3R0ZW5wYXNzXCJ9XSxcInN0eWxlXCI6XCJtYXgtd2lkdGg6IDMwMHB4OyBtYXJnaW46IGF1dG87IHRleHQtYWxpZ246IGxlZnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImxvZ2luXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIubG9naW5cIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiRW1haWxcIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJidXR0b25cIixcImNsYXNzXCI6XCJ1aSBmbHVpZCBibHVlIGJ1dHRvbiB1cHBlcmNhc2VcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJyZXNldFBhc3N3b3JkXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbXCJSRVNFVFwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX1dLFwiblwiOjUxLFwiclwiOlwicmVzZXRzdWNjZXNzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIkluc3RydWN0aW9ucyBob3cgdG8gcmV2aXZlIHlvdXIgcGFzc3dvcmQgaGFzIGJlZW4gc2VudCB0byB5b3VyIGVtYWlsLlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJQbGVhc2UgY2hlY2sgeW91ciBlbWFpbC5cIl0sXCJuXCI6NTAsXCJyXCI6XCJyZXNldHN1Y2Nlc3NcIn1dfV19XX19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvYXBwL2F1dGguaHRtbFxuICoqIG1vZHVsZSBpZCA9IDcwXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDZcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4gICAgO1xyXG5cclxudmFyIFZpZXcgPSByZXF1aXJlKCdjb3JlL3N0b3JlJylcclxuICAgIDtcclxuXHJcbnZhciBNZXRhID0gVmlldy5leHRlbmQoe1xyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZWxlY3Q6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlczogZnVuY3Rpb24oKSB7IHJldHVybiBfLm1hcCh2aWV3LmdldCgndGl0bGVzJyksIGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHsgaWQ6IGkuaWQsIHRleHQ6IGkubmFtZSB9OyB9KTsgfSxcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5NZXRhLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIG5ldyBNZXRhKHtkYXRhOiBkYXRhfSk7XHJcbn07XHJcblxyXG5NZXRhLmZldGNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9haXJDYXJ0L21ldGEnKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7IHJlc29sdmUoTWV0YS5wYXJzZShkYXRhKSk7IH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG52YXIgaW5zdGFuY2UgPSBudWxsO1xyXG5NZXRhLmluc3RhbmNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdGFuY2UgPSBNZXRhLmZldGNoKCk7XHJcbiAgICAgICAgcmVzb2x2ZShpbnN0YW5jZSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teWJvb2tpbmdzL21ldGEuanNcbiAqKiBtb2R1bGUgaWQgPSA3N1xuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgM1xuICoqLyIsIi8vICAgICBWYWxpZGF0ZS5qcyAwLjcuMVxuXG4vLyAgICAgKGMpIDIwMTMtMjAxNSBOaWNrbGFzIEFuc21hbiwgMjAxMyBXcmFwcFxuLy8gICAgIFZhbGlkYXRlLmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuLy8gICAgIEZvciBhbGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbi8vICAgICBodHRwOi8vdmFsaWRhdGVqcy5vcmcvXG5cbihmdW5jdGlvbihleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUaGUgbWFpbiBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMuXG4gIC8vIFRoZSBvcHRpb25zIGFyZSB0aGUgZm9sbG93aW5nOlxuICAvLyAgIC0gZm9ybWF0IChzdHJpbmcpIC0gQW4gb3B0aW9uIHRoYXQgY29udHJvbHMgaG93IHRoZSByZXR1cm5lZCB2YWx1ZSBpcyBmb3JtYXR0ZWRcbiAgLy8gICAgICogZmxhdCAtIFJldHVybnMgYSBmbGF0IGFycmF5IG9mIGp1c3QgdGhlIGVycm9yIG1lc3NhZ2VzXG4gIC8vICAgICAqIGdyb3VwZWQgLSBSZXR1cm5zIHRoZSBtZXNzYWdlcyBncm91cGVkIGJ5IGF0dHJpYnV0ZSAoZGVmYXVsdClcbiAgLy8gICAgICogZGV0YWlsZWQgLSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByYXcgdmFsaWRhdGlvbiBkYXRhXG4gIC8vICAgLSBmdWxsTWVzc2FnZXMgKGJvb2xlYW4pIC0gSWYgYHRydWVgIChkZWZhdWx0KSB0aGUgYXR0cmlidXRlIG5hbWUgaXMgcHJlcGVuZGVkIHRvIHRoZSBlcnJvci5cbiAgLy9cbiAgLy8gUGxlYXNlIG5vdGUgdGhhdCB0aGUgb3B0aW9ucyBhcmUgYWxzbyBwYXNzZWQgdG8gZWFjaCB2YWxpZGF0b3IuXG4gIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2Lm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKVxuICAgICAgLCBhdHRyXG4gICAgICAsIHZhbGlkYXRvcjtcblxuICAgIGZvciAoYXR0ciBpbiByZXN1bHRzKSB7XG4gICAgICBmb3IgKHZhbGlkYXRvciBpbiByZXN1bHRzW2F0dHJdKSB7XG4gICAgICAgIGlmICh2LmlzUHJvbWlzZShyZXN1bHRzW2F0dHJdW3ZhbGlkYXRvcl0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVXNlIHZhbGlkYXRlLmFzeW5jIGlmIHlvdSB3YW50IHN1cHBvcnQgZm9yIHByb21pc2VzXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0ZS5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gIH07XG5cbiAgdmFyIHYgPSB2YWxpZGF0ZTtcblxuICAvLyBDb3BpZXMgb3ZlciBhdHRyaWJ1dGVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlcyB0byBhIHNpbmdsZSBkZXN0aW5hdGlvbi5cbiAgLy8gVmVyeSBtdWNoIHNpbWlsYXIgdG8gdW5kZXJzY29yZSdzIGV4dGVuZC5cbiAgLy8gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSB0YXJnZXQgb2JqZWN0IGFuZCB0aGUgcmVtYWluaW5nIGFyZ3VtZW50cyB3aWxsIGJlXG4gIC8vIHVzZWQgYXMgdGFyZ2V0cy5cbiAgdi5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIGF0dHIgaW4gc291cmNlKSB7XG4gICAgICAgIG9ialthdHRyXSA9IHNvdXJjZVthdHRyXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIHYuZXh0ZW5kKHZhbGlkYXRlLCB7XG4gICAgLy8gVGhpcyBpcyB0aGUgdmVyc2lvbiBvZiB0aGUgbGlicmFyeSBhcyBhIHNlbXZlci5cbiAgICAvLyBUaGUgdG9TdHJpbmcgZnVuY3Rpb24gd2lsbCBhbGxvdyBpdCB0byBiZSBjb2VyY2VkIGludG8gYSBzdHJpbmdcbiAgICB2ZXJzaW9uOiB7XG4gICAgICBtYWpvcjogMCxcbiAgICAgIG1pbm9yOiA3LFxuICAgICAgcGF0Y2g6IDEsXG4gICAgICBtZXRhZGF0YTogbnVsbCxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZlcnNpb24gPSB2LmZvcm1hdChcIiV7bWFqb3J9LiV7bWlub3J9LiV7cGF0Y2h9XCIsIHYudmVyc2lvbik7XG4gICAgICAgIGlmICghdi5pc0VtcHR5KHYudmVyc2lvbi5tZXRhZGF0YSkpIHtcbiAgICAgICAgICB2ZXJzaW9uICs9IFwiK1wiICsgdi52ZXJzaW9uLm1ldGFkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBCZWxvdyBpcyB0aGUgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIHVzZWQgaW4gdmFsaWRhdGUuanNcblxuICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgUHJvbWlzZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAvLyBJZiB5b3UgYXJlIHVzaW5nIFEuanMsIFJTVlAgb3IgYW55IG90aGVyIEErIGNvbXBhdGlibGUgaW1wbGVtZW50YXRpb25cbiAgICAvLyBvdmVycmlkZSB0aGlzIGF0dHJpYnV0ZSB0byBiZSB0aGUgY29uc3RydWN0b3Igb2YgdGhhdCBwcm9taXNlLlxuICAgIC8vIFNpbmNlIGpRdWVyeSBwcm9taXNlcyBhcmVuJ3QgQSsgY29tcGF0aWJsZSB0aGV5IHdvbid0IHdvcmsuXG4gICAgUHJvbWlzZTogdHlwZW9mIFByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgPyBQcm9taXNlIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIC8vIElmIG1vbWVudCBpcyB1c2VkIGluIG5vZGUsIGJyb3dzZXJpZnkgZXRjIHBsZWFzZSBzZXQgdGhpcyBhdHRyaWJ1dGVcbiAgICAvLyBsaWtlIHRoaXM6IGB2YWxpZGF0ZS5tb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuICAgIG1vbWVudDogdHlwZW9mIG1vbWVudCAhPT0gXCJ1bmRlZmluZWRcIiA/IG1vbWVudCA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBYRGF0ZTogdHlwZW9mIFhEYXRlICE9PSBcInVuZGVmaW5lZFwiID8gWERhdGUgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgRU1QVFlfU1RSSU5HX1JFR0VYUDogL15cXHMqJC8sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMgb2JqZWN0LlxuICAgIC8vIFdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBmb3JtYXQ6XG4gICAgLy8gICAgIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGUgbmFtZT5cIiwgZXJyb3I6IFwiPHZhbGlkYXRpb24gcmVzdWx0PlwifSwgLi4uXVxuICAgIHJ1blZhbGlkYXRpb25zOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXVxuICAgICAgICAsIGF0dHJcbiAgICAgICAgLCB2YWxpZGF0b3JOYW1lXG4gICAgICAgICwgdmFsdWVcbiAgICAgICAgLCB2YWxpZGF0b3JzXG4gICAgICAgICwgdmFsaWRhdG9yXG4gICAgICAgICwgdmFsaWRhdG9yT3B0aW9uc1xuICAgICAgICAsIGVycm9yO1xuXG4gICAgICBpZiAodi5pc0RvbUVsZW1lbnQoYXR0cmlidXRlcykpIHtcbiAgICAgICAgYXR0cmlidXRlcyA9IHYuY29sbGVjdEZvcm1WYWx1ZXMoYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIExvb3BzIHRocm91Z2ggZWFjaCBjb25zdHJhaW50cywgZmluZHMgdGhlIGNvcnJlY3QgdmFsaWRhdG9yIGFuZCBydW4gaXQuXG4gICAgICBmb3IgKGF0dHIgaW4gY29uc3RyYWludHMpIHtcbiAgICAgICAgdmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBhdHRyKTtcbiAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIGNvbnN0cmFpbnRzIGZvciBhbiBhdHRyaWJ1dGUgdG8gYmUgYSBmdW5jdGlvbi5cbiAgICAgICAgLy8gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgIHZhbGlkYXRvcnMgPSB2LnJlc3VsdChjb25zdHJhaW50c1thdHRyXSwgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcblxuICAgICAgICBmb3IgKHZhbGlkYXRvck5hbWUgaW4gdmFsaWRhdG9ycykge1xuICAgICAgICAgIHZhbGlkYXRvciA9IHYudmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcblxuICAgICAgICAgIGlmICghdmFsaWRhdG9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IHYuZm9ybWF0KFwiVW5rbm93biB2YWxpZGF0b3IgJXtuYW1lfVwiLCB7bmFtZTogdmFsaWRhdG9yTmFtZX0pO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcbiAgICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgb3B0aW9ucyB0byBiZSBhIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gd2lsbCBiZVxuICAgICAgICAgIC8vIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2LnJlc3VsdCh2YWxpZGF0b3JPcHRpb25zLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuICAgICAgICAgIGlmICghdmFsaWRhdG9yT3B0aW9ucykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBhdHRyaWJ1dGU6IGF0dHIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvck5hbWUsXG4gICAgICAgICAgICBvcHRpb25zOiB2YWxpZGF0b3JPcHRpb25zLFxuICAgICAgICAgICAgZXJyb3I6IHZhbGlkYXRvci5jYWxsKHZhbGlkYXRvciwgdmFsdWUsIHZhbGlkYXRvck9wdGlvbnMsIGF0dHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9LFxuXG4gICAgLy8gVGFrZXMgdGhlIG91dHB1dCBmcm9tIHJ1blZhbGlkYXRpb25zIGFuZCBjb252ZXJ0cyBpdCB0byB0aGUgY29ycmVjdFxuICAgIC8vIG91dHB1dCBmb3JtYXQuXG4gICAgcHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICBlcnJvcnMgPSB2LnBydW5lRW1wdHlFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuZXhwYW5kTXVsdGlwbGVFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuY29udmVydEVycm9yTWVzc2FnZXMoZXJyb3JzLCBvcHRpb25zKTtcblxuICAgICAgc3dpdGNoIChvcHRpb25zLmZvcm1hdCB8fCBcImdyb3VwZWRcIikge1xuICAgICAgICBjYXNlIFwiZGV0YWlsZWRcIjpcbiAgICAgICAgICAvLyBEbyBub3RoaW5nIG1vcmUgdG8gdGhlIGVycm9yc1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJmbGF0XCI6XG4gICAgICAgICAgZXJyb3JzID0gdi5mbGF0dGVuRXJyb3JzVG9BcnJheShlcnJvcnMpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJncm91cGVkXCI6XG4gICAgICAgICAgZXJyb3JzID0gdi5ncm91cEVycm9yc0J5QXR0cmlidXRlKGVycm9ycyk7XG4gICAgICAgICAgZm9yIChhdHRyIGluIGVycm9ycykge1xuICAgICAgICAgICAgZXJyb3JzW2F0dHJdID0gdi5mbGF0dGVuRXJyb3JzVG9BcnJheShlcnJvcnNbYXR0cl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcih2LmZvcm1hdChcIlVua25vd24gZm9ybWF0ICV7Zm9ybWF0fVwiLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2LmlzRW1wdHkoZXJyb3JzKSA/IHVuZGVmaW5lZCA6IGVycm9ycztcbiAgICB9LFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdGlvbnMgd2l0aCBzdXBwb3J0IGZvciBwcm9taXNlcy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgd2hlbiBhbGwgdGhlXG4gICAgLy8gdmFsaWRhdGlvbiBwcm9taXNlcyBoYXZlIGJlZW4gY29tcGxldGVkLlxuICAgIC8vIEl0IGNhbiBiZSBjYWxsZWQgZXZlbiBpZiBubyB2YWxpZGF0aW9ucyByZXR1cm5lZCBhIHByb21pc2UuXG4gICAgYXN5bmM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuYXN5bmMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdi53YWl0Rm9yUmVzdWx0cyhyZXN1bHRzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBlcnJvcnMgPSB2LnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzaW5nbGU6IGZ1bmN0aW9uKHZhbHVlLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LnNpbmdsZS5vcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgIGZvcm1hdDogXCJmbGF0XCIsXG4gICAgICAgIGZ1bGxNZXNzYWdlczogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHYoe3NpbmdsZTogdmFsdWV9LCB7c2luZ2xlOiBjb25zdHJhaW50c30sIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gYWxsIHByb21pc2VzIGluIHRoZSByZXN1bHRzIGFycmF5XG4gICAgLy8gYXJlIHNldHRsZWQuIFRoZSBwcm9taXNlIHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbiBpcyBhbHdheXMgcmVzb2x2ZWQsXG4gICAgLy8gbmV2ZXIgcmVqZWN0ZWQuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBtb2RpZmllcyB0aGUgaW5wdXQgYXJndW1lbnQsIGl0IHJlcGxhY2VzIHRoZSBwcm9taXNlc1xuICAgIC8vIHdpdGggdGhlIHZhbHVlIHJldHVybmVkIGZyb20gdGhlIHByb21pc2UuXG4gICAgd2FpdEZvclJlc3VsdHM6IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgIC8vIENyZWF0ZSBhIHNlcXVlbmNlIG9mIGFsbCB0aGUgcmVzdWx0cyBzdGFydGluZyB3aXRoIGEgcmVzb2x2ZWQgcHJvbWlzZS5cbiAgICAgIHJldHVybiByZXN1bHRzLnJlZHVjZShmdW5jdGlvbihtZW1vLCByZXN1bHQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyByZXN1bHQgaXNuJ3QgYSBwcm9taXNlIHNraXAgaXQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICBpZiAoIXYuaXNQcm9taXNlKHJlc3VsdC5lcnJvcikpIHtcbiAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZW1vLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5lcnJvci50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgLy8gSWYgZm9yIHNvbWUgcmVhc29uIHRoZSB2YWxpZGF0b3IgcHJvbWlzZSB3YXMgcmVqZWN0ZWQgYnV0IG5vXG4gICAgICAgICAgICAgIC8vIGVycm9yIHdhcyBzcGVjaWZpZWQuXG4gICAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB2Lndhcm4oXCJWYWxpZGF0b3IgcHJvbWlzZSB3YXMgcmVqZWN0ZWQgYnV0IGRpZG4ndCByZXR1cm4gYW4gZXJyb3JcIik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyKSB7IHIoKTsgfSkpOyAvLyBBIHJlc29sdmVkIHByb21pc2VcbiAgICB9LFxuXG4gICAgLy8gSWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgY2FsbDogZnVuY3Rpb24gdGhlIGFuZDogZnVuY3Rpb24gcmV0dXJuIHRoZSB2YWx1ZVxuICAgIC8vIG90aGVyd2lzZSBqdXN0IHJldHVybiB0aGUgdmFsdWUuIEFkZGl0aW9uYWwgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzXG4gICAgLy8gYXJndW1lbnRzIHRvIHRoZSBmdW5jdGlvbi5cbiAgICAvLyBFeGFtcGxlOlxuICAgIC8vIGBgYFxuICAgIC8vIHJlc3VsdCgnZm9vJykgLy8gJ2ZvbydcbiAgICAvLyByZXN1bHQoTWF0aC5tYXgsIDEsIDIpIC8vIDJcbiAgICAvLyBgYGBcbiAgICByZXN1bHQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIG51bWJlci4gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBjb25zaWRlciBOYU4gYVxuICAgIC8vIG51bWJlciBsaWtlIG1hbnkgb3RoZXIgYGlzTnVtYmVyYCBmdW5jdGlvbnMgZG8uXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgbm90IGEgZnVuY3Rpb25cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9LFxuXG4gICAgLy8gQSBzaW1wbGUgY2hlY2sgdG8gdmVyaWZ5IHRoYXQgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIuIFVzZXMgYGlzTnVtYmVyYFxuICAgIC8vIGFuZCBhIHNpbXBsZSBtb2R1bG8gY2hlY2suXG4gICAgaXNJbnRlZ2VyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYuaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlICUgMSA9PT0gMDtcbiAgICB9LFxuXG4gICAgLy8gVXNlcyB0aGUgYE9iamVjdGAgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGFuIG9iamVjdC5cbiAgICBpc09iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgICB9LFxuXG4gICAgLy8gU2ltcGx5IGNoZWNrcyBpZiB0aGUgb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGEgZGF0ZVxuICAgIGlzRGF0ZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIGBudWxsYCBvZiBgdW5kZWZpbmVkYFxuICAgIGlzRGVmaW5lZDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIG9iaiAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgcHJvbWlzZS4gQW55dGhpbmcgd2l0aCBhIGB0aGVuYFxuICAgIC8vIGZ1bmN0aW9uIGlzIGNvbnNpZGVyZWQgYSBwcm9taXNlLlxuICAgIGlzUHJvbWlzZTogZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuICEhcCAmJiB2LmlzRnVuY3Rpb24ocC50aGVuKTtcbiAgICB9LFxuXG4gICAgaXNEb21FbGVtZW50OiBmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoIW8pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3JBbGwpIHx8ICF2LmlzRnVuY3Rpb24oby5xdWVyeVNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KGRvY3VtZW50KSAmJiBvID09PSBkb2N1bWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzg0MzgwLzY5OTMwNFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvICYmXG4gICAgICAgICAgdHlwZW9mIG8gPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICBvICE9PSBudWxsICYmXG4gICAgICAgICAgby5ub2RlVHlwZSA9PT0gMSAmJlxuICAgICAgICAgIHR5cGVvZiBvLm5vZGVOYW1lID09PSBcInN0cmluZ1wiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIC8vIE51bGwgYW5kIHVuZGVmaW5lZCBhcmUgZW1wdHlcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBmdW5jdGlvbnMgYXJlIG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBXaGl0ZXNwYWNlIG9ubHkgc3RyaW5ncyBhcmUgZW1wdHlcbiAgICAgIGlmICh2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdi5FTVBUWV9TVFJJTkdfUkVHRVhQLnRlc3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgYXJyYXlzIHdlIHVzZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICBpZiAodi5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID09PSAwO1xuICAgICAgfVxuXG4gICAgICAvLyBEYXRlcyBoYXZlIG5vIGF0dHJpYnV0ZXMgYnV0IGFyZW4ndCBlbXB0eVxuICAgICAgaWYgKHYuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIGZpbmQgYXQgbGVhc3Qgb25lIHByb3BlcnR5IHdlIGNvbnNpZGVyIGl0IG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIGZvciAoYXR0ciBpbiB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBGb3JtYXRzIHRoZSBzcGVjaWZpZWQgc3RyaW5ncyB3aXRoIHRoZSBnaXZlbiB2YWx1ZXMgbGlrZSBzbzpcbiAgICAvLyBgYGBcbiAgICAvLyBmb3JtYXQoXCJGb286ICV7Zm9vfVwiLCB7Zm9vOiBcImJhclwifSkgLy8gXCJGb28gYmFyXCJcbiAgICAvLyBgYGBcbiAgICAvLyBJZiB5b3Ugd2FudCB0byB3cml0ZSAley4uLn0gd2l0aG91dCBoYXZpbmcgaXQgcmVwbGFjZWQgc2ltcGx5XG4gICAgLy8gcHJlZml4IGl0IHdpdGggJSBsaWtlIHRoaXMgYEZvbzogJSV7Zm9vfWAgYW5kIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBhcyBgXCJGb286ICV7Zm9vfVwiYFxuICAgIGZvcm1hdDogdi5leHRlbmQoZnVuY3Rpb24oc3RyLCB2YWxzKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2Uodi5mb3JtYXQuRk9STUFUX1JFR0VYUCwgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICBpZiAobTEgPT09ICclJykge1xuICAgICAgICAgIHJldHVybiBcIiV7XCIgKyBtMiArIFwifVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsc1ttMl0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCB7XG4gICAgICAvLyBGaW5kcyAle2tleX0gc3R5bGUgcGF0dGVybnMgaW4gdGhlIGdpdmVuIHN0cmluZ1xuICAgICAgRk9STUFUX1JFR0VYUDogLyglPyklXFx7KFteXFx9XSspXFx9L2dcbiAgICB9KSxcblxuICAgIC8vIFwiUHJldHRpZmllc1wiIHRoZSBnaXZlbiBzdHJpbmcuXG4gICAgLy8gUHJldHRpZnlpbmcgbWVhbnMgcmVwbGFjaW5nIFsuXFxfLV0gd2l0aCBzcGFjZXMgYXMgd2VsbCBhcyBzcGxpdHRpbmdcbiAgICAvLyBjYW1lbCBjYXNlIHdvcmRzLlxuICAgIHByZXR0aWZ5OiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICh2LmlzTnVtYmVyKHN0cikpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAyIGRlY2ltYWxzIHJvdW5kIGl0IHRvIHR3b1xuICAgICAgICBpZiAoKHN0ciAqIDEwMCkgJSAxID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBzdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoTWF0aC5yb3VuZChzdHIgKiAxMDApIC8gMTAwKS50b0ZpeGVkKDIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzQXJyYXkoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLm1hcChmdW5jdGlvbihzKSB7IHJldHVybiB2LnByZXR0aWZ5KHMpOyB9KS5qb2luKFwiLCBcIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci50b1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICAvLyBFbnN1cmUgdGhlIHN0cmluZyBpcyBhY3R1YWxseSBhIHN0cmluZ1xuICAgICAgc3RyID0gXCJcIiArIHN0cjtcblxuICAgICAgcmV0dXJuIHN0clxuICAgICAgICAvLyBTcGxpdHMga2V5cyBzZXBhcmF0ZWQgYnkgcGVyaW9kc1xuICAgICAgICAucmVwbGFjZSgvKFteXFxzXSlcXC4oW15cXHNdKS9nLCAnJDEgJDInKVxuICAgICAgICAvLyBSZW1vdmVzIGJhY2tzbGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcKy9nLCAnJylcbiAgICAgICAgLy8gUmVwbGFjZXMgLSBhbmQgLSB3aXRoIHNwYWNlXG4gICAgICAgIC5yZXBsYWNlKC9bXy1dL2csICcgJylcbiAgICAgICAgLy8gU3BsaXRzIGNhbWVsIGNhc2VkIHdvcmRzXG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBtMSArIFwiIFwiICsgbTIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuICAgIHN0cmluZ2lmeVZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYucHJldHRpZnkodmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24ob2JqLCB2YWx1ZSkge1xuICAgICAgaWYgKCF2LmlzRGVmaW5lZChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZSBpbiBvYmo7XG4gICAgfSxcblxuICAgIGdldERlZXBPYmplY3RWYWx1ZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoKSB7XG4gICAgICBpZiAoIXYuaXNPYmplY3Qob2JqKSB8fCAhdi5pc1N0cmluZyhrZXlwYXRoKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5ID0gXCJcIlxuICAgICAgICAsIGlcbiAgICAgICAgLCBlc2NhcGUgPSBmYWxzZTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGtleXBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3dpdGNoIChrZXlwYXRoW2ldKSB7XG4gICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJy4nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgIG9iaiA9IG9ialtrZXldO1xuICAgICAgICAgICAgICBrZXkgPSBcIlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnXFxcXCc6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJ1xcXFwnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAga2V5ICs9IGtleXBhdGhbaV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodi5pc0RlZmluZWQob2JqKSAmJiBrZXkgaW4gb2JqKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFRoaXMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHZhbHVlcyBvZiB0aGUgZm9ybS5cbiAgICAvLyBJdCB1c2VzIHRoZSBpbnB1dCBuYW1lIGFzIGtleSBhbmQgdGhlIHZhbHVlIGFzIHZhbHVlXG4gICAgLy8gU28gZm9yIGV4YW1wbGUgdGhpczpcbiAgICAvLyA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZW1haWxcIiB2YWx1ZT1cImZvb0BiYXIuY29tXCIgLz5cbiAgICAvLyB3b3VsZCByZXR1cm46XG4gICAgLy8ge2VtYWlsOiBcImZvb0BiYXIuY29tXCJ9XG4gICAgY29sbGVjdEZvcm1WYWx1ZXM6IGZ1bmN0aW9uKGZvcm0sIG9wdGlvbnMpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSB7fVxuICAgICAgICAsIGlcbiAgICAgICAgLCBpbnB1dFxuICAgICAgICAsIGlucHV0c1xuICAgICAgICAsIHZhbHVlO1xuXG4gICAgICBpZiAoIWZvcm0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZChpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlnbm9yZWRcIikpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoaW5wdXQudmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgICAgIGlmIChpbnB1dC5hdHRyaWJ1dGVzLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBpbnB1dC5jaGVja2VkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2lucHV0Lm5hbWVdIHx8IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhbHVlc1tpbnB1dC5uYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWxlY3RbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC5vcHRpb25zW2lucHV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfSxcblxuICAgIHNhbml0aXplRm9ybVZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMudHJpbSAmJiB2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubnVsbGlmeSAhPT0gZmFsc2UgJiYgdmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKCF2LmlzU3RyaW5nKHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIGFsbCBlcnJvcnMgd2hvJ3MgZXJyb3IgYXR0cmlidXRlIGlzIGVtcHR5IChudWxsIG9yIHVuZGVmaW5lZClcbiAgICBwcnVuZUVtcHR5RXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMuZmlsdGVyKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAhdi5pc0VtcHR5KGVycm9yLmVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBJblxuICAgIC8vIFt7ZXJyb3I6IFtcImVycjFcIiwgXCJlcnIyXCJdLCAuLi59XVxuICAgIC8vIE91dFxuICAgIC8vIFt7ZXJyb3I6IFwiZXJyMVwiLCAuLi59LCB7ZXJyb3I6IFwiZXJyMlwiLCAuLi59XVxuICAgIC8vXG4gICAgLy8gQWxsIGF0dHJpYnV0ZXMgaW4gYW4gZXJyb3Igd2l0aCBtdWx0aXBsZSBtZXNzYWdlcyBhcmUgZHVwbGljYXRlZFxuICAgIC8vIHdoZW4gZXhwYW5kaW5nIHRoZSBlcnJvcnMuXG4gICAgZXhwYW5kTXVsdGlwbGVFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgLy8gUmVtb3ZlcyBlcnJvcnMgd2l0aG91dCBhIG1lc3NhZ2VcbiAgICAgICAgaWYgKHYuaXNBcnJheShlcnJvci5lcnJvcikpIHtcbiAgICAgICAgICBlcnJvci5lcnJvci5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9yLCB7ZXJyb3I6IG1zZ30pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXQucHVzaChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydHMgdGhlIGVycm9yIG1lc2FnZXMgYnkgcHJlcGVuZGluZyB0aGUgYXR0cmlidXRlIG5hbWUgdW5sZXNzIHRoZVxuICAgIC8vIG1lc3NhZ2UgaXMgcHJlZml4ZWQgYnkgXlxuICAgIGNvbnZlcnRFcnJvck1lc3NhZ2VzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvckluZm8pIHtcbiAgICAgICAgdmFyIGVycm9yID0gZXJyb3JJbmZvLmVycm9yO1xuXG4gICAgICAgIGlmIChlcnJvclswXSA9PT0gJ14nKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvci5zbGljZSgxKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmZ1bGxNZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlcnJvciA9IHYuY2FwaXRhbGl6ZSh2LnByZXR0aWZ5KGVycm9ySW5mby5hdHRyaWJ1dGUpKSArIFwiIFwiICsgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSBlcnJvci5yZXBsYWNlKC9cXFxcXFxeL2csIFwiXlwiKTtcbiAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChlcnJvciwge3ZhbHVlOiB2LnN0cmluZ2lmeVZhbHVlKGVycm9ySW5mby52YWx1ZSl9KTtcbiAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9ySW5mbywge2Vycm9yOiBlcnJvcn0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIHtcIjxhdHRyaWJ1dGVOYW1lPlwiOiBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV19XG4gICAgZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0ge307XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICB2YXIgbGlzdCA9IHJldFtlcnJvci5hdHRyaWJ1dGVdO1xuICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgIGxpc3QucHVzaChlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0W2Vycm9yLmF0dHJpYnV0ZV0gPSBbZXJyb3JdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7ZXJyb3I6IFwiPG1lc3NhZ2UgMT5cIiwgLi4ufSwge2Vycm9yOiBcIjxtZXNzYWdlIDI+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIFtcIjxtZXNzYWdlIDE+XCIsIFwiPG1lc3NhZ2UgMj5cIl1cbiAgICBmbGF0dGVuRXJyb3JzVG9BcnJheTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzLm1hcChmdW5jdGlvbihlcnJvcikgeyByZXR1cm4gZXJyb3IuZXJyb3I7IH0pO1xuICAgIH0sXG5cbiAgICBleHBvc2VNb2R1bGU6IGZ1bmN0aW9uKHZhbGlkYXRlLCByb290LCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICAgICAgaWYgKGV4cG9ydHMpIHtcbiAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRlO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHMudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgICAgaWYgKHZhbGlkYXRlLmlzRnVuY3Rpb24oZGVmaW5lKSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWxpZGF0ZTsgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2FybjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2Fybihtc2cpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlcnJvcjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB2YWxpZGF0ZS52YWxpZGF0b3JzID0ge1xuICAgIC8vIFByZXNlbmNlIHZhbGlkYXRlcyB0aGF0IHRoZSB2YWx1ZSBpc24ndCBlbXB0eVxuICAgIHByZXNlbmNlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJjYW4ndCBiZSBibGFua1wiO1xuICAgICAgfVxuICAgIH0sXG4gICAgbGVuZ3RoOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgaXMgPSBvcHRpb25zLmlzXG4gICAgICAgICwgbWF4aW11bSA9IG9wdGlvbnMubWF4aW11bVxuICAgICAgICAsIG1pbmltdW0gPSBvcHRpb25zLm1pbmltdW1cbiAgICAgICAgLCB0b2tlbml6ZXIgPSBvcHRpb25zLnRva2VuaXplciB8fCBmdW5jdGlvbih2YWwpIHsgcmV0dXJuIHZhbDsgfVxuICAgICAgICAsIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdO1xuXG4gICAgICB2YWx1ZSA9IHRva2VuaXplcih2YWx1ZSk7XG4gICAgICB2YXIgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgaWYoIXYuaXNOdW1iZXIobGVuZ3RoKSkge1xuICAgICAgICB2LmVycm9yKHYuZm9ybWF0KFwiQXR0cmlidXRlICV7YXR0cn0gaGFzIGEgbm9uIG51bWVyaWMgdmFsdWUgZm9yIGBsZW5ndGhgXCIsIHthdHRyOiBhdHRyaWJ1dGV9KSk7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImhhcyBhbiBpbmNvcnJlY3QgbGVuZ3RoXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIElzIGNoZWNrc1xuICAgICAgaWYgKHYuaXNOdW1iZXIoaXMpICYmIGxlbmd0aCAhPT0gaXMpIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIHRoaXMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICBcImlzIHRoZSB3cm9uZyBsZW5ndGggKHNob3VsZCBiZSAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogaXN9KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1pbmltdW0pICYmIGxlbmd0aCA8IG1pbmltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29TaG9ydCB8fFxuICAgICAgICAgIHRoaXMudG9vU2hvcnQgfHxcbiAgICAgICAgICBcImlzIHRvbyBzaG9ydCAobWluaW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWluaW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWF4aW11bSkgJiYgbGVuZ3RoID4gbWF4aW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb0xvbmcgfHxcbiAgICAgICAgICB0aGlzLnRvb0xvbmcgfHxcbiAgICAgICAgICBcImlzIHRvbyBsb25nIChtYXhpbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtYXhpbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBudW1lcmljYWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyb3JzID0gW11cbiAgICAgICAgLCBuYW1lXG4gICAgICAgICwgY291bnRcbiAgICAgICAgLCBjaGVja3MgPSB7XG4gICAgICAgICAgICBncmVhdGVyVGhhbjogICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+IGM7IH0sXG4gICAgICAgICAgICBncmVhdGVyVGhhbk9yRXF1YWxUbzogZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+PSBjOyB9LFxuICAgICAgICAgICAgZXF1YWxUbzogICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPT09IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbjogICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbk9yRXF1YWxUbzogICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8PSBjOyB9XG4gICAgICAgICAgfTtcblxuICAgICAgLy8gQ29lcmNlIHRoZSB2YWx1ZSB0byBhIG51bWJlciB1bmxlc3Mgd2UncmUgYmVpbmcgc3RyaWN0LlxuICAgICAgaWYgKG9wdGlvbnMubm9TdHJpbmdzICE9PSB0cnVlICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdCdzIG5vdCBhIG51bWJlciB3ZSBzaG91bGRuJ3QgY29udGludWUgc2luY2UgaXQgd2lsbCBjb21wYXJlIGl0LlxuICAgICAgaWYgKCF2LmlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJpcyBub3QgYSBudW1iZXJcIjtcbiAgICAgIH1cblxuICAgICAgLy8gU2FtZSBsb2dpYyBhcyBhYm92ZSwgc29ydCBvZi4gRG9uJ3QgYm90aGVyIHdpdGggY29tcGFyaXNvbnMgaWYgdGhpc1xuICAgICAgLy8gZG9lc24ndCBwYXNzLlxuICAgICAgaWYgKG9wdGlvbnMub25seUludGVnZXIgJiYgIXYuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90SW50ZWdlciAgfHwgXCJtdXN0IGJlIGFuIGludGVnZXJcIjtcbiAgICAgIH1cblxuICAgICAgZm9yIChuYW1lIGluIGNoZWNrcykge1xuICAgICAgICBjb3VudCA9IG9wdGlvbnNbbmFtZV07XG4gICAgICAgIGlmICh2LmlzTnVtYmVyKGNvdW50KSAmJiAhY2hlY2tzW25hbWVdKHZhbHVlLCBjb3VudCkpIHtcbiAgICAgICAgICAvLyBUaGlzIHBpY2tzIHRoZSBkZWZhdWx0IG1lc3NhZ2UgaWYgc3BlY2lmaWVkXG4gICAgICAgICAgLy8gRm9yIGV4YW1wbGUgdGhlIGdyZWF0ZXJUaGFuIGNoZWNrIHVzZXMgdGhlIG1lc3NhZ2UgZnJvbVxuICAgICAgICAgIC8vIHRoaXMubm90R3JlYXRlclRoYW4gc28gd2UgY2FwaXRhbGl6ZSB0aGUgbmFtZSBhbmQgcHJlcGVuZCBcIm5vdFwiXG4gICAgICAgICAgdmFyIG1zZyA9IHRoaXNbXCJub3RcIiArIHYuY2FwaXRhbGl6ZShuYW1lKV0gfHxcbiAgICAgICAgICAgIFwibXVzdCBiZSAle3R5cGV9ICV7Y291bnR9XCI7XG5cbiAgICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChtc2csIHtcbiAgICAgICAgICAgIGNvdW50OiBjb3VudCxcbiAgICAgICAgICAgIHR5cGU6IHYucHJldHRpZnkobmFtZSlcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMub2RkICYmIHZhbHVlICUgMiAhPT0gMSkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdE9kZCB8fCBcIm11c3QgYmUgb2RkXCIpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuZXZlbiAmJiB2YWx1ZSAlIDIgIT09IDApIHtcbiAgICAgICAgZXJyb3JzLnB1c2godGhpcy5ub3RFdmVuIHx8IFwibXVzdCBiZSBldmVuXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGV0aW1lOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdXG4gICAgICAgICwgZWFybGllc3QgPSBvcHRpb25zLmVhcmxpZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmVhcmxpZXN0LCBvcHRpb25zKSA6IE5hTlxuICAgICAgICAsIGxhdGVzdCA9IG9wdGlvbnMubGF0ZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmxhdGVzdCwgb3B0aW9ucykgOiBOYU47XG5cbiAgICAgIHZhbHVlID0gdGhpcy5wYXJzZSh2YWx1ZSwgb3B0aW9ucyk7XG5cbiAgICAgIC8vIDg2NDAwMDAwIGlzIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBpbiBhIGRheSwgdGhpcyBpcyB1c2VkIHRvIHJlbW92ZVxuICAgICAgLy8gdGhlIHRpbWUgZnJvbSB0aGUgZGF0ZVxuICAgICAgaWYgKGlzTmFOKHZhbHVlKSB8fCBvcHRpb25zLmRhdGVPbmx5ICYmIHZhbHVlICUgODY0MDAwMDAgIT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwibXVzdCBiZSBhIHZhbGlkIGRhdGVcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihlYXJsaWVzdCkgJiYgdmFsdWUgPCBlYXJsaWVzdCkge1xuICAgICAgICBlcnIgPSB0aGlzLnRvb0Vhcmx5IHx8IFwibXVzdCBiZSBubyBlYXJsaWVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtkYXRlOiB0aGlzLmZvcm1hdChlYXJsaWVzdCwgb3B0aW9ucyl9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihsYXRlc3QpICYmIHZhbHVlID4gbGF0ZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vTGF0ZSB8fCBcIm11c3QgYmUgbm8gbGF0ZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGxhdGVzdCwgb3B0aW9ucyl9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gY29udmVydCBpbnB1dCB0byB0aGUgbnVtYmVyXG4gICAgICAvLyBvZiBtaWxsaXMgc2luY2UgdGhlIGVwb2NoLlxuICAgICAgLy8gSXQgc2hvdWxkIHJldHVybiBOYU4gaWYgaXQncyBub3QgYSB2YWxpZCBkYXRlLlxuICAgICAgcGFyc2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICh2LmlzRnVuY3Rpb24odi5YRGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IHYuWERhdGUodmFsdWUsIHRydWUpLmdldFRpbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICByZXR1cm4gK3YubW9tZW50LnV0Yyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWl0aGVyIFhEYXRlIG9yIG1vbWVudC5qcyB3YXMgZm91bmRcIik7XG4gICAgICB9LFxuICAgICAgLy8gRm9ybWF0cyB0aGUgZ2l2ZW4gdGltZXN0YW1wLiBVc2VzIElTTzg2MDEgdG8gZm9ybWF0IHRoZW0uXG4gICAgICAvLyBJZiBvcHRpb25zLmRhdGVPbmx5IGlzIHRydWUgdGhlbiBvbmx5IHRoZSB5ZWFyLCBtb250aCBhbmQgZGF5IHdpbGwgYmVcbiAgICAgIC8vIG91dHB1dC5cbiAgICAgIGZvcm1hdDogZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgZm9ybWF0ID0gb3B0aW9ucy5kYXRlRm9ybWF0O1xuXG4gICAgICAgIGlmICh2LmlzRnVuY3Rpb24odi5YRGF0ZSkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcInl5eXktTU0tZGRcIiA6IFwieXl5eS1NTS1kZCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gbmV3IFhEYXRlKGRhdGUsIHRydWUpLnRvU3RyaW5nKGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodi5pc0RlZmluZWQodi5tb21lbnQpKSB7XG4gICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IChvcHRpb25zLmRhdGVPbmx5ID8gXCJZWVlZLU1NLUREXCIgOiBcIllZWVktTU0tREQgSEg6bW06c3NcIik7XG4gICAgICAgICAgcmV0dXJuIHYubW9tZW50LnV0YyhkYXRlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH1cbiAgICB9KSxcbiAgICBkYXRlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCBvcHRpb25zLCB7ZGF0ZU9ubHk6IHRydWV9KTtcbiAgICAgIHJldHVybiB2LnZhbGlkYXRvcnMuZGF0ZXRpbWUuY2FsbCh2LnZhbGlkYXRvcnMuZGF0ZXRpbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpIHx8IChvcHRpb25zIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICBvcHRpb25zID0ge3BhdHRlcm46IG9wdGlvbnN9O1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIGludmFsaWRcIlxuICAgICAgICAsIHBhdHRlcm4gPSBvcHRpb25zLnBhdHRlcm5cbiAgICAgICAgLCBtYXRjaDtcblxuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhwYXR0ZXJuKSkge1xuICAgICAgICBwYXR0ZXJuID0gbmV3IFJlZ0V4cChvcHRpb25zLnBhdHRlcm4sIG9wdGlvbnMuZmxhZ3MpO1xuICAgICAgfVxuICAgICAgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWModmFsdWUpO1xuICAgICAgaWYgKCFtYXRjaCB8fCBtYXRjaFswXS5sZW5ndGggIT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5jbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICh2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiXiV7dmFsdWV9IGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgbGlzdFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGV4Y2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAoIXYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJeJXt2YWx1ZX0gaXMgcmVzdHJpY3RlZFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGVtYWlsOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgbm90IGEgdmFsaWQgZW1haWxcIjtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5QQVRURVJOLmV4ZWModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIFBBVFRFUk46IC9eW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2Etel17Mix9JC9pXG4gICAgfSksXG4gICAgZXF1YWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHthdHRyaWJ1dGU6IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiaXMgbm90IGVxdWFsIHRvICV7YXR0cmlidXRlfVwiO1xuXG4gICAgICBpZiAodi5pc0VtcHR5KG9wdGlvbnMuYXR0cmlidXRlKSB8fCAhdi5pc1N0cmluZyhvcHRpb25zLmF0dHJpYnV0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGF0dHJpYnV0ZSBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG90aGVyVmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBvcHRpb25zLmF0dHJpYnV0ZSlcbiAgICAgICAgLCBjb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yIHx8IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgICAgIHJldHVybiB2MSA9PT0gdjI7XG4gICAgICAgIH07XG5cbiAgICAgIGlmICghY29tcGFyYXRvcih2YWx1ZSwgb3RoZXJWYWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzKSkge1xuICAgICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge2F0dHJpYnV0ZTogdi5wcmV0dGlmeShvcHRpb25zLmF0dHJpYnV0ZSl9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFsaWRhdGUuZXhwb3NlTW9kdWxlKHZhbGlkYXRlLCB0aGlzLCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSk7XG59KS5jYWxsKHRoaXMsXG4gICAgICAgIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGV4cG9ydHMgOiBudWxsLFxuICAgICAgICB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG1vZHVsZSA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZGVmaW5lIDogbnVsbCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzXG4gKiogbW9kdWxlIGlkID0gODBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1XG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpOyB9O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSA4MVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDVcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIFEgPSByZXF1aXJlKCdxJyksXHJcbiAgICAgICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxyXG4gICAgICAgIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpLFxyXG4gICAgICAgIHZhbGlkYXRlID0gcmVxdWlyZSgndmFsaWRhdGUnKVxyXG5cclxuICAgICAgICA7XHJcblxyXG52YXIgU3RvcmUgPSByZXF1aXJlKCdjb3JlL3N0b3JlJyk7XHJcblxyXG52YXIgTXlib29raW5nRGF0YSA9IFN0b3JlLmV4dGVuZCh7XHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIHByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF8ucmVkdWNlKHRoaXMuZ2V0KCcgJykpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlZnJlc2hDdXJyZW50Q2FydDogZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hDdXJyZW50Q2FydFwiKTtcclxuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QsIHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Q2FydERldGFpbHMvJyArIF8ucGFyc2VJbnQodmlldy5nZXQoJ2N1cnJlbnRDYXJ0SWQnKSksXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHVwY29taW5nOiBkYXRhLnVwY29taW5nLCBjcmVhdGVkOiBkYXRhLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBkYXRhLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogZGF0YS5ib29raW5nX3N0YXR1cyxib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjdXJyZW50Q2FydERldGFpbHMnLCBkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBfLmZpbmRJbmRleCh2aWV3LmdldCgnY2FydHMnKSwgeydpZCc6IGRldGFpbHMuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXg6ICcraW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FydHMgPSB2aWV3LmdldCgnY2FydHMnKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJ0c1tpbmRleF0uYm9va2luZ19zdGF0dXMgPSBkZXRhaWxzLmJvb2tpbmdfc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjYXJ0cycsIGNhcnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluc2loZWQgc3RvcmU6ICcpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbk15Ym9va2luZ0RhdGEuZ2V0Q3VycmVudENhcnQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgLy8gY29uc29sZS5sb2coXCJnZXRDdXJyZW50Q2FydFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9nZXRDYXJ0RGV0YWlscy8nICsgXy5wYXJzZUludChpZCksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkb25lXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdmFyIGRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgIGlkOiBkYXRhLmlkLCBlbWFpbDpkYXRhLmVtYWlsLHRpY2tldHN0YXR1c21zZzpkYXRhLnRpY2tldHN0YXR1c21zZyx1cGNvbWluZzogZGF0YS51cGNvbWluZywgY3JlYXRlZDogZGF0YS5jcmVhdGVkLCB0b3RhbEFtb3VudDogZGF0YS50b3RhbEFtb3VudCwgYm9va2luZ19zdGF0dXM6IGRhdGEuYm9va2luZ19zdGF0dXMsY2xpZW50U291cmNlSWQ6ZGF0YS5jbGllbnRTb3VyY2VJZCxzZWdOaWdodHM6ZGF0YS5zZWdOaWdodHMsXHJcbiAgICAgICAgICAgIGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LCBjdXJlbmN5OiBkYXRhLmN1cmVuY3ksZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLFxyXG4gICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgb3JpZ2luOiB0Lm9yaWdpbiwgb3JpZ2luRGV0YWlsczogdC5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSksIH07XHJcbiAgICAgICAgZGF0YS5jdXJyZW50Q2FydERldGFpbHM9IGRldGFpbHM7XHJcbiAgICAgICAgZGF0YS5jYXJ0cz1bXTtcclxuICAgICAgICBkYXRhLmNhcnRzLnB1c2goZGV0YWlscyk7XHJcbiAgICAgICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gZGV0YWlscy5pZDtcclxuIC8vICAgY29uc29sZS5sb2coZGF0YS5jdXJyZW50Q2FydERldGFpbHMpO1xyXG4gICAgZGF0YS5zdW1tYXJ5ID0gZmFsc2U7XHJcbiAgICBkYXRhLnByaW50ID0gZmFsc2U7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSBmYWxzZTtcclxuICAgIGRhdGEuYW1lbmQgPSBmYWxzZTtcclxuICAgIGRhdGEuY2FuY2VsID0gZmFsc2U7XHJcbiAgICBkYXRhLnJlc2NoZWR1bGUgPSBmYWxzZTtcclxuICAgXHJcbiAgICBkYXRhLmVycm9ycyA9IHt9O1xyXG4gICAgZGF0YS5yZXN1bHRzID0gW107XHJcblxyXG4gICAgZGF0YS5maWx0ZXIgPSB7fTtcclxuICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuICAgIHJldHVybiByZXNvbHZlKG5ldyBNeWJvb2tpbmdEYXRhKHtkYXRhOiBkYXRhfSkpO1xyXG5cclxuICAgICAgICBcclxuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH0pXHJcbiAgICB9KTtcclxufTtcclxuXHJcbk15Ym9va2luZ0RhdGEucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIk15Ym9va2luZ0RhdGEucGFyc2VcIik7XHJcbiAgICAvL2RhdGEuZmxpZ2h0cyA9IF8ubWFwKGRhdGEuZmxpZ2h0cywgZnVuY3Rpb24oaSkgeyByZXR1cm4gRmxpZ2h0LnBhcnNlKGkpOyB9KTtcclxuICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7ICAgXHJcbiAgICB2YXIgZmxnVXBjb21pbmcgPSBmYWxzZTtcclxuICAgIHZhciBmbGdQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYXJ0cyA9IF8ubWFwKGRhdGEsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgaWYgKGkudXBjb21pbmcgPT0gJ3RydWUnKVxyXG4gICAgICAgICAgICBmbGdVcGNvbWluZyA9IHRydWU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmbGdQcmV2aW91cyA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHtpZDogaS5pZCxlbWFpbDppLmVtYWlsLCBjcmVhdGVkOiBpLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBpLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogaS5ib29raW5nX3N0YXR1cyxcclxuICAgICAgICAgICAgcmV0dXJuZGF0ZTogaS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogaS5pc011bHRpQ2l0eSwgY3VyZW5jeTogaS5jdXJlbmN5LCB1cGNvbWluZzogaS51cGNvbWluZyxcclxuICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGkuYm9va2luZ3MsIGZ1bmN0aW9uIChiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogYi5pZCwgc291cmNlOiBiLnNvdXJjZSwgZGVzdGluYXRpb246IGIuZGVzdGluYXRpb24sIHNvdXJjZV9pZDogYi5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBiLmRlc3RpbmF0aW9uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydHVyZTogYi5kZXBhcnR1cmUsIGFycml2YWw6IGIuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxlcnM6IF8ubWFwKGIudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiB0LmlkLCBuYW1lOiB0Lm5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0cmF2ZWxlcjogXy5tYXAoaS50cmF2ZWxsZXJkdGwsIGZ1bmN0aW9uIChqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBqLmlkLCBuYW1lOiBqLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBfLm1hcChqLnNyYywgZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBnfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBkZXN0OiBfLm1hcChqLmRlc3QsIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZTogZ307XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLmNhcnRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICBpZiAoeC5pZCA8IHkuaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG5cclxuICAgIH0pO1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmNhcnRzKTsgIFxyXG4gICAgLy8gICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVyPSBfLmZpcnN0KGRhdGEudHJhdmVsbGVycyk7XHJcbiAgICAvLyAgICAgICAgICAgZGF0YS5jdXJyZW50VHJhdmVsbGVySWQ9ZGF0YS5jdXJyZW50VHJhdmVsbGVyLmlkO1xyXG4gICAgZGF0YS5jYWJpblR5cGUgPSAxO1xyXG4gICAgZGF0YS5hZGQgPSBmYWxzZTtcclxuICAgIGRhdGEuZWRpdCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydElkID0gbnVsbDtcclxuICAgIGRhdGEuY3VycmVudENhcnREZXRhaWxzID0gbnVsbDtcclxuICAgIGRhdGEuc3VtbWFyeSA9IHRydWU7XHJcbiAgICBkYXRhLnBlbmRpbmcgPSB0cnVlO1xyXG4gICAgZGF0YS5hbWVuZCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYW5jZWwgPSBmYWxzZTtcclxuICAgIGRhdGEucHJpbnQgPSBmYWxzZTtcclxuICAgIGRhdGEucmVzY2hlZHVsZSA9IGZhbHNlO1xyXG4gICAgZGF0YS5mbGdVcGNvbWluZyA9IGZsZ1VwY29taW5nO1xyXG4gICAgZGF0YS5mbGdQcmV2aW91cyA9IGZsZ1ByZXZpb3VzO1xyXG4gICAgZGF0YS5lcnJvcnMgPSB7fTtcclxuICAgIGRhdGEucmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGRhdGEuZmlsdGVyID0ge307XHJcbiAgICBkYXRhLmZpbHRlcmVkID0ge307XHJcbiAgICByZXR1cm4gbmV3IE15Ym9va2luZ0RhdGEoe2RhdGE6IGRhdGF9KTtcclxuXHJcbn07XHJcbk15Ym9va2luZ0RhdGEuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiTXlib29raW5nRGF0YS5mZXRjaFwiKTtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICQuZ2V0SlNPTignL2IyYy9haXJDYXJ0L2dldE15Qm9va2luZ3MnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKE15Ym9va2luZ0RhdGEucGFyc2UoZGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE15Ym9va2luZ0RhdGE7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuanNcbiAqKiBtb2R1bGUgaWQgPSA4MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgM1xuICoqLyIsIi8qIVxuICogYWNjb3VudGluZy5qcyB2MC4zLjJcbiAqIENvcHlyaWdodCAyMDExLCBKb3NzIENyb3djcm9mdFxuICpcbiAqIEZyZWVseSBkaXN0cmlidXRhYmxlIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIFBvcnRpb25zIG9mIGFjY291bnRpbmcuanMgYXJlIGluc3BpcmVkIG9yIGJvcnJvd2VkIGZyb20gdW5kZXJzY29yZS5qc1xuICpcbiAqIEZ1bGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbiAqIGh0dHA6Ly9qb3NzY3Jvd2Nyb2Z0LmdpdGh1Yi5jb20vYWNjb3VudGluZy5qcy9cbiAqL1xuXG4oZnVuY3Rpb24ocm9vdCwgdW5kZWZpbmVkKSB7XG5cblx0LyogLS0tIFNldHVwIC0tLSAqL1xuXG5cdC8vIENyZWF0ZSB0aGUgbG9jYWwgbGlicmFyeSBvYmplY3QsIHRvIGJlIGV4cG9ydGVkIG9yIHJlZmVyZW5jZWQgZ2xvYmFsbHkgbGF0ZXJcblx0dmFyIGxpYiA9IHt9O1xuXG5cdC8vIEN1cnJlbnQgdmVyc2lvblxuXHRsaWIudmVyc2lvbiA9ICcwLjMuMic7XG5cblxuXHQvKiAtLS0gRXhwb3NlZCBzZXR0aW5ncyAtLS0gKi9cblxuXHQvLyBUaGUgbGlicmFyeSdzIHNldHRpbmdzIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBDb250YWlucyBkZWZhdWx0IHBhcmFtZXRlcnMgZm9yXG5cdC8vIGN1cnJlbmN5IGFuZCBudW1iZXIgZm9ybWF0dGluZ1xuXHRsaWIuc2V0dGluZ3MgPSB7XG5cdFx0Y3VycmVuY3k6IHtcblx0XHRcdHN5bWJvbCA6IFwiJFwiLFx0XHQvLyBkZWZhdWx0IGN1cnJlbmN5IHN5bWJvbCBpcyAnJCdcblx0XHRcdGZvcm1hdCA6IFwiJXMldlwiLFx0Ly8gY29udHJvbHMgb3V0cHV0OiAlcyA9IHN5bWJvbCwgJXYgPSB2YWx1ZSAoY2FuIGJlIG9iamVjdCwgc2VlIGRvY3MpXG5cdFx0XHRkZWNpbWFsIDogXCIuXCIsXHRcdC8vIGRlY2ltYWwgcG9pbnQgc2VwYXJhdG9yXG5cdFx0XHR0aG91c2FuZCA6IFwiLFwiLFx0XHQvLyB0aG91c2FuZHMgc2VwYXJhdG9yXG5cdFx0XHRwcmVjaXNpb24gOiAyLFx0XHQvLyBkZWNpbWFsIHBsYWNlc1xuXHRcdFx0Z3JvdXBpbmcgOiAzXHRcdC8vIGRpZ2l0IGdyb3VwaW5nIChub3QgaW1wbGVtZW50ZWQgeWV0KVxuXHRcdH0sXG5cdFx0bnVtYmVyOiB7XG5cdFx0XHRwcmVjaXNpb24gOiAwLFx0XHQvLyBkZWZhdWx0IHByZWNpc2lvbiBvbiBudW1iZXJzIGlzIDBcblx0XHRcdGdyb3VwaW5nIDogMyxcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0XHR0aG91c2FuZCA6IFwiLFwiLFxuXHRcdFx0ZGVjaW1hbCA6IFwiLlwiXG5cdFx0fVxuXHR9O1xuXG5cblx0LyogLS0tIEludGVybmFsIEhlbHBlciBNZXRob2RzIC0tLSAqL1xuXG5cdC8vIFN0b3JlIHJlZmVyZW5jZSB0byBwb3NzaWJseS1hdmFpbGFibGUgRUNNQVNjcmlwdCA1IG1ldGhvZHMgZm9yIGxhdGVyXG5cdHZhciBuYXRpdmVNYXAgPSBBcnJheS5wcm90b3R5cGUubWFwLFxuXHRcdG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5LFxuXHRcdHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSBzdHJpbmdcblx0ICogZnJvbSB1bmRlcnNjb3JlLmpzXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcblx0XHRyZXR1cm4gISEob2JqID09PSAnJyB8fCAob2JqICYmIG9iai5jaGFyQ29kZUF0ICYmIG9iai5zdWJzdHIpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanMsIGRlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG5cdCAqL1xuXHRmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuXHRcdHJldHVybiBuYXRpdmVJc0FycmF5ID8gbmF0aXZlSXNBcnJheShvYmopIDogdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgdHJ1ZSBvYmplY3Rcblx0ICovXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuXHRcdHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4dGVuZHMgYW4gb2JqZWN0IHdpdGggYSBkZWZhdWx0cyBvYmplY3QsIHNpbWlsYXIgdG8gdW5kZXJzY29yZSdzIF8uZGVmYXVsdHNcblx0ICpcblx0ICogVXNlZCBmb3IgYWJzdHJhY3RpbmcgcGFyYW1ldGVyIGhhbmRsaW5nIGZyb20gQVBJIG1ldGhvZHNcblx0ICovXG5cdGZ1bmN0aW9uIGRlZmF1bHRzKG9iamVjdCwgZGVmcykge1xuXHRcdHZhciBrZXk7XG5cdFx0b2JqZWN0ID0gb2JqZWN0IHx8IHt9O1xuXHRcdGRlZnMgPSBkZWZzIHx8IHt9O1xuXHRcdC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qgbm9uLXByb3RvdHlwZSBwcm9wZXJ0aWVzOlxuXHRcdGZvciAoa2V5IGluIGRlZnMpIHtcblx0XHRcdGlmIChkZWZzLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0Ly8gUmVwbGFjZSB2YWx1ZXMgd2l0aCBkZWZhdWx0cyBvbmx5IGlmIHVuZGVmaW5lZCAoYWxsb3cgZW1wdHkvemVybyB2YWx1ZXMpOlxuXHRcdFx0XHRpZiAob2JqZWN0W2tleV0gPT0gbnVsbCkgb2JqZWN0W2tleV0gPSBkZWZzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvYmplY3Q7XG5cdH1cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgYEFycmF5Lm1hcCgpYCBmb3IgaXRlcmF0aW9uIGxvb3BzXG5cdCAqXG5cdCAqIFJldHVybnMgYSBuZXcgQXJyYXkgYXMgYSByZXN1bHQgb2YgY2FsbGluZyBgaXRlcmF0b3JgIG9uIGVhY2ggYXJyYXkgdmFsdWUuXG5cdCAqIERlZmVycyB0byBuYXRpdmUgQXJyYXkubWFwIGlmIGF2YWlsYWJsZVxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcblx0XHR2YXIgcmVzdWx0cyA9IFtdLCBpLCBqO1xuXG5cdFx0aWYgKCFvYmopIHJldHVybiByZXN1bHRzO1xuXG5cdFx0Ly8gVXNlIG5hdGl2ZSAubWFwIG1ldGhvZCBpZiBpdCBleGlzdHM6XG5cdFx0aWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcblxuXHRcdC8vIEZhbGxiYWNrIGZvciBuYXRpdmUgLm1hcDpcblx0XHRmb3IgKGkgPSAwLCBqID0gb2JqLmxlbmd0aDsgaSA8IGo7IGkrKyApIHtcblx0XHRcdHJlc3VsdHNbaV0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgYW5kIG5vcm1hbGlzZSB0aGUgdmFsdWUgb2YgcHJlY2lzaW9uIChtdXN0IGJlIHBvc2l0aXZlIGludGVnZXIpXG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja1ByZWNpc2lvbih2YWwsIGJhc2UpIHtcblx0XHR2YWwgPSBNYXRoLnJvdW5kKE1hdGguYWJzKHZhbCkpO1xuXHRcdHJldHVybiBpc05hTih2YWwpPyBiYXNlIDogdmFsO1xuXHR9XG5cblxuXHQvKipcblx0ICogUGFyc2VzIGEgZm9ybWF0IHN0cmluZyBvciBvYmplY3QgYW5kIHJldHVybnMgZm9ybWF0IG9iaiBmb3IgdXNlIGluIHJlbmRlcmluZ1xuXHQgKlxuXHQgKiBgZm9ybWF0YCBpcyBlaXRoZXIgYSBzdHJpbmcgd2l0aCB0aGUgZGVmYXVsdCAocG9zaXRpdmUpIGZvcm1hdCwgb3Igb2JqZWN0XG5cdCAqIGNvbnRhaW5pbmcgYHBvc2AgKHJlcXVpcmVkKSwgYG5lZ2AgYW5kIGB6ZXJvYCB2YWx1ZXMgKG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nXG5cdCAqIGVpdGhlciBhIHN0cmluZyBvciBvYmplY3QpXG5cdCAqXG5cdCAqIEVpdGhlciBzdHJpbmcgb3IgZm9ybWF0LnBvcyBtdXN0IGNvbnRhaW4gXCIldlwiICh2YWx1ZSkgdG8gYmUgdmFsaWRcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrQ3VycmVuY3lGb3JtYXQoZm9ybWF0KSB7XG5cdFx0dmFyIGRlZmF1bHRzID0gbGliLnNldHRpbmdzLmN1cnJlbmN5LmZvcm1hdDtcblxuXHRcdC8vIEFsbG93IGZ1bmN0aW9uIGFzIGZvcm1hdCBwYXJhbWV0ZXIgKHNob3VsZCByZXR1cm4gc3RyaW5nIG9yIG9iamVjdCk6XG5cdFx0aWYgKCB0eXBlb2YgZm9ybWF0ID09PSBcImZ1bmN0aW9uXCIgKSBmb3JtYXQgPSBmb3JtYXQoKTtcblxuXHRcdC8vIEZvcm1hdCBjYW4gYmUgYSBzdHJpbmcsIGluIHdoaWNoIGNhc2UgYHZhbHVlYCAoXCIldlwiKSBtdXN0IGJlIHByZXNlbnQ6XG5cdFx0aWYgKCBpc1N0cmluZyggZm9ybWF0ICkgJiYgZm9ybWF0Lm1hdGNoKFwiJXZcIikgKSB7XG5cblx0XHRcdC8vIENyZWF0ZSBhbmQgcmV0dXJuIHBvc2l0aXZlLCBuZWdhdGl2ZSBhbmQgemVybyBmb3JtYXRzOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cG9zIDogZm9ybWF0LFxuXHRcdFx0XHRuZWcgOiBmb3JtYXQucmVwbGFjZShcIi1cIiwgXCJcIikucmVwbGFjZShcIiV2XCIsIFwiLSV2XCIpLFxuXHRcdFx0XHR6ZXJvIDogZm9ybWF0XG5cdFx0XHR9O1xuXG5cdFx0Ly8gSWYgbm8gZm9ybWF0LCBvciBvYmplY3QgaXMgbWlzc2luZyB2YWxpZCBwb3NpdGl2ZSB2YWx1ZSwgdXNlIGRlZmF1bHRzOlxuXHRcdH0gZWxzZSBpZiAoICFmb3JtYXQgfHwgIWZvcm1hdC5wb3MgfHwgIWZvcm1hdC5wb3MubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gSWYgZGVmYXVsdHMgaXMgYSBzdHJpbmcsIGNhc3RzIGl0IHRvIGFuIG9iamVjdCBmb3IgZmFzdGVyIGNoZWNraW5nIG5leHQgdGltZTpcblx0XHRcdHJldHVybiAoICFpc1N0cmluZyggZGVmYXVsdHMgKSApID8gZGVmYXVsdHMgOiBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0ID0ge1xuXHRcdFx0XHRwb3MgOiBkZWZhdWx0cyxcblx0XHRcdFx0bmVnIDogZGVmYXVsdHMucmVwbGFjZShcIiV2XCIsIFwiLSV2XCIpLFxuXHRcdFx0XHR6ZXJvIDogZGVmYXVsdHNcblx0XHRcdH07XG5cblx0XHR9XG5cdFx0Ly8gT3RoZXJ3aXNlLCBhc3N1bWUgZm9ybWF0IHdhcyBmaW5lOlxuXHRcdHJldHVybiBmb3JtYXQ7XG5cdH1cblxuXG5cdC8qIC0tLSBBUEkgTWV0aG9kcyAtLS0gKi9cblxuXHQvKipcblx0ICogVGFrZXMgYSBzdHJpbmcvYXJyYXkgb2Ygc3RyaW5ncywgcmVtb3ZlcyBhbGwgZm9ybWF0dGluZy9jcnVmdCBhbmQgcmV0dXJucyB0aGUgcmF3IGZsb2F0IHZhbHVlXG5cdCAqIGFsaWFzOiBhY2NvdW50aW5nLmBwYXJzZShzdHJpbmcpYFxuXHQgKlxuXHQgKiBEZWNpbWFsIG11c3QgYmUgaW5jbHVkZWQgaW4gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBmbG9hdHMgKGRlZmF1bHQ6IFwiLlwiKSwgc28gaWYgdGhlIG51bWJlclxuXHQgKiB1c2VzIGEgbm9uLXN0YW5kYXJkIGRlY2ltYWwgc2VwYXJhdG9yLCBwcm92aWRlIGl0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdCAqXG5cdCAqIEFsc28gbWF0Y2hlcyBicmFja2V0ZWQgbmVnYXRpdmVzIChlZy4gXCIkICgxLjk5KVwiID0+IC0xLjk5KVxuXHQgKlxuXHQgKiBEb2Vzbid0IHRocm93IGFueSBlcnJvcnMgKGBOYU5gcyBiZWNvbWUgMCkgYnV0IHRoaXMgbWF5IGNoYW5nZSBpbiBmdXR1cmVcblx0ICovXG5cdHZhciB1bmZvcm1hdCA9IGxpYi51bmZvcm1hdCA9IGxpYi5wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVjdXJzaXZlbHkgdW5mb3JtYXQgYXJyYXlzOlxuXHRcdGlmIChpc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIG1hcCh2YWx1ZSwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiB1bmZvcm1hdCh2YWwsIGRlY2ltYWwpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gRmFpbHMgc2lsZW50bHkgKG5lZWQgZGVjZW50IGVycm9ycyk6XG5cdFx0dmFsdWUgPSB2YWx1ZSB8fCAwO1xuXG5cdFx0Ly8gUmV0dXJuIHRoZSB2YWx1ZSBhcy1pcyBpZiBpdCdzIGFscmVhZHkgYSBudW1iZXI6XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHZhbHVlO1xuXG5cdFx0Ly8gRGVmYXVsdCBkZWNpbWFsIHBvaW50IGlzIFwiLlwiIGJ1dCBjb3VsZCBiZSBzZXQgdG8gZWcuIFwiLFwiIGluIG9wdHM6XG5cdFx0ZGVjaW1hbCA9IGRlY2ltYWwgfHwgXCIuXCI7XG5cblx0XHQgLy8gQnVpbGQgcmVnZXggdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgZXhjZXB0IGRpZ2l0cywgZGVjaW1hbCBwb2ludCBhbmQgbWludXMgc2lnbjpcblx0XHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiW14wLTktXCIgKyBkZWNpbWFsICsgXCJdXCIsIFtcImdcIl0pLFxuXHRcdFx0dW5mb3JtYXR0ZWQgPSBwYXJzZUZsb2F0KFxuXHRcdFx0XHQoXCJcIiArIHZhbHVlKVxuXHRcdFx0XHQucmVwbGFjZSgvXFwoKC4qKVxcKS8sIFwiLSQxXCIpIC8vIHJlcGxhY2UgYnJhY2tldGVkIHZhbHVlcyB3aXRoIG5lZ2F0aXZlc1xuXHRcdFx0XHQucmVwbGFjZShyZWdleCwgJycpICAgICAgICAgLy8gc3RyaXAgb3V0IGFueSBjcnVmdFxuXHRcdFx0XHQucmVwbGFjZShkZWNpbWFsLCAnLicpICAgICAgLy8gbWFrZSBzdXJlIGRlY2ltYWwgcG9pbnQgaXMgc3RhbmRhcmRcblx0XHRcdCk7XG5cblx0XHQvLyBUaGlzIHdpbGwgZmFpbCBzaWxlbnRseSB3aGljaCBtYXkgY2F1c2UgdHJvdWJsZSwgbGV0J3Mgd2FpdCBhbmQgc2VlOlxuXHRcdHJldHVybiAhaXNOYU4odW5mb3JtYXR0ZWQpID8gdW5mb3JtYXR0ZWQgOiAwO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEltcGxlbWVudGF0aW9uIG9mIHRvRml4ZWQoKSB0aGF0IHRyZWF0cyBmbG9hdHMgbW9yZSBsaWtlIGRlY2ltYWxzXG5cdCAqXG5cdCAqIEZpeGVzIGJpbmFyeSByb3VuZGluZyBpc3N1ZXMgKGVnLiAoMC42MTUpLnRvRml4ZWQoMikgPT09IFwiMC42MVwiKSB0aGF0IHByZXNlbnRcblx0ICogcHJvYmxlbXMgZm9yIGFjY291bnRpbmctIGFuZCBmaW5hbmNlLXJlbGF0ZWQgc29mdHdhcmUuXG5cdCAqL1xuXHR2YXIgdG9GaXhlZCA9IGxpYi50b0ZpeGVkID0gZnVuY3Rpb24odmFsdWUsIHByZWNpc2lvbikge1xuXHRcdHByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKHByZWNpc2lvbiwgbGliLnNldHRpbmdzLm51bWJlci5wcmVjaXNpb24pO1xuXHRcdHZhciBwb3dlciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuXG5cdFx0Ly8gTXVsdGlwbHkgdXAgYnkgcHJlY2lzaW9uLCByb3VuZCBhY2N1cmF0ZWx5LCB0aGVuIGRpdmlkZSBhbmQgdXNlIG5hdGl2ZSB0b0ZpeGVkKCk6XG5cdFx0cmV0dXJuIChNYXRoLnJvdW5kKGxpYi51bmZvcm1hdCh2YWx1ZSkgKiBwb3dlcikgLyBwb3dlcikudG9GaXhlZChwcmVjaXNpb24pO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEZvcm1hdCBhIG51bWJlciwgd2l0aCBjb21tYS1zZXBhcmF0ZWQgdGhvdXNhbmRzIGFuZCBjdXN0b20gcHJlY2lzaW9uL2RlY2ltYWwgcGxhY2VzXG5cdCAqXG5cdCAqIExvY2FsaXNlIGJ5IG92ZXJyaWRpbmcgdGhlIHByZWNpc2lvbiBhbmQgdGhvdXNhbmQgLyBkZWNpbWFsIHNlcGFyYXRvcnNcblx0ICogMm5kIHBhcmFtZXRlciBgcHJlY2lzaW9uYCBjYW4gYmUgYW4gb2JqZWN0IG1hdGNoaW5nIGBzZXR0aW5ncy5udW1iZXJgXG5cdCAqL1xuXHR2YXIgZm9ybWF0TnVtYmVyID0gbGliLmZvcm1hdE51bWJlciA9IGZ1bmN0aW9uKG51bWJlciwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCkge1xuXHRcdC8vIFJlc3Vyc2l2ZWx5IGZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkobnVtYmVyKSkge1xuXHRcdFx0cmV0dXJuIG1hcChudW1iZXIsIGZ1bmN0aW9uKHZhbCkge1xuXHRcdFx0XHRyZXR1cm4gZm9ybWF0TnVtYmVyKHZhbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBDbGVhbiB1cCBudW1iZXI6XG5cdFx0bnVtYmVyID0gdW5mb3JtYXQobnVtYmVyKTtcblxuXHRcdC8vIEJ1aWxkIG9wdGlvbnMgb2JqZWN0IGZyb20gc2Vjb25kIHBhcmFtIChpZiBvYmplY3QpIG9yIGFsbCBwYXJhbXMsIGV4dGVuZGluZyBkZWZhdWx0czpcblx0XHR2YXIgb3B0cyA9IGRlZmF1bHRzKFxuXHRcdFx0XHQoaXNPYmplY3QocHJlY2lzaW9uKSA/IHByZWNpc2lvbiA6IHtcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLm51bWJlclxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgcHJlY2lzaW9uXG5cdFx0XHR1c2VQcmVjaXNpb24gPSBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksXG5cblx0XHRcdC8vIERvIHNvbWUgY2FsYzpcblx0XHRcdG5lZ2F0aXZlID0gbnVtYmVyIDwgMCA/IFwiLVwiIDogXCJcIixcblx0XHRcdGJhc2UgPSBwYXJzZUludCh0b0ZpeGVkKE1hdGguYWJzKG51bWJlciB8fCAwKSwgdXNlUHJlY2lzaW9uKSwgMTApICsgXCJcIixcblx0XHRcdG1vZCA9IGJhc2UubGVuZ3RoID4gMyA/IGJhc2UubGVuZ3RoICUgMyA6IDA7XG5cblx0XHQvLyBGb3JtYXQgdGhlIG51bWJlcjpcblx0XHRyZXR1cm4gbmVnYXRpdmUgKyAobW9kID8gYmFzZS5zdWJzdHIoMCwgbW9kKSArIG9wdHMudGhvdXNhbmQgOiBcIlwiKSArIGJhc2Uuc3Vic3RyKG1vZCkucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csIFwiJDFcIiArIG9wdHMudGhvdXNhbmQpICsgKHVzZVByZWNpc2lvbiA/IG9wdHMuZGVjaW1hbCArIHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyKSwgdXNlUHJlY2lzaW9uKS5zcGxpdCgnLicpWzFdIDogXCJcIik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyIGludG8gY3VycmVuY3lcblx0ICpcblx0ICogVXNhZ2U6IGFjY291bnRpbmcuZm9ybWF0TW9uZXkobnVtYmVyLCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmRzU2VwLCBkZWNpbWFsU2VwLCBmb3JtYXQpXG5cdCAqIGRlZmF1bHRzOiAoMCwgXCIkXCIsIDIsIFwiLFwiLCBcIi5cIiwgXCIlcyV2XCIpXG5cdCAqXG5cdCAqIExvY2FsaXNlIGJ5IG92ZXJyaWRpbmcgdGhlIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9ycyBhbmQgZm9ybWF0XG5cdCAqIFNlY29uZCBwYXJhbSBjYW4gYmUgYW4gb2JqZWN0IG1hdGNoaW5nIGBzZXR0aW5ncy5jdXJyZW5jeWAgd2hpY2ggaXMgdGhlIGVhc2llc3Qgd2F5LlxuXHQgKlxuXHQgKiBUbyBkbzogdGlkeSB1cCB0aGUgcGFyYW1ldGVyc1xuXHQgKi9cblx0dmFyIGZvcm1hdE1vbmV5ID0gbGliLmZvcm1hdE1vbmV5ID0gZnVuY3Rpb24obnVtYmVyLCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwsIGZvcm1hdCkge1xuXHRcdC8vIFJlc3Vyc2l2ZWx5IGZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkobnVtYmVyKSkge1xuXHRcdFx0cmV0dXJuIG1hcChudW1iZXIsIGZ1bmN0aW9uKHZhbCl7XG5cdFx0XHRcdHJldHVybiBmb3JtYXRNb25leSh2YWwsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChzeW1ib2wpID8gc3ltYm9sIDoge1xuXHRcdFx0XHRcdHN5bWJvbCA6IHN5bWJvbCxcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbCxcblx0XHRcdFx0XHRmb3JtYXQgOiBmb3JtYXRcblx0XHRcdFx0fSksXG5cdFx0XHRcdGxpYi5zZXR0aW5ncy5jdXJyZW5jeVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2hlY2sgZm9ybWF0IChyZXR1cm5zIG9iamVjdCB3aXRoIHBvcywgbmVnIGFuZCB6ZXJvKTpcblx0XHRcdGZvcm1hdHMgPSBjaGVja0N1cnJlbmN5Rm9ybWF0KG9wdHMuZm9ybWF0KSxcblxuXHRcdFx0Ly8gQ2hvb3NlIHdoaWNoIGZvcm1hdCB0byB1c2UgZm9yIHRoaXMgdmFsdWU6XG5cdFx0XHR1c2VGb3JtYXQgPSBudW1iZXIgPiAwID8gZm9ybWF0cy5wb3MgOiBudW1iZXIgPCAwID8gZm9ybWF0cy5uZWcgOiBmb3JtYXRzLnplcm87XG5cblx0XHQvLyBSZXR1cm4gd2l0aCBjdXJyZW5jeSBzeW1ib2wgYWRkZWQ6XG5cdFx0cmV0dXJuIHVzZUZvcm1hdC5yZXBsYWNlKCclcycsIG9wdHMuc3ltYm9sKS5yZXBsYWNlKCcldicsIGZvcm1hdE51bWJlcihNYXRoLmFicyhudW1iZXIpLCBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksIG9wdHMudGhvdXNhbmQsIG9wdHMuZGVjaW1hbCkpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEZvcm1hdCBhIGxpc3Qgb2YgbnVtYmVycyBpbnRvIGFuIGFjY291bnRpbmcgY29sdW1uLCBwYWRkaW5nIHdpdGggd2hpdGVzcGFjZVxuXHQgKiB0byBsaW5lIHVwIGN1cnJlbmN5IHN5bWJvbHMsIHRob3VzYW5kIHNlcGFyYXRvcnMgYW5kIGRlY2ltYWxzIHBsYWNlc1xuXHQgKlxuXHQgKiBMaXN0IHNob3VsZCBiZSBhbiBhcnJheSBvZiBudW1iZXJzXG5cdCAqIFNlY29uZCBwYXJhbWV0ZXIgY2FuIGJlIGFuIG9iamVjdCBjb250YWluaW5nIGtleXMgdGhhdCBtYXRjaCB0aGUgcGFyYW1zXG5cdCAqXG5cdCAqIFJldHVybnMgYXJyYXkgb2YgYWNjb3V0aW5nLWZvcm1hdHRlZCBudW1iZXIgc3RyaW5ncyBvZiBzYW1lIGxlbmd0aFxuXHQgKlxuXHQgKiBOQjogYHdoaXRlLXNwYWNlOnByZWAgQ1NTIHJ1bGUgaXMgcmVxdWlyZWQgb24gdGhlIGxpc3QgY29udGFpbmVyIHRvIHByZXZlbnRcblx0ICogYnJvd3NlcnMgZnJvbSBjb2xsYXBzaW5nIHRoZSB3aGl0ZXNwYWNlIGluIHRoZSBvdXRwdXQgc3RyaW5ncy5cblx0ICovXG5cdGxpYi5mb3JtYXRDb2x1bW4gPSBmdW5jdGlvbihsaXN0LCBzeW1ib2wsIHByZWNpc2lvbiwgdGhvdXNhbmQsIGRlY2ltYWwsIGZvcm1hdCkge1xuXHRcdGlmICghbGlzdCkgcmV0dXJuIFtdO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChzeW1ib2wpID8gc3ltYm9sIDoge1xuXHRcdFx0XHRcdHN5bWJvbCA6IHN5bWJvbCxcblx0XHRcdFx0XHRwcmVjaXNpb24gOiBwcmVjaXNpb24sXG5cdFx0XHRcdFx0dGhvdXNhbmQgOiB0aG91c2FuZCxcblx0XHRcdFx0XHRkZWNpbWFsIDogZGVjaW1hbCxcblx0XHRcdFx0XHRmb3JtYXQgOiBmb3JtYXRcblx0XHRcdFx0fSksXG5cdFx0XHRcdGxpYi5zZXR0aW5ncy5jdXJyZW5jeVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gQ2hlY2sgZm9ybWF0IChyZXR1cm5zIG9iamVjdCB3aXRoIHBvcywgbmVnIGFuZCB6ZXJvKSwgb25seSBuZWVkIHBvcyBmb3Igbm93OlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBXaGV0aGVyIHRvIHBhZCBhdCBzdGFydCBvZiBzdHJpbmcgb3IgYWZ0ZXIgY3VycmVuY3kgc3ltYm9sOlxuXHRcdFx0cGFkQWZ0ZXJTeW1ib2wgPSBmb3JtYXRzLnBvcy5pbmRleE9mKFwiJXNcIikgPCBmb3JtYXRzLnBvcy5pbmRleE9mKFwiJXZcIikgPyB0cnVlIDogZmFsc2UsXG5cblx0XHRcdC8vIFN0b3JlIHZhbHVlIGZvciB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IHN0cmluZyBpbiB0aGUgY29sdW1uOlxuXHRcdFx0bWF4TGVuZ3RoID0gMCxcblxuXHRcdFx0Ly8gRm9ybWF0IHRoZSBsaXN0IGFjY29yZGluZyB0byBvcHRpb25zLCBzdG9yZSB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IHN0cmluZzpcblx0XHRcdGZvcm1hdHRlZCA9IG1hcChsaXN0LCBmdW5jdGlvbih2YWwsIGkpIHtcblx0XHRcdFx0aWYgKGlzQXJyYXkodmFsKSkge1xuXHRcdFx0XHRcdC8vIFJlY3Vyc2l2ZWx5IGZvcm1hdCBjb2x1bW5zIGlmIGxpc3QgaXMgYSBtdWx0aS1kaW1lbnNpb25hbCBhcnJheTpcblx0XHRcdFx0XHRyZXR1cm4gbGliLmZvcm1hdENvbHVtbih2YWwsIG9wdHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIENsZWFuIHVwIHRoZSB2YWx1ZVxuXHRcdFx0XHRcdHZhbCA9IHVuZm9ybWF0KHZhbCk7XG5cblx0XHRcdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZSAocG9zLCBuZWcgb3IgemVybyk6XG5cdFx0XHRcdFx0dmFyIHVzZUZvcm1hdCA9IHZhbCA+IDAgPyBmb3JtYXRzLnBvcyA6IHZhbCA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybyxcblxuXHRcdFx0XHRcdFx0Ly8gRm9ybWF0IHRoaXMgdmFsdWUsIHB1c2ggaW50byBmb3JtYXR0ZWQgbGlzdCBhbmQgc2F2ZSB0aGUgbGVuZ3RoOlxuXHRcdFx0XHRcdFx0ZlZhbCA9IHVzZUZvcm1hdC5yZXBsYWNlKCclcycsIG9wdHMuc3ltYm9sKS5yZXBsYWNlKCcldicsIGZvcm1hdE51bWJlcihNYXRoLmFicyh2YWwpLCBjaGVja1ByZWNpc2lvbihvcHRzLnByZWNpc2lvbiksIG9wdHMudGhvdXNhbmQsIG9wdHMuZGVjaW1hbCkpO1xuXG5cdFx0XHRcdFx0aWYgKGZWYWwubGVuZ3RoID4gbWF4TGVuZ3RoKSBtYXhMZW5ndGggPSBmVmFsLmxlbmd0aDtcblx0XHRcdFx0XHRyZXR1cm4gZlZhbDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHQvLyBQYWQgZWFjaCBudW1iZXIgaW4gdGhlIGxpc3QgYW5kIHNlbmQgYmFjayB0aGUgY29sdW1uIG9mIG51bWJlcnM6XG5cdFx0cmV0dXJuIG1hcChmb3JtYXR0ZWQsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0Ly8gT25seSBpZiB0aGlzIGlzIGEgc3RyaW5nIChub3QgYSBuZXN0ZWQgYXJyYXksIHdoaWNoIHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIHBhZGRlZCk6XG5cdFx0XHRpZiAoaXNTdHJpbmcodmFsKSAmJiB2YWwubGVuZ3RoIDwgbWF4TGVuZ3RoKSB7XG5cdFx0XHRcdC8vIERlcGVuZGluZyBvbiBzeW1ib2wgcG9zaXRpb24sIHBhZCBhZnRlciBzeW1ib2wgb3IgYXQgaW5kZXggMDpcblx0XHRcdFx0cmV0dXJuIHBhZEFmdGVyU3ltYm9sID8gdmFsLnJlcGxhY2Uob3B0cy5zeW1ib2wsIG9wdHMuc3ltYm9sKyhuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSkgOiAobmV3IEFycmF5KG1heExlbmd0aCAtIHZhbC5sZW5ndGggKyAxKS5qb2luKFwiIFwiKSkgKyB2YWw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsO1xuXHRcdH0pO1xuXHR9O1xuXG5cblx0LyogLS0tIE1vZHVsZSBEZWZpbml0aW9uIC0tLSAqL1xuXG5cdC8vIEV4cG9ydCBhY2NvdW50aW5nIGZvciBDb21tb25KUy4gSWYgYmVpbmcgbG9hZGVkIGFzIGFuIEFNRCBtb2R1bGUsIGRlZmluZSBpdCBhcyBzdWNoLlxuXHQvLyBPdGhlcndpc2UsIGp1c3QgYWRkIGBhY2NvdW50aW5nYCB0byB0aGUgZ2xvYmFsIG9iamVjdFxuXHRpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0XHRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBsaWI7XG5cdFx0fVxuXHRcdGV4cG9ydHMuYWNjb3VudGluZyA9IGxpYjtcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBSZXR1cm4gdGhlIGxpYnJhcnkgYXMgYW4gQU1EIG1vZHVsZTpcblx0XHRkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGxpYjtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHQvLyBVc2UgYWNjb3VudGluZy5ub0NvbmZsaWN0IHRvIHJlc3RvcmUgYGFjY291bnRpbmdgIGJhY2sgdG8gaXRzIG9yaWdpbmFsIHZhbHVlLlxuXHRcdC8vIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIGxpYnJhcnkncyBgYWNjb3VudGluZ2Agb2JqZWN0O1xuXHRcdC8vIGUuZy4gYHZhciBudW1iZXJzID0gYWNjb3VudGluZy5ub0NvbmZsaWN0KCk7YFxuXHRcdGxpYi5ub0NvbmZsaWN0ID0gKGZ1bmN0aW9uKG9sZEFjY291bnRpbmcpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gUmVzZXQgdGhlIHZhbHVlIG9mIHRoZSByb290J3MgYGFjY291bnRpbmdgIHZhcmlhYmxlOlxuXHRcdFx0XHRyb290LmFjY291bnRpbmcgPSBvbGRBY2NvdW50aW5nO1xuXHRcdFx0XHQvLyBEZWxldGUgdGhlIG5vQ29uZmxpY3QgbWV0aG9kOlxuXHRcdFx0XHRsaWIubm9Db25mbGljdCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0Ly8gUmV0dXJuIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSB0byByZS1hc3NpZ24gaXQ6XG5cdFx0XHRcdHJldHVybiBsaWI7XG5cdFx0XHR9O1xuXHRcdH0pKHJvb3QuYWNjb3VudGluZyk7XG5cblx0XHQvLyBEZWNsYXJlIGBmeGAgb24gdGhlIHJvb3QgKGdsb2JhbC93aW5kb3cpIG9iamVjdDpcblx0XHRyb290WydhY2NvdW50aW5nJ10gPSBsaWI7XG5cdH1cblxuXHQvLyBSb290IHdpbGwgYmUgYHdpbmRvd2AgaW4gYnJvd3NlciBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyOlxufSh0aGlzKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmVuZG9yL2FjY291bnRpbmcuanMvYWNjb3VudGluZy5qc1xuICoqIG1vZHVsZSBpZCA9IDEwNVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA2XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICBHdWVzdEZpbHRlciA9IHJlcXVpcmUoJ2NvbXBvbmVudHMvZ3Vlc3R0aWNrZXQvZ3Vlc3RmaWx0ZXInKTtcclxucmVxdWlyZSgnbW9iaWxlL2d1ZXN0ZmlsdGVyLmxlc3MnKTtcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgICAobmV3IEd1ZXN0RmlsdGVyKCkpLnJlbmRlcignI2FwcCcpO1xyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9ndWVzdGZpbHRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE1NlxuICoqIG1vZHVsZSBjaHVua3MgPSAyXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgICAgICBBdXRoID0gcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvYXV0aCcpLFxyXG4gICAgICAgIE15Ym9va2luZ0RhdGEgPSByZXF1aXJlKCdzdG9yZXMvbXlib29raW5ncy9teWJvb2tpbmdzJyksXHJcbiAgICAgICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL21ldGEnKVxyXG4gICAgICAgIDtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm0uZXh0ZW5kKHtcclxuICAgIGlzb2xhdGVkOiB0cnVlLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9ndWVzdHRpY2tldC9ndWVzdGZpbHRlci5odG1sJyksXHJcbiAgICBjb21wb25lbnRzOiB7XHJcbiAgICAgICAgJ2xheW91dCc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2xheW91dCcpLFxyXG4gICAgICAgIGF1dGg6IHJlcXVpcmUoJ2NvbXBvbmVudHMvYXBwL2F1dGgnKSxcclxuICAgICAgICBndWVzdGJvb2tpbmc6IHJlcXVpcmUoJ2NvbXBvbmVudHMvZ3Vlc3R0aWNrZXQvZ3Vlc3Rib29raW5nJyksXHJcbiAgICAgICAgZGV0YWlsczogcmVxdWlyZSgnY29tcG9uZW50cy9teWJvb2tpbmdzL2RldGFpbHMnKSxcclxuICAgIH0sXHJcbiAgICBwYXJ0aWFsczoge1xyXG4gICAgICAgICdiYXNlLXBhbmVsJzogcmVxdWlyZSgndGVtcGxhdGVzL2FwcC9sYXlvdXQvcGFuZWwuaHRtbCcpXHJcbiAgICB9LFxyXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbXlib29raW5nczp7bG9nZ2VkaW46ZmFsc2V9LFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgTWV0YS5pbnN0YW5jZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihtZXRhKSB7IHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7fS5iaW5kKHRoaXMpKTtcclxuICAgICAgICAvLyB0aGlzLnNldCgndXNlcicsIFVzZXIpO1xyXG4gICAgICAgIHdpbmRvdy52aWV3ID0gdGhpcztcclxuICAgIH0sXHJcbiAgICBzaG93OiBmdW5jdGlvbiAoc2VjdGlvbiwgdmFsaWRhdGlvbiwgYWxsKSB7XHJcbiAgICAgICAgaWYgKGFsbClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGlmICgnYmlydGgnID09IHNlY3Rpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkb21lc3RpYycgIT0gJ3ZhbGlkYXRpb24nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCdwYXNzcG9ydCcgPT0gc2VjdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Z1bGwnID09ICd2YWxpZGF0aW9uJztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2lnbmluOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICBBdXRoLmxvZ2luKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgICAgc2lnbnVwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBBdXRoLnNpZ251cCgpO1xyXG4gICAgfSxcclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvZ3Vlc3R0aWNrZXQvZ3Vlc3RmaWx0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxNTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzPXtcInZcIjozLFwidFwiOlt7XCJ0XCI6NyxcImVcIjpcImxheW91dFwiLFwiYVwiOntcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJndWVzdGJvb2tpbmdcIixcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzdGVwIGhlYWRlciBzdGVwMSBhY3RpdmVcIn0sXCJmXCI6W1wiR2V0IEJvb2tpbmdcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHR3byBjb2x1bW4gbWlkZGxlIGFsaWduZWQgY2VudGVyIGFsaWduZWQgcmVsYXhlZCBmaXR0ZWQgc3RhY2thYmxlIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbXCIgXCIse1widFwiOjcsXCJlXCI6XCJhdXRoXCIsXCJhXCI6e1wibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB2ZXJ0aWNhbCBkaXZpZGVyXCJ9LFwiZlwiOltcIk9yXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjZW50ZXIgYWxpZ25lZCBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZ3Vlc3Rib29raW5nXCIsXCJhXCI6e1wibXlib29raW5nc1wiOlt7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3NcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dfV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MubG9nZ2VkaW5cIl0sXCJzXCI6XCIhXzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRldGFpbHNcIixcImFcIjp7XCJteWJvb2tpbmdzXCI6W3tcInRcIjoyLFwiclwiOlwibXlib29raW5nc1wifV0sXCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19fV0sXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MubG9nZ2VkaW5cIl0sXCJzXCI6XCIhXzBcIn19LFwiIFwiXSxcInBcIjp7XCJwYW5lbFwiOlt7XCJ0XCI6OCxcInJcIjpcImJhc2UtcGFuZWxcIn1dfX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0ZmlsdGVyLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxNThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgICAgICBRID0gcmVxdWlyZSgncScpXHJcbiAgICAgICAgO1xyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpXHJcbiAgICAgICAgO1xyXG52YXIgR3Vlc3RCb29raW5nID0gRm9ybS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9ndWVzdHRpY2tldC9ndWVzdGJvb2tpbmcuaHRtbCcpLFxyXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2d1ZXN0Ym9va2luZycsXHJcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBtb2JpbGU6ICcnLFxyXG4gICAgICAgICAgICBwbnI6ICcnLFxyXG4gICAgICAgICAgICBsYXN0bmFtZTogJycsXHJcbiAgICAgICAgICAgIHBucjI6ICcnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgZ2V0dGlja2V0YnlwbnI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wZW5kaW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Z3Vlc3Rib29raW5nLycsXHJcbiAgICAgICAgICAgIGRhdGE6IHttb2JpbGU6IHRoaXMuZ2V0KCdtb2JpbGUnKSwgcG5yOiB0aGlzLmdldCgncG5yJyl9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5lcnJvciA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCwgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSxjdXJlbmN5OiBkYXRhLmN1cmVuY3ksZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsIHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQxID0gbmV3IERhdGUoeC5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQyID0gbmV3IERhdGUoeS5kZXBhcnR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzJywgZGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3Muc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wZW5kaW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLmxvZ2dlZGluJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdlcnJvcicsICdOb3QgRm91bmQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JNc2cnLCAnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXR0aWNrZXRieWxhc3RuYW1lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZzInLCBudWxsKTtcclxuICAgICAgICB0aGlzLnNldCgnZXJyb3IyJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcyJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MucGVuZGluZycsIHRydWUpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgY29udGV4dDogdGhpcyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldGd1ZXN0Ym9va2luZy8nLFxyXG4gICAgICAgICAgICBkYXRhOiB7bGFzdG5hbWU6IHRoaXMuZ2V0KCdsYXN0bmFtZScpLCBwbnIyOiB0aGlzLmdldCgncG5yMicpfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nMicsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5lcnJvciA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCwgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LGZvcDpkYXRhLmZvcCxiYXNlcHJpY2U6ZGF0YS5iYXNlcHJpY2UsdGF4ZXM6ZGF0YS50YXhlcyxmZWU6ZGF0YS5mZWUsdG90YWxBbW91bnRpbndvcmRzOmRhdGEudG90YWxBbW91bnRpbndvcmRzLGN1c3RvbWVyY2FyZTpkYXRhLmN1c3RvbWVyY2FyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ3M6IF8ubWFwKGRhdGEuYm9va2luZ3MsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2lkOiBpLmlkLCB1cGNvbWluZzogaS51cGNvbWluZywgc291cmNlX2lkOiBpLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGkuZGVzdGluYXRpb25faWQsIHNvdXJjZTogaS5zb3VyY2UsIGZsaWdodHRpbWU6IGkuZmxpZ2h0dGltZSwgZGVzdGluYXRpb246IGkuZGVzdGluYXRpb24sIGRlcGFydHVyZTogaS5kZXBhcnR1cmUsIGFycml2YWw6IGkuYXJyaXZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZWxsZXI6IF8ubWFwKGkudHJhdmVsbGVyLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIGJvb2tpbmdpZDogdC5ib29raW5naWQsIGZhcmV0eXBlOiB0LmZhcmV0eXBlLCB0aXRsZTogdC50aXRsZSwgdHlwZTogdC50eXBlLCBmaXJzdF9uYW1lOiB0LmZpcnN0X25hbWUsIGxhc3RfbmFtZTogdC5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhaXJsaW5lX3BucjogdC5haXJsaW5lX3BuciwgY3JzX3BucjogdC5jcnNfcG5yLCB0aWNrZXQ6IHQudGlja2V0LCBib29raW5nX2NsYXNzOiB0LmJvb2tpbmdfY2xhc3MsIGNhYmluOiB0LmNhYmluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWNmYXJlOiB0LmJhc2ljZmFyZSwgdGF4ZXM6IHQudGF4ZXMsIHRvdGFsOiB0LnRvdGFsLCBzdGF0dXM6IHQuc3RhdHVzLCBzdGF0dXNtc2c6IHQuc3RhdHVzbXNnLCBzZWxlY3RlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKHQucm91dGVzLCBmdW5jdGlvbiAocm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm8uaWQsIG9yaWdpbjogcm8ub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiByby5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHJvLmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHJvLmRlcGFydHVyZSwgYXJyaXZhbDogcm8uYXJyaXZhbCwgY2Fycmllcjogcm8uY2FycmllciwgY2Fycmllck5hbWU6IHJvLmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHJvLmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogcm8uZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHJvLm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiByby5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiByby5tZWFsLCBzZWF0OiByby5zZWF0LCBhaXJjcmFmdDogcm8uYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcChpLnJvdXRlcywgZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBvcmlnaW46IHQub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiB0Lm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogdC5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiB0LmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHQuZGVwYXJ0dXJlLCBhcnJpdmFsOiB0LmFycml2YWwsIGNhcnJpZXI6IHQuY2FycmllciwgY2Fycmllck5hbWU6IHQuY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogdC5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiB0LmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiB0Lm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiB0LmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHQubWVhbCwgc2VhdDogdC5zZWF0LCBhaXJjcmFmdDogdC5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscycsIGRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnN1bW1hcnknLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MucGVuZGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5sb2dnZWRpbicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnZXJyb3JNc2cyJywgZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ2Vycm9yMicsICdOb3QgRm91bmQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMyJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9yTXNnMicsICdTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxufSk7XHJcbm1vZHVsZS5leHBvcnRzID0gR3Vlc3RCb29raW5nO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5qc1xuICoqIG1vZHVsZSBpZCA9IDE1OVxuICoqIG1vZHVsZSBjaHVua3MgPSAyXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRlbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yc1wiLFwiZXJyb3JNc2dcIl0sXCJzXCI6XCJfMHx8XzFcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcImxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJzdWJtaXR0aW5nXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcImdldHRpY2tldGJ5cG5yXCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdHdvIGNvbHVtbiBtaWRkbGUgYWxpZ25lZCBjZW50ZXIgYWxpZ25lZCByZWxheGVkIGZpdHRlZCBzdGFja2FibGUgXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBzZWdtZW50XCIsXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIm1vYmlsZVwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJtb2JpbGVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZSAvIEVtYWlsXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwicG5yXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInBuclwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQTlIgLyBCb29raW5nIElkLlwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcImFcIjp7XCJ0eXBlXCI6XCJzdWJtaXRcIixcImNsYXNzXCI6XCJ1aSBmbHVpZCBibHVlIGJ1dHRvbiBcIn0sXCJmXCI6W1wiU1VCTUlUXCJdfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBob3Jpem9udGFsIGRpdmlkZXJcIn0sXCJmXCI6W1wiT1JcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCIsXCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wiZXJyb3JcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImVycm9yczJcIixcImVycm9yTXNnMlwiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInN1Ym1pdHRpbmcyXCJ9XSxcInN0eWxlXCI6XCJwb3NpdGlvbjogcmVsYXRpdmU7XCJ9LFwidlwiOntcInN1Ym1pdFwiOntcIm1cIjpcImdldHRpY2tldGJ5bGFzdG5hbWVcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0d28gY29sdW1uIG1pZGRsZSBhbGlnbmVkIGNlbnRlciBhbGlnbmVkIHJlbGF4ZWQgZml0dGVkIHN0YWNrYWJsZSBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIixcInN0eWxlXCI6XCJtYXgtd2lkdGg6IDMwMHB4OyBtYXJnaW46IGF1dG87IHRleHQtYWxpZ246IGxlZnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibGFzdG5hbWVcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwibGFzdG5hbWVcIn1dLFwiY2xhc3NcIjpcImZsdWlkIFwiLFwicGxhY2Vob2xkZXJcIjpcIkxhc3QgTmFtZVwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcInBucjJcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwicG5yMlwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQTlIgLyBCb29raW5nIElkLlwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2cyXCJ9XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JNc2cyXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzMlwifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzMlwiLFwiZXJyb3JNc2cyXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIGZsdWlkIGJsdWUgYnV0dG9uIFwifSxcImZcIjpbXCJTVUJNSVRcIl19XX1dfV19XX1dfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL2d1ZXN0dGlja2V0L2d1ZXN0Ym9va2luZy5odG1sXG4gKiogbW9kdWxlIGlkID0gMTYwXG4gKiogbW9kdWxlIGNodW5rcyA9IDJcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXHJcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIGFjY291bnRpbmcgPSByZXF1aXJlKCdhY2NvdW50aW5nLmpzJylcclxuICAgICAgICAvL015dHJhdmVsbGVyID0gcmVxdWlyZSgnYXBwL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpICAgO1xyXG4gICAgICAgIDtcclxuXHJcblxyXG52YXIgdDJtID0gZnVuY3Rpb24gKHRpbWUpIHtcclxuICAgIHZhciBpID0gdGltZS5zcGxpdCgnOicpO1xyXG5cclxuICAgIHJldHVybiBpWzBdICogNjAgKyBpWzFdO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXlib29raW5ncy9kZXRhaWxzLmh0bWwnKSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZW1haWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZm9ybWF0QmlydGhEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUaXRsZTogZnVuY3Rpb24gKHRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aXRsZXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0VHJhdmVsRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMjogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIE1NTSBEIFlZWVknKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMzogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIEhIOm1tJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1czogZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29uZmlybSc7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdub3Rjb25maXJtJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbmZpcm1lZCc7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3QgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYWJib29raW5nU3RhdHVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQoc3QsIHsnaWQnOiBzdGF0dXN9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlmZjogZnVuY3Rpb24gKGVuZCwgc3RhcnQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbXMgPSBtb21lbnQoZW5kLCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZGlmZihtb21lbnQoc3RhcnQsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG1vbWVudC5kdXJhdGlvbihtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihkLmFzSG91cnMoKSkgKyAnaCAnICsgZC5taW51dGVzKCkgKyAnbSc7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3M6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJzID09IDEgfHwgYnMgPT0gMiB8fCBicyA9PSAzIHx8ICBicyA9PSA3KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInByb2dyZXNzXCI7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA0IHx8IGJzID09IDUgfHwgYnMgPT0gNiB8fCBicyA9PSAxMilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjYW5jZWxsZWRcIjtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJzID09IDggfHwgYnMgPT0gOSB8fCBicyA9PSAxMCB8fCBicyA9PSAxMSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJib29rZWRcIjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdTdGF0dXNNZXNzYWdlOiBmdW5jdGlvbiAoYnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBia3MgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYm9va2luZ1N0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQoYmtzLCB7J2lkJzogYnN9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udmVydDogZnVuY3Rpb24gKGFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoYW1vdW50LCAnJywgMCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnZlcnRJeGlnbzogZnVuY3Rpb24gKGFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY291bnRpbmcudW5mb3JtYXQoYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICcnLCAwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIHRvZ2dsZWVtYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3N1Ym1pdHRpbmcnKSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0KCdtZXRhLnVzZXIuZW1haWwnKTtcclxuICAgICAgICAvL3RoaXMuc2V0KCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAkKCcjZW1haWwnKS52YWwoZW1haWwpO1xyXG4gICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAvLyB0aGlzLnNpZ25pbigpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbmluaXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vbignYmFjaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwibXlib29raW5ncy9cIikgPiAtMSlcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwibXlib29raW5nc1wiKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3N1bW1hcnknLCB0cnVlKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwiZ3Vlc3Rib29raW5nXCIpID4gLTEpXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvZ3Vlc3Rib29raW5nJztcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdjYW5jZWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdhbWVuZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2NhbmNlbCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3Jlc2NoZWR1bGUnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25pbm4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdyZXNjaGVkdWxlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnYW1lbmQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdyZXNjaGVkdWxlJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnY2FuY2VsJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaWduaW5uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdwcmludGRpdicsIGZ1bmN0aW9uIChldmVudCwgaWQpIHtcclxuICAgICAgICAgICAgLy93aW5kb3cucHJpbnQoKTtcclxuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9haXJDYXJ0L3ByaW50LycgKyBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbignYXNQREYnLCBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XHJcbiAgICAgICAgICAgIC8vd2luZG93LmxvY2F0aW9uKCcvYjJjL2FpckNhcnQvYXNQREYvJytpZCk7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FpckNhcnQvYXNQREYvXCIgKyBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbignY2xvc2VtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICQoJy51aS5wb3NpdGl2ZS5tZXNzYWdlJykuZmFkZU91dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICQoJy5tZXNzYWdlJykuZmFkZUluKCk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvc2VuZEVtYWlsLycgKyB2aWV3LmdldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWQnKSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtlbWFpbDogJCgnI2VtYWlsJykudmFsKCksIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LmRlZmVycmVkLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JNc2cnLCAnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgXHJcbiAgICB9LFxyXG4gICAgc2lnbmlubjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyh2aWV3LmdldCgnbXlib29raW5ncycpKTtcclxuICAgICAgICBBdXRoLmxvZ2luKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCdteWJvb2tpbmdzJykuY3VycmVudENhcnREZXRhaWxzLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnbWV0YS51c2VyJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzLycgKyB2aWV3LmdldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvZGV0YWlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDE2MVxuICoqIG1vZHVsZSBjaHVua3MgPSAyIDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwb3NpdGl2ZSAgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6IG5vbmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9LFwidlwiOntcImNsaWNrXCI6XCJjbG9zZW1lc3NhZ2VcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlNlbmRpbmcgRW1haWwuLlwiXSxcIm5cIjo1MCxcInJcIjpcIi4vc3VibWl0dGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJFbWFpbCBTZW50XCJdLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLnByaW50XCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiYm94IG15LWJvb2tpbmdzLWRldGFpbHMgXCIse1widFwiOjQsXCJmXCI6W1widWkgc2VnbWVudCBsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5wZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDNcIixcImZcIjpbXCJNeSBCb29raW5ncyBEZXRhaWxzXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiIG5vcHJpbnQgdWkgZ3JpZCB0aHJlZSBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJyZXNjaGVkdWxlXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbGVyIHVpIGJ1dHRvbiBvcmFuZ2VcIn0sXCJmXCI6W1wiQ2hhbmdlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJjYW5jZWxcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsZXIgdWkgYnV0dG9uIHJlZFwifSxcImZcIjpbXCJDYW5jZWxcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1widXBjb21pbmdcIl0sXCJzXCI6XCJfMD09XFxcInRydWVcXFwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJiYWNrXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbGVyIHVpIGJ1dHRvbiB5ZWxsb3dcIn0sXCJmXCI6W1wiQmFja1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCIgbm9wcmludCB1aSBncmlkIHRocmVlIGNvbHVtblwiLFwic3R5bGVcIjpcIndpZHRoOjEwMCVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFjdGlvblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiI1wiLFwiY2xhc3NcIjpcImVtYWlsXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidG9nZ2xlZW1haWxcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZD0nZGlzYWJsZWQnXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzdWJtaXR0aW5nXCJdLFwic1wiOlwiIV8wXCJ9fV0sXCJmXCI6W1wiRW1haWxcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvYXNQREYvXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZFwifV0sXCJ0YXJnZXRcIjpcIl9ibGFua1wiLFwiY2xhc3NcIjpcInBkZlwifSxcImZcIjpbXCJQREZcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbW9kYWwgc21hbGwgbWFpbHRpY2tldFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJFbWFpbCBUaWNrZXRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgZm9ybSBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9XSxcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbnB1dCBzbWFsbFwiLFwidHlwZVwiOlwidGV4dFwiLFwibmFtZVwiOlwiZW1haWxcIixcImlkXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpcIlwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzbWFsbCBidXR0b24gZmx1aWQgeWVsbG93XCJ9LFwiZlwiOltcIlNlbmRcIl19XX1dfV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MucHJpbnRcIl0sXCJzXCI6XCIhXzBcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBncmlkIGdyb3VwIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3NcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBncmlkIHR3byBjb2x1bW5cIixcInN0eWxlXCI6XCJ3aWR0aDoxMDAlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIiB0YWJsZSB0aXRsZSBcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuc291cmNlXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wiLFwic3R5bGVcIjpcIm1hcmdpbi10b3A6IDNweDtcIn0sXCJmXCI6W1wiwqBcIl19LHtcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5kZXN0aW5hdGlvblwifV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZSB0aXRsZVwiLFwic3R5bGVcIjpcImZsb2F0OmxlZnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5zb3VyY2VcIn0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhY2tcIixcInN0eWxlXCI6XCJtYXJnaW4tdG9wOiAzcHg7XCJ9LFwiZlwiOltcIsKgXCJdfSx7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuZGVzdGluYXRpb25cIn1dfV19XSxcInhcIjp7XCJyXCI6W1wicmV0dXJuZGF0ZVwiXSxcInNcIjpcIl8wPT1udWxsXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW4gdGFibGUgdGl0bGVcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJzb3VyY2VcIn0sXCLCoCB8IMKgXCJdLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZ3NcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInJcIjpbXCJib29raW5ncy5sZW5ndGhcIl0sXCJzXCI6XCJfMC0xXCJ9LFwiZGVzdGluYXRpb25cIl19fV19XX1dLFwieFwiOntcInJcIjpbXCJpc011bHRpQ2l0eVwiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCIgdGFibGUgdGl0bGVcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGF0ZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImJvb2tpbmdzLjAuZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBncmlkIHR3byBjb2x1bW5cIixcInN0eWxlXCI6XCJ3aWR0aDoxMDAlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCIgdGFibGUgdGl0bGVcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ1N0YXR1c0NsYXNzXCIsXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nX3N0YXR1c21zZ1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiIHRhYmxlIHRpdGxlXCIsXCJzdHlsZVwiOlwiZmxvYXQ6bGVmdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tpbmctaWRcIn0sXCJmXCI6W1wiQm9va2luZyBJZDogXCIse1widFwiOjIsXCJyXCI6XCJpZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nRGF0ZVwiLFwiY3JlYXRlZFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlcldyYXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJQYXNzZW5nZXI6XCJdfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcInRpdGxlXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiZmlyc3RfbmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImxhc3RfbmFtZVwifSxcIiAoXCIse1widFwiOjIsXCJyXCI6XCJ0eXBlXCJ9LFwiKSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1widHJhdmVsbGVyQm9va2luZ1N0YXR1c1wiLFwic3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInN0YXR1c21zZ1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJDUlMgUE5SOlwiXX0se1widFwiOjIsXCJyXCI6XCJjcnNfcG5yXCJ9LFwiLCBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJBaXIgUE5SOlwiXX0se1widFwiOjIsXCJyXCI6XCJhaXJsaW5lX3BuclwifSxcIiwgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiVGlja2V0IE5vLjpcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwidGlja2V0XCJ9XX1dfV0sXCJpXCI6XCJ0XCIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJ0cmF2ZWxsZXJcIl19fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzaXh0ZWVuIHdpZGUgY29sdW1uIFwiLFwic3R5bGVcIjpcImhlaWdodDogYXV0byAhaW1wb3J0YW50O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudCBmbGlnaHQtaXRpbmVyYXJ5IGNvbXBhY3QgZGFya1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGl0bGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjaXR5XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInNvdXJjZVwifSxcIiDihpIgXCIse1widFwiOjIsXCJyXCI6XCJkZXN0aW5hdGlvblwifV19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlMlwiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidGltZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHR0aW1lXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzZWdtZW50V3JhcFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudHNcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGl2aWRlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImxheW92ZXJcIn0sXCJmXCI6W1wiTGF5b3ZlcjogXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImRpZmZcIixcImtcIixcImpcIixcImJvb2tpbmdzXCJdLFwic1wiOlwiXzAoXzNbXzJdLnJvdXRlc1tfMV0uZGVwYXJ0dXJlLF8zW18yXS5yb3V0ZXNbXzEtMV0uYXJyaXZhbClcIn19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImtcIl0sXCJzXCI6XCJfMD4wXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLW5hbWVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLWxvZ29cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRvcCBhbGlnbmVkIGF2YXRhciBpbWFnZVwiLFwic3JjXCI6W1wiL2ltZy9haXJfbG9nb3MvXCIse1widFwiOjIsXCJyXCI6XCJjYXJyaWVyXCJ9LFwiLnBuZ1wiXSxcImFsdFwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9XSxcInRpdGxlXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllck5hbWVcIn1dfX1dfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiY2FycmllclwifSxcIi1cIix7XCJ0XCI6MixcInJcIjpcImZsaWdodE51bWJlclwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZyb21cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm9yaWdpblwifSxcIjpcIl19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlM1wiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJkZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wic3R5bGVcIjpcInRleHQtYWxpZ246IHJpZ2h0O1wiLFwiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwib3JpZ2luRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmxpZ2h0XCJ9LFwiZlwiOltcIsKgXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25cIn0sXCI6XCJdfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZTNcIixcImFycml2YWxcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImFycml2YWxcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25EZXRhaWxzXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lLW4tY2FiaW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0dGltZVwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwidHJhdmVsbGVyXCIse1wiclwiOltdLFwic1wiOlwiMFwifSxcImNhYmluXCJdfX1dfV19XSxcImlcIjpcImtcIixcInJ4XCI6e1wiclwiOlwiYm9va2luZ3NcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwialwifSxcInJvdXRlc1wiXX19XX1dfV19XX1dfV0sXCJpXCI6XCJqXCIsXCJyXCI6XCJib29raW5nc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b3RhbFwifSxcImZcIjpbXCJUT1RBTCBQUklDRTogXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY3VyZW5jeVwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY29udmVydFwiLFwidG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGF4ZXNcIn0sXCJmXCI6W1wiQmFzaWMgRmFyZSA6IFwiLHtcInRcIjoyLFwiclwiOlwiYmFzZXByaWNlXCJ9LFwiICwgVGF4ZXMgOiBcIix7XCJ0XCI6MixcInJcIjpcInRheGVzXCJ9LFwiICwgRmVlIDogXCIse1widFwiOjIsXCJyXCI6XCJmZWVcIn1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjogYm90aDtcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwicGFzc2VuZ2VyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhcIixcImFcIjp7XCJjb2xzcGFuXCI6XCI0XCJ9LFwiZlwiOltcIlRlcm1zIGFuZCBDb25kaXRpb25zXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJBbGwgZmxpZ2h0IHRpbWluZ3Mgc2hvd24gYXJlIGxvY2FsIHRpbWVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlVzZSBcIix7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJSZWYgTm8uXCJdfSxcIiBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIHVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlVzZSBcIix7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJBaXJsaW5lIFBOUlwiXX0sXCIgZm9yIGNvbnRhY3RpbmcgdGhlIEFpcmxpbmVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkNhcnJ5IGEgcHJpbnQtb3V0IG9mIGUtdGlja2V0IGZvciBjaGVjay1pbi5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJJbiBjYXNlIG9mIG5vLXNob3csIHRpY2tldHMgYXJlIG5vbi1yZWZ1bmRhYmxlLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkVuc3VyZSB5b3VyIHBhc3Nwb3J0IGlzIHZhbGlkIGZvciBtb3JlIHRoYW4gNiBtb250aHMuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiUGxlYXNlIGNoZWNrIFRyYW5zaXQgJiBEZXN0aW5hdGlvbiBWaXNhIFJlcXVpcmVtZW50LlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkZvciBjYW5jZWxsYXRpb24sIGFpcmxpbmUgY2hhcmdlcyAmIHNlci4gZmVlIGFwcGx5LlwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiQ2FycnkgYSBwaG90byBJRC8gUGFzc3BvcnQgZm9yIGNoZWNrLWluLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIk1lYWxzLCBTZWF0ICYgU3BlY2lhbCBSZXF1ZXN0cyBhcmUgbm90IGd1YXJhbnRlZWQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiUHJlc2VudCBGcmVxdWVudCBGbGllciBDYXJkIGF0IGNoZWNrLWluLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkNhcnJpYWdlIGlzIHN1YmplY3QgdG8gQWlybGluZXMgVGVybXMgJiBDb25kaXRpb25zLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkVuc3VyZSBwYXNzZW5nZXIgbmFtZXMgYXJlIGNvcnJlY3QsIG5hbWUgY2hhbmdlIGlzIG5vdCBwZXJtaXR0ZWQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiRm9yIGFueSBjaGFuZ2UgQWlybGluZSBjaGFyZ2VzLCBkaWZmZXJlbmNlIG9mIGZhcmUgJiBzZXIuIGZlZSBhcHBseS5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJZb3UgbWlnaHQgYmUgYXNrZWQgdG8gcHJvdmlkZSBjYXJkIGNvcHkgJiBJRCBwcm9vZiBvZiBjYXJkIGhvbGRlci5cIl19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwiY2xlYXI6IGJvdGg7XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJcIn0sXCJmXCI6W1wiRGlzY2xhaW1lcjogQ2hlYXBUaWNrZXQgaXMgbm90IGxpYWJsZSBmb3IgYW55IGRlZmljaWVuY3kgaW4gc2VydmljZSBieSBBaXJsaW5lIG9yIFNlcnZpY2UgcHJvdmlkZXJzLlwiXX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnByaW50XCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNjcmlwdFwiLFwiYVwiOntcInR5cGVcIjpcInRleHQvamF2YXNjcmlwdFwifSxcImZcIjpbXCJ3aW5kb3cuaXhpVHJhbnNhY3Rpb25UcmFja2VyID0gZnVuY3Rpb24odGFnKSB7XFxyXFxuZnVuY3Rpb24gdXBkYXRlUmVkaXJlY3QodGFnLCB0cmFuc2FjdGlvbklELCBwbnIsIHNhbGVWYWx1ZSwgc2VnbWVudE5pZ2h0cykge1xcclxcbnJldHVybiBcXFwiPGltZyBzdHlsZT0ndG9wOi05OTk5OTlweDtsZWZ0Oi05OTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZScgc3JjPSdodHRwczovL3d3dy5peGlnby5jb20vaXhpLWFwaS90cmFja2VyL3VwZGF0ZUNvbnZlcnNpb24vXFxcIiArIHRhZyArIFxcXCI/dHJhbnNhY3Rpb25JZD1cXFwiICsgdHJhbnNhY3Rpb25JRCArIFxcXCImcG5yPVxcXCIgKyBwbnIgKyBcXFwiJnNhbGVWYWx1ZT1cXFwiICsgc2FsZVZhbHVlICsgXFxcIiZzZWdtZW50TmlnaHRzPVxcXCIgKyBzZWdtZW50TmlnaHRzICsgXFxcIicgLz5cXFwiO1xcclxcbn1cXHJcXG5kb2N1bWVudC5ib2R5LmlubmVySFRNTCArPSB1cGRhdGVSZWRpcmVjdCh0YWcsIFxcXCJcIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkXCJ9LFwiXFxcIiwgXFxcIlwiLHtcInRcIjoyLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuYm9va2luZ3MuMC50cmF2ZWxsZXIuMC5haXJsaW5lX3BuclwifSxcIlxcXCIsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjb252ZXJ0SXhpZ29cIixcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLnRvdGFsQW1vdW50XCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiwgXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5zZWdOaWdodHNcIn0sXCIgKTtcXHJcXG59O1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzY3JpcHRcIixcImFcIjp7XCJzcmNcIjpcImh0dHBzOi8vd3d3Lml4aWdvLmNvbS9peGktYXBpL3RyYWNrZXIvdHJhY2sxOTZcIixcImlkXCI6XCJ0cmFja2VyXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MuY2xpZW50U291cmNlSWRcIl0sXCJzXCI6XCJfMD09NFwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLnByaW50XCJdLFwic1wiOlwiIV8wXCJ9fV19XSxcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzXCJ9XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9teWJvb2tpbmdzL2RldGFpbHMuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDE2MlxuICoqIG1vZHVsZSBjaHVua3MgPSAyIDNcbiAqKi8iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9sZXNzL21vYmlsZS9ndWVzdGZpbHRlci5sZXNzXG4gKiogbW9kdWxlIGlkID0gMTYzXG4gKiogbW9kdWxlIGNodW5rcyA9IDJcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9