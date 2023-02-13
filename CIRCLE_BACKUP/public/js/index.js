import '@babel/polyfill';
import { login } from './login';
import { signUp } from './signup';

// Create Dom Elements 
const loginForm = document.querySelector('.form');
const signUpForm = document.querySelector('.signUp');


if ( loginForm)
    loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
});

if ( signUpForm)
    signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const passwordConfirm = document.getElementById('signUpPasswordConfirm').value;
    signUp(name, email, password, passwordConfirm);
});

