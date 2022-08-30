// import axios from 'axios';

// export const login = async (email, password) => {

const login = async (email, password) => {
    try {
        // console.log(email, password);
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            alert('Logged in Successfully!!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        // console.log(err);
        alert(err.response.data.message);
    }
};

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
});
