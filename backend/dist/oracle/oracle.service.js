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
exports.OracleService = void 0;
require("colors");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const oracledb = require("oracledb");
let OracleService = class OracleService {
    constructor(configService) {
        this.configService = configService;
        this.connection = {
            user: configService.get('DB_USER'),
            password: configService.get('DB_PASSWORD'),
            connectionString: configService.get('DB_CONNECTION_STRING')
        };
    }
    async onModuleInit() {
        await this.checkConnection();
    }
    async checkConnection() {
        try {
            const dbConnection = await oracledb.getConnection(this.connection);
            await dbConnection.execute(`SELECT * FROM DUAL`);
            await dbConnection.release();
            console.log(`Successfully connected to database!`.blue.underline);
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            }
            throw new common_1.InternalServerErrorException({ message: 'Error while connecting database!' });
        }
    }
    async executeQuery(query, returnResult = false) {
        const dbConnection = await oracledb.getConnection(this.connection);
        const result = await dbConnection.execute(query, [], {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        if (returnResult)
            return result;
        const { rows } = result;
        await dbConnection.release();
        if (!rows)
            return {};
        return rows[0];
    }
    async executeQueryInStream(query) {
        const streamData = [];
        const dbConnection = await oracledb.getConnection(this.connection);
        const stream = await dbConnection.queryStream(query, [], {
            autoCommit: true,
            fetchArraySize: 150,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        return new Promise((resolve, reject) => {
            stream.on('data', function (data) {
                streamData.push(data);
            });
            stream.on('error', function (error) {
                console.log(`Error while data streaming:`.red);
                reject(error);
            });
            stream.on('end', function () {
                stream.destroy();
            });
            stream.on('close', function () {
                dbConnection.close();
                resolve(streamData);
            });
        });
    }
};
OracleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OracleService);
exports.OracleService = OracleService;
//# sourceMappingURL=oracle.service.js.map