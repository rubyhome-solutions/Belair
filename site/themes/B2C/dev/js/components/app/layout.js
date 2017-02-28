'use strict';

var Component = require('core/component'),
        Meta = require('stores/' + window.meta_store_path + '/meta'),
        _ = require('lodash'),
        $ = require('jquery')
        ;

module.exports = Component.extend({
    template: require('templates/app/layout/index.html'),

    data: function () {
        return {
            panel: true,
            meta: Meta.object,
            util: _
        }
    },
    oncomplete: function () {

        $('#Cpop').click(function () {
            $('.infoPop').toggleClass('show');
            $('.modalinfo').focus();
        });
        $('#closeinfo').click(function () {
            $('.infoPop').removeClass('show');
        });

        $(this.find('.panel')).height(
                $(window).height() - (Math.max(57, $(this.find('header')).height()) + 400)
                );

        $(this.nodes.currency).dropdown();
        this.observe('meta.display_currency', function (cur) {

            this.set('meta.display_currency', cur);

        });
        $('footer').show();

    },
    showPanel: function () {
        this.set('panel', true);
    },
    hidePanel: function () {
        this.set('panel', false);
    },
    setCurrency: function (code) {
        Meta.object.set('display_currency', code);
        if (code != 'INR') {
            $('curterm').show();
        } else {
            $('curterm').hide();
        }
        /*
         * Refer : site/themes/B2C/dev/js/components/flights/search/filter.js->oncomplete()
         */
        if (Meta.object.PriceSlider) {
            Meta.object.PriceSlider.reset();
        }
    },
    manageBooking: function (options) {
        var $ = require('jquery'),
                Q = require('q');
        var Form = require('core/form');
        var Auth = Form.extend({
            template: require('templates/app/auth.html'),
            data: function () {
                return {
                    action: 'login',
                    submitting: false,
                    forgottenpass: false
                };
            },
            config: function (options) {
                if (options === '_all_') {
                    auth.set('reset_pass_manage1', true);
                    auth.set('forgottenpass1', true);
                    return;
                }
                auth.set('manage_bookings', false);
                auth.set('log_in', false);
                auth.set('sign_up', false);
                auth.set('forgottenpass', false);
                auth.set('reset_pass_manage', false);
                auth.set('reset_pass_manage1', false);
                auth.set('forgottenpass1', false);
                _.each(options, function (option) {
                    auth.set(option, true);
                });
            },
            oncomplete: function () {
                auth.config(options);
                if (this.get('popup_new')) {
                    $(this.find('.ui.modal')).modal('show');
                }
                $(".close").click(function () {
                    $("#popup-container").html(" ");
                });
            },
            forgot_pass: function () {
                auth.set('reset_pass_manage', true);
                auth.set('forgottenpass', true);
            },
            handlePopupUI: function (options) {
                auth.config(options);
            },
            submit: function () {
                var view = this;

                this.set('errorMsg', null);
                this.set('error', null);
                this.set('submitting', true);
                $.ajax({
                    type: 'POST',
                    url: '/b2c/auth/' + this.get('action'),
                    data: {username: this.get('user.login'), password: this.get('user.password')},
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
                            if (response.errors['username'][0] == "You are already our B2B user.") {
                                $("#B2BUserPopup").hide();
                                $(".login .header").html('B2B User Login');
                                view.set('B2BUserLoginPopupMessage', true);
                            } else if (response.errors) {
                                view.set('errors', response.errors);
                            }
                        } catch (e) {
                            view.set('errors', ['Server returned error. Please try again later']);
                        }
                    }
                }).then(function (data) {
                    var url      = window.location.href;
                    if (view.get('popup') == null && data && data.id) {
                        window.location.href = url;
                    }
                });
            },
            resetPassword: function (event) {
                var view = this;

                this.set('errors', null);
                this.set('submitting', true);

                $.ajax({
                    type: 'POST',
                    url: '/b2c/auth/forgottenpass',
                    data: {email: this.get('user.login')},
                    dataType: 'json',
                    complete: function () {
                        view.set('submitting', false);
                    },
                    success: function (data) {
                        view.set('resetsuccess', true);
                    },
                    error: function (xhr) {
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
            signup: function (event) {
                var view = this;

                this.set('errors', null);
                this.set('submitting', true);
                $.ajax({
                    type: 'POST',
                    url: '/b2c/auth/signup',
                    data: _.pick(this.get('user'), ['email', 'name', 'mobile', 'password', 'password2']),
                    dataType: 'json',
                    complete: function () {
                        view.set('submitting', false);
                    },
                    success: function (data) {
                        view.set('signupsuccess', true);
                    },
                    error: function (xhr) {
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

                     //   console.log(data.error);
                        if (typeof data.error == 'undefined') {
                            var details = {id: data.id};
                          //  console.log(data);
                            document.location.href = "/b2c/airCart/mybookings/" + details.id;
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
                            var details = {id: data.id};
                        //    console.log(data);
                            document.location.href = "/b2c/airCart/mybookings/" + details.id;
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
            }
        });
        var auth = new Auth();
        auth.set('manage', true);
        auth.set('popup_new', true);
        auth.deferred = Q.defer();
        auth.render('#minfo');
        return auth.deferred.promise;
    },
});
