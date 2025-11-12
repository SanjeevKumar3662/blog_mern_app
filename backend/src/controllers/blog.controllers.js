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

export const getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find({ isPublic: true }).populate(
    "user",
    "username fullname  -_id"
  );

  if (!allBlogs) {
    throw new ApiError(500, "Could not find any Blogs");
  }

  return res.status(200).json(new ApiResponse(200, "Success", allBlogs));
};

export const deleteBlog = async (req, res) => {
  const { _id } = req.body;
  console.log(_id);
  if (!_id) {
    throw new ApiError(400, "Blog id is missing");
  }
  const { deletedCount } = await Blog.deleteOne({ _id });
  if (!deletedCount) {
    throw new ApiError(404, "Invalid id provided / content not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog deleted successfully"));
};

export const updateBlog = async (req, res) => {
  const { _id, title, description, content } = req.body;

  if (!(_id && (title || description || content))) {
    throw new ApiError(400, "id and content to be updated is required");
  }

  const { matchedCount, modifiedCount } = await Blog.updateOne(
    { _id: _id },
    { $set: { title, description, content } }
  );

  // console.log("blog", blog);
  if (matchedCount === 0) {
    throw new ApiError(404, "Blog not found");
  }

  if (modifiedCount === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No changes made / blog already up to date"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog updated successfully"));
};
