<?php

namespace b2c\components;

class ErrorHandler {
    static protected $_old;

    static public function handleError($errno, $errstr, $errfile, $errline) {
        throw new \ErrorException($errstr, $errno, $errno, $errfile, $errline);
    }

    static public function start() {
        static::$_old = set_error_handler('\b2c\components\ErrorHandler::handleError', E_ALL);
    }

    static public function stop() {
        set_error_handler(static::$_old);
    }
}