import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1685174601072 implements MigrationInterface {
    name = 'migration1685174601072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "middleName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "middleName"`);
    }

}
