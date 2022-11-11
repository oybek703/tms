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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const oracle_service_1 = require("../oracle/oracle.service");
const bcryptjs_1 = require("bcryptjs");
let UsersService = class UsersService {
    constructor(oracleService) {
        this.oracleService = oracleService;
    }
    async getUser(userId) {
        return await this.oracleService.executeQuery(`SELECT ID AS "id", USERNAME AS "userName", ALLOWED_PAGES AS "allowedPages", ROLE AS "role" FROM TRS_USERS WHERE ID='${userId}'`);
    }
    async getAllUsers() {
        return await this.oracleService.executeQueryInStream(`SELECT ID AS "id", USERNAME AS "userName", ALLOWED_PAGES AS "allowedPages", ROLE AS "role" FROM TRS_USERS`);
    }
    async addUser({ userName = 'tms_admin', allowedPages, confirmPassword, password }) {
        if (password !== confirmPassword)
            throw new common_1.BadRequestException('match_password');
        const existingUser = await this.oracleService.executeQuery(`SELECT * FROM TRS_USERS WHERE USERNAME='${userName}'`);
        if (existingUser)
            throw new common_1.BadRequestException('user_exists');
        const salt = await (0, bcryptjs_1.genSalt)(5);
        const hashedPassword = await (0, bcryptjs_1.hash)(password, salt);
        await this.oracleService.executeQuery(`INSERT INTO TRS_USERS (USERNAME, PASSWORD, ALLOWED_PAGES) 
                       VALUES ('${userName}', '${hashedPassword}', '${allowedPages}')`, true);
        return { success: true, message: 'User added successfully!' };
    }
    async deleteUser(userId) {
        const user = await this.getUser(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found!');
        await this.oracleService.executeQuery(`DELETE FROM TRS_USERS WHERE ID='${userId}'`);
        return { success: true, message: `User with id of ${userId} deleted successfully!` };
    }
    async editUser({ newUsername, confirmNewPassword, newPassword, allowedPages }, userId) {
        const user = await this.oracleService.executeQuery(`SELECT PASSWORD AS "password", ALLOWED_PAGES AS "allowedPages" FROM TRS_USERS WHERE ID='${userId}'`);
        let hashedPassword = user.password;
        if (newPassword && confirmNewPassword) {
            if (newPassword !== confirmNewPassword)
                throw new common_1.BadRequestException('Passwords should match.');
            const salt = await (0, bcryptjs_1.genSalt)(10);
            hashedPassword = await (0, bcryptjs_1.hash)(newPassword, salt);
        }
        const updatedUserName = newUsername && newUsername.length > 0 ? newUsername : user.userName;
        const ALLOWED_PAGES = allowedPages === 'ALL'
            ? 'ALL'
            : allowedPages && allowedPages.length > 0
                ? allowedPages.join(',')
                : user.allowedPages;
        await this.oracleService.executeQuery(`UPDATE TRS_USERS SET USERNAME='${updatedUserName}', 
                     PASSWORD='${hashedPassword}', ALLOWED_PAGES='${ALLOWED_PAGES}' WHERE ID='${userId}'`);
        return { success: true, message: 'User updated successfully.' };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [oracle_service_1.OracleService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map