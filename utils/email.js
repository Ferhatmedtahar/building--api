const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1 create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2 define email options

  const mailOptions = {
    from: 'ferhat mohamed <ferhattaher00@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  //3 send email with node mailer

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
