// import axios from 'axios';

const resetPasswordAxios = async (resetToken, resetPass,resetPassConfirm) => {
    try {
        // 1) get user based off token
        alert( 'resetpasasword token step 0');
        const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        
        alert( 'resetpasasword token step 1');
        
        // We dont know anything about the user here, not even the email address...
        const user = await User.findOne({ passwordResetToken: hashedToken });
        
        // console.log( 'Change password for ', user)
        alert( 'resetpasasword token step 2');
        
        // 2) check if user exists and check if token is still valid
        if (!user || user.passwordResetExpires.getTime() < Date.now()) {
            return res.status(404).json({
                status: 'Invalid Token/User',
            });
        }
        alert( 'resetpasasword token step 3');
        
        // 3) update password
        user.password = resetPass;
        user.passwordConfirm = resetPassConfirm;
        user.passwordChangedAt = Date.now();
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        
        await user.save();
        alert( 'resetpasasword token step 4');
        
        // 4) send JWT
        createTokenSendJwt(user, 200, res);
    } catch (err) {
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
    const resetPassConfirm = document.getElementById('resetPasswordConfirm').value;
    alert('passwd [' + resetPass + '][' + resetPassConfirm + ']');
    const resetToken = document.getElementById('token').innerHTML;
    alert('from PUG  token [' + resetToken + ']' );
    resetPasswordAxios( resetToken, resetPass,resetPassConfirm );
});
