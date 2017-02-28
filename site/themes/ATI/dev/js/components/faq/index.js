'use strict';

var Form = require('core/form'),
    
    Meta = require('stores/faq/meta')
    ;
var Auth = require('components/app/auth');
module.exports = Form.extend({
	
    isolated: true,
    template: require('templates/faq/index.html'),

    components: {
        'layout': require('components/app/layout'),
        'faq-html': require('components/faq/faq'),
    },
    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },
    
    onconfig: function() {
         this.set('faq.pending', true);
        this.set('faq.edit', false);
       Meta.instance()
                .then(function(meta) { this.set('meta', meta);}.bind(this));
        window.view = this; 
    },
    	
	signin: function() {
        var view = this;
        Auth.login()
            .then(function(data) {
                view.set('meta.user', data);
            });
    },

    signup: function() {
        Auth.signup();
    },
    data: function() {     
         return {            
            leftmenu:false,
        } 
    },
	leftMenu:function() { var flag=this.get('leftmenu'); this.set('leftmenu', !flag);},
   
    oncomplete: function() {
		$(document)
    .ready(function() {
    $('.menu .item')
   .tab();
   
   $('.tabular.menu .item').tab();

   $('.ui.dropdown')
  .dropdown();
  
  
   });	
    },
});