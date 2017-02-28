<?php
$pgl = new \PayGateLog;
//$pgl->pg_id = \PaymentGateway::ATOM_TEST;
$pgl->pg_id = \PaymentGateway::HDFC2_TEST;
//$pgl->pg_id = \PaymentGateway::HDFC2_PRODUCTION;
$pgl->cc_id = 3; // Dodo
$pgl->amount = 123;
// $pgl->air_cart_id = 123;
$pgl->user_info_id = 585;
$pgl->setBasics();
$pgl->insert();

$pgService = new application\components\PGs\HDFC2\Pg($pgl, '123');
$res = $pgService->startNewTransaction();
echo \Utils::dbg($res);
if (empty($res['error'])) {
    ?>
    <form action='<?php echo $res['url'] ?>' method='post' name='frm'>
        <?php
        foreach ($res['outParams'] as $a => $b) {
            echo "<input name='$a' value='$b'>";
        }
        ?>
        <button class="btn btn-primary" type="submit">Submit</button>
    </form>
<?php } ?>