import React, { Component } from 'react';
import './App.css';
import { Segment } from 'semantic-ui-react';

import Router from './Components/Router';
import Menu from './Components/menu';

class App extends Component {
  render() {
    return (
      <Segment inverted >
        <Menu />
        <Router />
      </Segment>
    );
  }
}

export default App;
