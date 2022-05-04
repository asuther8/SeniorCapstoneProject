import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Dashboard.css";


export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [username, getUsername] = useState(localStorage.getItem('user'));

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    let result = await fetch(
    'http://localhost:8082/upload', {
        method: "post",
        body: JSON.stringify({ username }),
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
        alert("Upload error");
      }
      else {
        alert("Upload successful");
        //window.location.replace("/dashboard");
      }
    }).catch(error => {
      console.error(error);
    }).finally(() => {
    });
}

  return (
    <div className="Dashboard">
      <Form onSubmit={handleSubmitFile}>
        <h3>Dashboard</h3>
        <Button block size="lg" type="submit">
          Upload
        </Button>
      </Form>
    </div>
  );
}