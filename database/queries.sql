-- Delete duplicate cities with same name from same state
DELETE FROM city USING city c2 
  WHERE city.state_id = c2.state_id AND city.name = c2.name AND city.id < c2.id
	
--