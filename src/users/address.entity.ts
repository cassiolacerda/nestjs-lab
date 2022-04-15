import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import User from './user.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  @Expose()
  public country: string;

  @OneToOne(() => User, (user: User) => user.address)
  public user?: User;
}

export default Address;
