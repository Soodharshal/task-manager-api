const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SEND_GRID_API);

sendEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'soodharshal@gmail.com',
        subject: 'This is my first creation!',
        text: `Hi ${name}, I hope this one acctualy get to you'`
    }).then(() => {

    }).catch((e) => {
        console.log(e)
    })
}

removeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'soodharshal@gmail.com',
        subject: 'Eail Cancelation',
        text: `Hi ${name},is there anyting we can do for you`
    }).then(() => {

    }).catch((e) => {
        console.log(e)
    })
}

module.exports = {
    sendEmail, removeEmail
}