<?php
/* @var $this SiteController */

$this->pageTitle = Yii::app()->name;
?>

<h2>Welcome <small><?php echo CHtml::encode(Yii::app()->user->name); ?></small></h2>

<div class="span3 pull-left text-center">
    <a href="/case/create" class="btn btn-block btn-primary btn-large">Case search</a>
    <a href="/case/admin" class="btn btn-block btn-primary btn-large">Manage cases</a>
    <a href="/case/index" class="btn btn-block btn-primary btn-large">View cases</a>
    <a href="/case/manualCreate" class="btn btn-block btn-primary btn-large">Manual create new case</a><br />
    <a href="/CaseGroupName/create" class="btn btn-block btn-primary btn-large">Create Legal matter</a>
    <a href="/CaseGroupName/admin" class="btn btn-block btn-primary btn-large">Manage Legal matters</a>
    <a href="/lawFirm/admin" class="btn btn-block btn-primary btn-large">Law Firms</a><br />
    <a href="/users/admin" class="btn btn-block btn-primary btn-large">Manage users</a>
    <a href="/users/index" class="btn btn-block btn-primary btn-large">View users</a><br />
    <a href="/jobs/index" class="btn btn-block btn-primary btn-large">Background Processes</a><br />
    <a href="/phpsysinfo" target="_blank" class="btn btn-block btn-primary btn-large">Server Status</a>
</div>    
<div class="span8 text-center">
    <img src="/images/analytics-hr.jpg" />
    <p>Fancy data analytics are coming soon! Embrace for impact!</p>
</div>    

