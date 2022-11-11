import { OracleService } from '../../oracle/oracle.service';
import { IConfigOptions } from './dashboard.interface';
import { HttpService } from '@nestjs/axios';
declare const getDashboardData: (date: Date, oracleService: OracleService, configOptions: IConfigOptions, httpService: HttpService) => Promise<{
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
        foreignBanks: import("./dashboard.interface").IBankLimits[];
        localBanks: import("./dashboard.interface").IBankLimits[];
    };
}>;
export declare const getFcrbData: (date: Date, oracleService: OracleService) => Promise<{
    mfiData: {
        mfiTotal: number;
        mfiPercents: import("./dashboard.interface").IFcrb[];
    } | {
        treasuryTotal: number;
        treasuryPercents: import("./dashboard.interface").IFcrb[];
    } | {
        retailTotal: number;
        retailPercents: import("./dashboard.interface").IFcrb[];
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
        fundingAvgRatePercents: import("./dashboard.interface").IFcrb[];
    };
    treasuryData: {
        mfiTotal: number;
        mfiPercents: import("./dashboard.interface").IFcrb[];
    } | {
        treasuryTotal: number;
        treasuryPercents: import("./dashboard.interface").IFcrb[];
    } | {
        retailTotal: number;
        retailPercents: import("./dashboard.interface").IFcrb[];
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
        fundingAvgRatePercents: import("./dashboard.interface").IFcrb[];
    };
    retailData: {
        mfiTotal: number;
        mfiPercents: import("./dashboard.interface").IFcrb[];
    } | {
        treasuryTotal: number;
        treasuryPercents: import("./dashboard.interface").IFcrb[];
    } | {
        retailTotal: number;
        retailPercents: import("./dashboard.interface").IFcrb[];
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
        fundingAvgRatePercents: import("./dashboard.interface").IFcrb[];
    };
    centralizedResourceBaseData: {
        mfiTotal: number;
        mfiPercents: import("./dashboard.interface").IFcrb[];
    } | {
        treasuryTotal: number;
        treasuryPercents: import("./dashboard.interface").IFcrb[];
    } | {
        retailTotal: number;
        retailPercents: import("./dashboard.interface").IFcrb[];
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
        fundingAvgRatePercents: import("./dashboard.interface").IFcrb[];
    };
    portfolioData: {
        mfiTotal: number;
        mfiPercents: import("./dashboard.interface").IFcrb[];
    } | {
        treasuryTotal: number;
        treasuryPercents: import("./dashboard.interface").IFcrb[];
    } | {
        retailTotal: number;
        retailPercents: import("./dashboard.interface").IFcrb[];
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
        fundingAvgRatePercents: import("./dashboard.interface").IFcrb[];
    };
}>;
export declare const getCreditData: (date: Date, oracleService: OracleService) => Promise<{
    creditPart: any;
    disaggregatedByTime: any;
    issuedCredits: any;
}>;
export declare const getDashboardMonthlyData: (firstDate: Date, secondDate: Date, oracleService: OracleService) => Promise<{
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
export default getDashboardData;
