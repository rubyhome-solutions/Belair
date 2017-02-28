<?php
/* @var $this TravelerController */
/* @var $model Traveler */

$this->breadcrumbs = array(
    'Travelers' => array('admin'),
    'Update',
);
?>
<div class="span5" style="margin-left:0;">
    <div class="form">
        <?php $this->renderPartial('_form', array('model' => $model)); ?>
    </div>

    <div class="form form-horizontal">
        <form method="POST" action="/traveler/preferences/<?php echo $model->id; ?>">
            <fieldset>
                <legend>Preferences</legend>
                <?php $this->renderPartial('_preferences', array('model' => $model)); ?>
            </fieldset>
        </form>
    </div>
</div>

<form class="form span6">
    <fieldset>
        <legend>VISAs</legend>
        <?php $this->renderPartial('_visas', array('model' => $model)); ?>
    </fieldset>
</form>

<form class="form span6" method="POST" enctype="multipart/form-data" action="/traveler/uploadFile/<?php echo $model->id; ?>">
    <fieldset>
        <legend>Files</legend>
        <?php $this->renderPartial('_files', array('model' => $model)); ?>
    </fieldset>
</form>


<form class="form span5" method="POST" action="/traveler/ffAdd/<?php echo $model->id; ?>">
    <fieldset>
        <legend>Frequent Flier</legend>
        <?php $this->renderPartial('_ff', array('model' => $model)); ?>
    </fieldset>
</form>
<?php
if (Authorization::getIsStaffLogged()) {
    ?>
    <form class="form span6">
        <fieldset>
            <legend>Change Logs</legend>
            <?php $this->renderPartial('_changelogs', array('model' => $model,'notes'=>array_reverse($model->getNotes()))); ?>
        </fieldset>
    </form>
<?php } ?>
