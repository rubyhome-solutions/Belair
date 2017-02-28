delete from process;
delete from searches;
delete from routes_cache;
delete from fraud;
delete from amendment;
delete from deposit_search;
update air_cart set payment_id=null;
delete from payment;
delete from pay_gate_log;
delete from air_routes;
delete from air_booking;
delete from aircart_file;
delete from air_cart;

delete from ff_settings;
delete from preferences;
delete from visa;
delete from traveler_file;
delete from tour_code;
delete from traveler;

delete from credit_request;
delete from log;

-- delete from user_file;
-- delete from users where id not in (select users.id from users JOIN user_info on users.user_info_id=user_info.id where user_info.user_type_id<>1); -- 1 is super user

delete from sub_users;
delete from permission_x_user;
delete from users where id not in (1, 10, 6321, 6328, 6406, 14);

delete from cc;
delete from cc_passtru;
delete from pf_code;
delete from promo_codes;
delete from user_info where id not in (select user_info_id from users);
