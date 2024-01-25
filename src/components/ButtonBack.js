export default function ButtonBack({ onCloseMovie }) {
  return (
    <div className="details__back-btn" onClick={onCloseMovie}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className="details__back-btn-icon"
      >
        <rect width="256" height="256" fill="none" />
        <polyline
          points="80 152 32 104 80 56"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <path
          d="M224,200a96,96,0,0,0-96-96H32"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
      </svg>
    </div>
  );
}
