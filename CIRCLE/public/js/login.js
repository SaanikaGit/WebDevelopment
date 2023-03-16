// import axios from 'axios';

// export const login = async (email, password) => {

const sendPasswordResetLink = async (email) => {
    try {
        console.log(email   );
        // alert('password reset #1[' + email + ']');
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/forgotPassword',
            data: {
                email
            },
        });

        console.log( 'email sent');
        // alert( 'password reset email sent');
        console.log(res.data);

        if (res.data.status === 'SUCCESS') {
            console.log('Password Reset email sent!!');
            alert('Password Reset email sent!!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        alert(err.response.data.status);
    }
};

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

document.querySelector('.formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  // alert('logging in from SUBMIT');
    login(email, password);
});

document.querySelector('.forgotPassword').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetPasswordFor').value;
    alert('password reset #0')
    sendPasswordResetLink(email);
});
