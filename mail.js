const nodeMailer = require("nodemailer");

const createMailOptions = (sender, target, type, info, name, app) => {
  const mailOptions = {
    from: sender,
    to: target,
  };
  switch (type) {
    case "register":
      return {
        ...mailOptions,
        subject: "Registration conformation!",
        html: `<h1>${app}</h1><p>Welcome to ${app}! Now you can login!</p>`,
      };
    case "reset":
      return {
        ...mailOptions,
        subject: "Password change",
        html: `<h1>${app}</h1><p>Your new password is <span style="font-size: 18px;font-weight: bold;">${info}</span>. It is highly advised to change it as soon as possible</p>`,
      };
    case "message":
      return {
        ...mailOptions,
        subject: "Poruka ✔",
        html: `<div style="width: 80%;margin: 10px auto;text-align: center; border: 3px solid #26466d; border-radius: 5px 25px 5px 5px;padding: 15px;"><h3 style="color: #26466d;font-style: italic;">${app}</h3><p><b>Ime pošaljioca:</b> ${name}</p><p><b>E-mail pošaljioca:</b> <a href="mailto:${sender}">${sender}</a></p><p style="width: 60%;margin: 15px auto;"><b>Poruka:</b> ${info}</p></div>`,
      };
    default:
      return null;
  }
};

const sendEmail = (sender, target, type, info, name, app) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = createMailOptions(sender, target, type, info, name, app);

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.error(err.message);
    else {
      console.log(`Email is sent! ${info.response}`);
    }
  });
};

module.exports = {
  sendEmail,
};
