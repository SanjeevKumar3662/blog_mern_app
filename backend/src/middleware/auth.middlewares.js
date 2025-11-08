import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const authenticateToken = async (req, res, next) => {
  // add async handler
  // add responseHandler
  // add errorHandler
  try {
    // extract accessToken form cookies
    // verify token with api_token_secret
    // check in db if user exists
    // add user to req object
    const accessToken = req.cookies.accessToken;
    console.log("accessToken", accessToken);

    if (!accessToken) {
      return res.status(401).json({ error: "accessToken not received" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, process.env.ACCESS_KEY_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "Token not valid" });
    }

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while authenticating token",
      error: error.message,
    });
  }
};
