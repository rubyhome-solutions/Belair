<?php

namespace application\components\PGs\Zooz;

class ZoozException extends \Exception {

    public function __construct($message, $code = null, $previous = null) {
        parent::__construct($message, $code, $previous);
        \Yii::log('ZooZ error: ' . $message);
    }

}
