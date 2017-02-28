<?php

/**
 * Added By Satender
 * Purpose : To keep all the stuff related to Screenshot at one place
 */
class Screenshot {

    const SCREENSHOTS_DIR = 'screenshots';
    const IMAGE_EXTENSION = '.png';

    static $SCRAP_FOLDERS_TIME = 1 * 24 * 60 * 60; // 1 Day

    public static function getScreenshotFolderPath() {
        return \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . self::SCREENSHOTS_DIR . DIRECTORY_SEPARATOR;
    }

    /**
     * Purpose : To save screenshot while user is booking ticket for 
      1st and 2nd Step Only
     * @param type $canvas_data => post canvas data
     * @param type $step => numeric
     * @param type $cart_id => SESSION ID for cart refer Booking::SESSION_KEY value
     * @param type $fakecart_id => AirCart::id
     */
    public static function save($canvas_data, $step, $cart_id, $fakecart_id, $previous_cart_id = null) {
        $img = str_replace('data:image/png;base64,', '', $canvas_data);
        $img = str_replace(' ', '+', $img);
        $fileData = base64_decode($img);
        $dir = self::getScreenshotFolderPath();
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        if($previous_cart_id !== null) {
            self::renameFakeToRealCart($previous_cart_id, $fakecart_id);
        }
        $fileName = $dir . 'step' . $step . '_' . $cart_id . self::IMAGE_EXTENSION;
        file_put_contents($fileName, $fileData);
        if (($step == 2 || $step == 3) && !empty($fakecart_id)) {
            $old_step1_file = $dir . 'step1_' . $cart_id . self::IMAGE_EXTENSION;
            $old_step2_file = $dir . 'step2_' . $cart_id . self::IMAGE_EXTENSION;
            $old_step3_file = $dir . 'step3_' . $cart_id . self::IMAGE_EXTENSION;

            $cart_id = $fakecart_id; //update session cart id to actual cartID
            $dir .= $cart_id . DIRECTORY_SEPARATOR;

            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $new_step1_file = $dir . 'step1_' . $cart_id . self::IMAGE_EXTENSION;
            $new_step2_file = $dir . 'step2_' . $cart_id . self::IMAGE_EXTENSION;
            $new_step3_file = $dir . 'step3_' . $cart_id . self::IMAGE_EXTENSION;

            if (file_exists($old_step1_file)) {
                if(file_exists($new_step1_file)){
                    unlink($new_step1_file);
                }
                rename($old_step1_file, $new_step1_file);
            }
            
            if (file_exists($old_step2_file)) {
                if(file_exists($new_step2_file)){
                    unlink($new_step2_file);
                }
                rename($old_step2_file, $new_step2_file);
            }
            
            if (file_exists($old_step3_file)) {
                if(file_exists($new_step3_file)){
                    unlink($new_step3_file);
                }
                rename($old_step3_file, $new_step3_file);
            }
        }
    }

    /**
     * Purpose : To rename old FakeCartID to ActualCartID
     * @param type $fake_cart_id
     * @param type $real_cart_id
     */
    public static function renameFakeToRealCart($fake_cart_id, $real_cart_id) {
        $path = self::getScreenshotFolderPath();
        $old_dir_path = $path . $fake_cart_id;
        if (file_exists($old_dir_path)) {
            $old_step1_file = $old_dir_path . DIRECTORY_SEPARATOR . 'step1_' . $fake_cart_id . self::IMAGE_EXTENSION;
            $old_step2_file = $old_dir_path . DIRECTORY_SEPARATOR . 'step2_' . $fake_cart_id . self::IMAGE_EXTENSION;
            $old_step3_file = $old_dir_path . DIRECTORY_SEPARATOR . 'step3_' . $fake_cart_id . self::IMAGE_EXTENSION;

            $new_step1_file = $old_dir_path . DIRECTORY_SEPARATOR . 'step1_' . $real_cart_id . self::IMAGE_EXTENSION;
            $new_step2_file = $old_dir_path . DIRECTORY_SEPARATOR . 'step2_' . $real_cart_id . self::IMAGE_EXTENSION;
            $new_step3_file = $old_dir_path . DIRECTORY_SEPARATOR . 'step3_' . $real_cart_id . self::IMAGE_EXTENSION;

            if (file_exists($old_step1_file) && file_exists($old_step2_file)) {
                rename($old_step1_file, $new_step1_file);
                rename($old_step2_file, $new_step2_file);
                if (file_exists($old_step3_file)) {
                    rename($old_step3_file, $new_step3_file);
                }
                
                rename($old_dir_path, $path . $real_cart_id);
            }
        }
    }

