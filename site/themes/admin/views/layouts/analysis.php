
<!-- Hotjar Tracking Code for www.cheaptickets.co.in -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:70092,hjsv:5};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
</script>







<?php
// installs global error and exception handlers
Rollbar::init(array('access_token' => '8713a6ebd9f44726b75fd1d2e04f3926'));

try {
    throw new Exception('test exception');
} catch (Exception $e) {
    Rollbar::report_exception($e);
}
?>