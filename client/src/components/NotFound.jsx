import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/404.svg')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat:"no-repeat",
        width:"100%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <Link to="/">
        <button
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#9575cd",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;