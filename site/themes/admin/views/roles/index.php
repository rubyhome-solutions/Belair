<div class="ibox-content">
<?php
/* @var $this RolesController */
/* @var $model UserType */

Yii::app()->getModule('BootstrapTransfer')->registerAssets();
$this->breadcrumbs = array(
    'Roles' => 'index',
    'Index'
);

$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'roles-grid',
    'type' => array(TbHtml::GRID_TYPE_BORDERED, TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER),
    'htmlOptions' => array('class' => 'span5', 'style'=>'margin-left:0'),
    'dataProvider' => $model->search(),
//    'selectionChanged' => 'showUI',
    'columns' => array(
//        'id',
        array(
            'header' => 'Roles<a href="/roles/create" class="btn btn-small pull-right btn-danger">Create new</a>',
            'value' => '"<a class=\'btn btn-small btn-info\' href=\'\' onclick=\'showUI($data->id); return false;\'>".CHtml::encode($data->name)."</a>"',
            'type' => 'raw',
            'htmlOptions' => array(),
            'headerHtmlOptions' => array(),
        ),
        array(
            'header' => 'Leading letter',
            'value' => '"<span class=\'badge badge-info\'>".$data->leading_char."</span>"',
            'htmlOptions' => array('style' => 'text-align: center;'),
            'type' => 'raw',
            'headerHtmlOptions' => array('style' => 'text-align: center;'),
        ),
    )
));
?>
<div id="roles" style="width: 650px;float: right; display: none;">
    <div id="roleName" class="alert alert-info lead text-center"></div>
    <div id="rolesAssigment"></div> 
</div> 

<script>
    function showUI(id) {
        $.post('/roles/getTypePermissions/' + id, {}, function(data) {
            if (typeof data.result === 'unedfined' || data.result !== 'success') {
                $('#roles').hide();
                alert(data.message);
            } else {
                t.set_values(data.content);
                $('#roleName').html('Role:&nbsp;&nbsp;&nbsp;<b>' + allRoles[id] + '</b>');
                $('#roles').show();
            }
        }, "json");
//        console.log(id);
        $('#saveSelection').off('click').on('click', function() {
            $.post('/roles/assignTypePermissions/' + id, {permissions: JSON.stringify(t.get_values())}, function(data) {
                if (typeof data.result === 'unedfined' || data.result !== 'success') {
                    $('#roles').hide();
                    alert(data.message);
                }
            }, "json");
        });
    }

    var allRoles = new Array;
<?php
$roles = $model->findAll(array('order' => 'id'));
foreach ($roles as $role) {
    echo "allRoles[{$role->id}] = '" . CHtml::encode($role->name) . "';\n";
}
?>

    var allPermissions = new Array;
<?php
$premissions = Permission::model()->findAll(array('order' => 'id'));
foreach ($premissions as $premission) {
    echo "allPermissions[{$premission->id}] = '" . CHtml::encode($premission->name) . "';\n";
}
?>
</div>
    $(function() {
        t = $('#rolesAssigment').bootstrapTransfer(
                {'target_id': 'multi-select-input',
                    'height': '15em',
                    'hilite_selection': false,
                    'template': '<table width="100%" cellspacing="0" cellpadding="0">\
                <tr>\
                    <td width="50%">\
                        <div class="selector-available">\
                            <h2>Available permissions</h2>\
                            <div class="selector-filter">\
                                <table width="100%" border="0">\
                                    <tr>\
                                        <td style="width:14px;">\
                                            <i class="icon-search"></i>\
                                        </td>\
                                        <td>\
                                            <div style="padding-left:10px;">\
                                                <input type="text" class="filter-input">\
                                            </div>\
                                        </td>\
                                    </tr>\
                                </table>\
                            </div>\
                            <select multiple="multiple" class="filtered remaining">\
                            </select>\
                            <a class="selector-chooseall btn btn-info btn-small">Choose all</a>\
                        </div>\
                    </td>\
                    <td>\
                        <div class="selector-chooser">\
                            <a class="selector-add">add</a>\
                            <a class="selector-remove">rem</a>\
                        </div>\
                    </td>\
                    <td width="50%">\
                        <div class="selector-chosen">\
                            <h2>Assigned permissions</h2>\
                            <div class="selector-filter right">\
                            </div>\
                            <select multiple="multiple" class="filtered target">\
                            </select>\
                            <a class="selector-clearall btn btn-info btn-small">Clear all</a>\
                        </div>\
                    </td>\
                </tr>\
                <tr><td colspan="3" style="text-align: center;"><a id="saveSelection" class="btn btn-primary">Save changes</a></td></tr>\
            </table>'
                });

        t.populate([
<?php
$out = '';
foreach (Permission::model()->findAll(array('order' => 'id')) as $item)
    $out .= "{value: '{$item->id}', content: '" . CHtml::encode($item->name) . "'},\n";
echo rtrim($out, ",\n");
?>
        ]);
//        t.set_values([
<?php
//$out = '';
//foreach ($model->users as $user)
//    $out .= "'{$user->id}', ";
//echo rtrim($out, ", ");
?>

//        ]);

//        console.log(t.get_values());
    });
</script>