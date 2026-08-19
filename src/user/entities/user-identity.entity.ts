import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { AuthProvider } from "../../auth/types/auth-provider.enum";
import { User } from "./user.entity";

@Entity({ name: "user_identity" })
@Unique("UQ_user_identity_provider_subject", ["provider", "providerSubject"])
@Unique("UQ_user_identity_user_provider", ["userId", "provider"])
export class UserIdentity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.identities, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "enum", enum: AuthProvider })
  provider: AuthProvider;

  @Column()
  providerSubject: string;

  @Column("text")
  providerEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastUsedAt: Date;
}
