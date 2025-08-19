import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // אתחול מה-storage (שיהיה שריד לרענון דף)
  useEffect(() => {
    const u = localStorage.getItem('user');
    const t = localStorage.getItem('token');
    if (u) setUser(JSON.parse(u));
    if (t) setToken(t);
  }, []);

  function login({ user, token }) {
    if (token) localStorage.setItem('token', token);
    setToken(token);
    if (user)  localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthCtx.Provider value={{ user,token, setUser, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
