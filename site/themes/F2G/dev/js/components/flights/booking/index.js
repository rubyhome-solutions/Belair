'use strict';

var Q = require('q'),
    _ = require('lodash'),
    page = require('page.js'),
    $ = require('jquery')
    ;

var Form = require('core/form'),
    Booking = require('stores/flight/booking'),
    Meta = require('stores/flight/meta')
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/booking/index.html'),

    components: {
        layout: require('components/app/layout'),
        step1: require('./step1'),
        step2: require('./step2'),
        step3: require('./step3'),
        step4: require('./step4')
    },

    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },

    data: function() {
        return {
            meta: Meta.object
        }
    },

    onconfig: function () {
        Booking.fetch(this.get('id'))
            .then(function (booking) {
            return this.set('booking', booking); 
            }.bind(this));
    },
    oncomplete:function(){
        $('.ui.dropdown.currency').hide();
       this.observe('booking.currency', function(cur) {
            
               
                var cur=this.get('booking.currency');
                //console.log(cur);
                this.set('booking.currency',cur );
                this.set('meta.display_currency',cur );
                
                this.update('meta');
                //console.log( this.get('meta'));
           
        });
      
    },
    onteardown: function() {
        if (this.container) {
            this.container.showPanel();
        }
    },

    back: function(force) {
        force = force || false;
        if(MOBILE && this.get('booking') && this.get('booking.currentstep')){
        this.get('booking').activate(parseInt(this.get('booking.currentstep')) - 1);
            return;
        }
        
       var url = '/b2c/flights',
            cs = this.get('booking.clientSourceId'),
            burl = this.get('booking.searchurl'),
            params = [];
        
        if(burl) {
            url = url + burl;
        }
        if (cs && cs > 1) {
            params.push('cs=' + cs);
        }

        if (force) {
            params.push('force=1');
        }

        if (params.length) {
            url += '?' + params.join('&');
        }

        page(url);
    },

    back2: function() { this.back(true); },
    setCurrencyBooking: function() { 
        
        var code=$('#currency1').val();
        //console.log(code);
        this.set('booking.currency', code);
       // console.log(this.get('booking.currency'));
        this.update('booking.currency');
    }
});