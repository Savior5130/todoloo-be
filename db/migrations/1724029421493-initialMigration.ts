import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1724029421493 implements MigrationInterface {
    name = 'InitialMigration1724029421493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
