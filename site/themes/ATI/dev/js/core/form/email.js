'use strict';

var mailcheck = require('mailcheck');

var Input = require('./input');

module.exports = Input.extend({
    data: function() {
        return {
            type: 'email'
        };
    },

    oncomplete: function() {
        this._super();

        var view = this;
        $(this.find('input'))
            .on('blur', function() {
                $(this).mailcheck({
                    suggested: function(element, suggestion) {
                        view.set('suggestion', suggestion);
                    },
                    empty: function(element) {
                        view.set('suggestion', null);
                    }
                });
            });
    },

    correct: function() {
        this.set('value', this.get('suggestion.full'));
        this.set('suggestion', null);
    }
});