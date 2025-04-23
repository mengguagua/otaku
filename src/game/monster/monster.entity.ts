import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity()
export class MonsterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({default: ''})
  name: string;

  // 图片
  @Column({default: ''})
  url: string;

  @DeleteDateColumn({nullable: false})
  deleteFlag: string;

  @Column({default: 100})
  blood: Number;

  @Column({ default: 1 })
  attack: Number;

  // 0无，1火，2水
  @Column({ default: 0 })
  element: Number;

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
