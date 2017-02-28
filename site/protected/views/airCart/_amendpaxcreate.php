<?php 
$Params = array('order' => 'id');
$titles = CHtml::listData(\TravelerTitle::model()->findAll($Params), 'id', 'name');
$types = CHtml::listData(\TravelerType::model()->findAll($Params), 'id', 'name');?>

            <tr>
                <td>Title</td>
               
                <td ><?php echo TbHtml::dropDownList( 'traveler_title_id','', $titles, ['style' => 'max-width: 150px;', 'name' => 'Amendment[traveler_title_id]']); ?></td>
            </tr>
            
            <tr>
                <td>Type</td>
               
                <td ><?php echo TbHtml::dropDownList( 'traveler_type_id','', $types, ['style' => 'max-width: 150px;', 'name' => 'Amendment[traveler_type_id]']); ?></td>
            </tr>
           
            <tr>
                <td>First Name</td>
               
                <td ><?php echo TbHtml::textField( 'first_name','', ['class' => 'center', 'name' => 'Amendment[first_name]', 'maxlength' => 200]); ?></td>
            </tr>
             <tr>
                <td>Last Name</td>
                
                <td ><?php echo TbHtml::textField( 'last_name','', ['class' => 'center', 'name' => 'Amendment[last_name]', 'maxlength' => 200]); ?></td>
            </tr>
             <tr>
                <td>Email</td>
             
                <td ><?php echo TbHtml::textField( 'email','', ['class' => 'center', 'name' => 'Amendment[email]', 'maxlength' => 200]); ?></td>
            </tr>
            <tr>
                <td>Mobile</td>
             
                <td ><?php echo TbHtml::textField( 'mobile','', ['class' => 'center', 'name' => 'Amendment[mobile]', 'maxlength' => 18]); ?></td>
            </tr>
             <tr>
                <td>Date of Birth</td>
                
                <td ><?php
            $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                'name' => 'birthdate',
                'id' => 'Traveler_birthdate',
                // additional javascript options for the date picker plugin
                'options' => array(
                    //                'showAnim' => 'fold',
                    'dateFormat' => 'yy-mm-dd',
                    'changeMonth' => 'true',
                    'changeYear' => 'true',
                    'yearRange' => 'c-30:c',
                    'defaultDate' => '-20Y',
                    'maxDate' => "-10D",
                ),
                'htmlOptions' => array(
                    'style' => 'max-width: 100px;',
                    'size' => 10,
                    'maxlength' => 10,
                    'placeholder' => 'YYYY-MM-DD'
                ),
            ));
            ?>
            <!--</div>-->
            <p id="Traveler_birthdate_em_" style="display:none" class="help-block"></p></td>
            </tr>

