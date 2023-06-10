import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { useRef, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { useSelector, useDispatch } from "react-redux";
import Notification from "../UI/Notification";
import { showNotification } from "../../store/authSlice";
import axios from "axios";
const MailboxEditor = () => {
  const toRef = useRef();
  const subjectRef = useRef();
  const mailSender = useSelector((state) => state.auth.email);
  const { message, variant } = useSelector((state) => state.auth.notification);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const onSubmitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const to = toRef.current.value;
    const subject = subjectRef.current.value;
    const editorContent = convertToRaw(editorState.getCurrentContent());

    const email = {
      recipient: to,
      subject: subject,
      emailContent: editorContent,
      sender: mailSender,
    };
    try {
      const response = await axios.post(
        "https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails.json",
        email,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (response.status === 200) {
        console.log(data);
        dispatch(showNotification({ message: "Sent", variant: "success" }));
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container>
      {message && <Notification message={message} />}
      <Form onSubmit={onSubmitHandler} className="p-3">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
          <Form.Control
            placeholder="example@gmail.com"
            aria-label="Username"
            aria-describedby="basic-addon1"
            ref={toRef}
            required
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Subject</InputGroup.Text>
          <Form.Control
            placeholder=""
            aria-label="subject"
            aria-describedby="basic-addon2"
            ref={subjectRef}
            required
          />
        </InputGroup>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Editor
            toolbarClassName="py-3 border-bottom bg-light"
            wrapperClassName="card mt-3"
            editorClassName="card-body pt-0 "
            editorStyle={{ minHeight: "20rem" }}
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
            options={{}}
          />
        </Form.Group>
        <div>
          <Button
            type="submit"
            variant="info "
            className="bg-gradient shadow rounded-0 px-4"
          >
            {isLoading ? "Sending" : "Send"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default MailboxEditor;
