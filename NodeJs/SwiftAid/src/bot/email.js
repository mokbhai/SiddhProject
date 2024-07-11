import nodemailer from "nodemailer";

const mail = (subject, emailAddress, Body) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jamendojam@gmail.com",
      pass: "avgg zefh vhun ygno",
    },
  });

  const mailDetails = {
    from: "jamendojam@gmail.com",
    to: emailAddress,
    subject: subject,
    text: Body,
  };

  mailTransporter.sendMail(mailDetails, function (err) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent successfully to " + emailAddress);
    }
  });
  return JSON.stringify({ emailAddress: emailAddress });
};
export default mail;
