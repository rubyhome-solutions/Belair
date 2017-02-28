'use strict';

var _ = require('lodash'),
    moment = require('moment')
    ;

var Form = require('core/form'),
    Booking = require('stores/flight/booking'),
    Meta = require('stores/flight/meta')
    ;


var money = require('helpers/money'),
    duration = require('helpers/duration')(),
    discount = require('helpers/flights').discount;


var data = {
    hasGroupings: function() {
        if (this.get('flight.groupings')) {
            return this.get('flight.groupings').length || _.keys(this.get('flight.groupings')).length;
        }

        return false;
    },

    discount: discount,

    $: money,
    duration: duration
};


module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/results/flight.html'),

    components: {
        flight: this,
        itinerary: require('components/flights/itinerary')
    },

    data: function() {
        return data;
    },

    onconfig: function() {
        this.set('meta', Meta.object);
    },

    oncomplete: function() {
    	$(this.find('.price > .amount'))
        .popup({
            position : 'bottom right',
            popup: $(this.find('.fare.popup')),
            on: 'hover'
        });
    $(this.find('.airport_change_mouse'))
        .popup({
            position : 'top left',
            popup: $(this.find('.airport_change.popup')),
            on: 'hover'
        });
    $(this.find('.transit_visa_mouse'))
        .popup({
            position : 'top left',
            popup: $(this.find('.transit_visa.popup')),
            on: 'hover'
        });
    $(this.find('.short_layover_mouse'))
        .popup({
            position : 'top left',
            popup: $(this.find('.short_layover.popup')),
            on: 'hover'
        });
    $(this.find('.long_layover_mouse'))
        .popup({
            position : 'top left',
            popup: $(this.find('.long_layover.popup')),
            on: 'hover'
        });
    },

    toggleDetails: function() {
        this.toggle('details');
    },
toggleMobile: function() {
		this.toggle('toggle_flight_details');
	},
    select: function() {
        if (this.get('flight.id') === this.get('selected.id')) {
            this.set('selected', null);
            return;
        }

        var fn = this.get('selectFn');        
        if (_.isFunction(fn)) {
            
            fn(this.get('flight'), this);
        }
    },

    click: function() {
        if (this.get('summary')) {
            this.select();
        }
    }

});