webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(118);


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

/***/ 118:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var  CMS = __webpack_require__(119);
	     
	__webpack_require__(121);
	
	$(function() {
	    (new CMS()).render('#app');
	});

/***/ },

/***/ 119:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Form = __webpack_require__(34),
	        Auth = __webpack_require__(80),
	         Meta = __webpack_require__(59)
	        ;
	
	module.exports = Form.extend({
	    isolated: true,
	    template: __webpack_require__(120),
	    components: {
	        'layout': __webpack_require__(72),
	        auth: __webpack_require__(80),
	    },
	    partials: {
	        'base-panel': __webpack_require__(105)
	    },
	    data: function () {
	
	        return {
	            pending: true,
	            submitted:false,
	            leftmenu: false,
	        };
	    },
	    leftMenu: function () {
	        var flag = this.get('leftmenu');
	        this.set('leftmenu', !flag);
	    },
	    onconfig: function () {
	         Meta.instance()
	                    .then(function (meta) {
	                        this.set('meta', meta);
	                    }.bind(this));
	        var idd = window.location.href.split('/');
	        var id = idd[idd.length - 1];
	       // console.log(id);
	        this.set('cmsid', id);
	        var view = this;
	        if (id) {
	            $.ajax({
	                type: 'GET',
	                url: '/b2c/cms/getCMSData/' + _.parseInt(id),
	                data: {'data': ''},
	                success: function (data) {
	                    view.set('content', data);
	                    view.set('pending', false);
	                    //console.log(data);
	                },
	                error: function (error) {
	                    view.set('content', 'Not Found Any Data');
	                    view.set('pending', false);
	                    // console.log("failed");
	                    // console.log(error);
	                }
	            });
	
	        } else {
	                    view.set('content', 'Not Found Any Data');
	                    view.set('pending', false);
	        }
	        $.ajax({
	                type: 'GET',
	                url: '/site/captcha?refresh=1',
	                data: {'data': ''},
	                success: function (data) {
	                   
	                },
	                error: function (error) {
	                   console.log(error);
	                }
	            });
	            this.setCaptcha();
	            
	    },
	    setCaptcha:function(){
	               var length=8;
	            var chars='#aA';
	            var mask = '';
	    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
	    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    if (chars.indexOf('#') > -1) mask += '0123456789';
	    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	    var result = '';
	    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
	          this.set('captcha','/site/captcha?v='+result);  
	    },
	    
	    refreshCaptcha:function(){
	         $.ajax({
	                type: 'GET',
	                url: '/site/captcha?refresh=1',
	                data: {'data': ''},
	                success: function (data) {
	                   
	                },
	                error: function (error) {
	                   console.log(error);
	                }
	            });
	            this.setCaptcha();
	    },
	      submitContactForm:function(){
	        var view = this;
	        view.set('submitting',true);
	        view.set('errors',null);
	        $.ajax({
	            type: 'POST',
	            url: '/site/contact/',
	            data: $('form').serialize(),
	            success: function (idd) {
	                //console.log(idd);
	                view.set('submitting',false);
	                if (idd.result == 'success') {
	                    view.set('submitted',true);
	                }
	                else if(idd.result == 'error'){
	                    view.set('errors',idd.message);
	                 //   console.log(idd.message);
	                }
	            },
	            error:function(error){
	                view.set('submitting',false);
	            }
	        });
	    },
	  signup: function() {
	        Auth.signup();
	    },
	    signin: function () {
	        var view = this;
	
	        Auth.login()
	                .then(function (data) {
	                    //console.log(data);
	                    if (data && data.id) {
	                        window.location.href = '/b2c/airCart/mybookings';
	                    }
	                });
	    },
	    oninit:function(){
	       this.on('closemessage', function (event) {
	          $('.ui.positive.message').fadeOut();
	        });
	    },
	});

/***/ },

