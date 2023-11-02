import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
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

  // 这个属性不会存到数据库
  @OneToMany(() => Link, (link) => link.user)
  links: Link[]
}
