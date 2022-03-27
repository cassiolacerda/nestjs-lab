import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import User from '../users/user.entity';

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
}

export default Post;
