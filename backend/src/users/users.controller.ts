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
  addUser(@Body() dto: AddUserDto) {
    return this.usersService.addUser(dto)
  }

  @UsersGuard()
  @Delete(':userId')
  deleteUser(@Param('userId') userId: number) {
    return this.usersService.deleteUser(userId)
  }

  @UsersGuard()
  @Put(':userId')
  editUser(@Body() dto: EditUserDto, @Param('userId') userId: number) {
    return this.usersService.editUser(dto, userId)
  }
}
