'use strict';

var Page = require('components/page'),
    Meta = require('stores/flight/meta')
    ;

module.exports = Page.extend({
    template: require('templates/pages/flights/booking.html'),

    components: {
        'booking': require('components/flights/booking')
    },

    data: function() {
        return {
            meta: Meta.object
        }
    },

    oncomplete: function() {
        $(window).scrollTop(0);
    }
});