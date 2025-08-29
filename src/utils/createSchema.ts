import { GetCoinGraphHistory } from "./../modules/graphql/Cryptocurrency/GetCoinGraphHistory.resolver";
import { GetCoinDetails } from "./../modules/graphql/Cryptocurrency/GetCoinDetails.resolver";
import { SearchCryptoCoin } from "./../modules/graphql/Cryptocurrency/SearchCryptoCoin.resolver";
import { getSupportedVsCurrencies } from "./../modules/graphql/Cryptocurrency/GetSupportedVSCurrencies.resolver";
import { GetMarketData } from "./../modules/graphql/Cryptocurrency/GetMarketData.resolver";
import { SearchETFResolver } from "./../modules/graphql/ETF/ETF/SearchETF.resolver";
import { UpdateSavingDepotResolver } from "./../modules/graphql/Saving/Depot/UpdateSavingDepot.resolver";
import { UpdateExpenseResolver } from "./../modules/graphql/Expense/Expense/UpdateExpense.resolver";
import { UpdateExpenseCategoryResolver } from "../modules/graphql/Expense/Category/UpdateExpenseCategory.resolver";
import { GetExpensesResolver } from "../modules/graphql/Expense/Expense/GetExpenses.resolver";
import { UpdateExpenseTransactionResolver } from "../modules/graphql/Expense/Transaction/UpdateExpenseTransactions.resolver";
import { GetExpenseCategoriesResolver } from "../modules/graphql/Expense/Category/GetCategories.resolver";
import { GetCategoryMetadataResolver } from "../modules/graphql/Expense/Category/GetCategoryMetadata.resolver";
import { DeleteExpenseCategoryResolver } from "../modules/graphql/Expense/Category/DeleteExpenseCategory.resolver";
import { CreateExpenseCategoryResolver } from "../modules/graphql/Expense/Category/CreateExpenseCategory.resolver";
import { ExpenseCategoryResolver } from "../modules/graphql/ClassResolver/ExpenseCategory.resolver";
import { CreateExpenseTransactionResolver } from "../modules/graphql/Expense/Transaction/CreateExpenseTransaction.resolver";
import { GetExpenseResolver } from "../modules/graphql/Expense/Expense/GetExpense.resolver";
import { DeleteExpenseResolver } from "../modules/graphql/Expense/Expense/DeleteExpense.resolver";
import { CreateExpenseResolver } from "../modules/graphql/Expense/Expense/CreateExpense.resolver";
import { ExpenseTransactionResolver } from "../modules/graphql/ClassResolver/ExpenseTransaction.resolver";
import { ExpenseResolver } from "../modules/graphql/ClassResolver/Expense.resolver";
import { ExpenseTransactionTemplateResolver } from "../modules/graphql/ClassResolver/ExpenseTransactionTemplate.resolver";
import { MeResolver } from "../modules/graphql/User/me";
import { LogoutResolver } from "../modules/graphql/User/logout";
import { SignupResolver } from "../modules/graphql/User/signup";
import { LoginResolver } from "../modules/graphql/User/login";
import { ChangePasswordResolver } from "../modules/graphql/User/changePassword";
import { GetUserResolver } from "../modules/graphql/User/getUser";
import { UserResolver } from "../modules/graphql/ClassResolver/User.resolver";
import { UpdateSavingTransactionResolver } from "../modules/graphql/Saving/Transaction/UpdateTransaction.resolver";
import { GetETFResolver } from "../modules/graphql/ETF/ETF/GetETF.resolver";
import { DeleteETFTransactionResolver } from "../modules/graphql/ETF/ETFTransaction/DeleteETFTransaction.resolver";
import { DeleteETFResolver } from "../modules/graphql/ETF/ETF/DeleteETF.resolver";
import { ETFTransactionResolver } from "../modules/graphql/ClassResolver/ETFTransaction.resolver";
import { CreateETFTransactionResolver } from "../modules/graphql/ETF/ETFTransaction/CreateETFTransaction.resolver";
import { GetETFsResolver } from "../modules/graphql/ETF/ETF/GetETFs.resolver";
import { CreateETFResolver } from "../modules/graphql/ETF/ETF/CreateETF.resolver";
import { ETFResolver } from "../modules/graphql/ClassResolver/ETF.resolver";
import { DeleteSavingTransactionResolver } from "../modules/graphql/Saving/Transaction/DeleteSavingTransaction.resolver";
import { DeleteSavingDepotResolver } from "../modules/graphql/Saving/Depot/DeleteSavingDepot.resolver";
import { GetSavingDepotResolver } from "../modules/graphql/Saving/Depot/GetSavingDepot.resolver";
import { SavingTransactionResolver } from "../modules/graphql/ClassResolver/SavingTransaction.resolver";
import { SavingDepotResolver } from "../modules/graphql/ClassResolver/SavingDepot.resolver";
import { CreateSavingTransactionResolver } from "../modules/graphql/Saving/Transaction/CreateSavingTransaction.resolver";
import { CreateSavingDepotResolver } from "../modules/graphql/Saving/Depot/CreateSavingDepot.resolver";
import { GetSavingDepotsResolver } from "../modules/graphql/Saving/Depot/GetSavingDepots.resolver";
import { buildSchema } from "type-graphql";
import { DeleteExpenseTransactionResolver } from "../modules/graphql/Expense/Transaction/DeleteExpenseTransaction.resolver";
import { Summary } from "../modules/graphql/User/summary.resolver";
import { CategorizeExpenseResolver } from "../modules/graphql/AI/CategorizeExpense.resolver";
import { CreateExpenseTransactionTemplateResolver } from "../modules/graphql/Expense/Template/CreateExpenseTransactionTemplate.resolver";
import { UpdateExpenseTransactionTemplateResolver } from "../modules/graphql/Expense/Template/UpdateExpenseTransactionTemplate.resolver";
import { DeleteExpenseTransactionTemplateResolver } from "../modules/graphql/Expense/Template/DeleteExpenseTransactionTemplate.resolver";
import { GetExpenseTransactionTemplatesResolver, GetExpenseTransactionTemplateResolver } from "../modules/graphql/Expense/Template/GetExpenseTransactionTemplates.resolver";

