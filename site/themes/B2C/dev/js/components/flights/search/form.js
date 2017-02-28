'use strict';

var page = require('page.js'),
    moment = require('moment')
    ;

var Form = require('core/form'),
    Search = require('stores/flight/search_custom'),
    Meta = require('stores/flight/meta')
    ;

var ROUTES = require('app/routes').flights;
// console.log(ROUTES);

module.exports = Form.extend({
    template: require('templates/flights/search/form.html'),

    components: {
        'ui-spinner': require('core/form/spinner'),
        'ui-airport': require('components/flights/airport'),
        'ui-calendar': require('core/form/calendar')
    },

    data: function() {
        // var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];
        
        return {
            meta: Meta.object,
            moment: moment,
            // search: new Search(),
            // recent: _.map(recent, function(i) { return moment(i.search.flights[0].depart_at) ? i : null; })      
        }
    },

    onconfig: function() {
        // console.log('META: ', META.object);
        this.on('next', function(view) {
            //TODO: think of better way to handle this
            $(this.find('form')).click();

            if (this.get('modify') && !this.get('search.domestic')) {
                return;
            }

            if (view.get('next')) {
                console
                var next = view.get('next').split('-');

                if ('to' == next[0]) {
                    $(this.find('.' + view.get('next') + ' input.search')).click().focus();
                }

                if ('depart' == next[0]) {
                    $('.' + view.get('next')).focus();
                }

                if ('return' == next[0]) {
                    $('.' + view.get('next')).focus();
                }
            }
        });
    },

    oncomplete: function() {
        if (MOBILE) {
            var open = false;
            $('#m_menu').sidebar({ onHidden: function() { $('#m_btn').removeClass('disabled');  }, onShow: function() { $('#m_btn').addClass('disabled');  }});
            $('.dropdown').dropdown();

            $('#m_btn', this.el).on('click.layout',function(){
                if (!$(this).hasClass('disabled')) {
                    $('#m_menu').sidebar('show');
                }

            });

            $('.pusher').one('click', function(e) {
                e.stopPropagation();
            });

        }

        if (this.get('modify')) {
            this.set('open', true);

            this.set('search.flights', this.get('search.flights'));

            $(this.find('.ui.modal')).modal('show');

        }
    },

    onteardown: function() {
      this.set('modify', null);
    },

    toggleRoundtrip: function() {
        if (2 !== this.get('search.tripType')) {
            this.set('search.tripType', 2);
        }
    },

    addTraveler: function(type) {
        var value = this.get('search.passengers.' + type);

        if (value < 9) {
            this.set('search.passengers.' + type, value + 1);
        }
    },

    removeTraveler: function(type) {
        var value = this.get('search.passengers.' + type);

        if (value > 0) {
            this.set('search.passengers.' + type, value - 1);
        }
    },

    removeFlight: function(i) { this.get('search').removeFlight(i); },
    addFlight: function() { this.get('search').addFlight(); },

    submit: function() {
        var view = this;
        this.post(ROUTES.search, this.serialize())
            .then(function(search) {
                if (view.get('modify')) {
                    $(view.find('.ui.modal')).modal('hide');
                }

                page(search.url);
            });
    },

    serialize: function() { return this.get('search').toJSON(); }
	
});