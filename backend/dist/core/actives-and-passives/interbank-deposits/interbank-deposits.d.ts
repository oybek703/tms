import { InterbankDepositsBase } from './IB.base';
import { IInterbankDepositsDbData, InterbankDepositsTypes, IRowsData } from './IB.interface';
export declare class InterbankDeposits extends InterbankDepositsBase {
    private landCodes;
    private borrowCodes;
    private interbankDepositsQuery;
    protected mapBanks(currencyCode: string, codeCoa?: string): Promise<{
        allMappedBanks: IInterbankDepositsDbData[];
        sumRow: (string | number)[];
    }>;
    getRows(type: InterbankDepositsTypes): Promise<IRowsData[]>;
}
