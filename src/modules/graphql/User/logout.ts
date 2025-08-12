import { Mutation, Resolver } from "type-graphql";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(): Promise<Boolean> {
    // clientside token remove
    return true;
  }
}
