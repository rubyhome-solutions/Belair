<p class="well well-small alert-info">&nbsp;<i class="fa fa-briefcase fa-lg"></i>&nbsp;&nbsp;Traveler(s)</p>
<?php
/* @var $this AirCartController */
/* @var $travelers Traveler[] */

foreach ($travelers as $key => $traveler) {
    echo TbHtml::errorSummary($traveler, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
    ?>
    <div id="divTravelers" class="row">
        <span class="badge badge-info" style="font-size: 1.5em;padding: 5px;line-height: 18px;vertical-align: middle;"><?php echo $key + 1; ?></span>
        <?php
//            Yii::log($airBooking->traveler_type_id);
        echo TbHtml::activeDropDownList($traveler, "[$key]traveler_type_id", CHtml::listData(TravelerType::model()->findAll(), 'id', 'name'), [
                'style' => 'max-width:80px; margin-left:0.5%;',
                'encode' => false,
                'onchange' => '
                        if ($(\'#Traveler_' . $key . '_traveler_type_id\').val() === \'' . TravelerType::TRAVELER_INFANT . '\' && 
                            $(\'#Traveler_' . $key . '_birthdate\').val() === \'\') 
                        {
                            $(\'#Traveler_' . $key . '_birthdate\').addClass(\'error\');
                        } else {
                            $(\'#Traveler_' . $key . '_birthdate\').removeClass(\'error\');
                        }'
            ]);
        echo TbHtml::activeHiddenField($traveler, "[$key]id");
        echo TbHtml::activeHiddenField($traveler, "[$key]user_info_id");
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
//            'name' => "Traveler[][birthdate]",
            'model' => $traveler,
            'attribute' => "[$key]birthdate",
            'id' => "Traveler_{$key}_birthdate",
            // additional javascript options for the date picker plugin
            'options' => array(
                //                'showAnim' => 'fold',
                'dateFormat' => 'yy-mm-dd',
                'changeMonth' => 'true',
                'changeYear' => 'true',
//                'yearRange' => 'c-30:c',
                'defaultDate' => '-1Y',
                'maxDate' => "-1D",
                'onSelect' => 'js:function() {
                        $(this).removeClass("error");
                    }',
            ),
            'htmlOptions' => array(
                'style' => 'max-width: 75px;margin-left:0.2%;',
                'size' => 10,
                'maxlength' => 10,
                'placeholder' => 'Birthdate'
            ),
        ));
        echo TbHtml::TextField("[$key]_traveler_name", empty($traveler->id) ? 'Traveler is not set!' : $traveler->combinedInfo, [
            'disabled' => true,
            'style' => 'margin-left:0.5%; width:26%;',
            'class' => empty($traveler->id) ? 'error' : ''
        ]);
        $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
            'name' => "[$key]traveler_search",
//            'id' => 
            'value' => '',
            'source' => '/traveler/search',
            'options' => array(
                'showAnim' => 'fold',
                'minLength' => '3',
                'select' => 'js:function( event, ui ) {
                        $("#_' . $key . '_traveler_name").val( ui.item.label );
                        $("#_' . $key . '_traveler_name").removeClass("error");
                        $("#Traveler_' . $key . '_id").val( ui.item.value );
                        $("#Traveler_' . $key . '_birthdate").val( ui.item.birthdate);
                        if ($("#Traveler_' . $key . '_traveler_type_id").val() === "' . TravelerType::TRAVELER_INFANT . '" && 
                            $("#Traveler_' . $key . '_birthdate").val() === "") 
                        {
                            $("#Traveler_' . $key . '_birthdate").addClass("error");
                        } else {
                            $("#Traveler_' . $key . '_birthdate").removeClass("error");
                        }
                        this.value = null;
                        return false;
                  }',
            ),
            'htmlOptions' => array(
                'onfocus' => 'js: this.value = null;',
                'class' => 'input search-query',
                'placeholder' => "Find traveler ...",
                'style' => "margin-left: 0.5%;max-width:135px;"
            ),
        ));
        ?>
        &nbsp;OR <a onclick="regNewTraveler(<?php echo $key; ?>);" class="btn btn-primary" style="margin-left: 1%;"><i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Register</a>
        <?php
        echo TbHtml::dropDownList("newTraveler[$key]_traveler_title_id", '', CHtml::listData(TravelerTitle::model()->findAll(['order' => 'id']), 'id', 'name'), ['style' => 'max-width:6%; margin-left:0.5%;', 'empty' => 'Title']);
        echo TbHtml::textField("newTraveler[$key]_first_name", '', ['style' => 'max-width:100px; margin-left:0.5%;', 'placeholder' => 'First Name']);
        echo TbHtml::textField("newTraveler[$key]_last_name", '', ['style' => 'max-width:100px; margin-left:0.5%;', 'placeholder' => 'Last Name']);
        ?>
    </div>
<?php } ?>
<script>
            function regNewTraveler(id) {
                var titleID = $('#newTraveler_' + id + '_traveler_title_id').val();
                var firstName = $('#newTraveler_' + id + '_first_name').val();
                var lastName = $('#newTraveler_' + id + '_last_name').val();
                var hasError = false;

                if (titleID == '') {
                    $('#newTraveler_' + id + '_traveler_title_id').addClass('error');
                    hasError = true;
                } else {
                    $('#newTraveler_' + id + '_traveler_title_id').removeClass('error');
                }

                if (firstName.length < 3) {
                    $('#newTraveler_' + id + '_first_name').addClass('error');
                    hasError = true;
                } else {
                    $('#newTraveler_' + id + '_first_name').removeClass('error');
                }

                if (lastName.length < 3) {
                    $('#newTraveler_' + id + '_last_name').addClass('error');
                    hasError = true;
                } else {
                    $('#newTraveler_' + id + '_last_name').removeClass('error');
                }

                if (hasError === false) {   // No input errors - register new traveler
                    $.post('/traveler/create', {
                        "Traveler[traveler_title_id]": titleID,
                        "Traveler[first_name]": firstName,
                        "Traveler[last_name]": lastName},
                    function(data) {
                        if (data.result === 'success') {
                            $('#_' + id + '_traveler_name').removeClass('error').val(data.title + ' ' + firstName + ' ' + lastName);
                            $('#Traveler_' + id + '_id').val(data.traveler_id);
                            $('#newTraveler_' + id + '_first_name').val('');
                            $('#newTraveler_' + id + '_last_name').val('');
                            $('#newTraveler_' + id + '_traveler_title_id').val('');
                        } else {
                            alert(data.message);
                        }
                    }, 'json');
                }
            }
</script>