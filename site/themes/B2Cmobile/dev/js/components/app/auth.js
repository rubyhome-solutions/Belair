'use strict';

var $ = require('jquery'),
    Q = require('q')
    ;

var Form = require('core/form')
    ;

var Auth = Form.extend({
    template: require('templates/app/auth.html'),

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