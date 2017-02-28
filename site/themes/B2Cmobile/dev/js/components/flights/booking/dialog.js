'use strict';

var $ = require('jquery'),
    Q = require('q')
    ;

var Form = require('core/form')
    ;

var Dialog = Form.extend({
    template: require('templates/flights/booking/dialog.html'),

    data: function() {
        return {
            header: 'header',
            message: 'message',
            buttons: [
                ['Ok', function() { alert('zzz'); }],
                ['Cancel', function() { alert('yyy') }]
            ]
        }
    },

    oncomplete: function() {
        $(this.find('.ui.modal')).modal('show');
    },

    click: function(event, cb) {
        cb.bind(this)(event);
    }
});


Dialog.open = function(options) {
    var dialog = new Dialog();
    dialog.set(options);
    dialog.render('#popup-container');
};

module.exports = Dialog;