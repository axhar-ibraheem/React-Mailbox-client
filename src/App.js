import { useEffect } from "react";
import SignUp from "./component/userAuth/SignUp";
import Welcome from "./Pages/Welcome";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { addToInbox, clearInbox } from "./store/mailSlice";
import useAxiosFetch from "./hooks/useAxiosFetch.";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const recipientMail = useSelector((state) => state.auth.email);

  const { fetchData: fetchMails } = useAxiosFetch();
  const email = isAuthenticated ? recipientMail.replace(/[.]/g, "") : undefined;
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();
  const url1 =
    "https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails.json";
  const url2 = `https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

  const urls = [url1, url2];

  useEffect(() => {
    const onSuccess = (responses) => {
      const receivedMails = responses[0]?.data;
      const sentMails = responses[1]?.data;

      const inboxMails = receivedMails
        ? Object.entries(receivedMails)
            .filter(([key, mail]) => mail.recipient === recipientMail)
            .map(([key, mail]) => ({
              ...mail,
              id: key,
              isChecked: false,
            }))
        : [];

      const sentMailItems = sentMails
        ? Object.entries(sentMails).map(([key, mail]) => ({
            ...mail,
            id: key,
            isChecked: false,
          }))
        : [];

      const allMails = [...sentMailItems, ...inboxMails];
      dispatch(addToInbox(allMails));
    };

    if (recipientMail) {
      fetchMails(urls, "GET", null, onSuccess);
    }

    return () => {
      dispatch(clearInbox());
    };
    // eslint-disable-next-line
  }, [recipientMail, dispatch, fetchMails]);

  useEffect(() => {
    const onSuccess = (response) => {
      const data = response.data;
      const arr = [];
      for (const key in data) {
        const mailItem = {
          ...data[key],
          id: key,
          isChecked: false,
        };
        if (mailItem.recipient === recipientMail) {
          arr.push(mailItem);
        }
      }
      arr.forEach((mail) => {
        if (!mails.some((email) => email.id === mail.id)) {
          dispatch(addToInbox([mail]));
        }
      });
    };

    const interval = setInterval(() => {
      if (recipientMail) {
        fetchMails(url1, "GET", null, onSuccess);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchMails, recipientMail, mails, dispatch]);

  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/auth" />
      </Route>
      <Route path="/auth">
        <SignUp />
      </Route>
      {isAuthenticated && (
        <Route path="/welcome">
          <Welcome />
        </Route>
      )}
      {!isAuthenticated ? (
        <Redirect from="*" to="/auth" />
      ) : (
        <Redirect from="*" to="/welcome/inbox" />
      )}
    </Switch>
  );
}

export default App;
