import { Button, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import MailListItems from "../Mailbox/MailListItems";
import Selector from "../Mailbox/Selector";
import { setChecked } from "../../store/mailSlice";
import { useEffect } from "react";
import axios from "axios";
import { showNotification } from "../../store/authSlice";
import { moveMails } from "../../store/mailSlice";

import LoadingSpinner from "../UI/LoadingSpinner";
const Trash = () => {
  const mails = useSelector((state) => state.mail.mails);

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);
  const filteredMails = mails.filter((mail) => mail.trashed === true);

  const isDeleteEnabled = filteredMails.some((item) => item.isChecked);

  const onRestoreHandler = async () => {
    try {
      const updatedPromises = filteredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: false,
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
        showNotification({
          message: "Restored! Moved to Inbox",
          variant: "success",
        })
      );
      dispatch(moveMails("toInbox"));
      console.log(responses);
    } catch (error) {
      console.log(error.message);
    }
  };

  const content = (
    <div className="text-center mt-5">
      {" "}
      <h5>Trash is Empty</h5>
    </div>
  );

  useEffect(() => {
    return () => {
      dispatch(setChecked({ id: null, selector: "none" }));
    };
  }, []);

  return (
    <>
      <div className="border-bottom d-flex align-items-center py-2 px-1">
        <Selector filteredMails={filteredMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            disabled={filteredMails.length === 0}
            size="sm"
            variant="secondary"
            className="border-0 me-3"
          >
            Empty Trash Now
          </Button>
          <Button
            disabled={!isDeleteEnabled}
            size="sm"
            variant="secondary"
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
        <ListGroup variant="flush" className="">
          {filteredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Trash;
