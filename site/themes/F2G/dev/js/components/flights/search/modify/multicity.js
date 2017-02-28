'use strict';

var Form = require('core/form'),
    _ = require('lodash'),
    moment = require('moment')
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/modify/multicity.html'),


    data: function() {
        return {
            itinerary: function(flight) {
                if (!flight)
                    return;

                var s = flight.get('segments.0');

                return [s[0].from.airportCode, s[s.length-1].to.airportCode].join('-');
            },

            times: function(flights) {
                return [flights[0].depart_at.format('D MMM, YYYY'), flights[flights.length-1].depart_at.format('D MMM, YYYY')].join('-');
            }
        };
    },

    modifySearch: function() {
        this.root.modifySearch();
    }
});