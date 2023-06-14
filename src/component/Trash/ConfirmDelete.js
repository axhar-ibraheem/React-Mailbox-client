import { Modal, Button } from "react-bootstrap";

const ConfirmDelete = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      centered
    >
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>Confirm deleting messages</Modal.Title>
      </Modal.Header>
      <Modal.Body className="border-0">
        This action will delete all the conversations in trash permanently!
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="dark"
          className="rounded-pill border-0 bg-gradient shadow "
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="info"
          className="px-4 border-0 shadow bg-gradient  rounded-pill"
          onClick={props.emptyTrashHandler}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDelete;
