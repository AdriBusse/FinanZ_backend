import { registerEnumType } from "type-graphql";

export enum AuthProvider {
  GOOGLE = "GOOGLE",
}

registerEnumType(AuthProvider, {
  name: "AuthProvider",
});
