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
