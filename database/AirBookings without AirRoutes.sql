Select
  air_booking.id,
  air_routes.id As ar_id
From
  air_booking
  Left Join air_routes On air_routes.air_booking_id = air_booking.id
Where
  air_routes.id Is Null
Order By
  air_booking.id
