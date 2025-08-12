import {
  Entity,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { ExpenseTransaction } from "./ExpenseTransaction";
import ExpenseByCategory from "./gql/ExpenseByCategory";

@Entity()
@ObjectType()
export class Expense extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true, default: "€" })
  currency: string;

  @Field()
  @Column({ default: false })
  archived: boolean;

  @Field()
  @Column({ default: false })
  monthlyRecurring: boolean;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  spendingLimit: number | null;

  @Field()
  sum: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.expenseDepots)
  user: User;

  @Field(() => [ExpenseTransaction], { nullable: true })
  @OneToMany(() => ExpenseTransaction, (trans) => trans.expense)
  transactions: ExpenseTransaction[];

  @Field(() => [ExpenseByCategory])
  expenseByCategory: ExpenseByCategory[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
