import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/authSlice";

const Notification = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(showNotification({ message: null, variant: null }));
    }, 4000);

    return () => clearTimeout(timer);
  }, [dispatch]);
  return (
    <Alert className="rounded-0 text-center border-0 px-3 p-2" variant={props.variant}>
      {props.variant === "danger" ? (
        <i className="bi bi-exclamation-octagon-fill pe-2 fs-5"></i>
      ) : (
        <i className=" fs-5 pe-2 bi bi-check-circle-fill"></i>
      )}
      {props.message}
    </Alert>
  );
};

export default Notification;
