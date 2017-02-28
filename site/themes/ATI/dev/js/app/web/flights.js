var $ = require('jquery'),
    page = require('page')
    ;

var Meta = require('stores/flight/meta'),
    SearchForm = require('pages/flights/search'),
    SearchResults =  require('pages/flights/results'),
    Booking =  require('pages/flights/booking')
    ;

require('web/modules/flights.less');
require('web/modules/booking.less');

var actions = {
    form: function(ctx, next) {
        (new SearchForm()).render('#app').then(function() { next(); });
    },
    search: function(ctx, next) {
        var query = Meta.parseQuery(ctx.querystring);

        (new SearchResults({data: { url: ctx.params[0], force: query.force || false, cs: query.cs || null }})).render('#app').then(function() { next(); });
    },
    booking: function(ctx, next) {
        (new Booking({ data: { id: ctx.params.id }})).render('#app').then(function() { next(); });
    }
};

Meta.instance().then(function(meta) {
    page('/b2c/booking/:id', actions.booking);
    page('/b2c/flights', actions.form);
    page('/b2c/flights/search', actions.form);
    page(/\/b2c\/flights\/search\/(.*)/, actions.search);


    page({click: false});
});