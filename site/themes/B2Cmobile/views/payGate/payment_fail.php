<div class="ui segment" style="margin: 20px auto; max-width: 800px;">
    <?php if (Yii::app()->user->hasFlash('msg')): ?>
    <div class="ui message">
        <p><?php \Yii::app()->user->getFlash('msg'); ?></p>
    </div>
    <?php endif; ?>

    <div class="ui message warning">
        <p><?php echo "This payment was not successful!<br>Bank code: $model->pg_type , Bank reference: $model->bank_ref <br>Reason: $model->reason"; ?></p>
    </div>

    <a class="ui button large" href="/payGate/payAgain/<?php echo $model->id; ?>">Click to try the same payment again</a>
</div>
