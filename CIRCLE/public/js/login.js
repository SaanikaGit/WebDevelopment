/* eslint-disable */

const login = (email, password) => {
    alert(email, password);
};

document.querySelector('.loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
});
