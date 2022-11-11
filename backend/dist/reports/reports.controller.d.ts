import { BadRequestException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { UpdateGapDto } from './dto/update-gap.dto';
export declare class ReportsController {
    private readonly reportsService;
    dateBadRequestException: BadRequestException;
    constructor(reportsService: ReportsService);
    dashboardLastUpdate(): Promise<{
        lastUpdate: string;
    }>;
    dashboard(date: Date): Promise<{
        dashboardCorrespondent: {
            value: string;
            differ: string;
            image: string;
        }[];
        dashboardCurrencyPosition: {
            currencyPosition: string[] | {
                name: string;
                currencyCode: string;
                equival: number;
                sumEquival: number;
                percent: number;
            }[];
            position: string[] | {
                name: string;
                currencyCode: string;
                equival: number;
                sumEquival: number;
                percent: number;
            }[];
        };
        timeDeposits: string[];
        currencyMfi: string[];
        currencyTimeDeposits: string[];
        interbankDeposits: string[];
        fundingStructure: string[];
        currencyMBD: string[];
        vla: {
            total: number[];
            nat: {
                values: number[];
                categories: string[];
            };
            foreign: {
                values: number[];
                categories: string[];
            };
            categories: string[];
        };
        lcr: {
            total: number[];
            nat: {
                values: number[];
                categories: string[];
            };
            foreign: {
                values: number[];
                categories: string[];
            };
            categories: string[];
        };
        nsfr: {
            total: number[];
            nat: {
                values: number[];
                categories: string[];
            };
            foreign: {
                values: number[];
                categories: string[];
            };
            categories: string[];
        };
        currencyRates: {
            cbRate: any;
            legalEntitiesRates: any;
            individualsRates: any;
            last90Rates: any;
        };
        bankLimits: {
            foreignBanks: import("../core/dashboard/dashboard.interface").IBankLimits[];
            localBanks: import("../core/dashboard/dashboard.interface").IBankLimits[];
        };
    }>;
    fcrb(date: Date): Promise<{
        mfiData: {
            mfiTotal: number;
            mfiPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            treasuryTotal: number;
            treasuryPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            retailTotal: number;
            retailPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            capital: number;
            obligations: number;
        } | {
            otherActives: number;
            investments: number;
            billsAndInterbankDeposits: number;
            creditingAndAccredetiv: number;
            retailLending: number;
            treasuryPortfolio: number;
            balanceActive: number;
            fundingAvgRatePercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        };
        treasuryData: {
            mfiTotal: number;
            mfiPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            treasuryTotal: number;
            treasuryPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            retailTotal: number;
            retailPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            capital: number;
            obligations: number;
        } | {
            otherActives: number;
            investments: number;
            billsAndInterbankDeposits: number;
            creditingAndAccredetiv: number;
            retailLending: number;
            treasuryPortfolio: number;
            balanceActive: number;
            fundingAvgRatePercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        };
        retailData: {
            mfiTotal: number;
            mfiPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            treasuryTotal: number;
            treasuryPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            retailTotal: number;
            retailPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            capital: number;
            obligations: number;
        } | {
            otherActives: number;
            investments: number;
            billsAndInterbankDeposits: number;
            creditingAndAccredetiv: number;
            retailLending: number;
            treasuryPortfolio: number;
            balanceActive: number;
            fundingAvgRatePercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        };
        centralizedResourceBaseData: {
            mfiTotal: number;
            mfiPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            treasuryTotal: number;
            treasuryPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            retailTotal: number;
            retailPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            capital: number;
            obligations: number;
        } | {
            otherActives: number;
            investments: number;
            billsAndInterbankDeposits: number;
            creditingAndAccredetiv: number;
            retailLending: number;
            treasuryPortfolio: number;
            balanceActive: number;
            fundingAvgRatePercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        };
        portfolioData: {
            mfiTotal: number;
            mfiPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            treasuryTotal: number;
            treasuryPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            retailTotal: number;
            retailPercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        } | {
            capital: number;
            obligations: number;
        } | {
            otherActives: number;
            investments: number;
            billsAndInterbankDeposits: number;
            creditingAndAccredetiv: number;
            retailLending: number;
            treasuryPortfolio: number;
            balanceActive: number;
            fundingAvgRatePercents: import("../core/dashboard/dashboard.interface").IFcrb[];
        };
    }>;
    creditData(date: Date): Promise<{
        creditPart: any;
        disaggregatedByTime: any;
        issuedCredits: any;
    }>;
    dashboardMonthly(query: {
        firstDate: Date;
        secondDate: Date;
    }): Promise<{
        capital: ({
            count: string;
            indicatorName: string;
            data: any[];
            differ: number;
            differPercent: number;
            isTableHead: boolean;
            withPercent?: undefined;
        } | {
            count: string;
            indicatorName: string;
            data: any;
            differ: number;
            differPercent: number;
            isTableHead: boolean;
            withPercent: boolean;
        })[];
        liquidity: ({
            count: string;
            indicatorName: string;
            data: any[];
            differ: number;
            differPercent: number;
            isTableHead: boolean;
            withPercent?: undefined;
        } | {
            count: string;
            indicatorName: string;
            data: any;
            differ: number;
            differPercent: number;
            isTableHead: boolean;
            withPercent: boolean;
        })[];
        riskPart: any[];
    }>;
    mainIndicators(date: Date): Promise<import("../core/key-indicators/main-indicators/main-indicators.interfaces").MainIndicatorRow[]>;
    capital(date: Date): Promise<import("../core/key-indicators/capital/capital.interface").ICapitalRow[]>;
    profitAndLost(date: Date): Promise<import("../core/key-indicators/profit-lost/profit-lost.interface").IProfitLostRow[]>;
    liquidity(date: Date): Promise<{
        liquidityAssets: import("../core/bank-liquidity/liquidity/liquidity.interface").ILiquidityRow[];
        obligations: import("../core/bank-liquidity/liquidity/liquidity.interface").ILiquidityRow[];
    }>;
    liquidityCurrent(): Promise<{
        liquidityAssets: import("../core/bank-liquidity/liquidity/liquidity.interface").ILiquidityRow[];
        obligations: import("../core/bank-liquidity/liquidity/liquidity.interface").ILiquidityRow[];
    }>;
    correspondent(date: Date): Promise<{
        currencyRate: import("../core/bank-liquidity/correspondent/correspondent.interface").ICorrespondentRow[];
        totalCash: import("../core/bank-liquidity/correspondent/correspondent.interface").ICorrespondentRow[];
        interbankDeposits: import("../core/bank-liquidity/correspondent/correspondent.interface").ICorrespondentRow[];
    }>;
    correspondentCurrent(): Promise<{
        currencyRate: import("../core/bank-liquidity/correspondent/correspondent.interface").ICorrespondentRow[];
        totalCash: import("../core/bank-liquidity/correspondent/correspondent.interface").ICorrespondentRow[];
        interbankDeposits: import("../core/bank-liquidity/correspondent/correspondent.interface").ICorrespondentRow[];
    }>;
    calcFor(date: Date): Promise<import("../core/bank-liquidity/calc-for/calc-for.interface").ICalcForRow[]>;
    currencyPosition(date: Date): Promise<{
        allRows: import("../core/bank-liquidity/currency-position/CP.interface").ICurrencyPositionRow[];
        tableSumData: import("../core/bank-liquidity/currency-position/CP.interface").ITableSumData[];
    }>;
    nostroMatrix(query: {
        firstDate: Date;
        secondDate: Date;
    }): Promise<{
        code: string;
        title: string;
        data: import("../core/bank-liquidity/nostro-matrix/nostro-matrix.interface").INostroMatrixDbData[];
    }[]>;
    vlaBuffer(date: Date): Promise<{
        liquidityAssets: {
            indicatorName: string;
            totalPercent: number;
            total: number;
            uzsPercent: number;
            uzs: number;
            foreignPercent: number;
            foreign: number;
        }[];
        liabilitiesOnDemand: {
            indicatorName: string;
            totalPercent: number;
            total: number;
            uzsPercent: number;
            uzs: number;
            foreignPercent: number;
            foreign: number;
        }[];
    }>;
    placedAttracted(date: Date): Promise<{
        involvedFunds: import("../core/actives-and-passives/placed-attracted/placed-attracted.interface").IPlacedAttractedRow[];
        placedFunds: import("../core/actives-and-passives/placed-attracted/placed-attracted.interface").IPlacedAttractedRow[];
    }>;
    interbankDeposits(date: Date): Promise<{
        land: import("../core/actives-and-passives/interbank-deposits/IB.interface").IRowsData[];
        borrow: import("../core/actives-and-passives/interbank-deposits/IB.interface").IRowsData[];
        fullBorrowData: import("../core/actives-and-passives/interbank-deposits/IB.interface").IRowsData[];
        fullLandData: import("../core/actives-and-passives/interbank-deposits/IB.interface").IRowsData[];
    }>;
    topDeposits(date: Date): Promise<import("../core/actives-and-passives/top-deposits/top-deposits.interface").ITopDepositsData>;
    timeDepoClients(date: Date): Promise<import("../core/actives-and-passives/time-depo-clients/TDC.interface").ITimeDepoClientsData[]>;
    timeDeposits(date: Date): Promise<{
        currentBalance: number[] | import("../core/actives-and-passives/time-deposits/time-deposits.interface").ITimeDepositsData[];
        balanceInMonthBegin: number[] | import("../core/actives-and-passives/time-deposits/time-deposits.interface").ITimeDepositsData[];
        tableData: number[] | import("../core/actives-and-passives/time-deposits/time-deposits.interface").ITimeDepositsData[];
    }>;
    depositsByDeadline(date: Date): Promise<import("../core/actives-and-passives/deposits-by-deadline/DBD.interface").IDepositsByDeadline[]>;
    reportLiabilities(date: Date): Promise<import("../core/actives-and-passives/report-liabilities/RL.interface").IReportLiabilitiesData[]>;
    filialEffectiveness(date: Date): Promise<import("../core/actives-and-passives/filial-effectiveness/FL.interface").IFilialEffectivenessData[]>;
    gm(date: Date): Promise<{
        tableData: unknown[] | {
            acs: number[];
            others: {
                indicatorName: string;
                codeCurrency: string;
                parValue: number;
            }[];
        };
        accredetiv: unknown[] | {
            acs: number[];
            others: {
                indicatorName: string;
                codeCurrency: string;
                parValue: number;
            }[];
        };
        currRates: unknown[] | {
            acs: number[];
            others: {
                indicatorName: string;
                codeCurrency: string;
                parValue: number;
            }[];
        };
    }>;
    gap(): Promise<{
        months: any[];
        sourceOfLiquidity: any[];
        sourceOfLiquidityTotal: any[];
        needsOfLiquidity: any[];
        needsOfLiquidityTotal: any[];
        vlaLcrData: any[];
        lcrData: any[];
        nsfrData: any[];
    }>;
    gapManual(forEditing: boolean): Promise<{
        months: any;
        sourceOfLiquidity: any;
        sourceOfLiquidityTotal: any;
        needsOfLiquidity: any;
        needsOfLiquidityTotal: any;
        vlaLcrData: any;
    }>;
    updateGapManual(dto: UpdateGapDto): Promise<{
        success: boolean;
        message: string;
    }>;
    saveGapManualChanges(): Promise<{
        success: boolean;
        message: string;
    }>;
    gapLastUpdate(): Promise<{
        lastUpdate: string;
    }>;
    operDays(): Promise<{
        dates: Date[];
    }>;
}
