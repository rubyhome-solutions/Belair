'use strict';

require('jquery.payment');

var Input = require('../input'),
    $ = require('jquery');

module.exports = Input.extend({
    data: function() {
        return {
             type: 'tel'
           // type: 'password'
        };
    },

    oncomplete: function() {
        this._super();
        $(this.find('input')).payment('formatCardCVC');
        
    },

    onteadown: function() {
        $(this.find('input')).payment('destroy');
    }
});