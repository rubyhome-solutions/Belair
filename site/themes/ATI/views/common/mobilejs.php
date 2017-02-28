<?php \Yii::app()->clientScript
    ->registerScriptFile(Yii::app()->theme->baseUrl.'/assets/mobile/js/'.$bundle.'.js', \CClientScript::POS_END);
    //->registerCssFile(Yii::app()->theme->baseUrl.'/assets/mobile/css/'.$bundle.'.css')
$meta_store_path = $bundle;
if(in_array($bundle, ['mybookings','cms','guestfilter'])) {
    $meta_store_path = 'mybookings';
} else if (in_array($bundle, ['flights','payment'])) {
    $meta_store_path = 'flight';
}
?>

<script type='text/javascript'>
window.meta_store_path = '<?php echo $meta_store_path;?>';
</script>