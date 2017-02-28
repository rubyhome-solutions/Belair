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
			accepted:true,
            money: h_money,
            duration: h_duration,
            date: h_date,
            banks: [
                
                {id: '1003' , text: 'AXIS Bank' },// {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
                {id: '1045' , text: 'Bank of Baroda Corporate' },
                {id: '1046' , text: 'Bank of Baroda Retail' },
                {id: 'BOIB' , text: 'Bank of India' },//Payu {id: 'BOIB' , text: 'Bank of India' }, Atom {id: '1012' , text: 'Bank of India' },
                {id: '1033', text: 'Bank of Maharashtra'},//Payu {id: 'BOMB', text: 'Bank of Maharashtra'},
                {id: '1030', text: 'Canara Bank NetBanking'},//{id: 'CABB', text: 'Canara Bank'},
                {id: '1034', text: 'Canara Bank DebitCard'},
                {id: '1031', text: 'Catholic Syrian Bank'},
                {id: '1028', text: 'Central Bank Of India'},//{id: 'CBIB', text: 'Central Bank Of India'},
                {id: '1020', text: 'City Union Bank'},//{id: 'CUBB', text: 'CityUnion'},
                {id: 'CITNB', text: 'Citi Bank NetBanking'},
                {id: '1004', text: 'Corporation Bank'},//{id: 'CRPB', text: 'Corporation Bank'},
                {id: '1047', text: 'DBS Bank Ltd'},
                {id: '1042', text: 'DCB BANK Business'},//{id: 'DCBB', text: 'Development Credit Bank'},
                {id: '1027', text: 'DCB BANK Personal'},
                {id: '1024', text: 'Deutsche Bank'},//{id: 'DSHB', text: 'Deutsche Bank'},
                {id: '1038', text: 'Dhanlaxmi Bank'},
                {id: '1019', text: 'Federal Bank'},//{id: 'FEDB', text: 'Federal Bank'},
                {id: 'HDFB', text: 'HDFC Bank'},
                {id: 'ICIB', text: 'ICICI Netbanking'},
                {id: '1007', text: 'IDBI Bank'},//{id: 'IDBB', text: 'Industrial Development Bank of India'},
                {id: '1026', text: 'Indian Bank '},//{id: 'INDB', text: 'Indian Bank '},
                {id: '1015', text: 'IndusInd Bank'},//{id: 'INIB', text: 'IndusInd Bank'},
                {id: '1029', text: 'Indian Overseas Bank'},//{id: 'INOB', text: 'Indian Overseas Bank'},
                {id: '1001', text: 'Jammu and Kashmir Bank'},//{id: 'JAKB', text: 'Jammu and Kashmir Bank'},
                {id: '1008', text: 'Karnataka Bank'},//{id: 'KRKB', text: 'Karnataka Bank'},
                {id: '1018', text: 'Karur Vysya '},//{id: 'KRVB', text: 'Karur Vysya '},
                {id: '1013', text: 'Kotak Mahindra Bank'},//{id: '162B', text: 'Kotak Bank'}
                {id: '1009', text: 'Lakshmi Vilas Bank NetBanking'},
                {id: '1035', text: 'ORIENTAL BANK OF COMMERCE'},
                {id: '1055', text: 'Punjab And Sind Bank'}, //{id: 'PSBNB', text: 'Punjab And Sind Bank'},
                {id: '1049', text: 'Punjab National Bank – Retail'},
                {id: '1050', text: 'Royal Bank Of Scotland'},
                {id: '1053', text: 'SaraSwat Bank'},
                {id: '1051', text: 'Standard Chartered Bank'},
                {id: '1023', text: 'State Bank of Bikaner and Jaipur'},//{id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
                {id: '1017', text: 'State Bank of Hyderabad'},//{id: 'SBHB', text: 'State Bank of Hyderabad'},
                {id: '1014', text: 'State Bank of India'},//{id: 'SBIB', text: 'State Bank of India'},
                {id: '1021', text: 'State Bank of Mysore'},//{id: 'SBMB', text: 'State Bank of Mysore'},
                {id: '1036', text: 'State Bank of Patiala'},//{id: 'SBPB', text: 'State Bank of Patiala'},
                {id: '1025', text: 'State Bank of Travancore'},//{id: 'SBTB', text: 'State Bank of Travancore'},
                {id: '1022', text: 'South Indian Bank'},//{id: 'SOIB', text: 'South Indian Bank'},
                {id: 'UBIB', text: 'Union Bank of India'},
                {id: '1041', text: 'United Bank Of India'},//{id: 'UNIB', text: 'United Bank Of India'},
                {id: '1039', text: 'Vijaya Bank'},//{id: 'VJYB', text: 'Vijaya Bank'},
                {id: '1005', text: 'Yes Bank'},//{id: 'YESB', text: 'Yes Bank'},
                {id: '1044', text: 'Tamilnad Mercantile Bank'},
                {id: '1016', text: 'Union Bank'},
             //    {id: '2001', text: ' ATOM Test bank'},
                
            ],
			wallets :[
                /*{id: '1001', text: 'MobiKwik'},*/
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
                    //view.setCard(data[data.length - 1]);
                }
            }
        });

       this.observe('active', function() {view.clearForm(); this.set('form.errors', false); }, {init: false});
    },

    submit: function() {
        var view = this,
            data = {id: this.get('payment.id')}

        view.set('form.submitting', true);
        view.set('form.errors', {});


        if (3 == this.get('active')) {
            data.netbanking = this.get('netbanking');
			 } else if(4 == this.get('active')) {
        	data.wallet = this.get('wallet');
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


      //  return deferred.promise;
    },
    clearForm: function(){
        this.set('cc', {});
        this.set('netbanking', {});
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