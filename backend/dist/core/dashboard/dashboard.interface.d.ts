export interface IDashboardCorrespondent {
    value: number;
    differ: number;
}
export interface IDashboardCurrencyPosition {
    currencyCode: string;
    equival: number;
    sumEquival: number;
    percent: number;
}
export interface IDashboardLiquidity {
    vla: number;
    vlaNat: number;
    vlaFor: number;
}
export interface IDashboardCurrencyRate {
    code: string;
    equival: number;
    differ: number;
}
export interface IConfigOptions {
    username: string;
    password: string;
}
export interface IBeforeDate {
    beforeDate: Date;
}
export interface ILast90Data {
    currDay: Date;
    equival: number;
}
export interface ICurrencyCode {
    code: string;
    currName: string;
    nominal: string;
    equival: number;
    differ: number;
}
export interface IBankLimits {
    bankName: string;
    saldo: number;
    limit22: number;
    differ: number;
    limitPercent22: number;
    limitPercent24: number;
    limit24: number;
}
export interface IFcrb {
    currencyName: string;
    percent: number;
}
export interface IDashboardMonthlyDbData {
    dat: Date;
    sum: number;
}
export interface IDashboardMonthlyRow {
    count: string;
    indicatorName: string;
    data: any;
    differ: number;
    differPercent: number;
    isTableHead: boolean;
    withPercent: boolean;
}
