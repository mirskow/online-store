CREATE TABLE IF NOT EXISTS public.bonus_cards
(
    id_card integer NOT NULL DEFAULT nextval('bonus_cards_id_card_seq'::regclass),
    proc integer,
    CONSTRAINT bonus_cards_pkey PRIMARY KEY (id_card)
)

CREATE TABLE IF NOT EXISTS public.cars
(
    id_car integer NOT NULL DEFAULT nextval('cars_id_car_seq'::regclass),
    type_car character varying(50) COLLATE pg_catalog."default",
    train_id integer,
    count_place integer,
    CONSTRAINT cars_pkey PRIMARY KEY (id_car),
    CONSTRAINT cars_train_id_fkey FOREIGN KEY (train_id)
        REFERENCES public.trains (id_train) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.clients
(
    id_client integer NOT NULL DEFAULT nextval('clients_id_client_seq'::regclass),
    first_name character varying(50) COLLATE pg_catalog."default",
    last_name character varying(50) COLLATE pg_catalog."default",
    patronymic character varying(50) COLLATE pg_catalog."default",
    email character varying(50) COLLATE pg_catalog."default",
    phone character varying(50) COLLATE pg_catalog."default",
    ser_doc character varying(10) COLLATE pg_catalog."default",
    num_doc character varying(10) COLLATE pg_catalog."default",
    sex character varying(1) COLLATE pg_catalog."default",
    hash_pass character varying(100) COLLATE pg_catalog."default",
    card_id integer,
    account_date date,
    CONSTRAINT clients_pkey PRIMARY KEY (id_client),
    CONSTRAINT clients_email_key UNIQUE (email),
    CONSTRAINT clients_phone_key UNIQUE (phone),
    CONSTRAINT clients_card_id_fkey FOREIGN KEY (card_id)
        REFERENCES public.bonus_cards (id_card) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.orders
(
    id_order integer NOT NULL DEFAULT nextval('orders_id_order_seq'::regclass),
    date_order date,
    client_id integer,
    cost_order numeric,
    status_order character varying(50) COLLATE pg_catalog."default",
    payment_id integer,
    CONSTRAINT orders_pkey PRIMARY KEY (id_order),
    CONSTRAINT orders_client_id_fkey FOREIGN KEY (client_id)
        REFERENCES public.clients (id_client) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT orders_payment_id_fkey FOREIGN KEY (payment_id)
        REFERENCES public.payments (id_payment) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.payments
(
    id_payment integer NOT NULL DEFAULT nextval('payments_id_payment_seq'::regclass),
    type_payment character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT payments_pkey PRIMARY KEY (id_payment)
)

CREATE TABLE IF NOT EXISTS public.places
(
    id_place integer NOT NULL DEFAULT nextval('places_id_place_seq'::regclass),
    car_id integer,
    cost_place numeric,
    CONSTRAINT places_pkey PRIMARY KEY (id_place),
    CONSTRAINT places_car_id_fkey FOREIGN KEY (car_id)
        REFERENCES public.cars (id_car) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.routes
(
    id_route integer NOT NULL DEFAULT nextval('routes_id_route_seq'::regclass),
    trip_id integer,
    train_id integer,
    data_s date,
    time_s time without time zone,
    data_e date,
    time_e time without time zone,
    CONSTRAINT routes_pkey PRIMARY KEY (id_route),
    CONSTRAINT routes_train_id_fkey FOREIGN KEY (train_id)
        REFERENCES public.trains (id_train) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT routes_trip_id_fkey FOREIGN KEY (trip_id)
        REFERENCES public.trips (id_trip) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.station
(
    id_station integer NOT NULL DEFAULT nextval('station_id_station_seq'::regclass),
    name_station character varying(50) COLLATE pg_catalog."default",
    town character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT station_pkey PRIMARY KEY (id_station)
)

CREATE TABLE IF NOT EXISTS public.tickets
(
    id_ticket integer NOT NULL DEFAULT nextval('tickets_id_ticket_seq'::regclass),
    place_id integer,
    order_id integer,
    route_id integer,
    CONSTRAINT tickets_pkey PRIMARY KEY (id_ticket),
    CONSTRAINT tickets_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.orders (id_order) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tickets_place_id_fkey FOREIGN KEY (place_id)
        REFERENCES public.places (id_place) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tickets_route_id_fkey FOREIGN KEY (route_id)
        REFERENCES public.routes (id_route) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.trains
(
    id_train integer NOT NULL DEFAULT nextval('trains_id_train_seq'::regclass),
    type_train character varying(50) COLLATE pg_catalog."default",
    comment_train character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT trains_pkey PRIMARY KEY (id_train)
)

CREATE TABLE IF NOT EXISTS public.trips
(
    id_trip integer NOT NULL DEFAULT nextval('trips_id_trip_seq'::regclass),
    station_s integer,
    station_e integer,
    distance integer,
    duration time without time zone,
    CONSTRAINT trips_pkey PRIMARY KEY (id_trip),
    CONSTRAINT trips_station_e_fkey FOREIGN KEY (station_e)
        REFERENCES public.station (id_station) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT trips_station_s_fkey FOREIGN KEY (station_s)
        REFERENCES public.station (id_station) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

































