import 'colors'
import oracledb from 'oracledb'
import connection from '../../config/oracledb'

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

export async function checkConnection() {
    try {
        const db_connection = await oracledb.getConnection(connection)
        await db_connection.execute(`SELECT * FROM DUAL`)
        console.log(`Successfully connected to database!`.blue.underline)
    } catch (e) {
        console.log(`Error while connecting database:`.red)
        console.error(e)
    }
}

export async function getData(query: string, bindParams = [], autoCommit = true) {
    const db_connection = await oracledb.getConnection(connection)
    const result = await db_connection.execute(query, bindParams, {autoCommit})
    await db_connection.release()
    return result
}

export async function getDataInStream(sql: string, bindParams = [], autoCommit = true) {
    const streamData: {}[] = []
    const db_connection = await oracledb.getConnection(connection)
    const stream = await db_connection.queryStream(
        sql,
        bindParams,
        {
            autoCommit,
            fetchArraySize: 150
        }
    )
    return new Promise(((resolve, reject) => {
        stream.on('data', function (data: any) {
            streamData.push(data)
        })

        stream.on('error', function(error: Error) {
            console.log(`Error while data streaming:`.red)
            reject(error)
        })

        stream.on('end', function () {
            stream.destroy()
        })

        stream.on('close', function () {
            db_connection.close()
            resolve(streamData)
        })
    }))
}