import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";

export enum GoogleLoginStatus {
  AUTHENTICATED = "AUTHENTICATED",
  REGISTRATION_REQUIRED = "REGISTRATION_REQUIRED",
  LINK_REQUIRED = "LINK_REQUIRED",
}

registerEnumType(GoogleLoginStatus, {
  name: "GoogleLoginStatus",
});

@ObjectType()
export class GoogleAuthResult {
  @Field(() => GoogleLoginStatus)
  status: GoogleLoginStatus;

  @Field({ nullable: true })
  token?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  verifiedEmail: string;
}
