<?php
namespace application\components\PGs\Wallet\PayTM;

class Utils{
	const SUCCESS_STATUS = "TXN_SUCCESS";
	const SUCCESS_RESPCODE = "01";
	const REFUND_SUCCESS_RESPONSECODE = '10';
    const FAILURE_STATUS = 'TXN_FAILURE';
	
	
	private function getArray2Str($arrayList) {
		$paramStr = "";
		$flag = 1;
		foreach ( $arrayList as $key => $value ) {
			if ($flag) {
				$paramStr .= self::checkString_e ( $value );
				$flag = 0;
			} else {
				$paramStr .= "|" . self::checkString_e ( $value );
			}
		}
		return $paramStr;
	}
	private function generateSalt_e($length) {
		$random = "";
		srand ( ( double ) microtime () * 1000000 );
	
		$data = "AbcDE123IJKLMN67QRSTUVWXYZ";
		$data .= "aBCdefghijklmn123opq45rs67tuv89wxyz";
		$data .= "0FGH45OP89";
	
		for($i = 0; $i < $length; $i ++) {
			$random .= substr ( $data, (rand () % (strlen ( $data ))), 1 );
		}
	
		return $random;
	}
	private function encrypt_e($input, $ky) {
		$key = $ky;
		$size = mcrypt_get_block_size ( MCRYPT_RIJNDAEL_128, 'cbc' );
		$input = self::pkcs5_pad_e ( $input, $size );
		$td = mcrypt_module_open ( MCRYPT_RIJNDAEL_128, '', 'cbc', '' );
		$iv = "@@@@&&&&####$$$$";
		mcrypt_generic_init ( $td, $key, $iv );
		$data = mcrypt_generic ( $td, $input );
		mcrypt_generic_deinit ( $td );
		mcrypt_module_close ( $td );
		$data = base64_encode ( $data );
		return $data;
	}
	private function checkString_e($value) {
		$myvalue = ltrim ( $value );
		$myvalue = rtrim ( $myvalue );
		if ($myvalue == 'null')
			$myvalue = '';
			return $myvalue;
	}
	private function pkcs5_pad_e($text, $blocksize) {
		$pad = $blocksize - (strlen ( $text ) % $blocksize);
		return $text . str_repeat ( chr ( $pad ), $pad );
	}
	
	private function removeCheckSumParam($arrayList) {
		if (isset($arrayList["CHECKSUMHASH"])) {
			unset($arrayList["CHECKSUMHASH"]);
		}
		return $arrayList;
	}
	
	private function decrypt_e($crypt, $ky) {
		$crypt = base64_decode($crypt);
		$key = $ky;
		$td = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', 'cbc', '');
		$iv = "@@@@&&&&####$$$$";
		mcrypt_generic_init($td, $key, $iv);
		$decrypted_data = mdecrypt_generic($td, $crypt);
		mcrypt_generic_deinit($td);
		mcrypt_module_close($td);
		$decrypted_data = self::pkcs5_unpad_e($decrypted_data);
		$decrypted_data = rtrim($decrypted_data);
		return $decrypted_data;
	}
	
	private function pkcs5_unpad_e($text) {
		$pad = ord($text{strlen($text) - 1});
		if ($pad > strlen($text))
			return false;
			return substr($text, 0, -1 * $pad);
	}
    
    public function validateChecksum($arrayList, $key, $checksumvalue) {
		$arrayList = self::removeCheckSumParam($arrayList);
		ksort($arrayList);
		$str = self::getArray2Str($arrayList);
		$paytm_hash = self::decrypt_e($checksumvalue, $key);
		$salt = substr($paytm_hash, -4);
	
		$finalString = $str . "|" . $salt;
	
		$website_hash = hash("sha256", $finalString);
		$website_hash .= $salt;
	
		$validFlag = "FALSE";
		if ($website_hash == $paytm_hash) {
			$validFlag = "TRUE";
		} else {
			$validFlag = "FALSE";
		}
		return $validFlag;
	}
    
    public static function generateChecksum($arrayList, $key, $sort = 1) {
		if ($sort != 0) {
			ksort ( $arrayList );
		}
		$str = self::getArray2Str ( $arrayList );
		$salt = self::generateSalt_e ( 4 );
		$finalString = $str . "|" . $salt;
		$hash = hash ( "sha256", $finalString );
		$hashString = $hash . $salt;
		$checksum = self::encrypt_e ( $hashString, $key );
		return $checksum;
	}
}

