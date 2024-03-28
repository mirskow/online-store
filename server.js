const express = require('express'),
    app = express(),
    session = require('express-session'),
    { Pool } = require('pg');
    fs = require('fs');
    cookieParser = require('cookie-parser');
    nodemailer = require('nodemailer');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: '',
    password: '',
    port: 5432,
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: 'ogwy iszk dzyg tqgg'
    }
});

const host = 'localhost';
const port = 8800;

var totallCost = 0;

app.use(express.static(__dirname + "/templates/"));
app.use(express.static(__dirname + "/style/"));
app.use(express.static(__dirname + "/script/"));
app.use(express.static(__dirname + "/img/"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

app.use(cookieParser());

app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const logData = `IP: ${ip} - - ${new Date().toISOString()} - ${req.method} ${req.url},\n Browser: ${userAgent}\n\n`;
    fs.appendFile('access.log', logData, (err) => {
        if (err) {
            console.error('Ошибка при записи в лог-файл:', err);
        }
    });
    next();
});

app.use((req, res, next) => {
    const currentTime = new Date().getTime();
    // Обновляем куки с временем нахождения на сайте
    try {
        const cookieOptions = {
            maxAge: 900000, // 15 минут
            httpOnly: false
        };

        // Устанавливаем куки с временем нахождения на странице и датой посещения
        res.cookie('timeOnPage', currentTime, cookieOptions);
        res.cookie('visitDate', new Date().toISOString(), cookieOptions);
    } catch (err) {
        console.error('Error executing query', err);
    }
    next();
});

async function addVisit(pageId, userId, visitDate, timeSpent){
    try {
        console.log(visitDate);
        const client = await pool.connect();
        const visitQuery = `
            INSERT INTO Visits (page_id, client_id, visit_date, time_spent)
            VALUES ($1, $2, $3, $4)
        `;
        await client.query(visitQuery, [pageId, userId, visitDate, timeSpent]);

        // Обновляем last_visit и total_time для данного пользователя
        const updateQuery = `
            UPDATE Statistics_Users
            SET last_visit = $1, total_time = total_time + $2
            WHERE user_id = $3
        `;
        await client.query(updateQuery, [visitDate, timeSpent, userId]);

        client.release();
    } catch (error) {
        console.error('Error executing query:', error);
    }
}

async function getPage(path){
    try {
        const client = await pool.connect();
        const pageQuery = `
            SELECT id_page FROM Pages WHERE path_page = $1
        `;
        const pageResult = await client.query(pageQuery, [path]);
        if (pageResult.rows.length > 0) {
            const page = pageResult.rows[0].id_page;
            console.log(page);
            return page;
        } else {
            console.log('Страница не найдена в базе данных');
        }
        client.release();
    } catch (error) {
        console.error('Error executing query:', error);
    }
}

app.post('/updateVisits', async(req, res)=>{
    const { timeSpent, currentPageUrl, visitDate } = req.body;
    console.log('Время, проведенное на сайте:', timeSpent, visitDate);
    console.log('Текущая страница:', currentPageUrl);

    const path = currentPageUrl.split('/').pop();
    const page = await getPage(path);

    if(req.session.user){
        addVisit(page, req.session.user.id_client, visitDate, timeSpent);
    }
    else
    {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const logData = `IP: ${ip} -- / ${visitDate} / pages - ${currentPageUrl}, time - ${timeSpent} \n Browser: ${userAgent}\n\n`;
        fs.appendFile('visits.log', logData, (err) => {
            if (err) {
                console.error('Ошибка при записи в лог-файл:', err);
            }
        });
    }

    res.sendStatus(200);
});

app.get('/logout', (req, res) => {
    delete req.session.user;
    res.clearCookie('username');
    res.redirect('/index.html');
});

