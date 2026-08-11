import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 120 })
  name!: string

  @Column({ length: 120 })
  surname!: string

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null

  @Column({ type: 'varchar', length: 160, nullable: true })
  email!: string | null

  @Column({ type: 'varchar', length: 120, nullable: true })
  relationship!: string | null

  @Column({ type: 'int', default: 0 })
  priority!: number

  @Column({ name: 'guest_group', type: 'varchar', length: 120, nullable: true })
  group!: string | null

  @Column({ type: 'text', nullable: true })
  notes!: string | null

  @Column({ name: 'already_invited', default: false })
  alreadyInvited!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
