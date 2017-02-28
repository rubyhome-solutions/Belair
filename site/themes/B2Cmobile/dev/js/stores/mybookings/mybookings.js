'use strict';

var _ = require('lodash'),
        Q = require('q'),
        $ = require('jquery'),
        moment = require('moment'),
        validate = require('validate')

        ;

var Store = require('core/store');

var MybookingData = Store.extend({
    computed: {
        price: function () {
            _.reduce(this.get(' '))
        }
    },
    refreshCurrentCart: function (view) {
        console.log("refreshCurrentCart");
        return Q.Promise(function (resolve, reject, progress) {
            $.ajax({
                type: 'POST',
                url: '/b2c/airCart/getCartDetails/' + _.parseInt(view.get('currentCartId')),
                dataType: 'json',
                data: {'data': ''},
                success: function (data) {

                    var details = {
                        id: data.id, email:data.email,upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status,booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity,
                        curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
                        bookings: _.map(data.bookings, function (i) {
                            return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
                                traveller: _.map(i.traveller, function (t) {
                                    return {
                                        id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
                                        airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,
                                        basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status,statusmsg: t.statusmsg, selected: false,
                                        routes: _.map(t.routes, function (ro) {
                                            return {
                                                id: ro.id, origin: ro.origin, originDetails: ro.originDetails, destinationDetails: ro.destinationDetails, destination: ro.destination, departure: ro.departure, arrival: ro.arrival, carrier: ro.carrier, carrierName: ro.carrierName, flightNumber: ro.flightNumber,
                                                flighttime: ro.flighttime, originTerminal: ro.originTerminal, destinationTerminal: ro.destinationTerminal, meal: ro.meal, seat: ro.seat, aircraft: ro.aircraft,
                                            };
                                        }).sort(function (x, y) {
                            var d1 = new Date(x.departure);
                            var d2 = new Date(y.departure);
                            if (d1 > d2) {
                                return 1;
                            } else {
                                return -1;
                            }
                            ;

                        })
                                    };
                                }),
                                routes: _.map(i.routes, function (t) {
                                    return {
                                        id: t.id, origin: t.origin, originDetails: t.originDetails, destinationDetails: t.destinationDetails, destination: t.destination, departure: t.departure, arrival: t.arrival, carrier: t.carrier, carrierName: t.carrierName, flightNumber: t.flightNumber,
                                        flighttime: t.flighttime, originTerminal: t.originTerminal, destinationTerminal: t.destinationTerminal, meal: t.meal, seat: t.seat, aircraft: t.aircraft,
                                    };
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

                    // console.log(details);
                    //console.log(data);
                    view.set('currentCartDetails', details);
                    var index = _.findIndex(view.get('carts'), {'id': details.id});
                    // console.log('index: '+index);

                    var carts = view.get('carts');
                    carts[index].booking_status = details.booking_status;
                    view.set('carts', carts);
                    view.set('summary', false);
                    view.set('pending', false);

                    resolve();
                },
                error: function (error) {
                    alert(error);
                }
            });
        }).then(function () {
            console.log('finsihed store: ');
        }, function (error) {
            console.log(error);
        });
    },
});

MybookingData.getCurrentCart = function (id) {
   // console.log("getCurrentCart");
    return Q.Promise(function (resolve, reject, progress) {
        $.ajax({
            type: 'POST',
            url: '/b2c/airCart/getCartDetails/' + _.parseInt(id),
            dataType: 'json',
            data: {'data': ''},
            success: function (data) {
               // console.log("done");
            },
            error: function (error) {
                alert(error);
            }
        }).then(function (data) {
        var details = {
            id: data.id, email:data.email,ticketstatusmsg:data.ticketstatusmsg,upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status,clientSourceId:data.clientSourceId,segNights:data.segNights,
            booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
            bookings: _.map(data.bookings, function (i) {
                return {id: i.id, upcoming: i.upcoming, source_id: i.source_id, destination_id: i.destination_id, source: i.source, flighttime: i.flighttime, destination: i.destination, departure: i.departure, arrival: i.arrival,
                    traveller: _.map(i.traveller, function (t) {
                        return {
                            id: t.id, bookingid: t.bookingid, faretype: t.faretype, title: t.title, type: t.type, first_name: t.first_name, last_name: t.last_name,
                            airline_pnr: t.airline_pnr, crs_pnr: t.crs_pnr, ticket: t.ticket, booking_class: t.booking_class, cabin: t.cabin,
                            basicfare: t.basicfare, taxes: t.taxes, total: t.total, status: t.status,statusmsg: t.statusmsg, selected: false,
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
                    })
//                            .sort(function (x, y) {
//                            var d1 = new Date(x.departure);
//                            var d2 = new Date(y.departure);
//                            if (d1 > d2) {
//                                return 1
//                            } else {
//                                return -1
//                            }
//                            ;
//
//                        }),
                };
            }), };
        data.currentCartDetails= details;
        data.carts=[];
        data.carts.push(details);
        data.cabinType = 1;
    data.add = false;
    data.edit = false;
    data.currentCartId = details.id;
 //   console.log(data.currentCartDetails);
    data.summary = false;
    data.print = false;
    data.pending = false;
    data.amend = false;
    data.cancel = false;
    data.reschedule = false;
   
    data.errors = {};
    data.results = [];

    data.filter = {};
    data.filtered = {};
    return resolve(new MybookingData({data: data}));

        
    }, function (error) {
        console.log(error);
    })
    });
};

MybookingData.parse = function (data) {
    //console.log("MybookingData.parse");
    //data.flights = _.map(data.flights, function(i) { return Flight.parse(i); });
    //   console.log(data);   
    var flgUpcoming = false;
    var flgPrevious = false;
    data.carts = _.map(data, function (i) {
        if (i.upcoming == 'true')
            flgUpcoming = true;
        else
            flgPrevious = true;
        return {id: i.id,email:i.email, created: i.created, totalAmount: i.totalAmount, booking_status: i.booking_status,
            returndate: i.returndate, isMultiCity: i.isMultiCity, curency: i.curency, upcoming: i.upcoming,
            bookings: _.map(i.bookings, function (b) {

                return {
                    id: b.id, source: b.source, destination: b.destination, source_id: b.source_id, destination_id: b.destination_id,
                    departure: b.departure, arrival: b.arrival,
                    travelers: _.map(b.traveller, function (t) {
                        return {id: t.id, name: t.name};
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

            }),
            traveler: _.map(i.travellerdtl, function (j) {
                return {id: j.id, name: j.name,
                    src: _.map(j.src, function (g) {
                        return {name: g};
                    }),
                    dest: _.map(j.dest, function (g) {
                        return {name: g};
                    }),
                };
            }),
        };
    });
    data.carts.sort(function (x, y) {
        if (x.id < y.id) {
            return 1
        } else {
            return -1
        }
        ;

    });
    //         console.log(data.carts);  
    //          data.currentTraveller= _.first(data.travellers);
    //           data.currentTravellerId=data.currentTraveller.id;
    data.cabinType = 1;
    data.add = false;
    data.edit = false;
    data.currentCartId = null;
    data.currentCartDetails = null;
    data.summary = true;
    data.pending = true;
    data.amend = false;
    data.cancel = false;
    data.print = false;
    data.reschedule = false;
    data.flgUpcoming = flgUpcoming;
    data.flgPrevious = flgPrevious;
    data.errors = {};
    data.results = [];

    data.filter = {};
    data.filtered = {};
    return new MybookingData({data: data});

};
MybookingData.fetch = function () {
    //console.log("MybookingData.fetch");
    return Q.Promise(function (resolve, reject) {
        $.getJSON('/b2c/airCart/getMyBookings')
                .then(function (data) {
                    resolve(MybookingData.parse(data));

                })
                .fail(function (data) {
                    //TODO: handle error
                    console.log("failed");
                    console.log(data);
                });
    });
};
module.exports = MybookingData;