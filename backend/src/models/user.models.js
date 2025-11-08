import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    fullname: {
      type: String,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  // this will not work for findOneAndUpdate , so don't use that
  const isModified = this.isModified("password");
  if (!isModified) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);
