<div class="span4">
    <?php
    /* @var $this CommercialController */

    $data = Yii::app()->db
            ->createCommand('SELECT ut.name, ut.id, COUNT(*) FROM user_type ut'
                    . ' JOIN user_info ui on ut.id = ui.user_type_id'
                    . ' WHERE ut.leading_char<>\'S\' AND ui.commercial_plan_id IS NULL'
                    . ' GROUP BY 1,2 ORDER BY 1')
            ->queryAll();

    $planList = CHtml::listData(\CommercialPlan::model()->findAll(['order' => 'name']), 'id', 'name');
//echo \Utils::dbg($data);
    ?>
    <div class="alert text-center" style="margin-bottom: 5px;"><b>Clients without assigned commercial plan:</b></div>
    <table class="table table-condensed table-bordered table-hover" style="background-color: #f5f5ff;">
        <tr>
            <th>Client type</th>
            <th>Unassigned</th>
            <th>Mass assign</th>
        </tr>
        <?php foreach ($data as $value) { ?>
            <tr>
                <td><?php echo $value['name']; ?></td>
                <td class="center"><?php echo $value['count']; ?></td>
                <td><?php
                    echo TbHtml::dropDownList('assignPlan', '', $planList, [
                        'prompt' => 'Choose plan',
                        'size' => TbHtml::INPUT_SIZE_MEDIUM,
                        'onchange' => "massAssign({$value['id']}, this);",
                    ]);
                    ?>
                </td>
            </tr>
        <?php } ?>
    </table>
</div>
<style>
    select { margin-bottom: auto;}
    .table th {text-align: center}
    .table td {vertical-align: middle}
    td.center {text-align: center}
</style>
<script>
    function massAssign(userTypeId, select) {
        if (confirm('Are you sure about the mass assign?')) {
            console.log('UserType: ' + userTypeId + ' , assign Plan: ' + select.value);
            $.post('/commercial/massAssign', {userTypeId: userTypeId, planId: select.value}).done(function () {
                window.location.reload();
            });
        } else {
            select.value = '';
        }

    }
</script>