import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Umoja Hub</h1>

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
