'use strict';

var _ = require('lodash'),
    moment = require('moment')
    ;

var Page = require('components/page'),
    Search = require('stores/flight/search'),
    Meta = require('stores/flight/meta1')
    ;

module.exports = Page.extend({
    template: require('templates/pages/flights/search.html'),

    components: {
        'search-form': require('components/flights/search/form1')
    },

    data: function() {
        var recent = JSON.parse(window.localStorage.getItem('searches') || null) || [];
        // console.log("META: ", Meta.object);
        return {
            search: new Search(),
            meta: Meta.object,
            moment: moment,
            // recent: _.map(recent, function(i) { return moment(i.search.flights[0].depart_at) ? i : null; })
        }
    }
});