import { useState } from 'react'
import axios from 'axios'

export default function JobPosting() {
  const [title, setTitle] = useState('')

  const postJob = async () => {
    await axios.post('/api/jobs', { title })
    alert('Job posted')
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Post Job</h2>
      <input onChange={e => setTitle(e.target.value)} />
      <br /><br />
      <button onClick={postJob}>Post</button>
    </div>
  )
}
