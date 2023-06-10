import "./App.css";
import SignUp from "./component/userAuth/SignUp";
import Welcome from "./Pages/Welcome";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom/cjs/react-router-dom";
function App() {
  const auth = useSelector((state) => state.auth.isAuthenticated);
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
