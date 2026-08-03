import { Arg, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcrypt";
import { User } from "../../../entity/User";
import { isEmpty } from "class-validator";
import { LoginType } from "../../../types/LoginType";
import { issueAuthToken } from "../../../services/auth-token.service";

@Resolver(LoginType)
export class LoginResolver {
  @Mutation(() => LoginType, { nullable: true })
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<LoginType> {
    try {
      let errors: any = {};
      if (isEmpty(username)) errors.username = "Username should not be empty";
      if (isEmpty(password)) errors.password = "Password should not be empty";
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        throw new Error(" Input should not be empty");
      }
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.password) throw new Error("Wrong Credentials");
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) throw new Error("Wrong Credentials");

      const token = issueAuthToken(user);

      return {
        user,
        token,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
