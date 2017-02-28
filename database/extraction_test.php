<?php
$start_timer = microtime(true);

function enc_dec() {

    if (PHP_OS == 'Linux')
        $key = exec('/sbin/blkid');
    else
        $key = file_get_contents('e:\tmp\belair\blkid');

    $CC = '4007000000027';
	$ccEnc='CPOvY4YkYlnObqmz7w==';

    $encrypted = mcrypt_cfb(MCRYPT_RIJNDAEL_128, substr($key, 32, 32), $CC, MCRYPT_ENCRYPT, substr($key, 51, 16));
    $decrypted = mcrypt_cfb(MCRYPT_RIJNDAEL_128, substr($key, 32, 32), $encrypted, MCRYPT_DECRYPT, substr($key, 51, 16));
    $decrypted2 = mcrypt_cfb(MCRYPT_RIJNDAEL_128, substr($key, 32, 32), base64_decode($ccEnc), MCRYPT_DECRYPT, substr($key, 51, 16));

    echo "Original : $CC\n";
    echo "encrypted: " . base64_encode($encrypted) . "\n";
	// echo "encrypted: " . pack('H*', $encrypted) . "\n";
    echo "decrypted: $decrypted \n";
    echo "decrypted2: $decrypted2 \n";
}

function cryptTest() {
    $str = "123456";
//    $salt = openssl_random_pseudo_bytes(22);
    $salt = '$2y$07$' . strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
    $crypted = crypt($str, $salt);
    $crypted2 = crypt($str, $crypted);
    $crypted3 = crypt('1234567', $crypted);
    echo "String: \t$str\n";
    echo "Salt: \t$salt\n";
    echo "Crypted:\t$crypted\n";
    echo "Crypted2:\t$crypted2\n";
    echo "Crypted3:\t$crypted3\n";
    if ($crypted === $crypted2)
        echo "It's OK!!!\n";
    else
        echo "WRONG !!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n";
}


function enc_dec2($number) {
     $str = random_string(5,5).':'.$number.':' . random_string(5,5);
     $td = mcrypt_module_open(MCRYPT_RIJNDAEL_256, '', MCRYPT_MODE_CBC, '');
	 $ivSize = mcrypt_enc_get_iv_size($td);
	 echo "IV size => $ivSize\n";
     $site_encryption_key = '123123123123';    
     $site_encryption_key = hash('sha256', $site_encryption_key, true);    
	 echo "Enc key size => " . strlen($site_encryption_key) . " $site_encryption_key \n";
     mcrypt_generic_init($td, $site_encryption_key, $site_encryption_key);
     $encrypted_data = mcrypt_generic($td, $str);
     mcrypt_generic_deinit($td);
     mcrypt_module_close($td);
     echo "Encrypted data: " . base64_encode($encrypted_data) . "\n";
	 $encoded_data = '3trdrGlIUFeeronkionrxtu1t8pOsfJtEKt3yZ/GEgN3lTO0EsDfjpuyPHTQNzMzUFfo7OhK6qxTZ2A45/Uy+Q';
	 
	 // Lets decrypt
     $td = mcrypt_module_open(MCRYPT_RIJNDAEL_256, '', MCRYPT_MODE_CBC, '');
     mcrypt_generic_init($td, $site_encryption_key, $site_encryption_key);
     $decrypted_data = mdecrypt_generic($td, $encrypted_data);
     mcrypt_generic_init($td, $site_encryption_key, $site_encryption_key);
     $decrypted_data2 = mdecrypt_generic($td, base64_decode($encoded_data));
     mcrypt_generic_deinit($td);
     mcrypt_module_close($td);
     echo "Decrypted data:  $decrypted_data ***\n";
     echo "Decrypted data2: $decrypted_data2 ***\n";
	 var_dump($decrypted_data);
	 $decrypted_data = rtrim($decrypted_data, "\0");
	 var_dump($decrypted_data);
	 
   }

