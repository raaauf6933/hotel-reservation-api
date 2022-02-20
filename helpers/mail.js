const mailer = require("nodemailer");
const createBookingEmail = require("./emailTemplate/createBookingEmail");

const sendEmail = (booking, body) => {
  const { guest } = booking;
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
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: "youremail@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    html: createBookingEmail(booking),
    attachments: [
      {
        filename: "check_image.png",
        path: __dirname + "/emailTemplate/check_image.png",
        cid: "logo", //same cid value as in the html img src
      },
    ],
  };

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info.response);
      }
    });
  });
};

module.exports = sendEmail;
