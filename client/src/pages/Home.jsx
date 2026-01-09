import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Welcome to Umoja Hub</h1>

      <Link to="/portfolio">
        <button>Create Portfolio</button>
      </Link>

      <br /><br />

      <Link to="/post-job">
        <button>Post a Job</button>
      </Link>
    </div>
  )
}
