import { ExpenseCategory } from "./ExpenseCategory";
import { Expense } from "./Expense";
import { SavingTransaction } from "./SavingTransaction";
import { SavingDepot } from "./SavingDepot";
import { ETFTransaction } from "./ETFTransaction";
import { ETF } from "./ETF";
import { IsEmail, Length } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { ExpenseTransaction } from "./ExpenseTransaction";

@ObjectType()
@Entity({ name: "Users" })
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  @Length(3, 255, { message: "Must be at least 3 characters long" })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  middleName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Column()
  @Length(6, 255, { message: "Must be at least 6 characters long" })
  @Exclude()
  password: string;

  @Field()
  @Column("text", { unique: true })
  @IsEmail(undefined, { message: "Must be a valid email address" })
  @Length(1, 255, { message: "Email is empty" })
  email: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => [ETF])
  @OneToMany(() => ETF, (etf) => etf.user)
  etfs: ETF[];

  @Field(() => [ETFTransaction])
  @OneToMany(() => ETFTransaction, (etft) => etft.user)
  etfTransactions: ETFTransaction[];

  @Field(() => [SavingDepot])
  @OneToMany(() => SavingDepot, (savingD) => savingD.user)
  savingDepots: SavingDepot[];

  @Field(() => [SavingTransaction])
  @OneToMany(() => SavingTransaction, (savingT) => savingT.user)
  savingTransactions: SavingTransaction[];

  @Field(() => [Expense])
  @OneToMany(() => Expense, (savingD) => savingD.user)
  expenseDepots: Expense[];

  @Field(() => [ExpenseTransaction])
  @OneToMany(() => ExpenseTransaction, (savingT) => savingT.user)
  expenseTransactions: ExpenseTransaction[];

  @Field(() => [ExpenseCategory])
  @OneToMany(() => ExpenseCategory, (expenseCategory) => expenseCategory.user)
  expenseCategory: ExpenseCategory[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
