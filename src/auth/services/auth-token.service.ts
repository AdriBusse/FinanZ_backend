import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class AuthTokenService {
  issueAuthToken(user: User): string {
    const secret = process.env.JWT_SECRET || "hello123";
    return jwt.sign({ userId: user.id, username: user.username }, secret, {
      expiresIn: "60d",
    });
  }
}

export const issueAuthToken = (user: User): string => {
  const secret = process.env.JWT_SECRET || "hello123";
  return jwt.sign({ userId: user.id, username: user.username }, secret, {
    expiresIn: "60d",
  });
};
