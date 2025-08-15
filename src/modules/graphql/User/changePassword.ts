import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import bcrypt from "bcrypt";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { isAuth } from "../../middleware/isAuth";

@Resolver(User)
export class ChangePasswordResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg("currentPassword") currentPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    try {
      const user: User | undefined = ctx.res.locals.user;
      if (!user) throw new Error("Unauthenticated");

      const matches = await bcrypt.compare(currentPassword, user.password);
      if (!matches) throw new Error("Current password is incorrect");

      if (!newPassword || newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();

      return true;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Failed to change password");
    }
  }
}
