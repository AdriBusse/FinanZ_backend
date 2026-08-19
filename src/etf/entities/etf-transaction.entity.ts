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
import { ETF } from "./etf.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
@ObjectType()
export class ETFTransaction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: "How much invested in the ETF" })
  @Column({ type: "float", default: 0 })
  invest: number;

  @Field({ description: "How much Fee was payed this time" })
  @Column({ type: "float", default: 0 })
  fee: number;

  @Field({ description: "How much parts of the etf was bougth" })
  @Column({ type: "float", default: 0 })
  amount: number;

  @Field({ description: "How much is the ETF worth this time" })
  @Column({ type: "float", default: 0 })
  value: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.etfTransactions)
  user: User;

  @Field(() => ETF)
  @ManyToOne(() => ETF, (depot) => depot.transactions, {
    onDelete: "CASCADE",
  })
  etf: ETF;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
