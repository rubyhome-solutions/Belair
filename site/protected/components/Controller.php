<?php

/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController {

    const B2C_THEME = 'B2C'; /* B2Cmobile for mobile new theme */
    const B2C_MOBILE_THEME = 'B2Cmobile';
    const ADMIN_THEME = 'admin';
    const B2C_BASE_URL = 'https://cheapticket.in';
    const F2G_BASE_URL ='https://cheaptickets24.com';
    const ATI_B2C_BASE_URL = 'https://airticketsindia.com';
    const LOCAL_B2C_BASE_URL = 'http://local.cheapticket';
    const LOCAL_F2G_BASE_URL ='http://local.cheaptickets24';
    const LOCAL_ATI_B2C_BASE_URL = 'http://local.airticketsindia';
    const DEV_B2C_BASE_URL = 'http://dev.cheaptickets.co.in';
    const DEV_F2G_BASE_URL ='http://dev.cheaptickets24.com';
    const DEV_ATI_B2C_BASE_URL = 'http://dev.airticketsindia.com';
    const B2B_BASE_URL = 'https://air.belair.in';
    const ALLOWED_IP = '127.0.0.1';
    const PRIVATE_IP_NETWORK = '10.';
    const F2G_THEME = 'F2G'; 
    const ATI_THEME = 'ATI';
    /**
     * @var string the default layout for the controller view. Defaults to '//layouts/column1',
     * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
     */
    public $layout = '//layouts/column1';

    /**
     * @var array context menu items. This property will be assigned to {@link CMenu::items}.
     */
    public $menu = array();

    /**
     * @var array the breadcrumbs of the current page. The value of this property will
     * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
     * for more details on how to specify this property.
     */
    public $breadcrumbs = array();

    public function beforeAction($action) {
        if (
                !YII_DEBUG && 
                !\Yii::app()->request->isSecureConnection && 
                \Yii::app()->request->userHostAddress !== self::ALLOWED_IP &&
                strncmp(\Yii::app()->request->userHostAddress, self::PRIVATE_IP_NETWORK, 3) !== 0
            ) {
            $url = 'https://' . \Yii::app()->request->serverName . \Yii::app()->request->requestUri;
            \Yii::app()->request->redirect($url);
            return false;
        }

        
        if (strstr(\Yii::app()->request->serverName, 'cheaptickets24')) { // F2G cases
            \Yii::app()->setTheme(self::F2G_THEME);
        } else if (strstr(\Yii::app()->request->serverName, 'cheapticket')) { // B2C cases
            \Yii::app()->setTheme(self::B2C_THEME);
        } else if (strstr(\Yii::app()->request->serverName, 'airticketsindia')) { // ATI cases
            \Yii::app()->setTheme(self::ATI_THEME);
        }
        return true;
    }

    protected function beforeRender($view) {
        if (\Yii::app()->session->get('theme') === self::ADMIN_THEME) {
            \Yii::app()->setTheme(self::ADMIN_THEME);
            if (\Yii::app()->theme->getViewFile($this, $view) === false) {
                \Yii::app()->setTheme('');
            }
        }
        return true;
    }

}
