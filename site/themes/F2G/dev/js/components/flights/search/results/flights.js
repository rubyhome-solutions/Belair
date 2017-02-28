'use strict';

var _ = require('lodash'),
        moment = require('moment'),
        page = require('page')
        ;

var Form = require('core/form'),
        Meta = require('stores/flight/meta'),
        ROUTES = require('app/routes')
        ;

var t2m = function (time) {
    var i = time.split(':');

    return _.parseInt(i[0]) * 60 + _.parseInt(i[1]);
};

var sort = function (flights, sortOn) {
    var on = sortOn[0],
            asc = sortOn[1],
            data = flights.slice(),
            time = _.now();

    data = _.sortBy(
            data,
            function (i) {
                var value = i.get('price'),
                        s = i.get('segments.0');

                if ('airline' == on) {
                    value = _.trim(s[0].carrier.name).toLowerCase();
                }

                if ('depart' == on) {
                    value = s[0].depart.unix();
                }

                if ('arrive' == on) {
                    value = s[s.length - 1].arrive.unix();
                }

                return value;
            }
    );

    if (-1 == asc) {
        data.reverse();
    }


    return data;
};

var group = function (flights, sorton) {
    if (MOBILE) {
        return flights;
    }

    return _.values(_.groupBy(flights, function (i) {
        return 'nax_' + i.get(sorton[0]) + '_' + i.get('price');
    }));
};


module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/results/flights.html'),
    page: 1,
    loading: false,
    components: {
        flight: require('components/flights/search/results/flight')
    },
    data: function () {
        var first = true;

        return {
            direction: 1,
            flights: [],
            rendered: [],
            sorted: [],
            open: {},
            sortOn: ['price', 1],
            meta: Meta.object
        }
    },
    onconfig: function () {
        var view = this;

        this.observe('sortOn', function (sortOn) {
            view.sortFlights();
        }, {init: false});
        this.observe('flights', function (sortOn) {
            view.sortFlights();
        }, {init: false});
        this.sortFlights();
    },
    oncomplete: function () {
        this.parent.on('nextpage', function () {
            this.nextpage();
        });
    },
    nextpage: function () {
        var view = this;

        if (!view.loading) {
            view.loading = true;

            var add = view.get('sorted').slice(view.page * 10, (view.page + 1) * 10);
            if (add && add.length) {
                add.unshift('rendered');

                view.push.apply(view, add).then(function () {
                    view.page++;
                    view.loading = false;
                });

            } else {
                view.loading = false;
            }
        }
    },
    sortOn: function (on) {
        if (on == this.get('sortOn.0')) {
            this.set('sortOn.1', -1 * this.get('sortOn.1'));
        } else {
            this.set('sortOn', [on, 1]);
        }
    },
    sortFlights: function () {
        if (this.pending)
            return;

        this.pending = true;

        var view = this;
        this.set('rendered', null);


        if (view.get('search.domestic')) {
            var flights = sort(view.get('flights'), view.get('sortOn'));
        } else {
            var flights = group(sort(view.get('flights'), view.get('sortOn')), view.get('sortOn'));
        }


        view.set('sorted', flights);

        view.set('rendered', flights.slice(0, 10));
        view.page = 1;
        this.pending = false;
        /*
         * Refer : site/themes/B2C/dev/js/components/flights/search/results/roundtrip.js->onconfig()
         */
        if (Meta.object.AllCarrierRefresh) {
            Meta.object.AllCarrierRefresh();
        }
    },
    back: function () {
        page("/");
    }

});