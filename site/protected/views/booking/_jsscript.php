<script type="text/javascript">

    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    var weekday = new Array();
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    function updateReturnDate()
    {
        var date = $('#returnDate').datepicker("getDate");
        if (date != null) {
            $(".return-cal .thu").text(month[date.getMonth()]);
            $(".return-cal .moth").text(weekday[date.getDay()]);
            $(".return-cal .day").text(date.getDate());
            $(".return-cal .moth-th, .return-cal .day").show();
            $(".return-cal .text").hide();
        }
    }

    var ajaxOpts = {
        minLength: 0,
        autoFocus: false,
        source: <?php echo (is_array($airports)) ? json_encode($airports) : "'" . $airports . "'"; ?>,
        select: function (event, ui) {
            $(this).val(ui.item.label);
            var target = $(this).attr('data-target');
            $(target).val(ui.item.id);
        }
    };

    $(document).ready(function () {

        $('.typeahead').autocomplete(ajaxOpts)
                .data("ui-autocomplete")._renderItem = function (ul, item) {
            $(ul).addClass('dropdown-menu');
            return $("<li>")
                    .attr("data-value", item.value)
                    .append($("<a>").text(item.label))
                    .appendTo(ul);
        };
        $(document).on('keyup', '.typeahead', function (e) {
            var text = $(this).val();

            if (text.length >= 3) {
                $(this).autocomplete('enable');
                $(this).autocomplete('search', text);
            }
            else
                $(this).autocomplete('disable');

            return false;
        });
        $(document).on('focus', '.typeahead', function () {
            var id = $(this).attr('id');
            $(this).val('');
        });
        $(document).on('blur', '.typeahead', function () {
            if ($(this).val() == '') {
                var target = $(this).attr('data-target');
                $(target).val('');
            }
        });

        $('.spinner-step').click(function () {
            var spinner = $(this).parent().find('.spinner-value');

            var step = parseInt($(this).attr('data-step'));
            var min = parseInt($(spinner).attr('data-min'));

            var value = parseInt($(spinner).text()) + step;

            if ($(this).hasClass('infant')) {
                var adult = parseInt($('.spinner-adult').text());

                if (value > adult)
                    value = adult;
            }

            if (value < min)
                value = min;

            value = (value > 9) ? 9 : value;

            $(spinner).text(value);

            var target = $(spinner).attr('data-target');
            $(target).val(value);

        });

    });
</script>