import { Field, ID, ObjectType } from "type-graphql";
import { SavingDepot } from "./SavingDepot";
import {
  Entity,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class SavingTransaction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Field()
  @Column()
  describtion: string;

  @Field()
  @Column({ type: "float", default: 0 })
  amount: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.savingTransactions)
  user: User;

  @Field(() => SavingDepot)
  @ManyToOne(() => SavingDepot, (depot) => depot.transactions, {
    onDelete: "CASCADE",
  })
  depot: SavingDepot;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
