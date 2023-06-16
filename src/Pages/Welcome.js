import MailboxEditor from "../component/Mailbox/MailboxEditor";
import { Route, NavLink } from "react-router-dom";
import {
  Row,
  Col,
  ButtonGroup,
  ToggleButton,
  Container,
  Offcanvas,
} from "react-bootstrap";
import { useState } from "react";
import Inbox from "../component/Mailbox/Inbox";
import Message from "../component/Mailbox/Message";
import Logout from "../component/userAuth/Logout";
import Sent from "../component/Sent/Sent";
import { useSelector } from "react-redux";
import Trash from "../component/Trash/Trash";
import Notification from "../component/UI/Notification";
import Starred from "../component/Starred/Starred";
const Welcome = () => {
  const [show, setShow] = useState(false);
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const { message, variant } = useSelector((state) => state.auth.notification);

  const filteredMails = mails.filter(
    (mail) => mail.recipient === email && mail.trashed === false
  );

  let unread = 0;
  filteredMails.forEach((mail) => {
    if (!mail.hasRead) {
      unread++;
    }
  });

  const onClickHandler = () => {
    setShow(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container fluid>
      <Row className="vh-100 overflow-hidden">
        <Col className="bg-dark d-flex flex-column p-0 pb-4" xs="auto">
          <Offcanvas
            className="p-lg-3 pb-2 bg-dark"
            show={show}
            onHide={handleClose}
            responsive="lg"
            style={{ maxWidth: "70vw" }}
          >
            <Offcanvas.Body className="d-flex flex-column p-lg-2">
              <div className="text-center">
                <i className="bi bi-envelope-at-fill text-danger fs-2"></i>
                <p className="ps-2 fs-4 fw-bold text-info">Mail Box Client</p>
              </div>
              <div className="text-start mt-5">
                <ButtonGroup className="d-flex h-100 text-light flex-column">
                  <NavLink to="/welcome/inbox" activeClassName={"bg-success"}>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start border-0 py-2 text-light"
                      onClick={onClickHandler}
                    >
                      <div className="d-flex">
                        <span>
                          <i className="fs-4 pe-2 bi bi-envelope-fill"></i>{" "}
                          Inbox
                        </span>
                        <span className="pt-3 position-relative mx-auto">
                          unread
                          <span className=" p-0 position-absolute top-0 end-0 text-warning">
                            {unread}
                          </span>{" "}
                        </span>
                      </div>{" "}
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/welcome/sent" activeClassName={"bg-success"}>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 w-100 rounded-0 text-start border-0 text-light"
                      onClick={onClickHandler}
                    >
                      <i className=" fs-4 pe-2 bi bi-send-check-fill"></i> Sent
                    </ToggleButton>
                  </NavLink>
                  <NavLink
                    to="/welcome/mailboxeditor"
                    activeClassName={"bg-success"}
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 w-100 border-0 rounded-0 text-start text-light"
                      onClick={onClickHandler}
                    >
                      <i className="fs-4 pe-2 bi bi-envelope-plus-fill"></i>{" "}
                      Compose
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/welcome/trash" activeClassName={"bg-success"}>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start py-2 border-0 text-light"
                      onClick={onClickHandler}
                    >
                      <i className="fs-4 pe-2 bi bi-trash3"></i> Trash
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/welcome/starred" activeClassName={"bg-success"}>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start py-2 border-0 text-light"
                      onClick={onClickHandler}
                    >
                      <i className="bi fs-4 pe-2 bi-star-fill"></i> Starred
                    </ToggleButton>
                  </NavLink>
                </ButtonGroup>
              </div>
              <div className="mt-auto d-lg-none  ms-3">
                <Logout />
              </div>
            </Offcanvas.Body>
          </Offcanvas>
          <div className="mt-auto d-none d-lg-block ms-4">
            <Logout />
          </div>
        </Col>
        <Col>
          {message && (
            <div
              style={{ maxWidth: "15rem" }}
              className="fixed-top ms-auto mt-2 me-3"
            >
              <Notification message={message} variant={variant} />
            </div>
          )}
          <div className="d-lg-none border-bottom pb-2">
            <span className="px-3 py-2">
              <i
                onClick={handleShow}
                style={{ cursor: "pointer" }}
                className="bi bi-justify fs-2"
              ></i>
              <i className="bi fs-2 text-danger ps-3 bi-envelope-at-fill"></i>{" "}
              <span>Mail Box Client</span>
            </span>
          </div>

          <Route path="/welcome/mailboxeditor">
            <MailboxEditor />
          </Route>
          <Route path="/welcome/inbox" exact>
            <Inbox />
          </Route>
          <Route path="/welcome/trash" exact>
            <Trash />
          </Route>
          <Route path="/welcome/sent" exact>
            <Sent />
          </Route>
          <Route path="/welcome/starred" exact>
            <Starred />
          </Route>
          <Route path="/welcome/starred/:messageId">
            <Message />
          </Route>
          <Route path="/welcome/sent/:messageId">
            <Message />
          </Route>
          <Route path="/welcome/inbox/:messageId">
            <Message />
          </Route>
          <Route path="/welcome/trash/:messageId">
            <Message />
          </Route>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