/***/ 120:
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":7,"e":"layout","a":{"meta":[{"t":2,"r":"meta"}]},"f":[{"t":7,"e":"div","a":{"class":["ui form ",{"t":4,"f":["error"],"n":50,"x":{"r":["errors2","errorMsg2"],"s":"_0||_1"}}," ",{"t":4,"f":["loading"],"n":50,"r":"pending"}],"style":"float:left;margin-right:50px"},"f":[{"t":3,"r":"content"}]}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":[{"t":4,"f":["ui form loading"],"n":50,"r":"submitting"}]},"f":[{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui error message","style":"display:block"},"f":[{"t":7,"e":"p","f":[{"t":2,"r":"errors"}]}]}],"n":50,"r":"errors"}," ",{"t":4,"f":[{"t":7,"e":"div","a":{"class":"ui positive message"},"f":["Message Sent.",{"t":7,"e":"i","a":{"class":"close icon"},"v":{"click":"closemessage"}}]}],"n":50,"r":"submitted"}," ",{"t":7,"e":"form","a":{"id":"contact-form","class":"form-horizontal","method":"post","style":"padding-right: 30px;"},"f":[{"t":7,"e":"h2","f":["Contact form:"]}," ",{"t":7,"e":"p","a":{"class":"note"},"f":["Fields with ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}," are required."]}," ",{"t":7,"e":"fieldset","f":[{"t":7,"e":"div","a":{"id":"contact-form_es_","class":"alert alert-block alert-error","style":"display:none"},"f":[{"t":7,"e":"p","f":["Please fix the following input errors:"]}," ",{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":["dummy"]}]}]}," ",{"t":7,"e":"div","a":{"class":"control-group"},"f":[{"t":7,"e":"label","a":{"class":"control-label required","for":"ContactForm_name"},"f":["Name ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"div","a":{"class":"controls"},"f":[{"t":7,"e":"input","a":{"name":"ContactForm[name]","id":"ContactForm_name","type":"text"}}," ",{"t":7,"e":"p","a":{"id":"ContactForm_name_em_","style":"display:none","class":"help-block"}}]}]}," ",{"t":7,"e":"div","a":{"class":"control-group"},"f":[{"t":7,"e":"label","a":{"class":"control-label required","for":"ContactForm_email"},"f":["Email ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"div","a":{"class":"controls"},"f":[{"t":7,"e":"input","a":{"name":"ContactForm[email]","id":"ContactForm_email","type":"text"}}," ",{"t":7,"e":"p","a":{"id":"ContactForm_email_em_","style":"display:none","class":"help-block"}}]}]}," ",{"t":7,"e":"div","a":{"class":"control-group"},"f":[{"t":7,"e":"label","a":{"class":"control-label required","for":"ContactForm_subject"},"f":["Subject ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"div","a":{"class":"controls"},"f":[{"t":7,"e":"input","a":{"maxlength":"128","name":"ContactForm[subject]","id":"ContactForm_subject","class":"input-60","type":"text"}}," ",{"t":7,"e":"p","a":{"id":"ContactForm_subject_em_","style":"display:none","class":"help-block"}}]}]}," ",{"t":7,"e":"div","a":{"class":"control-group"},"f":[{"t":7,"e":"label","a":{"class":"control-label required","for":"ContactForm_body"},"f":["Body ",{"t":7,"e":"span","a":{"class":"required"},"f":["*"]}]}," ",{"t":7,"e":"div","a":{"class":"controls"},"f":[{"t":7,"e":"textarea","a":{"rows":"6","style":"width: 90%;","name":"ContactForm[body]","id":"ContactForm_body"}}," ",{"t":7,"e":"p","a":{"id":"ContactForm_body_em_","style":"display:none","class":"help-block"}}]}]}," ",{"t":7,"e":"div","a":{"class":"control-group"},"f":[{"t":7,"e":"label","a":{"class":"control-label","for":"ContactForm_verifyCode"},"f":["Verification Code"]}," ",{"t":7,"e":"div","a":{"class":"controls"},"f":[{"t":7,"e":"input","a":{"name":"ContactForm[verifyCode]","id":"ContactForm_verifyCode","type":"text"}}," ",{"t":7,"e":"p","a":{"id":"ContactForm_verifyCode_em_","style":"display:none","class":"help-block"}}]}]}," ",{"t":7,"e":"img","a":{"id":"yw0","src":[{"t":2,"r":"captcha"}],"alt":""}},{"t":7,"e":"a","a":{"id":"yw0_button"},"v":{"click":{"m":"refreshCaptcha","a":{"r":[],"s":"[]"}}},"f":["Get a new code"]}," ",{"t":7,"e":"div","a":{"class":"hint"},"f":["Please enter the letters as they are shown in the image above. ",{"t":7,"e":"br"},"Letters are not case-sensitive."]}," ",{"t":7,"e":"div","a":{"class":"form-actions"},"f":[{"t":7,"e":"div","a":{"class":"ui button blue","name":"yt0"},"v":{"click":{"m":"submitContactForm","a":{"r":[],"s":"[]"}}},"f":["Submit"]}," ",{"t":7,"e":"button","a":{"class":"ui button blue","type":"reset","name":"yt1"},"f":["Reset"]}]}]}]}]}],"n":50,"x":{"r":["cmsid"],"s":"_0==1"}}," "],"p":{"panel":[{"t":8,"r":"base-panel"}]}}]};

