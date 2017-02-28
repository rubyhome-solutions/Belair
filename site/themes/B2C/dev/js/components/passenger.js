'use strict';

var _ = require('lodash'),
        $ = require('jquery');

;
var Form = require('core/form'),
        Meta = require('stores/flight/meta')
        ;



module.exports = Form.extend({
    isolated: true,
    template: require('templates/passenger.html'),

    components: {
        mobileselect: require('core/form/mobileselect'),
    },

    data: function () {
        return {
            _: _,
            datesupported: true,
            all: false,
            date: require('helpers/date')(),
            adult: [
                {tid: '1'},
                {tid: '2'},
                {tid: '3'}
            ],
            child: [
                {tid: '2'},
                {tid: '4'}
            ],
            infant: [
                {tid: '2'},
                {tid: '4'}
            ],
            search: function (term, travelers) {
                //  console.log('search', arguments);

                term = term.toLowerCase();
                if (term && travelers) {
                    return _.filter(travelers, function (i) {
                        return -1 !== (i.firstname + ' ' + i.lastname).toLowerCase().indexOf(term);
                    })
                            .slice(0, 4);
                }

                //return travelers ? travelers.slice(0, 4) : null;
                return travelers;
            }
        };
    },

    oncomplete: function () {
        !function (e, t, n) {
            function a(e, t) {
                return typeof e === t
            }
            function s(e) {
                var t = r.className, n = Modernizr._config.classPrefix || "";
                if (c && (t = t.baseVal), Modernizr._config.enableJSClass) {
                    var a = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
                    t = t.replace(a, "$1" + n + "js$2")
                }
                Modernizr._config.enableClasses && (t += " " + n + e.join(" " + n), c ? r.className.baseVal = t : r.className = t)
            }
            function i() {
                var e, t, n, s, i, o, r;
                for (var c in u) {
                    if (e = [], t = u[c], t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
                        for (n = 0; n < t.options.aliases.length; n++)
                            e.push(t.options.aliases[n].toLowerCase());
                    for (s = a(t.fn, "function")?t.fn():t.fn, i = 0; i < e.length; i++)
                        o = e[i], r = o.split("."), 1 === r.length ? Modernizr[r[0]] = s : (!Modernizr[r[0]] || Modernizr[r[0]]instanceof Boolean || (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])), Modernizr[r[0]][r[1]] = s), l.push((s ? "" : "no-") + r.join("-"))
                }
            }
            function o() {
                return"function" != typeof t.createElement ? t.createElement(arguments[0]) : c ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments)
            }
            var l = [], r = t.documentElement, c = "svg" === r.nodeName.toLowerCase(), u = [], f = {_version: "3.0.0-alpha.4", _config: {classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0}, _q: [], on: function (e, t) {
                    var n = this;
                    setTimeout(function () {
                        t(n[e])
                    }, 0)
                }, addTest: function (e, t, n) {
                    u.push({name: e, fn: t, options: n})
                }, addAsyncTest: function (e) {
                    u.push({name: null, fn: e})
                }}, Modernizr = function () {};
            Modernizr.prototype = f, Modernizr = new Modernizr;
            var p = o("input"), d = "search tel url email datetime date month week time datetime-local number range color".split(" "), m = {};
            Modernizr.inputtypes = function (e) {
                for (var a, s, i, o = e.length, l = ":)", c = 0; o > c; c++)
                    p.setAttribute("type", a = e[c]), i = "text" !== p.type && "style"in p, i && (p.value = l, p.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(a) && p.style.WebkitAppearance !== n ? (r.appendChild(p), s = t.defaultView, i = s.getComputedStyle && "textfield" !== s.getComputedStyle(p, null).WebkitAppearance && 0 !== p.offsetHeight, r.removeChild(p)) : /^(search|tel)$/.test(a) || (i = /^(url|email|number)$/.test(a) ? p.checkValidity && p.checkValidity() === !1 : p.value != l)), m[e[c]] = !!i;
                return m
            }(d), i(), s(l), delete f.addTest, delete f.addAsyncTest;
            for (var g = 0; g < Modernizr._q.length; g++)
                Modernizr._q[g]();
            e.Modernizr = Modernizr
        }(window, document);
        if (!Modernizr.inputtypes.date) {
            this.set('datesupported', false);
        }

        //$( ".dob" ).datepicker();

        if (!MOBILE) {
            var fn = $(this.find('input.firstname'))
                    .popup({
                        position: 'bottom left',
                        popup: $(this.find('.travelers.popup')),
                        on: null,
                        prefer: 'opposite',
                        closable: false
                    })
                    .on('click', function () {
                        fn.popup('show');
                    })
                    .on('blur', function () {
                        setTimeout(function () {
                            fn.popup('hide');
                        }, 200);
                    })
                    ;

        } else {
            var view = this;
            this.observe('travelers', function (travelers) {
                if (travelers && travelers.length) {
                    $('.tpopup', view.el).mobiscroll().select({
                        buttons: [],
                        onSelect: function (v, inst) {
                            var id = _.parseInt($('.tpopup', view.el).val()),
                                    traveler = _.findWhere(view.get('travelers'), {id: id});

                            if (traveler) {
                                view.pickTraveler(traveler);
                                //  $(this).closest(".passengerclass").find('.tt').text(_.result(_.find(titles, {'id': traveler.title_id}), 'name'));
                                //   view.set('passenger.traveler.title_id',traveler.)
                            }
                        },
                        onValueTap: function (v, inst) {
//                            console.log(v);
//                            console.log(v.context.innerText);
//                            console.log(v.context.outerHTML);     
                            //                           console.log(v.context.attributes['data-val'].nodeValue);     
                            var id = _.parseInt(v.context.attributes['data-val'].nodeValue),
                                    traveler = _.findWhere(view.get('travelers'), {id: id});
                            //             console.log(traveler);
                            if (traveler) {
                                view.pickTraveler(traveler);
                                //    var titles = view.get('meta.titles');
                                //  $(this).closest(".passengerclass").find('.tt').text(_.result(_.find(titles, {'id': traveler.title_id}), 'name'));

                            }
                            $('.tpopup', view.el).mobiscroll('hide');

                        }
                    });
                }




            });



        }

//                $('input[name="dob"]').change(function(){
//                    //alert(this.value);         //Date in full format alert(new Date(this.value));
//                    var inputDate = this.value;//new Date(this.value);
//                    var date=inputDate.split("-");
//                    console.log(inputDate);
//                });


    },
    onconfig: function () {
        this.observe('passenger.traveler.firstname passenger.traveler.lastname', function (newValue, oldValue, keypath) {
            if (typeof oldValue !== 'undefined' && newValue !== oldValue) {
                this.set('passenger.traveler.id', null);
            }
            //console.log(this.get('passenger.traveler'));
        }, {
            init: false,
            defer: true
        });
    },
    travelers: function () {
        if (MOBILE) {
            $('.tpopup', this.el).mobiscroll('show');
        }
    },
    titleselect: function () {
        if (MOBILE) {
            $('.titlepopup', this.el).mobiscroll('show');
        }
    },
    show: function (section, validation, all) {
        if (all)
            return true;

        if ('birth' == section) {
            return 'domestic' != 'validation';
        }

        if ('passport' == section) {
            return 'full' == 'validation';
        }
    },

    pickTraveler: function (traveler) {
        var view = this,
                id = this.get('passenger.traveler.id');
        //console.log(no);
        var view = this;

        this.set('passenger.traveler', null)
                .then(function () {
                    view.set('passenger.traveler', _.cloneDeep(traveler));
                });
    },
    setdob: function (traveler) {
        var dateofbirth = this.get('passenger.traveler.birthd');
        var no = _.parseInt(traveler['no']);
        var t = no - 1;
        var view = this;
        var dob = dateofbirth.split('-');
        this.set('passenger.traveler.birth', dob);

    },
    setdobsimple: function (traveler) {
        // console.log(traveler);
        var regEx = /^\d{2}-\d{2}-\d{4}$/;
        var no = _.parseInt(traveler['no']);
        var t = no - 1;
        var view = this;
        var dateofbirth = $("#dob_" + no).val();
        if (dateofbirth != '') {
            if (dateofbirth.match(regEx) != null) {
                var dob = dateofbirth.split('-');
                var dobb = [dob[2], dob[1], dob[0]];
                if (_.parseInt(dob[0]) > 31) {
                    alert("Please Put Valid Date in DD-MM-YYYY Format");
                    $("#dob_" + no).val('').focus();
                    return false;
                }
                if (_.parseInt(dob[1]) > 12) {
                    alert("Please Put Valid Date in DD-MM-YYYY Format");
                    $("#dob_" + no).val('').focus();
                    return false;
                }
                this.set('passenger.traveler.birth', dobb);
            } else {
                alert("Please Put Date in DD-MM-YYYY Format");
                $("#dob_" + no).val('').focus();
            }
        }

    },

    setpassportexpiry: function (traveler) {
        var no = _.parseInt(traveler['no']);
        var t = no - 1;
        var dateofped = this.get('passenger.traveler.pd');
        //var dateofped=$("#ped_"+no).val();
        var peda = dateofped.split('-');
        this.set('passenger.traveler.passport_expiry', peda);
    },
    setpassportexpirysimple: function (traveler) {
        //console.log(traveler);

        var regEx = /^\d{2}-\d{2}-\d{4}$/;

        var no = _.parseInt(traveler['no']);
        var t = no - 1;
        var view = this;
        var dateofped = $("#ped_" + no).val();
        if (dateofped != '') {
            if (dateofped.match(regEx) != null) {
                var dob = dateofped.split('-');
                var dobb = [dob[2], dob[1], dob[0]];
                if (_.parseInt(dob[0]) > 31) {
                    alert("Please Put Valid Date in DD-MM-YYYY Format");
                    $("#ped_" + no).val('').focus();
                    return false;
                }
                if (_.parseInt(dob[1]) > 12) {
                    alert("Please Put Valid Date in DD-MM-YYYY Format");
                    $("#ped_" + no).val('').focus();
                    return false;
                }

                this.set('passenger.traveler.passport_expiry', dobb);
            } else {
                alert("Please Put Date in DD-MM-YYYY Format");
                $("#ped_" + no).val('').focus();
            }
        }
    },
    toglle: function (traveler) {
        var no = _.parseInt(traveler['no']);

        if (this.get('passenger.traveler.birth') != null) {
            if (this.get('datesupported')) {
                var dob = this.get('passenger.traveler.birth.0') + '-' + this.get('passenger.traveler.birth.1') + '-' + this.get('passenger.traveler.birth.2');
                $("#dob_" + no).val(dob);
            } else {
                var dob = this.get('passenger.traveler.birth.2') + '-' + this.get('passenger.traveler.birth.1') + '-' + this.get('passenger.traveler.birth.0');
                $("#dob_" + no).val(dob);
            }
        }
        if (this.get('passenger.traveler.passport_expiry') != null) {
            if (this.get('datesupported')) {
                var dob = this.get('passenger.traveler.passport_expiry.0') + '-' + this.get('passenger.traveler.passport_expiry.1') + '-' + this.get('passenger.traveler.passport_expiry.2');
                $("#ped_" + no).val(dob);

            } else {
                var dob = this.get('passenger.traveler.passport_expiry.2') + '-' + this.get('passenger.traveler.passport_expiry.1') + '-' + this.get('passenger.traveler.passport_expiry.0');
                $("#ped_" + no).val(dob);
            }
        }
        this.toggle('all');
    }

});