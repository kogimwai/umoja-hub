import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Welcome to Umoja Hub</h1>

      <br />

      <Link to="/register">
        <button>Create Account</button>
      </Link>

      <br /><br />

      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  )
}
