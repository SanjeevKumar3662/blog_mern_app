import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const generateAccessToken = (payload) => {
  // console.log("playlod", payload);
  return jwt.sign(payload, process.env.ACCESS_KEY_SECRET, {
    expiresIn: process.env.ACCESS_KEY_EXPIRY,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_KEY_SECRET, {
    expiresIn: process.env.REFRESH_KEY_EXPIRY,
  });
};

export const refreshExpiredAccessToken = async (req, res) => {
  const inputRefreshToken = req.cookies?.refreshToken;
  if (!inputRefreshToken) {
    throw new ApiError(401, "No refreshToken received");
  }

  const user = await User.findOne({ refreshToken: inputRefreshToken });
  if (!user) {
    throw new ApiError(401, "Invalid refreshToken");
  }

  try {
    jwt.verify(inputRefreshToken, process.env.REFRESH_KEY_SECRET);
  } catch (error) {
    throw new ApiError(401, "Token expired or not valid", error.message);
  }
  //console.log("in refreshExpiredAccessToken", { isTokenValid });
  //console.log("user", user);

  const newAccessToken = generateAccessToken({
    _id: user._id,
    username: user.username,
  });

  return res
    .status(201)
    .cookie("accessToken", newAccessToken, {
      maxAge: 15 * 60 * 1000,
    })
    .json(new ApiResponse(201, "accessToken refreshed"));
};

export const registerUser = async (req, res) => {
  const { username, fullname, password, email } = req.body;
  // console.log({ username, fullname, password, email });

  if (!(username && fullname && password && email)) {
    throw new ApiError(
      400,
      "Either usernaame,password,or email is not provided"
    );
  }
  const user = await User.create({ username, fullname, email, password });

  if (!user) {
    throw new ApiError(500, "Error occured while registering user to DB");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registeration is successful"));
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    throw new ApiError(400, "Either/both username or password not received");
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found/exist");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new ApiError(401, "Invalid password");
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
    .json(
      new ApiResponse(200, `${user.username} has logged in successfully`, {
        username: user.username,
        _id: user._id,
      })
    );
};
