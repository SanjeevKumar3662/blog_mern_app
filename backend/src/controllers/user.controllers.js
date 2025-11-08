import { User } from "../models/user.models.js";

export const registerUser = async (req, res) => {
  try {
    const { username, fullname, password, email } = req.body;
    console.log({ username, fullname, password, email });

    if (!(username && fullname && password && email)) {
      return res
        .status(400)
        .json({ error: "Either username,password,or email is not received" });
    }
    const user = await User.create({ username, fullname, email, password });

    if (!user) {
      return res
        .status(500)
        .json({ error: "Error occured while registering user to DB" });
    }

    return res
      .status(201)
      .json({ message: "User registeration is successful" });
  } catch (err) {
    console.error({ error: err.message });
    return res
      .status(500)
      .json({ message: "failed to register user", error: err.message });
  }
};
