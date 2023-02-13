// import axios from 'axios';

const changePasswordOld = async (name, email, curPass, newPass, newPassConfirm) => {
    try {
        // console.log(email, password);
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/updateMyPassword',
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

const togglePasswd =     async() => {
    alert('toggle password')
}

const changePasswordAxios = async (name, email, curPass, newPass, newPassConfirm) => {
    try {
        alert( 'calling axios function...')
        // console.log(email, password);
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4000/api/v1/users/updateMyPassword',
            data: {
                name,
                email,
                curPass,
                newPass,
                newPassConfirm,
            },
        });

        console.log(res);
        if (res.data.status === 'success') {
            alert('Password Changed Successfully!!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
};

const changePassword = async (name, email, curPass, newPass, newPassConfirm) => {
    try {
        console.log('updatePassword Called');
        alert('updatePassword Called');
        // Validate User
        // Done in alildateToken middleware, that is called before current function...
        const user = await User.findById(name).select('+password');
        console.log({ user });

        // Validate current password
        if (
            !curPass ||
            !(await user.passowrdMatches(curPass, user.password))
        ) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Incorrect Password given',
            });
        }

        console.log('curr password OK...');
        // update password
        user.password = newPass;
        user.passwordConfirm = newPassConfirm;
        user.passwordChangedAt = Date.now();

        await user.save();

        // 4)Login user and send JWT
        // createTokenSendJwt(user, 200, res);
    } catch (err) {
        res.status(401).json({
            status: 'Something went wrong',
            message: 'updatePassword->' + err,
            stack: err.stack,
        });
    }
};


document.querySelector('.meSettingsChgPasswd').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('here');
    const curpass = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const newPassConfirm = document.getElementById('newPasswordConfirm').value;
    alert('passwd [' + curpass + '][' + newPass + '][' + newPassConfirm + ']');
    const myName = document.getElementById('myName').innerHTML;
    alert('from PUG  Name [' + myName + ']' );
    const myEmail = document.getElementById('myEmail').innerHTML;
    alert('from PUG email [' + myEmail + ']' );
    changePasswordAxios(myName, myEmail, curpass, newPass, newPassConfirm);
});

document.querySelector('.showPasswd').addEventListener('submit', (e) => {
    e.preventDefault();
    // alert('Show Passwd');
    var x = document.getElementById("oldPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    var y = document.getElementById("newPassword");
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
    var z = document.getElementById("newPasswordConfirm");
    if (z.type === "password") {
      z.type = "text";
    } else {
      z.type = "password";
    }
});
