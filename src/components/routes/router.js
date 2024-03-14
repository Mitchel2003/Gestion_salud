import { Router } from 'express';
import { createTransport, getTestMessageUrl } from 'nodemailer';
const router = Router();

router.post('/send-email', async (req, res) => {//working here... api fetch javascript
    const { email } = req.body;

    contentHTML = `
        <h1>User Information</h1>
        <ul>
            <li>User Email: ${email}</li>
        </ul>
    `;

    let transporter = createTransport({
        host: 'mail.fazttech.net',
        port: 587,
        secure: false,
        auth: {
            user: 'testtwo@fazttech.net',
            pass: 'testtwocontraseña'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: '"FaztTech Server" <testtwo@fazttech.xyz>', // sender address,
        to: 'fazttech@gmail.com',
        subject: 'Website Contact Form',
        // text: 'Hello World'
        html: contentHTML
    })

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.redirect('/success.html');
});

export default router;