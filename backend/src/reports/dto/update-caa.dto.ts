import { ApiProperty } from '@nestjs/swagger'
import { CAABankData } from '../../core/dealing-operations/corr-accounts-anaylze/caa.interface'

export enum CAAColNames {
  imports = 'IMPORTS',
  exports = 'EXPORTS',
  tradingFin = 'TRADING_FIN',
  mbd = 'INTER_BANK_DEPOSIT',
  fx = 'FX',
  creditLine = 'CREDIT_LINE',
  vostro = 'VOSTRO',
  otherOperations = 'OTHER_OPERATIONS',
  corrAccounts = 'CORR_ACCOUNTS',
  genAgreement = 'GEN_AGREEMENT',
  isda = 'ISDA',
  otherAgreement = 'OTHER_AGREEMENT',
  serviceSize = 'VOLUME_OPERATIONS',
  serviceSpeed = 'SERVICE_SPEED',
  serviceQuality = 'SERVICE_QUALITY',
  serviceCost = 'SERVICE_COST'
}

export class UpdateCAADto {
  @ApiProperty()
  matrixId: number

  @ApiProperty({ enum: CAAColNames })
  colName: keyof CAABankData

  @ApiProperty()
  value: string | null | number
}
