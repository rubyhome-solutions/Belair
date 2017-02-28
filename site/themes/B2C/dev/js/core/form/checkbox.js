'use strict';

var Component = require('core/component'),
    $ = require('jquery'),
    _ = require('lodash')
    ;

module.exports = Component.extend({
    isolated: true,
    template: require('templates/components/form/checkbox.html'),

    oncomplete: function() {
        var view = this;

        $(this.find('.ui.checkbox')).checkbox();

    }
});
