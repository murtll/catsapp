import { IsNumber, IsString } from 'class-validator'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Type } from 'class-transformer'

@Entity({ name: 'cats' })
export class Cat extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Type(() => Number)
  id: number

  @Column({ type: 'text' })
  @IsString()
  @Type(() => String)
  name: string

  @Column({ type: 'text' })
  @IsString()
  @Type(() => String)
  color: string

  @Column({ type: 'text' })
  @IsString()
  @Type(() => String)
  breed: string

  @Column({ type: 'int' })
  @IsNumber()
  @Type(() => Number)
  age: number

  @Column({ type: 'text', nullable: true })
  @Type(() => String)
  photo?: string

  @Column({ type: 'decimal' })
  @IsNumber()
  @Type(() => Number)
  cost: number

  @Column({ type: 'bool', default: false })
  @Type(() => Boolean)
  booked: boolean
}
