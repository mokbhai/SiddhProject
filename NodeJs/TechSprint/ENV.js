import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_EXPIRY = "1d";
const MONGODB_URI = process.env.MONGODB_URI;
const APP_PASSWORD = process.env.APP_PASSWORD;
const MAIL_ID = process.env.MAIL_ID;

export {
  PORT,
  JWT_SECRET_EXPIRY,
  JWT_SECRET,
  MONGODB_URI,
  MAIL_ID,
  APP_PASSWORD,
};
