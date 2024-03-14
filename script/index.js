document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById('catalog').addEventListener('click', ()=>{
        window.location.href = '/catalog.html';
    });

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

