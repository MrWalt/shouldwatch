import { useEffect, useState } from "react";

const API_KEY = "ad8548a2";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [watchLater, setWatchLater] = useState(function () {
    const storedData = localStorage.getItem("watchLater");

    return JSON.parse(storedData);
  });

  const watchTime = watchLater
    .map((movie) =>
      movie.Runtime !== "N/A" ? movie.Runtime.split(" ").at(0) : ""
    )
    .reduce((acc, cur) => acc + Number(cur), 0);

  function handleSelectMovie(movie) {
    setSelectedMovie(movie);
  }

  function handleWatchLater(movie) {
    setWatchLater([...watchLater, movie]);
    handleCloseMovie();
  }

  function handleDeleteWatchLater(deleteID) {
    setWatchLater((watchLater) =>
      watchLater.filter((movie) => movie.imdbID !== deleteID)
    );
    handleCloseMovie();
  }

  function handleCloseMovie() {
    setSelectedMovie(null);
  }

  useEffect(
    function () {
      localStorage.setItem("watchLater", JSON.stringify(watchLater));
    },
    [watchLater]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`,
            {
              signal: controller.signal,
            }
          );
          if (!res.ok) throw new Error("There was an error, try again");

          const data = await res.json();

          console.log(data.Response);
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (searchQuery.length < 3) {
        setMovies([]);
      }

      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [searchQuery]
  );

  return (
    <main className="container">
      <Header searchQuery={searchQuery} onSetSearchQuery={setSearchQuery} />
      <Box className={"results"}>
        {isLoading && <Loader />}
        {!isLoading && !error && (
          <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
        )}
        {error && <Error message={error} />}
      </Box>
      <Box className={"later"}>
        {selectedMovie ? (
          <MovieDetails
            selectedID={selectedMovie}
            onWatchLater={handleWatchLater}
            watchLater={watchLater}
            onDeleteWatchLater={handleDeleteWatchLater}
            onCloseMovie={handleCloseMovie}
          />
        ) : (
          <WatchLaterList
            watchLater={watchLater}
            onSelectMovie={handleSelectMovie}
          >
            <Summary numMovies={watchLater?.length} watchTime={watchTime} />
          </WatchLaterList>
        )}
      </Box>
    </main>
  );
}

function ButtonBack({ onCloseMovie }) {
  return (
    <div className="details__back-btn" onClick={onCloseMovie}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className="details__back-btn-icon"
      >
        <rect width="256" height="256" fill="none" />
        <polyline
          points="80 152 32 104 80 56"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <path
          d="M224,200a96,96,0,0,0-96-96H32"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
      </svg>
    </div>
  );
}

function Header({ searchQuery, onSetSearchQuery }) {
  return (
    <div className="header">
      <h2 className="heading-primary">shouldWatch</h2>
      <div className="header__container">
        <input
          className="header__input"
          placeholder="Search for a movie..."
          spellCheck="false"
          value={searchQuery}
          onChange={(e) => onSetSearchQuery(e.target.value)}
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

function Error({ message }) {
  return <p className="error">{message}</p>;
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Box({ className, children }) {
  return <div className={className}>{children}</div>;
}

function MoviesList({ movies, onSelectMovie }) {
  return (
    <>
      {movies.map((movie) => (
        <Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
      ))}
    </>
  );
}

function Summary({ numMovies, watchTime }) {
  return (
    <div className="later__summary__container">
      {numMovies ? (
        <>
          <span className="later__text">Movies and Shows you added</span>
          <div className="later__summary">
            <span className="later__movies">
              {numMovies} {numMovies > 1 ? "movies" : "movie"}
            </span>
            <span className="later__time">{watchTime} min</span>
          </div>
        </>
      ) : (
        <span className="later__text">You havent added any movies</span>
      )}
    </div>
  );
}

function WatchLaterList({ watchLater, onSelectMovie, children }) {
  return (
    <>
      {children}
      {watchLater &&
        watchLater.map((movie) => (
          <Movie
            movie={movie}
            key={movie.imdbID}
            onSelectMovie={onSelectMovie}
          />
        ))}
    </>
  );
}

function Star({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
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
  );
}

function MovieDetails({
  selectedID,
  onWatchLater,
  watchLater,
  onDeleteWatchLater,
  onCloseMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isWatched = watchLater
    ?.map((movie) => movie.imdbID)
    .includes(selectedID);

  const date = new Date();
  let added = "";
  added += `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const newMovie = {
    Title: movie.Title,
    Year: movie.Year,
    Poster: movie.Poster,
    Director: movie.Director,
    Plot: movie.Plot,
    Runtime: movie.Runtime,
    imdbID: movie.imdbID,
    imdbRating: movie.imdbRating,
    added,
  };

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedID}`
        );

        if (!res.ok) throw new Error("There was an error");

        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      fetchMovieDetails();
    },
    [selectedID]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="details__heading">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="details__image"
            />
            <div className="details__text">
              <span className="details__title">{movie.Title}</span>
              <span className="details__year">Released in {movie.Year}</span>
              <span className="details__director">
                Directed by {movie.Director}
              </span>
              <span className="details__runtime">{movie.Runtime} runtime</span>
              <span className="details__rating">
                Rated {movie.imdbRating} <Star className={"details__icon"} /> on
                IMDB
              </span>
            </div>
          </div>
          <p className="details__description">{movie.Plot}</p>
          <ButtonBack onCloseMovie={onCloseMovie} />
          {isWatched ? (
            <button
              className="details__add-btn"
              onClick={() => onDeleteWatchLater(movie.imdbID)}
            >
              Delete Movie
            </button>
          ) : (
            <button
              className="details__add-btn"
              onClick={() => onWatchLater(newMovie)}
            >
              Add Movie
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <div className="movie" onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} className="movie__image" />
      <div className="movie__info">
        <p className="movie__title">{movie.Title}</p>
        <span className="movie__released">{movie.Year}</span>
        {movie.added && (
          <span className="movie__added">Added {movie.added}</span>
        )}
      </div>
    </div>
  );
}
