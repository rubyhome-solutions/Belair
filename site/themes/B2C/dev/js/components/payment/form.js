'use strict';

var _ = require('lodash'),
        $ = require('jquery')
        ;

var Form = require('core/form'),
        h_money = require('helpers/money'),
        h_duration = require('helpers/duration')(),
        h_date = require('helpers/date')()
        ;

var doPay = function (data) {
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
};

var checkUpiStatus = function (data, view) {
    var response = data.data;
    if (response.status == 'SUCCESS' && response.orderId) {
        var timer = 0;
        var timerID = setInterval(function () {
            if (timer == (60 * 1000 * 11)) {
                step.complete(view, 3);
                clearInterval(timerID);
                $('#message').html('Transaction timed out.Please try again later.');
                return false;
            }

            $.ajax({
                //timeout: 60000,
                type: 'POST',
                url: '/b2c/booking/hdfcUPI',
                data: {'orderId': response.orderId},
                dataType: 'json',
                complete: function () {

                },
                success: function (response) {
                    if (response.data.status != 'PENDING') {
                        clearInterval(timerID);
                        window.location.href = '/payGate/upiView/orderId/' + response.data.orderId;
                    } 

                    timer += 10000;
                },
                error: function (xhr) {
                    clearInterval(timerID);
                    step.complete(view, 3);
                    step.error(view, 3, xhr);
                }
            });

        }, 10000);
    }
};

var upiPaymentResponse = function (data, view) {
    var response = data.data;

    if (response.status == 'FAILED') {
        step.complete(view, 3);
        Dialog.open({
            header: 'Transaction Alert',
            message: '<div style="text-align: center">' + response.message + '</div>',

            buttons: [
                ['Back to Search', function () {
                        window.location.href = '/b2c/flights' + view.get('searchurl') + '?force=1';
                    }]
            ],
            closeButton: false
        }, 2);

        return;
    } else if (response.status == 'SUCCESS') {
        var message = "<div style='font-size:16px;'>We have sent payment notification to your mobile device.<br/>Please complete the transaction using your mobile.</div>";
        $('.wait_text').html(message);
        checkUpiStatus(data, view);
    }
};

