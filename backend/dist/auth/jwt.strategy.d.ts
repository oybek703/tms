import { Strategy } from 'passport-jwt';
import { OracleService } from '../oracle/oracle.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly oracleService;
    private readonly jwtService;
    private readonly configService;
    private readonly usersService;
    constructor(oracleService: OracleService, jwtService: JwtService, configService: ConfigService, usersService: UsersService);
    validate(payload: {
        id: number;
    }): Promise<unknown>;
}
export {};
