import { useState } from "react";

const useInput = (validateValue) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const inputValueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };
  const inputBlurHandler = () => {
    setIsTouched(true);
  };
  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;
  const resetInputState = (text) => {
    setEnteredValue(text);
    setIsTouched(false);
  };
  return [
    enteredValue,
    inputValueChangeHandler,
    inputBlurHandler,
    hasError,
    resetInputState,
  ];
};

export default useInput;
