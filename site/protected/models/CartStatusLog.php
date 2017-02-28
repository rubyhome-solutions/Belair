<?php

/**
 * This is the model class for table "cart_status_log".
 *
 * The followings are the available columns in table 'cart_status_log':
 * @property integer $id
 * @property integer $air_cart_id
 * @property integer $booking_status_id
 * @property integer $cart_status_id
 * @property integer $user_id
 * @property string $created
 * @property integer $time_taken_in_min
 */
class CartStatusLog extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'cart_status_log';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('air_cart_id, created', 'required'),
			array('air_cart_id, booking_status_id, cart_status_id, user_id,time_taken_in_min', 'numerical', 'integerOnly'=>true),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, air_cart_id, booking_status_id, cart_status_id, user_id, created,time_taken_in_min', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'air_cart_id' => 'Air Cart',
			'booking_status_id' => 'Booking Status',
			'cart_status_id' => 'Cart Status',
			'user_id' => 'User',
			'created' => 'Created',
                        'time_taken_in_min'=>'Time Taken(in Min)'
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('air_cart_id',$this->air_cart_id);
		$criteria->compare('booking_status_id',$this->booking_status_id);
		$criteria->compare('cart_status_id',$this->cart_status_id);
		$criteria->compare('user_id',$this->user_id);
		$criteria->compare('created',$this->created,true);
                $criteria->order = 'air_cart_id DESC,id  DESC';
		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return CartStatusLog the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
        
        public static function push_cart_status_log($cartid,$bookingStatus,$cartstatus=  \CartStatus::CART_STATUS_IN_PROCESS){
//            if($bookingStatus===\BookingStatus::STATUS_NEW){
//                return false;
//            }
            $ispresent=true;
            $aircart=AirCart::model()->findByPk((int)$cartid);
            if($aircart->cart_status_id===$cartstatus){
                return false;
            }
            $aircart->cart_status_id=$cartstatus;
            $aircart->update(['cart_status_id']);
//            if (($cartStatusObj= CartStatus::model()->findByPk((int)$cartid))===null){
//                $cartStatusObj=new CartStatus();
//                $cartStatusObj->air_cart_id=$cartid;
//                $ispresent=false;
//            }
//            if($ispresent){
//                if($cartStatusObj->cart_status_id===$cartstatus){
//                    return false;
//                }
//            }
//            $cartStatusObj->cart_status_id=$cartstatus;
//            $cartStatusObj->save(false);
            
            
            $cartstatuslog=new CartStatusLog();
            $cartstatuslog->air_cart_id=$cartid;
            $cartstatuslog->booking_status_id=$bookingStatus;
            $cartstatuslog->cart_status_id=$cartstatus;
            if(($userid=self::getUserID())!==false){
                $cartstatuslog->user_id=$userid;
            }
            $previousStatus=CartStatusLog::model()->findByAttributes(array('air_cart_id' => (int)$cartid),array('order'=>'id DESC'));
            if($previousStatus!=null){
                $datefrom = strtotime($previousStatus->created);
                $dateto = strtotime(date('Y-m-d H:i:s'));
                $differencew = abs($datefrom - $dateto);
                $previousStatus->time_taken_in_min=floor($differencew / 60);
                $previousStatus->save(false);
            }
            $cartstatuslog->insert();
        }
        
        /**
     * Get the active company id
     * @return boolean FALSE when the company ID is not available
     */
    static function getUserID() {
        if (isset(Yii::app()->user->id)) {
            return Yii::app()->user->id;
        } elseif (Yii::app()->hasProperty('user') && Yii::app()->user->hasState(\Utils::ACTIVE_COMPANY)) {
            $data = Yii::app()->user->getState(\Utils::ACTIVE_COMPANY);
            return isset($data['id']) ? $data['id'] : false;
        }

        return false;
    }
    
    public function toStringTimeTaken(){
        $str='';
        if($this->time_taken_in_min/60 >1){
            $str.=floor($this->time_taken_in_min/60).'h ';
            $str.=floor($this->time_taken_in_min%60).'m ';
        }else{
             $str.=$this->time_taken_in_min.'m ';
        }
        return $str;
    }
    
    public static function cartStatusLogReport($fromdate,$todate){
        $carts=  \AirCart::model()->with('cartLogs')->findAll([
            'condition' => 't.id IN (SELECT air_cart_id from payment) and t.created>=:from and t.created<=:to ',
            'params' => [':from'=>$fromdate.' 00:00:00',':to'=>$todate.' 23:59:59']
        ]);
        
        $data=[];
        $cnt=[];
        foreach (CartStatus::$cartStatusMap as $key=>$value) {
            $data[$key]=0;
            $cnt[$key]=0;
        }
        
        foreach($carts as $cart){
            foreach ($cart->cartLogs as $log) {
                if(!empty($log->time_taken_in_min)){
                    $data[$log->cart_status_id]+=(int)$log->time_taken_in_min;
                    $cnt[$log->cart_status_id]++;
                }
            }
        }
        //calculate average
        foreach (CartStatus::$cartStatusMap as $key=>$value) {
            if($cnt[$key]!=0){
                $data[$key]=$data[$key]/$cnt[$key];
            }
        }
        
        return $data;
    }
}
