"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGapManual = exports.ReportOperDays = exports.ReportWithoutDate = exports.ReportLastUpdate = exports.ReportBetweenDates = exports.Report = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const report_guard_1 = require("../auth/report.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
function Report(tagName, routeName, forAll = false) {
    if (forAll) {
        return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tagName), (0, swagger_1.ApiQuery)({ name: 'date', type: () => Date, example: '2022-11-08' }), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Get)(routeName));
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tagName), (0, swagger_1.ApiQuery)({ name: 'date', type: () => Date, example: '2022-11-08' }), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, report_guard_1.ReportGuard), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Get)(routeName));
}
exports.Report = Report;
function ReportBetweenDates(tagName, routeName, forAll = false) {
    if (forAll) {
        return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tagName), (0, swagger_1.ApiQuery)({ name: 'secondDate', type: () => Date, example: '2022-11-08' }), (0, swagger_1.ApiQuery)({ name: 'firstDate', type: () => Date, example: '2022-11-03' }), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Get)(routeName));
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tagName), (0, swagger_1.ApiQuery)({ name: 'secondDate', type: () => Date, example: '2022-11-08' }), (0, swagger_1.ApiQuery)({ name: 'firstDate', type: () => Date, example: '2022-11-03' }), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, report_guard_1.ReportGuard), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Get)(routeName));
}
exports.ReportBetweenDates = ReportBetweenDates;
function ReportLastUpdate(tagName, routeName) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tagName), (0, swagger_1.ApiOkResponse)({ schema: { example: { lastUpdate: '9-ноябрь, 13:59:18' } } }), (0, common_1.Get)(routeName));
}
exports.ReportLastUpdate = ReportLastUpdate;
function ReportWithoutDate(tagName, routeName) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tagName), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, report_guard_1.ReportGuard), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Get)(routeName));
}
exports.ReportWithoutDate = ReportWithoutDate;
function ReportOperDays() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('OperDays'), (0, swagger_1.ApiOkResponse)({
        schema: {
            example: { dates: ['2022-11-09', '2022-11-08'] }
        }
    }), (0, common_1.Get)('operDays'));
}
exports.ReportOperDays = ReportOperDays;
function ReportGapManual(httpCode) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Gap analyze'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, report_guard_1.ReportGuard), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(httpCode));
}
exports.ReportGapManual = ReportGapManual;
//# sourceMappingURL=reports.decorator.js.map