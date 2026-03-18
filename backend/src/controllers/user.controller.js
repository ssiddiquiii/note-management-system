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

import { sendEmail } from "../utils/sendEmail.js";

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

  const message = `You requested a password reset. Please click on this link to reset your password: \n\n ${resetUrl} \n\n This link expires in 1 hour.`;
  const htmlMessage = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #37352f; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <svg width="48" height="48" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto;">
          <rect width="256" height="256" rx="60" fill="#191919"/>
          <path d="M88 64H168C176.837 64 184 71.1634 184 80V176C184 184.837 176.837 192 168 192H88C79.1634 192 72 184.837 72 176V80C72 71.1634 79.1634 64 88 64Z" fill="white"/>
          <path d="M100 102H156M100 134H156M100 166H136" stroke="#191919" stroke-width="14" stroke-linecap="round"/>
        </svg>
      </div>
      <h2 style="font-size: 24px; font-weight: 700; color: #37352f; margin-bottom: 24px; text-align: center;">Reset your password</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #37352f; margin-bottom: 24px;">
        We received a request to reset the password for your Notion Clone account. If you didn't make this request, you can safely ignore this email.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #2383e2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 14px; font-weight: 500; display: inline-block;">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: #787774; margin-bottom: 24px; line-height: 1.5;">
        Or copy and paste this link directly into your browser:<br>
        <a href="${resetUrl}" style="color: #2383e2; text-decoration: none; word-break: break-all;">${resetUrl}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #ededeb; margin: 32px 0;">
      <p style="font-size: 12px; color: #787774; text-align: center; line-height: 1.5;">
        This password reset link will expire in 1 hour.<br>
        Notion Clone Support Team
      </p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - Notion Clone",
      message: message,
      htmlMessage: htmlMessage,
    });

    return res.json({ error: false, message: "Password reset email sent successfully!" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("Email sending failed:", error);
    return res.status(500).json({ error: true, message: "Email could not be sent. Please try again later." });
  }
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