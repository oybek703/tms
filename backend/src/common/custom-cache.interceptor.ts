import { CacheInterceptor, ExecutionContext } from '@nestjs/common'
import { IGNORE_CACHING } from './common.constants'

export class CustomCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const ignoringCache: boolean = this.reflector.get(IGNORE_CACHING, context.getHandler())
    return !ignoringCache || request.method !== 'GET'
  }
}
