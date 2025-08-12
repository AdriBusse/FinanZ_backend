import { Field, ObjectType } from "type-graphql";
import { User } from "../entity/User";

@ObjectType()
export class LoginType {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}
