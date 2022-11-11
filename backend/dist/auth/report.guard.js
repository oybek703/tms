"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGuard = void 0;
const common_1 = require("@nestjs/common");
class ReportGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const path = request.path.replace('/api', '');
        const user = request.user;
        if (user.allowedPages === 'ALL')
            return true;
        if (!user.allowedPages)
            throw new common_1.ForbiddenException('access_denied');
        const allowedPagesArray = user.allowedPages.split(',');
        if (!allowedPagesArray.includes(path))
            throw new common_1.ForbiddenException('access_denied');
        return true;
    }
}
exports.ReportGuard = ReportGuard;
//# sourceMappingURL=report.guard.js.map