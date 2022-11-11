import { OracleService } from '../../../oracle/oracle.service';
export declare const getNostroMatrixData: (firstDate: Date, secondDate: Date, oracleService: OracleService) => Promise<{
    code: string;
    title: string;
    data: import("./nostro-matrix.interface").INostroMatrixDbData[];
}[]>;
