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
        
        var getData=function(data){
           // console.log(data);
        };
        var getData1=function(data){
            console.log("error");
            console.log(data);
        };
        var doajax=function(getData){
         $.ajax({
                type: 'POST',                
                url: 'b2c/traveler/getMyTravelersList',  
                success: getData,
                error: getData1
            });
    };
        doajax(getData);
       
        return {
            
            currentTraveller: {id: 1,title:'Mr.', email: 'prashant@gmail.com', mobile: '9412357926',  first_name: 'Prashant', 
                last_name:'Kumar',birthdate:'2001-05-30',baseUrl:'',passport_number:'342123',passport_place:'India'
            },
            currentTravellerId:1,
            cabinType: 1,
            add:false,
            edit:false,
            titles:[{id:1,text:'Mr.'},{id:2,text:'Mrs.'},{id:3,text:'Ms.'},{id:4,text:'Miss'},{id:5,text:'Mstr.'},{id:6,text:'Inf.'}],
            passengers: [1, 0, 0],
            travellers: [
                { id: 1,title:'Mr.', email: 'prashant@gmail.com', mobile: '9412357926',passport_number:'2542342',passport_place:'India', 
                    first_name: 'Prashant', last_name:'Kumar',birthdate:'2001-05-30',baseUrl:''},
                { id: 2,title:'Mr.', email: 'Michael@gmail.com', mobile: '1234567890',passport_number:'3123123',passport_place:'India', 
                    first_name: 'Michael', last_name:'Jain',birthdate:'2005-03-03',baseUrl:''},
                { id: 3,title:'Mr.', email: 'belair@gmail.com', mobile: '1234567890',passport_number:'1231231',passport_place:'India',
                    first_name: 'Belair', last_name:'Travels',birthdate:'2002-02-20',baseUrl:''}
            ],

            pending: false,
            errors: {},
            results: [],

            filter: {},
            filtered: {},
           
        }
    },

    
    run: function() {
        var view = this;
    if(this.get().add){        
        var newtraveller=_.pick(this.get(), 'currentTraveller'); 
        var travellers=this.get().travellers;
        var t=newtraveller.currentTraveller.title;
        var titles=_.cloneDeep(this.get().titles);
        var title;
         _.each(titles, function(i, k) { if (i.id==t) title=i.text; });
      
        var currenttraveller={id: 4,title:title, email: newtraveller.currentTraveller.email, mobile: newtraveller.currentTraveller.mobile,  first_name: newtraveller.currentTraveller.first_name, 
                last_name:newtraveller.currentTraveller.last_name,birthdate:newtraveller.currentTraveller.birthdate.format('YYYY-MM-DD'),baseUrl:'',passport_number:newtraveller.currentTraveller.passport_number,passport_place:newtraveller.currentTraveller.passport_place
            };
        travellers.push(currenttraveller);
        //console.log(travellers);
        this.set('travellers',travellers);
        this.set('currentTraveller',currenttraveller);
        this.set('currentTravellerId',4);
    }
    else if(this.get().edit){
        var newtraveller=this.get().currentTraveller; 
        var travellers=this.get().travellers;
        var t=newtraveller.title;
        var titles=_.cloneDeep(this.get().titles);
        var title;
        var id=this.get().currentTravellerId;
         _.each(titles, function(i, k) { /*console.log(i);*/ if (i.id==t) title=i.text; });
      
        var currenttraveller={id: id,title:title, email: newtraveller.email, mobile: newtraveller.mobile,  first_name: newtraveller.first_name, 
                last_name:newtraveller.last_name,birthdate:newtraveller.birthdate.format('YYYY-MM-DD'),baseUrl:'',passport_number:newtraveller.passport_number,passport_place:newtraveller.passport_place
            };
        var index= _.findIndex(this.get().travellers, { 'id': id});
        this.splice('travellers', index, 1);
       // console.log(currenttraveller);
        travellers.push(currenttraveller);
        //console.log(travellers);
        this.set('travellers',travellers);
        this.set('currentTraveller',currenttraveller);        
    }
        this.set('add',false); 
        this.set('edit',false); 
        //,
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

    importResults: function(k, data) {
        this.set('filtered', {});
        this.set('results.' + k, data);

        var prices = [],
            carriers = [];

        _.each(data, function(i) {
            prices[prices.length] = i.price;
            carriers[carriers.length] = i.itinerary[0].segments[0].carrier;
        });


        carriers = _.unique(carriers, 'code');

        this.set('filter', {
            prices: [Math.min.apply(null, prices), Math.max.apply(null, prices)],
            carriers: carriers
        });

        this.set('filtered.carriers', _.map(carriers, function(i) { return i.code; }));
    },

    handleError: function(k, xhr) {

    }


});