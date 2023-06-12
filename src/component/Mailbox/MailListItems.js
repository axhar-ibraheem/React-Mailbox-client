import { ListGroup, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { setChecked } from "../../store/mailSlice";
import { useDispatch } from "react-redux";
import { setRead } from "../../store/mailSlice";
import axios from "axios";
const MailListItems = (props) => {
  const { mail } = props;
  const dispatch = useDispatch();

  const onCheckHandler = (e) => {
    e.stopPropagation();
    dispatch(setChecked({ id: mail.id, mail: "single" }));
  };
  const onClickHandler = async () => {
    dispatch(setChecked({ id: null, mail: "none" }));
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
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ListGroup.Item
      action
      as={Link}
      to={`/welcome/inbox/${mail.id}`}
      className={`border-bottom ${
        mail.isChecked ? "bg-success bg-opacity-25" : ""
      }`}
      onClick={onClickHandler}
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
            <span>
              <i className="bi bi-star ps-3"></i>
            </span>

            <p className="fw-bold ps-3">
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
            <span className="ps-2">
              The time has come for us to sunset this Slack community and...
            </span>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </ListGroup.Item>
  );
};

export default MailListItems;
