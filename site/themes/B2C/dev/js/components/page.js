'use strict';

var Component = require('core/component'),
    Auth = require('components/app/auth'),
    _ = require('lodash'),
    moment = require('moment')
    ;

module.exports = Component.extend({
    isolated: true,

    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },

    components: {
        layout: require('components/app/layout')
    },

    signin: function() { Auth.login().then(function(data) { window.location.reload() }); },

    signup: function() { Auth.signup(); },

    leftMenu: function() { this.toggle('leftmenu'); },
    
    swapSearch: function(search) {
        var view = this;
        search = _.cloneDeep(search);
        _.each(search.flights, function(i, k) {
            i.depart_at = moment(i.depart_at);

            if (i.return_at) {
                i.return_at = moment(i.return_at);
            }
        });

        search.saved = true;


        this.get('search').set(search).then(function() {
            view.set('search.saved', false);
        });
    }
});
