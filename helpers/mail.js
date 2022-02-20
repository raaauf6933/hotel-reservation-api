const mailer = require("nodemailer");
const { htmlTemplate } = require("./emailTemplate");

const sendEmail = ({ guest, booking_reference, ...rest }, body) => {
  const { email } = guest;

  const smtpTransport = mailer.createTransport({
    // host: "smtp.mailtrap.io",
    // port: 2525,
    // auth: {
    //   user: "efe49df51426a0",
    //   pass: "68bb431bd5c235",
    // },
    service: "gmail",
    auth: {
      user: "kellinquinn180@gmail.com",
      pass: "@@Ra0302aO",
    },
  });

  var mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",

    html: htmlTemplate({ ...guest, booking_reference, ...rest }),
  };

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info.response);
      }
    });
  });
};

module.exports = sendEmail;
