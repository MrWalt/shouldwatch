export default function Movie({ movie, onSelectMovie }) {
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
