<?php
/* @var $filter CommercialFilter */
?>
<table class="table table-condensed filter-table table-bordered shadow">
    <tr class="heading">
        <th>Filter type</th>
        <th>Include</th>
        <th>Exclude</th>
    </tr>
    <tr>
        <th class="heading">Booking date</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][book_date]', $filter->include->book_date, ['placeholder' => 'single date YYYY/MM/DD 2014/12/21']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][book_date]', $filter->exclude->book_date, ['placeholder' => 'range 2014/12/21-2015/01/30']); ?></td>
    </tr>
    <tr>
        <th class="heading">Onward Date</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][onward_date]', $filter->include->onward_date, ['placeholder' => 'seprated by comma(,)']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][onward_date]', $filter->exclude->onward_date, ['placeholder' => 'YYYY/MM/DD']); ?></td>
    </tr>
    <tr>
        <th class="heading">Return Date</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][return_dept_date]', $filter->include->return_dept_date, ['placeholder' => 'YYYY/MM/DD']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][return_dept_date]', $filter->exclude->return_dept_date, ['placeholder' => 'YYYY/MM/DD']); ?></td>
    </tr>
    <tr>
        <th class="heading">Flight №</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][flight]', $filter->include->flight, ['placeholder' => '334,370,3240-3700,4356']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][flight]', $filter->exclude->flight); ?></td>
    </tr>
    <tr>
        <th class="heading">Booking class</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][booking_class]', $filter->include->booking_class, ['placeholder' => 'T,D,E']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][booking_class]', $filter->exclude->booking_class); ?></td>
    </tr>
    <tr>
        <th class="heading">Fare Basis</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][fare_basis]', $filter->include->fare_basis, ['placeholder' => 'HL7LNR,QHXGB7']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][fare_basis]', $filter->exclude->fare_basis); ?></td>
    </tr>
    <tr>
        <th class="heading">Cabin class</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][cabin_class]', $filter->include->cabin_class, ['placeholder' => 'E,B,F']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][cabin_class]', $filter->exclude->cabin_class); ?></td>
    </tr>
    <tr>
        <th class="heading">Origin</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][origin_airport]', $filter->include->origin_airport, ['placeholder' => 'DEL,BOM,IN comma separated']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][origin_airport]', $filter->exclude->origin_airport, ['placeholder' => '3 letter Airport code or 2 letter Country code']); ?></td>
    </tr>
    <tr>
        <th class="heading">Destination</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][arrival_airport]', $filter->include->arrival_airport, ['placeholder' => '3 letter Airport code or 2 letter Country code']); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][arrival_airport]', $filter->exclude->arrival_airport, ['placeholder' => '3 letter Airport code or 2 letter Country code']); ?></td>
    </tr>
    <tr>
        <th class="heading">Tour code</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][tour_code]', $filter->include->tour_code); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][tour_code]', $filter->exclude->tour_code); ?></td>
    </tr>
    <tr>
        <th class="heading">PF code</th>
        <td><?php echo TbHtml::textField('CommercialFilter[include][pf_code]', $filter->include->pf_code); ?></td>
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][pf_code]', $filter->exclude->pf_code); ?></td>
    </tr>
    <tr>
        <th class="heading">Base fare</th>
        <td><?php
            echo TbHtml::dropDownList('CommercialFilter[include][biggerThan]', $filter->include->biggerThan, \CommercialFilterElements::$biggerSmaller, [
                'prompt' => '-- Comparison --',
                'style' => 'float: left; width: auto;'
            ]);
            echo TbHtml::textField('CommercialFilter[include][base_fare]', $filter->include->base_fare, [
                'style' => 'float: left;width: inherit;margin-left: 10px;'
            ]);
            ?>
        </td>
        <td><?php
            echo TbHtml::dropDownList('CommercialFilter[exclude][biggerThan]', $filter->exclude->biggerThan, \CommercialFilterElements::$biggerSmaller, [
                'prompt' => '-- Comparison --',
                'style' => 'float: left; width: auto;'
            ]);
            echo TbHtml::textField('CommercialFilter[exclude][base_fare]', $filter->exclude->base_fare, [
                'style' => 'float: left;width: inherit;margin-left: 10px;'
            ]);
            ?>
        </td>
    </tr>
    <tr>
        <th class="heading">Total fare</th>
        <td><?php
            echo TbHtml::dropDownList('CommercialFilter[include][biggerThanTotalFare]', $filter->include->biggerThanTotalFare, \CommercialFilterElements::$biggerSmaller, [
                'prompt' => '-- Comparison --',
                'style' => 'float: left; width: auto;'
            ]);
            echo TbHtml::textField('CommercialFilter[include][total_fare]', $filter->include->total_fare, [
                'style' => 'float: left;width: inherit;margin-left: 10px;'
            ]);
            ?>
        </td>
        <td><?php
            echo TbHtml::dropDownList('CommercialFilter[exclude][biggerThanTotalFare]', $filter->exclude->biggerThanTotalFare, \CommercialFilterElements::$biggerSmaller, [
                'prompt' => '-- Comparison --',
                'style' => 'float: left; width: auto;'
            ]);
            echo TbHtml::textField('CommercialFilter[exclude][total_fare]', $filter->exclude->total_fare, [
                'style' => 'float: left;width: inherit;margin-left: 10px;'
            ]);
            ?>
        </td>
    </tr>
    <tr>
        <th class="heading">Rule Timings</th>
        <td colspan="2">
            <table class="table table-condensed filter-table table-bordered shadow">
                <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>                
                </tr>
                <?php
                $week_days = \Utils::$week_days;
                $day_obj = json_decode(json_encode($filter->include->rule_timings->days), true);
                $start_time_obj = json_decode(json_encode($filter->include->rule_timings->start_time), true);
                $end_time_obj = json_decode(json_encode($filter->include->rule_timings->end_time), true);
                foreach ($week_days as $key => $name) {
                    $day = !empty($day_obj[$key]) ? $day_obj[$key] : '';
                    $start_time = !empty($start_time_obj[$key]) ? $start_time_obj[$key] : '';
                    $end_time = !empty($end_time_obj[$key]) ? $end_time_obj[$key] : '';
                    ?>
                    <tr>
                        <td><?php echo TbHtml::checkBox('CommercialFilter[include][rule_timings][days][' . $key . ']', $day, ['label' => $name, 'id' => 'days_'.$key.'_'.$rule_id, 'style' => 'width: 20px']); ?></td>
                        <td>
                            <?php
                            $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                                'name' => 'CommercialFilter[include][rule_timings][start_time][' . $key . ']',
                                'id' => 'start_time_'.$key.'_'.$rule_id,
                                // additional javascript options for the date picker plugin
                                'timePickerOnly' => 'true',
                                'options' => array(
                                    'showSecond' => 'true',
                                    'timeFormat' => 'hh:mm:ss',
                                ),
                                'value' => $start_time,
                                'htmlOptions' => array(
                                    'style' => 'width:70px;',
                                    'class' => 'startTime'
                                )
                            ));
                            ?>
                        </td>
                        <td>
                            <?php
                            $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                                'name' => 'CommercialFilter[include][rule_timings][end_time][' . $key . ']',
                                'id' => 'end_time_'.$key.'_'.$rule_id,
                                // additional javascript options for the date picker plugin
                                'timePickerOnly' => 'true',
                                'options' => array(
                                    'showSecond' => 'true',
                                    'timeFormat' => 'hh:mm:ss',
                                ),
                                'value' => $end_time,
                                'htmlOptions' => array(
                                    'style' => 'width:70px;',
                                    'class' => 'endTime'
                                )
                            ));
                            ?>
                        </td>
                    </tr>
                <?php } ?>
            </table>
        </td>
    </tr>
</table>
