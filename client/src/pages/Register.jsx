import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const register = async () => {
    try {
      await axios.post('/api/register', { email, password })
      alert('Registration successful')
      navigate('/login')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Create Account</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={register}>Register</button>
    </div>
  )
}
