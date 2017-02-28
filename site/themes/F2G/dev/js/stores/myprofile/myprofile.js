'use strict';

var _ = require('lodash'),
    Q = require('q'),
    $ = require('jquery'),
    moment = require('moment'),
    validate = require('validate')
    
    ;

var Store = require('core/store')  ;

var Myprofile = Store.extend({
    computed: {
        price: function() {
            _.reduce(this.get(' '))
        }
    },
    getStateList: function (view) {
       // console.log("getStateList");
        return Q.Promise(function (resolve, reject, progress) {
            $.ajax({
                type: 'POST',
                url: '/b2c/users/getStateList/' + _.parseInt(view.get('profileform.countrycode')),
                dataType: 'json',
                data: {'data': ''},
                success: function (data) {
                    //console.log(data);
                    view.set('statelist',null);
                    view.set('statelist', data);
                    view.set('profileform.statecode', view.get('profileform.statecode'));
                    view.update('profileform.statecode');
                    resolve();
                },
                error: function (error) {
                    alert(error);
                }
            });
        }).then(function () {
            //console.log('finsihed store: ');
            var temp=view.get('profileform.statecode');
            view.set('profileform.statecode', null);
          view.set('profileform.statecode', temp);
          
          
        }, function (error) {
            console.log(error);
        });
    },
    getCityList: function (view) {
        //console.log("getCityList");
        return Q.Promise(function (resolve, reject, progress) {
            $.ajax({
                type: 'POST',
                url: '/b2c/users/getCityList/' + _.parseInt(view.get('profileform.statecode')),
                dataType: 'json',
                data: {'data': ''},
                success: function (data) {
                    //console.log(data);
                    view.set('citylist',null);
                    view.set('citylist', data);
                    view.set('profileform.citycode', view.get('profileform.citycode'));
                    resolve();
                },
                error: function (error) {
                    alert(error);
                }
            });
        }).then(function () {
           $('#divcity .ui.dropdown').dropdown('set selected', $('#divcity .item.active.selected').attr('data-value'));
        }, function (error) {
            console.log(error);
        });
    },
});

Myprofile.parse = function(data) {
           //console.log(data);  
           data.baseUrl='';
            data.add=false;
            data.edit=false;           
            data.pending= false;
            
    return new Myprofile({data: data});

};
Myprofile.fetch = function() {
    return Q.Promise(function(resolve, reject) {
        $.getJSON('/b2c/users/getProfile')
            .then(function(data) {  resolve(Myprofile.parse(data));
                
            })
            .fail(function(data) {
                //TODO: handle error
             console.log("failed");
             console.log(data);
            });
    });
};

module.exports = Myprofile;