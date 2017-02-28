'use strict';

var Form = require('core/form');



module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/booking/step2.html'),

    components: {
        passenger: require('components/passenger')
    },

    data: function() {
        return {
            qa: window.localStorage.getItem('qa')
        };
    },
    
    oncomplete: function() {
        
        var view = this;
        
        
        this.observe('booking.steps.2.active', function(active) {
            if (active) {
                console.log('scroll to top');
        
           
            $('html, body').animate({
                scrollTop: 0
                }, 1000);
                $.ajax({
                    type: 'POST',
                    url: '/b2c/booking/travelers',
                    data: { booking_id: this.get('booking.id') },
                    success: function(data) {
                        console.log('got travelers', data);
                       
                        if (data) {
                            view.set('travelers', data);
                        }
                    }
                });
            }
        });
        
        
    },

    submit: function() { this.get('booking').step2() },

    checkAvailability: function() { this.get('booking').step2({check: true}) },

    activate: function() { if (!this.get('booking.payment.payment_id')) this.get('booking').activate(2); },

    back: function() {
        this.get('booking').activate(1);
    }




});

