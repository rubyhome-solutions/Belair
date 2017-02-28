'use strict';

var _ = require('lodash'),
    moment = require('moment')
    ;

module.exports = function() {
    var out = {
        D: _.range(1,32),
        M: _.range(1,13),
        MMMM: moment.months()
    };

    out.select = {
        D: _.map(out.D, function(i) { return { id: _.padLeft(i, 2, 0), text: i }; }),
        M: _.map(out.M, function(i) { return { id: _.padLeft(i, 2, 0), text: i }; }),
        MMMM: _.map(out.MMMM, function(i, k) { return { id: _.padLeft(k + 1, 2, 0), text: i }; }),

        passportYears: _.map(_.range(moment().year(), moment().year() + 15), function(i) { return { id: ''+i, text: ''+i }; }),

        birthYears: function(type) {
            return _.map(_.range(moment().year(), 1899, -1), function(i) { return { id: ''+i, text: ''+i }; });
        },

        cardYears: _.map(_.range(moment().year(), moment().add(25, 'years').year()), function(i) { return { id: ''+i, text: ''+i }; }),
        cardMonths: _.map(out.MMMM, function(i, k) { return { id: k + 1, text: _.padLeft(k+1, 2, '0') + ' ' + i }; })

    };

    return out;
};