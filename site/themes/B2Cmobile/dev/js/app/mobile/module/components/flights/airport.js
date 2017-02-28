'use strict';

var _ = require('lodash'),
    $ = require('jquery')
    ;

var Component = require('core/component')
    ;

module.exports = Component.extend({
    template: require('templates/flights/airport.html'),

    data: function() {
        return {
            id: _.uniqueId('airport_')
        };
    },

    onconfig: function() {
        var view = this, meta = this.get('meta'), ap;

        if (this.get('value')) {
            if (ap = meta.get('airport')(this.get('value'))) {
                this.set('value', ap.id);
                this.set('city', ap.city_name);
                this.set('code', ap.airport_code);
            }

            $.ajax({
                type: 'GET',
                url: '/b2c/flights/airport/' + this.get('value'),
                dataType: 'json',
                success: function(data) {
                    view.set('value', data.id);
                    view.set('code', data.text.slice(-4, -1));
                    view.set('city', data.text.slice(0, -6));
                }
            })
        }
    },

    oncomplete: function() {
        var view = this,
            debounce,
            airps,
            filtered,
            airports = this.get('domestic') ? this.get('meta.domestic') : [],
            query = '',
            id = this.get('id'),
            el = this.find('input.airport'),
            timeout, ajax;

        airps = $.map(airports, function (val, i) {
            return {
                text: '<div><div class="md-airport-name" data-id="' +  val.id + '">' + val.city_name + ' (' + val.airport_code + ')' + '</div></div>',
                value: val.id,
                city: val.city_name,
                code: val.airport_code
            };
        });

        filtered = airps;

        $(el).mobiscroll().select({
            buttons: [],
            theme: 'mobiscroll',
            display: 'top',
            data: filtered,
            layout: 'liquid',
            showLabel: false,
            height: 40,
            rows: 3,
            onMarkupReady: function (markup, inst) {
                markup.addClass('md-airports');

                $('<div style="padding:.5em"><input class="md-filter-input" tabindex="0" placeholder="City name or airport code" /></div>')
                    .prependTo($('.dwcc', markup))
                    .on('keydown', function (e) { e.stopPropagation(); })
                    .on('keyup', function (e) {
                        var that = $('input', this);
                        clearTimeout(debounce);
                        debounce = setTimeout(function () {
                            query = that.val().toLowerCase();

                            filtered = $.grep(airps, function (val) {
                                return 0 == val.city.toLowerCase().indexOf(query) || 0 == val.code.toLowerCase().indexOf(query);
                            });

                            if (filtered.length) {
                                inst.settings.data = filtered.length ? filtered : [{text: 'No results', value: ''}];
                                inst.settings.parseValue(inst.settings.data[0].value);
                                inst.refresh();
                            } else {
                                if (timeout) {
                                    clearTimeout(timeout);
                                }

                                timeout = setTimeout(function() {
                                    if (ajax) {
                                        ajax.abort();
                                    }

                                    ajax = $.ajax({
                                        type: 'GET',
                                        url: '/b2c/booking/searchAirport',
                                        data: { term: query },
                                        dataType: 'json',
                                        success: function(data) {
                                            filtered = _.map(data, function(i) {
                                                return {
                                                    value: i.id,
                                                    text: '<div><div class="md-airport-name" data-id="' +  i.id + '">' + i.label + '</div></div>'
                                                };
                                            });

                                            inst.settings.data = filtered.length ? filtered : [{text: 'No results', value: ''}];
                                            inst.settings.parseValue(inst.settings.data[0].value);
                                            inst.refresh();
                                        }
                                    });
                                }, 500);
                            }


                        }, 500);
                    });
            },
            onBeforeShow: function (inst) {
                inst.settings.data = airps;
                inst.refresh();
            },
            onSelect: function (v, inst) {
                var data = $(v).find('div').data(),
                    label = $(v).text();

                view.set('code', label.slice(-4, -1));
                view.set('city', label.slice(0, -6));
                view.set('value', data.id);


                $('#' + id + '_dummy').val(label);
            },
            onValueTap: function (item, inst) {
                //var data = $(v).find('div').data(),
                //    label = $(v).text();
                //
                //$('#' + id + '_dummy').val(label);
            },
            onShow: function () {

            }
        });

        this.ms = $(el).mobiscroll('getInst');
    },

    show: function() {
        this.ms.show();
    }
});

