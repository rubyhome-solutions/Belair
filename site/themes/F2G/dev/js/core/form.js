'use strict';

var $ = require('jquery'),
    Q = require('q')
    ;

var Component = require('core/component');

module.exports = Component.extend({
    components: {
        'ui-input': require('core/form/input'),
        'ui-select': require('core/form/select'),
        'ui-date': require('core/form/date')
    },

    post: function(url, data) { return this.ajax('POST', url, data); },

    ajax: function(type, url, data) {
        var view = this;
        return Q.Promise(function(resolve, reject) {
            view.set('pending', true);
            view.set('errors', null);

            $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: 'json',
                complete: function() { view.set('pending', false); },
                success: function(data) { resolve(data); },
                error: function(xhr) {
                    view.handleAjaxError(xhr);

                    try {
                        reject(JSON.parse(xhr.responseText))
                    } catch (e) {
                        reject(false);
                    }
                }
            });
        });
    },

    handleAjaxError: function(xhr) {
        try {
            var response = JSON.parse(xhr.responseText);

            if (response.errors) {
                this.set('errors', response.errors);
            } else {
                if (response.message) {
                    this.set('errors', [response.message]);
                }
            }
        } catch (e) {
            this.set('errors', ['Server returned error. Please try again later']);
        }
    }
});
