import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_KEY_SECRET, {
    expiresIn: process.env.ACCESS_KEY_EXPIRY,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_KEY_SECRET, {
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
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res
        .status(400)
        .json({ error: "Either/both username or password not received" });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(400).json({ error: "User not found/exist" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const accessToken = generateAccessToken({
      _id: user._id,
      username: user.username,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
      username: user.username,
    });
    // console.log({ refreshToken, accessToken });

    user.refreshToken = refreshToken;
    await user.save();

    //set user cookies
    return res
      .status(200)
      .cookie("accessToken", accessToken, { maxAge: 15 * 60 * 1000 }) // exp for 15m but for test 60s
      .cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }) // exp for 30days
      .json({
        message: `${user.username} has logged in successfully`,
      });
  } catch (error) {
    console.error({ error: error.message });
    return res.status(500).json({
      message: "Error occured while logging in user/ please try later",
      error: error.message,
    });
  }
};
