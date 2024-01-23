import { useEffect, useState, useSyncExternalStore } from "react";

const API_KEY = "ad8548a2";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [watchLater, setWatchLater] = useState([]);

  function handleSelectMovie(movie) {
    setSelectedMovie(movie);
  }

  function handleWatchLater(movie) {
    setWatchLater([...watchLater, movie]);
    setSelectedMovie("");
  }

  function handleCloseMovie() {
    setSelectedMovie("");
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`,
            {
              signal: controller.signal,
            }
          );
          if (!res.ok) throw new Error("There was an error, try again");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          console.log(data);
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (searchQuery.length < 3) {
        setMovies([]);
      }

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
      <MoviesList
        movies={movies}
        isLoading={isLoading}
        onSelectMovie={handleSelectMovie}
      />
      <WatchLaterList
        movie={selectedMovie}
        selectedID={selectedMovie}
        watchLater={watchLater}
        onWatchLater={handleWatchLater}
        onCloseMovie={handleCloseMovie}
      />
    </main>
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

function Loader() {
  return <p className="loader">Loading...</p>;
}

function MoviesList({ movies, isLoading, onSelectMovie }) {
  return (
    <div className="results">
      {isLoading ? (
        <Loader />
      ) : (
        movies.map((movie) => (
          <Movie
            movie={movie}
            onSelectMovie={onSelectMovie}
            key={movie.imdbID}
          />
        ))
      )}
    </div>
  );
}

function WatchLaterList({
  movie,
  selectedID,
  watchLater,
  onWatchLater,
  onCloseMovie,
}) {
  return (
    <div className="later">
      {movie ? (
        <MovieDetails
          movie={movie}
          selectedID={selectedID}
          onWatchLater={onWatchLater}
          onCloseMovie={onCloseMovie}
        />
      ) : (
        <div className="later__summary__container">
          <span className="later__text">Movies and Shows you added</span>
          <div className="later__summary">
            <span className="later__movies">3 movies</span>
            <span className="later__time">401 min</span>
          </div>
        </div>
      )}
      {watchLater &&
        watchLater.map((movie) => <Movie movie={movie} key={movie.imdbID} />)}
    </div>
  );
}

function MovieDetails({ selectedID, onWatchLater }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function fetchMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedID}`
          );

          if (!res.ok) throw new Error("There was an error");

          const data = await res.json();
          setMovie(data);
        } catch (err) {
          console.log(err.message);
        } finally {
          setIsLoading(false);
        }
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
                Rated {movie.imdbRating}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  className="details__icon"
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
                </svg>{" "}
                on IMDB
              </span>
            </div>
          </div>
          <p className="details__description">{movie.Plot}</p>
          <button
            className="details__add-btn"
            onClick={() => onWatchLater(movie)}
          >
            Add Movie
          </button>
        </>
      )}
    </div>
  );
}

function Movie({ movie, onSelectMovie }) {
  const newMovie = {
    title: movie.Title,
    image: movie.Poster,
    released: movie.Year,
  };

  return (
    <div className="movie" onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={newMovie.image} alt={newMovie.title} className="movie__image" />
      <div className="movie__info">
        <p className="movie__title">{newMovie.title}</p>
        <span className="movie__released">{newMovie.released}</span>
      </div>
    </div>
  );
}
