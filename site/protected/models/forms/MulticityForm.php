<?php
class MulticityForm extends BookingSearchForm
{
	public function rules()
	{
		return array(
				array('source, destination', 'required', 'message' => 'Please provide a valid {attribute} city'),
				array('depart, adults, children, infants, category', 'required'),
				array('way, adults, children, infant, form_type', 'numerical', 'integerOnly'=>true),
				//array('source', 'compare', 'compareAttribute'=>'destination', 'allowEmpty'=>true, 'operator'=>'!=', 'message' =>'Source and destination can\'t be the same'),
				//array('depart', 'compare', 'compareAttribute'=>'return', 'allowEmpty'=>true, 'operator'=>'<=', 'message' =>'Departure must be before the return'),
				array('source, destination, depart, return', 'safe')
		);
	}
}