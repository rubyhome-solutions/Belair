'use strict';

var Form = require('core/form'),
    _ = require('lodash'),
    moment = require('moment'),
    page = require('page.js')
    ;

var Booking = require('stores/flight/booking'),
    Meta = require('stores/flight/meta')
    ;

var ROUTES = require('app/routes').flights;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/results/oneway.html'),

    components: {
        flights: require('./flights')
    },

    data: function() {
        var view = this;

        return {
            meta: Meta.object,
            active: 0,
            onSelect: function(flight) {

                Booking.create([flight.get('system')], { cs: view.get('search.cs'),  url: view.get('search.url'),cur:view.get('meta.display_currency') })
                    .then(function(booking) {
                        page(ROUTES.booking(booking.get('id')));
                    });
            }
        };
    },

    oncomplete: function() {
        $('.dropdown', this.el).dropdown();
    },

    modifySearch: function() {
        this.root.modifySearch();
    }
});