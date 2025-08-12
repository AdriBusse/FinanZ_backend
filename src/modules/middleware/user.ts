import { NextFunction, Request, Response } from "express";
import { User } from "../../entity/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next();

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findOne({ username });

    res.locals.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "User not Found" });
  }
};
