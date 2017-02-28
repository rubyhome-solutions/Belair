'use strict';

var Form = require('core/form'),
        moment = require('moment'),
        _ = require('lodash'),
        Q = require('q'),
        accounting = require('accounting.js')
        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
        ;


var t2m = function (time) {
    var i = time.split(':');

    return i[0] * 60 + i[1];
};

module.exports = Form.extend({
    isolated: true,
    template: require('templates/mybookings/amendment.html'),
    data: function () {

        return {
            formatBirthDate: function (date) {
                if (moment.isMoment(date)) {
                    // this.get('mytraveller').set('currentTraveller.birthdate', date.format('YYYY-MM-DD'));
                    return date.format('YYYY-MM-DD');
                }
                else {
                    return date;
                }
            },
            formatTitle: function (title) {
                var titles = this.get('meta').get('titles');
                //console.log(titles);
                // console.log(title);
                return  _.result(_.find(titles, {'id': title}), 'name');
            },
            formatName: function (name) {
                var string = name.toLowerCase();
                return  string.charAt(0).toUpperCase() + string.slice(1);
            },
            formatTravelDate: function (date) {
                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ll');//format('MMM DD YYYY');        
            },
            formatTravelDate2: function (date) {
                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ddd MMM D YYYY');//format('MMM DD YYYY');        
            },
            formatTravelDate3: function (date) {
                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ddd HH:mm');//format('MMM DD YYYY');        
            },
            travellerBookingStatus: function (status) {
                if (status == 1 || status == 2)
                    return 'confirm';
                else
                    return 'notconfirm';
            },
            travellerBookingStatusMessage: function (status) {
                if (status == 2)
                    return 'confirmed';
                else {
                    var st = this.get('meta').get('abbookingStatus');
                    return  _.result(_.find(st, {'id': status}), 'name');
                }
            },
            diff: function (end, start) {

                var ms = moment(end, "YYYY-MM-DD hh:mm:ss").diff(moment(start, "YYYY-MM-DD hh:mm:ss"));
                var d = moment.duration(ms);
                return Math.floor(d.asHours()) + 'h ' + d.minutes() + 'm';

            },
            formatBookingDate: function (date) {
                return moment(date, "YYYY-MM-DD hh:mm:ss").format('ll');//format('MMM DD YYYY');        
            },
            formatBookingStatusClass: function (bs) {
                if (bs == 1 || bs == 2 || bs == 3 || bs == 7)
                    return "progress";
                else if (bs == 4 || bs == 5 || bs == 6 || bs == 12)
                    return "cancelled";
                else if (bs == 8 || bs == 9 || bs == 10 || bs == 11)
                    return "booked";

            },
            formatBookingStatusMessage: function (bs) {
                var titles = this.get('meta').get('bookingStatus');
                return  _.result(_.find(titles, {'id': bs}), 'name');
            },
            convert: function (amount) {
                return accounting.formatMoney(amount, '');
            }
        }

    },
    oninit: function (options) {

        this.on('back', function (event) {
            this.get('mybookings').set('summary', true);
        });
        this.on('printdiv', function (event) {
            window.print();
        });
        this.on('asPDF', function (event, id) {
            //window.location('/b2c/airCart/asPDF/'+id);
            location.href = "/b2c/airCart/asPDF/" + id;
        });

    },
    select: function (j, k) {

        var value = this.get('mybookings').get('currentCartDetails.bookings[' + j + '].traveller[' + k + '].selected');
        this.get('mybookings').set('currentCartDetails.bookings[' + j + '].traveller[' + k + '].selected', !value);

    },
    amendTicket: function (type) {
        var cart = this.get('mybookings').get('currentCartDetails');
        var arrayOfIds = [];
        _.forEach(cart.bookings, function (b, bkey) {
            // console.log(b, bkey);
            var routeId = b.routes[0].id;
            _.forEach(b.traveller, function (t, tkey) {
                // console.log(n, key);
                if (t.selected) {
                    _.forEach(t.routes, function (r, rkey) {
                        arrayOfIds.push({ar: r.id, ab: t.bookingid});
                        //console.log(t.bookingid+'   '+r.id);
                    });

                }
            });
        });
        if (arrayOfIds.length == 0) {
            alert('No passenger is selected for cancellation!');
            return false;
        }
        //console.log(arrayOfIds);
        var amendmentTypes = this.get('meta').get('amendmentTypes');
        var view = this.get('mybookings');
        //     console.log(amendmentTypes);
        //console.log(view);
        var amendmentType = null;
        if (type == 1) {
            amendmentType = amendmentTypes.CANCEL;
        } else if (type == 2) {
            amendmentType = amendmentTypes.RESCHEDULE;
        }
        //console.log(amendmentType);
        
        
        
        if (amendmentType != null)
            if ($('#amendReason').val().length < 5) { // The reason is too short
                alert('The amendment reason is too short.\nPlease enter valid and detailed amendment reason!');
            } else {
            if(type == 1)
                var x=window.confirm("Are you sure? \nThis will Cancel your Ticket!");
            else if(type == 2)
                var x=window.confirm("Are you sure? \nThis will Reschedule your Ticket!");
            
            if (x){
                view.set('pending', true);
                Q.Promise(function (resolve, reject, progress) {
                    $.post('/airCart/amend/' + amendmentType, {
                        items: arrayOfIds,
                        reason: $('#amendReason').val()
                    }, function (data) {
                        if (data.result === 'success') {
//                                    location.href = location.href.split('#')[0] + '#cartAmendments';
                            //document.body.style.cursor = 'wait';
                          //  console.log(data);
                            //location.reload();
                            // location.hash = '#cartAmendments';
                            resolve();
                        } else {
                         //   console.log('rejected');
                            reject();
                            alert('Not able to cancel. Please contact CheapTicket.in support');
                        }
                    }, 'json');
                }).then(function () {                    
                     return  view.refreshCurrentCart(view);                    
                }, function (error) {
                    console.log(error);
                    view.set('pending', false);
                    reject();
                }).then(function () {
                    $('.ui.modal').modal('hide');
                    view.set('amend', false);
                //    console.log('finished');
                    resolve();
                });
            }
        }

    },
    oncomplete: function () {
        $('.ui.checkbox').checkbox();
        
        var view = this;
        $(this.find('.ui.modal')).modal('setting', 'closable', false).modal('show');
        $(this.find('.ui.modal')).modal('setting', 'onHidden', function () {
            view.get('mybookings').set('amend', false);
        });


    },
});