export const createSchema = () => {
  return buildSchema({
    resolvers: [
      UserResolver,
      GetUserResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      SignupResolver,
      ChangePasswordResolver,

      SavingDepotResolver,
      SavingTransactionResolver,
      GetSavingDepotsResolver,
      GetSavingDepotResolver,
      UpdateSavingDepotResolver,
      CreateSavingDepotResolver,
      DeleteSavingDepotResolver,
      CreateSavingTransactionResolver,
      DeleteSavingTransactionResolver,
      UpdateSavingTransactionResolver,

      ETFResolver,
      ETFTransactionResolver,
      CreateETFResolver,
      GetETFsResolver,
      GetETFResolver,
      CreateETFTransactionResolver,
      DeleteETFResolver,
      DeleteETFTransactionResolver,
      SearchETFResolver,

      ExpenseResolver,
      CreateExpenseResolver,
      DeleteExpenseResolver,
      GetExpenseResolver,
      GetExpensesResolver,
      UpdateExpenseResolver,

      ExpenseTransactionResolver,
      ExpenseTransactionTemplateResolver,
      CreateExpenseTransactionResolver,
      DeleteExpenseTransactionResolver,
      UpdateExpenseTransactionResolver,

      CreateExpenseTransactionTemplateResolver,
      UpdateExpenseTransactionTemplateResolver,
      DeleteExpenseTransactionTemplateResolver,
      GetExpenseTransactionTemplateResolver,
      GetExpenseTransactionTemplatesResolver,

      ExpenseCategoryResolver,
      CreateExpenseCategoryResolver,
      DeleteExpenseCategoryResolver,
      GetExpenseCategoriesResolver,
      GetCategoryMetadataResolver,
      UpdateExpenseCategoryResolver,

      Summary,
      
      // AI utilities
      CategorizeExpenseResolver,

      GetMarketData,
      getSupportedVsCurrencies,
      SearchCryptoCoin,
      GetCoinDetails,
      GetCoinGraphHistory,
    ],
  });
};
