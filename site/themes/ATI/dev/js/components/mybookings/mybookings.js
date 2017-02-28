'use strict';

var Form = require('core/form'),
        Auth = require('components/app/auth'),
        MybookingData = require('stores/mybookings/mybookings'),
        Meta = require('stores/mybookings/meta')
//    ,
//    User = require('stores/user/user')
        ;

//require('modules/mybookings/mybookings.less');

module.exports = Form.extend({
    isolated: true,
    template: require('templates/mybookings/mybookings.html'),
    components: {
        'layout': require('components/app/layout'),
        summary: require('components/mybookings/summary'),
        details: require('components/mybookings/details'),
        amendment: require('components/mybookings/amendment'),
      //  leftpanel: require('components/layouts/profile_sidebar')
                // travellerlist: require('./list'),
                //  profilesidebar: require('../layouts/profile_sidebar')
    },
    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },
    onconfig: function () {
       // console.log("Inside onconfig");
        var idd = window.location.href.split('mybookings/')[1];
         this.set('mybookings.print', false);
        var id=null;
        var urlid=null;
        if(idd){
            urlid=idd.split('#');
            id=urlid[0];
        }
        if (id) {
            var mm=Meta.instance()
                    .then(function (meta) {
                        this.set('meta', meta);
                    }.bind(this));
            this.set('mybookings.summary', false);
            this.set('mybookings.pending', true);
            this.set('mybookings.currentCartId', id);
            if(urlid[1]=='print'){
                            this.set('mybookings.print', true); 
                            $('header').hide();
                            $('body').css('padding-top','0px');
                            $('.content').css('padding','0px');
                        }
            MybookingData.getCurrentCart(id)
                    .then(function (data) {
                        this.set('mybookings', data);
                        this.get('mybookings').set('pending', false);
                        if(urlid[1]=='print'){
                            this.set('mybookings.print', true); 
                            $('header').hide();
                            $('body').css('padding-top','0px');
                            $('.content').css('padding','0px');
                            window.print();
                        }
                    }.bind(this)); 
                 //   console.log(urlid[1]);
                    
        } else {
            this.set('mybookings.amend', false);
            this.set('mybookings.summary', true);
            this.set('mybookings.pending', true);
            Meta.instance()
                    .then(function (meta) {
                        this.set('meta', meta);
                    }.bind(this));
            MybookingData.fetch()
                    .then(function (data) {
                        this.set('mybookings', data);
                        this.get('mybookings').set('pending', false);
                         
                    }.bind(this));
        }

        // this.set('user', User);
        window.view = this;
    },
    data: function () {
        return {
            leftmenu: false,
        }
    },
    leftMenu: function () {
        var flag = this.get('leftmenu');
        this.set('leftmenu', !flag);
    },

    signin: function () {
        var view = this;
        Auth.login()
                .then(function (data) {
                    console.log(data);
            if (data && data.id) {
                window.location.href = '/b2c/airCart/mybookings/' + view.get('mybookings.currentCartDetails.id');
            }
                 });
    },  
    signup: function() {
        Auth.signup();
    },
    oncomplete: function () {
       
//        this.observe('mybookings', function(value) {
//            console.log("mybookings changed ");
//            
//            //this.get('mytraveller').set('currentTraveller', value);
//        }, {init: false});

    }
});


