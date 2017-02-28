<?php
/* @var $this PaymentController */
/* @var $model Payment */

$isStaffLogged = Authorization::getIsStaffLogged();
if (!empty($model->activeCompanyId)) {
    $userInfo = \UserInfo::model()->findByPk($model->activeCompanyId);
    $this->renderPartial("_summary", ['model' => $userInfo]);
    $companyName = $userInfo->name;
} else {
    $companyName = '';
}

//echo TbHtml::hiddenField('Payment[user_id]', $model->user_id, ['id' => 'userId']);
echo TbHtml::hiddenField('Payment[activeCompanyId]', $model->activeCompanyId, ['id' => 'activeCompanyId']);
echo TbHtml::link('Open Balance', '?Payment[openBalance]=1', ['class' => 'positive btn btn-info']);
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'payment-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'ajaxUpdate' => false,  // We need one more box for the summary
    'filterSelector' => '{filter}, #activeCompanyId',
//    'afterAjaxUpdate' => 'function(id, data) {
//        $("#searchbox").autocomplete({
//                showAnim: "fold",
//                minLength: "4",
//                select: function( event, ui ) {
//                             $("#searchbox").val( ui.item.company_id );
//                          },
//                source: "/users/search"
//            });
//        }',
    'columns' => [
        [
            'name' => 'id',
            'headerHtmlOptions' => ['style' => 'width: 60px;'],
        ],
        [
            'name' => 'created',
            'value' => '\Utils::cutSecondsAndMilliseconds($data->created)',
            'headerHtmlOptions' => ['style' => 'width: 120px;'],
            'filter' => false
        ],
        [
            'name' => 'air_cart_id',
            'value' => 'CHtml::link("<b>$data->air_cart_id</b>", "/airCart/$data->air_cart_id")',
            'type' => 'raw',
            'headerHtmlOptions' => array('style' => 'width: 60px;'),
        ],
        [
            'name' => 'transfer_type_id',
            'value' => '$data->transferType->name',
            'header' => 'Type',
            'filter' => TbHtml::listData(\TransferType::model()->findall(), 'id', 'name'),
            'headerHtmlOptions' => array('style' => 'width: 150px;'),
        ],
        [
            'name' => 'old_balance',
            'value' => 'number_format($data->old_balance)',
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'htmlOptions' => ['style' => 'text-align: right;'],
        ],
        [
            'name' => 'amount',
            'value' => 'number_format($data->amount)',
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'htmlOptions' => ['style' => 'text-align: right;'],
        ],
        [
            'name' => 'new_balance',
            'value' => 'number_format($data->new_balance)',
            'headerHtmlOptions' => ['style' => 'width: 95px;'],
            'htmlOptions' => ['style' => 'text-align: right;'],
        ],
        [
            'name' => 'activeCompanyId',
            'value' => '$data->user->userInfo->name',
            'header' => 'Client',
            'visible' => $isStaffLogged,
            'filter' => $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
                'name' => 'searchbox',
                'id' => 'searchbox',
                'value' => $companyName,
                'source' => CController::createUrl('/users/search'),
                'options' => array(
                    'showAnim' => 'fold',
                    'minLength' => '4',
                    'select' => 'js:function( event, ui ) {
                                 $("#activeCompanyId").val( ui.item.company_id );
                          }',
                ),
                'htmlOptions' => array(
                    'onfocus' => 'js: this.value = null; $("#searchbox").val(null);
                                    $("#selectedvalue").val(null); $("#activeCompanyId").val(null);',
                    'class' => 'search-query',
                    'placeholder' => "Smart users search ...",
                    'style' => 'width: 95%;',
                ),
                    ), true)
        ],
//        [
//            'name' => 'user_id',
//            'value' => '$data->user->name',
//            'visible' => $isStaffLogged,
//            'headerHtmlOptions' => array('style' => 'visibility: hidden;'),
//        ],
        [
            'name' => 'note',
            'type' => 'raw'
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{view}{invoice}',
            'buttons' => [
                'invoice' => [
                    'url' => '"invoice/".$data->id',
                    'label' => '<i class="fa fa-list-alt fa-lg"></i>',
                    'visible' => '$data->transferType->isInvoiceEligble()',
                    'options' => [
                        'title' => 'See the invoice for this payment',
                        'style' => "color:black; margin-left:5px;",
                    ],
                ],
//                'refund' => [
//                    'label' => '<i class="fa fa-times fa-lg"></i>',
//                    'url' => '"refund/" . $data->id',
//                    'visible' => '!empty($data->pay_gate_log_id)',
//                    'click' => 'function(){ doSync("refund" , $(this).attr("href")); return false; }',
//                    'options' => [
//                        'title' => 'Cancel or refund the payment',
//                        'style' => "color: red; margin-left:5px;",
//                    ],
//                ],
            ]
        ],
    ]
]);
?>
<style>
    .ui-widget {
        font-family: "Open Sans";
        font-size: .8em;
    }
</style>
