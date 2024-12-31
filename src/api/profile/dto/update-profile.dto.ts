import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileDto {
  @ApiProperty({ description: 'First name', required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public firstName: string

  @ApiProperty({ description: 'Last name', required: false })
  @IsString()
  @IsOptional()
  public lastName: string

  @ApiProperty({ description: 'Phonenumber', required: false })
  @IsString()
  @IsOptional()
  public phoneNumber: string

  @ApiProperty({ description: 'Photo', required: false })
  @IsString()
  @IsOptional()
  public photo: string
}
