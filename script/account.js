document.addEventListener('DOMContentLoaded', () => {
    fetch('/getMyData')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const specifiedDate = new Date(data.account_date);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - specifiedDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        console.log('Количество дней:', daysDifference);
        document.getElementById('main_account_name').innerHTML = `${data.last_name} ${data.first_name} ${data.patronymic}`;
        document.getElementById('main_account_email').innerHTML = `${data.email}`;
        document.getElementById('main_account_phone').innerHTML = `${data.phone}`;
        document.getElementById('main_account_sex').innerHTML = `Пол: ${data.sex}`;
        document.getElementById("main_account_date").innerHTML = `Дата регистрации: ${specifiedDate.getFullYear()}-${String(specifiedDate.getMonth() + 1).padStart(2, '0')}-${String(specifiedDate.getDate()).padStart(2, '0')}`;
        document.getElementById("main_account_day").innerHTML = `Вы с нами уже ${daysDifference} д.`;
        document.getElementById("main_account_distance").innerHTML = `Всего проехали: ... км.`;
        document.getElementById("main_account_bonus").innerHTML = `Ваша скидка - ${data.proc} %`;
    });

    fetch('/getMyOrders')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('tbody');
        let totalDistance = 0;
        data.forEach(item => {
            const row = document.createElement('tr');

            const orderIdCell = document.createElement('td');
            orderIdCell.textContent = item.id_order;
            row.appendChild(orderIdCell);
        
            const orderDateCell = document.createElement('td');
            orderDateCell.textContent = item.date_order;
            row.appendChild(orderDateCell);
        
            const ticketIdCell = document.createElement('td');
            ticketIdCell.textContent = item.id_ticket;
            row.appendChild(ticketIdCell);

            const toCell = document.createElement('td');
            toCell.textContent = item.town_e;
            row.appendChild(toCell);
        
            const fromCell = document.createElement('td');
            fromCell.textContent = item.town_s;
            row.appendChild(fromCell);

            totalDistance += item.distance;
        
            tbody.appendChild(row);
        });
        document.getElementById("main_account_distance").innerHTML = `Всего проехали: ${totalDistance} км.`;
    });
});