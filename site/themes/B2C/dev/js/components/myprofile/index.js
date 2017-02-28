'use strict';

var Form = require('core/form'),
    Myprofile = require('stores/myprofile/myprofile'),
    Meta = require('stores/myprofile/meta')
    ;
module.exports = Form.extend({
    isolated: true,
    template: require('templates/myprofile/index.html'),

    components: {
        'layout': require('components/app/layout'),
        'myprofile-form': require('components/myprofile/form'),
        myprofileview: require('components/myprofile/view'),
       // leftpanel:require('components/layouts/profile_sidebar')
    },
    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },
    
    onconfig: function() {
        this.set('myprofile.pending', true);
        this.set('myprofile.edit', false);
       Myprofile.fetch()
                .then(function(myprofile) { this.set('myprofile.pending', false); this.set('myprofile', myprofile); }.bind(this));
       Meta.instance()
                .then(function(meta) { this.set('meta', meta);}.bind(this));
        window.view = this;
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