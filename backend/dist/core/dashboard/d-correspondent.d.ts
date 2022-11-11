import { Base } from '../base';
export declare class DashboardCorrespondent extends Base {
    protected terms: {
        code: string;
        image: string;
    }[];
    protected formatQuery(whereQuery: string): string;
    protected getOneRow(whereQuery: string, image: string): Promise<{
        value: string;
        differ: string;
        image: string;
    }>;
    getRows(): Promise<{
        value: string;
        differ: string;
        image: string;
    }[]>;
}
