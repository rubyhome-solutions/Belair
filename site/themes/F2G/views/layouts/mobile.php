<html>
<?php 
    $page = \Cms::getMeta();
?>
<head>
    <meta charset="UTF-8"/>
      <title><?php echo $page['title']; ?></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	  <meta name="description" content=" <?php echo $page['desc'] ?> ">
    <meta name="keywords" content="<?php echo $page['keyword'] ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="<?php echo \Yii::app()->theme->baseUrl; ?>/assets/mobile/css/common.css" />
    <link rel="shortcut icon" href="<?php echo \Yii::app()->theme->baseUrl ?>/img/favicon.png"/>
    <?php $url=\Yii::app()->request->url;
    if(strpos($url,'mybookings') === false && strpos($url,'guestbooking') === false  && strpos($url,'myprofile') === false && strpos($url,'mytraveller') === false ) {
    ?>
    <link rel="stylesheet" type="text/css" href="<?php echo \Yii::app()->theme->baseUrl; ?>/assets/mobile/css/flights.css" />
    <?php } 
    else if(strpos($url,'mybookings') === false && strpos($url,'myprofile') === false && strpos($url,'mytraveller') === false) { ?>
    <link rel="stylesheet" type="text/css" href="<?php echo \Yii::app()->theme->baseUrl; ?>/assets/mobile/css/guestfilter.css" />
    <?php
     }else if(strpos($url,'myprofile') === false && strpos($url,'mytraveller') === false) { ?>
    <link rel="stylesheet" type="text/css" href="<?php echo \Yii::app()->theme->baseUrl; ?>/assets/mobile/css/mybookings.css" />
    <?php } ?> 
    
    
        
    <?php
    if(strpos($url,'doPay') !== false && strpos($url,'flights') === false) {
    echo '<link rel="stylesheet" type="text/css" href="'.\Yii::app()->theme->baseUrl.'/assets/mobile/css/payment.css" />';
    } 
    if(strpos($url,'mytraveller') !== false && strpos($url,'flights') === false)  { 
     echo '<link rel="stylesheet" type="text/css" href="'.\Yii::app()->theme->baseUrl.'/assets/mobile/css/mytraveller.css" />';
    } 
    if(strpos($url,'myprofile') !== false && strpos($url,'flights') === false)  { 
    echo '<link rel="stylesheet" type="text/css" href="'.\Yii::app()->theme->baseUrl.'/assets/mobile/css/myprofile.css" />';
     }
     ?>
    

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-44064452-1', 'auto');
  ga('send', 'pageview');

</script>


</head>
<?php if(strstr(\Yii::app()->request->serverName, 'cheapticket')){?>
    <body>
<?php } elseif(strstr(\Yii::app()->request->serverName, 'airticketindia')){ ?>
    <body class="AirticketIndia">
<?php } ?>
<main id="app">
    <?php echo $content; ?>
</main>


<script src="<?php echo \Yii::app()->theme->baseUrl; ?>/assets/mobile/js/common.js"></script>
</body>
</html>