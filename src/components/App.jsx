import React from "react";
import { Switch, Route, Router } from "react-router-dom";
import { history, apolloClient } from "../store";
import { CssBaseline } from "@material-ui/core";
import { UserList } from "./UserList";
import { UserUpdateForm } from "./UserUpdateForm";
import { UserCreateForm } from "./UserCreateForm";
import { ApolloProvider } from "@apollo/react-hooks";

function App() {
  return (
    <CssBaseline>
      <ApolloProvider client={apolloClient}>
        <Router history={history}>
          <Switch>
            <Route exact path="/users/new" component={UserCreateForm} />
            <Route exact path="/users/:id" component={UserUpdateForm} />
            <Route component={UserList} />
          </Switch>
        </Router>
      </ApolloProvider>
    </CssBaseline>
  );
}

export default App;

