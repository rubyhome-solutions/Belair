<?php
/* @var $this AirCartController */
/* @var $model AirCart */

$emailSmsLogs = $model->emailSmsLogs;
echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Email/SMS Log <span class="badge badge-warning badge-top">' . count($emailSmsLogs) . '</span>'
    , [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'size' => TbHtml::BUTTON_SIZE_SMALL,
    'onclick' => 'js:$("#divEmailSMSLog").toggle(); $(this).blur();',
    'style' => 'margin-bottom: 10px;',
    'class' => 'noprint'
]);
//\Utils::dbgYiiLog($emailSmsLogs);die;
?>
<div id="divEmailSMSLog" style="margin-left: 0px; display: none;" class="noprint">
    <table class="table table-condensed table-hover table-bordered">
        <tr>
            <th>Contact Type</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Subject</th>
            <th>Created</th>
            <th>Content Type</th>
            <th>Email Opened?</th>
            <th>Email Opened Time</th>
            <th>Email Opened IP</th>
            <th>View</th>
        </tr>
        <?php
        foreach ($emailSmsLogs as $emailSmsLog) {
            $pglCount = 0;
            ?>
            <tr>
                <td><?php echo \EmailSmsLog::$typeMap[$emailSmsLog->contact_type]; ?></td>
                <td><?php echo $emailSmsLog->sender; ?></td>
                <td><?php echo $emailSmsLog->receiver; ?></td>
                <td><?php echo $emailSmsLog->subject; ?></td>
                <td><?php echo \Utils::cutSecondsAndMilliseconds($emailSmsLog->created); ?></td>
                <td><?php echo \EmailSmsLog::$categoryMap[$emailSmsLog->content_type]; ?></td>
                <td><?php echo \EmailSmsLog::$emailOpenedMap[$emailSmsLog->is_opened]; ?></td>
                <td><?php echo \Utils::cutSecondsAndMilliseconds($emailSmsLog->opened_at); ?></td>
                <td><?php echo $emailSmsLog->opened_ip; ?></td>
                <td><a class="view" rel="tooltip" title="" data-original-title="View" href="/emailSmsLog/<?php echo $emailSmsLog->id;?>" target="_blank"><i class="fa fa-eye fa-1x"></i></a></td>
            </tr>
        <?php } ?>
    </table>
</div>
<style>
    .badge {font-size: inherit}
    .badge.badge-top {top:-10px;left:7px;}
    .table td { vertical-align: middle;}
</style>