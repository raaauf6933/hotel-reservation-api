const mailer = require("nodemailer");
const { google } = require("googleapis");
const notifyEmail = require("./emailTemplate/notifyEmail");
const cancelBooking = require("./emailTemplate/cancelBooking");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async (type, params) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const smtpTransport = mailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });

  const handleHeaders = () => {
    switch (type) {
      case "RESET_PASSWORD":
        return {
          from: "Grand Villa Resort <grandvillahotel.restaurant@gmail.com>",
          to: params.user.email,
          subject: `RESET PASSWORD | ${params.user.username}`,
          html: `<html>
            <span>Hi ${params.user.first_name},</span> <br/><br/>
            <span>Here's the link to create your new password</span><br/><br/>
            <a href="${process.env.REACT_APP_URL}/admin/reset-password/${params.token}" >Click Here</a>
            </html>
          `,
          // attachments: [
          //   {
          //     filename: "check_image.png",
          //     path: __dirname + "/emailTemplate/pending_image.png",
          //     cid: "logo", //same cid value as in the html img src
          //   },
          // ],
        };
      case "SUPPORT_EMAIL_ADMIN":
        return {
          from: "Grand Villa Resort <grandvillahotel.restaurant@gmail.com>",
          to: params.to,
          subject: `${params.name} | ${params.subject}`,
          html: `<html>

              <p>Name: ${params.name}</p> 
               <p>Email: ${params.email}</p> 
              <p>Message: ${params.message}</p>
         
              </html>
            `,
        };
      case "PAYMENT_INSUFFICIENT":
        return {
          from: "Grand Villa Resort <grandvillahotel.restaurant@gmail.com>",
          to: params.guest.email,
          subject: `ADVISORY | PAYMENT`,
          html: notifyEmail(params),
          attachments: [
            {
              filename: "check_image.png",
              path: __dirname + "/emailTemplate/pending_image.png",
              cid: "logo", //same cid value as in the html img src
            },
          ],
        };
      case "CANCELED":
        return {
          from: "Grand Villa Resort <grandvillahotel.restaurant@gmail.com>",
          to: params.guest.email,
          subject: `ADVISORY | BOOKING CANCELED`,
          html: cancelBooking(params),
        };
      default:
        break;
    }
  };

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(handleHeaders(), function (error, info) {
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
