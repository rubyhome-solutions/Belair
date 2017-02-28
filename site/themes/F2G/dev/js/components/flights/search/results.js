'use strict';

var Form = require('core/form'),
    _ = require('lodash'),
    moment = require('moment')
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/results.html'),

    components: {
        'results-oneway': require('components/flights/search/results/oneway'),
        'results-roundtrip': require('components/flights/search/results/roundtrip'),
        'results-multicity': require('components/flights/search/results/multicity')
    },

    data: function() {
        return {
        };
    },

    oncomplete: function() {
        var view = this;

        $(window).on('scroll.results', function() {
            if( ($(window).scrollTop() + $(window).height() >= $(document).height()*0.8  ) ) {
                _.each(view.findAllComponents('flights'), function(flights) {
                   flights.nextpage();
                });
            }
        });
    },

    onteardown: function() {
        $(window).off('scroll.results');
    }
});