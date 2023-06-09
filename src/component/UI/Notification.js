import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
const Notification = (props) => {
  return <Alert variant={props.variant}>{props.message}</Alert>;
};

export default Notification;
