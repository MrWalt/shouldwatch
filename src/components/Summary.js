export default function Summary({ numMovies, watchTime }) {
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
