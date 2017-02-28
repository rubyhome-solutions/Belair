'use strict';

var Form = require('core/form'),
    User = require('stores/user/user')
    ;


module.exports = Form.extend({
    isolated: true,
    template: require('templates/layouts/profile_sidebar.html'),

    

    data: function() {
       // console.log('Inside Profile Sidebar data store');
        return {            
            user: new User()
        }
    },

    oncomplete: function() {
        $('.ui.checkbox', this.el).checkbox();
    }
});