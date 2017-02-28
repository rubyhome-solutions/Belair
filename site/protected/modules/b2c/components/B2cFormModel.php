<?php

namespace b2c\components;

abstract class B2cFormModel extends \CFormModel {
    static public function factory($attributes, $scenario = null) {
        $form = new static($scenario);
        foreach ($attributes as $k => $v) {
            $form->$k = $v;
        }

        return $form;
    }

    static public function submit($attributes, $scenario = null) {
        $form = static::factory($attributes, $scenario);

        if (!$form->validate()) {
            throw new B2cException(4001, 'Validation Error', $form->getErrors());
        }

        return call_user_func_array([$form, 'process'], array_slice(func_get_args(), 2));
    }
}