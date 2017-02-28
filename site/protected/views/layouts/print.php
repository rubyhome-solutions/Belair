<?php
/* @var $this Controller */
/* @var $url string */
/* @var $filename string */

$url = $_POST['url'];
$filename = $_POST['filename'];
Yii::app()->bootstrap->register();
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" />
        <link href='//fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css' />
        <link rel="stylesheet" type="text/css" href="/css/site.css" />
        <title><?php echo CHtml::encode($this->pageTitle); ?></title>
    </head>
    <body>
        <div class="noprint" style="margin: 1% 0 1% 2%; border-bottom: thin;">
            <a class="btn btn-primary" onclick="window.print();return false;">Print</a>
            <form method="POST" style="float: left; margin-right:5px;margin-bottom:0px;" action="/site/print">
                <input type="hidden" name="url" value="<?php echo $url; ?>">
                <input type="hidden" name="filename" value="<?php echo $filename; ?>">
                <input type="hidden" name="pdf" value="1">
                <button class="btn btn-primary" type="submit">Download as PDF</button>
            </form>
        <div class="clearfix"></div>
        </div>
        <?php echo $content; ?>
            <style>
                body {
                    font-family: "Open Sans", Arial, sans-serif !important;
                    width: 210mm;
                }
                <?php Utils::pdfStyle(); ?>
            </style>

    </body>
</html>