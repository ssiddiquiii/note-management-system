import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import crypto from "crypto"; 

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Detailed Error Log:", error);
    throw new Error(
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => !field?.trim())) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res
      .status(409)
      .json({ error: true, message: "User with email already exists" });
  }

  const user = await User.create({ fullName, email, password });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong while registering the user",
    });
  }

  return res.status(201).json({
    error: false,
    user: createdUser,
    message: "User registered Successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Email and password is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ error: true, message: "User does not exist" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid user credentials" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: "User logged In Successfully",
    });
});

const getUser = asyncHandler(async (req, res) => {
  const { user } = req;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdAt,
    },
    message: "",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Return generic message to prevent user enumeration
    return res.json({ error: false, message: "If an account with that email exists, a reset link has been sent." });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password/${token}`;

  console.log("\n================ RESET LINK ================");
  console.log(resetUrl);
  console.log("============================================\n");

  return res.json({ error: false, message: "Link sent to console!" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid or expired token" });
  }

  user.password = newPassword;

  // reset token clear
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  // save user — let the pre-save hook hash the password
  await user.save();

  return res.json({ error: false, message: "Password reset successful!" });
});

export { registerUser, loginUser, getUser };