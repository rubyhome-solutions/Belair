<?php
/* @var \BookingController $this */
/* @var \Searches $model */

\Yii::app()->clientScript->registerCssFile('/css/animate.min.css');
$start_timer = microtime(true);

function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . round(microtime(true) - $start_timer, 2) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    Yii::app()->end();
}

//echo \Utils::dbg($model->attributes);
//echo \Utils::dbg($_SESSION);
//echo \Utils::dbg(strtotime($model->created));
//echo \Utils::dbg(time() - strtotime($model->created));
//echo \Utils::dbg($model->created);
//echo \Utils::dbg(Yii::app()->session);
if (strtotime($model->created) < time() - 5) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_WARNING, 'Using existing results from same search made <b>' . \Utils::convertSecToMinsSecs(time() - strtotime($model->created)) . '</b> ago.');
}
$i = 0;
foreach ($model->processes as $process) {
    $animEffect = ($i === 0 ? 'bounceInLeft' : 'bounceInRight');
    $i ^= 1;
    ?>
    <div id="P<?php echo $process->id; ?>" class="well animated <?php echo $animEffect; ?>" style="max-width: 550px;">
        <i class="fa fa-cog fa-spin fa-3x"></i>
        <span class="label label-info h2"><?php echo $process->airSource->name; ?></span>
        <span class="result label h3 label-success"></span>
    </div>
    <?php
}

$this->renderPartial('_cache_rows', ['search' => $model]);
footer($start_timer);
?>
<style>
    .tooltip-inner {max-width: 800px;}
    table#cacheTable th, table#cacheTableNew th, table#cacheTableNew td , table#cacheTable td {text-align: center;vertical-align: middle}
    span.label.label-info.h2 {
        font-family: sans-serif;
        font-size: x-large;
        vertical-align: super;
        line-height: initial;
    }
    span.label.h3 {
        font-family: sans-serif;
        font-size: large;
        vertical-align: super;
        line-height: initial;
    }
    span.result {
        float: right;
        margin-top: 5px;
    }
    .well {padding: 10px;margin-bottom: 10px;}
</style>
<script>
    var searchID = <?php echo $model->id; ?>;
    var rpiCount = 0;
    function refreshProcessInfo(searchID) {
        $.post('/searches/refreshProcessInfo', {id: searchID}, function (data) {
            for (var key in data) {
                if (key === 'cacheResults') {
                    updateCacheItems(data[key]);
                    continue;
                }
                if (key === 'stop') {
                    removeOldCacheItems();
                    return true;
                }
                $('div#P' + key + ' i.fa-spin').hide().removeClass('fa-spin');
                $('div#P' + key + ' span.result').text(data[key]);
                if (data[key].indexOf('=>') === -1) {
                    $('div#P' + key + ' span.result').removeClass('label-success').addClass('label-important');
                }
            }
            rpiCount++;
            // Do not do more than 120 refreshes
            if (rpiCount < 120) {
                refreshProcessInfo(searchID);
            } else {    // Something bad happened
                $('div i.fa-spin').siblings('span.result').removeClass('label-success').addClass('label-important').text('No response');
                $('div i.fa-spin').hide();
            }
        }, 'json');
    }

    function updateCacheItems(items) {
        for (var key in items) {
            $("tr#RC" + key + " td.image img").attr('src', '/img/checkmark.png');
            element = $("tr#RC" + key);
            if (element.length === 0) {
                $('#cacheTableNew > tbody > tr:last').after('<tr><td>' + key + '</td>' +
                        '<td>' + items[key].airSource + '</td>' +
                        '<td>' + items[key].airline + '</td>' +
                        '<td>' + items[key].ports + '</td>' +
                        '<td>' + items[key].dates + '</td>' +
                        '<td><a data-html="true" data-placement="top" rel="tooltip" title="' + items[key].taxDetails + '" href="javascript:void(0);">' + items[key].total + '</a></td>' +
                        '<td>' + items[key].stops + '</td>' +
                        '<td><a data-html="true" data-placement="left" rel="tooltip" title="' + items[key].legs + '" href="javascript:void(0);">Details</a></td>' +
                        '<td>' + items[key].pax + '</td>' +
                        '<td><img src="/img/icon-new.png"></td></tr>');
                $('#cacheTableNew').show();
            } else {
                $(element).addClass('up-to-date');
            }
        }
    }

    function removeOldCacheItems() {
        $("table#cacheTable tr").not('.up-to-date').each(function () {
            element = $(this).children('td')[9];
            if (element.length === 0) {
            } else {
                element.innerHTML = '<img src="/img/red_xmark-e1379600035292.png">';
            }
        });
    }

    $(document).ready(function () {
        //set a global AJAX timeout of a minute
        $.ajaxSetup({timeout: 1000 * 60});
        // Some sliding
//        $('div.sliding').each(function(){$(this).slideToggle(500);});

        refreshProcessInfo(searchID); // do the first poll

    });

</script>