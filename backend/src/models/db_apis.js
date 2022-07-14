require('colors')
const oracledb = require('oracledb')
const connection = require('../../config/oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

async function checkConnection() {
    try {
        const db_connection = await oracledb.getConnection(connection)
        await db_connection.execute(`select * from dual`)
        console.log(`Successfully connected to database!`.blue.underline)
    } catch (e) {
        console.log(`Error while connecting database:`.red)
        console.error(e)
    }
}

async function getData(sql, bindParams = [], autoCommit = true) {
    const db_connection = await oracledb.getConnection(connection)
    const result = await db_connection.execute(sql, bindParams, {autoCommit})
    db_connection.release()
    return result
}

async function getDataInStream(sql, bindParams = [], autoCommit = true) {
    const streamData = []
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
        stream.on('data', function (data) {
            streamData.push(data)
        })

        stream.on('error', function(error) {
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

module.exports = {
    checkConnection,
    getData,
    getDataInStream
}