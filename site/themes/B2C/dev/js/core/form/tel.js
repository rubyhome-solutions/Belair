'use strict';

require('intl-tel-input/build/js/intlTelInput');

var $ = require('jquery');

var Input = require('./input');

module.exports = Input.extend({
    
    oncomplete: function() {
        this._super();


        var view = this,
            input = $(this.find('input'))
            ;


        input.intlTelInput({
            autoPlaceholder: false,
            preferredCountries: ['in','us','gb','ru'],
            nationalMode: false
        });
        /*
        input.on('keydown', function(e) {
            e.preventDefault();
        });*/
    },

    onteadown: function() {
        $(this.find('input')).intlTelInput('destroy');
    }
});