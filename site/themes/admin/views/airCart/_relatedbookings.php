<table class="table table-striped table-bordered table-hover dataTables-example" >
    <thead>
        <tr>
            <th>Date</th>
            <th>Cart</th>
            <th>PG</th>

            <th>Fraud</th>
            <th>CC</th>
            <th>3DS</th>
            <th>Name on CC</th>
            <th>Pax Name(s)</th>

            <th>Email</th>
            <th>Mobile</th>
            <th>IP</th>
            <th>Sector</th>

            <th>Booking Status</th>
            <th>Payment Status</th>
            <th>Source</th>


        </tr>
    </thead>
    <tbody>
        <?php
        $t_count = 0;
        foreach ($model->getRelatedBookings() as $acs) {
            foreach ($acs->payGateLogs as $pg) {
                if (empty($pg->cc_id)) {
                    continue;
                }
            
                if($t_count == 0)
                {
                    $cartId = CHtml::link($acs->id, "/airCart/$acs->id");
                    $paymentGway =  $pg->pg->name;
                    $carddetail = TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml()) .
                        "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}";
                        
                    $security = $pg->format3dStatus();
                    $ccname = $pg->cc->name;
                    $paxName = $acs->getPaxNames();
                    $eMail = $acs->user->userInfo->email;
                    $userMobile = $acs->user->userInfo->mobile;
                    $userIp = TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . '</pre>') . '<br>' . $pg->formatGeoIpInfo();
                    $flightSector = $acs->getSector();
                    $bookingStatus = $acs->bookingStatus->name;
                    $paymentStatus = $acs->paymentStatus->name;
                    $clientSource = $acs->clientSource->name;
                }
                ?>
                <?php
                if($t_count > 0)
                { ?>
                    
        
                <?php
                    if(!empty($pg->fraud))
                {?>
                    <tr  class="fraud">
                <?php }
                    else
                {?>
                    <tr>
                <?php }
                ?>
                    
                    <td>
                        <?php echo \Utils::cutSecondsAndMilliseconds($acs->created); ?></td>
                    <td>
                           <?php 
                                if(CHtml::link($acs->id, "/airCart/$acs->id") == $cartId)
                                {
                                    echo "<span class= 'label label-primary'> " . CHtml::link($acs->id, "/airCart/$acs->id"). "</span>";
                                }
                                else
                                {
                                    echo CHtml::link($acs->id, "/airCart/$acs->id");
                                }
                           ?>
                    </td>
                    <td>
                        <?php
                            if($pg->pg->name == $paymentGway)
                            {
                                 echo "<span class= 'label label-primary'> " . $pg->pg->name . "</span>";
                            }
                            else
                            {
                                 echo $pg->pg->name;
                            }
                           
                        ?>
                    </td>
                    <td><?php echo empty($pg->fraud) ? "<span class=\"badge badge-success\">No</span>" : "<span class=\"badge badge-important\">Yes</span>"; ?></td>
                    <td>
                        <?php
                        if(TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml()) .
                        "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}" == $carddetail)
                        {
                            echo "<span class= 'label label-primary'> " . TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml()) .
                        "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}". "</span>";
                        }
                        else
                        {
                            echo TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml()) .
                        "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}";
                        }
                        
                        ?>
                    </td>
                    <td>
                        <?php
                           if($pg->format3dStatus()== $security)
                           {
                               echo "<span class= 'label label-primary'> " . $pg->format3dStatus(). "</span>";
                           }
                           else
                           {
                               echo $pg->format3dStatus();
                           }
                            
                        ?>
                    </td>
                    <td>
                        <?php
                            if($pg->cc->name == $ccname)
                            {
                                echo "<span class= 'label label-primary'> " . $pg->cc->name . "</span>";
                            }
                            else
                            {
                                echo $pg->cc->name;
                            }
                            
                        ?>
                    </td>
                    <td>
                        <?php
                            if($acs->getPaxNames() == $paxName)
                            {
                                echo "<span class= 'label label-primary'> " . $acs->getPaxNames(). "</span>";
                            }
                            else
                            {
                                echo $acs->getPaxNames();
                            }
                            
                        ?>
                    </td>
                    <td>
                        <?php 
                        if($acs->user->userInfo->email == $eMail)
                        {
                            echo "<span class= 'label label-primary'> " . $acs->user->userInfo->email. "</span>";
                        }
                        else
                        {
                            echo $acs->user->userInfo->email;
                        }
                        ?>
                    </td>
                    <td>
                        <?php 
                            if($acs->user->userInfo->mobile == $userMobile)
                            {
                                echo "<span class= 'label label-primary'> " . $acs->user->userInfo->mobile. "</span>";
                            }
                            else
                            {
                                echo $acs->user->userInfo->mobile;
                            }
                            
                         ?>
                    </td>
                    <td>
                        <?php
                            if(TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . '</pre>') . '<br>' . $pg->formatGeoIpInfo() ==$userIp)
                            {
                                echo "<span class= 'label label-primary'> " .TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . '</pre>') . '<br>' . $pg->formatGeoIpInfo(). "</span>";
                            }
                            else
                            {
                                echo TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . '</pre>') . '<br>' . $pg->formatGeoIpInfo();
                            }
                                    
                        ?>
                    </td>
                    <td>
                        <?php
                            if($acs->getSector() == $flightSector)
                            {
                                echo "<span class= 'label label-primary'> " .$acs->getSector(). "</span>";
                            }
                            else
                            {
                                echo $acs->getSector();
                            }
                            
                        ?>
                    </td>
                    <td>
                        <?php
                            if($acs->bookingStatus->name == $bookingStatus)
                            {
                                echo "<span class= 'label label-primary'> " . $acs->bookingStatus->name. "</span>";
                            }
                            else
                            {
                                echo $acs->bookingStatus->name;
                            }
                            
                        ?>
                    </td>
                    <td>
                        <?php 
                            if($acs->paymentStatus->name == $paymentStatus)
                            {
                                echo "<span class= 'label label-primary'> " .$acs->paymentStatus->name. "</span>";
                            }
                            else
                            {
                                echo $acs->paymentStatus->name;
                            }
                            
                        ?>
                    </td>
                    <td>
                        <?php
                            if($acs->clientSource->name ==$clientSource)
                            {
                                echo "<span class= 'label label-primary'> " . $acs->clientSource->name. "</span>";
                            }
                            else
                            {
                                echo $acs->clientSource->name;
                            }
                            
                        ?>
                    </td>
                </tr>
               <?php } else {
                ?>
                <?php
                if(!empty($pg->fraud))
                {?>
                    <tr class="currentBooking fraud">
                <?php }
                else
                {?>
                    <tr class="currentBooking ">
                <?php }
                ?>
                
                
                
                    <td><?php echo \Utils::cutSecondsAndMilliseconds($acs->created); ?></td>
                    <td><?php echo CHtml::link($acs->id, "/airCart/$acs->id"); ?></td>
                    <td><?php echo $pg->pg->name; ?></td>
                    <td><?php echo empty($pg->fraud) ? "<span class=\"badge badge-success\">No</span>" : "<span class=\"badge badge-important\">Yes</span>"; ?></td>
                    <td>
                        <?php
                        echo TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml()) .
                        "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}";
                        ?>
                    </td>
                    <td><?php echo $pg->format3dStatus(); ?></td>
                    <td><?php echo $pg->cc->name; ?></td>
                    <td><?php echo $acs->getPaxNames(); ?></td>
                    <td><?php echo $acs->user->userInfo->email; ?></td>
                    <td><?php echo $acs->user->userInfo->mobile; ?></td>
                    <td><?php echo TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . '</pre>') . '<br>' . $pg->formatGeoIpInfo(); ?></td>
                    <td><?php echo $acs->getSector(); ?></td>
                    <td><?php echo $acs->bookingStatus->name; ?></td>
                    <td><?php echo $acs->paymentStatus->name; ?></td>
                    <td><?php echo $acs->clientSource->name; ?></td>
                </tr>
               <?php } $t_count++;
            }
           
        }
         
        ?>

</table>