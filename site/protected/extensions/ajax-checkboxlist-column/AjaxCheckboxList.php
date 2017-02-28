<?php

/**
 * AjaxSelectColumn class file.
 * Simple class for displaying CGridView columns as select elements which update the model via ajax
 * 
 * @author Kirsty Forrester <kirstyaforrester@gmail.com>
 * @copyright Copyright Kirsty Forrester 2013
 * @license GPL version 3.0
 */
class AjaxCheckboxList extends CDataColumn {

    /**
     * The URL to which the input value is sent via POST
     * If left blank, will default to current URL
     * @var string
     */
    public $url;

    /**
     * HTML options for select element
     * @var array
     */
    public $selectOptions = array();

    /**
     * The class of the data column model, determined by $data
     * @var string
     */
    private $_modelClass;

    /**
     * Whether scripts have been registered yet or not
     * @var boolean
     */
    private $_scriptRegistered = false;

    /**
     * Initializes the column and attaches ajax update event
     */
    public function init() {
        $this->attachAjaxUpdateEvent();

        return parent::init();
    }

    /**
     * Renders the data cell content
     * @param  integer $row the row number (zero-based)
     * @param  mixed $data the data associated with the row
     */
    protected function renderDataCellContent($row, $data) {
        $this->_modelClass = get_class($data);

        if ($this->value !== null)
            $value = $this->evaluateExpression($this->value, array('data' => $data, 'row' => $row));
        elseif ($this->name !== null)
            $value = CHtml::value($data, $this->name);

        if ($value === null) {
            echo $this->grid->nullDisplay;
        } else {
            $fieldId = $this->_modelClass . '_' . strtolower($this->name) . '_' . $data->id;

            if (!$this->_scriptRegistered) {

                $script = $this->registerScripts();
                Yii::app()->clientScript->registerScript(__CLASS__ . '-ajax-checkbox-list-' . $fieldId, "
                    $('#" . $this->grid->id . "')
                    .parent()
                    .on('ajaxUpdate.yiiGridView',
                    '#" . $this->grid->id . "', function(){" . $script . "});
                ");
                $this->_scriptRegistered = true;
            }
            $name = $this->name;
            $htmlOptions = array(
                'template' => '<div class="chk-chk">{input}{label}</div>',
                'separator' => '',
                'class' => 'in-checkbox ajax-checkbox-list',
                'baseID' => $name . '_' . $data->id,
                'data-id' => $data->id,
                'data-name' => $this->name,
                'data-url' => CHtml::normalizeUrl($this->url),
                'multiple' => true,
                'checked' => 'checked'
            );
            $selectedArr = array();
            foreach ($this->selectOptions as $key => $value) {
                if ($key & $data->$name) {
                    $selectedArr[] = $key;
                }
            }
            echo CHtml::checkBoxList($this->name, $selectedArr, $this->selectOptions, $htmlOptions);
        }
    }

    /**
     * Register scripts
     */
    protected function registerScripts() {
        $cs = Yii::app()->clientScript;
        $cs->registerCoreScript('jquery');
        // \Utils::dbgYiiLog($this->grid->id);
        $script = "
            $('#" . $this->grid->id . "').on('change', '.ajax-checkbox-list', function(e){
              
                var id = $(this).data('id');
                selectDays(this);
                var name = $(this).data('name');
                var value = getSelectedDays(this);
                var url = $(this).data('url');
                $.post(url,
                {id: id, name: name, value: value, class: '" . $this->_modelClass . "'})
                .done(function(data) {
                    $.fn.yiiGridView.update('" . $this->grid->id . "');
                });
                
                //usefull methods for checked/unchecked and get data
                function selectDays(Obj)
                {
                    var divObj = $(Obj).parent().parent();
                    if ($(Obj).prop('checked')==true && $(Obj).val()==256){ 
                         //unchecked all checkbox
                        $(divObj).find('.ajax-checkbox-list').each(function(){
                           $(this).prop('checked','');
                        }); 
                        //checked all type chekbox
                        $(Obj).prop('checked','checked');
                    }else{
                        
                        $(divObj).find('.ajax-checkbox-list').each(function(){
                            if($(this).val()==256){
                              $(this).prop('checked','');  
                            }

                        }); 

                    }

                }

                function getSelectedDays(Obj)
                {
                     var selectedDays = new Array();
                    //unchecked all checkbox
                    var divObj = $(Obj).parent().parent();
                    $(divObj).find('.ajax-checkbox-list').each(function(){
                      if($(this).prop('checked')==true){
                          selectedDays.push($(this).val());
                      }
                    }); 

                   return selectedDays;
                }               
            });
        ";

        $cs->registerScript('AjaxCheckboxList', $script, CClientScript::POS_END);

        return $script;
    }

    /**
     * Attach ajax update event since Yii doesn't allow custom js events
     * Credit to Vitalets
     * Code from: https://github.com/yiisoft/yii/issues/1313 
     */
    protected function attachAjaxUpdateEvent() {
        $trigger = '$("#"+id).trigger("ajaxUpdate");';

        //check if trigger already inserted by another column
        if (strpos($this->grid->afterAjaxUpdate, $trigger) !== false)
            return;

        //inserting trigger
        if (strlen($this->grid->afterAjaxUpdate)) {
            $orig = $this->grid->afterAjaxUpdate;
            if (strpos($orig, 'js:') === 0)
                $orig = substr($orig, 3);
            $orig = "\n($orig).apply(this, arguments);";
        } else {
            $orig = '';
        }
        $this->grid->afterAjaxUpdate = "js: function(id, data) {
            $trigger $orig
        }";
    }

}
