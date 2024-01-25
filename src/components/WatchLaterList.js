import Movie from "./Movie";

export default function WatchLaterList({
  watchLater,
  onSelectMovie,
  children,
}) {
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
