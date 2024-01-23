export default function App() {
  return (
    <main className="container">
      <Header />
      <MoviesList />
      <WatchLaterList />
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
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <line
            x1="168.57"
            y1="168.57"
            x2="224"
            y2="224"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
      </div>
    </div>
  );
}

function MoviesList() {
  const movies = [
    {
      title: "Lord of the Rings",
      released: 2001,
      imdbRating: 9.2,
      image:
        "https://www.iposters.co.uk/media/catalog/product/t/u/tuxpi.com.1680109492.jpg?width=700&height=1000&store=default&image-type=image",
      duration: 189,
    },
    {
      title: "Spider-man",
      released: 2002,
      imdbRating: 8.7,
      image:
        "https://m.media-amazon.com/images/I/61etmpQOO-L._AC_UF894,1000_QL80_.jpg",
      duration: 129,
    },
    {
      title: "21",
      released: 2008,
      imdbRating: 6.8,
      image:
        "https://m.media-amazon.com/images/I/51Nm9QUn-GL._AC_UF894,1000_QL80_.jpg",
      duration: 170,
    },
  ];

  return (
    <div className="results">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.title} />
      ))}
    </div>
  );
}

function WatchLaterList() {
  return (
    <div className="later">
      <div className="later__summary__container">
        <span className="later__text">Movies and Shows you added</span>
        <div className="later__summary">
          <span className="later__movies">3 movies</span>
          <span className="later__time">401 min</span>
        </div>
      </div>
    </div>
  );
}

function MovieDetails() {
  return <div className="details"></div>;
}

function Movie({ movie }) {
  return (
    <div className="movie">
      <img src={movie.image} alt={movie.title} className="movie__image" />
      <div className="movie__info">
        <span className="movie__title">{movie.title}</span>
        <p>
          <span className="movie__rating">
            {movie.imdbRating}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="movie__icon"
            >
              <rect width="256" height="256" fill="none" />
              <path
                d="M135.34,28.9l23.23,55.36a8,8,0,0,0,6.67,4.88l59.46,5.14a8,8,0,0,1,4.54,14.07L184.13,147.7a8.08,8.08,0,0,0-2.54,7.89l13.52,58.54a8,8,0,0,1-11.89,8.69l-51.1-31a7.93,7.93,0,0,0-8.24,0l-51.1,31a8,8,0,0,1-11.89-8.69l13.52-58.54a8.08,8.08,0,0,0-2.54-7.89L26.76,108.35A8,8,0,0,1,31.3,94.28l59.46-5.14a8,8,0,0,0,6.67-4.88L120.66,28.9A8,8,0,0,1,135.34,28.9Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
          </span>
        </p>
        <span className="movie__released">{movie.released}</span>
        <span className="movie__duration">{movie.duration} min</span>
      </div>
    </div>
  );
}
