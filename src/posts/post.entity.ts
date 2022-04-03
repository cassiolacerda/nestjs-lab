import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Expose } from 'class-transformer';
import User from '../users/user.entity';
import Category from '../categories/category.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column()
  @Expose()
  public title: string;

  @Column()
  public content: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  @Expose()
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @Expose()
  @JoinTable()
  public categories: Category[];
}

export default Post;
