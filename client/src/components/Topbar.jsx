export default function Topbar({ query, onChange }){
  return (
    <header className="top">
      <input
        className="search"
        placeholder="Search something to eat"
        value={query}
        onChange={e=>onChange(e.target.value)}
      />
      <div className="userbox">שלום 👋</div>
    </header>
  )
}
