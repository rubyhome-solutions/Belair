<?php
$pgl = new \PayGateLog;
//$pgl->pg_id = \PaymentGateway::ATOM_TEST;
$pgl->pg_id = \PaymentGateway::ATOM_PRODUCTION;
$pgl->amount = 123;
// $pgl->air_cart_id = 123;
$pgl->user_info_id = 585;
$pgl->bank_ref = 2001;  // test Atom bank 
$pgl->bank_ref = 1005;  // test Yes bank 
$pgl->setBasics();
$pgl->insert();

$atom = new application\components\PGs\Atom\Paynetz($pgl);
$res = $atom->startNewTransaction();
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