<?php
/* @var $this AirCartController */
/* @var $model AirCart */


$this->breadcrumbs = array(
    'Air Carts' => array('admin'),
    'Manage',
);


Yii::app()->clientScript->registerScript('search', "
    $('.search-button').click(function(){
        $('div.search-form').toggle();
        return false;
    });
    $('.search-form form').submit(function(){
        $('#air-cart-grid').yiiGridView('update', {
            data: $(this).serialize()
        });
        return false;
    });
");

$this->renderPartial('_search', ['model' => $model]);
?>
<style>
    .danger{
        background-color: #FBC2C4;
    }
</style>
<?php
$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'air-cart-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER], // , TbHtml::GRID_TYPE_BORDERED
    'dataProvider' => $model->search(),
    'selectableRows' => 1,
    
    'rowCssClassExpression' => '
       ( $row%2 ? $this->rowCssClass[1] : $this->rowCssClass[0] ) .
        ( $data->isFlightIn48hrs() ? " danger" : " disabled" )
    ',
//    'selectionChanged' => 'function(id){window.open("' . $this->createUrl('view') . '/"+$.fn.yiiGridView.getSelection(id),"_blank");}',
    'columns' => array(
        [
            'name' => 'id',
            'value' => 'CHtml::link("<b>$data->id</b>", "view/$data->id", ["target"=>"_blank"])',
            'type' => 'raw',
        ],
        [
            'name' => 'created',
            'value' => 'Utils::cutSecondsAndMilliseconds($data->created)',
            'headerHtmlOptions' => array('style' => 'text-align:center;'),
        ],
        [
            'header' => 'Claim',
            'value' => '($claimuser=$data->checkClaim())!==false ? "<a onclick=\"unclaim({$data->id});\">{$claimuser[1]}</a>" : "<a class=\"btn\" onclick=\"claimCart({$data->id});\">Claim</a>"',
            'type' => 'raw',
            'headerHtmlOptions' => array('style' => 'text-align:center;'),
        ],
        [
            'header' => 'Sector',
            'value' => '$data->getSector()'
        ],
        [
            'header' => 'Pax(s)',
            'value' => 'Utils::truncateStr($data->getPaxNames())',
            'htmlOptions' => ['style' => 'text-align:center;'],
        ],
//        [
//            'header' => 'Client',
//            'value' => '$data->user->userInfo->name'
//        ],
        [
            'name' => 'summary',
            'type' => 'raw',
            'headerHtmlOptions' => array('style' => 'text-align: center;'),
            'htmlOptions' => array('style' => 'max-width:300px;text-align:center;'),
        ],
        [
            'header' => 'Payment',
            'value' => '!empty($data->payments) ? "<a href=\"/payment/admin?Payment%5Bair_cart_id%5D={$data->id}\">Available</a> <br>{$data->paymentStatus->name}" : "None"',
            'type' => 'raw',
            'htmlOptions' => array('style' => 'text-align:center;'),
        ],
        [
            'header' => 'Booking Status',
            'value' => '$data->bookingStatus->name',
            'htmlOptions' => array('style' => 'text-align:center;'),
        ],
//        [
//            'header' => 'Payment Status',
//            'value' => '$data->paymentStatus->name',
//            'htmlOptions' => array('style' => 'text-align:center;'),
//        ],
         [
            'header' => 'DOM/INT',
            'value' => '$data->isInternational()? "INT" : "DOM"',
            'htmlOptions' => array('style' => 'text-align:center;'),
        ],
        [
            'header' => 'DIRECT/ SOURCE',
            'value' => '$data->client_source_id === \ClientSource::SOURCE_DIRECT ? "DIRECT" : \Authorization::getIsTopStaffOrAccountantLogged() ? $data->clientSource->name: "SOURCE"',
            'htmlOptions' => array('style' => 'text-align:center;'),
        ],
        [
            'header' => 'PROMO',
            'value' => '!empty($data->promo_codes_id) ? $data->promoCode->code : "-"',
            'htmlOptions' => array('style' => 'text-align:center;'),
        ],
    ),
));
?>

<style>
    .table th, td.center, tr.center td {
        text-align: center;
        vertical-align: middle;
    }
    td input[type="text"], td select {
        margin-bottom: 0;
        max-width: 160px;
        text-align: center;
    }
    table td input.big {
        font-weight: bold;
        font-size: 1.1em;
        text-align: right;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
        vertical-align: middle;
    }
    .center {
        text-align: center !important;
    }
    table.table tr td input.error {
        border-color: red;
        background-color: #FBC2C4;
    }
    td.diff {
        text-align: right;
    }
    .shadow {
        box-shadow: 10px 10px 5px #888888;
        background-color: aliceblue;
    }
    .ui-widget {
        font-family: "Open Sans";
        font-size: .9em;
    }
    /*.grid-view table.items tr td {cursor: pointer}*/

</style>

<script>
    $(document).on('click', 'button.positive', function (evt) {
        var $button = $(evt.currentTarget);
        $input = $button.closest('form').find('input[name="' + $button.attr('name') + '"]');
        $select = $button.closest('form').find('select[name="' + $button.attr('name') + '"]');
        if (!$input.length && !$select.length) {
            $input = $('<input>', {
                type: 'hidden',
                name: $button.attr('name')
            });
            $input.insertAfter($button);
        }
        if ($select.length) {
            $select.val($button.val());
        } else {
            $input.val($button.val());
        }
        $button.closest('form').submit();
    });
    
    function claimCart(cartId){
        $.post('/airCart/claimCart/' + cartId, {}, function (data) {
            if (typeof data.error !== 'undefined') {
           // alert(data.error+' refresing page');
            window.location.reload();
        }
        else{
            //alert(data.success+' redirecting to respective cart');
            window.location.href = '/airCart/view/'+cartId; //relative to domain
        }
        
        
        }, 'json')
                .done(function () {
                    
        });
    }
    
    function unclaim(cartId){
        $.post('/airCart/unClaimCart/' + cartId, {}, function (data) {
            if (typeof data.error !== 'undefined') {
            //alert(data.error+' refresing page');
            window.location.reload();
        }
        else{
           // alert(data.success+'. Refresing page');
            window.location.reload(); //relative to domain
        }
        
        
        }, 'json')
                .done(function () {
                    
        });
    }
    <?php
    if(\Authorization::getIsStaffLogged()){ ?>
    $(document).ready(function() { 
        /* Ajax call for getting counts of various queues */ 
        $.post('/airCart/getCountOfQueues/', {}, function (data) {
            if (typeof data.error !== 'undefined') {
            //alert(data.error+' refresing page');
            //window.location.reload();
        }
        else{
            //console.log(data);
           
            $("#docsent").text(data.docsent);
            $("#docrecvd").text(data.docrecvd);
            $("#farediffsent").text(data.farediffsent);
            $("#farediffrecvd").text(data.farediffrecvd);
            $("#toamend").text(data.toamend);
            $("#tocancel").text(data.tocancel);
            $("#emailnotsent").text(data.emailnotsent);
           // window.location.reload(); //relative to domain
        }
        
        
        }, 'json')
                .done(function () {
                    
        });
    
    
    });
    <?php }?>
</script>