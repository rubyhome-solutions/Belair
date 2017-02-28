webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(173);


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

/***/ 173:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  Mybookings = __webpack_require__(174);
	__webpack_require__(180);
	
	$(function() {
	    (new Mybookings()).render('#app');
	});

/***/ },

/***/ 174:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	        Auth = __webpack_require__(69),
	        MybookingData = __webpack_require__(82),
	        Meta = __webpack_require__(77)
	//    ,
	//    User = require('stores/user/user')
	        ;
	
	//require('modules/mybookings/mybookings.less');
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(175),
	    components: {
	        'layout': __webpack_require__(72),
	        summary: __webpack_require__(176),
	        details: __webpack_require__(161),
	        amendment: __webpack_require__(178),
	      //  leftpanel: require('components/layouts/profile_sidebar')
	                // travellerlist: require('./list'),
	                //  profilesidebar: require('../layouts/profile_sidebar')
	    },
	    partials: {
	        'base-panel': __webpack_require__(71)
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
	                    console.log(data);
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

/***/ 175:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}],"mybookings":[{"t":2,"r":"mybookings"}]},"f":[" ",{"t":4,"f":[{"t":7,"e":"amendment","a":{"class":"segment centered ","mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"r":"mybookings.amend"},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"summary","a":{"class":"segment centered","mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"n":50,"r":"mybookings.summary"},{"t":4,"n":51,"f":[{"t":7,"e":"details","a":{"class":"segment centered","mybookings":[{"t":2,"r":"mybookings"}],"meta":[{"t":2,"r":"meta"}]}}],"r":"mybookings.summary"}],"r":"mybookings.amend"}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	        moment = __webpack_require__(20),
	        _ = __webpack_require__(35),
	        accounting = __webpack_require__(105);
	//,
	//Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(177),
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
	                        id: data.id, upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency,
	                        fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,ticketstatusmsg:data.ticketstatusmsg,
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

/***/ 177:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"mybookingsclass"},"f":[{"t":7,"e":"header","f":[{"t":7,"e":"div","a":{"class":"ui three column grid"},"f":[{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"id":"m_btn","class":"main_mnu","href":"#"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/bars.png","alt":"menu"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column"},"f":[{"t":7,"e":"a","a":{"class":"logo","href":"javascript:;"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/logo.png","alt":"CheapTicket.in"}}]}]}," ",{"t":7,"e":"div","a":{"class":"column right aligned"},"f":[{"t":7,"e":"a","a":{"id":"right_menu","class":"profile","href":"javascript:;"},"f":[{"t":7,"e":"img","a":{"src":"/themes/B2C/img/mobile/profile.png","alt":"Profile"}}]}]}]}," ",{"t":7,"e":"div","a":{"id":"m_menu","class":"ui left vertical sidebar menu push scale down overlay"},"f":[{"t":7,"e":"div","a":{"class":"avat"},"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"img","a":{"id":"avatar","class":"ui avatar liitle image","src":"/themes/B2C/img/mobile/avat.png"}}," ",{"t":7,"e":"div","a":{"class":"description"},"f":["WELCOME ",{"t":7,"e":"br"}," ",{"t":4,"f":[{"t":7,"e":"h1","a":{"id":"name"},"f":[{"t":2,"r":"meta.user.name"}]}],"n":50,"x":{"r":["meta.user"],"s":"_0!=null"}},{"t":4,"n":51,"f":[{"t":7,"e":"h1","a":{"id":"name"},"f":["Guest User"]}],"x":{"r":["meta.user"],"s":"_0!=null"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"a","a":{"class":"ui blue fluid button","href":"/site/logout"},"f":["Logout"]}],"n":50,"r":"meta.user"}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"prof"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/myprofile/"},"f":["My Profile"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"book"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mybookings/"},"f":["My Bookings"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"trav"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/mytraveller/"},"f":["Travellers"]}]}]}," ",{"t":7,"e":"span","a":{"id":"devider","class":"item"},"f":["QUICK TOOLS"]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"print"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/guestbooking"},"f":["Print / View Ticket"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"cancel"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/guestbooking"},"f":["Cancelations"]}]}]}," ",{"t":7,"e":"a","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"change"}}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":"/b2c/mobile/guestbooking"},"f":["Change / Reschedule"]}]}]}]}]}," ",{"t":7,"e":"div","a":{"class":["box reschedule ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":7,"e":"div","a":{"class":"ui positive  message","style":"display: none"},"f":[{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":"closemessage"}}," Email Sent"]}," ",{"t":7,"e":"div","a":{"class":"ui modal small mailticket"},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":["Email Ticket"]}," ",{"t":7,"e":"div","a":{"class":"ui basic segment"},"f":[{"t":7,"e":"form","a":{"class":["ui form ",{"t":4,"f":["loading"],"n":50,"r":"./submitting"}],"action":"javascript:;"},"v":{"submit":{"m":"submit","a":{"r":[],"s":"[]"}}},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"input","a":{"class":"ui input small","type":"text","value":[{"t":2,"r":"./uemail"}]}}]}," ",{"t":7,"e":"input","a":{"class":"ui input small","type":"hidden","id":"cid","value":[{"t":2,"r":"./cid"}]}}," ",{"t":7,"e":"div","a":{"class":"actions"},"f":[{"t":7,"e":"button","a":{"type":"submit","class":"ui small button fluid yellow"},"f":["Send"]}]}]}]}]}," ",{"t":7,"e":"h3","f":["My Bookings"]}," ",{"t":7,"e":"h4","f":["Upcoming Trips"]}," ",{"t":7,"e":"div","a":{"class":"group "},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.carts.length"],"s":"_0==0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.flgUpcoming"],"s":"!_0"}}],"x":{"r":["mybookings.carts.length"],"s":"_0==0"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["item stackable ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"v":{"click":{"n":"getdetail","d":[{"t":2,"r":"id"}]}},"f":[{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"to"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"back"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"name"},"  |  "],"i":"i","r":"traveler.0.src"}," ",{"t":2,"rx":{"r":"traveler.0.dest","m":[{"r":["traveler.0.dest.length"],"s":"_0-1"},"name"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[" ",{"t":7,"e":"a","a":{"class":"email","title":"Email"},"v":{"click":{"n":"toggleemail","d":[{"t":2,"r":"id"},",",{"t":2,"r":"email"}]}}}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/asPDF/",{"t":2,"r":"id"}],"target":"_blank","class":"pdf","title":"Download PDF"}}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"hr"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"traveller"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  "],"n":50,"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  | "],"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}}],"i":"i","r":"traveler"}," ",{"t":7,"e":"span","a":{"class":"status booked"},"f":["Details"]}]}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":7,"e":"span","a":{"class":"curr"},"f":[{"t":3,"r":"curency"}]}," ",{"t":2,"x":{"r":["money","totalAmount"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["formatBookingStatusMessage","booking_status"],"s":"_0(_1)"}}]}]}]}]}],"n":50,"x":{"r":["upcoming"],"s":"_0==\"true\""}}],"n":52,"i":"i","r":"mybookings.carts"}]}," ",{"t":7,"e":"h4","f":["Previous Trips"]}," ",{"t":7,"e":"div","a":{"class":"group "},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.carts.length"],"s":"_0==0"}},{"t":4,"n":51,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message"},"f":["No Trips Found !!"]}],"n":50,"x":{"r":["mybookings.flgPrevious"],"s":"!_0"}}],"x":{"r":["mybookings.carts.length"],"s":"_0==0"}}," ",{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["item previous stackable ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"v":{"click":{"n":"getdetail","d":[{"t":2,"r":"id"}]}},"f":[{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"to"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"traveler.0.src.0.name"},{"t":7,"e":"span","a":{"class":"back"},"f":[" "]},{"t":2,"r":"traveler.0.dest.0.name"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"name"},"  |  "],"i":"i","r":"traveler.0.src"}," ",{"t":2,"rx":{"r":"traveler.0.dest","m":[{"r":["traveler.0.dest.length"],"s":"_0-1"},"name"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"div","a":{"class":"action"},"f":[" ",{"t":7,"e":"a","a":{"class":"email","title":"Email"},"v":{"click":{"n":"toggleemail","d":[{"t":2,"r":"id"},",",{"t":2,"r":"email"}]}}}," ",{"t":7,"e":"a","a":{"href":["/b2c/airCart/asPDF/",{"t":2,"r":"id"}],"target":"_blank","class":"pdf","title":"Download PDF"}}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"hr"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"table"},"f":[{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"traveller"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  "],"n":50,"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}},{"t":4,"n":51,"f":[{"t":7,"e":"a","a":{"href":"#"},"f":[{"t":2,"x":{"r":["formatName","i","traveler"],"s":"_0(_2[_1].name)"}}]},"  | "],"x":{"r":["i","traveler.length"],"s":"_0==(_1-1)"}}],"i":"i","r":"traveler"}]}]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"price"},"f":[{"t":7,"e":"span","a":{"class":"curr"},"f":[{"t":3,"r":"curency"}]}," ",{"t":2,"x":{"r":["money","totalAmount"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["formatBookingStatusMessage","booking_status"],"s":"_0(_1)"}}]}]}]}]}],"n":50,"x":{"r":["upcoming"],"s":"_0==\"false\""}}],"n":52,"i":"i","r":"mybookings.carts"}]}]}]}]};

/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(29),
	        moment = __webpack_require__(20),
	        _ = __webpack_require__(35),
	        Q = __webpack_require__(30),
	        accounting = __webpack_require__(105)
	        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
	        ;
	
	
	var t2m = function (time) {
	    var i = time.split(':');
	
	    return i[0] * 60 + i[1];
	};
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(179),
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
	        console.log(arrayOfIds);
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
	                            console.log(data);
	                            //location.reload();
	                            // location.hash = '#cartAmendments';
	                            resolve();
	                        } else {
	                            console.log('rejected');
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
	                    console.log('finished');
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

/***/ 179:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"div","a":{"class":"ui login modal "},"f":[{"t":7,"e":"i","a":{"class":"close icon"}}," ",{"t":7,"e":"div","a":{"class":"header"},"f":[{"t":4,"f":["Ticket Cancellation"],"n":50,"r":"mybookings.cancel"}," ",{"t":4,"f":["Ticket Reschedule"],"n":50,"r":"mybookings.reschedule"}]}," ",{"t":7,"e":"div","a":{"id":"confirm"}}," ",{"t":7,"e":"div","a":{"class":["content ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":["my-bookings-details ",{"t":4,"f":["ui segment loading"],"n":50,"r":"mybookings.pending"}]},"f":[{"t":7,"e":"div","a":{"class":["group ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":7,"e":"div","a":{"class":"table title"},"f":[{"t":7,"e":"div","f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"to"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"n":50,"x":{"r":["returndate"],"s":"_0==null"}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":2,"r":"bookings.0.source"},{"t":7,"e":"span","a":{"class":"back"},"f":[" "]},{"t":2,"r":"bookings.0.destination"}]}],"x":{"r":["returndate"],"s":"_0==null"}}],"n":50,"x":{"r":["isMultiCity"],"s":"_0==\"false\""}},{"t":4,"n":51,"f":[{"t":7,"e":"span","a":{"class":"direction"},"f":[{"t":4,"f":[{"t":2,"r":"source"},"  |  "],"i":"i","r":"bookings"}," ",{"t":2,"rx":{"r":"bookings","m":[{"r":["bookings.length"],"s":"_0-1"},"destination"]}}]}],"x":{"r":["isMultiCity"],"s":"_0==\"false\""}}," ",{"t":7,"e":"span","a":{"class":"date"},"f":[{"t":2,"x":{"r":["formatTravelDate","bookings.0.departure"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["formatBookingStatusClass","booking_status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["formatBookingStatusMessage","booking_status"],"s":"_0(_1)"}}]}," ",{"t":7,"e":"br"}," "]}," ",{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"booking-id"},"f":["Booking Id: ",{"t":2,"r":"id"}]}," ",{"t":7,"e":"span","a":{"class":"booking-date"},"f":[{"t":2,"x":{"r":["formatBookingDate","created"],"s":"_0(_1)"}}]}]}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"passengerWrap"},"f":[{"t":7,"e":"div","a":{"class":"passenger"},"f":[{"t":4,"f":[{"t":7,"e":"ul","m":[{"t":4,"f":["class=\"negative\""],"n":50,"r":"selected"}],"f":[{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["Passenger:"]}," ",{"t":2,"r":"title"}," ",{"t":2,"r":"first_name"}," ",{"t":2,"r":"last_name"}," (",{"t":2,"r":"type"},") ",{"t":7,"e":"span","a":{"class":["status ",{"t":2,"x":{"r":["travellerBookingStatus","status"],"s":"_0(_1)"}}]},"f":[{"t":2,"x":{"r":["travellerBookingStatusMessage","status"],"s":"_0(_1)"}}]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"span","f":["CRS PNR:"]}," ",{"t":2,"r":"crs_pnr"},", ",{"t":7,"e":"span","f":["Air PNR:"]}," ",{"t":2,"r":"airline_pnr"},", ",{"t":7,"e":"span","f":["Ticket No.:"]}," ",{"t":2,"r":"ticket"}]}," ",{"t":7,"e":"li","f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"div","a":{"class":"ui checkbox "},"v":{"click":{"m":"select","a":{"r":["j","t"],"s":"[_0,_1]"}}},"f":[{"t":7,"e":"input","a":{"type":"checkbox","name":"selectedpassenger"}}," ",{"t":7,"e":"label","f":[{"t":4,"f":["Cancel"],"n":50,"r":"mybookings.cancel"}," ",{"t":4,"f":["Reschedule"],"n":50,"r":"mybookings.reschedule"}]}]}]}],"n":50,"x":{"r":["status","j","bookings"],"s":"(_0==2||_0==1)&&_2[_1].upcoming==\"true\""}}]}]}],"i":"t","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller"]}}]}]}]}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"sixteen wide column ","style":"height: auto !important;"},"f":[{"t":7,"e":"div","a":{"class":"ui segment flight-itinerary compact dark"},"f":[{"t":7,"e":"div","a":{"class":"title","style":"text-align:center;"},"f":[{"t":7,"e":"span","a":{"class":"city","style":"display:block;"},"f":[{"t":2,"r":"source"}," → ",{"t":2,"r":"destination"}]}," ",{"t":2,"x":{"r":["formatTravelDate2","departure"],"s":"_0(_1)"}}," ",{"t":7,"e":"span","a":{"class":"time"},"f":[{"t":2,"r":"flighttime"}]}]}," ",{"t":7,"e":"div","a":{"class":"segmentWrap"},"f":[{"t":7,"e":"div","a":{"class":"segments"},"f":[{"t":4,"f":[{"t":4,"f":[{"t":7,"e":"div","f":[{"t":7,"e":"span","a":{"class":"layover"},"f":["Layover: ",{"t":2,"x":{"r":["diff","k","j","bookings"],"s":"_0(_3[_2].routes[_1].departure,_3[_2].routes[_1-1].arrival)"}}]}]}],"n":50,"x":{"r":["k"],"s":"_0>0"}}," ",{"t":7,"e":"div","f":[{"t":7,"e":"div","a":{"class":"carrier-name"},"f":[{"t":7,"e":"span","a":{"class":"carrier-logo"},"f":[{"t":7,"e":"img","a":{"class":"ui top aligned avatar image","src":["/img/air_logos/",{"t":2,"r":"carrier"},".png"],"alt":[{"t":2,"r":"carrierName"}],"title":[{"t":2,"r":"carrierName"}]}}]}," ",{"t":2,"r":"carrierName"}," ",{"t":2,"r":"carrier"},"-",{"t":2,"r":"flightNumber"}]}," ",{"t":7,"e":"div","a":{"class":"from","style":"text-align: center;"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"origin"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","departure"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"style":"text-align: right;","class":"airport"},"f":[{"t":2,"r":"originDetails"}]}]}," ",{"t":7,"e":"div","a":{"class":"flight"},"f":[" "]}," ",{"t":7,"e":"div","a":{"class":"to"},"f":[{"t":7,"e":"b","f":[{"t":2,"r":"destination"},":"]}," ",{"t":2,"x":{"r":["formatTravelDate3","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"},{"t":2,"x":{"r":["formatTravelDate","arrival"],"s":"_0(_1)"}},{"t":7,"e":"br"}," ",{"t":7,"e":"span","a":{"class":"airport"},"f":[{"t":2,"r":"destinationDetails"}]}]}," ",{"t":7,"e":"div","a":{"class":"time-n-cabin","style":"text-align:center;"},"f":[{"t":7,"e":"div","f":[{"t":2,"r":"flighttime"},{"t":7,"e":"br"}," ",{"t":2,"rx":{"r":"bookings","m":[{"t":30,"n":"j"},"traveller",{"r":[],"s":"0"},"cabin"]}}]}]}]}],"i":"k","rx":{"r":"bookings","m":[{"t":30,"n":"j"},"routes"]}}]}]}]}]}]}],"i":"j","r":"bookings"}," ",{"t":7,"e":"div","a":{"class":"item"},"f":[{"t":7,"e":"div","a":{"class":"ui form"},"f":[{"t":7,"e":"div","a":{"class":"field"},"f":[{"t":7,"e":"label","f":["Reason For ",{"t":4,"f":["Ticket Cancellation"],"n":50,"r":"mybookings.cancel"}," ",{"t":4,"f":["Ticket Reschedule"],"n":50,"r":"mybookings.reschedule"}]}," ",{"t":7,"e":"textarea","a":{"id":"amendReason","name":"amendReason"}}]}]}]}," ",{"t":7,"e":"div","a":{"style":"clear:both;"}}," ",{"t":7,"e":"div","a":{"class":""},"f":[" ",{"t":4,"f":[{"t":7,"e":"button","v":{"click":{"m":"amendTicket","a":{"r":[],"s":"[2]"}}},"a":{"class":"large ui button red"},"f":["Reschedule"]}],"n":50,"r":"mybookings.reschedule"}," ",{"t":4,"f":[{"t":7,"e":"button","v":{"click":{"m":"amendTicket","a":{"r":[],"s":"[1]"}}},"a":{"class":"large ui button red"},"f":["Cancel"]}],"n":50,"r":"mybookings.cancel"}]}]}]}],"r":"mybookings.currentCartDetails"}]}]}]};

/***/ },

/***/ 180:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2FwcC9hdXRoLmpzP2I2OTIqIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sP2ZjOWMqIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teWJvb2tpbmdzL21ldGEuanM/MTRjNSoiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL3ZhbGlkYXRlL3ZhbGlkYXRlLmpzP2Y2YjUqIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9hbWQtZGVmaW5lLmpzPzBiYmEqIiwid2VicGFjazovLy8uL2pzL3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MuanM/Y2Y0MCoiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL2FjY291bnRpbmcuanMvYWNjb3VudGluZy5qcz8yNzlhKiIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvZGV0YWlscy5qcz9mZDY3Iiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9teWJvb2tpbmdzL2RldGFpbHMuaHRtbD85ZmVkIiwid2VicGFjazovLy8uL2pzL2FwcC9tb2JpbGUvbXlib29raW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvbXlib29raW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9teWJvb2tpbmdzL3N1bW1hcnkuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3Mvc3VtbWFyeS5odG1sIiwid2VicGFjazovLy8uL2pzL2NvbXBvbmVudHMvbXlib29raW5ncy9hbWVuZG1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL21vYmlsZS9tb2R1bGUvdGVtcGxhdGVzL215Ym9va2luZ3MvYW1lbmRtZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vbGVzcy9tb2JpbGUvbXlib29raW5ncy5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHdFQUF3RTtBQUMzRjtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0I7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVCxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLEVBQUM7OztBQUdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOEJBQTZCLE9BQU87QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzR0FBcUcsRUFBRTtBQUN2Rzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7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QUUsRUFBRSxHOzs7Ozs7O0FDQXgzTiwwQyIsImZpbGUiOiJqcy9teWJvb2tpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKSxcclxuICAgIFEgPSByZXF1aXJlKCdxJylcclxuICAgIDtcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJylcclxuICAgIDtcclxuXHJcbnZhciBBdXRoID0gRm9ybS5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sJyksXHJcblxyXG4gICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnbG9naW4nLFxyXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZm9yZ290dGVucGFzczogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICB1c2VyOiB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3BvcHVwJykpIHtcclxuICAgICAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc3VibWl0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvck1zZycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICcvYjJjL2F1dGgvJyArIHRoaXMuZ2V0KCdhY3Rpb24nKSxcclxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSwgcGFzc3dvcmQ6IHRoaXMuZ2V0KCd1c2VyLnBhc3N3b3JkJykgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFsnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2aWV3LmdldCgncG9wdXAnKT09bnVsbCAmJiBkYXRhICYmIGRhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldFBhc3N3b3JkOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL2ZvcmdvdHRlbnBhc3MnLFxyXG4gICAgICAgICAgICBkYXRhOiB7IGVtYWlsOiB0aGlzLmdldCgndXNlci5sb2dpbicpIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdWJtaXR0aW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgncmVzZXRzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaWdudXA6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldCgnZXJyb3JzJywgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYXV0aC9zaWdudXAnLFxyXG4gICAgICAgICAgICBkYXRhOiBfLnBpY2sodGhpcy5nZXQoJ3VzZXInKSwgWydlbWFpbCcsJ25hbWUnLCAnbW9iaWxlJywgJ3Bhc3N3b3JkJywgJ3Bhc3N3b3JkMiddKSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzaWdudXBzdWNjZXNzJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5BdXRoLmxvZ2luID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XHJcblxyXG4gICAgYXV0aC5zZXQoJ3BvcHVwJywgdHJ1ZSk7XHJcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xyXG4gICAgYXV0aC5yZW5kZXIoJyNwb3B1cC1jb250YWluZXInKTtcclxuXHJcbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xyXG59O1xyXG5cclxuQXV0aC5zaWdudXAgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBhdXRoID0gbmV3IEF1dGgoKTtcclxuXHJcbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcclxuICAgIGF1dGguc2V0KCdzaWdudXAnLCB0cnVlKTtcclxuICAgIGF1dGguZGVmZXJyZWQgPSBRLmRlZmVyKCk7XHJcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHJldHVybiBhdXRoLmRlZmVycmVkLnByb21pc2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGg7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanNcbiAqKiBtb2R1bGUgaWQgPSA2OVxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA2XG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBsb2dpbiBzbWFsbCBtb2RhbFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W1wiTG9naW5cIl0sXCJuXCI6NTEsXCJ4XCI6e1wiclwiOltcImZvcmdvdHRlbnBhc3NcIixcInNpZ251cFwiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiU2lnbi11cFwiXSxcIm5cIjo1MCxcInJcIjpcInNpZ251cFwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJSZXNldCBwYXNzd29yZFwiXSxcIm5cIjo1MCxcInJcIjpcImZvcmdvdHRlbnBhc3NcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250ZW50XCJ9LFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZvcm1cIn1dfV19XSxcIm5cIjo1MCxcInJcIjpcInBvcHVwXCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6OCxcInJcIjpcImZvcm1cIn1dLFwiclwiOlwicG9wdXBcIn1dLFwicFwiOntcImZvcm1cIjpbe1widFwiOjcsXCJlXCI6XCJmb3JtXCIsXCJhXCI6e1wiYWN0aW9uXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6W3tcInRcIjo0LFwiZlwiOltcImZvcm1cIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IGZvcm1cIl0sXCJ4XCI6e1wiclwiOltcInBvcHVwXCJdLFwic1wiOlwiIV8wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcInN1Ym1pdHRpbmdcIn1dLFwic3R5bGVcIjpcInBvc2l0aW9uOiByZWxhdGl2ZTtcIn0sXCJ2XCI6e1wic3VibWl0XCI6e1wibVwiOlwic3VibWl0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiW11cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZm9yZ290dGVucGFzc1wiLFwic2lnbnVwXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV0sXCJzdHlsZVwiOlwibWF4LXdpZHRoOiAzMDBweDsgbWFyZ2luOiBhdXRvOyB0ZXh0LWFsaWduOiBsZWZ0O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImxvZ2luXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIubG9naW5cIn1dLFwiY2xhc3NcIjpcImZsdWlkXCIsXCJwbGFjZWhvbGRlclwiOlwiTG9naW5cIn0sXCJmXCI6W119LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWktaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJwYXNzd29yZFwiLFwidHlwZVwiOlwicGFzc3dvcmRcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5wYXNzd29yZFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpbXCJ1aSBcIix7XCJ0XCI6NCxcImZcIjpbXCJzbWFsbFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicG9wdXBcIl0sXCJzXCI6XCIhXzBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOltdLFwieFwiOntcInJcIjpbXCJwb3B1cFwiXSxcInNcIjpcIiFfMFwifX0sXCIgZmx1aWQgYmx1ZSBidXR0b24gdXBwZXJjYXNlXCJdfSxcImZcIjpbXCJMT0dJTlwiXX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZXJyb3JNc2dcIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCJlcnJvck1zZ1wifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIi5cIn1dfV0sXCJuXCI6NTAsXCJyXCI6XCIuXCJ9XSxcIm5cIjo1MixcImlcIjpcImlcIixcInJcIjpcImVycm9yc1wifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzXCIsXCJlcnJvck1zZ1wiXSxcInNcIjpcIl8wfHxfMVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIixcImNsYXNzXCI6XCJmb3Jnb3QtcGFzc3dvcmRcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXFxcImZvcmdvdHRlbnBhc3NcXFwiLDFdXCJ9fX0sXCJmXCI6W1wiRm9yZ290IFBhc3N3b3JkP1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOltcIkRvbid0IGhhdmUgYSBDaGVhcFRpY2tldC5pbiBBY2NvdW50PyBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcImphdmFzY3JpcHQ6O1wifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNldFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltcXFwic2lnbnVwXFxcIiwxXVwifX19LFwiZlwiOltcIlNpZ24gdXAgZm9yIG9uZSDCu1wiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBiYXNpYyBzZWdtZW50IFwiLHtcInRcIjo0LFwiZlwiOltcImhpZGVcIl0sXCJuXCI6NTEsXCJyXCI6XCJzaWdudXBcIn1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwiZW1haWxcIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5lbWFpbFwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJFbWFpbFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcImVtYWlsXCIsXCJ2YWx1ZVwiOlt7XCJ0XCI6MixcInJcIjpcInVzZXIubW9iaWxlXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIk1vYmlsZVwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJ1aS1pbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcInBhc3N3b3JkXCIsXCJuYW1lXCI6XCJwYXNzd29yZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLnBhc3N3b3JkXCJ9XSxcImNsYXNzXCI6XCJmbHVpZFwiLFwicGxhY2Vob2xkZXJcIjpcIlBhc3N3b3JkXCJ9LFwiZlwiOltdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1widHlwZVwiOlwicGFzc3dvcmRcIixcIm5hbWVcIjpcInBhc3N3b3JkMlwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCJ1c2VyLnBhc3N3b3JkMlwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJQYXNzd29yZCBhZ2FpblwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIGZsdWlkIGJsdWUgYnV0dG9uIHVwcGVyY2FzZVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInNpZ251cFwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiU2lnbnVwXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV0sXCJuXCI6NTEsXCJyXCI6XCJzaWdudXBzdWNjZXNzXCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiWW91ciByZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3MuXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIllvdSB3aWxsIHJlY2VpdmUgZW1haWwgd2l0aCBmdXJ0aGVyIGluc3RydWN0aW9ucyBmcm9tIHVzIGhvdyB0byBwcm9jZWVkLlwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJQbGVhc2UgY2hlY2sgeW91ciBpbmJveCBhbmQgaWYgbm8gZW1haWwgZnJvbSB1cyBpcyBmb3VuZCwgY2hlY2sgYWxzbyB5b3VyIFNQQU0gZm9sZGVyLlwiXSxcIm5cIjo1MCxcInJcIjpcInNpZ251cHN1Y2Nlc3NcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGJhc2ljIHNlZ21lbnQgXCIse1widFwiOjQsXCJmXCI6W1wiaGlkZVwiXSxcIm5cIjo1MSxcInJcIjpcImZvcmdvdHRlbnBhc3NcIn1dLFwic3R5bGVcIjpcIm1heC13aWR0aDogMzAwcHg7IG1hcmdpbjogYXV0bzsgdGV4dC1hbGlnbjogbGVmdDtcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVpLWlucHV0XCIsXCJhXCI6e1wibmFtZVwiOlwibG9naW5cIixcInZhbHVlXCI6W3tcInRcIjoyLFwiclwiOlwidXNlci5sb2dpblwifV0sXCJjbGFzc1wiOlwiZmx1aWRcIixcInBsYWNlaG9sZGVyXCI6XCJFbWFpbFwifSxcImZcIjpbXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcImJ1dHRvblwiLFwiY2xhc3NcIjpcInVpIGZsdWlkIGJsdWUgYnV0dG9uIHVwcGVyY2FzZVwifSxcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcInJlc2V0UGFzc3dvcmRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIlJFU0VUXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJlcnJvck1zZ1wifV19XSxcIm5cIjo1MCxcInJcIjpcImVycm9yTXNnXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiLlwifV19XSxcIm5cIjo1MCxcInJcIjpcIi5cIn1dLFwiblwiOjUyLFwiaVwiOlwiaVwiLFwiclwiOlwiZXJyb3JzXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJlcnJvcnNcIixcImVycm9yTXNnXCJdLFwic1wiOlwiXzB8fF8xXCJ9fV0sXCJuXCI6NTEsXCJyXCI6XCJyZXNldHN1Y2Nlc3NcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiSW5zdHJ1Y3Rpb25zIGhvdyB0byByZXZpdmUgeW91ciBwYXNzd29yZCBoYXMgYmVlbiBzZW50IHRvIHlvdXIgZW1haWwuXCIse1widFwiOjcsXCJlXCI6XCJiclwifSxcIlBsZWFzZSBjaGVjayB5b3VyIGVtYWlsLlwiXSxcIm5cIjo1MCxcInJcIjpcInJlc2V0c3VjY2Vzc1wifV19XX1dfX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sXG4gKiogbW9kdWxlIGlkID0gNzBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNlxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICBRID0gcmVxdWlyZSgncScpLFxyXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbiAgICA7XHJcblxyXG52YXIgVmlldyA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKVxyXG4gICAgO1xyXG5cclxudmFyIE1ldGEgPSBWaWV3LmV4dGVuZCh7XHJcbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgICAgdGl0bGVzOiBmdW5jdGlvbigpIHsgcmV0dXJuIF8ubWFwKHZpZXcuZ2V0KCd0aXRsZXMnKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4geyBpZDogaS5pZCwgdGV4dDogaS5uYW1lIH07IH0pOyB9LFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbk1ldGEucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gbmV3IE1ldGEoe2RhdGE6IGRhdGF9KTtcclxufTtcclxuXHJcbk1ldGEuZmV0Y2ggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL2FpckNhcnQvbWV0YScpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgcmVzb2x2ZShNZXRhLnBhcnNlKGRhdGEpKTsgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbnZhciBpbnN0YW5jZSA9IG51bGw7XHJcbk1ldGEuaW5zdGFuY2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0YW5jZSA9IE1ldGEuZmV0Y2goKTtcclxuICAgICAgICByZXNvbHZlKGluc3RhbmNlKTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL215Ym9va2luZ3MvbWV0YS5qc1xuICoqIG1vZHVsZSBpZCA9IDc3XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzXG4gKiovIiwiLy8gICAgIFZhbGlkYXRlLmpzIDAuNy4xXG5cbi8vICAgICAoYykgMjAxMy0yMDE1IE5pY2tsYXMgQW5zbWFuLCAyMDEzIFdyYXBwXG4vLyAgICAgVmFsaWRhdGUuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgICAgRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuLy8gICAgIGh0dHA6Ly92YWxpZGF0ZWpzLm9yZy9cblxuKGZ1bmN0aW9uKGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cy5cbiAgLy8gVGhlIG9wdGlvbnMgYXJlIHRoZSBmb2xsb3dpbmc6XG4gIC8vICAgLSBmb3JtYXQgKHN0cmluZykgLSBBbiBvcHRpb24gdGhhdCBjb250cm9scyBob3cgdGhlIHJldHVybmVkIHZhbHVlIGlzIGZvcm1hdHRlZFxuICAvLyAgICAgKiBmbGF0IC0gUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YganVzdCB0aGUgZXJyb3IgbWVzc2FnZXNcbiAgLy8gICAgICogZ3JvdXBlZCAtIFJldHVybnMgdGhlIG1lc3NhZ2VzIGdyb3VwZWQgYnkgYXR0cmlidXRlIChkZWZhdWx0KVxuICAvLyAgICAgKiBkZXRhaWxlZCAtIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJhdyB2YWxpZGF0aW9uIGRhdGFcbiAgLy8gICAtIGZ1bGxNZXNzYWdlcyAoYm9vbGVhbikgLSBJZiBgdHJ1ZWAgKGRlZmF1bHQpIHRoZSBhdHRyaWJ1dGUgbmFtZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGVycm9yLlxuICAvL1xuICAvLyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBvcHRpb25zIGFyZSBhbHNvIHBhc3NlZCB0byBlYWNoIHZhbGlkYXRvci5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpXG4gICAgICAsIGF0dHJcbiAgICAgICwgdmFsaWRhdG9yO1xuXG4gICAgZm9yIChhdHRyIGluIHJlc3VsdHMpIHtcbiAgICAgIGZvciAodmFsaWRhdG9yIGluIHJlc3VsdHNbYXR0cl0pIHtcbiAgICAgICAgaWYgKHYuaXNQcm9taXNlKHJlc3VsdHNbYXR0cl1bdmFsaWRhdG9yXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2UgdmFsaWRhdGUuYXN5bmMgaWYgeW91IHdhbnQgc3VwcG9ydCBmb3IgcHJvbWlzZXNcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRlLnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICB2YXIgdiA9IHZhbGlkYXRlO1xuXG4gIC8vIENvcGllcyBvdmVyIGF0dHJpYnV0ZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2VzIHRvIGEgc2luZ2xlIGRlc3RpbmF0aW9uLlxuICAvLyBWZXJ5IG11Y2ggc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgZXh0ZW5kLlxuICAvLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHRhcmdldCBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIHdpbGwgYmVcbiAgLy8gdXNlZCBhcyB0YXJnZXRzLlxuICB2LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgYXR0ciBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW2F0dHJdID0gc291cmNlW2F0dHJdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgdi5leHRlbmQodmFsaWRhdGUsIHtcbiAgICAvLyBUaGlzIGlzIHRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IGFzIGEgc2VtdmVyLlxuICAgIC8vIFRoZSB0b1N0cmluZyBmdW5jdGlvbiB3aWxsIGFsbG93IGl0IHRvIGJlIGNvZXJjZWQgaW50byBhIHN0cmluZ1xuICAgIHZlcnNpb246IHtcbiAgICAgIG1ham9yOiAwLFxuICAgICAgbWlub3I6IDcsXG4gICAgICBwYXRjaDogMSxcbiAgICAgIG1ldGFkYXRhOiBudWxsLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHYuZm9ybWF0KFwiJXttYWpvcn0uJXttaW5vcn0uJXtwYXRjaH1cIiwgdi52ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2LmlzRW1wdHkodi52ZXJzaW9uLm1ldGFkYXRhKSkge1xuICAgICAgICAgIHZlcnNpb24gKz0gXCIrXCIgKyB2LnZlcnNpb24ubWV0YWRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEJlbG93IGlzIHRoZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgdXNlZCBpbiB2YWxpZGF0ZS5qc1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIElmIHlvdSBhcmUgdXNpbmcgUS5qcywgUlNWUCBvciBhbnkgb3RoZXIgQSsgY29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIG92ZXJyaWRlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGF0IHByb21pc2UuXG4gICAgLy8gU2luY2UgalF1ZXJ5IHByb21pc2VzIGFyZW4ndCBBKyBjb21wYXRpYmxlIHRoZXkgd29uJ3Qgd29yay5cbiAgICBQcm9taXNlOiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFByb21pc2UgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgLy8gSWYgbW9tZW50IGlzIHVzZWQgaW4gbm9kZSwgYnJvd3NlcmlmeSBldGMgcGxlYXNlIHNldCB0aGlzIGF0dHJpYnV0ZVxuICAgIC8vIGxpa2UgdGhpczogYHZhbGlkYXRlLm1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG4gICAgbW9tZW50OiB0eXBlb2YgbW9tZW50ICE9PSBcInVuZGVmaW5lZFwiID8gbW9tZW50IDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIFhEYXRlOiB0eXBlb2YgWERhdGUgIT09IFwidW5kZWZpbmVkXCIgPyBYRGF0ZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBFTVBUWV9TVFJJTkdfUkVHRVhQOiAvXlxccyokLyxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cyBvYmplY3QuXG4gICAgLy8gV2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIGZvcm1hdDpcbiAgICAvLyAgICAgW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZSBuYW1lPlwiLCBlcnJvcjogXCI8dmFsaWRhdGlvbiByZXN1bHQ+XCJ9LCAuLi5dXG4gICAgcnVuVmFsaWRhdGlvbnM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgICwgYXR0clxuICAgICAgICAsIHZhbGlkYXRvck5hbWVcbiAgICAgICAgLCB2YWx1ZVxuICAgICAgICAsIHZhbGlkYXRvcnNcbiAgICAgICAgLCB2YWxpZGF0b3JcbiAgICAgICAgLCB2YWxpZGF0b3JPcHRpb25zXG4gICAgICAgICwgZXJyb3I7XG5cbiAgICAgIGlmICh2LmlzRG9tRWxlbWVudChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jb2xsZWN0Rm9ybVZhbHVlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcHMgdGhyb3VnaCBlYWNoIGNvbnN0cmFpbnRzLCBmaW5kcyB0aGUgY29ycmVjdCB2YWxpZGF0b3IgYW5kIHJ1biBpdC5cbiAgICAgIGZvciAoYXR0ciBpbiBjb25zdHJhaW50cykge1xuICAgICAgICB2YWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIGF0dHIpO1xuICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludHMgZm9yIGFuIGF0dHJpYnV0ZSB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgdmFsaWRhdG9ycyA9IHYucmVzdWx0KGNvbnN0cmFpbnRzW2F0dHJdLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuXG4gICAgICAgIGZvciAodmFsaWRhdG9yTmFtZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgdmFsaWRhdG9yID0gdi52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gdi5mb3JtYXQoXCJVbmtub3duIHZhbGlkYXRvciAle25hbWV9XCIsIHtuYW1lOiB2YWxpZGF0b3JOYW1lfSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBvcHRpb25zIHRvIGJlIGEgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlXG4gICAgICAgICAgLy8gY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHYucmVzdWx0KHZhbGlkYXRvck9wdGlvbnMsIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3JPcHRpb25zKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvcjogdmFsaWRhdG9yLmNhbGwodmFsaWRhdG9yLCB2YWx1ZSwgdmFsaWRhdG9yT3B0aW9ucywgYXR0cixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG5cbiAgICAvLyBUYWtlcyB0aGUgb3V0cHV0IGZyb20gcnVuVmFsaWRhdGlvbnMgYW5kIGNvbnZlcnRzIGl0IHRvIHRoZSBjb3JyZWN0XG4gICAgLy8gb3V0cHV0IGZvcm1hdC5cbiAgICBwcm9jZXNzVmFsaWRhdGlvblJlc3VsdHM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIGVycm9ycyA9IHYucHJ1bmVFbXB0eUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5leHBhbmRNdWx0aXBsZUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5jb252ZXJ0RXJyb3JNZXNzYWdlcyhlcnJvcnMsIG9wdGlvbnMpO1xuXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMuZm9ybWF0IHx8IFwiZ3JvdXBlZFwiKSB7XG4gICAgICAgIGNhc2UgXCJkZXRhaWxlZFwiOlxuICAgICAgICAgIC8vIERvIG5vdGhpbmcgbW9yZSB0byB0aGUgZXJyb3JzXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImZsYXRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9ycyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImdyb3VwZWRcIjpcbiAgICAgICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNbYXR0cl0gPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9yc1thdHRyXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHYuZm9ybWF0KFwiVW5rbm93biBmb3JtYXQgJXtmb3JtYXR9XCIsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuaXNFbXB0eShlcnJvcnMpID8gdW5kZWZpbmVkIDogZXJyb3JzO1xuICAgIH0sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0aW9ucyB3aXRoIHN1cHBvcnQgZm9yIHByb21pc2VzLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCB3aGVuIGFsbCB0aGVcbiAgICAvLyB2YWxpZGF0aW9uIHByb21pc2VzIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gICAgLy8gSXQgY2FuIGJlIGNhbGxlZCBldmVuIGlmIG5vIHZhbGlkYXRpb25zIHJldHVybmVkIGEgcHJvbWlzZS5cbiAgICBhc3luYzogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5hc3luYy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2LndhaXRGb3JSZXN1bHRzKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVycm9ycyA9IHYucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpbmdsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuc2luZ2xlLm9wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgZm9ybWF0OiBcImZsYXRcIixcbiAgICAgICAgZnVsbE1lc3NhZ2VzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdih7c2luZ2xlOiB2YWx1ZX0sIHtzaW5nbGU6IGNvbnN0cmFpbnRzfSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgcHJvbWlzZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcbiAgICAvLyBhcmUgc2V0dGxlZC4gVGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzIGFsd2F5cyByZXNvbHZlZCxcbiAgICAvLyBuZXZlciByZWplY3RlZC5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBpbnB1dCBhcmd1bWVudCwgaXQgcmVwbGFjZXMgdGhlIHByb21pc2VzXG4gICAgLy8gd2l0aCB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgcHJvbWlzZS5cbiAgICB3YWl0Rm9yUmVzdWx0czogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgLy8gQ3JlYXRlIGEgc2VxdWVuY2Ugb2YgYWxsIHRoZSByZXN1bHRzIHN0YXJ0aW5nIHdpdGggYSByZXNvbHZlZCBwcm9taXNlLlxuICAgICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHJlc3VsdCkge1xuICAgICAgICAvLyBJZiB0aGlzIHJlc3VsdCBpc24ndCBhIHByb21pc2Ugc2tpcCBpdCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIGlmICghdi5pc1Byb21pc2UocmVzdWx0LmVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lbW8udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmVycm9yLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAvLyBJZiBmb3Igc29tZSByZWFzb24gdGhlIHZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgbm9cbiAgICAgICAgICAgICAgLy8gZXJyb3Igd2FzIHNwZWNpZmllZC5cbiAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIHYud2FybihcIlZhbGlkYXRvciBwcm9taXNlIHdhcyByZWplY3RlZCBidXQgZGlkbid0IHJldHVybiBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcigpOyB9KSk7IC8vIEEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIH0sXG5cbiAgICAvLyBJZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBjYWxsOiBmdW5jdGlvbiB0aGUgYW5kOiBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlXG4gICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZS4gQWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXNcbiAgICAvLyBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmVzdWx0KCdmb28nKSAvLyAnZm9vJ1xuICAgIC8vIHJlc3VsdChNYXRoLm1heCwgMSwgMikgLy8gMlxuICAgIC8vIGBgYFxuICAgIHJlc3VsdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLiBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IGNvbnNpZGVyIE5hTiBhXG4gICAgLy8gbnVtYmVyIGxpa2UgbWFueSBvdGhlciBgaXNOdW1iZXJgIGZ1bmN0aW9ucyBkby5cbiAgICBpc051bWJlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBub3QgYSBmdW5jdGlvblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0sXG5cbiAgICAvLyBBIHNpbXBsZSBjaGVjayB0byB2ZXJpZnkgdGhhdCB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlci4gVXNlcyBgaXNOdW1iZXJgXG4gICAgLy8gYW5kIGEgc2ltcGxlIG1vZHVsbyBjaGVjay5cbiAgICBpc0ludGVnZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgJSAxID09PSAwO1xuICAgIH0sXG5cbiAgICAvLyBVc2VzIHRoZSBgT2JqZWN0YCBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYW4gb2JqZWN0LlxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICAgIH0sXG5cbiAgICAvLyBTaW1wbHkgY2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBkYXRlXG4gICAgaXNEYXRlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgYG51bGxgIG9mIGB1bmRlZmluZWRgXG4gICAgaXNEZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBwcm9taXNlLiBBbnl0aGluZyB3aXRoIGEgYHRoZW5gXG4gICAgLy8gZnVuY3Rpb24gaXMgY29uc2lkZXJlZCBhIHByb21pc2UuXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gISFwICYmIHYuaXNGdW5jdGlvbihwLnRoZW4pO1xuICAgIH0sXG5cbiAgICBpc0RvbUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdi5pc0Z1bmN0aW9uKG8ucXVlcnlTZWxlY3RvckFsbCkgfHwgIXYuaXNGdW5jdGlvbihvLnF1ZXJ5U2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3QoZG9jdW1lbnQpICYmIG8gPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvNjk5MzA0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG8gJiZcbiAgICAgICAgICB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgICBvLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgLy8gTnVsbCBhbmQgdW5kZWZpbmVkIGFyZSBlbXB0eVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaXRlc3BhY2Ugb25seSBzdHJpbmdzIGFyZSBlbXB0eVxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2LkVNUFRZX1NUUklOR19SRUdFWFAudGVzdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBhcnJheXMgd2UgdXNlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgIGlmICh2LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIGhhdmUgbm8gYXR0cmlidXRlcyBidXQgYXJlbid0IGVtcHR5XG4gICAgICBpZiAodi5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgZmluZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkgd2UgY29uc2lkZXIgaXQgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEZvcm1hdHMgdGhlIHNwZWNpZmllZCBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHZhbHVlcyBsaWtlIHNvOlxuICAgIC8vIGBgYFxuICAgIC8vIGZvcm1hdChcIkZvbzogJXtmb299XCIsIHtmb286IFwiYmFyXCJ9KSAvLyBcIkZvbyBiYXJcIlxuICAgIC8vIGBgYFxuICAgIC8vIElmIHlvdSB3YW50IHRvIHdyaXRlICV7Li4ufSB3aXRob3V0IGhhdmluZyBpdCByZXBsYWNlZCBzaW1wbHlcbiAgICAvLyBwcmVmaXggaXQgd2l0aCAlIGxpa2UgdGhpcyBgRm9vOiAlJXtmb299YCBhbmQgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIGFzIGBcIkZvbzogJXtmb299XCJgXG4gICAgZm9ybWF0OiB2LmV4dGVuZChmdW5jdGlvbihzdHIsIHZhbHMpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSh2LmZvcm1hdC5GT1JNQVRfUkVHRVhQLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgIGlmIChtMSA9PT0gJyUnKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJXtcIiArIG0yICsgXCJ9XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWxzW20yXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgIC8vIEZpbmRzICV7a2V5fSBzdHlsZSBwYXR0ZXJucyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICBGT1JNQVRfUkVHRVhQOiAvKCU/KSVcXHsoW15cXH1dKylcXH0vZ1xuICAgIH0pLFxuXG4gICAgLy8gXCJQcmV0dGlmaWVzXCIgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAvLyBQcmV0dGlmeWluZyBtZWFucyByZXBsYWNpbmcgWy5cXF8tXSB3aXRoIHNwYWNlcyBhcyB3ZWxsIGFzIHNwbGl0dGluZ1xuICAgIC8vIGNhbWVsIGNhc2Ugd29yZHMuXG4gICAgcHJldHRpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHYuaXNOdW1iZXIoc3RyKSkge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDIgZGVjaW1hbHMgcm91bmQgaXQgdG8gdHdvXG4gICAgICAgIGlmICgoc3RyICogMTAwKSAlIDEgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHN0ciAqIDEwMCkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNBcnJheShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHYucHJldHRpZnkocyk7IH0pLmpvaW4oXCIsIFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgc3RyaW5nIGlzIGFjdHVhbGx5IGEgc3RyaW5nXG4gICAgICBzdHIgPSBcIlwiICsgc3RyO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC8vIFNwbGl0cyBrZXlzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXHNdKVxcLihbXlxcc10pL2csICckMSAkMicpXG4gICAgICAgIC8vIFJlbW92ZXMgYmFja3NsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwrL2csICcnKVxuICAgICAgICAvLyBSZXBsYWNlcyAtIGFuZCAtIHdpdGggc3BhY2VcbiAgICAgICAgLnJlcGxhY2UoL1tfLV0vZywgJyAnKVxuICAgICAgICAvLyBTcGxpdHMgY2FtZWwgY2FzZWQgd29yZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIG0xICsgXCIgXCIgKyBtMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgc3RyaW5naWZ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5wcmV0dGlmeSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIGluIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0RGVlcE9iamVjdFZhbHVlOiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIGlmICghdi5pc09iamVjdChvYmopIHx8ICF2LmlzU3RyaW5nKGtleXBhdGgpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiXG4gICAgICAgICwgaVxuICAgICAgICAsIGVzY2FwZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cGF0aC5sZW5ndGg7ICsraSkge1xuICAgICAgICBzd2l0Y2ggKGtleXBhdGhbaV0pIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnLic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgICAgICAgICAgIGtleSA9IFwiXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnXFxcXCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cGF0aFtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzRGVmaW5lZChvYmopICYmIGtleSBpbiBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVGhpcyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtLlxuICAgIC8vIEl0IHVzZXMgdGhlIGlucHV0IG5hbWUgYXMga2V5IGFuZCB0aGUgdmFsdWUgYXMgdmFsdWVcbiAgICAvLyBTbyBmb3IgZXhhbXBsZSB0aGlzOlxuICAgIC8vIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiZm9vQGJhci5jb21cIiAvPlxuICAgIC8vIHdvdWxkIHJldHVybjpcbiAgICAvLyB7ZW1haWw6IFwiZm9vQGJhci5jb21cIn1cbiAgICBjb2xsZWN0Rm9ybVZhbHVlczogZnVuY3Rpb24oZm9ybSwgb3B0aW9ucykge1xuICAgICAgdmFyIHZhbHVlcyA9IHt9XG4gICAgICAgICwgaVxuICAgICAgICAsIGlucHV0XG4gICAgICAgICwgaW5wdXRzXG4gICAgICAgICwgdmFsdWU7XG5cbiAgICAgIGlmICghZm9ybSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF0dHJpYnV0ZXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbnB1dC5uYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5wdXQubmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0udmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LFxuXG4gICAgc2FuaXRpemVGb3JtVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmltICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5udWxsaWZ5ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgYWxsIGVycm9ycyB3aG8ncyBlcnJvciBhdHRyaWJ1dGUgaXMgZW1wdHkgKG51bGwgb3IgdW5kZWZpbmVkKVxuICAgIHBydW5lRW1wdHlFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICF2LmlzRW1wdHkoZXJyb3IuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIEluXG4gICAgLy8gW3tlcnJvcjogW1wiZXJyMVwiLCBcImVycjJcIl0sIC4uLn1dXG4gICAgLy8gT3V0XG4gICAgLy8gW3tlcnJvcjogXCJlcnIxXCIsIC4uLn0sIHtlcnJvcjogXCJlcnIyXCIsIC4uLn1dXG4gICAgLy9cbiAgICAvLyBBbGwgYXR0cmlidXRlcyBpbiBhbiBlcnJvciB3aXRoIG11bHRpcGxlIG1lc3NhZ2VzIGFyZSBkdXBsaWNhdGVkXG4gICAgLy8gd2hlbiBleHBhbmRpbmcgdGhlIGVycm9ycy5cbiAgICBleHBhbmRNdWx0aXBsZUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBSZW1vdmVzIGVycm9ycyB3aXRob3V0IGEgbWVzc2FnZVxuICAgICAgICBpZiAodi5pc0FycmF5KGVycm9yLmVycm9yKSkge1xuICAgICAgICAgIGVycm9yLmVycm9yLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3IsIHtlcnJvcjogbXNnfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0cyB0aGUgZXJyb3IgbWVzYWdlcyBieSBwcmVwZW5kaW5nIHRoZSBhdHRyaWJ1dGUgbmFtZSB1bmxlc3MgdGhlXG4gICAgLy8gbWVzc2FnZSBpcyBwcmVmaXhlZCBieSBeXG4gICAgY29udmVydEVycm9yTWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9ySW5mbykge1xuICAgICAgICB2YXIgZXJyb3IgPSBlcnJvckluZm8uZXJyb3I7XG5cbiAgICAgICAgaWYgKGVycm9yWzBdID09PSAnXicpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yLnNsaWNlKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZnVsbE1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVycm9yID0gdi5jYXBpdGFsaXplKHYucHJldHRpZnkoZXJyb3JJbmZvLmF0dHJpYnV0ZSkpICsgXCIgXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IGVycm9yLnJlcGxhY2UoL1xcXFxcXF4vZywgXCJeXCIpO1xuICAgICAgICBlcnJvciA9IHYuZm9ybWF0KGVycm9yLCB7dmFsdWU6IHYuc3RyaW5naWZ5VmFsdWUoZXJyb3JJbmZvLnZhbHVlKX0pO1xuICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3JJbmZvLCB7ZXJyb3I6IGVycm9yfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8ge1wiPGF0dHJpYnV0ZU5hbWU+XCI6IFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XX1cbiAgICBncm91cEVycm9yc0J5QXR0cmlidXRlOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBsaXN0ID0gcmV0W2Vycm9yLmF0dHJpYnV0ZV07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgbGlzdC5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXRbZXJyb3IuYXR0cmlidXRlXSA9IFtlcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3tlcnJvcjogXCI8bWVzc2FnZSAxPlwiLCAuLi59LCB7ZXJyb3I6IFwiPG1lc3NhZ2UgMj5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8gW1wiPG1lc3NhZ2UgMT5cIiwgXCI8bWVzc2FnZSAyPlwiXVxuICAgIGZsYXR0ZW5FcnJvcnNUb0FycmF5OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKSB7IHJldHVybiBlcnJvci5lcnJvcjsgfSk7XG4gICAgfSxcblxuICAgIGV4cG9zZU1vZHVsZTogZnVuY3Rpb24odmFsaWRhdGUsIHJvb3QsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgICBpZiAodmFsaWRhdGUuaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXJuOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7XG4gICAgLy8gUHJlc2VuY2UgdmFsaWRhdGVzIHRoYXQgdGhlIHZhbHVlIGlzbid0IGVtcHR5XG4gICAgcHJlc2VuY2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImNhbid0IGJlIGJsYW5rXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpcyA9IG9wdGlvbnMuaXNcbiAgICAgICAgLCBtYXhpbXVtID0gb3B0aW9ucy5tYXhpbXVtXG4gICAgICAgICwgbWluaW11bSA9IG9wdGlvbnMubWluaW11bVxuICAgICAgICAsIHRva2VuaXplciA9IG9wdGlvbnMudG9rZW5pemVyIHx8IGZ1bmN0aW9uKHZhbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICwgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW107XG5cbiAgICAgIHZhbHVlID0gdG9rZW5pemVyKHZhbHVlKTtcbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICBpZighdi5pc051bWJlcihsZW5ndGgpKSB7XG4gICAgICAgIHYuZXJyb3Iodi5mb3JtYXQoXCJBdHRyaWJ1dGUgJXthdHRyfSBoYXMgYSBub24gbnVtZXJpYyB2YWx1ZSBmb3IgYGxlbmd0aGBcIiwge2F0dHI6IGF0dHJpYnV0ZX0pKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaGFzIGFuIGluY29ycmVjdCBsZW5ndGhcIjtcbiAgICAgIH1cblxuICAgICAgLy8gSXMgY2hlY2tzXG4gICAgICBpZiAodi5pc051bWJlcihpcykgJiYgbGVuZ3RoICE9PSBpcykge1xuICAgICAgICBlcnIgPSBvcHRpb25zLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIFwiaXMgdGhlIHdyb25nIGxlbmd0aCAoc2hvdWxkIGJlICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBpc30pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWluaW11bSkgJiYgbGVuZ3RoIDwgbWluaW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb1Nob3J0IHx8XG4gICAgICAgICAgdGhpcy50b29TaG9ydCB8fFxuICAgICAgICAgIFwiaXMgdG9vIHNob3J0IChtaW5pbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtaW5pbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtYXhpbXVtKSAmJiBsZW5ndGggPiBtYXhpbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTG9uZyB8fFxuICAgICAgICAgIHRoaXMudG9vTG9uZyB8fFxuICAgICAgICAgIFwiaXMgdG9vIGxvbmcgKG1heGltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1heGltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bWVyaWNhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgICAsIG5hbWVcbiAgICAgICAgLCBjb3VudFxuICAgICAgICAsIGNoZWNrcyA9IHtcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuOiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID4gYzsgfSxcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID49IGM7IH0sXG4gICAgICAgICAgICBlcXVhbFRvOiAgICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA9PT0gYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuOiAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDwgYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDw9IGM7IH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBDb2VyY2UgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIHVubGVzcyB3ZSdyZSBiZWluZyBzdHJpY3QuXG4gICAgICBpZiAob3B0aW9ucy5ub1N0cmluZ3MgIT09IHRydWUgJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIHdlIHNob3VsZG4ndCBjb250aW51ZSBzaW5jZSBpdCB3aWxsIGNvbXBhcmUgaXQuXG4gICAgICBpZiAoIXYuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImlzIG5vdCBhIG51bWJlclwiO1xuICAgICAgfVxuXG4gICAgICAvLyBTYW1lIGxvZ2ljIGFzIGFib3ZlLCBzb3J0IG9mLiBEb24ndCBib3RoZXIgd2l0aCBjb21wYXJpc29ucyBpZiB0aGlzXG4gICAgICAvLyBkb2Vzbid0IHBhc3MuXG4gICAgICBpZiAob3B0aW9ucy5vbmx5SW50ZWdlciAmJiAhdi5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RJbnRlZ2VyICB8fCBcIm11c3QgYmUgYW4gaW50ZWdlclwiO1xuICAgICAgfVxuXG4gICAgICBmb3IgKG5hbWUgaW4gY2hlY2tzKSB7XG4gICAgICAgIGNvdW50ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgaWYgKHYuaXNOdW1iZXIoY291bnQpICYmICFjaGVja3NbbmFtZV0odmFsdWUsIGNvdW50KSkge1xuICAgICAgICAgIC8vIFRoaXMgcGlja3MgdGhlIGRlZmF1bHQgbWVzc2FnZSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZSB0aGUgZ3JlYXRlclRoYW4gY2hlY2sgdXNlcyB0aGUgbWVzc2FnZSBmcm9tXG4gICAgICAgICAgLy8gdGhpcy5ub3RHcmVhdGVyVGhhbiBzbyB3ZSBjYXBpdGFsaXplIHRoZSBuYW1lIGFuZCBwcmVwZW5kIFwibm90XCJcbiAgICAgICAgICB2YXIgbXNnID0gdGhpc1tcIm5vdFwiICsgdi5jYXBpdGFsaXplKG5hbWUpXSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlICV7dHlwZX0gJXtjb3VudH1cIjtcblxuICAgICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KG1zZywge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgdHlwZTogdi5wcmV0dGlmeShuYW1lKVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5vZGQgJiYgdmFsdWUgJSAyICE9PSAxKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRoaXMubm90T2RkIHx8IFwibXVzdCBiZSBvZGRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5ldmVuICYmIHZhbHVlICUgMiAhPT0gMCkge1xuICAgICAgICBlcnJvcnMucHVzaCh0aGlzLm5vdEV2ZW4gfHwgXCJtdXN0IGJlIGV2ZW5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZXRpbWU6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW11cbiAgICAgICAgLCBlYXJsaWVzdCA9IG9wdGlvbnMuZWFybGllc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMuZWFybGllc3QsIG9wdGlvbnMpIDogTmFOXG4gICAgICAgICwgbGF0ZXN0ID0gb3B0aW9ucy5sYXRlc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMubGF0ZXN0LCBvcHRpb25zKSA6IE5hTjtcblxuICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlKHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgLy8gODY0MDAwMDAgaXMgdGhlIG51bWJlciBvZiBzZWNvbmRzIGluIGEgZGF5LCB0aGlzIGlzIHVzZWQgdG8gcmVtb3ZlXG4gICAgICAvLyB0aGUgdGltZSBmcm9tIHRoZSBkYXRlXG4gICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IG9wdGlvbnMuZGF0ZU9ubHkgJiYgdmFsdWUgJSA4NjQwMDAwMCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJtdXN0IGJlIGEgdmFsaWQgZGF0ZVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGVhcmxpZXN0KSAmJiB2YWx1ZSA8IGVhcmxpZXN0KSB7XG4gICAgICAgIGVyciA9IHRoaXMudG9vRWFybHkgfHwgXCJtdXN0IGJlIG5vIGVhcmxpZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge2RhdGU6IHRoaXMuZm9ybWF0KGVhcmxpZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGxhdGVzdCkgJiYgdmFsdWUgPiBsYXRlc3QpIHtcbiAgICAgICAgZXJyID0gdGhpcy50b29MYXRlIHx8IFwibXVzdCBiZSBubyBsYXRlciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7ZGF0ZTogdGhpcy5mb3JtYXQobGF0ZXN0LCBvcHRpb25zKX0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb252ZXJ0IGlucHV0IHRvIHRoZSBudW1iZXJcbiAgICAgIC8vIG9mIG1pbGxpcyBzaW5jZSB0aGUgZXBvY2guXG4gICAgICAvLyBJdCBzaG91bGQgcmV0dXJuIE5hTiBpZiBpdCdzIG5vdCBhIHZhbGlkIGRhdGUuXG4gICAgICBwYXJzZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgdi5YRGF0ZSh2YWx1ZSwgdHJ1ZSkuZ2V0VGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKHYubW9tZW50KSkge1xuICAgICAgICAgIHJldHVybiArdi5tb21lbnQudXRjKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgWERhdGUgb3IgbW9tZW50LmpzIHdhcyBmb3VuZFwiKTtcbiAgICAgIH0sXG4gICAgICAvLyBGb3JtYXRzIHRoZSBnaXZlbiB0aW1lc3RhbXAuIFVzZXMgSVNPODYwMSB0byBmb3JtYXQgdGhlbS5cbiAgICAgIC8vIElmIG9wdGlvbnMuZGF0ZU9ubHkgaXMgdHJ1ZSB0aGVuIG9ubHkgdGhlIHllYXIsIG1vbnRoIGFuZCBkYXkgd2lsbCBiZVxuICAgICAgLy8gb3V0cHV0LlxuICAgICAgZm9ybWF0OiBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSBvcHRpb25zLmRhdGVGb3JtYXQ7XG5cbiAgICAgICAgaWYgKHYuaXNGdW5jdGlvbih2LlhEYXRlKSkge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAob3B0aW9ucy5kYXRlT25seSA/IFwieXl5eS1NTS1kZFwiIDogXCJ5eXl5LU1NLWRkIEhIOm1tOnNzXCIpO1xuICAgICAgICAgIHJldHVybiBuZXcgWERhdGUoZGF0ZSwgdHJ1ZSkudG9TdHJpbmcoZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZCh2Lm1vbWVudCkpIHtcbiAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgKG9wdGlvbnMuZGF0ZU9ubHkgPyBcIllZWVktTU0tRERcIiA6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcbiAgICAgICAgICByZXR1cm4gdi5tb21lbnQudXRjKGRhdGUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVpdGhlciBYRGF0ZSBvciBtb21lbnQuanMgd2FzIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH0pLFxuICAgIGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIG9wdGlvbnMsIHtkYXRlT25seTogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHYudmFsaWRhdG9ycy5kYXRldGltZS5jYWxsKHYudmFsaWRhdG9ycy5kYXRldGltZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykgfHwgKG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7cGF0dGVybjogb3B0aW9uc307XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgaW52YWxpZFwiXG4gICAgICAgICwgcGF0dGVybiA9IG9wdGlvbnMucGF0dGVyblxuICAgICAgICAsIG1hdGNoO1xuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdGlvbnMucGF0dGVybiwgb3B0aW9ucy5mbGFncyk7XG4gICAgICB9XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyh2YWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoIHx8IG1hdGNoWzBdLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbmNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICh2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJeJXt2YWx1ZX0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0XCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZXhjbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICghdi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcIl4le3ZhbHVlfSBpcyByZXN0cmljdGVkXCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZW1haWw6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCBlbWFpbFwiO1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAodi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLlBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgUEFUVEVSTjogL15bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16XXsyLH0kL2lcbiAgICB9KSxcbiAgICBlcXVhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykge1xuICAgICAgaWYgKHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge2F0dHJpYnV0ZTogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJpcyBub3QgZXF1YWwgdG8gJXthdHRyaWJ1dGV9XCI7XG5cbiAgICAgIGlmICh2LmlzRW1wdHkob3B0aW9ucy5hdHRyaWJ1dGUpIHx8ICF2LmlzU3RyaW5nKG9wdGlvbnMuYXR0cmlidXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXR0cmlidXRlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3RoZXJWYWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlKVxuICAgICAgICAsIGNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3IgfHwgZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgICAgcmV0dXJuIHYxID09PSB2MjtcbiAgICAgICAgfTtcblxuICAgICAgaWYgKCFjb21wYXJhdG9yKHZhbHVlLCBvdGhlclZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7YXR0cmlidXRlOiB2LnByZXR0aWZ5KG9wdGlvbnMuYXR0cmlidXRlKX0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5leHBvc2VNb2R1bGUodmFsaWRhdGUsIHRoaXMsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKTtcbn0pLmNhbGwodGhpcyxcbiAgICAgICAgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZXhwb3J0cyA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbW9kdWxlIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBkZWZpbmUgOiBudWxsKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvdmFsaWRhdGUvdmFsaWRhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSA4MFxuICoqIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDVcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJkZWZpbmUgY2Fubm90IGJlIHVzZWQgaW5kaXJlY3RcIik7IH07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qc1xuICoqIG1vZHVsZSBpZCA9IDgxXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICAgICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXHJcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICAgICAgdmFsaWRhdGUgPSByZXF1aXJlKCd2YWxpZGF0ZScpXHJcblxyXG4gICAgICAgIDtcclxuXHJcbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2NvcmUvc3RvcmUnKTtcclxuXHJcbnZhciBNeWJvb2tpbmdEYXRhID0gU3RvcmUuZXh0ZW5kKHtcclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgcHJpY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgXy5yZWR1Y2UodGhpcy5nZXQoJyAnKSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVmcmVzaEN1cnJlbnRDYXJ0OiBmdW5jdGlvbiAodmlldykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaEN1cnJlbnRDYXJ0XCIpO1xyXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9nZXRDYXJ0RGV0YWlscy8nICsgXy5wYXJzZUludCh2aWV3LmdldCgnY3VycmVudENhcnRJZCcpKSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGV0YWlscyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsIGVtYWlsOmRhdGEuZW1haWwsdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLGJvb2tpbmdfc3RhdHVzbXNnOiBkYXRhLmJvb2tpbmdfc3RhdHVzbXNnLCByZXR1cm5kYXRlOiBkYXRhLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBkYXRhLmlzTXVsdGlDaXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJlbmN5OiBkYXRhLmN1cmVuY3ksZm9wOmRhdGEuZm9wLGJhc2VwcmljZTpkYXRhLmJhc2VwcmljZSx0YXhlczpkYXRhLnRheGVzLGZlZTpkYXRhLmZlZSx0b3RhbEFtb3VudGlud29yZHM6ZGF0YS50b3RhbEFtb3VudGlud29yZHMsY3VzdG9tZXJjYXJlOmRhdGEuY3VzdG9tZXJjYXJlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsc3RhdHVzbXNnOiB0LnN0YXR1c21zZywgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcCh0LnJvdXRlcywgZnVuY3Rpb24gKHJvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvLmlkLCBvcmlnaW46IHJvLm9yaWdpbiwgb3JpZ2luRGV0YWlsczogcm8ub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiByby5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiByby5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiByby5kZXBhcnR1cmUsIGFycml2YWw6IHJvLmFycml2YWwsIGNhcnJpZXI6IHJvLmNhcnJpZXIsIGNhcnJpZXJOYW1lOiByby5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiByby5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHJvLmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiByby5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogcm8uZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogcm8ubWVhbCwgc2VhdDogcm8uc2VhdCwgYWlyY3JhZnQ6IHJvLmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZDEgPiBkMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAoaS5yb3V0ZXMsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgb3JpZ2luOiB0Lm9yaWdpbiwgb3JpZ2luRGV0YWlsczogdC5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHQuZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogdC5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiB0LmRlcGFydHVyZSwgYXJyaXZhbDogdC5hcnJpdmFsLCBjYXJyaWVyOiB0LmNhcnJpZXIsIGNhcnJpZXJOYW1lOiB0LmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHQuZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogdC5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogdC5vcmlnaW5UZXJtaW5hbCwgZGVzdGluYXRpb25UZXJtaW5hbDogdC5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiB0Lm1lYWwsIHNlYXQ6IHQuc2VhdCwgYWlyY3JhZnQ6IHQuYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZDEgPiBkMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2N1cnJlbnRDYXJ0RGV0YWlscycsIGRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IF8uZmluZEluZGV4KHZpZXcuZ2V0KCdjYXJ0cycpLCB7J2lkJzogZGV0YWlscy5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleDogJytpbmRleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXJ0cyA9IHZpZXcuZ2V0KCdjYXJ0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcnRzW2luZGV4XS5ib29raW5nX3N0YXR1cyA9IGRldGFpbHMuYm9va2luZ19zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NhcnRzJywgY2FydHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzdW1tYXJ5JywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdwZW5kaW5nJywgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5zaWhlZCBzdG9yZTogJyk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbn0pO1xyXG5cclxuTXlib29raW5nRGF0YS5nZXRDdXJyZW50Q2FydCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAvLyBjb25zb2xlLmxvZyhcImdldEN1cnJlbnRDYXJ0XCIpO1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnL2IyYy9haXJDYXJ0L2dldENhcnREZXRhaWxzLycgKyBfLnBhcnNlSW50KGlkKSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRvbmVcIik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgZGV0YWlscyA9IHtcclxuICAgICAgICAgICAgaWQ6IGRhdGEuaWQsIGVtYWlsOmRhdGEuZW1haWwsdGlja2V0c3RhdHVzbXNnOmRhdGEudGlja2V0c3RhdHVzbXNnLHVwY29taW5nOiBkYXRhLnVwY29taW5nLCBjcmVhdGVkOiBkYXRhLmNyZWF0ZWQsIHRvdGFsQW1vdW50OiBkYXRhLnRvdGFsQW1vdW50LCBib29raW5nX3N0YXR1czogZGF0YS5ib29raW5nX3N0YXR1cyxjbGllbnRTb3VyY2VJZDpkYXRhLmNsaWVudFNvdXJjZUlkLHNlZ05pZ2h0czpkYXRhLnNlZ05pZ2h0cyxcclxuICAgICAgICAgICAgYm9va2luZ19zdGF0dXNtc2c6IGRhdGEuYm9va2luZ19zdGF0dXNtc2csIHJldHVybmRhdGU6IGRhdGEucmV0dXJuZGF0ZSwgaXNNdWx0aUNpdHk6IGRhdGEuaXNNdWx0aUNpdHksIGN1cmVuY3k6IGRhdGEuY3VyZW5jeSxmb3A6ZGF0YS5mb3AsYmFzZXByaWNlOmRhdGEuYmFzZXByaWNlLHRheGVzOmRhdGEudGF4ZXMsZmVlOmRhdGEuZmVlLHRvdGFsQW1vdW50aW53b3JkczpkYXRhLnRvdGFsQW1vdW50aW53b3JkcyxjdXN0b21lcmNhcmU6ZGF0YS5jdXN0b21lcmNhcmUsXHJcbiAgICAgICAgICAgIGJvb2tpbmdzOiBfLm1hcChkYXRhLmJvb2tpbmdzLCBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtpZDogaS5pZCwgdXBjb21pbmc6IGkudXBjb21pbmcsIHNvdXJjZV9pZDogaS5zb3VyY2VfaWQsIGRlc3RpbmF0aW9uX2lkOiBpLmRlc3RpbmF0aW9uX2lkLCBzb3VyY2U6IGkuc291cmNlLCBmbGlnaHR0aW1lOiBpLmZsaWdodHRpbWUsIGRlc3RpbmF0aW9uOiBpLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IGkuZGVwYXJ0dXJlLCBhcnJpdmFsOiBpLmFycml2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhdmVsbGVyOiBfLm1hcChpLnRyYXZlbGxlciwgZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBib29raW5naWQ6IHQuYm9va2luZ2lkLCBmYXJldHlwZTogdC5mYXJldHlwZSwgdGl0bGU6IHQudGl0bGUsIHR5cGU6IHQudHlwZSwgZmlyc3RfbmFtZTogdC5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHQubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWlybGluZV9wbnI6IHQuYWlybGluZV9wbnIsIGNyc19wbnI6IHQuY3JzX3BuciwgdGlja2V0OiB0LnRpY2tldCwgYm9va2luZ19jbGFzczogdC5ib29raW5nX2NsYXNzLCBjYWJpbjogdC5jYWJpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2ljZmFyZTogdC5iYXNpY2ZhcmUsIHRheGVzOiB0LnRheGVzLCB0b3RhbDogdC50b3RhbCwgc3RhdHVzOiB0LnN0YXR1cyxzdGF0dXNtc2c6IHQuc3RhdHVzbXNnLCBzZWxlY3RlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKHQucm91dGVzLCBmdW5jdGlvbiAocm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcm8uaWQsIG9yaWdpbjogcm8ub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiByby5vcmlnaW5EZXRhaWxzLCBkZXN0aW5hdGlvbkRldGFpbHM6IHJvLmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHJvLmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHJvLmRlcGFydHVyZSwgYXJyaXZhbDogcm8uYXJyaXZhbCwgY2Fycmllcjogcm8uY2FycmllciwgY2Fycmllck5hbWU6IHJvLmNhcnJpZXJOYW1lLCBmbGlnaHROdW1iZXI6IHJvLmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0dGltZTogcm8uZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHJvLm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiByby5kZXN0aW5hdGlvblRlcm1pbmFsLCBtZWFsOiByby5tZWFsLCBzZWF0OiByby5zZWF0LCBhaXJjcmFmdDogcm8uYWlyY3JhZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBfLm1hcChpLnJvdXRlcywgZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0LmlkLCBvcmlnaW46IHQub3JpZ2luLCBvcmlnaW5EZXRhaWxzOiB0Lm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogdC5kZXN0aW5hdGlvbkRldGFpbHMsIGRlc3RpbmF0aW9uOiB0LmRlc3RpbmF0aW9uLCBkZXBhcnR1cmU6IHQuZGVwYXJ0dXJlLCBhcnJpdmFsOiB0LmFycml2YWwsIGNhcnJpZXI6IHQuY2FycmllciwgY2Fycmllck5hbWU6IHQuY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogdC5mbGlnaHROdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiB0LmZsaWdodHRpbWUsIG9yaWdpblRlcm1pbmFsOiB0Lm9yaWdpblRlcm1pbmFsLCBkZXN0aW5hdGlvblRlcm1pbmFsOiB0LmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHQubWVhbCwgc2VhdDogdC5zZWF0LCBhaXJjcmFmdDogdC5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQxID4gZDIpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XHJcbi8vXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KSwgfTtcclxuICAgICAgICBkYXRhLmN1cnJlbnRDYXJ0RGV0YWlscz0gZGV0YWlscztcclxuICAgICAgICBkYXRhLmNhcnRzPVtdO1xyXG4gICAgICAgIGRhdGEuY2FydHMucHVzaChkZXRhaWxzKTtcclxuICAgICAgICBkYXRhLmNhYmluVHlwZSA9IDE7XHJcbiAgICBkYXRhLmFkZCA9IGZhbHNlO1xyXG4gICAgZGF0YS5lZGl0ID0gZmFsc2U7XHJcbiAgICBkYXRhLmN1cnJlbnRDYXJ0SWQgPSBkZXRhaWxzLmlkO1xyXG4gLy8gICBjb25zb2xlLmxvZyhkYXRhLmN1cnJlbnRDYXJ0RGV0YWlscyk7XHJcbiAgICBkYXRhLnN1bW1hcnkgPSBmYWxzZTtcclxuICAgIGRhdGEucHJpbnQgPSBmYWxzZTtcclxuICAgIGRhdGEucGVuZGluZyA9IGZhbHNlO1xyXG4gICAgZGF0YS5hbWVuZCA9IGZhbHNlO1xyXG4gICAgZGF0YS5jYW5jZWwgPSBmYWxzZTtcclxuICAgIGRhdGEucmVzY2hlZHVsZSA9IGZhbHNlO1xyXG4gICBcclxuICAgIGRhdGEuZXJyb3JzID0ge307XHJcbiAgICBkYXRhLnJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICBkYXRhLmZpbHRlciA9IHt9O1xyXG4gICAgZGF0YS5maWx0ZXJlZCA9IHt9O1xyXG4gICAgcmV0dXJuIHJlc29sdmUobmV3IE15Ym9va2luZ0RhdGEoe2RhdGE6IGRhdGF9KSk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgfSlcclxuICAgIH0pO1xyXG59O1xyXG5cclxuTXlib29raW5nRGF0YS5wYXJzZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiTXlib29raW5nRGF0YS5wYXJzZVwiKTtcclxuICAgIC8vZGF0YS5mbGlnaHRzID0gXy5tYXAoZGF0YS5mbGlnaHRzLCBmdW5jdGlvbihpKSB7IHJldHVybiBGbGlnaHQucGFyc2UoaSk7IH0pO1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhkYXRhKTsgICBcclxuICAgIHZhciBmbGdVcGNvbWluZyA9IGZhbHNlO1xyXG4gICAgdmFyIGZsZ1ByZXZpb3VzID0gZmFsc2U7XHJcbiAgICBkYXRhLmNhcnRzID0gXy5tYXAoZGF0YSwgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICBpZiAoaS51cGNvbWluZyA9PSAndHJ1ZScpXHJcbiAgICAgICAgICAgIGZsZ1VwY29taW5nID0gdHJ1ZTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGZsZ1ByZXZpb3VzID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4ge2lkOiBpLmlkLGVtYWlsOmkuZW1haWwsIGNyZWF0ZWQ6IGkuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGkudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBpLmJvb2tpbmdfc3RhdHVzLFxyXG4gICAgICAgICAgICByZXR1cm5kYXRlOiBpLnJldHVybmRhdGUsIGlzTXVsdGlDaXR5OiBpLmlzTXVsdGlDaXR5LCBjdXJlbmN5OiBpLmN1cmVuY3ksIHVwY29taW5nOiBpLnVwY29taW5nLFxyXG4gICAgICAgICAgICBib29raW5nczogXy5tYXAoaS5ib29raW5ncywgZnVuY3Rpb24gKGIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBiLmlkLCBzb3VyY2U6IGIuc291cmNlLCBkZXN0aW5hdGlvbjogYi5kZXN0aW5hdGlvbiwgc291cmNlX2lkOiBiLnNvdXJjZV9pZCwgZGVzdGluYXRpb25faWQ6IGIuZGVzdGluYXRpb25faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwYXJ0dXJlOiBiLmRlcGFydHVyZSwgYXJyaXZhbDogYi5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlbGVyczogXy5tYXAoYi50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IHQuaWQsIG5hbWU6IHQubmFtZX07XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSh4LmRlcGFydHVyZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSh5LmRlcGFydHVyZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZDEgPiBkMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHRyYXZlbGVyOiBfLm1hcChpLnRyYXZlbGxlcmR0bCwgZnVuY3Rpb24gKGopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGouaWQsIG5hbWU6IGoubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBzcmM6IF8ubWFwKGouc3JjLCBmdW5jdGlvbiAoZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge25hbWU6IGd9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Q6IF8ubWFwKGouZGVzdCwgZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtuYW1lOiBnfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuICAgIGRhdGEuY2FydHMuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgIGlmICh4LmlkIDwgeS5pZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMVxyXG4gICAgICAgIH1cclxuICAgICAgICA7XHJcblxyXG4gICAgfSk7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuY2FydHMpOyAgXHJcbiAgICAvLyAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXI9IF8uZmlyc3QoZGF0YS50cmF2ZWxsZXJzKTtcclxuICAgIC8vICAgICAgICAgICBkYXRhLmN1cnJlbnRUcmF2ZWxsZXJJZD1kYXRhLmN1cnJlbnRUcmF2ZWxsZXIuaWQ7XHJcbiAgICBkYXRhLmNhYmluVHlwZSA9IDE7XHJcbiAgICBkYXRhLmFkZCA9IGZhbHNlO1xyXG4gICAgZGF0YS5lZGl0ID0gZmFsc2U7XHJcbiAgICBkYXRhLmN1cnJlbnRDYXJ0SWQgPSBudWxsO1xyXG4gICAgZGF0YS5jdXJyZW50Q2FydERldGFpbHMgPSBudWxsO1xyXG4gICAgZGF0YS5zdW1tYXJ5ID0gdHJ1ZTtcclxuICAgIGRhdGEucGVuZGluZyA9IHRydWU7XHJcbiAgICBkYXRhLmFtZW5kID0gZmFsc2U7XHJcbiAgICBkYXRhLmNhbmNlbCA9IGZhbHNlO1xyXG4gICAgZGF0YS5wcmludCA9IGZhbHNlO1xyXG4gICAgZGF0YS5yZXNjaGVkdWxlID0gZmFsc2U7XHJcbiAgICBkYXRhLmZsZ1VwY29taW5nID0gZmxnVXBjb21pbmc7XHJcbiAgICBkYXRhLmZsZ1ByZXZpb3VzID0gZmxnUHJldmlvdXM7XHJcbiAgICBkYXRhLmVycm9ycyA9IHt9O1xyXG4gICAgZGF0YS5yZXN1bHRzID0gW107XHJcblxyXG4gICAgZGF0YS5maWx0ZXIgPSB7fTtcclxuICAgIGRhdGEuZmlsdGVyZWQgPSB7fTtcclxuICAgIHJldHVybiBuZXcgTXlib29raW5nRGF0YSh7ZGF0YTogZGF0YX0pO1xyXG5cclxufTtcclxuTXlib29raW5nRGF0YS5mZXRjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJNeWJvb2tpbmdEYXRhLmZldGNoXCIpO1xyXG4gICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYjJjL2FpckNhcnQvZ2V0TXlCb29raW5ncycpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoTXlib29raW5nRGF0YS5wYXJzZShkYXRhKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZhaWxlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gTXlib29raW5nRGF0YTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvc3RvcmVzL215Ym9va2luZ3MvbXlib29raW5ncy5qc1xuICoqIG1vZHVsZSBpZCA9IDgyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzXG4gKiovIiwiLyohXG4gKiBhY2NvdW50aW5nLmpzIHYwLjMuMlxuICogQ29weXJpZ2h0IDIwMTEsIEpvc3MgQ3Jvd2Nyb2Z0XG4gKlxuICogRnJlZWx5IGRpc3RyaWJ1dGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogUG9ydGlvbnMgb2YgYWNjb3VudGluZy5qcyBhcmUgaW5zcGlyZWQgb3IgYm9ycm93ZWQgZnJvbSB1bmRlcnNjb3JlLmpzXG4gKlxuICogRnVsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuICogaHR0cDovL2pvc3Njcm93Y3JvZnQuZ2l0aHViLmNvbS9hY2NvdW50aW5nLmpzL1xuICovXG5cbihmdW5jdGlvbihyb290LCB1bmRlZmluZWQpIHtcblxuXHQvKiAtLS0gU2V0dXAgLS0tICovXG5cblx0Ly8gQ3JlYXRlIHRoZSBsb2NhbCBsaWJyYXJ5IG9iamVjdCwgdG8gYmUgZXhwb3J0ZWQgb3IgcmVmZXJlbmNlZCBnbG9iYWxseSBsYXRlclxuXHR2YXIgbGliID0ge307XG5cblx0Ly8gQ3VycmVudCB2ZXJzaW9uXG5cdGxpYi52ZXJzaW9uID0gJzAuMy4yJztcblxuXG5cdC8qIC0tLSBFeHBvc2VkIHNldHRpbmdzIC0tLSAqL1xuXG5cdC8vIFRoZSBsaWJyYXJ5J3Mgc2V0dGluZ3MgY29uZmlndXJhdGlvbiBvYmplY3QuIENvbnRhaW5zIGRlZmF1bHQgcGFyYW1ldGVycyBmb3Jcblx0Ly8gY3VycmVuY3kgYW5kIG51bWJlciBmb3JtYXR0aW5nXG5cdGxpYi5zZXR0aW5ncyA9IHtcblx0XHRjdXJyZW5jeToge1xuXHRcdFx0c3ltYm9sIDogXCIkXCIsXHRcdC8vIGRlZmF1bHQgY3VycmVuY3kgc3ltYm9sIGlzICckJ1xuXHRcdFx0Zm9ybWF0IDogXCIlcyV2XCIsXHQvLyBjb250cm9scyBvdXRwdXQ6ICVzID0gc3ltYm9sLCAldiA9IHZhbHVlIChjYW4gYmUgb2JqZWN0LCBzZWUgZG9jcylcblx0XHRcdGRlY2ltYWwgOiBcIi5cIixcdFx0Ly8gZGVjaW1hbCBwb2ludCBzZXBhcmF0b3Jcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXHRcdC8vIHRob3VzYW5kcyBzZXBhcmF0b3Jcblx0XHRcdHByZWNpc2lvbiA6IDIsXHRcdC8vIGRlY2ltYWwgcGxhY2VzXG5cdFx0XHRncm91cGluZyA6IDNcdFx0Ly8gZGlnaXQgZ3JvdXBpbmcgKG5vdCBpbXBsZW1lbnRlZCB5ZXQpXG5cdFx0fSxcblx0XHRudW1iZXI6IHtcblx0XHRcdHByZWNpc2lvbiA6IDAsXHRcdC8vIGRlZmF1bHQgcHJlY2lzaW9uIG9uIG51bWJlcnMgaXMgMFxuXHRcdFx0Z3JvdXBpbmcgOiAzLFx0XHQvLyBkaWdpdCBncm91cGluZyAobm90IGltcGxlbWVudGVkIHlldClcblx0XHRcdHRob3VzYW5kIDogXCIsXCIsXG5cdFx0XHRkZWNpbWFsIDogXCIuXCJcblx0XHR9XG5cdH07XG5cblxuXHQvKiAtLS0gSW50ZXJuYWwgSGVscGVyIE1ldGhvZHMgLS0tICovXG5cblx0Ly8gU3RvcmUgcmVmZXJlbmNlIHRvIHBvc3NpYmx5LWF2YWlsYWJsZSBFQ01BU2NyaXB0IDUgbWV0aG9kcyBmb3IgbGF0ZXJcblx0dmFyIG5hdGl2ZU1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAsXG5cdFx0bmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXksXG5cdFx0dG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIHN1cHBsaWVkIHBhcmFtZXRlciBpcyBhIHN0cmluZ1xuXHQgKiBmcm9tIHVuZGVyc2NvcmUuanNcblx0ICovXG5cdGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuXHRcdHJldHVybiAhIShvYmogPT09ICcnIHx8IChvYmogJiYgb2JqLmNoYXJDb2RlQXQgJiYgb2JqLnN1YnN0cikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgc3VwcGxpZWQgcGFyYW1ldGVyIGlzIGEgc3RyaW5nXG5cdCAqIGZyb20gdW5kZXJzY29yZS5qcywgZGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcblx0ICovXG5cdGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG5cdFx0cmV0dXJuIG5hdGl2ZUlzQXJyYXkgPyBuYXRpdmVJc0FycmF5KG9iaikgOiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBzdXBwbGllZCBwYXJhbWV0ZXIgaXMgYSB0cnVlIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG5cdFx0cmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBhIGRlZmF1bHRzIG9iamVjdCwgc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgXy5kZWZhdWx0c1xuXHQgKlxuXHQgKiBVc2VkIGZvciBhYnN0cmFjdGluZyBwYXJhbWV0ZXIgaGFuZGxpbmcgZnJvbSBBUEkgbWV0aG9kc1xuXHQgKi9cblx0ZnVuY3Rpb24gZGVmYXVsdHMob2JqZWN0LCBkZWZzKSB7XG5cdFx0dmFyIGtleTtcblx0XHRvYmplY3QgPSBvYmplY3QgfHwge307XG5cdFx0ZGVmcyA9IGRlZnMgfHwge307XG5cdFx0Ly8gSXRlcmF0ZSBvdmVyIG9iamVjdCBub24tcHJvdG90eXBlIHByb3BlcnRpZXM6XG5cdFx0Zm9yIChrZXkgaW4gZGVmcykge1xuXHRcdFx0aWYgKGRlZnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHQvLyBSZXBsYWNlIHZhbHVlcyB3aXRoIGRlZmF1bHRzIG9ubHkgaWYgdW5kZWZpbmVkIChhbGxvdyBlbXB0eS96ZXJvIHZhbHVlcyk6XG5cdFx0XHRcdGlmIChvYmplY3Rba2V5XSA9PSBudWxsKSBvYmplY3Rba2V5XSA9IGRlZnNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbXBsZW1lbnRhdGlvbiBvZiBgQXJyYXkubWFwKClgIGZvciBpdGVyYXRpb24gbG9vcHNcblx0ICpcblx0ICogUmV0dXJucyBhIG5ldyBBcnJheSBhcyBhIHJlc3VsdCBvZiBjYWxsaW5nIGBpdGVyYXRvcmAgb24gZWFjaCBhcnJheSB2YWx1ZS5cblx0ICogRGVmZXJzIHRvIG5hdGl2ZSBBcnJheS5tYXAgaWYgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuXHRcdHZhciByZXN1bHRzID0gW10sIGksIGo7XG5cblx0XHRpZiAoIW9iaikgcmV0dXJuIHJlc3VsdHM7XG5cblx0XHQvLyBVc2UgbmF0aXZlIC5tYXAgbWV0aG9kIGlmIGl0IGV4aXN0czpcblx0XHRpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuXG5cdFx0Ly8gRmFsbGJhY2sgZm9yIG5hdGl2ZSAubWFwOlxuXHRcdGZvciAoaSA9IDAsIGogPSBvYmoubGVuZ3RoOyBpIDwgajsgaSsrICkge1xuXHRcdFx0cmVzdWx0c1tpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBhbmQgbm9ybWFsaXNlIHRoZSB2YWx1ZSBvZiBwcmVjaXNpb24gKG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlcilcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrUHJlY2lzaW9uKHZhbCwgYmFzZSkge1xuXHRcdHZhbCA9IE1hdGgucm91bmQoTWF0aC5hYnModmFsKSk7XG5cdFx0cmV0dXJuIGlzTmFOKHZhbCk/IGJhc2UgOiB2YWw7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBmb3JtYXQgc3RyaW5nIG9yIG9iamVjdCBhbmQgcmV0dXJucyBmb3JtYXQgb2JqIGZvciB1c2UgaW4gcmVuZGVyaW5nXG5cdCAqXG5cdCAqIGBmb3JtYXRgIGlzIGVpdGhlciBhIHN0cmluZyB3aXRoIHRoZSBkZWZhdWx0IChwb3NpdGl2ZSkgZm9ybWF0LCBvciBvYmplY3Rcblx0ICogY29udGFpbmluZyBgcG9zYCAocmVxdWlyZWQpLCBgbmVnYCBhbmQgYHplcm9gIHZhbHVlcyAob3IgYSBmdW5jdGlvbiByZXR1cm5pbmdcblx0ICogZWl0aGVyIGEgc3RyaW5nIG9yIG9iamVjdClcblx0ICpcblx0ICogRWl0aGVyIHN0cmluZyBvciBmb3JtYXQucG9zIG11c3QgY29udGFpbiBcIiV2XCIgKHZhbHVlKSB0byBiZSB2YWxpZFxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDdXJyZW5jeUZvcm1hdChmb3JtYXQpIHtcblx0XHR2YXIgZGVmYXVsdHMgPSBsaWIuc2V0dGluZ3MuY3VycmVuY3kuZm9ybWF0O1xuXG5cdFx0Ly8gQWxsb3cgZnVuY3Rpb24gYXMgZm9ybWF0IHBhcmFtZXRlciAoc2hvdWxkIHJldHVybiBzdHJpbmcgb3Igb2JqZWN0KTpcblx0XHRpZiAoIHR5cGVvZiBmb3JtYXQgPT09IFwiZnVuY3Rpb25cIiApIGZvcm1hdCA9IGZvcm1hdCgpO1xuXG5cdFx0Ly8gRm9ybWF0IGNhbiBiZSBhIHN0cmluZywgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIChcIiV2XCIpIG11c3QgYmUgcHJlc2VudDpcblx0XHRpZiAoIGlzU3RyaW5nKCBmb3JtYXQgKSAmJiBmb3JtYXQubWF0Y2goXCIldlwiKSApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGFuZCByZXR1cm4gcG9zaXRpdmUsIG5lZ2F0aXZlIGFuZCB6ZXJvIGZvcm1hdHM6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwb3MgOiBmb3JtYXQsXG5cdFx0XHRcdG5lZyA6IGZvcm1hdC5yZXBsYWNlKFwiLVwiLCBcIlwiKS5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBmb3JtYXRcblx0XHRcdH07XG5cblx0XHQvLyBJZiBubyBmb3JtYXQsIG9yIG9iamVjdCBpcyBtaXNzaW5nIHZhbGlkIHBvc2l0aXZlIHZhbHVlLCB1c2UgZGVmYXVsdHM6XG5cdFx0fSBlbHNlIGlmICggIWZvcm1hdCB8fCAhZm9ybWF0LnBvcyB8fCAhZm9ybWF0LnBvcy5tYXRjaChcIiV2XCIpICkge1xuXG5cdFx0XHQvLyBJZiBkZWZhdWx0cyBpcyBhIHN0cmluZywgY2FzdHMgaXQgdG8gYW4gb2JqZWN0IGZvciBmYXN0ZXIgY2hlY2tpbmcgbmV4dCB0aW1lOlxuXHRcdFx0cmV0dXJuICggIWlzU3RyaW5nKCBkZWZhdWx0cyApICkgPyBkZWZhdWx0cyA6IGxpYi5zZXR0aW5ncy5jdXJyZW5jeS5mb3JtYXQgPSB7XG5cdFx0XHRcdHBvcyA6IGRlZmF1bHRzLFxuXHRcdFx0XHRuZWcgOiBkZWZhdWx0cy5yZXBsYWNlKFwiJXZcIiwgXCItJXZcIiksXG5cdFx0XHRcdHplcm8gOiBkZWZhdWx0c1xuXHRcdFx0fTtcblxuXHRcdH1cblx0XHQvLyBPdGhlcndpc2UsIGFzc3VtZSBmb3JtYXQgd2FzIGZpbmU6XG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fVxuXG5cblx0LyogLS0tIEFQSSBNZXRob2RzIC0tLSAqL1xuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIHN0cmluZy9hcnJheSBvZiBzdHJpbmdzLCByZW1vdmVzIGFsbCBmb3JtYXR0aW5nL2NydWZ0IGFuZCByZXR1cm5zIHRoZSByYXcgZmxvYXQgdmFsdWVcblx0ICogYWxpYXM6IGFjY291bnRpbmcuYHBhcnNlKHN0cmluZylgXG5cdCAqXG5cdCAqIERlY2ltYWwgbXVzdCBiZSBpbmNsdWRlZCBpbiB0aGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGZsb2F0cyAoZGVmYXVsdDogXCIuXCIpLCBzbyBpZiB0aGUgbnVtYmVyXG5cdCAqIHVzZXMgYSBub24tc3RhbmRhcmQgZGVjaW1hbCBzZXBhcmF0b3IsIHByb3ZpZGUgaXQgYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0ICpcblx0ICogQWxzbyBtYXRjaGVzIGJyYWNrZXRlZCBuZWdhdGl2ZXMgKGVnLiBcIiQgKDEuOTkpXCIgPT4gLTEuOTkpXG5cdCAqXG5cdCAqIERvZXNuJ3QgdGhyb3cgYW55IGVycm9ycyAoYE5hTmBzIGJlY29tZSAwKSBidXQgdGhpcyBtYXkgY2hhbmdlIGluIGZ1dHVyZVxuXHQgKi9cblx0dmFyIHVuZm9ybWF0ID0gbGliLnVuZm9ybWF0ID0gbGliLnBhcnNlID0gZnVuY3Rpb24odmFsdWUsIGRlY2ltYWwpIHtcblx0XHQvLyBSZWN1cnNpdmVseSB1bmZvcm1hdCBhcnJheXM6XG5cdFx0aWYgKGlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcblx0XHRcdFx0cmV0dXJuIHVuZm9ybWF0KHZhbCwgZGVjaW1hbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBGYWlscyBzaWxlbnRseSAobmVlZCBkZWNlbnQgZXJyb3JzKTpcblx0XHR2YWx1ZSA9IHZhbHVlIHx8IDA7XG5cblx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGFzLWlzIGlmIGl0J3MgYWxyZWFkeSBhIG51bWJlcjpcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gdmFsdWU7XG5cblx0XHQvLyBEZWZhdWx0IGRlY2ltYWwgcG9pbnQgaXMgXCIuXCIgYnV0IGNvdWxkIGJlIHNldCB0byBlZy4gXCIsXCIgaW4gb3B0czpcblx0XHRkZWNpbWFsID0gZGVjaW1hbCB8fCBcIi5cIjtcblxuXHRcdCAvLyBCdWlsZCByZWdleCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBleGNlcHQgZGlnaXRzLCBkZWNpbWFsIHBvaW50IGFuZCBtaW51cyBzaWduOlxuXHRcdHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXjAtOS1cIiArIGRlY2ltYWwgKyBcIl1cIiwgW1wiZ1wiXSksXG5cdFx0XHR1bmZvcm1hdHRlZCA9IHBhcnNlRmxvYXQoXG5cdFx0XHRcdChcIlwiICsgdmFsdWUpXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCgoLiopXFwpLywgXCItJDFcIikgLy8gcmVwbGFjZSBicmFja2V0ZWQgdmFsdWVzIHdpdGggbmVnYXRpdmVzXG5cdFx0XHRcdC5yZXBsYWNlKHJlZ2V4LCAnJykgICAgICAgICAvLyBzdHJpcCBvdXQgYW55IGNydWZ0XG5cdFx0XHRcdC5yZXBsYWNlKGRlY2ltYWwsICcuJykgICAgICAvLyBtYWtlIHN1cmUgZGVjaW1hbCBwb2ludCBpcyBzdGFuZGFyZFxuXHRcdFx0KTtcblxuXHRcdC8vIFRoaXMgd2lsbCBmYWlsIHNpbGVudGx5IHdoaWNoIG1heSBjYXVzZSB0cm91YmxlLCBsZXQncyB3YWl0IGFuZCBzZWU6XG5cdFx0cmV0dXJuICFpc05hTih1bmZvcm1hdHRlZCkgPyB1bmZvcm1hdHRlZCA6IDA7XG5cdH07XG5cblxuXHQvKipcblx0ICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcblx0ICpcblx0ICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gXCIwLjYxXCIpIHRoYXQgcHJlc2VudFxuXHQgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cblx0ICovXG5cdHZhciB0b0ZpeGVkID0gbGliLnRvRml4ZWQgPSBmdW5jdGlvbih2YWx1ZSwgcHJlY2lzaW9uKSB7XG5cdFx0cHJlY2lzaW9uID0gY2hlY2tQcmVjaXNpb24ocHJlY2lzaW9uLCBsaWIuc2V0dGluZ3MubnVtYmVyLnByZWNpc2lvbik7XG5cdFx0dmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG5cblx0XHQvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcblx0XHRyZXR1cm4gKE1hdGgucm91bmQobGliLnVuZm9ybWF0KHZhbHVlKSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbnVtYmVyLCB3aXRoIGNvbW1hLXNlcGFyYXRlZCB0aG91c2FuZHMgYW5kIGN1c3RvbSBwcmVjaXNpb24vZGVjaW1hbCBwbGFjZXNcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgcHJlY2lzaW9uIGFuZCB0aG91c2FuZCAvIGRlY2ltYWwgc2VwYXJhdG9yc1xuXHQgKiAybmQgcGFyYW1ldGVyIGBwcmVjaXNpb25gIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLm51bWJlcmBcblx0ICovXG5cdHZhciBmb3JtYXROdW1iZXIgPSBsaWIuZm9ybWF0TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKSB7XG5cdFx0XHRcdHJldHVybiBmb3JtYXROdW1iZXIodmFsLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIG51bWJlcjpcblx0XHRudW1iZXIgPSB1bmZvcm1hdChudW1iZXIpO1xuXG5cdFx0Ly8gQnVpbGQgb3B0aW9ucyBvYmplY3QgZnJvbSBzZWNvbmQgcGFyYW0gKGlmIG9iamVjdCkgb3IgYWxsIHBhcmFtcywgZXh0ZW5kaW5nIGRlZmF1bHRzOlxuXHRcdHZhciBvcHRzID0gZGVmYXVsdHMoXG5cdFx0XHRcdChpc09iamVjdChwcmVjaXNpb24pID8gcHJlY2lzaW9uIDoge1xuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRsaWIuc2V0dGluZ3MubnVtYmVyXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDbGVhbiB1cCBwcmVjaXNpb25cblx0XHRcdHVzZVByZWNpc2lvbiA9IGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSxcblxuXHRcdFx0Ly8gRG8gc29tZSBjYWxjOlxuXHRcdFx0bmVnYXRpdmUgPSBudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiLFxuXHRcdFx0YmFzZSA9IHBhcnNlSW50KHRvRml4ZWQoTWF0aC5hYnMobnVtYmVyIHx8IDApLCB1c2VQcmVjaXNpb24pLCAxMCkgKyBcIlwiLFxuXHRcdFx0bW9kID0gYmFzZS5sZW5ndGggPiAzID8gYmFzZS5sZW5ndGggJSAzIDogMDtcblxuXHRcdC8vIEZvcm1hdCB0aGUgbnVtYmVyOlxuXHRcdHJldHVybiBuZWdhdGl2ZSArIChtb2QgPyBiYXNlLnN1YnN0cigwLCBtb2QpICsgb3B0cy50aG91c2FuZCA6IFwiXCIpICsgYmFzZS5zdWJzdHIobW9kKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgb3B0cy50aG91c2FuZCkgKyAodXNlUHJlY2lzaW9uID8gb3B0cy5kZWNpbWFsICsgdG9GaXhlZChNYXRoLmFicyhudW1iZXIpLCB1c2VQcmVjaXNpb24pLnNwbGl0KCcuJylbMV0gOiBcIlwiKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgYSBudW1iZXIgaW50byBjdXJyZW5jeVxuXHQgKlxuXHQgKiBVc2FnZTogYWNjb3VudGluZy5mb3JtYXRNb25leShudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZHNTZXAsIGRlY2ltYWxTZXAsIGZvcm1hdClcblx0ICogZGVmYXVsdHM6ICgwLCBcIiRcIiwgMiwgXCIsXCIsIFwiLlwiLCBcIiVzJXZcIilcblx0ICpcblx0ICogTG9jYWxpc2UgYnkgb3ZlcnJpZGluZyB0aGUgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kIC8gZGVjaW1hbCBzZXBhcmF0b3JzIGFuZCBmb3JtYXRcblx0ICogU2Vjb25kIHBhcmFtIGNhbiBiZSBhbiBvYmplY3QgbWF0Y2hpbmcgYHNldHRpbmdzLmN1cnJlbmN5YCB3aGljaCBpcyB0aGUgZWFzaWVzdCB3YXkuXG5cdCAqXG5cdCAqIFRvIGRvOiB0aWR5IHVwIHRoZSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHR2YXIgZm9ybWF0TW9uZXkgPSBsaWIuZm9ybWF0TW9uZXkgPSBmdW5jdGlvbihudW1iZXIsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0Ly8gUmVzdXJzaXZlbHkgZm9ybWF0IGFycmF5czpcblx0XHRpZiAoaXNBcnJheShudW1iZXIpKSB7XG5cdFx0XHRyZXR1cm4gbWFwKG51bWJlciwgZnVuY3Rpb24odmFsKXtcblx0XHRcdFx0cmV0dXJuIGZvcm1hdE1vbmV5KHZhbCwgc3ltYm9sLCBwcmVjaXNpb24sIHRob3VzYW5kLCBkZWNpbWFsLCBmb3JtYXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgbnVtYmVyOlxuXHRcdG51bWJlciA9IHVuZm9ybWF0KG51bWJlcik7XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pOlxuXHRcdFx0Zm9ybWF0cyA9IGNoZWNrQ3VycmVuY3lGb3JtYXQob3B0cy5mb3JtYXQpLFxuXG5cdFx0XHQvLyBDaG9vc2Ugd2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgdGhpcyB2YWx1ZTpcblx0XHRcdHVzZUZvcm1hdCA9IG51bWJlciA+IDAgPyBmb3JtYXRzLnBvcyA6IG51bWJlciA8IDAgPyBmb3JtYXRzLm5lZyA6IGZvcm1hdHMuemVybztcblxuXHRcdC8vIFJldHVybiB3aXRoIGN1cnJlbmN5IHN5bWJvbCBhZGRlZDpcblx0XHRyZXR1cm4gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKG51bWJlciksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogRm9ybWF0IGEgbGlzdCBvZiBudW1iZXJzIGludG8gYW4gYWNjb3VudGluZyBjb2x1bW4sIHBhZGRpbmcgd2l0aCB3aGl0ZXNwYWNlXG5cdCAqIHRvIGxpbmUgdXAgY3VycmVuY3kgc3ltYm9scywgdGhvdXNhbmQgc2VwYXJhdG9ycyBhbmQgZGVjaW1hbHMgcGxhY2VzXG5cdCAqXG5cdCAqIExpc3Qgc2hvdWxkIGJlIGFuIGFycmF5IG9mIG51bWJlcnNcblx0ICogU2Vjb25kIHBhcmFtZXRlciBjYW4gYmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyB0aGF0IG1hdGNoIHRoZSBwYXJhbXNcblx0ICpcblx0ICogUmV0dXJucyBhcnJheSBvZiBhY2NvdXRpbmctZm9ybWF0dGVkIG51bWJlciBzdHJpbmdzIG9mIHNhbWUgbGVuZ3RoXG5cdCAqXG5cdCAqIE5COiBgd2hpdGUtc3BhY2U6cHJlYCBDU1MgcnVsZSBpcyByZXF1aXJlZCBvbiB0aGUgbGlzdCBjb250YWluZXIgdG8gcHJldmVudFxuXHQgKiBicm93c2VycyBmcm9tIGNvbGxhcHNpbmcgdGhlIHdoaXRlc3BhY2UgaW4gdGhlIG91dHB1dCBzdHJpbmdzLlxuXHQgKi9cblx0bGliLmZvcm1hdENvbHVtbiA9IGZ1bmN0aW9uKGxpc3QsIHN5bWJvbCwgcHJlY2lzaW9uLCB0aG91c2FuZCwgZGVjaW1hbCwgZm9ybWF0KSB7XG5cdFx0aWYgKCFsaXN0KSByZXR1cm4gW107XG5cblx0XHQvLyBCdWlsZCBvcHRpb25zIG9iamVjdCBmcm9tIHNlY29uZCBwYXJhbSAoaWYgb2JqZWN0KSBvciBhbGwgcGFyYW1zLCBleHRlbmRpbmcgZGVmYXVsdHM6XG5cdFx0dmFyIG9wdHMgPSBkZWZhdWx0cyhcblx0XHRcdFx0KGlzT2JqZWN0KHN5bWJvbCkgPyBzeW1ib2wgOiB7XG5cdFx0XHRcdFx0c3ltYm9sIDogc3ltYm9sLFxuXHRcdFx0XHRcdHByZWNpc2lvbiA6IHByZWNpc2lvbixcblx0XHRcdFx0XHR0aG91c2FuZCA6IHRob3VzYW5kLFxuXHRcdFx0XHRcdGRlY2ltYWwgOiBkZWNpbWFsLFxuXHRcdFx0XHRcdGZvcm1hdCA6IGZvcm1hdFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bGliLnNldHRpbmdzLmN1cnJlbmN5XG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBDaGVjayBmb3JtYXQgKHJldHVybnMgb2JqZWN0IHdpdGggcG9zLCBuZWcgYW5kIHplcm8pLCBvbmx5IG5lZWQgcG9zIGZvciBub3c6XG5cdFx0XHRmb3JtYXRzID0gY2hlY2tDdXJyZW5jeUZvcm1hdChvcHRzLmZvcm1hdCksXG5cblx0XHRcdC8vIFdoZXRoZXIgdG8gcGFkIGF0IHN0YXJ0IG9mIHN0cmluZyBvciBhZnRlciBjdXJyZW5jeSBzeW1ib2w6XG5cdFx0XHRwYWRBZnRlclN5bWJvbCA9IGZvcm1hdHMucG9zLmluZGV4T2YoXCIlc1wiKSA8IGZvcm1hdHMucG9zLmluZGV4T2YoXCIldlwiKSA/IHRydWUgOiBmYWxzZSxcblxuXHRcdFx0Ly8gU3RvcmUgdmFsdWUgZm9yIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nIGluIHRoZSBjb2x1bW46XG5cdFx0XHRtYXhMZW5ndGggPSAwLFxuXG5cdFx0XHQvLyBGb3JtYXQgdGhlIGxpc3QgYWNjb3JkaW5nIHRvIG9wdGlvbnMsIHN0b3JlIHRoZSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc3RyaW5nOlxuXHRcdFx0Zm9ybWF0dGVkID0gbWFwKGxpc3QsIGZ1bmN0aW9uKHZhbCwgaSkge1xuXHRcdFx0XHRpZiAoaXNBcnJheSh2YWwpKSB7XG5cdFx0XHRcdFx0Ly8gUmVjdXJzaXZlbHkgZm9ybWF0IGNvbHVtbnMgaWYgbGlzdCBpcyBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5OlxuXHRcdFx0XHRcdHJldHVybiBsaWIuZm9ybWF0Q29sdW1uKHZhbCwgb3B0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYW4gdXAgdGhlIHZhbHVlXG5cdFx0XHRcdFx0dmFsID0gdW5mb3JtYXQodmFsKTtcblxuXHRcdFx0XHRcdC8vIENob29zZSB3aGljaCBmb3JtYXQgdG8gdXNlIGZvciB0aGlzIHZhbHVlIChwb3MsIG5lZyBvciB6ZXJvKTpcblx0XHRcdFx0XHR2YXIgdXNlRm9ybWF0ID0gdmFsID4gMCA/IGZvcm1hdHMucG9zIDogdmFsIDwgMCA/IGZvcm1hdHMubmVnIDogZm9ybWF0cy56ZXJvLFxuXG5cdFx0XHRcdFx0XHQvLyBGb3JtYXQgdGhpcyB2YWx1ZSwgcHVzaCBpbnRvIGZvcm1hdHRlZCBsaXN0IGFuZCBzYXZlIHRoZSBsZW5ndGg6XG5cdFx0XHRcdFx0XHRmVmFsID0gdXNlRm9ybWF0LnJlcGxhY2UoJyVzJywgb3B0cy5zeW1ib2wpLnJlcGxhY2UoJyV2JywgZm9ybWF0TnVtYmVyKE1hdGguYWJzKHZhbCksIGNoZWNrUHJlY2lzaW9uKG9wdHMucHJlY2lzaW9uKSwgb3B0cy50aG91c2FuZCwgb3B0cy5kZWNpbWFsKSk7XG5cblx0XHRcdFx0XHRpZiAoZlZhbC5sZW5ndGggPiBtYXhMZW5ndGgpIG1heExlbmd0aCA9IGZWYWwubGVuZ3RoO1xuXHRcdFx0XHRcdHJldHVybiBmVmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIFBhZCBlYWNoIG51bWJlciBpbiB0aGUgbGlzdCBhbmQgc2VuZCBiYWNrIHRoZSBjb2x1bW4gb2YgbnVtYmVyczpcblx0XHRyZXR1cm4gbWFwKGZvcm1hdHRlZCwgZnVuY3Rpb24odmFsLCBpKSB7XG5cdFx0XHQvLyBPbmx5IGlmIHRoaXMgaXMgYSBzdHJpbmcgKG5vdCBhIG5lc3RlZCBhcnJheSwgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcGFkZGVkKTpcblx0XHRcdGlmIChpc1N0cmluZyh2YWwpICYmIHZhbC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcblx0XHRcdFx0Ly8gRGVwZW5kaW5nIG9uIHN5bWJvbCBwb3NpdGlvbiwgcGFkIGFmdGVyIHN5bWJvbCBvciBhdCBpbmRleCAwOlxuXHRcdFx0XHRyZXR1cm4gcGFkQWZ0ZXJTeW1ib2wgPyB2YWwucmVwbGFjZShvcHRzLnN5bWJvbCwgb3B0cy5zeW1ib2wrKG5ldyBBcnJheShtYXhMZW5ndGggLSB2YWwubGVuZ3RoICsgMSkuam9pbihcIiBcIikpKSA6IChuZXcgQXJyYXkobWF4TGVuZ3RoIC0gdmFsLmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpKSArIHZhbDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvKiAtLS0gTW9kdWxlIERlZmluaXRpb24gLS0tICovXG5cblx0Ly8gRXhwb3J0IGFjY291bnRpbmcgZm9yIENvbW1vbkpTLiBJZiBiZWluZyBsb2FkZWQgYXMgYW4gQU1EIG1vZHVsZSwgZGVmaW5lIGl0IGFzIHN1Y2guXG5cdC8vIE90aGVyd2lzZSwganVzdCBhZGQgYGFjY291bnRpbmdgIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5cdGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRcdGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcblx0XHR9XG5cdFx0ZXhwb3J0cy5hY2NvdW50aW5nID0gbGliO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIFJldHVybiB0aGUgbGlicmFyeSBhcyBhbiBBTUQgbW9kdWxlOlxuXHRcdGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbGliO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFVzZSBhY2NvdW50aW5nLm5vQ29uZmxpY3QgdG8gcmVzdG9yZSBgYWNjb3VudGluZ2AgYmFjayB0byBpdHMgb3JpZ2luYWwgdmFsdWUuXG5cdFx0Ly8gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgbGlicmFyeSdzIGBhY2NvdW50aW5nYCBvYmplY3Q7XG5cdFx0Ly8gZS5nLiBgdmFyIG51bWJlcnMgPSBhY2NvdW50aW5nLm5vQ29uZmxpY3QoKTtgXG5cdFx0bGliLm5vQ29uZmxpY3QgPSAoZnVuY3Rpb24ob2xkQWNjb3VudGluZykge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBSZXNldCB0aGUgdmFsdWUgb2YgdGhlIHJvb3QncyBgYWNjb3VudGluZ2AgdmFyaWFibGU6XG5cdFx0XHRcdHJvb3QuYWNjb3VudGluZyA9IG9sZEFjY291bnRpbmc7XG5cdFx0XHRcdC8vIERlbGV0ZSB0aGUgbm9Db25mbGljdCBtZXRob2Q6XG5cdFx0XHRcdGxpYi5ub0NvbmZsaWN0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHQvLyBSZXR1cm4gcmVmZXJlbmNlIHRvIHRoZSBsaWJyYXJ5IHRvIHJlLWFzc2lnbiBpdDpcblx0XHRcdFx0cmV0dXJuIGxpYjtcblx0XHRcdH07XG5cdFx0fSkocm9vdC5hY2NvdW50aW5nKTtcblxuXHRcdC8vIERlY2xhcmUgYGZ4YCBvbiB0aGUgcm9vdCAoZ2xvYmFsL3dpbmRvdykgb2JqZWN0OlxuXHRcdHJvb3RbJ2FjY291bnRpbmcnXSA9IGxpYjtcblx0fVxuXG5cdC8vIFJvb3Qgd2lsbCBiZSBgd2luZG93YCBpbiBicm93c2VyIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXI6XG59KHRoaXMpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi92ZW5kb3IvYWNjb3VudGluZy5qcy9hY2NvdW50aW5nLmpzXG4gKiogbW9kdWxlIGlkID0gMTA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDEgMiAzIDZcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXHJcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIGFjY291bnRpbmcgPSByZXF1aXJlKCdhY2NvdW50aW5nLmpzJylcclxuICAgICAgICAvL015dHJhdmVsbGVyID0gcmVxdWlyZSgnYXBwL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpICAgO1xyXG4gICAgICAgIDtcclxuXHJcblxyXG52YXIgdDJtID0gZnVuY3Rpb24gKHRpbWUpIHtcclxuICAgIHZhciBpID0gdGltZS5zcGxpdCgnOicpO1xyXG5cclxuICAgIHJldHVybiBpWzBdICogNjAgKyBpWzFdO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXlib29raW5ncy9kZXRhaWxzLmh0bWwnKSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZW1haWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgZm9ybWF0QmlydGhEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUaXRsZTogZnVuY3Rpb24gKHRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aXRsZXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0VHJhdmVsRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMjogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIE1NTSBEIFlZWVknKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMzogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIEhIOm1tJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1czogZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29uZmlybSc7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdub3Rjb25maXJtJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbmZpcm1lZCc7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3QgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYWJib29raW5nU3RhdHVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQoc3QsIHsnaWQnOiBzdGF0dXN9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlmZjogZnVuY3Rpb24gKGVuZCwgc3RhcnQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbXMgPSBtb21lbnQoZW5kLCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZGlmZihtb21lbnQoc3RhcnQsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG1vbWVudC5kdXJhdGlvbihtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihkLmFzSG91cnMoKSkgKyAnaCAnICsgZC5taW51dGVzKCkgKyAnbSc7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3M6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJzID09IDEgfHwgYnMgPT0gMiB8fCBicyA9PSAzIHx8ICBicyA9PSA3KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInByb2dyZXNzXCI7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA0IHx8IGJzID09IDUgfHwgYnMgPT0gNiB8fCBicyA9PSAxMilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjYW5jZWxsZWRcIjtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJzID09IDggfHwgYnMgPT0gOSB8fCBicyA9PSAxMCB8fCBicyA9PSAxMSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJib29rZWRcIjtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdTdGF0dXNNZXNzYWdlOiBmdW5jdGlvbiAoYnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBia3MgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYm9va2luZ1N0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQoYmtzLCB7J2lkJzogYnN9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udmVydDogZnVuY3Rpb24gKGFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY291bnRpbmcuZm9ybWF0TW9uZXkoYW1vdW50LCAnJywgMCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnZlcnRJeGlnbzogZnVuY3Rpb24gKGFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY291bnRpbmcudW5mb3JtYXQoYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICcnLCAwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIHRvZ2dsZWVtYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXQoJ3N1Ym1pdHRpbmcnKSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0KCdtZXRhLnVzZXIuZW1haWwnKTtcclxuICAgICAgICAvL3RoaXMuc2V0KCdlbWFpbCcsIGVtYWlsKTtcclxuICAgICAgICAkKCcjZW1haWwnKS52YWwoZW1haWwpO1xyXG4gICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAvLyB0aGlzLnNpZ25pbigpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbmluaXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vbignYmFjaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwibXlib29raW5ncy9cIikgPiAtMSlcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzJztcclxuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwibXlib29raW5nc1wiKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3N1bW1hcnknLCB0cnVlKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVSTC5pbmRleE9mKFwiZ3Vlc3Rib29raW5nXCIpID4gLTEpXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYjJjL2FpckNhcnQvZ3Vlc3Rib29raW5nJztcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdjYW5jZWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdhbWVuZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ2NhbmNlbCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3Jlc2NoZWR1bGUnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25pbm4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdyZXNjaGVkdWxlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnYW1lbmQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdyZXNjaGVkdWxlJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnY2FuY2VsJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaWduaW5uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdwcmludGRpdicsIGZ1bmN0aW9uIChldmVudCwgaWQpIHtcclxuICAgICAgICAgICAgLy93aW5kb3cucHJpbnQoKTtcclxuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9haXJDYXJ0L3ByaW50LycgKyBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbignYXNQREYnLCBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XHJcbiAgICAgICAgICAgIC8vd2luZG93LmxvY2F0aW9uKCcvYjJjL2FpckNhcnQvYXNQREYvJytpZCk7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gdGhpcy5nZXQoJ21ldGEudXNlcicpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FpckNhcnQvYXNQREYvXCIgKyBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbmlubigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbignY2xvc2VtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICQoJy51aS5wb3NpdGl2ZS5tZXNzYWdlJykuZmFkZU91dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBzdWJtaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldCgnbWV0YS51c2VyJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICQoJy5tZXNzYWdlJykuZmFkZUluKCk7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvc2VuZEVtYWlsLycgKyB2aWV3LmdldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWQnKSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtlbWFpbDogJCgnI2VtYWlsJykudmFsKCksIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LmRlZmVycmVkLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JNc2cnLCAnU2VydmVyIHJldHVybmVkIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHZpZXcuZmluZCgnLnVpLm1vZGFsJykpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgXHJcbiAgICB9LFxyXG4gICAgc2lnbmlubjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyh2aWV3LmdldCgnbXlib29raW5ncycpKTtcclxuICAgICAgICBBdXRoLmxvZ2luKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHZpZXcuZ2V0KCdteWJvb2tpbmdzJykuY3VycmVudENhcnREZXRhaWxzLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnbWV0YS51c2VyJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9iMmMvYWlyQ2FydC9teWJvb2tpbmdzLycgKyB2aWV3LmdldCgnbXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvZGV0YWlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDE2MVxuICoqIG1vZHVsZSBjaHVua3MgPSAyIDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwb3NpdGl2ZSAgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6IG5vbmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9LFwidlwiOntcImNsaWNrXCI6XCJjbG9zZW1lc3NhZ2VcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOltcIlNlbmRpbmcgRW1haWwuLlwiXSxcIm5cIjo1MCxcInJcIjpcIi4vc3VibWl0dGluZ1wifSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbXCJFbWFpbCBTZW50XCJdLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLnByaW50XCJdLFwic1wiOlwiIV8wXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiYm94IG15LWJvb2tpbmdzLWRldGFpbHMgXCIse1widFwiOjQsXCJmXCI6W1widWkgc2VnbWVudCBsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5wZW5kaW5nXCJ9XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDNcIixcImZcIjpbXCJNeSBCb29raW5ncyBEZXRhaWxzXCJdfSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiIG5vcHJpbnQgdWkgZ3JpZCB0aHJlZSBjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJyZXNjaGVkdWxlXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbGVyIHVpIGJ1dHRvbiBvcmFuZ2VcIn0sXCJmXCI6W1wiQ2hhbmdlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJjYW5jZWxcIn0sXCJhXCI6e1wiY2xhc3NcIjpcInNtYWxsZXIgdWkgYnV0dG9uIHJlZFwifSxcImZcIjpbXCJDYW5jZWxcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1widXBjb21pbmdcIl0sXCJzXCI6XCJfMD09XFxcInRydWVcXFwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6XCJiYWNrXCJ9LFwiYVwiOntcImNsYXNzXCI6XCJzbWFsbGVyIHVpIGJ1dHRvbiB5ZWxsb3dcIn0sXCJmXCI6W1wiQmFja1wiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCIgbm9wcmludCB1aSBncmlkIHRocmVlIGNvbHVtblwiLFwic3R5bGVcIjpcIndpZHRoOjEwMCVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImFjdGlvblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiI1wiLFwiY2xhc3NcIjpcImVtYWlsXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwidG9nZ2xlZW1haWxcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwibVwiOlt7XCJ0XCI6NCxcImZcIjpbXCJkaXNhYmxlZD0nZGlzYWJsZWQnXCJdLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJzdWJtaXR0aW5nXCJdLFwic1wiOlwiIV8wXCJ9fV0sXCJmXCI6W1wiRW1haWxcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpbXCIvYjJjL2FpckNhcnQvYXNQREYvXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZFwifV0sXCJ0YXJnZXRcIjpcIl9ibGFua1wiLFwiY2xhc3NcIjpcInBkZlwifSxcImZcIjpbXCJQREZcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbW9kYWwgc21hbGwgbWFpbHRpY2tldFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNsb3NlIGljb25cIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhlYWRlclwifSxcImZcIjpbXCJFbWFpbCBUaWNrZXRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJhc2ljIHNlZ21lbnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZm9ybVwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgZm9ybSBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwiLi9zdWJtaXR0aW5nXCJ9XSxcImFjdGlvblwiOlwiamF2YXNjcmlwdDo7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbnB1dCBzbWFsbFwiLFwidHlwZVwiOlwidGV4dFwiLFwibmFtZVwiOlwiZW1haWxcIixcImlkXCI6XCJlbWFpbFwiLFwidmFsdWVcIjpcIlwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYnV0dG9uXCIsXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzbWFsbCBidXR0b24gZmx1aWQgeWVsbG93XCJ9LFwiZlwiOltcIlNlbmRcIl19XX1dfV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MucHJpbnRcIl0sXCJzXCI6XCIhXzBcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJ1aSBncmlkIGdyb3VwIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3NcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBncmlkIHR3byBjb2x1bW5cIixcInN0eWxlXCI6XCJ3aWR0aDoxMDAlXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIiB0YWJsZSB0aXRsZSBcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuc291cmNlXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wiLFwic3R5bGVcIjpcIm1hcmdpbi10b3A6IDNweDtcIn0sXCJmXCI6W1wiwqBcIl19LHtcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5kZXN0aW5hdGlvblwifV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZSB0aXRsZVwiLFwic3R5bGVcIjpcImZsb2F0OmxlZnRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5zb3VyY2VcIn0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhY2tcIixcInN0eWxlXCI6XCJtYXJnaW4tdG9wOiAzcHg7XCJ9LFwiZlwiOltcIsKgXCJdfSx7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuZGVzdGluYXRpb25cIn1dfV19XSxcInhcIjp7XCJyXCI6W1wicmV0dXJuZGF0ZVwiXSxcInNcIjpcIl8wPT1udWxsXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW4gdGFibGUgdGl0bGVcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJzb3VyY2VcIn0sXCLCoCB8IMKgXCJdLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZ3NcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInJcIjpbXCJib29raW5ncy5sZW5ndGhcIl0sXCJzXCI6XCJfMC0xXCJ9LFwiZGVzdGluYXRpb25cIl19fV19XX1dLFwieFwiOntcInJcIjpbXCJpc011bHRpQ2l0eVwiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCIgdGFibGUgdGl0bGVcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGF0ZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImJvb2tpbmdzLjAuZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBncmlkIHR3byBjb2x1bW5cIixcInN0eWxlXCI6XCJ3aWR0aDoxMDAlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCIgdGFibGUgdGl0bGVcIixcInN0eWxlXCI6XCJmbG9hdDpsZWZ0XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ1N0YXR1c0NsYXNzXCIsXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJib29raW5nX3N0YXR1c21zZ1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiIHRhYmxlIHRpdGxlXCIsXCJzdHlsZVwiOlwiZmxvYXQ6bGVmdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tpbmctaWRcIn0sXCJmXCI6W1wiQm9va2luZyBJZDogXCIse1widFwiOjIsXCJyXCI6XCJpZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nRGF0ZVwiLFwiY3JlYXRlZFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlcldyYXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJQYXNzZW5nZXI6XCJdfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcInRpdGxlXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiZmlyc3RfbmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImxhc3RfbmFtZVwifSxcIiAoXCIse1widFwiOjIsXCJyXCI6XCJ0eXBlXCJ9LFwiKSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1widHJhdmVsbGVyQm9va2luZ1N0YXR1c1wiLFwic3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInN0YXR1c21zZ1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJDUlMgUE5SOlwiXX0se1widFwiOjIsXCJyXCI6XCJjcnNfcG5yXCJ9LFwiLCBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJBaXIgUE5SOlwiXX0se1widFwiOjIsXCJyXCI6XCJhaXJsaW5lX3BuclwifSxcIiwgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiVGlja2V0IE5vLjpcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwidGlja2V0XCJ9XX1dfV0sXCJpXCI6XCJ0XCIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJ0cmF2ZWxsZXJcIl19fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzaXh0ZWVuIHdpZGUgY29sdW1uIFwiLFwic3R5bGVcIjpcImhlaWdodDogYXV0byAhaW1wb3J0YW50O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgc2VnbWVudCBmbGlnaHQtaXRpbmVyYXJ5IGNvbXBhY3QgZGFya1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGl0bGVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjaXR5XCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInNvdXJjZVwifSxcIiDihpIgXCIse1widFwiOjIsXCJyXCI6XCJkZXN0aW5hdGlvblwifV19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlMlwiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidGltZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHR0aW1lXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJzZWdtZW50V3JhcFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudHNcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZGl2aWRlclwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImxheW92ZXJcIn0sXCJmXCI6W1wiTGF5b3ZlcjogXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImRpZmZcIixcImtcIixcImpcIixcImJvb2tpbmdzXCJdLFwic1wiOlwiXzAoXzNbXzJdLnJvdXRlc1tfMV0uZGVwYXJ0dXJlLF8zW18yXS5yb3V0ZXNbXzEtMV0uYXJyaXZhbClcIn19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImtcIl0sXCJzXCI6XCJfMD4wXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLW5hbWVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjYXJyaWVyLWxvZ29cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIHRvcCBhbGlnbmVkIGF2YXRhciBpbWFnZVwiLFwic3JjXCI6W1wiL2ltZy9haXJfbG9nb3MvXCIse1widFwiOjIsXCJyXCI6XCJjYXJyaWVyXCJ9LFwiLnBuZ1wiXSxcImFsdFwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9XSxcInRpdGxlXCI6W3tcInRcIjoyLFwiclwiOlwiY2Fycmllck5hbWVcIn1dfX1dfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiY2FycmllclwifSxcIi1cIix7XCJ0XCI6MixcInJcIjpcImZsaWdodE51bWJlclwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZyb21cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYlwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm9yaWdpblwifSxcIjpcIl19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlM1wiLFwiZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJkZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wic3R5bGVcIjpcInRleHQtYWxpZ246IHJpZ2h0O1wiLFwiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwib3JpZ2luRGV0YWlsc1wifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmxpZ2h0XCJ9LFwiZlwiOltcIsKgXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25cIn0sXCI6XCJdfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZTNcIixcImFycml2YWxcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImFycml2YWxcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImFpcnBvcnRcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25EZXRhaWxzXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aW1lLW4tY2FiaW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0dGltZVwifSx7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJib29raW5nc1wiLFwibVwiOlt7XCJ0XCI6MzAsXCJuXCI6XCJqXCJ9LFwidHJhdmVsbGVyXCIse1wiclwiOltdLFwic1wiOlwiMFwifSxcImNhYmluXCJdfX1dfV19XSxcImlcIjpcImtcIixcInJ4XCI6e1wiclwiOlwiYm9va2luZ3NcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwialwifSxcInJvdXRlc1wiXX19XX1dfV19XX1dfV0sXCJpXCI6XCJqXCIsXCJyXCI6XCJib29raW5nc1wifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b3RhbFwifSxcImZcIjpbXCJUT1RBTCBQUklDRTogXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiY3VyZW5jeVwifSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiY29udmVydFwiLFwidG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidGF4ZXNcIn0sXCJmXCI6W1wiQmFzaWMgRmFyZSA6IFwiLHtcInRcIjoyLFwiclwiOlwiYmFzZXByaWNlXCJ9LFwiICwgVGF4ZXMgOiBcIix7XCJ0XCI6MixcInJcIjpcInRheGVzXCJ9LFwiICwgRmVlIDogXCIse1widFwiOjIsXCJyXCI6XCJmZWVcIn1dfV19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjogYm90aDtcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGFibGVcIixcImFcIjp7XCJjbGFzc1wiOlwicGFzc2VuZ2VyXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRyXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidGhcIixcImFcIjp7XCJjb2xzcGFuXCI6XCI0XCJ9LFwiZlwiOltcIlRlcm1zIGFuZCBDb25kaXRpb25zXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidHJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ0ZFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInVsXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJBbGwgZmxpZ2h0IHRpbWluZ3Mgc2hvd24gYXJlIGxvY2FsIHRpbWVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlVzZSBcIix7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJSZWYgTm8uXCJdfSxcIiBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIHVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIlVzZSBcIix7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbXCJBaXJsaW5lIFBOUlwiXX0sXCIgZm9yIGNvbnRhY3RpbmcgdGhlIEFpcmxpbmVzLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkNhcnJ5IGEgcHJpbnQtb3V0IG9mIGUtdGlja2V0IGZvciBjaGVjay1pbi5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJJbiBjYXNlIG9mIG5vLXNob3csIHRpY2tldHMgYXJlIG5vbi1yZWZ1bmRhYmxlLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkVuc3VyZSB5b3VyIHBhc3Nwb3J0IGlzIHZhbGlkIGZvciBtb3JlIHRoYW4gNiBtb250aHMuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiUGxlYXNlIGNoZWNrIFRyYW5zaXQgJiBEZXN0aW5hdGlvbiBWaXNhIFJlcXVpcmVtZW50LlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkZvciBjYW5jZWxsYXRpb24sIGFpcmxpbmUgY2hhcmdlcyAmIHNlci4gZmVlIGFwcGx5LlwiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGRcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJ1bFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiQ2FycnkgYSBwaG90byBJRC8gUGFzc3BvcnQgZm9yIGNoZWNrLWluLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIk1lYWxzLCBTZWF0ICYgU3BlY2lhbCBSZXF1ZXN0cyBhcmUgbm90IGd1YXJhbnRlZWQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiUHJlc2VudCBGcmVxdWVudCBGbGllciBDYXJkIGF0IGNoZWNrLWluLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkNhcnJpYWdlIGlzIHN1YmplY3QgdG8gQWlybGluZXMgVGVybXMgJiBDb25kaXRpb25zLlwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcIkVuc3VyZSBwYXNzZW5nZXIgbmFtZXMgYXJlIGNvcnJlY3QsIG5hbWUgY2hhbmdlIGlzIG5vdCBwZXJtaXR0ZWQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImxpXCIsXCJmXCI6W1wiRm9yIGFueSBjaGFuZ2UgQWlybGluZSBjaGFyZ2VzLCBkaWZmZXJlbmNlIG9mIGZhcmUgJiBzZXIuIGZlZSBhcHBseS5cIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbXCJZb3UgbWlnaHQgYmUgYXNrZWQgdG8gcHJvdmlkZSBjYXJkIGNvcHkgJiBJRCBwcm9vZiBvZiBjYXJkIGhvbGRlci5cIl19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJzdHlsZVwiOlwiY2xlYXI6IGJvdGg7XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJcIn0sXCJmXCI6W1wiRGlzY2xhaW1lcjogQ2hlYXBUaWNrZXQgaXMgbm90IGxpYWJsZSBmb3IgYW55IGRlZmljaWVuY3kgaW4gc2VydmljZSBieSBBaXJsaW5lIG9yIFNlcnZpY2UgcHJvdmlkZXJzLlwiXX1dfV0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnByaW50XCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNjcmlwdFwiLFwiYVwiOntcInR5cGVcIjpcInRleHQvamF2YXNjcmlwdFwifSxcImZcIjpbXCJ3aW5kb3cuaXhpVHJhbnNhY3Rpb25UcmFja2VyID0gZnVuY3Rpb24odGFnKSB7XFxyXFxuZnVuY3Rpb24gdXBkYXRlUmVkaXJlY3QodGFnLCB0cmFuc2FjdGlvbklELCBwbnIsIHNhbGVWYWx1ZSwgc2VnbWVudE5pZ2h0cykge1xcclxcbnJldHVybiBcXFwiPGltZyBzdHlsZT0ndG9wOi05OTk5OTlweDtsZWZ0Oi05OTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZScgc3JjPSdodHRwczovL3d3dy5peGlnby5jb20vaXhpLWFwaS90cmFja2VyL3VwZGF0ZUNvbnZlcnNpb24vXFxcIiArIHRhZyArIFxcXCI/dHJhbnNhY3Rpb25JZD1cXFwiICsgdHJhbnNhY3Rpb25JRCArIFxcXCImcG5yPVxcXCIgKyBwbnIgKyBcXFwiJnNhbGVWYWx1ZT1cXFwiICsgc2FsZVZhbHVlICsgXFxcIiZzZWdtZW50TmlnaHRzPVxcXCIgKyBzZWdtZW50TmlnaHRzICsgXFxcIicgLz5cXFwiO1xcclxcbn1cXHJcXG5kb2N1bWVudC5ib2R5LmlubmVySFRNTCArPSB1cGRhdGVSZWRpcmVjdCh0YWcsIFxcXCJcIix7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLmlkXCJ9LFwiXFxcIiwgXFxcIlwiLHtcInRcIjoyLFwiclwiOlwibXlib29raW5ncy5jdXJyZW50Q2FydERldGFpbHMuYm9va2luZ3MuMC50cmF2ZWxsZXIuMC5haXJsaW5lX3BuclwifSxcIlxcXCIsIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJjb252ZXJ0SXhpZ29cIixcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzLnRvdGFsQW1vdW50XCJdLFwic1wiOlwiXzAoXzEpXCJ9fSxcIiwgXCIse1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5zZWdOaWdodHNcIn0sXCIgKTtcXHJcXG59O1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzY3JpcHRcIixcImFcIjp7XCJzcmNcIjpcImh0dHBzOi8vd3d3Lml4aWdvLmNvbS9peGktYXBpL3RyYWNrZXIvdHJhY2sxOTZcIixcImlkXCI6XCJ0cmFja2VyXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MuY2xpZW50U291cmNlSWRcIl0sXCJzXCI6XCJfMD09NFwifX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLnByaW50XCJdLFwic1wiOlwiIV8wXCJ9fV19XSxcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzXCJ9XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9teWJvb2tpbmdzL2RldGFpbHMuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDE2MlxuICoqIG1vZHVsZSBjaHVua3MgPSAyIDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgIE15Ym9va2luZ3MgPSByZXF1aXJlKCdjb21wb25lbnRzL215Ym9va2luZ3MvbXlib29raW5ncycpO1xyXG5yZXF1aXJlKCdtb2JpbGUvbXlib29raW5ncy5sZXNzJyk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICAgKG5ldyBNeWJvb2tpbmdzKCkpLnJlbmRlcignI2FwcCcpO1xyXG59KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vanMvYXBwL21vYmlsZS9teWJvb2tpbmdzLmpzXG4gKiogbW9kdWxlIGlkID0gMTczXG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxyXG4gICAgICAgIEF1dGggPSByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9hdXRoJyksXHJcbiAgICAgICAgTXlib29raW5nRGF0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL215Ym9va2luZ3MnKSxcclxuICAgICAgICBNZXRhID0gcmVxdWlyZSgnc3RvcmVzL215Ym9va2luZ3MvbWV0YScpXHJcbi8vICAgICxcclxuLy8gICAgVXNlciA9IHJlcXVpcmUoJ3N0b3Jlcy91c2VyL3VzZXInKVxyXG4gICAgICAgIDtcclxuXHJcbi8vcmVxdWlyZSgnbW9kdWxlcy9teWJvb2tpbmdzL215Ym9va2luZ3MubGVzcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGb3JtLmV4dGVuZCh7XHJcbiAgICBpc29sYXRlZDogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmh0bWwnKSxcclxuICAgIGNvbXBvbmVudHM6IHtcclxuICAgICAgICAnbGF5b3V0JzogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvbGF5b3V0JyksXHJcbiAgICAgICAgc3VtbWFyeTogcmVxdWlyZSgnY29tcG9uZW50cy9teWJvb2tpbmdzL3N1bW1hcnknKSxcclxuICAgICAgICBkZXRhaWxzOiByZXF1aXJlKCdjb21wb25lbnRzL215Ym9va2luZ3MvZGV0YWlscycpLFxyXG4gICAgICAgIGFtZW5kbWVudDogcmVxdWlyZSgnY29tcG9uZW50cy9teWJvb2tpbmdzL2FtZW5kbWVudCcpLFxyXG4gICAgICAvLyAgbGVmdHBhbmVsOiByZXF1aXJlKCdjb21wb25lbnRzL2xheW91dHMvcHJvZmlsZV9zaWRlYmFyJylcclxuICAgICAgICAgICAgICAgIC8vIHRyYXZlbGxlcmxpc3Q6IHJlcXVpcmUoJy4vbGlzdCcpLFxyXG4gICAgICAgICAgICAgICAgLy8gIHByb2ZpbGVzaWRlYmFyOiByZXF1aXJlKCcuLi9sYXlvdXRzL3Byb2ZpbGVfc2lkZWJhcicpXHJcbiAgICB9LFxyXG4gICAgcGFydGlhbHM6IHtcclxuICAgICAgICAnYmFzZS1wYW5lbCc6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvbGF5b3V0L3BhbmVsLmh0bWwnKVxyXG4gICAgfSxcclxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIkluc2lkZSBvbmNvbmZpZ1wiKTtcclxuICAgICAgICB2YXIgaWRkID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJ215Ym9va2luZ3MvJylbMV07XHJcbiAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnByaW50JywgZmFsc2UpO1xyXG4gICAgICAgIHZhciBpZD1udWxsO1xyXG4gICAgICAgIHZhciB1cmxpZD1udWxsO1xyXG4gICAgICAgIGlmKGlkZCl7XHJcbiAgICAgICAgICAgIHVybGlkPWlkZC5zcGxpdCgnIycpO1xyXG4gICAgICAgICAgICBpZD11cmxpZFswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBtbT1NZXRhLmluc3RhbmNlKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobWV0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnbWV0YScsIG1ldGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnN1bW1hcnknLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzLnBlbmRpbmcnLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MuY3VycmVudENhcnRJZCcsIGlkKTtcclxuICAgICAgICAgICAgaWYodXJsaWRbMV09PSdwcmludCcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MucHJpbnQnLCB0cnVlKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdoZWFkZXInKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcsJzBweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmNvbnRlbnQnKS5jc3MoJ3BhZGRpbmcnLCcwcHgnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBNeWJvb2tpbmdEYXRhLmdldEN1cnJlbnRDYXJ0KGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdteWJvb2tpbmdzJywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdwZW5kaW5nJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih1cmxpZFsxXT09J3ByaW50Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wcmludCcsIHRydWUpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2hlYWRlcicpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoJ3BhZGRpbmctdG9wJywnMHB4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuY29udGVudCcpLmNzcygncGFkZGluZycsJzBweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnByaW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpOyBcclxuICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHVybGlkWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5hbWVuZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3Muc3VtbWFyeScsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnbXlib29raW5ncy5wZW5kaW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIE1ldGEuaW5zdGFuY2UoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChtZXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgTXlib29raW5nRGF0YS5mZXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoJ215Ym9va2luZ3MnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcy5zZXQoJ3VzZXInLCBVc2VyKTtcclxuICAgICAgICB3aW5kb3cudmlldyA9IHRoaXM7XHJcbiAgICB9LFxyXG4gICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxlZnRtZW51OiBmYWxzZSxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbGVmdE1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZmxhZyA9IHRoaXMuZ2V0KCdsZWZ0bWVudScpO1xyXG4gICAgICAgIHRoaXMuc2V0KCdsZWZ0bWVudScsICFmbGFnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2lnbmluOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIEF1dGgubG9naW4oKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MvJyArIHZpZXcuZ2V0KCdteWJvb2tpbmdzLmN1cnJlbnRDYXJ0RGV0YWlscy5pZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9LCAgXHJcbiAgICBzaWdudXA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIEF1dGguc2lnbnVwKCk7XHJcbiAgICB9LFxyXG4gICAgb25jb21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgXHJcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215Ym9va2luZ3MnLCBmdW5jdGlvbih2YWx1ZSkge1xyXG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibXlib29raW5ncyBjaGFuZ2VkIFwiKTtcclxuLy8gICAgICAgICAgICBcclxuLy8gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcicsIHZhbHVlKTtcclxuLy8gICAgICAgIH0sIHtpbml0OiBmYWxzZX0pO1xyXG5cclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2NvbXBvbmVudHMvbXlib29raW5ncy9teWJvb2tpbmdzLmpzXG4gKiogbW9kdWxlIGlkID0gMTc0XG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJsYXlvdXRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV0sXCJteWJvb2tpbmdzXCI6W3tcInRcIjoyLFwiclwiOlwibXlib29raW5nc1wifV19LFwiZlwiOltcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhbWVuZG1lbnRcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudCBjZW50ZXJlZCBcIixcIm15Ym9va2luZ3NcIjpbe1widFwiOjIsXCJyXCI6XCJteWJvb2tpbmdzXCJ9XSxcIm1ldGFcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhXCJ9XX19XSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MuYW1lbmRcIn0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInN1bW1hcnlcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudCBjZW50ZXJlZFwiLFwibXlib29raW5nc1wiOlt7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3NcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5zdW1tYXJ5XCJ9LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRldGFpbHNcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudCBjZW50ZXJlZFwiLFwibXlib29raW5nc1wiOlt7XCJ0XCI6MixcInJcIjpcIm15Ym9va2luZ3NcIn1dLFwibWV0YVwiOlt7XCJ0XCI6MixcInJcIjpcIm1ldGFcIn1dfX1dLFwiclwiOlwibXlib29raW5ncy5zdW1tYXJ5XCJ9XSxcInJcIjpcIm15Ym9va2luZ3MuYW1lbmRcIn0sXCIgXCJdLFwicFwiOntcInBhbmVsXCI6W3tcInRcIjo4LFwiclwiOlwiYmFzZS1wYW5lbFwifV19fV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAxNzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gM1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBGb3JtID0gcmVxdWlyZSgnY29yZS9mb3JtJyksXHJcbiAgICAgICAgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JyksXHJcbiAgICAgICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpLFxyXG4gICAgICAgIGFjY291bnRpbmcgPSByZXF1aXJlKCdhY2NvdW50aW5nLmpzJyk7XHJcbi8vLFxyXG4vL015dHJhdmVsbGVyID0gcmVxdWlyZSgnYXBwL3N0b3Jlcy9teXRyYXZlbGxlci9teXRyYXZlbGxlcicpICAgO1xyXG47XHJcblxyXG5cclxudmFyIHQybSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcclxuXHJcbiAgICByZXR1cm4gaVswXSAqIDYwICsgaVsxXTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215Ym9va2luZ3Mvc3VtbWFyeS5odG1sJyksXHJcbiAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdWVtYWlsOm51bGwsXHJcbiAgICAgICAgICAgIGNpZDpudWxsLFxyXG4gICAgICAgICAgICBmb3JtYXRCaXJ0aERhdGU6IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobW9tZW50LmlzTW9tZW50KGRhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5nZXQoJ215dHJhdmVsbGVyJykuc2V0KCdjdXJyZW50VHJhdmVsbGVyLmJpcnRoZGF0ZScsIGRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdFRpdGxlOiBmdW5jdGlvbiAodGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aXRsZXMgPSB0aGlzLmdldCgnbWV0YScpLmdldCgndGl0bGVzJyk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRpdGxlcyk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiB0aXRsZX0pLCAnbmFtZScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXROYW1lOiBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0cmluZyA9IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAgc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlLCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZm9ybWF0KCdsbCcpOy8vZm9ybWF0KCdNTU0gREQgWVlZWScpOyAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlLCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZm9ybWF0KCdsbCcpOy8vZm9ybWF0KCdNTU0gREQgWVlZWScpOyAgICAgICAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzczogZnVuY3Rpb24gKGJzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnMgPT0gMSB8fCBicyA9PSAyIHx8IGJzID09IDMgfHwgYnMgPT0gNylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJwcm9ncmVzc1wiO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnMgPT0gNCB8fCBicyA9PSA1IHx8IGJzID09IDYgfHwgYnMgPT0gMTIpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY2FuY2VsbGVkXCI7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChicyA9PSA4IHx8IGJzID09IDkgfHwgYnMgPT0gMTAgfHwgYnMgPT0gMTEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiYm9va2VkXCI7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzTWVzc2FnZTogZnVuY3Rpb24gKGJzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ2Jvb2tpbmdTdGF0dXMnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAgXy5yZXN1bHQoXy5maW5kKHRpdGxlcywgeydpZCc6IGJzfSksICduYW1lJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1vbmV5OiBmdW5jdGlvbiAoYW1vdW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICcnLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgb25pbml0OiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuLy8gICAgICAgICQodGhpcy5maW5kKCcuYWN0aW9uIGEnKSkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdpbnNpZGUgY2xsaWNrJyk7XHJcbi8vICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuLy8gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbi8vICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uKCdjbG9zZW1lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICQoJy51aS5wb3NpdGl2ZS5tZXNzYWdlJykuZmFkZU91dCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMub24oJ3RvZ2dsZWVtYWlsJywgZnVuY3Rpb24gKGUsIGlkLGVtYWlsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCd1ZW1haWwnLCBlbWFpbCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdjaWQnLCBpZCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMub24oJ2dldGRldGFpbCcsIGZ1bmN0aW9uIChldmVudCwgaWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdjdXJyZW50Q2FydElkJywgaWQpO1xyXG4gICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgncGVuZGluZycsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2FpckNhcnQvZ2V0Q2FydERldGFpbHMvJyArIF8ucGFyc2VJbnQoaWQpLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHsnZGF0YSc6ICcnfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCwgdXBjb21pbmc6IGRhdGEudXBjb21pbmcsIGNyZWF0ZWQ6IGRhdGEuY3JlYXRlZCwgdG90YWxBbW91bnQ6IGRhdGEudG90YWxBbW91bnQsIGJvb2tpbmdfc3RhdHVzOiBkYXRhLmJvb2tpbmdfc3RhdHVzLCBib29raW5nX3N0YXR1c21zZzogZGF0YS5ib29raW5nX3N0YXR1c21zZywgcmV0dXJuZGF0ZTogZGF0YS5yZXR1cm5kYXRlLCBpc011bHRpQ2l0eTogZGF0YS5pc011bHRpQ2l0eSwgY3VyZW5jeTogZGF0YS5jdXJlbmN5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3A6ZGF0YS5mb3AsYmFzZXByaWNlOmRhdGEuYmFzZXByaWNlLHRheGVzOmRhdGEudGF4ZXMsZmVlOmRhdGEuZmVlLHRvdGFsQW1vdW50aW53b3JkczpkYXRhLnRvdGFsQW1vdW50aW53b3JkcyxjdXN0b21lcmNhcmU6ZGF0YS5jdXN0b21lcmNhcmUsdGlja2V0c3RhdHVzbXNnOmRhdGEudGlja2V0c3RhdHVzbXNnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nczogXy5tYXAoZGF0YS5ib29raW5ncywgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aWQ6IGkuaWQsIHVwY29taW5nOiBpLnVwY29taW5nLCBzb3VyY2VfaWQ6IGkuc291cmNlX2lkLCBkZXN0aW5hdGlvbl9pZDogaS5kZXN0aW5hdGlvbl9pZCwgc291cmNlOiBpLnNvdXJjZSwgZmxpZ2h0dGltZTogaS5mbGlnaHR0aW1lLCBkZXN0aW5hdGlvbjogaS5kZXN0aW5hdGlvbiwgZGVwYXJ0dXJlOiBpLmRlcGFydHVyZSwgYXJyaXZhbDogaS5hcnJpdmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlbGxlcjogXy5tYXAoaS50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdC5pZCwgYm9va2luZ2lkOiB0LmJvb2tpbmdpZCwgZmFyZXR5cGU6IHQuZmFyZXR5cGUsIHRpdGxlOiB0LnRpdGxlLCB0eXBlOiB0LnR5cGUsIGZpcnN0X25hbWU6IHQuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiB0Lmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFpcmxpbmVfcG5yOiB0LmFpcmxpbmVfcG5yLCBjcnNfcG5yOiB0LmNyc19wbnIsIHRpY2tldDogdC50aWNrZXQsIGJvb2tpbmdfY2xhc3M6IHQuYm9va2luZ19jbGFzcywgY2FiaW46IHQuY2FiaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNpY2ZhcmU6IHQuYmFzaWNmYXJlLCB0YXhlczogdC50YXhlcywgdG90YWw6IHQudG90YWwsIHN0YXR1czogdC5zdGF0dXMsIHN0YXR1c21zZzogdC5zdGF0dXNtc2csIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlczogXy5tYXAodC5yb3V0ZXMsIGZ1bmN0aW9uIChybykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByby5pZCwgb3JpZ2luOiByby5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHJvLm9yaWdpbkRldGFpbHMsIGRlc3RpbmF0aW9uRGV0YWlsczogcm8uZGVzdGluYXRpb25EZXRhaWxzLCBkZXN0aW5hdGlvbjogcm8uZGVzdGluYXRpb24sIGRlcGFydHVyZTogcm8uZGVwYXJ0dXJlLCBhcnJpdmFsOiByby5hcnJpdmFsLCBjYXJyaWVyOiByby5jYXJyaWVyLCBjYXJyaWVyTmFtZTogcm8uY2Fycmllck5hbWUsIGZsaWdodE51bWJlcjogcm8uZmxpZ2h0TnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHR0aW1lOiByby5mbGlnaHR0aW1lLCBvcmlnaW5UZXJtaW5hbDogcm8ub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHJvLmRlc3RpbmF0aW9uVGVybWluYWwsIG1lYWw6IHJvLm1lYWwsIHNlYXQ6IHJvLnNlYXQsIGFpcmNyYWZ0OiByby5haXJjcmFmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IF8ubWFwKGkucm91dGVzLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHQuaWQsIG9yaWdpbjogdC5vcmlnaW4sIG9yaWdpbkRldGFpbHM6IHQub3JpZ2luRGV0YWlscywgZGVzdGluYXRpb25EZXRhaWxzOiB0LmRlc3RpbmF0aW9uRGV0YWlscywgZGVzdGluYXRpb246IHQuZGVzdGluYXRpb24sIGRlcGFydHVyZTogdC5kZXBhcnR1cmUsIGFycml2YWw6IHQuYXJyaXZhbCwgY2FycmllcjogdC5jYXJyaWVyLCBjYXJyaWVyTmFtZTogdC5jYXJyaWVyTmFtZSwgZmxpZ2h0TnVtYmVyOiB0LmZsaWdodE51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodHRpbWU6IHQuZmxpZ2h0dGltZSwgb3JpZ2luVGVybWluYWw6IHQub3JpZ2luVGVybWluYWwsIGRlc3RpbmF0aW9uVGVybWluYWw6IHQuZGVzdGluYXRpb25UZXJtaW5hbCwgbWVhbDogdC5tZWFsLCBzZWF0OiB0LnNlYXQsIGFpcmNyYWZ0OiB0LmFpcmNyYWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKHguZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKHkuZGVwYXJ0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSwgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdjdXJyZW50Q2FydERldGFpbHMnLCBkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgnc3VtbWFyeScsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldCgnbXlib29raW5ncycpLnNldCgncGVuZGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG4gICAgc3VibWl0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2V0KCdzdWJtaXR0aW5nJywgdHJ1ZSk7XHJcbiAgICAgICAgJCgnLm1lc3NhZ2UnKS5mYWRlSW4oKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9iMmMvYWlyQ2FydC9zZW5kRW1haWwvJyArIHRoaXMuZ2V0KCdjaWQnKSxcclxuICAgICAgICAgICAgZGF0YToge2VtYWlsOiB0aGlzLmdldCgndWVtYWlsJyksIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQodmlldy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmlldy5kZWZlcnJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgcmVzcG9uc2UuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9yTXNnJywgJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKE1PQklMRSkge1xyXG4gICAgICAgICAgICB2YXIgb3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcih7IG9uSGlkZGVuOiBmdW5jdGlvbigpIHsgJCgnI21fYnRuJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7ICB9LCBvblNob3c6IGZ1bmN0aW9uKCkgeyAkKCcjbV9idG4nKS5hZGRDbGFzcygnZGlzYWJsZWQnKTsgIH19KTtcclxuICAgICAgICAgICAgJCgnLmRyb3Bkb3duJykuZHJvcGRvd24oKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNtX2J0bicsIHRoaXMuZWwpLm9uKCdjbGljay5sYXlvdXQnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjbV9tZW51Jykuc2lkZWJhcignc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcucHVzaGVyJykub25lKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ3VlbWFpbCcsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbi8vICAgICAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xyXG4vLyAgICAgICAgICAgICB0aGlzLnNldCgndWVtYWlsJywgdmFsdWUpO1xyXG4vLyAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbi8vICAgICAgICB0aGlzLm9ic2VydmUoJ215dHJhdmVsbGVyLmN1cnJlbnRUcmF2ZWxsZXJJZCcsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbi8vICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImN1cnJlbnRUcmF2ZWxsZXJJZCBjaGFuZ2VkIFwiKTtcclxuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHZhbHVlKTtcclxuLy8gICAgICAgICAgICAvL3RoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlcklkJywgdmFsdWUpO1xyXG4vLyAgICAgICAgfSwge2luaXQ6IGZhbHNlfSk7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3Mvc3VtbWFyeS5qc1xuICoqIG1vZHVsZSBpZCA9IDE3NlxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwibW9kdWxlLmV4cG9ydHM9e1widlwiOjMsXCJ0XCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIm15Ym9va2luZ3NjbGFzc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoZWFkZXJcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgdGhyZWUgY29sdW1uIGdyaWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbHVtblwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaWRcIjpcIm1fYnRuXCIsXCJjbGFzc1wiOlwibWFpbl9tbnVcIixcImhyZWZcIjpcIiNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL2JhcnMucG5nXCIsXCJhbHRcIjpcIm1lbnVcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb2x1bW5cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJsb2dvXCIsXCJocmVmXCI6XCJqYXZhc2NyaXB0OjtcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW1nXCIsXCJhXCI6e1wic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL2xvZ28ucG5nXCIsXCJhbHRcIjpcIkNoZWFwVGlja2V0LmluXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29sdW1uIHJpZ2h0IGFsaWduZWRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImlkXCI6XCJyaWdodF9tZW51XCIsXCJjbGFzc1wiOlwicHJvZmlsZVwiLFwiaHJlZlwiOlwiamF2YXNjcmlwdDo7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcInNyY1wiOlwiL3RoZW1lcy9CMkMvaW1nL21vYmlsZS9wcm9maWxlLnBuZ1wiLFwiYWx0XCI6XCJQcm9maWxlXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJtX21lbnVcIixcImNsYXNzXCI6XCJ1aSBsZWZ0IHZlcnRpY2FsIHNpZGViYXIgbWVudSBwdXNoIHNjYWxlIGRvd24gb3ZlcmxheVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYXZhdFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbWdcIixcImFcIjp7XCJpZFwiOlwiYXZhdGFyXCIsXCJjbGFzc1wiOlwidWkgYXZhdGFyIGxpaXRsZSBpbWFnZVwiLFwic3JjXCI6XCIvdGhlbWVzL0IyQy9pbWcvbW9iaWxlL2F2YXQucG5nXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJkZXNjcmlwdGlvblwifSxcImZcIjpbXCJXRUxDT01FIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaDFcIixcImFcIjp7XCJpZFwiOlwibmFtZVwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJtZXRhLnVzZXIubmFtZVwifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibWV0YS51c2VyXCJdLFwic1wiOlwiXzAhPW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImgxXCIsXCJhXCI6e1wiaWRcIjpcIm5hbWVcIn0sXCJmXCI6W1wiR3Vlc3QgVXNlclwiXX1dLFwieFwiOntcInJcIjpbXCJtZXRhLnVzZXJcIl0sXCJzXCI6XCJfMCE9bnVsbFwifX1dfV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBibHVlIGZsdWlkIGJ1dHRvblwiLFwiaHJlZlwiOlwiL3NpdGUvbG9nb3V0XCJ9LFwiZlwiOltcIkxvZ291dFwiXX1dLFwiblwiOjUwLFwiclwiOlwibWV0YS51c2VyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwcm9mXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvbXlwcm9maWxlL1wifSxcImZcIjpbXCJNeSBQcm9maWxlXCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIvYjJjL21vYmlsZS9teWJvb2tpbmdzL1wifSxcImZcIjpbXCJNeSBCb29raW5nc1wiXX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0cmF2XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvbXl0cmF2ZWxsZXIvXCJ9LFwiZlwiOltcIlRyYXZlbGxlcnNcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJpZFwiOlwiZGV2aWRlclwiLFwiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W1wiUVVJQ0sgVE9PTFNcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJpdGVtXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmludFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvbW9iaWxlL2d1ZXN0Ym9va2luZ1wifSxcImZcIjpbXCJQcmludCAvIFZpZXcgVGlja2V0XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNhbmNlbFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIi9iMmMvbW9iaWxlL2d1ZXN0Ym9va2luZ1wifSxcImZcIjpbXCJDYW5jZWxhdGlvbnNcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY2hhbmdlXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOlwiL2IyYy9tb2JpbGUvZ3Vlc3Rib29raW5nXCJ9LFwiZlwiOltcIkNoYW5nZSAvIFJlc2NoZWR1bGVcIl19XX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcImJveCByZXNjaGVkdWxlIFwiLHtcInRcIjo0LFwiZlwiOltcInVpIHNlZ21lbnQgbG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwb3NpdGl2ZSAgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6IG5vbmVcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9LFwidlwiOntcImNsaWNrXCI6XCJjbG9zZW1lc3NhZ2VcIn19LFwiIEVtYWlsIFNlbnRcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIG1vZGFsIHNtYWxsIG1haWx0aWNrZXRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaVwiLFwiYVwiOntcImNsYXNzXCI6XCJjbG9zZSBpY29uXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoZWFkZXJcIn0sXCJmXCI6W1wiRW1haWwgVGlja2V0XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBiYXNpYyBzZWdtZW50XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJjbGFzc1wiOltcInVpIGZvcm0gXCIse1widFwiOjQsXCJmXCI6W1wibG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcIi4vc3VibWl0dGluZ1wifV0sXCJhY3Rpb25cIjpcImphdmFzY3JpcHQ6O1wifSxcInZcIjp7XCJzdWJtaXRcIjp7XCJtXCI6XCJzdWJtaXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmaWVsZFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBpbnB1dCBzbWFsbFwiLFwidHlwZVwiOlwidGV4dFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCIuL3VlbWFpbFwifV19fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgaW5wdXQgc21hbGxcIixcInR5cGVcIjpcImhpZGRlblwiLFwiaWRcIjpcImNpZFwiLFwidmFsdWVcIjpbe1widFwiOjIsXCJyXCI6XCIuL2NpZFwifV19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25zXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcInR5cGVcIjpcInN1Ym1pdFwiLFwiY2xhc3NcIjpcInVpIHNtYWxsIGJ1dHRvbiBmbHVpZCB5ZWxsb3dcIn0sXCJmXCI6W1wiU2VuZFwiXX1dfV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImgzXCIsXCJmXCI6W1wiTXkgQm9va2luZ3NcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiaDRcIixcImZcIjpbXCJVcGNvbWluZyBUcmlwc1wiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZ3JvdXAgXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbXCJObyBUcmlwcyBGb3VuZCAhIVwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLmNhcnRzLmxlbmd0aFwiXSxcInNcIjpcIl8wPT0wXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGVycm9yIG1lc3NhZ2VcIn0sXCJmXCI6W1wiTm8gVHJpcHMgRm91bmQgISFcIl19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wibXlib29raW5ncy5mbGdVcGNvbWluZ1wiXSxcInNcIjpcIiFfMFwifX1dLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLmNhcnRzLmxlbmd0aFwiXSxcInNcIjpcIl8wPT0wXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJpdGVtIHN0YWNrYWJsZSBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ1N0YXR1c0NsYXNzXCIsXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcImdldGRldGFpbFwiLFwiZFwiOlt7XCJ0XCI6MixcInJcIjpcImlkXCJ9XX19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLjAuc3JjLjAubmFtZVwifSx7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidG9cIn0sXCJmXCI6W1wiwqBcIl19LHtcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuMC5kZXN0LjAubmFtZVwifV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wicmV0dXJuZGF0ZVwiXSxcInNcIjpcIl8wPT1udWxsXCJ9fSx7XCJ0XCI6NCxcIm5cIjo1MSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRpcmVjdGlvblwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci4wLnNyYy4wLm5hbWVcIn0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhY2tcIn0sXCJmXCI6W1wiwqBcIl19LHtcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuMC5kZXN0LjAubmFtZVwifV19XSxcInhcIjp7XCJyXCI6W1wicmV0dXJuZGF0ZVwiXSxcInNcIjpcIl8wPT1udWxsXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJuYW1lXCJ9LFwiwqAgfCDCoFwiXSxcImlcIjpcImlcIixcInJcIjpcInRyYXZlbGVyLjAuc3JjXCJ9LFwiIFwiLHtcInRcIjoyLFwicnhcIjp7XCJyXCI6XCJ0cmF2ZWxlci4wLmRlc3RcIixcIm1cIjpbe1wiclwiOltcInRyYXZlbGVyLjAuZGVzdC5sZW5ndGhcIl0sXCJzXCI6XCJfMC0xXCJ9LFwibmFtZVwiXX19XX1dLFwieFwiOntcInJcIjpbXCJpc011bHRpQ2l0eVwiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGF0ZVwifSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImJvb2tpbmdzLjAuZGVwYXJ0dXJlXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiYWN0aW9uXCJ9LFwiZlwiOltcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJjbGFzc1wiOlwiZW1haWxcIixcInRpdGxlXCI6XCJFbWFpbFwifSxcInZcIjp7XCJjbGlja1wiOntcIm5cIjpcInRvZ2dsZWVtYWlsXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn0sXCIsXCIse1widFwiOjIsXCJyXCI6XCJlbWFpbFwifV19fX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJhXCIsXCJhXCI6e1wiaHJlZlwiOltcIi9iMmMvYWlyQ2FydC9hc1BERi9cIix7XCJ0XCI6MixcInJcIjpcImlkXCJ9XSxcInRhcmdldFwiOlwiX2JsYW5rXCIsXCJjbGFzc1wiOlwicGRmXCIsXCJ0aXRsZVwiOlwiRG93bmxvYWQgUERGXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWlkXCJ9LFwiZlwiOltcIkJvb2tpbmcgSWQ6IFwiLHtcInRcIjoyLFwiclwiOlwiaWRcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYm9va2luZy1kYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ0RhdGVcIixcImNyZWF0ZWRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImhyXCJ9LFwiZlwiOltcIsKgXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0YWJsZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRyYXZlbGxlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIjXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0TmFtZVwiLFwiaVwiLFwidHJhdmVsZXJcIl0sXCJzXCI6XCJfMChfMltfMV0ubmFtZSlcIn19XX0sXCIgwqBcIl0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlcIixcInRyYXZlbGVyLmxlbmd0aFwiXSxcInNcIjpcIl8wPT0oXzEtMSlcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6XCIjXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0TmFtZVwiLFwiaVwiLFwidHJhdmVsZXJcIl0sXCJzXCI6XCJfMChfMltfMV0ubmFtZSlcIn19XX0sXCIgwqB8wqBcIl0sXCJ4XCI6e1wiclwiOltcImlcIixcInRyYXZlbGVyLmxlbmd0aFwiXSxcInNcIjpcIl8wPT0oXzEtMSlcIn19XSxcImlcIjpcImlcIixcInJcIjpcInRyYXZlbGVyXCJ9LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJzdGF0dXMgYm9va2VkXCJ9LFwiZlwiOltcIkRldGFpbHNcIl19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicHJpY2VcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJjdXJyXCJ9LFwiZlwiOlt7XCJ0XCI6MyxcInJcIjpcImN1cmVuY3lcIn1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wibW9uZXlcIixcInRvdGFsQW1vdW50XCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6W1wic3RhdHVzIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3NcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ1N0YXR1c01lc3NhZ2VcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19XX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1widXBjb21pbmdcIl0sXCJzXCI6XCJfMD09XFxcInRydWVcXFwiXCJ9fV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJteWJvb2tpbmdzLmNhcnRzXCJ9XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJoNFwiLFwiZlwiOltcIlByZXZpb3VzIFRyaXBzXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJncm91cCBcIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBlcnJvciBtZXNzYWdlXCJ9LFwiZlwiOltcIk5vIFRyaXBzIEZvdW5kICEhXCJdfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MuY2FydHMubGVuZ3RoXCJdLFwic1wiOlwiXzA9PTBcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwifSxcImZcIjpbXCJObyBUcmlwcyBGb3VuZCAhIVwiXX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJteWJvb2tpbmdzLmZsZ1ByZXZpb3VzXCJdLFwic1wiOlwiIV8wXCJ9fV0sXCJ4XCI6e1wiclwiOltcIm15Ym9va2luZ3MuY2FydHMubGVuZ3RoXCJdLFwic1wiOlwiXzA9PTBcIn19LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOltcIml0ZW0gcHJldmlvdXMgc3RhY2thYmxlIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3NcIixcImJvb2tpbmdfc3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwidlwiOntcImNsaWNrXCI6e1wiblwiOlwiZ2V0ZGV0YWlsXCIsXCJkXCI6W3tcInRcIjoyLFwiclwiOlwiaWRcIn1dfX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwidHJhdmVsZXIuMC5zcmMuMC5uYW1lXCJ9LHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJ0b1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci4wLmRlc3QuMC5uYW1lXCJ9XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcInRyYXZlbGVyLjAuc3JjLjAubmFtZVwifSx7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYmFja1wifSxcImZcIjpbXCLCoFwiXX0se1widFwiOjIsXCJyXCI6XCJ0cmF2ZWxlci4wLmRlc3QuMC5uYW1lXCJ9XX1dLFwieFwiOntcInJcIjpbXCJyZXR1cm5kYXRlXCJdLFwic1wiOlwiXzA9PW51bGxcIn19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaXNNdWx0aUNpdHlcIl0sXCJzXCI6XCJfMD09XFxcImZhbHNlXFxcIlwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjo0LFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcIm5hbWVcIn0sXCLCoCB8IMKgXCJdLFwiaVwiOlwiaVwiLFwiclwiOlwidHJhdmVsZXIuMC5zcmNcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcInRyYXZlbGVyLjAuZGVzdFwiLFwibVwiOlt7XCJyXCI6W1widHJhdmVsZXIuMC5kZXN0Lmxlbmd0aFwiXSxcInNcIjpcIl8wLTFcIn0sXCJuYW1lXCJdfX1dfV0sXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkYXRlXCJ9LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZVwiLFwiYm9va2luZ3MuMC5kZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJhY3Rpb25cIn0sXCJmXCI6W1wiIFwiLHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImNsYXNzXCI6XCJlbWFpbFwiLFwidGl0bGVcIjpcIkVtYWlsXCJ9LFwidlwiOntcImNsaWNrXCI6e1wiblwiOlwidG9nZ2xlZW1haWxcIixcImRcIjpbe1widFwiOjIsXCJyXCI6XCJpZFwifSxcIixcIix7XCJ0XCI6MixcInJcIjpcImVtYWlsXCJ9XX19fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImFcIixcImFcIjp7XCJocmVmXCI6W1wiL2IyYy9haXJDYXJ0L2FzUERGL1wiLHtcInRcIjoyLFwiclwiOlwiaWRcIn1dLFwidGFyZ2V0XCI6XCJfYmxhbmtcIixcImNsYXNzXCI6XCJwZGZcIixcInRpdGxlXCI6XCJEb3dubG9hZCBQREZcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tpbmctaWRcIn0sXCJmXCI6W1wiQm9va2luZyBJZDogXCIse1widFwiOjIsXCJyXCI6XCJpZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nRGF0ZVwiLFwiY3JlYXRlZFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaHJcIn0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwidHJhdmVsbGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiNcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXROYW1lXCIsXCJpXCIsXCJ0cmF2ZWxlclwiXSxcInNcIjpcIl8wKF8yW18xXS5uYW1lKVwifX1dfSxcIiDCoFwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiaVwiLFwidHJhdmVsZXIubGVuZ3RoXCJdLFwic1wiOlwiXzA9PShfMS0xKVwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImhyZWZcIjpcIiNcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXROYW1lXCIsXCJpXCIsXCJ0cmF2ZWxlclwiXSxcInNcIjpcIl8wKF8yW18xXS5uYW1lKVwifX1dfSxcIiDCoHzCoFwiXSxcInhcIjp7XCJyXCI6W1wiaVwiLFwidHJhdmVsZXIubGVuZ3RoXCJdLFwic1wiOlwiXzA9PShfMS0xKVwifX1dLFwiaVwiOlwiaVwiLFwiclwiOlwidHJhdmVsZXJcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJwcmljZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImN1cnJcIn0sXCJmXCI6W3tcInRcIjozLFwiclwiOlwiY3VyZW5jeVwifV19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJtb25leVwiLFwidG90YWxBbW91bnRcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJzdGF0dXMgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nU3RhdHVzTWVzc2FnZVwiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX1dfV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJ1cGNvbWluZ1wiXSxcInNcIjpcIl8wPT1cXFwiZmFsc2VcXFwiXCJ9fV0sXCJuXCI6NTIsXCJpXCI6XCJpXCIsXCJyXCI6XCJteWJvb2tpbmdzLmNhcnRzXCJ9XX1dfV19XX07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2FwcC9tb2JpbGUvbW9kdWxlL3RlbXBsYXRlcy9teWJvb2tpbmdzL3N1bW1hcnkuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDE3N1xuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKSxcclxuICAgICAgICBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJyksXHJcbiAgICAgICAgUSA9IHJlcXVpcmUoJ3EnKSxcclxuICAgICAgICBhY2NvdW50aW5nID0gcmVxdWlyZSgnYWNjb3VudGluZy5qcycpXHJcbiAgICAgICAgLy9NeXRyYXZlbGxlciA9IHJlcXVpcmUoJ2FwcC9zdG9yZXMvbXl0cmF2ZWxsZXIvbXl0cmF2ZWxsZXInKSAgIDtcclxuICAgICAgICA7XHJcblxyXG5cclxudmFyIHQybSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgICB2YXIgaSA9IHRpbWUuc3BsaXQoJzonKTtcclxuXHJcbiAgICByZXR1cm4gaVswXSAqIDYwICsgaVsxXTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xyXG4gICAgaXNvbGF0ZWQ6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgndGVtcGxhdGVzL215Ym9va2luZ3MvYW1lbmRtZW50Lmh0bWwnKSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZm9ybWF0QmlydGhEYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0KCdteXRyYXZlbGxlcicpLnNldCgnY3VycmVudFRyYXZlbGxlci5iaXJ0aGRhdGUnLCBkYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUaXRsZTogZnVuY3Rpb24gKHRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVzID0gdGhpcy5nZXQoJ21ldGEnKS5nZXQoJ3RpdGxlcycpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aXRsZXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQodGl0bGVzLCB7J2lkJzogdGl0bGV9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0VHJhdmVsRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMjogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIE1NTSBEIFlZWVknKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRUcmF2ZWxEYXRlMzogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnZGRkIEhIOm1tJyk7Ly9mb3JtYXQoJ01NTSBERCBZWVlZJyk7ICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1czogZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAxIHx8IHN0YXR1cyA9PSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29uZmlybSc7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdub3Rjb25maXJtJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhdmVsbGVyQm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gMilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbmZpcm1lZCc7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3QgPSB0aGlzLmdldCgnbWV0YScpLmdldCgnYWJib29raW5nU3RhdHVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICBfLnJlc3VsdChfLmZpbmQoc3QsIHsnaWQnOiBzdGF0dXN9KSwgJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlmZjogZnVuY3Rpb24gKGVuZCwgc3RhcnQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbXMgPSBtb21lbnQoZW5kLCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZGlmZihtb21lbnQoc3RhcnQsIFwiWVlZWS1NTS1ERCBoaDptbTpzc1wiKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG1vbWVudC5kdXJhdGlvbihtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihkLmFzSG91cnMoKSkgKyAnaCAnICsgZC5taW51dGVzKCkgKyAnbSc7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSwgXCJZWVlZLU1NLUREIGhoOm1tOnNzXCIpLmZvcm1hdCgnbGwnKTsvL2Zvcm1hdCgnTU1NIEREIFlZWVknKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmb3JtYXRCb29raW5nU3RhdHVzQ2xhc3M6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJzID09IDEgfHwgYnMgPT0gMiB8fCBicyA9PSAzIHx8IGJzID09IDcpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicHJvZ3Jlc3NcIjtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJzID09IDQgfHwgYnMgPT0gNSB8fCBicyA9PSA2IHx8IGJzID09IDEyKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImNhbmNlbGxlZFwiO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnMgPT0gOCB8fCBicyA9PSA5IHx8IGJzID09IDEwIHx8IGJzID09IDExKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJvb2tlZFwiO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0Qm9va2luZ1N0YXR1c01lc3NhZ2U6IGZ1bmN0aW9uIChicykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpdGxlcyA9IHRoaXMuZ2V0KCdtZXRhJykuZ2V0KCdib29raW5nU3RhdHVzJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIF8ucmVzdWx0KF8uZmluZCh0aXRsZXMsIHsnaWQnOiBic30pLCAnbmFtZScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb252ZXJ0OiBmdW5jdGlvbiAoYW1vdW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjb3VudGluZy5mb3JtYXRNb25leShhbW91bnQsICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgb25pbml0OiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB0aGlzLm9uKCdiYWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdzdW1tYXJ5JywgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbigncHJpbnRkaXYnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgd2luZG93LnByaW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbignYXNQREYnLCBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XHJcbiAgICAgICAgICAgIC8vd2luZG93LmxvY2F0aW9uKCcvYjJjL2FpckNhcnQvYXNQREYvJytpZCk7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi9iMmMvYWlyQ2FydC9hc1BERi9cIiArIGlkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uIChqLCBrKSB7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuZ2V0KCdjdXJyZW50Q2FydERldGFpbHMuYm9va2luZ3NbJyArIGogKyAnXS50cmF2ZWxsZXJbJyArIGsgKyAnXS5zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdjdXJyZW50Q2FydERldGFpbHMuYm9va2luZ3NbJyArIGogKyAnXS50cmF2ZWxsZXJbJyArIGsgKyAnXS5zZWxlY3RlZCcsICF2YWx1ZSk7XHJcblxyXG4gICAgfSxcclxuICAgIGFtZW5kVGlja2V0OiBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgIHZhciBjYXJ0ID0gdGhpcy5nZXQoJ215Ym9va2luZ3MnKS5nZXQoJ2N1cnJlbnRDYXJ0RGV0YWlscycpO1xyXG4gICAgICAgIHZhciBhcnJheU9mSWRzID0gW107XHJcbiAgICAgICAgXy5mb3JFYWNoKGNhcnQuYm9va2luZ3MsIGZ1bmN0aW9uIChiLCBia2V5KSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGIsIGJrZXkpO1xyXG4gICAgICAgICAgICB2YXIgcm91dGVJZCA9IGIucm91dGVzWzBdLmlkO1xyXG4gICAgICAgICAgICBfLmZvckVhY2goYi50cmF2ZWxsZXIsIGZ1bmN0aW9uICh0LCB0a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhuLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHQuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2godC5yb3V0ZXMsIGZ1bmN0aW9uIChyLCBya2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5T2ZJZHMucHVzaCh7YXI6IHIuaWQsIGFiOiB0LmJvb2tpbmdpZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHQuYm9va2luZ2lkKycgICAnK3IuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGFycmF5T2ZJZHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgYWxlcnQoJ05vIHBhc3NlbmdlciBpcyBzZWxlY3RlZCBmb3IgY2FuY2VsbGF0aW9uIScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGFycmF5T2ZJZHMpO1xyXG4gICAgICAgIHZhciBhbWVuZG1lbnRUeXBlcyA9IHRoaXMuZ2V0KCdtZXRhJykuZ2V0KCdhbWVuZG1lbnRUeXBlcycpO1xyXG4gICAgICAgIHZhciB2aWV3ID0gdGhpcy5nZXQoJ215Ym9va2luZ3MnKTtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYW1lbmRtZW50VHlwZXMpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codmlldyk7XHJcbiAgICAgICAgdmFyIGFtZW5kbWVudFR5cGUgPSBudWxsO1xyXG4gICAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICAgICAgYW1lbmRtZW50VHlwZSA9IGFtZW5kbWVudFR5cGVzLkNBTkNFTDtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gMikge1xyXG4gICAgICAgICAgICBhbWVuZG1lbnRUeXBlID0gYW1lbmRtZW50VHlwZXMuUkVTQ0hFRFVMRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhhbWVuZG1lbnRUeXBlKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoYW1lbmRtZW50VHlwZSAhPSBudWxsKVxyXG4gICAgICAgICAgICBpZiAoJCgnI2FtZW5kUmVhc29uJykudmFsKCkubGVuZ3RoIDwgNSkgeyAvLyBUaGUgcmVhc29uIGlzIHRvbyBzaG9ydFxyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1RoZSBhbWVuZG1lbnQgcmVhc29uIGlzIHRvbyBzaG9ydC5cXG5QbGVhc2UgZW50ZXIgdmFsaWQgYW5kIGRldGFpbGVkIGFtZW5kbWVudCByZWFzb24hJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHR5cGUgPT0gMSlcclxuICAgICAgICAgICAgICAgIHZhciB4PXdpbmRvdy5jb25maXJtKFwiQXJlIHlvdSBzdXJlPyBcXG5UaGlzIHdpbGwgQ2FuY2VsIHlvdXIgVGlja2V0IVwiKTtcclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlID09IDIpXHJcbiAgICAgICAgICAgICAgICB2YXIgeD13aW5kb3cuY29uZmlybShcIkFyZSB5b3Ugc3VyZT8gXFxuVGhpcyB3aWxsIFJlc2NoZWR1bGUgeW91ciBUaWNrZXQhXCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHgpe1xyXG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIFEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0LCBwcm9ncmVzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICQucG9zdCgnL2FpckNhcnQvYW1lbmQvJyArIGFtZW5kbWVudFR5cGUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IGFycmF5T2ZJZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbjogJCgnI2FtZW5kUmVhc29uJykudmFsKClcclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdzdWNjZXNzJykge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0gKyAnI2NhcnRBbWVuZG1lbnRzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnd2FpdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb2NhdGlvbi5oYXNoID0gJyNjYXJ0QW1lbmRtZW50cyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVqZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ05vdCBhYmxlIHRvIGNhbmNlbC4gUGxlYXNlIGNvbnRhY3QgQ2hlYXBUaWNrZXQuaW4gc3VwcG9ydCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgJ2pzb24nKTtcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiAgdmlldy5yZWZyZXNoQ3VycmVudENhcnQodmlldyk7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy51aS5tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2FtZW5kJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5pc2hlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvbmNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLnVpLmNoZWNrYm94JykuY2hlY2tib3goKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGlzLmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnc2V0dGluZycsICdjbG9zYWJsZScsIGZhbHNlKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3NldHRpbmcnLCAnb25IaWRkZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZpZXcuZ2V0KCdteWJvb2tpbmdzJykuc2V0KCdhbWVuZCcsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfSxcclxufSk7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9jb21wb25lbnRzL215Ym9va2luZ3MvYW1lbmRtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTc4XG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgbG9naW4gbW9kYWwgXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaGVhZGVyXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJUaWNrZXQgQ2FuY2VsbGF0aW9uXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5jYW5jZWxcIn0sXCIgXCIse1widFwiOjQsXCJmXCI6W1wiVGlja2V0IFJlc2NoZWR1bGVcIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnJlc2NoZWR1bGVcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImlkXCI6XCJjb25maXJtXCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiY29udGVudCBcIix7XCJ0XCI6NCxcImZcIjpbXCJ1aSBzZWdtZW50IGxvYWRpbmdcIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLnBlbmRpbmdcIn1dfSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbXCJteS1ib29raW5ncy1kZXRhaWxzIFwiLHtcInRcIjo0LFwiZlwiOltcInVpIHNlZ21lbnQgbG9hZGluZ1wiXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucGVuZGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1wiZ3JvdXAgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNDbGFzc1wiLFwiYm9va2luZ19zdGF0dXNcIl0sXCJzXCI6XCJfMChfMSlcIn19XX0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRhYmxlIHRpdGxlXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5zb3VyY2VcIn0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRvXCJ9LFwiZlwiOltcIsKgXCJdfSx7XCJ0XCI6MixcInJcIjpcImJvb2tpbmdzLjAuZGVzdGluYXRpb25cIn1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcInJldHVybmRhdGVcIl0sXCJzXCI6XCJfMD09bnVsbFwifX0se1widFwiOjQsXCJuXCI6NTEsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJkaXJlY3Rpb25cIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5zb3VyY2VcIn0se1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJhY2tcIn0sXCJmXCI6W1wiwqBcIl19LHtcInRcIjoyLFwiclwiOlwiYm9va2luZ3MuMC5kZXN0aW5hdGlvblwifV19XSxcInhcIjp7XCJyXCI6W1wicmV0dXJuZGF0ZVwiXSxcInNcIjpcIl8wPT1udWxsXCJ9fV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImlzTXVsdGlDaXR5XCJdLFwic1wiOlwiXzA9PVxcXCJmYWxzZVxcXCJcIn19LHtcInRcIjo0LFwiblwiOjUxLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiZGlyZWN0aW9uXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJzb3VyY2VcIn0sXCLCoCB8IMKgXCJdLFwiaVwiOlwiaVwiLFwiclwiOlwiYm9va2luZ3NcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInJcIjpbXCJib29raW5ncy5sZW5ndGhcIl0sXCJzXCI6XCJfMC0xXCJ9LFwiZGVzdGluYXRpb25cIl19fV19XSxcInhcIjp7XCJyXCI6W1wiaXNNdWx0aUNpdHlcIl0sXCJzXCI6XCJfMD09XFxcImZhbHNlXFxcIlwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlXCIsXCJib29raW5ncy4wLmRlcGFydHVyZVwiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0Qm9va2luZ1N0YXR1c0NsYXNzXCIsXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcImZcIjpbe1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdEJvb2tpbmdTdGF0dXNNZXNzYWdlXCIsXCJib29raW5nX3N0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJyXCJ9LFwiIFwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImJvb2tpbmctaWRcIn0sXCJmXCI6W1wiQm9va2luZyBJZDogXCIse1widFwiOjIsXCJyXCI6XCJpZFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJib29raW5nLWRhdGVcIn0sXCJmXCI6W3tcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRCb29raW5nRGF0ZVwiLFwiY3JlYXRlZFwiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlcldyYXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInBhc3NlbmdlclwifSxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwidWxcIixcIm1cIjpbe1widFwiOjQsXCJmXCI6W1wiY2xhc3M9XFxcIm5lZ2F0aXZlXFxcIlwiXSxcIm5cIjo1MCxcInJcIjpcInNlbGVjdGVkXCJ9XSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImZcIjpbXCJQYXNzZW5nZXI6XCJdfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcInRpdGxlXCJ9LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiZmlyc3RfbmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImxhc3RfbmFtZVwifSxcIiAoXCIse1widFwiOjIsXCJyXCI6XCJ0eXBlXCJ9LFwiKSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOltcInN0YXR1cyBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1widHJhdmVsbGVyQm9va2luZ1N0YXR1c1wiLFwic3RhdHVzXCJdLFwic1wiOlwiXzAoXzEpXCJ9fV19LFwiZlwiOlt7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1widHJhdmVsbGVyQm9va2luZ1N0YXR1c01lc3NhZ2VcIixcInN0YXR1c1wiXSxcInNcIjpcIl8wKF8xKVwifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiQ1JTIFBOUjpcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiY3JzX3BuclwifSxcIiwgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJmXCI6W1wiQWlyIFBOUjpcIl19LFwiIFwiLHtcInRcIjoyLFwiclwiOlwiYWlybGluZV9wbnJcIn0sXCIsIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiZlwiOltcIlRpY2tldCBOby46XCJdfSxcIiBcIix7XCJ0XCI6MixcInJcIjpcInRpY2tldFwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwibGlcIixcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImZpZWxkXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBjaGVja2JveCBcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzZWxlY3RcIixcImFcIjp7XCJyXCI6W1wialwiLFwidFwiXSxcInNcIjpcIltfMCxfMV1cIn19fSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcInR5cGVcIjpcImNoZWNrYm94XCIsXCJuYW1lXCI6XCJzZWxlY3RlZHBhc3NlbmdlclwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbXCJDYW5jZWxcIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLmNhbmNlbFwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJSZXNjaGVkdWxlXCJdLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5yZXNjaGVkdWxlXCJ9XX1dfV19XSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wic3RhdHVzXCIsXCJqXCIsXCJib29raW5nc1wiXSxcInNcIjpcIihfMD09Mnx8XzA9PTEpJiZfMltfMV0udXBjb21pbmc9PVxcXCJ0cnVlXFxcIlwifX1dfV19XSxcImlcIjpcInRcIixcInJ4XCI6e1wiclwiOlwiYm9va2luZ3NcIixcIm1cIjpbe1widFwiOjMwLFwiblwiOlwialwifSxcInRyYXZlbGxlclwiXX19XX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcIml0ZW1cIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNpeHRlZW4gd2lkZSBjb2x1bW4gXCIsXCJzdHlsZVwiOlwiaGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBzZWdtZW50IGZsaWdodC1pdGluZXJhcnkgY29tcGFjdCBkYXJrXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ0aXRsZVwiLFwic3R5bGVcIjpcInRleHQtYWxpZ246Y2VudGVyO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNpdHlcIixcInN0eWxlXCI6XCJkaXNwbGF5OmJsb2NrO1wifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJzb3VyY2VcIn0sXCIg4oaSIFwiLHtcInRcIjoyLFwiclwiOlwiZGVzdGluYXRpb25cIn1dfSxcIiBcIix7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZTJcIixcImRlcGFydHVyZVwiXSxcInNcIjpcIl8wKF8xKVwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpbWVcIn0sXCJmXCI6W3tcInRcIjoyLFwiclwiOlwiZmxpZ2h0dGltZVwifV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwic2VnbWVudFdyYXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInNlZ21lbnRzXCJ9LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJsYXlvdmVyXCJ9LFwiZlwiOltcIkxheW92ZXI6IFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJkaWZmXCIsXCJrXCIsXCJqXCIsXCJib29raW5nc1wiXSxcInNcIjpcIl8wKF8zW18yXS5yb3V0ZXNbXzFdLmRlcGFydHVyZSxfM1tfMl0ucm91dGVzW18xLTFdLmFycml2YWwpXCJ9fV19XX1dLFwiblwiOjUwLFwieFwiOntcInJcIjpbXCJrXCJdLFwic1wiOlwiXzA+MFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY2Fycmllci1uYW1lXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiY2Fycmllci1sb2dvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSB0b3AgYWxpZ25lZCBhdmF0YXIgaW1hZ2VcIixcInNyY1wiOltcIi9pbWcvYWlyX2xvZ29zL1wiLHtcInRcIjoyLFwiclwiOlwiY2FycmllclwifSxcIi5wbmdcIl0sXCJhbHRcIjpbe1widFwiOjIsXCJyXCI6XCJjYXJyaWVyTmFtZVwifV0sXCJ0aXRsZVwiOlt7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJOYW1lXCJ9XX19XX0sXCIgXCIse1widFwiOjIsXCJyXCI6XCJjYXJyaWVyTmFtZVwifSxcIiBcIix7XCJ0XCI6MixcInJcIjpcImNhcnJpZXJcIn0sXCItXCIse1widFwiOjIsXCJyXCI6XCJmbGlnaHROdW1iZXJcIn1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmcm9tXCIsXCJzdHlsZVwiOlwidGV4dC1hbGlnbjogY2VudGVyO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJiXCIsXCJmXCI6W3tcInRcIjoyLFwiclwiOlwib3JpZ2luXCJ9LFwiOlwiXX0sXCIgXCIse1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGUzXCIsXCJkZXBhcnR1cmVcIl0sXCJzXCI6XCJfMChfMSlcIn19LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0se1widFwiOjIsXCJ4XCI6e1wiclwiOltcImZvcm1hdFRyYXZlbERhdGVcIixcImRlcGFydHVyZVwiXSxcInNcIjpcIl8wKF8xKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJzdHlsZVwiOlwidGV4dC1hbGlnbjogcmlnaHQ7XCIsXCJjbGFzc1wiOlwiYWlycG9ydFwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJvcmlnaW5EZXRhaWxzXCJ9XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmbGlnaHRcIn0sXCJmXCI6W1wiwqBcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRvXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJkZXN0aW5hdGlvblwifSxcIjpcIl19LFwiIFwiLHtcInRcIjoyLFwieFwiOntcInJcIjpbXCJmb3JtYXRUcmF2ZWxEYXRlM1wiLFwiYXJyaXZhbFwiXSxcInNcIjpcIl8wKF8xKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSx7XCJ0XCI6MixcInhcIjp7XCJyXCI6W1wiZm9ybWF0VHJhdmVsRGF0ZVwiLFwiYXJyaXZhbFwiXSxcInNcIjpcIl8wKF8xKVwifX0se1widFwiOjcsXCJlXCI6XCJiclwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwiYWlycG9ydFwifSxcImZcIjpbe1widFwiOjIsXCJyXCI6XCJkZXN0aW5hdGlvbkRldGFpbHNcIn1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInRpbWUtbi1jYWJpblwiLFwic3R5bGVcIjpcInRleHQtYWxpZ246Y2VudGVyO1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImZcIjpbe1widFwiOjIsXCJyXCI6XCJmbGlnaHR0aW1lXCJ9LHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCIgXCIse1widFwiOjIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJ0cmF2ZWxsZXJcIix7XCJyXCI6W10sXCJzXCI6XCIwXCJ9LFwiY2FiaW5cIl19fV19XX1dfV0sXCJpXCI6XCJrXCIsXCJyeFwiOntcInJcIjpcImJvb2tpbmdzXCIsXCJtXCI6W3tcInRcIjozMCxcIm5cIjpcImpcIn0sXCJyb3V0ZXNcIl19fV19XX1dfV19XX1dLFwiaVwiOlwialwiLFwiclwiOlwiYm9va2luZ3NcIn0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiaXRlbVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZm9ybVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiZmllbGRcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImZcIjpbXCJSZWFzb24gRm9yIFwiLHtcInRcIjo0LFwiZlwiOltcIlRpY2tldCBDYW5jZWxsYXRpb25cIl0sXCJuXCI6NTAsXCJyXCI6XCJteWJvb2tpbmdzLmNhbmNlbFwifSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJUaWNrZXQgUmVzY2hlZHVsZVwiXSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MucmVzY2hlZHVsZVwifV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidGV4dGFyZWFcIixcImFcIjp7XCJpZFwiOlwiYW1lbmRSZWFzb25cIixcIm5hbWVcIjpcImFtZW5kUmVhc29uXCJ9fV19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcInN0eWxlXCI6XCJjbGVhcjpib3RoO1wifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiXCJ9LFwiZlwiOltcIiBcIix7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJidXR0b25cIixcInZcIjp7XCJjbGlja1wiOntcIm1cIjpcImFtZW5kVGlja2V0XCIsXCJhXCI6e1wiclwiOltdLFwic1wiOlwiWzJdXCJ9fX0sXCJhXCI6e1wiY2xhc3NcIjpcImxhcmdlIHVpIGJ1dHRvbiByZWRcIn0sXCJmXCI6W1wiUmVzY2hlZHVsZVwiXX1dLFwiblwiOjUwLFwiclwiOlwibXlib29raW5ncy5yZXNjaGVkdWxlXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwiYW1lbmRUaWNrZXRcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbMV1cIn19fSxcImFcIjp7XCJjbGFzc1wiOlwibGFyZ2UgdWkgYnV0dG9uIHJlZFwifSxcImZcIjpbXCJDYW5jZWxcIl19XSxcIm5cIjo1MCxcInJcIjpcIm15Ym9va2luZ3MuY2FuY2VsXCJ9XX1dfV19XSxcInJcIjpcIm15Ym9va2luZ3MuY3VycmVudENhcnREZXRhaWxzXCJ9XX1dfV19O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9qcy9hcHAvbW9iaWxlL21vZHVsZS90ZW1wbGF0ZXMvbXlib29raW5ncy9hbWVuZG1lbnQuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDE3OVxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGVzcy9tb2JpbGUvbXlib29raW5ncy5sZXNzXG4gKiogbW9kdWxlIGlkID0gMTgwXG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9