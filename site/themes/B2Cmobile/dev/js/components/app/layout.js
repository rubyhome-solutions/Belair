'use strict';

var Component = require('core/component'),
    Meta = require('stores/flight/meta'),
    $ = require('jquery')
    ;

module.exports = Component.extend({
    template: require('templates/app/layout/index.html'),

    data: function() {
        return {
            panel: true,
            meta: Meta.object

        }
    },

    oncomplete: function() {
       
        $('#Cpop').click(function(){
         //console.log('fsfds');
            $('.infoPop').toggleClass('show');
            $('.modalinfo').focus();
            //console.log('focused');
        });
        $('#closeinfo').click(function(){
             $('.infoPop').removeClass('show');
        });
   


        $(this.find('.panel')).height(
            $(window).height() - (Math.max(57, $(this.find('header')).height())+200)
        );
        
        
            $(this.nodes.currency).dropdown();
        this.observe('meta.display_currency', function(cur) {
           
                this.set('meta.display_currency',cur );
           
        });
        $('footer').show();
      
    },


    showPanel: function() { this.set('panel', true); },
    hidePanel: function() { this.set('panel', false); },

    setCurrency: function(code) { Meta.object.set('display_currency', code); 
        if(code!='INR'){
            $('curterm').show();
        }else{
            $('curterm').hide();
        }
    }
});
