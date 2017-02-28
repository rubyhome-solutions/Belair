'use strict';

var Form = require('core/form'),
        Auth = require('components/app/auth'),
         Meta = require('stores/mybookings/meta')
        ;


module.exports = Form.extend({
    isolated: true,
    template: require('templates/cms/index.html'),
    components: {
        'layout': require('components/app/layout'),
        auth: require('components/app/auth'),
    },
    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },
    data: function () {

        return {
            pending: true,
            submitted:false,
            leftmenu: false,
        };
    },
    leftMenu: function () {
        var flag = this.get('leftmenu');
        this.set('leftmenu', !flag);
    },
    onconfig: function () {
         Meta.instance()
                    .then(function (meta) {
                        this.set('meta', meta);
                    }.bind(this));
        var idd = window.location.href.split('/');
        var id = idd[idd.length - 1];
       // console.log(id);
        this.set('cmsid', id);
        var view = this;
        if (id) {
            $.ajax({
                type: 'GET',
                url: '/b2c/cms/getCMSData/' + _.parseInt(id),
                data: {'data': ''},
                success: function (data) {
                    view.set('content', data);
                    view.set('pending', false);
                    //console.log(data);
                },
                error: function (error) {
                    view.set('content', 'Not Found Any Data');
                    view.set('pending', false);
                    // console.log("failed");
                    // console.log(error);
                }
            });

        } else {
                    view.set('content', 'Not Found Any Data');
                    view.set('pending', false);
        }
        $.ajax({
                type: 'GET',
                url: '/site/captcha?refresh=1',
                data: {'data': ''},
                success: function (data) {
                   
                },
                error: function (error) {
                   console.log(error);
                }
            });
            this.setCaptcha();
            
    },
    setCaptcha:function(){
               var length=8;
            var chars='#aA';
            var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
          this.set('captcha','/site/captcha?v='+result);  
    },
    
    refreshCaptcha:function(){
         $.ajax({
                type: 'GET',
                url: '/site/captcha?refresh=1',
                data: {'data': ''},
                success: function (data) {
                   
                },
                error: function (error) {
                   console.log(error);
                }
            });
            this.setCaptcha();
    },
      submitContactForm:function(){
        var view = this;
        view.set('submitting',true);
        view.set('errors',null);
        $.ajax({
            type: 'POST',
            url: '/site/contact/',
            data: $('form').serialize(),
            success: function (idd) {
                //console.log(idd);
                view.set('submitting',false);
                if (idd.result == 'success') {
                    view.set('submitted',true);
                }
                else if(idd.result == 'error'){
                    view.set('errors',idd.message);
                 //   console.log(idd.message);
                }
            },
            error:function(error){
                view.set('submitting',false);
            }
        });
    },
  signup: function() {
        Auth.signup();
    },
    signin: function () {
        var view = this;

        Auth.login()
                .then(function (data) {
                    console.log(data);
                    if (data && data.id) {
                        window.location.href = '/b2c/airCart/mybookings';
                    }
                });
    },
    oninit:function(){
       this.on('closemessage', function (event) {
          $('.ui.positive.message').fadeOut();
        });
    },
});