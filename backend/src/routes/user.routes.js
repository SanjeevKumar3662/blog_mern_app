import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

export const router = Router();

router.route("/test").get((req, res) => {
  res.status(200).json("your router is working");
});

router.route("/register").post(registerUser);
export default router;
