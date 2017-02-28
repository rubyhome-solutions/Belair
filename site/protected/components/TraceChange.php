<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class TraceChange extends CActiveRecordBehavior {

    public function compare($other, $rel_cols) {
        if (!is_object($other))
            return false;

        // does the objects have the same type?
        if (get_class($this->owner) !== get_class($other))
            return false;

        $string = '';
        foreach ($this->owner->attributes as $key => $value) {
            $old = $this->owner->$key;
            $new = $other->$key;
            if ($old == $new) {
                continue;
            }
            // Dynamically get the values from related Model
            // Configured in the controller while accessing this behaviour
            if (isset($rel_cols[$key])) {
                if (!empty($old)) {
                    $old = $rel_cols[$key]['model']::model()->findByPk($old)->$rel_cols[$key]['field_name'];
                }
                if (!empty($new)) {
                    $new = $rel_cols[$key]['model']::model()->findByPk($new)->$rel_cols[$key]['field_name'];
                }
            }
            if ($string != '') {
                $string .= '<br>';
            }
            $string .= $other->getAttributeLabel($key);
            $string .= '[Old:' . $old . ',New:' . $new . ']';
        }
        return $string;
    }

}
