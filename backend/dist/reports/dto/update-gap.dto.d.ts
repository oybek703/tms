export declare enum colNames {
    nationalCurrency = "NATIONAL_CURRENCY",
    usd = "USD",
    eur = "EUR"
}
export declare class UpdateGapDto {
    colName: string;
    newValue: number;
    role: string;
    date: string;
    source: string;
}
