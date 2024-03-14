
var ROUTEID = '';
var TRAINID = '';
var CAR = '';
var PLACE = '';
var COST = '';

function toggleColor(parent, element) {
    const isSelected = element.classList.contains(`${parent} block_selected`);
    document.querySelectorAll(parent).forEach(function(el) {
        el.classList.remove('block_selected');
    });
    if (!isSelected) {
        element.classList.add('block_selected');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const productDiv = document.getElementById('product');
    const params = new URLSearchParams(window.location.search);
    const routeId = params.get('id_trip');
    console.log(routeId);
    

    fetch(`/getProduct?id_trip=${routeId}`)
    .then(response => response.json())
    .then( data => {
        loadInfo(data, productDiv);
    });


    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxes.forEach((otherCheckbox) => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
                const typecar = checkbox.value;
                fetch(`/getCars?typecar=${typecar}&train=${TRAINID}&route=${ROUTEID}`)
                .then(response => response.json())
                .then( data => {
                    const carsDiv = document.getElementById('cars');
                    const placesDiv = document.getElementById('places');
                    carsDiv.innerHTML = ``;
                    placesDiv.innerHTML = ``;
                    CAR = '';
                    PLACE = '';
                    COST = '';

                    const title = document.createElement('div');
                    title.classList.add('main_product_cars_car_title');
                    title.innerHTML = 'Выберите вагон:';
                    carsDiv.appendChild(title);

                    data.forEach(item => {
                        const car = document.createElement('div');
                        car.classList.add('main_product_cars_car_block');
                        car.innerHTML = `${item.id_car}`;
                        car.addEventListener('click', function() {
                            toggleColor('.main_product_cars_car_block', this);
                            CAR = item.id_car;
                            fetch(`/getPlaces?id_car=${item.id_car}`)
                            .then(response => response.json())
                            .then(data => {
                                placesDiv.innerHTML = ``;
                                const title = document.createElement('div');
                                title.classList.add('main_product_cars_place_title');
                                title.innerHTML = 'Выберите место:';
                                placesDiv.appendChild(title);
                                data.forEach(item => {
                                    const place = document.createElement('div');
                                    place.classList.add('main_product_cars_place_places_block');
                                    place.innerHTML = `${item.id_place}`;
                                    
                                    placesDiv.appendChild(place);
                                    place.addEventListener('click', function() {
                                        toggleColor('.main_product_cars_place_places_block', this);
                                        PLACE = item.id_place;
                                        COST = item.cost_place;
                                        document.getElementById('addToBasket').innerHTML = `Добавить в корзину (${COST}) руб.`;
                                    });
                                })
                            });
                        });
                        carsDiv.appendChild(car);
                    })
                });
            }
        });
    });


    document.getElementById('addToBasket').addEventListener('click', function() {
        console.log('add basket');
        if (TRAINID !== '' && ROUTEID !== '' && CAR !== '' && PLACE !== '' && COST !== '') {
            const newItem = {
                'train': TRAINID,
                'route': ROUTEID,
                'car': CAR,
                'place': PLACE,
                'cost': COST
            }
            fetch('/card/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
        } else {
            alert('Перед добавлением выберите номер вагона и места');
        }
    });
});


function loadInfo(items, productDiv){
    // Создаем блок для точки отправления (откуда)
    const item = items[0];
    const route = document.getElementById('id_route');
    route.innerHTML = `Рейс № ${item.id_route}`;
    ROUTEID = item.id_route;
    const train = document.getElementById('id_train');
    TRAINID = item.id_train;
    train.innerHTML = `Поезд № ${item.id_train}`;

    const fromDiv = document.createElement('div');
    fromDiv.classList.add('main_product_info_block');
    fromDiv.innerHTML = `
        <div class="main_product_info_block_title">
            Точка А
        </div>
        <hr>
        <div class="main_product_info_block_img">
            <img src="/${item.t_from.toLowerCase()}.jpg" alt="${item.t_from}">
        </div>
        <div class="main_product_info_block_info">
            ${item.t_from}
        </div>
        <div class="main_product_info_block_info">
            ${item.s_from}
        </div>
        <div class="main_product_info_block_info">
            Отправление: ${item.time_s}
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
            <img src="/${item.t_to.toLowerCase()}.jpg" alt="${item.t_to}">
        </div>
        <div class="main_product_info_block_info">
            ${item.t_to}
        </div>
        <div class="main_product_info_block_info">
            ${item.s_to}
        </div>
        <div class="main_product_info_block_info">
            Прибытие: ${item.time_e}
        </div>
    `;

    // Добавляем созданные блоки в блок #product
    productDiv.appendChild(fromDiv);
    productDiv.appendChild(toDiv);
};