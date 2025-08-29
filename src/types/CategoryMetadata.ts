import { Field, ObjectType } from "type-graphql";

// Runtime TS types for internal usage
export interface ColorOptionRecord {
  key: string;
  hex: string;
  label: string;
}

export interface IconOptionRecord {
  keyword: string;
  icon: string;
  label: string;
}

export interface CategoryMetadataRecord {
  colors: ColorOptionRecord[];
  icons: IconOptionRecord[];
}

@ObjectType()
export class ColorOptionGQL {
  @Field()
  key!: string;

  @Field()
  hex!: string;

  @Field()
  label!: string;
}

@ObjectType()
export class IconOptionGQL {
  @Field()
  keyword!: string;

  @Field()
  icon!: string;

  @Field()
  label!: string;
}

@ObjectType()
export class CategoryMetadataGQL {
  @Field(() => [ColorOptionGQL])
  colors!: ColorOptionGQL[];

  @Field(() => [IconOptionGQL])
  icons!: IconOptionGQL[];
}
