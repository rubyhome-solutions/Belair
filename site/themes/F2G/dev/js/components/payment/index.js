'use strict';

var Q = require('q'),
    _ = require('lodash')
    ;

var Form = require('core/form'),
    Meta = require('stores/flight/meta'),
    Auth = require('components/app/auth')
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/payment/index.html'),

    components: {
        'layout': require('components/app/layout'),
        'payment-form': require('./form')
    },

    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },

    onconfig: function () {
        Meta.instance()
            .then(function (meta) { return this.set('meta', meta); }.bind(this))
    },

    signin: function() {
        var view = this;
        Auth.login()
            .then(function(data) {
                window.location.reload();
            });
    },

    leftMenu: function() {
        this.toggle('leftmenu');
        //var flag=this.toggle('leftmenu'); this.set('leftmenu', !flag);
    }
});