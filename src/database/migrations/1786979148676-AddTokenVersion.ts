import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class AddTokenVersion1786979148676
  implements MigrationInterface
{
  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    const hasTokenVersion =
      await queryRunner.hasColumn(
        'user',
        'tokenVersion',
      );

    if (hasTokenVersion) {
      return;
    }

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'tokenVersion',
        type: 'integer',
        isNullable: false,
        default: 0,
      }),
    );
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    const hasTokenVersion =
      await queryRunner.hasColumn(
        'user',
        'tokenVersion',
      );

    if (!hasTokenVersion) {
      return;
    }

    await queryRunner.dropColumn(
      'user',
      'tokenVersion',
    );
  }
}