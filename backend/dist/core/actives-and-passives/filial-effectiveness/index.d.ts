import { OracleService } from '../../../oracle/oracle.service';
declare const getFilialEffectivenessData: (date: Date, oracleService: OracleService) => Promise<import("./FL.interface").IFilialEffectivenessData[]>;
export default getFilialEffectivenessData;
