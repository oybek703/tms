import { Test, TestingModule } from '@nestjs/testing'
import { OracleService } from './oracle.service'
import { AppModule } from '../app.module'
import { ORACLE_CONNECTION_SUCCESS } from './oracle.constants'

describe('OracleService', () => {
  let service: OracleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OracleService],
      imports: [AppModule]
    }).compile()

    service = module.get<OracleService>(OracleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should connect to database before starting app', async function () {
    const logSpy = jest.spyOn(console, 'log')
    await service.checkConnection()
    expect(logSpy).toBeCalledWith(ORACLE_CONNECTION_SUCCESS)
  })
})
