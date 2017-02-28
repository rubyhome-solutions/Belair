'use strict';

var Form = require('core/form'),
        moment = require('moment'),
        _ = require('lodash')
        ;


var t2m = function (time) {
    var i = time.split(':');

    return i[0] * 60 + i[1];
};

module.exports = Form.extend({
    isolated: true,
    template: require('templates/myprofile/view.html'),
    data: function () {

        return {
        }

    },
    oninit: function (options) {
        
        
        
    },
    edit:function(){
        //console.log("Inside edit");
        this.set('myprofile.edit', true);
    },
    oncomplete: function () {
//        this.observe('mytraveller.currentTraveller', function(value) {
//            console.log("Inside view currentTraveller changed");
//            console.log(value);
//            
//        }, {init: true});
//        this.observe('mytraveller.currentTravellerId', function(value) {
//            //console.log("currentTravellerId changed ");
//            //console.log(value);
//            //this.get('mytraveller').set('currentTravellerId', value);
//        }, {init: false});
    }
});