$(function() {
   'use strict';

    window.onerror = function() {
      console.log('wtf error', arguments);
    };

    function zf(n) { n = n.toString(); return ('00' + n).slice(-2); }

    rivets.configure({
        preloadData: false
    });


    $.extend(rivets.formatters, {
        date: function(year, month, day) {
            if (year && month && day) {
                return [year, zf(month), zf(day)].join('-');
            }

            return null;
        },

        append: function(str, to) { return str + to; }
    });

    // will store common elements
    var $$ = {
        accordion: $('.accordion'),
        forms: {
            auth: $('#b2c-booking-auth'),
            passengers: $('#b2c-booking-passengers'),
            payment: $('#b2c-booking-payment')
        },
        booking_popup: $('#booking-popup')
    };

    // will store the models for passing to different forms
    var models = window.models = {
        journey: {},
        auth: { id: null, user_info_id: null, email: null, mobile: null},
        passengers: [],
        cc: {},
        booking: {
            open: false,
            pending: false,
            status: null,
            error: {
                code: null,
                message: null
            }
        }
    };

    var modifiers = {
        hoverTravelers: function(e, rv) {
            if (e.type == 'mouseenter') {
                var key = $(this).data('traveler'),
                    passenger = rv.passengers[key];

                if ($(this).find('#select-traveler').length) {
                    return;
                }

                $('#select-traveler')
                    .appendTo(e.target).find('.used').hide();

                if (!passenger) {
                    return;
                }

                $('#select-traveler')
                    .find('[data-id='+passenger.id+']')
                    .show().find('input:radio').attr('checked', true);

            }
        },
        pickTraveler: function(e, rv) {
            var ct = $(e.currentTarget),
                item = ct.parents('[data-passenger]'),
                key = item.data('passenger'),
                data = ct.data('traveler'),
                passenger = rv.passengers[key];

            if (passenger.id) {
                $('#select-traveler')
                    .find('[data-id='+passenger.id+']')
                    .removeClass('user').attr('checked', false);
            }

            $.each(data, function(k, v) {
                if (passenger.hasOwnProperty(k)) {
                    passenger[k] = v;
                }
            });

            ct.find('input:radio').prop('checked', true);
            ct.addClass('used');

            item.find('input, select').trigger('change');
        },
        searchTravelers: function(e, rv) {
            if(e.keyCode === 13) {
                e.preventDefault();

                var search = $(this).val().toLowerCase();

                $('#select-traveler li').each(function() {
                    var text = $(this).removeClass('hide').find('.name').text().toLowerCase();

                    if (-1 === text.indexOf(search)) {
                        $(this).addClass('hide');
                    }
                });

                return false;
            }
        },

        updateCCType: function() {
            console.log('ppp');
            var type = $.payment.cardType(models.cc.number);

            if (models.cc.type !== type) {
                models.cc.type = type;
            }


        }
    };

    // views storage
    var views = {
        auth: rivets.bind($$.forms.auth, { auth: models.auth, journey: models.journey, ui: models.ui }),
        passengers: rivets.bind($$.forms.passengers, { auth: models.auth, passengers: models.passengers, actions: modifiers, ui: models.ui }),
        payment: rivets.bind($$.forms.payment, { auth: models.auth, passengers: models.passengers, cc: models.cc, actions: modifiers, ui: models.ui }),
        booking: rivets.bind($$.booking_popup, { booking: models.booking })
    };

    var actions = {
        wizard: {
            enable: function(step) {
                $$.accordion.find('> h3:eq('+step+')').addClass('enabled').removeClass('edit');

                return this;
            },

            activate: function(step) {
                $$.accordion.accordion('activate', step);

                return this;
            }
        },

        auth: {
            submit: function($form, errors, hasError) {
                if (hasError) {
                    return;
                }

                $$.forms.auth.ajaxSubmit({
                    dataType: 'json',
                    success: function(data) {
                        console.log('forms.auth.submit.success', data);
                        if (data.id && data.user_info_id) {
                            models.auth.id = data.id;
                            models.auth.user_info_id = data.user_info_id;

                            actions.wizard
                                .enable(1).activate(1);
                        }
                    }
                });
            }
        },

        passengers: {
            submit: function($form, errors, hasError) {
                if (hasError) {
                    return;
                }

                $$.forms.passengers.ajaxSubmit({
                    dataType: 'json',
                    success: function(data) {
                        console.log('forms.passengers.submit.success', data);

                        data.forEach(function(v, k) {
                            models.passengers[k].id = v;
                        });

                        actions.wizard
                            .enable(2).activate(2);
                    }
                });
            }
        },

        payment: {
            submit: function($form, errors, hasError) {
                if (hasError) {
                    return;
                }

                var b = models.booking;

                b.pending = true;
                b.status = 'Checking Availability and Fare';
                b.open = true;

                $$.forms.payment.ajaxSubmit({
                    dataType: 'json',
                    success: function(data) {
                        if (data.url) {
                            b.status = 'Processing payment';
                            actions.payment.doPay(data);
                        }

                        if (data.errorCode) {
                            b.pending = false;
                            b.error = { code: data.errorCode, message: data.message };
                        }
                    }
                });
            },

            doPay: function(data) {
                var form;
                form = $('<form />', {
                    id: 'tmpForm',
                    action: data.url,
                    method: 'POST',
                    style: 'display: none;'
                });

                var input = data.data;
                if (typeof input !== 'undefined' && input !== null) {
                    $.each(input, function (name, value) {
                        if (value !== null) {
                            $('<input />', {
                                type: 'hidden',
                                name: name,
                                value: value
                            }).appendTo(form);
                        }
                    });
                }

                form.appendTo('body').submit();
            }
        }
    };

    var validateCC = {
        number: function(value, messages, attribute) {
            this._cv.apply(this, arguments);
            if (messages.length > 0) {
                return;
            }

            if (!$.payment.validateCardNumber(value)) {
                messages.push('Credit card number is not valid');
            }
        },

        exp_year: function(value, messages, attribute) {
            this._cv.apply(this, arguments);
            if (messages.length > 0) {
                return;
            }

            if (models.cc.month && models.cc.year && !$.payment.validateCardExpiry(models.cc.month, models.cc.year)) {
                messages.push('Expiry date is not valid');
            }
        },

        cvv: function(value, messages, attribute) {
            this._cv.apply(this, arguments);
            if (messages.length > 0) {
                return;
            }

            if (!$.payment.validateCardCVC(value, models.cc.type)) {
                messages.push('CVV no is not valid');
            }
        }
    };

    var initialize = function() {
        // will allow opening only enabled panels
        $$.accordion.on("accordionbeforeactivate", function () {
            var ok = arguments[1].newHeader.hasClass("enabled");

            if (ok) {
                $$.accordion.find("> h3.enabled").addClass('edit');
                arguments[1].newHeader.removeClass('edit');
            }

            return ok;
        });

        // will get the passengers, needed this so rivets can successfully bind
        $('[data-passenger]').each(function() {
            models.passengers[$(this).data('passenger')] = {};
        });



        views.payment.publish();
        views.passengers.publish();
        views.auth.publish();

        views.auth.sync();
        views.passengers.sync();
        views.payment.sync();
        views.booking.sync();

        setTimeout(function() {
            $$.forms.payment.data('settings').attributes.forEach(function(v, k) {
                if (validateCC[v.name]) {
                    v._cv = v.clientValidation;
                    v.clientValidation = validateCC[v.name];
                }
            });
        }, 200);

    };


    if (!window.b2c) window.b2c = {};
    $.extend(window.b2c, { booking: actions });

    initialize();
});