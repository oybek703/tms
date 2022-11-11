import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    schema: { example: { token: 'some-token', userName: 'test_user', role: 'USER', pages: '' } }
  })
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
}
