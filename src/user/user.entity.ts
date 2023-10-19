import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ''})
  email: string;

  @Column({
    default: '',
    unique: true,
  })
  phone: string;

  @Column({default: ''})
  nickName: string;

  @Column({ default: true })
  isActive: boolean;
}
