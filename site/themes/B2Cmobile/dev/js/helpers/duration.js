'use strict';

function paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

module.exports = function() {
    return {
        format: function(duration) {
            if (!duration)
                return;

            var i = duration.asMinutes(),
                hours = Math.floor(i/60),
                minutes = i % 60
                ;

            return paddy(hours, 2) + 'h ' + paddy(minutes, 2) + 'm';
        }
    };
};