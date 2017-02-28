'use strict';

var Input = require('core/form/input'),
    moment = require('moment')
    ;


module.exports = Input.extend({
    template: require('templates/components/form/date.html'),

    oncomplete: function() {
        var view = this,
            el = $(this.find('input')),
            widget = el.on('change', function() { view.set('value', moment(this.value)); }).mobiscroll();

        widget.calendar({
            buttons: [],
            theme: 'mobiscroll',
            display: 'bottom',
            dateFormat: 'yy-mm-dd',
            onDayChange: function(day, inst) {
                view.set('value', moment(day.date).clone());
                inst.hide();
            }
        });

        this.observe('min', function(value) { el.mobiscroll('option', 'minDate', value ? value.toDate() : null); });
        this.observe('max', function(value) { el.mobiscroll('option', 'maxDate', value ? value.toDate() : null); });
        this.observe('value', function(value) { el.mobiscroll('setVal', value ? value.toDate() : null); });
    },

    show: function() {
        if (!this.get('disabled'))
            $(this.find('input')).mobiscroll('show');
    }


});