import { LoginDto } from './dto/login.dto';
import { OracleService } from '../oracle/oracle.service';
import { User } from './auth.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly oracleService;
    private readonly configService;
    private readonly jwtService;
    constructor(oracleService: OracleService, configService: ConfigService, jwtService: JwtService);
    login({ userName, password }: LoginDto): Promise<{
        token: string;
        userName: string;
        role: string;
        pages: string;
    }>;
    signToken(user: User): Promise<string>;
}
