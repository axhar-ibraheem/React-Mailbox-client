import MailboxEditor from "../component/Mailbox/MailboxEditor";
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
const Welcome = () => {
  const [active, setActive] = useState("inbox");
  const handleCompose = () => {
    setActive("compose");
    setShow(false);
  };
  const handleInbox = () => {
    setActive("inbox");
    setShow(false);
  };
  const handleSent = () => {
    setActive("sent");
    setShow(false);
  };
  const handleBin = () => {
    setActive("bin");
    setShow(false);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container fluid>
      <div className="d-lg-none border-bottom pb-2">
        <span className="px-3 py-2">
          <i
            onClick={handleShow}
            style={{ cursor: "pointer" }}
            className="bi bi-justify fs-2"
          ></i>
          <i className="bi fs-4 text-danger ps-3 bi-envelope-at">
            Mail Box Client
          </i>
        </span>
      </div>
      <Row style={{ minHeight: "100vh" }} className="">
        <Col className="bg-dark p-0 br-gradient" xs="auto">
          <Offcanvas
            className="p-lg-3 bg-dark"
            show={show}
            onHide={handleClose}
            responsive="lg"
          >
            <Offcanvas.Header
              className="text-light"
              closeButton
            ></Offcanvas.Header>
            <Offcanvas.Body>
              <div className="p-2">
                <div className="d-flex flex-column text-center">
                  <i className="bi bi-envelope-at-fill text-danger fs-2"></i>
                  <span className="ps-2 fs-4 fw-bold text-info">
                    Mail Box Client
                  </span>
                </div>
                <div className="text-start mt-5">
                  <ButtonGroup className="d-flex justify-content-start text-light flex-column">
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 text-start border-0 py-2 text-light"
                      onClick={handleInbox}
                      checked={active === "inbox"}
                    >
                      <i className="fs-4 pe-2 bi bi-envelope-fill"></i> Inbox
                    </ToggleButton>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 text-start border-0 text-light"
                      onClick={handleSent}
                      checked={active === "sent"}
                    >
                      <i className=" fs-4 pe-2 bi bi-send-check-fill"></i> Sent
                    </ToggleButton>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 border-0 text-start text-light"
                      checked={active === "compose"}
                      onClick={handleCompose}
                    >
                      <i className="fs-4 pe-2 bi bi-envelope-plus-fill"></i>{" "}
                      Compose
                    </ToggleButton>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 text-start py-2 border-0 text-light"
                      onClick={handleBin}
                      checked={active === "bin"}
                    >
                      <i className="fs-4 pe-2 bi bi-trash3"></i> Trash
                    </ToggleButton>
                  </ButtonGroup>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Col>
        <Col>
          {active === "compose" && <MailboxEditor />}
          {active === "inbox" && <Inbox />}
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
