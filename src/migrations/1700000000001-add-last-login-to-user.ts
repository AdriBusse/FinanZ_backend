import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastLoginToUser1700000000001 implements MigrationInterface {
  name = "AddLastLoginToUser1700000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Users" DROP COLUMN IF EXISTS "lastLogin";
    `);
  }
}
