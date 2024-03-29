import { ApiProperty } from '@nestjs/swagger'

export enum GapColNames {
  nationalCurrency = 'NATIONAL_CURRENCY',
  usd = 'USD',
  eur = 'EUR'
}

export class UpdateGapDto {
  @ApiProperty({ enum: GapColNames })
  colName: string

  @ApiProperty()
  newValue: number

  @ApiProperty()
  role: string

  @ApiProperty()
  date: string

  @ApiProperty()
  source: string
}
