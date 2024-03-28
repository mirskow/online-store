var startTime;
var timerInterval;

function getCookie(name) {
    const cookieString = decodeURIComponent(document.cookie);
    console.log(cookieString);
    const cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
  }

document.addEventListener("DOMContentLoaded", ()=>{
    // Добавляем обработчик события на закрытие или обновление страницы
    window.addEventListener("beforeunload", function(event) {
        const currentTime = new Date().getTime();
        const timeOnSiteCookie = parseInt(getCookie('timeOnPage')); // Предполагается, что у вас есть функция getCookie для получения кукисов
        const timeSpent = parseInt(currentTime - timeOnSiteCookie);
        const currentPageUrl = window.location.href;
        const visitDate = (getCookie('visitDate')); 
        fetch('/updateVisits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPageUrl, timeSpent, visitDate })
        });
    });

});



