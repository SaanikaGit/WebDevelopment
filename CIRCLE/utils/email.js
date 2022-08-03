const nodemailer = require( 'nodemailer');
// const { options } = require('../routes/userRoutes');

const sendEmail = async ( options ) => {
    // 1) Create transporter ( service that actually sends email)
    // service : 'Gmail',
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user : process.env.EMAIL_USERNAME,
            pass : process.env.EMAIL_PASSWORD,
            
            // activate in gmail "less secure apps" options
            // use sendgrid / mailgun - in actual

            //for development use mailtrap. No mails are actually sent out...
        }
    })

    // 2) define email options
    const mailOptions = {
        from : 'CIRCLE Password Admin <admin@circle.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) Send email
    await transporter.sendMail(mailOptions);
    
    // 3) send email
};

module.exports = sendEmail;