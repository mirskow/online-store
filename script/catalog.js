function loadItems(data, catalogDiv)
{
    catalogDiv.innerHTML = '';
    data.forEach(item => {
        const catalogBlock = document.createElement('div');
        catalogBlock.classList.add('main_catalog_block');

        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('main_catalog_block_description');

        const fromDiv = document.createElement('div');
        fromDiv.classList.add('main_catalog_block_description_from');
        fromDiv.innerHTML = `
        <div>${item.t_from}</div>
        <div>${item.s_from}</div>
        <div>${item.data_s}</div>
        `;

        const distanceDiv = document.createElement('div');
        distanceDiv.classList.add('main_catalog_block_description_distance');
        distanceDiv.innerHTML = `<hr><div>${item.distance} км - ${item.duration}</div>`;

        const toDiv = document.createElement('div');
        toDiv.classList.add('main_catalog_block_description_to');
        toDiv.innerHTML = `
        <div>${item.t_to}</div>
        <div>${item.s_to}</div>
        <div>${item.data_e}</div>
        `;

        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('main_catalog_block_button');
        buttonDiv.innerHTML = '<button>Посмотреть</button>';
        buttonDiv.querySelector('button').addEventListener('click', function() {
            window.location.href = `/trip.html?id_trip=${item.id_trip}`;
        });

        descriptionDiv.appendChild(fromDiv);
        descriptionDiv.appendChild(distanceDiv);
        descriptionDiv.appendChild(toDiv);

        catalogBlock.appendChild(descriptionDiv);
        catalogBlock.appendChild(buttonDiv);

        catalogDiv.appendChild(catalogBlock);
    });
};



document.addEventListener('DOMContentLoaded', ()=>{
    const catalogDiv = document.getElementById('main_catalog');
    fetch('/getItems')
    .then(response => response.json())
    .then( data => {
        loadItems(data, catalogDiv);
    })

    document.getElementById('basket').addEventListener('click', ()=>{
        window.location.href = `/basket.html`;
    });

    document.getElementById('filterForm').addEventListener('submit', function(event){
        event.preventDefault();

        const catalogDiv = document.getElementById('main_catalog');
        
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const date_s = document.getElementById('date_s').value;
    
        // Формируем URL с параметрами
        const url = `/filter?from=${from}&to=${to}&date_s=${date_s}`;

        fetch(url, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            loadItems(data, catalogDiv);
        });
    });

});

