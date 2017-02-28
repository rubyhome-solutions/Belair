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
<form class="form-search" method="GET" action='/traveler/admin'>
    <div class="input-append">
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
                'class' => 'input-large search-query',
                'placeholder' => "Search traveler ...",
            ),
        ));
        ?>
        <button class="btn" type="submit"><i class="fa fa fa-search fa-lg"></i>&nbsp;&nbsp;Search</button>
    </div>
    <a class="btn btn-primary" style="margin-left: 2%;" href="/traveler/create"><i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Register new traveler</a>
</form>
