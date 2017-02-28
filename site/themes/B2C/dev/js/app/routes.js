var FLIGHTS = '/b2c/flights';

module.exports = {
    flights: {
        search: FLIGHTS + '/search',
        booking: function(id) { return '/b2c/booking/' + id; },
    },
};

//new
var profilemeta = require('stores/myprofile/meta'),
    bookingemeta = require('stores/mybookings/meta'),
    travellermeta = require('stores/mytraveller/meta'),
    myProfile = require('stores/myprofile/myprofile'),
    myBooking = require('stores/mybookings/mybookings'),
    myTraveller = require('stores/mytraveller/mytraveller');
    
var actions = {
    profile: function(ctx, next) {
        (new myProfile()).render('#app').then(function() { next(); });
    },
    booking: function(ctx, next) {
        (new myBooking()).render('#app').then(function() { next(); });
    },
    traveller: function(ctx, next) {
        (new myTraveller()).render('#app').then(function() { next(); });
    },
};

profilemeta.instance().then(function(meta) {
    page('/b2c/users/myprofile/', actions.profile);
     page({click: false});
});

bookingemeta.instance().then(function(meta) {
    page('/b2c/users/mybookings/', actions.booking);
     page({click: false});
});

travellermeta.instance().then(function(meta) {
    page('/b2c/users/mytraveller/', actions.traveller);
     page({click: false});
});