import Selector from "../Mailbox/Selector";
import { Button, ListGroup } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import MailListItems from "../Mailbox/MailListItems";
import { useDispatch, useSelector } from "react-redux";
import { setChecked, moveFromStarred } from "../../store/mailSlice";
import { useEffect } from "react";
import { showNotification } from "../../store/authSlice";
import axios from "axios";
const Starred = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const senderMail = email.replace(/[.]/g, "");

  const starredMails = mails.filter(
    (mail) => mail.starred && mail.trashed === false
  );

  const isDeleteEnabled = starredMails.some((mail) => mail.isChecked);
  const content = (
    <div className="text-center mt-5">
      {" "}
      <h5>No Starred messages!</h5>
    </div>
  );
  const url1 = `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails`;
  const url2 = `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/sent-emails/${senderMail}`;

  const onDeleteHandler = async () => {
    try {
      const updatedPromises = starredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            mail.sender === email
              ? `${url2}/${mail.id}.json`
              : `${url1}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: true,
            }
          )
        );
      await Promise.all(updatedPromises);

      dispatch(moveFromStarred("toTrash"));
      dispatch(
        showNotification({
          message: "Moved to Trash!",
          variant: "success",
        })
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
        <Selector filteredMails={starredMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            disabled={!isDeleteEnabled}
            variant="secondary"
            className="border-0 px-2"
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
      ) : starredMails.length === 0 ? (
        content
      ) : (
        <ListGroup
          style={{ maxHeight: "80vh" }}
          variant="flush"
          className="overflow-auto"
        >
          {starredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Starred;
