import { ExpenseCategory } from "./expense-category.entity";
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

@Entity({ name: "expenseTransactionTemplate" })
@ObjectType()
export class ExpenseTransactionTemplate extends BaseEntity {
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
  @ManyToOne(() => User)
  user: User;

  @Field(() => ExpenseCategory, { nullable: true })
  @ManyToOne(() => ExpenseCategory, { nullable: true, onDelete: "SET NULL" })
  category: ExpenseCategory;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
