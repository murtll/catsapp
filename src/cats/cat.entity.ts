import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Type } from 'class-transformer'

@Entity({ name: 'cats' })
export class Cat extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  id: number

  @Column({ type: 'text' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name: string

  @Column({ type: 'text' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  color: string

  @Column({ type: 'text' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  breed: string

  @Column({ type: 'int' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  age: number

  @Column({ type: 'text', nullable: true })
  @Type(() => String)
  photo?: string

  @Column({ type: 'decimal' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cost: number

  @Column({ type: 'bool', default: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  booked: boolean
}
