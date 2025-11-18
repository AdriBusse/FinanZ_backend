import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload-minimal";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../../types/MyContext";
import { Expense } from "../../../entity/Expense";
import { ExpenseCategory } from "../../../entity/ExpenseCategory";
import { ExpenseTransaction } from "../../../entity/ExpenseTransaction";
import voiceService from "../../../services/voice.service";
import { VoiceExpenseResult } from "./VoiceExpenseResult";

@Resolver()
export class VoiceResolver {
  @Mutation(() => VoiceExpenseResult)
  @UseMiddleware(isAuth)
  async processVoiceExpense(
    @Arg("expenseId") expenseId: string,
    // Disable validation so Upload payload isn't rejected by class-validator
    @Arg("file", () => GraphQLUpload, { validate: false }) file: Promise<FileUpload>,
    @Arg("language", { nullable: true }) language: string,
    @Ctx() ctx: MyContext
  ): Promise<VoiceExpenseResult> {
    const user = ctx.res.locals.user;
    console.log("[voice] processVoiceExpense: start", {
      expenseId,
      userId: user?.id,
    });
    try {
      const expense = await Expense.findOne({ id: expenseId, user });
      if (!expense) {
        console.error("[voice] processVoiceExpense: expense missing", {
          expenseId,
          userId: user?.id,
        });
        throw new Error("Cannot find Expense!");
      }

      const categories = await ExpenseCategory.find({ user });
      const upload = await file;
      const res = await voiceService.processVoiceExpense({
        upload,
        ai: ctx.ai,
        categories: categories.map((c) => ({ id: `${c.id}`, name: c.name })),
        currency: expense.currency,
        language,
      });
      console.log("[voice] processVoiceExpense: success", {
        expenseId,
        resultId: res.id,
        title: res.title,
        amount: res.amount,
        suggestedCategoryId: res.suggestedCategoryId,
      });
      return res;
    } catch (error) {
      console.error("[voice] processVoiceExpense: error", {
        expenseId,
        userId: user?.id,
        error,
      });
      throw error;
    }
  }

  @Mutation(() => ExpenseTransaction)
  @UseMiddleware(isAuth)
  async confirmVoiceTransaction(
    @Arg("expenseId") expenseId: string,
    @Arg("title") title: string,
    @Arg("amount") amount: number,
    @Arg("categoryId", { nullable: true }) categoryId: string,
    @Ctx() ctx: MyContext
  ): Promise<ExpenseTransaction> {
    const user = ctx.res.locals.user;
    console.log("[voice] confirmVoiceTransaction: start", {
      expenseId,
      userId: user?.id,
      title,
      amount,
      categoryId,
    });
    try {
      const expense = await Expense.findOne({ id: expenseId, user });
      if (!expense) {
        console.error("[voice] confirmVoiceTransaction: expense missing", {
          expenseId,
          userId: user?.id,
        });
        throw new Error("Cannot find Expense!");
      }

      const transaction = new ExpenseTransaction();
      transaction.expense = expense;
      transaction.user = user;
      transaction.describtion = title;
      transaction.amount = amount;

      if (categoryId) {
        const category = await ExpenseCategory.findOne({ id: categoryId, user });
        if (category) {
          transaction.category = category;
        }
      }

      await transaction.save();
      console.log("[voice] confirmVoiceTransaction: created", {
        transactionId: transaction.id,
        expenseId,
        userId: user?.id,
        amount,
      });
      return transaction;
    } catch (error) {
      console.error("[voice] confirmVoiceTransaction: error", {
        expenseId,
        userId: user?.id,
        error,
      });
      throw error;
    }
  }
}
