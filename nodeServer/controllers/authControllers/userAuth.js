import User from "../../models/UserSchema.js";
import bcryptjs from "bcryptjs";

export const signUpUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password doesn't match" });
  }

  const isPasswordValidated = /^(?=.*\d).{8,}$/.test(password);

  if (!isPasswordValidated) {
    return res
      .status(400)
      .json({ success: false, message: "Password format doesn't match." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  res.status(201).json({
    success: true,
    message: "User info is Correct",
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email, Please Enter Valid Email.",
    });
  }

  const isMatched = await bcryptjs.compare(password, user.password);

  if (!isMatched) {
    return res.status(400).json({
      success: false,
      message: "Wrong Password, Please Enter Correct Password",
    });
  }

  res.status(200).json({
    success: true,
    message: "Login Successful",
    user: { _id: user?._id, email },
  });
};

