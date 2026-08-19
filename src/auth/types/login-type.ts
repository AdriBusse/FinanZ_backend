import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";

@ObjectType()
export class LoginType {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}
