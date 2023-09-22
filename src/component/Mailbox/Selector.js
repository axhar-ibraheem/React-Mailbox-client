import { setChecked } from "../../store/mailSlice";
import { useDispatch } from "react-redux";
import { SplitButton, Form, Dropdown } from "react-bootstrap";

const Selector = (props) => {
  const dispatch = useDispatch();
  const checked = props.filteredMails.some((mail) => mail.isChecked === false);

  const selectHandler = (select) => {
    dispatch(setChecked({ id: null, selector: select }));
  };

  return (
    <SplitButton
      variant={"light"}
      title={
        <Form>
          <Form.Check
            onChange={() => selectHandler("all")}
            checked={!checked && props.filteredMails.length > 0}
          />
        </Form>
      }
      className="p-0"
      disabled={props.filteredMails.length === 0}
    >
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("allMark")}
        eventKey="1"
      >
        All
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => selectHandler("none")}
        as={"button"}
        eventKey="2"
      >
        None
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("read")}
        eventKey="3"
      >
        Read
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("unread")}
        eventKey="4"
      >
        Unread
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("starred")}
        eventKey="5"
      >
        Starred
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("unstarred")}
        eventKey="6"
      >
        Unstarred
      </Dropdown.Item>
    </SplitButton>
  );
};

export default Selector;
