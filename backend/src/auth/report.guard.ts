import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { User } from './auth.interface'

export class ReportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const path = request.path.replace('/api', '')
    const user: User = request.user
    if (user.allowedPages === 'ALL') return true
    if (!user.allowedPages) throw new ForbiddenException('access_denied')
    const allowedPagesArray = user.allowedPages.split(',')
    if (!allowedPagesArray.includes(path)) throw new ForbiddenException('access_denied')
    return true
  }
}
