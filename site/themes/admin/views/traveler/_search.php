<?php
/* @var $this TravelerController */
/* @var $model Traveler */
/* @var $form CActiveForm */
?>

<style>
    .ui-widget {
        font-family: "Open Sans";
        font-size: .8em;
    }
</style>
<div class="row">
<div class="col-md-12">
<div class="ibox-title">Traveler </div>
<div class="ibox-content">
<form class="form-search" method="GET" action='/traveler/admin'>
    <div class="col-sm-10">
 <div class="input-group">      
  <?php
        echo CHtml::hiddenField('selectedvalue', '');

        $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
            'name' => 'Traveler[term]',
            'id' => 'searchbox',
            'value' => $model->term,
            'source' => '/traveler/search',
            'options' => array(
                'showAnim' => 'fold',
                'minLength' => '3',
                'select' => 'js:function( event, ui ) {
                         $("#searchbox").val( ui.item.label );
                        location.href = "/traveler/admin?selectedvalue=" + ui.item.value;
//                        $("#selectedvalue").val( ui.item.value );
                        return false;
                  }',
            ),
            'htmlOptions' => array(
                'onfocus' => 'js: this.value = null; $("#searchbox").val(null); $("#selectedvalue").val(null);',
                'class' => 'input-large search-query form-control',
                'placeholder' => "Search traveler ...",
            ),
        ));
        ?>
        <span class="input-group-btn">
        <button class="btn btn-primary" type="submit"></i> Search</button>
        </span>
    </div> </div>
    <a class="btn btn-primary"  href="/traveler/create">Register new traveler</a>
</div>
</form>
</div>
</div>
</div>