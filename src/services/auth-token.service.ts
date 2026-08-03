import jwt from "jsonwebtoken";
import { User } from "../entity/User";

export const issueAuthToken = (user: User): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT authentication is not configured");
  }

  return jwt.sign({ userId: user.id, username: user.username }, secret, {
    expiresIn: "60d",
  });
};
