import { ETFTransaction } from "./etf-transaction.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";

@Entity()
@ObjectType()
export class ETF extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  symbol: string;

  @Field()
  @Column()
  isin: string;

  @Field()
  @Column()
  wkn: string;

  @Field({ description: "How much is the ETF worth" })
  worth: number;

  @Field({ description: "How much was invested in the ETF" })
  deposited: number;

  @Field({ description: "How many parts of the ETF" })
  amount: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.etfs)
  user: User;

  @Field(() => [ETFTransaction], { nullable: true })
  @OneToMany(() => ETFTransaction, (trans) => trans.etf)
  transactions: ETFTransaction[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
