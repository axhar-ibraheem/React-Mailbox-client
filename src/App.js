import { useEffect } from "react";
import SignUp from "./component/userAuth/SignUp";
import Welcome from "./Pages/Welcome";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import { setMailsLoading } from "./store/mailSlice";
import { addToInbox, clearInbox } from "./store/mailSlice";

function App() {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const recipientMail = useSelector((state) => state.auth.email);

  let email;
  if (auth) {
    email = recipientMail.replace(/[.]/g, "");
  }
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();

  const url1 =
    "https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails.json";
  const url2 = `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

  useEffect(() => {
    dispatch(setMailsLoading(true));
    const getEmails = async () => {
      try {
        const requests = [axios.get(url1), axios.get(url2)];

        const responses = await Promise.all(requests);

        const [response1, response2] = responses;
        const { data: receivedMails, status: status1 } = response1;
        const { data: sentMails, status: status2 } = response2;

        if (status1 === 200 && status2 === 200) {
          for (const key in receivedMails) {
            const mailItem = {
              id: key,
              isChecked: false,
              ...receivedMails[key],
            };
            if (mailItem.recipient === recipientMail) {
              dispatch(addToInbox(mailItem));
            }
          }
          for (const key in sentMails) {
            const sentMailItem = {
              id: key,
              isChecked: false,
              ...sentMails[key],
            };

            dispatch(addToInbox(sentMailItem));
          }
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        dispatch(setMailsLoading(false));
      }
    };

    if (recipientMail) {
      getEmails();
    }

    return () => {
      dispatch(clearInbox());
    };
  }, [recipientMail, dispatch]);

  useEffect(() => {
    const getEmails = async () => {
      try {
        const response = await axios.get(url1);
        const data = response.data;

        const arr = [];
        if (response.status === 200) {
          for (const key in data) {
            const mailItem = {
              id: key,
              isChecked: false,
              ...data[key],
            };
            if (mailItem.recipient === recipientMail) {
              arr.push(mailItem);
            }
          }
        }
        arr.forEach((mail) => {
          if (!mails.some((email) => email.id === mail.id)) {
            dispatch(addToInbox(mail));
          }
        });
      } catch (e) {
        console.log(e.message);
      } finally {
      }
    };

    const interval = setInterval(() => {
      if (recipientMail) {
        getEmails();
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, recipientMail, mails]);

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
