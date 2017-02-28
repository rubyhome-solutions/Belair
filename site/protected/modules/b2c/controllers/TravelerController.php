<?php

namespace b2c\controllers;

\Yii::import('application.controllers.TravelerController');

class TravelerController extends \TravelerController {

    // use Overridable;

    protected $_inheritRules = false;
    protected $_moduleViews = ['print', 'view'];

    public function accessRules() {
        return [
            ['allow', 'users' => ['*']],
        ];
    }

    private static $map = [
        'traveler_title_id' => 'title',
    ];

    public function actionMeta() {
        $meta = new \stdClass;

        $meta->titles = [];
        // titles id array
        $titles_id = \TravelerTitle::$titlesId;
        foreach (\TravelerTitle::model()->cache(3600)->findAllByAttributes(['id' => $titles_id], ['order' => 'id']) as $i) {
            $meta->titles[] = $i->attributes;
        }

        $meta->countries = [];
        foreach (\Country::model()->cache(3600)->findAll() as $i) {
            $meta->countries[] = $i->attributes;
        }
        if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);

            $meta->user = ['email' => $user->email, 'mobile' => $user->mobile, 'name' => $user->name];
        }
        $meta->travelerTypes = \TravelerType::$typeToStr;
        \Utils::jsonResponse($meta);
    }

    public function actionMytravelers() {
        //$userId = \Yii::app()->user->id;//\Utils::getActiveUserId();
        if (isset(\Yii::app()->user->id))
            $this->render('//common/js', ['bundle' => 'mytraveller']);
        else
            $this->render('//common/js', ['bundle' => 'guestfilter']);
    }

    public function actionGetMyTravelersList() {
        $travelers = [];
        $companyId = \Utils::getActiveCompanyId();
        // \Utils::dbgYiiLog(Utils::getActiveCompanyId());
        if ($companyId) {

            // \Traveler::model()->findAll(array('order' => 'id', 'condition' => 'user_info_id=' . $companyId));
            foreach (\Traveler::model()->findAll(array('order' => 'id', 'condition' => 'user_info_id=' . $companyId . ' AND status=1')) as $i) {
                $travelers[] = $i->attributes;
            }
            // \Utils::dbgYiiLog($travelers);
        }
        return \Utils::jsonResponse($travelers);
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate() {

        $companyId = \Utils::getActiveCompanyId();
        if ($companyId === false) {
//            Utils::finalMessage('Please pick a company, before you can create new traveler! <b><a href="' . Yii::app()->request->hostInfo . '/users/manage">Click here</a></b> to continue. ');

            if (\Yii::app()->request->isAjaxRequest) {
                \Utils::jsonHeader();
                echo json_encode([
                    'error' => 'Please pickup a user or company, before you can register new traveler!',
                ]);
                \Yii::app()->end();
            }
        }
        $data = json_decode($_POST['data'], true);

        if (!isset($data['title'])) {
            $data['title'] = '';
        }
        if (!isset($data['first_name'])) {
            $data['first_name'] = '';
        }
        if (!isset($data['last_name'])) {
            $data['last_name'] = '';
        }
        $model = new \Traveler;
        $model->user_info_id = $companyId;
        $model->traveler_title_id = $data['title'];
        $model->first_name = $data['first_name'];
        $model->last_name = $data['last_name'];
        if (isset($data['birthdate'])) {
            $model->birthdate = $data['birthdate'];
        }
        if (!empty($data['email'])) {
            $model->email = $data['email'];
        }
        if (!empty($data['mobile'])) {
            $model->mobile = $data['mobile'];
        }
        if (isset($data['passport_number'])) {
            $model->passport_number = $data['passport_number'];
        }
        if (isset($data['passport_place'])) {
            $model->passport_place = $data['passport_place'];
        }
        if (isset($data['passport_country_id'])) {
            $model->passport_country_id = $data['passport_country_id'];
        }
//        \Utils::dbgYiiLog($data);
        if ($model->validate() && $model->save()) {
            if (\Yii::app()->request->isAjaxRequest) {
                \Utils::jsonHeader();
                echo json_encode([
                    'result' => 'success',
                    'traveler_id' => $model->id,
                    'title' => $model->travelerTitle->name,
                ]);
                \Yii::app()->end();
            } else {
                $this->redirect(array('update', 'id' => $model->id));
            }
        } else {
            \Utils::jsonHeader();
            $msg = [];
            foreach ($model->errors as $key => $error) {
                $msg [self::map($key)] = implode('', $error);
            }
            //\Utils::dbgYiiLog($model->errors);
            echo json_encode([
                'result' => 'error',
                'message' => $msg,
            ]);
        }
    }

    static function map($key) {
        if (isset(self::$map[$key])) {
            return self::$map[$key];
        }
        return $key;
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {

        $msg = \Authorization::can(\Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true || !isset($_POST['data'])) {
            \Utils::jsonHeader();
            echo json_encode([
                'result' => 'error',
                'message' => $msg,
            ]);
            \Yii::app()->end();
        }

        $model = $this->loadModel($id);
        $user_info_id = $model->user_info_id;
        $old_traveler_data = $this->loadModel($id);
        $data = json_decode($_POST['data'], true);
        $postName = strtoupper(str_replace(' ', '', $data['first_name']) . ' ' . str_replace(' ', '', $data['last_name']));
        $oldName = strtoupper(str_replace(' ', '', $model->first_name) . ' ' . str_replace(' ', '', $model->last_name));
        $is_new_traveler = false;

        if (count($model->airBookings) > 0 && !self::compareNames($postName, $oldName)) {
            //have booking add new travler if name is changed otherwise edit the old one
            $old_traveler_data->setStatus();
            unset($model);
            // $model->unsetAttributes(['id']);
            $model = new \Traveler;
            $model->user_info_id = $user_info_id;
            $is_new_traveler = true;
        }

        $model->traveler_title_id = $data['title'];
        $model->first_name = $data['first_name'];
        $model->last_name = $data['last_name'];
        $model->birthdate = $data['birthdate'];
        $model->email = $data['email'];
        $model->mobile = $data['mobile'];
        $model->passport_number = $data['passport_number'];
        $model->passport_place = $data['passport_place'];
        $model->passport_country_id = $data['passport_country_id'];

        if ($model->validate()) {
            $model->save();
            if (!$is_new_traveler) {
                $differences = $old_traveler_data->compare($model, $model->getRelationalColumns());
                if ($differences !== '') {
                    $model->addNote($differences);
                    $model->addNoteTravelerCart();
                }
            }
            if (\Yii::app()->request->isAjaxRequest) {
                \Utils::jsonHeader();
                echo json_encode([
                    'result' => 'success',
                    'traveler_id' => $model->id,
                    'title' => $model->travelerTitle->name,
                ]);
                \Yii::app()->end();
            }
        } else {
            if (\Yii::app()->request->isAjaxRequest) {
                \Utils::jsonHeader();
                $msg = [];
                foreach ($model->errors as $key => $error) {
                    $msg [self::map($key)] = implode('', $error);
                }
//            Yii::log(print_r($model->errors,true));
                echo json_encode([
                    'result' => 'error',
                    'message' => $msg,
                ]);
            }
        }
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        //\Utils::dbgYiiLog($id);
        $msg = \Authorization::can(\Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true) {
            \Utils::finalMessage($msg);
        }
        // we only allow deletion via POST request
        if (\Yii::app()->request->isPostRequest) {
            $model = $this->loadModel($id);
            // Do we have bookings for this traveler

            if (count($model->airBookings) > 0) {
                $model->setStatus();
            } else {
                $model->delete();
            }
            \Utils::jsonHeader();
            echo json_encode([
                'result' => 'success',
                'msg' => 'Traveler Deleted Successfully',
            ]);
            \Yii::app()->end();
            // Delete the files if exisits
            // Del VISAs
            // Del preferences
            // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
            \Utils::jsonHeader();
            echo json_encode([
                'result' => 'error',
                'msg' => 'Invalid request. Please do not repeat this request again.',
            ]);
            \Yii::app()->end();
        }
    }

    static function compareNames($postName, $oldName) {
        if ($postName === $oldName) {
            return true;
        } else {
            return false;
        }
    }

}
