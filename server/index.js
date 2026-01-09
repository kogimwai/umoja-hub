const express = require('express')
const cors = require('cors')
const multer = require('multer')

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

app.post('/api/portfolio', upload.single('image'), (req, res) => {
  res.json({ success: true })
})

app.post('/api/jobs', (req, res) => {
  res.json({ success: true })
})

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
