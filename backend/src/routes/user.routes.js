import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js";
import { authenticateToken } from "../middleware/auth.middlewares.js";

export const router = Router();

router.route("/test").get(authenticateToken, (_, res) => {
  console.log(_.user);
  return res.status(200).json("your router and auth is working");
});

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router;
