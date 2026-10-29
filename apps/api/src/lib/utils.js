import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userID, res) => {
  const token = JWT.sign({userID}, process.env.JWT_SECRET,
    {expiresIn: "1d"}
  )

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  })
  return token;
};
