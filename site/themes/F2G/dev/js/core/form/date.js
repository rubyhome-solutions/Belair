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
    IN = 'in',
    SEARCH = 'search',
    INPUT = 'input'
    ;

module.exports = Component.extend({
    isolated: true,
    template: require('templates/components/form/date.html'),

    components: {
        'ui-calendar': require('./calendar')
    },

    data: function() {
        return {
            interactive: true,
            classes: function() {
                var data = this.get(),
                    classes = [];

                if (_.isObject(data.state)) {
                    if (data.state.disabled || data.state.submitting) classes.push(DISABLED);
                    if (data.state.loading) classes.push(LOADING);
                    if (data.state.error) classes.push(ERROR);

                }

                if (data.large) {
                    classes.push(INPUT);
                    classes.push(DECORATED);
                    classes.push(LARGE);

                    if (data.value || data.focus) {
                        classes.push(IN);
                    }
                }

                if (data.search) {
                    classes.push(SEARCH);
                }

                if (data.disabled) {
                    classes.push(DISABLED);
                }


                return classes.join(' ');
            }
        };
    },

    oncomplete: function() {
        var view = this, o;

        $(this.find('.ui.selection'))
            .dropdown({
                onShow: function() {
                    o && o.cancel();
                    o = view.observeOnce('value', function(value) {
                        if (value) { this.fire('next', view); }

                        _.delay(function() { if (view.get('error')) view.set('error', false) }, 500);
                    }, {init: false});
                }
            })
            .on('change', function() {
                $(this).dropdown('hide');
                view.updateModel();

            })
        ;

        this.observe('value', function(value) {
            if (value)
                $(this.find('.ui.selection')).dropdown('hide');
        });
    }


});