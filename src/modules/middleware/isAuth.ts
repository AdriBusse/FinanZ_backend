import { MyContext } from "../../types/MyContext";
import { MiddlewareFn } from "type-graphql";
import { User } from "../../entity/User";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  try {
    const user: User | undefined = context.res.locals.user;

    if (!user) throw new Error("Unauthenticated");

    return next();
  } catch (error) {
    console.log(error);
    throw new Error("Unauthenticated");
  }
};
