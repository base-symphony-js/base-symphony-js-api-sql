import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
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

  @ApiProperty({ description: 'State', required: true })
  @IsBoolean()
  @IsNotEmpty()
  public state: boolean
}
