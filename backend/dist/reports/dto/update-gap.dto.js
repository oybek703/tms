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
exports.UpdateGapDto = exports.colNames = void 0;
const swagger_1 = require("@nestjs/swagger");
var colNames;
(function (colNames) {
    colNames["nationalCurrency"] = "NATIONAL_CURRENCY";
    colNames["usd"] = "USD";
    colNames["eur"] = "EUR";
})(colNames = exports.colNames || (exports.colNames = {}));
class UpdateGapDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: colNames }),
    __metadata("design:type", String)
], UpdateGapDto.prototype, "colName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateGapDto.prototype, "newValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateGapDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateGapDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateGapDto.prototype, "source", void 0);
exports.UpdateGapDto = UpdateGapDto;
//# sourceMappingURL=update-gap.dto.js.map