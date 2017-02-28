<div class="ibox-content m_top1">
<?php
\Yii::app()->clientScript->registerCssFile('/css/animate.min.css');
$start_timer = microtime(true);
set_time_limit(900);

function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . round(microtime(true) - $start_timer, 2) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    \Yii::app()->end();
}

$notFound = ['Flight Not Foun', 'No Flight Found',];

// array ($airSourceId, source, destination)

$searchArray = array(
   "spicejet" => array(34, 'DEL', 'BOM'),
   "indigo" => array(30, 'DEL', 'BOM'),
   "flydubai" => array(38, 'DEL', 'DXB'),
   "airindia" => array(36, 'DOH', 'COK'),
   "airasia" => array(37, 'MAA', 'SIN')
 //   ,
 //  "goair" => array(30, 'DEL', 'BOM')
);

$i = 0;
foreach ($searchArray as $value) {
    $animEffect = ($i === 0 ? 'bounceInLeft' : 'bounceInRight');
    $i ^= 1;
    $scrapper = AirSource::model()->with('backend')->findByPk((int) $value[0]);
    $airSourceId = $value[0];
    ?>
    <div id="S<?php echo $scrapper->id; ?>" class="well animated <?php echo $animEffect; ?>" style="max-width: 550px;">
        <i class="fa fa-cog fa-spin "></i>
        <span class="label label-info "><?php echo $scrapper->name; ?></span>
        <span class="result label  label-success"></span>
    </div>
    <?php
}
//foreach ($searchArray as $value) {
//
//    $params = array(
//        'source' => $value[1],
//        'destination' => $value[2],
//        'depart' => date("Y-m-d", strtotime($departdate)),
//        'return' => '',
//        'adults' => $adults,
//        'children' => $childs,
//        'infants' => $infants
//    );
//    $scrapper = AirSource::model()->with('backend')->findByPk((int) $value[0]);
//    $airSourceId = $value[0];
//    //   $this->renderPartial('_scrapper', ['id' => $airSourceId,'inputs'=>$params]);
//}
?>
<h2>Scrapper Search test</h2>
<div id="scrapper"></div>
</div>
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
     
 /*   var airSources = [34,30,36,37];
    var origin = ["BOM", "BOM","BOM","COK"];
    var destination = ["DEL", "DEL","DEL","BLR"];
    var airSources=[[34,"BOM","DEL"],[30,"BOM","DEL"]];
    function getScrapperData(i) {
        //alert('id '+airSources[i][0]+' origin: '+airSources[i][1]+'  destination '+ airSources[i][2]);
        $.ajax({
            url: "/airSource/getScrapperData",
            type: 'POST',
            async: true,
            data: {'id': airSources[i][0], 'origin': airSources[i][1], 'destination': airSources[i][2]},
            dataType: 'html',
            beforeSend: function () {
                // $('#'+id+' .contentarea').html('<img src="/function-demos/functions/ajax/images/loading.gif" />');
            },
            success: function (data) {

                $("#scrapper").append(data);
                $('div#S' + airSources[i][0] + ' i.fa-spin').hide().removeClass('fa-spin');
                $('div#S' + airSources[i][0] + ' span.result').text("Search Complete");
            },
            error: function (xhr, textStatus, errorThrown) {
                // $('#'+id+' .contentarea').html(textStatus);
                $("#scrapper").append(errorThrown);
            }
        });
    }
*/
    $(document).ready(function () {
    var seararr=<?php echo json_encode($searchArray,JSON_PRETTY_PRINT);?>;
    //alert(seararr);
    //alert(JSON.parse(seararr));
        //set a global AJAX timeout of a minute
        $.ajaxSetup({timeout: 1000 * 120});
        //new
    (function  () {
        var k;
        for( k in seararr){
    (function(key){
            $.ajax({
            url: "/airSource/getScrapperData",
            type: 'POST',
            ajaxcounter: key,
            async: true,
            
            data: {'id': seararr[key][0], 'origin': seararr[key][1], 'destination': seararr[key][2]},
          //  dataType: 'html',
            beforeSend: function () {
                // $('#'+id+' .contentarea').html('<img src="/function-demos/functions/ajax/images/loading.gif" />');
            },
            success: function (data) {
               
                $("#scrapper").append(data);
                $('div#S' + seararr[key][0] + ' i.fa-spin').hide().removeClass('fa-spin');
                $('div#S' + seararr[key][0] + ' span.result').text("Success");
                var flag=$("#search_"+seararr[key][0]).val();
               // alert(flag);
                 if (flag=="0") {
                    $('div#S' + seararr[key][0] + ' span.result').removeClass('label-success').addClass('label-important');
                    $('div#S' + seararr[key][0] + ' span.result').text("Search Failed");
                    $('div#S' + seararr[key][0] + ' span.result').css("background-color", "red");
                }else if(flag=="2") {
                      var check=$("#avail_"+seararr[key][0]).val();
                      if(check=="0"){
                            $('div#S' + seararr[key][0] + ' span.result').removeClass('label-success').addClass('label-important');
                            $('div#S' + seararr[key][0] + ' span.result').css("background-color", "red");
                            $('div#S' + seararr[key][0] + ' span.result').text("Check Failed");
                       }
        
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                // $('#'+id+' .contentarea').html(textStatus);
                $("#scrapper").append(errorThrown);
            }
        });
    })(k);
}
}());
        
        //new end
       // alert(airSources.length);
     //   for (var key in seararr) {
             
            // alert(key + " -> " + seararr[key]+' id '+seararr[key][0]);
             
      //   }
        
      //  for (i = 0; i < airSources.length; i++) {
     //       getScrapperData(key);
             
    //    }

function getScrapperData(key){
 $.ajax({
            url: "/airSource/getScrapperData",
            type: 'POST',
            async: true,
            data: {'id': seararr[key][0], 'origin': seararr[key][1], 'destination': seararr[key][2]},
            dataType: 'html',
            beforeSend: function () {
                // $('#'+id+' .contentarea').html('<img src="/function-demos/functions/ajax/images/loading.gif" />');
            },
            success: function (data) {

                $("#scrapper").append(data);
                $('div#S' + seararr[key][0] + ' i.fa-spin').hide().removeClass('fa-spin');
                $('div#S' + seararr[key][0] + ' span.result').text("Search Complete");
            },
            error: function (xhr, textStatus, errorThrown) {
                // $('#'+id+' .contentarea').html(textStatus);
                $("#scrapper").append(errorThrown);
            }
        });
}

    });
</script>