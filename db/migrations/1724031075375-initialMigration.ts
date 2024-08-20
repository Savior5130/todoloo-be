import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1724031075375 implements MigrationInterface {
    name = 'InitialMigration1724031075375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "author_id" varchar NOT NULL, "assigned_id" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "todo"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
