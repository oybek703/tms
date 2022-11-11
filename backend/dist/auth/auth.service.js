"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const oracle_service_1 = require("../oracle/oracle.service");
const bcryptjs_1 = require("bcryptjs");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(oracleService, configService, jwtService) {
        this.oracleService = oracleService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async login({ userName, password }) {
        const user = await this.oracleService
            .executeQuery(`SELECT ID as "id", USERNAME AS "userName", ROLE AS "role", 
								 ALLOWED_PAGES AS "allowedPages", PASSWORD as "password"
								 FROM TRS_USERS WHERE USERNAME='${userName}'`);
        if (!user)
            throw new common_1.BadRequestException('Invalid username.');
        if (!password)
            throw new common_1.BadRequestException('Invalid password.');
        const matchPassword = await (0, bcryptjs_1.compare)(password, user.password);
        if (!matchPassword)
            throw new common_1.BadRequestException('Invalid password.');
        const token = await this.signToken(user);
        return { token, userName: user.userName, role: user.role, pages: user.allowedPages };
    }
    async signToken(user) {
        const jwtSecret = this.configService.get('JWT_SECRET');
        return await this.jwtService.signAsync({ id: user.id }, { expiresIn: '4h', secret: jwtSecret });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [oracle_service_1.OracleService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map