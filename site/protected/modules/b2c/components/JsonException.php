<?php

namespace b2c\components;

/**
 * Class JsonException
 * A key to throw ajax exception inside the code.
 * Throwing such exceptions require controller to use Controller\Exceptionable trait to be handled properly
 *
 * @package b2c
 */
class JsonException extends \CHttpException {
    protected $_errors;

    public function __construct($status, $message = NULL, $errors = []) {
        parent::__construct(floor($status/10), $message);

        $this->_errors = $errors;
        $this->_code = $status % 10;
    }

    public function getErrors() { return $this->_errors; }

    public function getECode() { return $this->_code; }

    public function toArray() {
        $out = [
            'code' => $this->getECode(),
            'message' => $this->getMessage()
        ];

        if (count($this->getErrors())) {
            $out['errors'] = $this->getErrors();
        }

        return $out;
    }
}