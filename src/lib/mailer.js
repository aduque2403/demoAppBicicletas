const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'invbici@gmail.com',
        pass: 'qbosvqywfsmktnbq',
    },

});

transporter.verify().then(() => {
    console.log('Ready for send emails');
})