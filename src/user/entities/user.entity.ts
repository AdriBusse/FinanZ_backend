import { ExpenseCategory } from "../../expense/entities/expense-category.entity";
import { Expense } from "../../expense/entities/expense.entity";
import { SavingTransaction } from "../../saving/entities/saving-transaction.entity";
import { SavingDepot } from "../../saving/entities/saving-depot.entity";
import { ETFTransaction } from "../../etf/entities/etf-transaction.entity";
import { ETF } from "../../etf/entities/etf.entity";
import { IsEmail, IsOptional, Length } from "class-validator";
import { Field, ID, ObjectType } from "@nestjs/graphql";
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
import { ExpenseTransaction } from "../../expense/entities/expense-transaction.entity";
import { UserIdentity } from "./user-identity.entity";
import { AuthProvider } from "../../auth/types/auth-provider.enum";

@ObjectType()
@Entity({ name: "Users" })
export class User extends BaseEntity {
  constructor(user?: Partial<User>) {
    super();
    if (user) {
      Object.assign(this, user);
    }
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

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @Length(6, 255, { message: "Must be at least 6 characters long" })
  @Exclude()
  password: string | null;

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

  @OneToMany(() => UserIdentity, (identity) => identity.user)
  identities: UserIdentity[];

  @Field(() => [AuthProvider])
  linkedProviders: AuthProvider[];

  @Field()
  hasPassword: boolean;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  @Field({ nullable: true })
  @Column({ type: "timestamp", nullable: true })
  lastLogin?: Date | null;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
