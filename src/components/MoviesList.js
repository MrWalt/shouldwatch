import Movie from "./Movie";

export default function MoviesList({ movies, onSelectMovie }) {
  return (
    <>
      {movies.map((movie) => (
        <Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
      ))}
    </>
  );
}
