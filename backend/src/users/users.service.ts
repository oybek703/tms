import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { OracleService } from '../oracle/oracle.service'
import { EditUserDto } from './dto/edit-user.dto'
import { User } from '../auth/auth.interface'
import { genSalt, hash } from 'bcryptjs'
import { AddUserDto } from './dto/add-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly oracleService: OracleService) {}

  async getUser(userId: number) {
    return await this.oracleService.executeQuery(
      `SELECT ID AS "id", USERNAME AS "userName", ALLOWED_PAGES AS "allowedPages", ROLE AS "role" FROM TRS_USERS WHERE ID='${userId}'`
    )
  }

  async getAllUsers() {
    return await this.oracleService.executeQueryInStream(
      `SELECT ID AS "id", USERNAME AS "userName", ALLOWED_PAGES AS "allowedPages", ROLE AS "role" FROM TRS_USERS`
    )
  }

  async addUser({ userName, allowedPages, confirmPassword, password }: AddUserDto) {
    if (password !== confirmPassword) throw new BadRequestException('match_password')
    const existingUser = await this.oracleService.executeQuery(
      `SELECT * FROM TRS_USERS WHERE USERNAME='${userName}'`
    )
    if (existingUser) throw new BadRequestException('user_exists')
    const salt = await genSalt(5)
    const hashedPassword = await hash(password, salt)
    await this.oracleService.executeQuery(
      `INSERT INTO TRS_USERS (USERNAME, PASSWORD, ALLOWED_PAGES) 
                       VALUES ('${userName}', '${hashedPassword}', '${allowedPages}')`,
      true
    )
  }

  async deleteUser(userId: number) {
    const user = await this.getUser(userId)
    if (!user) throw new NotFoundException('User not found!')
    await this.oracleService.executeQuery(`DELETE FROM TRS_USERS WHERE ID='${userId}'`)
  }

  async editUser(
    { newUsername, confirmNewPassword, newPassword, allowedPages }: EditUserDto,
    userId: number
  ) {
    const user = await this.oracleService.executeQuery<User>(
      `SELECT PASSWORD AS "password", ALLOWED_PAGES AS "allowedPages" FROM TRS_USERS WHERE ID='${userId}'`
    )
    let hashedPassword = user.password
    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword)
        throw new BadRequestException('Passwords should match.')
      const salt = await genSalt(10)
      hashedPassword = await hash(newPassword, salt)
    }
    const updatedUserName = newUsername && newUsername.length > 0 ? newUsername : user.userName
    const ALLOWED_PAGES =
      allowedPages === 'ALL'
        ? 'ALL'
        : allowedPages && allowedPages.length > 0
        ? allowedPages.join(',')
        : user.allowedPages
    await this.oracleService.executeQuery(`UPDATE TRS_USERS SET USERNAME='${updatedUserName}', 
                     PASSWORD='${hashedPassword}', ALLOWED_PAGES='${ALLOWED_PAGES}' WHERE ID='${userId}'`)
  }
}
