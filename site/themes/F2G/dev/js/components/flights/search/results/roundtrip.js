'use strict';

var _ = require('lodash'),
        $ = require('jquery'),
        page = require('page.js')
        ;

var Form = require('core/form'),
        Booking = require('stores/flight/booking'),
        Meta = require('stores/flight/meta')
        ;

var ROUTES = require('app/routes').flights;


var money = require('helpers/money');

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/results/roundtrip.html'),
    components: {
        flights: require('./flights'),
        flight: require('./flight')
    },
    data: function () {
        return _.extend({
            meta: Meta.object,
            carrier: -1,
            selected: [],
            count: function (flights) {
                return _.sum(_.map(flights, function (i) {
                    return i.length;
                }));
            },
            carriers: function (carriers, prices) {
                return _.map(_.cloneDeep(carriers), function (i) {
                    i.price = prices[i.code] || null;
                    return i;
                }).sort(function (a, b) {
                    var ap = a.price || 999999999, bp = b.price || 999999999;

                    if (ap == bp)
                        return 0;
                    return ap > bp ? 1 : -1;
                })
            },
            onSelect: function (flight, view) {
                view.set('selected', flight);

                if (MOBILE && 2 == this.get('selected').length) {
                    this.book();
                }
            }.bind(this)
        }, require('helpers/flights'));
    },
    onconfig: function () {
        var view = this;
        /**
         * Added By Satender
         * Purpose : To refresh roundtrip Group Carrier Issue
         * Used File : site/themes/B2C/dev/js/components/flights/search/results/flights.js - LN 153
         */
        Meta.object.set('AllCarrierRefresh', function () {
            var carriers = [];

            _.each(view.get('flights'), function (flights) {
                _.each(flights, function (flight) {
                    carriers[carriers.length] = flight.get('segments.0.0.carrier');
                });
            });

            view.set('allcarriers', _.unique(carriers, 'code'));
			var width_div = parseInt(0),
		            relative_width = parseInt($('.flights-results form').width()),
		            final_width;
		    $.each($('.makeScrollable').children(), function () {
		        width_div = width_div + $('.makeScrollable').children().width();
		    });
		    width_div = parseInt(width_div);
		    /* convert width into % */
		    final_width = (((100 * width_div) / relative_width) * 2) + "%";
		    $('.makeScrollable').width(final_width);
        });
       },
    oncomplete: function () {
        $(window).on('resize.roundtrip', function () {
            var width = $('.flights-grid', this.el).width();

            $('.flights-grid > tbody > tr > td', this.el).width(width / 2);
        }.bind(this));

        $('.dropdown', this.el).dropdown();
    },
     book: function () {
        var view = this,
                selected = this.get('selected');

        if (2 == selected.length && selected[0] && selected[1]) {
            var onward = selected[0].get(),
                    backward = selected[1].get(),
                    groupings = _.intersection(
                            onward.system.gds ? onward.groupings : _.keys(onward.groupings),
                            _.keys(backward.groupings)
                            ),
                    discount
                    ;

            if (groupings.length) {
                if (onward.system.gds) {
                    Booking.create([backward.groupings[groupings[0]].system], {cs: view.get('search.cs'), url: view.get('search.url'), cur: view.get('meta.display_currency')})
                            .then(function (booking) {
                                page(ROUTES.booking(booking.get('id')));
                            });

                    return;
                } else {
                    var booking = onward.groupings[groupings[0]].system;

                    booking.rcs.push(backward.groupings[groupings[0]].system.rcs[0]);

                    Booking.create([booking], {cs: view.get('search.cs'), url: view.get('search.url'), cur: view.get('meta.display_currency')})
                            .then(function (booking) {
                                page(ROUTES.booking(booking.get('id')));
                            });
                    return;
                }

            }
            Booking.create(_.map(this.get('selected'), function (i) {
                return i.get('system');
            }), {cs: view.get('search.cs'), url: view.get('search.url'), cur: view.get('meta.display_currency')})
                    .then(function (booking) {
                        page(ROUTES.booking(booking.get('id')));
                    });
        }
    },
    showCarrier: function (code) {
        this.set('carrier', code);
        this.get('filter').set('filtered.carriers', -1 == code ? false : [code]);

    },
    modifySearch: function () {
        this.root.modifySearch();
    }
});