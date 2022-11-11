import { Base } from '../../base';
import { OwnQuery } from '../../core.interface';
import { ICorrespondentRow } from './correspondent.interface';
export declare class CorrespondentBase extends Base {
    currencyNames: string[];
    formatQuery(role: string): string;
    createData: (count: string, indicatorName: string, uzs: number, cny: number, jpy: number, kzt: number, rub: number, chf: number, gbp: number, usd: number, eur: number, isTableHead: boolean, isNegative?: boolean) => {
        count: string;
        indicatorName: string;
        uzs: number;
        cny: number;
        jpy: number;
        kzt: number;
        rub: number;
        chf: number;
        gbp: number;
        usd: number;
        eur: number;
        isTableHead: boolean;
    };
    getTotal(propertyName: string, ...args: ICorrespondentRow[]): number;
    getOneRow(count: string, indicatorName: string, whereQuery: string | undefined, ownQuery?: OwnQuery | undefined, isTableHead?: boolean, isNegative?: boolean): Promise<{
        count: string;
        indicatorName: string;
        uzs: number;
        cny: number;
        jpy: number;
        kzt: number;
        rub: number;
        chf: number;
        gbp: number;
        usd: number;
        eur: number;
        isTableHead: boolean;
    }>;
}
