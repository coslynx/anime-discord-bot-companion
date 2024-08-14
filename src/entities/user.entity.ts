import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { List } from '../../list/entities/list.entity';
import { MMORPG } from '../../mmorpg/entities/mmorpg.entity';
import { UserRole } from '../../auth/enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  roles: UserRole[];

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => List, (list) => list.user)
  lists: List[];

  @OneToMany(() => MMORPG, (mmorpg) => mmorpg.user)
  mmorpgCharacters: MMORPG[];
}