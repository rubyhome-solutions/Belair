'use strict';

var _ = require('lodash'),
        $ = require('jquery')
        ;

var Select = require('core/form/select')
        ;

module.exports = Select.extend({
    onconfig: function () {
        var view = this;
        var ajax, timeout;

        if (this.get('domestic')) {
            this.set('options', this.get('meta.select.domestic')());
        } else {
            if (this.get('value')) {
                $.ajax({
                    type: 'GET',
                    url: '/b2c/flights/airport/' + this.get('value'),
                    dataType: 'json',
                    success: function (data) {
                        view.set('options', [data]).then(function () {
                            $(view.find('.ui.selection')).dropdown('set value', data.id);
                            $(view.find('.ui.selection')).dropdown('set text', data.text);
                        });


                    }
                })
            }

            var ajax = null;
            this.observe('value', function (value) {
                if (ajax) {
                    ajax.abort();
                }
                if (this.get('value')) {
                    ajax = $.ajax({
                        type: 'GET',
                        url: '/b2c/flights/airport/' + this.get('value'),
                        dataType: 'json',
                        success: function (data) {
                            view.set('options', [data]).then(function () {
                                $(view.find('.ui.selection')).dropdown('set value', data.id);
                                $(view.find('.ui.selection')).dropdown('set text', data.text);
                            });
                        }
                    });
                }
            });

            this.observe('searchfor', function (value) {
                if (value && value.length > 2) {
                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    timeout = setTimeout(function () {
                        if (ajax) {
                            ajax.abort();
                        }

                        ajax = $.ajax({
                            type: 'GET',
                            url: '/b2c/booking/searchAirport',
                            data: {term: value},
                            dataType: 'json',
                            success: function (data) {
                                view.set('options', _.map(data, function (i) {
                                    return {id: i.id, text: i.label};
                                }))
                                        .then(function () {
                                            $(view.find('.ui.selection')).dropdown('show');
                                        });
                            }
                        });
                    }, 500);


                } else {
                    if (ajax) {
                        ajax.abort();
                    }

                    this.set('options', []);
                }
            }, {init: false});
        }


    }
});