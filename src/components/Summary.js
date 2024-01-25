export default function Summary({ numMovies, watchTime }) {
  return (
    <div className="later__summary">
      {numMovies ? (
        <>
          <span className="later__summary__heading">
            Movies and Shows you added
          </span>
          <div className="later__summary__container">
            <span className="later__summary__movies">
              {numMovies} {numMovies > 1 ? "movies" : "movie"}
            </span>
            <span className="later__summary__time">{watchTime} min</span>
          </div>
        </>
      ) : (
        <span className="later__summary__text">
          You havent added any movies
        </span>
      )}
    </div>
  );
}
