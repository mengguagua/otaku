import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity()
export class GamerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({default: ''})
  name: string;

  @Column({default: ''})
  url: string;

  @DeleteDateColumn({nullable: false})
  deleteFlag: string;

  @Column({default: 50})
  blood: Number;

  // 盾
  @Column({default: 0})
  shield: Number;

  // 状态
  @Column({default: ''})
  status: string;

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

}
