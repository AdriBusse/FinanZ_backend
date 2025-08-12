import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1685174375771 implements MigrationInterface {
    name = 'migration1685174375771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expense" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "currency" character varying DEFAULT '€', "archived" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expenseTransaction" ("id" SERIAL NOT NULL, "describtion" character varying NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "expenseId" integer, "categoryId" integer, CONSTRAINT "PK_6567149e0f654f59fc801343652" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" character varying, "icon" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_478b68a9314d8787fb3763a2298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saving_depot" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "short" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_0276ab985b1e61b63106a1f986f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saving_transaction" ("id" SERIAL NOT NULL, "describtion" character varying NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "depotId" integer, CONSTRAINT "PK_6028ba1dd83a6da03e8bc1c4bc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "password" character varying NOT NULL, "email" text NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "etf_transaction" ("id" SERIAL NOT NULL, "invest" double precision NOT NULL DEFAULT '0', "fee" double precision NOT NULL DEFAULT '0', "amount" double precision NOT NULL DEFAULT '0', "value" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "etfId" integer, CONSTRAINT "PK_ff1bf2556a311435c66e1ed8d9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "etf" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "title" character varying NOT NULL, "symbol" character varying NOT NULL, "isin" character varying NOT NULL, "wkn" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_f8ab7ecb7ec6b4079e471ea45ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expenseTransaction" ADD CONSTRAINT "FK_8acf0d84d005f92fb8d3446ced0" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expenseTransaction" ADD CONSTRAINT "FK_31e2c0602d1c643b4b0213d6023" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expenseTransaction" ADD CONSTRAINT "FK_dfb3d7a39afb5267660408727b2" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_category" ADD CONSTRAINT "FK_793bdeaec528b4a6a238bfff337" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saving_depot" ADD CONSTRAINT "FK_876cc35e4b3a85a42f140737635" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saving_transaction" ADD CONSTRAINT "FK_0dc0a913cd047d210f5e9c75a0f" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saving_transaction" ADD CONSTRAINT "FK_228edcb56ebba2b75d453a212fa" FOREIGN KEY ("depotId") REFERENCES "saving_depot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "etf_transaction" ADD CONSTRAINT "FK_05bac749b270b099c59d5b3b07d" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "etf_transaction" ADD CONSTRAINT "FK_bbefd86bf2b5222b3a82e0e27aa" FOREIGN KEY ("etfId") REFERENCES "etf"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "etf" ADD CONSTRAINT "FK_3b4eee105174eb5aaf5890eeedc" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "etf" DROP CONSTRAINT "FK_3b4eee105174eb5aaf5890eeedc"`);
        await queryRunner.query(`ALTER TABLE "etf_transaction" DROP CONSTRAINT "FK_bbefd86bf2b5222b3a82e0e27aa"`);
        await queryRunner.query(`ALTER TABLE "etf_transaction" DROP CONSTRAINT "FK_05bac749b270b099c59d5b3b07d"`);
        await queryRunner.query(`ALTER TABLE "saving_transaction" DROP CONSTRAINT "FK_228edcb56ebba2b75d453a212fa"`);
        await queryRunner.query(`ALTER TABLE "saving_transaction" DROP CONSTRAINT "FK_0dc0a913cd047d210f5e9c75a0f"`);
        await queryRunner.query(`ALTER TABLE "saving_depot" DROP CONSTRAINT "FK_876cc35e4b3a85a42f140737635"`);
        await queryRunner.query(`ALTER TABLE "expense_category" DROP CONSTRAINT "FK_793bdeaec528b4a6a238bfff337"`);
        await queryRunner.query(`ALTER TABLE "expenseTransaction" DROP CONSTRAINT "FK_dfb3d7a39afb5267660408727b2"`);
        await queryRunner.query(`ALTER TABLE "expenseTransaction" DROP CONSTRAINT "FK_31e2c0602d1c643b4b0213d6023"`);
        await queryRunner.query(`ALTER TABLE "expenseTransaction" DROP CONSTRAINT "FK_8acf0d84d005f92fb8d3446ced0"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_06e076479515578ab1933ab4375"`);
        await queryRunner.query(`DROP TABLE "etf"`);
        await queryRunner.query(`DROP TABLE "etf_transaction"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "saving_transaction"`);
        await queryRunner.query(`DROP TABLE "saving_depot"`);
        await queryRunner.query(`DROP TABLE "expense_category"`);
        await queryRunner.query(`DROP TABLE "expenseTransaction"`);
        await queryRunner.query(`DROP TABLE "expense"`);
    }

}
