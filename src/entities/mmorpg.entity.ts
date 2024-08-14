import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('mmorpg_characters')
export class MMORPG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  anime: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: 0 })
  coins: number;

  @Column('text', { array: true, default: [] })
  inventory: number[];

  @Column({ nullable: true })
  profilePicture: string;

  @ManyToOne(() => User, (user) => user.mmorpgCharacters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}