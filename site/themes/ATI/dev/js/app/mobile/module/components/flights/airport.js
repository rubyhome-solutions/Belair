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
    prepareAirportData : function(airports){
    	return $.map(airports, function (val, i) {
            return {
                text: '<div><div class="md-airport-name" data-id="' +  val.id + '">' + val.city_name + ' (' + val.airport_code + ')' + '</div></div>',
                value: val.id,
                city: val.city_name,
                code: val.airport_code
            };
        });
    },
    processRequest : function(filtered, airps, markup, inst, debounce, query, timeout, ajax){
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
    bindElementEventData : function(view, filtered, airps, debounce, query, timeout, ajax){
    	return {
            buttons: [],
            theme: 'mobiscroll',
            display: 'top',
            data: filtered,
            layout: 'liquid',
            showLabel: false,
            height: 40,
            rows: 10,
            onMarkupReady: function (markup, inst) {
                view.processRequest(filtered, airps, markup, inst, debounce, query, timeout, ajax);
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


                //$('#' + id + '_dummy').val(label);
            },
            onValueTap: function (item, inst) {

            },
            onShow: function () {

            }
        }
    },
    oncomplete: function() {
        var view = this,
            debounce,
            airps_from,
            airps_to,
            filtered_from,
            filtered_to,
            airports_from = this.get('domestic') ? this.get('meta.from') : [],
            airports_to = this.get('domestic') ? this.get('meta.to') : [],
            query = '',
            id = this.get('id'),
            el_from = this.find('input.airport_from'),
            el_to = this.find('input.airport_to'),
            timeout, ajax;

        airps_from = view.prepareAirportData(airports_from);
        filtered_from = airps_from;

        airps_to = view.prepareAirportData(airports_to);
        filtered_to = airps_to;

        $(el_from).mobiscroll().select(view.bindElementEventData(view, filtered_from, airps_from, debounce, query, timeout, ajax));
        this.msfrom = $(el_from).mobiscroll('getInst');
        
        $(el_to).mobiscroll().select(view.bindElementEventData(view, filtered_to, airps_to, debounce, query, timeout, ajax));
        this.msto = $(el_to).mobiscroll('getInst');
    },

    showfrom: function() {
        this.msfrom.show();
    },
    showto: function() {
    	this.msto.show();
    }
});