<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Please Wait ...</title>
        <style>
            body {
                margin: 0;
                padding: 0;
            }
            #background
            {
                padding: 15% 0 0 0;
            }

            .Layer0
            {
                font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
            }


        </style>
        <script src="/themes/admin/new/js/jquery-2.1.1.js"></script>
    </head>
    <body>
        <?php
        $site_name = 'CheapTicket.in';
        if (\Yii::app()->theme->name == 'F2G') {
            $site_name = 'CheapTickets24.com';
        } else if (\Yii::app()->theme->name == 'ATI') {
            $site_name = 'AirTicketsIndia.com';
        }
        ?>
    <center>
        <div id="background">
            <div class="Layer2"><img src="/themes/<?php echo \Yii::app()->theme->name; ?>/img/logo.png"></div><br/>
            <div class="Layer3"><img src="/img/loader.gif" width=100px; height=100px;></div><br/>
            <div class="Layer0">
                <h4>Please be patient while we redirect you to <?php echo $site_name; ?>.</h4>
                <p style="text-align">Do not "Close the window" or press "refresh" or "browser back/forward button".</p>

            </div>
        </div>
    </center>
</body>
</html>
<?php
$url = Yii::app()->createUrl('/b2c/booking', array('id' => $booking->id));
?>
<script>
    $(document).ready(function ($) {
        setTimeout(function () {
            window.location.href = '<?php echo $url; ?>'
        }, 2000);
    });
</script>
