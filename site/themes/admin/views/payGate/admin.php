<div class="ibox-content m_top1">
<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */


$this->breadcrumbs = [
    'Transactions' => ['admin'],
    'Manage',
   ];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}

$this->renderPartial("_stats");

?>
</div>

<div class="ibox-content m_top1">
<?php
    echo "<hr>" . TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Create new payment request', "manualPaymentRequest", ['class' => 'btn btn-primary']);
$this->renderPartial("_admin_grid", ['model' => $model]);


 $this->renderPartial('/site/infoModal', ['modalHeader' => 'Transaction feedback:']);
?>
</div>
   

<script>
        function DoubleScroll(element) {
    var scrollbar= document.createElement('div');
    scrollbar.appendChild(document.createElement('div'));
    scrollbar.style.overflow= 'auto';
    scrollbar.style.overflowY= 'hidden';
    scrollbar.style.width= '100%';
    scrollbar.firstChild.style.width= element.scrollWidth+"px";
    scrollbar.firstChild.style.paddingTop= '1px';
    scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
    scrollbar.onscroll= function() {
    element.scrollLeft= scrollbar.scrollLeft;
    };
    element.onscroll= function() {
    scrollbar.scrollLeft= element.scrollLeft;
    };
    element.parentNode.insertBefore(scrollbar, element);
    }

    DoubleScroll(document.getElementById('pay-gate-grid'));
    </script>