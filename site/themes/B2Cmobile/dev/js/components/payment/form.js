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

module.exports = Form.extend({
    isolated: true,
    template: require('templates/payment/form.html'),

    components: {
        'ui-cc': require('core/form/cc/number'),
        'ui-cvv': require('core/form/cc/cvv')
    },

    data: function() {
        return {
            active: 1,
            cc: {
                store: 1
            },

            money: h_money,
            duration: h_duration,
            date: h_date,
            banks: [
                {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
                {id: 'BOIB' , text: 'Bank of India' },
                {id: 'BOMB', text: 'Bank of Maharashtra'},
                {id: 'CBIB', text: 'Central Bank Of India'},
                {id: 'CRPB', text: 'Corporation Bank'},
                {id: 'DCBB', text: 'Development Credit Bank'},
                {id: 'FEDB', text: 'Federal Bank'},
                {id: 'HDFB', text: 'HDFC Bank'},
                {id: 'ICIB', text: 'ICICI Netbanking'},
                {id: 'IDBB', text: 'Industrial Development Bank of India'},
                {id: 'INDB', text: 'Indian Bank '},
                {id: 'INIB', text: 'IndusInd Bank'},
                {id: 'INOB', text: 'Indian Overseas Bank'},
                {id: 'JAKB', text: 'Jammu and Kashmir Bank'},
                {id: 'KRKB', text: 'Karnataka Bank'},
                {id: 'KRVB', text: 'Karur Vysya '},
                {id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
                {id: 'SBHB', text: 'State Bank of Hyderabad'},
                {id: 'SBIB', text: 'State Bank of India'},
                {id: 'SBMB', text: 'State Bank of Mysore'},
                {id: 'SBTB', text: 'State Bank of Travancore'},
                {id: 'SOIB', text: 'South Indian Bank'},
                {id: 'UBIB', text: 'Union Bank of India'},
                {id: 'UNIB', text: 'United Bank Of India'},
                {id: 'VJYB', text: 'Vijaya Bank'},
                {id: 'YESB', text: 'Yes Bank'},
                {id: 'CUBB', text: 'CityUnion'},
                {id: 'CABB', text: 'Canara Bank'},
                {id: 'SBPB', text: 'State Bank of Patiala'},
                {id: 'CITNB', text: 'Citi Bank NetBanking'},
                {id: 'DSHB', text: 'Deutsche Bank'},
                {id: '162B', text: 'Kotak Bank'}
            ],
            formatYear: function (year) {
                return year.slice(-2);;
            },
        }
    },

    onconfig: function() {
        var view = this;

        $.ajax({
            type: 'GET',
            url: '/b2c/booking/cards',
            data: {},
            success: function(data) {
                if (data.length) {
                    view.set('cards', data);
                    view.setCard(data[data.length - 1]);
                }
            }
        });

        this.observe('active', function() { this.set('form.errors', false); }, {init: false});
    },

    submit: function() {
        var view = this,
            data = {id: this.get('payment.id')}

        view.set('form.submitting', true);
        view.set('form.errors', {});


        if (3 == this.get('active')) {
            data.netbanking = this.get('netbanking');
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


        return deferred.promise;
    },

    setCard: function(cc) {
        if (this.get('cc.id') !== cc.id) {
            this.set('cc', cc);
        } else {
            this.set('cc', {});
        }

    },

    resetCC: function(event) {
        var e = event.original,
            el = $(e.srcElement),
            id = this.get('cc.id'),
            yup = 0 == el.parents('.ui.input.cvv').size() && (('INPUT' == el[0].tagName) || el.hasClass('dropdown') || el.parents('.ui.dropdown').size());

        if (id && yup) {
            this.set('cc', {});
        }
    }


});