<?php

namespace b2c\components;

trait ControllerOverridable {
    protected $_inheritRules = false;
    protected $_moduleViews = [];

    public function accessRules() {
        return $this->_inheritRules ? parent::accessRules() : [['deny', 'users' => ['*']]];
    }

    public function getAppViewPath()
    {
        return \Yii::app()->getViewPath().DIRECTORY_SEPARATOR.$this->getId();
    }

    public function getViewFile($viewName)
    {
        // if view found in theme, use it
        if(($theme=\Yii::app()->getTheme())!==null && ($viewFile=$theme->getViewFile($this,$viewName))!==false)
            return $viewFile;

        $moduleViewPath=$basePath=\Yii::app()->getViewPath();
        
        // check if we want to override module and put a correct path in this case
        $override = false;
        if(($module=$this->getModule())!==null && in_array($viewName, $this->_moduleViews)) {
            $override = true;
            $moduleViewPath=$module->getViewPath();
        }

        return $this->resolveViewFile($viewName, $override ? $this->getViewPath() : $this->getAppViewPath(), $basePath, $moduleViewPath);
    }
}