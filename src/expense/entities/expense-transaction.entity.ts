import { ExpenseCategory } from "./expense-category.entity";
import { Expense } from "./expense.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity({ name: "expenseTransaction" })
@ObjectType()
export class ExpenseTransaction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

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
