'use strict';

var _ = require('lodash'),
    Q = require('q'),
    $ = require('jquery'),
    moment = require('moment'),
    validate = require('validate')
    
    ;

var Store = require('core/store')  ;

var Traveler = Store.extend({
    computed: {
        price: function() {
            _.reduce(this.get(' '))
        }
    }
});

Traveler.parse = function(data) {
            
    data.travellers= _.map(data, function(i) {
        
        return { id: i.id,user_info_id:i.user_info_id,title:i.traveler_title_id,gender_id:i.gender_id,passport_country_id:i.passport_country_id,city_id:i.city_id, email: i.email, mobile: i.mobile,passport_number:i.passport_number, passport_issue:i.passport_issue,
                passport_expiry:i.passport_expiry, passport_place:i.passport_place, pincode:i.pincode,address:i.address,phone:i.phone,email2:i.email2,
               first_name: i.first_name, last_name:i.last_name,birthdate:i.birthdate,baseUrl:''}; }); 
         // console.log(data.travellers); 
          var url=window.location.href;
          if(url.indexOf('mytravelers/')>-1){
              var cid=url.split('mytravelers/')[1];              
              data.currentTraveller=_.last(_.filter(data.travellers, {'id': _.parseInt(cid)}));              
              if(data.currentTraveller!=null)
                data.currentTravellerId=data.currentTraveller.id;
          }else{
            data.currentTraveller= _.first(data.travellers);
            if(data.currentTraveller!=null)
            data.currentTravellerId=data.currentTraveller.id;
          }
            data.cabinType= 1;
            data.add=false;
            data.edit=false;
            data.passengers= [1, 0, 0];
            data.pending= false;
            data.errors= {};
            data.results= [];

            data.filter= {};
            data.filtered= {};
    return new Traveler({data: data});

};
Traveler.add= function(data) {
    //console.log("Inside Traveler.add");
    console.log(JSON.stringify(data));
      return Q.Promise(function(resolve, reject) {
        //$.post('/b2c/traveler/create', JSON.stringify(data), 'json')
       $.ajax({
    type: 'POST',
    url: '/b2c/traveler/create',
    dataType: 'json',
    data: {'data': JSON.stringify(data)},
    success: function(msg) {
     // console.log("Success");
    }
  })     .then(function(rdata) { console.log(rdata);resolve({data:rdata.traveler_id});
                
            })
            .fail(function(data) {
                //TODO: handle error
             console.log("failed");
             console.log(data);
            });
    });
    };
Traveler.fetch = function(id) {
   // console.log("Traveler.fetch");
    return Q.Promise(function(resolve, reject) {
        $.getJSON('/b2c/traveler/getMyTravelersList')
            .then(function(data) {  resolve(Traveler.parse(data));
                
            })
            .fail(function(data) {
                //TODO: handle error
             console.log("failed");
             console.log(data);
            });
    });
};

module.exports = Traveler;