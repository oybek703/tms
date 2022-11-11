import { UsersService } from './users.service';
import { EditUserDto } from './dto/edit-user.dto';
import { AddUserDto } from './dto/add-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(userId: number): Promise<unknown>;
    getAllUsers(): Promise<unknown[]>;
    addUser(dto: AddUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    editUser(dto: EditUserDto, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
