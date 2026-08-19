import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GraphQLUpload, FileUpload } from "graphql-upload-minimal";
import { Readable } from "stream";
import { Expense } from "../../expense/entities/expense.entity";
import { ExpenseCategory } from "../../expense/entities/expense-category.entity";
import { ExpenseTransaction } from "../../expense/entities/expense-transaction.entity";
import { User } from "../../user/entities/user.entity";
import { VoiceService } from "../services/voice.service";
import { VoiceExpenseResult } from "../types/voice-expense-result.type";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver()
export class VoiceResolver {
  constructor(
    private readonly voiceService: VoiceService,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>,
    @InjectRepository(ExpenseTransaction)
    private readonly transactionRepository: Repository<ExpenseTransaction>
  ) {}

  @Mutation(() => VoiceExpenseResult)
  @UseGuards(GqlAuthGuard)
  async processVoiceExpense(
    @Args("expenseId") expenseId: string,
    @Args({ name: "file", type: () => GraphQLUpload, nullable: true })
    file: Promise<FileUpload> | null,
    @Args("base64File", { nullable: true }) base64File: string | null,
    @Args("fileExtension", { nullable: true }) fileExtension: string | null,
    @Args("language", { nullable: true }) language: string,
    @CurrentUser() user: User
  ): Promise<VoiceExpenseResult> {
    console.log("[voice] processVoiceExpense: start", {
      expenseId,
      userId: user?.id,
    });

    try {
      const expense = await this.expenseRepository.findOne({
        where: { id: Number(expenseId), user: { id: user.id } },
      });
      if (!expense) {
        console.error("[voice] processVoiceExpense: expense missing", {
          expenseId,
          userId: user?.id,
        });
        throw new Error("Cannot find Expense!");
      }

      const categories = await this.categoryRepository.find({
        where: { user: { id: user.id } },
      });

      let upload: FileUpload;
      if (base64File) {
        const ext = fileExtension || "m4a";
        upload = {
          filename: `audio.${ext}`,
          mimetype: `audio/${ext}`,
          encoding: "7bit",
          createReadStream: () => {
            const buffer = Buffer.from(base64File, "base64");
            return Readable.from(buffer);
          },
        } as FileUpload;
      } else if (file) {
        try {
          upload = await file;
          if (!upload || !upload.createReadStream) {
            throw new Error("Invalid file payload received. Expected a multipart file.");
          }
        } catch (err: any) {
          console.error("[voice] processVoiceExpense: file upload error", err);
          throw new Error(`File upload failed: ${err.message || "Unknown error"}`);
        }
      } else {
        throw new Error("No file or base64File provided");
      }

      const res = await this.voiceService.processVoiceExpense({
        upload,
        categories: categories.map((c) => ({ id: `${c.id}`, name: c.name })),
        currency: expense.currency,
        language,
        userId: user?.id ? String(user.id) : undefined,
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
  @UseGuards(GqlAuthGuard)
  async confirmVoiceTransaction(
    @Args("expenseId") expenseId: string,
    @Args("title") title: string,
    @Args("amount") amount: number,
    @Args("categoryId", { nullable: true }) categoryId: string,
    @CurrentUser() user: User
  ): Promise<ExpenseTransaction> {
    console.log("[voice] confirmVoiceTransaction: start", {
      expenseId,
      userId: user?.id,
      title,
      amount,
      categoryId,
    });

    try {
      const expense = await this.expenseRepository.findOne({
        where: { id: Number(expenseId), user: { id: user.id } },
      });
      if (!expense) {
        console.error("[voice] confirmVoiceTransaction: expense missing", {
          expenseId,
          userId: user?.id,
        });
        throw new Error("Cannot find Expense!");
      }

      let category: ExpenseCategory | null = null;
      if (categoryId) {
        category = await this.categoryRepository.findOne({
          where: { id: Number(categoryId), user: { id: user.id } },
        });
      }

      const transaction = this.transactionRepository.create({
        expense,
        user,
        describtion: title,
        amount,
        category: category || undefined,
      });

      const saved = await this.transactionRepository.save(transaction);
      console.log("[voice] confirmVoiceTransaction: created", {
        transactionId: saved.id,
        expenseId,
        userId: user?.id,
        amount,
      });
      return saved;
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
