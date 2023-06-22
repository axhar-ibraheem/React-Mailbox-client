import Selector from "../Mailbox/Selector";
import { Button, ListGroup } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import MailListItems from "../Mailbox/MailListItems";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { moveFromSentbox, setChecked } from "../../store/mailSlice";
import { useEffect } from "react";
import { showNotification } from "../../store/authSlice";

import axios from "axios";
const Sent = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");

  const sentMails = mails.filter(
    (mail) => mail.trashed === false && mail.sender === email
  );
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const isDeleteEnabled = sentMails.some((mail) => mail.isChecked);

  const content = (
    <div className="text-center mt-5">
      {" "}
      <h5>No sent messages!</h5>
      <Link to="/welcome/mailboxeditor">
        <span>Send</span>
      </Link>{" "}
      one now!
    </div>
  );

  const onDeleteHandler = async () => {
    try {
      const updatedPromises = sentMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/sent-emails/${senderMail}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: true,
            }
          )
        );
      await Promise.all(updatedPromises);

      dispatch(moveFromSentbox({ move: "toTrash", email: email }));
      dispatch(
        showNotification({ message: "Moved to trash!", variant: "success" })
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setChecked({ id: null, selector: "none" }));
      dispatch(showNotification({ message: null, variant: null }));
    };
  }, [dispatch]);

  return (
    <>
      <div className="border-bottom d-flex align-items-center py-2 px-1">
        <Selector filteredMails={sentMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            disabled={!isDeleteEnabled}
            variant="danger"
            className="border-0 px-2"
            onClick={onDeleteHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning pe-2 bi-trash3"></i>
              <span className="">Delete</span>
            </p>
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : sentMails.length === 0 ? (
        content
      ) : (
        <ListGroup
          style={{ maxHeight: "80vh" }}
          variant="flush"
          className="overflow-auto"
        >
          {sentMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Sent;
