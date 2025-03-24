import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x.toLowerCase() !== "home");

  // Check if the current location is not the home page
  if (pathnames.length === 0) {
    return null; // If it's the home page, don't render the breadcrumb
  }

  // Helper function to format the URL segments
  const formatBreadcrumb = (str) => {
    return str
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/-/g, " ") // Replace dashes with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <li
              key={to}
              className="breadcrumb-item"
              style={{ paddingBottom: "20px" }}
            >
              <Link to={to} aria-disabled="true">
                {formatBreadcrumb(value)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
