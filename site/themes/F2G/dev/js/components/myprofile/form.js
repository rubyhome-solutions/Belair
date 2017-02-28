'use strict';

var Form = require('core/form'),
        _ = require('lodash'),
        moment = require('moment'),
        Myprofile = require('stores/myprofile/myprofile'),
        validate = require('validate')
        ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/myprofile/form.html'),
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
            errors:null,
            statelist: [],
            citylist: [],
            formatStateList: function (statelist) {
                var data = _.cloneDeep(statelist);

                return _.map(data, function (i) {
                    return {id: i.id, text: i.name};
                });
            },
            formatCityList: function (citylist) {
                var data = _.cloneDeep(citylist);

                return _.map(data, function (i) {
                    return {id: i.id, text: i.name};
                });
            },
            formatCountryList: function (countrylist) {
                var data = _.cloneDeep(countrylist);

                return _.map(data, function (i) {
                    return {id: i.id, text: i.name};
                });
            },
        }
    },
    onconfig: function (options) {
        

    },
    oninit: function (options) {
        var view = this;
        this.set('profileform.name', this.get('myprofile.name'));
        this.set('profileform.email', this.get('myprofile.email'));
        this.set('profileform.mobile', this.get('myprofile.mobile'));
        this.set('profileform.address', this.get('myprofile.address'));
        this.set('profileform.country', this.get('myprofile.country'));
        this.set('profileform.countrycode', this.get('myprofile.countrycode'));
        this.set('profileform.state', this.get('myprofile.state'));
        this.set('profileform.statecode', this.get('myprofile.statecode'));
        this.set('profileform.city', this.get('myprofile.city'));
        this.set('profileform.citycode', this.get('myprofile.citycode'));
        this.set('profileform.pincode', this.get('myprofile.pincode'));

        if (this.get('myprofile.countrycode') != null && this.get('myprofile.countrycode') != '') {
            view.get('myprofile').getStateList(view);
        }
        if (this.get('myprofile.statecode') != null && this.get('myprofile.statecode') != '') {
            view.get('myprofile').getCityList(view);
        }
        this.on('closemessage', function (event) {
          $('.ui.positive.message').fadeOut();
        });
        
    },
    edit: function () {
        var view = this;
        
        $.ajax({
            type: 'POST',
            url: '/b2c/users/updateSelf/',
            dataType: 'json',
            data: {'data': JSON.stringify(view.get('profileform'))},
            success: function (idd) {
                //console.log(idd);
                if (idd.result == 'success') {
                    window.location.href='/b2c/users/myprofile'
                }
                else if(idd.result == 'error'){
                    view.set('errors',idd.message);
                    console.log(idd.message);
                }
            }
        });

    },
    oncomplete: function () {
        var view = this;
       //text(this.get('profileform').city);
       $('#divstate').on('click',function(event){$('#divcity .ui.dropdown').dropdown('restore default text');
        //view.set('profileform.statecode',$('#divstate .item.active.selected').attr('data-value'));
        if((typeof(view.get('citylist')) != "undefined"))
        view.set('citylist',null);
       });
       $('#divcity').on('click',function(event){
           //console.log('oncliick id '+$('#divcity .item.active.selected').attr('data-value'));
         //  $('#divcity .ui.dropdown').dropdown('set selected', $('#divcity .item.active.selected').attr('data-value'));
          // view.set('profileform.citycode',$('#divcity .item.active.selected').attr('data-value'));
       });
       $('#divcountry').on('click',function(event){
           if((typeof(view.get('statelist')) != "undefined"))
            view.set('statelist',null);
        if((typeof(view.get('citylist')) != "undefined"))
        view.set('citylist',null);
           //console.log('oncliick id '+$('#divcity .item.active.selected').attr('data-value'));
         //  $('#divcity .ui.dropdown').dropdown('set selected', $('#divcity .item.active.selected').attr('data-value'));
          // view.set('profileform.citycode',$('#divcity .item.active.selected').attr('data-value'));
       });
        this.observe('profileform.countrycode', function (value) {
            if (this.get('profileform.countrycode') != null && this.get('profileform.countrycode') != '') {
                view.get('myprofile').getStateList(view);                
            }
        }, {init: false});
        this.observe('profileform.statecode', function (value) {
            if (this.get('profileform.statecode') != null && this.get('profileform.statecode') != '') {               
                  view.get('myprofile').getCityList(view);
            }
        }, {init: false});
        
    }
});