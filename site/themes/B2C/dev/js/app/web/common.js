'use strict';

require('./init/vendor');
require('./init/components');

require('web/vendor.less');
require('web/common.less');

window.onerror = function() {
    console.log(arguments);
};

$(function() {
    require('./vendor/mousetrap').bind('i d d q d', function() {
        window.localStorage.setItem('qa', 1);

        alert('God mod enabled');
        window.location.reload();
    });
});

