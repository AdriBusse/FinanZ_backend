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
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { ExpenseTransaction } from "./ExpenseTransaction";

@Entity()
@ObjectType()
export class ExpenseCategory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: ObjectID;

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
