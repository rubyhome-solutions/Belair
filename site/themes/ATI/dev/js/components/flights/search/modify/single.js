'use strict';

var Q = require('q'),
    _ = require('lodash'),
    moment = require('moment'),
    page = require('page')
    ;

var Form = require('core/form'),
    Search = require('stores/flight/search')
    ;

var ROUTES = require('app/routes').flights;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/modify/single.html'),

    components: {
        'ui-spinner': require('core/form/spinner'),
        'ui-airport': require('components/flights/airport')
    },

    data: function() {
        return {
            moment: moment
        };
    },

    onconfig: function() {
        this.set('search', Search.parse(this.get('modify').toJSON()));
    },

    oncomplete: function() {
        var view = this,
            popup = $(this.find('.extended.popup')),
            fn = $(this.find('.extended.dropdown'))
                .popup({
                    position : 'bottom right',
                    popup: $(this.find('.extended.popup')),
                    on: null,
                    prefer: 'opposite',
                    closable: false
                })
                .on('click', function(e) {
                    e.stopPropagation();
                    fn.popup('show');
                    popup.on('click.modify-search', function(e) {
                        e.stopPropagation();
                    });

                    $(document).on('click.modify-search', function(e) {
                        fn.popup('hide');
                        $(document).off('click.modify-search');
                        popup.off('click.modify-search');

                    });
                })
            ;
    },

    submit: function() {
        this.post(ROUTES.search, this.serialize())
            .then(function(search) { page(search.url); });
    },

    serialize: function() { return this.get('search').toJSON(); }

});