app.get('/getItems', async (_, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`
            select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
            from station as s1, station as s2, trips as tr, routes as r
            where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e      
      `);
      const data = result.rows;
      client.release();
      res.json(data);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/filter', async (req, res) => {
    try {
        const from = req.query.from;
        const to = req.query.to;
        const date = req.query.date_s;
        const client = await pool.connect();
        let result;

        if(from != '' && to != '' && date != '')
        {
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e 
                    and s1.town = '${from}' and s2.town = '${to}' and r.data_s = '${date}'      
            `);
        }
        else if(from != '' && to != ''){
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e
                and s1.town = '${from}' and s2.town = '${to}'     
            `);
        }
        else if(from != '' && date != ''){
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e
                and s1.town = '${from}' and r.data_s = '${date}'      
            `);
        }
        else if(date != '' && to != ''){
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e
                ands2.town = '${to}' and r.data_s = '${date}'   
            `);
        }
        else if(date != ''){
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e
                and r.data_s = '${date}'         
            `);
        }
        else if(to != ''){
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e
                and s2.town = '${to}'       
            `);
        }
        else if(from != ''){
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e
                and s1.town = '${from}'    
            `);
        }
        else{
            result = await client.query(`
                select tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
                from station as s1, station as s2, trips as tr, routes as r
                where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e      
            `);
        }
        const data = result.rows;
        client.release();
        res.json(data);

      } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
      }
});

app.get('/getProduct', async (req, res) =>{
    try {
        const id_route = parseInt(req.query.id_trip);
        const client = await pool.connect();
        const result = await client.query(`
            select r.id_route, trains.id_train, tr.id_trip, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
            from station as s1, station as s2, trips as tr, routes as r, trains
            where r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e and r.train_id = trains.id_train and tr.id_trip = $1    
        `, [id_route]);
        const data = result.rows;
        client.release();
        res.json(data);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getCars', async(req, res) => {
    try {
        const typecar = req.query.typecar;
        const train = parseInt(req.query.train);
        const route = parseInt(req.query.route);
        const client = await pool.connect();
        const result = await client.query(`
            select cars.id_car
            from trains, cars, routes
            where routes.id_route = ${route} and routes.train_id = trains.id_train and trains.id_train = ${train} and trains.id_train = cars.train_id and cars.type_car = '${typecar}'
        `)
        const data = result.rows;
        client.release();
        res.json(data);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getPlaces', async(req, res) => {
    try {
        const id_car = parseInt(req.query.id_car);
        const client = await pool.connect();
        const result = await client.query(`
            select places.id_place, places.cost_place
            from places, cars
            where places.car_id = cars.id_car and cars.id_car = '${id_car}'
        `)
        const data = result.rows;
        client.release();
        res.json(data);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/card/add', (req, res) => {
    const newItem = req.body;
    req.session.card = req.session.card || [];
    req.session.card.push(newItem);
    totallCost += newItem.cost;
    req.session.save();
});

app.delete('/card/remove/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    let filteredCard = [];
    totallCost = 0;
    for (let i = 0; i < req.session.card.length; i++) {
        let item = req.session.card[i];
        if (item.route != itemId) {
            filteredCard.push(item);
            totallCost += item.cost;
        }
    }
    req.session.card = filteredCard;
    console.log(req.session.card);
    res.status(200).end();
});

app.get('/getBasket', async (req, res) => {
    const card = req.session.card || [];
    const results = []
    for (const item of card) {
        const client = await pool.connect();
        const result = await client.query(`
        select r.id_route, trains.id_train, cars.id_car, places.id_place, places.cost_place, s1.town as t_from, s1.name_station as s_from, s2.town as t_to, s2.name_station as s_to, tr.distance, tr.duration, r.data_s, r.time_s, r.data_e, r.time_e
        from station as s1, station as s2, trips as tr, routes as r, trains, places, cars
        where r.id_route = ${parseInt(item.route)} and r.trip_id = tr.id_trip and s1.id_station = tr.station_s and s2.id_station = tr.station_e and r.train_id = trains.id_train
            and trains.id_train = cars.train_id and cars.id_car = ${parseInt(item.car)} and places.car_id = cars.id_car and places.id_place = ${parseInt(item.place)}
        `)
        results.push(result.rows);
    }
    res.json(results);
});

app.get('/autorisation', async (req, res) => {
    if (req.session.user) {
        res.redirect('/account.html');
        console.log('я есть');
    }
    else{
        res.redirect('/autorisation.html');
        console.log('меня нет');
    }
});

app.post('/autorisation', async (req, res) => {
    try {
        const { email, password } = req.body;
        const client = await pool.connect();
        const result = await client.query(`
            select *
            from clients, bonus_cards
            where clients.email = '${email}' and clients.id_client = bonus_cards.id_card
        `)
        const data = result.rows;
        if (data.length == 1) {
            req.session.user = data[0];
            req.session.save();
            const name = data[0].first_name;
            res.cookie('username', name, { maxAge: 900000, httpOnly: false });
            res.json(data);
        } else {
            res.status(500).json({ error: 'No data found' });
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getMyOrders', async(req, res)=>{
    try {
        const { email } = req.body;
        const client = await pool.connect();
        const result = await client.query(`
        SELECT 
            orders.id_order, 
            tickets.id_ticket, 
            orders.date_order, 
            s_to.town AS town_s,
            s_to.name_station as station_s, 
            s_from.town AS town_e,
            s_from.name_station as station_e,  
            trips.distance,
            tickets.place_id,
            cars.id_car,
            cars.train_id,
            routes.train_id,
            routes.id_route,
            routes.data_e,
            routes.data_s,
            routes.time_e,
            routes.time_s,
            orders.cost_order
        FROM 
            orders
        JOIN 
            clients ON clients.id_client = orders.client_id
        JOIN 
            tickets ON orders.id_order = tickets.order_id
        JOIN 
            routes ON tickets.route_id = routes.id_route
        JOIN 
            trips ON routes.trip_id = trips.id_trip
        JOIN 
            station AS s_from ON trips.station_s = s_from.id_station
        JOIN 
            station AS s_to ON trips.station_e = s_to.id_station
        JOIN 
            places ON places.id_place = tickets.place_id
        JOIN
            cars ON places.car_id = cars.id_car
        WHERE 
            clients.id_client = ${req.session.user.id_client};
        `);
        const data = result.rows;
        res.json(data);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getMyData', async(req, res)=>{
    const data = req.session.user;
    res.json(data);
});

app.get('/checkAutorization', async(req, res)=>{
    if (req.session.user) {
        res.redirect('/order.html');
    }
    else{
        res.redirect('/autorisation.html');
    }
});

app.get('/buy', async (req, res) => {
    const client = await pool.connect();

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    try {
        // Вставляем заказ и получаем его ID
        const orderResult = await client.query(
            `INSERT INTO orders (date_order, client_id, cost_order, status_order) 
            VALUES ($1, $2, $3, $4)
            RETURNING id_order;`,
            [formattedDate, parseInt(req.session.user.id_client), parseInt(totallCost), 'оформлено']
        );
        const orderId = orderResult.rows[0].id_order;

        // Вставляем билеты
        const queries = req.session.card.map(ticket => ({
            text: `INSERT INTO tickets (place_id, order_id, route_id)
                    VALUES ($1, $2, $3)
                    RETURNING id_ticket;`,
            values: [parseInt(ticket.place), orderId, parseInt(ticket.route)]
        }));

        for (const query of queries) {
            try {
                const result = await client.query(query);
                sendTicket(result.rows[0].id_ticket, req);
            } catch (error) {
                console.error('Ошибка при добавлении билета:', error);
            }
        }
        res.status(200).end();

    } catch (error) {
        console.error('Ошибка при покупке билетов:', error);
        res.status(500).send('Ошибка сервера');
    } finally {
        client.release();
    }
});

app.get('/getStat', async (req, res) => {
    try {
        const date = req.query.date;
        const client = await pool.connect();
        const result = await client.query(`
            SELECT *
            FROM ReportDays
            WHERE date_report BETWEEN '${date}'::date - INTERVAL '3 days' AND '${date}'::date
        `);
        const data = result.rows;
        res.json(data);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getTimeStat', async (req, res)=> {
    try {
        const date = req.query.date;
        console.log(date);
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                p.name_page, 
                SUM(v.time_spent) AS time_spent,
                v.visit_date
            FROM 
                Visits AS v
            JOIN 
                Pages AS p ON v.page_id = p.id_page
            WHERE 
                v.visit_date BETWEEN '${date}'::date - INTERVAL '3 days' AND '${date}'::date
            GROUP BY 
                p.name_page, 
                v.visit_date
            ORDER BY 
                v.visit_date;
        `);
        const data = result.rows;
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`);
});


function sendTicket(id, req){
    // Создайте объект с параметрами письма
    const mailOptions = {
        from: '',
        to: req.session.user.email,
        subject: 'Маршрутный билет',
        text: `Ваш билет: ${id}`
    };

    // Отправьте письмо
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Ошибка при отправке письма:', error);
        } else {
            console.log('Письмо успешно отправлено:', info.response);
        }
    });
}