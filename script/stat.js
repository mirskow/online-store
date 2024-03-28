document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('getStat').addEventListener('click', ()=> {
        const date= document.getElementById('reportday').value; // Ваш параметр
        fetch(`/getStat?date=${date}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            let totall_visits = 0;
            let count_new = 0;
            const count_visit = [];
            const totall_cash = [];
            const avgCost = [];
            const countSale = [];
            const dates = [];

            data.forEach(element => {
                totall_visits += element.visit_count;
                count_visit.push(element.visit_count);
                count_new += element.new_user_count;
                dates.push(new Date(element.date_report).toLocaleDateString('en-GB'));
                totall_cash.push(element.totall_cash);
                avgCost.push(element.avg_bill);
                countSale.push(element.sale_ticker);
            });

            createUserGraph(totall_visits, count_new);
            createConversionGraph(dates, countSale, count_visit);
            createSaleGraph(dates, totall_cash, avgCost);
        });

        getTimeSpent(date);
    })
});

function getTimeSpent(date) {
    fetch(`/getTimeStat?date=${date}`, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        const dates = []
        const pages = []
        const timespents = []
        data.forEach(item => {
            dates.push(item.visit_date);
            pages.push(item.name_page);
            timespents.push((item.time_spent) / 60000);
        });

        createTimeGraph(dates, pages, timespents);
    });
};

function createTimeGraph(dates, pages, timespents) {
    console.log(dates);
    const ctx = document.getElementById('timeGraph').getContext('2d');
    
    // Преобразование даты в строковый формат (YYYY-MM-DD)
    const formattedDates = dates.map(date => formatDate(date));
    
    // Группируем данные по страницам
    const dataByPage = {};
    pages.forEach((page, index) => {
        if (!dataByPage[page]) {
            dataByPage[page] = [];
        }
        dataByPage[page].push({
            date: formattedDates[index], // Используем преобразованные даты
            time: timespents[index]
        });
    });
    
    // Создаем массив цветов для линий на графике
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow'];
    // Создаем набор данных для графика
    const datasets = [];
    let i = 0;
    for (const page in dataByPage) {
        const data = dataByPage[page].map(entry => ({
            x: entry.date,
            y: entry.time
        }));

        datasets.push({
            label: page,
            data: data,
            borderColor: colors[i % colors.length], // Выбираем цвет линии из массива
            fill: false
        });

        i++;
    }

    console.log(datasets);

    // Создаем график с использованием Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Проведенное время на страницах',
                    font: {
                        size: 16
                    }
                }
            },
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Дата'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Проведенное время (Минуты)'
                    }
                }
            }
        }
    });
}

function formatDate(dateString) {
    return dateString.split('T')[0];
}

function createUserGraph(visit_count, new_user_count) {
    const userGraphCanvas = document.getElementById('userGraph');
    
    const ctx = userGraphCanvas.getContext('2d');

    const data = {
        labels: ['Старые', 'Новые'],
        datasets: [{
            label: 'Статистика по пользователям',
            data: [visit_count - new_user_count, new_user_count],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
            hoverOffset: 4
        }]
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Статистика по пользователям',
                font: {
                    size: 16
                }
            }
        }
    };

    window.userGraph = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
};

function createSaleGraph(dates, sales, avgs){
    const ctx = document.getElementById('saleGraph').getContext('2d');
    
    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Выручка',
                data: sales,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Средний чек',
                data: avgs,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };
    
    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Статистика продаж',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
};

function createConversionGraph(dates, sales, visits){
    const ctx = document.getElementById('conversionGraph').getContext('2d');
    
    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Посетили',
                data: visits,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Продано',
                data: sales,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };
    
    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Конверсия',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
};

