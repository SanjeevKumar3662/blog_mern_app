import { Router } from "express";
import {
  loginUser,
  refreshExpiredAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { authenticateToken } from "../middleware/auth.middlewares.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
export const router = Router();

router.route("/test").get(authenticateToken, (_, res) => {
  return res.status(200).json("your router and auth is working");
});

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/refreshToken", asyncHandler(refreshExpiredAccessToken));

export default router;
