import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Type } from 'class-transformer'
import { OmitType, PartialType } from '@nestjs/swagger'

@Entity({ name: 'cats' })
export class Cat extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Type(() => Number)
  @IsNumber()
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
  @IsString()
  photo?: string

  @Column({ type: 'decimal' })
  @IsNumber()
  @Type(() => Number)
  cost: number

  @Column({ type: 'bool', default: false })
  @Type(() => Boolean)
  @IsBoolean()
  booked: boolean
}

export class AddCatDto extends OmitType(Cat, [
  'id',
  'booked',
  'photo',
] as const) {}

export class UpdateCatDto extends PartialType(
  OmitType(Cat, ['booked', 'photo'] as const)
) {}
