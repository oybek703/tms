import { ApiProperty } from '@nestjs/swagger'

export class AddUserDto {
  @ApiProperty()
  userName: string

  @ApiProperty()
  password: string

  @ApiProperty()
  confirmPassword: string

  @ApiProperty()
  allowedPages: string
}
