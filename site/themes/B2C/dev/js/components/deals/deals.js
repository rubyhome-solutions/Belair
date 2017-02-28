'use strict';

var Form = require('core/form'),
  
    Mytraveller = require('stores/mytraveller/traveler'),
    Meta = require('stores/mytraveller/meta')
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/deals/deals.html'),

    components: {
        'layout': require('components/app/layout'),
     
    },
    partials: {
    
    },
    
    onconfig: function() {
        this.set('mytraveller.pending', true);
        Meta.instance()
                .then(function(meta) { this.set('meta', meta);}.bind(this));
    },
    data: function() {
     
        return {            
            leftmenu:false,
        }
    },
 leftMenu:function() { var flag=this.get('leftmenu'); this.set('leftmenu', !flag);},
   
    oncomplete: function() {
        if (MOBILE) {
            var open = false;
            $('#m_menu').sidebar({ onHidden: function() { $('#m_btn').removeClass('disabled');  }, onShow: function() { $('#m_btn').addClass('disabled');  }});
            $('.dropdown').dropdown();

            $('#m_btn', this.el).on('click.layout',function(){
                if (!$(this).hasClass('disabled')) {
                    $('#m_menu').sidebar('show');
                }

            });

            $('.pusher').one('click', function(e) {
                e.stopPropagation();
            });

        }
        
        $('.ui.checkbox', this.el).checkbox();
    }
});