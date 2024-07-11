import { APP_PASSWORD, MAIL_ID } from "../ENV.js";
import nodemailer from "nodemailer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: MAIL_ID,
    pass: APP_PASSWORD,
  },
});

export const createMailOptions = ({
  fromName,
  fromAddress,
  to,
  subject,
  text,
  html,
}) => ({
  from: {
    name: fromName || "MokBhaiMJ",
    address: fromAddress || MAIL_ID,
  },
  to: Array.isArray(to) ? to : [to], // ensure 'to' is an array
  subject: subject || "No Subject",
  text: text || "",
  html: html || "",
});

export const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const sendMailController = async (req, res, next) => {
  try {
    const { mailTo, subject, text } = req.body;

    if (!mailTo || !subject || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const html = "<b>test</b>";
    const mailOptions = createMailOptions({
      to: mailTo,
      subject: subject,
      text: text,
      html: html,
    });

    const result = await sendMail(transporter, mailOptions);

    if (result) {
      return res.status(200).json({ message: "Mail sent successfully" });
    } else {
      return res.status(500).json({ message: "Failed to send mail" });
    }
  } catch (error) {
    next(error);
  }
};
