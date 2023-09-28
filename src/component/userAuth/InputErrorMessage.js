const InputErrorMessage = (props) => {
  return (
    <p className="text-danger">
      <i className="bi bi-exclamation-circle"></i> {props.message}
    </p>
  );
};

export default InputErrorMessage;
