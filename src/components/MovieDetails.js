import { useEffect, useState } from "react";
import ButtonBack from "./ButtonBack";
import Error from "./Error";
import Loader from "./Loader";
import Star from "./Star";
import { API_KEY } from "../App";

export default function MovieDetails({
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
              className="details__delete-btn"
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
