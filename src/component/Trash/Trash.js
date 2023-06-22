import { Button, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import MailListItems from "../Mailbox/MailListItems";
import Selector from "../Mailbox/Selector";
import ConfirmDelete from "./ConfirmDelete";
import {
  moveFromInbox,
  moveFromSentbox,
  setChecked,
} from "../../store/mailSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { showNotification } from "../../store/authSlice";
import LoadingSpinner from "../UI/LoadingSpinner";
import { emptyTrash } from "../../store/mailSlice";

const Trash = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const senderMail = email.replace(/[.]/g, "");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);

  const filteredMails = mails.filter((mail) => mail.trashed === true);

  const isDeleteEnabled = filteredMails.some((item) => item.isChecked);

  const url1 = `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails`;
  const url2 = `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/sent-emails/${senderMail}`;

  const onRestoreHandler = async () => {
    try {
      const updatedPromises = filteredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            mail.sender === email
              ? `${url2}/${mail.id}.json`
              : `${url1}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: false,
            }
          )
        );

      await Promise.all(updatedPromises);
      dispatch(
        showNotification({
          message: "Restored! ",
          variant: "success",
        })
      );
      dispatch(moveFromInbox({ move: "toInbox", email: email }));
      dispatch(moveFromSentbox({ move: "toSentbox", email: email }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const emptyTrashHandler = async () => {
    try {
      const updatedPromises = filteredMails.map((mail) =>
        axios.delete(
          mail.sender === email
            ? `${url2}/${mail.id}.json`
            : `${url1}/${mail.id}.json`
        )
      );
      await Promise.all(updatedPromises);

      dispatch(emptyTrash());
      setShow(false);
      dispatch(
        showNotification({
          message: "Trash is cleared",
          variant: "success",
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const content = (
    <div className="text-center mt-5">
      {" "}
      <h5>No conversations in Trash!</h5>
    </div>
  );

  useEffect(() => {
    return () => {
      dispatch(setChecked({ id: null, selector: "none" }));
      dispatch(showNotification({ message: null, variant: null }));
    };
  }, [dispatch]);

  return (
    <>
      {
        <ConfirmDelete
          handleClose={handleClose}
          show={show}
          emptyTrashHandler={emptyTrashHandler}
        />
      }

      <div className="border-bottom d-flex align-items-center py-2 px-1">
        <Selector filteredMails={filteredMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            disabled={filteredMails.length === 0}
            size="sm"
            variant="danger"
            className="border-0 me-3"
            onClick={handleShow}
          >
            Empty Trash Now
          </Button>
          <Button
            disabled={!isDeleteEnabled}
            size="sm"
            variant="danger"
            className="border-0 "
            onClick={onRestoreHandler}
          >
            Restore
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : filteredMails.length === 0 ? (
        content
      ) : (
        <ListGroup
          variant="flush"
          className="overflow-auto"
          style={{ maxHeight: "85vh" }}
        >
          {filteredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Trash;
