import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
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
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <h3>Sign In</h3>
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
        <Form.Group size="lg" controlId="password">
          <Form.Label></Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        
        <div className="forgot">
          <a href="/recovery">Forgot your password?</a>
        </div>
        <br></br>

        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>

        <p class="message">Not registered? <a href="/register">Create an account</a></p>
      </Form>
    </div>
  );
}