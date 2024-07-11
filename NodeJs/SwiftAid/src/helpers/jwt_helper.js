import jwt from "jsonwebtoken";
import createError from "http-errors";
import {
  Access_Token,
  Access_Token_EXPIRY,
  Refresh_Token,
  Refresh_Token_EXPIRY,
} from "../../ENV.js";

const signAccessToken = (payload) => {
  return jwt.sign(payload, Access_Token, {
    expiresIn: Access_Token_EXPIRY,
  });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, Refresh_Token, {
    expiresIn: Refresh_Token_EXPIRY,
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, Access_Token);
  } catch (error) {
    return { error };
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, Refresh_Token);
  } catch (error) {
    throw createError.Unauthorized();
  }
};

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
