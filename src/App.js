export default function App() {
  return (
    <main className="container">
      <Header />
    </main>
  );
}

function Header() {
  return (
    <div className="header">
      <h2 className="heading-primary">shouldWatch</h2>
      <input
        className="header__input"
        placeholder="Search for a movie..."
        spellCheck="false"
      ></input>
    </div>
  );
}
