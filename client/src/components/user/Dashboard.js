import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Username is  ' + username);
    console.log('Password is ' + password);
    let result = await fetch(
    'http://localhost:8082/login', {
        method: "post",
        body: JSON.stringify({ username, password }),
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
        alert("Bad username/password");
      }
      else {
        alert("Login successful");
        window.location.replace("/dashboard");
      }
    }).catch(error => {
      console.error(error);
    }).finally(() => {
    });
}

  return (
    <div className="Dashboard">
      <Form onSubmit={handleSubmit}>
        <h3>Dashboard</h3>
      </Form>
    </div>
  );
}