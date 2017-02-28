<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ECCRupayValidator extends ECCValidator2 {
    const RUPAY = 'rupay';
    
    public $patterns = array(
     self::RUPAY =>'/^(508[5-9][0-9]{12})|(6069[8-9][0-9]{11})|(607[0-8][0-9]{12})|(6079[0-8][0-9]{11})|(608[0-5][0-9]{12})|(6521[5-9][0-9]{11})|(652[2-9][0-9]{12})|(6530[0-9]{12})|(6531[0-4][0-9]{11})$/',
     
    );   

    public static $cardSmallImages = [
        self::RUPAY => 'rupay.png'
    ];

    
    /**
     * 
     * @var array holds the indexes of the active cards that we want to work with
     * Should be subset of the patterns array
     * Credit Card types
     */
    public $activeCards = [
        self::RUPAY
    ];
 
    /**
     * @var boolean whether the attribute value can be null or empty. Defaults to false,
     * meaning that if the attribute is empty, it is considered invalid.
     */
    public $allowEmpty = false;    
    
    /**
     * 
     * @var string set with selected Credit Card type to check -ie ECCValidator::MAESTRO
     */
    public $format = self::RUPAY;   
    
    /**
     * Where the images can be found
     * @var string
     */
    public $assetsImages;
    
    function __construct() {
        $this->assetsImages = Yii::app()->assetManager->publish(__DIR__ . "/img") . '/';
    }    
    /**
     * 
     * Validates a Credit Card number
     * @param string $creditCardNumber
     */
    public function validateNumber($creditCardNumber) {
        
        if (!$this->checkType()) {
            throw new CException(Yii::t('ECCValidator', 'The "format" property must be specified with a supported Credit Card format.'));
        }

        $creditCardNumber = preg_replace('/[^\d]/', '', $creditCardNumber);
        return $this->checkFormat($creditCardNumber);
    }
 
    /**
     * (non-PHPdoc)
     * @see CValidator::validateAttribute()
     */
    protected function validateAttribute($object, $attribute) {
      
        $value = $object->$attribute;
        if ($this->allowEmpty && $this->isEmpty($value)) {
            return;
        }

        if (!$this->validateNumber($value)) {
            $message = $this->message !== null ? $this->message : Yii::t('ECCValidator', '{attribute} is not a valid Credit Card number.');
            $this->addError($object, $attribute, $message);
        }
    }
    
    /**
     * 
     * Checks Credit Card Prefixes
     *
     * @access  private
     * @param   string  cardNumber
     * @return  boolean true|false
     */
    protected function checkFormat($cardNumber) {
        return preg_match('/^[0-9]+$/', $cardNumber) && preg_match($this->patterns[$this->format], $cardNumber);
    }
 
     /**
     * Guess the card type based on the number
     * @param string $creditCardNumber The card number
     * @return string Card type or boolean false if no match
     */
    function cardType($creditCardNumber) {
        $tmp = $this->format;
        foreach ($this->activeCards as $ccType) {
            if (!array_key_exists($ccType, $this->patterns)) {
                return false;
            }
            $this->format = $ccType;
            if ($this->validateNumber($creditCardNumber)) {
                $this->format = $tmp;
                return $ccType;
            }
        }
        $this->format = $tmp;
        return false;
    }   
    
    /**
     * 
     * Checks if Credit Card Format is a supported one
     * and builds new pattern format in case user has
     * a mixed match search (mastercard|visa)
     * 
     * @access public
     * @return boolean
     */
    function checkType() {

        if (is_scalar($this->format)) {
            return array_key_exists($this->format, $this->patterns);
        } else if (is_array($this->format)) {
            $pattern = array();
            foreach ($this->format as $f) {
                if (!array_key_exists($f, $this->patterns)) {
                    return false;
                }
                $pattern[] = substr($this->patterns[$f], 2, -2);
            }
            
            $this->patterns[self::CUSTOM] = '/^(' . join('|', $pattern) . ')$/';
            $this->format = self::CUSTOM;
            return true;
        }
        return false;
    }  
     /**
     * Generate image tags from card number
     * @param string $creditCardNumber
     * @return string The generated img tag or empty string
     */
    function getSmallImageTag($creditCardNumber) {
        $type = $this->cardType($creditCardNumber);
        if ($type === false) {
            return '';
        }
        return "<img src='" . $this->assetsImages . self::$cardSmallImages[$type] . "' />";
    }

    /**
     * Generate image tags from card type
     * @param string $cardType
     * @return string The generated img tag or empty string
     */
    function getSmallImageTagFromType($cardType) {
        if (empty($cardType)) {
            return '';
        }
        return "<img src='" . $this->assetsImages . self::$cardSmallImages[$cardType] . "' />";
    }   
}