'use strict';

var Form = require('core/form'),
    moment = require('moment'),
    _ = require('lodash'),
   Mytraveller = require('stores/mytraveller/mytraveller')   
    ;


var t2m = function(time) {
    var i = time.split(':');

    return i[0]*60+i[1];
};

module.exports = Form.extend({
    isolated: true,
    template: require('templates/mytraveller/list.html'),


    data: function() {
        return {        
        }
    },

    oninit: function ( options ) {

    },
    mobileselect:function(id){
        var view=this;
		//console.log('inside mobileselect');
        $('.ui.dimmer').addClass('hideimp');
		$('body').removeClass('dimmable');
		$('body').removeClass('dimmed');
		$('body').removeClass('scrolling');
		$('body').removeAttr("style");
		
		$('.listtraveller').click(function(){
			$('.ui.dimmer').removeClass('hideimp');
			
			$('body').addClass('dimmable');
		$('body').addClass('dimmed');
		$('body').addClass('scrolling');
		//$('body').removeAttr('height');
			});
		
		
		    if(view.get('mytraveller.edit')){                
                window.location.href='/b2c/traveler/mytravelers/'+id;                
            }else{
            this.get('mytraveller').set('edit',false);
            this.get('mytraveller').set('add',false);
            view.get('mytraveller').set('currentTraveller',null);            
            view.get('mytraveller').set('currentTravellerId', id);
            var ct=_.last(_.filter(view.get('mytraveller.travellers'), {'id': id}));
            view.get('mytraveller').set('currentTraveller', ct);
        
		
		
		}
		},
		
		 test:function(id){
        var view=this;
            if(view.get('mytraveller.edit')){                
                window.location.href='/b2c/traveler/mytravelers/'+id;                
            }else{
            this.get('mytraveller').set('edit',false);
            this.get('mytraveller').set('add',false);
            view.get('mytraveller').set('currentTraveller',null);            
            view.get('mytraveller').set('currentTravellerId', id);
            var ct=_.last(_.filter(view.get('mytraveller.travellers'), {'id': id}));
            view.get('mytraveller').set('currentTraveller', ct);
        }	

    },
	
    oncomplete: function() {

    }
});