    /**
     * Purpose : To get all the screenshots against the cartID
     * @param type $cart_id
     * @return array|\stdClass
     */
    public static function getScreenShotsByCartID($cart_id) {
        $screenshots = array();
        $dir = self::getScreenshotFolderPath() . $cart_id;
        if (!file_exists($dir)) {
            return $screenshots;
        }
        $files = glob($dir . DIRECTORY_SEPARATOR . '*' . self::IMAGE_EXTENSION);
        foreach ($files as $file) {
            $std_class_obj = new stdClass();
            $stat = stat($file);

            $std_class_obj->updated = date("Y-m-d H:i:s", $stat['mtime']);
            $std_class_obj->name = basename($file, self::IMAGE_EXTENSION);
            $std_class_obj->displayName = $cart_id.'_'.ucfirst(basename($std_class_obj->name, '_' . $cart_id));

            $screenshots [] = $std_class_obj;
        }

        return $screenshots;
    }

    private static function getCartIDFromFileName($file) {
        $splitted_arr = explode('_', $file);
        if (empty($splitted_arr[1])) {
            return 0;
        }
        $group = [];
        preg_match('/\d+/', $splitted_arr[1], $group);
        if (!empty($group[0])) {
            return $group[0];
        }
        return 0;
    }

    public static function getFile($file, $download=false) {
        $file .= self::IMAGE_EXTENSION;
		$path = self::getScreenshotFolderPath();
		$path .= self::getCartIDFromFileName($file);
		$path .= DIRECTORY_SEPARATOR . $file;
        if(!$download) {
            Utils::sendImage($path, $file);
        }
		Utils::sendFile($path, $file);
    }

    /**
     * Purpose : To be executed through command
     * @param type $days_old => Default 7 days old data to purge
     * @return boolean
     */
    public static function scrapScreenshots($days_old = 7) {
        $path = self::getScreenshotFolderPath();
        if (!file_exists($path)) {
            print "\n '$path' not exist \n Timestamp: " . date(DATETIME_FORMAT) . ", Class: " . __CLASS__;
            return false;
        }
        $now = time();
        $max_time = ($days_old * self::$SCRAP_FOLDERS_TIME);
        $list = glob($path . '*');
        $dir_cnt = 0;
        $files_cnt = 0;
        foreach ($list as $file) {
            $delete = false;
            $stat = stat($file);
            if (($now - $stat['mtime']) > $max_time) {
                $delete = true;
            }
            if (!$delete) {
                continue;
            }
            if (is_dir($file)) {
                array_map('unlink', glob("$file/*.*"));
                rmdir($file);
                $dir_cnt ++;
            } else {
                unlink($file);
                $files_cnt ++;
            }
        }
        if ($dir_cnt === 0 && $files_cnt === 0) {
            print "\n ---Nothing to delete.--- \n Timestamp: " . date(DATETIME_FORMAT) . ", Class: " . __CLASS__;
            return true;
        } else if ($dir_cnt > 0 || $files_cnt > 0){
            print "\n ---Deteted $dir_cnt folder(s) & $files_cnt file(s).--- \n Timestamp: " . date(DATETIME_FORMAT) . ", Class: " . __CLASS__;
        }
    }

}
