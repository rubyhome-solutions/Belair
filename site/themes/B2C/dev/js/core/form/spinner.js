'use strict';

var Component = require('core/component'),
    $ = require('jquery'),
    _ = require('lodash')
    ;

var
    LARGE = 'large',
    DISABLED = 'disabled',
    LOADING = 'icon loading',
    DECORATED = 'decorated',
    ERROR = 'error',
    IN = 'in'
    ;

module.exports = Component.extend({
    isolated: true,
    template: require('templates/components/form/spinner.html'),

    data: function() {
        return {
            classes: function(state, large) {
                var data = this.get(),
                    classes = [];

                if (_.isObject(data.state)) {
                    if (data.state.disabled || data.state.submitting) classes.push(DISABLED);
                    if (data.state.loading) classes.push(LOADING);
                    if (data.state.error) classes.push(ERROR);

                }

                if (data.large) {
                    classes.push(DECORATED);
                    classes.push(LARGE);

                    if (data.value || data.focus) {
                        classes.push(IN);
                    }
                }


                return classes.join(' ');
            }
        };
    },

    oncomplete: function() {
        this.observe('value', function() {  if (this.get('error')) this.set('error', false); }, {init: false});

        var view = this;
        $(this.find('input'))
            .on('focus.api', function() { view.set('focus', true); })
            .on('blur.api', function() { view.set('focus', false); });
    },

    onteardown: function() {
        $(this.find('input')).off('.api');
    },


    inc: function() {
        var v = _.parseInt(this.get('value')) + 1;

        if (v <= this.get('max'))
            this.set('value', v);
    },

    dec: function() {
        var v = _.parseInt(this.get('value')) - 1;

        if (v >= this.get('min')) {
            this.set('value', v);
        }
    }
});