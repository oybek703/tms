import 'colors'
import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as oracledb from 'oracledb'

@Injectable()
export class OracleService implements OnModuleInit {
  connection: {
    user: string
    password: string
    connectionString: string
  }

  constructor(private readonly configService: ConfigService) {
    this.connection = {
      user: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      connectionString: configService.get('DB_CONNECTION_STRING')
    }
  }

  async onModuleInit() {
    // await this.checkConnection()
  }

  async checkConnection() {
    try {
      const dbConnection = await oracledb.getConnection(this.connection)
      await dbConnection.execute(`SELECT * FROM DUAL`)
      await dbConnection.release()
      console.log(`Successfully connected to database!`.blue.underline)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message)
      }
      throw new InternalServerErrorException({ message: 'Error while connecting database!' })
    }
  }

  async executeQuery<T>(query: string, returnResult = false): Promise<T> {
    const dbConnection = await oracledb.getConnection(this.connection)
    const result = await dbConnection.execute<T>(query, [], {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    })
    if (returnResult) return result as T
    const { rows } = result
    await dbConnection.release()
    if (!rows) return {} as T
    return rows[0]
  }

  async executeQueryInStream<T>(query: string): Promise<T[]> {
    const streamData: T[] = []
    const dbConnection = await oracledb.getConnection(this.connection)
    const stream = await dbConnection.queryStream(query, [], {
      autoCommit: true,
      fetchArraySize: 150,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    })
    return new Promise((resolve, reject) => {
      stream.on('data', function (data: any) {
        streamData.push(data)
      })

      stream.on('error', function (error: Error) {
        console.log(`Error while data streaming:`.red)
        reject(error)
      })

      stream.on('end', function () {
        stream.destroy()
      })

      stream.on('close', function () {
        dbConnection.close()
        resolve(streamData)
      })
    })
  }
}
