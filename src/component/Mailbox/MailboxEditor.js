import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useRef, useState } from "react";
import { EditorState } from "draft-js";
import { useSelector, useDispatch } from "react-redux";
import { showNotification } from "../../store/authSlice";
import axios from "axios";
import { addToInbox } from "../../store/mailSlice";

const MailboxEditor = () => {
  const toRef = useRef();
  const subjectRef = useRef();
  const mailSender = useSelector((state) => state.auth.email);
  const email = mailSender.replace(/[.]/g, "");
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
    const mailSubject = subjectRef.current.value;
    const editorContent = editorState.getCurrentContent().getPlainText();

    const emailInfo = {
      recipient: to,
      subject: mailSubject,
      emailContent: editorContent,
      sender: mailSender,
      hasRead: false,
      trashed: false,
      starred: false,
    };

    if (emailInfo.recipient !== emailInfo.sender) {
      try {
        const url1 =
          "https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails.json";
        const url2 = `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

        const requests = [
          axios.post(url1, emailInfo),
          axios.post(url2, emailInfo),
        ];

        const responses = await Promise.all(requests);
        const [response1, response2] = responses;
        const { status: status1 } = response1;
        const { data, status: status2 } = response2;

        if (status1 === 200 && status2 === 200) {
          const mailItem = {
            id: data.name,
            isChecked: false,
            ...emailInfo,
          };

          dispatch(addToInbox([mailItem]));
          dispatch(showNotification({ message: "Sent", variant: "success" }));
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Cannot send mail to your own mail id");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={onSubmitHandler} className="p-3">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
          <Form.Control
            type="email"
            placeholder="example@gmail.com"
            ref={toRef}
            required
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">Subject</InputGroup.Text>
          <Form.Control type="text" placeholder="" ref={subjectRef} required />
        </InputGroup>
        <Form.Group className="mb-3" controlId="textEditor">
          <Editor
            toolbarClassName="py-3 border-bottom bg-light"
            wrapperClassName="card mt-3"
            editorClassName="card-body pt-0"
            editorStyle={{ maxHeight: "20rem", height: "15rem" }}
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
          />
        </Form.Group>
        <div>
          <Button
            type="submit"
            variant="secondary "
            className="bg-gradient shadow rounded-0 px-4"
          >
            {isLoading ? "Sending" : "Send"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default MailboxEditor;
