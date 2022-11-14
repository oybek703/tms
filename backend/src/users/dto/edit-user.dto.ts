import { ApiProperty } from '@nestjs/swagger'

export class EditUserDto {
  @ApiProperty()
  newUsername: string
  @ApiProperty()
  newPassword: string
  @ApiProperty()
  confirmNewPassword: string
  @ApiProperty({ type: String })
  allowedPages: string[] | 'ALL'
}
