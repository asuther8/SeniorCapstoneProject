import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Recovery.css";


export default function Login() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function validateForm() {
    var validForm = ( (password.length > 0) && (password === passwordConfirm));
    return validForm;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log('Email is ' + email);
    //Get query parameters referenced from: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    let queryID = params.userID;
    let queryToken = params.token;
    alert("Attempting password reset with ID:" + queryID + " and token:" + queryToken);
    let result = await fetch(
    `http://localhost:8082/password-reset/`, {
        method: "post",
        body: JSON.stringify({ password }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        query:{
          "userID": [queryID],
          "token": [queryToken]
        }
    }).then(response => {
      if (response.ok) {
          return response.json();
      }
      throw response;
    }).then(data => {
      if (data === false) {
        alert("Invalid/expired password reset link.");
      }
      else {
        alert("New password has been set! You may now use it to log in.");
      }
    }).catch(error => {
      console.error(error);
    }).finally(() => {
    });
}

  return (
    <div className="Recovery">
      <Form onSubmit={handleSubmit}>
        <h3>Enter new password</h3>
        <Form.Group size="lg" controlId="password">
          <Form.Label></Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group size="lg" controlId="passwordConfirm">
          <Form.Label></Form.Label>
          <Form.Control
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm Password"
          />
        </Form.Group>
        <br></br>

        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Send
        </Button>

        <p class="message">Not registered? <a href="/register">Create an account</a></p>
      </Form>
    </div>
  );
}