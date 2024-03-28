document.addEventListener('DOMContentLoaded', ()=>{
    const params = new URLSearchParams(window.location.search);
    const itemData = Object.fromEntries(params.entries());
    const productDiv = document.getElementById('product');
    loadInfo(itemData, productDiv);
});


function loadInfo(item, productDiv){
    // Создаем блок для точки отправления (откуда)
    const route = document.getElementById('id_route');
    route.innerHTML = `Рейс № ${item.id_route}`;

    const train = document.getElementById('id_train');
    train.innerHTML = `Поезд № ${item.train_id}`;

    const orders = document.getElementById('orders');
    orders.innerHTML = `Заказ № ${item.id_order}. Дата оформления: ${item.date_order}. Стоимость - ${item.cost_order}`;

    const fromDiv = document.createElement('div');
    fromDiv.classList.add('main_product_info_block');
    fromDiv.innerHTML = `
        <div class="main_product_info_block_title">
            Точка А
        </div>
        <hr>
        <div class="main_product_info_block_img">
            <img src="/${item.town_s.toLowerCase()}.jpg" alt="${item.town_s}">
        </div>
        <div class="main_product_info_block_info">
            ${item.town_s}
        </div>
        <div class="main_product_info_block_info">
            ${item.station_s}
        </div>
        <div class="main_product_info_block_info">
            Отправление: ${item.data_s} - ${item.time_s}
        </div>
    `;

    // Создаем блок для точки назначения (куда)
    const toDiv = document.createElement('div');
    toDiv.classList.add('main_product_info_block');
    toDiv.innerHTML = `
        <div class="main_product_info_block_title">
            Точка Б
        </div>
        <hr>
        <div class="main_product_info_block_img">
            <img src="/${item.town_e.toLowerCase()}.jpg" alt="${item.town_e}">
        </div>
        <div class="main_product_info_block_info">
            ${item.town_e}
        </div>
        <div class="main_product_info_block_info">
            ${item.station_e}
        </div>
        <div class="main_product_info_block_info">
            Прибытие: ${item.data_e} - ${item.time_e}
        </div>
    `;

    const cars = document.getElementById('ticket');
    cars.innerHTML = `Билет № ${item.id_ticket} - вагон ${item.id_car} место ${item.place_id}`

    productDiv.appendChild(fromDiv);
    productDiv.appendChild(toDiv);
};