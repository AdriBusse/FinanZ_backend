import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNullOnExpenseCategoryDelete1700000000003
  implements MigrationInterface
{
  name = "SetNullOnExpenseCategoryDelete1700000000003";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expenseTransaction"
      DROP CONSTRAINT IF EXISTS "FK_dfb3d7a39afb5267660408727b2";

      ALTER TABLE "expenseTransaction"
      ADD CONSTRAINT "FK_dfb3d7a39afb5267660408727b2"
      FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "expenseTransaction"
      DROP CONSTRAINT IF EXISTS "FK_dfb3d7a39afb5267660408727b2";

      ALTER TABLE "expenseTransaction"
      ADD CONSTRAINT "FK_dfb3d7a39afb5267660408727b2"
      FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);
  }
}
