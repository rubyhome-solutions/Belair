<?php

class CmsController extends Controller {

    public $layout = '//layouts/column1';

    /**
     * @return array action filters
     */
    public function filters() {
        return [
            'accessControl', // perform access control for CRUD operations
        ];
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return [
            ['allow',
                'actions' => ['view'],
                'users' => ['*'],
            ],
            ['allow',
                'actions' => ['update', 'view'],
                'users' => ['@'],
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionUpdate($id) {
        settype($id, 'integer');
        if (!array_key_exists($id, \Cms::$cmsComponents)) {
            \Utils::finalMessage('Unknown CMS component');
        }
        $activeCompanyId = \Utils::getActiveCompanyId();
        if (empty($activeCompanyId)) {
            Yii::app()->user->setFlash('msg', 'Please select the company before you can manage the site content!');
            $this->redirect('/users/manage');
        }
        $activeUserID = \Utils::getActiveUserId();
        $user = \Users::model()->findByPk($activeUserID);
        if (!\Authorization::getIsStaffLogged()) {
            if (!$user->hasPermission(\Authorization::CONFIG_COMPANY)) {
                \Utils::finalMessage('You do not have permission to manage the site content');
            }
        }

        if (\Yii::app()->request->getPost('deleteContent')) {
            \Cms::model()->deleteByPk(['type_id' => $id, 'user_info_id' => $activeCompanyId]);
            \Utils::finalMessage('The custom CMS content has been removed. Now you are usug the default content.');
        }

        $content = \Yii::app()->request->getPost('cmsContent');
        if ($content) {
            // We have content to update
            $model = \Cms::model()->findByPk(['type_id' => $id, 'user_info_id' => $activeCompanyId]);
            if (!$model) {
                $model = new \Cms;
                $model->type_id = $id;
                $model->user_info_id = $activeCompanyId;
            }
            $model->content = $content;
            // We have before save behaviour for PHP tags sanitizing
            $model->save();
            \Yii::app()->user->setFlash('msg', 'The content is updated successfully!');
            // Set the active footer if needed
            if ($model->type_id === \Cms::CMS_PAGE_FOOTER) {
                $user->userInfo->setSessionFooter();
            }
        }

        $this->render('update', [
            'content' => \Cms::getContent($id, $activeCompanyId),
            'userInfoId' => $activeCompanyId,
            'userId' => $activeUserID,
            'contentTypeId' => $id,
        ]);
    }

    public function actionView($id) {
        settype($id, 'integer');
        if (!array_key_exists($id, \Cms::$cmsComponents)) {
            \Utils::finalMessage('Unknown CMS component');
        }
        $activeCompanyId = \Utils::getActiveCompanyId();
        if (empty($activeCompanyId)) {
            if ($id === \Cms::CMS_CONTACTS) {
                $this->redirect('/site/contact');                
            }
            $content = $this->renderPartial(\Cms::getBelairView($id), [], true);
        } else {
            $content = \Cms::getContent($id, $activeCompanyId);
        }
        
        $this->render('view', ['content' => $content]);
    }

}

?>
