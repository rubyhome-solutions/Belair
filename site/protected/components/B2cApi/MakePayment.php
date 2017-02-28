<?php

namespace application\components\B2cApi;

/**
 * MakePayment
 *
 * @author Boxx
 * @package B2cApi
 */
class MakePayment {

    public $credentials = null;
    public $validationErrors = null;
    public $cart_id=null;
    public $ecc;
    public $id=null;
    public $type=null;
    public $name=null;
    public $number=null;
    public $exp_month=null;
    public $exp_year=null;
    public $cvv=null;
    public $store=null;
    public $pgl_id=null;
    public $category=null;
    public $store_card=null;
    public $card=null;
    public $tpBank=null;
    public $atomBank=null;
    public function __construct() {
        $this->credentials = new Auth;
    }

    
    /**
     * Validate the credentials and the card key elements
     * @return boolean
     */
    function validate() {
        $this->credentials->authenticate();
        $this->card = new CardForm;
        $this->card->number = $this->number;
        $this->card->name = $this->name;
        $this->card->exp_month = $this->exp_month;
        $this->card->exp_year = $this->exp_year;
        $this->card->cvv = $this->cvv;
       // $this->card->id = $this;
       // \Utils::dbgYiiLog($this->card);
        
        // Validate major fields
//        if (!$this->card->validate()) {
//            throw new B2cApiException(B2cApiException::DATA_VALIDATION_ERROR, null, 400,$this->card->getErrors());
//        }
        return true;
    }

    public function results($controller) {
        $pgl = \PayGateLog::model()->findByPk($this->pgl_id);
        \Utils::setActiveUserAndCompany($this->credentials->user->id);
        
        $_POST = array_merge([], [
            'card_number' => $this->number,
            'name_on_card' => $this->name,
            'expiry_month' => sprintf("%02d", $this->exp_month),
            'expiry_year' => sprintf("%02d", $this->exp_year),
            'cvv' => $this->cvv,
            'store_card' => $this->store,
            'storedCardId' => $this->id ? $this->id : false,
            'category' => $this->category,
            'pgl_id' => $this->pgl_id,
            'tpBank' => $this->tpBank,
            'atomBank' => $this->atomBank,
            'b2cApi' =>'1',
        ]);

        $controller->forward('/payGate/doPay/id/'.$pgl->id);

    }

}
