document.addEventListener('DOMContentLoaded', ()=>{
    var TOTALLCOST = 0;

    fetch('/getMyData')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('main_orders_personal_name').innerHTML = `ФИО: ${data.last_name} ${data.first_name} ${data.patronymic}`;
        document.getElementById('main_orders_personal_email').innerHTML = `ПОЧТА: ${data.email}`;

        document.getElementById('main_orders_personal_serdoc').innerHTML = `СЕРИЯ: ${data.ser_doc}`;
        document.getElementById('main_orders_personal_numdoc').innerHTML = `НОМЕР: ${data.num_doc}`;
    });

    fetch('/getBasket')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('tbody');
        data.forEach(item => {
            const row = document.createElement('tr');

            const routeCell = document.createElement('td');
            routeCell.textContent = item[0].id_route;
            row.appendChild(routeCell);

            const fromCell = document.createElement('td');
            fromCell.textContent = item[0].t_from;
            row.appendChild(fromCell);

            const toCell = document.createElement('td');
            toCell.textContent = item[0].t_to;
            row.appendChild(toCell);

            const trainCell = document.createElement('td');
            trainCell.textContent = item[0].id_train;
            row.appendChild(trainCell);

            const carCell = document.createElement('td');
            carCell.textContent = item[0].id_car;
            row.appendChild(carCell);

            const placeCell = document.createElement('td');
            placeCell.textContent = item[0].id_place;
            row.appendChild(placeCell);
            
            TOTALLCOST += parseInt(item[0].cost_place);
            tbody.appendChild(row);
        });

        document.getElementById('totCost').innerHTML = `Общая стоимость заказа: ${TOTALLCOST}`;
    });


    document.getElementById('buy').addEventListener('click', ()=>{
        fetch('/buy', {
            method: 'GET'
        })
        .then(response => {
            if (response.ok) {
                alert('Заказ успешно добавлен!');
                window.location.href = '/index.html';
            } else {
                alert('Произошла ошибка при добавлении заказа.');
            }
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса:', error);
        });
    });
});