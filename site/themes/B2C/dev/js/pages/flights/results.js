'use strict';

var page = require('page.js');

var Page = require('components/page'),
    Search = require('stores/flight/search'),
    Flight = require('stores/flight'),
    Filter = require('stores/flight/filter'),
    Meta = require('stores/flight/meta')
    ;

var ROUTES = require('app/routes').flights;

module.exports = Page.extend({
    template: require('templates/pages/flights/results.html'),

    components: {
        'results': require('components/flights/search/results'),

        'modify-single': require('components/flights/search/modify/single'),
        'modify-multicity': require('components/flights/search/modify/multicity'),

        'filter': require('components/flights/search/filter'),
        'search-form': require('components/flights/search/form')
    },

    data: function() {
        return {
            minpanel: true,

            force: false,

            pending: 1,
            search: null,
            flights: [],

            meta: Meta.object
        }
    },

    onconfig: function() {
        var view = this;

        this.pending = setInterval(function() {
            if (view.get('pending') >= 100) {
                view.set('pending', 0);
            }

            view.set('pending', Math.min(100, view.get('pending') + 0.25));
        }, 41);

        Search.load(this.get('url'), this.get('force'), this.get('cs'))
            .then(function(search) { view.set('search', search); view.fetchFlights(search); })
            .fail(function() { page(ROUTES.search) });
    },

    oncomplete: function() {
        $(window).scrollTop(0);

        if (MOBILE) {
            var open = false;
            $('#m_menu').sidebar({ onHidden: function() { $('#m_btn').removeClass('disabled');  }, onShow: function() { $('#m_btn').addClass('disabled');  }});

            $('#filter', this.el).on('click.layout',function(){
                if (!$(this).hasClass('disabled')) {
                    $('#m_menu').sidebar('show');
                }

            });
        }
    },

    fetchFlights: function(search) {
        var view = this;

        Flight.fetch(search)
            .progress(function(res) { view.set('flights', res.flights); })
            .then(function(res) { clearInterval(view.pending); view.finalize(search, res); });
    },

    finalize: function(search, res) {
        var view = this,
            filter = Filter.factory(search, res.flights);


        this.set({ pending: false, flights: res.flights, filter: filter });

        if (Search.ROUNDTRIP == search.get('tripType')) {
            this.set('prices', res.prices);
        }

        filter.observe('flights', function(flights) { view.set('flights', flights); }, {init: false});


        if (!MOBILE && window.localStorage) {
            try {
                var segments = res.flights[0][0].segments,
                    from = segments[0][0].from,
                    to = segments[0][segments[0].length-1].to,
                    clone = search.toJSON();

                //console.log('ffff', segments, from, to);

                if (from && to) {
                    var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];
                    recent.unshift({from: from, to: to, search: clone});

                    window.localStorage.setItem('searches', JSON.stringify(recent.slice(0,5)));
                }
            } catch (e) {
                // not a big deal
            }

        }
    },

    modifySearch: function() {
        if (MOBILE) {
            page(ROUTES.search);
        } else {
            this.set('modify', null);
            this.set('modify', Search.parse(this.get('search').toJSON()));
        }


    }
});