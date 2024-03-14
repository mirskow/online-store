--select * from trips

-- получение каталога
--select s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
--from station as s1, station as s2, trips as tr, routes as r
--where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e


-- получение информации о поездке
--select trains.id_train, tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
--            from station as s1, station as s2, trips as tr, routes as r, trains
--            where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e and r.train_id = trains.id_train and tr.id_trip = 2    


-- insert into cars values(5, 'плацкарт', 1, 100)

--select cars.id_car, cars.type_car
--from trains, cars, routes
--where routes.id_route = 1 and routes.train_id = trains.id_train and trains.id_train = cars.train_id

--select places.id_place, places.cost_place
--from places, cars
--where places.car_id = cars.id_car and cars.id_car = 1

--insert into places values(3, 1, 1000)

--select cars.id_car
--from trains, cars, routes
--where routes.train_id = trains.id_train and trains.id_train = 1 and trains.id_train = cars.train_id and cars.type_car = 'купе'


--для корзины
--select r.id_route, trains.id_train, cars.id_car, places.id_place, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
--from station as s1, station as s2, trips as tr, routes as r, trains, places, cars
--where r.id_route = 1 and r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e and r.train_id = trains.id_train
--	and trains.id_train = cars.train_id and cars.id_car = 1 and places.car_id = cars.id_car and places.id_place = 3

--insert into orders values(1, '2024-03-13', 1, 1000, 'оформлено', null)
--insert into tickets values(1, 3, 1, 1)

select orders.id_order, tickets.id_ticket, orders.date_order, s_to.town as town_s, s_from.town as town_e
from station as s_to, station as s_from, orders, routes, clients, tickets, trips
where clients.id_client = 1 and clients.id_client = orders.client_id and orders.id_order = tickets.order_id and tickets.route_id = routes.id_route
	and routes.trip_id = trips.id_trip and trips.station_s = s_from.id_station and trips.station_e = s_to.id_station


--insert into clients values (1, 'Вадим', 'Мирсков', 'Витальевич', 'v.mir.207@gmail.com', '+79011201314', '1314', '123765', 'м', 'vadim2002', 1)

--insert into station (name_station, town) 
--values ('Полярная', 'Мурманск')
--select*
--from trips

--insert into trips (station_s, station_e, distance, duration) 
--values(6, 10, 2000, '21:53:10')

--insert into trains (type_train, comment_train) 
--values('Скоростной', 'Поезд пригородный')

--select *
--from routes

--insert into routes (trip_id, train_id, data_s, time_s, data_e, time_e) 
--values(12, 5, '2024-03-18', '19:00:00', '2024-03-19', '16:00:00')

--insert into cars (type_car, train_id, count_place) 
--values('плацкарт', 5, 90)
--select *
--from cars

--insert into places (car_id, cost_place) values(34, 2800)

select trips.distance
from clients, orders, tickets, routes, trips
where clients.id_client = orders.client_id and orders.id_order = tickets.order_id and tickets.route_id = routes.id_route and
routes.trip_id = trips.id_trip