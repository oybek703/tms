"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const swagger_1 = require("@nestjs/swagger");
function UsersGuard() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard), (0, swagger_1.ApiBearerAuth)());
}
exports.UsersGuard = UsersGuard;
//# sourceMappingURL=users.decorator.js.map