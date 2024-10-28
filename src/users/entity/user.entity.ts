import { Column, DefaultNamingStrategy, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEmail, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entity/wish.entity';
import { Offer } from '../../offers/entity/offer.entity';
import { Wishlist } from '../../wishlists/entity/wishlist.entity';

@Entity()
@Unique(['email', 'username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе'})
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300'})
  @IsUrl()
  avatar: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];
}
