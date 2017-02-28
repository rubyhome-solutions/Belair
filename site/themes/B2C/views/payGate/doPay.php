
<?php 
//\Utils::dbgYiiLog($model->userInfo);
if(isset($isMobile)){
    $this->renderPartial('//common/mobilejs', [ 'bundle' => 'payment' ]); 
}else{
 $this->renderPartial('//common/js', [ 'bundle' => 'payment' ]);    
}
?>
<?php
    $payment = [
        'id' => $model->id,
        'amount' => $model->amount,
        'convince_fee' => $model->convince_fee,
        'reason' => $model->reason,
        'client' => $model->userInfo->name
    ];

?>

<script data-payment='<?php echo json_encode($payment); ?>'></script>


