import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import Post from '../posts/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column()
  @Expose()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  @Expose()
  public posts: Post[];

  @DeleteDateColumn()
  @Expose()
  public deletedAt: Date;
}

export default Category;