module.exports = Form.extend({
    isolated: true,
    template: require('templates/payment/form.html'),

    components: {
        'ui-cc': require('core/form/cc/number'),
        'ui-cvv': require('core/form/cc/cvv')
    },

    data: function () {
        return {
            active: 1,
            cc: {
                store: 1
            },
            accepted: true,
            money: h_money,
            duration: h_duration,
            date: h_date,
            banks: [

                {id: 'AXIB', text: 'AXIS Bank', logo: 'axis_bank'}, // {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
                {id: '1045', text: 'Bank of Baroda Corporate', logo: 'bank_of_baroda'},
                {id: '1046', text: 'Bank of Baroda Retail', logo: 'bank_of_baroda'},
                {id: 'BOIB', text: 'Bank of India', logo: 'bank_of_india'}, //Payu {id: 'BOIB' , text: 'Bank of India' }, Atom {id: '1012' , text: 'Bank of India' },
                {id: 'BOMB', text: 'Bank of Maharashtra', logo: 'bank_of_maharashtra'}, //Payu {id: 'BOMB', text: 'Bank of Maharashtra'},
                {id: '1030', text: 'Canara Bank NetBanking', logo: 'canara_bank'}, //{id: 'CABB', text: 'Canara Bank'},
                {id: '1034', text: 'Canara Bank DebitCard', logo: 'canara_bank'},
                {id: 'CSBN', text: 'Catholic Syrian Bank', logo: 'catholic_syrian_bank'},
                {id: 'CBIB', text: 'Central Bank Of India', logo: 'central_bank_of_india'}, //{id: 'CBIB', text: 'Central Bank Of India'},
                {id: '1020', text: 'City Union Bank', logo: 'city_union_bank'}, //{id: 'CUBB', text: 'CityUnion'},
                /*{id: 'CITNB', text: 'Citi Bank NetBanking' , logo: 'citi_bank_netbanking'},*/
                {id: 'CRPB', text: 'Corporation Bank', logo: 'corporation_bank'}, //{id: 'CRPB', text: 'Corporation Bank'},
                {id: '1047', text: 'DBS Bank Ltd', logo: 'dsb_bank'},
                {id: '1042', text: 'DCB Bank Business', logo: 'dcb_bank'}, //{id: 'DCBB', text: 'Development Credit Bank'},
                {id: '1027', text: 'DCB Bank Personal', logo: 'dcb_bank'},
                {id: 'DSHB', text: 'Deutsche Bank', logo: 'deutsche_bank'}, //{id: 'DSHB', text: 'Deutsche Bank'},
                {id: 'DLSB', text: 'Dhanlaxmi Bank', logo: 'dhanlakshmi_bank'},
                {id: 'FEDB', text: 'Federal Bank', logo: 'federal_bank'}, //{id: 'FEDB', text: 'Federal Bank'},
                {id: 'HDFB', text: 'HDFC Bank', logo: 'hdfc_bank'},
                {id: 'ICIB', text: 'ICICI Netbanking', logo: 'icici_bank'},
                {id: 'IDBB', text: 'IDBI Bank', logo: 'idbi_bank'}, //{id: 'IDBB', text: 'Industrial Development Bank of India'},
                {id: 'INDB', text: 'Indian Bank ', logo: 'indian_bank'}, //{id: 'INDB', text: 'Indian Bank '},
                {id: 'INIB', text: 'IndusInd Bank', logo: 'indusind_bank'}, //{id: 'INIB', text: 'IndusInd Bank'},
                {id: 'INOB', text: 'Indian Overseas Bank', logo: 'indian_overseas_bank'}, //{id: 'INOB', text: 'Indian Overseas Bank'},
                {id: 'JAKB', text: 'Jammu and Kashmir Bank', logo: 'j_k_bank'}, //{id: 'JAKB', text: 'Jammu and Kashmir Bank'},
                {id: 'KRKB', text: 'Karnataka Bank', logo: 'karnataka_bank'}, //{id: 'KRKB', text: 'Karnataka Bank'},
                {id: '1018', text: 'Karur Vysya ', logo: 'karur_vysya'}, //{id: 'KRVB', text: 'Karur Vysya '},
                {id: '162B', text: 'Kotak Mahindra Bank', logo: 'kotak_mahindra_bank'}, //{id: '162B', text: 'Kotak Bank'}
                {id: '1009', text: 'Lakshmi Vilas Bank NetBanking', logo: 'lakshmi_vilas'},
                {id: 'OBCB', text: 'Oriental Bank Of Commerce', logo: 'obc'},
                {id: 'PSBNB', text: 'Punjab And Sind Bank', logo: 'punjab_sindh_bank'}, //{id: 'PSBNB', text: 'Punjab And Sind Bank'},
                {id: 'PNBB', text: 'Punjab National Bank – Retail', logo: 'pnb_retail'},
                /*{id: '1050', text: 'Royal Bank Of Scotland' , logo: 'royal_bank_scotland'},
                 {id: '1053', text: 'SaraSwat Bank' , logo: 'saraswat_bank'},*/
                {id: '1051', text: 'Standard Chartered Bank', logo: 'standard_chartered'},
                {id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur', logo: 'sbbj'}, //{id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
                {id: 'SBHB', text: 'State Bank of Hyderabad', /*logo: 'sbhb'*/}, //{id: 'SBHB', text: 'State Bank of Hyderabad'},
                {id: 'SBIB', text: 'State Bank of India', logo: 'sbib'}, //{id: 'SBIB', text: 'State Bank of India'},
                {id: 'SBMB', text: 'State Bank of Mysore', /*logo: 'sbmb'*/}, //{id: 'SBMB', text: 'State Bank of Mysore'},
                {id: 'SBPB', text: 'State Bank of Patiala', logo: 'sbpb'}, //{id: 'SBPB', text: 'State Bank of Patiala'},
                {id: 'SBTB', text: 'State Bank of Travancore', /*logo: 'sbtb'*/}, //{id: 'SBTB', text: 'State Bank of Travancore'},
                {id: 'SOIB', text: 'South Indian Bank', logo: 'south_indian_bank'}, //{id: 'SOIB', text: 'South Indian Bank'},
                {id: 'UBIB', text: 'Union Bank of India', logo: 'union_bank_of_india'},
                {id: 'UNIB', text: 'United Bank Of India', logo: 'united_bank'}, //{id: 'UNIB', text: 'United Bank Of India'},
                {id: 'VJYB', text: 'Vijaya Bank', logo: 'vijya_bank'}, //{id: 'VJYB', text: 'Vijaya Bank'},
                {id: 'YESB', text: 'Yes Bank', logo: 'yes_bank'}, //{id: 'YESB', text: 'Yes Bank'},
                {id: 'TMBB', text: 'Tamilnad Mercantile Bank', logo: 't_m_bank'},
                {id: '1016', text: 'Union Bank', logo: 'union_bank'},
                        //    {id: '2001', text: ' ATOM Test bank'},

            ],
            wallets: [
                {id: '1001', text: 'MobiKwik', logo: 'mobikwik_background'},
                {id: '1002', text: 'Paytm', logo: 'paytm_background'},
                {id: '1003', text: 'Idea Money', logo: 'ideamoney_background'},
                {id: '1004', text: 'FreeCharge', logo: 'freecharge_background'},
                {id: '1005', text: 'Oxigen', logo: 'oxigen_background'},
                {id: '1006', text: 'SBI Buddy', logo: 'sbi_buddy_background'},
                {id: '1007', text: 'The Mobile Wallet', logo: 'the_mobile_wallet'},
                {id: '1008', text: 'jioMoney', logo: 'jiomoney_background'},
                {id: '1009', text: 'Jana Cash', logo: 'janacach_background'},
                {id: '1010', text: 'Ziggit by IDFC Bank', logo: 'ziggit_background'},
                {id: '1011', text: 'ICash Card', logo: 'icash_background'}
            ],
            formatYear: function (year) {
                return year.slice(-2);
                ;
            },
        }
    },

    onconfig: function () {
        var view = this;

        $.ajax({
            type: 'GET',
            url: '/b2c/booking/cards',
            data: {},
            success: function (data) {
                if (data.length) {
                    view.set('cards', data);
                    //view.setCard(data[data.length - 1]);
                }
            }
        });

        this.observe('active', function () {
            view.clearForm();
            this.set('form.errors', false);
        }, {init: false});
    },

    submit: function () {
        var view = this,
                data = {id: this.get('payment.id')}

        view.set('form.submitting', true);
        view.set('form.errors', {});


        if (3 == this.get('active')) {
            data.netbanking = this.get('netbanking');
        } else if (4 == this.get('active')) {
            data.wallet = this.get('wallet');
        } else if (5 == this.get('active')) {
            data.CCAvenueEmi = this.get('emi');
            data.CCAvenueEmi.category = 'EMI';
        } else if (6 == this.get('active')) {
            data.UPI = this.get('booking.payment.upi');
            data.category = 'upi';
        } else {
            data.cc = this.get('cc');
            data.cc.store = data.cc.store ? 1 : 0;
        }

        $.ajax({
            timeout: 60000,
            type: 'POST',
            url: '/b2c/booking/payment',
            data: data,
            dataType: 'json',
            complete: function () {

            },
            success: function (data) {
                if (data.url) {
                    doPay(data);
                } else {
                    upiPaymentResponse(data, view);
                }
            },
            error: function (xhr) {
                view.set('form.submitting', false);

                try {
                    var response = JSON.parse(xhr.responseText);


                    if (response.errors) {
                        view.set('form.errors', response.errors);
                    } else {
                        if (response.message) {
                            view.set('form.errors', [response.message]);
                        }
                    }


                } catch (e) {
                    view.set('form.errors', ['Server returned error. Please try again later']);
                }
            }
        });


        //return deferred.promise;
    },
    clearForm: function () {
        this.set('cc', {});
        this.set('netbanking', {});
    },
    setCard: function (cc) {
        if (this.get('cc.id') !== cc.id) {
            this.set('cc', cc);
        } else {
            this.set('cc', {});
        }

    },

    resetCC: function (event) {
        var e = event.original,
                el = $(e.srcElement),
                id = this.get('cc.id'),
                yup = 0 == el.parents('.ui.input.cvv').size() && (('INPUT' == el[0].tagName) || el.hasClass('dropdown') || el.parents('.ui.dropdown').size());

        if (id && yup) {
            this.set('cc', {});
        }
    },
    CCAvenueEMI: function () {
        var view = this,
                response,
                jsonData,
                payment,
                total,
                jsonData, plans_emi
                ;
        payment = view.get('payment');
        total = payment.amount;
        response = $.ajax({
            type: 'POST',
            data: {total_amount: total, emi_flag: 'fare_difference'},
            url: '/b2c/Booking/CCAvenueEMI',
        });
        response.done(function (data) {
            if (data != '') {
                try {
                    jsonData = JSON.parse(data);
                } catch (e) {
                    return false;
                }
                view.set('emiOptions', jsonData);
                $.each(jsonData, function (index, value) {
                    if (value.payOpt == 'OPTEMI') {
                        view.set('emiPaymentReady', true);
                        view.set('emi.payment_option', value.payOpt);
                        view.set('emi_banks', JSON.parse(value.EmiBanks));
                        plans_emi = JSON.parse(value.EmiPlans);
                        $.each(plans_emi, function (index1, value1) {
                            value1.emiAmount = value1.emiAmount.toFixed(2);
                            value1.total = value1.total.toFixed(2);
                        });
                        view.set('emi_plans', plans_emi);
                    }
                });
            }
        });
        response.error(function (data) {
            view.set('emi_unavailable', data.responseJSON.message);
        });
    },
    showEmiPlans: function () {
        var view = this;
        view.set('selectedPlan', $("#emi_banks").val());
        view.set('emi.planId', $("#emi_banks").val());
        view.set('showEmiPlans', true);
    },
    showCardFields: function () {
        var view = this;
        $.each(view.get('emi_plans'), function (index, value) {
            if (value.planId == view.get('emi.planId')) {
                view.set('emi.emi_tenure_id', value.tenureId);
                view.set('emi.currency', value.currency);
            }
        });
        view.set('readyCardFields', true);
    },
    oncomplete: function () {
        var view = this;
        view.CCAvenueEMI();
    }


});