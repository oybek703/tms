import { OracleService } from '../../../oracle/oracle.service';
declare const getGmData: (date: Date, oracleService: OracleService) => Promise<{
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
export default getGmData;
