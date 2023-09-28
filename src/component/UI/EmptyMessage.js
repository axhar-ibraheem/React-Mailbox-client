const EmptyMessage = (props) => {
  return (
    <div className="text-center mt-5">
      <h5>{props.message}</h5>
      {props.link}
    </div>
  );
};

export default EmptyMessage;
