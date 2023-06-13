import { useEffect } from "react";
import {
  ListGroup,
  Form,
  Button,
  Dropdown,
  SplitButton,
  Container,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import MailListItems from "./MailListItems";
import { setChecked } from "../../store/mailSlice";
import { moveMails } from "../../store/mailSlice";
import LoadingSpinner from "../UI/LoadingSpinner";
import Notification from "../UI/Notification";
import { showNotification } from "../../store/authSlice";
import Selector from "./Selector";
const Inbox = () => {
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);
  const { message, variant } = useSelector((state) => state.auth.notification);

  let filteredMails = mails.filter((mail) => mail.trashed === false);

  const isDeleteEnabled = filteredMails.some((item) => item.isChecked);

  useEffect(() => {
    return () => {
      dispatch(setChecked({ id: null, selector: "none" }));
    };
  }, []);

  const onDeleteHandler = async () => {
    try {
      const updatedPromises = filteredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: true,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        );
      const responses = await Promise.all(updatedPromises);

      dispatch(
        showNotification({ message: "Moved to trash!", variant: "success" })
      );
      dispatch(moveMails("toTrash"));
      console.log(responses);
    } catch (error) {}
  };

  const content = (
    <div className="text-center mt-5">
      {" "}
      <h5>Your inbox is Empty</h5>
    </div>
  );

  return (
    <>
      {message && (
        <div
          style={{ maxWidth: "20rem" }}
          className="fixed-top ms-auto mt-2 me-3"
        >
          <Notification message={message} variant={variant} />
        </div>
      )}
      <div className="border-bottom d-flex align-items-center pt-3 pb-2 px-1">
        <Selector filteredMails={filteredMails} />

        <div className="ms-auto mx-lg-auto">
          <Button
            variant="secondary"
            className="px-2 mb-1 border-0"
            disabled={!isDeleteEnabled}
            onClick={onDeleteHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi pe-2 bi-trash3"></i>
              <span className="">Delete</span>
            </p>
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
        <ListGroup variant="flush" className="">
          {filteredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Inbox;
