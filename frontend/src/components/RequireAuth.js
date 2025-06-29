import { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'authed' | 'denied'
  const location = useLocation()

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('unauth')
      })
      .then(() => setStatus('authed'))
      .catch(() => setStatus('denied'))
  }, [])

  if (status === 'loading') {
    return <div style={{padding: '2rem', textAlign:'center'}}>Checking authentication…</div>
  }

  if (status === 'denied') {
    // send them to /login, but remember where they came from
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // status === 'authed'
  return children
}
