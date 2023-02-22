import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import AppContext from "../contexts/AppContext";

export default function PrivateRoute(props){
  const {currentUser} = React.useContext(AuthContext)
  const {companyProfile} = React.useContext(AppContext)
  
  return (currentUser && companyProfile) ? (
    <Route {...props}>{props.children}</Route>
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: props.location }
      }}
    />
  );
}
