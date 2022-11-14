import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AdminGuard } from '../auth/admin.guard'
import { ApiBearerAuth } from '@nestjs/swagger'

export function UsersGuard() {
  return applyDecorators(UseGuards(JwtAuthGuard, AdminGuard), ApiBearerAuth())
}
