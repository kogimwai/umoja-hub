import { useState } from 'react'
import axios from 'axios'

export default function Portfolio() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  const upload = async () => {
    if (!file) return setMessage('Select a file first')

    const form = new FormData()
    form.append('image', file)

    await axios.post('/api/portfolio', form)
    setMessage('Uploaded successfully')
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Upload Portfolio</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={upload}>Upload</button>
      <p>{message}</p>
    </div>
  )
}
