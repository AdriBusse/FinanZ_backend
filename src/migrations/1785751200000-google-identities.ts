import { MigrationInterface, QueryRunner } from "typeorm";

export class googleIdentities1785751200000 implements MigrationInterface {
  name = "googleIdentities1785751200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL`);
    await queryRunner.query(`CREATE TYPE "user_identity_provider_enum" AS ENUM ('GOOGLE')`);
    await queryRunner.query(`CREATE TABLE "user_identity" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "provider" "user_identity_provider_enum" NOT NULL, "providerSubject" character varying NOT NULL, "providerEmail" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_user_identity_provider_subject" UNIQUE ("provider", "providerSubject"), CONSTRAINT "UQ_user_identity_user_provider" UNIQUE ("userId", "provider"), CONSTRAINT "PK_user_identity" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "user_identity" ADD CONSTRAINT "FK_user_identity_user" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_identity" DROP CONSTRAINT "FK_user_identity_user"`);
    await queryRunner.query(`DROP TABLE "user_identity"`);
    await queryRunner.query(`DROP TYPE "user_identity_provider_enum"`);
    await queryRunner.query(`UPDATE "Users" SET "password" = 'GOOGLE_ACCOUNT_PASSWORD_DISABLED' WHERE "password" IS NULL`);
    await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "password" SET NOT NULL`);
  }
}
