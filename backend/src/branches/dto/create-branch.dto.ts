import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  address: string

  @IsOptional()
  @IsString()
  phone?: string
}
