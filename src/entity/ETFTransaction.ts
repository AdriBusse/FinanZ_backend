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
import { ETF } from "./ETF";
import { User } from "./User";

@Entity()
@ObjectType()
export class ETFTransaction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: ObjectID;

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
