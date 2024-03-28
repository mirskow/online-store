// Функция для получения значения куки по имени
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
  fetch('/', {
    method: 'GET'
  });

  // Получение всех кук
  const allCookies = decodeURIComponent(document.cookie);
  console.log(allCookies);

  document.getElementById('catalog').addEventListener('click', ()=>{
    window.location.href = '/catalog.html';
  });

  document.getElementById('stat').addEventListener('click', ()=>{
    window.location.href = '/stat.html';
  });

    // Получение значения куки
    const cookieValue = getCookie('username');

    // Проверка наличия значения куки
    if (cookieValue) {
        // Добавление значения куки в элемент с id "title"
        document.getElementById('title').innerHTML = `Добро пожаловать, ${decodeURIComponent(cookieValue)}`;
    } else {
        // Если куки "username" отсутствуют, выводим сообщение об ошибке
        console.error('Куки "username" не найдены');
    }

  document.getElementById('account').addEventListener('click', ()=>{
    fetch('/autorisation')
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



