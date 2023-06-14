import { useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import MailListItems from "./MailListItems";
import { setChecked } from "../../store/mailSlice";
import { moveFromInbox } from "../../store/mailSlice";
import LoadingSpinner from "../UI/LoadingSpinner";
import { showNotification } from "../../store/authSlice";
import Selector from "./Selector";
const Inbox = () => {
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);
  const email = useSelector((state) => state.auth.email);
  const filteredMails = mails.filter(
    (mail) => mail.trashed === false && mail.recipient === email
  );

  const isDeleteEnabled = filteredMails.some((mail) => mail.isChecked);

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
      dispatch(moveFromInbox("toTrash"));
    } catch (error) {
      console.log(error.message);
    }
  };

  const content = (
    <div className="text-center mt-5">
      {" "}
      <h5>Your inbox is Empty!</h5>
    </div>
  );

  return (
    <>
      <div className="border-bottom d-flex align-items-center py-2 px-1">
        <Selector filteredMails={filteredMails} />

        <div className="ms-auto mx-lg-auto">
          <Button
            variant="secondary"
            className="px-2 border-0"
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
