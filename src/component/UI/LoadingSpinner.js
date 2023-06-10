import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <Spinner animation="border" role="status" variant="dark">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default LoadingSpinner;
