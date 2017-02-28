<?php

 namespace application\components\PGs\Wallet\CCAvenue;
 
 class Utils {
 	
 	public static function encryptRequest($working_key, $param) {
 		
 		$merchant_data = '';
	 	foreach ($param as $key => $value){
	    	$merchant_data.=$key.'='.urlencode($value).'&';
	    }
	    
	    return self::encrypt($merchant_data, $working_key );
 	}
 	
 	public static function encrypt($plainText,$key) {
		$secretKey = self::hextobin(md5($key));
		$initVector = pack("C*", 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f);
	  	$openMode = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '','cbc', '');
	  	$blockSize = mcrypt_get_block_size(MCRYPT_RIJNDAEL_128, 'cbc');
		$plainPad = self::pkcs5_pad($plainText, $blockSize);
	  	if (mcrypt_generic_init($openMode, $secretKey, $initVector) != -1) {
		      $encryptedText = mcrypt_generic($openMode, $plainPad);
	      	  mcrypt_generic_deinit($openMode);  			
		} 
		return bin2hex($encryptedText);
	}
	
	private function hextobin($hexString) {
        $length = strlen($hexString); 
        $binString="";   
        $count=0; 
        while($count<$length) {       
        	$subString =substr($hexString,$count,2);
        	$packedString = pack("H*",$subString);
        	if ($count==0) {
				$binString=$packedString;
		    } else {
				$binString.=$packedString;
		    } 
        	$count+=2; 
        } 
  	    return $binString; 
	} 
	
	private function pkcs5_pad ($plainText, $blockSize) {
	    $pad = $blockSize - (strlen($plainText) % $blockSize);
	    return $plainText . str_repeat(chr($pad), $pad);
	}
	
	public static function decrypt($encryptedText,$key) {
		$secretKey = self::hextobin(md5($key));
		$initVector = pack("C*", 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f);
		$encryptedText = self::hextobin($encryptedText);
	  	$openMode = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '','cbc', '');
		mcrypt_generic_init($openMode, $secretKey, $initVector);
		$decryptedText = mdecrypt_generic($openMode, $encryptedText);
		$decryptedText = rtrim($decryptedText, "\0");
	 	mcrypt_generic_deinit($openMode);
		//return $decryptedText;
	 	$decryptedText = preg_replace('/[[:^print:]]/', '', $decryptedText);
	 	return $decryptedText;
		
	}
 }