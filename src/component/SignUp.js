import {
  Form,
  Button,
  FloatingLabel,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./UI/Notification";
import { showNotification } from "../store/authSlice";
import { setIsLoading } from "../store/authSlice";
const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const apiKey = useSelector((state) => state.auth.apiKey);
  const dispatch = useDispatch();
  const { message, variant } = useSelector((state) => state.auth.notification);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      dispatch(setIsLoading(true));
      const enteredEmail = emailRef.current.value;
      const enteredPassword = passwordRef.current.value;
      const enteredConfirmPassword = confirmPasswordRef.current.value;

      if (enteredPassword !== enteredConfirmPassword) {
        dispatch(showNotification("Passwords don't match"));
        dispatch(setIsLoading(false));
        return;
      }

      const endPointUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

      const response = await axios.post(
        endPointUrl,
        {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (response.status === 200) {
        const message = "Welcome, you can now login with your credentials";
        dispatch(showNotification({ message: message, variant: "info" }));
      }
    } catch (error) {
      const errorMessage = error.response.data.error.message;
      dispatch(showNotification({ message: errorMessage, variant: "danger" }));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <Container fluid>
        <Notification message={message} variant={variant} />
        <Row className="justify-content-center vh-100 justify-content-center">
          <Col className="my-auto">
            <Form
              onSubmit={onSubmitHandler}
              className="p-4 shadow-lg mx-auto"
              style={{ maxWidth: "25rem" }}
            >
              <div className="text-center text-warning pb-3">
                <h4 className="fw-bold">Sign Up</h4>
              </div>
              <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  className="border-0 border-bottom rounded-0"
                  type="email"
                  placeholder="name@example.com"
                  ref={emailRef}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                className="mb-3"
                controlId="floatingPassword"
                label="Password"
              >
                <Form.Control
                  className="border-0 border-bottom rounded-0"
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingConfirmPassword"
                label="Confirm Password"
              >
                <Form.Control
                  className="border-0 border-bottom rounded-0"
                  type="password"
                  placeholder="Password"
                  ref={confirmPasswordRef}
                  required
                />
              </FloatingLabel>
              <div className="text-center mt-4">
                <Button
                  type="submit"
                  className="w-100 bg-primary bg-gradient rounded-0"
                >
                  Sign Up
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUp;
