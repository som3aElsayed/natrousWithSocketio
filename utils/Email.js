const nodemailer = require("nodemailer");
class Email {
  constructor(user, message) {
    this.to = user.email;
    this.from = `Ismail Elsayed <${process.env.Email_Sender}>`;
    this.subject = message;
  }
  transport() {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }
  async send(text) {
    const mailOption = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      text,
    };
    this.transport().sendMail(mailOption, (error, info) => {
      if (error) return console.log(error.message);
      console.log("Message sent: %s", info.messageId);
    });
  }
  sendWelcome() {
    this.send(
      " Welcome to Natours, we're glad to have you 🎉🙏, \n If you need any help with booking your next tour, please don't hesitate to contact us!"
    );
  }
  sendResetPassword(text) {
    this.send(
      `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:  ${text} `
    );
  }
}
module.exports = Email;
