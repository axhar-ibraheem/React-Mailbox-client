import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/authSlice";
const Notification = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(showNotification({ message: null, variant: null }));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Alert className="rounded-0 border-0" variant={props.variant}>
      {props.variant === "danger" ? (
        <i className="bi bi-exclamation-octagon-fill pe-3 fs-4"></i>
      ) : (
        <i className=" fs-4 pe-3 bi bi-check-circle-fill"></i>
      )}
      {props.message}
    </Alert>
  );
};

export default Notification;
