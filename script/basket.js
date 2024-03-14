var TOTALLCOST = 0.0;

document.addEventListener('DOMContentLoaded', () => {
    const items = document.getElementById('basket');

    fetch('/getBasket')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(element => {
            const item = document.createElement('div');
            item.classList.add('main_basket_items_item');

            const img = document.createElement('img');
            img.classList.add("main_basket_items_item_photo");
            img.src = `/${element[0].t_to.toLowerCase()}.jpg`;

            const description = document.createElement('div');
            description.classList.add('main_basket_items_item_description');
            description.innerHTML = `
            Рейс № ${element[0].id_route} отправляется поездом № ${element[0].id_train} из ${element[0].t_from} в ${element[0].t_to} 
            ${element[0].data_s} в ${element[0].time_s}
            `;
            
            const cost = document.createElement('div');
            cost.classList.add('main_basket_items_item_cost');
            cost.innerHTML = `${element[0].cost_place} руб.`;
            TOTALLCOST += parseInt(element[0].cost_place);

            const but = document.createElement('button');
            but.classList.add('main_basket_items_item_button');
            but.innerHTML = `Удалить`;
            but.addEventListener('click', () => {
                item.parentNode.removeChild(item);
                fetch(`/card/remove/${element[0].id_route}`, {
                    method: 'DELETE'
                })
                .then(response => {
                  if (response.ok) {
                    console.log('удалили товар');
                    TOTALLCOST -= parseInt(element[0].cost_place);
                    document.getElementById('totCost').innerHTML = `${TOTALLCOST} руб.`;
                  } else {
                    throw new Error('Ошибка при удалении элемента из корзины');
                  }
                })
                .then(data => {
                  
                });
            });

            items.appendChild(item);

            item.appendChild(img);
            item.appendChild(description);
            item.appendChild(cost);
            item.appendChild(but);
        });

        document.getElementById('totCost').innerHTML = `${TOTALLCOST} руб.`;
    });


    document.getElementById('pull').addEventListener('click', ()=>{
        fetch('/checkAutorization')
        .then(response => {
          if (response.redirected) {
            window.location.href = response.url;
          } else {
            return response.json();
          }
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    });






    
});