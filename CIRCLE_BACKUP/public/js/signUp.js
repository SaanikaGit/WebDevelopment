// import axios from 'axios';

// export const signUp = async (name, email, password, passwordConfirm) => {
const signUp = async (name, email, password, passwordConfirm) => {
    try {
        // console.log(email, password);
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
            },
        });

        console.log(res);
        if (res.data.status === 'success') {
            alert('Logged in Successfully!!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
};

document.querySelector('.signUp').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const passwordConfirm = document.getElementById('signUpPasswordConfirm').value;
    signUp(name, email, password, passwordConfirm);
});
