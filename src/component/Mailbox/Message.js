import { useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Button } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import { moveToTrash, deleteForever } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import axios from "axios";
const Message = () => {
  const { messageId } = useParams();

  const location = useLocation();
  const mails = useSelector((state) => state.mail.mails);
  const mailItem = mails.filter((mail) => mail.id === messageId);
  const history = useHistory();
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");

  const [mail] = mailItem;
  const url =
    mail.sender === email
      ? `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/sent-emails/${senderMail}/${mail.id}.json`
      : `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails/${mail.id}.json`;

  const moveToTrashHandler = async () => {
    try {
      const response = await axios.put(
        url,
        {
          ...mail,
          trashed: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        dispatch(moveToTrash(messageId));
        dispatch(
          showNotification({ message: "Moved to trash!", variant: "success" })
        );
        history.replace(
          location.pathname === `/welcome/inbox/${mail.id}`
            ? "/welcome/inbox"
            : location.pathname === `/welcome/trash/${mail.id}`
            ? "/welcome/trash"
            : location.pathname === `/welcome/sent/${mail.id}`
            ? "/welcome/sent"
            : "/welcome/starred"
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteForeverHandler = async () => {
    dispatch(deleteForever({ id: messageId }));
    history.replace("/welcome/trash");
    try {
      const response = await axios.delete(url);

      const data = response.data;
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Mail deleted forever",
            variant: "success",
          })
        );
      }
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const onBackHandler = () => {
    history.replace(
      location.pathname === `/welcome/inbox/${mail.id}`
        ? "/welcome/inbox"
        : location.pathname === `/welcome/trash/${mail.id}`
        ? "/welcome/trash"
        : location.pathname === `/welcome/sent/${mail.id}`
        ? "/welcome/sent"
        : "/welcome/starred"
    );
  };
  const dispatch = useDispatch();
  if (mails.length === 0) {
    return (
      <Container className="h-100">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }
  return (
    <>
      <div className="border-bottom py-2 px-2 d-flex align-items-center">
        <p
          className="m-0"
          onClick={onBackHandler}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-arrow-left pe-2"></i>
          <span>Back</span>
        </p>

        {location.pathname !== `/welcome/trash/${messageId}` ? (
          <Button
            variant="secondary"
            className="px-2 mb-1 border-0 ms-auto mx-lg-auto"
            onClick={moveToTrashHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi pe-2 bi-trash3"></i>
              <span className="">Delete</span>
            </p>
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="px-2 border-0 ms-auto mx-lg-auto"
            onClick={deleteForeverHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi pe-2 bi-trash3"></i>
              <span className="">Delete Forever</span>
            </p>
          </Button>
        )}
      </div>
      <div className="px-3">
        <div className="pt-3">
          <span className="fw-bold">From:</span>
          <span>{mail.sender}</span>
        </div>
        <div className="pt-3">
          <span className="fw-bold">To:</span>
          <span>me {`(${mail.recipient})`} </span>
        </div>
        <p className="fw-bold pt-5">Subject: {mail.subject}</p>
        <div className="mt-5 bg-light mx-lg-auto">
          <p>{mail.emailContent} </p>
        </div>
      </div>
    </>
  );
};

export default Message;
