import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: 'First name', required: true })
  @IsString()
  @IsNotEmpty()
  public firstName: string

  @ApiProperty({ description: 'Last name', required: false })
  @IsString()
  @IsOptional()
  public lastName: string

  @ApiProperty({ description: 'Email', required: true })
  @IsString()
  @IsNotEmpty()
  public email: string

  @ApiProperty({ description: 'Phonenumber', required: false })
  @IsString()
  @IsOptional()
  public phoneNumber: string

  @ApiProperty({ description: 'Photo', required: false })
  @IsString()
  @IsOptional()
  public photo: string

  @ApiProperty({ description: 'Password', required: true })
  @IsString()
  @IsNotEmpty()
  public password: string
}
