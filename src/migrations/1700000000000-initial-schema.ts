import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
  name = "InitialSchema1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        "id" SERIAL NOT NULL,
        "username" character varying NOT NULL,
        "firstName" character varying,
        "middleName" character varying,
        "lastName" character varying,
        "password" character varying,
        "email" text NOT NULL,
        "confirmed" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"),
        CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"),
        CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id")
      )
    `);

    // Ensure all Users columns & nullable password exist for existing tables
    await queryRunner.query(`
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "firstName" character varying;
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "middleName" character varying;
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "lastName" character varying;
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "confirmed" boolean NOT NULL DEFAULT false;
      ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL;
    `);

    // 2. User identities (Google auth, etc.)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_identity_provider_enum" AS ENUM ('GOOGLE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_identity" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "provider" "user_identity_provider_enum" NOT NULL,
        "providerSubject" character varying NOT NULL,
        "providerEmail" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "lastUsedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_identity_provider_subject" UNIQUE ("provider", "providerSubject"),
        CONSTRAINT "UQ_user_identity_user_provider" UNIQUE ("userId", "provider"),
        CONSTRAINT "PK_user_identity" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "user_identity" ADD CONSTRAINT "FK_user_identity_user" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 3. Expense depots
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "expense" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "currency" character varying DEFAULT '€',
        "archived" boolean NOT NULL DEFAULT false,
        "spendingLimit" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" integer,
        CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "expense" ADD COLUMN IF NOT EXISTS "currency" character varying DEFAULT '€';
      ALTER TABLE "expense" ADD COLUMN IF NOT EXISTS "archived" boolean NOT NULL DEFAULT false;
      ALTER TABLE "expense" ADD COLUMN IF NOT EXISTS "spendingLimit" integer;
      ALTER TABLE "expense" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "expense" ADD CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 4. Expense categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "expense_category" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "color" character varying,
        "icon" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" integer,
        CONSTRAINT "PK_478b68a9314d8787fb3763a2298" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_category" ADD COLUMN IF NOT EXISTS "color" character varying;
      ALTER TABLE "expense_category" ADD COLUMN IF NOT EXISTS "icon" character varying;
      ALTER TABLE "expense_category" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "expense_category" ADD CONSTRAINT "FK_793bdeaec528b4a6a238bfff337" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 5. Expense transactions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "expenseTransaction" (
        "id" SERIAL NOT NULL,
        "describtion" character varying NOT NULL,
        "amount" double precision NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        "expenseId" integer,
        "categoryId" integer,
        CONSTRAINT "PK_6567149e0f654f59fc801343652" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "expenseTransaction" ADD CONSTRAINT "FK_8acf0d84d005f92fb8d3446ced0" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      DO $$ BEGIN
        ALTER TABLE "expenseTransaction" ADD CONSTRAINT "FK_31e2c0602d1c643b4b0213d6023" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      DO $$ BEGIN
        ALTER TABLE "expenseTransaction" ADD CONSTRAINT "FK_dfb3d7a39afb5267660408727b2" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 6. Expense transaction templates
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "expense_transaction_template" (
        "id" SERIAL NOT NULL,
        "describtion" character varying NOT NULL,
        "amount" double precision NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        "expenseId" integer,
        "categoryId" integer,
        CONSTRAINT "PK_expense_transaction_template" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "expense_template_user" ADD CONSTRAINT "FK_expense_template_user" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN undefined_table THEN null;
        WHEN duplicate_object THEN null;
      END $$;
      DO $$ BEGIN
        ALTER TABLE "expense_transaction_template" ADD CONSTRAINT "FK_expense_template_user" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      DO $$ BEGIN
        ALTER TABLE "expense_transaction_template" ADD CONSTRAINT "FK_expense_template_expense" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      DO $$ BEGIN
        ALTER TABLE "expense_transaction_template" ADD CONSTRAINT "FK_expense_template_category" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 7. Saving depots
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "saving_depot" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "short" character varying NOT NULL,
        "currency" character varying DEFAULT '€',
        "savinggoal" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        CONSTRAINT "PK_0276ab985b1e61b63106a1f986f" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "saving_depot" ADD COLUMN IF NOT EXISTS "currency" character varying DEFAULT '€';
      ALTER TABLE "saving_depot" ADD COLUMN IF NOT EXISTS "savinggoal" integer;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "saving_depot" ADD CONSTRAINT "FK_876cc35e4b3a85a42f140737635" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 8. Saving transactions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "saving_transaction" (
        "id" SERIAL NOT NULL,
        "describtion" character varying NOT NULL,
        "amount" double precision NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        "depotId" integer,
        CONSTRAINT "PK_6028ba1dd83a6da03e8bc1c4bc3" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "saving_transaction" ADD CONSTRAINT "FK_0dc0a913cd047d210f5e9c75a0f" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      DO $$ BEGIN
        ALTER TABLE "saving_transaction" ADD CONSTRAINT "FK_228edcb56ebba2b75d453a212fa" FOREIGN KEY ("depotId") REFERENCES "saving_depot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 9. ETFs
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "etf" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "title" character varying NOT NULL,
        "symbol" character varying NOT NULL,
        "isin" character varying NOT NULL,
        "wkn" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        CONSTRAINT "PK_f8ab7ecb7ec6b4079e471ea45ee" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "etf" ADD CONSTRAINT "FK_3b4eee105174eb5aaf5890eeedc" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 10. ETF transactions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "etf_transaction" (
        "id" SERIAL NOT NULL,
        "invest" double precision NOT NULL DEFAULT '0',
        "fee" double precision NOT NULL DEFAULT '0',
        "amount" double precision NOT NULL DEFAULT '0',
        "value" double precision NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        "etfId" integer,
        CONSTRAINT "PK_ff1bf2556a311435c66e1ed8d9e" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "etf_transaction" ADD CONSTRAINT "FK_05bac749b270b099c59d5b3b07d" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      DO $$ BEGIN
        ALTER TABLE "etf_transaction" ADD CONSTRAINT "FK_bbefd86bf2b5222b3a82e0e27aa" FOREIGN KEY ("etfId") REFERENCES "etf"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "etf_transaction"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "etf"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "saving_transaction"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "saving_depot"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expense_transaction_template"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expenseTransaction"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expense_category"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expense"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_identity"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_identity_provider_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Users"`);
  }
}
