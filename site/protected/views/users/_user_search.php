<style>
    .ui-widget {
        font-family: "Open Sans";
        font-size: .8em;
    }
</style>

<form class="form-search" method="GET" action='#'>
    <div class="input-append">
        <?php
        echo CHtml::hiddenField('selectedvalue', '');

        $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
            'name' => 'searchbox',
            'id' => 'searchbox',
            'value' => '',
            'source' => CController::createUrl('/users/search'),
            'options' => array(
                'showAnim' => 'fold',
                'minLength' => '4',
                'select' => 'js:function( event, ui ) {
                        $("#searchbox").val("");
                        $.post("/users/setCompany/" + ui.item.value,{},function(data){
                            if (data.length<100) {
                                alert(data);
                            } else {
                                $("#activeCompany").remove();
                                $("ul.breadcrumb").after(data);
                            }
                        }, "text");
                        $("#selectedvalue").val( ui.item.value );
                        return false;
                  }',
            ),
            'htmlOptions' => array(
                'onfocus' => 'js: this.value = null; $("#searchbox").val(null); $("#selectedvalue").val(null);',
                'class' => 'input-xlarge search-query',
                'placeholder' => "Smart users search ...",
            ),
        ));
        ?>
        <button class="btn" type="submit">Submit</button>
    </div>
</form>
