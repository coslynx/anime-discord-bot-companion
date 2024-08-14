import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('text', { array: true })
  animeIds: number[];

  @ManyToOne(() => User, (user) => user.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}