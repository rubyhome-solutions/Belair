<?php
/* @var $this TravelerController */
/* @var $model Traveler */


$this->breadcrumbs = array(
    'Travelers' => array('admin'),
    'Manage',
);
?>

<link type="text/css" href="<?php echo \Yii::app()->theme->baseUrl ?>/css/styles.css" rel="stylesheet" media="all"/>
<?php $this->beginClip('sidebar') ?>
<?php $this->renderPartial('//layouts/_profile_sidebar') ?>
<?php $this->endClip() ?>
<?php \Yii::app()->clientScript->registerCoreScript('jquery');  ?>
<?php
$travelers = null;
$companyId = Utils::getActiveCompanyId();
// \Utils::dbgYiiLog(Utils::getActiveCompanyId());
if ($companyId) {

    $travelers = \Traveler::model()->findAll(array('order' => 'id', 'condition' => 'user_info_id=' . $companyId));
//    \Utils::dbgYiiLog($travelers);
}
?>
<?php
$id = \Yii::app()->request->getParam('id');
if ($id == null || empty($id)) {
    $id = $travelers[0]->id;
}
?>

<div class="table">
    <div>
        <div class="box my-travellers">
            <div class="left" style="width:80%">
                
                <div id="currentTraveler">
                    
                <?php $this->renderPartial('/traveler/_view', ['id' => $id]); ?>
                </div>
                </div>
                <div class="right">

                    <h2>My Travellers</h2>
                    <?php foreach ($travelers as $traveler) {
                        ?>
                        <div class="item<?php if ($traveler->id == $id) echo " active"; ?>" id="<?php echo $traveler->id; ?>">
                            <img src="<?php echo \Yii::app()->theme->baseUrl ?>/img/tmp/user.png" alt=""/>
                            <?php echo $traveler->first_name; ?>
                        </div>
                        <?php
                    }
                    ?>    

                </div>
            </div>
        </div>
    </div>
    <script>
$('.item').click(function() {
    var id=this.id;
   // window.location.href = '/traveler/admin/'+id;
   // return false;
   
   
    $.ajax({
            url: "/traveler/getTravelerData",
            type: 'POST',          
            async: true,            
            data: {'id': id},
          //  dataType: 'html',            
            success: function (data) {               
                $("#currentTraveler").html(data);
                $('.item').removeClass('active');
                $('#'+id).addClass('active');
            },
            error: function (xhr, textStatus, errorThrown) {
                // $('#'+id+' .contentarea').html(textStatus);
               // $("#scrapper").append(errorThrown);
            }
        });
   
});

    </script>