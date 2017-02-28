'use strict';

var _ = require('lodash'),
    moment = require('moment')
    ;

var Form = require('core/form'),
    Search = require('stores/flight/search'),
    Meta = require('stores/flight/meta'),
    Auth = require('components/app/auth')
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/index.html'),

    components: {
        'layout': require('components/app/layout'),
        'search-form': require('components/flights/search/form'),
        'search-results': require('components/flights/search/results'),
        'filter': require('components/flights/search/filter'),
        'booking': require('components/flights/booking')
    },

    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },

    data: function() {
        return {
            leftmenu: false,
            moment: moment
        }
    },

    onconfig: function() {
        var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];

        this.set('recent', _.map(recent, function(i) { return moment(i.search.flights[0].depart_at) ? i : null; }));
    },

    signin: function() {
        var view = this;
        Auth.login()
            .then(function(data) {
                view.set('meta.user', data);
            });
    },

    signup: function() {
        Auth.signup();
    },


    leftMenu: function() {
        this.toggle('leftmenu');
        //var flag=this.toggle('leftmenu'); this.set('leftmenu', !flag);
    },

    modifySearch: function() {
        this.set('modify', null);
        this.set('modify', this.get('search').clone());
    },

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