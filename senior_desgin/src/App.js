import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import createUser from './componets/createUser'


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={createUser} />

        </div>
      </Router>
    );
  }
}

export default App;