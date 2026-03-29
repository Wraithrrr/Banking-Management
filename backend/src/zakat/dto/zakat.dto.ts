import { IsEnum, IsNumber, IsString, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ZakatType, ZakatCategory } from '../entities/zakat-transaction.entity'

export class CreateZakatDto {
  @IsEnum(ZakatType)
  type: ZakatType

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  amount: number

  @IsEnum(ZakatCategory)
  category: ZakatCategory

  @IsString()
  description: string

  @IsString()
  @IsOptional()
  referenceId?: string
}
