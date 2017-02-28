<div class="modal fade bs-example-modal-sm" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
        <div class="modal-header">
            Login to Your Account!
        </div>
        <?php if(!empty($authMessage)) {?>
            <div class="alert alert-warning"> <?php echo $authMessage; ?> </div>
        <?php } ?>
        <form method="post" action="/b2c/reports/reportsLogin">
        <div class="modal-body">
                <input type="hidden" name="pageUrl" value = "<?php echo  \Yii::app()->request->getUrl(); ?>">
                <div class="form-group">
                    <label>Email address</label>
                    <input type="email" class="form-control" id="LoginUname" name="LoginUname" placeholder="Email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" id="LoginPword" name="LoginPword" placeholder="Password">
                </div>
            
        </div>
        <div class="modal-footer">
            <button type="submit" name="reportsLogin" class="btn btn-primary">Login</button>
        </div>
        </form>
    </div>
  </div>
</div>
