import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordReset1786503267725 implements MigrationInterface {
  name = 'AddPasswordReset1786503267725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "resetPasswordTokenHash" text`,
    );

    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "resetPasswordExpiresAt" datetime`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "resetPasswordExpiresAt"`,
    );

    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "resetPasswordTokenHash"`,
    );
  }
}
