import express from "express";
import connectDB from "./db/db.js";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://127.0.0.1:3000"],
    credentials: true,
  })
);

//Connecting to MongoDB

await connectDB();

app.get("/", (req, res) => {
  res.status(200).json("<h1>this is blog.api </h1>");
});

export default app;
