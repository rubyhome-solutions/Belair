'use strict';

var Form = require('core/form'),
        _ = require('lodash'),
        moment = require('moment'),
        Mytraveller = require('stores/mytraveller/traveler')
        ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/mytraveller/form.html'),
    components: {
        'ui-spinner': require('core/form/spinner'),
        'ui-calendar': require('core/form/calendar'),
        'ui-tel': require('core/form/tel'),
        'ui-email': require('core/form/email'),
        'ui-input': require('core/form/input'),
        'ui-date': require('core/form/date'),
    },
    data: function () {
        return {
            error:null,
            state: {
            },
            //  meta: require('app/stores/meta').instance(),

            formatTitles: function (titles) {
                var data = _.cloneDeep(titles);

                return _.map(data, function (i) {
                    return {id: i.id, text: i.name};
                });
            },
        }
    },
    oninit: function (options) {
        var date;
        
        if(this.get('mytraveller.currentTraveller')!=null){
            date = this.get('mytraveller.currentTraveller.birthdate');
            if(date!=null&&date!='') {
                if (moment.isMoment(date)) {
                    this.get('mytraveller').set('currentTraveller.birthdate', date);
                } else {
                    this.get('mytraveller').set('currentTraveller.birthdate', moment(date, 'YYYY-MM-DD'));
                }
            }
        }
        this.on('add', function (event) {
            
            var newtraveller = this.get('mytraveller.currentTraveller');
            var travellers = this.get('mytraveller.travellers');
            var t = newtraveller.title;           
            var birthdate = newtraveller.birthdate;
            if (moment.isMoment(birthdate)) {
                // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
                birthdate = birthdate.format('YYYY-MM-DD');
            }

            var currenttraveller = {title: newtraveller.title, email: newtraveller.email, mobile: newtraveller.mobile, first_name: newtraveller.first_name,
                last_name: newtraveller.last_name, birthdate: birthdate, baseUrl: '', passport_number: newtraveller.passport_number, passport_place: newtraveller.passport_place
            };

            $.ajax({
                context: this,
                type: 'POST',
                url: '/b2c/traveler/create',
                dataType: 'json',
                data: {'data': JSON.stringify(currenttraveller)},
                success: function (idd) {
                    console.log(idd);
                    if(idd.error){
                        this.set('error', idd.error);
                    }else{
                        this.set('error', null);
                    currenttraveller.id = idd.traveler_id;
                    travellers.push(currenttraveller);
                    this.get('mytraveller').set('travellers', travellers);
                    this.get('mytraveller').set('currentTraveller', currenttraveller);
                    this.get('mytraveller').set('currentTravellerId', currenttraveller.id);
                    this.get('mytraveller').set('add', false);}
                },
                error:function(error){
                    console.log(error);
                    this.set('error', idd.error);
                }
            });


        });

        this.on('edit', function (event) {
            //console.log("Inside Edit");
            var newtraveller = this.get('mytraveller.currentTraveller');

            console.log(this.get('mytraveller.currentTraveller'));
            var travellers = this.get('mytraveller.travellers');
            var t = newtraveller.title;
            //var titles=_.cloneDeep(this.get('mytraveller').titles);
            //var title;
            // _.each(titles, function(i, k) { if (i.id==t) title=i.text; });
            var birthdate = newtraveller.birthdate;
            if (moment.isMoment(birthdate)) {
                // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
                birthdate = birthdate.format('YYYY-MM-DD');
            }
            var id = this.get('mytraveller.currentTraveller.id');
            var currenttraveller = {id: id,title: newtraveller.title, email: newtraveller.email, mobile: newtraveller.mobile, first_name: newtraveller.first_name,
                last_name: newtraveller.last_name, birthdate: birthdate, baseUrl: '', passport_number: newtraveller.passport_number, passport_place: newtraveller.passport_place
            };
           var update = function(arr, key, newval) {
                        var match = _.find(arr, key);
                        if(match)
                          _.merge(match, newval);
                            
                      };
           $.ajax({
                context: this,
                type: 'POST',
                url: '/b2c/traveler/update/'+ _.parseInt(id),
                dataType: 'json',
                data: {'data': JSON.stringify(currenttraveller)},
                success: function (idd) {
                    if(idd.result=='success'){
                    _.mixin({ '$update': update });
                    _.$update(travellers, {id:id}, currenttraveller);
                    //this.get('mytraveller').splice('travellers', index, 1);
                    console.log(currenttraveller);
                   // travellers.push(currenttraveller);
                    //console.log(travellers);
                    this.get('mytraveller').set('travellers', travellers);
                    this.get('mytraveller').set('currentTraveller', currenttraveller);
                    this.get('mytraveller').set('currentTravellerId', id);
                    this.get('mytraveller').set('edit', false);
                }
                else {
                        this.set('error', idd.message);
                    }
                }
            });
           
            
        });
    },
    submit: function () {

        
    },
    addJourney: function () {
        //  this.get('search').push('flights', { from: 2336, to: 627, depart_at: moment().endOf('month'), return_at: null});
    },
    oncomplete: function () {
//        this.observe('mytraveller.currentTraveller', function(value) {
//            console.log("currentTraveller changed ");
//            //console.log(value);
//            //this.get('mytraveller').set('currentTraveller', value);
//        }, {init: false});
//        this.observe('mytraveller.currentTravellerId', function(value) {
//            //console.log("currentTravellerId changed ");
//            //console.log(value);
//            //this.get('mytraveller').set('currentTravellerId', value);
//        }, {init: false});
    }
});