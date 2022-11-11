import { OracleService } from '../../../oracle/oracle.service';
export declare const getVlaBufferData: (date: Date, oracleService: OracleService) => Promise<{
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
