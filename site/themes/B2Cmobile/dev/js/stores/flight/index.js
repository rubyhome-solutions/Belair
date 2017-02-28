'use strict';

var _ = require('lodash'),
    $ = require('jquery'),
    moment = require('moment'),
    Q = require('q')
    ;

var Store = require('core/store'),
    Search = require('./search'),
    ROUTES = require('app/routes').flights
    ;

var Flight = Store.extend({
    data: function() {
        return {
            segments: [],
            price: null,
            refundable: 0,


            first: function(segments) { return segments[0]; },
            last: function(segments) { return segments[segments.length-1]; },
            stops: function(segments) {
                return segments.length-1;
            },
            segtime: function(segments) {
                if (!segments)
                    return null;

                var time = moment.duration();

                _.each(segments, function(i) {
                    time.add(i.time);
                    time.add(i.layover);
                });

                return time;
            },

            via: function(segments) {
                if (!segments)
                    return null;

                if (segments.length > 1) {
                    return _.map(segments.slice(1), function(i) {
                        return i.from;
                    });
                }

                return null;
            }
        };
    },

    computed: {
        depart: function() {
            return this.get('segments.0.0.depart');
        },

        arrive: function() {
            return this.get('segments.0.' + (this.get('segments.0.length') - 1) + '.arrive');
        },

        itinerary: function() {
            var s = this.get('segments.0');

            return [s[0].from.airportCode, s[s.length-1].to.airportCode].join('-');
        },

        carriers: function() {
            return _.unique(
                _.union.apply(null,
                    _.map(this.get('segments'), function(segments) {
                        return _.map(segments, function(i) { return i.carrier; });
                    })
                ),
                'code'
            );
        }
    }
});

Flight.parse = function(data) {
    data.id = _.uniqueId('flight_');
    data.time = moment.duration();
    data.segments = _.map(data.segments, function(segments) {
        return _.map(segments, function(i) {
            var segment = _.extend(i, {
                depart: moment(i.depart),
                arrive: moment(i.arrive),
                time: moment.duration(i.time),
                layover: moment.duration(i.layover)
            });

            data.time = data.time.add(segment.time).add(segment.layover);

            return segment;
        });
    });

    return new Flight({data: data});
};

Flight.fetch = function(search, deferred) {
    deferred = deferred || Q.defer();


    if (!deferred.started) {
        deferred.started = _.now();
        deferred.updated = null;
        deferred.flights = Search.ROUNDTRIP == _.parseInt(search.get('tripType')) ? [[], []] : _.map(search.get('flights'), function() { return []; });

        console.log('constructed flights', deferred.flights, search.get('flights'));
    } else if (_.now() - deferred.started > Search.MAX_WAIT_TIME) {
        deferred.resolve({ search: search, flights: deferred.flights});
    }

    $.ajax({
        type: 'GET',
        url: ROUTES.search,
        data: { ids: search.get('ids'), options: search.toJSON(), updated: deferred.updated },
        dataType: 'json',
        complete: function() {
            //console.log('response time', _.now() - time);
        },
        success: function(data) {
            var flights = _.map(data.flights, function(flights) {
                return _.map(flights, function(flight) { return Flight.parse(flight) });
            });

            deferred.notify({ search: search, deferred: deferred, flights: flights});

            _.each(deferred.flights, function(v, k) {
                if (flights[k])
                    deferred.flights[k] = _.union(v, flights[k]);
            });


            if (data.pending) {
                deferred.updated = data.updated;
                setTimeout(function() { Flight.fetch(search, deferred); }, Search.INTERVAL);
            } else {
                deferred.resolve({ search: search, flights: deferred.flights, prices: data.prices || null});
            }

        },
        error: function(xhr) {
            try {
                reject(JSON.parse(xhr.responseText))
            } catch (e) {
                reject(false);
            }
        }
    });


    return deferred.promise;
};

module.exports = Flight;