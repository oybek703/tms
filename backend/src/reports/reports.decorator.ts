import { applyDecorators, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ReportGuard } from '../auth/report.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ReportsPaths } from './reports-paths'

export function Report(tagName: string, routeName: ReportsPaths, forAll = false) {
  if (forAll) {
    return applyDecorators(
      ApiTags(tagName),
      ApiQuery({ name: 'date', type: () => Date, example: '2022-11-08' }),
      UseGuards(JwtAuthGuard),
      ApiBearerAuth(),
      Get(routeName)
    )
  }
  return applyDecorators(
    ApiTags(tagName),
    ApiQuery({ name: 'date', type: () => Date, example: '2022-11-08' }),
    UseGuards(JwtAuthGuard, ReportGuard),
    ApiBearerAuth(),
    Get(routeName)
  )
}

export function ReportBetweenDates(tagName: string, routeName: ReportsPaths, forAll = false) {
  if (forAll) {
    return applyDecorators(
      ApiTags(tagName),
      ApiQuery({ name: 'secondDate', type: () => Date, example: '2022-11-08' }),
      ApiQuery({ name: 'firstDate', type: () => Date, example: '2022-11-03' }),
      UseGuards(JwtAuthGuard),
      ApiBearerAuth(),
      Get(routeName)
    )
  }
  return applyDecorators(
    ApiTags(tagName),
    ApiQuery({ name: 'secondDate', type: () => Date, example: '2022-11-08' }),
    ApiQuery({ name: 'firstDate', type: () => Date, example: '2022-11-03' }),
    UseGuards(JwtAuthGuard, ReportGuard),
    ApiBearerAuth(),
    Get(routeName)
  )
}

export function ReportLastUpdate(tagName: string, routeName: ReportsPaths) {
  return applyDecorators(
    ApiTags(tagName),
    ApiOkResponse({ schema: { example: { lastUpdate: '9-ноябрь, 13:59:18' } } }),
    Get(routeName)
  )
}

export function ReportWithoutDate(tagName: string, routeName: ReportsPaths) {
  return applyDecorators(
    ApiTags(tagName),
    UseGuards(JwtAuthGuard, ReportGuard),
    ApiBearerAuth(),
    Get(routeName)
  )
}

export function ReportOperDays() {
  return applyDecorators(
    ApiTags('OperDays'),
    ApiOkResponse({
      schema: {
        example: { dates: ['2022-11-09', '2022-11-08'] }
      }
    }),
    Get('operDays')
  )
}

export function ReportGapManual(httpCode) {
  return applyDecorators(
    ApiTags('Gap analyze'),
    UseGuards(JwtAuthGuard, ReportGuard),
    ApiBearerAuth(),
    HttpCode(httpCode)
  )
}
