import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  resetPasswordTokenHash!: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  resetPasswordExpiresAt!: Date | null;
}
