document.addEventListener('DOMContentLoaded', ()=>{
    fetch('/getMyOrders', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('container');
        data.forEach(item => {
            const block = document.createElement('div');
            block.classList.add("flex_block");
            block.classList.add("main_history_block");

            const block_desc = document.createElement('div');
            block_desc.classList.add("flex_block");
            block_desc.classList.add("main_history_block_desc");

            const block_but = document.createElement('div');
            block_but.classList.add("flex_block");
            block_but.classList.add("main_history_block_but");

            block_desc.innerHTML = `
                Заказ № ${item.id_order} (${item.date_order}): ${item.town_s} - ${item.town_e}
            `;
            const but = document.createElement('button');
            but.innerHTML = 'Посмотреть';
            but.addEventListener('click', () => {
                const queryString = new URLSearchParams(item).toString();
                window.location.href = `/orderinfo.html?${queryString}`;
            });

            block_but.appendChild(but);

            block.appendChild(block_desc);
            block.appendChild(block_but);

            container.appendChild(block);
        });
    });
});