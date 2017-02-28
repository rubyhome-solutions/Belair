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

        return {
            
        }
    }

});

Meta.parse = function(data) {
    return new Meta({data: data});
};

Meta.fetch = function() {
    return Q.Promise(function(resolve, reject) {
        $.getJSON('/b2c/traveler/meta')
            .then(function(data) { resolve(Meta.parse(data)); })
            .fail(function(data) {
                //TODO: handle error
            });
    });
};

var instance = null;
Meta.instance = function() {
    return Q.Promise(function(resolve, reject) {
        if (instance) {
            resolve(instance);
            return;
        }

        instance = Meta.fetch();
        resolve(instance);

    });
};

module.exports = Meta;