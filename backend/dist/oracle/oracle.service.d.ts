import 'colors';
import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class OracleService implements OnModuleInit {
    private readonly configService;
    connection: {
        user: string;
        password: string;
        connectionString: string;
    };
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    checkConnection(): Promise<void>;
    executeQuery<T>(query: string, returnResult?: boolean): Promise<T>;
    executeQueryInStream<T>(query: string): Promise<T[]>;
}
