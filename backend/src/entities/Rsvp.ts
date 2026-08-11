import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export type RsvpAttendance = 'yes' | 'no'

@Entity('rsvps')
export class Rsvp {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 160 })
  name!: string

  @Column({ type: 'char', length: 10, unique: true })
  phone!: string

  @Column({ type: 'enum', enum: ['yes', 'no'] })
  attendance!: RsvpAttendance

  @Column({ name: 'guest_count', type: 'tinyint', unsigned: true, default: 0 })
  guestCount!: number

  @Column({ type: 'text', nullable: true })
  note!: string | null

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date
}
