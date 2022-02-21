const mailer = require("nodemailer");
const { google } = require("googleapis");
const createBookingEmail = require("./emailTemplate/createBookingEmail");

const CLIENT_ID =
  "610872631269-un4rljklhofn6415irm5b878c52kvgrv.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04OD03jJUv2rlCgYIARAAGAQSNwF-L9Irqgfx8OWwQi4a2q8Alq08lhwmzpU7-zmiM39bJjtopudZ8qgsfZsZlIpLA1quMGVRi8A";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (booking, body) => {
  const { guest } = booking;
  const { email } = guest;

  const accessToken = await oAuth2Client.getAccessToken();

  const smtpTransport = mailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken,
    },
  });

  // const smtpTransport = mailer.createTransport({
  //   // host: "smtp.mailtrap.io",
  //   // port: 2525,
  //   // auth: {
  //   //   user: "efe49df51426a0",
  //   //   pass: "68bb431bd5c235",
  //   // },
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });

  var mailOptions = {
    from: "villagregoriaresort@gmail.com",
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
