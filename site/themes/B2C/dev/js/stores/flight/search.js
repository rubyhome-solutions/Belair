'use strict';

var _ = require('lodash'),
    Q = require('q'),
    $ = require('jquery'),
    moment = require('moment')
    ;

var Store = require('core/store')
    ;

var ROUTES = require('app/routes').flights;

var Search = Store.extend({
    data: function() {
        return {
            domestic: 1,
            tripType: Search.ONEWAY,
            cabinType: Search.ECONOMY,
            flights: [ { from: Search.DEL, to: Search.BOM, depart_at: moment().add(1, 'day'), return_at: null } ],

            passengers: [1, 0, 0],

            loading: false
        }
    },

    onconfig: function() {
        this.observe('domestic', function(domestic) {
            if (!domestic && Search.MULTICITY == this.get('tripType')) {
                this.set('tripType', Search.ONEWAY);
            }

            if (domestic) {
                this.set('flights', [{ from: Search.DEL, to: Search.BOM, depart_at: moment().add(1, 'day') }]);
            } else {
                this.set('flights', [{ from: null, to: null, depart_at: moment().add(1, 'day') }]);
            }

        }, { init: false });

        this.observe('tripType', function(value, old) {
            if (Search.MULTICITY == value) {
                this.splice('flights', 1, 0, { from: null, to: null, depart_at: null });
            }

            if (Search.MULTICITY == old) {
                this.set('flights', [this.get('flights.0')]);
            }

            if (Search.ROUNDTRIP == old)  {
                this.set('flights.0.return_at', null);
            }

        }, { init: false });
    },

    removeFlight: function(i) {
        this.splice('flights', i, 1);
    },

    addFlight: function() {
        this.push('flights', {});
    },

    toJSON: function() {
        var form = this;

        return {
            cs: this.get('cs'),
            domestic: this.get('domestic'),
            tripType: this.get('tripType'),
            cabinType: this.get('cabinType'),
            passengers: this.get('passengers'),

            flights: _.map(this.get('flights'), function(flight) {
                return {
                    from: flight.from,
                    to: flight.to,
                    depart_at: moment.isMoment(flight.depart_at) ? flight.depart_at.format('YYYY-MM-DD') : null,
                    return_at: 2 == form.get('tripType')
                        ? (moment.isMoment(flight.return_at) ? flight.return_at.format('YYYY-MM-DD') : null)
                        : null
                };
            })
        };
    }
});

Search.MULTICITY = 3;
Search.ROUNDTRIP = 2;
Search.ONEWAY = 1;

Search.DEL = 1236;
Search.BOM = 946;

Search.ECONOMY = 1;
Search.PERMIUM_ECONOMY = 2;
Search.BUSINESS = 3;
Search.FIRST = 4;

Search.MAX_WAIT_TIME = 60000;
Search.INTERVAL = 5000;

Search.load = function(url, force, cs) {
    cs = cs || null;

    return Q.Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: ROUTES.search,
            data: { query: url, force: force || 0, cs: cs },
            dataType: 'json',
            success: function(data) { resolve(Search.parse(data)); },
            error: function(xhr) {
                try {
                    //alert(xhr.responseText);
                    reject(JSON.parse(xhr.responseText))
                } catch (e) {
                    reject(false);
                }
            }
        });
    });
};

Search.parse = function(data) {
    data.flights = _.map(data.flights, function(i) {
        i.depart_at = moment(i.depart_at);
        i.return_at = i.return_at && moment(i.return_at);

        return i;
    });

    var search = new Search({data: data});


    return search;
};


module.exports = Search;