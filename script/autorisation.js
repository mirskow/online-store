document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.main_autorisation_form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const email = formData.get('mail');
        const password = formData.get('password');
        
        fetch('/autorisation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to authorize');
            }
        })
        .then(data => {
            window.location.href = '/account.html';
        })
        .catch(error => {
            console.error('Authorization failed:', error.message);
        });
    });
});