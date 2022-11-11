import { OracleService } from '../oracle/oracle.service';
import { EditUserDto } from './dto/edit-user.dto';
import { AddUserDto } from './dto/add-user.dto';
export declare class UsersService {
    private readonly oracleService;
    constructor(oracleService: OracleService);
    getUser(userId: number): Promise<unknown>;
    getAllUsers(): Promise<unknown[]>;
    addUser({ userName, allowedPages, confirmPassword, password }: AddUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    editUser({ newUsername, confirmNewPassword, newPassword, allowedPages }: EditUserDto, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
