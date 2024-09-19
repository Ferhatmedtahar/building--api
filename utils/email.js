const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user,url)
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `ferhat mohamed <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }
  // this one is the broader  email
  async send(template, subject) {
    //send the actual email
    //1)render the HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );
    const text = htmlToText.convert(html);
    //2) Define emailOptions

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
      html,
    };

    //3) create a transport and send an email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family !');
  }
  // await this.send('PUG_FILE_NAME', 'subject');

  async sendResetPassword() {
    await this.send(
      'password',
      'Your Password Reset Token (valid for only 10 minutes)',
    );
  }
};

// const sendEmail = async (options) => {
//   //1 create transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   //2 define email options

//   const mailOptions = {
//     from: 'ferhat mohamed <ferhattaher00@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//   //3 send email with node mailer

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
