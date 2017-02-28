'use strict';

var Form = require('core/form'),
        Auth = require('components/app/auth'),
        MybookingData = require('stores/mybookings/mybookings'),
        Meta = require('stores/mybookings/meta')
        ;


module.exports = Form.extend({
    isolated: true,
    template: require('templates/guestticket/guestfilter.html'),
    components: {
        'layout': require('components/app/layout'),
        auth: require('components/app/auth'),
        guestbooking: require('components/guestticket/guestbooking'),
        details: require('components/mybookings/details'),
    },
    partials: {
        'base-panel': require('templates/app/layout/panel.html')
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