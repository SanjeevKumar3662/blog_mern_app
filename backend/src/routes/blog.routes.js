import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middlewares.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from "../controllers/blog.controllers.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/all-blogs", asyncHandler(getAllBlogs));
router.post("/create", authenticateToken, asyncHandler(createBlog));
router.delete("/delete", authenticateToken, asyncHandler(deleteBlog));
router.patch("/update", authenticateToken, asyncHandler(updateBlog));

export default router;
