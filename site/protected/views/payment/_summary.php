<?php
/* @var $this AirCartController */
/* @var $model UserInfo */

//echo Utils::dbg($payments);
?>
<p class='well-small alert-info' style="margin-top: -10px;">&nbsp;&nbsp;<i class='fa fa-money fa-lg'></i>&nbsp;&nbsp; Summary</p>
<table class="table summary table-bordered table-condensed" style="width: auto;">
    <tr class="heading">
        <th>Client</th>
        <td class="center"><?php echo $model->name; ?></td>
        <th>Current Balance</th>
        <td><?php echo number_format($model->balance); ?></td>
    </tr>
    <tr class="heading">
        <th>Action</th>
        <td class="center"><?php
            echo TbHtml::link('<i class="fa fa-check-square-o fa-lg"></i>&nbsp;&nbsp;&nbsp;New payment', '/payGate/manualPaymentRequest', ['class' => 'btn btn-primary']);
            ?>
        </td>
        <th>Credit limit</th>
        <td><?php echo number_format($model->credit_limit); ?></td>
    </tr>
    <tr class="heading">
        <th>Request</th>
        <td class="center"><?php
            echo TbHtml::link('<i class="fa fa-question-circle fa-lg"></i>&nbsp;&nbsp;&nbsp;Credit request', '/creditRequest/create', ['class' => 'btn btn-primary btn-small']);
            echo TbHtml::link('<i class="fa fa-search fa-lg"></i>&nbsp;&nbsp;&nbsp;Deposit search', '/depositSearch/create', ['class' => 'btn btn-primary btn-small', 'style' => 'margin-left: 10px;']);
            ?>
        </td>
        <th>Available</th>
        <td><?php echo number_format($model->availability); ?></td>
    </tr>
</table>
<style>
    .well-small {
        margin-bottom: 5px;
        margin-top: 15px;
        font-weight: bold;
    }
    .table.summary td, .table.summary th {
        text-align: right;
    }
    .table.summary td.center {
        text-align: center;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
        text-align: right;
        vertical-align: middle;
    }
    .selected {background-color: #fef8b8;}
</style>
