<?php
/* @var $this LogController */
/* @var $model LogModel */


$this->breadcrumbs = array(
    'Logs' => array('admin'),
    'Manage',
);
?>
<div class="alert alert-info" id="alertBox" style="display: none; margin-right: 10%">
    <button type="button" class="close" onclick="$('#alertBox').hide()">&times;</button>
    <p id="alertMsg">Here is the alert text</p>
</div>
<?php
$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'log-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => array(TbHtml::GRID_TYPE_BORDERED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_CONDENSED),
    'afterAjaxUpdate' => 'function(id, data) { 
        $(".btnUndo").tooltip(); 
        $("#Log_created").datepicker({dateFormat:"yy-mm-dd"});
        }',
    'columns' => array(
        array('name' => 'userEmail', 'header' => 'User Email', 'value' => '$data->user_->email'),
        array('name' => 'userName', 'header' => 'User Name', 'value' => '$data->user_->name'),
        array('name' => 'companyName', 'header' => 'Company', 'value' => '$data->user_->userInfo->name'),
//        array('name' => 'operationName', 'header' => 'Operation', 'value' => '$data->operation->name'),
        array('name' => 'operation_id', 'header' => 'Operation', 'value' => '$data->operation->name', 'filter' => CHtml::listData(LogOperation::model()->findall(), 'id', 'name')),
//        'created',
        array(
            'name' => 'created',
            'value' => 'preg_replace("/\.\d+/", "", $data->created)',
            'filter' => $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                'id' => 'Log_created',
                'model' => $model,
                'attribute' => 'created',
                'options' => array(
//                    'showButtonPanel'=>true,
                    'dateFormat' => 'yy-mm-dd'
                )
            ), true)
        ),
        'old_value',
        'new_value',
        array('value' => '"<button onclick=\'undo($data->id)\' class=\'btn btn-warning btn-small btnUndo\' data-toggle=\'tooltip\' title=\'Undo this operation\'><i class=\'fa fa-undo fa-2x\'></i></button>"',
            'type' => 'raw',
            'htmlOptions' => array('style' => 'text-align: center;')
        )
    ),
));
?>
<style>
    .table th {text-align: center;}
    .btnUndo:hover {
        -webkit-transform: scale(1.2);
        -moz-transform:scale(1.2);
    }
</style>
<script>
        $(function() {
            $(".btnUndo").tooltip();
        })

        function undo(id) {
            $.post('/log/undo/' + id, {}, function(data) {
//            console.log(data); 
                $('#alertMsg').html(data);
                $('#alertBox').show();
            }, 'json');
        }

</script>
