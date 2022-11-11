import { BadRequestException, Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { OracleService } from '../oracle/oracle.service'
import { compare } from 'bcryptjs'
import { User } from './auth.interface'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly oracleService: OracleService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login({ userName, password }: LoginDto) {
    const user = await this.oracleService
      .executeQuery<User>(`SELECT ID as "id", USERNAME AS "userName", ROLE AS "role", 
								 ALLOWED_PAGES AS "allowedPages", PASSWORD as "password"
								 FROM TRS_USERS WHERE USERNAME='${userName}'`)
    if (!user) throw new BadRequestException('Invalid username.')
    if (!password) throw new BadRequestException('Invalid password.')
    const matchPassword = await compare(password, user.password)
    if (!matchPassword) throw new BadRequestException('Invalid password.')
    const token = await this.signToken(user)
    return { token, userName: user.userName, role: user.role, pages: user.allowedPages }
  }

  async signToken(user: User) {
    const jwtSecret = this.configService.get('JWT_SECRET')
    return await this.jwtService.signAsync({ id: user.id }, { expiresIn: '4h', secret: jwtSecret })
  }
}
