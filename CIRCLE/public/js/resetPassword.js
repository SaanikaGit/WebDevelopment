// import axios from 'axios';
// const crypto = require('crypto');

const resetPasswordAxios = async (resetToken, resetPass, resetPassConfirm) => {
    try {
        alert('calling axios function for reset password ...');
        // console.log(email, password);
        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:4000/api/v1/users/resetPasswordOrig/${resetToken}`,
            data: {
                password: resetPass,
                passwordConfirm: resetPassConfirm,
            },
        });
        // alert('after axios call...');
        console.log(res);
        if (res.data.status === 'success') {
            alert('Password Reset Successfully!!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        alert('error is axios call...' + err);
        res.status(401).json({
            status: 'Something went wrong',
            message: 'resetPassword->' + err,
            stack: err.stack,
        });
    }
};

document.querySelector('.resetUserPassword').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('here reset password #0');
    const resetPass = document.getElementById('resetPassword').value;
    const resetPassConfirm = document.getElementById(
        'resetPasswordConfirm'
    ).value;
    alert('passwd [' + resetPass + '][' + resetPassConfirm + ']');
    const userToken = document.getElementById('userToken').innerHTML;
    alert('from PUG  token [' + userToken + ']');
    resetPasswordAxios(userToken, resetPass, resetPassConfirm);
});
