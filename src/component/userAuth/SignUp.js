import {
  Form,
  Button,
  FloatingLabel,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../UI/Notification";
import { showNotification } from "../../store/authSlice";
import { setIsLoading } from "../../store/authSlice";
import { login } from "../../store/authSlice";
import { useHistory } from "react-router-dom";
import useInput from "../../hooks/useInput";
import InputErrorMessage from "./InputErrorMessage";
const SignUp = () => {
  const [
    enteredEmail,
    emailInputHandler,
    emailBlurHandler,
    emailHasError,
  ] = useInput((email) => email.includes("@"));
  const [
    enteredPassword,
    passwordInputHandler,
    passwordBlurHandler,
    passwordHasError,
  ] = useInput((password) => password.length > 7);
  const [
    enteredConfirmPassword,
    confirmPasswordInputHandler,
    confirmPasswordBlurHandler,
    confirmPasswordHasError,
  ] = useInput((confirmPassword) => confirmPassword === enteredPassword);

  const isLoading = useSelector((state) => state.auth.isLoading);
  const apiKey = useSelector((state) => state.auth.apiKey);
  const dispatch = useDispatch();
  const { message, variant } = useSelector((state) => state.auth.notification);
  const [signIn, setSignIn] = useState(true);
  const history = useHistory();

  const onClickHandler = () => {
    setSignIn(!signIn);
  };
  const endPointUrl = signIn
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      if (
        !signIn &&
        (emailHasError || passwordHasError || confirmPasswordHasError)
      )
        return;
      if (emailHasError || passwordHasError) return;
      dispatch(setIsLoading(true));

      const response = await axios.post(endPointUrl, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });
      const data = response.data;
      if (response.status === 200) {
        if (signIn) {
          dispatch(login({ idToken: data.idToken, email: data.email }));
          history.replace("/welcome/inbox");
        } else {
          const message = "Welcome! You can now login with your credentials";
          dispatch(showNotification({ message: message, variant: "success" }));
        }
      }
    } catch (error) {
      const { data } = error.response;
      const { message } = data.error;
      dispatch(showNotification({ message: message, variant: "danger" }));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const testUserHandler = () => {};

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center min-vh-100 align-items-center">
          {message && (
            <div className="fixed-top p-0">
              {" "}
              <Notification message={message} variant={variant} />{" "}
            </div>
          )}
          <Col>
            <div className="text-center pb-4">
              <h3>
                Welcome to{" "}
                <span className="text-danger fst-italic">Mail Box Client </span>
              </h3>
              <p>Please Sign Up/Login to continue.</p>
            </div>
            <div
              style={{ maxWidth: "25rem" }}
              className="text-center bg-danger bg-gradient mx-auto rounded-top py-1"
            >
              <i className="bi bi-envelope-at-fill fs-1 text-light"></i>
            </div>
            <Form
              onSubmit={onSubmitHandler}
              className="p-4 shadow-lg mx-auto "
              style={{ maxWidth: "25rem" }}
            >
              <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  className={`border-0 border-bottom ${
                    emailHasError ? "border-danger" : ""
                  } rounded-0`}
                  type="email"
                  placeholder="name@example.com"
                  onChange={emailInputHandler}
                  onBlur={emailBlurHandler}
                  value={enteredEmail}
                  required
                />
                {emailHasError && (
                  <InputErrorMessage message="Please enter a valid Email!" />
                )}
              </FloatingLabel>

              <FloatingLabel
                className="mb-3"
                controlId="floatingPassword"
                label="Password"
              >
                <Form.Control
                  className={`border-0 ${
                    passwordHasError ? "border-danger" : ""
                  } border-bottom rounded-0`}
                  type="password"
                  placeholder="Password"
                  onBlur={passwordBlurHandler}
                  onChange={passwordInputHandler}
                  value={enteredPassword}
                  required
                />
                {passwordHasError && (
                  <InputErrorMessage message="Password is too short!" />
                )}
              </FloatingLabel>
              {!signIn && (
                <FloatingLabel
                  controlId="floatingConfirmPassword"
                  label="Confirm Password"
                >
                  <Form.Control
                    className={`border-0 border-bottom ${
                      confirmPasswordHasError ? "border-danger" : ""
                    } rounded-0`}
                    type="password"
                    placeholder="Password"
                    onChange={confirmPasswordInputHandler}
                    onBlur={confirmPasswordBlurHandler}
                    value={enteredConfirmPassword}
                    required
                  />
                  {confirmPasswordHasError && (
                    <InputErrorMessage message="Passwords don't match!" />
                  )}
                </FloatingLabel>
              )}
              <div className="text-center mt-4">
                {signIn ? (
                  <Button
                    type="submit"
                    className={`w-100 mt-2 bg-danger ${
                      isLoading ? "bg-gradient" : ""
                    }  rounded-0 border-0 text-light fw-bold`}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`w-100 mt-2 bg-danger ${
                      isLoading ? "bg-gradient" : " "
                    }  rounded-0 border-0 text-light fw-bold`}
                  >
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                )}
              </div>
              <div className="pt-3 text-center">
                <span>
                  {!signIn ? "Already a user?" : "First Time?"}{" "}
                  <span
                    onClick={onClickHandler}
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    {!signIn ? "Login" : "Sign Up"}
                  </span>{" "}
                </span>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUp;
