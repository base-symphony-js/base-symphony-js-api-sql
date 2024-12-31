import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ description: 'Title in english', required: true })
  @IsString()
  @IsNotEmpty()
  public title_en: string

  @ApiProperty({ description: 'Title in spanish', required: true })
  @IsString()
  @IsNotEmpty()
  public title_es: string

  @ApiProperty({ description: 'Description in english', required: false })
  @IsString()
  @IsOptional()
  public description_en: string

  @ApiProperty({ description: 'Description in spanish', required: false })
  @IsString()
  @IsOptional()
  public description_es: string

  @ApiProperty({ description: 'State', required: true })
  @IsBoolean()
  @IsNotEmpty()
  public state: boolean
}
