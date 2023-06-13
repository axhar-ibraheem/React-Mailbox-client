import { setChecked } from "../../store/mailSlice";
import { useDispatch } from "react-redux";
import { SplitButton, Form, Dropdown } from "react-bootstrap";
import { useEffect } from "react";
const Selector = (props) => {
  const dispatch = useDispatch();
  const checked = props.filteredMails.some((mail) => mail.isChecked === false);
  console.log(props.filteredMails);
  const selectAllHandler = () => {
    dispatch(setChecked({ id: null, selector: "allMark" }));
  };

  const noneSelectHandler = () => {
    dispatch(setChecked({ id: null, selector: "none" }));
  };
  const readSelectHandler = () => {
    dispatch(setChecked({ id: null, selector: "read" }));
  };
  const unreadSelectHandler = () => {
    dispatch(setChecked({ id: null, selector: "unread" }));
  };

  const onSelectAllMailsHandler = () => {
    dispatch(setChecked({ id: null, selector: "all" }));
  };
  const starredSelectHandler = () => {
    dispatch(setChecked({ id: null, selector: "starred" }));
  };
  const unStarredSelectHandler = () => {
    dispatch(setChecked({ id: null, selector: "unstarred" }));
  };

  return (
    <SplitButton
      variant={"light"}
      title={
        <Form>
          <Form.Check
            onChange={onSelectAllMailsHandler}
            checked={!checked && props.filteredMails.length > 0}
          />
        </Form>
      }
      className="p-0"
      disabled={props.filteredMails.length === 0}
    >
      <Dropdown.Item as={"button"} onClick={selectAllHandler} eventKey="1">
        All
      </Dropdown.Item>
      <Dropdown.Item onClick={noneSelectHandler} as={"button"} eventKey="2">
        None
      </Dropdown.Item>
      <Dropdown.Item as={"button"} onClick={readSelectHandler} eventKey="3">
        Read
      </Dropdown.Item>
      <Dropdown.Item as={"button"} onClick={unreadSelectHandler} eventKey="4">
        Unread
      </Dropdown.Item>
      <Dropdown.Item as={"button"} onClick={starredSelectHandler} eventKey="5">
        Starred
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={unStarredSelectHandler}
        eventKey="6"
      >
        Unstarred
      </Dropdown.Item>
    </SplitButton>
  );
};

export default Selector;
