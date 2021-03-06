import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
// import User from './User';
import Groups from "./Groups";
import GroupDetails from "./GroupDetails";
import MyGroups from "./MyGroups";
import CreateGroup from "./CreateGroup";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import auth from "../auth/auth";

import ProtectedRoute from "./protectedRoutes/ProtectedRoute";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      name: "",
      joinedID: [],
    };
    this.toLogin = this.toLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  toLogin(data) {
    // console.log("this is in the toLogin", data);
    this.setState({ isLoggedIn: true, name: data.name });
  }

  // when the user fresh the page, check whether logged in
  UNSAFE_componentWillMount() {
    fetch("/api/user/protectedRoute", {
      method: "GET",
      headers: {
        "Content-Type": "Applicatiomn/JSON",
      },
      body: JSON.stringify(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === "yes") {
          auth.login(() => {});
          this.setState({ isLoggedIn: true, name: data.user.name });
          // console.log("after setState joinedID", this.state);
        }
      });
  }

  // logout function
  logout() {
    fetch("/api/user/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "Applicatiomn/JSON",
      },
      body: JSON.stringify(),
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ isLoggedIn: false, name: "" });
      });
  }

  render() {
    console.log("is userLoggedIn? ", this.state.isLoggedIn, this.state.user);
    return (
      <div className="container">
        <BrowserRouter>
          <div className="content">
            <div className="nav_user">
              <div className="nav_item">
                <Link to="/">
                  <img
                    src="/assets/logo.png"
                    alt="logo"
                    className="nav_item logo"
                  />
                </Link>
                {this.state.isLoggedIn && (
                  <p className="user"> Welcome {this.state.name}</p>
                )}
              </div>
              {this.state.isLoggedIn && (
                <div className="nav_item nav_item_flex">
                  <Link to="/" className="usernav_item nav_active">
                    All groups
                  </Link>
                  <Link to="my_groups" className="usernav_item">
                    My groups
                  </Link>
                  <a href="#" className="usernav_item">
                    Profile
                  </a>
                </div>
              )}

              <div className="nav_item u-right">
                <Link to="/login" className="nav_item" onClick={this.logout}>
                  {this.state.isLoggedIn ? "Signout" : "Sign up / Log in"}
                </Link>
              </div>
            </div>

            <Switch>
              <ProtectedRoute
                exact
                path="/group/:id"
                component={GroupDetails}
              />
              <Route exact path="/login">
                <LoginForm toLogin={this.toLogin} />
                <SignupForm toLogin={this.toLogin} />
              </Route>
              <ProtectedRoute exact path="/my_groups" component={MyGroups} />

              <ProtectedRoute exact path="/create" component={CreateGroup} />
              {/* <Route
                exact
                path="/groups"
                render={(props) => (
                  <Groups {...props} isLoggedIn={this.state.isLoggedIn} />
                )}
              /> */}
              <Route
                exact
                path="/"
                render={(props) => (
                  <Groups {...props} isLoggedIn={this.state.isLoggedIn} />
                )}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
