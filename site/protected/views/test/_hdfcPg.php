<h2>HDFC test</h2>
<pre>
    <?php
    $pgl = PayGateLog::model()->findByPk(109);
    $cc = Cc::model()->findByPk(10);
    $cc->code = 123;
    $hdfc = new application\components\PGs\HDFC\FssPg($pgl, $cc);
    $res = $hdfc->authorize();
    print_r($res);
            
    ?>
</pre>
