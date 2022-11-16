import { SetMetadata } from '@nestjs/common'
import { IGNORE_CACHING } from './common.constants'

export const NoCache = () => SetMetadata(IGNORE_CACHING, true)
