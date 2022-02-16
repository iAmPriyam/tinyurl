const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { insertNewurl, initialize, viewHash } = require('./database/db_util')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

initialize()

app.post('/generate', async (req, res, next) => {
  const { url, custom } = req.body
  try {
    const hash = await insertNewurl(url, custom)
    const link = `http://${req.get('host')}/${hash}`
    res.json({ success: true, hash: link })
  } catch (err) {
    console.log(Object.assign({}, err))
    switch (err.code) {
      case 'SQLITE_CONSTRAINT':
        if (custom)
          res
            .status(400)
            .json({ success: false, message: 'The custom domain is taken' })
        res
          .status(400)
          .json({ success: false, message: 'Something went wrong' })

      default:
        res
          .status(400)
          .json({ success: false, message: 'Could not generate link' })
        break
    }
  }
})

app.get('/:hash', async (req, res, next) => {
  const result = await viewHash(req.params.hash)
  const url = result[0].source
  res.redirect(url)
})

const PORT = 8080

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`))
