<?php

/* @var $this BookingController */

echo \TbHtml::ajaxButton('fakeBook', '/booking/fakeBookAjax', [
    'type' => 'POST',
    'data' => [
        'data' => $bookData,
        'Traveler[0][id]' => 'js: $("#Traveler_0_id").val()',
        'Traveler[0][traveler_type_id]' => 'js: $("#Traveler_0_traveler_type_id").val()',
        'airSourceId' => 'js: $("#airSourceId").val()',
    ],
    'success' => 'js:function(data){
                    // $("#btnFakeBook").blur();
                    var alert = \'<div class="alert" style="max-width:600px"><button type="button" class="close" data-dismiss="alert">&times;</button>\';
                    if (typeof data.error != "undefined") {
                        $("#content").prepend(alert + data.error + "</div>");                        
                    } else {
                        $("#content").prepend(alert + "The fake cart created is <b><a href=\'/airCart/view/" + data + "\' target=\'_blank\'>" + data + "</a></div>");
                    }
                }'
        ], [
//    'id' => 'btnFakeBook',
    'class' => 'btn-warning btn-small'
        ]
);
