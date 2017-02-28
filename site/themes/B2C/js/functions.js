$(function () {
    $(".accordion").accordion({
        heightStyle: "content"
    });


    $(".tabs").tabs();
    $(".input.date input").datepicker({
        dateFormat: "MM,yy/DD/dd",
        onSelect: function () {
            setDate($(this))
        }
    });

    $('.left-panel .dropbox .title').on('click', function () {
        $(this).closest('.dropbox').toggleClass('open');
    })


    $('.booking-item a[data-open="details"]').on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $(this).closest('.booking-item').toggleClass('open-details')
    })


    $('.scroll-bar').mCustomScrollbar({theme: 'dark-3'});
    $('.select-traveler .result').mCustomScrollbar({theme: 'dark-3'});

    $('#sign-in-btn').on('click', function () {
        $("#login-popup").attr("style", "display:display")
    })

    $('#sign-up-btn').on('click', function () {
        $("#sign-up-popup").attr("style", "display:display")
    })

    $('#search-mod-btn').on('click', function () {
        $("#search-mod-popup").attr("style", "display:display")
    })

    $('.popup-container .close').on('click', function () {
        $(this).closest('.popup-container').attr("style", "display:none");
    })


    if ((/msie/.test(userAgent) && parseFloat((userAgent.match(/.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/) || [])[1]) > 8) || !(/msie/.test(userAgent))) {
        $('.chart').easyPieChart({
            easing: 'easeOutBounce',
            size: 55,
            barColor: '#3399ff',
            scaleColor: 'transparent'
        });
    }

//                        var chart = window.chart = $('.chart').data('easyPieChart');
//                        $('body').on('click', function() {
//                            chart.update(Math.random()*200-100);
//                        });


    $(window).resize(function () {
        heightWrap()
    })

    //elements
    heightWrap();
    leftMenu();
    easySelect();
    radioButton();
    inputDecorate();
    smallTabs();
    floatBarBooking();
    mobileMenu();

    //form
    searchForm();

    window.actions = {
        yii: {
            form: {
                afterValidate: function(action) {
                    return function(form, data, hasError) {
                        $(form).data('hasError', hasError);

                        return $.isFunction(action) ? action($(form), data, hasError) : true;
                    }
                },

                validate: function(form, action) {
                    return function(xhr,opt) {
                        var $form = $(form);

                        $._data($form[0], 'events').submit[0].handler();
                        var he = $form.data('hasError');
                        $form.removeData('hasError');

                        if (he === false) {
                            window.actions.form.loading($form);
                            return $.isFunction(action) ? action($form, xhr, opt, he) : true;
                        }

                        setTimeout(function() { window.actions.form.customHL($form); }, 200);
                        return false;
                    }
                }
            }
        },

        form: {
            loading: function(form) {
                var $form = $(form);

                var submit = $form.find('input.stateful:submit');
                if (!submit.data('message')) {
                    submit.data('message', submit[0].value);
                }

                submit
                    .val('Loading ...')
                    .prop('disabled', true);
            },

            loaded: function(form) {
                var $form = $(form);

                var submit = $form.find('input.stateful:submit');

                submit
                    .val(submit.data('message') || 'asdasdasd')
                    .prop('disabled', false);
            },

            customHL: function($form) {
                $form.find('.input-light.custom:has(.error)').addClass('error');
                $form.find('.input-light.custom:not(:has(.error))').removeClass('error');
            }
        }
    };

});


function mobileMenu() {
    $('.mobile-menu').on('click', function (event) {
        event.preventDefault();
        $('.left-panel').toggleClass('open');
    })
}

function floatBarBooking() {
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 170) {
            $(".rs-roundtrip").addClass('floated');
        }
        else {
            $(".rs-roundtrip").removeClass('floated');
        }
    });
}


function smallTabs(target, id) {
    target = typeof target !== 'undefined' ? target : $('.small-tabs');
    id = typeof id !== 'undefined' ? id : 1;

    $('.small-tabs li').on('click', function () {
        var $this = $(this),
            target = $this.data('target'),
            body = $this.parent().next();

        $this.parent().find('li').removeClass('active')
        body.find('.item').removeClass('open');
        setTimeout(function () {
            $this.addClass('active');
            body.find('.item').eq(target - 1).addClass('open');
        }, 100)

    })
}

function heightWrap() {
    if (($('.wrap').height() - $('header').height() ) < $(window).height()) {
        $('.wrap').css('height', $(window).height() - $('header').height())
    }

    if ($(window).width() < '1025') {
        var leftPanel = $('.left-panel');
        if (leftPanel.height() < $('.content').height()) {
            leftPanel.height($('.content').height())
        }
    }
}

function setDate($this) {
    var selected = $this.val().split('/');
    $this.closest('.date').find('.mm-yy').html(selected[0] + '<br>' + selected[1]);
    $this.closest('.date').find('.day').html(selected[2])
    $this.closest('.date').addClass('in')
}

function inputDecorate() {
    $('.input').each(function () {
        if ($(this).find('input').val().length > 0) {
            $(this).addClass('in')

            if (!$(this).hasClass('disabled') && $(this).hasClass('date')) {
                setDate($(this).find('input'))
            }
        }
    });

    $('.input').on('click', function () {
        var $this = $(this);
        if (!$this.hasClass('disabled') && !$this.hasClass('date')) {
            $this.addClass('in');
            $this.find('input').focus();
            $this.find('input').focusout(function () {
                if ($(this).val() == '') {
                    $this.removeClass('in');
                }
            });
        }

    })

    $('.input.counter .plus, .input.counter .min').on('click', function (event) {
        event.stopPropagation();
        var $this = $(this),
            input = $this.closest('.input').find('input'),
            val = Number(input.val());

        switch ($this.attr('class')) {
            case 'plus':
                input.val(Number(val + 1));
                break;
            case 'min':
                if (val > 0) input.val(Number(val - 1));
                break;
        }
    });

    $('.select select').on('change', function () {
        $(this).closest('.select').find('.target').text($(this).find('option:selected').text());
    });
    $('.select-light select').on('change', function () {
        $(this).closest('.select-light').find('.target').text($(this).find('option:selected').text());
    })
}


function radioButton() {
    $('label input[type="radio"]').on('click', function () {
        var $this = $(this),
            name = $this.attr('name');

        $('label input[name="' + name + '"]').closest('label').removeClass('active');
        $this.closest('label').addClass('active');

    })
}

function easySelect() {
    $('.easy-select').on('click', '.target', function () {
        $(this).next().slideToggle();
    })
    $('.easy-select').on('click', '.body li', function () {
        var $this = $(this)
        var box = $this.closest('.easy-select');
        box.find('.target').html('<i>' + $this.find('i').html() + '</i>');
        box.find('.body').slideUp();
    })
}

function leftMenu() {
    $('.left-panel .menu-arrow').on('click', function () {
        $('.auth-info .left-menu').toggle();
    })
}


//**********
function searchForm() {
    var form = $('.search-form');
    radio = form.find('.radio-box'),
        target = 1;

    radio.find('label').on('click', function () {
        target = $(this).find('input').data('target')

        form.find('.radio-tab').hide();
        form.find('.radio-tab[data-tab="' + target + '"]').show();
    })

    form.find('.delete').on('click', function () {
        $(this).closest('.multi-city').remove();
    })

};






