'use strict';

var Component = require('core/component'),
    _ = require('lodash'),
    moment = require('moment'),
     $ = require('jquery')
    ;

module.exports = Component.extend({
    isolated: true,
    template: require('templates/components/form/calendar.html'),

    data: function() {
        return {
            moment: moment,
            worker: moment().startOf('month'),
            value: null,

            formatCalendar: function (worker, value, min, max, second) {
                second = second || false;

                if (second) {
                    worker = worker.clone().add(1, 'month');
                }

                var shift = worker.startOf('month').weekday(),
                    days = worker.endOf('month').date(),
                    range = this.get('range') || [],
                    weeks = [],
	            yearlist = []
                    ;

                var years = moment().diff(moment(), 'years');
                var currentYear = moment().year();

                for (var i = 0; i < 100; i++) {
                    yearlist.push(currentYear - i);
                }


                _.each(_.range(1, days+1), function (v, k) {
                    var m = moment([worker.year(), worker.month(), v]),
                        _d = shift + k,
                        w = (_d/7) >> 0,
                        d = _d % 7,
                        inactive = false,
                        cls = [];
                        ;

                    if (!weeks[w]) {
                        weeks[w] = {
                            days: _.range(7).map(function () { return null; })
                        };
                    }

                    if (min && m.isBefore(min, 'day')) {
                        inactive = true;
                    }

                    if (max && m.isAfter(max, 'day')) {
                        inactive = true;
                    }


                    if (inactive) cls[cls.length] = 'inactive';
                    if (range[0] && m.isSame(range[0], 'day')) cls[cls.length] = 'range start';
                    if (range[1] && m.isSame(range[1], 'day')) cls[cls.length] = 'range end';
                    if (range[0] && range[1] && m.isBetween(range[0], range[1], 'day')) cls[cls.length] = 'range';


                    //console.log(cls);

                    weeks[w].days[d] = {
                        date: v,
                        selected: value ? m.isSame(value, 'day') : false,
                        class: cls.join(' ')
                    };

                });

                return { month: worker.month(), year: worker.year(), weeks: weeks, worker: worker,yearlist: yearlist, selectedmonth: worker.month(), selectedyear: worker.year() };

            }


        }
    },

    onconfig: function(options) {
        this.observe('min', function(min) {
            this.set('worker', min ? min.clone().startOf('month') : moment().startOf('month'));
        });

        this.observe('value', function(value) {
            if (value) {
                var v = moment(value).clone(),
                    w = this.get('worker').clone();

                try {
                    if (this.get('twomonth')) {
                        if (w.startOf('month').isAfter(v)) {
                            this.set('worker', v.startOf('month'));
                        }

                        if (w.add(1, 'month').endOf('month').isBefore(v)) {
                            this.set('worker', v.startOf('month').substract(1, 'month'));
                        }

                    } else {
                        this.set('worker', moment(value).clone().startOf('month'));
                    }
                } catch (e) {
                    this.set('worker', moment(value).clone().startOf('month'));
                }

            }


        }, {init: true});
    },

    setValue: function(value) {
        value = moment(value);
        if (!value) {
            return false;
        }

        if (this.get('max') && value.isAfter(this.get('max').endOf('day'))) {
            return false;
        }

        if (this.get('min') && value.isBefore(this.get('min').startOf('day'))) {
            return false;
        }

        this.set('value', moment(value));
    },

    next: function(worker) {
        this.set('worker', worker.add(1, 'month'));
    },

    prev: function(worker) {
        this.set('worker', worker.add(-1, 'month'));
    },
	selectmonth: function (worker) {
        var year = worker.year();
        var month = $('#selectedmonth').val();
        this.set('worker', moment([year, month]));
    },
    selectyear: function (worker) {       
        var year = $('#selectedyear').val();
        var month = worker.month();
        this.set('worker', moment([year, month]));            
    },
    oncomplete: function () {
        $(this.find('#selectedmonth')).on('change', function () {
            return false;
        });
        $(this.find('#selectedyear')).on('change', function () {
            return false;
        });

    }
	

});