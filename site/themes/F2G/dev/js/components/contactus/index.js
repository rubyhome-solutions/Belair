'use strict';

var Form = require('core/form'),
    Meta = require('stores/contactus/meta')
    ;

var _ = require('lodash'),
    moment = require('moment')
    ;

var Auth = require('components/app/auth');
module.exports = Form.extend({
    isolated: true,
    template: require('templates/contactus/index.html'),
    components: {
        'layout': require('components/app/layout'),
        'contactus-form': require('components/contactus/form'),
    },
    partials: {
        'base-panel': require('templates/app/layout/panel.html')
    },
    onconfig: function () {
        this.set('contactus.pending', true);
        this.set('contactus.edit', false);
        Meta.instance()
            .then(function (meta) {
                this.set('meta', meta);
            }.bind(this));
        window.view = this;
    },
    data: function () {
        return {
            leftmenu: false,
        }
    },
    leftMenu: function () {
        var flag = this.get('leftmenu');
        this.set('leftmenu', !flag);
    },
    signin: function () {
        var view = this;
        Auth.login()
            .then(function (data) {
                view.set('meta.user', data);
            });
    },
    signup: function () {
        Auth.signup();
    },
    callingCodeFields: {
        'country_fb': {mobile: 'mob'},
        'country_ser': {mobile: 'mobile_ser'},
        'country_feed': {mobile: 'mobile_feed'},
        'country_manage': {mobile: 'mobile_manage'},
        'country_car': {mobile: 'mobile_car'}
    },
    validate: function (fields, capcha, capcha_field) {
        var valid = true;
        _.each(fields, function (field) {
            var field_value = $("#" + field.name).val();
            if (field.type == 'text' || field.type == 'select') {
                if (field_value.trim() == '') {
                    valid = false;
                }
            } else if (field.type == 'email') {
                if ((field_value).indexOf("@") < 1 ||
                    (field_value).lastIndexOf(".") < (field_value).indexOf("@") + 2 ||
                    (field_value).lastIndexOf(".") + 2 >= (field_value).length) {
                    valid = false;
                }
            }
            if (!valid) {
                $("#" + field.name).focus();
                return valid;
            }
        });
        if (valid) {
            if (grecaptcha.getResponse(capcha) == "") {
                $("#" + capcha_field).html("Captcha should not be unchecked.");
                valid = false;
            }
        }
        return valid;
    },
    submit: function (url, formData) {
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                var json_obj = $.parseJSON(data);
                if (json_obj.result == "recaptcha") {
                    alert("Recaptcha validation failed.");
                }
                if (json_obj.result == "success") {
                    if (json_obj.popup_html != '') {
                        $("#contactus_tabs").html(json_obj.popup_html);
                        if (json_obj.refno != "") {
                            $("#reference").html("Your Service Request <b>Ref. No.:" + json_obj.refno + "</b>");
                        }
                    }
                }
                if (json_obj.result == "fileError") {
                    alert("Please attach a document or image less than 1MB size.");
                }
                if (json_obj.result == "mailSendingFailed") {
                    alert("Email Sending Failed.");
                }
            },
            error: function () {
                alert("Error in Send Data");
            }
        });
    },
    oncomplete: function () {
        setTimeout(function () {
            var view = this;
            $(".country_dropdown").html(view.get('meta.countries'));
            //Code for phone code	
            $(".country_dropdown").change(function () {
                var phonecode = $(this).find(':selected').data('phonecode'),
                    callCode = phonecode + "-",
                    id = $(this).attr('id');
                $('#' + view.callingCodeFields[id].mobile).val(callCode);
                $('#' + view.callingCodeFields[id].mobile).focus();
            });

            $(".contact_mobile").keyup(function (e) {
                var number = $(this).val(),
                    chararr = number.split(""),
                    lastchar = chararr[chararr.length - 1];
                if (isNaN(lastchar)) {
                    $(this).val(number.substring(0, number.length - 1));
                }
            });

            /*  START TABS AND POPUPS   */
            $('.menu .item').tab();
            $('#email').popup({on: 'click'});
            $('#mob').popup({on: 'click'});
            $('#refno_fb').popup({on: 'click'});
            $('#email_ser').popup({on: 'click'});
            $('#mobile_ser').popup({on: 'click'});
            $('#email_feed').popup({on: 'click'});
            $('#mobile_feed').popup({on: 'click'});
            $('#refno_feed').popup({on: 'click'});
            $('#email_manage').popup({on: 'click'});
            $('#mobile_manage').popup({on: 'click'});
            $('#phone_manage').popup({on: 'click'});
            $('#email_car').popup({on: 'click'});
            $('#mobile_car').popup({on: 'click'});
            /*  END TABS AND POPUPS */
             /* trigger tab click on button */
            $(".tab_button").click(function(){
               var tab_id=$(this).data('value');
               $("#"+tab_id).trigger('click');
            });

            /*  START FLIGHT BOOKING    */
            $("#flight_booking").on('submit', function (e) {
                e.preventDefault();
                var validate_fields = [
                    {name: 'name_fb', type: 'text'},
                    {name: 'email', type: 'text'},
                    {name: 'email', type: 'email'},
                    {name: 'country_fb', type: 'select'},
                    {name: 'mob', type: 'text'},
                    {name: 'refno_fb', type: 'text'},
                    {name: 'typejourney_fb', type: 'select'},
                    {name: 'subject_fb', type: 'select'},
                    {name: 'payment_fb', type: 'select'}
                ];
                if (view.validate(validate_fields, recaptcha1, 'recap_fb')) {
                    var url = '/b2c/Contactus/FlightBooking/';
                    var formData = new FormData(this);
                    view.submit(url, formData);
                    return false;
                }
            });
            /*  END FLIGHT BOOKING  */

            /*  START SERVICES  */
            $("#services").on('submit', function (e) {
                e.preventDefault();
                var validate_fields = [
                    {name: 'name_ser', type: 'text'},
                    {name: 'email_ser', type: 'text'},
                    {name: 'email_ser', type: 'email'},
                    {name: 'country_ser', type: 'select'},
                    {name: 'mobile_ser', type: 'text'},
                    {name: 'journeytype_ser', type: 'select'},
                    {name: 'assist_ser', type: 'select'}
                ];
                if (view.validate(validate_fields, recaptcha2, 'recap_ser')) {
                    var url = '/b2c/Contactus/Services/';
                    var formData = new FormData(this);
                    view.submit(url, formData);
                    return false;
                }
            });
            /*  END SERVICES    */

            /*  START FEEDBACK  */
            $("#feedback").on('submit', function (e) {
                e.preventDefault();
                var validate_fields = [
                    {name: 'name_feed', type: 'text'},
                    {name: 'email_feed', type: 'text'},
                    {name: 'email_feed', type: 'email'},
                    {name: 'country_feed', type: 'select'},
                    {name: 'mobile_feed', type: 'text'},
                    {name: 'refno_feed', type: 'text'},
                    {name: 'select_feedback', type: 'select'},
                    {name: 'comment_feed', type: 'select'}
                ];
                if (view.validate(validate_fields, recaptcha3, 'recap_feed')) {
                    var url = '/b2c/Contactus/Feedback/';
                    var formData = new FormData(this);
                    view.submit(url, formData);
                    return false;
                }
            });
            /*  END FEEDBACK    */

            /*  START MANAGEMENT    */
            $("#management").on('submit', function (e) {
                e.preventDefault();
                var validate_fields = [
                    {name: 'name_manage', type: 'text'},
                    {name: 'email_manage', type: 'text'},
                    {name: 'email_manage', type: 'email'},
                    {name: 'country_manage', type: 'select'},
                    {name: 'mobile_manage', type: 'text'},
                    {name: 'subject_manage', type: 'select'},
                    {name: 'feedback_manage', type: 'select'},
                    {name: 'phone_manage', type: 'text'},
                    {name: 'write_manage', type: 'text'}
                ];
                if (view.validate(validate_fields, recaptcha4, 'recap_manage')) {
                    var url = '/b2c/Contactus/Management/';
                    var formData = new FormData(this);

                    view.submit(url, formData);
                    return false;
                }
            });
            /*  END MANAAGEMENT */

            /*  START   CAREERS     */
            $("#careers").on('submit', function (e) {
                e.preventDefault();

                var validate_fields = [
                    {name: 'name_car', type: 'text'},
                    {name: 'email_car', type: 'text'},
                    {name: 'email_car', type: 'email'},
                    {name: 'country_car', type: 'select'},
                    {name: 'mobile_car', type: 'text'},
                    {name: 'age_car', type: 'text'},
                    {name: 'add_car', type: 'text'},
                    {name: 'qualification', type: 'select'},
                    {name: 'applied_car', type: 'select'},
                    {name: 'location_car', type: 'select'},
                    {name: 'skills_car', type: 'text'}
                ];
                if (view.validate(validate_fields, recaptcha5, 'recap_car')) {
                    var url = '/b2c/Contactus/Careers/';
                    var formData = new FormData(this);
                    view.submit(url, formData);
                    return false;
                }
            });
            /*  END     CAREERS     */
        }.bind(this), 1000);
    },
});
