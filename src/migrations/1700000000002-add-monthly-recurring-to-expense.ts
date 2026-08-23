import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMonthlyRecurringToExpense1700000000002
  implements MigrationInterface
{
  name = "AddMonthlyRecurringToExpense1700000000002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expense"
      ADD COLUMN IF NOT EXISTS "monthlyRecurring" boolean NOT NULL DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expense"
      DROP COLUMN IF EXISTS "monthlyRecurring";
    `);
  }
}
