import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import {Link} from "../link/link.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ''})
  email: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column()
  password: string;

  @Column({default: ''})
  nickName: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    default: ''
  })
  createTime: string;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '修改时间',
    default: ''
  })
  updateTime: string;

  @DeleteDateColumn({nullable: false})
  deleteFlag: string;

}
