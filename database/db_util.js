const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const randomstring = require('randomstring')

const connect = () =>
  new sqlite3.Database(
    path.join(__dirname, '/url.sqlite'),
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        return console.error(err)
      }
      console.log('Connected to db')
    }
  )

const initialize = () => {
  const db = connect()
  db.run(
    `CREATE TABLE IF NOT EXISTS url_list(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash CHAR(10),
        source CHAR(256)
    )`,
    (err) => {
      if (err) {
        return console.log(err)
      }
      console.log('DB Initialized')
    }
  )
  db.close((err) => {
    if (err) {
      return console.log(err)
    }
    console.log('Connection closed')
  })
}

const insertNewurl = (url) => {
  const hash = randomstring.generate({ length: 6, charset: 'hex' })
  const db = connect()
  db.run(
    `INSERT INTO url_list(hash,source) VALUES("${hash}","${url}")`,
    (err) => {
      if (err) {
        return console.log(err)
      }
      console.log('row inserted')
    }
  )
  db.close()
}

const viewHash = async (hash) => {
  const db = connect()
  return new Promise((resolve, reject) => {
    const query = `SELECT source FROM url_list WHERE hash = "${hash}"`
    console.log(query)
    db.all(query, (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
    db.close()
  })
}

module.exports = { initialize, viewHash, insertNewurl, connect }
