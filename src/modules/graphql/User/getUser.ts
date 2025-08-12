import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../../../entity/User";
import { isAuth } from "../../middleware/isAuth";

@Resolver(User)
export class GetUserResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  async getUser(@Arg("username") username: string) {
    try {
      const user = await User.findOneOrFail({
        where: { username },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
