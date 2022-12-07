import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common'
import { UsersService } from './users.service'
import { EditUserDto } from './dto/edit-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { AddUserDto } from './dto/add-user.dto'
import { UsersGuard } from './users.decorator'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsersGuard()
  @Get(':userId')
  getUser(@Param('userId') userId: number) {
    const user = this.usersService.getUser(userId)
    if (!user) throw new NotFoundException('User not found!')
    return user
  }

  @UsersGuard()
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers()
  }

  @UsersGuard()
  @Post('addUser')
  async addUser(@Body() dto: AddUserDto) {
    await this.usersService.addUser(dto)
    return { success: true, message: 'User added successfully!' }
  }

  @UsersGuard()
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: number) {
    await this.usersService.deleteUser(userId)
    return { success: true, message: `User with id of ${userId} deleted successfully!` }
  }

  @UsersGuard()
  @Put(':userId')
  async editUser(@Body() dto: EditUserDto, @Param('userId') userId: number) {
    await this.usersService.editUser(dto, userId)
    return { success: true, message: 'User updated successfully.' }
  }
}
