import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middlewares.js";
import { createBlog } from "../controllers/blog.controllers.js";

const router = Router();

router.post("/create", authenticateToken, createBlog);

export default router;
