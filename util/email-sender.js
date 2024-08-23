const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lorenzo11@ethereal.email',
        pass: 'EwDyS7wgfW1ez7MtxH'
    }
});

exports.sendEmailToEmployee = (email, password, username) => {
    transporter.sendMail({
        from: '<sender@example.com>',
        to: email,
        subject: 'Employee management - Generated Password',
        text: 'Here is your system generated password , try to login with this password',
        html: `<b>PASSWORD : </b>${password} <br> USERNAME : ${username}`
    }, (err, info) => {
        if (err) {
            console.error('Error occurred while sending email', err.message);
            return;
        }
    
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}


