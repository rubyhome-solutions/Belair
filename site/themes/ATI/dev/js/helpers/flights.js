'use strict';

var _ = require('lodash')
    ;

var money = require('helpers/money');

module.exports = {
    duration: require('helpers/duration')(),
    money: money,

    itinerary: function(flight) {
        var s = flight.get('segments.0');

        return [s[0].from.airportCode, s[s.length-1].to.airportCode].join('&mdash;');
    },

    times: function(flights) {
        return [flights[0].depart_at.format('D MMM, YYYY'), flights[flights.length-1].depart_at.format('D MMM, YYYY')].join('-');
    },

    canbook: function(a, b) {
        var ok = true;
        for (var i = 0; i < b.length; i++) {
            if (!a[i])
                ok = false;
        }


        return ok;
    },

    price: function(selected) {
        var price = 0;

        _.each(selected, function(i) { if (i) price += i.get('price'); });

        return price;
    },

    discount: function(selected) {
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
                    discount = backward.groupings[groupings[0]].discount;
                } else {
                    discount = onward.price + backward.price
                        - onward.groupings[groupings[0]].price - backward.groupings[groupings[0]].price
                }
                if(discount <= 100) {
                    discount = 0;
                } 
                return discount;
            }
        }



    }
};
