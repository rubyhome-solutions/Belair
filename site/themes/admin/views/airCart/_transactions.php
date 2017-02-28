



<div id="divTransactions" style="margin-left: 0px;max-width: 1100px;" class="noprint">
    <?php
    /* @var $this AirCartController */
    /* @var $pgs PayGateLog[] */

 
    $statuses = CHtml::listData(TrStatus::model()->findall(), 'id', 'name');
    ?>
    
        
        <?php
        
        foreach ($pgs as $pg) { ?>
         <table class="table table-striped table-hover ">
            <?php
               $cardcountry="";
              //  $pg= \PayGateLog::model()->findAllByAttributes(['air_cart_id' => $model->id,'status_id'=>\TrStatus::STATUS_SUCCESS,'action_id'=>\TrAction::ACTION_SENT], ['order' => 'id']);
                if(isset($pg->cc->bin->country_name))
                $cardcountry=$pg->cc->bin->country_name;
            
                ?>
            
             <tr>
                 <th>T. ID <?php //echo $countTable; ?></th><th>Amt</th><th>Status</th><th>3Ds</th><th>Ctry</th>
             </tr>
             <tr>
                 <th><?php echo $pg->id; ?></th><th><?php echo number_format($pg->amount); ?></th><th><?php echo $statuses[$pg->status_id]; ?></th><th><?php echo $pg->format3dStatus(); ?></th><th><?php echo $cardcountry  ?></th>
             </tr>
             <tr>
                 <td colspan="5">    
                        <a class=" expand btn btn-white btn-xs btn-bitbucket">
                            Expand <i class="fa fa-sort-desc"></i>
                        </a>
                        
                        <?php 
                        if($pg->status_id ===  TrStatus::STATUS_NEW)
                        { ?>
                                <a class="btn btn-xs btn-outline btn-success dim" href="<?php echo 'doPay/'.$pg->id ?>"><i class="fa fa-money"></i> Pay</a>
                        <?php } if($pg->isRefundable() && !\Authorization::getIsFrontlineStaffLogged())
                        {?>
                                <a class="btn btn-xs btn-outline btn-success dim" href="<?php echo 'refund/'.$pg->id ?>"><i class="fa fa-undo fa-lg"></i> Refund</a> 
                        <?php } if($pg->isCapturable())
                        {?>
                                <div class="btn btn-xs btn-outline btn-success dim" onclick="doSync('capture' , $(this).attr('href'));" href="<?php echo $pg->id ?>"><i class="fa fa-sign-out"></i> Capture</div>
                        <?php } if($pg->status_id === TrStatus::STATUS_PENDING  && $pg->action_id ===  \TrAction::ACTION_SENT) 
                         {?>
                                <a class="btn btn-xs btn-outline btn-success dim" href="<?php echo 'refund/'.$pg->id ?>"> <i class="fa fa-undo fa-lg"></i> Re Sync </a>
                        <?php } if($pg->isRefundable() && !\Authorization::getIsFrontlineStaffLogged())
                        { ?>
                                <a class="btn btn-xs btn-outline btn-success dim" href="<?php echo 'externalRefund/'.$pg->id ?>"> <i class="fa fa-undo fa-lg"></i> External Refund </a>
                        <?php } ?>
                 </td>
             </tr>
                 
             <tr class="detailedRow">
                <td colspan="5" height="20"> <a target="_blank" href="/payGate/view/<?php echo $pg->id; ?>"><strong>Transaction ID  <?php echo $pg->id; ?></strong></a> <button id="two" type="button" class="pull-right btn btn-success btn-xs">Invoice</button> </td>
            </tr>
            <tr class="detailedRow">
                <th colspan="2">PG: </th><td colspan="3"><?php echo $pg->pg->name; ?></td>
            </tr>
            <tr class="detailedRow">
               <th colspan="2">Amount: </th> <td colspan="3"><?php echo number_format($pg->amount); ?></td>
            </tr>
            <tr class="detailedRow">
                <th colspan="2">Status: </th><td colspan="3"><?php echo $statuses[$pg->status_id]; ?></td>
            </tr>
            <tr class="detailedRow">
                <th colspan="2">3DS: </th> <td colspan="3"><?php echo $pg->format3dStatus(); ?></td>
            </tr>
            <tr class="detailedRow">
               <th colspan="3">Fraud: </th> <td colspan="2"><?php echo empty($pg->fraud) ? "<span class=\"badge badge-success\">No</span>" : "<span class=\"badge badge-important\">Yes</span>"; ?></td>
            </tr>
            <tr class="detailedRow">
               <th colspan="2">GeoIP: </th> <td colspan="3"><?php
                    if (!empty($pg->geoip)) {
                        $geoip = json_decode($pg->geoip);
                        if (!isset($geoip->more)) {
                            $more = \TbHtml::popover(' more', "IP: $pg->user_ip", '', [
                                        'pg' => "$pg->id",
                                        'ip' => "$pg->user_ip",
                                        'class' => "ip-popover",
                                        'onclick' => "getGeoIpV2(this);",
                            ]);
                        } else {
                            $more = '';
                        }
                        echo \TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . "</pre>") . "<br>" . $pg->formatGeoIpInfo() . $more;
                    }
                    ?></td>
            </tr>
            <tr class="detailedRow">
               <th colspan="2">CC: </th> <td colspan="3">
                    <?php
                    echo $pg->cc_id ?
                            TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml()) .
                            "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}" : "";
                    ?>
                </td>
            </tr>
            <tr class="detailedRow">
                 <th colspan="2">Reason: </th> <td colspan="3"><?php echo in_array($pg->status_id, [\TrStatus::STATUS_NEW, \TrStatus::STATUS_PENDING]) ? '' : nl2br($pg->reason); ?></td>
            </tr>
            <tr class="detailedRow">
                <td class="sm-text" colspan="5">
                    
                    
                </td>
            </tr>
            <tr class="noborder detailedRow">
                  <td colspan="5" height="10" bgcolor="#444444" style="padding:0;"> &nbsp;</td>
            </tr>
            </table>
<?php  }   ?>
    
</div>
<?php
    $this->renderPartial('/site/infoModal', ['modalHeader' => 'Transaction feedback:']);
?>

<script>
    $('.detailedRow').hide();
    
    $('a.expand').click(function(){
        $(this).toggleClass('opened');
        
            $(this).closest('.table').siblings().find('.detailedRow').hide();
        
       
        if($(this).hasClass('opened'))
        {
            $(this).closest('.table').find('.detailedRow').show();
        }
        else
        {
            $(this).closest('.table').find('.detailedRow').hide();
        }
        
    });
    
    
</script>
<script>
  jQuery(document).ready(function(){
      $('[data-toggle="popover"]').popover({
          html : true,
      }); 
      $("a[rel='popover']").attr("data-placement","left");
  });

    $(function () {
        $('#score').tooltip({html: true, placement: 'left'});
    });

    function getGeoIpV2(that) {
        if ($(that).attr('data-content') !== '') {
            return;
        }
        var ip = $(that).attr('ip');
        var pg = $(that).attr('pg');
        $.post('/xRate/geoIpV2/' + pg, {'ip': ip}, function (data) {
            var table_body = "<table>";
//            $(that).popover('hide');
//            $(that).popover({'html':'true'});
            $.each(data, function (k, v) {
                table_body += "<tr><td>" + k + "</td><td><b>" + v + "</b></td></tr>";
            });
            $(that).attr('data-content', table_body + "</table>");
            $(that).popover('show');
        });
    }

</script>
<style>
    .badge {font-size: inherit}
</style>

