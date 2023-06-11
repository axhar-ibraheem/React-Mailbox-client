import "./App.css";
import { useEffect } from "react";
import SignUp from "./component/userAuth/SignUp";
import Welcome from "./Pages/Welcome";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom/cjs/react-router-dom";
import { addToInbox } from "./store/mailSlice";
import axios from "axios";
function App() {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  useEffect(() => {
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
            const mailItem = { id: key, isChecked: false, ...data[key] };
            dispatch(addToInbox(mailItem));
          }
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    getEmails();
  }, []);

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
      <Route path="*">
        <Redirect to="/auth" />
      </Route>
    </Switch>
  );
}

export default App;
