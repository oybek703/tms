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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const oracle_service_1 = require("../oracle/oracle.service");
const liquidity_1 = require("../core/bank-liquidity/liquidity");
const main_indicators_1 = require("../core/key-indicators/main-indicators");
const capital_1 = require("../core/key-indicators/capital");
const profit_lost_1 = require("../core/key-indicators/profit-lost");
const correspondent_1 = require("../core/bank-liquidity/correspondent");
const calc_for_1 = require("../core/bank-liquidity/calc-for");
const currency_position_1 = require("../core/bank-liquidity/currency-position");
const nostro_matrix_1 = require("../core/bank-liquidity/nostro-matrix");
const vla_buffer_1 = require("../core/bank-liquidity/vla-buffer");
const placed_attracted_1 = require("../core/actives-and-passives/placed-attracted");
const interbank_deposits_1 = require("../core/actives-and-passives/interbank-deposits");
const top_deposits_1 = require("../core/actives-and-passives/top-deposits");
const time_depo_clients_1 = require("../core/actives-and-passives/time-depo-clients");
const time_deposits_1 = require("../core/actives-and-passives/time-deposits");
const deposits_by_deadline_1 = require("../core/actives-and-passives/deposits-by-deadline");
const report_liabilities_1 = require("../core/actives-and-passives/report-liabilities");
const filial_effectiveness_1 = require("../core/actives-and-passives/filial-effectiveness");
const gm_1 = require("../core/actives-and-passives/gm");
const gap_1 = require("../core/gap");
const update_gap_dto_1 = require("./dto/update-gap.dto");
const dashboard_1 = require("../core/dashboard");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
let ReportsService = class ReportsService {
    constructor(oracleService, configService, httpService) {
        this.oracleService = oracleService;
        this.configService = configService;
        this.httpService = httpService;
    }
    async operDays() {
        const res = await this.oracleService.executeQueryInStream(`SELECT TO_CHAR(OPER_DAY, 'YYYY-MM-DD') AS "operDay" FROM IBS.DAY_OPERATIONAL@IABS
                   WHERE OPER_DAY >= DATE '2006-01-01' ORDER BY OPER_DAY DESC`);
        const dates = res.map(({ operDay }) => operDay);
        return { dates };
    }
    async dashboardLastUpdate() {
        const { lastUpdate } = await this.oracleService
            .executeQuery(`SELECT TO_CHAR(LOG_DATE, 'fmDD-month, HH24:fmMI:SS', 'NLS_DATE_LANGUAGE = RUSSIAN') AS "lastUpdate"
      FROM (SELECT LOG_DATE FROM USER_SCHEDULER_JOB_LOG WHERE JOB_NAME = 'DASHBOARD_JOB'
            ORDER BY LOG_DATE DESC)
      WHERE ROWNUM = 1`);
        return { lastUpdate };
    }
    async gapLastUpdate() {
        const { lastUpdate } = await this.oracleService
            .executeQuery(`SELECT TO_CHAR(MAX(LAST_START_DATE), 'fmDD-month, HH24:fmMI:SS', 'NLS_DATE_LANGUAGE = RUSSIAN') 
              AS "lastUpdate" FROM   USER_SCHEDULER_JOBS WHERE  JOB_NAME = UPPER('GAP_Analysis')`);
        return { lastUpdate };
    }
    async mainIndicators(date) {
        return await (0, main_indicators_1.default)(date, this.oracleService);
    }
    async capital(date) {
        return await (0, capital_1.default)(date, this.oracleService);
    }
    async profitAndLost(date) {
        return await (0, profit_lost_1.default)(date, this.oracleService);
    }
    async liquidity(date) {
        return await (0, liquidity_1.default)(date, this.oracleService);
    }
    async liquidityCurrent() {
        return await (0, liquidity_1.getLiquidityCurrentData)(this.oracleService);
    }
    async correspondent(date) {
        return await (0, correspondent_1.default)(date, this.oracleService);
    }
    async correspondentCurrent() {
        return await (0, correspondent_1.getCorrespondentCurrentData)(this.oracleService);
    }
    async calcFor(date) {
        return await (0, calc_for_1.default)(date, this.oracleService);
    }
    async currencyPosition(date) {
        return await (0, currency_position_1.default)(date, this.oracleService);
    }
    async nostroMatrix(firstDate, secondDate) {
        return await (0, nostro_matrix_1.getNostroMatrixData)(firstDate, secondDate, this.oracleService);
    }
    async vlaBuffer(date) {
        return await (0, vla_buffer_1.getVlaBufferData)(date, this.oracleService);
    }
    async placedAttracted(date) {
        return await (0, placed_attracted_1.default)(date, this.oracleService);
    }
    async interbankDeposits(date) {
        return await (0, interbank_deposits_1.getInterbankDepositsData)(date, this.oracleService);
    }
    async topDeposits(date) {
        return await (0, top_deposits_1.default)(date, this.oracleService);
    }
    async timeDepoClients(date) {
        return await (0, time_depo_clients_1.default)(date, this.oracleService);
    }
    async timeDeposits(date) {
        return await (0, time_deposits_1.default)(date, this.oracleService);
    }
    async depositsByDeadline(date) {
        return await (0, deposits_by_deadline_1.default)(date, this.oracleService);
    }
    async reportLiabilities(date) {
        return await (0, report_liabilities_1.default)(date, this.oracleService);
    }
    async filialEffectiveness(date) {
        return await (0, filial_effectiveness_1.default)(date, this.oracleService);
    }
    async gm(date) {
        return await (0, gm_1.default)(date, this.oracleService);
    }
    async gap() {
        return await (0, gap_1.default)(this.oracleService);
    }
    async gapManual(forEditing) {
        const booleanForEditing = forEditing === 'true';
        if (!booleanForEditing) {
            await this.oracleService.executeQuery(`BEGIN
                       DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
                       DELETE FROM GAP_SIMULATION_MANUAL WHERE 1=1;
                       INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
                       INSERT INTO GAP_SIMULATION_MANUAL (SELECT * FROM GAP_ANALYSIS_MANUAL);
                   END;`);
        }
        return await (0, gap_1.getGapManualData)(booleanForEditing, this.oracleService);
    }
    async updateGapManual({ date, role, newValue, source, colName }) {
        const tableColName = update_gap_dto_1.colNames[colName];
        let updateQuery = `UPDATE GAP_SIMULATION_MANUAL SET ${tableColName}=${+newValue} 
                       WHERE ROLE='${role}' AND OPER_DAY=${date}`;
        if (source === 'AUTO') {
            updateQuery = `UPDATE GAP_SIMULATION_AUTO
                    SET ${tableColName}=${+newValue}
                    WHERE ROLE = '${role}'
                      AND OPER_DAY = (WITH CTE AS (SELECT OPER_DAY,
                                                          ROW_NUMBER() OVER (ORDER BY OPER_DAY) AS ROW_NUMBER
                                                   FROM (SELECT * FROM GAP_SIMULATION_AUTO ORDER BY OPER_DAY)
                                                   WHERE ROLE = '${role}')
                                      SELECT OPER_DAY
                                      FROM CTE
                                      WHERE ROW_NUMBER = ${date})`;
        }
        await this.oracleService.executeQuery(updateQuery);
        await this.oracleService.executeQuery(`BEGIN GAP_MANUAL_REWRITER(); END;`);
        return { success: true, message: 'updated' };
    }
    async saveGapManualChanges() {
        await this.oracleService.executeQuery(`BEGIN
            DELETE FROM GAP_ANALYSIS_MANUAL WHERE 1=1;
            INSERT INTO GAP_ANALYSIS_MANUAL (SELECT * FROM GAP_SIMULATION_MANUAL);
            DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
            INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
        END;`);
        return { success: true, message: 'changes saved' };
    }
    async dashboard(date) {
        const configOptions = {
            username: this.configService.get('CURRENCY_LOGIN'),
            password: this.configService.get('CURRENCY_PASSWORD')
        };
        return await (0, dashboard_1.default)(date, this.oracleService, configOptions, this.httpService);
    }
    async fcrb(date) {
        return await (0, dashboard_1.getFcrbData)(date, this.oracleService);
    }
    async creditData(date) {
        return await (0, dashboard_1.getCreditData)(date, this.oracleService);
    }
    async dashboardMonthly(firstDate, secondDate) {
        return await (0, dashboard_1.getDashboardMonthlyData)(firstDate, secondDate, this.oracleService);
    }
};
ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [oracle_service_1.OracleService,
        config_1.ConfigService,
        axios_1.HttpService])
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map