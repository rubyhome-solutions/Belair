<?php \Yii::app()->clientScript
    ->registerScriptFile(\Utils::mtimeify(Yii::app()->theme->baseUrl.'/assets/js/common.js'), \CClientScript::POS_END)
    ->registerScriptFile(\Utils::mtimeify(Yii::app()->theme->baseUrl.'/assets/js/'.$bundle.'.js'), \CClientScript::POS_END)
    ->registerCssFile(\Utils::mtimeify(Yii::app()->theme->baseUrl.'/assets/css/'.$bundle.'.css'))
?>

<script type='text/javascript'>
window.__wtw_lucky_site_id = 42567;

 (function() {
  var wa = document.createElement('script'); wa.type = 'text/javascript'; wa.async = true;
  wa.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://cdn') + '.luckyorange.com/w.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(wa, s);
   })();
 </script>
 
 <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-44064452-1', 'auto');
  ga('send', 'pageview');

</script>