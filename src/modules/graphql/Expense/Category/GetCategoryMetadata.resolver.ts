import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { CategoryMetadataGQL } from "../../../../types/CategoryMetadata";
import { MyContext } from "../../../../types/MyContext";
import categoryMetadata from "../../../../constants/categoryMetadata";

@Resolver()
export class GetCategoryMetadataResolver {
  @Query(() => CategoryMetadataGQL)
  @UseMiddleware(isAuth)
  async categoryMetadata(@Ctx() _ctx: MyContext): Promise<CategoryMetadataGQL> {
    const metadata = categoryMetadata;
    return { colors: metadata.colors, icons: metadata.icons };
  }

  
}
