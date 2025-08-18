import { useAuth } from '../AuthProvider'; 

export default function Topbar({ query, onChange }) {
  const { user } = useAuth(); 
  const displayName = user?.username ?? user?.name ?? 'Guest';

  return (
    <header className="top">
      <input
        className="search"
        placeholder="Search something to eat"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="userbox">Welcome, {displayName}!</div>
    </header>
  );
}
