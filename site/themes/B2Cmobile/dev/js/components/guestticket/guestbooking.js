'use strict';
var $ = require('jquery'),
        Q = require('q')
        ;
var Form = require('core/form')
        ;
var GuestBooking = Form.extend({
    template: require('templates/guestticket/guestbooking.html'),
    data: function () {
        return {
            action: 'guestbooking',
            submitting: false,
            mobile: '',
            pnr: '',
            lastname: '',
            pnr2: ''
        }
    },
    oncomplete: function () {

    },
    getticketbypnr: function () {
        var view = this;
        this.set('errorMsg', null);
        this.set('error', null);
        this.set('submitting', true);
        this.set('mybookings.pending', true);
        $.ajax({
            type: 'POST',
            context: this,
            url: '/b2c/airCart/getguestbooking/',
            data: {mobile: this.get('mobile'), pnr: this.get('pnr')},
            dataType: 'json',
            complete: function () {
                view.set('submitting', false);
            },
            success: function (data) {
                console.log(data.error);
                if (typeof data.error == 'undefined') {
                    var details = {
                        id: data.id, upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity,curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
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

                    //console.log(details);
                    //console.log(data);
                    this.set('mybookings.currentCartDetails', details);
                    this.set('mybookings.summary', false);
                    this.set('mybookings.pending', false);
                    this.set('mybookings.loggedin', true);
                } else {
                    view.set('submitting', false);
                    this.set('errorMsg', data.error);
                    this.set('error', 'Not Found');
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
        });
    },
    getticketbylastname: function () {
        var view = this;
        this.set('errorMsg2', null);
        this.set('error2', null);
        this.set('submitting2', true);
        this.set('mybookings.pending', true);
        $.ajax({
            type: 'POST',
            context: this,
            url: '/b2c/airCart/getguestbooking/',
            data: {lastname: this.get('lastname'), pnr2: this.get('pnr2')},
            dataType: 'json',
            complete: function () {
                view.set('submitting2', false);
            },
            success: function (data) {

                console.log(data.error);
                if (typeof data.error == 'undefined') {
                    var details = {
                        id: data.id, upcoming: data.upcoming, created: data.created, totalAmount: data.totalAmount, booking_status: data.booking_status, booking_statusmsg: data.booking_statusmsg, returndate: data.returndate, isMultiCity: data.isMultiCity, curency: data.curency,fop:data.fop,baseprice:data.baseprice,taxes:data.taxes,fee:data.fee,totalAmountinwords:data.totalAmountinwords,customercare:data.customercare,
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

                    //console.log(details);
                    //console.log(data);
                    this.set('mybookings.currentCartDetails', details);
                    this.set('mybookings.summary', false);
                    this.set('mybookings.pending', false);
                    this.set('mybookings.loggedin', true);
                } else {
                    view.set('submitting', false);
                    this.set('errorMsg2', data.error);
                    this.set('error2', 'Not Found');
                }
            },
            error: function (xhr) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.errors) {
                        view.set('errors2', response.errors);
                    }
                } catch (e) {
                    view.set('errorMsg2', 'Server returned error. Please try again later');
                }
            }
        });
    },
});
module.exports = GuestBooking;