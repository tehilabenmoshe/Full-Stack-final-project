import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthProvider'  
import '../styles/Register.css'
import logo from '../assets/logo.png'
import burger from '../assets/burger.png'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()
  const { login } = useAuth() 

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('הסיסמאות אינן תואמות')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        let msg = data?.error || 'Register failed'
        throw new Error(msg)
      }

      //  נכניס את המשתמש ל־Context + localStorage
      login(data)

      nav('/customer', { replace: true })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="logo2"><img src={logo} alt="Logo" /></div>
        <div className="picture"><img src={burger} alt="burger" /></div>
      </div>

      <div className="register-right">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input name="name" type="text" placeholder="Full name" value={form.name} onChange={onChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="phone" type="tel" placeholder="Phone (optional)" value={form.phone} onChange={onChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <input name="confirmPassword" type="password" placeholder="Verify Password" value={form.confirmPassword} onChange={onChange} required />
          <button type="submit" disabled={loading}>{loading ? 'Registering…' : 'Register'}</button>
          <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  )
}
