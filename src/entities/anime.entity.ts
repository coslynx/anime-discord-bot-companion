import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('anime')
export class Anime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  synopsis: string;

  @Column('text', { array: true, default: [] })
  genres: string[];

  @Column('text', { array: true, default: [] })
  studios: string[];

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  malId: number;

  @Column({ nullable: true })
  rating: number;

  @ManyToOne(() => User, (user) => user.animeList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}