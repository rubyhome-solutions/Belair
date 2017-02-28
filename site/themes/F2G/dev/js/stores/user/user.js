'use strict';

var Store = require('core/store'),
    moment = require('moment'),
    validate = require('validate'),
    $ = require('jquery'),
    _ = require('lodash')
    ;

module.exports = Store.extend({
    quene: [],

    data: function() {        
        return {
            
            isGuest: false,
            name:'Prashant Kumar',
            baseUrl:'/themes/B2C',
            profileImageUrl:'/themes/B2C/img/tmp/user.png',
            profileCompleteness:80,
            errors: {},
            results: [],

            filter: {},
            filtered: {}
        }
    },


    run: function() {
        var view = this;//,
     /*       search = _.pick(this.get(), ['tripType', 'cabinType', 'passengers']);

        this.set('errors', {});
        this.set('pending', true);
        this.quene = [];


        _.each(this.get('flights'), function(i, k) {
            view.quene[view.quene.length] = $.ajax({
                type: 'POST',
                url: '/b2c/flights/search',
                data: _.extend({}, search, {
                    from: i.from,
                    to: i.to,
                    depart_at: moment.isMoment(i.depart_at) ? i.depart_at.format('YYYY-MM-DD') : null,
                    return_at: moment.isMoment(i.return_at) ? i.return_at.format('YYYY-MM-DD') : null
                }),
                dataType: 'json',
                success: function(data) { view.importResults(k, data); },
                error: function(xhr) { view.handleError(k, xhr); }
            })
        });

        $.when.apply(undefined, this.quene)
            .done(function() { view.set('pending', false); view.set('finished', true); }); */
    },

    

    handleError: function(k, xhr) {

    }


});