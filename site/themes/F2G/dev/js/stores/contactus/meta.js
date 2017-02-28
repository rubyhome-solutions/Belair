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
        return {};
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
        $.getJSON('/b2c/contactus/meta')
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

module.exports = Meta;
