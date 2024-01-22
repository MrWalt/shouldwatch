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
      <div className="header__container">
        <input
          className="header__input"
          placeholder="Search for a movie..."
          spellCheck="false"
        ></input>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className="header__icon"
        >
          <rect width="256" height="256" fill="none" />
          <circle
            cx="112"
            cy="112"
            r="80"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="168.57"
            y1="168.57"
            x2="224"
            y2="224"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
        </svg>
      </div>
    </div>
  );
}

function MoviesList() {
  return <div className="movies"></div>;
}
