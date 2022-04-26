import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Recovery.css";


export default function Login() {
  const [email, setEmail] = useState("");

  function validateForm() {
    var validForm = ( email.length > 0);
    return validForm;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email is ' + email);
    let result = await fetch(
    'http://localhost:8082/recovery', {
        method: "post",
        body: JSON.stringify({ email }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
      if (response.ok) {
          return response.json();
      }
      throw response;
    }).then(data => {
      if (data === false) {
        alert("Couldn't find an account with that email address.");
      }
      else {
        alert("Recovery email sent! TODO: actually send recovery email!");
      }
    }).catch(error => {
      console.error(error);
    }).finally(() => {
    });
}

  return (
    <div className="Recovery">
      <Form onSubmit={handleSubmit}>
        <h3>Enter recovery email</h3>
        <Form.Group size="lg" controlId="email">
          <Form.Label></Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Group>
        <br></br>

        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>

        <p class="message">Not registered? <a href="/register">Create an account</a></p>
      </Form>
    </div>
  );
}