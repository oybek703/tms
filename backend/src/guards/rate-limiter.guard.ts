import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler'
import { ExecutionContext } from '@nestjs/common'

export class RateThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(context: ExecutionContext) {
    throw new ThrottlerException('Too many requests. Please try later!')
  }
}
