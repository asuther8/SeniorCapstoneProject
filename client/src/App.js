import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from "reactstrap";
import { withRouter } from "react-router";
import { Navbar } from "react-bootstrap";


import './App.css';

import Login from "./components/user/Login";
import "./components/user/Login.css";

import Register from "./components/user/Register";
import "./components/user/Register.css";

import Dategraph from './components/graph/dategraph';

class App extends Component {
  render() {
    const { location } = this.props;
    return (
      <Router>
        <div className="App">

          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand>DiabEasy</Navbar.Brand>
            <Nav pills activeKey={window.location.pathname} className="mr-auto">
              <NavItem>
                <NavLink href="/dategraph">Test DateGraph</NavLink>
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
            </Nav>
          </Navbar>

         <Routes>
            <Route exact path='/' element={< Login />}> </Route>
            <Route exact path='/login' element={< Login />}> </Route>
            <Route exact path='/register' element={< Register />}> </Route>
            <Route exact path='/dategraph' element={< Dategraph />}> </Route>
          </Routes>

        </div>
      </Router>
    );
  }
}

export default App;