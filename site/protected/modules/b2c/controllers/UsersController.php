<?php

namespace b2c\controllers;

\Yii::import('application.controllers.UsersController');
class UsersController extends \UsersController {
   // use Overridable;

    protected $_inheritRules = false;
    protected $_moduleViews = ['print', 'view'];

    public function accessRules() {
        return [
            ['allow', 'users' => ['*']],
        ];
    }
    
    public function actionMeta() {
        $meta = new \stdClass;

        $meta->countrylist = [];
        foreach (\Country::model()->findAll() as $i) {
            $meta->countrylist[] = $i->attributes;
        }
        if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);

            $meta->user = ['email' => $user->email, 'mobile' => $user->mobile,'name' => $user->name];
        }
        \Utils::jsonResponse($meta);
    }
    
    public function actionGetStateList($id) {        
        \Utils::jsonResponse(\State::getStateListByCountryID($id));
    }
    
    public function actionGetCityList($id) {        
        \Utils::jsonResponse(\City::getCityListByStateID($id));
    }
    
    public function actionMyProfile() {
        //$userId = \Yii::app()->user->id;//\Utils::getActiveUserId();
         if(isset(\Yii::app()->user->id))
            $this->render('//common/js', ['bundle' => 'myprofile']);
        else
            $this->render('//common/js', ['bundle' => 'guestfilter']);
        
    }
    public function actionGetProfile() {
        if(isset(\Yii::app()->user->id))
          $id=\Yii::app()->user->id;
        else
            $this->render('//common/js', ['bundle' => 'guestfilter']);
        $res = \Authorization::can('set_user_profile', ['user_id' => (int) $id]);
        if ($res === true) {
            // Save the active user & company data
            \Utils::setActiveUserAndCompany($id);

            $model = $this->loadModel($id);            
            
            if (\Yii::app()->request->isAjaxRequest) {
                $countrycode=null;
                    $statecode = null;
                    $citycode = null;                    
                    $country = '';
                    $state = '';
                    $city = '';
                if($model->city_id!=null && !empty($model->city_id))
                {  $countrycode=$model->city->state->country_id;
                    $statecode = $model->city->state_id;
                    $citycode = $model->city_id;                    
                    $country = $model->city->state->country->name;
                    $state = $model->city->state->name;
                    $city = $model->city->name;
                }
                \Utils::jsonResponse([
                    'id' => $model->id,
                    'user_info_id' => $model->user_info_id,
                    'email' => $model->email,
                    'name' => $model->name,
                    'mobile' => $model->mobile,
                    'address' => $model->address,
                    'countrycode' => $countrycode,
                    'statecode' => $statecode,
                    'citycode' => $citycode,
                    'pincode' => $model->pincode,
                    'country' => $country,
                    'state' => $state,
                    'city' => $city,
                        ], 201);
            }
            $this->render('profile', array('model' => $model));
        } else {
            if (\Yii::app()->request->isAjaxRequest) {
                \Utils::jsonResponse([
                    'error' => 'Not Authorised',
                        ], 201);
            }           
        }
    }
    
    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdateSelf() {
        $model = $this->loadModel(\Yii::app()->user->id);        
        $data=json_decode($_POST['data'],true);
        //\Utils::dbgYiiLog($data);
        $model->name = $data['name'];
        $model->email = $data['email'];
        $model->mobile = $data['mobile'];
        $model->address = $data['address'];
        $model->city_id = $data['citycode'];
        $model->pincode = $data['pincode'];
        if ($model->validate()) {
            $model->save();
            if (\Yii::app()->request->isAjaxRequest) {
                \Utils::jsonHeader();
                echo json_encode([
                    'result' => 'success',
                    'user_id' => $model->id,
                ]);
                \Yii::app()->end();
            }
        }else{
             if (\Yii::app()->request->isAjaxRequest) {
            \Utils::jsonHeader();
            $msg = '';
            foreach ($model->errors as $error) {
                $msg .= implode("\n", $error) . "\n";
            }
//            Yii::log(print_r($model->errors,true));
            echo json_encode([
                'result' => 'error',
                'message' => $msg,
            ]);
        }
        }
        
    }
    
}

