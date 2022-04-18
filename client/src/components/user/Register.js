import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Register.css";


export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function validateForm() {
    return (username.length > 0 && password.length > 0) && (password === passwordConfirm);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post("/api/")
    let result = await fetch(
    'http://localhost:8082/api/user', {
        method: "post",
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    result = await result.json();
    console.warn(result);
    if (result) {
        alert("Data saved successfully");
        setUsername("");
        setPassword("");
    }
}

  return (
    <div className="Register">
      <Form onSubmit={handleSubmit}>
        <h3>Create An Account</h3>
        <Form.Group size="lg" controlId="username">
          <Form.Label></Form.Label>
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </Form.Group>
        <br></br>
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
          Register
        </Button>

        <p class="message">Already have an account? <a href="/login">Sign In</a></p>
      </Form>
    </div>
  );
}