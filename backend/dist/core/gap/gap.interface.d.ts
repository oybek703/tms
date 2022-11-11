export interface IGapData {
    indicatorName: string;
    total: number;
    nationalCurrency: number;
    foreignCurrency: number;
    usd: number;
    eur: number;
    source: string;
    role: string;
}
export interface IGapFlowData {
    total: number;
    nationalCurrency: number;
    foreignCurrency: number;
}
export interface IGapMonths {
    month: string;
}
