export default function Box({ className, children }) {
  return (
    <div className="results__container">
      {className === "results" && (
        <span className="results__heading">Search Results</span>
      )}
      <div className={className}>{children}</div>
    </div>
  );
}
