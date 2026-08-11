import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import bcrypt from 'bcryptjs'

export type UserRole = 'admin' | 'user'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 160 })
  fullname!: string

  @Column({ length: 80, unique: true })
  username!: string

  @Column({ length: 255 })
  password!: string

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role!: UserRole

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password || this.password.startsWith('$2')) {
      return
    }

    this.password = await bcrypt.hash(this.password, 12)
  }
}
