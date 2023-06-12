import { useState, useEffect } from "react";
import {
  ListGroup,
  Form,
  Button,
  Dropdown,
  SplitButton,
  Container,
} from "react-bootstrap";
import { addToInbox } from "../../store/mailSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Route } from "react-router-dom";
import Message from "./Message";
import MailListItems from "./MailListItems";
import { setChecked } from "../../store/mailSlice";
import { deleteMail } from "../../store/mailSlice";
import LoadingSpinner from "../UI/LoadingSpinner";
const Inbox = () => {
  const email = useSelector((state) => state.auth.email);
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();
  const isDeleteEnabled = mails.some((item) => item.isChecked);
  const checked = mails.some((item) => item.isChecked === false);
  const isLoading = useSelector((state) => state.mail.isLoading);

  const filteredMails = mails.filter((mail) => mail.recipient === email);

  useEffect(() => {
    return () => {
      dispatch(setChecked({ id: null, mail: "none" }));
    };
  }, []);

  const onDeleteHandler = () => {
    dispatch(deleteMail());
  };
  const selectAllHandler = () => {
    dispatch(setChecked({ id: null, mail: "allMark" }));
  };

  const noneSelectHandler = () => {
    dispatch(setChecked({ id: null, mail: "none" }));
  };
  const readSelectHandler = () => {
    dispatch(setChecked({ id: null, mail: "read" }));
  };
  const unreadSelectHandler = () => {
    dispatch(setChecked({ id: null, mail: "unread" }));
  };

  const onSelectAllMailsHandler = () => {
    dispatch(setChecked({ id: null, mail: "all" }));
  };

  const content = (
    <div className="text-center mt-5">
      {" "}
      <h4>Your inbox is Empty</h4>
    </div>
  );

  return (
    <>
      <div className="border-bottom d-flex align-items-center pt-3 pb-2 px-3">
        <SplitButton
          variant={"light"}
          title={
            <Form className="">
              <Form.Check
                className=""
                onChange={onSelectAllMailsHandler}
                checked={!checked}
              />
            </Form>
          }
          className="p-0"
        >
          <Dropdown.Item as={"button"} onClick={selectAllHandler} eventKey="1">
            All
          </Dropdown.Item>
          <Dropdown.Item onClick={noneSelectHandler} as={"button"} eventKey="2">
            None
          </Dropdown.Item>
          <Dropdown.Item as={"button"} onClick={readSelectHandler} eventKey="4">
            Read
          </Dropdown.Item>
          <Dropdown.Item
            as={"button"}
            onClick={unreadSelectHandler}
            eventKey="2"
          >
            Unread
          </Dropdown.Item>
          <Dropdown.Item as={"button"} eventKey="4">
            Starred
          </Dropdown.Item>
        </SplitButton>

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
          <LoadingSpinner></LoadingSpinner>
        </div>
      ) : filteredMails.length === 0 ? (
        content
      ) : (
        <ListGroup variant="flush" className="shadow-sm">
          {filteredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Inbox;
