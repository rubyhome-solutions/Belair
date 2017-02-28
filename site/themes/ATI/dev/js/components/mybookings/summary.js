'use strict';

var Form = require('core/form'),
        moment = require('moment'),
        _ = require('lodash'),
        accounting = require('accounting.js');
//,
//Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
;


var t2m = function (time) {
    var i = time.split(':');

    return i[0] * 60 + i[1];
};

module.exports = Form.extend({
    isolated: true,
    template: require('templates/mybookings/summary.html'),
    data: function () {
        
        return {
            uemail:null,
            cid:null,
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
            money: function (amount) {
                return accounting.formatMoney(amount, '', 0);
            }
        }

    },
    oninit: function (options) {

//        $(this.find('.action a')).on('click', function (e) {
//            //console.log('inside cllick');
//            e.stopPropagation();
//            return false;
//        });
        this.on('closemessage', function (event) {
          $('.ui.positive.message').fadeOut();
        });
        this.on('toggleemail', function (e, id,email) {
                    
            this.set('uemail', email);
            this.set('cid', id);            
            $(this.find('.ui.modal')).modal('show');
            // e.stopPropagation();
            return false;
        });
        this.on('getdetail', function (event, id) {

            this.get('mybookings').set('currentCartId', id);
            this.get('mybookings').set('pending', true);
            this.get('mybookings').set('summary', false);
            $.ajax({
                context: this,
                type: 'POST',
                url: '/b2c/airCart/getCartDetails/' + _.parseInt(id),
                dataType: 'json',
                data: {'data': ''},
                success: function (data) {

                    var details = {
                        id: data.id, email:data.email,upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency,
                        fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,ticketstatusmsg:data.ticketstatusmsg,
                        bookings: _.map(data.bookings, function (i) {
                            return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
                                traveller: _.map(i.traveller, function (t) {
                                    return {
                                        id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
                                        airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,
                                        basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status, statusmsg: t.statusmsg, selected: false,
                                        routes: _.map(t.routes, function (ro) {
                                            return {
                                                id: ro.id, origin: ro.origin, originDetails: ro.originDetails, destinationDetails: ro.destinationDetails, destination: ro.destination, departure: ro.departure, arrival: ro.arrival, carrier: ro.carrier, carrierName: ro.carrierName, flightNumber: ro.flightNumber,
                                                flighttime: ro.flighttime, originTerminal: ro.originTerminal, destinationTerminal: ro.destinationTerminal, meal: ro.meal, seat: ro.seat, aircraft: ro.aircraft,
                                            };
                                        })
                                    };
                                }),
                                routes: _.map(i.routes, function (t) {
                                    return {
                                        id: t.id, origin: t.origin, originDetails: t.originDetails, destinationDetails: t.destinationDetails, destination: t.destination, departure: t.departure, arrival: t.arrival, carrier: t.carrier, carrierName: t.carrierName, flightNumber: t.flightNumber,
                                        flighttime: t.flighttime, originTerminal: t.originTerminal, destinationTerminal: t.destinationTerminal, meal: t.meal, seat: t.seat, aircraft: t.aircraft,
                                    };
                                }).sort(function (x, y) {
                            var d1 = new Date(x.departure);
                            var d2 = new Date(y.departure);
                            if (d1 > d2) {
                                return 1
                            } else {
                                return -1
                            }
                            ;

                        }),
                            };
                        }).sort(function (x, y) {
                            var d1 = new Date(x.departure);
                            var d2 = new Date(y.departure);
                            if (d1 > d2) {
                                return 1
                            } else {
                                return -1
                            }
                            ;

                        }), };

                 //   console.log(details);
                    //console.log(data);
                    this.get('mybookings').set('currentCartDetails', details);
                    this.get('mybookings').set('summary', false);
                    this.get('mybookings').set('pending', false);
                },
                error: function (error) {
                    alert(error);
                }
            });
        });




    },
    submit: function () {
        var view = this;
        this.set('submitting', true);
        $('.message').fadeIn();
        $.ajax({
            type: 'POST',
            url: '/b2c/airCart/sendEmail/' + this.get('cid'),
            data: {email: this.get('uemail'), },
            dataType: 'json',
            complete: function () {
                view.set('submitting', false);
            },
            success: function (data) {
                $(view.find('.ui.modal')).modal('hide');

                if (view.deferred) {
                    view.deferred.resolve(data);
                }
            },
            error: function (xhr) {
                try {
                    var response = JSON.parse(xhr.responseText);

                    if (response.errors) {
                        view.set('errors', response.errors);
                    }
                } catch (e) {
                    view.set('errorMsg', 'Server returned error. Please try again later');
                }
            }
        }).then(function (data) {

        });
    },
    oncomplete: function () {
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
        
//        this.observe('uemail', function(value) {
//            console.log(value);
//             this.set('uemail', value);
//        }, {init: false});
//        this.observe('mytraveller.currentTravellerId', function(value) {
//            //console.log("currentTravellerId changed ");
//            //console.log(value);
//            //this.get('mytraveller').set('currentTravellerId', value);
//        }, {init: false});
    }
});