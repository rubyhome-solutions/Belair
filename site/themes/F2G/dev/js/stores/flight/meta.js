'use strict';

var _ = require('lodash'),
    Q = require('q'),
    $ = require('jquery')
    ;

var View = require('core/store')
    ;

var Meta = View.extend({
    data: function() {
        var view = this;

        var countries;

        return {
            select: {
                titles: function() { return _.map(view.get('titles'), function(i) { return { id: i.id, text: i.name }; }); },
                cabinTypes: function() { return _.map(view.get('cabinTypes'), function(i) { return { id: i.id, text: i.name }; }); },
                domestic: function() {
                    return _.map(view.get('domestic'), function(i) { return { id: i.id, text: i.city_name + ' (' + i.airport_code + ')' }; });
                },
                countries: function() {
                    if (!countries) {
                        countries =  _.map(view.get('countries'), function(i) { return { id: i.id, text: i.name }; });
                    }

                    return countries;
                }
            },

            airport: function(id) {
                return _.find(view.get('domestic'), { id: _.parseInt(id) });
            }
        }
    }

});

Meta.parse = function(data) {
    var meta = new Meta();
    meta.set(data);
    
    meta.set('display_currency', 'INR');

    return meta;
};

Meta.fetch = function() {
    return Q.Promise(function(resolve, reject) {
        $.getJSON('/b2c/flights/meta')
            .then(function(data) { resolve(Meta.parse(data)); })
            .fail(function(data) {
                //TODO: handle error
            });
    });
};



Meta.object = null;
Meta.instance = function() {
    return Q.Promise(function(resolve, reject) {
        if (Meta.object) {
            resolve(Meta.object);
            return;
        }

        Meta.fetch().then(function(meta) {
            Meta.object = meta;
            resolve(meta);
        });
    });
};
Meta.parseQuery = function(qstr) {
    var query = {};
    var a = qstr.split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}
module.exports = Meta;