import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Nav, NavItem, NavLink } from "reactstrap";
import { withRouter } from "react-router";
import { Navbar } from "react-bootstrap";

import './App.css';

import Login from "./components/user/Login";
import "./components/user/Login.css";

import Register from "./components/user/Register";
import "./components/user/Register.css";

import Recovery from "./components/user/Recovery";
import "./components/user/Recovery.css";

import PasswordReset from "./components/user/PasswordReset";

import Dashboard from "./components/user/Dashboard";
import "./components/user/Dashboard.css";

import Dategraph from './components/graph/dategraph';
import Diabgraph from './components/graph/diabgraph';

function Logout() {
  localStorage.clear();
  window.location.href = '/';
}

class App extends Component {
  render() {
    this.state = { user: false};
    const { location } = this.props;

    const HomeRoute = ({ isLoggedIn, component: RouteComponent, redirectPath }) =>
    isLoggedIn
    ? <RouteComponent />
    : <Navigate to='/login' />

    const PrivateRoute = ({ isLoggedIn, component: RouteComponent, redirectPath }) =>
      isLoggedIn
      ? <RouteComponent />
      : <Navigate to='/' />

    return (
      <Router>
        <div className="App">

          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand>DiabEasy</Navbar.Brand>
            <Nav pills activeKey={window.location.pathname} className="mr-auto">
              <NavItem>
                <NavLink href="/dategraph">Test DateGraph</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/diabgraph">Test Diabgraph</NavLink>
              </NavItem>
            </Nav>
            

            <Nav pills activeKey={window.location.pathname} className="ml-auto">
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/register">Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled href="/about">About us</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={Logout}>Logout</NavLink>
              </NavItem>
            </Nav>
          </Navbar>

          <Routes>
            <Route exact path='/' element={< HomeRoute isLoggedIn={localStorage.getItem('user')} component={Dashboard} />} />
            <Route exact path='/login' element={< PrivateRoute isLoggedIn={!localStorage.getItem('user')} component={Login} />} />
            <Route exact path='/register' element={< PrivateRoute isLoggedIn={!localStorage.getItem('user')} component={Register} />} />
            <Route exact path='/recovery' element={< Recovery />} />
            <Route exact path='/password-reset' element={< PasswordReset />} />
            <Route exact path='/dategraph' element={< Dategraph />} />
            <Route exact path='/diabgraph' element={< Diabgraph />} />
            <Route path='/dashboard' element={< PrivateRoute isLoggedIn={localStorage.getItem('user')} component={Dashboard} />} />
          </Routes>

        </div>
      </Router>
    );
  }
}

export default App;