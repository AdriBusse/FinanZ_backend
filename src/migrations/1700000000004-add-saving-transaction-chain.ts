import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSavingTransactionChain1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saving_transaction" ADD "parentTransactionId" integer`);
    await queryRunner.query(`ALTER TABLE "saving_transaction" ADD CONSTRAINT "FK_saving_transaction_parent" FOREIGN KEY ("parentTransactionId") REFERENCES "saving_transaction"("id") ON DELETE SET NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_saving_transaction_parent" ON "saving_transaction" ("parentTransactionId")`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saving_transaction" DROP COLUMN "parentTransactionId"`);
  }
}
