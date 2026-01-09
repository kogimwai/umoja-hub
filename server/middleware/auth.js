const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
const auth = require('./middleware/auth')

app.post('/api/portfolio', auth, upload.single('image'), ...)
app.post('/api/jobs', auth, ...)
