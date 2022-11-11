"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const update_gap_dto_1 = require("./dto/update-gap.dto");
const reports_decorator_1 = require("./reports.decorator");
const reports_paths_1 = require("./reports-paths");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
        this.dateBadRequestException = new common_1.BadRequestException('Date is not provided in query params!');
    }
    async dashboardLastUpdate() {
        return await this.reportsService.dashboardLastUpdate();
    }
    async dashboard(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.dashboard(date);
    }
    async fcrb(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.fcrb(date);
    }
    async creditData(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.creditData(date);
    }
    async dashboardMonthly(query) {
        if (!query.firstDate || !query.secondDate)
            throw new common_1.BadRequestException('Two dates are required!');
        return await this.reportsService.dashboardMonthly(query.firstDate, query.secondDate);
    }
    async mainIndicators(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.mainIndicators(date);
    }
    async capital(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.capital(date);
    }
    async profitAndLost(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.profitAndLost(date);
    }
    async liquidity(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.liquidity(date);
    }
    async liquidityCurrent() {
        return await this.reportsService.liquidityCurrent();
    }
    async correspondent(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.correspondent(date);
    }
    async correspondentCurrent() {
        return await this.reportsService.correspondentCurrent();
    }
    async calcFor(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.calcFor(date);
    }
    async currencyPosition(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.currencyPosition(date);
    }
    async nostroMatrix(query) {
        if (!query.firstDate || !query.secondDate)
            throw new common_1.BadRequestException('Two dates are required!');
        return await this.reportsService.nostroMatrix(query.firstDate, query.secondDate);
    }
    async vlaBuffer(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.vlaBuffer(date);
    }
    async placedAttracted(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.placedAttracted(date);
    }
    async interbankDeposits(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.interbankDeposits(date);
    }
    async topDeposits(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.topDeposits(date);
    }
    async timeDepoClients(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.timeDepoClients(date);
    }
    async timeDeposits(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.timeDeposits(date);
    }
    async depositsByDeadline(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.depositsByDeadline(date);
    }
    async reportLiabilities(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.reportLiabilities(date);
    }
    async filialEffectiveness(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.filialEffectiveness(date);
    }
    async gm(date) {
        if (!date)
            throw this.dateBadRequestException;
        return await this.reportsService.gm(date);
    }
    async gap() {
        return await this.reportsService.gap();
    }
    async gapManual(forEditing) {
        if (forEditing === undefined)
            throw new common_1.BadRequestException('forEditing param is required!');
        return await this.reportsService.gapManual(forEditing);
    }
    async updateGapManual(dto) {
        return await this.reportsService.updateGapManual(dto);
    }
    async saveGapManualChanges() {
        return await this.reportsService.saveGapManualChanges();
    }
    async gapLastUpdate() {
        return await this.reportsService.gapLastUpdate();
    }
    async operDays() {
        return await this.reportsService.operDays();
    }
};
__decorate([
    (0, reports_decorator_1.ReportLastUpdate)('Dashboard', reports_paths_1.ReportsPaths.dashboardLastUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "dashboardLastUpdate", null);
__decorate([
    (0, reports_decorator_1.Report)('Dashboard', reports_paths_1.ReportsPaths.dashboard, true),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "dashboard", null);
__decorate([
    (0, reports_decorator_1.Report)('Dashboard', reports_paths_1.ReportsPaths.fcrb, true),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "fcrb", null);
__decorate([
    (0, reports_decorator_1.Report)('Dashboard', reports_paths_1.ReportsPaths.creditData, true),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "creditData", null);
__decorate([
    (0, reports_decorator_1.ReportBetweenDates)('Dashboard', reports_paths_1.ReportsPaths.dashboardMonthly, true),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "dashboardMonthly", null);
__decorate([
    (0, reports_decorator_1.Report)('Key indicators', reports_paths_1.ReportsPaths.mainIndicators),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "mainIndicators", null);
__decorate([
    (0, reports_decorator_1.Report)('Key indicators', reports_paths_1.ReportsPaths.capital),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "capital", null);
__decorate([
    (0, reports_decorator_1.Report)('Key indicators', reports_paths_1.ReportsPaths.profitAndLost),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "profitAndLost", null);
__decorate([
    (0, reports_decorator_1.Report)('Bank liquidity', reports_paths_1.ReportsPaths.liquidity),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "liquidity", null);
__decorate([
    (0, reports_decorator_1.ReportWithoutDate)('Bank liquidity', reports_paths_1.ReportsPaths.liquidityCurrentState),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "liquidityCurrent", null);
__decorate([
    (0, reports_decorator_1.Report)('Bank liquidity', reports_paths_1.ReportsPaths.correspondent),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "correspondent", null);
__decorate([
    (0, reports_decorator_1.ReportWithoutDate)('Bank liquidity', reports_paths_1.ReportsPaths.correspondentCurrentState),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "correspondentCurrent", null);
__decorate([
    (0, reports_decorator_1.Report)('Bank liquidity', reports_paths_1.ReportsPaths.calcFor, true),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "calcFor", null);
__decorate([
    (0, reports_decorator_1.Report)('Bank liquidity', reports_paths_1.ReportsPaths.currencyPosition),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "currencyPosition", null);
__decorate([
    (0, reports_decorator_1.ReportBetweenDates)('Bank liquidity', reports_paths_1.ReportsPaths.nostroMatrix),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "nostroMatrix", null);
__decorate([
    (0, reports_decorator_1.Report)('Bank liquidity', reports_paths_1.ReportsPaths.vlaBuffer),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "vlaBuffer", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.placedAttracted, true),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "placedAttracted", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.interbankDeposits),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "interbankDeposits", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.topDeposits),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "topDeposits", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.timeDepoClients),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "timeDepoClients", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.timeDeposits),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "timeDeposits", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.depositsByDeadline),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "depositsByDeadline", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.reportLiabilities),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "reportLiabilities", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.filialEffectiveness),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "filialEffectiveness", null);
__decorate([
    (0, reports_decorator_1.Report)('Actives, passives', reports_paths_1.ReportsPaths.gm),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "gm", null);
__decorate([
    (0, reports_decorator_1.ReportWithoutDate)('Gap analyze', reports_paths_1.ReportsPaths.gap),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "gap", null);
__decorate([
    (0, reports_decorator_1.ReportWithoutDate)('Gap analyze', reports_paths_1.ReportsPaths.gapManual),
    __param(0, (0, common_1.Query)('forEditing')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "gapManual", null);
__decorate([
    (0, reports_decorator_1.ReportGapManual)(202),
    (0, common_1.Post)('gapManual'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_gap_dto_1.UpdateGapDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateGapManual", null);
__decorate([
    (0, reports_decorator_1.ReportGapManual)(200),
    (0, common_1.Put)('gapManual'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "saveGapManualChanges", null);
__decorate([
    (0, reports_decorator_1.ReportLastUpdate)('Gap analyze', reports_paths_1.ReportsPaths.gapLastUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "gapLastUpdate", null);
__decorate([
    (0, reports_decorator_1.ReportOperDays)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "operDays", null);
ReportsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map