'use strict';

var Form = require('core/form'),
   // Mytraveller = require('app/stores/mytraveller/mytraveller')
    Mytraveller = require('stores/mytraveller/traveler'),
    Meta = require('stores/mytraveller/meta')
    //,
   // User = require('stores/user/user')
    ;

//require('modules/mytraveller/mytraveller.less');

module.exports = Form.extend({
    isolated: true,
    template: require('templates/contactus/contactus.html'),

    components: {
        'layout': require('components/app/layout'),
       // 'traveller-form': require('components/mytraveller/form'),
      //  travellerview: require('components/mytraveller/view'),
       // travellerlist: require('components/mytraveller/list'),
     //   leftpanel:require('components/layouts/profile_sidebar')
      //  profilesidebar: require('../layouts/profile_sidebar')
    },
    partials: {
        //'base-panel': require('templates/app/layout/panel.html')
    },
    
    onconfig: function() {
        this.set('mytraveller.pending', true);
        Meta.instance()
                .then(function(meta) { this.set('meta', meta);}.bind(this));
      // Mytraveller.fetch()
             //   .then(function(travelers) { this.set('mytraveller.pending', false); this.set('mytraveller', travelers); }.bind(this));
       
       // console.log(User.data());
       //this.set('user', User.data());
       // window.view = this;
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