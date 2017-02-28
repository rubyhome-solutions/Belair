<?php
/* @var $filter AirSourceFilter */
?>
<table class="table table-condensed filter-table table-bordered shadow">
    <tr class="heading">
        <th>Filter type</th>
        <th>Include</th>
        <th>Exclude</th>
    </tr>
    <tr>
        <th class="heading">Origin</th>
        <td><?php echo TbHtml::textField('AirSourceFilter[include][origin_airport]', $filter->include->origin_airport, ['placeholder' => 'DEL,BOM,IN comma separated']); ?></td>
        <td><?php echo TbHtml::textField('AirSourceFilter[exclude][origin_airport]', $filter->exclude->origin_airport, ['placeholder' => '3 letter Airport code or 2 letter Country code']); ?></td>
    </tr>
    <tr>
        <th class="heading">Destination</th>
        <td><?php echo TbHtml::textField('AirSourceFilter[include][arrival_airport]', $filter->include->arrival_airport, ['placeholder' => '3 letter Airport code or 2 letter Country code']); ?></td>
        <td><?php echo TbHtml::textField('AirSourceFilter[exclude][arrival_airport]', $filter->exclude->arrival_airport, ['placeholder' => '3 letter Airport code or 2 letter Country code']); ?></td>
    </tr>
    <tr>
        <th class="heading">Booking date</th>
        <td><?php echo TbHtml::textField('AirSourceFilter[include][book_date]', $filter->include->book_date, ['placeholder' => 'single date YYYY/MM/DD 2014/12/21']); ?></td>
        <td><?php echo TbHtml::textField('AirSourceFilter[exclude][book_date]', $filter->exclude->book_date, ['placeholder' => 'range 2014/12/21-2015/01/30']); ?></td>
    </tr>
    <tr>
        <th class="heading">Onward Date</th>
        <td><?php echo TbHtml::textField('AirSourceFilter[include][onward_date]', $filter->include->onward_date, ['placeholder' => 'seprated by comma(,)']); ?></td>
        <td><?php echo TbHtml::textField('AirSourceFilter[exclude][onward_date]', $filter->exclude->onward_date, ['placeholder' => 'YYYY/MM/DD']); ?></td>
    </tr>
    <tr>
        <th class="heading">Return Date</th>
        <td><?php echo TbHtml::textField('AirSourceFilter[include][return_dept_date]', $filter->include->return_dept_date, ['placeholder' => 'YYYY/MM/DD']); ?></td>
        <td><?php echo TbHtml::textField('AirSourceFilter[exclude][return_dept_date]', $filter->exclude->return_dept_date, ['placeholder' => 'YYYY/MM/DD']); ?></td>
    </tr>
    <tr>
        <th class="heading">Cabin class</th>
        <td><?php echo TbHtml::textField('AirSourceFilter[include][cabin_class]', $filter->include->cabin_class, ['placeholder' => 'E,B,F']); ?></td>
        <td><?php echo TbHtml::textField('AirSourceFilter[exclude][cabin_class]', $filter->exclude->cabin_class); ?></td>
    </tr>
</table>
