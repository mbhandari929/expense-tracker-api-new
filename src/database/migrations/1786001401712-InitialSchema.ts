import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1786001401712 implements MigrationInterface {
  name = 'InitialSchema1786001401712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "income" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "source" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "openingBalance" integer NOT NULL DEFAULT (0), "incomeSources" text NOT NULL, "expenseSources" text NOT NULL, "monthlyBudgets" text NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TABLE "income"`);
    await queryRunner.query(`DROP TABLE "expense"`);
  }
}
