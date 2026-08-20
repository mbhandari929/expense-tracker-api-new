import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAuthentication1786431570363 implements MigrationInterface {
  name = 'AddUserAuthentication1786431570363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_expense"("id", "text", "amount", "date") SELECT "id", "text", "amount", "date" FROM "expense"`,
    );
    await queryRunner.query(`DROP TABLE "expense"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_expense" RENAME TO "expense"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_income" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "source" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_income"("id", "source", "amount", "date") SELECT "id", "source", "amount", "date" FROM "income"`,
    );
    await queryRunner.query(`DROP TABLE "income"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_income" RENAME TO "income"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "openingBalance" integer NOT NULL DEFAULT (0), "incomeSources" text NOT NULL, "expenseSources" text NOT NULL, "monthlyBudgets" text NOT NULL, "userId" integer, CONSTRAINT "UQ_0a56da3ae04c90ab62f2e355b19" UNIQUE ("userId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_settings"("id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets") SELECT "id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets" FROM "settings"`,
    );
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_settings" RENAME TO "settings"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_expense"("id", "text", "amount", "date", "userId") SELECT "id", "text", "amount", "date", "userId" FROM "expense"`,
    );
    await queryRunner.query(`DROP TABLE "expense"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_expense" RENAME TO "expense"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_income" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "source" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_0965fe0d5faa3b2e7518d7bb244" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_income"("id", "source", "amount", "date", "userId") SELECT "id", "source", "amount", "date", "userId" FROM "income"`,
    );
    await queryRunner.query(`DROP TABLE "income"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_income" RENAME TO "income"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "openingBalance" integer NOT NULL DEFAULT (0), "incomeSources" text NOT NULL, "expenseSources" text NOT NULL, "monthlyBudgets" text NOT NULL, "userId" integer, CONSTRAINT "UQ_0a56da3ae04c90ab62f2e355b19" UNIQUE ("userId"), CONSTRAINT "FK_9175e059b0a720536f7726a88c7" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_settings"("id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets", "userId") SELECT "id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets", "userId" FROM "settings"`,
    );
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_settings" RENAME TO "settings"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings" RENAME TO "temporary_settings"`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "openingBalance" integer NOT NULL DEFAULT (0), "incomeSources" text NOT NULL, "expenseSources" text NOT NULL, "monthlyBudgets" text NOT NULL, "userId" integer, CONSTRAINT "UQ_0a56da3ae04c90ab62f2e355b19" UNIQUE ("userId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "settings"("id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets", "userId") SELECT "id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets", "userId" FROM "temporary_settings"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_settings"`);
    await queryRunner.query(
      `ALTER TABLE "income" RENAME TO "temporary_income"`,
    );
    await queryRunner.query(
      `CREATE TABLE "income" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "source" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "income"("id", "source", "amount", "date", "userId") SELECT "id", "source", "amount", "date", "userId" FROM "temporary_income"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_income"`);
    await queryRunner.query(
      `ALTER TABLE "expense" RENAME TO "temporary_expense"`,
    );
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "expense"("id", "text", "amount", "date", "userId") SELECT "id", "text", "amount", "date", "userId" FROM "temporary_expense"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_expense"`);
    await queryRunner.query(
      `ALTER TABLE "settings" RENAME TO "temporary_settings"`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "openingBalance" integer NOT NULL DEFAULT (0), "incomeSources" text NOT NULL, "expenseSources" text NOT NULL, "monthlyBudgets" text NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "settings"("id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets") SELECT "id", "openingBalance", "incomeSources", "expenseSources", "monthlyBudgets" FROM "temporary_settings"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_settings"`);
    await queryRunner.query(
      `ALTER TABLE "income" RENAME TO "temporary_income"`,
    );
    await queryRunner.query(
      `CREATE TABLE "income" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "source" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "income"("id", "source", "amount", "date") SELECT "id", "source", "amount", "date" FROM "temporary_income"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_income"`);
    await queryRunner.query(
      `ALTER TABLE "expense" RENAME TO "temporary_expense"`,
    );
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "amount" integer NOT NULL, "date" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "expense"("id", "text", "amount", "date") SELECT "id", "text", "amount", "date" FROM "temporary_expense"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_expense"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
