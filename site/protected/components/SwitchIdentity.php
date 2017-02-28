<?php

/**
 * SwitchIdentity - used for emulation
 *
 * @author Boxx
 */
class SwitchIdentity extends CBaseUserIdentity {

    private $_id;
    private $_name;

    public function SwitchIdentity($userId, $userName) {
        $this->_id = $userId;
        $this->_name = $userName;
    }

    public function getId() {
        return $this->_id;
    }

    public function getName() {
        return $this->_name;
    }

    public function authenticate() {
        $this->errorCode = self::ERROR_NONE;
        return true;
    }

}

?>
