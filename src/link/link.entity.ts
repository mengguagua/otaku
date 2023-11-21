import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  CreateDateColumn,
  DeleteDateColumn, UpdateDateColumn
} from 'typeorm';
import {User} from "../user/user.entity";

export enum linkType {
  NEWS = '新闻',
  GAME = '游戏',
  TECHNOLOGY = '技术',
  QA = '问答',
  HAPPY = '乐趣',
  OTHER = '其它',
}

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({default: ''})
  name: string;

  @Column({
    // unique: true,
    default: ''
  })
  url: string;

  @DeleteDateColumn({nullable: false})
  deleteFlag: string;

  @Column({default: 0})
  clickNumber: string;

  @Column({ default: false })
  isPublic: boolean;

  // 点赞数
  @Column({default: 0})
  goodNumber: string;

  @Column({
    type: 'enum',
    enum: linkType,
    default: linkType.HAPPY,
  })
  type: linkType;

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

  // @ManyToOne(() => User, (user) => user.links)
  // user: User
  //
  // @RelationId((link: Link) => link.user)
  // userId: number;

  @Column({default: null})
  userId: number;

}
