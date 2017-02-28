'use strict';

var Form = require('core/form'),
        moment = require('moment'),
        _ = require('lodash'),
        money = require('helpers/money'),
        Meta = require('stores/flight/meta')
        ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/filter.html'),
    data: function () {
        return {
            $: money,
            meta: Meta.object,
            util:_
        };
    },
    onconfig: function () {
        //this.observe('filtered', function(value) {
        //    this.set('reset', true).then(function() { this.set('reset', false); }.bind(this));
        //}, {init: false});
    },
    oncomplete: function () {
        setTimeout(function () {
            var view = this;

            $(this.find('.ui.accordion')).accordion({exclusive: false});
            $(this.find('.ui.checkbox')).checkbox();

            var price = $(this.find('.price.slider')).ionRangeSlider({
                type: "double",
                grid: true,
                grid_num: 3,
                force_edges: true,
                prettify: function (num) {
                    return money(num, Meta.object.display_currency);
                },
                onChange: function (data) {
                    view.get('filter').set('filtered.prices', [data.from, data.to]);
                }
            }).data('ionRangeSlider');
            /**
             * Added By Satender
             * Purpose : To reset the Price Slider according the Currency
             * Used File : site/themes/B2C/dev/js/components/app/layout.js - LN 59
             */
            Meta.object.set('PriceSlider', price);

            /**
             * END HERE
             */
            $(this.find('.departure.slider')).ionRangeSlider({
                type: "double",
                min: +moment().startOf('day').format("X"),
                max: +moment().endOf('day').format("X"),
                prettify: function (num) {
                    return moment(num, "X").format("HH:mm");
                },
                onChange: function (data) {
                    view.get('filter').set('filtered.departure', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
                }
            }).data('ionRangeSlider');


            $(this.find('.layover.slider')).ionRangeSlider({
                type: "double",
                min: +moment().startOf('day').format("X"),
                max: +moment().endOf('day').format("X"),
                prettify: function (num) {
                    return moment(num, "X").format("HH:mm");
                },
                onChange: function (data) {
                    view.get('filter').set('filtered.layover', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
                }
            }).data('ionRangeSlider');

            $(this.find('.arrive.slider')).ionRangeSlider({
                type: "double",
                min: +moment().startOf('day').format("X"),
                max: +moment().endOf('day').format("X"),
                prettify: function (num) {
                    return moment(num, "X").format("HH:mm");
                },
                onChange: function (data) {
                    view.get('filter').set('filtered.arrival', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
                }
            }).data('ionRangeSlider');

            $(this.find('.backward-arrive.slider')).ionRangeSlider({
                type: "double",
                min: +moment().startOf('day').format("X"),
                max: +moment().endOf('day').format("X"),
                prettify: function (num) {
                    return moment(num, "X").format("HH:mm");
                },
                onChange: function (data) {
                    view.get('filter').set('filtered.arrival2', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
                }
            }).data('ionRangeSlider');

            $(this.find('.backward-departure.slider')).ionRangeSlider({
                type: "double",
                min: +moment().startOf('day').format("X"),
                max: +moment().endOf('day').format("X"),
                prettify: function (num) {
                    return moment(num, "X").format("HH:mm");
                },
                onChange: function (data) {
                    view.get('filter').set('filtered.departure2', [moment(data.from, "X").format("HH:mm"), moment(data.to, "X").format("HH:mm")]);
                }
            }).data('ionRangeSlider');


            this.observe('filter.prices', function (value) {
                if (!value)
                    return;

                price.update({
                    min: value[0],
                    max: value[1],
                    from: value[0],
                    to: value[1]
                })
            }, {init: true});

            this.observe('filter.filtered', function () {
                if (this.get('filter')) {
                    this.get('filter').filter();
                }
            }, {init: false});
        }.bind(this), 500);


    },
    modifySearch: function () {
        this.root.modifySearch();
    },
    carriers: function (e, show) {
        e.original.stopPropagation();
        this.set('filter.filtered.carriers', show ? _.pluck(this.get('filter.carriers'), 'code') : []);
        $("html, body").animate({
            scrollTop: 0
        }, 400);
    }
});