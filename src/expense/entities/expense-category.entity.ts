import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";
import { ExpenseTransaction } from "./expense-transaction.entity";

@Entity()
@ObjectType()
export class ExpenseCategory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  color: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  icon: string;

  @Field(() => [ExpenseTransaction], { nullable: true })
  @OneToMany(() => ExpenseTransaction, (trans) => trans.category)
  transactions: ExpenseTransaction[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.expenseCategory)
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
