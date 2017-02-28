
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <link rel="stylesheet" type="text/css" href="<?php echo \Yii::app()->request->baseUrl; ?>/css/form.css" />
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.css" rel="stylesheet" />
        <link href='//fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css' />
        <link rel="stylesheet" type="text/css" href="/css/site.css" />
        <title><?php echo CHtml::encode($this->pageTitle); ?></title>
    </head>

    <body>
        
        <style>
            ul.nav {padding-top: 0.4%;}
            ul.nav.pull-right {padding-top: 0.1%;}
            .nav li + .nav-header {margin-top: 1px;}
            body {font-family: "Open Sans", Arial, sans-serif !important;}
            .tooltip.left {margin-left: -12px;}
        </style>

       
            <?php echo $content; ?>
        

    </body>
</html>
