export interface IInterbankDepositsDbData {
    bankName: string;
    saldoOut: number;
    beginDate: Date;
    endDate: Date;
    percentRate: number;
    forDay: number;
    forPeriod: number;
    dayCount: number;
    percentShare: number;
}
export interface IRowsData {
    allMappedBanks: IInterbankDepositsDbData[];
    sumRow: (string | number)[];
}
export declare type InterbankDepositsTypes = 'land' | 'borrow' | 'fullLand' | 'fullBorrow';
