import 'colors'
import oracledb from 'oracledb'
import connection from '../config/oracledb'

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

export async function checkConnection() {
  try {
    const dbConnection = await oracledb.getConnection(connection)
    await dbConnection.execute(`SELECT * FROM DUAL`)
    console.log(`Successfully connected to database!`.blue.underline)
  } catch (e) {
    console.log(`Error while connecting database:`.red)
    console.error(e)
  }
}

export async function getData(query: string, bindParams = [], autoCommit = true) {
  const dbConnection = await oracledb.getConnection(connection)
  const result = await dbConnection.execute(query, bindParams, { autoCommit })
  await dbConnection.release()
  return result
}

export async function getDataInStream(sql: string, bindParams = [], autoCommit = true) {
  const streamData: {}[] = []
  const dbConnection = await oracledb.getConnection(connection)
  const stream = await dbConnection.queryStream(
      sql,
      bindParams,
      {
        autoCommit,
        fetchArraySize: 150
      }
  )
  return new Promise(((resolve, reject) => {
    stream.on('data', function(data: any) {
      streamData.push(data)
    })

    stream.on('error', function(error: Error) {
      console.log(`Error while data streaming:`.red)
      reject(error)
    })

    stream.on('end', function() {
      stream.destroy()
    })

    stream.on('close', function() {
      dbConnection.close()
      resolve(streamData)
    })
  }))
}
