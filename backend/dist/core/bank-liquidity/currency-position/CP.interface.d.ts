export interface ICurrencyPositionDbData {
    currencyCode: string;
    currencyName: string;
    rcc: number;
    requirements: number;
    contingencyClaims: number;
    lcl: number;
    liabilities: number;
    contingencyLiabilities: number;
    zero8: number;
    openCurRate: number;
    forCurrRate: number;
    longVal: number;
    shortVal: number;
    posRatio: string;
}
export interface ICurrencyPositionRow extends ICurrencyPositionDbData {
    isTableHead?: boolean;
}
export interface ITableSumData {
    title: string;
    sum: number;
    percent: string | number;
}
