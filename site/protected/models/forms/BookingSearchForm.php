<?php
class BookingSearchForm extends CFormModel
{
	public $way;
	
	public $source;
	public $destination;
	
	public $depart;
	public $return=null;
	
	public $adults;
	public $children=0;
	public $infants=0;
	
	public $category;
	
	public $preferred_airline;
	
	public $form_type;
	
	const ONE_WAY = 1;
	const ROUND_TRIP = 2;
	const MULTICITY = 3;
	
	const TYPE_DOMESTIC = 1;
	const TYPE_INTERNATIONAL = 2;
	const TYPE_MULTICITY = 3;
	
	public function rules()
	{
		return array(
			array('source, destination', 'required', 'message' => 'Please provide a valid airport'),
			array('depart, adults, children, infants, category', 'required'),
			array('source, destination, way, adults, children, infants, form_type, preferred_airline', 'numerical', 'integerOnly'=>true),
			array('source', 'compare', 'compareAttribute'=>'destination', 'allowEmpty'=>true, 'operator'=>'!=', 'message' =>'Source and destination can\'t be the same'),
//			array('depart', 'compare', 'compareAttribute'=>'return', 'allowEmpty'=>false, 'operator'=>'<=', 'message' =>'Departure must be before the return'),
			array('return', 'safe')	
		);
	}
	
	public function attributeLabels()
	{
		return array(
			'source' => 'Source',
			'destination' =>'Destination',
			'category' => 'Class'			
		);
	}
		
}