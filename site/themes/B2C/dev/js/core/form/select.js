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
    template: require('templates/components/form/select.html'),

    data: function() {
        return {
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

        var el = $(this.find('.ui.dropdown'))
            .dropdown({
                fullTextSearch: true,
                onShow: function() {
                    o && o.cancel();
                    o = view.observeOnce('value', function(value) { if (value) { this.fire('next', view); } }, {init: false});
                },
                onChange: function(value) {
                    if (value) {
                        $(this).dropdown('hide');
                        view.set('value', value);
                        view.update('value');

                        _.delay(function() { if (view.get('error')) view.set('error', false) }, 500);
                    }
                }
            })
            ;

        this.observe('value', function(value) {

            if (value) {
                var options = this.get('options');
                if($(this.el).hasClass('step3netbanking')) {
                    var booking = view.parent.get('booking');
                    if(booking){
                        booking.pymtConvFee(4 ,value, null); // For NetBanking
                    }
                } else if($(this.el).hasClass('step3wallet')) {
                    var booking = view.parent.get('booking');
                    if(booking){
                        booking.pymtConvFee(5 ,value, null); // For Wallet
                    }
                }
                if (options) {
                    var o = _.find(options, {id: value});

                    if (o) {
                        el.dropdown('set value', o.id);
                        el.dropdown('set text', o.text);

                        return;
                    }

                }

                return;
            }

            el.dropdown('restore defaults');


        }, {init: false});

        if (this.find('.search')) {
            $(this.find('.search')).keypress(function(e){
                if ( e.which == 13 ) e.preventDefault();
            });
        }

    },

    onteadown: function() {
        //this.set('options', null);
    }
});