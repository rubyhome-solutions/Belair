'use strict';

var Form = require('core/form');



module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/booking/step2.html'),

    components: {
        passenger: require('components/passenger')
    },

    data: function () {
        return {
            qa: window.localStorage.getItem('qa')
        };
    },

    oncomplete: function () {
        var view = this;

        this.observe('booking.steps.2.active', function (active) {
            if (active) {
                //console.log('scroll to top');

                view.get('booking').setCurrentStepForMobile(2);
                $('html, body').animate({
                    scrollTop: 0
                }, 1000);
                $.ajax({
                    type: 'POST',
                    url: '/b2c/booking/travelers',
                    data: {booking_id: this.get('booking.id')},
                    success: function (data) {
                        //  console.log('got travelers', data);

                        if (data) {
                            view.set('travelers', data);
                        }
                    }
                });
            }
        });
    },
    submit: function () {
        if (!this.checkduplicateUser()) {
            this.get('booking').step2();
        }
    },

    checkAvailability: function () {
        this.get('booking').step2({check: true})
    },

    activate: function () {
        if (!this.get('booking.payment.payment_id'))
            this.get('booking').activate(2);
    },

    back: function () {
        this.get('booking').activate(1);
    },

    checkduplicateUser: function () {
        var passengers = this.get('booking.passengers'),
                passenger_str = new Array(),
                dup_passenger = new Array(),
                n = 0,
                html = '',
                flag = false,
                str = '',
                i, j,
                name = '',
                once = true,
                final_arr = new Array();
        $.each(passengers, function (key, value) {
            str = value.traveler.title_id + value.traveler.firstname.toUpperCase().trim() + value.traveler.lastname.toUpperCase().trim();
            if (str !== 'undefined' && str !== '') {
                passenger_str.push(str.replace(/\s+/g, ''));
            }
        });
        // duplicate value array
        n = passenger_str.length;
        // count the array length
        for (i = 0; i < n; i++) {
            for (j = i + 1; j < n; j++) {
                if (passenger_str[i] == passenger_str[j]) {
                    if (final_arr.indexOf(j) == -1) {
                        if (once) {
                            html += '<div class="ui error message" style="display:block;">';
                        }
                        name = passengers[j].traveler.firstname + ' ' + passengers[j].traveler.lastname;
                        html += '<p>Please Check Duplicate Passenger ' + name + '</p>';
                        once = false;
                        flag = true;
                        final_arr.push(j);
                    }
                }
            }
        }
        if (!flag) {
            $('#dup-error').removeClass('ui segment passenger basic').html('');
        } else {
            html += '</div>';
            $('#dup-error').addClass('ui segment passenger basic').html(html);
        }

        return flag;
    }
});

