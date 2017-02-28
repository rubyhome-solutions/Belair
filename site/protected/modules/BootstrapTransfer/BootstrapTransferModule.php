<?php

/**
 * Description of BootstrapTransfer
 *
 * @author Boxx
 */
class BootstrapTransferModule extends CWebModule {

    private $_assetsUrl;

    public function getAssetsUrl() {
        if ($this->_assetsUrl === null)
            $this->_assetsUrl = Yii::app()->getAssetManager()->publish(
                    Yii::getPathOfAlias('application.modules.BootstrapTransfer'), false, 1, YII_DEBUG);
        return $this->_assetsUrl;
    }

    public function registerAssets() {
        $url = $this->getAssetsUrl() . '/css/bootstrap-transfer.css';
        Yii::app()->clientScript->registerCssFile($url);

        $url = $this->getAssetsUrl() . '/js/bootstrap-transfer.js';
        Yii::app()->clientScript->registerScriptFile($url, CClientScript::POS_END);
    }

}

?>
