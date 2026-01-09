const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
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
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ email, password: hashed })
  res.json({ success: true })
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ error: 'User not found' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ error: 'Wrong password' })

  const token = jwt.sign({ id: user._id }, 'SECRET_KEY')
  res.json({ token })
})