/***/ },

/***/ 121:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9jb21wb25lbnRzL2FwcC9hdXRoLmpzP2I2OTIiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9jbXMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvY29tcG9uZW50cy9jbXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwL3dlYi9tb2R1bGUvdGVtcGxhdGVzL2Ntcy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL2xlc3Mvd2ViL21vZHVsZXMvbXlib29raW5ncy9teWJvb2tpbmdzLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsd0VBQXdFO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQjtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixnQ0FBZ0M7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FB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QkFBd0IsT0FBTyx1QkFBdUIsMkRBQTJELGdCQUFnQixzQkFBc0IsbUJBQW1CLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixtQkFBbUIsT0FBTyx1QkFBdUIsb0VBQW9FLE1BQU0sbUJBQW1CLDBFQUEwRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsd0JBQXdCLE9BQU8sdUJBQXVCLDZEQUE2RCxrQkFBa0Isc0JBQXNCLG1CQUFtQixXQUFXLEVBQUUsTUFBTSxxQkFBcUIsbUJBQW1CLE9BQU8sdUJBQXVCLDZHQUE2RyxNQUFNLG1CQUFtQiw0RUFBNEUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLHdCQUF3QixPQUFPLHVCQUF1QiwwREFBMEQsZUFBZSxzQkFBc0IsbUJBQW1CLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixtQkFBbUIsT0FBTywwQkFBMEIsK0JBQStCLHNEQUFzRCxNQUFNLG1CQUFtQix5RUFBeUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLHdCQUF3QixPQUFPLHVCQUF1Qix1REFBdUQsMkJBQTJCLE1BQU0scUJBQXFCLG1CQUFtQixPQUFPLHVCQUF1Qiw4RUFBOEUsTUFBTSxtQkFBbUIsK0VBQStFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixtQkFBbUIsb0JBQW9CLFlBQVksRUFBRSxtQkFBbUIsa0JBQWtCLE1BQU0sU0FBUywwQkFBMEIsa0JBQWtCLHdCQUF3QixNQUFNLHFCQUFxQixlQUFlLHlFQUF5RSxlQUFlLG9DQUFvQyxNQUFNLHFCQUFxQix1QkFBdUIsT0FBTyxxQkFBcUIsc0NBQXNDLE1BQU0sU0FBUyw2QkFBNkIsa0JBQWtCLGdCQUFnQixNQUFNLHdCQUF3QixxREFBcUQsZUFBZSxFQUFFLEVBQUUsRUFBRSxFQUFFLGNBQWMsMkJBQTJCLFdBQVcsVUFBVSx1QkFBdUIsR0FBRyxHOzs7Ozs7O0FDQTV6SSwwQyIsImZpbGUiOiJqcy9jbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXG4gICAgUSA9IHJlcXVpcmUoJ3EnKVxuICAgIDtcblxudmFyIEZvcm0gPSByZXF1aXJlKCdjb3JlL2Zvcm0nKVxuICAgIDtcblxudmFyIEF1dGggPSBGb3JtLmV4dGVuZCh7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJ3RlbXBsYXRlcy9hcHAvYXV0aC5odG1sJyksXG5cbiAgICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2xvZ2luJyxcbiAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgZm9yZ290dGVucGFzczogZmFsc2UsXG5cbiAgICAgICAgICAgIHVzZXI6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5nZXQoJ3BvcHVwJykpIHtcbiAgICAgICAgICAgICQodGhpcy5maW5kKCcudWkubW9kYWwnKSkubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdWJtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9yTXNnJywgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcicsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoLycgKyB0aGlzLmdldCgnYWN0aW9uJyksXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB0aGlzLmdldCgndXNlci5sb2dpbicpLCBwYXNzd29yZDogdGhpcy5nZXQoJ3VzZXIucGFzc3dvcmQnKSB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCh2aWV3LmZpbmQoJy51aS5tb2RhbCcpKS5tb2RhbCgnaGlkZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuZGVmZXJyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5kZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cdFx0XHRcdFx0aWYocmVzcG9uc2UuZXJyb3JzWyd1c2VybmFtZSddWzBdPT1cIllvdSBhcmUgYWxyZWFkeSBvdXIgQjJCIHVzZXIuXCIpIHtcblx0XHRcdFx0XHRcdCQoXCIjQjJCVXNlclBvcHVwXCIpLmhpZGUoKTtcblx0XHRcdFx0XHRcdCQoXCIubG9naW4gLmhlYWRlclwiKS5odG1sKCdCMkIgVXNlciBMb2dpbicpO1xuXHRcdFx0XHRcdFx0dmlldy5zZXQoJ0IyQlVzZXJMb2dpblBvcHVwTWVzc2FnZScsdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodmlldy5nZXQoJ3BvcHVwJyk9PW51bGwgJiYgZGF0YSAmJiBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVzZXRQYXNzd29yZDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoJ3N1Ym1pdHRpbmcnLCB0cnVlKTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL2ZvcmdvdHRlbnBhc3MnLFxuICAgICAgICAgICAgZGF0YTogeyBlbWFpbDogdGhpcy5nZXQoJ3VzZXIubG9naW4nKSB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3Jlc2V0c3VjY2VzcycsIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCByZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbcmVzcG9uc2UubWVzc2FnZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJywgWydTZXJ2ZXIgcmV0dXJuZWQgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2lnbnVwOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zZXQoJ2Vycm9ycycsIG51bGwpO1xuICAgICAgICB0aGlzLnNldCgnc3VibWl0dGluZycsIHRydWUpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2IyYy9hdXRoL3NpZ251cCcsXG4gICAgICAgICAgICBkYXRhOiBfLnBpY2sodGhpcy5nZXQoJ3VzZXInKSwgWydlbWFpbCcsJ25hbWUnLCAnbW9iaWxlJywgJ3Bhc3N3b3JkJywgJ3Bhc3N3b3JkMiddKSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdzaWdudXBzdWNjZXNzJywgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2Vycm9ycycsIFtyZXNwb25zZS5tZXNzYWdlXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLCBbJ1NlcnZlciByZXR1cm5lZCBlcnJvci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciddKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cbkF1dGgubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XG5cbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcbiAgICBhdXRoLmRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGF1dGgucmVuZGVyKCcjcG9wdXAtY29udGFpbmVyJyk7XG5cbiAgICByZXR1cm4gYXV0aC5kZWZlcnJlZC5wcm9taXNlO1xufTtcblxuQXV0aC5zaWdudXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKCk7XG5cbiAgICBhdXRoLnNldCgncG9wdXAnLCB0cnVlKTtcbiAgICBhdXRoLnNldCgnc2lnbnVwJywgdHJ1ZSk7XG4gICAgYXV0aC5kZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBhdXRoLnJlbmRlcignI3BvcHVwLWNvbnRhaW5lcicpO1xuXG4gICAgcmV0dXJuIGF1dGguZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2NvbXBvbmVudHMvYXBwL2F1dGguanNcbi8vIG1vZHVsZSBpZCA9IDgwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDMgNCA1IDYgNyAxMCIsIid1c2Ugc3RyaWN0JztcblxudmFyICBDTVMgPSByZXF1aXJlKCdjb21wb25lbnRzL2Ntcy9pbmRleCcpO1xuICAgICBcbnJlcXVpcmUoJ3dlYi9tb2R1bGVzL215Ym9va2luZ3MvbXlib29raW5ncy5sZXNzJyk7XG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgKG5ldyBDTVMoKSkucmVuZGVyKCcjYXBwJyk7XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2FwcC93ZWIvY21zLmpzXG4vLyBtb2R1bGUgaWQgPSAxMThcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvZm9ybScpLFxuICAgICAgICBBdXRoID0gcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvYXV0aCcpLFxuICAgICAgICAgTWV0YSA9IHJlcXVpcmUoJ3N0b3Jlcy9teWJvb2tpbmdzL21ldGEnKVxuICAgICAgICA7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybS5leHRlbmQoe1xuICAgIGlzb2xhdGVkOiB0cnVlLFxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCd0ZW1wbGF0ZXMvY21zL2luZGV4Lmh0bWwnKSxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgICdsYXlvdXQnOiByZXF1aXJlKCdjb21wb25lbnRzL2FwcC9sYXlvdXQnKSxcbiAgICAgICAgYXV0aDogcmVxdWlyZSgnY29tcG9uZW50cy9hcHAvYXV0aCcpLFxuICAgIH0sXG4gICAgcGFydGlhbHM6IHtcbiAgICAgICAgJ2Jhc2UtcGFuZWwnOiByZXF1aXJlKCd0ZW1wbGF0ZXMvYXBwL2xheW91dC9wYW5lbC5odG1sJylcbiAgICB9LFxuICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGVuZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHN1Ym1pdHRlZDpmYWxzZSxcbiAgICAgICAgICAgIGxlZnRtZW51OiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGxlZnRNZW51OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmbGFnID0gdGhpcy5nZXQoJ2xlZnRtZW51Jyk7XG4gICAgICAgIHRoaXMuc2V0KCdsZWZ0bWVudScsICFmbGFnKTtcbiAgICB9LFxuICAgIG9uY29uZmlnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICBNZXRhLmluc3RhbmNlKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKG1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdtZXRhJywgbWV0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIHZhciBpZGQgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgaWQgPSBpZGRbaWRkLmxlbmd0aCAtIDFdO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgICAgdGhpcy5zZXQoJ2Ntc2lkJywgaWQpO1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYjJjL2Ntcy9nZXRDTVNEYXRhLycgKyBfLnBhcnNlSW50KGlkKSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ2NvbnRlbnQnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0KCdjb250ZW50JywgJ05vdCBGb3VuZCBBbnkgRGF0YScpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgncGVuZGluZycsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmYWlsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnY29udGVudCcsICdOb3QgRm91bmQgQW55IERhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXQoJ3BlbmRpbmcnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2l0ZS9jYXB0Y2hhP3JlZnJlc2g9MScsXG4gICAgICAgICAgICAgICAgZGF0YTogeydkYXRhJzogJyd9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zZXRDYXB0Y2hhKCk7XG4gICAgICAgICAgICBcbiAgICB9LFxuICAgIHNldENhcHRjaGE6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgIHZhciBsZW5ndGg9ODtcbiAgICAgICAgICAgIHZhciBjaGFycz0nI2FBJztcbiAgICAgICAgICAgIHZhciBtYXNrID0gJyc7XG4gICAgaWYgKGNoYXJzLmluZGV4T2YoJ2EnKSA+IC0xKSBtYXNrICs9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XG4gICAgaWYgKGNoYXJzLmluZGV4T2YoJ0EnKSA+IC0xKSBtYXNrICs9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XG4gICAgaWYgKGNoYXJzLmluZGV4T2YoJyMnKSA+IC0xKSBtYXNrICs9ICcwMTIzNDU2Nzg5JztcbiAgICBpZiAoY2hhcnMuaW5kZXhPZignIScpID4gLTEpIG1hc2sgKz0gJ35gIUAjJCVeJiooKV8rLT17fVtdOlwiO1xcJzw+PywuL3xcXFxcJztcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IGxlbmd0aDsgaSA+IDA7IC0taSkgcmVzdWx0ICs9IG1hc2tbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKG1hc2subGVuZ3RoIC0gMSkpXTtcbiAgICAgICAgICB0aGlzLnNldCgnY2FwdGNoYScsJy9zaXRlL2NhcHRjaGE/dj0nK3Jlc3VsdCk7ICBcbiAgICB9LFxuICAgIFxuICAgIHJlZnJlc2hDYXB0Y2hhOmZ1bmN0aW9uKCl7XG4gICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9zaXRlL2NhcHRjaGE/cmVmcmVzaD0xJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7J2RhdGEnOiAnJ30sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNldENhcHRjaGEoKTtcbiAgICB9LFxuICAgICAgc3VibWl0Q29udGFjdEZvcm06ZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHZpZXcgPSB0aGlzO1xuICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsdHJ1ZSk7XG4gICAgICAgIHZpZXcuc2V0KCdlcnJvcnMnLG51bGwpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL3NpdGUvY29udGFjdC8nLFxuICAgICAgICAgICAgZGF0YTogJCgnZm9ybScpLnNlcmlhbGl6ZSgpLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGlkZCkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coaWRkKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGluZycsZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChpZGQucmVzdWx0ID09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnc3VibWl0dGVkJyx0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihpZGQucmVzdWx0ID09ICdlcnJvcicpe1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldCgnZXJyb3JzJyxpZGQubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coaWRkLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgdmlldy5zZXQoJ3N1Ym1pdHRpbmcnLGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgc2lnbnVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgQXV0aC5zaWdudXAoKTtcbiAgICB9LFxuICAgIHNpZ25pbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmlldyA9IHRoaXM7XG5cbiAgICAgICAgQXV0aC5sb2dpbigpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2IyYy9haXJDYXJ0L215Ym9va2luZ3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvbmluaXQ6ZnVuY3Rpb24oKXtcbiAgICAgICB0aGlzLm9uKCdjbG9zZW1lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAkKCcudWkucG9zaXRpdmUubWVzc2FnZScpLmZhZGVPdXQoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvY29tcG9uZW50cy9jbXMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDExOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJtb2R1bGUuZXhwb3J0cz17XCJ2XCI6MyxcInRcIjpbe1widFwiOjcsXCJlXCI6XCJsYXlvdXRcIixcImFcIjp7XCJtZXRhXCI6W3tcInRcIjoyLFwiclwiOlwibWV0YVwifV19LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6W1widWkgZm9ybSBcIix7XCJ0XCI6NCxcImZcIjpbXCJlcnJvclwiXSxcIm5cIjo1MCxcInhcIjp7XCJyXCI6W1wiZXJyb3JzMlwiLFwiZXJyb3JNc2cyXCJdLFwic1wiOlwiXzB8fF8xXCJ9fSxcIiBcIix7XCJ0XCI6NCxcImZcIjpbXCJsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwicGVuZGluZ1wifV0sXCJzdHlsZVwiOlwiZmxvYXQ6bGVmdDttYXJnaW4tcmlnaHQ6NTBweFwifSxcImZcIjpbe1widFwiOjMsXCJyXCI6XCJjb250ZW50XCJ9XX0sXCIgXCIse1widFwiOjQsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpbe1widFwiOjQsXCJmXCI6W1widWkgZm9ybSBsb2FkaW5nXCJdLFwiblwiOjUwLFwiclwiOlwic3VibWl0dGluZ1wifV19LFwiZlwiOlt7XCJ0XCI6NCxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwidWkgZXJyb3IgbWVzc2FnZVwiLFwic3R5bGVcIjpcImRpc3BsYXk6YmxvY2tcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwicFwiLFwiZlwiOlt7XCJ0XCI6MixcInJcIjpcImVycm9yc1wifV19XX1dLFwiblwiOjUwLFwiclwiOlwiZXJyb3JzXCJ9LFwiIFwiLHtcInRcIjo0LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBwb3NpdGl2ZSBtZXNzYWdlXCJ9LFwiZlwiOltcIk1lc3NhZ2UgU2VudC5cIix7XCJ0XCI6NyxcImVcIjpcImlcIixcImFcIjp7XCJjbGFzc1wiOlwiY2xvc2UgaWNvblwifSxcInZcIjp7XCJjbGlja1wiOlwiY2xvc2VtZXNzYWdlXCJ9fV19XSxcIm5cIjo1MCxcInJcIjpcInN1Ym1pdHRlZFwifSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImZvcm1cIixcImFcIjp7XCJpZFwiOlwiY29udGFjdC1mb3JtXCIsXCJjbGFzc1wiOlwiZm9ybS1ob3Jpem9udGFsXCIsXCJtZXRob2RcIjpcInBvc3RcIixcInN0eWxlXCI6XCJwYWRkaW5nLXJpZ2h0OiAzMHB4O1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJoMlwiLFwiZlwiOltcIkNvbnRhY3QgZm9ybTpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiYVwiOntcImNsYXNzXCI6XCJub3RlXCJ9LFwiZlwiOltcIkZpZWxkcyB3aXRoIFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfSxcIiBhcmUgcmVxdWlyZWQuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImZpZWxkc2V0XCIsXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiaWRcIjpcImNvbnRhY3QtZm9ybV9lc19cIixcImNsYXNzXCI6XCJhbGVydCBhbGVydC1ibG9jayBhbGVydC1lcnJvclwiLFwic3R5bGVcIjpcImRpc3BsYXk6bm9uZVwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJwXCIsXCJmXCI6W1wiUGxlYXNlIGZpeCB0aGUgZm9sbG93aW5nIGlucHV0IGVycm9yczpcIl19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwidWxcIixcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsaVwiLFwiZlwiOltcImR1bW15XCJdfV19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udHJvbC1ncm91cFwifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJsYWJlbFwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250cm9sLWxhYmVsIHJlcXVpcmVkXCIsXCJmb3JcIjpcIkNvbnRhY3RGb3JtX25hbWVcIn0sXCJmXCI6W1wiTmFtZSBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250cm9sc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIkNvbnRhY3RGb3JtW25hbWVdXCIsXCJpZFwiOlwiQ29udGFjdEZvcm1fbmFtZVwiLFwidHlwZVwiOlwidGV4dFwifX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJwXCIsXCJhXCI6e1wiaWRcIjpcIkNvbnRhY3RGb3JtX25hbWVfZW1fXCIsXCJzdHlsZVwiOlwiZGlzcGxheTpub25lXCIsXCJjbGFzc1wiOlwiaGVscC1ibG9ja1wifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRyb2wtZ3JvdXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udHJvbC1sYWJlbCByZXF1aXJlZFwiLFwiZm9yXCI6XCJDb250YWN0Rm9ybV9lbWFpbFwifSxcImZcIjpbXCJFbWFpbCBcIix7XCJ0XCI6NyxcImVcIjpcInNwYW5cIixcImFcIjp7XCJjbGFzc1wiOlwicmVxdWlyZWRcIn0sXCJmXCI6W1wiKlwiXX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250cm9sc1wifSxcImZcIjpbe1widFwiOjcsXCJlXCI6XCJpbnB1dFwiLFwiYVwiOntcIm5hbWVcIjpcIkNvbnRhY3RGb3JtW2VtYWlsXVwiLFwiaWRcIjpcIkNvbnRhY3RGb3JtX2VtYWlsXCIsXCJ0eXBlXCI6XCJ0ZXh0XCJ9fSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcInBcIixcImFcIjp7XCJpZFwiOlwiQ29udGFjdEZvcm1fZW1haWxfZW1fXCIsXCJzdHlsZVwiOlwiZGlzcGxheTpub25lXCIsXCJjbGFzc1wiOlwiaGVscC1ibG9ja1wifX1dfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRyb2wtZ3JvdXBcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwibGFiZWxcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udHJvbC1sYWJlbCByZXF1aXJlZFwiLFwiZm9yXCI6XCJDb250YWN0Rm9ybV9zdWJqZWN0XCJ9LFwiZlwiOltcIlN1YmplY3QgXCIse1widFwiOjcsXCJlXCI6XCJzcGFuXCIsXCJhXCI6e1wiY2xhc3NcIjpcInJlcXVpcmVkXCJ9LFwiZlwiOltcIipcIl19XX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udHJvbHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJtYXhsZW5ndGhcIjpcIjEyOFwiLFwibmFtZVwiOlwiQ29udGFjdEZvcm1bc3ViamVjdF1cIixcImlkXCI6XCJDb250YWN0Rm9ybV9zdWJqZWN0XCIsXCJjbGFzc1wiOlwiaW5wdXQtNjBcIixcInR5cGVcIjpcInRleHRcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiYVwiOntcImlkXCI6XCJDb250YWN0Rm9ybV9zdWJqZWN0X2VtX1wiLFwic3R5bGVcIjpcImRpc3BsYXk6bm9uZVwiLFwiY2xhc3NcIjpcImhlbHAtYmxvY2tcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250cm9sLWdyb3VwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRyb2wtbGFiZWwgcmVxdWlyZWRcIixcImZvclwiOlwiQ29udGFjdEZvcm1fYm9keVwifSxcImZcIjpbXCJCb2R5IFwiLHtcInRcIjo3LFwiZVwiOlwic3BhblwiLFwiYVwiOntcImNsYXNzXCI6XCJyZXF1aXJlZFwifSxcImZcIjpbXCIqXCJdfV19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRyb2xzXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcInRleHRhcmVhXCIsXCJhXCI6e1wicm93c1wiOlwiNlwiLFwic3R5bGVcIjpcIndpZHRoOiA5MCU7XCIsXCJuYW1lXCI6XCJDb250YWN0Rm9ybVtib2R5XVwiLFwiaWRcIjpcIkNvbnRhY3RGb3JtX2JvZHlcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiYVwiOntcImlkXCI6XCJDb250YWN0Rm9ybV9ib2R5X2VtX1wiLFwic3R5bGVcIjpcImRpc3BsYXk6bm9uZVwiLFwiY2xhc3NcIjpcImhlbHAtYmxvY2tcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJjb250cm9sLWdyb3VwXCJ9LFwiZlwiOlt7XCJ0XCI6NyxcImVcIjpcImxhYmVsXCIsXCJhXCI6e1wiY2xhc3NcIjpcImNvbnRyb2wtbGFiZWxcIixcImZvclwiOlwiQ29udGFjdEZvcm1fdmVyaWZ5Q29kZVwifSxcImZcIjpbXCJWZXJpZmljYXRpb24gQ29kZVwiXX0sXCIgXCIse1widFwiOjcsXCJlXCI6XCJkaXZcIixcImFcIjp7XCJjbGFzc1wiOlwiY29udHJvbHNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiaW5wdXRcIixcImFcIjp7XCJuYW1lXCI6XCJDb250YWN0Rm9ybVt2ZXJpZnlDb2RlXVwiLFwiaWRcIjpcIkNvbnRhY3RGb3JtX3ZlcmlmeUNvZGVcIixcInR5cGVcIjpcInRleHRcIn19LFwiIFwiLHtcInRcIjo3LFwiZVwiOlwicFwiLFwiYVwiOntcImlkXCI6XCJDb250YWN0Rm9ybV92ZXJpZnlDb2RlX2VtX1wiLFwic3R5bGVcIjpcImRpc3BsYXk6bm9uZVwiLFwiY2xhc3NcIjpcImhlbHAtYmxvY2tcIn19XX1dfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImltZ1wiLFwiYVwiOntcImlkXCI6XCJ5dzBcIixcInNyY1wiOlt7XCJ0XCI6MixcInJcIjpcImNhcHRjaGFcIn1dLFwiYWx0XCI6XCJcIn19LHtcInRcIjo3LFwiZVwiOlwiYVwiLFwiYVwiOntcImlkXCI6XCJ5dzBfYnV0dG9uXCJ9LFwidlwiOntcImNsaWNrXCI6e1wibVwiOlwicmVmcmVzaENhcHRjaGFcIixcImFcIjp7XCJyXCI6W10sXCJzXCI6XCJbXVwifX19LFwiZlwiOltcIkdldCBhIG5ldyBjb2RlXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJoaW50XCJ9LFwiZlwiOltcIlBsZWFzZSBlbnRlciB0aGUgbGV0dGVycyBhcyB0aGV5IGFyZSBzaG93biBpbiB0aGUgaW1hZ2UgYWJvdmUuIFwiLHtcInRcIjo3LFwiZVwiOlwiYnJcIn0sXCJMZXR0ZXJzIGFyZSBub3QgY2FzZS1zZW5zaXRpdmUuXCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImRpdlwiLFwiYVwiOntcImNsYXNzXCI6XCJmb3JtLWFjdGlvbnNcIn0sXCJmXCI6W3tcInRcIjo3LFwiZVwiOlwiZGl2XCIsXCJhXCI6e1wiY2xhc3NcIjpcInVpIGJ1dHRvbiBibHVlXCIsXCJuYW1lXCI6XCJ5dDBcIn0sXCJ2XCI6e1wiY2xpY2tcIjp7XCJtXCI6XCJzdWJtaXRDb250YWN0Rm9ybVwiLFwiYVwiOntcInJcIjpbXSxcInNcIjpcIltdXCJ9fX0sXCJmXCI6W1wiU3VibWl0XCJdfSxcIiBcIix7XCJ0XCI6NyxcImVcIjpcImJ1dHRvblwiLFwiYVwiOntcImNsYXNzXCI6XCJ1aSBidXR0b24gYmx1ZVwiLFwidHlwZVwiOlwicmVzZXRcIixcIm5hbWVcIjpcInl0MVwifSxcImZcIjpbXCJSZXNldFwiXX1dfV19XX1dfV0sXCJuXCI6NTAsXCJ4XCI6e1wiclwiOltcImNtc2lkXCJdLFwic1wiOlwiXzA9PTFcIn19LFwiIFwiXSxcInBcIjp7XCJwYW5lbFwiOlt7XCJ0XCI6OCxcInJcIjpcImJhc2UtcGFuZWxcIn1dfX1dfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2FwcC93ZWIvbW9kdWxlL3RlbXBsYXRlcy9jbXMvaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gMTIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9sZXNzL3dlYi9tb2R1bGVzL215Ym9va2luZ3MvbXlib29raW5ncy5sZXNzXG4vLyBtb2R1bGUgaWQgPSAxMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDciXSwic291cmNlUm9vdCI6IiJ9