<?php
class TrackerController extends Controller {
    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public $disabled = false;

    public function accessRules() {
        return [
            ['allow',
                'actions' => ['email'],
                'users' => ['*'],
            ],
        ];
    }

    public function actionEmail($id) {
        // Do not proceed if the API is disabled
        if ($this->disabled) {
            $this->renderImage();
        }
        $email_sms_log = \EmailSmsLog::model()->findByPk($id);
        if ($email_sms_log !== null &&
            $email_sms_log->contact_type == \EmailSmsLog::CONTACT_TYPE_EMAIL &&
            $email_sms_log->is_opened == \EmailSmsLog::EMAIL_NOT_OPENED &&
            strpos(\Yii::app()->request->urlReferrer, 'emailSmsLog') === false) {
            $email_sms_log->is_opened = \EmailSmsLog::EMAIL_OPENED;
            $email_sms_log->opened_at = 'now()';
            $email_sms_log->opened_ip = \Yii::app()->request->userHostAddress;
            $email_sms_log->update(['is_opened', 'opened_at', 'opened_ip']);
        }
        $this->renderImage();
    }

    private function renderImage() {
        $path = \Yii::app()->basePath . '/../img/tracker.png';
        header("Content-type: image/jpg");
        header('Content-Length: ' . filesize($path));
        \Utils::sendImage($path, 'tracker.png');
    }

}
