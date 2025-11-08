import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = async (user) => {
  return jwt.sign(user, process.env.ACCESS_KEY_SECRET, {
    expiresIn: process.env.ACCESS_KEY_EXPIRY,
  });
};

export const generateRefreshToken = async (user) => {
  return jwt.sign(user, process.env.REFRESH_KEY_SECRET, {
    expiresIn: process.env.REFRESH_KEY_EXPIRY,
  });
};

export const registerUser = async (req, res) => {
  try {
    const { username, fullname, password, email } = req.body;
    console.log({ username, fullname, password, email });

    if (!(username && fullname && password && email)) {
      return res
        .status(400)
        .json({ error: "Either username,password,or email is not received" });
    }
    const user = await User.create({ username, fullname, email, password });

    if (!user) {
      return res
        .status(500)
        .json({ error: "Error occured while registering user to DB" });
    }

    return res
      .status(201)
      .json({ message: "User registeration is successful" });
  } catch (err) {
    console.error({ error: err.message });
    return res
      .status(500)
      .json({ message: "failed to register user", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res
      .status(400)
      .json({ error: "Either/both username or password not received" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ error: "User not found/exist" });
  }

  //set user cookies
  return res
    .status(200)
    .json({ message: `${user.username} has logged in successfully` });
};
