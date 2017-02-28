<?php

/**
 * This is the model class for table "old_site_data".
 *
 * The followings are the available columns in table 'old_site_data':
 * @property integer $id
 * @property string $txdate
 * @property string $txid
 * @property string $booking_status
 * @property string $payment_status
 * @property string $sector
 * @property string $dom_int
 * @property string $pax_name
 * @property double $amount
 * @property string $pax_details
 * @property string $apnr
 * @property string $carrier
 * @property string $travel_date
 * @property string $booking_type
 * @property string $supplier
 * @property string $channel
 */
class OldSiteData extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'old_site_data';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('amount', 'numerical'),
			array('txid, apnr, booking_type', 'length', 'max'=>50),
			array('booking_status, payment_status, channel', 'length', 'max'=>200),
			array('sector, dom_int', 'length', 'max'=>20),
			array('carrier', 'length', 'max'=>5),
			array('supplier', 'length', 'max'=>15),
			array('txdate, pax_name, pax_details, travel_date', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id,  txid, booking_status, payment_status, sector, dom_int, pax_name, amount, pax_details, apnr, carrier, travel_date, booking_type, supplier, channel', 'safe', 'on'=>'search'),
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
			'txdate' => 'Txdate',
			'txid' => 'Txid',
			'booking_status' => 'Booking Status',
			'payment_status' => 'Payment Status',
			'sector' => 'Sector',
			'dom_int' => 'Dom Int',
			'pax_name' => 'Pax Name',
			'amount' => 'Amount',
			'pax_details' => 'Pax Details',
			'apnr' => 'Apnr',
			'carrier' => 'Carrier',
			'travel_date' => 'Travel Date',
			'booking_type' => 'Booking Type',
			'supplier' => 'Supplier',
			'channel' => 'Channel',
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
		$criteria->compare('txid',$this->txid,true);
		$criteria->compare('booking_status',$this->booking_status,true);
		$criteria->compare('payment_status',$this->payment_status,true);
		$criteria->compare('sector',$this->sector,true);
		$criteria->compare('dom_int',$this->dom_int,true);
		$criteria->compare('pax_name',$this->pax_name,true);
		$criteria->compare('amount',$this->amount);
		$criteria->compare('pax_details',$this->pax_details,true);
		$criteria->compare('apnr',$this->apnr,true);
		$criteria->compare('carrier',$this->carrier,true);
		$criteria->compare('booking_type',$this->booking_type,true);
		$criteria->compare('supplier',$this->supplier,true);
		$criteria->compare('channel',$this->channel,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return OldSiteData the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
