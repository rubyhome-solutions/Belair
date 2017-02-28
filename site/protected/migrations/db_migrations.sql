-- 02.May.2014
drop table corporate_info CASCADE;

ALTER TABLE user_type ADD COLUMN leading_char character(1);
COPY user_type (id, name, is_fixed, leading_char) FROM stdin;
7	Client (B2C)	t	\N
1	Super admin	t	S
2	Frontline Staff	t	S
3	Agent - direct	t	A
4	Distributor	t	D
5	Agent - under distributor	t	A
6	Corporate (B2E)	t	C
8	Supervisor staff	t	S
9	Acountant staff	t	S
10	Unset (pending)	t	U
\. 


-- 05.May.2014
update users  
set city_id = user_info.city_id
from user_info  
Where
  users.user_info_id = user_info.id And
  users.city_id Is Null

-- 06.May.2014
CREATE TABLE permission (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  staff_only SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)  );
CREATE UNIQUE INDEX permissions_name_unq ON permission (name);

CREATE TABLE permission_x_type (
  permission_id INTEGER   NOT NULL ,
  user_type_id INTEGER   NOT NULL   ,
PRIMARY KEY(permission_id, user_type_id)    ,
  FOREIGN KEY (permission_id)
    REFERENCES permission(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_type_id)
    REFERENCES user_type(id) ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE INDEX permission_x_type_FKIndex1 ON permission_x_type (permission_id);
CREATE INDEX permission_x_type_FKIndex2 ON permission_x_type (user_type_id);

CREATE TABLE permission_x_user (
  user_id INTEGER   NOT NULL ,
  permission_id INTEGER   NOT NULL   ,
PRIMARY KEY(user_id, permission_id)    ,
  FOREIGN KEY (permission_id)
    REFERENCES permission(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
  FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE INDEX permission_x_user_FKIndex1 ON permission_x_user (permission_id);
CREATE INDEX permission_x_user_FKIndex2 ON permission_x_user (user_id);

INSERT INTO permission (name, staff_only) VALUES
('Can make bookings', 0),
('Manage all Carts', 0),
('View Accounts', 0),
('View all Amendments', 0),
('View Sales Reports', 0),
('Manage Travellers', 0),
('Manage Colleagues', 0),
('Manage Company info', 0),
('Manage Markups', 0),
('Emulate', 1),
('Manage commercials', 1),
('Manage Sources & booking work-flow', 1);

-- 2015-05-07
ALTER TABLE currency ADD COLUMN sign text;
update currency set sign='<i class="fa fa-inr fa-lg"></i>' WHERE id=1;
update currency set sign='<i class="fa fa-usd fa-lg"></i>' WHERE id=2;
update currency set sign='<i class="fa fa-eur fa-lg"></i>' WHERE id=3;

-- 2015-05-08
INSERT INTO permission (name, staff_only) values
('Manage Staff members', 1);
ALTER TABLE user_info ADD COLUMN note text;
ALTER TABLE user_info ADD COLUMN cc_email_list text;
ALTER TABLE user_info ADD COLUMN from_to_email text;


-- 2015-05-09
ALTER TABLE user_info ADD COLUMN one_time_limit smallint NOT NULL DEFAULT 1;
COMMENT ON COLUMN user_info.one_time_limit IS 'Is the credit limit a one time operation';

ALTER TABLE user_file RENAME note  TO name;
ALTER TABLE traveler_file RENAME note  TO name;

-- 2015-05-10
CREATE TABLE log_operation (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  table_name TEXT    ,
  id_filed_name TEXT    ,
  value_field_name TEXT    ,
  is_reversible BOOL  DEFAULT TRUE NOT NULL   ,
PRIMARY KEY(id)  );
CREATE UNIQUE INDEX log_operation_name_unq ON log_operation (name);

CREATE TABLE log (
  id SERIAL  NOT NULL ,
  user_id INTEGER   NOT NULL ,
  operation_id INTEGER   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  old_value TEXT    ,
  new_value TEXT      ,
  id_value INTEGER ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (operation_id) REFERENCES log_operation(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE INDEX log_FKIndex1 ON log (operation_id);
CREATE INDEX log_FKIndex2 ON log (user_id);

DELETE from log_operation;
ALTER SEQUENCE log_operation_id_seq RESTART;
INSERT INTO log_operation (id, name, table_name, id_filed_name, value_field_name, is_reversible) VALUES
(1, 'Company email change', 'user_info', 'id', 'email', true),
(2, 'Company mobile change', 'user_info', 'id', 'mobile', true),
(3, 'User email change', 'users', 'id', 'email', true),
(4, 'User mobile change', 'users', 'id', 'mobile', true),
(5, 'Balance change', 'user_info', 'id', 'balance', false);
SELECT setval('log_operation_id_seq', max(id)) FROM log_operation;

-- 2014-May-12
ALTER TABLE users DROP COLUMN enabled;
ALTER TABLE users ADD COLUMN enabled smallint default 0 not null;
ALTER TABLE users DROP CONSTRAINT users_user_info_id_fkey;
ALTER TABLE users ADD CONSTRAINT user_info_id_fkey FOREIGN KEY (user_info_id) REFERENCES user_info (id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- 2014-May-13
CREATE INDEX log_operation_idx ON log (operation_id);
CREATE INDEX log_date_idx ON log (created);

-- 2014-May-15
ALTER TABLE traveler ALTER COLUMN passport_country_id DROP NOT NULL;
ALTER TABLE traveler ALTER COLUMN city_id DROP NOT NULL;
ALTER TABLE traveler DROP COLUMN title;
ALTER TABLE traveler ADD COLUMN traveler_title_id INTEGER NOT NULL DEFAULT 1;
ALTER TABLE traveler ALTER COLUMN gender_id SET DEFAULT 1;

CREATE TABLE traveler_title
( id serial NOT NULL,
  name text NOT NULL,
  CONSTRAINT traveler_title_pkey PRIMARY KEY (id) 
);
DELETE from traveler_title;
INSERT INTO traveler_title (id, name) VALUES
(1, 'Mr.'),
(2, 'Ms.'),
(3, 'Mrs.'),
(4, 'Mstr.'),
(5, 'Inf.'),
(6, 'Dr.'),
(7, 'Prof.');
SELECT setval('traveler_title_id_seq', max(id)) FROM traveler_title;
ALTER TABLE traveler ADD CONSTRAINT traveler_title_id_fkey FOREIGN KEY (traveler_title_id) REFERENCES traveler_title (id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- 2015-May-16
CREATE TABLE ff_carriers
( id serial NOT NULL,
  name text NOT NULL,
  carrier_id integer,
  CONSTRAINT ff_carriers_pkey PRIMARY KEY (id) 
);
ALTER TABLE ff_carriers ADD CONSTRAINT carrier_id_fkey FOREIGN KEY (carrier_id) REFERENCES carrier (id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- 2014-May-17
CREATE TABLE ff_settings (
  ff_carriers_id INTEGER   NOT NULL ,
  traveler_id INTEGER   NOT NULL ,
  code TEXT   NOT NULL   ,
PRIMARY KEY(ff_carriers_id, traveler_id)    ,
  FOREIGN KEY (ff_carriers_id) REFERENCES ff_carriers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (traveler_id) REFERENCES traveler(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX ff_settings_FKIndex1 ON ff_settings (ff_carriers_id);
CREATE INDEX ff_settings_FKIndex2 ON ff_settings (traveler_id);

ALTER TABLE carrier ADD COLUMN is_domestic smallint NOT NULL DEFAULT 0;
UPDATE carrier set is_domestic=0;
UPDATE carrier set is_domestic=1 where code in ('SG', '9W', '6E', 'IT', 'AI', 'G8', 'S2');

ALTER TABLE preferences DROP CONSTRAINT preferences_domestic_airline_id_fkey;
ALTER TABLE preferences DROP CONSTRAINT preferences_int_airline_id_fkey;
ALTER TABLE preferences DROP COLUMN int_airline_id;
ALTER TABLE preferences DROP COLUMN domestic_airline_id;
ALTER TABLE preferences ADD COLUMN domestic_carrier_id INTEGER;
ALTER TABLE preferences ADD COLUMN int_carrier_id INTEGER;
ALTER TABLE preferences ADD CONSTRAINT preferences_domestic_carrier_id_fkey FOREIGN KEY (domestic_carrier_id) REFERENCES carrier(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE preferences ADD CONSTRAINT preferences_int_carrier_id_fkey FOREIGN KEY (int_carrier_id) REFERENCES carrier(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 2014-May-18
ALTER TABLE ff_carriers ADD COLUMN carrier_code character(2);
DELETE from ff_settings; -- old settings are now obsolette
DELETE from ff_carriers;
ALTER SEQUENCE ff_carriers_id_seq RESTART;
INSERT INTO ff_carriers (carrier_code, name) VALUES
('AC', 'AIR CANADA - AEROPLAN'),
('CA', 'AIR CHINA'),
('AF', 'AIR FRANCE - FREQUENCE PLUSE'),
('AI', 'AIR INDIA - FFP'),
('NZ', 'AIR NEW ZEALAND - AIR POINT'),
('AZ', 'ALITALIA - MILLEMAGLIA'),
('AA', 'AMERICAN - AA ADVANTAGE'),
('NH', 'ANA - ANA MILEAGE CLUB'),
('OZ', 'ASIANA AIRLINE - ASIANA BONUS CLUB'),
('OS', 'AUSTRIAN AIR - QUALIFLYER'),
('AV', 'AVIANCA - AVIANCA PLUS'),
('BA', 'BRITISH AIRWAYS - CXECUTIVE CLUB'),
('CX', 'CATHAY PACIFIC AIRWAYS'),
('MS', 'EGYPTAIR - EGYPTAIR PLUS'),
('CI', 'CHINA AIRLINE - DYNASTY FLYER PROGRAM'),
('MU', 'CHINA EASTERN AIR'),
('CZ', 'CHINA SOUTHERN AIRLINE'),
('CY', 'CYPEUS AIRWAYS - FFP'),
('DL', 'DELTA - SKYMILES'),
('LY', 'EL AL ISRAEL  - MATMID'),
('EK', 'EMIRATES'),
('EY', 'ETHIAD'),
('ET', 'ETHIOPIAN AIRLINE'),
('BR', 'EVA AIRWAYS - EVERGREE CLIB'),
('AY', 'FINNAIR - FINNAIR PLUS'),
('GF', 'GULF AIR - FFP'),
('HR', 'HAHN AIR'),
('IB', 'IBERIA - IBERIA PLUS'),
('FI', 'ICELANDAIR - FFP'),
('JL', 'JAPAN AIRLINES - JAL MILEAGE BANK'),
('9W', 'JET AIRWAYS - JET PRIVILEDGE CARD'),
('KL', 'KLM - FLYING DUTCHMAN'),
('KE', 'KOREAN AIR - SKYPASS'),
('KQ', 'KUWAIT AIRWAYS - OASIS'),
('LO', 'LOT POLISH - FFP'),
('LH', 'LUFTHANSA - MILES AND MORE '),
('MH', 'MALAYSIAN AIRLINES'),
('OA', 'OLYMPIC AIRWAYS - ICARUS'),
('WI', 'OMAN AIR - SINDBAD'),
('QF', 'QANTAS AIRWAYS -FFP'),
('QR', 'QATAR AIRWAYS - FFP'),
('RJ', 'ROYAL JORDANIAN - FFP'),
('SK', 'SAS - SAS EUROBONUS'),
('SV', 'SAUDI ARABIAN - ALFURSAN'),
('SQ', 'SINGAPORE AIRL - FFP'),
('SQ', 'SINGAPORE AIRL - KRISHFLYER'),
('SQ', 'SINGAPORE AIRL - RAFFLES'),
('SN', 'SN BRUSSELS AIRL -BUSINESS BENEFIT'),
('SN', 'SN BRUSSELS AIRL -FFP'),
('SA', 'SOUTH AFRICAN -VOYAGER'),
('SW', 'SOUTHWEST - RAPID REWARDS'),
('JK', 'SPANAIR - SPANAR PLUS'),
('UL', 'SRILANKAN AIRLINES'),
('LX', 'SWISS AIR REWARDS'),
('TG', 'THAI INTL - ROYAL ORCHID PLUS'),
('TK', 'TURKISH AIRLIENS - TURK HAVA'),
('US', 'U S AIRWAYS - DIVIDENED MILES'),
('UA', 'UNITED - MILEAGE PLUS'),
('VS', 'VIRGIN ATLANTIC'),
('VX', 'VIRGIN AMERICA '),
('VA', 'VIRGIN AUSTRALIA'),
('VA', 'VIRGIN AUSTRALIA - VIRGIN FREEWAY');
SELECT setval('ff_carriers_id_seq', max(id)) FROM ff_carriers;

UPDATE ff_carriers SET carrier_id = carrier.id
FROM carrier
WHERE ff_carriers.carrier_code = carrier.code;

ALTER TABLE ff_carriers ALTER COLUMN carrier_id SET NOT NULL;

CREATE OR REPLACE VIEW public.v_traveler_search_info AS
SELECT id, user_info_id AS company_id, 
 first_name || ' '::text ||last_name || ', '::text || traveler.email || ', '::text || traveler.mobile || ', '::text AS search_info
   FROM traveler;


-- 2014.May.19
ALTER TABLE preferences ADD COLUMN department TEXT;
ALTER TABLE preferences ADD COLUMN designation TEXT;
ALTER TABLE preferences ADD COLUMN cost_center TEXT;
ALTER TABLE preferences ADD COLUMN emp_code TEXT;
ALTER TABLE preferences DROP CONSTRAINT preferences_domestic_carrier_id_fkey;
ALTER TABLE preferences DROP COLUMN domestic_carrier_id;
ALTER TABLE preferences DROP CONSTRAINT preferences_int_carrier_id_fkey;
ALTER TABLE preferences DROP COLUMN int_carrier_id;
ALTER TABLE preferences DROP CONSTRAINT preferences_domestic_seat_id_fkey;
ALTER TABLE preferences DROP COLUMN domestic_seat_id;
ALTER TABLE preferences DROP CONSTRAINT preferences_domestic_meal_id_fkey;
ALTER TABLE preferences DROP COLUMN domestic_meal_id;

ALTER TABLE traveler ALTER COLUMN gender_id DROP NOT NULL;
ALTER TABLE traveler ALTER COLUMN birthdate DROP NOT NULL;

ALTER TABLE air_routes RENAME air_source_id  TO source_id;
ALTER TABLE air_routes DROP CONSTRAINT air_routes_air_source_id_fkey;
ALTER TABLE air_routes ADD CONSTRAINT air_routes_source_id_fkey 
    FOREIGN KEY (source_id) REFERENCES airport (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE air_routes   ADD COLUMN baggage_charge real;

ALTER TABLE air_cart ALTER COLUMN payment_id DROP NOT NULL;
ALTER TABLE air_cart RENAME air_source_id  TO source_id;
COMMENT ON COLUMN air_cart.destination_id IS 'Final destination';
COMMENT ON COLUMN air_cart.source_id IS 'Port of origination';

ALTER TABLE air_cart DROP CONSTRAINT air_cart_pkey;
ALTER TABLE air_cart RENAME COLUMN air_routes_id to air_booking_id;
ALTER TABLE air_cart DROP COLUMN code;
ALTER TABLE air_cart ADD COLUMN id serial;
ALTER TABLE air_cart ADD CONSTRAINT air_cart_pkey PRIMARY KEY(id);

ALTER TABLE air_booking DROP COLUMN id;
ALTER TABLE air_booking ADD COLUMN id serial;
ALTER TABLE air_cart ADD CONSTRAINT air_cart_air_booking_id_fkey 
    FOREIGN KEY (air_booking_id) REFERENCES air_booking (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE air_cart DROP CONSTRAINT air_cart_air_routes_id_fkey;

ALTER TABLE amendment RENAME COLUMN air_routes_id TO air_booking_id;
ALTER TABLE amendment ADD CONSTRAINT amendment_air_booking_id_fkey 
    FOREIGN KEY (air_booking_id) REFERENCES air_booking (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE amendment DROP CONSTRAINT amendment_air_routes_id_fkey;

CREATE SEQUENCE air_booking_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE air_booking ALTER COLUMN id SET DEFAULT nextval('air_booking_id_seq'::regclass);

CREATE SEQUENCE air_routes_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE air_routes ALTER COLUMN id SET DEFAULT nextval('air_routes_id_seq'::regclass);

CREATE SEQUENCE payment_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE payment ALTER COLUMN id SET DEFAULT nextval('payment_id_seq'::regclass);


-- 2014-May-20
ALTER TABLE air_routes DROP COLUMN basic_fare;
ALTER TABLE air_routes DROP COLUMN fuel_surcharge;
ALTER TABLE air_routes DROP COLUMN congestion_charge;
ALTER TABLE air_routes DROP COLUMN airport_tax;
ALTER TABLE air_routes DROP COLUMN udf_charge;
ALTER TABLE air_routes DROP COLUMN jn_tax;
ALTER TABLE air_routes DROP COLUMN meal_charge;
ALTER TABLE air_routes DROP COLUMN seat_charge;
ALTER TABLE air_routes DROP COLUMN baggage_charge;
ALTER TABLE air_routes DROP COLUMN passtrough_fee;
ALTER TABLE air_routes DROP COLUMN supplier_amendment_fee;
ALTER TABLE air_routes DROP COLUMN booking_fee;
ALTER TABLE air_routes DROP COLUMN service_tax;
ALTER TABLE air_routes DROP COLUMN reseller_amendment_fee;
ALTER TABLE air_routes DROP COLUMN commission_or_discount_gross;
ALTER TABLE air_routes DROP COLUMN tds;

ALTER TABLE air_booking ADD COLUMN basic_fare real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN fuel_surcharge real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN congestion_charge real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN airport_tax real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN udf_charge real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN jn_tax real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN meal_charge real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN seat_charge real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN passtrough_fee real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN supplier_amendment_fee real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN booking_fee real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN service_tax real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN reseller_amendment_fee real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN commission_or_discount_gross real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN tds real DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN baggage_charge real DEFAULT 0;

ALTER TABLE air_cart DROP COLUMN air_booking_id;
ALTER TABLE air_booking ADD COLUMN air_cart_id INTEGER NOT NULL;
ALTER TABLE air_cart ADD CONSTRAINT air_cart_pkey PRIMARY KEY (id);
ALTER TABLE air_booking ADD CONSTRAINT air_booking_air_cart_id_fkey 
    FOREIGN KEY (air_cart_id) REFERENCES air_cart (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE air_routes ADD COLUMN air_booking_id INTEGER NOT NULL;
ALTER TABLE air_routes ADD CONSTRAINT air_routes_air_booking_id_fkey 
    FOREIGN KEY (air_booking_id) REFERENCES air_booking (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE air_cart DROP COLUMN source_id;
ALTER TABLE air_cart DROP COLUMN destination_id;
ALTER TABLE air_cart DROP COLUMN service_type_id;
ALTER TABLE air_cart DROP COLUMN fare_type_id;
ALTER TABLE air_cart DROP COLUMN carrier_id;
ALTER TABLE air_cart ADD COLUMN note TEXT;

ALTER TABLE air_booking ADD COLUMN source_id INTEGER NOT NULL;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_source_id_fkey 
    FOREIGN KEY (source_id) REFERENCES airport (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE air_booking ADD COLUMN destination_id INTEGER NOT NULL;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_destination_id_fkey 
    FOREIGN KEY (destination_id) REFERENCES airport (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE air_booking ADD COLUMN service_type_id INTEGER NOT NULL;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_service_type_id_fkey 
    FOREIGN KEY (service_type_id) REFERENCES service_type (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE air_booking ADD COLUMN fare_type_id INTEGER NOT NULL;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_fare_type_id_fkey 
    FOREIGN KEY (fare_type_id) REFERENCES fare_type (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE air_booking ADD COLUMN carrier_id INTEGER NOT NULL;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_carrier_id_fkey 
    FOREIGN KEY (carrier_id) REFERENCES carrier (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;


ALTER TABLE air_booking ADD COLUMN oc_charge REAL DEFAULT 0;
ALTER TABLE amendment ADD COLUMN oc_charge REAL DEFAULT 0;

-- 2014-May-21
ALTER TABLE air_routes ADD COLUMN source_terminal TEXT;
ALTER TABLE air_routes ADD COLUMN destination_terminal TEXT;

-- 2014-May-23
ALTER TABLE air_booking ADD COLUMN airline_pnr TEXT;
ALTER TABLE air_booking ADD COLUMN crs_pnr TEXT;
ALTER TABLE air_cart DROP COLUMN csr_pnr;
ALTER TABLE air_cart DROP COLUMN airline_pnr;


-- 2014-May-23
ALTER TABLE air_booking DROP COLUMN departure_ts ;
ALTER TABLE air_booking DROP COLUMN arrival_ts ;
ALTER TABLE air_booking ADD COLUMN departure_ts timestamp without time zone;
ALTER TABLE air_booking ADD COLUMN arrival_ts timestamp without time zone;
COMMENT ON COLUMN air_booking.departure_ts IS 'First departure from air_routes';
COMMENT ON COLUMN air_booking.arrival_ts IS 'Last arrival from air_routes';

UPDATE air_booking ab SET departure_ts = 
( 
    SELECT min(air_routes.departure_ts) FROM
      public.air_routes,
      air_cart
    WHERE 
      ab.id = air_routes.air_booking_id and
      air_cart.id = ab.air_cart_id
);

UPDATE air_booking ab SET arrival_ts = 
( 
    SELECT max(air_routes.arrival_ts) FROM
      public.air_routes,
      air_cart
    WHERE 
      ab.id = air_routes.air_booking_id and
      air_cart.id = ab.air_cart_id
);

ALTER TABLE booking_status ADD COLUMN message text;

-- 2014-May-26
CREATE OR REPLACE VIEW v_traveler_search_info AS 
 SELECT traveler.id, traveler.user_info_id AS company_id, (((((traveler_title.name || ' '::text) || traveler.first_name) || ' '::text) || traveler.last_name) || COALESCE(', '::text || traveler.email, ''::text)) || COALESCE(', '::text || traveler.mobile, ''::text) AS search_info
   FROM traveler
   JOIN traveler_title ON traveler_title.id = traveler.traveler_title_id;


-- 2014-May-27
ALTER TABLE air_booking ADD COLUMN reseller_markup_base REAL DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN reseller_markup_fee REAL DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN reseller_markup_tax REAL DEFAULT 0;
ALTER TABLE air_booking ADD COLUMN cancellation_fee REAL DEFAULT 0;

CREATE TABLE notes (
  id SERIAL  NOT NULL ,
  note TEXT   NOT NULL   ,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
PRIMARY KEY(id));

CREATE TABLE cart_x_notes (
  note_id INTEGER   NOT NULL ,
  air_cart_id INTEGER   NOT NULL   ,
PRIMARY KEY(note_id, air_cart_id)    ,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (air_cart_id) REFERENCES air_cart(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE INDEX cart_x_notes_FKIndex1 ON cart_x_notes (note_id);
CREATE INDEX cart_x_notes_FKIndex2 ON cart_x_notes (air_cart_id);

CREATE TABLE carrier_helpline (
  text TEXT   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  code CHAR(2)      ,
PRIMARY KEY(carrier_id)  ,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX carrier_helpline_FKIndex1 ON carrier_helpline (carrier_id);
INSERT INTO carrier_helpline VALUES ('1800-222111, 9223222111', 59, 'G8');
INSERT INTO carrier_helpline VALUES ('91-124-6613838, 9910383838', 719, '6E');
INSERT INTO carrier_helpline VALUES ('1800-1803333, 9871803333', 598, 'SG');
INSERT INTO carrier_helpline VALUES ('1800-1801407 (mtnl/ bsnl), 1407 (mobile)', 129, 'AI');
INSERT INTO carrier_helpline VALUES ('(city code) 39893333', 771, '9W');
INSERT INTO carrier_helpline VALUES ('1800-223020, 30302020', 511, 'S2'); 

-- 2014-May-28
update booking_status set message='We have not received confirmation against this booking reference № {REFERENCE}.' where id=1;
update booking_status set message='Your booking reference № {REFERENCE} is currently In Process, but its items are still not confirmed.' where id=2;
update booking_status set message='Your booking reference № {REFERENCE} is On Hold. Airline has authority to cancel booking any time. Please contact our call center for further help.' where id=3;
update booking_status set message='Your booking reference № {REFERENCE} is aborted due to non availability ... ' where id=4;
update booking_status set message='Your cancellation request has been received and it is currently under process. ' where id=5;
update booking_status set message='Your cancellation request has been complete.' where id=6;
update booking_status set message='Your booking reference № {REFERENCE} is In Process, but one or more item/s is/are still not confirmed. Please contact our call center for further help.' where id=7;
update booking_status set message='Your booking reference № {REFERENCE} has been confirmed.' where id=8;


-- 2014-May-28
DELETE from fare_type WHERE id>2;
UPDATE fare_type SET name = 'Non Refundable' WHERE id=1;
UPDATE fare_type SET name = 'Refundable' WHERE id=2;
SELECT setval('fare_type_id_seq', max(id)) FROM fare_type;

ALTER TABLE amendment_type DROP COLUMN "code";
DELETE from amendment_type;
ALTER SEQUENCE amendment_type_id_seq RESTART;
INSERT INTO amendment_type (name) VALUES
('Cancel'),
('Reschedule'),
('Miscellaneous');
SELECT setval('amendment_type_id_seq', max(id)) FROM amendment_type;

CREATE TABLE special_request (
  id SERIAL  NOT NULL ,
  code CHAR(4)   NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
INSERT INTO special_request (code,name) VALUES
('AVIH', 'Animal In Hold'),
('BIKE', 'Bicycle'),
('BLND', 'Blind Passenger'),
('BSCT', 'Bassinet/Carrycot'),
('BULK', 'Bulky Baggage'),
('CBBG', 'Cabin Baggage'),
('CHLD', 'Child Information'),
('CKIN', 'Check in Information'),
('COUR', 'Commercial Courier'),
('DEAF', 'Deaf Passenger'),
('DEPA', 'Deportee (Accompanied)'),
('DEPU', 'Deportee (Unaccompanied)'),
('DPNA', 'Disabled Passenger Needs'),
('EPAY', 'Guaranteed Electronic Payment'),
('EXST', 'Extra Seat'),
('FRAG', 'Fragile Baggage'),
('GPST', 'Group Seat'),
('GRPF', 'Group Fare'),
('INFT', 'Infant W/O Seat'),
('LANG', 'Language Assistance'),
('MAAS', 'Meet & Assist'),
('MEDA', 'Medical Case'),
('PETC', 'Pet In Cabin'),
('SEMN', 'Ships Crew'),
('SLPR', 'Sleeper/Berth'),
('SPEQ', 'Sports Equipment'),
('STCR', 'Stretcher'),
('TKNM', 'Manual Ticket Number'),
('TWOV', 'Transit W/O Visa'),
('UMNR', 'Unaccompanied Minor'),
('WCHC', 'Wheelchair (Carry On)'),
('WCHR', 'Wheelchair (Can Climb Stairs)'),
('WCHS', 'Wheelchair (Cannot Climb Stairs)'),
('WEAP', 'Weapon Firearm Or Ammunition As Chkd'),
('XBAG', 'Excess Baggage'),
('WCBD', 'Own Wheelchair- Dry Cell Battery'),
('WCBW', 'Own Wheelchair- Wet Cell Battery'),
('WCOB', 'Wheelchair Required On Board'),
('WCMP', 'Wheelchair Manual Power');
CREATE TABLE sr_x_ab (
  special_request_id INTEGER   NOT NULL ,
  air_booking_id INTEGER   NOT NULL   ,
PRIMARY KEY(special_request_id, air_booking_id)    ,
  FOREIGN KEY (special_request_id) REFERENCES special_request(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (air_booking_id) REFERENCES air_booking(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX sr_x_ab_FKIndex1 ON sr_x_ab (special_request_id);
CREATE INDEX sr_x_ab_FKIndex2 ON sr_x_ab (air_booking_id);

ALTER TABLE amendment ADD COLUMN air_route_id INTEGER NOT NULL;
ALTER TABLE amendment ADD CONSTRAINT amendment_air_route_id_fkey 
    FOREIGN KEY (air_route_id) REFERENCES air_routes (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;


-- 2014-May-30
DROP TABLE sr_x_ab;
ALTER TABLE traveler DROP COLUMN frequent_flier;

ALTER TABLE air_booking ADD COLUMN special_request_id INTEGER;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_special_request_id_fkey
    FOREIGN KEY (special_request_id) REFERENCES special_request (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_booking_special_request_id_fkey ON air_booking (special_request_id);

CREATE TABLE payment_process (
  id SERIAL   NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id) );
COMMENT ON COLUMN payment_process.name IS 'Root or Client pass-trought';

ALTER TABLE air_booking ADD COLUMN payment_process_id INTEGER;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_payment_process_id_fkey
    FOREIGN KEY (payment_process_id) REFERENCES payment_process (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_booking_payment_process_id_fkey ON air_booking (payment_process_id);

CREATE TABLE pf_code (
  carrier_id INTEGER   NOT NULL ,
  user_info_id INTEGER   NOT NULL ,
  code TEXT   NOT NULL   ,
PRIMARY KEY(carrier_id, user_info_id)    ,
  FOREIGN KEY (user_info_id) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX pf_code_FKIndex1 ON pf_code (user_info_id);
CREATE INDEX pf_code_FKIndex2 ON pf_code (carrier_id);

CREATE TABLE tour_code (
  user_info_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  code TEXT   NOT NULL   ,
PRIMARY KEY(user_info_id, carrier_id)    ,
  FOREIGN KEY (user_info_id) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX tour_code_FKIndex1 ON tour_code (user_info_id);
CREATE INDEX tour_code_FKIndex2 ON tour_code (carrier_id);

ALTER TABLE air_booking ADD COLUMN endorsment TEXT;


-- 2014-June-01
ALTER TABLE air_booking ADD COLUMN fare_basis TEXT;
ALTER TABLE air_booking ADD COLUMN air_source_id INTEGER;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_air_source_id_fkey
    FOREIGN KEY (air_source_id) REFERENCES air_source (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_booking_air_source_id_fkey ON air_booking (air_source_id);

CREATE TABLE air_supplier (
  id SERIAL  NOT NULL ,
  book_source_id INTEGER    ,
  reserve_source_id INTEGER    ,
  search_source_id INTEGER    ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (book_source_id) REFERENCES air_source(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (reserve_source_id) REFERENCES air_source(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (search_source_id) REFERENCES air_source(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX air_supplier_FKIndex1 ON air_supplier (book_source_id);
CREATE INDEX air_supplier_FKIndex2 ON air_supplier (reserve_source_id);
CREATE INDEX air_supplier_FKIndex3 ON air_supplier (search_source_id);
INSERT INTO air_supplier (name) VALUES
('Default'),
('Belair_H'),
('Belair_T'),
('Belair_A'),
('Indigo'),
('SpiceJet'),
('Belair_G8_T'),
('G8_BELAIR'),
('Belair_E_9W');

ALTER TABLE air_booking ADD COLUMN air_supplier_id INTEGER;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_air_supplier_id_fkey
    FOREIGN KEY (air_supplier_id) REFERENCES air_supplier (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_booking_air_supplier_id_fkey ON air_booking (air_supplier_id);

-- 2014-June-02
ALTER TABLE amendment_status DROP COLUMN code;
DELETE from amendment_status;
ALTER SEQUENCE amendment_status_id_seq RESTART;
INSERT INTO amendment_status (name) VALUES
('Requested'),
('Amended with supplier'),
('Cancelled'),
('Booked');
SELECT setval('amendment_status_id_seq', max(id)) FROM amendment_status;

ALTER TABLE amendment ADD COLUMN note TEXT;
ALTER TABLE air_booking ADD COLUMN created timestamp without time zone  DEFAULT now();
CREATE SEQUENCE amendment_group_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE amendment ADD COLUMN group_id INTEGER NOT NULL;
CREATE INDEX ON amendment (group_id);

-- 2014-June-04
ALTER TABLE amendment ADD COLUMN changes TEXT;

-- 2014-June-06
CREATE INDEX ON air_cart (created);

CREATE TABLE approval_status (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
DELETE from approval_status;
ALTER SEQUENCE approval_status_id_seq RESTART;
INSERT INTO approval_status (name) VALUES
('Not Required'),
('Pending'),
('Approved'),
('Declined'),
('Sent For Approval');
SELECT setval('approval_status_id_seq', max(id)) FROM approval_status;

ALTER TABLE air_cart ADD COLUMN approval_status_id INTEGER DEFAULT 1;
ALTER TABLE air_cart ADD CONSTRAINT air_cart_approval_status_id_fkey
    FOREIGN KEY (approval_status_id) REFERENCES approval_status (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_cart_approval_status_id_fkey ON air_cart (approval_status_id);

ALTER TABLE air_cart ALTER COLUMN id SET DEFAULT nextval('air_cart_id_seq'::regclass);


CREATE TABLE ab_status (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
DELETE from ab_status;
ALTER SEQUENCE ab_status_id_seq RESTART;
INSERT INTO ab_status (name) VALUES
('In Process'),
('OK'),
('To Amend/Cancel'),
('Cancelled');
SELECT setval('ab_status_id_seq', max(id)) FROM ab_status;

ALTER TABLE air_booking ADD COLUMN ab_status_id INTEGER DEFAULT 1;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_ab_status_id_fkey
    FOREIGN KEY (ab_status_id) REFERENCES ab_status (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_booking_ab_status_id_fkey ON air_booking (ab_status_id);

CREATE OR REPLACE VIEW v_pnrs_tickets_search_info AS 
SELECT distinct air_cart.id, air_booking.airline_pnr || ' ' || air_booking.crs_pnr || ' ' || air_booking.ticket_number AS search_info
   FROM air_booking
   JOIN air_cart ON air_cart.id = air_booking.air_cart_id;


-- 2014-June-09
ALTER TABLE routes_cache ADD COLUMN hits INTEGER DEFAULT 0;
COMMENT ON COLUMN routes_cache.hits IS 'How many times this request get hitted';

-- 2014-June-11
ALTER TABLE amendment ADD COLUMN prev_ab_status_id INTEGER DEFAULT 2;
ALTER TABLE amendment ADD CONSTRAINT amendment_prev_ab_status_id_fkey
    FOREIGN KEY (prev_ab_status_id) REFERENCES ab_status (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;

-- 2014-June-12
CREATE OR REPLACE VIEW v_traveler_search_info AS 
 SELECT traveler.id, traveler.user_info_id AS company_id, (((((traveler_title.name || ' '::text) || traveler.first_name) || ' '::text) || traveler.last_name) || COALESCE(', '::text || traveler.email, ''::text)) || COALESCE(', '::text || traveler.mobile, ''::text) AS search_info, traveler.birthdate
   FROM traveler
   JOIN traveler_title ON traveler_title.id = traveler.traveler_title_id;

-- 2014-June-13
ALTER TABLE air_source ADD COLUMN credentials TEXT;
ALTER TABLE air_source ADD COLUMN config TEXT;
INSERT INTO air_source VALUES (21, 'Galileo test', 'VpIRFnwRubJaRfiU6gnZUqFbO0xFiYVTAzML+eaWS1jdkoNfoOfPhURU7J8DBOlN47GKUc9goV/kjctfs8p9dQxqGwG3dpvIse5LU+b2LEo=', NULL);
INSERT INTO air_source VALUES (22, 'Galileo production', 'VpIRFnwRubJaRfiU6gnZUrHnnUQ5Jlonw9IN+Mu7qnrj6yIuM4eMMck9ikLyCaxt8Ld1IIf4luF1Ejg0Bu5aitwjMgaDpHkO9oucLC0ZCg0=', NULL); 

-- 2014-June-19
CREATE TABLE air_way (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
DELETE from air_way;
INSERT INTO air_way (id, name) VALUES
(1, 'Default'),
(2, 'Domestic'),
(3, 'International');
SELECT setval('air_way_id_seq', max(id)) FROM air_way;

ALTER TABLE air_source ADD COLUMN username TEXT;
ALTER TABLE air_source ADD COLUMN password TEXT;
ALTER TABLE air_source ADD COLUMN tran_username TEXT;
ALTER TABLE air_source ADD COLUMN tran_password TEXT;
ALTER TABLE air_source ADD COLUMN office_id TEXT;
ALTER TABLE air_source ADD COLUMN iata_number TEXT;
ALTER TABLE air_source ADD COLUMN profile_pcc TEXT;
ALTER TABLE air_source ADD COLUMN domestic_pcc TEXT;
ALTER TABLE air_source ADD COLUMN int_pcc TEXT;
ALTER TABLE air_source ADD COLUMN spare1 TEXT;
ALTER TABLE air_source ADD COLUMN spare2 TEXT;
ALTER TABLE air_source ADD COLUMN spare3 TEXT;
ALTER TABLE air_source ADD COLUMN url TEXT;
ALTER TABLE air_source ADD COLUMN proxy_ip TEXT;
ALTER TABLE air_source ADD COLUMN proxy_port TEXT;
ALTER TABLE air_source ADD COLUMN include_carriers TEXT;
ALTER TABLE air_source ADD COLUMN exclude_carriers TEXT;
ALTER TABLE air_source ADD COLUMN include_pass_carriers TEXT;
ALTER TABLE air_source ADD COLUMN exclude_pass_carriers TEXT;
ALTER TABLE air_source ADD COLUMN integration_type TEXT;
ALTER TABLE air_source ADD COLUMN queue_num TEXT;
ALTER TABLE air_source ADD COLUMN email_cancellation TEXT;
ALTER TABLE air_source ADD COLUMN supplier_verification TEXT;
ALTER TABLE air_source ADD COLUMN res_queue_amend INTEGER;
ALTER TABLE air_source ADD COLUMN air_way_id INTEGER;
ALTER TABLE air_source ADD COLUMN bta_pass INTEGER;
ALTER TABLE air_source ADD COLUMN amex_pass INTEGER;
ALTER TABLE air_source ADD COLUMN visa_pass INTEGER;
ALTER TABLE air_source ADD COLUMN root_pass INTEGER;
ALTER TABLE air_source ADD COLUMN master_pass INTEGER;
ALTER TABLE air_source ADD COLUMN resync INTEGER;
ALTER TABLE air_source ADD COLUMN auto_cancellation INTEGER;
ALTER TABLE air_source ADD COLUMN fop INTEGER;

ALTER TABLE air_source ADD CONSTRAINT air_source_air_way_id_fkey
    FOREIGN KEY (air_way_id) REFERENCES air_way (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_source_air_way_id_fkey ON air_source (air_way_id);

-- 2014.Jun.21
CREATE TABLE city_pairs (
  source_id INTEGER   NOT NULL ,
  destination_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL   ,
PRIMARY KEY(source_id, destination_id, carrier_id)      ,
  FOREIGN KEY (destination_id) REFERENCES airport(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (source_id) REFERENCES airport(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX city_pairs_FKIndex1 ON city_pairs (destination_id);
CREATE INDEX city_pairs_FKIndex2 ON city_pairs (source_id);
CREATE INDEX city_pairs_FKIndex3 ON city_pairs (carrier_id);

-- 2014-Jul-24
CREATE TABLE air_source_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
DELETE from air_source_type;
INSERT INTO air_source_type (id, name) VALUES
(1, 'API production'),
(2, 'API test'),
(3, 'Scrapper');
SELECT setval('air_source_type_id_seq', max(id)) FROM air_source_type;

ALTER TABLE air_source ADD COLUMN type_id INTEGER DEFAULT 1;
ALTER TABLE air_source ADD CONSTRAINT air_source_type_id_fkey
    FOREIGN KEY (type_id) REFERENCES air_source_type (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_source_type_id_fkey ON air_source (type_id);

ALTER TABLE air_source ADD COLUMN balance REAL DEFAULT 0;

-- 2014-Jul-27
CREATE TABLE backend (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  search TEXT    ,
  book TEXT    ,
  hold TEXT      ,
PRIMARY KEY(id)  );
CREATE UNIQUE INDEX backend_name_unq_idx ON backend (name);
DELETE from backend;
INSERT INTO backend (name) VALUES
('Indigo production'),
('Indigo test'),
('Spicejet production'),
('Spicejet test'),
('Galileo production'),
('Galileo test'),
('Amadeus production'),
('Amadeus test'),
('GoAir production'),
('GoAir test');

ALTER TABLE air_source ADD COLUMN backend_id INTEGER DEFAULT 1;
ALTER TABLE air_source ADD CONSTRAINT air_source_backend_id_fkey
  FOREIGN KEY (backend_id) REFERENCES backend(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 2014-Jul-28
ALTER TABLE backend ADD COLUMN balance TEXT;
ALTER TABLE air_source DROP COLUMN type_id;
DROP TABLE air_source_type;


-- 2014-Aug-11
INSERT INTO backend (name, search, book, hold, balance) VALUES 
('Spicejet scrapper','components/llc_sites/spicejet/spicejet.php','components/llc_sites/spicejet-booking/spicejet.php','','components/llc_sites/spicejet-balance-checker/spicejet.php');

INSERT INTO air_source VALUES (34, 'Spicejet scrapper-0', NULL, '', 'BTDELB2144', 'Belair@123', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12);
SELECT pg_catalog.setval('air_source_id_seq', 34, true);

-- 2014-Aug-17
ALTER TABLE air_routes ADD COLUMN fare_basis TEXT;
ALTER TABLE air_routes ADD COLUMN booking_class TEXT;

-- 2014-Aug-21
ALTER TABLE air_booking ALTER COLUMN cabin_type_id SET DEFAULT 1;
update air_booking set cabin_type_id=1 where cabin_type_id is null;
ALTER TABLE backend ADD COLUMN pnr_acquisition TEXT;

-- 2014-Aug-25
-- Meal preference
-- Seat preference
ALTER TABLE air_routes ADD COLUMN meal TEXT;
ALTER TABLE air_routes ADD COLUMN seat TEXT;

-- Tour code
-- Private fare
ALTER TABLE air_booking ADD COLUMN tour_code TEXT;
ALTER TABLE air_booking ADD COLUMN private_fare TEXT;
ALTER TABLE air_booking ADD COLUMN frequent_flyer TEXT;

-- 2014-Aug-29
ALTER TABLE cc ADD COLUMN last4 text;

-- 2014-Aug-31
ALTER TABLE backend ADD COLUMN api_source TEXT;
UPDATE backend SET api_source='\application\components\Amadeus\test\AmadeusWebServices2' WHERE id=8;
UPDATE backend SET api_source='\application\components\Amadeus\production\AmadeusWebServices2' WHERE id=7;

-- 2014-Sep-02
ALTER TABLE air_routes ADD COLUMN aircraft TEXT;

-- 2014-Sep-03
ALTER TABLE backend ADD COLUMN pnr_resync TEXT;
ALTER TABLE backend ADD COLUMN pnr_cancel TEXT;
ALTER TABLE backend ADD COLUMN pnr_list TEXT;
ALTER TABLE backend ADD COLUMN pnr_book TEXT;
UPDATE backend SET pnr_resync='\application\components\Amadeus\Utils::resyncPnr' WHERE id=8;
UPDATE backend SET pnr_resync='\application\components\Amadeus\Utils::resyncPnr' WHERE id=7;
UPDATE backend SET pnr_cancel='\application\components\Amadeus\Utils::cancelPnr' WHERE id=8;
UPDATE backend SET pnr_cancel='\application\components\Amadeus\Utils::cancelPnr' WHERE id=7;
UPDATE backend SET pnr_list='\application\components\Amadeus\Utils::listPnr' WHERE id=8;
UPDATE backend SET pnr_list='\application\components\Amadeus\Utils::listPnr' WHERE id=7;
UPDATE backend SET pnr_book='\application\components\Amadeus\test\Book' WHERE id=8;
UPDATE backend SET pnr_book='\application\components\Amadeus\production\Book' WHERE id=7;

-- 2014-Sep-06
UPDATE ab_status SET name='To Amend' WHERE id=3;
INSERT INTO ab_status (name) VALUES ('To Cancel');

-- 2014-Sep-09
ALTER TABLE backend ADD COLUMN wsdl_file TEXT;
UPDATE backend SET wsdl_file='\YiiBase::getPathOfAlias("application.components.Galileo") . DIRECTORY_SEPARATOR . "production" . DIRECTORY_SEPARATOR . "Galileo.wsdl";' WHERE id=5; -- Production
UPDATE backend SET wsdl_file='\YiiBase::getPathOfAlias("application.components.Galileo") . DIRECTORY_SEPARATOR . "test" . DIRECTORY_SEPARATOR . "Galileo.wsdl";' WHERE id=6; -- Test

-- 2014-Sep-12
UPDATE backend SET 
    pnr_book='\application\components\Galileo\Utils::book',
    pnr_resync='\application\components\Galileo\Utils::resyncPnr',
    pnr_cancel='\application\components\Galileo\Utils::cancelPnr',
    pnr_list='\application\components\Galileo\Utils::listPnr',
    pnr_acquisition='\application\components\Galileo\Utils::aquirePnr',
    api_source='\application\components\Galileo\Galileo'
WHERE id=5  -- Galileo Production backend 
OR id=6;    -- Galileo Test backend

-- 2014-Sep-22
UPDATE backend SET 
    pnr_resync='\ApiInterface::resyncPnr'
WHERE id=5  -- Galileo Production backend 
OR id=6;    -- Galileo Test backend

ALTER TABLE backend ADD COLUMN pnr_load TEXT;
UPDATE backend SET 
    pnr_load='\application\components\Galileo\PnrAcquisition'
WHERE id=5  -- Galileo Production backend 
OR id=6;    -- Galileo Test backend

-- 2014-Sep-25
UPDATE backend SET 
    pnr_book='\application\components\Galileo\PnrManagement'
WHERE id=5  -- Galileo Production backend 
OR id=6;    -- Galileo Test backend


-- 2014-Sep-29
ALTER TABLE cc RENAME last4  TO mask;

-- 2014-Oct-01
DROP TABLE IF EXISTS payment_gateway CASCADE ;
CREATE TABLE payment_gateway (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  note TEXT    ,
  merchant_id TEXT    ,
  salt TEXT    ,
  base_url TEXT      ,
  is_active SMALLINT NOT NULL DEFAULT 1 ,
  api_url TEXT      ,
PRIMARY KEY(id));
INSERT INTO payment_gateway (name, merchant_id, salt, base_url, api_url) VALUES 
('PayU testing', 'C0Dr8m', '3sf0jURk', 'https://test.payu.in/_payment', 'https://test.payu.in/merchant/postservice.php?form=2');

DROP TABLE IF EXISTS tr_action CASCADE ;
CREATE TABLE tr_action (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
INSERT INTO tr_action (name) VALUES 
('sent'),
('cancel'),
('refund'),
('capture');

DROP TABLE IF EXISTS tr_status CASCADE ;
CREATE TABLE tr_status (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
INSERT INTO tr_status (name) VALUES 
('new'),
('success'),
('failure'),
('pending');

DROP TABLE IF EXISTS pay_gate_log;
CREATE TABLE pay_gate_log (
  id SERIAL  NOT NULL ,
  status_id INTEGER NOT NULL DEFAULT 1   ,
  user_info_id INTEGER    ,
  action_id INTEGER   ,
  pg_id INTEGER   NOT NULL ,
  cc_id INTEGER    ,
  hash_our TEXT,
  hash_response TEXT,
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
  request_id INTEGER    ,
  updated timestamp without time zone  DEFAULT now()  ,
  note TEXT    ,
  user_ip TEXT    ,
  user_proxy TEXT    ,
  user_browser TEXT      ,
PRIMARY KEY(id)          ,
 FOREIGN KEY (cc_id) REFERENCES cc(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (pg_id) REFERENCES payment_gateway(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (action_id) REFERENCES tr_action(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (user_info_id) REFERENCES user_info(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (status_id) REFERENCES tr_status(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX pay_gate_log_FKIndex1 ON pay_gate_log (cc_id);
CREATE INDEX pay_gate_log_FKIndex2 ON pay_gate_log (pg_id);
CREATE INDEX pay_gate_log_FKIndex3 ON pay_gate_log (action_id);
CREATE INDEX pay_gate_log_FKIndex4 ON pay_gate_log (user_info_id);
CREATE INDEX pay_gate_log_FKIndex5 ON pay_gate_log (status_id);

-- 2014-Oct-03
ALTER TABLE cc ADD COLUMN hash TEXT;
CREATE INDEX cc_hash_idx ON cc(hash);
ALTER TABLE cc ALTER COLUMN code DROP NOT NULL;

-- 2014-Oct-05
CREATE TABLE cc_type (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  code TEXT   NOT NULL ,
  validator TEXT    ,
PRIMARY KEY(id));

INSERT INTO cc_type (name, code, validator) VALUES 
('MasterCard', 'CA', 'Mastercard'),
('AmericanExpress', 'AX', 'American_Express'),
('VISA', 'VI', 'Visa'),
('DinersClub', 'DC', 'Diners_Club');

ALTER TABLE cc ADD COLUMN type_id INTEGER NOT NULL DEFAULT 1;
ALTER TABLE cc ADD CONSTRAINT cc_type_id_fkey FOREIGN KEY (type_id) REFERENCES cc_type(id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX cc_type_id_fkey ON cc (type_id);


-- 2014-Oct-06
ALTER TABLE payment ADD COLUMN pay_gate_log_id INTEGER;
ALTER TABLE payment ADD CONSTRAINT payment_pay_gate_log_id_fkey FOREIGN KEY (pay_gate_log_id) REFERENCES pay_gate_log(id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX payment_pay_gate_log_id_fkey ON payment (pay_gate_log_id);


-- 2014-Oct-
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
  FOREIGN KEY (type_id) REFERENCES cc_type(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX bin_list_FKIndex1 ON bin_list (type_id);

INSERT INTO bin_list (bin, type_id, country_code, country_name, bank, card_type, latitude, longitude) VALUES
(431940, 3, 'IE' ,'Ireland', 'BANK OF IRELAND', 'DEBIT', '53', '-8'); 

INSERT INTO cc_type (name, code, validator) VALUES 
('Discover', 'DS', 'Discover'),
('Switch', 'SW', 'Switch');

ALTER TABLE cc ADD COLUMN bin_id INTEGER NOT NULL DEFAULT 431940;
ALTER TABLE cc ADD CONSTRAINT cc_bin_id_fkey FOREIGN KEY (bin_id) REFERENCES bin_list(bin) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX cc_bin_id_fkey ON cc (bin_id);

ALTER TABLE cc ADD COLUMN deleted SMALLINT DEFAULT 0 NOT NULL;


-- 2014-Oct-14
ALTER TABLE payment_gateway ADD COLUMN enc_key TEXT;
INSERT INTO payment_gateway (name, merchant_id, salt, enc_key, base_url, api_url) VALUES 
('TechProcess test', 'T1532', '6069653613TQNUWE', '6443991977SMSAOT', '', 'test');


-- 2014-Oct-16
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
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX credit_request_status_idx ON credit_request (status_id);
CREATE INDEX credit_request_FKIndex1 ON credit_request (creator_id);
CREATE INDEX credit_request_FKIndex2 ON credit_request (approver_id);

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
  FOREIGN KEY (payment_id) REFERENCES payment(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX deposit_search_status_idx ON deposit_search (status_id);
CREATE INDEX deposit_search_FKIndex1 ON deposit_search (payment_id);
CREATE INDEX deposit_search_FKIndex2 ON deposit_search (creator_id);
CREATE INDEX deposit_search_FKIndex3 ON deposit_search (approver_id);


-- 2014-Oct-21
INSERT INTO payment_gateway (name, merchant_id, salt, enc_key, base_url, api_url) VALUES 
('TechProcess live test', 'T1532', '1633760400KPCFEL', '4652810864VEXCXS', '', 'production');

-- 2014-Oct-22
INSERT INTO backend (name, search, book, hold, balance) VALUES 
('Airindia scrapper','components/llc_sites/airindia/airindia.php','','','components/llc_sites/airindia-balance-checker/airindia.php'),  -- components/llc_sites/airindia-booking/airindia.php
('Airasia scrapper','components/llc_sites/airasia/airasia.php','','','components/llc_sites/airasia-balance-checker/airasia.php'),   -- components/llc_sites/airasia-booking/airasia.php
('Flydubai scrapper','components/llc_sites/flydubai/flydubai.php','','','components/llc_sites/flydubai-balance-checker/flydubai.php');  -- components/llc_sites/flydubai-booking/flydubai.php

INSERT INTO air_source (id, name, credentials, config, username, password, tran_username, tran_password, office_id, iata_number, profile_pcc, domestic_pcc, int_pcc, spare1, spare2, spare3, url, proxy_ip, proxy_port, include_carriers, exclude_carriers, include_pass_carriers, exclude_pass_carriers, integration_type, queue_num, email_cancellation, supplier_verification, res_queue_amend, air_way_id, bta_pass, amex_pass, visa_pass, root_pass, master_pass, resync, auto_cancellation, fop, balance, backend_id) VALUES (36, 'Airindia scrapper - bel9658', NULL, '', 'bel9658', 'Belair@10', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13);
INSERT INTO air_source (id, name, credentials, config, username, password, tran_username, tran_password, office_id, iata_number, profile_pcc, domestic_pcc, int_pcc, spare1, spare2, spare3, url, proxy_ip, proxy_port, include_carriers, exclude_carriers, include_pass_carriers, exclude_pass_carriers, integration_type, queue_num, email_cancellation, supplier_verification, res_queue_amend, air_way_id, bta_pass, amex_pass, visa_pass, root_pass, master_pass, resync, auto_cancellation, fop, balance, backend_id) VALUES (37, 'Airasia scrapper - AIRTICKETS', NULL, '', 'AIRTICKETS', 'BELAIR12', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 443, 14);
INSERT INTO air_source (id, name, credentials, config, username, password, tran_username, tran_password, office_id, iata_number, profile_pcc, domestic_pcc, int_pcc, spare1, spare2, spare3, url, proxy_ip, proxy_port, include_carriers, exclude_carriers, include_pass_carriers, exclude_pass_carriers, integration_type, queue_num, email_cancellation, supplier_verification, res_queue_amend, air_way_id, bta_pass, amex_pass, visa_pass, root_pass, master_pass, resync, auto_cancellation, fop, balance, backend_id) VALUES (38, 'Flydubai scrapper - 9151...', NULL, '', '91514303belai', 'Belair@1234', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 228.960007, 15);
SELECT pg_catalog.setval('air_source_id_seq', 38, true);


-- 2014-Oct-27
ALTER TABLE air_source ADD COLUMN is_active SMALLINT DEFAULT 1;
ALTER TABLE air_booking ADD COLUMN other_tax REAL DEFAULT 0;

DROP TABLE searches;
CREATE TABLE searches (
  id SERIAL  NOT NULL ,
  user_id INTEGER   NOT NULL ,
  created timestamp without time zone  DEFAULT Now() NOT NULL ,
  origin TEXT   NOT NULL ,
  destination TEXT   NOT NULL ,
  type_id SMALLINT  DEFAULT 1 NOT NULL ,
  is_domestic SMALLINT   NOT NULL ,
  date_depart DATE   NOT NULL ,
  date_return DATE    ,
  adults SMALLINT  DEFAULT 1 NOT NULL ,
  children SMALLINT  DEFAULT 0 NOT NULL ,
  infants SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)  ,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE INDEX search_FKIndex1 ON searches (user_id);

DROP TABLE process;
CREATE TABLE process (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER    ,
  search_id INTEGER    ,
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
  FOREIGN KEY (search_id) REFERENCES searches(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id) REFERENCES air_source(id) ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE INDEX process_FKIndex1 ON process (search_id);
CREATE INDEX process_FKIndex2 ON process (air_source_id);


DROP TABLE routes_cache;
CREATE TABLE routes_cache (
  id SERIAL   NOT NULL ,
  destination_id INTEGER   NOT NULL ,
  origin_id INTEGER   NOT NULL ,
  search_id INTEGER   NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  traveler_type_id INTEGER   NOT NULL ,
  service_type_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  last_check timestamp without time zone  DEFAULT now() NOT NULL ,
  updated timestamp without time zone  DEFAULT now() NOT NULL ,
  departure_date DATE   NOT NULL ,
  departure_time TIME   NOT NULL ,
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
  booking_class TEXT  NOT NULL,
  flight_number TEXT  NOT NULL,
PRIMARY KEY(id)                  ,
 FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (air_source_id) REFERENCES air_source(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (service_type_id) REFERENCES service_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (traveler_type_id) REFERENCES traveler_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (search_id) REFERENCES searches(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (origin_id) REFERENCES airport(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 FOREIGN KEY (destination_id) REFERENCES airport(id) ON DELETE RESTRICT ON UPDATE CASCADE);

CREATE INDEX routes_cache_FKIndex1 ON routes_cache (carrier_id);
CREATE INDEX routes_cache_dep_date_idx ON routes_cache (departure_date);
CREATE UNIQUE INDEX routes_cache_unq_idx ON routes_cache (destination_id, origin_id, departure_date, departure_time, air_source_id, carrier_id, traveler_type_id, booking_class);
CREATE INDEX routes_cache_FKIndex4 ON routes_cache (air_source_id);
CREATE INDEX routes_cache_FKIndex5 ON routes_cache (service_type_id);
CREATE INDEX routes_cache_FKIndex6 ON routes_cache (traveler_type_id);
CREATE INDEX routes_cache_FKIndex7 ON routes_cache (search_id);
CREATE INDEX routes_cache_FKIndex8 ON routes_cache (origin_id);
CREATE INDEX routes_cache_FKIndex9 ON routes_cache (destination_id);

-- 2014-Oct-29
ALTER TABLE air_source DROP COLUMN domestic_pcc;
ALTER TABLE air_source DROP COLUMN int_pcc;
ALTER TABLE air_source ADD COLUMN type_id SMALLINT DEFAULT 1;
COMMENT ON COLUMN air_source.type_id IS '1=Domestic, 2=International, 3=Both';

-- 2014-Oct-30
ALTER TABLE process ADD COLUMN time_needed INTEGER ;
update process set time_needed=EXTRACT(EPOCH FROM (ended - started)) where ended is not null;

ALTER TABLE process ADD COLUMN memory INTEGER ;


-- 2014-Nov-02
ALTER TABLE  routes_cache DROP COLUMN search_id;

CREATE TABLE search_x_cache (
  cache_id INTEGER   NOT NULL ,
  search_id INTEGER   NOT NULL ,
  is_sent SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(cache_id, search_id)      ,
  FOREIGN KEY (search_id) REFERENCES searches(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (cache_id) REFERENCES routes_cache(id) ON DELETE CASCADE ON UPDATE CASCADE);
CREATE INDEX search_x_cache_FKIndex1 ON search_x_cache (search_id);
CREATE INDEX search_x_cache_FKIndex2 ON search_x_cache (cache_id);

-- 2014-Nov-03
ALTER TABLE searches ADD COLUMN category character;

-- 2014-Nov-04
ALTER TABLE routes_cache ADD COLUMN order_ smallint NOT NULL DEFAULT 11;
COMMENT ON COLUMN routes_cache.order_ IS '11 first of one, 12=first of two, 22=second of two ...';
ALTER TABLE routes_cache ADD COLUMN grouping bigint;
COMMENT ON COLUMN routes_cache.grouping IS 'How the cache results are grouped together';
CREATE SEQUENCE public.cache_group_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807;
COMMENT ON SEQUENCE public.cache_group_seq IS 'To group the cache results when we have more than 1 journey';

DROP INDEX routes_cache_unq_idx;
CREATE UNIQUE INDEX routes_cache_unq_idx ON routes_cache (destination_id, origin_id, departure_date, departure_time, air_source_id, carrier_id, traveler_type_id, booking_class, order_, arrival_date, arrival_time, grouping);
CREATE INDEX routes_cache_grouping_idx ON routes_cache (grouping);


-- 2014-Nov-10
ALTER TABLE routes_cache ADD COLUMN hash_str TEXT;
ALTER TABLE routes_cache ADD COLUMN hash_id bigint NOT NULL DEFAULT 0;
DROP INDEX routes_cache_unq_idx;
CREATE INDEX routes_cache_hash_idx ON routes_cache (hash_id);

-- 2014-Nov-11
ALTER TABLE routes_cache DROP COLUMN booking_class;

-- 2014-Nov-17
ALTER TABLE routes_cache ADD COLUMN cabin_type_id SMALLINT NOT NULL DEFAULT 1;
ALTER TABLE routes_cache ADD CONSTRAINT routes_cache_cabin_type_id_fkey
    FOREIGN KEY (cabin_type_id) REFERENCES cabin_type (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX routes_cache_cabin_type_id_fkey ON routes_cache (cabin_type_id);

-- 2014-Nov-20
INSERT INTO log_operation (name, is_reversible) VALUES
('Missing airline', false),
('Missing airport', false);

-- 2014-Nov-22
DROP TABLE commercial_x_rule;
DROP TABLE supplier;
DROP TABLE commercial;
DROP TABLE commercial_rule;

CREATE TABLE client_source (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL ,
  url TEXT    ,
  is_active SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)  );
CREATE UNIQUE INDEX supplier_name_idx ON client_source (name);
INSERT INTO client_source (name) VALUES
('Direct'),
('Skyscanner'),
('Kayak'),
('Ixigo');

CREATE TABLE commercial_plan (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));

CREATE TABLE commercial_rule (
  id SERIAL  NOT NULL ,
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
  di_rate_total FLOAT  DEFAULT 0 NOT NULL ,
  di_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  di_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
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
  markup_fix_per_journey SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (service_type_id) REFERENCES service_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (client_source_id) REFERENCES client_source(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX commercial_rule_FKIndex1 ON commercial_rule (carrier_id);
CREATE INDEX commercial_rule_FKIndex2 ON commercial_rule (service_type_id);
CREATE INDEX commercial_rule_FKIndex3 ON commercial_rule (client_source_id);

CREATE TABLE commercial_x_rule (
  plan_id INTEGER   NOT NULL ,
  rule_id INTEGER   NOT NULL   ,
PRIMARY KEY(plan_id, rule_id)    ,
  FOREIGN KEY (plan_id) REFERENCES commercial_plan(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (rule_id) REFERENCES commercial_rule(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX commercial_x_rule_FKIndex1 ON commercial_x_rule (plan_id);
CREATE INDEX commercial_x_rule_FKIndex2 ON commercial_x_rule (rule_id);

-- FK to the companies
ALTER TABLE user_info ADD COLUMN commercial_plan_id INTEGER;
ALTER TABLE user_info ADD CONSTRAINT user_info_commercial_plan_id_fkey FOREIGN KEY (commercial_plan_id) REFERENCES commercial_plan (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX user_info_commercial_plan_id_fkey ON user_info (commercial_plan_id);


-- 2014-Nov-25
ALTER TABLE commercial_x_rule DROP CONSTRAINT commercial_x_rule_rule_id_fkey;
ALTER TABLE commercial_x_rule ADD CONSTRAINT commercial_x_rule_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES commercial_rule (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE commercial_rule ADD COLUMN air_source_id INTEGER;
ALTER TABLE commercial_rule ADD CONSTRAINT commercial_rule_air_source_id_fkey FOREIGN KEY (air_source_id) REFERENCES air_source (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX commercial_rule_air_source_id_fkey ON commercial_rule (air_source_id);

-- 2014-Dec-01
ALTER TABLE commercial_rule DROP COLUMN di_rate_total;
ALTER TABLE commercial_rule DROP COLUMN di_rate_base;
ALTER TABLE commercial_rule DROP COLUMN di_rate_yq;
ALTER TABLE commercial_rule ADD COLUMN markup_added_to SMALLINT DEFAULT 1 NOT NULL;

-- 2014-Dec-05
ALTER TABLE air_booking ADD COLUMN commercial_rule_id INTEGER;

-- 2014-Dec-06
DROP TABLE IF EXISTS commision_rule;
CREATE TABLE commission_rule (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER    ,
  service_type_id INTEGER  ,
  carrier_id INTEGER    ,
  filter TEXT    ,
  iata_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  iata_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  plb_rate_base FLOAT  DEFAULT 0 NOT NULL ,
  plb_rate_yq FLOAT  DEFAULT 0 NOT NULL ,
  fix SMALLINT  DEFAULT 0 NOT NULL ,
  fix_per_journey SMALLINT  DEFAULT 0 NOT NULL ,
  order_ SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (service_type_id) REFERENCES service_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id) REFERENCES air_source(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX commission_rule_FKIndex1 ON commission_rule (carrier_id);
CREATE INDEX commission_rule_FKIndex2 ON commission_rule (service_type_id);
CREATE INDEX commission_rule_FKIndex3 ON commission_rule (air_source_id);

-- 2014-Dec-07
ALTER TABLE air_booking ADD COLUMN commersial_total_efect REAL DEFAULT 0;

-- 2014-Dec-12
UPDATE backend SET 
    pnr_book='\application\components\Spicejet\PnrManagement',
    pnr_resync='\ApiInterface::resyncPnr',
    pnr_cancel='\application\components\Spicejet\Utils::cancelPnr',
    pnr_list='\application\components\Spicejet\Utils::listPnr',
    pnr_acquisition='\application\components\Spicejet\Utils::aquirePnr',
    api_source='\application\components\Spicejet\PnrManagement',
    pnr_load='\application\components\Spicejet\PnrAcquisition'
WHERE id=3  -- Spicejet Production backend 
OR id=4;    -- Spicejet Test backend
UPDATE backend SET 
    pnr_book='\application\components\Indigo\PnrManagement',
    pnr_resync='\ApiInterface::resyncPnr',
    pnr_cancel='\application\components\Indigo\Utils::cancelPnr',
    pnr_list='\application\components\Indigo\Utils::listPnr',
    pnr_acquisition='\application\components\Indigo\Utils::aquirePnr',
    api_source='\application\components\Indigo\PnrManagement',
    pnr_load='\application\components\Indigo\PnrAcquisition'
WHERE id=1  -- Indigo Production backend 
OR id=2;    -- Indigo Test backend


-- 2014-Dec-28
CREATE TABLE aircart_file
(
  id serial NOT NULL,
  aircart_id integer NOT NULL,
  note TEXT,
  path text NOT NULL,
  name text,
  created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT aircart_file_pkey PRIMARY KEY (id),
  CONSTRAINT aircart_file_aircart_id_fkey FOREIGN KEY (aircart_id) REFERENCES air_cart (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX aircart_file_fkindex1 ON aircart_file USING btree (aircart_id);


-- 2015-Jan-03
ALTER TABLE air_source DROP COLUMN credentials,
DROP COLUMN config,
DROP COLUMN url,
DROP COLUMN proxy_ip,
DROP COLUMN proxy_port,
DROP COLUMN include_carriers,
DROP COLUMN exclude_pass_carriers,
DROP COLUMN integration_type,
DROP COLUMN email_cancellation,
DROP COLUMN supplier_verification,
DROP COLUMN res_queue_amend,
DROP COLUMN air_way_id,
DROP COLUMN resync,
DROP COLUMN auto_cancellation,
DROP COLUMN fop,
DROP COLUMN office_id;

DROP TABLE air_way;
ALTER TABLE air_source ADD COLUMN international_auto_ticket SMALLINT NOT NULL DEFAULT 0;
ALTER TABLE air_source ADD COLUMN domestic_auto_ticket SMALLINT NOT NULL DEFAULT 1;
ALTER TABLE air_source ADD COLUMN display_in_search SMALLINT NOT NULL DEFAULT 0;
ALTER TABLE air_source ADD COLUMN queue_to INTEGER;
ALTER TABLE air_source ADD COLUMN balance_link INTEGER;
ALTER TABLE air_source ADD CONSTRAINT air_source_queue_fkey FOREIGN KEY (queue_to) REFERENCES air_source (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE air_source ADD CONSTRAINT air_source_balance_fkey FOREIGN KEY (balance_link) REFERENCES air_source (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
COMMENT ON COLUMN air_source.queue_to IS 'Air source for ticket queing - GDS only';
COMMENT ON COLUMN air_source.balance_link IS 'From which scrapper to read the balance';

-- 2015-Jan-09
CREATE TABLE airsource_queue (
  id SERIAL  NOT NULL ,
  queue_to INTEGER   NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  queue_number SMALLINT  DEFAULT 1 NOT NULL ,
  type_id SMALLINT  DEFAULT 3 NOT NULL ,
  carriers TEXT  DEFAULT '*' NOT NULL ,
  auto_ticket SMALLINT  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (air_source_id) REFERENCES air_source(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (queue_to) REFERENCES air_source(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE INDEX airsource_queue_FKIndex1 ON airsource_queue (air_source_id);
CREATE INDEX airsource_queue_FKIndex2 ON airsource_queue (queue_to);

-- 2015-Jan-10
ALTER TABLE air_source DROP COLUMN queue_to;
ALTER TABLE air_source DROP COLUMN queue_num;

-- 2015-Jan-13
ALTER TABLE air_booking DROP COLUMN air_supplier_id;
DROP TABLE air_supplier;

-- 2015-Jan-14
ALTER TABLE backend ADD COLUMN city_pairs TEXT;
ALTER TABLE backend ADD COLUMN carrier_id INTEGER;
ALTER TABLE backend ADD CONSTRAINT backend_carrier_id_fkey FOREIGN KEY (carrier_id) REFERENCES carrier (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX backend_carrier_id_fkey ON backend (carrier_id);

UPDATE backend SET city_pairs='components/llc_sites/goindigo-airport/goindigo.php' WHERE id=11;
UPDATE backend SET city_pairs='components/llc_sites/spicejet-airport/spicejet.php' WHERE id=12;
UPDATE backend SET city_pairs='components/llc_sites/airindia-airport/airindia.php' WHERE id=13;
UPDATE backend SET city_pairs='components/llc_sites/airasia-airport/airasia.php' WHERE id=14;
UPDATE backend SET city_pairs='components/llc_sites/flydubai-airport/flydubai.php' WHERE id=15;
UPDATE backend SET carrier_id=(select id from carrier where code='6E') WHERE id IN (11, 1, 2);
UPDATE backend SET carrier_id=(select id from carrier where code='SG') WHERE id IN (12, 3, 4);
UPDATE backend SET carrier_id=(select id from carrier where code='AI') WHERE id IN (13);
UPDATE backend SET carrier_id=(select id from carrier where code='AK') WHERE id IN (14);
UPDATE backend SET carrier_id=(select id from carrier where code='FZ') WHERE id IN (15);
UPDATE backend SET carrier_id=(select id from carrier where code='G8') WHERE id IN (9, 10);

-- 2015-Jan-18
ALTER TABLE payment_gateway ADD COLUMN username TEXT;
ALTER TABLE payment_gateway ADD COLUMN password TEXT;
ALTER TABLE payment_gateway ADD COLUMN access_code TEXT;
UPDATE payment_gateway SET username='airtkt', password='1password', access_code='0B3C0E67' WHERE ID=8;

-- 2015-Jan-27
ALTER TABLE payment ADD COLUMN air_cart_id INTEGER;
ALTER TABLE payment ADD CONSTRAINT payment_air_cart_id_fkey FOREIGN KEY (air_cart_id) REFERENCES air_cart (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;
CREATE INDEX payment_air_cart_id_idx ON payment (air_cart_id);
ALTER TABLE pay_gate_log ADD COLUMN air_cart_id INTEGER;
ALTER TABLE pay_gate_log ADD CONSTRAINT pay_gate_log_air_cart_id_fkey FOREIGN KEY (air_cart_id) REFERENCES air_cart (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;
CREATE INDEX pay_gate_log_air_cart_id_idx ON pay_gate_log (air_cart_id);

update payment p set air_cart_id = (select id from air_cart  where payment_id  = p.id limit 1);


-- 2015-Feb-02
ALTER TABLE client_source ADD COLUMN username TEXT;
ALTER TABLE client_source ADD COLUMN password TEXT;
ALTER TABLE client_source ADD COLUMN officeid TEXT;
ALTER TABLE client_source ADD COLUMN component TEXT;
update client_source SET username = 'SkyScanner', password='skyTest854', officeid='SKYSC', component='Deeplink' WHERE id=2;


-- 2015-Feb-15
CREATE TABLE rc_transform_log (
  id SERIAL  NOT NULL ,
  rc_id INTEGER   NOT NULL ,
  total_fare INTEGER   NOT NULL ,
  hash_str TEXT   NOT NULL ,
  created timestamp without time zone  DEFAULT now() NOT NULL   ,
PRIMARY KEY(id));

ALTER TABLE searches DROP COLUMN category;
ALTER TABLE searches ADD COLUMN category smallint DEFAULT 1;

-- 2015-Feb-16
ALTER TABLE air_booking ALTER COLUMN booking_class TYPE character(2);

-- 2015-Feb-18
CREATE TABLE fraud (
  id SERIAL  NOT NULL ,
  air_cart_id INTEGER    ,
  cc_id INTEGER    ,
  ip TEXT    ,
  email TEXT    ,
  phone TEXT    ,
  created timestamp without time zone  DEFAULT now() NOT NULL   ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (cc_id) REFERENCES cc(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (air_cart_id) REFERENCES air_cart(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX fraud_FKIndex1 ON fraud (cc_id);
CREATE INDEX fraud_FKIndex2 ON fraud (air_cart_id);

-- 2015-Mar-19
DROP TABLE fraud;
CREATE TABLE fraud (
  id SERIAL  NOT NULL ,
  pay_gate_log_id INTEGER ,
  cc_id INTEGER    ,
  ip TEXT    ,
  email TEXT    ,
  phone TEXT    ,
  created timestamp without time zone  DEFAULT now() NOT NULL   ,
PRIMARY KEY(id)    ,
  FOREIGN KEY (cc_id) REFERENCES cc(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (pay_gate_log_id) REFERENCES pay_gate_log(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX fraud_FKIndex1 ON fraud (cc_id);
CREATE INDEX fraud_FKIndex2 ON fraud (pay_gate_log_id);

-- 2015-Feb-22
ALTER TABLE air_cart ADD COLUMN client_source_id INTEGER DEFAULT 1;
ALTER TABLE air_cart ADD CONSTRAINT air_cart_client_source_id_fkey FOREIGN KEY (client_source_id) REFERENCES client_source (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_cart_client_source_id_idx ON air_cart (client_source_id);

-- 2015-Mar-04
ALTER TABLE cc ADD COLUMN status_3d SMALLINT;

-- 2015-Mar-08
ALTER TABLE pay_gate_log ADD COLUMN status_3d SMALLINT;

-- 2015-Mar-10
UPDATE backend SET wsdl_file='production' WHERE id=7;
UPDATE backend SET wsdl_file='test' WHERE id=8;

-- 2015-Mar-11
ALTER TABLE users ADD COLUMN b2b_api SMALLINT DEFAULT 0 NOT NULL;

-- 2015-Mar-25
ALTER TABLE pay_gate_log ADD COLUMN callback text;

-- 2015-Apr-02
ALTER TABLE payment ALTER COLUMN new_balance TYPE double precision;
ALTER TABLE payment ALTER COLUMN old_balance TYPE double precision;
ALTER TABLE payment ALTER COLUMN amount TYPE double precision;
ALTER TABLE user_info ALTER COLUMN balance TYPE double precision;
ALTER TABLE user_info ALTER COLUMN credit_limit TYPE double precision;

-- 2015-Apr-27
ALTER TABLE searches ADD COLUMN client_source_id INTEGER NOT NULL DEFAULT 1;
ALTER TABLE searches ADD CONSTRAINT searches_client_source_id_fkey FOREIGN KEY (client_source_id) REFERENCES client_source (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;
CREATE INDEX searches_client_source_id_idx ON searches (client_source_id);

-- 2015-May-04
DROP VIEW IF EXISTS v_sales_by_year;
CREATE OR REPLACE VIEW v_sales_by_year AS 
SELECT 
	user_info.id AS user_info_id, 
	EXTRACT(year from ac.created)::int2 AS year_, 
	SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::int8 AS total_fare
FROM "air_cart" "ac"
JOIN "air_booking" "ab" ON ac.id=ab.air_cart_id
JOIN "users" ON users.id=ac.user_id
JOIN "user_info" ON users.user_info_id=user_info.id
GROUP BY 1,2
ORDER BY 1,2;

DROP VIEW IF EXISTS v_sales_by_month;
CREATE VIEW v_sales_by_month AS 
SELECT 
	user_info.id AS user_info_id, 
	EXTRACT(isoyear from ac.created)::int2 AS year_,
        EXTRACT(month from ac.created)::int2  AS month_, 
        COUNT(ab.id) AS segments,
	SUM(ab.basic_fare)::int8 AS basic_fare,
	SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::int8 AS total_fare
FROM "air_cart" "ac"
JOIN "air_booking" "ab" ON ac.id=ab.air_cart_id
JOIN "users" ON users.id=ac.user_id
JOIN "user_info" ON users.user_info_id=user_info.id
GROUP BY 1,2,3
ORDER BY 1,2,3;

DROP VIEW  IF EXISTS v_sales_by_week;
CREATE VIEW v_sales_by_week AS 
SELECT 
	user_info.id AS user_info_id, 
	EXTRACT(isoyear from ac.created)::int2 AS year_,
        EXTRACT(week from ac.created)::int2  AS week_, 
        COUNT(ab.id) AS segments,
	SUM(ab.basic_fare)::int8 AS basic_fare,
	SUM(ab.fuel_surcharge+ab.udf_charge+ab.jn_tax+ab.other_tax+ab.basic_fare+ab.booking_fee-ab.commission_or_discount_gross)::int8 AS total_fare
FROM "air_cart" "ac"
JOIN "air_booking" "ab" ON ac.id=ab.air_cart_id
JOIN "users" ON users.id=ac.user_id
JOIN "user_info" ON users.user_info_id=user_info.id
GROUP BY 1,2,3
ORDER BY 1,2,3;

DROP VIEW  IF EXISTS v_generated_week_periods_by_userinfoid;
CREATE VIEW v_generated_week_periods_by_userinfoid AS 
SELECT user_info.id user_info_id, 
        generate_series(min(ac.created)-'2 days'::interval, max(ac.created)+'3 days'::interval, '1 week') date_,
        extract('isoyear' from generate_series(min(ac.created)-'2 days'::interval, max(ac.created)+'3 days'::interval, '1 week'))::int2 year_,
        extract('week' from generate_series(min(ac.created)-'2 days'::interval, max(ac.created)+'3 days'::interval, '1 week'))::int2 week_
FROM air_cart ac
JOIN users ON users.id = ac.user_id
JOIN user_info ON users.user_info_id = user_info.id
GROUP BY 1;

DROP VIEW  IF EXISTS v_generated_month_periods_by_userinfoid;
CREATE VIEW v_generated_month_periods_by_userinfoid AS 
SELECT user_info.id user_info_id, 
        generate_series(min(ac.created), max(ac.created)+'25 days'::interval, '1 month') date_,
        extract('isoyear' from generate_series(min(ac.created), max(ac.created)+'25 days'::interval, '1 month'))::int2 year_,
        extract('month' from generate_series(min(ac.created), max(ac.created)+'25 days'::interval, '1 month'))::int2 month_
FROM air_cart ac
JOIN users ON users.id = ac.user_id
JOIN user_info ON users.user_info_id = user_info.id
GROUP BY 1;

-- 2015-May-05
INSERT INTO "public".payment_gateway ("name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) 
	VALUES ('HDFC test', NULL, '14455', '9001955', 'https://securepgtest.fssnet.co.in/pgway/servlet/MPIVerifyEnrollmentXMLServlet', 1, 'https://securepgtest.fssnet.co.in/pgway/servlet/TranPortalXMLServlet', NULL, 'hdfc', 'password1234', 'https://securepgtest.fssnet.co.in/pgway/servlet/MPIPayerAuthenticationXMLServlet');
ALTER TABLE cc DROP COLUMN code;

-- 2015-May-10
INSERT INTO "public".payment_gateway ("name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) 
	VALUES ('HDFC production', NULL, '14455', '9001955', 'https://securepgtest.fssnet.co.in/pgway/servlet/MPIVerifyEnrollmentXMLServlet', 0, 'https://securepgtest.fssnet.co.in/pgway/servlet/TranPortalXMLServlet', NULL, 'hdfc', 'password1234', 'https://securepgtest.fssnet.co.in/pgway/servlet/MPIPayerAuthenticationXMLServlet');
INSERT INTO "public".payment_gateway ("name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) 
	VALUES ('Zooz Test', NULL, 'TravelPlatform', 'c3b43232-1702-40a9-b888-a40b37533b61', 'https://sandbox.zooz.co/mobile/ZooZPaymentAPI', 1, '', NULL, '', '', '');
INSERT INTO "public".payment_gateway ("name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) 
	VALUES ('Zooz Production', NULL, 'TravelPlatform', 'c3b43232-1702-40a9-b888-a40b37533b61', 'https://app.zooz.com/mobile/ZooZPaymentAPI', 0, '', NULL, '', '', '');


-- 2015-May-11
ALTER TABLE currency ALTER COLUMN name DROP NOT NULL;
ALTER TABLE currency ADD COLUMN rate double precision;
ALTER TABLE currency ADD COLUMN updated timestamp with time zone;
CREATE TABLE x_rate (
  updated timestamp with time zone   NOT NULL ,
  content TEXT   NOT NULL   ,
PRIMARY KEY(updated));

-- 2015-May-12
INSERT INTO "public".currency (code, "name", sign) VALUES 
    ('GBP', '£ British pound', '<i class="fa fa-gbp fa-lg"></i>'),
    ('AUD', '$ Australian dollar', '<i class="fa fa-usd fa-lg"></i>'),
    ('JPY', '¥ Japanese yen', '<i class="fa fa-jpy fa-lg"></i>'),
    ('CAD', '$ Canadian dollar', '<i class="fa fa-usd fa-lg"></i>'),
    ('RUB', '₽ Russian ruble', '<i class="fa fa-rub fa-lg"></i>'),
    ('AED', null, null),
    ('AMD', null, null),
    ('BRL', null, null),
    ('CHF', null, null),
    ('CNY', null, null),
    ('CZK', null, null),
    ('DKK', null, null),
    ('HKD', null, null),
    ('HUF', null, null),
    ('IDR', null, null),
    ('ISK', null, null),
    ('KGS', null, null),
    ('KRW', null, null),
    ('KZT', null, null),
    ('MYR', null, null),
    ('MXN', null, null),
    ('NOK', null, null),
    ('NZD', null, null),
    ('PHP', null, null),
    ('PLN', null, null),
    ('RON', null, null),
    ('RSD', null, null),
    ('SAR', null, null),
    ('SEK', null, null),
    ('SGD', null, null),
    ('THB', null, null),
    ('TRY', null, null),
    ('TWD', null, null),
    ('UAH', null, null),
    ('UZS', null, null);

ALTER TABLE pay_gate_log ADD COLUMN currency_id INTEGER NOT NULL DEFAULT 1;
ALTER TABLE pay_gate_log ADD CONSTRAINT pay_gate_log_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES currency (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX pay_gate_log_currency_id_idx ON pay_gate_log (currency_id);

ALTER TABLE air_source ADD COLUMN currency_id INTEGER NOT NULL DEFAULT 1;
ALTER TABLE air_source ADD CONSTRAINT air_source_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES currency (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_source_currency_id_idx ON air_source (currency_id);

-- 2015-May-13
ALTER TABLE pay_gate_log ADD COLUMN original_currency_id INTEGER;
ALTER TABLE pay_gate_log ADD CONSTRAINT pay_gate_log_original_currency_id_fkey FOREIGN KEY (original_currency_id) REFERENCES currency (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX pay_gate_log_original_currency_id_idx ON pay_gate_log (original_currency_id);

ALTER TABLE pay_gate_log ADD COLUMN original_amount REAL;
ALTER TABLE pay_gate_log ADD COLUMN original_convince_fee REAL;

-- 2015-May-18
ALTER TABLE payment ADD COLUMN xchange_rate REAL DEFAULT 1;
COMMENT ON COLUMN payment.xchange_rate IS 'The xchange rate is the relation accounting currency / payment or airCart currency';

-- 2015-May-19
ALTER TABLE user_info ADD COLUMN xrate_commission REAL DEFAULT 1;
COMMENT ON COLUMN user_info.xrate_commission IS 'The xchange rate commission in percentage';

-- 2015-May-25
ALTER TABLE air_source 
DROP COLUMN bta_pass, 
DROP COLUMN amex_pass, 
DROP COLUMN visa_pass, 
DROP COLUMN root_pass, 
DROP COLUMN master_pass;

-- 2015-May-27
DROP TABLE pf_code;
CREATE TABLE pf_code (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  user_info_id INTEGER    ,
  code TEXT   NOT NULL ,
  scope SMALLINT  DEFAULT 1 NOT NULL   ,    -- 1-Single user, 2-B2C, 3-B2B, 4-B2E, 5-All
PRIMARY KEY(id)      ,
  FOREIGN KEY (user_info_id) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id) REFERENCES air_source(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX pf_code_FKIndex1 ON pf_code (user_info_id);
CREATE INDEX pf_code_FKIndex2 ON pf_code (carrier_id);
CREATE INDEX pf_code_FKIndex3 ON pf_code (air_source_id);

DROP TABLE tour_code;
CREATE TABLE tour_code (
  id SERIAL  NOT NULL ,
  air_source_id INTEGER   NOT NULL ,
  user_info_id INTEGER    ,
  carrier_id INTEGER   NOT NULL ,
  code TEXT   NOT NULL ,
  scope SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (user_info_id) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (air_source_id) REFERENCES air_source(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX tour_code_FKIndex1 ON tour_code (user_info_id);
CREATE INDEX tour_code_FKIndex2 ON tour_code (carrier_id);
CREATE INDEX tour_code_FKIndex3 ON tour_code (air_source_id);

-- 2015-May-29
DROP TABLE cart_x_notes;

-- 2015-June-01
CREATE TABLE cc_passtru (
  id SERIAL  NOT NULL ,
  carrier_id INTEGER   NOT NULL ,
  cc_id INTEGER   NOT NULL ,
  user_info_id INTEGER    ,
  scope SMALLINT  DEFAULT 1 NOT NULL   ,
PRIMARY KEY(id)      ,
  FOREIGN KEY (user_info_id) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (cc_id) REFERENCES cc(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE ON UPDATE CASCADE
);
COMMENT ON COLUMN cc_passtru.scope IS '1-Client pt, 2-All B2C, 3-All B2B, 4-All B2E, 5-All';
CREATE INDEX cc_passtru_FKIndex1 ON cc_passtru (user_info_id);
CREATE INDEX cc_passtru_FKIndex2 ON cc_passtru (cc_id);
CREATE INDEX cc_passtru_FKIndex3 ON cc_passtru (carrier_id);

DROP table type_x_task;

-- 2015-June-20
ALTER TABLE users DROP COLUMN cost_center;
ALTER TABLE air_booking ADD COLUMN cost_center TEXT;

-- 2015-June-22
ALTER TABLE searches ADD COLUMN hits INTEGER DEFAULT 0;

-- 2015-June-27
CREATE TABLE cms (
  type_id INTEGER  DEFAULT 1 NOT NULL ,
  user_info_id INTEGER   NOT NULL ,
  content TEXT   NOT NULL   ,
PRIMARY KEY(type_id, user_info_id)  ,
  FOREIGN KEY (user_info_id) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX cms_FKIndex1 ON cms (user_info_id); 


-- 2015-July-19
ALTER TABLE user_info ALTER COLUMN city_id SET DEFAULT 1000021;
UPDATE user_info SET city_id=1000021 WHERE city_id IS NULL;
ALTER TABLE user_info ALTER COLUMN city_id SET NOT NULL;

-- 2015-July-20
ALTER TABLE air_routes DROP CONSTRAINT air_routes_air_booking_id_fkey;
ALTER TABLE air_routes
  ADD CONSTRAINT air_routes_air_booking_id_fkey FOREIGN KEY (air_booking_id)
      REFERENCES air_booking (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;

-- 2015-July-23
DROP TABLE air_markup;


-- 2015-July-24
alter table country add column phonecode character varying(6);
UPDATE country SET phonecode = '+213' WHERE code='DZ';
UPDATE country SET phonecode = '+244' WHERE code='AO';
UPDATE country SET phonecode = '+1 264' WHERE code='AI';
UPDATE country SET phonecode = '+672' WHERE code='AQ';
UPDATE country SET phonecode = '+1268' WHERE code='AG';
UPDATE country SET phonecode = '+54' WHERE code='AR';
UPDATE country SET phonecode = '+374' WHERE code='AM';
UPDATE country SET phonecode = '+297' WHERE code='AW';
UPDATE country SET phonecode = '+43' WHERE code='AT';
UPDATE country SET phonecode = '+994' WHERE code='AZ';
UPDATE country SET phonecode = '+1 242' WHERE code='BS';
UPDATE country SET phonecode = '+973' WHERE code='BH';
UPDATE country SET phonecode = '+1 246' WHERE code='BB';
UPDATE country SET phonecode = '+375' WHERE code='BY';
UPDATE country SET phonecode = '+32' WHERE code='BE';
UPDATE country SET phonecode = '+501' WHERE code='BZ';
UPDATE country SET phonecode = '+229' WHERE code='BJ';
UPDATE country SET phonecode = '+1 441' WHERE code='BM';
UPDATE country SET phonecode = '+591' WHERE code='BO';
UPDATE country SET phonecode = '+387' WHERE code='BA';
UPDATE country SET phonecode = '+267' WHERE code='BW';
UPDATE country SET phonecode = '+55' WHERE code='BR';
UPDATE country SET phonecode = '+673' WHERE code='BN';
UPDATE country SET phonecode = '+359' WHERE code='BG';
UPDATE country SET phonecode = '+226' WHERE code='BF';
UPDATE country SET phonecode = '+257' WHERE code='BI';
UPDATE country SET phonecode = '+855' WHERE code='KH';
UPDATE country SET phonecode = '+237' WHERE code='CM';
UPDATE country SET phonecode = '+1' WHERE code='CA';
UPDATE country SET phonecode = '+238' WHERE code='CV';
UPDATE country SET phonecode = '+236' WHERE code='CF';
UPDATE country SET phonecode = '+235' WHERE code='TD';
UPDATE country SET phonecode = '+56' WHERE code='CL';
UPDATE country SET phonecode = '+86' WHERE code='CN';
UPDATE country SET phonecode = '+61' WHERE code='CX';
UPDATE country SET phonecode = '+61' WHERE code='CC';
UPDATE country SET phonecode = '+57' WHERE code='CO';
UPDATE country SET phonecode = '+242' WHERE code='CG';
UPDATE country SET phonecode = '+243' WHERE code='CD';
UPDATE country SET phonecode = '+682' WHERE code='CK';
UPDATE country SET phonecode = '+506' WHERE code='CR';
UPDATE country SET phonecode = '+225' WHERE code='CI';
UPDATE country SET phonecode = '+385' WHERE code='HR';
UPDATE country SET phonecode = '+53' WHERE code='CU';
UPDATE country SET phonecode = '+357' WHERE code='CY';
UPDATE country SET phonecode = '+420' WHERE code='CZ';
UPDATE country SET phonecode = '+253' WHERE code='DJ';
UPDATE country SET phonecode = '+1 767' WHERE code='DM';
UPDATE country SET phonecode = '+593' WHERE code='EC';
UPDATE country SET phonecode = '+20' WHERE code='EG';
UPDATE country SET phonecode = '+503' WHERE code='SV';
UPDATE country SET phonecode = '+240' WHERE code='GQ';
UPDATE country SET phonecode = '+291' WHERE code='ER';
UPDATE country SET phonecode = '+372' WHERE code='EE';
UPDATE country SET phonecode = '+251' WHERE code='ET';
UPDATE country SET phonecode = '+298' WHERE code='FO';
UPDATE country SET phonecode = '+679' WHERE code='FJ';
UPDATE country SET phonecode = '+358' WHERE code='FI';
UPDATE country SET phonecode = '+33' WHERE code='FR';
UPDATE country SET phonecode = '+594' WHERE code='GF';
UPDATE country SET phonecode = '+689' WHERE code='PF';
UPDATE country SET phonecode = '+241' WHERE code='GA';
UPDATE country SET phonecode = '+220' WHERE code='GM';
UPDATE country SET phonecode = '+995' WHERE code='GE';
UPDATE country SET phonecode = '+233' WHERE code='GH';
UPDATE country SET phonecode = '+350' WHERE code='GI';
UPDATE country SET phonecode = '+30' WHERE code='GR';
UPDATE country SET phonecode = '+299' WHERE code='GL';
UPDATE country SET phonecode = '+1 473' WHERE code='GD';
UPDATE country SET phonecode = '+590' WHERE code='GP';
UPDATE country SET phonecode = '+1 671' WHERE code='GU';
UPDATE country SET phonecode = '+44' WHERE code='GG';
UPDATE country SET phonecode = '+224' WHERE code='GN';
UPDATE country SET phonecode = '+245' WHERE code='GW';
UPDATE country SET phonecode = '+595' WHERE code='GY';
UPDATE country SET phonecode = '+509' WHERE code='HT';
UPDATE country SET phonecode = '+504' WHERE code='HN';
UPDATE country SET phonecode = '+852' WHERE code='HK';
UPDATE country SET phonecode = '+354' WHERE code='IS';
UPDATE country SET phonecode = '+91' WHERE code='IN';
UPDATE country SET phonecode = '+62' WHERE code='ID';
UPDATE country SET phonecode = '+98' WHERE code='IR';
UPDATE country SET phonecode = '+964' WHERE code='IQ';
UPDATE country SET phonecode = '+353' WHERE code='IE';
UPDATE country SET phonecode = '+972' WHERE code='IL';
UPDATE country SET phonecode = '+39' WHERE code='IT';
UPDATE country SET phonecode = '+1 876' WHERE code='JM';
UPDATE country SET phonecode = '+81' WHERE code='JP';
UPDATE country SET phonecode = '+44' WHERE code='JE';
UPDATE country SET phonecode = '+962' WHERE code='JO';
UPDATE country SET phonecode = '+7 7' WHERE code='KZ';
UPDATE country SET phonecode = '+254' WHERE code='KE';
UPDATE country SET phonecode = '+686' WHERE code='KI';
UPDATE country SET phonecode = '+82' WHERE code='KR';
UPDATE country SET phonecode = '+965' WHERE code='KW';
UPDATE country SET phonecode = '+996' WHERE code='KG';
UPDATE country SET phonecode = '+856' WHERE code='LA';
UPDATE country SET phonecode = '+371' WHERE code='LV';
UPDATE country SET phonecode = '+961' WHERE code='LB';
UPDATE country SET phonecode = '+266' WHERE code='LS';
UPDATE country SET phonecode = '+231' WHERE code='LR';
UPDATE country SET phonecode = '+218' WHERE code='LY';
UPDATE country SET phonecode = '+423' WHERE code='LI';
UPDATE country SET phonecode = '+370' WHERE code='LT';
UPDATE country SET phonecode = '+853' WHERE code='MO';
UPDATE country SET phonecode = '+389' WHERE code='MK';
UPDATE country SET phonecode = '+261' WHERE code='MG';
UPDATE country SET phonecode = '+265' WHERE code='MW';
UPDATE country SET phonecode = '+60' WHERE code='MY';
UPDATE country SET phonecode = '+960' WHERE code='MV';
UPDATE country SET phonecode = '+223' WHERE code='ML';
UPDATE country SET phonecode = '+356' WHERE code='MT';
UPDATE country SET phonecode = '+596' WHERE code='MQ';
UPDATE country SET phonecode = '+222' WHERE code='MR';
UPDATE country SET phonecode = '+230' WHERE code='MU';
UPDATE country SET phonecode = '+262' WHERE code='YT';
UPDATE country SET phonecode = '+52' WHERE code='MX';
UPDATE country SET phonecode = '+691' WHERE code='FM';
UPDATE country SET phonecode = '+373' WHERE code='MD';
UPDATE country SET phonecode = '+377' WHERE code='MC';
UPDATE country SET phonecode = '+382' WHERE code='ME';
UPDATE country SET phonecode = '+269' WHERE code='KM';
UPDATE country SET phonecode = '+44' WHERE code='IM';
UPDATE country SET phonecode = '+872' WHERE code='PN';
UPDATE country SET phonecode = '+48' WHERE code='PL';
UPDATE country SET phonecode = '+351' WHERE code='PT';
UPDATE country SET phonecode = '+1 939' WHERE code='PR';
UPDATE country SET phonecode = '+974' WHERE code='QA';
UPDATE country SET phonecode = '+40' WHERE code='RO';
UPDATE country SET phonecode = '+7' WHERE code='RU';
UPDATE country SET phonecode = '+250' WHERE code='RW';
UPDATE country SET phonecode = '+262' WHERE code='RE';
UPDATE country SET phonecode = '+590' WHERE code='BL';
UPDATE country SET phonecode = '+290' WHERE code='SH';
UPDATE country SET phonecode = '+1 869' WHERE code='KN';
UPDATE country SET phonecode = '+1 758' WHERE code='LC';
UPDATE country SET phonecode = '+590' WHERE code='MF';
UPDATE country SET phonecode = '+508' WHERE code='PM';
UPDATE country SET phonecode = '+1 784' WHERE code='VC';
UPDATE country SET phonecode = '+685' WHERE code='WS';
UPDATE country SET phonecode = '+378' WHERE code='SM';
UPDATE country SET phonecode = '+239' WHERE code='ST';
UPDATE country SET phonecode = '+966' WHERE code='SA';
UPDATE country SET phonecode = '+221' WHERE code='SN';
UPDATE country SET phonecode = '+381' WHERE code='RS';
UPDATE country SET phonecode = '+248' WHERE code='SC';
UPDATE country SET phonecode = '+232' WHERE code='SL';
UPDATE country SET phonecode = '+65' WHERE code='SG';
UPDATE country SET phonecode = '+421' WHERE code='SK';
UPDATE country SET phonecode = '+386' WHERE code='SI';
UPDATE country SET phonecode = '+677' WHERE code='SB';
UPDATE country SET phonecode = '+252' WHERE code='SO';
UPDATE country SET phonecode = '+27' WHERE code='ZA';
UPDATE country SET phonecode = '+500' WHERE code='GS';
UPDATE country SET phonecode = '+34' WHERE code='ES';
UPDATE country SET phonecode = '+94' WHERE code='LK';
UPDATE country SET phonecode = '+249' WHERE code='SD';
UPDATE country SET phonecode = '+597' WHERE code='SR';
UPDATE country SET phonecode = '+47' WHERE code='SJ';
UPDATE country SET phonecode = '+268' WHERE code='SZ';
UPDATE country SET phonecode = '+46' WHERE code='SE';
UPDATE country SET phonecode = '+41' WHERE code='CH';
UPDATE country SET phonecode = '+963' WHERE code='SY';
UPDATE country SET phonecode = '+886' WHERE code='TW';
UPDATE country SET phonecode = '+992' WHERE code='TJ';
UPDATE country SET phonecode = '+255' WHERE code='TZ';
UPDATE country SET phonecode = '+66' WHERE code='TH';
UPDATE country SET phonecode = '+670' WHERE code='TL';
UPDATE country SET phonecode = '+228' WHERE code='TG';
UPDATE country SET phonecode = '+690' WHERE code='TK';
UPDATE country SET phonecode = '+676' WHERE code='TO';
UPDATE country SET phonecode = '+1 868' WHERE code='TT';
UPDATE country SET phonecode = '+216' WHERE code='TN';
UPDATE country SET phonecode = '+90' WHERE code='TR';
UPDATE country SET phonecode = '+993' WHERE code='TM';
UPDATE country SET phonecode = '+1 649' WHERE code='TC';
UPDATE country SET phonecode = '+688' WHERE code='TV';
UPDATE country SET phonecode = '+256' WHERE code='UG';
UPDATE country SET phonecode = '+380' WHERE code='UA';
UPDATE country SET phonecode = '+971' WHERE code='AE';
UPDATE country SET phonecode = '+44' WHERE code='GB';
UPDATE country SET phonecode = '+1' WHERE code='US';
UPDATE country SET phonecode = '+598' WHERE code='UY';
UPDATE country SET phonecode = '+998' WHERE code='UZ';
UPDATE country SET phonecode = '+678' WHERE code='VU';
UPDATE country SET phonecode = '+58' WHERE code='VE';
UPDATE country SET phonecode = '+84' WHERE code='VN';
UPDATE country SET phonecode = '+1 284' WHERE code='VG';
UPDATE country SET phonecode = '+1 340' WHERE code='VI';
UPDATE country SET phonecode = '+681' WHERE code='WF';
UPDATE country SET phonecode = '+967' WHERE code='YE';
UPDATE country SET phonecode = '+260' WHERE code='ZM';
UPDATE country SET phonecode = '+263' WHERE code='ZW';
UPDATE country SET phonecode = '+358' WHERE code='AX';
UPDATE country SET phonecode = '+93' WHERE code='AF';
UPDATE country SET phonecode = '+355' WHERE code='AL';
UPDATE country SET phonecode = '+1 684' WHERE code='AS';
UPDATE country SET phonecode = '+376' WHERE code='AD';
UPDATE country SET phonecode = '+61' WHERE code='AU';
UPDATE country SET phonecode = '+880' WHERE code='BD';
UPDATE country SET phonecode = '+975' WHERE code='BT';
UPDATE country SET phonecode = '+246' WHERE code='IO';
UPDATE country SET phonecode = '+ 345' WHERE code='KY';
UPDATE country SET phonecode = '+45' WHERE code='DK';
UPDATE country SET phonecode = '+1 849' WHERE code='DO';
UPDATE country SET phonecode = '+500' WHERE code='FK';
UPDATE country SET phonecode = '+49' WHERE code='DE';
UPDATE country SET phonecode = '+502' WHERE code='GT';
UPDATE country SET phonecode = '+379' WHERE code='VA';
UPDATE country SET phonecode = '+36' WHERE code='HU';
UPDATE country SET phonecode = '+850' WHERE code='KP';
UPDATE country SET phonecode = '+352' WHERE code='LU';
UPDATE country SET phonecode = '+692' WHERE code='MH';
UPDATE country SET phonecode = '+976' WHERE code='MN';
UPDATE country SET phonecode = '+1664' WHERE code='MS';
UPDATE country SET phonecode = '+212' WHERE code='MA';
UPDATE country SET phonecode = '+258' WHERE code='MZ';
UPDATE country SET phonecode = '+95' WHERE code='MM';
UPDATE country SET phonecode = '+264' WHERE code='NA';
UPDATE country SET phonecode = '+674' WHERE code='NR';
UPDATE country SET phonecode = '+977' WHERE code='NP';
UPDATE country SET phonecode = '+31' WHERE code='NL';
UPDATE country SET phonecode = '+599' WHERE code='AN';
UPDATE country SET phonecode = '+687' WHERE code='NC';
UPDATE country SET phonecode = '+64' WHERE code='NZ';
UPDATE country SET phonecode = '+505' WHERE code='NI';
UPDATE country SET phonecode = '+227' WHERE code='NE';
UPDATE country SET phonecode = '+234' WHERE code='NG';
UPDATE country SET phonecode = '+683' WHERE code='NU';
UPDATE country SET phonecode = '+672' WHERE code='NF';
UPDATE country SET phonecode = '+1 670' WHERE code='MP';
UPDATE country SET phonecode = '+47' WHERE code='NO';
UPDATE country SET phonecode = '+968' WHERE code='OM';
UPDATE country SET phonecode = '+92' WHERE code='PK';
UPDATE country SET phonecode = '+680' WHERE code='PW';
UPDATE country SET phonecode = '+970' WHERE code='PS';
UPDATE country SET phonecode = '+507' WHERE code='PA';
UPDATE country SET phonecode = '+675' WHERE code='PG';
UPDATE country SET phonecode = '+595' WHERE code='PY';
UPDATE country SET phonecode = '+51' WHERE code='PE';
UPDATE country SET phonecode = '+63' WHERE code='PH';


-- 2015-July-27
ALTER TABLE search_x_cache DROP COLUMN is_sent;

-- 2015-July-30
ALTER TABLE airport ADD COLUMN is_top SMALLINT DEFAULT 0;
update airport set is_top=1 where airport_code in 
(
    'LON', 'NYC', 'LGW', 'JFK', 'DXB', 'SFO', 'LHR', 'CDG', 'FRA',
    'DEL','BOM','BLR','GOI','MAA','HYD','CCU','PNQ'
);


-- 2015-August-01
ALTER TABLE carrier ADD COLUMN disabled SMALLINT DEFAULT 0;
update carrier set disabled=1 where code in 
('NK', 'F9');

-- 2015-August-13

ALTER TABLE airport ADD COLUMN timezone text;

update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GKA' or airport_code = 'GKA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MAG' or airport_code = 'MAG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HGU' or airport_code = 'HGU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LAE' or airport_code = 'LAE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'POM' or airport_code = 'POM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WWK' or airport_code = 'WWK';
update airport set timezone = 'America/Godthab' where city_code = 'UAK' or airport_code = 'UAK';
update airport set timezone = 'America/Godthab' where city_code = 'GOH' or airport_code = 'GOH';
update airport set timezone = 'America/Godthab' where city_code = 'SFJ' or airport_code = 'SFJ';
update airport set timezone = 'America/Thule' where city_code = 'THU' or airport_code = 'THU';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'AEY' or airport_code = 'AEY';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'EGS' or airport_code = 'EGS';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'HFN' or airport_code = 'HFN';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'HZK' or airport_code = 'HZK';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'IFJ' or airport_code = 'IFJ';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'KEF' or airport_code = 'KEF';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'PFJ' or airport_code = 'PFJ';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'RKV' or airport_code = 'RKV';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'SIJ' or airport_code = 'SIJ';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'VEY' or airport_code = 'VEY';
update airport set timezone = 'America/Toronto' where city_code = 'YAM' or airport_code = 'YAM';
update airport set timezone = 'America/Winnipeg' where city_code = 'YAV' or airport_code = 'YAV';
update airport set timezone = 'America/Halifax' where city_code = 'YAW' or airport_code = 'YAW';
update airport set timezone = 'America/St_Johns' where city_code = 'YAY' or airport_code = 'YAY';
update airport set timezone = 'America/Vancouver' where city_code = 'YAZ' or airport_code = 'YAZ';
update airport set timezone = 'America/Edmonton' where city_code = 'YBB' or airport_code = 'YBB';
update airport set timezone = 'America/Toronto' where city_code = 'YBC' or airport_code = 'YBC';
update airport set timezone = 'America/Toronto' where city_code = 'YBG' or airport_code = 'YBG';
update airport set timezone = 'America/Winnipeg' where city_code = 'YBK' or airport_code = 'YBK';
update airport set timezone = 'America/Vancouver' where city_code = 'YBL' or airport_code = 'YBL';
update airport set timezone = 'America/Winnipeg' where city_code = 'YBR' or airport_code = 'YBR';
update airport set timezone = 'America/Edmonton' where city_code = 'YCB' or airport_code = 'YCB';
update airport set timezone = 'America/Vancouver' where city_code = 'YCD' or airport_code = 'YCD';
update airport set timezone = 'America/Vancouver' where city_code = 'YCG' or airport_code = 'YCG';
update airport set timezone = 'America/Halifax' where city_code = 'YCH' or airport_code = 'YCH';
update airport set timezone = 'America/Halifax' where city_code = 'YCL' or airport_code = 'YCL';
update airport set timezone = 'America/Edmonton' where city_code = 'YCO' or airport_code = 'YCO';
update airport set timezone = 'America/Edmonton' where city_code = 'YCT' or airport_code = 'YCT';
update airport set timezone = 'America/Vancouver' where city_code = 'YCW' or airport_code = 'YCW';
update airport set timezone = 'America/Toronto' where city_code = 'YCY' or airport_code = 'YCY';
update airport set timezone = 'America/Coral_Harbour' where city_code = 'YZS' or airport_code = 'YZS';
update airport set timezone = 'America/Vancouver' where city_code = 'YDA' or airport_code = 'YDA';
update airport set timezone = 'America/Vancouver' where city_code = 'YDB' or airport_code = 'YDB';
update airport set timezone = 'America/Vancouver' where city_code = 'YDC' or airport_code = 'YDC';
update airport set timezone = 'America/St_Johns' where city_code = 'YDF' or airport_code = 'YDF';
update airport set timezone = 'America/Vancouver' where city_code = 'YDL' or airport_code = 'YDL';
update airport set timezone = 'America/Winnipeg' where city_code = 'YDN' or airport_code = 'YDN';
update airport set timezone = 'America/Dawson_Creek' where city_code = 'YDQ' or airport_code = 'YDQ';
update airport set timezone = 'America/Edmonton' where city_code = 'YEG' or airport_code = 'YEG';
update airport set timezone = 'America/Winnipeg' where city_code = 'YEK' or airport_code = 'YEK';
update airport set timezone = 'America/Regina' where city_code = 'YEN' or airport_code = 'YEN';
update airport set timezone = 'America/Edmonton' where city_code = 'YET' or airport_code = 'YET';
update airport set timezone = 'America/Winnipeg' where city_code = 'YEU' or airport_code = 'YEU';
update airport set timezone = 'America/Edmonton' where city_code = 'YEV' or airport_code = 'YEV';
update airport set timezone = 'America/Toronto' where city_code = 'YFB' or airport_code = 'YFB';
update airport set timezone = 'America/Halifax' where city_code = 'YFC' or airport_code = 'YFC';
update airport set timezone = 'America/Winnipeg' where city_code = 'YFO' or airport_code = 'YFO';
update airport set timezone = 'America/Edmonton' where city_code = 'YFR' or airport_code = 'YFR';
update airport set timezone = 'America/Edmonton' where city_code = 'YFS' or airport_code = 'YFS';
update airport set timezone = 'America/Toronto' where city_code = 'YGK' or airport_code = 'YGK';
update airport set timezone = 'America/Toronto' where city_code = 'YGL' or airport_code = 'YGL';
update airport set timezone = 'America/Toronto' where city_code = 'YGP' or airport_code = 'YGP';
update airport set timezone = 'America/Toronto' where city_code = 'YGQ' or airport_code = 'YGQ';
update airport set timezone = 'America/Toronto' where city_code = 'YGR' or airport_code = 'YGR';
update airport set timezone = 'America/Regina' where city_code = 'YHB' or airport_code = 'YHB';
update airport set timezone = 'America/Winnipeg' where city_code = 'YHD' or airport_code = 'YHD';
update airport set timezone = 'America/Edmonton' where city_code = 'YHI' or airport_code = 'YHI';
update airport set timezone = 'America/Edmonton' where city_code = 'YHK' or airport_code = 'YHK';
update airport set timezone = 'America/Toronto' where city_code = 'YHM' or airport_code = 'YHM';
update airport set timezone = 'America/Toronto' where city_code = 'YHU' or airport_code = 'YHU';
update airport set timezone = 'America/Edmonton' where city_code = 'YHY' or airport_code = 'YHY';
update airport set timezone = 'America/Halifax' where city_code = 'YHZ' or airport_code = 'YHZ';
update airport set timezone = 'America/Coral_Harbour' where city_code = 'YIB' or airport_code = 'YIB';
update airport set timezone = 'America/Toronto' where city_code = 'YIO' or airport_code = 'YIO';
update airport set timezone = 'America/Toronto' where city_code = 'YJN' or airport_code = 'YJN';
update airport set timezone = 'America/St_Johns' where city_code = 'YJT' or airport_code = 'YJT';
update airport set timezone = 'America/Vancouver' where city_code = 'YKA' or airport_code = 'YKA';
update airport set timezone = 'America/Toronto' where city_code = 'YKF' or airport_code = 'YKF';
update airport set timezone = 'America/Toronto' where city_code = 'YKL' or airport_code = 'YKL';
update airport set timezone = 'America/Regina' where city_code = 'YKY' or airport_code = 'YKY';
update airport set timezone = 'America/Toronto' where city_code = 'YKZ' or airport_code = 'YKZ';
update airport set timezone = 'America/Toronto' where city_code = 'YLD' or airport_code = 'YLD';
update airport set timezone = 'America/Regina' where city_code = 'YLJ' or airport_code = 'YLJ';
update airport set timezone = 'America/Edmonton' where city_code = 'YLL' or airport_code = 'YLL';
update airport set timezone = 'America/Toronto' where city_code = 'YLT' or airport_code = 'YLT';
update airport set timezone = 'America/Vancouver' where city_code = 'YLW' or airport_code = 'YLW';
update airport set timezone = 'America/Vancouver' where city_code = 'YMA' or airport_code = 'YMA';
update airport set timezone = 'America/Regina' where city_code = 'YMJ' or airport_code = 'YMJ';
update airport set timezone = 'America/Edmonton' where city_code = 'YMM' or airport_code = 'YMM';
update airport set timezone = 'America/Toronto' where city_code = 'YMO' or airport_code = 'YMO';
update airport set timezone = 'America/Toronto' where city_code = 'YMW' or airport_code = 'YMW';
update airport set timezone = 'America/Toronto' where city_code = 'YMX' or airport_code = 'YMX';
update airport set timezone = 'America/Toronto' where city_code = 'YNA' or airport_code = 'YNA';
update airport set timezone = 'America/Toronto' where city_code = 'YND' or airport_code = 'YND';
update airport set timezone = 'America/Toronto' where city_code = 'YNM' or airport_code = 'YNM';
update airport set timezone = 'America/Vancouver' where city_code = 'YOC' or airport_code = 'YOC';
update airport set timezone = 'America/Edmonton' where city_code = 'YOD' or airport_code = 'YOD';
update airport set timezone = 'America/Edmonton' where city_code = 'YOJ' or airport_code = 'YOJ';
update airport set timezone = 'America/Toronto' where city_code = 'YOW' or airport_code = 'YOW';
update airport set timezone = 'America/Regina' where city_code = 'YPA' or airport_code = 'YPA';
update airport set timezone = 'America/Edmonton' where city_code = 'YPE' or airport_code = 'YPE';
update airport set timezone = 'America/Winnipeg' where city_code = 'YPG' or airport_code = 'YPG';
update airport set timezone = 'America/Coral_Harbour' where city_code = 'YPL' or airport_code = 'YPL';
update airport set timezone = 'America/Toronto' where city_code = 'YPN' or airport_code = 'YPN';
update airport set timezone = 'America/Toronto' where city_code = 'YPQ' or airport_code = 'YPQ';
update airport set timezone = 'America/Vancouver' where city_code = 'YPR' or airport_code = 'YPR';
update airport set timezone = 'America/Edmonton' where city_code = 'YPY' or airport_code = 'YPY';
update airport set timezone = 'America/Toronto' where city_code = 'YQA' or airport_code = 'YQA';
update airport set timezone = 'America/Toronto' where city_code = 'YQB' or airport_code = 'YQB';
update airport set timezone = 'America/Edmonton' where city_code = 'YQF' or airport_code = 'YQF';
update airport set timezone = 'America/Toronto' where city_code = 'YQG' or airport_code = 'YQG';
update airport set timezone = 'America/Vancouver' where city_code = 'YQH' or airport_code = 'YQH';
update airport set timezone = 'America/Winnipeg' where city_code = 'YQK' or airport_code = 'YQK';
update airport set timezone = 'America/Edmonton' where city_code = 'YQL' or airport_code = 'YQL';
update airport set timezone = 'America/Halifax' where city_code = 'YQM' or airport_code = 'YQM';
update airport set timezone = 'America/Vancouver' where city_code = 'YQQ' or airport_code = 'YQQ';
update airport set timezone = 'America/Regina' where city_code = 'YQR' or airport_code = 'YQR';
update airport set timezone = 'America/Toronto' where city_code = 'YQT' or airport_code = 'YQT';
update airport set timezone = 'America/Edmonton' where city_code = 'YQU' or airport_code = 'YQU';
update airport set timezone = 'America/Regina' where city_code = 'YQV' or airport_code = 'YQV';
update airport set timezone = 'America/Regina' where city_code = 'YQW' or airport_code = 'YQW';
update airport set timezone = 'America/St_Johns' where city_code = 'YQX' or airport_code = 'YQX';
update airport set timezone = 'America/Halifax' where city_code = 'YQY' or airport_code = 'YQY';
update airport set timezone = 'America/Vancouver' where city_code = 'YQZ' or airport_code = 'YQZ';
update airport set timezone = 'America/Winnipeg' where city_code = 'YRB' or airport_code = 'YRB';
update airport set timezone = 'America/Toronto' where city_code = 'YRI' or airport_code = 'YRI';
update airport set timezone = 'America/Toronto' where city_code = 'YRJ' or airport_code = 'YRJ';
update airport set timezone = 'America/Edmonton' where city_code = 'YRM' or airport_code = 'YRM';
update airport set timezone = 'America/Winnipeg' where city_code = 'YRT' or airport_code = 'YRT';
update airport set timezone = 'America/Toronto' where city_code = 'YSB' or airport_code = 'YSB';
update airport set timezone = 'America/Toronto' where city_code = 'YSC' or airport_code = 'YSC';
update airport set timezone = 'America/Halifax' where city_code = 'YSJ' or airport_code = 'YSJ';
update airport set timezone = 'America/Edmonton' where city_code = 'YSM' or airport_code = 'YSM';
update airport set timezone = 'America/Toronto' where city_code = 'YSR' or airport_code = 'YSR';
update airport set timezone = 'America/Halifax' where city_code = 'YSU' or airport_code = 'YSU';
update airport set timezone = 'America/Edmonton' where city_code = 'YSY' or airport_code = 'YSY';
update airport set timezone = 'America/Toronto' where city_code = 'YTE' or airport_code = 'YTE';
update airport set timezone = 'America/Winnipeg' where city_code = 'YTH' or airport_code = 'YTH';
update airport set timezone = 'America/Toronto' where city_code = 'YTR' or airport_code = 'YTR';
update airport set timezone = 'America/Toronto' where city_code = 'YTS' or airport_code = 'YTS';
update airport set timezone = 'America/Toronto' where city_code = 'YTZ' or airport_code = 'YTZ';
update airport set timezone = 'America/Edmonton' where city_code = 'YUB' or airport_code = 'YUB';
update airport set timezone = 'America/Toronto' where city_code = 'YUL' or airport_code = 'YUL';
update airport set timezone = 'America/Winnipeg' where city_code = 'YUT' or airport_code = 'YUT';
update airport set timezone = 'America/Toronto' where city_code = 'YUX' or airport_code = 'YUX';
update airport set timezone = 'America/Toronto' where city_code = 'YUY' or airport_code = 'YUY';
update airport set timezone = 'America/Regina' where city_code = 'YVC' or airport_code = 'YVC';
update airport set timezone = 'America/Edmonton' where city_code = 'YVG' or airport_code = 'YVG';
update airport set timezone = 'America/Toronto' where city_code = 'YVM' or airport_code = 'YVM';
update airport set timezone = 'America/Toronto' where city_code = 'YVO' or airport_code = 'YVO';
update airport set timezone = 'America/Toronto' where city_code = 'YVP' or airport_code = 'YVP';
update airport set timezone = 'America/Edmonton' where city_code = 'YVQ' or airport_code = 'YVQ';
update airport set timezone = 'America/Vancouver' where city_code = 'YVR' or airport_code = 'YVR';
update airport set timezone = 'America/Regina' where city_code = 'YVT' or airport_code = 'YVT';
update airport set timezone = 'America/Toronto' where city_code = 'YVV' or airport_code = 'YVV';
update airport set timezone = 'America/Toronto' where city_code = 'YWA' or airport_code = 'YWA';
update airport set timezone = 'America/Winnipeg' where city_code = 'YWG' or airport_code = 'YWG';
update airport set timezone = 'America/Halifax' where city_code = 'YWK' or airport_code = 'YWK';
update airport set timezone = 'America/Vancouver' where city_code = 'YWL' or airport_code = 'YWL';
update airport set timezone = 'America/Edmonton' where city_code = 'YWY' or airport_code = 'YWY';
update airport set timezone = 'America/Edmonton' where city_code = 'YXC' or airport_code = 'YXC';
update airport set timezone = 'America/Edmonton' where city_code = 'YXD' or airport_code = 'YXD';
update airport set timezone = 'America/Regina' where city_code = 'YXE' or airport_code = 'YXE';
update airport set timezone = 'America/Edmonton' where city_code = 'YXH' or airport_code = 'YXH';
update airport set timezone = 'America/Dawson_Creek' where city_code = 'YXJ' or airport_code = 'YXJ';
update airport set timezone = 'America/Winnipeg' where city_code = 'YXL' or airport_code = 'YXL';
update airport set timezone = 'America/Toronto' where city_code = 'YXP' or airport_code = 'YXP';
update airport set timezone = 'America/Toronto' where city_code = 'YXR' or airport_code = 'YXR';
update airport set timezone = 'America/Vancouver' where city_code = 'YXS' or airport_code = 'YXS';
update airport set timezone = 'America/Vancouver' where city_code = 'YXT' or airport_code = 'YXT';
update airport set timezone = 'America/Toronto' where city_code = 'YXU' or airport_code = 'YXU';
update airport set timezone = 'America/Vancouver' where city_code = 'YXX' or airport_code = 'YXX';
update airport set timezone = 'America/Vancouver' where city_code = 'YXY' or airport_code = 'YXY';
update airport set timezone = 'America/Toronto' where city_code = 'YYB' or airport_code = 'YYB';
update airport set timezone = 'America/Edmonton' where city_code = 'YYC' or airport_code = 'YYC';
update airport set timezone = 'America/Vancouver' where city_code = 'YYD' or airport_code = 'YYD';
update airport set timezone = 'America/Vancouver' where city_code = 'YYE' or airport_code = 'YYE';
update airport set timezone = 'America/Vancouver' where city_code = 'YYF' or airport_code = 'YYF';
update airport set timezone = 'America/Halifax' where city_code = 'YYG' or airport_code = 'YYG';
update airport set timezone = 'America/Edmonton' where city_code = 'YYH' or airport_code = 'YYH';
update airport set timezone = 'America/Vancouver' where city_code = 'YYJ' or airport_code = 'YYJ';
update airport set timezone = 'America/Winnipeg' where city_code = 'YYL' or airport_code = 'YYL';
update airport set timezone = 'America/Regina' where city_code = 'YYN' or airport_code = 'YYN';
update airport set timezone = 'America/Winnipeg' where city_code = 'YYQ' or airport_code = 'YYQ';
update airport set timezone = 'America/Halifax' where city_code = 'YYR' or airport_code = 'YYR';
update airport set timezone = 'America/St_Johns' where city_code = 'YYT' or airport_code = 'YYT';
update airport set timezone = 'America/Toronto' where city_code = 'YYU' or airport_code = 'YYU';
update airport set timezone = 'America/Toronto' where city_code = 'YYW' or airport_code = 'YYW';
update airport set timezone = 'America/Toronto' where city_code = 'YYY' or airport_code = 'YYY';
update airport set timezone = 'America/Toronto' where city_code = 'YYZ' or airport_code = 'YYZ';
update airport set timezone = 'America/Toronto' where city_code = 'YZD' or airport_code = 'YZD';
update airport set timezone = 'America/Toronto' where city_code = 'YZE' or airport_code = 'YZE';
update airport set timezone = 'America/Edmonton' where city_code = 'YZF' or airport_code = 'YZF';
update airport set timezone = 'America/Edmonton' where city_code = 'YZH' or airport_code = 'YZH';
update airport set timezone = 'America/Vancouver' where city_code = 'YZP' or airport_code = 'YZP';
update airport set timezone = 'America/Toronto' where city_code = 'YZR' or airport_code = 'YZR';
update airport set timezone = 'America/Vancouver' where city_code = 'YZT' or airport_code = 'YZT';
update airport set timezone = 'America/Edmonton' where city_code = 'YZU' or airport_code = 'YZU';
update airport set timezone = 'America/Toronto' where city_code = 'YZV' or airport_code = 'YZV';
update airport set timezone = 'America/Vancouver' where city_code = 'YZW' or airport_code = 'YZW';
update airport set timezone = 'America/Halifax' where city_code = 'YZX' or airport_code = 'YZX';
update airport set timezone = 'America/Vancouver' where city_code = 'ZFA' or airport_code = 'ZFA';
update airport set timezone = 'America/Edmonton' where city_code = 'ZFM' or airport_code = 'ZFM';
update airport set timezone = 'Africa/Algiers' where city_code = 'BJA' or airport_code = 'BJA';
update airport set timezone = 'Africa/Algiers' where city_code = 'ALG' or airport_code = 'ALG';
update airport set timezone = 'Africa/Algiers' where city_code = 'DJG' or airport_code = 'DJG';
update airport set timezone = 'Africa/Algiers' where city_code = 'QFD' or airport_code = 'QFD';
update airport set timezone = 'Africa/Algiers' where city_code = 'VVZ' or airport_code = 'VVZ';
update airport set timezone = 'Africa/Algiers' where city_code = 'TMR' or airport_code = 'TMR';
update airport set timezone = 'Africa/Algiers' where city_code = 'GJL' or airport_code = 'GJL';
update airport set timezone = 'Africa/Algiers' where city_code = 'AAE' or airport_code = 'AAE';
update airport set timezone = 'Africa/Algiers' where city_code = 'CZL' or airport_code = 'CZL';
update airport set timezone = 'Africa/Algiers' where city_code = 'TEE' or airport_code = 'TEE';
update airport set timezone = 'Africa/Algiers' where city_code = 'HRM' or airport_code = 'HRM';
update airport set timezone = 'Africa/Algiers' where city_code = 'TID' or airport_code = 'TID';
update airport set timezone = 'Africa/Algiers' where city_code = 'TIN' or airport_code = 'TIN';
update airport set timezone = 'Africa/Algiers' where city_code = 'QAS' or airport_code = 'QAS';
update airport set timezone = 'Africa/Algiers' where city_code = 'TAF' or airport_code = 'TAF';
update airport set timezone = 'Africa/Algiers' where city_code = 'TLM' or airport_code = 'TLM';
update airport set timezone = 'Africa/Algiers' where city_code = 'ORN' or airport_code = 'ORN';
update airport set timezone = 'Africa/Algiers' where city_code = 'MUW' or airport_code = 'MUW';
update airport set timezone = 'Africa/Algiers' where city_code = 'AZR' or airport_code = 'AZR';
update airport set timezone = 'Africa/Algiers' where city_code = 'BSK' or airport_code = 'BSK';
update airport set timezone = 'Africa/Algiers' where city_code = 'ELG' or airport_code = 'ELG';
update airport set timezone = 'Africa/Algiers' where city_code = 'GHA' or airport_code = 'GHA';
update airport set timezone = 'Africa/Algiers' where city_code = 'HME' or airport_code = 'HME';
update airport set timezone = 'Africa/Algiers' where city_code = 'INZ' or airport_code = 'INZ';
update airport set timezone = 'Africa/Algiers' where city_code = 'TGR' or airport_code = 'TGR';
update airport set timezone = 'Africa/Algiers' where city_code = 'LOO' or airport_code = 'LOO';
update airport set timezone = 'Africa/Algiers' where city_code = 'TMX' or airport_code = 'TMX';
update airport set timezone = 'Africa/Algiers' where city_code = 'OGX' or airport_code = 'OGX';
update airport set timezone = 'Africa/Algiers' where city_code = 'IAM' or airport_code = 'IAM';
update airport set timezone = 'Africa/Porto-Novo' where city_code = 'COO' or airport_code = 'COO';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'OUA' or airport_code = 'OUA';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'BOY' or airport_code = 'BOY';
update airport set timezone = 'Africa/Accra' where city_code = 'ACC' or airport_code = 'ACC';
update airport set timezone = 'Africa/Accra' where city_code = 'TML' or airport_code = 'TML';
update airport set timezone = 'Africa/Accra' where city_code = 'NYI' or airport_code = 'NYI';
update airport set timezone = 'Africa/Accra' where city_code = 'TKD' or airport_code = 'TKD';
update airport set timezone = 'Africa/Abidjan' where city_code = 'ABJ' or airport_code = 'ABJ';
update airport set timezone = 'Africa/Abidjan' where city_code = 'BYK' or airport_code = 'BYK';
update airport set timezone = 'Africa/Abidjan' where city_code = 'DJO' or airport_code = 'DJO';
update airport set timezone = 'Africa/Abidjan' where city_code = 'HGO' or airport_code = 'HGO';
update airport set timezone = 'Africa/Abidjan' where city_code = 'MJC' or airport_code = 'MJC';
update airport set timezone = 'Africa/Abidjan' where city_code = 'SPY' or airport_code = 'SPY';
update airport set timezone = 'Africa/Abidjan' where city_code = 'ASK' or airport_code = 'ASK';
update airport set timezone = 'Africa/Lagos' where city_code = 'ABV' or airport_code = 'ABV';
update airport set timezone = 'Africa/Lagos' where city_code = 'AKR' or airport_code = 'AKR';
update airport set timezone = 'Africa/Lagos' where city_code = 'BNI' or airport_code = 'BNI';
update airport set timezone = 'Africa/Lagos' where city_code = 'CBQ' or airport_code = 'CBQ';
update airport set timezone = 'Africa/Lagos' where city_code = 'ENU' or airport_code = 'ENU';
update airport set timezone = 'Africa/Lagos' where city_code = 'QUS' or airport_code = 'QUS';
update airport set timezone = 'Africa/Lagos' where city_code = 'IBA' or airport_code = 'IBA';
update airport set timezone = 'Africa/Lagos' where city_code = 'ILR' or airport_code = 'ILR';
update airport set timezone = 'Africa/Lagos' where city_code = 'JOS' or airport_code = 'JOS';
update airport set timezone = 'Africa/Lagos' where city_code = 'KAD' or airport_code = 'KAD';
update airport set timezone = 'Africa/Lagos' where city_code = 'KAN' or airport_code = 'KAN';
update airport set timezone = 'Africa/Lagos' where city_code = 'MIU' or airport_code = 'MIU';
update airport set timezone = 'Africa/Lagos' where city_code = 'MDI' or airport_code = 'MDI';
update airport set timezone = 'Africa/Lagos' where city_code = 'LOS' or airport_code = 'LOS';
update airport set timezone = 'Africa/Lagos' where city_code = 'MXJ' or airport_code = 'MXJ';
update airport set timezone = 'Africa/Lagos' where city_code = 'PHC' or airport_code = 'PHC';
update airport set timezone = 'Africa/Lagos' where city_code = 'SKO' or airport_code = 'SKO';
update airport set timezone = 'Africa/Lagos' where city_code = 'YOL' or airport_code = 'YOL';
update airport set timezone = 'Africa/Lagos' where city_code = 'ZAR' or airport_code = 'ZAR';
update airport set timezone = 'Africa/Niamey' where city_code = 'MFQ' or airport_code = 'MFQ';
update airport set timezone = 'Africa/Niamey' where city_code = 'NIM' or airport_code = 'NIM';
update airport set timezone = 'Africa/Niamey' where city_code = 'THZ' or airport_code = 'THZ';
update airport set timezone = 'Africa/Niamey' where city_code = 'AJY' or airport_code = 'AJY';
update airport set timezone = 'Africa/Niamey' where city_code = 'ZND' or airport_code = 'ZND';
update airport set timezone = 'Africa/Tunis' where city_code = 'MIR' or airport_code = 'MIR';
update airport set timezone = 'Africa/Tunis' where city_code = 'TUN' or airport_code = 'TUN';
update airport set timezone = 'Africa/Tunis' where city_code = 'GAF' or airport_code = 'GAF';
update airport set timezone = 'Africa/Tunis' where city_code = 'GAE' or airport_code = 'GAE';
update airport set timezone = 'Africa/Tunis' where city_code = 'DJE' or airport_code = 'DJE';
update airport set timezone = 'Africa/Tunis' where city_code = 'EBM' or airport_code = 'EBM';
update airport set timezone = 'Africa/Tunis' where city_code = 'SFA' or airport_code = 'SFA';
update airport set timezone = 'Africa/Tunis' where city_code = 'TOE' or airport_code = 'TOE';
update airport set timezone = 'Africa/Lome' where city_code = 'LRL' or airport_code = 'LRL';
update airport set timezone = 'Africa/Lome' where city_code = 'LFW' or airport_code = 'LFW';
update airport set timezone = 'Europe/Brussels' where city_code = 'ANR' or airport_code = 'ANR';
update airport set timezone = 'Europe/Brussels' where city_code = 'BRU' or airport_code = 'BRU';
update airport set timezone = 'Europe/Brussels' where city_code = 'CRL' or airport_code = 'CRL';
update airport set timezone = 'Europe/Brussels' where city_code = 'QKT' or airport_code = 'QKT';
update airport set timezone = 'Europe/Brussels' where city_code = 'LGG' or airport_code = 'LGG';
update airport set timezone = 'Europe/Brussels' where city_code = 'OST' or airport_code = 'OST';
update airport set timezone = 'Europe/Berlin' where city_code = 'BBJ' or airport_code = 'BBJ';
update airport set timezone = 'Europe/Berlin' where city_code = 'AOC' or airport_code = 'AOC';
update airport set timezone = 'America/New_York' where city_code = '4I7' or airport_code = '4I7';
update airport set timezone = 'Europe/Berlin' where city_code = 'BBH' or airport_code = 'BBH';
update airport set timezone = 'Europe/Berlin' where city_code = 'SXF' or airport_code = 'SXF';
update airport set timezone = 'Europe/Berlin' where city_code = 'DRS' or airport_code = 'DRS';
update airport set timezone = 'Europe/Berlin' where city_code = 'ERF' or airport_code = 'ERF';
update airport set timezone = 'Europe/Berlin' where city_code = 'FRA' or airport_code = 'FRA';
update airport set timezone = 'Europe/Berlin' where city_code = 'FMO' or airport_code = 'FMO';
update airport set timezone = 'Europe/Berlin' where city_code = 'HAM' or airport_code = 'HAM';
update airport set timezone = 'Europe/Berlin' where city_code = 'THF' or airport_code = 'THF';
update airport set timezone = 'Europe/Berlin' where city_code = 'CGN' or airport_code = 'CGN';
update airport set timezone = 'Europe/Berlin' where city_code = 'DUS' or airport_code = 'DUS';
update airport set timezone = 'Europe/Berlin' where city_code = 'MUC' or airport_code = 'MUC';
update airport set timezone = 'Europe/Berlin' where city_code = 'NUE' or airport_code = 'NUE';
update airport set timezone = 'Europe/Berlin' where city_code = 'LEJ' or airport_code = 'LEJ';
update airport set timezone = 'Europe/Berlin' where city_code = 'SCN' or airport_code = 'SCN';
update airport set timezone = 'Europe/Berlin' where city_code = 'STR' or airport_code = 'STR';
update airport set timezone = 'Europe/Berlin' where city_code = 'TXL' or airport_code = 'TXL';
update airport set timezone = 'Europe/Berlin' where city_code = 'HAJ' or airport_code = 'HAJ';
update airport set timezone = 'Europe/Berlin' where city_code = 'BRE' or airport_code = 'BRE';
update airport set timezone = 'Europe/Berlin' where city_code = 'HHN' or airport_code = 'HHN';
update airport set timezone = 'Europe/Berlin' where city_code = 'MHG' or airport_code = 'MHG';
update airport set timezone = 'Europe/Berlin' where city_code = 'XFW' or airport_code = 'XFW';
update airport set timezone = 'Europe/Berlin' where city_code = 'KEL' or airport_code = 'KEL';
update airport set timezone = 'Europe/Berlin' where city_code = 'LBC' or airport_code = 'LBC';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZCA' or airport_code = 'ZCA';
update airport set timezone = 'Europe/Berlin' where city_code = 'ESS' or airport_code = 'ESS';
update airport set timezone = 'Europe/Berlin' where city_code = 'MGL' or airport_code = 'MGL';
update airport set timezone = 'Europe/Berlin' where city_code = 'PAD' or airport_code = 'PAD';
update airport set timezone = 'Europe/Berlin' where city_code = 'DTM' or airport_code = 'DTM';
update airport set timezone = 'Europe/Berlin' where city_code = 'AGB' or airport_code = 'AGB';
update airport set timezone = 'Europe/Berlin' where city_code = 'OBF' or airport_code = 'OBF';
update airport set timezone = 'Europe/Berlin' where city_code = 'FDH' or airport_code = 'FDH';
update airport set timezone = 'Europe/Berlin' where city_code = 'SZW' or airport_code = 'SZW';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZSN' or airport_code = 'ZSN';
update airport set timezone = 'Europe/Berlin' where city_code = 'BYU' or airport_code = 'BYU';
update airport set timezone = 'Europe/Berlin' where city_code = 'HOQ' or airport_code = 'HOQ';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZNV' or airport_code = 'ZNV';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZQF' or airport_code = 'ZQF';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZQC' or airport_code = 'ZQC';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZQL' or airport_code = 'ZQL';
update airport set timezone = 'Europe/Berlin' where city_code = 'BWE' or airport_code = 'BWE';
update airport set timezone = 'Europe/Berlin' where city_code = 'KSF' or airport_code = 'KSF';
update airport set timezone = 'Europe/Berlin' where city_code = 'BRV' or airport_code = 'BRV';
update airport set timezone = 'Europe/Berlin' where city_code = 'EME' or airport_code = 'EME';
update airport set timezone = 'Europe/Berlin' where city_code = 'WVN' or airport_code = 'WVN';
update airport set timezone = 'Europe/Berlin' where city_code = 'BMK' or airport_code = 'BMK';
update airport set timezone = 'Europe/Berlin' where city_code = 'NRD' or airport_code = 'NRD';
update airport set timezone = 'Europe/Berlin' where city_code = 'FLF' or airport_code = 'FLF';
update airport set timezone = 'Europe/Berlin' where city_code = 'GWT' or airport_code = 'GWT';
update airport set timezone = 'Europe/Tallinn' where city_code = 'KDL' or airport_code = 'KDL';
update airport set timezone = 'Europe/Tallinn' where city_code = 'URE' or airport_code = 'URE';
update airport set timezone = 'Europe/Tallinn' where city_code = 'EPU' or airport_code = 'EPU';
update airport set timezone = 'Europe/Tallinn' where city_code = 'TLL' or airport_code = 'TLL';
update airport set timezone = 'Europe/Tallinn' where city_code = 'TAY' or airport_code = 'TAY';
update airport set timezone = 'Europe/Helsinki' where city_code = 'ENF' or airport_code = 'ENF';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KEV' or airport_code = 'KEV';
update airport set timezone = 'Europe/Helsinki' where city_code = 'HEM' or airport_code = 'HEM';
update airport set timezone = 'Europe/Helsinki' where city_code = 'HEL' or airport_code = 'HEL';
update airport set timezone = 'Europe/Helsinki' where city_code = 'HYV' or airport_code = 'HYV';
update airport set timezone = 'Europe/Helsinki' where city_code = 'IVL' or airport_code = 'IVL';
update airport set timezone = 'Europe/Helsinki' where city_code = 'JOE' or airport_code = 'JOE';
update airport set timezone = 'Europe/Helsinki' where city_code = 'JYV' or airport_code = 'JYV';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KAU' or airport_code = 'KAU';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KEM' or airport_code = 'KEM';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KAJ' or airport_code = 'KAJ';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KOK' or airport_code = 'KOK';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KAO' or airport_code = 'KAO';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KTT' or airport_code = 'KTT';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KUO' or airport_code = 'KUO';
update airport set timezone = 'Europe/Helsinki' where city_code = 'LPP' or airport_code = 'LPP';
update airport set timezone = 'Europe/Mariehamn' where city_code = 'MHQ' or airport_code = 'MHQ';
update airport set timezone = 'Europe/Helsinki' where city_code = 'MIK' or airport_code = 'MIK';
update airport set timezone = 'Europe/Helsinki' where city_code = 'OUL' or airport_code = 'OUL';
update airport set timezone = 'Europe/Helsinki' where city_code = 'POR' or airport_code = 'POR';
update airport set timezone = 'Europe/Helsinki' where city_code = 'RVN' or airport_code = 'RVN';
update airport set timezone = 'Europe/Helsinki' where city_code = 'SVL' or airport_code = 'SVL';
update airport set timezone = 'Europe/Helsinki' where city_code = 'SOT' or airport_code = 'SOT';
update airport set timezone = 'Europe/Helsinki' where city_code = 'TMP' or airport_code = 'TMP';
update airport set timezone = 'Europe/Helsinki' where city_code = 'TKU' or airport_code = 'TKU';
update airport set timezone = 'Europe/Helsinki' where city_code = 'QVY' or airport_code = 'QVY';
update airport set timezone = 'Europe/Helsinki' where city_code = 'VAA' or airport_code = 'VAA';
update airport set timezone = 'Europe/Helsinki' where city_code = 'VRK' or airport_code = 'VRK';
update airport set timezone = 'Europe/London' where city_code = 'BFS' or airport_code = 'BFS';
update airport set timezone = 'Europe/London' where city_code = 'ENK' or airport_code = 'ENK';
update airport set timezone = 'Europe/London' where city_code = 'BHD' or airport_code = 'BHD';
update airport set timezone = 'Europe/London' where city_code = 'LDY' or airport_code = 'LDY';
update airport set timezone = 'Europe/London' where city_code = 'BHX' or airport_code = 'BHX';
update airport set timezone = 'Europe/London' where city_code = 'CVT' or airport_code = 'CVT';
update airport set timezone = 'Europe/London' where city_code = 'GLO' or airport_code = 'GLO';
update airport set timezone = 'Europe/London' where city_code = 'MAN' or airport_code = 'MAN';
update airport set timezone = 'Europe/London' where city_code = 'NQY' or airport_code = 'NQY';
update airport set timezone = 'Europe/London' where city_code = 'LYE' or airport_code = 'LYE';
update airport set timezone = 'Europe/London' where city_code = 'YEO' or airport_code = 'YEO';
update airport set timezone = 'Europe/London' where city_code = 'CWL' or airport_code = 'CWL';
update airport set timezone = 'Europe/London' where city_code = 'SWS' or airport_code = 'SWS';
update airport set timezone = 'Europe/London' where city_code = 'BRS' or airport_code = 'BRS';
update airport set timezone = 'Europe/London' where city_code = 'LPL' or airport_code = 'LPL';
update airport set timezone = 'Europe/London' where city_code = 'LTN' or airport_code = 'LTN';
update airport set timezone = 'Europe/London' where city_code = 'PLH' or airport_code = 'PLH';
update airport set timezone = 'Europe/London' where city_code = 'BOH' or airport_code = 'BOH';
update airport set timezone = 'Europe/London' where city_code = 'SOU' or airport_code = 'SOU';
update airport set timezone = 'Europe/London' where city_code = 'QLA' or airport_code = 'QLA';
update airport set timezone = 'Europe/Guernsey' where city_code = 'ACI' or airport_code = 'ACI';
update airport set timezone = 'Europe/Guernsey' where city_code = 'GCI' or airport_code = 'GCI';
update airport set timezone = 'Europe/Jersey' where city_code = 'JER' or airport_code = 'JER';
update airport set timezone = 'Europe/London' where city_code = 'ESH' or airport_code = 'ESH';
update airport set timezone = 'Europe/London' where city_code = 'BQH' or airport_code = 'BQH';
update airport set timezone = 'Europe/London' where city_code = 'LGW' or airport_code = 'LGW';
update airport set timezone = 'Europe/London' where city_code = 'LCY' or airport_code = 'LCY';
update airport set timezone = 'Europe/London' where city_code = 'FAB' or airport_code = 'FAB';
update airport set timezone = 'Europe/London' where city_code = 'BBS' or airport_code = 'BBS';
update airport set timezone = 'Europe/London' where city_code = 'LHR' or airport_code = 'LHR';
update airport set timezone = 'Europe/London' where city_code = 'SEN' or airport_code = 'SEN';
update airport set timezone = 'Europe/London' where city_code = 'LYX' or airport_code = 'LYX';
update airport set timezone = 'Europe/London' where city_code = 'MSE' or airport_code = 'MSE';
update airport set timezone = 'Europe/London' where city_code = 'CAX' or airport_code = 'CAX';
update airport set timezone = 'Europe/London' where city_code = 'BLK' or airport_code = 'BLK';
update airport set timezone = 'Europe/London' where city_code = 'HUY' or airport_code = 'HUY';
update airport set timezone = 'Europe/London' where city_code = 'BWF' or airport_code = 'BWF';
update airport set timezone = 'Europe/London' where city_code = 'LBA' or airport_code = 'LBA';
update airport set timezone = 'Europe/London' where city_code = 'CEG' or airport_code = 'CEG';
update airport set timezone = 'Europe/Isle_of_Man' where city_code = 'IOM' or airport_code = 'IOM';
update airport set timezone = 'Europe/London' where city_code = 'NCL' or airport_code = 'NCL';
update airport set timezone = 'Europe/London' where city_code = 'MME' or airport_code = 'MME';
update airport set timezone = 'Europe/London' where city_code = 'EMA' or airport_code = 'EMA';
update airport set timezone = 'Europe/London' where city_code = 'KOI' or airport_code = 'KOI';
update airport set timezone = 'Europe/London' where city_code = 'LSI' or airport_code = 'LSI';
update airport set timezone = 'Europe/London' where city_code = 'WIC' or airport_code = 'WIC';
update airport set timezone = 'Europe/London' where city_code = 'ABZ' or airport_code = 'ABZ';
update airport set timezone = 'Europe/London' where city_code = 'INV' or airport_code = 'INV';
update airport set timezone = 'Europe/London' where city_code = 'GLA' or airport_code = 'GLA';
update airport set timezone = 'Europe/London' where city_code = 'EDI' or airport_code = 'EDI';
update airport set timezone = 'Europe/London' where city_code = 'ILY' or airport_code = 'ILY';
update airport set timezone = 'Europe/London' where city_code = 'PIK' or airport_code = 'PIK';
update airport set timezone = 'Europe/London' where city_code = 'BEB' or airport_code = 'BEB';
update airport set timezone = 'Europe/London' where city_code = 'SDZ' or airport_code = 'SDZ';
update airport set timezone = 'Europe/London' where city_code = 'DND' or airport_code = 'DND';
update airport set timezone = 'Europe/London' where city_code = 'SYY' or airport_code = 'SYY';
update airport set timezone = 'Europe/London' where city_code = 'TRE' or airport_code = 'TRE';
update airport set timezone = 'Europe/London' where city_code = 'ADX' or airport_code = 'ADX';
update airport set timezone = 'Europe/London' where city_code = 'LMO' or airport_code = 'LMO';
update airport set timezone = 'Europe/London' where city_code = 'CBG' or airport_code = 'CBG';
update airport set timezone = 'Europe/London' where city_code = 'NWI' or airport_code = 'NWI';
update airport set timezone = 'Europe/London' where city_code = 'STN' or airport_code = 'STN';
update airport set timezone = 'Europe/London' where city_code = 'EXT' or airport_code = 'EXT';
update airport set timezone = 'Europe/London' where city_code = 'FZO' or airport_code = 'FZO';
update airport set timezone = 'Europe/London' where city_code = 'OXF' or airport_code = 'OXF';
update airport set timezone = 'Europe/London' where city_code = 'MHZ' or airport_code = 'MHZ';
update airport set timezone = 'Europe/London' where city_code = 'FFD' or airport_code = 'FFD';
update airport set timezone = 'Europe/London' where city_code = 'BZZ' or airport_code = 'BZZ';
update airport set timezone = 'Europe/London' where city_code = 'ODH' or airport_code = 'ODH';
update airport set timezone = 'Europe/London' where city_code = 'NHT' or airport_code = 'NHT';
update airport set timezone = 'Europe/London' where city_code = 'QCY' or airport_code = 'QCY';
update airport set timezone = 'Europe/London' where city_code = 'BEQ' or airport_code = 'BEQ';
update airport set timezone = 'Europe/London' where city_code = 'WTN' or airport_code = 'WTN';
update airport set timezone = 'Europe/London' where city_code = 'KNF' or airport_code = 'KNF';
update airport set timezone = 'Atlantic/Stanley' where city_code = 'MPN' or airport_code = 'MPN';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'AMS' or airport_code = 'AMS';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'MST' or airport_code = 'MST';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'EIN' or airport_code = 'EIN';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'GRQ' or airport_code = 'GRQ';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'DHR' or airport_code = 'DHR';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'LWR' or airport_code = 'LWR';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'RTM' or airport_code = 'RTM';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'UTC' or airport_code = 'UTC';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'ENS' or airport_code = 'ENS';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'LID' or airport_code = 'LID';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'WOE' or airport_code = 'WOE';
update airport set timezone = 'Europe/Dublin' where city_code = 'ORK' or airport_code = 'ORK';
update airport set timezone = 'Europe/Dublin' where city_code = 'GWY' or airport_code = 'GWY';
update airport set timezone = 'Europe/Dublin' where city_code = 'DUB' or airport_code = 'DUB';
update airport set timezone = 'Europe/Dublin' where city_code = 'NOC' or airport_code = 'NOC';
update airport set timezone = 'Europe/Dublin' where city_code = 'KIR' or airport_code = 'KIR';
update airport set timezone = 'Europe/Dublin' where city_code = 'SNN' or airport_code = 'SNN';
update airport set timezone = 'Europe/Dublin' where city_code = 'SXL' or airport_code = 'SXL';
update airport set timezone = 'Europe/Dublin' where city_code = 'WAT' or airport_code = 'WAT';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'AAR' or airport_code = 'AAR';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'BLL' or airport_code = 'BLL';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'CPH' or airport_code = 'CPH';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'EBJ' or airport_code = 'EBJ';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'KRP' or airport_code = 'KRP';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'ODE' or airport_code = 'ODE';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'RKE' or airport_code = 'RKE';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'RNN' or airport_code = 'RNN';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'SGD' or airport_code = 'SGD';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'SKS' or airport_code = 'SKS';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'TED' or airport_code = 'TED';
update airport set timezone = 'Atlantic/Faeroe' where city_code = 'FAE' or airport_code = 'FAE';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'STA' or airport_code = 'STA';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'AAL' or airport_code = 'AAL';
update airport set timezone = 'Europe/Luxembourg' where city_code = 'LUX' or airport_code = 'LUX';
update airport set timezone = 'Europe/Oslo' where city_code = 'AES' or airport_code = 'AES';
update airport set timezone = 'Europe/Oslo' where city_code = 'ANX' or airport_code = 'ANX';
update airport set timezone = 'Europe/Oslo' where city_code = 'ALF' or airport_code = 'ALF';
update airport set timezone = 'Europe/Oslo' where city_code = 'BNN' or airport_code = 'BNN';
update airport set timezone = 'Europe/Oslo' where city_code = 'BOO' or airport_code = 'BOO';
update airport set timezone = 'Europe/Oslo' where city_code = 'BGO' or airport_code = 'BGO';
update airport set timezone = 'Europe/Oslo' where city_code = 'BJF' or airport_code = 'BJF';
update airport set timezone = 'Europe/Oslo' where city_code = 'KRS' or airport_code = 'KRS';
update airport set timezone = 'Europe/Oslo' where city_code = 'BDU' or airport_code = 'BDU';
update airport set timezone = 'Europe/Oslo' where city_code = 'EVE' or airport_code = 'EVE';
update airport set timezone = 'Europe/Oslo' where city_code = 'VDB' or airport_code = 'VDB';
update airport set timezone = 'Europe/Oslo' where city_code = 'FRO' or airport_code = 'FRO';
update airport set timezone = 'Europe/Oslo' where city_code = 'OSL' or airport_code = 'OSL';
update airport set timezone = 'Europe/Oslo' where city_code = 'HAU' or airport_code = 'HAU';
update airport set timezone = 'Europe/Oslo' where city_code = 'HAA' or airport_code = 'HAA';
update airport set timezone = 'Europe/Oslo' where city_code = 'KSU' or airport_code = 'KSU';
update airport set timezone = 'Europe/Oslo' where city_code = 'KKN' or airport_code = 'KKN';
update airport set timezone = 'Europe/Oslo' where city_code = 'FAN' or airport_code = 'FAN';
update airport set timezone = 'Europe/Oslo' where city_code = 'MOL' or airport_code = 'MOL';
update airport set timezone = 'Europe/Oslo' where city_code = 'MJF' or airport_code = 'MJF';
update airport set timezone = 'Europe/Oslo' where city_code = 'LKL' or airport_code = 'LKL';
update airport set timezone = 'Europe/Oslo' where city_code = 'NTB' or airport_code = 'NTB';
update airport set timezone = 'Europe/Oslo' where city_code = 'OLA' or airport_code = 'OLA';
update airport set timezone = 'Europe/Oslo' where city_code = 'RRS' or airport_code = 'RRS';
update airport set timezone = 'Europe/Oslo' where city_code = 'RYG' or airport_code = 'RYG';
update airport set timezone = 'Arctic/Longyearbyen' where city_code = 'LYR' or airport_code = 'LYR';
update airport set timezone = 'Europe/Oslo' where city_code = 'SKE' or airport_code = 'SKE';
update airport set timezone = 'Europe/Oslo' where city_code = 'SRP' or airport_code = 'SRP';
update airport set timezone = 'Europe/Oslo' where city_code = 'SSJ' or airport_code = 'SSJ';
update airport set timezone = 'Europe/Oslo' where city_code = 'TOS' or airport_code = 'TOS';
update airport set timezone = 'Europe/Oslo' where city_code = 'TRF' or airport_code = 'TRF';
update airport set timezone = 'Europe/Oslo' where city_code = 'TRD' or airport_code = 'TRD';
update airport set timezone = 'Europe/Oslo' where city_code = 'SVG' or airport_code = 'SVG';
update airport set timezone = 'Europe/Warsaw' where city_code = 'GDN' or airport_code = 'GDN';
update airport set timezone = 'Europe/Warsaw' where city_code = 'KRK' or airport_code = 'KRK';
update airport set timezone = 'Europe/Warsaw' where city_code = 'KTW' or airport_code = 'KTW';
update airport set timezone = 'Europe/Warsaw' where city_code = 'POZ' or airport_code = 'POZ';
update airport set timezone = 'Europe/Warsaw' where city_code = 'RZE' or airport_code = 'RZE';
update airport set timezone = 'Europe/Warsaw' where city_code = 'SZZ' or airport_code = 'SZZ';
update airport set timezone = 'Europe/Warsaw' where city_code = 'OSP' or airport_code = 'OSP';
update airport set timezone = 'Europe/Warsaw' where city_code = 'WAW' or airport_code = 'WAW';
update airport set timezone = 'Europe/Warsaw' where city_code = 'WRO' or airport_code = 'WRO';
update airport set timezone = 'Europe/Warsaw' where city_code = 'IEG' or airport_code = 'IEG';
update airport set timezone = 'Europe/Stockholm' where city_code = 'RNB' or airport_code = 'RNB';
update airport set timezone = 'Europe/Stockholm' where city_code = 'GOT' or airport_code = 'GOT';
update airport set timezone = 'Europe/Stockholm' where city_code = 'JKG' or airport_code = 'JKG';
update airport set timezone = 'Europe/Stockholm' where city_code = 'LDK' or airport_code = 'LDK';
update airport set timezone = 'Europe/Stockholm' where city_code = 'GSE' or airport_code = 'GSE';
update airport set timezone = 'Europe/Stockholm' where city_code = 'KVB' or airport_code = 'KVB';
update airport set timezone = 'Europe/Stockholm' where city_code = 'THN' or airport_code = 'THN';
update airport set timezone = 'Europe/Stockholm' where city_code = 'KSK' or airport_code = 'KSK';
update airport set timezone = 'Europe/Stockholm' where city_code = 'MXX' or airport_code = 'MXX';
update airport set timezone = 'Europe/Stockholm' where city_code = 'NYO' or airport_code = 'NYO';
update airport set timezone = 'Europe/Stockholm' where city_code = 'KID' or airport_code = 'KID';
update airport set timezone = 'Europe/Stockholm' where city_code = 'JLD' or airport_code = 'JLD';
update airport set timezone = 'Europe/Stockholm' where city_code = 'OSK' or airport_code = 'OSK';
update airport set timezone = 'Europe/Stockholm' where city_code = 'KLR' or airport_code = 'KLR';
update airport set timezone = 'Europe/Stockholm' where city_code = 'MMX' or airport_code = 'MMX';
update airport set timezone = 'Europe/Stockholm' where city_code = 'HAD' or airport_code = 'HAD';
update airport set timezone = 'Europe/Stockholm' where city_code = 'VXO' or airport_code = 'VXO';
update airport set timezone = 'Europe/Stockholm' where city_code = 'EVG' or airport_code = 'EVG';
update airport set timezone = 'Europe/Stockholm' where city_code = 'GEV' or airport_code = 'GEV';
update airport set timezone = 'Europe/Stockholm' where city_code = 'HUV' or airport_code = 'HUV';
update airport set timezone = 'Europe/Stockholm' where city_code = 'KRF' or airport_code = 'KRF';
update airport set timezone = 'Europe/Stockholm' where city_code = 'LYC' or airport_code = 'LYC';
update airport set timezone = 'Europe/Stockholm' where city_code = 'SDL' or airport_code = 'SDL';
update airport set timezone = 'Europe/Stockholm' where city_code = 'OER' or airport_code = 'OER';
update airport set timezone = 'Europe/Stockholm' where city_code = 'KRN' or airport_code = 'KRN';
update airport set timezone = 'Europe/Stockholm' where city_code = 'SFT' or airport_code = 'SFT';
update airport set timezone = 'Europe/Stockholm' where city_code = 'UME' or airport_code = 'UME';
update airport set timezone = 'Europe/Stockholm' where city_code = 'VHM' or airport_code = 'VHM';
update airport set timezone = 'Europe/Stockholm' where city_code = 'AJR' or airport_code = 'AJR';
update airport set timezone = 'Europe/Stockholm' where city_code = 'ORB' or airport_code = 'ORB';
update airport set timezone = 'Europe/Stockholm' where city_code = 'VST' or airport_code = 'VST';
update airport set timezone = 'Europe/Stockholm' where city_code = 'LLA' or airport_code = 'LLA';
update airport set timezone = 'Europe/Stockholm' where city_code = 'ARN' or airport_code = 'ARN';
update airport set timezone = 'Europe/Stockholm' where city_code = 'BMA' or airport_code = 'BMA';
update airport set timezone = 'Europe/Stockholm' where city_code = 'BLE' or airport_code = 'BLE';
update airport set timezone = 'Europe/Stockholm' where city_code = 'HLF' or airport_code = 'HLF';
update airport set timezone = 'Europe/Stockholm' where city_code = 'GVX' or airport_code = 'GVX';
update airport set timezone = 'Europe/Stockholm' where city_code = 'LPI' or airport_code = 'LPI';
update airport set timezone = 'Europe/Stockholm' where city_code = 'NRK' or airport_code = 'NRK';
update airport set timezone = 'Europe/Stockholm' where city_code = 'VBY' or airport_code = 'VBY';
update airport set timezone = 'Europe/Berlin' where city_code = 'SPM' or airport_code = 'SPM';
update airport set timezone = 'Europe/Berlin' where city_code = 'RMS' or airport_code = 'RMS';
update airport set timezone = 'Europe/Berlin' where city_code = 'GHF' or airport_code = 'GHF';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZCN' or airport_code = 'ZCN';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZNF' or airport_code = 'ZNF';
update airport set timezone = 'Europe/Berlin' where city_code = 'GKE' or airport_code = 'GKE';
update airport set timezone = 'Europe/Berlin' where city_code = 'RLG' or airport_code = 'RLG';
update airport set timezone = 'Europe/Berlin' where city_code = 'FEL' or airport_code = 'FEL';
update airport set timezone = 'Europe/Berlin' where city_code = 'GUT' or airport_code = 'GUT';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'ALJ' or airport_code = 'ALJ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'AGZ' or airport_code = 'AGZ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'BIY' or airport_code = 'BIY';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'BFN' or airport_code = 'BFN';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'CPT' or airport_code = 'CPT';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'DUR' or airport_code = 'DUR';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'ELS' or airport_code = 'ELS';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'GCJ' or airport_code = 'GCJ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'GRJ' or airport_code = 'GRJ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'HDS' or airport_code = 'HDS';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'JNB' or airport_code = 'JNB';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'KIM' or airport_code = 'KIM';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'KLZ' or airport_code = 'KLZ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'HLA' or airport_code = 'HLA';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'LAY' or airport_code = 'LAY';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MGH' or airport_code = 'MGH';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MEZ' or airport_code = 'MEZ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'NCS' or airport_code = 'NCS';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'DUH' or airport_code = 'DUH';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PLZ' or airport_code = 'PLZ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PHW' or airport_code = 'PHW';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PTG' or airport_code = 'PTG';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PZB' or airport_code = 'PZB';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'NTY' or airport_code = 'NTY';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'UTW' or airport_code = 'UTW';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'RCB' or airport_code = 'RCB';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'SBU' or airport_code = 'SBU';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'SIS' or airport_code = 'SIS';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'SZK' or airport_code = 'SZK';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'LTA' or airport_code = 'LTA';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'ULD' or airport_code = 'ULD';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'UTN' or airport_code = 'UTN';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'UTT' or airport_code = 'UTT';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'VRU' or airport_code = 'VRU';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'VIR' or airport_code = 'VIR';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PRY' or airport_code = 'PRY';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'WEL' or airport_code = 'WEL';
update airport set timezone = 'Africa/Gaborone' where city_code = 'FRW' or airport_code = 'FRW';
update airport set timezone = 'Africa/Gaborone' where city_code = 'JWA' or airport_code = 'JWA';
update airport set timezone = 'Africa/Gaborone' where city_code = 'BBK' or airport_code = 'BBK';
update airport set timezone = 'Africa/Gaborone' where city_code = 'MUB' or airport_code = 'MUB';
update airport set timezone = 'Africa/Gaborone' where city_code = 'GBE' or airport_code = 'GBE';
update airport set timezone = 'Africa/Gaborone' where city_code = 'PKW' or airport_code = 'PKW';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'BZV' or airport_code = 'BZV';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'FTX' or airport_code = 'FTX';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'OUE' or airport_code = 'OUE';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'PNR' or airport_code = 'PNR';
update airport set timezone = 'Africa/Mbabane' where city_code = 'MTS' or airport_code = 'MTS';
update airport set timezone = 'Africa/Bangui' where city_code = 'BGF' or airport_code = 'BGF';
update airport set timezone = 'Africa/Bangui' where city_code = 'BBT' or airport_code = 'BBT';
update airport set timezone = 'Africa/Malabo' where city_code = 'BSG' or airport_code = 'BSG';
update airport set timezone = 'Africa/Malabo' where city_code = 'SSG' or airport_code = 'SSG';
update airport set timezone = 'Indian/Mauritius' where city_code = 'MRU' or airport_code = 'MRU';
update airport set timezone = 'Indian/Mauritius' where city_code = 'RRG' or airport_code = 'RRG';
update airport set timezone = 'Africa/Douala' where city_code = 'TKC' or airport_code = 'TKC';
update airport set timezone = 'Africa/Douala' where city_code = 'DLA' or airport_code = 'DLA';
update airport set timezone = 'Africa/Douala' where city_code = 'MVR' or airport_code = 'MVR';
update airport set timezone = 'Africa/Douala' where city_code = 'FOM' or airport_code = 'FOM';
update airport set timezone = 'Africa/Douala' where city_code = 'NGE' or airport_code = 'NGE';
update airport set timezone = 'Africa/Douala' where city_code = 'GOU' or airport_code = 'GOU';
update airport set timezone = 'Africa/Douala' where city_code = 'BFX' or airport_code = 'BFX';
update airport set timezone = 'Africa/Douala' where city_code = 'BPC' or airport_code = 'BPC';
update airport set timezone = 'Africa/Douala' where city_code = 'YAO' or airport_code = 'YAO';
update airport set timezone = 'Africa/Lusaka' where city_code = 'LVI' or airport_code = 'LVI';
update airport set timezone = 'Africa/Lusaka' where city_code = 'LUN' or airport_code = 'LUN';
update airport set timezone = 'Africa/Lusaka' where city_code = 'MFU' or airport_code = 'MFU';
update airport set timezone = 'Africa/Lusaka' where city_code = 'NLA' or airport_code = 'NLA';
update airport set timezone = 'Africa/Lusaka' where city_code = 'KIW' or airport_code = 'KIW';
update airport set timezone = 'Indian/Comoro' where city_code = 'HAH' or airport_code = 'HAH';
update airport set timezone = 'Indian/Comoro' where city_code = 'NWA' or airport_code = 'NWA';
update airport set timezone = 'Indian/Comoro' where city_code = 'AJN' or airport_code = 'AJN';
update airport set timezone = 'Indian/Mayotte' where city_code = 'DZA' or airport_code = 'DZA';
update airport set timezone = 'Indian/Reunion' where city_code = 'RUN' or airport_code = 'RUN';
update airport set timezone = 'Indian/Reunion' where city_code = 'ZSE' or airport_code = 'ZSE';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'TNR' or airport_code = 'TNR';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'ZVA' or airport_code = 'ZVA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'SMS' or airport_code = 'SMS';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'TMM' or airport_code = 'TMM';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'MOQ' or airport_code = 'MOQ';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'DIE' or airport_code = 'DIE';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WMR' or airport_code = 'WMR';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'ZWA' or airport_code = 'ZWA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'AMB' or airport_code = 'AMB';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'ANM' or airport_code = 'ANM';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'HVA' or airport_code = 'HVA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'MJN' or airport_code = 'MJN';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'NOS' or airport_code = 'NOS';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'BPY' or airport_code = 'BPY';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WMN' or airport_code = 'WMN';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'SVB' or airport_code = 'SVB';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'VOH' or airport_code = 'VOH';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WAI' or airport_code = 'WAI';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'FTU' or airport_code = 'FTU';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WFI' or airport_code = 'WFI';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'RVA' or airport_code = 'RVA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WVK' or airport_code = 'WVK';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'MNJ' or airport_code = 'MNJ';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'MXM' or airport_code = 'MXM';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'TLE' or airport_code = 'TLE';
update airport set timezone = 'Africa/Luanda' where city_code = 'SSY' or airport_code = 'SSY';
update airport set timezone = 'Africa/Luanda' where city_code = 'BUG' or airport_code = 'BUG';
update airport set timezone = 'Africa/Luanda' where city_code = 'CAB' or airport_code = 'CAB';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'CPX' or airport_code = 'CPX';
update airport set timezone = 'Africa/Luanda' where city_code = 'NOV' or airport_code = 'NOV';
update airport set timezone = 'Africa/Luanda' where city_code = 'SVP' or airport_code = 'SVP';
update airport set timezone = 'Africa/Luanda' where city_code = 'LAD' or airport_code = 'LAD';
update airport set timezone = 'Africa/Luanda' where city_code = 'MEG' or airport_code = 'MEG';
update airport set timezone = 'Africa/Luanda' where city_code = 'SPP' or airport_code = 'SPP';
update airport set timezone = 'Africa/Luanda' where city_code = 'GXG' or airport_code = 'GXG';
update airport set timezone = 'Africa/Luanda' where city_code = 'PBN' or airport_code = 'PBN';
update airport set timezone = 'Africa/Luanda' where city_code = 'VHC' or airport_code = 'VHC';
update airport set timezone = 'Africa/Luanda' where city_code = 'SZA' or airport_code = 'SZA';
update airport set timezone = 'Africa/Luanda' where city_code = 'SDD' or airport_code = 'SDD';
update airport set timezone = 'Africa/Luanda' where city_code = 'LUO' or airport_code = 'LUO';
update airport set timezone = 'Africa/Luanda' where city_code = 'UGO' or airport_code = 'UGO';
update airport set timezone = 'Africa/Luanda' where city_code = 'XGN' or airport_code = 'XGN';
update airport set timezone = 'Africa/Libreville' where city_code = 'OYE' or airport_code = 'OYE';
update airport set timezone = 'Africa/Libreville' where city_code = 'OKN' or airport_code = 'OKN';
update airport set timezone = 'Africa/Libreville' where city_code = 'LBQ' or airport_code = 'LBQ';
update airport set timezone = 'Africa/Libreville' where city_code = 'BMM' or airport_code = 'BMM';
update airport set timezone = 'Africa/Libreville' where city_code = 'POG' or airport_code = 'POG';
update airport set timezone = 'Africa/Libreville' where city_code = 'OMB' or airport_code = 'OMB';
update airport set timezone = 'Africa/Libreville' where city_code = 'MKU' or airport_code = 'MKU';
update airport set timezone = 'Africa/Libreville' where city_code = 'LBV' or airport_code = 'LBV';
update airport set timezone = 'Africa/Libreville' where city_code = 'MVB' or airport_code = 'MVB';
update airport set timezone = 'Africa/Sao_Tome' where city_code = 'PCP' or airport_code = 'PCP';
update airport set timezone = 'Africa/Sao_Tome' where city_code = 'TMS' or airport_code = 'TMS';
update airport set timezone = 'Africa/Maputo' where city_code = 'BEW' or airport_code = 'BEW';
update airport set timezone = 'Africa/Maputo' where city_code = 'INH' or airport_code = 'INH';
update airport set timezone = 'Africa/Maputo' where city_code = 'VXC' or airport_code = 'VXC';
update airport set timezone = 'Africa/Maputo' where city_code = 'MPM' or airport_code = 'MPM';
update airport set timezone = 'Africa/Maputo' where city_code = 'MZB' or airport_code = 'MZB';
update airport set timezone = 'Africa/Maputo' where city_code = 'MNC' or airport_code = 'MNC';
update airport set timezone = 'Africa/Maputo' where city_code = 'APL' or airport_code = 'APL';
update airport set timezone = 'Africa/Maputo' where city_code = 'POL' or airport_code = 'POL';
update airport set timezone = 'Africa/Maputo' where city_code = 'UEL' or airport_code = 'UEL';
update airport set timezone = 'Africa/Maputo' where city_code = 'TET' or airport_code = 'TET';
update airport set timezone = 'Africa/Maputo' where city_code = 'VNX' or airport_code = 'VNX';
update airport set timezone = 'Indian/Mahe' where city_code = 'DES' or airport_code = 'DES';
update airport set timezone = 'Indian/Mahe' where city_code = 'SEZ' or airport_code = 'SEZ';
update airport set timezone = 'Indian/Mahe' where city_code = 'PRI' or airport_code = 'PRI';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'AEH' or airport_code = 'AEH';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'MQQ' or airport_code = 'MQQ';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'NDJ' or airport_code = 'NDJ';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'FYT' or airport_code = 'FYT';
update airport set timezone = 'Africa/Harare' where city_code = 'BUQ' or airport_code = 'BUQ';
update airport set timezone = 'Africa/Harare' where city_code = 'BFO' or airport_code = 'BFO';
update airport set timezone = 'Africa/Harare' where city_code = 'VFA' or airport_code = 'VFA';
update airport set timezone = 'Africa/Harare' where city_code = 'HRE' or airport_code = 'HRE';
update airport set timezone = 'Africa/Harare' where city_code = 'KAB' or airport_code = 'KAB';
update airport set timezone = 'Africa/Harare' where city_code = 'MVZ' or airport_code = 'MVZ';
update airport set timezone = 'Africa/Harare' where city_code = 'GWE' or airport_code = 'GWE';
update airport set timezone = 'Africa/Harare' where city_code = 'WKM' or airport_code = 'WKM';
update airport set timezone = 'Africa/Blantyre' where city_code = 'BLZ' or airport_code = 'BLZ';
update airport set timezone = 'Africa/Blantyre' where city_code = 'KGJ' or airport_code = 'KGJ';
update airport set timezone = 'Africa/Blantyre' where city_code = 'LLW' or airport_code = 'LLW';
update airport set timezone = 'Africa/Blantyre' where city_code = 'ZZU' or airport_code = 'ZZU';
update airport set timezone = 'Africa/Maseru' where city_code = 'MSU' or airport_code = 'MSU';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'FIH' or airport_code = 'FIH';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'NLO' or airport_code = 'NLO';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'MNB' or airport_code = 'MNB';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'FDU' or airport_code = 'FDU';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'KKW' or airport_code = 'KKW';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'MDK' or airport_code = 'MDK';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'BDT' or airport_code = 'BDT';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'GMA' or airport_code = 'GMA';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'LIQ' or airport_code = 'LIQ';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'FKI' or airport_code = 'FKI';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'IRP' or airport_code = 'IRP';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'BUX' or airport_code = 'BUX';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'BKY' or airport_code = 'BKY';
update airport set timezone = 'Africa/Kigali' where city_code = 'GOM' or airport_code = 'GOM';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KND' or airport_code = 'KND';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'FBM' or airport_code = 'FBM';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KWZ' or airport_code = 'KWZ';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'FMI' or airport_code = 'FMI';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KMN' or airport_code = 'KMN';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KGA' or airport_code = 'KGA';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'MJM' or airport_code = 'MJM';
update airport set timezone = 'Africa/Bamako' where city_code = 'BKO' or airport_code = 'BKO';
update airport set timezone = 'Africa/Bamako' where city_code = 'GAQ' or airport_code = 'GAQ';
update airport set timezone = 'Africa/Bamako' where city_code = 'KYS' or airport_code = 'KYS';
update airport set timezone = 'Africa/Bamako' where city_code = 'MZI' or airport_code = 'MZI';
update airport set timezone = 'Africa/Bamako' where city_code = 'TOM' or airport_code = 'TOM';
update airport set timezone = 'Africa/Banjul' where city_code = 'BJL' or airport_code = 'BJL';
update airport set timezone = 'Atlantic/Canary' where city_code = 'FUE' or airport_code = 'FUE';
update airport set timezone = 'Atlantic/Canary' where city_code = 'VDE' or airport_code = 'VDE';
update airport set timezone = 'Atlantic/Canary' where city_code = 'SPC' or airport_code = 'SPC';
update airport set timezone = 'Atlantic/Canary' where city_code = 'LPA' or airport_code = 'LPA';
update airport set timezone = 'Atlantic/Canary' where city_code = 'ACE' or airport_code = 'ACE';
update airport set timezone = 'Atlantic/Canary' where city_code = 'TFS' or airport_code = 'TFS';
update airport set timezone = 'Atlantic/Canary' where city_code = 'TFN' or airport_code = 'TFN';
update airport set timezone = 'Europe/Madrid' where city_code = 'MLN' or airport_code = 'MLN';
update airport set timezone = 'Africa/Freetown' where city_code = 'FNA' or airport_code = 'FNA';
update airport set timezone = 'Africa/Monrovia' where city_code = 'MLW' or airport_code = 'MLW';
update airport set timezone = 'Africa/Monrovia' where city_code = 'ROB' or airport_code = 'ROB';
update airport set timezone = 'Africa/Casablanca' where city_code = 'AGA' or airport_code = 'AGA';
update airport set timezone = 'Africa/Casablanca' where city_code = 'TTA' or airport_code = 'TTA';
update airport set timezone = 'Africa/Casablanca' where city_code = 'FEZ' or airport_code = 'FEZ';
update airport set timezone = 'Africa/Casablanca' where city_code = 'ERH' or airport_code = 'ERH';
update airport set timezone = 'Africa/Casablanca' where city_code = 'MEK' or airport_code = 'MEK';
update airport set timezone = 'Africa/Casablanca' where city_code = 'OUD' or airport_code = 'OUD';
update airport set timezone = 'Africa/Casablanca' where city_code = 'RBA' or airport_code = 'RBA';
update airport set timezone = 'Africa/Casablanca' where city_code = 'CMN' or airport_code = 'CMN';
update airport set timezone = 'Africa/Casablanca' where city_code = 'RAK' or airport_code = 'RAK';
update airport set timezone = 'Africa/Casablanca' where city_code = 'NNA' or airport_code = 'NNA';
update airport set timezone = 'Africa/Casablanca' where city_code = 'OZZ' or airport_code = 'OZZ';
update airport set timezone = 'Africa/Casablanca' where city_code = 'AHU' or airport_code = 'AHU';
update airport set timezone = 'Africa/Casablanca' where city_code = 'TTU' or airport_code = 'TTU';
update airport set timezone = 'Africa/Casablanca' where city_code = 'TNG' or airport_code = 'TNG';
update airport set timezone = 'Africa/Dakar' where city_code = 'ZIG' or airport_code = 'ZIG';
update airport set timezone = 'Africa/Dakar' where city_code = 'CSK' or airport_code = 'CSK';
update airport set timezone = 'Africa/Dakar' where city_code = 'KLC' or airport_code = 'KLC';
update airport set timezone = 'Africa/Dakar' where city_code = 'DKR' or airport_code = 'DKR';
update airport set timezone = 'Africa/Dakar' where city_code = 'XLS' or airport_code = 'XLS';
update airport set timezone = 'Africa/Dakar' where city_code = 'BXE' or airport_code = 'BXE';
update airport set timezone = 'Africa/Dakar' where city_code = 'KGG' or airport_code = 'KGG';
update airport set timezone = 'Africa/Dakar' where city_code = 'TUD' or airport_code = 'TUD';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'IEO' or airport_code = 'IEO';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'TIY' or airport_code = 'TIY';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'KFA' or airport_code = 'KFA';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'EMN' or airport_code = 'EMN';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'KED' or airport_code = 'KED';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'NKC' or airport_code = 'NKC';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'SEY' or airport_code = 'SEY';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'ATR' or airport_code = 'ATR';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'NDB' or airport_code = 'NDB';
update airport set timezone = 'Africa/Conakry' where city_code = 'FIG' or airport_code = 'FIG';
update airport set timezone = 'Africa/Conakry' where city_code = 'FAA' or airport_code = 'FAA';
update airport set timezone = 'Africa/Conakry' where city_code = 'LEK' or airport_code = 'LEK';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'SID' or airport_code = 'SID';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'BVC' or airport_code = 'BVC';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'MMO' or airport_code = 'MMO';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'SNE' or airport_code = 'SNE';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'VXE' or airport_code = 'VXE';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'ADD' or airport_code = 'ADD';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'AMH' or airport_code = 'AMH';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'AXU' or airport_code = 'AXU';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'BJR' or airport_code = 'BJR';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'DIR' or airport_code = 'DIR';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'GMB' or airport_code = 'GMB';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'GDQ' or airport_code = 'GDQ';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'JIM' or airport_code = 'JIM';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'LLI' or airport_code = 'LLI';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'MQX' or airport_code = 'MQX';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'ASO' or airport_code = 'ASO';
update airport set timezone = 'Africa/Bujumbura' where city_code = 'BJM' or airport_code = 'BJM';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'HGA' or airport_code = 'HGA';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'BBO' or airport_code = 'BBO';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'KMU' or airport_code = 'KMU';
update airport set timezone = 'America/New_York' where city_code = 'C91' or airport_code = 'C91';
update airport set timezone = 'Africa/Cairo' where city_code = 'ALY' or airport_code = 'ALY';
update airport set timezone = 'Africa/Cairo' where city_code = 'ABS' or airport_code = 'ABS';
update airport set timezone = 'Africa/Cairo' where city_code = 'CAI' or airport_code = 'CAI';
update airport set timezone = 'Africa/Cairo' where city_code = 'HRG' or airport_code = 'HRG';
update airport set timezone = 'Africa/Cairo' where city_code = 'EGR' or airport_code = 'EGR';
update airport set timezone = 'Africa/Cairo' where city_code = 'LXR' or airport_code = 'LXR';
update airport set timezone = 'Africa/Cairo' where city_code = 'MUH' or airport_code = 'MUH';
update airport set timezone = 'Africa/Cairo' where city_code = 'PSD' or airport_code = 'PSD';
update airport set timezone = 'Africa/Cairo' where city_code = 'SKV' or airport_code = 'SKV';
update airport set timezone = 'Africa/Cairo' where city_code = 'ASW' or airport_code = 'ASW';
update airport set timezone = 'Africa/Cairo' where city_code = 'ELT' or airport_code = 'ELT';
update airport set timezone = 'Africa/Nairobi' where city_code = 'EDL' or airport_code = 'EDL';
update airport set timezone = 'Africa/Nairobi' where city_code = 'KIS' or airport_code = 'KIS';
update airport set timezone = 'Africa/Nairobi' where city_code = 'KTL' or airport_code = 'KTL';
update airport set timezone = 'America/New_York' where city_code = 'CDI' or airport_code = 'CDI';
update airport set timezone = 'Africa/Nairobi' where city_code = 'LOK' or airport_code = 'LOK';
update airport set timezone = 'Africa/Nairobi' where city_code = 'LAU' or airport_code = 'LAU';
update airport set timezone = 'Africa/Nairobi' where city_code = 'MBA' or airport_code = 'MBA';
update airport set timezone = 'Africa/Nairobi' where city_code = 'WIL' or airport_code = 'WIL';
update airport set timezone = 'Africa/Nairobi' where city_code = 'WJR' or airport_code = 'WJR';
update airport set timezone = 'Africa/Tripoli' where city_code = 'GHT' or airport_code = 'GHT';
update airport set timezone = 'Africa/Tripoli' where city_code = 'AKF' or airport_code = 'AKF';
update airport set timezone = 'Africa/Tripoli' where city_code = 'BEN' or airport_code = 'BEN';
update airport set timezone = 'Africa/Tripoli' where city_code = 'SEB' or airport_code = 'SEB';
update airport set timezone = 'Africa/Tripoli' where city_code = 'TIP' or airport_code = 'TIP';
update airport set timezone = 'Africa/Tripoli' where city_code = 'LTD' or airport_code = 'LTD';
update airport set timezone = 'Africa/Kigali' where city_code = 'GYI' or airport_code = 'GYI';
update airport set timezone = 'Africa/Kigali' where city_code = 'KGL' or airport_code = 'KGL';
update airport set timezone = 'Africa/Kigali' where city_code = 'KME' or airport_code = 'KME';
update airport set timezone = 'Africa/Khartoum' where city_code = 'DOG' or airport_code = 'DOG';
update airport set timezone = 'Africa/Khartoum' where city_code = 'ELF' or airport_code = 'ELF';
update airport set timezone = 'Africa/Khartoum' where city_code = 'KSL' or airport_code = 'KSL';
update airport set timezone = 'Africa/Khartoum' where city_code = 'EBD' or airport_code = 'EBD';
update airport set timezone = 'Africa/Juba' where city_code = 'JUB' or airport_code = 'JUB';
update airport set timezone = 'Africa/Juba' where city_code = 'MAK' or airport_code = 'MAK';
update airport set timezone = 'Africa/Khartoum' where city_code = 'KRT' or airport_code = 'KRT';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'ARK' or airport_code = 'ARK';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'DAR' or airport_code = 'DAR';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'DOD' or airport_code = 'DOD';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'IRI' or airport_code = 'IRI';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'JRO' or airport_code = 'JRO';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'LKY' or airport_code = 'LKY';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'MYW' or airport_code = 'MYW';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'MWZ' or airport_code = 'MWZ';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'PMA' or airport_code = 'PMA';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'TGT' or airport_code = 'TGT';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'ZNZ' or airport_code = 'ZNZ';
update airport set timezone = 'Africa/Kampala' where city_code = 'EBB' or airport_code = 'EBB';
update airport set timezone = 'Europe/Berlin' where city_code = 'QDU' or airport_code = 'QDU';
update airport set timezone = 'Africa/Kampala' where city_code = 'SRT' or airport_code = 'SRT';
update airport set timezone = 'Europe/Tirane' where city_code = 'TIA' or airport_code = 'TIA';
update airport set timezone = 'Europe/Sofia' where city_code = 'BOJ' or airport_code = 'BOJ';
update airport set timezone = 'Europe/Sofia' where city_code = 'GOZ' or airport_code = 'GOZ';
update airport set timezone = 'Europe/Sofia' where city_code = 'PDV' or airport_code = 'PDV';
update airport set timezone = 'Europe/Sofia' where city_code = 'SOF' or airport_code = 'SOF';
update airport set timezone = 'Europe/Sofia' where city_code = 'VAR' or airport_code = 'VAR';
update airport set timezone = 'Asia/Nicosia' where city_code = 'LCA' or airport_code = 'LCA';
update airport set timezone = 'Asia/Nicosia' where city_code = 'PFO' or airport_code = 'PFO';
update airport set timezone = 'Europe/London' where city_code = 'AKT' or airport_code = 'AKT';
update airport set timezone = 'Europe/Zagreb' where city_code = 'DBV' or airport_code = 'DBV';
update airport set timezone = 'Europe/Zagreb' where city_code = 'OSI' or airport_code = 'OSI';
update airport set timezone = 'Europe/Zagreb' where city_code = 'PUY' or airport_code = 'PUY';
update airport set timezone = 'Europe/Zagreb' where city_code = 'RJK' or airport_code = 'RJK';
update airport set timezone = 'Europe/Zagreb' where city_code = 'SPU' or airport_code = 'SPU';
update airport set timezone = 'Europe/Zagreb' where city_code = 'ZAG' or airport_code = 'ZAG';
update airport set timezone = 'Europe/Zagreb' where city_code = 'ZAD' or airport_code = 'ZAD';
update airport set timezone = 'Europe/Madrid' where city_code = 'ALC' or airport_code = 'ALC';
update airport set timezone = 'Europe/Madrid' where city_code = 'LEI' or airport_code = 'LEI';
update airport set timezone = 'Europe/Madrid' where city_code = 'OVD' or airport_code = 'OVD';
update airport set timezone = 'Europe/Madrid' where city_code = 'ODB' or airport_code = 'ODB';
update airport set timezone = 'Europe/Madrid' where city_code = 'BIO' or airport_code = 'BIO';
update airport set timezone = 'Europe/Madrid' where city_code = 'BCN' or airport_code = 'BCN';
update airport set timezone = 'Europe/Madrid' where city_code = 'BJZ' or airport_code = 'BJZ';
update airport set timezone = 'Europe/Madrid' where city_code = 'LCG' or airport_code = 'LCG';
update airport set timezone = 'Europe/Madrid' where city_code = 'GRO' or airport_code = 'GRO';
update airport set timezone = 'Europe/Madrid' where city_code = 'GRX' or airport_code = 'GRX';
update airport set timezone = 'Europe/Madrid' where city_code = 'IBZ' or airport_code = 'IBZ';
update airport set timezone = 'Europe/Madrid' where city_code = 'XRY' or airport_code = 'XRY';
update airport set timezone = 'Europe/Madrid' where city_code = 'MJV' or airport_code = 'MJV';
update airport set timezone = 'Europe/Athens' where city_code = 'PKH' or airport_code = 'PKH';
update airport set timezone = 'Europe/Madrid' where city_code = 'MAD' or airport_code = 'MAD';
update airport set timezone = 'Europe/Madrid' where city_code = 'AGP' or airport_code = 'AGP';
update airport set timezone = 'Europe/Madrid' where city_code = 'MAH' or airport_code = 'MAH';
update airport set timezone = 'Europe/Madrid' where city_code = 'OZP' or airport_code = 'OZP';
update airport set timezone = 'Europe/Madrid' where city_code = 'PNA' or airport_code = 'PNA';
update airport set timezone = 'Europe/Madrid' where city_code = 'REU' or airport_code = 'REU';
update airport set timezone = 'Europe/Madrid' where city_code = 'SLM' or airport_code = 'SLM';
update airport set timezone = 'Europe/Madrid' where city_code = 'EAS' or airport_code = 'EAS';
update airport set timezone = 'Europe/Madrid' where city_code = 'SCQ' or airport_code = 'SCQ';
update airport set timezone = 'Europe/Madrid' where city_code = 'LEU' or airport_code = 'LEU';
update airport set timezone = 'Europe/Madrid' where city_code = 'TOJ' or airport_code = 'TOJ';
update airport set timezone = 'Europe/Madrid' where city_code = 'VLC' or airport_code = 'VLC';
update airport set timezone = 'Europe/Madrid' where city_code = 'VLL' or airport_code = 'VLL';
update airport set timezone = 'Europe/Madrid' where city_code = 'VIT' or airport_code = 'VIT';
update airport set timezone = 'Europe/Madrid' where city_code = 'VGO' or airport_code = 'VGO';
update airport set timezone = 'Europe/Madrid' where city_code = 'SDR' or airport_code = 'SDR';
update airport set timezone = 'Europe/Madrid' where city_code = 'ZAZ' or airport_code = 'ZAZ';
update airport set timezone = 'Europe/Madrid' where city_code = 'SVQ' or airport_code = 'SVQ';
update airport set timezone = 'Europe/Paris' where city_code = 'CQF' or airport_code = 'CQF';
update airport set timezone = 'Europe/Paris' where city_code = 'LTQ' or airport_code = 'LTQ';
update airport set timezone = 'Europe/Paris' where city_code = 'AGF' or airport_code = 'AGF';
update airport set timezone = 'Europe/Paris' where city_code = 'BOD' or airport_code = 'BOD';
update airport set timezone = 'Europe/Paris' where city_code = 'EGC' or airport_code = 'EGC';
update airport set timezone = 'Europe/Paris' where city_code = 'CNG' or airport_code = 'CNG';
update airport set timezone = 'Europe/Paris' where city_code = 'PIS' or airport_code = 'PIS';
update airport set timezone = 'Europe/Paris' where city_code = 'LIG' or airport_code = 'LIG';
update airport set timezone = 'Europe/Paris' where city_code = 'NIT' or airport_code = 'NIT';
update airport set timezone = 'Europe/Paris' where city_code = 'TLS' or airport_code = 'TLS';
update airport set timezone = 'Europe/Paris' where city_code = 'PUF' or airport_code = 'PUF';
update airport set timezone = 'Europe/Paris' where city_code = 'LDE' or airport_code = 'LDE';
update airport set timezone = 'Europe/Paris' where city_code = 'ANG' or airport_code = 'ANG';
update airport set timezone = 'Europe/Paris' where city_code = 'BVE' or airport_code = 'BVE';
update airport set timezone = 'Europe/Paris' where city_code = 'PGX' or airport_code = 'PGX';
update airport set timezone = 'Europe/Paris' where city_code = 'BIQ' or airport_code = 'BIQ';
update airport set timezone = 'Europe/Paris' where city_code = 'XAC' or airport_code = 'XAC';
update airport set timezone = 'Europe/Paris' where city_code = 'LBI' or airport_code = 'LBI';
update airport set timezone = 'Europe/Paris' where city_code = 'DCM' or airport_code = 'DCM';
update airport set timezone = 'Europe/Paris' where city_code = 'RDZ' or airport_code = 'RDZ';
update airport set timezone = 'Europe/Paris' where city_code = 'RYN' or airport_code = 'RYN';
update airport set timezone = 'Europe/Paris' where city_code = 'RCO' or airport_code = 'RCO';
update airport set timezone = 'Europe/Paris' where city_code = 'CMR' or airport_code = 'CMR';
update airport set timezone = 'Europe/Paris' where city_code = 'DLE' or airport_code = 'DLE';
update airport set timezone = 'Europe/Paris' where city_code = 'OBS' or airport_code = 'OBS';
update airport set timezone = 'Europe/Paris' where city_code = 'LPY' or airport_code = 'LPY';
update airport set timezone = 'Europe/Paris' where city_code = 'XBK' or airport_code = 'XBK';
update airport set timezone = 'Europe/Paris' where city_code = 'XVF' or airport_code = 'XVF';
update airport set timezone = 'Europe/Paris' where city_code = 'XMU' or airport_code = 'XMU';
update airport set timezone = 'Europe/Paris' where city_code = 'ETZ' or airport_code = 'ETZ';
update airport set timezone = 'Europe/Paris' where city_code = 'BIA' or airport_code = 'BIA';
update airport set timezone = 'Europe/Paris' where city_code = 'CLY' or airport_code = 'CLY';
update airport set timezone = 'Europe/Paris' where city_code = 'FSC' or airport_code = 'FSC';
update airport set timezone = 'Europe/Paris' where city_code = 'AJA' or airport_code = 'AJA';
update airport set timezone = 'Europe/Paris' where city_code = 'SOZ' or airport_code = 'SOZ';
update airport set timezone = 'Europe/Paris' where city_code = 'AUF' or airport_code = 'AUF';
update airport set timezone = 'Europe/Paris' where city_code = 'CMF' or airport_code = 'CMF';
update airport set timezone = 'Europe/Paris' where city_code = 'CFE' or airport_code = 'CFE';
update airport set timezone = 'Europe/Paris' where city_code = 'BOU' or airport_code = 'BOU';
update airport set timezone = 'Europe/Paris' where city_code = 'XCD' or airport_code = 'XCD';
update airport set timezone = 'Europe/Paris' where city_code = 'QNJ' or airport_code = 'QNJ';
update airport set timezone = 'Europe/Paris' where city_code = 'LYS' or airport_code = 'LYS';
update airport set timezone = 'Europe/Paris' where city_code = 'QNX' or airport_code = 'QNX';
update airport set timezone = 'Europe/Paris' where city_code = 'RNE' or airport_code = 'RNE';
update airport set timezone = 'Europe/Paris' where city_code = 'NCY' or airport_code = 'NCY';
update airport set timezone = 'Europe/Paris' where city_code = 'GNB' or airport_code = 'GNB';
update airport set timezone = 'Europe/Paris' where city_code = 'MCU' or airport_code = 'MCU';
update airport set timezone = 'Europe/Paris' where city_code = 'VAF' or airport_code = 'VAF';
update airport set timezone = 'Europe/Paris' where city_code = 'VHY' or airport_code = 'VHY';
update airport set timezone = 'Europe/Paris' where city_code = 'AUR' or airport_code = 'AUR';
update airport set timezone = 'Europe/Paris' where city_code = 'CHR' or airport_code = 'CHR';
update airport set timezone = 'Europe/Paris' where city_code = 'LYN' or airport_code = 'LYN';
update airport set timezone = 'Europe/Paris' where city_code = 'QXB' or airport_code = 'QXB';
update airport set timezone = 'Europe/Paris' where city_code = 'CEQ' or airport_code = 'CEQ';
update airport set timezone = 'Europe/Paris' where city_code = 'EBU' or airport_code = 'EBU';
update airport set timezone = 'Europe/Paris' where city_code = 'CCF' or airport_code = 'CCF';
update airport set timezone = 'Europe/Paris' where city_code = 'MRS' or airport_code = 'MRS';
update airport set timezone = 'Europe/Paris' where city_code = 'NCE' or airport_code = 'NCE';
update airport set timezone = 'Europe/Paris' where city_code = 'PGF' or airport_code = 'PGF';
update airport set timezone = 'Europe/Paris' where city_code = 'CTT' or airport_code = 'CTT';
update airport set timezone = 'Europe/Paris' where city_code = 'MPL' or airport_code = 'MPL';
update airport set timezone = 'Europe/Paris' where city_code = 'BZR' or airport_code = 'BZR';
update airport set timezone = 'Europe/Paris' where city_code = 'AVN' or airport_code = 'AVN';
update airport set timezone = 'Europe/Paris' where city_code = 'MEN' or airport_code = 'MEN';
update airport set timezone = 'Europe/Paris' where city_code = 'BVA' or airport_code = 'BVA';
update airport set timezone = 'Europe/Paris' where city_code = 'LEH' or airport_code = 'LEH';
update airport set timezone = 'Europe/Paris' where city_code = 'ORE' or airport_code = 'ORE';
update airport set timezone = 'Europe/Paris' where city_code = 'XCR' or airport_code = 'XCR';
update airport set timezone = 'Europe/Paris' where city_code = 'URO' or airport_code = 'URO';
update airport set timezone = 'Europe/Paris' where city_code = 'TUF' or airport_code = 'TUF';
update airport set timezone = 'Europe/Paris' where city_code = 'CET' or airport_code = 'CET';
update airport set timezone = 'Europe/Paris' where city_code = 'LVA' or airport_code = 'LVA';
update airport set timezone = 'Europe/Paris' where city_code = 'LBG' or airport_code = 'LBG';
update airport set timezone = 'Europe/Paris' where city_code = 'CSF' or airport_code = 'CSF';
update airport set timezone = 'Europe/Paris' where city_code = 'CDG' or airport_code = 'CDG';
update airport set timezone = 'Europe/Paris' where city_code = 'TNF' or airport_code = 'TNF';
update airport set timezone = 'Europe/Paris' where city_code = 'ORY' or airport_code = 'ORY';
update airport set timezone = 'Europe/Paris' where city_code = 'POX' or airport_code = 'POX';
update airport set timezone = 'Europe/Paris' where city_code = 'QYR' or airport_code = 'QYR';
update airport set timezone = 'Europe/Paris' where city_code = 'NVS' or airport_code = 'NVS';
update airport set timezone = 'Europe/Paris' where city_code = 'LIL' or airport_code = 'LIL';
update airport set timezone = 'Europe/Paris' where city_code = 'BES' or airport_code = 'BES';
update airport set timezone = 'Europe/Paris' where city_code = 'CER' or airport_code = 'CER';
update airport set timezone = 'Europe/Paris' where city_code = 'DNR' or airport_code = 'DNR';
update airport set timezone = 'Europe/Paris' where city_code = 'GFR' or airport_code = 'GFR';
update airport set timezone = 'Europe/Paris' where city_code = 'DOL' or airport_code = 'DOL';
update airport set timezone = 'Europe/Paris' where city_code = 'LRT' or airport_code = 'LRT';
update airport set timezone = 'Europe/Paris' where city_code = 'EDM' or airport_code = 'EDM';
update airport set timezone = 'Europe/Paris' where city_code = 'CFR' or airport_code = 'CFR';
update airport set timezone = 'Europe/Paris' where city_code = 'LME' or airport_code = 'LME';
update airport set timezone = 'Europe/Paris' where city_code = 'RNS' or airport_code = 'RNS';
update airport set timezone = 'Europe/Paris' where city_code = 'LAI' or airport_code = 'LAI';
update airport set timezone = 'Europe/Paris' where city_code = 'UIP' or airport_code = 'UIP';
update airport set timezone = 'Europe/Paris' where city_code = 'NTE' or airport_code = 'NTE';
update airport set timezone = 'Europe/Paris' where city_code = 'SBK' or airport_code = 'SBK';
update airport set timezone = 'Europe/Paris' where city_code = 'MXN' or airport_code = 'MXN';
update airport set timezone = 'Europe/Paris' where city_code = 'VNE' or airport_code = 'VNE';
update airport set timezone = 'Europe/Paris' where city_code = 'SNR' or airport_code = 'SNR';
update airport set timezone = 'Europe/Paris' where city_code = 'MLH' or airport_code = 'MLH';
update airport set timezone = 'Europe/Paris' where city_code = 'DIJ' or airport_code = 'DIJ';
update airport set timezone = 'Europe/Paris' where city_code = 'MZM' or airport_code = 'MZM';
update airport set timezone = 'Europe/Paris' where city_code = 'EPL' or airport_code = 'EPL';
update airport set timezone = 'Europe/Paris' where city_code = 'ENC' or airport_code = 'ENC';
update airport set timezone = 'Europe/Paris' where city_code = 'RHE' or airport_code = 'RHE';
update airport set timezone = 'Europe/Paris' where city_code = 'SXB' or airport_code = 'SXB';
update airport set timezone = 'Europe/Paris' where city_code = 'TLN' or airport_code = 'TLN';
update airport set timezone = 'Europe/Paris' where city_code = 'FNI' or airport_code = 'FNI';
update airport set timezone = 'America/Miquelon' where city_code = 'MQC' or airport_code = 'MQC';
update airport set timezone = 'America/Miquelon' where city_code = 'FSP' or airport_code = 'FSP';
update airport set timezone = 'Europe/Athens' where city_code = 'PYR' or airport_code = 'PYR';
update airport set timezone = 'Europe/Athens' where city_code = 'AGQ' or airport_code = 'AGQ';
update airport set timezone = 'Europe/Athens' where city_code = 'AXD' or airport_code = 'AXD';
update airport set timezone = 'Europe/Athens' where city_code = 'VOL' or airport_code = 'VOL';
update airport set timezone = 'Europe/Athens' where city_code = 'JKH' or airport_code = 'JKH';
update airport set timezone = 'Europe/Athens' where city_code = 'IOA' or airport_code = 'IOA';
update airport set timezone = 'Europe/Athens' where city_code = 'HER' or airport_code = 'HER';
update airport set timezone = 'Europe/Athens' where city_code = 'KSO' or airport_code = 'KSO';
update airport set timezone = 'Europe/Athens' where city_code = 'KIT' or airport_code = 'KIT';
update airport set timezone = 'Europe/Athens' where city_code = 'EFL' or airport_code = 'EFL';
update airport set timezone = 'Europe/Athens' where city_code = 'KLX' or airport_code = 'KLX';
update airport set timezone = 'Europe/Athens' where city_code = 'KGS' or airport_code = 'KGS';
update airport set timezone = 'Europe/Athens' where city_code = 'AOK' or airport_code = 'AOK';
update airport set timezone = 'Europe/Athens' where city_code = 'CFU' or airport_code = 'CFU';
update airport set timezone = 'Europe/Athens' where city_code = 'KSJ' or airport_code = 'KSJ';
update airport set timezone = 'Europe/Athens' where city_code = 'KVA' or airport_code = 'KVA';
update airport set timezone = 'Europe/Athens' where city_code = 'KZI' or airport_code = 'KZI';
update airport set timezone = 'Europe/Athens' where city_code = 'LRS' or airport_code = 'LRS';
update airport set timezone = 'Europe/Athens' where city_code = 'LXS' or airport_code = 'LXS';
update airport set timezone = 'Europe/Athens' where city_code = 'LRA' or airport_code = 'LRA';
update airport set timezone = 'Europe/Athens' where city_code = 'JMK' or airport_code = 'JMK';
update airport set timezone = 'Europe/Athens' where city_code = 'MJT' or airport_code = 'MJT';
update airport set timezone = 'Europe/Athens' where city_code = 'PVK' or airport_code = 'PVK';
update airport set timezone = 'Europe/Athens' where city_code = 'RHO' or airport_code = 'RHO';
update airport set timezone = 'Europe/Athens' where city_code = 'GPA' or airport_code = 'GPA';
update airport set timezone = 'Europe/Athens' where city_code = 'CHQ' or airport_code = 'CHQ';
update airport set timezone = 'Europe/Athens' where city_code = 'JSI' or airport_code = 'JSI';
update airport set timezone = 'Europe/Athens' where city_code = 'SMI' or airport_code = 'SMI';
update airport set timezone = 'Europe/London' where city_code = 'LYM' or airport_code = 'LYM';
update airport set timezone = 'Europe/Athens' where city_code = 'JTR' or airport_code = 'JTR';
update airport set timezone = 'Europe/Athens' where city_code = 'JSH' or airport_code = 'JSH';
update airport set timezone = 'Europe/Athens' where city_code = 'SKU' or airport_code = 'SKU';
update airport set timezone = 'Europe/Athens' where city_code = 'SKG' or airport_code = 'SKG';
update airport set timezone = 'Europe/Athens' where city_code = 'ZTH' or airport_code = 'ZTH';
update airport set timezone = 'Europe/Budapest' where city_code = 'BUD' or airport_code = 'BUD';
update airport set timezone = 'Europe/Budapest' where city_code = 'DEB' or airport_code = 'DEB';
update airport set timezone = 'America/Chicago' where city_code = 'SUE' or airport_code = 'SUE';
update airport set timezone = 'Europe/Rome' where city_code = 'CRV' or airport_code = 'CRV';
update airport set timezone = 'Europe/Rome' where city_code = 'BRI' or airport_code = 'BRI';
update airport set timezone = 'Europe/Rome' where city_code = 'FOG' or airport_code = 'FOG';
update airport set timezone = 'Europe/Rome' where city_code = 'TAR' or airport_code = 'TAR';
update airport set timezone = 'Europe/Rome' where city_code = 'LCC' or airport_code = 'LCC';
update airport set timezone = 'Europe/Rome' where city_code = 'PSR' or airport_code = 'PSR';
update airport set timezone = 'Europe/Rome' where city_code = 'BDS' or airport_code = 'BDS';
update airport set timezone = 'Europe/Rome' where city_code = 'SUF' or airport_code = 'SUF';
update airport set timezone = 'Europe/Rome' where city_code = 'CTA' or airport_code = 'CTA';
update airport set timezone = 'Europe/Rome' where city_code = 'LMP' or airport_code = 'LMP';
update airport set timezone = 'Europe/Rome' where city_code = 'PNL' or airport_code = 'PNL';
update airport set timezone = 'Europe/Rome' where city_code = 'PMO' or airport_code = 'PMO';
update airport set timezone = 'Europe/Rome' where city_code = 'REG' or airport_code = 'REG';
update airport set timezone = 'Europe/Rome' where city_code = 'TPS' or airport_code = 'TPS';
update airport set timezone = 'Europe/Rome' where city_code = 'NSY' or airport_code = 'NSY';
update airport set timezone = 'Europe/Rome' where city_code = 'AHO' or airport_code = 'AHO';
update airport set timezone = 'Europe/Rome' where city_code = 'DCI' or airport_code = 'DCI';
update airport set timezone = 'Europe/Rome' where city_code = 'CAG' or airport_code = 'CAG';
update airport set timezone = 'Europe/Rome' where city_code = 'OLB' or airport_code = 'OLB';
update airport set timezone = 'Europe/Rome' where city_code = 'TTB' or airport_code = 'TTB';
update airport set timezone = 'Europe/Rome' where city_code = 'MXP' or airport_code = 'MXP';
update airport set timezone = 'Europe/Rome' where city_code = 'BGY' or airport_code = 'BGY';
update airport set timezone = 'Europe/Rome' where city_code = 'TRN' or airport_code = 'TRN';
update airport set timezone = 'Europe/Rome' where city_code = 'ALL' or airport_code = 'ALL';
update airport set timezone = 'Europe/Rome' where city_code = 'GOA' or airport_code = 'GOA';
update airport set timezone = 'Europe/Rome' where city_code = 'LIN' or airport_code = 'LIN';
update airport set timezone = 'Europe/Rome' where city_code = 'PMF' or airport_code = 'PMF';
update airport set timezone = 'Europe/Rome' where city_code = 'QPZ' or airport_code = 'QPZ';
update airport set timezone = 'America/New_York' where city_code = '0P2' or airport_code = '0P2';
update airport set timezone = 'Europe/Rome' where city_code = 'CUF' or airport_code = 'CUF';
update airport set timezone = 'Europe/Rome' where city_code = 'AVB' or airport_code = 'AVB';
update airport set timezone = 'Europe/Rome' where city_code = 'BZO' or airport_code = 'BZO';
update airport set timezone = 'Europe/Rome' where city_code = 'BLQ' or airport_code = 'BLQ';
update airport set timezone = 'Europe/Rome' where city_code = 'TSF' or airport_code = 'TSF';
update airport set timezone = 'Europe/Rome' where city_code = 'FRL' or airport_code = 'FRL';
update airport set timezone = 'Europe/Rome' where city_code = 'VBS' or airport_code = 'VBS';
update airport set timezone = 'Europe/Rome' where city_code = 'TRS' or airport_code = 'TRS';
update airport set timezone = 'Europe/Rome' where city_code = 'RMI' or airport_code = 'RMI';
update airport set timezone = 'Europe/Rome' where city_code = 'VIC' or airport_code = 'VIC';
update airport set timezone = 'Europe/Rome' where city_code = 'QPA' or airport_code = 'QPA';
update airport set timezone = 'Europe/Rome' where city_code = 'VRN' or airport_code = 'VRN';
update airport set timezone = 'Europe/Rome' where city_code = 'VCE' or airport_code = 'VCE';
update airport set timezone = 'Europe/Rome' where city_code = 'SAY' or airport_code = 'SAY';
update airport set timezone = 'Europe/Rome' where city_code = 'CIA' or airport_code = 'CIA';
update airport set timezone = 'Europe/Rome' where city_code = 'FCO' or airport_code = 'FCO';
update airport set timezone = 'Europe/Rome' where city_code = 'EBA' or airport_code = 'EBA';
update airport set timezone = 'Europe/Rome' where city_code = 'QLT' or airport_code = 'QLT';
update airport set timezone = 'Europe/Rome' where city_code = 'NAP' or airport_code = 'NAP';
update airport set timezone = 'Europe/Rome' where city_code = 'PSA' or airport_code = 'PSA';
update airport set timezone = 'Europe/Rome' where city_code = 'FLR' or airport_code = 'FLR';
update airport set timezone = 'Europe/Rome' where city_code = 'GRS' or airport_code = 'GRS';
update airport set timezone = 'Europe/Rome' where city_code = 'PEG' or airport_code = 'PEG';
update airport set timezone = 'Europe/Ljubljana' where city_code = 'LJU' or airport_code = 'LJU';
update airport set timezone = 'Europe/Ljubljana' where city_code = 'MBX' or airport_code = 'MBX';
update airport set timezone = 'Europe/Ljubljana' where city_code = 'POW' or airport_code = 'POW';
update airport set timezone = 'Europe/Prague' where city_code = 'KLV' or airport_code = 'KLV';
update airport set timezone = 'Europe/Prague' where city_code = 'OSR' or airport_code = 'OSR';
update airport set timezone = 'Europe/Prague' where city_code = 'PED' or airport_code = 'PED';
update airport set timezone = 'Europe/Prague' where city_code = 'PRV' or airport_code = 'PRV';
update airport set timezone = 'Europe/Prague' where city_code = 'PRG' or airport_code = 'PRG';
update airport set timezone = 'Europe/Prague' where city_code = 'BRQ' or airport_code = 'BRQ';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'TLV' or airport_code = 'TLV';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'BEV' or airport_code = 'BEV';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'ETH' or airport_code = 'ETH';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'HFA' or airport_code = 'HFA';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'RPN' or airport_code = 'RPN';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'VDA' or airport_code = 'VDA';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'SDV' or airport_code = 'SDV';
update airport set timezone = 'Europe/Malta' where city_code = 'MLA' or airport_code = 'MLA';
update airport set timezone = 'Europe/Vienna' where city_code = 'GRZ' or airport_code = 'GRZ';
update airport set timezone = 'Europe/Vienna' where city_code = 'INN' or airport_code = 'INN';
update airport set timezone = 'Europe/Vienna' where city_code = 'LNZ' or airport_code = 'LNZ';
update airport set timezone = 'Europe/Vienna' where city_code = 'SZG' or airport_code = 'SZG';
update airport set timezone = 'Europe/Vienna' where city_code = 'VIE' or airport_code = 'VIE';
update airport set timezone = 'Atlantic/Azores' where city_code = 'SMA' or airport_code = 'SMA';
update airport set timezone = 'Europe/Lisbon' where city_code = 'BGC' or airport_code = 'BGC';
update airport set timezone = 'Atlantic/Azores' where city_code = 'FLW' or airport_code = 'FLW';
update airport set timezone = 'Europe/Lisbon' where city_code = 'FAO' or airport_code = 'FAO';
update airport set timezone = 'Atlantic/Azores' where city_code = 'GRW' or airport_code = 'GRW';
update airport set timezone = 'Atlantic/Azores' where city_code = 'HOR' or airport_code = 'HOR';
update airport set timezone = 'Atlantic/Azores' where city_code = 'TER' or airport_code = 'TER';
update airport set timezone = 'Atlantic/Azores' where city_code = 'PDL' or airport_code = 'PDL';
update airport set timezone = 'Atlantic/Azores' where city_code = 'PIX' or airport_code = 'PIX';
update airport set timezone = 'Europe/Lisbon' where city_code = 'OPO' or airport_code = 'OPO';
update airport set timezone = 'Europe/Lisbon' where city_code = 'PXO' or airport_code = 'PXO';
update airport set timezone = 'Europe/Lisbon' where city_code = 'LIS' or airport_code = 'LIS';
update airport set timezone = 'Atlantic/Azores' where city_code = 'SJZ' or airport_code = 'SJZ';
update airport set timezone = 'Europe/Lisbon' where city_code = 'VRL' or airport_code = 'VRL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PDT' or airport_code = 'PDT';
update airport set timezone = 'Europe/Sarajevo' where city_code = 'OMO' or airport_code = 'OMO';
update airport set timezone = 'Europe/Sarajevo' where city_code = 'SJJ' or airport_code = 'SJJ';
update airport set timezone = 'Europe/Bucharest' where city_code = 'ARW' or airport_code = 'ARW';
update airport set timezone = 'Europe/Bucharest' where city_code = 'BCM' or airport_code = 'BCM';
update airport set timezone = 'Europe/Bucharest' where city_code = 'BAY' or airport_code = 'BAY';
update airport set timezone = 'Europe/Bucharest' where city_code = 'BBU' or airport_code = 'BBU';
update airport set timezone = 'Europe/Bucharest' where city_code = 'CND' or airport_code = 'CND';
update airport set timezone = 'Europe/Bucharest' where city_code = 'CLJ' or airport_code = 'CLJ';
update airport set timezone = 'Europe/Bucharest' where city_code = 'CSB' or airport_code = 'CSB';
update airport set timezone = 'Europe/Bucharest' where city_code = 'CRA' or airport_code = 'CRA';
update airport set timezone = 'Europe/Bucharest' where city_code = 'IAS' or airport_code = 'IAS';
update airport set timezone = 'Europe/Bucharest' where city_code = 'OMR' or airport_code = 'OMR';
update airport set timezone = 'Europe/Bucharest' where city_code = 'OTP' or airport_code = 'OTP';
update airport set timezone = 'Europe/Bucharest' where city_code = 'SBZ' or airport_code = 'SBZ';
update airport set timezone = 'Europe/Bucharest' where city_code = 'SUJ' or airport_code = 'SUJ';
update airport set timezone = 'Europe/Bucharest' where city_code = 'SCV' or airport_code = 'SCV';
update airport set timezone = 'Europe/Bucharest' where city_code = 'TCE' or airport_code = 'TCE';
update airport set timezone = 'Europe/Bucharest' where city_code = 'TGM' or airport_code = 'TGM';
update airport set timezone = 'Europe/Bucharest' where city_code = 'TSR' or airport_code = 'TSR';
update airport set timezone = 'Europe/Paris' where city_code = 'GVA' or airport_code = 'GVA';
update airport set timezone = 'Europe/Zurich' where city_code = 'SIR' or airport_code = 'SIR';
update airport set timezone = 'Europe/Zurich' where city_code = 'LUG' or airport_code = 'LUG';
update airport set timezone = 'Europe/Zurich' where city_code = 'BRN' or airport_code = 'BRN';
update airport set timezone = 'Europe/Zurich' where city_code = 'ZRH' or airport_code = 'ZRH';
update airport set timezone = 'Europe/Zurich' where city_code = 'ACH' or airport_code = 'ACH';
update airport set timezone = 'Europe/Zurich' where city_code = 'SMV' or airport_code = 'SMV';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ESB' or airport_code = 'ESB';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ANK' or airport_code = 'ANK';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ADA' or airport_code = 'ADA';
update airport set timezone = 'Europe/Istanbul' where city_code = 'AFY' or airport_code = 'AFY';
update airport set timezone = 'Europe/Istanbul' where city_code = 'AYT' or airport_code = 'AYT';
update airport set timezone = 'Europe/Istanbul' where city_code = 'GZT' or airport_code = 'GZT';
update airport set timezone = 'Europe/Istanbul' where city_code = 'KYA' or airport_code = 'KYA';
update airport set timezone = 'Europe/Istanbul' where city_code = 'MZH' or airport_code = 'MZH';
update airport set timezone = 'Europe/Istanbul' where city_code = 'VAS' or airport_code = 'VAS';
update airport set timezone = 'Europe/Istanbul' where city_code = 'MLX' or airport_code = 'MLX';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ASR' or airport_code = 'ASR';
update airport set timezone = 'Europe/Istanbul' where city_code = 'DNZ' or airport_code = 'DNZ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'IST' or airport_code = 'IST';
update airport set timezone = 'Europe/Istanbul' where city_code = 'BZI' or airport_code = 'BZI';
update airport set timezone = 'Europe/Istanbul' where city_code = 'BDM' or airport_code = 'BDM';
update airport set timezone = 'America/Anchorage' where city_code = 'TYE' or airport_code = 'TYE';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ESK' or airport_code = 'ESK';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ADB' or airport_code = 'ADB';
update airport set timezone = 'Europe/Istanbul' where city_code = 'IGL' or airport_code = 'IGL';
update airport set timezone = 'Europe/Istanbul' where city_code = 'DLM' or airport_code = 'DLM';
update airport set timezone = 'America/Denver' where city_code = 'RIW' or airport_code = 'RIW';
update airport set timezone = 'Europe/Istanbul' where city_code = 'BXN' or airport_code = 'BXN';
update airport set timezone = 'Europe/Istanbul' where city_code = 'EZS' or airport_code = 'EZS';
update airport set timezone = 'Europe/Istanbul' where city_code = 'DIY' or airport_code = 'DIY';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ERC' or airport_code = 'ERC';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ERZ' or airport_code = 'ERZ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'TZX' or airport_code = 'TZX';
update airport set timezone = 'America/Denver' where city_code = 'MTJ' or airport_code = 'MTJ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'VAN' or airport_code = 'VAN';
update airport set timezone = 'Europe/Istanbul' where city_code = 'BAL' or airport_code = 'BAL';
update airport set timezone = 'Europe/Chisinau' where city_code = 'KIV' or airport_code = 'KIV';
update airport set timezone = 'Europe/Skopje' where city_code = 'OHD' or airport_code = 'OHD';
update airport set timezone = 'Europe/Skopje' where city_code = 'SKP' or airport_code = 'SKP';
update airport set timezone = 'Europe/Gibraltar' where city_code = 'GIB' or airport_code = 'GIB';
update airport set timezone = 'Europe/Belgrade' where city_code = 'BEG' or airport_code = 'BEG';
update airport set timezone = 'Europe/Belgrade' where city_code = 'INI' or airport_code = 'INI';
update airport set timezone = 'Europe/Podgorica' where city_code = 'TGD' or airport_code = 'TGD';
update airport set timezone = 'Europe/Belgrade' where city_code = 'PRN' or airport_code = 'PRN';
update airport set timezone = 'Europe/Podgorica' where city_code = 'TIV' or airport_code = 'TIV';
update airport set timezone = 'Europe/Bratislava' where city_code = 'BTS' or airport_code = 'BTS';
update airport set timezone = 'Europe/Bratislava' where city_code = 'KSC' or airport_code = 'KSC';
update airport set timezone = 'Europe/Bratislava' where city_code = 'PZY' or airport_code = 'PZY';
update airport set timezone = 'Europe/Bratislava' where city_code = 'SLD' or airport_code = 'SLD';
update airport set timezone = 'Europe/Bratislava' where city_code = 'TAT' or airport_code = 'TAT';
update airport set timezone = 'America/Chicago' where city_code = '1CS' or airport_code = '1CS';
update airport set timezone = 'America/Grand_Turk' where city_code = 'NCA' or airport_code = 'NCA';
update airport set timezone = 'America/Grand_Turk' where city_code = 'PLS' or airport_code = 'PLS';
update airport set timezone = 'America/Grand_Turk' where city_code = 'XSC' or airport_code = 'XSC';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'EPS' or airport_code = 'EPS';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'BRX' or airport_code = 'BRX';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'LRM' or airport_code = 'LRM';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'PUJ' or airport_code = 'PUJ';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'POP' or airport_code = 'POP';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'SDQ' or airport_code = 'SDQ';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'STI' or airport_code = 'STI';
update airport set timezone = 'America/Guatemala' where city_code = 'CBV' or airport_code = 'CBV';
update airport set timezone = 'America/Guatemala' where city_code = 'GUA' or airport_code = 'GUA';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'LCE' or airport_code = 'LCE';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'SAP' or airport_code = 'SAP';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'GJA' or airport_code = 'GJA';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'RTB' or airport_code = 'RTB';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'TEA' or airport_code = 'TEA';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'TGU' or airport_code = 'TGU';
update airport set timezone = 'America/Jamaica' where city_code = 'OCJ' or airport_code = 'OCJ';
update airport set timezone = 'America/Jamaica' where city_code = 'KIN' or airport_code = 'KIN';
update airport set timezone = 'America/Jamaica' where city_code = 'MBJ' or airport_code = 'MBJ';
update airport set timezone = 'America/Jamaica' where city_code = 'POT' or airport_code = 'POT';
update airport set timezone = 'America/Jamaica' where city_code = 'KTP' or airport_code = 'KTP';
update airport set timezone = 'America/Mexico_City' where city_code = 'ACA' or airport_code = 'ACA';
update airport set timezone = 'America/Mexico_City' where city_code = 'NTR' or airport_code = 'NTR';
update airport set timezone = 'America/Mexico_City' where city_code = 'AGU' or airport_code = 'AGU';
update airport set timezone = 'America/Mexico_City' where city_code = 'HUX' or airport_code = 'HUX';
update airport set timezone = 'America/Mexico_City' where city_code = 'CVJ' or airport_code = 'CVJ';
update airport set timezone = 'America/Mexico_City' where city_code = 'CME' or airport_code = 'CME';
update airport set timezone = 'America/Mazatlan' where city_code = 'CUL' or airport_code = 'CUL';
update airport set timezone = 'America/Mexico_City' where city_code = 'CTM' or airport_code = 'CTM';
update airport set timezone = 'America/Hermosillo' where city_code = 'CEN' or airport_code = 'CEN';
update airport set timezone = 'America/Mexico_City' where city_code = 'CPE' or airport_code = 'CPE';
update airport set timezone = 'America/Mazatlan' where city_code = 'CJS' or airport_code = 'CJS';
update airport set timezone = 'America/Mazatlan' where city_code = 'CUU' or airport_code = 'CUU';
update airport set timezone = 'America/Mexico_City' where city_code = 'CVM' or airport_code = 'CVM';
update airport set timezone = 'America/Chicago' where city_code = 'ENW' or airport_code = 'ENW';
update airport set timezone = 'America/Mexico_City' where city_code = 'CZM' or airport_code = 'CZM';
update airport set timezone = 'America/Mexico_City' where city_code = 'DGO' or airport_code = 'DGO';
update airport set timezone = 'America/Mazatlan' where city_code = 'TPQ' or airport_code = 'TPQ';
update airport set timezone = 'America/Tijuana' where city_code = 'ESE' or airport_code = 'ESE';
update airport set timezone = 'America/Mexico_City' where city_code = 'GDL' or airport_code = 'GDL';
update airport set timezone = 'America/Hermosillo' where city_code = 'GYM' or airport_code = 'GYM';
update airport set timezone = 'America/Mexico_City' where city_code = 'TCN' or airport_code = 'TCN';
update airport set timezone = 'America/Hermosillo' where city_code = 'HMO' or airport_code = 'HMO';
update airport set timezone = 'America/Mexico_City' where city_code = 'CLQ' or airport_code = 'CLQ';
update airport set timezone = 'America/Mexico_City' where city_code = 'ISJ' or airport_code = 'ISJ';
update airport set timezone = 'America/Mexico_City' where city_code = 'SLW' or airport_code = 'SLW';
update airport set timezone = 'America/Mexico_City' where city_code = 'LZC' or airport_code = 'LZC';
update airport set timezone = 'America/Mazatlan' where city_code = 'LMM' or airport_code = 'LMM';
update airport set timezone = 'America/Mexico_City' where city_code = 'BJX' or airport_code = 'BJX';
update airport set timezone = 'America/Mazatlan' where city_code = 'LAP' or airport_code = 'LAP';
update airport set timezone = 'America/Mazatlan' where city_code = 'LTO' or airport_code = 'LTO';
update airport set timezone = 'America/Mexico_City' where city_code = 'MAM' or airport_code = 'MAM';
update airport set timezone = 'America/Mexico_City' where city_code = 'MID' or airport_code = 'MID';
update airport set timezone = 'America/Tijuana' where city_code = 'MXL' or airport_code = 'MXL';
update airport set timezone = 'America/Mexico_City' where city_code = 'MLM' or airport_code = 'MLM';
update airport set timezone = 'America/Mexico_City' where city_code = 'MTT' or airport_code = 'MTT';
update airport set timezone = 'America/Mexico_City' where city_code = 'LOV' or airport_code = 'LOV';
update airport set timezone = 'America/Mexico_City' where city_code = 'MEX' or airport_code = 'MEX';
update airport set timezone = 'America/Mexico_City' where city_code = 'MTY' or airport_code = 'MTY';
update airport set timezone = 'America/Mazatlan' where city_code = 'MZT' or airport_code = 'MZT';
update airport set timezone = 'America/Hermosillo' where city_code = 'NOG' or airport_code = 'NOG';
update airport set timezone = 'America/Mexico_City' where city_code = 'NLD' or airport_code = 'NLD';
update airport set timezone = 'America/Mexico_City' where city_code = 'OAX' or airport_code = 'OAX';
update airport set timezone = 'America/Mexico_City' where city_code = 'PAZ' or airport_code = 'PAZ';
update airport set timezone = 'America/Mexico_City' where city_code = 'PBC' or airport_code = 'PBC';
update airport set timezone = 'America/Mexico_City' where city_code = 'PCA' or airport_code = 'PCA';
update airport set timezone = 'America/Hermosillo' where city_code = 'PPE' or airport_code = 'PPE';
update airport set timezone = 'America/Mexico_City' where city_code = 'PDS' or airport_code = 'PDS';
update airport set timezone = 'America/Mexico_City' where city_code = 'UPN' or airport_code = 'UPN';
update airport set timezone = 'America/Mexico_City' where city_code = 'PVR' or airport_code = 'PVR';
update airport set timezone = 'America/Mexico_City' where city_code = 'PXM' or airport_code = 'PXM';
update airport set timezone = 'America/Mexico_City' where city_code = 'QRO' or airport_code = 'QRO';
update airport set timezone = 'America/Mexico_City' where city_code = 'REX' or airport_code = 'REX';
update airport set timezone = 'America/Mazatlan' where city_code = 'SJD' or airport_code = 'SJD';
update airport set timezone = 'America/Mexico_City' where city_code = 'SLP' or airport_code = 'SLP';
update airport set timezone = 'America/Mexico_City' where city_code = 'TXA' or airport_code = 'TXA';
update airport set timezone = 'America/Mexico_City' where city_code = 'TRC' or airport_code = 'TRC';
update airport set timezone = 'America/Mexico_City' where city_code = 'TGZ' or airport_code = 'TGZ';
update airport set timezone = 'America/Tijuana' where city_code = 'TIJ' or airport_code = 'TIJ';
update airport set timezone = 'America/Mexico_City' where city_code = 'TAM' or airport_code = 'TAM';
update airport set timezone = 'America/Mexico_City' where city_code = 'TSL' or airport_code = 'TSL';
update airport set timezone = 'America/Mexico_City' where city_code = 'TLC' or airport_code = 'TLC';
update airport set timezone = 'America/Mexico_City' where city_code = 'TAP' or airport_code = 'TAP';
update airport set timezone = 'America/Mexico_City' where city_code = 'CUN' or airport_code = 'CUN';
update airport set timezone = 'America/Mexico_City' where city_code = 'VSA' or airport_code = 'VSA';
update airport set timezone = 'America/Mexico_City' where city_code = 'VER' or airport_code = 'VER';
update airport set timezone = 'America/Mexico_City' where city_code = 'ZCL' or airport_code = 'ZCL';
update airport set timezone = 'America/Mexico_City' where city_code = 'ZIH' or airport_code = 'ZIH';
update airport set timezone = 'America/Mexico_City' where city_code = 'ZMM' or airport_code = 'ZMM';
update airport set timezone = 'America/Mexico_City' where city_code = 'ZLO' or airport_code = 'ZLO';
update airport set timezone = 'America/Managua' where city_code = 'BEF' or airport_code = 'BEF';
update airport set timezone = 'America/Managua' where city_code = 'MGA' or airport_code = 'MGA';
update airport set timezone = 'America/Managua' where city_code = 'PUZ' or airport_code = 'PUZ';
update airport set timezone = 'America/Panama' where city_code = 'BOC' or airport_code = 'BOC';
update airport set timezone = 'America/Panama' where city_code = 'CHX' or airport_code = 'CHX';
update airport set timezone = 'America/Panama' where city_code = 'DAV' or airport_code = 'DAV';
update airport set timezone = 'America/Panama' where city_code = 'HOW' or airport_code = 'HOW';
update airport set timezone = 'America/Panama' where city_code = 'PAC' or airport_code = 'PAC';
update airport set timezone = 'America/Panama' where city_code = 'PTY' or airport_code = 'PTY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VGT' or airport_code = 'VGT';
update airport set timezone = 'America/Costa_Rica' where city_code = 'OTR' or airport_code = 'OTR';
update airport set timezone = 'America/Costa_Rica' where city_code = 'GLF' or airport_code = 'GLF';
update airport set timezone = 'America/Costa_Rica' where city_code = 'LIR' or airport_code = 'LIR';
update airport set timezone = 'America/Costa_Rica' where city_code = 'LIO' or airport_code = 'LIO';
update airport set timezone = 'America/Costa_Rica' where city_code = 'NOB' or airport_code = 'NOB';
update airport set timezone = 'America/Costa_Rica' where city_code = 'SJO' or airport_code = 'SJO';
update airport set timezone = 'America/Costa_Rica' where city_code = 'PMZ' or airport_code = 'PMZ';
update airport set timezone = 'America/Costa_Rica' where city_code = 'XQP' or airport_code = 'XQP';
update airport set timezone = 'America/El_Salvador' where city_code = 'SAL' or airport_code = 'SAL';
update airport set timezone = 'America/Port-au-Prince' where city_code = 'CAP' or airport_code = 'CAP';
update airport set timezone = 'America/Port-au-Prince' where city_code = 'PAP' or airport_code = 'PAP';
update airport set timezone = 'America/Havana' where city_code = 'BCA' or airport_code = 'BCA';
update airport set timezone = 'America/Havana' where city_code = 'BYM' or airport_code = 'BYM';
update airport set timezone = 'America/Havana' where city_code = 'AVI' or airport_code = 'AVI';
update airport set timezone = 'America/Havana' where city_code = 'CFG' or airport_code = 'CFG';
update airport set timezone = 'America/Havana' where city_code = 'CYO' or airport_code = 'CYO';
update airport set timezone = 'America/Havana' where city_code = 'CMW' or airport_code = 'CMW';
update airport set timezone = 'America/Havana' where city_code = 'SCU' or airport_code = 'SCU';
update airport set timezone = 'America/Havana' where city_code = 'GAO' or airport_code = 'GAO';
update airport set timezone = 'America/Havana' where city_code = 'HAV' or airport_code = 'HAV';
update airport set timezone = 'America/Havana' where city_code = 'HOG' or airport_code = 'HOG';
update airport set timezone = 'America/Havana' where city_code = 'LCL' or airport_code = 'LCL';
update airport set timezone = 'America/Havana' where city_code = 'MOA' or airport_code = 'MOA';
update airport set timezone = 'America/Havana' where city_code = 'MZO' or airport_code = 'MZO';
update airport set timezone = 'America/Havana' where city_code = 'GER' or airport_code = 'GER';
update airport set timezone = 'America/Havana' where city_code = 'SNU' or airport_code = 'SNU';
update airport set timezone = 'America/Chicago' where city_code = 'C02' or airport_code = 'C02';
update airport set timezone = 'America/Havana' where city_code = 'VRA' or airport_code = 'VRA';
update airport set timezone = 'America/Havana' where city_code = 'VTU' or airport_code = 'VTU';
update airport set timezone = 'America/Cayman' where city_code = 'CYB' or airport_code = 'CYB';
update airport set timezone = 'America/Cayman' where city_code = 'GCM' or airport_code = 'GCM';
update airport set timezone = 'America/Nassau' where city_code = 'ASD' or airport_code = 'ASD';
update airport set timezone = 'America/Nassau' where city_code = 'MHH' or airport_code = 'MHH';
update airport set timezone = 'America/Nassau' where city_code = 'SAQ' or airport_code = 'SAQ';
update airport set timezone = 'America/Nassau' where city_code = 'AXP' or airport_code = 'AXP';
update airport set timezone = 'America/Nassau' where city_code = 'TCB' or airport_code = 'TCB';
update airport set timezone = 'America/Nassau' where city_code = 'CCZ' or airport_code = 'CCZ';
update airport set timezone = 'America/Nassau' where city_code = 'BIM' or airport_code = 'BIM';
update airport set timezone = 'America/Chicago' where city_code = 'DKB' or airport_code = 'DKB';
update airport set timezone = 'America/Nassau' where city_code = 'GGT' or airport_code = 'GGT';
update airport set timezone = 'America/Nassau' where city_code = 'ELH' or airport_code = 'ELH';
update airport set timezone = 'America/Nassau' where city_code = 'GHB' or airport_code = 'GHB';
update airport set timezone = 'America/Nassau' where city_code = 'RSD' or airport_code = 'RSD';
update airport set timezone = 'America/Nassau' where city_code = 'FPO' or airport_code = 'FPO';
update airport set timezone = 'America/Nassau' where city_code = 'IGA' or airport_code = 'IGA';
update airport set timezone = 'America/Nassau' where city_code = 'LGI' or airport_code = 'LGI';
update airport set timezone = 'America/Nassau' where city_code = 'SML' or airport_code = 'SML';
update airport set timezone = 'America/Nassau' where city_code = 'MYG' or airport_code = 'MYG';
update airport set timezone = 'America/Nassau' where city_code = 'NAS' or airport_code = 'NAS';
update airport set timezone = 'America/Nassau' where city_code = 'ZSA' or airport_code = 'ZSA';
update airport set timezone = 'America/Belize' where city_code = 'BZE' or airport_code = 'BZE';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'AIT' or airport_code = 'AIT';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'RAR' or airport_code = 'RAR';
update airport set timezone = 'Pacific/Fiji' where city_code = 'NAN' or airport_code = 'NAN';
update airport set timezone = 'Pacific/Fiji' where city_code = 'SUV' or airport_code = 'SUV';
update airport set timezone = 'Pacific/Tongatapu' where city_code = 'TBU' or airport_code = 'TBU';
update airport set timezone = 'Pacific/Tongatapu' where city_code = 'VAV' or airport_code = 'VAV';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'TRW' or airport_code = 'TRW';
update airport set timezone = '\N' where city_code = 'TBF' or airport_code = 'TBF';
update airport set timezone = 'Australia/Sydney' where city_code = 'MTL' or airport_code = 'MTL';
update airport set timezone = 'Pacific/Wallis' where city_code = 'WLS' or airport_code = 'WLS';
update airport set timezone = 'Pacific/Apia' where city_code = 'APW' or airport_code = 'APW';
update airport set timezone = 'Pacific/Pago_Pago' where city_code = 'PPG' or airport_code = 'PPG';
update airport set timezone = '\N' where city_code = 'RUR' or airport_code = 'RUR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TUB' or airport_code = 'TUB';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'AAA' or airport_code = 'AAA';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TIH' or airport_code = 'TIH';
update airport set timezone = '\N' where city_code = 'REA' or airport_code = 'REA';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'FAV' or airport_code = 'FAV';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'XMH' or airport_code = 'XMH';
update airport set timezone = 'Pacific/Gambier' where city_code = 'GMR' or airport_code = 'GMR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'KKR' or airport_code = 'KKR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'MKP' or airport_code = 'MKP';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'PKP' or airport_code = 'PKP';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TKP' or airport_code = 'TKP';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'AXR' or airport_code = 'AXR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'MVT' or airport_code = 'MVT';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TKX' or airport_code = 'TKX';
update airport set timezone = 'Pacific/Marquesas' where city_code = 'NHV' or airport_code = 'NHV';
update airport set timezone = 'America/New_York' where city_code = 'LAF' or airport_code = 'LAF';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'BOB' or airport_code = 'BOB';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'RGI' or airport_code = 'RGI';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'HUH' or airport_code = 'HUH';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'MOZ' or airport_code = 'MOZ';
update airport set timezone = '\N' where city_code = 'HOI' or airport_code = 'HOI';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'MAU' or airport_code = 'MAU';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'RFP' or airport_code = 'RFP';
update airport set timezone = 'Pacific/Efate' where city_code = 'VLI' or airport_code = 'VLI';
update airport set timezone = 'Pacific/Noumea' where city_code = 'KNQ' or airport_code = 'KNQ';
update airport set timezone = 'Pacific/Noumea' where city_code = 'KOC' or airport_code = 'KOC';
update airport set timezone = 'Pacific/Noumea' where city_code = 'LIF' or airport_code = 'LIF';
update airport set timezone = 'Pacific/Noumea' where city_code = 'GEA' or airport_code = 'GEA';
update airport set timezone = 'Pacific/Noumea' where city_code = 'MEE' or airport_code = 'MEE';
update airport set timezone = 'Pacific/Noumea' where city_code = 'TOU' or airport_code = 'TOU';
update airport set timezone = 'Pacific/Noumea' where city_code = 'UVE' or airport_code = 'UVE';
update airport set timezone = 'Pacific/Noumea' where city_code = 'NOU' or airport_code = 'NOU';
update airport set timezone = 'Pacific/Auckland' where city_code = 'AKL' or airport_code = 'AKL';
update airport set timezone = 'Pacific/Auckland' where city_code = 'TUO' or airport_code = 'TUO';
update airport set timezone = 'Pacific/Auckland' where city_code = 'AMZ' or airport_code = 'AMZ';
update airport set timezone = 'Pacific/Auckland' where city_code = 'CHC' or airport_code = 'CHC';
update airport set timezone = 'Pacific/Chatham' where city_code = 'CHT' or airport_code = 'CHT';
update airport set timezone = 'Pacific/Auckland' where city_code = 'DUD' or airport_code = 'DUD';
update airport set timezone = 'Pacific/Auckland' where city_code = 'GIS' or airport_code = 'GIS';
update airport set timezone = 'Pacific/Auckland' where city_code = 'MON' or airport_code = 'MON';
update airport set timezone = 'Pacific/Auckland' where city_code = 'HKK' or airport_code = 'HKK';
update airport set timezone = 'Pacific/Auckland' where city_code = 'HLZ' or airport_code = 'HLZ';
update airport set timezone = 'Pacific/Auckland' where city_code = 'KKE' or airport_code = 'KKE';
update airport set timezone = 'Pacific/Auckland' where city_code = 'KAT' or airport_code = 'KAT';
update airport set timezone = 'Pacific/Auckland' where city_code = 'ALR' or airport_code = 'ALR';
update airport set timezone = 'Pacific/Auckland' where city_code = 'GTN' or airport_code = 'GTN';
update airport set timezone = 'Pacific/Auckland' where city_code = 'TEU' or airport_code = 'TEU';
update airport set timezone = 'Pacific/Auckland' where city_code = 'MRO' or airport_code = 'MRO';
update airport set timezone = 'Pacific/Auckland' where city_code = 'NPL' or airport_code = 'NPL';
update airport set timezone = 'Pacific/Auckland' where city_code = 'NSN' or airport_code = 'NSN';
update airport set timezone = 'Pacific/Auckland' where city_code = 'IVC' or airport_code = 'IVC';
update airport set timezone = 'Pacific/Auckland' where city_code = 'OAM' or airport_code = 'OAM';
update airport set timezone = 'Pacific/Auckland' where city_code = 'PMR' or airport_code = 'PMR';
update airport set timezone = 'Pacific/Auckland' where city_code = 'PPQ' or airport_code = 'PPQ';
update airport set timezone = 'Pacific/Auckland' where city_code = 'ZQN' or airport_code = 'ZQN';
update airport set timezone = 'Pacific/Auckland' where city_code = 'ROT' or airport_code = 'ROT';
update airport set timezone = 'Pacific/Auckland' where city_code = 'TRG' or airport_code = 'TRG';
update airport set timezone = 'Pacific/Auckland' where city_code = 'TIU' or airport_code = 'TIU';
update airport set timezone = 'Pacific/Auckland' where city_code = 'BHE' or airport_code = 'BHE';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WKA' or airport_code = 'WKA';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WHK' or airport_code = 'WHK';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WLG' or airport_code = 'WLG';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WRE' or airport_code = 'WRE';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WSZ' or airport_code = 'WSZ';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WAG' or airport_code = 'WAG';
update airport set timezone = 'Asia/Kabul' where city_code = 'HEA' or airport_code = 'HEA';
update airport set timezone = 'Asia/Kabul' where city_code = 'JAA' or airport_code = 'JAA';
update airport set timezone = 'Asia/Kabul' where city_code = 'KBL' or airport_code = 'KBL';
update airport set timezone = 'Asia/Kabul' where city_code = 'KDH' or airport_code = 'KDH';
update airport set timezone = 'Asia/Kabul' where city_code = 'MMZ' or airport_code = 'MMZ';
update airport set timezone = 'Asia/Kabul' where city_code = 'MZR' or airport_code = 'MZR';
update airport set timezone = 'Asia/Kabul' where city_code = 'UND' or airport_code = 'UND';
update airport set timezone = 'Asia/Bahrain' where city_code = 'BAH' or airport_code = 'BAH';
update airport set timezone = 'Asia/Riyadh' where city_code = 'AHB' or airport_code = 'AHB';
update airport set timezone = 'Asia/Riyadh' where city_code = 'HOF' or airport_code = 'HOF';
update airport set timezone = 'Asia/Riyadh' where city_code = 'ABT' or airport_code = 'ABT';
update airport set timezone = 'Asia/Riyadh' where city_code = 'BHH' or airport_code = 'BHH';
update airport set timezone = 'Asia/Riyadh' where city_code = 'DMM' or airport_code = 'DMM';
update airport set timezone = 'Asia/Riyadh' where city_code = 'DHA' or airport_code = 'DHA';
update airport set timezone = 'Asia/Riyadh' where city_code = 'GIZ' or airport_code = 'GIZ';
update airport set timezone = 'Asia/Riyadh' where city_code = 'ELQ' or airport_code = 'ELQ';
update airport set timezone = 'Asia/Riyadh' where city_code = 'URY' or airport_code = 'URY';
update airport set timezone = 'Asia/Riyadh' where city_code = 'HAS' or airport_code = 'HAS';
update airport set timezone = 'Asia/Riyadh' where city_code = 'JED' or airport_code = 'JED';
update airport set timezone = 'Asia/Riyadh' where city_code = 'HBT' or airport_code = 'HBT';
update airport set timezone = 'Asia/Riyadh' where city_code = 'MED' or airport_code = 'MED';
update airport set timezone = 'Asia/Riyadh' where city_code = 'EAM' or airport_code = 'EAM';
update airport set timezone = 'Asia/Riyadh' where city_code = 'AQI' or airport_code = 'AQI';
update airport set timezone = 'Asia/Riyadh' where city_code = 'RAH' or airport_code = 'RAH';
update airport set timezone = 'Asia/Riyadh' where city_code = 'RUH' or airport_code = 'RUH';
update airport set timezone = 'Asia/Riyadh' where city_code = 'RAE' or airport_code = 'RAE';
update airport set timezone = 'Asia/Riyadh' where city_code = 'SHW' or airport_code = 'SHW';
update airport set timezone = 'Australia/Sydney' where city_code = 'DGE' or airport_code = 'DGE';
update airport set timezone = 'Asia/Riyadh' where city_code = 'SLF' or airport_code = 'SLF';
update airport set timezone = 'Asia/Riyadh' where city_code = 'TUU' or airport_code = 'TUU';
update airport set timezone = 'Asia/Riyadh' where city_code = 'TIF' or airport_code = 'TIF';
update airport set timezone = 'Asia/Riyadh' where city_code = 'TUI' or airport_code = 'TUI';
update airport set timezone = 'America/New_York' where city_code = 'OXD' or airport_code = 'OXD';
update airport set timezone = 'Asia/Riyadh' where city_code = 'EJH' or airport_code = 'EJH';
update airport set timezone = 'Asia/Riyadh' where city_code = 'YNB' or airport_code = 'YNB';
update airport set timezone = 'Asia/Tehran' where city_code = 'ABD' or airport_code = 'ABD';
update airport set timezone = 'Asia/Tehran' where city_code = 'QMJ' or airport_code = 'QMJ';
update airport set timezone = 'Asia/Tehran' where city_code = 'MRX' or airport_code = 'MRX';
update airport set timezone = 'Asia/Tehran' where city_code = 'AWZ' or airport_code = 'AWZ';
update airport set timezone = 'Asia/Tehran' where city_code = 'BUZ' or airport_code = 'BUZ';
update airport set timezone = 'Asia/Tehran' where city_code = 'KIH' or airport_code = 'KIH';
update airport set timezone = 'Asia/Tehran' where city_code = 'BDH' or airport_code = 'BDH';
update airport set timezone = 'Asia/Tehran' where city_code = 'KSH' or airport_code = 'KSH';
update airport set timezone = 'Asia/Tehran' where city_code = 'SDG' or airport_code = 'SDG';
update airport set timezone = 'Asia/Tehran' where city_code = 'RAS' or airport_code = 'RAS';
update airport set timezone = 'America/New_York' where city_code = 'MIE' or airport_code = 'MIE';
update airport set timezone = 'Asia/Tehran' where city_code = 'THR' or airport_code = 'THR';
update airport set timezone = 'Asia/Tehran' where city_code = 'BND' or airport_code = 'BND';
update airport set timezone = 'Asia/Tehran' where city_code = 'KER' or airport_code = 'KER';
update airport set timezone = 'Asia/Tehran' where city_code = 'XBJ' or airport_code = 'XBJ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WSY' or airport_code = 'WSY';
update airport set timezone = 'Asia/Tehran' where city_code = 'RZR' or airport_code = 'RZR';
update airport set timezone = 'America/Cordoba' where city_code = 'RAF' or airport_code = 'RAF';
update airport set timezone = 'Asia/Tehran' where city_code = 'SYZ' or airport_code = 'SYZ';
update airport set timezone = 'Europe/Madrid' where city_code = 'QSA' or airport_code = 'QSA';
update airport set timezone = 'Asia/Tehran' where city_code = 'TBZ' or airport_code = 'TBZ';
update airport set timezone = 'Asia/Tehran' where city_code = 'AZD' or airport_code = 'AZD';
update airport set timezone = 'Asia/Tehran' where city_code = 'ZBR' or airport_code = 'ZBR';
update airport set timezone = 'Asia/Tehran' where city_code = 'ZAH' or airport_code = 'ZAH';
update airport set timezone = 'Asia/Amman' where city_code = 'AMM' or airport_code = 'AMM';
update airport set timezone = 'Asia/Amman' where city_code = 'ADJ' or airport_code = 'ADJ';
update airport set timezone = 'Asia/Amman' where city_code = 'AQJ' or airport_code = 'AQJ';
update airport set timezone = 'Asia/Amman' where city_code = 'OMF' or airport_code = 'OMF';
update airport set timezone = 'Asia/Kuwait' where city_code = 'KWI' or airport_code = 'KWI';
update airport set timezone = 'Asia/Beirut' where city_code = 'BEY' or airport_code = 'BEY';
update airport set timezone = 'Asia/Dubai' where city_code = 'AUH' or airport_code = 'AUH';
update airport set timezone = 'Asia/Dubai' where city_code = 'AZI' or airport_code = 'AZI';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'MVA' or airport_code = 'MVA';
update airport set timezone = 'Asia/Dubai' where city_code = 'DXB' or airport_code = 'DXB';
update airport set timezone = 'Asia/Dubai' where city_code = 'FJR' or airport_code = 'FJR';
update airport set timezone = 'Asia/Dubai' where city_code = 'RKT' or airport_code = 'RKT';
update airport set timezone = 'Asia/Dubai' where city_code = 'SHJ' or airport_code = 'SHJ';
update airport set timezone = 'Asia/Muscat' where city_code = 'KHS' or airport_code = 'KHS';
update airport set timezone = 'Asia/Muscat' where city_code = 'MSH' or airport_code = 'MSH';
update airport set timezone = 'Asia/Muscat' where city_code = 'MCT' or airport_code = 'MCT';
update airport set timezone = 'Asia/Muscat' where city_code = 'SLL' or airport_code = 'SLL';
update airport set timezone = 'Asia/Muscat' where city_code = 'TTH' or airport_code = 'TTH';
update airport set timezone = 'Europe/Paris' where city_code = 'XYD' or airport_code = 'XYD';
update airport set timezone = 'Asia/Karachi' where city_code = 'LYP' or airport_code = 'LYP';
update airport set timezone = 'Asia/Karachi' where city_code = 'GWD' or airport_code = 'GWD';
update airport set timezone = 'Asia/Karachi' where city_code = 'GIL' or airport_code = 'GIL';
update airport set timezone = 'Asia/Karachi' where city_code = 'KHI' or airport_code = 'KHI';
update airport set timezone = 'Asia/Karachi' where city_code = 'LHE' or airport_code = 'LHE';
update airport set timezone = 'Asia/Karachi' where city_code = 'MFG' or airport_code = 'MFG';
update airport set timezone = 'Asia/Karachi' where city_code = 'MJD' or airport_code = 'MJD';
update airport set timezone = 'Asia/Karachi' where city_code = 'MUX' or airport_code = 'MUX';
update airport set timezone = 'Asia/Karachi' where city_code = 'WNS' or airport_code = 'WNS';
update airport set timezone = 'Asia/Karachi' where city_code = 'PJG' or airport_code = 'PJG';
update airport set timezone = 'Asia/Karachi' where city_code = 'PSI' or airport_code = 'PSI';
update airport set timezone = 'Asia/Karachi' where city_code = 'PEW' or airport_code = 'PEW';
update airport set timezone = 'Asia/Karachi' where city_code = 'UET' or airport_code = 'UET';
update airport set timezone = 'Asia/Karachi' where city_code = 'RYK' or airport_code = 'RYK';
update airport set timezone = 'Asia/Karachi' where city_code = 'ISB' or airport_code = 'ISB';
update airport set timezone = 'Asia/Karachi' where city_code = 'RAZ' or airport_code = 'RAZ';
update airport set timezone = 'America/Los_Angeles' where city_code = '1RL' or airport_code = '1RL';
update airport set timezone = 'Asia/Karachi' where city_code = 'SKZ' or airport_code = 'SKZ';
update airport set timezone = 'Asia/Karachi' where city_code = 'SDT' or airport_code = 'SDT';
update airport set timezone = 'Asia/Karachi' where city_code = 'SUL' or airport_code = 'SUL';
update airport set timezone = 'Asia/Karachi' where city_code = 'BDN' or airport_code = 'BDN';
update airport set timezone = 'Asia/Karachi' where city_code = 'PZH' or airport_code = 'PZH';
update airport set timezone = 'Asia/Baghdad' where city_code = 'BSR' or airport_code = 'BSR';
update airport set timezone = 'Asia/Damascus' where city_code = 'ALP' or airport_code = 'ALP';
update airport set timezone = 'Asia/Damascus' where city_code = 'DAM' or airport_code = 'DAM';
update airport set timezone = 'Asia/Damascus' where city_code = 'DEZ' or airport_code = 'DEZ';
update airport set timezone = 'Asia/Damascus' where city_code = 'LTK' or airport_code = 'LTK';
update airport set timezone = 'Asia/Damascus' where city_code = 'PMS' or airport_code = 'PMS';
update airport set timezone = 'Asia/Qatar' where city_code = 'DOH' or airport_code = 'DOH';
update airport set timezone = 'Pacific/Enderbury' where city_code = 'CIS' or airport_code = 'CIS';
update airport set timezone = 'Pacific/Saipan' where city_code = 'ROP' or airport_code = 'ROP';
update airport set timezone = 'Pacific/Saipan' where city_code = 'SPN' or airport_code = 'SPN';
update airport set timezone = 'Pacific/Guam' where city_code = 'UAM' or airport_code = 'UAM';
update airport set timezone = 'Pacific/Guam' where city_code = 'GUM' or airport_code = 'GUM';
update airport set timezone = 'Pacific/Saipan' where city_code = 'TIQ' or airport_code = 'TIQ';
update airport set timezone = 'Australia/Sydney' where city_code = 'NSO' or airport_code = 'NSO';
update airport set timezone = 'Pacific/Majuro' where city_code = 'MAJ' or airport_code = 'MAJ';
update airport set timezone = 'Pacific/Majuro' where city_code = 'KWA' or airport_code = 'KWA';
update airport set timezone = '\N' where city_code = 'CXI' or airport_code = 'CXI';
update airport set timezone = 'Pacific/Midway' where city_code = 'MDY' or airport_code = 'MDY';
update airport set timezone = 'Pacific/Truk' where city_code = 'TKK' or airport_code = 'TKK';
update airport set timezone = 'Pacific/Ponape' where city_code = 'PNI' or airport_code = 'PNI';
update airport set timezone = 'Pacific/Palau' where city_code = 'ROR' or airport_code = 'ROR';
update airport set timezone = 'Pacific/Kosrae' where city_code = 'KSA' or airport_code = 'KSA';
update airport set timezone = 'Pacific/Truk' where city_code = 'YAP' or airport_code = 'YAP';
update airport set timezone = 'Asia/Taipei' where city_code = 'KNH' or airport_code = 'KNH';
update airport set timezone = 'Asia/Taipei' where city_code = 'PIF' or airport_code = 'PIF';
update airport set timezone = 'Asia/Taipei' where city_code = 'TTT' or airport_code = 'TTT';
update airport set timezone = 'Asia/Taipei' where city_code = 'GNI' or airport_code = 'GNI';
update airport set timezone = 'Asia/Taipei' where city_code = 'KHH' or airport_code = 'KHH';
update airport set timezone = 'Asia/Taipei' where city_code = 'CYI' or airport_code = 'CYI';
update airport set timezone = 'Asia/Taipei' where city_code = 'KYD' or airport_code = 'KYD';
update airport set timezone = 'Asia/Taipei' where city_code = 'RMQ' or airport_code = 'RMQ';
update airport set timezone = 'Australia/Sydney' where city_code = 'CES' or airport_code = 'CES';
update airport set timezone = 'Asia/Taipei' where city_code = 'TNN' or airport_code = 'TNN';
update airport set timezone = 'Asia/Taipei' where city_code = 'MZG' or airport_code = 'MZG';
update airport set timezone = 'Asia/Taipei' where city_code = 'TSA' or airport_code = 'TSA';
update airport set timezone = 'Asia/Taipei' where city_code = 'TPE' or airport_code = 'TPE';
update airport set timezone = 'Asia/Taipei' where city_code = 'WOT' or airport_code = 'WOT';
update airport set timezone = 'Asia/Taipei' where city_code = 'HUN' or airport_code = 'HUN';
update airport set timezone = 'Asia/Tokyo' where city_code = 'NRT' or airport_code = 'NRT';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MMJ' or airport_code = 'MMJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IBR' or airport_code = 'IBR';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IWO' or airport_code = 'IWO';
update airport set timezone = 'Asia/Tokyo' where city_code = 'SHM' or airport_code = 'SHM';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OBO' or airport_code = 'OBO';
update airport set timezone = 'Asia/Tokyo' where city_code = 'CTS' or airport_code = 'CTS';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HKD' or airport_code = 'HKD';
update airport set timezone = 'Asia/Tokyo' where city_code = 'SPK' or airport_code = 'SPK';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MMB' or airport_code = 'MMB';
update airport set timezone = 'Asia/Tokyo' where city_code = 'SHB' or airport_code = 'SHB';
update airport set timezone = 'Asia/Tokyo' where city_code = 'WKJ' or airport_code = 'WKJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IKI' or airport_code = 'IKI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'UBJ' or airport_code = 'UBJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TSJ' or airport_code = 'TSJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MBE' or airport_code = 'MBE';
update airport set timezone = 'Asia/Tokyo' where city_code = 'AKJ' or airport_code = 'AKJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OIR' or airport_code = 'OIR';
update airport set timezone = 'Asia/Tokyo' where city_code = 'RIS' or airport_code = 'RIS';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KUM' or airport_code = 'KUM';
update airport set timezone = 'Asia/Tokyo' where city_code = 'FUJ' or airport_code = 'FUJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'FUK' or airport_code = 'FUK';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TNE' or airport_code = 'TNE';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KOJ' or airport_code = 'KOJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KMI' or airport_code = 'KMI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OIT' or airport_code = 'OIT';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KKJ' or airport_code = 'KKJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KMJ' or airport_code = 'KMJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'NGS' or airport_code = 'NGS';
update airport set timezone = 'Asia/Tokyo' where city_code = 'ASJ' or airport_code = 'ASJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TKN' or airport_code = 'TKN';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KMQ' or airport_code = 'KMQ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OKI' or airport_code = 'OKI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TOY' or airport_code = 'TOY';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HIJ' or airport_code = 'HIJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OKJ' or airport_code = 'OKJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IZO' or airport_code = 'IZO';
update airport set timezone = 'Asia/Tokyo' where city_code = 'YGJ' or airport_code = 'YGJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KCZ' or airport_code = 'KCZ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MYJ' or airport_code = 'MYJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'ITM' or airport_code = 'ITM';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TTJ' or airport_code = 'TTJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TKS' or airport_code = 'TKS';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TAK' or airport_code = 'TAK';
update airport set timezone = 'Asia/Tokyo' where city_code = 'AOJ' or airport_code = 'AOJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'GAJ' or airport_code = 'GAJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HNA' or airport_code = 'HNA';
update airport set timezone = 'Asia/Tokyo' where city_code = 'AXT' or airport_code = 'AXT';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MSJ' or airport_code = 'MSJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'SDJ' or airport_code = 'SDJ';
update airport set timezone = 'Europe/Prague' where city_code = 'LKS' or airport_code = 'LKS';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HAC' or airport_code = 'HAC';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OIM' or airport_code = 'OIM';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HND' or airport_code = 'HND';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OKO' or airport_code = 'OKO';
update airport set timezone = 'Asia/Seoul' where city_code = 'KWJ' or airport_code = 'KWJ';
update airport set timezone = 'Asia/Seoul' where city_code = 'RSU' or airport_code = 'RSU';
update airport set timezone = 'Asia/Seoul' where city_code = 'SHO' or airport_code = 'SHO';
update airport set timezone = 'Asia/Seoul' where city_code = 'KAG' or airport_code = 'KAG';
update airport set timezone = 'America/Chicago' where city_code = 'MQB' or airport_code = 'MQB';
update airport set timezone = 'Asia/Seoul' where city_code = 'CJU' or airport_code = 'CJU';
update airport set timezone = 'Asia/Seoul' where city_code = 'PUS' or airport_code = 'PUS';
update airport set timezone = 'Asia/Seoul' where city_code = 'USN' or airport_code = 'USN';
update airport set timezone = 'Asia/Seoul' where city_code = 'SSN' or airport_code = 'SSN';
update airport set timezone = 'Asia/Seoul' where city_code = 'OSN' or airport_code = 'OSN';
update airport set timezone = 'Asia/Seoul' where city_code = 'GMP' or airport_code = 'GMP';
update airport set timezone = 'Asia/Seoul' where city_code = 'KPO' or airport_code = 'KPO';
update airport set timezone = 'Asia/Seoul' where city_code = 'TAE' or airport_code = 'TAE';
update airport set timezone = 'Asia/Seoul' where city_code = 'YEC' or airport_code = 'YEC';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OKA' or airport_code = 'OKA';
update airport set timezone = 'Asia/Tokyo' where city_code = 'DNA' or airport_code = 'DNA';
update airport set timezone = 'Asia/Tokyo' where city_code = 'ISG' or airport_code = 'ISG';
update airport set timezone = 'Asia/Tokyo' where city_code = 'UEO' or airport_code = 'UEO';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MMD' or airport_code = 'MMD';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MMY' or airport_code = 'MMY';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KTD' or airport_code = 'KTD';
update airport set timezone = 'Asia/Tokyo' where city_code = 'SHI' or airport_code = 'SHI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'RNJ' or airport_code = 'RNJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OGN' or airport_code = 'OGN';
update airport set timezone = 'Asia/Manila' where city_code = 'MNL' or airport_code = 'MNL';
update airport set timezone = 'Asia/Ashgabat' where city_code = 'MYP' or airport_code = 'MYP';
update airport set timezone = 'Asia/Manila' where city_code = 'CBO' or airport_code = 'CBO';
update airport set timezone = 'Asia/Manila' where city_code = 'CGY' or airport_code = 'CGY';
update airport set timezone = 'Asia/Manila' where city_code = 'PAG' or airport_code = 'PAG';
update airport set timezone = 'Asia/Manila' where city_code = 'ZAM' or airport_code = 'ZAM';
update airport set timezone = 'Asia/Manila' where city_code = 'BAG' or airport_code = 'BAG';
update airport set timezone = 'Asia/Manila' where city_code = 'TAC' or airport_code = 'TAC';
update airport set timezone = 'Asia/Manila' where city_code = 'BCD' or airport_code = 'BCD';
update airport set timezone = 'Europe/Oslo' where city_code = 'GEN' or airport_code = 'GEN';
update airport set timezone = 'Asia/Manila' where city_code = 'DGT' or airport_code = 'DGT';
update airport set timezone = 'Asia/Manila' where city_code = 'ILO' or airport_code = 'ILO';
update airport set timezone = 'Asia/Manila' where city_code = 'KLO' or airport_code = 'KLO';
update airport set timezone = 'America/Chicago' where city_code = 'AUW' or airport_code = 'AUW';
update airport set timezone = 'Asia/Manila' where city_code = 'PPS' or airport_code = 'PPS';
update airport set timezone = 'Asia/Manila' where city_code = 'SJI' or airport_code = 'SJI';
update airport set timezone = 'America/Cordoba' where city_code = 'COC' or airport_code = 'COC';
update airport set timezone = 'America/Cordoba' where city_code = 'GHU' or airport_code = 'GHU';
update airport set timezone = 'America/Cordoba' where city_code = 'PRA' or airport_code = 'PRA';
update airport set timezone = 'America/Cordoba' where city_code = 'ROS' or airport_code = 'ROS';
update airport set timezone = 'America/Cordoba' where city_code = 'SFN' or airport_code = 'SFN';
update airport set timezone = 'America/Cordoba' where city_code = 'AEP' or airport_code = 'AEP';
update airport set timezone = 'America/Cordoba' where city_code = 'COR' or airport_code = 'COR';
update airport set timezone = 'America/Cordoba' where city_code = 'LPG' or airport_code = 'LPG';
update airport set timezone = 'America/Cordoba' where city_code = 'MDZ' or airport_code = 'MDZ';
update airport set timezone = 'America/Cordoba' where city_code = 'LGS' or airport_code = 'LGS';
update airport set timezone = 'America/Cordoba' where city_code = 'AFA' or airport_code = 'AFA';
update airport set timezone = 'America/Cordoba' where city_code = 'CTC' or airport_code = 'CTC';
update airport set timezone = 'America/Cordoba' where city_code = 'SDE' or airport_code = 'SDE';
update airport set timezone = 'America/Cordoba' where city_code = 'IRJ' or airport_code = 'IRJ';
update airport set timezone = 'America/Cordoba' where city_code = 'TUC' or airport_code = 'TUC';
update airport set timezone = 'America/Cordoba' where city_code = 'UAQ' or airport_code = 'UAQ';
update airport set timezone = 'America/Cordoba' where city_code = 'RCU' or airport_code = 'RCU';
update airport set timezone = 'America/Cordoba' where city_code = 'VDR' or airport_code = 'VDR';
update airport set timezone = 'America/Cordoba' where city_code = 'LUQ' or airport_code = 'LUQ';
update airport set timezone = 'America/Cordoba' where city_code = 'CNQ' or airport_code = 'CNQ';
update airport set timezone = 'America/Cordoba' where city_code = 'RES' or airport_code = 'RES';
update airport set timezone = 'America/Cordoba' where city_code = 'FMA' or airport_code = 'FMA';
update airport set timezone = 'America/Cordoba' where city_code = 'IGR' or airport_code = 'IGR';
update airport set timezone = 'America/Cordoba' where city_code = 'AOL' or airport_code = 'AOL';
update airport set timezone = 'America/Cordoba' where city_code = 'PSS' or airport_code = 'PSS';
update airport set timezone = 'America/Cordoba' where city_code = 'SLA' or airport_code = 'SLA';
update airport set timezone = 'America/Cordoba' where city_code = 'JUJ' or airport_code = 'JUJ';
update airport set timezone = 'America/Cordoba' where city_code = 'ORA' or airport_code = 'ORA';
update airport set timezone = 'America/Chicago' where city_code = 'C47' or airport_code = 'C47';
update airport set timezone = 'America/Cordoba' where city_code = 'EHL' or airport_code = 'EHL';
update airport set timezone = 'America/Cordoba' where city_code = 'CRD' or airport_code = 'CRD';
update airport set timezone = 'America/Cordoba' where city_code = 'EQS' or airport_code = 'EQS';
update airport set timezone = 'America/Cordoba' where city_code = 'REL' or airport_code = 'REL';
update airport set timezone = 'America/Cordoba' where city_code = 'VDM' or airport_code = 'VDM';
update airport set timezone = 'America/Cordoba' where city_code = 'PMY' or airport_code = 'PMY';
update airport set timezone = 'America/Cordoba' where city_code = 'PUD' or airport_code = 'PUD';
update airport set timezone = 'America/Cordoba' where city_code = 'RGA' or airport_code = 'RGA';
update airport set timezone = 'America/Cordoba' where city_code = 'RGL' or airport_code = 'RGL';
update airport set timezone = 'America/Cordoba' where city_code = 'USH' or airport_code = 'USH';
update airport set timezone = 'America/Cordoba' where city_code = 'ULA' or airport_code = 'ULA';
update airport set timezone = 'America/Cordoba' where city_code = 'PMQ' or airport_code = 'PMQ';
update airport set timezone = 'America/Cordoba' where city_code = 'RZA' or airport_code = 'RZA';
update airport set timezone = 'America/Cordoba' where city_code = 'BHI' or airport_code = 'BHI';
update airport set timezone = 'America/Chicago' where city_code = 'IWD' or airport_code = 'IWD';
update airport set timezone = 'America/Cordoba' where city_code = 'MDQ' or airport_code = 'MDQ';
update airport set timezone = 'America/Cordoba' where city_code = 'NQN' or airport_code = 'NQN';
update airport set timezone = 'America/New_York' where city_code = 'MCD' or airport_code = 'MCD';
update airport set timezone = 'America/Cordoba' where city_code = 'RSA' or airport_code = 'RSA';
update airport set timezone = 'America/Cordoba' where city_code = 'BRC' or airport_code = 'BRC';
update airport set timezone = 'America/Cordoba' where city_code = 'TDL' or airport_code = 'TDL';
update airport set timezone = 'America/Cordoba' where city_code = 'VLG' or airport_code = 'VLG';
update airport set timezone = 'America/Cordoba' where city_code = 'CPC' or airport_code = 'CPC';
update airport set timezone = 'America/Boa_Vista' where city_code = 'CDJ' or airport_code = 'CDJ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'AQA' or airport_code = 'AQA';
update airport set timezone = 'America/Fortaleza' where city_code = 'AJU' or airport_code = 'AJU';
update airport set timezone = 'America/Campo_Grande' where city_code = 'AFL' or airport_code = 'AFL';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ARU' or airport_code = 'ARU';
update airport set timezone = 'America/Boa_Vista' where city_code = 'BEL' or airport_code = 'BEL';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BGX' or airport_code = 'BGX';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PLU' or airport_code = 'PLU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BFH' or airport_code = 'BFH';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BSB' or airport_code = 'BSB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BAU' or airport_code = 'BAU';
update airport set timezone = 'America/Boa_Vista' where city_code = 'BVB' or airport_code = 'BVB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CAC' or airport_code = 'CAC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CNF' or airport_code = 'CNF';
update airport set timezone = 'America/Campo_Grande' where city_code = 'CGR' or airport_code = 'CGR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'XAP' or airport_code = 'XAP';
update airport set timezone = 'America/Fortaleza' where city_code = 'CLN' or airport_code = 'CLN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CCM' or airport_code = 'CCM';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CAW' or airport_code = 'CAW';
update airport set timezone = 'America/Campo_Grande' where city_code = 'CMG' or airport_code = 'CMG';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CWB' or airport_code = 'CWB';
update airport set timezone = 'America/Fortaleza' where city_code = 'CRQ' or airport_code = 'CRQ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CXJ' or airport_code = 'CXJ';
update airport set timezone = 'America/Campo_Grande' where city_code = 'CGB' or airport_code = 'CGB';
update airport set timezone = 'America/Rio_Branco' where city_code = 'CZS' or airport_code = 'CZS';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PPB' or airport_code = 'PPB';
update airport set timezone = 'America/Boa_Vista' where city_code = 'MAO' or airport_code = 'MAO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'IGU' or airport_code = 'IGU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'FLN' or airport_code = 'FLN';
update airport set timezone = 'America/Fortaleza' where city_code = 'FEN' or airport_code = 'FEN';
update airport set timezone = 'America/Fortaleza' where city_code = 'FOR' or airport_code = 'FOR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GIG' or airport_code = 'GIG';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GYN' or airport_code = 'GYN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GRU' or airport_code = 'GRU';
update airport set timezone = 'America/Boa_Vista' where city_code = 'ATM' or airport_code = 'ATM';
update airport set timezone = 'America/Fortaleza' where city_code = 'IOS' or airport_code = 'IOS';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'IPN' or airport_code = 'IPN';
update airport set timezone = 'America/Fortaleza' where city_code = 'IMP' or airport_code = 'IMP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'JDF' or airport_code = 'JDF';
update airport set timezone = 'America/Fortaleza' where city_code = 'JPA' or airport_code = 'JPA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'JOI' or airport_code = 'JOI';
update airport set timezone = 'America/Fortaleza' where city_code = 'CPV' or airport_code = 'CPV';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'VCP' or airport_code = 'VCP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'LIP' or airport_code = 'LIP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'LDB' or airport_code = 'LDB';
update airport set timezone = 'America/Fortaleza' where city_code = 'LAZ' or airport_code = 'LAZ';
update airport set timezone = 'America/Boa_Vista' where city_code = 'MAB' or airport_code = 'MAB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'MGF' or airport_code = 'MGF';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'MOC' or airport_code = 'MOC';
update airport set timezone = 'America/Chicago' where city_code = 'GRM' or airport_code = 'GRM';
update airport set timezone = 'America/Fortaleza' where city_code = 'MCZ' or airport_code = 'MCZ';
update airport set timezone = 'America/Fortaleza' where city_code = 'MCP' or airport_code = 'MCP';
update airport set timezone = 'America/Boa_Vista' where city_code = 'MNX' or airport_code = 'MNX';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'NVT' or airport_code = 'NVT';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GEL' or airport_code = 'GEL';
update airport set timezone = 'America/Fortaleza' where city_code = 'NAT' or airport_code = 'NAT';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'POA' or airport_code = 'POA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'POO' or airport_code = 'POO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PFB' or airport_code = 'PFB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PET' or airport_code = 'PET';
update airport set timezone = 'America/Fortaleza' where city_code = 'PNZ' or airport_code = 'PNZ';
update airport set timezone = 'America/Fortaleza' where city_code = 'PNB' or airport_code = 'PNB';
update airport set timezone = 'America/Campo_Grande' where city_code = 'PMG' or airport_code = 'PMG';
update airport set timezone = 'America/Boa_Vista' where city_code = 'PVH' or airport_code = 'PVH';
update airport set timezone = 'America/Chicago' where city_code = 'NPZ' or airport_code = 'NPZ';
update airport set timezone = 'America/Rio_Branco' where city_code = 'RBR' or airport_code = 'RBR';
update airport set timezone = 'America/Fortaleza' where city_code = 'REC' or airport_code = 'REC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'RIG' or airport_code = 'RIG';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SDU' or airport_code = 'SDU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'RAO' or airport_code = 'RAO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'STU' or airport_code = 'STU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SJK' or airport_code = 'SJK';
update airport set timezone = 'America/Fortaleza' where city_code = 'SLZ' or airport_code = 'SLZ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CGH' or airport_code = 'CGH';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SJP' or airport_code = 'SJP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SSZ' or airport_code = 'SSZ';
update airport set timezone = 'America/Fortaleza' where city_code = 'SSA' or airport_code = 'SSA';
update airport set timezone = 'America/Boa_Vista' where city_code = 'TMT' or airport_code = 'TMT';
update airport set timezone = 'America/Fortaleza' where city_code = 'THE' or airport_code = 'THE';
update airport set timezone = 'America/Boa_Vista' where city_code = 'TFF' or airport_code = 'TFF';
update airport set timezone = 'America/Boa_Vista' where city_code = 'TBT' or airport_code = 'TBT';
update airport set timezone = 'America/Boa_Vista' where city_code = 'TUR' or airport_code = 'TUR';
update airport set timezone = 'America/Fortaleza' where city_code = 'PAV' or airport_code = 'PAV';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'URG' or airport_code = 'URG';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'UDI' or airport_code = 'UDI';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'UBA' or airport_code = 'UBA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'VAG' or airport_code = 'VAG';
update airport set timezone = 'America/Boa_Vista' where city_code = 'BVH' or airport_code = 'BVH';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'VIX' or airport_code = 'VIX';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QPS' or airport_code = 'QPS';
update airport set timezone = 'America/Santiago' where city_code = 'ARI' or airport_code = 'ARI';
update airport set timezone = 'America/Santiago' where city_code = 'BBA' or airport_code = 'BBA';
update airport set timezone = 'America/Santiago' where city_code = 'CCH' or airport_code = 'CCH';
update airport set timezone = 'America/Santiago' where city_code = 'CJC' or airport_code = 'CJC';
update airport set timezone = 'America/Santiago' where city_code = 'PUQ' or airport_code = 'PUQ';
update airport set timezone = 'America/Santiago' where city_code = 'GXQ' or airport_code = 'GXQ';
update airport set timezone = 'America/Santiago' where city_code = 'IQQ' or airport_code = 'IQQ';
update airport set timezone = 'America/Santiago' where city_code = 'SCL' or airport_code = 'SCL';
update airport set timezone = 'America/Santiago' where city_code = 'ANF' or airport_code = 'ANF';
update airport set timezone = 'America/Santiago' where city_code = 'LSQ' or airport_code = 'LSQ';
update airport set timezone = 'America/Santiago' where city_code = 'CCP' or airport_code = 'CCP';
update airport set timezone = 'Pacific/Easter' where city_code = 'IPC' or airport_code = 'IPC';
update airport set timezone = 'America/Santiago' where city_code = 'ZOS' or airport_code = 'ZOS';
update airport set timezone = 'America/Santiago' where city_code = 'LSC' or airport_code = 'LSC';
update airport set timezone = 'America/Santiago' where city_code = 'ZCO' or airport_code = 'ZCO';
update airport set timezone = 'America/Santiago' where city_code = 'PMC' or airport_code = 'PMC';
update airport set timezone = 'America/Santiago' where city_code = 'WCH' or airport_code = 'WCH';
update airport set timezone = 'America/Santiago' where city_code = 'ZAL' or airport_code = 'ZAL';
update airport set timezone = 'America/Guayaquil' where city_code = 'ATF' or airport_code = 'ATF';
update airport set timezone = 'America/Guayaquil' where city_code = 'OCC' or airport_code = 'OCC';
update airport set timezone = 'America/Guayaquil' where city_code = 'CUE' or airport_code = 'CUE';
update airport set timezone = 'Pacific/Galapagos' where city_code = 'GPS' or airport_code = 'GPS';
update airport set timezone = 'America/Guayaquil' where city_code = 'GYE' or airport_code = 'GYE';
update airport set timezone = 'America/Guayaquil' where city_code = 'XMS' or airport_code = 'XMS';
update airport set timezone = 'America/Guayaquil' where city_code = 'MCH' or airport_code = 'MCH';
update airport set timezone = 'America/Guayaquil' where city_code = 'MEC' or airport_code = 'MEC';
update airport set timezone = 'America/Guayaquil' where city_code = 'PVO' or airport_code = 'PVO';
update airport set timezone = 'America/Guayaquil' where city_code = 'UIO' or airport_code = 'UIO';
update airport set timezone = 'America/Guayaquil' where city_code = 'SNC' or airport_code = 'SNC';
update airport set timezone = 'America/Guayaquil' where city_code = 'TPC' or airport_code = 'TPC';
update airport set timezone = 'America/Guayaquil' where city_code = 'TUA' or airport_code = 'TUA';
update airport set timezone = 'America/Asuncion' where city_code = 'ASU' or airport_code = 'ASU';
update airport set timezone = 'America/Bogota' where city_code = 'AXM' or airport_code = 'AXM';
update airport set timezone = 'America/Bogota' where city_code = 'PUU' or airport_code = 'PUU';
update airport set timezone = 'America/Bogota' where city_code = 'BGA' or airport_code = 'BGA';
update airport set timezone = 'America/Bogota' where city_code = 'BOG' or airport_code = 'BOG';
update airport set timezone = 'America/Bogota' where city_code = 'BAQ' or airport_code = 'BAQ';
update airport set timezone = 'America/Bogota' where city_code = 'BSC' or airport_code = 'BSC';
update airport set timezone = 'America/Bogota' where city_code = 'BUN' or airport_code = 'BUN';
update airport set timezone = 'America/Bogota' where city_code = 'CUC' or airport_code = 'CUC';
update airport set timezone = 'America/Bogota' where city_code = 'CTG' or airport_code = 'CTG';
update airport set timezone = 'America/Bogota' where city_code = 'CLO' or airport_code = 'CLO';
update airport set timezone = 'America/Bogota' where city_code = 'TCO' or airport_code = 'TCO';
update airport set timezone = 'America/Bogota' where city_code = 'CZU' or airport_code = 'CZU';
update airport set timezone = 'America/Bogota' where city_code = 'EJA' or airport_code = 'EJA';
update airport set timezone = 'America/Bogota' where city_code = 'FLA' or airport_code = 'FLA';
update airport set timezone = 'America/Anchorage' where city_code = 'MXY' or airport_code = 'MXY';
update airport set timezone = 'America/Bogota' where city_code = 'GPI' or airport_code = 'GPI';
update airport set timezone = 'America/Bogota' where city_code = 'IBE' or airport_code = 'IBE';
update airport set timezone = 'America/Bogota' where city_code = 'IPI' or airport_code = 'IPI';
update airport set timezone = 'America/Bogota' where city_code = 'LET' or airport_code = 'LET';
update airport set timezone = 'America/Bogota' where city_code = 'EOH' or airport_code = 'EOH';
update airport set timezone = 'America/Bogota' where city_code = 'MGN' or airport_code = 'MGN';
update airport set timezone = 'America/Bogota' where city_code = 'MTR' or airport_code = 'MTR';
update airport set timezone = 'America/Bogota' where city_code = 'MVP' or airport_code = 'MVP';
update airport set timezone = 'America/Bogota' where city_code = 'MZL' or airport_code = 'MZL';
update airport set timezone = 'America/Bogota' where city_code = 'NVA' or airport_code = 'NVA';
update airport set timezone = 'America/Bogota' where city_code = 'OCV' or airport_code = 'OCV';
update airport set timezone = 'America/Bogota' where city_code = 'OTU' or airport_code = 'OTU';
update airport set timezone = 'America/Bogota' where city_code = 'PCR' or airport_code = 'PCR';
update airport set timezone = 'America/Bogota' where city_code = 'PEI' or airport_code = 'PEI';
update airport set timezone = 'America/Bogota' where city_code = 'PPN' or airport_code = 'PPN';
update airport set timezone = 'America/Bogota' where city_code = 'PSO' or airport_code = 'PSO';
update airport set timezone = 'America/Bogota' where city_code = 'PVA' or airport_code = 'PVA';
update airport set timezone = 'America/Bogota' where city_code = 'MDE' or airport_code = 'MDE';
update airport set timezone = 'America/Bogota' where city_code = 'RCH' or airport_code = 'RCH';
update airport set timezone = 'America/Bogota' where city_code = 'SJE' or airport_code = 'SJE';
update airport set timezone = 'America/Bogota' where city_code = 'SMR' or airport_code = 'SMR';
update airport set timezone = 'America/Bogota' where city_code = 'ADZ' or airport_code = 'ADZ';
update airport set timezone = 'America/Bogota' where city_code = 'SVI' or airport_code = 'SVI';
update airport set timezone = 'America/Bogota' where city_code = 'TME' or airport_code = 'TME';
update airport set timezone = 'America/Bogota' where city_code = 'AUC' or airport_code = 'AUC';
update airport set timezone = 'America/Bogota' where city_code = 'UIB' or airport_code = 'UIB';
update airport set timezone = 'America/Bogota' where city_code = 'ULQ' or airport_code = 'ULQ';
update airport set timezone = 'America/Bogota' where city_code = 'VUP' or airport_code = 'VUP';
update airport set timezone = 'America/Bogota' where city_code = 'VVC' or airport_code = 'VVC';
update airport set timezone = 'America/La_Paz' where city_code = 'BJO' or airport_code = 'BJO';
update airport set timezone = 'America/La_Paz' where city_code = 'CBB' or airport_code = 'CBB';
update airport set timezone = 'America/La_Paz' where city_code = 'CIJ' or airport_code = 'CIJ';
update airport set timezone = 'America/La_Paz' where city_code = 'LPB' or airport_code = 'LPB';
update airport set timezone = 'America/La_Paz' where city_code = 'POI' or airport_code = 'POI';
update airport set timezone = 'America/La_Paz' where city_code = 'PSZ' or airport_code = 'PSZ';
update airport set timezone = 'America/La_Paz' where city_code = 'SRE' or airport_code = 'SRE';
update airport set timezone = 'America/La_Paz' where city_code = 'TJA' or airport_code = 'TJA';
update airport set timezone = 'America/La_Paz' where city_code = 'TDD' or airport_code = 'TDD';
update airport set timezone = 'America/La_Paz' where city_code = 'VVI' or airport_code = 'VVI';
update airport set timezone = 'America/La_Paz' where city_code = 'BYC' or airport_code = 'BYC';
update airport set timezone = 'America/Paramaribo' where city_code = 'PBM' or airport_code = 'PBM';
update airport set timezone = 'America/Cayenne' where city_code = 'CAY' or airport_code = 'CAY';
update airport set timezone = 'America/Anchorage' where city_code = 'SWD' or airport_code = 'SWD';
update airport set timezone = 'America/Lima' where city_code = 'PCL' or airport_code = 'PCL';
update airport set timezone = 'America/Lima' where city_code = 'CHM' or airport_code = 'CHM';
update airport set timezone = 'America/Lima' where city_code = 'CIX' or airport_code = 'CIX';
update airport set timezone = 'America/Lima' where city_code = 'AYP' or airport_code = 'AYP';
update airport set timezone = 'America/Lima' where city_code = 'ANS' or airport_code = 'ANS';
update airport set timezone = 'America/Lima' where city_code = 'ATA' or airport_code = 'ATA';
update airport set timezone = 'America/Lima' where city_code = 'LIM' or airport_code = 'LIM';
update airport set timezone = 'America/Lima' where city_code = 'JJI' or airport_code = 'JJI';
update airport set timezone = 'America/Lima' where city_code = 'JUL' or airport_code = 'JUL';
update airport set timezone = 'America/Chicago' where city_code = 'MGC' or airport_code = 'MGC';
update airport set timezone = 'America/Lima' where city_code = 'TBP' or airport_code = 'TBP';
update airport set timezone = 'America/Lima' where city_code = 'YMS' or airport_code = 'YMS';
update airport set timezone = 'America/Lima' where city_code = 'CHH' or airport_code = 'CHH';
update airport set timezone = 'America/Lima' where city_code = 'IQT' or airport_code = 'IQT';
update airport set timezone = 'America/Lima' where city_code = 'AQP' or airport_code = 'AQP';
update airport set timezone = 'America/Lima' where city_code = 'TRU' or airport_code = 'TRU';
update airport set timezone = 'America/Lima' where city_code = 'PIO' or airport_code = 'PIO';
update airport set timezone = 'America/Lima' where city_code = 'TPP' or airport_code = 'TPP';
update airport set timezone = 'America/Lima' where city_code = 'TCQ' or airport_code = 'TCQ';
update airport set timezone = 'America/Lima' where city_code = 'PEM' or airport_code = 'PEM';
update airport set timezone = 'America/Lima' where city_code = 'PIU' or airport_code = 'PIU';
update airport set timezone = 'America/Lima' where city_code = 'TYL' or airport_code = 'TYL';
update airport set timezone = 'America/Lima' where city_code = 'CUZ' or airport_code = 'CUZ';
update airport set timezone = 'America/Montevideo' where city_code = 'MVD' or airport_code = 'MVD';
update airport set timezone = 'America/Montevideo' where city_code = 'STY' or airport_code = 'STY';
update airport set timezone = 'America/Caracas' where city_code = 'AGV' or airport_code = 'AGV';
update airport set timezone = 'America/Caracas' where city_code = 'AAO' or airport_code = 'AAO';
update airport set timezone = 'America/Caracas' where city_code = 'BLA' or airport_code = 'BLA';
update airport set timezone = 'America/Caracas' where city_code = 'BNS' or airport_code = 'BNS';
update airport set timezone = 'America/Caracas' where city_code = 'BRM' or airport_code = 'BRM';
update airport set timezone = 'America/Caracas' where city_code = 'CBL' or airport_code = 'CBL';
update airport set timezone = 'America/Caracas' where city_code = 'CAJ' or airport_code = 'CAJ';
update airport set timezone = 'America/Caracas' where city_code = 'CUP' or airport_code = 'CUP';
update airport set timezone = 'America/Caracas' where city_code = 'CZE' or airport_code = 'CZE';
update airport set timezone = 'America/Caracas' where city_code = 'CUM' or airport_code = 'CUM';
update airport set timezone = 'America/Caracas' where city_code = 'GUI' or airport_code = 'GUI';
update airport set timezone = 'America/Caracas' where city_code = 'GUQ' or airport_code = 'GUQ';
update airport set timezone = 'America/Caracas' where city_code = 'LSP' or airport_code = 'LSP';
update airport set timezone = 'America/Caracas' where city_code = 'LFR' or airport_code = 'LFR';
update airport set timezone = 'America/Caracas' where city_code = 'MAR' or airport_code = 'MAR';
update airport set timezone = 'America/Caracas' where city_code = 'MRD' or airport_code = 'MRD';
update airport set timezone = 'America/Caracas' where city_code = 'PMV' or airport_code = 'PMV';
update airport set timezone = 'America/Caracas' where city_code = 'CCS' or airport_code = 'CCS';
update airport set timezone = 'America/Caracas' where city_code = 'MUN' or airport_code = 'MUN';
update airport set timezone = 'America/Caracas' where city_code = 'PYH' or airport_code = 'PYH';
update airport set timezone = 'America/Caracas' where city_code = 'PBL' or airport_code = 'PBL';
update airport set timezone = 'America/Caracas' where city_code = 'PZO' or airport_code = 'PZO';
update airport set timezone = 'America/Caracas' where city_code = 'SVZ' or airport_code = 'SVZ';
update airport set timezone = 'America/Caracas' where city_code = 'STD' or airport_code = 'STD';
update airport set timezone = 'America/Caracas' where city_code = 'SFH' or airport_code = 'SFH';
update airport set timezone = 'America/Caracas' where city_code = 'SFD' or airport_code = 'SFD';
update airport set timezone = 'America/Caracas' where city_code = 'SOM' or airport_code = 'SOM';
update airport set timezone = 'America/Caracas' where city_code = 'STB' or airport_code = 'STB';
update airport set timezone = 'America/Caracas' where city_code = 'TUV' or airport_code = 'TUV';
update airport set timezone = 'America/Caracas' where city_code = 'VLN' or airport_code = 'VLN';
update airport set timezone = 'America/Caracas' where city_code = 'VLV' or airport_code = 'VLV';
update airport set timezone = 'America/Caracas' where city_code = 'VDP' or airport_code = 'VDP';
update airport set timezone = 'America/Guyana' where city_code = 'LTM' or airport_code = 'LTM';
update airport set timezone = 'America/Antigua' where city_code = 'ANU' or airport_code = 'ANU';
update airport set timezone = 'America/Barbados' where city_code = 'BGI' or airport_code = 'BGI';
update airport set timezone = 'America/Dominica' where city_code = 'DCF' or airport_code = 'DCF';
update airport set timezone = 'America/Dominica' where city_code = 'DOM' or airport_code = 'DOM';
update airport set timezone = 'America/Martinique' where city_code = 'FDF' or airport_code = 'FDF';
update airport set timezone = '\N' where city_code = 'SFG' or airport_code = 'SFG';
update airport set timezone = 'America/Guadeloupe' where city_code = 'PTP' or airport_code = 'PTP';
update airport set timezone = 'America/Grenada' where city_code = 'GND' or airport_code = 'GND';
update airport set timezone = 'America/St_Thomas' where city_code = 'STT' or airport_code = 'STT';
update airport set timezone = 'America/St_Thomas' where city_code = 'STX' or airport_code = 'STX';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'BQN' or airport_code = 'BQN';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'FAJ' or airport_code = 'FAJ';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'SIG' or airport_code = 'SIG';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'MAZ' or airport_code = 'MAZ';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'PSE' or airport_code = 'PSE';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'SJU' or airport_code = 'SJU';
update airport set timezone = 'America/St_Kitts' where city_code = 'SKB' or airport_code = 'SKB';
update airport set timezone = 'America/St_Lucia' where city_code = 'SLU' or airport_code = 'SLU';
update airport set timezone = 'America/St_Lucia' where city_code = 'UVF' or airport_code = 'UVF';
update airport set timezone = 'America/Aruba' where city_code = 'AUA' or airport_code = 'AUA';
update airport set timezone = 'America/Curacao' where city_code = 'BON' or airport_code = 'BON';
update airport set timezone = 'America/Curacao' where city_code = 'CUR' or airport_code = 'CUR';
update airport set timezone = 'America/Curacao' where city_code = 'EUX' or airport_code = 'EUX';
update airport set timezone = 'America/Curacao' where city_code = 'SXM' or airport_code = 'SXM';
update airport set timezone = 'America/Anguilla' where city_code = 'AXA' or airport_code = 'AXA';
update airport set timezone = 'America/Port_of_Spain' where city_code = 'TAB' or airport_code = 'TAB';
update airport set timezone = 'America/Port_of_Spain' where city_code = 'POS' or airport_code = 'POS';
update airport set timezone = 'America/Tortola' where city_code = 'EIS' or airport_code = 'EIS';
update airport set timezone = 'America/Anchorage' where city_code = 'AET' or airport_code = 'AET';
update airport set timezone = 'America/St_Vincent' where city_code = 'CIW' or airport_code = 'CIW';
update airport set timezone = 'America/St_Vincent' where city_code = 'MQS' or airport_code = 'MQS';
update airport set timezone = 'America/St_Vincent' where city_code = 'SVD' or airport_code = 'SVD';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'ALA' or airport_code = 'ALA';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'TSE' or airport_code = 'TSE';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'DMB' or airport_code = 'DMB';
update airport set timezone = 'Asia/Bishkek' where city_code = 'FRU' or airport_code = 'FRU';
update airport set timezone = 'Asia/Bishkek' where city_code = 'OSS' or airport_code = 'OSS';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'CIT' or airport_code = 'CIT';
update airport set timezone = '\N' where city_code = 'YAK' or airport_code = 'YAK';
update airport set timezone = 'Asia/Oral' where city_code = 'URA' or airport_code = 'URA';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'PWQ' or airport_code = 'PWQ';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'PLX' or airport_code = 'PLX';
update airport set timezone = 'Asia/Oral' where city_code = 'AKX' or airport_code = 'AKX';
update airport set timezone = 'Asia/Baku' where city_code = 'GYD' or airport_code = 'GYD';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'YKS' or airport_code = 'YKS';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'MJZ' or airport_code = 'MJZ';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'BQS' or airport_code = 'BQS';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'KHV' or airport_code = 'KHV';
update airport set timezone = 'America/New_York' where city_code = 'MQT' or airport_code = 'MQT';
update airport set timezone = 'Asia/Magadan' where city_code = 'PVS' or airport_code = 'PVS';
update airport set timezone = 'Asia/Magadan' where city_code = 'GDX' or airport_code = 'GDX';
update airport set timezone = '\N' where city_code = 'PWE' or airport_code = 'PWE';
update airport set timezone = 'Asia/Magadan' where city_code = 'PKC' or airport_code = 'PKC';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'UUS' or airport_code = 'UUS';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'VVO' or airport_code = 'VVO';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'HTA' or airport_code = 'HTA';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'BTK' or airport_code = 'BTK';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'IKT' or airport_code = 'IKT';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'UUD' or airport_code = 'UUD';
update airport set timezone = 'Europe/Kiev' where city_code = 'KBP' or airport_code = 'KBP';
update airport set timezone = 'Europe/Kiev' where city_code = 'DOK' or airport_code = 'DOK';
update airport set timezone = 'Europe/Kiev' where city_code = 'DNK' or airport_code = 'DNK';
update airport set timezone = 'Europe/Kiev' where city_code = 'SIP' or airport_code = 'SIP';
update airport set timezone = 'Europe/Kiev' where city_code = 'IEV' or airport_code = 'IEV';
update airport set timezone = 'Europe/Kiev' where city_code = 'LWO' or airport_code = 'LWO';
update airport set timezone = 'America/Chicago' where city_code = 'IMT' or airport_code = 'IMT';
update airport set timezone = 'Europe/Kiev' where city_code = 'ODS' or airport_code = 'ODS';
update airport set timezone = 'Europe/Moscow' where city_code = 'LED' or airport_code = 'LED';
update airport set timezone = 'Europe/Moscow' where city_code = 'MMK' or airport_code = 'MMK';
update airport set timezone = 'Europe/Minsk' where city_code = 'GME' or airport_code = 'GME';
update airport set timezone = 'Europe/Minsk' where city_code = 'VTB' or airport_code = 'VTB';
update airport set timezone = 'Europe/Kaliningrad' where city_code = 'KGD' or airport_code = 'KGD';
update airport set timezone = 'Europe/Minsk' where city_code = 'MHP' or airport_code = 'MHP';
update airport set timezone = 'Europe/Minsk' where city_code = 'MSQ' or airport_code = 'MSQ';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'ABA' or airport_code = 'ABA';
update airport set timezone = 'Asia/Omsk' where city_code = 'BAX' or airport_code = 'BAX';
update airport set timezone = 'Asia/Omsk' where city_code = 'KEJ' or airport_code = 'KEJ';
update airport set timezone = 'Asia/Omsk' where city_code = 'OMS' or airport_code = 'OMS';
update airport set timezone = 'Europe/Moscow' where city_code = 'KRR' or airport_code = 'KRR';
update airport set timezone = 'Europe/Moscow' where city_code = 'MCX' or airport_code = 'MCX';
update airport set timezone = 'Europe/Moscow' where city_code = 'MRV' or airport_code = 'MRV';
update airport set timezone = 'Europe/Moscow' where city_code = 'STW' or airport_code = 'STW';
update airport set timezone = 'Europe/Moscow' where city_code = 'ROV' or airport_code = 'ROV';
update airport set timezone = 'Europe/Moscow' where city_code = 'AER' or airport_code = 'AER';
update airport set timezone = 'Europe/Moscow' where city_code = 'ASF' or airport_code = 'ASF';
update airport set timezone = 'Europe/Moscow' where city_code = 'VOG' or airport_code = 'VOG';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'CEK' or airport_code = 'CEK';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'MQF' or airport_code = 'MQF';
update airport set timezone = 'Pacific/Auckland' where city_code = 'GBZ' or airport_code = 'GBZ';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NJC' or airport_code = 'NJC';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'PEE' or airport_code = 'PEE';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'SGC' or airport_code = 'SGC';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'SVX' or airport_code = 'SVX';
update airport set timezone = 'Asia/Ashgabat' where city_code = 'ASB' or airport_code = 'ASB';
update airport set timezone = 'Asia/Ashgabat' where city_code = 'KRW' or airport_code = 'KRW';
update airport set timezone = 'Asia/Dushanbe' where city_code = 'DYU' or airport_code = 'DYU';
update airport set timezone = 'Asia/Samarkand' where city_code = 'BHK' or airport_code = 'BHK';
update airport set timezone = 'Asia/Samarkand' where city_code = 'SKD' or airport_code = 'SKD';
update airport set timezone = 'Asia/Qatar' where city_code = 'IUD' or airport_code = 'IUD';
update airport set timezone = 'Asia/Samarkand' where city_code = 'TAS' or airport_code = 'TAS';
update airport set timezone = 'Europe/Moscow' where city_code = 'BZK' or airport_code = 'BZK';
update airport set timezone = 'Europe/Moscow' where city_code = 'SVO' or airport_code = 'SVO';
update airport set timezone = 'Europe/Moscow' where city_code = 'KLD' or airport_code = 'KLD';
update airport set timezone = 'Europe/Moscow' where city_code = 'VOZ' or airport_code = 'VOZ';
update airport set timezone = 'Europe/Moscow' where city_code = 'VKO' or airport_code = 'VKO';
update airport set timezone = 'Europe/Moscow' where city_code = 'SCW' or airport_code = 'SCW';
update airport set timezone = 'Europe/Moscow' where city_code = 'KZN' or airport_code = 'KZN';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'REN' or airport_code = 'REN';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'UFA' or airport_code = 'UFA';
update airport set timezone = 'Europe/Moscow' where city_code = 'KBY' or airport_code = 'KBY';
update airport set timezone = 'Asia/Calcutta' where city_code = 'AMD' or airport_code = 'AMD';
update airport set timezone = 'Asia/Calcutta' where city_code = 'AKD' or airport_code = 'AKD';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXU' or airport_code = 'IXU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BOM' or airport_code = 'BOM';
update airport set timezone = 'Asia/Calcutta' where city_code = 'PAB' or airport_code = 'PAB';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BHJ' or airport_code = 'BHJ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXG' or airport_code = 'IXG';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BDQ' or airport_code = 'BDQ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BHO' or airport_code = 'BHO';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BHU' or airport_code = 'BHU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'NMB' or airport_code = 'NMB';
update airport set timezone = 'Asia/Calcutta' where city_code = 'GOI' or airport_code = 'GOI';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IDR' or airport_code = 'IDR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'JLR' or airport_code = 'JLR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'JGA' or airport_code = 'JGA';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXY' or airport_code = 'IXY';
update airport set timezone = 'Asia/Calcutta' where city_code = 'HJR' or airport_code = 'HJR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'KLH' or airport_code = 'KLH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXK' or airport_code = 'IXK';
update airport set timezone = 'Asia/Calcutta' where city_code = 'NAG' or airport_code = 'NAG';
update airport set timezone = 'Asia/Calcutta' where city_code = 'ISK' or airport_code = 'ISK';
update airport set timezone = 'Asia/Calcutta' where city_code = 'PNQ' or airport_code = 'PNQ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'PBD' or airport_code = 'PBD';
update airport set timezone = 'Asia/Calcutta' where city_code = 'RAJ' or airport_code = 'RAJ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'RPR' or airport_code = 'RPR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'SSE' or airport_code = 'SSE';
update airport set timezone = 'Asia/Calcutta' where city_code = 'STV' or airport_code = 'STV';
update airport set timezone = 'Asia/Calcutta' where city_code = 'UDR' or airport_code = 'UDR';
update airport set timezone = 'Asia/Colombo' where city_code = 'CMB' or airport_code = 'CMB';
update airport set timezone = 'Asia/Colombo' where city_code = 'RML' or airport_code = 'RML';
update airport set timezone = 'Asia/Colombo' where city_code = 'GOY' or airport_code = 'GOY';
update airport set timezone = 'Asia/Colombo' where city_code = 'JAF' or airport_code = 'JAF';
update airport set timezone = 'Asia/Colombo' where city_code = 'TRR' or airport_code = 'TRR';
update airport set timezone = 'Asia/Baghdad' where city_code = 'KIK' or airport_code = 'KIK';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'PNH' or airport_code = 'PNH';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'REP' or airport_code = 'REP';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXA' or airport_code = 'IXA';
update airport set timezone = 'Asia/Calcutta' where city_code = 'AJL' or airport_code = 'AJL';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXB' or airport_code = 'IXB';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BBI' or airport_code = 'BBI';
update airport set timezone = 'Asia/Calcutta' where city_code = 'CCU' or airport_code = 'CCU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'COH' or airport_code = 'COH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'DBD' or airport_code = 'DBD';
update airport set timezone = 'America/New_York' where city_code = 'ESC' or airport_code = 'ESC';
update airport set timezone = 'Asia/Calcutta' where city_code = 'GAY' or airport_code = 'GAY';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IMF' or airport_code = 'IMF';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXW' or airport_code = 'IXW';
update airport set timezone = 'Asia/Calcutta' where city_code = 'JRH' or airport_code = 'JRH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXH' or airport_code = 'IXH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXS' or airport_code = 'IXS';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXI' or airport_code = 'IXI';
update airport set timezone = 'Asia/Calcutta' where city_code = 'MOH' or airport_code = 'MOH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'PAT' or airport_code = 'PAT';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXR' or airport_code = 'IXR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'RRK' or airport_code = 'RRK';
update airport set timezone = 'Asia/Calcutta' where city_code = 'VTZ' or airport_code = 'VTZ';
update airport set timezone = 'Asia/Dhaka' where city_code = 'CXB' or airport_code = 'CXB';
update airport set timezone = 'Asia/Dhaka' where city_code = 'CGP' or airport_code = 'CGP';
update airport set timezone = 'Asia/Dhaka' where city_code = 'IRD' or airport_code = 'IRD';
update airport set timezone = 'Asia/Dhaka' where city_code = 'JSR' or airport_code = 'JSR';
update airport set timezone = 'Asia/Dhaka' where city_code = 'RJH' or airport_code = 'RJH';
update airport set timezone = 'Asia/Dhaka' where city_code = 'SPD' or airport_code = 'SPD';
update airport set timezone = 'Asia/Dhaka' where city_code = 'ZYL' or airport_code = 'ZYL';
update airport set timezone = 'Asia/Dhaka' where city_code = 'DAC' or airport_code = 'DAC';
update airport set timezone = 'Asia/Hong_Kong' where city_code = 'HKG' or airport_code = 'HKG';
update airport set timezone = 'Asia/Calcutta' where city_code = 'AGR' or airport_code = 'AGR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXD' or airport_code = 'IXD';
update airport set timezone = 'Asia/Calcutta' where city_code = 'ATQ' or airport_code = 'ATQ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'VNS' or airport_code = 'VNS';
update airport set timezone = 'Asia/Calcutta' where city_code = 'KUU' or airport_code = 'KUU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXC' or airport_code = 'IXC';
update airport set timezone = 'Asia/Calcutta' where city_code = 'DED' or airport_code = 'DED';
update airport set timezone = 'Asia/Calcutta' where city_code = 'DEL' or airport_code = 'DEL';
update airport set timezone = 'Asia/Calcutta' where city_code = 'GWL' or airport_code = 'GWL';
update airport set timezone = 'Asia/Calcutta' where city_code = 'JDH' or airport_code = 'JDH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'JAI' or airport_code = 'JAI';
update airport set timezone = 'Asia/Calcutta' where city_code = 'JSA' or airport_code = 'JSA';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXJ' or airport_code = 'IXJ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'KNU' or airport_code = 'KNU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'KTU' or airport_code = 'KTU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'LUH' or airport_code = 'LUH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXL' or airport_code = 'IXL';
update airport set timezone = 'Asia/Calcutta' where city_code = 'LKO' or airport_code = 'LKO';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXP' or airport_code = 'IXP';
update airport set timezone = 'Asia/Calcutta' where city_code = 'PGH' or airport_code = 'PGH';
update airport set timezone = 'Asia/Calcutta' where city_code = 'SXR' or airport_code = 'SXR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'TNI' or airport_code = 'TNI';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'BXH' or airport_code = 'BXH';
update airport set timezone = 'Asia/Vientiane' where city_code = 'LPQ' or airport_code = 'LPQ';
update airport set timezone = 'Asia/Vientiane' where city_code = 'PKZ' or airport_code = 'PKZ';
update airport set timezone = 'Asia/Vientiane' where city_code = 'ZVK' or airport_code = 'ZVK';
update airport set timezone = 'Asia/Vientiane' where city_code = 'VTE' or airport_code = 'VTE';
update airport set timezone = 'Asia/Macau' where city_code = 'MFM' or airport_code = 'MFM';
update airport set timezone = 'Asia/Katmandu' where city_code = 'BWA' or airport_code = 'BWA';
update airport set timezone = 'Asia/Katmandu' where city_code = 'KTM' or airport_code = 'KTM';
update airport set timezone = 'Asia/Katmandu' where city_code = 'PKR' or airport_code = 'PKR';
update airport set timezone = 'Asia/Katmandu' where city_code = 'SIF' or airport_code = 'SIF';
update airport set timezone = 'Asia/Katmandu' where city_code = 'BIR' or airport_code = 'BIR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'AGX' or airport_code = 'AGX';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BLR' or airport_code = 'BLR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'BEP' or airport_code = 'BEP';
update airport set timezone = 'Asia/Calcutta' where city_code = 'VGA' or airport_code = 'VGA';
update airport set timezone = 'Asia/Calcutta' where city_code = 'CJB' or airport_code = 'CJB';
update airport set timezone = 'Asia/Calcutta' where city_code = 'COK' or airport_code = 'COK';
update airport set timezone = 'Asia/Calcutta' where city_code = 'CCJ' or airport_code = 'CCJ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'CDP' or airport_code = 'CDP';
update airport set timezone = 'Asia/Calcutta' where city_code = 'HYD' or airport_code = 'HYD';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXM' or airport_code = 'IXM';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXE' or airport_code = 'IXE';
update airport set timezone = 'Asia/Calcutta' where city_code = 'MAA' or airport_code = 'MAA';
update airport set timezone = 'Asia/Calcutta' where city_code = 'IXZ' or airport_code = 'IXZ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'PNY' or airport_code = 'PNY';
update airport set timezone = 'Asia/Calcutta' where city_code = 'RJA' or airport_code = 'RJA';
update airport set timezone = 'Asia/Calcutta' where city_code = 'TIR' or airport_code = 'TIR';
update airport set timezone = 'Asia/Calcutta' where city_code = 'TRZ' or airport_code = 'TRZ';
update airport set timezone = 'Asia/Calcutta' where city_code = 'TRV' or airport_code = 'TRV';
update airport set timezone = 'Asia/Thimphu' where city_code = 'PBH' or airport_code = 'PBH';
update airport set timezone = 'Indian/Maldives' where city_code = 'MLE' or airport_code = 'MLE';
update airport set timezone = 'Asia/Bangkok' where city_code = 'DMK' or airport_code = 'DMK';
update airport set timezone = 'Asia/Makassar' where city_code = 'NAH' or airport_code = 'NAH';
update airport set timezone = 'Asia/Bangkok' where city_code = 'UTP' or airport_code = 'UTP';
update airport set timezone = 'Asia/Bangkok' where city_code = 'LPT' or airport_code = 'LPT';
update airport set timezone = 'Asia/Bangkok' where city_code = 'PRH' or airport_code = 'PRH';
update airport set timezone = 'Asia/Bangkok' where city_code = 'HHQ' or airport_code = 'HHQ';
update airport set timezone = 'Asia/Bangkok' where city_code = 'PHS' or airport_code = 'PHS';
update airport set timezone = 'Asia/Bangkok' where city_code = 'NAW' or airport_code = 'NAW';
update airport set timezone = 'Asia/Bangkok' where city_code = 'KBV' or airport_code = 'KBV';
update airport set timezone = 'Asia/Bangkok' where city_code = 'PAN' or airport_code = 'PAN';
update airport set timezone = 'Asia/Bangkok' where city_code = 'USM' or airport_code = 'USM';
update airport set timezone = 'Asia/Bangkok' where city_code = 'HKT' or airport_code = 'HKT';
update airport set timezone = 'Asia/Bangkok' where city_code = 'HDY' or airport_code = 'HDY';
update airport set timezone = 'Asia/Bangkok' where city_code = 'TST' or airport_code = 'TST';
update airport set timezone = 'Asia/Bangkok' where city_code = 'UTH' or airport_code = 'UTH';
update airport set timezone = 'Asia/Bangkok' where city_code = 'SNO' or airport_code = 'SNO';
update airport set timezone = 'Asia/Bangkok' where city_code = 'LOE' or airport_code = 'LOE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'OKB' or airport_code = 'OKB';
update airport set timezone = 'Asia/Saigon' where city_code = 'DAD' or airport_code = 'DAD';
update airport set timezone = 'Asia/Saigon' where city_code = 'HAN' or airport_code = 'HAN';
update airport set timezone = 'Asia/Saigon' where city_code = 'NHA' or airport_code = 'NHA';
update airport set timezone = 'Asia/Saigon' where city_code = 'SGN' or airport_code = 'SGN';
update airport set timezone = 'Africa/Nairobi' where city_code = 'BMQ' or airport_code = 'BMQ';
update airport set timezone = 'Asia/Rangoon' where city_code = 'HEH' or airport_code = 'HEH';
update airport set timezone = 'Asia/Rangoon' where city_code = 'KET' or airport_code = 'KET';
update airport set timezone = 'America/Chicago' where city_code = 'MWA' or airport_code = 'MWA';
update airport set timezone = 'Asia/Rangoon' where city_code = 'KYP' or airport_code = 'KYP';
update airport set timezone = 'Asia/Rangoon' where city_code = 'LSH' or airport_code = 'LSH';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MDL' or airport_code = 'MDL';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MGZ' or airport_code = 'MGZ';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MYT' or airport_code = 'MYT';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MOG' or airport_code = 'MOG';
update airport set timezone = 'Asia/Rangoon' where city_code = 'PBU' or airport_code = 'PBU';
update airport set timezone = 'Asia/Rangoon' where city_code = 'AKY' or airport_code = 'AKY';
update airport set timezone = 'Asia/Rangoon' where city_code = 'SNW' or airport_code = 'SNW';
update airport set timezone = 'Asia/Rangoon' where city_code = 'THL' or airport_code = 'THL';
update airport set timezone = 'Asia/Rangoon' where city_code = 'RGN' or airport_code = 'RGN';
update airport set timezone = 'Asia/Makassar' where city_code = 'UPG' or airport_code = 'UPG';
update airport set timezone = 'Asia/Jayapura' where city_code = 'BIK' or airport_code = 'BIK';
update airport set timezone = 'Asia/Jayapura' where city_code = 'NBX' or airport_code = 'NBX';
update airport set timezone = 'Asia/Jayapura' where city_code = 'TIM' or airport_code = 'TIM';
update airport set timezone = 'Asia/Jayapura' where city_code = 'DJJ' or airport_code = 'DJJ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'WMX' or airport_code = 'WMX';
update airport set timezone = 'Asia/Jayapura' where city_code = 'MKQ' or airport_code = 'MKQ';
update airport set timezone = 'Asia/Makassar' where city_code = 'GTO' or airport_code = 'GTO';
update airport set timezone = 'Asia/Seoul' where city_code = 'ICN' or airport_code = 'ICN';
update airport set timezone = 'Asia/Makassar' where city_code = 'PLW' or airport_code = 'PLW';
update airport set timezone = 'Asia/Makassar' where city_code = 'MDC' or airport_code = 'MDC';
update airport set timezone = 'Asia/Makassar' where city_code = 'PSJ' or airport_code = 'PSJ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'OTI' or airport_code = 'OTI';
update airport set timezone = 'Asia/Jayapura' where city_code = 'TTE' or airport_code = 'TTE';
update airport set timezone = 'Asia/Makassar' where city_code = 'LUW' or airport_code = 'LUW';
update airport set timezone = 'Asia/Jayapura' where city_code = 'AMQ' or airport_code = 'AMQ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'FKQ' or airport_code = 'FKQ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KNG' or airport_code = 'KNG';
update airport set timezone = 'Asia/Jayapura' where city_code = 'BXB' or airport_code = 'BXB';
update airport set timezone = 'Asia/Jayapura' where city_code = 'MKW' or airport_code = 'MKW';
update airport set timezone = 'Asia/Jayapura' where city_code = 'SOQ' or airport_code = 'SOQ';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'BTU' or airport_code = 'BTU';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'KCH' or airport_code = 'KCH';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LMN' or airport_code = 'LMN';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'MUR' or airport_code = 'MUR';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'MYY' or airport_code = 'MYY';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'SBW' or airport_code = 'SBW';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LDU' or airport_code = 'LDU';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'BKI' or airport_code = 'BKI';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LBU' or airport_code = 'LBU';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'TWU' or airport_code = 'TWU';
update airport set timezone = 'Asia/Brunei' where city_code = 'BWN' or airport_code = 'BWN';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PKU' or airport_code = 'PKU';
update airport set timezone = 'Asia/Jakarta' where city_code = 'DUM' or airport_code = 'DUM';
update airport set timezone = 'Asia/Jakarta' where city_code = 'CGK' or airport_code = 'CGK';
update airport set timezone = 'Asia/Jakarta' where city_code = 'GNS' or airport_code = 'GNS';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PDG' or airport_code = 'PDG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'MES' or airport_code = 'MES';
update airport set timezone = 'Asia/Jakarta' where city_code = 'KTG' or airport_code = 'KTG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PNK' or airport_code = 'PNK';
update airport set timezone = 'Asia/Jakarta' where city_code = 'DJB' or airport_code = 'DJB';
update airport set timezone = 'Asia/Jakarta' where city_code = 'BKS' or airport_code = 'BKS';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PLM' or airport_code = 'PLM';
update airport set timezone = 'Asia/Jakarta' where city_code = 'RGT' or airport_code = 'RGT';
update airport set timezone = 'Europe/Chisinau' where city_code = 'BZY' or airport_code = 'BZY';
update airport set timezone = 'Asia/Jakarta' where city_code = 'BTJ' or airport_code = 'BTJ';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'AOR' or airport_code = 'AOR';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'KBR' or airport_code = 'KBR';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'KUA' or airport_code = 'KUA';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'KTE' or airport_code = 'KTE';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'IPH' or airport_code = 'IPH';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'JHB' or airport_code = 'JHB';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'KUL' or airport_code = 'KUL';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LGK' or airport_code = 'LGK';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'MKZ' or airport_code = 'MKZ';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'TGG' or airport_code = 'TGG';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'PEN' or airport_code = 'PEN';
update airport set timezone = 'Asia/Dili' where city_code = 'DIL' or airport_code = 'DIL';
update airport set timezone = 'Asia/Singapore' where city_code = 'QPG' or airport_code = 'QPG';
update airport set timezone = 'Asia/Singapore' where city_code = 'XSP' or airport_code = 'XSP';
update airport set timezone = 'Asia/Singapore' where city_code = 'SIN' or airport_code = 'SIN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ABM' or airport_code = 'ABM';
update airport set timezone = 'Australia/Darwin' where city_code = 'ASP' or airport_code = 'ASP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BNE' or airport_code = 'BNE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'OOL' or airport_code = 'OOL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CNS' or airport_code = 'CNS';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CTL' or airport_code = 'CTL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ISA' or airport_code = 'ISA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MCY' or airport_code = 'MCY';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MKY' or airport_code = 'MKY';
update airport set timezone = 'Australia/Brisbane' where city_code = 'PPP' or airport_code = 'PPP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ROK' or airport_code = 'ROK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'TSV' or airport_code = 'TSV';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WEI' or airport_code = 'WEI';
update airport set timezone = 'Australia/Hobart' where city_code = 'AVV' or airport_code = 'AVV';
update airport set timezone = 'Australia/Sydney' where city_code = 'ABX' or airport_code = 'ABX';
update airport set timezone = 'Australia/Hobart' where city_code = 'MEB' or airport_code = 'MEB';
update airport set timezone = 'Australia/Melbourne' where city_code = 'HBA' or airport_code = 'HBA';
update airport set timezone = 'Australia/Melbourne' where city_code = 'LST' or airport_code = 'LST';
update airport set timezone = 'Australia/Hobart' where city_code = 'MBW' or airport_code = 'MBW';
update airport set timezone = 'Australia/Hobart' where city_code = 'MEL' or airport_code = 'MEL';
update airport set timezone = 'Australia/Adelaide' where city_code = 'ADL' or airport_code = 'ADL';
update airport set timezone = 'Australia/Perth' where city_code = 'JAD' or airport_code = 'JAD';
update airport set timezone = 'Australia/Perth' where city_code = 'KTA' or airport_code = 'KTA';
update airport set timezone = 'Australia/Perth' where city_code = 'KGI' or airport_code = 'KGI';
update airport set timezone = 'Australia/Perth' where city_code = 'KNX' or airport_code = 'KNX';
update airport set timezone = 'Australia/Perth' where city_code = 'LEA' or airport_code = 'LEA';
update airport set timezone = 'Australia/Perth' where city_code = 'PHE' or airport_code = 'PHE';
update airport set timezone = 'Australia/Perth' where city_code = 'PER' or airport_code = 'PER';
update airport set timezone = 'Australia/Adelaide' where city_code = 'UMR' or airport_code = 'UMR';
update airport set timezone = 'Indian/Christmas' where city_code = 'XCH' or airport_code = 'XCH';
update airport set timezone = 'Australia/Sydney' where city_code = 'BWU' or airport_code = 'BWU';
update airport set timezone = 'Australia/Sydney' where city_code = 'CBR' or airport_code = 'CBR';
update airport set timezone = 'Australia/Sydney' where city_code = 'CFS' or airport_code = 'CFS';
update airport set timezone = 'Australia/Sydney' where city_code = 'CDU' or airport_code = 'CDU';
update airport set timezone = 'Australia/Sydney' where city_code = 'DBO' or airport_code = 'DBO';
update airport set timezone = 'Pacific/Norfolk' where city_code = 'NLK' or airport_code = 'NLK';
update airport set timezone = 'Australia/Sydney' where city_code = 'RCM' or airport_code = 'RCM';
update airport set timezone = 'Australia/Sydney' where city_code = 'SYD' or airport_code = 'SYD';
update airport set timezone = 'Australia/Sydney' where city_code = 'TMW' or airport_code = 'TMW';
update airport set timezone = 'Australia/Sydney' where city_code = 'WGA' or airport_code = 'WGA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'PEK' or airport_code = 'PEK';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HLD' or airport_code = 'HLD';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TSN' or airport_code = 'TSN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TYN' or airport_code = 'TYN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CAN' or airport_code = 'CAN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CSX' or airport_code = 'CSX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KWL' or airport_code = 'KWL';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NNG' or airport_code = 'NNG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SZX' or airport_code = 'SZX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CGO' or airport_code = 'CGO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WUH' or airport_code = 'WUH';
update airport set timezone = 'Asia/Pyongyang' where city_code = 'FNJ' or airport_code = 'FNJ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ZGC' or airport_code = 'ZGC';
update airport set timezone = 'Asia/Chongqing' where city_code = 'XIY' or airport_code = 'XIY';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'ULN' or airport_code = 'ULN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KMG' or airport_code = 'KMG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'XMN' or airport_code = 'XMN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KHN' or airport_code = 'KHN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'FOC' or airport_code = 'FOC';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HGH' or airport_code = 'HGH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NGB' or airport_code = 'NGB';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NKG' or airport_code = 'NKG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HFE' or airport_code = 'HFE';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TAO' or airport_code = 'TAO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SHA' or airport_code = 'SHA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YNT' or airport_code = 'YNT';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CKG' or airport_code = 'CKG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KWE' or airport_code = 'KWE';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CTU' or airport_code = 'CTU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'XIC' or airport_code = 'XIC';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KHG' or airport_code = 'KHG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HTN' or airport_code = 'HTN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'URC' or airport_code = 'URC';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HRB' or airport_code = 'HRB';
update airport set timezone = 'Europe/Vienna' where city_code = 'HOJ' or airport_code = 'HOJ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DLC' or airport_code = 'DLC';
update airport set timezone = 'Asia/Chongqing' where city_code = 'PVG' or airport_code = 'PVG';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'TOD' or airport_code = 'TOD';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'SZB' or airport_code = 'SZB';
update airport set timezone = 'Asia/Tokyo' where city_code = 'NTQ' or airport_code = 'NTQ';
update airport set timezone = 'Africa/Cairo' where city_code = 'HBE' or airport_code = 'HBE';
update airport set timezone = 'America/Anchorage' where city_code = 'BTI' or airport_code = 'BTI';
update airport set timezone = 'America/Anchorage' where city_code = 'K03' or airport_code = 'K03';
update airport set timezone = 'America/Anchorage' where city_code = 'LUR' or airport_code = 'LUR';
update airport set timezone = 'America/Anchorage' where city_code = 'PIZ' or airport_code = 'PIZ';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'ITO' or airport_code = 'ITO';
update airport set timezone = 'America/New_York' where city_code = 'ORL' or airport_code = 'ORL';
update airport set timezone = 'America/Anchorage' where city_code = 'BTT' or airport_code = 'BTT';
update airport set timezone = 'America/Anchorage' where city_code = 'Z84' or airport_code = 'Z84';
update airport set timezone = 'America/Anchorage' where city_code = 'UTO' or airport_code = 'UTO';
update airport set timezone = 'America/Anchorage' where city_code = 'FYU' or airport_code = 'FYU';
update airport set timezone = 'America/Anchorage' where city_code = 'SVW' or airport_code = 'SVW';
update airport set timezone = 'America/Anchorage' where city_code = 'FRN' or airport_code = 'FRN';
update airport set timezone = 'America/Anchorage' where city_code = 'TLJ' or airport_code = 'TLJ';
update airport set timezone = 'America/Anchorage' where city_code = 'CZF' or airport_code = 'CZF';
update airport set timezone = 'America/New_York' where city_code = 'BED' or airport_code = 'BED';
update airport set timezone = 'America/Anchorage' where city_code = 'SNP' or airport_code = 'SNP';
update airport set timezone = 'America/Anchorage' where city_code = 'EHM' or airport_code = 'EHM';
update airport set timezone = 'America/Anchorage' where city_code = 'PBV' or airport_code = 'PBV';
update airport set timezone = 'America/Anchorage' where city_code = 'ILI' or airport_code = 'ILI';
update airport set timezone = 'America/Anchorage' where city_code = 'PTU' or airport_code = 'PTU';
update airport set timezone = 'America/Anchorage' where city_code = 'BMX' or airport_code = 'BMX';
update airport set timezone = 'America/New_York' where city_code = 'OSC' or airport_code = 'OSC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OAR' or airport_code = 'OAR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MHR' or airport_code = 'MHR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BYS' or airport_code = 'BYS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NXP' or airport_code = 'NXP';
update airport set timezone = 'America/Chicago' where city_code = 'FSM' or airport_code = 'FSM';
update airport set timezone = 'America/Anchorage' where city_code = 'MRI' or airport_code = 'MRI';
update airport set timezone = 'America/Denver' where city_code = 'GNT' or airport_code = 'GNT';
update airport set timezone = 'America/Chicago' where city_code = 'PNC' or airport_code = 'PNC';
update airport set timezone = 'America/New_York' where city_code = 'SVN' or airport_code = 'SVN';
update airport set timezone = 'America/Chicago' where city_code = 'GFK' or airport_code = 'GFK';
update airport set timezone = 'America/Chicago' where city_code = 'PBF' or airport_code = 'PBF';
update airport set timezone = 'America/Chicago' where city_code = 'NSE' or airport_code = 'NSE';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'HNM' or airport_code = 'HNM';
update airport set timezone = 'America/Phoenix' where city_code = 'PRC' or airport_code = 'PRC';
update airport set timezone = 'America/New_York' where city_code = 'TTN' or airport_code = 'TTN';
update airport set timezone = 'America/New_York' where city_code = 'BOS' or airport_code = 'BOS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SUU' or airport_code = 'SUU';
update airport set timezone = 'America/New_York' where city_code = 'RME' or airport_code = 'RME';
update airport set timezone = 'America/Denver' where city_code = 'ENV' or airport_code = 'ENV';
update airport set timezone = 'America/Chicago' where city_code = 'BFM' or airport_code = 'BFM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OAK' or airport_code = 'OAK';
update airport set timezone = 'America/Chicago' where city_code = 'OMA' or airport_code = 'OMA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NOW' or airport_code = 'NOW';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'OGG' or airport_code = 'OGG';
update airport set timezone = 'America/Chicago' where city_code = 'ICT' or airport_code = 'ICT';
update airport set timezone = 'America/Chicago' where city_code = 'MCI' or airport_code = 'MCI';
update airport set timezone = 'America/Chicago' where city_code = 'MSN' or airport_code = 'MSN';
update airport set timezone = 'America/Anchorage' where city_code = 'DLG' or airport_code = 'DLG';
update airport set timezone = 'America/Chicago' where city_code = 'HRO' or airport_code = 'HRO';
update airport set timezone = 'America/Phoenix' where city_code = 'PHX' or airport_code = 'PHX';
update airport set timezone = 'America/New_York' where city_code = 'BGR' or airport_code = 'BGR';
update airport set timezone = 'America/New_York' where city_code = 'FXE' or airport_code = 'FXE';
update airport set timezone = 'America/Chicago' where city_code = 'GGG' or airport_code = 'GGG';
update airport set timezone = 'America/New_York' where city_code = 'AND' or airport_code = 'AND';
update airport set timezone = 'America/Los_Angeles' where city_code = 'GEG' or airport_code = 'GEG';
update airport set timezone = 'America/New_York' where city_code = 'HWO' or airport_code = 'HWO';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SFO' or airport_code = 'SFO';
update airport set timezone = 'America/Denver' where city_code = 'CTB' or airport_code = 'CTB';
update airport set timezone = 'America/Chicago' where city_code = 'ARA' or airport_code = 'ARA';
update airport set timezone = 'America/New_York' where city_code = 'GNV' or airport_code = 'GNV';
update airport set timezone = 'America/Chicago' where city_code = 'MEM' or airport_code = 'MEM';
update airport set timezone = 'America/Phoenix' where city_code = 'DUG' or airport_code = 'DUG';
update airport set timezone = 'America/Anchorage' where city_code = 'BIG' or airport_code = 'BIG';
update airport set timezone = 'America/Chicago' where city_code = 'CNW' or airport_code = 'CNW';
update airport set timezone = 'America/Anchorage' where city_code = 'ANN' or airport_code = 'ANN';
update airport set timezone = 'America/New_York' where city_code = 'CAR' or airport_code = 'CAR';
update airport set timezone = 'America/Chicago' where city_code = 'LRF' or airport_code = 'LRF';
update airport set timezone = 'America/Chicago' where city_code = 'HUA' or airport_code = 'HUA';
update airport set timezone = 'America/New_York' where city_code = 'POB' or airport_code = 'POB';
update airport set timezone = 'America/Chicago' where city_code = 'DHT' or airport_code = 'DHT';
update airport set timezone = 'America/Chicago' where city_code = 'DLF' or airport_code = 'DLF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LAX' or airport_code = 'LAX';
update airport set timezone = 'America/Chicago' where city_code = 'ANB' or airport_code = 'ANB';
update airport set timezone = 'America/New_York' where city_code = 'CLE' or airport_code = 'CLE';
update airport set timezone = 'America/New_York' where city_code = 'DOV' or airport_code = 'DOV';
update airport set timezone = 'America/New_York' where city_code = 'CVG' or airport_code = 'CVG';
update airport set timezone = 'America/New_York' where city_code = 'FME' or airport_code = 'FME';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NID' or airport_code = 'NID';
update airport set timezone = 'America/Chicago' where city_code = 'HON' or airport_code = 'HON';
update airport set timezone = 'America/Anchorage' where city_code = 'JNU' or airport_code = 'JNU';
update airport set timezone = 'America/Chicago' where city_code = 'LFT' or airport_code = 'LFT';
update airport set timezone = 'America/New_York' where city_code = 'EWR' or airport_code = 'EWR';
update airport set timezone = 'America/Denver' where city_code = 'BOI' or airport_code = 'BOI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'INS' or airport_code = 'INS';
update airport set timezone = 'America/Chicago' where city_code = 'GCK' or airport_code = 'GCK';
update airport set timezone = 'America/Chicago' where city_code = 'MOT' or airport_code = 'MOT';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'HHI' or airport_code = 'HHI';
update airport set timezone = 'America/Chicago' where city_code = 'MXF' or airport_code = 'MXF';
update airport set timezone = 'America/Chicago' where city_code = 'RBM' or airport_code = 'RBM';
update airport set timezone = 'America/Chicago' where city_code = 'DAL' or airport_code = 'DAL';
update airport set timezone = 'America/Denver' where city_code = 'FCS' or airport_code = 'FCS';
update airport set timezone = 'America/Denver' where city_code = 'HLN' or airport_code = 'HLN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NKX' or airport_code = 'NKX';
update airport set timezone = 'America/Phoenix' where city_code = 'LUF' or airport_code = 'LUF';
update airport set timezone = 'America/Chicago' where city_code = 'HRT' or airport_code = 'HRT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HHR' or airport_code = 'HHR';
update airport set timezone = 'America/New_York' where city_code = 'HUL' or airport_code = 'HUL';
update airport set timezone = 'America/Chicago' where city_code = 'END' or airport_code = 'END';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NTD' or airport_code = 'NTD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EDW' or airport_code = 'EDW';
update airport set timezone = 'America/Chicago' where city_code = 'LCH' or airport_code = 'LCH';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'KOA' or airport_code = 'KOA';
update airport set timezone = 'America/New_York' where city_code = 'MYR' or airport_code = 'MYR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NLC' or airport_code = 'NLC';
update airport set timezone = 'America/New_York' where city_code = 'ACK' or airport_code = 'ACK';
update airport set timezone = 'America/New_York' where city_code = 'FAF' or airport_code = 'FAF';
update airport set timezone = 'America/Chicago' where city_code = 'HOP' or airport_code = 'HOP';
update airport set timezone = 'America/New_York' where city_code = 'DCA' or airport_code = 'DCA';
update airport set timezone = 'America/New_York' where city_code = 'NHK' or airport_code = 'NHK';
update airport set timezone = 'America/Chicago' where city_code = 'PSX' or airport_code = 'PSX';
update airport set timezone = 'America/Chicago' where city_code = 'BYH' or airport_code = 'BYH';
update airport set timezone = 'America/New_York' where city_code = 'ACY' or airport_code = 'ACY';
update airport set timezone = 'America/Chicago' where city_code = 'TIK' or airport_code = 'TIK';
update airport set timezone = 'America/New_York' where city_code = 'ECG' or airport_code = 'ECG';
update airport set timezone = 'America/Denver' where city_code = 'PUB' or airport_code = 'PUB';
update airport set timezone = 'America/New_York' where city_code = 'PQI' or airport_code = 'PQI';
update airport set timezone = 'America/Denver' where city_code = 'IKR' or airport_code = 'IKR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'GRF' or airport_code = 'GRF';
update airport set timezone = 'America/Anchorage' where city_code = 'ADQ' or airport_code = 'ADQ';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'UPP' or airport_code = 'UPP';
update airport set timezone = 'America/New_York' where city_code = 'FLL' or airport_code = 'FLL';
update airport set timezone = 'America/Chicago' where city_code = 'MKO' or airport_code = 'MKO';
update airport set timezone = 'America/Chicago' where city_code = 'INL' or airport_code = 'INL';
update airport set timezone = 'America/Denver' where city_code = 'SLC' or airport_code = 'SLC';
update airport set timezone = 'America/Chicago' where city_code = 'CDS' or airport_code = 'CDS';
update airport set timezone = 'America/Chicago' where city_code = 'BIX' or airport_code = 'BIX';
update airport set timezone = 'America/New_York' where city_code = 'LSF' or airport_code = 'LSF';
update airport set timezone = 'America/Chicago' where city_code = 'NQI' or airport_code = 'NQI';
update airport set timezone = 'America/Chicago' where city_code = 'FRI' or airport_code = 'FRI';
update airport set timezone = 'America/New_York' where city_code = 'MDT' or airport_code = 'MDT';
update airport set timezone = 'America/Chicago' where city_code = 'LNK' or airport_code = 'LNK';
update airport set timezone = 'America/New_York' where city_code = 'LAN' or airport_code = 'LAN';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'MUE' or airport_code = 'MUE';
update airport set timezone = 'America/New_York' where city_code = 'MSS' or airport_code = 'MSS';
update airport set timezone = 'America/New_York' where city_code = 'HKY' or airport_code = 'HKY';
update airport set timezone = 'America/New_York' where city_code = 'SPG' or airport_code = 'SPG';
update airport set timezone = 'America/New_York' where city_code = 'FMY' or airport_code = 'FMY';
update airport set timezone = 'America/Chicago' where city_code = 'IAH' or airport_code = 'IAH';
update airport set timezone = 'America/New_York' where city_code = 'MLT' or airport_code = 'MLT';
update airport set timezone = 'America/New_York' where city_code = 'ADW' or airport_code = 'ADW';
update airport set timezone = 'America/New_York' where city_code = 'INT' or airport_code = 'INT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VCV' or airport_code = 'VCV';
update airport set timezone = 'America/Chicago' where city_code = 'CEW' or airport_code = 'CEW';
update airport set timezone = 'America/New_York' where city_code = 'GTB' or airport_code = 'GTB';
update airport set timezone = 'America/New_York' where city_code = 'PHN' or airport_code = 'PHN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BFL' or airport_code = 'BFL';
update airport set timezone = 'America/Denver' where city_code = 'ELP' or airport_code = 'ELP';
update airport set timezone = 'America/Chicago' where city_code = 'HRL' or airport_code = 'HRL';
update airport set timezone = 'America/New_York' where city_code = 'CAE' or airport_code = 'CAE';
update airport set timezone = 'America/Phoenix' where city_code = 'DMA' or airport_code = 'DMA';
update airport set timezone = 'America/Chicago' where city_code = 'NPA' or airport_code = 'NPA';
update airport set timezone = 'America/Chicago' where city_code = 'PNS' or airport_code = 'PNS';
update airport set timezone = 'America/Chicago' where city_code = 'RDR' or airport_code = 'RDR';
update airport set timezone = 'America/Chicago' where city_code = 'HOU' or airport_code = 'HOU';
update airport set timezone = 'America/Denver' where city_code = 'BKF' or airport_code = 'BKF';
update airport set timezone = 'America/Anchorage' where city_code = 'ORT' or airport_code = 'ORT';
update airport set timezone = 'America/Anchorage' where city_code = 'PAQ' or airport_code = 'PAQ';
update airport set timezone = 'America/New_York' where city_code = 'PIT' or airport_code = 'PIT';
update airport set timezone = 'America/Anchorage' where city_code = 'BRW' or airport_code = 'BRW';
update airport set timezone = 'America/Chicago' where city_code = 'EFD' or airport_code = 'EFD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NUW' or airport_code = 'NUW';
update airport set timezone = 'America/Chicago' where city_code = 'ALI' or airport_code = 'ALI';
update airport set timezone = 'America/New_York' where city_code = 'VAD' or airport_code = 'VAD';
update airport set timezone = 'America/New_York' where city_code = 'MIA' or airport_code = 'MIA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SEA' or airport_code = 'SEA';
update airport set timezone = 'America/New_York' where city_code = 'CHA' or airport_code = 'CHA';
update airport set timezone = 'America/New_York' where city_code = 'BDR' or airport_code = 'BDR';
update airport set timezone = 'America/Chicago' where city_code = 'JAN' or airport_code = 'JAN';
update airport set timezone = 'America/Chicago' where city_code = 'GLS' or airport_code = 'GLS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LGB' or airport_code = 'LGB';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'HDH' or airport_code = 'HDH';
update airport set timezone = 'America/New_York' where city_code = 'IPT' or airport_code = 'IPT';
update airport set timezone = 'America/New_York' where city_code = 'IND' or airport_code = 'IND';
update airport set timezone = 'America/Chicago' where city_code = 'SZL' or airport_code = 'SZL';
update airport set timezone = 'America/New_York' where city_code = 'AKC' or airport_code = 'AKC';
update airport set timezone = 'America/Chicago' where city_code = 'GWO' or airport_code = 'GWO';
update airport set timezone = 'America/New_York' where city_code = 'HPN' or airport_code = 'HPN';
update airport set timezone = 'America/New_York' where city_code = 'FOK' or airport_code = 'FOK';
update airport set timezone = 'America/Chicago' where city_code = 'JBR' or airport_code = 'JBR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TNX' or airport_code = 'TNX';
update airport set timezone = 'America/New_York' where city_code = 'LNA' or airport_code = 'LNA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NZY' or airport_code = 'NZY';
update airport set timezone = 'America/Denver' where city_code = 'BIF' or airport_code = 'BIF';
update airport set timezone = 'America/Phoenix' where city_code = 'YUM' or airport_code = 'YUM';
update airport set timezone = 'America/Denver' where city_code = 'CNM' or airport_code = 'CNM';
update airport set timezone = 'America/Chicago' where city_code = 'DLH' or airport_code = 'DLH';
update airport set timezone = 'America/Anchorage' where city_code = 'BET' or airport_code = 'BET';
update airport set timezone = 'America/New_York' where city_code = 'LOU' or airport_code = 'LOU';
update airport set timezone = 'America/Phoenix' where city_code = 'FHU' or airport_code = 'FHU';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'LIH' or airport_code = 'LIH';
update airport set timezone = 'America/New_York' where city_code = 'HUF' or airport_code = 'HUF';
update airport set timezone = 'America/Denver' where city_code = 'HVR' or airport_code = 'HVR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MWH' or airport_code = 'MWH';
update airport set timezone = 'America/New_York' where city_code = 'MPV' or airport_code = 'MPV';
update airport set timezone = 'America/New_York' where city_code = 'RIC' or airport_code = 'RIC';
update airport set timezone = 'America/Chicago' where city_code = 'SHV' or airport_code = 'SHV';
update airport set timezone = 'America/Anchorage' where city_code = 'CDV' or airport_code = 'CDV';
update airport set timezone = 'America/New_York' where city_code = 'ORF' or airport_code = 'ORF';
update airport set timezone = 'America/Chicago' where city_code = 'BPT' or airport_code = 'BPT';
update airport set timezone = 'America/New_York' where city_code = 'SAV' or airport_code = 'SAV';
update airport set timezone = 'America/Denver' where city_code = 'HIF' or airport_code = 'HIF';
update airport set timezone = 'America/Anchorage' where city_code = 'OME' or airport_code = 'OME';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SPB' or airport_code = 'SPB';
update airport set timezone = 'America/New_York' where city_code = 'PIE' or airport_code = 'PIE';
update airport set timezone = 'America/Chicago' where city_code = 'MNM' or airport_code = 'MNM';
update airport set timezone = 'America/Chicago' where city_code = 'CXO' or airport_code = 'CXO';
update airport set timezone = 'America/Anchorage' where city_code = 'SCC' or airport_code = 'SCC';
update airport set timezone = 'America/Chicago' where city_code = 'SAT' or airport_code = 'SAT';
update airport set timezone = 'America/New_York' where city_code = 'ROC' or airport_code = 'ROC';
update airport set timezone = 'America/New_York' where city_code = 'COF' or airport_code = 'COF';
update airport set timezone = 'America/New_York' where city_code = 'TEB' or airport_code = 'TEB';
update airport set timezone = 'America/Denver' where city_code = 'RCA' or airport_code = 'RCA';
update airport set timezone = 'America/New_York' where city_code = 'RDU' or airport_code = 'RDU';
update airport set timezone = 'America/New_York' where city_code = 'DAY' or airport_code = 'DAY';
update airport set timezone = 'America/Anchorage' where city_code = 'ENA' or airport_code = 'ENA';
update airport set timezone = 'America/Chicago' where city_code = 'MLC' or airport_code = 'MLC';
update airport set timezone = 'America/New_York' where city_code = 'IAG' or airport_code = 'IAG';
update airport set timezone = 'America/Chicago' where city_code = 'CFD' or airport_code = 'CFD';
update airport set timezone = 'America/New_York' where city_code = 'PHF' or airport_code = 'PHF';
update airport set timezone = 'America/Chicago' where city_code = 'ESF' or airport_code = 'ESF';
update airport set timezone = 'America/Chicago' where city_code = 'LTS' or airport_code = 'LTS';
update airport set timezone = 'America/Phoenix' where city_code = 'TUS' or airport_code = 'TUS';
update airport set timezone = 'America/Chicago' where city_code = 'MIB' or airport_code = 'MIB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BAB' or airport_code = 'BAB';
update airport set timezone = 'America/Chicago' where city_code = 'IKK' or airport_code = 'IKK';
update airport set timezone = 'America/New_York' where city_code = 'GSB' or airport_code = 'GSB';
update airport set timezone = 'America/New_York' where city_code = 'PVD' or airport_code = 'PVD';
update airport set timezone = 'America/New_York' where city_code = 'SBY' or airport_code = 'SBY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RIU' or airport_code = 'RIU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BUR' or airport_code = 'BUR';
update airport set timezone = 'America/New_York' where city_code = 'DTW' or airport_code = 'DTW';
update airport set timezone = 'America/New_York' where city_code = 'TPA' or airport_code = 'TPA';
update airport set timezone = 'America/Chicago' where city_code = 'PMB' or airport_code = 'PMB';
update airport set timezone = 'America/Chicago' where city_code = 'POE' or airport_code = 'POE';
update airport set timezone = 'America/Anchorage' where city_code = 'EIL' or airport_code = 'EIL';
update airport set timezone = 'America/Chicago' where city_code = 'HIB' or airport_code = 'HIB';
update airport set timezone = 'America/Chicago' where city_code = 'LFK' or airport_code = 'LFK';
update airport set timezone = 'America/Chicago' where city_code = 'MAF' or airport_code = 'MAF';
update airport set timezone = 'America/Chicago' where city_code = 'GRB' or airport_code = 'GRB';
update airport set timezone = 'America/Chicago' where city_code = 'ADM' or airport_code = 'ADM';
update airport set timezone = 'America/New_York' where city_code = 'WRI' or airport_code = 'WRI';
update airport set timezone = 'America/New_York' where city_code = 'NKT' or airport_code = 'NKT';
update airport set timezone = 'America/New_York' where city_code = 'SBO' or airport_code = 'SBO';
update airport set timezone = 'America/New_York' where city_code = 'AGS' or airport_code = 'AGS';
update airport set timezone = 'America/Chicago' where city_code = 'ISN' or airport_code = 'ISN';
update airport set timezone = 'America/Chicago' where city_code = 'LIT' or airport_code = 'LIT';
update airport set timezone = 'America/New_York' where city_code = 'SWF' or airport_code = 'SWF';
update airport set timezone = 'America/Chicago' where city_code = 'BDE' or airport_code = 'BDE';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SAC' or airport_code = 'SAC';
update airport set timezone = 'America/Anchorage' where city_code = 'HOM' or airport_code = 'HOM';
update airport set timezone = 'America/Chicago' where city_code = 'TBN' or airport_code = 'TBN';
update airport set timezone = 'America/New_York' where city_code = 'MGE' or airport_code = 'MGE';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SKA' or airport_code = 'SKA';
update airport set timezone = 'America/New_York' where city_code = 'HTL' or airport_code = 'HTL';
update airport set timezone = 'America/Chicago' where city_code = 'PAM' or airport_code = 'PAM';
update airport set timezone = 'America/Chicago' where city_code = 'DFW' or airport_code = 'DFW';
update airport set timezone = 'America/New_York' where city_code = 'MLB' or airport_code = 'MLB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TCM' or airport_code = 'TCM';
update airport set timezone = 'America/Chicago' where city_code = 'AUS' or airport_code = 'AUS';
update airport set timezone = 'America/New_York' where city_code = 'LCK' or airport_code = 'LCK';
update airport set timezone = 'America/New_York' where city_code = 'TYS' or airport_code = 'TYS';
update airport set timezone = 'America/Chicago' where city_code = 'HLR' or airport_code = 'HLR';
update airport set timezone = 'America/Chicago' where city_code = 'STL' or airport_code = 'STL';
update airport set timezone = 'America/New_York' where city_code = 'MIV' or airport_code = 'MIV';
update airport set timezone = 'America/Chicago' where city_code = 'SPS' or airport_code = 'SPS';
update airport set timezone = 'America/New_York' where city_code = 'LUK' or airport_code = 'LUK';
update airport set timezone = 'America/New_York' where city_code = 'ATL' or airport_code = 'ATL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MER' or airport_code = 'MER';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MCC' or airport_code = 'MCC';
update airport set timezone = 'America/New_York' where city_code = 'GRR' or airport_code = 'GRR';
update airport set timezone = 'America/Chicago' where city_code = 'INK' or airport_code = 'INK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FAT' or airport_code = 'FAT';
update airport set timezone = 'America/New_York' where city_code = 'VRB' or airport_code = 'VRB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'IPL' or airport_code = 'IPL';
update airport set timezone = 'America/Chicago' where city_code = 'BNA' or airport_code = 'BNA';
update airport set timezone = 'America/Chicago' where city_code = 'LRD' or airport_code = 'LRD';
update airport set timezone = 'America/Anchorage' where city_code = 'EDF' or airport_code = 'EDF';
update airport set timezone = 'America/Anchorage' where city_code = 'OTZ' or airport_code = 'OTZ';
update airport set timezone = 'America/New_York' where city_code = 'AOO' or airport_code = 'AOO';
update airport set timezone = 'America/Chicago' where city_code = 'DYS' or airport_code = 'DYS';
update airport set timezone = 'America/Chicago' where city_code = 'ELD' or airport_code = 'ELD';
update airport set timezone = 'America/New_York' where city_code = 'LGA' or airport_code = 'LGA';
update airport set timezone = 'America/New_York' where city_code = 'TLH' or airport_code = 'TLH';
update airport set timezone = 'America/Chicago' where city_code = 'DPA' or airport_code = 'DPA';
update airport set timezone = 'America/Chicago' where city_code = 'ACT' or airport_code = 'ACT';
update airport set timezone = 'America/New_York' where city_code = 'AUG' or airport_code = 'AUG';
update airport set timezone = 'America/Chicago' where city_code = 'INJ' or airport_code = 'INJ';
update airport set timezone = 'America/New_York' where city_code = 'NIP' or airport_code = 'NIP';
update airport set timezone = 'America/Chicago' where city_code = 'MKL' or airport_code = 'MKL';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'MKK' or airport_code = 'MKK';
update airport set timezone = 'America/New_York' where city_code = 'FTK' or airport_code = 'FTK';
update airport set timezone = 'America/Chicago' where city_code = 'SJT' or airport_code = 'SJT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CXL' or airport_code = 'CXL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CIC' or airport_code = 'CIC';
update airport set timezone = 'America/New_York' where city_code = 'BTV' or airport_code = 'BTV';
update airport set timezone = 'America/New_York' where city_code = 'JAX' or airport_code = 'JAX';
update airport set timezone = 'America/Denver' where city_code = 'DRO' or airport_code = 'DRO';
update airport set timezone = 'America/New_York' where city_code = 'IAD' or airport_code = 'IAD';
update airport set timezone = 'America/Chicago' where city_code = 'CLL' or airport_code = 'CLL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SFF' or airport_code = 'SFF';
update airport set timezone = 'America/Chicago' where city_code = 'MKE' or airport_code = 'MKE';
update airport set timezone = 'America/Chicago' where city_code = 'ABI' or airport_code = 'ABI';
update airport set timezone = 'America/Chicago' where city_code = 'COU' or airport_code = 'COU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PDX' or airport_code = 'PDX';
update airport set timezone = 'America/New_York' where city_code = 'TNT' or airport_code = 'TNT';
update airport set timezone = 'America/New_York' where city_code = 'PBI' or airport_code = 'PBI';
update airport set timezone = 'America/Chicago' where city_code = 'FTW' or airport_code = 'FTW';
update airport set timezone = 'America/New_York' where city_code = 'OGS' or airport_code = 'OGS';
update airport set timezone = 'America/New_York' where city_code = 'FMH' or airport_code = 'FMH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BFI' or airport_code = 'BFI';
update airport set timezone = 'America/Chicago' where city_code = 'SKF' or airport_code = 'SKF';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'HNL' or airport_code = 'HNL';
update airport set timezone = 'America/Chicago' where city_code = 'DSM' or airport_code = 'DSM';
update airport set timezone = 'America/New_York' where city_code = 'EWN' or airport_code = 'EWN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SAN' or airport_code = 'SAN';
update airport set timezone = 'America/Chicago' where city_code = 'MLU' or airport_code = 'MLU';
update airport set timezone = 'America/New_York' where city_code = 'SSC' or airport_code = 'SSC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ONT' or airport_code = 'ONT';
update airport set timezone = 'America/Chicago' where city_code = 'GVT' or airport_code = 'GVT';
update airport set timezone = 'America/Denver' where city_code = 'ROW' or airport_code = 'ROW';
update airport set timezone = 'America/New_York' where city_code = 'DET' or airport_code = 'DET';
update airport set timezone = 'America/Chicago' where city_code = 'BRO' or airport_code = 'BRO';
update airport set timezone = 'America/Chicago' where city_code = 'DHN' or airport_code = 'DHN';
update airport set timezone = 'America/New_York' where city_code = 'WWD' or airport_code = 'WWD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NFL' or airport_code = 'NFL';
update airport set timezone = 'America/New_York' where city_code = 'MTC' or airport_code = 'MTC';
update airport set timezone = 'America/Denver' where city_code = 'FMN' or airport_code = 'FMN';
update airport set timezone = 'America/Chicago' where city_code = 'CRP' or airport_code = 'CRP';
update airport set timezone = 'America/New_York' where city_code = 'SYR' or airport_code = 'SYR';
update airport set timezone = 'America/New_York' where city_code = 'NQX' or airport_code = 'NQX';
update airport set timezone = 'America/Chicago' where city_code = 'MDW' or airport_code = 'MDW';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SJC' or airport_code = 'SJC';
update airport set timezone = 'America/Denver' where city_code = 'HOB' or airport_code = 'HOB';
update airport set timezone = 'America/New_York' where city_code = 'PNE' or airport_code = 'PNE';
update airport set timezone = 'America/Denver' where city_code = 'DEN' or airport_code = 'DEN';
update airport set timezone = 'America/New_York' where city_code = 'PHL' or airport_code = 'PHL';
update airport set timezone = 'America/Chicago' where city_code = 'SUX' or airport_code = 'SUX';
update airport set timezone = 'America/New_York' where city_code = 'MCN' or airport_code = 'MCN';
update airport set timezone = 'America/Denver' where city_code = 'TCS' or airport_code = 'TCS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PMD' or airport_code = 'PMD';
update airport set timezone = 'America/Chicago' where city_code = 'RND' or airport_code = 'RND';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NJK' or airport_code = 'NJK';
update airport set timezone = 'America/New_York' where city_code = 'CMH' or airport_code = 'CMH';
update airport set timezone = 'America/Chicago' where city_code = 'FYV' or airport_code = 'FYV';
update airport set timezone = 'America/Chicago' where city_code = 'FSI' or airport_code = 'FSI';
update airport set timezone = 'America/Chicago' where city_code = 'PNM' or airport_code = 'PNM';
update airport set timezone = 'America/New_York' where city_code = 'FFO' or airport_code = 'FFO';
update airport set timezone = 'America/Anchorage' where city_code = 'GAL' or airport_code = 'GAL';
update airport set timezone = 'America/Chicago' where city_code = 'MWL' or airport_code = 'MWL';
update airport set timezone = 'America/Chicago' where city_code = 'IAB' or airport_code = 'IAB';
update airport set timezone = 'America/Chicago' where city_code = 'NBG' or airport_code = 'NBG';
update airport set timezone = 'America/New_York' where city_code = 'BFT' or airport_code = 'BFT';
update airport set timezone = 'America/Chicago' where city_code = 'TXK' or airport_code = 'TXK';
update airport set timezone = 'America/New_York' where city_code = 'PBG' or airport_code = 'PBG';
update airport set timezone = 'America/New_York' where city_code = 'APG' or airport_code = 'APG';
update airport set timezone = 'America/Denver' where city_code = 'TCC' or airport_code = 'TCC';
update airport set timezone = 'America/Anchorage' where city_code = 'ANC' or airport_code = 'ANC';
update airport set timezone = 'America/Chicago' where city_code = 'GRK' or airport_code = 'GRK';
update airport set timezone = 'America/Denver' where city_code = 'ZUN' or airport_code = 'ZUN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BLI' or airport_code = 'BLI';
update airport set timezone = 'America/Chicago' where city_code = 'NQA' or airport_code = 'NQA';
update airport set timezone = 'America/New_York' where city_code = 'EKN' or airport_code = 'EKN';
update airport set timezone = 'America/New_York' where city_code = 'HFD' or airport_code = 'HFD';
update airport set timezone = 'America/New_York' where city_code = 'SFZ' or airport_code = 'SFZ';
update airport set timezone = 'America/Chicago' where city_code = 'MOB' or airport_code = 'MOB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NUQ' or airport_code = 'NUQ';
update airport set timezone = 'America/Denver' where city_code = 'SAF' or airport_code = 'SAF';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'BKH' or airport_code = 'BKH';
update airport set timezone = 'America/Chicago' where city_code = 'DRI' or airport_code = 'DRI';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'BSF' or airport_code = 'BSF';
update airport set timezone = 'America/Phoenix' where city_code = 'OLS' or airport_code = 'OLS';
update airport set timezone = 'America/New_York' where city_code = 'MCF' or airport_code = 'MCF';
update airport set timezone = 'America/Chicago' where city_code = 'BLV' or airport_code = 'BLV';
update airport set timezone = 'America/New_York' where city_code = 'OPF' or airport_code = 'OPF';
update airport set timezone = 'America/Chicago' where city_code = 'DRT' or airport_code = 'DRT';
update airport set timezone = 'America/New_York' where city_code = 'RSW' or airport_code = 'RSW';
update airport set timezone = 'America/Anchorage' where city_code = 'AKN' or airport_code = 'AKN';
update airport set timezone = 'America/New_York' where city_code = 'MUI' or airport_code = 'MUI';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'JHM' or airport_code = 'JHM';
update airport set timezone = 'America/New_York' where city_code = 'JFK' or airport_code = 'JFK';
update airport set timezone = 'America/New_York' where city_code = 'HST' or airport_code = 'HST';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RAL' or airport_code = 'RAL';
update airport set timezone = 'America/Chicago' where city_code = 'FLV' or airport_code = 'FLV';
update airport set timezone = 'America/New_York' where city_code = 'WAL' or airport_code = 'WAL';
update airport set timezone = 'America/Denver' where city_code = 'HMN' or airport_code = 'HMN';
update airport set timezone = 'America/New_York' where city_code = 'NXX' or airport_code = 'NXX';
update airport set timezone = 'America/Denver' where city_code = 'CYS' or airport_code = 'CYS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SCK' or airport_code = 'SCK';
update airport set timezone = 'America/New_York' where city_code = 'CHS' or airport_code = 'CHS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RNO' or airport_code = 'RNO';
update airport set timezone = 'America/Anchorage' where city_code = 'KTN' or airport_code = 'KTN';
update airport set timezone = 'America/New_York' where city_code = 'YIP' or airport_code = 'YIP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VBG' or airport_code = 'VBG';
update airport set timezone = 'America/Chicago' where city_code = 'BHM' or airport_code = 'BHM';
update airport set timezone = 'America/New_York' where city_code = 'NEL' or airport_code = 'NEL';
update airport set timezone = 'America/Anchorage' where city_code = 'SYA' or airport_code = 'SYA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LSV' or airport_code = 'LSV';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RIV' or airport_code = 'RIV';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MOD' or airport_code = 'MOD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SMF' or airport_code = 'SMF';
update airport set timezone = 'America/Chicago' where city_code = 'UGN' or airport_code = 'UGN';
update airport set timezone = 'America/Denver' where city_code = 'COS' or airport_code = 'COS';
update airport set timezone = 'America/New_York' where city_code = 'BUF' or airport_code = 'BUF';
update airport set timezone = 'America/New_York' where city_code = 'SKY' or airport_code = 'SKY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PAE' or airport_code = 'PAE';
update airport set timezone = 'America/Denver' where city_code = 'MUO' or airport_code = 'MUO';
update airport set timezone = 'America/Denver' where city_code = 'CDC' or airport_code = 'CDC';
update airport set timezone = 'America/New_York' where city_code = 'BDL' or airport_code = 'BDL';
update airport set timezone = 'America/Chicago' where city_code = 'MFE' or airport_code = 'MFE';
update airport set timezone = 'America/New_York' where city_code = 'NGU' or airport_code = 'NGU';
update airport set timezone = 'America/New_York' where city_code = 'CEF' or airport_code = 'CEF';
update airport set timezone = 'America/Chicago' where city_code = 'LBB' or airport_code = 'LBB';
update airport set timezone = 'America/Chicago' where city_code = 'ORD' or airport_code = 'ORD';
update airport set timezone = 'America/New_York' where city_code = 'BCT' or airport_code = 'BCT';
update airport set timezone = 'America/Anchorage' where city_code = 'FAI' or airport_code = 'FAI';
update airport set timezone = 'America/New_York' where city_code = 'NYG' or airport_code = 'NYG';
update airport set timezone = 'America/Denver' where city_code = 'CVS' or airport_code = 'CVS';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'NGF' or airport_code = 'NGF';
update airport set timezone = 'America/Chicago' where city_code = 'OFF' or airport_code = 'OFF';
update airport set timezone = 'America/Anchorage' where city_code = 'GKN' or airport_code = 'GKN';
update airport set timezone = 'America/New_York' where city_code = 'ART' or airport_code = 'ART';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PSP' or airport_code = 'PSP';
update airport set timezone = 'America/Chicago' where city_code = 'AMA' or airport_code = 'AMA';
update airport set timezone = 'America/Chicago' where city_code = 'FOD' or airport_code = 'FOD';
update airport set timezone = 'America/Chicago' where city_code = 'BAD' or airport_code = 'BAD';
update airport set timezone = 'America/Chicago' where city_code = 'FOE' or airport_code = 'FOE';
update airport set timezone = 'America/Chicago' where city_code = 'COT' or airport_code = 'COT';
update airport set timezone = 'America/New_York' where city_code = 'ILM' or airport_code = 'ILM';
update airport set timezone = 'America/Chicago' where city_code = 'BTR' or airport_code = 'BTR';
update airport set timezone = 'America/Chicago' where city_code = 'NMM' or airport_code = 'NMM';
update airport set timezone = 'America/Chicago' where city_code = 'TYR' or airport_code = 'TYR';
update airport set timezone = 'America/New_York' where city_code = 'BWI' or airport_code = 'BWI';
update airport set timezone = 'America/Chicago' where city_code = 'HBR' or airport_code = 'HBR';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'LNY' or airport_code = 'LNY';
update airport set timezone = 'America/Chicago' where city_code = 'AEX' or airport_code = 'AEX';
update airport set timezone = 'America/Denver' where city_code = 'WSD' or airport_code = 'WSD';
update airport set timezone = 'America/Anchorage' where city_code = 'CDB' or airport_code = 'CDB';
update airport set timezone = 'America/Chicago' where city_code = 'TUL' or airport_code = 'TUL';
update airport set timezone = 'America/Anchorage' where city_code = 'SIT' or airport_code = 'SIT';
update airport set timezone = 'America/New_York' where city_code = 'ISP' or airport_code = 'ISP';
update airport set timezone = 'America/Chicago' where city_code = 'MSP' or airport_code = 'MSP';
update airport set timezone = 'America/New_York' where city_code = 'ILG' or airport_code = 'ILG';
update airport set timezone = 'America/Anchorage' where city_code = 'DUT' or airport_code = 'DUT';
update airport set timezone = 'America/Chicago' where city_code = 'MSY' or airport_code = 'MSY';
update airport set timezone = 'America/New_York' where city_code = 'PWM' or airport_code = 'PWM';
update airport set timezone = 'America/Chicago' where city_code = 'OKC' or airport_code = 'OKC';
update airport set timezone = 'America/New_York' where city_code = 'ALB' or airport_code = 'ALB';
update airport set timezone = 'America/Anchorage' where city_code = 'VDZ' or airport_code = 'VDZ';
update airport set timezone = 'America/New_York' where city_code = 'LFI' or airport_code = 'LFI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SNA' or airport_code = 'SNA';
update airport set timezone = 'America/Chicago' where city_code = 'CBM' or airport_code = 'CBM';
update airport set timezone = 'America/New_York' where city_code = 'TMB' or airport_code = 'TMB';
update airport set timezone = 'America/New_York' where city_code = 'NTU' or airport_code = 'NTU';
update airport set timezone = 'America/New_York' where city_code = 'GUS' or airport_code = 'GUS';
update airport set timezone = 'America/Denver' where city_code = 'CPR' or airport_code = 'CPR';
update airport set timezone = 'America/Chicago' where city_code = 'VPS' or airport_code = 'VPS';
update airport set timezone = 'America/Chicago' where city_code = 'SEM' or airport_code = 'SEM';
update airport set timezone = 'America/New_York' where city_code = 'EYW' or airport_code = 'EYW';
update airport set timezone = 'America/New_York' where city_code = 'CLT' or airport_code = 'CLT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LAS' or airport_code = 'LAS';
update airport set timezone = 'America/New_York' where city_code = 'MCO' or airport_code = 'MCO';
update airport set timezone = 'America/New_York' where city_code = 'FLO' or airport_code = 'FLO';
update airport set timezone = 'America/Denver' where city_code = 'GTF' or airport_code = 'GTF';
update airport set timezone = 'America/New_York' where city_code = 'YNG' or airport_code = 'YNG';
update airport set timezone = 'America/Anchorage' where city_code = 'FBK' or airport_code = 'FBK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MMV' or airport_code = 'MMV';
update airport set timezone = 'America/New_York' where city_code = 'WRB' or airport_code = 'WRB';
update airport set timezone = 'Asia/Bangkok' where city_code = 'BKK' or airport_code = 'BKK';
update airport set timezone = 'Asia/Makassar' where city_code = 'KDI' or airport_code = 'KDI';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SBG' or airport_code = 'SBG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'MLG' or airport_code = 'MLG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'BDO' or airport_code = 'BDO';
update airport set timezone = 'Asia/Jakarta' where city_code = 'CBN' or airport_code = 'CBN';
update airport set timezone = 'Asia/Jakarta' where city_code = 'JOG' or airport_code = 'JOG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'CXP' or airport_code = 'CXP';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PCB' or airport_code = 'PCB';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SRG' or airport_code = 'SRG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'BTH' or airport_code = 'BTH';
update airport set timezone = 'Asia/Jakarta' where city_code = 'TJQ' or airport_code = 'TJQ';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PGK' or airport_code = 'PGK';
update airport set timezone = 'Asia/Jakarta' where city_code = 'TNJ' or airport_code = 'TNJ';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SIQ' or airport_code = 'SIQ';
update airport set timezone = 'Asia/Makassar' where city_code = 'BDJ' or airport_code = 'BDJ';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PKN' or airport_code = 'PKN';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PKY' or airport_code = 'PKY';
update airport set timezone = 'Asia/Makassar' where city_code = 'MOF' or airport_code = 'MOF';
update airport set timezone = 'Asia/Makassar' where city_code = 'ENE' or airport_code = 'ENE';
update airport set timezone = 'Asia/Makassar' where city_code = 'RTG' or airport_code = 'RTG';
update airport set timezone = 'Asia/Makassar' where city_code = 'KOE' or airport_code = 'KOE';
update airport set timezone = 'Asia/Makassar' where city_code = 'LBJ' or airport_code = 'LBJ';
update airport set timezone = 'Asia/Makassar' where city_code = 'BPN' or airport_code = 'BPN';
update airport set timezone = 'Asia/Makassar' where city_code = 'TRK' or airport_code = 'TRK';
update airport set timezone = 'Asia/Makassar' where city_code = 'SRI' or airport_code = 'SRI';
update airport set timezone = 'Asia/Makassar' where city_code = 'AMI' or airport_code = 'AMI';
update airport set timezone = 'Asia/Makassar' where city_code = 'BMU' or airport_code = 'BMU';
update airport set timezone = 'Asia/Makassar' where city_code = 'WGP' or airport_code = 'WGP';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SUB' or airport_code = 'SUB';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SOC' or airport_code = 'SOC';
update airport set timezone = 'Asia/Bangkok' where city_code = 'CNX' or airport_code = 'CNX';
update airport set timezone = 'Asia/Bangkok' where city_code = 'CEI' or airport_code = 'CEI';
update airport set timezone = 'Asia/Bangkok' where city_code = 'NST' or airport_code = 'NST';
update airport set timezone = 'Asia/Makassar' where city_code = 'DPS' or airport_code = 'DPS';
update airport set timezone = 'Asia/Bangkok' where city_code = 'NAK' or airport_code = 'NAK';
update airport set timezone = 'Asia/Bangkok' where city_code = 'KOP' or airport_code = 'KOP';
update airport set timezone = 'Asia/Bangkok' where city_code = 'UBP' or airport_code = 'UBP';
update airport set timezone = 'Asia/Bangkok' where city_code = 'KKC' or airport_code = 'KKC';
update airport set timezone = 'Asia/Bangkok' where city_code = 'THS' or airport_code = 'THS';
update airport set timezone = 'Europe/Athens' where city_code = 'ATH' or airport_code = 'ATH';
update airport set timezone = 'Asia/Tokyo' where city_code = 'NGO' or airport_code = 'NGO';
update airport set timezone = 'Asia/Tokyo' where city_code = 'UKB' or airport_code = 'UKB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PUW' or airport_code = 'PUW';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LWS' or airport_code = 'LWS';
update airport set timezone = 'America/New_York' where city_code = 'ELM' or airport_code = 'ELM';
update airport set timezone = 'America/New_York' where city_code = 'ITH' or airport_code = 'ITH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MRY' or airport_code = 'MRY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SBA' or airport_code = 'SBA';
update airport set timezone = 'America/New_York' where city_code = 'DAB' or airport_code = 'DAB';
update airport set timezone = 'Europe/Riga' where city_code = 'LPX' or airport_code = 'LPX';
update airport set timezone = 'Europe/Riga' where city_code = 'RIX' or airport_code = 'RIX';
update airport set timezone = 'Europe/Vilnius' where city_code = 'SQQ' or airport_code = 'SQQ';
update airport set timezone = 'Europe/Vilnius' where city_code = 'HLJ' or airport_code = 'HLJ';
update airport set timezone = 'Europe/Vilnius' where city_code = 'KUN' or airport_code = 'KUN';
update airport set timezone = 'Europe/Vilnius' where city_code = 'PLQ' or airport_code = 'PLQ';
update airport set timezone = 'Europe/Vilnius' where city_code = 'VNO' or airport_code = 'VNO';
update airport set timezone = 'Europe/Vilnius' where city_code = 'PNV' or airport_code = 'PNV';
update airport set timezone = 'Asia/Yerevan' where city_code = 'EVN' or airport_code = 'EVN';
update airport set timezone = 'Asia/Yerevan' where city_code = 'LWN' or airport_code = 'LWN';
update airport set timezone = 'Africa/Asmera' where city_code = 'ASA' or airport_code = 'ASA';
update airport set timezone = 'Africa/Asmera' where city_code = 'ASM' or airport_code = 'ASM';
update airport set timezone = 'Africa/Asmera' where city_code = 'MSW' or airport_code = 'MSW';
update airport set timezone = 'Asia/Gaza' where city_code = 'GZA' or airport_code = 'GZA';
update airport set timezone = 'Asia/Aden' where city_code = 'RIY' or airport_code = 'RIY';
update airport set timezone = 'Asia/Tbilisi' where city_code = 'BUS' or airport_code = 'BUS';
update airport set timezone = 'Asia/Tbilisi' where city_code = 'KUT' or airport_code = 'KUT';
update airport set timezone = 'Asia/Tbilisi' where city_code = 'TBS' or airport_code = 'TBS';
update airport set timezone = 'Asia/Aden' where city_code = 'TAI' or airport_code = 'TAI';
update airport set timezone = 'Asia/Aden' where city_code = 'HOD' or airport_code = 'HOD';
update airport set timezone = 'Asia/Aden' where city_code = 'ADE' or airport_code = 'ADE';
update airport set timezone = 'Asia/Aden' where city_code = 'AXK' or airport_code = 'AXK';
update airport set timezone = 'Asia/Aden' where city_code = 'AAY' or airport_code = 'AAY';
update airport set timezone = 'Asia/Aden' where city_code = 'SAH' or airport_code = 'SAH';
update airport set timezone = 'Europe/Berlin' where city_code = 'FMM' or airport_code = 'FMM';
update airport set timezone = 'Asia/Aden' where city_code = 'BHN' or airport_code = 'BHN';
update airport set timezone = 'Asia/Aden' where city_code = 'SCT' or airport_code = 'SCT';
update airport set timezone = 'Europe/Istanbul' where city_code = 'NAV' or airport_code = 'NAV';
update airport set timezone = 'America/Cordoba' where city_code = 'EZE' or airport_code = 'EZE';
update airport set timezone = 'Asia/Baghdad' where city_code = 'EBL' or airport_code = 'EBL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'EMD' or airport_code = 'EMD';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KIX' or airport_code = 'KIX';
update airport set timezone = 'America/New_York' where city_code = 'JRB' or airport_code = 'JRB';
update airport set timezone = 'Asia/Manila' where city_code = 'TAG' or airport_code = 'TAG';
update airport set timezone = 'America/Godthab' where city_code = 'JAV' or airport_code = 'JAV';
update airport set timezone = 'America/Godthab' where city_code = 'JCH' or airport_code = 'JCH';
update airport set timezone = 'America/Godthab' where city_code = 'JEG' or airport_code = 'JEG';
update airport set timezone = 'Europe/Madrid' where city_code = 'PMI' or airport_code = 'PMI';
update airport set timezone = 'Australia/Darwin' where city_code = 'DRW' or airport_code = 'DRW';
update airport set timezone = 'Asia/Bangkok' where city_code = 'URT' or airport_code = 'URT';
update airport set timezone = 'Asia/Rangoon' where city_code = 'NYU' or airport_code = 'NYU';
update airport set timezone = 'Asia/Manila' where city_code = 'MPH' or airport_code = 'MPH';
update airport set timezone = 'America/Nassau' where city_code = 'NSB' or airport_code = 'NSB';
update airport set timezone = 'America/Anchorage' where city_code = 'TKA' or airport_code = 'TKA';
update airport set timezone = 'Europe/Malta' where city_code = 'GZM' or airport_code = 'GZM';
update airport set timezone = 'America/New_York' where city_code = 'HVN' or airport_code = 'HVN';
update airport set timezone = 'America/New_York' where city_code = 'AVL' or airport_code = 'AVL';
update airport set timezone = 'America/New_York' where city_code = 'GSO' or airport_code = 'GSO';
update airport set timezone = 'America/Chicago' where city_code = 'FSD' or airport_code = 'FSD';
update airport set timezone = 'Australia/Darwin' where city_code = 'AYQ' or airport_code = 'AYQ';
update airport set timezone = 'America/New_York' where city_code = 'MHT' or airport_code = 'MHT';
update airport set timezone = 'America/New_York' where city_code = 'APF' or airport_code = 'APF';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'RDN' or airport_code = 'RDN';
update airport set timezone = 'America/New_York' where city_code = 'SDF' or airport_code = 'SDF';
update airport set timezone = 'America/New_York' where city_code = 'CHO' or airport_code = 'CHO';
update airport set timezone = 'America/New_York' where city_code = 'ROA' or airport_code = 'ROA';
update airport set timezone = 'America/New_York' where city_code = 'LEX' or airport_code = 'LEX';
update airport set timezone = 'America/Chicago' where city_code = 'EVV' or airport_code = 'EVV';
update airport set timezone = 'America/Denver' where city_code = 'ABQ' or airport_code = 'ABQ';
update airport set timezone = 'America/Denver' where city_code = 'BZN' or airport_code = 'BZN';
update airport set timezone = 'America/Denver' where city_code = 'BIL' or airport_code = 'BIL';
update airport set timezone = 'America/Denver' where city_code = 'BTM' or airport_code = 'BTM';
update airport set timezone = 'America/New_York' where city_code = 'TVC' or airport_code = 'TVC';
update airport set timezone = 'America/Guatemala' where city_code = 'FRS' or airport_code = 'FRS';
update airport set timezone = 'America/New_York' where city_code = 'BHB' or airport_code = 'BHB';
update airport set timezone = 'America/New_York' where city_code = 'RKD' or airport_code = 'RKD';
update airport set timezone = 'America/Denver' where city_code = 'JAC' or airport_code = 'JAC';
update airport set timezone = 'America/Chicago' where city_code = 'RFD' or airport_code = 'RFD';
update airport set timezone = 'Europe/Moscow' where city_code = 'DME' or airport_code = 'DME';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SYX' or airport_code = 'SYX';
update airport set timezone = 'Pacific/Auckland' where city_code = 'MFN' or airport_code = 'MFN';
update airport set timezone = 'America/New_York' where city_code = 'TSS' or airport_code = 'TSS';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LJG' or airport_code = 'LJG';
update airport set timezone = 'America/New_York' where city_code = 'GSP' or airport_code = 'GSP';
update airport set timezone = 'Europe/Berlin' where city_code = 'QKL' or airport_code = 'QKL';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZWS' or airport_code = 'ZWS';
update airport set timezone = 'America/Chicago' where city_code = 'BMI' or airport_code = 'BMI';
update airport set timezone = 'America/Chicago' where city_code = 'GPT' or airport_code = 'GPT';
update airport set timezone = 'America/New_York' where city_code = 'AZO' or airport_code = 'AZO';
update airport set timezone = 'America/New_York' where city_code = 'TOL' or airport_code = 'TOL';
update airport set timezone = 'America/New_York' where city_code = 'FWA' or airport_code = 'FWA';
update airport set timezone = 'America/Chicago' where city_code = 'DEC' or airport_code = 'DEC';
update airport set timezone = 'America/Chicago' where city_code = 'CID' or airport_code = 'CID';
update airport set timezone = 'America/Chicago' where city_code = 'LSE' or airport_code = 'LSE';
update airport set timezone = 'America/Chicago' where city_code = 'CWA' or airport_code = 'CWA';
update airport set timezone = 'America/Chicago' where city_code = 'PIA' or airport_code = 'PIA';
update airport set timezone = 'America/Chicago' where city_code = 'ATW' or airport_code = 'ATW';
update airport set timezone = 'America/Chicago' where city_code = 'RST' or airport_code = 'RST';
update airport set timezone = 'America/Chicago' where city_code = 'CMI' or airport_code = 'CMI';
update airport set timezone = 'America/Chicago' where city_code = 'MHK' or airport_code = 'MHK';
update airport set timezone = 'Australia/Adelaide' where city_code = 'KGC' or airport_code = 'KGC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HVB' or airport_code = 'HVB';
update airport set timezone = 'Europe/Paris' where city_code = 'BSL' or airport_code = 'BSL';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DLU' or airport_code = 'DLU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JHG' or airport_code = 'JHG';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'MZV' or airport_code = 'MZV';
update airport set timezone = 'Africa/Cairo' where city_code = 'SSH' or airport_code = 'SSH';
update airport set timezone = 'America/New_York' where city_code = 'FKL' or airport_code = 'FKL';
update airport set timezone = 'Africa/Nairobi' where city_code = 'NBO' or airport_code = 'NBO';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'SEU' or airport_code = 'SEU';
update airport set timezone = 'America/Cordoba' where city_code = 'FTE' or airport_code = 'FTE';
update airport set timezone = 'Australia/Sydney' where city_code = 'ARM' or airport_code = 'ARM';
update airport set timezone = 'America/Denver' where city_code = 'GJT' or airport_code = 'GJT';
update airport set timezone = 'America/Denver' where city_code = 'SGU' or airport_code = 'SGU';
update airport set timezone = 'America/Chicago' where city_code = 'DWH' or airport_code = 'DWH';
update airport set timezone = 'America/Chicago' where city_code = 'S46' or airport_code = 'S46';
update airport set timezone = 'America/New_York' where city_code = 'SRQ' or airport_code = 'SRQ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VNY' or airport_code = 'VNY';
update airport set timezone = 'Atlantic/Bermuda' where city_code = 'BDA' or airport_code = 'BDA';
update airport set timezone = 'America/New_York' where city_code = 'X21' or airport_code = 'X21';
update airport set timezone = 'America/Chicago' where city_code = 'MLI' or airport_code = 'MLI';
update airport set timezone = 'America/Chicago' where city_code = 'PFN' or airport_code = 'PFN';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'HIR' or airport_code = 'HIR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'PPT' or airport_code = 'PPT';
update airport set timezone = 'Pacific/Nauru' where city_code = 'INU' or airport_code = 'INU';
update airport set timezone = 'Pacific/Funafuti' where city_code = 'FUN' or airport_code = 'FUN';
update airport set timezone = 'Asia/Omsk' where city_code = 'OVB' or airport_code = 'OVB';
update airport set timezone = 'America/New_York' where city_code = 'DWS' or airport_code = 'DWS';
update airport set timezone = 'Asia/Vientiane' where city_code = 'XKH' or airport_code = 'XKH';
update airport set timezone = 'Asia/Saigon' where city_code = 'HUI' or airport_code = 'HUI';
update airport set timezone = 'America/Chicago' where city_code = 'BIS' or airport_code = 'BIS';
update airport set timezone = 'America/Denver' where city_code = 'TEX' or airport_code = 'TEX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'INC' or airport_code = 'INC';
update airport set timezone = 'Asia/Bangkok' where city_code = 'HGN' or airport_code = 'HGN';
update airport set timezone = 'America/Denver' where city_code = 'RAP' or airport_code = 'RAP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CLD' or airport_code = 'CLD';
update airport set timezone = 'America/New_York' where city_code = 'FNT' or airport_code = 'FNT';
update airport set timezone = 'Asia/Manila' where city_code = 'DVO' or airport_code = 'DVO';
update airport set timezone = 'Europe/Lisbon' where city_code = 'FNC' or airport_code = 'FNC';
update airport set timezone = 'America/Boa_Vista' where city_code = 'STM' or airport_code = 'STM';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'KOS' or airport_code = 'KOS';
update airport set timezone = 'America/Edmonton' where city_code = 'YOA' or airport_code = 'YOA';
update airport set timezone = 'Pacific/Auckland' where city_code = 'NPE' or airport_code = 'NPE';
update airport set timezone = 'Pacific/Fiji' where city_code = 'LEV' or airport_code = 'LEV';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LXA' or airport_code = 'LXA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RDD' or airport_code = 'RDD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EUG' or airport_code = 'EUG';
update airport set timezone = 'America/Denver' where city_code = 'IDA' or airport_code = 'IDA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MFR' or airport_code = 'MFR';
update airport set timezone = 'Pacific/Auckland' where city_code = 'KBZ' or airport_code = 'KBZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RDM' or airport_code = 'RDM';
update airport set timezone = 'Pacific/Auckland' where city_code = 'PCN' or airport_code = 'PCN';
update airport set timezone = 'Africa/Windhoek' where city_code = 'WDH' or airport_code = 'WDH';
update airport set timezone = 'America/Vancouver' where city_code = 'YWH' or airport_code = 'YWH';
update airport set timezone = 'America/Vancouver' where city_code = 'CXH' or airport_code = 'CXH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TNA' or airport_code = 'TNA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CZX' or airport_code = 'CZX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YBP' or airport_code = 'YBP';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'TJM' or airport_code = 'TJM';
update airport set timezone = 'America/New_York' where city_code = 'CAK' or airport_code = 'CAK';
update airport set timezone = 'America/Chicago' where city_code = 'HSV' or airport_code = 'HSV';
update airport set timezone = 'America/New_York' where city_code = 'PKB' or airport_code = 'PKB';
update airport set timezone = 'America/Chicago' where city_code = 'MGM' or airport_code = 'MGM';
update airport set timezone = 'America/New_York' where city_code = 'TRI' or airport_code = 'TRI';
update airport set timezone = 'America/Chicago' where city_code = 'PAH' or airport_code = 'PAH';
update airport set timezone = 'Europe/Moscow' where city_code = 'KUF' or airport_code = 'KUF';
update airport set timezone = 'Africa/Djibouti' where city_code = 'JIB' or airport_code = 'JIB';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HAK' or airport_code = 'HAK';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'MFA' or airport_code = 'MFA';
update airport set timezone = 'America/Denver' where city_code = 'FCA' or airport_code = 'FCA';
update airport set timezone = 'America/Phoenix' where city_code = 'PGA' or airport_code = 'PGA';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'UII' or airport_code = 'UII';
update airport set timezone = 'America/Caracas' where city_code = 'SNV' or airport_code = 'SNV';
update airport set timezone = 'America/New_York' where city_code = 'MBS' or airport_code = 'MBS';
update airport set timezone = 'America/New_York' where city_code = 'BGM' or airport_code = 'BGM';
update airport set timezone = 'Asia/Baghdad' where city_code = 'BGW' or airport_code = 'BGW';
update airport set timezone = 'Asia/Bangkok' where city_code = 'NNT' or airport_code = 'NNT';
update airport set timezone = 'Asia/Bangkok' where city_code = 'ROI' or airport_code = 'ROI';
update airport set timezone = 'Asia/Bangkok' where city_code = 'BFV' or airport_code = 'BFV';
update airport set timezone = 'Asia/Bangkok' where city_code = 'UNN' or airport_code = 'UNN';
update airport set timezone = 'Asia/Bangkok' where city_code = 'TDX' or airport_code = 'TDX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BLH' or airport_code = 'BLH';
update airport set timezone = 'Asia/Manila' where city_code = 'CRK' or airport_code = 'CRK';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'SDK' or airport_code = 'SDK';
update airport set timezone = 'Asia/Vientiane' where city_code = 'LXG' or airport_code = 'LXG';
update airport set timezone = 'Asia/Vientiane' where city_code = 'ODY' or airport_code = 'ODY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SHE' or airport_code = 'SHE';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DOY' or airport_code = 'DOY';
update airport set timezone = 'America/Montserrat' where city_code = 'MNI' or airport_code = 'MNI';
update airport set timezone = 'America/Anchorage' where city_code = 'PSG' or airport_code = 'PSG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LYA' or airport_code = 'LYA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'XUZ' or airport_code = 'XUZ';
update airport set timezone = 'Asia/Tehran' where city_code = 'IFN' or airport_code = 'IFN';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MWQ' or airport_code = 'MWQ';
update airport set timezone = 'Asia/Rangoon' where city_code = 'KHM' or airport_code = 'KHM';
update airport set timezone = 'Asia/Saigon' where city_code = 'DLI' or airport_code = 'DLI';
update airport set timezone = 'Asia/Saigon' where city_code = 'VDH' or airport_code = 'VDH';
update airport set timezone = 'Asia/Saigon' where city_code = 'VKG' or airport_code = 'VKG';
update airport set timezone = 'Asia/Saigon' where city_code = 'CAH' or airport_code = 'CAH';
update airport set timezone = 'Asia/Saigon' where city_code = 'VCL' or airport_code = 'VCL';
update airport set timezone = 'Asia/Saigon' where city_code = 'TBB' or airport_code = 'TBB';
update airport set timezone = 'Asia/Bangkok' where city_code = 'PYY' or airport_code = 'PYY';
update airport set timezone = 'Europe/Zagreb' where city_code = 'BWK' or airport_code = 'BWK';
update airport set timezone = 'Africa/Douala' where city_code = 'NSI' or airport_code = 'NSI';
update airport set timezone = 'Africa/Conakry' where city_code = 'CKY' or airport_code = 'CKY';
update airport set timezone = 'Europe/Berlin' where city_code = 'AAH' or airport_code = 'AAH';
update airport set timezone = 'Europe/Berlin' where city_code = 'FKB' or airport_code = 'FKB';
update airport set timezone = 'America/New_York' where city_code = 'SFB' or airport_code = 'SFB';
update airport set timezone = 'Asia/Saigon' where city_code = 'PQC' or airport_code = 'PQC';
update airport set timezone = 'America/New_York' where city_code = 'JST' or airport_code = 'JST';
update airport set timezone = 'Asia/Katmandu' where city_code = 'LUA' or airport_code = 'LUA';
update airport set timezone = 'Asia/Katmandu' where city_code = 'BHP' or airport_code = 'BHP';
update airport set timezone = 'Asia/Katmandu' where city_code = 'LDN' or airport_code = 'LDN';
update airport set timezone = 'Asia/Katmandu' where city_code = 'JMO' or airport_code = 'JMO';
update airport set timezone = 'Asia/Katmandu' where city_code = 'NGX' or airport_code = 'NGX';
update airport set timezone = 'Asia/Katmandu' where city_code = 'PPL' or airport_code = 'PPL';
update airport set timezone = 'Asia/Katmandu' where city_code = 'TMK' or airport_code = 'TMK';
update airport set timezone = 'Asia/Katmandu' where city_code = 'RUM' or airport_code = 'RUM';
update airport set timezone = 'Asia/Katmandu' where city_code = 'DNP' or airport_code = 'DNP';
update airport set timezone = 'Asia/Katmandu' where city_code = 'RUK' or airport_code = 'RUK';
update airport set timezone = 'Asia/Katmandu' where city_code = 'JUM' or airport_code = 'JUM';
update airport set timezone = 'Asia/Katmandu' where city_code = 'HRJ' or airport_code = 'HRJ';
update airport set timezone = 'Asia/Katmandu' where city_code = 'TPJ' or airport_code = 'TPJ';
update airport set timezone = 'Asia/Katmandu' where city_code = 'TMI' or airport_code = 'TMI';
update airport set timezone = 'Asia/Katmandu' where city_code = 'SKH' or airport_code = 'SKH';
update airport set timezone = 'Asia/Katmandu' where city_code = 'IMK' or airport_code = 'IMK';
update airport set timezone = 'Asia/Katmandu' where city_code = 'DOP' or airport_code = 'DOP';
update airport set timezone = 'Asia/Katmandu' where city_code = 'BJH' or airport_code = 'BJH';
update airport set timezone = 'Asia/Katmandu' where city_code = 'DHI' or airport_code = 'DHI';
update airport set timezone = 'Asia/Seoul' where city_code = 'MWX' or airport_code = 'MWX';
update airport set timezone = 'Europe/Athens' where city_code = 'JTY' or airport_code = 'JTY';
update airport set timezone = 'Europe/Athens' where city_code = 'JIK' or airport_code = 'JIK';
update airport set timezone = 'Europe/Athens' where city_code = 'JKL' or airport_code = 'JKL';
update airport set timezone = 'Europe/Athens' where city_code = 'MLO' or airport_code = 'MLO';
update airport set timezone = 'Europe/Athens' where city_code = 'JNX' or airport_code = 'JNX';
update airport set timezone = 'Europe/Athens' where city_code = 'PAS' or airport_code = 'PAS';
update airport set timezone = 'Europe/Athens' where city_code = 'KZS' or airport_code = 'KZS';
update airport set timezone = 'Africa/Cairo' where city_code = 'RMF' or airport_code = 'RMF';
update airport set timezone = 'Europe/Berlin' where city_code = 'NRN' or airport_code = 'NRN';
update airport set timezone = 'Asia/Manila' where city_code = 'USU' or airport_code = 'USU';
update airport set timezone = 'Asia/Manila' where city_code = 'BXU' or airport_code = 'BXU';
update airport set timezone = 'Asia/Manila' where city_code = 'DPL' or airport_code = 'DPL';
update airport set timezone = 'Asia/Manila' where city_code = 'LAO' or airport_code = 'LAO';
update airport set timezone = 'Asia/Manila' where city_code = 'LGP' or airport_code = 'LGP';
update airport set timezone = 'Asia/Manila' where city_code = 'OZC' or airport_code = 'OZC';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZQW' or airport_code = 'ZQW';
update airport set timezone = 'Asia/Manila' where city_code = 'CEB' or airport_code = 'CEB';
update airport set timezone = 'Europe/Berlin' where city_code = 'NOE' or airport_code = 'NOE';
update airport set timezone = 'Europe/Berlin' where city_code = 'JUI' or airport_code = 'JUI';
update airport set timezone = 'America/Fortaleza' where city_code = 'BPS' or airport_code = 'BPS';
update airport set timezone = 'Africa/Bangui' where city_code = 'GDA' or airport_code = 'GDA';
update airport set timezone = 'America/Fortaleza' where city_code = 'PMW' or airport_code = 'PMW';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CLV' or airport_code = 'CLV';
update airport set timezone = 'America/Denver' where city_code = 'MSO' or airport_code = 'MSO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BKQ' or airport_code = 'BKQ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BDB' or airport_code = 'BDB';
update airport set timezone = 'America/Phoenix' where city_code = 'GCN' or airport_code = 'GCN';
update airport set timezone = 'America/Chicago' where city_code = 'SGR' or airport_code = 'SGR';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HIS' or airport_code = 'HIS';
update airport set timezone = 'America/Denver' where city_code = 'APA' or airport_code = 'APA';
update airport set timezone = 'America/Denver' where city_code = 'CVN' or airport_code = 'CVN';
update airport set timezone = 'America/Chicago' where city_code = 'FST' or airport_code = 'FST';
update airport set timezone = 'America/Denver' where city_code = 'LVS' or airport_code = 'LVS';
update airport set timezone = 'America/Chicago' where city_code = 'IWS' or airport_code = 'IWS';
update airport set timezone = 'America/Denver' where city_code = 'LHX' or airport_code = 'LHX';
update airport set timezone = 'America/Denver' where city_code = 'LRU' or airport_code = 'LRU';
update airport set timezone = 'America/Chicago' where city_code = 'BKD' or airport_code = 'BKD';
update airport set timezone = 'America/Chicago' where city_code = 'TPL' or airport_code = 'TPL';
update airport set timezone = 'America/Chicago' where city_code = 'OZA' or airport_code = 'OZA';
update airport set timezone = 'Europe/Athens' where city_code = 'HEW' or airport_code = 'HEW';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'WKL' or airport_code = 'WKL';
update airport set timezone = 'Indian/Maldives' where city_code = 'KDM' or airport_code = 'KDM';
update airport set timezone = 'America/Edmonton' where city_code = 'LAK' or airport_code = 'LAK';
update airport set timezone = 'America/Edmonton' where city_code = 'YWJ' or airport_code = 'YWJ';
update airport set timezone = 'America/Edmonton' where city_code = 'ZFN' or airport_code = 'ZFN';
update airport set timezone = 'America/Edmonton' where city_code = 'YGH' or airport_code = 'YGH';
update airport set timezone = 'Pacific/Efate' where city_code = 'TAH' or airport_code = 'TAH';
update airport set timezone = 'America/Edmonton' where city_code = 'YPC' or airport_code = 'YPC';
update airport set timezone = 'America/La_Paz' where city_code = 'SRZ' or airport_code = 'SRZ';
update airport set timezone = 'America/Godthab' where city_code = 'KUS' or airport_code = 'KUS';
update airport set timezone = 'America/Curacao' where city_code = 'SAB' or airport_code = 'SAB';
update airport set timezone = 'America/Denver' where city_code = 'EGE' or airport_code = 'EGE';
update airport set timezone = 'Europe/Oslo' where city_code = 'SKN' or airport_code = 'SKN';
update airport set timezone = 'America/New_York' where city_code = 'CGF' or airport_code = 'CGF';
update airport set timezone = 'America/New_York' where city_code = 'MFD' or airport_code = 'MFD';
update airport set timezone = 'America/New_York' where city_code = 'CSG' or airport_code = 'CSG';
update airport set timezone = 'America/Chicago' where city_code = 'LAW' or airport_code = 'LAW';
update airport set timezone = 'America/Denver' where city_code = 'FNL' or airport_code = 'FNL';
update airport set timezone = 'America/Phoenix' where city_code = 'FLG' or airport_code = 'FLG';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TVL' or airport_code = 'TVL';
update airport set timezone = 'America/Denver' where city_code = 'TWF' or airport_code = 'TWF';
update airport set timezone = 'Europe/Monaco' where city_code = 'MCM' or airport_code = 'MCM';
update airport set timezone = 'America/New_York' where city_code = 'MVY' or airport_code = 'MVY';
update airport set timezone = 'America/New_York' where city_code = 'UUU' or airport_code = 'UUU';
update airport set timezone = 'America/New_York' where city_code = 'VSF' or airport_code = 'VSF';
update airport set timezone = 'America/New_York' where city_code = 'CON' or airport_code = 'CON';
update airport set timezone = 'America/New_York' where city_code = 'SFM' or airport_code = 'SFM';
update airport set timezone = 'America/New_York' where city_code = 'GON' or airport_code = 'GON';
update airport set timezone = 'America/Chicago' where city_code = 'STC' or airport_code = 'STC';
update airport set timezone = 'Asia/Rangoon' where city_code = 'BPE' or airport_code = 'BPE';
update airport set timezone = 'America/Chicago' where city_code = 'GTR' or airport_code = 'GTR';
update airport set timezone = 'Europe/Moscow' where city_code = 'GOJ' or airport_code = 'GOJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HQM' or airport_code = 'HQM';
update airport set timezone = 'America/New_York' where city_code = 'ERI' or airport_code = 'ERI';
update airport set timezone = 'America/New_York' where city_code = 'HYA' or airport_code = 'HYA';
update airport set timezone = 'America/Belize' where city_code = 'SPR' or airport_code = 'SPR';
update airport set timezone = 'America/Phoenix' where city_code = 'SDX' or airport_code = 'SDX';
update airport set timezone = 'America/New_York' where city_code = 'MGW' or airport_code = 'MGW';
update airport set timezone = 'America/New_York' where city_code = 'CRW' or airport_code = 'CRW';
update airport set timezone = 'America/New_York' where city_code = 'AVP' or airport_code = 'AVP';
update airport set timezone = 'America/Chicago' where city_code = 'BJI' or airport_code = 'BJI';
update airport set timezone = 'Asia/Baku' where city_code = 'BAK' or airport_code = 'BAK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'THG' or airport_code = 'THG';
update airport set timezone = 'Pacific/Apia' where city_code = 'FGI' or airport_code = 'FGI';
update airport set timezone = 'Australia/Sydney' where city_code = 'BNK' or airport_code = 'BNK';
update airport set timezone = 'America/Chicago' where city_code = 'FAR' or airport_code = 'FAR';
update airport set timezone = 'America/Chicago' where city_code = 'MKC' or airport_code = 'MKC';
update airport set timezone = 'America/Phoenix' where city_code = 'AZA' or airport_code = 'AZA';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'RBE' or airport_code = 'RBE';
update airport set timezone = 'America/Denver' where city_code = 'GCC' or airport_code = 'GCC';
update airport set timezone = 'Asia/Omsk' where city_code = 'TOF' or airport_code = 'TOF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NZJ' or airport_code = 'NZJ';
update airport set timezone = 'Asia/Bangkok' where city_code = 'PHY' or airport_code = 'PHY';
update airport set timezone = 'Asia/Bangkok' where city_code = 'CJM' or airport_code = 'CJM';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JZH' or airport_code = 'JZH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SWA' or airport_code = 'SWA';
update airport set timezone = 'America/Guyana' where city_code = 'GEO' or airport_code = 'GEO';
update airport set timezone = 'America/Asuncion' where city_code = 'AGT' or airport_code = 'AGT';
update airport set timezone = 'America/Guyana' where city_code = 'OGL' or airport_code = 'OGL';
update airport set timezone = 'America/Guyana' where city_code = 'KAI' or airport_code = 'KAI';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DNH' or airport_code = 'DNH';
update airport set timezone = 'Europe/Rome' where city_code = 'AOI' or airport_code = 'AOI';
update airport set timezone = 'America/New_York' where city_code = 'ECA' or airport_code = 'ECA';
update airport set timezone = 'America/Santiago' where city_code = 'CPO' or airport_code = 'CPO';
update airport set timezone = 'Africa/Cairo' where city_code = 'TCP' or airport_code = 'TCP';
update airport set timezone = 'America/Cayman' where city_code = 'LYB' or airport_code = 'LYB';
update airport set timezone = 'Europe/Istanbul' where city_code = 'BJV' or airport_code = 'BJV';
update airport set timezone = 'Africa/Tunis' where city_code = 'TBJ' or airport_code = 'TBJ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'SAW' or airport_code = 'SAW';
update airport set timezone = 'America/New_York' where city_code = 'SCE' or airport_code = 'SCE';
update airport set timezone = 'Australia/Perth' where city_code = 'BME' or airport_code = 'BME';
update airport set timezone = 'Australia/Sydney' where city_code = 'NTL' or airport_code = 'NTL';
update airport set timezone = 'Europe/Vienna' where city_code = 'KLU' or airport_code = 'KLU';
update airport set timezone = 'America/Caracas' where city_code = 'CGU' or airport_code = 'CGU';
update airport set timezone = 'Europe/Oslo' where city_code = 'HFT' or airport_code = 'HFT';
update airport set timezone = 'Europe/Oslo' where city_code = 'HVG' or airport_code = 'HVG';
update airport set timezone = 'Europe/Oslo' where city_code = 'MEH' or airport_code = 'MEH';
update airport set timezone = 'Europe/Oslo' where city_code = 'VDS' or airport_code = 'VDS';
update airport set timezone = 'Asia/Tehran' where city_code = 'IKA' or airport_code = 'IKA';
update airport set timezone = 'Asia/Tehran' where city_code = 'MHD' or airport_code = 'MHD';
update airport set timezone = 'Europe/Berlin' where city_code = 'QEF' or airport_code = 'QEF';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'UIK' or airport_code = 'UIK';
update airport set timezone = 'Asia/Chongqing' where city_code = 'MDG' or airport_code = 'MDG';
update airport set timezone = 'America/Chicago' where city_code = 'MEI' or airport_code = 'MEI';
update airport set timezone = 'America/Chicago' where city_code = 'SPI' or airport_code = 'SPI';
update airport set timezone = 'Europe/Sofia' where city_code = 'HKV' or airport_code = 'HKV';
update airport set timezone = 'America/Denver' where city_code = 'CEZ' or airport_code = 'CEZ';
update airport set timezone = 'America/Denver' where city_code = 'HDN' or airport_code = 'HDN';
update airport set timezone = 'America/Denver' where city_code = 'GUP' or airport_code = 'GUP';
update airport set timezone = 'America/Chicago' where city_code = 'LBL' or airport_code = 'LBL';
update airport set timezone = 'America/Denver' where city_code = 'LAA' or airport_code = 'LAA';
update airport set timezone = 'America/Denver' where city_code = 'GLD' or airport_code = 'GLD';
update airport set timezone = 'America/Denver' where city_code = 'COD' or airport_code = 'COD';
update airport set timezone = 'Europe/Oslo' where city_code = 'HOV' or airport_code = 'HOV';
update airport set timezone = 'Europe/London' where city_code = 'ISC' or airport_code = 'ISC';
update airport set timezone = 'America/Chicago' where city_code = 'SGF' or airport_code = 'SGF';
update airport set timezone = 'Europe/Oslo' where city_code = 'NVK' or airport_code = 'NVK';
update airport set timezone = 'Europe/Oslo' where city_code = 'BVG' or airport_code = 'BVG';
update airport set timezone = 'Europe/Oslo' where city_code = 'FBU' or airport_code = 'FBU';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'NSK' or airport_code = 'NSK';
update airport set timezone = 'Europe/Moscow' where city_code = 'AAQ' or airport_code = 'AAQ';
update airport set timezone = 'America/Chicago' where city_code = 'JLN' or airport_code = 'JLN';
update airport set timezone = 'America/New_York' where city_code = 'ABE' or airport_code = 'ABE';
update airport set timezone = 'America/Chicago' where city_code = 'XNA' or airport_code = 'XNA';
update airport set timezone = 'Asia/Oral' where city_code = 'GUW' or airport_code = 'GUW';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'KZO' or airport_code = 'KZO';
update airport set timezone = 'America/New_York' where city_code = 'SBN' or airport_code = 'SBN';
update airport set timezone = 'Europe/Moscow' where city_code = 'BKA' or airport_code = 'BKA';
update airport set timezone = 'Europe/Moscow' where city_code = 'ARH' or airport_code = 'ARH';
update airport set timezone = 'Europe/Moscow' where city_code = 'RTW' or airport_code = 'RTW';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NUX' or airport_code = 'NUX';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NOJ' or airport_code = 'NOJ';
update airport set timezone = 'America/New_York' where city_code = 'ZWU' or airport_code = 'ZWU';
update airport set timezone = 'Asia/Oral' where city_code = 'SCO' or airport_code = 'SCO';
update airport set timezone = 'Europe/Moscow' where city_code = 'UCT' or airport_code = 'UCT';
update airport set timezone = 'Europe/Moscow' where city_code = 'USK' or airport_code = 'USK';
update airport set timezone = 'Europe/Moscow' where city_code = 'PEX' or airport_code = 'PEX';
update airport set timezone = 'Europe/Moscow' where city_code = 'NNM' or airport_code = 'NNM';
update airport set timezone = 'Europe/Moscow' where city_code = 'PKV' or airport_code = 'PKV';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'KGP' or airport_code = 'KGP';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'KJA' or airport_code = 'KJA';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'KGF' or airport_code = 'KGF';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'URJ' or airport_code = 'URJ';
update airport set timezone = 'Asia/Ashgabat' where city_code = 'CRZ' or airport_code = 'CRZ';
update airport set timezone = 'Europe/Moscow' where city_code = 'IWA' or airport_code = 'IWA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CGQ' or airport_code = 'CGQ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KIJ' or airport_code = 'KIJ';
update airport set timezone = 'Pacific/Johnston' where city_code = 'JON' or airport_code = 'JON';
update airport set timezone = 'America/New_York' where city_code = 'SMD' or airport_code = 'SMD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ACV' or airport_code = 'ACV';
update airport set timezone = 'America/Chicago' where city_code = 'ATT' or airport_code = 'ATT';
update airport set timezone = 'America/New_York' where city_code = 'OAJ' or airport_code = 'OAJ';
update airport set timezone = 'America/Chicago' where city_code = 'TCL' or airport_code = 'TCL';
update airport set timezone = 'America/Chicago' where city_code = 'DBQ' or airport_code = 'DBQ';
update airport set timezone = 'Europe/Oslo' where city_code = 'FDE' or airport_code = 'FDE';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'PYJ' or airport_code = 'PYJ';
update airport set timezone = 'Asia/Baku' where city_code = 'NAJ' or airport_code = 'NAJ';
update airport set timezone = 'Asia/Baku' where city_code = 'KVD' or airport_code = 'KVD';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'UKK' or airport_code = 'UKK';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'PPK' or airport_code = 'PPK';
update airport set timezone = 'America/Guadeloupe' where city_code = 'GBJ' or airport_code = 'GBJ';
update airport set timezone = 'America/Guadeloupe' where city_code = 'SFC' or airport_code = 'SFC';
update airport set timezone = 'America/Antigua' where city_code = 'BBQ' or airport_code = 'BBQ';
update airport set timezone = 'America/Boa_Vista' where city_code = 'JPR' or airport_code = 'JPR';
update airport set timezone = 'America/Caracas' where city_code = 'MYC' or airport_code = 'MYC';
update airport set timezone = 'America/Lima' where city_code = 'NZA' or airport_code = 'NZA';
update airport set timezone = 'America/Lima' where city_code = 'CJA' or airport_code = 'CJA';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'GTA' or airport_code = 'GTA';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'BXX' or airport_code = 'BXX';
update airport set timezone = 'America/Fortaleza' where city_code = 'MVS' or airport_code = 'MVS';
update airport set timezone = 'America/Paramaribo' where city_code = 'ORG' or airport_code = 'ORG';
update airport set timezone = 'America/La_Paz' where city_code = 'REY' or airport_code = 'REY';
update airport set timezone = 'America/La_Paz' where city_code = 'PUR' or airport_code = 'PUR';
update airport set timezone = 'America/Bogota' where city_code = 'EYP' or airport_code = 'EYP';
update airport set timezone = 'America/Guayaquil' where city_code = 'ESM' or airport_code = 'ESM';
update airport set timezone = 'America/Santiago' where city_code = 'ZPC' or airport_code = 'ZPC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'TOW' or airport_code = 'TOW';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'RIA' or airport_code = 'RIA';
update airport set timezone = 'America/Fortaleza' where city_code = 'LEC' or airport_code = 'LEC';
update airport set timezone = 'Australia/Sydney' where city_code = 'GUL' or airport_code = 'GUL';
update airport set timezone = 'America/Fortaleza' where city_code = 'JDO' or airport_code = 'JDO';
update airport set timezone = 'America/Cordoba' where city_code = 'SST' or airport_code = 'SST';
update airport set timezone = 'America/Cordoba' where city_code = 'GGS' or airport_code = 'GGS';
update airport set timezone = 'America/Cordoba' where city_code = 'OES' or airport_code = 'OES';
update airport set timezone = 'America/Cordoba' where city_code = 'LHS' or airport_code = 'LHS';
update airport set timezone = 'America/Cordoba' where city_code = 'TTG' or airport_code = 'TTG';
update airport set timezone = 'Asia/Manila' where city_code = 'MBT' or airport_code = 'MBT';
update airport set timezone = 'Asia/Manila' where city_code = 'CRM' or airport_code = 'CRM';
update airport set timezone = 'Asia/Manila' where city_code = 'JOL' or airport_code = 'JOL';
update airport set timezone = 'Asia/Manila' where city_code = 'CGM' or airport_code = 'CGM';
update airport set timezone = 'Asia/Manila' where city_code = 'CYU' or airport_code = 'CYU';
update airport set timezone = 'Asia/Seoul' where city_code = 'CJJ' or airport_code = 'CJJ';
update airport set timezone = 'Asia/Seoul' where city_code = 'HIN' or airport_code = 'HIN';
update airport set timezone = 'Asia/Seoul' where city_code = 'WJU' or airport_code = 'WJU';
update airport set timezone = 'Asia/Seoul' where city_code = 'MPK' or airport_code = 'MPK';
update airport set timezone = 'Asia/Seoul' where city_code = 'KUV' or airport_code = 'KUV';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MYE' or airport_code = 'MYE';
update airport set timezone = 'Asia/Tokyo' where city_code = 'SYO' or airport_code = 'SYO';
update airport set timezone = 'Asia/Tokyo' where city_code = 'ONJ' or airport_code = 'ONJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'FKS' or airport_code = 'FKS';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IWJ' or airport_code = 'IWJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'NKM' or airport_code = 'NKM';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HSG' or airport_code = 'HSG';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OKD' or airport_code = 'OKD';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KUH' or airport_code = 'KUH';
update airport set timezone = 'Asia/Taipei' where city_code = 'MFK' or airport_code = 'MFK';
update airport set timezone = 'Asia/Taipei' where city_code = 'HCN' or airport_code = 'HCN';
update airport set timezone = 'Asia/Taipei' where city_code = 'LZN' or airport_code = 'LZN';
update airport set timezone = 'Pacific/Majuro' where city_code = 'ENT' or airport_code = 'ENT';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'LUP' or airport_code = 'LUP';
update airport set timezone = 'Asia/Manila' where city_code = 'ENI' or airport_code = 'ENI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WPM' or airport_code = 'WPM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'VMU' or airport_code = 'VMU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'UKU' or airport_code = 'UKU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TFI' or airport_code = 'TFI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SKC' or airport_code = 'SKC';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OPU' or airport_code = 'OPU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OBX' or airport_code = 'OBX';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LSA' or airport_code = 'LSA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LNV' or airport_code = 'LNV';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LMY' or airport_code = 'LMY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KUY' or airport_code = 'KUY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KKD' or airport_code = 'KKD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KDR' or airport_code = 'KDR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'JAQ' or airport_code = 'JAQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'IIS' or airport_code = 'IIS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'IHU' or airport_code = 'IHU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GMI' or airport_code = 'GMI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ATP' or airport_code = 'ATP';
update airport set timezone = 'America/Anchorage' where city_code = 'WRG' or airport_code = 'WRG';
update airport set timezone = 'America/Anchorage' where city_code = 'VAK' or airport_code = 'VAK';
update airport set timezone = 'America/Anchorage' where city_code = 'ANI' or airport_code = 'ANI';
update airport set timezone = 'America/Anchorage' where city_code = 'MOU' or airport_code = 'MOU';
update airport set timezone = 'America/Anchorage' where city_code = 'MCG' or airport_code = 'MCG';
update airport set timezone = 'America/Anchorage' where city_code = 'KLG' or airport_code = 'KLG';
update airport set timezone = 'America/Anchorage' where city_code = 'HNS' or airport_code = 'HNS';
update airport set timezone = 'America/Anchorage' where city_code = 'HCR' or airport_code = 'HCR';
update airport set timezone = 'America/Anchorage' where city_code = 'SGY' or airport_code = 'SGY';
update airport set timezone = 'America/Anchorage' where city_code = 'GST' or airport_code = 'GST';
update airport set timezone = 'America/Anchorage' where city_code = 'ADK' or airport_code = 'ADK';
update airport set timezone = 'America/Panama' where city_code = 'SAX' or airport_code = 'SAX';
update airport set timezone = 'America/Panama' where city_code = 'OTD' or airport_code = 'OTD';
update airport set timezone = 'America/Panama' where city_code = 'ELE' or airport_code = 'ELE';
update airport set timezone = 'America/Panama' where city_code = 'BFQ' or airport_code = 'BFQ';
update airport set timezone = 'Asia/Aden' where city_code = 'GXF' or airport_code = 'GXF';
update airport set timezone = 'Asia/Damascus' where city_code = 'KAC' or airport_code = 'KAC';
update airport set timezone = 'Asia/Baghdad' where city_code = 'ISU' or airport_code = 'ISU';
update airport set timezone = 'Asia/Karachi' where city_code = 'TUK' or airport_code = 'TUK';
update airport set timezone = 'Asia/Karachi' where city_code = 'SYW' or airport_code = 'SYW';
update airport set timezone = 'Asia/Karachi' where city_code = 'KDU' or airport_code = 'KDU';
update airport set timezone = 'Asia/Karachi' where city_code = 'PAJ' or airport_code = 'PAJ';
update airport set timezone = 'Asia/Karachi' where city_code = 'ORW' or airport_code = 'ORW';
update airport set timezone = 'Asia/Karachi' where city_code = 'KDD' or airport_code = 'KDD';
update airport set timezone = 'Asia/Karachi' where city_code = 'HDD' or airport_code = 'HDD';
update airport set timezone = 'Asia/Karachi' where city_code = 'JIW' or airport_code = 'JIW';
update airport set timezone = 'Asia/Karachi' where city_code = 'DSK' or airport_code = 'DSK';
update airport set timezone = 'Asia/Karachi' where city_code = 'DEA' or airport_code = 'DEA';
update airport set timezone = 'Asia/Karachi' where city_code = 'DBA' or airport_code = 'DBA';
update airport set timezone = 'Asia/Karachi' where city_code = 'CJL' or airport_code = 'CJL';
update airport set timezone = 'Asia/Karachi' where city_code = 'BHV' or airport_code = 'BHV';
update airport set timezone = 'Asia/Karachi' where city_code = 'BNP' or airport_code = 'BNP';
update airport set timezone = 'Asia/Dubai' where city_code = 'AAN' or airport_code = 'AAN';
update airport set timezone = 'Asia/Tehran' where city_code = 'OMH' or airport_code = 'OMH';
update airport set timezone = 'Asia/Tehran' where city_code = 'ADU' or airport_code = 'ADU';
update airport set timezone = 'Asia/Tehran' where city_code = 'LRR' or airport_code = 'LRR';
update airport set timezone = 'Asia/Tehran' where city_code = 'SRY' or airport_code = 'SRY';
update airport set timezone = 'Asia/Tehran' where city_code = 'NSH' or airport_code = 'NSH';
update airport set timezone = 'Asia/Tehran' where city_code = 'AFZ' or airport_code = 'AFZ';
update airport set timezone = 'Asia/Tehran' where city_code = 'BJB' or airport_code = 'BJB';
update airport set timezone = 'Asia/Tehran' where city_code = 'RJN' or airport_code = 'RJN';
update airport set timezone = 'Asia/Tehran' where city_code = 'BXR' or airport_code = 'BXR';
update airport set timezone = 'Asia/Tehran' where city_code = 'KHD' or airport_code = 'KHD';
update airport set timezone = 'Asia/Riyadh' where city_code = 'EWD' or airport_code = 'EWD';
update airport set timezone = 'Asia/Riyadh' where city_code = 'AJF' or airport_code = 'AJF';
update airport set timezone = 'Asia/Riyadh' where city_code = 'DWD' or airport_code = 'DWD';
update airport set timezone = 'America/Cayenne' where city_code = 'XAU' or airport_code = 'XAU';
update airport set timezone = 'Asia/Kabul' where city_code = 'FBD' or airport_code = 'FBD';
update airport set timezone = 'Pacific/Noumea' where city_code = 'ILP' or airport_code = 'ILP';
update airport set timezone = 'Pacific/Noumea' where city_code = 'BMY' or airport_code = 'BMY';
update airport set timezone = 'Pacific/Noumea' where city_code = 'TGJ' or airport_code = 'TGJ';
update airport set timezone = 'Pacific/Efate' where city_code = 'IPA' or airport_code = 'IPA';
update airport set timezone = 'Pacific/Efate' where city_code = 'FTA' or airport_code = 'FTA';
update airport set timezone = 'Pacific/Efate' where city_code = 'DLY' or airport_code = 'DLY';
update airport set timezone = 'Pacific/Efate' where city_code = 'AWD' or airport_code = 'AWD';
update airport set timezone = 'Pacific/Efate' where city_code = 'AUY' or airport_code = 'AUY';
update airport set timezone = 'Pacific/Efate' where city_code = 'OLZ' or airport_code = 'OLZ';
update airport set timezone = 'Pacific/Efate' where city_code = 'SWJ' or airport_code = 'SWJ';
update airport set timezone = 'Pacific/Efate' where city_code = 'VLS' or airport_code = 'VLS';
update airport set timezone = 'Pacific/Efate' where city_code = 'ULB' or airport_code = 'ULB';
update airport set timezone = 'Pacific/Efate' where city_code = 'TGH' or airport_code = 'TGH';
update airport set timezone = 'Pacific/Efate' where city_code = 'SON' or airport_code = 'SON';
update airport set timezone = 'Pacific/Efate' where city_code = 'RCL' or airport_code = 'RCL';
update airport set timezone = 'Pacific/Efate' where city_code = 'ZGU' or airport_code = 'ZGU';
update airport set timezone = 'Pacific/Efate' where city_code = 'NUS' or airport_code = 'NUS';
update airport set timezone = 'Pacific/Efate' where city_code = 'LNE' or airport_code = 'LNE';
update airport set timezone = 'Pacific/Efate' where city_code = 'MWF' or airport_code = 'MWF';
update airport set timezone = 'Pacific/Efate' where city_code = 'LNB' or airport_code = 'LNB';
update airport set timezone = 'Pacific/Efate' where city_code = 'LPM' or airport_code = 'LPM';
update airport set timezone = 'Pacific/Efate' where city_code = 'PBJ' or airport_code = 'PBJ';
update airport set timezone = 'Pacific/Efate' where city_code = 'SSR' or airport_code = 'SSR';
update airport set timezone = 'Pacific/Efate' where city_code = 'LOD' or airport_code = 'LOD';
update airport set timezone = 'Pacific/Efate' where city_code = 'CCV' or airport_code = 'CCV';
update airport set timezone = 'Pacific/Efate' where city_code = 'EAE' or airport_code = 'EAE';
update airport set timezone = 'Pacific/Efate' where city_code = 'TOH' or airport_code = 'TOH';
update airport set timezone = 'Pacific/Efate' where city_code = 'SLH' or airport_code = 'SLH';
update airport set timezone = 'Pacific/Efate' where city_code = 'MTV' or airport_code = 'MTV';
update airport set timezone = 'Pacific/Marquesas' where city_code = 'UAH' or airport_code = 'UAH';
update airport set timezone = 'Pacific/Marquesas' where city_code = 'UAP' or airport_code = 'UAP';
update airport set timezone = 'Pacific/Marquesas' where city_code = 'AUQ' or airport_code = 'AUQ';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'AHE' or airport_code = 'AHE';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'APK' or airport_code = 'APK';
update airport set timezone = 'Pacific/Apia' where city_code = 'MXS' or airport_code = 'MXS';
update airport set timezone = 'Asia/Katmandu' where city_code = 'MWP' or airport_code = 'MWP';
update airport set timezone = 'Pacific/Wallis' where city_code = 'FUT' or airport_code = 'FUT';
update airport set timezone = 'Pacific/Niue' where city_code = 'IUE' or airport_code = 'IUE';
update airport set timezone = 'Pacific/Fiji' where city_code = 'VBV' or airport_code = 'VBV';
update airport set timezone = 'Pacific/Tongatapu' where city_code = 'NTT' or airport_code = 'NTT';
update airport set timezone = 'Pacific/Tongatapu' where city_code = 'NFO' or airport_code = 'NFO';
update airport set timezone = 'Pacific/Tongatapu' where city_code = 'HPA' or airport_code = 'HPA';
update airport set timezone = 'Pacific/Tongatapu' where city_code = 'EUA' or airport_code = 'EUA';
update airport set timezone = 'Pacific/Fiji' where city_code = 'SVU' or airport_code = 'SVU';
update airport set timezone = 'Pacific/Fiji' where city_code = 'RTA' or airport_code = 'RTA';
update airport set timezone = 'Pacific/Fiji' where city_code = 'KXF' or airport_code = 'KXF';
update airport set timezone = 'Pacific/Fiji' where city_code = 'TVU' or airport_code = 'TVU';
update airport set timezone = 'Pacific/Fiji' where city_code = 'LBS' or airport_code = 'LBS';
update airport set timezone = 'Pacific/Fiji' where city_code = 'LKB' or airport_code = 'LKB';
update airport set timezone = 'Pacific/Fiji' where city_code = 'NGI' or airport_code = 'NGI';
update airport set timezone = 'Pacific/Fiji' where city_code = 'MFJ' or airport_code = 'MFJ';
update airport set timezone = 'Pacific/Fiji' where city_code = 'MNF' or airport_code = 'MNF';
update airport set timezone = 'Pacific/Fiji' where city_code = 'KDV' or airport_code = 'KDV';
update airport set timezone = 'Pacific/Fiji' where city_code = 'PTF' or airport_code = 'PTF';
update airport set timezone = 'Pacific/Fiji' where city_code = 'ICI' or airport_code = 'ICI';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'PYE' or airport_code = 'PYE';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'MOI' or airport_code = 'MOI';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'MUK' or airport_code = 'MUK';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'MHX' or airport_code = 'MHX';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'MGS' or airport_code = 'MGS';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'AIU' or airport_code = 'AIU';
update airport set timezone = 'America/Nassau' where city_code = 'PID' or airport_code = 'PID';
update airport set timezone = 'America/Nassau' where city_code = 'CRI' or airport_code = 'CRI';
update airport set timezone = 'America/Nassau' where city_code = 'CAT' or airport_code = 'CAT';
update airport set timezone = 'America/Nassau' where city_code = 'ATC' or airport_code = 'ATC';
update airport set timezone = 'America/Nassau' where city_code = 'COX' or airport_code = 'COX';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LBP' or airport_code = 'LBP';
update airport set timezone = 'America/Mexico_City' where city_code = 'SCX' or airport_code = 'SCX';
update airport set timezone = 'America/Havana' where city_code = 'TND' or airport_code = 'TND';
update airport set timezone = 'America/Havana' where city_code = 'CCC' or airport_code = 'CCC';
update airport set timezone = 'America/Port-au-Prince' where city_code = 'PAX' or airport_code = 'PAX';
update airport set timezone = 'America/Port-au-Prince' where city_code = 'JEE' or airport_code = 'JEE';
update airport set timezone = 'America/Costa_Rica' where city_code = 'PLD' or airport_code = 'PLD';
update airport set timezone = 'America/Costa_Rica' where city_code = 'SYQ' or airport_code = 'SYQ';
update airport set timezone = 'America/Costa_Rica' where city_code = 'PJM' or airport_code = 'PJM';
update airport set timezone = 'America/Costa_Rica' where city_code = 'PBP' or airport_code = 'PBP';
update airport set timezone = 'America/Costa_Rica' where city_code = 'TNO' or airport_code = 'TNO';
update airport set timezone = 'America/Costa_Rica' where city_code = 'BCL' or airport_code = 'BCL';
update airport set timezone = 'America/Costa_Rica' where city_code = 'TTQ' or airport_code = 'TTQ';
update airport set timezone = 'America/Panama' where city_code = 'PLP' or airport_code = 'PLP';
update airport set timezone = 'America/Panama' where city_code = 'JQE' or airport_code = 'JQE';
update airport set timezone = 'America/Panama' where city_code = 'ONX' or airport_code = 'ONX';
update airport set timezone = 'America/Panama' where city_code = 'CTD' or airport_code = 'CTD';
update airport set timezone = 'America/Mexico_City' where city_code = 'JAL' or airport_code = 'JAL';
update airport set timezone = 'America/Tijuana' where city_code = 'GUB' or airport_code = 'GUB';
update airport set timezone = 'America/Mazatlan' where city_code = 'CUA' or airport_code = 'CUA';
update airport set timezone = 'America/Mexico_City' where city_code = 'CYW' or airport_code = 'CYW';
update airport set timezone = 'Pacific/Majuro' where city_code = 'MIJ' or airport_code = 'MIJ';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'PEU' or airport_code = 'PEU';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'AHS' or airport_code = 'AHS';
update airport set timezone = 'Pacific/Majuro' where city_code = 'WTO' or airport_code = 'WTO';
update airport set timezone = 'Pacific/Majuro' where city_code = 'WTE' or airport_code = 'WTE';
update airport set timezone = 'Pacific/Majuro' where city_code = 'WJA' or airport_code = 'WJA';
update airport set timezone = 'Pacific/Majuro' where city_code = 'UIT' or airport_code = 'UIT';
update airport set timezone = 'Pacific/Majuro' where city_code = 'RNP' or airport_code = 'RNP';
update airport set timezone = 'Pacific/Majuro' where city_code = 'NDK' or airport_code = 'NDK';
update airport set timezone = 'Pacific/Majuro' where city_code = 'MJE' or airport_code = 'MJE';
update airport set timezone = 'Pacific/Majuro' where city_code = 'MJB' or airport_code = 'MJB';
update airport set timezone = 'Pacific/Majuro' where city_code = 'MAV' or airport_code = 'MAV';
update airport set timezone = 'Pacific/Majuro' where city_code = 'LIK' or airport_code = 'LIK';
update airport set timezone = 'Pacific/Majuro' where city_code = 'KBT' or airport_code = 'KBT';
update airport set timezone = 'Pacific/Majuro' where city_code = 'JEJ' or airport_code = 'JEJ';
update airport set timezone = 'Pacific/Majuro' where city_code = 'JAT' or airport_code = 'JAT';
update airport set timezone = 'Pacific/Majuro' where city_code = 'BII' or airport_code = 'BII';
update airport set timezone = 'Pacific/Majuro' where city_code = 'AUL' or airport_code = 'AUL';
update airport set timezone = 'Pacific/Majuro' where city_code = 'AIM' or airport_code = 'AIM';
update airport set timezone = 'Pacific/Majuro' where city_code = 'UTK' or airport_code = 'UTK';
update airport set timezone = 'America/Guatemala' where city_code = 'AAZ' or airport_code = 'AAZ';
update airport set timezone = 'America/Guatemala' where city_code = 'PBR' or airport_code = 'PBR';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'JBQ' or airport_code = 'JBQ';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'AZS' or airport_code = 'AZS';
update airport set timezone = 'America/Grand_Turk' where city_code = 'SLX' or airport_code = 'SLX';
update airport set timezone = 'America/Grand_Turk' where city_code = 'MDS' or airport_code = 'MDS';
update airport set timezone = 'America/Grand_Turk' where city_code = 'GDT' or airport_code = 'GDT';
update airport set timezone = 'Europe/Bratislava' where city_code = 'ILZ' or airport_code = 'ILZ';
update airport set timezone = 'Africa/Tripoli' where city_code = 'QUB' or airport_code = 'QUB';
update airport set timezone = 'Africa/Tripoli' where city_code = 'MRA' or airport_code = 'MRA';
update airport set timezone = 'Europe/Istanbul' where city_code = 'SZF' or airport_code = 'SZF';
update airport set timezone = 'Europe/Istanbul' where city_code = 'EDO' or airport_code = 'EDO';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ISE' or airport_code = 'ISE';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ADF' or airport_code = 'ADF';
update airport set timezone = 'Europe/Istanbul' where city_code = 'AJI' or airport_code = 'AJI';
update airport set timezone = 'Europe/Istanbul' where city_code = 'KCM' or airport_code = 'KCM';
update airport set timezone = 'Europe/Istanbul' where city_code = 'SFQ' or airport_code = 'SFQ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'KSY' or airport_code = 'KSY';
update airport set timezone = 'Europe/Istanbul' where city_code = 'USQ' or airport_code = 'USQ';
update airport set timezone = 'Europe/Sarajevo' where city_code = 'BNX' or airport_code = 'BNX';
update airport set timezone = 'Atlantic/Azores' where city_code = 'CVU' or airport_code = 'CVU';
update airport set timezone = 'Europe/Rome' where city_code = 'QSR' or airport_code = 'QSR';
update airport set timezone = 'Europe/Rome' where city_code = 'AOT' or airport_code = 'AOT';
update airport set timezone = 'Europe/Budapest' where city_code = 'SOB' or airport_code = 'SOB';
update airport set timezone = 'Europe/Budapest' where city_code = 'QGY' or airport_code = 'QGY';
update airport set timezone = 'Europe/Budapest' where city_code = 'PEV' or airport_code = 'PEV';
update airport set timezone = 'Europe/Athens' where city_code = 'JSY' or airport_code = 'JSY';
update airport set timezone = 'Europe/Paris' where city_code = 'LTT' or airport_code = 'LTT';
update airport set timezone = 'Europe/Paris' where city_code = 'EAP' or airport_code = 'EAP';
update airport set timezone = 'Europe/Paris' where city_code = 'ANE' or airport_code = 'ANE';
update airport set timezone = 'Europe/Paris' where city_code = 'IDY' or airport_code = 'IDY';
update airport set timezone = 'Europe/Madrid' where city_code = 'RJL' or airport_code = 'RJL';
update airport set timezone = 'Asia/Nicosia' where city_code = 'ECN' or airport_code = 'ECN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'YKM' or airport_code = 'YKM';
update airport set timezone = 'Africa/Nairobi' where city_code = 'KWY' or airport_code = 'KWY';
update airport set timezone = 'America/Denver' where city_code = 'WRL' or airport_code = 'WRL';
update airport set timezone = 'America/New_York' where city_code = 'VLD' or airport_code = 'VLD';
update airport set timezone = 'America/Chicago' where city_code = 'VCT' or airport_code = 'VCT';
update airport set timezone = 'America/Chicago' where city_code = 'UIN' or airport_code = 'UIN';
update airport set timezone = 'America/Chicago' where city_code = 'TUP' or airport_code = 'TUP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SMX' or airport_code = 'SMX';
update airport set timezone = 'America/Chicago' where city_code = 'SLN' or airport_code = 'SLN';
update airport set timezone = 'America/New_York' where city_code = 'SLK' or airport_code = 'SLK';
update airport set timezone = 'America/Denver' where city_code = 'SHR' or airport_code = 'SHR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SBP' or airport_code = 'SBP';
update airport set timezone = 'America/New_York' where city_code = 'RUT' or airport_code = 'RUT';
update airport set timezone = 'America/Denver' where city_code = 'RKS' or airport_code = 'RKS';
update airport set timezone = 'America/Chicago' where city_code = 'RHI' or airport_code = 'RHI';
update airport set timezone = 'America/New_York' where city_code = 'RDG' or airport_code = 'RDG';
update airport set timezone = 'America/New_York' where city_code = 'PSM' or airport_code = 'PSM';
update airport set timezone = 'America/New_York' where city_code = 'PLN' or airport_code = 'PLN';
update airport set timezone = 'America/Chicago' where city_code = 'PIR' or airport_code = 'PIR';
update airport set timezone = 'America/Denver' where city_code = 'PIH' or airport_code = 'PIH';
update airport set timezone = 'America/Chicago' where city_code = 'PIB' or airport_code = 'PIB';
update airport set timezone = 'America/Chicago' where city_code = 'OWB' or airport_code = 'OWB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OTH' or airport_code = 'OTH';
update airport set timezone = 'America/Chicago' where city_code = 'MSL' or airport_code = 'MSL';
update airport set timezone = 'America/Denver' where city_code = 'MLS' or airport_code = 'MLS';
update airport set timezone = 'America/New_York' where city_code = 'MKG' or airport_code = 'MKG';
update airport set timezone = 'America/New_York' where city_code = 'LYH' or airport_code = 'LYH';
update airport set timezone = 'America/Denver' where city_code = 'LWT' or airport_code = 'LWT';
update airport set timezone = 'America/New_York' where city_code = 'LNS' or airport_code = 'LNS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LMT' or airport_code = 'LMT';
update airport set timezone = 'America/New_York' where city_code = 'LEB' or airport_code = 'LEB';
update airport set timezone = 'America/Chicago' where city_code = 'LBF' or airport_code = 'LBF';
update airport set timezone = 'America/New_York' where city_code = 'LBE' or airport_code = 'LBE';
update airport set timezone = 'America/Denver' where city_code = 'LAR' or airport_code = 'LAR';
update airport set timezone = 'America/Chicago' where city_code = 'JMS' or airport_code = 'JMS';
update airport set timezone = 'America/Chicago' where city_code = 'IRK' or airport_code = 'IRK';
update airport set timezone = 'Pacific/Majuro' where city_code = 'KIO' or airport_code = 'KIO';
update airport set timezone = 'America/New_York' where city_code = 'HTS' or airport_code = 'HTS';
update airport set timezone = 'America/Chicago' where city_code = 'HOT' or airport_code = 'HOT';
update airport set timezone = 'America/Chicago' where city_code = 'GRI' or airport_code = 'GRI';
update airport set timezone = 'America/Denver' where city_code = 'GGW' or airport_code = 'GGW';
update airport set timezone = 'America/New_York' where city_code = 'FAY' or airport_code = 'FAY';
update airport set timezone = 'America/New_York' where city_code = 'EWB' or airport_code = 'EWB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EKO' or airport_code = 'EKO';
update airport set timezone = 'America/Chicago' where city_code = 'EAU' or airport_code = 'EAU';
update airport set timezone = 'America/New_York' where city_code = 'DUJ' or airport_code = 'DUJ';
update airport set timezone = 'America/Chicago' where city_code = 'DDC' or airport_code = 'DDC';
update airport set timezone = 'America/New_York' where city_code = 'CMX' or airport_code = 'CMX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CLM' or airport_code = 'CLM';
update airport set timezone = 'America/New_York' where city_code = 'CKB' or airport_code = 'CKB';
update airport set timezone = 'America/New_York' where city_code = 'CIU' or airport_code = 'CIU';
update airport set timezone = 'America/Chicago' where city_code = 'CGI' or airport_code = 'CGI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CEC' or airport_code = 'CEC';
update airport set timezone = 'America/Chicago' where city_code = 'BRL' or airport_code = 'BRL';
update airport set timezone = 'America/New_York' where city_code = 'BQK' or airport_code = 'BQK';
update airport set timezone = 'America/New_York' where city_code = 'BKW' or airport_code = 'BKW';
update airport set timezone = 'America/Denver' where city_code = 'BFF' or airport_code = 'BFF';
update airport set timezone = 'America/New_York' where city_code = 'BFD' or airport_code = 'BFD';
update airport set timezone = 'America/Chicago' where city_code = 'ATY' or airport_code = 'ATY';
update airport set timezone = 'America/New_York' where city_code = 'APN' or airport_code = 'APN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ALW' or airport_code = 'ALW';
update airport set timezone = 'America/Chicago' where city_code = 'ALO' or airport_code = 'ALO';
update airport set timezone = 'America/Denver' where city_code = 'ALM' or airport_code = 'ALM';
update airport set timezone = 'America/New_York' where city_code = 'AHN' or airport_code = 'AHN';
update airport set timezone = 'America/New_York' where city_code = 'ABY' or airport_code = 'ABY';
update airport set timezone = 'America/Chicago' where city_code = 'ABR' or airport_code = 'ABR';
update airport set timezone = 'Europe/Rome' where city_code = 'TQR' or airport_code = 'TQR';
update airport set timezone = 'Asia/Tehran' where city_code = 'GSM' or airport_code = 'GSM';
update airport set timezone = 'Asia/Calcutta' where city_code = 'DIU' or airport_code = 'DIU';
update airport set timezone = 'Africa/Kampala' where city_code = 'ULU' or airport_code = 'ULU';
update airport set timezone = 'Africa/Kampala' where city_code = 'RUA' or airport_code = 'RUA';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'TBO' or airport_code = 'TBO';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'SHY' or airport_code = 'SHY';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'MUZ' or airport_code = 'MUZ';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'LDI' or airport_code = 'LDI';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'TKQ' or airport_code = 'TKQ';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'BKZ' or airport_code = 'BKZ';
update airport set timezone = 'Africa/Khartoum' where city_code = 'PZU' or airport_code = 'PZU';
update airport set timezone = 'Africa/Khartoum' where city_code = 'UYL' or airport_code = 'UYL';
update airport set timezone = 'Africa/Khartoum' where city_code = 'ATB' or airport_code = 'ATB';
update airport set timezone = 'Africa/Tripoli' where city_code = 'LAQ' or airport_code = 'LAQ';
update airport set timezone = 'Africa/Tripoli' where city_code = 'MJI' or airport_code = 'MJI';
update airport set timezone = 'Africa/Tripoli' where city_code = 'TOB' or airport_code = 'TOB';
update airport set timezone = 'Africa/Tripoli' where city_code = 'SRX' or airport_code = 'SRX';
update airport set timezone = 'Africa/Nairobi' where city_code = 'NYK' or airport_code = 'NYK';
update airport set timezone = 'Africa/Nairobi' where city_code = 'MYD' or airport_code = 'MYD';
update airport set timezone = 'Africa/Nairobi' where city_code = 'LKG' or airport_code = 'LKG';
update airport set timezone = 'Africa/Nairobi' where city_code = 'ASV' or airport_code = 'ASV';
update airport set timezone = 'Africa/Cairo' where city_code = 'ATZ' or airport_code = 'ATZ';
update airport set timezone = 'Africa/Cairo' where city_code = 'AAC' or airport_code = 'AAC';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'BUO' or airport_code = 'BUO';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'GLK' or airport_code = 'GLK';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'MGQ' or airport_code = 'MGQ';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'BSA' or airport_code = 'BSA';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'ALU' or airport_code = 'ALU';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'TIE' or airport_code = 'TIE';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'MTF' or airport_code = 'MTF';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'ABK' or airport_code = 'ABK';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'GOR' or airport_code = 'GOR';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'GDE' or airport_code = 'GDE';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'DEM' or airport_code = 'DEM';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'DSE' or airport_code = 'DSE';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'BEI' or airport_code = 'BEI';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'BCO' or airport_code = 'BCO';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'SFL' or airport_code = 'SFL';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'RAI' or airport_code = 'RAI';
update airport set timezone = 'Africa/Casablanca' where city_code = 'NDR' or airport_code = 'NDR';
update airport set timezone = 'Africa/El_Aaiun' where city_code = 'EUN' or airport_code = 'EUN';
update airport set timezone = 'Africa/Casablanca' where city_code = 'ESU' or airport_code = 'ESU';
update airport set timezone = 'Africa/El_Aaiun' where city_code = 'VIL' or airport_code = 'VIL';
update airport set timezone = 'Africa/El_Aaiun' where city_code = 'SMW' or airport_code = 'SMW';
update airport set timezone = 'America/Godthab' where city_code = 'QFI' or airport_code = 'QFI';
update airport set timezone = 'America/Godthab' where city_code = 'QCU' or airport_code = 'QCU';
update airport set timezone = 'America/Godthab' where city_code = 'JGR' or airport_code = 'JGR';
update airport set timezone = 'Africa/Bissau' where city_code = 'OXB' or airport_code = 'OXB';
update airport set timezone = 'Africa/Freetown' where city_code = 'KEN' or airport_code = 'KEN';
update airport set timezone = 'Africa/Freetown' where city_code = 'KBS' or airport_code = 'KBS';
update airport set timezone = 'Africa/Freetown' where city_code = 'BTE' or airport_code = 'BTE';
update airport set timezone = 'Europe/Madrid' where city_code = 'JCU' or airport_code = 'JCU';
update airport set timezone = 'America/Grenada' where city_code = 'CRU' or airport_code = 'CRU';
update airport set timezone = 'Atlantic/Canary' where city_code = 'GMZ' or airport_code = 'GMZ';
update airport set timezone = 'Europe/London' where city_code = 'PSV' or airport_code = 'PSV';
update airport set timezone = 'Europe/London' where city_code = 'OUK' or airport_code = 'OUK';
update airport set timezone = 'Europe/London' where city_code = 'FOA' or airport_code = 'FOA';
update airport set timezone = 'Africa/Libreville' where city_code = 'GAX' or airport_code = 'GAX';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'PFR' or airport_code = 'PFR';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'LJA' or airport_code = 'LJA';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'TSH' or airport_code = 'TSH';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'BSU' or airport_code = 'BSU';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'KRZ' or airport_code = 'KRZ';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'NIO' or airport_code = 'NIO';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'INO' or airport_code = 'INO';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'MAT' or airport_code = 'MAT';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'BOA' or airport_code = 'BOA';
update airport set timezone = 'Africa/Windhoek' where city_code = 'ERS' or airport_code = 'ERS';
update airport set timezone = 'Africa/Windhoek' where city_code = 'SWP' or airport_code = 'SWP';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OMD' or airport_code = 'OMD';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OND' or airport_code = 'OND';
update airport set timezone = 'Africa/Windhoek' where city_code = 'LUD' or airport_code = 'LUD';
update airport set timezone = 'Africa/Blantyre' where city_code = 'CMK' or airport_code = 'CMK';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'SRH' or airport_code = 'SRH';
update airport set timezone = 'Europe/Paris' where city_code = 'JCA' or airport_code = 'JCA';
update airport set timezone = 'Africa/Maputo' where city_code = 'VPY' or airport_code = 'VPY';
update airport set timezone = 'Africa/Libreville' where city_code = 'TCH' or airport_code = 'TCH';
update airport set timezone = 'Africa/Libreville' where city_code = 'MJL' or airport_code = 'MJL';
update airport set timezone = 'Africa/Libreville' where city_code = 'KOU' or airport_code = 'KOU';
update airport set timezone = 'Africa/Luanda' where city_code = 'MSZ' or airport_code = 'MSZ';
update airport set timezone = 'Africa/Luanda' where city_code = 'VPE' or airport_code = 'VPE';
update airport set timezone = 'Africa/Luanda' where city_code = 'DUE' or airport_code = 'DUE';
update airport set timezone = 'Africa/Luanda' where city_code = 'CBT' or airport_code = 'CBT';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'MJA' or airport_code = 'MJA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WMA' or airport_code = 'WMA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'TTS' or airport_code = 'TTS';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WMP' or airport_code = 'WMP';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'DWB' or airport_code = 'DWB';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'IVA' or airport_code = 'IVA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WPB' or airport_code = 'WPB';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WAM' or airport_code = 'WAM';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WTS' or airport_code = 'WTS';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WTA' or airport_code = 'WTA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'TVA' or airport_code = 'TVA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'MXT' or airport_code = 'MXT';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'BMD' or airport_code = 'BMD';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'JVA' or airport_code = 'JVA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WAQ' or airport_code = 'WAQ';
update airport set timezone = 'Indian/Comoro' where city_code = 'YVA' or airport_code = 'YVA';
update airport set timezone = 'Africa/Lusaka' where city_code = 'SLI' or airport_code = 'SLI';
update airport set timezone = 'Africa/Lusaka' where city_code = 'CIP' or airport_code = 'CIP';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'DIS' or airport_code = 'DIS';
update airport set timezone = 'Africa/Gaborone' where city_code = 'TLD' or airport_code = 'TLD';
update airport set timezone = 'Africa/Gaborone' where city_code = 'SWX' or airport_code = 'SWX';
update airport set timezone = 'Africa/Gaborone' where city_code = 'ORP' or airport_code = 'ORP';
update airport set timezone = 'Africa/Gaborone' where city_code = 'GNZ' or airport_code = 'GNZ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MBD' or airport_code = 'MBD';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'AAM' or airport_code = 'AAM';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MQP' or airport_code = 'MQP';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'QRA' or airport_code = 'QRA';
update airport set timezone = 'Europe/Riga' where city_code = 'VTS' or airport_code = 'VTS';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'SHC' or airport_code = 'SHC';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'HIL' or airport_code = 'HIL';
update airport set timezone = 'Europe/Stockholm' where city_code = 'HMV' or airport_code = 'HMV';
update airport set timezone = 'Europe/Stockholm' where city_code = 'SQO' or airport_code = 'SQO';
update airport set timezone = 'Europe/Stockholm' where city_code = 'AGH' or airport_code = 'AGH';
update airport set timezone = 'Europe/Stockholm' where city_code = 'TYF' or airport_code = 'TYF';
update airport set timezone = 'Europe/Stockholm' where city_code = 'KSD' or airport_code = 'KSD';
update airport set timezone = 'Europe/Stockholm' where city_code = 'HFS' or airport_code = 'HFS';
update airport set timezone = 'Europe/Stockholm' where city_code = 'OSD' or airport_code = 'OSD';
update airport set timezone = 'Europe/Warsaw' where city_code = 'LCJ' or airport_code = 'LCJ';
update airport set timezone = 'Europe/Warsaw' where city_code = 'BZG' or airport_code = 'BZG';
update airport set timezone = 'Europe/Oslo' where city_code = 'VRY' or airport_code = 'VRY';
update airport set timezone = 'Europe/Oslo' where city_code = 'VAW' or airport_code = 'VAW';
update airport set timezone = 'Europe/Oslo' where city_code = 'SOJ' or airport_code = 'SOJ';
update airport set timezone = 'Europe/Oslo' where city_code = 'SVJ' or airport_code = 'SVJ';
update airport set timezone = 'Europe/Oslo' where city_code = 'SOG' or airport_code = 'SOG';
update airport set timezone = 'Europe/Oslo' where city_code = 'SDN' or airport_code = 'SDN';
update airport set timezone = 'Europe/Oslo' where city_code = 'RET' or airport_code = 'RET';
update airport set timezone = 'Europe/Oslo' where city_code = 'RVK' or airport_code = 'RVK';
update airport set timezone = 'Europe/Oslo' where city_code = 'MQN' or airport_code = 'MQN';
update airport set timezone = 'Europe/Oslo' where city_code = 'OSY' or airport_code = 'OSY';
update airport set timezone = 'Europe/Oslo' where city_code = 'LKN' or airport_code = 'LKN';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'CNL' or airport_code = 'CNL';
update airport set timezone = 'Europe/Dublin' where city_code = 'CFN' or airport_code = 'CFN';
update airport set timezone = 'Europe/London' where city_code = 'BRR' or airport_code = 'BRR';
update airport set timezone = 'Europe/London' where city_code = 'HLY' or airport_code = 'HLY';
update airport set timezone = 'Europe/London' where city_code = 'PZE' or airport_code = 'PZE';
update airport set timezone = 'Europe/London' where city_code = 'LEQ' or airport_code = 'LEQ';
update airport set timezone = 'Europe/London' where city_code = 'WRY' or airport_code = 'WRY';
update airport set timezone = 'Europe/London' where city_code = 'LWK' or airport_code = 'LWK';
update airport set timezone = 'Europe/London' where city_code = 'NDY' or airport_code = 'NDY';
update airport set timezone = 'Europe/London' where city_code = 'SOY' or airport_code = 'SOY';
update airport set timezone = 'Europe/London' where city_code = 'PPW' or airport_code = 'PPW';
update airport set timezone = 'Europe/London' where city_code = 'NRL' or airport_code = 'NRL';
update airport set timezone = 'Europe/London' where city_code = 'FIE' or airport_code = 'FIE';
update airport set timezone = 'Europe/London' where city_code = 'EOI' or airport_code = 'EOI';
update airport set timezone = 'Europe/London' where city_code = 'CAL' or airport_code = 'CAL';
update airport set timezone = 'Europe/London' where city_code = 'DSA' or airport_code = 'DSA';
update airport set timezone = 'Europe/London' where city_code = 'NQT' or airport_code = 'NQT';
update airport set timezone = 'Europe/Helsinki' where city_code = 'SJY' or airport_code = 'SJY';
update airport set timezone = '\N' where city_code = 'HGL' or airport_code = 'HGL';
update airport set timezone = 'Europe/Berlin' where city_code = 'HEI' or airport_code = 'HEI';
update airport set timezone = 'Europe/Berlin' where city_code = 'HDF' or airport_code = 'HDF';
update airport set timezone = 'Africa/Accra' where city_code = 'KMS' or airport_code = 'KMS';
update airport set timezone = 'Africa/Algiers' where city_code = 'ELU' or airport_code = 'ELU';
update airport set timezone = 'Africa/Algiers' where city_code = 'BMW' or airport_code = 'BMW';
update airport set timezone = 'Africa/Algiers' where city_code = 'CBH' or airport_code = 'CBH';
update airport set timezone = 'Africa/Algiers' where city_code = 'BLJ' or airport_code = 'BLJ';
update airport set timezone = 'America/Regina' where city_code = 'ZWL' or airport_code = 'ZWL';
update airport set timezone = 'America/Halifax' where city_code = 'ZUM' or airport_code = 'ZUM';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZTM' or airport_code = 'ZTM';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZSJ' or airport_code = 'ZSJ';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZRJ' or airport_code = 'ZRJ';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZPB' or airport_code = 'ZPB';
update airport set timezone = 'America/Vancouver' where city_code = 'ZMT' or airport_code = 'ZMT';
update airport set timezone = 'America/Winnipeg' where city_code = 'MSA' or airport_code = 'MSA';
update airport set timezone = 'America/Toronto' where city_code = 'ZKE' or airport_code = 'ZKE';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZJN' or airport_code = 'ZJN';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZGI' or airport_code = 'ZGI';
update airport set timezone = 'America/Regina' where city_code = 'ZFD' or airport_code = 'ZFD';
update airport set timezone = 'America/Toronto' where city_code = 'ZEM' or airport_code = 'ZEM';
update airport set timezone = 'America/Halifax' where city_code = 'ZBF' or airport_code = 'ZBF';
update airport set timezone = 'America/Winnipeg' where city_code = 'ILF' or airport_code = 'ILF';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZAC' or airport_code = 'ZAC';
update airport set timezone = 'America/Toronto' where city_code = 'YZG' or airport_code = 'YZG';
update airport set timezone = 'America/Winnipeg' where city_code = 'YXN' or airport_code = 'YXN';
update airport set timezone = 'America/Toronto' where city_code = 'YWP' or airport_code = 'YWP';
update airport set timezone = 'America/Winnipeg' where city_code = 'YVZ' or airport_code = 'YVZ';
update airport set timezone = 'America/Winnipeg' where city_code = 'YTL' or airport_code = 'YTL';
update airport set timezone = 'America/Winnipeg' where city_code = 'YST' or airport_code = 'YST';
update airport set timezone = '\N' where city_code = 'YSK' or airport_code = 'YSK';
update airport set timezone = 'America/Regina' where city_code = 'YSF' or airport_code = 'YSF';
update airport set timezone = 'America/Winnipeg' where city_code = 'YRL' or airport_code = 'YRL';
update airport set timezone = 'America/Edmonton' where city_code = 'YRA' or airport_code = 'YRA';
update airport set timezone = 'America/Toronto' where city_code = 'YQN' or airport_code = 'YQN';
update airport set timezone = 'America/Winnipeg' where city_code = 'YQD' or airport_code = 'YQD';
update airport set timezone = 'America/Vancouver' where city_code = 'YPW' or airport_code = 'YPW';
update airport set timezone = 'America/Toronto' where city_code = 'YPO' or airport_code = 'YPO';
update airport set timezone = 'America/Winnipeg' where city_code = 'YPM' or airport_code = 'YPM';
update airport set timezone = 'America/Toronto' where city_code = 'YPH' or airport_code = 'YPH';
update airport set timezone = 'America/Winnipeg' where city_code = 'YOH' or airport_code = 'YOH';
update airport set timezone = 'America/Regina' where city_code = 'YNL' or airport_code = 'YNL';
update airport set timezone = 'America/Winnipeg' where city_code = 'YNE' or airport_code = 'YNE';
update airport set timezone = 'America/Toronto' where city_code = 'YNC' or airport_code = 'YNC';
update airport set timezone = 'America/Toronto' where city_code = 'YUD' or airport_code = 'YUD';
update airport set timezone = 'America/Toronto' where city_code = 'YMT' or airport_code = 'YMT';
update airport set timezone = 'America/St_Johns' where city_code = 'YMH' or airport_code = 'YMH';
update airport set timezone = 'America/Toronto' where city_code = 'XGR' or airport_code = 'XGR';
update airport set timezone = 'America/Edmonton' where city_code = 'YSG' or airport_code = 'YSG';
update airport set timezone = 'America/Toronto' where city_code = 'YLH' or airport_code = 'YLH';
update airport set timezone = 'America/Toronto' where city_code = 'YLC' or airport_code = 'YLC';
update airport set timezone = 'America/Toronto' where city_code = 'YPJ' or airport_code = 'YPJ';
update airport set timezone = 'America/Toronto' where city_code = 'YKQ' or airport_code = 'YKQ';
update airport set timezone = 'America/Toronto' where city_code = 'AKV' or airport_code = 'AKV';
update airport set timezone = 'America/Winnipeg' where city_code = 'YIV' or airport_code = 'YIV';
update airport set timezone = 'America/Toronto' where city_code = 'YIK' or airport_code = 'YIK';
update airport set timezone = 'America/Blanc-Sablon' where city_code = 'YHR' or airport_code = 'YHR';
update airport set timezone = 'America/Halifax' where city_code = 'YHO' or airport_code = 'YHO';
update airport set timezone = 'America/Toronto' where city_code = 'YNS' or airport_code = 'YNS';
update airport set timezone = 'America/Vancouver' where city_code = 'YHC' or airport_code = 'YHC';
update airport set timezone = 'America/Toronto' where city_code = 'YQC' or airport_code = 'YQC';
update airport set timezone = 'America/Toronto' where city_code = 'YGZ' or airport_code = 'YGZ';
update airport set timezone = 'America/Winnipeg' where city_code = 'YGX' or airport_code = 'YGX';
update airport set timezone = 'America/Toronto' where city_code = 'YGW' or airport_code = 'YGW';
update airport set timezone = 'America/Toronto' where city_code = 'YGT' or airport_code = 'YGT';
update airport set timezone = 'America/Winnipeg' where city_code = 'YGO' or airport_code = 'YGO';
update airport set timezone = 'America/Vancouver' where city_code = 'YGB' or airport_code = 'YGB';
update airport set timezone = 'America/Halifax' where city_code = 'YMN' or airport_code = 'YMN';
update airport set timezone = 'America/Toronto' where city_code = 'YFH' or airport_code = 'YFH';
update airport set timezone = 'America/Toronto' where city_code = 'YFA' or airport_code = 'YFA';
update airport set timezone = 'America/Toronto' where city_code = 'YER' or airport_code = 'YER';
update airport set timezone = 'America/Halifax' where city_code = 'YDP' or airport_code = 'YDP';
update airport set timezone = 'America/Winnipeg' where city_code = 'YCS' or airport_code = 'YCS';
update airport set timezone = 'America/Halifax' where city_code = 'YRF' or airport_code = 'YRF';
update airport set timezone = 'America/Blanc-Sablon' where city_code = 'YBX' or airport_code = 'YBX';
update airport set timezone = 'America/Regina' where city_code = 'YBE' or airport_code = 'YBE';
update airport set timezone = 'America/Toronto' where city_code = 'YAT' or airport_code = 'YAT';
update airport set timezone = 'America/Toronto' where city_code = 'YKG' or airport_code = 'YKG';
update airport set timezone = 'America/Toronto' where city_code = 'XKS' or airport_code = 'XKS';
update airport set timezone = 'America/Winnipeg' where city_code = 'YAG' or airport_code = 'YAG';
update airport set timezone = 'America/Winnipeg' where city_code = 'YAC' or airport_code = 'YAC';
update airport set timezone = 'America/Bogota' where city_code = 'TCD' or airport_code = 'TCD';
update airport set timezone = 'America/Bogota' where city_code = 'APO' or airport_code = 'APO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NTG' or airport_code = 'NTG';
update airport set timezone = 'America/Blanc-Sablon' where city_code = 'ZLT' or airport_code = 'ZLT';
update airport set timezone = 'America/Blanc-Sablon' where city_code = 'ZTB' or airport_code = 'ZTB';
update airport set timezone = 'America/Toronto' where city_code = 'YKU' or airport_code = 'YKU';
update airport set timezone = 'America/Winnipeg' where city_code = 'YHP' or airport_code = 'YHP';
update airport set timezone = 'America/Toronto' where city_code = 'YOG' or airport_code = 'YOG';
update airport set timezone = 'America/Toronto' where city_code = 'KIF' or airport_code = 'KIF';
update airport set timezone = 'America/Winnipeg' where city_code = 'XBE' or airport_code = 'XBE';
update airport set timezone = 'America/Winnipeg' where city_code = 'YNO' or airport_code = 'YNO';
update airport set timezone = 'America/Toronto' where city_code = 'WNN' or airport_code = 'WNN';
update airport set timezone = 'America/Winnipeg' where city_code = 'YAX' or airport_code = 'YAX';
update airport set timezone = 'America/Toronto' where city_code = 'SUR' or airport_code = 'SUR';
update airport set timezone = 'America/Edmonton' where city_code = 'YLE' or airport_code = 'YLE';
update airport set timezone = 'America/Edmonton' where city_code = 'YCK' or airport_code = 'YCK';
update airport set timezone = 'America/Halifax' where city_code = 'YRG' or airport_code = 'YRG';
update airport set timezone = 'America/St_Johns' where city_code = 'YHA' or airport_code = 'YHA';
update airport set timezone = 'America/St_Johns' where city_code = 'YFX' or airport_code = 'YFX';
update airport set timezone = 'America/St_Johns' where city_code = 'YWM' or airport_code = 'YWM';
update airport set timezone = 'America/Vancouver' where city_code = 'YAA' or airport_code = 'YAA';
update airport set timezone = 'America/Vancouver' where city_code = 'YWS' or airport_code = 'YWS';
update airport set timezone = 'America/Belize' where city_code = 'PND' or airport_code = 'PND';
update airport set timezone = 'America/Belize' where city_code = 'CUK' or airport_code = 'CUK';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'VPN' or airport_code = 'VPN';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'THO' or airport_code = 'THO';
update airport set timezone = 'America/Costa_Rica' where city_code = 'DRK' or airport_code = 'DRK';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'GRY' or airport_code = 'GRY';
update airport set timezone = 'America/Godthab' where city_code = 'JQA' or airport_code = 'JQA';
update airport set timezone = 'America/Godthab' where city_code = 'JUV' or airport_code = 'JUV';
update airport set timezone = 'America/Godthab' where city_code = 'JHS' or airport_code = 'JHS';
update airport set timezone = 'America/Thule' where city_code = 'NAQ' or airport_code = 'NAQ';
update airport set timezone = 'America/Godthab' where city_code = 'JNS' or airport_code = 'JNS';
update airport set timezone = 'America/Godthab' where city_code = 'JNN' or airport_code = 'JNN';
update airport set timezone = 'America/Godthab' where city_code = 'JSU' or airport_code = 'JSU';
update airport set timezone = 'America/Godthab' where city_code = 'JJU' or airport_code = 'JJU';
update airport set timezone = 'America/Godthab' where city_code = 'JGO' or airport_code = 'JGO';
update airport set timezone = 'America/Godthab' where city_code = 'JFR' or airport_code = 'JFR';
update airport set timezone = 'America/Scoresbysund' where city_code = 'CNP' or airport_code = 'CNP';
update airport set timezone = 'America/Godthab' where city_code = 'LLU' or airport_code = 'LLU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WBM' or airport_code = 'WBM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'VAI' or airport_code = 'VAI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RAB' or airport_code = 'RAB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TBG' or airport_code = 'TBG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TIZ' or airport_code = 'TIZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MIS' or airport_code = 'MIS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MXH' or airport_code = 'MXH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MAS' or airport_code = 'MAS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MDU' or airport_code = 'MDU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KVG' or airport_code = 'KVG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KMA' or airport_code = 'KMA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KRI' or airport_code = 'KRI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'UNG' or airport_code = 'UNG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HKN' or airport_code = 'HKN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'PNP' or airport_code = 'PNP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GUR' or airport_code = 'GUR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'DAU' or airport_code = 'DAU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'CMU' or airport_code = 'CMU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BUA' or airport_code = 'BUA';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'RBV' or airport_code = 'RBV';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'KGE' or airport_code = 'KGE';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'VAO' or airport_code = 'VAO';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'RUS' or airport_code = 'RUS';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'RNL' or airport_code = 'RNL';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'MNY' or airport_code = 'MNY';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'GZO' or airport_code = 'GZO';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'MUA' or airport_code = 'MUA';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'SCZ' or airport_code = 'SCZ';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'IRA' or airport_code = 'IRA';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'MBU' or airport_code = 'MBU';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'FRE' or airport_code = 'FRE';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'BAS' or airport_code = 'BAS';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'AKS' or airport_code = 'AKS';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'ATD' or airport_code = 'ATD';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'KXK' or airport_code = 'KXK';
update airport set timezone = 'Africa/Kampala' where city_code = 'OYG' or airport_code = 'OYG';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'IKS' or airport_code = 'IKS';
update airport set timezone = 'Asia/Magadan' where city_code = 'CYX' or airport_code = 'CYX';
update airport set timezone = 'Asia/Magadan' where city_code = 'CKH' or airport_code = 'CKH';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'CNN' or airport_code = 'CNN';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'KSN' or airport_code = 'KSN';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'DZN' or airport_code = 'DZN';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'KOV' or airport_code = 'KOV';
update airport set timezone = 'America/St_Vincent' where city_code = 'UNI' or airport_code = 'UNI';
update airport set timezone = 'America/St_Vincent' where city_code = 'BQU' or airport_code = 'BQU';
update airport set timezone = 'America/Tortola' where city_code = 'VIJ' or airport_code = 'VIJ';
update airport set timezone = 'America/St_Kitts' where city_code = 'NEV' or airport_code = 'NEV';
update airport set timezone = 'America/Guadeloupe' where city_code = 'BBR' or airport_code = 'BBR';
update airport set timezone = 'America/Guadeloupe' where city_code = 'DSD' or airport_code = 'DSD';
update airport set timezone = 'America/Caracas' where city_code = 'VIG' or airport_code = 'VIG';
update airport set timezone = 'America/Montevideo' where city_code = 'MDO' or airport_code = 'MDO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SRA' or airport_code = 'SRA';
update airport set timezone = 'America/Lima' where city_code = 'HUU' or airport_code = 'HUU';
update airport set timezone = 'America/Lima' where city_code = 'LHC' or airport_code = 'LHC';
update airport set timezone = 'America/La_Paz' where city_code = 'SRJ' or airport_code = 'SRJ';
update airport set timezone = 'America/La_Paz' where city_code = 'RIB' or airport_code = 'RIB';
update airport set timezone = 'America/La_Paz' where city_code = 'GYA' or airport_code = 'GYA';
update airport set timezone = 'America/Bogota' where city_code = 'PDA' or airport_code = 'PDA';
update airport set timezone = 'America/Bogota' where city_code = 'NQU' or airport_code = 'NQU';
update airport set timezone = 'America/Bogota' where city_code = 'LPD' or airport_code = 'LPD';
update airport set timezone = 'America/Bogota' where city_code = 'LQM' or airport_code = 'LQM';
update airport set timezone = 'America/Bogota' where city_code = 'GLJ' or airport_code = 'GLJ';
update airport set timezone = 'America/Bogota' where city_code = 'CRC' or airport_code = 'CRC';
update airport set timezone = 'Atlantic/Stanley' where city_code = 'PSY' or airport_code = 'PSY';
update airport set timezone = 'America/Guayaquil' where city_code = 'LOH' or airport_code = 'LOH';
update airport set timezone = 'Pacific/Galapagos' where city_code = 'SCY' or airport_code = 'SCY';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SOD' or airport_code = 'SOD';
update airport set timezone = 'America/Santiago' where city_code = 'ESR' or airport_code = 'ESR';
update airport set timezone = 'America/Fortaleza' where city_code = 'VDC' or airport_code = 'VDC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'MII' or airport_code = 'MII';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'MEA' or airport_code = 'MEA';
update airport set timezone = 'America/Cordoba' where city_code = 'NEC' or airport_code = 'NEC';
update airport set timezone = 'America/Cordoba' where city_code = 'ING' or airport_code = 'ING';
update airport set timezone = 'Asia/Manila' where city_code = 'RXS' or airport_code = 'RXS';
update airport set timezone = 'Asia/Manila' where city_code = 'CYP' or airport_code = 'CYP';
update airport set timezone = 'Asia/Manila' where city_code = 'VRC' or airport_code = 'VRC';
update airport set timezone = 'Asia/Manila' where city_code = 'TUG' or airport_code = 'TUG';
update airport set timezone = 'Asia/Manila' where city_code = 'SFE' or airport_code = 'SFE';
update airport set timezone = '\N' where city_code = 'BSO' or airport_code = 'BSO';
update airport set timezone = 'Asia/Manila' where city_code = 'WNP' or airport_code = 'WNP';
update airport set timezone = 'Asia/Manila' where city_code = 'TDG' or airport_code = 'TDG';
update airport set timezone = 'Asia/Manila' where city_code = 'SUG' or airport_code = 'SUG';
update airport set timezone = 'Asia/Manila' where city_code = 'SGS' or airport_code = 'SGS';
update airport set timezone = 'Asia/Manila' where city_code = 'GES' or airport_code = 'GES';
update airport set timezone = 'Asia/Manila' where city_code = 'SFS' or airport_code = 'SFS';
update airport set timezone = 'Asia/Seoul' where city_code = 'YNY' or airport_code = 'YNY';
update airport set timezone = 'Asia/Magadan' where city_code = 'DYR' or airport_code = 'DYR';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'OHO' or airport_code = 'OHO';
update airport set timezone = 'Pacific/Majuro' where city_code = 'UJE' or airport_code = 'UJE';
update airport set timezone = 'Europe/Kiev' where city_code = 'MPW' or airport_code = 'MPW';
update airport set timezone = 'Europe/Kiev' where city_code = 'VSG' or airport_code = 'VSG';
update airport set timezone = 'Europe/Kiev' where city_code = 'OZH' or airport_code = 'OZH';
update airport set timezone = 'Europe/Kiev' where city_code = 'KWG' or airport_code = 'KWG';
update airport set timezone = 'Europe/Kiev' where city_code = 'HRK' or airport_code = 'HRK';
update airport set timezone = 'Europe/Kiev' where city_code = 'IFO' or airport_code = 'IFO';
update airport set timezone = 'Europe/Kiev' where city_code = 'CWC' or airport_code = 'CWC';
update airport set timezone = 'Europe/Kiev' where city_code = 'RWN' or airport_code = 'RWN';
update airport set timezone = 'Europe/Kiev' where city_code = 'UDJ' or airport_code = 'UDJ';
update airport set timezone = 'Europe/Moscow' where city_code = 'CSH' or airport_code = 'CSH';
update airport set timezone = 'Europe/Moscow' where city_code = 'CEE' or airport_code = 'CEE';
update airport set timezone = 'Europe/Moscow' where city_code = 'AMV' or airport_code = 'AMV';
update airport set timezone = 'Europe/Moscow' where city_code = 'KSZ' or airport_code = 'KSZ';
update airport set timezone = 'Europe/Moscow' where city_code = 'PES' or airport_code = 'PES';
update airport set timezone = 'Europe/Minsk' where city_code = 'GNA' or airport_code = 'GNA';
update airport set timezone = 'Europe/Minsk' where city_code = 'MVQ' or airport_code = 'MVQ';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'EIE' or airport_code = 'EIE';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'KYZ' or airport_code = 'KYZ';
update airport set timezone = 'Asia/Omsk' where city_code = 'NOZ' or airport_code = 'NOZ';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'HTG' or airport_code = 'HTG';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'IAA' or airport_code = 'IAA';
update airport set timezone = 'Europe/Moscow' where city_code = 'GRV' or airport_code = 'GRV';
update airport set timezone = 'Europe/Moscow' where city_code = 'NAL' or airport_code = 'NAL';
update airport set timezone = 'Europe/Moscow' where city_code = 'OGZ' or airport_code = 'OGZ';
update airport set timezone = 'Europe/Moscow' where city_code = 'ESL' or airport_code = 'ESL';
update airport set timezone = 'America/Anchorage' where city_code = 'WKK' or airport_code = 'WKK';
update airport set timezone = 'America/Chicago' where city_code = 'BKX' or airport_code = 'BKX';
update airport set timezone = 'America/New_York' where city_code = 'BLF' or airport_code = 'BLF';
update airport set timezone = 'America/Chicago' where city_code = 'EAR' or airport_code = 'EAR';
update airport set timezone = 'America/Chicago' where city_code = 'GLH' or airport_code = 'GLH';
update airport set timezone = 'America/Phoenix' where city_code = 'IFP' or airport_code = 'IFP';
update airport set timezone = 'America/Phoenix' where city_code = 'IGM' or airport_code = 'IGM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PSC' or airport_code = 'PSC';
update airport set timezone = 'America/Anchorage' where city_code = 'KQA' or airport_code = 'KQA';
update airport set timezone = 'America/Denver' where city_code = 'SVC' or airport_code = 'SVC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LPS' or airport_code = 'LPS';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'SLY' or airport_code = 'SLY';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'HMA' or airport_code = 'HMA';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NYA' or airport_code = 'NYA';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'OVS' or airport_code = 'OVS';
update airport set timezone = 'Europe/Moscow' where city_code = 'IJK' or airport_code = 'IJK';
update airport set timezone = 'Europe/Moscow' where city_code = 'KVX' or airport_code = 'KVX';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NYM' or airport_code = 'NYM';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'RAT' or airport_code = 'RAT';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NFG' or airport_code = 'NFG';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'KRO' or airport_code = 'KRO';
update airport set timezone = 'Asia/Dushanbe' where city_code = 'LBD' or airport_code = 'LBD';
update airport set timezone = 'Asia/Samarkand' where city_code = 'AZN' or airport_code = 'AZN';
update airport set timezone = 'Asia/Samarkand' where city_code = 'FEG' or airport_code = 'FEG';
update airport set timezone = 'Asia/Samarkand' where city_code = 'NMA' or airport_code = 'NMA';
update airport set timezone = 'Asia/Samarkand' where city_code = 'NCU' or airport_code = 'NCU';
update airport set timezone = 'Asia/Samarkand' where city_code = 'UGC' or airport_code = 'UGC';
update airport set timezone = 'Asia/Samarkand' where city_code = 'KSQ' or airport_code = 'KSQ';
update airport set timezone = 'Asia/Samarkand' where city_code = 'TMJ' or airport_code = 'TMJ';
update airport set timezone = 'Europe/Moscow' where city_code = 'RYB' or airport_code = 'RYB';
update airport set timezone = 'Europe/Moscow' where city_code = 'EGO' or airport_code = 'EGO';
update airport set timezone = 'Europe/Moscow' where city_code = 'URS' or airport_code = 'URS';
update airport set timezone = 'Europe/Moscow' where city_code = 'LPK' or airport_code = 'LPK';
update airport set timezone = 'Europe/Moscow' where city_code = 'VKT' or airport_code = 'VKT';
update airport set timezone = 'Europe/Moscow' where city_code = 'UUA' or airport_code = 'UUA';
update airport set timezone = 'Europe/Moscow' where city_code = 'JOK' or airport_code = 'JOK';
update airport set timezone = 'Europe/Moscow' where city_code = 'CSY' or airport_code = 'CSY';
update airport set timezone = 'Europe/Moscow' where city_code = 'ULY' or airport_code = 'ULY';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'OSW' or airport_code = 'OSW';
update airport set timezone = 'Europe/Moscow' where city_code = 'PEZ' or airport_code = 'PEZ';
update airport set timezone = 'Europe/Moscow' where city_code = 'SKX' or airport_code = 'SKX';
update airport set timezone = 'Europe/Moscow' where city_code = 'BWO' or airport_code = 'BWO';
update airport set timezone = 'Asia/Calcutta' where city_code = 'HBX' or airport_code = 'HBX';
update airport set timezone = 'Asia/Colombo' where city_code = 'KCT' or airport_code = 'KCT';
update airport set timezone = 'Asia/Colombo' where city_code = 'WRZ' or airport_code = 'WRZ';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'BBM' or airport_code = 'BBM';
update airport set timezone = 'Asia/Calcutta' where city_code = 'SHL' or airport_code = 'SHL';
update airport set timezone = 'Asia/Calcutta' where city_code = 'GAU' or airport_code = 'GAU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'DMU' or airport_code = 'DMU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'TEZ' or airport_code = 'TEZ';
update airport set timezone = 'Asia/Dhaka' where city_code = 'BZL' or airport_code = 'BZL';
update airport set timezone = 'Asia/Vientiane' where city_code = 'OUI' or airport_code = 'OUI';
update airport set timezone = 'Asia/Saigon' where city_code = 'KON' or airport_code = 'KON';
update airport set timezone = 'Asia/Katmandu' where city_code = 'BHR' or airport_code = 'BHR';
update airport set timezone = 'Asia/Katmandu' where city_code = 'BDP' or airport_code = 'BDP';
update airport set timezone = 'Asia/Katmandu' where city_code = 'MEY' or airport_code = 'MEY';
update airport set timezone = 'Asia/Katmandu' where city_code = 'KEP' or airport_code = 'KEP';
update airport set timezone = 'Indian/Maldives' where city_code = 'GAN' or airport_code = 'GAN';
update airport set timezone = 'Indian/Maldives' where city_code = 'HAQ' or airport_code = 'HAQ';
update airport set timezone = 'Indian/Maldives' where city_code = 'KDO' or airport_code = 'KDO';
update airport set timezone = 'Asia/Bangkok' where city_code = 'MAQ' or airport_code = 'MAQ';
update airport set timezone = 'Asia/Saigon' where city_code = 'BMV' or airport_code = 'BMV';
update airport set timezone = 'Asia/Saigon' where city_code = 'HPH' or airport_code = 'HPH';
update airport set timezone = 'Asia/Saigon' where city_code = 'CXR' or airport_code = 'CXR';
update airport set timezone = 'Asia/Saigon' where city_code = 'VCS' or airport_code = 'VCS';
update airport set timezone = 'Asia/Saigon' where city_code = 'VCA' or airport_code = 'VCA';
update airport set timezone = 'Asia/Saigon' where city_code = 'DIN' or airport_code = 'DIN';
update airport set timezone = 'Asia/Saigon' where city_code = 'UIH' or airport_code = 'UIH';
update airport set timezone = 'Asia/Saigon' where city_code = 'PXU' or airport_code = 'PXU';
update airport set timezone = 'Asia/Saigon' where city_code = 'VII' or airport_code = 'VII';
update airport set timezone = 'Asia/Rangoon' where city_code = 'BMO' or airport_code = 'BMO';
update airport set timezone = 'Asia/Rangoon' where city_code = 'TVY' or airport_code = 'TVY';
update airport set timezone = 'Asia/Rangoon' where city_code = 'KAW' or airport_code = 'KAW';
update airport set timezone = 'Asia/Rangoon' where city_code = 'LIW' or airport_code = 'LIW';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MNU' or airport_code = 'MNU';
update airport set timezone = 'Asia/Rangoon' where city_code = 'BSX' or airport_code = 'BSX';
update airport set timezone = 'Asia/Rangoon' where city_code = 'PKK' or airport_code = 'PKK';
update airport set timezone = 'Asia/Makassar' where city_code = 'SWQ' or airport_code = 'SWQ';
update airport set timezone = 'Asia/Makassar' where city_code = 'TMC' or airport_code = 'TMC';
update airport set timezone = 'Asia/Jayapura' where city_code = 'BUI' or airport_code = 'BUI';
update airport set timezone = 'Asia/Jayapura' where city_code = 'SEH' or airport_code = 'SEH';
update airport set timezone = 'Asia/Makassar' where city_code = 'TJS' or airport_code = 'TJS';
update airport set timezone = 'Asia/Makassar' where city_code = 'DTD' or airport_code = 'DTD';
update airport set timezone = 'Asia/Makassar' where city_code = 'BEJ' or airport_code = 'BEJ';
update airport set timezone = 'Asia/Makassar' where city_code = 'TJG' or airport_code = 'TJG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SMQ' or airport_code = 'SMQ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'LUV' or airport_code = 'LUV';
update airport set timezone = 'Asia/Makassar' where city_code = 'ARD' or airport_code = 'ARD';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'BLG' or airport_code = 'BLG';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LGL' or airport_code = 'LGL';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'ODN' or airport_code = 'ODN';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'MKM' or airport_code = 'MKM';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'BKM' or airport_code = 'BKM';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LWY' or airport_code = 'LWY';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'BBN' or airport_code = 'BBN';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'TMG' or airport_code = 'TMG';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'KUD' or airport_code = 'KUD';
update airport set timezone = 'Asia/Jakarta' where city_code = 'TKG' or airport_code = 'TKG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'HLP' or airport_code = 'HLP';
update airport set timezone = 'Asia/Jakarta' where city_code = 'NTX' or airport_code = 'NTX';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PSU' or airport_code = 'PSU';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SQG' or airport_code = 'SQG';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PDO' or airport_code = 'PDO';
update airport set timezone = 'Asia/Jakarta' where city_code = 'LSW' or airport_code = 'LSW';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'PKG' or airport_code = 'PKG';
update airport set timezone = 'Asia/Makassar' where city_code = 'KBU' or airport_code = 'KBU';
update airport set timezone = 'Asia/Makassar' where city_code = 'LBW' or airport_code = 'LBW';
update airport set timezone = 'Asia/Makassar' where city_code = 'NNX' or airport_code = 'NNX';
update airport set timezone = 'Asia/Makassar' where city_code = 'LPU' or airport_code = 'LPU';
update airport set timezone = 'Australia/Perth' where city_code = 'ALH' or airport_code = 'ALH';
update airport set timezone = 'Australia/Perth' where city_code = 'GYL' or airport_code = 'GYL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'AUU' or airport_code = 'AUU';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BCI' or airport_code = 'BCI';
update airport set timezone = '\N' where city_code = 'BDD' or airport_code = 'BDD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BVI' or airport_code = 'BVI';
update airport set timezone = 'Australia/Adelaide' where city_code = 'BHQ' or airport_code = 'BHQ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HTI' or airport_code = 'HTI';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BEU' or airport_code = 'BEU';
update airport set timezone = 'Australia/Sydney' where city_code = 'BRK' or airport_code = 'BRK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BUC' or airport_code = 'BUC';
update airport set timezone = '\N' where city_code = 'GIC' or airport_code = 'GIC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'OKY' or airport_code = 'OKY';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BQL' or airport_code = 'BQL';
update airport set timezone = 'Australia/Sydney' where city_code = 'BHS' or airport_code = 'BHS';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BLT' or airport_code = 'BLT';
update airport set timezone = 'Australia/Perth' where city_code = 'CVQ' or airport_code = 'CVQ';
update airport set timezone = 'Australia/Sydney' where city_code = 'CAZ' or airport_code = 'CAZ';
update airport set timezone = 'Australia/Adelaide' where city_code = 'CPD' or airport_code = 'CPD';
update airport set timezone = '\N' where city_code = 'CNC' or airport_code = 'CNC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CNJ' or airport_code = 'CNJ';
update airport set timezone = 'Australia/Adelaide' where city_code = 'CED' or airport_code = 'CED';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CTN' or airport_code = 'CTN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CMA' or airport_code = 'CMA';
update airport set timezone = 'Australia/Sydney' where city_code = 'CNB' or airport_code = 'CNB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CUQ' or airport_code = 'CUQ';
update airport set timezone = 'Australia/Sydney' where city_code = 'OOM' or airport_code = 'OOM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DMD' or airport_code = 'DMD';
update airport set timezone = '\N' where city_code = 'NLF' or airport_code = 'NLF';
update airport set timezone = 'Australia/Melbourne' where city_code = 'DPO' or airport_code = 'DPO';
update airport set timezone = 'Australia/Darwin' where city_code = 'ELC' or airport_code = 'ELC';
update airport set timezone = 'Australia/Perth' where city_code = 'EPR' or airport_code = 'EPR';
update airport set timezone = 'Australia/Melbourne' where city_code = 'FLS' or airport_code = 'FLS';
update airport set timezone = 'Australia/Perth' where city_code = 'GET' or airport_code = 'GET';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GLT' or airport_code = 'GLT';
update airport set timezone = 'Australia/Darwin' where city_code = 'GTE' or airport_code = 'GTE';
update airport set timezone = 'Australia/Sydney' where city_code = 'GFF' or airport_code = 'GFF';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HID' or airport_code = 'HID';
update airport set timezone = 'Australia/Darwin' where city_code = 'HOK' or airport_code = 'HOK';
update airport set timezone = 'Australia/Hobart' where city_code = 'MHU' or airport_code = 'MHU';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HGD' or airport_code = 'HGD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'JCK' or airport_code = 'JCK';
update airport set timezone = 'Australia/Perth' where city_code = 'KAX' or airport_code = 'KAX';
update airport set timezone = 'Australia/Melbourne' where city_code = 'KNS' or airport_code = 'KNS';
update airport set timezone = 'Australia/Darwin' where city_code = 'KFG' or airport_code = 'KFG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KRB' or airport_code = 'KRB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KWM' or airport_code = 'KWM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KUG' or airport_code = 'KUG';
update airport set timezone = 'Australia/Perth' where city_code = 'LNO' or airport_code = 'LNO';
update airport set timezone = 'Australia/Darwin' where city_code = 'LEL' or airport_code = 'LEL';
update airport set timezone = '\N' where city_code = 'LDH' or airport_code = 'LDH';
update airport set timezone = 'Australia/Brisbane' where city_code = 'IRG' or airport_code = 'IRG';
update airport set timezone = 'Australia/Sydney' where city_code = 'LSY' or airport_code = 'LSY';
update airport set timezone = 'Australia/Sydney' where city_code = 'LHG' or airport_code = 'LHG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LRE' or airport_code = 'LRE';
update airport set timezone = 'Australia/Perth' where city_code = 'LER' or airport_code = 'LER';
update airport set timezone = 'Australia/Perth' where city_code = 'LVO' or airport_code = 'LVO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'UBB' or airport_code = 'UBB';
update airport set timezone = 'Australia/Perth' where city_code = 'MKR' or airport_code = 'MKR';
update airport set timezone = 'Australia/Sydney' where city_code = 'MIM' or airport_code = 'MIM';
update airport set timezone = 'Australia/Darwin' where city_code = 'MGT' or airport_code = 'MGT';
update airport set timezone = 'Australia/Darwin' where city_code = 'MNG' or airport_code = 'MNG';
update airport set timezone = 'Australia/Darwin' where city_code = 'MCV' or airport_code = 'MCV';
update airport set timezone = 'Australia/Hobart' where city_code = 'MQL' or airport_code = 'MQL';
update airport set timezone = 'Australia/Perth' where city_code = 'MMG' or airport_code = 'MMG';
update airport set timezone = 'Australia/Sydney' where city_code = 'MRZ' or airport_code = 'MRZ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MOV' or airport_code = 'MOV';
update airport set timezone = 'Australia/Sydney' where city_code = 'MYA' or airport_code = 'MYA';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MGB' or airport_code = 'MGB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ONG' or airport_code = 'ONG';
update airport set timezone = '\N' where city_code = 'MYI' or airport_code = 'MYI';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MBH' or airport_code = 'MBH';
update airport set timezone = 'Australia/Sydney' where city_code = 'NRA' or airport_code = 'NRA';
update airport set timezone = 'Australia/Sydney' where city_code = 'NAA' or airport_code = 'NAA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'NTN' or airport_code = 'NTN';
update airport set timezone = 'Australia/Perth' where city_code = 'ZNE' or airport_code = 'ZNE';
update airport set timezone = 'Australia/Adelaide' where city_code = 'OLP' or airport_code = 'OLP';
update airport set timezone = 'Australia/Adelaide' where city_code = 'PUG' or airport_code = 'PUG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'PMK' or airport_code = 'PMK';
update airport set timezone = 'Australia/Perth' where city_code = 'PBO' or airport_code = 'PBO';
update airport set timezone = 'Indian/Cocos' where city_code = 'CCK' or airport_code = 'CCK';
update airport set timezone = 'Australia/Darwin' where city_code = 'GOV' or airport_code = 'GOV';
update airport set timezone = 'Australia/Sydney' where city_code = 'PKE' or airport_code = 'PKE';
update airport set timezone = 'Australia/Adelaide' where city_code = 'PLO' or airport_code = 'PLO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'EDR' or airport_code = 'EDR';
update airport set timezone = 'Australia/Sydney' where city_code = 'PQQ' or airport_code = 'PQQ';
update airport set timezone = 'Australia/Hobart' where city_code = 'PTJ' or airport_code = 'PTJ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ULP' or airport_code = 'ULP';
update airport set timezone = 'Australia/Darwin' where city_code = 'RAM' or airport_code = 'RAM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'RMA' or airport_code = 'RMA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'SGO' or airport_code = 'SGO';
update airport set timezone = 'Australia/Perth' where city_code = 'MJK' or airport_code = 'MJK';
update airport set timezone = '\N' where city_code = 'SBR' or airport_code = 'SBR';
update airport set timezone = 'Australia/Melbourne' where city_code = 'SRN' or airport_code = 'SRN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'XTG' or airport_code = 'XTG';
update airport set timezone = 'Australia/Darwin' where city_code = 'TCA' or airport_code = 'TCA';
update airport set timezone = 'Australia/Darwin' where city_code = 'VCD' or airport_code = 'VCD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'SYU' or airport_code = 'SYU';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WNR' or airport_code = 'WNR';
update airport set timezone = 'Australia/Adelaide' where city_code = 'WYA' or airport_code = 'WYA';
update airport set timezone = 'Australia/Perth' where city_code = 'WUN' or airport_code = 'WUN';
update airport set timezone = 'Australia/Sydney' where city_code = 'WOL' or airport_code = 'WOL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WIN' or airport_code = 'WIN';
update airport set timezone = 'Australia/Melbourne' where city_code = 'BWT' or airport_code = 'BWT';
update airport set timezone = '\N' where city_code = 'OKR' or airport_code = 'OKR';
update airport set timezone = '\N' where city_code = 'XMY' or airport_code = 'XMY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NAY' or airport_code = 'NAY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CIF' or airport_code = 'CIF';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CIH' or airport_code = 'CIH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DAT' or airport_code = 'DAT';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HET' or airport_code = 'HET';
update airport set timezone = 'Asia/Chongqing' where city_code = 'BAV' or airport_code = 'BAV';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SJW' or airport_code = 'SJW';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TGO' or airport_code = 'TGO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HLH' or airport_code = 'HLH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'XIL' or airport_code = 'XIL';
update airport set timezone = 'Asia/Chongqing' where city_code = 'BHY' or airport_code = 'BHY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CGD' or airport_code = 'CGD';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DYG' or airport_code = 'DYG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'MXZ' or airport_code = 'MXZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ZUH' or airport_code = 'ZUH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LZH' or airport_code = 'LZH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ZHA' or airport_code = 'ZHA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ENH' or airport_code = 'ENH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NNY' or airport_code = 'NNY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'XFN' or airport_code = 'XFN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YIH' or airport_code = 'YIH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AKA' or airport_code = 'AKA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'GOQ' or airport_code = 'GOQ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HZG' or airport_code = 'HZG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'IQN' or airport_code = 'IQN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'XNN' or airport_code = 'XNN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ENY' or airport_code = 'ENY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'UYN' or airport_code = 'UYN';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'AVK' or airport_code = 'AVK';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'LTI' or airport_code = 'LTI';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'BYN' or airport_code = 'BYN';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'DLZ' or airport_code = 'DLZ';
update airport set timezone = 'Asia/Hovd' where city_code = 'HVD' or airport_code = 'HVD';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'MXV' or airport_code = 'MXV';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DIG' or airport_code = 'DIG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LUM' or airport_code = 'LUM';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SYM' or airport_code = 'SYM';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ZAT' or airport_code = 'ZAT';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KOW' or airport_code = 'KOW';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JDZ' or airport_code = 'JDZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JIU' or airport_code = 'JIU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JUZ' or airport_code = 'JUZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LYG' or airport_code = 'LYG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HYN' or airport_code = 'HYN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LYI' or airport_code = 'LYI';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JJN' or airport_code = 'JJN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TXN' or airport_code = 'TXN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WEF' or airport_code = 'WEF';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WEH' or airport_code = 'WEH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WUX' or airport_code = 'WUX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WUS' or airport_code = 'WUS';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WNZ' or airport_code = 'WNZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YNZ' or airport_code = 'YNZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YIW' or airport_code = 'YIW';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HSN' or airport_code = 'HSN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'BPX' or airport_code = 'BPX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DAX' or airport_code = 'DAX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'GYS' or airport_code = 'GYS';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LZO' or airport_code = 'LZO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'MIG' or airport_code = 'MIG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NAO' or airport_code = 'NAO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LZY' or airport_code = 'LZY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WXN' or airport_code = 'WXN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AKU' or airport_code = 'AKU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'IQM' or airport_code = 'IQM';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KCA' or airport_code = 'KCA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KRL' or airport_code = 'KRL';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KRY' or airport_code = 'KRY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YIN' or airport_code = 'YIN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HEK' or airport_code = 'HEK';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JMU' or airport_code = 'JMU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JNZ' or airport_code = 'JNZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NDG' or airport_code = 'NDG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YNJ' or airport_code = 'YNJ';
update airport set timezone = 'Australia/Perth' where city_code = 'WME' or airport_code = 'WME';
update airport set timezone = 'America/Caracas' where city_code = 'LRV' or airport_code = 'LRV';
update airport set timezone = 'Europe/Dublin' where city_code = 'IOR' or airport_code = 'IOR';
update airport set timezone = 'Europe/Dublin' where city_code = 'NNR' or airport_code = 'NNR';
update airport set timezone = 'Europe/Berlin' where city_code = 'GTI' or airport_code = 'GTI';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NBB' or airport_code = 'NBB';
update airport set timezone = 'America/New_York' where city_code = 'ORH' or airport_code = 'ORH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AQG' or airport_code = 'AQG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JGS' or airport_code = 'JGS';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SHP' or airport_code = 'SHP';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YCU' or airport_code = 'YCU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LHW' or airport_code = 'LHW';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JGN' or airport_code = 'JGN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DDG' or airport_code = 'DDG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DSN' or airport_code = 'DSN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'PZI' or airport_code = 'PZI';
update airport set timezone = 'America/New_York' where city_code = 'ZVE' or airport_code = 'ZVE';
update airport set timezone = 'Asia/Calcutta' where city_code = 'DIB' or airport_code = 'DIB';
update airport set timezone = 'Asia/Qatar' where city_code = 'XOZ' or airport_code = 'XOZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PWT' or airport_code = 'PWT';
update airport set timezone = 'America/Chicago' where city_code = 'SPW' or airport_code = 'SPW';
update airport set timezone = 'America/Chicago' where city_code = 'JEF' or airport_code = 'JEF';
update airport set timezone = 'America/Phoenix' where city_code = 'GCW' or airport_code = 'GCW';
update airport set timezone = 'America/Phoenix' where city_code = 'BLD' or airport_code = 'BLD';
update airport set timezone = 'Europe/London' where city_code = 'UNT' or airport_code = 'UNT';
update airport set timezone = 'America/New_York' where city_code = 'PVC' or airport_code = 'PVC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LKE' or airport_code = 'LKE';
update airport set timezone = 'Europe/Moscow' where city_code = '%u0' or airport_code = '%u0';
update airport set timezone = '\N' where city_code = 'SBH' or airport_code = 'SBH';
update airport set timezone = 'America/Belize' where city_code = 'TZA' or airport_code = 'TZA';
update airport set timezone = 'Asia/Tbilisi' where city_code = 'SUI' or airport_code = 'SUI';
update airport set timezone = 'Europe/Moscow' where city_code = 'TBW' or airport_code = 'TBW';
update airport set timezone = 'Europe/London' where city_code = 'OBN' or airport_code = 'OBN';
update airport set timezone = 'Asia/Tokyo' where city_code = 'FSZ' or airport_code = 'FSZ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ERM' or airport_code = 'ERM';
update airport set timezone = 'Europe/Paris' where city_code = 'CVF' or airport_code = 'CVF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FUL' or airport_code = 'FUL';
update airport set timezone = 'Europe/London' where city_code = 'FWM' or airport_code = 'FWM';
update airport set timezone = 'Asia/Samarkand' where city_code = 'NVI' or airport_code = 'NVI';
update airport set timezone = 'Europe/Paris' where city_code = 'JPU' or airport_code = 'JPU';
update airport set timezone = 'Europe/Madrid' where city_code = 'RRA' or airport_code = 'RRA';
update airport set timezone = 'Africa/Algiers' where city_code = 'QSF' or airport_code = 'QSF';
update airport set timezone = 'Europe/Paris' where city_code = 'LRH' or airport_code = 'LRH';
update airport set timezone = 'America/Denver' where city_code = 'SUN' or airport_code = 'SUN';
update airport set timezone = 'Europe/London' where city_code = 'PME' or airport_code = 'PME';
update airport set timezone = 'America/Chicago' where city_code = 'MCW' or airport_code = 'MCW';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JNG' or airport_code = 'JNG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'OHE' or airport_code = 'OHE';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DAQ' or airport_code = 'DAQ';
update airport set timezone = 'Europe/Moscow' where city_code = 'IAR' or airport_code = 'IAR';
update airport set timezone = 'Europe/Zurich' where city_code = 'QNC' or airport_code = 'QNC';
update airport set timezone = 'Europe/Zurich' where city_code = 'ZJI' or airport_code = 'ZJI';
update airport set timezone = '\N' where city_code = 'RMT' or airport_code = 'RMT';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'UKX' or airport_code = 'UKX';
update airport set timezone = 'America/New_York' where city_code = '1OH' or airport_code = '1OH';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'BN1' or airport_code = 'BN1';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'BNY' or airport_code = 'BNY';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'RIN' or airport_code = 'RIN';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'ARE' or airport_code = 'ARE';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EAT' or airport_code = 'EAT';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'JDR' or airport_code = 'JDR';
update airport set timezone = 'Europe/Berlin' where city_code = 'AGE' or airport_code = 'AGE';
update airport set timezone = 'America/Chicago' where city_code = 'OSH' or airport_code = 'OSH';
update airport set timezone = 'Europe/Warsaw' where city_code = 'BQT' or airport_code = 'BQT';
update airport set timezone = 'Europe/Kiev' where city_code = 'TNL' or airport_code = 'TNL';
update airport set timezone = 'Europe/Kiev' where city_code = 'CEJ' or airport_code = 'CEJ';
update airport set timezone = 'Europe/Kiev' where city_code = 'UKC' or airport_code = 'UKC';
update airport set timezone = 'America/New_York' where city_code = 'BEH' or airport_code = 'BEH';
update airport set timezone = 'America/Chicago' where city_code = 'UES' or airport_code = 'UES';
update airport set timezone = 'Australia/Sydney' where city_code = 'NOA' or airport_code = 'NOA';
update airport set timezone = 'Australia/Darwin' where city_code = 'KTR' or airport_code = 'KTR';
update airport set timezone = 'America/Chicago' where city_code = '10C' or airport_code = '10C';
update airport set timezone = 'America/New_York' where city_code = 'X01' or airport_code = 'X01';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'COQ' or airport_code = 'COQ';
update airport set timezone = 'Australia/Sydney' where city_code = 'TRO' or airport_code = 'TRO';
update airport set timezone = 'Australia/Sydney' where city_code = 'OAG' or airport_code = 'OAG';
update airport set timezone = 'Australia/Sydney' where city_code = 'GFN' or airport_code = 'GFN';
update airport set timezone = 'Asia/Manila' where city_code = 'MRQ' or airport_code = 'MRQ';
update airport set timezone = 'Asia/Tehran' where city_code = 'HDM' or airport_code = 'HDM';
update airport set timezone = 'America/Blanc-Sablon' where city_code = 'YIF' or airport_code = 'YIF';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'VQS' or airport_code = 'VQS';
update airport set timezone = 'Asia/Rangoon' where city_code = 'KMV' or airport_code = 'KMV';
update airport set timezone = 'America/Guadeloupe' where city_code = 'LSS' or airport_code = 'LSS';
update airport set timezone = 'Europe/Istanbul' where city_code = 'YEI' or airport_code = 'YEI';
update airport set timezone = 'Europe/Istanbul' where city_code = 'TEQ' or airport_code = 'TEQ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'SIC' or airport_code = 'SIC';
update airport set timezone = 'Europe/Istanbul' where city_code = 'MSR' or airport_code = 'MSR';
update airport set timezone = 'Europe/Istanbul' where city_code = 'CKZ' or airport_code = 'CKZ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'AOE' or airport_code = 'AOE';
update airport set timezone = 'Africa/Windhoek' where city_code = 'MPA' or airport_code = 'MPA';
update airport set timezone = 'Africa/Windhoek' where city_code = 'WVB' or airport_code = 'WVB';
update airport set timezone = 'America/Montevideo' where city_code = 'PDP' or airport_code = 'PDP';
update airport set timezone = 'Asia/Karachi' where city_code = 'SKT' or airport_code = 'SKT';
update airport set timezone = 'America/Toronto' where city_code = 'YVB' or airport_code = 'YVB';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'BHG' or airport_code = 'BHG';
update airport set timezone = 'Africa/Nairobi' where city_code = 'UAS' or airport_code = 'UAS';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CHG' or airport_code = 'CHG';
update airport set timezone = 'Pacific/Efate' where city_code = 'WLH' or airport_code = 'WLH';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'TGC' or airport_code = 'TGC';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'LKH' or airport_code = 'LKH';
update airport set timezone = 'Africa/Khartoum' where city_code = 'EGN' or airport_code = 'EGN';
update airport set timezone = 'America/Anchorage' where city_code = 'TOG' or airport_code = 'TOG';
update airport set timezone = 'America/Anchorage' where city_code = 'PTH' or airport_code = 'PTH';
update airport set timezone = 'America/Anchorage' where city_code = 'KVC' or airport_code = 'KVC';
update airport set timezone = 'America/Anchorage' where city_code = 'KNW' or airport_code = 'KNW';
update airport set timezone = 'America/Anchorage' where city_code = 'IGG' or airport_code = 'IGG';
update airport set timezone = 'Asia/Calcutta' where city_code = 'SLV' or airport_code = 'SLV';
update airport set timezone = 'Asia/Calcutta' where city_code = 'NDC' or airport_code = 'NDC';
update airport set timezone = 'Asia/Calcutta' where city_code = 'DHM' or airport_code = 'DHM';
update airport set timezone = 'Asia/Tehran' where city_code = 'CQD' or airport_code = 'CQD';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'EGM' or airport_code = 'EGM';
update airport set timezone = 'Europe/Madrid' where city_code = 'RGS' or airport_code = 'RGS';
update airport set timezone = 'Europe/Madrid' where city_code = 'LEN' or airport_code = 'LEN';
update airport set timezone = 'America/Anchorage' where city_code = 'DRG' or airport_code = 'DRG';
update airport set timezone = 'Asia/Samarkand' where city_code = 'AFS' or airport_code = 'AFS';
update airport set timezone = 'Europe/Istanbul' where city_code = 'MQM' or airport_code = 'MQM';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TCG' or airport_code = 'TCG';
update airport set timezone = 'America/Guayaquil' where city_code = 'LGQ' or airport_code = 'LGQ';
update airport set timezone = 'Asia/Tehran' where city_code = 'PFQ' or airport_code = 'PFQ';
update airport set timezone = 'Asia/Tehran' where city_code = 'IIL' or airport_code = 'IIL';
update airport set timezone = 'Asia/Tehran' where city_code = 'GBT' or airport_code = 'GBT';
update airport set timezone = 'Asia/Tehran' where city_code = 'ACP' or airport_code = 'ACP';
update airport set timezone = 'Asia/Manila' where city_code = 'TBH' or airport_code = 'TBH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WUZ' or airport_code = 'WUZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HMI' or airport_code = 'HMI';
update airport set timezone = 'America/Anchorage' where city_code = 'SDP' or airport_code = 'SDP';
update airport set timezone = 'Asia/Calcutta' where city_code = 'GOP' or airport_code = 'GOP';
update airport set timezone = 'America/Bogota' where city_code = 'ACR' or airport_code = 'ACR';
update airport set timezone = 'America/New_York' where city_code = 'HGR' or airport_code = 'HGR';
update airport set timezone = 'America/Vancouver' where city_code = 'QBC' or airport_code = 'QBC';
update airport set timezone = 'Europe/Stockholm' where city_code = 'PJA' or airport_code = 'PJA';
update airport set timezone = 'America/Anchorage' where city_code = 'KPC' or airport_code = 'KPC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GVR' or airport_code = 'GVR';
update airport set timezone = 'Europe/Moscow' where city_code = 'KVK' or airport_code = 'KVK';
update airport set timezone = 'Asia/Manila' where city_code = 'CYZ' or airport_code = 'CYZ';
update airport set timezone = 'America/Costa_Rica' where city_code = 'TMU' or airport_code = 'TMU';
update airport set timezone = 'America/Costa_Rica' where city_code = 'FON' or airport_code = 'FON';
update airport set timezone = 'Africa/Lagos' where city_code = 'QOW' or airport_code = 'QOW';
update airport set timezone = 'America/Anchorage' where city_code = 'ARC' or airport_code = 'ARC';
update airport set timezone = 'America/Toronto' where city_code = 'YTQ' or airport_code = 'YTQ';
update airport set timezone = 'America/Toronto' where city_code = 'YPX' or airport_code = 'YPX';
update airport set timezone = 'Asia/Manila' where city_code = 'OMC' or airport_code = 'OMC';
update airport set timezone = 'America/Anchorage' where city_code = 'WTK' or airport_code = 'WTK';
update airport set timezone = 'America/Anchorage' where city_code = 'SVA' or airport_code = 'SVA';
update airport set timezone = 'America/Anchorage' where city_code = 'SHH' or airport_code = 'SHH';
update airport set timezone = 'America/Anchorage' where city_code = 'RBY' or airport_code = 'RBY';
update airport set timezone = 'America/Anchorage' where city_code = 'PHO' or airport_code = 'PHO';
update airport set timezone = 'America/Anchorage' where city_code = 'MYU' or airport_code = 'MYU';
update airport set timezone = 'America/Anchorage' where city_code = 'KVL' or airport_code = 'KVL';
update airport set timezone = 'America/Anchorage' where city_code = 'KSM' or airport_code = 'KSM';
update airport set timezone = 'America/Anchorage' where city_code = 'KAL' or airport_code = 'KAL';
update airport set timezone = 'America/Anchorage' where city_code = 'HPB' or airport_code = 'HPB';
update airport set timezone = 'America/Anchorage' where city_code = 'GAM' or airport_code = 'GAM';
update airport set timezone = 'America/Anchorage' where city_code = 'ATK' or airport_code = 'ATK';
update airport set timezone = 'America/Anchorage' where city_code = 'ANV' or airport_code = 'ANV';
update airport set timezone = 'America/Anchorage' where city_code = 'AKP' or airport_code = 'AKP';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AAT' or airport_code = 'AAT';
update airport set timezone = 'Asia/Rangoon' where city_code = 'ELA' or airport_code = 'ELA';
update airport set timezone = 'Arctic/Longyearbyen' where city_code = 'ZXB' or airport_code = 'ZXB';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HHA' or airport_code = 'HHA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NZH' or airport_code = 'NZH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WUA' or airport_code = 'WUA';
update airport set timezone = 'America/Chicago' where city_code = 'GYY' or airport_code = 'GYY';
update airport set timezone = 'America/Chicago' where city_code = 'BRD' or airport_code = 'BRD';
update airport set timezone = 'America/New_York' where city_code = 'LWB' or airport_code = 'LWB';
update airport set timezone = 'America/New_York' where city_code = 'PGV' or airport_code = 'PGV';
update airport set timezone = 'America/Anchorage' where city_code = 'CYF' or airport_code = 'CYF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OXR' or airport_code = 'OXR';
update airport set timezone = 'America/Chicago' where city_code = 'BKG' or airport_code = 'BKG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TEN' or airport_code = 'TEN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KNC' or airport_code = 'KNC';
update airport set timezone = 'America/New_York' where city_code = 'ZBP' or airport_code = 'ZBP';
update airport set timezone = 'America/New_York' where city_code = 'ZYP' or airport_code = 'ZYP';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'NIU' or airport_code = 'NIU';
update airport set timezone = 'America/New_York' where city_code = 'SCH' or airport_code = 'SCH';
update airport set timezone = 'Europe/Moscow' where city_code = 'NBC' or airport_code = 'NBC';
update airport set timezone = 'Africa/Lagos' where city_code = 'QRW' or airport_code = 'QRW';
update airport set timezone = 'Europe/Berlin' where city_code = 'LGO' or airport_code = 'LGO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'FNE' or airport_code = 'FNE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ITK' or airport_code = 'ITK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ONB' or airport_code = 'ONB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TPI' or airport_code = 'TPI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AGL' or airport_code = 'AGL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WTP' or airport_code = 'WTP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AWB' or airport_code = 'AWB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TFM' or airport_code = 'TFM';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'NLP' or airport_code = 'NLP';
update airport set timezone = 'Europe/Kiev' where city_code = 'CKC' or airport_code = 'CKC';
update airport set timezone = 'America/New_York' where city_code = 'UST' or airport_code = 'UST';
update airport set timezone = 'Europe/Kiev' where city_code = 'NLV' or airport_code = 'NLV';
update airport set timezone = 'Asia/Katmandu' where city_code = 'RHP' or airport_code = 'RHP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'STS' or airport_code = 'STS';
update airport set timezone = 'America/New_York' where city_code = 'ISM' or airport_code = 'ISM';
update airport set timezone = 'America/New_York' where city_code = 'LCQ' or airport_code = 'LCQ';
update airport set timezone = 'America/Denver' where city_code = 'LGU' or airport_code = 'LGU';
update airport set timezone = 'America/Denver' where city_code = 'BMC' or airport_code = 'BMC';
update airport set timezone = 'America/Denver' where city_code = 'MLD' or airport_code = 'MLD';
update airport set timezone = 'America/Denver' where city_code = 'ASE' or airport_code = 'ASE';
update airport set timezone = 'America/New_York' where city_code = 'HHH' or airport_code = 'HHH';
update airport set timezone = 'Europe/Moscow' where city_code = 'ULV' or airport_code = 'ULV';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'GSS' or airport_code = 'GSS';
update airport set timezone = 'America/New_York' where city_code = 'ZFV' or airport_code = 'ZFV';
update airport set timezone = 'America/Chicago' where city_code = 'BWD' or airport_code = 'BWD';
update airport set timezone = 'America/Chicago' where city_code = 'LXY' or airport_code = 'LXY';
update airport set timezone = 'America/Chicago' where city_code = 'ERV' or airport_code = 'ERV';
update airport set timezone = 'America/New_York' where city_code = 'GED' or airport_code = 'GED';
update airport set timezone = 'America/Vancouver' where city_code = 'ZSW' or airport_code = 'ZSW';
update airport set timezone = 'America/Chicago' where city_code = 'GBN' or airport_code = 'GBN';
update airport set timezone = 'America/Chicago' where city_code = 'HYS' or airport_code = 'HYS';
update airport set timezone = 'America/Chicago' where city_code = 'SUS' or airport_code = 'SUS';
update airport set timezone = 'America/Chicago' where city_code = 'LYU' or airport_code = 'LYU';
update airport set timezone = 'America/Chicago' where city_code = 'GPZ' or airport_code = 'GPZ';
update airport set timezone = 'America/Chicago' where city_code = 'TVF' or airport_code = 'TVF';
update airport set timezone = 'America/Chicago' where city_code = 'EGV' or airport_code = 'EGV';
update airport set timezone = 'America/Chicago' where city_code = 'ARV' or airport_code = 'ARV';
update airport set timezone = 'America/Chicago' where city_code = 'IKV' or airport_code = 'IKV';
update airport set timezone = 'America/Winnipeg' where city_code = 'YBV' or airport_code = 'YBV';
update airport set timezone = 'America/Chicago' where city_code = 'NGP' or airport_code = 'NGP';
update airport set timezone = 'America/Vancouver' where city_code = 'YPI' or airport_code = 'YPI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'AVX' or airport_code = 'AVX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MHV' or airport_code = 'MHV';
update airport set timezone = 'Europe/Zurich' where city_code = 'ZIN' or airport_code = 'ZIN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'KEH' or airport_code = 'KEH';
update airport set timezone = 'America/Belize' where city_code = 'CZH' or airport_code = 'CZH';
update airport set timezone = 'Europe/Dublin' where city_code = 'INQ' or airport_code = 'INQ';
update airport set timezone = 'Asia/Omsk' where city_code = 'SWT' or airport_code = 'SWT';
update airport set timezone = 'America/Chicago' where city_code = 'HUT' or airport_code = 'HUT';
update airport set timezone = 'Asia/Kabul' where city_code = 'BPM' or airport_code = 'BPM';
update airport set timezone = 'America/Denver' where city_code = 'EGA' or airport_code = 'EGA';
update airport set timezone = 'Europe/Moscow' where city_code = 'GDZ' or airport_code = 'GDZ';
update airport set timezone = 'America/Chicago' where city_code = 'STJ' or airport_code = 'STJ';
update airport set timezone = 'America/New_York' where city_code = 'ZRT' or airport_code = 'ZRT';
update airport set timezone = 'America/New_York' where city_code = 'ZTF' or airport_code = 'ZTF';
update airport set timezone = 'America/New_York' where city_code = 'ZRP' or airport_code = 'ZRP';
update airport set timezone = 'Europe/Berlin' where city_code = 'NDZ' or airport_code = 'NDZ';
update airport set timezone = 'America/Chicago' where city_code = 'VOK' or airport_code = 'VOK';
update airport set timezone = 'America/New_York' where city_code = 'BFT' or airport_code = 'BFT';
update airport set timezone = 'Europe/Istanbul' where city_code = 'UAB' or airport_code = 'UAB';
update airport set timezone = 'America/Denver' where city_code = 'GUC' or airport_code = 'GUC';
update airport set timezone = 'Asia/Chongqing' where city_code = 'SIA' or airport_code = 'SIA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TOA' or airport_code = 'TOA';
update airport set timezone = 'America/New_York' where city_code = 'MBL' or airport_code = 'MBL';
update airport set timezone = 'America/New_York' where city_code = 'PGD' or airport_code = 'PGD';
update airport set timezone = 'America/Phoenix' where city_code = 'JGC' or airport_code = 'JGC';
update airport set timezone = 'America/New_York' where city_code = 'WFK' or airport_code = 'WFK';
update airport set timezone = 'America/New_York' where city_code = 'JHW' or airport_code = 'JHW';
update airport set timezone = 'America/Toronto' where city_code = 'YTM' or airport_code = 'YTM';
update airport set timezone = 'America/New_York' where city_code = 'SME' or airport_code = 'SME';
update airport set timezone = 'America/New_York' where city_code = 'SHD' or airport_code = 'SHD';
update airport set timezone = 'America/Chicago' where city_code = 'DVL' or airport_code = 'DVL';
update airport set timezone = 'America/Denver' where city_code = 'DIK' or airport_code = 'DIK';
update airport set timezone = 'America/Denver' where city_code = 'SDY' or airport_code = 'SDY';
update airport set timezone = 'America/Denver' where city_code = 'CDR' or airport_code = 'CDR';
update airport set timezone = 'America/Denver' where city_code = 'AIA' or airport_code = 'AIA';
update airport set timezone = 'America/Chicago' where city_code = 'MCK' or airport_code = 'MCK';
update airport set timezone = 'America/New_York' where city_code = 'MTH' or airport_code = 'MTH';
update airport set timezone = 'America/Denver' where city_code = 'GDV' or airport_code = 'GDV';
update airport set timezone = 'America/Denver' where city_code = 'OLF' or airport_code = 'OLF';
update airport set timezone = 'America/Denver' where city_code = 'WYS' or airport_code = 'WYS';
update airport set timezone = 'America/Denver' where city_code = 'ALS' or airport_code = 'ALS';
update airport set timezone = 'America/Denver' where city_code = 'CNY' or airport_code = 'CNY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ELY' or airport_code = 'ELY';
update airport set timezone = 'America/Denver' where city_code = 'VEL' or airport_code = 'VEL';
update airport set timezone = 'America/Denver' where city_code = 'SRR' or airport_code = 'SRR';
update airport set timezone = 'America/Phoenix' where city_code = 'SOW' or airport_code = 'SOW';
update airport set timezone = 'America/Denver' where city_code = 'MYL' or airport_code = 'MYL';
update airport set timezone = 'America/Denver' where city_code = 'SMN' or airport_code = 'SMN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MMH' or airport_code = 'MMH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FRD' or airport_code = 'FRD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ESD' or airport_code = 'ESD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OTS' or airport_code = 'OTS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'AST' or airport_code = 'AST';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ONP' or airport_code = 'ONP';
update airport set timezone = 'America/Anchorage' where city_code = 'EMK' or airport_code = 'EMK';
update airport set timezone = 'America/Anchorage' where city_code = 'UNK' or airport_code = 'UNK';
update airport set timezone = 'America/Anchorage' where city_code = 'UUK' or airport_code = 'UUK';
update airport set timezone = 'America/Anchorage' where city_code = 'SHX' or airport_code = 'SHX';
update airport set timezone = 'America/Anchorage' where city_code = 'CHU' or airport_code = 'CHU';
update airport set timezone = 'America/Anchorage' where city_code = 'NUI' or airport_code = 'NUI';
update airport set timezone = 'America/Anchorage' where city_code = 'EEK' or airport_code = 'EEK';
update airport set timezone = 'America/Anchorage' where city_code = 'KUK' or airport_code = 'KUK';
update airport set timezone = 'America/Anchorage' where city_code = 'KWT' or airport_code = 'KWT';
update airport set timezone = 'America/Anchorage' where city_code = 'KWK' or airport_code = 'KWK';
update airport set timezone = 'America/Anchorage' where city_code = 'MLL' or airport_code = 'MLL';
update airport set timezone = 'America/Anchorage' where city_code = 'RSH' or airport_code = 'RSH';
update airport set timezone = 'America/Anchorage' where city_code = 'WTL' or airport_code = 'WTL';
update airport set timezone = 'America/Anchorage' where city_code = 'KEK' or airport_code = 'KEK';
update airport set timezone = 'America/Anchorage' where city_code = 'KGK' or airport_code = 'KGK';
update airport set timezone = 'America/Anchorage' where city_code = 'KLL' or airport_code = 'KLL';
update airport set timezone = 'America/Anchorage' where city_code = 'KMO' or airport_code = 'KMO';
update airport set timezone = 'America/Anchorage' where city_code = 'TWA' or airport_code = 'TWA';
update airport set timezone = 'America/Anchorage' where city_code = 'CIK' or airport_code = 'CIK';
update airport set timezone = 'America/Anchorage' where city_code = 'EAA' or airport_code = 'EAA';
update airport set timezone = 'America/Anchorage' where city_code = 'HUS' or airport_code = 'HUS';
update airport set timezone = 'America/Anchorage' where city_code = 'HSL' or airport_code = 'HSL';
update airport set timezone = 'America/Anchorage' where city_code = 'LIV' or airport_code = 'LIV';
update airport set timezone = 'America/Anchorage' where city_code = 'MNT' or airport_code = 'MNT';
update airport set timezone = 'America/Anchorage' where city_code = 'NUL' or airport_code = 'NUL';
update airport set timezone = 'America/Anchorage' where city_code = 'RMP' or airport_code = 'RMP';
update airport set timezone = 'America/Anchorage' where city_code = 'TAL' or airport_code = 'TAL';
update airport set timezone = 'America/Anchorage' where city_code = 'VEE' or airport_code = 'VEE';
update airport set timezone = 'America/Anchorage' where city_code = 'WBQ' or airport_code = 'WBQ';
update airport set timezone = 'America/Anchorage' where city_code = 'CEM' or airport_code = 'CEM';
update airport set timezone = 'America/Anchorage' where city_code = 'SHG' or airport_code = 'SHG';
update airport set timezone = 'America/Anchorage' where city_code = 'KBC' or airport_code = 'KBC';
update airport set timezone = 'America/Anchorage' where city_code = 'CXF' or airport_code = 'CXF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'IYK' or airport_code = 'IYK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VIS' or airport_code = 'VIS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MCE' or airport_code = 'MCE';
update airport set timezone = 'America/Montevideo' where city_code = 'CYR' or airport_code = 'CYR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CPQ' or airport_code = 'CPQ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'TWB' or airport_code = 'TWB';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'AYK' or airport_code = 'AYK';
update airport set timezone = 'America/Anchorage' where city_code = 'AGN' or airport_code = 'AGN';
update airport set timezone = 'America/Anchorage' where city_code = 'ELV' or airport_code = 'ELV';
update airport set timezone = 'America/Anchorage' where city_code = 'TKE' or airport_code = 'TKE';
update airport set timezone = 'America/Anchorage' where city_code = 'PEC' or airport_code = 'PEC';
update airport set timezone = 'America/Anchorage' where city_code = 'CYM' or airport_code = 'CYM';
update airport set timezone = 'America/Anchorage' where city_code = 'FNR' or airport_code = 'FNR';
update airport set timezone = 'America/Anchorage' where city_code = 'EXI' or airport_code = 'EXI';
update airport set timezone = 'America/Anchorage' where city_code = 'HNH' or airport_code = 'HNH';
update airport set timezone = 'America/Anchorage' where city_code = 'AFE' or airport_code = 'AFE';
update airport set timezone = 'America/Anchorage' where city_code = 'CGA' or airport_code = 'CGA';
update airport set timezone = 'America/Anchorage' where city_code = 'HYL' or airport_code = 'HYL';
update airport set timezone = 'America/Anchorage' where city_code = 'MTM' or airport_code = 'MTM';
update airport set timezone = 'America/Anchorage' where city_code = 'KTB' or airport_code = 'KTB';
update airport set timezone = 'America/Anchorage' where city_code = 'HYG' or airport_code = 'HYG';
update airport set timezone = 'America/Vancouver' where city_code = 'WHD' or airport_code = 'WHD';
update airport set timezone = 'America/Anchorage' where city_code = 'KPB' or airport_code = 'KPB';
update airport set timezone = 'America/Anchorage' where city_code = 'PPV' or airport_code = 'PPV';
update airport set timezone = 'America/Anchorage' where city_code = 'WWP' or airport_code = 'WWP';
update airport set timezone = 'America/Anchorage' where city_code = 'KCQ' or airport_code = 'KCQ';
update airport set timezone = 'America/Anchorage' where city_code = 'EGX' or airport_code = 'EGX';
update airport set timezone = 'America/Anchorage' where city_code = 'KCL' or airport_code = 'KCL';
update airport set timezone = 'America/Anchorage' where city_code = 'KBW' or airport_code = 'KBW';
update airport set timezone = 'America/Anchorage' where city_code = 'KPV' or airport_code = 'KPV';
update airport set timezone = 'America/Anchorage' where city_code = 'PIP' or airport_code = 'PIP';
update airport set timezone = 'America/Anchorage' where city_code = 'WSN' or airport_code = 'WSN';
update airport set timezone = 'America/Anchorage' where city_code = 'AKK' or airport_code = 'AKK';
update airport set timezone = 'America/Anchorage' where city_code = 'KYK' or airport_code = 'KYK';
update airport set timezone = 'America/Anchorage' where city_code = 'KLN' or airport_code = 'KLN';
update airport set timezone = 'America/Anchorage' where city_code = 'OLH' or airport_code = 'OLH';
update airport set timezone = 'America/Anchorage' where city_code = 'KOZ' or airport_code = 'KOZ';
update airport set timezone = 'America/Anchorage' where city_code = 'ORI' or airport_code = 'ORI';
update airport set timezone = 'America/Anchorage' where city_code = 'ALZ' or airport_code = 'ALZ';
update airport set timezone = 'America/Anchorage' where city_code = 'AOS' or airport_code = 'AOS';
update airport set timezone = 'America/Anchorage' where city_code = 'KKB' or airport_code = 'KKB';
update airport set timezone = 'America/Anchorage' where city_code = 'KMY' or airport_code = 'KMY';
update airport set timezone = 'America/Anchorage' where city_code = 'KOY' or airport_code = 'KOY';
update airport set timezone = 'America/Anchorage' where city_code = 'KPY' or airport_code = 'KPY';
update airport set timezone = 'America/Anchorage' where city_code = 'KPR' or airport_code = 'KPR';
update airport set timezone = 'America/Anchorage' where city_code = 'SYB' or airport_code = 'SYB';
update airport set timezone = 'America/Anchorage' where city_code = 'WSJ' or airport_code = 'WSJ';
update airport set timezone = 'America/Anchorage' where city_code = 'KWP' or airport_code = 'KWP';
update airport set timezone = 'America/Anchorage' where city_code = 'KZB' or airport_code = 'KZB';
update airport set timezone = 'America/Anchorage' where city_code = 'ABL' or airport_code = 'ABL';
update airport set timezone = 'America/Anchorage' where city_code = 'BKC' or airport_code = 'BKC';
update airport set timezone = 'America/Anchorage' where city_code = 'IAN' or airport_code = 'IAN';
update airport set timezone = 'America/Anchorage' where city_code = 'OBU' or airport_code = 'OBU';
update airport set timezone = 'America/Anchorage' where city_code = 'ORV' or airport_code = 'ORV';
update airport set timezone = 'America/Anchorage' where city_code = 'WLK' or airport_code = 'WLK';
update airport set timezone = 'America/Anchorage' where city_code = 'KTS' or airport_code = 'KTS';
update airport set timezone = 'America/Anchorage' where city_code = 'ELI' or airport_code = 'ELI';
update airport set timezone = 'America/Anchorage' where city_code = 'GLV' or airport_code = 'GLV';
update airport set timezone = 'America/Anchorage' where city_code = 'TLA' or airport_code = 'TLA';
update airport set timezone = 'America/Anchorage' where city_code = 'WAA' or airport_code = 'WAA';
update airport set timezone = 'America/Anchorage' where city_code = 'WMO' or airport_code = 'WMO';
update airport set timezone = 'America/Anchorage' where city_code = 'CIL' or airport_code = 'CIL';
update airport set timezone = 'America/Anchorage' where city_code = 'KKA' or airport_code = 'KKA';
update airport set timezone = 'America/Anchorage' where city_code = 'SMK' or airport_code = 'SMK';
update airport set timezone = 'America/Anchorage' where city_code = 'SKK' or airport_code = 'SKK';
update airport set timezone = 'America/Anchorage' where city_code = 'WBB' or airport_code = 'WBB';
update airport set timezone = 'America/Anchorage' where city_code = 'TNC' or airport_code = 'TNC';
update airport set timezone = 'America/Anchorage' where city_code = 'AKB' or airport_code = 'AKB';
update airport set timezone = 'America/Anchorage' where city_code = 'IKO' or airport_code = 'IKO';
update airport set timezone = 'America/Anchorage' where city_code = 'ICY' or airport_code = 'ICY';
update airport set timezone = 'America/Anchorage' where city_code = 'CYT' or airport_code = 'CYT';
update airport set timezone = 'America/Anchorage' where city_code = 'AUK' or airport_code = 'AUK';
update airport set timezone = 'America/Anchorage' where city_code = 'SXP' or airport_code = 'SXP';
update airport set timezone = 'America/Anchorage' where city_code = 'KPN' or airport_code = 'KPN';
update airport set timezone = 'America/Anchorage' where city_code = 'KFP' or airport_code = 'KFP';
update airport set timezone = 'America/Anchorage' where city_code = 'NLG' or airport_code = 'NLG';
update airport set timezone = 'America/Anchorage' where city_code = 'PML' or airport_code = 'PML';
update airport set timezone = 'America/Anchorage' where city_code = 'KLW' or airport_code = 'KLW';
update airport set timezone = 'America/Anchorage' where city_code = 'KWN' or airport_code = 'KWN';
update airport set timezone = 'America/Anchorage' where city_code = 'KOT' or airport_code = 'KOT';
update airport set timezone = 'America/Anchorage' where city_code = 'KYU' or airport_code = 'KYU';
update airport set timezone = 'America/Anchorage' where city_code = 'SCM' or airport_code = 'SCM';
update airport set timezone = 'America/Anchorage' where city_code = 'NNL' or airport_code = 'NNL';
update airport set timezone = 'America/Anchorage' where city_code = 'PDB' or airport_code = 'PDB';
update airport set timezone = 'America/Anchorage' where city_code = 'NUP' or airport_code = 'NUP';
update airport set timezone = 'America/Anchorage' where city_code = 'KKH' or airport_code = 'KKH';
update airport set timezone = 'America/Anchorage' where city_code = 'NIB' or airport_code = 'NIB';
update airport set timezone = 'America/Anchorage' where city_code = 'TCT' or airport_code = 'TCT';
update airport set timezone = 'America/Anchorage' where city_code = 'PQS' or airport_code = 'PQS';
update airport set timezone = 'America/Anchorage' where city_code = 'AKI' or airport_code = 'AKI';
update airport set timezone = 'America/Anchorage' where city_code = 'TLT' or airport_code = 'TLT';
update airport set timezone = 'America/Anchorage' where city_code = 'KGX' or airport_code = 'KGX';
update airport set timezone = 'America/Anchorage' where city_code = 'AIN' or airport_code = 'AIN';
update airport set timezone = 'America/Cordoba' where city_code = 'APZ' or airport_code = 'APZ';
update airport set timezone = 'America/Cordoba' where city_code = 'RDS' or airport_code = 'RDS';
update airport set timezone = 'America/Cordoba' where city_code = 'OLN' or airport_code = 'OLN';
update airport set timezone = 'America/Cordoba' where city_code = 'RYO' or airport_code = 'RYO';
update airport set timezone = 'America/Santiago' where city_code = 'PNT' or airport_code = 'PNT';
update airport set timezone = 'America/Cordoba' where city_code = 'CVI' or airport_code = 'CVI';
update airport set timezone = 'America/Cordoba' where city_code = 'SGV' or airport_code = 'SGV';
update airport set timezone = 'America/Cordoba' where city_code = 'IGB' or airport_code = 'IGB';
update airport set timezone = 'America/Cordoba' where city_code = 'ELX' or airport_code = 'ELX';
update airport set timezone = 'America/Anchorage' where city_code = 'NCN' or airport_code = 'NCN';
update airport set timezone = 'America/Anchorage' where city_code = 'CZN' or airport_code = 'CZN';
update airport set timezone = 'America/Anchorage' where city_code = '6K8' or airport_code = '6K8';
update airport set timezone = 'America/Anchorage' where city_code = 'IRC' or airport_code = 'IRC';
update airport set timezone = 'America/Anchorage' where city_code = 'KCC' or airport_code = 'KCC';
update airport set timezone = 'America/Anchorage' where city_code = 'CKD' or airport_code = 'CKD';
update airport set timezone = 'America/Anchorage' where city_code = 'RDV' or airport_code = 'RDV';
update airport set timezone = 'America/Anchorage' where city_code = 'SLQ' or airport_code = 'SLQ';
update airport set timezone = 'America/Anchorage' where city_code = 'SRV' or airport_code = 'SRV';
update airport set timezone = 'America/Anchorage' where city_code = 'HKB' or airport_code = 'HKB';
update airport set timezone = 'America/Anchorage' where city_code = 'KAE' or airport_code = 'KAE';
update airport set timezone = 'America/Anchorage' where city_code = 'AQC' or airport_code = 'AQC';
update airport set timezone = 'America/Anchorage' where city_code = 'MHM' or airport_code = 'MHM';
update airport set timezone = 'America/Anchorage' where city_code = 'MLY' or airport_code = 'MLY';
update airport set timezone = 'America/Anchorage' where city_code = 'STG' or airport_code = 'STG';
update airport set timezone = 'America/Anchorage' where city_code = 'TEK' or airport_code = 'TEK';
update airport set timezone = 'America/Anchorage' where city_code = 'WFB' or airport_code = 'WFB';
update airport set timezone = 'America/Halifax' where city_code = 'YSO' or airport_code = 'YSO';
update airport set timezone = 'America/Toronto' where city_code = 'YWB' or airport_code = 'YWB';
update airport set timezone = 'America/Toronto' where city_code = 'YTF' or airport_code = 'YTF';
update airport set timezone = 'America/Toronto' where city_code = 'YGV' or airport_code = 'YGV';
update airport set timezone = 'America/Toronto' where city_code = 'YXK' or airport_code = 'YXK';
update airport set timezone = 'America/Winnipeg' where city_code = 'XTL' or airport_code = 'XTL';
update airport set timezone = 'America/Winnipeg' where city_code = 'XLB' or airport_code = 'XLB';
update airport set timezone = 'America/Winnipeg' where city_code = 'XSI' or airport_code = 'XSI';
update airport set timezone = 'America/Winnipeg' where city_code = 'YBT' or airport_code = 'YBT';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZGR' or airport_code = 'ZGR';
update airport set timezone = 'America/Winnipeg' where city_code = 'YCR' or airport_code = 'YCR';
update airport set timezone = 'America/Winnipeg' where city_code = 'YRS' or airport_code = 'YRS';
update airport set timezone = 'America/Edmonton' where city_code = 'YOP' or airport_code = 'YOP';
update airport set timezone = 'America/Edmonton' where city_code = 'YBY' or airport_code = 'YBY';
update airport set timezone = 'America/Vancouver' where city_code = 'ZNA' or airport_code = 'ZNA';
update airport set timezone = 'America/Vancouver' where city_code = 'XQU' or airport_code = 'XQU';
update airport set timezone = 'America/Vancouver' where city_code = 'YJM' or airport_code = 'YJM';
update airport set timezone = 'America/Vancouver' where city_code = 'YDT' or airport_code = 'YDT';
update airport set timezone = 'America/Vancouver' where city_code = 'ZEL' or airport_code = 'ZEL';
update airport set timezone = 'America/Vancouver' where city_code = 'YHS' or airport_code = 'YHS';
update airport set timezone = 'America/Mazatlan' where city_code = 'PVP' or airport_code = 'PVP';
update airport set timezone = 'Europe/Brussels' where city_code = 'ZYR' or airport_code = 'ZYR';
update airport set timezone = 'America/Belize' where city_code = 'CYC' or airport_code = 'CYC';
update airport set timezone = 'America/Belize' where city_code = 'BGK' or airport_code = 'BGK';
update airport set timezone = 'America/Belize' where city_code = 'DGA' or airport_code = 'DGA';
update airport set timezone = 'America/Belize' where city_code = 'PLJ' or airport_code = 'PLJ';
update airport set timezone = 'America/Belize' where city_code = 'SJX' or airport_code = 'SJX';
update airport set timezone = 'America/Managua' where city_code = 'RNI' or airport_code = 'RNI';
update airport set timezone = 'America/Managua' where city_code = 'BZA' or airport_code = 'BZA';
update airport set timezone = 'America/Managua' where city_code = 'RFS' or airport_code = 'RFS';
update airport set timezone = 'America/Managua' where city_code = 'SIU' or airport_code = 'SIU';
update airport set timezone = 'America/Managua' where city_code = 'WSP' or airport_code = 'WSP';
update airport set timezone = 'America/Costa_Rica' where city_code = 'RIK' or airport_code = 'RIK';
update airport set timezone = 'Europe/Berlin' where city_code = 'FUS' or airport_code = 'FUS';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'COZ' or airport_code = 'COZ';
update airport set timezone = 'America/Jamaica' where city_code = 'NEG' or airport_code = 'NEG';
update airport set timezone = 'Europe/Berlin' where city_code = 'EBO' or airport_code = 'EBO';
update airport set timezone = 'Europe/Berlin' where city_code = 'KFB' or airport_code = 'KFB';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZMU' or airport_code = 'ZMU';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZAQ' or airport_code = 'ZAQ';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'RVR' or airport_code = 'RVR';
update airport set timezone = 'America/Cordoba' where city_code = 'RLO' or airport_code = 'RLO';
update airport set timezone = 'America/St_Thomas' where city_code = 'SSB' or airport_code = 'SSB';
update airport set timezone = 'America/Cordoba' where city_code = 'ARR' or airport_code = 'ARR';
update airport set timezone = 'America/Cordoba' where city_code = 'JSM' or airport_code = 'JSM';
update airport set timezone = 'America/La_Paz' where city_code = 'UYU' or airport_code = 'UYU';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZAU' or airport_code = 'ZAU';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZMA' or airport_code = 'ZMA';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZES' or airport_code = 'ZES';
update airport set timezone = 'America/La_Paz' where city_code = 'RBQ' or airport_code = 'RBQ';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'ABF' or airport_code = 'ABF';
update airport set timezone = 'America/Chicago' where city_code = 'CPS' or airport_code = 'CPS';
update airport set timezone = 'America/Paramaribo' where city_code = 'ABN' or airport_code = 'ABN';
update airport set timezone = 'America/Paramaribo' where city_code = 'BTO' or airport_code = 'BTO';
update airport set timezone = 'America/Paramaribo' where city_code = 'DOE' or airport_code = 'DOE';
update airport set timezone = 'America/Paramaribo' where city_code = 'DRJ' or airport_code = 'DRJ';
update airport set timezone = 'America/Paramaribo' where city_code = 'ICK' or airport_code = 'ICK';
update airport set timezone = 'America/Paramaribo' where city_code = 'OEM' or airport_code = 'OEM';
update airport set timezone = 'America/Paramaribo' where city_code = 'SMZ' or airport_code = 'SMZ';
update airport set timezone = 'America/Paramaribo' where city_code = 'TOT' or airport_code = 'TOT';
update airport set timezone = 'America/Paramaribo' where city_code = 'AGI' or airport_code = 'AGI';
update airport set timezone = 'America/Guyana' where city_code = 'KIA' or airport_code = 'KIA';
update airport set timezone = 'America/Costa_Rica' where city_code = 'CSC' or airport_code = 'CSC';
update airport set timezone = 'America/Guyana' where city_code = 'ORJ' or airport_code = 'ORJ';
update airport set timezone = 'America/Guyana' where city_code = 'NAI' or airport_code = 'NAI';
update airport set timezone = 'America/Guyana' where city_code = 'IMB' or airport_code = 'IMB';
update airport set timezone = 'America/Guyana' where city_code = 'KAR' or airport_code = 'KAR';
update airport set timezone = 'America/Guyana' where city_code = 'USI' or airport_code = 'USI';
update airport set timezone = 'America/Guyana' where city_code = 'MHA' or airport_code = 'MHA';
update airport set timezone = 'America/Asuncion' where city_code = 'PJC' or airport_code = 'PJC';
update airport set timezone = 'America/Bogota' where city_code = 'ACD' or airport_code = 'ACD';
update airport set timezone = 'America/Bogota' where city_code = 'RVE' or airport_code = 'RVE';
update airport set timezone = 'America/Bogota' where city_code = 'LCR' or airport_code = 'LCR';
update airport set timezone = 'America/Bogota' where city_code = 'LMC' or airport_code = 'LMC';
update airport set timezone = 'America/Bogota' where city_code = 'VGZ' or airport_code = 'VGZ';
update airport set timezone = 'America/Bogota' where city_code = 'EBG' or airport_code = 'EBG';
update airport set timezone = 'America/Bogota' where city_code = 'CAQ' or airport_code = 'CAQ';
update airport set timezone = 'America/Bogota' where city_code = 'COG' or airport_code = 'COG';
update airport set timezone = 'America/Bogota' where city_code = 'TLU' or airport_code = 'TLU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CFB' or airport_code = 'CFB';
update airport set timezone = 'America/Campo_Grande' where city_code = 'OPS' or airport_code = 'OPS';
update airport set timezone = 'America/Fortaleza' where city_code = 'GRP' or airport_code = 'GRP';
update airport set timezone = 'America/Boa_Vista' where city_code = 'CMP' or airport_code = 'CMP';
update airport set timezone = 'America/Boa_Vista' where city_code = 'BVS' or airport_code = 'BVS';
update airport set timezone = 'America/Boa_Vista' where city_code = 'SFK' or airport_code = 'SFK';
update airport set timezone = 'America/Boa_Vista' where city_code = 'PIN' or airport_code = 'PIN';
update airport set timezone = 'America/Fortaleza' where city_code = 'BRA' or airport_code = 'BRA';
update airport set timezone = 'America/Campo_Grande' where city_code = 'STZ' or airport_code = 'STZ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'MQH' or airport_code = 'MQH';
update airport set timezone = 'America/Fortaleza' where city_code = 'AUX' or airport_code = 'AUX';
update airport set timezone = 'America/Boa_Vista' where city_code = 'NVP' or airport_code = 'NVP';
update airport set timezone = 'America/Campo_Grande' where city_code = 'LVR' or airport_code = 'LVR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'FRC' or airport_code = 'FRC';
update airport set timezone = 'America/Campo_Grande' where city_code = 'DOU' or airport_code = 'DOU';
update airport set timezone = 'America/Boa_Vista' where city_code = 'LBR' or airport_code = 'LBR';
update airport set timezone = 'America/Campo_Grande' where city_code = 'ROO' or airport_code = 'ROO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GPB' or airport_code = 'GPB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'JCB' or airport_code = 'JCB';
update airport set timezone = 'Europe/London' where city_code = 'ZXE' or airport_code = 'ZXE';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'RVD' or airport_code = 'RVD';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'AAX' or airport_code = 'AAX';
update airport set timezone = 'America/Boa_Vista' where city_code = 'MBZ' or airport_code = 'MBZ';
update airport set timezone = 'America/Boa_Vista' where city_code = 'RBB' or airport_code = 'RBB';
update airport set timezone = 'America/Boa_Vista' where city_code = 'CIZ' or airport_code = 'CIZ';
update airport set timezone = 'America/Boa_Vista' where city_code = 'BAZ' or airport_code = 'BAZ';
update airport set timezone = 'America/Campo_Grande' where city_code = 'DMT' or airport_code = 'DMT';
update airport set timezone = 'America/Fortaleza' where city_code = 'GNM' or airport_code = 'GNM';
update airport set timezone = 'Africa/Algiers' where city_code = 'QDJ' or airport_code = 'QDJ';
update airport set timezone = 'Africa/Luanda' where city_code = 'LBZ' or airport_code = 'LBZ';
update airport set timezone = 'Africa/Luanda' where city_code = 'KNP' or airport_code = 'KNP';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'AMC' or airport_code = 'AMC';
update airport set timezone = 'Africa/Cairo' where city_code = 'GSQ' or airport_code = 'GSQ';
update airport set timezone = 'America/New_York' where city_code = 'MRB' or airport_code = 'MRB';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'AWA' or airport_code = 'AWA';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'JIJ' or airport_code = 'JIJ';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'MKS' or airport_code = 'MKS';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'DBM' or airport_code = 'DBM';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'DBT' or airport_code = 'DBT';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'QHR' or airport_code = 'QHR';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'GOB' or airport_code = 'GOB';
update airport set timezone = 'Africa/Libreville' where city_code = 'MYB' or airport_code = 'MYB';
update airport set timezone = 'Africa/Nairobi' where city_code = 'MRE' or airport_code = 'MRE';
update airport set timezone = 'Africa/Juba' where city_code = 'RBX' or airport_code = 'RBX';
update airport set timezone = 'Africa/Monrovia' where city_code = 'CPA' or airport_code = 'CPA';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'AMY' or airport_code = 'AMY';
update airport set timezone = 'Asia/Tokyo' where city_code = 'UKY' or airport_code = 'UKY';
update airport set timezone = 'Africa/Maputo' where city_code = 'BZB' or airport_code = 'BZB';
update airport set timezone = 'Africa/Maputo' where city_code = 'BCW' or airport_code = 'BCW';
update airport set timezone = 'Africa/Maputo' where city_code = 'IBL' or airport_code = 'IBL';
update airport set timezone = 'Africa/Dakar' where city_code = 'MAX' or airport_code = 'MAX';
update airport set timezone = '\N' where city_code = 'BDI' or airport_code = 'BDI';
update airport set timezone = 'Africa/Khartoum' where city_code = 'WHF' or airport_code = 'WHF';
update airport set timezone = 'Africa/Tunis' where city_code = 'NBE' or airport_code = 'NBE';
update airport set timezone = 'Africa/Kampala' where city_code = 'PAF' or airport_code = 'PAF';
update airport set timezone = 'Europe/Istanbul' where city_code = 'HTY' or airport_code = 'HTY';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'RVV' or airport_code = 'RVV';
update airport set timezone = 'Asia/Chongqing' where city_code = 'FUO' or airport_code = 'FUO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HUZ' or airport_code = 'HUZ';
update airport set timezone = 'Europe/Madrid' where city_code = 'ILD' or airport_code = 'ILD';
update airport set timezone = 'America/Santiago' where city_code = 'WPR' or airport_code = 'WPR';
update airport set timezone = 'America/Toronto' where city_code = 'YMY' or airport_code = 'YMY';
update airport set timezone = 'America/Toronto' where city_code = 'YBZ' or airport_code = 'YBZ';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'BIU' or airport_code = 'BIU';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'GJR' or airport_code = 'GJR';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'SAK' or airport_code = 'SAK';
update airport set timezone = 'Europe/Dublin' where city_code = 'IIA' or airport_code = 'IIA';
update airport set timezone = 'Asia/Qyzylorda' where city_code = 'TDK' or airport_code = 'TDK';
update airport set timezone = 'Asia/Hovd' where city_code = 'ULG' or airport_code = 'ULG';
update airport set timezone = 'Europe/Paris' where city_code = 'XDB' or airport_code = 'XDB';
update airport set timezone = 'Europe/Moscow' where city_code = 'VGD' or airport_code = 'VGD';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'BVV' or airport_code = 'BVV';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'OHH' or airport_code = 'OHH';
update airport set timezone = 'Europe/Moscow' where city_code = 'LDG' or airport_code = 'LDG';
update airport set timezone = 'Europe/Madrid' where city_code = 'HSK' or airport_code = 'HSK';
update airport set timezone = 'Europe/Madrid' where city_code = 'CQM' or airport_code = 'CQM';
update airport set timezone = 'Asia/Baghdad' where city_code = 'NJF' or airport_code = 'NJF';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'QYI' or airport_code = 'QYI';
update airport set timezone = 'Europe/London' where city_code = 'CSA' or airport_code = 'CSA';
update airport set timezone = 'Europe/London' where city_code = 'COL' or airport_code = 'COL';
update airport set timezone = 'America/New_York' where city_code = 'RKH' or airport_code = 'RKH';
update airport set timezone = 'America/New_York' where city_code = 'AGC' or airport_code = 'AGC';
update airport set timezone = 'America/New_York' where city_code = 'NZC' or airport_code = 'NZC';
update airport set timezone = 'America/New_York' where city_code = 'FTY' or airport_code = 'FTY';
update airport set timezone = 'Europe/London' where city_code = 'TSO' or airport_code = 'TSO';
update airport set timezone = 'Asia/Kabul' where city_code = 'TII' or airport_code = 'TII';
update airport set timezone = 'Asia/Kabul' where city_code = 'ZAJ' or airport_code = 'ZAJ';
update airport set timezone = 'Asia/Kabul' where city_code = 'CCN' or airport_code = 'CCN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'FUG' or airport_code = 'FUG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LCX' or airport_code = 'LCX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'BSD' or airport_code = 'BSD';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ACX' or airport_code = 'ACX';
update airport set timezone = 'Asia/Macau' where city_code = 'XZM' or airport_code = 'XZM';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HZH' or airport_code = 'HZH';
update airport set timezone = 'America/New_York' where city_code = '60J' or airport_code = '60J';
update airport set timezone = 'America/New_York' where city_code = 'OSU' or airport_code = 'OSU';
update airport set timezone = 'America/Panama' where city_code = 'RSI' or airport_code = 'RSI';
update airport set timezone = 'America/Chicago' where city_code = 'ADS' or airport_code = 'ADS';
update airport set timezone = 'America/Chicago' where city_code = 'DTS' or airport_code = 'DTS';
update airport set timezone = 'America/New_York' where city_code = 'RBN' or airport_code = 'RBN';
update airport set timezone = 'Europe/Kiev' where city_code = 'KHE' or airport_code = 'KHE';
update airport set timezone = 'Pacific/Auckland' where city_code = 'SZS' or airport_code = 'SZS';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HJJ' or airport_code = 'HJJ';
update airport set timezone = 'America/Halifax' where city_code = 'YQI' or airport_code = 'YQI';
update airport set timezone = 'America/New_York' where city_code = 'ISO' or airport_code = 'ISO';
update airport set timezone = 'America/New_York' where city_code = 'FFA' or airport_code = 'FFA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LNJ' or airport_code = 'LNJ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'WNH' or airport_code = 'WNH';
update airport set timezone = 'America/Boa_Vista' where city_code = 'PLL' or airport_code = 'PLL';
update airport set timezone = 'America/Boa_Vista' where city_code = 'SJL' or airport_code = 'SJL';
update airport set timezone = 'America/Boa_Vista' where city_code = 'CKS' or airport_code = 'CKS';
update airport set timezone = 'America/Boa_Vista' where city_code = 'ITB' or airport_code = 'ITB';
update airport set timezone = 'Asia/Calcutta' where city_code = 'LTU' or airport_code = 'LTU';
update airport set timezone = '\N' where city_code = 'MWK' or airport_code = 'MWK';
update airport set timezone = '\N' where city_code = 'QFZ' or airport_code = 'QFZ';
update airport set timezone = 'Europe/Berlin' where city_code = 'QMZ' or airport_code = 'QMZ';
update airport set timezone = 'Europe/Berlin' where city_code = 'GWW' or airport_code = 'GWW';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZPQ' or airport_code = 'ZPQ';
update airport set timezone = 'Asia/Makassar' where city_code = 'TTR' or airport_code = 'TTR';
update airport set timezone = 'Asia/Tehran' where city_code = 'PGU' or airport_code = 'PGU';
update airport set timezone = 'Asia/Tehran' where city_code = 'YES' or airport_code = 'YES';
update airport set timezone = 'Asia/Baghdad' where city_code = 'OSB' or airport_code = 'OSB';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TJH' or airport_code = 'TJH';
update airport set timezone = 'Asia/Tokyo' where city_code = 'AXJ' or airport_code = 'AXJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KKX' or airport_code = 'KKX';
update airport set timezone = 'Asia/Tokyo' where city_code = 'AGJ' or airport_code = 'AGJ';
update airport set timezone = 'Asia/Pyongyang' where city_code = 'HAE' or airport_code = 'HAE';
update airport set timezone = '\N' where city_code = 'LAC' or airport_code = 'LAC';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'UGA' or airport_code = 'UGA';
update airport set timezone = 'Asia/Hovd' where city_code = 'ULO' or airport_code = 'ULO';
update airport set timezone = 'Asia/Manila' where city_code = 'BPR' or airport_code = 'BPR';
update airport set timezone = 'Asia/Manila' where city_code = 'LBX' or airport_code = 'LBX';
update airport set timezone = 'Asia/Colombo' where city_code = 'BJT' or airport_code = 'BJT';
update airport set timezone = 'Asia/Colombo' where city_code = 'DIW' or airport_code = 'DIW';
update airport set timezone = 'Asia/Dushanbe' where city_code = 'TJU' or airport_code = 'TJU';
update airport set timezone = 'Asia/Taipei' where city_code = 'CMJ' or airport_code = 'CMJ';
update airport set timezone = 'Asia/Ashgabat' where city_code = 'TAZ' or airport_code = 'TAZ';
update airport set timezone = 'Australia/Perth' where city_code = 'BWB' or airport_code = 'BWB';
update airport set timezone = 'Australia/Perth' where city_code = 'MWB' or airport_code = 'MWB';
update airport set timezone = 'Australia/Perth' where city_code = 'EXM' or airport_code = 'EXM';
update airport set timezone = 'Australia/Perth' where city_code = 'DRB' or airport_code = 'DRB';
update airport set timezone = 'Australia/Sydney' where city_code = 'WGE' or airport_code = 'WGE';
update airport set timezone = 'Australia/Darwin' where city_code = 'BRT' or airport_code = 'BRT';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DKI' or airport_code = 'DKI';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LZR' or airport_code = 'LZR';
update airport set timezone = 'Australia/Hobart' where city_code = 'HLT' or airport_code = 'HLT';
update airport set timezone = 'Australia/Perth' where city_code = 'HCQ' or airport_code = 'HCQ';
update airport set timezone = 'Australia/Perth' where city_code = 'FIZ' or airport_code = 'FIZ';
update airport set timezone = 'Australia/Perth' where city_code = 'RVT' or airport_code = 'RVT';
update airport set timezone = 'America/Denver' where city_code = 'PVU' or airport_code = 'PVU';
update airport set timezone = 'America/Denver' where city_code = 'SBS' or airport_code = 'SBS';
update airport set timezone = 'America/Denver' where city_code = 'DTA' or airport_code = 'DTA';
update airport set timezone = 'America/Denver' where city_code = 'RIF' or airport_code = 'RIF';
update airport set timezone = 'America/Denver' where city_code = 'PUC' or airport_code = 'PUC';
update airport set timezone = 'America/Denver' where city_code = 'LAM' or airport_code = 'LAM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BXS' or airport_code = 'BXS';
update airport set timezone = 'America/Phoenix' where city_code = 'HII' or airport_code = 'HII';
update airport set timezone = 'America/Phoenix' where city_code = 'INW' or airport_code = 'INW';
update airport set timezone = 'America/Phoenix' where city_code = 'DGL' or airport_code = 'DGL';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'MZK' or airport_code = 'MZK';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'AEA' or airport_code = 'AEA';
update airport set timezone = '\N' where city_code = 'AAK' or airport_code = 'AAK';
update airport set timezone = '\N' where city_code = 'KUC' or airport_code = 'KUC';
update airport set timezone = '\N' where city_code = 'AIS' or airport_code = 'AIS';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'TMN' or airport_code = 'TMN';
update airport set timezone = '\N' where city_code = 'BEZ' or airport_code = 'BEZ';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'NIG' or airport_code = 'NIG';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'BBG' or airport_code = 'BBG';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'MTK' or airport_code = 'MTK';
update airport set timezone = '\N' where city_code = 'MNK' or airport_code = 'MNK';
update airport set timezone = '\N' where city_code = 'NON' or airport_code = 'NON';
update airport set timezone = '\N' where city_code = 'TSU' or airport_code = 'TSU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BOT' or airport_code = 'BOT';
update airport set timezone = 'Pacific/Majuro' where city_code = 'IMI' or airport_code = 'IMI';
update airport set timezone = 'Pacific/Majuro' where city_code = 'TIC' or airport_code = 'TIC';
update airport set timezone = 'Pacific/Majuro' where city_code = 'EAL' or airport_code = 'EAL';
update airport set timezone = 'Pacific/Majuro' where city_code = 'LML' or airport_code = 'LML';
update airport set timezone = 'Pacific/Majuro' where city_code = 'AIC' or airport_code = 'AIC';
update airport set timezone = 'Pacific/Majuro' where city_code = 'EJT' or airport_code = 'EJT';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WTZ' or airport_code = 'WTZ';
update airport set timezone = 'Pacific/Auckland' where city_code = 'KTF' or airport_code = 'KTF';
update airport set timezone = 'Pacific/Palau' where city_code = 'C23' or airport_code = 'C23';
update airport set timezone = 'Pacific/Apia' where city_code = 'AAU' or airport_code = 'AAU';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'AFT' or airport_code = 'AFT';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'RNA' or airport_code = 'RNA';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'CHY' or airport_code = 'CHY';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'NNB' or airport_code = 'NNB';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'XYA' or airport_code = 'XYA';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'BPF' or airport_code = 'BPF';
update airport set timezone = 'America/New_York' where city_code = 'BOW' or airport_code = 'BOW';
update airport set timezone = 'Europe/Moscow' where city_code = 'KMW' or airport_code = 'KMW';
update airport set timezone = 'Pacific/Pago_Pago' where city_code = 'FTI' or airport_code = 'FTI';
update airport set timezone = 'Pacific/Pago_Pago' where city_code = 'OFU' or airport_code = 'OFU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LVK' or airport_code = 'LVK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MPI' or airport_code = 'MPI';
update airport set timezone = 'Africa/Windhoek' where city_code = 'GFY' or airport_code = 'GFY';
update airport set timezone = 'Africa/Windhoek' where city_code = 'NDU' or airport_code = 'NDU';
update airport set timezone = 'Asia/Tokyo' where city_code = 'BPU' or airport_code = 'BPU';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HRN' or airport_code = 'HRN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LYT' or airport_code = 'LYT';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ORS' or airport_code = 'ORS';
update airport set timezone = 'Europe/London' where city_code = 'QQP' or airport_code = 'QQP';
update airport set timezone = 'America/Godthab' where city_code = 'AGM' or airport_code = 'AGM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TRM' or airport_code = 'TRM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SMO' or airport_code = 'SMO';
update airport set timezone = 'America/Los_Angeles' where city_code = 'UDD' or airport_code = 'UDD';
update airport set timezone = 'America/Phoenix' where city_code = 'ZSY' or airport_code = 'ZSY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OLM' or airport_code = 'OLM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'DWA' or airport_code = 'DWA';
update airport set timezone = 'America/Denver' where city_code = 'RIL' or airport_code = 'RIL';
update airport set timezone = 'America/Denver' where city_code = 'SAA' or airport_code = 'SAA';
update airport set timezone = 'America/New_York' where city_code = 'PDK' or airport_code = 'PDK';
update airport set timezone = 'America/New_York' where city_code = 'BMG' or airport_code = 'BMG';
update airport set timezone = 'America/New_York' where city_code = 'SUA' or airport_code = 'SUA';
update airport set timezone = 'America/New_York' where city_code = 'MMU' or airport_code = 'MMU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'APC' or airport_code = 'APC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SDM' or airport_code = 'SDM';
update airport set timezone = 'America/New_York' where city_code = 'PHK' or airport_code = 'PHK';
update airport set timezone = 'Europe/Moscow' where city_code = 'KIE' or airport_code = 'KIE';
update airport set timezone = 'Europe/Moscow' where city_code = 'NEZ' or airport_code = 'NEZ';
update airport set timezone = 'America/Lima' where city_code = 'MFT' or airport_code = 'MFT';
update airport set timezone = 'America/Chicago' where city_code = 'ECP' or airport_code = 'ECP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SBD' or airport_code = 'SBD';
update airport set timezone = 'America/Fortaleza' where city_code = 'VAL' or airport_code = 'VAL';
update airport set timezone = 'America/Fortaleza' where city_code = 'MVF' or airport_code = 'MVF';
update airport set timezone = 'America/Fortaleza' where city_code = 'CAU' or airport_code = 'CAU';
update airport set timezone = 'Pacific/Wake' where city_code = 'AWK' or airport_code = 'AWK';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QNV' or airport_code = 'QNV';
update airport set timezone = 'Europe/Paris' where city_code = 'XPG' or airport_code = 'XPG';
update airport set timezone = 'Europe/Paris' where city_code = 'XGB' or airport_code = 'XGB';
update airport set timezone = 'Europe/Paris' where city_code = 'XSH' or airport_code = 'XSH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SQL' or airport_code = 'SQL';
update airport set timezone = 'Europe/Warsaw' where city_code = 'OSZ' or airport_code = 'OSZ';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'LEY' or airport_code = 'LEY';
update airport set timezone = 'America/New_York' where city_code = 'RWI' or airport_code = 'RWI';
update airport set timezone = 'America/Anchorage' where city_code = 'SXQ' or airport_code = 'SXQ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SEE' or airport_code = 'SEE';
update airport set timezone = 'America/Guayaquil' where city_code = 'LTX' or airport_code = 'LTX';
update airport set timezone = 'Europe/London' where city_code = 'STP' or airport_code = 'STP';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'ZYA' or airport_code = 'ZYA';
update airport set timezone = 'Africa/Freetown' where city_code = 'JMY' or airport_code = 'JMY';
update airport set timezone = 'Asia/Saigon' where city_code = 'PHA' or airport_code = 'PHA';
update airport set timezone = 'Asia/Saigon' where city_code = 'SQH' or airport_code = 'SQH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TKF' or airport_code = 'TKF';
update airport set timezone = 'Europe/Paris' where city_code = 'FRJ' or airport_code = 'FRJ';
update airport set timezone = 'Australia/Hobart' where city_code = 'GEX' or airport_code = 'GEX';
update airport set timezone = 'Europe/Berlin' where city_code = 'QPP' or airport_code = 'QPP';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'ZYA' or airport_code = 'ZYA';
update airport set timezone = 'America/New_York' where city_code = 'MGR' or airport_code = 'MGR';
update airport set timezone = 'America/New_York' where city_code = 'RYY' or airport_code = 'RYY';
update airport set timezone = 'America/New_York' where city_code = 'ONH' or airport_code = 'ONH';
update airport set timezone = 'Atlantic/St_Helena' where city_code = 'ASI' or airport_code = 'ASI';
update airport set timezone = 'America/Denver' where city_code = '4U9' or airport_code = '4U9';
update airport set timezone = 'America/Denver' where city_code = 'LVM' or airport_code = 'LVM';
update airport set timezone = 'Africa/Lagos' where city_code = 'ZWR' or airport_code = 'ZWR';
update airport set timezone = 'America/Denver' where city_code = '6S0' or airport_code = '6S0';
update airport set timezone = 'America/New_York' where city_code = 'BIV' or airport_code = 'BIV';
update airport set timezone = 'Europe/Helsinki' where city_code = 'HEN' or airport_code = 'HEN';
update airport set timezone = 'America/New_York' where city_code = 'JRA' or airport_code = 'JRA';
update airport set timezone = 'America/New_York' where city_code = 'LAL' or airport_code = 'LAL';
update airport set timezone = 'Asia/Katmandu' where city_code = 'SYH' or airport_code = 'SYH';
update airport set timezone = 'America/New_York' where city_code = 'IDL' or airport_code = 'IDL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RBK' or airport_code = 'RBK';
update airport set timezone = 'Europe/Rome' where city_code = 'FNU' or airport_code = 'FNU';
update airport set timezone = 'Asia/Calcutta' where city_code = 'MYQ' or airport_code = 'MYQ';
update airport set timezone = 'America/New_York' where city_code = 'PCW' or airport_code = 'PCW';
update airport set timezone = 'America/New_York' where city_code = 'MGY' or airport_code = 'MGY';
update airport set timezone = 'America/New_York' where city_code = 'RID' or airport_code = 'RID';
update airport set timezone = 'America/New_York' where city_code = 'FDY' or airport_code = 'FDY';
update airport set timezone = 'Australia/Adelaide' where city_code = 'PEA' or airport_code = 'PEA';
update airport set timezone = 'Europe/Berlin' where city_code = 'KFX' or airport_code = 'KFX';
update airport set timezone = 'Europe/Berlin' where city_code = 'MUQ' or airport_code = 'MUQ';
update airport set timezone = 'Europe/Berlin' where city_code = 'NUR' or airport_code = 'NUR';
update airport set timezone = 'Europe/Berlin' where city_code = 'EBE' or airport_code = 'EBE';
update airport set timezone = 'Europe/Berlin' where city_code = 'AUB' or airport_code = 'AUB';
update airport set timezone = 'Europe/Berlin' where city_code = 'BIE' or airport_code = 'BIE';
update airport set timezone = 'Europe/Berlin' where city_code = 'BUH' or airport_code = 'BUH';
update airport set timezone = 'Europe/Berlin' where city_code = 'FUX' or airport_code = 'FUX';
update airport set timezone = 'Europe/Berlin' where city_code = 'KEX' or airport_code = 'KEX';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AIE' or airport_code = 'AIE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SIM' or airport_code = 'SIM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AUJ' or airport_code = 'AUJ';
update airport set timezone = 'Europe/Berlin' where city_code = 'OAL' or airport_code = 'OAL';
update airport set timezone = 'Europe/Berlin' where city_code = 'MOS' or airport_code = 'MOS';
update airport set timezone = 'Europe/Berlin' where city_code = 'ESX' or airport_code = 'ESX';
update airport set timezone = 'Europe/Berlin' where city_code = 'BOX' or airport_code = 'BOX';
update airport set timezone = 'Europe/Berlin' where city_code = 'KOX' or airport_code = 'KOX';
update airport set timezone = 'Europe/London' where city_code = 'BBP' or airport_code = 'BBP';
update airport set timezone = 'Europe/Berlin' where city_code = 'LES' or airport_code = 'LES';
update airport set timezone = 'America/Denver' where city_code = 'SPF' or airport_code = 'SPF';
update airport set timezone = 'Europe/Brussels' where city_code = 'KNO' or airport_code = 'KNO';
update airport set timezone = 'Europe/Warsaw' where city_code = 'QYD' or airport_code = 'QYD';
update airport set timezone = 'America/Chicago' where city_code = 'OLV' or airport_code = 'OLV';
update airport set timezone = 'Europe/Istanbul' where city_code = 'ONQ' or airport_code = 'ONQ';
update airport set timezone = 'America/Denver' where city_code = 'BJC' or airport_code = 'BJC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SLE' or airport_code = 'SLE';
update airport set timezone = 'America/Chicago' where city_code = 'UTM' or airport_code = 'UTM';
update airport set timezone = 'Africa/Lusaka' where city_code = 'ZKB' or airport_code = 'ZKB';
update airport set timezone = 'Europe/Berlin' where city_code = 'LND' or airport_code = 'LND';
update airport set timezone = 'America/Santiago' where city_code = 'WPU' or airport_code = 'WPU';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'UDE' or airport_code = 'UDE';
update airport set timezone = 'America/Chicago' where city_code = 'MWC' or airport_code = 'MWC';
update airport set timezone = 'America/Chicago' where city_code = 'JVL' or airport_code = 'JVL';
update airport set timezone = 'Europe/London' where city_code = 'HTF' or airport_code = 'HTF';
update airport set timezone = 'America/Chicago' where city_code = 'GKY' or airport_code = 'GKY';
update airport set timezone = 'America/New_York' where city_code = 'LZU' or airport_code = 'LZU';
update airport set timezone = 'America/Chicago' where city_code = 'BWG' or airport_code = 'BWG';
update airport set timezone = 'America/Chicago' where city_code = 'RVS' or airport_code = 'RVS';
update airport set timezone = '\N' where city_code = 'NOI' or airport_code = 'NOI';
update airport set timezone = 'Asia/Dubai' where city_code = 'NHD' or airport_code = 'NHD';
update airport set timezone = 'Europe/Kiev' where city_code = 'KGO' or airport_code = 'KGO';
update airport set timezone = 'Africa/Cairo' where city_code = 'DBB' or airport_code = 'DBB';
update airport set timezone = 'America/Denver' where city_code = 'BCE' or airport_code = 'BCE';
update airport set timezone = 'Europe/Berlin' where city_code = 'HDB' or airport_code = 'HDB';
update airport set timezone = 'America/New_York' where city_code = 'BUY' or airport_code = 'BUY';
update airport set timezone = 'Europe/Moscow' where city_code = 'CKL' or airport_code = 'CKL';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TCZ' or airport_code = 'TCZ';
update airport set timezone = 'Europe/Kiev' where city_code = 'UKS' or airport_code = 'UKS';
update airport set timezone = 'Europe/Berlin' where city_code = 'BER' or airport_code = 'BER';
update airport set timezone = 'America/Nassau' where city_code = 'WZY' or airport_code = 'WZY';
update airport set timezone = 'America/Chicago' where city_code = 'JCI' or airport_code = 'JCI';
update airport set timezone = 'America/New_York' where city_code = 'ESN' or airport_code = 'ESN';
update airport set timezone = 'Europe/Oslo' where city_code = 'HMR' or airport_code = 'HMR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'R49' or airport_code = 'R49';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MYV' or airport_code = 'MYV';
update airport set timezone = 'Europe/Stockholm' where city_code = 'STO' or airport_code = 'STO';
update airport set timezone = 'Europe/Stockholm' where city_code = 'JHE' or airport_code = 'JHE';
update airport set timezone = 'America/Chicago' where city_code = 'DUC' or airport_code = 'DUC';
update airport set timezone = 'America/Denver' where city_code = 'E91' or airport_code = 'E91';
update airport set timezone = 'America/Chicago' where city_code = 'UVA' or airport_code = 'UVA';
update airport set timezone = 'America/Chicago' where city_code = 'LOT' or airport_code = 'LOT';
update airport set timezone = 'America/Chicago' where city_code = 'C16' or airport_code = 'C16';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CCR' or airport_code = 'CCR';
update airport set timezone = 'America/New_York' where city_code = 'OCA' or airport_code = 'OCA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YUS' or airport_code = 'YUS';
update airport set timezone = 'America/Panama' where city_code = 'PYC' or airport_code = 'PYC';
update airport set timezone = 'America/Panama' where city_code = 'UTU' or airport_code = 'UTU';
update airport set timezone = 'America/Panama' where city_code = 'MPU' or airport_code = 'MPU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HIA' or airport_code = 'HIA';
update airport set timezone = 'America/Panama' where city_code = 'PVE' or airport_code = 'PVE';
update airport set timezone = 'America/Toronto' where city_code = 'YOO' or airport_code = 'YOO';
update airport set timezone = 'Europe/Berlin' where city_code = 'LHA' or airport_code = 'LHA';
update airport set timezone = 'America/New_York' where city_code = 'SGH' or airport_code = 'SGH';
update airport set timezone = 'Indian/Maldives' where city_code = 'MSI' or airport_code = 'MSI';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'HEX' or airport_code = 'HEX';
update airport set timezone = 'Australia/Darwin' where city_code = 'CDA' or airport_code = 'CDA';
update airport set timezone = 'Australia/Darwin' where city_code = 'JAB' or airport_code = 'JAB';
update airport set timezone = 'Europe/Berlin' where city_code = 'RGB' or airport_code = 'RGB';
update airport set timezone = 'Europe/Berlin' where city_code = 'TLG' or airport_code = 'TLG';
update airport set timezone = 'America/New_York' where city_code = 'MPB' or airport_code = 'MPB';
update airport set timezone = 'Africa/Freetown' where city_code = 'HGS' or airport_code = 'HGS';
update airport set timezone = 'America/Chicago' where city_code = 'TOP' or airport_code = 'TOP';
update airport set timezone = 'America/Chicago' where city_code = 'EMP' or airport_code = 'EMP';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NGQ' or airport_code = 'NGQ';
update airport set timezone = 'Europe/Berlin' where city_code = 'CSO' or airport_code = 'CSO';
update airport set timezone = 'Europe/Berlin' where city_code = 'WZB' or airport_code = 'WZB';
update airport set timezone = 'America/Chicago' where city_code = 'TKI' or airport_code = 'TKI';
update airport set timezone = 'America/Chicago' where city_code = 'PWK' or airport_code = 'PWK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'KLS' or airport_code = 'KLS';
update airport set timezone = 'America/New_York' where city_code = '3W2' or airport_code = '3W2';
update airport set timezone = '\N' where city_code = 'ZTA' or airport_code = 'ZTA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TWD' or airport_code = 'TWD';
update airport set timezone = 'America/Los_Angeles' where city_code = '38W' or airport_code = '38W';
update airport set timezone = 'America/Los_Angeles' where city_code = '0S9' or airport_code = '0S9';
update airport set timezone = 'America/Panama' where city_code = 'PUE' or airport_code = 'PUE';
update airport set timezone = 'Europe/Kiev' where city_code = 'KHC' or airport_code = 'KHC';
update airport set timezone = 'America/Toronto' where city_code = 'XDS' or airport_code = 'XDS';
update airport set timezone = 'America/Toronto' where city_code = 'XVV' or airport_code = 'XVV';
update airport set timezone = 'America/Edmonton' where city_code = 'XZL' or airport_code = 'XZL';
update airport set timezone = 'America/New_York' where city_code = 'ZRD' or airport_code = 'ZRD';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'XKL' or airport_code = 'XKL';
update airport set timezone = 'America/Winnipeg' where city_code = 'XAD' or airport_code = 'XAD';
update airport set timezone = 'America/Winnipeg' where city_code = 'XEF' or airport_code = 'XEF';
update airport set timezone = 'Africa/Nairobi' where city_code = 'UKA' or airport_code = 'UKA';
update airport set timezone = 'America/New_York' where city_code = 'ILN' or airport_code = 'ILN';
update airport set timezone = 'America/Phoenix' where city_code = 'AVW' or airport_code = 'AVW';
update airport set timezone = 'America/Phoenix' where city_code = 'CGZ' or airport_code = 'CGZ';
update airport set timezone = 'America/Phoenix' where city_code = 'BXK' or airport_code = 'BXK';
update airport set timezone = 'America/Phoenix' where city_code = 'E63' or airport_code = 'E63';
update airport set timezone = 'America/New_York' where city_code = 'MMI' or airport_code = 'MMI';
update airport set timezone = 'America/Denver' where city_code = 'STK' or airport_code = 'STK';
update airport set timezone = 'America/Denver' where city_code = 'RWL' or airport_code = 'RWL';
update airport set timezone = 'America/Vancouver' where city_code = 'YZY' or airport_code = 'YZY';
update airport set timezone = 'America/New_York' where city_code = 'CDW' or airport_code = 'CDW';
update airport set timezone = 'America/Chicago' where city_code = 'AIZ' or airport_code = 'AIZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'L35' or airport_code = 'L35';
update airport set timezone = 'Europe/Kiev' where city_code = 'KIP' or airport_code = 'KIP';
update airport set timezone = 'Europe/Berlin' where city_code = 'BAM' or airport_code = 'BAM';
update airport set timezone = 'Europe/Berlin' where city_code = 'IGS' or airport_code = 'IGS';
update airport set timezone = 'America/New_York' where city_code = 'TVI' or airport_code = 'TVI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HSH' or airport_code = 'HSH';
update airport set timezone = 'Europe/Kiev' where city_code = 'GML' or airport_code = 'GML';
update airport set timezone = 'America/New_York' where city_code = 'TMA' or airport_code = 'TMA';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZRB' or airport_code = 'ZRB';
update airport set timezone = 'Europe/Prague' where city_code = 'XYG' or airport_code = 'XYG';
update airport set timezone = 'Europe/London' where city_code = 'QQS' or airport_code = 'QQS';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'ULX' or airport_code = 'ULX';
update airport set timezone = 'Europe/Warsaw' where city_code = 'QXR' or airport_code = 'QXR';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DVT' or airport_code = 'DVT';
update airport set timezone = 'America/Edmonton' where city_code = 'YBW' or airport_code = 'YBW';
update airport set timezone = 'America/Edmonton' where city_code = 'YGE' or airport_code = 'YGE';
update airport set timezone = 'America/Vancouver' where city_code = 'YRV' or airport_code = 'YRV';
update airport set timezone = 'Europe/Moscow' where city_code = 'TYA' or airport_code = 'TYA';
update airport set timezone = 'America/Chicago' where city_code = 'HDO' or airport_code = 'HDO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ZHY' or airport_code = 'ZHY';
update airport set timezone = 'America/Anchorage' where city_code = 'MCL' or airport_code = 'MCL';
update airport set timezone = 'America/Anchorage' where city_code = 'LHD' or airport_code = 'LHD';
update airport set timezone = 'America/Anchorage' where city_code = 'PPC' or airport_code = 'PPC';
update airport set timezone = 'Africa/Gaborone' where city_code = 'KHW' or airport_code = 'KHW';
update airport set timezone = 'Asia/Taipei' where city_code = 'TXG' or airport_code = 'TXG';
update airport set timezone = 'America/New_York' where city_code = 'HCC' or airport_code = 'HCC';
update airport set timezone = 'America/New_York' where city_code = 'HLG' or airport_code = 'HLG';
update airport set timezone = 'America/New_York' where city_code = 'FZG' or airport_code = 'FZG';
update airport set timezone = 'America/New_York' where city_code = '40J' or airport_code = '40J';
update airport set timezone = 'America/New_York' where city_code = '70J' or airport_code = '70J';
update airport set timezone = 'Europe/Istanbul' where city_code = 'SSX' or airport_code = 'SSX';
update airport set timezone = 'Asia/Rangoon' where city_code = 'XYE' or airport_code = 'XYE';
update airport set timezone = 'America/Toronto' where city_code = 'XEG' or airport_code = 'XEG';
update airport set timezone = 'America/Toronto' where city_code = 'XAX' or airport_code = 'XAX';
update airport set timezone = 'Asia/Dubai' where city_code = 'DWC' or airport_code = 'DWC';
update airport set timezone = 'America/Chicago' where city_code = 'RKP' or airport_code = 'RKP';
update airport set timezone = '\N' where city_code = 'NDA' or airport_code = 'NDA';
update airport set timezone = 'Europe/Paris' where city_code = 'MVV' or airport_code = 'MVV';
update airport set timezone = 'Europe/Paris' where city_code = 'MFX' or airport_code = 'MFX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AEB' or airport_code = 'AEB';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OKF' or airport_code = 'OKF';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OKU' or airport_code = 'OKU';
update airport set timezone = 'Europe/Berlin' where city_code = 'PSH' or airport_code = 'PSH';
update airport set timezone = 'America/New_York' where city_code = 'CKF' or airport_code = 'CKF';
update airport set timezone = 'America/New_York' where city_code = 'OMN' or airport_code = 'OMN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TTD' or airport_code = 'TTD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HIO' or airport_code = 'HIO';
update airport set timezone = 'America/New_York' where city_code = '24J' or airport_code = '24J';
update airport set timezone = 'Asia/Kabul' where city_code = 'KHT' or airport_code = 'KHT';
update airport set timezone = 'Asia/Rangoon' where city_code = 'NYT' or airport_code = 'NYT';
update airport set timezone = 'America/New_York' where city_code = 'GAI' or airport_code = 'GAI';
update airport set timezone = 'Asia/Kabul' where city_code = 'AZ3' or airport_code = 'AZ3';
update airport set timezone = 'America/Toronto' where city_code = 'YTA' or airport_code = 'YTA';
update airport set timezone = 'Africa/Windhoek' where city_code = 'TSB' or airport_code = 'TSB';
update airport set timezone = 'America/Edmonton' where city_code = 'YSD' or airport_code = 'YSD';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BNU' or airport_code = 'BNU';
update airport set timezone = 'Europe/Bucharest' where city_code = 'SIB' or airport_code = 'SIB';
update airport set timezone = 'Europe/Bucharest' where city_code = 'CIO' or airport_code = 'CIO';
update airport set timezone = 'America/New_York' where city_code = 'CVX' or airport_code = 'CVX';
update airport set timezone = 'America/New_York' where city_code = '2J9' or airport_code = '2J9';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RCE' or airport_code = 'RCE';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BYW' or airport_code = 'BYW';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RSJ' or airport_code = 'RSJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WSX' or airport_code = 'WSX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FBS' or airport_code = 'FBS';
update airport set timezone = 'America/Vancouver' where city_code = 'YRR' or airport_code = 'YRR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'L06' or airport_code = 'L06';
update airport set timezone = 'America/Toronto' where city_code = 'YCC' or airport_code = 'YCC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'IZA' or airport_code = 'IZA';
update airport set timezone = 'America/New_York' where city_code = 'XFL' or airport_code = 'XFL';
update airport set timezone = 'Europe/Bucharest' where city_code = 'DVA' or airport_code = 'DVA';
update airport set timezone = 'Europe/Bucharest' where city_code = 'DZM' or airport_code = 'DZM';
update airport set timezone = 'America/New_York' where city_code = 'MVL' or airport_code = 'MVL';
update airport set timezone = 'America/Chicago' where city_code = 'RBD' or airport_code = 'RBD';
update airport set timezone = 'America/New_York' where city_code = '6Y8' or airport_code = '6Y8';
update airport set timezone = 'Europe/Moscow' where city_code = 'MOW' or airport_code = 'MOW';
update airport set timezone = 'America/New_York' where city_code = 'WST' or airport_code = 'WST';
update airport set timezone = 'America/New_York' where city_code = 'BID' or airport_code = 'BID';
update airport set timezone = 'America/Anchorage' where city_code = '369' or airport_code = '369';
update airport set timezone = 'America/Anchorage' where city_code = 'NME' or airport_code = 'NME';
update airport set timezone = 'America/Anchorage' where city_code = 'OOK' or airport_code = 'OOK';
update airport set timezone = 'America/Anchorage' where city_code = 'TNK' or airport_code = 'TNK';
update airport set timezone = 'America/Anchorage' where city_code = 'GNU' or airport_code = 'GNU';
update airport set timezone = 'America/Anchorage' where city_code = 'WWT' or airport_code = 'WWT';
update airport set timezone = 'America/Panama' where city_code = 'ACU' or airport_code = 'ACU';
update airport set timezone = 'America/Panama' where city_code = 'TUW' or airport_code = 'TUW';
update airport set timezone = 'America/Panama' where city_code = 'GHE' or airport_code = 'GHE';
update airport set timezone = 'America/Panama' where city_code = 'MPP' or airport_code = 'MPP';
update airport set timezone = 'America/Scoresbysund' where city_code = 'OBY' or airport_code = 'OBY';
update airport set timezone = 'Europe/Kiev' where city_code = 'VIN' or airport_code = 'VIN';
update airport set timezone = 'Europe/Paris' where city_code = 'QXG' or airport_code = 'QXG';
update airport set timezone = 'America/New_York' where city_code = 'BGE' or airport_code = 'BGE';
update airport set timezone = 'America/Blanc-Sablon' where city_code = 'ZKG' or airport_code = 'ZKG';
update airport set timezone = 'America/Halifax' where city_code = 'YBI' or airport_code = 'YBI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SPZ' or airport_code = 'SPZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WHP' or airport_code = 'WHP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MAE' or airport_code = 'MAE';
update airport set timezone = 'America/Denver' where city_code = 'U76' or airport_code = 'U76';
update airport set timezone = 'America/Vancouver' where city_code = 'YZZ' or airport_code = 'YZZ';
update airport set timezone = 'America/Winnipeg' where city_code = 'YAB' or airport_code = 'YAB';
update airport set timezone = 'America/Belize' where city_code = 'BCV' or airport_code = 'BCV';
update airport set timezone = 'America/Cayenne' where city_code = 'MPY' or airport_code = 'MPY';
update airport set timezone = 'America/Cayenne' where city_code = 'LDX' or airport_code = 'LDX';
update airport set timezone = 'America/Paramaribo' where city_code = 'AAJ' or airport_code = 'AAJ';
update airport set timezone = 'America/Paramaribo' where city_code = 'LDO' or airport_code = 'LDO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KJI' or airport_code = 'KJI';
update airport set timezone = 'America/Bogota' where city_code = 'CPB' or airport_code = 'CPB';
update airport set timezone = 'Africa/Cairo' where city_code = 'HMB' or airport_code = 'HMB';
update airport set timezone = 'America/Montevideo' where city_code = 'RVY' or airport_code = 'RVY';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'POJ' or airport_code = 'POJ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'JTC' or airport_code = 'JTC';
update airport set timezone = 'America/Boa_Vista' where city_code = 'OIA' or airport_code = 'OIA';
update airport set timezone = 'America/Boa_Vista' where city_code = 'RDC' or airport_code = 'RDC';
update airport set timezone = 'America/Boa_Vista' where city_code = 'SXX' or airport_code = 'SXX';
update airport set timezone = 'America/Campo_Grande' where city_code = 'BYO' or airport_code = 'BYO';
update airport set timezone = 'America/Campo_Grande' where city_code = 'SXO' or airport_code = 'SXO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CFC' or airport_code = 'CFC';
update airport set timezone = 'America/Boa_Vista' where city_code = 'CAF' or airport_code = 'CAF';
update airport set timezone = 'America/Boa_Vista' where city_code = 'ERN' or airport_code = 'ERN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CCI' or airport_code = 'CCI';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'FBE' or airport_code = 'FBE';
update airport set timezone = 'America/Campo_Grande' where city_code = 'CFO' or airport_code = 'CFO';
update airport set timezone = 'America/New_York' where city_code = '19A' or airport_code = '19A';
update airport set timezone = 'America/New_York' where city_code = 'AAF' or airport_code = 'AAF';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'UMU' or airport_code = 'UMU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'DTI' or airport_code = 'DTI';
update airport set timezone = 'America/Boa_Vista' where city_code = 'FBA' or airport_code = 'FBA';
update airport set timezone = 'America/Boa_Vista' where city_code = 'OLC' or airport_code = 'OLC';
update airport set timezone = 'America/Boa_Vista' where city_code = 'HUW' or airport_code = 'HUW';
update airport set timezone = 'America/Boa_Vista' where city_code = 'IRZ' or airport_code = 'IRZ';
update airport set timezone = 'America/Boa_Vista' where city_code = 'ORX' or airport_code = 'ORX';
update airport set timezone = 'America/Fortaleza' where city_code = 'UNA' or airport_code = 'UNA';
update airport set timezone = 'Australia/Perth' where city_code = 'TEF' or airport_code = 'TEF';
update airport set timezone = 'Europe/Istanbul' where city_code = 'GZP' or airport_code = 'GZP';
update airport set timezone = 'America/New_York' where city_code = 'SGJ' or airport_code = 'SGJ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'LDZ' or airport_code = 'LDZ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'INY' or airport_code = 'INY';
update airport set timezone = 'America/New_York' where city_code = 'DQH' or airport_code = 'DQH';
update airport set timezone = 'America/New_York' where city_code = 'FRP' or airport_code = 'FRP';
update airport set timezone = 'America/New_York' where city_code = 'ALX' or airport_code = 'ALX';
update airport set timezone = 'America/New_York' where city_code = 'TAN' or airport_code = 'TAN';
update airport set timezone = 'America/New_York' where city_code = 'PYM' or airport_code = 'PYM';
update airport set timezone = 'America/New_York' where city_code = 'OQU' or airport_code = 'OQU';
update airport set timezone = 'America/New_York' where city_code = '1B9' or airport_code = '1B9';
update airport set timezone = 'America/New_York' where city_code = 'OWD' or airport_code = 'OWD';
update airport set timezone = 'America/New_York' where city_code = 'BAF' or airport_code = 'BAF';
update airport set timezone = 'America/New_York' where city_code = 'IJD' or airport_code = 'IJD';
update airport set timezone = 'America/New_York' where city_code = 'MGJ' or airport_code = 'MGJ';
update airport set timezone = 'America/New_York' where city_code = 'CXY' or airport_code = 'CXY';
update airport set timezone = 'America/New_York' where city_code = 'GHG' or airport_code = 'GHG';
update airport set timezone = 'America/New_York' where city_code = 'DXR' or airport_code = 'DXR';
update airport set timezone = 'America/New_York' where city_code = 'ASH' or airport_code = 'ASH';
update airport set timezone = 'America/New_York' where city_code = 'LWM' or airport_code = 'LWM';
update airport set timezone = 'America/New_York' where city_code = 'OXC' or airport_code = 'OXC';
update airport set timezone = 'America/New_York' where city_code = 'FIT' or airport_code = 'FIT';
update airport set timezone = 'America/New_York' where city_code = 'VPC' or airport_code = 'VPC';
update airport set timezone = 'America/Chicago' where city_code = 'PYP' or airport_code = 'PYP';
update airport set timezone = 'America/New_York' where city_code = 'RMG' or airport_code = 'RMG';
update airport set timezone = 'America/Chicago' where city_code = 'GAD' or airport_code = 'GAD';
update airport set timezone = 'America/New_York' where city_code = 'DKX' or airport_code = 'DKX';
update airport set timezone = 'America/New_York' where city_code = 'WDR' or airport_code = 'WDR';
update airport set timezone = 'America/New_York' where city_code = 'JYL' or airport_code = 'JYL';
update airport set timezone = 'America/New_York' where city_code = 'DNN' or airport_code = 'DNN';
update airport set timezone = 'America/New_York' where city_code = 'CTJ' or airport_code = 'CTJ';
update airport set timezone = 'America/Chicago' where city_code = '4A9' or airport_code = '4A9';
update airport set timezone = 'America/New_York' where city_code = 'LGC' or airport_code = 'LGC';
update airport set timezone = 'America/New_York' where city_code = 'MLJ' or airport_code = 'MLJ';
update airport set timezone = 'America/New_York' where city_code = '4A4' or airport_code = '4A4';
update airport set timezone = 'America/New_York' where city_code = 'PIM' or airport_code = 'PIM';
update airport set timezone = 'America/New_York' where city_code = 'FFC' or airport_code = 'FFC';
update airport set timezone = 'America/New_York' where city_code = '9A1' or airport_code = '9A1';
update airport set timezone = 'America/New_York' where city_code = 'GVL' or airport_code = 'GVL';
update airport set timezone = 'America/Chicago' where city_code = '54J' or airport_code = '54J';
update airport set timezone = 'America/New_York' where city_code = '9A5' or airport_code = '9A5';
update airport set timezone = 'America/New_York' where city_code = 'PHD' or airport_code = 'PHD';
update airport set timezone = 'America/New_York' where city_code = 'UDG' or airport_code = 'UDG';
update airport set timezone = 'America/New_York' where city_code = 'HXD' or airport_code = 'HXD';
update airport set timezone = 'America/New_York' where city_code = '49A' or airport_code = '49A';
update airport set timezone = 'America/New_York' where city_code = '0A9' or airport_code = '0A9';
update airport set timezone = 'America/Chicago' where city_code = '06A' or airport_code = '06A';
update airport set timezone = 'America/New_York' where city_code = 'DNL' or airport_code = 'DNL';
update airport set timezone = 'America/New_York' where city_code = 'MRN' or airport_code = 'MRN';
update airport set timezone = 'America/New_York' where city_code = 'PBX' or airport_code = 'PBX';
update airport set timezone = 'America/New_York' where city_code = 'TOC' or airport_code = 'TOC';
update airport set timezone = 'Europe/Kiev' where city_code = 'PLV' or airport_code = 'PLV';
update airport set timezone = 'Africa/Juba' where city_code = 'WUU' or airport_code = 'WUU';
update airport set timezone = 'Africa/Asmera' where city_code = 'HUE' or airport_code = 'HUE';
update airport set timezone = 'Africa/Nairobi' where city_code = 'OYL' or airport_code = 'OYL';
update airport set timezone = 'Africa/Freetown' where city_code = 'WYE' or airport_code = 'WYE';
update airport set timezone = 'Africa/Freetown' where city_code = 'GBK' or airport_code = 'GBK';
update airport set timezone = 'America/New_York' where city_code = 'VDF' or airport_code = 'VDF';
update airport set timezone = 'America/Chicago' where city_code = 'AFW' or airport_code = 'AFW';
update airport set timezone = 'America/Chicago' where city_code = '57C' or airport_code = '57C';
update airport set timezone = 'Asia/Chongqing' where city_code = 'MYF' or airport_code = 'MYF';
update airport set timezone = 'Asia/Seoul' where city_code = 'SEL' or airport_code = 'SEL';
update airport set timezone = 'Australia/Adelaide' where city_code = 'RMK' or airport_code = 'RMK';
update airport set timezone = 'America/Winnipeg' where city_code = 'KEW' or airport_code = 'KEW';
update airport set timezone = 'America/Toronto' where city_code = 'YSP' or airport_code = 'YSP';
update airport set timezone = 'America/Toronto' where city_code = 'YHF' or airport_code = 'YHF';
update airport set timezone = 'America/Toronto' where city_code = 'YHN' or airport_code = 'YHN';
update airport set timezone = 'America/Toronto' where city_code = 'YKX' or airport_code = 'YKX';
update airport set timezone = 'America/Toronto' where city_code = 'YMG' or airport_code = 'YMG';
update airport set timezone = 'America/Toronto' where city_code = 'YXZ' or airport_code = 'YXZ';
update airport set timezone = 'America/Toronto' where city_code = 'YEM' or airport_code = 'YEM';
update airport set timezone = 'America/Toronto' where city_code = 'YFD' or airport_code = 'YFD';
update airport set timezone = 'America/Chicago' where city_code = 'LWC' or airport_code = 'LWC';
update airport set timezone = 'America/Chicago' where city_code = 'EGT' or airport_code = 'EGT';
update airport set timezone = 'America/New_York' where city_code = '6A2' or airport_code = '6A2';
update airport set timezone = 'Asia/Nicosia' where city_code = 'NIC' or airport_code = 'NIC';
update airport set timezone = 'America/New_York' where city_code = 'PMP' or airport_code = 'PMP';
update airport set timezone = 'Australia/Hobart' where city_code = 'XMC' or airport_code = 'XMC';
update airport set timezone = 'Asia/Riyadh' where city_code = 'ULH' or airport_code = 'ULH';
update airport set timezone = 'America/Chicago' where city_code = 'EET' or airport_code = 'EET';
update airport set timezone = 'Australia/Darwin' where city_code = 'YUE' or airport_code = 'YUE';
update airport set timezone = 'Europe/Paris' where city_code = 'XWG' or airport_code = 'XWG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'GZS' or airport_code = 'GZS';
update airport set timezone = 'Asia/Makassar' where city_code = 'LOP' or airport_code = 'LOP';
update airport set timezone = 'Asia/Muscat' where city_code = 'OMM' or airport_code = 'OMM';
update airport set timezone = 'America/Vancouver' where city_code = 'ZML' or airport_code = 'ZML';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HDG' or airport_code = 'HDG';
update airport set timezone = 'America/New_York' where city_code = 'UMP' or airport_code = 'UMP';
update airport set timezone = 'America/New_York' where city_code = 'LOZ' or airport_code = 'LOZ';
update airport set timezone = 'America/New_York' where city_code = 'FBG' or airport_code = 'FBG';
update airport set timezone = 'Europe/Warsaw' where city_code = 'WMI' or airport_code = 'WMI';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JXA' or airport_code = 'JXA';
update airport set timezone = 'America/Winnipeg' where city_code = 'YGM' or airport_code = 'YGM';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'EYK' or airport_code = 'EYK';
update airport set timezone = 'America/Chicago' where city_code = 'RAC' or airport_code = 'RAC';
update airport set timezone = 'Asia/Manila' where city_code = 'RZP' or airport_code = 'RZP';
update airport set timezone = 'Asia/Tokyo' where city_code = 'QOT' or airport_code = 'QOT';
update airport set timezone = 'Asia/Chongqing' where city_code = 'RKZ' or airport_code = 'RKZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'REI' or airport_code = 'REI';
update airport set timezone = 'America/Los_Angeles' where city_code = '49X' or airport_code = '49X';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RIR' or airport_code = 'RIR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TIW' or airport_code = 'TIW';
update airport set timezone = 'America/New_York' where city_code = 'X39' or airport_code = 'X39';
update airport set timezone = 'America/Chicago' where city_code = 'JKA' or airport_code = 'JKA';
update airport set timezone = 'Europe/Rome' where city_code = 'VIF' or airport_code = 'VIF';
update airport set timezone = 'Europe/Kiev' where city_code = 'HMJ' or airport_code = 'HMJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HIW' or airport_code = 'HIW';
update airport set timezone = 'America/New_York' where city_code = 'HZL' or airport_code = 'HZL';
update airport set timezone = 'America/New_York' where city_code = 'CBE' or airport_code = 'CBE';
update airport set timezone = 'America/Vancouver' where city_code = 'YBO' or airport_code = 'YBO';
update airport set timezone = 'Pacific/Auckland' where city_code = 'FGL' or airport_code = 'FGL';
update airport set timezone = 'Europe/Moscow' where city_code = 'KLF' or airport_code = 'KLF';
update airport set timezone = 'Europe/Stockholm' where city_code = 'XEV' or airport_code = 'XEV';
update airport set timezone = 'Europe/Stockholm' where city_code = 'QYX' or airport_code = 'QYX';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'QRH' or airport_code = 'QRH';
update airport set timezone = 'Europe/Prague' where city_code = 'XYJ' or airport_code = 'XYJ';
update airport set timezone = 'Europe/Berlin' where city_code = 'BNJ' or airport_code = 'BNJ';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'ZGH' or airport_code = 'ZGH';
update airport set timezone = 'Europe/Vienna' where city_code = 'ZSB' or airport_code = 'ZSB';
update airport set timezone = 'Europe/Brussels' where city_code = 'ZWE' or airport_code = 'ZWE';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'ELL' or airport_code = 'ELL';
update airport set timezone = 'America/Chicago' where city_code = 'LNR' or airport_code = 'LNR';
update airport set timezone = 'America/Chicago' where city_code = 'JOT' or airport_code = 'JOT';
update airport set timezone = 'America/Chicago' where city_code = 'VYS' or airport_code = 'VYS';
update airport set timezone = 'America/New_York' where city_code = 'JXN' or airport_code = 'JXN';
update airport set timezone = 'America/New_York' where city_code = 'BBX' or airport_code = 'BBX';
update airport set timezone = 'America/New_York' where city_code = 'OBE' or airport_code = 'OBE';
update airport set timezone = 'America/New_York' where city_code = 'SEF' or airport_code = 'SEF';
update airport set timezone = 'America/New_York' where city_code = 'AVO' or airport_code = 'AVO';
update airport set timezone = 'America/New_York' where city_code = 'GIF' or airport_code = 'GIF';
update airport set timezone = 'America/New_York' where city_code = 'ZPH' or airport_code = 'ZPH';
update airport set timezone = 'America/New_York' where city_code = 'OCF' or airport_code = 'OCF';
update airport set timezone = 'America/New_York' where city_code = 'JES' or airport_code = 'JES';
update airport set timezone = 'America/New_York' where city_code = '52A' or airport_code = '52A';
update airport set timezone = 'America/New_York' where city_code = 'CCO' or airport_code = 'CCO';
update airport set timezone = 'America/New_York' where city_code = 'HQU' or airport_code = 'HQU';
update airport set timezone = 'America/New_York' where city_code = 'AIK' or airport_code = 'AIK';
update airport set timezone = 'America/New_York' where city_code = 'CDN' or airport_code = 'CDN';
update airport set timezone = 'America/New_York' where city_code = 'LBT' or airport_code = 'LBT';
update airport set timezone = 'America/New_York' where city_code = '3J1' or airport_code = '3J1';
update airport set timezone = 'America/New_York' where city_code = 'SOP' or airport_code = 'SOP';
update airport set timezone = 'America/New_York' where city_code = 'RCZ' or airport_code = 'RCZ';
update airport set timezone = 'America/New_York' where city_code = '99N' or airport_code = '99N';
update airport set timezone = 'America/Chicago' where city_code = '93C' or airport_code = '93C';
update airport set timezone = 'America/Chicago' where city_code = 'Y51' or airport_code = 'Y51';
update airport set timezone = 'America/Chicago' where city_code = 'DLL' or airport_code = 'DLL';
update airport set timezone = 'America/Chicago' where city_code = '7A4' or airport_code = '7A4';
update airport set timezone = 'America/New_York' where city_code = 'SVH' or airport_code = 'SVH';
update airport set timezone = 'America/Chicago' where city_code = 'C89' or airport_code = 'C89';
update airport set timezone = 'America/Chicago' where city_code = 'BUU' or airport_code = 'BUU';
update airport set timezone = 'America/New_York' where city_code = 'N53' or airport_code = 'N53';
update airport set timezone = 'America/New_York' where city_code = '70N' or airport_code = '70N';
update airport set timezone = 'America/New_York' where city_code = '06N' or airport_code = '06N';
update airport set timezone = 'America/New_York' where city_code = 'LHV' or airport_code = 'LHV';
update airport set timezone = 'America/New_York' where city_code = '29D' or airport_code = '29D';
update airport set timezone = 'America/New_York' where city_code = '04G' or airport_code = '04G';
update airport set timezone = 'America/New_York' where city_code = '3G3' or airport_code = '3G3';
update airport set timezone = 'America/New_York' where city_code = '3G4' or airport_code = '3G4';
update airport set timezone = 'America/New_York' where city_code = '4G0' or airport_code = '4G0';
update airport set timezone = 'America/New_York' where city_code = '2G9' or airport_code = '2G9';
update airport set timezone = 'America/New_York' where city_code = '4G4' or airport_code = '4G4';
update airport set timezone = 'America/New_York' where city_code = '41N' or airport_code = '41N';
update airport set timezone = 'America/New_York' where city_code = 'LPR' or airport_code = 'LPR';
update airport set timezone = 'America/New_York' where city_code = '7D9' or airport_code = '7D9';
update airport set timezone = 'America/New_York' where city_code = 'BKL' or airport_code = 'BKL';
update airport set timezone = 'America/New_York' where city_code = 'DKK' or airport_code = 'DKK';
update airport set timezone = 'America/New_York' where city_code = '4G2' or airport_code = '4G2';
update airport set timezone = 'America/New_York' where city_code = 'N87' or airport_code = 'N87';
update airport set timezone = 'America/New_York' where city_code = 'VAY' or airport_code = 'VAY';
update airport set timezone = 'America/New_York' where city_code = '7N7' or airport_code = '7N7';
update airport set timezone = 'America/New_York' where city_code = 'LDJ' or airport_code = 'LDJ';
update airport set timezone = 'America/New_York' where city_code = 'O03' or airport_code = 'O03';
update airport set timezone = 'America/New_York' where city_code = '0W3' or airport_code = '0W3';
update airport set timezone = 'America/New_York' where city_code = 'ANQ' or airport_code = 'ANQ';
update airport set timezone = 'America/New_York' where city_code = 'C65' or airport_code = 'C65';
update airport set timezone = 'America/New_York' where city_code = 'VNW' or airport_code = 'VNW';
update airport set timezone = 'America/New_York' where city_code = '17G' or airport_code = '17G';
update airport set timezone = 'America/New_York' where city_code = 'X07' or airport_code = 'X07';
update airport set timezone = 'America/New_York' where city_code = 'RMY' or airport_code = 'RMY';
update airport set timezone = 'America/New_York' where city_code = 'GVQ' or airport_code = 'GVQ';
update airport set timezone = 'America/New_York' where city_code = '0G7' or airport_code = '0G7';
update airport set timezone = 'America/New_York' where city_code = 'N69' or airport_code = 'N69';
update airport set timezone = 'America/New_York' where city_code = '4B8' or airport_code = '4B8';
update airport set timezone = 'America/New_York' where city_code = '0G6' or airport_code = '0G6';
update airport set timezone = 'America/New_York' where city_code = 'CLW' or airport_code = 'CLW';
update airport set timezone = 'America/New_York' where city_code = 'X49' or airport_code = 'X49';
update airport set timezone = 'Europe/London' where city_code = 'SCS' or airport_code = 'SCS';
update airport set timezone = 'Europe/Berlin' where city_code = 'QWC' or airport_code = 'QWC';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZFR' or airport_code = 'ZFR';
update airport set timezone = 'Europe/Paris' where city_code = 'PLY' or airport_code = 'PLY';
update airport set timezone = 'Europe/Paris' where city_code = 'XHP' or airport_code = 'XHP';
update airport set timezone = 'Europe/Paris' where city_code = 'PAR' or airport_code = 'PAR';
update airport set timezone = 'Europe/Berlin' where city_code = 'BHF' or airport_code = 'BHF';
update airport set timezone = 'Europe/London' where city_code = 'LON' or airport_code = 'LON';
update airport set timezone = 'America/New_York' where city_code = 'NYC' or airport_code = 'NYC';
update airport set timezone = 'America/Chicago' where city_code = 'CHI' or airport_code = 'CHI';
update airport set timezone = 'America/Chicago' where city_code = 'CGX' or airport_code = 'CGX';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TYO' or airport_code = 'TYO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'BJS' or airport_code = 'BJS';
update airport set timezone = 'Europe/Rome' where city_code = 'MIL' or airport_code = 'MIL';
update airport set timezone = 'America/New_York' where city_code = 'WAS' or airport_code = 'WAS';
update airport set timezone = 'America/Toronto' where city_code = 'YMQ' or airport_code = 'YMQ';
update airport set timezone = 'America/Toronto' where city_code = 'YTO' or airport_code = 'YTO';
update airport set timezone = 'America/New_York' where city_code = 'JZP' or airport_code = 'JZP';
update airport set timezone = 'Europe/Berlin' where city_code = 'BGS' or airport_code = 'BGS';
update airport set timezone = 'America/New_York' where city_code = 'CRE' or airport_code = 'CRE';
update airport set timezone = 'Asia/Taipei' where city_code = 'SMT' or airport_code = 'SMT';
update airport set timezone = 'America/Chicago' where city_code = 'IGQ' or airport_code = 'IGQ';
update airport set timezone = 'America/Chicago' where city_code = 'Y72' or airport_code = 'Y72';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RNM' or airport_code = 'RNM';
update airport set timezone = 'Europe/Zurich' where city_code = 'BXO' or airport_code = 'BXO';
update airport set timezone = 'America/New_York' where city_code = 'OEB' or airport_code = 'OEB';
update airport set timezone = 'America/New_York' where city_code = 'WBW' or airport_code = 'WBW';
update airport set timezone = 'America/New_York' where city_code = 'LNN' or airport_code = 'LNN';
update airport set timezone = '\N' where city_code = 'UMD' or airport_code = 'UMD';
update airport set timezone = 'Asia/Chongqing' where city_code = 'RLK' or airport_code = 'RLK';
update airport set timezone = 'America/New_York' where city_code = 'FFT' or airport_code = 'FFT';
update airport set timezone = 'America/New_York' where city_code = 'LEW' or airport_code = 'LEW';
update airport set timezone = 'America/Los_Angeles' where city_code = '6S2' or airport_code = '6S2';
update airport set timezone = 'America/New_York' where city_code = '1A3' or airport_code = '1A3';
update airport set timezone = 'America/Chicago' where city_code = 'NBU' or airport_code = 'NBU';
update airport set timezone = 'America/New_York' where city_code = 'MRK' or airport_code = 'MRK';
update airport set timezone = 'America/New_York' where city_code = 'DRM' or airport_code = 'DRM';
update airport set timezone = 'America/New_York' where city_code = '8M8' or airport_code = '8M8';
update airport set timezone = 'America/New_York' where city_code = 'GDW' or airport_code = 'GDW';
update airport set timezone = 'America/New_York' where city_code = '24C' or airport_code = '24C';
update airport set timezone = 'America/New_York' where city_code = 'LWA' or airport_code = 'LWA';
update airport set timezone = 'America/Chicago' where city_code = '06C' or airport_code = '06C';
update airport set timezone = 'America/Chicago' where city_code = 'MFI' or airport_code = 'MFI';
update airport set timezone = 'America/Chicago' where city_code = 'ISW' or airport_code = 'ISW';
update airport set timezone = 'America/Chicago' where city_code = 'CWI' or airport_code = 'CWI';
update airport set timezone = 'America/New_York' where city_code = 'BVY' or airport_code = 'BVY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'O27' or airport_code = 'O27';
update airport set timezone = 'America/Toronto' where city_code = 'YRQ' or airport_code = 'YRQ';
update airport set timezone = 'America/Chicago' where city_code = 'POF' or airport_code = 'POF';
update airport set timezone = 'America/New_York' where city_code = 'EPM' or airport_code = 'EPM';
update airport set timezone = 'America/Chicago' where city_code = 'EOK' or airport_code = 'EOK';
update airport set timezone = 'America/New_York' where city_code = 'ME5' or airport_code = 'ME5';
update airport set timezone = 'Europe/London' where city_code = 'PSL' or airport_code = 'PSL';
update airport set timezone = 'Europe/Stockholm' where city_code = 'SOO' or airport_code = 'SOO';
update airport set timezone = 'Asia/Vientiane' where city_code = 'VNA' or airport_code = 'VNA';
update airport set timezone = 'America/Phoenix' where city_code = 'E51' or airport_code = 'E51';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'DKS' or airport_code = 'DKS';
update airport set timezone = 'America/Toronto' where city_code = 'XBG' or airport_code = 'XBG';
update airport set timezone = 'Europe/Dublin' where city_code = 'BYT' or airport_code = 'BYT';
update airport set timezone = 'Europe/Dublin' where city_code = 'CHE' or airport_code = 'CHE';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'ADY' or airport_code = 'ADY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'E55' or airport_code = 'E55';
update airport set timezone = 'America/New_York' where city_code = '1G3' or airport_code = '1G3';
update airport set timezone = 'Africa/Nairobi' where city_code = 'GAS' or airport_code = 'GAS';
update airport set timezone = 'Africa/Nairobi' where city_code = 'HOA' or airport_code = 'HOA';
update airport set timezone = 'Africa/Nairobi' where city_code = 'KLK' or airport_code = 'KLK';
update airport set timezone = 'Africa/Nairobi' where city_code = 'KEY' or airport_code = 'KEY';
update airport set timezone = 'Africa/Nairobi' where city_code = 'ILU' or airport_code = 'ILU';
update airport set timezone = 'Africa/Nairobi' where city_code = 'KRV' or airport_code = 'KRV';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'DVD' or airport_code = 'DVD';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'ATJ' or airport_code = 'ATJ';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'OVA' or airport_code = 'OVA';
update airport set timezone = 'America/New_York' where city_code = 'ZRA' or airport_code = 'ZRA';
update airport set timezone = 'America/New_York' where city_code = 'ZSF' or airport_code = 'ZSF';
update airport set timezone = 'America/New_York' where city_code = 'XZK' or airport_code = 'XZK';
update airport set timezone = 'Europe/London' where city_code = 'QQK' or airport_code = 'QQK';
update airport set timezone = 'Europe/London' where city_code = 'XVJ' or airport_code = 'XVJ';
update airport set timezone = 'Europe/London' where city_code = 'XVH' or airport_code = 'XVH';
update airport set timezone = 'Asia/Makassar' where city_code = 'PUM' or airport_code = 'PUM';
update airport set timezone = 'Europe/London' where city_code = 'WLF' or airport_code = 'WLF';
update airport set timezone = 'Asia/Omsk' where city_code = 'RGK' or airport_code = 'RGK';
update airport set timezone = 'America/Chicago' where city_code = 'FLD' or airport_code = 'FLD';
update airport set timezone = 'America/Chicago' where city_code = 'PCZ' or airport_code = 'PCZ';
update airport set timezone = 'America/Chicago' where city_code = 'STE' or airport_code = 'STE';
update airport set timezone = 'America/New_York' where city_code = 'ERY' or airport_code = 'ERY';
update airport set timezone = 'America/Chicago' where city_code = '25D' or airport_code = '25D';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZVM' or airport_code = 'ZVM';
update airport set timezone = 'Europe/Berlin' where city_code = 'PEF' or airport_code = 'PEF';
update airport set timezone = 'America/New_York' where city_code = 'GQQ' or airport_code = 'GQQ';
update airport set timezone = 'America/Guayaquil' where city_code = 'TPN' or airport_code = 'TPN';
update airport set timezone = 'America/Guayaquil' where city_code = 'PTZ' or airport_code = 'PTZ';
update airport set timezone = 'America/Chicago' where city_code = 'CKV' or airport_code = 'CKV';
update airport set timezone = 'Europe/Brussels' where city_code = 'XHN' or airport_code = 'XHN';
update airport set timezone = 'Europe/Berlin' where city_code = 'OHR' or airport_code = 'OHR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LPC' or airport_code = 'LPC';
update airport set timezone = 'America/New_York' where city_code = 'CTH' or airport_code = 'CTH';
update airport set timezone = 'Asia/Kabul' where city_code = 'BST' or airport_code = 'BST';
update airport set timezone = 'Asia/Baku' where city_code = 'LLK' or airport_code = 'LLK';
update airport set timezone = 'Asia/Baku' where city_code = 'GBB' or airport_code = 'GBB';
update airport set timezone = 'Asia/Baku' where city_code = 'ZTU' or airport_code = 'ZTU';
update airport set timezone = 'America/New_York' where city_code = 'LKP' or airport_code = 'LKP';
update airport set timezone = 'America/New_York' where city_code = 'NY9' or airport_code = 'NY9';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JIQ' or airport_code = 'JIQ';
update airport set timezone = '\N' where city_code = 'DEE' or airport_code = 'DEE';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WIH' or airport_code = 'WIH';
update airport set timezone = 'America/New_York' where city_code = 'AOH' or airport_code = 'AOH';
update airport set timezone = 'Asia/Pyongyang' where city_code = 'DSO' or airport_code = 'DSO';
update airport set timezone = 'Asia/Pyongyang' where city_code = 'YJS' or airport_code = 'YJS';
update airport set timezone = 'America/New_York' where city_code = 'SSI' or airport_code = 'SSI';
update airport set timezone = 'America/New_York' where city_code = 'BFP' or airport_code = 'BFP';
update airport set timezone = 'America/New_York' where city_code = 'F57' or airport_code = 'F57';
update airport set timezone = 'America/New_York' where city_code = 'GGE' or airport_code = 'GGE';
update airport set timezone = 'America/New_York' where city_code = 'HDI' or airport_code = 'HDI';
update airport set timezone = 'America/New_York' where city_code = '2A0' or airport_code = '2A0';
update airport set timezone = 'America/New_York' where city_code = '2G2' or airport_code = '2G2';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RNT' or airport_code = 'RNT';
update airport set timezone = 'America/Toronto' where city_code = 'ZBM' or airport_code = 'ZBM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'POC' or airport_code = 'POC';
update airport set timezone = 'America/New_York' where city_code = '09J' or airport_code = '09J';
update airport set timezone = 'America/New_York' where city_code = 'CDK' or airport_code = 'CDK';
update airport set timezone = 'America/New_York' where city_code = 'CTY' or airport_code = 'CTY';
update airport set timezone = 'America/New_York' where city_code = 'CEU' or airport_code = 'CEU';
update airport set timezone = 'America/Denver' where city_code = '36U' or airport_code = '36U';
update airport set timezone = 'America/Chicago' where city_code = 'BEC' or airport_code = 'BEC';
update airport set timezone = 'America/New_York' where city_code = '47A' or airport_code = '47A';
update airport set timezone = 'America/New_York' where city_code = '55J' or airport_code = '55J';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZMB' or airport_code = 'ZMB';
update airport set timezone = 'America/Chicago' where city_code = 'GTU' or airport_code = 'GTU';
update airport set timezone = 'Europe/London' where city_code = 'QFO' or airport_code = 'QFO';
update airport set timezone = 'America/Denver' where city_code = 'SNY' or airport_code = 'SNY';
update airport set timezone = 'America/New_York' where city_code = 'W13' or airport_code = 'W13';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GKL' or airport_code = 'GKL';
update airport set timezone = 'Australia/Darwin' where city_code = 'RPB' or airport_code = 'RPB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'IFL' or airport_code = 'IFL';
update airport set timezone = 'Asia/Kabul' where city_code = 'BIN' or airport_code = 'BIN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NBS' or airport_code = 'NBS';
update airport set timezone = 'Asia/Pyongyang' where city_code = 'RGO' or airport_code = 'RGO';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MOO' or airport_code = 'MOO';
update airport set timezone = 'Europe/Warsaw' where city_code = 'LUZ' or airport_code = 'LUZ';
update airport set timezone = 'America/New_York' where city_code = 'JYO' or airport_code = 'JYO';
update airport set timezone = 'Indian/Maldives' where city_code = 'VAM' or airport_code = 'VAM';
update airport set timezone = 'Indian/Maldives' where city_code = 'IRU' or airport_code = 'IRU';
update airport set timezone = 'Indian/Maldives' where city_code = 'DHG' or airport_code = 'DHG';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LLF' or airport_code = 'LLF';
update airport set timezone = '\N' where city_code = 'LSZ' or airport_code = 'LSZ';
update airport set timezone = 'Australia/Perth' where city_code = 'ONS' or airport_code = 'ONS';
update airport set timezone = 'Australia/Brisbane' where city_code = 'TDR' or airport_code = 'TDR';
update airport set timezone = 'Europe/Warsaw' where city_code = 'CZW' or airport_code = 'CZW';
update airport set timezone = 'America/New_York' where city_code = 'SDC' or airport_code = 'SDC';
update airport set timezone = 'America/Chicago' where city_code = 'CLC' or airport_code = 'CLC';
update airport set timezone = 'America/Cordoba' where city_code = 'CFX' or airport_code = 'CFX';
update airport set timezone = 'America/Denver' where city_code = 'WBU' or airport_code = 'WBU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TVS' or airport_code = 'TVS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PAO' or airport_code = 'PAO';
update airport set timezone = 'America/Phoenix' where city_code = 'FFZ' or airport_code = 'FFZ';
update airport set timezone = 'America/Phoenix' where city_code = 'P08' or airport_code = 'P08';
update airport set timezone = 'America/Phoenix' where city_code = 'P52' or airport_code = 'P52';
update airport set timezone = 'America/Phoenix' where city_code = 'A39' or airport_code = 'A39';
update airport set timezone = 'America/Phoenix' where city_code = 'E25' or airport_code = 'E25';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YTY' or airport_code = 'YTY';
update airport set timezone = 'America/New_York' where city_code = 'PTK' or airport_code = 'PTK';
update airport set timezone = 'Africa/Conakry' where city_code = 'KSI' or airport_code = 'KSI';
update airport set timezone = 'Europe/Budapest' where city_code = 'QPJ' or airport_code = 'QPJ';
update airport set timezone = '\N' where city_code = 'EEN' or airport_code = 'EEN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'THQ' or airport_code = 'THQ';
update airport set timezone = 'Indian/Maldives' where city_code = 'GKK' or airport_code = 'GKK';
update airport set timezone = 'Europe/London' where city_code = 'RCS' or airport_code = 'RCS';
update airport set timezone = 'America/Edmonton' where city_code = 'JHL' or airport_code = 'JHL';
update airport set timezone = 'America/New_York' where city_code = 'EQY' or airport_code = 'EQY';
update airport set timezone = 'Africa/Conakry' where city_code = 'KNN' or airport_code = 'KNN';
update airport set timezone = 'America/Cordoba' where city_code = 'RHD' or airport_code = 'RHD';
update airport set timezone = 'Africa/Windhoek' where city_code = 'KMP' or airport_code = 'KMP';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KGT' or airport_code = 'KGT';
update airport set timezone = 'Europe/Moscow' where city_code = 'VUS' or airport_code = 'VUS';
update airport set timezone = 'America/Chicago' where city_code = 'IOW' or airport_code = 'IOW';
update airport set timezone = 'Asia/Chongqing' where city_code = 'TLQ' or airport_code = 'TLQ';
update airport set timezone = 'America/Chicago' where city_code = 'MWM' or airport_code = 'MWM';
update airport set timezone = 'America/New_York' where city_code = 'ANP' or airport_code = 'ANP';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'DUU' or airport_code = 'DUU';
update airport set timezone = 'Africa/Maputo' where city_code = 'FXO' or airport_code = 'FXO';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'ODO' or airport_code = 'ODO';
update airport set timezone = 'Europe/Kiev' where city_code = 'ZTR' or airport_code = 'ZTR';
update airport set timezone = 'Asia/Colombo' where city_code = 'HRI' or airport_code = 'HRI';
update airport set timezone = 'America/Chicago' where city_code = 'PEQ' or airport_code = 'PEQ';
update airport set timezone = 'America/Chicago' where city_code = 'HBG' or airport_code = 'HBG';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QCJ' or airport_code = 'QCJ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QSC' or airport_code = 'QSC';
update airport set timezone = 'America/Chicago' where city_code = 'YKN' or airport_code = 'YKN';
update airport set timezone = 'America/Chicago' where city_code = 'SES' or airport_code = 'SES';
update airport set timezone = 'Asia/Dubai' where city_code = 'XSB' or airport_code = 'XSB';
update airport set timezone = 'Asia/Dubai' where city_code = 'ZDY' or airport_code = 'ZDY';
update airport set timezone = 'America/Mexico_City' where city_code = 'PCM' or airport_code = 'PCM';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'KTI' or airport_code = 'KTI';
update airport set timezone = 'Asia/Chongqing' where city_code = 'GYU' or airport_code = 'GYU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'CNI' or airport_code = 'CNI';
update airport set timezone = 'Europe/London' where city_code = 'KRH' or airport_code = 'KRH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JGD' or airport_code = 'JGD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CCL' or airport_code = 'CCL';
update airport set timezone = 'America/Vancouver' where city_code = '1C9' or airport_code = '1C9';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HWD' or airport_code = 'HWD';
update airport set timezone = 'Pacific/Auckland' where city_code = 'MZP' or airport_code = 'MZP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'JHQ' or airport_code = 'JHQ';
update airport set timezone = 'America/New_York' where city_code = 'ARB' or airport_code = 'ARB';
update airport set timezone = 'Australia/Hobart' where city_code = 'SHT' or airport_code = 'SHT';
update airport set timezone = 'Australia/Sydney' where city_code = 'TEM' or airport_code = 'TEM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GAH' or airport_code = 'GAH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'EIA' or airport_code = 'EIA';
update airport set timezone = 'Australia/Sydney' where city_code = 'WIO' or airport_code = 'WIO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'BFJ' or airport_code = 'BFJ';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'ULK' or airport_code = 'ULK';
update airport set timezone = 'Europe/Istanbul' where city_code = 'IGD' or airport_code = 'IGD';
update airport set timezone = 'Europe/Istanbul' where city_code = 'GNY' or airport_code = 'GNY';
update airport set timezone = 'Europe/Istanbul' where city_code = 'KZR' or airport_code = 'KZR';
update airport set timezone = 'Europe/Moscow' where city_code = 'VLU' or airport_code = 'VLU';
update airport set timezone = 'America/New_York' where city_code = 'ZTY' or airport_code = 'ZTY';
update airport set timezone = 'Asia/Calcutta' where city_code = 'YLK' or airport_code = 'YLK';
update airport set timezone = 'Pacific/Truk' where city_code = 'ULI' or airport_code = 'ULI';
update airport set timezone = 'Asia/Ashgabat' where city_code = 'BKN' or airport_code = 'BKN';
update airport set timezone = 'Australia/Sydney' where city_code = 'BEO' or airport_code = 'BEO';
update airport set timezone = 'America/New_York' where city_code = '4A7' or airport_code = '4A7';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BMP' or airport_code = 'BMP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NGZ' or airport_code = 'NGZ';
update airport set timezone = 'America/New_York' where city_code = 'ZWI' or airport_code = 'ZWI';
update airport set timezone = 'America/Edmonton' where city_code = 'NML' or airport_code = 'NML';
update airport set timezone = 'America/New_York' where city_code = 'EKI' or airport_code = 'EKI';
update airport set timezone = 'America/Toronto' where city_code = 'YCN' or airport_code = 'YCN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BJP' or airport_code = 'BJP';
update airport set timezone = 'Australia/Perth' where city_code = 'BQB' or airport_code = 'BQB';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'GGR' or airport_code = 'GGR';
update airport set timezone = 'Australia/Sydney' where city_code = 'IVR' or airport_code = 'IVR';
update airport set timezone = 'Australia/Sydney' where city_code = 'GLI' or airport_code = 'GLI';
update airport set timezone = 'America/New_York' where city_code = 'IMM' or airport_code = 'IMM';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YIC' or airport_code = 'YIC';
update airport set timezone = 'America/New_York' where city_code = 'ZRZ' or airport_code = 'ZRZ';
update airport set timezone = 'America/New_York' where city_code = 'PTB' or airport_code = 'PTB';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'KGN' or airport_code = 'KGN';
update airport set timezone = 'America/Chicago' where city_code = 'SBM' or airport_code = 'SBM';
update airport set timezone = 'Australia/Perth' where city_code = 'KFE' or airport_code = 'KFE';
update airport set timezone = 'America/Chicago' where city_code = '3D2' or airport_code = '3D2';
update airport set timezone = 'Asia/Katmandu' where city_code = 'BJU' or airport_code = 'BJU';
update airport set timezone = 'Asia/Saigon' where city_code = 'THD' or airport_code = 'THD';
update airport set timezone = 'America/Phoenix' where city_code = 'MZJ' or airport_code = 'MZJ';
update airport set timezone = 'America/Phoenix' where city_code = 'GEU' or airport_code = 'GEU';
update airport set timezone = 'America/Phoenix' where city_code = 'SAD' or airport_code = 'SAD';
update airport set timezone = 'Australia/Perth' where city_code = 'SLJ' or airport_code = 'SLJ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'KJP' or airport_code = 'KJP';
update airport set timezone = 'Europe/Malta' where city_code = 'JCO' or airport_code = 'JCO';
update airport set timezone = 'America/Chicago' where city_code = 'SIK' or airport_code = 'SIK';
update airport set timezone = 'Europe/Stockholm' where city_code = 'NYN' or airport_code = 'NYN';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'ROD' or airport_code = 'ROD';
update airport set timezone = 'Europe/Berlin' where city_code = 'QUA' or airport_code = 'QUA';
update airport set timezone = 'Europe/London' where city_code = 'BE2' or airport_code = 'BE2';
update airport set timezone = 'Europe/London' where city_code = 'SR2' or airport_code = 'SR2';
update airport set timezone = 'America/Los_Angeles' where city_code = 'L52' or airport_code = 'L52';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TTI' or airport_code = 'TTI';
update airport set timezone = 'America/New_York' where city_code = 'GFL' or airport_code = 'GFL';
update airport set timezone = 'America/New_York' where city_code = '5B2' or airport_code = '5B2';
update airport set timezone = 'America/New_York' where city_code = 'K27' or airport_code = 'K27';
update airport set timezone = 'Asia/Makassar' where city_code = 'MJU' or airport_code = 'MJU';
update airport set timezone = 'America/New_York' where city_code = 'CGC' or airport_code = 'CGC';
update airport set timezone = 'America/New_York' where city_code = 'MTN' or airport_code = 'MTN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LHM' or airport_code = 'LHM';
update airport set timezone = 'America/New_York' where city_code = 'FZI' or airport_code = 'FZI';
update airport set timezone = 'America/New_York' where city_code = 'IZG' or airport_code = 'IZG';
update airport set timezone = 'America/Chicago' where city_code = 'NEW' or airport_code = 'NEW';
update airport set timezone = 'America/Los_Angeles' where city_code = 'COE' or airport_code = 'COE';
update airport set timezone = 'America/Chicago' where city_code = 'BMT' or airport_code = 'BMT';
update airport set timezone = 'America/Chicago' where city_code = 'DNV' or airport_code = 'DNV';
update airport set timezone = 'Australia/Sydney' where city_code = 'COJ' or airport_code = 'COJ';
update airport set timezone = 'America/New_York' where city_code = 'COI' or airport_code = 'COI';
update airport set timezone = 'America/New_York' where city_code = 'X59' or airport_code = 'X59';
update airport set timezone = 'America/New_York' where city_code = 'TIX' or airport_code = 'TIX';
update airport set timezone = 'America/New_York' where city_code = 'X26' or airport_code = 'X26';
update airport set timezone = 'Africa/Windhoek' where city_code = 'TCY' or airport_code = 'TCY';
update airport set timezone = 'Asia/Colombo' where city_code = 'KEZ' or airport_code = 'KEZ';
update airport set timezone = 'Asia/Colombo' where city_code = 'KDZ' or airport_code = 'KDZ';
update airport set timezone = 'Africa/Nairobi' where city_code = 'NYE' or airport_code = 'NYE';
update airport set timezone = 'America/Chicago' where city_code = '1H2' or airport_code = '1H2';
update airport set timezone = 'America/Chicago' where city_code = 'AAP' or airport_code = 'AAP';
update airport set timezone = 'America/Chicago' where city_code = 'FCM' or airport_code = 'FCM';
update airport set timezone = 'Africa/Blantyre' where city_code = 'LIX' or airport_code = 'LIX';
update airport set timezone = 'America/Chicago' where city_code = 'OJC' or airport_code = 'OJC';
update airport set timezone = 'Asia/Colombo' where city_code = 'GIU' or airport_code = 'GIU';
update airport set timezone = 'Europe/Vienna' where city_code = 'XWW' or airport_code = 'XWW';
update airport set timezone = 'Europe/Berlin' where city_code = 'EUM' or airport_code = 'EUM';
update airport set timezone = 'Asia/Bangkok' where city_code = 'TKT' or airport_code = 'TKT';
update airport set timezone = 'America/Toronto' where city_code = 'YLS' or airport_code = 'YLS';
update airport set timezone = 'America/Toronto' where city_code = 'YEE' or airport_code = 'YEE';
update airport set timezone = 'America/Toronto' where city_code = 'NU8' or airport_code = 'NU8';
update airport set timezone = 'America/Toronto' where city_code = 'ND4' or airport_code = 'ND4';
update airport set timezone = 'America/Toronto' where city_code = 'NF4' or airport_code = 'NF4';
update airport set timezone = 'America/Toronto' where city_code = 'YCM' or airport_code = 'YCM';
update airport set timezone = 'America/New_York' where city_code = 'X04' or airport_code = 'X04';
update airport set timezone = 'America/Toronto' where city_code = 'XCM' or airport_code = 'XCM';
update airport set timezone = 'America/Toronto' where city_code = 'YPD' or airport_code = 'YPD';
update airport set timezone = 'America/New_York' where city_code = 'OQN' or airport_code = 'OQN';
update airport set timezone = 'America/New_York' where city_code = 'MNZ' or airport_code = 'MNZ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'BGG' or airport_code = 'BGG';
update airport set timezone = 'Europe/Istanbul' where city_code = 'KFS' or airport_code = 'KFS';
update airport set timezone = 'America/Denver' where city_code = 'UT3' or airport_code = 'UT3';
update airport set timezone = 'Europe/London' where city_code = 'GLQ' or airport_code = 'GLQ';
update airport set timezone = 'America/Chicago' where city_code = '2H0' or airport_code = '2H0';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LLV' or airport_code = 'LLV';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DCY' or airport_code = 'DCY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'GXH' or airport_code = 'GXH';
update airport set timezone = 'America/Phoenix' where city_code = '1G4' or airport_code = '1G4';
update airport set timezone = 'Europe/Rome' where city_code = 'CIY' or airport_code = 'CIY';
update airport set timezone = 'America/New_York' where city_code = '9G1' or airport_code = '9G1';
update airport set timezone = 'America/New_York' where city_code = '2B2' or airport_code = '2B2';
update airport set timezone = 'America/Anchorage' where city_code = 'LKK' or airport_code = 'LKK';
update airport set timezone = 'Europe/London' where city_code = 'ZGG' or airport_code = 'ZGG';
update airport set timezone = 'Europe/London' where city_code = 'QQU' or airport_code = 'QQU';
update airport set timezone = 'Europe/London' where city_code = 'QQW' or airport_code = 'QQW';
update airport set timezone = 'Asia/Magadan' where city_code = 'KVM' or airport_code = 'KVM';
update airport set timezone = 'Asia/Magadan' where city_code = 'ZKP' or airport_code = 'ZKP';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'UMS' or airport_code = 'UMS';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'ADH' or airport_code = 'ADH';
update airport set timezone = 'Asia/Chongqing' where city_code = 'NLT' or airport_code = 'NLT';
update airport set timezone = 'America/Anchorage' where city_code = 'PTA' or airport_code = 'PTA';
update airport set timezone = 'Europe/Paris' where city_code = 'BOR' or airport_code = 'BOR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BHZ' or airport_code = 'BHZ';
update airport set timezone = 'America/New_York' where city_code = 'FDW' or airport_code = 'FDW';
update airport set timezone = 'Africa/Djibouti' where city_code = 'OBC' or airport_code = 'OBC';
update airport set timezone = 'Africa/Djibouti' where city_code = 'TDJ' or airport_code = 'TDJ';
update airport set timezone = 'America/Guatemala' where city_code = 'AQB' or airport_code = 'AQB';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'NOR' or airport_code = 'NOR';
update airport set timezone = 'Europe/Istanbul' where city_code = 'BTZ' or airport_code = 'BTZ';
update airport set timezone = 'America/New_York' where city_code = 'DAW' or airport_code = 'DAW';
update airport set timezone = 'Asia/Jayapura' where city_code = 'WAR' or airport_code = 'WAR';
update airport set timezone = 'America/Anchorage' where city_code = 'PRL' or airport_code = 'PRL';
update airport set timezone = 'America/Chicago' where city_code = 'EWK' or airport_code = 'EWK';
update airport set timezone = 'Australia/Hobart' where city_code = 'BSJ' or airport_code = 'BSJ';
update airport set timezone = 'America/New_York' where city_code = 'TZR' or airport_code = 'TZR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'W04' or airport_code = 'W04';
update airport set timezone = 'America/Los_Angeles' where city_code = '55S' or airport_code = '55S';
update airport set timezone = 'America/Denver' where city_code = 'FBR' or airport_code = 'FBR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'S40' or airport_code = 'S40';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CLS' or airport_code = 'CLS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'M94' or airport_code = 'M94';
update airport set timezone = 'America/Los_Angeles' where city_code = 'S30' or airport_code = 'S30';
update airport set timezone = 'America/Denver' where city_code = 'EVW' or airport_code = 'EVW';
update airport set timezone = 'America/Chicago' where city_code = 'K83' or airport_code = 'K83';
update airport set timezone = '\N' where city_code = 'LRO' or airport_code = 'LRO';
update airport set timezone = 'America/New_York' where city_code = 'ACJ' or airport_code = 'ACJ';
update airport set timezone = 'America/Chicago' where city_code = 'EUF' or airport_code = 'EUF';
update airport set timezone = 'America/New_York' where city_code = '6J4' or airport_code = '6J4';
update airport set timezone = 'America/New_York' where city_code = 'MQI' or airport_code = 'MQI';
update airport set timezone = 'America/Chicago' where city_code = 'AUO' or airport_code = 'AUO';
update airport set timezone = 'America/New_York' where city_code = 'CZG' or airport_code = 'CZG';
update airport set timezone = 'America/Chicago' where city_code = 'EKY' or airport_code = 'EKY';
update airport set timezone = 'America/Denver' where city_code = 'A50' or airport_code = 'A50';
update airport set timezone = 'Asia/Bishkek' where city_code = 'ИКУ' or airport_code = 'ИКУ';
update airport set timezone = 'America/Chicago' where city_code = 'MIC' or airport_code = 'MIC';
update airport set timezone = 'America/Chicago' where city_code = '23M' or airport_code = '23M';
update airport set timezone = 'America/New_York' where city_code = 'DBN' or airport_code = 'DBN';
update airport set timezone = 'America/New_York' where city_code = 'UCA' or airport_code = 'UCA';
update airport set timezone = '\N' where city_code = 'PUK' or airport_code = 'PUK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CVO' or airport_code = 'CVO';
update airport set timezone = 'Australia/Adelaide' where city_code = 'PXH' or airport_code = 'PXH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CWT' or airport_code = 'CWT';
update airport set timezone = 'America/Vancouver' where city_code = 'YGG' or airport_code = 'YGG';
update airport set timezone = 'America/Vancouver' where city_code = 'YPT' or airport_code = 'YPT';
update airport set timezone = 'America/Vancouver' where city_code = 'YMU' or airport_code = 'YMU';
update airport set timezone = 'America/Vancouver' where city_code = 'YMP' or airport_code = 'YMP';
update airport set timezone = 'America/Vancouver' where city_code = 'YTG' or airport_code = 'YTG';
update airport set timezone = 'America/Los_Angeles' where city_code = 'DHB' or airport_code = 'DHB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OLT' or airport_code = 'OLT';
update airport set timezone = 'America/Detroit' where city_code = '3BB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'AAB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'AAG';
update airport set timezone = 'America/Araguaina' where city_code = 'AAI';
update airport set timezone = 'Asia/Jayapura' where city_code = 'AAS';
update airport set timezone = 'Asia/Manila' where city_code = 'AAV';
update airport set timezone = 'Africa/Lagos' where city_code = 'ABB';
update airport set timezone = 'Europe/Madrid' where city_code = 'ABC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ABG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ABH';
update airport set timezone = 'Africa/Abidjan' where city_code = 'ABO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ABP';
update airport set timezone = 'Asia/Makassar' where city_code = 'ABU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ABW';
update airport set timezone = 'America/Detroit' where city_code = 'ACB';
update airport set timezone = 'America/Bogota' where city_code = 'ACL';
update airport set timezone = 'America/Bogota' where city_code = 'ACM';
update airport set timezone = 'America/Matamoros' where city_code = 'ACN';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'ACS';
update airport set timezone = 'Asia/Tehran' where city_code = 'ACZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ADC';
update airport set timezone = 'America/Detroit' where city_code = 'ADG';
update airport set timezone = 'Africa/Windhoek' where city_code = 'ADI';
update airport set timezone = 'America/Bogota' where city_code = 'ADN';
update airport set timezone = 'Australia/Adelaide' where city_code = 'ADO';
update airport set timezone = 'Asia/Colombo' where city_code = 'ADP';
update airport set timezone = 'America/New_York' where city_code = 'ADR';
update airport set timezone = 'America/Chicago' where city_code = 'ADT';
update airport set timezone = 'Africa/Khartoum' where city_code = 'ADV';
update airport set timezone = 'Africa/Juba' where city_code = 'AEE';
update airport set timezone = 'Asia/Jakarta' where city_code = 'AEG';
update airport set timezone = 'Europe/Madrid' where city_code = 'AEI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AEK';
update airport set timezone = 'America/Chicago' where city_code = 'AEL';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'AEO';
update airport set timezone = 'Asia/Tehran' where city_code = 'AEU';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'AFD';
update airport set timezone = 'America/Denver' where city_code = 'AFF';
update airport set timezone = 'America/Bogota' where city_code = 'AFI';
update airport set timezone = 'America/New_York' where city_code = 'AFN';
update airport set timezone = 'America/Denver' where city_code = 'AFO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AFR';
update airport set timezone = 'Asia/Jayapura' where city_code = 'AGD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AGK';
update airport set timezone = 'America/Chicago' where city_code = 'AGO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'AGW';
update airport set timezone = 'Australia/Perth' where city_code = 'AGY';
update airport set timezone = 'Asia/Tokyo' where city_code = 'AHA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'AHC';
update airport set timezone = 'America/Chicago' where city_code = 'AHD';
update airport set timezone = 'America/Chicago' where city_code = 'AHF';
update airport set timezone = 'America/Chicago' where city_code = 'AHH';
update airport set timezone = 'Asia/Jayapura' where city_code = 'AHI';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AHJ';
update airport set timezone = 'America/Guyana' where city_code = 'AHL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'AHM';
update airport set timezone = 'America/Adak' where city_code = 'AHT';
update airport set timezone = 'Asia/Muscat' where city_code = 'AHW';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'AHY';
update airport set timezone = 'Europe/Paris' where city_code = 'AHZ';
update airport set timezone = 'America/Juneau' where city_code = 'AIB';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'AID';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'AIF';
update airport set timezone = 'Africa/Bangui' where city_code = 'AIG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AIH';
update airport set timezone = 'Africa/Djibouti' where city_code = 'AII';
update airport set timezone = 'America/Panama' where city_code = 'AIL';
update airport set timezone = 'America/Chicago' where city_code = 'AIO';
update airport set timezone = 'America/Cuiaba' where city_code = 'AIR';
update airport set timezone = 'America/Chicago' where city_code = 'AIV';
update airport set timezone = 'Africa/Windhoek' where city_code = 'AIW';
update airport set timezone = 'America/New_York' where city_code = 'AIY';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'AJJ';
update airport set timezone = 'Asia/Tehran' where city_code = 'AJK';
update airport set timezone = 'America/Hermosillo' where city_code = 'AJS';
update airport set timezone = 'Africa/Libreville' where city_code = 'AKE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AKG';
update airport set timezone = 'Asia/Riyadh' where city_code = 'AKH';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'AKM';
update airport set timezone = 'America/Denver' where city_code = 'AKO';
update airport set timezone = 'Asia/Jakarta' where city_code = 'AKQ';
update airport set timezone = 'Asia/Tehran' where city_code = 'AKW';
update airport set timezone = 'America/Lima' where city_code = 'ALD';
update airport set timezone = 'America/Chicago' where city_code = 'ALE';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'ALK';
update airport set timezone = 'America/Chicago' where city_code = 'ALN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ALQ';
update airport set timezone = 'America/Santarem' where city_code = 'ALT';
update airport set timezone = 'Europe/Andorra' where city_code = 'ALV';
update airport set timezone = 'Africa/Maputo' where city_code = 'AME';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AMF';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AMG';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'AMJ';
update airport set timezone = 'America/Denver' where city_code = 'AMK';
update airport set timezone = 'America/Panama' where city_code = 'AML';
update airport set timezone = 'America/Detroit' where city_code = 'AMN';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'AMO';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'AMP';
update airport set timezone = 'Australia/Adelaide' where city_code = 'AMT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AMU';
update airport set timezone = 'America/Chicago' where city_code = 'AMW';
update airport set timezone = 'Australia/Darwin' where city_code = 'AMX';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'ANJ';
update airport set timezone = 'Africa/Luanda' where city_code = 'ANL';
update airport set timezone = 'Africa/Maputo' where city_code = 'ANO';
update airport set timezone = 'Europe/Vienna' where city_code = 'ANT';
update airport set timezone = 'America/Chicago' where city_code = 'ANW';
update airport set timezone = 'America/Chicago' where city_code = 'ANY';
update airport set timezone = 'Australia/Darwin' where city_code = 'ANZ';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'AOD';
update airport set timezone = 'Asia/Shanghai' where city_code = 'AOG';
update airport set timezone = 'Asia/Muscat' where city_code = 'AOM';
update airport set timezone = 'America/Lima' where city_code = 'AOP';
update airport set timezone = 'America/Godthab' where city_code = 'AOQ';
update airport set timezone = 'Asia/Vientiane' where city_code = 'AOU';
update airport set timezone = 'America/La_Paz' where city_code = 'APB';
update airport set timezone = 'America/New_York' where city_code = 'APH';
update airport set timezone = 'America/Bogota' where city_code = 'API';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'APP';
update airport set timezone = 'America/Maceio' where city_code = 'APQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'APR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'APS';
update airport set timezone = 'America/Chicago' where city_code = 'APT';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'APU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'APV';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'APX';
update airport set timezone = 'America/Fortaleza' where city_code = 'APY';
update airport set timezone = 'America/Porto_Velho' where city_code = 'AQM';
update airport set timezone = 'America/Bogota' where city_code = 'ARF';
update airport set timezone = 'America/Chicago' where city_code = 'ARG';
update airport set timezone = 'Asia/Jayapura' where city_code = 'ARJ';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'ARL';
update airport set timezone = 'America/Bogota' where city_code = 'ARO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ARP';
update airport set timezone = 'America/Bogota' where city_code = 'ARQ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ARS';
update airport set timezone = 'America/New_York' where city_code = 'ARX';
update airport set timezone = 'Australia/Melbourne' where city_code = 'ARY';
update airport set timezone = 'Africa/Luanda' where city_code = 'ARZ';
update airport set timezone = 'America/La_Paz' where city_code = 'ASC';
update airport set timezone = 'Pacific/Auckland' where city_code = 'ASG';
update airport set timezone = 'America/Chicago' where city_code = 'ASL';
update airport set timezone = 'America/Chicago' where city_code = 'ASN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ASQ';
update airport set timezone = 'America/Chicago' where city_code = 'ASX';
update airport set timezone = 'America/Chicago' where city_code = 'ASY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ASZ';
update airport set timezone = 'America/Chicago' where city_code = 'ATE';
update airport set timezone = 'Asia/Karachi' where city_code = 'ATG';
update airport set timezone = 'America/Montevideo' where city_code = 'ATI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ATN';
update airport set timezone = 'America/New_York' where city_code = 'ATO';
update airport set timezone = 'America/Denver' where city_code = 'ATS';
update airport set timezone = 'America/Adak' where city_code = 'ATU';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'ATV';
update airport set timezone = 'Asia/Almaty' where city_code = 'ATX';
update airport set timezone = 'Australia/Brisbane' where city_code = 'AUD';
update airport set timezone = 'Africa/Cairo' where city_code = 'AUE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AUI';
update airport set timezone = 'America/Chicago' where city_code = 'AUM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'AUN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AUP';
update airport set timezone = 'Asia/Dili' where city_code = 'AUT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AUV';
update airport set timezone = 'America/Chicago' where city_code = 'AUZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AVA';
update airport set timezone = 'Australia/Darwin' where city_code = 'AVG';
update airport set timezone = 'Africa/Libreville' where city_code = 'AWE';
update airport set timezone = 'America/Chicago' where city_code = 'AWM';
update airport set timezone = 'Australia/Adelaide' where city_code = 'AWN';
update airport set timezone = 'Australia/Darwin' where city_code = 'AWP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AWR';
update airport set timezone = 'Australia/Brisbane' where city_code = 'AXC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'AXE';
update airport set timezone = 'Asia/Chongqing' where city_code = 'AXF';
update airport set timezone = 'America/Chicago' where city_code = 'AXG';
update airport set timezone = 'Australia/Darwin' where city_code = 'AXL';
update airport set timezone = 'America/Chicago' where city_code = 'AXN';
update airport set timezone = 'America/Chicago' where city_code = 'AXS';
update airport set timezone = 'America/New_York' where city_code = 'AXV';
update airport set timezone = 'America/Bogota' where city_code = 'AYA';
update airport set timezone = 'America/Bogota' where city_code = 'AYC';
update airport set timezone = 'Australia/Darwin' where city_code = 'AYD';
update airport set timezone = 'America/Bogota' where city_code = 'AYG';
update airport set timezone = 'Australia/Darwin' where city_code = 'AYL';
update airport set timezone = 'Asia/Shanghai' where city_code = 'AYN';
update airport set timezone = 'America/Asuncion' where city_code = 'AYO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'AYR';
update airport set timezone = 'America/New_York' where city_code = 'AYS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AYU';
update airport set timezone = 'Asia/Jayapura' where city_code = 'AYW';
update airport set timezone = 'Asia/Colombo' where city_code = 'AYY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'AZB';
update airport set timezone = 'America/Mexico_City' where city_code = 'AZG';
update airport set timezone = 'America/Cuiaba' where city_code = 'AZL';
update airport set timezone = 'America/Mexico_City' where city_code = 'AZP';
update airport set timezone = 'Africa/Luanda' where city_code = 'AZZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BAA';
update airport set timezone = 'America/Bogota' where city_code = 'BAC';
update airport set timezone = 'Europe/Paris' where city_code = 'BAE';
update airport set timezone = 'America/Costa_Rica' where city_code = 'BAI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BAJ';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'BAN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BAP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BAT';
update airport set timezone = 'Africa/Libreville' where city_code = 'BAW';
update airport set timezone = 'America/Chicago' where city_code = 'BBB';
update airport set timezone = 'America/Chicago' where city_code = 'BBC';
update airport set timezone = 'America/Chicago' where city_code = 'BBD';
update airport set timezone = 'Australia/Perth' where city_code = 'BBE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BBL';
update airport set timezone = 'Africa/Abidjan' where city_code = 'BBV';
update airport set timezone = 'America/Chicago' where city_code = 'BBW';
update airport set timezone = 'Africa/Bangui' where city_code = 'BBY';
update airport set timezone = 'Africa/Lusaka' where city_code = 'BBZ';
update airport set timezone = 'America/New_York' where city_code = 'BCB';
update airport set timezone = 'America/Anchorage' where city_code = 'BCC';
update airport set timezone = 'Africa/Bangui' where city_code = 'BCF';
update airport set timezone = 'America/Guyana' where city_code = 'BCG';
update airport set timezone = 'Asia/Dili' where city_code = 'BCH';
update airport set timezone = 'America/Denver' where city_code = 'BCJ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BCK';
update airport set timezone = 'Africa/Tripoli' where city_code = 'BCQ';
update airport set timezone = 'America/Manaus' where city_code = 'BCR';
update airport set timezone = 'Africa/Lagos' where city_code = 'BCU';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'BCX';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'BCY';
update airport set timezone = 'Australia/Darwin' where city_code = 'BCZ';
update airport set timezone = 'America/Fortaleza' where city_code = 'BDC';
update airport set timezone = 'America/Chicago' where city_code = 'BDF';
update airport set timezone = 'America/Denver' where city_code = 'BDG';
update airport set timezone = 'Africa/Abidjan' where city_code = 'BDK';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'BDV';
update airport set timezone = 'Australia/Perth' where city_code = 'BDW';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BDY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BDZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BEA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BEE';
update airport set timezone = 'Africa/Bangui' where city_code = 'BEM';
update airport set timezone = 'Europe/London' where city_code = 'BEX';
update airport set timezone = 'America/Asuncion' where city_code = 'BFA';
update airport set timezone = 'America/Anchorage' where city_code = 'BFB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BFC';
update airport set timezone = 'Europe/Berlin' where city_code = 'BFE';
update airport set timezone = 'America/Denver' where city_code = 'BFG';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'BFR';
update airport set timezone = 'Asia/Shanghai' where city_code = 'BFU';
update airport set timezone = 'Africa/Algiers' where city_code = 'BFW';
update airport set timezone = 'Africa/Libreville' where city_code = 'BGB';
update airport set timezone = 'America/Chicago' where city_code = 'BGD';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'BGH';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'BGJ';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'BGL';
update airport set timezone = 'Asia/Magadan' where city_code = 'BGN';
update airport set timezone = 'Africa/Libreville' where city_code = 'BGP';
update airport set timezone = 'America/Anchorage' where city_code = 'BGQ';
update airport set timezone = 'America/Phoenix' where city_code = 'BGT';
update airport set timezone = 'Africa/Bangui' where city_code = 'BGU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BGV';
update airport set timezone = 'Europe/Lisbon' where city_code = 'BGZ';
update airport set timezone = 'America/Guayaquil' where city_code = 'BHA';
update airport set timezone = 'Asia/Karachi' where city_code = 'BHC';
update airport set timezone = 'America/Santa_Isabel' where city_code = 'BHL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BHT';
update airport set timezone = 'Asia/Karachi' where city_code = 'BHW';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'BIB';
update airport set timezone = 'America/Anchorage' where city_code = 'BIC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BIH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BIJ';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'BIT';
update airport set timezone = 'Australia/Perth' where city_code = 'BIW';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'BJD';
update airport set timezone = 'Africa/Khartoum' where city_code = 'BJE';
update airport set timezone = 'Asia/Makassar' where city_code = 'BJG';
update airport set timezone = 'America/New_York' where city_code = 'BJJ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'BJK';
update airport set timezone = 'Asia/Muscat' where city_code = 'BJQ';
update airport set timezone = 'Asia/Makassar' where city_code = 'BJW';
update airport set timezone = 'Europe/Belgrade' where city_code = 'BJY';
update airport set timezone = 'Asia/Kolkata' where city_code = 'BKB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BKE';
update airport set timezone = 'Africa/Conakry' where city_code = 'BKJ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BKP';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'BKR';
update airport set timezone = 'America/New_York' where city_code = 'BKT';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'BKU';
update airport set timezone = 'America/Panama' where city_code = 'BLB';
update airport set timezone = 'Africa/Douala' where city_code = 'BLC';
update airport set timezone = 'America/New_York' where city_code = 'BLM';
update airport set timezone = 'Australia/Melbourne' where city_code = 'BLN';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'BLO';
update airport set timezone = 'America/Lima' where city_code = 'BLP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BLS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BLU';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'BLW';
update airport set timezone = 'Europe/Rome' where city_code = 'BLX';
update airport set timezone = 'Europe/Dublin' where city_code = 'BLY';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'BMB';
update airport set timezone = 'Africa/Bangui' where city_code = 'BMF';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BMH';
update airport set timezone = 'America/Guyana' where city_code = 'BMJ';
update airport set timezone = 'America/New_York' where city_code = 'BML';
update airport set timezone = 'Asia/Baghdad' where city_code = 'BMN';
update airport set timezone = 'Europe/Berlin' where city_code = 'BMR';
update airport set timezone = 'America/Bahia' where city_code = 'BMS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BMZ';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'BNB';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'BNC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BNG';
update airport set timezone = 'America/New_York' where city_code = 'BNL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BNO';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'BNR';
update airport set timezone = 'America/Chicago' where city_code = 'BNW';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BNZ';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'BOE';
update airport set timezone = 'America/New_York' where city_code = 'BOF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BOK';
update airport set timezone = 'Europe/London' where city_code = 'BOL';
update airport set timezone = 'Africa/Bangui' where city_code = 'BOP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BOQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BOV';
update airport set timezone = 'Africa/Bangui' where city_code = 'BOZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BPD';
update airport set timezone = 'America/Cuiaba' where city_code = 'BPG';
update airport set timezone = 'Asia/Manila' where city_code = 'BPH';
update airport set timezone = 'America/Denver' where city_code = 'BPI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BPK';
update airport set timezone = 'Asia/Kashgar' where city_code = 'BPL';
update airport set timezone = 'Asia/Manila' where city_code = 'BQA';
update airport set timezone = 'Africa/Bissau' where city_code = 'BQE';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'BQG';
update airport set timezone = 'Africa/Windhoek' where city_code = 'BQI';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'BQJ';
update airport set timezone = 'Africa/Abidjan' where city_code = 'BQO';
update airport set timezone = 'America/Bahia' where city_code = 'BQQ';
update airport set timezone = 'Australia/Perth' where city_code = 'BQW';
update airport set timezone = 'America/Fortaleza' where city_code = 'BRB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BRH';
update airport set timezone = 'Australia/Melbourne' where city_code = 'BRJ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BRP';
update airport set timezone = 'America/New_York' where city_code = 'BRY';
update airport set timezone = 'Asia/Kuching' where city_code = 'BSE';
update airport set timezone = 'America/New_York' where city_code = 'BSI';
update airport set timezone = 'Asia/Tehran' where city_code = 'BSM';
update airport set timezone = 'Africa/Bangui' where city_code = 'BSN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BSP';
update airport set timezone = 'America/Phoenix' where city_code = 'BSQ';
update airport set timezone = 'America/Fortaleza' where city_code = 'BSS';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'BSV';
update airport set timezone = 'America/Anchorage' where city_code = 'BSW';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'BSY';
update airport set timezone = 'America/Anchorage' where city_code = 'BSZ';
update airport set timezone = 'Africa/Douala' where city_code = 'BTA';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'BTB';
update airport set timezone = 'Asia/Colombo' where city_code = 'BTC';
update airport set timezone = 'Australia/Darwin' where city_code = 'BTD';
update airport set timezone = 'America/Denver' where city_code = 'BTF';
update airport set timezone = 'Africa/Bangui' where city_code = 'BTG';
update airport set timezone = 'America/Detroit' where city_code = 'BTL';
update airport set timezone = 'America/New_York' where city_code = 'BTN';
update airport set timezone = 'America/New_York' where city_code = 'BTP';
update airport set timezone = 'Africa/Kigali' where city_code = 'BTQ';
update airport set timezone = 'Asia/Jakarta' where city_code = 'BTW';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BTX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BTY';
update airport set timezone = 'America/Chicago' where city_code = 'BUB';
update airport set timezone = 'Africa/Algiers' where city_code = 'BUJ';
update airport set timezone = 'Asia/Aden' where city_code = 'BUK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BUL';
update airport set timezone = 'America/Chicago' where city_code = 'BUM';
update airport set timezone = 'Asia/Kolkata' where city_code = 'BUP';
update airport set timezone = 'Asia/Thimphu' where city_code = 'BUT';
update airport set timezone = 'America/Montevideo' where city_code = 'BUV';
update airport set timezone = 'Asia/Makassar' where city_code = 'BUW';
update airport set timezone = 'Pacific/Fiji' where city_code = 'BVF';
update airport set timezone = 'America/La_Paz' where city_code = 'BVK';
update airport set timezone = 'America/La_Paz' where city_code = 'BVL';
update airport set timezone = 'America/Bahia' where city_code = 'BVM';
update airport set timezone = 'America/Chicago' where city_code = 'BVO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BVP';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'BVR';
update airport set timezone = 'America/Anchorage' where city_code = 'BVU';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BVW';
update airport set timezone = 'America/Chicago' where city_code = 'BVX';
update airport set timezone = 'Australia/Perth' where city_code = 'BVZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BWC';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'BWH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BWJ';
update airport set timezone = 'America/Chicago' where city_code = 'BWL';
update airport set timezone = 'America/Denver' where city_code = 'BWM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BWP';
update airport set timezone = 'Australia/Sydney' where city_code = 'BWQ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'BWS';
update airport set timezone = 'America/Havana' where city_code = 'BWW';
update airport set timezone = 'Asia/Jakarta' where city_code = 'BWX';
update airport set timezone = 'Europe/London' where city_code = 'BWY';
update airport set timezone = 'America/Chicago' where city_code = 'BXA';
update airport set timezone = 'Asia/Jayapura' where city_code = 'BXD';
update airport set timezone = 'Australia/Perth' where city_code = 'BXF';
update airport set timezone = 'Australia/Melbourne' where city_code = 'BXG';
update airport set timezone = 'Africa/Abidjan' where city_code = 'BXI';
update airport set timezone = 'Asia/Almaty' where city_code = 'BXJ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'BXM';
update airport set timezone = 'Europe/Warsaw' where city_code = 'BXP';
update airport set timezone = 'Asia/Makassar' where city_code = 'BXT';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'BXV';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'BXZ';
update airport set timezone = 'America/Anchorage' where city_code = 'BYA';
update airport set timezone = 'Asia/Dubai' where city_code = 'BYB';
update airport set timezone = 'Asia/Aden' where city_code = 'BYD';
update airport set timezone = 'Europe/Paris' where city_code = 'BYF';
update airport set timezone = 'America/Denver' where city_code = 'BYG';
update airport set timezone = 'America/Boise' where city_code = 'BYI';
update airport set timezone = 'Europe/Lisbon' where city_code = 'BYJ';
update airport set timezone = 'Australia/Perth' where city_code = 'BYP';
update airport set timezone = 'Asia/Makassar' where city_code = 'BYQ';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'BYR';
update airport set timezone = 'Australia/Darwin' where city_code = 'BYX';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'BZC';
update airport set timezone = 'Australia/Sydney' where city_code = 'BZD';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'BZM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'BZP';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'BZU';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'CAA';
update airport set timezone = 'America/Detroit' where city_code = 'CAD';
update airport set timezone = 'America/La_Paz' where city_code = 'CAM';
update airport set timezone = 'America/Denver' where city_code = 'CAO';
update airport set timezone = 'Africa/Casablanca' where city_code = 'CAS';
update airport set timezone = 'Africa/Luanda' where city_code = 'CAV';
update airport set timezone = 'Australia/Perth' where city_code = 'CBC';
update airport set timezone = 'Asia/Kolkata' where city_code = 'CBD';
update airport set timezone = 'America/Chicago' where city_code = 'CBF';
update airport set timezone = 'Australia/Hobart' where city_code = 'CBI';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'CBJ';
update airport set timezone = 'America/Chicago' where city_code = 'CBK';
update airport set timezone = 'Europe/Lisbon' where city_code = 'CBP';
update airport set timezone = 'America/Caracas' where city_code = 'CBS';
update airport set timezone = 'Europe/Berlin' where city_code = 'CBU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CBW';
update airport set timezone = 'Australia/Sydney' where city_code = 'CBX';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CBY';
update airport set timezone = 'America/Juneau' where city_code = 'CBZ';
update airport set timezone = 'America/Chicago' where city_code = 'CCA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CCB';
update airport set timezone = 'America/Marigot' where city_code = 'CCE';
update airport set timezone = 'America/Chicago' where city_code = 'CCG';
update airport set timezone = 'America/Bahia' where city_code = 'CCQ';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'CCT';
update airport set timezone = 'Australia/Adelaide' where city_code = 'CCW';
update airport set timezone = 'America/Cuiaba' where city_code = 'CCX';
update airport set timezone = 'America/Chicago' where city_code = 'CCY';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'CDD';
update airport set timezone = 'America/Panama' where city_code = 'CDE';
update airport set timezone = 'America/Chicago' where city_code = 'CDH';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CDQ';
update airport set timezone = 'Europe/Madrid' where city_code = 'CDT';
update airport set timezone = 'Asia/Manila' where city_code = 'CDY';
update airport set timezone = 'America/Bogota' where city_code = 'CEA';
update airport set timezone = 'Africa/Blantyre' where city_code = 'CEH';
update airport set timezone = 'America/Nassau' where city_code = 'CEL';
update airport set timezone = 'Africa/Luanda' where city_code = 'CEO';
update airport set timezone = 'America/La_Paz' where city_code = 'CEP';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'CEV';
update airport set timezone = 'America/Chicago' where city_code = 'CEY';
update airport set timezone = 'America/Anchorage' where city_code = 'CFA';
update airport set timezone = 'Africa/Luanda' where city_code = 'CFF';
update airport set timezone = 'Australia/Adelaide' where city_code = 'CFH';
update airport set timezone = 'Australia/Darwin' where city_code = 'CFI';
update airport set timezone = 'Africa/Algiers' where city_code = 'CFK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CFP';
update airport set timezone = 'America/Phoenix' where city_code = 'CFT';
update airport set timezone = 'America/Chicago' where city_code = 'CFV';
update airport set timezone = 'America/New_York' where city_code = 'CGE';
update airport set timezone = 'Africa/Lusaka' where city_code = 'CGJ';
update airport set timezone = 'America/New_York' where city_code = 'CGS';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'CGT';
update airport set timezone = 'Australia/Perth' where city_code = 'CGV';
update airport set timezone = 'Asia/Karachi' where city_code = 'CHB';
update airport set timezone = 'Asia/Seoul' where city_code = 'CHF';
update airport set timezone = 'Africa/Harare' where city_code = 'CHJ';
update airport set timezone = 'America/Chicago' where city_code = 'CHK';
update airport set timezone = 'America/Boise' where city_code = 'CHL';
update airport set timezone = 'Asia/Seoul' where city_code = 'CHN';
update airport set timezone = 'America/Anchorage' where city_code = 'CHP';
update airport set timezone = 'Europe/Lisbon' where city_code = 'CHV';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CHZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CIB';
update airport set timezone = 'Australia/Perth' where city_code = 'CIE';
update airport set timezone = 'America/Denver' where city_code = 'CIG';
update airport set timezone = 'Europe/Istanbul' where city_code = 'CII';
update airport set timezone = 'America/Bogota' where city_code = 'CIM';
update airport set timezone = 'America/Chicago' where city_code = 'CIN';
update airport set timezone = 'America/Guatemala' where city_code = 'CIQ';
update airport set timezone = 'America/Chicago' where city_code = 'CIR';
update airport set timezone = 'America/Juneau' where city_code = 'CIV';
update airport set timezone = 'America/Bogota' where city_code = 'CJD';
update airport set timezone = 'Australia/Perth' where city_code = 'CJF';
update airport set timezone = 'America/Vancouver' where city_code = 'CJH';
update airport set timezone = 'America/Mexico_City' where city_code = 'CJT';
update airport set timezone = 'America/Chicago' where city_code = 'CKA';
update airport set timezone = 'Australia/Darwin' where city_code = 'CKI';
update airport set timezone = 'America/Chicago' where city_code = 'CKM';
update airport set timezone = 'America/Chicago' where city_code = 'CKN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CKO';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CKR';
update airport set timezone = 'Asia/Tehran' where city_code = 'CKT';
update airport set timezone = 'America/Anchorage' where city_code = 'CKU';
update airport set timezone = 'America/Anchorage' where city_code = 'CKX';
update airport set timezone = 'Asia/Dhaka' where city_code = 'CLA';
update airport set timezone = 'Europe/London' where city_code = 'CLF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CLG';
update airport set timezone = 'Australia/Sydney' where city_code = 'CLH';
update airport set timezone = 'America/Chicago' where city_code = 'CLI';
update airport set timezone = 'America/Chicago' where city_code = 'CLK';
update airport set timezone = 'America/Anchorage' where city_code = 'CLP';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'CLU';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'CLX';
update airport set timezone = 'America/Caracas' where city_code = 'CLZ';
update airport set timezone = 'America/Fortaleza' where city_code = 'CMC';
update airport set timezone = 'Australia/Sydney' where city_code = 'CMD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CML';
update airport set timezone = 'America/Guatemala' where city_code = 'CMM';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'CMO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CMQ';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'CMS';
update airport set timezone = 'America/Belem' where city_code = 'CMT';
update airport set timezone = 'Pacific/Auckland' where city_code = 'CMV';
update airport set timezone = 'America/Chicago' where city_code = 'CMY';
update airport set timezone = 'America/Hermosillo' where city_code = 'CNA';
update airport set timezone = 'America/Denver' where city_code = 'CNE';
update airport set timezone = 'America/New_York' where city_code = 'CNH';
update airport set timezone = 'America/Chicago' where city_code = 'CNK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CNO';
update airport set timezone = 'America/Santiago' where city_code = 'CNR';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'CNT';
update airport set timezone = 'America/Chicago' where city_code = 'CNU';
update airport set timezone = 'America/Bahia' where city_code = 'CNV';
update airport set timezone = 'Africa/Luanda' where city_code = 'CNZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'COA';
update airport set timezone = 'Australia/Darwin' where city_code = 'COB';
update airport set timezone = 'America/Chicago' where city_code = 'COM';
update airport set timezone = 'America/New_York' where city_code = 'COP';
update airport set timezone = 'Europe/Lisbon' where city_code = 'COV';
update airport set timezone = 'Australia/Perth' where city_code = 'COY';
update airport set timezone = 'Asia/Jakarta' where city_code = 'CPF';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'CPG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'CPI';
update airport set timezone = 'America/Bogota' where city_code = 'CPL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CPM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'CPN';
update airport set timezone = 'America/Fortaleza' where city_code = 'CPU';
update airport set timezone = 'America/Cuiaba' where city_code = 'CQA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CQP';
update airport set timezone = 'America/Porto_Velho' where city_code = 'CQS';
update airport set timezone = 'America/Bogota' where city_code = 'CQT';
update airport set timezone = 'Australia/Sydney' where city_code = 'CRB';
update airport set timezone = 'Africa/Bangui' where city_code = 'CRF';
update airport set timezone = 'America/New_York' where city_code = 'CRG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CRH';
update airport set timezone = 'Australia/Adelaide' where city_code = 'CRJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CRO';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'CRR';
update airport set timezone = 'America/Chicago' where city_code = 'CRS';
update airport set timezone = 'America/Chicago' where city_code = 'CRT';
update airport set timezone = 'America/Chicago' where city_code = 'CRX';
update airport set timezone = 'Australia/Perth' where city_code = 'CRY';
update airport set timezone = 'Australia/Darwin' where city_code = 'CSD';
update airport set timezone = 'Australia/Sydney' where city_code = 'CSI';
update airport set timezone = 'America/New_York' where city_code = 'CSJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CSL';
update airport set timezone = 'America/Chicago' where city_code = 'CSM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CSN';
update airport set timezone = 'America/Juneau' where city_code = 'CSP';
update airport set timezone = 'America/Chicago' where city_code = 'CSQ';
update airport set timezone = 'America/Campo_Grande' where city_code = 'CSS';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CSU';
update airport set timezone = 'America/Chicago' where city_code = 'CSV';
update airport set timezone = 'America/Porto_Velho' where city_code = 'CSW';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'CSZ';
update airport set timezone = 'America/Panama' where city_code = 'CTE';
update airport set timezone = 'America/Guatemala' where city_code = 'CTF';
update airport set timezone = 'Africa/Luanda' where city_code = 'CTI';
update airport set timezone = 'America/Chicago' where city_code = 'CTK';
update airport set timezone = 'America/New_York' where city_code = 'CTO';
update airport set timezone = 'America/Fortaleza' where city_code = 'CTP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CTQ';
update airport set timezone = 'Australia/Darwin' where city_code = 'CTR';
update airport set timezone = 'America/Phoenix' where city_code = 'CTW';
update airport set timezone = 'America/New_York' where city_code = 'CTZ';
update airport set timezone = 'America/New_York' where city_code = 'CUB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CUD';
update airport set timezone = 'Australia/Sydney' where city_code = 'CUG';
update airport set timezone = 'America/Chicago' where city_code = 'CUH';
update airport set timezone = 'America/Bogota' where city_code = 'CUI';
update airport set timezone = 'America/Bogota' where city_code = 'CUO';
update airport set timezone = 'America/Denver' where city_code = 'CUS';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'CUT';
update airport set timezone = 'America/Caracas' where city_code = 'CUV';
update airport set timezone = 'America/Juneau' where city_code = 'CUW';
update airport set timezone = 'Australia/Perth' where city_code = 'CUY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'CVB';
update airport set timezone = 'Australia/Adelaide' where city_code = 'CVC';
update airport set timezone = 'America/Bogota' where city_code = 'CVE';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'CVH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'CVL';
update airport set timezone = 'America/Chicago' where city_code = 'CWF';
update airport set timezone = 'America/Chicago' where city_code = 'CWO';
update airport set timezone = 'Australia/Adelaide' where city_code = 'CWR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CWS';
update airport set timezone = 'Australia/Sydney' where city_code = 'CWW';
update airport set timezone = 'America/Phoenix' where city_code = 'CWX';
update airport set timezone = 'America/Caracas' where city_code = 'CXA';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'CXN';
update airport set timezone = 'Australia/Perth' where city_code = 'CXQ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CXT';
update airport set timezone = 'America/Port-au-Prince' where city_code = 'CYA';
update airport set timezone = 'Australia/Melbourne' where city_code = 'CYG';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'CYL';
update airport set timezone = 'America/Merida' where city_code = 'CZA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'CZB';
update airport set timezone = 'America/Anchorage' where city_code = 'CZC';
update airport set timezone = 'America/Panama' where city_code = 'CZJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'CZK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'CZY';
update airport set timezone = 'America/New_York' where city_code = 'DAA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'DAG';
update airport set timezone = 'Asia/Aden' where city_code = 'DAH';
update airport set timezone = 'Asia/Kolkata' where city_code = 'DAI';
update airport set timezone = 'Africa/Cairo' where city_code = 'DAK';
update airport set timezone = 'America/New_York' where city_code = 'DAN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'DAO';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'DAP';
update airport set timezone = 'America/Yellowknife' where city_code = 'DAS';
update airport set timezone = 'Asia/Kabul' where city_code = 'DAZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'DBP';
update airport set timezone = 'America/Boise' where city_code = 'DBS';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DBY';
update airport set timezone = 'America/Anchorage' where city_code = 'DCK';
update airport set timezone = 'Australia/Perth' where city_code = 'DCN';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'DCR';
update airport set timezone = 'Europe/London' where city_code = 'DCS';
update airport set timezone = 'America/Nassau' where city_code = 'DCT';
update airport set timezone = 'America/Chicago' where city_code = 'DCU';
update airport set timezone = 'America/New_York' where city_code = 'DDH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'DDM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DDN';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'DDP';
update airport set timezone = 'Asia/Karachi' where city_code = 'DDU';
update airport set timezone = 'Asia/Tehran' where city_code = 'DEF';
update airport set timezone = 'America/Chicago' where city_code = 'DEH';
update airport set timezone = 'Indian/Mahe' where city_code = 'DEI';
update airport set timezone = 'Asia/Kolkata' where city_code = 'DEP';
update airport set timezone = 'America/Chicago' where city_code = 'DEQ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'DEW';
update airport set timezone = 'America/New_York' where city_code = 'DFI';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DFP';
update airport set timezone = 'America/Anchorage' where city_code = 'DGB';
update airport set timezone = 'Australia/Perth' where city_code = 'DGD';
update airport set timezone = 'America/Vancouver' where city_code = 'DGF';
update airport set timezone = 'Africa/Maputo' where city_code = 'DGK';
update airport set timezone = 'America/New_York' where city_code = 'DGN';
update airport set timezone = 'Europe/Riga' where city_code = 'DGP';
update airport set timezone = 'Pacific/Auckland' where city_code = 'DGR';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'DGU';
update airport set timezone = 'America/Denver' where city_code = 'DGW';
update airport set timezone = 'Europe/London' where city_code = 'DGX';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DHD';
update airport set timezone = 'Asia/Dubai' where city_code = 'DHF';
update airport set timezone = 'Asia/Aden' where city_code = 'DHL';
update airport set timezone = 'Africa/Abidjan' where city_code = 'DIM';
update airport set timezone = 'America/Nome' where city_code = 'DIO';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'DIP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'DIQ';
update airport set timezone = 'Africa/Abidjan' where city_code = 'DIV';
update airport set timezone = 'Africa/Porto-Novo' where city_code = 'DJA';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'DJM';
update airport set timezone = 'America/Anchorage' where city_code = 'DJN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DJR';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'DJU';
update airport set timezone = 'Africa/Lagos' where city_code = 'DKA';
update airport set timezone = 'Australia/Darwin' where city_code = 'DKV';
update airport set timezone = 'Australia/Adelaide' where city_code = 'DLK';
update airport set timezone = 'America/Denver' where city_code = 'DLN';
update airport set timezone = 'America/Juneau' where city_code = 'DLO';
update airport set timezone = 'America/Los_Angeles' where city_code = 'DLS';
update airport set timezone = 'Australia/Darwin' where city_code = 'DLV';
update airport set timezone = 'America/Denver' where city_code = 'DMN';
update airport set timezone = 'America/Chicago' where city_code = 'DMO';
update airport set timezone = 'Asia/Aden' where city_code = 'DMR';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DNB';
update airport set timezone = 'America/Chicago' where city_code = 'DNE';
update airport set timezone = 'Africa/Tripoli' where city_code = 'DNF';
update airport set timezone = 'Australia/Perth' where city_code = 'DNG';
update airport set timezone = 'Africa/Khartoum' where city_code = 'DNI';
update airport set timezone = 'Australia/Perth' where city_code = 'DNM';
update airport set timezone = 'America/Araguaina' where city_code = 'DNO';
update airport set timezone = 'Australia/Sydney' where city_code = 'DNQ';
update airport set timezone = 'America/Chicago' where city_code = 'DNS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'DNU';
update airport set timezone = 'Africa/Khartoum' where city_code = 'DNX';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'DOA';
update airport set timezone = 'Asia/Jayapura' where city_code = 'DOB';
update airport set timezone = 'Europe/London' where city_code = 'DOC';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'DOI';
update airport set timezone = 'America/Guatemala' where city_code = 'DON';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'DOO';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'DOR';
update airport set timezone = 'America/Denver' where city_code = 'DPG';
update airport set timezone = 'America/New_York' where city_code = 'DPK';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'DPT';
update airport set timezone = 'Asia/Harbin' where city_code = 'DQA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'DRA';
update airport set timezone = 'Africa/Luanda' where city_code = 'DRC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DRD';
update airport set timezone = 'America/Detroit' where city_code = 'DRE';
update airport set timezone = 'Asia/Jayapura' where city_code = 'DRH';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DRN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DRR';
update airport set timezone = 'America/Denver' where city_code = 'DRU';
update airport set timezone = 'Indian/Maldives' where city_code = 'DRV';
update airport set timezone = 'Australia/Perth' where city_code = 'DRY';
update airport set timezone = 'Africa/Douala' where city_code = 'DSC';
update airport set timezone = 'America/Chicago' where city_code = 'DSI';
update airport set timezone = 'America/New_York' where city_code = 'DSV';
update airport set timezone = 'Asia/Manila' where city_code = 'DTE';
update airport set timezone = 'America/Chicago' where city_code = 'DTG';
update airport set timezone = 'America/Los_Angeles' where city_code = 'DTH';
update airport set timezone = 'America/Chicago' where city_code = 'DTL';
update airport set timezone = 'America/Chicago' where city_code = 'DTN';
update airport set timezone = 'America/Chicago' where city_code = 'DTO';
update airport set timezone = 'America/Chicago' where city_code = 'DUA';
update airport set timezone = 'America/New_York' where city_code = 'DUF';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'DUK';
update airport set timezone = 'America/Thule' where city_code = 'DUN';
update airport set timezone = 'America/Vancouver' where city_code = 'DUQ';
update airport set timezone = 'America/Chicago' where city_code = 'DUX';
update airport set timezone = 'America/Yellowknife' where city_code = 'DVK';
update airport set timezone = 'America/Chicago' where city_code = 'DVN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DVP';
update airport set timezone = 'Australia/Darwin' where city_code = 'DVR';
update airport set timezone = 'America/Chicago' where city_code = 'DWN';
update airport set timezone = 'Asia/Kabul' where city_code = 'DWR';
update airport set timezone = 'America/Chicago' where city_code = 'DXX';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DYA';
update airport set timezone = 'America/New_York' where city_code = 'DYL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'DYM';
update airport set timezone = 'America/Chicago' where city_code = 'DYT';
update airport set timezone = 'Australia/Darwin' where city_code = 'DYW';
update airport set timezone = 'America/Montevideo' where city_code = 'DZO';
update airport set timezone = 'Asia/Chongqing' where city_code = 'DZU';
update airport set timezone = 'Asia/Aden' where city_code = 'EAB';
update airport set timezone = 'America/Denver' where city_code = 'EAN';
update airport set timezone = 'Pacific/Kwajalein' where city_code = 'EBN';
update airport set timezone = 'America/Chicago' where city_code = 'EBS';
update airport set timezone = 'Africa/Douala' where city_code = 'EBW';
update airport set timezone = 'Australia/Melbourne' where city_code = 'ECH';
update airport set timezone = 'America/Bogota' where city_code = 'ECO';
update airport set timezone = 'America/Bogota' where city_code = 'ECR';
update airport set timezone = 'America/Denver' where city_code = 'ECS';
update airport set timezone = 'America/Chicago' where city_code = 'ECU';
update airport set timezone = 'America/Sitka' where city_code = 'EDA';
update airport set timezone = 'Africa/Khartoum' where city_code = 'EDB';
update airport set timezone = 'Australia/Darwin' where city_code = 'EDD';
update airport set timezone = 'America/New_York' where city_code = 'EDE';
update airport set timezone = 'America/New_York' where city_code = 'EDG';
update airport set timezone = 'America/Chicago' where city_code = 'EDK';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'EDQ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EED';
update airport set timezone = 'America/Denver' where city_code = 'EEO';
update airport set timezone = 'America/Juneau' where city_code = 'EFB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'EFG';
update airport set timezone = 'America/New_York' where city_code = 'EFK';
update airport set timezone = 'America/Chicago' where city_code = 'EFT';
update airport set timezone = 'Africa/Cairo' where city_code = 'EGH';
update airport set timezone = 'America/Chicago' where city_code = 'EGI';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'EGL';
update airport set timezone = 'America/Chicago' where city_code = 'EGP';
update airport set timezone = 'America/New_York' where city_code = 'EHO';
update airport set timezone = 'America/Chicago' where city_code = 'EHR';
update airport set timezone = 'America/New_York' where city_code = 'EHT';
update airport set timezone = 'Australia/Brisbane' where city_code = 'EIH';
update airport set timezone = 'Europe/Moscow' where city_code = 'EIK';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'EIY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'EJN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EKA';
update airport set timezone = 'Asia/Almaty' where city_code = 'EKB';
update airport set timezone = 'Australia/Darwin' where city_code = 'EKD';
update airport set timezone = 'America/Kentucky/Monticello' where city_code = 'EKQ';
update airport set timezone = 'Asia/Sakhalin' where city_code = 'EKS';
update airport set timezone = 'Europe/Stockholm' where city_code = 'EKT';
update airport set timezone = 'America/New_York' where city_code = 'EKX';
update airport set timezone = 'America/Bogota' where city_code = 'ELB';
update airport set timezone = 'America/Bogota' where city_code = 'ELJ';
update airport set timezone = 'America/Chicago' where city_code = 'ELK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ELN';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'ELO';
update airport set timezone = 'Asia/Jayapura' where city_code = 'ELR';
update airport set timezone = 'America/New_York' where city_code = 'ELZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'EMI';
update airport set timezone = 'Europe/Zurich' where city_code = 'EML';
update airport set timezone = 'America/Denver' where city_code = 'EMM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'EMO';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EMT';
update airport set timezone = 'America/New_York' where city_code = 'EMV';
update airport set timezone = 'America/Argentina/Catamarca' where city_code = 'EMX';
update airport set timezone = 'Africa/Cairo' where city_code = 'EMY';
update airport set timezone = 'Australia/Perth' where city_code = 'ENB';
update airport set timezone = 'America/Guatemala' where city_code = 'ENJ';
update airport set timezone = 'America/Chicago' where city_code = 'ENL';
update airport set timezone = 'America/Anchorage' where city_code = 'ENN';
update airport set timezone = 'America/Asuncion' where city_code = 'ENO';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'ENQ';
update airport set timezone = 'America/Caracas' where city_code = 'EOR';
update airport set timezone = 'America/Chicago' where city_code = 'EOS';
update airport set timezone = 'America/Caracas' where city_code = 'EOZ';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'EPA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EPH';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'EPN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'EPT';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'ERA';
update airport set timezone = 'Australia/Adelaide' where city_code = 'ERB';
update airport set timezone = 'Europe/Zaporozhye' where city_code = 'ERD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ERE';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'ERG';
update airport set timezone = 'Asia/Shanghai' where city_code = 'ERL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ERQ';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'ERT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ERU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ESA';
update airport set timezone = 'America/Asuncion' where city_code = 'ESG';
update airport set timezone = 'America/Denver' where city_code = 'ESO';
update airport set timezone = 'America/New_York' where city_code = 'ESP';
update airport set timezone = 'America/Chicago' where city_code = 'EST';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ESW';
update airport set timezone = 'America/Chicago' where city_code = 'ETB';
update airport set timezone = 'Australia/Adelaide' where city_code = 'ETD';
update airport set timezone = 'America/Guayaquil' where city_code = 'ETR';
update airport set timezone = 'America/Chicago' where city_code = 'ETS';
update airport set timezone = 'Australia/Eucla' where city_code = 'EUC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'EUE';
update airport set timezone = 'America/Boise' where city_code = 'EUL';
update airport set timezone = 'Asia/Manila' where city_code = 'EUQ';
update airport set timezone = 'America/New_York' where city_code = 'EVB';
update airport set timezone = 'Australia/Darwin' where city_code = 'EVD';
update airport set timezone = 'Australia/Sydney' where city_code = 'EVH';
update airport set timezone = 'America/Chicago' where city_code = 'EVM';
update airport set timezone = 'Europe/Paris' where city_code = 'EVX';
update airport set timezone = 'Asia/Jayapura' where city_code = 'EWE';
update airport set timezone = 'Asia/Jayapura' where city_code = 'EWI';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'EWO';
update airport set timezone = 'Europe/London' where city_code = 'EWY';
update airport set timezone = 'America/New_York' where city_code = 'EXX';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'EYE';
update airport set timezone = 'America/New_York' where city_code = 'EYF';
update airport set timezone = 'Africa/Bamako' where city_code = 'EYL';
update airport set timezone = 'Africa/Nairobi' where city_code = 'EYS';
update airport set timezone = 'America/New_York' where city_code = 'EZF';
update airport set timezone = 'America/New_York' where city_code = 'EZM';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'EZV';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'FAC';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'FAG';
update airport set timezone = 'Asia/Kabul' where city_code = 'FAH';
update airport set timezone = 'America/Chicago' where city_code = 'FAL';
update airport set timezone = 'America/Chicago' where city_code = 'FAM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'FAQ';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'FAS';
update airport set timezone = 'Asia/Muscat' where city_code = 'FAU';
update airport set timezone = 'Asia/Tehran' where city_code = 'FAZ';
update airport set timezone = 'America/Chicago' where city_code = 'FBL';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'FCB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FCH';
update airport set timezone = 'America/New_York' where city_code = 'FDK';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'FDO';
update airport set timezone = 'America/Chicago' where city_code = 'FDR';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'FEB';
update airport set timezone = 'America/Bahia' where city_code = 'FEC';
update airport set timezone = 'America/Rio_Branco' where city_code = 'FEJ';
update airport set timezone = 'Africa/Abidjan' where city_code = 'FEK';
update airport set timezone = 'America/Chicago' where city_code = 'FEP';
update airport set timezone = 'America/Chicago' where city_code = 'FET';
update airport set timezone = 'America/Denver' where city_code = 'FEW';
update airport set timezone = 'America/Chicago' where city_code = 'FFL';
update airport set timezone = 'America/Chicago' where city_code = 'FFM';
update airport set timezone = 'America/Santiago' where city_code = 'FFU';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'FGD';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'FGU';
update airport set timezone = 'America/New_York' where city_code = 'FHB';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'FHZ';
update airport set timezone = 'America/Sitka' where city_code = 'FIC';
update airport set timezone = 'America/New_York' where city_code = 'FID';
update airport set timezone = 'Australia/Darwin' where city_code = 'FIK';
update airport set timezone = 'America/Denver' where city_code = 'FIL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'FIN';
update airport set timezone = 'America/Juneau' where city_code = 'FIV';
update airport set timezone = 'Europe/London' where city_code = 'FKH';
update airport set timezone = 'Asia/Tokyo' where city_code = 'FKJ';
update airport set timezone = 'America/Anchorage' where city_code = 'FKK';
update airport set timezone = 'America/New_York' where city_code = 'FKN';
update airport set timezone = 'America/Fortaleza' where city_code = 'FLB';
update airport set timezone = 'America/New_York' where city_code = 'FLE';
update airport set timezone = 'Europe/London' where city_code = 'FLH';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'FLI';
update airport set timezone = 'America/Asuncion' where city_code = 'FLM';
update airport set timezone = 'America/Chicago' where city_code = 'FLP';
update airport set timezone = 'America/New_York' where city_code = 'FLU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FLX';
update airport set timezone = 'Australia/Sydney' where city_code = 'FLY';
update airport set timezone = 'Asia/Jakarta' where city_code = 'FLZ';
update airport set timezone = 'America/Anchorage' where city_code = 'FMC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FMU';
update airport set timezone = 'Europe/Berlin' where city_code = 'FNB';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'FNG';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'FNH';
update airport set timezone = 'America/Anchorage' where city_code = 'FNK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'FOB';
update airport set timezone = 'Asia/Jayapura' where city_code = 'FOO';
update airport set timezone = 'America/New_York' where city_code = 'FOP';
update airport set timezone = 'Australia/Perth' where city_code = 'FOS';
update airport set timezone = 'Australia/Sydney' where city_code = 'FOT';
update airport set timezone = 'Africa/Libreville' where city_code = 'FOU';
update airport set timezone = 'Africa/Monrovia' where city_code = 'FOY';
update airport set timezone = 'America/Chicago' where city_code = 'FOZ';
update airport set timezone = 'America/Detroit' where city_code = 'FPK';
update airport set timezone = 'America/New_York' where city_code = 'FPR';
update airport set timezone = 'America/New_York' where city_code = 'FPY';
update airport set timezone = 'America/New_York' where city_code = 'FQD';
update airport set timezone = 'Australia/Sydney' where city_code = 'FRB';
update airport set timezone = 'Europe/Berlin' where city_code = 'FRF';
update airport set timezone = 'America/New_York' where city_code = 'FRG';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'FRH';
update airport set timezone = 'Indian/Mahe' where city_code = 'FRK';
update airport set timezone = 'America/Chicago' where city_code = 'FRM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'FRQ';
update airport set timezone = 'America/New_York' where city_code = 'FRR';
update airport set timezone = 'America/Santiago' where city_code = 'FRT';
update airport set timezone = 'Europe/Berlin' where city_code = 'FRZ';
update airport set timezone = 'America/Chicago' where city_code = 'FSE';
update airport set timezone = 'America/Chicago' where city_code = 'FSK';
update airport set timezone = 'Australia/Perth' where city_code = 'FSL';
update airport set timezone = 'Europe/London' where city_code = 'FSS';
update airport set timezone = 'America/Denver' where city_code = 'FSU';
update airport set timezone = 'America/Chicago' where city_code = 'FSW';
update airport set timezone = 'America/Denver' where city_code = 'FTG';
update airport set timezone = 'Asia/Harbin' where city_code = 'FUD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'FUM';
update airport set timezone = 'Australia/Perth' where city_code = 'FVL';
update airport set timezone = 'Indian/Maldives' where city_code = 'FVM';
update airport set timezone = 'Australia/Perth' where city_code = 'FVR';
update airport set timezone = 'America/New_York' where city_code = 'FVX';
update airport set timezone = 'America/Chicago' where city_code = 'FWC';
update airport set timezone = 'America/Chicago' where city_code = 'FWH';
update airport set timezone = 'America/New_York' where city_code = 'FWN';
update airport set timezone = 'America/New_York' where city_code = 'FWQ';
update airport set timezone = 'America/Chicago' where city_code = 'FWS';
update airport set timezone = 'America/Anchorage' where city_code = 'FXM';
update airport set timezone = 'America/Chicago' where city_code = 'FXY';
update airport set timezone = 'Asia/Harbin' where city_code = 'FYJ';
update airport set timezone = 'America/Chicago' where city_code = 'FYM';
update airport set timezone = 'America/Montevideo' where city_code = 'FZB';
update airport set timezone = 'America/Bogota' where city_code = 'GAA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'GAB';
update airport set timezone = 'America/Chicago' where city_code = 'GAG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GAP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GAR';
update airport set timezone = 'Europe/Paris' where city_code = 'GAT';
update airport set timezone = 'Asia/Jayapura' where city_code = 'GAV';
update airport set timezone = 'Asia/Rangoon' where city_code = 'GAW';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GAZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GBC';
update airport set timezone = 'America/Chicago' where city_code = 'GBD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GBF';
update airport set timezone = 'America/Chicago' where city_code = 'GBG';
update airport set timezone = 'America/Anchorage' where city_code = 'GBH';
update airport set timezone = 'America/Nassau' where city_code = 'GBI';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'GBM';
update airport set timezone = 'America/New_York' where city_code = 'GBO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GBP';
update airport set timezone = 'America/New_York' where city_code = 'GBR';
update airport set timezone = 'Africa/Khartoum' where city_code = 'GBU';
update airport set timezone = 'Australia/Perth' where city_code = 'GBV';
update airport set timezone = 'Australia/Perth' where city_code = 'GBW';
update airport set timezone = 'America/Bogota' where city_code = 'GCA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'GCD';
update airport set timezone = 'Asia/Tehran' where city_code = 'GCH';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GCV';
update airport set timezone = 'America/New_York' where city_code = 'GCY';
update airport set timezone = 'America/New_York' where city_code = 'GDC';
update airport set timezone = 'Australia/Perth' where city_code = 'GDD';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'GDG';
update airport set timezone = 'America/Anchorage' where city_code = 'GDH';
update airport set timezone = 'Africa/Bangui' where city_code = 'GDI';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'GDJ';
update airport set timezone = 'America/New_York' where city_code = 'GDM';
update airport set timezone = 'America/Caracas' where city_code = 'GDO';
update airport set timezone = 'America/Fortaleza' where city_code = 'GDP';
update airport set timezone = 'Asia/Jayapura' where city_code = 'GEB';
update airport set timezone = 'Asia/Nicosia' where city_code = 'GEC';
update airport set timezone = 'Australia/Hobart' where city_code = 'GEE';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'GEF';
update airport set timezone = 'America/Denver' where city_code = 'GEY';
update airport set timezone = 'America/Denver' where city_code = 'GFA';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'GFD';
update airport set timezone = 'America/Guyana' where city_code = 'GFO';
update airport set timezone = 'Africa/Luanda' where city_code = 'GGC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GGD';
update airport set timezone = 'Africa/Nairobi' where city_code = 'GGM';
update airport set timezone = 'Africa/Abidjan' where city_code = 'GGN';
update airport set timezone = 'Africa/Abidjan' where city_code = 'GGO';
update airport set timezone = 'America/Nassau' where city_code = 'GHC';
update airport set timezone = 'Asia/Gaza' where city_code = 'GHK';
update airport set timezone = 'America/Chicago' where city_code = 'GHM';
update airport set timezone = 'Africa/Bujumbura' where city_code = 'GID';
update airport set timezone = 'Africa/Conakry' where city_code = 'GII';
update airport set timezone = 'Africa/Libreville' where city_code = 'GIM';
update airport set timezone = 'America/Bogota' where city_code = 'GIR';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'GIT';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'GIY';
update airport set timezone = 'America/Porto_Velho' where city_code = 'GJM';
update airport set timezone = 'Europe/Istanbul' where city_code = 'GKD';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'GKH';
update airport set timezone = 'America/New_York' where city_code = 'GKT';
update airport set timezone = 'America/Phoenix' where city_code = 'GLB';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'GLC';
update airport set timezone = 'America/Chicago' where city_code = 'GLE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GLG';
update airport set timezone = 'Europe/Oslo' where city_code = 'GLL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GLM';
update airport set timezone = 'Africa/Casablanca' where city_code = 'GLN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GLP';
update airport set timezone = 'America/Detroit' where city_code = 'GLR';
update airport set timezone = 'Asia/Thimphu' where city_code = 'GLU';
update airport set timezone = 'America/Chicago' where city_code = 'GLW';
update airport set timezone = 'Asia/Jayapura' where city_code = 'GLX';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'GLZ';
update airport set timezone = 'America/Bogota' where city_code = 'GMC';
update airport set timezone = 'Africa/Casablanca' where city_code = 'GMD';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'GMM';
update airport set timezone = 'Pacific/Auckland' where city_code = 'GMN';
update airport set timezone = 'Africa/Lagos' where city_code = 'GMO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GMS';
update airport set timezone = 'America/Anchorage' where city_code = 'GMT';
update airport set timezone = 'America/New_York' where city_code = 'GMU';
update airport set timezone = 'America/Denver' where city_code = 'GMV';
update airport set timezone = 'America/Los_Angeles' where city_code = 'GNF';
update airport set timezone = 'America/Boise' where city_code = 'GNG';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'GNN';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'GNR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GOC';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GOE';
update airport set timezone = 'America/Chicago' where city_code = 'GOF';
update airport set timezone = 'Africa/Windhoek' where city_code = 'GOG';
update airport set timezone = 'America/Chicago' where city_code = 'GOK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'GOL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GOO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GPD';
update airport set timezone = 'America/Costa_Rica' where city_code = 'GPL';
update airport set timezone = 'Australia/Darwin' where city_code = 'GPN';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'GPO';
update airport set timezone = 'America/New_York' where city_code = 'GRD';
update airport set timezone = 'America/Chicago' where city_code = 'GRE';
update airport set timezone = 'Asia/Kabul' where city_code = 'GRG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GRH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GRL';
update airport set timezone = 'America/Denver' where city_code = 'GRN';
update airport set timezone = 'Asia/Karachi' where city_code = 'GRT';
update airport set timezone = 'Asia/Kuching' where city_code = 'GSA';
update airport set timezone = 'Australia/Perth' where city_code = 'GSC';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'GSH';
update airport set timezone = 'America/Guatemala' where city_code = 'GSJ';
update airport set timezone = 'America/Yellowknife' where city_code = 'GSL';
update airport set timezone = 'Australia/Adelaide' where city_code = 'GSN';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'GSR';
update airport set timezone = 'Africa/Khartoum' where city_code = 'GSU';
update airport set timezone = 'Europe/London' where city_code = 'GSY';
update airport set timezone = 'America/Chicago' where city_code = 'GTG';
update airport set timezone = 'Australia/Adelaide' where city_code = 'GTS';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GTT';
update airport set timezone = 'Europe/Prague' where city_code = 'GTW';
update airport set timezone = 'America/New_York' where city_code = 'GTY';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'GTZ';
update airport set timezone = 'Africa/Bamako' where city_code = 'GUD';
update airport set timezone = 'America/Chicago' where city_code = 'GUF';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GUG';
update airport set timezone = 'Australia/Sydney' where city_code = 'GUH';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GUJ';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'GUU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GUV';
update airport set timezone = 'Asia/Kolkata' where city_code = 'GUX';
update airport set timezone = 'America/Chicago' where city_code = 'GUY';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'GUZ';
update airport set timezone = 'America/New_York' where city_code = 'GVE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GVI';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'GVN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GVP';
update airport set timezone = 'America/Chicago' where city_code = 'GVW';
update airport set timezone = 'Asia/Rangoon' where city_code = 'GWA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'GWN';
update airport set timezone = 'Africa/Douala' where city_code = 'GXX';
update airport set timezone = 'America/Denver' where city_code = 'GXY';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'GYG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'GYP';
update airport set timezone = 'America/Phoenix' where city_code = 'GYR';
update airport set timezone = 'America/Chicago' where city_code = 'GZH';
update airport set timezone = 'Asia/Kabul' where city_code = 'GZI';
update airport set timezone = 'Asia/Tehran' where city_code = 'GZW';
update airport set timezone = 'America/Chicago' where city_code = 'HAB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HAF';
update airport set timezone = 'Africa/Windhoek' where city_code = 'HAL';
update airport set timezone = 'America/New_York' where city_code = 'HAO';
update airport set timezone = 'America/New_York' where city_code = 'HAR';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HAT';
update airport set timezone = 'Europe/London' where city_code = 'HAW';
update airport set timezone = 'America/Chicago' where city_code = 'HAX';
update airport set timezone = 'America/Anchorage' where city_code = 'HAY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HAZ';
update airport set timezone = 'America/Phoenix' where city_code = 'HBK';
update airport set timezone = 'America/Chicago' where city_code = 'HBO';
update airport set timezone = 'Asia/Hovd' where city_code = 'HBU';
update airport set timezone = 'America/Chicago' where city_code = 'HCA';
update airport set timezone = 'America/Sitka' where city_code = 'HCB';
update airport set timezone = 'America/Chicago' where city_code = 'HCD';
update airport set timezone = 'Asia/Chongqing' where city_code = 'HCJ';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'HCM';
update airport set timezone = 'America/New_York' where city_code = 'HCW';
update airport set timezone = 'America/Sitka' where city_code = 'HDA';
update airport set timezone = 'America/Chicago' where city_code = 'HDE';
update airport set timezone = 'Asia/Tehran' where city_code = 'HDR';
update airport set timezone = 'Asia/Rangoon' where city_code = 'HEB';
update airport set timezone = 'America/Anchorage' where city_code = 'HED';
update airport set timezone = 'America/Chicago' where city_code = 'HEE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HEO';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HES';
update airport set timezone = 'Europe/Madrid' where city_code = 'HEV';
update airport set timezone = 'America/Chicago' where city_code = 'HEZ';
update airport set timezone = 'America/New_York' where city_code = 'HFF';
update airport set timezone = 'Africa/Khartoum' where city_code = 'HGI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HHE';
update airport set timezone = 'Asia/Hong_Kong' where city_code = 'HHP';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'HHZ';
update airport set timezone = 'America/New_York' where city_code = 'HIE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HIG';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'HIK';
update airport set timezone = 'Asia/Colombo' where city_code = 'HIM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HIP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HIT';
update airport set timezone = 'Pacific/Marquesas' where city_code = 'HIX';
update airport set timezone = 'America/Chicago' where city_code = 'HJH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HJO';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'HJT';
update airport set timezone = 'America/Chicago' where city_code = 'HKA';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'HKP';
update airport set timezone = 'America/Chicago' where city_code = 'HKS';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'HLB';
update airport set timezone = 'America/Chicago' where city_code = 'HLC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HLI';
update airport set timezone = 'Australia/Perth' where city_code = 'HLL';
update airport set timezone = 'America/Detroit' where city_code = 'HLM';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'HLO';
update airport set timezone = 'Australia/Hobart' where city_code = 'HLS';
update airport set timezone = 'Pacific/Noumea' where city_code = 'HLU';
update airport set timezone = 'Australia/Brisbane' where city_code = 'HLV';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'HLW';
update airport set timezone = 'Australia/Darwin' where city_code = 'HMG';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HMT';
update airport set timezone = 'America/Indiana/Vincennes' where city_code = 'HNB';
update airport set timezone = 'America/New_York' where city_code = 'HNC';
update airport set timezone = 'America/Anchorage' where city_code = 'HNE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HNI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HNN';
update airport set timezone = 'America/Denver' where city_code = 'HNX';
update airport set timezone = 'Asia/Shanghai' where city_code = 'HNY';
update airport set timezone = 'Asia/Vientiane' where city_code = 'HOE';
update airport set timezone = 'Europe/Vienna' where city_code = 'HOH';
update airport set timezone = 'America/Anchorage' where city_code = 'HOL';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'HOO';
update airport set timezone = 'Asia/Rangoon' where city_code = 'HOX';
update airport set timezone = 'Europe/London' where city_code = 'HOY';
update airport set timezone = 'Asia/Shanghai' where city_code = 'HPG';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'HPV';
update airport set timezone = 'America/Chicago' where city_code = 'HPY';
update airport set timezone = 'Asia/Almaty' where city_code = 'HRC';
update airport set timezone = 'America/Bogota' where city_code = 'HRR';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'HRS';
update airport set timezone = 'Australia/Darwin' where city_code = 'HRY';
update airport set timezone = 'America/Chicago' where city_code = 'HSA';
update airport set timezone = 'Asia/Shanghai' where city_code = 'HSC';
update airport set timezone = 'America/Chicago' where city_code = 'HSI';
update airport set timezone = 'Australia/Melbourne' where city_code = 'HSM';
update airport set timezone = 'America/New_York' where city_code = 'HSP';
update airport set timezone = 'Asia/Kolkata' where city_code = 'HSS';
update airport set timezone = 'Asia/Taipei' where city_code = 'HSZ';
update airport set timezone = 'America/Guadeloupe' where city_code = 'HTB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'HTH';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'HTM';
update airport set timezone = 'America/New_York' where city_code = 'HTO';
update airport set timezone = 'Asia/Tokyo' where city_code = 'HTR';
update airport set timezone = 'Australia/Melbourne' where city_code = 'HTU';
update airport set timezone = 'America/Chicago' where city_code = 'HTV';
update airport set timezone = 'America/New_York' where city_code = 'HTW';
update airport set timezone = 'America/Bogota' where city_code = 'HTZ';
update airport set timezone = 'Australia/Darwin' where city_code = 'HUB';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'HUC';
update airport set timezone = 'America/Chicago' where city_code = 'HUD';
update airport set timezone = 'America/Guatemala' where city_code = 'HUG';
update airport set timezone = 'America/Chicago' where city_code = 'HUJ';
update airport set timezone = 'Africa/Gaborone' where city_code = 'HUK';
update airport set timezone = 'America/Chicago' where city_code = 'HUM';
update airport set timezone = 'Africa/Tripoli' where city_code = 'HUQ';
update airport set timezone = 'America/Denver' where city_code = 'HVE';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'HVK';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'HVM';
update airport set timezone = 'America/New_York' where city_code = 'HVS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HWA';
update airport set timezone = 'Australia/Adelaide' where city_code = 'HWK';
update airport set timezone = 'Africa/Harare' where city_code = 'HWN';
update airport set timezone = 'Australia/Sydney' where city_code = 'HXX';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'HYF';
update airport set timezone = 'America/Chicago' where city_code = 'HYR';
update airport set timezone = 'America/Detroit' where city_code = 'HYX';
update airport set timezone = 'Europe/Paris' where city_code = 'HZB';
update airport set timezone = 'America/North_Dakota/Beulah' where city_code = 'HZE';
update airport set timezone = 'America/Edmonton' where city_code = 'HZP';
update airport set timezone = 'America/Chicago' where city_code = 'HZR';
update airport set timezone = 'Asia/Manila' where city_code = 'IAO';
update airport set timezone = 'Asia/Tehran' where city_code = 'IAQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'IAU';
update airport set timezone = 'Pacific/Galapagos' where city_code = 'IBB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'IBI';
update airport set timezone = 'America/Lima' where city_code = 'IBP';
update airport set timezone = 'America/Caracas' where city_code = 'ICA';
update airport set timezone = 'America/Chicago' where city_code = 'ICL';
update airport set timezone = 'Asia/Manila' where city_code = 'ICO';
update airport set timezone = 'America/Havana' where city_code = 'ICR';
update airport set timezone = 'America/Boise' where city_code = 'ICS';
update airport set timezone = 'Europe/Stockholm' where city_code = 'IDB';
update airport set timezone = 'Africa/Maputo' where city_code = 'IDC';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'IDF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'IDH';
update airport set timezone = 'America/New_York' where city_code = 'IDI';
update airport set timezone = 'Australia/Adelaide' where city_code = 'IDK';
update airport set timezone = 'America/Araguaina' where city_code = 'IDO';
update airport set timezone = 'America/Chicago' where city_code = 'IDP';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IEJ';
update airport set timezone = 'America/Anchorage' where city_code = 'IEM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'IFF';
update airport set timezone = 'Asia/Tehran' where city_code = 'IFH';
update airport set timezone = 'Europe/Paris' where city_code = 'IFR';
update airport set timezone = 'America/New_York' where city_code = 'IGC';
update airport set timezone = 'Africa/Libreville' where city_code = 'IGE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'IGH';
update airport set timezone = 'Asia/Manila' where city_code = 'IGN';
update airport set timezone = 'America/Bogota' where city_code = 'IGO';
update airport set timezone = 'Europe/Moscow' where city_code = 'IGT';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IHA';
update airport set timezone = 'Africa/Maputo' where city_code = 'IHC';
update airport set timezone = 'Asia/Aden' where city_code = 'IHN';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'IHO';
update airport set timezone = 'Asia/Tehran' where city_code = 'IHR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'IJU';
update airport set timezone = 'America/Chicago' where city_code = 'IJX';
update airport set timezone = 'America/New_York' where city_code = 'IKB';
update airport set timezone = 'America/Godthab' where city_code = 'IKE';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'IKL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'IKP';
update airport set timezone = 'Asia/Jayapura' where city_code = 'ILA';
update airport set timezone = 'America/Campo_Grande' where city_code = 'ILB';
update airport set timezone = 'America/Chicago' where city_code = 'ILE';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'ILK';
update airport set timezone = 'America/Chicago' where city_code = 'ILL';
update airport set timezone = 'America/Lima' where city_code = 'ILQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ILX';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'IMA';
update airport set timezone = 'America/Denver' where city_code = 'IML';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'IMN';
update airport set timezone = 'Africa/Bangui' where city_code = 'IMO';
update airport set timezone = 'Europe/Moscow' where city_code = 'INA';
update airport set timezone = 'America/Belize' where city_code = 'INB';
update airport set timezone = 'Africa/Algiers' where city_code = 'INF';
update airport set timezone = 'Australia/Adelaide' where city_code = 'INM';
update airport set timezone = 'America/Detroit' where city_code = 'INR';
update airport set timezone = 'Asia/Jayapura' where city_code = 'INX';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'ION';
update airport set timezone = 'America/Godthab' where city_code = 'IOQ';
update airport set timezone = 'Pacific/Noumea' where city_code = 'IOU';
update airport set timezone = 'Asia/Manila' where city_code = 'IPE';
update airport set timezone = 'America/Manaus' where city_code = 'IPG';
update airport set timezone = 'America/Bahia' where city_code = 'IPU';
update airport set timezone = 'Asia/Baghdad' where city_code = 'IQA';
update airport set timezone = 'America/Bahia' where city_code = 'IRE';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'IRM';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'IRN';
update airport set timezone = 'Africa/Bangui' where city_code = 'IRO';
update airport set timezone = 'America/Detroit' where city_code = 'IRS';
update airport set timezone = 'America/Bogota' where city_code = 'ISD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ISI';
update airport set timezone = 'America/Anchorage' where city_code = 'ISL';
update airport set timezone = 'America/New_York' where city_code = 'ISS';
update airport set timezone = 'America/Manaus' where city_code = 'ITA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ITE';
update airport set timezone = 'America/Santarem' where city_code = 'ITI';
update airport set timezone = 'America/Bahia' where city_code = 'ITN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ITP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ITQ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ITR';
update airport set timezone = 'America/Godthab' where city_code = 'IUI';
update airport set timezone = 'Asia/Jayapura' where city_code = 'IUL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'IUS';
update airport set timezone = 'Europe/Podgorica' where city_code = 'IVG';
update airport set timezone = 'America/Anchorage' where city_code = 'IVH';
update airport set timezone = 'Australia/Darwin' where city_code = 'IVW';
update airport set timezone = 'Asia/Tokyo' where city_code = 'IWK';
update airport set timezone = 'Asia/Kolkata' where city_code = 'IXN';
update airport set timezone = 'Asia/Kolkata' where city_code = 'IXQ';
update airport set timezone = 'Asia/Kolkata' where city_code = 'IXT';
update airport set timezone = 'Asia/Kolkata' where city_code = 'IXV';
update airport set timezone = 'America/Anchorage' where city_code = 'IYS';
update airport set timezone = 'America/Mexico_City' where city_code = 'IZT';
update airport set timezone = 'Asia/Karachi' where city_code = 'JAG';
update airport set timezone = 'Europe/Paris' where city_code = 'JAH';
update airport set timezone = 'America/Port-au-Prince' where city_code = 'JAK';
update airport set timezone = 'Europe/Sofia' where city_code = 'JAM';
update airport set timezone = 'America/New_York' where city_code = 'JAO';
update airport set timezone = 'America/Costa_Rica' where city_code = 'JAP';
update airport set timezone = 'Asia/Tehran' where city_code = 'JAR';
update airport set timezone = 'America/Lima' where city_code = 'JAU';
update airport set timezone = 'Asia/Jakarta' where city_code = 'JBB';
update airport set timezone = 'America/Anchorage' where city_code = 'JBT';
update airport set timezone = 'America/St_Thomas' where city_code = 'JCD';
update airport set timezone = 'Asia/Seoul' where city_code = 'JCJ';
update airport set timezone = 'America/Bahia' where city_code = 'JCM';
update airport set timezone = 'Asia/Seoul' where city_code = 'JCN';
update airport set timezone = 'America/Manaus' where city_code = 'JCR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'JDA';
update airport set timezone = 'Asia/Seoul' where city_code = 'JDG';
update airport set timezone = 'America/Denver' where city_code = 'JDN';
update airport set timezone = 'Europe/Paris' where city_code = 'JDP';
update airport set timezone = 'Africa/Lusaka' where city_code = 'JEK';
update airport set timezone = 'America/Bahia' where city_code = 'JEQ';
update airport set timezone = 'America/New_York' where city_code = 'JFN';
update airport set timezone = 'Asia/Kolkata' where city_code = 'JGB';
update airport set timezone = 'America/Cuiaba' where city_code = 'JIA';
update airport set timezone = 'Asia/Chongqing' where city_code = 'JIC';
update airport set timezone = 'Asia/Harbin' where city_code = 'JIL';
update airport set timezone = 'Africa/Kampala' where city_code = 'JIN';
update airport set timezone = 'America/Guayaquil' where city_code = 'JIP';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'JIR';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'JJA';
update airport set timezone = 'Africa/Nairobi' where city_code = 'JJM';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'JKR';
update airport set timezone = 'America/Chicago' where city_code = 'JKV';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'JLS';
update airport set timezone = 'Africa/Luanda' where city_code = 'JMB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'JMC';
update airport set timezone = 'Europe/Stockholm' where city_code = 'JMM';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'JNA';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'JNI';
update airport set timezone = 'Asia/Muscat' where city_code = 'JNJ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'JOH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'JRD';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'JRF';
update airport set timezone = 'America/Godthab' where city_code = 'JRK';
update airport set timezone = 'America/Cuiaba' where city_code = 'JRN';
update airport set timezone = 'Asia/Hebron' where city_code = 'JRS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'JSG';
update airport set timezone = 'Europe/Stockholm' where city_code = 'JSO';
update airport set timezone = 'Asia/Seoul' where city_code = 'JSP';
update airport set timezone = 'Europe/Athens' where city_code = 'JSS';
update airport set timezone = 'America/Cuiaba' where city_code = 'JUA';
update airport set timezone = 'Asia/Shanghai' where city_code = 'JUH';
update airport set timezone = 'America/Godthab' where city_code = 'JUK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'JUN';
update airport set timezone = 'America/Bogota' where city_code = 'JUO';
update airport set timezone = 'Australia/Perth' where city_code = 'JUR';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'JUT';
update airport set timezone = 'America/Godthab' where city_code = 'JUU';
update airport set timezone = 'America/New_York' where city_code = 'JVI';
update airport set timezone = 'America/Anchorage' where city_code = 'JVM';
update airport set timezone = 'Asia/Tehran' where city_code = 'JWN';
update airport set timezone = 'Asia/Tehran' where city_code = 'JYR';
update airport set timezone = 'Africa/Lusaka' where city_code = 'KAA';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'KAF';
update airport set timezone = 'Australia/Melbourne' where city_code = 'KAH';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KAP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KAQ';
update airport set timezone = 'Africa/Windhoek' where city_code = 'KAS';
update airport set timezone = 'America/Caracas' where city_code = 'KAV';
update airport set timezone = 'Pacific/Fiji' where city_code = 'KAY';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KAZ';
update airport set timezone = 'Africa/Freetown' where city_code = 'KBA';
update airport set timezone = 'Australia/Darwin' where city_code = 'KBB';
update airport set timezone = 'Australia/Perth' where city_code = 'KBD';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KBF';
update airport set timezone = 'Africa/Kampala' where city_code = 'KBG';
update airport set timezone = 'Africa/Douala' where city_code = 'KBI';
update airport set timezone = 'Australia/Darwin' where city_code = 'KBJ';
update airport set timezone = 'America/Sitka' where city_code = 'KBK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KBM';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KBN';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KBO';
update airport set timezone = 'Africa/Blantyre' where city_code = 'KBQ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KBX';
update airport set timezone = 'America/Paramaribo' where city_code = 'KCB';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KCD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KCE';
update airport set timezone = 'Asia/Karachi' where city_code = 'KCF';
update airport set timezone = 'America/Anchorage' where city_code = 'KCG';
update airport set timezone = 'Asia/Dili' where city_code = 'KCI';
update airport set timezone = 'Asia/Irkutsk' where city_code = 'KCK';
update airport set timezone = 'America/Adak' where city_code = 'KCN';
update airport set timezone = 'Europe/Istanbul' where city_code = 'KCO';
update airport set timezone = 'Europe/Uzhgorod' where city_code = 'KCP';
update airport set timezone = 'America/Anchorage' where city_code = 'KCR';
update airport set timezone = 'Australia/Darwin' where city_code = 'KCS';
update airport set timezone = 'Africa/Kampala' where city_code = 'KCU';
update airport set timezone = 'Africa/Dakar' where city_code = 'KDA';
update airport set timezone = 'Africa/Porto-Novo' where city_code = 'KDC';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KDE';
update airport set timezone = 'Africa/Libreville' where city_code = 'KDJ';
update airport set timezone = 'America/Anchorage' where city_code = 'KDK';
update airport set timezone = 'Africa/Libreville' where city_code = 'KDN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KDP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KDQ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KDS';
update airport set timezone = 'Asia/Bangkok' where city_code = 'KDT';
update airport set timezone = 'Africa/Khartoum' where city_code = 'KDX';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'KDY';
update airport set timezone = 'America/Anchorage' where city_code = 'KEB';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KEC';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'KEE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KEG';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KEI';
update airport set timezone = 'Africa/Abidjan' where city_code = 'KEO';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KEQ';
update airport set timezone = 'America/Winnipeg' where city_code = 'KES';
update airport set timezone = 'America/Nome' where city_code = 'KEU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KGB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KGH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KGM';
update airport set timezone = 'America/Godthab' where city_code = 'KGQ';
update airport set timezone = 'Australia/Darwin' where city_code = 'KGR';
update airport set timezone = 'Asia/Kuching' where city_code = 'KGU';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KGY';
update airport set timezone = 'America/Anchorage' where city_code = 'KGZ';
update airport set timezone = 'Asia/Tehran' where city_code = 'KHA';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KHJ';
update airport set timezone = 'Asia/Tehran' where city_code = 'KHK';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'KHO';
update airport set timezone = 'America/Godthab' where city_code = 'KHQ';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'KHR';
update airport set timezone = 'Europe/Kiev' where city_code = 'KHU';
update airport set timezone = 'Asia/Tehran' where city_code = 'KHY';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'KHZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'KIC';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'KIG';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KIL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KIQ';
update airport set timezone = 'Africa/Nairobi' where city_code = 'KIU';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'KIY';
update airport set timezone = 'Asia/Chongqing' where city_code = 'KJH';
update airport set timezone = 'Europe/Brussels' where city_code = 'KJK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KJU';
update airport set timezone = 'America/Nome' where city_code = 'KKF';
update airport set timezone = 'America/Guyana' where city_code = 'KKG';
update airport set timezone = 'America/Anchorage' where city_code = 'KKI';
update airport set timezone = 'America/Anchorage' where city_code = 'KKK';
update airport set timezone = 'America/Anchorage' where city_code = 'KKL';
update airport set timezone = 'Asia/Bangkok' where city_code = 'KKM';
update airport set timezone = 'Pacific/Auckland' where city_code = 'KKO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KKP';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'KKQ';
update airport set timezone = 'America/Chicago' where city_code = 'KKT';
update airport set timezone = 'America/Anchorage' where city_code = 'KKU';
update airport set timezone = 'Europe/Dublin' where city_code = 'KKY';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'KKZ';
update airport set timezone = 'Africa/Kampala' where city_code = 'KLA';
update airport set timezone = 'Africa/Lusaka' where city_code = 'KLB';
update airport set timezone = 'Africa/Douala' where city_code = 'KLE';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'KLI';
update airport set timezone = 'Europe/Vilnius' where city_code = 'KLJ';
update airport set timezone = 'Asia/Tehran' where city_code = 'KLM';
update airport set timezone = 'America/Sitka' where city_code = 'KLP';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KLY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KMB';
update airport set timezone = 'Asia/Riyadh' where city_code = 'KMC';
update airport set timezone = 'Africa/Libreville' where city_code = 'KMD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KMF';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'KMH';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'KMK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KML';
update airport set timezone = 'Asia/Jayapura' where city_code = 'KMM';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'KMT';
update airport set timezone = 'Asia/Riyadh' where city_code = 'KMX';
update airport set timezone = 'Africa/Lusaka' where city_code = 'KMZ';
update airport set timezone = 'America/Santiago' where city_code = 'KNA';
update airport set timezone = 'America/Denver' where city_code = 'KNB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KNE';
update airport set timezone = 'Australia/Perth' where city_code = 'KNI';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'KNJ';
update airport set timezone = 'America/Anchorage' where city_code = 'KNK';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KNM';
update airport set timezone = 'Asia/Tehran' where city_code = 'KNR';
update airport set timezone = 'America/Chicago' where city_code = 'KNT';
update airport set timezone = 'Africa/Bamako' where city_code = 'KNZ';
update airport set timezone = 'Asia/Makassar' where city_code = 'KOD';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'KOF';
update airport set timezone = 'Asia/Vientiane' where city_code = 'KOG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KOH';
update airport set timezone = 'Africa/Bangui' where city_code = 'KOL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KOM';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'KOO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KOR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KPA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KPE';
update airport set timezone = 'America/Guyana' where city_code = 'KPG';
update airport set timezone = 'America/Nome' where city_code = 'KPH';
update airport set timezone = 'Asia/Kuching' where city_code = 'KPI';
update airport set timezone = 'America/Anchorage' where city_code = 'KPK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KPL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KPM';
update airport set timezone = 'Australia/Sydney' where city_code = 'KPS';
update airport set timezone = 'America/Los_Angeles' where city_code = 'KPT';
update airport set timezone = 'Asia/Anadyr' where city_code = 'KPW';
update airport set timezone = 'Australia/Adelaide' where city_code = 'KQB';
update airport set timezone = 'Australia/Perth' where city_code = 'KQR';
update airport set timezone = 'Asia/Dushanbe' where city_code = 'KQT';
update airport set timezone = 'Australia/Melbourne' where city_code = 'KRA';
update airport set timezone = 'Asia/Jakarta' where city_code = 'KRC';
update airport set timezone = 'Australia/Darwin' where city_code = 'KRD';
update airport set timezone = 'Africa/Bujumbura' where city_code = 'KRE';
update airport set timezone = 'America/Guyana' where city_code = 'KRG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KRJ';
update airport set timezone = 'America/Guyana' where city_code = 'KRM';
update airport set timezone = 'Europe/Zaporozhye' where city_code = 'KRQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KRU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KRX';
update airport set timezone = 'Africa/Kampala' where city_code = 'KSE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KSG';
update airport set timezone = 'Africa/Bamako' where city_code = 'KSS';
update airport set timezone = 'Africa/Khartoum' where city_code = 'KST';
update airport set timezone = 'Australia/Brisbane' where city_code = 'KSV';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'KSW';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KSX';
update airport set timezone = 'Africa/Abidjan' where city_code = 'KTC';
update airport set timezone = 'America/Anchorage' where city_code = 'KTH';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'KTK';
update airport set timezone = 'America/Guyana' where city_code = 'KTO';
update airport set timezone = 'Europe/Helsinki' where city_code = 'KTQ';
update airport set timezone = 'America/Caracas' where city_code = 'KTV';
update airport set timezone = 'Africa/Bamako' where city_code = 'KTX';
update airport set timezone = 'Asia/Colombo' where city_code = 'KTY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KUP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KUQ';
update airport set timezone = 'Asia/Kabul' where city_code = 'KUR';
update airport set timezone = 'America/Anchorage' where city_code = 'KUW';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KUX';
update airport set timezone = 'America/Godthab' where city_code = 'KUZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KVE';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'KVR';
update airport set timezone = 'Asia/Jakarta' where city_code = 'KWB';
update airport set timezone = 'America/Juneau' where city_code = 'KWF';
update airport set timezone = 'Asia/Kabul' where city_code = 'KWH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KWO';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'KWR';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'KWS';
update airport set timezone = 'Pacific/Auckland' where city_code = 'KWU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KWV';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KWX';
update airport set timezone = 'America/Metlakatla' where city_code = 'KXA';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'KXE';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'KXR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'KXU';
update airport set timezone = 'Asia/Beirut' where city_code = 'KYE';
update airport set timezone = 'Australia/Perth' where city_code = 'KYF';
update airport set timezone = 'Australia/Adelaide' where city_code = 'KYI';
update airport set timezone = 'Asia/Rangoon' where city_code = 'KYT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'KYX';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'KZC';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'KZD';
update airport set timezone = 'Europe/Berlin' where city_code = 'KZG';
update airport set timezone = 'America/Anchorage' where city_code = 'KZH';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'KZK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LAB';
update airport set timezone = 'America/Caracas' where city_code = 'LAG';
update airport set timezone = 'Asia/Jayapura' where city_code = 'LAH';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'LAJ';
update airport set timezone = 'America/Bogota' where city_code = 'LAT';
update airport set timezone = 'Australia/Sydney' where city_code = 'LBH';
update airport set timezone = 'Africa/Nairobi' where city_code = 'LBK';
update airport set timezone = 'Africa/Nairobi' where city_code = 'LBN';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'LBO';
update airport set timezone = 'Europe/Paris' where city_code = 'LBY';
update airport set timezone = 'America/Cuiaba' where city_code = 'LCB';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'LCD';
update airport set timezone = 'America/Guatemala' where city_code = 'LCF';
update airport set timezone = 'America/New_York' where city_code = 'LCI';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'LCM';
update airport set timezone = 'Australia/Adelaide' where city_code = 'LCN';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'LCO';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'LCP';
update airport set timezone = 'Europe/Rome' where city_code = 'LCV';
update airport set timezone = 'Asia/Kolkata' where city_code = 'LDA';
update airport set timezone = 'Australia/Lindeman' where city_code = 'LDC';
update airport set timezone = 'America/Detroit' where city_code = 'LDM';
update airport set timezone = 'Asia/Aden' where city_code = 'LDR';
update airport set timezone = 'Asia/Harbin' where city_code = 'LDS';
update airport set timezone = 'Europe/Paris' where city_code = 'LDV';
update airport set timezone = 'Australia/Perth' where city_code = 'LDW';
update airport set timezone = 'America/New_York' where city_code = 'LEE';
update airport set timezone = 'Africa/Maseru' where city_code = 'LEF';
update airport set timezone = 'Africa/Libreville' where city_code = 'LEO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'LEP';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'LEZ';
update airport set timezone = 'Asia/Tehran' where city_code = 'LFM';
update airport set timezone = 'America/New_York' where city_code = 'LFN';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'LFO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LFP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LGD';
update airport set timezone = 'Australia/Perth' where city_code = 'LGE';
update airport set timezone = 'America/Phoenix' where city_code = 'LGF';
update airport set timezone = 'Australia/Adelaide' where city_code = 'LGH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LGN';
update airport set timezone = 'America/Santiago' where city_code = 'LGR';
update airport set timezone = 'America/Bogota' where city_code = 'LGT';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'LGX';
update airport set timezone = 'America/Caracas' where city_code = 'LGY';
update airport set timezone = 'Asia/Jayapura' where city_code = 'LHI';
update airport set timezone = 'Asia/Shanghai' where city_code = 'LHK';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'LHP';
update airport set timezone = 'Africa/Windhoek' where city_code = 'LHU';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LIA';
update airport set timezone = 'Australia/Darwin' where city_code = 'LIB';
update airport set timezone = 'America/Denver' where city_code = 'LIC';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'LIE';
update airport set timezone = 'Asia/Jayapura' where city_code = 'LII';
update airport set timezone = 'America/Juneau' where city_code = 'LIJ';
update airport set timezone = 'America/New_York' where city_code = 'LIY';
update airport set timezone = 'America/New_York' where city_code = 'LIZ';
update airport set timezone = 'America/Chicago' where city_code = 'LJN';
update airport set timezone = 'Asia/Makassar' where city_code = 'LKA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LKD';
update airport set timezone = 'Africa/Mogadishu' where city_code = 'LKR';
update airport set timezone = 'Africa/Nairobi' where city_code = 'LKU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LKV';
update airport set timezone = 'Asia/Muscat' where city_code = 'LKW';
update airport set timezone = 'Europe/London' where city_code = 'LKZ';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LLB';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LLG';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'LLH';
update airport set timezone = 'Asia/Dhaka' where city_code = 'LLJ';
update airport set timezone = 'Australia/Perth' where city_code = 'LLL';
update airport set timezone = 'Asia/Jayapura' where city_code = 'LLN';
update airport set timezone = 'Asia/Makassar' where city_code = 'LLO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LLP';
update airport set timezone = 'America/Chicago' where city_code = 'LLQ';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'LLS';
update airport set timezone = 'Africa/Luanda' where city_code = 'LLT';
update airport set timezone = 'America/New_York' where city_code = 'LLX';
update airport set timezone = 'America/New_York' where city_code = 'LLY';
update airport set timezone = 'Africa/Blantyre' where city_code = 'LMB';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'LMD';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'LMH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LMI';
update airport set timezone = 'Africa/Tripoli' where city_code = 'LMQ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'LMR';
update airport set timezone = 'America/Chicago' where city_code = 'LMS';
update airport set timezone = 'America/Bogota' where city_code = 'LMX';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LNF';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LNG';
update airport set timezone = 'Australia/Darwin' where city_code = 'LNH';
update airport set timezone = 'America/Anchorage' where city_code = 'LNI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LNM';
update airport set timezone = 'America/New_York' where city_code = 'LNP';
update airport set timezone = 'Europe/Moscow' where city_code = 'LNX';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LOA';
update airport set timezone = 'America/Santiago' where city_code = 'LOB';
update airport set timezone = 'Australia/Adelaide' where city_code = 'LOC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'LOI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LOL';
update airport set timezone = 'America/Mexico_City' where city_code = 'LOM';
update airport set timezone = 'Africa/Gaborone' where city_code = 'LOQ';
update airport set timezone = 'America/Chicago' where city_code = 'LOR';
update airport set timezone = 'America/New_York' where city_code = 'LOW';
update airport set timezone = 'Africa/Nairobi' where city_code = 'LOY';
update airport set timezone = 'America/Bogota' where city_code = 'LPE';
update airport set timezone = 'Asia/Chongqing' where city_code = 'LPF';
update airport set timezone = 'America/Caracas' where city_code = 'LPJ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LPN';
update airport set timezone = 'America/Chicago' where city_code = 'LPO';
update airport set timezone = 'America/Sitka' where city_code = 'LPW';
update airport set timezone = 'America/New_York' where city_code = 'LQK';
update airport set timezone = 'Asia/Kabul' where city_code = 'LQN';
update airport set timezone = 'Africa/Maseru' where city_code = 'LRB';
update airport set timezone = 'Asia/Karachi' where city_code = 'LRG';
update airport set timezone = 'America/Bogota' where city_code = 'LRI';
update airport set timezone = 'America/Chicago' where city_code = 'LRJ';
update airport set timezone = 'America/Nome' where city_code = 'LRK';
update airport set timezone = 'America/Winnipeg' where city_code = 'LRQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'LSJ';
update airport set timezone = 'America/Costa_Rica' where city_code = 'LSL';
update airport set timezone = 'Asia/Kuching' where city_code = 'LSM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LSN';
update airport set timezone = 'Europe/Paris' where city_code = 'LSO';
update airport set timezone = 'America/Nome' where city_code = 'LSR';
update airport set timezone = 'Asia/Kuching' where city_code = 'LSU';
update airport set timezone = 'Asia/Jakarta' where city_code = 'LSX';
update airport set timezone = 'Australia/Melbourne' where city_code = 'LTB';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'LTC';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'LTG';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LTH';
update airport set timezone = 'Africa/Libreville' where city_code = 'LTL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LTP';
update airport set timezone = 'Europe/Dublin' where city_code = 'LTR';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LTV';
update airport set timezone = 'America/New_York' where city_code = 'LTW';
update airport set timezone = 'America/Guyana' where city_code = 'LUB';
update airport set timezone = 'Pacific/Fiji' where city_code = 'LUC';
update airport set timezone = 'Europe/Bratislava' where city_code = 'LUE';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'LUI';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'LUJ';
update airport set timezone = 'America/Chicago' where city_code = 'LUL';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'LUS';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LUT';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LUU';
update airport set timezone = 'America/Bahia' where city_code = 'LVB';
update airport set timezone = 'Asia/Tehran' where city_code = 'LVP';
update airport set timezone = 'Asia/Makassar' where city_code = 'LWE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'LWH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'LWL';
update airport set timezone = 'America/Chicago' where city_code = 'LWV';
update airport set timezone = 'America/Chicago' where city_code = 'LXN';
update airport set timezone = 'Africa/Lusaka' where city_code = 'LXU';
update airport set timezone = 'America/Denver' where city_code = 'LXV';
update airport set timezone = 'Asia/Makassar' where city_code = 'LYK';
update airport set timezone = 'America/Chicago' where city_code = 'LYO';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'LZA';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'LZI';
update airport set timezone = 'Africa/Luanda' where city_code = 'LZM';
update airport set timezone = 'America/New_York' where city_code = 'MAC';
update airport set timezone = 'Asia/Jayapura' where city_code = 'MAL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MAP';
update airport set timezone = 'America/Chicago' where city_code = 'MAW';
update airport set timezone = 'America/Nassau' where city_code = 'MAY';
update airport set timezone = 'Australia/Perth' where city_code = 'MBB';
update airport set timezone = 'Africa/Libreville' where city_code = 'MBC';
update airport set timezone = 'America/Chicago' where city_code = 'MBG';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'MBI';
update airport set timezone = 'America/Cuiaba' where city_code = 'MBK';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MBM';
update airport set timezone = 'Australia/Perth' where city_code = 'MBN';
update airport set timezone = 'Asia/Manila' where city_code = 'MBO';
update airport set timezone = 'America/Lima' where city_code = 'MBP';
update airport set timezone = 'Africa/Kampala' where city_code = 'MBQ';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'MBR';
update airport set timezone = 'America/Chicago' where city_code = 'MBY';
update airport set timezone = 'Africa/Conakry' where city_code = 'MCA';
update airport set timezone = 'America/Chicago' where city_code = 'MCB';
update airport set timezone = 'America/Bogota' where city_code = 'MCJ';
update airport set timezone = 'Europe/Budapest' where city_code = 'MCQ';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'MCS';
update airport set timezone = 'America/Chicago' where city_code = 'MDA';
update airport set timezone = 'America/Belize' where city_code = 'MDB';
update airport set timezone = 'America/Chicago' where city_code = 'MDD';
update airport set timezone = 'America/Chicago' where city_code = 'MDF';
update airport set timezone = 'America/Chicago' where city_code = 'MDH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MDJ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MDM';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'MDN';
update airport set timezone = 'Asia/Jayapura' where city_code = 'MDP';
update airport set timezone = 'America/Anchorage' where city_code = 'MDR';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'MDX';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'MEF';
update airport set timezone = 'America/New_York' where city_code = 'MEJ';
update airport set timezone = 'America/New_York' where city_code = 'MEO';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'MEP';
update airport set timezone = 'Asia/Jakarta' where city_code = 'MEQ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MET';
update airport set timezone = 'America/Santarem' where city_code = 'MEU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MEV';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'MEW';
update airport set timezone = 'Africa/Maseru' where city_code = 'MFC';
update airport set timezone = 'Africa/Libreville' where city_code = 'MFF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MFH';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MFL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MFO';
update airport set timezone = 'Australia/Darwin' where city_code = 'MFP';
update airport set timezone = 'America/Bogota' where city_code = 'MFS';
update airport set timezone = 'America/New_York' where city_code = 'MFV';
update airport set timezone = 'Asia/Aden' where city_code = 'MFY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MFZ';
update airport set timezone = 'America/La_Paz' where city_code = 'MGD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MGG';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MGK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MGP';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MGU';
update airport set timezone = 'Australia/Perth' where city_code = 'MGV';
update airport set timezone = 'Africa/Libreville' where city_code = 'MGX';
update airport set timezone = 'America/Santiago' where city_code = 'MHC';
update airport set timezone = 'America/Chicago' where city_code = 'MHE';
update airport set timezone = 'America/Bogota' where city_code = 'MHF';
update airport set timezone = 'Africa/Djibouti' where city_code = 'MHI';
update airport set timezone = 'America/Denver' where city_code = 'MHN';
update airport set timezone = 'Australia/Perth' where city_code = 'MHO';
update airport set timezone = 'America/La_Paz' where city_code = 'MHW';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MHY';
update airport set timezone = 'Australia/Perth' where city_code = 'MIH';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MIN';
update airport set timezone = 'America/Chicago' where city_code = 'MIO';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'MIP';
update airport set timezone = 'America/Chicago' where city_code = 'MIQ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MIT';
update airport set timezone = 'America/Chicago' where city_code = 'MIW';
update airport set timezone = 'America/Bogota' where city_code = 'MIX';
update airport set timezone = 'Australia/Darwin' where city_code = 'MIY';
update airport set timezone = 'Australia/Darwin' where city_code = 'MIZ';
update airport set timezone = 'America/Havana' where city_code = 'MJG';
update airport set timezone = 'Asia/Riyadh' where city_code = 'MJH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MJJ';
update airport set timezone = 'Africa/Windhoek' where city_code = 'MJO';
update airport set timezone = 'Australia/Perth' where city_code = 'MJP';
update airport set timezone = 'America/Chicago' where city_code = 'MJQ';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'MJR';
update airport set timezone = 'Africa/Maputo' where city_code = 'MJS';
update airport set timezone = 'Africa/Harare' where city_code = 'MJW';
update airport set timezone = 'America/New_York' where city_code = 'MJX';
update airport set timezone = 'Europe/Prague' where city_code = 'MKA';
update airport set timezone = 'Africa/Libreville' where city_code = 'MKB';
update airport set timezone = 'Africa/Maseru' where city_code = 'MKH';
update airport set timezone = 'Africa/Bangui' where city_code = 'MKI';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'MKJ';
update airport set timezone = 'America/Chicago' where city_code = 'MKT';
update airport set timezone = 'Australia/Darwin' where city_code = 'MKV';
update airport set timezone = 'Asia/Aden' where city_code = 'MKX';
update airport set timezone = 'America/Denver' where city_code = 'MLF';
update airport set timezone = 'America/Denver' where city_code = 'MLK';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MLR';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MLV';
update airport set timezone = 'America/Montevideo' where city_code = 'MLZ';
update airport set timezone = 'America/Monterrey' where city_code = 'MMC';
update airport set timezone = 'Africa/Douala' where city_code = 'MMF';
update airport set timezone = 'America/Chicago' where city_code = 'MML';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MMM';
update airport set timezone = 'Africa/Lusaka' where city_code = 'MMQ';
update airport set timezone = 'America/New_York' where city_code = 'MMT';
update airport set timezone = 'Asia/Makassar' where city_code = 'MNA';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MNE';
update airport set timezone = 'Asia/Colombo' where city_code = 'MNH';
update airport set timezone = 'Asia/Muscat' where city_code = 'MNH';
update airport set timezone = 'America/New_York' where city_code = 'MNN';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'MNO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MNP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MNQ';
update airport set timezone = 'Africa/Lusaka' where city_code = 'MNR';
update airport set timezone = 'Africa/Lusaka' where city_code = 'MNS';
update airport set timezone = 'Australia/Darwin' where city_code = 'MNV';
update airport set timezone = 'Australia/Darwin' where city_code = 'MNW';
update airport set timezone = 'Asia/Rangoon' where city_code = 'MOE';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'MOM';
update airport set timezone = 'America/Detroit' where city_code = 'MOP';
update airport set timezone = 'America/New_York' where city_code = 'MOR';
update airport set timezone = 'Asia/Jakarta' where city_code = 'MPC';
update airport set timezone = 'Asia/Karachi' where city_code = 'MPD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MPF';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MPG';
update airport set timezone = 'America/Chicago' where city_code = 'MPJ';
update airport set timezone = 'America/New_York' where city_code = 'MPO';
update airport set timezone = 'America/Chicago' where city_code = 'MPR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MPX';
update airport set timezone = 'America/Chicago' where city_code = 'MPZ';
update airport set timezone = 'Australia/Perth' where city_code = 'MQA';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'MQD';
update airport set timezone = 'Australia/Darwin' where city_code = 'MQE';
update airport set timezone = 'Asia/Magadan' where city_code = 'MQJ';
update airport set timezone = 'America/La_Paz' where city_code = 'MQK';
update airport set timezone = 'America/Bogota' where city_code = 'MQR';
update airport set timezone = 'America/Bogota' where city_code = 'MQU';
update airport set timezone = 'Africa/Algiers' where city_code = 'MQV';
update airport set timezone = 'America/New_York' where city_code = 'MQW';
update airport set timezone = 'America/Chicago' where city_code = 'MQY';
update airport set timezone = 'Australia/Perth' where city_code = 'MQZ';
update airport set timezone = 'America/Chicago' where city_code = 'MRC';
update airport set timezone = 'America/Chicago' where city_code = 'MRF';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MRG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MRH';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MRL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MRM';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MRP';
update airport set timezone = 'America/Guayaquil' where city_code = 'MRR';
update airport set timezone = 'Australia/Darwin' where city_code = 'MRT';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'MRW';
update airport set timezone = 'America/Phoenix' where city_code = 'MSC';
update airport set timezone = 'Australia/Darwin' where city_code = 'MSF';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'MSM';
update airport set timezone = 'America/New_York' where city_code = 'MSV';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'MSX';
update airport set timezone = 'Pacific/Auckland' where city_code = 'MTA';
update airport set timezone = 'America/Bogota' where city_code = 'MTB';
update airport set timezone = 'Australia/Darwin' where city_code = 'MTD';
update airport set timezone = 'America/Santarem' where city_code = 'MTE';
update airport set timezone = 'America/Cuiaba' where city_code = 'MTG';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'MTI';
update airport set timezone = 'America/Chicago' where city_code = 'MTO';
update airport set timezone = 'America/New_York' where city_code = 'MTP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MTQ';
update airport set timezone = 'Africa/Maputo' where city_code = 'MTU';
update airport set timezone = 'America/Chicago' where city_code = 'MTW';
update airport set timezone = 'America/Anchorage' where city_code = 'MTX';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'MTZ';
update airport set timezone = 'Africa/Maputo' where city_code = 'MUD';
update airport set timezone = 'Asia/Jayapura' where city_code = 'MUF';
update airport set timezone = 'America/Mazatlan' where city_code = 'MUG';
update airport set timezone = 'America/New_York' where city_code = 'MUL';
update airport set timezone = 'Australia/Darwin' where city_code = 'MUP';
update airport set timezone = 'Asia/Tokyo' where city_code = 'MUS';
update airport set timezone = 'America/Chicago' where city_code = 'MUT';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'MUY';
update airport set timezone = 'America/Chicago' where city_code = 'MVC';
update airport set timezone = 'America/Chicago' where city_code = 'MVE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MVI';
update airport set timezone = 'America/Jamaica' where city_code = 'MVJ';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MVK';
update airport set timezone = 'America/Denver' where city_code = 'MVM';
update airport set timezone = 'America/Chicago' where city_code = 'MVN';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'MVO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MVU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'MVW';
update airport set timezone = 'Africa/Libreville' where city_code = 'MVX';
update airport set timezone = 'Asia/Karachi' where city_code = 'MWD';
update airport set timezone = 'Africa/Khartoum' where city_code = 'MWE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MWG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MWI';
update airport set timezone = 'America/Guyana' where city_code = 'MWJ';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'MWN';
update airport set timezone = 'America/New_York' where city_code = 'MWO';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MWR';
update airport set timezone = 'Australia/Adelaide' where city_code = 'MWT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MWU';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'MWV';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MWY';
update airport set timezone = 'America/Chicago' where city_code = 'MXA';
update airport set timezone = 'Asia/Makassar' where city_code = 'MXB';
update airport set timezone = 'America/Denver' where city_code = 'MXC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'MXD';
update airport set timezone = 'America/New_York' where city_code = 'MXE';
update airport set timezone = 'Asia/Manila' where city_code = 'MXI';
update airport set timezone = 'America/Chicago' where city_code = 'MXO';
update airport set timezone = 'Europe/Kiev' where city_code = 'MXR';
update airport set timezone = 'Australia/Perth' where city_code = 'MXU';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'MXW';
update airport set timezone = 'America/Anchorage' where city_code = 'MYK';
update airport set timezone = 'America/Guyana' where city_code = 'MYM';
update airport set timezone = 'Asia/Aden' where city_code = 'MYN';
update airport set timezone = 'Australia/Perth' where city_code = 'MYO';
update airport set timezone = 'Africa/Blantyre' where city_code = 'MYZ';
update airport set timezone = 'Africa/Libreville' where city_code = 'MZC';
update airport set timezone = 'America/Guayaquil' where city_code = 'MZD';
update airport set timezone = 'America/New_York' where city_code = 'MZE';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MZF';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'MZN';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MZQ';
update airport set timezone = 'Asia/Kolkata' where city_code = 'MZU';
update airport set timezone = 'Africa/Algiers' where city_code = 'MZW';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'MZY';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'MZZ';
update airport set timezone = 'America/New_York' where city_code = 'NAB';
update airport set timezone = 'Australia/Adelaide' where city_code = 'NAC';
update airport set timezone = 'America/Bogota' where city_code = 'NAD';
update airport set timezone = 'Africa/Porto-Novo' where city_code = 'NAE';
update airport set timezone = 'Asia/Makassar' where city_code = 'NAF';
update airport set timezone = 'Asia/Jayapura' where city_code = 'NAM';
update airport set timezone = 'America/Bogota' where city_code = 'NAR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'NAU';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'NAZ';
update airport set timezone = 'Australia/Sydney' where city_code = 'NBH';
update airport set timezone = 'America/Panama' where city_code = 'NBL';
update airport set timezone = 'Australia/Brisbane' where city_code = 'NBR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'NBV';
update airport set timezone = 'America/Havana' where city_code = 'NBW';
update airport set timezone = 'America/Chihuahua' where city_code = 'NCG';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'NCH';
update airport set timezone = 'America/Bogota' where city_code = 'NCI';
update airport set timezone = 'America/New_York' where city_code = 'NCO';
update airport set timezone = 'America/Managua' where city_code = 'NCR';
update airport set timezone = 'America/Costa_Rica' where city_code = 'NCT';
update airport set timezone = 'Africa/Luanda' where city_code = 'NDD';
update airport set timezone = 'Africa/Nairobi' where city_code = 'NDE';
update airport set timezone = 'Africa/Luanda' where city_code = 'NDF';
update airport set timezone = 'Africa/Bangui' where city_code = 'NDL';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'NDM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'NDN';
update airport set timezone = 'Australia/Perth' where city_code = 'NDS';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'NEF';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'NEJ';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'NEK';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'NER';
update airport set timezone = 'America/Nassau' where city_code = 'NET';
update airport set timezone = 'Asia/Vientiane' where city_code = 'NEU';
update airport set timezone = 'Africa/Tripoli' where city_code = 'NFR';
update airport set timezone = 'Australia/Sydney' where city_code = 'NGA';
update airport set timezone = 'America/Tortola' where city_code = 'NGD';
update airport set timezone = 'Asia/Sakhalin' where city_code = 'NGK';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'NGL';
update airport set timezone = 'America/Panama' where city_code = 'NGN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'NGR';
update airport set timezone = 'America/Chicago' where city_code = 'NGW';
update airport set timezone = 'Africa/Khartoum' where city_code = 'NHF';
update airport set timezone = 'Asia/Karachi' where city_code = 'NHS';
update airport set timezone = 'America/Chicago' where city_code = 'NHX';
update airport set timezone = 'America/New_York' where city_code = 'NHZ';
update airport set timezone = 'Africa/Monrovia' where city_code = 'NIA';
update airport set timezone = 'America/Juneau' where city_code = 'NIE';
update airport set timezone = 'Australia/Perth' where city_code = 'NIF';
update airport set timezone = 'Africa/Dakar' where city_code = 'NIK';
update airport set timezone = 'America/Godthab' where city_code = 'NIQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'NIS';
update airport set timezone = 'Africa/Bamako' where city_code = 'NIX';
update airport set timezone = 'Asia/Tokyo' where city_code = 'NJA';
update airport set timezone = 'America/New_York' where city_code = 'NJP';
update airport set timezone = 'America/Chicago' where city_code = 'NJW';
update airport set timezone = 'Australia/Perth' where city_code = 'NKB';
update airport set timezone = 'Asia/Jayapura' where city_code = 'NKD';
update airport set timezone = 'Africa/Kinshasa' where city_code = 'NKL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'NKN';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'NKO';
update airport set timezone = 'Africa/Douala' where city_code = 'NKS';
update airport set timezone = 'Africa/Maseru' where city_code = 'NKU';
update airport set timezone = 'Indian/Chagos' where city_code = 'NKW';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'NKY';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'NLI';
update airport set timezone = 'Australia/Perth' where city_code = 'NLL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NLN';
update airport set timezone = 'Australia/Perth' where city_code = 'NLS';
update airport set timezone = 'America/Mexico_City' where city_code = 'NLU';
update airport set timezone = 'America/Nassau' where city_code = 'NMC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'NMP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'NMR';
update airport set timezone = 'Asia/Rangoon' where city_code = 'NMS';
update airport set timezone = 'Asia/Rangoon' where city_code = 'NMT';
update airport set timezone = 'Africa/Windhoek' where city_code = 'NNI';
update airport set timezone = 'America/Anchorage' where city_code = 'NNK';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'NNU';
update airport set timezone = 'Europe/Berlin' where city_code = 'NOD';
update airport set timezone = 'America/Cuiaba' where city_code = 'NOK';
update airport set timezone = 'America/Anchorage' where city_code = 'NOL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'NOM';
update airport set timezone = 'Europe/Istanbul' where city_code = 'NOP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NOT';
update airport set timezone = 'Asia/Pontianak' where city_code = 'NPO';
update airport set timezone = 'Australia/Darwin' where city_code = 'NPP';
update airport set timezone = 'America/Santarem' where city_code = 'NPR';
update airport set timezone = 'America/New_York' where city_code = 'NPT';
update airport set timezone = 'America/Bogota' where city_code = 'NPU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'NQL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NRC';
update airport set timezone = 'Asia/Jayapura' where city_code = 'NRE';
update airport set timezone = 'Australia/Perth' where city_code = 'NRG';
update airport set timezone = 'America/New_York' where city_code = 'NRJ';
update airport set timezone = 'Africa/Bamako' where city_code = 'NRM';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'NRR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NRS';
update airport set timezone = 'Australia/Darwin' where city_code = 'NRY';
update airport set timezone = 'Australia/Brisbane' where city_code = 'NSA';
update airport set timezone = 'America/New_York' where city_code = 'NSF';
update airport set timezone = 'Australia/Perth' where city_code = 'NSM';
update airport set timezone = 'Asia/Manila' where city_code = 'NSP';
update airport set timezone = 'America/Godthab' where city_code = 'NSQ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'NSV';
update airport set timezone = 'Asia/Jayapura' where city_code = 'NTI';
update airport set timezone = 'America/Araguaina' where city_code = 'NTM';
update airport set timezone = 'Atlantic/Cape_Verde' where city_code = 'NTO';
update airport set timezone = 'Asia/Colombo' where city_code = 'NUA';
update airport set timezone = 'Australia/Darwin' where city_code = 'NUB';
update airport set timezone = 'Africa/Khartoum' where city_code = 'NUD';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'NUG';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'NUK';
update airport set timezone = 'America/Chicago' where city_code = 'NUN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'NUT';
update airport set timezone = 'Africa/Nairobi' where city_code = 'NUU';
update airport set timezone = 'America/Chicago' where city_code = 'NVD';
update airport set timezone = 'America/Managua' where city_code = 'NVG';
update airport set timezone = 'America/Hermosillo' where city_code = 'NVJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'NVN';
update airport set timezone = 'Europe/Moscow' where city_code = 'NVR';
update airport set timezone = 'Asia/Kolkata' where city_code = 'NVY';
update airport set timezone = 'America/New_York' where city_code = 'NWH';
update airport set timezone = 'America/St_Johns' where city_code = 'NWP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'NWT';
update airport set timezone = 'Atlantic/Bermuda' where city_code = 'NWU';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'NYR';
update airport set timezone = 'Asia/Rangoon' where city_code = 'NYW';
update airport set timezone = 'Africa/Conakry' where city_code = 'NZE';
update airport set timezone = 'Africa/Nairobi' where city_code = 'NZO';
update airport set timezone = 'Asia/Kabul' where city_code = 'OAA';
update airport set timezone = 'Asia/Kabul' where city_code = 'OAH';
update airport set timezone = 'Asia/Kabul' where city_code = 'OAI';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'OAN';
update airport set timezone = 'Asia/Kabul' where city_code = 'OAS';
update airport set timezone = 'Asia/Kabul' where city_code = 'OAZ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'OBD';
update airport set timezone = 'America/Santarem' where city_code = 'OBI';
update airport set timezone = 'Europe/Brussels' where city_code = 'OBL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OBM';
update airport set timezone = 'America/New_York' where city_code = 'OBT';
update airport set timezone = 'America/New_York' where city_code = 'OCE';
update airport set timezone = 'America/Chicago' where city_code = 'OCH';
update airport set timezone = 'America/Anchorage' where city_code = 'OCI';
update airport set timezone = 'Australia/Perth' where city_code = 'OCM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OCN';
update airport set timezone = 'Africa/Bangui' where city_code = 'ODA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ODC';
update airport set timezone = 'Australia/Adelaide' where city_code = 'ODD';
update airport set timezone = 'Africa/Bangui' where city_code = 'ODJ';
update airport set timezone = 'Australia/Adelaide' where city_code = 'ODL';
update airport set timezone = 'America/New_York' where city_code = 'ODM';
update airport set timezone = 'Australia/Perth' where city_code = 'ODR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ODW';
update airport set timezone = 'America/Chicago' where city_code = 'ODX';
update airport set timezone = 'America/Chicago' where city_code = 'OEA';
update airport set timezone = 'Asia/Dili' where city_code = 'OEC';
update airport set timezone = 'Europe/Moscow' where city_code = 'OEL';
update airport set timezone = 'America/Chicago' where city_code = 'OEO';
update airport set timezone = 'Africa/Abidjan' where city_code = 'OFI';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'OFJ';
update airport set timezone = 'America/Chicago' where city_code = 'OFK';
update airport set timezone = 'America/Denver' where city_code = 'OGA';
update airport set timezone = 'America/New_York' where city_code = 'OGB';
update airport set timezone = 'America/Denver' where city_code = 'OGD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OGE';
update airport set timezone = 'America/Panama' where city_code = 'OGM';
update airport set timezone = 'Africa/Abidjan' where city_code = 'OGO';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'OGR';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OGV';
update airport set timezone = 'Pacific/Auckland' where city_code = 'OHA';
update airport set timezone = 'America/Nome' where city_code = 'OHC';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OHI';
update airport set timezone = 'Asia/Karachi' where city_code = 'OHT';
update airport set timezone = 'America/New_York' where city_code = 'OIC';
update airport set timezone = 'America/New_York' where city_code = 'OIL';
update airport set timezone = 'Africa/Tunis' where city_code = 'OIZ';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OKE';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'OKG';
update airport set timezone = 'Europe/London' where city_code = 'OKH';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'OKK';
update airport set timezone = 'Asia/Jayapura' where city_code = 'OKL';
update airport set timezone = 'America/Chicago' where city_code = 'OKM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OKP';
update airport set timezone = 'Asia/Jayapura' where city_code = 'OKQ';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'OKT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OKV';
update airport set timezone = 'America/New_York' where city_code = 'OLD';
update airport set timezone = 'America/New_York' where city_code = 'OLE';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'OLI';
update airport set timezone = 'Pacific/Efate' where city_code = 'OLJ';
update airport set timezone = 'America/Asuncion' where city_code = 'OLK';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'OLL';
update airport set timezone = 'Europe/Prague' where city_code = 'OLO';
update airport set timezone = 'Asia/Kabul' where city_code = 'OLR';
update airport set timezone = 'America/Chicago' where city_code = 'OLU';
update airport set timezone = 'America/Chicago' where city_code = 'OLY';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OMG';
update airport set timezone = 'Asia/Tehran' where city_code = 'OMI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'OMJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OMK';
update airport set timezone = 'Asia/Phnom_Penh' where city_code = 'OMY';
update airport set timezone = 'America/Chicago' where city_code = 'ONA';
update airport set timezone = 'Asia/Jayapura' where city_code = 'ONI';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'ONK';
update airport set timezone = 'America/Chicago' where city_code = 'ONL';
update airport set timezone = 'America/Denver' where city_code = 'ONM';
update airport set timezone = 'America/Anchorage' where city_code = 'ONN';
update airport set timezone = 'America/Boise' where city_code = 'ONO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ONR';
update airport set timezone = 'Pacific/Fiji' where city_code = 'ONU';
update airport set timezone = 'America/Chicago' where city_code = 'ONY';
update airport set timezone = 'America/Chicago' where city_code = 'OOA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'OOR';
update airport set timezone = 'Pacific/Tarawa' where city_code = 'OOT';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'OPA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OPB';
update airport set timezone = 'Australia/Darwin' where city_code = 'OPI';
update airport set timezone = 'America/Chicago' where city_code = 'OPL';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OPW';
update airport set timezone = 'America/Bogota' where city_code = 'ORC';
update airport set timezone = 'Europe/London' where city_code = 'ORM';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'ORO';
update airport set timezone = 'Australia/Adelaide' where city_code = 'ORR';
update airport set timezone = 'America/La_Paz' where city_code = 'ORU';
update airport set timezone = 'America/Belize' where city_code = 'ORZ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'OSE';
update airport set timezone = 'Europe/Moscow' where city_code = 'OSF';
update airport set timezone = 'Asia/Baghdad' where city_code = 'OSM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'OSO';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'OTA';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'OTC';
update airport set timezone = 'America/Chicago' where city_code = 'OTG';
update airport set timezone = 'Africa/Windhoek' where city_code = 'OTJ';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'OTL';
update airport set timezone = 'America/Chicago' where city_code = 'OTM';
update airport set timezone = 'America/Denver' where city_code = 'OTO';
update airport set timezone = 'America/Cuiaba' where city_code = 'OTT';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'OTV';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'OTY';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'OUG';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'OUH';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'OUM';
update airport set timezone = 'America/Chicago' where city_code = 'OUN';
update airport set timezone = 'Africa/Douala' where city_code = 'OUR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'OUS';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'OUT';
update airport set timezone = 'Africa/Libreville' where city_code = 'OUU';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'OUZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OVE';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'OVG';
update airport set timezone = 'America/Santiago' where city_code = 'OVL';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'OVR';
update airport set timezone = 'America/New_York' where city_code = 'OWK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'OXO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'OXY';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'OYA';
update airport set timezone = 'America/Belem' where city_code = 'OYK';
update airport set timezone = 'Australia/Sydney' where city_code = 'OYN';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'OYO';
update airport set timezone = 'America/Cayenne' where city_code = 'OYP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'OYS';
update airport set timezone = 'Africa/Casablanca' where city_code = 'OZG';
update airport set timezone = 'America/Chicago' where city_code = 'OZR';
update airport set timezone = 'Asia/Rangoon' where city_code = 'PAA';
update airport set timezone = 'Pacific/Honolulu' where city_code = 'PAK';
update airport set timezone = 'America/Bogota' where city_code = 'PAL';
update airport set timezone = 'Asia/Rangoon' where city_code = 'PAU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'PAW';
update airport set timezone = 'Asia/Kuching' where city_code = 'PAY';
update airport set timezone = 'America/Campo_Grande' where city_code = 'PBB';
update airport set timezone = 'America/Bogota' where city_code = 'PBE';
update airport set timezone = 'America/Juneau' where city_code = 'PBK';
update airport set timezone = 'America/Porto_Velho' where city_code = 'PBQ';
update airport set timezone = 'America/Asuncion' where city_code = 'PBT';
update airport set timezone = 'Asia/Makassar' where city_code = 'PBW';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PBZ';
update airport set timezone = 'America/Chicago' where city_code = 'PCD';
update airport set timezone = 'America/Anchorage' where city_code = 'PCE';
update airport set timezone = 'America/Asuncion' where city_code = 'PCJ';
update airport set timezone = 'America/Mazatlan' where city_code = 'PCO';
update airport set timezone = 'Asia/Vientiane' where city_code = 'PCQ';
update airport set timezone = 'America/Fortaleza' where city_code = 'PCS';
update airport set timezone = 'America/New_York' where city_code = 'PCT';
update airport set timezone = 'America/Chicago' where city_code = 'PCU';
update airport set timezone = 'America/Hermosillo' where city_code = 'PCV';
update airport set timezone = 'Pacific/Noumea' where city_code = 'PDC';
update airport set timezone = 'Africa/Maputo' where city_code = 'PDD';
update airport set timezone = 'Australia/Adelaide' where city_code = 'PDE';
update airport set timezone = 'America/Bahia' where city_code = 'PDF';
update airport set timezone = 'America/Panama' where city_code = 'PDM';
update airport set timezone = 'Australia/Adelaide' where city_code = 'PDN';
update airport set timezone = 'America/Fortaleza' where city_code = 'PDR';
update airport set timezone = 'America/Montevideo' where city_code = 'PDU';
update airport set timezone = 'America/Caracas' where city_code = 'PDZ';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'PEH';
update airport set timezone = 'Europe/Rome' where city_code = 'PEJ';
update airport set timezone = 'Africa/Maseru' where city_code = 'PEL';
update airport set timezone = 'Australia/Darwin' where city_code = 'PEP';
update airport set timezone = 'America/Anchorage' where city_code = 'PFA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PFC';
update airport set timezone = 'America/Juneau' where city_code = 'PFD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'PGE';
update airport set timezone = 'America/Rio_Branco' where city_code = 'PGG';
update airport set timezone = 'Africa/Luanda' where city_code = 'PGI';
update airport set timezone = 'America/Chicago' where city_code = 'PGL';
update airport set timezone = 'America/Anchorage' where city_code = 'PGM';
update airport set timezone = 'America/Port-au-Prince' where city_code = 'PGN';
update airport set timezone = 'America/Phoenix' where city_code = 'PGS';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PGZ';
update airport set timezone = 'America/Fortaleza' where city_code = 'PHB';
update airport set timezone = 'Africa/Lagos' where city_code = 'PHG';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'PHH';
update airport set timezone = 'America/Fortaleza' where city_code = 'PHI';
update airport set timezone = 'America/Denver' where city_code = 'PHP';
update airport set timezone = 'Australia/Brisbane' where city_code = 'PHQ';
update airport set timezone = 'Pacific/Fiji' where city_code = 'PHR';
update airport set timezone = 'America/Chicago' where city_code = 'PHT';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'PHU';
update airport set timezone = 'America/Grand_Turk' where city_code = 'PIC';
update airport set timezone = 'America/Boa_Vista' where city_code = 'PIG';
update airport set timezone = 'America/Asuncion' where city_code = 'PIL';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PIV';
update airport set timezone = 'America/Winnipeg' where city_code = 'PIW';
update airport set timezone = 'America/Phoenix' where city_code = 'PJB';
update airport set timezone = 'America/Cancun' where city_code = 'PJZ';
update airport set timezone = 'America/Anchorage' where city_code = 'PKA';
update airport set timezone = 'America/Chicago' where city_code = 'PKD';
update airport set timezone = 'America/Guatemala' where city_code = 'PKJ';
update airport set timezone = 'Pacific/Auckland' where city_code = 'PKL';
update airport set timezone = 'America/Guyana' where city_code = 'PKM';
update airport set timezone = 'Africa/Porto-Novo' where city_code = 'PKO';
update airport set timezone = 'Australia/Darwin' where city_code = 'PKT';
update airport set timezone = 'America/Bogota' where city_code = 'PLA';
update airport set timezone = 'America/New_York' where city_code = 'PLB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'PLE';
update airport set timezone = 'Africa/Ndjamena' where city_code = 'PLF';
update airport set timezone = 'America/St_Vincent' where city_code = 'PLI';
update airport set timezone = 'America/Chicago' where city_code = 'PLK';
update airport set timezone = 'America/Chicago' where city_code = 'PLR';
update airport set timezone = 'America/Bogota' where city_code = 'PLT';
update airport set timezone = 'America/New_York' where city_code = 'PMH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'PMN';
update airport set timezone = 'America/Guyana' where city_code = 'PMT';
update airport set timezone = 'America/Anchorage' where city_code = 'PNF';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PNG';
update airport set timezone = 'Asia/Shanghai' where city_code = 'PNJ';
update airport set timezone = 'America/New_York' where city_code = 'PNN';
update airport set timezone = 'America/Mexico_City' where city_code = 'PNO';
update airport set timezone = 'America/Chicago' where city_code = 'PNX';
update airport set timezone = 'Africa/Dakar' where city_code = 'POD';
update airport set timezone = 'America/Chicago' where city_code = 'POH';
update airport set timezone = 'America/Guatemala' where city_code = 'PON';
update airport set timezone = 'America/New_York' where city_code = 'POU';
update airport set timezone = 'Europe/Bratislava' where city_code = 'POV';
update airport set timezone = 'America/Denver' where city_code = 'POY';
update airport set timezone = 'America/Chicago' where city_code = 'PPA';
update airport set timezone = 'America/Puerto_Rico' where city_code = 'PPD';
update airport set timezone = 'America/Chicago' where city_code = 'PPF';
update airport set timezone = 'America/Caracas' where city_code = 'PPH';
update airport set timezone = 'Australia/Adelaide' where city_code = 'PPI';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PPJ';
update airport set timezone = 'America/New_York' where city_code = 'PPM';
update airport set timezone = 'America/Nassau' where city_code = 'PPO';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PPR';
update airport set timezone = 'Asia/Rangoon' where city_code = 'PPU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'PPX';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PPY';
update airport set timezone = 'America/Caracas' where city_code = 'PPZ';
update airport set timezone = 'America/Mexico_City' where city_code = 'PQM';
update airport set timezone = 'America/Godthab' where city_code = 'PQT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PRB';
update airport set timezone = 'Australia/Perth' where city_code = 'PRD';
update airport set timezone = 'America/Bogota' where city_code = 'PRE';
update airport set timezone = 'America/Juneau' where city_code = 'PRF';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PRK';
update airport set timezone = 'Europe/Lisbon' where city_code = 'PRM';
update airport set timezone = 'America/Chicago' where city_code = 'PRO';
update airport set timezone = 'Europe/Paris' where city_code = 'PRP';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'PRQ';
update airport set timezone = 'America/Guyana' where city_code = 'PRR';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'PRS';
update airport set timezone = 'Asia/Rangoon' where city_code = 'PRU';
update airport set timezone = 'America/Chicago' where city_code = 'PRX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PRZ';
update airport set timezone = 'America/New_York' where city_code = 'PSB';
update airport set timezone = 'America/New_York' where city_code = 'PSF';
update airport set timezone = 'America/New_York' where city_code = 'PSK';
update airport set timezone = 'America/Havana' where city_code = 'PST';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PSW';
update airport set timezone = 'America/Sitka' where city_code = 'PTD';
update airport set timezone = 'Australia/Sydney' where city_code = 'PTE';
update airport set timezone = 'America/Caracas' where city_code = 'PTM';
update airport set timezone = 'America/Chicago' where city_code = 'PTN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PTO';
update airport set timezone = 'America/Santarem' where city_code = 'PTQ';
update airport set timezone = 'America/Chicago' where city_code = 'PTS';
update airport set timezone = 'America/Chicago' where city_code = 'PTT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PTV';
update airport set timezone = 'America/New_York' where city_code = 'PTW';
update airport set timezone = 'America/Bogota' where city_code = 'PTX';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'PUN';
update airport set timezone = 'America/Anchorage' where city_code = 'PUO';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'PUP';
update airport set timezone = 'Asia/Kolkata' where city_code = 'PUT';
update airport set timezone = 'Pacific/Noumea' where city_code = 'PUV';
update airport set timezone = 'America/Santiago' where city_code = 'PUX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PVF';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'PVI';
update airport set timezone = 'America/New_York' where city_code = 'PVL';
update airport set timezone = 'Europe/Sofia' where city_code = 'PVN';
update airport set timezone = 'America/Chicago' where city_code = 'PVW';
update airport set timezone = 'America/Anchorage' where city_code = 'PVY';
update airport set timezone = 'America/Chicago' where city_code = 'PWA';
update airport set timezone = 'America/Denver' where city_code = 'PWD';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'PWI';
update airport set timezone = 'Asia/Jakarta' where city_code = 'PWL';
update airport set timezone = 'America/Nassau' where city_code = 'PWN';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'PWO';
update airport set timezone = 'America/Sitka' where city_code = 'PWR';
update airport set timezone = 'America/Denver' where city_code = 'PWY';
update airport set timezone = 'America/Anchorage' where city_code = 'PXK';
update airport set timezone = 'America/Bogota' where city_code = 'PYA';
update airport set timezone = 'Asia/Kolkata' where city_code = 'PYB';
update airport set timezone = 'Asia/Tehran' where city_code = 'PYK';
update airport set timezone = 'America/Anchorage' where city_code = 'PYL';
update airport set timezone = 'America/Bogota' where city_code = 'PYN';
update airport set timezone = 'America/Guayaquil' where city_code = 'PYO';
update airport set timezone = 'America/Los_Angeles' where city_code = 'PYS';
update airport set timezone = 'America/Bogota' where city_code = 'PZA';
update airport set timezone = 'Pacific/Rarotonga' where city_code = 'PZK';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'PZL';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QAC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QAK';
update airport set timezone = 'Europe/Paris' where city_code = 'QAM';
update airport set timezone = 'Europe/Rome' where city_code = 'QAQ';
update airport set timezone = 'Europe/Belgrade' where city_code = 'QBG';
update airport set timezone = 'Europe/Paris' where city_code = 'QBQ';
update airport set timezone = 'America/Fortaleza' where city_code = 'QBX';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QCH';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QCN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QCR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QDB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QDC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QDF';
update airport set timezone = 'Atlantic/Azores' where city_code = 'QEG';
update airport set timezone = 'America/Godthab' where city_code = 'QFG';
update airport set timezone = 'America/Godthab' where city_code = 'QFN';
update airport set timezone = 'Europe/Oslo' where city_code = 'QFQ';
update airport set timezone = 'America/Godthab' where city_code = 'QFT';
update airport set timezone = 'America/Godthab' where city_code = 'QFX';
update airport set timezone = 'Asia/Tokyo' where city_code = 'QFY';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QGA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QGB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QGC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QGF';
update airport set timezone = 'America/Recife' where city_code = 'QGP';
update airport set timezone = 'America/Godthab' where city_code = 'QGQ';
update airport set timezone = 'America/Bahia' where city_code = 'QGS';
update airport set timezone = 'Europe/Brussels' where city_code = 'QHA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QHB';
update airport set timezone = 'America/Araguaina' where city_code = 'QHN';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QHP';
update airport set timezone = 'Europe/Berlin' where city_code = 'QHU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QHV';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QID';
update airport set timezone = 'America/Fortaleza' where city_code = 'QIG';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QIQ';
update airport set timezone = 'America/Bahia' where city_code = 'QIT';
update airport set timezone = 'Australia/Sydney' where city_code = 'QJD';
update airport set timezone = 'America/Godthab' where city_code = 'QJE';
update airport set timezone = 'America/Godthab' where city_code = 'QJH';
update airport set timezone = 'America/Godthab' where city_code = 'QJI';
update airport set timezone = 'Africa/Lusaka' where city_code = 'QKE';
update airport set timezone = 'Africa/Tunis' where city_code = 'QKN';
update airport set timezone = 'America/Cayenne' where city_code = 'QKR';
update airport set timezone = 'Africa/Algiers' where city_code = 'QLD';
update airport set timezone = 'Europe/Helsinki' where city_code = 'QLF';
update airport set timezone = 'Europe/Zurich' where city_code = 'QLS';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QMF';
update airport set timezone = 'America/Godthab' where city_code = 'QMK';
update airport set timezone = 'Europe/Rome' where city_code = 'QMM';
update airport set timezone = 'Europe/Belgrade' where city_code = 'QND';
update airport set timezone = 'Europe/Brussels' where city_code = 'QNM';
update airport set timezone = 'America/Araguaina' where city_code = 'QNR';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QNS';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QOA';
update airport set timezone = 'Europe/Berlin' where city_code = 'QOB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QOJ';
update airport set timezone = 'America/Godthab' where city_code = 'QOQ';
update airport set timezone = 'America/Havana' where city_code = 'QPD';
update airport set timezone = 'Africa/Gaborone' where city_code = 'QPH';
update airport set timezone = 'Europe/Berlin' where city_code = 'QPK';
update airport set timezone = 'America/Godthab' where city_code = 'QPW';
update airport set timezone = 'America/Santiago' where city_code = 'QRC';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QRE';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'QRF';
update airport set timezone = 'Australia/Sydney' where city_code = 'QRM';
update airport set timezone = 'Australia/Sydney' where city_code = 'QRR';
update airport set timezone = 'Europe/Paris' where city_code = 'QRV';
update airport set timezone = 'America/Godthab' where city_code = 'QRY';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'QSI';
update airport set timezone = 'America/Havana' where city_code = 'QSN';
update airport set timezone = 'America/Guyana' where city_code = 'QSX';
update airport set timezone = 'Europe/Paris' where city_code = 'QTJ';
update airport set timezone = 'Europe/London' where city_code = 'QUG';
update airport set timezone = 'Africa/Lagos' where city_code = 'QUO';
update airport set timezone = 'America/Godthab' where city_code = 'QUP';
update airport set timezone = 'America/Godthab' where city_code = 'QUV';
update airport set timezone = 'America/Godthab' where city_code = 'QUW';
update airport set timezone = 'Europe/London' where city_code = 'QUY';
update airport set timezone = 'Europe/Rome' where city_code = 'QVA';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QVB';
update airport set timezone = 'Europe/Helsinki' where city_code = 'QVE';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'QVP';
update airport set timezone = 'America/New_York' where city_code = 'QWG';
update airport set timezone = 'America/Denver' where city_code = 'QWP';
update airport set timezone = 'America/Maceio' where city_code = 'QXC';
update airport set timezone = 'Africa/Algiers' where city_code = 'QZN';
update airport set timezone = 'Europe/Rome' where city_code = 'QZO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RAA';
update airport set timezone = 'Pacific/Auckland' where city_code = 'RAG';
update airport set timezone = 'Europe/Rome' where city_code = 'RAN';
update airport set timezone = 'Asia/Makassar' where city_code = 'RAQ';
update airport set timezone = 'America/Bogota' where city_code = 'RAV';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RAW';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RAX';
update airport set timezone = 'Australia/Melbourne' where city_code = 'RBC';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RBF';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RBG';
update airport set timezone = 'America/Anchorage' where city_code = 'RBH';
update airport set timezone = 'Pacific/Fiji' where city_code = 'RBI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'RBJ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RBL';
update airport set timezone = 'America/La_Paz' where city_code = 'RBO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RBP';
update airport set timezone = 'Australia/Melbourne' where city_code = 'RBS';
update airport set timezone = 'Africa/Nairobi' where city_code = 'RBT';
update airport set timezone = 'Australia/Perth' where city_code = 'RBU';
update airport set timezone = 'America/New_York' where city_code = 'RBW';
update airport set timezone = 'Australia/Adelaide' where city_code = 'RCN';
update airport set timezone = 'America/Anchorage' where city_code = 'RCP';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'RCQ';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'RCR';
update airport set timezone = 'America/Detroit' where city_code = 'RCT';
update airport set timezone = 'America/Nassau' where city_code = 'RCY';
update airport set timezone = 'Australia/Darwin' where city_code = 'RDA';
update airport set timezone = 'America/Nome' where city_code = 'RDB';
update airport set timezone = 'Asia/Jayapura' where city_code = 'RDE';
update airport set timezone = 'Europe/Warsaw' where city_code = 'RDO';
update airport set timezone = 'Africa/Dakar' where city_code = 'RDT';
update airport set timezone = 'Europe/Berlin' where city_code = 'REB';
update airport set timezone = 'America/New_York' where city_code = 'RED';
update airport set timezone = 'America/Boise' where city_code = 'REO';
update airport set timezone = 'America/Guatemala' where city_code = 'RER';
update airport set timezone = 'Asia/Kolkata' where city_code = 'REW';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'REZ';
update airport set timezone = 'Africa/Bangui' where city_code = 'RFA';
update airport set timezone = 'America/Chicago' where city_code = 'RFG';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'RFN';
update airport set timezone = 'America/Costa_Rica' where city_code = 'RFR';
update airport set timezone = 'Asia/Kolkata' where city_code = 'RGH';
update airport set timezone = 'America/Chicago' where city_code = 'RGR';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'RHA';
update airport set timezone = 'Africa/Kigali' where city_code = 'RHG';
update airport set timezone = 'Australia/Perth' where city_code = 'RHL';
update airport set timezone = 'Africa/Windhoek' where city_code = 'RHN';
update airport set timezone = 'Asia/Chongqing' where city_code = 'RHT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RHV';
update airport set timezone = 'America/Chicago' where city_code = 'RIE';
update airport set timezone = 'America/Panama' where city_code = 'RIH';
update airport set timezone = 'America/Lima' where city_code = 'RIJ';
update airport set timezone = 'America/Lima' where city_code = 'RIM';
update airport set timezone = 'America/Panama' where city_code = 'RIT';
update airport set timezone = 'America/Panama' where city_code = 'RIZ';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'RJB';
update airport set timezone = 'Asia/Kolkata' where city_code = 'RJI';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'RKA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RKC';
update airport set timezone = 'Asia/Jakarta' where city_code = 'RKI';
update airport set timezone = 'America/Chicago' where city_code = 'RKR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RKU';
update airport set timezone = 'America/Chicago' where city_code = 'RKW';
update airport set timezone = 'Australia/Brisbane' where city_code = 'RKY';
update airport set timezone = 'America/Chicago' where city_code = 'RLA';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RLD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'RLP';
update airport set timezone = 'Africa/Niamey' where city_code = 'RLT';
update airport set timezone = 'Asia/Muscat' where city_code = 'RMB';
update airport set timezone = 'America/Chicago' where city_code = 'RMC';
update airport set timezone = 'Asia/Kolkata' where city_code = 'RMD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RMN';
update airport set timezone = 'Europe/Madrid' where city_code = 'RMU';
update airport set timezone = 'America/Chicago' where city_code = 'RNC';
update airport set timezone = 'America/Chicago' where city_code = 'RNH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RNR';
update airport set timezone = 'Asia/Kuching' where city_code = 'RNU';
update airport set timezone = 'America/Chicago' where city_code = 'RNZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'ROF';
update airport set timezone = 'America/Chicago' where city_code = 'ROG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ROH';
update airport set timezone = 'America/Denver' where city_code = 'ROL';
update airport set timezone = 'Europe/Sofia' where city_code = 'ROU';
update airport set timezone = 'America/Argentina/Catamarca' where city_code = 'ROY';
update airport set timezone = 'Europe/Madrid' where city_code = 'ROZ';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'RPA';
update airport set timezone = 'Australia/Darwin' where city_code = 'RPM';
update airport set timezone = 'Australia/Darwin' where city_code = 'RPV';
update airport set timezone = 'America/Denver' where city_code = 'RPX';
update airport set timezone = 'America/Denver' where city_code = 'RQE';
update airport set timezone = 'Asia/Baghdad' where city_code = 'RQW';
update airport set timezone = 'Australia/Adelaide' where city_code = 'RRE';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'RRI';
update airport set timezone = 'America/Santarem' where city_code = 'RRN';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'RRR';
update airport set timezone = 'America/Chicago' where city_code = 'RRT';
update airport set timezone = 'Australia/Darwin' where city_code = 'RRV';
update airport set timezone = 'Australia/Brisbane' where city_code = 'RSB';
update airport set timezone = 'America/Santarem' where city_code = 'RSG';
update airport set timezone = 'Asia/Jayapura' where city_code = 'RSK';
update airport set timezone = 'America/Chicago' where city_code = 'RSL';
update airport set timezone = 'America/Chicago' where city_code = 'RSN';
update airport set timezone = 'America/Anchorage' where city_code = 'RSP';
update airport set timezone = 'Africa/Khartoum' where city_code = 'RSS';
update airport set timezone = 'Asia/Kolkata' where city_code = 'RTC';
update airport set timezone = 'America/Sitka' where city_code = 'RTE';
update airport set timezone = 'Asia/Makassar' where city_code = 'RTI';
update airport set timezone = 'America/Denver' where city_code = 'RTN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'RTP';
update airport set timezone = 'Australia/Perth' where city_code = 'RTS';
update airport set timezone = 'Australia/Adelaide' where city_code = 'RTY';
update airport set timezone = 'Asia/Tehran' where city_code = 'RUD';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'RUE';
update airport set timezone = 'Asia/Jayapura' where city_code = 'RUF';
update airport set timezone = 'Asia/Shanghai' where city_code = 'RUG';
update airport set timezone = 'America/Denver' where city_code = 'RUI';
update airport set timezone = 'Asia/Kolkata' where city_code = 'RUP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'RUU';
update airport set timezone = 'America/Guatemala' where city_code = 'RUV';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'RUY';
update airport set timezone = 'Europe/Moscow' where city_code = 'RVH';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'RVO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'RWS';
update airport set timezone = 'Asia/Aden' where city_code = 'RXA';
update airport set timezone = 'America/Boise' where city_code = 'RXE';
update airport set timezone = 'Africa/Lusaka' where city_code = 'RYL';
update airport set timezone = 'America/Chicago' where city_code = 'RYV';
update airport set timezone = 'America/Los_Angeles' where city_code = 'RZH';
update airport set timezone = 'Europe/Moscow' where city_code = 'RZN';
update airport set timezone = 'Asia/Karachi' where city_code = 'RZS';
update airport set timezone = 'America/New_York' where city_code = 'RZZ';
update airport set timezone = 'America/Godthab' where city_code = 'SAE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SAM';
update airport set timezone = 'America/Chicago' where city_code = 'SAR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SAS';
update airport set timezone = 'Asia/Makassar' where city_code = 'SAU';
update airport set timezone = 'Africa/Monrovia' where city_code = 'SAZ';
update airport set timezone = 'America/Caracas' where city_code = 'SBB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SBC';
update airport set timezone = 'Asia/Kabul' where city_code = 'SBF';
update airport set timezone = 'Africa/Conakry' where city_code = 'SBI';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SBJ';
update airport set timezone = 'America/La_Paz' where city_code = 'SBL';
update airport set timezone = 'Asia/Karachi' where city_code = 'SBQ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SBT';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'SBV';
update airport set timezone = 'America/Denver' where city_code = 'SBX';
update airport set timezone = 'America/Bogota' where city_code = 'SCA';
update airport set timezone = 'America/Chicago' where city_code = 'SCB';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'SCD';
update airport set timezone = 'America/Phoenix' where city_code = 'SCF';
update airport set timezone = 'Australia/Brisbane' where city_code = 'SCG';
update airport set timezone = 'America/Caracas' where city_code = 'SCI';
update airport set timezone = 'America/Juneau' where city_code = 'SCJ';
update airport set timezone = 'Europe/Paris' where city_code = 'SCP';
update airport set timezone = 'America/New_York' where city_code = 'SCR';
update airport set timezone = 'Asia/Baghdad' where city_code = 'SDA';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'SDB';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'SDH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SDI';
update airport set timezone = 'Asia/Tokyo' where city_code = 'SDS';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'SED';
update airport set timezone = 'America/New_York' where city_code = 'SEG';
update airport set timezone = 'America/Bahia' where city_code = 'SEI';
update airport set timezone = 'Asia/Magadan' where city_code = 'SEK';
update airport set timezone = 'Africa/Abidjan' where city_code = 'SEO';
update airport set timezone = 'America/Chicago' where city_code = 'SEP';
update airport set timezone = 'Asia/Pontianak' where city_code = 'SEQ';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'SER';
update airport set timezone = 'Europe/Zaporozhye' where city_code = 'SEV';
update airport set timezone = 'Africa/Cairo' where city_code = 'SEW';
update airport set timezone = 'Africa/Casablanca' where city_code = 'SFI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SFU';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SFV';
update airport set timezone = 'America/Panama' where city_code = 'SFW';
update airport set timezone = 'America/Caracas' where city_code = 'SFX';
update airport set timezone = 'Asia/Kabul' where city_code = 'SGA';
update airport set timezone = 'Europe/Berlin' where city_code = 'SGE';
update airport set timezone = 'Asia/Kuching' where city_code = 'SGG';
update airport set timezone = 'Asia/Karachi' where city_code = 'SGI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SGK';
update airport set timezone = 'Asia/Manila' where city_code = 'SGL';
update airport set timezone = 'America/Mazatlan' where city_code = 'SGM';
update airport set timezone = 'Australia/Perth' where city_code = 'SGP';
update airport set timezone = 'Asia/Makassar' where city_code = 'SGQ';
update airport set timezone = 'America/Chicago' where city_code = 'SGT';
update airport set timezone = 'America/Juneau' where city_code = 'SGW';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'SGX';
update airport set timezone = 'Asia/Bangkok' where city_code = 'SGZ';
update airport set timezone = 'Africa/Maseru' where city_code = 'SHK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SHN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'SHQ';
update airport set timezone = 'Asia/Shanghai' where city_code = 'SHS';
update airport set timezone = 'Australia/Darwin' where city_code = 'SHU';
update airport set timezone = 'Africa/Maseru' where city_code = 'SHZ';
update airport set timezone = 'Europe/Lisbon' where city_code = 'SIE';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'SIH';
update airport set timezone = 'Africa/Casablanca' where city_code = 'SII';
update airport set timezone = 'Australia/Hobart' where city_code = 'SIO';
update airport set timezone = 'America/Indiana/Indianapolis' where city_code = 'SIV';
update airport set timezone = 'Asia/Jayapura' where city_code = 'SIW';
update airport set timezone = 'Australia/Sydney' where city_code = 'SIX';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SIY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SIZ';
update airport set timezone = 'America/Lima' where city_code = 'SJA';
update airport set timezone = 'America/La_Paz' where city_code = 'SJB';
update airport set timezone = 'America/Bogota' where city_code = 'SJH';
update airport set timezone = 'America/Santo_Domingo' where city_code = 'SJM';
update airport set timezone = 'America/Phoenix' where city_code = 'SJN';
update airport set timezone = 'Africa/Lusaka' where city_code = 'SJQ';
update airport set timezone = 'America/Bogota' where city_code = 'SJR';
update airport set timezone = 'America/La_Paz' where city_code = 'SJS';
update airport set timezone = 'America/La_Paz' where city_code = 'SJV';
update airport set timezone = 'Africa/Algiers' where city_code = 'SKI';
update airport set timezone = 'America/Anchorage' where city_code = 'SKJ';
update airport set timezone = 'Europe/London' where city_code = 'SKL';
update airport set timezone = 'Africa/Maseru' where city_code = 'SKQ';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'SKR';
update airport set timezone = 'America/Anchorage' where city_code = 'SKW';
update airport set timezone = 'America/Chicago' where city_code = 'SLB';
update airport set timezone = 'America/Chicago' where city_code = 'SLG';
update airport set timezone = 'America/Chicago' where city_code = 'SLR';
update airport set timezone = 'Europe/Sofia' where city_code = 'SLS';
update airport set timezone = 'America/Denver' where city_code = 'SLT';
update airport set timezone = 'America/Santiago' where city_code = 'SMB';
update airport set timezone = 'America/Bogota' where city_code = 'SMC';
update airport set timezone = 'America/Lima' where city_code = 'SMG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SMH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SMJ';
update airport set timezone = 'Asia/Kuching' where city_code = 'SMM';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SMP';
update airport set timezone = 'America/Anchorage' where city_code = 'SMU';
update airport set timezone = 'Africa/Dakar' where city_code = 'SMY';
update airport set timezone = 'Australia/Darwin' where city_code = 'SNB';
update airport set timezone = 'Asia/Vientiane' where city_code = 'SND';
update airport set timezone = 'America/Caracas' where city_code = 'SNF';
update airport set timezone = 'America/La_Paz' where city_code = 'SNG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'SNH';
update airport set timezone = 'Africa/Monrovia' where city_code = 'SNI';
update airport set timezone = 'America/Havana' where city_code = 'SNJ';
update airport set timezone = 'America/Chicago' where city_code = 'SNK';
update airport set timezone = 'America/Chicago' where city_code = 'SNL';
update airport set timezone = 'America/La_Paz' where city_code = 'SNM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SNS';
update airport set timezone = 'America/Bogota' where city_code = 'SNT';
update airport set timezone = 'America/Campo_Grande' where city_code = 'SNZ';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'SOA';
update airport set timezone = 'Africa/Brazzaville' where city_code = 'SOE';
update airport set timezone = 'Australia/Lindeman' where city_code = 'SOI';
update airport set timezone = 'Africa/Maseru' where city_code = 'SOK';
update airport set timezone = 'America/Nome' where city_code = 'SOL';
update airport set timezone = 'Asia/Damascus' where city_code = 'SOR';
update airport set timezone = 'America/Anchorage' where city_code = 'SOV';
update airport set timezone = 'America/Bogota' where city_code = 'SOX';
update airport set timezone = 'America/New_York' where city_code = 'SPA';
update airport set timezone = 'Asia/Kuching' where city_code = 'SPE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SPH';
update airport set timezone = 'Europe/Athens' where city_code = 'SPJ';
update airport set timezone = 'Europe/Amsterdam' where city_code = 'SPL';
update airport set timezone = 'Asia/Kuching' where city_code = 'SPT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SPV';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SQA';
update airport set timezone = 'Australia/Perth' where city_code = 'SQC';
update airport set timezone = 'America/Bogota' where city_code = 'SQE';
update airport set timezone = 'America/Chicago' where city_code = 'SQI';
update airport set timezone = 'Africa/Cairo' where city_code = 'SQK';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SQM';
update airport set timezone = 'Asia/Jayapura' where city_code = 'SQN';
update airport set timezone = 'Asia/Makassar' where city_code = 'SQR';
update airport set timezone = 'America/Belize' where city_code = 'SQS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SQT';
update airport set timezone = 'America/Lima' where city_code = 'SQU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SQV';
update airport set timezone = 'Europe/Copenhagen' where city_code = 'SQW';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SQX';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SQY';
update airport set timezone = 'Europe/London' where city_code = 'SQZ';
update airport set timezone = 'America/La_Paz' where city_code = 'SRB';
update airport set timezone = 'America/Chicago' where city_code = 'SRC';
update airport set timezone = 'America/La_Paz' where city_code = 'SRD';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SRF';
update airport set timezone = 'America/Thule' where city_code = 'SRK';
update airport set timezone = 'America/Mazatlan' where city_code = 'SRL';
update airport set timezone = 'America/Bogota' where city_code = 'SRO';
update airport set timezone = 'America/Bogota' where city_code = 'SRS';
update airport set timezone = 'America/New_York' where city_code = 'SRW';
update airport set timezone = 'America/Bogota' where city_code = 'SSD';
update airport set timezone = 'America/Chicago' where city_code = 'SSF';
update airport set timezone = 'Australia/Perth' where city_code = 'SSK';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'SSO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'SSP';
update airport set timezone = 'America/Montreal' where city_code = 'SSQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SSS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'STF';
update airport set timezone = 'Australia/Brisbane' where city_code = 'STH';
update airport set timezone = 'America/New_York' where city_code = 'STQ';
update airport set timezone = 'America/Chicago' where city_code = 'SUD';
update airport set timezone = 'Asia/Muscat' where city_code = 'SUH';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'SUK';
update airport set timezone = 'America/New_York' where city_code = 'SUM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SUO';
update airport set timezone = 'Asia/Jakarta' where city_code = 'SUP';
update airport set timezone = 'America/Guayaquil' where city_code = 'SUQ';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'SUT';
update airport set timezone = 'America/Chicago' where city_code = 'SUW';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'SUY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SUZ';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SVE';
update airport set timezone = 'Africa/Porto-Novo' where city_code = 'SVF';
update airport set timezone = 'America/Belize' where city_code = 'SVK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'SVM';
update airport set timezone = 'America/Thule' where city_code = 'SVR';
update airport set timezone = 'America/Anchorage' where city_code = 'SVS';
update airport set timezone = 'Africa/Gaborone' where city_code = 'SVT';
update airport set timezone = 'America/Caracas' where city_code = 'SVV';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'SVY';
update airport set timezone = 'Australia/Perth' where city_code = 'SWB';
update airport set timezone = 'Australia/Melbourne' where city_code = 'SWC';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SWE';
update airport set timezone = 'Australia/Melbourne' where city_code = 'SWH';
update airport set timezone = 'America/Cuiaba' where city_code = 'SWM';
update airport set timezone = 'America/Chicago' where city_code = 'SWO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'SWR';
update airport set timezone = 'Asia/Seoul' where city_code = 'SWU';
update airport set timezone = 'Asia/Magadan' where city_code = 'SWV';
update airport set timezone = 'America/Chicago' where city_code = 'SWW';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'SWY';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SXC';
update airport set timezone = 'Australia/Melbourne' where city_code = 'SXE';
update airport set timezone = 'Africa/Lusaka' where city_code = 'SXG';
update airport set timezone = 'Asia/Tehran' where city_code = 'SXI';
update airport set timezone = 'Asia/Urumqi' where city_code = 'SXJ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'SXK';
update airport set timezone = 'Africa/Gaborone' where city_code = 'SXN';
update airport set timezone = 'Asia/Kuching' where city_code = 'SXS';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'SXT';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'SXU';
update airport set timezone = 'Asia/Kolkata' where city_code = 'SXV';
update airport set timezone = 'Europe/Istanbul' where city_code = 'SXZ';
update airport set timezone = 'Asia/Aden' where city_code = 'SYE';
update airport set timezone = 'America/Chicago' where city_code = 'SYI';
update airport set timezone = 'Asia/Tehran' where city_code = 'SYJ';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'SYK';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SYL';
update airport set timezone = 'America/Chicago' where city_code = 'SYN';
update airport set timezone = 'America/Panama' where city_code = 'SYP';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'SYS';
update airport set timezone = 'Europe/Paris' where city_code = 'SYT';
update airport set timezone = 'Europe/London' where city_code = 'SZD';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'SZE';
update airport set timezone = 'Asia/Makassar' where city_code = 'SZH';
update airport set timezone = 'Asia/Almaty' where city_code = 'SZI';
update airport set timezone = 'America/Havana' where city_code = 'SZJ';
update airport set timezone = 'Africa/Windhoek' where city_code = 'SZM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SZN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'SZP';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'SZQ';
update airport set timezone = 'Europe/Sofia' where city_code = 'SZR';
update airport set timezone = 'America/Mexico_City' where city_code = 'SZT';
update airport set timezone = 'Africa/Bamako' where city_code = 'SZU';
update airport set timezone = 'Asia/Shanghai' where city_code = 'SZV';
update airport set timezone = 'Europe/Warsaw' where city_code = 'SZY';
update airport set timezone = 'America/Denver' where city_code = 'TAD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TAJ';
update airport set timezone = 'Australia/Adelaide' where city_code = 'TAQ';
update airport set timezone = 'Pacific/Pago_Pago' where city_code = 'TAV';
update airport set timezone = 'America/Montevideo' where city_code = 'TAW';
update airport set timezone = 'Asia/Jayapura' where city_code = 'TAX';
update airport set timezone = 'America/Denver' where city_code = 'TBC';
update airport set timezone = 'America/Bogota' where city_code = 'TBD';
update airport set timezone = 'America/Nassau' where city_code = 'TBI';
update airport set timezone = 'Australia/Darwin' where city_code = 'TBK';
update airport set timezone = 'Australia/Perth' where city_code = 'TBL';
update airport set timezone = 'Asia/Pontianak' where city_code = 'TBM';
update airport set timezone = 'America/New_York' where city_code = 'TBR';
update airport set timezone = 'Africa/Gaborone' where city_code = 'TBY';
update airport set timezone = 'Asia/Kolkata' where city_code = 'TCR';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'TCU';
update airport set timezone = 'Australia/Sydney' where city_code = 'TCW';
update airport set timezone = 'Asia/Tehran' where city_code = 'TCX';
update airport set timezone = 'America/Bogota' where city_code = 'TDA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TDB';
update airport set timezone = 'America/New_York' where city_code = 'TDF';
update airport set timezone = 'Australia/Perth' where city_code = 'TDN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TDO';
update airport set timezone = 'America/Lima' where city_code = 'TDP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TDS';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'TDT';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'TDV';
update airport set timezone = 'America/Chicago' where city_code = 'TDW';
update airport set timezone = 'America/New_York' where city_code = 'TDZ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'TEC';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'TEG';
update airport set timezone = 'Asia/Kolkata' where city_code = 'TEI';
update airport set timezone = 'Asia/Kuching' where city_code = 'TEL';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TEO';
update airport set timezone = 'Africa/Asmara' where city_code = 'TES';
update airport set timezone = 'Asia/Tehran' where city_code = 'TEW';
update airport set timezone = 'Atlantic/Reykjavik' where city_code = 'TEY';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TFB';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'TFL';
update airport set timezone = 'Asia/Karachi' where city_code = 'TFT';
update airport set timezone = 'Asia/Singapore' where city_code = 'TGA';
update airport set timezone = 'America/Chicago' where city_code = 'TGE';
update airport set timezone = 'America/Lima' where city_code = 'TGI';
update airport set timezone = 'Europe/Moscow' where city_code = 'TGK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TGL';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'TGP';
update airport set timezone = 'America/Cuiaba' where city_code = 'TGQ';
update airport set timezone = 'Africa/Maputo' where city_code = 'TGS';
update airport set timezone = 'Europe/Sofia' where city_code = 'TGV';
update airport set timezone = 'America/Chicago' where city_code = 'THA';
update airport set timezone = 'Africa/Maseru' where city_code = 'THB';
update airport set timezone = 'Africa/Monrovia' where city_code = 'THC';
update airport set timezone = 'Pacific/Auckland' where city_code = 'THH';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'THI';
update airport set timezone = 'Asia/Vientiane' where city_code = 'THK';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'THT';
update airport set timezone = 'America/New_York' where city_code = 'THV';
update airport set timezone = 'Asia/Krasnoyarsk' where city_code = 'THX';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'THY';
update airport set timezone = 'America/Bogota' where city_code = 'TIB';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TIG';
update airport set timezone = 'America/Edmonton' where city_code = 'TIL';
update airport set timezone = 'Asia/Rangoon' where city_code = 'TIO';
update airport set timezone = 'Asia/Jakarta' where city_code = 'TJB';
update airport set timezone = 'America/Panama' where city_code = 'TJC';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'TJI';
update airport set timezone = 'Europe/Istanbul' where city_code = 'TJK';
update airport set timezone = 'America/Campo_Grande' where city_code = 'TJL';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TJN';
update airport set timezone = 'Asia/Kolkata' where city_code = 'TJV';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TKB';
update airport set timezone = 'America/Anchorage' where city_code = 'TKJ';
update airport set timezone = 'America/Juneau' where city_code = 'TKL';
update airport set timezone = 'America/Guatemala' where city_code = 'TKM';
update airport set timezone = 'Africa/Maseru' where city_code = 'TKO';
update airport set timezone = 'Asia/Dhaka' where city_code = 'TKR';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TKV';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TKW';
update airport set timezone = 'Australia/Perth' where city_code = 'TKY';
update airport set timezone = 'Pacific/Auckland' where city_code = 'TKZ';
update airport set timezone = 'Asia/Karachi' where city_code = 'TLB';
update airport set timezone = 'Asia/Makassar' where city_code = 'TLI';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'TLK';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TLO';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TLP';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TLR';
update airport set timezone = 'America/Santiago' where city_code = 'TLX';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'TLY';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'TLZ';
update airport set timezone = 'Africa/Nouakchott' where city_code = 'TMD';
update airport set timezone = 'Indian/Maldives' where city_code = 'TMF';
update airport set timezone = 'Asia/Jayapura' where city_code = 'TMH';
update airport set timezone = 'America/Caracas' where city_code = 'TMO';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'TMQ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'TMY';
update airport set timezone = 'Pacific/Auckland' where city_code = 'TMZ';
update airport set timezone = 'Asia/Makassar' where city_code = 'TNB';
update airport set timezone = 'Asia/Harbin' where city_code = 'TNH';
update airport set timezone = 'Antarctica/Palmer' where city_code = 'TNM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TNP';
update airport set timezone = 'Pacific/Kiritimati' where city_code = 'TNQ';
update airport set timezone = 'America/Yellowknife' where city_code = 'TNS';
update airport set timezone = 'America/Chicago' where city_code = 'TNU';
update airport set timezone = 'Pacific/Kiritimati' where city_code = 'TNV';
update airport set timezone = 'America/Guayaquil' where city_code = 'TNW';
update airport set timezone = 'Asia/Hovd' where city_code = 'TNZ';
update airport set timezone = 'America/Chicago' where city_code = 'TOI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TOK';
update airport set timezone = 'Pacific/Bougainville' where city_code = 'TON';
update airport set timezone = 'America/Costa_Rica' where city_code = 'TOO';
update airport set timezone = 'America/Santiago' where city_code = 'TOQ';
update airport set timezone = 'America/Denver' where city_code = 'TOR';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'TOX';
update airport set timezone = 'Africa/Abidjan' where city_code = 'TOZ';
update airport set timezone = 'America/New_York' where city_code = 'TPF';
update airport set timezone = 'Asia/Kuala_Lumpur' where city_code = 'TPG';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TPH';
update airport set timezone = 'Asia/Jakarta' where city_code = 'TPK';
update airport set timezone = 'Australia/Perth' where city_code = 'TPR';
update airport set timezone = 'Africa/Monrovia' where city_code = 'TPT';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'TPU';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'TPX';
update airport set timezone = 'America/Godthab' where city_code = 'TQA';
update airport set timezone = 'Asia/Baghdad' where city_code = 'TQD';
update airport set timezone = 'America/Chicago' where city_code = 'TQE';
update airport set timezone = 'America/Godthab' where city_code = 'TQI';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'TQL';
update airport set timezone = 'Asia/Kabul' where city_code = 'TQN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'TQP';
update airport set timezone = 'America/Bogota' where city_code = 'TQS';
update airport set timezone = 'Asia/Tokyo' where city_code = 'TRA';
update airport set timezone = 'America/Bogota' where city_code = 'TRB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TRH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TRJ';
update airport set timezone = 'America/Chicago' where city_code = 'TRL';
update airport set timezone = 'America/Eirunepe' where city_code = 'TRQ';
update airport set timezone = 'America/Chicago' where city_code = 'TRX';
update airport set timezone = 'Africa/Kampala' where city_code = 'TRY';
update airport set timezone = 'America/Guayaquil' where city_code = 'TSC';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'TSD';
update airport set timezone = 'America/Anchorage' where city_code = 'TSG';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TSI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TSK';
update airport set timezone = 'America/Denver' where city_code = 'TSM';
update airport set timezone = 'America/Los_Angeles' where city_code = 'TSP';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'TSQ';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TSW';
update airport set timezone = 'Asia/Makassar' where city_code = 'TSX';
update airport set timezone = 'Asia/Jakarta' where city_code = 'TSY';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'TSZ';
update airport set timezone = 'America/Santiago' where city_code = 'TTC';
update airport set timezone = 'America/Bogota' where city_code = 'TTM';
update airport set timezone = 'America/Chicago' where city_code = 'TTO';
update airport set timezone = 'Australia/Perth' where city_code = 'TTX';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'TUJ';
update airport set timezone = 'Australia/Sydney' where city_code = 'TUM';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'TUQ';
update airport set timezone = 'America/Dawson_Creek' where city_code = 'TUX';
update airport set timezone = 'America/Cancun' where city_code = 'TUY';
update airport set timezone = 'America/Santarem' where city_code = 'TUZ';
update airport set timezone = 'America/Nome' where city_code = 'TWE';
update airport set timezone = 'Australia/Brisbane' where city_code = 'TWP';
update airport set timezone = 'Asia/Manila' where city_code = 'TWT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'TWY';
update airport set timezone = 'Pacific/Auckland' where city_code = 'TWZ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'TXM';
update airport set timezone = 'Australia/Brisbane' where city_code = 'TXR';
update airport set timezone = 'Africa/Abidjan' where city_code = 'TXU';
update airport set timezone = 'Australia/Sydney' where city_code = 'TYB';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'TYD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'TYG';
update airport set timezone = 'America/Nassau' where city_code = 'TYM';
update airport set timezone = 'Australia/Darwin' where city_code = 'TYP';
update airport set timezone = 'America/Montevideo' where city_code = 'TYT';
update airport set timezone = 'America/Phoenix' where city_code = 'TYZ';
update airport set timezone = 'America/Detroit' where city_code = 'TZC';
update airport set timezone = 'Europe/Sarajevo' where city_code = 'TZL';
update airport set timezone = 'America/Merida' where city_code = 'TZM';
update airport set timezone = 'America/Nassau' where city_code = 'TZN';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'TZO';
update airport set timezone = 'America/Hermosillo' where city_code = 'UAC';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'UAE';
update airport set timezone = 'Asia/Dili' where city_code = 'UAI';
update airport set timezone = 'Africa/Luanda' where city_code = 'UAL';
update airport set timezone = 'America/Los_Angeles' where city_code = 'UAO';
update airport set timezone = 'Africa/Casablanca' where city_code = 'UAR';
update airport set timezone = 'America/Guatemala' where city_code = 'UAX';
update airport set timezone = 'Asia/Jayapura' where city_code = 'UBR';
update airport set timezone = 'America/Chicago' where city_code = 'UBS';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'UBT';
update airport set timezone = 'Australia/Perth' where city_code = 'UBU';
update airport set timezone = 'America/Anchorage' where city_code = 'UBW';
update airport set timezone = 'America/Los_Angeles' where city_code = 'UCC';
update airport set timezone = 'Europe/Uzhgorod' where city_code = 'UCK';
update airport set timezone = 'Africa/Monrovia' where city_code = 'UCN';
update airport set timezone = 'America/Chicago' where city_code = 'UCY';
update airport set timezone = 'America/Lima' where city_code = 'UCZ';
update airport set timezone = 'Australia/Brisbane' where city_code = 'UDA';
update airport set timezone = 'Europe/Rome' where city_code = 'UDN';
update airport set timezone = 'Australia/Hobart' where city_code = 'UEE';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'UEN';
update airport set timezone = 'America/Anchorage' where city_code = 'UGB';
update airport set timezone = 'America/Anchorage' where city_code = 'UGS';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'UGT';
update airport set timezone = 'Asia/Jayapura' where city_code = 'UGU';
update airport set timezone = 'Europe/Prague' where city_code = 'UHE';
update airport set timezone = 'America/Los_Angeles' where city_code = 'UIL';
update airport set timezone = 'Pacific/Efate' where city_code = 'UIQ';
update airport set timezone = 'Australia/Sydney' where city_code = 'UIR';
update airport set timezone = 'America/Detroit' where city_code = 'UIZ';
update airport set timezone = 'Asia/Vladivostok' where city_code = 'UKG';
update airport set timezone = 'Asia/Muscat' where city_code = 'UKH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'UKI';
update airport set timezone = 'America/Chicago' where city_code = 'UKL';
update airport set timezone = 'Asia/Aden' where city_code = 'UKR';
update airport set timezone = 'America/New_York' where city_code = 'UKT';
update airport set timezone = 'America/Santiago' where city_code = 'ULC';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'ULE';
update airport set timezone = 'Europe/London' where city_code = 'ULL';
update airport set timezone = 'America/Chicago' where city_code = 'ULM';
update airport set timezone = 'America/Bogota' where city_code = 'ULS';
update airport set timezone = 'Asia/Hovd' where city_code = 'ULZ';
update airport set timezone = 'America/Havana' where city_code = 'UMA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'UMC';
update airport set timezone = 'America/Lima' where city_code = 'UMI';
update airport set timezone = 'America/Anchorage' where city_code = 'UMM';
update airport set timezone = 'America/Anchorage' where city_code = 'UMT';
update airport set timezone = 'Europe/Kiev' where city_code = 'UMY';
update airport set timezone = 'America/Bogota' where city_code = 'UNC';
update airport set timezone = 'Africa/Maseru' where city_code = 'UNE';
update airport set timezone = 'Asia/Ulaanbaatar' where city_code = 'UNR';
update airport set timezone = 'America/Adak' where city_code = 'UNS';
update airport set timezone = 'America/Chicago' where city_code = 'UNU';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'UOA';
update airport set timezone = 'Asia/Makassar' where city_code = 'UOL';
update airport set timezone = 'America/Chicago' where city_code = 'UOS';
update airport set timezone = 'America/Chicago' where city_code = 'UOX';
update airport set timezone = 'America/Havana' where city_code = 'UPB';
update airport set timezone = 'Europe/Berlin' where city_code = 'UPF';
update airport set timezone = 'America/Costa_Rica' where city_code = 'UPL';
update airport set timezone = 'Europe/London' where city_code = 'UPV';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'URB';
update airport set timezone = 'Europe/Berlin' where city_code = 'URD';
update airport set timezone = 'America/Bogota' where city_code = 'URI';
update airport set timezone = 'America/Caracas' where city_code = 'URM';
update airport set timezone = 'America/Bogota' where city_code = 'URR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'URU';
update airport set timezone = 'Asia/Kabul' where city_code = 'URZ';
update airport set timezone = 'America/New_York' where city_code = 'USA';
update airport set timezone = 'Australia/Perth' where city_code = 'USL';
update airport set timezone = 'Asia/Magadan' where city_code = 'USR';
update airport set timezone = 'America/Havana' where city_code = 'USS';
update airport set timezone = 'Africa/Harare' where city_code = 'UTA';
update airport set timezone = 'Australia/Brisbane' where city_code = 'UTB';
update airport set timezone = 'Australia/Darwin' where city_code = 'UTD';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'UTE';
update airport set timezone = 'Africa/Maseru' where city_code = 'UTG';
update airport set timezone = 'Europe/Helsinki' where city_code = 'UTI';
update airport set timezone = 'Asia/Bangkok' where city_code = 'UTR';
update airport set timezone = 'Europe/Moscow' where city_code = 'UTS';
update airport set timezone = 'Asia/Choibalsan' where city_code = 'UUN';
update airport set timezone = 'Africa/Cairo' where city_code = 'UVL';
update airport set timezone = 'Europe/Belgrade' where city_code = 'UZC';
update airport set timezone = 'Asia/Riyadh' where city_code = 'UZH';
update airport set timezone = 'America/Cambridge_Bay' where city_code = 'UZM';
update airport set timezone = 'Asia/Almaty' where city_code = 'UZR';
update airport set timezone = 'America/Argentina/Cordoba' where city_code = 'UZU';
update airport set timezone = 'America/Bogota' where city_code = 'VAB';
update airport set timezone = 'Europe/Berlin' where city_code = 'VAC';
update airport set timezone = 'America/La_Paz' where city_code = 'VAH';
update airport set timezone = 'America/Santiago' where city_code = 'VAP';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'VAT';
update airport set timezone = 'Pacific/Fiji' where city_code = 'VAU';
update airport set timezone = 'Europe/Paris' where city_code = 'VAZ';
update airport set timezone = 'America/Anchorage' where city_code = 'VBM';
update airport set timezone = 'America/Chicago' where city_code = 'VBT';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VCB';
update airport set timezone = 'Africa/Douala' where city_code = 'VCC';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'VCF';
update airport set timezone = 'America/Montevideo' where city_code = 'VCH';
update airport set timezone = 'America/Caracas' where city_code = 'VCR';
update airport set timezone = 'America/New_York' where city_code = 'VDI';
update airport set timezone = 'America/Chicago' where city_code = 'VDU';
update airport set timezone = 'Asia/Kolkata' where city_code = 'VDY';
update airport set timezone = 'America/Guyana' where city_code = 'VEG';
update airport set timezone = 'America/New_York' where city_code = 'VES';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'VEV';
update airport set timezone = 'America/Chicago' where city_code = 'VEX';
update airport set timezone = 'Asia/Manila' where city_code = 'VGN';
update airport set timezone = 'America/Argentina/Buenos_Aires' where city_code = 'VGS';
update airport set timezone = 'America/Chicago' where city_code = 'VHN';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'VHV';
update airport set timezone = 'Pacific/Tahiti' where city_code = 'VHZ';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'VIA';
update airport set timezone = 'America/Mazatlan' where city_code = 'VIB';
update airport set timezone = 'Europe/Sofia' where city_code = 'VID';
update airport set timezone = 'Asia/Dili' where city_code = 'VIQ';
update airport set timezone = 'Pacific/Guadalcanal' where city_code = 'VIU';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'VIV';
update airport set timezone = 'Europe/Paris' where city_code = 'VIY';
update airport set timezone = 'America/New_York' where city_code = 'VJI';
update airport set timezone = 'Africa/Maputo' where city_code = 'VJQ';
update airport set timezone = 'Europe/Rome' where city_code = 'VKB';
update airport set timezone = 'America/Chicago' where city_code = 'VKS';
update airport set timezone = 'America/Anchorage' where city_code = 'VKW';
update airport set timezone = 'Europe/London' where city_code = 'VLF';
update airport set timezone = 'Europe/Moscow' where city_code = 'VLK';
update airport set timezone = 'America/La_Paz' where city_code = 'VLM';
update airport set timezone = 'America/Cuiaba' where city_code = 'VLP';
update airport set timezone = 'America/Santiago' where city_code = 'VLR';
update airport set timezone = 'Europe/London' where city_code = 'VLY';
update airport set timezone = 'America/Argentina/San_Luis' where city_code = 'VME';
update airport set timezone = 'America/Asuncion' where city_code = 'VMI';
update airport set timezone = 'America/New_York' where city_code = 'VNC';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'VND';
update airport set timezone = 'Australia/Brisbane' where city_code = 'VNR';
update airport set timezone = 'Europe/Riga' where city_code = 'VNT';
update airport set timezone = 'Europe/Prague' where city_code = 'VOD';
update airport set timezone = 'Africa/Monrovia' where city_code = 'VOI';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'VOT';
update airport set timezone = 'America/Chicago' where city_code = 'VPZ';
update airport set timezone = 'America/New_York' where city_code = 'VQQ';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'VRE';
update airport set timezone = 'Europe/Moscow' where city_code = 'VRI';
update airport set timezone = 'America/Havana' where city_code = 'VRO';
update airport set timezone = 'America/Chicago' where city_code = 'VRS';
update airport set timezone = 'Europe/Lisbon' where city_code = 'VSE';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VSK';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'VSO';
update airport set timezone = 'Pacific/Fiji' where city_code = 'VTF';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'VTG';
update airport set timezone = 'Europe/Paris' where city_code = 'VTL';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'VTM';
update airport set timezone = 'America/Chicago' where city_code = 'VTN';
update airport set timezone = 'America/Los_Angeles' where city_code = 'VUO';
update airport set timezone = 'Africa/Blantyre' where city_code = 'VUU';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'VVB';
update airport set timezone = 'Europe/Stockholm' where city_code = 'VVK';
update airport set timezone = 'America/Lima' where city_code = 'VVN';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'VYD';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'VYI';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'WAC';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WAD';
update airport set timezone = 'Asia/Riyadh' where city_code = 'WAE';
update airport set timezone = 'Asia/Karachi' where city_code = 'WAF';
update airport set timezone = 'America/Chicago' where city_code = 'WAH';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WAJ';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WAK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WAN';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WAO';
update airport set timezone = 'America/Santiago' where city_code = 'WAP';
update airport set timezone = 'Australia/Darwin' where city_code = 'WAV';
update airport set timezone = 'Africa/Tripoli' where city_code = 'WAX';
update airport set timezone = 'America/New_York' where city_code = 'WAY';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WAZ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'WBA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WBC';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WBD';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WBE';
update airport set timezone = 'Europe/Berlin' where city_code = 'WBG';
update airport set timezone = 'America/Detroit' where city_code = 'WBK';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WBO';
update airport set timezone = 'America/Detroit' where city_code = 'WBR';
update airport set timezone = 'America/Santiago' where city_code = 'WCA';
update airport set timezone = 'America/Anchorage' where city_code = 'WCR';
update airport set timezone = 'Asia/Aden' where city_code = 'WDA';
update airport set timezone = 'America/Chicago' where city_code = 'WDG';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WDI';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WDN';
update airport set timezone = 'America/Chicago' where city_code = 'WEA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WED';
update airport set timezone = 'Africa/Monrovia' where city_code = 'WES';
update airport set timezone = 'Asia/Jayapura' where city_code = 'WET';
update airport set timezone = 'Australia/Sydney' where city_code = 'WEW';
update airport set timezone = 'Europe/London' where city_code = 'WFD';
update airport set timezone = 'Asia/Kolkata' where city_code = 'WGC';
update airport set timezone = 'America/New_York' where city_code = 'WGO';
update airport set timezone = 'Australia/Melbourne' where city_code = 'WGT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WGU';
update airport set timezone = 'Africa/Libreville' where city_code = 'WGY';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WHO';
update airport set timezone = 'Europe/London' where city_code = 'WHS';
update airport set timezone = 'America/Chicago' where city_code = 'WHT';
update airport set timezone = 'Asia/Shanghai' where city_code = 'WHU';
update airport set timezone = 'America/Chicago' where city_code = 'WIB';
update airport set timezone = 'Europe/Berlin' where city_code = 'WIE';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WIK';
update airport set timezone = 'Pacific/Auckland' where city_code = 'WIR';
update airport set timezone = 'Australia/Perth' where city_code = 'WIT';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WIU';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WJF';
update airport set timezone = 'Australia/Melbourne' where city_code = 'WKB';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'WKF';
update airport set timezone = 'Africa/Harare' where city_code = 'WKI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WKN';
update airport set timezone = 'America/Nassau' where city_code = 'WKR';
update airport set timezone = 'Australia/Perth' where city_code = 'WLA';
update airport set timezone = 'Australia/Sydney' where city_code = 'WLC';
update airport set timezone = 'America/Chicago' where city_code = 'WLD';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WLE';
update airport set timezone = 'Australia/Darwin' where city_code = 'WLL';
update airport set timezone = 'Australia/Darwin' where city_code = 'WLO';
update airport set timezone = 'Australia/Perth' where city_code = 'WLP';
update airport set timezone = 'America/Sitka' where city_code = 'WLR';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WLW';
update airport set timezone = 'Australia/Melbourne' where city_code = 'WMB';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WMC';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WMD';
update airport set timezone = 'America/Chicago' where city_code = 'WMH';
update airport set timezone = 'America/Juneau' where city_code = 'WMK';
update airport set timezone = 'Indian/Antananarivo' where city_code = 'WML';
update airport set timezone = 'America/Anchorage' where city_code = 'WNA';
update airport set timezone = 'Australia/Perth' where city_code = 'WND';
update airport set timezone = 'Africa/Libreville' where city_code = 'WNE';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WOA';
update airport set timezone = 'America/Anchorage' where city_code = 'WOD';
update airport set timezone = 'Australia/Darwin' where city_code = 'WOG';
update airport set timezone = 'America/Caracas' where city_code = 'WOK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WON';
update airport set timezone = 'America/Anchorage' where city_code = 'WOO';
update airport set timezone = 'Asia/Pyongyang' where city_code = 'WOS';
update airport set timezone = 'America/Anchorage' where city_code = 'WOW';
update airport set timezone = 'America/Santiago' where city_code = 'WPA';
update airport set timezone = 'America/Edmonton' where city_code = 'WPC';
update airport set timezone = 'Australia/Brisbane' where city_code = 'WPK';
update airport set timezone = 'America/Vancouver' where city_code = 'WPL';
update airport set timezone = 'America/Nome' where city_code = 'WRH';
update airport set timezone = 'Australia/Perth' where city_code = 'WRN';
update airport set timezone = 'Europe/London' where city_code = 'WRT';
update airport set timezone = 'Australia/Perth' where city_code = 'WRW';
update airport set timezone = 'America/Metlakatla' where city_code = 'WSB';
update airport set timezone = 'America/Anchorage' where city_code = 'WSF';
update airport set timezone = 'America/New_York' where city_code = 'WSG';
update airport set timezone = 'America/New_York' where city_code = 'WSH';
update airport set timezone = 'America/Anchorage' where city_code = 'WSM';
update airport set timezone = 'America/Paramaribo' where city_code = 'WSO';
update airport set timezone = 'Asia/Jayapura' where city_code = 'WSR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WSU';
update airport set timezone = 'America/Nassau' where city_code = 'WTD';
update airport set timezone = 'America/Phoenix' where city_code = 'WTR';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WTT';
update airport set timezone = 'Australia/Adelaide' where city_code = 'WUD';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WUG';
update airport set timezone = 'Australia/Perth' where city_code = 'WUI';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'WUV';
update airport set timezone = 'America/Los_Angeles' where city_code = 'WVI';
update airport set timezone = 'America/New_York' where city_code = 'WVL';
update airport set timezone = 'Australia/Perth' where city_code = 'WWI';
update airport set timezone = 'America/Chicago' where city_code = 'WWR';
update airport set timezone = 'Australia/Sydney' where city_code = 'WWY';
update airport set timezone = 'Europe/London' where city_code = 'WXF';
update airport set timezone = 'America/Sitka' where city_code = 'WYB';
update airport set timezone = 'Australia/Perth' where city_code = 'WYN';
update airport set timezone = 'Europe/Paris' where city_code = 'XAB';
update airport set timezone = 'America/Hermosillo' where city_code = 'XAL';
update airport set timezone = 'Europe/Paris' where city_code = 'XAN';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XAR';
update airport set timezone = 'Europe/Paris' where city_code = 'XAS';
update airport set timezone = 'Europe/Paris' where city_code = 'XAV';
update airport set timezone = 'Africa/Addis_Ababa' where city_code = 'XBL';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XBO';
update airport set timezone = 'Europe/Paris' where city_code = 'XBQ';
update airport set timezone = 'America/Toronto' where city_code = 'XBR';
update airport set timezone = 'Europe/Paris' where city_code = 'XBV';
update airport set timezone = 'Europe/Paris' where city_code = 'XCB';
update airport set timezone = 'America/Regina' where city_code = 'XCL';
update airport set timezone = 'Australia/Melbourne' where city_code = 'XCO';
update airport set timezone = 'Europe/Paris' where city_code = 'XCX';
update airport set timezone = 'Europe/Paris' where city_code = 'XCY';
update airport set timezone = 'Europe/Paris' where city_code = 'XCZ';
update airport set timezone = 'Europe/Paris' where city_code = 'XDA';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XDE';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XDJ';
update airport set timezone = 'Asia/Shanghai' where city_code = 'XEN';
update airport set timezone = 'America/Godthab' where city_code = 'XEQ';
update airport set timezone = 'America/Chicago' where city_code = 'XES';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XGA';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XGG';
update airport set timezone = 'Asia/Vientiane' where city_code = 'XIE';
update airport set timezone = 'America/Belem' where city_code = 'XIG';
update airport set timezone = 'Asia/Kuwait' where city_code = 'XIJ';
update airport set timezone = 'Asia/Shanghai' where city_code = 'XIN';
update airport set timezone = 'Asia/Qatar' where city_code = 'XJD';
update airport set timezone = 'Asia/Karachi' where city_code = 'XJM';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XKA';
update airport set timezone = 'America/Vancouver' where city_code = 'XKO';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XKY';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XLU';
update airport set timezone = 'Europe/Berlin' where city_code = 'XLW';
update airport set timezone = 'Asia/Manila' where city_code = 'XMA';
update airport set timezone = 'America/Chicago' where city_code = 'XMD';
update airport set timezone = 'Europe/Paris' where city_code = 'XME';
update airport set timezone = 'Europe/Paris' where city_code = 'XMF';
update airport set timezone = 'Asia/Kathmandu' where city_code = 'XMG';
update airport set timezone = 'Africa/Dar_es_Salaam' where city_code = 'XMI';
update airport set timezone = 'Europe/Paris' where city_code = 'XMJ';
update airport set timezone = 'Europe/Paris' where city_code = 'XMK';
update airport set timezone = 'Australia/Adelaide' where city_code = 'XML';
update airport set timezone = 'America/Whitehorse' where city_code = 'XMP';
update airport set timezone = 'Europe/Paris' where city_code = 'XMW';
update airport set timezone = 'America/Argentina/Jujuy' where city_code = 'XMX';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'XNG';
update airport set timezone = 'Asia/Shanghai' where city_code = 'XNT';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XNU';
update airport set timezone = 'Europe/Paris' where city_code = 'XOG';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XPA';
update airport set timezone = 'America/Argentina/Catamarca' where city_code = 'XPD';
update airport set timezone = 'America/Winnipeg' where city_code = 'XPK';
update airport set timezone = 'America/Tegucigalpa' where city_code = 'XPL';
update airport set timezone = 'America/Winnipeg' where city_code = 'XPP';
update airport set timezone = 'America/Denver' where city_code = 'XPR';
update airport set timezone = 'America/Anchorage' where city_code = 'XPU';
update airport set timezone = 'Australia/Sydney' where city_code = 'XRH';
update airport set timezone = 'America/Los_Angeles' where city_code = 'XSD';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XSE';
update airport set timezone = 'Europe/Paris' where city_code = 'XSJ';
update airport set timezone = 'America/New_York' where city_code = 'XSM';
update airport set timezone = 'Europe/Paris' where city_code = 'XSN';
update airport set timezone = 'Australia/Brisbane' where city_code = 'XTO';
update airport set timezone = 'Australia/Brisbane' where city_code = 'XTR';
update airport set timezone = 'Asia/Ho_Chi_Minh' where city_code = 'XVL';
update airport set timezone = 'Europe/Paris' where city_code = 'XVN';
update airport set timezone = 'Europe/Paris' where city_code = 'XVO';
update airport set timezone = 'Europe/Paris' where city_code = 'XVS';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'XYR';
update airport set timezone = 'Africa/Ouagadougou' where city_code = 'XZA';
update airport set timezone = 'America/Montreal' where city_code = 'YAH';
update airport set timezone = 'America/Santiago' where city_code = 'YAI';
update airport set timezone = 'America/Vancouver' where city_code = 'YAL';
update airport set timezone = 'Africa/Lubumbashi' where city_code = 'YAN';
update airport set timezone = 'America/Montreal' where city_code = 'YAR';
update airport set timezone = 'Pacific/Fiji' where city_code = 'YAS';
update airport set timezone = 'America/Montreal' where city_code = 'YAU';
update airport set timezone = 'America/Edmonton' where city_code = 'YBA';
update airport set timezone = 'America/Vancouver' where city_code = 'YBM';
update airport set timezone = 'America/Toronto' where city_code = 'YBN';
update airport set timezone = 'America/Winnipeg' where city_code = 'YBS';
update airport set timezone = 'America/Vancouver' where city_code = 'YCA';
update airport set timezone = 'America/Toronto' where city_code = 'YCE';
update airport set timezone = 'America/Vancouver' where city_code = 'YCF';
update airport set timezone = 'America/Dawson_Creek' where city_code = 'YCQ';
update airport set timezone = 'America/Montreal' where city_code = 'YCV';
update airport set timezone = 'America/Moncton' where city_code = 'YCX';
update airport set timezone = 'America/Edmonton' where city_code = 'YCZ';
update airport set timezone = 'America/St_Johns' where city_code = 'YDE';
update airport set timezone = 'America/Halifax' where city_code = 'YDG';
update airport set timezone = 'America/Goose_Bay' where city_code = 'YDI';
update airport set timezone = 'America/Regina' where city_code = 'YDJ';
update airport set timezone = 'America/Whitehorse' where city_code = 'YDM';
update airport set timezone = 'America/Montreal' where city_code = 'YDO';
update airport set timezone = 'America/Vancouver' where city_code = 'YDS';
update airport set timezone = 'America/Yellowknife' where city_code = 'YDU';
update airport set timezone = 'America/Winnipeg' where city_code = 'YDV';
update airport set timezone = 'America/Yellowknife' where city_code = 'YDW';
update airport set timezone = 'America/Toronto' where city_code = 'YEB';
update airport set timezone = 'America/Edmonton' where city_code = 'YED';
update airport set timezone = 'Asia/Tehran' where city_code = 'YEH';
update airport set timezone = 'America/Toronto' where city_code = 'YEL';
update airport set timezone = 'America/Vancouver' where city_code = 'YEP';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'YEQ';
update airport set timezone = 'America/Montreal' where city_code = 'YEY';
update airport set timezone = 'America/Montreal' where city_code = 'YFE';
update airport set timezone = 'America/Montreal' where city_code = 'YFG';
update airport set timezone = 'America/Edmonton' where city_code = 'YFI';
update airport set timezone = 'America/Yellowknife' where city_code = 'YFJ';
update airport set timezone = 'America/Montreal' where city_code = 'YGA';
update airport set timezone = 'America/Vancouver' where city_code = 'YGC';
update airport set timezone = 'America/Toronto' where city_code = 'YGD';
update airport set timezone = 'America/Vancouver' where city_code = 'YGS';
update airport set timezone = 'America/Montreal' where city_code = 'YGY';
update airport set timezone = 'America/Vancouver' where city_code = 'YHE';
update airport set timezone = 'America/St_Johns' where city_code = 'YHG';
update airport set timezone = 'America/Whitehorse' where city_code = 'YHT';
update airport set timezone = 'Asia/Shanghai' where city_code = 'YIE';
update airport set timezone = 'America/Edmonton' where city_code = 'YJA';
update airport set timezone = 'America/Yellowknife' where city_code = 'YJF';
update airport set timezone = 'America/Vancouver' where city_code = 'YJO';
update airport set timezone = 'America/Edmonton' where city_code = 'YJP';
update airport set timezone = 'America/Regina' where city_code = 'YKC';
update airport set timezone = 'America/Toronto' where city_code = 'YKD';
update airport set timezone = 'America/Winnipeg' where city_code = 'YKE';
update airport set timezone = 'America/Regina' where city_code = 'YKJ';
update airport set timezone = 'Europe/Istanbul' where city_code = 'YKO';
update airport set timezone = 'America/Edmonton' where city_code = 'YLB';
update airport set timezone = 'America/Montreal' where city_code = 'YLF';
update airport set timezone = 'Australia/Perth' where city_code = 'YLG';
update airport set timezone = 'Europe/Helsinki' where city_code = 'YLI';
update airport set timezone = 'Asia/Harbin' where city_code = 'YLN';
update airport set timezone = 'America/Winnipeg' where city_code = 'YLO';
update airport set timezone = 'America/Montreal' where city_code = 'YLQ';
update airport set timezone = 'America/Winnipeg' where city_code = 'YLR';
update airport set timezone = 'Asia/Baku' where city_code = 'YLV';
update airport set timezone = 'America/Vancouver' where city_code = 'YLY';
update airport set timezone = 'America/Vancouver' where city_code = 'YMB';
update airport set timezone = 'America/Yellowknife' where city_code = 'YMD';
update airport set timezone = 'America/Montreal' where city_code = 'YME';
update airport set timezone = 'America/Winnipeg' where city_code = 'YMI';
update airport set timezone = 'Asia/Yekaterinburg' where city_code = 'YMK';
update airport set timezone = 'America/Montreal' where city_code = 'YML';
update airport set timezone = 'America/Iqaluit' where city_code = 'YMV';
update airport set timezone = 'America/Dawson_Creek' where city_code = 'YNH';
update airport set timezone = 'America/Montreal' where city_code = 'YNI';
update airport set timezone = 'Australia/Perth' where city_code = 'YNN';
update airport set timezone = 'America/Goose_Bay' where city_code = 'YNP';
update airport set timezone = 'America/Winnipeg' where city_code = 'YNR';
update airport set timezone = 'America/Yellowknife' where city_code = 'YNX';
update airport set timezone = 'America/Edmonton' where city_code = 'YOE';
update airport set timezone = 'America/Montreal' where city_code = 'YOI';
update airport set timezone = 'Asia/Thimphu' where city_code = 'YON';
update airport set timezone = 'America/Toronto' where city_code = 'YOS';
update airport set timezone = 'Asia/Jerusalem' where city_code = 'YOT';
update airport set timezone = 'America/Montreal' where city_code = 'YOY';
update airport set timezone = 'America/Vancouver' where city_code = 'YPB';
update airport set timezone = 'America/Halifax' where city_code = 'YPS';
update airport set timezone = 'America/Vancouver' where city_code = 'YPZ';
update airport set timezone = 'America/Edmonton' where city_code = 'YQE';
update airport set timezone = 'America/Toronto' where city_code = 'YQS';
update airport set timezone = 'America/Vancouver' where city_code = 'YRD';
update airport set timezone = 'America/Toronto' where city_code = 'YRO';
update airport set timezone = 'America/Halifax' where city_code = 'YSA';
update airport set timezone = 'America/Vancouver' where city_code = 'YSE';
update airport set timezone = 'America/Toronto' where city_code = 'YSH';
update airport set timezone = 'America/Moncton' where city_code = 'YSL';
update airport set timezone = 'America/Vancouver' where city_code = 'YSN';
update airport set timezone = 'America/Nipigon' where city_code = 'YSS';
update airport set timezone = 'America/Goose_Bay' where city_code = 'YSV';
update airport set timezone = 'America/Vancouver' where city_code = 'YTC';
update airport set timezone = 'America/Winnipeg' where city_code = 'YTD';
update airport set timezone = 'America/Whitehorse' where city_code = 'YTI';
update airport set timezone = 'America/Toronto' where city_code = 'YTJ';
update airport set timezone = 'America/Montreal' where city_code = 'YTN';
update airport set timezone = 'America/Regina' where city_code = 'YTT';
update airport set timezone = 'America/Vancouver' where city_code = 'YTX';
update airport set timezone = 'Asia/Chongqing' where city_code = 'YUA';
update airport set timezone = 'Pacific/Port_Moresby' where city_code = 'YVD';
update airport set timezone = 'America/Vancouver' where city_code = 'YVE';
update airport set timezone = 'America/Pangnirtung' where city_code = 'YVN';
update airport set timezone = 'America/Halifax' where city_code = 'YWF';
update airport set timezone = 'America/Toronto' where city_code = 'YWN';
update airport set timezone = 'America/Cambridge_Bay' where city_code = 'YWO';
update airport set timezone = 'America/Montreal' where city_code = 'YWQ';
update airport set timezone = 'America/Edmonton' where city_code = 'YWV';
update airport set timezone = 'America/Toronto' where city_code = 'YXI';
update airport set timezone = 'America/Whitehorse' where city_code = 'YXQ';
update airport set timezone = 'America/Edmonton' where city_code = 'YYM';
update airport set timezone = 'America/Vancouver' where city_code = 'YZA';
update airport set timezone = 'America/Dawson_Creek' where city_code = 'YZC';
update airport set timezone = 'America/Vancouver' where city_code = 'YZL';
update airport set timezone = 'America/St_Johns' where city_code = 'YZM';
update airport set timezone = 'America/Argentina/Salta' where city_code = 'ZAI';
update airport set timezone = 'Europe/Paris' where city_code = 'ZAO';
update airport set timezone = 'Europe/Prague' where city_code = 'ZBE';
update airport set timezone = 'Europe/Podgorica' where city_code = 'ZBK';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ZBO';
update airport set timezone = 'America/Sao_Paulo' where city_code = 'ZBW';
update airport set timezone = 'Asia/Vientiane' where city_code = 'ZBY';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZCD';
update airport set timezone = 'America/Santiago' where city_code = 'ZCQ';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZCS';
update airport set timezone = 'Africa/Johannesburg' where city_code = 'ZEC';
update airport set timezone = 'Asia/Jayapura' where city_code = 'ZEG';
update airport set timezone = 'Asia/Kolkata' where city_code = 'ZER';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZFL';
update airport set timezone = 'America/Edmonton' where city_code = 'ZFW';
update airport set timezone = 'America/Vancouver' where city_code = 'ZGF';
update airport set timezone = 'Australia/Brisbane' where city_code = 'ZGL';
update airport set timezone = 'Africa/Lusaka' where city_code = 'ZGM';
update airport set timezone = 'America/Blanc-Sablon' where city_code = 'ZGS';
update airport set timezone = 'Europe/Zurich' where city_code = 'ZHI';
update airport set timezone = 'Asia/Dhaka' where city_code = 'ZHM';
update airport set timezone = 'America/Vancouver' where city_code = 'ZHO';
update airport set timezone = 'America/Edmonton' where city_code = 'ZHP';
update airport set timezone = 'Europe/Zurich' where city_code = 'ZHV';
update airport set timezone = 'Europe/Rome' where city_code = 'ZIA';
update airport set timezone = 'America/Santiago' where city_code = 'ZIC';
update airport set timezone = 'Asia/Yakutsk' where city_code = 'ZIX';
update airport set timezone = 'Asia/Karachi' where city_code = 'ZIZ';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZJG';
update airport set timezone = 'Africa/Libreville' where city_code = 'ZKM';
update airport set timezone = 'America/Santiago' where city_code = 'ZLR';
update airport set timezone = 'Africa/Khartoum' where city_code = 'ZLX';
update airport set timezone = 'America/Rio_Branco' where city_code = 'ZMD';
update airport set timezone = 'America/Vancouver' where city_code = 'ZMH';
update airport set timezone = 'America/Anchorage' where city_code = 'ZNC';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZNG';
update airport set timezone = 'America/Regina' where city_code = 'ZPO';
update airport set timezone = 'Europe/Berlin' where city_code = 'ZQV';
update airport set timezone = 'Asia/Shanghai' where city_code = 'ZQZ';
update airport set timezone = 'Asia/Jayapura' where city_code = 'ZRM';
update airport set timezone = 'Africa/Abidjan' where city_code = 'ZSS';
update airport set timezone = 'America/Vancouver' where city_code = 'ZST';
update airport set timezone = 'America/Winnipeg' where city_code = 'ZUC';
update airport set timezone = 'America/Santiago' where city_code = 'ZUD';
update airport set timezone = 'Asia/Riyadh' where city_code = 'ZUL';
update airport set timezone = 'Australia/Perth' where city_code = 'ZVG';
update airport set timezone = 'Europe/Warsaw' where city_code = 'ZWK';
update airport set timezone = 'Asia/Baku' where city_code = 'ZXT';
update airport set timezone = 'Asia/Chongqing' where city_code = 'ZYI';
update airport set timezone = 'Australia/Melbourne' where city_code = 'ZZF';
update airport set timezone = 'Asia/Sakhalin' where city_code = 'ZZO';
update airport set timezone = 'America/New_York' where city_code = 'ZZV';

-- 2015-August-17
update airport set timezone=null where timezone ='\N';

-- 2015-August-18
DROP VIEW v_sales_by_year;
CREATE OR REPLACE VIEW v_sales_by_year AS 
 SELECT user_info.id AS user_info_id, date_part('year'::text, ac.created)::smallint AS year_, sum(ab.fuel_surcharge + ab.udf_charge + ab.jn_tax + ab.other_tax + ab.basic_fare + ab.booking_fee - ab.commission_or_discount_gross)::bigint AS total_fare
   FROM air_cart ac
   JOIN air_booking ab ON ac.id = ab.air_cart_id
   JOIN users ON users.id = ac.user_id
   JOIN user_info ON users.user_info_id = user_info.id
  WHERE ac.booking_status_id=8
  GROUP BY user_info.id, date_part('year'::text, ac.created)::smallint
  ORDER BY user_info.id, date_part('year'::text, ac.created)::smallint;

DROP VIEW v_sales_by_month;
CREATE OR REPLACE VIEW v_sales_by_month AS 
 SELECT user_info.id AS user_info_id, date_part('isoyear'::text, ac.created)::smallint AS year_, date_part('month'::text, ac.created)::smallint AS month_, count(ab.id) AS segments, sum(ab.basic_fare)::bigint AS basic_fare, sum(ab.fuel_surcharge + ab.udf_charge + ab.jn_tax + ab.other_tax + ab.basic_fare + ab.booking_fee - ab.commission_or_discount_gross)::bigint AS total_fare
   FROM air_cart ac
   JOIN air_booking ab ON ac.id = ab.air_cart_id
   JOIN users ON users.id = ac.user_id
   JOIN user_info ON users.user_info_id = user_info.id
  WHERE ac.booking_status_id=8
  GROUP BY user_info.id, date_part('isoyear'::text, ac.created)::smallint, date_part('month'::text, ac.created)::smallint
  ORDER BY user_info.id, date_part('isoyear'::text, ac.created)::smallint, date_part('month'::text, ac.created)::smallint;

DROP VIEW v_sales_by_week;
CREATE OR REPLACE VIEW v_sales_by_week AS 
 SELECT user_info.id AS user_info_id, date_part('isoyear'::text, ac.created)::smallint AS year_, date_part('week'::text, ac.created)::smallint AS week_, count(ab.id) AS segments, sum(ab.basic_fare)::bigint AS basic_fare, sum(ab.fuel_surcharge + ab.udf_charge + ab.jn_tax + ab.other_tax + ab.basic_fare + ab.booking_fee - ab.commission_or_discount_gross)::bigint AS total_fare
   FROM air_cart ac
   JOIN air_booking ab ON ac.id = ab.air_cart_id
   JOIN users ON users.id = ac.user_id
   JOIN user_info ON users.user_info_id = user_info.id
  WHERE ac.booking_status_id=8
  GROUP BY user_info.id, date_part('isoyear'::text, ac.created)::smallint, date_part('week'::text, ac.created)::smallint
  ORDER BY user_info.id, date_part('isoyear'::text, ac.created)::smallint, date_part('week'::text, ac.created)::smallint;

DROP VIEW v_generated_week_periods_by_userinfoid;
CREATE OR REPLACE VIEW v_generated_week_periods_by_userinfoid AS 
 SELECT user_info.id AS user_info_id, generate_series(min(ac.created) - '2 days'::interval, max(ac.created) + '3 days'::interval, '7 days'::interval) AS date_, date_part('isoyear'::text, generate_series(min(ac.created) - '2 days'::interval, max(ac.created) + '3 days'::interval, '7 days'::interval))::smallint AS year_, date_part('week'::text, generate_series(min(ac.created) - '2 days'::interval, max(ac.created) + '3 days'::interval, '7 days'::interval))::smallint AS week_
   FROM air_cart ac
   JOIN users ON users.id = ac.user_id
   JOIN user_info ON users.user_info_id = user_info.id
  WHERE ac.booking_status_id=8
  GROUP BY user_info.id;

DROP VIEW v_generated_month_periods_by_userinfoid;
CREATE OR REPLACE VIEW v_generated_month_periods_by_userinfoid AS 
 SELECT user_info.id AS user_info_id, generate_series(min(ac.created), max(ac.created) + '25 days'::interval, '1 mon'::interval) AS date_, date_part('isoyear'::text, generate_series(min(ac.created), max(ac.created) + '25 days'::interval, '1 mon'::interval))::smallint AS year_, date_part('month'::text, generate_series(min(ac.created), max(ac.created) + '25 days'::interval, '1 mon'::interval))::smallint AS month_
   FROM air_cart ac
   JOIN users ON users.id = ac.user_id
   JOIN user_info ON users.user_info_id = user_info.id
  WHERE ac.booking_status_id=8
  GROUP BY user_info.id;


-- 2015-August-31
CREATE TABLE search_count (
  date_ DATE   NOT NULL ,
  client_source_id INTEGER   NOT NULL ,
  value INTEGER   NOT NULL   ,
PRIMARY KEY(date_, client_source_id)  ,
  FOREIGN KEY (client_source_id) REFERENCES client_source(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX search_count_FKIndex1 ON search_count (client_source_id);

INSERT INTO search_count (date_, client_source_id, "value") 
(
   SELECT  created::date, client_source_id, count(*) FROM searches where 
        created <'today'
        GROUP BY 1,2
);


-- 2015-Sep-01
CREATE TABLE searches_arch
(
  id int8 NOT NULL,
  user_id integer,
  created timestamp without time zone NOT NULL DEFAULT now(),
  origin text NOT NULL,
  destination text NOT NULL,
  type_id smallint NOT NULL DEFAULT 1,
  is_domestic smallint NOT NULL,
  date_depart date NOT NULL,
  date_return date,
  adults smallint NOT NULL DEFAULT 1,
  children smallint NOT NULL DEFAULT 0,
  infants smallint NOT NULL DEFAULT 0,
  category smallint DEFAULT 1,
  client_source_id integer NOT NULL DEFAULT 1,
  hits integer DEFAULT 0,
  CONSTRAINT searches_arch_pkey PRIMARY KEY (id),
  CONSTRAINT searches_arch_client_source_id_fkey FOREIGN KEY (client_source_id)
      REFERENCES client_source (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (OIDS=FALSE);

CREATE INDEX searches_arch_client_source_id_idx ON searches_arch USING btree (client_source_id);
CREATE INDEX searches_arch_created_idx ON searches_arch USING btree (created);

INSERT INTO searches_arch (id, user_id, created, origin, destination, type_id, is_domestic, date_depart, date_return, adults, children, infants, category, client_source_id, hits)
(select id, user_id, created, origin, destination, type_id, is_domestic, date_depart, date_return, adults, children, infants, category, client_source_id, hits from searches 
-- where id>(select max(id) from searches_arch)
);

delete from searches_arch where created + interval '7 day'<'now';
delete from process where queued + interval '24 hour'<'now' and result is not null;
delete from searches where created + interval '24 hour'<'now';

-- 2015-Oct-13
ALTER TABLE routes_cache ADD COLUMN search_id int8;
ALTER TABLE routes_cache ADD CONSTRAINT routes_cache_search_id_fkey FOREIGN KEY (search_id) REFERENCES searches (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;
CREATE INDEX routes_cache_search_id_idx ON routes_cache (search_id);

-- 2015-Oct-10
DROP TABLE search_x_cache;

-- 2015-Nov-04
INSERT INTO payment_gateway (id, "name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) VALUES 
    (14, 'Atom test', '{"Test bank":2001}', '307', 'Test@123', 'https://paynetzuat.atomtech.in/paynetz/epi/fts', 1, 'https://payment.atomtech.in/paynetz/rfts', 'NSE', NULL, NULL, NULL),
    (15, 'Atom', null, null, 'Test@123', 'https://paynetzuat.atomtech.in/paynetz/epi/fts', 1, 'https://payment.atomtech.in/paynetz/rfts', 'NSE', NULL, NULL, NULL);

-- 2015-Nov-09
update payment_gateway set access_code='https://paynetzuat.atomtech.in/paynetz/vfts' where id=14;

-- 2015-Dec-22
CREATE TABLE IF NOT EXISTS params (
    id TEXT NOT NULL,
    info TEXT NOT NULL,
    PRIMARY KEY(id)
);

-- 2015-Dec-26
INSERT INTO "public"."permission" (id, "name", staff_only) 
	VALUES (15, 'Login out of office', 1);


-- 2016-Jan-07
INSERT INTO "public".backend ("name", "search", book, "hold", balance, pnr_acquisition, api_source, pnr_resync, pnr_cancel, pnr_list, pnr_book, wsdl_file, pnr_load, city_pairs, carrier_id) 
	VALUES ('Amadeus test V2', '\application\components\Amadeus\Utils::search', '\application\components\Amadeus\test_v2\Book', NULL, NULL, '\application\components\Amadeus\Utils::aquirePnr', '\application\components\Amadeus\test_v2\AmadeusWebServices', '\application\components\Amadeus\Utils::resyncPnr', '\application\components\Amadeus\Utils::cancelPnr', '\application\components\Amadeus\Utils::listPnr', '\application\components\Amadeus\test_v2\Book', 'test_v2', NULL, NULL, NULL);
INSERT INTO "public".air_source ("name", username, password, tran_username, tran_password, iata_number, profile_pcc, spare1, spare2, spare3, exclude_carriers, include_pass_carriers, balance, backend_id, is_active, type_id, international_auto_ticket, domestic_auto_ticket, display_in_search, balance_link, currency_id) 
	VALUES ('Amadeus test-v2', 'WSBELBEL', 'bYmTw780', 'NMC-INDIA', '', '', 'DELWI2155', '', '', '', '', '', 0.0, 18, 1, 3, 1, 1, 0, NULL, 1);


-- 2016-Jan-11
ALTER TABLE routes_cache ADD COLUMN luggage TEXT DEFAULT NULL;
ALTER TABLE routes_cache ADD COLUMN refundable INTEGER DEFAULT NULL;

-- 2016-Jan-14
CREATE TABLE booking_log_arch (
    id integer ,
    booking_id bigint NOT NULL,
    browser text,
    browser_version text,
    platform text,
    is_mobile smallint DEFAULT 0,
    logs text,
    booking_data text,
    enabled smallint DEFAULT 1,
    created timestamp without time zone,
    client_source_id integer,
    air_cart_id integer,
    source text,
    destination text,
    type_id integer,
    is_domestic integer,
    carrier_id integer
);
CREATE INDEX booking_log_created_idx ON booking_log_arch USING btree (created);

-- 2016-Jan-21
ALTER TABLE air_cart ADD COLUMN rules TEXT DEFAULT NULL;

-- 2016-Jan-25
DELETE FROM payment_gateway WHERE id IN (16);
INSERT INTO payment_gateway (id, "name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) VALUES 
    (16, 'HDFC2 test', NULL, 'TEST99010238', 'D4874FD707B148377C14B5DD67DD59E1', 'https://migs.mastercard.com.au/vpcpay', 1, 'https://migs.mastercard.com.au/vpcdps', '013F008E', 'admin', 'test123456', NULL);

DELETE FROM payment_gateway WHERE id IN (17);
INSERT INTO payment_gateway (id, "name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) VALUES 
    (17, 'HDFC2',      null, '99010238',     '497EF0D81AA14DCD4AD8D1AE4BA886BF', 'https://migs.mastercard.com.au/vpcpay', 1, 'https://migs.mastercard.com.au/vpcdps', '6B9FCAD3', 'belair', 'pgjxhYal7A1S', NULL);

-- 2016-Feb-17
INSERT INTO "public".backend (id, "name", "search", book, "hold", balance, pnr_acquisition, api_source, pnr_resync, pnr_cancel, pnr_list, pnr_book, wsdl_file, pnr_load, city_pairs, carrier_id) 
	VALUES (19, 'Amadeus v.2', '\application\components\Amadeus\Utils::searchV2', '\application\components\Amadeus\production_v2\Book', NULL, NULL, '\application\components\Amadeus\Utils::aquirePnr', '\application\components\Amadeus\production_v2\AmadeusWebServices', '\application\components\Amadeus\Utils::resyncPnr', '\application\components\Amadeus\Utils::cancelPnr', '\application\components\Amadeus\Utils::listPnr', '\application\components\Amadeus\production_v2\Book', 'production_v2', NULL, NULL, NULL);

-- 2016-Mar-16
ALTER TABLE air_routes ADD COLUMN ts TEXT DEFAULT NULL;
COMMENT ON COLUMN air_routes.ts IS 'Technical stops';

-- 2016-Apr-04
DROP TABLE IF EXISTS airsource_rule;
CREATE TABLE airsource_rule ( 
    id                   serial NOT NULL,
    air_source_ids       text   NOT NULL,
    filter               text ,
    order_               smallint DEFAULT 1 NOT NULL,
    CONSTRAINT airsource_rule_pk PRIMARY KEY (id)
);
COMMENT ON TABLE airsource_rule IS 'Rules to pick set of airports. Both air_source_ids and filter are json encoded fields.';

-- 2016-May-13
DROP INDEX airport_code_idx;
CREATE UNIQUE INDEX airport_code_idx ON airport USING btree (airport_code);

-- 2016-May-15
CREATE INDEX air_routes_ab_id_idx ON air_routes USING btree (air_booking_id);

-- 2016-Jun-28
CREATE TABLE contact_us ( 
    id                  serial NOT NULL,
    created             timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated             timestamp without time zone,
    notes               text,
    CONSTRAINT contact_us_pk PRIMARY KEY (id)
);
COMMENT ON TABLE contact_us IS 'Table to hold the contact us queries.';
SELECT setval('contact_us_id_seq', 12340000);

-- 2016-Jul-04
ALTER TABLE process DROP CONSTRAINT process_search_id_fkey;
ALTER TABLE process ADD CONSTRAINT process_search_id_fkey FOREIGN KEY (search_id) REFERENCES searches (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;

-- 2016-Jul-07
ALTER TABLE air_source ADD COLUMN priority SMALLINT DEFAULT 1;

CREATE TABLE rc_link (
  "from" INTEGER NOT NULL ,
  "to" INTEGER   NOT NULL   ,
PRIMARY KEY("from"));
COMMENT ON TABLE rc_link IS 'RC redirects when best result is received after the response cutoff time.';
ALTER TABLE rc_link ADD CONSTRAINT rc_link_from_fkey FOREIGN KEY ("from") REFERENCES routes_cache (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE rc_link ADD CONSTRAINT rc_link_to_fkey FOREIGN KEY ("to") REFERENCES routes_cache (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;


-- 2016-Jul-10
CREATE FUNCTION moveDeletedSearches() RETURNS trigger AS $$
    BEGIN
       INSERT INTO searches_arch VALUES((OLD).*);
       RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER moveDeletedSearches
BEFORE DELETE ON searches 
    FOR EACH ROW
        EXECUTE PROCEDURE moveDeletedSearches();



-- 2016-Jul-

-- 2016-July-15
INSERT INTO "public".backend ("name", "search", book, "hold", balance, pnr_acquisition, api_source, pnr_resync, pnr_cancel, pnr_list, pnr_book, wsdl_file, pnr_load, city_pairs, carrier_id) 
	VALUES ('Scoot Test', '\application\components\Scoot\Utils::search', NULL, NULL, NULL, '\application\components\Scoot\Utils::aquirePnr', '\application\components\Scoot\PnrManagement', '\ApiInterface::resyncPnr', '\application\components\Scoot\Utils::cancelPnr', '\application\components\Scoot\Utils::listPnr', '\application\components\Scoot\PnrManagement', 'test', '\application\components\Scoot\PnrAcquisition', NULL, 446);
INSERT INTO "public".air_source ("name", username, password, tran_username, tran_password, iata_number, profile_pcc, spare1, spare2, spare3, exclude_carriers, include_pass_carriers, balance, backend_id, is_active, type_id, international_auto_ticket, domestic_auto_ticket, display_in_search, balance_link, currency_id) 
	VALUES ('Scoot Test', 'AIN1600063', 'mw89%2KC', '', '', '', '', 'def', '', '', '', '', 0.0, 19, 1, 3, 1, 1, 0, NULL, 1);



----------------------------------------------------------------------------------------------
-- Not applyed yet

ALTER TABLE air_booking ADD COLUMN XXX_id INTEGER;
ALTER TABLE air_booking ADD CONSTRAINT air_booking_XXX_id_fkey FOREIGN KEY (XXX_id) REFERENCES XXX (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT;
CREATE INDEX air_booking_XXX_id_idx ON air_booking (XXX_id);

CREATE TABLE XYZ (
  id SERIAL  NOT NULL ,
  name TEXT   NOT NULL   ,
PRIMARY KEY(id));
DELETE from XYZ;
INSERT INTO XYZ (id, name) VALUES
(1, 'Option 1'),
(2, 'Option 2'),
(3, 'Option 3');
SELECT setval('XYZ_id_seq', max(id)) FROM XYZ;


=============================================================
-- Clear the test air_carts
delete from air_routes where air_booking_id in (
    select id from air_booking where air_cart_id in (
        select id from air_cart where note = 'Test of pnr acquisition from Amadeus'
    )
);
delete from air_booking where id not in (
    select air_booking_id from air_routes
);
delete from air_cart where id not in (
    select air_cart_id from air_booking
);
delete from ff_settings where traveler_id in (
    select id from traveler where user_info_id=585
);
delete from traveler where user_info_id=585;



-- Trigger that update the column updated with the current timestamp
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER 
LANGUAGE plpgsql AS 
$$
BEGIN
    IF (NEW != OLD) THEN
        NEW.updated = CURRENT_TIMESTAMP;
        RETURN NEW;
    END IF;
    RETURN OLD;
END;
$$;

CREATE TRIGGER triger_name
  BEFORE UPDATE
  ON table_name
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();


INSERT INTO "public".backend(
            id, "name", search, book, hold, balance, pnr_acquisition, api_source, 
            pnr_resync, pnr_cancel, pnr_list, pnr_book, wsdl_file, pnr_load, 
            city_pairs, carrier_id)
    VALUES (16,'Fly Dubai Test','\application\components\Flydubai\Utils::search','','','',
    '\application\components\Flydubai\Utils::aquirePnr','\application\components\api_interfaces\Flydubai\PnrManagement',
    '\ApiInterface::resyncPnr','\application\components\api_interfaces\Flydubai\cancelPnr','',
    '\application\components\api_interfaces\Flydubai\PnrManagement','production',
    '\application\components\api_interfaces\Flydubai\PnrAcquisition','',56);


INSERT INTO "public".backend(
            id, "name", search, book, hold, balance, pnr_acquisition, api_source, 
            pnr_resync, pnr_cancel, pnr_list, pnr_book, wsdl_file, pnr_load, 
            city_pairs, carrier_id)
    VALUES (17,'Fly Dubai Production','\application\components\Flydubai\Utils::search','','','',
'\application\components\Flydubai\Utils::aquirePnr','\application\components\api_interfaces\Flydubai\PnrManagement',
'\ApiInterface::resyncPnr','\application\components\api_interfaces\Flydubai\cancelPnr',
'','\application\components\api_interfaces\Flydubai\PnrManagement','production',
'\application\components\api_interfaces\Flydubai\PnrAcquisition','',56);

INSERT INTO "public".air_source(
            id, "name", username, password, tran_username, tran_password, iata_number, 
            profile_pcc, spare1, spare2, spare3, exclude_carriers, include_pass_carriers, 
            bta_pass, amex_pass, visa_pass, root_pass, master_pass, balance, 
            backend_id, is_active, type_id, international_auto_ticket, domestic_auto_ticket, 
            display_in_search, balance_link)
    VALUES (
		41,'Fly Dubai test','flydubai_ek_dev','fd0126','apiairt','Flydubai@2015',null,
		'03052015',null,null,null,null,null,
		0,0,0,0,0,0,
		17,1,3,1,1,
		1,null
    );

INSERT INTO "public".air_source(
            id, "name", username, password, tran_username, tran_password, iata_number, 
            profile_pcc, spare1, spare2, spare3, exclude_carriers, include_pass_carriers, 
            bta_pass, amex_pass, visa_pass, root_pass, master_pass, balance, 
            backend_id, is_active, type_id, international_auto_ticket, domestic_auto_ticket, 
            display_in_search, balance_link)
    VALUES (
		42,'Flu Dubai Production','username','username','username','password','',
		'pcc','','','','','',
		0,0,0,0,0,0,
		18,1,3,0,1,
		1,null
    );
INSERT INTO "public".air_source(
            id, "name", username, password, tran_username, tran_password, iata_number, 
            profile_pcc, spare1, spare2, spare3, exclude_carriers, include_pass_carriers, 
            bta_pass, amex_pass, visa_pass, root_pass, master_pass, balance, 
            backend_id, is_active, type_id, international_auto_ticket, domestic_auto_ticket, 
            display_in_search, balance_link)
    VALUES (
	    43,'Fly Dubai test International','flydubai_ek_dev','fd0126','apiairtint','Flydubai@2015','',
	    '04052015','','','','','',
	    0,0,0,0,0,0,
	    17,1,3,1,1,
	    1,null   );
		
INSERT INTO "public".air_source(
            id, "name", username, password, tran_username, tran_password, iata_number, 
            profile_pcc, spare1, spare2, spare3, exclude_carriers, include_pass_carriers, 
            bta_pass, amex_pass, visa_pass, root_pass, master_pass, balance, 
            backend_id, is_active, type_id, international_auto_ticket, domestic_auto_ticket, 
            display_in_search, balance_link)
    VALUES (
	    44,'Fly Dubai Production International','username','username','username','username','',
	    'pcc','','','','','',0,0,0,0,0,0,
	    18,1,3,0,1,
	    1,null   );


--For Accounting System
ALTER TABLE payment ADD COLUMN receipt_no character varying(25);
ALTER TABLE air_cart ADD COLUMN invoice_no character varying(25);
ALTER TABLE amendment ADD COLUMN credit_debit_note_no character varying(25);


--For Promo Codes

  CREATE SEQUENCE promo_type_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1 ;

  CREATE SEQUENCE promo_discount_type_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1 ;

  CREATE SEQUENCE promo_date_type_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1 ;
  
  CREATE SEQUENCE promo_payment_type_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1 ;

  CREATE SEQUENCE promo_code_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1;

CREATE TABLE promo_type
(
  id integer NOT NULL DEFAULT nextval('promo_type_id_seq'::regclass),
  code text,
  name text,
  CONSTRAINT promo_type_pkey PRIMARY KEY (id)
);

INSERT INTO promo_type VALUES (nextval('promo_type_id_seq'), 'AL', 'Airline Based');
INSERT INTO promo_type VALUES (nextval('promo_type_id_seq'), 'AS', 'Air Source Based');
INSERT INTO promo_type VALUES (nextval('promo_type_id_seq'), 'AGT', 'Agent Based');


CREATE TABLE promo_discount_type
(
  id integer NOT NULL DEFAULT nextval('promo_discount_type_id_seq'::regclass),
  code text,
  name text,
  CONSTRAINT promo_discount_type_pkey PRIMARY KEY (id)
);

INSERT INTO promo_discount_type VALUES (nextval('promo_discount_type_id_seq'), 'FIX', 'Fixed');
INSERT INTO promo_discount_type VALUES (nextval('promo_discount_type_id_seq'), 'PRCT', 'Percentage');


CREATE TABLE promo_date_type
(
  id integer NOT NULL DEFAULT nextval('promo_date_type_id_seq'::regclass),
  code text,
  name text,
  CONSTRAINT promo_date_type_pkey PRIMARY KEY (id)
);

INSERT INTO promo_date_type VALUES (nextval('promo_date_type_id_seq'), 'T', 'Travel Date');
INSERT INTO promo_date_type VALUES (nextval('promo_date_type_id_seq'), 'B', 'Booking Date');


CREATE TABLE promo_payment_type
(
  id integer NOT NULL DEFAULT nextval('promo_payment_type_id_seq'::regclass),
  name text,
  CONSTRAINT promo_payment_type_pkey PRIMARY KEY (id)
);
INSERT INTO promo_payment_type VALUES (nextval('promo_payment_type_id_seq'), 'NET BANKING');
INSERT INTO promo_payment_type VALUES (nextval('promo_payment_type_id_seq'), 'CREDIT / DEBIT CARD');
INSERT INTO promo_payment_type VALUES (nextval('promo_payment_type_id_seq'), 'CASH');


CREATE TABLE promo_codes
(
  id integer NOT NULL DEFAULT nextval('promo_code_id_seq'::regclass),
  code character varying(15) NOT NULL,
  promo_type_id integer,
  date_valid_from date,
  date_valid_to date,
  promo_date_type_id integer,
  user_info_id integer,
  user_type_id integer,
  user_id integer,
  max_count integer,
  air_source_id integer,
  carrier_id integer,
  value real DEFAULT 0,
  promo_discount_type_id integer NOT NULL,
  created timestamp without time zone DEFAULT now(),
  enabled integer DEFAULT 1,
  min_amount real,
  promo_payment_type_id integer,
  cc_type_id integer,
  bank_id integer,
  max_value real,
  CONSTRAINT promo_codes_pkey PRIMARY KEY (id),
  CONSTRAINT promo_codes_air_source_id_fkey FOREIGN KEY (air_source_id)
      REFERENCES air_source (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_carrier_id_fkey FOREIGN KEY (carrier_id)
      REFERENCES carrier (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_cc_type_id_fkey FOREIGN KEY (cc_type_id)
      REFERENCES cc_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT promo_codes_promo_date_type_id_fkey FOREIGN KEY (promo_date_type_id)
      REFERENCES promo_date_type (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_promo_discount_type_id_fkey FOREIGN KEY (promo_discount_type_id)
      REFERENCES promo_discount_type (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_promo_payment_type_id_fkey FOREIGN KEY (promo_payment_type_id)
      REFERENCES promo_payment_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT promo_codes_promo_type_id_fkey FOREIGN KEY (promo_type_id)
      REFERENCES promo_type (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_user_info_id_fkey FOREIGN KEY (user_info_id)
      REFERENCES user_info (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_user_type_id_fkey FOREIGN KEY (user_type_id)
      REFERENCES user_type (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Index: fki_promo_codes_cc_type_id_fkey

-- DROP INDEX fki_promo_codes_cc_type_id_fkey;

CREATE INDEX fki_promo_codes_cc_type_id_fkey
  ON promo_codes
  USING btree
  (cc_type_id);

-- Index: fki_promo_codes_promo_payment_type_id_fkey

-- DROP INDEX fki_promo_codes_promo_payment_type_id_fkey;

CREATE INDEX fki_promo_codes_promo_payment_type_id_fkey
  ON promo_codes
  USING btree
  (promo_payment_type_id);

-- Index: promo_codes_air_source_id_fkey

-- DROP INDEX promo_codes_air_source_id_fkey;

CREATE INDEX promo_codes_air_source_id_fkey
  ON promo_codes
  USING btree
  (air_source_id);

-- Index: promo_codes_carrier_id_fkey

-- DROP INDEX promo_codes_carrier_id_fkey;

CREATE INDEX promo_codes_carrier_id_fkey
  ON promo_codes
  USING btree
  (carrier_id);

-- Index: promo_codes_promo_date_type_id_fkey

-- DROP INDEX promo_codes_promo_date_type_id_fkey;

CREATE INDEX promo_codes_promo_date_type_id_fkey
  ON promo_codes
  USING btree
  (promo_date_type_id);

-- Index: promo_codes_promo_discount_type_id_fkey

-- DROP INDEX promo_codes_promo_discount_type_id_fkey;

CREATE INDEX promo_codes_promo_discount_type_id_fkey
  ON promo_codes
  USING btree
  (promo_discount_type_id);

-- Index: promo_codes_promo_type_id_fkey

-- DROP INDEX promo_codes_promo_type_id_fkey;

CREATE INDEX promo_codes_promo_type_id_fkey
  ON promo_codes
  USING btree
  (promo_type_id);

-- Index: promo_codes_user_id_fkey

-- DROP INDEX promo_codes_user_id_fkey;

CREATE INDEX promo_codes_user_id_fkey
  ON promo_codes
  USING btree
  (user_id);

-- Index: promo_codes_user_info_id_fkey

-- DROP INDEX promo_codes_user_info_id_fkey;

CREATE INDEX promo_codes_user_info_id_fkey
  ON promo_codes
  USING btree
  (user_info_id);

-- Index: promo_codes_user_type_id_fkey

-- DROP INDEX promo_codes_user_type_id_fkey;

CREATE INDEX promo_codes_user_type_id_fkey
  ON promo_codes
  USING btree
  (user_type_id);

INSERT INTO promo_codes VALUES (nextval('promo_code_id_seq'), 'TEST01', 1, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, 100, 1, '2015-07-09 13:10:30.329', 1, 2000, NULL, NULL, NULL, NULL);
INSERT INTO promo_codes VALUES (nextval('promo_code_id_seq'), 'AGENT70', 3, NULL, NULL, 1, 892, 3, NULL, 4, NULL, NULL, 40, 1, '2015-07-10 10:56:33.194', 1, 6000, NULL, NULL, NULL, NULL);
INSERT INTO promo_codes VALUES (nextval('promo_code_id_seq'), 'REF400', 3, '2015-07-13', '2015-07-31', 2, NULL, NULL, NULL, 3, 42, NULL, 23, 2, '2015-07-13 10:14:49.443', 1, 3000, NULL, NULL, NULL, NULL);
INSERT INTO promo_codes VALUES (nextval('promo_code_id_seq'), 'TEST03', 3, '2015-07-13', '2023-07-21', 2, 1650, 3, NULL, 4, 21, 760, 45, 1, '2015-07-13 13:27:28.525', 1, 500, 2, 2, NULL, NULL);


ALTER TABLE air_cart ADD COLUMN promo_codes_id INTEGER;
ALTER TABLE air_cart
  ADD CONSTRAINT air_cart_promo_codes_id_fkey FOREIGN KEY (promo_codes_id) REFERENCES promo_codes (id) ON UPDATE CASCADE ON DELETE RESTRICT;

--new permission for accounting xmls
INSERT INTO permission(id, name, staff_only)  VALUES (nextval('permission_id_seq'), 'View Accounting Xmls', 0);

--25 Aug 2015--
--PROMO CODES STRUCTURE CHANGE SQL- 
DROP TABLE promo_codes CASCADE;
CREATE TABLE promo_codes
(
  id integer NOT NULL DEFAULT nextval('promo_code_id_seq'::regclass),
  code character varying(15) NOT NULL,
  promo_type_id integer,
  date_valid_from date,
  date_valid_to date,
  promo_date_type_id integer,
  ref_user_info_id integer,
  max_count integer,
  value real DEFAULT 0,
  promo_discount_type_id integer NOT NULL,
  created timestamp without time zone DEFAULT now(),
  enabled integer DEFAULT 1,
  min_amount real,
  max_value real,
  ref_value real,
  ref_value_type_id integer,
  ref_max_value real,
  filter text,
  CONSTRAINT promo_codes_pkey PRIMARY KEY (id),
  CONSTRAINT promo_codes_promo_date_type_id_fkey FOREIGN KEY (promo_date_type_id)
      REFERENCES promo_date_type (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_promo_discount_type_id_fkey FOREIGN KEY (promo_discount_type_id)
      REFERENCES promo_discount_type (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT promo_codes_promo_type_id_fkey FOREIGN KEY (promo_type_id)
      REFERENCES promo_type (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE RESTRICT
)
WITH (
  OIDS=FALSE
);

-- Index: promo_codes_promo_date_type_id_fkey

-- DROP INDEX promo_codes_promo_date_type_id_fkey;

CREATE INDEX promo_codes_promo_date_type_id_fkey
  ON promo_codes
  USING btree
  (promo_date_type_id);

-- Index: promo_codes_promo_discount_type_id_fkey

-- DROP INDEX promo_codes_promo_discount_type_id_fkey;

CREATE INDEX promo_codes_promo_discount_type_id_fkey
  ON promo_codes
  USING btree
  (promo_discount_type_id);

-- Index: promo_codes_promo_type_id_fkey

-- DROP INDEX promo_codes_promo_type_id_fkey;

CREATE INDEX promo_codes_promo_type_id_fkey
  ON promo_codes
  USING btree
  (promo_type_id);

-- Index: promo_codes_user_info_id_fkey

-- DROP INDEX promo_codes_user_info_id_fkey;

CREATE INDEX promo_codes_user_info_id_fkey
  ON promo_codes
  USING btree
  (ref_user_info_id);


DROP TABLE promo_type CASCADE;

CREATE TABLE promo_type
(
  id integer NOT NULL DEFAULT nextval('promo_type_id_seq'::regclass),
  code text,
  name text,
  CONSTRAINT promo_type_pkey PRIMARY KEY (id)
);

ALTER SEQUENCE promo_type_id_seq RESTART WITH 1;
INSERT INTO promo_type VALUES (nextval('promo_type_id_seq'), 'DEF', 'DEFAULT');
INSERT INTO promo_type VALUES (nextval('promo_type_id_seq'), 'REF', 'REFERAL');

CREATE SEQUENCE promo_log_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1;

CREATE TABLE promo_log
(
  id integer NOT NULL DEFAULT nextval('promo_log_id_seq'::regclass),
  promo_codes_id integer NOT NULL,
  air_cart_id integer NOT NULL,
  value real,
  promo_code character varying(15),
  data text,
  created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT promo_log_pkey PRIMARY KEY (id),
  CONSTRAINT promo_log_air_cart_id_fkey FOREIGN KEY (air_cart_id)
      REFERENCES air_cart (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT promo_log_promo_codes_id_fkey FOREIGN KEY (promo_codes_id)
      REFERENCES promo_codes (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);


--27 Aug 2015--
ALTER TABLE promo_log ADD COLUMN is_referred_paid smallint DEFAULT 0;
INSERT INTO transfer_type(id, name) VALUES (11,'promo_referred' );

--03 sep 2015
ALTER TABLE promo_log DROP CONSTRAINT promo_log_air_cart_id_fkey;

--07 sep 2015

CREATE SEQUENCE booking_log_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;


--Delete data more than 3 months old
CREATE TABLE booking_log
(
  id integer NOT NULL DEFAULT nextval('booking_log_id_seq'::regclass),
  booking_id integer NOT NULL,
  browser text,
  browser_version text,
  platform text,
  is_mobile smallint DEFAULT 0,
  logs text,
  booking_data text,
  enabled smallint DEFAULT 1,
  created timestamp without time zone DEFAULT now(),
  client_source_id integer,
  air_cart_id integer,
  CONSTRAINT booking_log_pkey PRIMARY KEY (id)
);

--08 sep 2015
ALTER TABLE booking_log   ALTER COLUMN booking_id TYPE bigint;

--10 sep 2015
ALTER TABLE booking_log   ADD COLUMN search_id integer;
ALTER TABLE booking_log   ADD COLUMN rcs_id integer;
ALTER TABLE booking_log   ADD COLUMN source text;
ALTER TABLE booking_log   ADD COLUMN destination text;
ALTER TABLE booking_log   ADD COLUMN type_id integer;
ALTER TABLE booking_log   ADD COLUMN is_domestic integer;
ALTER TABLE booking_log   ADD COLUMN carrier_id integer;

--11 sep 2015
ALTER TABLE booking_log DROP COLUMN rcs_id ;
ALTER TABLE booking_log DROP COLUMN search_id ;

--20 Oct 2015 claiming cart: only single user can work on particular cart
ALTER TABLE air_cart   ADD COLUMN claim_user_id smallint DEFAULT 0;
ALTER TABLE air_cart   ADD COLUMN claimed_ts timestamp without time zone DEFAULT now();
--process flag
ALTER TABLE air_cart   ADD COLUMN process_flag smallint DEFAULT 0;



--30 Nov 2015 
--Email SMS Log
CREATE SEQUENCE email_sms_log_id_seq   INCREMENT 1   START 1;

CREATE TABLE email_sms_log
(
  id integer NOT NULL DEFAULT nextval('email_sms_log_id_seq'::regclass),
  contact_type text NOT NULL,
  sender text,
  receiver text,
  content text,
  created timestamp without time zone DEFAULT now(),
  air_cart_id integer,
  content_type integer,
  user_id integer,
  subject text,
  CONSTRAINT email_sms_log_pkey PRIMARY KEY (id),
  CONSTRAINT email_sms_log_air_cart_id_fkey FOREIGN KEY (air_cart_id)
      REFERENCES air_cart (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT emil_sms_log_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

--07 Dec 2015 
--Way_type(DOM/INT) in promo codes
ALTER TABLE promo_codes ADD COLUMN way_type integer DEFAULT 1;

--09-- Dec 2015
CREATE SEQUENCE public.cart_status_log_id_seq   INCREMENT 1   START 1;
CREATE TABLE cart_status_log
(
  id integer NOT NULL DEFAULT nextval('cart_status_log_id_seq'::regclass),
  air_cart_id integer NOT NULL,
  booking_status_id integer NOT NULL DEFAULT 1,
  cart_status_id integer NOT NULL DEFAULT 1,
  user_id integer,
  created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT cart_status_log_pkey PRIMARY KEY (id),
 CONSTRAINT cart_status_log_air_cart_id_fkey FOREIGN KEY (air_cart_id)
      REFERENCES air_cart (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
);

CREATE TABLE cart_status
(
  air_cart_id integer NOT NULL,
  cart_status_id integer NOT NULL DEFAULT 1,
  CONSTRAINT cart_status_pkey PRIMARY KEY (air_cart_id),
  CONSTRAINT cart_status_air_cart_id_fkey FOREIGN KEY (air_cart_id)
      REFERENCES air_cart (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
);
--11-- Dec 2015
ALTER TABLE air_cart  ADD COLUMN cart_status_id integer DEFAULT 1;
DROP TABLE cart_status;

--14 Dec 2015
ALTER TABLE payment  ADD COLUMN is_mail_sent smallint DEFAULT 0;

--15 Dec 2015
ALTER TABLE payment DROP COLUMN is_mail_sent;

--18 Dec 2015
ALTER TABLE cart_status_log ADD COLUMN time_taken_in_min integer;

--31 Dec 2015
CREATE TABLE old_site_data
(
  id serial NOT NULL,
  txdate date,
  txid character varying(50),
  booking_status character varying(200),
  payment_status character varying(200),
  sector character varying(20),
  dom_int character varying(20),
  pax_name text,
  amount real,
  pax_details text,
  apnr character varying(50),
  carrier character varying(5),
  travel_date date,
  booking_type character varying(50),
  supplier character varying(15),
  channel character varying(200),
  CONSTRAINT old_site_data_pkey PRIMARY KEY (id)
);

--08 Jan 2016
--No need of trimming data as no of rows will be static
CREATE TABLE ticket_rules_notes
(
  id serial NOT NULL,
  airline_code text,
  iata_on_basic character varying(20),
  airline_with_remarks integer,
  instructions text,
  created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT ticket_rules_notes_pkey PRIMARY KEY (id)
);

--No need of trimming data as no of rows will be static
CREATE TABLE ticket_rules_sources
(
  id serial NOT NULL,
  agent_name text,
  amadeus_pcc character varying(200),
  gal_pcc character varying(200),
  contact text,
  email text,
  office text,
  night_ctc text,
  mobile_no text,
  created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT ticket_rules_sources_pkey PRIMARY KEY (id)
);

--No need of trimming data as no of rows will be static
CREATE TABLE ticket_rules_airline
(
  id serial NOT NULL,
  airline_code text,
  iata_on_basic character varying(10),
  airline_name text,
  source_a_agent_id integer,
  source_a_rbd text,
  source_a_remark text,
  source_b_agent_id integer,
  source_b_rbd text,
  source_b_remark text,
  source_c_agent_id integer,
  source_c_rbd text,
  source_c_remark text,
  created timestamp without time zone NOT NULL DEFAULT now(),
  notes_a text,
  notes_b text,
  notes_c text,
  CONSTRAINT ticket_rules_airline_pkey PRIMARY KEY (id),
  CONSTRAINT tk_rules_airline_src_a_id_fkey FOREIGN KEY (source_a_agent_id)
      REFERENCES ticket_rules_sources (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT tk_rules_airline_src_b_id_fkey FOREIGN KEY (source_b_agent_id)
      REFERENCES ticket_rules_sources (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT tk_rules_airline_src_c_id_fkey FOREIGN KEY (source_c_agent_id)
      REFERENCES ticket_rules_sources (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

--13 Jan 2016
ALTER TABLE ticket_rules_notes  ALTER COLUMN airline_with_remarks TYPE text;


--15 Jan

--No need of trimming data
CREATE TABLE public.commision_client_source
(
   id serial, 
   client_source_id integer, 
   amount real DEFAULT 0, 
   type smallint, 
   way_type smallint, 
   created timestamp without time zone NOT NULL DEFAULT now(), 
   CONSTRAINT commision_client_source_pkey PRIMARY KEY (id), 
   CONSTRAINT commision_client_source_fkey1 FOREIGN KEY (client_source_id) 
    REFERENCES client_source (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE
) ;

--No need of trimming data
CREATE TABLE public.commision_gds_lcc
(
   id serial, 
   carrier_id integer, 
   amount real DEFAULT 0, 
   type smallint, 
   way_type smallint, 
   created timestamp without time zone NOT NULL DEFAULT now(), 
   CONSTRAINT commision_gds_lcc_pkey PRIMARY KEY (id), 
   CONSTRAINT commision_gds_lcc_fkey1 FOREIGN KEY (carrier_id) 
    REFERENCES carrier (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE
);

--No need of trimming data
CREATE TABLE public.commision_pg
(
   id serial, 
   pg_id integer, 
   amount real DEFAULT 0, 
   type smallint, 
   created timestamp without time zone NOT NULL DEFAULT now(), 
   CONSTRAINT commision_pg_pkey PRIMARY KEY (id), 
   CONSTRAINT commision_pg_fkey1 FOREIGN KEY (pg_id) 
    REFERENCES payment_gateway (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE
);

--No need of trimming data
CREATE TABLE public.commision_cs_cost
(
   id serial, 
   cs_id integer, 
   cost_date date, 
   avg_cost real, 
   CONSTRAINT commision_cs_cost_pkey PRIMARY KEY (id), 
   CONSTRAINT commision_cs_cost_ukey1 UNIQUE (cs_id, cost_date), 
   CONSTRAINT commision_cs_cost_fkey1 FOREIGN KEY (cs_id) REFERENCES client_source (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE
);

--18 Jan 2016
ALTER TABLE ticket_rules_notes ADD COLUMN note_id character varying(200);

--21 jan 2016

ALTER TABLE commision_cs_cost   ADD COLUMN way_type smallint;

--22 Jan 2016
CREATE TABLE public.ticket_rules_cards
(
   id serial, 
   airline_id integer, 
   amex_pax_card smallint, 
   amex_belair_card smallint, 
   amex_slip smallint, 
   master_pax_card smallint, 
   master_belair_card smallint, 
   master_slip smallint, 
   CONSTRAINT ticket_rules_cards_pkey PRIMARY KEY (id), 
   CONSTRAINT ticket_rules_airline_code_fkey1 FOREIGN KEY (airline_id) REFERENCES carrier (id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE commision_cs_cost;

CREATE TABLE commision_cs_cost
(
  cs_id integer NOT NULL,
  cost_date date NOT NULL,
  avg_cost real,
  way_type smallint,
  CONSTRAINT commision_cs_cost_pkey PRIMARY KEY (cs_id, cost_date),
  CONSTRAINT commision_cs_cost_fkey1 FOREIGN KEY (cs_id)
      REFERENCES client_source (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);


--27 Jan 2016
ALTER TABLE ticket_rules_cards   ADD COLUMN remarks text;

--01-Feb 2016
ALTER TABLE commision_cs_cost DROP CONSTRAINT commision_cs_cost_pkey;
ALTER TABLE commision_cs_cost ADD CONSTRAINT commision_cs_cost_pkey PRIMARY KEY(cs_id,cost_date,way_type);


--16-Feb 2016
--website_id gives us the website from which ticket is booked i.e. CheapTicket or AirTicketsIndia
ALTER TABLE air_cart  ADD COLUMN website_id smallint DEFAULT 1;


-- 03 Aug 2016

ALTER TABLE traveler ADD COLUMN note text;

-- 05 Aug 2016
INSERT INTO tr_status VALUES(5, 'aborted');

-- 26 Aug 2016
CREATE TABLE backend_restriction (
  id SERIAL,
  ip_address text DEFAULT '',
  user_id integer,
  created timestamp without time zone DEFAULT now(),
PRIMARY KEY(id)  );


-- 09 Sep 2016
INSERT INTO params(
            id, info)
    VALUES ('ALLOWED_IPS', '14.141.58.171, 43.224.158.211');

DROP TABLE backend_restriction;
-- 26 Sep 2016
CREATE TABLE payment_convenience_fee
(
   id serial, 
   client_source_id integer, 
   fixed real DEFAULT 0,
   perc real DEFAULT 0, 
   payment_type smallint, 
   payment_sub_type character varying(10), 
   created timestamp without time zone  DEFAULT now() NOT NULL , 
   CONSTRAINT payment_convinience_fee_pkey PRIMARY KEY (id), 
   CONSTRAINT payment_convinience_fee_fkey FOREIGN KEY (client_source_id) 
    REFERENCES client_source (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE
) ;
-- 03 oct 2016
DELETE FROM cms WHERE type_id IN(15, 16, 4);


-- 20 Oct 2016
ALTER TABLE payment_convenience_fee ADD COLUMN journey_type integer NOT NULL DEFAULT 0;


-- 21 Oct 2016
INSERT INTO payment_gateway (id, "name", note, merchant_id, salt, base_url, is_active, api_url, enc_key, username, password, access_code) 
	VALUES (18, 'AXIS2', NULL, 'BELAIRTRAVEL', 'xyz', 'https://geniusepay.in/VAS/DCC/do.action', 1, 'https://geniusepay.in/VAS/rac', 'xyz', 'BELAIRTRAVELUSER', 'teleuser123', NULL);

-- 05 Nov 2016
INSERT INTO payment_gateway VALUES (19, 'TestMerchant', 'Test Mobikwik', 'MBK9002', '', 'https://test.mobikwik.com/wallet', 1, 'https://test.mobikwik.com/debitwallet', '', '', '', 'ju6tygh7u7tdg554k098ujd5468o');

INSERT INTO payment_gateway VALUES (20, '', 'Production Mobikwik', '', '', '', 1, '', '', '', '', '');

INSERT INTO payment_gateway VALUES (21, 'PayTM Test', 'WEB', 'AIRTIC03765160424291', 'Retail', 'https://pguat.paytm.com/', 1, 'https://pguat.paytm.com/oltp-web/processTransaction', 'YJ4cDLS14IDTQqc3', NULL, NULL, 'CHEAPTICKETWEB');

INSERT INTO payment_gateway VALUES (22, 'PayTM Production', 'WEB', 'AIRTIC82508713434317', 'Retail100', 'https://secure.paytm.in/', 1, 'https://secure.paytm.in/oltp-web/processTransaction', 'JP%gmjdSXnJYB&G8', NULL, NULL, 'CHEAPTICKETWEB');

INSERT INTO transfer_type VALUES (12, 'Wallet');

-- 06 Nov 2016

ALTER TABLE payment_convenience_fee ADD COLUMN per_passenger integer NOT NULL DEFAULT 0;

-- 11 Nov 2016

CREATE TABLE promo_range
(
  id serial,
  promo_code_id integer,
  transaction_amt_from real NOT NULL DEFAULT 0,
  transaction_amt_to real NOT NULL DEFAULT 0,
  discount_value real NOT NULL DEFAULT 0,
  max_discount_value real NOT NULL DEFAULT 0,
  discount_type integer NOT NULL DEFAULT 0,
  CONSTRAINT pk_promo_range_id PRIMARY KEY (id),
  CONSTRAINT fk_promo_code_id FOREIGN KEY (promo_code_id)
      REFERENCES promo_codes (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT unq_promo_range UNIQUE (promo_code_id, transaction_amt_from, transaction_amt_to, discount_value, max_discount_value, discount_type)
);

ALTER TABLE promo_codes ADD COLUMN per_user integer NOT NULL DEFAULT 0;


-- 18 Nov 2016
INSERT INTO commercial_rule(id,client_source_id, service_type_id, carrier_id, filter, iata_rate_total, iata_rate_base,
iata_rate_yq, plb_rate_total, plb_rate_base, plb_rate_yq, book_rate_total, book_rate_base, book_rate_yq, book_fix_adult,
book_fix_child, book_fix_infant, book_fix_per_journey, cancel_fix_adult, cancel_fix_child, cancel_fix_infant, 
cancel_fix_per_journey, reschedule_fix_adult, reschedule_fix_child, reschedule_fix_infant, reschedule_fix_per_journey,
markup_rate_total, markup_rate_base, markup_rate_yq, markup_fix_adult, markup_fix_child, markup_fix_infant, markup_fix_per_journey,
air_source_id, order_, markup_added_to) (SELECT -1 as id, 1 client_source_id, 1 service_type_id,NULL carrier_id, filter, 0 iata_rate_total, 0 iata_rate_base, 
0 iata_rate_yq, 0 plb_rate_total, 0 plb_rate_base, 0 plb_rate_yq, 0 book_rate_total, 0 book_rate_base, 0 book_rate_yq, 0 book_fix_adult,
0 book_fix_child,0 book_fix_infant,0 book_fix_per_journey,0 cancel_fix_adult,0 cancel_fix_child,0 cancel_fix_infant,
0 cancel_fix_per_journey,0 reschedule_fix_adult,0 reschedule_fix_child,0 reschedule_fix_infant,0 reschedule_fix_per_journey,
0 markup_rate_total,0 markup_rate_base,0 markup_rate_yq,0 markup_fix_adult,0 markup_fix_child,0 markup_fix_infant,
0 markup_fix_per_journey,NULL air_source_id, 0 order_, 2 markup_added_to FROM commercial_rule WHERE id=2);

UPDATE commercial_rule SET filter = '{"include":{"book_date":"","onward_date":"","return_dept_date":"","flight":"","booking_class":"","fare_basis":"","cabin_class":"","origin_airport":"","arrival_airport":"","tour_code":"","pf_code":"","biggerThan":null,"base_fare":""},"exclude":{"book_date":"","onward_date":"","return_dept_date":"","flight":"","booking_class":"","fare_basis":"","cabin_class":"","origin_airport":"","arrival_airport":"","tour_code":"","pf_code":"","biggerThan":null,"base_fare":""}}' WHERE id=-1;


ALTER TABLE payment_convenience_fee ADD COLUMN commercial_rule_id integer NOT NULL DEFAULT -1;

ALTER TABLE payment_convenience_fee
  ADD CONSTRAINT fk_pymt_conv_fee_commercial_rule_id FOREIGN KEY (commercial_rule_id)
      REFERENCES commercial_rule (id) MATCH SIMPLE
      ON UPDATE RESTRICT ON DELETE RESTRICT;


-- 25 Nov 2016
ALTER TABLE promo_codes ADD COLUMN tnc_url text;


-- 30 Nov 2016
INSERT INTO payment_gateway VALUES (24, 'CCAvenue Production', NULL, '83856', NULL, 'https://secure.ccavenue.com/', 1, 'https://login.ccavenue.com/apis/servlet/DoWebTrans', 'B3F1E9342DABECDA6E134AA2578A8F9B', NULL, NULL, 'AVDZ68DK05CG00ZDGC');
INSERT INTO payment_gateway VALUES (23, 'CCAvenue Test', NULL, '83856', NULL, 'https://secure.ccavenue.com/', 1, 'https://login.ccavenue.com/apis/servlet/DoWebTrans', '8524BBBEABCB7A9C21A501B8826B9504', NULL, NULL, 'AVJM68DK00CA83MJAC');

-- 5 Dec 2016
UPDATE payment_gateway SET access_code='AVKM00DK78CA69MKAC', enc_key='1F1941EFB343CACD73616B38A46E6469', base_url='https://test.ccavenue.com/', api_url='https://180.179.175.17/apis/servlet/DoWebTrans' WHERE id=23;
UPDATE payment_gateway SET access_code='AVDW07CK69CC19WDCC', enc_key='BD84306E3895E193158353DB4F4D946D' WHERE id=24;

-- 06 Dec 2016
ALTER TABLE commercial_rule ADD COLUMN booking_fee_fix smallint NOT NULL DEFAULT 0;
ALTER TABLE commercial_rule ADD COLUMN booking_fee_perc smallint NOT NULL DEFAULT 0;
ALTER TABLE commercial_rule ADD COLUMN booking_fee_per_passenger smallint NOT NULL DEFAULT 0;

-- 12 Dec 2016
ALTER TABLE email_sms_log ADD COLUMN is_opened smallint NOT NULL DEFAULT 0;
ALTER TABLE email_sms_log ADD COLUMN opened_at timestamp without time zone;
ALTER TABLE email_sms_log ADD COLUMN opened_ip character varying NOT NULL DEFAULT ''::character varying;

-- 13 Dec 2016
UPDATE payment_gateway SET merchant_id = 'cDLvOH', salt = 'AvySDZGk', base_url = 'https://secure.payu.in/_payment', api_url = 'https://info.payu.in/merchant/postservice.php?form=2' WHERE id = 1;

-- 14 Dec 2016
UPDATE payment_gateway SET merchant_id = 'gtKFFx', salt = 'eCwWELxi', base_url = 'https://test.payu.in/_payment', api_url = 'https://test.payu.in/merchant/postservice.php?form=2' WHERE id = 1;

-- 18 Dec 2016
INSERT INTO promo_discount_type VALUES (3, 'PRCTBASE', 'Percentage-basic(amount)');

-- 19 Dec 2016
ALTER TABLE process ADD COLUMN server_id smallint NOT NULL DEFAULT 0;
INSERT INTO promo_discount_type VALUES (3, 'PRCTBASE', 'Percentage-basic(amount)');

-- 03 Jan 2016
ALTER TABLE air_cart ADD COLUMN one_click_ref_id text;

-- 26 Dec 2016
INSERT INTO transfer_type VALUES (13, 'EMI');
UPDATE payment_gateway SET enc_key = '7D58B7C2A95FA2A1453BE239FBADB239',access_code = 'AVKM00DK78CA68MKAC' WHERE id = 23;

-- 09 Jan 2017
ALTER TABLE ticket_rules_cards ADD COLUMN journey_type integer;

ALTER TABLE ticket_rules_cards DROP COLUMN remarks;
ALTER TABLE ticket_rules_cards DROP COLUMN amex_pax_card;
ALTER TABLE ticket_rules_cards DROP COLUMN amex_belair_card;
ALTER TABLE ticket_rules_cards DROP COLUMN amex_slip;
ALTER TABLE ticket_rules_cards DROP COLUMN master_pax_card;
ALTER TABLE ticket_rules_cards DROP COLUMN master_belair_card;
ALTER TABLE ticket_rules_cards DROP COLUMN master_slip;

CREATE TABLE ticket_cards_info
(
  id serial,
  card_type character varying(200) NOT NULL DEFAULT '',
  card_no character varying(20) NOT NULL,
  exp_month integer NOT NULL,
  exp_year integer NOT NULL,
  status smallint NOT NULL DEFAULT 0,
  created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT ticket_rules_cards_info_pkey PRIMARY KEY (id)
);

CREATE TABLE ticket_cards_rules_info
(
  id serial,
  ticket_rules_cards_id integer,
  ticket_cards_info_id integer,
  priority integer NOT NULL DEFAULT 0,
  rule_days integer DEFAULT 0,
  remarks text,
  CONSTRAINT pk_ticket_cards_rules_info PRIMARY KEY (id),
  CONSTRAINT fk_ticket_cards_info_id FOREIGN KEY (ticket_cards_info_id)
      REFERENCES ticket_cards_info (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ticket_rules_card_id FOREIGN KEY (ticket_rules_cards_id)
      REFERENCES ticket_rules_cards (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

-- 12 Jan 2016
ALTER TABLE air_cart DROP COLUMN one_click_ref_id;

ALTER TABLE booking_log ADD COLUMN is_one_click smallint NOT NULL DEFAULT 0;
ALTER TABLE booking_log ADD COLUMN user_ip text;

--16 Jan 2017
ALTER TABLE traveler ADD COLUMN status smallint NOT NULL DEFAULT 1;

--17 Jan 2017
ALTER TABLE booking_log ADD COLUMN ref_id character varying(200);
ALTER TABLE booking_log ADD COLUMN callback_url text;

--21 Jan 2017
insert into transfer_type (id,name) values(14,'UPI')

INSERT INTO payment_gateway(
            id, name, note, merchant_id, salt, base_url, is_active, api_url, 
            enc_key, username, password, access_code)
    VALUES (25, 'HDFCUpi test','testing credentials', 'HDFC000000000075', '', 'https://upitest.hdfcbank.com/upi', 1, '', 
            '9dcb72f13117312a3e3d03cee095994a', 'AIRTICKETS INDIA PRIVATE LIMITED', '', 12);

INSERT INTO payment_gateway(
            id, name, note, merchant_id, salt, base_url, is_active, api_url, 
            enc_key, username, password, access_code)
    VALUES (26, 'HDFCUpi production','production credentials', '', '', '', 1, '', 
            '9dcb72f13117312a3e3d03cee095994a', 'AIRTICKETS INDIA PRIVATE LIMITED', '', 12);

--25 Jan 2017
ALTER TABLE air_booking
   ADD COLUMN product_class character varying(10);

--30 fJan 2017

INSERT INTO backend(
             id,name, search,pnr_acquisition, api_source, 
            pnr_resync, pnr_cancel, pnr_list, pnr_book,pnr_load, wsdl_file,carrier_id)
    VALUES (21,'Scoot Production', '\application\components\Scoot\Utils::search', '\application\components\Scoot\Utils::aquirePnr', 
            '\application\components\Scoot\PnrManagement', '\ApiInterface::resyncPnr', '\application\components\Scoot\Utils::cancelPnr', '\application\components\Scoot\Utils::listPnr', '\application\components\Scoot\PnrManagement',
'\application\components\Scoot\PnrAcquisition' ,'production',
            446);

--31 Jan 2017
DROP TABLE booking_log_searches;
CREATE TABLE booking_log_searches
(
  id serial,
  booking_id text NOT NULL,
  search_id integer NOT NULL,
  created timestamp without time zone  DEFAULT now() NOT NULL ,
  CONSTRAINT pk_booking_searches PRIMARY KEY (id)
);

--2 Feb 2017
UPDATE payment_gateway
   SET access_code = 6012
 WHERE id = 25;

--6 Feb 2017
UPDATE payment_gateway
   SET api_url = 'https://upitest.hdfcbank.com/upi'
 WHERE id = 25;

--8 Feb 2017

UPDATE payment_gateway
   SET merchant_id = 'HDFC000000000013',note='HDFC UPI production',base_url = 'https://upi.hdfcbank.com/upi' , api_url = 'https://upi.hdfcbank.com/upi' , enc_key = '616904342b8a93d8d7713cf2758ddb9a' , username = 'AIRTICKETS INDIA PRIVATE LIMITED',access_code = 4722  
 WHERE id = 26;

UPDATE payment_gateway SET salt='98002062', merchant_id='147400022' WHERE id=9;

-- 10 Feb 2017
ALTER TABLE booking_log_searches ADD COLUMN routes_cache text;

--13 Feb 2017
INSERT INTO cc_type(name,code,validator) values ('Rupay','RU','Rupay');



