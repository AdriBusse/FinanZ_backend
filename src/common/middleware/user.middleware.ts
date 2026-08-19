import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DataSource } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let token: string | undefined;

      if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next();
      }

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "hello123"
      );

      const userRepository = this.dataSource.getRepository(User);
      const user = decoded.userId
        ? await userRepository.findOne({ where: { id: Number(decoded.userId) } })
        : await userRepository.findOne({ where: { username: decoded.username } });

      if (user) {
        (req as any).user = user;
        res.locals.user = user;
      }

      return next();
    } catch {
      // If token is invalid or expired, continue without attaching user
      return next();
    }
  }
}
