'use strict';

var _ = require('lodash');

var Store = require('core/store'),
        Search = require('stores/flight/search')
        ;

var t2m = function (time) {
    var i = time.split(':');
    return _.parseInt(i[0]) * 60 + _.parseInt(i[1]);
};

var filter = function (flights, filtered, backward) {
    backward = backward || false;

    var f = _.cloneDeep(filtered),
            layover = f.layover ? [t2m(f.layover[0]), t2m(f.layover[1])] : null,
            arrive, departure
            ;

    if (!backward) {
        arrive = f.arrival ? [t2m(f.arrival[0]), t2m(f.arrival[1])] : null;
        departure = f.departure ? [t2m(f.departure[0]), t2m(f.departure[1])] : null;
    } else {
        arrive = f.arrival2 ? [t2m(f.arrival2[0]), t2m(f.arrival2[1])] : null;
        departure = f.departure2 ? [t2m(f.departure2[0]), t2m(f.departure2[1])] : null;
    }

    return _.filter(flights.slice(), function (i) {
        var ok = true,
                s = i.get('segments.0');

        if (f.prices && !_.inRange(i.get('price'), f.prices[0] - 0.001, f.prices[1] + 0.001)) {
            return false;
        }

        if (f.carriers && -1 == _.indexOf(f.carriers, s[0].carrier.code)) {
            return false;
        }

        if (f.stops) {
            for (var j = 0, l = i.get('segments').length; j < l; j++) {
                if (-1 == _.indexOf(f.stops, i.get('segments.' + j).length - 1)) {
                    return false;
                }
            }
        }

        if (departure && !_.inRange(t2m(s[0].depart.format('HH:mm')), departure[0] - 0.001, departure[1] + 0.001)) {
            return false;
        }

        if (arrive && !_.inRange(t2m(s[s.length - 1].arrive.format('HH:mm')), arrive[0] - 0.001, arrive[1] + 0.001)) {
            return false;
        }

        if (layover) {
            ok = true;
            _.each(i.get('segments'), function (segments) {
                _.each(segments, function (segment) {
                    if (
                            segment.layover &&
                            !_.inRange(segment.layover.asMinutes(), layover[0] - 0.001, layover[1] + 0.001)
                            ) {
                        ok = false;
                    }
                });
            });

            return ok;
        }

        if (f.refundable && 2 != _.parseInt(i.get('refundable'))) {
            return false;
        }

        return true;
    });
};

var Filter = Store.extend({
    timeout: null,
    onconfig: function () {
        //this.observe('filtered', function(filtered) { this.filter(); }, {init: false});
    },
    filter: function (only) {
        //console.log('filtering nax');

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        setTimeout(function () {
            this.doFilter();
        }.bind(this), Filter.TIMEOUT)
    },
    doFilter: function () {
        var filtered = this.get('filtered');
        //console.log(this.get('onlyMe'));
        if (Search.ROUNDTRIP == this.get('tripType') && this.get('domestic')) {
            this.set('flights', [filter(this.get('original.0'), filtered), filter(this.get('original.1'), filtered, true)])
        } else {
            this.set('flights', _.map(this.get('original'), function (flights) {
                return filter(flights, filtered);
            }));
        }


    }
});

Filter.TIMEOUT = 300;

Filter.factory = function (search, results) {
    var filter = new Filter(),
            prices = [],
            carriers = [],
            stops = 0,
            temp_carrier = [],
            i = 0;
    _.each(results, function (flights) {
        _.each(flights, function (flight) {
            var _carrier = flight.get('segments.0.0.carrier'),
                    _price = flight.get('price');
            prices[prices.length] = _price;
            if (i == 0 ||
                    typeof carriers[_carrier.code] == 'undefined' ||
                    carriers[_carrier.code].code != _carrier.code ||
                    _price < carriers[_carrier.code].price)
            {
                _carrier.price = _price;
                carriers[_carrier.code] = _carrier;
            }
            _.each(flight.get('segments'), function (segments) {
                stops = Math.max(stops, segments.length - 1);
            });
            i++;
        });
    });
    for (var i in carriers) {
        temp_carrier[temp_carrier.length] = carriers[i];
    }
    carriers = temp_carrier;

    filter.set({
        domestic: search.get('domestic'),
        tripType: search.get('tripType'),
        stops: _.range(0, stops + 1),
        prices: [Math.min.apply(null, prices), Math.max.apply(null, prices)],
        carriers: carriers,
        filtered: {carriers: _.map(carriers, function (i) {
                return i.code;
            }), stops: _.range(0, stops + 1)},
        flights: results,
        original: results
    });
    return filter;
};
module.exports = Filter;