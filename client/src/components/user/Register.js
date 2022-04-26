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
  const [data, setData] = useState(null);

  function validateForm() {
    var validForm = (username.length > 0 && password.length > 0 && email.length > 0) && (password === passwordConfirm);
    var link = document.getElementById('validForm');
    //<!-- <p class="validForm" style="visibility:hidden;">Username/Passwords are too short or passwords do not match!</p> -->
    /*if (!validForm){
      //Hide HTML element referenced from: https://stackoverflow.com/questions/2420135/hide-html-element-by-id
      //link.style.visibility = 'hidden';
    }
    else{
      link.style.visibility = 'visible';
    }*/
    return validForm;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email is " + email);
    console.log('Username is  ' + username);
    console.log('Password is ' + password);
    const result = await fetch(
    'http://localhost:8082/register', {
        method: "post",
        body: JSON.stringify({ username, password, email }),
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
            alert("Username or email already in use");
        }
        else {
            alert("Registration successful");
        }
    }).catch(error => {
        console.error(error);
    }).finally(() => {
    });
}

  return (
    <div className="Register">
      <Form onSubmit={handleSubmit}>
        <h3>Create An Account</h3>
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