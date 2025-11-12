import { ApiError } from "../utils/apiError.js";
import { Blog } from "../models/blog.models.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createBlog = async (req, res) => {
  const { title, description, content } = req.body;
  if (!(title && description && content)) {
    throw new ApiError(400, "All fields are required");
  }

  const blog = await Blog.create({
    title,
    description,
    content,
    user: req.user._id,
  });

  // console.log("blog", blog);
  if (!blog) {
    throw new ApiError(500, "Faild to create blog / try again");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Blog Created Successfully", { id: blog._id, title })
    );
};
