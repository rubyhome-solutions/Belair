CREATE TABLE notes (
  id SERIAL  NOT NULL ,
  note TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE meal_list (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX meal_list_names ON meal_list (name);




CREATE TABLE log_operation (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  table_name TEXT    ,
  id_filed_name TEXT    ,
  value_field_name TEXT    ,
  is_reversible BOOL  DEFAULT TRUE NOT NULL   ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX log_operation_name_unq ON log_operation (name);








CREATE TABLE payment_status (
  id SERIAL  NOT NULL ,
  code CHAR(1)   NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX payment_status_code_unq ON payment_status (code);




CREATE TABLE payment_process (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));





CREATE TABLE payment_gateway (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  note TEXT    ,
  merchant_id TEXT    ,
  salt TEXT    ,
  enc_key TEXT    ,
  base_url TEXT    ,
  is_active SMALLINT  DEFAULT 0 NOT NULL ,
  api_url TEXT    ,
  username TEXT    ,
  password TEXT    ,
  access_code TEXT      ,
PRIMARY KEY(id));






CREATE TABLE invoice_status (
  id SERIAL  NOT NULL ,
  code CHAR(1)   NOT NULL ,
  name TEXT      ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX invoice_status_code_unq ON invoice_status (code);




CREATE TABLE currency (
  id SERIAL  NOT NULL ,
  code CHAR(3)   NOT NULL ,
  name TEXT    ,
  rate REAL    ,
  updated timestamp without time zone      ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX currencies_name_idx ON currency (code);




CREATE TABLE country (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  code CHAR(2)   NOT NULL   ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX country_name_idx ON country (code);




CREATE TABLE commercial_plan (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE gender (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE fare_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE doc_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE permission (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  staff_only SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX permissions_name_unq ON permission (name);





CREATE TABLE tr_status (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE tr_action (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));





CREATE TABLE traveler_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE x_rate (
  updated timestamp without time zone   NOT NULL ,
  content TEXT   NOT NULL   ,
PRIMARY KEY(updated));





CREATE TABLE user_type (
  id SERIAL  NOT NULL ,
  name VARCHAR(50)   NOT NULL ,
  is_fixed BOOL  DEFAULT False NOT NULL ,
  leading_char CHAR(1)      ,
PRIMARY KEY(id)  );


CREATE INDEX user_type_name_idx ON user_type (name);





CREATE TABLE user_task (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE traveler_title (
  id SERIAL  NOT NULL ,
  name TEXT      ,
PRIMARY KEY(id));




CREATE TABLE service_category (
  id SERIAL  NOT NULL ,
  name TEXT      ,
PRIMARY KEY(id));





CREATE TABLE seat_list (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX seat_list_names ON seat_list (name);




CREATE TABLE rc_transform_log (
  id SERIAL  NOT NULL ,
  rc_id INTEGER   NOT NULL ,
  total_fare INTEGER   NOT NULL ,
  hash_str TEXT   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE transfer_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE special_request (
  id SERIAL  NOT NULL ,
  code CHAR(4)   NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE service_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE carrier (
  id SERIAL  NOT NULL ,
  code CHAR(2)   NOT NULL ,
  name TEXT   NOT NULL ,
  is_domestic SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)    );


CREATE UNIQUE INDEX carrier_code_idx ON carrier (code);
CREATE INDEX carrier_name_idx ON carrier (name);




CREATE TABLE cabin_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE airport (
  id SERIAL  NOT NULL ,
  city_code CHAR(3)   NOT NULL ,
  city_name TEXT    ,
  airport_type SMALLINT    ,
  airport_name TEXT    ,
  airport_code CHAR(3)   NOT NULL ,
  country_code CHAR(2)   NOT NULL   ,
PRIMARY KEY(id)      );


CREATE INDEX airport_code_idx ON airport (airport_code);
CREATE INDEX airport_country_idx ON airport (country_code);
CREATE INDEX airport_cityname_idx ON airport (city_name);




CREATE TABLE cc_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  code TEXT   NOT NULL ,
  validator TEXT      ,
PRIMARY KEY(id));




CREATE TABLE booking_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE amendment_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE amendment_status (
  id SERIAL  NOT NULL ,
  code CHAR(1)   NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX amendment_status_code_unq ON amendment_status (code);




CREATE TABLE booking_status (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE approval_status (
  id SERIAL  NOT NULL ,
  name TEXT      ,
PRIMARY KEY(id));




CREATE TABLE ab_status (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));




CREATE TABLE client_source (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  url TEXT    ,
  is_active SMALLINT  DEFAULT 1 NOT NULL ,
  username TEXT    ,
  password TEXT    ,
  officeid TEXT    ,
  component TEXT      ,
PRIMARY KEY(id)  );


CREATE UNIQUE INDEX supplier_name_idx ON client_source (name);




CREATE TABLE carrier_helpline (
  carrier_id INTEGER   NOT NULL ,
  text TEXT   NOT NULL ,
  code CHAR(2)      ,
PRIMARY KEY(carrier_id)  ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX carrier_helpline_FKIndex1 ON carrier_helpline (carrier_id);


CREATE INDEX IFK_Carrier ON carrier_helpline (carrier_id);


CREATE TABLE search_count (
  date_ DATE   NOT NULL ,
  client_source_id INTEGER   NOT NULL ,
  value INTEGER   NOT NULL   ,
PRIMARY KEY(date_, client_source_id)  ,
  FOREIGN KEY (client_source_id) REFERENCES client_source(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX search_count_FKIndex1 ON search_count (client_source_id);


CREATE INDEX IFK_Client Source ON search_count (client_source_id);


CREATE TABLE backend (
  id SERIAL  NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  name TEXT   NOT NULL ,
  searches TEXT    ,
  book TEXT    ,
  hold TEXT    ,
  balance REAL  DEFAULT 0  ,
  pnr_acquisition TEXT    ,
  api_source TEXT    ,
  pnr_resync TEXT    ,
  pnr_cancel TEXT    ,
  pnr_list TEXT    ,
  wsdl_file TEXT    ,
  city_pairs TEXT      ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE UNIQUE INDEX backend_name_unq_idx ON backend (name);
CREATE INDEX backend_FKIndex1 ON backend (carrier_id);


CREATE INDEX IFK_Carrier ON backend (carrier_id);


CREATE TABLE bin_list (
  bin INTEGER   NOT NULL ,
  type_id INTEGER   NOT NULL ,
  sub_brand TEXT    ,
  country_code TEXT   NOT NULL ,
  country_name TEXT   NOT NULL ,
  bank TEXT    ,
  card_type TEXT    ,
  card_category TEXT    ,
  latitude TEXT    ,
  longitude TEXT    ,
  domestic SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(bin)  ,
  FOREIGN KEY (type_id)
    REFERENCES cc_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX bin_list_FKIndex1 ON bin_list (type_id);


CREATE INDEX IFK_CC type ON bin_list (type_id);


CREATE TABLE ff_carriers (
  id SERIAL  NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  name TEXT      ,
PRIMARY KEY(id)  ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX ff_carriers_FKIndex1 ON ff_carriers (carrier_id);


CREATE INDEX IFK_Carrier ON ff_carriers (carrier_id);


CREATE TABLE state (
  id SERIAL  NOT NULL ,
  country_id INTEGER   NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)  ,
  FOREIGN KEY (country_id)
    REFERENCES country(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX state_FKIndex1 ON state (country_id);


CREATE INDEX IFK_Country ON state (country_id);


CREATE TABLE air_source (
  id SERIAL  NOT NULL ,
  currency_id INTEGER   NOT NULL ,
  balance_link INTEGER    ,
  queue_to INTEGER    ,
  backend_id INTEGER   NOT NULL ,
  name TEXT   NOT NULL ,
  username TEXT    ,
  password TEXT    ,
  tran_username TEXT    ,
  tran_password TEXT    ,
  iata_number TEXT    ,
  profile_pcc TEXT    ,
  spare1 TEXT    ,
  spare2 TEXT    ,
  spare3 TEXT    ,
  exclude_carriers TEXT    ,
  include_pass_carriers TEXT    ,
  queue_num TEXT    ,
  bta_pass INTEGER    ,
  amex_pass INTEGER    ,
  visa_pass INTEGER    ,
  root_pass INTEGER    ,
  master_pass INTEGER    ,
  balance REAL  DEFAULT 0  ,
  international_auto_ticket SMALLINT  DEFAULT 0 NOT NULL ,
  domestic_auto_ticket SMALLINT  DEFAULT 1 NOT NULL ,
  display_in_search SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)          ,
  FOREIGN KEY (backend_id)
    REFERENCES backend(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (queue_to)
    REFERENCES air_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (balance_link)
    REFERENCES air_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (currency_id)
    REFERENCES currency(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE UNIQUE INDEX provider_name_idx ON air_source (name);
CREATE INDEX air_source_FKIndex3 ON air_source (backend_id);
CREATE INDEX air_source_FKIndex2 ON air_source (queue_to);
CREATE INDEX air_source_FKIndex3 ON air_source (balance_link);
CREATE INDEX air_source_FKIndex4 ON air_source (currency_id);


CREATE INDEX IFK_Backend ON air_source (backend_id);
CREATE INDEX IFK_Queue ON air_source (queue_to);
CREATE INDEX IFK_Balance link ON air_source (balance_link);
CREATE INDEX IFK_Currency ON air_source (currency_id);


CREATE TABLE permission_x_type (
  permission_id INTEGER   NOT NULL ,
  user_type_id INTEGER   NOT NULL   ,
PRIMARY KEY(permission_id, user_type_id)    ,
  FOREIGN KEY (permission_id)
    REFERENCES permission(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_type_id)
    REFERENCES user_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX permission_x_type_FKIndex1 ON permission_x_type (permission_id);
CREATE INDEX permission_x_type_FKIndex2 ON permission_x_type (user_type_id);


CREATE INDEX IFK_Permission ON permission_x_type (permission_id);
CREATE INDEX IFK_User Type ON permission_x_type (user_type_id);


CREATE TABLE default_terminal (
  carrier_id INTEGER   NOT NULL ,
  airport_id INTEGER   NOT NULL ,
  is_domestic SMALLINT  DEFAULT 0 NOT NULL ,
  terminal CHAR(2)   NOT NULL   ,
PRIMARY KEY(carrier_id, airport_id, is_domestic)    ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (airport_id)
    REFERENCES airport(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX default_terminal_FKIndex1 ON default_terminal (carrier_id);
CREATE INDEX default_terminal_FKIndex2 ON default_terminal (airport_id);



CREATE INDEX IFK_Carrier ON default_terminal (carrier_id);
CREATE INDEX IFK_Airport ON default_terminal (airport_id);


CREATE TABLE airsource_queue (
  id SERIAL  NOT NULL ,
  queue_to INTEGER   NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  queue_number SMALLINT  DEFAULT 1 NOT NULL ,
  type_id SMALLINT  DEFAULT 3 NOT NULL ,
  carriers TEXT  DEFAULT * NOT NULL ,
  auto_ticket SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (queue_to)
    REFERENCES air_source(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX airsource_queue_FKIndex1 ON airsource_queue (air_source_id);
CREATE INDEX airsource_queue_FKIndex2 ON airsource_queue (queue_to);


CREATE INDEX IFK_Air Source ON airsource_queue (air_source_id);
CREATE INDEX IFK_Queue To ON airsource_queue (queue_to);


CREATE TABLE type_x_task (
  user_task_id INTEGER   NOT NULL ,
  user_type_id INTEGER   NOT NULL   ,
PRIMARY KEY(user_task_id, user_type_id)    ,
  FOREIGN KEY (user_task_id)
    REFERENCES user_task(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (user_type_id)
    REFERENCES user_type(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX type_x_task_FKIndex1 ON type_x_task (user_task_id);
CREATE INDEX type_x_task_FKIndex2 ON type_x_task (user_type_id);


CREATE INDEX IFK_Task ON type_x_task (user_task_id);
CREATE INDEX IFK_User type ON type_x_task (user_type_id);


CREATE TABLE commision_rule (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER    ,
  service_type_id INTEGER    ,
  carrier_id INTEGER    ,
  filter TEXT    ,
  iata_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  iata_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  plb_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  plb_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  fix SMALLINT  DEFAULT 0 NOT NULL ,
  fix_per_journey TEXT  DEFAULT 0 NOT NULL ,
  order_ SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (service_type_id)
    REFERENCES service_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX commision_rule_FKIndex1 ON commision_rule (carrier_id);
CREATE INDEX commision_rule_FKIndex2 ON commision_rule (service_type_id);
CREATE INDEX commision_rule_FKIndex3 ON commision_rule (air_source_id);


CREATE INDEX IFK_Airline ON commision_rule (carrier_id);
CREATE INDEX IFK_Service Type ON commision_rule (service_type_id);
CREATE INDEX IFK_Air Source ON commision_rule (air_source_id);


CREATE TABLE city_pairs (
  source_id INTEGER   NOT NULL ,
  destination_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL   ,
PRIMARY KEY(source_id, destination_id, carrier_id)      ,
  FOREIGN KEY (destination_id)
    REFERENCES airport(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (source_id)
    REFERENCES airport(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX city_pairs_FKIndex1 ON city_pairs (destination_id);
CREATE INDEX city_pairs_FKIndex2 ON city_pairs (source_id);
CREATE INDEX city_pairs_FKIndex3 ON city_pairs (carrier_id);


CREATE INDEX IFK_Destination ON city_pairs (destination_id);
CREATE INDEX IFK_Origin ON city_pairs (source_id);
CREATE INDEX IFK_Carrier ON city_pairs (carrier_id);


CREATE TABLE commercial_rule (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER    ,
  client_source_id INTEGER  DEFAULT 1 NOT NULL ,
  service_type_id INTEGER  DEFAULT 1 NOT NULL ,
  carrier_id INTEGER    ,
  filter TEXT   NOT NULL ,
  iata_rate_total FLOAT  DEFAULT 0 NOT NULL ,
  iata_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  iata_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  plb_rate_total FLOAT  DEFAULT 0 NOT NULL ,
  plb_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  plb_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  book_rate_total FLOAT  DEFAULT 0 NOT NULL ,
  book_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  book_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  book_fix_adult SMALLINT  DEFAULT 0 NOT NULL ,
  book_fix_child SMALLINT  DEFAULT 0 NOT NULL ,
  book_fix_infant SMALLINT  DEFAULT 0 NOT NULL ,
  book_fix_per_journey SMALLINT  DEFAULT 0 NOT NULL ,
  cancel_fix_adult SMALLINT  DEFAULT 0 NOT NULL ,
  cancel_fix_child SMALLINT  DEFAULT 0 NOT NULL ,
  cancel_fix_infant SMALLINT  DEFAULT 0 NOT NULL ,
  cancel_fix_per_journey SMALLINT  DEFAULT 0 NOT NULL ,
  reschedule_fix_adult SMALLINT  DEFAULT 0 NOT NULL ,
  reschedule_fix_child SMALLINT  DEFAULT 0 NOT NULL ,
  reschedule_fix_infant SMALLINT  DEFAULT 0 NOT NULL ,
  reschedule_fix_per_journey SMALLINT  DEFAULT 0 NOT NULL ,
  markup_rate_total FLOAT  DEFAULT 0 NOT NULL ,
  markup_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  markup_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  markup_fix_adult SMALLINT  DEFAULT 0 NOT NULL ,
  markup_fix_child SMALLINT  DEFAULT 0 NOT NULL ,
  markup_fix_infant SMALLINT  DEFAULT 0 NOT NULL ,
  markup_fix_per_journey SMALLINT  DEFAULT 0 NOT NULL ,
  order_ SMALLINT  DEFAULT 1 NOT NULL ,
  markup_added_to SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)        ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (service_type_id)
    REFERENCES service_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (client_source_id)
    REFERENCES client_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX commercial_rule_FKIndex1 ON commercial_rule (carrier_id);
CREATE INDEX commercial_rule_FKIndex2 ON commercial_rule (service_type_id);
CREATE INDEX commercial_rule_FKIndex3 ON commercial_rule (client_source_id);
CREATE INDEX commercial_rule_FKIndex4 ON commercial_rule (air_source_id);


CREATE INDEX IFK_Airline ON commercial_rule (carrier_id);
CREATE INDEX IFK_Service ON commercial_rule (service_type_id);
CREATE INDEX IFK_Client Source ON commercial_rule (client_source_id);
CREATE INDEX IFK_Air Source ON commercial_rule (air_source_id);


CREATE TABLE routes_cache (
  id SERIAL  NOT NULL ,
  destination_id INTEGER   NOT NULL ,
  origin_id INTEGER   NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  traveler_type_id INTEGER   NOT NULL ,
  service_type_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  last_check timestamp without time zone  DEFAULT now() NOT NULL ,
  updated timestamp without time zone  DEFAULT now()  ,
  departure_date DATE   NOT NULL ,
  departure_time TIME    ,
  arrival_date DATE   NOT NULL ,
  arrival_time TIME   NOT NULL ,
  return_date DATE    ,
  return_time TIME    ,
  round_trip SMALLINT  DEFAULT 0  ,
  tax_yq REAL  DEFAULT 0 NOT NULL ,
  tax_jn REAL  DEFAULT 0 NOT NULL ,
  tax_udf REAL  DEFAULT 0 NOT NULL ,
  tax_psf REAL  DEFAULT 0 NOT NULL ,
  tax_other REAL  DEFAULT 0 NOT NULL ,
  total_tax_correction REAL  DEFAULT 0 NOT NULL ,
  stops INTEGER  DEFAULT 0 NOT NULL ,
  legs_json TEXT    ,
  fare_basis TEXT    ,
  base_fare REAL  DEFAULT 0 NOT NULL ,
  total_taxes REAL  DEFAULT 0 NOT NULL ,
  total_fare REAL  DEFAULT 0 NOT NULL ,
  hits INTEGER  DEFAULT 0 NOT NULL ,
  booking_class TEXT   NOT NULL ,
  flight_number TEXT   NOT NULL ,
  order_ SMALLINT  DEFAULT 11 NOT NULL ,
  grouping BIGINT      ,
PRIMARY KEY(id)                ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (service_type_id)
    REFERENCES service_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (traveler_type_id)
    REFERENCES traveler_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (origin_id)
    REFERENCES airport(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (destination_id)
    REFERENCES airport(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX routes_cache_FKIndex1 ON routes_cache (carrier_id);
CREATE INDEX routes_cache_dep_date_idx ON routes_cache (departure_date);
CREATE UNIQUE INDEX routes_cache_unq_idx ON routes_cache (departure_date, departure_time, air_source_id, carrier_id, traveler_type_id, last_check, destination_id, origin_id, booking_class);
CREATE INDEX routes_cache_FKIndex4 ON routes_cache (air_source_id);
CREATE INDEX routes_cache_FKIndex5 ON routes_cache (service_type_id);
CREATE INDEX routes_cache_FKIndex6 ON routes_cache (traveler_type_id);
CREATE INDEX routes_cache_FKIndex6 ON routes_cache (origin_id);
CREATE INDEX routes_cache_FKIndex7 ON routes_cache (destination_id);








CREATE INDEX IFK_Carrier ON routes_cache (carrier_id);
CREATE INDEX IFK_Air source ON routes_cache (air_source_id);
CREATE INDEX IFK_Service type ON routes_cache (service_type_id);
CREATE INDEX IFK_Traveler Type ON routes_cache (traveler_type_id);
CREATE INDEX IFK_Origin ON routes_cache (origin_id);
CREATE INDEX IFK_Destination ON routes_cache (destination_id);


CREATE TABLE city (
  id SERIAL  NOT NULL ,
  state_id INTEGER   NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)  ,
  FOREIGN KEY (state_id)
    REFERENCES state(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX city_FKIndex1 ON city (state_id);


CREATE INDEX IFK_State ON city (state_id);


CREATE TABLE commercial_x_rule (
  plan_id INTEGER   NOT NULL ,
  rule_id INTEGER   NOT NULL   ,
PRIMARY KEY(plan_id, rule_id)    ,
  FOREIGN KEY (plan_id)
    REFERENCES commercial_plan(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (rule_id)
    REFERENCES commercial_rule(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX commercial_x_rule_FKIndex1 ON commercial_x_rule (plan_id);
CREATE INDEX commercial_x_rule_FKIndex2 ON commercial_x_rule (rule_id);


CREATE INDEX IFK_Rules list ON commercial_x_rule (plan_id);
CREATE INDEX IFK_Rule ON commercial_x_rule (rule_id);


CREATE TABLE user_info (
  id SERIAL  NOT NULL ,
  commercial_plan_id INTEGER   NOT NULL ,
  currency_id INTEGER  DEFAULT 1 NOT NULL ,
  user_type_id INTEGER  DEFAULT 10 NOT NULL ,
  city_id INTEGER   NOT NULL ,
  pan_name TEXT    ,
  pan_number TEXT    ,
  stn_number TEXT    ,
  name TEXT    ,
  email TEXT   NOT NULL ,
  mobile TEXT    ,
  balance REAL  DEFAULT 0 NOT NULL ,
  credit_limit REAL  DEFAULT 0 NOT NULL ,
  pincode TEXT    ,
  address TEXT    ,
  rating SMALLINT    ,
  note TEXT    ,
  cc_email_list TEXT    ,
  from_to_email TEXT    ,
  one_time_limit SMALLINT  DEFAULT 1 NOT NULL ,
  tds REAL  DEFAULT 10 NOT NULL   ,
PRIMARY KEY(id)        ,
  FOREIGN KEY (city_id)
    REFERENCES city(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_type_id)
    REFERENCES user_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (currency_id)
    REFERENCES currency(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (commercial_plan_id)
    REFERENCES commercial_plan(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX corporate_info_FKIndex3 ON user_info (city_id);
CREATE INDEX user_info_FKIndex2 ON user_info (user_type_id);
CREATE INDEX user_info_FKIndex3 ON user_info (currency_id);
CREATE INDEX user_info_FKIndex4 ON user_info (commercial_plan_id);







CREATE INDEX IFK_City ON user_info (city_id);
CREATE INDEX IFK_User Type ON user_info (user_type_id);
CREATE INDEX IFK_Currency ON user_info (currency_id);
CREATE INDEX IFK_Commercial ON user_info (commercial_plan_id);


CREATE TABLE traveler (
  id SERIAL  NOT NULL ,
  traveler_title_id INTEGER   NOT NULL ,
  user_info_id INTEGER   NOT NULL ,
  gender_id INTEGER  DEFAULT 5  ,
  passport_country_id INTEGER    ,
  city_id INTEGER    ,
  first_name TEXT   NOT NULL ,
  last_name TEXT   NOT NULL ,
  birthdate DATE   NOT NULL ,
  email TEXT   NOT NULL ,
  mobile TEXT   NOT NULL ,
  passport_number TEXT    ,
  passport_issue DATE    ,
  passport_expiry DATE    ,
  passport_place TEXT    ,
  pincode TEXT    ,
  address TEXT    ,
  phone TEXT    ,
  email2 TEXT      ,
PRIMARY KEY(id)          ,
  FOREIGN KEY (city_id)
    REFERENCES city(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (passport_country_id)
    REFERENCES country(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (gender_id)
    REFERENCES gender(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (traveler_title_id)
    REFERENCES traveler_title(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX passager_FKIndex1 ON traveler (city_id);
CREATE INDEX traveler_FKIndex3 ON traveler (passport_country_id);
CREATE INDEX traveler_FKIndex4 ON traveler (gender_id);
CREATE INDEX traveler_FKIndex5 ON traveler (user_info_id);
CREATE INDEX traveler_FKIndex5 ON traveler (traveler_title_id);



CREATE INDEX IFK_City ON traveler (city_id);
CREATE INDEX IFK_Passport Country ON traveler (passport_country_id);
CREATE INDEX IFK_Gender ON traveler (gender_id);
CREATE INDEX IFK_User Info ON traveler (user_info_id);
CREATE INDEX IFK_Title ON traveler (traveler_title_id);


CREATE TABLE cms (
  type_id INTEGER  DEFAULT 1 NOT NULL ,
  user_info_id INTEGER   NOT NULL ,
  content TEXT   NOT NULL   ,
PRIMARY KEY(type_id, user_info_id)  ,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX cms_FKIndex1 ON cms (user_info_id);



CREATE INDEX IFK_Company ON cms (user_info_id);


CREATE TABLE traveler_file (
  id SERIAL  NOT NULL ,
  traveler_id INTEGER   NOT NULL ,
  doc_type_id INTEGER   NOT NULL ,
  url TEXT    ,
  path TEXT   NOT NULL ,
  note TEXT    ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  user_visible BOOL  DEFAULT FALSE NOT NULL   ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (traveler_id)
    REFERENCES traveler(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (doc_type_id)
    REFERENCES doc_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX passager_documents_FKIndex1 ON traveler_file (traveler_id);
CREATE INDEX passager_documents_FKIndex2 ON traveler_file (doc_type_id);


CREATE INDEX IFK_Traveler ON traveler_file (traveler_id);
CREATE INDEX IFK_docType ON traveler_file (doc_type_id);


CREATE TABLE sub_users (
  reseller_id INTEGER   NOT NULL ,
  distributor_id INTEGER   NOT NULL   ,
PRIMARY KEY(reseller_id)    ,
  FOREIGN KEY (distributor_id)
    REFERENCES user_info(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (reseller_id)
    REFERENCES user_info(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX sub_users_FKIndex1 ON sub_users (distributor_id);
CREATE INDEX sub_users_FKIndex2 ON sub_users (reseller_id);


CREATE INDEX IFK_Distributor ON sub_users (distributor_id);
CREATE INDEX IFK_Reseller ON sub_users (reseller_id);


CREATE TABLE users (
  id SERIAL  NOT NULL ,
  user_info_id INTEGER   NOT NULL ,
  city_id INTEGER    ,
  email TEXT   NOT NULL ,
  password TEXT   NOT NULL ,
  enabled SMALLINT  DEFAULT 0 NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  name TEXT    ,
  activated timestamp without time zone    ,
  mobile TEXT    ,
  last_login timestamp without time zone    ,
  last_transaction timestamp without time zone    ,
  deactivated timestamp without time zone    ,
  pincode TEXT    ,
  address TEXT    ,
  note TEXT    ,
  pass_reset_code TEXT    ,
  emp_code TEXT    ,
  cost_center TEXT    ,
  department TEXT    ,
  location TEXT    ,
  supervisor TEXT    ,
  sales_rep TEXT    ,
  b2b_api SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (city_id)
    REFERENCES city(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX Users_FKIndex1 ON users (city_id);
CREATE INDEX users_FKIndex4 ON users (user_info_id);
CREATE UNIQUE INDEX users_email_unq ON users (email);



CREATE INDEX IFK_City ON users (city_id);
CREATE INDEX IFK_Corporate info ON users (user_info_id);


CREATE TABLE log (
  id SERIAL  NOT NULL ,
  user_id INTEGER   NOT NULL ,
  operation_id INTEGER   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  id_value INTEGER    ,
  old_value TEXT    ,
  new_value TEXT      ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (operation_id)
    REFERENCES log_operation(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX log_FKIndex1 ON log (operation_id);
CREATE INDEX log_FKIndex2 ON log (user_id);


CREATE INDEX IFK_Operation ON log (operation_id);
CREATE INDEX IFK_User ON log (user_id);


CREATE TABLE user_file (
  id SERIAL  NOT NULL ,
  user_info_id INTEGER   NOT NULL ,
  doc_type_id INTEGER   NOT NULL ,
  url TEXT    ,
  path TEXT   NOT NULL ,
  name TEXT   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  user_visible BOOL  DEFAULT FALSE NOT NULL   ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (doc_type_id)
    REFERENCES doc_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX user_document_FKIndex1 ON user_file (doc_type_id);
CREATE INDEX user_file_FKIndex2 ON user_file (user_info_id);


CREATE INDEX IFK_docType ON user_file (doc_type_id);
CREATE INDEX IFK_User Info ON user_file (user_info_id);


CREATE TABLE ff_settings (
  ff_carriers_id INTEGER   NOT NULL ,
  traveler_id INTEGER   NOT NULL ,
  code TEXT   NOT NULL   ,
PRIMARY KEY(ff_carriers_id, traveler_id)    ,
  FOREIGN KEY (ff_carriers_id)
    REFERENCES ff_carriers(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (traveler_id)
    REFERENCES traveler(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX ff_settings_FKIndex1 ON ff_settings (ff_carriers_id);
CREATE INDEX ff_settings_FKIndex2 ON ff_settings (traveler_id);


CREATE INDEX IFK_Promotions ON ff_settings (ff_carriers_id);
CREATE INDEX IFK_Traveler ON ff_settings (traveler_id);


CREATE TABLE visa (
  id SERIAL  NOT NULL ,
  traveler_id INTEGER   NOT NULL ,
  issuing_country_id INTEGER   NOT NULL ,
  number TEXT    ,
  issue_date DATE    ,
  expire_date DATE    ,
  type TEXT      ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (issuing_country_id)
    REFERENCES country(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (traveler_id)
    REFERENCES traveler(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX visa_FKIndex1 ON visa (issuing_country_id);
CREATE INDEX visa_FKIndex2 ON visa (traveler_id);


CREATE INDEX IFK_country ON visa (issuing_country_id);
CREATE INDEX IFK_Traveler ON visa (traveler_id);


CREATE TABLE credit_request (
  id SERIAL  NOT NULL ,
  approver_id INTEGER    ,
  creator_id INTEGER   NOT NULL ,
  amount INTEGER   NOT NULL ,
  use_date DATE   NOT NULL ,
  payback_date DATE   NOT NULL ,
  reason TEXT   NOT NULL ,
  html TEXT    ,
  status_id SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (creator_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (approver_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX credit_request_status_idx ON credit_request (status_id);
CREATE INDEX credit_request_FKIndex1 ON credit_request (creator_id);
CREATE INDEX credit_request_FKIndex2 ON credit_request (approver_id);



CREATE INDEX IFK_Creator ON credit_request (creator_id);
CREATE INDEX IFK_Approver ON credit_request (approver_id);


CREATE TABLE air_markup (
  id SERIAL  NOT NULL ,
  service_category_id INTEGER  DEFAULT 1 NOT NULL ,
  carrier_id INTEGER    ,
  user_id INTEGER   NOT NULL ,
  is_domestic BOOL  DEFAULT TRUE NOT NULL ,
  basic_rate REAL  DEFAULT 0 NOT NULL ,
  basic_adult_fixed REAL  DEFAULT 0 NOT NULL ,
  basic_child_fixed REAL  DEFAULT 0 NOT NULL ,
  basic_infant_fixed REAL  DEFAULT 0 NOT NULL ,
  basic_max REAL  DEFAULT 0 NOT NULL ,
  tax_rate REAL  DEFAULT 0 NOT NULL ,
  tax_adult_fixed REAL  DEFAULT 0 NOT NULL ,
  tax_child_fixed REAL  DEFAULT 0 NOT NULL ,
  tax_infant_fixed REAL  DEFAULT 0 NOT NULL ,
  tax_max REAL  DEFAULT 0 NOT NULL ,
  booking_rate REAL  DEFAULT 0 NOT NULL ,
  booking_adult_fixed REAL  DEFAULT 0 NOT NULL ,
  booking_child_fixed REAL  DEFAULT 0 NOT NULL ,
  booking_infant_fixed REAL  DEFAULT 0 NOT NULL ,
  booking_max REAL  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)        ,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (service_category_id)
    REFERENCES service_category(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX air_markup_FKIndex1 ON air_markup (user_id);
CREATE INDEX air_markup_FKIndex2 ON air_markup (carrier_id);
CREATE UNIQUE INDEX air_markup_unq ON air_markup (carrier_id, user_id, is_domestic, service_category_id);
CREATE INDEX air_markup_FKIndex3 ON air_markup (service_category_id);




CREATE INDEX IFK_User ON air_markup (user_id);
CREATE INDEX IFK_Carrier ON air_markup (carrier_id);
CREATE INDEX IFK_Category ON air_markup (service_category_id);


CREATE TABLE tour_code (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  user_info_id INTEGER    ,
  carrier_id INTEGER   NOT NULL ,
  code TEXT   NOT NULL ,
  scope SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX tour_code_FKIndex1 ON tour_code (user_info_id);
CREATE INDEX tour_code_FKIndex2 ON tour_code (carrier_id);
CREATE INDEX tour_code_FKIndex3 ON tour_code (air_source_id);



CREATE INDEX IFK_Company ON tour_code (user_info_id);
CREATE INDEX IFK_Carrier ON tour_code (carrier_id);
CREATE INDEX IFK_AirSource ON tour_code (air_source_id);


CREATE TABLE cc (
  id SERIAL  NOT NULL ,
  bin_id INTEGER   NOT NULL ,
  type_id INTEGER   NOT NULL ,
  user_info_id INTEGER   NOT NULL ,
  name TEXT   NOT NULL ,
  number TEXT   NOT NULL ,
  code TEXT   NOT NULL ,
  exp_date DATE   NOT NULL ,
  note TEXT    ,
  verification_status SMALLINT  DEFAULT 0  ,
  mask TEXT    ,
  hash TEXT    ,
  deleted SMALLINT  DEFAULT 0 NOT NULL ,
  3dstatus SMALLINT      ,
PRIMARY KEY(id)          ,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (type_id)
    REFERENCES cc_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (bin_id)
    REFERENCES bin_list(bin)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX cc_FKIndex1 ON cc (user_info_id);
CREATE INDEX cc_last4_idx ON cc (mask);
CREATE INDEX cc_exp_date_idx ON cc (exp_date);
CREATE INDEX cc_FKIndex3 ON cc (type_id);
CREATE INDEX cc_FKIndex4 ON cc (bin_id);





CREATE INDEX IFK_CC ON cc (user_info_id);
CREATE INDEX IFK_Type ON cc (type_id);
CREATE INDEX IFK_Bin ON cc (bin_id);


CREATE TABLE pf_code (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  user_info_id INTEGER    ,
  code TEXT   NOT NULL ,
  scope SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX pf_code_FKIndex1 ON pf_code (user_info_id);
CREATE INDEX pf_code_FKIndex2 ON pf_code (carrier_id);
CREATE INDEX pf_code_FKIndex3 ON pf_code (air_source_id);



CREATE INDEX IFK_Company ON pf_code (user_info_id);
CREATE INDEX IFK_Carrier ON pf_code (carrier_id);
CREATE INDEX IFK_AirSource ON pf_code (air_source_id);


CREATE TABLE preferences (
  id SERIAL  NOT NULL ,
  traveler_id INTEGER   NOT NULL ,
  int_seat_id INTEGER    ,
  int_meal_id INTEGER    ,
  department TEXT    ,
  designation TEXT    ,
  cost_center TEXT    ,
  emp_code TEXT      ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (traveler_id)
    REFERENCES traveler(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (int_meal_id)
    REFERENCES meal_list(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (int_seat_id)
    REFERENCES seat_list(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX Preferences_FKIndex1 ON preferences (traveler_id);
CREATE INDEX preferences_FKIndex5 ON preferences (int_meal_id);
CREATE INDEX preferences_FKIndex6 ON preferences (int_seat_id);


CREATE INDEX IFK_Traveler ON preferences (traveler_id);
CREATE INDEX IFK_int_meal ON preferences (int_meal_id);
CREATE INDEX IFK_itn_seat ON preferences (int_seat_id);


CREATE TABLE air_cart (
  id SERIAL  NOT NULL ,
  client_source_id INTEGER  DEFAULT 1 NOT NULL ,
  approval_status_id INTEGER  DEFAULT 1 NOT NULL ,
  user_id INTEGER   NOT NULL ,
  booking_status_id INTEGER  DEFAULT 1 NOT NULL ,
  loged_user_id INTEGER   NOT NULL ,
  payment_status_id INTEGER  DEFAULT 1 NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  note TEXT      ,
PRIMARY KEY(id)            ,
  FOREIGN KEY (payment_status_id)
    REFERENCES payment_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (loged_user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (booking_status_id)
    REFERENCES booking_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (approval_status_id)
    REFERENCES approval_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (client_source_id)
    REFERENCES client_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX air_cart_FKIndex2 ON air_cart (payment_status_id);
CREATE INDEX air_cart_FKIndex4 ON air_cart (user_id);
CREATE INDEX air_cart_FKIndex5 ON air_cart (loged_user_id);
CREATE INDEX air_cart_FKIndex10 ON air_cart (booking_status_id);
CREATE INDEX air_cart_FKIndex6 ON air_cart (approval_status_id);
CREATE INDEX air_cart_FKIndex6 ON air_cart (client_source_id);



CREATE INDEX IFK_Payment status ON air_cart (payment_status_id);
CREATE INDEX IFK_User ON air_cart (user_id);
CREATE INDEX IFK_Loged user ON air_cart (loged_user_id);
CREATE INDEX IFK_Status ON air_cart (booking_status_id);
CREATE INDEX IFK_Approval Status ON air_cart (approval_status_id);
CREATE INDEX IFK_ClientSource ON air_cart (client_source_id);


CREATE TABLE pay_gate_log (
  id SERIAL  NOT NULL ,
  currency_id INTEGER   NOT NULL ,
  air_cart_id INTEGER   NOT NULL ,
  status_id INTEGER  DEFAULT 1 NOT NULL ,
  user_info_id INTEGER    ,
  action_id INTEGER    ,
  pg_id INTEGER   NOT NULL ,
  cc_id INTEGER    ,
  hash_our TEXT    ,
  hash_response TEXT    ,
  pg_type TEXT    ,
  payment_mode TEXT    ,
  token TEXT   NOT NULL ,
  amount REAL  DEFAULT 0 NOT NULL ,
  convince_fee REAL  DEFAULT 0 NOT NULL ,
  discount REAL  DEFAULT 0 NOT NULL ,
  error TEXT    ,
  bank_ref TEXT    ,
  unmapped_status TEXT    ,
  raw_response TEXT    ,
  request_id TEXT    ,
  updated timestamp without time zone  DEFAULT now()  ,
  note TEXT    ,
  user_ip TEXT    ,
  user_browser TEXT    ,
  user_proxy TEXT    ,
  reason TEXT      ,
PRIMARY KEY(id)              ,
  FOREIGN KEY (cc_id)
    REFERENCES cc(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (pg_id)
    REFERENCES payment_gateway(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (action_id)
    REFERENCES tr_action(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (status_id)
    REFERENCES tr_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_cart_id)
    REFERENCES air_cart(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (currency_id)
    REFERENCES currency(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX pay_gate_log_FKIndex1 ON pay_gate_log (cc_id);
CREATE INDEX pay_gate_log_FKIndex2 ON pay_gate_log (pg_id);
CREATE INDEX pay_gate_log_FKIndex3 ON pay_gate_log (action_id);
CREATE INDEX pay_gate_log_FKIndex4 ON pay_gate_log (user_info_id);
CREATE INDEX pay_gate_log_FKIndex5 ON pay_gate_log (status_id);
CREATE INDEX pay_gate_log_FKIndex6 ON pay_gate_log (air_cart_id);
CREATE INDEX pay_gate_log_FKIndex7 ON pay_gate_log (currency_id);





















CREATE INDEX IFK_CC ON pay_gate_log (cc_id);
CREATE INDEX IFK_PG ON pay_gate_log (pg_id);
CREATE INDEX IFK_Action ON pay_gate_log (action_id);
CREATE INDEX IFK_User Info ON pay_gate_log (user_info_id);
CREATE INDEX IFK_Status ON pay_gate_log (status_id);
CREATE INDEX IFK_AirCart ON pay_gate_log (air_cart_id);
CREATE INDEX IFK_Currency ON pay_gate_log (currency_id);


CREATE TABLE payment (
  id SERIAL  NOT NULL ,
  air_cart_id INTEGER    ,
  pay_gate_log_id INTEGER    ,
  distributor_id INTEGER    ,
  loged_user_id INTEGER   NOT NULL ,
  transfer_type_id INTEGER   NOT NULL ,
  user_id INTEGER   NOT NULL ,
  currency_id INTEGER  DEFAULT 1 NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  old_balance REAL  DEFAULT 0 NOT NULL ,
  amount REAL  DEFAULT 0 NOT NULL ,
  new_balance REAL  DEFAULT 0 NOT NULL ,
  note TEXT    ,
  tds REAL  DEFAULT 0  ,
  approved TEXT    ,
  markup REAL  DEFAULT 0  ,
  service_tax REAL  DEFAULT 0  ,
  commision REAL  DEFAULT 0  ,
  xchange_rate REAL  DEFAULT 1    ,
PRIMARY KEY(id)              ,
  FOREIGN KEY (currency_id)
    REFERENCES currency(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (transfer_type_id)
    REFERENCES transfer_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (loged_user_id)
    REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE RESTRICT,
  FOREIGN KEY (distributor_id)
    REFERENCES user_info(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (pay_gate_log_id)
    REFERENCES pay_gate_log(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_cart_id)
    REFERENCES air_cart(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX payment_FKIndex1 ON payment (currency_id);
CREATE INDEX payment_FKIndex2 ON payment (user_id);
CREATE INDEX payment_FKIndex3 ON payment (transfer_type_id);
CREATE INDEX payment_FKIndex4 ON payment (loged_user_id);
CREATE INDEX payment_FKIndex5 ON payment (distributor_id);
CREATE INDEX payment_FKIndex6 ON payment (pay_gate_log_id);
CREATE INDEX payment_FKIndex7 ON payment (air_cart_id);



CREATE INDEX IFK_Currency ON payment (currency_id);
CREATE INDEX IFK_User ON payment (user_id);
CREATE INDEX IFK_Transfer type ON payment (transfer_type_id);
CREATE INDEX IFK_loged user ON payment (loged_user_id);
CREATE INDEX IFK_Distributor ON payment (distributor_id);
CREATE INDEX IFK_Pay gate log ON payment (pay_gate_log_id);
CREATE INDEX IFK_AirCart ON payment (air_cart_id);


CREATE TABLE air_booking (
  id SERIAL  NOT NULL ,
  ab_status_id INTEGER   NOT NULL ,
  air_source_id INTEGER    ,
  payment_process_id INTEGER   NOT NULL ,
  special_request_id INTEGER    ,
  service_type_id INTEGER   NOT NULL ,
  destination_id INTEGER   NOT NULL ,
  source_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  fare_type_id INTEGER    ,
  air_cart_id INTEGER   NOT NULL ,
  booking_type_id INTEGER   NOT NULL ,
  cabin_type_id INTEGER    ,
  traveler_type_id INTEGER   NOT NULL ,
  traveler_id INTEGER   NOT NULL ,
  ticket_number TEXT    ,
  basic_fare REAL  DEFAULT 0  ,
  fuel_surcharge REAL  DEFAULT 0  ,
  congestion_charge REAL  DEFAULT 0  ,
  airport_tax REAL  DEFAULT 0  ,
  udf_charge REAL  DEFAULT 0  ,
  jn_tax REAL  DEFAULT 0  ,
  meal_charge REAL  DEFAULT 0  ,
  seat_charge REAL  DEFAULT 0  ,
  passtrough_fee REAL  DEFAULT 0  ,
  client_source_amendment_fee REAL  DEFAULT 0  ,
  booking_fee REAL  DEFAULT 0  ,
  service_tax REAL  DEFAULT 0  ,
  reseller_amendment_fee REAL  DEFAULT 0  ,
  commission_or_discount_gross REAL  DEFAULT 0  ,
  tds REAL  DEFAULT 0  ,
  baggage_charge REAL  DEFAULT 0  ,
  booking_class CHAR(1)    ,
  oc_charge REAL    ,
  airline_pnr TEXT    ,
  crs_pnr TEXT    ,
  departure_ts timestamp without time zone    ,
  arrival_ts timestamp without time zone    ,
  reseller_markup_base REAL  DEFAULT 0  ,
  reseller_markup_fee REAL  DEFAULT 0  ,
  reseller_markup_tax REAL  DEFAULT 0  ,
  cancellation_fee REAL  DEFAULT 0  ,
  endorsment TEXT    ,
  fare_basis TEXT    ,
  private_fare TEXT    ,
  tour_code TEXT    ,
  frequent_flyer TEXT    ,
  profit REAL  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)                            ,
  FOREIGN KEY (traveler_id)
    REFERENCES traveler(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (traveler_type_id)
    REFERENCES traveler_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (booking_type_id)
    REFERENCES booking_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (cabin_type_id)
    REFERENCES cabin_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_cart_id)
    REFERENCES air_cart(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (fare_type_id)
    REFERENCES fare_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (source_id)
    REFERENCES airport(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (destination_id)
    REFERENCES airport(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (service_type_id)
    REFERENCES service_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (special_request_id)
    REFERENCES special_request(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (payment_process_id)
    REFERENCES payment_process(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (ab_status_id)
    REFERENCES ab_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX booking_FKIndex3 ON air_booking (traveler_id);
CREATE INDEX booking_FKIndex4 ON air_booking (traveler_type_id);
CREATE INDEX booking_FKIndex7 ON air_booking (booking_type_id);
CREATE INDEX booking_FKIndex8 ON air_booking (cabin_type_id);
CREATE INDEX air_booking_FKIndex5 ON air_booking (air_cart_id);
CREATE INDEX air_booking_FKIndex6 ON air_booking (fare_type_id);
CREATE INDEX air_booking_FKIndex7 ON air_booking (carrier_id);
CREATE INDEX air_booking_FKIndex8 ON air_booking (source_id);
CREATE INDEX air_booking_FKIndex9 ON air_booking (destination_id);
CREATE INDEX air_booking_FKIndex10 ON air_booking (service_type_id);
CREATE INDEX air_booking_FKIndex11 ON air_booking (special_request_id);
CREATE INDEX air_booking_FKIndex12 ON air_booking (payment_process_id);
CREATE INDEX air_booking_FKIndex13 ON air_booking (air_source_id);
CREATE INDEX air_booking_FKIndex15 ON air_booking (ab_status_id);


CREATE INDEX IFK_Traveler ON air_booking (traveler_id);
CREATE INDEX IFK_Traveler type ON air_booking (traveler_type_id);
CREATE INDEX IFK_Booking Type ON air_booking (booking_type_id);
CREATE INDEX IFK_Cabin type ON air_booking (cabin_type_id);
CREATE INDEX IFK_Cart ON air_booking (air_cart_id);
CREATE INDEX IFK_Fare ON air_booking (fare_type_id);
CREATE INDEX IFK_Carrier ON air_booking (carrier_id);
CREATE INDEX IFK_Source ON air_booking (source_id);
CREATE INDEX IFK_Destination ON air_booking (destination_id);
CREATE INDEX IFK_Service ON air_booking (service_type_id);
CREATE INDEX IFK_S.Request ON air_booking (special_request_id);
CREATE INDEX IFK_Payment process ON air_booking (payment_process_id);
CREATE INDEX IFK_AirSource ON air_booking (air_source_id);
CREATE INDEX IFK_AB Status ON air_booking (ab_status_id);


CREATE TABLE searches (
  id INTEGER   NOT NULL ,
  user_id INTEGER   NOT NULL ,
  created timestamp without time zone  DEFAULT Now() NOT NULL ,
  origin TEXT   NOT NULL ,
  destination TEXT   NOT NULL ,
  type_id SMALLINT  DEFAULT 1 NOT NULL ,
  is_domestic SMALLINT   NOT NULL ,
  date_depart SERIAL  NOT NULL ,
  date_return DATE    ,
  adults SMALLINT  DEFAULT 1 NOT NULL ,
  children SMALLINT  DEFAULT 0 NOT NULL ,
  infants SMALLINT  DEFAULT 0 NOT NULL ,
  category SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)  ,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX search_FKIndex1 ON searches (user_id);






CREATE INDEX IFK_User ON searches (user_id);


CREATE TABLE aircart_file (
  id SERIAL  NOT NULL ,
  aircart_id INTEGER   NOT NULL ,
  path TEXT   NOT NULL ,
  note TEXT    ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)  ,
  FOREIGN KEY (aircart_id)
    REFERENCES air_cart(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX aircart_file_FKIndex1 ON aircart_file (aircart_id);


CREATE INDEX IFK_AirCart ON aircart_file (aircart_id);


CREATE TABLE permission_x_user (
  user_id INTEGER   NOT NULL ,
  permission_id INTEGER   NOT NULL   ,
PRIMARY KEY(user_id, permission_id)    ,
  FOREIGN KEY (permission_id)
    REFERENCES permission(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX permission_x_user_FKIndex1 ON permission_x_user (permission_id);
CREATE INDEX permission_x_user_FKIndex2 ON permission_x_user (user_id);


CREATE INDEX IFK_Permission ON permission_x_user (permission_id);
CREATE INDEX IFK_User ON permission_x_user (user_id);


CREATE TABLE search_x_cache (
  cache_id INTEGER   NOT NULL ,
  search_id INTEGER   NOT NULL ,
  is_sent SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(cache_id, search_id)      ,
  FOREIGN KEY (search_id)
    REFERENCES searches(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (cache_id)
    REFERENCES routes_cache(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX search_x_cache_FKIndex1 ON search_x_cache (search_id);
CREATE INDEX search_x_cache_FKIndex2 ON search_x_cache (cache_id);




CREATE INDEX IFK_Search ON search_x_cache (search_id);
CREATE INDEX IFK_Cache ON search_x_cache (cache_id);


CREATE TABLE process (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER    ,
  searches_id INTEGER    ,
  queued timestamp without time zone  DEFAULT now() NOT NULL ,
  started timestamp without time zone    ,
  ended timestamp without time zone    ,
  result SMALLINT    ,
  note TEXT    ,
  parameters TEXT    ,
  pid INTEGER    ,
  start_at timestamp without time zone    ,
  command TEXT      ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (searches_id)
    REFERENCES searches(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id)
    REFERENCES air_source(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX process_FKIndex1 ON process (searches_id);
CREATE INDEX process_FKIndex2 ON process (air_source_id);




CREATE INDEX IFK_Search ON process (searches_id);
CREATE INDEX IFK_Air Source ON process (air_source_id);


CREATE TABLE cart_x_notes (
  note_id INTEGER   NOT NULL ,
  air_cart_id INTEGER   NOT NULL   ,
PRIMARY KEY(note_id, air_cart_id)    ,
  FOREIGN KEY (note_id)
    REFERENCES notes(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_cart_id)
    REFERENCES air_cart(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX cart_x_notes_FKIndex1 ON cart_x_notes (note_id);
CREATE INDEX cart_x_notes_FKIndex2 ON cart_x_notes (air_cart_id);


CREATE INDEX IFK_note ON cart_x_notes (note_id);
CREATE INDEX IFK_Cart ON cart_x_notes (air_cart_id);


CREATE TABLE fraud (
  id SERIAL  NOT NULL ,
  pay_gate_log_id INTEGER    ,
  cc_id INTEGER    ,
  ip TEXT    ,
  email TEXT    ,
  phone TEXT    ,
  created timestamp without time zone  DEFAULT now() NOT NULL   ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (cc_id)
    REFERENCES cc(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (pay_gate_log_id)
    REFERENCES pay_gate_log(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX fraud_FKIndex1 ON fraud (cc_id);
CREATE INDEX fraud_FKIndex2 ON fraud (pay_gate_log_id);


CREATE INDEX IFK_CC ON fraud (cc_id);
CREATE INDEX IFK_Transaction ON fraud (pay_gate_log_id);


CREATE TABLE cc_passtru (
  id SERIAL  NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  cc_id INTEGER   NOT NULL ,
  user_info_id INTEGER    ,
  scope SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (user_info_id)
    REFERENCES user_info(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (cc_id)
    REFERENCES cc(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);


CREATE INDEX cc_passtru_FKIndex1 ON cc_passtru (user_info_id);
CREATE INDEX cc_passtru_FKIndex2 ON cc_passtru (cc_id);
CREATE INDEX cc_passtru_FKIndex3 ON cc_passtru (carrier_id);



CREATE INDEX IFK_UserInfo ON cc_passtru (user_info_id);
CREATE INDEX IFK_Cc ON cc_passtru (cc_id);
CREATE INDEX IFK_Carrier ON cc_passtru (carrier_id);


CREATE TABLE deposit_search (
  id SERIAL  NOT NULL ,
  approver_id INTEGER    ,
  creator_id INTEGER   NOT NULL ,
  payment_id INTEGER    ,
  amount INTEGER   NOT NULL ,
  date_made DATE   NOT NULL ,
  reason TEXT   NOT NULL ,
  html TEXT    ,
  status_id SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)        ,
  FOREIGN KEY (payment_id)
    REFERENCES payment(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (creator_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (approver_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX deposit_search_status_idx ON deposit_search (status_id);
CREATE INDEX deposit_search_FKIndex1 ON deposit_search (payment_id);
CREATE INDEX deposit_search_FKIndex2 ON deposit_search (creator_id);
CREATE INDEX deposit_search_FKIndex3 ON deposit_search (approver_id);



CREATE INDEX IFK_Payment ON deposit_search (payment_id);
CREATE INDEX IFK_Creator ON deposit_search (creator_id);
CREATE INDEX IFK_Approver ON deposit_search (approver_id);


CREATE TABLE air_routes (
  id SERIAL  NOT NULL ,
  air_booking_id INTEGER   NOT NULL ,
  source_id INTEGER   NOT NULL ,
  destination_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  flight_number TEXT   NOT NULL ,
  departure_ts timestamp without time zone   NOT NULL ,
  arrival_ts timestamp without time zone   NOT NULL ,
  order_ SMALLINT  DEFAULT 1  ,
  source_terminal TEXT    ,
  destination_terminal TEXT    ,
  fare_basis TEXT    ,
  booking_class TEXT    ,
  meal TEXT    ,
  seat TEXT      ,
PRIMARY KEY(id)        ,
  FOREIGN KEY (carrier_id)
    REFERENCES carrier(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (source_id)
    REFERENCES airport(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (destination_id)
    REFERENCES airport(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_booking_id)
    REFERENCES air_booking(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX air_routes_FKIndex1 ON air_routes (carrier_id);
CREATE INDEX air_routes_FKIndex2 ON air_routes (source_id);
CREATE INDEX air_routes_FKIndex3 ON air_routes (destination_id);
CREATE INDEX air_routes_FKIndex4 ON air_routes (air_booking_id);


CREATE INDEX IFK_Carrier ON air_routes (carrier_id);
CREATE INDEX IFK_Source ON air_routes (source_id);
CREATE INDEX IFK_Destination ON air_routes (destination_id);
CREATE INDEX IFK_Booking ON air_routes (air_booking_id);


CREATE TABLE amendment (
  id SERIAL  NOT NULL ,
  air_route_id INTEGER   NOT NULL ,
  air_booking_id INTEGER   NOT NULL ,
  payment_id INTEGER    ,
  payment_status_id INTEGER  DEFAULT 1 NOT NULL ,
  invoice_status_id INTEGER    ,
  amendment_status_id INTEGER  DEFAULT 1 NOT NULL ,
  amendment_type_id INTEGER   NOT NULL ,
  loged_user_id INTEGER   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  flight_number TEXT    ,
  departure_ts timestamp without time zone    ,
  arrival_ts timestamp without time zone    ,
  airline_pnr TEXT    ,
  crs_pnr TEXT    ,
  ticket_number TEXT    ,
  basic_fare REAL    ,
  fuel_surcharge REAL    ,
  congestion_charge REAL    ,
  airport_tax REAL    ,
  udf_charge REAL    ,
  jn_tax REAL    ,
  meal_charge REAL    ,
  seat_charge REAL    ,
  passtrough_fee REAL    ,
  client_source_amendment_fee REAL    ,
  booking_fee REAL    ,
  service_tax REAL    ,
  reseller_amendment_fee REAL    ,
  commission_or_discount_gross REAL    ,
  tds REAL    ,
  refund_tds BOOL  DEFAULT FALSE  ,
  amount_to_charge REAL    ,
  oc_charge REAL      ,
PRIMARY KEY(id)                ,
  FOREIGN KEY (loged_user_id)
    REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (amendment_status_id)
    REFERENCES amendment_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (amendment_type_id)
    REFERENCES amendment_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (invoice_status_id)
    REFERENCES invoice_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (payment_status_id)
    REFERENCES payment_status(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (payment_id)
    REFERENCES payment(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_booking_id)
    REFERENCES air_booking(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (air_route_id)
    REFERENCES air_routes(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE);


CREATE INDEX amendment_FKIndex2 ON amendment (loged_user_id);
CREATE INDEX amendment_FKIndex3 ON amendment (amendment_status_id);
CREATE INDEX amendment_FKIndex4 ON amendment (amendment_type_id);
CREATE INDEX amendment_FKIndex5 ON amendment (invoice_status_id);
CREATE INDEX amendment_FKIndex6 ON amendment (payment_status_id);
CREATE INDEX amendment_FKIndex9 ON amendment (payment_id);
CREATE INDEX amendment_FKIndex10 ON amendment (air_booking_id);
CREATE INDEX amendment_FKIndex8 ON amendment (air_route_id);


CREATE INDEX IFK_Loged user ON amendment (loged_user_id);
CREATE INDEX IFK_Status ON amendment (amendment_status_id);
CREATE INDEX IFK_Type ON amendment (amendment_type_id);
CREATE INDEX IFK_Invoice status ON amendment (invoice_status_id);
CREATE INDEX IFK_Payment status ON amendment (payment_status_id);
CREATE INDEX IFK_Payment ON amendment (payment_id);
CREATE INDEX IFK_Booking ON amendment (air_booking_id);
CREATE INDEX IFK_Air Route ON amendment (air_route_id);



