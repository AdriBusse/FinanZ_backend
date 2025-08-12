import { ExpenseCategory } from "./ExpenseCategory";
import { Expense } from "./Expense";
import { Field, ID, ObjectType } from "type-graphql";
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

@Entity({ name: "expenseTransaction" })
@ObjectType()
export class ExpenseTransaction extends BaseEntity {
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
  @ManyToOne(() => User, (user) => user.expenseTransactions)
  user: User;

  @Field(() => Expense)
  @ManyToOne(() => Expense, (depot) => depot.transactions, {
    onDelete: "CASCADE",
  })
  expense: Expense;

  @Field(() => ExpenseCategory, { nullable: true })
  @ManyToOne(() => ExpenseCategory, (cat) => cat.transactions, {
    nullable: true,
  })
  category: ExpenseCategory;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