function random_string($num_characters=5,$num_digits=3)
   {
     // via http://salman-w.blogspot.com/2009/06/generate-random-strings-using-php.html
       $character_set_array = [];
       $character_set_array[] = array('count' => $num_characters, 'characters' => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
       $character_set_array[] = array('count' => $num_digits, 'characters' => '0123456789');
       $temp_array = [];
       foreach ($character_set_array as $character_set) {
           for ($i = 0; $i < $character_set['count']; $i++) {
               $temp_array[] = $character_set['characters'][rand(0, strlen($character_set['characters']) - 1)];
           }
       }
       shuffle($temp_array);
       return implode('', $temp_array);
   }

// foreach (mcrypt_list_modes() as $mode) {echo "$mode \n";}

// enc_dec();
// cryptTest();
echo enc_dec2('4007000000027');

echo "\n\nUsed: " . (microtime(true) - $start_timer) . "sec.\n";
exit;



// $content = '[{i:100001,n:"Afghanistan"},{i:100002,n:"Aland\x20Islands"},{i:100003,n:"Albania"},{i:100004,n:"Algeria"},{i:100005,n:"Andorra"},{i:100006,n:"Angola"},{i:100007,n:"Anguilla"},{i:100008,n:"Antartica"},{i:100009,n:"Antigua\x20And\x20Barbuda"},{i:100010,n:"Argentina"},{i:100011,n:"Armenia"},{i:100012,n:"Aruba"},{i:100014,n:"Australia"},{i:100015,n:"Austria"},{i:100016,n:"Azerbaijan"},{i:100017,n:"Bahamas"},{i:100018,n:"Bahrain"},{i:100019,n:"Bangladesh"},{i:100020,n:"Barbados"},{i:100021,n:"Belarus"},{i:100022,n:"Belgium"},{i:100023,n:"Belize"},{i:100024,n:"Benin"},{i:100025,n:"Bermuda"},{i:100026,n:"Bhutan"},{i:100027,n:"Bolivia"},{i:100028,n:"Bosnia\x20Herzegovina"},{i:100029,n:"Botswana"},{i:100030,n:"Bouvet\x20Island"},{i:100031,n:"Brazil"},{i:100032,n:"British\x20Indian\x20Ocean\x20Territory"},{i:100033,n:"British\x20Virgin\x20Islands"},{i:100034,n:"Brunei"},{i:100035,n:"Bulgaria"},{i:100036,n:"Burkina\x20Faso"},{i:100037,n:"Burundi"},{i:100038,n:"Cambodia"},{i:100039,n:"Cameroon"},{i:100040,n:"Canada"},{i:100041,n:"Cape\x20Verde"},{i:100042,n:"Cayman\x20Islands"},{i:100043,n:"Central\x20African\x20Republic"},{i:100044,n:"Chad"},{i:100045,n:"Chile"},{i:100046,n:"China"},{i:100047,n:"Christmas\x20Island"},{i:100048,n:"Cocos\x20Islands"},{i:100049,n:"Colombia"},{i:100050,n:"Comoros"},{i:100051,n:"Congo"},{i:100052,n:"Congo\x20Democratic\x20Republic\x20Of"},{i:100053,n:"Cook\x20Islands"},{i:100054,n:"Costa\x20Rica"},{i:100108,n:"Cote\x20d\x60Ivoire"},{i:100055,n:"Croatia"},{i:100056,n:"Cuba"},{i:100057,n:"Cyprus"},{i:100058,n:"Czech"},{i:100059,n:"Denmark"},{i:100060,n:"Djibouti"},{i:100061,n:"Dominica"},{i:100062,n:"Dominican\x20Republic"},{i:100063,n:"Ecuador"},{i:100064,n:"Egypt"},{i:100065,n:"El\x20Salvador"},{i:100066,n:"Equatorial\x20Guinea"},{i:100067,n:"Eritrea"},{i:100068,n:"Estonia"},{i:100069,n:"Ethiopia"},{i:100070,n:"Faeroe\x20Islands"},{i:100071,n:"Falkland\x20Islands"},{i:100072,n:"Fiji\x20Islands"},{i:100073,n:"Finland"},{i:100074,n:"France"},{i:100075,n:"French\x20Guiana"},{i:100076,n:"French\x20Polynesia"},{i:100077,n:"French\x20Southern\x20Territories"},{i:100078,n:"Gabon"},{i:100079,n:"Gambia"},{i:100080,n:"Georgia"},{i:100081,n:"Germany"},{i:100082,n:"Ghana"},{i:100083,n:"Gibraltar"},{i:100084,n:"Greece"},{i:100085,n:"Greenland"},{i:100086,n:"Grenada"},{i:100087,n:"Guadeloupe"},{i:100088,n:"Guam"},{i:100089,n:"Guatemala"},{i:100090,n:"Guernsey"},{i:100091,n:"Guinea"},{i:100092,n:"Guinea\x20Bissau"},{i:100093,n:"Guyana"},{i:100094,n:"Haiti"},{i:100095,n:"Heard\x20Island\x20and\x20McDonald\x20Islands"},{i:100096,n:"Honduras"},{i:100097,n:"Hong\x20Kong"},{i:100098,n:"Hungary"},{i:100099,n:"Iceland"},{i:100100,n:"India"},{i:100101,n:"Indonesia"},{i:100102,n:"Iran"},{i:100103,n:"Iraq"},{i:100104,n:"Ireland"},{i:100105,n:"Isle\x20Of\x20Man"},{i:100106,n:"Israel"},{i:100107,n:"Italy"},{i:100109,n:"Jamaica"},{i:100110,n:"Japan"},{i:100111,n:"Jersey\x20Island"},{i:100112,n:"Jordan"},{i:100113,n:"Kazakstan"},{i:100114,n:"Kenya"},{i:100115,n:"Kiribati"},{i:100116,n:"Korea,\x20Democratic\x20Peoples\x20Republic"},{i:100117,n:"Korea,\x20Republic\x20Of"},{i:100249,n:"Kosovo"},{i:100118,n:"Kuwait"},{i:100119,n:"Kyrgyzstan"},{i:100120,n:"Laos"},{i:100121,n:"Latvia"},{i:100122,n:"Lebanon"},{i:100123,n:"Lesotho"},{i:100124,n:"Liberia"},{i:100125,n:"Libyan\x20Arab\x20Jamahiriya"},{i:100126,n:"Liechtenstein"},{i:100127,n:"Lithuania"},{i:100128,n:"Luxembourg"},{i:100129,n:"Macau"},{i:100130,n:"Macedonia"},{i:100131,n:"Madagascar"},{i:100132,n:"Malawi"},{i:100133,n:"Malaysia"},{i:100134,n:"Maldives"},{i:100135,n:"Mali"},{i:100136,n:"Malta"},{i:100137,n:"Mariana\x20Islands"},{i:100138,n:"Marshall\x20Islands"},{i:100139,n:"Martinique"},{i:100140,n:"Mauritania"},{i:100141,n:"Mauritius"},{i:100142,n:"Mayotte"},{i:100143,n:"Mexico"},{i:100144,n:"Micronesia"},{i:100145,n:"Moldova"},{i:100146,n:"Monaco"},{i:100147,n:"Mongolia"},{i:100148,n:"Montenegro"},{i:100149,n:"Montserrat"},{i:100150,n:"Morocco"},{i:100151,n:"Mozambique"},{i:100152,n:"Myanmar"},{i:100153,n:"Namibia"},{i:100154,n:"Nauru"},{i:100155,n:"Nepal"},{i:100156,n:"Netherland\x20Antilles"},{i:100157,n:"Netherlands"},{i:100158,n:"New\x20Caledonia"},{i:100159,n:"New\x20Zealand"},{i:100160,n:"Nicaragua"},{i:100161,n:"Niger"},{i:100162,n:"Nigeria"},{i:100163,n:"Niue"},{i:100164,n:"Norfolk\x20Island"},{i:100165,n:"Norway"},{i:100167,n:"Oman"},{i:100168,n:"Pakistan"},{i:100169,n:"Palau"},{i:100166,n:"Palestinian\x20Territories"},{i:100170,n:"Panama"},{i:100171,n:"Papua\x20New\x20Guinea\x20\x28Niugini\x29"},{i:100172,n:"Paraguay"},{i:100173,n:"Peru"},{i:100174,n:"Philippines"},{i:100175,n:"Pitcairn"},{i:100176,n:"Poland"},{i:100177,n:"Portugal"},{i:100247,n:"Puerto\x20Rico"},{i:100178,n:"Qatar"},{i:100179,n:"Reunion"},{i:100180,n:"Romania"},{i:100181,n:"Russia"},{i:100182,n:"Rwanda"},{i:100245,n:"Saint\x20Barthelemy"},{i:100013,n:"Saint\x20Helena"},{i:100204,n:"Saint\x20Kitts\x20and\x20Nevis"},{i:100183,n:"Saint\x20Lucia"},{i:100246,n:"Saint\x20Martin"},{i:100205,n:"Saint\x20Pierre\x20and\x20Miquelon"},{i:100184,n:"Saint\x20Vincent\x20And\x20The\x20Grenadines"},{i:100185,n:"Samoa,\x20American"},{i:100186,n:"Samoa,\x20Independent\x20State\x20Of"},{i:100187,n:"San\x20Marino"},{i:100188,n:"Sao\x20Tome\x20and\x20Principe"},{i:100189,n:"Saudi\x20Arabia"},{i:100190,n:"Senegal"},{i:100191,n:"Serbia"},{i:100193,n:"Seychelles\x20Islands"},{i:100194,n:"Sierra\x20Leone"},{i:100195,n:"Singapore"},{i:100196,n:"Slovakia"},{i:100197,n:"Slovenia"},{i:100198,n:"Solomon\x20Islands"},{i:100199,n:"Somalia"},{i:100200,n:"South\x20Africa"},{i:100201,n:"South\x20Georgia\x20And\x20S\x20Sandwich\x20Island"},{i:2129697,n:"South\x20Sudan"},{i:100202,n:"Spain"},{i:100203,n:"Sri\x20Lanka"},{i:100206,n:"Sudan"},{i:100207,n:"Suriname"},{i:100208,n:"Svalbard\x20And\x20Jan\x20Mayen\x20Is"},{i:100209,n:"Swaziland"},{i:100210,n:"Sweden"},{i:100211,n:"Switzerland"},{i:100212,n:"Syrian\x20Arab\x20Rep."},{i:100213,n:"Taiwan"},{i:100214,n:"Tajikistan"},{i:100215,n:"Tanzania"},{i:100216,n:"Thailand"},{i:100217,n:"Timor\x20Leste"},{i:100218,n:"Togo"},{i:100219,n:"Tokelau"},{i:100220,n:"Tonga"},{i:100221,n:"Trinidad\x20and\x20Tobago"},{i:100222,n:"Tunisia"},{i:100223,n:"Turkey"},{i:100224,n:"Turkmenistan"},{i:100225,n:"Turks\x20And\x20Caicos\x20Islands"},{i:100226,n:"Tuvalu"},{i:100248,n:"US\x20Virgin\x20Islands"},{i:100227,n:"Uganda"},{i:100228,n:"Ukraine"},{i:100229,n:"United\x20Arab\x20Emirates"},{i:100230,n:"United\x20Kingdom"},{i:100231,n:"United\x20States"},{i:100232,n:"United\x20States\x20Minor\x20Outlying\x20Islnds"},{i:100233,n:"Uruguay"},{i:100234,n:"Uzbekistan\x20Sum"},{i:100235,n:"Vanuatu"},{i:100236,n:"Vatican\x20City\x20State"},{i:100237,n:"Venezuela"},{i:100238,n:"Vietnam"},{i:100239,n:"Wallis\x20and\x20Futuna\x20Islands"},{i:100240,n:"Western\x20Sahara"},{i:100241,n:"Yemen"},{i:100243,n:"Zambia"},{i:100244,n:"Zimbabwe"}]';
// $content = '[{i:100001,n:"Afghanistan"}, {i:100001,n:"Afgha\x20nistan"}]';
// Countries
// $content =file_get_contents('https://www.belair.in/nav/json_location/10);
// States in XY
// $content =file_get_contents('https://www.belair.in/nav/json_location/20/US');
// Cities in XY country in state number 
// $content =file_get_contents('https://www.belair.in/nav/json_location/30/US/110034');

function toSQL($url) {
    $content = file_get_contents($url);

    $content = str_replace(
            array('{i:', ',n:', '\x20', '\x60', '\x28', '\x29', '\x2D'), array('{"i":', ',"n":', ' ', "'", '(', ')', '-'), $content);
    $arr = json_decode($content, true);
    if (json_last_error())
        die("Error:\n" . $content . "\nURL: $url\n");

    return $arr;
}

function countries() {
    require 'country_codes.php';
    $arr = toSQL("https://www.belair.in/nav/json_location/10");
    $out = '';
    foreach ($arr as $row) {
        $countryCode = array_search($row['n'], $country_codes);
        $out .= "({$row['i']}, '{$countryCode}', '{$row['n']}'),\n";
    }
    echo $out;
}

function states() {
    $countries = array(
        'IN' => 100100,
        'US' => 100231,
        'GB' => 100230,
    );

    foreach ($countries as $countryKey => $countryID) {
        $arr = toSQL("https://www.belair.in/nav/json_location/20/$countryKey");
        $out = '';
        foreach ($arr as $row)
            $out .= "({$row['i']}, $countryID, '{$row['n']}'),\n";
        echo $out;
    }
}

exit;
?>


<script>
    function collapse(nr)
// for displaying or hiding parts of the page
    {
        if (document.getElementById(nr)) {
            displayNew = (document.getElementById(nr).style.display == 'none') ? 'block' : 'none';
            document.getElementById(nr).style.display = displayNew;
        }
    }
</script>