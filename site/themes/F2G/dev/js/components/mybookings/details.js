'use strict';

var Form = require('core/form'),
        Auth = require('components/app/auth'),
        moment = require('moment'),
        _ = require('lodash'),
        accounting = require('accounting.js')
        //Mytraveller = require('app/stores/mytraveller/mytraveller')   ;
        ;


var t2m = function (time) {
    var i = time.split(':');

    return i[0] * 60 + i[1];
};

module.exports = Form.extend({
    isolated: true,
    template: require('templates/mybookings/details.html'),
    data: function () {

        return {
            email: false,
            submitting: false,
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
                if (status == 2)
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
                if (bs == 1 || bs == 2 || bs == 3 ||  bs == 7)
                    return "progress";
                else if (bs == 4 || bs == 5 || bs == 6 || bs == 12)
                    return "cancelled";
                else if (bs == 8 || bs == 9 || bs == 10 || bs == 11)
                    return "booked";

            },
            formatBookingStatusMessage: function (bs) {
                var bks = this.get('meta').get('bookingStatus');
                return  _.result(_.find(bks, {'id': bs}), 'name');
            },
            convert: function (amount) {
                return accounting.formatMoney(amount, '', 0);
            },
            convertIxigo: function (amount) {
                return accounting.unformat(accounting.formatMoney(amount, '', 0));
            }
        }

    },
    toggleemail: function () {
        var user = this.get('meta.user');
            if (typeof user !== 'undefined') {
        if (this.get('submitting'))
            return false;
        var email = this.get('meta.user.email');
        //this.set('email', email);
        $('#email').val(email);
        $(this.find('.ui.modal')).modal('show');
        return false;
        } else {
        $(this.find('.ui.modal')).modal('show');
        return false;
               // this.signin();
        }
    },
    oninit: function (options) {
        this.on('back', function (event) {
            var currentURL = window.location.href;
            if (currentURL.indexOf("mybookings/") > -1)
                window.location.href = '/b2c/airCart/mybookings';
            else if (currentURL.indexOf("mybookings") > -1)
                this.get('mybookings').set('summary', true);
            else if (currentURL.indexOf("guestbooking") > -1)
                window.location.href = '/b2c/airCart/guestbooking';
        });
        this.on('cancel', function (event) {
            var user = this.get('meta.user');
            if (typeof user !== 'undefined') {
                this.get('mybookings').set('amend', true);
                this.get('mybookings').set('cancel', true);
                this.get('mybookings').set('reschedule', false);
            } else {
                this.signinn();
            }

        });
        this.on('reschedule', function (event) {
            var user = this.get('meta.user');
            if (typeof user !== 'undefined') {
                this.get('mybookings').set('amend', true);
                this.get('mybookings').set('reschedule', true);
                this.get('mybookings').set('cancel', false);
            } else {
                this.signinn();
            }
        });
        this.on('printdiv', function (event, id) {
            //window.print();
            var user = this.get('meta.user');
            if (typeof user !== 'undefined') {
                window.location.href = '/airCart/print/' + id;
            } else {
                this.signinn();
            }
        });
        this.on('asPDF', function (event, id) {
            //window.location('/b2c/airCart/asPDF/'+id);
            var user = this.get('meta.user');
            if (typeof user !== 'undefined') {
                window.location.href = "/airCart/asPDF/" + id;
            } else {
                this.signinn();
            }
        });
        this.on('closemessage', function (event) {
            $('.ui.positive.message').fadeOut();
        });

    },
    submit: function () {
        var view = this;
        var user = this.get('meta.user');
        
            this.set('submitting', true);
            $('.message').fadeIn();
            $.ajax({
                type: 'POST',
                url: '/b2c/airCart/sendEmail/' + view.get('mybookings.currentCartDetails.id'),
                data: {email: $('#email').val(), },
                dataType: 'json',
                complete: function () {
                    view.set('submitting', false);
                    $(".email_sent").html("<div class='email_sent'>Email Sent</div>");
                },
                success: function (data) {

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
                $(view.find('.ui.modal')).modal('hide');
            });
       
    },
    signinn: function () {
        var view = this;
     //   console.log(view.get('mybookings'));
        Auth.login()
                .then(function (data) {
                    //   console.log(data);
                    //   console.log(view.get('mybookings').currentCartDetails.id);

                    if (data && data.id) {
                        view.set('meta.user', data);
                        window.location.href = '/b2c/airCart/mybookings/' + view.get('mybookings.currentCartDetails.id');
                    }
                });
    },
    oncomplete: function () {
    },
    back: function() {
    	document.location.href="/";
    }
});