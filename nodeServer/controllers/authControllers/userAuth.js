import User from "../../models/UserSchema.js";
import bcryptjs from "bcryptjs";

export const signUpUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const hashedPass = await bcryptjs.hash(password, 10);

  const newUser = new User({
    fullName,
    email,
    password: hashedPass,
  });

  await newUser.save();

  res.status(201).json({
    success: true,
    message: "User created successfully",
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

  const isMatched = await bcryptjs.compare(password, user?.password);

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

export const getLoginUser = async (req, res) => {
  const { userId } = req.query; // ✅ use query instead of body

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  const user = await User.findById(userId).select("-password"); // hide password

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    user,
  });
};

