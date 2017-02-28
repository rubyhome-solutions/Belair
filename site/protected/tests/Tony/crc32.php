<?php

$str1 = 'gnu';
$str2 = 'codding';

echo 'CRC32 str1: ' . crc32($str1) . PHP_EOL;
echo 'CRC32 str2: ' . crc32($str2) . PHP_EOL;
echo 'Hash fnv164 str1: ' . hash('fnv164', $str1) . PHP_EOL;
echo 'Hash fnv164 str2: ' . hash('fnv164', $str2) . PHP_EOL;
echo 'Hash fnv164 str1: ' . '0x'.hash('fnv164', $str1) . PHP_EOL;
echo 'Hash fnv164 str2: ' . hash('fnv164', $str2) . PHP_EOL;
echo 'Unpack fnv164 str1: ' . print_r(unpack('N*', hash('fnv164', $str1, true)), true) . PHP_EOL;
echo 'Unpack fnv164 str2: ' . print_r(unpack('N*', hash('fnv164', $str2, true)), true) . PHP_EOL;
echo 'Hash fnv164 str1: ' . hexdec(hash('fnv164', $str1)) . PHP_EOL;
echo 'Hash fnv164 str2: ' . hexdec(hash('fnv164', $str2)) . PHP_EOL;

$data = "hello"; 

//foreach (hash_algos() as $v) { 
//        $r = hash($v, $data, false); 
//        printf("%-12s %3d %s\n", $v, strlen($r), $r); 
//} 

