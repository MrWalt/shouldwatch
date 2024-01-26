import { Link } from "react-scroll";

export default function Movie({ movie, onSelectMovie }) {
  return (
    <Link
      to="laterElement"
      smooth={true}
      duration={500}
      delay={100}
      offset={-15}
    >
      <div className="movie" onClick={() => onSelectMovie(movie.imdbID)} to="">
        <img src={movie.Poster} alt={movie.Title} className="movie__image" />
        <div className="movie__info">
          <p className="movie__title">{movie.Title}</p>
          <span className="movie__released">{movie.Year}</span>
          {movie.added && (
            <span className="movie__added">Added {movie.added}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
