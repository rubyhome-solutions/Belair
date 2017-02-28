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
        <td><?php echo TbHtml::textField('CommercialFilter[exclude][return_dept_date]', $filter->exclude->return_dept_date, ['placeholder' => 'YYYY/MM/DD'] ); ?></td>
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
</table>
