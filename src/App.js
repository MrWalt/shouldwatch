import { useEffect, useState } from "react";
import Header from "./components/Header";
import Error from "./components/Error";
import Loader from "./components/Loader";
import Box from "./components/Box";
import MoviesList from "./components/MoviesList";
import Summary from "./components/Summary";
import WatchLaterList from "./components/WatchLaterList";
import MovieDetails from "./components/MovieDetails";

export const API_KEY = "ad8548a2";

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
    <>
      <main className="container">
        <Header searchQuery={searchQuery} onSetSearchQuery={setSearchQuery} />
        <Box className={"results"}>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <Error message={error} />}
        </Box>
        <div className="later__container">
          {!selectedMovie && (
            <Summary numMovies={watchLater?.length} watchTime={watchTime} />
          )}

          <Box
            className={`${
              selectedMovie ? "later later__detail-open" : "later"
            }`}
          >
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
              ></WatchLaterList>
            )}
          </Box>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer__text">Built by </span>
      <a href="https://github.com/MrWalt/shouldwatch" className="footer__link">
        MrWhite
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className="footer__icon"
        >
          <rect width="256" height="256" fill="none" />
          <path
            d="M119.83,56A52,52,0,0,0,76,32a51.92,51.92,0,0,0-3.49,44.7A49.28,49.28,0,0,0,64,104v8a48,48,0,0,0,48,48h48a48,48,0,0,0,48-48v-8a49.28,49.28,0,0,0-8.51-27.3A51.92,51.92,0,0,0,196,32a52,52,0,0,0-43.83,24Z"
            fill="none"
            stroke="currentColor"
            strokLinecap="round"
            strokLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M104,232V192a32,32,0,0,1,32-32h0a32,32,0,0,1,32,32v40"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M104,208H72a32,32,0,0,1-32-32A32,32,0,0,0,8,144"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
        </svg>
      </a>
    </footer>
  );
}
