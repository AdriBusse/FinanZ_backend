import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SavingDepot } from "./saving-depot.entity";
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

@Entity()
@ObjectType()
export class SavingTransaction extends BaseEntity {
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
