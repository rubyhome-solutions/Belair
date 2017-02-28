'use strict';

var _ = require('lodash'),
    moment = require('moment'),
    accounting = require('accounting.js'),
    page = require('page.js')
    ;

var Form = require('core/form'),
    Booking = require('stores/flight/booking'),
    Meta = require('stores/flight/meta')
    ;

var ROUTES = require('app/routes').flights;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/results/multicity.html'),

    components: {
        flights: require('./flights'),
        'multicity-summary': require('./multicity/summary')
    },

    data: function() {
        return _.extend({
            meta: Meta.object,
            active: 0,
            selected: [],
            percent: function(array) { return 100/array.length; },
            onSelect: function(flight, view) {
                var active = this.get('active'),
                    count = this.get('flights').length;

                view.set('selected', flight);

                if (-1 !== active) {
                    if (active < count - 1) {
                        this.set('active', active+1);
                    } else if (view.get('selected').length < count) {
                        var selected = this.get('selected');

                        for (var i = 0; i < count; i ++) {
                            if (!selected[i]) {
                                view.set('active', i);
                                break;
                            }
                        }
                    }
                }

                if (MOBILE && count == this.get('selected').length) {
                    this.book();
                }
            }.bind(this)
        }, require('helpers/flights'));
    },

    oncomplete: function() {
        $('.dropdown', this.el).dropdown();
        /* remove padding when number of flights are five. */
        $(document).on('click','.select_flight',function(){
        	if($('.fourteen .list .item').length == 5) {
        		$('.fourteen .list .item').css('padding-left','0px').css('padding-right','0px');
        	}
        });
    },

    book: function() {
        var view = this;

        Booking.create(_.map(this.get('selected'), function(i) { return i.get('system'); }), { cs: view.get('search.cs'), url: view.get('search.url'),cur:view.get('meta.display_currency') })
            .then(function(booking) {
                page(ROUTES.booking(booking.get('id')));
            });
    },

    modifySearch: function() {
        this.root.modifySearch();
    }
});