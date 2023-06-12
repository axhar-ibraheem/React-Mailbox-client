import { useEffect } from "react";
import SignUp from "./component/userAuth/SignUp";
import Welcome from "./Pages/Welcome";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom/cjs/react-router-dom";
import mailSlice, { addToInbox } from "./store/mailSlice";
import axios from "axios";
import { setMailsLoading } from "./store/mailSlice";
import { clearMails } from "./store/mailSlice";

function App() {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMailsLoading(true));

    const getEmails = async () => {
      try {
        const response = await axios.get(
          "https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails.json",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (response.status === 200) {
          for (const key in data) {
            const mailItem = {
              id: key,
              ...data[key],
            };
            dispatch(addToInbox(mailItem));
          }
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        dispatch(setMailsLoading(false));
      }
    };
    if (email) {
      getEmails();
    }

    return () => {
      dispatch(clearMails());
    };
  }, [email]);

  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/auth" />
      </Route>
      <Route path="/auth">
        <SignUp />
      </Route>
      {auth && (
        <Route path="/welcome">
          <Welcome />
        </Route>
      )}
      {!auth && (
        <Route path="*">
          <Redirect to="/auth" />
        </Route>
      )}
    </Switch>
  );
}

export default App;
