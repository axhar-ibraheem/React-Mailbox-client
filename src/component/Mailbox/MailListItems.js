import { ListGroup, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { setChecked } from "../../store/mailSlice";
import { useDispatch } from "react-redux";
import { setRead } from "../../store/mailSlice";
import axios from "axios";
import { useState } from "react";
import { toggleStarred } from "../../store/mailSlice";
const MailListItems = (props) => {
  const { mail } = props;
  const location = useLocation();
  const dispatch = useDispatch();

  const onCheckHandler = () => {
    dispatch(setChecked({ id: mail.id, selector: "single" }));
  };
  const [isHovered, setIsHovered] = useState(false);
  const [starHovered, setStarHovered] = useState(false);
  const starMouseEnter = () => {
    setStarHovered(true);
  };
  const starMouseLeave = () => {
    setStarHovered(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const starClickHandler = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    dispatch(toggleStarred({ id: mail.id }));
    try {
      const response = await axios.put(
        `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
        {
          ...mail,
          starred: !mail.starred,
          isChecked: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onClickHandler = async () => {
    dispatch(setChecked({ id: null, selector: "none" }));

    if (!mail.hasRead) {
      try {
        const response = await axios.put(
          `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
          {
            ...mail,
            hasRead: true,
            isChecked: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;

        if (response.status === 200) {
          dispatch(setRead({ id: mail.id }));
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <ListGroup.Item
      as={Link}
      to={
        location.pathname === "/welcome/inbox"
          ? `/welcome/inbox/${mail.id}`
          : location.pathname === "/welcome/trash"
          ? `/welcome/trash/${mail.id}`
          : location.pathname === "/welcome/sent"
          ? `/welcome/sent/${mail.id}`
          : `/welcome/starred/${mail.id}`
      }
      className={`mb-1 py-2 border-bottom ${
        mail.isChecked ? "bg-success bg-opacity-25" : ""
      } ${isHovered ? "shadow-sm" : ""}`}
      onClick={onClickHandler}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Row>
        <Col lg="3">
          <div className="d-flex">
            <Form>
              <Form.Check
                checked={mail.isChecked}
                onChange={onCheckHandler}
                onClick={(e) => e.stopPropagation()}
              />
            </Form>
            <div className="">
              {mail.starred ? (
                <i
                  className={`bi bi-star-fill text-warning px-1 ms-2 ${
                    starHovered ? "bg-secondary rounded bg-opacity-10" : ""
                  }`}
                  onClick={starClickHandler}
                  onMouseEnter={starMouseEnter}
                  onMouseLeave={starMouseLeave}
                />
              ) : (
                <i
                  className={`bi bi-star  px-1 ms-2 ${
                    starHovered ? "bg-secondary rounded bg-opacity-10" : ""
                  }`}
                  onClick={starClickHandler}
                  onMouseEnter={starMouseEnter}
                  onMouseLeave={starMouseLeave}
                />
              )}
            </div>

            <p className="fw-bold ps-3 m-0">
              <i
                className={`bi ${
                  mail.hasRead ? "invisible" : ""
                } bi-record-fill text-primary pe-1`}
              ></i>
              {mail.sender}
            </p>
          </div>{" "}
        </Col>
        <Col lg="7">
          <div>
            <span className="fw-bold">{mail.subject}</span>
            <span className="ps-2">{`${mail.emailContent.substring(
              0,
              70
            )}...`}</span>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </ListGroup.Item>
  );
};

export default MailListItems;
