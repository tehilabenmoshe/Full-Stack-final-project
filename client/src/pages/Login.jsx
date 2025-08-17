import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


export default function Login() {
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setErr('')
    try {
      const auth = await login(form)
      nav(auth.role === 'admin' ? '/admin' : '/customer', { replace: true })
    } catch (e) {
      setErr(e?.response?.data?.error || 'שגיאת התחברות')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{maxWidth:380, margin:'40px auto', display:'grid', gap:12}}>
      <h2>התחברות</h2>
      <input placeholder="אימייל" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))}/>
      <input placeholder="סיסמה" type="password" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))}/>
      {err && <div style={{color:'crimson'}}>{err}</div>}
      <button disabled={loading}>{loading ? 'מתחבר…' : 'התחבר/י'}</button>
      <small>אין חשבון? <Link to="/register">להרשמה</Link></small>
    </form>
  )
}
