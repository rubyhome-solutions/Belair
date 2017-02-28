'use strict';

var $ = require('jquery'),
        Q = require('q')
        ;

var Form = require('core/form')
        ;

var Dialog = Form.extend({
    template: require('templates/flights/booking/dialog.html'),
    modalType: 1,
    data: function () {
        return {
            header: 'header',
            message: 'message',
            buttons: [
                ['Ok', function() { alert('zzz'); }],
                ['Cancel', function() { alert('yyy') }]
            ],
            closeButton: true
        }
    },
    oncomplete: function () {
        if (Dialog.modalType === 2) {
            var options = {
                keyboardShortcuts: false,
                closable: false
            };
            $(this.find('.ui.modal')).modal(options).modal('show');
        } else {
            $(this.find('.ui.modal')).modal('show');
        }

    },
    click: function (event, cb) {
        cb.bind(this)(event);
    }
});


Dialog.open = function (options, type) {
    var dialog = new Dialog();
    Dialog.modalType = type;
    dialog.set(options);
    dialog.render('#popup-container');
};

module.exports = Dialog;