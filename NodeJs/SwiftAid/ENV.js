import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const Access_Token = process.env.Access_Token;
const Access_Token_EXPIRY = "7d";
const MONGODB_URI = process.env.MONGODB_URI;
const Refresh_Token = process.env.Access_Token;
const Refresh_Token_EXPIRY = "1y";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CONTENT = process.env.CONTENT;
const USER_ROLE = process.env.USER_ROLE;
const MODEL = process.env.MODEL;
export {
  MODEL,
  USER_ROLE,
  CONTENT,
  OPENAI_API_KEY,
  PORT,
  Access_Token,
  Access_Token_EXPIRY,
  MONGODB_URI,
  Refresh_Token,
  Refresh_Token_EXPIRY,
};
