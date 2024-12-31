import { IsArray, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

// Define PermissionDto
export class PermissionDto {
  @ApiProperty({ description: 'The name of the permission', required: true })
  @IsString()
  @IsNotEmpty()
  public permission: string

  @ApiProperty({
    description: 'List of actions associated with the permission',
    required: true,
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  public actions: string[]
}

// Define the parent DTO that holds an array of PermissionDto
export class PermissionManagementDto {
  @ApiProperty({
    description: 'Array of permissions with actions',
    required: true,
    type: [PermissionDto], // specify that it's an array of PermissionDto
  })
  @IsArray()
  @IsNotEmpty()
  public permissions: PermissionDto[]
}
