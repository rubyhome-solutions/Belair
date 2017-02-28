'use strict';

var Form = require('core/form'),
        moment = require('moment'),
        _ = require('lodash')
        //,
        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
        ;


var t2m = function (time) {
    var i = time.split(':');

    return i[0] * 60 + i[1];
};

module.exports = Form.extend({
    isolated: true,
    template: require('templates/mytraveller/view.html'),
    data: function () {

        return {
            //mytraveller:this.get('mytraveller'),
            //mytraveller:new Mytraveller(),
            formatBirthDate: function (date) {
                if (moment.isMoment(date)) {
                    // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
                    return date.format('YYYY-MM-DD');
                }
                else {
                    return date;
                }
            },
            formatTitle: function (title) {
                var titles = this.get('meta').get('titles');
                //console.log(titles);
                // console.log(title);
                return  _.result(_.find(titles, {'id': title}), 'name');
            },
        }

    },
    sortOn: function (on) {
        if (on == this.get('sortOn.0')) {
            this.set('sortOn.1', -1 * this.get('sortOn.1'));
        } else {
            this.set('sortOn', [on, 1]);
        }
    },
    oninit: function (options) {
        
        this.on('add', function (event) {

            this.get('mytraveller').set('add', true);
            this.get('mytraveller').set('currentTraveller', null);
            //this.get('mytraveller').set('currentTraveller', _.last(_.filter(this.get('mytraveller').travellers, {'id': id})));

        });
        this.on('edit', function (event) {
            this.set('mytraveller.edit',true);
            this.update('mytraveller');
            // console.log("Inside edit");
            // console.log(this.get('mytraveller'));
            //this.get('mytraveller').set('currentTravellerId', id);
            //this.get('mytraveller').set('currentTraveller', _.last(_.filter(this.get('mytraveller').travellers, {'id': id})));

        });
        this.on('delete', function (event) {
            var id = this.get('mytraveller').get('currentTravellerId');
            $.ajax({
                context: this,
                type: 'POST',
                url: '/b2c/traveler/delete/'+ _.parseInt(id),
                dataType: 'json',
                data: {'data': ''},
                success: function (idd) {
                    if(idd.result=='success'){
                    var index = _.findIndex(this.get('mytraveller.travellers'), {'id': id});
                    this.splice('mytraveller.travellers', index, 1);
                    this.get('mytraveller').set('currentTraveller', _.first(this.get('mytraveller.travellers')));
                    this.get('mytraveller').set('currentTravellerId', this.get('mytraveller.currentTraveller.id'));
                }else{
                    alert(idd.msg);
                }
                },
                error:function(error){
                    alert(error);
                }
            });


            //  console.log('index '+_.findIndex(this.get('mytraveller').travellers, function(chr) {  return chr.id == id;}));
            //  this.splice(this.get('mytraveller').travellers, _.findIndex(this.get('mytraveller').travellers, function(chr) {  return chr.id == id;}), 1);

        });
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